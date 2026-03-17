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

import { deriveBoundFloorSystemEstimate, matchBoundFloorSystem, resolveBoundFloorSystemById } from "./bound-floor-system-match";
import { buildFloorSystemRatings } from "./floor-system-ratings";
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
  adaptImpactPredictorInput,
  maybeBuildImpactPredictorInputFromLayerStack,
  mergePredictorCatalog
} from "./impact-predictor-input";
import { matchImpactProductCatalog, resolveImpactProductCatalogById } from "./impact-product-catalog";
import { deriveHeavyReferenceImpactFromDeltaLw } from "./impact-reference";
import { derivePredictorSpecificFloorSystemEstimate } from "./predictor-floor-system-estimate";
import { buildImpactSupport } from "./impact-support";
import { buildDynamicImpactTrace } from "./dynamic-impact";
import {
  inferImpactSupportingElementFamilyFromExactFloorSystem,
  inferImpactSupportingElementFamilyFromFloorSystemEstimate,
  inferImpactSupportingElementFamilyFromImpactCatalogMatch,
  inferImpactSupportingElementFamilyFromPredictorInput
} from "./impact-supporting-element-family";
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
      surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
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
  const baseCatalog = options.catalog ?? getDefaultMaterialCatalog();
  let catalog = mergePredictorCatalog(baseCatalog, predictorAdaptation?.catalogAdditions ?? []);
  let sourceLayersInput = predictorAdaptation?.sourceLayers.length
    ? predictorAdaptation.sourceLayers.map((layer) => LayerInputSchema.parse(layer))
    : options.sourceLayers
      ? options.sourceLayers.map((layer) => LayerInputSchema.parse(layer))
      : visibleLayers;
  const exactImpactSource = options.exactImpactSource ? ExactImpactSourceSchema.parse(options.exactImpactSource) : null;
  const impactFieldContext = options.impactFieldContext ? ImpactFieldContextSchema.parse(options.impactFieldContext) : null;
  let resolvedVisibleLayers = resolveLayers(visibleLayers, catalog);
  let resolvedSourceLayers = resolveLayers(sourceLayersInput, catalog);

  let sourceMode: ImpactOnlySourceMode =
    options.sourceLayers && sourceLayersInput.length > 0 ? "source_layers" : "visible_stack";

  let floorSystemMatch: FloorSystemMatchResult | null = null;
  let boundFloorSystemMatch: FloorSystemBoundMatchResult | null = null;
  let impactCatalogMatch: ImpactCatalogMatchResult | null = null;
  let floorSystemEstimate: FloorSystemEstimateResult | null = null;
  let boundFloorSystemEstimate: FloorSystemBoundEstimateResult | null = null;
  let narrowImpact: ImpactCalculation | null = null;
  let explicitDeltaImpact: ImpactCalculation | null = null;

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
      explicitDeltaImpact =
        predictorInput?.floorCovering?.mode === "delta_lw_catalog" &&
        typeof predictorInput.floorCovering.deltaLwDb === "number"
          ? deriveHeavyReferenceImpactFromDeltaLw(predictorInput.floorCovering.deltaLwDb)
          : null;
      const predictorSpecificFloorSystemEstimate = predictorInput
        ? derivePredictorSpecificFloorSystemEstimate(predictorInput)
        : null;

      floorSystemMatch = matchExactFloorSystem(resolvedSourceLayers);
      boundFloorSystemMatch = !floorSystemMatch ? matchBoundFloorSystem(resolvedSourceLayers) : null;
      impactCatalogMatch = matchImpactProductCatalog(resolvedSourceLayers);
      narrowImpact = explicitDeltaImpact ? null : estimateImpactFromLayers(resolvedSourceLayers);
      boundFloorSystemEstimate =
        !floorSystemMatch &&
        !boundFloorSystemMatch &&
        !impactCatalogMatch &&
        !explicitDeltaImpact &&
        !predictorSpecificFloorSystemEstimate &&
        !narrowImpact
          ? deriveBoundFloorSystemEstimate(resolvedSourceLayers)
          : null;
      floorSystemEstimate =
        explicitDeltaImpact
          ? null
          : predictorSpecificFloorSystemEstimate ??
        (
          !floorSystemMatch &&
          !boundFloorSystemMatch &&
          !boundFloorSystemEstimate &&
          !impactCatalogMatch &&
          !narrowImpact
            ? deriveFloorSystemEstimate(resolvedSourceLayers, recommendFloorSystems(resolvedSourceLayers, 8))
            : null
        );
    }
  } else {
    floorSystemMatch = matchExactFloorSystem(resolvedSourceLayers);
    boundFloorSystemMatch = !floorSystemMatch ? matchBoundFloorSystem(resolvedSourceLayers) : null;
    impactCatalogMatch = matchImpactProductCatalog(resolvedSourceLayers);
    narrowImpact = estimateImpactFromLayers(resolvedSourceLayers);
    const shouldDerivePredictorFallback =
      !options.sourceLayers &&
      !options.officialFloorSystemId &&
      !options.officialImpactCatalogId &&
      !exactImpactSource &&
      !floorSystemMatch &&
      !boundFloorSystemMatch &&
      !impactCatalogMatch &&
      !narrowImpact;

    if (shouldDerivePredictorFallback) {
      const derivedPredictorInput = maybeBuildImpactPredictorInputFromLayerStack(visibleLayers);

      if (derivedPredictorInput) {
        predictorInput = derivedPredictorInput;
        predictorInputMode = "derived_from_visible_layers";
        predictorAdaptation = adaptImpactPredictorInput(derivedPredictorInput);
        catalog = mergePredictorCatalog(baseCatalog, predictorAdaptation.catalogAdditions);
        resolvedVisibleLayers = resolveLayers(visibleLayers, catalog);
        sourceLayersInput = predictorAdaptation.sourceLayers.map((layer) => LayerInputSchema.parse(layer));
        resolvedSourceLayers = resolveLayers(sourceLayersInput, catalog);
        sourceMode = "predictor_input";
        floorSystemMatch = matchExactFloorSystem(resolvedSourceLayers);
        boundFloorSystemMatch = !floorSystemMatch ? matchBoundFloorSystem(resolvedSourceLayers) : null;
        impactCatalogMatch = matchImpactProductCatalog(resolvedSourceLayers);
        explicitDeltaImpact =
          derivedPredictorInput.floorCovering?.mode === "delta_lw_catalog" &&
          typeof derivedPredictorInput.floorCovering.deltaLwDb === "number"
            ? deriveHeavyReferenceImpactFromDeltaLw(derivedPredictorInput.floorCovering.deltaLwDb)
            : null;
        narrowImpact = explicitDeltaImpact ? null : estimateImpactFromLayers(resolvedSourceLayers);
        const predictorSpecificFloorSystemEstimate = derivePredictorSpecificFloorSystemEstimate(derivedPredictorInput);
        boundFloorSystemEstimate =
          !floorSystemMatch &&
          !boundFloorSystemMatch &&
          !impactCatalogMatch &&
          !explicitDeltaImpact &&
          !predictorSpecificFloorSystemEstimate &&
          !narrowImpact
            ? deriveBoundFloorSystemEstimate(resolvedSourceLayers)
            : null;
        floorSystemEstimate =
          explicitDeltaImpact
            ? null
            : predictorSpecificFloorSystemEstimate ??
          (
            !floorSystemMatch &&
            !boundFloorSystemMatch &&
            !boundFloorSystemEstimate &&
            !impactCatalogMatch &&
            !narrowImpact
              ? deriveFloorSystemEstimate(resolvedSourceLayers, recommendFloorSystems(resolvedSourceLayers, 8))
              : null
          );
      }
    }

    if (!floorSystemEstimate && !boundFloorSystemEstimate) {
      boundFloorSystemEstimate =
        !floorSystemMatch && !boundFloorSystemMatch && !impactCatalogMatch && !narrowImpact
          ? deriveBoundFloorSystemEstimate(resolvedSourceLayers)
          : null;
      floorSystemEstimate =
        !floorSystemMatch && !boundFloorSystemMatch && !boundFloorSystemEstimate && !impactCatalogMatch && !narrowImpact
          ? deriveFloorSystemEstimate(resolvedSourceLayers, recommendFloorSystems(resolvedSourceLayers, 8))
          : null;
    }
  }

  const baseImpact =
    (exactImpactSource ? buildExactImpactFromSource(exactImpactSource) : null) ??
    floorSystemMatch?.impact ??
    impactCatalogMatch?.impact ??
    explicitDeltaImpact ??
    floorSystemEstimate?.impact ??
    narrowImpact ??
    null;
  const baseLowerBoundImpact =
    impactCatalogMatch?.lowerBoundImpact ??
    boundFloorSystemMatch?.lowerBoundImpact ??
    boundFloorSystemEstimate?.lowerBoundImpact ??
    null;
  const defaultSupportingElementFamily =
    inferImpactSupportingElementFamilyFromExactFloorSystem(floorSystemMatch?.system) ??
    inferImpactSupportingElementFamilyFromFloorSystemEstimate(floorSystemEstimate) ??
    inferImpactSupportingElementFamilyFromImpactCatalogMatch(impactCatalogMatch) ??
    inferImpactSupportingElementFamilyFromPredictorInput(predictorInput) ??
    null;
  const exactImpactSourceForFieldContext =
    exactImpactSource ?? resolveExactFloorSystemImpactSource(floorSystemMatch?.system);
  const impact =
    baseImpact?.basis === "predictor_explicit_delta_heavy_reference_derived"
      ? baseImpact
      : applyImpactFieldContextToImpact(baseImpact, impactFieldContext, {
          defaultSupportingElementFamily,
          exactImpactSource: exactImpactSourceForFieldContext,
          resolvedLayers: resolvedSourceLayers
        });
  const lowerBoundImpact = applyImpactFieldContextToBoundImpact(baseLowerBoundImpact, impactFieldContext);
  const floorCarrier = pickFloorCarrier({
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
  const floorSystemRatings = buildFloorSystemRatings({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    floorCarrier,
    floorSystemEstimate,
    floorSystemMatch,
    impact,
    lowerBoundImpact,
    screeningLayers: explicitDeltaImpact ? pickReferenceFloorRatingLayers(resolvedSourceLayers) : resolvedSourceLayers
  });
  const impactPredictorStatus = buildImpactPredictorStatus({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    floorSystemEstimate,
    floorSystemMatch,
    hasImpactContext: Boolean(impactFieldContext),
    impact,
    impactCatalogMatch,
    lowerBoundImpact,
    predictorInputMode,
    predictorInputActive: Boolean(predictorInput),
    targetOutputSupport
  });
  const impactSupport = buildImpactSupport({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    floorSystemEstimate,
    floorSystemMatch,
    impact,
    impactCatalogMatch,
    lowerBoundImpact
  });
  const dynamicImpactTrace = buildDynamicImpactTrace({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    floorSystemEstimate,
    floorSystemMatch,
    hasFieldContext: Boolean(impactFieldContext),
    impact,
    impactCatalogMatch,
    lowerBoundImpact,
    predictorInput,
    predictorInputMode,
    resolvedLayers: resolvedSourceLayers
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

  if (predictorInputMode === "derived_from_visible_layers") {
    warnings.push(
      "Impact-only predictor topology was derived from visible floor-role layers, so curated family and predictor lanes can activate without a hidden selector."
    );
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
