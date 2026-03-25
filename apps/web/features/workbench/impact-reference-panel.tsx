"use client";

import type { ImpactCalculation } from "@dynecho/shared";
import { ClipboardCheck, Drum, Layers3, Orbit } from "lucide-react";

import { MetricCard, Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import { FieldGuide } from "./field-guide";
import { buildImpactReferenceFieldGuide } from "./impact-field-guides";
import {
  formatConfidenceLevel,
  formatConfidenceProvenance,
  formatConfidenceScore,
  getConfidenceTone
} from "./impact-confidence-view";

type ImpactReferencePanelProps = {
  deltaLwInput: string;
  onDeltaLwInputChange: (value: string) => void;
  referenceImpact: ImpactCalculation | null;
  targetLnwDb: string;
};

function parseNumberInput(value: string): number | null {
  if (value.trim().length === 0) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ImpactReferencePanel({
  deltaLwInput,
  onDeltaLwInputChange,
  referenceImpact,
  targetLnwDb
}: ImpactReferencePanelProps) {
  const parsedDeltaLw = parseNumberInput(deltaLwInput);
  const targetLnw = parseNumberInput(targetLnwDb);
  const derivedLnW = typeof referenceImpact?.LnW === "number" ? referenceImpact.LnW : null;
  const heavyReferenceLnW = typeof referenceImpact?.bareReferenceLnW === "number" ? referenceImpact.bareReferenceLnW : null;
  const targetGap =
    derivedLnW !== null && targetLnw !== null ? Number((targetLnw - derivedLnW).toFixed(1)) : null;
  const deltaLwGuide = buildImpactReferenceFieldGuide({
    deltaLwInput,
    referenceImpact
  });

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Datasheet shortcut</Pill>
        <Pill tone={referenceImpact ? "success" : "neutral"}>
          {referenceImpact ? "Reference ready" : "Awaiting DeltaLw input"}
        </Pill>
        {referenceImpact ? (
          <Pill tone={getConfidenceTone(referenceImpact.confidence.level)}>
            {formatConfidenceLevel(referenceImpact.confidence.level)}
          </Pill>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="eyebrow">Product-sheet shortcut</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">
          Heavy-reference quick derive
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          Use this when a manufacturer gives only a DeltaLw value. DynEcho derives an Ln,w check against a fixed heavy
          floor reference so you can screen products before exact floor-family import lands here.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
        <FieldGuide
          guide={deltaLwGuide}
          hint="Use this only when you have a single DeltaLw figure, not a full curve."
          inputId="impact-reference-deltalw"
          label="Datasheet DeltaLw (dB)"
        >
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-reference-deltalw"
            inputMode="decimal"
            onChange={(event) => onDeltaLwInputChange(event.target.value)}
            placeholder="e.g. 24"
            value={deltaLwInput}
          />
        </FieldGuide>
        <div className="rounded-lg border hairline bg-black/[0.025] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
          <div className="font-semibold text-[color:var(--ink)]">Boundary</div>
          <p className="mt-2">
            This shortcut assumes a bare heavy-floor reference of 78 dB. It is useful for datasheet triage, not for
            replacing the live topology-aware impact lane.
          </p>
        </div>
      </div>

      {referenceImpact ? (
        <>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Derived Ln,w"
              value={derivedLnW !== null ? `${formatDecimal(derivedLnW)} dB` : "N/A"}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Drum className="h-4 w-4" />
                  {referenceImpact.basis}
                </span>
              }
            />
            <MetricCard
              label="Input DeltaLw"
              value={`${formatDecimal(referenceImpact.DeltaLw ?? parsedDeltaLw ?? 0)} dB`}
              detail={
                <span className="inline-flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Manufacturer or benchmark improvement term
                </span>
              }
            />
            <MetricCard
              label="Heavy reference"
              value={heavyReferenceLnW !== null ? `${formatDecimal(heavyReferenceLnW)} dB` : "N/A"}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Layers3 className="h-4 w-4" />
                  Fixed bare-floor baseline for this shortcut
                </span>
              }
            />
            <MetricCard
              label="Target gap"
              value={
                targetGap !== null
                  ? `${targetGap >= 0 ? "+" : ""}${formatDecimal(targetGap)} dB`
                  : "Set target Ln,w"
              }
              detail={
                <span className="inline-flex items-center gap-2">
                  <Orbit className="h-4 w-4" />
                  Positive means room to the active Ln,w target
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

          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {referenceImpact.notes.map((note) => (
              <article className="rounded-md border hairline bg-[color:var(--accent-soft)] px-4 py-4" key={note}>
                {note}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
          {deltaLwInput.trim()
            ? "Enter a valid non-negative DeltaLw value to derive a heavy-reference Ln,w."
            : "Paste a product-sheet DeltaLw value to open the quick heavy-reference lane."}
        </div>
      )}
    </SurfacePanel>
  );
}
