import type { ExactFloorSystem } from "@dynecho/shared";

type UbiqWeakBandRatings = {
  bareLnW: number;
  bareLnWPlusCI: number;
  carpetLnW: number;
  carpetLnWPlusCI: number;
  inexFloorMm: 16 | 19;
  joistMm: 200 | 300 | 400;
  rw: number;
  rwPlusCtr: number;
  timberLnW: number;
  timberLnWPlusCI: number;
};

type UbiqWeakBandFamily = {
  boardLayerCount: 2 | 3;
  boardThicknessMm: 13 | 16;
  familyId: "fl23" | "fl25" | "fl27";
  label: "FL-23" | "FL-25" | "FL-27";
  rows: readonly UbiqWeakBandRatings[];
};

type UbiqWeakBandFinish = {
  floorCoveringMaterialId?: "carpet_with_foam_underlay" | "engineered_timber_with_acoustic_underlay";
  floorCoveringSummary: string;
  id: "bare" | "carpet_underlay" | "timber_underlay";
  label: string;
  lnWKey: "bareLnW" | "carpetLnW" | "timberLnW";
  lnWPlusCIKey: "bareLnWPlusCI" | "carpetLnWPlusCI" | "timberLnWPlusCI";
};

const WEAK_BAND_FAMILIES: readonly UbiqWeakBandFamily[] = [
  {
    familyId: "fl23",
    label: "FL-23",
    boardLayerCount: 2,
    boardThicknessMm: 13,
    rows: [
      { joistMm: 200, inexFloorMm: 16, rw: 50, rwPlusCtr: 42, bareLnW: 77, bareLnWPlusCI: 77, timberLnW: 71, timberLnWPlusCI: 71, carpetLnW: 64, carpetLnWPlusCI: 64 },
      { joistMm: 200, inexFloorMm: 19, rw: 51, rwPlusCtr: 43, bareLnW: 77, bareLnWPlusCI: 77, timberLnW: 71, timberLnWPlusCI: 71, carpetLnW: 64, carpetLnWPlusCI: 64 },
      { joistMm: 300, inexFloorMm: 16, rw: 50, rwPlusCtr: 43, bareLnW: 77, bareLnWPlusCI: 76, timberLnW: 71, timberLnWPlusCI: 70, carpetLnW: 64, carpetLnWPlusCI: 63 },
      { joistMm: 300, inexFloorMm: 19, rw: 51, rwPlusCtr: 44, bareLnW: 77, bareLnWPlusCI: 76, timberLnW: 71, timberLnWPlusCI: 70, carpetLnW: 64, carpetLnWPlusCI: 63 },
      { joistMm: 400, inexFloorMm: 16, rw: 51, rwPlusCtr: 44, bareLnW: 77, bareLnWPlusCI: 76, timberLnW: 71, timberLnWPlusCI: 70, carpetLnW: 64, carpetLnWPlusCI: 63 },
      { joistMm: 400, inexFloorMm: 19, rw: 52, rwPlusCtr: 45, bareLnW: 77, bareLnWPlusCI: 76, timberLnW: 71, timberLnWPlusCI: 70, carpetLnW: 64, carpetLnWPlusCI: 63 }
    ]
  },
  {
    familyId: "fl25",
    label: "FL-25",
    boardLayerCount: 2,
    boardThicknessMm: 16,
    rows: [
      { joistMm: 200, inexFloorMm: 16, rw: 51, rwPlusCtr: 43, bareLnW: 77, bareLnWPlusCI: 77, timberLnW: 71, timberLnWPlusCI: 71, carpetLnW: 64, carpetLnWPlusCI: 64 },
      { joistMm: 200, inexFloorMm: 19, rw: 52, rwPlusCtr: 44, bareLnW: 77, bareLnWPlusCI: 77, timberLnW: 71, timberLnWPlusCI: 71, carpetLnW: 64, carpetLnWPlusCI: 64 },
      { joistMm: 300, inexFloorMm: 16, rw: 51, rwPlusCtr: 44, bareLnW: 77, bareLnWPlusCI: 76, timberLnW: 71, timberLnWPlusCI: 70, carpetLnW: 64, carpetLnWPlusCI: 63 },
      { joistMm: 300, inexFloorMm: 19, rw: 52, rwPlusCtr: 45, bareLnW: 77, bareLnWPlusCI: 76, timberLnW: 71, timberLnWPlusCI: 70, carpetLnW: 64, carpetLnWPlusCI: 63 },
      { joistMm: 400, inexFloorMm: 16, rw: 52, rwPlusCtr: 45, bareLnW: 77, bareLnWPlusCI: 76, timberLnW: 71, timberLnWPlusCI: 70, carpetLnW: 64, carpetLnWPlusCI: 63 },
      { joistMm: 400, inexFloorMm: 19, rw: 53, rwPlusCtr: 46, bareLnW: 77, bareLnWPlusCI: 76, timberLnW: 71, timberLnWPlusCI: 70, carpetLnW: 64, carpetLnWPlusCI: 63 }
    ]
  },
  {
    familyId: "fl27",
    label: "FL-27",
    boardLayerCount: 3,
    boardThicknessMm: 16,
    rows: [
      { joistMm: 200, inexFloorMm: 16, rw: 53, rwPlusCtr: 45, bareLnW: 76, bareLnWPlusCI: 77, timberLnW: 70, timberLnWPlusCI: 71, carpetLnW: 63, carpetLnWPlusCI: 63 },
      { joistMm: 200, inexFloorMm: 19, rw: 54, rwPlusCtr: 46, bareLnW: 76, bareLnWPlusCI: 77, timberLnW: 70, timberLnWPlusCI: 71, carpetLnW: 63, carpetLnWPlusCI: 63 },
      { joistMm: 300, inexFloorMm: 16, rw: 53, rwPlusCtr: 46, bareLnW: 76, bareLnWPlusCI: 75, timberLnW: 70, timberLnWPlusCI: 69, carpetLnW: 63, carpetLnWPlusCI: 62 },
      { joistMm: 300, inexFloorMm: 19, rw: 54, rwPlusCtr: 47, bareLnW: 76, bareLnWPlusCI: 75, timberLnW: 70, timberLnWPlusCI: 69, carpetLnW: 63, carpetLnWPlusCI: 62 },
      { joistMm: 400, inexFloorMm: 16, rw: 54, rwPlusCtr: 47, bareLnW: 76, bareLnWPlusCI: 75, timberLnW: 70, timberLnWPlusCI: 69, carpetLnW: 63, carpetLnWPlusCI: 62 },
      { joistMm: 400, inexFloorMm: 19, rw: 55, rwPlusCtr: 48, bareLnW: 76, bareLnWPlusCI: 75, timberLnW: 70, timberLnWPlusCI: 69, carpetLnW: 63, carpetLnWPlusCI: 62 }
    ]
  }
];

const WEAK_BAND_FINISHES: readonly UbiqWeakBandFinish[] = [
  {
    id: "bare",
    label: "bare INEX",
    floorCoveringSummary: "no floor covering",
    lnWKey: "bareLnW",
    lnWPlusCIKey: "bareLnWPlusCI"
  },
  {
    id: "timber_underlay",
    label: "engineered timber + acoustic underlay",
    floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay",
    floorCoveringSummary: "engineered timber finish with minimum 5 mm rubber acoustic underlay",
    lnWKey: "timberLnW",
    lnWPlusCIKey: "timberLnWPlusCI"
  },
  {
    id: "carpet_underlay",
    label: "carpet + foam underlay",
    floorCoveringMaterialId: "carpet_with_foam_underlay",
    floorCoveringSummary: "quality carpet with minimum 8 mm foam underlay",
    lnWKey: "carpetLnW",
    lnWPlusCIKey: "carpetLnWPlusCI"
  }
];

function formatDeck(row: UbiqWeakBandRatings): string {
  return `${row.inexFloorMm} mm INEX FLOOR`;
}

function buildWeakBandRow(
  family: UbiqWeakBandFamily,
  row: UbiqWeakBandRatings,
  finish: UbiqWeakBandFinish
): ExactFloorSystem {
  const lnW = row[finish.lnWKey];
  const lnWPlusCI = row[finish.lnWPlusCIKey];
  const floorCoveringMatch = finish.floorCoveringMaterialId
    ? {
        materialIds: [finish.floorCoveringMaterialId]
      }
    : undefined;
  const floorCoveringEstimate = finish.floorCoveringMaterialId
    ? {
        mode: "material_layer" as const,
        materialClass: finish.floorCoveringMaterialId
      }
    : undefined;

  return {
    id: `ubiq_${family.familyId}_open_web_steel_${row.joistMm}_${row.inexFloorMm}mm_${finish.id}_exact_lab_2026`,
    label: `UBIQ ${family.label} | ${row.joistMm} mm open-web steel | ${formatDeck(row)} | ${finish.label} | ${family.boardLayerCount} x ${family.boardThicknessMm} mm plasterboard`,
    sourceLabel: "UBIQ official system table PDF",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      impactSystemType: floorCoveringEstimate ? "combined_upper_lower_system" : "suspended_ceiling_only",
      baseSlab: {
        thicknessMm: row.joistMm
      },
      floatingScreed: {
        thicknessMm: row.inexFloorMm
      },
      ...(floorCoveringEstimate ? { floorCovering: floorCoveringEstimate } : {}),
      lowerTreatment: {
        type: "direct_fixed_ceiling",
        boardLayerCount: family.boardLayerCount,
        boardThicknessMm: family.boardThicknessMm,
        supportClass: "direct_to_joists"
      }
    },
    familyEstimateEligible: false,
    match: {
      absentRoles: floorCoveringMatch
        ? ["resilient_layer", "upper_fill", "ceiling_cavity", "ceiling_fill"]
        : ["floor_covering", "resilient_layer", "upper_fill", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["open_web_steel_floor"],
        thicknessMm: row.joistMm
      },
      floatingScreed: {
        materialIds: ["inex_floor_panel"],
        thicknessMm: row.inexFloorMm
      },
      ...(floorCoveringMatch ? { floorCovering: floorCoveringMatch } : {}),
      ceilingBoard: {
        layerCount: family.boardLayerCount,
        materialIds: ["firestop_board"],
        thicknessMm: family.boardThicknessMm
      }
    },
    systemSummary: {
      carrier: `${row.joistMm} mm open-web steel joist at 450 mm centres`,
      floorBuildUp: `${formatDeck(row)} with ${finish.floorCoveringSummary}`,
      ceiling: `Direct lower lining with ${family.boardLayerCount} x ${family.boardThicknessMm} mm fire-rated plasterboard`
    },
    impactRatings: {
      CI: lnWPlusCI - lnW,
      LnW: lnW,
      LnWPlusCI: lnWPlusCI
    },
    airborneRatings: {
      Rw: row.rw,
      RwCtr: row.rwPlusCtr,
      RwCtrSemantic: "rw_plus_ctr"
    }
  };
}

export const UBIQ_OPEN_WEB_WEAK_BAND_ROWS: readonly ExactFloorSystem[] = WEAK_BAND_FAMILIES.flatMap((family) =>
  family.rows.flatMap((row) => WEAK_BAND_FINISHES.map((finish) => buildWeakBandRow(family, row, finish)))
);
