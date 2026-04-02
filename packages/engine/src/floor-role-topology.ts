import type { FloorRole } from "@dynecho/shared";

export type SingleEntryFloorRole = Exclude<FloorRole, "ceiling_board">;

export type SingleEntryRoleConflict = {
  count: number;
  materialLabels: string[];
  role: SingleEntryFloorRole;
};

export type CeilingBoardScheduleConflict = {
  count: number;
  materialLabels: string[];
  role: "ceiling_board";
};

type FloorRoleTopologyLayer = {
  floorRole?: FloorRole;
  material: {
    id: string;
    name: string;
  };
  thicknessMm?: number;
};

export const SINGLE_ENTRY_FLOOR_ROLES: readonly SingleEntryFloorRole[] = [
  "base_structure",
  "ceiling_cavity",
  "ceiling_fill",
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "upper_fill"
] as const;

export function collectSingleEntryRoleConflicts(
  layers: readonly FloorRoleTopologyLayer[],
  roles: readonly SingleEntryFloorRole[] = SINGLE_ENTRY_FLOOR_ROLES
): SingleEntryRoleConflict[] {
  const conflicts: SingleEntryRoleConflict[] = [];

  for (const role of roles) {
    const roleLayers = layers.filter((layer) => layer.floorRole === role);
    if (roleLayers.length <= 1) {
      continue;
    }

    const distinctMaterialIds = new Set(roleLayers.map((layer) => layer.material.id));
    let scheduleSegments = 0;
    let insideRoleSegment = false;

    for (const layer of layers) {
      const isRoleLayer = layer.floorRole === role;

      if (isRoleLayer && !insideRoleSegment) {
        scheduleSegments += 1;
      }

      insideRoleSegment = isRoleLayer;
    }

    if (distinctMaterialIds.size <= 1 && scheduleSegments <= 1) {
      continue;
    }

    conflicts.push({
      count: roleLayers.length,
      materialLabels: Array.from(new Set(roleLayers.map((layer) => layer.material.name))),
      role
    });
  }

  return conflicts;
}

export function hasAmbiguousSingleEntryRoleTopology(
  layers: readonly FloorRoleTopologyLayer[],
  roles: readonly SingleEntryFloorRole[] = SINGLE_ENTRY_FLOOR_ROLES
): boolean {
  return collectSingleEntryRoleConflicts(layers, roles).length > 0;
}

export function collectCeilingBoardScheduleConflict(
  layers: readonly FloorRoleTopologyLayer[]
): CeilingBoardScheduleConflict | null {
  const ceilingBoards = layers.filter((layer) => layer.floorRole === "ceiling_board");
  const firstCeilingBoard = ceilingBoards[0];

  if (!firstCeilingBoard || ceilingBoards.length <= 1) {
    return null;
  }

  const hasConflictingSchedule = ceilingBoards.some(
    (layer) =>
      layer.material.id !== firstCeilingBoard.material.id || layer.thicknessMm !== firstCeilingBoard.thicknessMm
  );

  if (!hasConflictingSchedule) {
    return null;
  }

  return {
    count: ceilingBoards.length,
    materialLabels: Array.from(new Set(ceilingBoards.map((layer) => layer.material.name))),
    role: "ceiling_board"
  };
}
