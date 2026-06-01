import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS,
  summarizePostV1GateBNNumericPlausibilityAndCalibration
} from "./post-v1-next-numeric-coverage-gap-gate-bn";

export const POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_LANDED_GATE =
  "post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan" as const;

export const POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTION_STATUS =
  "post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_landed_runtime_selected_next_numeric_coverage_gap_gate_bp" as const;

export const POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_bp_plan" as const;

export const POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bp-contract.test.ts" as const;

export const POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate BP" as const;

export const POST_V1_GATE_BO_BUILDING_IMPACT_OUTPUTS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BO_BLOCKED_OUTPUTS = [
  "R'w",
  "DnT,w",
  "Ln,w",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BO_DIRECT_FLANKING_IMPACT_CONTEXT = {
  directPathOffsetDb: 1,
  flankingPaths: [
    {
      id: "gate_bo_rigid_edge_path",
      label: "Characterized open-box edge path",
      levelOffsetDb: -6,
      pathCount: 1
    }
  ],
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

export const POST_V1_GATE_BO_RAW_OPEN_BOX_220 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
] as const satisfies readonly LayerInput[];

export const POST_V1_GATE_BO_RAW_OPEN_BOX_370 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

export type PostV1GateBOBuildingPredictionPin = {
  readonly basis: typeof OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS;
  readonly carrier: "open_box_raw_bare_220" | "open_box_raw_bare_370";
  readonly ci50_2500Db: number;
  readonly directPathOffsetDb: number;
  readonly flankingPathLevelOffsetDb: number;
  readonly lPrimeNT50Db: number;
  readonly lPrimeNTwDb: number;
  readonly lPrimeNWDb: number;
  readonly lnWDb: number;
  readonly receivingRoomVolumeM3: number;
  readonly sourceAbsentSingleNumberUpliftDb: number;
  readonly supportedOutputs: readonly RequestedOutputId[];
};

export type PostV1GateBOSummary = {
  readonly blockedOutputs: typeof POST_V1_GATE_BO_BLOCKED_OUTPUTS;
  readonly directFlankingOwnerContext: typeof POST_V1_GATE_BO_DIRECT_FLANKING_IMPACT_CONTEXT;
  readonly landedGate: typeof POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_LANDED_GATE;
  readonly previousGateBN: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS;
  };
  readonly runtimeValueMovement: "open_box_raw_bare_building_direct_flanking_impact_promotion";
  readonly selectedCandidateId: "floor.open_box_timber_raw_bare.building_prediction_owner_gap";
  readonly selectedNextAction: typeof POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTION_STATUS;
  readonly valuePins: readonly PostV1GateBOBuildingPredictionPin[];
};

export const POST_V1_GATE_BO_BUILDING_PREDICTION_VALUE_PINS = [
  {
    basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    carrier: "open_box_raw_bare_220",
    ci50_2500Db: 3.4,
    directPathOffsetDb: 1,
    flankingPathLevelOffsetDb: -6,
    lPrimeNT50Db: 93.9,
    lPrimeNTwDb: 90.5,
    lPrimeNWDb: 92.9,
    lnWDb: 91.1,
    receivingRoomVolumeM3: 55,
    sourceAbsentSingleNumberUpliftDb: 1.8,
    supportedOutputs: POST_V1_GATE_BO_BUILDING_IMPACT_OUTPUTS
  },
  {
    basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    carrier: "open_box_raw_bare_370",
    ci50_2500Db: 3.1,
    directPathOffsetDb: 1,
    flankingPathLevelOffsetDb: -6,
    lPrimeNT50Db: 90.7,
    lPrimeNTwDb: 87.6,
    lPrimeNWDb: 90,
    lnWDb: 88.2,
    receivingRoomVolumeM3: 55,
    sourceAbsentSingleNumberUpliftDb: 1.8,
    supportedOutputs: POST_V1_GATE_BO_BUILDING_IMPACT_OUTPUTS
  }
] as const satisfies readonly PostV1GateBOBuildingPredictionPin[];

export function summarizePostV1FloorOpenBoxRawBareBuildingPredictionOwnerGateBO():
  PostV1GateBOSummary {
  const gateBN = summarizePostV1GateBNNumericPlausibilityAndCalibration();

  if (
    gateBN.selectedNextAction !==
    POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_LANDED_GATE
  ) {
    throw new Error("Gate BO can only land after Gate BN selects open-box raw-bare building prediction.");
  }

  return {
    blockedOutputs: POST_V1_GATE_BO_BLOCKED_OUTPUTS,
    directFlankingOwnerContext: POST_V1_GATE_BO_DIRECT_FLANKING_IMPACT_CONTEXT,
    landedGate: POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_LANDED_GATE,
    previousGateBN: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS
    },
    runtimeValueMovement: "open_box_raw_bare_building_direct_flanking_impact_promotion",
    selectedCandidateId: "floor.open_box_timber_raw_bare.building_prediction_owner_gap",
    selectedNextAction:
      POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTION_STATUS,
    valuePins: POST_V1_GATE_BO_BUILDING_PREDICTION_VALUE_PINS
  };
}
