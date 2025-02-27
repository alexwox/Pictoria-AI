"use server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@datatypes.types";

interface CreditResponse {
  error: null | string;
  success: boolean;
  data: Tables<"credits"> | null;
}

export async function getCredits(): Promise<CreditResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error: "Unathorized",
      success: false,
      data: null,
    };
  }

  const { data: creditsData, error } = await supabase
    .from("credits")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  if (error) {
    return {
      error: error.message || null,
      success: false,
      data: null,
    };
  }

  return {
    error: null,
    success: true,
    data: creditsData,
  };
}
