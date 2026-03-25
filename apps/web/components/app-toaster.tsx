"use client";

import { useEffect, useState } from "react";

type SonnerToaster = typeof import("sonner").Toaster;

export function AppToaster() {
  const [Toaster, setToaster] = useState<SonnerToaster | null>(null);

  useEffect(() => {
    let active = true;

    void import("sonner").then((module) => {
      if (active) {
        setToaster(() => module.Toaster);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (!Toaster) {
    return null;
  }

  return (
    <Toaster
      closeButton
      position="top-right"
      richColors
      theme="light"
      visibleToasts={4}
    />
  );
}
