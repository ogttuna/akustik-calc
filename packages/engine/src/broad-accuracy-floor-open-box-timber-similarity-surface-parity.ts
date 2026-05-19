import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-similarity-runtime-corridor";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_similarity_surface_parity_landed_selected_coverage_refresh";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "floor open-box timber similarity coverage refresh";

export type BroadAccuracyFloorOpenBoxTimberSurfaceParityTarget =
  | "calculator_api_payload"
  | "impact_only_api_payload"
  | "local_saved_replay"
  | "markdown_report"
  | "method_dossier"
  | "output_cards"
  | "server_snapshot_replay";

export type BroadAccuracyFloorOpenBoxTimberSurfaceValuePin = {
  readonly expected: {
    readonly CI: number;
    readonly CI50_2500: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
    readonly Rw: number;
    readonly RwPlusC: number;
    readonly fitPercent: number;
  };
  readonly id:
    | "source_absent_dry_gypsum_fiber_upper_mid_packet"
    | "source_absent_reinforced_ceiling_laminate_packet"
    | "source_absent_thin_laminate_eps_no_upper_packet";
};

export type BroadAccuracyFloorOpenBoxTimberSurfaceParityContract = {
  readonly basis: typeof OPEN_BOX_TIMBER_SIMILARITY_BASIS;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE;
  readonly previousRuntime: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS;
  };
  readonly runtimeMovedAtSurfaceParity: false;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS;
  readonly surfaceTargets: readonly BroadAccuracyFloorOpenBoxTimberSurfaceParityTarget[];
  readonly valuePins: readonly BroadAccuracyFloorOpenBoxTimberSurfaceValuePin[];
};

export function buildBroadAccuracyFloorOpenBoxTimberSimilaritySurfaceParityContract():
  BroadAccuracyFloorOpenBoxTimberSurfaceParityContract {
  return {
    basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
    previousRuntime: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS
    },
    runtimeMovedAtSurfaceParity: false,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS,
    surfaceTargets: [
      "output_cards",
      "method_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "impact_only_api_payload",
      "markdown_report"
    ],
    valuePins: [
      {
        expected: { CI: 1.3, CI50_2500: 3.3, LnW: 50.8, LnWPlusCI: 52, Rw: 66, RwPlusC: 62.1, fitPercent: 85 },
        id: "source_absent_dry_gypsum_fiber_upper_mid_packet"
      },
      {
        expected: { CI: 1.5, CI50_2500: 3.5, LnW: 53.5, LnWPlusCI: 55, Rw: 55.5, RwPlusC: 52.3, fitPercent: 90 },
        id: "source_absent_thin_laminate_eps_no_upper_packet"
      },
      {
        expected: { CI: 0.5, CI50_2500: 2, LnW: 53.5, LnWPlusCI: 54, Rw: 63.5, RwPlusC: 61.6, fitPercent: 83 },
        id: "source_absent_reinforced_ceiling_laminate_packet"
      }
    ]
  };
}
