import type {
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
import {
  matchExactFloorSystem,
  recommendFloorSystems,
  resolveExactFloorSystemById,
  resolveExactFloorSystemImpactSource
} from "./floor-system-match";
import { buildExactImpactFromSource } from "./impact-exact";
import { applyImpactFieldContextToBoundImpact, applyImpactFieldContextToImpact } from "./impact-field-context";
import { estimateImpactFromLayers } from "./impact-estimate";
import { buildImpactPredictorStatus } from "./impact-predictor-status";
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
import {
  inferImpactSupportingElementFamilyFromExactFloorSystem,
  inferImpactSupportingElementFamilyFromFloorSystemEstimate,
  inferImpactSupportingElementFamilyFromImpactCatalogMatch,
  inferImpactSupportingElementFamilyFromPredictorInput
} from "./impact-supporting-element-family";

export type ResolvedImpactLane = {
  boundFloorSystemEstimate: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch: FloorSystemBoundMatchResult | null;
  explicitDeltaImpact: ImpactCalculation | null;
  floorSystemEstimate: FloorSystemEstimateResult | null;
  floorSystemMatch: FloorSystemMatchResult | null;
  floorSystemRecommendations: readonly FloorSystemRecommendation[];
  impactCatalogMatch: ImpactCatalogMatchResult | null;
  narrowImpact: ImpactCalculation | null;
  predictorSpecificFloorSystemEstimate: FloorSystemEstimateResult | null;
};

type ResolveLayerBasedImpactLaneInput = {
  catalog: readonly MaterialDefinition[];
  exactImpact: ImpactCalculation | null;
  explicitPredictorInput?: ImpactPredictorInput | null;
  predictorInput?: ImpactPredictorInput | null;
  officialFloorSystemId?: string | null;
  resolvedLayers: readonly ResolvedLayer[];
};

export type FinalizedImpactLane = {
  exactImpact: ImpactCalculation | null;
  impact: ImpactCalculation | null;
  lowerBoundImpact: ImpactBoundCalculation | null;
};

type FinalizeResolvedImpactLaneInput = {
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
  predictorInput?: ImpactPredictorInput | null;
  preferredSupplementaryImpact?: ImpactCalculation | null;
  resolvedLayers: readonly ResolvedLayer[];
};

type BuildResolvedImpactArtifactsInput = {
  boundFloorSystemEstimate?: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch?: FloorSystemBoundMatchResult | null;
  catalog?: readonly MaterialDefinition[];
  floorSystemEstimate?: FloorSystemEstimateResult | null;
  floorSystemMatch?: FloorSystemMatchResult | null;
  impact: ImpactCalculation | null;
  impactCatalogMatch?: ImpactCatalogMatchResult | null;
  impactFieldContext?: ImpactFieldContext | null;
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
  const floorSystemRecommendations = floorSystemMatch
    ? []
    : recommendFloorSystems(input.resolvedLayers, FLOOR_SYSTEM_VISIBLE_RECOMMENDATION_LIMIT);
  const predictorSpecificFloorSystemEstimate =
    input.predictorInput &&
    !input.officialFloorSystemId &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch
      ? derivePredictorSpecificFloorSystemEstimate(input.predictorInput)
      : null;
  const narrowImpact =
    input.officialFloorSystemId || explicitDeltaImpact || rejectProductDeltaFormulaFallback
      ? null
      : estimateImpactFromLayers(input.resolvedLayers);
  const boundFloorSystemEstimate =
    !input.exactImpact &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !impactCatalogMatch &&
    !explicitDeltaImpact &&
    !predictorSpecificFloorSystemEstimate &&
    !narrowImpact
      ? deriveBoundFloorSystemEstimate(input.resolvedLayers)
      : null;
  const floorSystemEstimate =
    explicitDeltaImpact
      ? null
      : predictorSpecificFloorSystemEstimate ??
        (
          !input.exactImpact &&
          !floorSystemMatch &&
          !boundFloorSystemMatch &&
          !boundFloorSystemEstimate &&
          !impactCatalogMatch &&
          !narrowImpact
            ? deriveFloorSystemEstimate(input.resolvedLayers, floorSystemRecommendations)
            : null
        );

  return {
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    explicitDeltaImpact,
    floorSystemEstimate,
    floorSystemMatch,
    floorSystemRecommendations,
    impactCatalogMatch,
    narrowImpact,
    predictorSpecificFloorSystemEstimate
  };
}

export function finalizeResolvedImpactLane(
  input: FinalizeResolvedImpactLaneInput
): FinalizedImpactLane {
  const exactImpact = input.exactImpactSource ? buildExactImpactFromSource(input.exactImpactSource) : null;
  const exactSupplementaryImpact =
    exactImpact && input.impactCatalogMatch?.catalog.matchMode === "product_property_delta"
      ? input.impactCatalogMatch.impact ?? null
      : null;
  const floorEstimateImpact = mergePublishedUpperTreatmentDeltaCompanion(
    input.floorSystemEstimate?.impact ?? null,
    input.preferredSupplementaryImpact ?? null,
    input.fallbackSupplementaryImpact ?? null
  );
  const baseImpact = exactImpact
    ? mergeImpactCalculations(exactImpact, exactSupplementaryImpact)
    : (
        input.floorSystemMatch?.impact ??
        input.impactCatalogMatch?.impact ??
        input.explicitDeltaImpact ??
        floorEstimateImpact ??
        input.narrowImpact ??
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
  const impact = attachImpactTraceFromExactSource(
    baseImpact?.basis === "predictor_explicit_delta_heavy_reference_derived"
      ? baseImpact
      : applyImpactFieldContextToImpact(baseImpact, input.impactFieldContext, {
          defaultSupportingElementFamily,
          exactImpactSource: exactImpactSourceForFieldContext,
          resolvedLayers: input.resolvedLayers
        }),
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
