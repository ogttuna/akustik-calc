import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebRawBareFormulaCorridorContract
} from "./broad-accuracy-floor-open-web-raw-bare-formula-corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE =
  "broad_accuracy_floor_open_web_raw_bare_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_raw_bare_runtime_corridor_landed_selected_surface_parity";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_raw_bare_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_LABEL =
  "floor open-web raw-bare surface parity";

export type BroadAccuracyFloorOpenWebRawBareRuntimeScenario = {
  readonly expected: {
    readonly C: number;
    readonly CI: number;
    readonly CI50_2500: number;
    readonly Ctr: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
    readonly Rw: number;
  };
  readonly id: string;
  readonly topologyState: "safe_split_equivalent" | "source_equivalent";
};

export type BroadAccuracyFloorOpenWebRawBareRuntimeCorridorContract = {
  readonly basis: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS;
  readonly exactAndPackageRowsStayFirst: true;
  readonly fieldBuildingAndAstmAliasesBlocked: true;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly previousFormulaCorridor: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS;
  };
  readonly runtimeMovementThisGate: true;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS;
  readonly supportedScenarios: readonly BroadAccuracyFloorOpenWebRawBareRuntimeScenario[];
};

export function buildBroadAccuracyFloorOpenWebRawBareRuntimeCorridorContract():
  BroadAccuracyFloorOpenWebRawBareRuntimeCorridorContract {
  const previous = buildBroadAccuracyFloorOpenWebRawBareFormulaCorridorContract();

  return {
    basis: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS,
    exactAndPackageRowsStayFirst: true,
    fieldBuildingAndAstmAliasesBlocked: true,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE,
    negativeBoundaries: [
      "ubiq_inex_firestop_package_routes_stay_ahead_of_raw_bare_formula",
      "inex_deck_only_and_lower_only_partial_packages_do_not_enter_raw_bare_runtime",
      "safe_split_base_only_layers_stay_numerically_equivalent_to_unsplit_base_only",
      "wrong_support_family_open_box_timber_stays_out_of_raw_bare_open_web_runtime",
      "field_building_and_astm_iic_outputs_remain_unpromoted_by_this_element_lab_runtime_corridor",
      "runtime_error_budgets_are_not_measured_evidence"
    ],
    previousFormulaCorridor: {
      landedGate: previous.landedGate,
      selectedNextAction: previous.selectedNextAction,
      selectedNextFile: previous.selectedNextFile,
      selectionStatus: previous.selectionStatus
    },
    runtimeMovementThisGate: true,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS,
    supportedScenarios: [
      {
        expected: { C: -2.2, CI: 1.8, CI50_2500: 5.2, Ctr: -7.8, LnW: 96, LnWPlusCI: 97.8, Rw: 32 },
        id: "tagged_300mm_raw_bare_open_web_base_only",
        topologyState: "source_equivalent"
      },
      {
        expected: { C: -2.2, CI: 1.8, CI50_2500: 5.2, Ctr: -7.8, LnW: 96, LnWPlusCI: 97.8, Rw: 32 },
        id: "split_150_150_raw_bare_open_web_base_only",
        topologyState: "safe_split_equivalent"
      },
      {
        expected: { C: -2, CI: 1.3, CI50_2500: 4.6, Ctr: -7.5, LnW: 92.8, LnWPlusCI: 94.1, Rw: 36.6 },
        id: "tagged_400mm_raw_bare_open_web_base_only",
        topologyState: "source_equivalent"
      }
    ]
  };
}
