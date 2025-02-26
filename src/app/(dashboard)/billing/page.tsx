import PlanSummary from "@/components/billing/PlanSummary";
import { getProducts, getSubscription, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { subscribe } from "diagnostics_channel";
import { redirect } from "next/navigation";
import React from "react";

async function BillingPage() {
  const supabase = await createClient();

  const [user, products, subscription] = await Promise.all([
    getUser(supabase), //Gets the currently authenticated users
    getProducts(supabase), // Gets all the active products with prices
    getSubscription(supabase),
  ]);

  if (!user) {
    return redirect("/login");
  }

  return (
    <section className="container mx-auto space-y-8">
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">Plans & Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      <div className="grid gap-10">
        <PlanSummary
          subscription={subscription}
          user={user}
          products={products || []}
        />
      </div>
    </section>
  );
}

export default BillingPage;
