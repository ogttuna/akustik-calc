import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_DX_COUNTERS,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS
} from "./post-v1-wall-exact-source-field-context-basis-gate-dx";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_dy_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_dy_landed_no_runtime_selected_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION =
  "post_v1_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-owner-gate-dz-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_LABEL =
  "post-V1 floor mass-timber CLT upper-package DeltaLw owner Gate DZ" as const;

export const POST_V1_GATE_DY_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DY_SELECTED_CANDIDATE_ID =
  "floor.mass_timber_clt_upper_package_delta_lw_owner_gap" as const;

export const POST_V1_GATE_DY_SELECTED_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DY_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "After Gate DX, generated wall families were rechecked first. Masonry and LSF field-context basis selection is closed, timber-stud and CLT wall field requests already use their own owners, and held-AAC remains a correct supportTopology needs_input boundary.",
    rejectedDirections: [
      "treating held-AAC without supportTopology as a runtime gap",
      "retuning wall values without new source/calibration evidence",
      "source crawling without a selected metric owner"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "Generated floor holdouts were rechecked next. Explicit CI and CI,50-2500 already calculate when impactFieldContext supplies the required fields, while broad bare-minus-treated DeltaLw derivation would cross floor-family lanes. The highest-ROI safe move is a narrow Gate DZ owner contract for mass-timber CLT upper-package DeltaLw.",
    rejectedDirections: [
      "deriving DeltaLw by subtracting unrelated open-box/open-web or lower-treatment rows",
      "using a CLT Ln,w exact row as DeltaLw without a same-family reference owner",
      "aliasing ISO impact outputs into ASTM IIC or AIIC"
    ]
  }
] as const;

export const POST_V1_GATE_DY_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedFollowingNewCalculableLayerTemplatesIfGateDZProvesOwner: 2,
  estimatedFollowingNewCalculableRequestShapesIfGateDZProvesOwner: 2,
  estimatedNextOwnerLedgers: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_DY_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeValuesMoved: 0
} as const;

export type PostV1GateDYCandidateId =
  | typeof POST_V1_GATE_DY_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.explicit_impact_ci_low_frequency_surface_gap"
  | "floor.open_box_or_open_web_delta_lw_subtraction_guess"
  | "floor.steel_surface_absent_delta_lw_family_guess"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.held_aac_board_fill_gap_multicavity_gap";

export type PostV1GateDYSliceKind =
  | "accuracy_owner_contract"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_without_owner_inputs"
  | "blocked_wrong_metric_derivation"
  | "metric_basis_input_surface"
  | "residual_holdout_blocked";

export type PostV1GateDYCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDYCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeBasis: boolean;
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDYSliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateDYSummary = {
  readonly candidates: readonly PostV1GateDYCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DY_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DY_PLAN_DOC_PATH;
  readonly previousGateDX: {
    readonly counters: typeof POST_V1_GATE_DX_COUNTERS;
    readonly landedGate: typeof POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_DY_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_DY_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS;
};

export function rankPostV1GateDYNumericCoverageCandidates(): readonly PostV1GateDYCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "floor-tuas-clt-exact and floor-tuas-clt-260-exact publish exact Ln,w but keep DeltaLw unsupported",
        "the existing mass-timber CLT DeltaLw formula corridor needs load basis and resilient dynamic stiffness, and its error budget explicitly says the CLT Ln,w anchor is not itself a DeltaLw owner",
        "Gate DZ must prove a bounded same-family upper-package DeltaLw owner before any runtime value moves"
      ],
      id: POST_V1_GATE_DY_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/timber-clt-floor-impact-delta-lw-runtime-corridor.ts",
        "packages/engine/src/tuas-clt-backlog-decision-contract.test.ts",
        "packages/engine/src/tuas-candidate-backlog-contract.test.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DX: it targets a real unsupported DeltaLw metric on common visible mass-timber CLT exact/upper-package rows, but first keeps the work safe by requiring a narrow owner proof instead of subtracting unrelated floor families or weakening missing-input guards.",
      score: 3.28,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_owner_contract",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_DY_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "impactFieldContext.ciDb and ci50_2500Db already unlock CI, CI,50-2500, Ln,w+CI, and L'nT,50 when the route owns impact outputs",
        "missing CI fields are required physical/context inputs, not a reason to infer low-frequency terms",
        "choosing this now would mostly be input-surface prompting, not engine formula routing"
      ],
      id: "floor.explicit_impact_ci_low_frequency_surface_gap",
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable with explicit route-required context fields.",
      score: 2.1,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["CI", "CI,50-2500", "Ln,w+CI", "L'nT,50"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "held-AAC / board-fill multicavity walls calculate when supportTopology and grouped support details are explicit",
        "without supportTopology the route correctly stops as needs_input",
        "selecting it would reduce calculation correctness by hiding a real topology requirement"
      ],
      id: "wall.held_aac_board_fill_gap_multicavity_gap",
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-calculator-topology-normalizer.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dl-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable when required topology input is present.",
      score: 1.58,
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
      candidateOrder: 4,
      expectedBeforeAfter: [
        "open-box/open-web raw-bare, finished package, lower-treatment, and combined rows are intentionally separate owner lanes",
        "DeltaLw = bare minus treated is only safe when the same-family reference and treated metric owner are selected",
        "a broad subtraction helper would create plausible-looking but physically weak answers"
      ],
      id: "floor.open_box_or_open_web_delta_lw_subtraction_guess",
      implementationEvidencePaths: [
        "packages/engine/src/impact-estimate.ts",
        "packages/engine/src/tuas-clt-backlog-decision-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Rejected because it crosses floor-family owner lanes instead of choosing the right formula.",
      score: 1.02,
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
      candidateOrder: 5,
      expectedBeforeAfter: [
        "surface-absent steel/open-web rows still lack steel support form, carrier geometry, load basis, dynamic stiffness, and lower support owner fields",
        "promoting DeltaLw from nearby family rows would invent physical inputs",
        "existing needs_input / unsupported boundaries remain correct"
      ],
      id: "floor.steel_surface_absent_delta_lw_family_guess",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts",
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Blocked until route owner inputs are present.",
      score: 0.96,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_owner_inputs",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["DeltaLw"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "ASTM IIC/AIIC remains owned by ASTM E492/E1007 band inputs",
        "ISO Ln,w, L'nT,w, or DeltaLw cannot be aliased to ASTM metrics",
        "this is a broader API/workbench/report surface slice, not the highest engine-only ROI"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: ["packages/engine/src/impact-astm-e989.ts"],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Important later but lower ROI than a contained engine owner proof.",
      score: 0.88,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_input_surface",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: true
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "opening/leak field/building routes already calculate through Gate CK",
        "same-family holdout evidence is still insufficient to tighten budgets",
        "this would not add supported layer combinations right now"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Blocked by insufficient holdout rows for a defensible budget tightening.",
      score: 0.72,
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
      candidateOrder: 8,
      expectedBeforeAfter: ["source crawling alone does not choose a route owner or calculate a new metric"],
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
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: [],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: ["confidence wording does not improve formula selection, metric ownership, or numeric accuracy"],
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
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: ["frontend polish does not change what layer combinations calculate"],
      id: "frontend_ui_polish",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Other agents may work frontend; this calculator slice does not touch it.",
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

export function summarizePostV1GateDYNumericCoverageGap(): PostV1GateDYSummary {
  if (
    POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE
  ) {
    throw new Error("Gate DY can only land after Gate DX selects the Gate DY numeric coverage rerank.");
  }

  return {
    candidates: rankPostV1GateDYNumericCoverageCandidates(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DY_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DY_PLAN_DOC_PATH,
    previousGateDX: {
      counters: POST_V1_GATE_DX_COUNTERS,
      landedGate: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS
    },
    roiAnalysisIterations: POST_V1_GATE_DY_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_DY_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS
  };
}
