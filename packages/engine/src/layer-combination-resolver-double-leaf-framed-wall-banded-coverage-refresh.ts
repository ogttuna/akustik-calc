import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTION_STATUS,
  buildLayerCombinationResolverDoubleLeafFramedWallBandedSurfaceParityContract
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity";
import type {
  LayerCombinationResolverBasis,
  LayerCombinationResolverMetricId,
  LayerCombinationResolverRoute
} from "./layer-combination-resolver-registry";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE =
  "layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_plan";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS =
  "layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_landed_no_runtime_selected_post_double_leaf_revalidation";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL =
  "layer combination resolver post double-leaf framed wall banded coverage revalidation";

export type LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRowId =
  | "wall.double_leaf_framed.independent_absorbed.lab"
  | "wall.double_leaf_framed.resilient_both_sides.lab"
  | "wall.double_leaf_framed.resilient_one_side.lab"
  | "wall.double_leaf_framed.exact_precedence.boundary"
  | "wall.double_leaf_framed.missing_resilient_side_count.needs_input"
  | "wall.double_leaf_framed.overlapping_leaf_groups.needs_input"
  | "wall.double_leaf_framed.direct_fixed.boundary"
  | "wall.double_leaf_framed.grouped_triple_leaf.boundary"
  | "wall.double_leaf_framed.field_overlay.boundary"
  | "wall.double_leaf_framed.building_prediction.boundary"
  | "wall.double_leaf_framed.floor_impact.unsupported"
  | "wall.double_leaf_framed.astm_iic.unsupported"
  | "wall.double_leaf_framed.post_coverage_revalidation.next";

export type LayerCombinationResolverDoubleLeafFramedWallBandedCoveragePosture =
  | "exact_precedence"
  | "family_physics"
  | "followup_ranked"
  | "needs_input"
  | "separate_lane_boundary"
  | "unsupported";

export type LayerCombinationResolverDoubleLeafFramedWallBandedCoverageFailureClass =
  | "basis_boundary"
  | "coverage_followup"
  | "exact_precedence_boundary"
  | "needs_input_boundary"
  | "none"
  | "separate_lane_boundary"
  | "unsupported_boundary";

export type LayerCombinationResolverDoubleLeafFramedWallBandedCoverageBudgetPin = {
  readonly metric: LayerCombinationResolverMetricId;
  readonly notMeasuredEvidence: true;
  readonly toleranceDb: number;
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRow = {
  readonly basis: LayerCombinationResolverBasis;
  readonly currentPosture: LayerCombinationResolverDoubleLeafFramedWallBandedCoveragePosture;
  readonly errorBudgetPins: readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageBudgetPin[];
  readonly expectedBasisId: string | null;
  readonly expectedCandidateId: string | null;
  readonly failureClass: LayerCombinationResolverDoubleLeafFramedWallBandedCoverageFailureClass;
  readonly id: LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRowId;
  readonly missingPhysicalInputs: readonly string[];
  readonly nextAction: string;
  readonly originSupportBucket:
    | "basis_boundary"
    | "exact_source_precedence"
    | "ranked_followup"
    | "separate_wall_family"
    | "source_absent_family_physics"
    | "unsupported_or_incomplete_topology";
  readonly requestedMetrics: readonly LayerCombinationResolverMetricId[];
  readonly route: LayerCombinationResolverRoute;
  readonly supportedTargetOutputs: readonly LayerCombinationResolverMetricId[];
  readonly unsupportedTargetOutputs: readonly LayerCombinationResolverMetricId[];
  readonly valuePins: readonly {
    readonly metric: LayerCombinationResolverMetricId;
    readonly value: number;
  }[];
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshSummary = {
  readonly basisBoundaryRowIds: readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRowId[];
  readonly exactPrecedenceBoundaryRowIds: readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRowId[];
  readonly failureClassCounts: Record<LayerCombinationResolverDoubleLeafFramedWallBandedCoverageFailureClass, number>;
  readonly noRuntimeValueMovement: true;
  readonly rankedFollowupRowIds: readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRowId[];
  readonly rowCount: number;
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  readonly separateLaneBoundaryRowIds: readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRowId[];
  readonly supportedRuntimeRowIds: readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRowId[];
  readonly unsupportedRowIds: readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRowId[];
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract = {
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE;
  readonly matrixRows: readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRow[];
  readonly noRuntimeValueMovement: true;
  readonly previousSurfaceParity: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTION_STATUS;
  };
  readonly remainingFollowups: readonly {
    readonly id:
      | "broad_source_crawl"
      | "double_leaf_field_building_adapter"
      | "double_leaf_holdout_acquisition"
      | "post_double_leaf_revalidation"
      | "tolerance_retune";
    readonly reason: string;
    readonly selectedNow: boolean;
  }[];
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS;
  readonly summary: LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshSummary;
};

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly LayerCombinationResolverMetricId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly LayerCombinationResolverMetricId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly LayerCombinationResolverMetricId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly LayerCombinationResolverMetricId[];

const INDEPENDENT_BUDGETS = [
  { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 7 },
  { metric: "STC", notMeasuredEvidence: true, toleranceDb: 7 },
  { metric: "C", notMeasuredEvidence: true, toleranceDb: 2.5 },
  { metric: "Ctr", notMeasuredEvidence: true, toleranceDb: 4.5 }
] as const satisfies readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageBudgetPin[];

const RESILIENT_BUDGETS = [
  { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 8 },
  { metric: "STC", notMeasuredEvidence: true, toleranceDb: 8 },
  { metric: "C", notMeasuredEvidence: true, toleranceDb: 2.5 },
  { metric: "Ctr", notMeasuredEvidence: true, toleranceDb: 4.5 }
] as const satisfies readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageBudgetPin[];

const INDEPENDENT_VALUES = [
  { metric: "Rw", value: 45 },
  { metric: "STC", value: 45 },
  { metric: "C", value: -1 },
  { metric: "Ctr", value: -6.1 }
] as const satisfies LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRow["valuePins"];

const RESILIENT_BOTH_VALUES = [
  { metric: "Rw", value: 46 },
  { metric: "STC", value: 46 },
  { metric: "C", value: -1.1 },
  { metric: "Ctr", value: -6.2 }
] as const satisfies LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRow["valuePins"];

const RESILIENT_ONE_VALUES = [
  { metric: "Rw", value: 45 },
  { metric: "STC", value: 45 },
  { metric: "C", value: -1.1 },
  { metric: "Ctr", value: -6.2 }
] as const satisfies LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRow["valuePins"];

function runtimeRow(
  id: Extract<
    LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRowId,
    | "wall.double_leaf_framed.independent_absorbed.lab"
    | "wall.double_leaf_framed.resilient_both_sides.lab"
    | "wall.double_leaf_framed.resilient_one_side.lab"
  >,
  valuePins: LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRow["valuePins"],
  errorBudgetPins: readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageBudgetPin[],
  nextAction: string
): LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRow {
  return {
    basis: "element_lab",
    currentPosture: "family_physics",
    errorBudgetPins,
    expectedBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    expectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    failureClass: "none",
    id,
    missingPhysicalInputs: [],
    nextAction,
    originSupportBucket: "source_absent_family_physics",
    requestedMetrics: LAB_OUTPUTS,
    route: "wall",
    supportedTargetOutputs: LAB_OUTPUTS,
    unsupportedTargetOutputs: [],
    valuePins
  };
}

export function buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageMatrix():
  readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRow[] {
  return [
    runtimeRow(
      "wall.double_leaf_framed.independent_absorbed.lab",
      INDEPENDENT_VALUES,
      INDEPENDENT_BUDGETS,
      "keep independent absorbed double-leaf/framed wall candidate trace pinned"
    ),
    runtimeRow(
      "wall.double_leaf_framed.resilient_both_sides.lab",
      RESILIENT_BOTH_VALUES,
      RESILIENT_BUDGETS,
      "keep resilient both-sides double-leaf/framed wall candidate trace pinned"
    ),
    runtimeRow(
      "wall.double_leaf_framed.resilient_one_side.lab",
      RESILIENT_ONE_VALUES,
      RESILIENT_BUDGETS,
      "keep resilient one-side double-leaf/framed wall candidate trace pinned"
    ),
    {
      basis: "element_lab",
      currentPosture: "exact_precedence",
      errorBudgetPins: [],
      expectedBasisId: "verified_airborne_exact_source",
      expectedCandidateId: "wall.exact_verified_airborne.same_leaf_schedule",
      failureClass: "exact_precedence_boundary",
      id: "wall.double_leaf_framed.exact_precedence.boundary",
      missingPhysicalInputs: [],
      nextAction: "keep exact same-stack wall rows ahead of the source-absent double-leaf formula",
      originSupportBucket: "exact_source_precedence",
      requestedMetrics: LAB_OUTPUTS,
      route: "wall",
      supportedTargetOutputs: LAB_OUTPUTS,
      unsupportedTargetOutputs: [],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      expectedCandidateId: "candidate_dynamic_needs_input",
      failureClass: "needs_input_boundary",
      id: "wall.double_leaf_framed.missing_resilient_side_count.needs_input",
      missingPhysicalInputs: ["resilientBarSideCount"],
      nextAction: "ask for resilientBarSideCount instead of assuming one-side or both-sides coupling",
      originSupportBucket: "unsupported_or_incomplete_topology",
      requestedMetrics: LAB_OUTPUTS,
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: LAB_OUTPUTS,
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      expectedCandidateId: "candidate_dynamic_needs_input",
      failureClass: "needs_input_boundary",
      id: "wall.double_leaf_framed.overlapping_leaf_groups.needs_input",
      missingPhysicalInputs: ["nonOverlappingSideLeafGroups"],
      nextAction: "ask for non-overlapping side leaf groups when layer ownership is ambiguous",
      originSupportBucket: "unsupported_or_incomplete_topology",
      requestedMetrics: LAB_OUTPUTS,
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: LAB_OUTPUTS,
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "separate_lane_boundary",
      errorBudgetPins: [],
      expectedBasisId: null,
      expectedCandidateId: "candidate_multileaf_screening_fallback",
      failureClass: "separate_lane_boundary",
      id: "wall.double_leaf_framed.direct_fixed.boundary",
      missingPhysicalInputs: ["directFixedDoubleLeafOwner"],
      nextAction: "keep direct-fixed double-leaf walls outside this non-direct-fixed bridge corridor",
      originSupportBucket: "separate_wall_family",
      requestedMetrics: LAB_OUTPUTS,
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: LAB_OUTPUTS,
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "separate_lane_boundary",
      errorBudgetPins: [],
      expectedBasisId: null,
      expectedCandidateId: "candidate_grouped_triple_leaf_local_substitution",
      failureClass: "separate_lane_boundary",
      id: "wall.double_leaf_framed.grouped_triple_leaf.boundary",
      missingPhysicalInputs: ["tripleLeafOrMulticavityOwner"],
      nextAction: "keep grouped triple-leaf and multicavity stacks on their separate wall-family owners",
      originSupportBucket: "separate_wall_family",
      requestedMetrics: LAB_OUTPUTS,
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: LAB_OUTPUTS,
      valuePins: []
    },
    {
      basis: "field_apparent",
      currentPosture: "separate_lane_boundary",
      errorBudgetPins: [],
      expectedBasisId: "field_side_overlay",
      expectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      failureClass: "basis_boundary",
      id: "wall.double_leaf_framed.field_overlay.boundary",
      missingPhysicalInputs: [],
      nextAction: "keep R'w and DnT,w on explicit field overlay without rewriting lab Rw/STC candidate trace pins",
      originSupportBucket: "basis_boundary",
      requestedMetrics: FIELD_OUTPUTS,
      route: "wall",
      supportedTargetOutputs: FIELD_OUTPUTS,
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 45 },
        { metric: "STC", value: 45 }
      ]
    },
    {
      basis: "building_prediction",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      expectedCandidateId: "generic.lab_field_building_basis_boundary",
      failureClass: "basis_boundary",
      id: "wall.double_leaf_framed.building_prediction.boundary",
      missingPhysicalInputs: ["flankingPathOwner", "junctionCouplingOwner", "roomNormalizationOwner"],
      nextAction: "keep building prediction blocked until direct, flanking, junction, and room-normalization owners exist",
      originSupportBucket: "basis_boundary",
      requestedMetrics: FIELD_OUTPUTS,
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: FIELD_OUTPUTS,
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "unsupported",
      errorBudgetPins: [],
      expectedBasisId: null,
      expectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary",
      failureClass: "unsupported_boundary",
      id: "wall.double_leaf_framed.floor_impact.unsupported",
      missingPhysicalInputs: ["floorImpactFamilyOwner"],
      nextAction: "keep floor-impact outputs out of wall double-leaf airborne formulas",
      originSupportBucket: "unsupported_or_incomplete_topology",
      requestedMetrics: IMPACT_OUTPUTS,
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: IMPACT_OUTPUTS,
      valuePins: []
    },
    {
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      errorBudgetPins: [],
      expectedBasisId: null,
      expectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary",
      failureClass: "unsupported_boundary",
      id: "wall.double_leaf_framed.astm_iic.unsupported",
      missingPhysicalInputs: ["astmRatingCurveOwner", "testStandardBasis"],
      nextAction: "keep ASTM/IIC requests blocked; STC remains current display compatibility only",
      originSupportBucket: "unsupported_or_incomplete_topology",
      requestedMetrics: ASTM_OUTPUTS,
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ASTM_OUTPUTS,
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "followup_ranked",
      errorBudgetPins: [],
      expectedBasisId: null,
      expectedCandidateId: null,
      failureClass: "coverage_followup",
      id: "wall.double_leaf_framed.post_coverage_revalidation.next",
      missingPhysicalInputs: [],
      nextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: LAB_OUTPUTS,
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: [],
      valuePins: []
    }
  ];
}

function failureClassCounts(
  rows: readonly LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRow[]
): Record<LayerCombinationResolverDoubleLeafFramedWallBandedCoverageFailureClass, number> {
  return {
    basis_boundary: rows.filter((row) => row.failureClass === "basis_boundary").length,
    coverage_followup: rows.filter((row) => row.failureClass === "coverage_followup").length,
    exact_precedence_boundary: rows.filter((row) => row.failureClass === "exact_precedence_boundary").length,
    needs_input_boundary: rows.filter((row) => row.failureClass === "needs_input_boundary").length,
    none: rows.filter((row) => row.failureClass === "none").length,
    separate_lane_boundary: rows.filter((row) => row.failureClass === "separate_lane_boundary").length,
    unsupported_boundary: rows.filter((row) => row.failureClass === "unsupported_boundary").length
  };
}

export function buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract():
  LayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract {
  const surfaceParity = buildLayerCombinationResolverDoubleLeafFramedWallBandedSurfaceParityContract();
  const matrixRows = buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageMatrix();

  return {
    landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      landedGate: surfaceParity.landedGate,
      selectedNextAction: surfaceParity.selectedNextAction,
      selectedNextFile: surfaceParity.selectedNextFile,
      selectionStatus: surfaceParity.selectionStatus
    },
    remainingFollowups: [
      {
        id: "post_double_leaf_revalidation",
        reason: "selected to rerank common wall/floor gaps after double-leaf runtime, surface, and coverage are closed",
        selectedNow: true
      },
      {
        id: "double_leaf_holdout_acquisition",
        reason: "blocked until the post-coverage revalidation names a bounded rights-safe holdout target",
        selectedNow: false
      },
      {
        id: "double_leaf_field_building_adapter",
        reason: "blocked because field/building outputs need direct/flanking/junction/room owners before runtime promotion",
        selectedNow: false
      },
      {
        id: "tolerance_retune",
        reason: "blocked because this refresh introduced no new measured residuals or holdouts",
        selectedNow: false
      },
      {
        id: "broad_source_crawl",
        reason: "blocked because exact rows are evidence and holdouts, not the calculator product",
        selectedNow: false
      }
    ],
    selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS,
    summary: {
      basisBoundaryRowIds: matrixRows.filter((row) => row.failureClass === "basis_boundary").map((row) => row.id),
      exactPrecedenceBoundaryRowIds: matrixRows
        .filter((row) => row.failureClass === "exact_precedence_boundary")
        .map((row) => row.id),
      failureClassCounts: failureClassCounts(matrixRows),
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: matrixRows.filter((row) => row.failureClass === "coverage_followup").map((row) => row.id),
      rowCount: matrixRows.length,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      separateLaneBoundaryRowIds: matrixRows
        .filter((row) => row.failureClass === "separate_lane_boundary")
        .map((row) => row.id),
      supportedRuntimeRowIds: matrixRows.filter((row) => row.failureClass === "none").map((row) => row.id),
      unsupportedRowIds: matrixRows.filter((row) => row.failureClass === "unsupported_boundary").map((row) => row.id)
    }
  };
}
