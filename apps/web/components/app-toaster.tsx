"use client";

import { useEffect, useState } from "react";

type SonnerToaster = typeof import("sonner").Toaster;
type ToastTheme = "dark" | "light";

function readToastTheme(): ToastTheme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function AppToaster() {
  const [Toaster, setToaster] = useState<SonnerToaster | null>(null);
  const [theme, setTheme] = useState<ToastTheme>("light");

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

  useEffect(() => {
    setTheme(readToastTheme());

    const observer = new MutationObserver(() => {
      setTheme(readToastTheme());
    });

    observer.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
      attributes: true
    });

    return () => {
      observer.disconnect();
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
      theme={theme}
      visibleToasts={4}
    />
  );
}
