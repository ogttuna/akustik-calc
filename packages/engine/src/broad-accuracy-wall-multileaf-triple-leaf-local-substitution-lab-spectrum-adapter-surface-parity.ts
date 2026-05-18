import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_landed_selected_coverage_refresh";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh-contract.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "wall triple-leaf local substitution lab spectrum adapter coverage refresh";

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterSurfaceParityTarget =
  | "calculator_api_payload"
  | "dynamic_trace"
  | "exact_precedence_boundary"
  | "hostile_topology_boundary"
  | "local_saved_replay"
  | "markdown_report"
  | "method_dossier"
  | "output_cards"
  | "route_posture"
  | "server_snapshot_replay"
  | "unsupported_field_building_boundary";

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterSurfaceValuePin = {
  id: "generic_gypsum_glasswool" | "local_rockwool_mlv_plaster";
  expected: {
    cDb: number;
    ctrDb: number;
    errorBudgetDb: number;
    rwDb: number;
    stc: number;
  };
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterSurfaceParityContract = {
  landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE;
  previousAdapter: {
    landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS;
  };
  runtimeMethod: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD;
  runtimeMovedAtSurfaceParity: false;
  selectedCandidateId: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS;
  surfaceTargets: readonly BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterSurfaceParityTarget[];
  valuePins: readonly BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterSurfaceValuePin[];
};

export function buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterSurfaceParityContract():
  BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterSurfaceParityContract {
  return {
    landedGate:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE,
    previousAdapter: {
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS
    },
    runtimeMethod:
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
    runtimeMovedAtSurfaceParity: false,
    selectedCandidateId:
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
    selectedNextAction:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS,
    surfaceTargets: [
      "output_cards",
      "route_posture",
      "dynamic_trace",
      "method_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "markdown_report",
      "unsupported_field_building_boundary",
      "exact_precedence_boundary",
      "hostile_topology_boundary"
    ],
    valuePins: [
      {
        expected: {
          cDb: 1.6,
          ctrDb: -7.2,
          errorBudgetDb: 6,
          rwDb: 50,
          stc: 61
        },
        id: "generic_gypsum_glasswool"
      },
      {
        expected: {
          cDb: 1.6,
          ctrDb: -7.2,
          errorBudgetDb: 8,
          rwDb: 53,
          stc: 64
        },
        id: "local_rockwool_mlv_plaster"
      }
    ]
  };
}
