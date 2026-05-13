import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

export const WEB_GATE_AY_ADVANCED_WALL_RUNTIME_METHOD =
  "gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor";

export const WEB_GATE_AY_ADVANCED_WALL_RUNTIME_WARNING =
  "Advanced wall source-absent runtime corridor active: element-lab Rw/STC/C/Ctr are calculated from explicit panel, cavity, absorber, frame/coupling, and opening intent inputs. Use the visible +/-8 dB Rw/STC and +/-3 dB C/Ctr source-absent budgets until same-family holdouts calibrate this route.";

export type AdvancedWallSourceAbsentSurface = {
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

const ADVANCED_WALL_OUTPUTS = new Set<RequestedOutputId>([
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

function formatValue(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function hasGateAYAdvancedWallMethod(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return result?.airborneBasis?.method === WEB_GATE_AY_ADVANCED_WALL_RUNTIME_METHOD;
}

function budgetLabel(result: AssemblyCalculation): string | null {
  const budget = result.airborneBasis?.errorBudgetDb;
  return typeof budget === "number" && Number.isFinite(budget)
    ? `+/-${formatValue(budget)} dB Rw/STC; +/-3 dB C/Ctr`
    : null;
}

export function getGateAYAdvancedWallSurface(
  result: AssemblyCalculation | null | undefined
): AdvancedWallSourceAbsentSurface | null {
  if (!hasGateAYAdvancedWallMethod(result) || !result.airborneBasis) {
    return null;
  }

  const basis = result.airborneBasis;
  const method = basis.method;
  const origin = basis.origin;
  const missingInputs = basis.missingPhysicalInputs ?? [];
  const unsupportedOutputs = result.unsupportedTargetOutputs.filter((output: RequestedOutputId) =>
    ADVANCED_WALL_OUTPUTS.has(output)
  );
  const budget = budgetLabel(result);
  const warnings = result.warnings as readonly string[];
  const warning =
    warnings.find((entry: string) => entry === WEB_GATE_AY_ADVANCED_WALL_RUNTIME_WARNING) ??
    warnings.find((entry: string) => /Advanced wall source-absent runtime corridor/i.test(entry)) ??
    null;
  const label =
    origin === "family_physics_prediction"
      ? "Advanced wall source-absent runtime"
      : origin === "needs_input"
        ? "Advanced wall input needed"
        : "Advanced wall boundary";
  const detail =
    origin === "family_physics_prediction"
      ? `Gate AY advanced wall runtime is active through ${method}: lab Rw ${formatValue(result.metrics.estimatedRwDb)} dB, STC ${formatValue(result.metrics.estimatedStc)} dB, C ${formatValue(result.metrics.estimatedCDb)} dB, Ctr ${formatValue(result.metrics.estimatedCtrDb)} dB, budget ${budget ?? "unavailable"}, not measured evidence. Field and building outputs are not aliased.`
      : `Gate AY advanced wall runtime is blocked through ${method}: origin ${origin}${missingInputs.length > 0 ? `, missing ${missingInputs.join(", ")}` : ""}. No source-absent lab budget is shown while blocked.`;

  return {
    budgetLabel: budget,
    detail: warning ? `${detail} ${warning}` : detail,
    label,
    method,
    missingInputs,
    notes: [
      origin === "family_physics_prediction"
        ? `Gate AY selected ${method} with lab Rw ${formatValue(result.metrics.estimatedRwDb)} dB / STC ${formatValue(result.metrics.estimatedStc)} dB.`
        : `Gate AY kept ${method} blocked with origin ${origin}.`,
      budget
        ? `Advanced-wall uncertainty remains ${budget}; this is not measured evidence.`
        : "No advanced-wall error budget is shown because the route did not promote a lab runtime result.",
      unsupportedOutputs.length > 0
        ? `Unsupported advanced-wall outputs: ${unsupportedOutputs.join(", ")}.`
        : "No unsupported advanced-wall companion output was requested.",
      ...(warning ? [warning] : [])
    ],
    origin,
    postureDetail: warning ? `${detail} ${warning}` : detail,
    reportLines: [
      `- Airborne advanced-wall basis: Gate AY advanced wall source-absent runtime (method ${method}; origin ${origin}).`,
      origin === "family_physics_prediction"
        ? `- Airborne advanced-wall values: Rw ${formatValue(result.metrics.estimatedRwDb)} dB; STC ${formatValue(result.metrics.estimatedStc)} dB; C ${formatValue(result.metrics.estimatedCDb)} dB; Ctr ${formatValue(result.metrics.estimatedCtrDb)} dB; budget ${budget ?? "unavailable"}; not measured evidence.`
        : `- Airborne advanced-wall status: ${origin}${missingInputs.length > 0 ? `; missing ${missingInputs.join(", ")}` : ""}.`,
      ...(unsupportedOutputs.length > 0
        ? [
            `- Airborne advanced-wall unsupported outputs: ${unsupportedOutputs.join(", ")} stay unsupported; no field/building alias.`
          ]
        : []),
      ...(warning ? [`- Airborne advanced-wall warning: ${warning}`] : [])
    ],
    unsupportedOutputs,
    warning
  };
}

export function getGateAYAdvancedWallOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  const surface = getGateAYAdvancedWallSurface(result);

  if (!surface || !ADVANCED_WALL_OUTPUTS.has(output)) {
    return null;
  }

  if (surface.origin === "family_physics_prediction" && ["Rw", "STC", "C", "Ctr"].includes(output)) {
    return surface.detail;
  }

  if (surface.origin === "needs_input") {
    return `${surface.detail} Complete ${surface.missingInputs.join(", ")} before ${output} can be promoted.`;
  }

  if (surface.unsupportedOutputs.includes(output)) {
    return `${surface.detail} ${output} remains unsupported on the Gate AY advanced-wall route.`;
  }

  return surface.detail;
}

export function getGateAYAdvancedWallReportLines(
  result: AssemblyCalculation | null | undefined
): readonly string[] {
  return getGateAYAdvancedWallSurface(result)?.reportLines ?? [];
}
