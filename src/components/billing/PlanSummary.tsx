import { Tables } from "@datatypes.types";
import { User } from "@supabase/supabase-js";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

type Product = Tables<"products">;
type Prices = Tables<"prices">;
type Subscription = Tables<"subscriptions">;

interface ProductWithPrices extends Product {
  prices: Prices[];
}

interface PriceWithProduct extends Prices {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface PlanSummaryProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  products: ProductWithPrices[] | null;
}

function PlanSummary({ user, subscription, products }: PlanSummaryProps) {
  if (!subscription || subscription.status !== "active") {
    return (
      <Card>
        <CardContent>
          <h3>
            <span>Plan Summary</span>
            <Badge>No Plan</Badge>
          </h3>
        </CardContent>
      </Card>
    );
  }
  return <div>PlanSummary</div>;
}

export default PlanSummary;
