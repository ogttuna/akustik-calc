import type {
  ImpactConfidence,
  ImpactConfidenceLevel,
  ImpactConfidenceProvenance
} from "@dynecho/shared";

export function formatConfidenceLevel(level: ImpactConfidenceLevel): string {
  return `${level.charAt(0).toUpperCase()}${level.slice(1)} confidence`;
}

export function formatConfidenceScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export function getConfidenceTone(
  level: ImpactConfidenceLevel
): "accent" | "neutral" | "success" | "warning" {
  if (level === "high") {
    return "success";
  }

  if (level === "medium") {
    return "accent";
  }

  return "warning";
}

export function formatConfidenceProvenance(provenance: ImpactConfidenceProvenance): string {
  if (provenance === "exact_band_curve") {
    return "Exact band curve";
  }

  if (provenance === "exact_floor_system_family") {
    return "Exact floor family";
  }

  if (provenance === "published_family_estimate") {
    return "Published family estimate";
  }

  if (provenance === "formula_estimate_narrow_scope") {
    return "Narrow formula";
  }

  if (provenance === "official_product_catalog") {
    return "Official product catalog";
  }

  if (provenance === "reference_derived") {
    return "Reference-derived";
  }

  return "Manual guide";
}

export function formatConfidenceProvenanceForImpact(input: {
  basis?: string | null;
  provenance: ImpactConfidenceProvenance;
}): string {
  if (input.basis === "predictor_floor_system_low_confidence_estimate") {
    return "Low-confidence fallback";
  }

  if (input.basis === "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate") {
    return "Heavy concrete combined formula corridor";
  }

  if (input.basis === "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate") {
    return "Steel formula corridor";
  }

  if (input.basis === "predictor_lightweight_steel_suspended_ceiling_corridor_estimate") {
    return "Steel suspended-ceiling formula corridor";
  }

  if (input.basis === "predictor_lightweight_steel_open_web_supported_band_similarity_estimate") {
    return "Open-web steel supported-band similarity";
  }

  if (input.basis === "broad_accuracy_floor_open_web_direct_fixed_lining_direct_source_interpolation_formula_corridor") {
    return "Open-web steel direct-fixed lining interpolation";
  }

  if (input.basis === "broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor") {
    return "Raw-bare open-web steel formula corridor";
  }

  if (input.basis === "broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor") {
    return "Open-box timber package-transfer corridor";
  }

  if (input.basis === "broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor") {
    return "Raw-bare open-box timber formula corridor";
  }

  if (input.basis === "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor") {
    return "Open-box timber EPS/screed hybrid package formula corridor";
  }

  if (input.basis === "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor") {
    return "Helper-only timber/open-web formula corridor";
  }

  if (input.basis === "tuas_c11c_visible_iso_weighted_impact_tuple_guarded") {
    return "TUAS C11c guarded ISO tuple";
  }

  return formatConfidenceProvenance(input.provenance);
}

export function describeConfidence(confidence: Pick<ImpactConfidence, "level" | "score" | "summary">): string {
  return `${formatConfidenceLevel(confidence.level)} at ${formatConfidenceScore(confidence.score)}. ${confidence.summary}`;
}
