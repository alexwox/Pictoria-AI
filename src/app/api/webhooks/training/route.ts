import { NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-templates/EmailTemplate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  console.log("Webhook is working, endpoint called:", request);
  try {
    console.log("In the try block....");
    const body = await request.json();
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId") ?? "";
    const modelName = url.searchParams.get("modelName") ?? "";
    const fileName = url.searchParams.get("fileName") ?? "";

    const id = request.headers.get("webhook-id") ?? "";
    const timestamp = request.headers.get("webhook-timestamp") ?? "";
    const webhookSignature = request.headers.get("webhook-signature") ?? "";

    //Validate the webhook
    const signedContent = `${id}.${timestamp}.${JSON.stringify(body)}`;
    const secret = await replicate.webhooks.default.secret.get();

    const secretBytes = Buffer.from(secret.key.split("_")[1], "base64");
    const computedSignature = crypto
      .createHmac("sha256", secretBytes)
      .update(signedContent)
      .digest("base64");

    const expectedSignatures = webhookSignature
      .split(" ")
      .map((sig) => sig.split(",")[1]);
    const isValid = expectedSignatures.some(
      (expectedSignature) => expectedSignature === computedSignature
    );

    console.log("Completed to isValid: ", isValid);
    if (!isValid) {
      return new NextResponse("Invalid Signature", { status: 401 });
    }

    //Get user data
    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const userEmail = user.user.email ?? "";
    const userName = user.user.user_metadata.full_name ?? "";

    console.log("Before if statement...: ", { userEmail, userName });
    if (body.status === "succeeded") {
      console.log("In IF, succeeded:", body.status);
      // send a successfull status email
      await resend.emails.send({
        from: "Pictoria AI <hi@woxab.ai>",
        to: [userEmail],
        subject: "Model Training Completed",
        react: EmailTemplate({
          userName,
          message: "Your model training has been completed",
        }),
      });
      // Upade supabase models table
      console.log("In IF, succeeded, updating supabase...");
      await supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
          training_time: body.metrics?.total_time ?? null,
          version: body.output?.version.split(":")[1] ?? null,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);
    } else {
      // Handle failed + cancel states
      await resend.emails.send({
        from: "Pictoria AI <hi@woxab.ai>",
        to: [userEmail],
        subject: `Model Training ${body.status}`,
        react: EmailTemplate({
          userName,
          message: `Your model training is ${body.status}.`,
        }),
      });
      // Upade supabase models table
      console.log("In IF, failed/cancelled, updating supabase...");
      await supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);

      //GEt old credits
      const { data: oldCredits, error } = await supabaseAdmin
        .from("credits")
        .select("model_training_count")
        .eq("user_id", userId)
        .single();

      if (error) {
        throw new Error("Error getting user credits");
      }

      //Update the credits
      await supabaseAdmin
        .from("credits")
        .update({ model_training_count: oldCredits.model_training_count + 1 })
        .eq("user_id", userId)
        .single();
    }

    // Delete training data from supabase storage
    console.log("After IF, remove training data from supabase...");
    await supabaseAdmin.storage.from("training_data").remove([`${fileName}`]);
    console.log(NextResponse.json("OK", { status: 200 }));
    return NextResponse.json("OK", { status: 200 });
  } catch (error: unknown) {
    console.error("Webhook processing error.");
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message ?? "Internal server error",
        },
        { status: 500 }
      );
    }
  }
}
