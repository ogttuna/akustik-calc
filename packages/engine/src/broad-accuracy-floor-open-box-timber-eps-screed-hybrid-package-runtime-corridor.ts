import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridorContract
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_landed_selected_surface_parity";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_LABEL =
  "floor open-box timber EPS/screed hybrid package surface parity";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRuntimeScenario = {
  readonly expected: {
    readonly C: number;
    readonly CI: number;
    readonly CI50_2500: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
    readonly Rw: number;
    readonly RwPlusC: number;
  };
  readonly id: string;
  readonly topologyState: "safe_split_equivalent" | "source_equivalent";
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRuntimeCorridorContract = {
  readonly basis: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_BASIS;
  readonly exactRowsStayFirst: true;
  readonly fieldBuildingAndAstmAliasesBlocked: true;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly previousFormulaCorridor: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTION_STATUS;
  };
  readonly runtimeMovementThisGate: true;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS;
  readonly supportedScenarios: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRuntimeScenario[];
};

export function buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRuntimeCorridorContract():
  BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRuntimeCorridorContract {
  const previous = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridorContract();

  return {
    basis: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_BASIS,
    exactRowsStayFirst: true,
    fieldBuildingAndAstmAliasesBlocked: true,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE,
    negativeBoundaries: [
      "exact_tuas_r7b_and_sibling_rows_must_return_open_measured_floor_system_exact_match_before_formula_runtime",
      "r8b_partial_finish_r9b_screed_only_r2c_missing_lower_mass_and_r10a_mixed_staged_rows_stay_negative_boundaries",
      "generic_dry_package_transfer_basis_must_not_be_borrowed_for_eps_screed_hybrid_runtime",
      "wrong_support_family_open_web_or_clt_stays_out_of_open_box_timber_eps_screed_hybrid_runtime",
      "unsafe_duplicate_upper_or_lower_roles_fail_closed_instead_of_promoting_high_values",
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
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS,
    supportedScenarios: [
      {
        expected: { C: -1.3, CI: 0, CI50_2500: 1, LnW: 47, LnWPlusCI: 47, Rw: 72, RwPlusC: 70.7 },
        id: "source_absent_eps_screed_hybrid_43mm_screed_variant",
        topologyState: "source_equivalent"
      },
      {
        expected: { C: -1.3, CI: 0, CI50_2500: 1, LnW: 47, LnWPlusCI: 47, Rw: 72, RwPlusC: 70.7 },
        id: "safe_split_support_eps_screed_hybrid_43mm_screed_variant",
        topologyState: "safe_split_equivalent"
      }
    ]
  };
}
