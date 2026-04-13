import type {
  FloorSystemAirborneCompanionSemantic,
  FloorSystemAirborneRatings
} from "./floor-system";

export function getFloorSystemCompanionSemantic(
  ratings: FloorSystemAirborneRatings
): FloorSystemAirborneCompanionSemantic {
  return ratings.RwCtrSemantic ?? "rw_plus_ctr";
}

export function getFloorSystemCompanionLabel(ratings: FloorSystemAirborneRatings): "Ctr" | "Rw + C" | "Rw + Ctr" {
  switch (getFloorSystemCompanionSemantic(ratings)) {
    case "ctr_term":
      return "Ctr";
    case "rw_plus_c":
      return "Rw + C";
    case "rw_plus_ctr":
      return "Rw + Ctr";
  }
}

export function getFloorSystemC(ratings: FloorSystemAirborneRatings): number | undefined {
  if (typeof ratings.RwCtr !== "number" || getFloorSystemCompanionSemantic(ratings) !== "rw_plus_c") {
    return undefined;
  }

  return ratings.RwCtr - ratings.Rw;
}

export function getFloorSystemCtr(ratings: FloorSystemAirborneRatings): number | undefined {
  if (typeof ratings.RwCtr !== "number") {
    return undefined;
  }

  switch (getFloorSystemCompanionSemantic(ratings)) {
    case "ctr_term":
      return ratings.RwCtr;
    case "rw_plus_ctr":
      return ratings.RwCtr - ratings.Rw;
    case "rw_plus_c":
      return undefined;
  }
}

export function getFloorSystemDerivedRwPlusC(ratings: FloorSystemAirborneRatings): number | undefined {
  if (typeof ratings.RwCtr !== "number" || getFloorSystemCompanionSemantic(ratings) !== "rw_plus_c") {
    return undefined;
  }

  return ratings.RwCtr;
}

export function getFloorSystemDerivedRwPlusCtr(ratings: FloorSystemAirborneRatings): number | undefined {
  if (typeof ratings.RwCtr !== "number") {
    return undefined;
  }

  switch (getFloorSystemCompanionSemantic(ratings)) {
    case "ctr_term":
      return ratings.Rw + ratings.RwCtr;
    case "rw_plus_ctr":
      return ratings.RwCtr;
    case "rw_plus_c":
      return undefined;
  }
}
