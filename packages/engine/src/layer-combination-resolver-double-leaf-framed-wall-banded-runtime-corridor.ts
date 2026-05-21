import {
  buildLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridorContract,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS,
  type LayerCombinationResolverDoubleLeafFramedWallBandedDesignMetrics
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";

export {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_LANDED_GATE =
  "layer_combination_resolver_double_leaf_framed_wall_banded_runtime_corridor_plan";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS =
  "layer_combination_resolver_double_leaf_framed_wall_banded_runtime_corridor_landed_selected_surface_parity";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_double_leaf_framed_wall_banded_surface_parity_plan";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL =
  "layer combination resolver double-leaf framed wall banded surface parity";

export type LayerCombinationResolverDoubleLeafFramedWallBandedRuntimeScenario = {
  readonly currentRuntimeMetrics: {
    readonly C: number;
    readonly Ctr: number;
    readonly Rw: number;
    readonly STCCompatibility: number;
  };
  readonly designMetrics: LayerCombinationResolverDoubleLeafFramedWallBandedDesignMetrics;
  readonly errorBudgetDb: number;
  readonly id:
    | "wall_independent_absorbed_double_leaf_framed"
    | "wall_resilient_both_sides_double_leaf_framed"
    | "wall_resilient_one_side_double_leaf_framed";
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedRuntimeCorridorContract = {
  readonly basis: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS;
  readonly blockedAliases: readonly string[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly numericRuntimeValueMovementThisGate: false;
  readonly previousFormulaCorridor: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS;
  };
  readonly runtimeBasisMovementThisGate: true;
  readonly runtimeCandidateId: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS;
  readonly supportedScenarios: readonly LayerCombinationResolverDoubleLeafFramedWallBandedRuntimeScenario[];
  readonly warning: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING;
};

export function buildLayerCombinationResolverDoubleLeafFramedWallBandedRuntimeCorridorContract():
  LayerCombinationResolverDoubleLeafFramedWallBandedRuntimeCorridorContract {
  const previous = buildLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridorContract();
  const row = (index: number): LayerCombinationResolverDoubleLeafFramedWallBandedDesignMetrics => {
    const metrics = previous.candidateFormulaRows[index]?.designMetrics;
    if (!metrics) {
      throw new Error(`Missing double-leaf/framed formula design row ${String(index)}.`);
    }
    return metrics;
  };

  return {
    basis: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    blockedAliases: [
      "unowned_field_airborne_R_prime_and_DnT_alias_outputs",
      "building_prediction_outputs",
      "floor_impact_Ln_w_CI_DeltaLw_outputs",
      "ASTM_IIC_AIIC_aliases",
      "new_Rw_to_STC_alias_promotion"
    ],
    exactMeasuredRowsRemainPrecedence: true,
    landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
    negativeBoundaries: [
      "exact_same_stack_source_rows_stay_rank_zero_before_this_source_absent_runtime",
      "direct_fixed_grouped_triple_leaf_flat_multicavity_and_unsafe_reorder_topologies_stay_out",
      "resilient_bridge_inputs_without_resilientBarSideCount_remain_needs_input",
      "building_floor_impact_astm_iic_and_unowned_field_outputs_do_not_inherit_double_leaf_lab_values",
      "STC_remains_existing_display_compatibility_not_a_new_ASTM_E413_rating_owner",
      "runtime_budgets_are_not_measured_evidence",
      "surface_parity_for_visible_cards_api_report_and_trace_is_the_selected_next_gate"
    ],
    numericRuntimeValueMovementThisGate: false,
    previousFormulaCorridor: {
      landedGate: previous.landedGate,
      selectedNextAction: previous.selectedNextAction,
      selectedNextFile: previous.selectedNextFile,
      selectionStatus: previous.selectionStatus
    },
    runtimeBasisMovementThisGate: true,
    runtimeCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS,
    supportedScenarios: [
      {
        currentRuntimeMetrics: { C: -1, Ctr: -6.1, Rw: 45, STCCompatibility: 45 },
        designMetrics: row(0),
        errorBudgetDb: 7,
        id: "wall_independent_absorbed_double_leaf_framed"
      },
      {
        currentRuntimeMetrics: { C: -1.1, Ctr: -6.2, Rw: 46, STCCompatibility: 46 },
        designMetrics: row(1),
        errorBudgetDb: 8,
        id: "wall_resilient_both_sides_double_leaf_framed"
      },
      {
        currentRuntimeMetrics: { C: -1.1, Ctr: -6.2, Rw: 45, STCCompatibility: 45 },
        designMetrics: row(2),
        errorBudgetDb: 8,
        id: "wall_resilient_one_side_double_leaf_framed"
      }
    ],
    warning: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING
  };
}
