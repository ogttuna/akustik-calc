import {
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-open-web-supported-band-similarity-surface-parity";
import { type BroadAccuracyMetricId } from "./broad-accuracy-reference-benchmark-expansion";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE =
  "broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS =
  "broad_accuracy_open_web_supported_band_similarity_coverage_refresh_landed_selected_wall_multileaf_triple_leaf_solver";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-contract.test.ts";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL =
  "wall multileaf triple-leaf calibrated solver";

export type BroadAccuracyOpenWebSupportedBandCoverageMetricId = BroadAccuracyMetricId | "CI";

export type BroadAccuracyOpenWebSupportedBandCoverageRowId =
  | "floor.open_web_supported_band_fl26_250_timber.lab"
  | "floor.open_web_supported_band_fl24_250_timber.lab"
  | "floor.open_web_supported_band_fl26_250_bare.lab"
  | "floor.open_web_supported_band_fl26_300_exact_precedence.lab"
  | "floor.open_web_supported_band_fl28_existing_seed.lab"
  | "floor.open_web_supported_band_missing_fill.needs_input"
  | "floor.open_web_supported_band_carpet_bound.unsupported"
  | "floor.open_web_supported_band_field_lnw.boundary"
  | "floor.open_web_supported_band_astm_iic.unsupported"
  | "floor.open_web_direct_fixed_lining.followup"
  | "floor.open_box_timber_similarity.followup"
  | "wall.multileaf_triple_leaf_screening_blend.next";

export type BroadAccuracyOpenWebSupportedBandCoveragePosture =
  | "exact"
  | "family_physics"
  | "followup_ranked"
  | "needs_input"
  | "unsupported";

export type BroadAccuracyOpenWebSupportedBandCoverageFailureClass =
  | "basis_boundary"
  | "correct_block"
  | "coverage_followup"
  | "none"
  | "unsupported_metric";

export type BroadAccuracyOpenWebSupportedBandCoverageRow = {
  basis: "astm_rating_boundary" | "element_lab" | "field_apparent";
  currentPosture: BroadAccuracyOpenWebSupportedBandCoveragePosture;
  expectedBasisId: string | null;
  failureClass: BroadAccuracyOpenWebSupportedBandCoverageFailureClass;
  id: BroadAccuracyOpenWebSupportedBandCoverageRowId;
  missingPhysicalInputs: readonly string[];
  nextAction: string;
  originSupportBucket:
    | "bound_only_guard"
    | "existing_narrow_seed"
    | "exact_source"
    | "metric_boundary"
    | "ranked_followup"
    | "source_absent_family_physics";
  requestedMetrics: readonly BroadAccuracyOpenWebSupportedBandCoverageMetricId[];
  route: "floor" | "wall";
  supportedTargetOutputs: readonly BroadAccuracyOpenWebSupportedBandCoverageMetricId[];
  unsupportedTargetOutputs: readonly BroadAccuracyOpenWebSupportedBandCoverageMetricId[];
  valuePins: readonly {
    metric: BroadAccuracyOpenWebSupportedBandCoverageMetricId;
    value: number;
  }[];
};

export type BroadAccuracyOpenWebSupportedBandCoverageRefreshContract = {
  landedGate: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE;
  matrixRows: readonly BroadAccuracyOpenWebSupportedBandCoverageRow[];
  noRuntimeValueMovement: true;
  previousSurfaceParity: {
    landedGate: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS;
  };
  remainingFollowups: readonly {
    id: "open_box_timber_measured_similarity" | "open_web_steel_direct_fixed_lining_similarity";
    reason: string;
    selectedNow: false;
  }[];
  selectedNextAction: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS;
  summary: BroadAccuracyOpenWebSupportedBandCoverageRefreshSummary;
};

export type BroadAccuracyOpenWebSupportedBandCoverageRefreshSummary = {
  basisBoundaryRowIds: readonly BroadAccuracyOpenWebSupportedBandCoverageRowId[];
  correctlyBlockedRowIds: readonly BroadAccuracyOpenWebSupportedBandCoverageRowId[];
  exactSourcePrecedenceRowIds: readonly BroadAccuracyOpenWebSupportedBandCoverageRowId[];
  failureClassCounts: Record<BroadAccuracyOpenWebSupportedBandCoverageFailureClass, number>;
  noRuntimeValueMovement: true;
  rankedFollowupRowIds: readonly BroadAccuracyOpenWebSupportedBandCoverageRowId[];
  rowCount: number;
  selectedNextAction: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  supportedRuntimeRowIds: readonly BroadAccuracyOpenWebSupportedBandCoverageRowId[];
};

export function buildBroadAccuracyOpenWebSupportedBandSimilarityCoverageMatrix():
  readonly BroadAccuracyOpenWebSupportedBandCoverageRow[] {
  return [
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedBasisId: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      failureClass: "none",
      id: "floor.open_web_supported_band_fl26_250_timber.lab",
      missingPhysicalInputs: [],
      nextAction: "keep supported-band runtime pinned in current gate",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 53.5 },
        { metric: "CI", value: -1.5 },
        { metric: "Ln,w+CI", value: 52 },
        { metric: "Rw", value: 61.5 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedBasisId: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      failureClass: "none",
      id: "floor.open_web_supported_band_fl24_250_timber.lab",
      missingPhysicalInputs: [],
      nextAction: "keep supported-band runtime pinned in current gate",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 54.5 },
        { metric: "CI", value: -1.5 },
        { metric: "Ln,w+CI", value: 53 },
        { metric: "Rw", value: 60.5 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedBasisId: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      failureClass: "none",
      id: "floor.open_web_supported_band_fl26_250_bare.lab",
      missingPhysicalInputs: [],
      nextAction: "keep supported-band runtime pinned in current gate",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 61.5 },
        { metric: "CI", value: -1.5 },
        { metric: "Ln,w+CI", value: 60 },
        { metric: "Rw", value: 61.5 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "exact",
      expectedBasisId: "official_floor_system_exact_match",
      failureClass: "none",
      id: "floor.open_web_supported_band_fl26_300_exact_precedence.lab",
      missingPhysicalInputs: [],
      nextAction: "keep exact UBIQ row ahead of similarity estimate",
      originSupportBucket: "exact_source",
      requestedMetrics: ["Rw", "Ln,w", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 53 },
        { metric: "Ln,w+CI", value: 51 },
        { metric: "Rw", value: 62 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedBasisId: "predictor_lightweight_steel_fl28_interpolation_estimate",
      failureClass: "none",
      id: "floor.open_web_supported_band_fl28_existing_seed.lab",
      missingPhysicalInputs: [],
      nextAction: "preserve existing FL-28 interpolation seed outside supported-band runtime",
      originSupportBucket: "existing_narrow_seed",
      requestedMetrics: ["Rw", "Ln,w", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 51.5 },
        { metric: "Ln,w+CI", value: 50 },
        { metric: "Rw", value: 63.5 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.open_web_supported_band_missing_fill.needs_input",
      missingPhysicalInputs: ["ceilingFillThicknessMm", "ceilingFillMaterialClass"],
      nextAction: "ask for missing lower-assembly fields instead of estimating from incomplete topology",
      originSupportBucket: "bound_only_guard",
      requestedMetrics: ["Rw", "Ln,w", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "unsupported",
      expectedBasisId: null,
      failureClass: "unsupported_metric",
      id: "floor.open_web_supported_band_carpet_bound.unsupported",
      missingPhysicalInputs: ["same-stack carpet Ln,w source owner"],
      nextAction: "keep carpet bound rows out of supported-band similarity until a same-stack impact owner exists",
      originSupportBucket: "bound_only_guard",
      requestedMetrics: ["Rw", "Ln,w", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: ["Ln,w", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "field_apparent",
      currentPosture: "needs_input",
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "floor.open_web_supported_band_field_lnw.boundary",
      missingPhysicalInputs: ["receivingRoomVolumeM3", "receivingRoomRt60S", "junctionOrFlankingContext"],
      nextAction: "do not alias lab Ln,w to field apparent L'n,w",
      originSupportBucket: "metric_boundary",
      requestedMetrics: ["L'n,w"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["L'n,w"],
      valuePins: []
    },
    {
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      expectedBasisId: null,
      failureClass: "unsupported_metric",
      id: "floor.open_web_supported_band_astm_iic.unsupported",
      missingPhysicalInputs: ["ASTM E492/E989 IIC rating curve owner"],
      nextAction: "keep ISO Ln,w rows out of ASTM IIC/AIIC outputs",
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
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "floor.open_web_direct_fixed_lining.followup",
      missingPhysicalInputs: ["directFixedLiningTransferOwner"],
      nextAction: "rank as open-web follow-up after direct-fixed lower-support transfer is owned",
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "Ln,w", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "followup_ranked",
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "floor.open_box_timber_similarity.followup",
      missingPhysicalInputs: ["openBoxTimberWetDryHybridInteractionOwner"],
      nextAction: "rank as a floor follow-up but keep it out of open-web steel similarity",
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "Ln,w"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "Ln,w"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "followup_ranked",
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "wall.multileaf_triple_leaf_screening_blend.next",
      missingPhysicalInputs: ["calibratedTripleLeafFrequencySolverOwner", "screeningBlendRetirementContract"],
      nextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      valuePins: []
    }
  ];
}

export function summarizeBroadAccuracyOpenWebSupportedBandSimilarityCoverageRefresh(
  rows: readonly BroadAccuracyOpenWebSupportedBandCoverageRow[]
): BroadAccuracyOpenWebSupportedBandCoverageRefreshSummary {
  const failureClassCounts: Record<BroadAccuracyOpenWebSupportedBandCoverageFailureClass, number> = {
    basis_boundary: 0,
    correct_block: 0,
    coverage_followup: 0,
    none: 0,
    unsupported_metric: 0
  };

  for (const row of rows) {
    failureClassCounts[row.failureClass] += 1;
  }

  return {
    basisBoundaryRowIds: rows.filter((row) => row.failureClass === "basis_boundary").map((row) => row.id),
    correctlyBlockedRowIds: rows
      .filter((row) => row.failureClass === "correct_block" || row.failureClass === "unsupported_metric")
      .map((row) => row.id),
    exactSourcePrecedenceRowIds: rows.filter((row) => row.currentPosture === "exact").map((row) => row.id),
    failureClassCounts,
    noRuntimeValueMovement: true,
    rankedFollowupRowIds: rows.filter((row) => row.failureClass === "coverage_followup").map((row) => row.id),
    rowCount: rows.length,
    selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    supportedRuntimeRowIds: rows
      .filter((row) => row.expectedBasisId === OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS)
      .map((row) => row.id)
  };
}

export function buildBroadAccuracyOpenWebSupportedBandSimilarityCoverageRefreshContract():
  BroadAccuracyOpenWebSupportedBandCoverageRefreshContract {
  const matrixRows = buildBroadAccuracyOpenWebSupportedBandSimilarityCoverageMatrix();

  return {
    landedGate: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      landedGate: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS
    },
    remainingFollowups: [
      {
        id: "open_web_steel_direct_fixed_lining_similarity",
        reason: "direct-fixed lower support needs its own transfer owner before runtime promotion",
        selectedNow: false
      },
      {
        id: "open_box_timber_measured_similarity",
        reason: "open-box timber measured rows need a separate wet/dry hybrid owner and must not borrow open-web steel",
        selectedNow: false
      }
    ],
    selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS,
    summary: summarizeBroadAccuracyOpenWebSupportedBandSimilarityCoverageRefresh(matrixRows)
  };
}
