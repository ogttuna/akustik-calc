import type { ImpactCalculation, ImpactMetricBasisLabel } from "@dynecho/shared";

type ImpactMetricKey =
  | "CI"
  | "CI50_2500"
  | "DeltaLw"
  | "LPrimeNW"
  | "LPrimeNT50"
  | "LPrimeNTw"
  | "LnW"
  | "LnWPlusCI";

type ImpactMetricBasisRow = {
  basis: ImpactMetricBasisLabel;
  description: string;
  label: string;
  metric: ImpactMetricKey;
};

const IMPACT_METRIC_ORDER: readonly ImpactMetricKey[] = [
  "LnW",
  "DeltaLw",
  "CI",
  "CI50_2500",
  "LnWPlusCI",
  "LPrimeNW",
  "LPrimeNTw",
  "LPrimeNT50"
];

export function formatImpactMetricLabel(metric: ImpactMetricKey): string {
  switch (metric) {
    case "CI":
      return "CI";
    case "CI50_2500":
      return "CI,50-2500";
    case "DeltaLw":
      return "DeltaLw";
    case "LPrimeNW":
      return "L'n,w";
    case "LPrimeNT50":
      return "L'nT,50";
    case "LPrimeNTw":
      return "L'nT,w";
    case "LnW":
      return "Ln,w";
    case "LnWPlusCI":
      return "Ln,w+CI";
  }
}

export function formatImpactMetricBasisLabel(basis: ImpactMetricBasisLabel): string {
  switch (basis) {
    case "exact_source_band_curve_iso7172":
      return "Exact ISO 717-2 band rating";
    case "exact_source_improvement_curve_iso7172":
      return "Exact heavy-reference improvement rating";
    case "exact_source_rating_override":
      return "Exact source rating override";
    case "estimated_field_lprimenw_from_lnw_plus_k":
      return "Field K carry-over";
    case "estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd":
      return "TR simple guide";
    case "estimated_local_guide_tr_small_rooms_lnw_plus_3":
      return "TR small-room guide";
    case "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500":
      return "Standardized field + CI,50-2500";
    case "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume":
      return "Standardized field volume";
    case "official_floor_system_exact_match":
      return "Curated exact floor family";
    case "open_measured_floor_system_exact_match":
      return "Curated measured floor family";
    case "predictor_bare_massive_floor_iso12354_annexc_estimate":
      return "ISO 12354 bare heavy-floor estimate";
    case "predictor_heavy_floating_floor_iso12354_annexc_estimate":
      return "ISO 12354 floating-floor estimate";
    case "predictor_catalog_exact_match_official":
      return "Official product-system row";
    case "predictor_catalog_lower_bound_official":
      return "Official lower-bound support";
    case "predictor_catalog_product_delta_heavy_reference_derived":
      return "Catalog DeltaLw heavy-reference derive";
    case "predictor_catalog_product_delta_official":
      return "Official product DeltaLw row";
    case "predictor_explicit_delta_heavy_reference_derived":
      return "Explicit DeltaLw heavy-reference derive";
    case "predictor_explicit_delta_user_input":
      return "Explicit DeltaLw input";
    default:
      return basis.replaceAll("_", " ");
  }
}

export function describeImpactMetricBasis(metric: ImpactMetricKey, basis: ImpactMetricBasisLabel): string {
  switch (basis) {
    case "exact_source_band_curve_iso7172":
      return `${formatImpactMetricLabel(metric)} was rated directly from imported ISO 717-2 impact bands.`;
    case "exact_source_improvement_curve_iso7172":
      return `${formatImpactMetricLabel(metric)} came from an imported improvement curve against the ISO heavy reference floor.`;
    case "exact_source_rating_override":
      return `${formatImpactMetricLabel(metric)} came from an exact published or imported source rating without a local predictor step.`;
    case "official_floor_system_exact_match":
    case "open_measured_floor_system_exact_match":
      return `${formatImpactMetricLabel(metric)} came from a curated exact floor-family row.`;
    case "predictor_catalog_exact_match_official":
      return `${formatImpactMetricLabel(metric)} came from the matched official product-system row.`;
    case "predictor_catalog_product_delta_official":
      return `${formatImpactMetricLabel(metric)} came directly from the matched official DeltaLw catalog row.`;
    case "predictor_catalog_product_delta_heavy_reference_derived":
    case "predictor_explicit_delta_heavy_reference_derived":
      return `${formatImpactMetricLabel(metric)} was derived against the fixed ISO heavy reference floor.`;
    case "predictor_explicit_delta_user_input":
      return `${formatImpactMetricLabel(metric)} came directly from the supplied or catalog-backed DeltaLw input.`;
    case "estimated_field_lprimenw_from_lnw_plus_k":
      return `${formatImpactMetricLabel(metric)} was derived as Ln,w + K on the active lane.`;
    case "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume":
      return `${formatImpactMetricLabel(metric)} was derived as L'n,w + 10 log10(31.3 / V).`;
    case "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500":
      return `${formatImpactMetricLabel(metric)} was derived as L'nT,w + CI,50-2500.`;
    case "estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd":
      return `${formatImpactMetricLabel(metric)} was derived with the Turkish simple-guide formula Ln,w+CI + K + Hd.`;
    case "estimated_local_guide_tr_small_rooms_lnw_plus_3":
      return `${formatImpactMetricLabel(metric)} was derived with the Turkish small-room shortcut Ln,w + 3.`;
    case "predictor_bare_massive_floor_iso12354_annexc_estimate":
      return `${formatImpactMetricLabel(metric)} came from the bare heavy-floor ISO 12354 Annex C estimate.`;
    case "predictor_heavy_floating_floor_iso12354_annexc_estimate":
      return `${formatImpactMetricLabel(metric)} came from the narrow heavy-floor floating-floor ISO 12354 Annex C estimate.`;
    default:
      if (basis.startsWith("predictor_")) {
        return `${formatImpactMetricLabel(metric)} came from the active predictor or curated family-estimate lane.`;
      }

      if (basis.startsWith("mixed_")) {
        return `${formatImpactMetricLabel(metric)} came from a mixed lab-side source plus a field normalization step.`;
      }

      return `${formatImpactMetricLabel(metric)} is tied to the active ${basis.replaceAll("_", " ")} lane.`;
  }
}

export function getActiveImpactMetricBasisRows(
  impact: ImpactCalculation | null | undefined
): ImpactMetricBasisRow[] {
  if (!impact?.metricBasis) {
    return [];
  }

  return IMPACT_METRIC_ORDER.flatMap((metric) => {
    const basis = impact.metricBasis?.[metric];
    const value = impact[metric];

    if (typeof basis !== "string" || typeof value !== "number") {
      return [];
    }

    return [
      {
        basis,
        description: describeImpactMetricBasis(metric, basis),
        label: formatImpactMetricLabel(metric),
        metric
      }
    ];
  });
}
