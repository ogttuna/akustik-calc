import type { ExactFloorSystem } from "@dynecho/shared";

function buildConcreteRow(input: {
  ceiling: string;
  ceilingBoardCount?: number;
  ceilingBoardThicknessMm?: number;
  ceilingCavityThicknessMm?: number;
  ceilingFillThicknessMm?: number;
  ceilingMaterialId?: "furring_channel" | "resilient_channel";
  id: string;
  label: string;
  lnw: number;
  rw: number;
}) : ExactFloorSystem {
  const hasCeiling = typeof input.ceilingBoardCount === "number";

  return {
    id: input.id,
    label: input.label,
    sourceLabel: "Euracoustics FA2023 concrete ceiling study",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: !hasCeiling
      ? {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "bare_floor",
          baseSlab: {
            materialClass: "heavy_concrete",
            thicknessMm: 140
          }
        }
      : undefined,
    match: {
      absentRoles: hasCeiling ? ["floating_screed", "resilient_layer", "upper_fill", "floor_covering"] : [
        "ceiling_board",
        "ceiling_cavity",
        "ceiling_fill",
        "floating_screed",
        "resilient_layer",
        "upper_fill",
        "floor_covering"
      ],
      baseStructure: {
        materialIds: ["concrete"],
        thicknessMm: 140
      },
      ceilingCavity:
        hasCeiling
          ? {
              materialIds: [input.ceilingMaterialId ?? "furring_channel"],
              thicknessMm: input.ceilingCavityThicknessMm ?? 130
            }
          : undefined,
      ceilingFill:
        hasCeiling
          ? {
              materialIds: ["rockwool"],
              thicknessMm: input.ceilingFillThicknessMm ?? 100
            }
          : undefined,
      ceilingBoard:
        hasCeiling
          ? {
              layerCount: input.ceilingBoardCount,
              materialIds: ["firestop_board"],
              thicknessMm: input.ceilingBoardThicknessMm ?? 13
            }
          : undefined
    },
    systemSummary: {
      carrier: "140 mm laboratory concrete slab",
      floorBuildUp: hasCeiling ? "Bare slab above the ceiling" : "Bare slab with no floating floor or floor covering",
      ceiling: input.ceiling
    },
    impactRatings: {
      LnW: input.lnw
    },
    airborneRatings: {
      Rw: input.rw
    }
  };
}

export const EURACOUSTICS_CONCRETE_ROWS: readonly ExactFloorSystem[] = [
  buildConcreteRow({
    id: "euracoustics_f0_bare_concrete_lab_2026",
    label: "140 mm concrete slab | bare lab floor",
    ceiling: "No ceiling below",
    lnw: 77,
    rw: 56
  }),
  buildConcreteRow({
    id: "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
    label: "140 mm concrete slab | rigid hanger ceiling | 2 x 13 mm boards",
    ceiling: "Rigid hangers, 130 mm cavity including 100 mm mineral wool, metal frame, 2 x 13 mm plasterboards",
    ceilingBoardCount: 2,
    ceilingBoardThicknessMm: 13,
    ceilingCavityThicknessMm: 130,
    ceilingFillThicknessMm: 100,
    ceilingMaterialId: "furring_channel",
    lnw: 58,
    rw: 70
  }),
  buildConcreteRow({
    id: "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
    label: "140 mm concrete slab | elastic hanger ceiling | 2 x 13 mm boards",
    ceiling: "Elastic hangers, 130 mm cavity including 100 mm mineral wool, metal frame, 2 x 13 mm plasterboards",
    ceilingBoardCount: 2,
    ceilingBoardThicknessMm: 13,
    ceilingCavityThicknessMm: 130,
    ceilingFillThicknessMm: 100,
    ceilingMaterialId: "resilient_channel",
    lnw: 43,
    rw: 77
  })
] as const;
