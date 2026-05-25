import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS
} from "./post-v1-floor-reinforced-concrete-combined-resolver-gate-j";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_CLT_DELTA_LW_FORMULA_REQUIRED_FIELDS,
  TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";

export const POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE =
  "post_v1_floor_timber_clt_delta_lw_resolver_gate_k_plan";

export const POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS =
  "post_v1_floor_timber_clt_delta_lw_resolver_gate_k_landed_selected_gate_l_composite_panel_family_solver_owner";

export const POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION =
  "post_v1_floor_composite_panel_family_solver_owner_gate_l_plan";

export const POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts";

export const POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_LABEL =
  "post-V1 floor composite-panel family solver owner Gate L";

export const POST_V1_FLOOR_TIMBER_JOIST_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID =
  "floor.timber_joist.delta_lw_formula";

export const POST_V1_FLOOR_MASS_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID =
  "floor.mass_timber_clt.delta_lw_formula";

export const POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT = {
  baseSlab: {
    materialClass: "timber_joist_floor",
    thicknessMm: 240
  },
  floorCovering: {
    densityKgM3: 1150,
    materialClass: "dry_floating_gypsum_fiberboard",
    mode: "material_layer",
    thicknessMm: 25
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 72,
  lowerTreatment: {
    boardLayerCount: 2,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 27,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 30,
    thicknessMm: 30
  },
  structuralSupportType: "timber_joists"
} as const satisfies ImpactPredictorInput;

export const POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT = {
  baseSlab: {
    densityKgM3: 470,
    materialClass: "clt_panel",
    thicknessMm: 145
  },
  floorCovering: {
    densityKgM3: 1150,
    materialClass: "dry_floating_gypsum_fiberboard",
    mode: "material_layer",
    thicknessMm: 22
  },
  impactSystemType: "dry_floating_floor",
  loadBasisKgM2: 90,
  lowerTreatment: {
    type: "none"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 40,
    thicknessMm: 20
  },
  structuralSupportType: "mass_timber_clt",
  upperFill: {
    densityKgM3: 500,
    materialClass: "dry_granular_fill",
    thicknessMm: 70
  }
} as const satisfies ImpactPredictorInput;

export type PostV1FloorTimberCltDeltaLwResolverGateKContract = {
  readonly candidateIds: readonly [
    typeof POST_V1_FLOOR_TIMBER_JOIST_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID,
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID
  ];
  readonly exactOrPublishedLnWCompanionsRemainSeparate: true;
  readonly landedGate: typeof POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE;
  readonly numericRuntimeValueMovement: false;
  readonly previousGateJ: {
    readonly landedGate: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS;
  };
  readonly rejectedDefaultMoves: readonly [
    "broad_source_crawl",
    "confidence_wording_pass",
    "docs_only_cleanup",
    "finite_scenario_pack",
    "astm_alias_promotion"
  ];
  readonly requiredPhysicalInputs: typeof TIMBER_CLT_DELTA_LW_FORMULA_REQUIRED_FIELDS;
  readonly runtimeBasisIds: readonly [
    typeof TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
    typeof MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
  ];
  readonly selectedNextAction: typeof POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS;
  readonly sourceRowsRequiredForRuntimeSelection: false;
  readonly supportedMetrics: readonly ["DeltaLw"];
  readonly valuePins: readonly [
    { readonly family: "timber_joists"; readonly metric: "DeltaLw"; readonly value: 25.2 },
    { readonly family: "mass_timber_clt"; readonly metric: "DeltaLw"; readonly value: 22.6 }
  ];
  readonly visibleBoundaryPolicy: {
    readonly missingPhysicalInputsBecomeNeedsInput: true;
    readonly unsupportedAliases: readonly RequestedOutputId[];
  };
  readonly toleranceDb: typeof TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB;
};

export function buildPostV1FloorTimberCltDeltaLwResolverGateKContract():
  PostV1FloorTimberCltDeltaLwResolverGateKContract {
  return {
    candidateIds: [
      POST_V1_FLOOR_TIMBER_JOIST_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID,
      POST_V1_FLOOR_MASS_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID
    ],
    exactOrPublishedLnWCompanionsRemainSeparate: true,
    landedGate: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE,
    numericRuntimeValueMovement: false,
    previousGateJ: {
      landedGate: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS
    },
    rejectedDefaultMoves: [
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "astm_alias_promotion"
    ],
    requiredPhysicalInputs: TIMBER_CLT_DELTA_LW_FORMULA_REQUIRED_FIELDS,
    runtimeBasisIds: [
      TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
      MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
    ],
    selectedNextAction: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    supportedMetrics: ["DeltaLw"],
    valuePins: [
      { family: "timber_joists", metric: "DeltaLw", value: 25.2 },
      { family: "mass_timber_clt", metric: "DeltaLw", value: 22.6 }
    ],
    visibleBoundaryPolicy: {
      missingPhysicalInputsBecomeNeedsInput: true,
      unsupportedAliases: ["IIC", "AIIC", "L'n,w", "L'nT,w"]
    },
    toleranceDb: TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB
  };
}
