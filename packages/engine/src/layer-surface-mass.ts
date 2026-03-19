import type { LayerInput, MaterialDefinition } from "@dynecho/shared";

function nominalFirestopBoardSurfaceMassKgM2(thicknessMm: number): number | null {
  if (thicknessMm >= 11.5 && thicknessMm <= 16.5) {
    return 13.1;
  }

  return null;
}

export function computeLayerSurfaceMassKgM2(
  layer: Pick<LayerInput, "thicknessMm">,
  material: Pick<MaterialDefinition, "densityKgM3" | "id">
): number {
  const nominalBoardMassKgM2 =
    material.id === "firestop_board" ? nominalFirestopBoardSurfaceMassKgM2(layer.thicknessMm) : null;

  if (nominalBoardMassKgM2 !== null) {
    return nominalBoardMassKgM2;
  }

  return (material.densityKgM3 * layer.thicknessMm) / 1000;
}
