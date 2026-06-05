import type { RequestedOutputId } from "@dynecho/shared";

import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-building-adapter";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cv";

export const POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE =
  "post_v1_wall_local_substitution_building_adapter_gate_cw_plan" as const;

export const POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS =
  "post_v1_wall_local_substitution_building_adapter_gate_cw_landed_runtime_selected_next_numeric_coverage_gap_gate_cx" as const;

export const POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_cx_plan" as const;

export const POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cx-contract.test.ts" as const;

export const POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate CX" as const;

export const POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CW_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 5,
  runtimeCorrectedLayerTemplates: 1,
  runtimeCorrectedRequestShapes: 5,
  wrongFallbackOrAliasBlocks: [
    "only explicit building_prediction context with buildingPredictionOutputBasis, flanking, junction, panel, room, and RT60 inputs is admitted",
    "local-substitution lab Rw/STC/C/Ctr and field R'w/DnT,w remain separate metric-basis owners",
    "missing buildingPredictionOutputBasis, flankingJunctionClass, conservativeFlankingAssumption, room volumes, RT60, panel dimensions, or junctionCouplingLengthM remains needs_input",
    "exact same-stack field/building source rows remain higher precedence than the source-absent local-substitution building adapter",
    "ASTM STC and floor IIC/AIIC aliases are not published from the ISO building adapter"
  ]
} as const;

export const POST_V1_GATE_CW_VALUE_PINS = {
  building: {
    basis: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD,
    candidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID,
    errorBudgetDb: 11,
    metrics: {
      "Dn,A": 52.4,
      "Dn,w": 51,
      "DnT,A": 53.9,
      "DnT,w": 53,
      "R'w": 51
    }
  }
} as const;

export type PostV1WallLocalSubstitutionBuildingAdapterGateCWSummary = {
  readonly counters: typeof POST_V1_GATE_CW_COUNTERS;
  readonly landedGate: typeof POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE;
  readonly previousGateCV: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS;
  readonly valuePins: typeof POST_V1_GATE_CW_VALUE_PINS;
};

export function summarizePostV1WallLocalSubstitutionBuildingAdapterGateCW():
  PostV1WallLocalSubstitutionBuildingAdapterGateCWSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE
  ) {
    throw new Error("Gate CW can only land after Gate CV selects the wall local-substitution building adapter slice.");
  }

  return {
    counters: POST_V1_GATE_CW_COUNTERS,
    landedGate: POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE,
    previousGateCV: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS
    },
    selectedNextAction:
      POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS,
    valuePins: POST_V1_GATE_CW_VALUE_PINS
  };
}
