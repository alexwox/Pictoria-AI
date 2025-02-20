"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
/*
const input = {
    prompt: "a cat holding a sign that says Pictoria AI",
    go_fast: true,
    guidance: 3.5,
    megapixels: "1",
    num_outputs: 1,
    aspect_ratio: "1:1",
    output_format: "webp",
    output_quality: 80,
    prompt_strength: 0.8,
    num_inference_steps: 28
  };
*/

const formSchema = z.object({
  model: z.string({
    required_error: "Model is required!",
  }),
  prompt: z.string({
    required_error: "Model is required!",
  }),
  guidance: z.number({
    required_error: "Guidance scale is required!",
  }),
  num_outputs: z
    .number()
    .min(1, { message: "Number of outputs should be at least 1." })
    .max(4, { message: "Number of outputs must be less than 4." }),
  aspect_ratio: z.string({
    required_error: "Aspect ratio is required!",
  }),
  output_format: z.string({
    required_error: "Output format is required!",
  }),
  output_quality: z
    .number()
    .min(1, { message: "Output quality must be at least 1." })
    .max(100, { message: "Output quality can at most be 100." }),
  num_inference_steps: z
    .number()
    .min(1, { message: "You need at least one inference step." })
    .max(50, { message: "Number of inference steps can at most be 50." }),
});

function Configurations() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "black-forest-labs/flux-dev",
      prompt: "",
      guidance: 3.5,
      num_outputs: 1,
      output_format: "jpg",
      aspect_ratio: "1:1",
      output_quality: 80,
      num_inference_steps: 28,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default Configurations;
