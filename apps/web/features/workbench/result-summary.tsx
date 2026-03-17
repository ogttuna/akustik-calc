"use client";

import { formatImpactSupportingElementFamily, type AssemblyCalculation } from "@dynecho/shared";
import { AudioLines, Gauge, Layers3, Scale, Waves } from "lucide-react";
import { MetricCard, Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import { getImpactLaneKind, getImpactLanePillLabel } from "./impact-lane-view";
import { ResultMeter } from "./result-meter";

type ResultSummaryProps = {
  result: AssemblyCalculation | null;
  warnings: readonly string[];
};

function formatSignedDb(value: number): string {
  return `${value >= 0 ? "+" : ""}${formatDecimal(value)} dB`;
}

export function ResultSummary({ result, warnings }: ResultSummaryProps) {
  const noteLines = Array.from(new Set<string>([...(result?.warnings ?? []), ...warnings]));
  const lowerBoundImpact = result?.lowerBoundImpact ?? null;
  const impactLaneKind = getImpactLaneKind({ impact: result?.impact, lowerBoundImpact });
  const dynamicTrace = result?.dynamicAirborneTrace ?? null;
  const dynamicImpactTrace = result?.dynamicImpactTrace ?? null;
  const activeCalculatorLabel = result?.calculatorLabel ?? "Screening Seed";

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={result?.calculatorId === "dynamic" ? "accent" : "neutral"}>{activeCalculatorLabel}</Pill>
        <Pill tone="neutral">Pure package boundary</Pill>
        <Pill tone="success">Curve-backed ratings</Pill>
        {dynamicTrace ? (
          <Pill tone={dynamicTrace.confidenceClass === "high" ? "success" : dynamicTrace.confidenceClass === "medium" ? "accent" : "warning"}>
            {dynamicTrace.detectedFamilyLabel}
          </Pill>
        ) : null}
        {result?.airborneOverlay?.leakagePenaltyApplied ? <Pill tone="warning">Leakage overlay</Pill> : null}
        {result?.airborneOverlay?.fieldFlankingPenaltyApplied ? <Pill tone="warning">Field flanking</Pill> : null}
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
        {result?.floorSystemEstimate ? <Pill tone="accent">Estimated floor family</Pill> : null}
        {result?.boundFloorSystemMatch ? <Pill tone="neutral">Bound floor family</Pill> : null}
        {result?.boundFloorSystemEstimate ? <Pill tone="neutral">Bound family estimate</Pill> : null}
        {!result?.floorSystemMatch && result?.floorSystemRecommendations.length ? <Pill tone="neutral">Near floor family</Pill> : null}
      </div>
      <div className="mt-5">
        <div className="eyebrow">Result panel</div>
        <h2 className="mt-1 font-display text-3xl tracking-[-0.04em]">Active acoustic output</h2>
      </div>
      {result ? (
        <>
          <div className="mt-6 rounded-[1.45rem] border hairline bg-[color:var(--panel-strong)] px-4 py-5">
            <ResultMeter value={result.metrics.estimatedRwDb} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Rw estimate"
              value={`${formatDecimal(result.metrics.estimatedRwDb)} dB`}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  {activeCalculatorLabel}
                </span>
              }
            />
            <MetricCard
              label="Airborne lane"
              value={activeCalculatorLabel}
              detail={
                dynamicTrace
                  ? `${dynamicTrace.selectedLabel} anchor · ${dynamicTrace.strategy.replaceAll("_", " ")}`
                  : result.metrics.method
              }
            />
            {dynamicTrace ? (
              <MetricCard
                label="Dynamic confidence"
                value={`${Math.round(dynamicTrace.confidenceScore * 100)}%`}
                detail={`${dynamicTrace.confidenceClass} confidence · ${dynamicTrace.solverSpreadRwDb} dB solver spread`}
              />
            ) : null}
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
            <MetricCard
              label="STC"
              value={`${formatDecimal(result.metrics.estimatedStc)} dB`}
              detail="ASTM E413 contour derived from the same screening curve"
            />
            <MetricCard
              label="Spectrum adaptation"
              value={`${formatSignedDb(result.metrics.estimatedCDb)} / ${formatSignedDb(result.metrics.estimatedCtrDb)}`}
              detail="C / Ctr for pink-noise and traffic-noise use cases"
            />
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
            {dynamicTrace ? (
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
        <div className="mt-6 rounded-[1.35rem] border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
          Add at least one valid layer to generate a screening result.
        </div>
      )}
      <div className="mt-6 space-y-3">
        <div className="eyebrow">Notes</div>
        <ul className="grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
          {noteLines.map((warning) => (
            <li className="rounded-[1.2rem] border hairline bg-black/[0.025] px-4 py-3" key={warning}>
              {warning}
            </li>
          ))}
        </ul>
      </div>
    </SurfacePanel>
  );
}
