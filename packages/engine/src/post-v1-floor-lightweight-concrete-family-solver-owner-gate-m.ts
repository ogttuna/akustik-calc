import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";

import {
  LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
  LIGHTWEIGHT_CONCRETE_FAMILY_LN_W_TOLERANCE_DB,
  LIGHTWEIGHT_CONCRETE_FAMILY_REQUIRED_FIELDS,
  LIGHTWEIGHT_CONCRETE_FAMILY_RW_TOLERANCE_DB,
  LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID
} from "./lightweight-concrete-family-runtime-constants";
import {
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE,
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS
} from "./post-v1-floor-composite-panel-family-solver-owner-gate-l";

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE =
  "post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan";

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS =
  "post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_landed_selected_gate_n_floor_field_building_expansion";

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION =
  "post_v1_floor_field_building_expansion_gate_n_plan";

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-field-building-expansion-gate-n-contract.test.ts";

export const POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_LABEL =
  "post-V1 floor field/building expansion Gate N";

export const POST_V1_GATE_M_LOW_DENSITY_REINFORCED_CONCRETE_INPUT = {
  baseSlab: {
    densityKgM3: 1800,
    materialClass: "heavy_concrete",
    thicknessMm: 150
  },
  floatingScreed: {
    densityKgM3: 2000,
    materialClass: "generic_screed",
    thicknessMm: 30
  },
  floorCovering: {
    densityKgM3: 2000,
    materialClass: "ceramic_tile",
    mode: "material_layer",
    thicknessMm: 8
  },
  impactSystemType: "heavy_floating_floor",
  resilientLayer: {
    thicknessMm: 8
  },
  structuralSupportType: "reinforced_concrete"
} as const satisfies ImpactPredictorInput;

export type PostV1FloorLightweightConcreteFamilySolverOwnerGateMContract = {
  readonly blockedMetricsUntilSeparateOwner: readonly ["DeltaLw", "IIC", "AIIC", "L'n,w", "L'nT,w"];
  readonly candidateId: typeof LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID;
  readonly landedGate: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE;
  readonly numericRuntimeValueMovement: false;
  readonly previousGateL: {
    readonly landedGate: typeof POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS;
  };
  readonly rejectedDefaultMoves: readonly [
    "broad_source_crawl",
    "confidence_wording_pass",
    "docs_only_cleanup",
    "finite_scenario_pack",
    "heavy_concrete_formula_borrowing"
  ];
  readonly requiredPhysicalInputs: typeof LIGHTWEIGHT_CONCRETE_FAMILY_REQUIRED_FIELDS;
  readonly runtimeBasisId: typeof LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS;
  readonly selectedNextAction: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS;
  readonly sourceRowsAreAnchorsNotProduct: true;
  readonly supportedMetrics: readonly ["Rw", "Ln,w"];
  readonly toleranceDb: {
    readonly "Ln,w": typeof LIGHTWEIGHT_CONCRETE_FAMILY_LN_W_TOLERANCE_DB;
    readonly Rw: typeof LIGHTWEIGHT_CONCRETE_FAMILY_RW_TOLERANCE_DB;
  };
  readonly valuePins: readonly [
    { readonly profile: "visible_lightweight_floating_floor"; readonly metric: "Ln,w"; readonly value: 64.3 },
    { readonly profile: "visible_lightweight_floating_floor"; readonly metric: "Rw"; readonly value: 53 },
    { readonly profile: "low_density_predictor_input"; readonly metric: "Ln,w"; readonly value: 47 },
    { readonly profile: "low_density_predictor_input"; readonly metric: "Rw"; readonly value: 49 }
  ];
  readonly visibleBoundaryPolicy: {
    readonly unsupportedAliases: readonly RequestedOutputId[];
  };
};

export function buildPostV1FloorLightweightConcreteFamilySolverOwnerGateMContract():
  PostV1FloorLightweightConcreteFamilySolverOwnerGateMContract {
  return {
    blockedMetricsUntilSeparateOwner: ["DeltaLw", "IIC", "AIIC", "L'n,w", "L'nT,w"],
    candidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
    landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE,
    numericRuntimeValueMovement: false,
    previousGateL: {
      landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS
    },
    rejectedDefaultMoves: [
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "heavy_concrete_formula_borrowing"
    ],
    requiredPhysicalInputs: LIGHTWEIGHT_CONCRETE_FAMILY_REQUIRED_FIELDS,
    runtimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
    selectedNextAction: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS,
    sourceRowsAreAnchorsNotProduct: true,
    supportedMetrics: ["Rw", "Ln,w"],
    toleranceDb: {
      "Ln,w": LIGHTWEIGHT_CONCRETE_FAMILY_LN_W_TOLERANCE_DB,
      Rw: LIGHTWEIGHT_CONCRETE_FAMILY_RW_TOLERANCE_DB
    },
    valuePins: [
      { profile: "visible_lightweight_floating_floor", metric: "Ln,w", value: 64.3 },
      { profile: "visible_lightweight_floating_floor", metric: "Rw", value: 53 },
      { profile: "low_density_predictor_input", metric: "Ln,w", value: 47 },
      { profile: "low_density_predictor_input", metric: "Rw", value: 49 }
    ],
    visibleBoundaryPolicy: {
      unsupportedAliases: ["DeltaLw", "IIC", "AIIC", "L'n,w", "L'nT,w"]
    }
  };
}
