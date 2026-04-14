import {
  formatImpactSupportingElementFamily,
  type FloorSystemBoundEstimateResult,
  type FloorSystemBoundMatchResult,
  type FloorSystemEstimateResult,
  type FloorSystemMatchResult,
  type ImpactBoundCalculation,
  type ImpactCalculation,
  type ImpactCatalogMatchResult,
  type ImpactSupport
} from "@dynecho/shared";

type BuildImpactSupportInput = {
  boundFloorSystemEstimate?: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch?: FloorSystemBoundMatchResult | null;
  floorSystemEstimate?: FloorSystemEstimateResult | null;
  floorSystemMatch?: FloorSystemMatchResult | null;
  impact: ImpactCalculation | null;
  impactCatalogMatch?: ImpactCatalogMatchResult | null;
  lowerBoundImpact: ImpactBoundCalculation | null;
};

const ANNEX_C_BARE_BASIS = "predictor_heavy_bare_floor_iso12354_annexc_estimate";
const ANNEX_C_BARE_METRIC_BASIS = "predictor_bare_massive_floor_iso12354_annexc_estimate";
const ANNEX_C_FLOATING_BASIS = "predictor_heavy_floating_floor_iso12354_annexc_estimate";

function pushUnique(target: string[], line: string) {
  if (!target.includes(line)) {
    target.push(line);
  }
}

function formatDbValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function hasMetricBasis(impact: ImpactCalculation | null, label: string): boolean {
  if (!impact?.metricBasis) {
    return false;
  }

  return Object.values(impact.metricBasis).some((value) => value === label);
}

function hasBareAnnexCFormula(impact: ImpactCalculation | null): boolean {
  return impact?.basis === ANNEX_C_BARE_BASIS || hasMetricBasis(impact, ANNEX_C_BARE_METRIC_BASIS);
}

function hasFloatingAnnexCFormula(impact: ImpactCalculation | null): boolean {
  return impact?.basis === ANNEX_C_FLOATING_BASIS || hasMetricBasis(impact, ANNEX_C_FLOATING_BASIS);
}

export function buildImpactSupport(input: BuildImpactSupportInput): ImpactSupport | null {
  const basis = input.impact?.basis ?? input.lowerBoundImpact?.basis;
  const notes: string[] = [];
  const formulaNotes: string[] = [];

  if (!basis && !input.floorSystemMatch && !input.floorSystemEstimate && !input.impactCatalogMatch && !input.lowerBoundImpact) {
    return null;
  }

  if (input.impact?.basis === "exact_source_band_curve_iso7172") {
    notes.push("Exact impact-band data is active while the headline value and TL curve remain on the airborne path.");
  }

  if (input.impact?.guideEstimateProfile) {
    notes.push("Local-guide estimate is active on top of the live impact lane.");
  }

  if (input.floorSystemMatch) {
    notes.push(`Curated exact floor-system family is active: ${input.floorSystemMatch.system.label}.`);
  } else if (input.floorSystemEstimate) {
    notes.push(`Published floor-system family estimate is active: ${input.floorSystemEstimate.structuralFamily}.`);
  }

  if (input.impactCatalogMatch) {
    notes.push(`Official catalog match data is active: ${input.impactCatalogMatch.catalog.label}.`);
  }

  if (input.impactCatalogMatch?.lowerBoundImpact && input.impact) {
    notes.push("Official lower-bound catalog support remains visible beside the live estimate.");
  }

  if (input.impact?.fieldEstimateProfile === "direct_flanking_energy_sum") {
    notes.push("Field-side estimate used a direct+flanking path energy sum on the available impact evidence.");
  }

  if (input.lowerBoundImpact && !input.impact) {
    notes.push("Conservative upper-bound support is active; DynEcho did not fabricate an exact Ln,w metric.");
  }

  if (input.boundFloorSystemMatch) {
    notes.push(`Curated bound-only floor-system family is active: ${input.boundFloorSystemMatch.system.label}.`);
  } else if (input.boundFloorSystemEstimate) {
    notes.push(`Published bound-only family estimate is active: ${input.boundFloorSystemEstimate.structuralFamily}.`);
  }

  const hasBareAnnexC = hasBareAnnexCFormula(input.impact);
  const hasFloatingAnnexC = hasFloatingAnnexCFormula(input.impact);

  if (input.impact && (hasBareAnnexC || hasFloatingAnnexC)) {
    notes.push("Annex C style estimate is active on the dedicated impact lane.");
    pushUnique(formulaNotes, "Annex C style estimate remains a narrow heavy-floor screening path.");
    if (hasBareAnnexC || hasFloatingAnnexC) {
      pushUnique(formulaNotes, "Heavy bare-floor path follows 164 - 35 log10(m'base) for the base slab contribution.");
    }
    if (hasFloatingAnnexC) {
      pushUnique(formulaNotes, "Floating-floor branch applies 13 log10(m'load) - 14.2 log10(s') + 20.8 for the treatment term.");
      pushUnique(formulaNotes, "Resonance cross-check follows f0 ~= 160 * sqrt(s'/m'load).");
    }
  }

  if (
    input.impact?.basis === "predictor_heavy_concrete_published_upper_treatment_estimate" &&
    input.impact?.metricBasis?.DeltaLw === "predictor_heavy_floating_floor_iso12354_annexc_estimate"
  ) {
    notes.push("Published heavy-concrete Ln,w estimate is carrying a same-stack Annex C style DeltaLw companion.");
    pushUnique(formulaNotes, "DeltaLw companion followed 13 log10(m'load) - 14.2 log10(s') + 20.8 on the same visible stack.");
    if (typeof input.impact.predictorResonanceHz === "number") {
      pushUnique(formulaNotes, "The carried DeltaLw companion kept the floating-floor resonance cross-check f0 ~= 160 * sqrt(s'/m'load).");
    }
  }

  if (input.impact && (input.impact.basis === "exact_source_band_curve_iso7172" || hasMetricBasis(input.impact, "exact_source_band_curve_iso7172"))) {
    pushUnique(formulaNotes, "ISO 717-2 impact contour was used to rate the supplied band curve.");
  }

  if (input.impact?.fieldEstimateProfile === "direct_flanking_energy_sum") {
    pushUnique(formulaNotes, "Field-side estimate used a direct+flanking path energy sum on the available impact bands before ISO 717-2 re-rating.");
    if (typeof input.impact.fieldEstimateDirectOffsetDb === "number") {
      pushUnique(
        formulaNotes,
        `Current direct-path offset is ${input.impact.fieldEstimateDirectOffsetDb} dB before flanking energy summation.`
      );
    }
    if (typeof input.impact.fieldEstimateFlankingPathCount === "number") {
      pushUnique(
        formulaNotes,
        `Current direct+flanking estimate used ${Math.max(1, Math.round(input.impact.fieldEstimateFlankingPathCount))} active flanking path(s).`
      );
    }
    if (typeof input.impact.fieldEstimateExpertPathModifierCount === "number" && input.impact.fieldEstimateExpertPathModifierCount > 0) {
      pushUnique(formulaNotes, "Explicit flanking-path modifiers were applied from expert junction inputs (length / isolation / short-circuit / Kij-style penalties).");
    }
    if (input.impact.fieldEstimateFlankingFamilyModels?.length) {
      pushUnique(
        formulaNotes,
        `Family-aware flanking path models were applied for: ${input.impact.fieldEstimateFlankingFamilyModels
          .map((family) => formatImpactSupportingElementFamily(family))
          .join(", ")}.`
      );
    }
    if (typeof input.impact.fieldEstimateLowerTreatmentReductionDb === "number") {
      pushUnique(
        formulaNotes,
        `ΔLd = ${formatDbValue(input.impact.fieldEstimateLowerTreatmentReductionDb)} dB was applied to the direct path before energy summation.`
      );
    }
  }

  if (typeof input.impact?.LnWPlusCI === "number") {
    pushUnique(formulaNotes, "Ln,w+CI was computed as Ln,w + CI.");
  }

  if (
    input.impact &&
    (input.impact.basis === "predictor_catalog_product_delta_official" ||
      input.impact.metricBasis?.LnW === "predictor_explicit_delta_heavy_reference_derived")
  ) {
    pushUnique(formulaNotes, "Ln,w = 78 - DeltaLw on the heavy reference floor.");
  }

  if (input.impact?.referenceFloorType === "heavy_standard") {
    pushUnique(formulaNotes, "ISO 717-2 heavy reference floor is active for DeltaLw carry-over.");
  }

  if (input.impact?.metricBasis?.LPrimeNTw === "estimated_local_guide_tr_small_rooms_lnw_plus_3") {
    pushUnique(formulaNotes, "L'nT,w = Ln,w + 3 on the explicit TR small-room guide path.");
  }

  if (input.impact?.metricBasis?.LPrimeNTw === "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume") {
    pushUnique(formulaNotes, "L'nT,w = L'n,w + 10 log10(31.3 / V) on the standardized field-volume path.");
  }

  if (input.impact?.metricBasis?.LPrimeNW === "estimated_field_lprimenw_from_lnw_plus_k") {
    pushUnique(formulaNotes, "L'n,w = Ln,w + K.");
    if (typeof input.impact.fieldEstimateLowerTreatmentReductionDb === "number") {
      pushUnique(
        formulaNotes,
        `ΔLd = ${formatDbValue(input.impact.fieldEstimateLowerTreatmentReductionDb)} dB was applied before the field-side K correction.`
      );
    }
  }

  if (input.impact?.metricBasis?.LPrimeNTw === "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume") {
    pushUnique(formulaNotes, "Standardized field estimate used a direct+flanking path energy sum first, then applied L'nT,w = L'n,w + 10 log10(31.3 / V).");
  }

  if (input.impact?.metricBasis?.LPrimeNT50 === "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500") {
    pushUnique(formulaNotes, "L'nT,50 was computed as L'nT,w + CI,50-2500.");
  }

  if (input.impact?.metricBasis?.LPrimeNT50 === "estimated_standardized_field_lpriment50_from_direct_flanking_energy_sum_plus_ci50_2500") {
    pushUnique(formulaNotes, "L'nT,50 was computed as L'nT,w + CI,50-2500.");
  }

  if (input.impact?.metricBasis?.LPrimeNT50 === "estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd") {
    pushUnique(formulaNotes, "L'nT,50 was computed as Ln,w+CI + K + Hd.");
  }

  if (input.impact?.metricBasis?.LnTA === "exact_source_dutch_lnta_from_octave_bands") {
    pushUnique(formulaNotes, "Dutch LnT,A was computed from exact 125..2000 Hz field octave bands as 10 log10(sum 10^(LnT,i/10)) - 15.");
  }

  if (
    typeof input.impact?.fieldEstimateLowerTreatmentReductionDb === "number" &&
    (
      input.impact.metricBasis?.LPrimeNTw === "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume" ||
      input.impact.metricBasis?.LPrimeNTw === "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume"
    )
  ) {
    pushUnique(formulaNotes, "The ΔLd-adjusted direct path was then applied before field standardization.");
  }

  return {
    basis,
    formulaNotes,
    labOrField: input.impact?.labOrField,
    notes,
    primaryCurveType:
      input.impact?.fieldEstimateProfile === "direct_flanking_energy_sum"
        ? "impact_curve"
        : input.impact?.basis === "exact_source_band_curve_iso7172"
          ? "airborne_tl"
          : undefined,
    primaryCurveUnaffected:
      input.impact?.fieldEstimateProfile === "direct_flanking_energy_sum"
        ? false
        : input.impact?.basis === "exact_source_band_curve_iso7172"
          ? true
          : undefined,
    referenceFloorType: input.impact?.referenceFloorType
  };
}
