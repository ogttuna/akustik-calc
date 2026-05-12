import type { AssemblyCalculation, RatingAdapterBasis, RequestedOutputId } from "@dynecho/shared";

export const WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD =
  "gate_s_opening_leak_composite_area_energy_runtime_corridor";

export const WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING =
  "Opening/leak composite runtime corridor active: lab Rw uses the selected host-wall candidate, area-weighted opening transmission, explicit seal/leakage penalty, and a +/-6 dB source-absent budget. STC, field, and building outputs stay unsupported without owned adapters.";

export const WEB_GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING =
  "Opening/leak STC spectrum adapter active: lab STC is re-rated with ASTM E413 from the host-wall transmission-loss spectrum shifted by the Gate S area-energy opening loss. It is source-absent, uses the same +/-6 dB opening/leak budget, and does not alias field or building outputs.";

export type OpeningLeakCompositeSurface = {
  budgetLabel: string | null;
  detail: string;
  label: string;
  method: string;
  missingInputs: readonly string[];
  notes: readonly string[];
  origin: string;
  postureDetail: string;
  reportLines: readonly string[];
  unsupportedOutputs: readonly RequestedOutputId[];
  warning: string | null;
};

const OPENING_AFFECTED_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w",
  "Rw",
  "STC"
]);

function formatBudget(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function listOutputs(outputs: readonly RequestedOutputId[]): string {
  return outputs.join(", ");
}

function hasOpeningLeakCompositeMethod(result: AssemblyCalculation | null | undefined): result is AssemblyCalculation {
  return result?.airborneBasis?.method === WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD;
}

function hasGateAHOpeningLeakStcAdapter(result: AssemblyCalculation | null | undefined): boolean {
  return Boolean(
    result?.ratingAdapterBasisSet?.some(
      (basis: RatingAdapterBasis) =>
        basis.adapterId === "astm_e413_stc_from_airborne_transmission_loss_curve" &&
        basis.metricId === "STC" &&
        basis.implementationStatus === "runtime_adapter"
    )
  );
}

export function isGateSOpeningLeakCompositeRuntimeSurface(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return hasOpeningLeakCompositeMethod(result) && result.airborneBasis?.origin === "family_physics_prediction";
}

export function isGateSOpeningLeakCompositeBoundarySurface(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return hasOpeningLeakCompositeMethod(result) && result.airborneBasis?.origin !== "family_physics_prediction";
}

export function getGateSOpeningLeakCompositeSurface(
  result: AssemblyCalculation | null | undefined
): OpeningLeakCompositeSurface | null {
  if (!hasOpeningLeakCompositeMethod(result)) {
    return null;
  }

  const basis = result.airborneBasis;
  const budgetLabel =
    typeof basis?.errorBudgetDb === "number" && Number.isFinite(basis.errorBudgetDb)
      ? `+/-${formatBudget(basis.errorBudgetDb)} dB`
      : null;
  const method = basis.method;
  const origin = basis.origin;
  const missingInputs = basis.missingPhysicalInputs ?? [];
  const unsupportedOutputs = result.unsupportedTargetOutputs.filter((output: RequestedOutputId) =>
    OPENING_AFFECTED_OUTPUTS.has(output)
  );
  const stcAdapterActive = hasGateAHOpeningLeakStcAdapter(result);
  const warning =
    result.warnings.find((entry: string) => entry === WEB_GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING) ??
    result.warnings.find((entry: string) => entry === WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING) ??
    result.warnings.find((entry: string) => /Opening\/leak composite runtime/i.test(entry)) ??
    result.warnings.find((entry: string) => /Opening\/leak STC spectrum adapter/i.test(entry)) ??
    null;
  const label =
    origin === "family_physics_prediction"
      ? "Opening/leak composite runtime"
      : origin === "needs_input"
        ? "Opening/leak input needed"
        : "Opening/leak boundary";
  const budgetText = budgetLabel
    ? `${budgetLabel} source-absent lab ${stcAdapterActive ? "Rw / STC" : "Rw"} budget`
    : "no runtime tolerance because this opening/leak route is blocked";
  const unsupportedText =
    unsupportedOutputs.length > 0
      ? ` Unsupported outputs stay parked: ${listOutputs(unsupportedOutputs)}.`
      : "";
  const missingText =
    missingInputs.length > 0
      ? ` Missing physical inputs: ${missingInputs.join(", ")}.`
      : "";
  const baseDetail =
    origin === "family_physics_prediction"
      ? `Gate S opening/leak composite runtime is active through ${method}: lab Rw ${formatBudget(result.metrics.estimatedRwDb)} dB${stcAdapterActive ? ` and Gate AH lab STC ${formatBudget(result.metrics.estimatedStc)} dB` : ""} use host-wall plus opening area-energy transmission, ${budgetText}, origin ${origin}, not measured evidence.`
      : `Gate S opening/leak composite runtime is blocked through ${method}: origin ${origin}, ${budgetText}.${missingText}`;
  const aliasText = stcAdapterActive
    ? "STC is re-rated through the Gate AH ASTM E413 spectrum adapter; field and building outputs are not aliased from lab Rw/STC."
    : "STC, field, and building outputs are not aliased from lab Rw.";
  const detail = `${baseDetail}${unsupportedText} ${aliasText}${warning ? ` ${warning}` : ""}`;
  const notes = [
    origin === "family_physics_prediction"
      ? `Gate S selected ${method} with lab Rw ${formatBudget(result.metrics.estimatedRwDb)} dB${stcAdapterActive ? ` and Gate AH STC ${formatBudget(result.metrics.estimatedStc)} dB` : ""}.`
      : `Gate S kept ${method} blocked with origin ${origin}.`,
    budgetLabel
      ? `Opening/leak uncertainty remains ${budgetLabel}; this is not measured evidence.`
      : "No opening/leak error budget is shown because the route did not promote a lab Rw runtime result.",
    unsupportedOutputs.length > 0
      ? `Unsupported opening/leak outputs: ${listOutputs(unsupportedOutputs)}.`
      : "No unsupported opening/leak companion output was requested.",
    ...(missingInputs.length > 0 ? [`Missing opening/leak inputs: ${missingInputs.join(", ")}.`] : []),
    ...(warning ? [warning] : [])
  ];

  return {
    budgetLabel,
    detail,
    label,
    method,
    missingInputs,
    notes,
    origin,
    postureDetail: detail,
    reportLines: [
      `- Airborne opening/leak basis: Gate S opening/leak composite runtime (method ${method}; origin ${origin}).`,
      origin === "family_physics_prediction"
        ? `- Airborne opening/leak Rw: ${formatBudget(result.metrics.estimatedRwDb)} dB${stcAdapterActive ? `; STC: ${formatBudget(result.metrics.estimatedStc)} dB through Gate AH ASTM E413 adapter` : ""}, budget ${budgetLabel ?? "unavailable"}, not measured evidence.`
        : `- Airborne opening/leak status: ${origin}${missingInputs.length > 0 ? `; missing ${missingInputs.join(", ")}` : ""}.`,
      ...(unsupportedOutputs.length > 0
        ? [
            `- Airborne opening/leak unsupported outputs: ${listOutputs(unsupportedOutputs)} stay unsupported; no ${stcAdapterActive ? "field or building" : "STC, field, or building"} alias.`
          ]
        : []),
      ...(warning ? [`- Airborne opening/leak warning: ${warning}`] : [])
    ],
    unsupportedOutputs,
    warning
  };
}

export function getGateSOpeningLeakCompositeOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  const surface = getGateSOpeningLeakCompositeSurface(result);

  if (!surface || !OPENING_AFFECTED_OUTPUTS.has(output)) {
    return null;
  }

  if ((output === "Rw" || output === "STC") && surface.origin === "family_physics_prediction") {
    return surface.detail;
  }

  if (surface.origin === "needs_input") {
    return `${surface.detail} Complete ${surface.missingInputs.join(", ")} before ${output} can be promoted.`;
  }

  if (surface.unsupportedOutputs.includes(output)) {
    return `${surface.detail} ${output} remains unsupported on the Gate S opening/leak route.`;
  }

  return surface.detail;
}

export function getGateSOpeningLeakCompositeReportLines(
  result: AssemblyCalculation | null | undefined
): readonly string[] {
  return getGateSOpeningLeakCompositeSurface(result)?.reportLines ?? [];
}
