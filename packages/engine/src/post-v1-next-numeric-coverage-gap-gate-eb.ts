import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS,
  POST_V1_GATE_EA_COUNTERS
} from "./post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_eb_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_eb_landed_no_runtime_selected_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION =
  "post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-owner-gate-ec-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_LABEL =
  "post-V1 floor heavy-concrete combined resilient-channel lower-treatment owner Gate EC" as const;

export const POST_V1_GATE_EB_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_EB_SELECTED_CANDIDATE_ID =
  "floor.heavy_concrete_combined_resilient_channel_lower_treatment_owner_gap" as const;

export const POST_V1_GATE_EB_SELECTED_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EB_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "After Gate EA, exact/source-owned wall and CLT upper-package gaps were rechecked first. The remaining generated wall holdouts are either already runtime-capable with required topology inputs or correctly blocked by lab/field/building boundaries.",
    rejectedDirections: [
      "treating held-AAC without supportTopology as a runtime gap",
      "retuning wall values without a newly selected owner",
      "promoting nearby source rows as a catalog instead of a calculator route"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "Floor impact holdouts were then split by owner safety. Furring-channel, acoustic-hanger, and resilient-stud heavy-concrete combined lower treatments already calculate through the owned formula corridor, while visible resilient-channel stacks with the same upper/lower physical envelope still park Ln,w and DeltaLw behind the lower-assembly owner boundary. That makes a narrow Gate EC owner proof the highest-ROI safe next step.",
    rejectedDirections: [
      "subtracting open-web or hollow-core lower-treatment rows to manufacture DeltaLw",
      "aliasing ISO impact outputs into ASTM IIC or AIIC",
      "weakening loadBasisKgM2, resilientLayerDynamicStiffnessMNm3, or ceilingOrLowerAssembly needs_input guards"
    ]
  }
] as const;

export const POST_V1_GATE_EB_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedFollowingNewCalculableLayerTemplatesIfGateECProvesOwner: 1,
  estimatedFollowingNewCalculableRequestShapesIfGateECProvesOwner: 4,
  estimatedNextOwnerLedgers: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_EB_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateEBCandidateId =
  | typeof POST_V1_GATE_EB_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording_or_frontend_polish"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.explicit_impact_ci_low_frequency_surface_gap"
  | "floor.heavy_concrete_combined_furring_channel_runtime_already_live"
  | "floor.open_web_or_hollow_core_lower_treatment_delta_lw_boundary"
  | "floor.pliteq_or_knauf_same_source_delta_lw_lower_treatment_boundary"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.held_aac_board_fill_gap_multicavity_gap";

export type PostV1GateEBSliceKind =
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_wrong_metric_derivation"
  | "metric_basis_input_surface"
  | "residual_holdout_blocked"
  | "runtime_owner_contract";

export type PostV1GateEBCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateEBCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeBasis: boolean;
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateEBSliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateEBSummary = {
  readonly candidates: readonly PostV1GateEBCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EB_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EB_PLAN_DOC_PATH;
  readonly previousGateEA: {
    readonly counters: typeof POST_V1_GATE_EA_COUNTERS;
    readonly landedGate:
      typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_EB_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_EB_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS;
};

export function rankPostV1GateEBNumericCoverageCandidates(): readonly PostV1GateEBCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "visible heavy-concrete combined upper/lower stacks with resilient_channel lower support publish airborne Rw/Ctr but keep Ln,w and DeltaLw unsupported",
        "the same formula family is already live for furring_channel, acoustic_hanger_ceiling, and resilient_stud_ceiling when route-required physical inputs are present",
        "Gate EC must prove whether resilient_channel owns a bounded lower-treatment mapping before any runtime value moves"
      ],
      id: POST_V1_GATE_EB_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts",
        "packages/engine/src/heavy-concrete-combined-impact-input-surface.ts",
        "packages/engine/src/impact-predictor-input.ts",
        "packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts",
        "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate EA: it targets a common visible layer-entry gap on an already owned heavy-concrete combined formula corridor, but keeps the next step safe by requiring a narrow owner proof for resilient-channel lower treatment instead of reopening the old low-confidence reinforced-concrete fallback.",
      score: 3.34,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE,
      sliceKind: "runtime_owner_contract",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EB_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "visible furring_channel heavy-concrete combined lower-treatment stacks already calculate Ln,w and DeltaLw",
        "acoustic_hanger_ceiling and resilient_stud_ceiling remain live from Gate BB",
        "selecting this would duplicate existing runtime coverage"
      ],
      id: "floor.heavy_concrete_combined_furring_channel_runtime_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts",
        "packages/engine/src/impact-predictor-input.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable on the same formula corridor.",
      score: 2.26,
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
      candidateOrder: 3,
      expectedBeforeAfter: [
        "ASTM IIC/AIIC exact one-third-octave routes already calculate when ASTM E492/E1007 bands are supplied",
        "ISO Ln,w, L'nT,w, or DeltaLw cannot be converted into ASTM ratings",
        "user-supplied ASTM band intake is broader API/input-surface work rather than the next engine formula-routing move"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Important later, but lower ROI than a bounded engine-only formula owner proof.",
      score: 1.92,
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
      candidateOrder: 4,
      expectedBeforeAfter: [
        "explicit CI and CI,50-2500 fields already unlock low-frequency impact companions on routes that own field impact outputs",
        "missing CI fields are route-required context, not a reason to infer a value",
        "this is mostly input-surface prompting, not a new layer-combination calculation route"
      ],
      id: "floor.explicit_impact_ci_low_frequency_surface_gap",
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable when route-required impactFieldContext exists.",
      score: 1.56,
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
      candidateOrder: 5,
      expectedBeforeAfter: [
        "open-web and hollow-core lower-treatment rows often include both support and lower ceiling changes",
        "bare-minus-treated DeltaLw is unsafe unless the same upper-treatment owner and same-basis reference pair are selected",
        "promoting these rows now would cross metric-owner lanes"
      ],
      id: "floor.open_web_or_hollow_core_lower_treatment_delta_lw_boundary",
      implementationEvidencePaths: [
        "packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-rows.ts",
        "packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts",
        "packages/engine/src/floor-exact-companion-split-parity.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Rejected because it would derive the wrong metric from lower-treatment combined lanes.",
      score: 1.04,
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
        "Pliteq/Knauf-like same-source rows are useful evidence candidates only after a compatible owner lane is selected",
        "their lower support and board changes must not be overread as a generic upper package DeltaLw",
        "runtime promotion from proximity would weaken current metric-basis boundaries"
      ],
      id: "floor.pliteq_or_knauf_same_source_delta_lw_lower_treatment_boundary",
      implementationEvidencePaths: [
        "packages/engine/src/floor-exact-companion-split-parity.test.ts",
        "packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Rejected until a same-family metric owner is selected.",
      score: 0.9,
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
        "held-AAC and board-fill multicavity walls calculate only when topology owner inputs are explicit",
        "without supportTopology the route correctly stops as needs_input",
        "selecting it would hide a real physical topology requirement"
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
      score: 0.82,
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
        "opening/leak field and building routes already calculate through Gate CK",
        "same-family holdouts remain insufficient for budget tightening",
        "this does not add a supported layer-combination route now"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Blocked by insufficient holdout rows for defensible budget tightening.",
      score: 0.64,
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
      candidateOrder: 10,
      expectedBeforeAfter: [
        "confidence wording or frontend polish does not improve formula selection, metric ownership, or numeric accuracy"
      ],
      id: "confidence_wording_or_frontend_polish",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by drift guard and separated from frontend agents' work.",
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

export function summarizePostV1GateEBNumericCoverageGap(): PostV1GateEBSummary {
  if (
    POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE
  ) {
    throw new Error("Gate EB can only land after Gate EA selects the Gate EB numeric coverage rerank.");
  }

  return {
    candidates: rankPostV1GateEBNumericCoverageCandidates(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EB_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EB_PLAN_DOC_PATH,
    previousGateEA: {
      counters: POST_V1_GATE_EA_COUNTERS,
      landedGate: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS
    },
    roiAnalysisIterations: POST_V1_GATE_EB_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_EB_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS
  };
}
