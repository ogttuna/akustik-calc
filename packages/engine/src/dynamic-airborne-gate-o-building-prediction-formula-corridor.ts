import type { RequestedOutputId } from "@dynecho/shared";

import {
  buildGateNAirborneBuildingPredictionRuntimeAdapterScenarioPack,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_PLAN,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_STATUS
} from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
} from "./dynamic-calculator-route-input-topology";

export const GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN =
  "gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan";

export const GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS =
  "gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_p";

export const GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION =
  "gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan";

export const GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts";

export const GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_BASIS =
  "iso_12354_1_inspired_airborne_building_prediction_source_absent_formula_corridor";

export const GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB = 9;

export type GateOAirborneBuildingPredictionFormulaLaneId =
  | "airborne_building_apparent_r_prime_w_formula_corridor"
  | "airborne_building_standardized_dnt_w_formula_corridor";

export type GateOAirborneBuildingPredictionCorridorStatus =
  | "blocked_basis_alias"
  | "blocked_missing_formula_owner"
  | "blocked_missing_physical_input"
  | "formula_corridor_defined_runtime_gate_required"
  | "not_building_prediction";

export type GateOAirborneBuildingPredictionFormulaTerm = {
  basis: "owned_formula_term" | "source_absent_formula_design_term";
  description: string;
  requiredInputs: readonly string[];
  runtimeOwnedInGateO: false;
  termId: string;
};

export type GateOAirborneBuildingPredictionToleranceTerm = {
  basis: "source_absent_formula_design_budget";
  db: number;
  termId: string;
};

export type GateOAirborneBuildingPredictionToleranceBudget = {
  metricId: "R'w" | "DnT,w";
  notMeasuredEvidence: true;
  terms: readonly GateOAirborneBuildingPredictionToleranceTerm[];
  toleranceDb: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
  totalBudgetDb: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
};

export type GateOAirborneBuildingPredictionFormulaCorridor = {
  basisId: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_BASIS;
  corridorStatus: "formula_corridor_defined_runtime_gate_required";
  exactMeasuredRowsRemainPrecedence: true;
  formulaLaneId: GateOAirborneBuildingPredictionFormulaLaneId;
  formulaTerms: readonly GateOAirborneBuildingPredictionFormulaTerm[];
  metricId: "R'w" | "DnT,w";
  proposedRuntimeEstimateDb: null;
  requiredFormulaOwnerInputs: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS;
  requiredPhysicalInputs: typeof GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS;
  runtimePromotionAllowedInGateO: false;
  sourceRowsRequiredForFormulaDesign: false;
  sourceRowsRequiredForRuntimeSelection: false;
  toleranceBudget: GateOAirborneBuildingPredictionToleranceBudget;
};

export type GateOAirborneBuildingPredictionNegativeBoundary = {
  expectedRuntimeEstimateDb: null;
  gateNScenarioId?: string;
  reason: string;
  status: GateOAirborneBuildingPredictionCorridorStatus;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateOAirborneBuildingPredictionFormulaCorridorContract = {
  basisAliasBlocked: {
    fieldRuntimeBudget: true;
    labRwOrStc: true;
    sourceSingleNumberWithoutCurve: true;
  };
  candidateFormulaCorridors: readonly GateOAirborneBuildingPredictionFormulaCorridor[];
  exactMeasuredRowsRemainPrecedence: true;
  landedGate: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN;
  negativeBoundaries: readonly GateOAirborneBuildingPredictionNegativeBoundary[];
  numericRuntimeBehaviorChange: false;
  previousLandedGate: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_PLAN;
  previousSelectionStatus: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_STATUS;
  runtimePromotionAllowedInGateO: false;
  runtimeValueMovement: false;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE;
  selectionStatus: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS;
  sourceRowsRequiredForFormulaDesign: false;
  sourceRowsRequiredForRuntimeSelection: false;
};

const FORMULA_TERMS: readonly GateOAirborneBuildingPredictionFormulaTerm[] = [
  {
    basis: "owned_formula_term",
    description:
      "Direct separating-element frequency curve must come from the selected dynamic airborne family solver, not from a single-number Rw/STC alias.",
    requiredInputs: ["selectedDynamicAirborneCurve", "ISO717-1 rating adapter"],
    runtimeOwnedInGateO: false,
    termId: "direct_separating_element_frequency_curve"
  },
  {
    basis: "source_absent_formula_design_term",
    description:
      "Flanking paths must be represented as energy terms before building runtime can be promoted; the current field overlay is only a conservative graph.",
    requiredInputs: ["flankingPathTransmissionTermsOwner", "flankingJunctionClass"],
    runtimeOwnedInGateO: false,
    termId: "flanking_path_energy_sum"
  },
  {
    basis: "source_absent_formula_design_term",
    description:
      "Junction vibration reduction must be explicitly owned from junction class and coupling length before it can become an ISO 12354-1 runtime term.",
    requiredInputs: ["junctionVibrationReductionIndexOwner", "junctionCouplingLengthM"],
    runtimeOwnedInGateO: false,
    termId: "junction_vibration_reduction_index"
  },
  {
    basis: "owned_formula_term",
    description:
      "Room standardization uses separating area, receiving-room volume, and RT60 through the existing ISO 717 field rating adapter.",
    requiredInputs: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
    runtimeOwnedInGateO: false,
    termId: "room_absorption_standardization"
  },
  {
    basis: "source_absent_formula_design_term",
    description:
      "Building-prediction uncertainty must remain visible because source-owned same-building holdouts are not yet available.",
    requiredInputs: ["buildingPredictionUncertaintyBudgetOwner"],
    runtimeOwnedInGateO: false,
    termId: "building_prediction_uncertainty_budget"
  }
] as const;

const APPARENT_TOLERANCE_TERMS = [
  {
    basis: "source_absent_formula_design_budget",
    db: 2.4,
    termId: "direct_family_curve_residual"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 2.7,
    termId: "flanking_energy_path_simplification"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 1.8,
    termId: "junction_vibration_reduction_surrogate"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 1.1,
    termId: "input_geometry_precision"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 1,
    termId: "same_building_holdout_absence"
  }
] as const satisfies readonly GateOAirborneBuildingPredictionToleranceTerm[];

const STANDARDIZED_TOLERANCE_TERMS = [
  {
    basis: "source_absent_formula_design_budget",
    db: 2.4,
    termId: "direct_family_curve_residual"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 2.7,
    termId: "flanking_energy_path_simplification"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 1.8,
    termId: "junction_vibration_reduction_surrogate"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 1.1,
    termId: "receiving_room_standardization_precision"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 1,
    termId: "same_building_holdout_absence"
  }
] as const satisfies readonly GateOAirborneBuildingPredictionToleranceTerm[];

function buildCorridor(input: {
  formulaLaneId: GateOAirborneBuildingPredictionFormulaLaneId;
  metricId: "R'w" | "DnT,w";
  toleranceTerms: readonly GateOAirborneBuildingPredictionToleranceTerm[];
}): GateOAirborneBuildingPredictionFormulaCorridor {
  return {
    basisId: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_BASIS,
    corridorStatus: "formula_corridor_defined_runtime_gate_required",
    exactMeasuredRowsRemainPrecedence: true,
    formulaLaneId: input.formulaLaneId,
    formulaTerms: FORMULA_TERMS,
    metricId: input.metricId,
    proposedRuntimeEstimateDb: null,
    requiredFormulaOwnerInputs: GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS,
    requiredPhysicalInputs: GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS,
    runtimePromotionAllowedInGateO: false,
    sourceRowsRequiredForFormulaDesign: false,
    sourceRowsRequiredForRuntimeSelection: false,
    toleranceBudget: {
      metricId: input.metricId,
      notMeasuredEvidence: true,
      terms: input.toleranceTerms,
      toleranceDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      totalBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
    }
  };
}

export function buildGateOAirborneBuildingPredictionFormulaCorridorContract(): GateOAirborneBuildingPredictionFormulaCorridorContract {
  const gateNScenarios = buildGateNAirborneBuildingPredictionRuntimeAdapterScenarioPack();
  const missingPhysical = gateNScenarios.find(
    (scenario) => scenario.id === "gate_n_missing_source_room_geometry_needs_input"
  );
  const missingFormula = gateNScenarios.find(
    (scenario) => scenario.id === "gate_n_complete_gate_m_owner_set_missing_formula_owner"
  );
  const fieldContext = gateNScenarios.find(
    (scenario) => scenario.id === "gate_n_field_between_rooms_stays_out_of_building_runtime_adapter"
  );

  return {
    basisAliasBlocked: {
      fieldRuntimeBudget: true,
      labRwOrStc: true,
      sourceSingleNumberWithoutCurve: true
    },
    candidateFormulaCorridors: [
      buildCorridor({
        formulaLaneId: "airborne_building_apparent_r_prime_w_formula_corridor",
        metricId: "R'w",
        toleranceTerms: APPARENT_TOLERANCE_TERMS
      }),
      buildCorridor({
        formulaLaneId: "airborne_building_standardized_dnt_w_formula_corridor",
        metricId: "DnT,w",
        toleranceTerms: STANDARDIZED_TOLERANCE_TERMS
      })
    ],
    exactMeasuredRowsRemainPrecedence: true,
    landedGate: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN,
    negativeBoundaries: [
      {
        expectedRuntimeEstimateDb: null,
        gateNScenarioId: missingPhysical?.id,
        reason: "Physical building-prediction fields must be complete before formula ownership matters.",
        status: "blocked_missing_physical_input",
        targetOutputs: [...(missingPhysical?.blockedOutputs ?? ["R'w", "DnT,w"])]
      },
      {
        expectedRuntimeEstimateDb: null,
        gateNScenarioId: missingFormula?.id,
        reason: "Gate N formula-owner fields are still missing; Gate O defines the corridor but does not run it.",
        status: "blocked_missing_formula_owner",
        targetOutputs: [...(missingFormula?.blockedOutputs ?? ["R'w", "DnT,w"])]
      },
      {
        expectedRuntimeEstimateDb: null,
        gateNScenarioId: fieldContext?.id,
        reason: "Room-to-room field context stays on Gate I/J/K and is not a building-prediction formula input.",
        status: "not_building_prediction",
        targetOutputs: ["R'w", "DnT,w"]
      },
      {
        expectedRuntimeEstimateDb: null,
        reason: "Lab Rw/STC and source single-number ratings cannot be relabelled as building R'w/DnT,w.",
        status: "blocked_basis_alias",
        targetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
      }
    ],
    numericRuntimeBehaviorChange: false,
    previousLandedGate: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_PLAN,
    previousSelectionStatus: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_STATUS,
    runtimePromotionAllowedInGateO: false,
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
    selectedNextFile: GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
    selectionStatus: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS,
    sourceRowsRequiredForFormulaDesign: false,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
