import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE,
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE,
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS
} from "./post-v1-wall-flat-layer-order-multicavity-gate-cu";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_cv_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_cv_landed_no_runtime_selected_wall_local_substitution_building_adapter_gate_cw" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION =
  "post_v1_wall_local_substitution_building_adapter_gate_cw_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_LABEL =
  "post-V1 wall local-substitution building adapter Gate CW" as const;

export const POST_V1_GATE_CV_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_CV_SELECTED_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CV_NO_RUNTIME_COUNTERS = {
  candidateCount: 11,
  estimatedNextNewCalculableLayerTemplates: 1,
  estimatedNextNewCalculableRequestShapes: 5,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  wrongAliasOrFallbackBlocks: [
    "local-substitution building outputs may be admitted only from explicit building_prediction context with flanking, junction, room, and output-basis owners",
    "local-substitution lab Rw/STC/C/Ctr and field R'w/DnT,w must not be relabelled as building-prediction outputs",
    "missing buildingPredictionOutputBasis, flankingJunctionClass, conservativeFlankingAssumption, room volumes, RT60, panel dimensions, or junctionCouplingLengthM remains needs_input or unsupported as currently owned",
    "exact same-stack source rows remain higher precedence than the source-absent local-substitution building adapter",
    "floor ISO impact routes still do not publish ASTM IIC or AIIC aliases"
  ]
} as const;

export type PostV1GateCVCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
  | "floor.common_floating_lower_treatment_published_anchor_gap"
  | "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.common_auto_topology_second_pass_after_cj"
  | "wall.flat_layer_order_multicavity_grouped_owner_gap"
  | "wall.local_substitution_building_prediction_adapter_gap";

export type PostV1GateCVSliceKind =
  | "accuracy_holdout_intake"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "closed_runtime_gap"
  | "metric_basis_input_surface"
  | "runtime_scope_expansion";

export type PostV1GateCVCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCVCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly runtimeAdmissibleNext: boolean;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCVSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateCVSummary = {
  readonly candidates: readonly PostV1GateCVCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_CV_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_CV_PLAN_DOC_PATH;
  readonly previousGateCU: {
    readonly landedGate: typeof POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS;
  };
  readonly selectedCandidateId: "wall.local_substitution_building_prediction_adapter_gap";
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS;
};

export function rankPostV1GateCVNumericCoverageCandidates(): readonly PostV1GateCVCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "local-substitution triple-leaf walls now calculate lab Rw/STC/C/Ctr and field R'w/DnT,w from owned local-substitution curve adapters",
        "the same complete stack with explicit building_prediction flanking, junction, room, and output-basis context still stops as unsupported because no local-substitution building adapter is selected",
        "Gate CW can connect that family-specific lab curve to the existing building-prediction formula corridor without source crawling, frontend work, or metric aliasing"
      ],
      id: "wall.local_substitution_building_prediction_adapter_gap",
      implementationEvidencePaths: [
        "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor.ts",
        "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter.ts",
        "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization.ts",
        "packages/engine/src/dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor.ts",
        "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate CU: it adds a real building-prediction route for a family that already owns lab and field formulas, with explicit physical inputs and no frontend/shared-surface dependency.",
      runtimeAdmissibleNext: true,
      score: 5.12,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CV_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate CQ opened common floating lower-treatment anchor outputs",
        "a direct/flanking lower-treatment probe now already calculates L'n,w, L'nT,w, and L'nT,50 through the generic field adapter when explicit direct/flanking context is present",
        "pinning that route is useful, but it is not the next value-moving scope expansion"
      ],
      id: "floor.common_floating_lower_treatment_direct_flanking_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts",
        "packages/engine/src/impact-field-context.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Lower ROI now because the direct/flanking field route is already runtime-capable for the Gate CQ lower-treatment anchor; selecting it would mostly add pins instead of new calculator scope.",
      runtimeAdmissibleNext: false,
      score: 3.82,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "explicit ASTM impact band input would eventually allow true IIC/AIIC owners",
        "the user-band program requires shared/API/workbench/report/replay input surfaces before safe publication",
        "frontend agents are active elsewhere, so this engine turn must not select it"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid later, but lower ROI here because it crosses frontend/shared surfaces and does not improve layer-formula routing in the engine by itself.",
      runtimeAdmissibleNext: false,
      score: 3.34,
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
        "Gate CL recorded residual ledgers for common wall and opening/leak adapters",
        "same-family calibration rows and same-basis holdouts are still insufficient for budget tightening",
        "selecting it now would become evidence intake rather than immediate calculator coverage"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant, but blocked from runtime movement by the holdout requirements already recorded by Gate CL.",
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
        "Gate CT selected safe flat_layer_order multicavity formula routing",
        "Gate CU landed that runtime move with lab, field, and building pins",
        "closed work must not be selected again"
      ],
      id: "wall.flat_layer_order_multicavity_grouped_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CU; retained only to prevent stale high-ROI work from being picked again.",
      runtimeAdmissibleNext: false,
      score: 0.58,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "Gate CR selected the wall common auto-topology second pass",
        "Gate CS landed safe explicit flat_layer_order double-leaf wall routing",
        "closed work must not be reselected"
      ],
      id: "wall.common_auto_topology_second_pass_after_cj",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CS; retained only to prevent stale high-ROI work from being picked again.",
      runtimeAdmissibleNext: false,
      score: 0.55,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate CP selected common floating lower-treatment published anchors",
        "Gate CQ landed that runtime movement",
        "closed work must not be reselected"
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
      candidateOrder: 8,
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
      candidateOrder: 9,
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
      candidateOrder: 10,
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
      candidateOrder: 11,
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
  ] as const satisfies readonly PostV1GateCVCandidate[];
}

export function summarizePostV1GateCVNumericCoverageGap(): PostV1GateCVSummary {
  if (
    POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE
  ) {
    throw new Error("Gate CV can only land after Gate CU selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateCVNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate CV requires exactly one selected calculator candidate.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_CV_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_CV_PLAN_DOC_PATH,
    previousGateCU: {
      landedGate: POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as "wall.local_substitution_building_prediction_adapter_gap",
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS
  };
}
