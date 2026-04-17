import type { FloorSystemEstimateResult } from "@dynecho/shared";

function isFiniteNumber(value: number | null | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

// The current reinforced-concrete low-confidence lane is still a mixed nearby-row
// fallback. Keep its airborne companions explicit, but label them as proxy values
// instead of letting downstream surfaces read them like a narrow same-stack fit.
export function hasReinforcedConcreteLowConfidenceProxyAirborne(
  floorSystemEstimate: FloorSystemEstimateResult | null | undefined
): boolean {
  return Boolean(
    floorSystemEstimate?.kind === "low_confidence" &&
      floorSystemEstimate.structuralFamily === "reinforced concrete" &&
      (
        isFiniteNumber(floorSystemEstimate.airborneRatings?.Rw) ||
        isFiniteNumber(floorSystemEstimate.airborneRatings?.RwCtr)
      )
  );
}

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_PROXY_AIRBORNE_SUPPORT_NOTE =
  "Reinforced-concrete low-confidence fallback is carrying proxy airborne companions from mixed nearby concrete rows instead of a narrow same-stack family fit.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_NEARBY_ROW_RANKING_SUPPORT_NOTE =
  "Nearby-row ranking stays elastic-ceiling first, rigid-ceiling second, with timber-underlay held as a farther fallback when cavity and board geometry drift.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_PROXY_AIRBORNE_STATUS_NOTE =
  "Current airborne companions stay explicit as proxy values from the same mixed-row reinforced-concrete fallback.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_PROXY_AIRBORNE_WARNING =
  "Low-confidence reinforced-concrete fallback is active with proxy airborne companions. Ln,w stays on the mixed nearby-row fallback, while airborne companions remain proxy values instead of a narrow same-stack family claim.";
