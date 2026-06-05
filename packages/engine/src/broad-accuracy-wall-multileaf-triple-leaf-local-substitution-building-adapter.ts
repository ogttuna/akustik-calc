import type {
  AirborneContext,
  AirborneResultBasis,
  DynamicAirborneFamily,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import type { AirborneTopologySummary } from "./airborne-topology";
import type { DynamicAirborneOptions } from "./dynamic-airborne-helpers";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  maybeBuildGateARAirborneBuildingPredictionRuntimeBasis
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD =
  "broad_accuracy_wall_triple_leaf_local_substitution_building_prediction_adapter_runtime";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID =
  "candidate_broad_accuracy_wall_triple_leaf_local_substitution_building_prediction_family_physics";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_WARNING =
  "Wall triple-leaf local substitution building-prediction adapter is active: R'w, Dn,w, Dn,A, DnT,w, and DnT,A are calculated from the local-substitution lab curve plus explicit building flanking, junction, and room context. It is not measured building evidence and does not alias lab or field metrics.";

export function maybeBuildBroadAccuracyWallTripleLeafLocalSubstitutionBuildingBasis(input: {
  baseBasis: AirborneResultBasis;
  context: AirborneContext | null | undefined;
  curve: TransmissionLossCurve;
  family: DynamicAirborneFamily;
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  strategy: string;
  topology: AirborneTopologySummary;
}): AirborneResultBasis | null {
  const gateArBasis = maybeBuildGateARAirborneBuildingPredictionRuntimeBasis({
    confidenceClass: "medium",
    curve: input.curve,
    family: input.family,
    layers: input.layers,
    options: input.options,
    selectedMethod: "triple_leaf_two_cavity_frequency_solver",
    strategy: input.strategy,
    topology: input.topology
  });

  if (
    !gateArBasis ||
    input.context?.contextMode !== "building_prediction" ||
    gateArBasis.method !== GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
  ) {
    return null;
  }

  const baseBudget =
    typeof input.baseBasis.errorBudgetDb === "number" && Number.isFinite(input.baseBasis.errorBudgetDb)
      ? input.baseBasis.errorBudgetDb
      : 8;
  const buildingAssumptions = gateArBasis.assumptions.filter(
    (assumption) =>
      !assumption.toLowerCase().includes("direct separating-element curve comes from the selected dynamic airborne family solver")
  );

  return {
    ...gateArBasis,
    assumptions: [
      "local-substitution building prediction uses the local-substitution calculated transmission-loss curve as the direct separating-element anchor",
      "R'w, Dn,w, Dn,A, DnT,w, and DnT,A are calculated from explicit building_prediction geometry, room, flanking, and junction context, not copied from lab Rw/STC or field R'w",
      ...buildingAssumptions
    ],
    errorBudgetDb: Math.max(baseBudget + 3, 11),
    method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD,
    missingSourceEvidence: [
      ...input.baseBasis.missingSourceEvidence.filter((entry) => entry !== "field_building_adapter_owner_absent"),
      "source_owned_same_stack_local_substitution_building_holdout_absent"
    ],
    requiredInputs: [
      ...gateArBasis.requiredInputs,
      "BroadAccuracyLocalSubstitutionBuildingAdapter:local_substitution_lab_curve_anchor",
      "BroadAccuracyLocalSubstitutionBuildingAdapter:building_RwPrime_Dn_DnT_adapter_owner"
    ]
  };
}
