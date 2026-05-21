import {
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS,
  type LayerCombinationResolverRuntimeCandidateSurfaceParityTarget
} from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  buildLayerCombinationResolverSingleLeafMassLawBandedRuntimeCorridorContract,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import type {
  LayerCombinationResolverMetricId,
  LayerCombinationResolverRoute
} from "./layer-combination-resolver-registry";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_LANDED_GATE =
  "layer_combination_resolver_single_leaf_mass_law_banded_surface_parity_plan";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTION_STATUS =
  "layer_combination_resolver_single_leaf_mass_law_banded_surface_parity_landed_no_runtime_selected_post_single_leaf_matrix_refresh";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_post_single_leaf_mass_law_banded_matrix_refresh_plan";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "layer combination resolver post single-leaf mass-law banded matrix refresh";

export type LayerCombinationResolverSingleLeafMassLawBandedSurfaceScenario = {
  readonly basis: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;
  readonly candidateId: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID;
  readonly expectedMetricPins: readonly {
    readonly metric: LayerCombinationResolverMetricId;
    readonly value: number;
  }[];
  readonly id: string;
  readonly route: LayerCombinationResolverRoute;
  readonly supportBucket: "source_absent_estimate";
};

export type LayerCombinationResolverSingleLeafMassLawBandedSurfaceParityContract = {
  readonly basis: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;
  readonly blockedSurfaceBoundaries: readonly string[];
  readonly candidateId: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID;
  readonly errorBudgetDb: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB;
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGenericSurfaceParity: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS;
  };
  readonly previousRuntimeCorridor: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS;
  };
  readonly representativeScenarios: readonly LayerCombinationResolverSingleLeafMassLawBandedSurfaceScenario[];
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTION_STATUS;
  readonly surfaceTargets: readonly LayerCombinationResolverRuntimeCandidateSurfaceParityTarget[];
};

export function buildLayerCombinationResolverSingleLeafMassLawBandedSurfaceParityContract():
  LayerCombinationResolverSingleLeafMassLawBandedSurfaceParityContract {
  const runtime = buildLayerCombinationResolverSingleLeafMassLawBandedRuntimeCorridorContract();

  return {
    basis: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
    blockedSurfaceBoundaries: [
      "floor_impact_Ln_w_CI_DeltaLw_outputs_do_not_use_single_leaf_airborne_trace",
      "field_airborne_R_prime_and_DnT_outputs_stay_outside_this_element_lab_surface_gate",
      "building_prediction_outputs_stay_blocked_without_flanking_owner",
      "ASTM_IIC_AIIC_aliases_stay_blocked_without_rating_procedure_owner",
      "C_and_Ctr_are_visible_spectrum_terms_not_separate_exact_source_claims"
    ],
    candidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    errorBudgetDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
    landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_LANDED_GATE,
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
      basis: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      candidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      expectedMetricPins: [
        { metric: "Rw", value: scenario.currentRuntimeMetrics.Rw },
        { metric: "STC", value: scenario.currentRuntimeMetrics.STCCompatibility }
      ],
      id: scenario.id,
      route: scenario.route,
      supportBucket: "source_absent_estimate"
    })),
    selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTION_STATUS,
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
