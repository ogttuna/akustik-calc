import {
  BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTION_STATUS
} from "./broad-accuracy-floor-system-similarity-anchor";
import { type BroadAccuracyMetricId } from "./broad-accuracy-reference-benchmark-expansion";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_LANDED_GATE =
  "broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTION_STATUS =
  "broad_accuracy_open_web_supported_band_similarity_runtime_corridor_landed_selected_surface_parity";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION =
  "broad_accuracy_open_web_supported_band_similarity_surface_parity_plan";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity-contract.test.ts";

export const BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_LABEL =
  "open-web supported-band similarity surface parity";

export type BroadAccuracyOpenWebSupportedBandRuntimeScenarioId =
  | "fl26_250mm_timber_supported_band_similarity"
  | "fl24_250mm_timber_supported_band_similarity"
  | "fl26_250mm_bare_supported_band_similarity";

export type BroadAccuracyOpenWebSupportedBandNegativeBoundaryId =
  | "exact_source_precedence"
  | "fl28_existing_seed"
  | "carpet_bound_only_lane"
  | "missing_ceiling_fill"
  | "field_building_astm_aliases";

export type BroadAccuracyOpenWebSupportedBandRuntimeScenario = {
  id: BroadAccuracyOpenWebSupportedBandRuntimeScenarioId;
  expectedFitPercent: number;
  expectedImpact: {
    CI: number;
    LnW: number;
    LnWPlusCI: number;
    basis: typeof OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS;
  };
  expectedAirborne: {
    Rw: number;
    RwCtr: number;
  };
  metricsUnlocked: readonly BroadAccuracyMetricId[];
};

export type BroadAccuracyOpenWebSupportedBandSimilarityRuntimeContract = {
  basis: typeof OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS;
  landedGate: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_LANDED_GATE;
  previousFloorSystemAnchor: {
    selectedNextAction: typeof BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTION_STATUS;
  };
  promotedRuntimeFamilies: readonly string[];
  runtimeMovementThisGate: true;
  negativeBoundaries: readonly BroadAccuracyOpenWebSupportedBandNegativeBoundaryId[];
  selectedNextAction: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTION_STATUS;
  supportedScenarios: readonly BroadAccuracyOpenWebSupportedBandRuntimeScenario[];
};

export function buildBroadAccuracyOpenWebSupportedBandSimilarityRuntimeContract():
  BroadAccuracyOpenWebSupportedBandSimilarityRuntimeContract {
  return {
    basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
    landedGate: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_LANDED_GATE,
    negativeBoundaries: [
      "exact_source_precedence",
      "fl28_existing_seed",
      "carpet_bound_only_lane",
      "missing_ceiling_fill",
      "field_building_astm_aliases"
    ],
    previousFloorSystemAnchor: {
      selectedNextAction: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTION_STATUS
    },
    promotedRuntimeFamilies: ["UBIQ FL-24", "UBIQ FL-26"],
    runtimeMovementThisGate: true,
    selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTION_STATUS,
    supportedScenarios: [
      {
        expectedAirborne: { Rw: 61.5, RwCtr: 56 },
        expectedFitPercent: 89.5,
        expectedImpact: {
          CI: -1.5,
          LnW: 53.5,
          LnWPlusCI: 52,
          basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
        },
        id: "fl26_250mm_timber_supported_band_similarity",
        metricsUnlocked: ["Rw", "Ln,w", "Ln,w+CI"]
      },
      {
        expectedAirborne: { Rw: 60.5, RwCtr: 54 },
        expectedFitPercent: 89.5,
        expectedImpact: {
          CI: -1.5,
          LnW: 54.5,
          LnWPlusCI: 53,
          basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
        },
        id: "fl24_250mm_timber_supported_band_similarity",
        metricsUnlocked: ["Rw", "Ln,w", "Ln,w+CI"]
      },
      {
        expectedAirborne: { Rw: 61.5, RwCtr: 56 },
        expectedFitPercent: 89.5,
        expectedImpact: {
          CI: -1.5,
          LnW: 61.5,
          LnWPlusCI: 60,
          basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
        },
        id: "fl26_250mm_bare_supported_band_similarity",
        metricsUnlocked: ["Rw", "Ln,w", "Ln,w+CI"]
      }
    ]
  };
}
