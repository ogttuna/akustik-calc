import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS,
  summarizePostV1GateBENumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-be";

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE =
  "post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS =
  "post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_landed_selected_next_numeric_coverage_gap_gate_bg" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_bg_plan" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate BG" as const;

export const POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BF_LOWER_TREATMENT_MIXED_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  ...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT = {
  ci50_2500Db: 4,
  fieldKDb: 2,
  receivingRoomVolumeM3: 60
} as const satisfies ImpactFieldContext;

export type PostV1GateBFScenarioId =
  | "acoustic_hanger_assembly_field_only"
  | "acoustic_hanger_impact_only_field_only"
  | "resilient_stud_assembly_field_only";

export type PostV1GateBFValuePin = {
  readonly deltaLwDb: number;
  readonly id: PostV1GateBFScenarioId;
  readonly lPrimeNT50Db: number;
  readonly lPrimeNTwDb: number;
  readonly lPrimeNWDb: number;
  readonly lnWDb: number;
  readonly supportedOutputs: readonly RequestedOutputId[];
};

export type PostV1GateBFSummary = {
  readonly fieldContext: typeof POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT;
  readonly landedGate: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE;
  readonly previousGateBE: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS;
  };
  readonly runtimeValueMovement: "assembly_field_only_lower_treatment_field_companion_promotion";
  readonly selectedNextAction: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS;
  readonly sourceRowsRequiredForRuntimeSelection: false;
  readonly valuePins: readonly PostV1GateBFValuePin[];
};

export const POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_VALUE_PINS = [
  {
    deltaLwDb: 28.9,
    id: "acoustic_hanger_assembly_field_only",
    lPrimeNT50Db: 48.8,
    lPrimeNTwDb: 44.8,
    lPrimeNWDb: 47.6,
    lnWDb: 45.6,
    supportedOutputs: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS
  },
  {
    deltaLwDb: 29.9,
    id: "resilient_stud_assembly_field_only",
    lPrimeNT50Db: 47.8,
    lPrimeNTwDb: 43.8,
    lPrimeNWDb: 46.6,
    lnWDb: 44.6,
    supportedOutputs: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS
  },
  {
    deltaLwDb: 28.9,
    id: "acoustic_hanger_impact_only_field_only",
    lPrimeNT50Db: 48.8,
    lPrimeNTwDb: 44.8,
    lPrimeNWDb: 47.6,
    lnWDb: 45.6,
    supportedOutputs: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS
  }
] as const satisfies readonly PostV1GateBFValuePin[];

export function summarizePostV1FloorSuspendedCeilingLowerTreatmentFieldCompanionGateBF():
  PostV1GateBFSummary {
  const gateBE = summarizePostV1GateBENumericCoverageGap();
  if (
    gateBE.selectedNextAction !==
    POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE
  ) {
    throw new Error("Gate BF can only land after Gate BE selects lower-treatment field companion runtime coverage.");
  }

  return {
    fieldContext: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT,
    landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE,
    previousGateBE: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS
    },
    runtimeValueMovement: "assembly_field_only_lower_treatment_field_companion_promotion",
    selectedNextAction:
      POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    valuePins: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_VALUE_PINS
  };
}
