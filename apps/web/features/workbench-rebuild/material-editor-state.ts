import { MATERIAL_CATALOG_SEED } from "@dynecho/catalogs";
import {
  MaterialDefinitionSchema,
  type AcousticAbsorberClass,
  type AcousticMaterialBehavior,
  type AcousticMaterialPropertySourceStatus,
  type MaterialCategory,
  type MaterialDefinition
} from "@dynecho/shared";

import { parseWorkbenchNumber } from "../workbench/parse-number";
import { CUSTOM_WORKBENCH_MATERIAL_TAG, buildWorkbenchMaterialCatalog, isCustomWorkbenchMaterial } from "../workbench/workbench-materials";
import { getIllustrationMaterialCue, type IllustrationMaterialCue, type LayerVisualMaterial } from "../workbench/simple-workbench-illustration";

export type MaterialEditorDraft = {
  absorberClass: AcousticAbsorberClass;
  behavior: AcousticMaterialBehavior;
  category: MaterialCategory;
  densityKgM3: string;
  dynamicStiffnessMNm3: string;
  flowResistivityPaSM2: string;
  id: string | null;
  lossFactor: string;
  name: string;
  notes: string;
  poissonRatio: string;
  porosity: string;
  propertySourceStatus: AcousticMaterialPropertySourceStatus;
  tags: string;
  youngModulusPa: string;
};

export type MaterialEditorDraftErrors = Partial<Record<keyof MaterialEditorDraft, string>>;
export type MaterialEditorDraftWarnings = Partial<Record<keyof MaterialEditorDraft, string>>;

export type MaterialEditorDraftValidation = {
  errors: MaterialEditorDraftErrors;
  warnings: MaterialEditorDraftWarnings;
};

export type MaterialVisualOverride = {
  fillColor?: string;
  materialId: string;
  patternColor?: string;
  sideColor?: string;
  strokeColor?: string;
  updatedAtIso: string;
  visualCue?: IllustrationMaterialCue;
};

export type MaterialVisualDraft = {
  fillColor: string;
  patternColor: string;
  sideColor: string;
  strokeColor: string;
};

export type MaterialEditorPersistedState = {
  customMaterials: MaterialDefinition[];
  materialVisualOverrides: MaterialVisualOverride[];
};

export type MaterialEditorPersistedStateParseResult = {
  droppedCustomMaterials: number;
  droppedVisualOverrides: number;
  malformed: boolean;
  state: MaterialEditorPersistedState;
};

type LayerMaterialReference = {
  materialId: string;
};

const CUSTOM_COPY_TAG = "project-material-copy";
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/iu;
const SHORT_HEX_COLOR_PATTERN = /^#[0-9a-f]{3}$/iu;
const SEED_MATERIAL_IDS = new Set(MATERIAL_CATALOG_SEED.map((material) => material.id));
const ILLUSTRATION_MATERIAL_CUES = new Set<IllustrationMaterialCue>([
  "board",
  "cavity",
  "concrete",
  "fiber",
  "mass",
  "masonry",
  "plaster",
  "resilient",
  "steel_support",
  "support",
  "surface",
  "timber",
  "timber_support"
]);
const EMPTY_PERSISTED_MATERIAL_EDITOR_STATE: MaterialEditorPersistedState = {
  customMaterials: [],
  materialVisualOverrides: []
};
const MATERIAL_VISUAL_DEFAULTS: Record<IllustrationMaterialCue, MaterialVisualDraft> = {
  board: { fillColor: "#ddd8cf", patternColor: "#8f8477", sideColor: "#c6baab", strokeColor: "#938779" },
  cavity: { fillColor: "#eceeed", patternColor: "#8e9694", sideColor: "#d4d8d7", strokeColor: "#87908e" },
  concrete: { fillColor: "#ced1d0", patternColor: "#7f878a", sideColor: "#b5bbbd", strokeColor: "#747d82" },
  fiber: { fillColor: "#d5bf78", patternColor: "#8e7440", sideColor: "#b59a58", strokeColor: "#806638" },
  mass: { fillColor: "#d6d8db", patternColor: "#88939d", sideColor: "#bec5cb", strokeColor: "#7f8b95" },
  masonry: { fillColor: "#d4b79b", patternColor: "#8e7258", sideColor: "#ba9a7a", strokeColor: "#7f6048" },
  plaster: { fillColor: "#ebdecd", patternColor: "#9f8d79", sideColor: "#cfbca6", strokeColor: "#8f7e6b" },
  resilient: { fillColor: "#97c2b6", patternColor: "#5a8578", sideColor: "#79a493", strokeColor: "#4f7669" },
  steel_support: { fillColor: "#c6ccd0", patternColor: "#747f87", sideColor: "#a7afb5", strokeColor: "#66737c" },
  support: { fillColor: "#c2c8c7", patternColor: "#788581", sideColor: "#a8b0ae", strokeColor: "#6c7775" },
  surface: { fillColor: "#d8d6cf", patternColor: "#85857d", sideColor: "#c0bdb4", strokeColor: "#74766f" },
  timber: { fillColor: "#cfac84", patternColor: "#846141", sideColor: "#aa845c", strokeColor: "#745536" },
  timber_support: { fillColor: "#c79f72", patternColor: "#7c5d3b", sideColor: "#9f774e", strokeColor: "#6f5032" }
};

function formatNumberDraft(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "";
  }

  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100000) / 100000);
}

function compactLines(...values: Array<string | undefined>): string | undefined {
  const lines = values.map((value) => value?.trim()).filter((value): value is string => Boolean(value && value.length > 0));
  return lines.length ? lines.join(" ") : undefined;
}

function normalizeSlugPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/gu, "")
    .replace(/[_\s-]+/gu, "_")
    .replace(/^_+|_+$/gu, "");
}

function splitTags(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/[,\s]+/u)
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

function serializeTags(tags: readonly string[]): string {
  return tags.filter((tag) => tag !== CUSTOM_WORKBENCH_MATERIAL_TAG && tag !== CUSTOM_COPY_TAG).join(", ");
}

function optionalPositiveNumber(value: string): number | undefined {
  const parsed = parseWorkbenchNumber(value);
  return typeof parsed === "number" && Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function optionalFiniteNumber(value: string): number | undefined {
  const parsed = parseWorkbenchNumber(value);
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : undefined;
}

function numberFieldHasInvalidValue(value: string): boolean {
  return value.trim().length > 0 && optionalFiniteNumber(value) === undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function buildCustomMaterialId(name: string, existingMaterials: readonly MaterialDefinition[]): string {
  const base = `custom_${normalizeSlugPart(name) || "material"}`;
  if (!existingMaterials.some((material) => material.id === base) && !SEED_MATERIAL_IDS.has(base)) {
    return base;
  }

  let index = 2;
  while (existingMaterials.some((material) => material.id === `${base}_${index}`) || SEED_MATERIAL_IDS.has(`${base}_${index}`)) {
    index += 1;
  }

  return `${base}_${index}`;
}

export function isBuiltInMaterial(material: MaterialDefinition): boolean {
  return SEED_MATERIAL_IDS.has(material.id) && !isCustomWorkbenchMaterial(material);
}

export function createEmptyMaterialEditorDraft(): MaterialEditorDraft {
  return {
    absorberClass: "unknown",
    behavior: "rigid_mass",
    category: "mass",
    densityKgM3: "",
    dynamicStiffnessMNm3: "",
    flowResistivityPaSM2: "",
    id: null,
    lossFactor: "",
    name: "",
    notes: "",
    poissonRatio: "",
    porosity: "",
    propertySourceStatus: "user_supplied",
    tags: "",
    youngModulusPa: ""
  };
}

export function createMaterialEditorDraftFromMaterial(material: MaterialDefinition): MaterialEditorDraft {
  return {
    absorberClass: material.acoustic?.absorberClass ?? "unknown",
    behavior: material.acoustic?.behavior ?? "rigid_mass",
    category: material.category,
    densityKgM3: formatNumberDraft(material.densityKgM3),
    dynamicStiffnessMNm3: formatNumberDraft(material.impact?.dynamicStiffnessMNm3),
    flowResistivityPaSM2: formatNumberDraft(material.acoustic?.flowResistivityPaSM2),
    id: material.id,
    lossFactor: formatNumberDraft(material.acoustic?.lossFactor),
    name: material.name,
    notes: material.notes ?? material.acoustic?.notes.join("\n") ?? "",
    poissonRatio: formatNumberDraft(material.acoustic?.poissonRatio),
    porosity: formatNumberDraft(material.acoustic?.porosity),
    propertySourceStatus: material.acoustic?.propertySourceStatus ?? "user_supplied",
    tags: serializeTags(material.tags),
    youngModulusPa: formatNumberDraft(material.acoustic?.youngModulusPa)
  };
}

export function createSeedCopyDraft(material: MaterialDefinition, existingMaterials: readonly MaterialDefinition[]): MaterialEditorDraft {
  const draft = createMaterialEditorDraftFromMaterial(material);
  const nameBase = `${material.name} custom`;

  return {
    ...draft,
    id: null,
    name: existingMaterials.some((entry) => entry.name.trim().toLowerCase() === nameBase.toLowerCase()) ? `${nameBase} 2` : nameBase,
    propertySourceStatus: "user_supplied",
    tags: serializeTags([...material.tags, CUSTOM_COPY_TAG])
  };
}

export function validateMaterialEditorDraft(
  draft: MaterialEditorDraft,
  existingMaterials: readonly MaterialDefinition[],
  currentMaterialId: string | null = draft.id
): MaterialEditorDraftValidation {
  const errors: MaterialEditorDraftErrors = {};
  const warnings: MaterialEditorDraftWarnings = {};
  const name = draft.name.trim();

  if (!name) {
    errors.name = "Material name is required.";
  } else {
    const duplicateName = existingMaterials.find(
      (material) => material.id !== currentMaterialId && material.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (duplicateName) {
      errors.name = "A material with this name already exists.";
    }
  }

  const density = parseWorkbenchNumber(draft.densityKgM3);
  if (draft.densityKgM3.trim().length === 0) {
    errors.densityKgM3 = "Density is required.";
  } else if (typeof density !== "number" || !Number.isFinite(density) || density < 0) {
    errors.densityKgM3 = "Density must be zero or greater in kg/m3.";
  } else if (density === 0 && draft.category !== "gap" && draft.category !== "support") {
    errors.densityKgM3 = "Use density greater than zero unless this is a true gap or support layer.";
  }

  if (numberFieldHasInvalidValue(draft.flowResistivityPaSM2) || (draft.flowResistivityPaSM2.trim() && !optionalPositiveNumber(draft.flowResistivityPaSM2))) {
    errors.flowResistivityPaSM2 = "Flow resistivity must be a positive Pa.s/m2 value.";
  }

  if (numberFieldHasInvalidValue(draft.dynamicStiffnessMNm3) || (draft.dynamicStiffnessMNm3.trim() && !optionalPositiveNumber(draft.dynamicStiffnessMNm3))) {
    errors.dynamicStiffnessMNm3 = "Dynamic stiffness must be a positive MN/m3 value.";
  }

  if (numberFieldHasInvalidValue(draft.youngModulusPa) || (draft.youngModulusPa.trim() && !optionalPositiveNumber(draft.youngModulusPa))) {
    errors.youngModulusPa = "Young's modulus must be a positive Pa value.";
  }

  const poissonRatio = optionalFiniteNumber(draft.poissonRatio);
  if (draft.poissonRatio.trim() && (typeof poissonRatio !== "number" || poissonRatio < 0 || poissonRatio >= 0.5)) {
    errors.poissonRatio = "Poisson ratio must be at least 0 and less than 0.5.";
  }

  const lossFactor = optionalFiniteNumber(draft.lossFactor);
  if (draft.lossFactor.trim() && (typeof lossFactor !== "number" || lossFactor <= 0 || lossFactor > 1)) {
    errors.lossFactor = "Loss factor must be greater than 0 and no more than 1.";
  }

  const porosity = optionalFiniteNumber(draft.porosity);
  if (draft.porosity.trim() && (typeof porosity !== "number" || porosity < 0 || porosity > 1)) {
    errors.porosity = "Porosity must be between 0 and 1.";
  }

  if (draft.behavior === "porous_absorber" && !draft.flowResistivityPaSM2.trim()) {
    warnings.flowResistivityPaSM2 = "Porous absorber routes may need flow resistivity before calculation can proceed.";
  }

  if (draft.behavior === "resilient_layer" && !draft.dynamicStiffnessMNm3.trim()) {
    warnings.dynamicStiffnessMNm3 = "Impact routes may need dynamic stiffness before calculation can proceed.";
  }

  return { errors, warnings };
}

export function buildMaterialDefinitionFromDraft(input: {
  currentMaterialId?: string | null;
  draft: MaterialEditorDraft;
  existingMaterials: readonly MaterialDefinition[];
}): MaterialDefinition {
  const validation = validateMaterialEditorDraft(input.draft, input.existingMaterials, input.currentMaterialId ?? input.draft.id);

  if (Object.keys(validation.errors).length) {
    throw new Error("Cannot build invalid material definition.");
  }

  const densityKgM3 = parseWorkbenchNumber(input.draft.densityKgM3);
  if (typeof densityKgM3 !== "number" || !Number.isFinite(densityKgM3)) {
    throw new Error("Invalid material density.");
  }

  const flowResistivityPaSM2 = optionalPositiveNumber(input.draft.flowResistivityPaSM2);
  const youngModulusPa = optionalPositiveNumber(input.draft.youngModulusPa);
  const poissonRatio = optionalFiniteNumber(input.draft.poissonRatio);
  const lossFactor = optionalFiniteNumber(input.draft.lossFactor);
  const porosity = optionalFiniteNumber(input.draft.porosity);
  const dynamicStiffnessMNm3 = optionalPositiveNumber(input.draft.dynamicStiffnessMNm3);
  const tags = Array.from(new Set([CUSTOM_WORKBENCH_MATERIAL_TAG, input.draft.category, input.draft.behavior, ...splitTags(input.draft.tags)]));
  const acousticNotes = input.draft.notes
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);

  return MaterialDefinitionSchema.parse({
    acoustic: {
      absorberClass: input.draft.absorberClass,
      behavior: input.draft.behavior,
      flowResistivityPaSM2,
      lossFactor,
      notes: acousticNotes,
      poissonRatio,
      porosity,
      propertySourceStatus: input.draft.propertySourceStatus,
      youngModulusPa
    },
    category: input.draft.category,
    densityKgM3,
    id: input.currentMaterialId ?? input.draft.id ?? buildCustomMaterialId(input.draft.name, input.existingMaterials),
    impact: dynamicStiffnessMNm3 ? { dynamicStiffnessMNm3 } : undefined,
    name: input.draft.name.trim(),
    notes: compactLines(input.draft.notes, "Project custom material."),
    tags
  });
}

export function upsertCustomMaterial(
  customMaterials: readonly MaterialDefinition[],
  material: MaterialDefinition
): MaterialDefinition[] {
  const byId = new Map(customMaterials.map((entry) => [entry.id, entry]));
  byId.set(material.id, material);
  return Array.from(byId.values()).sort((left, right) => left.name.localeCompare(right.name, "en"));
}

export function removeCustomMaterial(
  customMaterials: readonly MaterialDefinition[],
  materialId: string
): MaterialDefinition[] {
  return customMaterials.filter((material) => material.id !== materialId);
}

export function buildResolvedMaterialCatalog(customMaterials: readonly MaterialDefinition[]): MaterialDefinition[] {
  return buildWorkbenchMaterialCatalog(customMaterials).sort((left, right) => left.name.localeCompare(right.name, "en"));
}

export function countMaterialUsage(layers: readonly LayerMaterialReference[], materialId: string): number {
  return layers.filter((layer) => layer.materialId === materialId).length;
}

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim();
  if (HEX_COLOR_PATTERN.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  if (!SHORT_HEX_COLOR_PATTERN.test(trimmed)) {
    return null;
  }

  const [, red, green, blue] = trimmed.toLowerCase();
  return `#${red}${red}${green}${green}${blue}${blue}`;
}

export function isValidMaterialVisualDraft(draft: MaterialVisualDraft): boolean {
  return [draft.fillColor, draft.sideColor, draft.strokeColor, draft.patternColor].every((value) => normalizeHexColor(value) !== null);
}

function getMaterialVisualDefaults(material: LayerVisualMaterial | null | undefined, override: MaterialVisualOverride | undefined): MaterialVisualDraft {
  const cue = override?.visualCue ?? (material ? getIllustrationMaterialCue(material) : "mass");
  return MATERIAL_VISUAL_DEFAULTS[cue];
}

export function createMaterialVisualDraft(
  override: MaterialVisualOverride | undefined,
  material?: LayerVisualMaterial | null
): MaterialVisualDraft {
  const defaults = getMaterialVisualDefaults(material, override);

  return {
    fillColor: override?.fillColor ?? defaults.fillColor,
    patternColor: override?.patternColor ?? defaults.patternColor,
    sideColor: override?.sideColor ?? defaults.sideColor,
    strokeColor: override?.strokeColor ?? defaults.strokeColor
  };
}

export function createDefaultMaterialVisualDraft(material?: LayerVisualMaterial | null): MaterialVisualDraft {
  return createMaterialVisualDraft(undefined, material);
}

function hexToRgb(value: string): { blue: number; green: number; red: number } | null {
  const normalized = normalizeHexColor(value);
  if (!normalized) {
    return null;
  }

  return {
    blue: Number.parseInt(normalized.slice(5, 7), 16),
    green: Number.parseInt(normalized.slice(3, 5), 16),
    red: Number.parseInt(normalized.slice(1, 3), 16)
  };
}

function toLinearSrgb(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function getRelativeLuminance(color: { blue: number; green: number; red: number }): number {
  return 0.2126 * toLinearSrgb(color.red) + 0.7152 * toLinearSrgb(color.green) + 0.0722 * toLinearSrgb(color.blue);
}

function getContrastRatio(left: string, right: string): number | null {
  const leftRgb = hexToRgb(left);
  const rightRgb = hexToRgb(right);
  if (!leftRgb || !rightRgb) {
    return null;
  }

  const leftLuminance = getRelativeLuminance(leftRgb);
  const rightLuminance = getRelativeLuminance(rightRgb);
  const lighter = Math.max(leftLuminance, rightLuminance);
  const darker = Math.min(leftLuminance, rightLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function getMaterialVisualReadabilityWarning(draft: MaterialVisualDraft): string | null {
  if (!isValidMaterialVisualDraft(draft)) {
    return null;
  }

  const fillStrokeContrast = getContrastRatio(draft.fillColor, draft.strokeColor);
  const fillPatternContrast = getContrastRatio(draft.fillColor, draft.patternColor);
  const fillSideContrast = getContrastRatio(draft.fillColor, draft.sideColor);

  if ((fillStrokeContrast ?? 0) < 1.35 && (fillPatternContrast ?? 0) < 1.35) {
    return "Fill, stroke, and pattern are too similar; layer edges may be hard to read.";
  }

  if ((fillSideContrast ?? 0) < 1.15 && (fillStrokeContrast ?? 0) < 1.6) {
    return "Fill and side colors are very close; stacked layers may blend together.";
  }

  return null;
}

export function buildMaterialVisualOverride(
  materialId: string,
  draft: MaterialVisualDraft,
  nowIso: string,
  defaults?: MaterialVisualDraft
): MaterialVisualOverride | null {
  const fillColor = normalizeHexColor(draft.fillColor);
  const sideColor = normalizeHexColor(draft.sideColor);
  const strokeColor = normalizeHexColor(draft.strokeColor);
  const patternColor = normalizeHexColor(draft.patternColor);

  if (!fillColor || !sideColor || !strokeColor || !patternColor) {
    throw new Error("Invalid material visual colors.");
  }

  const normalizedDefaults = defaults
    ? {
        fillColor: normalizeHexColor(defaults.fillColor),
        patternColor: normalizeHexColor(defaults.patternColor),
        sideColor: normalizeHexColor(defaults.sideColor),
        strokeColor: normalizeHexColor(defaults.strokeColor)
      }
    : null;
  const override: MaterialVisualOverride = {
    materialId,
    updatedAtIso: nowIso
  };

  if (!normalizedDefaults || fillColor !== normalizedDefaults.fillColor) override.fillColor = fillColor;
  if (!normalizedDefaults || sideColor !== normalizedDefaults.sideColor) override.sideColor = sideColor;
  if (!normalizedDefaults || strokeColor !== normalizedDefaults.strokeColor) override.strokeColor = strokeColor;
  if (!normalizedDefaults || patternColor !== normalizedDefaults.patternColor) override.patternColor = patternColor;

  return override.fillColor || override.sideColor || override.strokeColor || override.patternColor ? override : null;
}

export function upsertMaterialVisualOverride(
  overrides: readonly MaterialVisualOverride[],
  override: MaterialVisualOverride
): MaterialVisualOverride[] {
  const byId = new Map(overrides.map((entry) => [entry.materialId, entry]));
  byId.set(override.materialId, override);
  return Array.from(byId.values()).sort((left, right) => left.materialId.localeCompare(right.materialId, "en"));
}

export function removeMaterialVisualOverride(
  overrides: readonly MaterialVisualOverride[],
  materialId: string
): MaterialVisualOverride[] {
  return overrides.filter((override) => override.materialId !== materialId);
}

function parsePersistedCustomMaterials(input: unknown): {
  customMaterials: MaterialDefinition[];
  droppedCustomMaterials: number;
} {
  if (!Array.isArray(input)) {
    return { customMaterials: [], droppedCustomMaterials: 0 };
  }

  const customMaterials: MaterialDefinition[] = [];
  const seenIds = new Set<string>();
  let droppedCustomMaterials = 0;

  for (const entry of input) {
    const parsed = MaterialDefinitionSchema.safeParse(entry);

    if (!parsed.success || SEED_MATERIAL_IDS.has(parsed.data.id) || !isCustomWorkbenchMaterial(parsed.data) || seenIds.has(parsed.data.id)) {
      droppedCustomMaterials += 1;
      continue;
    }

    seenIds.add(parsed.data.id);
    customMaterials.push(parsed.data);
  }

  return {
    customMaterials: customMaterials.sort((left, right) => left.name.localeCompare(right.name, "en")),
    droppedCustomMaterials
  };
}

function parsePersistedVisualOverride(entry: unknown): MaterialVisualOverride | null {
  if (!isRecord(entry) || typeof entry.materialId !== "string" || !entry.materialId.trim() || typeof entry.updatedAtIso !== "string" || !entry.updatedAtIso.trim()) {
    return null;
  }

  const override: MaterialVisualOverride = {
    materialId: entry.materialId.trim(),
    updatedAtIso: entry.updatedAtIso.trim()
  };
  let hasVisualValue = false;
  const colorFields = ["fillColor", "patternColor", "sideColor", "strokeColor"] as const;

  for (const field of colorFields) {
    const value = entry[field];

    if (value === undefined) {
      continue;
    }

    if (typeof value !== "string") {
      return null;
    }

    const normalized = normalizeHexColor(value);
    if (!normalized) {
      return null;
    }

    override[field] = normalized;
    hasVisualValue = true;
  }

  if (entry.visualCue !== undefined) {
    if (typeof entry.visualCue !== "string" || !ILLUSTRATION_MATERIAL_CUES.has(entry.visualCue as IllustrationMaterialCue)) {
      return null;
    }

    override.visualCue = entry.visualCue as IllustrationMaterialCue;
    hasVisualValue = true;
  }

  return hasVisualValue ? override : null;
}

function parsePersistedVisualOverrides(input: unknown): {
  droppedVisualOverrides: number;
  materialVisualOverrides: MaterialVisualOverride[];
} {
  if (!Array.isArray(input)) {
    return { droppedVisualOverrides: 0, materialVisualOverrides: [] };
  }

  const materialVisualOverrides: MaterialVisualOverride[] = [];
  const seenIds = new Set<string>();
  let droppedVisualOverrides = 0;

  for (const entry of input) {
    const parsed = parsePersistedVisualOverride(entry);

    if (!parsed || seenIds.has(parsed.materialId)) {
      droppedVisualOverrides += 1;
      continue;
    }

    seenIds.add(parsed.materialId);
    materialVisualOverrides.push(parsed);
  }

  return {
    droppedVisualOverrides,
    materialVisualOverrides: materialVisualOverrides.sort((left, right) => left.materialId.localeCompare(right.materialId, "en"))
  };
}

export function parseMaterialEditorPersistedState(input: unknown): MaterialEditorPersistedStateParseResult {
  if (!isRecord(input)) {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      malformed: true,
      state: EMPTY_PERSISTED_MATERIAL_EDITOR_STATE
    };
  }

  const customMaterialsResult = parsePersistedCustomMaterials(input.customMaterials);
  const visualOverridesResult = parsePersistedVisualOverrides(input.materialVisualOverrides);

  return {
    droppedCustomMaterials: customMaterialsResult.droppedCustomMaterials,
    droppedVisualOverrides: visualOverridesResult.droppedVisualOverrides,
    malformed: false,
    state: {
      customMaterials: customMaterialsResult.customMaterials,
      materialVisualOverrides: visualOverridesResult.materialVisualOverrides
    }
  };
}

export function serializeMaterialEditorPersistedState(state: MaterialEditorPersistedState): string {
  return JSON.stringify({
    customMaterials: state.customMaterials,
    materialVisualOverrides: state.materialVisualOverrides
  });
}
