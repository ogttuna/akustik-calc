import type { RequestedOutputId } from "@dynecho/shared";

import {
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
  FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID
} from "./impact-field-adapter-error-budget";
import {
  LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
  LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID
} from "./lightweight-concrete-family-runtime-constants";
import {
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS
} from "./post-v1-floor-lightweight-concrete-family-solver-owner-gate-m";

export const POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_LANDED_GATE =
  "post_v1_floor_field_building_expansion_gate_n_plan";

export const POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTION_STATUS =
  "post_v1_floor_field_building_expansion_gate_n_landed_selected_gate_o_input_surface_guided_physical_fields";

export const POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_ACTION =
  "post_v1_input_surface_guided_physical_fields_gate_o_plan";

export const POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-input-surface-guided-physical-fields-gate-o-contract.test.ts";

export const POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_LABEL =
  "post-V1 input-surface guided physical fields Gate O";

export const POST_V1_GATE_N_LIGHTWEIGHT_FIELD_VALUE_PINS = [
  { metric: "L'n,w", value: 66.3 },
  { metric: "L'nT,w", value: 63.9 }
] as const satisfies readonly { readonly metric: RequestedOutputId; readonly value: number }[];

export type PostV1FloorFieldBuildingExpansionGateNContract = {
  readonly adapterCandidateId: typeof FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID;
  readonly blockedAliasesUntilSeparateOwner: readonly ["IIC", "AIIC", "building_prediction"];
  readonly landedGate: typeof POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_LANDED_GATE;
  readonly previousGateM: {
    readonly landedGate: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS;
  };
  readonly rejectedDefaultMoves: readonly [
    "broad_source_crawl",
    "confidence_wording_pass",
    "docs_only_cleanup",
    "finite_scenario_pack",
    "lab_to_field_alias"
  ];
  readonly runtimeBasisId: typeof FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN;
  readonly selectedNextAction: typeof POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTION_STATUS;
  readonly sourceRowsAreAnchorsNotProduct: true;
  readonly supportedMetrics: readonly ["L'n,w", "L'nT,w"];
  readonly unlockedRuntimeScenario: {
    readonly anchorCandidateId: typeof LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID;
    readonly anchorRuntimeBasisId: typeof LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS;
    readonly requiredPhysicalInputs: readonly [
      "ownedLabImpactAnchorLnW",
      "impactFieldContext.fieldKDb",
      "impactFieldContext.receivingRoomVolumeM3"
    ];
    readonly valuePins: typeof POST_V1_GATE_N_LIGHTWEIGHT_FIELD_VALUE_PINS;
  };
  readonly toleranceDb: {
    readonly "L'n,w": typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB;
    readonly "L'nT,w": typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB;
  };
};

export function buildPostV1FloorFieldBuildingExpansionGateNContract():
  PostV1FloorFieldBuildingExpansionGateNContract {
  return {
    adapterCandidateId: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
    blockedAliasesUntilSeparateOwner: ["IIC", "AIIC", "building_prediction"],
    landedGate: POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_LANDED_GATE,
    previousGateM: {
      landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS
    },
    rejectedDefaultMoves: [
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "lab_to_field_alias"
    ],
    runtimeBasisId: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
    selectedNextAction: POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTION_STATUS,
    sourceRowsAreAnchorsNotProduct: true,
    supportedMetrics: ["L'n,w", "L'nT,w"],
    toleranceDb: {
      "L'n,w": FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB,
      "L'nT,w": FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB
    },
    unlockedRuntimeScenario: {
      anchorCandidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
      anchorRuntimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
      requiredPhysicalInputs: [
        "ownedLabImpactAnchorLnW",
        "impactFieldContext.fieldKDb",
        "impactFieldContext.receivingRoomVolumeM3"
      ],
      valuePins: POST_V1_GATE_N_LIGHTWEIGHT_FIELD_VALUE_PINS
    }
  };
}
