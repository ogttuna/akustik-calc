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
import {
  ASTM_E989_IMPACT_RATING_BASIS,
  buildOwnedImpactFromExactSource
} from "./impact-astm-e989";
import {
  applyImpactFieldContextToBoundImpact,
  applyImpactFieldContextToImpact
} from "./impact-field-context";
import {
  HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
  estimateImpactFromLayers,
  estimateImpactFromPredictorInput
} from "./impact-estimate";
import { buildImpactPredictorStatus } from "./impact-predictor-status";
import { shouldBlockHeavyConcreteCombinedImpactFormulaFallback } from "./heavy-concrete-combined-impact-formula-corridor";
import { isPredictorHeavyConcreteCarrierEligible } from "./heavy-concrete-carrier-eligibility";
import { deriveHeavyConcretePublishedUpperTreatmentEstimate } from "./heavy-concrete-published-upper-treatment-estimate";
import {
  filterImpactCatalogMatchForExplicitPredictorInput,
  matchImpactProductCatalog
} from "./impact-product-catalog";
import { deriveHeavyReferenceImpactFromDeltaLw } from "./impact-reference";
import { mergeImpactCalculations, mergePublishedUpperTreatmentDeltaCompanion } from "./impact-merge";
import { mergeImpactMetricBasis } from "./impact-metric-basis";
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
  LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
  estimateLightweightConcreteDeltaLwFromPredictorInput,
  mergeLightweightConcreteDeltaLwCompanion
} from "./lightweight-concrete-delta-lw-runtime-corridor";
import {
  LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
} from "./lightweight-concrete-family-runtime-constants";
import { mergeMassTimberCltUpperPackageDeltaLwCompanion } from "./mass-timber-clt-upper-package-delta-lw-runtime";
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
const EXACT_ASTM_ISO_COMPANION_NOTE =
  "Ln,w and DeltaLw were carried from the same-stack ISO impact companion while the exact ASTM impact rating stayed on its ASTM E989 basis.";
const LOW_DENSITY_EXACT_ASTM_COMPANION_INTERNAL_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "C",
  "DeltaLw",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,w",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "Ln,w",
  "R'w",
  "Rw"
]);

function hasLowDensityExactAstmCompanionInternalRequest(
  targetOutputs: readonly RequestedOutputId[] | undefined
): boolean {
  return Boolean(
    targetOutputs?.some((output) =>
      LOW_DENSITY_EXACT_ASTM_COMPANION_INTERNAL_OUTPUTS.has(output)
    )
  );
}

function hasExactAstmIsoImpactCompanion(
  impact: ImpactCalculation | null | undefined
): impact is ImpactCalculation {
  const metricBasis = impact?.metricBasis;

  return Boolean(
    impact &&
      (
        impact.basis === HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS ||
        impact.basis === LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS ||
        impact.basis === LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS ||
        metricBasis?.LnW === HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS ||
        metricBasis?.DeltaLw === HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS ||
        metricBasis?.LnW === LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS ||
        metricBasis?.DeltaLw === LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS
      ) &&
      (
        typeof impact.LnW === "number" ||
        typeof impact.DeltaLw === "number"
      )
  );
}

function pickExactAstmIsoImpactCompanion(
  ...candidates: Array<ImpactCalculation | null | undefined>
): ImpactCalculation | null {
  return candidates.find(hasExactAstmIsoImpactCompanion) ?? null;
}

function mergeAvailableOutput(
  outputs: ImpactCalculation["availableOutputs"],
  output: RequestedOutputId
): ImpactCalculation["availableOutputs"] {
  return outputs.includes(output) ? outputs : [...outputs, output];
}

function mergeExactAstmImpactWithIsoCompanion(
  exactImpact: ImpactCalculation | null,
  companionImpact: ImpactCalculation | null
): ImpactCalculation | null {
  if (!exactImpact) {
    return null;
  }

  if (
    exactImpact.basis !== ASTM_E989_IMPACT_RATING_BASIS ||
    !hasExactAstmIsoImpactCompanion(companionImpact)
  ) {
    return exactImpact;
  }

  const merged: ImpactCalculation = {
    ...exactImpact,
    availableOutputs: [...exactImpact.availableOutputs],
    metricBasis: mergeImpactMetricBasis(companionImpact.metricBasis, exactImpact.metricBasis),
    notes: exactImpact.notes.includes(EXACT_ASTM_ISO_COMPANION_NOTE)
      ? [...exactImpact.notes]
      : [...exactImpact.notes, EXACT_ASTM_ISO_COMPANION_NOTE]
  };

  if (typeof merged.LnW !== "number" && typeof companionImpact.LnW === "number") {
    merged.LnW = companionImpact.LnW;
    merged.availableOutputs = mergeAvailableOutput(merged.availableOutputs, "Ln,w");
  }

  if (typeof merged.DeltaLw !== "number" && typeof companionImpact.DeltaLw === "number") {
    merged.DeltaLw = companionImpact.DeltaLw;
    merged.availableOutputs = mergeAvailableOutput(merged.availableOutputs, "DeltaLw");
  }

  return merged;
}

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
  const isHeavyFloatingConcreteCandidate = Boolean(
    predictorInput &&
      predictorInput.structuralSupportType === "reinforced_concrete" &&
      predictorInput.impactSystemType === "heavy_floating_floor"
  );

  return Boolean(
    predictorInput &&
      isHeavyFloatingConcreteCandidate &&
      (
        !isPredictorHeavyConcreteCarrierEligible(predictorInput.baseSlab) ||
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
  const hasLiveImpactCatalogMatch = Boolean(impactCatalogMatch?.impact);
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
    !hasLiveImpactCatalogMatch &&
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
    !hasLiveImpactCatalogMatch &&
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
    !hasLiveImpactCatalogMatch &&
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
    !hasLiveImpactCatalogMatch &&
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
    !hasLiveImpactCatalogMatch &&
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
    !hasLiveImpactCatalogMatch &&
    !explicitDeltaImpact &&
    !openBoxTimberSimilarityEstimate &&
    !openBoxTimberEpsScreedHybridPackageEstimate &&
    !openBoxTimberRawBareEstimate &&
    !helperOnlyTimberOpenWebImpactStackEstimate &&
    !tuasC11cGuardedIsoWeightedImpact
      ? estimateImpactFromPredictorInput(input.predictorInput)
      : null;
  const timberCltDeltaLwCompanion =
    input.predictorInput &&
    input.targetOutputs?.includes("DeltaLw") &&
    !input.officialFloorSystemId &&
    !hasLiveImpactCatalogMatch &&
    !explicitDeltaImpact
      ? estimateTimberCltDeltaLwFromPredictorInput(input.predictorInput)
      : null;
  const lightweightConcreteDeltaLwCompanion =
    input.predictorInput &&
    (
      input.targetOutputs?.includes("DeltaLw") ||
      (
        input.exactImpact?.basis === ASTM_E989_IMPACT_RATING_BASIS &&
        hasLowDensityExactAstmCompanionInternalRequest(input.targetOutputs)
      )
    ) &&
    !input.officialFloorSystemId &&
    !hasLiveImpactCatalogMatch &&
    !explicitDeltaImpact
      ? estimateLightweightConcreteDeltaLwFromPredictorInput(input.predictorInput)
      : null;
  const predictorDeltaLwCompanion = timberCltDeltaLwCompanion ?? lightweightConcreteDeltaLwCompanion;
  const heavyConcreteCombinedPublishedUpperTreatmentEstimate =
    input.predictorInput &&
    blockHeavyConcreteCombinedFormulaFallback &&
    !input.officialFloorSystemId &&
    !input.exactImpact &&
    !floorSystemMatch &&
    !boundFloorSystemMatch &&
    !hasLiveImpactCatalogMatch &&
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
    !hasLiveImpactCatalogMatch &&
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
    !hasLiveImpactCatalogMatch &&
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
    !hasLiveImpactCatalogMatch &&
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
    !hasLiveImpactCatalogMatch &&
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
    !hasLiveImpactCatalogMatch &&
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
  const allowFloorSystemEstimateWithExactAstmLightweightCompanion = Boolean(
    input.exactImpact?.basis === ASTM_E989_IMPACT_RATING_BASIS &&
      predictorDeltaLwCompanion?.basis === LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS
  );
  const rawFloorSystemEstimate =
    explicitDeltaImpact || predictorSpecificFloorSystemEstimate
      ? null
      : (!input.exactImpact || allowFloorSystemEstimateWithExactAstmLightweightCompanion) &&
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
          !hasLiveImpactCatalogMatch &&
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
  const floorSystemMatchImpactWithCltUpperPackageDeltaLw = mergeMassTimberCltUpperPackageDeltaLwCompanion(
    input.floorSystemMatch ? input.floorSystemMatch.impact : null,
    input.floorSystemMatch?.system ?? null
  );
  const floorSystemMatchImpact = mergeTimberCltDeltaLwFormulaCompanion(
    floorSystemMatchImpactWithCltUpperPackageDeltaLw,
    input.floorSystemMatch ? input.predictorDeltaLwCompanion ?? null : null
  );
  const floorEstimateImpactWithTimberCltCompanion = mergeTimberCltDeltaLwFormulaCompanion(
    floorEstimateImpact,
    floorEstimateImpact ? input.predictorDeltaLwCompanion ?? null : null
  );
  const floorEstimateImpactWithDeltaLwCompanion = mergeLightweightConcreteDeltaLwCompanion(
    floorEstimateImpactWithTimberCltCompanion,
    floorEstimateImpactWithTimberCltCompanion ? input.predictorDeltaLwCompanion ?? null : null
  );
  const exactAstmImpactWithSupplementaryImpact = mergeImpactCalculations(exactImpact, exactSupplementaryImpact);
  const exactAstmIsoImpactCompanion = pickExactAstmIsoImpactCompanion(
    floorEstimateImpactWithDeltaLwCompanion,
    input.preferredSupplementaryImpact ?? null,
    input.fallbackSupplementaryImpact ?? null,
    input.narrowImpact ?? null,
    input.predictorDeltaLwCompanion ?? null
  );
  const baseImpact = exactImpact
    ? mergeExactAstmImpactWithIsoCompanion(
        exactAstmImpactWithSupplementaryImpact,
        exactAstmIsoImpactCompanion
      )
    : (
        floorSystemMatchImpact ??
        input.impactCatalogMatch?.impact ??
        input.explicitDeltaImpact ??
        floorEstimateImpactWithDeltaLwCompanion ??
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
