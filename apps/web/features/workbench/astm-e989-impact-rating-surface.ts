import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

export const WEB_ASTM_E989_IMPACT_RATING_BASIS =
  "astm_e989_impact_rating_metric_schema_adapter_bridge";
export const WEB_ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID =
  "floor.astm_e989_impact_rating.contour_runtime";

export function isAstmE989ImpactRatingResult(
  result: AssemblyCalculation | null | undefined
): boolean {
  return Boolean(
    result?.impact?.basis === WEB_ASTM_E989_IMPACT_RATING_BASIS &&
      result.layerCombinationResolverTrace?.selectedCandidateId ===
        WEB_ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
  );
}

export function getAstmE989ImpactRatingOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  if ((output !== "IIC" && output !== "AIIC") || !isAstmE989ImpactRatingResult(result)) {
    return null;
  }

  const source =
    result?.impact?.labOrField === "field"
      ? "ASTM E1007 field"
      : "ASTM E492 lab";

  return `${output} was calculated from the exact ${source} one-third-octave impact bands through the ASTM E989 contour bridge. ISO Ln,w and airborne outputs are not reused for this rating.`;
}

export function getAstmE989ImpactRatingPostureDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  return getAstmE989ImpactRatingOutputDetail(output, result);
}
