import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_raw_bare_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_raw_bare_surface_parity_landed_selected_coverage_refresh";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "floor open-box timber raw-bare coverage refresh";

export type BroadAccuracyFloorOpenBoxTimberRawBareSurfaceParityTarget =
  | "calculator_api_payload"
  | "impact_only_api_payload"
  | "local_saved_replay"
  | "markdown_report"
  | "method_dossier"
  | "output_cards"
  | "server_snapshot_replay";

export type BroadAccuracyFloorOpenBoxTimberRawBareSurfaceValuePin = {
  readonly expected: {
    readonly C: number;
    readonly CI: number;
    readonly CI50_2500: number;
    readonly Ctr: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
    readonly Rw: number;
    readonly fitPercent: number;
  };
  readonly id:
    | "split_185_185_raw_bare_open_box_base_only"
    | "tagged_220mm_raw_bare_open_box_base_only"
    | "tagged_370mm_raw_bare_open_box_base_only";
};

export type BroadAccuracyFloorOpenBoxTimberRawBareSurfaceParityContract = {
  readonly basis: typeof OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE;
  readonly previousRuntime: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS;
  };
  readonly runtimeMovedAtSurfaceParity: false;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS;
  readonly surfaceTargets: readonly BroadAccuracyFloorOpenBoxTimberRawBareSurfaceParityTarget[];
  readonly valuePins: readonly BroadAccuracyFloorOpenBoxTimberRawBareSurfaceValuePin[];
};

export function buildBroadAccuracyFloorOpenBoxTimberRawBareSurfaceParityContract():
  BroadAccuracyFloorOpenBoxTimberRawBareSurfaceParityContract {
  return {
    basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
    previousRuntime: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS
    },
    runtimeMovedAtSurfaceParity: false,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS,
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
        expected: { C: -1.4, CI: -1.1, CI50_2500: 3.1, Ctr: -5.8, LnW: 88.2, LnWPlusCI: 87.1, Rw: 42.3, fitPercent: 100 },
        id: "tagged_370mm_raw_bare_open_box_base_only"
      },
      {
        expected: { C: -1.4, CI: -1.1, CI50_2500: 3.1, Ctr: -5.8, LnW: 88.2, LnWPlusCI: 87.1, Rw: 42.3, fitPercent: 100 },
        id: "split_185_185_raw_bare_open_box_base_only"
      },
      {
        expected: { C: -1.6, CI: -0.9, CI50_2500: 3.4, Ctr: -6.2, LnW: 91.1, LnWPlusCI: 90.2, Rw: 38.1, fitPercent: 100 },
        id: "tagged_220mm_raw_bare_open_box_base_only"
      }
    ]
  };
}
