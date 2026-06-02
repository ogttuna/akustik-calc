import type { RequestedOutputId } from "@dynecho/shared";

import { HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS } from "./heavy-concrete-combined-impact-formula-corridor";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";

export const POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE =
  "post_v1_floor_formula_gap_refresh_gate_i_plan";

export const POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS =
  "post_v1_floor_formula_gap_refresh_gate_i_landed_no_runtime_selected_gate_j_reinforced_concrete_combined_resolver";

export const POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION =
  "post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan";

export const POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts";

export const POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_LABEL =
  "post-V1 floor reinforced-concrete combined resolver Gate J";

const GATE_H_ACTION = "post_v1_floor_formula_expansion_gate_h_plan";
const GATE_H_SELECTION_STATUS =
  "post_v1_floor_formula_expansion_gate_h_landed_selected_gate_i_floor_formula_gap_refresh";

export type PostV1FloorFormulaGapRefreshGateICandidateId =
  | "broad_floor_source_crawl"
  | "composite_panel_family_solver_owner"
  | "floor_field_building_expansion"
  | "lightweight_concrete_family_solver_owner"
  | "reinforced_concrete_combined_upper_lower_resolver_import"
  | "timber_clt_delta_lw_resolver_import";

export type PostV1FloorFormulaGapRefreshGateICandidate = {
  readonly basis: "element_lab" | "field_apparent" | "mixed" | "source_collection";
  readonly broadSourceCrawl: boolean;
  readonly directCalculationCapacityGain: boolean;
  readonly expectedValuePins: readonly { metric: RequestedOutputId; value: number }[];
  readonly id: PostV1FloorFormulaGapRefreshGateICandidateId;
  readonly ownedMetrics: readonly RequestedOutputId[];
  readonly reason: string;
  readonly runtimeBasisId: string | null;
  readonly score: number;
  readonly selected: boolean;
  readonly sourceRowsRequiredForSelection: boolean;
};

export type PostV1FloorFormulaGapRefreshGateIContract = {
  readonly landedGate: typeof POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGateH: {
    readonly landedGate: typeof GATE_H_ACTION;
    readonly selectedNextAction: typeof POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE;
    readonly selectedNextFile: "packages/engine/src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts";
    readonly selectionStatus: typeof GATE_H_SELECTION_STATUS;
    readonly steelRuntimeBasisIds: readonly [
      typeof STEEL_FLOOR_FORMULA_BASIS,
      typeof STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
    ];
  };
  readonly rankedCandidates: readonly PostV1FloorFormulaGapRefreshGateICandidate[];
  readonly rejectedDefaultMoves: readonly [
    "broad_source_crawl",
    "confidence_wording_pass",
    "docs_only_cleanup",
    "finite_scenario_pack",
    "tolerance_retune_without_holdouts"
  ];
  readonly selectedNextAction: typeof POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS;
  readonly sourceRowsRequiredForRuntimeSelection: false;
};

const RANKED_CANDIDATES = [
  {
    basis: "element_lab",
    broadSourceCrawl: false,
    directCalculationCapacityGain: true,
    expectedValuePins: [
      { metric: "Ln,w", value: 58.1 },
      { metric: "DeltaLw", value: 13.7 }
    ],
    id: "reinforced_concrete_combined_upper_lower_resolver_import",
    ownedMetrics: ["Ln,w", "DeltaLw"],
    reason:
      "The reinforced-concrete combined upper/lower formula already calculates source-absent ISO lab impact values, but it is not yet a shared resolver candidate; importing it gives a common floor route owned answer-engine trace without source crawling.",
    runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    score: 4.8,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    basis: "element_lab",
    broadSourceCrawl: false,
    directCalculationCapacityGain: true,
    expectedValuePins: [
      { metric: "DeltaLw", value: 25.2 }
    ],
    id: "timber_clt_delta_lw_resolver_import",
    ownedMetrics: ["DeltaLw"],
    reason:
      "Timber and CLT DeltaLw corridors are useful, but their mixed exact/published Ln,w companions make them the next resolver import after the cleaner reinforced-concrete combined route.",
    runtimeBasisId: "timber_clt_delta_lw_formula_corridors",
    score: 4.1,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    basis: "element_lab",
    broadSourceCrawl: false,
    directCalculationCapacityGain: true,
    expectedValuePins: [],
    id: "composite_panel_family_solver_owner",
    ownedMetrics: ["Ln,w", "DeltaLw"],
    reason:
      "Composite-panel dry-floating interaction still needs a family-specific owner before it should outrank the already-running reinforced-concrete combined formula import.",
    runtimeBasisId: "predictor_composite_panel_published_interaction_estimate",
    score: 3.2,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    basis: "element_lab",
    broadSourceCrawl: false,
    directCalculationCapacityGain: true,
    expectedValuePins: [],
    id: "lightweight_concrete_family_solver_owner",
    ownedMetrics: ["Ln,w", "DeltaLw"],
    reason:
      "Lightweight concrete remains valuable, but it needs a separate family owner and should not borrow heavy-concrete coefficients before the ready combined route is surfaced.",
    runtimeBasisId: null,
    score: 2.9,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    basis: "field_apparent",
    broadSourceCrawl: false,
    directCalculationCapacityGain: true,
    expectedValuePins: [],
    id: "floor_field_building_expansion",
    ownedMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
    reason:
      "Field and building impact expansion matters, but it is a separate basis/context owner and should not interrupt the element-lab formula coverage refresh.",
    runtimeBasisId: "source_absent_field_building_adapter_error_budget",
    score: 2.4,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    basis: "source_collection",
    broadSourceCrawl: true,
    directCalculationCapacityGain: false,
    expectedValuePins: [],
    id: "broad_floor_source_crawl",
    ownedMetrics: [],
    reason:
      "More measured rows can help later as exact overrides or holdouts, but they do not make unbounded source-absent floor combinations calculate.",
    runtimeBasisId: null,
    score: 0.2,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PostV1FloorFormulaGapRefreshGateICandidate[];

export function buildPostV1FloorFormulaGapRefreshGateIContract():
  PostV1FloorFormulaGapRefreshGateIContract {
  return {
    landedGate: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateH: {
      landedGate: GATE_H_ACTION,
      selectedNextAction: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE,
      selectedNextFile: "packages/engine/src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts",
      selectionStatus: GATE_H_SELECTION_STATUS,
      steelRuntimeBasisIds: [STEEL_FLOOR_FORMULA_BASIS, STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS]
    },
    rankedCandidates: RANKED_CANDIDATES,
    rejectedDefaultMoves: [
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "tolerance_retune_without_holdouts"
    ],
    selectedNextAction: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
