import {
  ExactImpactSourceSchema,
  ImpactFieldContextSchema,
  ImpactOnlyCalculationSchema,
  ImpactPredictorInputSchema,
  LayerInputSchema,
  type AcousticInputFieldId,
  type FloorSystemBoundEstimateResult,
  type FloorSystemBoundMatchResult,
  type FloorSystemEstimateResult,
  type FloorSystemMatchResult,
  type ImpactCatalogMatchResult,
  type ExactImpactSource,
  type FloorSystemAirborneRatings,
  type ImpactFieldContext,
  type ImpactCalculation,
  type ImpactOnlyCalculation,
  type ImpactOnlySourceMode,
  type ImpactPredictorInput,
  type LayerInput,
  type MaterialDefinition,
  type RequestedOutputId,
  type ResolvedLayer
} from "@dynecho/shared";

import { resolveBoundFloorSystemById } from "./bound-floor-system-match";
import { hasBoundOnlyUbiqOpenWebCarpetCombinedProfile } from "./bound-only-floor-near-miss";
import {
  buildAnswerEngineV1FloorAstmIicAiicUnsupportedBoundary,
  buildAnswerEngineV1FloorFieldImpactNeedsInputBoundary,
  buildAnswerEngineV1FloorImpactNeedsInputBoundary,
  buildAnswerEngineV1FloorRolelessHelperOnlyBoundary,
  isAnswerEngineV1PureFloorAstmIicAiicRequest,
  isAnswerEngineV1PureFloorFieldImpactRequest,
  isAnswerEngineV1RolelessHelperOnlyFloorStack
} from "./acoustic-answer-engine-v1-floor-boundary";
import {
  auditAcousticCalculatorAnswerEngineV1OutputOwnership,
  getAcousticCalculatorAnswerEngineV1FloorLabCompanionOutputs
} from "./acoustic-answer-engine-v1-owner-audit";
import { buildFloorSystemRatings } from "./floor-system-ratings";
import {
  resolveExactFloorSystemById
} from "./floor-system-match";
import {
  ASTM_E989_IMPACT_RATING_BASIS,
  buildOwnedImpactFromExactSource
} from "./impact-astm-e989";
import {
  adaptImpactPredictorInput,
  getVisibleLayerPredictorBlockerWarning,
  maybeInferFloorRoleLayerStack,
  maybeBuildImpactPredictorInputFromLayerStack,
  mergePredictorCatalog,
  normalizeExplicitFloorRoleLayerStack
} from "./impact-predictor-input";
import {
  filterImpactCatalogMatchForExplicitPredictorInput,
  matchImpactProductCatalog,
  resolveImpactProductCatalogById
} from "./impact-product-catalog";
import {
  inferImpactSupportingElementFamilyFromLayers,
  inferImpactSupportingElementFamilyFromPredictorInput
} from "./impact-supporting-element-family";
import {
  buildResolvedImpactArtifacts,
  finalizeResolvedImpactLane,
  resolveLayerBasedImpactLane,
  shouldHideLowConfidenceProxyAirborne
} from "./impact-lane";
import {
  buildLayerCombinationResolverTraceForImpactOnly
} from "./layer-combination-resolver-runtime-candidate-surface-parity";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { getFloorFamilySourceGuard } from "./floor-family-source-guard";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import {
  buildHeavyConcreteCombinedImpactFormulaFallbackBlockerWarning,
  collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
} from "./heavy-concrete-combined-impact-formula-corridor";
import {
  collectCompositePanelPublishedInteractionDeltaLwMissingPhysicalInputs
} from "./composite-panel-published-interaction-estimate";
import {
  collectTimberCltDeltaLwFormulaMissingPhysicalInputs
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";
import {
  collectLightweightConcreteDeltaLwMissingPhysicalInputs
} from "./lightweight-concrete-delta-lw-runtime-corridor";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  type SteelFloorFormulaInputSurface
} from "./steel-floor-formula-input-surface";
import {
  buildMixedSupportFloorImpactFormulaFallbackBlockerWarning,
  buildMixedSupportFloorImpactUnsupportedBoundary,
  collectMixedSupportFloorImpactMissingPhysicalInputs
} from "./mixed-support-floor-impact-runtime-corridor";
import {
  hasReinforcedConcreteLowConfidenceProxyAirborne,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_PROXY_AIRBORNE_WARNING
} from "./reinforced-concrete-low-confidence-airborne";
import { buildSteelFloorImpactFormulaFallbackBlockerWarning } from "./steel-floor-impact-formula-corridor";
import { analyzeTargetOutputSupport, buildTargetOutputWarnings } from "./target-output-support";
import type { DynamicCalculatorFloorImpactContext } from "./dynamic-calculator-route-input-topology";

export type CalculateImpactOnlyOptions = {
  catalog?: readonly MaterialDefinition[];
  exactImpactSource?: ExactImpactSource | null;
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
  impactFieldContext?: ImpactFieldContext | null;
  impactPredictorInput?: ImpactPredictorInput | null;
  officialFloorSystemId?: string | null;
  officialImpactCatalogId?: string | null;
  sourceLayers?: readonly LayerInput[];
  steelFloorFormulaSurface?: SteelFloorFormulaInputSurface | null;
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

function buildFloorImpactPredictorSeed(input: {
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
}): ImpactPredictorInput {
  const dynamicStiffnessMNm3 = input.floorImpactContext?.resilientLayerDynamicStiffnessMNm3;
  const loadBasisKgM2 = input.floorImpactContext?.loadBasisKgM2;

  return {
    ...(typeof loadBasisKgM2 === "number" && loadBasisKgM2 > 0 ? { loadBasisKgM2 } : {}),
    ...(typeof dynamicStiffnessMNm3 === "number" && dynamicStiffnessMNm3 > 0
      ? {
          resilientLayer: {
            dynamicStiffnessMNm3
          }
        }
      : {})
  };
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

function pickReferenceFloorRatingLayers(layers: readonly ResolvedLayer[]): readonly ResolvedLayer[] {
  const baseStructureLayers = layers.filter((layer) => layer.floorRole === "base_structure");

  return baseStructureLayers.length > 0 ? baseStructureLayers : layers;
}

function parkImpactOnlyTargetOutputs(
  result: ImpactOnlyCalculation,
  outputs: readonly RequestedOutputId[]
): void {
  if (outputs.length === 0) {
    return;
  }

  const outputSet = new Set<RequestedOutputId>(outputs);
  const supportedTargetOutputs = result.supportedTargetOutputs.filter(
    (output: RequestedOutputId) => !outputSet.has(output)
  );
  const unsupportedTargetOutputSet = new Set<RequestedOutputId>([
    ...result.unsupportedTargetOutputs,
    ...result.targetOutputs.filter((output: RequestedOutputId) => outputSet.has(output))
  ]);
  const unsupportedTargetOutputs = result.targetOutputs.filter(
    (output: RequestedOutputId) => unsupportedTargetOutputSet.has(output) && !supportedTargetOutputs.includes(output)
  );
  const unsupportedImpactOutputSet = new Set<RequestedOutputId>([
    ...result.unsupportedImpactOutputs,
    ...unsupportedTargetOutputs.filter((output: RequestedOutputId) => result.supportedImpactOutputs.includes(output))
  ]);

  result.supportedImpactOutputs = result.supportedImpactOutputs.filter((output: RequestedOutputId) => !outputSet.has(output));
  result.supportedTargetOutputs = supportedTargetOutputs;
  result.unsupportedImpactOutputs = result.targetOutputs.filter((output: RequestedOutputId) =>
    unsupportedImpactOutputSet.has(output)
  );
  result.unsupportedTargetOutputs = unsupportedTargetOutputs;
}

function applyAcousticCalculatorAnswerEngineV1FloorRolelessHelperOnlyBoundary(
  result: ImpactOnlyCalculation
): void {
  const hasPublishedImpactCandidate = Boolean(result.impact || result.floorSystemEstimate);

  if (
    !hasPublishedImpactCandidate ||
    !isAnswerEngineV1RolelessHelperOnlyFloorStack({
      layers: result.visibleLayers,
      targetOutputs: result.targetOutputs
    })
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorRolelessHelperOnlyBoundary(result.targetOutputs);
  result.acousticAnswerBoundary = boundary;
  parkImpactOnlyTargetOutputs(result, result.targetOutputs);
  result.boundFloorSystemEstimate = null;
  result.boundFloorSystemMatch = null;
  result.dynamicImpactTrace = undefined;
  result.floorCarrier = null;
  result.floorSystemEstimate = null;
  result.floorSystemMatch = null;
  result.floorSystemRatings = null;
  result.impact = null;
  result.impactCatalogMatch = null;
  result.impactPredictorStatus = null;
  result.impactSupport = null;
  result.lowerBoundImpact = null;
  result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected needs_input for ${result.targetOutputs.join(", ")}; assign ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes helper-only timber/open-web floor answers.`
  );
  result.warnings.push(
    `Floor roles needed before impact output promotion: ${boundary.missingPhysicalInputs.join(", ")}.`
  );
}

function applyAcousticCalculatorAnswerEngineV1FloorAstmIicAiicUnsupportedBoundary(
  result: ImpactOnlyCalculation
): void {
  if (
    result.acousticAnswerBoundary ||
    !isAnswerEngineV1PureFloorAstmIicAiicRequest({
      supportedTargetOutputs: result.supportedTargetOutputs,
      targetOutputs: result.targetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs
    })
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorAstmIicAiicUnsupportedBoundary(result.targetOutputs);
  if (!boundary) {
    return;
  }

  result.acousticAnswerBoundary = boundary;
  result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected unsupported for ${boundary.unsupportedOutputs.join(", ")}; ASTM IIC/AIIC need ${boundary.requiredInputs.join(", ")} before DynEcho publishes those ratings.`
  );
}

function hasAnswerEngineV1ImpactOnlyFieldContext(input: {
  context: ImpactFieldContext | null;
  targetOutputs: readonly RequestedOutputId[];
}): boolean {
  const context = input.context;
  const hasFieldPath = Boolean(
    typeof context?.fieldKDb === "number" ||
      typeof context?.guideMassRatio === "number" ||
      typeof context?.directPathOffsetDb === "number" ||
      (Array.isArray(context?.flankingPaths) && context.flankingPaths.length > 0)
  );
  const needsStandardizedField =
    input.targetOutputs.includes("L'nT,w") || input.targetOutputs.includes("L'nT,50");
  const needsLowFrequency = input.targetOutputs.includes("L'nT,50");
  const hasReceivingVolume =
    typeof context?.receivingRoomVolumeM3 === "number" && context.receivingRoomVolumeM3 > 0;
  const hasLowFrequencyOwner = typeof context?.ci50_2500Db === "number" && Number.isFinite(context.ci50_2500Db);

  return hasFieldPath && (!needsStandardizedField || hasReceivingVolume) && (!needsLowFrequency || hasLowFrequencyOwner);
}

function applyAcousticCalculatorAnswerEngineV1FloorFieldImpactNeedsInputBoundary(input: {
  impactFieldContext: ImpactFieldContext | null;
  result: ImpactOnlyCalculation;
}): void {
  const hasLabImpactAnchor = Boolean(
    input.result.impact?.labOrField !== "field" &&
      (typeof input.result.impact?.LnW === "number" || Boolean(input.result.lowerBoundImpact))
  );

  if (
    input.result.acousticAnswerBoundary ||
    !hasLabImpactAnchor ||
    !isAnswerEngineV1PureFloorFieldImpactRequest({
      supportedTargetOutputs: input.result.supportedTargetOutputs,
      targetOutputs: input.result.targetOutputs,
      unsupportedTargetOutputs: input.result.unsupportedTargetOutputs
    }) ||
    hasAnswerEngineV1ImpactOnlyFieldContext({
      context: input.impactFieldContext,
      targetOutputs: input.result.targetOutputs
    })
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorFieldImpactNeedsInputBoundary({
    missingPhysicalInputs: ["impactFieldContext"],
    targetOutputs: input.result.targetOutputs
  });
  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  input.result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected needs_input for ${boundary.unsupportedOutputs.join(", ")}; provide ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes floor field-impact answers.`
  );
}

function applyAcousticCalculatorAnswerEngineV1HeavyConcreteCombinedNeedsInputBoundary(input: {
  predictorInput: ImpactPredictorInput | null;
  result: ImpactOnlyCalculation;
}): void {
  if (input.result.acousticAnswerBoundary || input.result.impact) {
    return;
  }

  const missingPhysicalInputs = collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs(input.predictorInput);
  const stoppedOutputs: RequestedOutputId[] = input.result.targetOutputs.filter((output: RequestedOutputId) =>
    output === "Ln,w" || output === "DeltaLw"
  );
  const unsupportedOutputSet = new Set<RequestedOutputId>(input.result.unsupportedTargetOutputs);

  if (
    missingPhysicalInputs.length === 0 ||
    stoppedOutputs.length === 0 ||
    !stoppedOutputs.every((output: RequestedOutputId) => unsupportedOutputSet.has(output))
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorImpactNeedsInputBoundary({
    missingPhysicalInputs,
    targetOutputs: stoppedOutputs
  });
  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  input.result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected needs_input for ${boundary.unsupportedOutputs.join(", ")}; provide ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes reinforced-concrete combined floor impact answers.`
  );
}

function applyAcousticCalculatorAnswerEngineV1TimberCltDeltaLwNeedsInputBoundary(input: {
  predictorInput: ImpactPredictorInput | null;
  result: ImpactOnlyCalculation;
}): void {
  if (input.result.acousticAnswerBoundary) {
    return;
  }

  const missingPhysicalInputs = collectTimberCltDeltaLwFormulaMissingPhysicalInputs(input.predictorInput);
  const stoppedOutputs: RequestedOutputId[] = input.result.targetOutputs.filter((output: RequestedOutputId) =>
    output === "DeltaLw"
  );
  const unsupportedOutputSet = new Set<RequestedOutputId>(input.result.unsupportedTargetOutputs);

  if (
    missingPhysicalInputs.length === 0 ||
    stoppedOutputs.length === 0 ||
    !stoppedOutputs.every((output: RequestedOutputId) => unsupportedOutputSet.has(output))
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorImpactNeedsInputBoundary({
    missingPhysicalInputs,
    targetOutputs: stoppedOutputs
  });
  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  input.result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected needs_input for ${boundary.unsupportedOutputs.join(", ")}; provide ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes timber/CLT floor DeltaLw answers.`
  );
}

function applyPostV1GateCYCompositePanelDeltaLwNeedsInputBoundary(input: {
  predictorInput: ImpactPredictorInput | null;
  result: ImpactOnlyCalculation;
}): void {
  if (input.result.acousticAnswerBoundary) {
    return;
  }

  const missingPhysicalInputs = collectCompositePanelPublishedInteractionDeltaLwMissingPhysicalInputs(
    input.predictorInput
  );
  if (missingPhysicalInputs.length === 0) {
    return;
  }

  const unsupportedOutputSet = new Set<RequestedOutputId>(input.result.unsupportedTargetOutputs);
  const stoppedOutputs = input.result.targetOutputs.filter((output: RequestedOutputId) =>
    output === "DeltaLw" && unsupportedOutputSet.has(output)
  );
  if (stoppedOutputs.length === 0) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorImpactNeedsInputBoundary({
    missingPhysicalInputs,
    targetOutputs: stoppedOutputs
  });
  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  parkImpactOnlyTargetOutputs(input.result, boundary.unsupportedOutputs);
  input.result.warnings.push(
    `Post-V1 Gate CY selected needs_input for ${boundary.unsupportedOutputs.join(", ")}; provide ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes composite-panel DeltaLw from the same-family bare-minus-treated Ln,w owner.`
  );
}

function applyPostV1GateDBLightweightConcreteDeltaLwNeedsInputBoundary(input: {
  predictorInput: ImpactPredictorInput | null;
  result: ImpactOnlyCalculation;
}): void {
  if (input.result.acousticAnswerBoundary) {
    return;
  }

  const missingPhysicalInputs = collectLightweightConcreteDeltaLwMissingPhysicalInputs(input.predictorInput);
  if (missingPhysicalInputs.length === 0) {
    return;
  }

  const unsupportedOutputSet = new Set<RequestedOutputId>(input.result.unsupportedTargetOutputs);
  const stoppedOutputs = input.result.targetOutputs.filter((output: RequestedOutputId) =>
    output === "DeltaLw" && unsupportedOutputSet.has(output)
  );
  if (stoppedOutputs.length === 0) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorImpactNeedsInputBoundary({
    missingPhysicalInputs,
    targetOutputs: stoppedOutputs
  });
  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  parkImpactOnlyTargetOutputs(input.result, boundary.unsupportedOutputs);
  input.result.warnings.push(
    `Post-V1 Gate DB selected needs_input for ${boundary.unsupportedOutputs.join(", ")}; provide ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes lightweight-concrete DeltaLw.`
  );
}

function applyPostV1GateDKSteelVisibleFormulaInputNeedsInputBoundary(input: {
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  result: ImpactOnlyCalculation;
}): void {
  if (input.result.acousticAnswerBoundary) {
    return;
  }

  const unsupportedOutputSet = new Set<RequestedOutputId>(input.result.unsupportedTargetOutputs);
  const stoppedOutputs: RequestedOutputId[] = input.result.targetOutputs.filter((output: RequestedOutputId) =>
    (output === "DeltaLw" || output === "Ln,w") && unsupportedOutputSet.has(output)
  );

  if (input.missingPhysicalInputs.length === 0 || stoppedOutputs.length === 0) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorImpactNeedsInputBoundary({
    missingPhysicalInputs: input.missingPhysicalInputs,
    targetOutputs: stoppedOutputs
  });
  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  parkImpactOnlyTargetOutputs(input.result, boundary.unsupportedOutputs);
  input.result.boundFloorSystemEstimate = null;
  input.result.boundFloorSystemMatch = null;
  input.result.dynamicImpactTrace = undefined;
  input.result.floorCarrier = null;
  input.result.floorSystemEstimate = null;
  input.result.floorSystemMatch = null;
  input.result.floorSystemRatings = null;
  input.result.impact = null;
  input.result.impactCatalogMatch = null;
  input.result.impactPredictorStatus = null;
  input.result.impactSupport = null;
  input.result.lowerBoundImpact = null;
  input.result.warnings.push(
    `Post-V1 Gate DK selected needs_input for ${boundary.unsupportedOutputs.join(", ")}; provide ${boundary.missingPhysicalInputs.join(", ")} before DynEcho routes visible steel floor layers through the steel Ln,w / DeltaLw formula corridor on the impact-only surface.`
  );
}

function applyAcousticCalculatorAnswerEngineV1MixedSupportFloorImpactNeedsInputBoundary(input: {
  predictorInput: ImpactPredictorInput | null;
  result: ImpactOnlyCalculation;
}): void {
  if (input.result.acousticAnswerBoundary || input.result.impact) {
    return;
  }

  const missingPhysicalInputs = collectMixedSupportFloorImpactMissingPhysicalInputs(input.predictorInput);
  const stoppedOutputs: RequestedOutputId[] = input.result.targetOutputs.filter((output: RequestedOutputId) =>
    output === "Ln,w" || output === "DeltaLw"
  );
  const unsupportedOutputSet = new Set<RequestedOutputId>(input.result.unsupportedTargetOutputs);

  if (
    missingPhysicalInputs.length === 0 ||
    stoppedOutputs.length === 0 ||
    !stoppedOutputs.every((output: RequestedOutputId) => unsupportedOutputSet.has(output))
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorImpactNeedsInputBoundary({
    missingPhysicalInputs,
    targetOutputs: stoppedOutputs
  });
  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  input.result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected needs_input for ${boundary.unsupportedOutputs.join(", ")}; provide ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes mixed-support floor impact answers.`
  );
}

function applyAcousticCalculatorAnswerEngineV1MixedSupportFloorImpactUnsupportedBoundary(input: {
  predictorInput: ImpactPredictorInput | null;
  result: ImpactOnlyCalculation;
}): void {
  if (input.result.acousticAnswerBoundary || input.result.impact) {
    return;
  }

  const blockerWarning = buildMixedSupportFloorImpactFormulaFallbackBlockerWarning(input.predictorInput);
  if (!blockerWarning || collectMixedSupportFloorImpactMissingPhysicalInputs(input.predictorInput).length > 0) {
    return;
  }

  const boundary = buildMixedSupportFloorImpactUnsupportedBoundary(input.result.targetOutputs);
  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  input.result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected unsupported for ${boundary.unsupportedOutputs.join(", ")}; mixed-support partitions outside the explicit single-primary-carrier owner corridor need a separate formula owner before DynEcho publishes values.`
  );
}

export function calculateImpactOnly(
  inputVisibleLayers: readonly LayerInput[],
  options: CalculateImpactOnlyOptions = {}
): ImpactOnlyCalculation {
  const visibleLayers = inputVisibleLayers.map((layer) => LayerInputSchema.parse(layer));
  const explicitPredictorInput = options.impactPredictorInput
    ? ImpactPredictorInputSchema.parse(options.impactPredictorInput)
    : null;
  const baseCatalog = mergePredictorCatalog(getDefaultMaterialCatalog(), options.catalog ?? []);
  const steelFloorFormulaSurface = options.steelFloorFormulaSurface ?? null;
  const canUseVisibleSteelFormulaSurface = Boolean(
    !explicitPredictorInput &&
      !options.exactImpactSource &&
      !options.officialFloorSystemId &&
      !options.officialImpactCatalogId &&
      !options.sourceLayers &&
      steelFloorFormulaSurface
  );
  const visibleSteelFormulaSurfaceResult =
    canUseVisibleSteelFormulaSurface && steelFloorFormulaSurface
      ? buildSteelFloorFormulaPredictorInputFromSurface({
          catalog: baseCatalog,
          layers: visibleLayers,
          surface: steelFloorFormulaSurface,
          targetOutputs: options.targetOutputs
        })
      : null;
  const visibleSteelFormulaSurfaceRouteActive = Boolean(
    visibleSteelFormulaSurfaceResult?.formulaTargetOutputRequested &&
      visibleSteelFormulaSurfaceResult.steelFloorStackDetected
  );
  const visibleSteelFormulaPredictorInput =
    visibleSteelFormulaSurfaceRouteActive
      ? visibleSteelFormulaSurfaceResult?.impactPredictorInput ?? null
      : null;
  const visibleSteelFormulaMissingPhysicalInputs =
    visibleSteelFormulaSurfaceRouteActive
      ? visibleSteelFormulaSurfaceResult?.missingPhysicalInputs ?? []
      : [];
  let predictorInput = explicitPredictorInput ?? visibleSteelFormulaPredictorInput;
  let predictorInputMode: "derived_from_visible_layers" | "explicit_predictor_input" | undefined =
    explicitPredictorInput
      ? "explicit_predictor_input"
      : visibleSteelFormulaPredictorInput
        ? "derived_from_visible_layers"
        : undefined;
  let predictorAdaptation = predictorInput ? adaptImpactPredictorInput(predictorInput) : null;
  let catalog = mergePredictorCatalog(baseCatalog, predictorAdaptation?.catalogAdditions ?? []);
  let sourceLayersInput = predictorAdaptation?.sourceLayers.length
    ? predictorAdaptation.sourceLayers.map((layer) => LayerInputSchema.parse(layer))
    : options.sourceLayers
      ? options.sourceLayers.map((layer) => LayerInputSchema.parse(layer))
      : visibleLayers;
  const exactImpactSource = options.exactImpactSource ? ExactImpactSourceSchema.parse(options.exactImpactSource) : null;
  const impactFieldContext = options.impactFieldContext ? ImpactFieldContextSchema.parse(options.impactFieldContext) : null;
  const hasFullyTaggedSourceStack =
    sourceLayersInput.length > 0 && sourceLayersInput.every((layer) => Boolean(layer.floorRole));
  const normalizedExplicitSourceLayersInput = hasFullyTaggedSourceStack
    ? normalizeExplicitFloorRoleLayerStack(sourceLayersInput, catalog)
    : null;
  const inferredSourceLayersInput =
    predictorAdaptation?.sourceLayers.length && !predictorAdaptation.officialFloorSystemId
      ? null
      // Explicit floor roles are operator intent. Only coalesce contiguous same-role pieces for split parity;
      // do not re-infer a fully tagged stack into a broader predictor lane.
      : hasFullyTaggedSourceStack
        ? normalizedExplicitSourceLayersInput
        : maybeInferFloorRoleLayerStack(sourceLayersInput, catalog);
  if (inferredSourceLayersInput) {
    sourceLayersInput = inferredSourceLayersInput;
  }
  let resolvedVisibleLayers = resolveLayers(visibleLayers, catalog);
  let resolvedSourceLayers = resolveLayers(sourceLayersInput, catalog);
  const blocksBoundOnlyUbiqOpenWebCarpetDerivedEstimate =
    hasBoundOnlyUbiqOpenWebCarpetCombinedProfile(resolvedVisibleLayers) ||
    hasBoundOnlyUbiqOpenWebCarpetCombinedProfile(resolvedSourceLayers);

  let sourceMode: ImpactOnlySourceMode =
    options.sourceLayers && sourceLayersInput.length > 0 ? "source_layers" : "visible_stack";

  let floorSystemMatch: FloorSystemMatchResult | null = null;
  let boundFloorSystemMatch: FloorSystemBoundMatchResult | null = null;
  let impactCatalogMatch: ImpactCatalogMatchResult | null = null;
  let floorSystemEstimate: FloorSystemEstimateResult | null = null;
  let boundFloorSystemEstimate: FloorSystemBoundEstimateResult | null = null;
  let narrowImpact: ImpactCalculation | null = null;
  let predictorDeltaLwCompanion: ImpactCalculation | null = null;
  let directVisibleNarrowImpact: ImpactCalculation | null = null;
  let explicitDeltaImpact: ImpactCalculation | null = null;
  let visibleLayerPredictorBlockerWarning: string | null = null;
  const exactImpact = exactImpactSource ? buildOwnedImpactFromExactSource(exactImpactSource) : null;

  if (exactImpactSource) {
    sourceMode = "exact_band_source";
  } else if (typeof options.officialImpactCatalogId === "string") {
    sourceMode = "official_product_catalog";
    impactCatalogMatch = resolveImpactProductCatalogById(options.officialImpactCatalogId);
  } else if (typeof options.officialFloorSystemId === "string") {
    sourceMode = "official_floor_system";
    floorSystemMatch = resolveExactFloorSystemById(options.officialFloorSystemId);
    if (!floorSystemMatch) {
      boundFloorSystemMatch = resolveBoundFloorSystemById(options.officialFloorSystemId);
    }
  } else if (predictorAdaptation) {
    sourceMode = "predictor_input";
    if (predictorAdaptation.officialFloorSystemId) {
      floorSystemMatch = resolveExactFloorSystemById(predictorAdaptation.officialFloorSystemId);
      if (!floorSystemMatch) {
        boundFloorSystemMatch = resolveBoundFloorSystemById(predictorAdaptation.officialFloorSystemId);
      }
    } else {
      const predictorImpactLane = resolveLayerBasedImpactLane({
        catalog,
        exactImpact,
        explicitFloorRoleStack: hasFullyTaggedSourceStack,
        explicitPredictorInput: predictorInput,
        predictorInput,
        resolvedLayers: resolvedSourceLayers,
        targetOutputs: options.targetOutputs
      });

      floorSystemMatch = predictorImpactLane.floorSystemMatch;
      boundFloorSystemMatch = predictorImpactLane.boundFloorSystemMatch;
      impactCatalogMatch = predictorImpactLane.impactCatalogMatch;
      explicitDeltaImpact = predictorImpactLane.explicitDeltaImpact;
      narrowImpact = predictorImpactLane.narrowImpact;
      predictorDeltaLwCompanion = predictorImpactLane.predictorDeltaLwCompanion;
      boundFloorSystemEstimate = predictorImpactLane.boundFloorSystemEstimate;
      floorSystemEstimate = predictorImpactLane.floorSystemEstimate;
      if (visibleSteelFormulaMissingPhysicalInputs.length > 0) {
        floorSystemMatch = null;
        boundFloorSystemMatch = null;
        impactCatalogMatch = null;
        explicitDeltaImpact = null;
        narrowImpact = null;
        predictorDeltaLwCompanion = null;
        boundFloorSystemEstimate = null;
        floorSystemEstimate = null;
      } else if (!floorSystemMatch && (predictorDeltaLwCompanion || options.targetOutputs?.includes("Ln,w"))) {
        const visibleFamily = inferImpactSupportingElementFamilyFromLayers(resolvedVisibleLayers);
        const predictorFamily = inferImpactSupportingElementFamilyFromPredictorInput(predictorInput);
        const canUseVisibleAnchor = Boolean(
          visibleFamily &&
            predictorFamily &&
            visibleFamily === predictorFamily &&
            (predictorFamily === "timber_joists" || predictorFamily === "mass_timber_clt")
        );

        if (canUseVisibleAnchor) {
          const visibleAnchorLane = resolveLayerBasedImpactLane({
            catalog,
            exactImpact,
            explicitFloorRoleStack: hasFullyTaggedSourceStack,
            resolvedLayers: resolvedVisibleLayers,
            targetOutputs: options.targetOutputs
          });

          floorSystemMatch = visibleAnchorLane.floorSystemMatch;
          floorSystemEstimate = visibleAnchorLane.floorSystemMatch
            ? null
            : floorSystemEstimate ?? visibleAnchorLane.floorSystemEstimate;
        }
      }
    }
  } else {
    const directImpactLane = resolveLayerBasedImpactLane({
      catalog,
      exactImpact,
      explicitFloorRoleStack: hasFullyTaggedSourceStack,
      resolvedLayers: resolvedSourceLayers,
      targetOutputs: options.targetOutputs
    });

    floorSystemMatch = directImpactLane.floorSystemMatch;
    boundFloorSystemMatch = directImpactLane.boundFloorSystemMatch;
    impactCatalogMatch = directImpactLane.impactCatalogMatch;
    narrowImpact = directImpactLane.narrowImpact;
    directVisibleNarrowImpact = narrowImpact;
    boundFloorSystemEstimate = directImpactLane.boundFloorSystemEstimate;
    floorSystemEstimate = directImpactLane.floorSystemEstimate;

    const canTryDerivedPredictor =
      !options.sourceLayers &&
      !options.officialFloorSystemId &&
      !options.officialImpactCatalogId &&
      !exactImpactSource &&
      !floorSystemMatch &&
      !boundFloorSystemMatch &&
      !impactCatalogMatch;

    if (canTryDerivedPredictor) {
      visibleLayerPredictorBlockerWarning = getVisibleLayerPredictorBlockerWarning(visibleLayers, catalog);
      const derivedPredictorInput = maybeBuildImpactPredictorInputFromLayerStack(
        visibleLayers,
        buildFloorImpactPredictorSeed({
          floorImpactContext: options.floorImpactContext
        }),
        undefined,
        catalog
      );

      if (derivedPredictorInput) {
        const derivedPredictorAdaptation = adaptImpactPredictorInput(derivedPredictorInput);
        const derivedCatalog = mergePredictorCatalog(baseCatalog, derivedPredictorAdaptation.catalogAdditions);
        const derivedResolvedVisibleLayers = resolveLayers(visibleLayers, derivedCatalog);
        const derivedSourceLayersInput = derivedPredictorAdaptation.sourceLayers.map((layer) =>
          LayerInputSchema.parse(layer)
        );
        const derivedResolvedSourceLayers = resolveLayers(derivedSourceLayersInput, derivedCatalog);
        const derivedImpactLane = resolveLayerBasedImpactLane({
          catalog: derivedCatalog,
          exactImpact,
          predictorInput: derivedPredictorInput,
          resolvedLayers: derivedResolvedSourceLayers,
          targetOutputs: options.targetOutputs
        });
        const derivedHeavyConcreteCombinedFormulaFallbackBlockerWarning =
          buildHeavyConcreteCombinedImpactFormulaFallbackBlockerWarning(derivedPredictorInput);
        const hasDerivedHeavyConcreteCombinedFormula =
          derivedImpactLane.narrowImpact?.basis === HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS ||
          derivedImpactLane.predictorDeltaLwCompanion?.basis === HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;
        const shouldUseDerived =
          !blocksBoundOnlyUbiqOpenWebCarpetDerivedEstimate &&
          (
            hasDerivedHeavyConcreteCombinedFormula ||
            Boolean(derivedHeavyConcreteCombinedFormulaFallbackBlockerWarning) ||
            Boolean(
              derivedImpactLane.floorSystemMatch ||
                derivedImpactLane.boundFloorSystemMatch ||
                derivedImpactLane.impactCatalogMatch ||
                derivedImpactLane.predictorSpecificFloorSystemEstimate
            ) ||
            (!narrowImpact &&
              !directImpactLane.floorSystemEstimate &&
              !directImpactLane.boundFloorSystemEstimate &&
              Boolean(
                derivedImpactLane.narrowImpact ||
                  derivedImpactLane.floorSystemEstimate ||
                  derivedImpactLane.boundFloorSystemEstimate
              ))
          );

        if (shouldUseDerived) {
          predictorInput = derivedPredictorInput;
          predictorInputMode = "derived_from_visible_layers";
          predictorAdaptation = derivedPredictorAdaptation;
          catalog = derivedCatalog;
          resolvedVisibleLayers = derivedResolvedVisibleLayers;
          sourceLayersInput = derivedSourceLayersInput;
          resolvedSourceLayers = derivedResolvedSourceLayers;
          sourceMode = "predictor_input";
          floorSystemMatch = derivedImpactLane.floorSystemMatch;
          boundFloorSystemMatch = derivedImpactLane.boundFloorSystemMatch;
          impactCatalogMatch = derivedImpactLane.impactCatalogMatch;
          explicitDeltaImpact = derivedImpactLane.explicitDeltaImpact;
          narrowImpact = derivedImpactLane.narrowImpact;
          predictorDeltaLwCompanion = derivedImpactLane.predictorDeltaLwCompanion;
          boundFloorSystemEstimate = derivedImpactLane.boundFloorSystemEstimate;
          floorSystemEstimate = derivedImpactLane.floorSystemEstimate;
        }
      }
    }

    if (
      !blocksBoundOnlyUbiqOpenWebCarpetDerivedEstimate &&
      visibleSteelFormulaMissingPhysicalInputs.length === 0 &&
      !floorSystemEstimate &&
      !boundFloorSystemEstimate &&
      !buildHeavyConcreteCombinedImpactFormulaFallbackBlockerWarning(predictorInput)
    ) {
      const fallbackImpactLane = resolveLayerBasedImpactLane({
        catalog,
        exactImpact,
        explicitFloorRoleStack: hasFullyTaggedSourceStack,
        resolvedLayers: resolvedSourceLayers,
        targetOutputs: options.targetOutputs
      });
      boundFloorSystemEstimate = fallbackImpactLane.boundFloorSystemEstimate;
      floorSystemEstimate = fallbackImpactLane.floorSystemEstimate;
    }
  }

  if (
    exactImpactSource &&
    predictorAdaptation &&
    !options.officialFloorSystemId &&
    !options.officialImpactCatalogId
  ) {
    impactCatalogMatch = filterImpactCatalogMatchForExplicitPredictorInput(
      matchImpactProductCatalog(resolvedSourceLayers),
      predictorInput,
      catalog
    );
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
    predictorDeltaLwCompanion,
    predictorInput,
    preferredSupplementaryImpact: directVisibleNarrowImpact,
    resolvedLayers: resolvedSourceLayers
  });
  const hideLowConfidenceProxyAirborne = shouldHideLowConfidenceProxyAirborne(floorSystemEstimate);
  const floorCarrier = hideLowConfidenceProxyAirborne
    ? null
    : pickFloorCarrier({
        boundFloorSystemEstimate,
        boundFloorSystemMatch,
        floorSystemEstimate,
        floorSystemMatch
      });
  const targetOutputSupport = analyzeTargetOutputSupport({
    countBoundSupportAsSupported: false,
    floorCarrier,
    impact,
    lowerBoundImpact,
    targetOutputs: options.targetOutputs ?? []
  });
  const floorFamilySourceGuard = getFloorFamilySourceGuard(resolvedSourceLayers);
  const floorFamilySourceGuardWarnings =
    !impact && !lowerBoundImpact && targetOutputSupport.unsupportedImpactOutputs.length > 0 && floorFamilySourceGuard
      ? [floorFamilySourceGuard.warning]
      : [];
  const steelFloorFormulaFallbackBlockerWarning = buildSteelFloorImpactFormulaFallbackBlockerWarning(predictorInput);
  const heavyConcreteCombinedFormulaFallbackBlockerWarning =
    buildHeavyConcreteCombinedImpactFormulaFallbackBlockerWarning(predictorInput);
  const mixedSupportFormulaFallbackBlockerWarning =
    buildMixedSupportFloorImpactFormulaFallbackBlockerWarning(predictorInput);
  const impactPredictorAdditionalWarnings = [
    ...floorFamilySourceGuardWarnings,
    ...(heavyConcreteCombinedFormulaFallbackBlockerWarning ? [heavyConcreteCombinedFormulaFallbackBlockerWarning] : []),
    ...(mixedSupportFormulaFallbackBlockerWarning ? [mixedSupportFormulaFallbackBlockerWarning] : []),
    ...(steelFloorFormulaFallbackBlockerWarning ? [steelFloorFormulaFallbackBlockerWarning] : [])
  ];
  const { dynamicImpactTrace, impactPredictorStatus, impactSupport } = buildResolvedImpactArtifacts({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    floorSystemEstimate,
    floorSystemMatch,
    impact,
    impactCatalogMatch,
    impactPredictorAdditionalWarnings,
    impactFieldContext,
    lowerBoundImpact,
    predictorInput,
    predictorInputMode,
    resolvedLayers: resolvedSourceLayers,
    targetOutputSupport
  });
  const floorSystemRatings = hideLowConfidenceProxyAirborne
    ? null
    : buildFloorSystemRatings({
        boundFloorSystemEstimate,
        boundFloorSystemMatch,
        floorCarrier,
        floorSystemEstimate,
        floorSystemMatch,
        impact,
        lowerBoundImpact,
        screeningLayers: explicitDeltaImpact ? pickReferenceFloorRatingLayers(resolvedSourceLayers) : resolvedSourceLayers
      });
  const warnings = buildTargetOutputWarnings(targetOutputSupport);
  warnings.push(...floorFamilySourceGuardWarnings);
  if (heavyConcreteCombinedFormulaFallbackBlockerWarning) {
    warnings.push(heavyConcreteCombinedFormulaFallbackBlockerWarning);
  }
  if (mixedSupportFormulaFallbackBlockerWarning) {
    warnings.push(mixedSupportFormulaFallbackBlockerWarning);
  }
  if (steelFloorFormulaFallbackBlockerWarning) {
    warnings.push(steelFloorFormulaFallbackBlockerWarning);
  }

  if (sourceMode === "source_layers") {
    warnings.push(
      "Dedicated impact-only source layers are active. The visible stack is being preserved for UI continuity while the impact lane resolves against the explicit source topology."
    );
  }

  if (sourceMode === "predictor_input") {
    warnings.push(...(predictorAdaptation?.notes ?? []));
  }

  if (hideLowConfidenceProxyAirborne) {
    warnings.push(
      "Low-confidence published-family fallback is active without finite airborne companions. DynEcho kept unavailable proxy airborne outputs hidden instead of fabricating supported Rw / Ctr values."
    );
  } else if (hasReinforcedConcreteLowConfidenceProxyAirborne(floorSystemEstimate)) {
    warnings.push(REINFORCED_CONCRETE_LOW_CONFIDENCE_PROXY_AIRBORNE_WARNING);
  }

  if (predictorInputMode === "derived_from_visible_layers") {
    warnings.push(
      "Impact-only predictor topology was derived from visible floor-role layers, so curated family and predictor lanes can activate without a hidden selector."
    );
  } else if (visibleLayerPredictorBlockerWarning) {
    warnings.push(visibleLayerPredictorBlockerWarning);
  }

  if (sourceMode === "official_floor_system" && typeof options.officialFloorSystemId === "string") {
    warnings.push(
      `Direct curated floor-system id selection is active: ${options.officialFloorSystemId}. DynEcho bypassed layer scoring and resolved the published family row directly.`
    );
  }

  if (sourceMode === "official_product_catalog" && typeof options.officialImpactCatalogId === "string") {
    warnings.push(
      `Direct official impact-product row selection is active: ${options.officialImpactCatalogId}. DynEcho bypassed layer scoring and resolved the curated product evidence directly.`
    );
  }

  if (sourceMode === "exact_band_source" && exactImpact) {
    const ratingBasis =
      exactImpact?.basis === ASTM_E989_IMPACT_RATING_BASIS
        ? "ASTM E989 IIC/AIIC contour rating"
        : "ISO 717-2 band set";
    warnings.push(
      `Impact-only exact ${exactImpactSource?.labOrField ?? "lab"} band source is active. DynEcho resolved the impact lane directly from the supplied ${ratingBasis}.`
    );
  } else if (sourceMode === "exact_band_source") {
    warnings.push(
      "Impact-only exact band source was ignored because it did not match a supported ISO 717-2 or ASTM E989 nominal band set."
    );
  }

  if (impactFieldContext) {
    if (impact?.fieldEstimateProfile === "direct_flanking_energy_sum" && typeof impact.LPrimeNW === "number") {
      warnings.push(
        typeof impact.LPrimeNTw === "number"
          ? "Impact-only direct+flanking field path is active. Explicit path offsets are being summed before standardized field re-rating."
          : "Impact-only direct+flanking field path is active. Explicit path offsets are being summed on the field side before ISO 717-2 re-rating."
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
        "Impact-only Turkish simple-guide supplement is active. Exact or predicted Ln,w+CI is being carried through K and Hd without requiring a full airborne wall stack."
      );
    } else if (impact && typeof impact.LPrimeNTw === "number") {
      warnings.push(
        "Impact-only field-side supplement is active. K and receiving-room context are being carried through the dedicated impact lane."
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
        "Impact-only conservative field-side upper-bound support is active. Bound-only family data is being normalized with K and receiving-room context."
      );
    } else if (lowerBoundImpact && typeof lowerBoundImpact.LPrimeNT50UpperBound === "number") {
      warnings.push(
        "Impact-only conservative low-frequency upper-bound support is active. Bound-only combined Ln,w+CI data is being carried through K and Hd without fabricating split Ln,w or CI."
      );
    }
  }

  const result: ImpactOnlyCalculation = {
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    floorCarrier,
    floorSystemEstimate,
    floorSystemMatch,
    floorSystemRatings,
    dynamicImpactTrace: dynamicImpactTrace ?? undefined,
    impact,
    impactCatalogMatch,
    impactPredictorStatus,
    impactSupport,
    lowerBoundImpact,
    ok: true,
    partialType: "impact_only",
    sourceLayers: resolvedSourceLayers,
    sourceMode,
    supportedImpactOutputs: targetOutputSupport.supportedImpactOutputs,
    supportedTargetOutputs: targetOutputSupport.supportedTargetOutputs,
    targetOutputs: targetOutputSupport.targetOutputs,
    unsupportedImpactOutputs: targetOutputSupport.unsupportedImpactOutputs,
    unsupportedTargetOutputs: targetOutputSupport.unsupportedTargetOutputs,
    visibleLayers: resolvedVisibleLayers,
    warnings
  };

  applyAcousticCalculatorAnswerEngineV1FloorRolelessHelperOnlyBoundary(result);
  applyAcousticCalculatorAnswerEngineV1HeavyConcreteCombinedNeedsInputBoundary({
    predictorInput,
    result
  });
  applyAcousticCalculatorAnswerEngineV1TimberCltDeltaLwNeedsInputBoundary({
    predictorInput,
    result
  });
  applyPostV1GateCYCompositePanelDeltaLwNeedsInputBoundary({
    predictorInput,
    result
  });
  applyPostV1GateDBLightweightConcreteDeltaLwNeedsInputBoundary({
    predictorInput,
    result
  });
  applyPostV1GateDKSteelVisibleFormulaInputNeedsInputBoundary({
    missingPhysicalInputs: visibleSteelFormulaMissingPhysicalInputs,
    result
  });
  applyAcousticCalculatorAnswerEngineV1MixedSupportFloorImpactNeedsInputBoundary({
    predictorInput,
    result
  });
  applyAcousticCalculatorAnswerEngineV1MixedSupportFloorImpactUnsupportedBoundary({
    predictorInput,
    result
  });
  applyAcousticCalculatorAnswerEngineV1FloorFieldImpactNeedsInputBoundary({
    impactFieldContext,
    result
  });
  applyAcousticCalculatorAnswerEngineV1FloorAstmIicAiicUnsupportedBoundary(result);

  let layerCombinationResolverTrace = buildLayerCombinationResolverTraceForImpactOnly(result);
  const ownerAudit = auditAcousticCalculatorAnswerEngineV1OutputOwnership({
    allowedCompanionOutputs: getAcousticCalculatorAnswerEngineV1FloorLabCompanionOutputs({
      floorSystemRatings: result.floorSystemRatings,
      impact: result.impact,
      layerCombinationResolverTrace,
      supportedTargetOutputs: result.supportedTargetOutputs
    }),
    answerStopActive: Boolean(result.acousticAnswerBoundary),
    answerStopOutputs: result.acousticAnswerBoundary?.unsupportedOutputs,
    layerCombinationResolverTrace,
    resultKind: "impact_only",
    supportedTargetOutputs: result.supportedTargetOutputs
  });
  if (ownerAudit.ownerlessSupportedOutputs.length > 0) {
    parkImpactOnlyTargetOutputs(result, ownerAudit.ownerlessSupportedOutputs);
    if (ownerAudit.warning) {
      result.warnings.push(ownerAudit.warning);
    }
    layerCombinationResolverTrace = buildLayerCombinationResolverTraceForImpactOnly(result);
  }
  if (layerCombinationResolverTrace) {
    result.layerCombinationResolverTrace = layerCombinationResolverTrace;
  }

  return ImpactOnlyCalculationSchema.parse(result);
}
