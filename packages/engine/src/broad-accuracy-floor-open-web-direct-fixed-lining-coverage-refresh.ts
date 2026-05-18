import { type BroadAccuracyMetricId } from "./broad-accuracy-reference-benchmark-expansion";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE =
  "broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_landed_selected_open_box_timber_transfer_owner";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_LABEL =
  "floor open-box timber similarity transfer owner";

export type BroadAccuracyFloorOpenWebDirectFixedCoverageMetricId =
  | BroadAccuracyMetricId
  | "CI"
  | "Rw+Ctr";

export type BroadAccuracyFloorOpenWebDirectFixedCoverageRowId =
  | "floor.open_web_direct_fixed_fl23_250_timber.lab"
  | "floor.open_web_direct_fixed_fl25_250_bare.lab"
  | "floor.open_web_direct_fixed_fl27_350_carpet.lab"
  | "floor.open_web_direct_fixed_fl23_300_timber.exact_precedence"
  | "floor.open_web_supported_band_fl26_250_timber.separate_lane"
  | "floor.open_web_direct_fixed_out_of_band_depth.boundary"
  | "floor.open_web_direct_fixed_duplicate_carrier.boundary"
  | "floor.open_web_direct_fixed_field_lnw.boundary"
  | "floor.open_web_direct_fixed_airborne_field.boundary"
  | "floor.open_web_direct_fixed_astm_iic.unsupported"
  | "floor.open_box_timber_similarity.next";

export type BroadAccuracyFloorOpenWebDirectFixedCoveragePosture =
  | "exact"
  | "fallback_family_physics"
  | "family_physics"
  | "followup_ranked"
  | "needs_input"
  | "separate_family_physics"
  | "unsupported";

export type BroadAccuracyFloorOpenWebDirectFixedCoverageFailureClass =
  | "basis_boundary"
  | "correct_block"
  | "coverage_followup"
  | "exact_precedence_boundary"
  | "none"
  | "separate_lane_boundary";

export type BroadAccuracyFloorOpenWebDirectFixedCoverageRow = {
  basis: "astm_rating_boundary" | "element_lab" | "field_apparent";
  currentPosture: BroadAccuracyFloorOpenWebDirectFixedCoveragePosture;
  expectedBasisId: string | null;
  failureClass: BroadAccuracyFloorOpenWebDirectFixedCoverageFailureClass;
  id: BroadAccuracyFloorOpenWebDirectFixedCoverageRowId;
  missingPhysicalInputs: readonly string[];
  nextAction: string;
  originSupportBucket:
    | "broad_fallback_guard"
    | "exact_source"
    | "metric_boundary"
    | "ranked_followup"
    | "separate_owned_lane"
    | "source_absent_family_physics";
  requestedMetrics: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageMetricId[];
  route: "floor" | "wall";
  supportedTargetOutputs: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageMetricId[];
  unsupportedTargetOutputs: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageMetricId[];
  valuePins: readonly {
    metric: BroadAccuracyFloorOpenWebDirectFixedCoverageMetricId;
    value: number;
  }[];
};

export type BroadAccuracyFloorOpenWebDirectFixedCoverageRefreshSummary = {
  basisBoundaryRowIds: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageRowId[];
  correctlyBlockedRowIds: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageRowId[];
  exactPrecedenceBoundaryRowIds: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageRowId[];
  failureClassCounts: Record<BroadAccuracyFloorOpenWebDirectFixedCoverageFailureClass, number>;
  noRuntimeValueMovement: true;
  rankedFollowupRowIds: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageRowId[];
  rowCount: number;
  selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  separateLaneBoundaryRowIds: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageRowId[];
  supportedRuntimeRowIds: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageRowId[];
};

export type BroadAccuracyFloorOpenWebDirectFixedCoverageRefreshContract = {
  landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE;
  matrixRows: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageRow[];
  noRuntimeValueMovement: true;
  previousSurfaceParity: {
    landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTION_STATUS;
  };
  remainingFollowups: readonly {
    id:
      | "airborne_or_impact_field_building_adapters"
      | "astm_iic_aiic_rating_curve_owner"
      | "open_box_timber_measured_similarity";
    reason: string;
    selectedNow: boolean;
  }[];
  selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS;
  summary: BroadAccuracyFloorOpenWebDirectFixedCoverageRefreshSummary;
};

export function buildBroadAccuracyFloorOpenWebDirectFixedLiningCoverageMatrix():
  readonly BroadAccuracyFloorOpenWebDirectFixedCoverageRow[] {
  return [
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedBasisId: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      failureClass: "none",
      id: "floor.open_web_direct_fixed_fl23_250_timber.lab",
      missingPhysicalInputs: [],
      nextAction: "keep FL-23 250 mm timber direct-fixed runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "Rw+Ctr", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Rw+Ctr", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 71 },
        { metric: "CI", value: -0.5 },
        { metric: "Ln,w+CI", value: 70.5 },
        { metric: "Rw", value: 51 },
        { metric: "Rw+Ctr", value: 43.5 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedBasisId: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      failureClass: "none",
      id: "floor.open_web_direct_fixed_fl25_250_bare.lab",
      missingPhysicalInputs: [],
      nextAction: "keep FL-25 250 mm bare direct-fixed runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "Rw+Ctr", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Rw+Ctr", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 77 },
        { metric: "CI", value: -0.5 },
        { metric: "Ln,w+CI", value: 76.5 },
        { metric: "Rw", value: 51 },
        { metric: "Rw+Ctr", value: 43.5 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedBasisId: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      failureClass: "none",
      id: "floor.open_web_direct_fixed_fl27_350_carpet.lab",
      missingPhysicalInputs: [],
      nextAction: "keep FL-27 350 mm carpet direct-fixed runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "Rw+Ctr", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Rw+Ctr", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 63 },
        { metric: "CI", value: -1 },
        { metric: "Ln,w+CI", value: 62 },
        { metric: "Rw", value: 54.5 },
        { metric: "Rw+Ctr", value: 47.5 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "exact",
      expectedBasisId: "official_floor_system_exact_match",
      failureClass: "exact_precedence_boundary",
      id: "floor.open_web_direct_fixed_fl23_300_timber.exact_precedence",
      missingPhysicalInputs: [],
      nextAction: "keep exact UBIQ FL-23 300 mm row ahead of direct-fixed interpolation",
      originSupportBucket: "exact_source",
      requestedMetrics: ["Rw", "Rw+Ctr", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Rw+Ctr", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 71 },
        { metric: "CI", value: -1 },
        { metric: "Ln,w+CI", value: 70 },
        { metric: "Rw", value: 51 },
        { metric: "Rw+Ctr", value: 44 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "separate_family_physics",
      expectedBasisId: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.open_web_supported_band_fl26_250_timber.separate_lane",
      missingPhysicalInputs: [],
      nextAction: "keep resilient supported-band stacks on their owned lane, not direct-fixed interpolation",
      originSupportBucket: "separate_owned_lane",
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
      currentPosture: "fallback_family_physics",
      expectedBasisId: "predictor_floor_system_family_archetype_estimate",
      failureClass: "correct_block",
      id: "floor.open_web_direct_fixed_out_of_band_depth.boundary",
      missingPhysicalInputs: ["directFixedCarrierDepthWithin200To400MmSourceGrid"],
      nextAction: "keep out-of-band carrier depths out of the direct-fixed source grid",
      originSupportBucket: "broad_fallback_guard",
      requestedMetrics: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "fallback_family_physics",
      expectedBasisId: "predictor_floor_system_family_archetype_estimate",
      failureClass: "correct_block",
      id: "floor.open_web_direct_fixed_duplicate_carrier.boundary",
      missingPhysicalInputs: ["singleExplicitOpenWebBaseStructureCarrier"],
      nextAction: "refuse duplicate open-web carriers as direct-fixed interpolation input",
      originSupportBucket: "broad_fallback_guard",
      requestedMetrics: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: []
    },
    {
      basis: "field_apparent",
      currentPosture: "needs_input",
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "floor.open_web_direct_fixed_field_lnw.boundary",
      missingPhysicalInputs: ["impactFieldContext", "receivingRoomVolumeM3", "receivingRoomRt60S", "junctionOrFlankingContext"],
      nextAction: "do not alias direct-fixed lab Ln,w to field apparent L'n,w",
      originSupportBucket: "metric_boundary",
      requestedMetrics: ["L'n,w"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["L'n,w"],
      valuePins: []
    },
    {
      basis: "field_apparent",
      currentPosture: "unsupported",
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "floor.open_web_direct_fixed_airborne_field.boundary",
      missingPhysicalInputs: ["airborneFieldContextOwner", "separatingElementAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
      nextAction: "do not reuse floor-impact direct-fixed lab evidence as R'w or DnT,w",
      originSupportBucket: "metric_boundary",
      requestedMetrics: ["R'w", "DnT,w"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["R'w", "DnT,w"],
      valuePins: []
    },
    {
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.open_web_direct_fixed_astm_iic.unsupported",
      missingPhysicalInputs: ["ASTM E492/E989 IIC rating curve owner"],
      nextAction: "keep ISO Ln,w direct-fixed rows out of ASTM IIC/AIIC outputs",
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
      id: "floor.open_box_timber_similarity.next",
      missingPhysicalInputs: ["openBoxTimberWetDryHybridInteractionOwner", "samePackageFragmentationBoundary", "rawBareCarrierReopeningGuard"],
      nextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "Ln,w", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      valuePins: []
    }
  ];
}

export function summarizeBroadAccuracyFloorOpenWebDirectFixedLiningCoverageRefresh(
  rows: readonly BroadAccuracyFloorOpenWebDirectFixedCoverageRow[]
): BroadAccuracyFloorOpenWebDirectFixedCoverageRefreshSummary {
  const failureClassCounts: Record<BroadAccuracyFloorOpenWebDirectFixedCoverageFailureClass, number> = {
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
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    separateLaneBoundaryRowIds: rows
      .filter((row) => row.failureClass === "separate_lane_boundary")
      .map((row) => row.id),
    supportedRuntimeRowIds: rows
      .filter((row) => row.expectedBasisId === OPEN_WEB_DIRECT_FIXED_LINING_BASIS)
      .map((row) => row.id)
  };
}

export function buildBroadAccuracyFloorOpenWebDirectFixedLiningCoverageRefreshContract():
  BroadAccuracyFloorOpenWebDirectFixedCoverageRefreshContract {
  const matrixRows = buildBroadAccuracyFloorOpenWebDirectFixedLiningCoverageMatrix();

  return {
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTION_STATUS
    },
    remainingFollowups: [
      {
        id: "open_box_timber_measured_similarity",
        reason:
          "selected now because direct-fixed open-web is closed and open-box timber is the remaining floor similarity lane with exact packaged evidence but no safe measured-similarity transfer owner",
        selectedNow: true
      },
      {
        id: "airborne_or_impact_field_building_adapters",
        reason: "not selected here because lab direct-fixed evidence cannot alias to field or building metrics",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason: "not selected here because ISO Ln,w/CI single-number evidence cannot create ASTM IIC/AIIC ratings",
        selectedNow: false
      }
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS,
    summary: summarizeBroadAccuracyFloorOpenWebDirectFixedLiningCoverageRefresh(matrixRows)
  };
}
