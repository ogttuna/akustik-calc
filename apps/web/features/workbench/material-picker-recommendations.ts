import type { FloorRole, MaterialDefinition } from "@dynecho/shared";

import type { StudyMode } from "./preset-definitions";
import type { WorkbenchMaterialOptionGroup } from "./workbench-material-picker";
import { FLOOR_ROLE_LABELS } from "./workbench-data";
import { inferFloorRole } from "./workbench-store";

const FLOOR_COVER_CAUTION_TAGS = ["plaster", "render", "masonry-finish"] as const;

function uniqueMaterialsById(materials: readonly MaterialDefinition[]): MaterialDefinition[] {
  const seen = new Set<string>();

  return materials.filter((material) => {
    if (seen.has(material.id)) {
      return false;
    }

    seen.add(material.id);
    return true;
  });
}

function shouldDeprioritizeForFloorRole(material: MaterialDefinition, floorRole: FloorRole | undefined): boolean {
  if (floorRole !== "floor_covering") {
    return false;
  }

  return FLOOR_COVER_CAUTION_TAGS.some((tag) => material.tags.includes(tag));
}

export function prependRecommendedMaterialGroup(input: {
  floorRole?: FloorRole;
  groups: readonly WorkbenchMaterialOptionGroup[];
  materials: readonly MaterialDefinition[];
  selectedMaterialId: string;
  studyMode: StudyMode;
}): WorkbenchMaterialOptionGroup[] {
  if (input.studyMode !== "floor") {
    return [...input.groups];
  }

  const activeRole =
    input.floorRole ?? inferFloorRole(input.selectedMaterialId, input.studyMode, input.materials);

  if (!activeRole) {
    return [...input.groups];
  }

  const cautionMaterials = uniqueMaterialsById(
    input.materials.filter((material) => shouldDeprioritizeForFloorRole(material, activeRole))
  );
  const cautionIds = new Set(cautionMaterials.map((material) => material.id));
  const recommendedMaterials = uniqueMaterialsById(
    input.materials.filter(
      (material) =>
        inferFloorRole(material.id, input.studyMode, input.materials) === activeRole && !cautionIds.has(material.id)
    )
  );
  const recommendedIds = new Set(recommendedMaterials.map((material) => material.id));
  const remainingGroups = input.groups
    .map((group) => ({
      label: group.label,
      materials: group.materials.filter(
        (material) => !recommendedIds.has(material.id) && !cautionIds.has(material.id)
      )
    }))
    .filter((group) => group.materials.length > 0);

  if (recommendedMaterials.length === 0 && cautionMaterials.length === 0) {
    return [...input.groups];
  }

  return [
    ...(recommendedMaterials.length > 0
      ? [
          {
            label: `Recommended for ${FLOOR_ROLE_LABELS[activeRole]}`,
            materials: recommendedMaterials
          }
        ]
      : []),
    ...remainingGroups,
    ...(cautionMaterials.length > 0
      ? [
          {
            label: `Not recommended for ${FLOOR_ROLE_LABELS[activeRole]}`,
            materials: cautionMaterials
          }
        ]
      : [])
  ];
}
