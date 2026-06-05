import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE,
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS
} from "./post-v1-floor-common-floating-lower-treatment-anchor-gate-cq";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_cr_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_cr_landed_no_runtime_selected_wall_common_auto_topology_second_pass_gate_cs" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION =
  "post_v1_wall_common_auto_topology_second_pass_gate_cs_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_LABEL =
  "post-V1 wall common auto-topology second pass Gate CS" as const;

export const POST_V1_GATE_CR_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_CR_SELECTED_TARGET_OUTPUTS = [
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

export const POST_V1_GATE_CR_NO_RUNTIME_COUNTERS = {
  candidateCount: 9,
  estimatedNextRuntimeCorrectedLayerTemplates: 5,
  estimatedNextRuntimeCorrectedRequestShapes: 25,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  wrongAliasOrFallbackBlocks: [
    "explicit flat_layer_order wall requests may be admitted only when safe segmentation and required support owners are present",
    "missing supportTopology, missing studSpacingMm, and missing resilientBarSideCount must remain needs_input",
    "ambiguous multicavity flat lists with explicit grouping uncertainty must stay blocked instead of guessing leaf/cavity ownership",
    "lab Rw/STC/C/Ctr must not alias into field or building R'w/Dn,w/DnT,w outputs",
    "ISO floor impact routes still do not publish ASTM IIC or AIIC aliases"
  ]
} as const;

export type PostV1GateCRCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
  | "floor.common_floating_lower_treatment_published_anchor_gap"
  | "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.common_auto_topology_second_pass_after_cj";

export type PostV1GateCRSliceKind =
  | "accuracy_holdout_intake"
  | "blocked_non_goal"
  | "closed_runtime_gap"
  | "metric_basis_input_surface"
  | "runtime_scope_expansion";

export type PostV1GateCRCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCRCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly runtimeAdmissibleNext: boolean;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCRSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateCRSummary = {
  readonly candidates: readonly PostV1GateCRCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_CR_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_CR_PLAN_DOC_PATH;
  readonly previousGateCQ: {
    readonly landedGate: typeof POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS;
  };
  readonly selectedCandidateId: "wall.common_auto_topology_second_pass_after_cj";
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS;
};

export function rankPostV1GateCRNumericCoverageCandidates(): readonly PostV1GateCRCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate CJ proved common flat double-leaf building requests can use the Gate S double-leaf/framed direct curve when support ownership is explicit",
        "the current implementation still blocks explicit flat_layer_order wall requests even when the layer sequence is safely segmentable and the same support/stud owners are present",
        "Gate CS can admit that explicit flat-entry subset through the existing wall formula owners while keeping ambiguous multicavity and missing-physical-input stops closed"
      ],
      id: "wall.common_auto_topology_second_pass_after_cj",
      implementationEvidencePaths: [
        "packages/engine/src/wall-flat-multicavity-auto-topology.ts",
        "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts",
        "packages/engine/src/calculate-assembly.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate CQ: it targets the user's layer-entered wall workflow directly, expands formula routing for common flat wall stacks, and does not require frontend work, source crawling, or confidence wording.",
      runtimeAdmissibleNext: true,
      score: 5.22,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CR_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate CQ opened the common floating lower-treatment Ln,w anchor and simple field companions",
        "direct/flanking field context for the same lower-treatment family may be useful",
        "Gate CH-style direct/flanking budgets should be audited before moving another field/building impact value"
      ],
      id: "floor.common_floating_lower_treatment_direct_flanking_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts",
        "packages/engine/src/impact-field-context.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Scope-relevant, but lower immediate ROI than wall flat-entry routing because the CQ simple field route just landed and direct/flanking impact values carry higher wrong-number risk.",
      runtimeAdmissibleNext: false,
      score: 4.28,
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
        "explicit ASTM impact band input would eventually let true IIC/AIIC owners calculate safely",
        "the runtime owner needs shared/API/workbench/report/replay input surfaces before user bands are trustworthy",
        "other agents are working frontend surfaces, so this engine-only turn should not select it"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid calculator work later, but lower ROI for this slice because it crosses shared/frontend input surfaces and does not improve ISO layer-formula routing now.",
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
        "Gate CL recorded wall residual ledgers for common double-leaf building and opening/leak adapters",
        "the ledgers cannot tighten without same-family calibration and same-basis holdouts",
        "selecting this now would become evidence intake rather than calculator runtime coverage"
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
      score: 3.08,
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
        "Gate CP selected common floating lower-treatment published anchors",
        "Gate CQ has now landed that runtime movement with pinned Ln,w and field companions",
        "closed work must not be reselected while open formula-routing gaps remain"
      ],
      id: "floor.common_floating_lower_treatment_published_anchor_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts",
        "packages/engine/src/calculate-assembly.ts"
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
      candidateOrder: 6,
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
      reason: "Closed by Gate CO; retained only to prevent reselecting stale high-ROI work.",
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
      candidateOrder: 7,
      expectedBeforeAfter: [
        "frontend polish can help users enter data",
        "it does not make the engine choose or execute a better acoustic formula by itself"
      ],
      id: "frontend_ui_polish",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by the calculator advancement test and by the user's request to avoid frontend work.",
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
      candidateOrder: 8,
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
      candidateOrder: 9,
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
  ] as const satisfies readonly PostV1GateCRCandidate[];
}

export function summarizePostV1GateCRNumericCoverageGap(): PostV1GateCRSummary {
  if (
    POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE
  ) {
    throw new Error("Gate CR can only land after Gate CQ selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateCRNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate CR requires exactly one selected calculator candidate.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_CR_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_CR_PLAN_DOC_PATH,
    previousGateCQ: {
      landedGate: POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as "wall.common_auto_topology_second_pass_after_cj",
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS
  };
}
