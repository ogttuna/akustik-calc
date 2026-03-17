"use client";

import { formatImpactSupportingElementFamily, type AssemblyCalculation } from "@dynecho/shared";
import { getFloorSystemCompanionLabel, getFloorSystemDerivedRwPlusCtr } from "@dynecho/shared";
import { Activity, FileStack, Orbit, Route, Waypoints } from "lucide-react";

import { MetricCard, Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import {
  formatConfidenceLevel,
  formatConfidenceProvenance,
  formatConfidenceScore
} from "./impact-confidence-view";

type ImpactTracePanelProps = {
  result: AssemblyCalculation | null;
};

type FamilyEstimateSourceSystem = NonNullable<NonNullable<AssemblyCalculation["floorSystemEstimate"]>["sourceSystems"]>[number];

function formatBasisLabel(value: string): string {
  switch (value) {
    case "predictor_heavy_concrete_floor_airborne_companion_estimate":
      return "Heavy-floor airborne companion";
    case "screening_mass_law_curve_seed_v3":
      return "Visible-stack airborne screening";
    default:
      return value.replaceAll("_", " ");
  }
}

function formatPredictorInputMode(value: string | undefined): string {
  switch (value) {
    case "derived_from_visible_layers":
      return "Derived from visible layers";
    case "explicit_predictor_input":
      return "Explicit engine input";
    default:
      return "No predictor input";
  }
}

function formatEstimateTier(value: string | undefined): string {
  switch (value) {
    case "family_archetype":
      return "Archetype family";
    case "family_general":
      return "Published family blend";
    case "low_confidence":
      return "Low-confidence fallback";
    default:
      return "N/A";
  }
}

function formatOutputList(outputs: readonly string[]): string {
  return outputs.length > 0 ? outputs.join(", ") : "None";
}

function getEvidenceTone(
  tier: "bound" | "derived" | "estimate" | "exact"
): "accent" | "neutral" | "success" | "warning" {
  switch (tier) {
    case "exact":
      return "success";
    case "estimate":
      return "accent";
    case "derived":
      return "neutral";
    case "bound":
      return "warning";
  }
}

export function ImpactTracePanel({ result }: ImpactTracePanelProps) {
  const status = result?.impactPredictorStatus ?? null;
  const support = result?.impactSupport ?? null;
  const floorSystemRatings = result?.floorSystemRatings ?? null;
  const familyEstimate = result?.floorSystemEstimate ?? null;
  const impact = result?.impact ?? null;
  const dynamicImpactTrace = result?.dynamicImpactTrace ?? null;
  const lowerBoundImpact = status?.lowerBoundImpact ?? result?.lowerBoundImpact ?? null;
  const companionLabel = floorSystemRatings ? getFloorSystemCompanionLabel(floorSystemRatings) : "Companion";
  const derivedRwPlusCtr =
    floorSystemRatings && typeof floorSystemRatings.RwCtr === "number"
      ? getFloorSystemDerivedRwPlusCtr(floorSystemRatings)
      : null;
  const candidateRowCount = impact?.estimateCandidateIds?.length ?? familyEstimate?.sourceSystems.length ?? 0;
  const sourceLineageLabels =
    familyEstimate?.sourceSystems.map((system: FamilyEstimateSourceSystem) => system.label) ?? [];
  const hiddenCandidateCount = Math.max(0, candidateRowCount - sourceLineageLabels.length);

  if (!status && !support && !floorSystemRatings && !lowerBoundImpact && !familyEstimate && !dynamicImpactTrace) {
    return null;
  }

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Predictor trace</Pill>
        {status ? <Pill tone={status.active ? "success" : "neutral"}>{status.active ? "Active lane" : "Passive lane"}</Pill> : null}
        {status ? (
          <Pill tone={status.readyForPlannedSolver ? "success" : "neutral"}>
            {status.readyForPlannedSolver ? "Ready for planned solver" : "Trace only"}
          </Pill>
        ) : null}
        {status?.implementedFormulaEstimate ? <Pill tone="accent">Formula lane</Pill> : null}
        {status?.implementedFamilyEstimate ? <Pill tone="accent">Family lane</Pill> : null}
        {status?.implementedLowConfidenceEstimate ? <Pill tone="warning">Low confidence</Pill> : null}
        {lowerBoundImpact ? <Pill tone="neutral">Upper-bound support</Pill> : null}
        {dynamicImpactTrace ? <Pill tone={getEvidenceTone(dynamicImpactTrace.evidenceTier)}>{dynamicImpactTrace.evidenceTierLabel}</Pill> : null}
        {dynamicImpactTrace?.fieldContinuation !== "none" ? <Pill tone="accent">{dynamicImpactTrace.fieldContinuationLabel}</Pill> : null}
        {support?.primaryCurveUnaffected ? <Pill tone="neutral">Airborne curve untouched</Pill> : null}
      </div>

      <div className="mt-5">
        <div className="eyebrow">Decision lineage</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">Predictor status and evidence trace</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          This panel shows which solver lane is active, which curated ids were matched, and whether the current result is exact, estimated, bound-only, or still staged for a later solver import.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Predictor input mode"
          value={formatPredictorInputMode(status?.inputMode)}
          detail="Whether this lane was driven by visible floor roles or an explicit engine-side predictor contract"
        />
        <MetricCard
          label="Matched floor-system row"
          value={status?.matchedFloorSystemId ?? "None"}
          detail={
            <span className="inline-flex items-center gap-2">
              <FileStack className="h-4 w-4" />
              Curated exact or bound family id
            </span>
          }
        />
        <MetricCard
          label="Matched catalog row"
          value={status?.matchedCatalogCaseId ?? "None"}
          detail={
            <span className="inline-flex items-center gap-2">
              <Route className="h-4 w-4" />
              Official product-system evidence id
            </span>
          }
        />
        <MetricCard
          label="Future supported outputs"
          value={formatOutputList(status?.futureSupportedTargetOutputs ?? [])}
          detail={
            <span className="inline-flex items-center gap-2">
              <Waypoints className="h-4 w-4" />
              Requested impact outputs not yet solved on this lane
            </span>
          }
        />
        <MetricCard
          label="Support basis"
          value={support?.basis ? formatBasisLabel(support.basis) : "N/A"}
          detail={
            <span className="inline-flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Structured impact-support contract from engine
            </span>
          }
        />
      </div>

      {dynamicImpactTrace ? (
        <div className="mt-5 rounded-[1.2rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="accent">Dynamic impact trace</Pill>
            <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-soft)]">
              selected lane, support family, and field continuation on the current floor path
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <MetricCard
              label="Selected lane"
              value={dynamicImpactTrace.selectedLabel}
              detail={dynamicImpactTrace.selectionKindLabel}
            />
            <MetricCard
              label="Evidence tier"
              value={dynamicImpactTrace.evidenceTierLabel}
              detail={`${formatConfidenceLevel(dynamicImpactTrace.confidenceClass)} · ${formatConfidenceScore(dynamicImpactTrace.confidenceScore)}`}
            />
            <MetricCard
              label="Support family"
              value={dynamicImpactTrace.detectedSupportFamily ? formatImpactSupportingElementFamily(dynamicImpactTrace.detectedSupportFamily) : "N/A"}
              detail={
                dynamicImpactTrace.systemTypeLabel
                  ? `${dynamicImpactTrace.systemTypeLabel}${dynamicImpactTrace.supportFormLabel ? ` · ${dynamicImpactTrace.supportFormLabel}` : ""}`
                  : "No explicit topology family"
              }
            />
            <MetricCard
              label="Field continuation"
              value={dynamicImpactTrace.fieldContinuationLabel}
              detail={dynamicImpactTrace.fieldOutputsActive ? "Field-side metrics are active on this lane" : "Lab-side only"}
            />
            <MetricCard
              label="Candidate rows"
              value={String(dynamicImpactTrace.candidateRowCount)}
              detail={
                typeof dynamicImpactTrace.fitPercent === "number"
                  ? `${formatDecimal(dynamicImpactTrace.fitPercent)}% fit inside the active family`
                  : "No family blend fit score on this lane"
              }
            />
            <MetricCard
              label="Basis"
              value={dynamicImpactTrace.impactBasisLabel}
              detail={dynamicImpactTrace.availableMetricLabels.join(", ") || "No exposed impact metrics"}
            />
          </div>

          <ul className="mt-4 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            {dynamicImpactTrace.notes.map((line: string) => (
              <li key={line}>- {line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {lowerBoundImpact ? (
        <div className="mt-5 rounded-[1.2rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="neutral">Support envelope</Pill>
            <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-soft)]">
              conservative bounds carried without fabricating a live impact metric
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Ln,w upper bound"
              value={
                typeof lowerBoundImpact.LnWUpperBound === "number"
                  ? `<= ${formatDecimal(lowerBoundImpact.LnWUpperBound)} dB`
                  : "N/A"
              }
              detail="Lab-side conservative ceiling preserved on the trace"
            />
            <MetricCard
              label="DeltaLw lower bound"
              value={
                typeof lowerBoundImpact.DeltaLwLowerBound === "number"
                  ? `>= ${formatDecimal(lowerBoundImpact.DeltaLwLowerBound)} dB`
                  : "N/A"
              }
              detail="Improvement floor only when the support lane publishes one"
            />
            <MetricCard
              label="L'n,w upper bound"
              value={
                typeof lowerBoundImpact.LPrimeNWUpperBound === "number"
                  ? `<= ${formatDecimal(lowerBoundImpact.LPrimeNWUpperBound)} dB`
                  : "N/A"
              }
              detail="Field-side conservative carry-over from the active support lane"
            />
            <MetricCard
              label="L'nT,w upper bound"
              value={
                typeof lowerBoundImpact.LPrimeNTwUpperBound === "number"
                  ? `<= ${formatDecimal(lowerBoundImpact.LPrimeNTwUpperBound)} dB`
                  : "N/A"
              }
              detail="Standardized or guide-side ceiling after K / V normalization"
            />
            <MetricCard
              label="Support confidence"
              value={`${formatConfidenceScore(lowerBoundImpact.confidence.score)} · ${formatConfidenceLevel(lowerBoundImpact.confidence.level)}`}
              detail={`${formatConfidenceProvenance(lowerBoundImpact.confidence.provenance)} provenance · ${formatBasisLabel(lowerBoundImpact.basis)}`}
            />
          </div>

          <ul className="mt-4 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            {lowerBoundImpact.notes.map((line: string) => (
              <li key={line}>- {line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {floorSystemRatings ? (
        <div className="mt-5 rounded-[1.2rem] border hairline bg-[color:var(--paper)] px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="accent">Companion airborne trace</Pill>
            <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-soft)]">
              floor-system ratings carried on the impact lane
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Rw" value={`${formatDecimal(floorSystemRatings.Rw)} dB`} detail="Companion airborne rating on the current impact lane" />
            <MetricCard
              label={companionLabel}
              value={
                typeof floorSystemRatings.RwCtr === "number"
                  ? `${formatDecimal(floorSystemRatings.RwCtr)} dB`
                  : "N/A"
              }
              detail={
                companionLabel === "Ctr" && typeof derivedRwPlusCtr === "number"
                  ? `Derived Rw + Ctr ${formatDecimal(derivedRwPlusCtr)} dB`
                  : "Published companion airborne figure"
              }
            />
            <MetricCard
              label="Basis"
              value={formatBasisLabel(floorSystemRatings.basis)}
              detail="Which lane supplied the companion airborne figure"
            />
            <MetricCard
              label="Curve relation"
              value={support?.primaryCurveType === "airborne_tl" ? "Airborne TL primary" : "Impact-led"}
              detail={
                support?.primaryCurveUnaffected
                  ? "Impact source changed the impact lane only; the airborne TL curve stayed on its own path."
                  : "Companion airborne ratings come from the active impact-family or screening lane."
              }
            />
          </div>
        </div>
      ) : null}

      {familyEstimate ? (
        <div className="mt-5 rounded-[1.2rem] border hairline bg-[color:var(--paper)] px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="accent">Family estimate trace</Pill>
            <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-soft)]">
              published solver lineage for non-exact floor families
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Estimate tier"
              value={formatEstimateTier(familyEstimate.kind)}
              detail="Whether this lane stayed on an archetype branch, broadened into a wider family blend, or fell to a low-confidence fallback"
            />
            <MetricCard
              label="Structural family"
              value={familyEstimate.structuralFamily}
              detail="The published family bucket that stayed active on the current impact lane"
            />
            <MetricCard
              label="Fit"
              value={`${formatDecimal(familyEstimate.fitPercent)}%`}
              detail="How closely the current topology stayed inside the active published family"
            />
            <MetricCard
              label="Candidate rows"
              value={String(candidateRowCount)}
              detail="Published rows ranked for this family estimate before the active blend was locked"
            />
            <MetricCard
              label="Estimate basis"
              value={formatBasisLabel(familyEstimate.impact.basis)}
              detail="Structured basis that now owns the current family estimate"
            />
          </div>

          {sourceLineageLabels.length ? (
            <div className="mt-4 rounded-[1rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Candidate lineage
              </div>
              <ul className="mt-3 grid gap-2 text-sm leading-7 text-[color:var(--ink-soft)]">
                {sourceLineageLabels.map((label: string) => (
                  <li className="rounded-[0.95rem] border hairline bg-[color:var(--paper)] px-3 py-3" key={label}>
                    {label}
                  </li>
                ))}
                {hiddenCandidateCount > 0 ? (
                  <li className="rounded-[0.95rem] border hairline bg-[color:var(--paper)] px-3 py-3">
                    +{hiddenCandidateCount} more ranked candidate row{hiddenCandidateCount === 1 ? "" : "s"} in the solver trace
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {impact?.fieldEstimateProfile === "direct_flanking_energy_sum" ? (
        <div className="mt-5 rounded-[1.2rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="accent">Field path trace</Pill>
            <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-soft)]">
              explicit direct and parallel-path assumptions active on this lane
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Direct offset"
              value={
                typeof impact.fieldEstimateDirectOffsetDb === "number"
                  ? `${formatDecimal(impact.fieldEstimateDirectOffsetDb)} dB`
                  : "N/A"
              }
              detail="Shift applied to the direct path before energy summation"
            />
            <MetricCard
              label="Active flanking paths"
              value={
                typeof impact.fieldEstimateFlankingPathCount === "number"
                  ? String(impact.fieldEstimateFlankingPathCount)
                  : "N/A"
              }
              detail="Parallel paths contributing to the current field estimate"
            />
            <MetricCard
              label="Max path modifier"
              value={
                typeof impact.fieldEstimateMaxPathModifierDb === "number"
                  ? `${formatDecimal(impact.fieldEstimateMaxPathModifierDb)} dB`
                  : "N/A"
              }
              detail="Strongest expert or family-aware path penalty currently active"
            />
            <MetricCard
              label="Family-aware models"
              value={
                impact.fieldEstimateFlankingFamilyModels?.length
                  ? impact.fieldEstimateFlankingFamilyModels.map(formatImpactSupportingElementFamily).join(", ")
                  : "Generic only"
              }
              detail="Default or explicit supporting-family bias used on the path set"
            />
            <MetricCard
              label="Direct-path ΔLd"
              value={
                typeof impact.fieldEstimateLowerTreatmentReductionDb === "number"
                  ? `${formatDecimal(impact.fieldEstimateLowerTreatmentReductionDb)} dB`
                  : "N/A"
              }
              detail="Explicit impact-side reduction applied only to the direct path"
            />
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.2rem] border hairline bg-black/[0.025] px-4 py-4">
          <div className="flex items-center gap-2">
            <Orbit className="h-4 w-4 text-[color:var(--accent)]" />
            <div className="text-sm font-semibold text-[color:var(--ink)]">Status notes</div>
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            {(status?.notes.length ? status.notes : ["No structured predictor-status notes on the current lane."]).map((line: string) => (
              <li key={line}>- {line}</li>
            ))}
            {(status?.warnings ?? []).map((line: string) => (
              <li className="text-[color:var(--warning)]" key={line}>
                - {line}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[1.2rem] border hairline bg-black/[0.025] px-4 py-4">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-[color:var(--accent)]" />
            <div className="text-sm font-semibold text-[color:var(--ink)]">Support notes</div>
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            {(support?.notes.length ? support.notes : ["No structured impact-support notes on the current lane."]).map((line: string) => (
              <li key={line}>- {line}</li>
            ))}
            {support?.labOrField ? <li>- Lane context: {support.labOrField}</li> : null}
            {support?.referenceFloorType ? <li>- Reference floor: {support.referenceFloorType}</li> : null}
          </ul>
          {support?.formulaNotes?.length ? (
            <div className="mt-4 rounded-[1rem] border hairline bg-[color:var(--paper)] px-4 py-4">
              <div className="flex items-center gap-2">
                <Pill tone="accent">Formula notes</Pill>
                <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-soft)]">
                  standards and derivations active on this lane
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
                {support.formulaNotes.map((line: string) => (
                  <li key={line}>- {line}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      </div>
    </SurfacePanel>
  );
}
