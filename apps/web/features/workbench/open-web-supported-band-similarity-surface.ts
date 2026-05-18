import type {
  AssemblyCalculation,
  ImpactCalculation,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS =
  "predictor_lightweight_steel_open_web_supported_band_similarity_estimate";

export const OPEN_WEB_SUPPORTED_BAND_SIMILARITY_LABEL =
  "Open-web steel supported-band similarity";

const SURFACE_OUTPUTS = new Set<RequestedOutputId>(["Rw", "Ln,w", "CI", "Ln,w+CI"]);

function basisMatches(impact: ImpactCalculation | null | undefined): boolean {
  if (!impact) {
    return false;
  }

  return (
    impact.basis === OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS ||
    Object.values(impact.metricBasis ?? {}).includes(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS)
  );
}

export function isOpenWebSupportedBandSimilarityImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return basisMatches(impact);
}

export function isOpenWebSupportedBandSimilarityResult(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return Boolean(
    result &&
      isOpenWebSupportedBandSimilarityImpact(result) &&
      result.floorSystemRatings?.basis === OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
  );
}

export function getOpenWebSupportedBandSimilarityOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  if (!SURFACE_OUTPUTS.has(output) || !isOpenWebSupportedBandSimilarityResult(result)) {
    return null;
  }

  const fit = result.dynamicImpactTrace?.fitPercent;
  const fitText = typeof fit === "number" ? ` at ${fit.toFixed(1)}% fit` : "";
  const basisText =
    "Open-web steel supported-band similarity is active inside the UBIQ FL-24/FL-26 elastic suspended-ceiling source grid";
  const boundaryText =
    "Exact source rows still win; FL-28 interpolation, carpet/bound-only support, field, building, ASTM, and IIC outputs stay outside this lab lane.";

  switch (output) {
    case "Rw":
      return `${basisText}${fitText}. Companion floor-lane Rw is carried from the same source-absent supported-band estimate, not from the generic airborne screening curve. ${boundaryText}`;
    case "Ln,w":
      return `${basisText}${fitText}. Lab Ln,w comes from same-source supported-band anchor interpolation rather than the broad steel-family blend. ${boundaryText}`;
    case "CI":
      return `${basisText}${fitText}. CI is the low-frequency companion term from the same supported-band anchor lane. ${boundaryText}`;
    case "Ln,w+CI":
      return `${basisText}${fitText}. Ln,w+CI is computed on the same supported-band anchor lane as Ln,w and CI. ${boundaryText}`;
    default:
      return null;
  }
}

export function getOpenWebSupportedBandSimilarityPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Open-web steel supported-band similarity is a source-absent lab family estimate pinned to six same-source UBIQ FL-24/FL-26 supported-band anchors. Keep exact-source precedence and non-lab boundaries visible.",
    label: "Open-web supported-band similarity",
    tone: "accent"
  };
}
