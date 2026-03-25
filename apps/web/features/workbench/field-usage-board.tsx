"use client";

import { Activity, Anchor, Clock3, EyeOff } from "lucide-react";

import { Pill } from "@dynecho/ui";

import type { WorkbenchFieldStatus, WorkbenchFieldStatusKind } from "./workbench-field-status";
import { formatWorkbenchFieldStatusLabel } from "./workbench-field-status";

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

function getGroupCopy(kind: WorkbenchFieldStatusKind): {
  description: string;
  icon: typeof Activity;
  pillTone: "accent" | "neutral" | "success" | "warning";
  title: string;
  wrapperClassName: string;
} {
  switch (kind) {
    case "active":
      return {
        description: "Inputs directly shaping the current result.",
        icon: Activity,
        pillTone: "success",
        title: "Driving this solve",
        wrapperClassName: "border-[color:var(--success)]/40 bg-[color:var(--success-soft)]/75"
      };
    case "anchored":
      return {
        description: "Inputs held by an explicit source or clean assumption.",
        icon: Anchor,
        pillTone: "accent",
        title: "Anchored by source",
        wrapperClassName: "border-[color:var(--accent)]/35 bg-[color:var(--accent-soft)]/70"
      };
    case "conditional":
      return {
        description: "Prepared inputs waiting for an upstream lane or missing companion data.",
        icon: Clock3,
        pillTone: "warning",
        title: "Waiting on context",
        wrapperClassName: "border-[color:var(--warning)]/35 bg-[color:var(--warning-soft)]/72"
      };
    case "ignored":
      return {
        description: "Inputs parked outside the current lane.",
        icon: EyeOff,
        pillTone: "neutral",
        title: "Parked now",
        wrapperClassName: "border-[color:var(--line)] bg-black/[0.03]"
      };
  }
}

function countByKind(items: readonly FieldUsageBoardItem[], kind: WorkbenchFieldStatusKind): number {
  return items.filter((item) => item.guide.kind === kind).length;
}

export function FieldUsageBoard({ description, items, title }: FieldUsageBoardProps) {
  const engagedCount = items.filter((item) => item.guide.kind === "active" || item.guide.kind === "anchored").length;
  const stagedCount = countByKind(items, "conditional");

  return (
    <div className="rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Input usage map</Pill>
        <Pill tone={engagedCount > 0 ? "success" : "neutral"}>{engagedCount} engaged</Pill>
        <Pill tone={stagedCount > 0 ? "warning" : "neutral"}>{stagedCount} waiting</Pill>
      </div>

      <div className="mt-4">
        <div className="eyebrow">Operator visibility</div>
        <h3 className="mt-2 text-[clamp(1.25rem,1.7vw,1.7rem)] font-display leading-[0.98] tracking-[-0.04em] text-[color:var(--ink)]">
          {title}
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
          {description ??
            "Every field already exposes per-input hover help. This board collects the same contract in one place so you can see which controls are live, anchored, waiting, or parked without scanning the entire chapter."}
        </p>
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {GROUP_ORDER.map((kind) => {
          const entries = items.filter((item) => item.guide.kind === kind);
          const group = getGroupCopy(kind);
          const Icon = group.icon;

          return (
            <section
              className={`rounded-md border px-4 py-4 ${group.wrapperClassName}`}
              key={kind}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/65 text-[color:var(--ink)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{group.title}</div>
                    <p className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">{group.description}</p>
                  </div>
                </div>
                <Pill tone={group.pillTone}>{entries.length}</Pill>
              </div>

              {entries.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {entries.map((item) => (
                    <article
                      className="rounded-md border border-black/8 bg-white/60 px-4 py-3"
                      key={item.id}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-[color:var(--ink)]">{item.label}</div>
                        {item.section ? (
                          <span className="rounded-full border border-black/8 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                            {item.section}
                          </span>
                        ) : null}
                        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                          {formatWorkbenchFieldStatusLabel(item.guide.kind)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{item.guide.currentUse}</p>
                      <p className="mt-2 text-xs leading-6 text-[color:var(--ink-faint)]">
                        <span className="font-semibold text-[color:var(--ink-soft)]">Meaning:</span> {item.guide.meaning}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-[color:var(--ink-soft)]">No inputs are in this posture on the current solve.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
