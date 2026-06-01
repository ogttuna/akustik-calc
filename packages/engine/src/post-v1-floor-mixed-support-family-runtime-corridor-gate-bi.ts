import type { ImpactFieldContext, ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";

import {
  MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
  MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID
} from "./mixed-support-floor-impact-runtime-corridor";
import {
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS,
  summarizePostV1FloorMixedSupportFamilyOwnerBoundaryGateBH
} from "./post-v1-floor-mixed-support-family-owner-boundary-gate-bh";

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE =
  "post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS =
  "post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_landed_selected_floor_mixed_support_family_surface_parity_gate_bj" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION =
  "post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-mixed-support-family-surface-parity-gate-bj-contract.test.ts" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_LABEL =
  "post-V1 floor mixed-support family surface parity Gate BJ" as const;

export const POST_V1_GATE_BI_LAB_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BI_FIELD_OUTPUTS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BI_MIXED_OUTPUTS = [
  ...POST_V1_GATE_BI_LAB_OUTPUTS,
  ...POST_V1_GATE_BI_FIELD_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BI_FIELD_CONTEXT = {
  ci50_2500Db: 4,
  fieldKDb: 2,
  receivingRoomVolumeM3: 60
} as const satisfies ImpactFieldContext;

export const POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT = {
  baseSlab: {
    densityKgM3: 2400,
    materialClass: "concrete",
    thicknessMm: 150
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 100,
  lowerTreatment: {
    boardLayerCount: 2,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 120,
    cavityFillThicknessMm: 80,
    supportProductId: "acoustic_hanger_ceiling",
    type: "suspended_ceiling_elastic_hanger"
  },
  mixedSupport: {
    dominantImpactTransferFamily: "reinforced_concrete",
    duplicateOwnershipGuard: true,
    mixedSupportRolePartition: "single_primary_carrier_secondary_lower_treatment",
    primaryCarrierFamily: "reinforced_concrete",
    secondarySupportTreatmentOwner: "lower_treatment_only"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 30,
    thicknessMm: 8
  },
  structuralSupportType: "reinforced_concrete"
} as const satisfies ImpactPredictorInput;

export type PostV1GateBIRuntimeValuePin = {
  readonly basis: typeof MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS;
  readonly candidateId: typeof MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID;
  readonly deltaLwDb: number;
  readonly lPrimeNT50Db?: number;
  readonly lPrimeNTwDb?: number;
  readonly lPrimeNWDb?: number;
  readonly lnWDb: number;
  readonly sourceRowsRequiredForCalculation: false;
  readonly supportedOutputs: readonly RequestedOutputId[];
};

export type PostV1GateBISummary = {
  readonly fieldContext: typeof POST_V1_GATE_BI_FIELD_CONTEXT;
  readonly landedGate: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE;
  readonly previousGateBH: {
    readonly landedGate: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS;
  };
  readonly runtimeValueMovement: "single_primary_carrier_mixed_support_lab_and_field_promotion";
  readonly selectedNextAction: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS;
  readonly sourceRowsRequiredForRuntimeSelection: false;
  readonly valuePins: readonly PostV1GateBIRuntimeValuePin[];
};

export const POST_V1_GATE_BI_RUNTIME_VALUE_PINS = [
  {
    basis: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
    candidateId: MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID,
    deltaLwDb: 29.9,
    lnWDb: 44.6,
    sourceRowsRequiredForCalculation: false,
    supportedOutputs: POST_V1_GATE_BI_LAB_OUTPUTS
  },
  {
    basis: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
    candidateId: MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID,
    deltaLwDb: 29.9,
    lPrimeNT50Db: 47.8,
    lPrimeNTwDb: 43.8,
    lPrimeNWDb: 46.6,
    lnWDb: 44.6,
    sourceRowsRequiredForCalculation: false,
    supportedOutputs: POST_V1_GATE_BI_FIELD_OUTPUTS
  }
] as const satisfies readonly PostV1GateBIRuntimeValuePin[];

export function summarizePostV1FloorMixedSupportFamilyRuntimeCorridorGateBI():
  PostV1GateBISummary {
  const gateBH = summarizePostV1FloorMixedSupportFamilyOwnerBoundaryGateBH();
  if (
    gateBH.selectedNextAction !==
    POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE
  ) {
    throw new Error("Gate BI can only land after Gate BH selects mixed-support runtime coverage.");
  }

  return {
    fieldContext: POST_V1_GATE_BI_FIELD_CONTEXT,
    landedGate: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE,
    previousGateBH: {
      landedGate: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS
    },
    runtimeValueMovement: "single_primary_carrier_mixed_support_lab_and_field_promotion",
    selectedNextAction:
      POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    valuePins: POST_V1_GATE_BI_RUNTIME_VALUE_PINS
  };
}
