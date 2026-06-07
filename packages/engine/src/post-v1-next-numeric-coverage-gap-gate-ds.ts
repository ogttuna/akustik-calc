import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_LANDED_GATE,
  POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_ACTION,
  POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_FILE,
  POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTION_STATUS
} from "./post-v1-wall-exact-source-zero-delta-basis-gate-dr";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ds_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ds_landed_no_runtime_selected_wall_masonry_exact_source_mixed_metric_companion_gate_dt" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION =
  "post_v1_wall_masonry_exact_source_mixed_metric_companion_gate_dt_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_LABEL =
  "post-V1 wall masonry exact-source mixed-metric companion Gate DT" as const;

export const POST_V1_GATE_DS_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DS_SELECTED_CANDIDATE_ID =
  "wall.masonry_exact_source_mixed_metric_companion_policy_gap" as const;

export const POST_V1_GATE_DS_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DS_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "After Gate DR, the remaining true engine-only candidates were checked against scope first. No higher-scope candidate had complete route-required inputs and a narrower implementation surface than the masonry mixed exact-source policy gap.",
    rejectedDirections: [
      "broad source crawling",
      "frontend/workbench polish",
      "ASTM IIC/AIIC surface work",
      "field/building aliases from lab Rw"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The selected candidate improves answer-order accuracy without numeric retune: Rw can reference the exact source while STC/C/Ctr remain calculated companions, preserving mixed-output scope and metric ownership boundaries.",
    rejectedDirections: [
      "promoting the whole mixed answer to measured_exact_full_stack",
      "dropping STC/C/Ctr as unsupported",
      "retuning the masonry curve from source proximity"
    ]
  }
] as const;

export const POST_V1_GATE_DS_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedNextNewCalculableLayerTemplates: 0,
  estimatedNextNewCalculableRequestShapes: 0,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeCorrectedLayerTemplates: 1,
  estimatedNextRuntimeCorrectedRequestShapes: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  protectedFieldOrBuildingAliasRequestShapes: 1,
  protectedMixedCompanionRequestShapes: 1,
  roiAnalysisIterations: POST_V1_GATE_DS_ROI_ANALYSIS_ITERATIONS.length,
  runtimeValuesMoved: 0
} as const;

export type PostV1GateDSCandidateId =
  | typeof POST_V1_GATE_DS_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.impact_explicit_ci_surface_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.clt_laminated_leaf_bounded_rule_owner_gap"
  | "wall.heavy_core_lined_massive_direct_retune"
  | "wall.lsf_exact_lab_anchor_field_input_surface_gap";

export type PostV1GateDSSliceKind =
  | "accuracy_holdout_intake"
  | "accuracy_owner_contract"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_without_source_or_rule"
  | "metric_basis_input_surface"
  | "runtime_basis_accuracy_repair";

export type PostV1GateDSCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDSCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeBasis: boolean;
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDSSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateDSSummary = {
  readonly candidates: readonly PostV1GateDSCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DS_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DS_PLAN_DOC_PATH;
  readonly previousGateDR: {
    readonly landedGate: typeof POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_DS_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_DS_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS;
};

export function rankPostV1GateDSNumericCoverageCandidates(): readonly PostV1GateDSCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate DR corrected the single-output masonry Rw zero-delta exact-source basis",
        "the mixed Rw/STC/C/Ctr request still reports a generic screening basis even though Rw has a same-stack exact source",
        "Gate DT can select a mixed exact-Rw plus calculated-companion family basis without changing Rw 43, STC 43, C -1, or Ctr -5.5"
      ],
      id: POST_V1_GATE_DS_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/airborne-verified-catalog.ts",
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts",
        "packages/engine/src/post-v1-wall-exact-source-zero-delta-basis-gate-dr-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: true,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DR: it preserves existing mixed-output scope while making answer-order accuracy honest. Exact Rw is no longer hidden behind a generic screening label, and companion metrics are still calculated instead of being falsely claimed by the Rw-only source row.",
      score: 3.22,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE,
      sliceKind: "runtime_basis_accuracy_repair",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DS_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "field LSF exact-lab anchoring already calculates when airtightness and field context are supplied",
        "without airtightness the stop is needs_input, not a formula gap",
        "surface parity can be selected later if the input surface becomes the bottleneck"
      ],
      id: "wall.lsf_exact_lab_anchor_field_input_surface_gap",
      implementationEvidencePaths: [
        "packages/engine/src/airborne-verified-catalog.ts",
        "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Valid but already runtime-capable when required physical inputs are present.",
      score: 2.04,
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
        "Gate DP repaired the immediate CLT laminated-leaf runtime basis",
        "a bounded owner ledger may still be useful later",
        "it is lower ROI than a live wrong-basis mixed masonry answer"
      ],
      id: "wall.clt_laminated_leaf_bounded_rule_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Valid later, but the runtime-facing CLT basis gap is already closed.",
      score: 1.72,
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
        "exact ASTM E492/E1007 band input remains the correct path for IIC/AIIC",
        "ISO impact routes still must not alias to ASTM",
        "remaining work here is shared/API/workbench surface, not the highest engine-only route repair"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Important later, but wider surface area and lower current engine-only ROI.",
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
      candidateOrder: 5,
      expectedBeforeAfter: [
        "explicit CI inputs already calculate CI, Ln,w+CI, and L'nT,50 companions",
        "missing CI inputs remain needs_input",
        "selecting it now would duplicate existing input behavior"
      ],
      id: "floor.impact_explicit_ci_surface_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-explicit-ci-local-guide-gate-an-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable when route-required inputs are supplied.",
      score: 1.18,
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
        "same-family opening/leak holdouts remain insufficient for budget tightening",
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
      score: 1.06,
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
      candidateOrder: 7,
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
      candidateOrder: 8,
      expectedBeforeAfter: [
        "source rows remain useful as exact answers, anchors, calibration rows, and holdouts",
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
      candidateOrder: 9,
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
      candidateOrder: 10,
      expectedBeforeAfter: [
        "frontend polish can improve operation but not the engine's formula ownership",
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
  ] as const satisfies readonly PostV1GateDSCandidate[];
}

export function summarizePostV1GateDSNumericCoverageGap(): PostV1GateDSSummary {
  if (
    POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_LANDED_GATE
  ) {
    throw new Error("Gate DS can only land after Gate DR selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateDSNumericCoverageCandidates();
  const selectedCandidates = candidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate DS requires exactly one selected calculator candidate.");
  }
  const selected = selectedCandidates[0];

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DS_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DS_PLAN_DOC_PATH,
    previousGateDR: {
      landedGate: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTION_STATUS
    },
    roiAnalysisIterations: POST_V1_GATE_DS_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: selected.id as typeof POST_V1_GATE_DS_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS
  };
}
