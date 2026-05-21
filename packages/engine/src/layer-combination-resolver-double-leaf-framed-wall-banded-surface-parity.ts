import {
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS,
  type LayerCombinationResolverRuntimeCandidateSurfaceParityTarget
} from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  buildLayerCombinationResolverDoubleLeafFramedWallBandedRuntimeCorridorContract,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import type {
  LayerCombinationResolverMetricId,
  LayerCombinationResolverRoute
} from "./layer-combination-resolver-registry";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_LANDED_GATE =
  "layer_combination_resolver_double_leaf_framed_wall_banded_surface_parity_plan";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTION_STATUS =
  "layer_combination_resolver_double_leaf_framed_wall_banded_surface_parity_landed_no_runtime_selected_coverage_refresh";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_plan";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "layer combination resolver double-leaf framed wall banded coverage refresh";

export type LayerCombinationResolverDoubleLeafFramedWallBandedSurfaceScenario = {
  readonly basis: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS;
  readonly candidateId: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID;
  readonly errorBudgetDb: number;
  readonly expectedMetricPins: readonly {
    readonly metric: LayerCombinationResolverMetricId;
    readonly value: number;
  }[];
  readonly id:
    | "wall_independent_absorbed_double_leaf_framed"
    | "wall_resilient_both_sides_double_leaf_framed"
    | "wall_resilient_one_side_double_leaf_framed";
  readonly route: LayerCombinationResolverRoute;
  readonly supportBucket: "source_absent_estimate";
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedSurfaceParityContract = {
  readonly basis: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS;
  readonly blockedSurfaceBoundaries: readonly string[];
  readonly candidateId: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID;
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGenericSurfaceParity: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS;
  };
  readonly previousRuntimeCorridor: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS;
  };
  readonly representativeScenarios: readonly LayerCombinationResolverDoubleLeafFramedWallBandedSurfaceScenario[];
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTION_STATUS;
  readonly surfaceTargets: readonly LayerCombinationResolverRuntimeCandidateSurfaceParityTarget[];
};

export function buildLayerCombinationResolverDoubleLeafFramedWallBandedSurfaceParityContract():
  LayerCombinationResolverDoubleLeafFramedWallBandedSurfaceParityContract {
  const runtime = buildLayerCombinationResolverDoubleLeafFramedWallBandedRuntimeCorridorContract();

  return {
    basis: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    blockedSurfaceBoundaries: [
      "exact_same_stack_rows_remain_rank_zero_before_the_source_absent_surface",
      "missing_resilientBarSideCount_stays_needs_input_on_every_visible_surface",
      "direct_fixed_and_grouped_triple_leaf_topologies_stay_outside_this_double_leaf_surface",
      "unowned_field_and_building_outputs_do_not_relabel_element_lab_Rw",
      "floor_impact_and_ASTM_IIC_AIIC_outputs_stay_blocked_without_separate_rating_owner",
      "scenario_specific_value_pins_are_not_measured_evidence"
    ],
    candidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGenericSurfaceParity: {
      landedGate: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS
    },
    previousRuntimeCorridor: {
      landedGate: runtime.landedGate,
      selectedNextAction: runtime.selectedNextAction,
      selectedNextFile: runtime.selectedNextFile,
      selectionStatus: runtime.selectionStatus
    },
    representativeScenarios: runtime.supportedScenarios.map((scenario) => ({
      basis: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      candidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      errorBudgetDb: scenario.errorBudgetDb,
      expectedMetricPins: [
        { metric: "Rw", value: scenario.currentRuntimeMetrics.Rw },
        { metric: "STC", value: scenario.currentRuntimeMetrics.STCCompatibility },
        { metric: "C", value: scenario.currentRuntimeMetrics.C },
        { metric: "Ctr", value: scenario.currentRuntimeMetrics.Ctr }
      ],
      id: scenario.id,
      route: "wall",
      supportBucket: "source_absent_estimate"
    })),
    selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTION_STATUS,
    surfaceTargets: [
      "candidate_trace",
      "output_cards",
      "route_posture",
      "confidence_provenance",
      "metric_basis_rows",
      "method_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "impact_only_api_payload",
      "markdown_report"
    ]
  };
}
