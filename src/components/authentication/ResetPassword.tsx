"use client";
import React, { useId } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { resetPassword } from "@/app/actions/auth-actions";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

function ResetPassword({ className }: { className?: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const toastId = useId();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Sending password reset email...", { id: toastId });

    try {
      const { success } = await resetPassword({
        email: values.email || "",
      });
      if (!success) {
        toast.error(
          "There was an error sending the &apos; reset password email'. Contact support. ",
          { id: toastId }
        );
      } else {
        toast.success(
          "Reset password email has been sent. Please check your email. ",
          { id: toastId }
        );
      }
    } catch (_error) {
      toast.error(
        "There was an error sending the &apos; reset password email'. Contact support. ",
        { id: toastId }
      );
    }
  };
  return (
    <div className={cn("grid gap-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ResetPassword;
