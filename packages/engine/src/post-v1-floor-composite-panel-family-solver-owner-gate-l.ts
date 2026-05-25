import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";

import {
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_LN_W_TOLERANCE_DB,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_REQUIRED_FIELDS,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_RW_TOLERANCE_DB,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID
} from "./composite-panel-published-interaction-runtime-constants";
import {
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS
} from "./post-v1-floor-timber-clt-delta-lw-resolver-gate-k";

export const POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE =
  "post_v1_floor_composite_panel_family_solver_owner_gate_l_plan";

export const POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS =
  "post_v1_floor_composite_panel_family_solver_owner_gate_l_landed_selected_gate_m_lightweight_concrete_family_solver_owner";

export const POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION =
  "post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan";

export const POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts";

export const POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_LABEL =
  "post-V1 floor lightweight-concrete family solver owner Gate M";

export const POST_V1_GATE_L_COMPOSITE_DRY_FLOATING_INPUT = {
  baseSlab: {
    thicknessMm: 65
  },
  floorCovering: {
    densityKgM3: 900,
    materialClass: "dry_floating_gypsum_fiberboard",
    mode: "material_layer",
    thicknessMm: 20
  },
  impactSystemType: "dry_floating_floor",
  resilientLayer: {
    thicknessMm: 12
  },
  structuralSupportType: "composite_panel"
} as const satisfies ImpactPredictorInput;

export const POST_V1_GATE_L_COMPOSITE_SUSPENDED_CEILING_INPUT = {
  baseSlab: {
    materialClass: "composite_steel_deck",
    thicknessMm: 150
  },
  impactSystemType: "suspended_ceiling_only",
  lowerTreatment: {
    boardLayerCount: 2,
    boardThicknessMm: 16,
    cavityDepthMm: 150,
    cavityFillThicknessMm: 100,
    type: "suspended_ceiling_elastic_hanger"
  },
  structuralSupportType: "composite_panel"
} as const satisfies ImpactPredictorInput;

export const POST_V1_GATE_L_COMPOSITE_COMBINED_INPUT = {
  ...POST_V1_GATE_L_COMPOSITE_DRY_FLOATING_INPUT,
  impactSystemType: "combined_upper_lower_system",
  lowerTreatment: POST_V1_GATE_L_COMPOSITE_SUSPENDED_CEILING_INPUT.lowerTreatment
} as const satisfies ImpactPredictorInput;

export type PostV1FloorCompositePanelFamilySolverOwnerGateLContract = {
  readonly blockedMetricsUntilSeparateOwner: readonly ["DeltaLw", "IIC", "AIIC", "L'n,w", "L'nT,w"];
  readonly candidateId: typeof COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID;
  readonly landedGate: typeof POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE;
  readonly numericRuntimeValueMovement: false;
  readonly previousGateK: {
    readonly landedGate: typeof POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS;
  };
  readonly rejectedDefaultMoves: readonly [
    "broad_source_crawl",
    "confidence_wording_pass",
    "docs_only_cleanup",
    "finite_scenario_pack",
    "astm_alias_promotion"
  ];
  readonly requiredPhysicalInputs: typeof COMPOSITE_PANEL_PUBLISHED_INTERACTION_REQUIRED_FIELDS;
  readonly runtimeBasisId: typeof COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS;
  readonly selectedNextAction: typeof POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS;
  readonly sourceRowsAreAnchorsNotProduct: true;
  readonly supportedMetrics: readonly ["Rw", "Ln,w"];
  readonly toleranceDb: {
    readonly "Ln,w": typeof COMPOSITE_PANEL_PUBLISHED_INTERACTION_LN_W_TOLERANCE_DB;
    readonly Rw: typeof COMPOSITE_PANEL_PUBLISHED_INTERACTION_RW_TOLERANCE_DB;
  };
  readonly valuePins: readonly [
    { readonly profile: "dry_floating_floor"; readonly metric: "Ln,w"; readonly value: 69.4 },
    { readonly profile: "dry_floating_floor"; readonly metric: "Rw"; readonly value: 45.1 },
    { readonly profile: "suspended_ceiling_only"; readonly metric: "Ln,w"; readonly value: 63.3 },
    { readonly profile: "suspended_ceiling_only"; readonly metric: "Rw"; readonly value: 48.6 },
    { readonly profile: "combined_upper_lower_system"; readonly metric: "Ln,w"; readonly value: 48.5 },
    { readonly profile: "combined_upper_lower_system"; readonly metric: "Rw"; readonly value: 60.6 }
  ];
  readonly visibleBoundaryPolicy: {
    readonly unsupportedAliases: readonly RequestedOutputId[];
  };
};

export function buildPostV1FloorCompositePanelFamilySolverOwnerGateLContract():
  PostV1FloorCompositePanelFamilySolverOwnerGateLContract {
  return {
    blockedMetricsUntilSeparateOwner: ["DeltaLw", "IIC", "AIIC", "L'n,w", "L'nT,w"],
    candidateId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID,
    landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE,
    numericRuntimeValueMovement: false,
    previousGateK: {
      landedGate: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS
    },
    rejectedDefaultMoves: [
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "astm_alias_promotion"
    ],
    requiredPhysicalInputs: COMPOSITE_PANEL_PUBLISHED_INTERACTION_REQUIRED_FIELDS,
    runtimeBasisId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
    selectedNextAction: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS,
    sourceRowsAreAnchorsNotProduct: true,
    supportedMetrics: ["Rw", "Ln,w"],
    toleranceDb: {
      "Ln,w": COMPOSITE_PANEL_PUBLISHED_INTERACTION_LN_W_TOLERANCE_DB,
      Rw: COMPOSITE_PANEL_PUBLISHED_INTERACTION_RW_TOLERANCE_DB
    },
    valuePins: [
      { profile: "dry_floating_floor", metric: "Ln,w", value: 69.4 },
      { profile: "dry_floating_floor", metric: "Rw", value: 45.1 },
      { profile: "suspended_ceiling_only", metric: "Ln,w", value: 63.3 },
      { profile: "suspended_ceiling_only", metric: "Rw", value: 48.6 },
      { profile: "combined_upper_lower_system", metric: "Ln,w", value: 48.5 },
      { profile: "combined_upper_lower_system", metric: "Rw", value: 60.6 }
    ],
    visibleBoundaryPolicy: {
      unsupportedAliases: ["DeltaLw", "IIC", "AIIC", "L'n,w", "L'nT,w"]
    }
  };
}
