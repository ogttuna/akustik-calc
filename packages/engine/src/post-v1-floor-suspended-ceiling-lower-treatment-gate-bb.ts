import type { LayerInput, RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE,
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS
} from "./post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba";

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE =
  "post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS =
  "post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_landed_selected_surface_parity_gate_bc" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION =
  "post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc-contract.test.ts" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_LABEL =
  "post-V1 floor suspended-ceiling lower-treatment surface parity Gate BC" as const;

export const POST_V1_GATE_BB_LAB_IMPACT_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BB_ASTM_ALIAS_OUTPUTS = [
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 80 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 120 }
] as const satisfies readonly LayerInput[];

export const POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS =
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS.map((layer) =>
    layer.floorRole === "ceiling_cavity"
      ? {
          ...layer,
          materialId: "resilient_stud_ceiling"
        }
      : layer
  ) as readonly LayerInput[];

export const POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 100,
  resilientLayerDynamicStiffnessMNm3: 30
} as const;

export type PostV1GateBBRuntimeProbeId =
  | "visible_acoustic_hanger_combined_upper_lower_formula"
  | "visible_resilient_stud_combined_upper_lower_formula";

export type PostV1GateBBRuntimeProbeExpectation = {
  basis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate";
  candidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula";
  deltaLwDb: number;
  id: PostV1GateBBRuntimeProbeId;
  lnWDb: number;
  sourceRowsRequiredForCalculation: false;
  supportedOutputs: readonly RequestedOutputId[];
};

export type PostV1GateBBSummary = {
  landedGate: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE;
  previousGateBA: {
    landedGate: typeof POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE;
    selectedNextAction: typeof POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE;
    selectionStatus: typeof POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS;
  };
  runtimeProbeExpectations: readonly PostV1GateBBRuntimeProbeExpectation[];
  selectedNextAction: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_LABEL;
  selectionStatus: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS;
  sourceRowsRequiredForSelection: false;
  valueMovement: "visible_layer_lower_treatment_formula_promotion";
};

const RUNTIME_PROBE_EXPECTATIONS = [
  {
    basis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate",
    candidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
    deltaLwDb: 28.9,
    id: "visible_acoustic_hanger_combined_upper_lower_formula",
    lnWDb: 45.6,
    sourceRowsRequiredForCalculation: false,
    supportedOutputs: ["Ln,w", "DeltaLw"]
  },
  {
    basis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate",
    candidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
    deltaLwDb: 29.9,
    id: "visible_resilient_stud_combined_upper_lower_formula",
    lnWDb: 44.6,
    sourceRowsRequiredForCalculation: false,
    supportedOutputs: ["Ln,w", "DeltaLw"]
  }
] as const satisfies readonly PostV1GateBBRuntimeProbeExpectation[];

export function summarizePostV1FloorSuspendedCeilingLowerTreatmentGateBB():
  PostV1GateBBSummary {
  if (
    POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE
  ) {
    throw new Error("Gate BB can only land after Gate BA selects suspended-ceiling lower-treatment coverage.");
  }

  return {
    landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE,
    previousGateBA: {
      landedGate: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS
    },
    runtimeProbeExpectations: RUNTIME_PROBE_EXPECTATIONS,
    selectedNextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS,
    sourceRowsRequiredForSelection: false,
    valueMovement: "visible_layer_lower_treatment_formula_promotion"
  };
}
