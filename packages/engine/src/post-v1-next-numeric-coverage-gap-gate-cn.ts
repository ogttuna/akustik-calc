import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE,
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION,
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE,
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS
} from "./post-v1-required-physical-input-surface-parity-gate-cm";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_cn_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_cn_landed_no_runtime_selected_floor_visible_layer_upper_package_delta_lw_gate_co" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION =
  "post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_LABEL =
  "post-V1 floor visible-layer upper-package DeltaLw Gate CO" as const;

export const POST_V1_GATE_CN_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_CN_SELECTED_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CN_NO_RUNTIME_COUNTERS = {
  candidateCount: 7,
  estimatedNextNewCalculableLayerTemplates: 2,
  estimatedNextNewCalculableRequestShapes: 10,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  wrongAliasOrFallbackBlocks: [
    "visible CLT and timber upper-package DeltaLw must route to the existing timber/CLT formula owner instead of remaining hidden behind Ln,w-only exact/predicted anchors",
    "exact or predicted Ln,w anchors must stay first for Ln,w while DeltaLw is published only by its own metric owner",
    "layer-derived ISO DeltaLw must not publish ASTM IIC or AIIC aliases",
    "missing load basis, missing dynamic stiffness, or missing lower assembly must remain needs_input"
  ]
} as const;

export type PostV1GateCNCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.common_auto_topology_second_pass_after_cj";

export type PostV1GateCNSliceKind =
  | "accuracy_holdout_intake"
  | "blocked_non_goal"
  | "blocked_surface_program"
  | "metric_basis_input_surface"
  | "runtime_scope_expansion";

export type PostV1GateCNCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCNCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly runtimeAdmissibleNext: boolean;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCNSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateCNSummary = {
  readonly candidates: readonly PostV1GateCNCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_CN_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_CN_PLAN_DOC_PATH;
  readonly previousGateCM: {
    readonly landedGate: typeof POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS;
  };
  readonly selectedCandidateId: "floor.visible_layer_upper_package_delta_lw_formula_routing_gap";
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS;
};

export function rankPostV1GateCNNumericCoverageCandidates(): readonly PostV1GateCNCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate K already owns timber joist and mass-timber CLT DeltaLw when explicit impactPredictorInput is supplied",
        "visible tagged CLT and timber upper-package layer stacks with the same physical inputs still publish Ln,w only",
        "Gate CO can route layer-entered upper packages to the existing DeltaLw metric owner while preserving exact/predicted Ln,w precedence"
      ],
      id: "floor.visible_layer_upper_package_delta_lw_formula_routing_gap",
      implementationEvidencePaths: [
        "packages/engine/src/impact-predictor-input.ts",
        "packages/engine/src/timber-clt-floor-impact-delta-lw-runtime-corridor.ts",
        "packages/engine/src/post-v1-floor-timber-clt-delta-lw-resolver-gate-k-contract.test.ts",
        "packages/engine/src/calculate-assembly.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI for the user's goal: it makes layer-entered, physically explicit floor packages use the correct existing formula owner instead of acting like a finite source row catalog.",
      runtimeAdmissibleNext: true,
      score: 5.18,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CN_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate CJ/CK just moved the common flat wall and opening/leak routes",
        "another wall pass is useful only after a specific still-blocked topology family is isolated",
        "current wall residual ledgers still need same-basis holdouts before budget tightening"
      ],
      id: "wall.common_auto_topology_second_pass_after_cj",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Useful later, but the immediate wall high-ROI corridor has just landed and the next known gap is less concrete than the visible floor DeltaLw routing gap.",
      runtimeAdmissibleNext: false,
      score: 4.12,
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
        "opening/leak and common wall routes have residual ledgers",
        "Gate CL proved budgets cannot tighten without same-family calibration and same-basis holdouts",
        "selecting it now risks turning into source collection instead of calculator runtime scope"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant, but not the highest immediate ROI because the required holdouts are not ready and no runtime route would move next.",
      runtimeAdmissibleNext: false,
      score: 3.48,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "explicit user ASTM impact bands could expand IIC/AIIC safely",
        "that requires API/workbench/report/replay input surfaces",
        "the current engine slice should not interfere with frontend agents"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid later as a metric-basis input program, but it is not the highest ROI engine-only formula-routing move now.",
      runtimeAdmissibleNext: false,
      score: 3.26,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_input_surface",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendOrSharedSurface: true
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "frontend ergonomics could help users enter physical inputs",
        "other agents are working there and this does not move engine scope by itself"
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
      candidateOrder: 6,
      expectedBeforeAfter: [
        "source rows are useful as exact answers, anchors, calibration rows, and holdouts",
        "broad crawling alone does not route layer combinations to formulas"
      ],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because the user goal is formula-based calculator coverage, not catalog growth.",
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
      candidateOrder: 7,
      expectedBeforeAfter: [
        "confidence wording may describe uncertainty",
        "it cannot choose or execute the correct acoustic formula"
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
  ] as const satisfies readonly PostV1GateCNCandidate[];
}

export function summarizePostV1GateCNNumericCoverageGap(): PostV1GateCNSummary {
  if (
    POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE
  ) {
    throw new Error("Gate CN can only land after Gate CM selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateCNNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate CN requires exactly one selected calculator candidate.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_CN_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_CN_PLAN_DOC_PATH,
    previousGateCM: {
      landedGate: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE,
      selectedNextAction: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as "floor.visible_layer_upper_package_delta_lw_formula_routing_gap",
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS
  };
}
