import { type BroadAccuracyMetricId } from "./broad-accuracy-reference-benchmark-expansion";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-similarity-surface-parity";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_landed_selected_exact_only_hybrid_fragmentation_policy";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL =
  "floor open-box timber exact-only hybrid fragmentation policy";

export type BroadAccuracyFloorOpenBoxTimberCoverageMetricId =
  | BroadAccuracyMetricId
  | "CI"
  | "CI,50-2500"
  | "Rw+C";

export type BroadAccuracyFloorOpenBoxTimberCoverageRowId =
  | "floor.open_box_timber_dry_gypsum_fiber_upper.lab"
  | "floor.open_box_timber_thin_laminate_eps_no_upper.lab"
  | "floor.open_box_timber_reinforced_ceiling_laminate.lab"
  | "floor.open_box_timber_r5b_exact_precedence.lab"
  | "floor.open_box_timber_raw_bare.boundary"
  | "floor.open_box_timber_partial_finish.boundary"
  | "floor.open_box_timber_exact_only_hybrid.boundary"
  | "floor.open_box_timber_mixed_staged.boundary"
  | "floor.open_box_timber_wrong_support_open_web.boundary"
  | "floor.open_box_timber_field_building.boundary"
  | "floor.open_box_timber_astm_iic.unsupported"
  | "floor.open_box_timber_exact_only_hybrid_fragmentation.next";

export type BroadAccuracyFloorOpenBoxTimberCoveragePosture =
  | "exact"
  | "fallback_family_physics"
  | "family_physics"
  | "followup_ranked"
  | "needs_input"
  | "unsupported";

export type BroadAccuracyFloorOpenBoxTimberCoverageFailureClass =
  | "basis_boundary"
  | "correct_block"
  | "coverage_followup"
  | "exact_precedence_boundary"
  | "none";

export type BroadAccuracyFloorOpenBoxTimberCoverageErrorBudgetPin = {
  metric: BroadAccuracyFloorOpenBoxTimberCoverageMetricId;
  toleranceDb: number;
};

export type BroadAccuracyFloorOpenBoxTimberCoverageRow = {
  basis: "astm_rating_boundary" | "building_prediction" | "element_lab" | "field_apparent";
  currentPosture: BroadAccuracyFloorOpenBoxTimberCoveragePosture;
  errorBudgetPins: readonly BroadAccuracyFloorOpenBoxTimberCoverageErrorBudgetPin[];
  expectedBasisId: string | null;
  failureClass: BroadAccuracyFloorOpenBoxTimberCoverageFailureClass;
  id: BroadAccuracyFloorOpenBoxTimberCoverageRowId;
  missingPhysicalInputs: readonly string[];
  nextAction: string;
  originSupportBucket:
    | "broad_fallback_guard"
    | "exact_source"
    | "metric_boundary"
    | "missing_input_boundary"
    | "ranked_followup"
    | "source_absent_family_physics"
    | "wrong_family_guard";
  requestedMetrics: readonly BroadAccuracyFloorOpenBoxTimberCoverageMetricId[];
  route: "floor" | "wall";
  supportedTargetOutputs: readonly BroadAccuracyFloorOpenBoxTimberCoverageMetricId[];
  unsupportedTargetOutputs: readonly BroadAccuracyFloorOpenBoxTimberCoverageMetricId[];
  valuePins: readonly {
    metric: BroadAccuracyFloorOpenBoxTimberCoverageMetricId;
    value: number;
  }[];
};

export type BroadAccuracyFloorOpenBoxTimberCoverageRefreshSummary = {
  basisBoundaryRowIds: readonly BroadAccuracyFloorOpenBoxTimberCoverageRowId[];
  correctlyBlockedRowIds: readonly BroadAccuracyFloorOpenBoxTimberCoverageRowId[];
  exactPrecedenceBoundaryRowIds: readonly BroadAccuracyFloorOpenBoxTimberCoverageRowId[];
  failureClassCounts: Record<BroadAccuracyFloorOpenBoxTimberCoverageFailureClass, number>;
  noRuntimeValueMovement: true;
  rankedFollowupRowIds: readonly BroadAccuracyFloorOpenBoxTimberCoverageRowId[];
  rowCount: number;
  selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  supportedRuntimeRowIds: readonly BroadAccuracyFloorOpenBoxTimberCoverageRowId[];
};

export type BroadAccuracyFloorOpenBoxTimberCoverageRefreshContract = {
  landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE;
  matrixRows: readonly BroadAccuracyFloorOpenBoxTimberCoverageRow[];
  noRuntimeValueMovement: true;
  previousSurfaceParity: {
    landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS;
  };
  remainingFollowups: readonly {
    id:
      | "astm_iic_aiic_rating_curve_owner"
      | "open_box_field_building_adapter"
      | "open_box_raw_bare_reopening_guard"
      | "source_equivalent_fragmentation_policy";
    reason: string;
    selectedNow: boolean;
  }[];
  selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS;
  summary: BroadAccuracyFloorOpenBoxTimberCoverageRefreshSummary;
};

const OPEN_BOX_PACKAGE_TRANSFER_BUDGETS = [
  { metric: "Ln,w", toleranceDb: 7 },
  { metric: "CI", toleranceDb: 2 },
  { metric: "CI,50-2500", toleranceDb: 2.5 },
  { metric: "Ln,w+CI", toleranceDb: 7.5 },
  { metric: "Rw", toleranceDb: 6 },
  { metric: "Rw+C", toleranceDb: 6 }
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberCoverageErrorBudgetPin[];

export function buildBroadAccuracyFloorOpenBoxTimberSimilarityCoverageMatrix():
  readonly BroadAccuracyFloorOpenBoxTimberCoverageRow[] {
  return [
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: OPEN_BOX_PACKAGE_TRANSFER_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_dry_gypsum_fiber_upper.lab",
      missingPhysicalInputs: [],
      nextAction: "keep dry gypsum-fiber open-box timber package-transfer runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 50.8 },
        { metric: "CI", value: 1.3 },
        { metric: "CI,50-2500", value: 3.3 },
        { metric: "Ln,w+CI", value: 52 },
        { metric: "Rw", value: 66 },
        { metric: "Rw+C", value: 62.1 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: OPEN_BOX_PACKAGE_TRANSFER_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_thin_laminate_eps_no_upper.lab",
      missingPhysicalInputs: [],
      nextAction: "keep thin laminate / EPS open-box timber package-transfer runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 53.5 },
        { metric: "CI", value: 1.5 },
        { metric: "CI,50-2500", value: 3.5 },
        { metric: "Ln,w+CI", value: 55 },
        { metric: "Rw", value: 55.5 },
        { metric: "Rw+C", value: 52.3 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: OPEN_BOX_PACKAGE_TRANSFER_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_reinforced_ceiling_laminate.lab",
      missingPhysicalInputs: [],
      nextAction: "keep reinforced-ceiling open-box timber package-transfer runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 53.5 },
        { metric: "CI", value: 0.5 },
        { metric: "CI,50-2500", value: 2 },
        { metric: "Ln,w+CI", value: 54 },
        { metric: "Rw", value: 63.5 },
        { metric: "Rw+C", value: 61.6 }
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
      nextAction: "keep exact TUAS R5B row ahead of package-transfer similarity",
      originSupportBucket: "exact_source",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 44 },
        { metric: "CI", value: 0 },
        { metric: "CI,50-2500", value: 3 },
        { metric: "Ln,w+CI", value: 44 },
        { metric: "Rw", value: 75 },
        { metric: "Rw+C", value: 71.87531170772152 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "fallback_family_physics",
      errorBudgetPins: [],
      expectedBasisId: "predictor_floor_system_family_archetype_estimate",
      failureClass: "correct_block",
      id: "floor.open_box_timber_raw_bare.boundary",
      missingPhysicalInputs: ["upperPackageOrExplicitBareOwner", "lowerCeilingPackageOwner", "rawBareOpenBoxReopeningGuard"],
      nextAction: "keep raw bare open-box timber outside package-transfer runtime until a raw-bare owner exists",
      originSupportBucket: "broad_fallback_guard",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["C", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "fallback_family_physics",
      errorBudgetPins: [],
      expectedBasisId: "predictor_floor_system_family_archetype_estimate",
      failureClass: "correct_block",
      id: "floor.open_box_timber_partial_finish.boundary",
      missingPhysicalInputs: ["completeResilientLayerPackage", "finishContinuityOwner", "packageTransferCompletenessOwner"],
      nextAction: "keep partial finish inputs out of package-transfer similarity instead of pretending the missing layer is present",
      originSupportBucket: "missing_input_boundary",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["C", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "exact",
      errorBudgetPins: [],
      expectedBasisId: "open_measured_floor_system_exact_match",
      failureClass: "correct_block",
      id: "floor.open_box_timber_exact_only_hybrid.boundary",
      missingPhysicalInputs: ["sourceEquivalentFragmentedPackagePolicy", "exactOnlyHybridTransferResidualOwner"],
      nextAction: "keep exact-only wet/dry hybrid rows exact-only until fragmented package equivalence is owned",
      originSupportBucket: "exact_source",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "exact",
      errorBudgetPins: [],
      expectedBasisId: "open_measured_floor_system_exact_match",
      failureClass: "correct_block",
      id: "floor.open_box_timber_mixed_staged.boundary",
      missingPhysicalInputs: ["mixedStagedUpperPackageInteractionOwner", "fragmentedExactEquivalentPackagePolicy"],
      nextAction: "keep mixed staged TUAS packets out of formula-transfer promotion until package interaction is owned",
      originSupportBucket: "exact_source",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "fallback_family_physics",
      errorBudgetPins: [],
      expectedBasisId: "predictor_floor_system_family_archetype_estimate",
      failureClass: "correct_block",
      id: "floor.open_box_timber_wrong_support_open_web.boundary",
      missingPhysicalInputs: ["sameSupportFamily=open_box_timber"],
      nextAction: "refuse open-web steel carriers as open-box timber package-transfer evidence",
      originSupportBucket: "wrong_family_guard",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["C", "CI", "CI,50-2500", "Ln,w+CI"],
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
      nextAction: "do not alias open-box lab package-transfer values to field or building outputs",
      originSupportBucket: "metric_boundary",
      requestedMetrics: ["L'n,w", "R'w", "DnT,w"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["L'n,w", "R'w", "DnT,w"],
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
      nextAction: "keep ISO Ln,w and CI open-box evidence out of ASTM IIC/AIIC outputs",
      originSupportBucket: "metric_boundary",
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
      id: "floor.open_box_timber_exact_only_hybrid_fragmentation.next",
      missingPhysicalInputs: [
        "sourceEquivalentFragmentedPackagePolicy",
        "exactOnlyHybridResidualOwner",
        "mixedStagedUpperPackageOwner"
      ],
      nextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    }
  ];
}

export function summarizeBroadAccuracyFloorOpenBoxTimberSimilarityCoverageRefresh(
  rows: readonly BroadAccuracyFloorOpenBoxTimberCoverageRow[]
): BroadAccuracyFloorOpenBoxTimberCoverageRefreshSummary {
  const failureClassCounts: Record<BroadAccuracyFloorOpenBoxTimberCoverageFailureClass, number> = {
    basis_boundary: 0,
    correct_block: 0,
    coverage_followup: 0,
    exact_precedence_boundary: 0,
    none: 0
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
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    supportedRuntimeRowIds: rows
      .filter((row) => row.expectedBasisId === OPEN_BOX_TIMBER_SIMILARITY_BASIS)
      .map((row) => row.id)
  };
}

export function buildBroadAccuracyFloorOpenBoxTimberSimilarityCoverageRefreshContract():
  BroadAccuracyFloorOpenBoxTimberCoverageRefreshContract {
  const matrixRows = buildBroadAccuracyFloorOpenBoxTimberSimilarityCoverageMatrix();

  return {
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS
    },
    remainingFollowups: [
      {
        id: "source_equivalent_fragmentation_policy",
        reason:
          "selected now because the supported open-box package-transfer lane is visible, exact rows stay first, and exact-only wet/dry hybrid plus mixed staged packets are the nearest same-family coverage gap",
        selectedNow: true
      },
      {
        id: "open_box_raw_bare_reopening_guard",
        reason: "not selected here because raw bare open-box inputs need a separate bare-carrier owner before package-transfer reuse",
        selectedNow: false
      },
      {
        id: "open_box_field_building_adapter",
        reason: "not selected here because lab package-transfer Ln,w/Rw cannot alias to field apparent or building-prediction outputs",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason: "not selected here because ISO Ln,w/CI evidence cannot create ASTM IIC/AIIC ratings",
        selectedNow: false
      }
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS,
    summary: summarizeBroadAccuracyFloorOpenBoxTimberSimilarityCoverageRefresh(matrixRows)
  };
}
