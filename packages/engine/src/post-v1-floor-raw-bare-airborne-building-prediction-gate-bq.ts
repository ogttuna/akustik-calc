import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import {
  FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_OUTPUTS,
  FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
  FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./floor-raw-bare-airborne-building-prediction-runtime";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS,
  summarizePostV1GateBPNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-bp";

export const POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE =
  "post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan" as const;

export const POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS =
  "post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_landed_runtime_selected_next_numeric_coverage_gap_gate_br" as const;

export const POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_br_plan" as const;

export const POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-br-contract.test.ts" as const;

export const POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate BR" as const;

export const POST_V1_GATE_BQ_BUILDING_AIRBORNE_OUTPUTS =
  FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_OUTPUTS;

export const POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
} as const satisfies AirborneContext;

export const POST_V1_GATE_BQ_RAW_OPEN_BOX_220 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
] as const satisfies readonly LayerInput[];

export const POST_V1_GATE_BQ_RAW_OPEN_BOX_370 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

export const POST_V1_GATE_BQ_RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

export type PostV1GateBQCarrierId =
  | "open_box_raw_bare_220"
  | "open_box_raw_bare_370"
  | "open_web_raw_bare_300";

export type PostV1GateBQAirborneBuildingPin = {
  readonly basis: typeof FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS;
  readonly carrier: PostV1GateBQCarrierId;
  readonly directRwDb: number;
  readonly dnADb: number;
  readonly dnTADb: number;
  readonly dnTwDb: number;
  readonly dnWDb: number;
  readonly previousGenericScreeningRwPrimeDb: number;
  readonly rawBareDirectBasis: typeof OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS | typeof OPEN_WEB_RAW_BARE_FORMULA_BASIS;
  readonly rwPrimeDb: number;
  readonly supportedOutputs: readonly RequestedOutputId[];
};

export type PostV1GateBQSummary = {
  readonly buildingContext: typeof POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT;
  readonly landedGate: typeof POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE;
  readonly previousGateBP: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS;
  };
  readonly runtimeValueMovement: "raw_bare_floor_airborne_building_prediction_promotion";
  readonly selectedCandidateId: "floor.raw_bare_floor_airborne_building_prediction_owner_gap";
  readonly selectedNextAction: typeof POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS;
  readonly traceCandidateId: typeof FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID;
  readonly valuePins: readonly PostV1GateBQAirborneBuildingPin[];
};

export const POST_V1_GATE_BQ_AIRBORNE_BUILDING_VALUE_PINS = [
  {
    basis: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
    carrier: "open_box_raw_bare_220",
    directRwDb: 38.1,
    dnADb: 35,
    dnTADb: 37.4,
    dnTwDb: 39,
    dnWDb: 36,
    previousGenericScreeningRwPrimeDb: 46,
    rawBareDirectBasis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    rwPrimeDb: 36,
    supportedOutputs: POST_V1_GATE_BQ_BUILDING_AIRBORNE_OUTPUTS
  },
  {
    basis: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
    carrier: "open_box_raw_bare_370",
    directRwDb: 42.3,
    dnADb: 39.8,
    dnTADb: 42.2,
    dnTwDb: 43,
    dnWDb: 41,
    previousGenericScreeningRwPrimeDb: 50,
    rawBareDirectBasis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    rwPrimeDb: 40,
    supportedOutputs: POST_V1_GATE_BQ_BUILDING_AIRBORNE_OUTPUTS
  },
  {
    basis: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
    carrier: "open_web_raw_bare_300",
    directRwDb: 32,
    dnADb: 28.9,
    dnTADb: 31.3,
    dnTwDb: 32,
    dnWDb: 30,
    previousGenericScreeningRwPrimeDb: 77,
    rawBareDirectBasis: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    rwPrimeDb: 30,
    supportedOutputs: POST_V1_GATE_BQ_BUILDING_AIRBORNE_OUTPUTS
  }
] as const satisfies readonly PostV1GateBQAirborneBuildingPin[];

export function summarizePostV1FloorRawBareAirborneBuildingPredictionGateBQ():
  PostV1GateBQSummary {
  const gateBP = summarizePostV1GateBPNumericCoverageGap();
  if (
    gateBP.selectedNextAction !==
    POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE
  ) {
    throw new Error("Gate BQ can only land after Gate BP selects raw-bare floor airborne building prediction.");
  }

  return {
    buildingContext: POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT,
    landedGate: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE,
    previousGateBP: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS
    },
    runtimeValueMovement: "raw_bare_floor_airborne_building_prediction_promotion",
    selectedCandidateId: "floor.raw_bare_floor_airborne_building_prediction_owner_gap",
    selectedNextAction:
      POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS,
    traceCandidateId: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    valuePins: POST_V1_GATE_BQ_AIRBORNE_BUILDING_VALUE_PINS
  };
}
