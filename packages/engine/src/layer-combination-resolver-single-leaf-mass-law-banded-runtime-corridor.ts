import {
  buildLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridorContract,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS,
  type LayerCombinationResolverSingleLeafMassLawDesignMetrics,
  type LayerCombinationResolverSingleLeafMassLawDynamicFamily,
  type LayerCombinationResolverSingleLeafMassLawRoute
} from "./layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

export {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_LANDED_GATE =
  "layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_plan";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS =
  "layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_landed_selected_surface_parity";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_single_leaf_mass_law_banded_surface_parity_plan";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-surface-parity-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL =
  "layer combination resolver single-leaf mass-law banded surface parity";

export type LayerCombinationResolverSingleLeafMassLawRuntimeScenario = {
  readonly currentRuntimeMetrics: {
    readonly Rw: number;
    readonly STCCompatibility: number;
  };
  readonly designMetrics: LayerCombinationResolverSingleLeafMassLawDesignMetrics;
  readonly dynamicFamily: LayerCombinationResolverSingleLeafMassLawDynamicFamily;
  readonly id: string;
  readonly route: LayerCombinationResolverSingleLeafMassLawRoute;
};

export type LayerCombinationResolverSingleLeafMassLawBandedRuntimeCorridorContract = {
  readonly basis: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;
  readonly blockedAliases: readonly string[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly numericRuntimeValueMovementThisGate: false;
  readonly previousFormulaCorridor: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS;
  };
  readonly runtimeBasisMovementThisGate: true;
  readonly runtimeCandidateId: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS;
  readonly supportedScenarios: readonly LayerCombinationResolverSingleLeafMassLawRuntimeScenario[];
  readonly warning: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING;
};

export function buildLayerCombinationResolverSingleLeafMassLawBandedRuntimeCorridorContract():
  LayerCombinationResolverSingleLeafMassLawBandedRuntimeCorridorContract {
  const previous = buildLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridorContract();
  const rows = previous.candidateFormulaRows;
  const row = (index: number): LayerCombinationResolverSingleLeafMassLawDesignMetrics => {
    const metrics = rows[index]?.designMetrics;
    if (!metrics) {
      throw new Error(`Missing single-leaf formula design row ${String(index)}.`);
    }
    return metrics;
  };

  return {
    basis: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
    blockedAliases: [
      "field_airborne_R_prime_and_DnT_outputs",
      "building_prediction_outputs",
      "floor_impact_Ln_w_CI_DeltaLw_outputs",
      "ASTM_IIC_AIIC_aliases",
      "new_Rw_to_STC_alias_promotion"
    ],
    exactMeasuredRowsRemainPrecedence: true,
    landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
    negativeBoundaries: [
      "exact_same_stack_source_rows_stay_rank_zero_before_this_source_absent_runtime",
      "framed_cavity_double_leaf_triple_leaf_and_clt_mass_timber_topologies_stay_out",
      "floor_impact_and_field_building_requests_do_not_inherit_single_leaf_lab_values",
      "STC_remains_existing_display_compatibility_not_a_new_ASTM_E413_rating_owner",
      "runtime_budgets_are_not_measured_evidence",
      "spectrum_adapter_surface_parity_for_visible_C_and_Ctr_copy_is_the_selected_next_gate"
    ],
    numericRuntimeValueMovementThisGate: false,
    previousFormulaCorridor: {
      landedGate: previous.landedGate,
      selectedNextAction: previous.selectedNextAction,
      selectedNextFile: previous.selectedNextFile,
      selectionStatus: previous.selectionStatus
    },
    runtimeBasisMovementThisGate: true,
    runtimeCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS,
    supportedScenarios: [
      {
        currentRuntimeMetrics: { Rw: 31, STCCompatibility: 31 },
        designMetrics: row(0),
        dynamicFamily: "single_leaf_panel",
        id: "wall_gypsum_board_12_5mm_single_leaf",
        route: "wall"
      },
      {
        currentRuntimeMetrics: { Rw: 34, STCCompatibility: 34 },
        designMetrics: row(1),
        dynamicFamily: "laminated_single_leaf",
        id: "wall_laminated_gypsum_board_25mm_single_leaf",
        route: "wall"
      },
      {
        currentRuntimeMetrics: { Rw: 55, STCCompatibility: 55 },
        designMetrics: row(2),
        dynamicFamily: "rigid_massive_wall",
        id: "wall_concrete_150mm_single_leaf",
        route: "wall"
      },
      {
        currentRuntimeMetrics: { Rw: 55, STCCompatibility: 55 },
        designMetrics: row(3),
        dynamicFamily: "rigid_massive_wall",
        id: "floor_concrete_150mm_direct_airborne_single_leaf",
        route: "floor"
      }
    ],
    warning: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
  };
}
