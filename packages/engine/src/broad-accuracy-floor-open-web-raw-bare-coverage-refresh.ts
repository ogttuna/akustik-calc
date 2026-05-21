import { type BroadAccuracyMetricId } from "./broad-accuracy-reference-benchmark-expansion";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-raw-bare-surface-parity";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE =
  "broad_accuracy_floor_open_web_raw_bare_coverage_refresh_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_raw_bare_coverage_refresh_landed_selected_post_raw_bare_open_web_revalidation";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION =
  "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-post-raw-bare-open-web-coverage-revalidation-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL =
  "post raw-bare open-web coverage revalidation";

export type BroadAccuracyFloorOpenWebRawBareCoverageMetricId =
  | BroadAccuracyMetricId
  | "AIIC"
  | "CI"
  | "CI,50-2500"
  | "Ln,w+CI";

export type BroadAccuracyFloorOpenWebRawBareCoverageRowId =
  | "floor.open_web_raw_bare_300.lab"
  | "floor.open_web_raw_bare_split_150_150.lab"
  | "floor.open_web_raw_bare_fragmented_6x50.lab"
  | "floor.open_web_raw_bare_400.lab"
  | "floor.open_web_raw_bare_ubiq_fl26_exact_precedence.lab"
  | "floor.open_web_raw_bare_direct_fixed_separate_lane.lab"
  | "floor.open_web_raw_bare_supported_band_separate_lane.lab"
  | "floor.open_web_raw_bare_partial_package.boundary"
  | "floor.open_web_raw_bare_deck_only.boundary"
  | "floor.open_web_raw_bare_out_of_range.boundary"
  | "floor.open_web_raw_bare_wrong_support_open_box.boundary"
  | "floor.open_web_raw_bare_field_building.boundary"
  | "floor.open_web_raw_bare_astm_iic.unsupported"
  | "floor.open_web_raw_bare_post_revalidation.next";

export type BroadAccuracyFloorOpenWebRawBareCoveragePosture =
  | "exact"
  | "family_physics"
  | "followup_ranked"
  | "needs_input"
  | "unsupported";

export type BroadAccuracyFloorOpenWebRawBareCoverageFailureClass =
  | "basis_boundary"
  | "correct_block"
  | "coverage_followup"
  | "exact_precedence_boundary"
  | "none"
  | "separate_lane_boundary";

export type BroadAccuracyFloorOpenWebRawBareCoverageErrorBudgetPin = {
  readonly metric: BroadAccuracyFloorOpenWebRawBareCoverageMetricId;
  readonly toleranceDb: number;
};

export type BroadAccuracyFloorOpenWebRawBareCoverageRow = {
  readonly basis: "astm_rating_boundary" | "building_prediction" | "element_lab" | "field_apparent";
  readonly currentPosture: BroadAccuracyFloorOpenWebRawBareCoveragePosture;
  readonly errorBudgetPins: readonly BroadAccuracyFloorOpenWebRawBareCoverageErrorBudgetPin[];
  readonly expectedBasisId: string | null;
  readonly failureClass: BroadAccuracyFloorOpenWebRawBareCoverageFailureClass;
  readonly id: BroadAccuracyFloorOpenWebRawBareCoverageRowId;
  readonly missingPhysicalInputs: readonly string[];
  readonly nextAction: string;
  readonly originSupportBucket:
    | "basis_boundary"
    | "exact_source"
    | "ranked_followup"
    | "separate_supported_lane"
    | "source_absent_family_physics"
    | "unsupported_screening_only"
    | "wrong_family_guard";
  readonly requestedMetrics: readonly BroadAccuracyFloorOpenWebRawBareCoverageMetricId[];
  readonly route: "floor";
  readonly supportedTargetOutputs: readonly BroadAccuracyFloorOpenWebRawBareCoverageMetricId[];
  readonly unsupportedTargetOutputs: readonly BroadAccuracyFloorOpenWebRawBareCoverageMetricId[];
  readonly valuePins: readonly {
    readonly metric: BroadAccuracyFloorOpenWebRawBareCoverageMetricId;
    readonly value: number;
  }[];
};

export type BroadAccuracyFloorOpenWebRawBareCoverageRefreshSummary = {
  readonly basisBoundaryRowIds: readonly BroadAccuracyFloorOpenWebRawBareCoverageRowId[];
  readonly correctlyBlockedRowIds: readonly BroadAccuracyFloorOpenWebRawBareCoverageRowId[];
  readonly exactPrecedenceBoundaryRowIds: readonly BroadAccuracyFloorOpenWebRawBareCoverageRowId[];
  readonly failureClassCounts: Record<BroadAccuracyFloorOpenWebRawBareCoverageFailureClass, number>;
  readonly noRuntimeValueMovement: true;
  readonly rankedFollowupRowIds: readonly BroadAccuracyFloorOpenWebRawBareCoverageRowId[];
  readonly separateLaneRowIds: readonly BroadAccuracyFloorOpenWebRawBareCoverageRowId[];
  readonly rowCount: number;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  readonly supportedRuntimeRowIds: readonly BroadAccuracyFloorOpenWebRawBareCoverageRowId[];
};

export type BroadAccuracyFloorOpenWebRawBareCoverageRefreshContract = {
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE;
  readonly matrixRows: readonly BroadAccuracyFloorOpenWebRawBareCoverageRow[];
  readonly noRuntimeValueMovement: true;
  readonly previousSurfaceParity: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS;
  };
  readonly remainingFollowups: readonly {
    readonly id:
      | "astm_iic_aiic_rating_curve_owner"
      | "carrier_only_holdout_acquisition"
      | "open_web_field_building_adapter"
      | "post_raw_bare_open_web_revalidation";
    readonly reason: string;
    readonly selectedNow: boolean;
  }[];
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS;
  readonly summary: BroadAccuracyFloorOpenWebRawBareCoverageRefreshSummary;
};

const RAW_BARE_BUDGETS = [
  { metric: "Rw", toleranceDb: 9 },
  { metric: "C", toleranceDb: 3 },
  { metric: "Ctr", toleranceDb: 4.5 },
  { metric: "Ln,w", toleranceDb: 12 },
  { metric: "CI", toleranceDb: 4 },
  { metric: "CI,50-2500", toleranceDb: 5 },
  { metric: "Ln,w+CI", toleranceDb: 12.5 }
] as const satisfies readonly BroadAccuracyFloorOpenWebRawBareCoverageErrorBudgetPin[];

const RAW_300_VALUE_PINS = [
  { metric: "Rw", value: 32 },
  { metric: "C", value: -2.2 },
  { metric: "Ctr", value: -7.8 },
  { metric: "Ln,w", value: 96 },
  { metric: "CI", value: 1.8 },
  { metric: "CI,50-2500", value: 5.2 },
  { metric: "Ln,w+CI", value: 97.8 }
] as const satisfies BroadAccuracyFloorOpenWebRawBareCoverageRow["valuePins"];

const RAW_400_VALUE_PINS = [
  { metric: "Rw", value: 36.6 },
  { metric: "C", value: -2 },
  { metric: "Ctr", value: -7.5 },
  { metric: "Ln,w", value: 92.8 },
  { metric: "CI", value: 1.3 },
  { metric: "CI,50-2500", value: 4.6 },
  { metric: "Ln,w+CI", value: 94.1 }
] as const satisfies BroadAccuracyFloorOpenWebRawBareCoverageRow["valuePins"];

function rawBareRow(
  id: Extract<
    BroadAccuracyFloorOpenWebRawBareCoverageRowId,
    | "floor.open_web_raw_bare_300.lab"
    | "floor.open_web_raw_bare_split_150_150.lab"
    | "floor.open_web_raw_bare_fragmented_6x50.lab"
    | "floor.open_web_raw_bare_400.lab"
  >,
  valuePins: readonly BroadAccuracyFloorOpenWebRawBareCoverageRow["valuePins"][number][],
  nextAction: string
): BroadAccuracyFloorOpenWebRawBareCoverageRow {
  return {
    basis: "element_lab",
    currentPosture: "family_physics",
    errorBudgetPins: RAW_BARE_BUDGETS,
    expectedBasisId: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    failureClass: "none",
    id,
    missingPhysicalInputs: [],
    nextAction,
    originSupportBucket: "source_absent_family_physics",
    requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    route: "floor",
    supportedTargetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    unsupportedTargetOutputs: [],
    valuePins
  };
}

export function buildBroadAccuracyFloorOpenWebRawBareCoverageMatrix():
  readonly BroadAccuracyFloorOpenWebRawBareCoverageRow[] {
  return [
    rawBareRow("floor.open_web_raw_bare_300.lab", RAW_300_VALUE_PINS, "keep canonical 300 mm raw-bare open-web runtime pinned"),
    rawBareRow(
      "floor.open_web_raw_bare_split_150_150.lab",
      RAW_300_VALUE_PINS,
      "keep safe 150/150 mm split equivalent to the 300 mm raw-bare carrier"
    ),
    rawBareRow(
      "floor.open_web_raw_bare_fragmented_6x50.lab",
      RAW_300_VALUE_PINS,
      "keep many safe same-role fragments equivalent to the 300 mm raw-bare carrier without lane drift"
    ),
    rawBareRow("floor.open_web_raw_bare_400.lab", RAW_400_VALUE_PINS, "keep deeper 400 mm raw-bare open-web runtime pinned separately"),
    {
      basis: "element_lab",
      currentPosture: "exact",
      errorBudgetPins: [],
      expectedBasisId: "official_floor_system_exact_match",
      failureClass: "exact_precedence_boundary",
      id: "floor.open_web_raw_bare_ubiq_fl26_exact_precedence.lab",
      missingPhysicalInputs: [],
      nextAction: "keep exact UBIQ INEX/firestop package rows ahead of raw-bare carrier formulas",
      originSupportBucket: "exact_source",
      requestedMetrics: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 62 },
        { metric: "Ln,w", value: 61 },
        { metric: "CI", value: -2 },
        { metric: "Ln,w+CI", value: 59 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: [],
      expectedBasisId: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.open_web_raw_bare_direct_fixed_separate_lane.lab",
      missingPhysicalInputs: [],
      nextAction: "keep direct-fixed lower lining packages on their own formula corridor instead of raw-bare",
      originSupportBucket: "separate_supported_lane",
      requestedMetrics: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 52 },
        { metric: "Ln,w", value: 77 },
        { metric: "CI", value: -0.5 },
        { metric: "Ln,w+CI", value: 76.5 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: [],
      expectedBasisId: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.open_web_raw_bare_supported_band_separate_lane.lab",
      missingPhysicalInputs: [],
      nextAction: "keep INEX/firestop supported-band packages on their own similarity lane instead of raw-bare",
      originSupportBucket: "separate_supported_lane",
      requestedMetrics: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
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
      id: "floor.open_web_raw_bare_partial_package.boundary",
      missingPhysicalInputs: ["completePackageTransferOwner", "explicitRawBareCarrierOnlyOwner", "finishAbsenceOwner"],
      nextAction: "refuse partial INEX/package stacks instead of treating them as raw-bare carriers",
      originSupportBucket: "basis_boundary",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
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
      id: "floor.open_web_raw_bare_deck_only.boundary",
      missingPhysicalInputs: ["openWebCarrierOwner", "supportFamily", "rawBareCarrierThicknessMm"],
      nextAction: "refuse deck-only INEX panels as open-web raw-bare support evidence",
      originSupportBucket: "unsupported_screening_only",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
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
      id: "floor.open_web_raw_bare_out_of_range.boundary",
      missingPhysicalInputs: ["rawBareOpenWebDepthWithin200To400Mm", "familySolverRangeOwner"],
      nextAction: "refuse out-of-range raw-bare open-web depths instead of extrapolating the corridor",
      originSupportBucket: "unsupported_screening_only",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr"],
      unsupportedTargetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: [],
      expectedBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.open_web_raw_bare_wrong_support_open_box.boundary",
      missingPhysicalInputs: ["sameSupportFamily=open_web_steel"],
      nextAction: "keep open-box timber raw-bare carriers on their own solver lane instead of open-web steel",
      originSupportBucket: "wrong_family_guard",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 40.5 },
        { metric: "C", value: -1.5 },
        { metric: "Ctr", value: -6 },
        { metric: "Ln,w", value: 89.4 },
        { metric: "CI", value: -1 },
        { metric: "CI,50-2500", value: 3.3 },
        { metric: "Ln,w+CI", value: 88.4 }
      ]
    },
    {
      basis: "field_apparent",
      currentPosture: "unsupported",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "floor.open_web_raw_bare_field_building.boundary",
      missingPhysicalInputs: ["impactFieldContextOwner", "buildingPredictionAdapterOwner", "junctionOrFlankingContext"],
      nextAction: "do not alias raw-bare element-lab values or budgets to field apparent or building-prediction outputs",
      originSupportBucket: "basis_boundary",
      requestedMetrics: ["L'n,w", "L'nT,w", "R'w", "DnT,w"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["L'n,w", "L'nT,w", "R'w", "DnT,w"],
      valuePins: []
    },
    {
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.open_web_raw_bare_astm_iic.unsupported",
      missingPhysicalInputs: ["ASTM E492/E989 IIC rating curve owner", "AIIC field rating owner"],
      nextAction: "keep ISO Ln,w and CI raw-bare evidence out of ASTM IIC/AIIC outputs",
      originSupportBucket: "basis_boundary",
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
      id: "floor.open_web_raw_bare_post_revalidation.next",
      missingPhysicalInputs: [
        "globalOpenWebCoverageLedgerRefresh",
        "postRawBareWeakLaneDebtRanking",
        "nextHighestRoiFamilySolverSelection"
      ],
      nextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    }
  ];
}

export function summarizeBroadAccuracyFloorOpenWebRawBareCoverageRefresh(
  rows: readonly BroadAccuracyFloorOpenWebRawBareCoverageRow[]
): BroadAccuracyFloorOpenWebRawBareCoverageRefreshSummary {
  const failureClassCounts: Record<BroadAccuracyFloorOpenWebRawBareCoverageFailureClass, number> = {
    basis_boundary: 0,
    correct_block: 0,
    coverage_followup: 0,
    exact_precedence_boundary: 0,
    none: 0,
    separate_lane_boundary: 0
  };

  for (const row of rows) {
    failureClassCounts[row.failureClass] += 1;
  }

  return {
    basisBoundaryRowIds: rows.filter((row) => row.failureClass === "basis_boundary").map((row) => row.id),
    correctlyBlockedRowIds: rows.filter((row) => row.failureClass === "correct_block").map((row) => row.id),
    exactPrecedenceBoundaryRowIds: rows
      .filter((row) => row.failureClass === "exact_precedence_boundary")
      .map((row) => row.id),
    failureClassCounts,
    noRuntimeValueMovement: true,
    rankedFollowupRowIds: rows.filter((row) => row.failureClass === "coverage_followup").map((row) => row.id),
    rowCount: rows.length,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    separateLaneRowIds: rows.filter((row) => row.failureClass === "separate_lane_boundary").map((row) => row.id),
    supportedRuntimeRowIds: rows
      .filter((row) => row.expectedBasisId === OPEN_WEB_RAW_BARE_FORMULA_BASIS)
      .map((row) => row.id)
  };
}

export function buildBroadAccuracyFloorOpenWebRawBareCoverageRefreshContract():
  BroadAccuracyFloorOpenWebRawBareCoverageRefreshContract {
  const matrixRows = buildBroadAccuracyFloorOpenWebRawBareCoverageMatrix();

  return {
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS
    },
    remainingFollowups: [
      {
        id: "post_raw_bare_open_web_revalidation",
        reason:
          "selected now because raw-bare, exact package, direct-fixed, and supported-band open-web lanes are all visible and need one ranked ledger pass before another runtime lane",
        selectedNow: true
      },
      {
        id: "carrier_only_holdout_acquisition",
        reason:
          "not selected here because source acquisition is a narrow holdout task and must not replace the source-absent calculator corridor",
        selectedNow: false
      },
      {
        id: "open_web_field_building_adapter",
        reason: "not selected here because lab raw-bare Ln,w/Rw cannot alias to field apparent or building-prediction outputs",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason: "not selected here because ISO Ln,w/CI raw-bare evidence cannot create ASTM IIC/AIIC ratings",
        selectedNow: false
      }
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS,
    summary: summarizeBroadAccuracyFloorOpenWebRawBareCoverageRefresh(matrixRows)
  };
}
