import type { RequestedOutputId } from "@dynecho/shared";

import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_REQUIRED_FIELDS
} from "./heavy-concrete-combined-impact-formula-corridor";
import {
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE,
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS
} from "./post-v1-floor-formula-gap-refresh-gate-i";

export const POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE =
  "post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan";

export const POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS =
  "post_v1_floor_reinforced_concrete_combined_resolver_gate_j_landed_selected_gate_k_timber_clt_delta_lw_resolver";

export const POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION =
  "post_v1_floor_timber_clt_delta_lw_resolver_gate_k_plan";

export const POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-timber-clt-delta-lw-resolver-gate-k-contract.test.ts";

export const POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_LABEL =
  "post-V1 floor timber/CLT DeltaLw resolver Gate K";

export const POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_CANDIDATE_ID =
  "floor.heavy_concrete_combined_upper_lower.lab_impact_formula";

export type PostV1FloorReinforcedConcreteCombinedResolverGateJContract = {
  readonly candidateId: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_CANDIDATE_ID;
  readonly exactSourceRowsRemainFirst: true;
  readonly landedGate: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE;
  readonly numericRuntimeValueMovement: false;
  readonly previousGateI: {
    readonly landedGate: typeof POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS;
  };
  readonly rejectedDefaultMoves: readonly [
    "broad_source_crawl",
    "confidence_wording_pass",
    "docs_only_cleanup",
    "finite_scenario_pack",
    "astm_alias_promotion"
  ];
  readonly requiredPhysicalInputs: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_REQUIRED_FIELDS;
  readonly runtimeBasisId: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;
  readonly selectedNextAction: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS;
  readonly sourceRowsRequiredForRuntimeSelection: false;
  readonly supportedMetrics: readonly ["Ln,w", "DeltaLw"];
  readonly valuePins: readonly [
    { readonly metric: "Ln,w"; readonly value: 58.1 },
    { readonly metric: "DeltaLw"; readonly value: 13.7 }
  ];
  readonly visibleBoundaryPolicy: {
    readonly missingPhysicalInputsBecomeNeedsInput: true;
    readonly unsupportedAliases: readonly RequestedOutputId[];
  };
  readonly toleranceDb: Readonly<Record<"DeltaLw" | "Ln,w", number>>;
};

export function buildPostV1FloorReinforcedConcreteCombinedResolverGateJContract():
  PostV1FloorReinforcedConcreteCombinedResolverGateJContract {
  return {
    candidateId: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_CANDIDATE_ID,
    exactSourceRowsRemainFirst: true,
    landedGate: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE,
    numericRuntimeValueMovement: false,
    previousGateI: {
      landedGate: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS
    },
    rejectedDefaultMoves: [
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "astm_alias_promotion"
    ],
    requiredPhysicalInputs: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_REQUIRED_FIELDS,
    runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    selectedNextAction: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    supportedMetrics: ["Ln,w", "DeltaLw"],
    valuePins: [
      { metric: "Ln,w", value: 58.1 },
      { metric: "DeltaLw", value: 13.7 }
    ],
    visibleBoundaryPolicy: {
      missingPhysicalInputsBecomeNeedsInput: true,
      unsupportedAliases: ["IIC", "AIIC"]
    },
    toleranceDb: {
      "DeltaLw": HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
      "Ln,w": HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
    }
  };
}
