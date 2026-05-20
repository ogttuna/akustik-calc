import { type BroadAccuracyMetricId } from "./broad-accuracy-reference-benchmark-expansion";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-raw-bare-surface-parity";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_landed_selected_post_raw_bare_revalidation";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION =
  "broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-post-raw-bare-open-box-timber-coverage-revalidation-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL =
  "post raw-bare open-box timber coverage revalidation";

export type BroadAccuracyFloorOpenBoxTimberRawBareCoverageMetricId =
  | BroadAccuracyMetricId
  | "AIIC"
  | "CI"
  | "CI,50-2500"
  | "Ln,w+CI";

export type BroadAccuracyFloorOpenBoxTimberRawBareCoverageRowId =
  | "floor.open_box_timber_raw_bare_370.lab"
  | "floor.open_box_timber_raw_bare_split_185_185.lab"
  | "floor.open_box_timber_raw_bare_220.lab"
  | "floor.open_box_timber_r5b_exact_precedence.lab"
  | "floor.open_box_timber_package_transfer_separate_lane.lab"
  | "floor.open_box_timber_partial_package.boundary"
  | "floor.open_box_timber_wrong_support_open_web.boundary"
  | "floor.open_box_timber_field_building.boundary"
  | "floor.open_box_timber_astm_iic.unsupported"
  | "floor.open_box_timber_post_raw_bare_revalidation.next";

export type BroadAccuracyFloorOpenBoxTimberRawBareCoveragePosture =
  | "exact"
  | "family_physics"
  | "followup_ranked"
  | "needs_input"
  | "unsupported";

export type BroadAccuracyFloorOpenBoxTimberRawBareCoverageFailureClass =
  | "basis_boundary"
  | "correct_block"
  | "coverage_followup"
  | "exact_precedence_boundary"
  | "none"
  | "separate_lane_boundary";

export type BroadAccuracyFloorOpenBoxTimberRawBareCoverageErrorBudgetPin = {
  readonly metric: BroadAccuracyFloorOpenBoxTimberRawBareCoverageMetricId;
  readonly toleranceDb: number;
};

export type BroadAccuracyFloorOpenBoxTimberRawBareCoverageRow = {
  readonly basis: "astm_rating_boundary" | "building_prediction" | "element_lab" | "field_apparent";
  readonly currentPosture: BroadAccuracyFloorOpenBoxTimberRawBareCoveragePosture;
  readonly errorBudgetPins: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageErrorBudgetPin[];
  readonly expectedBasisId: string | null;
  readonly failureClass: BroadAccuracyFloorOpenBoxTimberRawBareCoverageFailureClass;
  readonly id: BroadAccuracyFloorOpenBoxTimberRawBareCoverageRowId;
  readonly missingPhysicalInputs: readonly string[];
  readonly nextAction: string;
  readonly originSupportBucket:
    | "basis_boundary"
    | "exact_source"
    | "ranked_followup"
    | "separate_supported_lane"
    | "source_absent_family_physics"
    | "wrong_family_guard";
  readonly requestedMetrics: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageMetricId[];
  readonly route: "floor";
  readonly supportedTargetOutputs: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageMetricId[];
  readonly unsupportedTargetOutputs: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageMetricId[];
  readonly valuePins: readonly {
    readonly metric: BroadAccuracyFloorOpenBoxTimberRawBareCoverageMetricId;
    readonly value: number;
  }[];
};

export type BroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshSummary = {
  readonly basisBoundaryRowIds: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageRowId[];
  readonly correctlyBlockedRowIds: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageRowId[];
  readonly exactPrecedenceBoundaryRowIds: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageRowId[];
  readonly failureClassCounts: Record<BroadAccuracyFloorOpenBoxTimberRawBareCoverageFailureClass, number>;
  readonly noRuntimeValueMovement: true;
  readonly packageTransferSeparateLaneRowIds: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageRowId[];
  readonly rankedFollowupRowIds: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageRowId[];
  readonly rowCount: number;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  readonly supportedRuntimeRowIds: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageRowId[];
};

export type BroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshContract = {
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE;
  readonly matrixRows: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageRow[];
  readonly noRuntimeValueMovement: true;
  readonly previousSurfaceParity: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS;
  };
  readonly remainingFollowups: readonly {
    readonly id:
      | "astm_iic_aiic_rating_curve_owner"
      | "open_box_field_building_adapter"
      | "package_transfer_residual_expansion"
      | "post_raw_bare_revalidation";
    readonly reason: string;
    readonly selectedNow: boolean;
  }[];
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS;
  readonly summary: BroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshSummary;
};

const RAW_BARE_BUDGETS = [
  { metric: "Rw", toleranceDb: 8 },
  { metric: "C", toleranceDb: 2.5 },
  { metric: "Ctr", toleranceDb: 3.5 },
  { metric: "Ln,w", toleranceDb: 10 },
  { metric: "CI", toleranceDb: 3 },
  { metric: "CI,50-2500", toleranceDb: 4 },
  { metric: "Ln,w+CI", toleranceDb: 10.5 }
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageErrorBudgetPin[];

const PACKAGE_TRANSFER_BUDGETS = [
  { metric: "Ln,w", toleranceDb: 7 },
  { metric: "CI", toleranceDb: 2 },
  { metric: "CI,50-2500", toleranceDb: 2.5 },
  { metric: "Ln,w+CI", toleranceDb: 7.5 }
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageErrorBudgetPin[];

export function buildBroadAccuracyFloorOpenBoxTimberRawBareCoverageMatrix():
  readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageRow[] {
  return [
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: RAW_BARE_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_raw_bare_370.lab",
      missingPhysicalInputs: [],
      nextAction: "keep canonical 370 mm raw-bare open-box timber runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 42.3 },
        { metric: "C", value: -1.4 },
        { metric: "Ctr", value: -5.8 },
        { metric: "Ln,w", value: 88.2 },
        { metric: "CI", value: -1.1 },
        { metric: "CI,50-2500", value: 3.1 },
        { metric: "Ln,w+CI", value: 87.1 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: RAW_BARE_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_raw_bare_split_185_185.lab",
      missingPhysicalInputs: [],
      nextAction: "keep safe 185/185 mm split raw-bare carrier equivalent to 370 mm total depth",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 42.3 },
        { metric: "C", value: -1.4 },
        { metric: "Ctr", value: -5.8 },
        { metric: "Ln,w", value: 88.2 },
        { metric: "CI", value: -1.1 },
        { metric: "CI,50-2500", value: 3.1 },
        { metric: "Ln,w+CI", value: 87.1 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: RAW_BARE_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_raw_bare_220.lab",
      missingPhysicalInputs: [],
      nextAction: "keep thinner 220 mm raw-bare open-box timber runtime pinned separately",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 38.1 },
        { metric: "C", value: -1.6 },
        { metric: "Ctr", value: -6.2 },
        { metric: "Ln,w", value: 91.1 },
        { metric: "CI", value: -0.9 },
        { metric: "CI,50-2500", value: 3.4 },
        { metric: "Ln,w+CI", value: 90.2 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "exact",
      errorBudgetPins: [],
      expectedBasisId: "open_measured_floor_system_exact_match",
      failureClass: "exact_precedence_boundary",
      id: "floor.open_box_timber_r5b_exact_precedence.lab",
      missingPhysicalInputs: [],
      nextAction: "keep exact TUAS package row ahead of raw-bare and package-transfer formula routes",
      originSupportBucket: "exact_source",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 75 },
        { metric: "C", value: -3.124688292278481 },
        { metric: "Ln,w", value: 44 },
        { metric: "CI", value: 0 },
        { metric: "CI,50-2500", value: 3 },
        { metric: "Ln,w+CI", value: 44 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: PACKAGE_TRANSFER_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.open_box_timber_package_transfer_separate_lane.lab",
      missingPhysicalInputs: [],
      nextAction: "keep complete finished package-transfer stacks on the package-transfer formula lane instead of raw-bare",
      originSupportBucket: "separate_supported_lane",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 66 },
        { metric: "C", value: -3.9 },
        { metric: "Ln,w", value: 50.8 },
        { metric: "CI", value: 1.3 },
        { metric: "CI,50-2500", value: 3.3 },
        { metric: "Ln,w+CI", value: 52 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.open_box_timber_partial_package.boundary",
      missingPhysicalInputs: ["completePackageTransferOwner", "explicitBareCarrierOwner", "finishAbsenceOwner"],
      nextAction: "refuse partial packages instead of treating them as either complete package-transfer or raw-bare carriers",
      originSupportBucket: "basis_boundary",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr"],
      unsupportedTargetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "unsupported",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.open_box_timber_wrong_support_open_web.boundary",
      missingPhysicalInputs: ["sameSupportFamily=open_box_timber"],
      nextAction: "refuse open-web steel carriers as raw-bare open-box timber evidence",
      originSupportBucket: "wrong_family_guard",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr"],
      unsupportedTargetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "field_apparent",
      currentPosture: "unsupported",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "floor.open_box_timber_field_building.boundary",
      missingPhysicalInputs: ["impactFieldContextOwner", "airborneFieldContextOwner", "buildingPredictionAdapterOwner"],
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
      id: "floor.open_box_timber_astm_iic.unsupported",
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
      id: "floor.open_box_timber_post_raw_bare_revalidation.next",
      missingPhysicalInputs: [
        "globalOpenBoxCoverageLedgerRefresh",
        "postRawBareWeakLaneDebtRanking",
        "nextHighestRoiFamilySolverSelection"
      ],
      nextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    }
  ];
}

export function summarizeBroadAccuracyFloorOpenBoxTimberRawBareCoverageRefresh(
  rows: readonly BroadAccuracyFloorOpenBoxTimberRawBareCoverageRow[]
): BroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshSummary {
  const failureClassCounts: Record<BroadAccuracyFloorOpenBoxTimberRawBareCoverageFailureClass, number> = {
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
    packageTransferSeparateLaneRowIds: rows
      .filter((row) => row.failureClass === "separate_lane_boundary")
      .map((row) => row.id),
    rankedFollowupRowIds: rows.filter((row) => row.failureClass === "coverage_followup").map((row) => row.id),
    rowCount: rows.length,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    supportedRuntimeRowIds: rows
      .filter((row) => row.expectedBasisId === OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS)
      .map((row) => row.id)
  };
}

export function buildBroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshContract():
  BroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshContract {
  const matrixRows = buildBroadAccuracyFloorOpenBoxTimberRawBareCoverageMatrix();

  return {
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS
    },
    remainingFollowups: [
      {
        id: "post_raw_bare_revalidation",
        reason:
          "selected now because raw-bare and finished package-transfer lanes are both visible, exact rows stay first, and the next move should rerank the whole open-box coverage ledger before another runtime lane",
        selectedNow: true
      },
      {
        id: "package_transfer_residual_expansion",
        reason:
          "not selected here because package-transfer residual expansion needs a post-raw-bare weak-lane ranking pass first",
        selectedNow: false
      },
      {
        id: "open_box_field_building_adapter",
        reason: "not selected here because lab raw-bare Ln,w/Rw cannot alias to field apparent or building-prediction outputs",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason: "not selected here because ISO Ln,w/CI raw-bare evidence cannot create ASTM IIC/AIIC ratings",
        selectedNow: false
      }
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS,
    summary: summarizeBroadAccuracyFloorOpenBoxTimberRawBareCoverageRefresh(matrixRows)
  };
}
