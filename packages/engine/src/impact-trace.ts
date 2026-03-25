import type {
  ExactImpactSource,
  ImpactBandCurve,
  ImpactCalculation,
  ImpactTrace,
  ImpactTraceSeries,
  ImpactTraceSeriesId
} from "@dynecho/shared";

function cloneCurve(curve: ImpactBandCurve): ImpactBandCurve {
  return {
    frequenciesHz: [...curve.frequenciesHz],
    levelsDb: [...curve.levelsDb]
  };
}

function buildSeries(input: {
  curve: ImpactBandCurve;
  id: ImpactTraceSeriesId;
  label: string;
}): ImpactTraceSeries {
  return {
    curve: cloneCurve(input.curve),
    id: input.id,
    label: input.label
  };
}

export function cloneImpactTrace(trace: ImpactTrace): ImpactTrace {
  return {
    activeSeriesId: trace.activeSeriesId,
    series: trace.series.map((series) =>
      buildSeries({
        curve: series.curve,
        id: series.id,
        label: series.label
      })
    )
  };
}

export function buildImpactTraceFromExactSource(source: ExactImpactSource): ImpactTrace {
  return {
    activeSeriesId: "source",
    series: [
      buildSeries({
        curve: {
          frequenciesHz: source.frequenciesHz,
          levelsDb: source.levelsDb
        },
        id: "source",
        label: source.labOrField === "field" ? "Exact field band curve" : "Exact lab band curve"
      })
    ]
  };
}

export function buildImpactTraceFromDerivedCurves(input: {
  exactImpactSource: ExactImpactSource;
  fieldCurveDb: readonly number[];
  standardizedCurveDb?: readonly number[] | null;
}): ImpactTrace {
  const series: ImpactTraceSeries[] = [
    buildSeries({
      curve: {
        frequenciesHz: input.exactImpactSource.frequenciesHz,
        levelsDb: input.exactImpactSource.levelsDb
      },
      id: "source",
      label: input.exactImpactSource.labOrField === "field" ? "Exact field band curve" : "Exact lab band curve"
    }),
    buildSeries({
      curve: {
        frequenciesHz: input.exactImpactSource.frequenciesHz,
        levelsDb: [...input.fieldCurveDb]
      },
      id: "field",
      label: "Derived field continuation"
    })
  ];

  if (input.standardizedCurveDb) {
    series.push(
      buildSeries({
        curve: {
          frequenciesHz: input.exactImpactSource.frequenciesHz,
          levelsDb: [...input.standardizedCurveDb]
        },
        id: "standardized",
        label: "Standardized field continuation"
      })
    );
  }

  return {
    activeSeriesId: input.standardizedCurveDb ? "standardized" : "field",
    series
  };
}

export function attachImpactTraceFromExactSource(
  impact: ImpactCalculation | null,
  exactImpactSource: ExactImpactSource | null | undefined
): ImpactCalculation | null {
  if (!impact || !exactImpactSource || impact.trace) {
    return impact;
  }

  return {
    ...impact,
    trace: buildImpactTraceFromExactSource(exactImpactSource)
  };
}
