import {
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_LANDED_GATE =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_plan";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTION_STATUS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_landed_no_runtime_selected_post_helper_only_revalidation";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION =
  "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-post-helper-only-timber-open-web-impact-stack-coverage-revalidation-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_LABEL =
  "post helper-only timber/open-web impact stack coverage revalidation";

export type BroadAccuracyFloorHelperOnlyCoverageMetricId =
  | "AIIC"
  | "C"
  | "CI"
  | "CI,50-2500"
  | "Ctr"
  | "DnT,w"
  | "IIC"
  | "L'n,w"
  | "L'nT,w"
  | "Ln,w"
  | "Ln,w+CI"
  | "R'w"
  | "Rw";

export type BroadAccuracyFloorHelperOnlyCoverageRowId =
  | "floor.helper_only_open_box_timber_370.lab"
  | "floor.helper_only_open_box_timber_split_185_185.lab"
  | "floor.helper_only_open_box_timber_fragmented_4x92_5.lab"
  | "floor.helper_only_timber_joist_250.lab"
  | "floor.helper_only_open_web_250.lab"
  | "floor.helper_only_open_web_split_125_125.lab"
  | "floor.helper_only_exact_package_precedence.lab"
  | "floor.helper_only_open_box_package_transfer_separate_lane.lab"
  | "floor.helper_only_open_box_raw_bare_separate_lane.lab"
  | "floor.helper_only_open_web_raw_bare_separate_lane.lab"
  | "floor.helper_only_open_web_direct_fixed_separate_lane.lab"
  | "floor.helper_only_open_web_supported_band_separate_lane.lab"
  | "floor.helper_only_missing_board.boundary"
  | "floor.helper_only_roleless.boundary"
  | "floor.helper_only_partial_upper_package.boundary"
  | "floor.helper_only_field_building.boundary"
  | "floor.helper_only_astm_iic.unsupported"
  | "floor.helper_only_post_coverage_revalidation.next";

export type BroadAccuracyFloorHelperOnlyCoveragePosture =
  | "exact"
  | "family_physics"
  | "followup_ranked"
  | "needs_input"
  | "separate_family_physics"
  | "unsupported";

export type BroadAccuracyFloorHelperOnlyCoverageFailureClass =
  | "basis_boundary"
  | "correct_block"
  | "coverage_followup"
  | "exact_precedence_boundary"
  | "none"
  | "separate_lane_boundary";

export type BroadAccuracyFloorHelperOnlyCoverageErrorBudgetPin = {
  readonly metric: BroadAccuracyFloorHelperOnlyCoverageMetricId;
  readonly toleranceDb: number;
};

export type BroadAccuracyFloorHelperOnlyCoverageRow = {
  readonly basis: "astm_rating_boundary" | "building_prediction" | "element_lab" | "field_apparent";
  readonly currentPosture: BroadAccuracyFloorHelperOnlyCoveragePosture;
  readonly errorBudgetPins: readonly BroadAccuracyFloorHelperOnlyCoverageErrorBudgetPin[];
  readonly expectedBasisId: string | null;
  readonly failureClass: BroadAccuracyFloorHelperOnlyCoverageFailureClass;
  readonly id: BroadAccuracyFloorHelperOnlyCoverageRowId;
  readonly missingPhysicalInputs: readonly string[];
  readonly nextAction: string;
  readonly originSupportBucket:
    | "basis_boundary"
    | "exact_source"
    | "ranked_followup"
    | "separate_supported_lane"
    | "source_absent_family_physics"
    | "unsupported_or_incomplete_topology";
  readonly requestedMetrics: readonly BroadAccuracyFloorHelperOnlyCoverageMetricId[];
  readonly route: "floor";
  readonly supportedTargetOutputs: readonly BroadAccuracyFloorHelperOnlyCoverageMetricId[];
  readonly unsupportedTargetOutputs: readonly BroadAccuracyFloorHelperOnlyCoverageMetricId[];
  readonly valuePins: readonly {
    readonly metric: BroadAccuracyFloorHelperOnlyCoverageMetricId;
    readonly value: number;
  }[];
};

export type BroadAccuracyFloorHelperOnlyCoverageRefreshSummary = {
  readonly basisBoundaryRowIds: readonly BroadAccuracyFloorHelperOnlyCoverageRowId[];
  readonly correctlyBlockedRowIds: readonly BroadAccuracyFloorHelperOnlyCoverageRowId[];
  readonly exactPrecedenceBoundaryRowIds: readonly BroadAccuracyFloorHelperOnlyCoverageRowId[];
  readonly failureClassCounts: Record<BroadAccuracyFloorHelperOnlyCoverageFailureClass, number>;
  readonly noRuntimeValueMovement: true;
  readonly rankedFollowupRowIds: readonly BroadAccuracyFloorHelperOnlyCoverageRowId[];
  readonly rowCount: number;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  readonly separateLaneBoundaryRowIds: readonly BroadAccuracyFloorHelperOnlyCoverageRowId[];
  readonly supportedRuntimeRowIds: readonly BroadAccuracyFloorHelperOnlyCoverageRowId[];
};

export type BroadAccuracyFloorHelperOnlyCoverageRefreshContract = {
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_LANDED_GATE;
  readonly matrixRows: readonly BroadAccuracyFloorHelperOnlyCoverageRow[];
  readonly noRuntimeValueMovement: true;
  readonly previousSurfaceParity: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTION_STATUS;
  };
  readonly remainingFollowups: readonly {
    readonly id:
      | "astm_iic_aiic_rating_curve_owner"
      | "helper_only_field_building_adapter"
      | "helper_only_holdout_acquisition"
      | "post_helper_only_revalidation"
      | "tolerance_retune";
    readonly reason: string;
    readonly selectedNow: boolean;
  }[];
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTION_STATUS;
  readonly summary: BroadAccuracyFloorHelperOnlyCoverageRefreshSummary;
};

const REQUESTED_LAB_METRICS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const;

const OPEN_BOX_HELPER_BUDGETS = [
  { metric: "Rw", toleranceDb: 8.5 },
  { metric: "C", toleranceDb: 3 },
  { metric: "Ctr", toleranceDb: 4.5 },
  { metric: "Ln,w", toleranceDb: 10.5 },
  { metric: "CI", toleranceDb: 4 },
  { metric: "CI,50-2500", toleranceDb: 5 },
  { metric: "Ln,w+CI", toleranceDb: 11 }
] as const satisfies readonly BroadAccuracyFloorHelperOnlyCoverageErrorBudgetPin[];

const TIMBER_JOIST_HELPER_BUDGETS = [
  { metric: "Rw", toleranceDb: 9.5 },
  { metric: "C", toleranceDb: 3 },
  { metric: "Ctr", toleranceDb: 4.5 },
  { metric: "Ln,w", toleranceDb: 11.5 },
  { metric: "CI", toleranceDb: 4 },
  { metric: "CI,50-2500", toleranceDb: 5 },
  { metric: "Ln,w+CI", toleranceDb: 12 }
] as const satisfies readonly BroadAccuracyFloorHelperOnlyCoverageErrorBudgetPin[];

const OPEN_WEB_HELPER_BUDGETS = [
  { metric: "Rw", toleranceDb: 9 },
  { metric: "C", toleranceDb: 3 },
  { metric: "Ctr", toleranceDb: 4.5 },
  { metric: "Ln,w", toleranceDb: 10 },
  { metric: "CI", toleranceDb: 4 },
  { metric: "CI,50-2500", toleranceDb: 5 },
  { metric: "Ln,w+CI", toleranceDb: 10.5 }
] as const satisfies readonly BroadAccuracyFloorHelperOnlyCoverageErrorBudgetPin[];

const OPEN_BOX_HELPER_VALUES = [
  { metric: "Rw", value: 54.8 },
  { metric: "C", value: -1.1 },
  { metric: "Ctr", value: -5.9 },
  { metric: "Ln,w", value: 59.6 },
  { metric: "CI", value: 1 },
  { metric: "CI,50-2500", value: 2.3 },
  { metric: "Ln,w+CI", value: 60.6 }
] as const satisfies BroadAccuracyFloorHelperOnlyCoverageRow["valuePins"];

const TIMBER_JOIST_HELPER_VALUES = [
  { metric: "Rw", value: 47.3 },
  { metric: "C", value: -2.1 },
  { metric: "Ctr", value: -8.3 },
  { metric: "Ln,w", value: 65.4 },
  { metric: "CI", value: 0.8 },
  { metric: "CI,50-2500", value: 3.5 },
  { metric: "Ln,w+CI", value: 66.2 }
] as const satisfies BroadAccuracyFloorHelperOnlyCoverageRow["valuePins"];

const OPEN_WEB_HELPER_VALUES = [
  { metric: "Rw", value: 46.7 },
  { metric: "C", value: -1.7 },
  { metric: "Ctr", value: -7.9 },
  { metric: "Ln,w", value: 59.6 },
  { metric: "CI", value: 1 },
  { metric: "CI,50-2500", value: 4 },
  { metric: "Ln,w+CI", value: 60.6 }
] as const satisfies BroadAccuracyFloorHelperOnlyCoverageRow["valuePins"];

function helperRuntimeRow(
  id: Extract<
    BroadAccuracyFloorHelperOnlyCoverageRowId,
    | "floor.helper_only_open_box_timber_370.lab"
    | "floor.helper_only_open_box_timber_split_185_185.lab"
    | "floor.helper_only_open_box_timber_fragmented_4x92_5.lab"
    | "floor.helper_only_timber_joist_250.lab"
    | "floor.helper_only_open_web_250.lab"
    | "floor.helper_only_open_web_split_125_125.lab"
  >,
  valuePins: readonly BroadAccuracyFloorHelperOnlyCoverageRow["valuePins"][number][],
  errorBudgetPins: readonly BroadAccuracyFloorHelperOnlyCoverageErrorBudgetPin[],
  nextAction: string
): BroadAccuracyFloorHelperOnlyCoverageRow {
  return {
    basis: "element_lab",
    currentPosture: "family_physics",
    errorBudgetPins,
    expectedBasisId: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    failureClass: "none",
    id,
    missingPhysicalInputs: [],
    nextAction,
    originSupportBucket: "source_absent_family_physics",
    requestedMetrics: REQUESTED_LAB_METRICS,
    route: "floor",
    supportedTargetOutputs: REQUESTED_LAB_METRICS,
    unsupportedTargetOutputs: [],
    valuePins
  };
}

export function buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackCoverageMatrix():
  readonly BroadAccuracyFloorHelperOnlyCoverageRow[] {
  return [
    helperRuntimeRow(
      "floor.helper_only_open_box_timber_370.lab",
      OPEN_BOX_HELPER_VALUES,
      OPEN_BOX_HELPER_BUDGETS,
      "keep canonical 370 mm open-box timber helper-only lower-treatment runtime pinned"
    ),
    helperRuntimeRow(
      "floor.helper_only_open_box_timber_split_185_185.lab",
      OPEN_BOX_HELPER_VALUES,
      OPEN_BOX_HELPER_BUDGETS,
      "keep safe 185/185 mm open-box timber split equivalent to the 370 mm helper-only carrier"
    ),
    helperRuntimeRow(
      "floor.helper_only_open_box_timber_fragmented_4x92_5.lab",
      OPEN_BOX_HELPER_VALUES,
      OPEN_BOX_HELPER_BUDGETS,
      "keep safe 4x92.5 mm same-role fragments equivalent to the 370 mm helper-only carrier"
    ),
    helperRuntimeRow(
      "floor.helper_only_timber_joist_250.lab",
      TIMBER_JOIST_HELPER_VALUES,
      TIMBER_JOIST_HELPER_BUDGETS,
      "keep 250 mm timber-joist helper-only lower-treatment runtime pinned"
    ),
    helperRuntimeRow(
      "floor.helper_only_open_web_250.lab",
      OPEN_WEB_HELPER_VALUES,
      OPEN_WEB_HELPER_BUDGETS,
      "keep 250 mm open-web steel helper-only lower-treatment runtime pinned"
    ),
    helperRuntimeRow(
      "floor.helper_only_open_web_split_125_125.lab",
      OPEN_WEB_HELPER_VALUES,
      OPEN_WEB_HELPER_BUDGETS,
      "keep safe 125/125 mm open-web steel split equivalent to the 250 mm helper-only carrier"
    ),
    {
      basis: "element_lab",
      currentPosture: "exact",
      errorBudgetPins: [],
      expectedBasisId: "open_measured_floor_system_exact_match",
      failureClass: "exact_precedence_boundary",
      id: "floor.helper_only_exact_package_precedence.lab",
      missingPhysicalInputs: [],
      nextAction: "keep exact measured package rows ahead of helper-only lower-treatment formulas",
      originSupportBucket: "exact_source",
      requestedMetrics: REQUESTED_LAB_METRICS,
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: ["Ctr"],
      valuePins: [
        { metric: "Rw", value: 75 },
        { metric: "Ln,w", value: 44 },
        { metric: "CI", value: 0 },
        { metric: "CI,50-2500", value: 3 },
        { metric: "Ln,w+CI", value: 44 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "separate_family_physics",
      errorBudgetPins: [],
      expectedBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.helper_only_open_box_package_transfer_separate_lane.lab",
      missingPhysicalInputs: [],
      nextAction: "keep finished open-box timber package-transfer stacks on their own formula lane",
      originSupportBucket: "separate_supported_lane",
      requestedMetrics: REQUESTED_LAB_METRICS,
      route: "floor",
      supportedTargetOutputs: REQUESTED_LAB_METRICS,
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 66 },
        { metric: "Ln,w", value: 50.8 },
        { metric: "CI,50-2500", value: 3.3 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "separate_family_physics",
      errorBudgetPins: [],
      expectedBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.helper_only_open_box_raw_bare_separate_lane.lab",
      missingPhysicalInputs: [],
      nextAction: "keep open-box timber raw-bare carriers on their own formula lane",
      originSupportBucket: "separate_supported_lane",
      requestedMetrics: REQUESTED_LAB_METRICS,
      route: "floor",
      supportedTargetOutputs: REQUESTED_LAB_METRICS,
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 42.3 },
        { metric: "Ln,w", value: 88.2 },
        { metric: "CI,50-2500", value: 3.1 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "separate_family_physics",
      errorBudgetPins: [],
      expectedBasisId: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.helper_only_open_web_raw_bare_separate_lane.lab",
      missingPhysicalInputs: [],
      nextAction: "keep open-web raw-bare carriers on their own formula lane",
      originSupportBucket: "separate_supported_lane",
      requestedMetrics: REQUESTED_LAB_METRICS,
      route: "floor",
      supportedTargetOutputs: REQUESTED_LAB_METRICS,
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 32 },
        { metric: "Ln,w", value: 96 },
        { metric: "CI,50-2500", value: 5.2 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "separate_family_physics",
      errorBudgetPins: [],
      expectedBasisId: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.helper_only_open_web_direct_fixed_separate_lane.lab",
      missingPhysicalInputs: [],
      nextAction: "keep direct-fixed open-web lower lining packages outside helper-only lower-treatment formulas",
      originSupportBucket: "separate_supported_lane",
      requestedMetrics: REQUESTED_LAB_METRICS,
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: ["C", "CI,50-2500"],
      valuePins: [
        { metric: "Rw", value: 52 },
        { metric: "Ln,w", value: 77 },
        { metric: "CI", value: -0.5 },
        { metric: "Ln,w+CI", value: 76.5 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "separate_family_physics",
      errorBudgetPins: [],
      expectedBasisId: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.helper_only_open_web_supported_band_separate_lane.lab",
      missingPhysicalInputs: [],
      nextAction: "keep open-web supported-band packages outside helper-only lower-treatment formulas",
      originSupportBucket: "separate_supported_lane",
      requestedMetrics: REQUESTED_LAB_METRICS,
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: ["C", "Ctr", "CI,50-2500"],
      valuePins: [
        { metric: "Rw", value: 61.5 },
        { metric: "Ln,w", value: 61.5 },
        { metric: "CI", value: -1.5 },
        { metric: "Ln,w+CI", value: 60 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.helper_only_missing_board.boundary",
      missingPhysicalInputs: ["lowerCeilingBoardLayerCount", "lowerCeilingBoardSurfaceMassKgM2"],
      nextAction: "ask for lower board ownership before applying the helper-only lower-treatment formula",
      originSupportBucket: "unsupported_or_incomplete_topology",
      requestedMetrics: REQUESTED_LAB_METRICS,
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr"],
      unsupportedTargetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.helper_only_roleless.boundary",
      missingPhysicalInputs: ["explicitFloorRoleStack"],
      nextAction: "do not infer helper-only topology from untagged layer order",
      originSupportBucket: "unsupported_or_incomplete_topology",
      requestedMetrics: REQUESTED_LAB_METRICS,
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr"],
      unsupportedTargetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.helper_only_partial_upper_package.boundary",
      missingPhysicalInputs: ["completePackageTransferOwner", "upperPackageState"],
      nextAction: "do not mix partial upper packages into helper-only lower-treatment formulas",
      originSupportBucket: "unsupported_or_incomplete_topology",
      requestedMetrics: REQUESTED_LAB_METRICS,
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr"],
      unsupportedTargetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "building_prediction",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "floor.helper_only_field_building.boundary",
      missingPhysicalInputs: ["receivingRoomVolumeM3", "receivingRoomRt60S", "junctionOrFlankingContext"],
      nextAction: "do not alias element-lab helper-only Ln,w/Rw to field apparent or building-prediction outputs",
      originSupportBucket: "basis_boundary",
      requestedMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["R'w", "DnT,w", "L'n,w", "L'nT,w"],
      valuePins: []
    },
    {
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.helper_only_astm_iic.unsupported",
      missingPhysicalInputs: ["astmIicAiicRatingProcedureOwner"],
      nextAction: "do not convert helper-only ISO Ln,w/CI outputs into ASTM IIC/AIIC aliases",
      originSupportBucket: "unsupported_or_incomplete_topology",
      requestedMetrics: ["IIC", "AIIC"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["IIC", "AIIC"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "followup_ranked",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "floor.helper_only_post_coverage_revalidation.next",
      missingPhysicalInputs: [
        "globalHelperOnlyCoverageLedgerRefresh",
        "postHelperOnlyWeakLaneDebtRanking",
        "nextHighestRoiFamilySolverSelection"
      ],
      nextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: REQUESTED_LAB_METRICS,
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: REQUESTED_LAB_METRICS,
      valuePins: []
    }
  ];
}

function rowIdsByFailureClass(
  rows: readonly BroadAccuracyFloorHelperOnlyCoverageRow[],
  failureClass: BroadAccuracyFloorHelperOnlyCoverageFailureClass
): BroadAccuracyFloorHelperOnlyCoverageRowId[] {
  return rows.filter((row) => row.failureClass === failureClass).map((row) => row.id);
}

function failureClassCounts(
  rows: readonly BroadAccuracyFloorHelperOnlyCoverageRow[]
): Record<BroadAccuracyFloorHelperOnlyCoverageFailureClass, number> {
  return {
    basis_boundary: rows.filter((row) => row.failureClass === "basis_boundary").length,
    correct_block: rows.filter((row) => row.failureClass === "correct_block").length,
    coverage_followup: rows.filter((row) => row.failureClass === "coverage_followup").length,
    exact_precedence_boundary: rows.filter((row) => row.failureClass === "exact_precedence_boundary").length,
    none: rows.filter((row) => row.failureClass === "none").length,
    separate_lane_boundary: rows.filter((row) => row.failureClass === "separate_lane_boundary").length
  };
}

export function buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackCoverageRefreshContract():
  BroadAccuracyFloorHelperOnlyCoverageRefreshContract {
  const matrixRows = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackCoverageMatrix();

  return {
    landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTION_STATUS
    },
    remainingFollowups: [
      {
        id: "post_helper_only_revalidation",
        reason:
          "selected now because helper-only open-box, timber-joist, and open-web lower-treatment runtimes are surfaced and need one ranked ledger pass before another lane is promoted",
        selectedNow: true
      },
      {
        id: "helper_only_holdout_acquisition",
        reason:
          "not selected here because source acquisition can tighten later calibration but must not replace the current source-absent calculator lane",
        selectedNow: false
      },
      {
        id: "helper_only_field_building_adapter",
        reason:
          "not selected here because element-lab helper-only Rw/Ln,w cannot alias to field or building outputs without separate ISO 12354 owners",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason:
          "not selected here because ISO Ln,w/CI helper-only evidence cannot create ASTM IIC/AIIC ratings without a separate rating procedure owner",
        selectedNow: false
      },
      {
        id: "tolerance_retune",
        reason:
          "not selected here because no new measured helper-only holdout entered the evidence set and budgets remain not-measured source-absent design budgets",
        selectedNow: false
      }
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTION_STATUS,
    summary: {
      basisBoundaryRowIds: rowIdsByFailureClass(matrixRows, "basis_boundary"),
      correctlyBlockedRowIds: rowIdsByFailureClass(matrixRows, "correct_block"),
      exactPrecedenceBoundaryRowIds: rowIdsByFailureClass(matrixRows, "exact_precedence_boundary"),
      failureClassCounts: failureClassCounts(matrixRows),
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: rowIdsByFailureClass(matrixRows, "coverage_followup"),
      rowCount: matrixRows.length,
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      separateLaneBoundaryRowIds: rowIdsByFailureClass(matrixRows, "separate_lane_boundary"),
      supportedRuntimeRowIds: rowIdsByFailureClass(matrixRows, "none")
    }
  };
}
