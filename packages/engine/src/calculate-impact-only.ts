import {
  ExactImpactSourceSchema,
  ImpactFieldContextSchema,
  ImpactOnlyCalculationSchema,
  ImpactPredictorInputSchema,
  LayerInputSchema,
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
import { buildFloorSystemRatings } from "./floor-system-ratings";
import {
  resolveExactFloorSystemById
} from "./floor-system-match";
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
  filterImpactCatalogMatchForExplicitPredictorInput,
  matchImpactProductCatalog,
  resolveImpactProductCatalogById
} from "./impact-product-catalog";
import {
  buildResolvedImpactArtifacts,
  finalizeResolvedImpactLane,
  resolveLayerBasedImpactLane,
  shouldHideLowConfidenceProxyAirborne
} from "./impact-lane";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import { analyzeTargetOutputSupport, buildTargetOutputWarnings } from "./target-output-support";

export type CalculateImpactOnlyOptions = {
  catalog?: readonly MaterialDefinition[];
  exactImpactSource?: ExactImpactSource | null;
  impactFieldContext?: ImpactFieldContext | null;
  impactPredictorInput?: ImpactPredictorInput | null;
  officialFloorSystemId?: string | null;
  officialImpactCatalogId?: string | null;
  sourceLayers?: readonly LayerInput[];
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

export function calculateImpactOnly(
  inputVisibleLayers: readonly LayerInput[],
  options: CalculateImpactOnlyOptions = {}
): ImpactOnlyCalculation {
  const visibleLayers = inputVisibleLayers.map((layer) => LayerInputSchema.parse(layer));
  const explicitPredictorInput = options.impactPredictorInput
    ? ImpactPredictorInputSchema.parse(options.impactPredictorInput)
    : null;
  let predictorInput = explicitPredictorInput;
  let predictorInputMode: "derived_from_visible_layers" | "explicit_predictor_input" | undefined =
    explicitPredictorInput ? "explicit_predictor_input" : undefined;
  let predictorAdaptation = predictorInput ? adaptImpactPredictorInput(predictorInput) : null;
  const baseCatalog = mergePredictorCatalog(getDefaultMaterialCatalog(), options.catalog ?? []);
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
  let directVisibleNarrowImpact: ImpactCalculation | null = null;
  let explicitDeltaImpact: ImpactCalculation | null = null;
  let visibleLayerPredictorBlockerWarning: string | null = null;
  const exactImpact = exactImpactSource ? buildExactImpactFromSource(exactImpactSource) : null;

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
        explicitPredictorInput: predictorInput,
        predictorInput,
        resolvedLayers: resolvedSourceLayers
      });

      floorSystemMatch = predictorImpactLane.floorSystemMatch;
      boundFloorSystemMatch = predictorImpactLane.boundFloorSystemMatch;
      impactCatalogMatch = predictorImpactLane.impactCatalogMatch;
      explicitDeltaImpact = predictorImpactLane.explicitDeltaImpact;
      narrowImpact = predictorImpactLane.narrowImpact;
      boundFloorSystemEstimate = predictorImpactLane.boundFloorSystemEstimate;
      floorSystemEstimate = predictorImpactLane.floorSystemEstimate;
    }
  } else {
    const directImpactLane = resolveLayerBasedImpactLane({
      catalog,
      exactImpact,
      resolvedLayers: resolvedSourceLayers
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
      const derivedPredictorInput = maybeBuildImpactPredictorInputFromLayerStack(visibleLayers, {}, undefined, catalog);

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
          resolvedLayers: derivedResolvedSourceLayers
        });
        const shouldUseDerived =
          !blocksBoundOnlyUbiqOpenWebCarpetDerivedEstimate &&
          (
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
          boundFloorSystemEstimate = derivedImpactLane.boundFloorSystemEstimate;
          floorSystemEstimate = derivedImpactLane.floorSystemEstimate;
        }
      }
    }

    if (!blocksBoundOnlyUbiqOpenWebCarpetDerivedEstimate && !floorSystemEstimate && !boundFloorSystemEstimate) {
      const fallbackImpactLane = resolveLayerBasedImpactLane({
        catalog,
        exactImpact,
        resolvedLayers: resolvedSourceLayers
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
  const { dynamicImpactTrace, impactPredictorStatus, impactSupport } = buildResolvedImpactArtifacts({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    floorSystemEstimate,
    floorSystemMatch,
    impact,
    impactCatalogMatch,
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

  if (sourceMode === "exact_band_source") {
    warnings.push(
      `Impact-only exact ${exactImpactSource?.labOrField ?? "lab"} band source is active. DynEcho resolved the impact lane directly from the supplied ISO 717-2 band set.`
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
    }
  }

  return ImpactOnlyCalculationSchema.parse({
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
  });
}
