import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";

import {
  LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
  LIGHTWEIGHT_CONCRETE_FAMILY_REQUIRED_FIELDS,
  LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID
} from "./lightweight-concrete-family-runtime-constants";
import {
  POST_V1_GATE_M_LOW_DENSITY_REINFORCED_CONCRETE_INPUT
} from "./post-v1-floor-lightweight-concrete-family-solver-owner-gate-m";
import {
  POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cz";

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE =
  "post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_plan" as const;

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS =
  "post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_landed_runtime_boundary_selected_delta_lw_runtime_corridor_gate_db" as const;

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION =
  "post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan" as const;

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db-contract.test.ts" as const;

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_LABEL =
  "post-V1 floor lightweight-concrete DeltaLw runtime corridor Gate DB" as const;

export const POST_V1_GATE_DA_LIGHTWEIGHT_DELTA_LW_CONTRACT_CANDIDATE_ID =
  "floor.lightweight_concrete.delta_lw_family_owner_contract" as const;

export const POST_V1_GATE_DA_TARGET_OUTPUTS = [
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DA_LOW_DENSITY_COMPLETE_DYNAMIC_INPUT = {
  ...POST_V1_GATE_M_LOW_DENSITY_REINFORCED_CONCRETE_INPUT,
  loadBasisKgM2: 70,
  resilientLayer: {
    ...POST_V1_GATE_M_LOW_DENSITY_REINFORCED_CONCRETE_INPUT.resilientLayer,
    dynamicStiffnessMNm3: 25
  }
} as const satisfies ImpactPredictorInput;

export type PostV1GateDALightweightDeltaLwOwnerField = {
  defaultPolicy: "no_default";
  fieldId:
    | "baseSlabThicknessMm"
    | "baseSlabDensityKgM3_or_lightweightConcreteMaterialClass"
    | "elementLabMetricBasis"
    | "floorCoveringOrWalkingSurface"
    | "loadBasisKgM2"
    | "resilientLayerDynamicStiffnessMNm3_or_productCurve"
    | "resilientLayerOrToppingState"
    | "upperTreatmentState";
  missingBehavior: "needs_input";
  runtimeDefaultAllowed: false;
};

export type PostV1GateDALightweightDeltaLwRuntimeBoundaryProbe = {
  deltaLwDb: number | null;
  id:
    | "visible_lightweight_complete_dynamic_context_still_blocks_delta_lw"
    | "low_density_predictor_complete_dynamic_context_not_heavy_concrete"
    | "missing_dynamic_or_load_still_blocks_delta_lw";
  lnWDb: number | null;
  rwDb: number | null;
  supportedOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type PostV1GateDALightweightDeltaLwOwnerContractSummary = {
  readonly candidateId: typeof POST_V1_GATE_DA_LIGHTWEIGHT_DELTA_LW_CONTRACT_CANDIDATE_ID;
  readonly existingFamilyCandidateId: typeof LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID;
  readonly existingFamilyRuntimeBasisId: typeof LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS;
  readonly forbiddenFormulaBorrowing: readonly [
    "heavy_concrete_annex_c_delta_lw",
    "composite_panel_bare_minus_treated_delta_lw",
    "timber_clt_delta_lw",
    "steel_mass_spring_delta_lw"
  ];
  readonly landedGate: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE;
  readonly noNewCalculableRuntimeValues: true;
  readonly physicalOwnerFields: readonly PostV1GateDALightweightDeltaLwOwnerField[];
  readonly previousGateCZ: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS;
  };
  readonly runtimeBoundaryCorrections: {
    readonly falseHeavyConcreteDeltaLwPublicationsPrevented: 1;
    readonly newCalculableLayerTemplates: 0;
    readonly newCalculableRequestShapes: 0;
    readonly runtimeCorrectedRequestShapes: 1;
  };
  readonly runtimeProbeExpectations: readonly PostV1GateDALightweightDeltaLwRuntimeBoundaryProbe[];
  readonly selectedNextAction: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS;
  readonly sourceRowsAreAnchorsNotProduct: true;
  readonly targetOutputs: typeof POST_V1_GATE_DA_TARGET_OUTPUTS;
};

const PHYSICAL_OWNER_FIELDS = [
  {
    defaultPolicy: "no_default",
    fieldId: "baseSlabThicknessMm",
    missingBehavior: "needs_input",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "baseSlabDensityKgM3_or_lightweightConcreteMaterialClass",
    missingBehavior: "needs_input",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "upperTreatmentState",
    missingBehavior: "needs_input",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "floorCoveringOrWalkingSurface",
    missingBehavior: "needs_input",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "resilientLayerOrToppingState",
    missingBehavior: "needs_input",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "resilientLayerDynamicStiffnessMNm3_or_productCurve",
    missingBehavior: "needs_input",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "loadBasisKgM2",
    missingBehavior: "needs_input",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "elementLabMetricBasis",
    missingBehavior: "needs_input",
    runtimeDefaultAllowed: false
  }
] as const satisfies readonly PostV1GateDALightweightDeltaLwOwnerField[];

const RUNTIME_PROBE_EXPECTATIONS = [
  {
    deltaLwDb: null,
    id: "visible_lightweight_complete_dynamic_context_still_blocks_delta_lw",
    lnWDb: 64.3,
    rwDb: 53,
    supportedOutputs: ["Rw", "Ln,w"],
    unsupportedOutputs: ["DeltaLw"]
  },
  {
    deltaLwDb: null,
    id: "low_density_predictor_complete_dynamic_context_not_heavy_concrete",
    lnWDb: 64.3,
    rwDb: 53,
    supportedOutputs: ["Ln,w", "Rw"],
    unsupportedOutputs: ["DeltaLw"]
  },
  {
    deltaLwDb: null,
    id: "missing_dynamic_or_load_still_blocks_delta_lw",
    lnWDb: 64.3,
    rwDb: 53,
    supportedOutputs: ["Rw", "Ln,w"],
    unsupportedOutputs: ["DeltaLw"]
  }
] as const satisfies readonly PostV1GateDALightweightDeltaLwRuntimeBoundaryProbe[];

export function summarizePostV1FloorLightweightConcreteDeltaLwOwnerContractGateDA():
  PostV1GateDALightweightDeltaLwOwnerContractSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE
  ) {
    throw new Error("Gate DA can only land after Gate CZ selects the lightweight-concrete DeltaLw owner contract.");
  }

  return {
    candidateId: POST_V1_GATE_DA_LIGHTWEIGHT_DELTA_LW_CONTRACT_CANDIDATE_ID,
    existingFamilyCandidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
    existingFamilyRuntimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
    forbiddenFormulaBorrowing: [
      "heavy_concrete_annex_c_delta_lw",
      "composite_panel_bare_minus_treated_delta_lw",
      "timber_clt_delta_lw",
      "steel_mass_spring_delta_lw"
    ],
    landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE,
    noNewCalculableRuntimeValues: true,
    physicalOwnerFields: PHYSICAL_OWNER_FIELDS,
    previousGateCZ: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE,
      selectedCandidateId: POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS
    },
    runtimeBoundaryCorrections: {
      falseHeavyConcreteDeltaLwPublicationsPrevented: 1,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeCorrectedRequestShapes: 1
    },
    runtimeProbeExpectations: RUNTIME_PROBE_EXPECTATIONS,
    selectedNextAction: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS,
    sourceRowsAreAnchorsNotProduct: true,
    targetOutputs: POST_V1_GATE_DA_TARGET_OUTPUTS
  };
}

export const POST_V1_GATE_DA_REUSED_LIGHTWEIGHT_FAMILY_REQUIRED_FIELDS =
  LIGHTWEIGHT_CONCRETE_FAMILY_REQUIRED_FIELDS;
