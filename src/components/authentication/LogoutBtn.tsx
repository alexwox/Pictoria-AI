"use client";
import { logout } from "@/app/actions/auth-actions";
import React from "react";

function logoutButton() {
  const handleLogout = async () => {
    await logout();
  };
  return (
    <span
      onClick={handleLogout}
      className="inline-block w-full cursor-pointer text-destructive"
    >
      Logout
    </span>
  );
}

export default logoutButton;
