import type {
  FloorSystemAirborneCompanionSemantic,
  FloorSystemAirborneRatings
} from "./floor-system";

export function getFloorSystemCompanionSemantic(
  ratings: FloorSystemAirborneRatings
): FloorSystemAirborneCompanionSemantic {
  return ratings.RwCtrSemantic ?? "rw_plus_ctr";
}

export function getFloorSystemCompanionLabel(ratings: FloorSystemAirborneRatings): "Ctr" | "Rw + Ctr" {
  return getFloorSystemCompanionSemantic(ratings) === "ctr_term" ? "Ctr" : "Rw + Ctr";
}

export function getFloorSystemDerivedRwPlusCtr(ratings: FloorSystemAirborneRatings): number | undefined {
  if (typeof ratings.RwCtr !== "number") {
    return undefined;
  }

  return getFloorSystemCompanionSemantic(ratings) === "ctr_term" ? ratings.Rw + ratings.RwCtr : ratings.RwCtr;
}
