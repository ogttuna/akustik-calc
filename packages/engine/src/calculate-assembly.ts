import {
  AssemblyCalculationSchema,
  AirborneContextSchema,
  type AirborneCalculator,
  type AirborneCalculatorId,
  ExactImpactSourceSchema,
  ImpactFieldContextSchema,
  ImpactPredictorInputSchema,
  LayerInputSchema,
  type AssemblyCalculation,
  type AirborneContext,
  type FloorSystemAirborneRatings,
  type FloorSystemBoundEstimateResult,
  type FloorSystemBoundMatchResult,
  type FloorSystemEstimateResult,
  type FloorSystemMatchResult,
  type ExactFloorSystem,
  type ExactImpactSource,
  type ImpactFieldContext,
  type ImpactPredictorInput,
  type LayerInput,
  type MaterialDefinition,
  type RequestedOutputId,
  type ResolvedLayer,
  type AssemblyRatings,
  type TransmissionLossCurve
} from "@dynecho/shared";

import { buildCalibratedMassLawCurve, buildRatingsFromCurve } from "./curve-rating";
import { applyAirborneContextOverlay } from "./apply-airborne-context";
import { AIRBORNE_CALCULATORS, calculateAirborneCalculatorResult } from "./airborne-calculator";
import { applyApproximateAirborneFieldCompanion, applyVerifiedAirborneCatalogAnchor } from "./airborne-verified-catalog";
import { classifyLayerRole, materialText } from "./airborne-topology";
import { calculateDynamicAirborneResult } from "./dynamic-airborne";
import { clamp, round1 } from "./math";
import { buildEstimateWarnings, estimateRwDb } from "./estimate-rw";
import { buildFloorSystemRatings } from "./floor-system-ratings";
import { buildExactImpactFromSource } from "./impact-exact";
import {
  adaptImpactPredictorInput,
  getVisibleLayerPredictorBlockerWarning,
  maybeInferFloorRoleLayerStack,
  maybeBuildImpactPredictorInputFromLayerStack,
  mergePredictorCatalog,
  normalizeExplicitFloorRoleLayerStack
} from "./impact-predictor-input";
import {
  buildResolvedImpactArtifacts,
  finalizeResolvedImpactLane,
  resolveLayerBasedImpactLane,
  shouldHideLowConfidenceProxyAirborne
} from "./impact-lane";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import {
  detectMixedPlainFilledSingleBoardFamily,
  getMixedPlainFilledSingleBoardProfile,
  MIXED_PLAIN_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME
} from "./mixed-plain-filled-single-board-field-corridor";
import {
  detectMixedEnhancedFilledSingleBoardFamily,
  getMixedEnhancedFilledSingleBoardProfile,
  MIXED_ENHANCED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME
} from "./mixed-enhanced-filled-single-board-corridor";
import {
  detectFireRatedFilledSingleBoardFamily,
  getFireRatedFilledSingleBoardProfile,
  FIRE_RATED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME
} from "./fire-rated-filled-single-board-corridor";
import {
  detectSecurityFilledSingleBoardFamily,
  getSecurityFilledSingleBoardProfile,
  SECURITY_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME,
  type SecurityFilledSingleBoardFamily
} from "./security-filled-single-board-corridor";
import { inferStructuralSupportTypeFromMaterial } from "./structural-material-classification";
import {
  detectSymmetricEnhancedFilledSingleBoardFamily,
  getSymmetricEnhancedFilledSingleBoardProfile,
  SYMMETRIC_ENHANCED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME
} from "./symmetric-enhanced-filled-single-board-corridor";
import { analyzeTargetOutputSupport, buildTargetOutputWarnings } from "./target-output-support";

export type CalculateAssemblyOptions = {
  airborneContext?: AirborneContext | null;
  calculator?: AirborneCalculatorId | null;
  catalog?: readonly MaterialDefinition[];
  exactImpactSource?: ExactImpactSource | null;
  impactFieldContext?: ImpactFieldContext | null;
  impactPredictorInput?: ImpactPredictorInput | null;
  targetOutputs?: readonly RequestedOutputId[];
};

function resolveLayers(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): ResolvedLayer[] {
  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, catalog);

    return {
      ...layer,
      material,
      surfaceMassKgM2: computeLayerSurfaceMassKgM2(layer, material)
    };
  });
}

function coalesceMergeSafeAirborneLayers(layers: readonly ResolvedLayer[]): ResolvedLayer[] {
  const coalesced: ResolvedLayer[] = [];

  for (const layer of layers) {
    const previous = coalesced.at(-1);

    if (
      previous &&
      previous.material.id === layer.material.id &&
      previous.floorRole === layer.floorRole
    ) {
      const thicknessMm = previous.thicknessMm + layer.thicknessMm;
      coalesced[coalesced.length - 1] = {
        ...previous,
        surfaceMassKgM2: computeLayerSurfaceMassKgM2({ thicknessMm }, previous.material),
        thicknessMm
      };
      continue;
    }

    coalesced.push(layer);
  }

  return coalesced;
}

function inferResolvedFloorStructuralSupportType(layers: readonly ResolvedLayer[]): string | null {
  const baseLayer = layers.findLast((layer) => layer.floorRole === "base_structure");
  return baseLayer ? inferStructuralSupportTypeFromMaterial(baseLayer.material) ?? null : null;
}

function inferExactFloorSystemStructuralSupportType(
  system: ExactFloorSystem | null | undefined,
  catalog: readonly MaterialDefinition[]
): string | null {
  const baseMaterialId = system?.match.baseStructure?.materialIds?.[0];
  if (!baseMaterialId) {
    return null;
  }

  return inferStructuralSupportTypeFromMaterial(resolveMaterial(baseMaterialId, catalog)) ?? null;
}

function buildClosestFloorSystemRecommendationWarning(input: {
  catalog: readonly MaterialDefinition[];
  recommendations: readonly { system: ExactFloorSystem }[];
  resolvedLayers: readonly ResolvedLayer[];
}): string | null {
  const closestSystem = input.recommendations[0]?.system;
  if (!closestSystem) {
    return null;
  }

  const currentSupportType = inferResolvedFloorStructuralSupportType(input.resolvedLayers);
  const candidateSupportType = inferExactFloorSystemStructuralSupportType(closestSystem, input.catalog);

  if (!currentSupportType || !candidateSupportType || currentSupportType !== candidateSupportType) {
    return "No curated exact floor-system landed. Nearby scored rows existed, but DynEcho withheld the closest candidate label because it drifted outside the defended same-family route.";
  }

  return `No curated exact floor-system landed. Closest family candidate is ${closestSystem.label}.`;
}

function pickReferenceFloorRatingLayers(layers: readonly ResolvedLayer[]): readonly ResolvedLayer[] {
  const baseStructureLayers = layers.filter((layer) => layer.floorRole === "base_structure");

  return baseStructureLayers.length > 0 ? baseStructureLayers : layers;
}

function pickFloorCarrier(input: {
  boundFloorSystemEstimate?: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch?: FloorSystemBoundMatchResult | null;
  floorSystemEstimate?: FloorSystemEstimateResult | null;
  floorSystemMatch?: FloorSystemMatchResult | null;
}): FloorSystemAirborneRatings | null {
  return (
    input.floorSystemMatch?.system.airborneRatings ??
    input.floorSystemEstimate?.airborneRatings ??
    input.boundFloorSystemMatch?.system.airborneRatings ??
    input.boundFloorSystemEstimate?.airborneRatings ??
    null
  );
}

function isBoardLikeSurfaceLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  return role.isSolidLeaf && /gypsum|board|plasterboard|firestop|impactstop|acoustic|security|soundbloc/i.test(materialText(layer));
}

function summarizeMicroGapEquivalentCavity(layers: readonly ResolvedLayer[]): {
  cavityEnd: number;
  cavityStart: number;
  gapSegmentCount: number;
  gapThicknessMm: number;
  leftLeafSolidCount: number;
  porousSegmentCount: number;
  porousLayer: ResolvedLayer | null;
  porousThicknessMm: number;
  rightLeafSolidCount: number;
  totalThicknessMm: number;
} | null {
  let sawLeftLeaf = false;
  let cavityStart = -1;
  let cavityEnd = -1;
  let leftLeafSolidCount = 0;
  let rightLeafSolidCount = 0;
  let gapSegmentCount = 0;
  let porousSegmentCount = 0;
  let gapThicknessMm = 0;
  let porousThicknessMm = 0;
  let porousLayer: ResolvedLayer | null = null;
  let previousKind: "gap" | "porous" | null = null;

  for (let index = 0; index < layers.length; index += 1) {
    const layer = layers[index];
    if (!layer) {
      continue;
    }

    const role = classifyLayerRole(layer);

    if (!sawLeftLeaf) {
      if (role.isSolidLeaf) {
        if (!isBoardLikeSurfaceLayer(layer)) {
          return null;
        }
        sawLeftLeaf = true;
        leftLeafSolidCount += 1;
      }
      continue;
    }

    if (cavityStart < 0) {
      if (role.isSolidLeaf) {
        if (!isBoardLikeSurfaceLayer(layer)) {
          return null;
        }
        leftLeafSolidCount += 1;
        continue;
      }

      if (!(role.isGap || role.isPorous)) {
        return null;
      }

      cavityStart = index;
    }

    if (cavityStart >= 0 && cavityEnd < 0) {
      if (role.isSolidLeaf) {
        if (!isBoardLikeSurfaceLayer(layer)) {
          return null;
        }
        cavityEnd = index - 1;
        rightLeafSolidCount += 1;
        continue;
      }

      if (!(role.isGap || role.isPorous)) {
        return null;
      }

      if (role.isGap) {
        gapThicknessMm += layer.thicknessMm;
        if (previousKind !== "gap") {
          gapSegmentCount += 1;
          previousKind = "gap";
        }
      } else {
        porousThicknessMm += layer.thicknessMm;
        if (!porousLayer) {
          porousLayer = { ...layer, material: { ...layer.material } };
        }
        if (previousKind !== "porous") {
          porousSegmentCount += 1;
          previousKind = "porous";
        }
      }
      continue;
    }

    if (role.isSolidLeaf) {
      if (!isBoardLikeSurfaceLayer(layer)) {
        return null;
      }
      rightLeafSolidCount += 1;
      continue;
    }

    return null;
  }

  if (!(cavityStart >= 0) || !(cavityEnd >= cavityStart) || !porousLayer) {
    return null;
  }

  const totalThicknessMm = gapThicknessMm + porousThicknessMm;
  if (!(totalThicknessMm > 0)) {
    return null;
  }

  return {
    cavityEnd,
    cavityStart,
    gapSegmentCount,
    gapThicknessMm,
    leftLeafSolidCount,
    porousLayer,
    porousSegmentCount,
    porousThicknessMm,
    rightLeafSolidCount,
    totalThicknessMm
  };
}

function buildMicroGapFillOnlyEquivalentLayers(layers: readonly ResolvedLayer[]): ResolvedLayer[] | null {
  const cavity = summarizeMicroGapEquivalentCavity(layers);
  if (!cavity) {
    return null;
  }

  const fillFraction = cavity.totalThicknessMm > 0 ? cavity.porousThicknessMm / cavity.totalThicknessMm : 0;
  if (
    cavity.leftLeafSolidCount !== 1 ||
    cavity.rightLeafSolidCount !== 1 ||
    cavity.gapSegmentCount !== 1 ||
    cavity.porousSegmentCount !== 1 ||
    !(cavity.gapThicknessMm > 0 && cavity.gapThicknessMm <= 12) ||
    !(fillFraction >= 0.82)
  ) {
    return null;
  }

  const porousLayer = cavity.porousLayer;
  if (!porousLayer) {
    return null;
  }

  return [
    ...layers.slice(0, cavity.cavityStart).map((layer) => ({ ...layer, material: { ...layer.material } })),
    {
      ...porousLayer,
      thicknessMm: cavity.totalThicknessMm,
      surfaceMassKgM2: computeLayerSurfaceMassKgM2(
        { thicknessMm: cavity.totalThicknessMm },
        porousLayer.material
      )
    },
    ...layers.slice(cavity.cavityEnd + 1).map((layer) => ({ ...layer, material: { ...layer.material } }))
  ];
}

function computeFieldRwPrimeMetric(curve: TransmissionLossCurve, context: AirborneContext): number | null {
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context);
  return ratings.field?.RwPrime ?? ratings.iso717.RwPrime ?? ratings.field?.DnTw ?? ratings.iso717.Rw;
}

function anchorCurveToFieldRwPrime(
  curve: TransmissionLossCurve,
  targetMetric: number,
  context: AirborneContext
): { applied: boolean; curve: TransmissionLossCurve; ratings: AssemblyRatings } {
  let currentCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: [...curve.transmissionLossDb]
  };
  const sourceValues = [...curve.transmissionLossDb];
  let ratings = buildRatingsFromCurve(currentCurve.frequenciesHz, currentCurve.transmissionLossDb, context);

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const currentMetric = computeFieldRwPrimeMetric(currentCurve, context);
    if (!(typeof currentMetric === "number" && Number.isFinite(currentMetric))) {
      return {
        applied: false,
        curve,
        ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context)
      };
    }

    const deltaDb = targetMetric - currentMetric;
    if (Math.abs(deltaDb) < 0.05) {
      break;
    }

    currentCurve = {
      frequenciesHz: [...currentCurve.frequenciesHz],
      transmissionLossDb: currentCurve.transmissionLossDb.map((value: number) => Math.min(95, Math.max(0, value + deltaDb)))
    };
    ratings = buildRatingsFromCurve(currentCurve.frequenciesHz, currentCurve.transmissionLossDb, context);
  }

  return {
    applied: currentCurve.transmissionLossDb.some((value: number, index: number) => Math.abs(value - sourceValues[index]) > 1e-6),
    curve: currentCurve,
    ratings
  };
}

function smoothstep01(value: number): number {
  const x = clamp(value, 0, 1);
  return x * x * (3 - (2 * x));
}

function octaveBandWindowWeight(freqHz: number, startHz: number, endHz: number, transitionOctaves = 0.3): number {
  const frequency = Math.max(freqHz, 1e-9);
  const start = Math.max(startHz, 1e-9);
  const end = Math.max(endHz, start + 1e-6);
  const transition = clamp(transitionOctaves, 0.05, 1.5);
  const left = smoothstep01((Math.log2(frequency / start) + transition) / (2 * transition));
  const right = smoothstep01((Math.log2(end / frequency) + transition) / (2 * transition));

  return clamp(Math.min(left, right), 0, 1);
}

type AirborneOverlayResult = ReturnType<typeof applyAirborneContextOverlay>;
type FieldRwPrimeTargets = Record<35 | 42 | 50 | 60, number>;

type DynamicAirborneGuardInput = {
  airborneContext: AirborneContext | null;
  layers: readonly ResolvedLayer[];
  overlayResult: AirborneOverlayResult;
  selectedCurve: TransmissionLossCurve;
};

type DynamicAirborneGuard = {
  apply: (input: DynamicAirborneGuardInput) => AirborneOverlayResult;
  id: string;
  priority: number;
};

function hasExplicitFieldFramingContext(airborneContext: AirborneContext | null): airborneContext is AirborneContext {
  return Boolean(
    airborneContext &&
      airborneContext.contextMode !== "element_lab" &&
      (
        airborneContext.connectionType !== "auto" ||
        airborneContext.studType !== "auto" ||
        typeof airborneContext.studSpacingMm === "number"
      )
  );
}

function applyFieldRwPrimeTargetGuard<FamilyInfo extends { fillThicknessMm: number }>(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null,
  detectFamily: (layers: readonly ResolvedLayer[]) => FamilyInfo | null,
  resolveTargets: (familyInfo: FamilyInfo, airborneContext: AirborneContext) => FieldRwPrimeTargets,
  warning: string
): AirborneOverlayResult {
  if (!hasExplicitFieldFramingContext(airborneContext)) {
    return overlayResult;
  }

  const familyInfo = detectFamily(layers);
  if (!familyInfo) {
    return overlayResult;
  }

  const targetMetric = interpolateFieldTargetRwPrime(
    familyInfo.fillThicknessMm,
    resolveTargets(familyInfo, airborneContext)
  );
  const currentMetric = overlayResult.ratings.field?.RwPrime ?? overlayResult.ratings.iso717.RwPrime;

  if (!(typeof currentMetric === "number" && Number.isFinite(currentMetric))) {
    return overlayResult;
  }

  if (Math.abs(currentMetric - targetMetric) < 0.25) {
    return overlayResult;
  }

  const anchored = anchorCurveToFieldRwPrime(overlayResult.curve, targetMetric, airborneContext);
  if (!anchored.applied) {
    return overlayResult;
  }

  return {
    curve: anchored.curve,
    overlay: overlayResult.overlay,
    ratings: anchored.ratings,
    warnings: [
      ...overlayResult.warnings,
      warning
    ]
  };
}

function applyMicroGapFillEquivalentFieldGuard(
  selectedCurve: TransmissionLossCurve,
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  if (!hasExplicitFieldFramingContext(airborneContext)) {
    return overlayResult;
  }

  const equivalentLayers = buildMicroGapFillOnlyEquivalentLayers(layers);
  if (!equivalentLayers?.length) {
    return overlayResult;
  }

  const equivalentScreeningRwDb = estimateRwDb(equivalentLayers);
  const equivalentScreeningCurve = buildCalibratedMassLawCurve(equivalentLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0), equivalentScreeningRwDb);
  const equivalentDynamicResult = calculateDynamicAirborneResult(equivalentLayers, {
    airborneContext,
    frequenciesHz: equivalentScreeningCurve.frequenciesHz,
    screeningEstimatedRwDb: equivalentScreeningRwDb
  });
  const equivalentOverlayResult = applyAirborneContextOverlay(equivalentDynamicResult.curve, equivalentLayers, airborneContext);
  const currentMetric = overlayResult.ratings.field?.RwPrime ?? overlayResult.ratings.iso717.RwPrime;
  const equivalentMetric = equivalentOverlayResult.ratings.field?.RwPrime ?? equivalentOverlayResult.ratings.iso717.RwPrime;

  if (
    !(typeof currentMetric === "number" && Number.isFinite(currentMetric)) ||
    !(typeof equivalentMetric === "number" && Number.isFinite(equivalentMetric))
  ) {
    return overlayResult;
  }

  const lowerBound = equivalentMetric - 3;
  const upperBound = equivalentMetric + 3;
  if (currentMetric >= lowerBound - 1e-6 && currentMetric <= upperBound + 1e-6) {
    return overlayResult;
  }

  const targetMetric = Math.min(upperBound, Math.max(lowerBound, currentMetric));
  const anchored = anchorCurveToFieldRwPrime(overlayResult.curve, targetMetric, airborneContext);
  if (!anchored.applied) {
    return overlayResult;
  }

  return {
    curve: anchored.curve,
    overlay: overlayResult.overlay,
    ratings: anchored.ratings,
    warnings: [
      ...overlayResult.warnings,
      "A very small explicit air gap inside a mostly filled framed cavity was kept within the fill-only equivalent field corridor to avoid topology-sensitive drift."
    ]
  };
}

function interpolateFieldTargetRwPrime(fillThicknessMm: number, targets: Record<35 | 42 | 50 | 60, number>): number {
  const anchors = [35, 42, 50, 60] as const;
  const clampedFill = clamp(fillThicknessMm, anchors[0], anchors[anchors.length - 1]);

  if (clampedFill <= anchors[0]) {
    return targets[anchors[0]];
  }

  if (clampedFill >= anchors[anchors.length - 1]) {
    return targets[anchors[anchors.length - 1]];
  }

  for (let index = 0; index < anchors.length - 1; index += 1) {
    const left = anchors[index];
    const right = anchors[index + 1];

    if (clampedFill < left || clampedFill > right) {
      continue;
    }

    if (clampedFill === left) {
      return targets[left];
    }

    if (clampedFill === right) {
      return targets[right];
    }

    const position = (clampedFill - left) / (right - left);
    return targets[left] + ((targets[right] - targets[left]) * position);
  }

  return targets[anchors[anchors.length - 1]];
}

function applyFireRatedFilledSingleBoardFieldGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  return applyFieldRwPrimeTargetGuard(
    overlayResult,
    layers,
    airborneContext,
    detectFireRatedFilledSingleBoardFamily,
    (familyInfo, context) =>
      FIRE_RATED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME[familyInfo.family][getFireRatedFilledSingleBoardProfile(context)],
    "A fire-rated filled single-board field corridor was applied because these fire/firestop framed hybrids were materially misreading the upstream field result."
  );
}

function applyMixedPlainFilledSingleBoardFieldGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  return applyFieldRwPrimeTargetGuard(
    overlayResult,
    layers,
    airborneContext,
    detectMixedPlainFilledSingleBoardFamily,
    (familyInfo, context) =>
      MIXED_PLAIN_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME[familyInfo.family][getMixedPlainFilledSingleBoardProfile(context)],
    "A mixed plain-filled single-board field corridor was applied because plain gypsum plus premium/moderate framed hybrids were materially misreading the upstream field result."
  );
}

function applyMixedEnhancedFilledSingleBoardFieldGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  return applyFieldRwPrimeTargetGuard(
    overlayResult,
    layers,
    airborneContext,
    detectMixedEnhancedFilledSingleBoardFamily,
    (familyInfo, context) =>
      MIXED_ENHANCED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME[familyInfo.family][getMixedEnhancedFilledSingleBoardProfile(context)],
    "A mixed enhanced filled single-board field corridor was applied because premium framed hybrids were materially misreading the upstream field result."
  );
}

function applySecurityFilledSingleBoardFieldGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  return applyFieldRwPrimeTargetGuard(
    overlayResult,
    layers,
    airborneContext,
    detectSecurityFilledSingleBoardFamily,
    (familyInfo, context) =>
      SECURITY_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME[familyInfo.family][getSecurityFilledSingleBoardProfile(context)],
    "A security-board filled single-board field corridor was applied because these framed hybrids were materially misreading the upstream field result."
  );
}

function applySecurityFilledSingleBoardSteelHighBandLiftGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  if (
    !airborneContext ||
    airborneContext.contextMode === "element_lab" ||
    airborneContext.connectionType === "resilient_channel" ||
    airborneContext.studType === "resilient_stud"
  ) {
    return overlayResult;
  }

  const familyInfo = detectSecurityFilledSingleBoardFamily(layers);
  if (!familyInfo || familyInfo.fillThicknessMm < 58) {
    return overlayResult;
  }

  const liftDbByFamily: Partial<Record<SecurityFilledSingleBoardFamily, number>> = {
    diamond: 1.6,
    fire: 2.3,
    firestop: 2.4,
    plain: 2.1
  };
  const liftDb = familyInfo.family ? liftDbByFamily[familyInfo.family] : undefined;
  const targetRwPrime = overlayResult.ratings.field?.RwPrime;

  if (!(typeof liftDb === "number" && liftDb > 0 && typeof targetRwPrime === "number" && Number.isFinite(targetRwPrime))) {
    return overlayResult;
  }

  const liftedCurve: TransmissionLossCurve = {
    frequenciesHz: [...overlayResult.curve.frequenciesHz],
    transmissionLossDb: overlayResult.curve.transmissionLossDb.map((value: number, index: number) => {
      const weight = octaveBandWindowWeight(overlayResult.curve.frequenciesHz[index] ?? 0, 630, 3150, 0.4);
      return clamp(value + (liftDb * weight), 0, 95);
    })
  };
  const liftedRatings = buildRatingsFromCurve(liftedCurve.frequenciesHz, liftedCurve.transmissionLossDb, airborneContext);
  const liftedRwPrime = liftedRatings.field?.RwPrime ?? liftedRatings.iso717.RwPrime ?? null;
  const anchored =
    typeof liftedRwPrime === "number" && Number.isFinite(liftedRwPrime) && Math.abs(liftedRwPrime - targetRwPrime) < 0.05
      ? {
          applied: true,
          curve: liftedCurve,
          ratings: liftedRatings
        }
      : anchorCurveToFieldRwPrime(liftedCurve, targetRwPrime, airborneContext);
  if (!anchored.applied) {
    return overlayResult;
  }

  return {
    curve: anchored.curve,
    overlay: overlayResult.overlay,
    ratings: anchored.ratings,
    warnings: [
      ...overlayResult.warnings,
      "A steel-field security-hybrid high-band lift was applied because certain 60 mm security framed walls were still under-reading the upstream DnT,A corridor after R'w had already aligned."
    ]
  };
}

function applySymmetricEnhancedFilledSingleBoardFieldGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  return applyFieldRwPrimeTargetGuard(
    overlayResult,
    layers,
    airborneContext,
    detectSymmetricEnhancedFilledSingleBoardFamily,
    (familyInfo, context) =>
      SYMMETRIC_ENHANCED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME[familyInfo.family][getSymmetricEnhancedFilledSingleBoardProfile(context)],
    "A symmetric enhanced filled single-board field corridor was applied because these same-material premium framed walls were materially misreading the upstream field result."
  );
}

const DYNAMIC_AIRBORNE_GUARDS: readonly DynamicAirborneGuard[] = [
  {
    id: "micro_gap_fill_equivalent",
    priority: 10,
    apply: (input: DynamicAirborneGuardInput) =>
      applyMicroGapFillEquivalentFieldGuard(
        input.selectedCurve,
        input.overlayResult,
        input.layers,
        input.airborneContext
      )
  },
  {
    id: "fire_rated_single_board_field_corridor",
    priority: 20,
    apply: (input: DynamicAirborneGuardInput) =>
      applyFireRatedFilledSingleBoardFieldGuard(input.overlayResult, input.layers, input.airborneContext)
  },
  {
    id: "mixed_plain_single_board_field_corridor",
    priority: 30,
    apply: (input: DynamicAirborneGuardInput) =>
      applyMixedPlainFilledSingleBoardFieldGuard(input.overlayResult, input.layers, input.airborneContext)
  },
  {
    id: "mixed_enhanced_single_board_field_corridor",
    priority: 40,
    apply: (input: DynamicAirborneGuardInput) =>
      applyMixedEnhancedFilledSingleBoardFieldGuard(input.overlayResult, input.layers, input.airborneContext)
  },
  {
    id: "symmetric_enhanced_single_board_field_corridor",
    priority: 50,
    apply: (input: DynamicAirborneGuardInput) =>
      applySymmetricEnhancedFilledSingleBoardFieldGuard(input.overlayResult, input.layers, input.airborneContext)
  },
  {
    id: "security_single_board_field_corridor",
    priority: 60,
    apply: (input: DynamicAirborneGuardInput) =>
      applySecurityFilledSingleBoardFieldGuard(input.overlayResult, input.layers, input.airborneContext)
  },
  {
    id: "security_single_board_steel_high_band_lift",
    priority: 70,
    apply: (input: DynamicAirborneGuardInput) =>
      applySecurityFilledSingleBoardSteelHighBandLiftGuard(input.overlayResult, input.layers, input.airborneContext)
  }
].sort((left, right) => left.priority - right.priority);

function applyDynamicAirborneGuards(
  selectedCurve: TransmissionLossCurve,
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  let nextOverlayResult = overlayResult;

  for (const guard of DYNAMIC_AIRBORNE_GUARDS) {
    nextOverlayResult = guard.apply({
      airborneContext,
      layers,
      overlayResult: nextOverlayResult,
      selectedCurve
    });
  }

  return nextOverlayResult;
}

function hasInferredConcreteCeilingHelperSupportSignal(input: {
  inferredImpactLayers: readonly LayerInput[] | null;
  visibleLayers: readonly LayerInput[];
}): boolean {
  if (input.visibleLayers.some((layer) => Boolean(layer.floorRole))) {
    return false;
  }

  if (!input.inferredImpactLayers) {
    return false;
  }

  const concreteBaseStructureIndex = input.inferredImpactLayers.findIndex(
    (layer) => layer.floorRole === "base_structure" && layer.materialId === "concrete"
  );
  if (concreteBaseStructureIndex === -1 || concreteBaseStructureIndex !== input.inferredImpactLayers.length - 1) {
    return false;
  }

  const ceilingSideLayers = input.inferredImpactLayers.slice(0, concreteBaseStructureIndex);
  if (
    !ceilingSideLayers.every(
      (layer) =>
        layer.floorRole === "ceiling_board" ||
        layer.floorRole === "ceiling_cavity" ||
        layer.floorRole === "ceiling_fill"
    )
  ) {
    return false;
  }

  const hasCeilingBoard = ceilingSideLayers.some((layer) => layer.floorRole === "ceiling_board");
  const hasCeilingHelper = ceilingSideLayers.some(
    (layer) => layer.floorRole === "ceiling_cavity" || layer.floorRole === "ceiling_fill"
  );

  return hasCeilingBoard && hasCeilingHelper;
}

export function calculateAssembly(
  inputLayers: readonly LayerInput[],
  options: CalculateAssemblyOptions = {}
): AssemblyCalculation {
  const layers = inputLayers.map((layer) => LayerInputSchema.parse(layer));
  const explicitPredictorInput = options.impactPredictorInput
    ? ImpactPredictorInputSchema.parse(options.impactPredictorInput)
    : null;
  let predictorInput = explicitPredictorInput;
  let predictorInputMode: "derived_from_visible_layers" | "explicit_predictor_input" | undefined =
    explicitPredictorInput ? "explicit_predictor_input" : undefined;
  let predictorAdaptation = predictorInput ? adaptImpactPredictorInput(predictorInput) : null;
  const baseCatalog = mergePredictorCatalog(getDefaultMaterialCatalog(), options.catalog ?? []);
  let catalog = mergePredictorCatalog(baseCatalog, predictorAdaptation?.catalogAdditions ?? []);
  const exactImpactSource = options.exactImpactSource ? ExactImpactSourceSchema.parse(options.exactImpactSource) : null;
  const impactFieldContext = options.impactFieldContext ? ImpactFieldContextSchema.parse(options.impactFieldContext) : null;
  const airborneContext = options.airborneContext ? AirborneContextSchema.parse(options.airborneContext) : null;
  const resolvedLayers = resolveLayers(layers, catalog);
  const hasFullyTaggedFloorStack = layers.length > 0 && layers.every((layer) => Boolean(layer.floorRole));
  const normalizedExplicitImpactLayers = hasFullyTaggedFloorStack
    ? normalizeExplicitFloorRoleLayerStack(layers, catalog)
    : null;
  const inferredImpactLayers =
    predictorAdaptation?.sourceLayers.length && !predictorAdaptation.officialFloorSystemId
      ? null
      // Explicit floor roles are operator intent. Only coalesce contiguous same-role pieces for split parity;
      // do not re-infer a fully tagged stack into a broader predictor lane.
      : hasFullyTaggedFloorStack
        ? normalizedExplicitImpactLayers
        : maybeInferFloorRoleLayerStack(layers, catalog);
  const hasVisibleFloorCarrier = layers.some((layer) => Boolean(layer.floorRole));
  let impactResolvedLayers =
    predictorAdaptation?.sourceLayers.length && !predictorAdaptation.officialFloorSystemId
      ? resolveLayers(predictorAdaptation.sourceLayers, catalog)
      : inferredImpactLayers
        ? resolveLayers(inferredImpactLayers, catalog)
        : resolvedLayers;
  const airborneResolvedLayers = (layers.some((layer) => Boolean(layer.floorRole)) || Boolean(inferredImpactLayers))
    ? coalesceMergeSafeAirborneLayers(resolvedLayers)
    : resolvedLayers;
  const totalThicknessMm = round1(airborneResolvedLayers.reduce((sum, layer) => sum + layer.thicknessMm, 0));
  const surfaceMassKgM2 = round1(airborneResolvedLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0));
  const screeningEstimatedRwDb = estimateRwDb(airborneResolvedLayers);
  const screeningCurve = buildCalibratedMassLawCurve(surfaceMassKgM2, screeningEstimatedRwDb);
  const dynamicAirborneResult = options.calculator === "dynamic"
    ? calculateDynamicAirborneResult(airborneResolvedLayers, {
        airborneContext,
        frequenciesHz: screeningCurve.frequenciesHz,
        screeningEstimatedRwDb
      })
    : null;
  const importedCalculatorResult = options.calculator && options.calculator !== "dynamic"
    ? calculateAirborneCalculatorResult(options.calculator, airborneResolvedLayers)
    : null;
  const selectedCalculatorCurve = dynamicAirborneResult?.curve ?? importedCalculatorResult?.curve ?? screeningCurve;
  const selectedCalculatorLabel = dynamicAirborneResult?.label ?? importedCalculatorResult?.label;
  const availableCalculators: readonly AirborneCalculator[] = AIRBORNE_CALCULATORS;
  let airborneOverlayResult = applyAirborneContextOverlay(selectedCalculatorCurve, airborneResolvedLayers, airborneContext);
  if (options.calculator === "dynamic") {
    airborneOverlayResult = applyDynamicAirborneGuards(
      selectedCalculatorCurve,
      airborneOverlayResult,
      airborneResolvedLayers,
      airborneContext
    );
  }
  const verifiedAirborneAnchorResult = applyVerifiedAirborneCatalogAnchor(
    airborneOverlayResult.curve,
    airborneOverlayResult.ratings,
    airborneResolvedLayers,
    airborneContext
  );
  const approximateAirborneFieldCompanionResult = applyApproximateAirborneFieldCompanion(
    verifiedAirborneAnchorResult.ratings,
    airborneResolvedLayers,
    airborneContext
  );
  const curve = verifiedAirborneAnchorResult.curve;
  const ratings = approximateAirborneFieldCompanionResult.ratings;
  const adjustedEstimatedRwDb = Math.max(
    0,
    round1(
      verifiedAirborneAnchorResult.applied && verifiedAirborneAnchorResult.match?.sourceMode === "lab"
        ? ratings.iso717.Rw
        : (dynamicAirborneResult?.rw ?? importedCalculatorResult?.rw ?? screeningEstimatedRwDb) -
          (
            (airborneOverlayResult.overlay?.baseRwDb ?? ratings.iso717.Rw) -
            ratings.iso717.Rw
          )
    )
  );
  const exactImpact = exactImpactSource ? buildExactImpactFromSource(exactImpactSource) : null;
  const directImpactLane = resolveLayerBasedImpactLane({
    catalog,
    exactImpact,
    explicitPredictorInput,
    predictorInput,
    officialFloorSystemId: predictorAdaptation?.officialFloorSystemId ?? null,
    resolvedLayers: impactResolvedLayers
  });
  const directNarrowImpact = directImpactLane.narrowImpact;
  let floorSystemMatch = directImpactLane.floorSystemMatch;
  let boundFloorSystemMatch = directImpactLane.boundFloorSystemMatch;
  let impactCatalogMatch = directImpactLane.impactCatalogMatch;
  let floorSystemRecommendations = directImpactLane.floorSystemRecommendations;
  let narrowImpact = directImpactLane.narrowImpact;
  let boundFloorSystemEstimate = directImpactLane.boundFloorSystemEstimate;
  let floorSystemEstimate = directImpactLane.floorSystemEstimate;
  let explicitDeltaImpact = directImpactLane.explicitDeltaImpact;
  const visibleLayerPredictorBlockerWarning =
    !explicitPredictorInput &&
    !exactImpact &&
    !directImpactLane.floorSystemMatch &&
    !directImpactLane.boundFloorSystemMatch &&
    !directImpactLane.impactCatalogMatch
      ? getVisibleLayerPredictorBlockerWarning(layers, catalog)
      : null;

  if (
    !explicitPredictorInput &&
    !exactImpact &&
    !directImpactLane.floorSystemMatch &&
    !directImpactLane.boundFloorSystemMatch &&
    !directImpactLane.impactCatalogMatch
  ) {
    const derivedPredictorInput = maybeBuildImpactPredictorInputFromLayerStack(layers, {}, undefined, catalog);

    if (derivedPredictorInput) {
      const derivedPredictorAdaptation = adaptImpactPredictorInput(derivedPredictorInput);
      const derivedCatalog = mergePredictorCatalog(baseCatalog, derivedPredictorAdaptation.catalogAdditions);
      const derivedImpactResolvedLayers =
        derivedPredictorAdaptation.sourceLayers.length && !derivedPredictorAdaptation.officialFloorSystemId
          ? resolveLayers(derivedPredictorAdaptation.sourceLayers, derivedCatalog)
          : resolvedLayers;
      const derivedImpactLane = resolveLayerBasedImpactLane({
        catalog: derivedCatalog,
        exactImpact,
        predictorInput: derivedPredictorInput,
        officialFloorSystemId: derivedPredictorAdaptation.officialFloorSystemId,
        resolvedLayers: derivedImpactResolvedLayers
      });
      const shouldUseDerived =
        Boolean(
          derivedImpactLane.floorSystemMatch ||
            derivedImpactLane.boundFloorSystemMatch ||
            derivedImpactLane.impactCatalogMatch ||
            derivedImpactLane.predictorSpecificFloorSystemEstimate
        ) ||
        (!directNarrowImpact &&
          !directImpactLane.floorSystemEstimate &&
          !directImpactLane.boundFloorSystemEstimate &&
          Boolean(
            derivedImpactLane.narrowImpact ||
              derivedImpactLane.floorSystemEstimate ||
              derivedImpactLane.boundFloorSystemEstimate
          ));

      if (shouldUseDerived) {
        predictorInput = derivedPredictorInput;
        predictorInputMode = "derived_from_visible_layers";
        predictorAdaptation = derivedPredictorAdaptation;
        catalog = derivedCatalog;
        impactResolvedLayers = derivedImpactResolvedLayers;
        floorSystemMatch = derivedImpactLane.floorSystemMatch;
        boundFloorSystemMatch = derivedImpactLane.boundFloorSystemMatch;
        impactCatalogMatch = derivedImpactLane.impactCatalogMatch;
        floorSystemRecommendations = derivedImpactLane.floorSystemRecommendations;
        narrowImpact = derivedImpactLane.narrowImpact;
        boundFloorSystemEstimate = derivedImpactLane.boundFloorSystemEstimate;
        floorSystemEstimate = derivedImpactLane.floorSystemEstimate;
        explicitDeltaImpact = derivedImpactLane.explicitDeltaImpact;
      }
    }
  }
  const { impact, lowerBoundImpact } = finalizeResolvedImpactLane({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    exactImpactSource,
    explicitDeltaImpact,
    fallbackSupplementaryImpact: narrowImpact,
    floorSystemEstimate,
    floorSystemMatch,
    impactCatalogMatch,
    impactFieldContext,
    narrowImpact,
    predictorInput,
    preferredSupplementaryImpact: directNarrowImpact,
    resolvedLayers: impactResolvedLayers
  });
  const floorCarrier = pickFloorCarrier({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    floorSystemEstimate,
    floorSystemMatch
  });
  const hideLowConfidenceProxyAirborne = shouldHideLowConfidenceProxyAirborne(floorSystemEstimate);
  const floorSystemRatings = hideLowConfidenceProxyAirborne
    ? null
    : buildFloorSystemRatings({
        boundFloorSystemEstimate,
        boundFloorSystemMatch,
        floorSystemEstimate,
        floorSystemMatch,
        impact,
        lowerBoundImpact,
        screeningBasis: explicitPredictorInput ? undefined : "screening_mass_law_curve_seed_v3",
        screeningLayers: explicitPredictorInput
          ? explicitDeltaImpact
            ? pickReferenceFloorRatingLayers(impactResolvedLayers)
            : impactResolvedLayers
          : undefined,
        screeningRwDb: explicitPredictorInput ? null : ratings.iso717.Rw,
        screeningRwPlusCtrDb: explicitPredictorInput ? null : round1(ratings.iso717.Rw + ratings.iso717.Ctr)
      });
  const hasInferredConcreteCeilingHelperCarrierSignal = hasInferredConcreteCeilingHelperSupportSignal({
    inferredImpactLayers,
    visibleLayers: layers
  });
  const hasImpactBackedScreeningFloorCarrierSignal = Boolean(
    impact &&
      floorSystemRatings &&
      (hasVisibleFloorCarrier || hasInferredConcreteCeilingHelperCarrierSignal)
  );
  const hasFloorSupportCarrierSignal = Boolean(
    floorSystemMatch ||
      floorSystemEstimate ||
      boundFloorSystemMatch ||
      boundFloorSystemEstimate ||
      impactCatalogMatch ||
      explicitDeltaImpact ||
      hasImpactBackedScreeningFloorCarrierSignal
  );
  const targetOutputSupport = analyzeTargetOutputSupport({
    floorCarrier: hasFloorSupportCarrierSignal ? floorSystemRatings ?? floorCarrier : null,
    impact,
    lowerBoundImpact,
    metrics: {
      airborneIsoDescriptor: ratings.iso717.descriptor,
      estimatedCDb: ratings.iso717.C,
      estimatedCtrDb: ratings.iso717.Ctr,
      estimatedDnADb: ratings.field?.DnA,
      estimatedDnTADb: ratings.field?.DnTA,
      estimatedDnTAkDb: ratings.field?.DnTAk,
      estimatedDnTwDb: ratings.field?.DnTw,
      estimatedDnWDb: ratings.field?.DnW,
      estimatedRwDb: adjustedEstimatedRwDb,
      estimatedRwPrimeDb: ratings.field?.RwPrime ?? ratings.iso717.RwPrime,
      estimatedStc: ratings.astmE413.STC
    },
    targetOutputs: options.targetOutputs ?? []
  });
  const {
    dynamicImpactTrace,
    impactPredictorStatus,
    impactSupport
  } = buildResolvedImpactArtifacts({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    catalog,
    floorSystemEstimate,
    floorSystemMatch,
    impact,
    impactCatalogMatch,
    impactFieldContext,
    lowerBoundImpact,
    predictorInput,
    predictorInputMode,
    resolvedLayers: impactResolvedLayers,
    targetOutputSupport
  });
  const warnings = buildEstimateWarnings(resolvedLayers, selectedCalculatorLabel);
  warnings.push(...(dynamicAirborneResult?.warnings ?? []));
  warnings.push(...airborneOverlayResult.warnings);
  warnings.push(...verifiedAirborneAnchorResult.warnings);
  warnings.push(...approximateAirborneFieldCompanionResult.warnings);
  warnings.push(...buildTargetOutputWarnings(targetOutputSupport));

  if (predictorAdaptation) {
    warnings.push(...predictorAdaptation.notes);
  }

  if (hideLowConfidenceProxyAirborne) {
    warnings.push(
      "Low-confidence published-family fallback is active without finite airborne companions. DynEcho kept unavailable proxy airborne outputs hidden instead of fabricating supported Rw / Ctr values."
    );
  }

  if (predictorInputMode === "derived_from_visible_layers") {
    warnings.push(
      "Impact predictor topology was derived from visible floor-role layers, so curated family and predictor lanes can activate without a hidden selector."
    );
  } else if (visibleLayerPredictorBlockerWarning) {
    warnings.push(visibleLayerPredictorBlockerWarning);
  }

  if (exactImpact) {
    warnings.push(
      `Impact ratings were derived from an exact ${exactImpactSource?.labOrField ?? "lab"} impact-band source on the ISO 717-2 nominal grid; the airborne TL curve stayed on the ${selectedCalculatorLabel ?? "screening"} path.`
    );
  } else if (exactImpactSource) {
    warnings.push(
      "Exact impact-band input was ignored because it did not match a supported ISO 717-2 nominal octave or one-third-octave band set."
    );
  }

  if (floorSystemMatch) {
    warnings.push(
      `Curated exact floor-system match active: ${floorSystemMatch.system.label}. Exact floor-family impact and airborne companion ratings are available in the operator deck.`
    );
  } else if (boundFloorSystemMatch) {
    warnings.push(
      `Curated bound-only floor-system match active: ${boundFloorSystemMatch.system.label}. Airborne family data is exact, while impact stays conservative as an upper-bound lane.`
    );
  } else if (floorSystemEstimate) {
    warnings.push(
      floorSystemEstimate.impact.basis === "predictor_lightweight_steel_fl28_interpolation_estimate"
        ? `Published family estimate active: lightweight steel FL-28 interpolation at ${floorSystemEstimate.fitPercent}% fit. DynEcho stayed inside the curated UBIQ open-web family instead of drifting into a broad steel blend.`
        : `Published family estimate active: ${floorSystemEstimate.structuralFamily} ${floorSystemEstimate.kind.replaceAll("_", " ")} at ${floorSystemEstimate.fitPercent}% fit.`
    );
  } else if (boundFloorSystemEstimate) {
    warnings.push(
      `Published bound-only family estimate active: ${boundFloorSystemEstimate.structuralFamily} ${boundFloorSystemEstimate.kind.replaceAll("_", " ")}. DynEcho is carrying official upper-bound impact support without fabricating an exact Ln,w value.`
    );
  } else if (floorSystemRecommendations.length > 0) {
    const recommendationWarning = buildClosestFloorSystemRecommendationWarning({
      catalog,
      recommendations: floorSystemRecommendations,
      resolvedLayers: impactResolvedLayers
    });

    if (recommendationWarning) {
      warnings.push(recommendationWarning);
    }
  }

  if (impactCatalogMatch) {
    warnings.push(
      impactCatalogMatch.lowerBoundImpact && impactCatalogMatch.impact
        ? `Official impact product row active: ${impactCatalogMatch.catalog.label}. DynEcho is carrying official product evidence together with conservative lower-bound support while keeping the live impact lane on the matched metric.`
        : impactCatalogMatch.lowerBoundImpact
          ? `Official lower-bound catalog support active: ${impactCatalogMatch.catalog.label}. DynEcho is carrying conservative product-row support without fabricating an exact Ln,w metric.`
          : `Official impact product row active: ${impactCatalogMatch.catalog.label}. DynEcho is carrying official product evidence before falling back to the narrow heavy-floor formula.`
    );
  }

  if (impactFieldContext) {
    if (impact?.fieldEstimateProfile === "direct_flanking_energy_sum" && typeof impact.LPrimeNW === "number") {
      warnings.push(
        typeof impact.LPrimeNTw === "number"
          ? "Live direct+flanking field path is active on the main impact lane. Explicit path offsets are being summed before standardized field re-rating."
          : "Live direct+flanking field path is active on the main impact lane. Explicit path offsets are being summed on the field side before ISO 717-2 re-rating."
      );
      if (typeof impact.fieldEstimateLowerTreatmentReductionDb === "number") {
        warnings.push(
          "An explicit impact-side lower-treatment reduction ΔLd was applied to the direct path before direct+flanking energy summation; this was not inferred from airborne ΔR."
        );
      }
      if (typeof impact.fieldEstimateExpertPathModifierCount === "number" && impact.fieldEstimateExpertPathModifierCount > 0) {
        warnings.push(
          "Explicit flanking-path modifiers were also applied from expert junction inputs (length / isolation / short-circuit / Kij-style penalties)."
        );
      }
    } else if (impact?.guideEstimateProfile && typeof impact.LPrimeNT50 === "number") {
      warnings.push(
        "Live Turkish simple-guide supplement is active on the main impact lane. Ln,w+CI, K, and Hd are now being carried through the engine boundary together with any verified Table 2.7 / Table 2.8 lookups."
      );
    } else if (impact && typeof impact.LPrimeNTw === "number") {
      warnings.push(
        "Live field-side supplement is active on the main impact lane. K and receiving-room context are now carried through the engine boundary, not only the guide lane."
      );
      if (
        impact.fieldEstimateProfile === "explicit_field_lprimenw_from_lnw_plus_k" &&
        typeof impact.fieldEstimateLowerTreatmentReductionDb === "number"
      ) {
        warnings.push(
          "An explicit impact-side lower-treatment reduction ΔLd was applied before the field-side K correction and any subsequent room-volume standardization; this was not inferred from airborne ΔR."
        );
      }
    } else if (lowerBoundImpact && typeof lowerBoundImpact.LPrimeNTwUpperBound === "number") {
      warnings.push(
        "Live field-side conservative upper-bound support is active on the main impact lane. Curated bound support is being normalized with K and receiving-room context without fabricating an exact Ln,w."
      );
    }
  }

  if (
    airborneContext?.contextMode &&
    airborneContext.contextMode !== "element_lab" &&
    ratings.field?.geometryMissing &&
    Array.isArray(ratings.field.geometryNeeded) &&
    ratings.field.geometryNeeded.length > 0
  ) {
    warnings.push(
      `Airborne field conversion is incomplete. ${ratings.field.geometryNeeded.join(", ")} must be defined before DnT,w / DnT,A can be calculated from the apparent curve.`
    );
  }

  if (
    airborneContext?.contextMode &&
    airborneContext.contextMode !== "element_lab" &&
    ratings.field?.absorptionDataMissing &&
    Array.isArray(ratings.field.absorptionDataNeeded) &&
    ratings.field.absorptionDataNeeded.length > 0
  ) {
    warnings.push(
      `Airborne field absorption metadata is incomplete. ${ratings.field.absorptionDataNeeded.join(", ")} is still missing for a fuller Dn / absorption trace, even though the current curve can already produce the available field level-difference outputs.`
    );
  }

  const result: AssemblyCalculation = {
    availableCalculators: [...availableCalculators],
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    airborneOverlay: airborneOverlayResult.overlay,
    calculatorId: dynamicAirborneResult?.id ?? importedCalculatorResult?.id,
    calculatorLabel: dynamicAirborneResult?.label ?? importedCalculatorResult?.label,
    dynamicAirborneTrace: dynamicAirborneResult?.trace,
    dynamicImpactTrace: dynamicImpactTrace ?? undefined,
    impact,
    impactCatalogMatch,
    impactPredictorStatus,
    impactSupport,
    floorSystemEstimate,
    floorSystemMatch,
    floorSystemRatings,
    floorSystemRecommendations,
    lowerBoundImpact,
    ok: true,
    curve,
    layers: resolvedLayers,
    metrics: {
      airborneIsoDescriptor: ratings.iso717.descriptor,
      totalThicknessMm,
      surfaceMassKgM2,
      estimatedRwDb: adjustedEstimatedRwDb,
      estimatedRwPrimeDb: ratings.field?.RwPrime ?? ratings.iso717.RwPrime,
      estimatedCDb: ratings.iso717.C,
      estimatedCtrDb: ratings.iso717.Ctr,
      estimatedDnTwDb: ratings.field?.DnTw,
      estimatedDnTADb: ratings.field?.DnTA,
      estimatedDnTAkDb: ratings.field?.DnTAk,
      estimatedDnWDb: ratings.field?.DnW,
      estimatedDnADb: ratings.field?.DnA,
      estimatedStc: ratings.astmE413.STC,
      airGapCount: resolvedLayers.filter((layer) => layer.material.category === "gap").length,
      insulationCount: resolvedLayers.filter((layer) => layer.material.category === "insulation").length,
      method: dynamicAirborneResult?.id ?? importedCalculatorResult?.id ?? "screening_mass_law_curve_seed_v3"
    },
    ratings,
    supportedImpactOutputs: targetOutputSupport.supportedImpactOutputs,
    supportedTargetOutputs: targetOutputSupport.supportedTargetOutputs,
    targetOutputs: targetOutputSupport.targetOutputs,
    unsupportedImpactOutputs: targetOutputSupport.unsupportedImpactOutputs,
    unsupportedTargetOutputs: targetOutputSupport.unsupportedTargetOutputs,
    warnings
  };

  return AssemblyCalculationSchema.parse(result);
}
