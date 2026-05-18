import { type BroadAccuracyMetricId } from "./broad-accuracy-reference-benchmark-expansion";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD } from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD } from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD } from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_landed_selected_field_context_harmonization";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization-contract.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL =
  "wall triple-leaf local substitution field context harmonization";

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRowId =
  | "wall.generic_gypsum_glasswool_local_substitution.lab_spectrum_adapter"
  | "wall.local_rockwool_mlv_plaster_local_substitution.lab_spectrum_adapter"
  | "wall.local_rockwool_mlv_plaster_local_substitution.stc_only_adapter"
  | "wall.nrc_2024_calibrated_control.precedence_boundary"
  | "wall.local_substitution_exact_same_stack_source.precedence_boundary"
  | "wall.local_substitution_lab_plus_field_request.needs_input"
  | "wall.local_substitution_complete_field_context.separate_field_route"
  | "wall.local_substitution_field_context_harmonization.followup_selected"
  | "wall.local_substitution_building_prediction.boundary"
  | "wall.local_substitution_flat_or_partial_topology.needs_input"
  | "wall.local_substitution_duplicate_grouping.needs_input_boundary"
  | "floor.open_web_direct_fixed_lining.followup"
  | "floor.open_box_timber_similarity.followup";

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoveragePosture =
  | "calibrated_control"
  | "exact_candidate_blocked"
  | "field_family_physics"
  | "followup_ranked"
  | "lab_spectrum_family_physics"
  | "needs_input"
  | "unsupported";

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageFailureClass =
  | "basis_boundary"
  | "correct_block"
  | "coverage_followup"
  | "exact_precedence_boundary"
  | "none";

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRow = {
  basis: "building_prediction" | "element_lab" | "field_apparent";
  currentPosture: BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoveragePosture;
  expectedBasisId: string | null;
  failureClass: BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageFailureClass;
  id: BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRowId;
  missingPhysicalInputs: readonly string[];
  nextAction: string;
  originSupportBucket:
    | "calibrated_family_precedence"
    | "exact_source_precedence"
    | "field_building_boundary"
    | "field_context_family_physics"
    | "input_guard"
    | "ranked_followup"
    | "source_absent_lab_spectrum_family_physics";
  requestedMetrics: readonly BroadAccuracyMetricId[];
  route: "floor" | "wall";
  supportedTargetOutputs: readonly BroadAccuracyMetricId[];
  unsupportedTargetOutputs: readonly BroadAccuracyMetricId[];
  valuePins: readonly {
    metric: BroadAccuracyMetricId;
    value: number;
  }[];
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefreshSummary = {
  basisBoundaryRowIds: readonly BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRowId[];
  correctlyBlockedRowIds: readonly BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRowId[];
  exactPrecedenceBoundaryRowIds: readonly BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRowId[];
  failureClassCounts: Record<BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageFailureClass, number>;
  noRuntimeValueMovement: true;
  rankedFollowupRowIds: readonly BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRowId[];
  rowCount: number;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  supportedRuntimeRowIds: readonly BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRowId[];
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefreshContract = {
  landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE;
  matrixRows: readonly BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRow[];
  noRuntimeValueMovement: true;
  previousSurfaceParity: {
    landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS;
  };
  remainingFollowups: readonly {
    id:
      | "floor_open_box_timber_similarity"
      | "floor_open_web_direct_fixed_lining_similarity"
      | "wall_local_substitution_field_context_harmonization";
    reason: string;
    selectedNow: boolean;
  }[];
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS;
  summary: BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefreshSummary;
};

export function buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageMatrix():
  readonly BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRow[] {
  return [
    {
      basis: "element_lab",
      currentPosture: "lab_spectrum_family_physics",
      expectedBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      failureClass: "none",
      id: "wall.generic_gypsum_glasswool_local_substitution.lab_spectrum_adapter",
      missingPhysicalInputs: [],
      nextAction: "keep generic gypsum/glasswool lab Rw/STC/C/Ctr adapter runtime pinned",
      originSupportBucket: "source_absent_lab_spectrum_family_physics",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 50 },
        { metric: "STC", value: 61 },
        { metric: "C", value: 1.6 },
        { metric: "Ctr", value: -7.2 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "lab_spectrum_family_physics",
      expectedBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      failureClass: "none",
      id: "wall.local_rockwool_mlv_plaster_local_substitution.lab_spectrum_adapter",
      missingPhysicalInputs: [],
      nextAction: "keep local Rockwool/MLV/plaster lab Rw/STC/C/Ctr adapter runtime pinned",
      originSupportBucket: "source_absent_lab_spectrum_family_physics",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 53 },
        { metric: "STC", value: 64 },
        { metric: "C", value: 1.6 },
        { metric: "Ctr", value: -7.2 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "lab_spectrum_family_physics",
      expectedBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      failureClass: "none",
      id: "wall.local_rockwool_mlv_plaster_local_substitution.stc_only_adapter",
      missingPhysicalInputs: [],
      nextAction: "keep STC-only requests on the calculated curve adapter rather than copying Rw or falling back",
      originSupportBucket: "source_absent_lab_spectrum_family_physics",
      requestedMetrics: ["STC"],
      route: "wall",
      supportedTargetOutputs: ["STC"],
      unsupportedTargetOutputs: [],
      valuePins: [{ metric: "STC", value: 64 }]
    },
    {
      basis: "element_lab",
      currentPosture: "calibrated_control",
      expectedBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
      failureClass: "none",
      id: "wall.nrc_2024_calibrated_control.precedence_boundary",
      missingPhysicalInputs: [],
      nextAction: "keep NRC 2024 source-family calibrated control ahead of local substitution",
      originSupportBucket: "calibrated_family_precedence",
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
      currentPosture: "exact_candidate_blocked",
      expectedBasisId: null,
      failureClass: "exact_precedence_boundary",
      id: "wall.local_substitution_exact_same_stack_source.precedence_boundary",
      missingPhysicalInputs: ["sameStackExactSourceRowOwner", "rightsSafeLocatorMetadata", "metricBasisOwner"],
      nextAction: "keep exact source admission separate from the source-absent lab spectrum adapter",
      originSupportBucket: "exact_source_precedence",
      requestedMetrics: ["Rw", "STC", "C", "Ctr"],
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      valuePins: []
    },
    {
      basis: "field_apparent",
      currentPosture: "needs_input",
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "wall.local_substitution_lab_plus_field_request.needs_input",
      missingPhysicalInputs: ["contextMode", "partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
      nextAction: "keep lab Rw/STC/C/Ctr from aliasing to R'w or DnT,w when field context is missing",
      originSupportBucket: "field_building_boundary",
      requestedMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"],
      route: "wall",
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedTargetOutputs: ["R'w", "DnT,w"],
      valuePins: [
        { metric: "Rw", value: 53 },
        { metric: "STC", value: 64 },
        { metric: "C", value: 1.6 },
        { metric: "Ctr", value: -7.2 }
      ]
    },
    {
      basis: "field_apparent",
      currentPosture: "field_family_physics",
      expectedBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      failureClass: "none",
      id: "wall.local_substitution_complete_field_context.separate_field_route",
      missingPhysicalInputs: [],
      nextAction:
        "keep complete field context on the local-substitution lab-curve field harmonization adapter rather than relabelling lab metrics",
      originSupportBucket: "field_context_family_physics",
      requestedMetrics: ["R'w", "DnT,w"],
      route: "wall",
      supportedTargetOutputs: ["R'w", "DnT,w"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "R'w", value: 51 },
        { metric: "DnT,w", value: 53 }
      ]
    },
    {
      basis: "field_apparent",
      currentPosture: "followup_ranked",
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "wall.local_substitution_field_context_harmonization.followup_selected",
      missingPhysicalInputs: [
        "localSubstitutionFieldContextHarmonizationOwner",
        "localSubstitutionRwAnchorOwner",
        "fieldBudgetReconciliationOwner"
      ],
      nextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["R'w", "DnT,w"],
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["R'w", "DnT,w"],
      valuePins: []
    },
    {
      basis: "building_prediction",
      currentPosture: "unsupported",
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "wall.local_substitution_building_prediction.boundary",
      missingPhysicalInputs: ["flankingPathTermsOwner", "junctionVibrationReductionIndexOwner", "roomNormalizationOwner"],
      nextAction: "do not reuse local-substitution lab metrics as building R'w or DnT,w",
      originSupportBucket: "field_building_boundary",
      requestedMetrics: ["R'w", "DnT,w"],
      route: "wall",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["R'w", "DnT,w"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "wall.local_substitution_flat_or_partial_topology.needs_input",
      missingPhysicalInputs: [
        "wallTopology.topologyMode",
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "cavity2DepthMm",
        "sideBLeafGroup",
        "supportTopology"
      ],
      nextAction: "ask for complete grouped triple-leaf topology before local-substitution runtime",
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
      id: "wall.local_substitution_duplicate_grouping.needs_input_boundary",
      missingPhysicalInputs: ["leafGrouping"],
      nextAction: "keep duplicate or overlapping grouped leaf ownership out of local-substitution runtime",
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
      nextAction: "rank after local-substitution field-context harmonization",
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
      missingPhysicalInputs: ["openBoxTimberWetDryHybridInteractionOwner", "wrongSupportFamilyNegativeBoundaryOwner"],
      nextAction: "rank after direct-fixed open-web because open-box timber needs its own support-family solver",
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "Ln,w"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "Ln,w"],
      valuePins: []
    }
  ];
}

export function summarizeBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefresh(
  rows: readonly BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRow[]
): BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefreshSummary {
  const failureClassCounts: Record<BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageFailureClass, number> = {
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
    selectedNextAction:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    supportedRuntimeRowIds: rows
      .filter((row) => row.expectedBasisId !== null && row.failureClass === "none")
      .map((row) => row.id)
  };
}

export function buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefreshContract():
  BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefreshContract {
  const matrixRows = buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageMatrix();

  return {
    landedGate:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      landedGate:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS
    },
    remainingFollowups: [
      {
        id: "wall_local_substitution_field_context_harmonization",
        reason:
          "selected now because lab Rw/STC/C/Ctr is live and the next same-family accuracy gap is field R'w/DnT,w harmonization against that lab anchor",
        selectedNow: true
      },
      {
        id: "floor_open_web_direct_fixed_lining_similarity",
        reason: "still needs a direct-fixed lower-support transfer owner before runtime promotion",
        selectedNow: false
      },
      {
        id: "floor_open_box_timber_similarity",
        reason: "still needs an open-box timber wet/dry support-family owner and negative boundary",
        selectedNow: false
      }
    ],
    selectedNextAction:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS,
    summary:
      summarizeBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefresh(matrixRows)
  };
}
