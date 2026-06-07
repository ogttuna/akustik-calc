import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS,
  POST_V1_GATE_EJ_COUNTERS,
  POST_V1_GATE_EJ_SURFACE_ID
} from "./post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ek_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ek_landed_no_runtime_selected_wall_visible_layer_formula_route_second_pass_gate_el" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION =
  "post_v1_wall_visible_layer_formula_route_second_pass_gate_el_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_LABEL =
  "post-V1 wall visible-layer formula-route second-pass Gate EL" as const;

export const POST_V1_GATE_EK_SELECTED_CANDIDATE_ID =
  "wall.visible_layer_formula_route_second_pass_after_gate_ej" as const;

export const POST_V1_GATE_EK_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EK_EL_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_PLAN_2026-06-07.md" as const;

export const POST_V1_GATE_EK_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EK_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "After Gate EJ, the ASTM exact-band surface is closed and the apparent floor/ASTM runtime gaps were subtracted against the current implementation rather than replayed from older handoffs.",
    rejectedDirections: [
      "reselecting ASTM IIC/AIIC exact-band owner or input-surface work closed by Gates EH through EJ",
      "reselecting floor composite-panel, heavy-concrete lower-treatment, mass-timber/CLT, steel, open-web, or open-box routes already closed or already live with required context",
      "counting missing route-required physical fields as scope when the correct result is needs_input"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The highest remaining ROI is a wall visible-layer formula-route second pass: the old wall coverage/source chain is stale after many post-V1 wall gates, and the next safe move is to reconcile current wall implementation against common visible wall layer-entry gaps before selecting a runtime/basis correction.",
    rejectedDirections: [
      "importing finite wall source rows as the next action without a selected route owner or acceptance gate",
      "reopening historical no-stud, timber, CLT, or lined-massive source-research closeouts as if they were runtime-ready",
      "opening/leak residual budget tightening because same-family holdouts are still insufficient"
    ]
  }
] as const;

export const POST_V1_GATE_EK_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedNextRouteFamilyCandidatesToReconcile: 8,
  estimatedNextWallCoverageLedgers: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_EK_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateEKCandidateId =
  | typeof POST_V1_GATE_EK_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl_or_frontend_polish"
  | "floor.astm_iic_aiic_closed_by_ej"
  | "floor.closed_formula_route_repeats_after_ej"
  | "floor.dataholz_c11c_raw_source_reopens_fail_closed"
  | "floor.lower_treatment_delta_lw_cross_family_derivation_rejected"
  | "floor.open_web_open_box_field_building_already_live"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.closed_runtime_basis_route_repeats_after_cs"
  | "wall.old_source_research_chain_blocked_or_superseded"
  | "wall.supportless_topology_boundaries_are_needs_input";

export type PostV1GateEKSliceKind =
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_source_or_tolerance"
  | "blocked_wrong_metric_derivation"
  | "closed_runtime_gap"
  | "input_surface_closed"
  | "needs_input_boundary"
  | "residual_holdout_blocked"
  | "wall_route_coverage_second_pass";

export type PostV1GateEKCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateEKCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateEKSliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
};

export type PostV1GateEKSummary = {
  readonly candidates: readonly PostV1GateEKCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EK_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EK_PLAN_DOC_PATH;
  readonly previousGateEJ: {
    readonly counters: typeof POST_V1_GATE_EJ_COUNTERS;
    readonly landedGate:
      typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS;
    readonly surfaceId: typeof POST_V1_GATE_EJ_SURFACE_ID;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_EK_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_EK_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS;
};

export function rankPostV1GateEKNumericCoverageCandidates(): readonly PostV1GateEKCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "older wall coverage planning selected single-leaf, double-leaf, no-stud, timber, CLT, and lined-massive source/research gates before many post-V1 wall route gates landed",
        "post-V1 wall gates have since added common flat double-leaf, explicit flat-order, multicavity, local-substitution, exact-source, timber, CLT, and heavy-core bounded/runtime-basis coverage",
        "Gate EL must reconcile that current implementation and select only a fresh visible-layer wall route subset that can improve scope or accuracy without weakening needs_input or unsupported boundaries"
      ],
      id: POST_V1_GATE_EK_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md",
        "packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts",
        "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts",
        "packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts",
        "packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts",
        "packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate EJ: wall coverage is the broadest remaining calculator-scope lane, but the old wall plan is stale. A second-pass Gate EL can pick the first fresh visible-layer formula-route correction from the current implementation instead of reopening closed source or floor work.",
      score: 3.08,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE,
      sliceKind: "wall_route_coverage_second_pass",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EK_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate EJ already carries explicitly ASTM-labelled one-third-octave user/import bands to the ASTM E989 owner",
        "ISO defaults, missing/ambiguous method evidence, and lab/field metric mismatch remain stopped",
        "selecting the same surface again adds no new calculator scope"
      ],
      id: "floor.astm_iic_aiic_closed_by_ej",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate EJ.",
      score: 1.82,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "input_surface_closed",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "composite-panel, heavy-concrete lower-treatment, lightweight concrete, mass-timber/CLT upper-package, and steel visible routes have already landed dedicated gates",
        "open-web/open-box field-building companions calculate when explicit impactFieldContext is present",
        "reselecting them would replay closed or already-live floor work"
      ],
      id: "floor.closed_formula_route_repeats_after_ej",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts",
        "packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed-contract.test.ts",
        "packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea-contract.test.ts",
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed floor formula-route work.",
      score: 1.44,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate CS/CU/CW and later wall runtime-basis gates already closed common flat, grouped multicavity, local-substitution, exact-source, timber-stud, CLT, and heavy-core route repeats",
        "these gates are evidence that wall work can move scope, not permission to reopen the same closed subsets",
        "new wall work must name an uncovered visible-layer subset"
      ],
      id: "wall.closed_runtime_basis_route_repeats_after_cs",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts",
        "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts",
        "packages/engine/src/post-v1-wall-exact-source-field-context-basis-gate-dx-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed wall formula-route and runtime-basis subsets.",
      score: 1.32,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EK_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "the no-stud, timber double-board, CLT wall, and lined-massive source-research chain closed because direct rows or bounded tolerances were missing",
        "those closeouts are still valid unless Gate EL identifies a current formula-route subset independent of source-row promotion",
        "broadly reopening the old source chain would be a source crawl, not the highest-ROI calculator step"
      ],
      id: "wall.old_source_research_chain_blocked_or_superseded",
      implementationEvidencePaths: [
        "packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Source/tolerance blocked as a direct runtime move, but useful evidence for Gate EL reconciliation.",
      score: 1.18,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_source_or_tolerance",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_EK_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "support-backed held-AAC and grouped multicavity requests calculate through existing owners",
        "supportless flat entries still need supportTopology, stud spacing, resilient side count, or grouped topology fields",
        "promoting them without inputs would weaken calculation correctness"
      ],
      id: "wall.supportless_topology_boundaries_are_needs_input",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ei-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Correct needs_input boundary, not a scope gap.",
      score: 1.06,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "needs_input_boundary",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "open-web and open-box field/building routes already calculate with explicit impactFieldContext",
        "missing field context remains a valid stopped-output boundary",
        "no new layer-template or request-shape movement is available by reselecting them"
      ],
      id: "floor.open_web_open_box_field_building_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts",
        "packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eg-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable with required context.",
      score: 0.96,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "Dataholz GDMTXA04A, TUAS C11c, and raw-bare open-box/open-web source chains remain fail-closed without direct runtime-ready evidence",
        "nearby rows can be evidence candidates only after a selected owner accepts them",
        "selecting a source reopen here would not improve formula routing now"
      ],
      id: "floor.dataholz_c11c_raw_source_reopens_fail_closed",
      implementationEvidencePaths: [
        "packages/engine/src/post-dataholz-gdmtxa04a-composite-surface-model-design-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Historical source reopen candidates remain fail-closed.",
      score: 0.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_source_or_tolerance",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "opening/leak adapters calculate through Gate CK",
        "residual budget tightening still needs same-family calibration and same-basis holdouts",
        "selecting it now would not add new layer-combination coverage"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Accuracy-relevant but still holdout-blocked.",
      score: 0.68,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "residual_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "generic lower-treatment DeltaLw subtraction across unrelated floor families would mix carrier and treatment effects",
        "broad source crawling, confidence wording, or frontend polish does not make the engine choose a better calculation route",
        "these remain blocked unless a future selected calculator slice names a route owner and acceptance boundary"
      ],
      id: "broad_source_row_crawl_or_frontend_polish",
      implementationEvidencePaths: [
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by calculator source-of-truth drift guard.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: [] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    }
  ] as const satisfies readonly PostV1GateEKCandidate[];
}

export function summarizePostV1GateEKNumericCoverageGap(): PostV1GateEKSummary {
  if (
    POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE
  ) {
    throw new Error("Gate EK can only land after Gate EJ selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateEKNumericCoverageCandidates();
  const selectedCandidates = candidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate EK requires exactly one selected calculator candidate.");
  }
  const selected = selectedCandidates[0];

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EK_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EK_PLAN_DOC_PATH,
    previousGateEJ: {
      counters: POST_V1_GATE_EJ_COUNTERS,
      landedGate: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE,
      selectedNextAction:
        POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS,
      surfaceId: POST_V1_GATE_EJ_SURFACE_ID
    },
    roiAnalysisIterations: POST_V1_GATE_EK_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: selected.id as typeof POST_V1_GATE_EK_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS
  };
}
