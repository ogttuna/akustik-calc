import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD =
  "company_internal_opening_leak_field_area_energy_runtime_corridor";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD =
  "company_internal_opening_leak_building_area_energy_runtime_corridor";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID =
  "candidate_company_internal_opening_leak_field_family_physics_prediction";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID =
  "candidate_company_internal_opening_leak_building_family_physics_prediction";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID =
  "candidate_company_internal_opening_leak_a_weighted_family_physics_prediction";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET =
  "third_octave_100_3150";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING =
  "Opening/leak field/building runtime corridor active: field and building outputs are calculated from the Gate S lab composite opening/leak Rw plus explicit flanking, junction, and room-normalization terms. The result is source-absent, not measured field/building evidence.";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING =
  "Opening/leak A-weighted runtime corridor active: Dn,A / DnT,A are calculated from the same-route opening/leak field/building value plus the owned -0.8 dB A-weighted adapter over third-octave 100-3150 Hz input. The result is source-absent, not measured A-weighted evidence.";

export type OpeningLeakFieldBuildingSurface = {
  aWeighted: boolean;
  budgetLabel: string;
  candidateId: string;
  detail: string;
  frequencyBandSet?: typeof WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET;
  label: string;
  method: string;
  notes: readonly string[];
  postureDetail: string;
  reportLines: readonly string[];
  routeBasis: "building_prediction" | "field_between_rooms";
  unsupportedOutputs: readonly RequestedOutputId[];
  warning: string;
};

const FIELD_METHODS = new Set([
  WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD
]);

const FIELD_SUPPORTED_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "DnT,w"]);
const BUILDING_SUPPORTED_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "DnT,w"]);
const A_WEIGHTED_FIELD_SUPPORTED_OUTPUTS = new Set<RequestedOutputId>([
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
]);
const A_WEIGHTED_BUILDING_SUPPORTED_OUTPUTS = new Set<RequestedOutputId>([
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
]);
const UNSUPPORTED_ALIAS_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Rw",
  "STC"
]);

function formatDb(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "unavailable";
  }

  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function formatBudget(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function getBudget(result: AssemblyCalculation): number {
  const budget = result.airborneBasis?.errorBudgetDb;

  if (typeof budget === "number" && Number.isFinite(budget)) {
    return budget;
  }

  if (result.airborneBasis?.method === WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD) {
    return isBuildingSurface(result) ? 11 : 9;
  }

  return result.airborneBasis?.method === WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD ? 10 : 8;
}

function getCandidateId(result: AssemblyCalculation): string {
  const selected = result.airborneCandidateResolution?.selectedCandidateId;

  if (typeof selected === "string" && selected.length > 0) {
    return selected;
  }

  if (result.airborneBasis?.method === WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD) {
    return WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID;
  }

  return result.airborneBasis?.method === WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
    ? WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID
    : WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID;
}

function isBuildingSurface(result: AssemblyCalculation): boolean {
  if (result.airborneBasis?.method === WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD) {
    if (result.airborneBasis.errorBudgetDb === 11) {
      return true;
    }

    if (result.airborneBasis.errorBudgetDb === 9) {
      return false;
    }

    return (
      result.supportedTargetOutputs.includes("DnT,A") &&
      !result.supportedTargetOutputs.includes("Dn,A") &&
      result.unsupportedTargetOutputs.includes("Dn,A")
    ) || (
      typeof result.metrics.estimatedDnWDb !== "number" &&
      typeof result.metrics.estimatedDnADb !== "number"
    );
  }

  return result.airborneBasis?.method === WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD;
}

function getSupportedOutputs(surface: OpeningLeakFieldBuildingSurface): ReadonlySet<RequestedOutputId> {
  if (surface.aWeighted) {
    return surface.routeBasis === "building_prediction"
      ? A_WEIGHTED_BUILDING_SUPPORTED_OUTPUTS
      : A_WEIGHTED_FIELD_SUPPORTED_OUTPUTS;
  }

  return surface.routeBasis === "building_prediction"
    ? BUILDING_SUPPORTED_OUTPUTS
    : FIELD_SUPPORTED_OUTPUTS;
}

export function isCompanyInternalOpeningLeakFieldBuildingSurface(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return (
    FIELD_METHODS.has(result?.airborneBasis?.method ?? "") &&
    result?.airborneBasis?.origin === "family_physics_prediction"
  );
}

export function getCompanyInternalOpeningLeakFieldBuildingSurface(
  result: AssemblyCalculation | null | undefined
): OpeningLeakFieldBuildingSurface | null {
  if (!isCompanyInternalOpeningLeakFieldBuildingSurface(result)) {
    return null;
  }

  const building = isBuildingSurface(result);
  const method = result.airborneBasis.method;
  const aWeighted = method === WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD;
  const budgetLabel = `+/-${formatBudget(getBudget(result))} dB`;
  const candidateId = getCandidateId(result);
  const warning =
    result.warnings.find((entry: string) =>
      entry === (
        aWeighted
          ? WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING
          : WEB_COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING
      )
    ) ??
    (aWeighted
      ? WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING
      : WEB_COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING);
  const unsupportedOutputs = result.unsupportedTargetOutputs.filter((output: RequestedOutputId) =>
    UNSUPPORTED_ALIAS_OUTPUTS.has(output)
  );
  const routeBasis = building ? "building_prediction" : "field_between_rooms";
  const label = aWeighted
    ? building
      ? "Opening/leak A-weighted building adapter"
      : "Opening/leak A-weighted field adapter"
    : building
      ? "Opening/leak building adapter"
      : "Opening/leak field adapter";
  const values = building
    ? aWeighted
      ? `R'w ${formatDb(result.metrics.estimatedRwPrimeDb)} dB, Dn,w ${formatDb(result.metrics.estimatedDnWDb)} dB, DnT,w ${formatDb(result.metrics.estimatedDnTwDb)} dB, Dn,A ${formatDb(result.metrics.estimatedDnADb)} dB, and DnT,A ${formatDb(result.metrics.estimatedDnTADb)} dB`
      : `R'w ${formatDb(result.metrics.estimatedRwPrimeDb)} dB, Dn,w ${formatDb(result.metrics.estimatedDnWDb)} dB, and DnT,w ${formatDb(result.metrics.estimatedDnTwDb)} dB`
    : aWeighted
      ? `R'w ${formatDb(result.metrics.estimatedRwPrimeDb)} dB, Dn,w ${formatDb(result.metrics.estimatedDnWDb)} dB, DnT,w ${formatDb(result.metrics.estimatedDnTwDb)} dB, Dn,A ${formatDb(result.metrics.estimatedDnADb)} dB, and DnT,A ${formatDb(result.metrics.estimatedDnTADb)} dB`
      : `R'w ${formatDb(result.metrics.estimatedRwPrimeDb)} dB, Dn,w ${formatDb(result.metrics.estimatedDnWDb)} dB, and DnT,w ${formatDb(result.metrics.estimatedDnTwDb)} dB`;
  const aliasText =
    unsupportedOutputs.length > 0
      ? ` Unsupported outputs stay parked: ${unsupportedOutputs.join(", ")}.`
      : "";
  const adapterText = aWeighted
    ? ` A-weighted values use frequency band set ${WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET} and the owned ISO 717-1 spectrum-adapter term from the same-route Dn,w / DnT,w values.`
    : "";
  const aliasGuard = aWeighted
    ? "not a lab Rw/STC alias"
    : "not a lab Rw/STC alias";
  const detail =
    `${label} is active through ${method}. Candidate ${candidateId} calculates ${values} from the Gate S lab opening/leak composite Rw ${formatDb(result.metrics.estimatedRwDb)} dB plus explicit flanking, junction, and room-normalization terms. ` +
    `${budgetLabel} source-absent ${building ? "building" : "field"} budget stays attached; this is not measured ${building ? "building" : "field"} evidence and ${aliasGuard}.${adapterText}${aliasText} ${warning}`;

  return {
    aWeighted,
    budgetLabel,
    candidateId,
    detail,
    frequencyBandSet: aWeighted ? WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET : undefined,
    label,
    method,
    notes: [
      `${label} selected candidate ${candidateId} through ${method}.`,
      `${building ? "Building" : "Field"} uncertainty remains ${budgetLabel}; this is source-absent and not measured evidence.`,
      aWeighted
        ? `A-weighted frequency band set is ${WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET}; Dn,A / DnT,A stay same-route adapter outputs, not measured evidence.`
        : "Gate S lab opening/leak Rw is only the direct anchor; lab Rw/STC and A-weighted companions are not aliased.",
      warning
    ],
    postureDetail: detail,
    reportLines: [
      `- Airborne opening/leak ${building ? "building" : "field"} basis: ${label} (candidate ${candidateId}; method ${method}; route ${routeBasis}).`,
      `- Airborne opening/leak ${building ? "building" : "field"} values: ${values}; source-absent budget ${budgetLabel}; not measured evidence yes.`,
      aWeighted
        ? `- Airborne opening/leak A-weighted owner: frequency band set ${WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET}; same-route spectrum-adapter basis; lab Rw/STC aliases remain blocked.`
        : "- Airborne opening/leak field/building owners: Gate S lab composite Rw, explicit opening data, field flanking, partition geometry, room standardization, and building junction terms stay separate from lab Rw/STC.",
      ...(unsupportedOutputs.length > 0
        ? [
            `- Airborne opening/leak field/building unsupported outputs: ${unsupportedOutputs.join(", ")} stay unsupported; no lab/A-weighted alias.`
          ]
        : []),
      `- Airborne opening/leak field/building warning: ${warning}`
    ],
    routeBasis,
    unsupportedOutputs,
    warning
  };
}

export function getCompanyInternalOpeningLeakFieldBuildingOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  const surface = getCompanyInternalOpeningLeakFieldBuildingSurface(result);

  if (!surface) {
    return null;
  }

  const supportedOutputs = getSupportedOutputs(surface);

  if (supportedOutputs.has(output)) {
    return surface.detail;
  }

  if (surface.unsupportedOutputs.includes(output) || UNSUPPORTED_ALIAS_OUTPUTS.has(output)) {
    return `${surface.detail} ${output} remains unsupported on the ${surface.label} route because that metric needs its own field/building, A-weighted, or lab basis.`;
  }

  return null;
}

export function getCompanyInternalOpeningLeakFieldBuildingReportLines(
  result: AssemblyCalculation | null | undefined
): readonly string[] {
  return getCompanyInternalOpeningLeakFieldBuildingSurface(result)?.reportLines ?? [];
}
