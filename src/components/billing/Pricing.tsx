"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tables } from "@datatypes.types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { checkoutWithStripe } from "@/lib/stripe/server";
import { getErrorRedirect } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe/client";

type Product = Tables<"products">;
type Price = Tables<"prices">;
type Subscription = Tables<"subscriptions">;

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PriceWithProduct extends Price {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface PricingProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  products: ProductWithPrices[] | null;
  mostPopularProduct: string;
}

const renderPricingButton = ({
  subscription,
  user,
  product,
  price,
  mostPopularProduct,
  handleStripeCheckout,
}: {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  product: ProductWithPrices;
  price: Price;
  mostPopularProduct: string;
  handleStripeCheckout: (price: Price) => Promise<void>;
  handleStripePortalRequest: () => Promise<string>;
}) => {
  // Case 1: User has active subscription for account
  // if (
  //   user &&
  //   subscription &&
  //   subscription.prices?.products?.name?.toLowerCase()
  // )

  if (user && !subscription) {
    return (
      <Button
        variant={
          product.name?.toLocaleLowerCase() === mostPopularProduct.toLowerCase()
            ? "default"
            : "secondary"
        }
        onClick={() => handleStripeCheckout(price)}
        className="mt-8 w-full font-semibold"
      >
        Subscribe
      </Button>
    );
  }
  return null;
};

function Pricing({
  user,
  products,
  mostPopularProduct = "pro",
  subscription,
}: PricingProps) {
  const [billingInterval, setBillingInterval] = useState("month");
  console.log("@Pricing, Products: ", products);
  const router = useRouter();

  const currentPath = usePathname();
  const orderedProducts = [...products!].sort((a, b) => {
    // Find prices for current billing interval
    const priceA = a?.prices?.find((p) => p.interval === billingInterval);
    const priceB = b?.prices?.find((p) => p.interval === billingInterval);

    // Get unit amounts or default to 0 if not found
    const amountA = priceA?.unit_amount || 0;
    const amountB = priceB?.unit_amount || 0;

    // Sort from lowest to highest price
    return amountA - amountB;
  });

  const handleStripeCheckout = async (price: Price) => {
    //console.log("Handling stripe checkout: ", price);

    if (!user) {
      return router.push("/login");
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );
    if (errorRedirect) {
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      return router.push(
        getErrorRedirect(
          currentPath,
          "An unknown error occured",
          "Please try again later or contant support."
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
  };

  const handleStripePortalRequest = async () => {
    return "Portal handler";
  };

  return (
    <section className=" max-w-7xl mx-auto py-16 px-8 w-full flex flex-col">
      <div className="flex justify-center items-center space-x-4 py-8">
        <Label htmlFor="pricing-switch" className="font-semibold text-base">
          Monthly
        </Label>
        <Switch
          id="pricing-switch"
          checked={billingInterval === "year"}
          onCheckedChange={(checked) =>
            setBillingInterval(checked ? "year" : "month")
          }
        />
        <Label htmlFor="pricing-switch" className="font-semibold text-base">
          Yearly
        </Label>
      </div>
      <div className="grid grid-cols-3 place-items-center mx-auto gap-8 space-y-4">
        {orderedProducts.map((product) => {
          const price = product?.prices?.find(
            (price) => price.interval === billingInterval
          );
          if (!price) return null;
          const priceString = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currency!,
            minimumFractionDigits: 0,
          }).format((price?.unit_amount || 0) / 100);
          return (
            <div
              key={product.id}
              className={cn(
                "border bg-background rounded-xl shadow-sm h-fit divide-y divide-border border-border",
                product.name?.toLowerCase() === mostPopularProduct.toLowerCase()
                  ? "border-primary bg-background drop-shadow-md scale-105"
                  : "border-border"
              )}
            >
              <div className="p-6">
                <h2 className="text-2xl leading-6 font-semibold text-foreground flex items-center justify-between">
                  {product.name}
                  {product.name?.toLowerCase() ===
                  mostPopularProduct.toLowerCase() ? (
                    <Badge className="border-border font-semibold">
                      {" "}
                      Most popular{" "}
                    </Badge>
                  ) : null}
                </h2>
                <p className="text-muted-foreground mt-4 text-sm">
                  {product.description}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-foreground">
                    {priceString}
                  </span>
                  <span className="text-base font-medium text-muted-foreground">
                    /{billingInterval}
                  </span>
                </p>
                {renderPricingButton({
                  subscription,
                  user,
                  product,
                  price,
                  mostPopularProduct,
                  handleStripePortalRequest,
                  handleStripeCheckout,
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Pricing;
