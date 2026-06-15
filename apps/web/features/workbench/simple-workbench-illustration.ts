import type { MaterialCategory, MaterialDefinition } from "@dynecho/shared";

export type LayerVisualMaterial = Pick<MaterialDefinition, "category" | "id" | "name" | "tags"> &
  Partial<Pick<MaterialDefinition, "acoustic" | "densityKgM3" | "impact">>;

export type IllustrationAxis = "floor" | "wall" | "proposalFloor" | "proposalWall";
export type IllustrationMaterialCue =
  | "board"
  | "cavity"
  | "concrete"
  | "fiber"
  | "mass"
  | "masonry"
  | "plaster"
  | "resilient"
  | "steel_support"
  | "support"
  | "surface"
  | "timber"
  | "timber_support";

export type IllustrationThresholds = {
  basePxPerMm: number;
  maxLayerPx: number;
  maxTotalPx: number;
  minLayerPx: number;
  minTotalPx: number;
};

export type IllustrationAllocation = {
  clampedTo: "max" | "min" | null;
  share: number;
  sizePx: number;
  thicknessMm: number;
};

const DEFAULT_FALLBACK_THICKNESS_MM = 10;
const PERCEPTUAL_THICKNESS_EXPONENT = 0.65;

const ILLUSTRATION_PRESETS: Record<IllustrationAxis, IllustrationThresholds> = {
  floor: {
    basePxPerMm: 1.05,
    maxLayerPx: 96,
    maxTotalPx: 360,
    minLayerPx: 24,
    minTotalPx: 216
  },
  wall: {
    basePxPerMm: 1.08,
    maxLayerPx: 126,
    maxTotalPx: 440,
    minLayerPx: 24,
    minTotalPx: 240
  },
  proposalFloor: {
    basePxPerMm: 0.92,
    maxLayerPx: 82,
    maxTotalPx: 280,
    minLayerPx: 18,
    minTotalPx: 160
  },
  proposalWall: {
    basePxPerMm: 0.92,
    maxLayerPx: 108,
    maxTotalPx: 320,
    minLayerPx: 18,
    minTotalPx: 168
  }
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeThickness(thicknessMm: number | null | undefined) {
  return typeof thicknessMm === "number" && Number.isFinite(thicknessMm) && thicknessMm > 0
    ? thicknessMm
    : DEFAULT_FALLBACK_THICKNESS_MM;
}

function getPerceptualThicknessWeight(thicknessMm: number) {
  return Math.pow(thicknessMm, PERCEPTUAL_THICKNESS_EXPONENT);
}

function solveBoundedAxis(input: readonly number[], preset: IllustrationThresholds): number[] {
  const normalized = input.map((value) => normalizeThickness(value));
  const desiredTotal = normalized.reduce((sum, value) => sum + value, 0) * preset.basePxPerMm;
  const feasibleMinimum = normalized.length * preset.minLayerPx;
  const feasibleMaximum = normalized.length * preset.maxLayerPx;
  const minimumTotal = Math.max(preset.minTotalPx, feasibleMinimum);
  const maximumTotal = Math.min(preset.maxTotalPx, feasibleMaximum);
  const targetTotal = minimumTotal > maximumTotal ? feasibleMinimum : clamp(desiredTotal, minimumTotal, maximumTotal);

  const sizes = new Array<number>(normalized.length).fill(0);
  const locked = new Array<boolean>(normalized.length).fill(false);
  let remainingTarget = targetTotal;

  while (true) {
    const openIndexes = normalized.flatMap((value, index) => (locked[index] ? [] : [{ index, value }]));

    if (openIndexes.length === 0) {
      break;
    }

    const remainingWeight = openIndexes.reduce((sum, entry) => sum + getPerceptualThicknessWeight(entry.value), 0);

    if (remainingWeight <= 0 || remainingTarget <= 0) {
      const evenSize = remainingTarget > 0 ? remainingTarget / openIndexes.length : preset.minLayerPx;
      for (const entry of openIndexes) {
        sizes[entry.index] = clamp(evenSize, preset.minLayerPx, preset.maxLayerPx);
      }
      break;
    }

    let constrainedThisPass = false;
    const constraints: Array<{ index: number; sizePx: number }> = [];

    for (const entry of openIndexes) {
      const proposed = (getPerceptualThicknessWeight(entry.value) / remainingWeight) * remainingTarget;

      if (proposed < preset.minLayerPx) {
        constraints.push({ index: entry.index, sizePx: preset.minLayerPx });
        constrainedThisPass = true;
      } else if (proposed > preset.maxLayerPx) {
        constraints.push({ index: entry.index, sizePx: preset.maxLayerPx });
        constrainedThisPass = true;
      }
    }

    for (const constraint of constraints) {
      sizes[constraint.index] = constraint.sizePx;
      locked[constraint.index] = true;
      remainingTarget -= constraint.sizePx;
    }

    if (!constrainedThisPass) {
      for (const entry of openIndexes) {
        sizes[entry.index] = (getPerceptualThicknessWeight(entry.value) / remainingWeight) * remainingTarget;
      }
      break;
    }
  }

  return sizes.map((size) => Math.round(size * 10) / 10);
}

export function getIllustrationThresholds(axis: IllustrationAxis): IllustrationThresholds {
  return ILLUSTRATION_PRESETS[axis];
}

export function formatIllustrationClampLabel(axis: IllustrationAxis): string {
  const preset = getIllustrationThresholds(axis);
  return `${preset.minLayerPx}-${preset.maxLayerPx} px preview clamp`;
}

export function distributeIllustrationSizes(
  thicknessesMm: readonly (number | null | undefined)[],
  axis: IllustrationAxis
): IllustrationAllocation[] {
  const normalized = thicknessesMm.map((value) => normalizeThickness(value));
  const resolved = solveBoundedAxis(normalized, getIllustrationThresholds(axis));
  const total = resolved.reduce((sum, value) => sum + value, 0) || 1;
  const preset = getIllustrationThresholds(axis);

  return resolved.map((sizePx, index) => ({
    clampedTo: sizePx <= preset.minLayerPx ? "min" : sizePx >= preset.maxLayerPx ? "max" : null,
    share: sizePx / total,
    sizePx,
    thicknessMm: normalized[index]!
  }));
}

export function parseIllustrationThicknessMm(value: string | null | undefined): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const match = value.match(/-?\d+(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function inferVisualCategory(text: string): MaterialCategory {
  if (/(gap|void|cavity|air\s*space)/u.test(text)) {
    return "gap";
  }

  if (/(insulation|wool|foam|resilient|underlay|mat|rubber|felt)/u.test(text)) {
    return "insulation";
  }

  if (/(support|stud|track|joist|frame|channel|batten|rail)/u.test(text)) {
    return "support";
  }

  if (/(finish|board|plaster|render|lining|facing|covering|screed|deck|vinyl|carpet|tile|timber)/u.test(text)) {
    return "finish";
  }

  return "mass";
}

export function createIllustrationMaterial(input: {
  categoryLabel?: string;
  label: string;
  metaLabel?: string;
}): LayerVisualMaterial {
  const descriptor = [input.categoryLabel, input.metaLabel, input.label].filter(Boolean).join(" ").toLowerCase();
  return {
    category: inferVisualCategory(descriptor),
    id: input.label.toLowerCase().replace(/[^a-z0-9]+/gu, "_").replace(/^_|_$/gu, "") || "illustration_layer",
    name: input.label,
    tags: [input.categoryLabel, input.metaLabel].filter((value): value is string => Boolean(value)).map((value) => value.toLowerCase())
  };
}

export function getIllustrationMaterialCue(material: LayerVisualMaterial): IllustrationMaterialCue {
  const text = [material.id, material.name, material.acoustic?.behavior, material.acoustic?.absorberClass, ...material.tags]
    .join(" ")
    .toLowerCase();

  if (material.category === "gap" || material.acoustic?.behavior === "air_cavity") return "cavity";
  if (material.acoustic?.behavior === "mass_timber" || /(timber|wood|plywood|osb|clt|joist|batten|particleboard|chipboard|laminate)/u.test(text)) {
    return material.category === "support" ? "timber_support" : "timber";
  }
  if (/(steel|metal|stud|track|channel|rail|furring|hanger)/u.test(text)) return "steel_support";
  if (
    material.acoustic?.behavior === "resilient_layer" ||
    material.impact?.dynamicStiffnessMNm3 ||
    /(resilient|underlay|mat|rubber|foam|felt|afm|regupol|geniemat|eps|cork|carpet|vinyl|membrane|barrier|bitumen)/u.test(text)
  ) {
    return "resilient";
  }
  if (
    material.acoustic?.behavior === "porous_absorber" ||
    material.acoustic?.absorberClass === "porous_absorptive" ||
    /(mineral\s*wool|rock\s*wool|rockwool|glass\s*wool|glasswool|cavity-fill|porous)/u.test(text)
  ) {
    return "fiber";
  }
  if (/(plaster|render|skim|coat)/u.test(text)) return "plaster";
  if (/(gypsum|sheetrock|board|plasterboard|fiberboard|silentboard|diamond|akv|inex|cement[_\s-]*board|firestop|impactstop)/u.test(text)) return "board";
  if (/(aac|aircrete|ytong|celcon|masonry|brick|block|porotherm|he?luz|silka|silicate|pumice|bims|tile|porcelain|ceramic|stone|marble|granite)/u.test(text)) return "masonry";
  if (/(concrete|cement|screed|anhydrite|mineral|aggregate|chipping|gravel|fill)/u.test(text)) return "concrete";
  if (typeof material.densityKgM3 === "number" && material.densityKgM3 >= 1600 && material.category === "mass") return "concrete";
  if (material.category === "support") return "support";
  if (material.category === "insulation") return "fiber";
  if (material.category === "finish") return "surface";
  return "mass";
}
