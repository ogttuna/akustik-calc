"use client";

import type { FloorRole } from "@dynecho/shared";

import { FLOOR_ROLE_LABELS } from "./workbench-data";

type FloorRoleCarrier = {
  floorRole?: FloorRole;
  id?: string;
};

export type SimpleWorkbenchFloorRoleConflict = {
  count: number;
  role: FloorRole;
  roleLabel: string;
};

export const SIMPLE_WORKBENCH_SINGLE_ENTRY_FLOOR_ROLES = new Set<FloorRole>([
  "base_structure",
  "ceiling_cavity",
  "ceiling_fill",
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "upper_fill"
]);

export function findSimpleWorkbenchSingleEntryFloorRoleConflict(
  rows: readonly FloorRoleCarrier[],
  floorRole?: FloorRole,
  options: {
    ignoreRowId?: string;
  } = {}
): SimpleWorkbenchFloorRoleConflict | null {
  if (!floorRole || !SIMPLE_WORKBENCH_SINGLE_ENTRY_FLOOR_ROLES.has(floorRole)) {
    return null;
  }

  const conflictCount = rows.filter((row) => row.id !== options.ignoreRowId && row.floorRole === floorRole).length;
  if (conflictCount === 0) {
    return null;
  }

  return {
    count: conflictCount,
    role: floorRole,
    roleLabel: FLOOR_ROLE_LABELS[floorRole]
  };
}

export function describeSimpleWorkbenchSingleEntryFloorRoleConflict(
  conflict: SimpleWorkbenchFloorRoleConflict,
  options: {
    context: "composer" | "editor";
    replaceBaseAvailable?: boolean;
  }
): string {
  const roleLabel = conflict.roleLabel;
  const countLabel = conflict.count === 1 ? "another row" : `${conflict.count} other rows`;

  if (options.context === "composer") {
    if (conflict.role === "base_structure" && options.replaceBaseAvailable) {
      return `${roleLabel} is already assigned in this stack. Use Replace base to swap the structural carrier cleanly; adding another base structure will keep visible-layer predictor matching on the broader layer-scoring lane.`;
    }

    return `${roleLabel} is already assigned in this stack. Adding another one is allowed, but visible-layer predictor matching will stay on the broader layer-scoring lane instead of a family or exact match.`;
  }

  return `${roleLabel} is already used by ${countLabel}. Keeping this duplicate role is allowed, but visible-layer predictor matching will stay on the broader layer-scoring lane instead of a family or exact match.`;
}
