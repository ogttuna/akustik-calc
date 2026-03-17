import type { ExactFloorSystem } from "@dynecho/shared";

const SOURCE_LABEL = "Knauf AU official system table";
const CARRIER = "Min 19 mm particleboard flooring on 240 mm timber joists @ 450 mm centres";

type KnaufLowConfidenceRow = {
  boardLayerCount: number;
  boardMaterialId: "gypsum_board" | "impactstop_board";
  boardThicknessMm: number;
  ceiling: string;
  ceilingCavityThicknessMm?: number;
  ceilingFillThicknessMm?: number;
  floorBuildUp: string;
  floorCoveringMaterialId: "carpet_with_foam_underlay" | "engineered_timber_flooring";
  id: string;
  impactSystemType: "combined_upper_lower_system" | "suspended_ceiling_only";
  label: string;
  lnw: number;
  rw: number;
  rwCtr: number;
  supportClass?: "furred_channels";
};

function buildKnaufLowConfidenceRow(input: KnaufLowConfidenceRow): ExactFloorSystem {
  const ceilingMaterialId = typeof input.supportClass === "string" ? "furring_channel" : "furring_channel";

  return {
    id: input.id,
    label: input.label,
    sourceLabel: SOURCE_LABEL,
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: [
        "floating_screed",
        "resilient_layer",
        "upper_fill",
        ...(typeof input.ceilingFillThicknessMm === "number" ? [] : (["ceiling_fill"] as const))
      ],
      baseStructure: {
        materialIds: ["timber_joist_floor"],
        thicknessMm: 240
      },
      floorCovering: {
        materialIds: [input.floorCoveringMaterialId]
      },
      ceilingCavity: {
        materialIds: [ceilingMaterialId],
        thicknessMm: input.ceilingCavityThicknessMm ?? 28
      },
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

export const KNAUF_AU_LOW_CONFIDENCE_ROWS: readonly ExactFloorSystem[] = [
  buildKnaufLowConfidenceRow({
    id: "knauf_ct3b_timber_nil_lab_2026",
    impactSystemType: "suspended_ceiling_only",
    label: "Knauf CT.3B | timber flooring | no insulation",
    boardLayerCount: 1,
    boardMaterialId: "impactstop_board",
    boardThicknessMm: 13,
    ceiling: "1 x 13 mm IMPACTSTOP on 28 mm furring channels @ 600 mm ctrs + acoustic mounts, no ceiling batts",
    floorBuildUp: "Timber flooring (min 8.5 kg/m²)",
    floorCoveringMaterialId: "engineered_timber_flooring",
    lnw: 69,
    rw: 49,
    rwCtr: 44
  }),
  buildKnaufLowConfidenceRow({
    id: "knauf_ct2a_timber_nil_lab_2026",
    impactSystemType: "suspended_ceiling_only",
    label: "Knauf CT.2A | timber flooring | no insulation",
    boardLayerCount: 1,
    boardMaterialId: "gypsum_board",
    boardThicknessMm: 10,
    ceiling: "1 x 10 mm SHEETROCK ONE fixed on 28 mm furring channels @ 600 mm ctrs, no ceiling batts",
    floorBuildUp: "Timber flooring (min 8.5 kg/m²)",
    floorCoveringMaterialId: "engineered_timber_flooring",
    lnw: 73,
    rw: 46,
    rwCtr: 39,
    supportClass: "furred_channels"
  }),
  buildKnaufLowConfidenceRow({
    id: "knauf_ct2a_carpet_nil_lab_2026",
    impactSystemType: "combined_upper_lower_system",
    label: "Knauf CT.2A | carpet + foam underlay | no insulation",
    boardLayerCount: 1,
    boardMaterialId: "gypsum_board",
    boardThicknessMm: 10,
    ceiling: "1 x 10 mm SHEETROCK ONE fixed on 28 mm furring channels @ 600 mm ctrs, no ceiling batts",
    floorBuildUp: "Carpet + minimum 3 mm Dunlop DB3 foam underlay or equivalent",
    floorCoveringMaterialId: "carpet_with_foam_underlay",
    lnw: 41,
    rw: 46,
    rwCtr: 39,
    supportClass: "furred_channels"
  }),
  buildKnaufLowConfidenceRow({
    id: "knauf_ct2d_timber_nil_lab_2026",
    impactSystemType: "suspended_ceiling_only",
    label: "Knauf CT.2D | timber flooring | no insulation",
    boardLayerCount: 1,
    boardMaterialId: "gypsum_board",
    boardThicknessMm: 13,
    ceiling: "1 x 13 mm SHEETROCK ONE fixed on 28 mm furring channels @ 600 mm ctrs, no ceiling batts",
    floorBuildUp: "Timber flooring (min 8.5 kg/m²)",
    floorCoveringMaterialId: "engineered_timber_flooring",
    lnw: 72,
    rw: 48,
    rwCtr: 42,
    supportClass: "furred_channels"
  })
] as const;
