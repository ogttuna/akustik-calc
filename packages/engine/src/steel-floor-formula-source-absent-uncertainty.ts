import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactPredictorInput,
  RequestedOutputId,
} from "@dynecho/shared";

import { buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract } from "./steel-floor-formula-source-owned-delta-lw-source-packet-acquisition";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  buildGateADSteelFloorImpactFormulaCorridorContract,
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts";

export const GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_ACTION =
  "gate_ao_steel_floor_formula_error_budget_surface_parity_plan";

export type SteelFloorFormulaUncertaintyMetricId = "DeltaLw" | "Ln,w";

export type SteelFloorFormulaUncertaintyTermId =
  | "dynamic_stiffness_precision"
  | "load_basis_precision"
  | "lower_support_class_simplification"
  | "source_absent_bare_steel_reference_model"
  | "source_owned_delta_lw_holdout_absence"
  | "support_form_transfer_efficiency"
  | "upper_resilient_topology_simplification";

export type SteelFloorFormulaUncertaintyTermOrigin =
  | "explicit_user_input_precision"
  | "missing_source_owned_holdout"
  | "source_absent_formula_assumption"
  | "topology_simplification";

export type SteelFloorFormulaSourceAbsentUncertaintyStatus =
  | "exact_source_precedence"
  | "needs_input"
  | "ready_with_source_absent_error_budget"
  | "unsafe_topology";

export type SteelFloorFormulaUncertaintyTerm = {
  readonly db: number;
  readonly origin: SteelFloorFormulaUncertaintyTermOrigin;
  readonly reason: string;
  readonly termId: SteelFloorFormulaUncertaintyTermId;
  readonly tightenRequires: readonly string[];
};

export type SteelFloorFormulaMetricErrorBudget = {
  readonly estimate: number;
  readonly max: number;
  readonly metricId: SteelFloorFormulaUncertaintyMetricId;
  readonly min: number;
  readonly notMeasuredEvidence: true;
  readonly origin: "source_absent_formula_error_budget";
  readonly terms: readonly SteelFloorFormulaUncertaintyTerm[];
  readonly toleranceDb: number;
  readonly totalBudgetDb: number;
};

export type SteelFloorFormulaSourceAbsentUncertaintyEvaluation = {
  readonly errorBudgets: readonly SteelFloorFormulaMetricErrorBudget[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  readonly impact: ImpactCalculation | null;
  readonly missingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly runtimeValueMovement: false;
  readonly status: SteelFloorFormulaSourceAbsentUncertaintyStatus;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly unsafeTopologyReason?: string;
};

export type GateANSteelFloorFormulaSourceAbsentUncertaintyContract = {
  readonly corridorDecision: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly decision: "hold_existing_corridor_with_structured_error_budget";
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  readonly landedGate: "gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan";
  readonly previousLandedGate: "gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan";
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_an_source_absent_uncertainty_landed_no_runtime_selected_error_budget_surface_parity_gate_ao";
  readonly sourcePacketRules: {
    readonly acceptedSourceOwnedDeltaLwHoldoutCount: number;
    readonly broadSourceLibraryCrawlAllowedNext: false;
    readonly requiredOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly sourceRowsAreHoldoutsOrCalibrationNotProduct: true;
  };
  readonly sourceRowsRequiredForRuntimeSelection: false;
  readonly surfacePayloadContract: {
    readonly notMeasuredEvidence: true;
    readonly paritySurfaces: readonly string[];
    readonly requiredPayloadFields: readonly string[];
    readonly selectedNextSurfaceGate: typeof GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_ACTION;
  };
  readonly evaluations: {
    readonly completeSourceAbsent: SteelFloorFormulaSourceAbsentUncertaintyEvaluation;
    readonly exactSourcePrecedence: SteelFloorFormulaSourceAbsentUncertaintyEvaluation;
    readonly missingInput: SteelFloorFormulaSourceAbsentUncertaintyEvaluation;
    readonly unsafeTopology: SteelFloorFormulaSourceAbsentUncertaintyEvaluation;
  };
};

const COMPLETE_OPEN_WEB_STEEL_INPUT = {
  baseSlab: {
    materialClass: "lightweight_steel_carrier",
    thicknessMm: 200,
  },
  carrierSpacingMm: 600,
  floatingScreed: {
    densityKgM3: 1250,
    materialClass: "cement_board",
    thicknessMm: 18,
  },
  floorCovering: {
    materialClass: "ceramic_tile",
    mode: "material_layer",
    thicknessMm: 10,
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 64,
  lowerTreatment: {
    boardLayerCount: 1,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 200,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger",
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 35,
    thicknessMm: 4.5,
  },
  structuralSupportType: "steel_joists",
  supportForm: "open_web_or_rolled",
} as const satisfies ImpactPredictorInput;

const TARGET_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const round1 = (value: number): number => Math.round(value * 10) / 10;

const sumTermDb = (terms: readonly SteelFloorFormulaUncertaintyTerm[]): number =>
  round1(terms.reduce((sum, term) => sum + term.db, 0));

const term = (
  termId: SteelFloorFormulaUncertaintyTermId,
  db: number,
  origin: SteelFloorFormulaUncertaintyTermOrigin,
  reason: string,
  tightenRequires: readonly string[],
): SteelFloorFormulaUncertaintyTerm => ({
  db,
  origin,
  reason,
  termId,
  tightenRequires,
});

const lnWTerms = (): readonly SteelFloorFormulaUncertaintyTerm[] => [
  term(
    "source_owned_delta_lw_holdout_absence",
    1.1,
    "missing_source_owned_holdout",
    "Gate AM found no source-owned same-stack ISO DeltaLw steel-floor holdout.",
    ["accepted_source_owned_same_stack_iso_delta_lw_holdouts"],
  ),
  term(
    "source_absent_bare_steel_reference_model",
    0.9,
    "source_absent_formula_assumption",
    "Bare steel reference Ln,w is modelled from support form, carrier depth, lower mass, cavity, and fill instead of a measured same-stack row.",
    ["same_stack_bare_steel_reference_rows"],
  ),
  term(
    "support_form_transfer_efficiency",
    0.8,
    "source_absent_formula_assumption",
    "Steel carrier transfer applies a bounded efficiency factor because the source-owned transfer curve is still absent.",
    ["source_owned_steel_transfer_efficiency_curve"],
  ),
  term(
    "lower_support_class_simplification",
    0.7,
    "topology_simplification",
    "Lower isolation support is explicit but still reduced to support class, board mass, cavity depth, and fill thickness.",
    ["lower_ceiling_support_family_holdouts"],
  ),
  term(
    "dynamic_stiffness_precision",
    0.6,
    "explicit_user_input_precision",
    "Dynamic stiffness is user-provided as a scalar s' value without a full frequency-dependent resilient layer curve.",
    ["frequency_dependent_dynamic_stiffness_or_product_curve_owner"],
  ),
  term(
    "load_basis_precision",
    0.4,
    "explicit_user_input_precision",
    "Load basis is explicit but still an aggregate kg/m2 input rather than a source-owned load schedule.",
    ["source_owned_load_basis_schedule"],
  ),
];

const deltaLwTerms = (): readonly SteelFloorFormulaUncertaintyTerm[] => [
  term(
    "source_owned_delta_lw_holdout_absence",
    0.7,
    "missing_source_owned_holdout",
    "No accepted source-owned same-stack ISO DeltaLw steel-floor holdout exists after Gate AM.",
    ["accepted_source_owned_same_stack_iso_delta_lw_holdouts"],
  ),
  term(
    "dynamic_stiffness_precision",
    0.5,
    "explicit_user_input_precision",
    "DeltaLw is sensitive to s'; current input owns the scalar but not a full tested resilient-product response.",
    ["frequency_dependent_dynamic_stiffness_or_product_curve_owner"],
  ),
  term(
    "load_basis_precision",
    0.4,
    "explicit_user_input_precision",
    "DeltaLw is sensitive to m'load; current input owns aggregate load rather than a measured load schedule.",
    ["source_owned_load_basis_schedule"],
  ),
  term(
    "upper_resilient_topology_simplification",
    0.4,
    "topology_simplification",
    "Upper resilient topology is represented by dynamic stiffness and package load, not a measured same-stack construction packet.",
    ["upper_resilient_topology_holdouts"],
  ),
];

const budgetFor = (
  metricId: SteelFloorFormulaUncertaintyMetricId,
  estimate: number,
): SteelFloorFormulaMetricErrorBudget => {
  const terms = metricId === "Ln,w" ? lnWTerms() : deltaLwTerms();
  const toleranceDb =
    metricId === "Ln,w"
      ? STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
      : STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;

  return {
    estimate,
    max: round1(estimate + toleranceDb),
    metricId,
    min: round1(estimate - toleranceDb),
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    terms,
    toleranceDb,
    totalBudgetDb: sumTermDb(terms),
  };
};

export const buildSteelFloorFormulaSourceAbsentUncertaintyEvaluation = (input: {
  readonly exactSourceRowAvailable?: boolean;
  readonly impactPredictorInput?: ImpactPredictorInput | null;
  readonly targetOutputs?: readonly RequestedOutputId[];
  readonly unsafeTopologyReason?: string;
}): SteelFloorFormulaSourceAbsentUncertaintyEvaluation => {
  const targetOutputs = input.targetOutputs ?? TARGET_OUTPUTS;

  if (input.unsafeTopologyReason) {
    return {
      errorBudgets: [],
      exactMeasuredRowsRemainPrecedence: true,
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      impact: null,
      missingPhysicalInputs: [],
      runtimeValueMovement: false,
      status: "unsafe_topology",
      targetOutputs,
      unsafeTopologyReason: input.unsafeTopologyReason,
    };
  }

  const corridor = buildGateADSteelFloorImpactFormulaCorridorContract({
    exactSourceRowAvailable: input.exactSourceRowAvailable,
    impactPredictorInput: input.impactPredictorInput ?? null,
    targetOutputs,
  });

  if (corridor.status === "exact_source_precedence") {
    return {
      errorBudgets: [],
      exactMeasuredRowsRemainPrecedence: true,
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      impact: null,
      missingPhysicalInputs: [],
      runtimeValueMovement: false,
      status: "exact_source_precedence",
      targetOutputs,
    };
  }

  if (corridor.status !== "formula_corridor_ready" || !corridor.impact) {
    return {
      errorBudgets: [],
      exactMeasuredRowsRemainPrecedence: true,
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      impact: null,
      missingPhysicalInputs: corridor.missingPhysicalInputs,
      runtimeValueMovement: false,
      status: "needs_input",
      targetOutputs,
    };
  }

  const budgets: SteelFloorFormulaMetricErrorBudget[] = [];

  if (typeof corridor.impact.LnW === "number") {
    budgets.push(budgetFor("Ln,w", corridor.impact.LnW));
  }

  if (typeof corridor.impact.DeltaLw === "number") {
    budgets.push(budgetFor("DeltaLw", corridor.impact.DeltaLw));
  }

  return {
    errorBudgets: budgets,
    exactMeasuredRowsRemainPrecedence: true,
    formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    impact: corridor.impact,
    missingPhysicalInputs: [],
    runtimeValueMovement: false,
    status: "ready_with_source_absent_error_budget",
    targetOutputs,
  };
};

export const buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract =
  (): GateANSteelFloorFormulaSourceAbsentUncertaintyContract => {
    const gateAM = buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract();

    return {
      corridorDecision: {
        deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
        decision: "hold_existing_corridor_with_structured_error_budget",
        lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
        runtimeRetuneAllowedNow: false,
        runtimeValueMovement: false,
      },
      evaluations: {
        completeSourceAbsent:
          buildSteelFloorFormulaSourceAbsentUncertaintyEvaluation({
            impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
          }),
        exactSourcePrecedence:
          buildSteelFloorFormulaSourceAbsentUncertaintyEvaluation({
            exactSourceRowAvailable: true,
            impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
          }),
        missingInput: buildSteelFloorFormulaSourceAbsentUncertaintyEvaluation({
          impactPredictorInput: {
            ...COMPLETE_OPEN_WEB_STEEL_INPUT,
            carrierSpacingMm: undefined,
          },
        }),
        unsafeTopology: buildSteelFloorFormulaSourceAbsentUncertaintyEvaluation({
          impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
          unsafeTopologyReason:
            "Duplicate or ambiguous steel base-structure rows must be repaired before the formula budget can be read.",
        }),
      },
      exactMeasuredRowsRemainPrecedence: true,
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      landedGate:
        "gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan",
      previousLandedGate:
        "gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_an_source_absent_uncertainty_landed_no_runtime_selected_error_budget_surface_parity_gate_ao",
      sourcePacketRules: {
        acceptedSourceOwnedDeltaLwHoldoutCount:
          gateAM.acceptedMeasuredHoldoutCount,
        broadSourceLibraryCrawlAllowedNext: false,
        requiredOwnerFields: [
          ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
        ],
        sourceRowsAreHoldoutsOrCalibrationNotProduct: true,
      },
      sourceRowsRequiredForRuntimeSelection: false,
      surfacePayloadContract: {
        notMeasuredEvidence: true,
        paritySurfaces: [
          "output_cards",
          "report_payload",
          "calculator_api_payload",
          "impact_only_api_payload",
        ],
        requiredPayloadFields: [
          "metricId",
          "estimate",
          "min",
          "max",
          "toleranceDb",
          "totalBudgetDb",
          "terms",
          "origin",
          "notMeasuredEvidence",
        ],
        selectedNextSurfaceGate:
          GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_ACTION,
      },
    };
  };
