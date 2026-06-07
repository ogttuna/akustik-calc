import type { RequestedOutputId } from "@dynecho/shared";

import {
  LIGHTWEIGHT_CONCRETE_DELTA_LW_REQUIRED_FIELDS,
  LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
  LIGHTWEIGHT_CONCRETE_DELTA_LW_SELECTED_CANDIDATE_ID,
  LIGHTWEIGHT_CONCRETE_DELTA_LW_TOLERANCE_DB
} from "./lightweight-concrete-delta-lw-runtime-corridor";
import {
  LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
  LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID
} from "./lightweight-concrete-family-runtime-constants";
import {
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS
} from "./post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da";

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_LANDED_GATE =
  "post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan" as const;

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS =
  "post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_landed_runtime_selected_next_numeric_coverage_gap_gate_dc" as const;

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_dc_plan" as const;

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dc-contract.test.ts" as const;

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate DC" as const;

export const POST_V1_GATE_DB_TARGET_OUTPUTS = [
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export type PostV1FloorLightweightConcreteDeltaLwRuntimeCorridorGateDBSummary = {
  readonly coverageCounters: {
    readonly newCalculableLayerTemplates: 2;
    readonly newCalculableRequestShapes: 4;
    readonly runtimeCorrectedLayerTemplates: 2;
    readonly runtimeCorrectedRequestShapes: 4;
  };
  readonly deltaLwRuntimeBasisId: typeof LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS;
  readonly existingFamilyCandidateId: typeof LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID;
  readonly existingFamilyRuntimeBasisId: typeof LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS;
  readonly forbiddenFormulaBorrowing: readonly [
    "heavy_concrete_annex_c_delta_lw",
    "composite_panel_bare_minus_treated_delta_lw",
    "timber_clt_delta_lw",
    "steel_mass_spring_delta_lw"
  ];
  readonly landedGate: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_LANDED_GATE;
  readonly previousGateDA: {
    readonly landedGate: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS;
  };
  readonly requiredFields: typeof LIGHTWEIGHT_CONCRETE_DELTA_LW_REQUIRED_FIELDS;
  readonly selectedCandidateId: typeof LIGHTWEIGHT_CONCRETE_DELTA_LW_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS;
  readonly sourceRowsAreAnchorsNotProduct: true;
  readonly supportedMetrics: readonly ["DeltaLw"];
  readonly targetOutputs: typeof POST_V1_GATE_DB_TARGET_OUTPUTS;
  readonly toleranceDb: typeof LIGHTWEIGHT_CONCRETE_DELTA_LW_TOLERANCE_DB;
};

export function summarizePostV1FloorLightweightConcreteDeltaLwRuntimeCorridorGateDB():
  PostV1FloorLightweightConcreteDeltaLwRuntimeCorridorGateDBSummary {
  if (
    POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_LANDED_GATE
  ) {
    throw new Error("Gate DB can only land after Gate DA selects the lightweight-concrete DeltaLw runtime corridor.");
  }

  return {
    coverageCounters: {
      newCalculableLayerTemplates: 2,
      newCalculableRequestShapes: 4,
      runtimeCorrectedLayerTemplates: 2,
      runtimeCorrectedRequestShapes: 4
    },
    deltaLwRuntimeBasisId: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
    existingFamilyCandidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
    existingFamilyRuntimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
    forbiddenFormulaBorrowing: [
      "heavy_concrete_annex_c_delta_lw",
      "composite_panel_bare_minus_treated_delta_lw",
      "timber_clt_delta_lw",
      "steel_mass_spring_delta_lw"
    ],
    landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_LANDED_GATE,
    previousGateDA: {
      landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS
    },
    requiredFields: LIGHTWEIGHT_CONCRETE_DELTA_LW_REQUIRED_FIELDS,
    selectedCandidateId: LIGHTWEIGHT_CONCRETE_DELTA_LW_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS,
    sourceRowsAreAnchorsNotProduct: true,
    supportedMetrics: ["DeltaLw"],
    targetOutputs: POST_V1_GATE_DB_TARGET_OUTPUTS,
    toleranceDb: LIGHTWEIGHT_CONCRETE_DELTA_LW_TOLERANCE_DB
  };
}
