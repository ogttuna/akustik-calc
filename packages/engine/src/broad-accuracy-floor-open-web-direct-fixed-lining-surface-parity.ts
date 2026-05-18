import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_LANDED_GATE =
  "broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_landed_selected_coverage_refresh";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "floor open-web direct-fixed lining coverage refresh";

export type BroadAccuracyFloorOpenWebDirectFixedSurfaceParityTarget =
  | "calculator_api_payload"
  | "impact_only_api_payload"
  | "local_saved_replay"
  | "markdown_report"
  | "method_dossier"
  | "output_cards"
  | "server_snapshot_replay";

export type BroadAccuracyFloorOpenWebDirectFixedSurfaceValuePin = {
  readonly expected: {
    readonly CI: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
    readonly Rw: number;
    readonly RwCtr: number;
    readonly fitPercent: number;
  };
  readonly id:
    | "fl23_250mm_19mm_timber_direct_fixed"
    | "fl25_250mm_16mm_bare_direct_fixed"
    | "fl27_350mm_19mm_carpet_direct_fixed";
};

export type BroadAccuracyFloorOpenWebDirectFixedSurfaceParityContract = {
  readonly basis: typeof OPEN_WEB_DIRECT_FIXED_LINING_BASIS;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_LANDED_GATE;
  readonly previousRuntime: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTION_STATUS;
  };
  readonly runtimeMovedAtSurfaceParity: false;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTION_STATUS;
  readonly surfaceTargets: readonly BroadAccuracyFloorOpenWebDirectFixedSurfaceParityTarget[];
  readonly valuePins: readonly BroadAccuracyFloorOpenWebDirectFixedSurfaceValuePin[];
};

export function buildBroadAccuracyFloorOpenWebDirectFixedLiningSurfaceParityContract():
  BroadAccuracyFloorOpenWebDirectFixedSurfaceParityContract {
  return {
    basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_LANDED_GATE,
    previousRuntime: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTION_STATUS
    },
    runtimeMovedAtSurfaceParity: false,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTION_STATUS,
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
        expected: { CI: -0.5, LnW: 71, LnWPlusCI: 70.5, Rw: 51, RwCtr: 43.5, fitPercent: 92 },
        id: "fl23_250mm_19mm_timber_direct_fixed"
      },
      {
        expected: { CI: -0.5, LnW: 77, LnWPlusCI: 76.5, Rw: 51, RwCtr: 43.5, fitPercent: 92 },
        id: "fl25_250mm_16mm_bare_direct_fixed"
      },
      {
        expected: { CI: -1, LnW: 63, LnWPlusCI: 62, Rw: 54.5, RwCtr: 47.5, fitPercent: 92 },
        id: "fl27_350mm_19mm_carpet_direct_fixed"
      }
    ]
  };
}
