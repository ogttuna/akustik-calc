import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS,
  POST_V1_GATE_EC_COUNTERS,
  POST_V1_GATE_EC_OWNER_ID,
  POST_V1_GATE_EC_OWNER_POLICY,
  POST_V1_GATE_EC_REQUIRED_OWNER_FIELDS
} from "./post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-owner-gate-ec";

export const POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_LANDED_GATE =
  "post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_plan" as const;

export const POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS =
  "post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_landed_runtime_selected_next_numeric_coverage_gap_gate_ee" as const;

export const POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ee_plan" as const;

export const POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ee-contract.test.ts" as const;

export const POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate EE" as const;

export const POST_V1_GATE_ED_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateEDRuntimeProbeExpectation = {
  readonly basis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate";
  readonly deltaLwDb: 29.9;
  readonly id: "visible_resilient_channel_combined_upper_lower_formula_runtime";
  readonly lnWDb: 44.6;
  readonly ownerId: typeof POST_V1_GATE_EC_OWNER_ID;
  readonly selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula";
  readonly sourceRowsRequiredForCalculation: false;
  readonly supportedOutputs: typeof POST_V1_GATE_ED_TARGET_OUTPUTS;
};

export const POST_V1_GATE_ED_RUNTIME_PROBE_EXPECTATIONS = [
  {
    basis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate",
    deltaLwDb: 29.9,
    id: "visible_resilient_channel_combined_upper_lower_formula_runtime",
    lnWDb: 44.6,
    ownerId: POST_V1_GATE_EC_OWNER_ID,
    selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
    sourceRowsRequiredForCalculation: false,
    supportedOutputs: POST_V1_GATE_ED_TARGET_OUTPUTS
  }
] as const satisfies readonly PostV1GateEDRuntimeProbeExpectation[];

export const POST_V1_GATE_ED_COUNTERS = {
  astmAliasesPromoted: 0,
  formulaCorridorGuardsWeakened: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 4,
  runtimeCorrectedLayerTemplates: 1,
  runtimeCorrectedRequestShapes: 4,
  sourceRowsImported: 0
} as const;

export type PostV1GateEDSummary = {
  readonly counters: typeof POST_V1_GATE_ED_COUNTERS;
  readonly landedGate:
    typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_LANDED_GATE;
  readonly previousGateEC: {
    readonly counters: typeof POST_V1_GATE_EC_COUNTERS;
    readonly landedGate:
      typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE;
    readonly ownerId: typeof POST_V1_GATE_EC_OWNER_ID;
    readonly ownerPolicy: typeof POST_V1_GATE_EC_OWNER_POLICY;
    readonly requiredOwnerFields: typeof POST_V1_GATE_EC_REQUIRED_OWNER_FIELDS;
    readonly selectedNextAction:
      typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS;
  };
  readonly runtimeProbeExpectations: typeof POST_V1_GATE_ED_RUNTIME_PROBE_EXPECTATIONS;
  readonly selectedNextAction:
    typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS;
  readonly sourceRowsRequiredForRuntimeSelection: false;
  readonly targetOutputs: typeof POST_V1_GATE_ED_TARGET_OUTPUTS;
  readonly valueMovement: "visible_resilient_channel_lower_treatment_formula_promotion";
};

export function summarizePostV1FloorHeavyConcreteCombinedResilientChannelLowerTreatmentRuntimeGateED():
  PostV1GateEDSummary {
  if (
    POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_LANDED_GATE
  ) {
    throw new Error("Gate ED can only land after Gate EC selects the resilient-channel runtime slice.");
  }

  return {
    counters: POST_V1_GATE_ED_COUNTERS,
    landedGate:
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_LANDED_GATE,
    previousGateEC: {
      counters: POST_V1_GATE_EC_COUNTERS,
      landedGate: POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE,
      ownerId: POST_V1_GATE_EC_OWNER_ID,
      ownerPolicy: POST_V1_GATE_EC_OWNER_POLICY,
      requiredOwnerFields: POST_V1_GATE_EC_REQUIRED_OWNER_FIELDS,
      selectedNextAction:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE,
      selectionStatus:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS
    },
    runtimeProbeExpectations: POST_V1_GATE_ED_RUNTIME_PROBE_EXPECTATIONS,
    selectedNextAction:
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: POST_V1_GATE_ED_TARGET_OUTPUTS,
    valueMovement: "visible_resilient_channel_lower_treatment_formula_promotion"
  };
}
