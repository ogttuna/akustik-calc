import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_CJ_BUILDING_VALUE_PINS
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";
import {
  POST_V1_GATE_CK_VALUE_PINS,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS
} from "./post-v1-opening-leak-composite-wall-adapters-gate-ck";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_cl_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_cl_landed_no_runtime_selected_required_physical_input_surface_parity_gate_cm" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION =
  "post_v1_required_physical_input_surface_parity_gate_cm_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-required-physical-input-surface-parity-gate-cm-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_LABEL =
  "post-V1 required physical input surface parity Gate CM" as const;

export const POST_V1_GATE_CL_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_CL_NO_RUNTIME_COUNTERS = {
  budgetsHeldWide: 5,
  budgetsTightened: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  residualLedgers: 5,
  runtimePromotionsFromSourceProximity: 0,
  sourceProximityRowsRejected: 4,
  wrongAliasOrFallbackBlocks: [
    "source-proximate rows cannot tighten a source-absent budget without a same-family calibration row and same-basis holdout",
    "lab Rw/STC rows cannot prove field or building R'w/DnT,w budgets",
    "packaged floor source rows cannot promote raw-bare open-box/open-web runtime",
    "opening/leak lab anchors cannot tighten field/building adapters without field/building holdouts"
  ]
} as const;

export type PostV1GateCLResidualLedgerId =
  | "floor.heavy_floating_upper_treatment.field_companion_gate_ch"
  | "floor.open_box_timber.raw_bare_lab_impact"
  | "floor.open_web_steel.raw_bare_lab_impact"
  | "wall.common_flat_double_leaf.building_prediction_gate_cj"
  | "wall.opening_leak_composite.field_building_gate_ck";

export type PostV1GateCLBudgetDecision = "hold_wide_budget" | "tighten_budget";

export type PostV1GateCLResidualLedger = {
  readonly blockers: readonly string[];
  readonly budgetDecision: PostV1GateCLBudgetDecision;
  readonly budgetTighteningAdmitted: boolean;
  readonly calibrationRowIds: readonly string[];
  readonly currentErrorBudgetDb: number;
  readonly evidencePaths: readonly string[];
  readonly family: string;
  readonly holdoutRowIds: readonly string[];
  readonly id: PostV1GateCLResidualLedgerId;
  readonly metricBasis: string;
  readonly metrics: readonly RequestedOutputId[];
  readonly noRuntimeValueMovement: true;
  readonly observedMaeDb: number | null;
  readonly pairedNegativeRowIds: readonly string[];
  readonly route: "floor" | "wall";
  readonly runtimePromotionAdmitted: boolean;
  readonly sourceProximityRowsPresent: boolean;
  readonly targetMaeThresholdDb: number;
};

export type PostV1GateCLCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "floor_raw_bare_and_floating_holdout_acquisition"
  | "opening_leak_and_common_wall_holdout_acquisition"
  | "required_physical_input_surface_parity_after_residual_ledgers"
  | "source_absent_budget_tightening_without_holdouts";

export type PostV1GateCLSliceKind =
  | "accuracy_holdout_intake"
  | "blocked_non_goal"
  | "blocked_wrong_number_risk"
  | "input_surface_unlock";

export type PostV1GateCLCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCLCandidateId;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly residualBudgetRiskReduction: number;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCLSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
};

export type PostV1GateCLSummary = {
  readonly frozenRuntimePins: {
    readonly gateCJBuildingValuePins: typeof POST_V1_GATE_CJ_BUILDING_VALUE_PINS;
    readonly gateCKOpeningLeakValuePins: typeof POST_V1_GATE_CK_VALUE_PINS;
  };
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_CL_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_CL_PLAN_DOC_PATH;
  readonly previousGateCK: {
    readonly landedGate: typeof POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS;
  };
  readonly residualLedgers: readonly PostV1GateCLResidualLedger[];
  readonly selectedCandidateId: "required_physical_input_surface_parity_after_residual_ledgers";
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateCLCandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS;
};

const WALL_FIELD_BUILDING_METRICS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const FLOOR_LAB_IMPACT_METRICS = [
  "Ln,w",
  "DeltaLw",
  "CI",
  "CI,50-2500",
  "Ln,w+CI"
] as const satisfies readonly RequestedOutputId[];

const FLOOR_FIELD_IMPACT_METRICS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export function evaluatePostV1GateCLResidualLedgers(): readonly PostV1GateCLResidualLedger[] {
  return [
    {
      blockers: [
        "building_prediction holdout rows are not source-owned for the Gate CJ adapter basis",
        "lab/field double-leaf source evidence cannot tighten building R'w/DnT,w without same-basis holdouts"
      ],
      budgetDecision: "hold_wide_budget",
      budgetTighteningAdmitted: false,
      calibrationRowIds: ["knauf_w111_w112_lab_field_family_evidence"],
      currentErrorBudgetDb: 10,
      evidencePaths: [
        "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts",
        "packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts"
      ],
      family: "common flat double-leaf wall",
      holdoutRowIds: [],
      id: "wall.common_flat_double_leaf.building_prediction_gate_cj",
      metricBasis: "building_prediction",
      metrics: WALL_FIELD_BUILDING_METRICS,
      noRuntimeValueMovement: true,
      observedMaeDb: null,
      pairedNegativeRowIds: ["explicit_flat_layer_order_blocked", "missing_support_topology_blocked"],
      route: "wall",
      runtimePromotionAdmitted: false,
      sourceProximityRowsPresent: true,
      targetMaeThresholdDb: 3
    },
    {
      blockers: [
        "Gate S lab opening/leak anchor is not a field/building residual holdout",
        "field/building adapter budgets need source-owned room/flanking holdouts before tightening"
      ],
      budgetDecision: "hold_wide_budget",
      budgetTighteningAdmitted: false,
      calibrationRowIds: ["gate_s_opening_leak_composite_lab_anchor"],
      currentErrorBudgetDb: 10,
      evidencePaths: [
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts",
        "packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts"
      ],
      family: "opening/leak composite wall",
      holdoutRowIds: [],
      id: "wall.opening_leak_composite.field_building_gate_ck",
      metricBasis: "field_and_building_prediction",
      metrics: WALL_FIELD_BUILDING_METRICS,
      noRuntimeValueMovement: true,
      observedMaeDb: null,
      pairedNegativeRowIds: ["missing_frequency_band_set_blocked", "lab_rw_stc_alias_blocked"],
      route: "wall",
      runtimePromotionAdmitted: false,
      sourceProximityRowsPresent: true,
      targetMaeThresholdDb: 3
    },
    {
      blockers: [
        "near package-transfer rows are not raw-bare open-box holdouts",
        "same-stack source-owned raw-bare lab impact holdout count is below the tightening threshold"
      ],
      budgetDecision: "hold_wide_budget",
      budgetTighteningAdmitted: false,
      calibrationRowIds: [],
      currentErrorBudgetDb: 9,
      evidencePaths: [
        "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor.ts",
        "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts"
      ],
      family: "open-box timber raw-bare floor",
      holdoutRowIds: [],
      id: "floor.open_box_timber.raw_bare_lab_impact",
      metricBasis: "element_lab_impact",
      metrics: FLOOR_LAB_IMPACT_METRICS,
      noRuntimeValueMovement: true,
      observedMaeDb: null,
      pairedNegativeRowIds: ["package_transfer_row_not_raw_bare", "eps_screed_hybrid_row_not_raw_bare"],
      route: "floor",
      runtimePromotionAdmitted: false,
      sourceProximityRowsPresent: true,
      targetMaeThresholdDb: 5
    },
    {
      blockers: [
        "UBIQ packaged/support-band rows remain exact or anchor context, not raw-bare open-web holdouts",
        "raw-bare open-web lab impact budgets still include explicit holdout-absence terms"
      ],
      budgetDecision: "hold_wide_budget",
      budgetTighteningAdmitted: false,
      calibrationRowIds: [],
      currentErrorBudgetDb: 9,
      evidencePaths: [
        "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts",
        "packages/engine/src/open-web-raw-bare-estimate.ts"
      ],
      family: "open-web steel raw-bare floor",
      holdoutRowIds: [],
      id: "floor.open_web_steel.raw_bare_lab_impact",
      metricBasis: "element_lab_impact",
      metrics: FLOOR_LAB_IMPACT_METRICS,
      noRuntimeValueMovement: true,
      observedMaeDb: null,
      pairedNegativeRowIds: ["packaged_finish_row_not_raw_bare", "supported_band_row_not_raw_bare"],
      route: "floor",
      runtimePromotionAdmitted: false,
      sourceProximityRowsPresent: true,
      targetMaeThresholdDb: 5
    },
    {
      blockers: [
        "published upper-treatment anchor is not a direct+flanking field holdout set",
        "L'nT,50 remains tied to explicit ci50_2500Db and cannot be retuned from Ln,w alone"
      ],
      budgetDecision: "hold_wide_budget",
      budgetTighteningAdmitted: false,
      calibrationRowIds: ["published_upper_treatment_ln_w_anchor"],
      currentErrorBudgetDb: 8,
      evidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts",
        "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts"
      ],
      family: "heavy floating reinforced-concrete upper treatment",
      holdoutRowIds: [],
      id: "floor.heavy_floating_upper_treatment.field_companion_gate_ch",
      metricBasis: "field_impact_direct_flanking",
      metrics: FLOOR_FIELD_IMPACT_METRICS,
      noRuntimeValueMovement: true,
      observedMaeDb: null,
      pairedNegativeRowIds: ["missing_ci50_2500_blocks_only_lnt50", "astm_iic_aiic_alias_blocked"],
      route: "floor",
      runtimePromotionAdmitted: false,
      sourceProximityRowsPresent: false,
      targetMaeThresholdDb: 5
    }
  ] as const satisfies readonly PostV1GateCLResidualLedger[];
}

export function rankPostV1GateCLNumericCoverageCandidates(): readonly PostV1GateCLCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate CL proves several runtime routes are blocked from budget tightening until explicit physical inputs and residual evidence are owned",
        "Gate CM can make already-selected route inputs consistently visible across API/workbench/report/replay surfaces without moving formulas",
        "frontend-owned work must be coordinated, but the selected calculator reason is required-input parity, not UI polish"
      ],
      id: "required_physical_input_surface_parity_after_residual_ledgers",
      passesCalculatorAdvancementTest: true,
      reason:
        "Best next step after no-runtime residual ledgers: make route-required physical inputs consistently supplyable before another runtime expansion depends on them.",
      residualBudgetRiskReduction: 0.72,
      score: 4.2,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE,
      sliceKind: "input_surface_unlock",
      sourceRowsRequiredForSelection: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "opening/leak and common wall adapters need source-owned field/building holdouts before budget tightening",
        "runtime values stay frozen until same-basis holdouts exist"
      ],
      id: "opening_leak_and_common_wall_holdout_acquisition",
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant, but it needs source-owned same-basis rows and should not become broad source crawling.",
      residualBudgetRiskReduction: 0.68,
      score: 3.46,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "raw-bare and floating floor routes have explicit holdout blockers",
        "source-owned same-stack holdouts would allow later budget decisions without changing formulas today"
      ],
      id: "floor_raw_bare_and_floating_holdout_acquisition",
      passesCalculatorAdvancementTest: true,
      reason:
        "Useful accuracy work, but current ledgers show no immediate budget tightening is defensible.",
      residualBudgetRiskReduction: 0.64,
      score: 3.34,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "tightening error budgets would make values look more accurate",
        "Gate CL ledgers show the required same-family calibration and same-basis holdouts are missing"
      ],
      id: "source_absent_budget_tightening_without_holdouts",
      passesCalculatorAdvancementTest: false,
      reason:
        "Blocked wrong-number risk: budget tightening without holdouts would weaken accuracy boundaries.",
      residualBudgetRiskReduction: -0.8,
      score: -1.2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_wrong_number_risk",
      sourceRowsRequiredForSelection: true
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "large source crawling could find future exact/holdout candidates",
        "it does not by itself improve calculation scope or accuracy"
      ],
      id: "broad_source_row_crawl",
      passesCalculatorAdvancementTest: false,
      reason: "Non-goal for this calculator slice.",
      residualBudgetRiskReduction: 0,
      score: -2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: true
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "finite examples can document behavior",
        "they do not create a formula, owner boundary, or residual policy"
      ],
      id: "finite_scenario_pack",
      passesCalculatorAdvancementTest: false,
      reason: "Non-goal for this calculator slice.",
      residualBudgetRiskReduction: 0,
      score: -2.2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "confidence wording can communicate risk",
        "it cannot replace holdout-backed error-budget ownership"
      ],
      id: "confidence_wording_or_low_confidence_surface",
      passesCalculatorAdvancementTest: false,
      reason: "Non-goal for this calculator slice.",
      residualBudgetRiskReduction: 0,
      score: -2.4,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false
    }
  ] as const satisfies readonly PostV1GateCLCandidate[];
}

export function summarizePostV1GateCLNumericCoverageGap(): PostV1GateCLSummary {
  if (
    POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE
  ) {
    throw new Error("Gate CL can only land after Gate CK selects Gate CL.");
  }

  return {
    frozenRuntimePins: {
      gateCJBuildingValuePins: POST_V1_GATE_CJ_BUILDING_VALUE_PINS,
      gateCKOpeningLeakValuePins: POST_V1_GATE_CK_VALUE_PINS
    },
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_CL_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_CL_PLAN_DOC_PATH,
    previousGateCK: {
      landedGate: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE,
      selectedNextAction: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS
    },
    residualLedgers: evaluatePostV1GateCLResidualLedgers(),
    selectedCandidateId: "required_physical_input_surface_parity_after_residual_ledgers",
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_LABEL,
    selectionCandidates: rankPostV1GateCLNumericCoverageCandidates(),
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS
  };
}
