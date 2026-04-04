import { MATERIAL_CATALOG_SEED } from "@dynecho/catalogs";
import type { AirborneContext, FloorRole, ImpactFieldContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";

import type { StudyMode } from "./preset-definitions";
import { parseWorkbenchNumber } from "./parse-number";
import { getWorkbenchMaterialById } from "./workbench-materials";
import type { LayerDraft } from "./workbench-store";

type GuidedSanityBand = {
  max: number;
  min: number;
  unit: string;
};

type LayerThicknessGuidance = {
  band: GuidedSanityBand;
  subject: string;
};

export const GUIDED_INPUT_SANITY_BANDS = {
  fieldKDb: { max: 20, min: -15, unit: "dB" },
  layerThicknessMm: { max: 1000, min: 0.5, unit: "mm" },
  panelHeightMm: { max: 6000, min: 1500, unit: "mm" },
  panelWidthMm: { max: 15000, min: 1500, unit: "mm" },
  receivingRoomRt60S: { max: 5, min: 0.2, unit: "s" },
  receivingRoomVolumeM3: { max: 1000, min: 5, unit: "m³" }
} as const satisfies Record<string, GuidedSanityBand>;

const LAYER_ROLE_THICKNESS_BANDS: Partial<Record<FloorRole, GuidedSanityBand>> = {
  base_structure: { max: 450, min: 60, unit: "mm" },
  ceiling_board: { max: 32, min: 10, unit: "mm" },
  ceiling_cavity: { max: 180, min: 15, unit: "mm" },
  ceiling_fill: { max: 200, min: 20, unit: "mm" },
  floating_screed: { max: 90, min: 18, unit: "mm" },
  floor_covering: { max: 30, min: 2, unit: "mm" },
  resilient_layer: { max: 40, min: 2, unit: "mm" },
  upper_fill: { max: 180, min: 25, unit: "mm" }
};

const MATERIAL_THICKNESS_BANDS: Record<string, GuidedSanityBand> = {
  aac: { max: 300, min: 75, unit: "mm" },
  air_gap: { max: 200, min: 15, unit: "mm" },
  anhydrite_screed: { max: 90, min: 25, unit: "mm" },
  bitumen_membrane: { max: 8, min: 2, unit: "mm" },
  cellulose_fill: { max: 200, min: 50, unit: "mm" },
  ceramic_tile: { max: 20, min: 4, unit: "mm" },
  cement_board: { max: 20, min: 10, unit: "mm" },
  clt_panel: { max: 300, min: 100, unit: "mm" },
  composite_steel_deck: { max: 250, min: 120, unit: "mm" },
  concrete: { max: 250, min: 80, unit: "mm" },
  dry_floating_gypsum_fiberboard: { max: 35, min: 18, unit: "mm" },
  eps_underlay: { max: 8, min: 2, unit: "mm" },
  fire_board: { max: 25, min: 15, unit: "mm" },
  glasswool_board: { max: 120, min: 20, unit: "mm" },
  generic_fill: { max: 150, min: 30, unit: "mm" },
  generic_resilient_underlay: { max: 30, min: 3, unit: "mm" },
  generic_resilient_underlay_s30: { max: 30, min: 3, unit: "mm" },
  genieclip_rst: { max: 180, min: 15, unit: "mm" },
  geniemat_rst02: { max: 20, min: 2, unit: "mm" },
  geniemat_rst05: { max: 20, min: 2, unit: "mm" },
  geniemat_rst12: { max: 20, min: 2, unit: "mm" },
  glasswool: { max: 200, min: 20, unit: "mm" },
  heavy_concrete: { max: 300, min: 100, unit: "mm" },
  high_density_rockwool: { max: 150, min: 20, unit: "mm" },
  hollow_core_plank: { max: 400, min: 120, unit: "mm" },
  inex_floor_panel: { max: 35, min: 18, unit: "mm" },
  laminate_flooring: { max: 14, min: 6, unit: "mm" },
  lightweight_concrete: { max: 250, min: 80, unit: "mm" },
  lightweight_steel_floor: { max: 350, min: 160, unit: "mm" },
  lime_plaster: { max: 25, min: 5, unit: "mm" },
  mlv: { max: 10, min: 2, unit: "mm" },
  mw_t_impact_layer: { max: 40, min: 3, unit: "mm" },
  mw_t_impact_layer_s35: { max: 40, min: 3, unit: "mm" },
  mw_t_impact_layer_s40: { max: 40, min: 3, unit: "mm" },
  mw_t_impact_layer_s6: { max: 40, min: 3, unit: "mm" },
  open_box_timber_slab: { max: 350, min: 120, unit: "mm" },
  open_web_steel_floor: { max: 450, min: 180, unit: "mm" },
  osb: { max: 30, min: 12, unit: "mm" },
  particleboard_flooring: { max: 30, min: 18, unit: "mm" },
  pet_felt: { max: 25, min: 3, unit: "mm" },
  plywood: { max: 30, min: 12, unit: "mm" },
  regupol_sonus_curve_8: { max: 20, min: 4, unit: "mm" },
  regupol_sonus_multi_4_5: { max: 12, min: 3, unit: "mm" },
  resilient_channel: { max: 180, min: 15, unit: "mm" },
  rockwool: { max: 200, min: 20, unit: "mm" },
  screed: { max: 90, min: 25, unit: "mm" },
  sheetrock_one: { max: 13, min: 9, unit: "mm" },
  solid_brick: { max: 300, min: 75, unit: "mm" },
  steel_joist_floor: { max: 350, min: 180, unit: "mm" },
  timber_frame_floor: { max: 300, min: 120, unit: "mm" },
  timber_joist_floor: { max: 350, min: 150, unit: "mm" },
  ubiq_resilient_ceiling: { max: 180, min: 15, unit: "mm" },
  vinyl_flooring: { max: 8, min: 2, unit: "mm" },
  wood_wool_panel: { max: 40, min: 15, unit: "mm" },
  wf_t_impact_layer_s102: { max: 50, min: 10, unit: "mm" }
};

const MATERIAL_TAG_THICKNESS_BANDS: ReadonlyArray<{
  band: GuidedSanityBand;
  tags: readonly string[];
}> = [
  { band: { max: 25, min: 2, unit: "mm" }, tags: ["plaster"] },
  { band: { max: 25, min: 10, unit: "mm" }, tags: ["board"] },
  { band: { max: 40, min: 2, unit: "mm" }, tags: ["resilient"] },
  { band: { max: 180, min: 15, unit: "mm" }, tags: ["ceiling-support", "cavity"] },
  { band: { max: 350, min: 50, unit: "mm" }, tags: ["block", "masonry"] },
  { band: { max: 450, min: 80, unit: "mm" }, tags: ["structural"] }
];

const MATERIAL_CATEGORY_THICKNESS_BANDS: Partial<Record<MaterialDefinition["category"], GuidedSanityBand>> = {
  finish: { max: 30, min: 2, unit: "mm" },
  gap: { max: 200, min: 15, unit: "mm" },
  insulation: { max: 200, min: 20, unit: "mm" },
  mass: { max: 450, min: 40, unit: "mm" },
  support: { max: 120, min: 2, unit: "mm" }
};

const FIELD_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A", "DnT,A,k"]);
const FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]);
const STANDARDIZED_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["DnT,w", "DnT,A", "DnT,A,k"]);
const STANDARDIZED_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'nT,w", "L'nT,50", "LnT,A"]);
const PLASTER_LIKE_FLOOR_COVER_TAGS = ["plaster", "render", "masonry-finish"] as const;

function formatBandValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function parseFiniteNumber(value: number | string | null | undefined): number | undefined {
  return parseWorkbenchNumber(value);
}

function formatFloorRoleLabel(floorRole: FloorRole): string {
  return floorRole.replaceAll("_", " ");
}

function buildLayerThicknessGuidance(band: GuidedSanityBand, subject: string): LayerThicknessGuidance {
  return { band, subject };
}

function getMaterialThicknessGuidance(
  material: MaterialDefinition,
  floorRole?: FloorRole
): LayerThicknessGuidance | null {
  const explicitBand = MATERIAL_THICKNESS_BANDS[material.id];
  const subject = floorRole ? `${material.name} in the ${formatFloorRoleLabel(floorRole)} role` : material.name;

  if (explicitBand) {
    return buildLayerThicknessGuidance(explicitBand, subject);
  }

  const tagBand = MATERIAL_TAG_THICKNESS_BANDS.find((entry) => entry.tags.some((tag) => material.tags.includes(tag)))?.band;
  if (tagBand) {
    return buildLayerThicknessGuidance(tagBand, subject);
  }

  const categoryBand = MATERIAL_CATEGORY_THICKNESS_BANDS[material.category];
  return categoryBand ? buildLayerThicknessGuidance(categoryBand, subject) : null;
}

export function getLayerThicknessGuidance(
  row: Pick<LayerDraft, "floorRole" | "materialId">,
  materials: readonly MaterialDefinition[] = MATERIAL_CATALOG_SEED
): LayerThicknessGuidance {
  const customMaterials = materials === MATERIAL_CATALOG_SEED ? [] : materials;
  const material = getWorkbenchMaterialById(row.materialId, customMaterials);
  const materialGuidance = material ? getMaterialThicknessGuidance(material, row.floorRole) : null;
  if (materialGuidance) {
    return materialGuidance;
  }

  if (row.floorRole) {
    const roleBand = LAYER_ROLE_THICKNESS_BANDS[row.floorRole];
    if (roleBand) {
      return buildLayerThicknessGuidance(roleBand, `${formatFloorRoleLabel(row.floorRole)} rows`);
    }
  }

  return buildLayerThicknessGuidance(GUIDED_INPUT_SANITY_BANDS.layerThicknessMm, "this layer");
}

export function getLayerThicknessGuidanceHint(
  row: Pick<LayerDraft, "floorRole" | "materialId">,
  materials: readonly MaterialDefinition[] = MATERIAL_CATALOG_SEED
): string | null {
  const guidance = getLayerThicknessGuidance(row, materials);
  return guidance.subject === "this layer" ? null : `Typical band ${formatGuidedSanityBand(guidance.band)} for ${guidance.subject}.`;
}

export function formatGuidedSanityBand(band: GuidedSanityBand): string {
  return `${formatBandValue(band.min)} to ${formatBandValue(band.max)} ${band.unit}`;
}

export function getGuidedNumericSanityWarning(input: {
  band: GuidedSanityBand;
  label: string;
  suffix?: string;
  value: number | string | null | undefined;
}): string | null {
  const parsed = parseFiniteNumber(input.value);
  if (typeof parsed !== "number") {
    return null;
  }

  if (parsed >= input.band.min && parsed <= input.band.max) {
    return null;
  }

  return `${input.label} ${formatBandValue(parsed)} ${input.band.unit} is outside the guided sanity band of ${formatGuidedSanityBand(input.band)}.${input.suffix ? ` ${input.suffix}` : ""}`;
}

export function getLayerThicknessSanityWarning(
  row: Pick<LayerDraft, "floorRole" | "materialId" | "thicknessMm">,
  layerIndex: number,
  materials: readonly MaterialDefinition[] = MATERIAL_CATALOG_SEED
): string | null {
  const parsed = parseFiniteNumber(row.thicknessMm);
  if (typeof parsed !== "number" || parsed <= 0) {
    return null;
  }

  const guidance = getLayerThicknessGuidance(row, materials);
  if (parsed >= guidance.band.min && parsed <= guidance.band.max) {
    return null;
  }

  return `Layer ${layerIndex} thickness ${formatBandValue(parsed)} mm is outside the guided sanity band of ${formatGuidedSanityBand(guidance.band)} for ${guidance.subject}. Check units, role assignment, or split the build-up into separate layers if needed.`;
}

function getFloorCoverRoleSanityWarning(input: {
  hasBaseStructure: boolean;
  materialId: string;
  materials: readonly MaterialDefinition[];
}): string | null {
  const customMaterials = input.materials === MATERIAL_CATALOG_SEED ? [] : input.materials;
  const material = getWorkbenchMaterialById(input.materialId, customMaterials);

  if (!material) {
    return null;
  }

  const isPlasterLikeFloorFinish = PLASTER_LIKE_FLOOR_COVER_TAGS.some((tag) => material.tags.includes(tag));

  if (!isPlasterLikeFloorFinish) {
    return null;
  }

  if (!input.hasBaseStructure) {
    return `${material.name} is tagged as a plaster or masonry finish but is currently assigned to the floor covering role with no base structure in the stack. DynEcho will keep the run live as a broad screening estimate only; add the structural floor or switch to a tested floor-cover path before trusting impact outputs.`;
  }

  return `${material.name} is tagged as a plaster or masonry finish but is currently assigned to the floor covering role. DynEcho will keep the run live, but this is not treated like a validated trafficable floor cover. Recheck the role assignment or switch to a tested floor build-up before trusting impact outputs.`;
}

export function collectScenarioInputWarnings(input: {
  airborneContext?: AirborneContext | null;
  impactFieldContext?: ImpactFieldContext | null;
  materials?: readonly MaterialDefinition[];
  normalizedLayers?: readonly LayerInput[];
  rows: readonly LayerDraft[];
  studyMode: StudyMode;
  targetOutputs?: readonly RequestedOutputId[];
}): string[] {
  const warnings: string[] = [];
  const requestedOutputs = input.targetOutputs ?? [];
  const fieldAirborneRequested =
    input.airborneContext?.contextMode !== "element_lab" &&
    requestedOutputs.some((output) => FIELD_AIRBORNE_OUTPUTS.has(output));
  const standardizedAirborneRequested =
    fieldAirborneRequested && requestedOutputs.some((output) => STANDARDIZED_AIRBORNE_OUTPUTS.has(output));
  const fieldImpactRequested = input.studyMode === "floor" && requestedOutputs.some((output) => FIELD_IMPACT_OUTPUTS.has(output));
  const standardizedImpactRequested =
    fieldImpactRequested && requestedOutputs.some((output) => STANDARDIZED_IMPACT_OUTPUTS.has(output));
  const materials = input.materials ?? MATERIAL_CATALOG_SEED;
  const thicknessWarningLayers =
    input.normalizedLayers ??
    input.rows.map((row) => ({
      floorRole: row.floorRole,
      materialId: row.materialId,
      thicknessMm: parseFiniteNumber(row.thicknessMm) ?? Number.NaN
    }));
  const hasBaseStructure = thicknessWarningLayers.some((layer) => layer.floorRole === "base_structure");

  thicknessWarningLayers.forEach((layer, index) => {
    const warning = getLayerThicknessSanityWarning(
      {
        floorRole: layer.floorRole,
        materialId: layer.materialId,
        thicknessMm: String(layer.thicknessMm)
      },
      index + 1,
      materials
    );
    if (warning) {
      warnings.push(warning);
    }
  });

  if (input.studyMode === "floor") {
    const floorCoverRoleWarnings = Array.from(
      new Set(
        thicknessWarningLayers
          .filter((layer) => layer.floorRole === "floor_covering")
          .map((layer) =>
            getFloorCoverRoleSanityWarning({
              hasBaseStructure,
              materialId: layer.materialId,
              materials
            })
          )
          .filter((warning): warning is string => Boolean(warning))
      )
    );

    warnings.push(...floorCoverRoleWarnings);

    const hasCeilingBoard = thicknessWarningLayers.some((layer) => layer.floorRole === "ceiling_board");
    const hasCeilingSideSupport = thicknessWarningLayers.some(
      (layer) => layer.floorRole === "ceiling_cavity" || layer.floorRole === "ceiling_fill"
    );

    if (hasCeilingSideSupport && !hasCeilingBoard) {
      warnings.push(
        "Ceiling-side support or fill layers are present without any ceiling board. DynEcho keeps the lower-treatment lane inactive, so these products may not change the result until at least one ceiling board is added."
      );
    }
  }

  if (fieldAirborneRequested) {
    const panelWidthWarning = getGuidedNumericSanityWarning({
      band: GUIDED_INPUT_SANITY_BANDS.panelWidthMm,
      label: "Partition width",
      suffix: "Check that the value is in millimetres.",
      value: input.airborneContext?.panelWidthMm
    });
    if (panelWidthWarning) {
      warnings.push(panelWidthWarning);
    }

    const panelHeightWarning = getGuidedNumericSanityWarning({
      band: GUIDED_INPUT_SANITY_BANDS.panelHeightMm,
      label: "Partition height",
      suffix: "Check that the value is in millimetres.",
      value: input.airborneContext?.panelHeightMm
    });
    if (panelHeightWarning) {
      warnings.push(panelHeightWarning);
    }
  }

  if (standardizedAirborneRequested) {
    const airborneVolumeWarning = getGuidedNumericSanityWarning({
      band: GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3,
      label: "Receiving-room volume",
      suffix: "Check that the value reflects the real receiving space.",
      value: input.airborneContext?.receivingRoomVolumeM3
    });
    if (airborneVolumeWarning) {
      warnings.push(airborneVolumeWarning);
    }

    const rt60Warning = getGuidedNumericSanityWarning({
      band: GUIDED_INPUT_SANITY_BANDS.receivingRoomRt60S,
      label: "RT60",
      suffix: "Recheck the measurement or assumption before trusting a standardized field read.",
      value: input.airborneContext?.receivingRoomRt60S
    });
    if (rt60Warning) {
      warnings.push(rt60Warning);
    }
  }

  if (fieldImpactRequested) {
    const kWarning = getGuidedNumericSanityWarning({
      band: GUIDED_INPUT_SANITY_BANDS.fieldKDb,
      label: "Field K correction",
      suffix: "Recheck the correction source before trusting carried field impact values.",
      value: input.impactFieldContext?.fieldKDb
    });
    if (kWarning) {
      warnings.push(kWarning);
    }
  }

  if (standardizedImpactRequested) {
    const impactVolumeWarning = getGuidedNumericSanityWarning({
      band: GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3,
      label: "Impact receiving-room volume",
      suffix: "Check that the value reflects the receiving room used for field standardization.",
      value: input.impactFieldContext?.receivingRoomVolumeM3
    });
    if (impactVolumeWarning) {
      warnings.push(impactVolumeWarning);
    }
  }

  return warnings;
}
