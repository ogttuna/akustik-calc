import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD =
  "company_internal_opening_leak_field_area_energy_runtime_corridor";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD =
  "company_internal_opening_leak_building_area_energy_runtime_corridor";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID =
  "candidate_company_internal_opening_leak_field_family_physics_prediction";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID =
  "candidate_company_internal_opening_leak_building_family_physics_prediction";

export const WEB_COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING =
  "Opening/leak field/building runtime corridor active: field and building outputs are calculated from the Gate S lab composite opening/leak Rw plus explicit flanking, junction, and room-normalization terms. The result is source-absent, not measured field/building evidence.";

export type OpeningLeakFieldBuildingSurface = {
  budgetLabel: string;
  candidateId: string;
  detail: string;
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
  WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
]);

const FIELD_SUPPORTED_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "DnT,w"]);
const BUILDING_SUPPORTED_OUTPUTS = new Set<RequestedOutputId>(["R'w", "DnT,w"]);
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

  return result.airborneBasis?.method === WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD ? 10 : 8;
}

function getCandidateId(result: AssemblyCalculation): string {
  const selected = result.airborneCandidateResolution?.selectedCandidateId;

  if (typeof selected === "string" && selected.length > 0) {
    return selected;
  }

  return result.airborneBasis?.method === WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
    ? WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID
    : WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID;
}

function isBuildingSurface(result: AssemblyCalculation): boolean {
  return result.airborneBasis?.method === WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD;
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
  const budgetLabel = `+/-${formatBudget(getBudget(result))} dB`;
  const candidateId = getCandidateId(result);
  const warning =
    result.warnings.find((entry: string) => entry === WEB_COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING) ??
    WEB_COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING;
  const unsupportedOutputs = result.unsupportedTargetOutputs.filter((output: RequestedOutputId) =>
    UNSUPPORTED_ALIAS_OUTPUTS.has(output)
  );
  const routeBasis = building ? "building_prediction" : "field_between_rooms";
  const label = building ? "Opening/leak building adapter" : "Opening/leak field adapter";
  const values = building
    ? `R'w ${formatDb(result.metrics.estimatedRwPrimeDb)} dB and DnT,w ${formatDb(result.metrics.estimatedDnTwDb)} dB`
    : `R'w ${formatDb(result.metrics.estimatedRwPrimeDb)} dB, Dn,w ${formatDb(result.metrics.estimatedDnWDb)} dB, and DnT,w ${formatDb(result.metrics.estimatedDnTwDb)} dB`;
  const aliasText =
    unsupportedOutputs.length > 0
      ? ` Unsupported outputs stay parked: ${unsupportedOutputs.join(", ")}.`
      : "";
  const detail =
    `${label} is active through ${method}. Candidate ${candidateId} calculates ${values} from the Gate S lab opening/leak composite Rw ${formatDb(result.metrics.estimatedRwDb)} dB plus explicit flanking, junction, and room-normalization terms. ` +
    `${budgetLabel} source-absent ${building ? "building" : "field"} budget stays attached; this is not measured ${building ? "building" : "field"} evidence and not a lab Rw/STC alias.${aliasText} ${warning}`;

  return {
    budgetLabel,
    candidateId,
    detail,
    label,
    method,
    notes: [
      `${label} selected candidate ${candidateId} through ${method}.`,
      `${building ? "Building" : "Field"} uncertainty remains ${budgetLabel}; this is source-absent and not measured evidence.`,
      "Gate S lab opening/leak Rw is only the direct anchor; lab Rw/STC and A-weighted companions are not aliased.",
      warning
    ],
    postureDetail: detail,
    reportLines: [
      `- Airborne opening/leak ${building ? "building" : "field"} basis: ${label} (candidate ${candidateId}; method ${method}; route ${routeBasis}).`,
      `- Airborne opening/leak ${building ? "building" : "field"} values: ${values}; source-absent budget ${budgetLabel}; not measured evidence yes.`,
      "- Airborne opening/leak field/building owners: Gate S lab composite Rw, explicit opening data, field flanking, partition geometry, room standardization, and building junction terms stay separate from lab Rw/STC.",
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

  const supportedOutputs = surface.routeBasis === "building_prediction" ? BUILDING_SUPPORTED_OUTPUTS : FIELD_SUPPORTED_OUTPUTS;

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
