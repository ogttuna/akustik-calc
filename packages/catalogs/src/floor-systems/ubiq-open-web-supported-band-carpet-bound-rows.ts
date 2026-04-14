import type { BoundFloorSystem } from "@dynecho/shared";

type UbiqSupportedBandCarpetBoundRatings = {
  inexFloorMm: 16 | 19;
  joistMm: 200 | 300 | 400;
  rw: number;
  rwPlusCtr: number;
};

type UbiqSupportedBandCarpetBoundFamily = {
  boardLayerCount: 2 | 3;
  boardThicknessMm: 13 | 16;
  familyId: "fl24" | "fl26" | "fl28";
  label: "FL-24" | "FL-26" | "FL-28";
  rows: readonly UbiqSupportedBandCarpetBoundRatings[];
};

const CARPET_LNW_PLUS_CI_UPPER_BOUND = 45;

const SUPPORTED_BAND_CARPET_BOUND_FAMILIES: readonly UbiqSupportedBandCarpetBoundFamily[] = [
  {
    familyId: "fl24",
    label: "FL-24",
    boardLayerCount: 2,
    boardThicknessMm: 13,
    rows: [
      { joistMm: 200, inexFloorMm: 16, rw: 59, rwPlusCtr: 52 },
      { joistMm: 200, inexFloorMm: 19, rw: 60, rwPlusCtr: 53 },
      { joistMm: 300, inexFloorMm: 16, rw: 60, rwPlusCtr: 54 },
      { joistMm: 300, inexFloorMm: 19, rw: 61, rwPlusCtr: 55 },
      { joistMm: 400, inexFloorMm: 16, rw: 60, rwPlusCtr: 54 },
      { joistMm: 400, inexFloorMm: 19, rw: 61, rwPlusCtr: 55 }
    ]
  },
  {
    familyId: "fl26",
    label: "FL-26",
    boardLayerCount: 2,
    boardThicknessMm: 16,
    rows: [
      { joistMm: 200, inexFloorMm: 16, rw: 60, rwPlusCtr: 53 },
      { joistMm: 200, inexFloorMm: 19, rw: 61, rwPlusCtr: 55 },
      { joistMm: 300, inexFloorMm: 16, rw: 61, rwPlusCtr: 55 },
      { joistMm: 300, inexFloorMm: 19, rw: 62, rwPlusCtr: 57 },
      { joistMm: 400, inexFloorMm: 16, rw: 61, rwPlusCtr: 55 },
      { joistMm: 400, inexFloorMm: 19, rw: 62, rwPlusCtr: 57 }
    ]
  },
  {
    familyId: "fl28",
    label: "FL-28",
    boardLayerCount: 3,
    boardThicknessMm: 16,
    rows: [
      { joistMm: 200, inexFloorMm: 16, rw: 62, rwPlusCtr: 55 },
      { joistMm: 200, inexFloorMm: 19, rw: 63, rwPlusCtr: 57 },
      { joistMm: 300, inexFloorMm: 16, rw: 63, rwPlusCtr: 57 },
      { joistMm: 300, inexFloorMm: 19, rw: 64, rwPlusCtr: 59 },
      { joistMm: 400, inexFloorMm: 16, rw: 63, rwPlusCtr: 57 },
      { joistMm: 400, inexFloorMm: 19, rw: 64, rwPlusCtr: 59 }
    ]
  }
];

function formatDeck(row: UbiqSupportedBandCarpetBoundRatings): string {
  return `${row.inexFloorMm} mm INEX FLOOR`;
}

function buildSupportedBandCarpetBoundRow(
  family: UbiqSupportedBandCarpetBoundFamily,
  row: UbiqSupportedBandCarpetBoundRatings
): BoundFloorSystem {
  return {
    id: `ubiq_${family.familyId}_open_web_steel_${row.joistMm}_${row.inexFloorMm}mm_carpet_lnw_plus_ci_bound_lab_2026`,
    label: `UBIQ ${family.label} | ${row.joistMm} mm open-web steel | ${formatDeck(row)} | carpet + foam underlay | ${family.boardLayerCount} x ${family.boardThicknessMm} mm resilient ceiling | Ln,w+CI <=45`,
    sourceLabel: "UBIQ official system table PDF",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["resilient_layer", "upper_fill"],
      baseStructure: {
        materialIds: ["open_web_steel_floor"],
        thicknessMm: row.joistMm
      },
      floatingScreed: {
        materialIds: ["inex_floor_panel"],
        thicknessMm: row.inexFloorMm
      },
      floorCovering: {
        materialIds: ["carpet_with_foam_underlay"]
      },
      ceilingCavity: {
        materialIds: ["ubiq_resilient_ceiling"],
        thicknessMm: 65
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 145
      },
      ceilingBoard: {
        layerCount: family.boardLayerCount,
        materialIds: ["firestop_board"],
        thicknessMm: family.boardThicknessMm
      }
    },
    systemSummary: {
      carrier: `${row.joistMm} mm open-web steel joist at 450 mm centres`,
      floorBuildUp: `${formatDeck(row)} with quality carpet and minimum 8 mm foam underlay`,
      ceiling: `65 mm resilient ceiling zone with 145 mm insulation and ${family.boardLayerCount} x ${family.boardThicknessMm} mm fire-rated plasterboard`
    },
    impactBounds: {
      LnWPlusCIUpperBound: CARPET_LNW_PLUS_CI_UPPER_BOUND
    },
    airborneRatings: {
      Rw: row.rw,
      RwCtr: row.rwPlusCtr,
      RwCtrSemantic: "rw_plus_ctr"
    }
  };
}

export const UBIQ_OPEN_WEB_SUPPORTED_BAND_CARPET_BOUND_ROWS: readonly BoundFloorSystem[] =
  SUPPORTED_BAND_CARPET_BOUND_FAMILIES.flatMap((family) =>
    family.rows.map((row) => buildSupportedBandCarpetBoundRow(family, row))
  );
