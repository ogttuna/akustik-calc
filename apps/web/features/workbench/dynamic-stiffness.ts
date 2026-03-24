import type { MaterialDefinition } from "@dynecho/shared";

function trimTrailingZeros(value: string): string {
  return value.replace(/\.0+$/u, "").replace(/(\.\d*?)0+$/u, "$1");
}

export function getCatalogDynamicStiffness(material: Pick<MaterialDefinition, "impact"> | null | undefined): number | undefined {
  const dynamicStiffnessMNm3 = material?.impact?.dynamicStiffnessMNm3;

  return typeof dynamicStiffnessMNm3 === "number" && Number.isFinite(dynamicStiffnessMNm3) && dynamicStiffnessMNm3 > 0
    ? dynamicStiffnessMNm3
    : undefined;
}

export function parseDynamicStiffnessOverride(value: string | null | undefined): number | undefined {
  if (!value || value.trim().length === 0) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function hasDynamicStiffnessOverrideInput(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function normalizeDynamicStiffnessValue(value: number): string {
  return trimTrailingZeros(value.toFixed(3));
}

export function hasEffectiveDynamicStiffnessOverride(input: {
  material: Pick<MaterialDefinition, "impact"> | null | undefined;
  overrideValue: string | null | undefined;
}): boolean {
  const override = parseDynamicStiffnessOverride(input.overrideValue);
  if (typeof override !== "number") {
    return false;
  }

  const catalogValue = getCatalogDynamicStiffness(input.material);

  return typeof catalogValue !== "number" || Math.abs(catalogValue - override) > 0.0005;
}

export function getEffectiveDynamicStiffness(input: {
  material: Pick<MaterialDefinition, "impact"> | null | undefined;
  overrideValue: string | null | undefined;
}): number | undefined {
  if (hasEffectiveDynamicStiffnessOverride(input)) {
    return parseDynamicStiffnessOverride(input.overrideValue);
  }

  return getCatalogDynamicStiffness(input.material);
}

export function buildDynamicStiffnessMaterialId(materialId: string, dynamicStiffnessMNm3: number): string {
  return `${materialId}__dyn_${normalizeDynamicStiffnessValue(dynamicStiffnessMNm3).replace(/[^\d]+/gu, "_")}`;
}

export function buildDynamicStiffnessOverrideMaterial(input: {
  baseMaterial: MaterialDefinition;
  dynamicStiffnessMNm3: number;
}): MaterialDefinition {
  const normalizedValue = normalizeDynamicStiffnessValue(input.dynamicStiffnessMNm3);

  return {
    ...input.baseMaterial,
    id: buildDynamicStiffnessMaterialId(input.baseMaterial.id, input.dynamicStiffnessMNm3),
    impact: {
      ...(input.baseMaterial.impact ?? {}),
      dynamicStiffnessMNm3: Number(normalizedValue)
    },
    name: `${input.baseMaterial.name} (${normalizedValue} MN/m³ override)`,
    notes: compactNotes(
      input.baseMaterial.notes,
      "Runtime workbench copy with manual dynamic-stiffness override."
    ),
    tags: Array.from(new Set([...(input.baseMaterial.tags ?? []), "runtime-dynamic-stiffness-override"]))
  };
}

function compactNotes(...notes: Array<string | undefined>): string | undefined {
  const resolved = notes.filter((value): value is string => Boolean(value && value.trim().length > 0));

  return resolved.length > 0 ? resolved.join(" ") : undefined;
}
