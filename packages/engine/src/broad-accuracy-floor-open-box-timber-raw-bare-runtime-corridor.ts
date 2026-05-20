import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridorContract
} from "./broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_raw_bare_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_raw_bare_runtime_corridor_landed_selected_surface_parity";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_raw_bare_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-surface-parity-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_LABEL =
  "floor open-box timber raw-bare surface parity";

export type BroadAccuracyFloorOpenBoxTimberRawBareRuntimeScenario = {
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

export type BroadAccuracyFloorOpenBoxTimberRawBareRuntimeCorridorContract = {
  readonly basis: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS;
  readonly exactRowsStayFirst: true;
  readonly fieldBuildingAndAstmAliasesBlocked: true;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly previousFormulaCorridor: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS;
  };
  readonly runtimeMovementThisGate: true;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS;
  readonly supportedScenarios: readonly BroadAccuracyFloorOpenBoxTimberRawBareRuntimeScenario[];
};

export function buildBroadAccuracyFloorOpenBoxTimberRawBareRuntimeCorridorContract():
  BroadAccuracyFloorOpenBoxTimberRawBareRuntimeCorridorContract {
  const previous = buildBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridorContract();

  return {
    basis: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS,
    exactRowsStayFirst: true,
    fieldBuildingAndAstmAliasesBlocked: true,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE,
    negativeBoundaries: [
      "complete_finished_tuas_package_transfer_routes_stay_ahead_of_raw_bare_formula",
      "partial_upper_or_lower_packages_do_not_enter_raw_bare_runtime",
      "safe_split_base_only_layers_stay_numerically_equivalent_to_unsplit_base_only",
      "wrong_support_family_open_web_steel_stays_out_of_raw_bare_open_box_timber_runtime",
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
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS,
    supportedScenarios: [
      {
        expected: { C: -1.4, CI: -1.1, CI50_2500: 3.1, Ctr: -5.8, LnW: 88.2, LnWPlusCI: 87.1, Rw: 42.3 },
        id: "tagged_370mm_raw_bare_open_box_base_only",
        topologyState: "source_equivalent"
      },
      {
        expected: { C: -1.4, CI: -1.1, CI50_2500: 3.1, Ctr: -5.8, LnW: 88.2, LnWPlusCI: 87.1, Rw: 42.3 },
        id: "split_185_185_raw_bare_open_box_base_only",
        topologyState: "safe_split_equivalent"
      },
      {
        expected: { C: -1.6, CI: -0.9, CI50_2500: 3.4, Ctr: -6.2, LnW: 91.1, LnWPlusCI: 90.2, Rw: 38.1 },
        id: "tagged_220mm_raw_bare_open_box_base_only",
        topologyState: "source_equivalent"
      }
    ]
  };
}
