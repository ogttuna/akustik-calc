"use client";

import { Compass, LayoutTemplate, Sparkles, Target } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import {
  getCriteriaPackById,
  CRITERIA_PACKS,
  type CriteriaPackId
} from "./criteria-packs";
import { REQUESTED_OUTPUT_LABELS } from "./workbench-data";

type CriteriaPackPanelProps = {
  activeCriteriaPackId: CriteriaPackId;
  onApplyCriteriaPack: (criteriaPackId: CriteriaPackId) => void;
};

export function CriteriaPackPanel({
  activeCriteriaPackId,
  onApplyCriteriaPack
}: CriteriaPackPanelProps) {
  const activePack = getCriteriaPackById(activeCriteriaPackId);

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <LayoutTemplate className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Brief templates</div>
          <h2 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.04em]">Criteria packs</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            Acoustic work rarely starts from a blank sheet. These packs preload targets and output families, then let
            the team tune from there.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="accent">{activePack.label}</Pill>
          <Pill tone="neutral">{activePack.audience}</Pill>
        </div>
        <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{activePack.description}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border hairline bg-[color:var(--paper)] px-4 py-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              <Target className="h-3.5 w-3.5" />
              Headline targets
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full border hairline px-3 py-1.5">
                Rw {activePack.targetRwDb || "Unset"}
              </span>
              <span className="rounded-full border hairline px-3 py-1.5">
                Ln,w {activePack.targetLnwDb || "Unset"}
              </span>
            </div>
          </div>
          <div className="rounded-md border hairline bg-[color:var(--paper)] px-4 py-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              <Sparkles className="h-3.5 w-3.5" />
              Emphasis
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {activePack.emphasis.map((item) => (
                <Pill key={item} tone="neutral">
                  {item}
                </Pill>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-[color:var(--ink-soft)]">{activePack.note}</p>
      </div>

      <div className="mt-5 grid gap-3">
        {CRITERIA_PACKS.map((pack) => {
          const isActive = pack.id === activeCriteriaPackId;

          return (
            <button
              className={`focus-ring rounded-md border px-4 py-4 text-left transition ${
                isActive
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
                  : "hairline bg-[color:var(--paper)] hover:bg-black/[0.03]"
              }`}
              key={pack.id}
              onClick={() => onApplyCriteriaPack(pack.id)}
              type="button"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{pack.label}</div>
                  <div
                    className={`mt-1 text-xs uppercase tracking-[0.16em] ${
                      isActive ? "text-[color:var(--accent-ink)]/70" : "text-[color:var(--ink-faint)]"
                    }`}
                  >
                    {pack.audience}
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                  <Compass className="h-3.5 w-3.5" />
                  {isActive ? "Active pack" : "Apply pack"}
                </div>
              </div>
              <p className={`mt-3 text-sm leading-7 ${isActive ? "text-[color:var(--accent-ink)]/82" : "text-[color:var(--ink-soft)]"}`}>
                {pack.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {pack.requestedOutputs.map((output) => (
                  <span
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                      isActive ? "border-[color:var(--accent)]/20" : "hairline"
                    }`}
                    key={output}
                  >
                    {REQUESTED_OUTPUT_LABELS[output]}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg border hairline bg-black/[0.025] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
        These are internal brief templates, not jurisdictional code defaults. Apply one to start faster, then tune the
        targets or requested outputs to match the actual project brief.
      </div>
    </SurfacePanel>
  );
}
