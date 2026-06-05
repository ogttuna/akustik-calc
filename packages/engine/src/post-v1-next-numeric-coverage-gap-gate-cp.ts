import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE,
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS
} from "./post-v1-floor-visible-layer-upper-package-delta-lw-gate-co";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_cp_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_cp_landed_no_runtime_selected_floor_common_floating_lower_treatment_anchor_gate_cq" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION =
  "post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_LABEL =
  "post-V1 floor common floating lower-treatment anchor Gate CQ" as const;

export const POST_V1_GATE_CP_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_CP_SELECTED_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CP_NO_RUNTIME_COUNTERS = {
  candidateCount: 8,
  estimatedNextNewCalculableLayerTemplates: 2,
  estimatedNextNewCalculableRequestShapes: 10,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  wrongAliasOrFallbackBlocks: [
    "visible heavy-floating plus lower-treatment stacks must keep the published-family Ln,w anchor live instead of letting the combined formula needs_input guard hide every impact output",
    "DeltaLw for the same stacks still requires its own load basis and dynamic stiffness owner fields",
    "complete load and dynamic-stiffness inputs must stay on the heavy combined upper/lower formula corridor",
    "ISO floor impact outputs still do not publish ASTM IIC or AIIC aliases",
    "Rw and Ctr airborne companions do not replace the missing impact owner"
  ]
} as const;

export type PostV1GateCPCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.common_floating_lower_treatment_published_anchor_gap"
  | "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.common_auto_topology_second_pass_after_cj";

export type PostV1GateCPSliceKind =
  | "accuracy_holdout_intake"
  | "blocked_non_goal"
  | "closed_runtime_gap"
  | "metric_basis_input_surface"
  | "runtime_scope_expansion";

export type PostV1GateCPCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCPCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly runtimeAdmissibleNext: boolean;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCPSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateCPSummary = {
  readonly candidates: readonly PostV1GateCPCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_CP_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_CP_PLAN_DOC_PATH;
  readonly previousGateCO: {
    readonly landedGate: typeof POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS;
  };
  readonly selectedCandidateId: "floor.common_floating_lower_treatment_published_anchor_gap";
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS;
};

export function rankPostV1GateCPNumericCoverageCandidates(): readonly PostV1GateCPCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "visible heavy-floating reinforced-concrete stacks with lower ceiling treatment currently calculate Rw/Ctr but hide Ln,w behind the combined formula load-basis needs_input guard",
        "the same family already has a published upper-treatment Ln,w anchor for elastic and rigid gypsum ceiling variants",
        "Gate CQ can keep Ln,w and field impact companions live from that anchor while DeltaLw remains needs_input until load basis and dynamic stiffness are present"
      ],
      id: "floor.common_floating_lower_treatment_published_anchor_gap",
      implementationEvidencePaths: [
        "packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts",
        "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts",
        "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts",
        "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts",
        "packages/engine/src/calculate-assembly.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI now: it continues the documented common floor floating/covering expansion, opens two frequent visible lower-treatment layer templates, and uses an already-owned published anchor/formula boundary instead of source crawling.",
      runtimeAdmissibleNext: true,
      score: 5.36,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CP_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate CJ already corrected common flat double-leaf building routing",
        "another wall auto-topology pass is useful only after a specific still-blocked wall topology is isolated",
        "the current floor lower-treatment gap has clearer before/after runtime movement"
      ],
      id: "wall.common_auto_topology_second_pass_after_cj",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Useful later, but less immediate ROI than the visible floor lower-treatment anchor gap because Gate CJ just moved the broad common-wall route.",
      runtimeAdmissibleNext: false,
      score: 4.1,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "explicit ASTM impact band input would be valid calculator work",
        "it needs shared/API/workbench/report/replay input surfaces before runtime can be trusted",
        "other agents are working on frontend and this turn should remain engine-only"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid as a separate metric-basis program, but lower ROI for this engine slice because it crosses frontend/shared surfaces and does not expand ISO formula routing.",
      runtimeAdmissibleNext: false,
      score: 3.24,
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
        "opening/leak and common wall routes have residual ledgers",
        "Gate CL proved budgets cannot tighten without same-family calibration and same-basis holdouts",
        "selecting it now would mostly become evidence intake rather than runtime calculator coverage"
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
      score: 3.02,
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
        "Gate CN selected visible timber/CLT upper-package DeltaLw routing",
        "Gate CO has now landed that runtime movement with pinned values and boundaries",
        "closed work must not be selected again while open coverage gaps remain"
      ],
      id: "floor.visible_layer_upper_package_delta_lw_formula_routing_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts",
        "packages/engine/src/calculate-assembly.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CO; kept only to prevent reselecting stale high-ROI work.",
      runtimeAdmissibleNext: false,
      score: 0.5,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CP_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "frontend ergonomics can help users enter physical inputs",
        "it does not move engine scope or accuracy by itself and other agents are already working there"
      ],
      id: "frontend_ui_polish",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by the calculator advancement test for this turn.",
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
      candidateOrder: 7,
      expectedBeforeAfter: [
        "source rows remain useful as exact anchors and holdouts",
        "broad crawling alone does not improve formula routing for arbitrary layer combinations"
      ],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because the product goal is a formula-based calculator, not a catalog expansion sprint.",
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
      candidateOrder: 8,
      expectedBeforeAfter: [
        "confidence wording may describe uncertainty",
        "it cannot choose a better route or calculate a new acoustic output"
      ],
      id: "confidence_wording",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it does not increase scope or accuracy.",
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
  ] as const satisfies readonly PostV1GateCPCandidate[];
}

export function summarizePostV1GateCPNumericCoverageGap(): PostV1GateCPSummary {
  if (
    POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE
  ) {
    throw new Error("Gate CP can only land after Gate CO selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateCPNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate CP requires exactly one selected calculator candidate.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_CP_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_CP_PLAN_DOC_PATH,
    previousGateCO: {
      landedGate: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as "floor.common_floating_lower_treatment_published_anchor_gap",
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS
  };
}
