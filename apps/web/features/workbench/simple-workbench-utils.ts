import type { AirborneContextMode, FloorRole, MaterialCategory, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { formatDecimal } from "@/lib/format";
import { hasDynamicStiffnessOverrideInput, getEffectiveDynamicStiffness, hasEffectiveDynamicStiffnessOverride, parseDynamicStiffnessOverride } from "./dynamic-stiffness";
import { hasDensityOverrideInput, parseDensityOverride, getEffectiveDensity, getCatalogDensity, hasEffectiveDensityOverride } from "./material-density";
import { normalizeRows } from "./normalize-rows";
import { parsePositiveWorkbenchNumber } from "./parse-number";
import { prependRecommendedMaterialGroup } from "./material-picker-recommendations";
import { CUSTOM_MATERIAL_CATEGORY_OPTIONS, isCustomWorkbenchMaterial } from "./workbench-materials";
import type { WorkbenchMaterialOptionGroup } from "./workbench-material-picker";
import type { LayerDraft } from "./workbench-store";
import { inferFloorRole } from "./workbench-store";
import type { StudyMode } from "./preset-definitions";
import {
  AIRBORNE_CONTEXT_OPTIONS,
  AUTOMATIC_OUTPUTS,
  DEFAULT_NEW_LAYER_BY_MODE,
  MODE_MATERIAL_GROUPS,
  REMAINDER_MATERIAL_GROUP_LABEL,
  type NewLayerDraft
} from "./simple-workbench-constants";

export function formatSignedDb(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "Not ready";
  }

  return `${value >= 0 ? "+" : ""}${formatDecimal(value)} dB`;
}

export function parsePositiveNumber(value: string): number | undefined {
  return parsePositiveWorkbenchNumber(value);
}

export function isThicknessReady(thicknessMm: string): boolean {
  return typeof parsePositiveNumber(thicknessMm) === "number";
}

export function getDynamicStiffnessInputWarning(value: string | undefined): string | null {
  if (!hasDynamicStiffnessOverrideInput(value)) {
    return null;
  }

  return parseDynamicStiffnessOverride(value) ? null : "Dynamic stiffness override must be a positive number in MN/m³.";
}

export function getDensityInputWarning(material: MaterialDefinition, value: string | undefined): string | null {
  if (!hasDensityOverrideInput(value)) {
    return null;
  }

  return parseDensityOverride({
    material,
    value
  })
    ? null
    : "Density override must be non-negative in kg/m³. Use zero only for gap or support layers.";
}

export function formatDynamicStiffnessLabel(material: MaterialDefinition, overrideValue: string | undefined): string {
  const effectiveDynamicStiffness = getEffectiveDynamicStiffness({
    material,
    overrideValue
  });

  if (typeof effectiveDynamicStiffness !== "number") {
    return hasDynamicStiffnessOverrideInput(overrideValue) ? "Invalid override" : "Not listed";
  }

  return `${formatDecimal(effectiveDynamicStiffness)} MN/m³${
    hasEffectiveDynamicStiffnessOverride({ material, overrideValue }) ? " (manual)" : ""
  }`;
}

export function formatDensityValue(densityKgM3: number | undefined): string | null {
  if (!(typeof densityKgM3 === "number" && Number.isFinite(densityKgM3) && densityKgM3 >= 0)) {
    return null;
  }

  const valueLabel = Number.isInteger(densityKgM3) ? densityKgM3.toLocaleString("en-US") : formatDecimal(densityKgM3);

  return `${valueLabel} kg/m³`;
}

export function uniqueMaterialsById(materials: readonly MaterialDefinition[]): MaterialDefinition[] {
  const seen = new Set<string>();

  return materials.filter((material) => {
    if (seen.has(material.id)) {
      return false;
    }

    seen.add(material.id);
    return true;
  });
}

export function buildMaterialGroups(
  studyMode: StudyMode,
  allMaterials: readonly MaterialDefinition[],
  selectedMaterialId: string,
  floorRole?: FloorRole
): WorkbenchMaterialOptionGroup[] {
  const materialById = new Map(allMaterials.map((material) => [material.id, material]));
  const groups = MODE_MATERIAL_GROUPS[studyMode]
    .map((group) => ({
      label: group.label,
      materials: group.ids
        .map((id) => materialById.get(id))
        .filter((material): material is MaterialDefinition => Boolean(material))
  }))
    .filter((group) => group.materials.length > 0);

  const includedIds = new Set(groups.flatMap((group) => group.materials.map((material) => material.id)));
  const customMaterials = uniqueMaterialsById(
    allMaterials
      .filter((material) => !includedIds.has(material.id) && isCustomWorkbenchMaterial(material))
      .sort((left, right) => left.name.localeCompare(right.name, "en"))
  );
  if (customMaterials.length > 0) {
    groups.unshift({
      label: "Custom materials",
      materials: customMaterials
    });
  }

  if (!includedIds.has(selectedMaterialId)) {
    const selectedMaterial = materialById.get(selectedMaterialId);
    if (selectedMaterial && !isCustomWorkbenchMaterial(selectedMaterial)) {
      includedIds.add(selectedMaterial.id);
      groups.unshift({
        label: "Current row material",
        materials: [selectedMaterial]
      });
    }
  }

  const remainderMaterials = uniqueMaterialsById(
    allMaterials
      .filter((material) => !includedIds.has(material.id) && !isCustomWorkbenchMaterial(material))
      .sort((left, right) => left.name.localeCompare(right.name, "en"))
  );

  if (remainderMaterials.length > 0) {
    groups.push({
      label: REMAINDER_MATERIAL_GROUP_LABEL[studyMode],
      materials: remainderMaterials
    });
  }

  return prependRecommendedMaterialGroup({
    floorRole,
    groups: groups.map((group) => ({
      label: group.label,
      materials: uniqueMaterialsById(group.materials)
    })),
    materials: allMaterials,
    selectedMaterialId,
    studyMode
  });
}

export function getStackEdgeLabel(studyMode: StudyMode, index: number, totalRows: number): string | null {
  if (index === 0) {
    return studyMode === "floor" ? "Walking side" : "Side A";
  }

  if (index === totalRows - 1) {
    return studyMode === "floor" ? "Ceiling side" : "Side B";
  }

  return null;
}

export function getStackBoundaryLabels(studyMode: StudyMode): { end: string; start: string } {
  return studyMode === "floor"
    ? { end: "Ceiling side", start: "Walking side" }
    : { end: "Side B", start: "Side A" };
}

export function getLayerPositionNarrative(studyMode: StudyMode, index: number, totalRows: number): string {
  const boundary = getStackBoundaryLabels(studyMode);

  if (totalRows <= 1) {
    return "Only visible row in the current draft.";
  }

  if (index === 0) {
    return `Starts on ${boundary.start}.`;
  }

  if (index === totalRows - 1) {
    return `Closes on ${boundary.end}.`;
  }

  return `Sits between ${boundary.start} and ${boundary.end}.`;
}

export function getEnvironmentLabel(contextMode: AirborneContextMode): string {
  return AIRBORNE_CONTEXT_OPTIONS.find((option) => option.value === contextMode)?.label ?? "Lab element";
}

export function sumThickness(rows: readonly LayerDraft[]): number {
  return rows.reduce((total, row) => total + (parsePositiveNumber(row.thicknessMm) ?? 0), 0);
}

export function countValidThicknessRows(rows: readonly LayerDraft[]): number {
  return rows.filter((row) => typeof parsePositiveNumber(row.thicknessMm) === "number").length;
}

export function formatCountLabel(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

export function getRowActivityCounts(rows: readonly LayerDraft[], materials?: readonly MaterialDefinition[]): {
  collapsedLiveRowCount: number;
  liveRowCount: number;
  parkedRowCount: number;
  solverLayerCount: number;
} {
  const liveRowCount = countValidThicknessRows(rows);
  const solverLayerCount = normalizeRows(rows, materials).layers.length;

  return {
    collapsedLiveRowCount: Math.max(liveRowCount - solverLayerCount, 0),
    liveRowCount,
    parkedRowCount: Math.max(rows.length - liveRowCount, 0),
    solverLayerCount
  };
}

export type SimpleWorkbenchSolverDisplayLayer = {
  floorRole?: FloorRole;
  id: string;
  material: MaterialDefinition;
  sourceRowIds: readonly string[];
  thicknessLabel: string;
  thicknessMm: number;
};

export function buildSolverDisplayLayers(
  rows: readonly LayerDraft[],
  materials: readonly MaterialDefinition[]
): SimpleWorkbenchSolverDisplayLayer[] {
  const normalized = normalizeRows(rows, materials);
  const solverMaterials =
    normalized.runtimeMaterials.length > 0 ? [...materials, ...normalized.runtimeMaterials] : materials;
  const fallbackMaterial = solverMaterials[0];

  return normalized.solverLayers.flatMap((layer, index) => {
    const material = solverMaterials.find((entry) => entry.id === layer.materialId) ?? fallbackMaterial;
    if (!material) {
      return [];
    }

    return [{
      floorRole: layer.floorRole,
      id: `solver-layer-${index + 1}`,
      material,
      sourceRowIds: [...layer.sourceRowIds],
      thicknessLabel: `${formatDecimal(layer.thicknessMm)} mm`,
      thicknessMm: layer.thicknessMm
    }];
  });
}

export function countAssignedFloorRoles(rows: readonly LayerDraft[]): number {
  return rows.filter((row) => typeof row.floorRole === "string").length;
}

export function getAutomaticOutputs(studyMode: StudyMode, contextMode: AirborneContextMode): RequestedOutputId[] {
  return [...AUTOMATIC_OUTPUTS[studyMode][contextMode]];
}

export function sameRequestedOutputs(left: readonly RequestedOutputId[], right: readonly RequestedOutputId[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function getStudyModeLabel(studyMode: StudyMode): string {
  return studyMode === "floor" ? "Floor" : "Wall";
}

export function getAutomaticOutputNarrative(studyMode: StudyMode, contextMode: AirborneContextMode): string {
  if (studyMode === "floor") {
    if (contextMode === "element_lab") {
      return "Lab-side floor outputs with airborne companion values.";
    }

    if (contextMode === "field_between_rooms") {
      return "Room-to-room floor outputs plus direct field-side companions.";
    }

    return "Building-style floor outputs, including standardized field reads when enough data is present.";
  }

  if (contextMode === "element_lab") {
    return "Core wall airborne outputs without field penalties or room data.";
  }

  if (contextMode === "field_between_rooms") {
    return "Room-to-room wall outputs with apparent and normalized airborne reads.";
  }

  return "Building-style wall outputs, including standardized airborne values.";
}

export function formatMaterialDensity(material: MaterialDefinition): string | null {
  return formatDensityValue(getCatalogDensity(material));
}

export function formatDensityLabel(material: MaterialDefinition, overrideValue: string | undefined): string {
  const effectiveDensity = getEffectiveDensity({
    material,
    overrideValue
  });

  if (typeof effectiveDensity !== "number") {
    return hasDensityOverrideInput(overrideValue) ? "Invalid override" : "Not listed";
  }

  return `${formatDensityValue(effectiveDensity)}${hasEffectiveDensityOverride({ material, overrideValue }) ? " (manual)" : ""}`;
}

export function compactValues(values: Array<string | null | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value && value.trim().length > 0));
}

export function getCustomMaterialNotePreview(notes: string | undefined): string | null {
  const cleaned = notes?.replace(/Local custom workbench material\./gu, "").replace(/\s+/gu, " ").trim();
  return cleaned && cleaned.length > 0 ? cleaned : null;
}

export function getCustomMaterialCategoryLabel(category: MaterialCategory): string {
  return CUSTOM_MATERIAL_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}

export function getTextInputClassName(hasWarning = false): string {
  return `focus-ring touch-target w-full min-w-0 rounded border px-3 py-2.5 ${
    hasWarning
      ? "border-[color:var(--warning-ink)]/34 bg-[color:var(--warning-soft)]/48"
      : "hairline bg-[color:var(--paper)]"
  }`;
}

export function buildMaterialFacts(input: {
  densityOverride?: string;
  dynamicStiffnessOverride?: string;
  material: MaterialDefinition;
  thicknessMm: string;
}): string[] {
  const facts: string[] = [];
  const density = getEffectiveDensity({
    material: input.material,
    overrideValue: input.densityOverride
  });
  const densityLabel = formatDensityValue(density);
  const thickness = parsePositiveNumber(input.thicknessMm);
  const dynamicStiffness = getEffectiveDynamicStiffness({
    material: input.material,
    overrideValue: input.dynamicStiffnessOverride
  });

  if (densityLabel) {
    facts.push(`${densityLabel}${hasEffectiveDensityOverride({ material: input.material, overrideValue: input.densityOverride }) ? " (manual)" : ""}`);
  }

  if (typeof density === "number" && thickness && thickness > 0) {
    facts.push(`${formatDecimal((density * thickness) / 1000)} kg/m² at this layer`);
  }

  if (typeof dynamicStiffness === "number") {
    facts.push(
      `${formatDecimal(dynamicStiffness)} MN/m³ dynamic stiffness${
        hasEffectiveDynamicStiffnessOverride({ material: input.material, overrideValue: input.dynamicStiffnessOverride }) ? " (manual)" : ""
      }`
    );
  }

  return facts;
}

export function buildDefaultNewLayerDraft(studyMode: StudyMode): NewLayerDraft {
  const defaults = DEFAULT_NEW_LAYER_BY_MODE[studyMode];

  return {
    densityKgM3: "",
    dynamicStiffnessMNm3: "",
    floorRole: inferFloorRole(defaults.materialId, studyMode),
    materialId: defaults.materialId,
    thicknessMm: defaults.thicknessMm
  };
}
