"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@datatypes.types";
import Link from "next/link";
import React, { useId } from "react";
import { formatDistance } from "date-fns";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2Icon,
  Trash2Icon,
  User2,
  XCircle,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteModel } from "@/app/actions/model-actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ModelType = {
  error: string | null;
  success: boolean;
  data: Database["public"]["Tables"]["models"]["Row"][] | null;
};

interface ModelsListProps {
  models: ModelType;
}

function ModelsList({ models }: ModelsListProps) {
  const { data, success, error } = models;
  const router = useRouter();

  const toastId = useId();
  const handleDeleteModel = async (
    id: number,
    model_id: string,
    model_version: string
  ) => {
    toast.loading("Deleting model...", { id: toastId });
    const { success, error } = await deleteModel(id, model_id, model_version);
    if (error) {
      toast.error(error, { id: toastId });
    }

    if (success) {
      toast.success("Model deleted successfully", { id: toastId });
      router.refresh();
    }
  };

  if (data?.length === 0) {
    return (
      <Card className="flex h-[450px] flex-col items-center justify-center text-center">
        <CardHeader>
          <CardTitle>No Models Found</CardTitle>
          <CardDescription>
            You have not trained any models yet. Start by creating a new model.
          </CardDescription>
          <Link href="/model-training" className="inline-block pt-2">
            <Button className="w-fit">Create Model</Button>
          </Link>
        </CardHeader>
      </Card>
    );
  }
  return (
    <div className="grid gap-6 grid-cols-3">
      {data?.map((model) => (
        <Card key={model.id} className="relative flex flex-col overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle> {model.model_name} </CardTitle>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  {model.training_status === "succeeded" ? (
                    <div className="flex items-center gap-1 text-sm text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="capitalize"> Ready</span>
                    </div>
                  ) : model.training_status === "canceled" ? (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <XCircle className="w-4 h-4" />
                      <span className="capitalize">
                        {" "}
                        {model.training_status}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                      <Loader2Icon className="w-4 h-4 animate-spin" />
                      <span className="capitalize"> Training</span>
                    </div>
                  )}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="w-8 h-8 text-destructive/90 hover:text-destructive"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Model</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your model from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          handleDeleteModel(
                            model.id,
                            model.model_id || "",
                            model.version || ""
                          )
                        }
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <CardDescription>
              Created{" "}
              {formatDistance(new Date(model.created_at), new Date(), {
                addSuffix: true,
              })}
            </CardDescription>
            <CardContent className="flex-1 p-0 pt-3">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span> Training Duration</span>
                    </div>
                    <p className="mt-1 font-medium">
                      {Math.round(Number(model.training_time) / 60) || NaN} mins
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User2 className="w-4 h-4" />
                      <span> Gender </span>
                    </div>
                    <p className="mt-1 font-medium">{model.gender}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="pt-4">
              <Link
                href={
                  model.training_status === "succeeded"
                    ? `image-generation?model_id=${model.model_id}:${model.version}`
                    : "#"
                }
                className={cn(
                  "inline-flex w-full group",
                  model.training_status !== "succeeded" &&
                    "pointer-events-none opacity-50"
                )}
              >
                <Button
                  className="w-full group-hover:bg-primary/90"
                  disabled={model.training_status !== "succeeded"}
                >
                  Generate images <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default ModelsList;
