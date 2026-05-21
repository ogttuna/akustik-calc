import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-raw-bare-runtime-corridor";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE =
  "broad_accuracy_floor_open_web_raw_bare_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_raw_bare_surface_parity_landed_selected_coverage_refresh";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_raw_bare_coverage_refresh_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "floor open-web raw-bare coverage refresh";

export type BroadAccuracyFloorOpenWebRawBareSurfaceParityTarget =
  | "calculator_api_payload"
  | "impact_only_api_payload"
  | "local_saved_replay"
  | "markdown_report"
  | "method_dossier"
  | "output_cards"
  | "server_snapshot_replay";

export type BroadAccuracyFloorOpenWebRawBareSurfaceValuePin = {
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
    | "split_150_150_raw_bare_open_web_base_only"
    | "tagged_300mm_raw_bare_open_web_base_only"
    | "tagged_400mm_raw_bare_open_web_base_only";
};

export type BroadAccuracyFloorOpenWebRawBareSurfaceParityContract = {
  readonly basis: typeof OPEN_WEB_RAW_BARE_FORMULA_BASIS;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE;
  readonly previousRuntime: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS;
  };
  readonly runtimeMovedAtSurfaceParity: false;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS;
  readonly surfaceTargets: readonly BroadAccuracyFloorOpenWebRawBareSurfaceParityTarget[];
  readonly valuePins: readonly BroadAccuracyFloorOpenWebRawBareSurfaceValuePin[];
};

export function buildBroadAccuracyFloorOpenWebRawBareSurfaceParityContract():
  BroadAccuracyFloorOpenWebRawBareSurfaceParityContract {
  return {
    basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
    previousRuntime: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS
    },
    runtimeMovedAtSurfaceParity: false,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS,
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
        expected: { C: -2.2, CI: 1.8, CI50_2500: 5.2, Ctr: -7.8, LnW: 96, LnWPlusCI: 97.8, Rw: 32, fitPercent: 100 },
        id: "tagged_300mm_raw_bare_open_web_base_only"
      },
      {
        expected: { C: -2.2, CI: 1.8, CI50_2500: 5.2, Ctr: -7.8, LnW: 96, LnWPlusCI: 97.8, Rw: 32, fitPercent: 100 },
        id: "split_150_150_raw_bare_open_web_base_only"
      },
      {
        expected: { C: -2, CI: 1.3, CI50_2500: 4.6, Ctr: -7.5, LnW: 92.8, LnWPlusCI: 94.1, Rw: 36.6, fitPercent: 100 },
        id: "tagged_400mm_raw_bare_open_web_base_only"
      }
    ]
  };
}
