import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_LANDED_GATE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS,
  POST_V1_GATE_ED_COUNTERS
} from "./post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ee_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ee_landed_no_runtime_selected_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION =
  "post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_LABEL =
  "post-V1 floor composite-panel suspended-ceiling-only route boundary Gate EF" as const;

export const POST_V1_GATE_EE_SELECTED_CANDIDATE_ID =
  "floor.composite_panel_suspended_ceiling_only_route_boundary" as const;

export const POST_V1_GATE_EE_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EE_EF_COMPOSITE_PANEL_SUSPENDED_CEILING_ROUTE_PLAN_2026-06-07.md" as const;

export const POST_V1_GATE_EE_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EE_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "After Gate ED, the resolved heavy-concrete resilient-channel gap is closed; remaining EB candidates are mostly input-surface work, already-live needs-input boundaries, holdout-budget work without sufficient holdouts, or wrong-metric DeltaLw derivations.",
    rejectedDirections: [
      "starting ASTM IIC/AIIC user-band intake before a higher-ROI engine-only route boundary is settled",
      "treating held-AAC missing supportTopology as a runtime gap",
      "promoting open-web, hollow-core, Pliteq, or Knauf lower-treatment rows as generic DeltaLw"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The strongest calculator-scope/accuracy signal is the composite-panel suspended-ceiling-only visible route: Gate CY already owns the PMC published-interaction family for suspended ceiling-only profiles, while a legacy layer-driven parity row still expected low-confidence. Gate EF must reconcile that boundary before runtime work continues.",
    rejectedDirections: [
      "calling the mismatch a frontend issue",
      "importing more composite source rows before the existing owner boundary is reconciled",
      "retuning composite numeric values without first pinning whether the current published-interaction route is the correct owner"
    ]
  }
] as const;

export const POST_V1_GATE_EE_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedNextAccuracyBoundaryLedgers: 1,
  estimatedNextRuntimeCorrectedLayerTemplates: 1,
  estimatedNextRuntimeCorrectedRequestShapes: 3,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_EE_ROI_ANALYSIS_ITERATIONS.length,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateEECandidateId =
  | typeof POST_V1_GATE_EE_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording_or_frontend_polish"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.explicit_impact_ci_low_frequency_surface_gap"
  | "floor.heavy_concrete_resilient_channel_gap_closed_by_ed"
  | "floor.open_web_or_hollow_core_lower_treatment_delta_lw_boundary"
  | "floor.pliteq_or_knauf_same_source_delta_lw_lower_treatment_boundary"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.held_aac_board_fill_gap_multicavity_gap";

export type PostV1GateEESliceKind =
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_wrong_metric_derivation"
  | "input_surface_deferred"
  | "residual_holdout_blocked"
  | "runtime_route_boundary";

export type PostV1GateEECandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateEECandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateEESliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateEESummary = {
  readonly candidates: readonly PostV1GateEECandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EE_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EE_PLAN_DOC_PATH;
  readonly previousGateED: {
    readonly counters: typeof POST_V1_GATE_ED_COUNTERS;
    readonly landedGate:
      typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_EE_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_EE_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS;
};

export function rankPostV1GateEENumericCoverageCandidates(): readonly PostV1GateEECandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate CY already owns the composite-panel published-interaction family for dry, suspended-ceiling-only, and combined profiles",
        "a visible composite suspended-ceiling-only layer stack now resolves to predictor_composite_panel_published_interaction_estimate while an older parity row still expects low-confidence",
        "Gate EF must decide and pin whether that visible route is the correct owner or whether a guard must restore the conservative boundary"
      ],
      id: POST_V1_GATE_EE_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/composite-panel-published-interaction-estimate.ts",
        "packages/engine/src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts",
        "packages/engine/src/impact-layer-stack-driven.test.ts",
        "packages/catalogs/src/floor-systems/exact-floor-systems.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate ED: it is an engine-only route ownership discrepancy on an already formula-owned composite family. Resolving it either prevents wrong-route calculation or officially pins a broader visible layer path for Rw, Ln,w, and DeltaLw.",
      score: 3.18,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE,
      sliceKind: "runtime_route_boundary",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EE_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "ASTM IIC/AIIC exact one-third-octave routes already calculate when ASTM E492/E1007 bands are supplied",
        "broader user-band intake needs API/workbench/report/replay surface work",
        "it should remain queued behind the engine-only composite route boundary"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Useful later, but not the highest ROI engine-only calculator slice.",
      score: 1.88,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "input_surface_deferred",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: true
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "CI and CI,50-2500 companions calculate when explicit impactFieldContext owns the required fields",
        "missing CI context remains needs_input",
        "no formula-route owner changes are needed now"
      ],
      id: "floor.explicit_impact_ci_low_frequency_surface_gap",
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable with required context.",
      score: 1.35,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["CI", "CI,50-2500", "L'nT,50"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate ED closed the visible heavy-concrete resilient_channel lower-treatment gap",
        "complete stacks now calculate Ln,w 44.6 and DeltaLw 29.9",
        "selecting it again would duplicate a closed runtime slice"
      ],
      id: "floor.heavy_concrete_resilient_channel_gap_closed_by_ed",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate ED.",
      score: 1.1,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "open-web and hollow-core lower-treatment rows mix carrier, support, and lower ceiling changes",
        "bare-minus-treated DeltaLw would cross metric-owner lanes",
        "the boundary remains intentionally rejected"
      ],
      id: "floor.open_web_or_hollow_core_lower_treatment_delta_lw_boundary",
      implementationEvidencePaths: [
        "packages/engine/src/floor-exact-companion-split-parity.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Wrong metric derivation.",
      score: 0.92,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_wrong_metric_derivation",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["DeltaLw"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "Pliteq/Knauf same-source rows can be evidence candidates only after a compatible same-family owner is selected",
        "their lower-treatment changes are not generic upper package DeltaLw",
        "no runtime promotion should occur from source proximity"
      ],
      id: "floor.pliteq_or_knauf_same_source_delta_lw_lower_treatment_boundary",
      implementationEvidencePaths: [
        "packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Wrong metric derivation until a same-family owner is named.",
      score: 0.81,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_wrong_metric_derivation",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["DeltaLw"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "held-AAC and board-fill multicavity walls already calculate when topology owner inputs are explicit",
        "without supportTopology the stop is a correct needs_input boundary",
        "selecting it would weaken route-required input honesty"
      ],
      id: "wall.held_aac_board_fill_gap_multicavity_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dl-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable with required topology inputs.",
      score: 0.75,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "opening/leak routes already calculate through Gate CK",
        "holdout rows remain insufficient for defensible budget tightening",
        "no new layer-combination route is opened by selecting this now"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Blocked by insufficient same-family holdouts.",
      score: 0.62,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "residual_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["R'w", "DnT,w"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: ["source crawling alone does not select or validate a route owner"],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by calculator source of truth.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: [],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: ["confidence wording or frontend polish does not improve formula routing or numeric accuracy"],
      id: "confidence_wording_or_frontend_polish",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by drift guard.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [],
      touchesFrontendImplementation: true,
      touchesSharedOrApiSurface: false
    }
  ];
}

export function summarizePostV1GateEENumericCoverageGap(): PostV1GateEESummary {
  if (
    POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_LANDED_GATE
  ) {
    throw new Error("Gate EE can only land after Gate ED selects the Gate EE numeric coverage rerank.");
  }

  return {
    candidates: rankPostV1GateEENumericCoverageCandidates(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EE_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EE_PLAN_DOC_PATH,
    previousGateED: {
      counters: POST_V1_GATE_ED_COUNTERS,
      landedGate:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_LANDED_GATE,
      selectedNextAction:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE,
      selectionStatus:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS
    },
    roiAnalysisIterations: POST_V1_GATE_EE_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_EE_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS
  };
}
