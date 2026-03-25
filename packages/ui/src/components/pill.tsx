import type { ReactNode } from "react";

import { cx } from "../lib/cx";

type PillProps = {
  children: ReactNode;
  tone?: "neutral" | "accent" | "warning" | "success";
};

export function Pill({ children, tone = "neutral" }: PillProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded border px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.14em]",
        tone === "neutral" && "border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)]",
        tone === "accent" && "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]",
        tone === "warning" && "border-[color:var(--warning)] bg-[color:var(--warning-soft)] text-[color:var(--warning-ink)]",
        tone === "success" && "border-[color:var(--success)] bg-[color:var(--success-soft)] text-[color:var(--success-ink)]"
      )}
    >
      {children}
    </span>
  );
}
