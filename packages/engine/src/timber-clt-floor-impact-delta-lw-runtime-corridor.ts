import {
  ImpactCalculationSchema,
  type ImpactCalculation,
  type ImpactErrorBudget,
  type ImpactErrorBudgetTerm,
  type ImpactPredictorInput
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { createImpactMetricBasis } from "./impact-metric-basis";
import { mergeImpactCalculations } from "./impact-merge";
import { clamp, ksRound1, log10Safe } from "./math";

export const TIMBER_JOIST_DELTA_LW_FORMULA_BASIS =
  "predictor_timber_joist_delta_lw_formula_corridor_estimate" as const;
export const MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS =
  "predictor_mass_timber_clt_delta_lw_formula_corridor_estimate" as const;
export const TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB = 7.5;

export const TIMBER_CLT_DELTA_LW_FORMULA_BASES = [
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
] as const;

type TimberCltDeltaLwFormulaFamily = "mass_timber_clt" | "timber_joists";

type TimberCltDeltaLwErrorBudgetTermId =
  | "clt_reference_floor_family_spread"
  | "delta_lw_holdout_absence"
  | "dynamic_stiffness_precision"
  | "lower_assembly_coupling_simplification"
  | "reference_floor_ln_w_anchor_scope"
  | "timber_joist_exact_lnw_not_delta_lw"
  | "upper_mass_precision";

type TimberCltDeltaLwErrorBudgetTermOrigin =
  | "explicit_user_input_precision"
  | "missing_source_owned_holdout"
  | "source_absent_formula_assumption"
  | "topology_simplification";

const TIMBER_CLT_FORMULA_NOTE =
  "Timber/CLT DeltaLw formula corridor used explicit load basis, resilient dynamic stiffness, lower assembly coupling, and structural family correction.";

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function hasMassDefinedLayer(
  layer: NonNullable<ImpactPredictorInput["floorCovering" | "floatingScreed" | "upperFill"]>
): boolean {
  return Boolean(
    hasPositiveNumber(layer.thicknessMm) &&
      (hasPositiveNumber(layer.densityKgM3) || hasPositiveNumber("deltaLwDb" in layer ? layer.deltaLwDb : undefined))
  );
}

function hasToppingOrFloatingMass(input: ImpactPredictorInput): boolean {
  if (input.floorCovering?.mode === "delta_lw_catalog") {
    return false;
  }

  return Boolean(
    (input.floatingScreed && hasMassDefinedLayer(input.floatingScreed)) ||
      (input.upperFill && hasMassDefinedLayer(input.upperFill)) ||
      (input.floorCovering && hasMassDefinedLayer(input.floorCovering))
  );
}

function hasExplicitLowerAssembly(input: ImpactPredictorInput): boolean {
  const lower = input.lowerTreatment;

  if (!lower?.type) {
    return false;
  }

  if (lower.type === "none") {
    return input.impactSystemType === "dry_floating_floor" || input.impactSystemType === "bare_floor";
  }

  return Boolean(
    lower.supportClass &&
      hasPositiveNumber(lower.cavityDepthMm) &&
      (
        hasPositiveNumber(lower.boardThicknessMm) ||
        (Array.isArray(lower.boardThicknessScheduleMm) && lower.boardThicknessScheduleMm.length > 0)
      )
  );
}

function resolveFormulaFamily(input: ImpactPredictorInput): TimberCltDeltaLwFormulaFamily | null {
  switch (input.structuralSupportType) {
    case "mass_timber_clt":
    case "timber_joists":
      return input.structuralSupportType;
    default:
      return null;
  }
}

function isFormulaSystemType(input: ImpactPredictorInput, family: TimberCltDeltaLwFormulaFamily): boolean {
  if (family === "timber_joists") {
    return input.impactSystemType === "combined_upper_lower_system";
  }

  return input.impactSystemType === "dry_floating_floor";
}

export function canEstimateTimberCltDeltaLwFromPredictorInput(input: ImpactPredictorInput | null | undefined): boolean {
  if (!input) {
    return false;
  }

  const family = resolveFormulaFamily(input);

  return Boolean(
    family &&
      isFormulaSystemType(input, family) &&
      hasPositiveNumber(input.baseSlab?.thicknessMm) &&
      hasToppingOrFloatingMass(input) &&
      hasPositiveNumber(input.resilientLayer?.dynamicStiffnessMNm3) &&
      hasPositiveNumber(input.loadBasisKgM2) &&
      hasExplicitLowerAssembly(input)
  );
}

function familyCorrectionDb(family: TimberCltDeltaLwFormulaFamily): number {
  return family === "timber_joists" ? 0.8 : -0.9;
}

function lowerAssemblyCouplingDb(input: ImpactPredictorInput, family: TimberCltDeltaLwFormulaFamily): number {
  const lower = input.lowerTreatment;

  if (family === "mass_timber_clt") {
    return lower?.type === "none" ? 0 : 0.2;
  }

  switch (lower?.type) {
    case "suspended_ceiling_spring_hanger":
      return 0.6;
    case "suspended_ceiling_elastic_hanger":
      return lower.supportClass === "furred_channels" ? 0.4 : 0.3;
    case "suspended_ceiling_rigid_hanger":
      return 0.2;
    case "direct_fixed_ceiling":
      return -0.2;
    default:
      return 0;
  }
}

function term(
  termId: TimberCltDeltaLwErrorBudgetTermId,
  db: number,
  origin: TimberCltDeltaLwErrorBudgetTermOrigin,
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

function timberJoistErrorBudgetTerms(): ImpactErrorBudgetTerm[] {
  return [
    term(
      "timber_joist_exact_lnw_not_delta_lw",
      2.4,
      "missing_source_owned_holdout",
      "The current exact timber joist row owns Ln,w, not source-owned same-stack ISO DeltaLw.",
      ["source_owned_iso_delta_lw_metric_for_same_stack"]
    ),
    term(
      "lower_assembly_coupling_simplification",
      2.1,
      "topology_simplification",
      "Lower ceiling coupling is explicit but represented as a bounded support-class term.",
      ["timber_joist_lower_ceiling_coupling_holdout"]
    ),
    term(
      "dynamic_stiffness_precision",
      1.8,
      "explicit_user_input_precision",
      "Dynamic stiffness is user-provided as scalar s' rather than a frequency-dependent product curve.",
      ["source_owned_dynamic_stiffness_or_test_report"]
    ),
    term(
      "upper_mass_precision",
      1.2,
      "explicit_user_input_precision",
      "The upper treatment is represented by aggregate load basis and explicit layer mass fields.",
      ["source_owned_loaded_upper_mass_basis"]
    )
  ];
}

function massTimberCltErrorBudgetTerms(): ImpactErrorBudgetTerm[] {
  return [
    term(
      "clt_reference_floor_family_spread",
      2.5,
      "source_absent_formula_assumption",
      "The CLT reference family is carried as a bounded mass-timber branch rather than a source-owned same-stack DeltaLw row.",
      ["clt_same_reference_floor_delta_lw_holdout"]
    ),
    term(
      "reference_floor_ln_w_anchor_scope",
      2,
      "source_absent_formula_assumption",
      "The current CLT Ln,w anchor is not itself a DeltaLw metric owner.",
      ["reference_floor_ln_w_and_bare_ln_w_pair"]
    ),
    term(
      "dynamic_stiffness_precision",
      1.7,
      "explicit_user_input_precision",
      "Dynamic stiffness is user-provided as scalar s' rather than a full tested resilient-layer response.",
      ["source_owned_dynamic_stiffness_or_test_report"]
    ),
    term(
      "delta_lw_holdout_absence",
      1.3,
      "missing_source_owned_holdout",
      "No accepted source-owned mass-timber ISO DeltaLw holdout has been promoted for this corridor yet.",
      ["source_owned_mass_timber_iso_delta_lw_holdout"]
    )
  ];
}

function sumTermDb(terms: readonly ImpactErrorBudgetTerm[]): number {
  return ksRound1(terms.reduce((sum, item) => sum + item.db, 0));
}

export function buildTimberCltDeltaLwFormulaErrorBudget(
  family: TimberCltDeltaLwFormulaFamily,
  estimate: number
): ImpactErrorBudget {
  const terms = family === "timber_joists" ? timberJoistErrorBudgetTerms() : massTimberCltErrorBudgetTerms();

  return {
    estimate,
    max: ksRound1(estimate + TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB),
    metricId: "DeltaLw",
    min: ksRound1(estimate - TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB),
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    terms,
    toleranceDb: TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB,
    totalBudgetDb: sumTermDb(terms)
  };
}

export function estimateTimberCltDeltaLwFromPredictorInput(
  input: ImpactPredictorInput | null | undefined
): ImpactCalculation | null {
  if (!input || !canEstimateTimberCltDeltaLwFromPredictorInput(input)) {
    return null;
  }

  const family = resolveFormulaFamily(input);

  if (!family) {
    return null;
  }

  const loadBasisKgM2 = input.loadBasisKgM2;
  const dynamicStiffnessMNm3 = input.resilientLayer?.dynamicStiffnessMNm3;

  if (!hasPositiveNumber(loadBasisKgM2) || !hasPositiveNumber(dynamicStiffnessMNm3)) {
    return null;
  }

  const basis =
    family === "timber_joists" ? TIMBER_JOIST_DELTA_LW_FORMULA_BASIS : MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS;
  const massSpringDeltaLw = 13 * log10Safe(loadBasisKgM2) - 14.2 * log10Safe(dynamicStiffnessMNm3) + 20.8;
  const familyCorrection = familyCorrectionDb(family);
  const lowerCoupling = lowerAssemblyCouplingDb(input, family);
  const deltaLw = ksRound1(clamp(massSpringDeltaLw + familyCorrection + lowerCoupling, 0, 40));
  const resonanceHz = ksRound1(160 * Math.sqrt(dynamicStiffnessMNm3 / loadBasisKgM2));

  return ImpactCalculationSchema.parse({
    DeltaLw: deltaLw,
    availableOutputs: ["DeltaLw"],
    basis,
    confidence: getImpactConfidenceForBasis(basis),
    errorBudgets: [buildTimberCltDeltaLwFormulaErrorBudget(family, deltaLw)],
    floatingLoadSurfaceMassKgM2: loadBasisKgM2,
    labOrField: "lab",
    metricBasis: createImpactMetricBasis({
      DeltaLw: basis
    }),
    notes: [
      TIMBER_CLT_FORMULA_NOTE,
      family === "timber_joists"
        ? "Timber joist corridor keeps exact Ln,w as a separate anchor and only supplies the missing lab DeltaLw metric."
        : "Mass-timber CLT corridor keeps published-family Ln,w as a separate anchor and only supplies the missing lab DeltaLw metric."
    ],
    predictorResonanceHz: resonanceHz,
    resilientDynamicStiffnessMNm3: dynamicStiffnessMNm3,
    scope: "timber_clt_floor_formula_corridor",
    standardMethod:
      "13 log10(m'load) - 14.2 log10(s') + 20.8 plus timber/CLT structural-family and lower-assembly coupling corrections"
  });
}

export function mergeTimberCltDeltaLwFormulaCompanion(
  primaryImpact: ImpactCalculation | null,
  companionImpact: ImpactCalculation | null
): ImpactCalculation | null {
  const merged = mergeImpactCalculations(primaryImpact, companionImpact);

  if (!merged || !primaryImpact || !companionImpact || typeof companionImpact.DeltaLw !== "number") {
    return merged;
  }

  const note =
    "DeltaLw companion was carried from the explicit timber/CLT formula corridor while Ln,w stayed on its exact or published-family lane.";

  if (!merged.notes.includes(note)) {
    merged.notes.push(note);
  }

  return merged;
}
