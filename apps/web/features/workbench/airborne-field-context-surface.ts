import type { AssemblyCalculation } from "@dynecho/shared";

export const WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD =
  "gate_i_airborne_field_apparent_context_adapter_runtime";

export const WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID =
  "candidate_airborne_field_context_family_physics_prediction";

export const WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING =
  "Airborne field/apparent context family prediction is active from an owned lab-family route plus explicit receiving-room context. It is not a measured field row and must keep its field uncertainty separate from lab Rw/STC.";

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

export function isGateIAirborneFieldContextSurface(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return (
    result?.airborneBasis?.method === WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD &&
    result.airborneCandidateResolution?.selectedCandidateId ===
      WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
  );
}

export function getGateIAirborneFieldContextSurface(
  result: AssemblyCalculation | null | undefined
): AirborneFieldContextSurface | null {
  if (!isGateIAirborneFieldContextSurface(result)) {
    return null;
  }

  const budgetLabel = `+/-${formatBudget(getFieldPredictionBudget(result))} dB`;
  const method = result.airborneBasis.method;
  const candidateId = result.airborneCandidateResolution.selectedCandidateId;
  const familyLabel = result.dynamicAirborneTrace?.detectedFamilyLabel ?? "owned airborne family route";
  const warning =
    result.warnings.find((entry: string) => entry === WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING) ??
    WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING;
  const summary =
    `Gate I airborne field/apparent context adapter is active through ${method}. ` +
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
      `Gate I field-context candidate ${candidateId} is selected through ${method}.`,
      `Field uncertainty remains ${budgetLabel}; this is not measured field evidence and is not a lab Rw/STC relabel.`,
      warning
    ],
    postureDetail: `${summary} ${warning}`,
    reportLines: [
      `- Airborne field basis: Gate I airborne field/apparent context adapter (candidate ${candidateId}; method ${method}).`,
      `- Airborne field error budget: R'w/DnT,w use ${budgetLabel} uncalibrated field prediction budget; not measured field evidence yes.`,
      `- Airborne field warning: ${warning}`
    ],
    warning
  };
}
