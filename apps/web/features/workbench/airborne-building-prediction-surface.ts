import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

export const WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD =
  "gate_ar_airborne_building_prediction_all_owner_runtime_corridor";

export const WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID =
  "candidate_airborne_building_prediction_all_owner_family_physics_prediction";

export const WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING =
  "Airborne building-prediction runtime corridor is active from the owned direct curve, explicit flanking/junction context, room standardization, and the Gate AQ +/-9 dB source-absent uncertainty budget. It is not measured building evidence.";

export type AirborneBuildingPredictionSurface = {
  budgetLabel: string;
  candidateId: string;
  detail: string;
  label: string;
  method: string;
  notes: readonly string[];
  postureDetail: string;
  reportLines: readonly string[];
  unsupportedAliasOutputs: readonly RequestedOutputId[];
  warning: string;
};

const BUILDING_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]);
const LAB_ALIAS_OUTPUTS = new Set<RequestedOutputId>(["Rw", "STC", "C", "Ctr"]);

function formatBudget(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function formatMetric(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value) ? formatBudget(value) : "unavailable";
}

function joinMetricText(parts: readonly string[]): string {
  if (parts.length <= 1) {
    return parts[0] ?? "unavailable";
  }

  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

function getBuildingValueText(result: AssemblyCalculation): string {
  const outputSet = new Set(result.supportedTargetOutputs);
  const parts: string[] = [];

  if (outputSet.has("R'w")) {
    parts.push(`R'w ${formatMetric(result.metrics.estimatedRwPrimeDb)} dB`);
  }
  if (outputSet.has("Dn,w")) {
    parts.push(`Dn,w ${formatMetric(result.metrics.estimatedDnWDb)} dB`);
  }
  if (outputSet.has("Dn,A")) {
    parts.push(`Dn,A ${formatMetric(result.metrics.estimatedDnADb)} dB`);
  }
  if (outputSet.has("DnT,w")) {
    parts.push(`DnT,w ${formatMetric(result.metrics.estimatedDnTwDb)} dB`);
  }
  if (outputSet.has("DnT,A")) {
    parts.push(`DnT,A ${formatMetric(result.metrics.estimatedDnTADb)} dB`);
  }

  return parts.length > 0
    ? joinMetricText(parts)
    : `R'w ${formatMetric(result.metrics.estimatedRwPrimeDb)} dB and DnT,w ${formatMetric(result.metrics.estimatedDnTwDb)} dB`;
}

function getBuildingPredictionBudget(result: AssemblyCalculation): number {
  const budget = result.airborneBasis?.errorBudgetDb;

  return typeof budget === "number" && Number.isFinite(budget) ? budget : 9;
}

export function isGateARAirborneBuildingPredictionSurface(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return (
    result?.airborneBasis?.method === WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD &&
    result.airborneCandidateResolution?.selectedCandidateId ===
      WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID &&
    result.airborneBasis.origin === "family_physics_prediction"
  );
}

export function getGateARAirborneBuildingPredictionSurface(
  result: AssemblyCalculation | null | undefined
): AirborneBuildingPredictionSurface | null {
  if (!isGateARAirborneBuildingPredictionSurface(result)) {
    return null;
  }

  const budgetLabel = `+/-${formatBudget(getBuildingPredictionBudget(result))} dB`;
  const method = result.airborneBasis.method;
  const candidateId = result.airborneCandidateResolution.selectedCandidateId;
  const familyLabel = result.dynamicAirborneTrace?.detectedFamilyLabel ?? "owned airborne family route";
  const unsupportedAliasOutputs = result.unsupportedTargetOutputs.filter((output: RequestedOutputId) =>
    LAB_ALIAS_OUTPUTS.has(output)
  );
  const warning =
    result.warnings.find((entry: string) => entry === WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING) ??
    WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING;
  const supportedLabCompanions = result.supportedTargetOutputs.filter((output: RequestedOutputId) =>
    LAB_ALIAS_OUTPUTS.has(output)
  );
  const valueText = getBuildingValueText(result);
  const aliasText =
    unsupportedAliasOutputs.length > 0
      ? ` Requested lab aliases stay unsupported: ${unsupportedAliasOutputs.join(", ")}.`
      : supportedLabCompanions.length > 0
      ? ` Requested lab companions stay on the direct element-lab curve: ${supportedLabCompanions.join(", ")}.`
      : " Lab Rw/STC/C/Ctr are not relabelled as building metrics.";
  const summary =
    `Gate AR airborne building-prediction runtime is active through ${method}. ` +
    `Candidate ${candidateId} carries ${valueText} from ${familyLabel} plus explicit building_prediction ` +
    `flanking/junction and room-standardization owners; ${budgetLabel} source-absent building-prediction ` +
    `budget stays attached, this is not measured building evidence, and it is not a lab Rw/STC relabel.`;
  const detail = `${summary}${aliasText} ${warning}`;

  return {
    budgetLabel,
    candidateId,
    detail,
    label: "Airborne building prediction",
    method,
    notes: [
      `Gate AR building-prediction candidate ${candidateId} is selected through ${method}.`,
      `Building uncertainty remains ${budgetLabel}; this is not measured building evidence and is not a lab Rw/STC relabel.`,
      warning
    ],
    postureDetail: detail,
    reportLines: [
      `- Airborne building basis: Gate AR all-owner building-prediction runtime (candidate ${candidateId}; method ${method}).`,
      `- Airborne building values: ${valueText}; source-absent budget ${budgetLabel}; not measured building evidence yes.`,
      "- Airborne building owners: direct separating-element curve, flanking/junction context, junction coupling length, room standardization, and uncertainty budget are explicit.",
      `- Airborne building warning: ${warning}`
    ],
    unsupportedAliasOutputs,
    warning
  };
}

export function getGateARAirborneBuildingPredictionOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  const surface = getGateARAirborneBuildingPredictionSurface(result);

  if (!surface) {
    return null;
  }

  if (BUILDING_OUTPUTS.has(output)) {
    return surface.detail;
  }

  if (surface.unsupportedAliasOutputs.includes(output)) {
    return `${surface.detail} ${output} remains unsupported on the Gate AR building-prediction route because lab/spectrum-adapter outputs need their own basis.`;
  }

  if (LAB_ALIAS_OUTPUTS.has(output) && result?.supportedTargetOutputs.includes(output)) {
    return `${surface.detail} ${output} is published as a lab direct-curve companion; it is not relabelled as a building metric.`;
  }

  return null;
}

export function getGateARAirborneBuildingPredictionReportLines(
  result: AssemblyCalculation | null | undefined
): readonly string[] {
  return getGateARAirborneBuildingPredictionSurface(result)?.reportLines ?? [];
}
