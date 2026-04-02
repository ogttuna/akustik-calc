"use client";

import type { ImpactGuideDerivation } from "@dynecho/engine";
import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

import { Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import type { CriteriaPack } from "./criteria-packs";
import {
  DUTCH_DNTAK_REFERENCE_SOURCES,
  getDutchResidentialDnTAkComplianceRows
} from "./dutch-airborne-compliance";
import {
  DUTCH_IMPACT_REFERENCE_SOURCES,
  getDutchResidentialImpactReferenceRows
} from "./dutch-impact-reference";
import type { StudyMode } from "./preset-definitions";
import {
  REQUESTED_OUTPUT_LABELS
} from "./workbench-data";
import {
  getTargetOutputCorridor,
  getTargetOutputStatus,
  summarizeTargetOutputs
} from "./target-output-status";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  getActiveValidationFamily,
  getActiveValidationMode
} from "./validation-regime";

type PerformanceCriteriaPanelProps = {
  activeCriteriaPack: CriteriaPack;
  guideResult: ImpactGuideDerivation | null;
  requestedOutputs: readonly RequestedOutputId[];
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
  targetLnwDb: string;
  targetRwDb: string;
};

const DUTCH_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]);

function parseNumberInput(value: string): number | null {
  if (value.trim().length === 0) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getTonePanelClass(tone: "accent" | "neutral" | "success" | "warning"): string {
  switch (tone) {
    case "success":
      return "border-[color:var(--success-ink)]/18 bg-[color:var(--success-soft)]/45";
    case "accent":
      return "border-[color:var(--accent)]/18 bg-[color:var(--accent-soft)]/32";
    case "warning":
      return "border-[color:var(--warning-ink)]/20 bg-[color:var(--warning-soft)]/45";
    case "neutral":
      return "hairline bg-[color:var(--paper)]";
  }
}

function SectionHeader(props: { children: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{props.children}</div>
      <div className="h-px flex-1 bg-[color:var(--line)]" />
      {typeof props.count === "number" ? (
        <span className="text-[0.66rem] tabular-nums text-[color:var(--ink-faint)]">{props.count}</span>
      ) : null}
    </div>
  );
}

export function PerformanceCriteriaPanel({
  activeCriteriaPack,
  guideResult,
  requestedOutputs,
  result,
  studyMode,
  targetLnwDb,
  targetRwDb
}: PerformanceCriteriaPanelProps) {
  const effectiveRequestedOutputs = Array.from(
    new Set<RequestedOutputId>([...activeCriteriaPack.requestedOutputs, ...requestedOutputs])
  );
  const requestedOutputSummary = summarizeTargetOutputs({
    guideResult,
    outputs: requestedOutputs,
    result
  });
  const targetRw = parseNumberInput(targetRwDb);
  const targetLnw = parseNumberInput(targetLnwDb);
  const impactPosture = describeImpactValidationPosture(result);
  const airbornePosture = describeAirborneValidationPosture(result);
  const activeValidationFamily = getActiveValidationFamily(result);
  const activeValidationMode = getActiveValidationMode(result);
  const currentRw =
    result?.floorSystemMatch?.system.airborneRatings.Rw ??
    result?.floorSystemEstimate?.airborneRatings.Rw ??
    result?.metrics.estimatedRwDb ??
    null;
  const currentLnw =
    result?.impact?.LnW ??
    result?.floorSystemMatch?.impact.LnW ??
    result?.floorSystemEstimate?.impact.LnW ??
    null;
  const dutchDnTAkComplianceRows = getDutchResidentialDnTAkComplianceRows(result);
  const dutchImpactReferenceRows = getDutchResidentialImpactReferenceRows(result);
  const showDutchImpactReferences =
    studyMode === "floor" || requestedOutputs.some((output) => DUTCH_IMPACT_OUTPUTS.has(output));
  const dutchReferenceSources = Array.from(
    new Map(
      [...DUTCH_DNTAK_REFERENCE_SOURCES, ...DUTCH_IMPACT_REFERENCE_SOURCES].map((source) => [source.url, source])
    ).values()
  );
  const currentLnwUpperBound = result?.lowerBoundImpact?.LnWUpperBound ?? null;
  const rwDelta = currentRw !== null && targetRw !== null ? Number((currentRw - targetRw).toFixed(1)) : null;
  const lnwDelta =
    currentLnw !== null && targetLnw !== null
      ? Number((targetLnw - currentLnw).toFixed(1))
      : currentLnwUpperBound !== null && targetLnw !== null
        ? Number((targetLnw - currentLnwUpperBound).toFixed(1))
        : null;
  const meetsRwTarget = rwDelta !== null && rwDelta >= 0;
  const meetsLnwTarget = lnwDelta !== null && lnwDelta >= 0;

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="eyebrow">Targets and availability</div>
        <div className="flex flex-wrap gap-2">
          <Pill tone={airbornePosture.posture === "inactive" ? "neutral" : "accent"}>
            Airborne: {airbornePosture.label}
          </Pill>
          <Pill tone={impactPosture.posture === "exact" ? "success" : impactPosture.posture === "bound" ? "warning" : "accent"}>
            Impact: {activeValidationMode?.label ?? impactPosture.label}
          </Pill>
          {activeValidationFamily ? <Pill tone="neutral">{activeValidationFamily.label}</Pill> : null}
        </div>
      </div>

      {/* Brief template + targets */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-[color:var(--panel)] px-4 py-3">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Brief</div>
          <div className="mt-1 text-sm font-semibold text-[color:var(--ink)]">{activeCriteriaPack.label}</div>
          <div className="mt-1 text-[0.72rem] text-[color:var(--ink-soft)]">{effectiveRequestedOutputs.length} output lanes</div>
        </div>
        <div className="rounded-md bg-[color:var(--panel)] px-4 py-3">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Airborne target</div>
          <div className="mt-1 text-lg font-semibold tabular-nums text-[color:var(--ink)]">
            {targetRw !== null ? `${formatDecimal(targetRw)} dB` : "—"}
          </div>
          <Pill tone={meetsRwTarget ? "success" : "warning"}>
            {rwDelta !== null ? `${rwDelta > 0 ? "+" : ""}${formatDecimal(rwDelta)} dB` : meetsRwTarget ? "Met" : "Open"}
          </Pill>
        </div>
        <div className="rounded-md bg-[color:var(--panel)] px-4 py-3">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Impact target</div>
          <div className="mt-1 text-lg font-semibold tabular-nums text-[color:var(--ink)]">
            {targetLnw !== null ? `${formatDecimal(targetLnw)} dB` : "—"}
          </div>
          <Pill tone={currentLnw !== null || currentLnwUpperBound !== null ? (meetsLnwTarget ? "success" : "warning") : "accent"}>
            {lnwDelta !== null ? `${lnwDelta > 0 ? "+" : ""}${formatDecimal(lnwDelta)} dB` : currentLnw !== null || currentLnwUpperBound !== null ? (meetsLnwTarget ? "Met" : "Open") : "Awaiting"}
          </Pill>
        </div>
      </div>

      {/* Output lanes */}
      <div className="mt-5">
        <SectionHeader count={effectiveRequestedOutputs.length}>Output lanes</SectionHeader>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {effectiveRequestedOutputs.map((output) => {
            const coverage = getTargetOutputStatus({ guideResult, output, result });
            const corridor = getTargetOutputCorridor({ guideResult, output, result });

            return (
              <div
                className={`rounded-md border px-3 py-3 ${getTonePanelClass(coverage.tone)}`}
                key={output}
                title={`${REQUESTED_OUTPUT_LABELS[output]}: ${coverage.label}. ${corridor.detail}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[0.78rem] font-semibold text-[color:var(--ink)]">
                    {REQUESTED_OUTPUT_LABELS[output]}
                  </div>
                  <Pill tone={coverage.tone}>{coverage.label}</Pill>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <span className="text-[0.66rem] font-medium uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">{corridor.laneLabel}</span>
                  {corridor.modeLabel ? <span className="text-[0.66rem] text-[color:var(--ink-faint)]">/ {corridor.modeLabel}</span> : null}
                </div>
                <p className="mt-1.5 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">{corridor.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Output status summary */}
      <div className="mt-5">
        <SectionHeader>Output status</SectionHeader>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md bg-[color:var(--panel)] px-3 py-3">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Engine-live</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {requestedOutputSummary.engineLive.length > 0 ? (
                requestedOutputSummary.engineLive.map((s) => <Pill key={s.output} tone="success">{REQUESTED_OUTPUT_LABELS[s.output]}</Pill>)
              ) : (
                <span className="text-[0.72rem] text-[color:var(--ink-soft)]">None</span>
              )}
            </div>
          </div>
          <div className="rounded-md bg-[color:var(--panel)] px-3 py-3">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Bound-support</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {requestedOutputSummary.engineBound.length > 0 ? (
                requestedOutputSummary.engineBound.map((s) => <Pill key={s.output} tone="accent">{REQUESTED_OUTPUT_LABELS[s.output]}</Pill>)
              ) : (
                <span className="text-[0.72rem] text-[color:var(--ink-soft)]">None</span>
              )}
            </div>
          </div>
          <div className="rounded-md bg-[color:var(--panel)] px-3 py-3">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Guide/manual</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {requestedOutputSummary.guideReady.length > 0 ? (
                requestedOutputSummary.guideReady.map((s) => <Pill key={s.output} tone={s.tone}>{REQUESTED_OUTPUT_LABELS[s.output]}</Pill>)
              ) : (
                <span className="text-[0.72rem] text-[color:var(--ink-soft)]">None</span>
              )}
            </div>
          </div>
          <div className="rounded-md bg-[color:var(--panel)] px-3 py-3">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Unresolved</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {requestedOutputSummary.unavailable.length + requestedOutputSummary.parityImport.length > 0 ? (
                [...requestedOutputSummary.unavailable, ...requestedOutputSummary.parityImport].map((s) => <Pill key={s.output} tone="warning">{REQUESTED_OUTPUT_LABELS[s.output]}</Pill>)
              ) : (
                <span className="text-[0.72rem] text-[color:var(--ink-soft)]">None</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dutch residential references */}
      {dutchDnTAkComplianceRows.length > 0 || (showDutchImpactReferences && dutchImpactReferenceRows.length > 0) ? (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeader>Dutch residential references</SectionHeader>
            <div className="flex gap-3">
              {dutchReferenceSources.map((source) => (
                <a
                  className="text-[0.66rem] font-medium text-[color:var(--accent)] hover:underline"
                  href={source.url}
                  key={source.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </div>

          {dutchDnTAkComplianceRows.length > 0 ? (
            <div className="mt-3">
              <div className="text-[0.66rem] font-medium uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Airborne (DnT,A,k)</div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {dutchDnTAkComplianceRows.map((row) => (
                  <div className={`rounded-md border px-3 py-3 ${getTonePanelClass(row.tone)}`} key={row.id}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[0.78rem] font-semibold text-[color:var(--ink)]">{row.label}</span>
                      <Pill tone={row.tone}>{row.statusLabel}</Pill>
                    </div>
                    <p className="mt-1 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">
                      Threshold: &gt;= {formatDecimal(row.thresholdDb)} dB. Current: {formatDecimal(row.valueDb)} dB.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {showDutchImpactReferences && dutchImpactReferenceRows.length > 0 ? (
            <div className="mt-3">
              <div className="text-[0.66rem] font-medium uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">
                Contact sound (LnT,A)
              </div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {dutchImpactReferenceRows.map((row) => (
                  <div className={`rounded-md border px-3 py-3 ${getTonePanelClass(row.tone)}`} key={row.id}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[0.78rem] font-semibold text-[color:var(--ink)]">{row.label}</span>
                      <Pill tone={row.tone}>{row.statusLabel}</Pill>
                    </div>
                    <p className="mt-1 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">
                      Threshold: &lt;= {formatDecimal(row.thresholdDb)} dB.
                      {typeof row.valueDb === "number" ? ` Current: ${formatDecimal(row.valueDb)} dB.` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </SurfacePanel>
  );
}
