"use client";

import type { ImpactCalculation } from "@dynecho/shared";
import { ClipboardCheck, Drum, Layers3, ShieldCheck, ShieldX } from "lucide-react";

import { MetricCard, Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import { FieldGuide } from "./field-guide";
import { buildImpactImprovementFieldGuide } from "./impact-field-guides";
import type { ParsedImpactImprovementImport } from "./impact-improvement-import";
import {
  formatConfidenceLevel,
  formatConfidenceProvenance,
  formatConfidenceScore,
  getConfidenceTone
} from "./impact-confidence-view";

type ImpactImprovementSourcePanelProps = {
  input: string;
  onInputChange: (value: string) => void;
  parseError: string | null;
  parsedImport: ParsedImpactImprovementImport | null;
  referenceImpact: ImpactCalculation | null;
};

export function ImpactImprovementSourcePanel({
  input,
  onInputChange,
  parseError,
  parsedImport,
  referenceImpact
}: ImpactImprovementSourcePanelProps) {
  const derivedLnW = typeof referenceImpact?.LnW === "number" ? referenceImpact.LnW : null;
  const heavyReferenceLnW = typeof referenceImpact?.bareReferenceLnW === "number" ? referenceImpact.bareReferenceLnW : null;
  const improvementGuide = buildImpactImprovementFieldGuide({
    input,
    parseError,
    parsedImport,
    referenceImpact
  });

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Exact DeltaLw import</Pill>
        <Pill tone={referenceImpact ? "success" : parseError ? "warning" : "neutral"}>
          {referenceImpact ? "Heavy-reference exact" : parseError ? "Needs supported grid" : "Optional reference lane"}
        </Pill>
        {referenceImpact ? (
          <Pill tone={getConfidenceTone(referenceImpact.confidence.level)}>
            {formatConfidenceLevel(referenceImpact.confidence.level)}
          </Pill>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="eyebrow">Heavy-reference evidence</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">Exact improvement curve</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          Paste a measured DeltaLw improvement curve on the ISO heavy-reference floor. DynEcho will derive exact
          `DeltaLw` and the treated heavy-reference `Ln,w` without pretending it solved the current floor assembly.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
        <FieldGuide
          guide={improvementGuide}
          hint="Supported today: the nominal 100..3150 Hz 16-band heavy-reference DeltaLw grid."
          inputId="impact-improvement-source-input"
          label="Improvement curve paste"
        >
          <textarea
            className="focus-ring min-h-36 rounded-lg border hairline bg-[color:var(--paper)] px-4 py-4 text-sm leading-7"
            id="impact-improvement-source-input"
            onChange={(event) => onInputChange(event.target.value)}
            placeholder={"100 20\n125 20\n160 20\n...\n\nor just 16 values:\n20 20 20 20 20 20 ..."}
            value={input}
          />
        </FieldGuide>

        <div className="grid gap-3">
          <article className="rounded-md border hairline bg-[color:var(--panel-strong)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            <div className="font-semibold text-[color:var(--ink)]">Boundary</div>
            <p className="mt-2">
              This lane is exact only for the heavy-reference workflow. It does not replace a full floor-system model
              and does not override the live stack impact lane.
            </p>
          </article>
          <article className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            <div className="font-semibold text-[color:var(--ink)]">Quick format</div>
            <p className="mt-2">
              Either paste 16 freq/value rows or 16 improvement values. DynEcho assumes the ISO heavy-reference floor
              and rates the treated reference curve.
            </p>
          </article>
        </div>
      </div>

      {referenceImpact ? (
        <>
          <div className="mt-5 rounded-lg border hairline bg-[color:var(--success-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--success-ink)]">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Parsed exact improvement source
            </div>
            <div className="mt-2">
              {parsedImport?.valueCount ?? 16} levels on the 100..3150 Hz heavy-reference grid.
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="DeltaLw"
              value={typeof referenceImpact.DeltaLw === "number" ? `${formatDecimal(referenceImpact.DeltaLw)} dB` : "N/A"}
              detail={
                <span className="inline-flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Exact improvement against the ISO heavy reference floor
                </span>
              }
            />
            <MetricCard
              label="Treated Ln,w"
              value={derivedLnW !== null ? `${formatDecimal(derivedLnW)} dB` : "N/A"}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Drum className="h-4 w-4" />
                  Heavy-reference treated result
                </span>
              }
            />
            <MetricCard
              label="Reference floor"
              value={heavyReferenceLnW !== null ? `${formatDecimal(heavyReferenceLnW)} dB` : "N/A"}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Layers3 className="h-4 w-4" />
                  Fixed ISO heavy reference baseline
                </span>
              }
            />
            <MetricCard
              label="Confidence"
              value={`${formatConfidenceScore(referenceImpact.confidence.score)} · ${formatConfidenceLevel(referenceImpact.confidence.level)}`}
              detail={formatConfidenceProvenance(referenceImpact.confidence.provenance)}
            />
          </div>

          <div className="mt-5 rounded-md border hairline bg-[color:var(--panel-strong)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            <span className="font-semibold text-[color:var(--ink)]">Trust note:</span> {referenceImpact.confidence.summary}
          </div>
        </>
      ) : input.trim() ? (
        <div className="mt-5 rounded-lg border hairline bg-[color:var(--warning-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--warning-ink)]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldX className="h-4 w-4" />
            Improvement source not active
          </div>
          <div className="mt-2">{parseError ?? "The improvement curve could not be resolved on the heavy-reference grid."}</div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
          Paste a measured improvement curve if you want an exact `DeltaLw` reference lane beyond the manual datasheet shortcut.
        </div>
      )}
    </SurfacePanel>
  );
}
