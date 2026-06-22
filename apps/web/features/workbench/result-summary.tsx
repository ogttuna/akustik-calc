"use client";

import { formatImpactSupportingElementFamily, type AssemblyCalculation, type RequestedOutputId } from "@dynecho/shared";
import { AudioLines, Gauge, Layers3, Scale, Waves } from "lucide-react";
import { MetricCard, Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import { getFieldAirborneProvenanceSummary } from "./field-airborne-provenance";
import { buildWorkbenchWarningNotes } from "./workbench-warning-notes";
import { getFieldAirborneLiveDetail } from "./field-airborne-output";
import { getImpactLaneKind, getImpactLanePillLabel } from "./impact-lane-view";
import { ResultAnswerChart } from "./result-answer-chart";
import {
  AIRBORNE_ANSWER_OUTPUTS,
  IMPACT_ANSWER_OUTPUTS,
  buildResultAnswerChartLanes,
  hasSupportedAirborneAnswer,
  hasSupportedImpactAnswer,
  isAirborneAnswerParked,
  isSupportedAnswerOutput
} from "./result-answer-chart-model";
import { getAirborneBoundaryPosture } from "./validation-regime";

type ResultSummaryProps = {
  result: AssemblyCalculation | null;
  targetLnwDb?: string | null;
  targetRwDb?: string | null;
  warnings: readonly string[];
};

function formatSignedDb(value: number): string {
  return `${value >= 0 ? "+" : ""}${formatDecimal(value)} dB`;
}

function formatMissingPhysicalInputLabel(fieldId: string): string {
  // AGENT COORDINATION 2026-06-22: User-facing result summary copy only; do not change boundary semantics here.
  const normalized = fieldId.toLowerCase().replace(/[^a-z0-9]/gu, "");

  if (normalized.includes("loadbasiskgm2")) return "Load basis";
  if (normalized.includes("resilientlayerdynamicstiffnessmnm3")) return "Dynamic stiffness";
  if (normalized.includes("flowresistivitypasm2")) return "Flow resistivity";
  if (normalized.includes("surfacemasskgm2")) return "Leaf surface mass";
  if (normalized === "impactfieldcontext") return "Impact field context";
  if (normalized.includes("fieldkdb")) return "K correction";
  if (normalized.includes("ci502500db")) return "CI,50-2500";
  if (normalized.includes("cidb")) return "CI";
  if (normalized.includes("receivingroomvolumem3")) return "Receiving-room volume";
  if (normalized.includes("receivingroomrt60s")) return "RT60";
  if (normalized.includes("guidehddb")) return "guide Hd";
  if (normalized.includes("sourceroomvolumem3")) return "Source-room volume";
  if (normalized.includes("panelwidthmm")) return "Panel width";
  if (normalized.includes("panelheightmm")) return "Panel height";
  if (normalized.includes("partitionaream2")) return "Partition area";
  if (normalized.includes("supportspacingmm") || normalized.includes("studspacingmm")) return "Support spacing";
  if (normalized.includes("cavity1depthmm")) return "First cavity depth";
  if (normalized.includes("sidealeafgroup")) return "Side A leaf group";
  if (normalized.includes("sidebleafgroup")) return "Side B leaf group";
  if (normalized.includes("walltopology") || normalized.includes("leafgrouping")) return "Wall topology";
  if (normalized.includes("resilientbarsidecount")) return "Resilient bar side count";

  const leaf = fieldId.split(".").at(-1) ?? fieldId;
  return leaf
    .replace(/_/gu, " ")
    .replace(/([a-z])([A-Z])/gu, "$1 $2")
    .replace(/\b\w/gu, (match) => match.toUpperCase());
}

function formatMissingPhysicalInputList(fieldIds: readonly string[]): string {
  return fieldIds.map(formatMissingPhysicalInputLabel).join(", ");
}

export function ResultSummary({ result, targetLnwDb, targetRwDb, warnings }: ResultSummaryProps) {
  const noteLines = buildWorkbenchWarningNotes(result, [...(result?.warnings ?? []), ...warnings]);
  const lowerBoundImpact = result?.lowerBoundImpact ?? null;
  const impactLaneKind = getImpactLaneKind({ impact: result?.impact, lowerBoundImpact });
  const dynamicTrace = result?.dynamicAirborneTrace ?? null;
  const boundaryPosture = getAirborneBoundaryPosture(dynamicTrace);
  const dynamicImpactTrace = result?.dynamicImpactTrace ?? null;
  const fieldAirborneProvenance = getFieldAirborneProvenanceSummary(result);
  const activeCalculatorLabel = result?.calculatorLabel ?? "Screening Seed";
  const airborneAnswerParked = isAirborneAnswerParked(result);
  const airborneAnswerVisible = Boolean(!airborneAnswerParked && hasSupportedAirborneAnswer(result));
  const impactAnswerVisible = Boolean(hasSupportedImpactAnswer(result));
  const visibleFieldAirborneProvenance = airborneAnswerVisible ? fieldAirborneProvenance : null;
  const airborneAnswerMissingInputs =
    result?.acousticAnswerBoundary?.origin === "needs_input" &&
    result.acousticAnswerBoundary.unsupportedOutputs.some((output: RequestedOutputId) =>
      AIRBORNE_ANSWER_OUTPUTS.has(output)
    )
      ? result.acousticAnswerBoundary.missingPhysicalInputs
      : result?.airborneBasis?.origin === "needs_input"
        ? result.airborneBasis.missingPhysicalInputs
        : [];
  const floorAnswerBoundary = result?.acousticAnswerBoundary?.route === "floor" ? result.acousticAnswerBoundary : null;
  const floorAnswerStopped = Boolean(
    floorAnswerBoundary &&
      floorAnswerBoundary.unsupportedOutputs.some((output: RequestedOutputId) => IMPACT_ANSWER_OUTPUTS.has(output)) &&
      !impactAnswerVisible
  );
  const floorAnswerStopDetail =
    floorAnswerBoundary?.origin === "needs_input"
      ? `Needs input: ${formatMissingPhysicalInputList(floorAnswerBoundary.missingPhysicalInputs)}`
      : floorAnswerBoundary?.origin === "unsupported"
        ? `Unsupported outputs: ${floorAnswerBoundary.unsupportedOutputs.join(", ")}`
        : "Stopped by the selected answer boundary";
  const floorEstimatePillLabel =
    result?.floorSystemEstimate?.kind === "low_confidence" ? "Low-confidence floor fallback" : "Estimated floor family";
  const floorEstimatePillTone = result?.floorSystemEstimate?.kind === "low_confidence" ? "warning" : "accent";
  const resultChartHasVisibleLane = buildResultAnswerChartLanes({ result, targetLnwDb, targetRwDb }).length > 0;
  const rwSupported = Boolean(
    result && isSupportedAnswerOutput(result, "Rw") && typeof result.metrics.estimatedRwDb === "number"
  );
  const rwPrimeSupported = Boolean(
    result && isSupportedAnswerOutput(result, "R'w") && typeof result.metrics.estimatedRwPrimeDb === "number"
  );
  const dnTwSupported = Boolean(
    result && isSupportedAnswerOutput(result, "DnT,w") && typeof result.metrics.estimatedDnTwDb === "number"
  );
  const dnTASupported = Boolean(
    result && isSupportedAnswerOutput(result, "DnT,A") && typeof result.metrics.estimatedDnTADb === "number"
  );
  const dnTAkSupported = Boolean(
    result && isSupportedAnswerOutput(result, "DnT,A,k") && typeof result.ratings.field?.DnTAk === "number"
  );
  const dnWSupported = Boolean(
    result && isSupportedAnswerOutput(result, "Dn,w") && typeof result.metrics.estimatedDnWDb === "number"
  );
  const dnASupported = Boolean(
    result && isSupportedAnswerOutput(result, "Dn,A") && typeof result.metrics.estimatedDnADb === "number"
  );
  const primaryAirborneAnswer = result
    ? result.airborneOverlay?.contextMode === "building_prediction" && dnTwSupported
      ? { label: "DnT,w estimate", value: result.metrics.estimatedDnTwDb }
      : rwPrimeSupported && result.ratings.iso717.descriptor === "R'w"
        ? { label: "R'w estimate", value: result.metrics.estimatedRwPrimeDb }
        : rwSupported
          ? { label: "Rw estimate", value: result.metrics.estimatedRwDb }
          : null
    : null;
  const iso717CompositeSupported = Boolean(rwSupported || rwPrimeSupported);
  const stcSupported = Boolean(
    result && isSupportedAnswerOutput(result, "STC") && typeof result.metrics.estimatedStc === "number"
  );
  const cSupported = Boolean(
    result && isSupportedAnswerOutput(result, "C") && typeof result.metrics.estimatedCDb === "number"
  );
  const ctrSupported = Boolean(
    result && isSupportedAnswerOutput(result, "Ctr") && typeof result.metrics.estimatedCtrDb === "number"
  );
  const spectrumAdaptationValues = result
    ? [
        ...(cSupported ? [formatSignedDb(result.metrics.estimatedCDb)] : []),
        ...(ctrSupported ? [formatSignedDb(result.metrics.estimatedCtrDb)] : [])
      ]
    : [];
  const spectrumAdaptationLabel = cSupported && ctrSupported ? "C / Ctr" : cSupported ? "C" : ctrSupported ? "Ctr" : "";

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={result?.calculatorId === "dynamic" ? "accent" : "neutral"}>{activeCalculatorLabel}</Pill>
        <Pill tone="neutral">Pure package boundary</Pill>
        {airborneAnswerVisible ? <Pill tone="success">Curve-backed ratings</Pill> : null}
        {dynamicTrace && airborneAnswerVisible ? (
          <Pill tone={dynamicTrace.confidenceClass === "high" ? "success" : dynamicTrace.confidenceClass === "medium" ? "accent" : "warning"}>
            {dynamicTrace.detectedFamilyLabel}
          </Pill>
        ) : null}
        {result?.airborneOverlay?.leakagePenaltyApplied ? <Pill tone="warning">Leakage overlay</Pill> : null}
        {result?.airborneOverlay?.fieldFlankingPenaltyApplied ? <Pill tone="warning">Field flanking</Pill> : null}
        {visibleFieldAirborneProvenance ? <Pill tone="accent">{visibleFieldAirborneProvenance.label}</Pill> : null}
        {result?.impact ? <Pill tone="accent">{getImpactLanePillLabel(impactLaneKind)}</Pill> : null}
        {!result?.impact && lowerBoundImpact ? <Pill tone="neutral">Bound impact live</Pill> : null}
        {dynamicImpactTrace ? (
          <Pill
            tone={
              dynamicImpactTrace.evidenceTier === "exact"
                ? "success"
                : dynamicImpactTrace.evidenceTier === "estimate"
                  ? "accent"
                  : dynamicImpactTrace.evidenceTier === "derived"
                    ? "neutral"
                    : "warning"
            }
          >
            {dynamicImpactTrace.selectionKindLabel}
          </Pill>
        ) : null}
        {dynamicImpactTrace && dynamicImpactTrace.fieldContinuation !== "none" ? (
          <Pill tone="accent">{dynamicImpactTrace.fieldContinuationLabel}</Pill>
        ) : null}
        {result?.impactCatalogMatch ? <Pill tone="accent">Official product lane</Pill> : null}
        {result?.floorSystemMatch ? <Pill tone="success">Exact floor family</Pill> : null}
        {result?.floorSystemEstimate ? <Pill tone={floorEstimatePillTone}>{floorEstimatePillLabel}</Pill> : null}
        {result?.boundFloorSystemMatch ? <Pill tone="neutral">Bound floor family</Pill> : null}
        {result?.boundFloorSystemEstimate ? <Pill tone="neutral">Bound family estimate</Pill> : null}
        {!result?.floorSystemMatch && result?.floorSystemRecommendations?.length ? <Pill tone="neutral">Near floor family</Pill> : null}
      </div>
      <div className="mt-5">
        <div className="eyebrow">Result panel</div>
        <h2 className="mt-1 font-display text-3xl tracking-[-0.04em]">Active acoustic output</h2>
      </div>
      {result ? (
        <>
          {resultChartHasVisibleLane ? (
            <div className="mt-6 rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-5">
              <ResultAnswerChart result={result} targetLnwDb={targetLnwDb} targetRwDb={targetRwDb} />
            </div>
          ) : null}
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {airborneAnswerParked || primaryAirborneAnswer ? (
              <MetricCard
                label={airborneAnswerParked ? "Airborne answer" : primaryAirborneAnswer?.label ?? "Airborne answer"}
                value={airborneAnswerParked ? "Not ready" : `${formatDecimal(primaryAirborneAnswer?.value ?? 0)} dB`}
                detail={
                  <span className="inline-flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    {airborneAnswerParked
                      ? `Needs input${airborneAnswerMissingInputs.length > 0 ? `: ${formatMissingPhysicalInputList(airborneAnswerMissingInputs)}` : ""}`
                      : activeCalculatorLabel}
                  </span>
                }
              />
            ) : null}
            {airborneAnswerVisible || airborneAnswerParked ? (
              <MetricCard
                label="Airborne lane"
                value={activeCalculatorLabel}
                detail={
                  dynamicTrace
                    ? `${dynamicTrace.selectedLabel} anchor · ${dynamicTrace.strategy.replaceAll("_", " ")}${boundaryPosture ? ` · ${boundaryPosture.label}` : ""}`
                    : result.metrics.method
                }
              />
            ) : null}
            {floorAnswerStopped ? (
              <MetricCard
                label="Impact answer"
                value="Not ready"
                detail={floorAnswerStopDetail}
              />
            ) : null}
            {dynamicTrace && airborneAnswerVisible ? (
              <MetricCard
                label="Dynamic confidence"
                value={`${Math.round(dynamicTrace.confidenceScore * 100)}%`}
                detail={`${dynamicTrace.confidenceClass} confidence · ${dynamicTrace.solverSpreadRwDb} dB solver spread${boundaryPosture ? ` · ${boundaryPosture.label}` : ""}`}
              />
            ) : null}
            {visibleFieldAirborneProvenance ? (
              <MetricCard
                label="Field airborne provenance"
                value={visibleFieldAirborneProvenance.label}
                detail={visibleFieldAirborneProvenance.detail}
              />
            ) : null}
            {airborneAnswerVisible && iso717CompositeSupported ? (
              <MetricCard
                label="ISO 717 composite"
                value={result.ratings.iso717.composite}
                detail={
                  <span className="inline-flex items-center gap-2">
                    <AudioLines className="h-4 w-4" />
                    {result.ratings.iso717.descriptor} family from calibrated TL curve
                  </span>
                }
              />
            ) : null}
            {airborneAnswerVisible && rwPrimeSupported && result.ratings.iso717.descriptor === "R'w" ? (
              <MetricCard
                label="R'w"
                value={`${formatDecimal(result.metrics.estimatedRwPrimeDb)} dB`}
                detail={getFieldAirborneLiveDetail("R'w", result)}
              />
            ) : null}
            {airborneAnswerVisible && dnTwSupported ? (
              <MetricCard
                label="DnT,w"
                value={`${formatDecimal(result.metrics.estimatedDnTwDb)} dB`}
                detail={getFieldAirborneLiveDetail("DnT,w", result)}
              />
            ) : null}
            {airborneAnswerVisible && dnTASupported ? (
              <MetricCard
                label="DnT,A"
                value={`${formatDecimal(result.metrics.estimatedDnTADb)} dB`}
                detail={getFieldAirborneLiveDetail("DnT,A", result)}
              />
            ) : null}
            {airborneAnswerVisible && dnTAkSupported ? (
              <MetricCard
                label="DnT,A,k"
                value={`${formatDecimal(result.ratings.field.DnTAk)} dB`}
                detail={getFieldAirborneLiveDetail("DnT,A,k", result)}
              />
            ) : null}
            {airborneAnswerVisible && dnWSupported ? (
              <MetricCard
                label="Dn,w"
                value={`${formatDecimal(result.metrics.estimatedDnWDb)} dB`}
                detail={getFieldAirborneLiveDetail("Dn,w", result)}
              />
            ) : null}
            {airborneAnswerVisible && dnASupported ? (
              <MetricCard
                label="Dn,A"
                value={`${formatDecimal(result.metrics.estimatedDnADb)} dB`}
                detail={getFieldAirborneLiveDetail("Dn,A", result)}
              />
            ) : null}
            {typeof result.impact?.LnTA === "number" ? (
              <MetricCard
                label="LnT,A"
                value={`${formatDecimal(result.impact.LnTA)} dB`}
                detail="Dutch NEN 5077 impact companion from exact 125..2000 Hz field octave bands"
              />
            ) : null}
            {airborneAnswerVisible && stcSupported ? (
              <MetricCard
                label="STC"
                value={`${formatDecimal(result.metrics.estimatedStc)} dB`}
                detail="ASTM E413 contour derived from the same screening curve"
              />
            ) : null}
            {airborneAnswerVisible && spectrumAdaptationValues.length > 0 ? (
              <MetricCard
                label="Spectrum adaptation"
                value={spectrumAdaptationValues.join(" / ")}
                detail={
                  spectrumAdaptationLabel === "C / Ctr"
                    ? "C / Ctr for pink-noise and traffic-noise use cases"
                    : `${spectrumAdaptationLabel} for the supported airborne lane`
                }
              />
            ) : null}
            <MetricCard
              label="Surface mass"
              value={`${formatDecimal(result.metrics.surfaceMassKgM2)} kg/m²`}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Aggregate mass from the current stack
                </span>
              }
            />
            <MetricCard
              label="Thickness"
              value={`${formatDecimal(result.metrics.totalThicknessMm)} mm`}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Layers3 className="h-4 w-4" />
                  Full build-up depth
                </span>
              }
            />
            <MetricCard
              label="Cavities and fill"
              value={`${result.metrics.airGapCount} / ${result.metrics.insulationCount}`}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                gaps / porous zones
                </span>
              }
            />
            {dynamicTrace && airborneAnswerVisible ? (
              <MetricCard
                label="Detected family"
                value={dynamicTrace.detectedFamilyLabel}
                detail={`${dynamicTrace.visibleLeafCount} visible leaves · ${dynamicTrace.cavityCount} cavity zones`}
              />
            ) : null}
            {typeof lowerBoundImpact?.LnWUpperBound === "number" ? (
              <MetricCard
                label="Ln,w upper bound"
                value={`<= ${formatDecimal(lowerBoundImpact.LnWUpperBound)} dB`}
                detail={
                  result?.impactCatalogMatch?.lowerBoundImpact
                    ? "Conservative official product-row support"
                    : "Conservative bound-only family support"
                }
              />
            ) : null}
            {typeof lowerBoundImpact?.LnWPlusCIUpperBound === "number" ? (
              <MetricCard
                label="Ln,w+CI upper bound"
                value={`<= ${formatDecimal(lowerBoundImpact.LnWPlusCIUpperBound)} dB`}
                detail="Conservative combined bound from the active impact support lane"
              />
            ) : null}
            {dynamicImpactTrace ? (
              <MetricCard
                label="Impact lane"
                value={dynamicImpactTrace.selectedLabel}
                detail={`${dynamicImpactTrace.evidenceTierLabel} · ${dynamicImpactTrace.impactBasisLabel}`}
              />
            ) : null}
            {dynamicImpactTrace?.detectedSupportFamily ? (
              <MetricCard
                label="Impact support family"
                value={formatImpactSupportingElementFamily(dynamicImpactTrace.detectedSupportFamily)}
                detail={
                  dynamicImpactTrace.systemTypeLabel
                    ? `${dynamicImpactTrace.systemTypeLabel}${dynamicImpactTrace.supportFormLabel ? ` · ${dynamicImpactTrace.supportFormLabel}` : ""}`
                    : "Detected from the current floor lane"
                }
              />
            ) : null}
            {dynamicImpactTrace ? (
              <MetricCard
                label="Impact continuation"
                value={dynamicImpactTrace.fieldContinuationLabel}
                detail={
                  dynamicImpactTrace.fieldOutputsActive
                    ? `${dynamicImpactTrace.availableMetricLabels.join(", ") || "No active metrics"}`
                    : "Lab-side lane only"
                }
              />
            ) : null}
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
          Add at least one valid layer to generate a screening result.
        </div>
      )}
      <div className="mt-6 space-y-3">
        <div className="eyebrow">Notes</div>
        <ul className="grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
          {noteLines.map((warning) => (
            <li className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-3" key={warning}>
              {warning}
            </li>
          ))}
        </ul>
      </div>
    </SurfacePanel>
  );
}
