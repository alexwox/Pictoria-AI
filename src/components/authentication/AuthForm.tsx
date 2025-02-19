"use client";
import React from "react";
import { useState } from "react";
import LoginForm from "./LoginForm";

const AuthForm = () => {
  const [mode, setMode] = useState("login");
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "reset"
            ? "Reset Password"
            : mode === "login"
            ? "Login"
            : "Sign up"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "reset"
            ? "Enter your email below to reset your password"
            : mode === "login"
            ? "Enter your email below to log into your account"
            : "Enter your information below to create an account"}
        </p>
      </div>
      {mode === "login" && (
        <span>
          <LoginForm />
        </span>
      )}
      {mode === "signup" && <span> SignUp Form</span>}
      {mode === "reset" && <span> Reset Password Form</span>}
    </div>
  );
};

export default AuthForm;
