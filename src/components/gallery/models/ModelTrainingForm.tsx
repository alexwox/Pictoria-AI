"use client";
import React, { useId } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getPresignedStorageUrl } from "@/app/actions/model-actions";

const ACCEPTED_ZIP_FILES = ["application/x-zip-compressed", "application/zip"];
const MAX_FILE_SIZE = 45 * 1024 * 1024;
const formSchema = z.object({
  modelName: z.string({
    required_error: "Model name is required!",
  }),
  gender: z.enum(["man", "woman"]),
  zipFile: z
    .any()
    .refine(
      (files) => files?.[0] instanceof File,
      "Please select a valid file."
    )
    .refine(
      (files) =>
        files?.[0]?.type && ACCEPTED_ZIP_FILES.includes(files?.[0]?.type),
      "Only zip files are accepted."
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size allowed is 45 mb."
    ),
});

type Props = {};

function ModelTrainingForm({}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: "",
      zipFile: undefined,
      gender: "man",
    },
  });

  const fileRef = form.register("zipFile");
  const toastId = useId();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Uploading file", { id: toastId });

    try {
      const data = await getPresignedStorageUrl(values.zipFile[0].name);
      console.log(data);
      if (data.error) {
        toast.error(data.error || "Failed to upload the file", { id: toastId });
        return;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start training!";
      toast.error(errorMessage, {
        id: toastId,
        duration: 5000,
      });
    }

    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset className="grid max-w-5xl bg-background p-8 rounded-lg gap-6 border">
          <FormField
            control={form.control}
            name="modelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter model name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be the name of your trained model.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Please select the gender of the images</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="man" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="woman" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Training Data (Zip File) |&nbsp;
                  <span className="text-destructive">
                    Read the Requirements below.
                  </span>
                </FormLabel>
                <div className="mb-4 rounded-lg shadow-sm pb-4 text-card-foreground">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Provide 10, 12 or 15 images in total </li>
                    <li>• Ideal breakdown for 12 images:</li>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li> - 6 face closeups - 3/4 half</li>
                      <li> - body closeups (till stomach)</li>
                      <li> - 2/3 full body shots</li>
                    </ul>
                    <li>• No accessories on face/head ideally</li>
                    <li>• No other people in images</li>
                    <li>
                      • Different expressions, clothing, backgrounds with good
                      lighting
                    </li>
                    <li>
                      • Images to be in 1:1 resolution (1048x1048 or higher)
                    </li>
                    <li>
                      • Use images of similar age group (ideally within past few
                      months)
                    </li>
                    <li>• Provide only zip file (under 45MB size)</li>
                  </ul>
                </div>
                <FormControl>
                  <Input
                    type="file"
                    accept=".zip"
                    {...fileRef}
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormDescription>
                  Upload a zip-file containing your training imaged (max 45mb).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-fit">
            Submit
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}

export default ModelTrainingForm;
