import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS,
  summarizePostV1FloorSuspendedCeilingLowerTreatmentGateBB
} from "./post-v1-floor-suspended-ceiling-lower-treatment-gate-bb";

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE =
  "post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS =
  "post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_landed_selected_coverage_refresh_gate_bd" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION =
  "post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_LABEL =
  "post-V1 floor suspended-ceiling lower-treatment coverage refresh Gate BD" as const;

export const POST_V1_GATE_BC_LAB_IMPACT_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BC_ASTM_ALIAS_OUTPUTS = [
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateBCSurfaceId =
  | "workbench_cards"
  | "markdown_report"
  | "saved_replay"
  | "estimate_api_payload"
  | "impact_only_api_payload"
  | "resolver_trace";

export type PostV1GateBCSurfaceSnapshot = {
  basis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate";
  candidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula";
  deltaLwDb: number;
  id: PostV1GateBCSurfaceId;
  lnWDb: number;
  supportedOutputs: readonly RequestedOutputId[];
};

export type PostV1GateBCSummary = {
  landedGate: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE;
  previousGateBB: {
    landedGate: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE;
    selectedNextAction: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE;
    selectionStatus: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS;
  };
  runtimeMovedAtGateBC: false;
  selectedNextAction: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_LABEL;
  selectionStatus: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS;
  surfaceSnapshots: readonly PostV1GateBCSurfaceSnapshot[];
};

const SURFACE_IDS = [
  "workbench_cards",
  "markdown_report",
  "saved_replay",
  "estimate_api_payload",
  "impact_only_api_payload",
  "resolver_trace"
] as const satisfies readonly PostV1GateBCSurfaceId[];

export function summarizePostV1FloorSuspendedCeilingLowerTreatmentSurfaceParityGateBC():
  PostV1GateBCSummary {
  const gateBB = summarizePostV1FloorSuspendedCeilingLowerTreatmentGateBB();

  if (
    gateBB.selectedNextAction !==
    POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE
  ) {
    throw new Error("Gate BC can only land after Gate BB selects suspended-ceiling lower-treatment surface parity.");
  }

  const acousticHanger = gateBB.runtimeProbeExpectations.find(
    (probe) => probe.id === "visible_acoustic_hanger_combined_upper_lower_formula"
  );
  if (!acousticHanger) {
    throw new Error("Gate BC expected the Gate BB acoustic-hanger runtime probe.");
  }

  return {
    landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE,
    previousGateBB: {
      landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS
    },
    runtimeMovedAtGateBC: false,
    selectedNextAction:
      POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS,
    surfaceSnapshots: SURFACE_IDS.map((id) => ({
      basis: acousticHanger.basis,
      candidateId: acousticHanger.candidateId,
      deltaLwDb: acousticHanger.deltaLwDb,
      id,
      lnWDb: acousticHanger.lnWDb,
      supportedOutputs: acousticHanger.supportedOutputs
    }))
  };
}
