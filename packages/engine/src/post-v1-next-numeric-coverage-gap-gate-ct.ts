import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS
} from "./post-v1-wall-common-auto-topology-second-pass-gate-cs";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ct_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ct_landed_no_runtime_selected_wall_flat_layer_order_multicavity_gate_cu" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION =
  "post_v1_wall_flat_layer_order_multicavity_gate_cu_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_LABEL =
  "post-V1 wall flat layer-order multicavity Gate CU" as const;

export const POST_V1_GATE_CT_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_CT_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CT_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedNextNewCalculableLayerTemplates: 1,
  estimatedNextNewCalculableRequestShapes: 14,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  wrongAliasOrFallbackBlocks: [
    "explicit flat_layer_order multicavity may be admitted only when safe five-segment leaf/cavity/leaf/cavity/leaf segmentation and support ownership are present",
    "explicit grouped indices on flat_layer_order remain a contradiction and must not be auto-reinterpreted",
    "missing supportTopology remains needs_input instead of defaulting a multicavity support owner",
    "lab Rw/STC/C/Ctr, field R'w/Dn,w/DnT,w, and building-prediction outputs keep their metric/basis owners separate",
    "ISO wall airborne routes still do not publish ASTM impact IIC or AIIC aliases"
  ]
} as const;

export type PostV1GateCTCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
  | "floor.common_floating_lower_treatment_published_anchor_gap"
  | "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.common_auto_topology_second_pass_after_cj"
  | "wall.flat_layer_order_multicavity_grouped_owner_gap";

export type PostV1GateCTSliceKind =
  | "accuracy_holdout_intake"
  | "blocked_non_goal"
  | "closed_runtime_gap"
  | "metric_basis_input_surface"
  | "runtime_scope_expansion";

export type PostV1GateCTCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCTCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly runtimeAdmissibleNext: boolean;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCTSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateCTSummary = {
  readonly candidates: readonly PostV1GateCTCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_CT_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_CT_PLAN_DOC_PATH;
  readonly previousGateCS: {
    readonly landedGate: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS;
  };
  readonly selectedCandidateId: "wall.flat_layer_order_multicavity_grouped_owner_gap";
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS;
};

export function rankPostV1GateCTNumericCoverageCandidates(): readonly PostV1GateCTCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate CS reopened safe explicit flat_layer_order double-leaf walls through the existing double-leaf formula owner",
        "the remaining explicit flat-entry wall gap is the safe five-segment multicavity stack that can already be represented as grouped_triple_leaf when the engine derives the groups",
        "Gate CU can connect that user-entered layer order to the existing Gate AE multicavity lab solver plus Gate I/Gate AR field/building adapters without source crawling or frontend work"
      ],
      id: "wall.flat_layer_order_multicavity_grouped_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/wall-flat-multicavity-auto-topology.ts",
        "packages/engine/src/dynamic-airborne-gate-ae-flat-multicavity.ts",
        "packages/engine/src/post-v1-wall-flat-multicavity-auto-topology-gate-o-contract.test.ts",
        "packages/engine/src/post-v1-wall-flat-multicavity-field-physics-companion-gate-ai-contract.test.ts",
        "packages/engine/src/post-v1-wall-flat-multicavity-building-physics-gate-aj-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate CS: it continues the user's layer-combination formula-routing priority, turns a blocked realistic wall layer order into existing owned multicavity formulas, and preserves strict topology/metric boundaries.",
      runtimeAdmissibleNext: true,
      score: 5.44,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CT_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate CQ opened common floating lower-treatment simple field companions",
        "direct/flanking lower-treatment impact context is still useful",
        "the wall flat-layer-order multicavity gap has lower wrong-number risk because it routes to already landed AE/AI/AJ formula owners"
      ],
      id: "floor.common_floating_lower_treatment_direct_flanking_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts",
        "packages/engine/src/impact-field-context.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Scope-relevant, but lower immediate ROI than safe wall formula routing because direct/flanking field impact budgets carry higher calibration risk.",
      runtimeAdmissibleNext: false,
      score: 4.24,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "explicit ASTM impact band input would eventually allow true IIC/AIIC owners",
        "that program requires shared/API/workbench/report/replay input surfaces before runtime publication",
        "the current turn must stay engine-only because frontend work is active elsewhere"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid later, but lower ROI here because it crosses frontend/shared surfaces and does not improve arbitrary layer-formula routing now.",
      runtimeAdmissibleNext: false,
      score: 3.3,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_input_surface",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendOrSharedSurface: true
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate CL recorded residual budgets for common wall and opening/leak adapters",
        "same-family calibration and same-basis holdouts are still required before tightening",
        "selecting it now would become evidence intake rather than calculator runtime coverage"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant, but blocked from immediate runtime movement by the holdout requirements Gate CL already recorded.",
      runtimeAdmissibleNext: false,
      score: 3.06,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "Gate CR selected the wall common auto-topology second pass",
        "Gate CS landed the safe explicit flat_layer_order double-leaf runtime correction",
        "closed work must not be selected again while explicit multicavity layer-order routing remains open"
      ],
      id: "wall.common_auto_topology_second_pass_after_cj",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts",
        "packages/engine/src/wall-flat-multicavity-auto-topology.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CS; retained only to prevent stale high-ROI work from being picked again.",
      runtimeAdmissibleNext: false,
      score: 0.6,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "Gate CP selected common floating lower-treatment published anchors",
        "Gate CQ has already landed that runtime movement",
        "closed work must not be reselected while open formula-routing gaps remain"
      ],
      id: "floor.common_floating_lower_treatment_published_anchor_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CQ; retained only to prevent stale high-ROI work from being picked again.",
      runtimeAdmissibleNext: false,
      score: 0.54,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate CN selected visible timber/CLT upper-package DeltaLw routing",
        "Gate CO landed that runtime movement",
        "closed work must not be selected again"
      ],
      id: "floor.visible_layer_upper_package_delta_lw_formula_routing_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CO; retained only to prevent stale high-ROI work from being picked again.",
      runtimeAdmissibleNext: false,
      score: 0.5,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "frontend polish can improve data entry",
        "it does not make the engine choose or execute a better acoustic formula by itself"
      ],
      id: "frontend_ui_polish",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by the calculator advancement test and by the user's instruction to leave frontend work alone.",
      runtimeAdmissibleNext: false,
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      touchesFrontendOrSharedSurface: true
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "source rows remain useful as exact answers, anchors, calibration rows, and holdouts",
        "broad crawling alone does not route arbitrary layer combinations to formulas"
      ],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because the product goal is formula-based calculator coverage, not catalog growth.",
      runtimeAdmissibleNext: false,
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: true,
      targetMetrics: [],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "confidence wording can describe uncertainty",
        "it cannot choose the correct wall or floor formula or calculate a new output"
      ],
      id: "confidence_wording",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it does not increase calculator scope or accuracy.",
      runtimeAdmissibleNext: false,
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      touchesFrontendOrSharedSurface: false
    }
  ] as const satisfies readonly PostV1GateCTCandidate[];
}

export function summarizePostV1GateCTNumericCoverageGap(): PostV1GateCTSummary {
  if (
    POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE
  ) {
    throw new Error("Gate CT can only land after Gate CS selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateCTNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate CT requires exactly one selected calculator candidate.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_CT_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_CT_PLAN_DOC_PATH,
    previousGateCS: {
      landedGate: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as "wall.flat_layer_order_multicavity_grouped_owner_gap",
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS
  };
}
