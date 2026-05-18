import {
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-open-web-supported-band-similarity-runtime";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_LANDED_GATE =
  "broad_accuracy_open_web_supported_band_similarity_surface_parity_plan";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS =
  "broad_accuracy_open_web_supported_band_similarity_surface_parity_landed_selected_coverage_refresh";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh-contract.test.ts";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "open-web supported-band similarity coverage refresh";

export type BroadAccuracyOpenWebSupportedBandSurfaceParityTarget =
  | "calculator_api_payload"
  | "impact_only_api_payload"
  | "local_saved_replay"
  | "markdown_report"
  | "method_dossier"
  | "output_cards"
  | "server_snapshot_replay";

export type BroadAccuracyOpenWebSupportedBandSurfaceValuePin = {
  id: "fl24_250mm_timber" | "fl26_250mm_bare" | "fl26_250mm_timber";
  expected: {
    CI: number;
    LnW: number;
    LnWPlusCI: number;
    Rw: number;
    fitPercent: number;
  };
};

export type BroadAccuracyOpenWebSupportedBandSurfaceParityContract = {
  basis: typeof OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS;
  landedGate: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_LANDED_GATE;
  previousRuntime: {
    landedGate: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTION_STATUS;
  };
  runtimeMovedAtSurfaceParity: false;
  selectedNextAction: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS;
  surfaceTargets: readonly BroadAccuracyOpenWebSupportedBandSurfaceParityTarget[];
  valuePins: readonly BroadAccuracyOpenWebSupportedBandSurfaceValuePin[];
};

export function buildBroadAccuracyOpenWebSupportedBandSimilaritySurfaceParityContract():
  BroadAccuracyOpenWebSupportedBandSurfaceParityContract {
  return {
    basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
    landedGate: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
    previousRuntime: {
      landedGate: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTION_STATUS
    },
    runtimeMovedAtSurfaceParity: false,
    selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS,
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
        expected: { CI: -1.5, LnW: 53.5, LnWPlusCI: 52, Rw: 61.5, fitPercent: 89.5 },
        id: "fl26_250mm_timber"
      },
      {
        expected: { CI: -1.5, LnW: 54.5, LnWPlusCI: 53, Rw: 60.5, fitPercent: 89.5 },
        id: "fl24_250mm_timber"
      },
      {
        expected: { CI: -1.5, LnW: 61.5, LnWPlusCI: 60, Rw: 61.5, fitPercent: 89.5 },
        id: "fl26_250mm_bare"
      }
    ]
  };
}
