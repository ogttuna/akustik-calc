import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_EB_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EB_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-eb";

export const POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE =
  "post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_plan" as const;

export const POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS =
  "post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_landed_no_runtime_selected_resilient_channel_lower_treatment_runtime_gate_ed" as const;

export const POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION =
  "post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_plan" as const;

export const POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed-contract.test.ts" as const;

export const POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_LABEL =
  "post-V1 floor heavy-concrete combined resilient-channel lower-treatment runtime Gate ED" as const;

export const POST_V1_GATE_EC_OWNER_ID =
  "floor.heavy_concrete_combined.resilient_channel_lower_treatment_owner" as const;

export const POST_V1_GATE_EC_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateECRequiredOwnerField =
  | "ISO_12354_2_Annex_C_lab_impact_adapter"
  | "baseSlabOrFloor"
  | "ceilingBoardSchedule"
  | "ceilingCavityDepthMm"
  | "ceilingFillThicknessMm"
  | "floatingOrToppingLayer"
  | "impactSystemType=combined_upper_lower_system"
  | "loadBasisKgM2"
  | "lowerTreatment.type=suspended_ceiling_elastic_hanger"
  | "resilientLayerDynamicStiffnessMNm3"
  | "structuralSupportType=reinforced_concrete"
  | "supportProductId=resilient_channel"
  | "visibleCeilingCavityMaterialId=resilient_channel";

export type PostV1GateECRejectedBoundary = {
  readonly boundary:
    | "already_live_adjacent_lower_treatment"
    | "astm_alias_not_owned"
    | "missing_route_required_physical_input"
    | "old_low_confidence_reinforced_concrete_fallback"
    | "wrong_metric_lower_treatment_delta_lw_subtraction";
  readonly id: string;
  readonly reason: string;
};

export type PostV1GateECRuntimeProbeExpectation = {
  readonly basis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate";
  readonly deltaLwDb: number;
  readonly id: "visible_resilient_channel_combined_upper_lower_formula_after_gate_ed";
  readonly lnWDb: number;
  readonly selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula";
  readonly sourceRowsRequiredForCalculation: false;
  readonly supportedOutputs: typeof POST_V1_GATE_EC_TARGET_OUTPUTS;
};

export const POST_V1_GATE_EC_REQUIRED_OWNER_FIELDS = [
  "structuralSupportType=reinforced_concrete",
  "impactSystemType=combined_upper_lower_system",
  "visibleCeilingCavityMaterialId=resilient_channel",
  "supportProductId=resilient_channel",
  "lowerTreatment.type=suspended_ceiling_elastic_hanger",
  "baseSlabOrFloor",
  "floatingOrToppingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2",
  "ceilingBoardSchedule",
  "ceilingCavityDepthMm",
  "ceilingFillThicknessMm",
  "ISO_12354_2_Annex_C_lab_impact_adapter"
] as const satisfies readonly PostV1GateECRequiredOwnerField[];

export const POST_V1_GATE_EC_REJECTED_BOUNDARIES = [
  {
    boundary: "already_live_adjacent_lower_treatment",
    id: "furring_hanger_and_resilient_stud_are_not_the_gap",
    reason:
      "furring_channel, acoustic_hanger_ceiling, and resilient_stud_ceiling already calculate through the heavy-concrete combined formula corridor and do not need a new owner."
  },
  {
    boundary: "missing_route_required_physical_input",
    id: "missing_load_dynamic_or_lower_assembly_stays_needs_input",
    reason:
      "Gate EC does not default loadBasisKgM2, resilientLayerDynamicStiffnessMNm3, board schedule, cavity depth, or lower fill; Gate ED may calculate only when they are present."
  },
  {
    boundary: "old_low_confidence_reinforced_concrete_fallback",
    id: "generic_reinforced_concrete_low_confidence_lane_stays_closed",
    reason:
      "The accepted owner is only the existing heavy-concrete combined formula corridor with explicit visible resilient-channel lower treatment, not the removed generic reinforced-concrete low-confidence estimate."
  },
  {
    boundary: "wrong_metric_lower_treatment_delta_lw_subtraction",
    id: "open_web_hollow_core_pliteq_knauf_subtraction_stays_rejected",
    reason:
      "Lower-treatment rows from other floor families cannot be subtracted into a generic ISO DeltaLw owner."
  },
  {
    boundary: "astm_alias_not_owned",
    id: "astm_iic_aiic_alias_stays_unsupported",
    reason:
      "ISO Ln,w and DeltaLw do not publish ASTM IIC or AIIC without ASTM E492/E1007 one-third-octave owners."
  }
] as const satisfies readonly PostV1GateECRejectedBoundary[];

export const POST_V1_GATE_EC_OWNER_POLICY = {
  acceptedLowerTreatmentProductId: "resilient_channel",
  acceptedLowerTreatmentType: "suspended_ceiling_elastic_hanger",
  acceptedRuntimeBasis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate",
  noRuntimeValueMovement: true,
  requiredOwnerFields: POST_V1_GATE_EC_REQUIRED_OWNER_FIELDS,
  sourceRowsAreAnchorsNotProductCatalog: true
} as const;

export const POST_V1_GATE_EC_RUNTIME_PROBE_EXPECTATIONS = [
  {
    basis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate",
    deltaLwDb: 29.9,
    id: "visible_resilient_channel_combined_upper_lower_formula_after_gate_ed",
    lnWDb: 44.6,
    selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
    sourceRowsRequiredForCalculation: false,
    supportedOutputs: POST_V1_GATE_EC_TARGET_OUTPUTS
  }
] as const satisfies readonly PostV1GateECRuntimeProbeExpectation[];

export const POST_V1_GATE_EC_COUNTERS = {
  acceptedOwnerLedgers: 1,
  astmAliasesPromoted: 0,
  estimatedNextNewCalculableLayerTemplates: 1,
  estimatedNextNewCalculableRequestShapes: 4,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  rejectedBoundaryExamples: POST_V1_GATE_EC_REJECTED_BOUNDARIES.length,
  runtimeBasisPromotions: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateECSummary = {
  readonly counters: typeof POST_V1_GATE_EC_COUNTERS;
  readonly landedGate:
    typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly ownerId: typeof POST_V1_GATE_EC_OWNER_ID;
  readonly ownerPolicy: typeof POST_V1_GATE_EC_OWNER_POLICY;
  readonly previousGateEB: {
    readonly counters: typeof POST_V1_GATE_EB_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_EB_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS;
  };
  readonly rejectedBoundaries: typeof POST_V1_GATE_EC_REJECTED_BOUNDARIES;
  readonly runtimeProbeExpectations: typeof POST_V1_GATE_EC_RUNTIME_PROBE_EXPECTATIONS;
  readonly selectedNextAction:
    typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_EC_TARGET_OUTPUTS;
};

export function summarizePostV1FloorHeavyConcreteCombinedResilientChannelLowerTreatmentOwnerGateEC():
  PostV1GateECSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE
  ) {
    throw new Error("Gate EC can only land after Gate EB selects the resilient-channel lower-treatment owner proof.");
  }

  return {
    counters: POST_V1_GATE_EC_COUNTERS,
    landedGate: POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerId: POST_V1_GATE_EC_OWNER_ID,
    ownerPolicy: POST_V1_GATE_EC_OWNER_POLICY,
    previousGateEB: {
      counters: POST_V1_GATE_EB_NO_RUNTIME_COUNTERS,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE,
      selectedCandidateId: POST_V1_GATE_EB_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS
    },
    rejectedBoundaries: POST_V1_GATE_EC_REJECTED_BOUNDARIES,
    runtimeProbeExpectations: POST_V1_GATE_EC_RUNTIME_PROBE_EXPECTATIONS,
    selectedNextAction:
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_EC_TARGET_OUTPUTS
  };
}
