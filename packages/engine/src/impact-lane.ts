import type {
  AirborneContext,
  DynamicImpactTrace,
  FloorSystemBoundEstimateResult,
  FloorSystemBoundMatchResult,
  FloorSystemEstimateResult,
  FloorSystemMatchResult,
  FloorSystemRecommendation,
  ImpactBoundCalculation,
  ImpactCalculation,
  ImpactCatalogMatchResult,
  ImpactFieldContext,
  ImpactPredictorInput,
  ImpactPredictorInputMode,
  ImpactPredictorStatus,
  ImpactSupport,
  MaterialDefinition,
  RequestedOutputId,
  ResolvedLayer
} from "@dynecho/shared";
import type { ExactImpactSource } from "@dynecho/shared";

import { deriveBoundFloorSystemEstimate, matchBoundFloorSystem, resolveBoundFloorSystemById } from "./bound-floor-system-match";
import { deriveFloorSystemEstimate } from "./floor-system-estimate";
import { deriveLightweightSteelOpenWebDirectFixedLiningEstimate } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { deriveLightweightSteelOpenWebSupportedBandSimilarityEstimate } from "./lightweight-steel-open-web-supported-band-estimate";
import {
  deriveOpenBoxTimberEpsScreedHybridPackageEstimate,
  OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
} from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { deriveOpenBoxTimberSimilarityEstimate } from "./open-box-timber-similarity-estimate";
import { deriveOpenBoxTimberRawBareEstimate, OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { deriveOpenWebRawBareEstimate, OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";
import {
  deriveHelperOnlyTimberOpenWebImpactStackEstimate,
  HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
} from "./helper-only-timber-open-web-impact-stack-estimate";
import { buildTuasC11cGuardedIsoWeightedImpact } from "./tuas-c11c-exact-import-readiness";
import {
  matchExactFloorSystem,
  recommendFloorSystems,
  resolveExactFloorSystemById,
  resolveExactFloorSystemImpactSource
} from "./floor-system-match";
import { buildOwnedImpactFromExactSource } from "./impact-astm-e989";
import {
  applyImpactFieldContextToBoundImpact,
  applyImpactFieldContextToImpact
} from "./impact-field-context";
import { estimateImpactFromLayers, estimateImpactFromPredictorInput } from "./impact-estimate";
import { buildImpactPredictorStatus } from "./impact-predictor-status";
import { shouldBlockHeavyConcreteCombinedImpactFormulaFallback } from "./heavy-concrete-combined-impact-formula-corridor";
import { deriveHeavyConcretePublishedUpperTreatmentEstimate } from "./heavy-concrete-published-upper-treatment-estimate";
import {
  filterImpactCatalogMatchForExplicitPredictorInput,
  matchImpactProductCatalog
} from "./impact-product-catalog";
import { deriveHeavyReferenceImpactFromDeltaLw } from "./impact-reference";
import { mergeImpactCalculations, mergePublishedUpperTreatmentDeltaCompanion } from "./impact-merge";
import { buildImpactSupport } from "./impact-support";
import { attachImpactTraceFromExactSource } from "./impact-trace";
import { buildDynamicImpactTrace } from "./dynamic-impact";
import { derivePredictorSpecificFloorSystemEstimate } from "./predictor-floor-system-estimate";
import { shouldBlockSteelFloorImpactFormulaFallback } from "./steel-floor-impact-formula-corridor";
import {
  estimateTimberCltDeltaLwFromPredictorInput,
  mergeTimberCltDeltaLwFormulaCompanion
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";
import {
  inferImpactSupportingElementFamilyFromExactFloorSystem,
  inferImpactSupportingElementFamilyFromFloorSystemEstimate,
  inferImpactSupportingElementFamilyFromImpactCatalogMatch,
  inferImpactSupportingElementFamilyFromPredictorInput
} from "./impact-supporting-element-family";
import { shouldBlockMixedSupportFloorImpactFormulaFallback } from "./mixed-support-floor-impact-runtime-corridor";

export type ResolvedImpactLane = {
  boundFloorSystemEstimate: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch: FloorSystemBoundMatchResult | null;
  explicitDeltaImpact: ImpactCalculation | null;
  floorSystemEstimate: FloorSystemEstimateResult | null;
  floorSystemMatch: FloorSystemMatchResult | null;
  floorSystemRecommendations: readonly FloorSystemRecommendation[];
  impactCatalogMatch: ImpactCatalogMatchResult | null;
  narrowImpact: ImpactCalculation | null;
  predictorDeltaLwCompanion: ImpactCalculation | null;
  predictorSpecificFloorSystemEstimate: FloorSystemEstimateResult | null;
};

type ResolveLayerBasedImpactLaneInput = {
  catalog: readonly MaterialDefinition[];
  exactImpact: ImpactCalculation | null;
  explicitFloorRoleStack?: boolean;
  explicitPredictorInput?: ImpactPredictorInput | null;
  predictorInput?: ImpactPredictorInput | null;
  officialFloorSystemId?: string | null;
  resolvedLayers: readonly ResolvedLayer[];
  targetOutputs?: readonly RequestedOutputId[];
};

export type FinalizedImpactLane = {
  exactImpact: ImpactCalculation | null;
  impact: ImpactCalculation | null;
  lowerBoundImpact: ImpactBoundCalculation | null;
};

type FinalizeResolvedImpactLaneInput = {
  airborneContext?: AirborneContext | null;
  boundFloorSystemEstimate?: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch?: FloorSystemBoundMatchResult | null;
  exactImpactSource?: ExactImpactSource | null;
  explicitDeltaImpact?: ImpactCalculation | null;
  fallbackSupplementaryImpact?: ImpactCalculation | null;
  floorSystemEstimate?: FloorSystemEstimateResult | null;
  floorSystemMatch?: FloorSystemMatchResult | null;
  impactCatalogMatch?: ImpactCatalogMatchResult | null;
  impactFieldContext?: ImpactFieldContext | null;
  narrowImpact?: ImpactCalculation | null;
  predictorDeltaLwCompanion?: ImpactCalculation | null;
  predictorInput?: ImpactPredictorInput | null;
  preferredSupplementaryImpact?: ImpactCalculation | null;
  resolvedLayers: readonly ResolvedLayer[];
};

function hasExplicitImpactBuildingPredictionOwner(context: ImpactFieldContext | null | undefined): boolean {
  return Boolean(
    context &&
      Array.isArray(context.flankingPaths) &&
      context.flankingPaths.length > 0 &&
      (
        typeof context.directPathOffsetDb === "number" ||
        typeof context.fieldKDb === "number"
      )
  );
}

type BuildResolvedImpactArtifactsInput = {
  boundFloorSystemEstimate?: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch?: FloorSystemBoundMatchResult | null;
  catalog?: readonly MaterialDefinition[];
  floorSystemEstimate?: FloorSystemEstimateResult | null;
  floorSystemMatch?: FloorSystemMatchResult | null;
  impact: ImpactCalculation | null;
  impactCatalogMatch?: ImpactCatalogMatchResult | null;
  impactFieldContext?: ImpactFieldContext | null;
  impactPredictorAdditionalWarnings?: readonly string[];
  lowerBoundImpact: ImpactBoundCalculation | null;
  predictorInput?: ImpactPredictorInput | null;
  predictorInputMode?: ImpactPredictorInputMode;
  resolvedLayers: readonly ResolvedLayer[];
  targetOutputSupport: {
    supportedImpactOutputs: RequestedOutputId[];
    supportedTargetOutputs: RequestedOutputId[];
    targetOutputs: RequestedOutputId[];
    unsupportedImpactOutputs: RequestedOutputId[];
    unsupportedTargetOutputs: RequestedOutputId[];
  };
};

export type ResolvedImpactArtifacts = {
  dynamicImpactTrace: DynamicImpactTrace | null;
  hideLowConfidenceProxyAirborne: boolean;
  impactPredictorStatus: ImpactPredictorStatus | null;
  impactSupport: ImpactSupport | null;
};

const FLOOR_SYSTEM_VISIBLE_RECOMMENDATION_LIMIT = 8;

export function shouldHideLowConfidenceProxyAirborne(
  floorSystemEstimate: FloorSystemEstimateResult | null | undefined
): boolean {
  return Boolean(
    floorSystemEstimate?.kind === "low_confidence" &&
      floorSystemEstimate.impact.basis === "predictor_floor_system_low_confidence_estimate" &&
      typeof floorSystemEstimate.airborneRatings?.Rw !== "number"
  );
}

function buildExplicitDeltaImpact(
  predictorInput: ImpactPredictorInput | null | undefined
): ImpactCalculation | null {
  return predictorInput?.floorCovering?.mode === "delta_lw_catalog" &&
    typeof predictorInput.floorCovering.deltaLwDb === "number"
    ? deriveHeavyReferenceImpactFromDeltaLw(predictorInput.floorCovering.deltaLwDb)
    : null;
}

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function hasMassSchedule(
  layer: ImpactPredictorInput["floorCovering" | "floatingScreed" | "upperFill"] | null | undefined
): boolean {
  return hasPositiveNumber(layer?.densityKgM3) && hasPositiveNumber(layer?.thicknessMm);
}

function hasDynamicStiffnessOrProductOwner(predictorInput: ImpactPredictorInput): boolean {
  return (
    hasPositiveNumber(predictorInput.resilientLayer?.dynamicStiffnessMNm3) ||
    Boolean(predictorInput.resilientLayer?.productId?.trim())
  );
}

function hasLoadBasisOrMassSchedule(predictorInput: ImpactPredictorInput): boolean {
  return (
    hasPositiveNumber(predictorInput.loadBasisKgM2) ||
    hasMassSchedule(predictorInput.floorCovering) ||
    hasMassSchedule(predictorInput.floatingScreed) ||
    hasMassSchedule(predictorInput.upperFill)
  );
}

function shouldBlockHeavyConcreteFloatingFormulaFallback(
  predictorInput: ImpactPredictorInput | null | undefined
): boolean {
  return Boolean(
    predictorInput &&
      predictorInput.structuralSupportType === "reinforced_concrete" &&
      predictorInput.impactSystemType === "heavy_floating_floor" &&
      (
        !hasDynamicStiffnessOrProductOwner(predictorInput) ||
        !hasLoadBasisOrMassSchedule(predictorInput)
      )
  );
}

export function resolveLayerBasedImpactLane(
  input: ResolveLayerBasedImpactLaneInput
): ResolvedImpactLane {
  const floorSystemMatch = input.officialFloorSystemId
    ? resolveExactFloorSystemById(input.officialFloorSystemId)
    : matchExactFloorSystem(input.resolvedLayers);
  const boundFloorSystemMatch =
    !input.exactImpact && !floorSystemMatch
      ? input.officialFloorSystemId
        ? resolveBoundFloorSystemById(input.officialFloorSystemId)
        : matchBoundFloorSystem(input.resolvedLayers)
      : null;
  const rawImpactCatalogMatch = input.officialFloorSystemId
    ? null
    : matchImpactProductCatalog(input.resolvedLayers);
  const impactCatalogMatch =
    input.officialFloorSystemId || !input.explicitPredictorInput
      ? rawImpactCatalogMatch
      : filterImpactCatalogMatchForExplicitPredictorInput(
          rawImpactCatalogMatch,
          input.explicitPredictorInput,
          input.catalog
        );
  const explicitDeltaImpact = buildExplicitDeltaImpact(input.predictorInput);
  const rejectProductDeltaFormulaFallback =
    Boolean(input.explicitPredictorInput) &&
    rawImpactCatalogMatch?.catalog.matchMode === "product_property_delta" &&
    !impactCatalogMatch;
  const blockSteelFormulaFallback = shouldBlockSteelFloorImpactFormulaFallback(input.predictorInput);
  const blockHeavyConcreteFloatingFormulaFallback = shouldBlockHeavyConcreteFloatingFormulaFallback(
    input.predictorInput
  );
  const blockHeavyConcreteCombinedFormulaFallback = shouldBlockHeavyConcreteCombinedImpactFormulaFallback(
    input.predictorInput
  );
  const blockMixedSupportFormulaFallback = shouldBlockMixedSupportFloorImpactFormulaFallback(input.predictorInput);
  const floorSystemRecommendations = floorSystemMatch
    ? []
    : recommendFloorSystems(input.resolvedLayers, FLOOR_SYSTEM_VISIBLE_RECOMMENDATION_LIMIT);
  const openBoxTimberSimilarityEstimate =
    !input.exactImpact &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !blockSteelFormulaFallback &&
    !blockHeavyConcreteCombinedFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? deriveOpenBoxTimberSimilarityEstimate({
          layers: input.resolvedLayers,
          targetOutputs: input.targetOutputs
        })
      : null;
  const openBoxTimberEpsScreedHybridPackageEstimate =
    !input.exactImpact &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !openBoxTimberSimilarityEstimate &&
    !blockSteelFormulaFallback &&
    !blockHeavyConcreteCombinedFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? deriveOpenBoxTimberEpsScreedHybridPackageEstimate({
          layers: input.resolvedLayers,
          targetOutputs: input.targetOutputs
        })
      : null;
  const openBoxTimberRawBareEstimate =
    !input.exactImpact &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !openBoxTimberSimilarityEstimate &&
    !openBoxTimberEpsScreedHybridPackageEstimate &&
    !blockSteelFormulaFallback &&
    !blockHeavyConcreteCombinedFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? deriveOpenBoxTimberRawBareEstimate({
          layers: input.resolvedLayers,
          targetOutputs: input.targetOutputs
      })
      : null;
  const helperOnlyTimberOpenWebImpactStackEstimate =
    !input.exactImpact &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !openBoxTimberSimilarityEstimate &&
    !openBoxTimberEpsScreedHybridPackageEstimate &&
    !openBoxTimberRawBareEstimate &&
    !blockSteelFormulaFallback &&
    !blockHeavyConcreteCombinedFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? deriveHelperOnlyTimberOpenWebImpactStackEstimate({
          explicitFloorRoleStack: input.explicitFloorRoleStack,
          layers: input.resolvedLayers,
          targetOutputs: input.targetOutputs
        })
      : null;
  const tuasC11cGuardedIsoWeightedImpact =
    !input.exactImpact &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !openBoxTimberSimilarityEstimate &&
    !openBoxTimberEpsScreedHybridPackageEstimate &&
    !openBoxTimberRawBareEstimate &&
    !helperOnlyTimberOpenWebImpactStackEstimate &&
    !blockSteelFormulaFallback &&
    !blockHeavyConcreteCombinedFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? buildTuasC11cGuardedIsoWeightedImpact(input.resolvedLayers)
      : null;
  const predictorFormulaImpact =
    input.predictorInput &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !openBoxTimberSimilarityEstimate &&
    !openBoxTimberEpsScreedHybridPackageEstimate &&
    !openBoxTimberRawBareEstimate &&
    !helperOnlyTimberOpenWebImpactStackEstimate &&
    !tuasC11cGuardedIsoWeightedImpact
      ? estimateImpactFromPredictorInput(input.predictorInput)
      : null;
  const predictorDeltaLwCompanion =
    input.predictorInput &&
    input.targetOutputs?.includes("DeltaLw") &&
    !input.officialFloorSystemId &&
    !impactCatalogMatch &&
    !explicitDeltaImpact
      ? estimateTimberCltDeltaLwFromPredictorInput(input.predictorInput)
      : null;
  const heavyConcreteCombinedPublishedUpperTreatmentEstimate =
    input.predictorInput &&
    blockHeavyConcreteCombinedFormulaFallback &&
    !input.officialFloorSystemId &&
    !input.exactImpact &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !predictorFormulaImpact &&
    !openBoxTimberSimilarityEstimate &&
    !openBoxTimberEpsScreedHybridPackageEstimate &&
    !openBoxTimberRawBareEstimate &&
    !helperOnlyTimberOpenWebImpactStackEstimate &&
    !tuasC11cGuardedIsoWeightedImpact &&
    !blockSteelFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? deriveHeavyConcretePublishedUpperTreatmentEstimate(input.predictorInput)
      : null;
  const genericPredictorSpecificFloorSystemEstimate =
    input.predictorInput &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !predictorFormulaImpact &&
    !openBoxTimberSimilarityEstimate &&
    !openBoxTimberEpsScreedHybridPackageEstimate &&
    !openBoxTimberRawBareEstimate &&
    !helperOnlyTimberOpenWebImpactStackEstimate &&
    !tuasC11cGuardedIsoWeightedImpact &&
    !blockSteelFormulaFallback &&
    !blockHeavyConcreteCombinedFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? derivePredictorSpecificFloorSystemEstimate(input.predictorInput)
      : null;
  const rawPredictorSpecificFloorSystemEstimate =
    heavyConcreteCombinedPublishedUpperTreatmentEstimate ?? genericPredictorSpecificFloorSystemEstimate;
  const predictorSpecificFloorSystemEstimate = rawPredictorSpecificFloorSystemEstimate;
  const narrowImpact =
    input.officialFloorSystemId ||
      explicitDeltaImpact ||
      rejectProductDeltaFormulaFallback ||
      blockSteelFormulaFallback ||
      blockHeavyConcreteFloatingFormulaFallback ||
      blockHeavyConcreteCombinedFormulaFallback ||
      blockMixedSupportFormulaFallback
      ? null
      : tuasC11cGuardedIsoWeightedImpact ?? predictorFormulaImpact ?? estimateImpactFromLayers(input.resolvedLayers);
  const openWebSupportedBandSimilarityEstimate =
    !input.exactImpact &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !predictorSpecificFloorSystemEstimate &&
    !narrowImpact &&
    !blockSteelFormulaFallback &&
    !blockHeavyConcreteCombinedFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? deriveLightweightSteelOpenWebSupportedBandSimilarityEstimate(input.resolvedLayers)
      : null;
  const openWebDirectFixedLiningEstimate =
    !input.exactImpact &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !predictorSpecificFloorSystemEstimate &&
    !openWebSupportedBandSimilarityEstimate &&
    !narrowImpact &&
    !blockSteelFormulaFallback &&
    !blockHeavyConcreteCombinedFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? deriveLightweightSteelOpenWebDirectFixedLiningEstimate({
          layers: input.resolvedLayers,
          targetOutputs: input.targetOutputs
      })
      : null;
  const openWebRawBareEstimate =
    !input.exactImpact &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !predictorSpecificFloorSystemEstimate &&
    !openWebSupportedBandSimilarityEstimate &&
    !openWebDirectFixedLiningEstimate &&
    !narrowImpact &&
    !blockSteelFormulaFallback &&
    !blockHeavyConcreteCombinedFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? deriveOpenWebRawBareEstimate({
          layers: input.resolvedLayers,
          targetOutputs: input.targetOutputs
      })
      : null;
  const boundFloorSystemEstimate =
    !input.exactImpact &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !predictorSpecificFloorSystemEstimate &&
    !openWebSupportedBandSimilarityEstimate &&
    !openWebDirectFixedLiningEstimate &&
    !openWebRawBareEstimate &&
    !openBoxTimberSimilarityEstimate &&
    !openBoxTimberEpsScreedHybridPackageEstimate &&
    !openBoxTimberRawBareEstimate &&
    !helperOnlyTimberOpenWebImpactStackEstimate &&
    !narrowImpact &&
    !blockSteelFormulaFallback &&
    !blockHeavyConcreteCombinedFormulaFallback &&
    !blockMixedSupportFormulaFallback
      ? deriveBoundFloorSystemEstimate(input.resolvedLayers)
      : null;
  const rawFloorSystemEstimate =
    explicitDeltaImpact || predictorSpecificFloorSystemEstimate
      ? null
      : !input.exactImpact &&
          !floorSystemMatch &&
          !boundFloorSystemMatch &&
          !boundFloorSystemEstimate &&
          !openWebSupportedBandSimilarityEstimate &&
          !openWebDirectFixedLiningEstimate &&
          !openWebRawBareEstimate &&
          !openBoxTimberSimilarityEstimate &&
          !openBoxTimberEpsScreedHybridPackageEstimate &&
          !openBoxTimberRawBareEstimate &&
          !helperOnlyTimberOpenWebImpactStackEstimate &&
          !tuasC11cGuardedIsoWeightedImpact &&
          !impactCatalogMatch &&
          !narrowImpact &&
          !blockSteelFormulaFallback &&
          !blockHeavyConcreteCombinedFormulaFallback &&
          !blockMixedSupportFormulaFallback
        ? deriveFloorSystemEstimate(input.resolvedLayers, floorSystemRecommendations)
        : null;
  const floorSystemEstimate =
    predictorSpecificFloorSystemEstimate ??
    openWebSupportedBandSimilarityEstimate ??
    openWebDirectFixedLiningEstimate ??
    openWebRawBareEstimate ??
    openBoxTimberSimilarityEstimate ??
    openBoxTimberEpsScreedHybridPackageEstimate ??
    openBoxTimberRawBareEstimate ??
    helperOnlyTimberOpenWebImpactStackEstimate ??
    rawFloorSystemEstimate;

  return {
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    explicitDeltaImpact,
    floorSystemEstimate,
    floorSystemMatch,
    floorSystemRecommendations,
    impactCatalogMatch,
    narrowImpact,
    predictorDeltaLwCompanion,
    predictorSpecificFloorSystemEstimate
  };
}

export function finalizeResolvedImpactLane(
  input: FinalizeResolvedImpactLaneInput
): FinalizedImpactLane {
  const exactImpact = input.exactImpactSource ? buildOwnedImpactFromExactSource(input.exactImpactSource) : null;
  const exactSupplementaryImpact =
    exactImpact && input.impactCatalogMatch?.catalog.matchMode === "product_property_delta"
      ? input.impactCatalogMatch.impact ?? null
      : null;
  const floorEstimateImpact = mergePublishedUpperTreatmentDeltaCompanion(
    input.floorSystemEstimate?.impact ?? null,
    input.preferredSupplementaryImpact ?? null,
    input.fallbackSupplementaryImpact ?? null
  );
  const floorSystemMatchImpact = mergeTimberCltDeltaLwFormulaCompanion(
    input.floorSystemMatch ? input.floorSystemMatch.impact : null,
    input.floorSystemMatch ? input.predictorDeltaLwCompanion ?? null : null
  );
  const floorEstimateImpactWithTimberCltCompanion = mergeTimberCltDeltaLwFormulaCompanion(
    floorEstimateImpact,
    floorEstimateImpact ? input.predictorDeltaLwCompanion ?? null : null
  );
  const baseImpact = exactImpact
    ? mergeImpactCalculations(exactImpact, exactSupplementaryImpact)
    : (
        floorSystemMatchImpact ??
        input.impactCatalogMatch?.impact ??
        input.explicitDeltaImpact ??
        floorEstimateImpactWithTimberCltCompanion ??
        input.narrowImpact ??
        input.predictorDeltaLwCompanion ??
        null
      );
  const baseLowerBoundImpact =
    input.impactCatalogMatch?.lowerBoundImpact ??
    input.boundFloorSystemMatch?.lowerBoundImpact ??
    input.boundFloorSystemEstimate?.lowerBoundImpact ??
    null;
  const defaultSupportingElementFamily =
    inferImpactSupportingElementFamilyFromExactFloorSystem(input.floorSystemMatch?.system) ??
    inferImpactSupportingElementFamilyFromFloorSystemEstimate(input.floorSystemEstimate) ??
    inferImpactSupportingElementFamilyFromImpactCatalogMatch(input.impactCatalogMatch) ??
    inferImpactSupportingElementFamilyFromPredictorInput(input.predictorInput) ??
    null;
  const exactImpactSourceForFieldContext =
    input.exactImpactSource ?? resolveExactFloorSystemImpactSource(input.floorSystemMatch?.system);
  const impactBeforeFieldContext =
    baseImpact?.basis === "predictor_explicit_delta_heavy_reference_derived"
      ? applyImpactFieldContextToImpact(baseImpact, input.impactFieldContext, {
          guideSource: "heavy_reference",
          ignoreLowerTreatmentReduction: true,
          skipDirectFlanking: true
        })
      : baseImpact?.basis === OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
        ? input.airborneContext?.contextMode === "building_prediction"
          ? hasExplicitImpactBuildingPredictionOwner(input.impactFieldContext)
            ? applyImpactFieldContextToImpact(baseImpact, input.impactFieldContext, {
                defaultSupportingElementFamily,
                directFlankingOnly: true,
                exactImpactSource: exactImpactSourceForFieldContext,
                resolvedLayers: input.resolvedLayers
              })
            : baseImpact
          : applyImpactFieldContextToImpact(baseImpact, input.impactFieldContext, {
              defaultSupportingElementFamily,
              exactImpactSource: exactImpactSourceForFieldContext,
              resolvedLayers: input.resolvedLayers,
              skipDirectFlanking: true
            })
      : baseImpact?.basis === OPEN_WEB_RAW_BARE_FORMULA_BASIS
        ? input.airborneContext?.contextMode === "building_prediction"
          ? hasExplicitImpactBuildingPredictionOwner(input.impactFieldContext)
            ? applyImpactFieldContextToImpact(baseImpact, input.impactFieldContext, {
                defaultSupportingElementFamily,
                directFlankingOnly: true,
                exactImpactSource: exactImpactSourceForFieldContext,
                resolvedLayers: input.resolvedLayers
              })
            : baseImpact
          : applyImpactFieldContextToImpact(baseImpact, input.impactFieldContext, {
              defaultSupportingElementFamily,
              exactImpactSource: exactImpactSourceForFieldContext,
              resolvedLayers: input.resolvedLayers,
              skipDirectFlanking: true
            })
      : baseImpact?.basis === OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
        ? applyImpactFieldContextToImpact(baseImpact, input.impactFieldContext, {
            defaultSupportingElementFamily,
            exactImpactSource: exactImpactSourceForFieldContext,
            resolvedLayers: input.resolvedLayers,
            skipDirectFlanking: true
          })
      : baseImpact?.basis === HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
        ? baseImpact
      : applyImpactFieldContextToImpact(baseImpact, input.impactFieldContext, {
          defaultSupportingElementFamily,
          exactImpactSource: exactImpactSourceForFieldContext,
          resolvedLayers: input.resolvedLayers
        });
  const impact = attachImpactTraceFromExactSource(
    impactBeforeFieldContext,
    exactImpactSourceForFieldContext
  );
  const lowerBoundImpact = applyImpactFieldContextToBoundImpact(baseLowerBoundImpact, input.impactFieldContext);

  return {
    exactImpact,
    impact,
    lowerBoundImpact
  };
}

export function buildResolvedImpactArtifacts(
  input: BuildResolvedImpactArtifactsInput
): ResolvedImpactArtifacts {
  const hideLowConfidenceProxyAirborne = shouldHideLowConfidenceProxyAirborne(input.floorSystemEstimate);
  const impactPredictorStatus = buildImpactPredictorStatus({
    additionalWarnings: input.impactPredictorAdditionalWarnings,
    boundFloorSystemEstimate: input.boundFloorSystemEstimate,
    boundFloorSystemMatch: input.boundFloorSystemMatch,
    floorSystemEstimate: input.floorSystemEstimate,
    floorSystemMatch: input.floorSystemMatch,
    hasImpactContext: Boolean(input.impactFieldContext),
    impact: input.impact,
    impactCatalogMatch: input.impactCatalogMatch,
    lowerBoundImpact: input.lowerBoundImpact,
    predictorInputMode: input.predictorInputMode,
    predictorInputActive: Boolean(input.predictorInput),
    targetOutputSupport: input.targetOutputSupport
  });
  const impactSupport = buildImpactSupport({
    boundFloorSystemEstimate: input.boundFloorSystemEstimate,
    boundFloorSystemMatch: input.boundFloorSystemMatch,
    floorSystemEstimate: input.floorSystemEstimate,
    floorSystemMatch: input.floorSystemMatch,
    impact: input.impact,
    impactCatalogMatch: input.impactCatalogMatch,
    lowerBoundImpact: input.lowerBoundImpact
  });
  const dynamicImpactTrace = buildDynamicImpactTrace({
    boundFloorSystemEstimate: input.boundFloorSystemEstimate,
    boundFloorSystemMatch: input.boundFloorSystemMatch,
    catalog: input.catalog,
    floorSystemEstimate: input.floorSystemEstimate,
    floorSystemMatch: input.floorSystemMatch,
    hasFieldContext: Boolean(input.impactFieldContext),
    impact: input.impact,
    impactCatalogMatch: input.impactCatalogMatch,
    lowerBoundImpact: input.lowerBoundImpact,
    predictorInput: input.predictorInput,
    predictorInputMode: input.predictorInputMode,
    resolvedLayers: input.resolvedLayers
  });

  return {
    dynamicImpactTrace,
    hideLowConfidenceProxyAirborne,
    impactPredictorStatus,
    impactSupport
  };
}
