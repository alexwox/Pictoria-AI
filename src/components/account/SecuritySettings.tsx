"use client";
import { User } from "@supabase/supabase-js";
import React, { useId } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { resetPassword } from "@/app/actions/auth-actions";

interface SecuritySettingsProps {
  user: User;
}

function SecuritySettings({ user }: SecuritySettingsProps) {
  const toastId = useId();
  async function handleChangePassword() {
    toast.loading("Sending password reset email...", { id: toastId });

    try {
      const { success, error } = await resetPassword({
        email: user.email || "",
      });
      if (!success) {
        toast.error(error, { id: toastId });
      } else {
        toast.success(
          "Reset password email has been sent. Please check your email. ",
          { id: toastId }
        );
      }
    } catch (error: any) {
      toast.error(
        error?.message ||
          "There was an error sending the &apos; reset password email'. Contact support. ",
        { id: toastId }
      );
    }

    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-medium ">Password</h3>
          <p className="text-sm text-muted-foreground">
            Change your password to keep your account secure.
          </p>
          <Button variant={"outline"} onClick={handleChangePassword}>
            Change password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SecuritySettings;
