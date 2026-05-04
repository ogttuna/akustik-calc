"use client";

import type { ReactNode } from "react";

import { Pill } from "@dynecho/ui";

type WorkbenchChapterProps = {
  children: ReactNode;
  description: string;
  id: string;
  index: string;
  statusLabel?: string;
  statusTone?: "accent" | "neutral" | "success" | "warning";
  title: string;
  eyebrow?: string;
};

export function WorkbenchChapter({
  children,
  description,
  eyebrow,
  id,
  index,
  statusLabel,
  statusTone = "neutral",
  title
}: WorkbenchChapterProps) {
  return (
    <section className="workbench-chapter scroll-mt-28" id={id}>
      <div className="workbench-chapter-header">
        <div className="workbench-chapter-index">{index}</div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="eyebrow">{eyebrow ?? "Workbench chapter"}</div>
              <h2 className="mt-2 text-[1.55rem] font-display leading-tight text-[color:var(--ink)] md:text-[1.8rem]">
                {title}
              </h2>
            </div>
            {statusLabel ? <Pill tone={statusTone}>{statusLabel}</Pill> : null}
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">{description}</p>
        </div>
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}
