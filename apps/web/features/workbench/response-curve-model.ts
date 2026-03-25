import type { AssemblyCalculation, ImpactTraceSeries } from "@dynecho/shared";

export type WorkbenchResponseCurveDirection = "higher_better" | "lower_better";

export type WorkbenchResponseCurveSeries = {
  active: boolean;
  id: string;
  label: string;
  frequenciesHz: readonly number[];
  valuesDb: readonly number[];
};

export type WorkbenchResponseCurveFigure = {
  activeSeriesId?: string;
  direction: WorkbenchResponseCurveDirection;
  domainLabel: string;
  id: "airborne" | "impact";
  note: string;
  series: readonly WorkbenchResponseCurveSeries[];
  title: string;
};

function buildDomainLabel(series: readonly WorkbenchResponseCurveSeries[]): string {
  const frequencies = Array.from(new Set(series.flatMap((entry) => entry.frequenciesHz))).sort((left, right) => left - right);

  if (frequencies.length === 0) {
    return "";
  }

  const first = frequencies[0];
  const last = frequencies[frequencies.length - 1];
  return `${first}..${last} Hz`;
}

function buildAirborneFigure(result: AssemblyCalculation): WorkbenchResponseCurveFigure | null {
  if (result.curve.frequenciesHz.length === 0 || result.curve.frequenciesHz.length !== result.curve.transmissionLossDb.length) {
    return null;
  }

  const series: WorkbenchResponseCurveSeries[] = [
    {
      active: true,
      frequenciesHz: [...result.curve.frequenciesHz],
      id: "airborne",
      label:
        result.airborneOverlay?.contextMode === "field_prediction" || result.airborneOverlay?.contextMode === "building_prediction"
          ? "Final apparent airborne curve"
          : "Active transmission-loss curve",
      valuesDb: [...result.curve.transmissionLossDb]
    }
  ];

  return {
    activeSeriesId: "airborne",
    direction: "higher_better",
    domainLabel: buildDomainLabel(series),
    id: "airborne",
    note:
      result.airborneOverlay?.contextMode === "field_prediction" || result.airborneOverlay?.contextMode === "building_prediction"
        ? "Higher dB is better. This is the final apparent airborne curve after the active leakage and field overlays."
        : "Higher dB is better. This is the active airborne transmission-loss curve behind the current weighted answer.",
    series,
    title: "Airborne response curve"
  };
}

function buildImpactFigure(result: AssemblyCalculation): WorkbenchResponseCurveFigure | null {
  const trace = result.impact?.trace;

  if (!trace || trace.series.length === 0) {
    return null;
  }

  const series = trace.series
    .filter(
      (entry: ImpactTraceSeries) =>
        entry.curve.frequenciesHz.length > 0 && entry.curve.frequenciesHz.length === entry.curve.levelsDb.length
    )
    .map((entry: ImpactTraceSeries) => ({
      active: entry.id === trace.activeSeriesId,
      frequenciesHz: [...entry.curve.frequenciesHz],
      id: entry.id,
      label: entry.label,
      valuesDb: [...entry.curve.levelsDb]
    }));

  if (series.length === 0) {
    return null;
  }

  const activeLabel = series.find((entry: WorkbenchResponseCurveSeries) => entry.id === trace.activeSeriesId)?.label;

  return {
    activeSeriesId: trace.activeSeriesId,
    direction: "lower_better",
    domainLabel: buildDomainLabel(series),
    id: "impact",
    note: activeLabel
      ? `Lower dB is better. ${activeLabel} is the active impact curve on this lane; source and continuation curves stay overlaid for comparison.`
      : "Lower dB is better. Exact source and continuation curves are overlaid whenever the active lane exposes real impact bands.",
    series,
    title: "Impact response curve"
  };
}

export function buildWorkbenchResponseCurveFigures(result: AssemblyCalculation | null): WorkbenchResponseCurveFigure[] {
  if (!result) {
    return [];
  }

  return [buildAirborneFigure(result), buildImpactFigure(result)].filter(
    (figure): figure is WorkbenchResponseCurveFigure => Boolean(figure)
  );
}
