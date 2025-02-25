import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("Webhook is working", request);
    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Webhook processing error.");
    return NextResponse.json(
      {
        error: error.message ?? "Internal server error",
      },
      { status: 500 }
    );
  }
}
