"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

function readThemeMode(): ThemeMode {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyThemeMode(mode: ThemeMode) {
  document.documentElement.setAttribute("data-theme", mode);
  window.localStorage.setItem("dynecho-theme", mode);
}

export function ThemeModeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");
  const nextMode: ThemeMode = mode === "light" ? "dark" : "light";
  const Icon = mode === "light" ? Sun : Moon;

  useEffect(() => {
    setMode(readThemeMode());

    const observer = new MutationObserver(() => {
      setMode(readThemeMode());
    });

    observer.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
      attributes: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  function toggleMode() {
    applyThemeMode(nextMode);
    setMode(nextMode);
  }

  return (
    <button
      aria-label={`Switch to ${nextMode} mode`}
      className="focus-ring ui-button touch-target"
      onClick={toggleMode}
      title={`Switch to ${nextMode} mode`}
      type="button"
    >
      <Icon className="h-4 w-4" />
      <span>{mode === "light" ? "Light" : "Dark"}</span>
    </button>
  );
}
