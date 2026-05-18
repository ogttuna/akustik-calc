import type { AssemblyCalculation } from "@dynecho/shared";

export const WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD =
  "gate_i_airborne_field_apparent_context_adapter_runtime";

export const WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID =
  "candidate_airborne_field_context_family_physics_prediction";

export const WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING =
  "Airborne field/apparent context family prediction is active from an owned lab-family route plus explicit receiving-room context. It is not a measured field row and must keep its field uncertainty separate from lab Rw/STC.";

export const WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD =
  "broad_accuracy_wall_triple_leaf_local_substitution_field_context_harmonization_runtime";

export const WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID =
  "candidate_broad_accuracy_wall_triple_leaf_local_substitution_field_context_family_physics_prediction";

export const WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING =
  "Wall triple-leaf local substitution field-context harmonization is active: R'w and DnT,w are calculated from the local-substitution lab curve plus explicit receiving-room context. It is not a measured field row and does not alias lab Rw/STC to field or building outputs.";

export type AirborneFieldContextSurface = {
  budgetLabel: string;
  candidateId: string;
  detail: string;
  label: string;
  method: string;
  notes: readonly string[];
  postureDetail: string;
  reportLines: readonly string[];
  warning: string;
};

function formatBudget(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function getFieldPredictionBudget(result: AssemblyCalculation): number {
  const budget = result.airborneBasis?.errorBudgetDb;

  return typeof budget === "number" && Number.isFinite(budget) ? budget : 7;
}

function getFieldSurfaceDefinition(result: AssemblyCalculation | null | undefined): {
  basisLabel: string;
  candidateId: string;
  method: string;
  notePrefix: string;
  warning: string;
} | null {
  if (
    result?.airborneBasis?.method === WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD &&
    result.airborneCandidateResolution?.selectedCandidateId ===
      WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
  ) {
    return {
      basisLabel: "Gate I airborne field/apparent context adapter",
      candidateId: WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      method: WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      notePrefix: "Gate I field-context candidate",
      warning: WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
    };
  }

  if (
    result?.airborneBasis?.method ===
      WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD &&
    result.airborneCandidateResolution?.selectedCandidateId ===
      WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
  ) {
    return {
      basisLabel: "Local-substitution field-context harmonization",
      candidateId: WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      method: WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      notePrefix: "Local-substitution field-context candidate",
      warning: WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING
    };
  }

  return null;
}

export function isGateIAirborneFieldContextSurface(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return getFieldSurfaceDefinition(result) !== null;
}

export function getGateIAirborneFieldContextSurface(
  result: AssemblyCalculation | null | undefined
): AirborneFieldContextSurface | null {
  const definition = getFieldSurfaceDefinition(result);

  if (!definition || !result) {
    return null;
  }

  const budgetLabel = `+/-${formatBudget(getFieldPredictionBudget(result))} dB`;
  const method = definition.method;
  const candidateId = definition.candidateId;
  const familyLabel = result.dynamicAirborneTrace?.detectedFamilyLabel ?? "owned airborne family route";
  const warning = result.warnings.find((entry: string) => entry === definition.warning) ?? definition.warning;
  const summary =
    `${definition.basisLabel} is active through ${method}. ` +
    `Candidate ${candidateId} carries R'w/DnT,w from ${familyLabel} plus explicit field_between_rooms geometry; ` +
    `${budgetLabel} uncalibrated field prediction budget stays attached, this is not measured field evidence, ` +
    "and it is not a lab Rw/STC relabel.";

  return {
    budgetLabel,
    candidateId,
    detail: `${summary} ${warning}`,
    label: "Airborne field-context prediction",
    method,
    notes: [
      `${definition.notePrefix} ${candidateId} is selected through ${method}.`,
      `Field uncertainty remains ${budgetLabel}; this is not measured field evidence and is not a lab Rw/STC relabel.`,
      warning
    ],
    postureDetail: `${summary} ${warning}`,
    reportLines: [
      `- Airborne field basis: ${definition.basisLabel} (candidate ${candidateId}; method ${method}).`,
      `- Airborne field error budget: R'w/DnT,w use ${budgetLabel} uncalibrated field prediction budget; not measured field evidence yes.`,
      `- Airborne field warning: ${warning}`
    ],
    warning
  };
}
