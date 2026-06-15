import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

import { parseWorkbenchNumber } from "./parse-number";

export type ResultAnswerChartCompanion = {
  label: string;
  valueLabel: string;
};

export type ResultAnswerChartLane = {
  companions: readonly ResultAnswerChartCompanion[];
  detail: string;
  direction: "higher_better" | "lower_better";
  id: string;
  label: string;
  max: number;
  min: number;
  target: number | null;
  targetLabel: string | null;
  value: number;
  valueLabel: string;
};

export const AIRBORNE_ANSWER_OUTPUTS = new Set<RequestedOutputId>([
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

export const IMPACT_ANSWER_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "CI",
  "CI,50-2500",
  "DeltaLw",
  "IIC",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "LnT,A",
  "Ln,w",
  "Ln,w+CI"
]);

function isResultTargetScoped(result: AssemblyCalculation): boolean {
  return (result.targetOutputs?.length ?? 0) > 0;
}

export function isSupportedAnswerOutput(
  result: AssemblyCalculation | null | undefined,
  output: RequestedOutputId
): boolean {
  if (!result) {
    return false;
  }

  if (!isResultTargetScoped(result)) {
    return true;
  }

  if (result.supportedTargetOutputs.includes(output)) {
    return true;
  }

  if (output === "CI,50-2500" && result.supportedTargetOutputs.includes("L'nT,50")) {
    return true;
  }

  if (output === "CI" && result.supportedTargetOutputs.includes("Ln,w+CI")) {
    return true;
  }

  return false;
}

export function hasSupportedAirborneAnswer(result: AssemblyCalculation | null | undefined): boolean {
  if (!result) {
    return false;
  }

  if (!isResultTargetScoped(result)) {
    return true;
  }

  return (result.supportedTargetOutputs ?? []).some((output: RequestedOutputId) => AIRBORNE_ANSWER_OUTPUTS.has(output));
}

export function hasSupportedImpactAnswer(result: AssemblyCalculation | null | undefined): boolean {
  if (!result) {
    return false;
  }

  if (!isResultTargetScoped(result)) {
    return Boolean(result.impact || result.lowerBoundImpact);
  }

  return (result.supportedTargetOutputs ?? []).some((output: RequestedOutputId) => IMPACT_ANSWER_OUTPUTS.has(output));
}

function formatDecimal(value: number): string {
  return Number.isInteger(value) ? value.toLocaleString("en-US") : value.toFixed(1).replace(/\.0$/u, "");
}

function formatSignedDb(value: number): string {
  return `${value >= 0 ? "+" : ""}${formatDecimal(value)} dB`;
}

function parseTarget(value: string | null | undefined): number | null {
  const parsed = parseWorkbenchNumber(value);
  return typeof parsed === "number" ? parsed : null;
}

export function isAirborneAnswerParked(result: AssemblyCalculation | null | undefined): boolean {
  if (!result) {
    return false;
  }

  const boundaryOrigin =
    result.acousticAnswerBoundary?.origin ?? result.airborneBasis?.origin;

  if (boundaryOrigin !== "needs_input" && boundaryOrigin !== "unsupported") {
    return false;
  }

  if (
    result.acousticAnswerBoundary &&
    !result.acousticAnswerBoundary.unsupportedOutputs.some((output: RequestedOutputId) =>
      AIRBORNE_ANSWER_OUTPUTS.has(output)
    )
  ) {
    return false;
  }

  return !(result.supportedTargetOutputs ?? []).some((output: RequestedOutputId) => AIRBORNE_ANSWER_OUTPUTS.has(output));
}

function buildAirborneLane(
  result: AssemblyCalculation,
  targetRwDb: string | null | undefined
): ResultAnswerChartLane | null {
  if (isAirborneAnswerParked(result) || !hasSupportedAirborneAnswer(result)) {
    return null;
  }

  const primary =
    result.airborneOverlay?.contextMode === "building_prediction" &&
    isSupportedAnswerOutput(result, "DnT,w") &&
    typeof result.metrics.estimatedDnTwDb === "number"
      ? { label: "DnT,w estimate", value: result.metrics.estimatedDnTwDb }
      : isSupportedAnswerOutput(result, "R'w") &&
          typeof result.metrics.estimatedRwPrimeDb === "number" &&
          result.ratings.iso717.descriptor === "R'w"
        ? { label: "R'w estimate", value: result.metrics.estimatedRwPrimeDb }
        : isSupportedAnswerOutput(result, "Rw") && typeof result.metrics.estimatedRwDb === "number"
          ? { label: "Rw estimate", value: result.metrics.estimatedRwDb }
          : null;

  if (!primary || !Number.isFinite(primary.value)) {
    return null;
  }

  const companions: ResultAnswerChartCompanion[] = [];

  if (isSupportedAnswerOutput(result, "STC") && typeof result.metrics.estimatedStc === "number") {
    companions.push({ label: "STC", valueLabel: `${formatDecimal(result.metrics.estimatedStc)} dB` });
  }

  const adaptationValues: string[] = [];
  if (isSupportedAnswerOutput(result, "C") && typeof result.metrics.estimatedCDb === "number") {
    adaptationValues.push(formatSignedDb(result.metrics.estimatedCDb));
  }
  if (isSupportedAnswerOutput(result, "Ctr") && typeof result.metrics.estimatedCtrDb === "number") {
    adaptationValues.push(formatSignedDb(result.metrics.estimatedCtrDb));
  }
  if (adaptationValues.length > 0) {
    companions.push({
      label: adaptationValues.length === 2 ? "C / Ctr" : isSupportedAnswerOutput(result, "C") ? "C" : "Ctr",
      valueLabel: adaptationValues.join(" / ")
    });
  }

  if (typeof result.metrics.estimatedDnTADb === "number" && isSupportedAnswerOutput(result, "DnT,A")) {
    companions.push({ label: "DnT,A", valueLabel: `${formatDecimal(result.metrics.estimatedDnTADb)} dB` });
  }

  return {
    companions,
    detail: "Primary airborne answer from the currently active screening or field-side lane.",
    direction: "higher_better",
    id: "airborne",
    label: primary.label,
    max: 85,
    min: 20,
    target: parseTarget(targetRwDb),
    targetLabel: parseTarget(targetRwDb) !== null ? `Brief minimum ${formatDecimal(parseTarget(targetRwDb)!)} dB` : null,
    value: primary.value,
    valueLabel: `${formatDecimal(primary.value)} dB`
  };
}

function buildImpactLane(
  result: AssemblyCalculation,
  targetLnwDb: string | null | undefined
): ResultAnswerChartLane | null {
  const impact = result.impact;
  const lowerBoundImpact = result.lowerBoundImpact;

  if (!hasSupportedImpactAnswer(result)) {
    return null;
  }

  if (impact) {
    const primary =
      typeof impact.IIC === "number" && isSupportedAnswerOutput(result, "IIC")
        ? {
            detail: "Primary ASTM E989 lab impact rating from exact ASTM E492 bands.",
            direction: "higher_better" as const,
            label: "IIC",
            value: impact.IIC
          }
        : typeof impact.AIIC === "number" && isSupportedAnswerOutput(result, "AIIC")
          ? {
              detail: "Primary ASTM E989 field impact rating from exact ASTM E1007 bands.",
              direction: "higher_better" as const,
              label: "AIIC",
              value: impact.AIIC
            }
          : impact.labOrField === "field" &&
              typeof impact.LPrimeNTw === "number" &&
              isSupportedAnswerOutput(result, "L'nT,w")
            ? {
                detail: "Primary standardized field-side impact answer.",
                direction: "lower_better" as const,
                label: "L'nT,w",
                value: impact.LPrimeNTw
              }
        : typeof impact.LPrimeNTw === "number" &&
            isSupportedAnswerOutput(result, "L'nT,w") &&
            !isSupportedAnswerOutput(result, "Ln,w")
          ? {
              detail: "Primary standardized field-side impact answer.",
              direction: "lower_better" as const,
              label: "L'nT,w",
              value: impact.LPrimeNTw
            }
        : typeof impact.LnWPlusCI === "number" &&
            isSupportedAnswerOutput(result, "Ln,w+CI") &&
            !isSupportedAnswerOutput(result, "Ln,w")
          ? {
              detail: "Primary lab-side combined impact answer.",
              direction: "lower_better" as const,
              label: "Ln,w+CI",
              value: impact.LnWPlusCI
            }
        : typeof impact.LnW === "number" && isSupportedAnswerOutput(result, "Ln,w")
          ? { detail: "Primary lab-side weighted impact answer.", direction: "lower_better" as const, label: "Ln,w", value: impact.LnW }
          : typeof impact.LPrimeNW === "number" && isSupportedAnswerOutput(result, "L'n,w")
            ? { detail: "Primary direct field carry-over impact answer.", direction: "lower_better" as const, label: "L'n,w", value: impact.LPrimeNW }
            : typeof impact.LnTA === "number" && isSupportedAnswerOutput(result, "LnT,A")
              ? { detail: "Primary Dutch exact impact answer from field octave bands.", direction: "lower_better" as const, label: "LnT,A", value: impact.LnTA }
              : null;

    if (!primary) {
      return null;
    }

    const companions: ResultAnswerChartCompanion[] = [];

    if (typeof impact.LnWPlusCI === "number" && isSupportedAnswerOutput(result, "Ln,w+CI")) {
      companions.push({ label: "Ln,w+CI", valueLabel: `${formatDecimal(impact.LnWPlusCI)} dB` });
    }
    if (typeof impact.LPrimeNW === "number" && isSupportedAnswerOutput(result, "L'n,w")) {
      companions.push({ label: "L'n,w", valueLabel: `${formatDecimal(impact.LPrimeNW)} dB` });
    }
    if (typeof impact.LPrimeNTw === "number" && isSupportedAnswerOutput(result, "L'nT,w")) {
      companions.push({ label: "L'nT,w", valueLabel: `${formatDecimal(impact.LPrimeNTw)} dB` });
    }
    if (typeof impact.LPrimeNT50 === "number" && isSupportedAnswerOutput(result, "L'nT,50")) {
      companions.push({ label: "L'nT,50", valueLabel: `${formatDecimal(impact.LPrimeNT50)} dB` });
    }
    if (typeof impact.DeltaLw === "number" && isSupportedAnswerOutput(result, "DeltaLw")) {
      companions.push({ label: "DeltaLw", valueLabel: `${formatDecimal(impact.DeltaLw)} dB` });
    }
    if (typeof impact.CI === "number" && isSupportedAnswerOutput(result, "CI")) {
      companions.push({ label: "CI", valueLabel: formatSignedDb(impact.CI) });
    }
    if (typeof impact.CI50_2500 === "number" && isSupportedAnswerOutput(result, "CI,50-2500")) {
      companions.push({ label: "CI,50-2500", valueLabel: formatSignedDb(impact.CI50_2500) });
    }

    const parsedTarget = parseTarget(targetLnwDb);

    return {
      companions,
      detail: primary.detail,
      direction: primary.direction,
      id: "impact",
      label: primary.label,
      max: primary.direction === "higher_better" ? 80 : 90,
      min: 20,
      target: primary.direction === "higher_better" ? null : parsedTarget,
      targetLabel:
        primary.direction === "higher_better"
          ? null
          : parsedTarget !== null
            ? `Brief maximum ${formatDecimal(parsedTarget)} dB`
            : null,
      value: primary.value,
      valueLabel: `${formatDecimal(primary.value)} dB`
    };
  }

  if (
    typeof lowerBoundImpact?.LnWUpperBound === "number" &&
    isSupportedAnswerOutput(result, "Ln,w")
  ) {
    const parsedTarget = parseTarget(targetLnwDb);
    const companions: ResultAnswerChartCompanion[] = [];

    if (typeof lowerBoundImpact.LPrimeNWUpperBound === "number" && isSupportedAnswerOutput(result, "L'n,w")) {
      companions.push({ label: "L'n,w upper bound", valueLabel: `<= ${formatDecimal(lowerBoundImpact.LPrimeNWUpperBound)} dB` });
    }
    if (typeof lowerBoundImpact.LPrimeNTwUpperBound === "number" && isSupportedAnswerOutput(result, "L'nT,w")) {
      companions.push({ label: "L'nT,w upper bound", valueLabel: `<= ${formatDecimal(lowerBoundImpact.LPrimeNTwUpperBound)} dB` });
    }
    if (typeof lowerBoundImpact.LPrimeNT50UpperBound === "number" && isSupportedAnswerOutput(result, "L'nT,50")) {
      companions.push({ label: "L'nT,50 upper bound", valueLabel: `<= ${formatDecimal(lowerBoundImpact.LPrimeNT50UpperBound)} dB` });
    }
    if (typeof lowerBoundImpact.LnWPlusCIUpperBound === "number" && isSupportedAnswerOutput(result, "Ln,w+CI")) {
      companions.push({ label: "Ln,w+CI upper bound", valueLabel: `<= ${formatDecimal(lowerBoundImpact.LnWPlusCIUpperBound)} dB` });
    }
    if (typeof lowerBoundImpact.CI === "number" && isSupportedAnswerOutput(result, "CI")) {
      companions.push({ label: "CI", valueLabel: formatSignedDb(lowerBoundImpact.CI) });
    }
    if (typeof lowerBoundImpact.CI50_2500 === "number" && isSupportedAnswerOutput(result, "CI,50-2500")) {
      companions.push({ label: "CI,50-2500", valueLabel: formatSignedDb(lowerBoundImpact.CI50_2500) });
    }
    if (typeof lowerBoundImpact.DeltaLwLowerBound === "number" && isSupportedAnswerOutput(result, "DeltaLw")) {
      companions.push({ label: "DeltaLw lower bound", valueLabel: `>= ${formatDecimal(lowerBoundImpact.DeltaLwLowerBound)} dB` });
    }

    return {
      companions,
      detail: "Only a conservative bound is currently available on the impact lane.",
      direction: "lower_better",
      id: "impact-bound",
      label: "Ln,w upper bound",
      max: 90,
      min: 20,
      target: parsedTarget,
      targetLabel: parsedTarget !== null ? `Brief maximum ${formatDecimal(parsedTarget)} dB` : null,
      value: lowerBoundImpact.LnWUpperBound,
      valueLabel: `<= ${formatDecimal(lowerBoundImpact.LnWUpperBound)} dB`
    };
  }

  if (typeof lowerBoundImpact?.LnWPlusCIUpperBound === "number") {
    const parsedTarget = parseTarget(targetLnwDb);
    const companions: ResultAnswerChartCompanion[] = [];

    if (typeof lowerBoundImpact.LPrimeNWUpperBound === "number" && isSupportedAnswerOutput(result, "L'n,w")) {
      companions.push({ label: "L'n,w upper bound", valueLabel: `<= ${formatDecimal(lowerBoundImpact.LPrimeNWUpperBound)} dB` });
    }
    if (typeof lowerBoundImpact.LPrimeNTwUpperBound === "number" && isSupportedAnswerOutput(result, "L'nT,w")) {
      companions.push({ label: "L'nT,w upper bound", valueLabel: `<= ${formatDecimal(lowerBoundImpact.LPrimeNTwUpperBound)} dB` });
    }
    if (typeof lowerBoundImpact.LPrimeNT50UpperBound === "number" && isSupportedAnswerOutput(result, "L'nT,50")) {
      companions.push({ label: "L'nT,50 upper bound", valueLabel: `<= ${formatDecimal(lowerBoundImpact.LPrimeNT50UpperBound)} dB` });
    }
    if (typeof lowerBoundImpact.CI === "number" && isSupportedAnswerOutput(result, "CI")) {
      companions.push({ label: "CI", valueLabel: formatSignedDb(lowerBoundImpact.CI) });
    }
    if (typeof lowerBoundImpact.CI50_2500 === "number" && isSupportedAnswerOutput(result, "CI,50-2500")) {
      companions.push({ label: "CI,50-2500", valueLabel: formatSignedDb(lowerBoundImpact.CI50_2500) });
    }
    if (typeof lowerBoundImpact.DeltaLwLowerBound === "number" && isSupportedAnswerOutput(result, "DeltaLw")) {
      companions.push({ label: "DeltaLw lower bound", valueLabel: `>= ${formatDecimal(lowerBoundImpact.DeltaLwLowerBound)} dB` });
    }

    return {
      companions,
      detail: "Only a conservative combined Ln,w+CI bound is currently available on the impact lane.",
      direction: "lower_better",
      id: "impact-bound",
      label: "Ln,w+CI upper bound",
      max: 90,
      min: 20,
      target: parsedTarget,
      targetLabel: parsedTarget !== null ? `Brief maximum ${formatDecimal(parsedTarget)} dB` : null,
      value: lowerBoundImpact.LnWPlusCIUpperBound,
      valueLabel: `<= ${formatDecimal(lowerBoundImpact.LnWPlusCIUpperBound)} dB`
    };
  }

  return null;
}

export function buildResultAnswerChartLanes(input: {
  result: AssemblyCalculation | null;
  targetLnwDb?: string | null;
  targetRwDb?: string | null;
}): ResultAnswerChartLane[] {
  if (!input.result) {
    return [];
  }

  return [buildAirborneLane(input.result, input.targetRwDb), buildImpactLane(input.result, input.targetLnwDb)].filter(
    (lane): lane is ResultAnswerChartLane => Boolean(lane)
  );
}
