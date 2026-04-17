import {
  formatImpactSupportingElementFamily,
  type DynamicImpactEvidenceTier,
  type DynamicImpactFieldContinuation,
  type DynamicImpactSelectionKind,
  type DynamicImpactTrace,
  type FloorSystemBoundEstimateResult,
  type FloorSystemBoundMatchResult,
  type FloorSystemEstimateResult,
  type FloorSystemEstimateKind,
  type FloorSystemMatchResult,
  type ImpactBoundCalculation,
  type ImpactCalculation,
  type ImpactCatalogMatchResult,
  type MaterialDefinition,
  type ImpactPredictorInput,
  type ImpactPredictorInputMode,
  type ResolvedLayer
} from "@dynecho/shared";

import {
  inferImpactSupportingElementFamilyFromExactFloorSystem,
  inferImpactSupportingElementFamilyFromFloorSystemEstimate,
  inferImpactSupportingElementFamilyFromImpactCatalogMatch,
  inferImpactSupportingElementFamilyFromLayers,
  inferImpactSupportingElementFamilyFromPredictorInput
} from "./impact-supporting-element-family";
import { maybeBuildImpactPredictorInputFromLayerStack } from "./impact-predictor-input";

type BuildDynamicImpactTraceInput = {
  boundFloorSystemEstimate?: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch?: FloorSystemBoundMatchResult | null;
  floorSystemEstimate?: FloorSystemEstimateResult | null;
  floorSystemMatch?: FloorSystemMatchResult | null;
  hasFieldContext: boolean;
  impact: ImpactCalculation | null;
  impactCatalogMatch?: ImpactCatalogMatchResult | null;
  lowerBoundImpact: ImpactBoundCalculation | null;
  predictorInput?: ImpactPredictorInput | null;
  predictorInputMode?: ImpactPredictorInputMode;
  catalog?: readonly MaterialDefinition[];
  resolvedLayers: readonly ResolvedLayer[];
};

const FORMULA_BARE_BASIS = "predictor_heavy_bare_floor_iso12354_annexc_estimate";
const FORMULA_BARE_METRIC_BASIS = "predictor_bare_massive_floor_iso12354_annexc_estimate";
const FORMULA_FLOATING_BASIS = "predictor_heavy_floating_floor_iso12354_annexc_estimate";
const FORMULA_PUBLISHED_UPPER_TREATMENT_BASIS = "predictor_heavy_concrete_published_upper_treatment_estimate";

function formatSelectionKindLabel(kind: DynamicImpactSelectionKind): string {
  switch (kind) {
    case "exact_band_source":
      return "Exact impact source";
    case "exact_floor_system":
      return "Exact floor-system family";
    case "official_catalog":
      return "Official catalog evidence";
    case "reference_derived":
      return "Heavy-reference derivation";
    case "formula_estimate":
      return "Scoped formula estimate";
    case "family_estimate":
      return "Published family estimate";
    case "bound_floor_system":
      return "Bound floor-system family";
    case "bound_family_estimate":
      return "Bound family estimate";
  }
}

function getScopedFormulaSelectionLabel(
  impact: ImpactCalculation | null,
  impactBasis: ImpactCalculation["basis"] | undefined
): string | null {
  const basisLabels = new Set<string>();

  if (impactBasis) {
    basisLabels.add(impactBasis);
  }

  for (const value of Object.values(impact?.metricBasis ?? {})) {
    basisLabels.add(value);
  }

  if (basisLabels.has(FORMULA_FLOATING_BASIS)) {
    return "Heavy floating-floor formula";
  }

  if (basisLabels.has(FORMULA_BARE_BASIS) || basisLabels.has(FORMULA_BARE_METRIC_BASIS)) {
    return "Heavy bare-floor formula";
  }

  if (basisLabels.has(FORMULA_PUBLISHED_UPPER_TREATMENT_BASIS)) {
    return "Heavy concrete published upper-treatment estimate";
  }

  return null;
}

function formatEvidenceTierLabel(tier: DynamicImpactEvidenceTier): string {
  switch (tier) {
    case "exact":
      return "Exact evidence";
    case "estimate":
      return "Estimated evidence";
    case "bound":
      return "Conservative bound";
    case "derived":
      return "Reference-derived";
  }
}

function formatEstimateTier(kind: FloorSystemEstimateKind | undefined): string | undefined {
  switch (kind) {
    case "family_archetype":
      return "Archetype family";
    case "family_general":
      return "Published family blend";
    case "low_confidence":
      return "Low-confidence fallback";
    default:
      return undefined;
  }
}

function formatTraceSelectionKindLabel(input: {
  estimateTier?: FloorSystemEstimateKind;
  selectionKind: DynamicImpactSelectionKind;
}): string {
  if (input.selectionKind === "family_estimate" && input.estimateTier === "low_confidence") {
    return "Low-confidence fallback";
  }

  return formatSelectionKindLabel(input.selectionKind);
}

function formatStructuralSupportType(value: ImpactPredictorInput["structuralSupportType"] | undefined): string | undefined {
  switch (value) {
    case "reinforced_concrete":
      return "Reinforced concrete";
    case "hollow_core":
      return "Hollow core";
    case "steel_joists":
      return "Steel joists";
    case "timber_joists":
      return "Timber joists";
    case "open_box_timber":
      return "Open-box timber";
    case "mass_timber_clt":
      return "Mass-timber CLT";
    case "composite_panel":
      return "Composite panel";
    default:
      return undefined;
  }
}

function formatSupportForm(value: ImpactPredictorInput["supportForm"] | undefined): string | undefined {
  switch (value) {
    case "joist_or_purlin":
      return "Joist or purlin";
    case "open_web_or_rolled":
      return "Open-web or rolled";
    default:
      return undefined;
  }
}

function formatSystemType(value: ImpactPredictorInput["impactSystemType"] | undefined): string | undefined {
  switch (value) {
    case "bare_floor":
      return "Bare floor";
    case "suspended_ceiling_only":
      return "Suspended ceiling only";
    case "dry_floating_floor":
      return "Dry floating floor";
    case "combined_upper_lower_system":
      return "Combined upper and lower system";
    case "heavy_floating_floor":
      return "Heavy floating floor";
    default:
      return undefined;
  }
}

function structuralSupportTypeFromFamily(
  family: DynamicImpactTrace["detectedSupportFamily"]
): ImpactPredictorInput["structuralSupportType"] | undefined {
  switch (family) {
    case "reinforced_concrete":
    case "hollow_core":
    case "steel_joists":
    case "timber_joists":
    case "open_box_timber":
    case "mass_timber_clt":
    case "composite_panel":
      return family;
    default:
      return undefined;
  }
}

function inferSupportFamilyFromUnscopedLayers(
  layers: readonly ResolvedLayer[]
): DynamicImpactTrace["detectedSupportFamily"] | null {
  const materialIds = layers.map((layer) => layer.material.id);

  if (materialIds.includes("concrete")) return "reinforced_concrete";
  if (materialIds.includes("hollow_core_plank") || materialIds.includes("hollow_core_slab")) return "hollow_core";
  if (
    materialIds.includes("open_web_steel_floor") ||
    materialIds.includes("open_web_steel_joist") ||
    materialIds.includes("steel_joist_floor") ||
    materialIds.includes("lightweight_steel_floor")
  ) {
    return "steel_joists";
  }
  if (materialIds.includes("open_box_timber_slab")) return "open_box_timber";
  if (materialIds.includes("clt_panel")) return "mass_timber_clt";
  if (
    materialIds.includes("steel_deck_composite") ||
    materialIds.includes("composite_steel_deck") ||
    materialIds.includes("composite_panel") ||
    materialIds.includes("composite_panel_floor")
  ) {
    return "composite_panel";
  }
  if (
    materialIds.includes("timber_frame_floor") ||
    materialIds.includes("timber_joist_floor") ||
    materialIds.includes("engineered_timber_structural") ||
    materialIds.includes("solid_wood")
  ) {
    return "timber_joists";
  }

  return null;
}

function inferSystemTypeFromUnscopedLayers(
  layers: readonly ResolvedLayer[]
): ImpactPredictorInput["impactSystemType"] | undefined {
  const resilientIndex = layers.findIndex(
    (layer) => typeof layer.material.impact?.dynamicStiffnessMNm3 === "number"
  );

  if (resilientIndex === -1) {
    return undefined;
  }

  const layersAboveResilient = layers.slice(0, resilientIndex);
  const hasFloatingMass = layersAboveResilient.some((layer) => layer.material.category === "mass");
  const hasFloorFinish = layersAboveResilient.some((layer) => layer.material.category === "finish");

  if (hasFloatingMass) {
    return "heavy_floating_floor";
  }

  if (hasFloorFinish) {
    return "dry_floating_floor";
  }

  return undefined;
}

function formatImpactBasisLabel(value: ImpactCalculation["basis"] | ImpactBoundCalculation["basis"] | undefined): string {
  switch (value) {
    case "exact_source_band_curve_iso7172":
      return "Exact ISO 717-2 band rating";
    case "exact_source_improvement_curve_iso7172":
      return "Exact ISO 717-2 improvement rating";
    case "official_floor_system_exact_match":
      return "Exact floor-system library match";
    case "official_floor_system_bound_support":
      return "Bound floor-system library support";
    case "predictor_catalog_exact_match_official":
      return "Exact official catalog system";
    case "predictor_catalog_lower_bound_official":
      return "Official catalog bound support";
    case "predictor_catalog_product_delta_official":
      return "Official DeltaLw catalog carry-over";
    case "predictor_explicit_delta_heavy_reference_derived":
      return "User DeltaLw heavy-reference carry-over";
    case "predictor_heavy_bare_floor_iso12354_annexc_estimate":
      return "Heavy bare-floor Annex C style estimate";
    case "predictor_heavy_floating_floor_iso12354_annexc_estimate":
      return "Heavy floating-floor Annex C style estimate";
    case "predictor_heavy_concrete_published_upper_treatment_estimate":
      return "Published heavy-concrete upper-treatment estimate";
    case "predictor_floor_system_family_archetype_estimate":
      return "Same-family archetype estimate";
    case "predictor_floor_system_family_general_estimate":
      return "Published family blend estimate";
    case "predictor_floor_system_low_confidence_estimate":
      return "Low-confidence family fallback";
    case "predictor_lightweight_steel_fl28_interpolation_estimate":
      return "Lightweight-steel FL-28 interpolation";
    case "predictor_lightweight_steel_bound_interpolation_estimate":
      return "Lightweight-steel bound interpolation";
    case "predictor_lightweight_steel_missing_support_form_bound_estimate":
      return "Lightweight-steel bound estimate";
    case "mixed_exact_plus_estimated_direct_flanking_energy_sum":
    case "mixed_exact_plus_estimated_standardized_direct_flanking_energy_sum":
    case "mixed_predicted_plus_estimated_direct_flanking_energy_sum":
    case "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum":
      return "Direct + flanking field carry-over";
    case "mixed_exact_plus_estimated_standardized_field_volume_normalization":
    case "mixed_predicted_plus_estimated_standardized_field_volume_normalization":
    case "mixed_bound_plus_estimated_standardized_field_volume_normalization":
      return "Standardized field-volume carry-over";
    case "mixed_exact_plus_estimated_local_guide":
    case "mixed_predicted_plus_estimated_local_guide":
      return "Local-guide carry-over";
    case "mixed_exact_plus_estimated_tr_small_room_normalization":
    case "mixed_predicted_plus_estimated_tr_small_room_normalization":
    case "mixed_bound_plus_estimated_tr_small_room_normalization":
      return "Turkish small-room carry-over";
    default:
      return value ? value.replaceAll("_", " ") : "No live impact basis";
  }
}

function collectMetricLabels(
  impact: ImpactCalculation | null,
  lowerBoundImpact: ImpactBoundCalculation | null
): string[] {
  const labels: string[] = [];

  if (typeof impact?.LnW === "number") labels.push("Ln,w");
  if (typeof impact?.CI === "number") labels.push("CI");
  if (typeof impact?.CI50_2500 === "number") labels.push("CI,50-2500");
  if (typeof impact?.LnWPlusCI === "number") labels.push("Ln,w+CI");
  if (typeof impact?.DeltaLw === "number") labels.push("DeltaLw");
  if (typeof impact?.LPrimeNW === "number") labels.push("L'n,w");
  if (typeof impact?.LPrimeNTw === "number") labels.push("L'nT,w");
  if (typeof impact?.LPrimeNT50 === "number") labels.push("L'nT,50");
  if (typeof lowerBoundImpact?.LnWUpperBound === "number") labels.push("Ln,w upper bound");
  if (typeof lowerBoundImpact?.LnWPlusCIUpperBound === "number") labels.push("Ln,w+CI upper bound");
  if (typeof lowerBoundImpact?.DeltaLwLowerBound === "number") labels.push("DeltaLw lower bound");
  if (typeof lowerBoundImpact?.LPrimeNWUpperBound === "number") labels.push("L'n,w upper bound");
  if (typeof lowerBoundImpact?.LPrimeNTwUpperBound === "number") labels.push("L'nT,w upper bound");
  if (typeof lowerBoundImpact?.LPrimeNT50UpperBound === "number") labels.push("L'nT,50 upper bound");

  return labels;
}

function resolveFieldContinuation(input: {
  hasFieldContext: boolean;
  impact: ImpactCalculation | null;
  lowerBoundImpact: ImpactBoundCalculation | null;
}): {
  directFlankingActive: boolean;
  fieldContinuation: DynamicImpactFieldContinuation;
  fieldContinuationLabel: string;
  fieldOutputsActive: boolean;
  guideActive: boolean;
  standardizedFieldActive: boolean;
} {
  const { impact, lowerBoundImpact } = input;
  const fieldOutputsActive = Boolean(
    typeof impact?.LPrimeNW === "number" ||
      typeof impact?.LPrimeNTw === "number" ||
      typeof impact?.LPrimeNT50 === "number" ||
      typeof lowerBoundImpact?.LPrimeNWUpperBound === "number" ||
      typeof lowerBoundImpact?.LPrimeNTwUpperBound === "number" ||
      typeof lowerBoundImpact?.LPrimeNT50UpperBound === "number"
  );
  const directFlankingActive = impact?.fieldEstimateProfile === "direct_flanking_energy_sum";
  const simpleGuideActive =
    impact?.guideEstimateProfile === "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd";
  const smallRoomGuideActive =
    impact?.metricBasis?.LPrimeNTw === "estimated_local_guide_tr_small_rooms_lnw_plus_3";
  const standardizedFieldActive =
    impact?.metricBasis?.LPrimeNTw === "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume" ||
    impact?.metricBasis?.LPrimeNTw ===
      "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume" ||
    typeof lowerBoundImpact?.LPrimeNTwUpperBound === "number";

  if (directFlankingActive) {
    return {
      directFlankingActive: true,
      fieldContinuation: "direct_flanking_energy_sum",
      fieldContinuationLabel: standardizedFieldActive
        ? "Direct + flanking field re-rating"
        : "Direct + flanking L'n,w estimate",
      fieldOutputsActive,
      guideActive: false,
      standardizedFieldActive
    };
  }

  if (simpleGuideActive) {
    return {
      directFlankingActive: false,
      fieldContinuation: "local_guide_simple",
      fieldContinuationLabel: "Turkish simple guide",
      fieldOutputsActive,
      guideActive: true,
      standardizedFieldActive: false
    };
  }

  if (smallRoomGuideActive) {
    return {
      directFlankingActive: false,
      fieldContinuation: "local_guide_small_room",
      fieldContinuationLabel: "Turkish small-room guide",
      fieldOutputsActive,
      guideActive: true,
      standardizedFieldActive: false
    };
  }

  if (typeof lowerBoundImpact?.LPrimeNTwUpperBound === "number" && input.hasFieldContext) {
    return {
      directFlankingActive: false,
      fieldContinuation: "bound_room_volume",
      fieldContinuationLabel: "Bound field carry-over",
      fieldOutputsActive,
      guideActive: false,
      standardizedFieldActive: true
    };
  }

  if (standardizedFieldActive) {
    return {
      directFlankingActive: false,
      fieldContinuation: "standardized_room_volume",
      fieldContinuationLabel: "Standardized room-volume carry-over",
      fieldOutputsActive,
      guideActive: false,
      standardizedFieldActive: true
    };
  }

  if (fieldOutputsActive) {
    return {
      directFlankingActive: false,
      fieldContinuation: "explicit_k_correction",
      fieldContinuationLabel: "Explicit K correction",
      fieldOutputsActive,
      guideActive: false,
      standardizedFieldActive: false
    };
  }

  return {
    directFlankingActive: false,
    fieldContinuation: "none",
    fieldContinuationLabel: input.hasFieldContext ? "Field context provided, no continuation active" : "No field continuation",
    fieldOutputsActive: false,
    guideActive: false,
    standardizedFieldActive: false
  };
}

export function buildDynamicImpactTrace(
  input: BuildDynamicImpactTraceInput
): DynamicImpactTrace | null {
  const confidenceCarrier = input.impact?.confidence ?? input.lowerBoundImpact?.confidence ?? null;

  if (!confidenceCarrier) {
    return null;
  }

  const resolvedPredictorInput =
    input.predictorInput ?? maybeBuildImpactPredictorInputFromLayerStack(input.resolvedLayers, {}, undefined, input.catalog) ?? null;
  const fallbackSupportFamily = inferSupportFamilyFromUnscopedLayers(input.resolvedLayers);
  const supportFamily =
    inferImpactSupportingElementFamilyFromExactFloorSystem(input.floorSystemMatch?.system) ??
    inferImpactSupportingElementFamilyFromExactFloorSystem(input.boundFloorSystemMatch?.system) ??
    inferImpactSupportingElementFamilyFromFloorSystemEstimate(input.floorSystemEstimate) ??
    inferImpactSupportingElementFamilyFromImpactCatalogMatch(input.impactCatalogMatch) ??
    inferImpactSupportingElementFamilyFromPredictorInput(resolvedPredictorInput) ??
    inferImpactSupportingElementFamilyFromLayers(input.resolvedLayers) ??
    fallbackSupportFamily ??
    null;
  const fieldContinuation = resolveFieldContinuation({
    hasFieldContext: input.hasFieldContext,
    impact: input.impact,
    lowerBoundImpact: input.lowerBoundImpact
  });
  const impactBasis = input.impact?.basis ?? input.lowerBoundImpact?.basis;
  const formulaSelectionLabel = getScopedFormulaSelectionLabel(input.impact, input.impact?.basis);
  const availableMetricLabels = collectMetricLabels(input.impact, input.lowerBoundImpact);
  const structuralSupportType =
    resolvedPredictorInput?.structuralSupportType ?? structuralSupportTypeFromFamily(supportFamily ?? undefined);
  const supportForm = resolvedPredictorInput?.supportForm;
  const systemType = resolvedPredictorInput?.impactSystemType ?? inferSystemTypeFromUnscopedLayers(input.resolvedLayers);

  let selectionKind: DynamicImpactSelectionKind = "formula_estimate";
  let evidenceTier: DynamicImpactEvidenceTier = input.lowerBoundImpact && !input.impact ? "bound" : "estimate";
  let selectedLabel = "Impact lane";
  let selectedSourceIds: string[] = [];
  let selectedSourceLabels: string[] = [];
  let candidateRowCount = input.impact?.estimateCandidateIds?.length ?? 0;
  let estimateTier: FloorSystemEstimateKind | undefined;
  let fitPercent: number | undefined;

  if (
    (
      input.impact?.confidence.provenance === "exact_band_curve" ||
      /^exact_source_/i.test(input.impact?.basis ?? "") ||
      /^mixed_exact_plus_/i.test(input.impact?.basis ?? "")
    ) &&
    !input.floorSystemMatch &&
    !input.impactCatalogMatch
  ) {
    selectionKind = "exact_band_source";
    evidenceTier = "exact";
    selectedLabel = input.impact?.labOrField === "field" ? "Exact field impact bands" : "Exact lab impact bands";
    candidateRowCount = 1;
  } else if (input.floorSystemMatch && input.impact) {
    selectionKind = "exact_floor_system";
    evidenceTier = "exact";
    selectedLabel = input.floorSystemMatch.system.label;
    selectedSourceIds = [input.floorSystemMatch.system.id];
    selectedSourceLabels = [input.floorSystemMatch.system.label];
    candidateRowCount = 1;
    fitPercent = 100;
  } else if (input.impactCatalogMatch) {
    selectionKind = "official_catalog";
    evidenceTier =
      input.impactCatalogMatch.catalog.matchMode === "product_property_delta"
        ? "derived"
        : input.lowerBoundImpact && !input.impact
          ? "bound"
          : "exact";
    selectedLabel = input.impactCatalogMatch.catalog.label;
    selectedSourceIds = [input.impactCatalogMatch.catalog.id];
    selectedSourceLabels = [input.impactCatalogMatch.catalog.label];
    candidateRowCount = 1;
  } else if (input.impact?.basis === "predictor_explicit_delta_heavy_reference_derived") {
    selectionKind = "reference_derived";
    evidenceTier = "derived";
    selectedLabel = "Heavy-reference DeltaLw carry-over";
    selectedSourceIds = ["predictor_explicit_delta_heavy_reference_derived"];
    selectedSourceLabels = ["Heavy-reference DeltaLw carry-over"];
    candidateRowCount = 1;
  } else if (input.floorSystemEstimate && input.impact) {
    selectionKind = "family_estimate";
    evidenceTier = "estimate";
    estimateTier = input.floorSystemEstimate.kind;
    selectedLabel = `${formatEstimateTier(estimateTier) ?? "Published family"} · ${input.floorSystemEstimate.structuralFamily}`;
    selectedSourceIds = input.floorSystemEstimate.sourceSystems.map((system) => system.id);
    selectedSourceLabels = input.floorSystemEstimate.sourceSystems.map((system) => system.label);
    candidateRowCount = input.floorSystemEstimate.sourceSystems.length;
    fitPercent = input.floorSystemEstimate.fitPercent;
  } else if (input.boundFloorSystemMatch && input.lowerBoundImpact) {
    selectionKind = "bound_floor_system";
    evidenceTier = "bound";
    selectedLabel = input.boundFloorSystemMatch.system.label;
    selectedSourceIds = [input.boundFloorSystemMatch.system.id];
    selectedSourceLabels = [input.boundFloorSystemMatch.system.label];
    candidateRowCount = 1;
    fitPercent = 100;
  } else if (input.boundFloorSystemEstimate && input.lowerBoundImpact) {
    selectionKind = "bound_family_estimate";
    evidenceTier = "bound";
    selectedLabel = `${input.boundFloorSystemEstimate.structuralFamily} bound estimate`;
    selectedSourceIds = input.boundFloorSystemEstimate.sourceSystems.map((system) => system.id);
    selectedSourceLabels = input.boundFloorSystemEstimate.sourceSystems.map((system) => system.label);
    candidateRowCount = input.boundFloorSystemEstimate.sourceSystems.length;
    fitPercent = input.boundFloorSystemEstimate.fitPercent;
  } else if (formulaSelectionLabel) {
    selectionKind = "formula_estimate";
    evidenceTier = "estimate";
    selectedLabel = formulaSelectionLabel;
    candidateRowCount = 1;
  }

  const selectionKindLabel = formatTraceSelectionKindLabel({
    estimateTier,
    selectionKind
  });

  const notes: string[] = [
    `${selectionKindLabel} is active on the current impact lane.`,
    `Current evidence tier is ${formatEvidenceTierLabel(evidenceTier).toLowerCase()}.`
  ];

  if (supportFamily) {
    notes.push(`Detected support family: ${formatImpactSupportingElementFamily(supportFamily)}.`);
  }

  if (estimateTier && typeof fitPercent === "number") {
    notes.push(`${formatEstimateTier(estimateTier)} stayed active at ${fitPercent.toFixed(0)}% fit.`);
  }

  if (fieldContinuation.fieldContinuation !== "none") {
    notes.push(`Field continuation is active through ${fieldContinuation.fieldContinuationLabel.toLowerCase()}.`);
  }

  if (input.predictorInputMode) {
    notes.push(
      input.predictorInputMode === "derived_from_visible_layers"
        ? "Predictor topology came from visible floor-role layers."
        : "Predictor topology was supplied explicitly at the engine boundary."
    );
  }

  return {
    availableMetricLabels,
    boundOnly: Boolean(input.lowerBoundImpact && !input.impact),
    candidateRowCount,
    confidenceClass: confidenceCarrier.level,
    confidenceScore: confidenceCarrier.score,
    confidenceSummary: confidenceCarrier.summary,
    detectedSupportFamily: supportFamily ?? undefined,
    detectedSupportFamilyLabel: supportFamily ? formatImpactSupportingElementFamily(supportFamily) : undefined,
    directFlankingActive: fieldContinuation.directFlankingActive,
    estimateTier,
    estimateTierLabel: formatEstimateTier(estimateTier),
    evidenceTier,
    evidenceTierLabel: formatEvidenceTierLabel(evidenceTier),
    fieldContinuation: fieldContinuation.fieldContinuation,
    fieldContinuationLabel: fieldContinuation.fieldContinuationLabel,
    fieldOutputsActive: fieldContinuation.fieldOutputsActive,
    fitPercent,
    guideActive: fieldContinuation.guideActive,
    hasFieldContext: input.hasFieldContext,
    impactBasis,
    impactBasisLabel: formatImpactBasisLabel(impactBasis),
    matchedCatalogCaseId: input.impactCatalogMatch?.catalog.id,
    matchedFloorSystemId: input.floorSystemMatch?.system.id ?? input.boundFloorSystemMatch?.system.id,
    notes,
    predictorInputMode: input.predictorInputMode,
    selectedLabel,
    selectedSourceIds,
    selectedSourceLabels,
    selectionKind,
    selectionKindLabel,
    standardizedFieldActive: fieldContinuation.standardizedFieldActive,
    structuralSupportLabel: formatStructuralSupportType(structuralSupportType),
    structuralSupportType,
    supportForm,
    supportFormLabel: formatSupportForm(supportForm),
    systemType,
    systemTypeLabel: formatSystemType(systemType)
  };
}
