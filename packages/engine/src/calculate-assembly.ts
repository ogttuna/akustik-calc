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
  type ExactImpactSource,
  type ImpactFieldContext,
  type ImpactPredictorInput,
  type LayerInput,
  type MaterialDefinition,
  type RequestedOutputId,
  type ResolvedLayer
} from "@dynecho/shared";

import { buildCalibratedMassLawCurve } from "./curve-rating";
import { applyAirborneContextOverlay } from "./apply-airborne-context";
import { AIRBORNE_CALCULATORS, calculateAirborneCalculatorResult } from "./airborne-calculator";
import { calculateDynamicAirborneResult } from "./dynamic-airborne";
import { round1 } from "./math";
import { buildEstimateWarnings, estimateRwDb } from "./estimate-rw";
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
import { matchImpactProductCatalog } from "./impact-product-catalog";
import { derivePredictorSpecificFloorSystemEstimate } from "./predictor-floor-system-estimate";
import { buildImpactSupport } from "./impact-support";
import { buildDynamicImpactTrace } from "./dynamic-impact";
import {
  inferImpactSupportingElementFamilyFromExactFloorSystem,
  inferImpactSupportingElementFamilyFromFloorSystemEstimate,
  inferImpactSupportingElementFamilyFromImpactCatalogMatch,
  inferImpactSupportingElementFamilyFromPredictorInput
} from "./impact-supporting-element-family";
import { deriveHeavyReferenceImpactFromDeltaLw } from "./impact-reference";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
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
      surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
    };
  });
}

function pickReferenceFloorRatingLayers(layers: readonly ResolvedLayer[]): readonly ResolvedLayer[] {
  const baseStructureLayers = layers.filter((layer) => layer.floorRole === "base_structure");

  return baseStructureLayers.length > 0 ? baseStructureLayers : layers;
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
  const baseCatalog = options.catalog ?? getDefaultMaterialCatalog();
  let catalog = mergePredictorCatalog(baseCatalog, predictorAdaptation?.catalogAdditions ?? []);
  const exactImpactSource = options.exactImpactSource ? ExactImpactSourceSchema.parse(options.exactImpactSource) : null;
  const impactFieldContext = options.impactFieldContext ? ImpactFieldContextSchema.parse(options.impactFieldContext) : null;
  const airborneContext = options.airborneContext ? AirborneContextSchema.parse(options.airborneContext) : null;
  const resolvedLayers = resolveLayers(layers, catalog);
  let impactResolvedLayers =
    predictorAdaptation?.sourceLayers.length && !predictorAdaptation.officialFloorSystemId
      ? resolveLayers(predictorAdaptation.sourceLayers, catalog)
      : resolvedLayers;
  const totalThicknessMm = round1(resolvedLayers.reduce((sum, layer) => sum + layer.thicknessMm, 0));
  const surfaceMassKgM2 = round1(resolvedLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0));
  const screeningEstimatedRwDb = estimateRwDb(resolvedLayers);
  const screeningCurve = buildCalibratedMassLawCurve(surfaceMassKgM2, screeningEstimatedRwDb);
  const dynamicAirborneResult = options.calculator === "dynamic"
    ? calculateDynamicAirborneResult(resolvedLayers, {
        frequenciesHz: screeningCurve.frequenciesHz,
        screeningEstimatedRwDb
      })
    : null;
  const importedCalculatorResult = options.calculator && options.calculator !== "dynamic"
    ? calculateAirborneCalculatorResult(options.calculator, resolvedLayers)
    : null;
  const selectedCalculatorCurve = dynamicAirborneResult?.curve ?? importedCalculatorResult?.curve ?? screeningCurve;
  const selectedCalculatorLabel = dynamicAirborneResult?.label ?? importedCalculatorResult?.label;
  const availableCalculators: readonly AirborneCalculator[] = AIRBORNE_CALCULATORS;
  const airborneOverlayResult = applyAirborneContextOverlay(selectedCalculatorCurve, resolvedLayers, airborneContext);
  const curve = airborneOverlayResult.curve;
  const ratings = airborneOverlayResult.ratings;
  const adjustedEstimatedRwDb = round1(
    (dynamicAirborneResult?.rw ?? importedCalculatorResult?.rw ?? screeningEstimatedRwDb) -
      (
        (airborneOverlayResult.overlay?.baseRwDb ?? ratings.iso717.Rw) -
        ratings.iso717.Rw
      )
  );
  const exactImpact = exactImpactSource ? buildExactImpactFromSource(exactImpactSource) : null;
  const directFloorSystemMatch = predictorAdaptation?.officialFloorSystemId
    ? resolveExactFloorSystemById(predictorAdaptation.officialFloorSystemId)
    : matchExactFloorSystem(impactResolvedLayers);
  const directBoundFloorSystemMatch =
    !exactImpact && !directFloorSystemMatch
      ? predictorAdaptation?.officialFloorSystemId
        ? resolveBoundFloorSystemById(predictorAdaptation.officialFloorSystemId)
        : matchBoundFloorSystem(impactResolvedLayers)
      : null;
  const directImpactCatalogMatch = predictorAdaptation?.officialFloorSystemId ? null : matchImpactProductCatalog(impactResolvedLayers);
  const directFloorSystemRecommendations = directFloorSystemMatch ? [] : recommendFloorSystems(impactResolvedLayers, 8);
  const directPredictorSpecificFloorSystemEstimate =
    predictorInput && !predictorAdaptation?.officialFloorSystemId
      ? derivePredictorSpecificFloorSystemEstimate(predictorInput)
      : null;
  const directNarrowImpact = predictorAdaptation?.officialFloorSystemId ? null : estimateImpactFromLayers(impactResolvedLayers);
  const directBoundFloorSystemEstimate =
    !exactImpact &&
    !directFloorSystemMatch &&
    !directBoundFloorSystemMatch &&
    !directImpactCatalogMatch &&
    !directPredictorSpecificFloorSystemEstimate &&
    !directNarrowImpact
      ? deriveBoundFloorSystemEstimate(impactResolvedLayers)
      : null;
  const directFloorSystemEstimate =
    directPredictorSpecificFloorSystemEstimate ??
    (
      !exactImpact &&
      !directBoundFloorSystemMatch &&
      !directBoundFloorSystemEstimate &&
      !directImpactCatalogMatch &&
      !directNarrowImpact
        ? deriveFloorSystemEstimate(impactResolvedLayers, directFloorSystemRecommendations)
        : null
    );

  let floorSystemMatch = directFloorSystemMatch;
  let boundFloorSystemMatch = directBoundFloorSystemMatch;
  let impactCatalogMatch = directImpactCatalogMatch;
  let floorSystemRecommendations = directFloorSystemRecommendations;
  let narrowImpact = directNarrowImpact;
  let boundFloorSystemEstimate = directBoundFloorSystemEstimate;
  let floorSystemEstimate = directFloorSystemEstimate;
  let explicitDeltaImpact =
    predictorInput?.floorCovering?.mode === "delta_lw_catalog" &&
    typeof predictorInput.floorCovering.deltaLwDb === "number"
      ? deriveHeavyReferenceImpactFromDeltaLw(predictorInput.floorCovering.deltaLwDb)
      : null;

  if (explicitDeltaImpact) {
    narrowImpact = null;
    boundFloorSystemEstimate = null;
    floorSystemEstimate = null;
  }

  if (!explicitPredictorInput && !exactImpact && !directFloorSystemMatch && !directBoundFloorSystemMatch && !directImpactCatalogMatch) {
    const derivedPredictorInput = maybeBuildImpactPredictorInputFromLayerStack(layers);

    if (derivedPredictorInput) {
      const derivedPredictorAdaptation = adaptImpactPredictorInput(derivedPredictorInput);
      const derivedCatalog = mergePredictorCatalog(baseCatalog, derivedPredictorAdaptation.catalogAdditions);
      const derivedImpactResolvedLayers =
        derivedPredictorAdaptation.sourceLayers.length && !derivedPredictorAdaptation.officialFloorSystemId
          ? resolveLayers(derivedPredictorAdaptation.sourceLayers, derivedCatalog)
          : resolvedLayers;
      const derivedFloorSystemMatch = derivedPredictorAdaptation.officialFloorSystemId
        ? resolveExactFloorSystemById(derivedPredictorAdaptation.officialFloorSystemId)
        : matchExactFloorSystem(derivedImpactResolvedLayers);
      const derivedBoundFloorSystemMatch =
        !derivedFloorSystemMatch
          ? derivedPredictorAdaptation.officialFloorSystemId
            ? resolveBoundFloorSystemById(derivedPredictorAdaptation.officialFloorSystemId)
            : matchBoundFloorSystem(derivedImpactResolvedLayers)
          : null;
      const derivedImpactCatalogMatch = derivedPredictorAdaptation.officialFloorSystemId
        ? null
        : matchImpactProductCatalog(derivedImpactResolvedLayers);
      const derivedFloorSystemRecommendations = derivedFloorSystemMatch
        ? []
        : recommendFloorSystems(derivedImpactResolvedLayers, 8);
      const derivedExplicitDeltaImpact =
        derivedPredictorInput.floorCovering?.mode === "delta_lw_catalog" &&
        typeof derivedPredictorInput.floorCovering.deltaLwDb === "number"
          ? deriveHeavyReferenceImpactFromDeltaLw(derivedPredictorInput.floorCovering.deltaLwDb)
          : null;
      const derivedPredictorSpecificFloorSystemEstimate =
        derivedExplicitDeltaImpact ? null : derivePredictorSpecificFloorSystemEstimate(derivedPredictorInput);
      const derivedNarrowImpact = derivedPredictorAdaptation.officialFloorSystemId
        ? null
        : derivedExplicitDeltaImpact
          ? null
        : estimateImpactFromLayers(derivedImpactResolvedLayers);
      const derivedBoundFloorSystemEstimate =
        !derivedFloorSystemMatch &&
        !derivedBoundFloorSystemMatch &&
        !derivedImpactCatalogMatch &&
        !derivedExplicitDeltaImpact &&
        !derivedPredictorSpecificFloorSystemEstimate &&
        !derivedNarrowImpact
          ? deriveBoundFloorSystemEstimate(derivedImpactResolvedLayers)
          : null;
      const derivedFloorSystemEstimate =
        derivedExplicitDeltaImpact
          ? null
          : derivedPredictorSpecificFloorSystemEstimate ??
        (
          !derivedBoundFloorSystemMatch &&
          !derivedBoundFloorSystemEstimate &&
          !derivedImpactCatalogMatch &&
          !derivedNarrowImpact
            ? deriveFloorSystemEstimate(derivedImpactResolvedLayers, derivedFloorSystemRecommendations)
            : null
        );
      const shouldUseDerived =
        Boolean(
          derivedFloorSystemMatch ||
            derivedBoundFloorSystemMatch ||
            derivedImpactCatalogMatch ||
            derivedPredictorSpecificFloorSystemEstimate
        ) ||
        (!directNarrowImpact &&
          !directFloorSystemEstimate &&
          !directBoundFloorSystemEstimate &&
          Boolean(derivedNarrowImpact || derivedFloorSystemEstimate || derivedBoundFloorSystemEstimate));

      if (shouldUseDerived) {
        predictorInput = derivedPredictorInput;
        predictorInputMode = "derived_from_visible_layers";
        predictorAdaptation = derivedPredictorAdaptation;
        catalog = derivedCatalog;
        impactResolvedLayers = derivedImpactResolvedLayers;
        floorSystemMatch = derivedFloorSystemMatch;
        boundFloorSystemMatch = derivedBoundFloorSystemMatch;
        impactCatalogMatch = derivedImpactCatalogMatch;
        floorSystemRecommendations = derivedFloorSystemRecommendations;
        narrowImpact = derivedNarrowImpact;
        boundFloorSystemEstimate = derivedBoundFloorSystemEstimate;
        floorSystemEstimate = derivedFloorSystemEstimate;
        explicitDeltaImpact = derivedExplicitDeltaImpact;
      }
    }
  }
  const baseImpact =
    exactImpact ??
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
          resolvedLayers: impactResolvedLayers
        });
  const lowerBoundImpact = applyImpactFieldContextToBoundImpact(baseLowerBoundImpact, impactFieldContext);
  const targetOutputSupport = analyzeTargetOutputSupport({
    impact,
    lowerBoundImpact,
    metrics: {
      estimatedCDb: ratings.iso717.C,
      estimatedCtrDb: ratings.iso717.Ctr,
      estimatedRwDb: adjustedEstimatedRwDb,
      estimatedStc: ratings.astmE413.STC
    },
    targetOutputs: options.targetOutputs ?? []
  });
  const floorSystemRatings = buildFloorSystemRatings({
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
    resolvedLayers: impactResolvedLayers
  });
  const warnings = buildEstimateWarnings(resolvedLayers, selectedCalculatorLabel);
  warnings.push(...(dynamicAirborneResult?.warnings ?? []));
  warnings.push(...airborneOverlayResult.warnings);
  warnings.push(...buildTargetOutputWarnings(targetOutputSupport));

  if (predictorAdaptation) {
    warnings.push(...predictorAdaptation.notes);
  }

  if (predictorInputMode === "derived_from_visible_layers") {
    warnings.push(
      "Impact predictor topology was derived from visible floor-role layers, so curated family and predictor lanes can activate without a hidden selector."
    );
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
    warnings.push(
      `No curated exact floor-system landed. Closest family candidate is ${floorSystemRecommendations[0]?.system.label}.`
    );
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
      totalThicknessMm,
      surfaceMassKgM2,
      estimatedRwDb: adjustedEstimatedRwDb,
      estimatedCDb: ratings.iso717.C,
      estimatedCtrDb: ratings.iso717.Ctr,
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
