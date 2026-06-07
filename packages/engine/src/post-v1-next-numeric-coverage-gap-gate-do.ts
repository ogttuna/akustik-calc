import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS
} from "./post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_do_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_do_landed_no_runtime_selected_wall_clt_laminated_leaf_runtime_basis_gate_dp" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION =
  "post_v1_wall_clt_laminated_leaf_runtime_basis_gate_dp_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_LABEL =
  "post-V1 wall CLT laminated-leaf runtime-basis Gate DP" as const;

export const POST_V1_GATE_DO_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DO_SELECTED_CANDIDATE_ID =
  "wall.clt_laminated_leaf_runtime_basis_gap" as const;

export const POST_V1_GATE_DO_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DO_NO_RUNTIME_COUNTERS = {
  candidateCount: 11,
  estimatedNextNewCalculableLayerTemplates: 0,
  estimatedNextNewCalculableRequestShapes: 0,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeCorrectedLayerTemplates: 1,
  estimatedNextRuntimeCorrectedRequestShapes: 8,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  selectedAlreadyCalculableRequestShapes: 8,
  selectedCurrentScreeningFallbackRequestShapes: 8,
  selectedFieldAdapterRequired: true,
  wrongAliasOrFallbackBlocks: [
    "Gate DP must reuse the existing Gate H CLT / mass-timber wall family physics owner instead of inventing a new formula",
    "generated CLT + gypsum laminated single-leaf wall stacks already calculate values, but current screening_fallback basis is the accuracy gap",
    "Dataholz CLT floor-system rows and WoodWorks/NRC STC/FSTC/ASTC context must not become wall Rw or field metric truth",
    "lab Rw/STC/C/Ctr and field R'w/Dn,w/DnT,w/DnT,A must remain separated by the Gate I field adapter",
    "ordinary gypsum laminated leaves, NLT/timber boards, double-leaf CLT, timber-stud, LSF, lined massive, and grouped multicavity routes stay outside this CLT repair",
    "Gate DO does not move runtime values and does not touch frontend implementation"
  ]
} as const;

export type PostV1GateDOCandidateId =
  | typeof POST_V1_GATE_DO_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.steel_visible_formula_input_surface_parity_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.clt_laminated_leaf_bounded_rule_owner_gap"
  | "wall.heavy_core_lined_massive_direct_retune"
  | "wall.held_aac_board_fill_gap_multicavity_gap"
  | "wall.timber_stud_formula_bounded_rule_owner_gap";

export type PostV1GateDOSliceKind =
  | "accuracy_holdout_intake"
  | "accuracy_owner_contract"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_without_source_or_rule"
  | "closed_runtime_gap"
  | "metric_basis_input_surface"
  | "runtime_basis_accuracy_repair";

export type PostV1GateDOCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDOCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeBasis: boolean;
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDOSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateDOSummary = {
  readonly candidates: readonly PostV1GateDOCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DO_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DO_PLAN_DOC_PATH;
  readonly previousGateDN: {
    readonly landedGate: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DO_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS;
};

export function rankPostV1GateDONumericCoverageCandidates(): readonly PostV1GateDOCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "generated wall-clt-local lab and field requests already calculate finite values",
        "the selected basis is still screening_fallback / candidate_multileaf_screening_fallback because Gate H CLT currently accepts only single_leaf_panel mass-timber stacks",
        "Gate DP can route the safe laminated CLT + gypsum single-leaf stack to the existing Gate H CLT family physics owner without changing numeric pins"
      ],
      id: POST_V1_GATE_DO_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-airborne-gate-h-lined-masonry-clt.ts",
        "packages/engine/src/dynamic-airborne.ts",
        "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts",
        "packages/engine/src/wall-clt-gate-b-source-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: true,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DN: timber-stud bounded routing is closed, while the common CLT + gypsum wall stack still reports a generic screening basis even though the CLT family physics owner already exists. This improves formula selection accuracy for a realistic layer-entered wall without source crawling or numeric retune.",
      score: 3.72,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE,
      sliceKind: "runtime_basis_accuracy_repair",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DO_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "a bounded laminated-leaf owner may be useful later",
        "the existing Gate H CLT family physics owner already names the immediate missing route",
        "an extra owner-contract gate would delay the lower-risk runtime-basis repair"
      ],
      id: "wall.clt_laminated_leaf_bounded_rule_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/wall-clt-gate-b-source-contract.test.ts",
        "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid later, but lower ROI than directly connecting the safe generated CLT stack to the already implemented Gate H CLT owner.",
      score: 2.48,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_owner_contract",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DO_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "Gate DM defined the timber-stud bounded owner",
        "Gate DN promoted the live timber-stud runtime basis to bounded_prediction",
        "the timber-stud basis gap must not be selected again"
      ],
      id: "wall.timber_stud_formula_bounded_rule_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-timber-stud-bounded-rule-gate-dm-contract.test.ts",
        "packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate DM and Gate DN.",
      score: 0.74,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DO_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate DG already promoted the lined-massive route to a bounded runtime basis",
        "direct numeric retune still lacks a same-stack wall source row or explicit coefficient rule",
        "moving values now would weaken the bounded-rule boundary"
      ],
      id: "wall.heavy_core_lined_massive_direct_retune",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Accuracy-relevant but blocked until a source row or coefficient rule authorizes numeric movement.",
      score: 1.18,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_source_or_rule",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["Rw", "R'w", "DnT,w"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "explicit wall-held AAC/multicavity support-backed requests already calculate through existing family routes",
        "supportless flat entries correctly stop with needs_input",
        "selecting it now would count missing physical input as scope"
      ],
      id: "wall.held_aac_board_fill_gap_multicavity_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dj-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable when route-required supportTopology is supplied.",
      score: 0.86,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DO_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "exact ASTM E492/E1007 one-third-octave input already calculates IIC/AIIC through the ASTM owner",
        "ISO impact routes must still not alias to ASTM IIC/AIIC",
        "remaining work here is input surface breadth, not the highest engine-only formula-routing repair"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Important later, but current engine owner already calculates exact ASTM bands.",
      score: 2.1,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_input_surface",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: true
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "opening/leak ledgers exist",
        "same-family calibration rows and holdouts remain insufficient for budget tightening",
        "selecting it now would be source/holdout intake rather than formula-route work"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Accuracy-relevant, but runtime tightening remains blocked by holdout requirements.",
      score: 1.82,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "Gate DI made the steel visible formula bridge live",
        "Gate DK carried the same owner inputs through shared/API surfaces",
        "closed work must not be selected again"
      ],
      id: "floor.steel_visible_formula_input_surface_parity_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts",
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate DI and Gate DK.",
      score: 0.7,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "source rows remain useful as exact answers, anchors, calibration rows, and holdouts",
        "broad crawling alone does not route arbitrary layer combinations to correct formulas"
      ],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because DynEcho is a formula-based calculator, not a source-row catalog.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: true,
      targetMetrics: [],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "confidence wording can describe uncertainty",
        "it cannot connect a realistic CLT layer stack to its correct family formula route"
      ],
      id: "confidence_wording",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it does not increase calculator scope or numeric accuracy.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 11,
      expectedBeforeAfter: [
        "frontend work may improve usability",
        "this slice is restricted to engine formula routing and runtime basis correctness"
      ],
      id: "frontend_ui_polish",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it is not calculator engine scope/accuracy work.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      touchesFrontendImplementation: true,
      touchesSharedOrApiSurface: false
    }
  ] as const satisfies readonly PostV1GateDOCandidate[];
}

export function summarizePostV1GateDONumericCoverageGap(): PostV1GateDOSummary {
  if (
    POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE
  ) {
    throw new Error("Gate DO can only land after Gate DN selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateDONumericCoverageCandidates();
  const selectedCandidates = candidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate DO requires exactly one selected calculator candidate.");
  }
  const selected = selectedCandidates[0];

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DO_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DO_PLAN_DOC_PATH,
    previousGateDN: {
      landedGate: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as typeof POST_V1_GATE_DO_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS
  };
}
