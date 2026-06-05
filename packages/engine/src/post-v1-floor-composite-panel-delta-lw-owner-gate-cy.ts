import type { RequestedOutputId } from "@dynecho/shared";

import {
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID
} from "./composite-panel-published-interaction-runtime-constants";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cx";

export const POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE =
  "post_v1_floor_composite_panel_delta_lw_owner_gate_cy_plan" as const;

export const POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS =
  "post_v1_floor_composite_panel_delta_lw_owner_gate_cy_landed_runtime_selected_next_numeric_coverage_gap_gate_cz" as const;

export const POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_cz_plan" as const;

export const POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cz-contract.test.ts" as const;

export const POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate CZ" as const;

export const POST_V1_GATE_CY_TARGET_OUTPUTS = [
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CY_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 3,
  newCalculableRequestShapes: 3,
  runtimeCorrectedLayerTemplates: 0,
  runtimeCorrectedRequestShapes: 0,
  wrongFallbackOrAliasBlocks: [
    "DeltaLw is calculated only for the composite-panel published-interaction family from same-family bare-minus-treated Ln,w",
    "heavy-concrete Annex C, timber/CLT, and lightweight-concrete DeltaLw formulas are not borrowed for composite-panel stacks",
    "existing composite-panel Rw and Ln,w pins remain on the published-interaction basis",
    "exact same-stack official PMC rows remain primary and do not receive source-absent DeltaLw aliases",
    "ASTM IIC and AIIC remain unsupported without ASTM E492/E1007 owners"
  ]
} as const;

export const POST_V1_GATE_CY_VALUE_PINS = {
  basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
  candidateId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID,
  profiles: [
    {
      deltaLw: 14.6,
      lnw: 69.4,
      profile: "dry_floating_floor",
      rw: 45.1
    },
    {
      deltaLw: 20.7,
      lnw: 63.3,
      profile: "suspended_ceiling_only",
      rw: 48.6
    },
    {
      deltaLw: 35.5,
      lnw: 48.5,
      profile: "combined_upper_lower_system",
      rw: 60.6
    }
  ]
} as const;

export type PostV1FloorCompositePanelDeltaLwOwnerGateCYSummary = {
  readonly counters: typeof POST_V1_GATE_CY_COUNTERS;
  readonly landedGate: typeof POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE;
  readonly previousGateCX: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_CY_TARGET_OUTPUTS;
  readonly valuePins: typeof POST_V1_GATE_CY_VALUE_PINS;
};

export function summarizePostV1FloorCompositePanelDeltaLwOwnerGateCY():
  PostV1FloorCompositePanelDeltaLwOwnerGateCYSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE
  ) {
    throw new Error("Gate CY can only land after Gate CX selects the composite-panel DeltaLw owner slice.");
  }

  return {
    counters: POST_V1_GATE_CY_COUNTERS,
    landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE,
    previousGateCX: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS
    },
    selectedNextAction:
      POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_CY_TARGET_OUTPUTS,
    valuePins: POST_V1_GATE_CY_VALUE_PINS
  };
}
