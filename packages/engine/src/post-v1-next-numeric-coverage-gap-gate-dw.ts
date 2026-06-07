import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS
} from "./post-v1-wall-lsf-exact-source-mixed-metric-companion-gate-dv";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_dw_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_dw_landed_no_runtime_selected_wall_exact_source_field_context_basis_gate_dx" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION =
  "post_v1_wall_exact_source_field_context_basis_gate_dx_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-exact-source-field-context-basis-gate-dx-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_LABEL =
  "post-V1 wall exact-source family field-context basis Gate DX" as const;

export const POST_V1_GATE_DW_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DW_SELECTED_CANDIDATE_ID =
  "wall.exact_source_family_field_context_basis_gap" as const;

export const POST_V1_GATE_DW_SELECTED_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DW_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "After Gate DV, live generated wall/floor cases were rechecked for true engine-only scope or accuracy movement. Bound-only impact CI, steel DeltaLw, and held-AAC multicavity routes were either already runtime-capable with explicit inputs or correctly needs_input.",
    rejectedDirections: [
      "broad source crawling",
      "finite source scenario packs",
      "frontend/workbench polish",
      "ASTM IIC/AIIC aliases from ISO impact routes"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The highest-ROI remaining engine slice is a wall field-basis repair: generated masonry and LSF exact-source families already calculate field outputs, but the resolver still selects generic screening instead of the calculated family field-context owner.",
    rejectedDirections: [
      "retuning masonry or LSF numeric values",
      "relabeling lab Rw as R'w/Dn,w/DnT,w",
      "overriding explicit lab-anchor field deltas when airtightness is supplied"
    ]
  }
] as const;

export const POST_V1_GATE_DW_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedNextNewCalculableLayerTemplates: 0,
  estimatedNextNewCalculableRequestShapes: 0,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeCorrectedLayerTemplates: 2,
  estimatedNextRuntimeCorrectedRequestShapes: 8,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_DW_ROI_ANALYSIS_ITERATIONS.length,
  runtimeValuesMoved: 0
} as const;

export type PostV1GateDWCandidateId =
  | typeof POST_V1_GATE_DW_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.impact_explicit_ci_surface_gap"
  | "floor.steel_surface_absent_delta_lw_family_guess"
  | "frontend_ui_polish"
  | "wall.held_aac_board_fill_gap_multicavity_gap"
  | "wall.lsf_exact_lab_anchor_field_airtightness_input_gap"
  | "wall.timber_stud_field_context_basis_followup";

export type PostV1GateDWSliceKind =
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_without_owner_inputs"
  | "metric_basis_input_surface"
  | "runtime_basis_accuracy_repair";

export type PostV1GateDWCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDWCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeBasis: boolean;
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDWSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateDWSummary = {
  readonly candidates: readonly PostV1GateDWCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DW_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DW_PLAN_DOC_PATH;
  readonly previousGateDV: {
    readonly landedGate: typeof POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_DW_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_DW_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS;
};

export function rankPostV1GateDWNumericCoverageCandidates(): readonly PostV1GateDWCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "wall-masonry-brick field publishes R'w 40 / Dn,w 40 / DnT,w 42 / DnT,A 41.3 but selects screening_fallback",
        "wall-lsf-knauf field publishes R'w 51 / Dn,w 51 / DnT,w 52 / DnT,A 51.1 but selects screening_fallback",
        "Gate DX can keep those pins and select a calculated family field-context basis instead of generic screening"
      ],
      id: POST_V1_GATE_DW_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts",
        "packages/engine/src/post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt-contract.test.ts",
        "packages/engine/src/post-v1-wall-lsf-exact-source-mixed-metric-companion-gate-dv-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: true,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DV: two common generated exact-source wall families already have calculated field outputs, but answer-engine ownership is still generic screening. Fixing the selected basis improves formula-route accuracy without retuning or aliasing lab Rw.",
      score: 3.36,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE,
      sliceKind: "runtime_basis_accuracy_repair",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DW_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "LSF field lab-anchor delta already calculates when airtightness is explicit",
        "missing airtightness is an input-surface or UX prompt issue, not a higher-ROI engine formula gap",
        "Gate DX must preserve the explicit anchor route rather than replace it"
      ],
      id: "wall.lsf_exact_lab_anchor_field_airtightness_input_gap",
      implementationEvidencePaths: [
        "packages/engine/src/airborne-verified-catalog.ts",
        "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Valid later as input-surface polish, but the runtime is already capable with the required physical input.",
      score: 2.18,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DW_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: true
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "held AAC / board-fill multicavity requests calculate when supportTopology and grouped topology are explicit",
        "without those fields the route correctly remains needs_input",
        "selecting it now would weaken a required physical-input boundary"
      ],
      id: "wall.held_aac_board_fill_gap_multicavity_gap",
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-calculator-topology-normalizer.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dl-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Not a true runtime gap; complete physical inputs already unlock it.",
      score: 1.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DW_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "explicit impactFieldContext.ciDb already lets Ln,w+CI calculate when the owner exists",
        "missing CI is an exact missing input, not permission to infer a spectrum adapter",
        "no new engine scope is unlocked by selecting it here"
      ],
      id: "floor.impact_explicit_ci_surface_gap",
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dw-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable with explicit CI context.",
      score: 1.5,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Ln,w+CI"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "surface-absent steel/open-web rows lack steel support form, carrier geometry, load basis, dynamic stiffness, and lower support owner fields",
        "promoting DeltaLw from nearby family rows would invent physical inputs",
        "Gate DI/DK correctly keep the surface-absent route blocked"
      ],
      id: "floor.steel_surface_absent_delta_lw_family_guess",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts",
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Blocked until owner inputs are present; guessing would reduce accuracy.",
      score: 1.06,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_owner_inputs",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["DeltaLw"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "timber-stud field context already selects Gate I over Gate DN",
        "additional work would be a documentation or residual-ledger follow-up",
        "no runtime basis or value movement is available here"
      ],
      id: "wall.timber_stud_field_context_basis_followup",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already selects a family field-context owner.",
      score: 0.92,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DW_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "ASTM IIC/AIIC remains a separate ASTM E492/E1007 band owner",
        "ISO Ln,w or DeltaLw must not alias into IIC/AIIC",
        "this is lower ROI than the engine-only wall field-basis repair"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: ["packages/engine/src/impact-astm-e989.ts"],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Important later, but wider API/workbench surface and no ISO alias allowed.",
      score: 0.88,
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
      candidateOrder: 8,
      expectedBeforeAfter: ["source crawling alone does not choose a formula or move a supported output"],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by calculator source of truth.",
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
      expectedBeforeAfter: ["confidence copy does not improve formula selection, scope, or numeric correctness"],
      id: "confidence_wording",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by drift guard.",
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
      expectedBeforeAfter: ["frontend polish is outside this engine-only calculator slice"],
      id: "frontend_ui_polish",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Other agents may own frontend; this slice must stay engine-only.",
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
  ];
}

export function summarizePostV1GateDWNumericCoverageGap(): PostV1GateDWSummary {
  if (
    POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_LANDED_GATE
  ) {
    throw new Error("Gate DW can only land after Gate DV selects the next numeric coverage gap.");
  }

  return {
    candidates: rankPostV1GateDWNumericCoverageCandidates(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DW_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DW_PLAN_DOC_PATH,
    previousGateDV: {
      landedGate: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS
    },
    roiAnalysisIterations: POST_V1_GATE_DW_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_DW_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS
  };
}
