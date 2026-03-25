"use client";

import type { ImpactCalculation } from "@dynecho/shared";
import { Cable, Route, ShieldAlert, ShieldCheck } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import { FieldGuide } from "./field-guide";
import type { ParsedImpactFieldPathInput } from "./impact-field-path-input";
import { buildImpactFieldPathGuides } from "./impact-field-path-guides";

type ImpactFieldPathPanelProps = {
  directPathOffsetDb: string;
  flankingPathsInput: string;
  lowerTreatmentReductionDb: string;
  onDirectPathOffsetDbChange: (value: string) => void;
  onFlankingPathsInputChange: (value: string) => void;
  onLowerTreatmentReductionDbChange: (value: string) => void;
  parseError: string | null;
  parsed: ParsedImpactFieldPathInput | null;
  result: ImpactCalculation | null;
};

export function ImpactFieldPathPanel({
  directPathOffsetDb,
  flankingPathsInput,
  lowerTreatmentReductionDb,
  onDirectPathOffsetDbChange,
  onFlankingPathsInputChange,
  onLowerTreatmentReductionDbChange,
  parseError,
  parsed,
  result
}: ImpactFieldPathPanelProps) {
  const guides = buildImpactFieldPathGuides({
    directPathOffsetDb,
    lowerTreatmentReductionDb,
    parsed,
    parseError,
    result
  });
  const directFlankingActive = result?.fieldEstimateProfile === "direct_flanking_energy_sum";

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Field path editor</Pill>
        <Pill tone={directFlankingActive ? "success" : parsed ? "accent" : parseError ? "warning" : "neutral"}>
          {directFlankingActive ? "Direct+flanking active" : parsed ? "Path set ready" : parseError ? "Needs valid JSON" : "Optional expert lane"}
        </Pill>
      </div>

      <div className="mt-5">
        <div className="eyebrow">Room-to-room field transmission</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">Direct and flanking field path</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          This lane is for explicit field-path editing. Instead of treating K as a black-box correction, you can push a direct-path offset, define parallel flanking paths, and optionally add expert penalties or family-aware path bias before the field result is re-rated.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[0.7fr_0.7fr]">
        <FieldGuide
          guide={guides.directOffset}
          hint="Required for the direct+flanking branch. This is not the same as the guide-lane K input."
          inputId="impact-direct-path-offset-db"
          label="Direct path offset (dB)"
        >
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-direct-path-offset-db"
            inputMode="decimal"
            onChange={(event) => onDirectPathOffsetDbChange(event.target.value)}
            placeholder="e.g. 1"
            value={directPathOffsetDb}
          />
        </FieldGuide>
        <FieldGuide
          guide={guides.lowerTreatmentReduction}
          hint="Optional direct-path ΔLd. Applied only to the direct path before the energy sum."
          inputId="impact-lower-treatment-reduction-db"
          label="Direct-path ΔLd (dB)"
        >
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-lower-treatment-reduction-db"
            inputMode="decimal"
            onChange={(event) => onLowerTreatmentReductionDbChange(event.target.value)}
            placeholder="optional"
            value={lowerTreatmentReductionDb}
          />
        </FieldGuide>
      </div>

      <div className="mt-5">
        <FieldGuide
          guide={guides.flankingPaths}
          hint="JSON array. Each row needs id + levelOffsetDb. Optional expert fields can raise or reduce the path."
          inputId="impact-flanking-paths-json"
          label="Flanking Paths (JSON)"
        >
          <textarea
            className="focus-ring min-h-40 rounded-lg border hairline bg-[color:var(--paper)] px-4 py-4 text-sm leading-7"
            id="impact-flanking-paths-json"
            onChange={(event) => onFlankingPathsInputChange(event.target.value)}
            placeholder={`[\n  { "id": "f1", "levelOffsetDb": -6, "pathType": "wall" },\n  { "id": "f2", "levelOffsetDb": -10, "pathCount": 2 }\n]`}
            value={flankingPathsInput}
          />
        </FieldGuide>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Route className="h-4 w-4" />
            Supported path fields
          </div>
          <div className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            <p>`id`, `levelOffsetDb`, and optional `pathCount` define the base parallel path.</p>
            <p>`pathType`, `supportingElementFamily`, `edgeIsolationClass`, and `shortCircuitRisk` activate family-aware penalties.</p>
            <p>`junctionLengthM`, `kijDb`, and `pathPenaltyDb` give you explicit expert control without touching the core formula lane.</p>
          </div>
        </article>

        <article className="rounded-lg border hairline bg-black/[0.025] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Cable className="h-4 w-4" />
            Operator intent
          </div>
          <div className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            <p>Use this when you have explicit field-path assumptions and want the trace to show them instead of hiding everything inside a single K value.</p>
            <p>Guide K/Hd and direct+flanking are different paths. The trace panel will tell you which branch is actually active on the current impact lane.</p>
          </div>
        </article>
      </div>

      {parsed ? (
        <div className="mt-5 rounded-lg border hairline bg-[color:var(--success-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--success-ink)]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4" />
            Parsed flanking path set
          </div>
          <div className="mt-2">{parsed.summary}</div>
        </div>
      ) : flankingPathsInput.trim().length > 0 && parseError ? (
        <div className="mt-5 rounded-lg border hairline bg-[color:var(--warning-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--warning-ink)]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="h-4 w-4" />
            Path set not active
          </div>
          <div className="mt-2">{parseError}</div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
          Add an explicit flanking path set if you want the field lane to move beyond `Ln,w + K` style correction and show direct-path plus parallel-path assumptions explicitly.
        </div>
      )}
    </SurfacePanel>
  );
}
