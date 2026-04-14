import type { ExactFloorSystem } from "@dynecho/shared";

type UbiqSupportedBandRatings = {
  bareLnW: number;
  bareLnWPlusCI: number;
  inexFloorMm: 16 | 19;
  joistMm: 200 | 300 | 400;
  rw: number;
  rwPlusCtr: number;
  timberLnW: number;
  timberLnWPlusCI: number;
};

type UbiqSupportedBandFamily = {
  boardLayerCount: 2 | 3;
  boardThicknessMm: 13 | 16;
  familyId: "fl24" | "fl26" | "fl28";
  label: "FL-24" | "FL-26" | "FL-28";
  timberFamilyEstimateEligible: boolean;
  rows: readonly UbiqSupportedBandRatings[];
};

type UbiqSupportedBandFinish = {
  floorCoveringMaterialId?: "engineered_timber_with_acoustic_underlay";
  floorCoveringSummary: string;
  id: "bare" | "timber_underlay";
  label: string;
  lnWKey: "bareLnW" | "timberLnW";
  lnWPlusCIKey: "bareLnWPlusCI" | "timberLnWPlusCI";
};

const SUPPORTED_BAND_FAMILIES: readonly UbiqSupportedBandFamily[] = [
  {
    familyId: "fl24",
    label: "FL-24",
    boardLayerCount: 2,
    boardThicknessMm: 13,
    timberFamilyEstimateEligible: false,
    rows: [
      { joistMm: 200, inexFloorMm: 16, rw: 59, rwPlusCtr: 52, bareLnW: 63, bareLnWPlusCI: 62, timberLnW: 55, timberLnWPlusCI: 54 },
      { joistMm: 200, inexFloorMm: 19, rw: 60, rwPlusCtr: 53, bareLnW: 63, bareLnWPlusCI: 62, timberLnW: 55, timberLnWPlusCI: 54 },
      { joistMm: 300, inexFloorMm: 16, rw: 60, rwPlusCtr: 54, bareLnW: 62, bareLnWPlusCI: 60, timberLnW: 54, timberLnWPlusCI: 52 },
      { joistMm: 300, inexFloorMm: 19, rw: 61, rwPlusCtr: 55, bareLnW: 62, bareLnWPlusCI: 60, timberLnW: 54, timberLnWPlusCI: 52 },
      { joistMm: 400, inexFloorMm: 16, rw: 60, rwPlusCtr: 54, bareLnW: 61, bareLnWPlusCI: 59, timberLnW: 53, timberLnWPlusCI: 51 },
      { joistMm: 400, inexFloorMm: 19, rw: 61, rwPlusCtr: 55, bareLnW: 61, bareLnWPlusCI: 59, timberLnW: 53, timberLnWPlusCI: 51 }
    ]
  },
  {
    familyId: "fl26",
    label: "FL-26",
    boardLayerCount: 2,
    boardThicknessMm: 16,
    timberFamilyEstimateEligible: true,
    rows: [
      { joistMm: 200, inexFloorMm: 16, rw: 60, rwPlusCtr: 53, bareLnW: 62, bareLnWPlusCI: 61, timberLnW: 54, timberLnWPlusCI: 53 },
      { joistMm: 200, inexFloorMm: 19, rw: 61, rwPlusCtr: 55, bareLnW: 62, bareLnWPlusCI: 61, timberLnW: 54, timberLnWPlusCI: 53 },
      { joistMm: 300, inexFloorMm: 16, rw: 61, rwPlusCtr: 55, bareLnW: 61, bareLnWPlusCI: 59, timberLnW: 53, timberLnWPlusCI: 51 },
      { joistMm: 300, inexFloorMm: 19, rw: 62, rwPlusCtr: 57, bareLnW: 61, bareLnWPlusCI: 59, timberLnW: 53, timberLnWPlusCI: 51 },
      { joistMm: 400, inexFloorMm: 16, rw: 61, rwPlusCtr: 55, bareLnW: 61, bareLnWPlusCI: 59, timberLnW: 53, timberLnWPlusCI: 51 },
      { joistMm: 400, inexFloorMm: 19, rw: 62, rwPlusCtr: 57, bareLnW: 61, bareLnWPlusCI: 59, timberLnW: 53, timberLnWPlusCI: 51 }
    ]
  },
  {
    familyId: "fl28",
    label: "FL-28",
    boardLayerCount: 3,
    boardThicknessMm: 16,
    timberFamilyEstimateEligible: true,
    rows: [
      { joistMm: 200, inexFloorMm: 16, rw: 62, rwPlusCtr: 55, bareLnW: 60, bareLnWPlusCI: 59, timberLnW: 52, timberLnWPlusCI: 51 },
      { joistMm: 200, inexFloorMm: 19, rw: 63, rwPlusCtr: 57, bareLnW: 60, bareLnWPlusCI: 59, timberLnW: 52, timberLnWPlusCI: 51 },
      { joistMm: 300, inexFloorMm: 16, rw: 63, rwPlusCtr: 57, bareLnW: 59, bareLnWPlusCI: 57, timberLnW: 51, timberLnWPlusCI: 49 },
      { joistMm: 300, inexFloorMm: 19, rw: 64, rwPlusCtr: 59, bareLnW: 59, bareLnWPlusCI: 57, timberLnW: 51, timberLnWPlusCI: 49 },
      { joistMm: 400, inexFloorMm: 16, rw: 63, rwPlusCtr: 57, bareLnW: 58, bareLnWPlusCI: 56, timberLnW: 50, timberLnWPlusCI: 48 },
      { joistMm: 400, inexFloorMm: 19, rw: 64, rwPlusCtr: 59, bareLnW: 58, bareLnWPlusCI: 56, timberLnW: 50, timberLnWPlusCI: 48 }
    ]
  }
];

const SUPPORTED_BAND_FINISHES: readonly UbiqSupportedBandFinish[] = [
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
    floorCoveringSummary: "engineered timber finish with acoustic underlay",
    lnWKey: "timberLnW",
    lnWPlusCIKey: "timberLnWPlusCI"
  }
];

function formatDeck(row: UbiqSupportedBandRatings): string {
  return `${row.inexFloorMm} mm INEX FLOOR`;
}

function buildSupportedBandId(
  family: UbiqSupportedBandFamily,
  row: UbiqSupportedBandRatings,
  finish: UbiqSupportedBandFinish
): string {
  if (finish.id === "bare") {
    return `ubiq_${family.familyId}_open_web_steel_${row.joistMm}_${row.inexFloorMm}mm_bare_exact_lab_2026`;
  }

  const deckSuffix = row.inexFloorMm === 16 ? "_16mm" : "";

  return `ubiq_${family.familyId}_open_web_steel_${row.joistMm}${deckSuffix}_exact_lab_2026`;
}

function buildSupportedBandRow(
  family: UbiqSupportedBandFamily,
  row: UbiqSupportedBandRatings,
  finish: UbiqSupportedBandFinish
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
  const isBare = finish.id === "bare";

  return {
    id: buildSupportedBandId(family, row, finish),
    label: `UBIQ ${family.label} | ${row.joistMm} mm open-web steel | ${formatDeck(row)} | ${finish.label} | ${family.boardLayerCount} x ${family.boardThicknessMm} mm resilient ceiling`,
    sourceLabel: "UBIQ official system table PDF",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    ...(isBare || !family.timberFamilyEstimateEligible ? { familyEstimateEligible: false } : {}),
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
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 65,
        cavityFillThicknessMm: 145,
        boardLayerCount: family.boardLayerCount,
        boardThicknessMm: family.boardThicknessMm
      }
    },
    match: {
      absentRoles: floorCoveringMatch ? ["resilient_layer", "upper_fill"] : ["floor_covering", "resilient_layer", "upper_fill"],
      baseStructure: {
        materialIds: ["open_web_steel_floor"],
        thicknessMm: row.joistMm
      },
      floatingScreed: {
        materialIds: ["inex_floor_panel"],
        thicknessMm: row.inexFloorMm
      },
      ...(floorCoveringMatch ? { floorCovering: floorCoveringMatch } : {}),
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
      floorBuildUp: `${formatDeck(row)} with ${finish.floorCoveringSummary}`,
      ceiling: `65 mm resilient ceiling zone with 145 mm insulation and ${family.boardLayerCount} x ${family.boardThicknessMm} mm fire-rated plasterboard`
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

export const UBIQ_OPEN_WEB_SUPPORTED_BAND_EXACT_ROWS: readonly ExactFloorSystem[] = SUPPORTED_BAND_FAMILIES.flatMap(
  (family) => family.rows.flatMap((row) => SUPPORTED_BAND_FINISHES.map((finish) => buildSupportedBandRow(family, row, finish)))
);
