import {
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-open-web-supported-band-similarity-coverage-refresh";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD
} from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_landed_selected_surface_parity";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_FILE =
  "apps/web/features/workbench/wall-triple-leaf-calibrated-solver-surface-parity.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_LABEL =
  "wall triple-leaf calibrated solver surface parity";

export type BroadAccuracyWallTripleLeafCalibratedScenarioId =
  | "nrc_2024_assembly_a_internal_board"
  | "nrc_2024_assembly_b_internal_board"
  | "nrc_2024_assembly_d_internal_board";

export type BroadAccuracyWallTripleLeafCalibratedScenario = {
  assemblyId: BroadAccuracyWallTripleLeafCalibratedScenarioId;
  expected: {
    C: number;
    Ctr: number;
    Rw: number;
    STC: number;
  };
  topologyVariant: "one_internal_one_receiving_extra_board" | "one_internal_symmetric" | "two_internal_symmetric";
};

export type BroadAccuracyWallTripleLeafCalibratedBoundaryId =
  | "rockwool_mlv_plaster_local_stack_stays_uncalibrated"
  | "generic_gypsum_or_glasswool_without_source_family_identity_stays_out"
  | "field_and_building_outputs_do_not_alias_lab_calibrated_rw"
  | "exact_source_candidate_remains_separate_from_calibrated_family_candidate"
  | "duplicate_or_missing_grouped_topology_fails_closed";

export type BroadAccuracyWallTripleLeafCalibratedSolverContract = {
  errorBudgetDb: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB;
  landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_LANDED_GATE;
  negativeBoundaries: readonly BroadAccuracyWallTripleLeafCalibratedBoundaryId[];
  previousCoverageRefresh: {
    landedGate: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS;
  };
  runtimeMethod: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD;
  runtimeMovementThisGate: true;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTION_STATUS;
  sourceFamilyInputs: readonly string[];
  supportedScenarios: readonly BroadAccuracyWallTripleLeafCalibratedScenario[];
};

export function buildBroadAccuracyWallMultileafTripleLeafCalibratedSolverContract():
  BroadAccuracyWallTripleLeafCalibratedSolverContract {
  return {
    errorBudgetDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
    landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_LANDED_GATE,
    negativeBoundaries: [
      "rockwool_mlv_plaster_local_stack_stays_uncalibrated",
      "generic_gypsum_or_glasswool_without_source_family_identity_stays_out",
      "field_and_building_outputs_do_not_alias_lab_calibrated_rw",
      "exact_source_candidate_remains_separate_from_calibrated_family_candidate",
      "duplicate_or_missing_grouped_topology_fails_closed"
    ],
    previousCoverageRefresh: {
      landedGate: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS
    },
    runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
    runtimeMovementThisGate: true,
    selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTION_STATUS,
    sourceFamilyInputs: [
      "nrc_type_c_gypsum_board",
      "nrc_glass_fiber_batt",
      "grouped_triple_leaf topology",
      "two 92.1 mm full porous absorptive cavities",
      "independent internal leaf coupling",
      "independent frame support topology"
    ],
    supportedScenarios: [
      {
        assemblyId: "nrc_2024_assembly_b_internal_board",
        expected: { C: 1.4, Ctr: -7.4, Rw: 49, STC: 60 },
        topologyVariant: "one_internal_symmetric"
      },
      {
        assemblyId: "nrc_2024_assembly_a_internal_board",
        expected: { C: 0.3, Ctr: -7.9, Rw: 58, STC: 64 },
        topologyVariant: "one_internal_one_receiving_extra_board"
      },
      {
        assemblyId: "nrc_2024_assembly_d_internal_board",
        expected: { C: 1.2, Ctr: -7.5, Rw: 55, STC: 65 },
        topologyVariant: "two_internal_symmetric"
      }
    ]
  };
}
