"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { Drum, Layers3, Orbit, ShieldAlert } from "lucide-react";

import { MetricCard, Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import {
  formatConfidenceLevel,
  formatConfidenceProvenance,
  formatConfidenceProvenanceForImpact,
  formatConfidenceScore,
  getConfidenceTone
} from "./impact-confidence-view";
import {
  formatImpactMetricBasisLabel,
  getActiveImpactMetricBasisRows
} from "./impact-metric-basis-view";
import { ImpactMetricChart } from "./impact-metric-chart";
import {
  getImpactLaneHeadline,
  getImpactLaneKind,
  getImpactLaneNarrative,
  getImpactLanePillLabel
} from "./impact-lane-view";
import { isReinforcedConcreteLowConfidenceFloorLane } from "./reinforced-concrete-low-confidence-floor-lane";

type ImpactResultPanelProps = {
  result: AssemblyCalculation | null;
};

export function ImpactResultPanel({ result }: ImpactResultPanelProps) {
  const impact = result?.impact ?? null;
  const lowerBoundImpact = result?.lowerBoundImpact ?? null;
  const floorSystemMatch = result?.floorSystemMatch ?? null;
  const floorSystemEstimate = result?.floorSystemEstimate ?? null;
  const boundFloorSystemMatch = result?.boundFloorSystemMatch ?? null;
  const boundFloorSystemEstimate = result?.boundFloorSystemEstimate ?? null;
  const laneKind = getImpactLaneKind({ impact, lowerBoundImpact });
  const metricBasisRows = getActiveImpactMetricBasisRows(impact);
  const reinforcedConcreteLowConfidence = isReinforcedConcreteLowConfidenceFloorLane(result);
  const primaryMetricLabel = impact?.labOrField === "field" ? "L'nT,w" : "Ln,w";
  const primaryMetricValue =
    impact?.labOrField === "field" ? impact?.LPrimeNTw ?? null : impact?.LnW ?? null;
  const floorEstimatePillLabel =
    floorSystemEstimate?.kind === "low_confidence" ? "Low-confidence floor fallback" : "Published family estimate";
  const floorEstimatePillTone = floorSystemEstimate?.kind === "low_confidence" ? "warning" : "accent";

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Impact lane</Pill>
        <Pill tone={impact ? "success" : lowerBoundImpact ? "neutral" : "warning"}>{getImpactLanePillLabel(laneKind)}</Pill>
        {result?.impactCatalogMatch ? <Pill tone="neutral">Official product evidence</Pill> : null}
        {floorSystemMatch ? <Pill tone="success">Exact family companion</Pill> : null}
        {floorSystemEstimate ? <Pill tone={floorEstimatePillTone}>{floorEstimatePillLabel}</Pill> : null}
        {boundFloorSystemMatch ? <Pill tone="neutral">Official bound family</Pill> : null}
        {boundFloorSystemEstimate ? <Pill tone="neutral">Bound interpolation</Pill> : null}
        {impact && (typeof impact.LPrimeNW === "number" || typeof impact.LPrimeNTw === "number") ? (
          <Pill tone="accent">Live field supplement</Pill>
        ) : null}
        {impact?.guideEstimateProfile ? <Pill tone="accent">TR simple guide</Pill> : null}
        {impact ? <Pill tone={getConfidenceTone(impact.confidence.level)}>{formatConfidenceLevel(impact.confidence.level)}</Pill> : null}
        {!impact && lowerBoundImpact ? (
          <Pill tone={getConfidenceTone(lowerBoundImpact.confidence.level)}>
            {formatConfidenceLevel(lowerBoundImpact.confidence.level)}
          </Pill>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="eyebrow">Floor impact</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">{getImpactLaneHeadline(laneKind)}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          {getImpactLaneNarrative(laneKind, Boolean(floorSystemMatch))}
        </p>
      </div>

      {impact ? (
        <>
          {!impact.trace ? <ImpactMetricChart impact={impact} /> : null}

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label={primaryMetricLabel}
              value={typeof primaryMetricValue === "number" ? `${formatDecimal(primaryMetricValue)} dB` : "N/A"}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Drum className="h-4 w-4" />
                  {laneKind === "published_family" && floorSystemEstimate
                    ? `${impact.basis} · ${floorSystemEstimate.structuralFamily}`
                    : impact.basis}
                </span>
              }
            />
            <MetricCard
              label="DeltaLw"
              value={typeof impact.DeltaLw === "number" ? `${formatDecimal(impact.DeltaLw)} dB` : "N/A"}
              detail={
                laneKind === "exact_source"
                  ? "Unavailable unless the source explicitly carries a heavy-reference improvement path"
                  : laneKind === "official_catalog"
                    ? "Official product improvement term or companion value"
                    : "Heavy reference improvement term for the current scoped path"
              }
            />
            <MetricCard
              label="CI"
              value={
                typeof impact.CI === "number"
                  ? `${impact.CI >= 0 ? "+" : ""}${formatDecimal(impact.CI)} dB`
                  : "N/A"
              }
              detail={
                <span className="inline-flex items-center gap-2">
                  <Layers3 className="h-4 w-4" />
                  Low-frequency adaptation term from the imported impact curve
                </span>
              }
            />
            <MetricCard
              label="CI,50-2500"
              value={
                typeof impact.CI50_2500 === "number"
                  ? `${impact.CI50_2500 >= 0 ? "+" : ""}${formatDecimal(impact.CI50_2500)} dB`
                  : "N/A"
              }
              detail={
                <span className="inline-flex items-center gap-2">
                  <Orbit className="h-4 w-4" />
                  Extended field-side companion term when 50..2500 Hz is available
                </span>
              }
            />
            {typeof impact.LnWPlusCI === "number" ? (
              <MetricCard
                label="Ln,w+CI"
                value={`${formatDecimal(impact.LnWPlusCI)} dB`}
                detail="Derived directly from the exact lab-side impact curve"
              />
            ) : null}
            {typeof impact.LPrimeNW === "number" ? (
              <MetricCard
                label="L'n,w"
                value={`${formatDecimal(impact.LPrimeNW)} dB`}
                detail="Live field-side supplement derived from the current stack"
              />
            ) : null}
            {typeof impact.LPrimeNTw === "number" ? (
              <MetricCard
                label="L'nT,w"
                value={`${formatDecimal(impact.LPrimeNTw)} dB`}
                detail={
                  impact.basis.includes("standardized_field_volume")
                    ? "Standardized field-volume normalization from the current stack"
                    : "TR small-room guide normalization from the current stack"
                }
              />
            ) : null}
            {typeof impact.LPrimeNT50 === "number" ? (
              <MetricCard
                label="L'nT,50"
                value={`${formatDecimal(impact.LPrimeNT50)} dB`}
                detail={
                  impact.guideEstimateProfile
                    ? "Turkish simple-guide carry-over from Ln,w+CI + K + Hd"
                    : impact.labOrField === "field"
                    ? "Derived directly from exact field-side impact bands"
                    : "Carried through the live stack field-side supplement lane"
                }
              />
            ) : null}
            {typeof impact.LnTA === "number" ? (
              <MetricCard
                label="LnT,A"
                value={`${formatDecimal(impact.LnTA)} dB`}
                detail="Dutch NEN 5077 A-weighted contact-sound companion derived from exact 125..2000 Hz field octave bands"
              />
            ) : null}
            {typeof impact.baseSurfaceMassKgM2 === "number" ? (
              <MetricCard
                label="Base surface mass"
                value={`${formatDecimal(impact.baseSurfaceMassKgM2)} kg/m²`}
                detail="Heavy base participating in the narrow estimate"
              />
            ) : null}
            {typeof impact.predictorResonanceHz === "number" ? (
              <MetricCard
                label="Resonance check"
                value={`${formatDecimal(impact.predictorResonanceHz)} Hz`}
                detail="Dynamic-stiffness cross-check"
              />
            ) : null}
            <MetricCard
              label="Confidence"
              value={`${formatConfidenceScore(impact.confidence.score)} · ${formatConfidenceLevel(impact.confidence.level)}`}
              detail={`${formatConfidenceProvenanceForImpact({
                basis: impact.basis,
                provenance: impact.confidence.provenance
              })} provenance${impact.bandSet ? ` · ${impact.bandSet}` : ""}`}
            />
          </div>

          <div className="mt-5 rounded-md border hairline bg-[color:var(--panel-strong)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            <span className="font-semibold text-[color:var(--ink)]">Trust note:</span> {impact.confidence.summary}
          </div>

          {metricBasisRows.length ? (
            <div className="mt-5 rounded-md border hairline bg-[color:var(--paper)] px-4 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <Pill tone="accent">Metric provenance</Pill>
                <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-soft)]">
                  which live metrics came from which lane
                </span>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {metricBasisRows.map((row) => (
                  <article
                    className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4"
                    key={`${row.metric}-${row.basis}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-[color:var(--ink)]">{row.label}</span>
                      <span className="rounded-full border hairline px-3 py-1 font-mono text-[11px] tracking-[0.08em] text-[color:var(--ink-soft)]">
                        {formatImpactMetricBasisLabel(row.basis)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{row.description}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {impact.estimateCandidateIds?.length ? (
            <div className="mt-3 rounded-md border hairline bg-[color:var(--panel)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
              <span className="font-semibold text-[color:var(--ink)]">
                {reinforcedConcreteLowConfidence ? "Ranked nearby published row ids:" : "Candidate lineage:"}
              </span>{" "}
              {impact.estimateCandidateIds.join(", ")}
            </div>
          ) : null}

          {lowerBoundImpact ? (
            <>
              <div className="mt-5 rounded-md border hairline bg-[color:var(--paper)] px-4 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Pill tone="neutral">Conservative support</Pill>
                  <Pill tone={getConfidenceTone(lowerBoundImpact.confidence.level)}>
                    {formatConfidenceLevel(lowerBoundImpact.confidence.level)}
                  </Pill>
                </div>
                <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                  An official or bound-only source also published a conservative support lane. DynEcho keeps it visible
                  alongside the live impact metric instead of overwriting the active Ln,w result.
                </p>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Ln,w upper bound"
                  value={typeof lowerBoundImpact.LnWUpperBound === "number" ? `<= ${formatDecimal(lowerBoundImpact.LnWUpperBound)} dB` : "N/A"}
                  detail="Conservative ceiling from the supporting evidence row"
                />
                <MetricCard
                  label="Ln,w+CI upper bound"
                  value={typeof lowerBoundImpact.LnWPlusCIUpperBound === "number" ? `<= ${formatDecimal(lowerBoundImpact.LnWPlusCIUpperBound)} dB` : "N/A"}
                  detail="Combined bound when the source does not publish split Ln,w and CI"
                />
                <MetricCard
                  label="DeltaLw lower bound"
                  value={typeof lowerBoundImpact.DeltaLwLowerBound === "number" ? `>= ${formatDecimal(lowerBoundImpact.DeltaLwLowerBound)} dB` : "N/A"}
                  detail="Published only when the supporting row states a minimum improvement"
                />
                <MetricCard
                  label="L'n,w upper bound"
                  value={typeof lowerBoundImpact.LPrimeNWUpperBound === "number" ? `<= ${formatDecimal(lowerBoundImpact.LPrimeNWUpperBound)} dB` : "N/A"}
                  detail="Field-side conservative carry-over"
                />
                <MetricCard
                  label="Confidence"
                  value={`${formatConfidenceScore(lowerBoundImpact.confidence.score)} · ${formatConfidenceLevel(lowerBoundImpact.confidence.level)}`}
                  detail={`${formatConfidenceProvenance(lowerBoundImpact.confidence.provenance)} provenance`}
                />
              </div>
            </>
          ) : null}

          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {impact
              .notes
              .concat(lowerBoundImpact ? lowerBoundImpact.notes : [])
              .map((note: string) => (
              <article className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4" key={note}>
                {note}
              </article>
              ))}
          </div>
        </>
      ) : lowerBoundImpact ? (
        <>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Ln,w upper bound"
              value={typeof lowerBoundImpact.LnWUpperBound === "number" ? `<= ${formatDecimal(lowerBoundImpact.LnWUpperBound)} dB` : "N/A"}
              detail="Official lightweight-steel bound support"
            />
            <MetricCard
              label="Ln,w+CI upper bound"
              value={typeof lowerBoundImpact.LnWPlusCIUpperBound === "number" ? `<= ${formatDecimal(lowerBoundImpact.LnWPlusCIUpperBound)} dB` : "N/A"}
              detail="Official combined bound support"
            />
            <MetricCard
              label="L'n,w upper bound"
              value={typeof lowerBoundImpact.LPrimeNWUpperBound === "number" ? `<= ${formatDecimal(lowerBoundImpact.LPrimeNWUpperBound)} dB` : "N/A"}
              detail="Conservative field-side carry-over from the current bound lane"
            />
            <MetricCard
              label="L'nT,w upper bound"
              value={typeof lowerBoundImpact.LPrimeNTwUpperBound === "number" ? `<= ${formatDecimal(lowerBoundImpact.LPrimeNTwUpperBound)} dB` : "N/A"}
              detail="Standardized field-volume or small-room upper-bound normalization"
            />
            <MetricCard
              label="DeltaLw lower bound"
              value={typeof lowerBoundImpact.DeltaLwLowerBound === "number" ? `>= ${formatDecimal(lowerBoundImpact.DeltaLwLowerBound)} dB` : "N/A"}
              detail="Only surfaced when the source family publishes a conservative improvement floor"
            />
            <MetricCard
              label="Confidence"
              value={`${formatConfidenceScore(lowerBoundImpact.confidence.score)} · ${formatConfidenceLevel(lowerBoundImpact.confidence.level)}`}
              detail={`${formatConfidenceProvenance(lowerBoundImpact.confidence.provenance)} provenance`}
            />
          </div>

          <div className="mt-5 rounded-md border hairline bg-[color:var(--panel-strong)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            <span className="font-semibold text-[color:var(--ink)]">Trust note:</span> {lowerBoundImpact.confidence.summary}
          </div>

          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {lowerBoundImpact.notes.map((note: string) => (
              <article className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4" key={note}>
                {note}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed hairline px-4 py-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <ShieldAlert className="h-4 w-4" />
            Why no live impact estimate?
          </div>
          <div className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            <p>The current stack does not match the supported narrow impact topology and no valid exact band source is active.</p>
            <p>Current requirements: bottom heavy concrete base, explicit resilient layer with dynamic stiffness, and carried screed or covering mass above that resilient layer. Official product rows can also activate when curated resilient products are present.</p>
          </div>
        </div>
      )}
    </SurfacePanel>
  );
}
