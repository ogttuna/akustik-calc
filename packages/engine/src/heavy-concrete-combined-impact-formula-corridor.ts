import {
  ImpactCalculationSchema,
  type AcousticInputFieldId,
  type ImpactCalculation,
  type ImpactErrorBudget,
  type ImpactErrorBudgetTerm,
  type ImpactPredictorInput
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { clamp, ksRound1, log10Safe } from "./math";

export const HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS =
  "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate" as const;
export const HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB = 6.5;
export const HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB = 5.5;
export const HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_REQUIRED_FIELDS = [
  "baseSlabOrFloor",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2",
  "ceilingOrLowerAssembly"
] as const satisfies readonly AcousticInputFieldId[];

type HeavyConcreteCombinedImpactFormulaMetricId = "DeltaLw" | "Ln,w";

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function materialDensityKgM3(materialClass: string | undefined, fallback: number): number {
  switch (materialClass) {
    case "cement_board":
      return 1250;
    case "fire_board":
    case "firestop_board":
      return 850;
    case "gypsum_board":
      return 800;
    case "impactstop_board":
      return 900;
    default:
      return fallback;
  }
}

function computeBareMassiveFloorLnWEstimate(surfaceMassKgM2: number): number {
  return 164 - (35 * log10Safe(surfaceMassKgM2));
}

function computeFloatingFloorDeltaLwEstimate(loadSurfaceMassKgM2: number, dynamicStiffnessMNm3: number): number {
  return (13 * log10Safe(loadSurfaceMassKgM2)) - (14.2 * log10Safe(dynamicStiffnessMNm3)) + 20.8;
}

function computeFloatingFloorResonanceHz(loadSurfaceMassKgM2: number, dynamicStiffnessMNm3: number): number {
  return 160 * Math.sqrt(dynamicStiffnessMNm3 / loadSurfaceMassKgM2);
}

function computePredictorBaseSurfaceMassKgM2(input: ImpactPredictorInput): number | null {
  const densityKgM3 = input.baseSlab?.densityKgM3;
  const thicknessMm = input.baseSlab?.thicknessMm;

  if (!hasPositiveNumber(densityKgM3) || !hasPositiveNumber(thicknessMm)) {
    return null;
  }

  const surfaceMassKgM2 = ksRound1(densityKgM3 * (thicknessMm / 1000));
  return surfaceMassKgM2 >= 120 ? surfaceMassKgM2 : null;
}

function lowerBoardMassKgM2(input: ImpactPredictorInput): number {
  const lower = input.lowerTreatment;
  if (!lower) {
    return 0;
  }

  const count = lower.boardLayerCount ?? lower.boardThicknessScheduleMm?.length ?? 1;
  const averageThicknessMm = hasPositiveNumber(lower.boardThicknessMm)
    ? lower.boardThicknessMm
    : lower.boardThicknessScheduleMm && lower.boardThicknessScheduleMm.length > 0
      ? lower.boardThicknessScheduleMm.reduce((sum, value) => sum + value, 0) / lower.boardThicknessScheduleMm.length
      : 0;
  const densityKgM3 = materialDensityKgM3(lower.boardMaterialClass, 800);

  return count * averageThicknessMm * densityKgM3 / 1000;
}

function hasOwnedLowerSupportProduct(input: ImpactPredictorInput): boolean {
  switch (input.lowerTreatment?.supportProductId?.trim().toLowerCase()) {
    case "acoustic_hanger_ceiling":
    case "resilient_stud_ceiling":
      return true;
    default:
      return false;
  }
}

function hasCompleteLowerTreatment(input: ImpactPredictorInput): boolean {
  const lower = input.lowerTreatment;

  return Boolean(
    lower &&
      lower.type &&
      lower.type !== "none" &&
      (lower.supportClass || hasOwnedLowerSupportProduct(input)) &&
      hasPositiveNumber(lower.cavityDepthMm) &&
      lowerBoardMassKgM2(input) > 0
  );
}

function lowerSupportBonusDb(input: ImpactPredictorInput): number {
  const lower = input.lowerTreatment;

  switch (lower?.type) {
    case "suspended_ceiling_spring_hanger":
      return lower.supportClass === "furred_channels" ? 1.8 : 1.6;
    case "suspended_ceiling_elastic_hanger":
      return lower.supportClass === "furred_channels" ? 1.4 : 1.2;
    case "suspended_ceiling_rigid_hanger":
      return 0.5;
    case "direct_fixed_ceiling":
      return -0.4;
    default:
      return 0;
  }
}

function couplingPenaltySupportDb(input: ImpactPredictorInput): number {
  switch (input.lowerTreatment?.type) {
    case "suspended_ceiling_spring_hanger":
      return 0.7;
    case "suspended_ceiling_elastic_hanger":
      return 0.9;
    case "suspended_ceiling_rigid_hanger":
      return 1.2;
    case "direct_fixed_ceiling":
      return 1.6;
    default:
      return 1;
  }
}

function computeLowerAssemblyDeltaLwEstimate(input: ImpactPredictorInput): number | null {
  if (!hasCompleteLowerTreatment(input)) {
    return null;
  }

  const lower = input.lowerTreatment;
  const cavityDepthMm = lower?.cavityDepthMm ?? 0;
  const cavityFillThicknessMm = lower?.cavityFillThicknessMm ?? 0;
  const fillRatio = cavityDepthMm > 0 ? clamp(cavityFillThicknessMm / cavityDepthMm, 0, 1) : 0;
  const boardMassKgM2 = lowerBoardMassKgM2(input);

  return clamp(
    (0.16 * boardMassKgM2) + (0.014 * cavityDepthMm) + (1.1 * fillRatio) + lowerSupportBonusDb(input),
    2,
    10
  );
}

function computeUpperLowerCouplingPenaltyDb(input: ImpactPredictorInput, upperDeltaLwDb: number): number {
  return clamp((0.07 * Math.max(0, upperDeltaLwDb)) + couplingPenaltySupportDb(input), 1.2, 3.4);
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

function sumTermDb(terms: readonly ImpactErrorBudgetTerm[]): number {
  return ksRound1(terms.reduce((sum, item) => sum + item.db, 0));
}

function lnWErrorBudgetTerms(): ImpactErrorBudgetTerm[] {
  return [
    term(
      "heavy_reference_floor_family_spread",
      1.3,
      "source_absent_formula_assumption",
      "Bare heavy reference Ln,w is calculated from the slab surface mass instead of a same-stack measured reference floor.",
      ["same_stack_bare_heavy_reference_lnw_rows"]
    ),
    term(
      "lower_assembly_coupling_simplification",
      2.1,
      "topology_simplification",
      "Lower ceiling improvement is reduced to board mass, cavity depth, fill ratio, and support class.",
      ["source_owned_lower_ceiling_coupling_holdouts"]
    ),
    term(
      "upper_lower_interaction_simplification",
      1.4,
      "topology_simplification",
      "Upper and lower treatments are coupled with a bounded penalty rather than a full frequency-dependent transfer model.",
      ["combined_upper_lower_same_stack_holdouts"]
    ),
    term(
      "dynamic_stiffness_precision",
      1,
      "explicit_user_input_precision",
      "Dynamic stiffness is user-provided as a scalar s' value without a source-owned product frequency curve.",
      ["frequency_dependent_dynamic_stiffness_or_product_curve_owner"]
    ),
    term(
      "load_basis_precision",
      0.7,
      "explicit_user_input_precision",
      "Loaded upper mass is supplied as an aggregate kg/m2 basis rather than a source-owned loaded upper schedule.",
      ["source_owned_loaded_upper_mass_basis"]
    )
  ];
}

function deltaLwErrorBudgetTerms(): ImpactErrorBudgetTerm[] {
  return [
    term(
      "combined_system_holdout_absence",
      1.6,
      "missing_source_owned_holdout",
      "No source-owned same-stack ISO lab DeltaLw holdout has been accepted for this combined upper/lower corridor yet.",
      ["source_owned_combined_upper_lower_iso_delta_lw_holdouts"]
    ),
    term(
      "lower_assembly_coupling_simplification",
      1.5,
      "topology_simplification",
      "Lower ceiling contribution is represented by board mass, cavity depth, fill ratio, and support class only.",
      ["source_owned_lower_ceiling_coupling_holdouts"]
    ),
    term(
      "upper_lower_interaction_simplification",
      1,
      "topology_simplification",
      "Combined upper/lower improvement subtracts a bounded interaction penalty until paired same-stack evidence exists.",
      ["paired_upper_only_and_combined_lower_same_stack_holdouts"]
    ),
    term(
      "dynamic_stiffness_precision",
      0.9,
      "explicit_user_input_precision",
      "DeltaLw is sensitive to s'; the current input owns a scalar value but not a tested resilient-product response.",
      ["frequency_dependent_dynamic_stiffness_or_product_curve_owner"]
    ),
    term(
      "load_basis_precision",
      0.5,
      "explicit_user_input_precision",
      "DeltaLw is sensitive to loaded upper mass; the current input owns aggregate kg/m2 rather than a measured schedule.",
      ["source_owned_loaded_upper_mass_basis"]
    )
  ];
}

export function buildHeavyConcreteCombinedImpactFormulaErrorBudgetFor(
  metricId: HeavyConcreteCombinedImpactFormulaMetricId,
  estimate: number
): ImpactErrorBudget {
  const terms = metricId === "Ln,w" ? lnWErrorBudgetTerms() : deltaLwErrorBudgetTerms();
  const toleranceDb =
    metricId === "Ln,w"
      ? HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
      : HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB;

  return {
    estimate,
    max: ksRound1(estimate + toleranceDb),
    metricId,
    min: ksRound1(estimate - toleranceDb),
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    terms,
    toleranceDb,
    totalBudgetDb: sumTermDb(terms)
  };
}

export function buildHeavyConcreteCombinedImpactFormulaErrorBudgets(
  impact: Pick<ImpactCalculation, "DeltaLw" | "LnW">
): ImpactErrorBudget[] {
  const budgets: ImpactErrorBudget[] = [];

  if (typeof impact.LnW === "number") {
    budgets.push(buildHeavyConcreteCombinedImpactFormulaErrorBudgetFor("Ln,w", impact.LnW));
  }

  if (typeof impact.DeltaLw === "number") {
    budgets.push(buildHeavyConcreteCombinedImpactFormulaErrorBudgetFor("DeltaLw", impact.DeltaLw));
  }

  return budgets;
}

function isHeavyConcreteCombinedFormulaRoute(
  input: ImpactPredictorInput | null | undefined
): input is ImpactPredictorInput {
  return Boolean(
    input &&
      input.structuralSupportType === "reinforced_concrete" &&
      input.impactSystemType === "combined_upper_lower_system"
  );
}

export function collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs(
  input: ImpactPredictorInput | null | undefined
): AcousticInputFieldId[] {
  if (!isHeavyConcreteCombinedFormulaRoute(input)) {
    return [];
  }

  const missing: AcousticInputFieldId[] = [];

  if (!hasPositiveNumber(computePredictorBaseSurfaceMassKgM2(input))) {
    missing.push("baseSlabOrFloor");
  }

  if (!hasPositiveNumber(input.resilientLayer?.dynamicStiffnessMNm3)) {
    missing.push("resilientLayerDynamicStiffnessMNm3");
  }

  if (!hasPositiveNumber(input.loadBasisKgM2)) {
    missing.push("loadBasisKgM2");
  }

  if (!hasCompleteLowerTreatment(input)) {
    missing.push("ceilingOrLowerAssembly");
  }

  return missing;
}

export function shouldBlockHeavyConcreteCombinedImpactFormulaFallback(
  input: ImpactPredictorInput | null | undefined
): boolean {
  return collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs(input).length > 0;
}

export function buildHeavyConcreteCombinedImpactFormulaFallbackBlockerWarning(
  input: ImpactPredictorInput | null | undefined
): string | null {
  const missing = collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs(input);

  if (missing.length === 0) {
    return null;
  }

  return `Dynamic Calculator reinforced-concrete combined upper/lower impact runtime is waiting for ${missing.join(", ")} before promoting Ln,w / DeltaLw from the heavy-concrete combined formula corridor.`;
}

export function estimateHeavyConcreteCombinedImpactFromPredictorInput(
  input: ImpactPredictorInput | null | undefined
): ImpactCalculation | null {
  if (!isHeavyConcreteCombinedFormulaRoute(input) || shouldBlockHeavyConcreteCombinedImpactFormulaFallback(input)) {
    return null;
  }

  const formulaInput = input;
  const baseSurfaceMassKgM2 = computePredictorBaseSurfaceMassKgM2(formulaInput);
  const dynamicStiffnessMNm3 = formulaInput.resilientLayer?.dynamicStiffnessMNm3;
  const loadBasisKgM2 = formulaInput.loadBasisKgM2;
  const lowerDeltaLw = computeLowerAssemblyDeltaLwEstimate(formulaInput);

  if (
    !hasPositiveNumber(baseSurfaceMassKgM2) ||
    !hasPositiveNumber(dynamicStiffnessMNm3) ||
    !hasPositiveNumber(loadBasisKgM2) ||
    !hasPositiveNumber(lowerDeltaLw)
  ) {
    return null;
  }

  const bareReferenceLnW = computeBareMassiveFloorLnWEstimate(baseSurfaceMassKgM2);
  const upperDeltaLw = computeFloatingFloorDeltaLwEstimate(loadBasisKgM2, dynamicStiffnessMNm3);
  const couplingPenalty = computeUpperLowerCouplingPenaltyDb(formulaInput, upperDeltaLw);
  const totalDeltaLw = clamp(upperDeltaLw + lowerDeltaLw - couplingPenalty, 0, 45);
  const predictorResonanceHz = computeFloatingFloorResonanceHz(loadBasisKgM2, dynamicStiffnessMNm3);

  if (
    !Number.isFinite(bareReferenceLnW) ||
    !Number.isFinite(totalDeltaLw) ||
    !Number.isFinite(predictorResonanceHz)
  ) {
    return null;
  }

  const deltaLw = ksRound1(totalDeltaLw);
  const lnW = ksRound1(bareReferenceLnW - totalDeltaLw);

  return ImpactCalculationSchema.parse({
    DeltaLw: deltaLw,
    LnW: lnW,
    availableOutputs: ["Ln,w", "DeltaLw"],
    bareReferenceLnW: ksRound1(bareReferenceLnW),
    baseSurfaceMassKgM2,
    basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    confidence: getImpactConfidenceForBasis(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS),
    errorBudgets: buildHeavyConcreteCombinedImpactFormulaErrorBudgets({
      DeltaLw: deltaLw,
      LnW: lnW
    }),
    floatingLoadSurfaceMassKgM2: ksRound1(loadBasisKgM2),
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(
      {
        DeltaLw: deltaLw,
        LnW: lnW
      },
      HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
    ),
    notes: [
      "Ln,w and DeltaLw are using the source-absent heavy-concrete combined upper/lower formula corridor.",
      `Upper treatment used DeltaLw_upper ≈ 13 log10(m'load) - 14.2 log10(s') + 20.8, with explicit m'load = ${ksRound1(loadBasisKgM2)} kg/m² and s' = ${ksRound1(dynamicStiffnessMNm3)} MN/m³.`,
      `Lower ceiling term is ${ksRound1(lowerDeltaLw)} dB and the bounded upper/lower coupling penalty is ${ksRound1(couplingPenalty)} dB.`,
      `Resonance check used f0 ≈ 160 * sqrt(s'/m'load) = ${ksRound1(predictorResonanceHz)} Hz.`
    ],
    predictorResonanceHz: ksRound1(predictorResonanceHz),
    resilientDynamicStiffnessMNm3: ksRound1(dynamicStiffnessMNm3),
    scope: "heavy_concrete_combined_upper_lower_formula_corridor",
    standardMethod:
      "Bare heavy reference Ln,w minus upper mass-spring DeltaLw plus lower ceiling DeltaLw minus bounded upper/lower coupling penalty"
  });
}
