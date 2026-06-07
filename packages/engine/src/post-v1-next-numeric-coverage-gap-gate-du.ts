import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS
} from "./post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_du_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_du_landed_no_runtime_selected_wall_lsf_exact_source_mixed_metric_companion_gate_dv" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION =
  "post_v1_wall_lsf_exact_source_mixed_metric_companion_gate_dv_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-lsf-exact-source-mixed-metric-companion-gate-dv-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_LABEL =
  "post-V1 wall LSF exact-source mixed-metric companion Gate DV" as const;

export const POST_V1_GATE_DU_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DU_SELECTED_CANDIDATE_ID =
  "wall.lsf_exact_source_mixed_lab_companion_gap" as const;

export const POST_V1_GATE_DU_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DU_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "After Gate DT, true engine-only scope gaps were rechecked against live generated cases. The LSF exact-source lab request still calculates only Rw while STC/C/Ctr are available from the dynamic curve and rating adapters.",
    rejectedDirections: [
      "broad source crawling",
      "frontend/workbench input polish",
      "ASTM IIC/AIIC surface work",
      "LSF field anchoring without explicit airtightness"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The LSF mixed lab companion gap has higher ROI than an input-surface guard because it turns unsupported requested outputs into calculated answers without inventing a formula, retuning values, or aliasing field/building metrics from lab Rw.",
    rejectedDirections: [
      "promoting the whole mixed answer to measured_exact_full_stack",
      "leaving calculated STC/C/Ctr unsupported beside exact Rw",
      "using lab Rw as R'w, Dn,w, DnT,w, or DnT,A"
    ]
  }
] as const;

export const POST_V1_GATE_DU_NO_RUNTIME_COUNTERS = {
  candidateCount: 11,
  estimatedNextNewCalculableLayerTemplates: 1,
  estimatedNextNewCalculableRequestShapes: 1,
  estimatedNextNewCalculableTargetOutputs: 3,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeCorrectedLayerTemplates: 1,
  estimatedNextRuntimeCorrectedRequestShapes: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_DU_ROI_ANALYSIS_ITERATIONS.length,
  runtimeValuesMoved: 0
} as const;

export type PostV1GateDUCandidateId =
  | typeof POST_V1_GATE_DU_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.impact_explicit_ci_surface_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.clt_laminated_leaf_bounded_rule_owner_gap"
  | "wall.heavy_core_lined_massive_direct_retune"
  | "wall.lsf_exact_lab_anchor_field_airtightness_input_gap"
  | "wall.masonry_exact_source_mixed_metric_companion_policy_gap";

export type PostV1GateDUSliceKind =
  | "accuracy_holdout_intake"
  | "accuracy_owner_contract"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_without_source_or_rule"
  | "closed_runtime_gap"
  | "metric_basis_input_surface"
  | "runtime_scope_and_basis_repair";

export type PostV1GateDUCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDUCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeBasis: boolean;
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDUSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateDUSummary = {
  readonly candidates: readonly PostV1GateDUCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DU_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DU_PLAN_DOC_PATH;
  readonly previousGateDT: {
    readonly landedGate: typeof POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_DU_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_DU_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS;
};

export function rankPostV1GateDUNumericCoverageCandidates(): readonly PostV1GateDUCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "wall-lsf-knauf lab has exact source Rw 55 from Knauf 416889",
        "the same mixed lab request currently has calculated STC 55, C -1.5, and Ctr -6.4 values available but leaves those requested outputs unsupported under the exact Rw-only source policy",
        "Gate DV can keep Rw source anchored and publish STC/C/Ctr as calculated companions through the existing dynamic curve and rating adapters"
      ],
      id: POST_V1_GATE_DU_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/airborne-verified-catalog.ts",
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts",
        "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: true,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DT: it increases calculable mixed lab output scope for a common visible LSF wall while preserving exact Rw ownership. No new formula is invented; the existing dynamic curve and STC/C/Ctr adapters own the companions.",
      score: 3.48,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_and_basis_repair",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DU_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "LSF field can use the existing lab-anchor field delta only when airtightness and field context are explicit",
        "missing airtightness remains an input-boundary risk, not a higher-scope engine formula gap",
        "selecting it now would preserve correctness but would not add a new calculated output"
      ],
      id: "wall.lsf_exact_lab_anchor_field_airtightness_input_gap",
      implementationEvidencePaths: [
        "packages/engine/src/airborne-verified-catalog.ts",
        "packages/engine/src/airborne-catalog-field-anchor-lab-fallback.test.ts",
        "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Valid later as a needs_input boundary, but lower ROI than turning unsupported LSF lab companions into calculated answers.",
      score: 2.34,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_input_surface",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "Gate DP repaired the generated CLT laminated-leaf runtime basis",
        "a bounded owner ledger may still improve accuracy posture later",
        "it does not add calculable outputs in the next runtime slice"
      ],
      id: "wall.clt_laminated_leaf_bounded_rule_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts",
        "packages/engine/src/wall-clt-gate-b-source-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Valid later, but lower ROI than an immediate LSF scope increase.",
      score: 1.92,
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
        "Gate DT already closed the masonry exact-Rw plus calculated companion policy gap",
        "selecting it again would not move scope or accuracy",
        "masonry field/building aliases remain separate"
      ],
      id: "wall.masonry_exact_source_mixed_metric_companion_policy_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate DT.",
      score: 0.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "exact ASTM E492/E1007 one-third-octave input remains the correct IIC/AIIC path",
        "ISO impact routes must not alias to ASTM",
        "remaining work is broad input surface parity rather than the highest engine-only scope repair"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Important later, but lower current engine-only ROI.",
      score: 1.28,
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
      candidateOrder: 6,
      expectedBeforeAfter: [
        "explicit CI / CI,50-2500 input already calculates CI, Ln,w+CI, and L'nT,50 companions",
        "without those inputs the correct stop is needs_input",
        "selecting it now would duplicate existing input behavior"
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
      score: 1.16,
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
      candidateOrder: 7,
      expectedBeforeAfter: [
        "opening/leak same-family holdouts remain insufficient for budget tightening",
        "near-source rows stay evidence candidates only",
        "runtime tightening is blocked until same-basis holdouts exist"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Accuracy-relevant, but blocked by holdout requirements.",
      score: 1.02,
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
        "Gate DG already promoted lined-massive to bounded_prediction",
        "direct retune still lacks a same-stack wall source or named coefficient rule",
        "moving values now would weaken the bounded-rule boundary"
      ],
      id: "wall.heavy_core_lined_massive_direct_retune",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Accuracy-relevant but blocked until source or coefficient ownership exists.",
      score: 0.96,
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
      candidateOrder: 9,
      expectedBeforeAfter: [
        "source rows are useful as exact answers, anchors, calibration rows, and holdouts",
        "broad crawling alone does not route arbitrary layer combinations to owned formulas"
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
        "it does not improve formula selection, answer basis, or calculable scope"
      ],
      id: "confidence_wording",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it does not increase calculator scope or accuracy.",
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
        "frontend polish can improve operation but not engine formula ownership",
        "other agents are already working frontend, so this remains out of the calculator slice"
      ],
      id: "frontend_ui_polish",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked for this engine turn; it is not calculator scope or accuracy work.",
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
  ] as const satisfies readonly PostV1GateDUCandidate[];
}

export function summarizePostV1GateDUNumericCoverageGap(): PostV1GateDUSummary {
  if (
    POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_LANDED_GATE
  ) {
    throw new Error("Gate DU can only land after Gate DT selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateDUNumericCoverageCandidates();
  const selectedCandidates = candidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate DU requires exactly one selected calculator candidate.");
  }
  const selected = selectedCandidates[0];

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DU_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DU_PLAN_DOC_PATH,
    previousGateDT: {
      landedGate: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS
    },
    roiAnalysisIterations: POST_V1_GATE_DU_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: selected.id as typeof POST_V1_GATE_DU_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS
  };
}
