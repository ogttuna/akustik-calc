import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_LANDED_GATE =
  "broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_landed_selected_surface_parity";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_LABEL =
  "floor open-web direct-fixed lining surface parity";

export type BroadAccuracyFloorOpenWebDirectFixedRuntimeScenarioId =
  | "fl23_250mm_19mm_timber_direct_fixed"
  | "fl25_250mm_16mm_bare_direct_fixed"
  | "fl27_350mm_19mm_carpet_direct_fixed";

export type BroadAccuracyFloorOpenWebDirectFixedRuntimeNegativeBoundaryId =
  | "exact_source_precedence"
  | "supported_band_resilient_ceiling_exclusion"
  | "out_of_band_depth_exclusion"
  | "field_building_astm_iic_aliases";

export type BroadAccuracyFloorOpenWebDirectFixedRuntimeScenario = {
  readonly expectedAirborne: {
    readonly Rw: number;
    readonly RwCtr: number;
  };
  readonly expectedImpact: {
    readonly CI: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
    readonly basis: typeof OPEN_WEB_DIRECT_FIXED_LINING_BASIS;
  };
  readonly expectedToleranceBudgets: {
    readonly CI: 1.5;
    readonly LnW: 4;
    readonly LnWPlusCI: 4.5;
  };
  readonly id: BroadAccuracyFloorOpenWebDirectFixedRuntimeScenarioId;
  readonly sourceAnchorIds: readonly string[];
};

export type BroadAccuracyFloorOpenWebDirectFixedRuntimeContract = {
  readonly basis: typeof OPEN_WEB_DIRECT_FIXED_LINING_BASIS;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_LANDED_GATE;
  readonly negativeBoundaries: readonly BroadAccuracyFloorOpenWebDirectFixedRuntimeNegativeBoundaryId[];
  readonly previousFormulaCorridor: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTION_STATUS;
  };
  readonly promotedRuntimeFamilies: readonly ["UBIQ FL-23", "UBIQ FL-25", "UBIQ FL-27"];
  readonly runtimeMovementThisGate: true;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTION_STATUS;
  readonly supportedScenarios: readonly BroadAccuracyFloorOpenWebDirectFixedRuntimeScenario[];
};

export function buildBroadAccuracyFloorOpenWebDirectFixedLiningRuntimeContract():
  BroadAccuracyFloorOpenWebDirectFixedRuntimeContract {
  return {
    basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_LANDED_GATE,
    negativeBoundaries: [
      "exact_source_precedence",
      "supported_band_resilient_ceiling_exclusion",
      "out_of_band_depth_exclusion",
      "field_building_astm_iic_aliases"
    ],
    previousFormulaCorridor: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTION_STATUS
    },
    promotedRuntimeFamilies: ["UBIQ FL-23", "UBIQ FL-25", "UBIQ FL-27"],
    runtimeMovementThisGate: true,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTION_STATUS,
    supportedScenarios: [
      {
        expectedAirborne: { Rw: 51, RwCtr: 43.5 },
        expectedImpact: { CI: -0.5, LnW: 71, LnWPlusCI: 70.5, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS },
        expectedToleranceBudgets: { CI: 1.5, LnW: 4, LnWPlusCI: 4.5 },
        id: "fl23_250mm_19mm_timber_direct_fixed",
        sourceAnchorIds: [
          "ubiq_fl23_open_web_steel_200_19mm_timber_underlay_exact_lab_2026",
          "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026"
        ]
      },
      {
        expectedAirborne: { Rw: 51, RwCtr: 43.5 },
        expectedImpact: { CI: -0.5, LnW: 77, LnWPlusCI: 76.5, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS },
        expectedToleranceBudgets: { CI: 1.5, LnW: 4, LnWPlusCI: 4.5 },
        id: "fl25_250mm_16mm_bare_direct_fixed",
        sourceAnchorIds: [
          "ubiq_fl25_open_web_steel_200_16mm_bare_exact_lab_2026",
          "ubiq_fl25_open_web_steel_300_16mm_bare_exact_lab_2026"
        ]
      },
      {
        expectedAirborne: { Rw: 54.5, RwCtr: 47.5 },
        expectedImpact: { CI: -1, LnW: 63, LnWPlusCI: 62, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS },
        expectedToleranceBudgets: { CI: 1.5, LnW: 4, LnWPlusCI: 4.5 },
        id: "fl27_350mm_19mm_carpet_direct_fixed",
        sourceAnchorIds: [
          "ubiq_fl27_open_web_steel_300_19mm_carpet_underlay_exact_lab_2026",
          "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026"
        ]
      }
    ]
  };
}
