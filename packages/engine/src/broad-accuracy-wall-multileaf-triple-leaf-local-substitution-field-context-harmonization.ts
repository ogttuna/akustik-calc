import type { AirborneContext, AirborneResultBasis } from "@dynecho/shared";

import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh";
import { maybeBuildGateIAirborneFieldContextBasisFromBase } from "./dynamic-airborne-gate-i-airborne-field-context";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_landed_selected_field_context_surface_parity";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity-contract.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_LABEL =
  "wall triple-leaf local substitution field context surface parity";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD =
  "broad_accuracy_wall_triple_leaf_local_substitution_field_context_harmonization_runtime";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID =
  "candidate_broad_accuracy_wall_triple_leaf_local_substitution_field_context_family_physics_prediction";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING =
  "Wall triple-leaf local substitution field-context harmonization is active: R'w and DnT,w are calculated from the local-substitution lab curve plus explicit receiving-room context. It is not a measured field row and does not alias lab Rw/STC to field or building outputs.";

export type BroadAccuracyWallTripleLeafLocalSubstitutionFieldContextHarmonizationContract = {
  landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_LANDED_GATE;
  previousCoverageRefresh: {
    landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS;
  };
  runtimeMethod: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD;
  runtimeValueMovement: true;
  selectedCandidateId: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTION_STATUS;
  supportedRuntimeOutputs: readonly ["R'w", "DnT,w"];
};

export function maybeBuildBroadAccuracyWallTripleLeafLocalSubstitutionFieldContextBasis(input: {
  baseBasis: AirborneResultBasis;
  context: AirborneContext | null | undefined;
  frequencyBands?: AirborneResultBasis["frequencyBands"];
}): AirborneResultBasis | null {
  const fieldBasis = maybeBuildGateIAirborneFieldContextBasisFromBase({
    baseBasis: input.baseBasis,
    context: input.context,
    family: "multileaf_multicavity",
    frequencyBands: input.frequencyBands
  });

  if (!fieldBasis) {
    return null;
  }

  const baseBudget =
    typeof input.baseBasis.errorBudgetDb === "number" && Number.isFinite(input.baseBasis.errorBudgetDb)
      ? input.baseBasis.errorBudgetDb
      : 8;
  const fieldAssumptions = fieldBasis.assumptions.filter(
    (assumption) =>
      !assumption.toLowerCase().includes("field, and building outputs remain unsupported") &&
      !assumption.toLowerCase().includes("field and building outputs remain unsupported")
  );

  return {
    ...fieldBasis,
    assumptions: [
      "local-substitution field context uses the local-substitution lab transmission-loss curve as the direct separating-element anchor",
      "R'w and DnT,w are calculated from explicit field_between_rooms geometry and reverberation context, not copied from lab Rw or STC",
      "building-prediction and flanking-path outputs remain blocked until separate junction/flanking ownership lands",
      ...fieldAssumptions
    ],
    errorBudgetDb: Math.max(baseBudget + 2, 10),
    method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
    missingSourceEvidence: [
      ...input.baseBasis.missingSourceEvidence.filter((entry) => entry !== "field_building_adapter_owner_absent"),
      "source_owned_same_stack_local_substitution_field_holdout_absent"
    ],
    requiredInputs: [
      ...fieldBasis.requiredInputs,
      "BroadAccuracyLocalSubstitutionFieldContextHarmonization:local_substitution_lab_curve_anchor",
      "BroadAccuracyLocalSubstitutionFieldContextHarmonization:field_RwPrime_DnTw_adapter_owner"
    ]
  };
}

export function buildBroadAccuracyWallTripleLeafLocalSubstitutionFieldContextHarmonizationContract():
  BroadAccuracyWallTripleLeafLocalSubstitutionFieldContextHarmonizationContract {
  return {
    landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_LANDED_GATE,
    previousCoverageRefresh: {
      landedGate:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS
    },
    runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
    runtimeValueMovement: true,
    selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
    selectedNextAction:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_ACTION,
    selectedNextFile:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_FILE,
    selectedNextLabel:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_LABEL,
    selectionStatus:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTION_STATUS,
    supportedRuntimeOutputs: ["R'w", "DnT,w"]
  };
}
