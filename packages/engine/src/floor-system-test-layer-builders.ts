import type {
  FloorRole,
  FloorSystemMatchCriteria,
  FloorSystemRoleCriteria,
  LayerInput
} from "@dynecho/shared";

export const FLOOR_TEST_MATCH_ROLE_ENTRIES: Array<[FloorRole, keyof FloorSystemMatchCriteria]> = [
  ["ceiling_board", "ceilingBoard"],
  ["ceiling_fill", "ceilingFill"],
  ["ceiling_cavity", "ceilingCavity"],
  ["upper_fill", "upperFill"],
  ["floating_screed", "floatingScreed"],
  ["floor_covering", "floorCovering"],
  ["resilient_layer", "resilientLayer"],
  ["base_structure", "baseStructure"]
];

export const FLOOR_TEST_MERGE_SAFE_PACKED_ROLES = new Set<FloorRole>([
  "base_structure",
  "ceiling_fill",
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "upper_fill"
]);

const REPRESENTATIVE_MATERIAL_BY_CLASS: Record<string, string> = {
  bonded_chippings: "bonded_chippings",
  carpet_with_foam_underlay: "carpet_with_foam_underlay",
  dry_floating_gypsum_fiberboard: "dry_floating_gypsum_fiberboard",
  engineered_timber: "engineered_timber_flooring",
  engineered_timber_with_acoustic_underlay: "engineered_timber_with_acoustic_underlay",
  eps_floor_insulation_board: "eps_floor_insulation_board",
  generic_fill: "generic_fill",
  generic_screed: "screed",
  heavy_concrete: "concrete",
  laminate_flooring: "laminate_flooring",
  non_bonded_chippings: "non_bonded_chippings",
  porcelain_tile: "porcelain_tile",
  vinyl_flooring: "vinyl_flooring"
};

type CriteriaWithMaterialClass = FloorSystemRoleCriteria & {
  materialClass?: string;
};

type RoleBuildMode = "alternating" | "base_only" | "raw" | "tagged";

export function getFloorTestDefaultThicknessMm(role: FloorRole): number {
  switch (role) {
    case "base_structure":
      return 150;
    case "ceiling_board":
      return 12.5;
    case "ceiling_cavity":
      return 25;
    case "ceiling_fill":
      return 90;
    case "floating_screed":
      return 19;
    case "floor_covering":
      return 8;
    case "resilient_layer":
      return 5;
    case "upper_fill":
      return 50;
  }
}

export function getFloorTestMaterialSchedule(
  role: FloorRole,
  criteria: FloorSystemRoleCriteria
): readonly string[] {
  if (criteria.materialScheduleIds?.length) {
    return criteria.materialScheduleIds;
  }

  if (criteria.materialIds?.length) {
    const layerCount = criteria.thicknessScheduleMm?.length ?? criteria.layerCount ?? 1;
    return Array.from({ length: layerCount }, () => criteria.materialIds![0]!);
  }

  const materialClass = (criteria as CriteriaWithMaterialClass).materialClass;
  const representativeMaterialId = materialClass ? REPRESENTATIVE_MATERIAL_BY_CLASS[materialClass] : undefined;

  if (representativeMaterialId) {
    const layerCount = criteria.thicknessScheduleMm?.length ?? criteria.layerCount ?? 1;
    return Array.from({ length: layerCount }, () => representativeMaterialId);
  }

  throw new Error(`Cannot build ${role} layer without a material id, schedule, or known material class.`);
}

export function getFloorTestThicknessSchedule(
  role: FloorRole,
  criteria: FloorSystemRoleCriteria,
  layerCount: number
): readonly number[] {
  if (criteria.thicknessScheduleMm?.length) {
    return criteria.thicknessScheduleMm;
  }

  const thicknessMm = criteria.thicknessMm ?? getFloorTestDefaultThicknessMm(role);
  return Array.from({ length: layerCount }, () => thicknessMm);
}

export function buildFloorTestLayersFromCriteria(
  match: FloorSystemMatchCriteria,
  mode: RoleBuildMode = "tagged"
): LayerInput[] {
  const layers: LayerInput[] = [];
  let layerIndex = 0;

  for (const [role, key] of FLOOR_TEST_MATCH_ROLE_ENTRIES) {
    const criteria = match[key] as FloorSystemRoleCriteria | undefined;

    if (!criteria) {
      continue;
    }

    const materialSchedule = getFloorTestMaterialSchedule(role, criteria);
    const thicknessSchedule = getFloorTestThicknessSchedule(role, criteria, materialSchedule.length);

    if (thicknessSchedule.length !== materialSchedule.length) {
      throw new Error(`Cannot build ${role} layer because material and thickness schedules differ.`);
    }

    for (let index = 0; index < materialSchedule.length; index += 1) {
      const shouldKeepRole =
        mode === "tagged" ||
        (mode === "base_only" && role === "base_structure") ||
        (mode === "alternating" && layerIndex % 2 === 1);

      layers.push({
        ...(shouldKeepRole ? { floorRole: role } : {}),
        materialId: materialSchedule[index]!,
        thicknessMm: thicknessSchedule[index]!
      });
      layerIndex += 1;
    }
  }

  return layers;
}
