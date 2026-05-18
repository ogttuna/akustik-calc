import { type BroadAccuracyMetricId } from "./broad-accuracy-reference-benchmark-expansion";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD } from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_landed_selected_coverage_refresh";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh-contract.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_landed_selected_local_substitution_mapping";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping-contract.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL =
  "wall triple-leaf local substitution mapping";

export type BroadAccuracyWallTripleLeafCoverageRowId =
  | "wall.nrc_2024_assembly_b_lab.calibrated"
  | "wall.nrc_2024_assembly_a_lab.calibrated"
  | "wall.nrc_2024_assembly_d_lab.calibrated"
  | "wall.nrc_2024_mixed_lab_field_request.needs_input"
  | "wall.nrc_2024_building_request.boundary"
  | "wall.nrc_2024_exact_candidate.precedence_boundary"
  | "wall.generic_gypsum_glasswool_substitution.followup"
  | "wall.local_rockwool_mlv_plaster_substitution.followup"
  | "wall.duplicate_grouped_topology.needs_input"
  | "wall.flat_or_partial_grouped_topology.needs_input"
  | "floor.open_web_direct_fixed_lining.followup"
  | "floor.open_box_timber_similarity.followup";

export type BroadAccuracyWallTripleLeafCoveragePosture =
  | "calibrated_family_physics"
  | "exact_candidate_blocked"
  | "followup_ranked"
  | "needs_input"
  | "unsupported";

export type BroadAccuracyWallTripleLeafCoverageFailureClass =
  | "basis_boundary"
  | "correct_block"
  | "coverage_followup"
  | "exact_precedence_boundary"
  | "none";

export type BroadAccuracyWallTripleLeafCoverageRow = {
  basis: "building_prediction" | "element_lab" | "field_apparent";
  currentPosture: BroadAccuracyWallTripleLeafCoveragePosture;
  expectedBasisId: string | null;
  failureClass: BroadAccuracyWallTripleLeafCoverageFailureClass;
  id: BroadAccuracyWallTripleLeafCoverageRowId;
  missingPhysicalInputs: readonly string[];
  nextAction: string;
  originSupportBucket:
    | "calibrated_family_physics"
    | "exact_source_precedence"
    | "field_building_boundary"
    | "input_guard"
    | "ranked_followup";
  requestedMetrics: readonly BroadAccuracyMetricId[];
  route: "floor" | "wall";
  supportedTargetOutputs: readonly BroadAccuracyMetricId[];
  unsupportedTargetOutputs: readonly BroadAccuracyMetricId[];
  valuePins: readonly {
    metric: BroadAccuracyMetricId;
    value: number;
  }[];
};

export type BroadAccuracyWallTripleLeafCoverageRefreshSummary = {
  basisBoundaryRowIds: readonly BroadAccuracyWallTripleLeafCoverageRowId[];
  correctlyBlockedRowIds: readonly BroadAccuracyWallTripleLeafCoverageRowId[];
  exactPrecedenceBoundaryRowIds: readonly BroadAccuracyWallTripleLeafCoverageRowId[];
  failureClassCounts: Record<BroadAccuracyWallTripleLeafCoverageFailureClass, number>;
  noRuntimeValueMovement: true;
  rankedFollowupRowIds: readonly BroadAccuracyWallTripleLeafCoverageRowId[];
  rowCount: number;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  supportedRuntimeRowIds: readonly BroadAccuracyWallTripleLeafCoverageRowId[];
};

export type BroadAccuracyWallTripleLeafCoverageRefreshContract = {
  landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_LANDED_GATE;
  matrixRows: readonly BroadAccuracyWallTripleLeafCoverageRow[];
  noRuntimeValueMovement: true;
  previousRuntimeGate: {
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTION_STATUS;
  };
  previousSurfaceParity: {
    landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_SELECTION_STATUS;
  };
  remainingFollowups: readonly {
    id:
      | "open_box_timber_measured_similarity"
      | "open_web_steel_direct_fixed_lining_similarity"
      | "wall_generic_gypsum_glasswool_substitution"
      | "wall_local_rockwool_mlv_plaster_substitution";
    reason: string;
    selectedNow: boolean;
  }[];
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTION_STATUS;
  summary: BroadAccuracyWallTripleLeafCoverageRefreshSummary;
};

export function buildBroadAccuracyWallTripleLeafCalibratedSolverCoverageMatrix():
  readonly BroadAccuracyWallTripleLeafCoverageRow[] {
  return [
    {
      basis: "element_lab",
      currentPosture: "calibrated_family_physics",
      expectedBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
      failureClass: "none",
      id: "wall.nrc_2024_assembly_b_lab.calibrated",
      missingPhysicalInputs: [],
      nextAction: "keep NRC 2024 Assembly B calibrated runtime pinned",
      originSupportBucket: "calibrated_family_physics",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 49 },
        { metric: "STC", value: 60 },
        { metric: "C", value: 1.4 },
        { metric: "Ctr", value: -7.4 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "calibrated_family_physics",
      expectedBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
      failureClass: "none",
      id: "wall.nrc_2024_assembly_a_lab.calibrated",
      missingPhysicalInputs: [],
      nextAction: "keep NRC 2024 Assembly A calibrated runtime pinned",
      originSupportBucket: "calibrated_family_physics",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 58 },
        { metric: "STC", value: 64 },
        { metric: "C", value: 0.3 },
        { metric: "Ctr", value: -7.9 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "calibrated_family_physics",
      expectedBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
      failureClass: "none",
      id: "wall.nrc_2024_assembly_d_lab.calibrated",
      missingPhysicalInputs: [],
      nextAction: "keep NRC 2024 Assembly D calibrated runtime pinned",
      originSupportBucket: "calibrated_family_physics",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 55 },
        { metric: "STC", value: 65 },
        { metric: "C", value: 1.2 },
        { metric: "Ctr", value: -7.5 }
      ]
    },
    {
      basis: "field_apparent",
      currentPosture: "needs_input",
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "wall.nrc_2024_mixed_lab_field_request.needs_input",
      missingPhysicalInputs: ["contextMode", "partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
      nextAction: "keep R'w and DnT,w as field-context prompts when lab and field metrics are mixed",
      originSupportBucket: "field_building_boundary",
      requestedMetrics: ["Rw", "R'w", "DnT,w"],
      route: "wall",
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: ["R'w", "DnT,w"],
      valuePins: [{ metric: "Rw", value: 49 }]
    },
    {
      basis: "building_prediction",
      currentPosture: "unsupported",
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "wall.nrc_2024_building_request.boundary",
      missingPhysicalInputs: ["flankingPathTermsOwner", "junctionVibrationReductionIndexOwner", "roomNormalizationOwner"],
      nextAction: "do not reuse calibrated lab Rw as building R'w or DnT,w",
      originSupportBucket: "field_building_boundary",
      requestedMetrics: ["R'w", "DnT,w"],
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["R'w", "DnT,w"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "exact_candidate_blocked",
      expectedBasisId: null,
      failureClass: "exact_precedence_boundary",
      id: "wall.nrc_2024_exact_candidate.precedence_boundary",
      missingPhysicalInputs: ["trustedExactSourceRowOwner", "rightsSafeLocatorMetadata"],
      nextAction: "keep exact-source admission separate from calibrated family prediction",
      originSupportBucket: "exact_source_precedence",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "followup_ranked",
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "wall.generic_gypsum_glasswool_substitution.followup",
      missingPhysicalInputs: ["sourceFamilyMaterialEquivalenceOwner", "surfaceMassCorrectionOwner"],
      nextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "followup_ranked",
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "wall.local_rockwool_mlv_plaster_substitution.followup",
      missingPhysicalInputs: ["localMaterialFamilyMappingOwner", "limpMassAndAbsorberCouplingOwner"],
      nextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "wall.duplicate_grouped_topology.needs_input",
      missingPhysicalInputs: ["nonOverlappingLeafGrouping"],
      nextAction: "refuse duplicate grouped layer ownership instead of selecting a calibrated candidate",
      originSupportBucket: "input_guard",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "wall.flat_or_partial_grouped_topology.needs_input",
      missingPhysicalInputs: ["wallTopology.topologyMode", "cavity1LayerIndices", "cavity2LayerIndices", "internalLeafLayerIndices"],
      nextAction: "ask for complete grouped triple-leaf topology before applying a two-cavity solver",
      originSupportBucket: "input_guard",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "followup_ranked",
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "floor.open_web_direct_fixed_lining.followup",
      missingPhysicalInputs: ["directFixedLiningTransferOwner"],
      nextAction: "rank after wall local substitution because it needs a separate lower-support transfer owner",
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
      nextAction: "rank after wall local substitution and keep it out of open-web steel similarity",
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "Ln,w"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "Ln,w"],
      valuePins: []
    }
  ];
}

export function summarizeBroadAccuracyWallTripleLeafCalibratedSolverCoverageRefresh(
  rows: readonly BroadAccuracyWallTripleLeafCoverageRow[]
): BroadAccuracyWallTripleLeafCoverageRefreshSummary {
  const failureClassCounts: Record<BroadAccuracyWallTripleLeafCoverageFailureClass, number> = {
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
    selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    supportedRuntimeRowIds: rows
      .filter((row) => row.expectedBasisId === BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD)
      .map((row) => row.id)
  };
}

export function buildBroadAccuracyWallTripleLeafCalibratedSolverCoverageRefreshContract():
  BroadAccuracyWallTripleLeafCoverageRefreshContract {
  const matrixRows = buildBroadAccuracyWallTripleLeafCalibratedSolverCoverageMatrix();

  return {
    landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    previousRuntimeGate: {
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTION_STATUS
    },
    previousSurfaceParity: {
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SURFACE_PARITY_SELECTION_STATUS
    },
    remainingFollowups: [
      {
        id: "wall_generic_gypsum_glasswool_substitution",
        reason: "selected now because it can broaden the calibrated triple-leaf solver without changing source rows",
        selectedNow: true
      },
      {
        id: "wall_local_rockwool_mlv_plaster_substitution",
        reason: "selected now because local material mappings block realistic wall calculator coverage",
        selectedNow: true
      },
      {
        id: "open_web_steel_direct_fixed_lining_similarity",
        reason: "still needs a direct-fixed lower-support transfer owner before runtime promotion",
        selectedNow: false
      },
      {
        id: "open_box_timber_measured_similarity",
        reason: "still needs a wet/dry hybrid interaction owner and must not borrow open-web steel",
        selectedNow: false
      }
    ],
    selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTION_STATUS,
    summary: summarizeBroadAccuracyWallTripleLeafCalibratedSolverCoverageRefresh(matrixRows)
  };
}
