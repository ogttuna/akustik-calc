import type { RequestedOutputId } from "@dynecho/shared";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerContract
} from "./broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import { clamp, log10Safe, round1 } from "./math";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_raw_bare_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_raw_bare_formula_corridor_landed_no_runtime_selected_runtime_corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_raw_bare_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL =
  "floor open-box timber raw-bare runtime corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS =
  "broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor";

export type BroadAccuracyFloorOpenBoxTimberRawBareFormulaMetricId =
  | "C"
  | "CI"
  | "CI,50-2500"
  | "Ctr"
  | "Ln,w"
  | "Ln,w+CI"
  | "Rw";

export type BroadAccuracyFloorOpenBoxTimberRawBareFormulaStatus =
  | "blocked_basis_alias"
  | "blocked_exact_source_precedence"
  | "blocked_hostile_topology"
  | "blocked_missing_owner_fields"
  | "blocked_missing_source_or_physics_basis"
  | "blocked_package_transfer_route"
  | "blocked_partial_or_ambiguous_treatment"
  | "blocked_wrong_support_family"
  | "formula_corridor_defined_runtime_gate_required";

export type BroadAccuracyFloorOpenBoxTimberRawBareSupportFamily =
  | "mass_timber_clt"
  | "open_box_timber"
  | "open_web_steel"
  | "unknown";

export type BroadAccuracyFloorOpenBoxTimberRawBareSupportForm =
  | "open_box_timber_slab"
  | "open_web_steel_floor"
  | "other_floor_carrier";

export type BroadAccuracyFloorOpenBoxTimberRawBareFinishAbsenceState =
  | "complete_upper_package"
  | "explicit_none"
  | "partial_upper_package";

export type BroadAccuracyFloorOpenBoxTimberRawBareLowerTreatmentState =
  | "explicit_bare_underside"
  | "explicit_lower_treatment_schedule"
  | "missing_or_ambiguous";

export type BroadAccuracyFloorOpenBoxTimberRawBarePackageTransferState =
  | "complete_package_transfer_candidate"
  | "no_complete_package";

export type BroadAccuracyFloorOpenBoxTimberRawBareRoleTopologyState =
  | "ambiguous_duplicate_or_overlap"
  | "safe_split_equivalent"
  | "source_equivalent";

export type BroadAccuracyFloorOpenBoxTimberRawBareSourceOrPhysicsBasis =
  | "missing"
  | "source_absent_physics_model"
  | "source_owned_bare_packet";

export type BroadAccuracyFloorOpenBoxTimberRawBareRequestedBasis =
  | "astm_iic_aiic"
  | "building_prediction"
  | "element_lab"
  | "field";

export type BroadAccuracyFloorOpenBoxTimberRawBareFormulaTermId =
  | "airborne_direct_curve_surface_mass_depth"
  | "bare_impact_reference_curve_surface_mass_mobility"
  | "exact_source_and_package_transfer_exclusion"
  | "finish_absence_and_lower_treatment_state"
  | "hostile_topology_and_safe_split_equivalence"
  | "iso717_metric_adapter_boundaries"
  | "source_absent_budget_decomposition";

export type BroadAccuracyFloorOpenBoxTimberRawBareFormulaTerm = {
  readonly description: string;
  readonly owner: string;
  readonly requiredInputs: readonly string[];
  readonly runtimeOwnedInGate: false;
  readonly termId: BroadAccuracyFloorOpenBoxTimberRawBareFormulaTermId;
};

export type BroadAccuracyFloorOpenBoxTimberRawBareErrorBudgetTermId =
  | "bare_carrier_holdout_absence"
  | "bare_impact_curve_model_gap"
  | "input_precision"
  | "open_box_geometry_simplification"
  | "source_absent_structural_mobility_simplification";

export type BroadAccuracyFloorOpenBoxTimberRawBareErrorBudgetTerm = {
  readonly basis: "source_absent_raw_bare_open_box_formula_design_budget";
  readonly db: number;
  readonly termId: BroadAccuracyFloorOpenBoxTimberRawBareErrorBudgetTermId;
  readonly tightenRequires: readonly string[];
};

export type BroadAccuracyFloorOpenBoxTimberRawBareErrorBudget = {
  readonly metricId: BroadAccuracyFloorOpenBoxTimberRawBareFormulaMetricId;
  readonly notMeasuredEvidence: true;
  readonly terms: readonly BroadAccuracyFloorOpenBoxTimberRawBareErrorBudgetTerm[];
  readonly totalBudgetDb: number;
};

export type BroadAccuracyFloorOpenBoxTimberRawBareDesignMetrics = {
  readonly C: number | null;
  readonly CI: number | null;
  readonly CI50_2500: number | null;
  readonly Ctr: number | null;
  readonly LnW: number | null;
  readonly LnWPlusCI: number | null;
  readonly Rw: number | null;
};

export type BroadAccuracyFloorOpenBoxTimberRawBareFormulaEvaluationInput = {
  readonly carrierDepthMm?: number;
  readonly exactSourceId?: string;
  readonly finishAbsenceState: BroadAccuracyFloorOpenBoxTimberRawBareFinishAbsenceState;
  readonly lossFactor?: number;
  readonly lowerTreatmentState: BroadAccuracyFloorOpenBoxTimberRawBareLowerTreatmentState;
  readonly packageTransferState: BroadAccuracyFloorOpenBoxTimberRawBarePackageTransferState;
  readonly panelPlateSchedule?: "ribbed_box_plates";
  readonly requestedBasis?: BroadAccuracyFloorOpenBoxTimberRawBareRequestedBasis;
  readonly ribOrWebSpacingMm?: number;
  readonly roleTopologyState: BroadAccuracyFloorOpenBoxTimberRawBareRoleTopologyState;
  readonly sourceOrPhysicsBasis: BroadAccuracyFloorOpenBoxTimberRawBareSourceOrPhysicsBasis;
  readonly supportFamily: BroadAccuracyFloorOpenBoxTimberRawBareSupportFamily;
  readonly supportForm: BroadAccuracyFloorOpenBoxTimberRawBareSupportForm;
  readonly surfaceMassKgM2?: number;
  readonly targetOutputs?: readonly RequestedOutputId[];
  readonly voidFraction?: number;
};

export type BroadAccuracyFloorOpenBoxTimberRawBareFormulaEvaluation = {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly basisId: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS;
  readonly blockedFormulaOutputs: readonly RequestedOutputId[];
  readonly corridorStatus: BroadAccuracyFloorOpenBoxTimberRawBareFormulaStatus;
  readonly designMetrics: BroadAccuracyFloorOpenBoxTimberRawBareDesignMetrics;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly exactSourceId: string | null;
  readonly formulaTerms: readonly BroadAccuracyFloorOpenBoxTimberRawBareFormulaTerm[];
  readonly missingOwnerFields: readonly string[];
  readonly packageTransferBasisForbidden: typeof OPEN_BOX_TIMBER_SIMILARITY_BASIS;
  readonly requestedBasis: BroadAccuracyFloorOpenBoxTimberRawBareRequestedBasis;
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimeValues: {
    readonly C: null;
    readonly CI: null;
    readonly CI50_2500: null;
    readonly Ctr: null;
    readonly LnW: null;
    readonly LnWPlusCI: null;
    readonly Rw: null;
  };
  readonly sourceOrPhysicsBasis: BroadAccuracyFloorOpenBoxTimberRawBareSourceOrPhysicsBasis;
  readonly supportFamily: BroadAccuracyFloorOpenBoxTimberRawBareSupportFamily;
  readonly supportForm: BroadAccuracyFloorOpenBoxTimberRawBareSupportForm;
  readonly toleranceBudgets: readonly BroadAccuracyFloorOpenBoxTimberRawBareErrorBudget[];
};

export type BroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridorContract = {
  readonly additionalSourceRowsRequiredForRuntimeSelection: false;
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly candidateFormulaRows: readonly BroadAccuracyFloorOpenBoxTimberRawBareFormulaEvaluation[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly forbiddenBorrowedPackageTransferBasis: typeof OPEN_BOX_TIMBER_SIMILARITY_BASIS;
  readonly formulaStatement: readonly string[];
  readonly formulaTerms: readonly BroadAccuracyFloorOpenBoxTimberRawBareFormulaTerm[];
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousCarrierOwner: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS;
  };
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimePromotionEntryCriteria: readonly string[];
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS;
  readonly sourceRowsRequiredForFormulaDesign: false;
  readonly toleranceBudgets: readonly BroadAccuracyFloorOpenBoxTimberRawBareErrorBudget[];
};

const FORMULA_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr", "Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);

const FORMULA_TERMS = [
  {
    description: "Derive the bare-carrier airborne direct curve from explicit surface mass, open-box depth, void fraction, rib spacing, and damping.",
    owner: "rawBareOpenBoxAirborneDirectCurveOwner",
    requiredInputs: ["surfaceMassKgM2", "carrierDepthMm", "voidFraction", "ribOrWebSpacingMm", "lossFactor"],
    runtimeOwnedInGate: false,
    termId: "airborne_direct_curve_surface_mass_depth"
  },
  {
    description: "Derive a raw walking-surface impact reference from bare-carrier mass, open-box mobility proxy, and damping; never from finished package rows.",
    owner: "rawBareOpenBoxImpactReferenceCurveOwner",
    requiredInputs: ["surfaceMassKgM2", "carrierDepthMm", "voidFraction", "lossFactor", "walkingSurfaceHardnessClass=bare_timber"],
    runtimeOwnedInGate: false,
    termId: "bare_impact_reference_curve_surface_mass_mobility"
  },
  {
    description: "Require explicit absence of upper finish packages and explicit lower treatment state before treating a stack as raw-bare.",
    owner: "rawBareFinishAndLowerTreatmentOwner",
    requiredInputs: ["finishAbsenceState=explicit_none", "lowerTreatmentState"],
    runtimeOwnedInGate: false,
    termId: "finish_absence_and_lower_treatment_state"
  },
  {
    description: "Keep exact measured floor systems and complete package-transfer candidates ahead of raw-bare source-absent formulas.",
    owner: "rawBareExactSourceAndPackageExclusionOwner",
    requiredInputs: ["exactSourceId", "packageTransferState=no_complete_package"],
    runtimeOwnedInGate: false,
    termId: "exact_source_and_package_transfer_exclusion"
  },
  {
    description: "Keep Rw/C/Ctr and Ln,w/CI/CI,50-2500 on element-lab ISO bases; field, building, and ASTM/IIC requests need later adapters.",
    owner: "rawBareIso717MetricBoundaryOwner",
    requiredInputs: ["requestedBasis=element_lab", "iso717AirborneRatingAdapter", "iso717ImpactRatingAdapter"],
    runtimeOwnedInGate: false,
    termId: "iso717_metric_adapter_boundaries"
  },
  {
    description: "Treat safe split base-only layers as equivalent, while ambiguous duplicate or overlapping carriers fail closed.",
    owner: "rawBareHostileTopologyOwner",
    requiredInputs: ["roleTopologyState", "duplicateBaseStructurePolicy", "safeSplitEquivalencePolicy"],
    runtimeOwnedInGate: false,
    termId: "hostile_topology_and_safe_split_equivalence"
  },
  {
    description: "Attach wide source-absent budgets until source-owned raw-bare holdouts and mobility calibration rows exist.",
    owner: "rawBareSourceAbsentBudgetOwner",
    requiredInputs: ["RwBudget", "LnWBudget", "CIBudget", "CI50_2500Budget", "inputPrecisionBudget", "holdoutAbsenceBudget"],
    runtimeOwnedInGate: false,
    termId: "source_absent_budget_decomposition"
  }
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberRawBareFormulaTerm[];

const TOLERANCE_BUDGETS = [
  buildBudget("Rw", 8),
  buildBudget("C", 2.5),
  buildBudget("Ctr", 3.5),
  buildBudget("Ln,w", 10),
  buildBudget("CI", 3),
  buildBudget("CI,50-2500", 4),
  buildBudget("Ln,w+CI", 10.5)
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberRawBareErrorBudget[];

function buildBudget(
  metricId: BroadAccuracyFloorOpenBoxTimberRawBareFormulaMetricId,
  totalBudgetDb: number
): BroadAccuracyFloorOpenBoxTimberRawBareErrorBudget {
  const structuralMobility = round1(totalBudgetDb * 0.25);
  const impactCurveGap = round1(totalBudgetDb * 0.25);
  const geometrySimplification = round1(totalBudgetDb * 0.2);
  const inputPrecision = round1(totalBudgetDb * 0.1);
  const holdoutAbsence = round1(totalBudgetDb - structuralMobility - impactCurveGap - geometrySimplification - inputPrecision);

  return {
    metricId,
    notMeasuredEvidence: true,
    terms: [
      {
        basis: "source_absent_raw_bare_open_box_formula_design_budget",
        db: structuralMobility,
        termId: "source_absent_structural_mobility_simplification",
        tightenRequires: ["source_owned_open_box_mobility_or_modal_density_model"]
      },
      {
        basis: "source_absent_raw_bare_open_box_formula_design_budget",
        db: impactCurveGap,
        termId: "bare_impact_curve_model_gap",
        tightenRequires: ["source_owned_raw_bare_open_box_impact_curve_holdout"]
      },
      {
        basis: "source_absent_raw_bare_open_box_formula_design_budget",
        db: geometrySimplification,
        termId: "open_box_geometry_simplification",
        tightenRequires: ["plate_rib_spacing_void_fraction_sweep_holdouts"]
      },
      {
        basis: "source_absent_raw_bare_open_box_formula_design_budget",
        db: inputPrecision,
        termId: "input_precision",
        tightenRequires: ["surface_mass_depth_void_loss_factor_measurement_packet"]
      },
      {
        basis: "source_absent_raw_bare_open_box_formula_design_budget",
        db: holdoutAbsence,
        termId: "bare_carrier_holdout_absence",
        tightenRequires: ["source_owned_same_stack_raw_bare_open_box_lab_holdout"]
      }
    ],
    totalBudgetDb
  };
}

function splitOutputs(targetOutputs: readonly RequestedOutputId[] | undefined): {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly blockedFormulaOutputs: readonly RequestedOutputId[];
} {
  const requestedOutputs = targetOutputs && targetOutputs.length > 0 ? targetOutputs : (["Rw", "Ln,w"] as const);

  return {
    affectedFormulaOutputs: requestedOutputs.filter((output) => FORMULA_OUTPUTS.has(output)),
    blockedFormulaOutputs: requestedOutputs.filter((output) => !FORMULA_OUTPUTS.has(output))
  };
}

function hasPositiveFinite(value: number | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function hasValidVoidFraction(value: number | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value < 0.85;
}

function collectMissingOwnerFields(
  input: BroadAccuracyFloorOpenBoxTimberRawBareFormulaEvaluationInput
): readonly string[] {
  const missing: string[] = [];

  if (!hasPositiveFinite(input.surfaceMassKgM2)) {
    missing.push("surfaceMassKgM2");
  }

  if (!hasPositiveFinite(input.carrierDepthMm)) {
    missing.push("carrierDepthMm");
  }

  if (!input.panelPlateSchedule) {
    missing.push("panelPlateSchedule");
  }

  if (!hasPositiveFinite(input.ribOrWebSpacingMm)) {
    missing.push("ribOrWebSpacingMm");
  }

  if (!hasValidVoidFraction(input.voidFraction)) {
    missing.push("voidFraction");
  }

  if (!hasPositiveFinite(input.lossFactor)) {
    missing.push("lossFactor");
  }

  return missing;
}

function emptyMetrics(): BroadAccuracyFloorOpenBoxTimberRawBareDesignMetrics {
  return {
    C: null,
    CI: null,
    CI50_2500: null,
    Ctr: null,
    LnW: null,
    LnWPlusCI: null,
    Rw: null
  };
}

function computeDesignMetrics(
  input: Required<
    Pick<
      BroadAccuracyFloorOpenBoxTimberRawBareFormulaEvaluationInput,
      "carrierDepthMm" | "lossFactor" | "surfaceMassKgM2" | "voidFraction"
    >
  >
): BroadAccuracyFloorOpenBoxTimberRawBareDesignMetrics {
  const massRatio = input.surfaceMassKgM2 / 96;
  const depthRatio = input.carrierDepthMm / 370;
  const voidDelta = input.voidFraction - 0.4;
  const lossDelta = input.lossFactor - 0.04;
  const rw = round1(clamp(42.3 + (18 * log10Safe(massRatio)) + (1.5 * log10Safe(depthRatio)) - (4 * voidDelta) + (8 * lossDelta), 28, 60));
  const c = round1(clamp(-1.4 - (1.5 * voidDelta) + (2 * lossDelta), -6, 1));
  const ctr = round1(clamp(c - 4.4 - (2 * voidDelta), -12, -2));
  const lnW = round1(clamp(88.2 - (10 * log10Safe(massRatio)) - log10Safe(depthRatio) + (7 * voidDelta) - (12 * lossDelta), 65, 105));
  const ci = round1(clamp(-1.1 + (1.5 * voidDelta) - (4 * lossDelta), -5, 4));
  const ci50_2500 = round1(clamp(3.1 + (3 * voidDelta) - (8 * lossDelta), -1, 8));

  return {
    C: c,
    CI: ci,
    CI50_2500: ci50_2500,
    Ctr: ctr,
    LnW: lnW,
    LnWPlusCI: round1(lnW + ci),
    Rw: rw
  };
}

function statusForInput(input: BroadAccuracyFloorOpenBoxTimberRawBareFormulaEvaluationInput, missingOwnerFields: readonly string[], affectedFormulaOutputs: readonly RequestedOutputId[], blockedFormulaOutputs: readonly RequestedOutputId[]):
  BroadAccuracyFloorOpenBoxTimberRawBareFormulaStatus {
  if (input.supportFamily !== "open_box_timber" || input.supportForm !== "open_box_timber_slab") {
    return "blocked_wrong_support_family";
  }

  if ((input.requestedBasis ?? "element_lab") !== "element_lab" || (affectedFormulaOutputs.length === 0 && blockedFormulaOutputs.length > 0)) {
    return "blocked_basis_alias";
  }

  if (input.exactSourceId) {
    return "blocked_exact_source_precedence";
  }

  if (input.packageTransferState !== "no_complete_package") {
    return "blocked_package_transfer_route";
  }

  if (input.roleTopologyState === "ambiguous_duplicate_or_overlap") {
    return "blocked_hostile_topology";
  }

  if (input.finishAbsenceState !== "explicit_none" || input.lowerTreatmentState === "missing_or_ambiguous") {
    return "blocked_partial_or_ambiguous_treatment";
  }

  if (input.sourceOrPhysicsBasis === "missing") {
    return "blocked_missing_source_or_physics_basis";
  }

  if (missingOwnerFields.length > 0) {
    return "blocked_missing_owner_fields";
  }

  return "formula_corridor_defined_runtime_gate_required";
}

export function evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor(
  input: BroadAccuracyFloorOpenBoxTimberRawBareFormulaEvaluationInput
): BroadAccuracyFloorOpenBoxTimberRawBareFormulaEvaluation {
  const { affectedFormulaOutputs, blockedFormulaOutputs } = splitOutputs(input.targetOutputs);
  const missingOwnerFields = collectMissingOwnerFields(input);
  const corridorStatus = statusForInput(input, missingOwnerFields, affectedFormulaOutputs, blockedFormulaOutputs);
  const designMetrics =
    corridorStatus === "formula_corridor_defined_runtime_gate_required" &&
    input.carrierDepthMm !== undefined &&
    input.lossFactor !== undefined &&
    input.surfaceMassKgM2 !== undefined &&
    input.voidFraction !== undefined
      ? computeDesignMetrics({
          carrierDepthMm: input.carrierDepthMm,
          lossFactor: input.lossFactor,
          surfaceMassKgM2: input.surfaceMassKgM2,
          voidFraction: input.voidFraction
        })
      : emptyMetrics();

  return {
    affectedFormulaOutputs,
    basisId: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS,
    blockedFormulaOutputs,
    corridorStatus,
    designMetrics,
    exactMeasuredRowsRemainPrecedence: true,
    exactSourceId: input.exactSourceId ?? null,
    formulaTerms: FORMULA_TERMS,
    missingOwnerFields,
    packageTransferBasisForbidden: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    requestedBasis: input.requestedBasis ?? "element_lab",
    runtimePromotionAllowedInGate: false,
    runtimeValues: {
      C: null,
      CI: null,
      CI50_2500: null,
      Ctr: null,
      LnW: null,
      LnWPlusCI: null,
      Rw: null
    },
    sourceOrPhysicsBasis: input.sourceOrPhysicsBasis,
    supportFamily: input.supportFamily,
    supportForm: input.supportForm,
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}

export function buildBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridorContract():
  BroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridorContract {
  const previous = buildBroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerContract();

  return {
    additionalSourceRowsRequiredForRuntimeSelection: false,
    basisAliasBlocked: previous.basisAliasBlocked,
    candidateFormulaRows: [
      evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
        carrierDepthMm: 370,
        finishAbsenceState: "explicit_none",
        lossFactor: 0.04,
        lowerTreatmentState: "explicit_bare_underside",
        packageTransferState: "no_complete_package",
        panelPlateSchedule: "ribbed_box_plates",
        ribOrWebSpacingMm: 600,
        roleTopologyState: "source_equivalent",
        sourceOrPhysicsBasis: "source_absent_physics_model",
        supportFamily: "open_box_timber",
        supportForm: "open_box_timber_slab",
        surfaceMassKgM2: 96,
        targetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        voidFraction: 0.4
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
        carrierDepthMm: 220,
        finishAbsenceState: "explicit_none",
        lossFactor: 0.035,
        lowerTreatmentState: "explicit_bare_underside",
        packageTransferState: "no_complete_package",
        panelPlateSchedule: "ribbed_box_plates",
        ribOrWebSpacingMm: 600,
        roleTopologyState: "safe_split_equivalent",
        sourceOrPhysicsBasis: "source_absent_physics_model",
        supportFamily: "open_box_timber",
        supportForm: "open_box_timber_slab",
        surfaceMassKgM2: 62,
        targetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        voidFraction: 0.5
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
        carrierDepthMm: 370,
        finishAbsenceState: "explicit_none",
        lossFactor: 0.04,
        lowerTreatmentState: "explicit_bare_underside",
        packageTransferState: "no_complete_package",
        panelPlateSchedule: "ribbed_box_plates",
        requestedBasis: "field",
        ribOrWebSpacingMm: 600,
        roleTopologyState: "source_equivalent",
        sourceOrPhysicsBasis: "source_absent_physics_model",
        supportFamily: "open_box_timber",
        supportForm: "open_box_timber_slab",
        surfaceMassKgM2: 96,
        targetOutputs: ["R'w", "DnT,w", "L'n,w", "IIC"],
        voidFraction: 0.4
      })
    ],
    exactMeasuredRowsRemainPrecedence: true,
    forbiddenBorrowedPackageTransferBasis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    formulaStatement: [
      "Raw-bare open-box timber is evaluated as its own source-absent carrier family, not as the finished TUAS package-transfer corridor.",
      "Airborne design values use explicit surface mass, open-box depth, void fraction, rib spacing, and damping to form an element-lab Rw/C/Ctr candidate.",
      "Impact design values use a separate bare walking-surface mobility proxy and never borrow Ln,w, CI, or CI,50-2500 from finished package rows.",
      "This formula-corridor gate defines design values and wide budgets only; public runtime values stay frozen until the selected runtime-corridor gate."
    ],
    formulaTerms: FORMULA_TERMS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousCarrierOwner: {
      landedGate: previous.landedGate,
      selectedNextAction: previous.selectedNextAction,
      selectedNextFile: previous.selectedNextFile,
      selectionStatus: previous.selectionStatus
    },
    runtimePromotionAllowedInGate: false,
    runtimePromotionEntryCriteria: [
      "public_runtime_must_use_raw_bare_open_box_formula_basis_not_finished_tuas_package_transfer_basis",
      "public_runtime_must_require_surface_mass_depth_void_fraction_rib_spacing_and_loss_factor",
      "public_runtime_must_keep_exact_source_rows_ahead_of_raw_bare_source_absent_formula_rows",
      "public_runtime_must_keep_partial_upper_or_lower_packages_out_of_raw_bare_formula_promotion",
      "formula_surface_must_show_not_measured_error_budget_for_each_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: false,
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}
