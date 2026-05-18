import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_landed_selected_coverage_refresh";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh-contract.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "wall triple-leaf local substitution coverage refresh";

export type BroadAccuracyWallTripleLeafLocalSubstitutionSurfaceParityTarget =
  | "calculator_api_payload"
  | "dynamic_branch"
  | "local_saved_replay"
  | "markdown_report"
  | "method_dossier"
  | "output_cards"
  | "route_posture"
  | "server_snapshot_replay"
  | "unsupported_metric_boundary";

export type BroadAccuracyWallTripleLeafLocalSubstitutionSurfaceValuePin = {
  id: "generic_gypsum_glasswool" | "local_rockwool_mlv_plaster";
  expected: {
    designCorridorRwDb: number;
    errorBudgetDb: number;
    liveRwDb: number;
  };
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionSurfaceParityContract = {
  candidateId: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID;
  landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_LANDED_GATE;
  metricBoundaries: {
    buildingPredictionMetricsBlocked: true;
    fieldMetricsBlocked: true;
    stcCAndCtrAdaptersBlocked: true;
  };
  previousRuntime: {
    landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS;
  };
  runtimeMethod: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD;
  runtimeMovedAtSurfaceParity: false;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTION_STATUS;
  surfaceTargets: readonly BroadAccuracyWallTripleLeafLocalSubstitutionSurfaceParityTarget[];
  valuePins: readonly BroadAccuracyWallTripleLeafLocalSubstitutionSurfaceValuePin[];
};

export function buildBroadAccuracyWallTripleLeafLocalSubstitutionSurfaceParityContract():
  BroadAccuracyWallTripleLeafLocalSubstitutionSurfaceParityContract {
  return {
    candidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
    landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_LANDED_GATE,
    metricBoundaries: {
      buildingPredictionMetricsBlocked: true,
      fieldMetricsBlocked: true,
      stcCAndCtrAdaptersBlocked: true
    },
    previousRuntime: {
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS
    },
    runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
    runtimeMovedAtSurfaceParity: false,
    selectedNextAction:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTION_STATUS,
    surfaceTargets: [
      "output_cards",
      "route_posture",
      "dynamic_branch",
      "method_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "markdown_report",
      "unsupported_metric_boundary"
    ],
    valuePins: [
      {
        expected: {
          designCorridorRwDb: 49.3,
          errorBudgetDb: 6,
          liveRwDb: 50
        },
        id: "generic_gypsum_glasswool"
      },
      {
        expected: {
          designCorridorRwDb: 52.8,
          errorBudgetDb: 8,
          liveRwDb: 53
        },
        id: "local_rockwool_mlv_plaster"
      }
    ]
  };
}
