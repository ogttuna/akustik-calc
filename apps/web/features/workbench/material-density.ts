import type { MaterialDefinition } from "@dynecho/shared";

import { parseWorkbenchNumber } from "./parse-number";

function trimTrailingZeros(value: string): string {
  return value.replace(/\.0+$/u, "").replace(/(\.\d*?)0+$/u, "$1");
}

function canUseZeroDensity(material: Pick<MaterialDefinition, "category"> | null | undefined): boolean {
  return material?.category === "gap" || material?.category === "support";
}

export function getCatalogDensity(material: Pick<MaterialDefinition, "densityKgM3"> | null | undefined): number | undefined {
  const densityKgM3 = material?.densityKgM3;

  return typeof densityKgM3 === "number" && Number.isFinite(densityKgM3) && densityKgM3 >= 0 ? densityKgM3 : undefined;
}

export function parseDensityOverride(input: {
  material: Pick<MaterialDefinition, "category"> | null | undefined;
  value: string | null | undefined;
}): number | undefined {
  const parsed = parseWorkbenchNumber(input.value);

  if (typeof parsed !== "number" || !Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  if (parsed === 0 && !canUseZeroDensity(input.material)) {
    return undefined;
  }

  return parsed;
}

export function hasDensityOverrideInput(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function normalizeDensityValue(value: number): string {
  return trimTrailingZeros(value.toFixed(3));
}

export function hasEffectiveDensityOverride(input: {
  material: Pick<MaterialDefinition, "category" | "densityKgM3"> | null | undefined;
  overrideValue: string | null | undefined;
}): boolean {
  const override = parseDensityOverride({
    material: input.material,
    value: input.overrideValue
  });
  if (typeof override !== "number") {
    return false;
  }

  const catalogValue = getCatalogDensity(input.material);

  return typeof catalogValue !== "number" || Math.abs(catalogValue - override) > 0.0005;
}

export function getEffectiveDensity(input: {
  material: Pick<MaterialDefinition, "category" | "densityKgM3"> | null | undefined;
  overrideValue: string | null | undefined;
}): number | undefined {
  if (hasEffectiveDensityOverride(input)) {
    return parseDensityOverride({
      material: input.material,
      value: input.overrideValue
    });
  }

  return getCatalogDensity(input.material);
}

export function buildDensityOverrideMaterialId(materialId: string, densityKgM3: number): string {
  return `${materialId}__rho_${normalizeDensityValue(densityKgM3).replace(/[^\d]+/gu, "_")}`;
}

export function buildDensityOverrideMaterial(input: {
  baseMaterial: MaterialDefinition;
  densityKgM3: number;
}): MaterialDefinition {
  const normalizedValue = normalizeDensityValue(input.densityKgM3);

  return {
    ...input.baseMaterial,
    densityKgM3: Number(normalizedValue),
    id: buildDensityOverrideMaterialId(input.baseMaterial.id, input.densityKgM3),
    name: `${input.baseMaterial.name} (${normalizedValue} kg/m³ override)`,
    notes: compactNotes(input.baseMaterial.notes, "Runtime workbench copy with manual density override."),
    tags: Array.from(new Set([...(input.baseMaterial.tags ?? []), "runtime-density-override"]))
  };
}

function compactNotes(...notes: Array<string | undefined>): string | undefined {
  const resolved = notes.filter((value): value is string => Boolean(value && value.trim().length > 0));

  return resolved.length > 0 ? resolved.join(" ") : undefined;
}
