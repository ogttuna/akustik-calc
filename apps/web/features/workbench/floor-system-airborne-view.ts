"use client";

import type { FloorSystemAirborneRatings } from "@dynecho/shared";
import {
  getFloorSystemCompanionLabel,
  getFloorSystemDerivedRwPlusCtr
} from "@dynecho/shared";

import { formatDecimal } from "@/lib/format";

type CompanionPresentation = {
  detail: string;
  derivedRwPlusCtrText?: string;
  label: string;
  pillText: string;
  valueText: string;
};

export function getFloorSystemCompanionPresentation(
  ratings: FloorSystemAirborneRatings,
  context: "exact" | "estimate" | "library"
): CompanionPresentation {
  const label = getFloorSystemCompanionLabel(ratings);
  const contextLabel =
    context === "exact"
      ? "matched family"
      : context === "estimate"
        ? "supporting family rows"
        : "published family row";

  if (typeof ratings.RwCtr !== "number") {
    return {
      detail:
        label === "Ctr"
          ? `This ${contextLabel} does not expose a published Ctr companion.`
          : `This ${contextLabel} does not publish a companion Rw + Ctr figure.`,
      label,
      pillText: `${label} N/A`,
      valueText: "N/A"
    };
  }

  if (label === "Ctr") {
    const derivedRwPlusCtr = getFloorSystemDerivedRwPlusCtr(ratings);

    return {
      detail:
        context === "estimate"
          ? "Estimated Ctr from nearby published Rw(C;Ctr) rows."
          : "Published Ctr adaptation term from the family’s Rw(C;Ctr) notation.",
      derivedRwPlusCtrText:
        typeof derivedRwPlusCtr === "number" ? `${formatDecimal(derivedRwPlusCtr)} dB derived Rw + Ctr` : undefined,
      label,
      pillText: `${formatDecimal(ratings.RwCtr)} dB Ctr`,
      valueText: `${formatDecimal(ratings.RwCtr)} dB`
    };
  }

  return {
    detail:
      context === "estimate"
        ? "Weighted companion airborne estimate from the same family rows."
        : "Published companion traffic-noise figure from the family.",
    label,
    pillText: `${formatDecimal(ratings.RwCtr)} dB Rw + Ctr`,
    valueText: `${formatDecimal(ratings.RwCtr)} dB`
  };
}
