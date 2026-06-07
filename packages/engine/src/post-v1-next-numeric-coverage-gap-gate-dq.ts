import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE,
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION,
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE,
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS
} from "./post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_dq_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_dq_landed_no_runtime_selected_wall_exact_source_zero_delta_basis_gate_dr" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION =
  "post_v1_wall_exact_source_zero_delta_basis_gate_dr_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-exact-source-zero-delta-basis-gate-dr-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_LABEL =
  "post-V1 wall exact-source zero-delta basis Gate DR" as const;

export const POST_V1_GATE_DQ_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID =
  "wall.exact_source_zero_delta_single_output_basis_gap" as const;

export const POST_V1_GATE_DQ_SELECTED_TARGET_OUTPUTS = [
  "Rw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DQ_NO_RUNTIME_COUNTERS = {
  candidateCount: 11,
  estimatedNextNewCalculableLayerTemplates: 0,
  estimatedNextNewCalculableRequestShapes: 0,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeCorrectedLayerTemplates: 1,
  estimatedNextRuntimeCorrectedRequestShapes: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  selectedAlreadyCalculableRequestShapes: 1,
  selectedCurrentScreeningFallbackRequestShapes: 1,
  wrongAliasOrFallbackBlocks: [
    "Gate DR must promote only exact-source single-output zero-delta matches; it must not reduce mixed Rw/STC/C/Ctr companion scope",
    "exact measured Rw owns Rw only; STC, C, Ctr remain separate calculated companions unless an owner explicitly selects them",
    "field or building outputs must not be relabelled from lab Rw; explicit field context and field metric adapters remain separate",
    "LSF field anchoring remains already-runtime-capable only when required airtightness and field context inputs are present",
    "floor Ln,w+CI remains driven by exact CI or explicit ciDb/ci50_2500Db inputs rather than fabricated from Ln,w",
    "Gate DQ does not move runtime values and does not touch frontend implementation"
  ]
} as const;

export type PostV1GateDQCandidateId =
  | typeof POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.impact_explicit_ci_surface_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.clt_laminated_leaf_bounded_rule_owner_gap"
  | "wall.heavy_core_lined_massive_direct_retune"
  | "wall.held_aac_board_fill_gap_multicavity_gap"
  | "wall.lsf_exact_lab_anchor_field_input_surface_gap"
  | "wall.masonry_exact_source_mixed_metric_companion_policy_gap";

export type PostV1GateDQSliceKind =
  | "accuracy_holdout_intake"
  | "accuracy_owner_contract"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_without_source_or_rule"
  | "metric_basis_input_surface"
  | "runtime_basis_accuracy_repair";

export type PostV1GateDQCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDQCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeBasis: boolean;
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDQSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateDQSummary = {
  readonly candidates: readonly PostV1GateDQCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DQ_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DQ_PLAN_DOC_PATH;
  readonly previousGateDP: {
    readonly landedGate: typeof POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTION_STATUS;
};

export function rankPostV1GateDQNumericCoverageCandidates(): readonly PostV1GateDQCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "wall-masonry-brick single-output Rw has a rights-safe exact catalog row at Rw 43",
        "the dynamic curve already lands on Rw 43, so the anchor applies no numeric delta and the public basis stays screening_fallback",
        "Gate DR can promote only the single-output exact metric basis to measured_exact_full_stack without moving values or closing mixed calculated companions"
      ],
      id: POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/airborne-verified-catalog.ts",
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts",
        "packages/engine/src/airborne-masonry-benchmark.test.ts"
      ],
      nextActionMovesRuntimeBasis: true,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DP: exact-source precedence is part of answer correctness. The zero-delta masonry Rw case already has the right number but the wrong selected basis, and the fix can be single-output only so it does not reduce existing calculated STC/C/Ctr companion coverage.",
      score: 3.64,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE,
      sliceKind: "runtime_basis_accuracy_repair",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DQ_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "field LSF exact-lab anchoring is already available when airtightness and complete field context are supplied",
        "without airtightness the current request is missing an owner input, not a missing formula",
        "selecting it now would be input-surface/needs_input refinement rather than the highest engine routing repair"
      ],
      id: "wall.lsf_exact_lab_anchor_field_input_surface_gap",
      implementationEvidencePaths: [
        "packages/engine/src/airborne-verified-catalog.ts",
        "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Valid later, but already runtime-capable when the required physical input is present.",
      score: 2.18,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: true
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "mixed exact-source Rw plus calculated STC/C/Ctr companion policy remains real",
        "promoting the whole mixed answer to exact source would incorrectly imply the source owns unreported companion metrics",
        "Gate DR must handle the lower-risk single-output exact metric first"
      ],
      id: "wall.masonry_exact_source_mixed_metric_companion_policy_gap",
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant, but broader than the immediate safe basis repair because it needs a mixed exact-plus-calculated basis owner.",
      score: 2.02,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_owner_contract",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate DP repaired the generated CLT laminated-leaf runtime basis through the existing CLT owner lineage",
        "a bounded laminated-leaf owner may still be useful later",
        "it is lower ROI than exact-source answer-order correctness for a currently screening-labelled exact Rw"
      ],
      id: "wall.clt_laminated_leaf_bounded_rule_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts",
        "packages/engine/src/wall-clt-gate-b-source-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Valid later as an owner-contract step, but Gate DP already closed the immediate basis gap.",
      score: 1.94,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_owner_contract",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "explicit CI / CI,50-2500 local-guide input already calculates CI, Ln,w+CI, and L'nT,50 companions",
        "without those inputs the stop is needs_input, not a missing formula route",
        "selecting it now would duplicate existing input-surface behavior"
      ],
      id: "floor.impact_explicit_ci_surface_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-explicit-ci-local-guide-gate-an-contract.test.ts",
        "packages/engine/src/impact-field-context.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable when explicit CI owner inputs are present.",
      score: 1.4,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["CI", "CI,50-2500", "Ln,w+CI", "L'nT,50"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: true
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "exact ASTM E492/E1007 one-third-octave input already calculates IIC/AIIC through the ASTM owner",
        "ISO impact routes must still not alias to ASTM IIC/AIIC",
        "remaining work here is broad input surface parity, not the best engine-only formula-routing repair"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Important later, but lower current ROI than exact-source answer-order repair.",
      score: 1.32,
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
        "explicit wall-held AAC/multicavity support-backed requests already calculate through existing family routes",
        "supportless flat entries correctly stop with needs_input",
        "selecting it now would count missing supportTopology as fake scope"
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
      targetMetrics: ["Rw", "R'w", "DnT,w"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "same-family calibration rows and holdouts remain insufficient for opening/leak budget tightening",
        "near-source rows remain evidence candidates only",
        "selecting it now would be holdout intake rather than formula-route work"
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
      score: 1.12,
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
      candidateOrder: 9,
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
      score: 0.98,
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
      candidateOrder: 10,
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
      candidateOrder: 11,
      expectedBeforeAfter: [
        "confidence wording and frontend polish can describe or present results",
        "they do not improve formula selection, exact-source precedence, or calculable metric ownership"
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
    }
  ] as const satisfies readonly PostV1GateDQCandidate[];
}

export function summarizePostV1GateDQNumericCoverageGap(): PostV1GateDQSummary {
  if (
    POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_LANDED_GATE
  ) {
    throw new Error("Gate DQ can only land after Gate DP selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateDQNumericCoverageCandidates();
  const selectedCandidates = candidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate DQ requires exactly one selected calculator candidate.");
  }
  const selected = selectedCandidates[0];

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DQ_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DQ_PLAN_DOC_PATH,
    previousGateDP: {
      landedGate: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as typeof POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTION_STATUS
  };
}
