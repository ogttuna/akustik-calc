import type { ExactFloorSystem } from "@dynecho/shared";

const SOURCE_LABEL = "Knauf AU official system table";
const CARRIER = "Min 19 mm particleboard flooring on 240 mm timber joists @ 450 mm centres";

type KnaufAuTimberRow = {
  boardLayerCount: number;
  boardMaterialId: "firestop_board" | "gypsum_board" | "impactstop_board";
  boardThicknessMm: number;
  ceiling: string;
  floorBuildUp: string;
  floorCoveringMaterialId: "engineered_timber_flooring";
  id: string;
  label: string;
  lnw: number;
  rw: number;
  rwCtr: number;
  ceilingCavityThicknessMm?: number;
  ceilingFillThicknessMm?: number;
};

function buildKnaufAuTimberRow(input: KnaufAuTimberRow): ExactFloorSystem {
  return {
    id: input.id,
    label: input.label,
    sourceLabel: SOURCE_LABEL,
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: [
        "floating_screed",
        "upper_fill",
        ...(typeof input.ceilingCavityThicknessMm === "number" ? [] : (["ceiling_cavity"] as const)),
        ...(typeof input.ceilingFillThicknessMm === "number" ? [] : (["ceiling_fill"] as const))
      ],
      baseStructure: {
        materialIds: ["timber_joist_floor"],
        thicknessMm: 240
      },
      floorCovering: {
        materialIds: [input.floorCoveringMaterialId],
        thicknessMm: 15
      },
      ceilingCavity:
        typeof input.ceilingCavityThicknessMm === "number"
          ? {
              materialIds: ["furring_channel"],
              thicknessMm: input.ceilingCavityThicknessMm
            }
          : undefined,
      ceilingFill:
        typeof input.ceilingFillThicknessMm === "number"
          ? {
              materialIds: ["rockwool"],
              thicknessMm: input.ceilingFillThicknessMm
            }
          : undefined,
      ceilingBoard: {
        layerCount: input.boardLayerCount,
        materialIds: [input.boardMaterialId],
        thicknessMm: input.boardThicknessMm
      }
    },
    systemSummary: {
      carrier: CARRIER,
      floorBuildUp: input.floorBuildUp,
      ceiling: input.ceiling
    },
    impactRatings: {
      LnW: input.lnw
    },
    airborneRatings: {
      Rw: input.rw,
      RwCtr: input.rwCtr,
      RwCtrSemantic: "rw_plus_ctr"
    }
  };
}

export const KNAUF_AU_TIMBER_FAMILY_ROWS: readonly ExactFloorSystem[] = [
  buildKnaufAuTimberRow({
    id: "knauf_ct2g_timber_nil_lab_2026",
    label: "Knauf CT.2G | timber flooring | no insulation",
    boardLayerCount: 1,
    boardMaterialId: "impactstop_board",
    boardThicknessMm: 13,
    ceiling: "1 x 13 mm IMPACTSTOP fixed on 28 mm furring channels @ 600 mm ctrs, no ceiling batts",
    floorBuildUp: "Timber flooring (min 8.5 kg/m2)",
    floorCoveringMaterialId: "engineered_timber_flooring",
    lnw: 71,
    rw: 49,
    rwCtr: 43
  }),
  buildKnaufAuTimberRow({
    id: "knauf_ct2h_timber_nil_lab_2026",
    label: "Knauf CT.2H | timber flooring | no insulation",
    boardLayerCount: 2,
    boardMaterialId: "impactstop_board",
    boardThicknessMm: 13,
    ceiling: "2 x 13 mm IMPACTSTOP fixed on 28 mm furring channels @ 600 mm ctrs, no ceiling batts",
    floorBuildUp: "Timber flooring (min 8.5 kg/m2)",
    floorCoveringMaterialId: "engineered_timber_flooring",
    lnw: 67,
    rw: 52,
    rwCtr: 46
  }),
  buildKnaufAuTimberRow({
    id: "knauf_ct2d_timber_r25_lab_2026",
    label: "Knauf CT.2D | timber flooring | KI 90G R2.5",
    boardLayerCount: 1,
    boardMaterialId: "gypsum_board",
    boardThicknessMm: 13,
    ceiling: "1 x 13 mm SHEETROCK ONE fixed on 28 mm furring channels @ 600 mm ctrs with KI 90G R2.5 ceiling batts",
    ceilingFillThicknessMm: 90,
    floorBuildUp: "Timber flooring (min 8.5 kg/m2)",
    floorCoveringMaterialId: "engineered_timber_flooring",
    lnw: 70,
    rw: 53,
    rwCtr: 45
  }),
  buildKnaufAuTimberRow({
    id: "knauf_ct30_1a_timber_lab_2026",
    label: "Knauf CT30.1A | timber flooring | KI 90G R2.5",
    boardLayerCount: 1,
    boardMaterialId: "firestop_board",
    boardThicknessMm: 13,
    ceiling: "1 x 13 mm FIRESTOP from below with KI 90G R2.5 ceiling batts",
    ceilingFillThicknessMm: 90,
    floorBuildUp: "Timber flooring (min 8.5 kg/m2)",
    floorCoveringMaterialId: "engineered_timber_flooring",
    lnw: 73,
    rw: 48,
    rwCtr: 42
  }),
  buildKnaufAuTimberRow({
    id: "knauf_ct30_1b_timber_lab_2026",
    label: "Knauf CT30.1B | timber flooring | KI 90G R2.5",
    boardLayerCount: 1,
    boardMaterialId: "firestop_board",
    boardThicknessMm: 13,
    ceiling: "1 x 13 mm FIRESTOP on 28 mm furring channels @ 600 mm ctrs with KI 90G R2.5 ceiling batts",
    ceilingCavityThicknessMm: 28,
    ceilingFillThicknessMm: 90,
    floorBuildUp: "Timber flooring (min 8.5 kg/m2)",
    floorCoveringMaterialId: "engineered_timber_flooring",
    lnw: 69,
    rw: 54,
    rwCtr: 47
  }),
  buildKnaufAuTimberRow({
    id: "knauf_ct30_2a_timber_lab_2026",
    label: "Knauf CT30.2A | timber flooring | KI 90G R2.5",
    boardLayerCount: 1,
    boardMaterialId: "firestop_board",
    boardThicknessMm: 16,
    ceiling: "1 x 16 mm FIRESTOP from below with KI 90G R2.5 ceiling batts",
    ceilingFillThicknessMm: 90,
    floorBuildUp: "Timber flooring (min 8.5 kg/m2)",
    floorCoveringMaterialId: "engineered_timber_flooring",
    lnw: 70,
    rw: 50,
    rwCtr: 44
  }),
  buildKnaufAuTimberRow({
    id: "knauf_ct30_2b_timber_lab_2026",
    label: "Knauf CT30.2B | timber flooring | KI 90G R2.5",
    boardLayerCount: 1,
    boardMaterialId: "firestop_board",
    boardThicknessMm: 16,
    ceiling: "1 x 16 mm FIRESTOP on 28 mm furring channels @ 600 mm ctrs with KI 90G R2.5 ceiling batts",
    ceilingCavityThicknessMm: 28,
    ceilingFillThicknessMm: 90,
    floorBuildUp: "Timber flooring (min 8.5 kg/m2)",
    floorCoveringMaterialId: "engineered_timber_flooring",
    lnw: 66,
    rw: 56,
    rwCtr: 49
  })
] as const;
