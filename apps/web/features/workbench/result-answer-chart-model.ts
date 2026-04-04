import type { AssemblyCalculation } from "@dynecho/shared";

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

function buildAirborneLane(
  result: AssemblyCalculation,
  targetRwDb: string | null | undefined
): ResultAnswerChartLane | null {
  const value =
    result.airborneOverlay?.contextMode === "building_prediction" && typeof result.metrics.estimatedDnTwDb === "number"
      ? result.metrics.estimatedDnTwDb
      : typeof result.metrics.estimatedRwPrimeDb === "number" && result.ratings.iso717.descriptor === "R'w"
        ? result.metrics.estimatedRwPrimeDb
        : result.metrics.estimatedRwDb;

  if (!(typeof value === "number" && Number.isFinite(value))) {
    return null;
  }

  const label =
    result.airborneOverlay?.contextMode === "building_prediction" && typeof result.metrics.estimatedDnTwDb === "number"
      ? "DnT,w estimate"
      : result.ratings.iso717.descriptor === "R'w"
        ? "R'w estimate"
        : "Rw estimate";
  const companions: ResultAnswerChartCompanion[] = [
    { label: "STC", valueLabel: `${formatDecimal(result.metrics.estimatedStc)} dB` },
    { label: "C / Ctr", valueLabel: `${formatSignedDb(result.metrics.estimatedCDb)} / ${formatSignedDb(result.metrics.estimatedCtrDb)}` }
  ];

  if (typeof result.metrics.estimatedDnTADb === "number") {
    companions.push({ label: "DnT,A", valueLabel: `${formatDecimal(result.metrics.estimatedDnTADb)} dB` });
  }

  return {
    companions,
    detail: "Primary airborne answer from the currently active screening or field-side lane.",
    direction: "higher_better",
    id: "airborne",
    label,
    max: 85,
    min: 20,
    target: parseTarget(targetRwDb),
    targetLabel: parseTarget(targetRwDb) !== null ? `Brief minimum ${formatDecimal(parseTarget(targetRwDb)!)} dB` : null,
    value,
    valueLabel: `${formatDecimal(value)} dB`
  };
}

function buildImpactLane(
  result: AssemblyCalculation,
  targetLnwDb: string | null | undefined
): ResultAnswerChartLane | null {
  const impact = result.impact;
  const lowerBoundImpact = result.lowerBoundImpact;

  if (impact) {
    const primary =
      impact.labOrField === "field" && typeof impact.LPrimeNTw === "number"
        ? { detail: "Primary standardized field-side impact answer.", label: "L'nT,w", value: impact.LPrimeNTw }
        : typeof impact.LnW === "number"
          ? { detail: "Primary lab-side weighted impact answer.", label: "Ln,w", value: impact.LnW }
          : typeof impact.LPrimeNW === "number"
            ? { detail: "Primary direct field carry-over impact answer.", label: "L'n,w", value: impact.LPrimeNW }
            : typeof impact.LnTA === "number"
              ? { detail: "Primary Dutch exact impact answer from field octave bands.", label: "LnT,A", value: impact.LnTA }
              : null;

    if (!primary) {
      return null;
    }

    const companions: ResultAnswerChartCompanion[] = [];

    if (typeof impact.LnWPlusCI === "number") {
      companions.push({ label: "Ln,w+CI", valueLabel: `${formatDecimal(impact.LnWPlusCI)} dB` });
    }
    if (typeof impact.LPrimeNT50 === "number") {
      companions.push({ label: "L'nT,50", valueLabel: `${formatDecimal(impact.LPrimeNT50)} dB` });
    }
    if (typeof impact.DeltaLw === "number") {
      companions.push({ label: "DeltaLw", valueLabel: `${formatDecimal(impact.DeltaLw)} dB` });
    }
    if (typeof impact.CI === "number") {
      companions.push({ label: "CI", valueLabel: formatSignedDb(impact.CI) });
    }
    if (typeof impact.CI50_2500 === "number") {
      companions.push({ label: "CI,50-2500", valueLabel: formatSignedDb(impact.CI50_2500) });
    }

    const parsedTarget = parseTarget(targetLnwDb);

    return {
      companions,
      detail: primary.detail,
      direction: "lower_better",
      id: "impact",
      label: primary.label,
      max: 90,
      min: 20,
      target: parsedTarget,
      targetLabel: parsedTarget !== null ? `Brief maximum ${formatDecimal(parsedTarget)} dB` : null,
      value: primary.value,
      valueLabel: `${formatDecimal(primary.value)} dB`
    };
  }

  if (typeof lowerBoundImpact?.LnWUpperBound === "number") {
    const parsedTarget = parseTarget(targetLnwDb);

    return {
      companions:
        typeof lowerBoundImpact.DeltaLwLowerBound === "number"
          ? [{ label: "DeltaLw lower bound", valueLabel: `>= ${formatDecimal(lowerBoundImpact.DeltaLwLowerBound)} dB` }]
          : [],
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
