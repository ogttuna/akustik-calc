import {
  type FloorSystemBoundEstimateResult,
  type FloorSystemBoundMatchResult,
  type FloorSystemEstimateResult,
  type FloorSystemMatchResult,
  type ImpactBoundCalculation,
  type ImpactCalculation,
  type ImpactCatalogMatchResult,
  type ImpactPredictorInputMode,
  type ImpactPredictorStatus
} from "@dynecho/shared";

import { type TargetOutputSupportResult } from "./target-output-support";

type BuildImpactPredictorStatusInput = {
  boundFloorSystemEstimate?: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch?: FloorSystemBoundMatchResult | null;
  floorSystemEstimate?: FloorSystemEstimateResult | null;
  floorSystemMatch?: FloorSystemMatchResult | null;
  hasImpactContext?: boolean;
  impact: ImpactCalculation | null;
  impactCatalogMatch?: ImpactCatalogMatchResult | null;
  lowerBoundImpact: ImpactBoundCalculation | null;
  predictorInputMode?: ImpactPredictorInputMode;
  predictorInputActive?: boolean;
  targetOutputSupport: TargetOutputSupportResult;
};

const FAMILY_ESTIMATE_BASES = new Set<ImpactCalculation["basis"]>([
  "predictor_floor_system_family_archetype_estimate",
  "predictor_floor_system_family_general_estimate",
  "predictor_floor_system_low_confidence_estimate",
  "predictor_lightweight_steel_fl28_interpolation_estimate"
]);

const FORMULA_BASIS_LABELS = new Set<string>([
  "predictor_heavy_bare_floor_iso12354_annexc_estimate",
  "predictor_bare_massive_floor_iso12354_annexc_estimate",
  "predictor_heavy_floating_floor_iso12354_annexc_estimate",
  "predictor_heavy_concrete_published_upper_treatment_estimate"
]);

function hasFormulaMetricBasis(impact: ImpactCalculation | null): boolean {
  if (!impact?.metricBasis) {
    return false;
  }

  return Object.values(impact.metricBasis).some((value) => FORMULA_BASIS_LABELS.has(value));
}

export function buildImpactPredictorStatus(
  input: BuildImpactPredictorStatusInput
): ImpactPredictorStatus | null {
  const matchedFloorSystemId =
    input.floorSystemMatch?.system.id ??
    input.boundFloorSystemMatch?.system.id ??
    undefined;
  const matchedCatalogCaseId = input.impactCatalogMatch?.catalog.id;
  const implementedLowConfidenceEstimate = input.floorSystemEstimate?.kind === "low_confidence";
  const implementedFamilyEstimate = Boolean(
    input.floorSystemEstimate ||
      input.boundFloorSystemEstimate ||
      (input.impact && FAMILY_ESTIMATE_BASES.has(input.impact.basis))
  );
  const implementedFormulaEstimate = Boolean(
    input.impact && (FORMULA_BASIS_LABELS.has(input.impact.basis) || hasFormulaMetricBasis(input.impact))
  );
  const active = Boolean(
    input.predictorInputActive ||
      input.impact ||
      input.lowerBoundImpact ||
      matchedFloorSystemId ||
      matchedCatalogCaseId ||
      implementedFamilyEstimate ||
      implementedFormulaEstimate
  );
  const futureSupportedTargetOutputs = input.targetOutputSupport.unsupportedImpactOutputs;
  const shouldExpose =
    active ||
    futureSupportedTargetOutputs.length > 0 ||
    input.targetOutputSupport.supportedImpactOutputs.length > 0;

  if (!shouldExpose) {
    return null;
  }

  const notes: string[] = [];
  const warnings: string[] = [];

  if (matchedFloorSystemId) {
    notes.push(`Matched curated floor-system row: ${matchedFloorSystemId}.`);
  }

  if (matchedCatalogCaseId) {
    notes.push(`Matched official impact-product row: ${matchedCatalogCaseId}.`);
  }

  if (matchedCatalogCaseId && input.lowerBoundImpact && input.impact) {
    notes.push("Official lower-bound catalog support remains visible beside the live estimate.");
  }

  if (input.predictorInputMode === "derived_from_visible_layers") {
    notes.push("Predictor topology was derived from visible floor-role layers; no hidden family selector is active.");
  } else if (input.predictorInputMode === "explicit_predictor_input") {
    notes.push("Predictor topology was supplied explicitly at the engine boundary.");
  }

  if (implementedFormulaEstimate) {
    notes.push("Implemented formula estimate is active.");
    notes.push("Annex C style relation is active on the current impact lane.");
  }

  if (input.impact?.fieldEstimateProfile === "direct_flanking_energy_sum") {
    notes.push("Direct+flanking field estimate is active on the current impact lane.");
    if (typeof input.impact.fieldEstimateFlankingPathCount === "number") {
      notes.push(`Current field estimate carries ${input.impact.fieldEstimateFlankingPathCount} active flanking path(s).`);
    }
  }

  if (implementedFamilyEstimate) {
    notes.push("Implemented family estimate is active.");
  }

  if (implementedLowConfidenceEstimate) {
    notes.push("Low-confidence fallback estimate is active.");
  }

  if (input.hasImpactContext) {
    notes.push("Field-side normalization is active; planned solver handoff stays lab-side first.");
  }

  if (futureSupportedTargetOutputs.length > 0) {
    warnings.push(
      `Requested impact outputs remain unsupported on the current lane: ${futureSupportedTargetOutputs.join(", ")}.`
    );
  }

  if (input.lowerBoundImpact && !input.impact) {
    warnings.push("Only conservative upper-bound impact support is available on the current lane.");
  }

  return {
    active,
    futureSupportedTargetOutputs,
    implementedFamilyEstimate,
    implementedFormulaEstimate,
    implementedLowConfidenceEstimate,
    inputMode: input.predictorInputMode,
    lowerBoundImpact: input.lowerBoundImpact,
    matchedCatalogCaseId,
    matchedFloorSystemId,
    notes,
    readyForPlannedSolver: active && !input.hasImpactContext && input.impact?.labOrField !== "field" && futureSupportedTargetOutputs.length === 0,
    warnings
  };
}
