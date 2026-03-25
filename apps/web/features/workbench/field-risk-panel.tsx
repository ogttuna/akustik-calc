"use client";

import { AlertTriangle, Cable, Construction, LayoutGrid, ShieldCheck, Workflow } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import {
  FIELD_RISK_BY_ID,
  FIELD_RISK_LIBRARY,
  summarizeFieldRisk,
  type FieldRiskId
} from "./field-risk-model";

type FieldRiskPanelProps = {
  fieldRiskIds: readonly FieldRiskId[];
  onToggleFieldRisk: (fieldRiskId: FieldRiskId) => void;
};

const CATEGORY_ICONS = {
  coordination: LayoutGrid,
  field: Construction,
  flanking: Cable,
  procurement: Workflow
} as const;

const LEVEL_LABELS = {
  clear: "Field risk clear",
  elevated: "Field risk elevated",
  high: "Field risk high",
  watch: "Field risk watch"
} as const;

export function FieldRiskPanel({ fieldRiskIds, onToggleFieldRisk }: FieldRiskPanelProps) {
  const summary = summarizeFieldRisk(fieldRiskIds);

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <ShieldCheck className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Field risk board</div>
          <h2 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.04em]">Numbers with buildability context</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            Acoustic decisions need more than calculated outputs. Flag junction, flanking, procurement, and workmanship
            risks so exported briefs do not pretend the desktop estimate is already site-secure.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Pill tone={summary.tone}>{LEVEL_LABELS[summary.level]}</Pill>
        <Pill tone="neutral">{summary.score} risk score</Pill>
        <Pill tone={fieldRiskIds.length > 0 ? "accent" : "success"}>
          {fieldRiskIds.length} active flag{fieldRiskIds.length === 1 ? "" : "s"}
        </Pill>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {FIELD_RISK_LIBRARY.map((risk) => {
          const Icon = CATEGORY_ICONS[risk.category];
          const isActive = fieldRiskIds.includes(risk.id);

          return (
            <button
              aria-pressed={isActive}
              className={`focus-ring rounded-lg border px-4 py-4 text-left transition ${
                isActive
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
                  : "hairline bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              }`}
              key={risk.id}
              onClick={() => onToggleFieldRisk(risk.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold">
                  <Icon className="h-4 w-4" />
                  <span>{risk.label}</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                  {risk.category}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7">{risk.body}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
          <AlertTriangle className="h-4 w-4" />
          Risk reading
        </div>
        <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{summary.summary}</p>
        <div className="mt-4 grid gap-3">
          {summary.actions.map((action) => (
            <div className="rounded-md border hairline bg-[color:var(--paper)] px-4 py-3 text-sm leading-7 text-[color:var(--ink-soft)]" key={action}>
              {action}
            </div>
          ))}
        </div>
        {fieldRiskIds.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {fieldRiskIds.map((fieldRiskId) => (
              <Pill key={fieldRiskId} tone="accent">
                {FIELD_RISK_BY_ID[fieldRiskId].label}
              </Pill>
            ))}
          </div>
        ) : null}
      </div>
    </SurfacePanel>
  );
}
