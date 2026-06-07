import {
  ImpactCalculationSchema,
  type AcousticInputFieldId,
  type ImpactCalculation,
  type ImpactErrorBudget,
  type ImpactErrorBudgetTerm,
  type ImpactPredictorInput
} from "@dynecho/shared";

import { isPredictorHeavyConcreteCarrierEligible } from "./heavy-concrete-carrier-eligibility";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { createImpactMetricBasis } from "./impact-metric-basis";
import { mergeImpactCalculations } from "./impact-merge";
import { ksRound1, log10Safe } from "./math";

export const LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS =
  "predictor_lightweight_concrete_delta_lw_dynamic_improvement_estimate" as const;

export const LIGHTWEIGHT_CONCRETE_DELTA_LW_SELECTED_CANDIDATE_ID =
  "floor.lightweight_concrete.delta_lw_dynamic_improvement" as const;

export const LIGHTWEIGHT_CONCRETE_DELTA_LW_TOLERANCE_DB = 8;

export const LIGHTWEIGHT_CONCRETE_DELTA_LW_REQUIRED_FIELDS = [
  "baseSlabOrFloor",
  "toppingOrFloatingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2"
] as const satisfies readonly AcousticInputFieldId[];

const LIGHTWEIGHT_DELTA_LW_FORMULA_NOTE =
  "Lightweight-concrete DeltaLw corridor used explicit load basis and resilient dynamic stiffness while keeping the lightweight-family Ln,w anchor separate.";

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function normalizeToken(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function hasUpperTreatmentOwner(input: ImpactPredictorInput): boolean {
  return Boolean(
    hasPositiveNumber(input.loadBasisKgM2) ||
      hasPositiveNumber(input.floorCovering?.thicknessMm) ||
      hasPositiveNumber(input.floatingScreed?.thicknessMm) ||
      hasPositiveNumber(input.upperFill?.thicknessMm)
  );
}

export function isLightweightConcreteDeltaLwCandidate(
  input: ImpactPredictorInput | null | undefined
): input is ImpactPredictorInput {
  if (
    !input ||
    input.structuralSupportType !== "reinforced_concrete" ||
    input.impactSystemType !== "heavy_floating_floor" ||
    input.officialFloorSystemId
  ) {
    return false;
  }

  const baseMaterialClass = normalizeToken(input.baseSlab?.materialClass);
  const lowDensityConcreteCarrier =
    hasPositiveNumber(input.baseSlab?.densityKgM3) &&
    !isPredictorHeavyConcreteCarrierEligible(input.baseSlab);
  const lightweightMaterialClass =
    baseMaterialClass.includes("lightweight") ||
    baseMaterialClass.includes("low_density") ||
    baseMaterialClass.includes("aerated") ||
    baseMaterialClass.includes("aac");

  return lowDensityConcreteCarrier || lightweightMaterialClass;
}

export function collectLightweightConcreteDeltaLwMissingPhysicalInputs(
  input: ImpactPredictorInput | null | undefined
): AcousticInputFieldId[] {
  if (!isLightweightConcreteDeltaLwCandidate(input)) {
    return [];
  }

  const missing: AcousticInputFieldId[] = [];

  if (!hasPositiveNumber(input.baseSlab?.thicknessMm)) {
    missing.push("baseSlabOrFloor");
  }
  if (!hasUpperTreatmentOwner(input)) {
    missing.push("toppingOrFloatingLayer");
  }
  if (!hasPositiveNumber(input.resilientLayer?.dynamicStiffnessMNm3)) {
    missing.push("resilientLayerDynamicStiffnessMNm3");
  }
  if (!hasPositiveNumber(input.loadBasisKgM2)) {
    missing.push("loadBasisKgM2");
  }

  return missing;
}

function term(
  termId: string,
  db: number,
  origin: string,
  reason: string,
  tightenRequires: readonly string[]
): ImpactErrorBudgetTerm {
  return {
    db,
    origin,
    reason,
    termId,
    tightenRequires: [...tightenRequires]
  };
}

export function buildLightweightConcreteDeltaLwErrorBudget(estimate: number): ImpactErrorBudget {
  const terms: ImpactErrorBudgetTerm[] = [
    term(
      "lightweight_carrier_family_spread",
      3,
      "source_absent_formula_assumption",
      "The carrier is a lightweight or low-density concrete family, not the heavy-concrete Annex-C carrier route.",
      ["same_family_lightweight_concrete_delta_lw_holdouts"]
    ),
    term(
      "dynamic_stiffness_precision",
      2,
      "explicit_user_input_precision",
      "Dynamic stiffness is supplied as a scalar s' value rather than a frequency-dependent product curve.",
      ["source_owned_dynamic_stiffness_or_product_curve"]
    ),
    term(
      "loaded_upper_mass_precision",
      1.8,
      "explicit_user_input_precision",
      "The loaded upper package is represented by an aggregate load basis.",
      ["source_owned_loaded_upper_mass_basis"]
    ),
    term(
      "delta_lw_holdout_absence",
      1.2,
      "missing_source_owned_holdout",
      "No promoted same-family lightweight-concrete ISO DeltaLw holdout is available for this runtime corridor yet.",
      ["same_basis_lightweight_concrete_delta_lw_holdout"]
    )
  ];

  return {
    estimate,
    max: ksRound1(estimate + LIGHTWEIGHT_CONCRETE_DELTA_LW_TOLERANCE_DB),
    metricId: "DeltaLw",
    min: ksRound1(estimate - LIGHTWEIGHT_CONCRETE_DELTA_LW_TOLERANCE_DB),
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    terms,
    toleranceDb: LIGHTWEIGHT_CONCRETE_DELTA_LW_TOLERANCE_DB,
    totalBudgetDb: ksRound1(terms.reduce((sum, item) => sum + item.db, 0))
  };
}

export function estimateLightweightConcreteDeltaLwFromPredictorInput(
  input: ImpactPredictorInput | null | undefined
): ImpactCalculation | null {
  if (!input || !isLightweightConcreteDeltaLwCandidate(input)) {
    return null;
  }

  if (collectLightweightConcreteDeltaLwMissingPhysicalInputs(input).length > 0) {
    return null;
  }

  const loadBasisKgM2 = input.loadBasisKgM2;
  const dynamicStiffnessMNm3 = input.resilientLayer?.dynamicStiffnessMNm3;

  if (!hasPositiveNumber(loadBasisKgM2) || !hasPositiveNumber(dynamicStiffnessMNm3)) {
    return null;
  }

  const deltaLw = ksRound1((13 * log10Safe(loadBasisKgM2)) - (14.2 * log10Safe(dynamicStiffnessMNm3)) + 20.8);
  const resonanceHz = ksRound1(160 * Math.sqrt(dynamicStiffnessMNm3 / loadBasisKgM2));

  if (!Number.isFinite(deltaLw) || !Number.isFinite(resonanceHz)) {
    return null;
  }

  return ImpactCalculationSchema.parse({
    DeltaLw: deltaLw,
    availableOutputs: ["DeltaLw"],
    basis: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
    confidence: getImpactConfidenceForBasis(LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS),
    errorBudgets: [buildLightweightConcreteDeltaLwErrorBudget(deltaLw)],
    floatingLoadSurfaceMassKgM2: ksRound1(loadBasisKgM2),
    labOrField: "lab",
    metricBasis: createImpactMetricBasis({
      DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS
    }),
    notes: [
      LIGHTWEIGHT_DELTA_LW_FORMULA_NOTE,
      "The corridor supplies only the missing lab DeltaLw metric; Rw and Ln,w stay on the existing lightweight-concrete family owner."
    ],
    predictorResonanceHz: resonanceHz,
    resilientDynamicStiffnessMNm3: ksRound1(dynamicStiffnessMNm3),
    scope: "family_estimate",
    standardMethod:
      "13 log10(m'load) - 14.2 log10(s') + 20.8 as a lightweight-concrete dynamic-improvement companion, without a heavy-concrete bare-reference Ln,w publication"
  });
}

export function mergeLightweightConcreteDeltaLwCompanion(
  primaryImpact: ImpactCalculation | null,
  companionImpact: ImpactCalculation | null
): ImpactCalculation | null {
  const merged = mergeImpactCalculations(primaryImpact, companionImpact);

  if (
    !merged ||
    !primaryImpact ||
    !companionImpact ||
    companionImpact.basis !== LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS ||
    typeof companionImpact.DeltaLw !== "number"
  ) {
    return merged;
  }

  const note =
    "DeltaLw companion was carried from the lightweight-concrete dynamic-improvement corridor while Ln,w stayed on the lightweight-family lane.";

  if (!merged.notes.includes(note)) {
    merged.notes.push(note);
  }

  return merged;
}
