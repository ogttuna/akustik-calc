import type { ExactImpactSource, ImpactCalculation, RequestedOutputId } from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import {
  computeImpactSpectrumAdaptationTerms,
  computeImpactWeightedRating
} from "./impact-iso717";
import { ksRound1 } from "./math";

function buildAvailableOutputs(input: {
  ci: number;
  ci50_2500: number;
  labOrField: ExactImpactSource["labOrField"];
  weightedValue: number;
}): RequestedOutputId[] {
  const outputs: RequestedOutputId[] =
    input.labOrField === "field"
      ? ["L'nT,w"]
      : ["Ln,w"];

  if (Number.isFinite(input.ci)) {
    outputs.push("CI");
  }

  if (Number.isFinite(input.ci50_2500)) {
    outputs.push("CI,50-2500");
  }

  if (input.labOrField === "lab" && Number.isFinite(input.ci)) {
    outputs.push("Ln,w+CI");
  }

  if (input.labOrField === "field" && Number.isFinite(input.ci50_2500) && Number.isFinite(input.weightedValue)) {
    outputs.push("L'nT,50");
  }

  return outputs;
}

export function buildExactImpactFromSource(source: ExactImpactSource): ImpactCalculation | null {
  const weighted = computeImpactWeightedRating(source.frequenciesHz, source.levelsDb);
  if (!Number.isFinite(weighted.value)) {
    return null;
  }

  const adaptation = computeImpactSpectrumAdaptationTerms(source.frequenciesHz, source.levelsDb, weighted.value);
  const weightedValue = ksRound1(weighted.value);
  const confidence = getImpactConfidenceForBasis("exact_source_band_curve_iso7172");
  const availableOutputs = buildAvailableOutputs({
    ci: adaptation.ci,
    ci50_2500: adaptation.ci50_2500,
    labOrField: source.labOrField,
    weightedValue
  });
  const ci = Number.isFinite(adaptation.ci) ? ksRound1(adaptation.ci) : undefined;
  const ci50_2500 = Number.isFinite(adaptation.ci50_2500) ? ksRound1(adaptation.ci50_2500) : undefined;
  const isField = source.labOrField === "field";
  const lPrimeNT50 = isField && typeof ci50_2500 === "number" ? ksRound1(weightedValue + ci50_2500) : undefined;
  const lnWPlusCI = !isField && typeof ci === "number" ? ksRound1(weightedValue + ci) : undefined;
  const metricBasis = buildUniformImpactMetricBasis(
    {
      CI: ci,
      CI50_2500: ci50_2500,
      LPrimeNT50: lPrimeNT50,
      LPrimeNTw: isField ? weightedValue : undefined,
      LnW: isField ? undefined : weightedValue,
      LnWPlusCI: lnWPlusCI
    },
    "exact_source_band_curve_iso7172"
  );

  return {
    CI: ci,
    CI50_2500: ci50_2500,
    LPrimeNT50: lPrimeNT50,
    LPrimeNTw: isField ? weightedValue : undefined,
    LnW: isField ? undefined : weightedValue,
    LnWPlusCI: lnWPlusCI,
    availableOutputs,
    bandSet: weighted.bandSet,
    basis: "exact_source_band_curve_iso7172",
    ci50_2500BandSet: typeof ci50_2500 === "number" ? adaptation.ci50_2500BandSet : undefined,
    ciBandSet: typeof ci === "number" ? adaptation.ciBandSet : undefined,
    confidence,
    labOrField: source.labOrField,
    metricBasis,
    notes: [
      `${isField ? "Field" : "Lab"} impact bands matched an ISO 717-2 nominal band grid and were rated without reusing the airborne TL curve.`,
      `Weighted impact rating used the ${weighted.bandSet || "supported"} comparison contour and returned ${weightedValue} dB.`,
      ...(typeof ci === "number"
        ? [`CI was derived energetically from the ${adaptation.ciBandSet} band set.`]
        : ["CI stayed unavailable because the supplied impact source did not contain a complete supported CI band set."]),
      ...(typeof ci50_2500 === "number"
        ? [`CI,50-2500 was derived from the ${adaptation.ci50_2500BandSet} band set.`]
        : isField
          ? ["CI,50-2500 stayed unavailable because the supplied field source did not include the full 50..2500 Hz one-third-octave set."]
          : ["CI,50-2500 stayed unavailable because the supplied lab source did not include the full 50..2500 Hz one-third-octave set."])
    ],
    scope: "exact_band_curve",
    standardMethod: source.standardMethod
  };
}
