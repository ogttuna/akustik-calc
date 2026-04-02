"use client";

import { Pill } from "@dynecho/ui";

import type { WorkbenchFieldStatus, WorkbenchFieldStatusKind } from "./workbench-field-status";

export type FieldUsageBoardItem = {
  guide: WorkbenchFieldStatus;
  id: string;
  label: string;
  section?: string;
};

type FieldUsageBoardProps = {
  description?: string;
  items: readonly FieldUsageBoardItem[];
  title: string;
};

const GROUP_ORDER: readonly WorkbenchFieldStatusKind[] = ["active", "anchored", "conditional", "ignored"];

function getGroupTone(kind: WorkbenchFieldStatusKind): "accent" | "neutral" | "success" | "warning" {
  switch (kind) {
    case "active":
      return "success";
    case "anchored":
      return "accent";
    case "conditional":
      return "warning";
    case "ignored":
      return "neutral";
  }
}

function getGroupLabel(kind: WorkbenchFieldStatusKind): string {
  switch (kind) {
    case "active":
      return "Driving";
    case "anchored":
      return "Anchored";
    case "conditional":
      return "Waiting";
    case "ignored":
      return "Parked";
  }
}

function countByKind(items: readonly FieldUsageBoardItem[], kind: WorkbenchFieldStatusKind): number {
  return items.filter((item) => item.guide.kind === kind).length;
}

export function FieldUsageBoard({ items, title }: FieldUsageBoardProps) {
  const engagedCount = items.filter((item) => item.guide.kind === "active" || item.guide.kind === "anchored").length;
  const stagedCount = countByKind(items, "conditional");

  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-[color:var(--ink)]">{title}</div>
        <div className="flex gap-2">
          <Pill tone={engagedCount > 0 ? "success" : "neutral"}>{engagedCount} engaged</Pill>
          <Pill tone={stagedCount > 0 ? "warning" : "neutral"}>{stagedCount} waiting</Pill>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {GROUP_ORDER.map((kind) => {
          const entries = items.filter((item) => item.guide.kind === kind);
          const tone = getGroupTone(kind);
          const label = getGroupLabel(kind);

          if (entries.length === 0) {
            return null;
          }

          return (
            <section key={kind}>
              <div className="flex items-center gap-2 pb-2">
                <Pill tone={tone}>{label}</Pill>
                <div className="h-px flex-1 bg-[color:var(--line)]" />
                <span className="text-[0.66rem] tabular-nums text-[color:var(--ink-faint)]">{entries.length}</span>
              </div>
              <div className="grid gap-1">
                {entries.map((item) => (
                  <div className="flex items-baseline justify-between gap-3 rounded-md bg-[color:var(--panel)] px-3 py-2" key={item.id}>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[0.78rem] font-semibold text-[color:var(--ink)]">{item.label}</span>
                        {item.section ? (
                          <span className="text-[0.64rem] font-medium uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
                            {item.section}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">{item.guide.currentUse}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
