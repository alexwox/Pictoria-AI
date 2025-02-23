import React, { useId } from "react";

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
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { deleteImage } from "@/app/actions/image-actions";
import { cn } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Router } from "next/router";

interface DeleteImageProps {
  imageId: string;
  onDelete?: () => void;
  className?: string;
  imageName: string;
}

function DeleteImage({
  imageId,
  onDelete,
  className,
  imageName,
}: DeleteImageProps) {
  const toastId = useId();

  const handleDelete = async () => {
    toast.loading("Deleting the image...", { id: toastId });
    const { error, success } = await deleteImage(imageId, imageName);

    if (error) {
      toast.error(error, { id: toastId });
    } else if (success) {
      toast.success("Image deleted successfully", { id: toastId });
      onDelete?.();
      window.location.reload();
    } else {
      toast.dismiss(toastId);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={cn("w-fit", className)} variant={"destructive"}>
          <Trash2Icon className="w-4 h-4 mr-2" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            image.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteImage;
