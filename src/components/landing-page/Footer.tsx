import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="container mx-auto flex flex-col gap-2 sm:flex-row py-6 w-full items-center border-t">
      <p className="text-xs text-muted-foreground ">
        &copy; {new Date().getFullYear()} Woxst AB. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="#" className="text-xs hover:underline underline-offset-4">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Privacy Policy
        </Link>
      </nav>
    </div>
  );
}

export default Footer;
