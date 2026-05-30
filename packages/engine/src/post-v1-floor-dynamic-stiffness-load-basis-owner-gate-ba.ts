import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";

import {
  GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
  GATE_BA_MISSING_LOAD_OWNER_PROBE_INPUT
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ba";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-az";

export const POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE =
  "post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan" as const;

export const POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS =
  "post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_landed_no_runtime_selected_suspended_ceiling_lower_treatment_gate_bb" as const;

export const POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION =
  "post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan" as const;

export const POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts" as const;

export const POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_LABEL =
  "post-V1 floor suspended-ceiling lower-treatment Gate BB" as const;

export const POST_V1_GATE_BA_LAB_IMPACT_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BA_COMPANION_IMPACT_OUTPUTS = [
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_BA_HEAVY_FLOATING_DYNAMIC_LOAD_INPUT = {
  ...GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
  loadBasisKgM2: 100
} as const satisfies ImpactPredictorInput;

export const POST_V1_GATE_BA_HEAVY_FLOATING_MISSING_DYNAMIC_STIFFNESS_INPUT = {
  ...POST_V1_GATE_BA_HEAVY_FLOATING_DYNAMIC_LOAD_INPUT,
  resilientLayer: {
    thicknessMm: 8
  }
} as const satisfies ImpactPredictorInput;

export const POST_V1_GATE_BA_HEAVY_FLOATING_MISSING_LOAD_BASIS_INPUT =
  GATE_BA_MISSING_LOAD_OWNER_PROBE_INPUT;

export type PostV1GateBAPhysicalOwnerField = {
  defaultPolicy: "no_default";
  fieldId: "loadBasisKgM2" | "resilientLayerDynamicStiffnessMNm3";
  missingBehavior: "needs_input";
  ownerId: "floorImpactDynamicStiffnessOrProductCurveOwner" | "floorImpactLoadBasisOwner";
  runtimeDefaultAllowed: false;
};

export type PostV1GateBAProbeId =
  | "heavy_floating_complete_dynamic_load_existing_runtime"
  | "heavy_floating_missing_dynamic_stiffness_needs_input"
  | "heavy_floating_missing_load_basis_published_anchor_only";

export type PostV1GateBARuntimeProbeExpectation = {
  deltaLwDb: number | null;
  id: PostV1GateBAProbeId;
  lnWDb: number | null;
  missingFields: readonly ("loadBasisKgM2" | "resilientLayerDynamicStiffnessMNm3")[];
  supportedOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type PostV1GateBASummary = {
  companionOutputsDeferredToExistingAdapters: readonly RequestedOutputId[];
  landedGate: typeof POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE;
  noRuntimeValueMovement: true;
  physicalOwnerFields: readonly PostV1GateBAPhysicalOwnerField[];
  previousGateAZ: {
    landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE;
    selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE;
    selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS;
  };
  runtimeProbeExpectations: readonly PostV1GateBARuntimeProbeExpectation[];
  selectedNextAction: typeof POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_LABEL;
  selectionStatus: typeof POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS;
  sourceRowsRequiredForSelection: false;
};

const PHYSICAL_OWNER_FIELDS = [
  {
    defaultPolicy: "no_default",
    fieldId: "resilientLayerDynamicStiffnessMNm3",
    missingBehavior: "needs_input",
    ownerId: "floorImpactDynamicStiffnessOrProductCurveOwner",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "loadBasisKgM2",
    missingBehavior: "needs_input",
    ownerId: "floorImpactLoadBasisOwner",
    runtimeDefaultAllowed: false
  }
] as const satisfies readonly PostV1GateBAPhysicalOwnerField[];

const RUNTIME_PROBE_EXPECTATIONS = [
  {
    deltaLwDb: 25.8,
    id: "heavy_floating_complete_dynamic_load_existing_runtime",
    lnWDb: 48.7,
    missingFields: [],
    supportedOutputs: ["Ln,w", "DeltaLw"],
    unsupportedOutputs: []
  },
  {
    deltaLwDb: null,
    id: "heavy_floating_missing_dynamic_stiffness_needs_input",
    lnWDb: 50,
    missingFields: ["resilientLayerDynamicStiffnessMNm3"],
    supportedOutputs: ["Ln,w"],
    unsupportedOutputs: ["DeltaLw"]
  },
  {
    deltaLwDb: null,
    id: "heavy_floating_missing_load_basis_published_anchor_only",
    lnWDb: 47,
    missingFields: ["loadBasisKgM2"],
    supportedOutputs: ["Ln,w"],
    unsupportedOutputs: ["DeltaLw"]
  }
] as const satisfies readonly PostV1GateBARuntimeProbeExpectation[];

export function summarizePostV1FloorDynamicStiffnessLoadBasisOwnerGateBA():
  PostV1GateBASummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE
  ) {
    throw new Error("Gate BA can only land after Gate AZ selects dynamic stiffness/load basis ownership.");
  }

  return {
    companionOutputsDeferredToExistingAdapters: [...POST_V1_GATE_BA_COMPANION_IMPACT_OUTPUTS],
    landedGate: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE,
    noRuntimeValueMovement: true,
    physicalOwnerFields: PHYSICAL_OWNER_FIELDS,
    previousGateAZ: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS
    },
    runtimeProbeExpectations: RUNTIME_PROBE_EXPECTATIONS,
    selectedNextAction: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS,
    sourceRowsRequiredForSelection: false
  };
}
