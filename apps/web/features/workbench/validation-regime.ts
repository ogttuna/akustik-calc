import {
  formatImpactValidationTolerance,
  getImpactValidationFamilyIdFromSupportFamily,
  getImpactValidationFamilyRegimeById,
  getImpactValidationModeRegimeById,
  IMPACT_VALIDATION_CORPUS_SUMMARY,
  IMPACT_VALIDATION_FAMILY_MATRIX,
  IMPACT_VALIDATION_MODE_MATRIX
} from "@dynecho/engine";
import type { AssemblyCalculation, DynamicAirborneTrace } from "@dynecho/shared";

import { getImpactLaneKind, getImpactLanePillLabel } from "./impact-lane-view";

export type ValidationPosture = {
  detail: string;
  label: string;
  posture: "bound" | "estimate" | "exact" | "inactive" | "low_confidence";
};

export type ValidationCoverageSnapshotRow = {
  benchmarkMix: string;
  fieldCoverageLabel: string;
  floorCoverageLabel: string;
  focusDetail: string;
  focusLabel: string;
  id: string;
  label: string;
};

export type ValidationHardeningTask = {
  detail: string;
  familyLabels: string[];
  id: string;
  label: string;
};

export type AirborneBoundaryPosture = {
  detail: string;
  label: string;
};

export function getAirborneBoundaryPosture(
  trace: DynamicAirborneTrace | null | undefined
): AirborneBoundaryPosture | null {
  if (!trace) {
    return null;
  }

  const runnerUpLabel = trace.runnerUpFamilyLabel ?? "another nearby family";
  const multiplePlausibleDetail =
    trace.familyDecisionMultiplePlausibleFamilies && trace.secondaryRunnerUpFamilyLabel
      ? ` A second nearby family also remains plausible: ${trace.secondaryRunnerUpFamilyLabel}.`
      : "";

  if (trace.familyDecisionClass === "ambiguous") {
    if (trace.familyDecisionSelectedBelowRunnerUp) {
      return {
        detail: `The current wall read sits on an ambiguous boundary with ${runnerUpLabel}, and the nearby ${runnerUpLabel} corridor is still slightly ahead, so the selector is staying on ${trace.detectedFamilyLabel} as a protected corridor hold rather than a clean win.${multiplePlausibleDetail}`,
        label: `Ambiguous boundary with ${runnerUpLabel} · protected corridor hold`
      };
    }

    return {
      detail: `The current wall read sits on an ambiguous boundary with ${runnerUpLabel}, and a conservative family-boundary hold is active.${multiplePlausibleDetail}`,
      label: `Ambiguous boundary with ${runnerUpLabel} · family hold`
    };
  }

  if (trace.familyDecisionClass === "narrow") {
    return {
      detail: `The current wall read stays on a narrow boundary with ${runnerUpLabel}, and a conservative family-boundary hold is active.${multiplePlausibleDetail}`,
      label: `Narrow boundary with ${runnerUpLabel} · family hold`
    };
  }

  if (trace.familyBoundaryHoldApplied) {
    return {
      detail: `A conservative family-boundary hold remains active because ${runnerUpLabel} still sits nearby on the current corridor.${multiplePlausibleDetail}`,
      label: `Family-boundary hold near ${runnerUpLabel}`
    };
  }

  return null;
}

export function describeImpactValidationPosture(result: AssemblyCalculation | null): ValidationPosture {
  if (!result) {
    return {
      detail: "No live impact lane exists yet. Build a supported topology before reading any delivery confidence.",
      label: "Awaiting supported lane",
      posture: "inactive"
    };
  }

  const trace = result.dynamicImpactTrace;
  if (trace) {
    if (trace.estimateTier === "low_confidence") {
      return {
        detail:
          "The active impact lane is the final published-family fallback. It remains source-backed, but it should be read as a last-resort low-confidence output rather than a narrow same-family estimate.",
        label: trace.estimateTierLabel ?? "Low-confidence family fallback",
        posture: "low_confidence"
      };
    }

    if (trace.evidenceTier === "exact") {
      return {
        detail:
          "The active lane is anchored by an exact floor-system row, official catalog row, or imported exact band source. This is the cleanest reporting posture in the current repo.",
        label: trace.selectionKindLabel,
        posture: "exact"
      };
    }

    if (trace.evidenceTier === "bound") {
      return {
        detail:
          "The active floor lane is conservative support only. Treat the current number as an upper bound or bound-assisted continuation, not as a claimed exact measurement surrogate.",
        label: trace.selectionKindLabel,
        posture: "bound"
      };
    }

    return {
      detail:
        "The active floor lane is a scoped estimate. It is benchmark-guarded, but it still needs explicit source citation or tolerance notes before it is presented as a final acoustic claim.",
      label: trace.selectionKindLabel,
      posture: "estimate"
    };
  }

  if (result.lowerBoundImpact && !result.impact) {
    return {
      detail:
        "Only a conservative impact-support lane is available right now. DynEcho is intentionally refusing to fabricate a precise live Ln,w family result outside supported scope.",
      label: "Bound support only",
      posture: "bound"
    };
  }

  if (result.impact) {
    if (result.impact.basis === "predictor_floor_system_low_confidence_estimate") {
      return {
        detail:
          "The live impact output is coming from the final published-family fallback. It stays source-backed and non-empty, but it sits below the narrower same-family estimate corridors.",
        label: "Low-confidence family fallback",
        posture: "low_confidence"
      };
    }

    const laneKind = getImpactLaneKind({ impact: result.impact, lowerBoundImpact: result.lowerBoundImpact });
    return {
      detail:
        laneKind === "scoped_formula"
          ? "The live impact output is coming from a narrow formula branch. Keep it in early-stage screening or clearly label it as scoped predictor output."
          : "The live impact output is active, but the richer dynamic trace is not attached. Read the basis string before treating it as a delivery-ready claim.",
      label: getImpactLanePillLabel(laneKind),
      posture: laneKind === "scoped_formula" ? "estimate" : "exact"
    };
  }

  return {
    detail: "No supported impact output is active on the current stack.",
    label: "No live lane",
    posture: "inactive"
  };
}

export function describeAirborneValidationPosture(result: AssemblyCalculation | null): ValidationPosture {
  if (!result) {
    return {
      detail: "Airborne screening becomes legible once the layer stack is valid.",
      label: "Waiting for stack",
      posture: "inactive"
    };
  }

  const trace = result.dynamicAirborneTrace;
  if (trace) {
    const boundaryPosture = getAirborneBoundaryPosture(trace);

    return {
      detail:
        `${trace.detectedFamilyLabel} is the current airborne family read with ${trace.confidenceClass} confidence. ` +
        `Solver spread is currently ${trace.solverSpreadRwDb} dB across the candidate family set.` +
        (boundaryPosture ? ` ${boundaryPosture.detail}` : ""),
      label: `${trace.selectedLabel} anchor`,
      posture: "estimate"
    };
  }

  return {
    detail: "A comparison calculator is active without the family-aware dynamic selector. The result is still local and curve-backed, but not trace-ranked.",
    label: result.calculatorLabel ?? "Screening seed",
    posture: "estimate"
  };
}

export function getActiveValidationFamily(result: AssemblyCalculation | null) {
  const supportFamily = result?.dynamicImpactTrace?.detectedSupportFamily;
  return getImpactValidationFamilyRegimeById(getImpactValidationFamilyIdFromSupportFamily(supportFamily));
}

export function getActiveValidationMode(result: AssemblyCalculation | null) {
  const impact = result?.impact ?? null;
  const lowerBoundImpact = result?.lowerBoundImpact ?? null;
  const predictorStatus = result?.impactPredictorStatus ?? null;
  const trace = result?.dynamicImpactTrace ?? null;

  const impactBasis = impact?.basis ?? null;
  const lPrimeNwBasis = impact?.metricBasis?.LPrimeNW ?? null;
  const lPrimeNTwBasis = impact?.metricBasis?.LPrimeNTw ?? null;

  if (
    lPrimeNTwBasis === "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume" ||
    trace?.fieldContinuation === "standardized_room_volume" ||
    trace?.fieldContinuation === "bound_room_volume"
  ) {
    return getImpactValidationModeRegimeById("field_standardized_volume_estimate");
  }

  if (
    lPrimeNwBasis === "estimated_field_lprimenw_from_lnw_plus_k" ||
    trace?.fieldContinuation === "explicit_k_correction" ||
    trace?.fieldContinuation === "direct_flanking_energy_sum"
  ) {
    return getImpactValidationModeRegimeById("field_explicit_k_estimate");
  }

  if (
    predictorStatus?.implementedFormulaEstimate &&
    predictorStatus.matchedCatalogCaseId &&
    lowerBoundImpact
  ) {
    return getImpactValidationModeRegimeById("formula_plus_lower_bound");
  }

  if (trace?.selectionKind === "exact_floor_system") {
    return getImpactValidationModeRegimeById("official_floor_system");
  }

  if (trace?.selectionKind === "bound_floor_system") {
    return getImpactValidationModeRegimeById("official_floor_system_bound");
  }

  if (trace?.selectionKind === "official_catalog") {
    return getImpactValidationModeRegimeById("official_catalog_exact");
  }

  if (
    trace?.selectionKind === "formula_estimate" ||
    impactBasis === "predictor_heavy_bare_floor_iso12354_annexc_estimate" ||
    impactBasis === "predictor_heavy_floating_floor_iso12354_annexc_estimate"
  ) {
    return getImpactValidationModeRegimeById("formula_estimate");
  }

  if (trace?.selectionKind === "bound_family_estimate") {
    return getImpactValidationModeRegimeById("family_specific_bound_estimate");
  }

  if (
    impactBasis === "predictor_lightweight_steel_bound_interpolation_estimate" ||
    impactBasis === "predictor_lightweight_steel_missing_support_form_bound_estimate"
  ) {
    return getImpactValidationModeRegimeById("family_specific_bound_estimate");
  }

  if (impactBasis === "predictor_floor_system_family_archetype_estimate") {
    return getImpactValidationModeRegimeById("family_archetype_estimate");
  }

  if (impactBasis === "predictor_floor_system_family_general_estimate") {
    return getImpactValidationModeRegimeById("family_general_estimate");
  }

  if (impactBasis === "predictor_floor_system_low_confidence_estimate") {
    return getImpactValidationModeRegimeById("low_confidence_estimate");
  }

  if (
    impactBasis === "predictor_heavy_concrete_published_upper_treatment_estimate" ||
    impactBasis === "predictor_composite_panel_published_interaction_estimate" ||
    impactBasis === "predictor_mass_timber_clt_bare_interpolation_estimate" ||
    impactBasis === "predictor_mass_timber_clt_dry_interaction_estimate" ||
    impactBasis === "predictor_mass_timber_clt_dataholz_dry_estimate" ||
    impactBasis === "predictor_lightweight_steel_fl28_interpolation_estimate"
  ) {
    return getImpactValidationModeRegimeById("family_specific_estimate");
  }

  return null;
}

export function formatFloorCoverageLabel(value: "bound" | "estimate" | "exact"): string {
  switch (value) {
    case "exact":
      return "Exact floor lane";
    case "estimate":
      return "Estimated floor lane";
    case "bound":
      return "Bound floor lane";
  }
}

export function formatFieldCoverageLabel(value: "bound" | "live" | "staged"): string {
  switch (value) {
    case "live":
      return "Field continuation live";
    case "bound":
      return "Field continuation bound";
    case "staged":
      return "Field continuation staged";
  }
}

export function formatValidationModePostureLabel(
  value: "bound" | "estimate" | "exact" | "field" | "low_confidence"
): string {
  switch (value) {
    case "exact":
      return "Exact benchmark mode";
    case "estimate":
      return "Estimate benchmark mode";
    case "bound":
      return "Bound benchmark mode";
    case "field":
      return "Field benchmark mode";
    case "low_confidence":
      return "Low-confidence benchmark mode";
  }
}

export function formatValidationFamilyBenchmarkMix(
  entry: (typeof IMPACT_VALIDATION_FAMILY_MATRIX)[number]
): string {
  const parts = [
    entry.postureCaseCounts.exact > 0 ? `${entry.postureCaseCounts.exact} exact` : null,
    entry.postureCaseCounts.estimate > 0 ? `${entry.postureCaseCounts.estimate} estimate` : null,
    entry.postureCaseCounts.low_confidence > 0 ? `${entry.postureCaseCounts.low_confidence} low confidence` : null,
    entry.postureCaseCounts.bound > 0 ? `${entry.postureCaseCounts.bound} bound` : null,
    entry.postureCaseCounts.field > 0 ? `${entry.postureCaseCounts.field} field` : null
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(" · ") : "No tracked benchmark mix";
}

export function getValidationCoverageSnapshotRows(): ValidationCoverageSnapshotRow[] {
  return IMPACT_VALIDATION_FAMILY_MATRIX.map((entry) => {
    let focusLabel = "Broadly covered";
    let focusDetail = "Exact, estimate, and field evidence are already separated without a live low-confidence escape hatch.";

    if (entry.postureCaseCounts.low_confidence > 0) {
      focusLabel = "Remaining low-confidence lane";
      focusDetail = `${entry.postureCaseCounts.low_confidence} benchmark case still needs the final fallback lane, so this family remains the sharpest place to tighten topology support next.`;
    } else if (entry.fieldCoverage === "staged") {
      focusLabel = "Field continuation staged";
      focusDetail = "Floor-side coverage exists, but the in-situ continuation corpus is not live yet for this family.";
    } else if (entry.floorCoverage === "estimate" && entry.postureCaseCounts.exact === 0) {
      focusLabel = "Estimate-led floor corridor";
      focusDetail = "This family is already guarded, but the floor-side corpus still leans on family estimates rather than exact anchors.";
    } else if (entry.floorCoverage === "bound" || entry.fieldCoverage === "bound") {
      focusLabel = "Conservative bound corridor";
      focusDetail = "Part of this family still resolves through a bound-only guard instead of a live same-family result.";
    }

    return {
      benchmarkMix: formatValidationFamilyBenchmarkMix(entry),
      fieldCoverageLabel: formatFieldCoverageLabel(entry.fieldCoverage),
      floorCoverageLabel: formatFloorCoverageLabel(entry.floorCoverage),
      focusDetail,
      focusLabel,
      id: entry.id,
      label: entry.label
    };
  });
}

export function getValidationHardeningTasks(): ValidationHardeningTask[] {
  const lowConfidenceFamilies = IMPACT_VALIDATION_FAMILY_MATRIX.filter(
    (entry) => entry.postureCaseCounts.low_confidence > 0
  ).map((entry) => entry.label);
  const stagedFieldFamilies = IMPACT_VALIDATION_FAMILY_MATRIX.filter(
    (entry) => entry.fieldCoverage === "staged"
  ).map((entry) => entry.label);
  const estimateLedFamilies = IMPACT_VALIDATION_FAMILY_MATRIX.filter(
    (entry) => entry.floorCoverage === "estimate" && entry.postureCaseCounts.exact === 0
  ).map((entry) => entry.label);
  const boundFamilies = IMPACT_VALIDATION_FAMILY_MATRIX.filter(
    (entry) => entry.floorCoverage === "bound" || entry.fieldCoverage === "bound"
  ).map((entry) => entry.label);

  const tasks: ValidationHardeningTask[] = [];

  if (lowConfidenceFamilies.length > 0) {
    tasks.push({
      detail:
        "Retire the last low-confidence family lane or keep shrinking its scope until no published-family fallback is needed for that topology.",
      familyLabels: lowConfidenceFamilies,
      id: "retire-low-confidence",
      label: "Retire the remaining low-confidence lane"
    });
  }

  if (stagedFieldFamilies.length > 0) {
    tasks.push({
      detail:
        "Add real field continuation anchors so L'n,w and L'nT,w coverage stops lagging behind the floor-side family map.",
      familyLabels: stagedFieldFamilies,
      id: "expand-field-continuation",
      label: "Expand staged field continuation families"
    });
  }

  if (estimateLedFamilies.length > 0) {
    tasks.push({
      detail:
        "Tighten the estimate-led floor corridors with narrower archetypes or exact anchors before broad family estimates become the default read.",
      familyLabels: estimateLedFamilies,
      id: "tighten-estimate-led-floor",
      label: "Tighten estimate-led floor corridors"
    });
  }

  if (boundFamilies.length > 0) {
    tasks.push({
      detail:
        "Replace conservative bound-only support with live same-family evidence where possible, especially on lab-to-field continuation edges.",
      familyLabels: boundFamilies,
      id: "replace-bound-corridors",
      label: "Replace bound-only support where possible"
    });
  }

  return tasks;
}

export function getValidationFamilyModeRows(
  entry: (typeof IMPACT_VALIDATION_FAMILY_MATRIX)[number]
): Array<{
  caseCount: number;
  id: string;
  label: string;
  posture: "bound" | "estimate" | "exact" | "field" | "low_confidence";
}> {
  return entry.modeDistribution.reduce<Array<{
    caseCount: number;
    id: string;
    label: string;
    posture: "bound" | "estimate" | "exact" | "field" | "low_confidence";
  }>>((rows, distribution) => {
      const regime = getImpactValidationModeRegimeById(distribution.id);

      if (!regime) {
        return rows;
      }

      rows.push({
        caseCount: distribution.caseCount,
        id: distribution.id,
        label: regime.label,
        posture: regime.posture
      });

      return rows;
    }, []);
}

export {
  formatImpactValidationTolerance,
  IMPACT_VALIDATION_CORPUS_SUMMARY,
  IMPACT_VALIDATION_FAMILY_MATRIX,
  IMPACT_VALIDATION_MODE_MATRIX
};
