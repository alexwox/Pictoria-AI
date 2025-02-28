import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { CreditCard, PlusIcon, Wand2Icon } from "lucide-react";
import { Database } from "@datatypes.types";
import { Badge } from "../ui/badge";

interface RecentModelsProps {
  models: Database["public"]["Tables"]["models"]["Row"][];
}

function RecentModels({ models }: RecentModelsProps) {
  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="">Recent Models</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-4">
          {models.length === 0 ? (
            <p className=""> No models trained yet</p>
          ) : (
            models.map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="">
                  <p className="text-sm font-medium">{model.model_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {model.gender}
                  </p>
                </div>
                <Badge variant={getStatusVariant(model.training_status)}>
                  {model.training_status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentModels;

function getStatusVariant(status: string | null) {
  switch (status) {
    case "succeeded":
      return "default";
    case "processing":
    case "starting":
      return "secondary";
    case "failed":
    case "canceled":
      return "destructive";
    default:
      return "secondary";
  }
}
