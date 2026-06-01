import type { LayerInput, RequestedOutputId } from "@dynecho/shared";

import {
  MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
  MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID
} from "./mixed-support-floor-impact-runtime-corridor";
import {
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS,
  POST_V1_GATE_BI_FIELD_CONTEXT,
  POST_V1_GATE_BI_MIXED_OUTPUTS,
  summarizePostV1FloorMixedSupportFamilyRuntimeCorridorGateBI
} from "./post-v1-floor-mixed-support-family-runtime-corridor-gate-bi";

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_LANDED_GATE =
  "post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTION_STATUS =
  "post_v1_floor_mixed_support_family_surface_parity_gate_bj_landed_no_runtime_selected_next_numeric_coverage_gap_gate_bk" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_bk_plan" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bk-contract.test.ts" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate BK" as const;

export const POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS = [
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: 120 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 80 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

export type PostV1GateBJSurfaceId =
  | "workbench_cards"
  | "markdown_report"
  | "saved_replay"
  | "estimate_api_payload"
  | "impact_only_api_payload"
  | "resolver_trace"
  | "dynamic_impact_trace";

export type PostV1GateBJSurfaceSnapshot = {
  readonly basis: typeof MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS;
  readonly candidateId: typeof MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID;
  readonly deltaLwDb: number;
  readonly id: PostV1GateBJSurfaceId;
  readonly lPrimeNT50Db: number;
  readonly lPrimeNTwDb: number;
  readonly lPrimeNWDb: number;
  readonly lnWDb: number;
  readonly supportedOutputs: readonly RequestedOutputId[];
};

export type PostV1GateBJSummary = {
  readonly fieldContext: typeof POST_V1_GATE_BI_FIELD_CONTEXT;
  readonly landedGate: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_LANDED_GATE;
  readonly previousGateBI: {
    readonly landedGate: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS;
  };
  readonly runtimeMovedAtGateBJ: false;
  readonly selectedNextAction: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTION_STATUS;
  readonly surfaceSnapshots: readonly PostV1GateBJSurfaceSnapshot[];
  readonly visibleLayerReplay: typeof POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS;
};

const SURFACE_IDS = [
  "workbench_cards",
  "markdown_report",
  "saved_replay",
  "estimate_api_payload",
  "impact_only_api_payload",
  "resolver_trace",
  "dynamic_impact_trace"
] as const satisfies readonly PostV1GateBJSurfaceId[];

export function summarizePostV1FloorMixedSupportFamilySurfaceParityGateBJ():
  PostV1GateBJSummary {
  const gateBI = summarizePostV1FloorMixedSupportFamilyRuntimeCorridorGateBI();

  if (
    gateBI.selectedNextAction !==
    POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_LANDED_GATE
  ) {
    throw new Error("Gate BJ can only land after Gate BI selects mixed-support surface parity.");
  }

  const fieldPin = gateBI.valuePins.find((pin) => pin.lPrimeNTwDb === 43.8);
  if (!fieldPin) {
    throw new Error("Gate BJ expected the Gate BI mixed-support lab+field runtime pin.");
  }

  return {
    fieldContext: POST_V1_GATE_BI_FIELD_CONTEXT,
    landedGate: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_LANDED_GATE,
    previousGateBI: {
      landedGate: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS
    },
    runtimeMovedAtGateBJ: false,
    selectedNextAction:
      POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTION_STATUS,
    surfaceSnapshots: SURFACE_IDS.map((id) => ({
      basis: fieldPin.basis,
      candidateId: fieldPin.candidateId,
      deltaLwDb: fieldPin.deltaLwDb,
      id,
      lPrimeNT50Db: fieldPin.lPrimeNT50Db ?? 47.8,
      lPrimeNTwDb: fieldPin.lPrimeNTwDb ?? 43.8,
      lPrimeNWDb: fieldPin.lPrimeNWDb ?? 46.6,
      lnWDb: fieldPin.lnWDb,
      supportedOutputs: POST_V1_GATE_BI_MIXED_OUTPUTS
    })),
    visibleLayerReplay: POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS
  };
}
