"use client";

import React, { useEffect, useState } from "react";
import { AuthModal } from "@/components/auth-modal";

export function AuthModalProvider() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    if (typeof window !== "undefined") {
      window.addEventListener("open-auth-modal", handler as any);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("open-auth-modal", handler as any);
      }
    };
  }, []);

  return <AuthModal open={open} onOpenChange={setOpen} />;
}


