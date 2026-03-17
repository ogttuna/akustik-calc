import type { LayerInput } from "@dynecho/shared";

import type { LayerDraft } from "./workbench-store";

export function normalizeRows(rows: readonly LayerDraft[]) {
  const warnings: string[] = [];
  const layers: LayerInput[] = [];

  rows.forEach((row, index) => {
    const parsedThickness = Number(row.thicknessMm);
    if (!Number.isFinite(parsedThickness) || parsedThickness <= 0) {
      warnings.push(`Layer ${index + 1} is missing a valid thickness.`);
      return;
    }

    layers.push({
      floorRole: row.floorRole,
      materialId: row.materialId,
      thicknessMm: parsedThickness
    });
  });

  return { layers, warnings };
}
