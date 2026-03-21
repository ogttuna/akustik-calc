"use client";

import type { ImpactGuideDerivation } from "@dynecho/engine";
import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";
import { AlertTriangle, CircleGauge, ShieldAlert, WavesLadder } from "lucide-react";

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
  REQUESTED_OUTPUT_LABELS,
  RESEARCH_OUTPUTS,
  REQUESTED_OUTPUT_SUPPORT_NOTES
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
  const requestedResearchOutputs = requestedOutputs.filter((output) => RESEARCH_OUTPUTS.has(output));
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
  const currentStc = result?.metrics.estimatedStc ?? null;
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
      <div className="eyebrow">Decision gate</div>
      <div className="mt-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <CircleGauge className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <h2 className="font-display text-[1.9rem] leading-none tracking-[-0.04em]">Targets and availability</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            A useful acoustic calculator should show which outputs are actionable now, which need parity import, and
            whether the current scheme is closing the brief.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <article className="rounded-[1.3rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4 sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Active brief template
              </div>
              <div className="mt-2 font-display text-[1.4rem] leading-none tracking-[-0.03em]">{activeCriteriaPack.label}</div>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
              {activeCriteriaPack.description}
              </p>
              {requestedOutputSummary.unavailable.length > 0 ? (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
                  Requested but unresolved on the current path:{" "}
                  {requestedOutputSummary.unavailable.map((status) => status.output).join(", ")}.
                </p>
              ) : null}
              {requestedResearchOutputs.length > 0 ? (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
                  Research-tracked outputs are active too: {requestedResearchOutputs.join(", ")}. DynEcho keeps them
                  visible in the brief and report, but does not fabricate ASTM or low-frequency ratings before a
                  standards-backed adapter exists.
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill tone="neutral">{activeCriteriaPack.audience}</Pill>
              <Pill tone="accent">{effectiveRequestedOutputs.length} output lanes</Pill>
            </div>
          </div>
          <div className="mt-4 rounded-[1.1rem] border hairline bg-black/[0.03] px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Active corridor map
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
                  Requested outputs below inherit these live corridors. This keeps airborne screening, floor-side
                  impact lanes, and field carry-over branches visibly separate before you read any number as a claim.
                </p>
              </div>
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
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {effectiveRequestedOutputs.map((output) => {
              const coverage = getTargetOutputStatus({
                guideResult,
                output,
                result
              });
              const corridor = getTargetOutputCorridor({
                guideResult,
                output,
                result
              });

              return (
                <article
                  className={`rounded-[1.05rem] border px-4 py-4 ${getTonePanelClass(coverage.tone)}`}
                  key={output}
                  title={`${REQUESTED_OUTPUT_LABELS[output]}: ${coverage.label}. ${corridor.detail}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[color:var(--ink)]">
                        {REQUESTED_OUTPUT_LABELS[output]}
                      </div>
                      <div className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                        {corridor.laneLabel}
                      </div>
                    </div>
                    <Pill tone={coverage.tone}>{coverage.label}</Pill>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill tone={corridor.tone}>{corridor.laneLabel}</Pill>
                    {corridor.modeLabel ? <Pill tone="neutral">{corridor.modeLabel}</Pill> : null}
                    {corridor.familyLabel ? <Pill tone="neutral">{corridor.familyLabel}</Pill> : null}
                  </div>

                  <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{corridor.detail}</p>
                  <p className="mt-2 text-xs leading-6 text-[color:var(--ink-faint)]">
                    {coverage.note || REQUESTED_OUTPUT_SUPPORT_NOTES[output]}
                  </p>
                </article>
              );
            })}
          </div>
        </article>

        <article className="rounded-[1.3rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            Airborne target
          </div>
          <div className="metric-number mt-3 font-display text-4xl tracking-[-0.05em]">
            {targetRw !== null ? `${formatDecimal(targetRw)} dB` : "Unset"}
          </div>
          <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            {currentRw !== null && rwDelta !== null
              ? `${meetsRwTarget ? "Ahead of brief" : "Gap to brief"}: ${rwDelta > 0 ? "+" : ""}${formatDecimal(rwDelta)} dB. ${result?.floorSystemMatch ? `Exact family Rw is ${formatDecimal(currentRw)} dB.` : result?.floorSystemEstimate ? `Published family estimate Rw is ${formatDecimal(currentRw)} dB.` : `Live package: ${formatDecimal(currentRw)} Rw / ${currentStc !== null ? formatDecimal(currentStc) : "?"} STC.`}`
              : "Live screening compares the current airborne package against the active target."}
          </p>
          <div className="mt-3">
            <Pill tone={meetsRwTarget ? "success" : "warning"}>
              {meetsRwTarget ? "Target met" : "Target not met"}
            </Pill>
          </div>
        </article>

        <article className="rounded-[1.3rem] border hairline bg-black/[0.03] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            Impact target
          </div>
          <div className="metric-number mt-3 font-display text-4xl tracking-[-0.05em]">
            {targetLnw !== null ? `${formatDecimal(targetLnw)} dB` : "Unset"}
          </div>
          <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            {currentLnw !== null && lnwDelta !== null
              ? `${meetsLnwTarget ? "Within brief" : "Gap to brief"}: ${lnwDelta > 0 ? "+" : ""}${formatDecimal(lnwDelta)} dB. ${result?.floorSystemMatch ? `Current exact family Ln,w is ${formatDecimal(currentLnw)} dB.` : result?.floorSystemEstimate ? `Current family estimate Ln,w is ${formatDecimal(currentLnw)} dB.` : `Current scoped impact estimate is ${formatDecimal(currentLnw)} dB.`}`
              : currentLnwUpperBound !== null && lnwDelta !== null
                ? `${meetsLnwTarget ? "Within brief conservatively" : "Upper-bound gap to brief"}: ${lnwDelta > 0 ? "+" : ""}${formatDecimal(lnwDelta)} dB. Current curated support is Ln,w <= ${formatDecimal(currentLnwUpperBound)} dB.`
              : studyMode === "floor"
                ? "Ln,w can arrive from the local heavy-floor predictor, curated exact floor families, official product evidence, exact imported impact bands, or a labeled published-family fallback when the topology is still broad."
                : "Impact targets can still be tracked even in wall-focused sessions for later package import."}
          </p>
          <div className="mt-3">
            <Pill tone={currentLnw !== null || currentLnwUpperBound !== null ? (meetsLnwTarget ? "success" : "warning") : "accent"}>
              {currentLnw !== null
                ? meetsLnwTarget
                  ? "Scoped target met"
                  : "Scoped target open"
                : currentLnwUpperBound !== null
                  ? meetsLnwTarget
                    ? "Bound target met"
                    : "Bound target open"
                  : "Awaiting impact lane"}
            </Pill>
          </div>
        </article>
      </div>

      {dutchDnTAkComplianceRows.length > 0 || (showDutchImpactReferences && dutchImpactReferenceRows.length > 0) ? (
        <div className="mt-5 grid gap-3">
          <article className="rounded-[1.3rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Dutch residential references
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
                  These checks stay separate from the live solver. Airborne rows compare published DnT,A,k against
                  Dutch residential reference thresholds. Contact-sound rows read as direct checks only when an exact
                  125..2000 Hz field octave source yields Dutch LnT,A; otherwise they stay staged.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
                {dutchReferenceSources.map((source) => (
                  <a
                    className="underline decoration-black/15 underline-offset-4"
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
              <div className="mt-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Airborne (DnT,A,k)
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {dutchDnTAkComplianceRows.map((row) => (
                    <article
                      className={`rounded-[1.05rem] border px-4 py-4 ${getTonePanelClass(row.tone)}`}
                      key={row.id}
                      title={`${row.label}: ${row.detail}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[color:var(--ink)]">{row.label}</div>
                          <div className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                            {row.scope}
                          </div>
                        </div>
                        <Pill tone={row.tone}>{row.statusLabel}</Pill>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                        Threshold: DnT,A,k &gt;= {formatDecimal(row.thresholdDb)} dB. Current value: {formatDecimal(row.valueDb)} dB.
                      </p>
                      <p className="mt-2 text-xs leading-6 text-[color:var(--ink-faint)]">Source: {row.sourceLabel}</p>
                      <p className="mt-2 text-xs leading-6 text-[color:var(--ink-faint)]">{row.detail}</p>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
            {showDutchImpactReferences && dutchImpactReferenceRows.length > 0 ? (
              <div className="mt-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  {dutchImpactReferenceRows.some((row) => row.statusLabel !== "Need LnT,A")
                    ? "Contact sound (LnT,A)"
                    : "Contact sound (LnT,A staged)"}
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {dutchImpactReferenceRows.map((row) => (
                    <article
                      className={`rounded-[1.05rem] border px-4 py-4 ${getTonePanelClass(row.tone)}`}
                      key={row.id}
                      title={`${row.label}: ${row.detail}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[color:var(--ink)]">{row.label}</div>
                          <div className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                            {row.scope}
                          </div>
                        </div>
                        <Pill tone={row.tone}>{row.statusLabel}</Pill>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                        Threshold: LnT,A &lt;= {formatDecimal(row.thresholdDb)} dB.
                        {typeof row.valueDb === "number" ? ` Current value: ${formatDecimal(row.valueDb)} dB.` : ""}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-[color:var(--ink-faint)]">Source: {row.sourceLabel}</p>
                      <p className="mt-2 text-xs leading-6 text-[color:var(--ink-faint)]">{row.detail}</p>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3">
        <article className="rounded-[1.3rem] border hairline px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <ShieldAlert className="h-4 w-4" />
            Engine-live outputs
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {requestedOutputSummary.engineLive.length > 0 ? (
              requestedOutputSummary.engineLive.map((status) => (
                <Pill key={status.output} tone="success">
                  {REQUESTED_OUTPUT_LABELS[status.output]}
                </Pill>
              ))
            ) : (
              <span className="text-sm leading-7 text-[color:var(--ink-soft)]">
                No live output is currently requested.
              </span>
            )}
          </div>
        </article>

        <article className="rounded-[1.3rem] border hairline bg-[color:var(--accent-soft)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--accent-ink)]">
            <WavesLadder className="h-4 w-4" />
            Bound-support outputs
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {requestedOutputSummary.engineBound.length > 0 ? (
              requestedOutputSummary.engineBound.map((status) => (
                <Pill key={status.output} tone="accent">
                  {REQUESTED_OUTPUT_LABELS[status.output]}
                </Pill>
              ))
            ) : (
              <span className="text-sm leading-7 text-[color:var(--ink-soft)]">
                No requested output is currently running on a bound-support path.
              </span>
            )}
          </div>
          {requestedOutputSummary.engineBound.length > 0 ? (
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              Bound-support outputs stay explicit when the active path only resolves a conservative upper or lower
              limit instead of a full exact value.
            </p>
          ) : null}
        </article>

        <article className="rounded-[1.3rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <WavesLadder className="h-4 w-4" />
            Guide/manual outputs
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {requestedOutputSummary.guideReady.length > 0 ? (
              requestedOutputSummary.guideReady.map((status) => (
                <Pill key={status.output} tone={status.tone}>
                  {REQUESTED_OUTPUT_LABELS[status.output]}
                </Pill>
              ))
            ) : (
              <span className="text-sm leading-7 text-[color:var(--ink-soft)]">
                No guide/manual output is currently resolved.
              </span>
            )}
          </div>
          {requestedOutputSummary.guideReady.length > 0 ? (
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              {guideResult
                ? `Guide supplement is active${typeof guideResult.CI === "number" ? `: CI ${formatDecimal(guideResult.CI)} dB` : ""}${typeof guideResult.CI50_2500 === "number" ? `, CI,50-2500 ${formatDecimal(guideResult.CI50_2500)} dB` : ""}${typeof guideResult.LnWPlusCI === "number" ? `, Ln,w+CI ${formatDecimal(guideResult.LnWPlusCI)} dB` : ""}${typeof guideResult.LPrimeNW === "number" ? `, L'n,w ${formatDecimal(guideResult.LPrimeNW)} dB` : typeof guideResult.LPrimeNWUpperBound === "number" ? `, L'n,w <= ${formatDecimal(guideResult.LPrimeNWUpperBound)} dB` : ""}${typeof guideResult.LPrimeNTw === "number" ? `, L'nT,w ${formatDecimal(guideResult.LPrimeNTw)} dB` : typeof guideResult.LPrimeNTwUpperBound === "number" ? `, L'nT,w <= ${formatDecimal(guideResult.LPrimeNTwUpperBound)} dB` : ""}${typeof guideResult.LPrimeNT50 === "number" ? `, L'nT,50 ${formatDecimal(guideResult.LPrimeNT50)} dB` : ""}.`
                : "Guide/manual outputs need an explicit selected Ln,w source. CI unlocks Ln,w+CI, K unlocks L'n,w, V + K unlock standardized L'nT,w, CI,50-2500 can unlock standardized L'nT,50, and the TR simple guide still uses K + Hd."}
            </p>
          ) : null}
        </article>

        <article className="rounded-[1.3rem] border hairline bg-black/[0.025] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <WavesLadder className="h-4 w-4" />
            Explicitly unresolved outputs
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {requestedOutputSummary.unavailable.length + requestedOutputSummary.parityImport.length > 0 ? (
              [...requestedOutputSummary.unavailable, ...requestedOutputSummary.parityImport].map((status) => (
                <Pill key={status.output} tone="warning">
                  {REQUESTED_OUTPUT_LABELS[status.output]}
                </Pill>
              ))
            ) : (
              <span className="text-sm leading-7 text-[color:var(--ink-soft)]">
                No requested output is currently unresolved or waiting for parity import.
              </span>
            )}
          </div>
          {requestedOutputSummary.unavailable.length + requestedOutputSummary.parityImport.length > 0 ? (
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              DynEcho keeps these outputs explicit in the brief. Some are unavailable on the active path; others are
              still waiting for explicit parity import instead of being fabricated.
            </p>
          ) : null}
        </article>
      </div>

      <div className="mt-5 rounded-[1.3rem] border hairline bg-[color:var(--warning-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--warning-ink)]">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4" />
          Reading rule
        </div>
        <p className="mt-2">
          Requested outputs are part of the project brief. They are not a claim that the current repo can already
          compute them.
        </p>
      </div>
    </SurfacePanel>
  );
}
