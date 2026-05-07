import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactErrorBudget,
  ImpactErrorBudgetTerm,
  ImpactPredictorInput,
  RequestedOutputId,
} from "@dynecho/shared";

import { buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract } from "./steel-floor-formula-source-owned-delta-lw-source-packet-acquisition";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  buildSteelFloorFormulaErrorBudgets,
  buildGateADSteelFloorImpactFormulaCorridorContract,
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  type SteelFloorFormulaErrorBudgetMetricId,
} from "./steel-floor-impact-formula-corridor";

export const GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts";

export const GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_ACTION =
  "gate_ao_steel_floor_formula_error_budget_surface_parity_plan";

export type SteelFloorFormulaUncertaintyMetricId =
  SteelFloorFormulaErrorBudgetMetricId;

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

export type SteelFloorFormulaUncertaintyTerm = Omit<
  ImpactErrorBudgetTerm,
  "origin" | "termId" | "tightenRequires"
> & {
  readonly origin: SteelFloorFormulaUncertaintyTermOrigin;
  readonly termId: SteelFloorFormulaUncertaintyTermId;
  readonly tightenRequires: readonly string[];
};

export type SteelFloorFormulaMetricErrorBudget = Omit<
  ImpactErrorBudget,
  "metricId" | "notMeasuredEvidence" | "origin" | "terms"
> & {
  readonly metricId: SteelFloorFormulaUncertaintyMetricId;
  readonly notMeasuredEvidence: true;
  readonly origin: "source_absent_formula_error_budget";
  readonly terms: readonly SteelFloorFormulaUncertaintyTerm[];
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

  const budgets = buildSteelFloorFormulaErrorBudgets(
    corridor.impact,
  ) as SteelFloorFormulaMetricErrorBudget[];

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
