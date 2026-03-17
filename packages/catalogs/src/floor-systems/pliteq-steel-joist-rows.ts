import type { ExactFloorSystem } from "@dynecho/shared";

type PliteqSteelJoistRow = {
  floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay" | "porcelain_tile" | "vinyl_flooring";
  floorCoveringThicknessMm: number;
  id: string;
  label: string;
  lnw: number;
  resilientLayerMaterialId: "geniemat_rst02" | "geniemat_rst12";
  resilientLayerThicknessMm: number;
  rw: number;
  summary: string;
};

function buildPliteqSteelJoistRow(input: PliteqSteelJoistRow): ExactFloorSystem {
  return {
    id: input.id,
    label: input.label,
    sourceLabel: "Pliteq Australia GenieClip brochure",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "steel_joists",
      supportForm: "joist_or_purlin",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 250
      },
      resilientLayer: {
        productId: input.resilientLayerMaterialId,
        thicknessMm: input.resilientLayerThicknessMm
      },
      floatingScreed: {
        thicknessMm: 19
      },
      floorCovering: {
        mode: "material_layer",
        materialClass:
          input.floorCoveringMaterialId === "engineered_timber_with_acoustic_underlay"
            ? "engineered_timber_with_acoustic_underlay"
            : input.floorCoveringMaterialId,
        thicknessMm: input.floorCoveringThicknessMm
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        boardLayerCount: 2,
        boardThicknessMm: 16
      }
    },
    match: {
      absentRoles: ["upper_fill"],
      baseStructure: {
        materialIds: ["steel_joist_floor"],
        thicknessMm: 250
      },
      resilientLayer: {
        materialIds: [input.resilientLayerMaterialId],
        thicknessMm: input.resilientLayerThicknessMm
      },
      floatingScreed: {
        materialIds: ["inex_floor_panel"],
        thicknessMm: 19
      },
      floorCovering: {
        materialIds: [input.floorCoveringMaterialId],
        thicknessMm: input.floorCoveringThicknessMm
      },
      ceilingCavity: {
        materialIds: ["resilient_channel"],
        thicknessMm: 120
      },
      ceilingFill: {
        materialIds: ["glasswool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["firestop_board"],
        thicknessMm: 16
      }
    },
    systemSummary: {
      carrier: "250 mm steel joist",
      floorBuildUp: input.summary,
      ceiling: "2 x 16 mm plasterboard ceiling with GenieClip-style resilient support"
    },
    impactRatings: {
      LnW: input.lnw
    },
    airborneRatings: {
      Rw: input.rw
    }
  };
}

export const PLITEQ_STEEL_JOIST_ROWS: readonly ExactFloorSystem[] = [
  buildPliteqSteelJoistRow({
    id: "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
    label: "Pliteq 250 mm steel joist | GenieMat RST02 + vinyl plank | 2 x 16 mm ceiling",
    floorCoveringMaterialId: "vinyl_flooring",
    floorCoveringThicknessMm: 2.5,
    lnw: 58,
    resilientLayerMaterialId: "geniemat_rst02",
    resilientLayerThicknessMm: 2,
    rw: 60,
    summary: "19 mm structural deck with vinyl plank on GenieMat RST02 acoustic underlayment"
  }),
  buildPliteqSteelJoistRow({
    id: "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
    label: "Pliteq 250 mm steel joist | GenieMat RST12 + porcelain tile | 2 x 16 mm ceiling",
    floorCoveringMaterialId: "porcelain_tile",
    floorCoveringThicknessMm: 8,
    lnw: 60,
    resilientLayerMaterialId: "geniemat_rst12",
    resilientLayerThicknessMm: 12,
    rw: 62,
    summary: "19 mm structural deck with porcelain tile on GenieMat RST12 acoustic underlayment"
  }),
  buildPliteqSteelJoistRow({
    id: "pliteq_steel_joist_250_rst02_wood_lab_2026",
    label: "Pliteq 250 mm steel joist | GenieMat RST02 + wood finish | 2 x 16 mm ceiling",
    floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay",
    floorCoveringThicknessMm: 15,
    lnw: 57,
    resilientLayerMaterialId: "geniemat_rst02",
    resilientLayerThicknessMm: 2,
    rw: 59,
    summary: "19 mm structural deck with wood finish on GenieMat RST02 acoustic underlayment"
  })
] as const;
