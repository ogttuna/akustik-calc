import {
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTION_STATUS,
  buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridorContract
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_LANDED_GATE =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTION_STATUS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_landed_selected_surface_parity";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_LABEL =
  "floor helper-only timber/open-web impact stack surface parity";

export type BroadAccuracyFloorHelperOnlyTimberOpenWebRuntimeScenario = {
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
  readonly supportBranch: "lightweight_steel_open_web" | "open_box_timber" | "timber_joists";
  readonly topologyState: "safe_split_equivalent" | "source_equivalent";
};

export type BroadAccuracyFloorHelperOnlyTimberOpenWebRuntimeCorridorContract = {
  readonly basis: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS;
  readonly exactPackageAndRawBareRowsStayFirst: true;
  readonly fieldBuildingAndAstmAliasesBlocked: true;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly previousFormulaCorridor: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTION_STATUS;
  };
  readonly runtimeMovementThisGate: true;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTION_STATUS;
  readonly supportedScenarios: readonly BroadAccuracyFloorHelperOnlyTimberOpenWebRuntimeScenario[];
};

export function buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackRuntimeCorridorContract():
  BroadAccuracyFloorHelperOnlyTimberOpenWebRuntimeCorridorContract {
  const previous = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridorContract();

  return {
    basis: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS,
    exactPackageAndRawBareRowsStayFirst: true,
    fieldBuildingAndAstmAliasesBlocked: true,
    landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_LANDED_GATE,
    negativeBoundaries: [
      "exact_floor_system_rows_stay_ahead_of_helper_only_formula",
      "complete_open_box_package_transfer_eps_screed_raw_bare_and_open_web_package_lanes_stay_separate",
      "partial_lower_treatment_or_missing_board_inputs_do_not_enter_helper_only_runtime",
      "untagged_or_roleless_helper_like_stacks_stay_on_existing_prompt_or_screening_paths",
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
    selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTION_STATUS,
    supportedScenarios: [
      {
        expected: { C: -1.1, CI: 1, CI50_2500: 2.3, Ctr: -5.9, LnW: 59.6, LnWPlusCI: 60.6, Rw: 54.8 },
        id: "open_box_timber_helper_only_lower_treatment",
        supportBranch: "open_box_timber",
        topologyState: "source_equivalent"
      },
      {
        expected: { C: -2.1, CI: 0.8, CI50_2500: 3.5, Ctr: -8.3, LnW: 65.4, LnWPlusCI: 66.2, Rw: 47.3 },
        id: "timber_joist_helper_only_lower_treatment",
        supportBranch: "timber_joists",
        topologyState: "source_equivalent"
      },
      {
        expected: { C: -1.7, CI: 1, CI50_2500: 4, Ctr: -7.9, LnW: 59.6, LnWPlusCI: 60.6, Rw: 46.7 },
        id: "open_web_steel_helper_only_lower_treatment",
        supportBranch: "lightweight_steel_open_web",
        topologyState: "source_equivalent"
      }
    ]
  };
}
