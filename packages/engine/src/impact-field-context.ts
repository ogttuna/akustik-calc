import type {
  ExactImpactSource,
  ImpactBoundCalculation,
  ImpactCalculation,
  ImpactFieldContext,
  ImpactSupportingElementFamily,
  ResolvedLayer
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { applyDirectFlankingFieldEstimate } from "./impact-direct-flanking";
import { deriveImpactGuideMetrics } from "./impact-guide";
import { createImpactMetricBasis, mergeImpactMetricBasis } from "./impact-metric-basis";

function pushOutput(outputs: ImpactCalculation["availableOutputs"], output: ImpactCalculation["availableOutputs"][number]) {
  if (!outputs.includes(output)) {
    outputs.push(output);
  }
}

function shouldApplyGuideFieldContext(input: ImpactFieldContext | null | undefined): boolean {
  return Boolean(
    typeof input?.fieldKDb === "number" ||
      typeof input?.guideHdDb === "number" ||
      typeof input?.guideMassRatio === "number" ||
      typeof input?.receivingRoomVolumeM3 === "number" ||
      input?.enableSmallRoomEstimate
  );
}

function resolveMixedImpactBasis(
  basis: ImpactCalculation["basis"],
  standardizedFieldEstimateActive: boolean,
  fieldKOnlyActive: boolean,
  guideProfile?: ImpactCalculation["guideEstimateProfile"]
): ImpactCalculation["basis"] {
  const exactBases = new Set<ImpactCalculation["basis"]>([
    "exact_source_band_curve_iso7172",
    "official_floor_system_exact_match",
    "open_measured_floor_system_exact_match",
    "peer_reviewed_floor_system_exact_match",
    "predictor_catalog_exact_match_official"
  ]);

  if (guideProfile === "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd") {
    return exactBases.has(basis)
      ? "mixed_exact_plus_estimated_local_guide"
      : "mixed_predicted_plus_estimated_local_guide";
  }

  if (exactBases.has(basis)) {
    if (fieldKOnlyActive) {
      return "mixed_exact_plus_estimated_field_k_correction";
    }

    return standardizedFieldEstimateActive
      ? "mixed_exact_plus_estimated_standardized_field_volume_normalization"
      : "mixed_exact_plus_estimated_tr_small_room_normalization";
  }

  if (fieldKOnlyActive) {
    return "mixed_predicted_plus_estimated_field_k_correction";
  }

  return standardizedFieldEstimateActive
    ? "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    : "mixed_predicted_plus_estimated_tr_small_room_normalization";
}

function resolveMixedBoundBasis(
  standardizedFieldEstimateActive: boolean
): ImpactBoundCalculation["basis"] {
  return standardizedFieldEstimateActive
    ? "mixed_bound_plus_estimated_standardized_field_volume_normalization"
    : "mixed_bound_plus_estimated_tr_small_room_normalization";
}

function buildDerivedMetricBasis(guide: ReturnType<typeof deriveImpactGuideMetrics>) {
  if (!guide) {
    return undefined;
  }

  return createImpactMetricBasis({
    LPrimeNW:
      typeof guide.LPrimeNW === "number"
        ? "estimated_field_lprimenw_from_lnw_plus_k"
        : undefined,
    LPrimeNT50:
      typeof guide.LPrimeNT50 === "number"
        ? guide.guideProfile
          ? "estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd"
          : "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500"
        : undefined,
    LPrimeNTw:
      typeof guide.LPrimeNTw === "number"
        ? guide.standardizedFieldEstimateActive
          ? "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume"
          : "estimated_local_guide_tr_small_rooms_lnw_plus_3"
        : undefined
  });
}

export function applyImpactFieldContextToImpact(
  impact: ImpactCalculation | null,
  fieldContext?: ImpactFieldContext | null,
  options?: {
    defaultSupportingElementFamily?: ImpactSupportingElementFamily | null;
    exactImpactSource?: ExactImpactSource | null;
    resolvedLayers?: readonly ResolvedLayer[] | null;
  }
): ImpactCalculation | null {
  if (!impact || impact.labOrField === "field") {
    return impact;
  }

  const directFlanking = applyDirectFlankingFieldEstimate({
    defaultSupportingElementFamily: options?.defaultSupportingElementFamily,
    exactImpactSource: options?.exactImpactSource,
    fieldContext: fieldContext ?? { flankingPaths: [] },
    impact,
    resolvedLayers: options?.resolvedLayers
  });

  if (directFlanking?.impact) {
    return directFlanking.impact;
  }

  if (typeof impact.LnW !== "number" || !shouldApplyGuideFieldContext(fieldContext)) {
    return impact;
  }

  const lowerTreatmentReductionDb =
    typeof fieldContext?.lowerTreatmentReductionDb === "number"
      ? fieldContext.lowerTreatmentReductionDb
      : undefined;
  const adjustedBaseLnW =
    typeof lowerTreatmentReductionDb === "number"
      ? impact.LnW - lowerTreatmentReductionDb
      : impact.LnW;

  const guide = deriveImpactGuideMetrics({
    baseConfidence: impact.confidence,
    baseLnW: adjustedBaseLnW,
    ci50_2500Db: typeof impact.CI50_2500 === "number" ? impact.CI50_2500 : null,
    ciDb:
      typeof impact.LnWPlusCI === "number" && typeof impact.LnW === "number"
        ? impact.LnWPlusCI - impact.LnW
        : typeof impact.CI === "number"
          ? impact.CI
          : null,
    enableSmallRoomEstimate: fieldContext?.enableSmallRoomEstimate,
    hdDb: typeof fieldContext?.guideHdDb === "number" ? fieldContext.guideHdDb : null,
    kDb: typeof fieldContext?.fieldKDb === "number" ? fieldContext.fieldKDb : null,
    massRatio: typeof fieldContext?.guideMassRatio === "number" ? fieldContext.guideMassRatio : null,
    receivingRoomVolumeM3:
      typeof fieldContext?.receivingRoomVolumeM3 === "number" ? fieldContext.receivingRoomVolumeM3 : null,
    source: "live_stack"
  });

  if (
    !guide ||
    (typeof guide.LPrimeNW !== "number" &&
      typeof guide.LPrimeNTw !== "number" &&
      typeof guide.LPrimeNT50 !== "number")
  ) {
    return impact;
  }

  const availableOutputs = [...impact.availableOutputs];
  if (typeof guide.LPrimeNW === "number") {
    pushOutput(availableOutputs, "L'n,w");
  }
  if (typeof guide.LPrimeNTw === "number") {
    pushOutput(availableOutputs, "L'nT,w");
  }
  if (typeof guide.LPrimeNT50 === "number") {
    pushOutput(availableOutputs, "L'nT,50");
  }

  const fieldKOnlyActive =
    typeof guide.LPrimeNW === "number" &&
    typeof guide.LPrimeNTw !== "number" &&
    typeof guide.LPrimeNT50 !== "number" &&
    !guide.guideProfile &&
    !guide.standardizedFieldEstimateActive;
  const basis = resolveMixedImpactBasis(
    impact.basis,
    guide.standardizedFieldEstimateActive,
    fieldKOnlyActive,
    guide.guideProfile
  );
  const confidence = getImpactConfidenceForBasis(basis);
  const metricBasis = mergeImpactMetricBasis(impact.metricBasis, buildDerivedMetricBasis(guide));

  return {
    ...impact,
    CI: impact.CI,
    CI50_2500: impact.CI50_2500,
    LPrimeNW: guide.LPrimeNW ?? impact.LPrimeNW,
    LPrimeNT50: guide.LPrimeNT50 ?? impact.LPrimeNT50,
    LPrimeNTw: guide.LPrimeNTw ?? impact.LPrimeNTw,
    LnW: impact.LnW,
    availableOutputs,
    basis,
    confidence,
    fieldEstimateKCorrectionDb:
      typeof guide.LPrimeNW === "number" && typeof guide.K === "number"
        ? guide.K
        : impact.fieldEstimateKCorrectionDb,
    fieldEstimateLowerTreatmentBandReduction: false,
    fieldEstimateLowerTreatmentReductionDb:
      typeof lowerTreatmentReductionDb === "number"
        ? lowerTreatmentReductionDb
        : impact.fieldEstimateLowerTreatmentReductionDb,
    fieldEstimateProfile:
      typeof guide.LPrimeNW === "number"
        ? "explicit_field_lprimenw_from_lnw_plus_k"
        : impact.fieldEstimateProfile,
    guideEstimateHdCorrectionDb:
      guide.guideProfile ? guide.Hd ?? impact.guideEstimateHdCorrectionDb : impact.guideEstimateHdCorrectionDb,
    guideEstimateHdSource:
      guide.guideProfile ? guide.HdSource ?? impact.guideEstimateHdSource : impact.guideEstimateHdSource,
    guideEstimateKCorrectionDb:
      guide.guideProfile ? guide.K ?? impact.guideEstimateKCorrectionDb : impact.guideEstimateKCorrectionDb,
    guideEstimateKSource:
      guide.guideProfile ? guide.KSource ?? impact.guideEstimateKSource : impact.guideEstimateKSource,
    guideEstimateMassRatio:
      guide.guideProfile ? guide.massRatio ?? impact.guideEstimateMassRatio : impact.guideEstimateMassRatio,
    guideEstimateMassRatioBracket:
      guide.guideProfile
        ? guide.massRatioBracket ?? impact.guideEstimateMassRatioBracket
        : impact.guideEstimateMassRatioBracket,
    guideEstimateProfile: guide.guideProfile ?? impact.guideEstimateProfile,
    guideEstimateReceivingRoomVolumeBracket:
      guide.guideProfile
        ? guide.receivingRoomVolumeBracket ?? impact.guideEstimateReceivingRoomVolumeBracket
        : impact.guideEstimateReceivingRoomVolumeBracket,
    guideEstimateReceivingRoomVolumeM3:
      guide.guideProfile
        ? guide.receivingRoomVolumeM3 ?? impact.guideEstimateReceivingRoomVolumeM3
        : impact.guideEstimateReceivingRoomVolumeM3,
    metricBasis,
    notes: [
      ...impact.notes,
      ...(typeof guide.LPrimeNW === "number"
        ? [`Live field-side supplement carried L'n,w = ${guide.LPrimeNW.toFixed(1)} dB from the current stack.`]
        : []),
      ...(typeof guide.LPrimeNTw === "number"
        ? [
            guide.standardizedFieldEstimateActive
              ? `Live field-side supplement carried L'nT,w = ${guide.LPrimeNTw.toFixed(1)} dB using K and receiving-room volume normalization.`
              : `Live field-side supplement carried L'nT,w = ${guide.LPrimeNTw.toFixed(1)} dB using the explicit small-room assumption.`
          ]
        : []),
      ...(typeof guide.LPrimeNT50 === "number"
        ? [`Live field-side supplement carried L'nT,50 = ${guide.LPrimeNT50.toFixed(1)} dB from the current stack.`]
        : []),
      ...(guide.KSource === "lookup_from_mass_ratio" && typeof guide.massRatio === "number"
        ? [`Live field-side supplement looked up K from Turkish guide Table 2.7 using a/(b+c+d+e) = ${guide.massRatio.toFixed(1)}.`]
        : []),
      ...(guide.HdSource === "lookup_from_receiving_room_volume" && typeof guide.receivingRoomVolumeM3 === "number"
        ? [
            `Live field-side supplement looked up Hd from Turkish guide Table 2.8 using receiving-room volume V = ${guide.receivingRoomVolumeM3.toFixed(1)} m³.`
          ]
        : [])
    ]
  };
}

export function applyImpactFieldContextToBoundImpact(
  impact: ImpactBoundCalculation | null,
  fieldContext?: ImpactFieldContext | null
): ImpactBoundCalculation | null {
  if (!impact || typeof impact.LnWUpperBound !== "number" || !shouldApplyGuideFieldContext(fieldContext)) {
    return impact;
  }

  const guide = deriveImpactGuideMetrics({
    baseConfidence: impact.confidence,
    baseLnWUpperBound: impact.LnWUpperBound,
    enableSmallRoomEstimate: fieldContext?.enableSmallRoomEstimate,
    hdDb: typeof fieldContext?.guideHdDb === "number" ? fieldContext.guideHdDb : null,
    kDb: typeof fieldContext?.fieldKDb === "number" ? fieldContext.fieldKDb : null,
    massRatio: typeof fieldContext?.guideMassRatio === "number" ? fieldContext.guideMassRatio : null,
    receivingRoomVolumeM3:
      typeof fieldContext?.receivingRoomVolumeM3 === "number" ? fieldContext.receivingRoomVolumeM3 : null,
    source: "live_stack"
  });

  if (
    !guide ||
    (typeof guide.LPrimeNWUpperBound !== "number" && typeof guide.LPrimeNTwUpperBound !== "number")
  ) {
    return impact;
  }

  const basis = resolveMixedBoundBasis(guide.standardizedFieldEstimateActive);
  const confidence = getImpactConfidenceForBasis(basis);

  return {
    ...impact,
    LPrimeNTwUpperBound: guide.LPrimeNTwUpperBound ?? impact.LPrimeNTwUpperBound,
    LPrimeNWUpperBound: guide.LPrimeNWUpperBound ?? impact.LPrimeNWUpperBound,
    basis,
    confidence,
    notes: [
      ...impact.notes,
      ...(typeof guide.LPrimeNWUpperBound === "number"
        ? [`Live field-side upper bound carried L'n,w <= ${guide.LPrimeNWUpperBound.toFixed(1)} dB from the current stack.`]
        : []),
      ...(typeof guide.LPrimeNTwUpperBound === "number"
        ? [
            guide.standardizedFieldEstimateActive
              ? `Live field-side upper bound carried L'nT,w <= ${guide.LPrimeNTwUpperBound.toFixed(1)} dB using K and receiving-room volume normalization.`
              : `Live field-side upper bound carried L'nT,w <= ${guide.LPrimeNTwUpperBound.toFixed(1)} dB using the explicit small-room assumption.`
          ]
        : [])
    ]
  };
}
