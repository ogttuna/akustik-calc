import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  FloorSystemEstimateMatch,
  LayerInput,
  MaterialDefinition
} from "@dynecho/shared";
import { ImpactPredictorInputSchema, LayerInputSchema, type ImpactPredictorInput } from "@dynecho/shared";

import { hasInvalidExplicitFloorBaseStructure } from "./floor-base-structure-eligibility";
import {
  collectCeilingBoardTopologyConflict,
  collectSingleEntryRoleConflicts,
  hasAmbiguousSingleEntryRoleTopology,
  type CeilingBoardTopologyConflict,
  type SingleEntryRoleConflict
} from "./floor-role-topology";
import {
  layersMatchPackedThicknessSchedule,
  matchesPackedThicknessSchedule
} from "./ceiling-board-thickness-schedule";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import {
  inferBaseSlabMaterialClassFromMaterial,
  inferStructuralSupportTypeFromMaterial,
  inferSupportFormFromMaterial
} from "./structural-material-classification";
import { isHeavyConcreteCarrierDensityEligible } from "./heavy-concrete-carrier-eligibility";

export type PredictorAdaptation = {
  catalogAdditions: readonly MaterialDefinition[];
  notes: readonly string[];
  officialFloorSystemId: string | null;
  sourceLayers: readonly LayerInput[];
};

type BuildImpactPredictorLayerInput = LayerInput & {
  category?: string;
  density?: number;
  materialName?: string;
};

type BuildImpactPredictorAssemblyMeta = {
  contextMode?: string;
};

type PredictorRoleConflict = SingleEntryRoleConflict | CeilingBoardTopologyConflict;

type ResolvedLayerStackEntry = LayerInput & {
  material: MaterialDefinition;
};

const PRODUCT_ID_TO_MATERIAL_ID: Record<string, string> = {
  getzner_afm_21: "getzner_afm_21",
  getzner_afm_23: "getzner_afm_23",
  getzner_afm_26: "getzner_afm_26",
  getzner_afm_29: "getzner_afm_29",
  getzner_afm_33: "getzner_afm_33",
  getzner_afm_35: "getzner_afm_35",
  regupol_sonus_curve_8: "regupol_sonus_curve_8",
  regupol_sonus_multi_4_5: "regupol_sonus_multi_4_5"
};

const PREDICTOR_THICKNESS_TOLERANCE_MM = 2;
const PREDICTOR_DENSITY_TOLERANCE_KG_M3 = 200;
const CEILING_CAVITY_MATERIAL_IDS = new Set([
  "acoustic_hanger_ceiling",
  "air_gap",
  "furring_channel",
  "genieclip_rst",
  "resilient_channel",
  "resilient_stud_ceiling",
  "tuas_open_box_ceiling_family_a",
  "ubiq_resilient_ceiling"
]);
const RESILIENT_LAYER_MATERIAL_IDS = new Set([
  "eps_underlay",
  "generic_resilient_underlay",
  "generic_resilient_underlay_s30",
  "geniemat_rst02",
  "geniemat_rst05",
  "geniemat_rst12",
  "getzner_afm_21",
  "getzner_afm_23",
  "getzner_afm_26",
  "getzner_afm_29",
  "getzner_afm_33",
  "getzner_afm_35",
  "mw_t_impact_layer",
  "mw_t_impact_layer_s35",
  "mw_t_impact_layer_s40",
  "mw_t_impact_layer_s6",
  "regupol_sonus_curve_8",
  "regupol_sonus_multi_4_5",
  "wf_t_impact_layer_s102"
]);
const FLOATING_SCREED_MATERIAL_IDS = new Set(["inex_floor_panel", "screed"]);
const UPPER_FILL_MATERIAL_IDS = new Set([
  "bonded_chippings",
  "elastic_bonded_fill",
  "eps_floor_insulation_board",
  "generic_fill",
  "non_bonded_chippings"
]);
const CEILING_BOARD_MATERIAL_IDS = new Set(["firestop_board", "gypsum_board", "impactstop_board"]);
const BASE_STRUCTURE_HINT_MATERIAL_IDS = new Set([
  "clt_panel",
  "composite_steel_deck",
  "concrete",
  "engineered_timber_structural",
  "hollow_core_plank",
  "lightweight_steel_floor",
  "open_box_timber_slab",
  "open_web_steel_floor",
  "open_web_steel_joist",
  "solid_wood",
  "steel_deck_composite",
  "steel_joist_floor",
  "timber_frame_floor",
  "timber_joist_floor"
]);
const SAFE_BARE_BASE_ROLE_INFERENCE_MATERIAL_IDS = new Set([
  "clt_panel",
  "composite_steel_deck",
  "concrete",
  "hollow_core_plank",
  "steel_deck_composite"
]);
const FLOOR_ROLE_INFERENCE_EVIDENCE_ROLES = new Set<NonNullable<LayerInput["floorRole"]>>([
  "ceiling_board",
  "ceiling_cavity",
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "upper_fill"
]);
const FLOOR_ROLE_INFERENCE_HINT_MATERIAL_IDS = new Set([
  ...CEILING_BOARD_MATERIAL_IDS,
  ...CEILING_CAVITY_MATERIAL_IDS,
  ...RESILIENT_LAYER_MATERIAL_IDS,
  ...FLOATING_SCREED_MATERIAL_IDS,
  ...UPPER_FILL_MATERIAL_IDS,
  "carpet_with_foam_underlay",
  "ceramic_tile",
  "dry_floating_gypsum_fiberboard",
  "engineered_timber_flooring",
  "engineered_timber_with_acoustic_underlay",
  "gypsum_fiberboard",
  "laminate_flooring",
  "particleboard_flooring",
  "porcelain_tile",
  "vinyl_flooring"
]);
const MERGE_SAFE_IMPACT_LAYER_ROLES = new Set<NonNullable<LayerInput["floorRole"]>>([
  "base_structure",
  "ceiling_fill",
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "upper_fill"
]);
const CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM = 0.1;

function hasUpperFloorRoleEvidence(
  layers: readonly Pick<LayerInput, "floorRole">[]
): boolean {
  return layers.some(
    (layer) =>
      layer.floorRole === "floating_screed" ||
      layer.floorRole === "floor_covering" ||
      layer.floorRole === "resilient_layer" ||
      layer.floorRole === "upper_fill"
  );
}

function hasLowerFloorRoleEvidence(
  layers: readonly Pick<LayerInput, "floorRole">[]
): boolean {
  return layers.some(
    (layer) =>
      layer.floorRole === "ceiling_board" ||
      layer.floorRole === "ceiling_cavity" ||
      layer.floorRole === "ceiling_fill"
  );
}

function hasMassTimberCombinedMultiEntryFloatingScreedVisibleStack(
  rawLayers: readonly Pick<LayerInput, "floorRole">[],
  normalizedLayers: readonly ResolvedLayerStackEntry[]
): boolean {
  if (rawLayers.filter((layer) => layer.floorRole === "floating_screed").length <= 1) {
    return false;
  }

  if (!hasLowerFloorRoleEvidence(normalizedLayers)) {
    return false;
  }

  const baseStructureLayer = normalizedLayers.find((layer) => layer.floorRole === "base_structure");
  if (!baseStructureLayer) {
    return false;
  }

  return inferStructuralSupportTypeFromMaterial(baseStructureLayer.material) === "mass_timber_clt";
}

function isRawNonCombinedRoleGatedCarrierTopology(
  rawLayers: readonly LayerInput[],
  normalizedLayers: readonly ResolvedLayerStackEntry[]
): boolean {
  if (rawLayers.some((layer) => Boolean(layer.floorRole))) {
    return false;
  }

  const baseStructureLayer = normalizedLayers.find((layer) => layer.floorRole === "base_structure");
  if (!baseStructureLayer) {
    return false;
  }

  const structuralSupportType = inferStructuralSupportTypeFromMaterial(baseStructureLayer.material);
  if (structuralSupportType !== "timber_joists" && structuralSupportType !== "open_box_timber") {
    return false;
  }

  return !(hasUpperFloorRoleEvidence(normalizedLayers) && hasLowerFloorRoleEvidence(normalizedLayers));
}

function sanitizeIdFragment(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function normalizePredictorToken(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function normalizePredictorMaterialClass(value: string | null | undefined): string {
  const normalized = normalizePredictorToken(value);

  switch (normalized) {
    case "vinyl_plank":
      return "vinyl_flooring";
    case "engineered_timber_flooring":
      return "engineered_timber";
    default:
      return normalized;
  }
}

function numberWithinTolerance(
  expected: number | undefined,
  actual: number | undefined,
  tolerance: number
): boolean {
  if (!(typeof actual === "number" && Number.isFinite(actual))) {
    return true;
  }

  if (!(typeof expected === "number" && Number.isFinite(expected))) {
    return false;
  }

  return Math.abs(expected - actual) <= tolerance;
}

type PredictorMatchScore = {
  compatible: boolean;
  score: number;
};

const REQUIRED_PREDICTOR_SUPPORT_CLASSES = new Set([
  "tuas_open_box_family_a",
  "tuas_open_box_family_b"
]);

function scoreExactString(
  expected: string | undefined,
  actual: string | undefined,
  normalizer: (value: string | null | undefined) => string = normalizePredictorToken
): PredictorMatchScore {
  if (!actual) {
    return { compatible: true, score: 0 };
  }

  if (!expected) {
    return { compatible: false, score: 0 };
  }

  const compatible = normalizer(expected) === normalizer(actual);
  return { compatible, score: compatible ? 1 : 0 };
}

function scorePredictorSupportClass(
  expected: string | undefined,
  actual: string | undefined
): PredictorMatchScore {
  const normalizedExpected = normalizePredictorToken(expected);

  if (REQUIRED_PREDICTOR_SUPPORT_CLASSES.has(normalizedExpected) && !actual) {
    return { compatible: false, score: 0 };
  }

  return scoreExactString(expected, actual, normalizePredictorToken);
}

function scoreExactNumber(
  expected: number | undefined,
  actual: number | undefined,
  tolerance: number
): PredictorMatchScore {
  if (!(typeof actual === "number" && Number.isFinite(actual))) {
    return { compatible: true, score: 0 };
  }

  if (!(typeof expected === "number" && Number.isFinite(expected))) {
    return { compatible: false, score: 0 };
  }

  const compatible = numberWithinTolerance(expected, actual, tolerance);
  return { compatible, score: compatible ? 1 : 0 };
}

function accumulateScore(
  target: PredictorMatchScore,
  partial: PredictorMatchScore
): PredictorMatchScore {
  return {
    compatible: target.compatible && partial.compatible,
    score: target.score + partial.score
  };
}

function scorePredictorSection(
  expected:
    | FloorSystemEstimateMatch["baseSlab"]
    | FloorSystemEstimateMatch["floatingScreed"]
    | FloorSystemEstimateMatch["upperFill"]
    | FloorSystemEstimateMatch["resilientLayer"]
    | undefined,
  actual:
    | ImpactPredictorInput["baseSlab"]
    | ImpactPredictorInput["floatingScreed"]
    | ImpactPredictorInput["upperFill"]
    | ImpactPredictorInput["resilientLayer"]
    | undefined
): PredictorMatchScore {
  const expectedSection = (expected ?? {}) as {
    densityKgM3?: number;
    dynamicStiffnessMNm3?: number;
    materialClass?: string;
    productId?: string;
    thicknessMm?: number;
  };
  const actualSection = (actual ?? {}) as {
    densityKgM3?: number;
    dynamicStiffnessMNm3?: number;
    materialClass?: string;
    productId?: string;
    thicknessMm?: number;
  };

  const hasExpectedSection =
    typeof expectedSection.thicknessMm === "number" ||
    typeof expectedSection.densityKgM3 === "number" ||
    typeof expectedSection.dynamicStiffnessMNm3 === "number" ||
    Boolean(expectedSection.materialClass) ||
    Boolean(expectedSection.productId);
  const hasActualSection =
    typeof actualSection.thicknessMm === "number" ||
    typeof actualSection.densityKgM3 === "number" ||
    typeof actualSection.dynamicStiffnessMNm3 === "number" ||
    Boolean(actualSection.materialClass) ||
    Boolean(actualSection.productId);

  if (hasExpectedSection && !hasActualSection) {
    return { compatible: false, score: 0 };
  }

  if (!hasExpectedSection && !hasActualSection) {
    return { compatible: true, score: 1 };
  }

  let score: PredictorMatchScore = { compatible: true, score: 0 };
  score = accumulateScore(
    score,
    scoreExactNumber(
      expectedSection.thicknessMm,
      actualSection.thicknessMm,
      PREDICTOR_THICKNESS_TOLERANCE_MM
    )
  );
  score = accumulateScore(
    score,
    scoreExactNumber(
      expectedSection.densityKgM3,
      actualSection.densityKgM3,
      PREDICTOR_DENSITY_TOLERANCE_KG_M3
    )
  );
  score = accumulateScore(
    score,
    scoreExactString(
      expectedSection.materialClass,
      actualSection.materialClass,
      normalizePredictorMaterialClass
    )
  );
  score = accumulateScore(score, scoreExactString(expectedSection.productId, actualSection.productId));

  if (
    typeof expectedSection.dynamicStiffnessMNm3 === "number" ||
    typeof actualSection.dynamicStiffnessMNm3 === "number"
  ) {
    score = accumulateScore(
      score,
      scoreExactNumber(
        expectedSection.dynamicStiffnessMNm3,
        actualSection.dynamicStiffnessMNm3,
        5
      )
    );
  }

  return score;
}

function scorePredictorFloorCovering(
  expected: FloorSystemEstimateMatch["floorCovering"] | undefined,
  actual: ImpactPredictorInput["floorCovering"] | undefined
): PredictorMatchScore {
  if (normalizePredictorToken(actual?.mode) === "none") {
    const compatible =
      !expected ||
      normalizePredictorToken(expected.mode) === "none" ||
      (!expected.materialClass && !expected.thicknessMm && !expected.densityKgM3 && !expected.deltaLwDb);

    return {
      compatible,
      score: compatible ? 1 : 0
    };
  }

  let score: PredictorMatchScore = { compatible: true, score: 0 };
  score = accumulateScore(score, scoreExactString(expected?.mode, actual?.mode));
  score = accumulateScore(
    score,
    scoreExactString(expected?.materialClass, actual?.materialClass, normalizePredictorMaterialClass)
  );
  score = accumulateScore(score, scoreExactNumber(expected?.thicknessMm, actual?.thicknessMm, PREDICTOR_THICKNESS_TOLERANCE_MM));
  score = accumulateScore(score, scoreExactNumber(expected?.densityKgM3, actual?.densityKgM3, PREDICTOR_DENSITY_TOLERANCE_KG_M3));
  score = accumulateScore(score, scoreExactNumber(expected?.deltaLwDb, actual?.deltaLwDb, 1));

  return score;
}

function scorePredictorLowerTreatment(
  expected: FloorSystemEstimateMatch["lowerTreatment"] | undefined,
  actual: ImpactPredictorInput["lowerTreatment"] | undefined
): PredictorMatchScore {
  let score: PredictorMatchScore = { compatible: true, score: 0 };
  score = accumulateScore(score, scoreExactString(expected?.type, actual?.type));
  score = accumulateScore(
    score,
    scorePredictorSupportClass(expected?.supportClass, actual?.supportClass)
  );
  score = accumulateScore(
    score,
    scoreExactNumber(expected?.boardLayerCount, actual?.boardLayerCount, 0)
  );
  score = accumulateScore(
    score,
    scoreBoardThicknessSchedule(
      expected?.boardThicknessScheduleMm,
      actual?.boardThicknessScheduleMm
    )
  );
  score = accumulateScore(
    score,
    scoreExactString(expected?.boardMaterialClass, actual?.boardMaterialClass, normalizePredictorMaterialClass)
  );
  score = accumulateScore(
    score,
    scoreExactNumber(expected?.boardThicknessMm, actual?.boardThicknessMm, PREDICTOR_THICKNESS_TOLERANCE_MM)
  );
  score = accumulateScore(
    score,
    scoreExactNumber(expected?.cavityDepthMm, actual?.cavityDepthMm, PREDICTOR_THICKNESS_TOLERANCE_MM)
  );
  score = accumulateScore(
    score,
    scoreExactNumber(
      expected?.cavityFillThicknessMm,
      actual?.cavityFillThicknessMm,
      PREDICTOR_THICKNESS_TOLERANCE_MM
    )
  );

  return score;
}

function scoreBoardThicknessSchedule(
  expected: readonly number[] | undefined,
  actual: readonly number[] | undefined
): PredictorMatchScore {
  if (!expected?.length && !actual?.length) {
    return { compatible: true, score: 0 };
  }

  if (!expected?.length || !actual?.length) {
    return { compatible: false, score: 0 };
  }

  const compatible = matchesPackedThicknessSchedule(actual, expected);

  return {
    compatible,
    score: compatible ? 1 : 0
  };
}

function scoreFloorSystemEstimateMatch(
  expected: FloorSystemEstimateMatch,
  actual: ImpactPredictorInput
): PredictorMatchScore {
  let score: PredictorMatchScore = { compatible: true, score: 0 };
  score = accumulateScore(
    score,
    scoreExactString(expected.structuralSupportType, actual.structuralSupportType)
  );
  score = accumulateScore(score, scoreExactString(expected.supportForm, actual.supportForm));
  score = accumulateScore(score, scoreExactString(expected.impactSystemType, actual.impactSystemType));
  score = accumulateScore(score, scorePredictorSection(expected.baseSlab, actual.baseSlab));
  score = accumulateScore(score, scorePredictorSection(expected.resilientLayer, actual.resilientLayer));
  score = accumulateScore(score, scorePredictorSection(expected.floatingScreed, actual.floatingScreed));
  score = accumulateScore(score, scorePredictorSection(expected.upperFill, actual.upperFill));
  score = accumulateScore(score, scorePredictorFloorCovering(expected.floorCovering, actual.floorCovering));
  score = accumulateScore(score, scorePredictorLowerTreatment(expected.lowerTreatment, actual.lowerTreatment));
  return score;
}

function resolvePredictorExactFloorSystemId(input: ImpactPredictorInput): string | null {
  const candidates = EXACT_FLOOR_SYSTEMS.filter(
    (system) => system.manualMatch !== false && system.estimateMatch
  )
    .map((system) => ({
      score: scoreFloorSystemEstimateMatch(system.estimateMatch as FloorSystemEstimateMatch, input),
      system
    }))
    .filter((entry) => entry.score.compatible)
    .sort((left, right) => right.score.score - left.score.score);

  const best = candidates[0];
  if (!best || best.score.score < 4) {
    return null;
  }

  const second = candidates[1];
  if (second && second.score.score === best.score.score) {
    return null;
  }

  return best.system.id;
}

function pushLayer(
  layers: LayerInput[],
  materialId: string | null,
  thicknessMm: number | undefined,
  floorRole: LayerInput["floorRole"]
) {
  if (!materialId || !(typeof thicknessMm === "number" && thicknessMm > 0)) {
    return;
  }

  layers.push({
    floorRole,
    materialId,
    thicknessMm
  });
}

function isPotentialTopFloorFinish(material: MaterialDefinition): boolean {
  return material.category === "finish" && !CEILING_BOARD_MATERIAL_IDS.has(material.id);
}

function inferMissingFloorRole(
  layer: LayerInput,
  material: MaterialDefinition,
  context: {
    hasSeparateTopFloorFinish: boolean;
  }
): LayerInput["floorRole"] | undefined {
  if (material.id === "dry_floating_gypsum_fiberboard") {
    // Published integrated dry-floor rows use thick gypsum-fiber elements as the top dry-floor
    // layer unless a separate finish proves the board is acting as an intermediate screed.
    return context.hasSeparateTopFloorFinish ? "floating_screed" : "floor_covering";
  }

  if (CEILING_CAVITY_MATERIAL_IDS.has(material.id)) {
    return "ceiling_cavity";
  }

  if (RESILIENT_LAYER_MATERIAL_IDS.has(material.id)) {
    return "resilient_layer";
  }

  if (FLOATING_SCREED_MATERIAL_IDS.has(material.id)) {
    return "floating_screed";
  }

  if (UPPER_FILL_MATERIAL_IDS.has(material.id)) {
    return "upper_fill";
  }

  if (CEILING_BOARD_MATERIAL_IDS.has(material.id)) {
    return "ceiling_board";
  }

  if (material.category === "gap") {
    return "ceiling_cavity";
  }

  if (material.category === "insulation") {
    return "ceiling_fill";
  }

  if (material.id === "concrete" || material.tags.includes("structural")) {
    return "base_structure";
  }

  if (material.category === "finish") {
    return "floor_covering";
  }

  if (material.category === "support") {
    return "resilient_layer";
  }

  if (material.category === "mass") {
    return "upper_fill";
  }

  return undefined;
}

function normalizeImpactPredictorLayerStack(
  rawLayers: readonly BuildImpactPredictorLayerInput[],
  catalog: readonly MaterialDefinition[]
): ResolvedLayerStackEntry[] {
  const parsedEntries = rawLayers.map((rawLayer) => {
    const parsedLayer = LayerInputSchema.parse(rawLayer);
    const material = resolveMaterial(parsedLayer.materialId, catalog);

    return { parsedLayer, material };
  });
  const hasSeparateTopFloorFinish = parsedEntries.some(
    ({ material }) => isPotentialTopFloorFinish(material) && material.id !== "dry_floating_gypsum_fiberboard"
  );

  const normalizedEntries = parsedEntries.map(({ parsedLayer, material }) => {
    const floorRole =
      parsedLayer.floorRole ??
      inferMissingFloorRole(parsedLayer, material, {
        hasSeparateTopFloorFinish
      });

    return {
      ...parsedLayer,
      floorRole,
      material
    };
  });

  return normalizeScheduleEquivalentCeilingBoards(coalesceMergeSafeImpactLayers(normalizedEntries));
}

function canMergeImpactLayerPair(
  previous: ResolvedLayerStackEntry | undefined,
  current: ResolvedLayerStackEntry
): boolean {
  if (!previous?.floorRole || !current.floorRole || previous.floorRole !== current.floorRole) {
    return false;
  }

  if (!MERGE_SAFE_IMPACT_LAYER_ROLES.has(current.floorRole)) {
    return false;
  }

  return previous.material.id === current.material.id;
}

function coalesceMergeSafeImpactLayers(
  layers: readonly ResolvedLayerStackEntry[]
): ResolvedLayerStackEntry[] {
  const collapsed: ResolvedLayerStackEntry[] = [];

  for (const layer of layers) {
    const previous = collapsed.at(-1);

    if (!canMergeImpactLayerPair(previous, layer)) {
      collapsed.push({
        ...layer,
        material: { ...layer.material }
      });
      continue;
    }

    const mergedPrevious = previous as ResolvedLayerStackEntry;
    mergedPrevious.thicknessMm = Math.round((mergedPrevious.thicknessMm + layer.thicknessMm) * 1000) / 1000;
  }

  return collapsed;
}

function normalizeScheduleEquivalentCeilingBoards(
  layers: readonly ResolvedLayerStackEntry[]
): ResolvedLayerStackEntry[] {
  const ceilingBoardIndexes = layers
    .map((layer, index) => (layer.floorRole === "ceiling_board" ? index : -1))
    .filter((index) => index >= 0);

  if (ceilingBoardIndexes.length <= 1) {
    return [...layers];
  }

  const firstIndex = ceilingBoardIndexes[0] as number;
  const lastIndex = ceilingBoardIndexes.at(-1) as number;
  if (lastIndex - firstIndex + 1 !== ceilingBoardIndexes.length) {
    return [...layers];
  }

  const ceilingBoards = ceilingBoardIndexes.map((index) => layers[index] as ResolvedLayerStackEntry);
  const firstBoard = ceilingBoards[0];
  if (!firstBoard) {
    return [...layers];
  }

  if (ceilingBoards.some((layer) => layer.material.id !== firstBoard.material.id)) {
    return [...layers];
  }

  const maxThicknessMm = Math.max(...ceilingBoards.map((layer) => layer.thicknessMm));
  if (!(maxThicknessMm > 0)) {
    return [...layers];
  }

  const totalThicknessMm = ceilingBoards.reduce((sum, layer) => sum + layer.thicknessMm, 0);
  const packedBoardCount = Math.round(totalThicknessMm / maxThicknessMm);

  if (
    packedBoardCount <= 0 ||
    Math.abs(totalThicknessMm - packedBoardCount * maxThicknessMm) > CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM
  ) {
    return [...layers];
  }

  const alreadyCanonical =
    ceilingBoards.length === packedBoardCount &&
    ceilingBoards.every(
      (layer) => Math.abs(layer.thicknessMm - maxThicknessMm) <= CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM
    );
  if (alreadyCanonical) {
    return [...layers];
  }

  return [
    ...layers.slice(0, firstIndex),
    ...Array.from({ length: packedBoardCount }, () => ({
      ...firstBoard,
      thicknessMm: maxThicknessMm,
      material: { ...firstBoard.material }
    })),
    ...layers.slice(lastIndex + 1)
  ];
}

function hasPotentialFloorRoleInferenceEvidence(rawLayers: readonly LayerInput[]): boolean {
  let hasBaseCandidate = false;
  let hasExplicitFloorRole = false;
  let hasAuxiliaryHint = false;
  let hasSafeBareBaseCandidate = false;

  for (const layer of rawLayers) {
    if (layer.floorRole) {
      hasExplicitFloorRole = true;
      if (layer.floorRole === "base_structure") {
        hasBaseCandidate = true;
      } else if (FLOOR_ROLE_INFERENCE_EVIDENCE_ROLES.has(layer.floorRole)) {
        hasAuxiliaryHint = true;
      }
    }

    const materialId = normalizePredictorToken(layer.materialId);
    if (!materialId) {
      continue;
    }

    if (BASE_STRUCTURE_HINT_MATERIAL_IDS.has(materialId)) {
      hasBaseCandidate = true;
    }

    if (FLOOR_ROLE_INFERENCE_HINT_MATERIAL_IDS.has(materialId)) {
      hasAuxiliaryHint = true;
    }

    if (SAFE_BARE_BASE_ROLE_INFERENCE_MATERIAL_IDS.has(materialId)) {
      hasSafeBareBaseCandidate = true;
    }
  }

  return hasBaseCandidate && (hasExplicitFloorRole || hasAuxiliaryHint || (rawLayers.length === 1 && hasSafeBareBaseCandidate));
}

function hasNormalizedSafeBareBaseCandidate(
  normalizedLayers: readonly ResolvedLayerStackEntry[]
): boolean {
  return Boolean(
    normalizedLayers.length === 1 &&
      normalizedLayers[0]?.floorRole === "base_structure" &&
      SAFE_BARE_BASE_ROLE_INFERENCE_MATERIAL_IDS.has(
        normalizePredictorToken(normalizedLayers[0]?.materialId)
      )
  );
}

export function maybeInferFloorRoleLayerStack(
  rawLayers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[] = getDefaultMaterialCatalog()
): LayerInput[] | null {
  const normalizedLayers = normalizeImpactPredictorLayerStack(rawLayers, catalog);
  const hasSafeBareBaseCandidate = hasNormalizedSafeBareBaseCandidate(normalizedLayers);

  if (isRawNonCombinedRoleGatedCarrierTopology(rawLayers, normalizedLayers)) {
    return null;
  }

  if (!hasPotentialFloorRoleInferenceEvidence(rawLayers) && !hasSafeBareBaseCandidate) {
    return null;
  }

  if (hasMassTimberCombinedMultiEntryFloatingScreedVisibleStack(rawLayers, normalizedLayers)) {
    return null;
  }

  const hasBaseStructure = normalizedLayers.some((layer) => layer.floorRole === "base_structure");
  const hasExplicitFloorRole = rawLayers.some((layer) => Boolean(layer.floorRole));
  const hasAuxiliaryFloorEvidence = normalizedLayers.some(
    (layer) => layer.floorRole && FLOOR_ROLE_INFERENCE_EVIDENCE_ROLES.has(layer.floorRole)
  );

  if (!hasBaseStructure || (!hasExplicitFloorRole && !hasAuxiliaryFloorEvidence && !hasSafeBareBaseCandidate)) {
    return null;
  }

  return normalizedLayers.map((layer) => ({
    floorRole: layer.floorRole,
    materialId: layer.materialId,
    thicknessMm: layer.thicknessMm
  }));
}

export function normalizeExplicitFloorRoleLayerStack(
  rawLayers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[] = getDefaultMaterialCatalog()
): LayerInput[] | null {
  if (rawLayers.length === 0 || rawLayers.some((layer) => !layer.floorRole)) {
    return null;
  }

  return normalizeImpactPredictorLayerStack(rawLayers, catalog).map((layer) => ({
    floorRole: layer.floorRole,
    materialId: layer.materialId,
    thicknessMm: layer.thicknessMm
  }));
}

function buildDynamicResilientMaterial(dynamicStiffnessMNm3: number): MaterialDefinition {
  const normalized = Number(dynamicStiffnessMNm3.toFixed(3));
  const id = `predictor_resilient_s_${sanitizeIdFragment(normalized.toString())}`;

  return {
    id,
    name: `Predictor Resilient Layer s' ${normalized} MN/m3`,
    category: "support",
    densityKgM3: 700,
    impact: {
      dynamicStiffnessMNm3: normalized
    },
    notes:
      "Generated at runtime from impact predictor input so explicit dynamic stiffness can flow through the narrow heavy-floor estimator without implying an official product row.",
    tags: ["predictor-input", "runtime-generated", "impact", "resilient"]
  };
}

function buildCustomMaterial(input: {
  category: MaterialDefinition["category"];
  densityKgM3: number;
  idPrefix: string;
  label: string;
  materialClass?: string;
  tags?: readonly string[];
}): MaterialDefinition {
  const classFragment = sanitizeIdFragment(input.materialClass || input.label);

  return {
    id: `${input.idPrefix}_${classFragment || "custom"}`,
    name: input.materialClass ? `${input.label} (${input.materialClass})` : input.label,
    category: input.category,
    densityKgM3: input.densityKgM3,
    notes: "Generated at runtime from impact predictor input to keep the engine path typed and explicit.",
    tags: ["predictor-input", "runtime-generated", ...(input.tags ?? [])]
  };
}

function resolveBaseStructureMaterialId(input: ImpactPredictorInput): string | null {
  switch (input.structuralSupportType) {
    case "reinforced_concrete":
      return isHeavyConcreteCarrierDensityEligible(input.baseSlab?.densityKgM3) ? "concrete" : "lightweight_concrete";
    case "hollow_core":
      return "hollow_core_plank";
    case "steel_joists":
      return input.supportForm === "open_web_or_rolled"
        ? "open_web_steel_floor"
        : input.supportForm === "joist_or_purlin"
          ? "steel_joist_floor"
          : "lightweight_steel_floor";
    case "timber_joists":
      return "timber_joist_floor";
    case "open_box_timber":
      return "open_box_timber_slab";
    case "mass_timber_clt":
      return "clt_panel";
    case "composite_panel":
      return "composite_steel_deck";
    default:
      return null;
  }
}

function inferStructuralSupportTypeFromBaseSlab(
  input: ImpactPredictorInput
): Pick<ImpactPredictorInput, "structuralSupportType"> {
  if (input.structuralSupportType) {
    return {};
  }

  const materialClass = input.baseSlab?.materialClass?.trim().toLowerCase();

  switch (materialClass) {
    case "heavy_concrete":
    case "concrete":
      return { structuralSupportType: "reinforced_concrete" };
    case "hollow_core_plank":
      return { structuralSupportType: "hollow_core" };
    default:
      return {};
  }
}

function resolveFloorCoveringMaterialId(input: ImpactPredictorInput): string | null {
  const materialClass = input.floorCovering?.materialClass?.trim().toLowerCase();

  switch (materialClass) {
    case undefined:
      return null;
    case "":
      return null;
    case "ceramic_tile":
      return "ceramic_tile";
    case "porcelain_tile":
      return "porcelain_tile";
    case "laminate_flooring":
      return "laminate_flooring";
    case "vinyl_flooring":
      return "vinyl_flooring";
    case "engineered_timber":
    case "engineered_timber_flooring":
      return "engineered_timber_flooring";
    case "engineered_timber_with_acoustic_underlay":
      return "engineered_timber_with_acoustic_underlay";
    case "carpet_with_foam_underlay":
      return "carpet_with_foam_underlay";
    case "dry_floating_gypsum_fiberboard":
      return "dry_floating_gypsum_fiberboard";
    default:
      return null;
  }
}

function resolveFloatingMassMaterialId(input: ImpactPredictorInput): string | null {
  const materialClass = input.floatingScreed?.materialClass?.trim().toLowerCase();

  switch (materialClass) {
    case undefined:
      break;
    case "":
      break;
    case "generic_screed":
      return "screed";
    case "inex_floor_panel":
    case "dry_floating_gypsum_fiberboard":
    case "lightweight_dry_deck":
      return input.structuralSupportType === "steel_joists" ? "inex_floor_panel" : "dry_floating_gypsum_fiberboard";
    default:
      return null;
  }

  if (input.structuralSupportType === "steel_joists") {
    return "inex_floor_panel";
  }

  if (input.impactSystemType === "heavy_floating_floor") {
    return "screed";
  }

  if (input.impactSystemType === "dry_floating_floor") {
    return "dry_floating_gypsum_fiberboard";
  }

  return null;
}

function resolveUpperFillMaterialId(input: ImpactPredictorInput): string | null {
  const materialClass = input.upperFill?.materialClass?.trim().toLowerCase();

  switch (materialClass) {
    case undefined:
      return null;
    case "":
      return null;
    case "bonded_chippings":
      return "bonded_chippings";
    case "non_bonded_chippings":
      return "non_bonded_chippings";
    case "elastic_bonded_fill":
      return "elastic_bonded_fill";
    case "eps_floor_insulation_board":
      return "eps_floor_insulation_board";
    case "generic_fill":
      return "generic_fill";
    default:
      return null;
  }
}

function resolveCeilingSupportMaterialId(input: ImpactPredictorInput): string | null {
  const type = input.lowerTreatment?.type;
  const supportClass = input.lowerTreatment?.supportClass;

  if (type === "none" || !type) {
    return null;
  }

  if (type === "direct_fixed_ceiling") {
    return supportClass === "furred_channels" ? "furring_channel" : null;
  }

  if (input.structuralSupportType === "steel_joists") {
    return "ubiq_resilient_ceiling";
  }

  if (input.structuralSupportType === "hollow_core") {
    return "genieclip_rst";
  }

  if (input.structuralSupportType === "open_box_timber") {
    if (supportClass === "tuas_open_box_family_a") {
      return "tuas_open_box_ceiling_family_a";
    }
    return "resilient_stud_ceiling";
  }

  if (input.structuralSupportType === "timber_joists" && supportClass === "furred_channels") {
    return "furring_channel";
  }

  return "acoustic_hanger_ceiling";
}

function resolveCeilingBoardMaterialId(input: ImpactPredictorInput): string {
  const boardMaterialClass = input.lowerTreatment?.boardMaterialClass?.trim().toLowerCase();

  switch (boardMaterialClass) {
    case "impactstop_board":
      return "impactstop_board";
    case "firestop_board":
    case "fire_board":
      return "firestop_board";
    case "sheetrock_one":
    case "generic_gypsum_board":
    case "gypsum_board":
    case "plasterboard":
      return "gypsum_board";
    default:
      if (input.structuralSupportType === "steel_joists" || input.structuralSupportType === "timber_joists") {
        return "firestop_board";
      }

      return "gypsum_board";
  }
}

function resolveDefaultCeilingCavityThicknessMm(input: ImpactPredictorInput): number | undefined {
  if (typeof input.lowerTreatment?.cavityDepthMm === "number" && input.lowerTreatment.cavityDepthMm > 0) {
    return input.lowerTreatment.cavityDepthMm;
  }

  if (input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger") {
    return undefined;
  }

  switch (input.structuralSupportType) {
    case "steel_joists":
      return 65;
    case "hollow_core":
      return 16;
    case "open_box_timber":
      return 25;
    case "composite_panel":
      return 150;
    default:
      return undefined;
  }
}

function resolveDefaultFloorCoveringThicknessMm(input: ImpactPredictorInput): number | undefined {
  if (typeof input.floorCovering?.thicknessMm === "number" && input.floorCovering.thicknessMm > 0) {
    return input.floorCovering.thicknessMm;
  }

  switch (normalizePredictorMaterialClass(input.floorCovering?.materialClass)) {
    case "engineered_timber":
    case "engineered_timber_with_acoustic_underlay":
      return 15;
    case "carpet_with_foam_underlay":
      return 11;
    case "laminate_flooring":
      return 8;
    case "vinyl_flooring":
      return 2.5;
    case "porcelain_tile":
    case "ceramic_tile":
      return 8;
    case "dry_floating_gypsum_fiberboard":
      return 25;
    default:
      return undefined;
  }
}

function resolveDefaultFloatingScreedThicknessMm(input: ImpactPredictorInput): number | undefined {
  if (typeof input.floatingScreed?.thicknessMm === "number" && input.floatingScreed.thicknessMm > 0) {
    return input.floatingScreed.thicknessMm;
  }

  if (
    normalizePredictorMaterialClass(input.floorCovering?.materialClass) === "dry_floating_gypsum_fiberboard"
  ) {
    return undefined;
  }

  switch (input.impactSystemType) {
    case "dry_floating_floor":
      if (input.structuralSupportType !== "mass_timber_clt") {
        return undefined;
      }
      return 60;
    default:
      return undefined;
  }
}

function layersForRole(layers: readonly ResolvedLayerStackEntry[], role: LayerInput["floorRole"]) {
  return layers.filter((layer) => layer.floorRole === role);
}

function firstLayerForRole(layers: readonly ResolvedLayerStackEntry[], role: LayerInput["floorRole"]) {
  return layers.find((layer) => layer.floorRole === role);
}

function resolveStructuralSupportFromBaseLayer(
  layer: ResolvedLayerStackEntry | undefined
): Pick<ImpactPredictorInput, "baseSlab" | "structuralSupportType" | "supportForm"> {
  if (!layer) {
    return {};
  }

  const baseSlab = {
    densityKgM3: layer.material.densityKgM3,
    thicknessMm: layer.thicknessMm
  };
  const rawMaterialId = (layer.materialId || "").trim().toLowerCase();
  const structuralSupportType = inferStructuralSupportTypeFromMaterial(layer.material);
  const materialClass = inferBaseSlabMaterialClassFromMaterial(layer.material);
  const supportForm =
    layer.material.id === "timber_joist_floor" && rawMaterialId === "timber_joist_floor"
      ? "joist_or_purlin"
      : inferSupportFormFromMaterial(layer.material);

  return {
    baseSlab: materialClass
      ? {
          ...baseSlab,
          materialClass
        }
      : baseSlab,
    structuralSupportType,
    supportForm
  };
}

function collectPredictorRoleConflicts(
  layers: readonly ResolvedLayerStackEntry[]
): PredictorRoleConflict[] {
  const conflicts = collectSingleEntryRoleConflicts(layers);
  const ceilingBoardConflict = collectCeilingBoardTopologyConflict(layers);
  const ceilingBoards = layersForRole(layers, "ceiling_board");
  const ceilingCavity = firstLayerForRole(layers, "ceiling_cavity");
  const boardMaterialClass = resolveLowerTreatmentBoardMaterialClass(ceilingBoards[0]);

  if (
    ceilingBoardConflict &&
    !lowerTreatmentMatchesSupportedExactSchedule({
      boardMaterialClass,
      ceilingBoards,
      ceilingCavity
    })
  ) {
    return [...conflicts, ceilingBoardConflict];
  }

  return conflicts;
}

function formatPredictorRoleLabel(role: NonNullable<LayerInput["floorRole"]>): string {
  return role.replaceAll("_", " ");
}

function formatPredictorRoleConflict(conflict: PredictorRoleConflict): string {
  const materialsLabel =
    conflict.materialLabels.length > 0 ? ` (${conflict.materialLabels.join(", ")})` : "";

  return `${formatPredictorRoleLabel(conflict.role)} x${conflict.count}${materialsLabel}`;
}

function resolveFloorCoveringMaterialClass(input: {
  floorCoveringLayer?: ResolvedLayerStackEntry;
  resilientLayer?: ResolvedLayerStackEntry;
}): string | undefined {
  const materialId = input.floorCoveringLayer?.material.id;
  if (!materialId) {
    return undefined;
  }

  if (materialId === "engineered_timber_flooring" && input.resilientLayer) {
    return "engineered_timber_with_acoustic_underlay";
  }

  switch (materialId) {
    case "ceramic_tile":
      return "ceramic_tile";
    case "dry_floating_gypsum_fiberboard":
      return "dry_floating_gypsum_fiberboard";
    case "engineered_timber_flooring":
      return "engineered_timber_flooring";
    case "engineered_timber_with_acoustic_underlay":
      return "engineered_timber_with_acoustic_underlay";
    case "laminate_flooring":
      return "laminate_flooring";
    case "porcelain_tile":
      return "porcelain_tile";
    case "vinyl_flooring":
      return "vinyl_flooring";
    default:
      return materialId;
  }
}

function resolveFloatingScreedMaterialClass(
  layer: ResolvedLayerStackEntry | undefined
): string | undefined {
  if (!layer) {
    return undefined;
  }

  switch (layer.material.id) {
    case "screed":
      return "generic_screed";
    case "dry_floating_gypsum_fiberboard":
      return "dry_floating_gypsum_fiberboard";
    case "inex_floor_panel":
      return "lightweight_dry_deck";
    default:
      return layer.material.id;
  }
}

function resolveUpperFillMaterialClass(
  layer: ResolvedLayerStackEntry | undefined
): string | undefined {
  if (!layer) {
    return undefined;
  }

  switch (layer.material.id) {
    case "elastic_bonded_fill":
      return "elastic_bonded_fill";
    case "eps_floor_insulation_board":
      return "eps_floor_insulation_board";
    case "generic_fill":
      return "generic_fill";
    case "bonded_chippings":
      return "bonded_chippings";
    case "non_bonded_chippings":
      return "non_bonded_chippings";
    default:
      return layer.material.id;
  }
}

function resolveResilientDynamicStiffness(
  layer: ResolvedLayerStackEntry | undefined
): number | undefined {
  if (!layer) {
    return undefined;
  }

  if (layer.material.tags.includes("runtime-dynamic-stiffness-override")) {
    return layer.material.impact?.dynamicStiffnessMNm3;
  }

  const materialId = layer.material.id;
  if (
    materialId.startsWith("mw_t_") ||
    materialId.startsWith("wf_t_") ||
    materialId.startsWith("getzner_afm_") ||
    materialId.startsWith("regupol_")
  ) {
    return layer.material.impact?.dynamicStiffnessMNm3;
  }

  return undefined;
}

function resolveLowerTreatmentType(
  cavityLayer: ResolvedLayerStackEntry | undefined
): "direct_fixed_ceiling" | "suspended_ceiling_elastic_hanger" | "suspended_ceiling_rigid_hanger" {
  if (!cavityLayer) {
    return "direct_fixed_ceiling";
  }

  switch (cavityLayer.material.id) {
    case "genieclip_rst":
    case "resilient_channel":
    case "resilient_stud_ceiling":
    case "tuas_open_box_ceiling_family_a":
    case "ubiq_resilient_ceiling":
      return "suspended_ceiling_elastic_hanger";
    case "acoustic_hanger_ceiling":
    case "air_gap":
    case "furring_channel":
      return "suspended_ceiling_rigid_hanger";
    default:
      return "suspended_ceiling_rigid_hanger";
  }
}

function resolveLowerTreatmentSupportClass(
  cavityLayer: ResolvedLayerStackEntry | undefined
): "direct_to_joists" | "furred_channels" | "tuas_open_box_family_a" | undefined {
  if (!cavityLayer) {
    return "direct_to_joists";
  }

  if (cavityLayer.material.id === "tuas_open_box_ceiling_family_a") {
    return "tuas_open_box_family_a";
  }

  if (cavityLayer.material.id === "furring_channel") {
    return "furred_channels";
  }

  return undefined;
}

function resolveLowerTreatmentBoardMaterialClass(
  boardLayer: ResolvedLayerStackEntry | undefined
): string | undefined {
  const materialId = boardLayer?.material.id;
  if (!materialId) {
    return undefined;
  }

  switch (materialId) {
    case "firestop_board":
      return "firestop_board";
    case "impactstop_board":
      return "impactstop_board";
    case "gypsum_board":
      return "generic_gypsum_board";
    default:
      return materialId;
  }
}

function resolveLowerTreatmentBoardThicknessSchedule(
  ceilingBoards: readonly ResolvedLayerStackEntry[]
): number[] | undefined {
  if (ceilingBoards.length <= 1) {
    return undefined;
  }

  const firstBoard = ceilingBoards[0];
  if (!firstBoard || !ceilingBoards.every((layer) => layer.material.id === firstBoard.material.id)) {
    return undefined;
  }

  const thicknessesMm = ceilingBoards.map((layer) => layer.thicknessMm);
  const firstThicknessMm = thicknessesMm[0];

  if (
    typeof firstThicknessMm === "number" &&
    thicknessesMm.every((thicknessMm) => thicknessMm === firstThicknessMm)
  ) {
    return undefined;
  }

  return thicknessesMm;
}

function lowerTreatmentMatchesSupportedExactSchedule(input: {
  boardMaterialClass: string | undefined;
  ceilingBoards: readonly ResolvedLayerStackEntry[];
  ceilingCavity: ResolvedLayerStackEntry | undefined;
}): boolean {
  if (input.ceilingBoards.length <= 1) {
    return false;
  }

  const type = resolveLowerTreatmentType(input.ceilingCavity);
  const supportClass = resolveLowerTreatmentSupportClass(input.ceilingCavity);

  return EXACT_FLOOR_SYSTEMS.some((system) => {
    const lowerTreatment = system.estimateMatch?.lowerTreatment;
    const boardThicknessScheduleMm = lowerTreatment?.boardThicknessScheduleMm;

    if (!lowerTreatment || !boardThicknessScheduleMm?.length) {
      return false;
    }

    return (
      lowerTreatment.type === type &&
      lowerTreatment.supportClass === supportClass &&
      normalizePredictorToken(lowerTreatment.boardMaterialClass) === normalizePredictorToken(input.boardMaterialClass) &&
      layersMatchPackedThicknessSchedule(
        input.ceilingBoards,
        boardThicknessScheduleMm,
        input.ceilingBoards[0]?.material.id
      )
    );
  });
}

function impactCoverClassActsAsUpperTreatment(materialClass: string | undefined): boolean {
  switch ((materialClass || "").trim().toLowerCase()) {
    case "engineered_timber_with_acoustic_underlay":
    case "carpet_with_foam_underlay":
    case "dry_floating_gypsum_fiberboard":
      return true;
    default:
      return false;
  }
}

function resolveImpactSystemType(input: ImpactPredictorInput): ImpactPredictorInput["impactSystemType"] {
  const hasLowerTreatment = Boolean(input.lowerTreatment?.type);
  const hasResilientUpperLayer = Boolean(
    input.resilientLayer?.productId ||
      typeof input.resilientLayer?.dynamicStiffnessMNm3 === "number" ||
      typeof input.resilientLayer?.thicknessMm === "number"
  );
  const hasFloatingMassPackage = Boolean(
    typeof input.floatingScreed?.thicknessMm === "number" || typeof input.upperFill?.thicknessMm === "number"
  );
  const hasFloorCovering = input.floorCovering?.mode === "material_layer";
  const coverActsAsUpperTreatment = impactCoverClassActsAsUpperTreatment(input.floorCovering?.materialClass);
  const hasLightUpperTreatment = Boolean(
    hasFloorCovering && (coverActsAsUpperTreatment || hasResilientUpperLayer) && !hasFloatingMassPackage
  );
  const thinResilientCoverOnLightOrHollowBase =
    Boolean(input.resilientLayer?.thicknessMm) &&
    hasFloorCovering &&
    typeof input.floatingScreed?.thicknessMm !== "number" &&
    typeof input.upperFill?.thicknessMm !== "number" &&
    [
      "hollow_core",
      "steel_joists",
      "composite_panel",
      "open_box_timber",
      "mass_timber_clt"
    ].includes(input.structuralSupportType || "");

  if (input.structuralSupportType === "reinforced_concrete" || input.structuralSupportType === "hollow_core") {
    if (hasLowerTreatment && (hasFloatingMassPackage || hasLightUpperTreatment)) {
      return "combined_upper_lower_system";
    }

    if (hasFloatingMassPackage) {
      return "heavy_floating_floor";
    }

    if (hasLightUpperTreatment) {
      return "dry_floating_floor";
    }

    return hasLowerTreatment ? "suspended_ceiling_only" : "bare_floor";
  }

  if (
    input.structuralSupportType === "mass_timber_clt" &&
    (typeof input.upperFill?.thicknessMm === "number" || typeof input.floatingScreed?.thicknessMm === "number")
  ) {
    return hasLowerTreatment ? "combined_upper_lower_system" : "dry_floating_floor";
  }

  if (
    hasLowerTreatment &&
    (hasFloatingMassPackage || hasResilientUpperLayer || coverActsAsUpperTreatment || thinResilientCoverOnLightOrHollowBase)
  ) {
    return "combined_upper_lower_system";
  }

  if (hasLowerTreatment) {
    return "suspended_ceiling_only";
  }

  if (typeof input.floatingScreed?.thicknessMm === "number") {
    return (input.floatingScreed?.densityKgM3 || 0) > 1300 ? "heavy_floating_floor" : "dry_floating_floor";
  }

  if (coverActsAsUpperTreatment) {
    return "dry_floating_floor";
  }

  if (!input.baseSlab?.thicknessMm && Boolean(input.resilientLayer?.thicknessMm) && hasFloorCovering) {
    return "dry_floating_floor";
  }

  return "bare_floor";
}

function mergePredictorInput(
  derivedInput: ImpactPredictorInput,
  explicitInput: ImpactPredictorInput
): ImpactPredictorInput {
  return ImpactPredictorInputSchema.parse({
    ...derivedInput,
    ...explicitInput,
    baseSlab: {
      ...derivedInput.baseSlab,
      ...explicitInput.baseSlab
    },
    floorCovering: {
      ...derivedInput.floorCovering,
      ...explicitInput.floorCovering
    },
    floatingScreed: {
      ...derivedInput.floatingScreed,
      ...explicitInput.floatingScreed
    },
    lowerTreatment: {
      ...derivedInput.lowerTreatment,
      ...explicitInput.lowerTreatment
    },
    resilientLayer: {
      ...derivedInput.resilientLayer,
      ...explicitInput.resilientLayer
    },
    upperFill: {
      ...derivedInput.upperFill,
      ...explicitInput.upperFill
    }
  });
}

export function buildImpactPredictorInputFromLayerStack(
  rawLayers: readonly BuildImpactPredictorLayerInput[],
  seedInput: ImpactPredictorInput = {},
  assemblyMeta?: BuildImpactPredictorAssemblyMeta,
  catalog: readonly MaterialDefinition[] = getDefaultMaterialCatalog()
): ImpactPredictorInput {
  void assemblyMeta;
  const explicitInput = ImpactPredictorInputSchema.parse(seedInput);
  const resolvedLayers = normalizeImpactPredictorLayerStack(rawLayers, catalog);

  if (hasInvalidExplicitFloorBaseStructure(resolvedLayers)) {
    throw new Error(
      "Visible layer stack cannot be reduced to impact predictor input because the base_structure layer is not a recognized structural floor carrier."
    );
  }

  const baseStructure = firstLayerForRole(resolvedLayers, "base_structure");
  const resilientLayer = firstLayerForRole(resolvedLayers, "resilient_layer");
  const floatingScreed = firstLayerForRole(resolvedLayers, "floating_screed");
  const upperFill = firstLayerForRole(resolvedLayers, "upper_fill");
  const floorCovering = firstLayerForRole(resolvedLayers, "floor_covering");
  const ceilingCavity = firstLayerForRole(resolvedLayers, "ceiling_cavity");
  const ceilingFill = firstLayerForRole(resolvedLayers, "ceiling_fill");
  const ceilingBoards = layersForRole(resolvedLayers, "ceiling_board");
  const firstCeilingBoard = ceilingBoards[0];
  const boardThicknessScheduleMm = resolveLowerTreatmentBoardThicknessSchedule(ceilingBoards);
  const boardMaterialClass = resolveLowerTreatmentBoardMaterialClass(firstCeilingBoard);

  const structuralSupport = resolveStructuralSupportFromBaseLayer(baseStructure);

  const derivedInput: ImpactPredictorInput = {
    ...structuralSupport,
    floorCovering: floorCovering
      ? {
          densityKgM3: floorCovering.material.densityKgM3,
          materialClass: resolveFloorCoveringMaterialClass({
            floorCoveringLayer: floorCovering,
            resilientLayer
          }),
          mode: "material_layer",
          thicknessMm: floorCovering.thicknessMm
        }
      : undefined,
    floatingScreed: floatingScreed
      ? {
          densityKgM3: floatingScreed.material.densityKgM3,
          materialClass: resolveFloatingScreedMaterialClass(floatingScreed),
          thicknessMm: floatingScreed.thicknessMm
        }
      : undefined,
    lowerTreatment: ceilingBoards.length
      ? {
          boardLayerCount: boardThicknessScheduleMm ? undefined : ceilingBoards.length,
          boardMaterialClass,
          boardThicknessScheduleMm,
          boardThicknessMm: boardThicknessScheduleMm ? undefined : firstCeilingBoard?.thicknessMm,
          cavityDepthMm: ceilingCavity?.thicknessMm,
          cavityFillThicknessMm: ceilingFill?.thicknessMm,
          supportClass: resolveLowerTreatmentSupportClass(ceilingCavity),
          type: resolveLowerTreatmentType(ceilingCavity)
        }
      : undefined,
    resilientLayer: resilientLayer
      ? {
          dynamicStiffnessMNm3: resolveResilientDynamicStiffness(resilientLayer),
          productId:
            resilientLayer.material.id.startsWith("geniemat_") ||
            resilientLayer.material.id.startsWith("getzner_afm_") ||
            resilientLayer.material.id.startsWith("regupol_") ||
            resilientLayer.material.id.startsWith("mw_t_") ||
            resilientLayer.material.id.startsWith("wf_t_") ||
            resilientLayer.material.id === "eps_underlay"
              ? resilientLayer.material.id
              : undefined,
          thicknessMm: resilientLayer.thicknessMm
        }
      : undefined,
    upperFill: upperFill
      ? {
          densityKgM3: upperFill.material.densityKgM3,
          materialClass: resolveUpperFillMaterialClass(upperFill),
          thicknessMm: upperFill.thicknessMm
        }
      : undefined
  };

  if (!explicitInput.impactSystemType) {
    derivedInput.impactSystemType = resolveImpactSystemType(derivedInput);
  }

  return mergePredictorInput(derivedInput, explicitInput);
}

function canDerivePredictorInputFromLayerStack(
  rawLayers: readonly BuildImpactPredictorLayerInput[],
  catalog: readonly MaterialDefinition[] = getDefaultMaterialCatalog()
): boolean {
  const normalizedLayers = normalizeImpactPredictorLayerStack(rawLayers, catalog);
  if (isRawNonCombinedRoleGatedCarrierTopology(rawLayers, normalizedLayers)) {
    return false;
  }

  if (!hasPotentialFloorRoleInferenceEvidence(rawLayers) && !hasNormalizedSafeBareBaseCandidate(normalizedLayers)) {
    return false;
  }

  if (hasMassTimberCombinedMultiEntryFloatingScreedVisibleStack(rawLayers, normalizedLayers)) {
    return false;
  }

  if (hasAmbiguousSingleEntryRoleTopology(normalizedLayers) || collectPredictorRoleConflicts(normalizedLayers).length > 0) {
    return false;
  }

  if (hasInvalidExplicitFloorBaseStructure(normalizedLayers)) {
    return false;
  }

  return normalizedLayers.some((layer) => layer.floorRole === "base_structure");
}

export function maybeBuildImpactPredictorInputFromLayerStack(
  rawLayers: readonly BuildImpactPredictorLayerInput[],
  seedInput: ImpactPredictorInput = {},
  assemblyMeta?: BuildImpactPredictorAssemblyMeta,
  catalog: readonly MaterialDefinition[] = getDefaultMaterialCatalog()
): ImpactPredictorInput | null {
  if (!canDerivePredictorInputFromLayerStack(rawLayers, catalog)) {
    return null;
  }

  const predictorInput = buildImpactPredictorInputFromLayerStack(rawLayers, seedInput, assemblyMeta, catalog);

  if (!predictorInput.structuralSupportType && !predictorInput.officialFloorSystemId) {
    return null;
  }

  return predictorInput;
}

export function getVisibleLayerPredictorBlockerWarning(
  rawLayers: readonly BuildImpactPredictorLayerInput[],
  catalog: readonly MaterialDefinition[] = getDefaultMaterialCatalog()
): string | null {
  if (!hasPotentialFloorRoleInferenceEvidence(rawLayers)) {
    return null;
  }

  const normalizedLayers = normalizeImpactPredictorLayerStack(rawLayers, catalog);
  if (!normalizedLayers.some((layer) => layer.floorRole === "base_structure")) {
    return null;
  }

  const conflicts = collectPredictorRoleConflicts(normalizedLayers);
  if (conflicts.length === 0) {
    return null;
  }

  return `Visible-layer predictor matching is parked because single-entry floor roles are duplicated: ${conflicts.map(formatPredictorRoleConflict).join("; ")}. DynEcho stayed on the broader layer-scoring lane instead of collapsing that topology into a false family/exact match.`;
}

function createPredictorCustomLayerMaterial(input: {
  catalogAdditions: MaterialDefinition[];
  category: MaterialDefinition["category"];
  densityKgM3: number | undefined;
  idPrefix: string;
  label: string;
  materialClass?: string;
  tags?: readonly string[];
}): string | null {
  if (!(typeof input.densityKgM3 === "number" && input.densityKgM3 > 0)) {
    return null;
  }

  const material = buildCustomMaterial({
    category: input.category,
    densityKgM3: input.densityKgM3,
    idPrefix: input.idPrefix,
    label: input.label,
    materialClass: input.materialClass,
    tags: input.tags
  });

  input.catalogAdditions.push(material);
  return material.id;
}

function resolveResilientMaterialId(
  input: ImpactPredictorInput,
  catalogAdditions: MaterialDefinition[]
): string | null {
  const explicitProductId = input.resilientLayer?.productId?.trim().toLowerCase();
  if (explicitProductId) {
    return PRODUCT_ID_TO_MATERIAL_ID[explicitProductId] ?? explicitProductId;
  }

  if (typeof input.resilientLayer?.dynamicStiffnessMNm3 === "number") {
    const generated = buildDynamicResilientMaterial(input.resilientLayer.dynamicStiffnessMNm3);
    catalogAdditions.push(generated);
    return generated.id;
  }

  if (input.structuralSupportType === "mass_timber_clt") {
    return input.impactSystemType === "heavy_floating_floor" ? "mw_t_impact_layer" : "mw_t_impact_layer_s40";
  }

  if (input.impactSystemType === "heavy_floating_floor" || input.impactSystemType === "dry_floating_floor") {
    return "generic_resilient_underlay";
  }

  return null;
}

function buildSourceLayersFromPredictorInput(
  input: ImpactPredictorInput,
  catalogAdditions: MaterialDefinition[]
): LayerInput[] {
  const sourceLayers: LayerInput[] = [];
  const boardThicknessScheduleMm = input.lowerTreatment?.boardThicknessScheduleMm ?? [];
  const boardLayerCount = boardThicknessScheduleMm.length > 0 ? 0 : input.lowerTreatment?.boardLayerCount ?? 0;
  const boardThicknessMm = input.lowerTreatment?.boardThicknessMm;
  const boardMaterialId = resolveCeilingBoardMaterialId(input);

  for (const scheduledBoardThicknessMm of boardThicknessScheduleMm) {
    pushLayer(sourceLayers, boardMaterialId, scheduledBoardThicknessMm, "ceiling_board");
  }

  for (let index = 0; index < boardLayerCount; index += 1) {
    pushLayer(sourceLayers, boardMaterialId, boardThicknessMm, "ceiling_board");
  }

  if (typeof input.lowerTreatment?.cavityFillThicknessMm === "number" && input.lowerTreatment.cavityFillThicknessMm > 0) {
    pushLayer(sourceLayers, "rockwool", input.lowerTreatment.cavityFillThicknessMm, "ceiling_fill");
  }

  pushLayer(
    sourceLayers,
    resolveCeilingSupportMaterialId(input),
    resolveDefaultCeilingCavityThicknessMm(input),
    "ceiling_cavity"
  );

  const floorCoveringMode = input.floorCovering?.mode;
  if (floorCoveringMode !== "none") {
    const floorCoveringMaterialId =
      resolveFloorCoveringMaterialId(input) ??
      createPredictorCustomLayerMaterial({
        catalogAdditions,
        category: "finish",
        densityKgM3: input.floorCovering?.densityKgM3,
        idPrefix: "predictor_floor_covering",
        label: "Predictor Floor Covering",
        materialClass: input.floorCovering?.materialClass,
        tags: ["floor-covering"]
      });

    pushLayer(sourceLayers, floorCoveringMaterialId, resolveDefaultFloorCoveringThicknessMm(input), "floor_covering");
  }

  const upperFillMaterialId =
    resolveUpperFillMaterialId(input) ??
    createPredictorCustomLayerMaterial({
      catalogAdditions,
      category: "mass",
      densityKgM3: input.upperFill?.densityKgM3,
      idPrefix: "predictor_upper_fill",
      label: "Predictor Upper Fill",
      materialClass: input.upperFill?.materialClass,
      tags: ["upper-fill"]
    });
  pushLayer(sourceLayers, upperFillMaterialId, input.upperFill?.thicknessMm, "upper_fill");

  const floatingMassMaterialId =
    resolveFloatingMassMaterialId(input) ??
    createPredictorCustomLayerMaterial({
      catalogAdditions,
      category: "mass",
      densityKgM3: input.floatingScreed?.densityKgM3,
      idPrefix: "predictor_floating_mass",
      label: "Predictor Floating Layer",
      materialClass: input.floatingScreed?.materialClass,
      tags: ["floating-floor"]
    });
  pushLayer(sourceLayers, floatingMassMaterialId, resolveDefaultFloatingScreedThicknessMm(input), "floating_screed");

  pushLayer(
    sourceLayers,
    resolveResilientMaterialId(input, catalogAdditions),
    input.resilientLayer?.thicknessMm,
    "resilient_layer"
  );

  const baseMaterialId =
    resolveBaseStructureMaterialId(input) ??
    createPredictorCustomLayerMaterial({
      catalogAdditions,
      category: "mass",
      densityKgM3: input.baseSlab?.densityKgM3,
      idPrefix: "predictor_base_structure",
      label: "Predictor Base Structure",
      materialClass: input.baseSlab?.materialClass,
      tags: ["structural"]
    });
  pushLayer(sourceLayers, baseMaterialId, input.baseSlab?.thicknessMm, "base_structure");

  return sourceLayers;
}

export function adaptImpactPredictorInput(rawInput: ImpactPredictorInput): PredictorAdaptation {
  const input = ImpactPredictorInputSchema.parse({
    ...rawInput,
    ...inferStructuralSupportTypeFromBaseSlab(rawInput)
  });
  const catalogAdditions: MaterialDefinition[] = [];
  const notes: string[] = [];

  if (input.officialFloorSystemId) {
    notes.push(
      `Impact predictor input is anchored to curated floor-system id ${input.officialFloorSystemId}. DynEcho can bypass topology scoring for the impact lane when that curated family is known.`
    );

    return {
      catalogAdditions,
      notes,
      officialFloorSystemId: input.officialFloorSystemId,
      sourceLayers: []
    };
  }

  const inferredOfficialFloorSystemId = resolvePredictorExactFloorSystemId(input);
  if (inferredOfficialFloorSystemId) {
    notes.push(
      `Impact predictor input landed on curated floor-system id ${inferredOfficialFloorSystemId} through predictor-aware exact matching before layer adaptation.`
    );

    return {
      catalogAdditions,
      notes,
      officialFloorSystemId: inferredOfficialFloorSystemId,
      sourceLayers: []
    };
  }

  const sourceLayers = buildSourceLayersFromPredictorInput(input, catalogAdditions);

  notes.push(
    "Impact predictor input is active. DynEcho is resolving the impact lane against a dedicated predictor topology while preserving the visible assembly stack for airborne screening and UI continuity."
  );

  if (catalogAdditions.length > 0) {
    notes.push(
      "Runtime predictor materials were generated from explicit densities or dynamic-stiffness inputs so the engine can stay typed without pretending those fragments are curated catalog rows."
    );
  }

  return {
    catalogAdditions,
    notes,
    officialFloorSystemId: null,
    sourceLayers
  };
}

export function mergePredictorCatalog(
  catalog: readonly MaterialDefinition[],
  additions: readonly MaterialDefinition[]
): readonly MaterialDefinition[] {
  if (additions.length === 0) {
    return catalog;
  }

  const seen = new Set(catalog.map((entry) => entry.id));
  const merged = [...catalog];

  for (const addition of additions) {
    if (seen.has(addition.id)) {
      continue;
    }

    merged.push(addition);
    seen.add(addition.id);
  }

  return merged;
}
