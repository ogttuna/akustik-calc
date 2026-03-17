import type {
  ImpactCalculation,
  ImpactConfidence,
  ImpactConfidenceLevel,
  ImpactEstimateBasis
} from "@dynecho/shared";

function clampScore(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}

function levelFromScore(score: number): ImpactConfidenceLevel {
  if (score >= 0.82) {
    return "high";
  }

  if (score >= 0.62) {
    return "medium";
  }

  return "low";
}

export function getImpactConfidenceForBasis(basis: ImpactEstimateBasis): ImpactConfidence {
  if (basis === "mixed_exact_plus_estimated_field_k_correction") {
    return {
      level: "high",
      provenance: "exact_floor_system_family",
      score: 0.91,
      summary: "Exact lab-side impact evidence carried through an explicit field K correction."
    };
  }

  if (basis === "mixed_exact_plus_estimated_standardized_field_volume_normalization") {
    return {
      level: "high",
      provenance: "exact_floor_system_family",
      score: 0.9,
      summary: "Exact lab-side impact evidence carried through explicit K and standardized receiving-room volume normalization."
    };
  }

  if (basis === "mixed_exact_plus_estimated_local_guide") {
    return {
      level: "high",
      provenance: "exact_floor_system_family",
      score: 0.88,
      summary: "Exact lab-side impact evidence carried through the documented Turkish simple-guide K and Hd correction workflow."
    };
  }

  if (basis === "mixed_exact_plus_estimated_tr_small_room_normalization") {
    return {
      level: "high",
      provenance: "exact_floor_system_family",
      score: 0.86,
      summary: "Exact lab-side impact evidence carried through the explicit TR small-room field assumption."
    };
  }

  if (basis === "mixed_predicted_plus_estimated_standardized_field_volume_normalization") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.72,
      summary: "Predicted or catalog lab-side impact evidence carried through explicit K and standardized receiving-room volume normalization."
    };
  }

  if (basis === "mixed_predicted_plus_estimated_field_k_correction") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.73,
      summary: "Predicted or catalog lab-side impact evidence carried through an explicit field K correction."
    };
  }

  if (basis === "mixed_predicted_plus_estimated_local_guide") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.7,
      summary: "Predicted or catalog lab-side impact evidence carried through the documented Turkish simple-guide K and Hd correction workflow."
    };
  }

  if (basis === "mixed_predicted_plus_estimated_tr_small_room_normalization") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.67,
      summary: "Predicted or catalog lab-side impact evidence carried through the explicit TR small-room field assumption."
    };
  }

  if (basis === "mixed_bound_plus_estimated_standardized_field_volume_normalization") {
    return {
      level: "medium",
      provenance: "exact_floor_system_family",
      score: 0.7,
      summary: "Conservative lab-side impact bound carried through explicit K and standardized receiving-room volume normalization."
    };
  }

  if (basis === "mixed_bound_plus_estimated_tr_small_room_normalization") {
    return {
      level: "medium",
      provenance: "exact_floor_system_family",
      score: 0.65,
      summary: "Conservative lab-side impact bound carried through the explicit TR small-room field assumption."
    };
  }

  if (basis === "exact_source_band_curve_iso7172") {
    return {
      level: "high",
      provenance: "exact_band_curve",
      score: 0.94,
      summary: "Exact impact-band source aligned to an ISO 717-2 nominal grid and rated directly from the impact contour."
    };
  }

  if (basis === "exact_source_improvement_curve_iso7172") {
    return {
      level: "high",
      provenance: "exact_band_curve",
      score: 0.91,
      summary: "Exact impact-improvement curve compared directly against the ISO 717-2 heavy reference floor."
    };
  }

  if (basis === "official_floor_system_exact_match") {
    return {
      level: "high",
      provenance: "exact_floor_system_family",
      score: 0.96,
      summary: "Curated exact match against an official manufacturer or open component floor-system table."
    };
  }

  if (basis === "official_floor_system_bound_support") {
    return {
      level: "high",
      provenance: "exact_floor_system_family",
      score: 0.88,
      summary: "Curated official floor-system row with conservative impact-bound support only. Airborne values are exact; impact stays an upper-bound lane."
    };
  }

  if (basis === "open_measured_floor_system_exact_match") {
    return {
      level: "high",
      provenance: "exact_floor_system_family",
      score: 0.9,
      summary: "Curated exact match against a measured open floor-system dataset."
    };
  }

  if (basis === "peer_reviewed_floor_system_exact_match") {
    return {
      level: "high",
      provenance: "exact_floor_system_family",
      score: 0.92,
      summary: "Curated exact match against a peer-reviewed measured floor-system dataset."
    };
  }

  if (basis === "predictor_composite_panel_published_interaction_estimate") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.77,
      summary: "Published composite-panel interaction estimate blended from nearby measured rows in the same system family."
    };
  }

  if (basis === "predictor_heavy_concrete_published_upper_treatment_estimate") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.79,
      summary: "Published heavy-concrete upper-treatment estimate anchored to nearby curated concrete floor rows."
    };
  }

  if (basis === "predictor_mass_timber_clt_bare_interpolation_estimate") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.73,
      summary: "Measured CLT bare-floor interpolation blended between nearby laminate-underlay rows."
    };
  }

  if (basis === "predictor_mass_timber_clt_dataholz_dry_estimate") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.8,
      summary: "Published Dataholz CLT dry-family estimate aligned to the same dry upper-treatment branch."
    };
  }

  if (basis === "predictor_mass_timber_clt_dry_interaction_estimate") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.76,
      summary: "Measured CLT dry interaction estimate blended from nearby rows with similar upper and lower treatment coupling."
    };
  }

  if (basis === "predictor_lightweight_steel_fl28_interpolation_estimate") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.78,
      summary: "Published lightweight-steel FL-28 interpolation anchored to the exact UBIQ open-web rows before the broader steel-family blend."
    };
  }

  if (basis === "predictor_floor_system_family_archetype_estimate") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.78,
      summary: "Same-family estimate blended from nearby published rows with aligned structural family and floor profile."
    };
  }

  if (basis === "predictor_lightweight_steel_bound_interpolation_estimate") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.72,
      summary: "Official lightweight-steel bound-only family interpolation. The carried impact metric stays a conservative upper bound rather than a fabricated exact Ln,w."
    };
  }

  if (basis === "predictor_lightweight_steel_missing_support_form_bound_estimate") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.66,
      summary: "Conservative lightweight-steel bound estimate used when support-form semantics are underspecified."
    };
  }

  if (basis === "predictor_floor_system_family_general_estimate") {
    return {
      level: "medium",
      provenance: "published_family_estimate",
      score: 0.69,
      summary: "Broader published-family estimate blended from nearby rows in the same structural family."
    };
  }

  if (basis === "predictor_floor_system_low_confidence_estimate") {
    return {
      level: "low",
      provenance: "published_family_estimate",
      score: 0.54,
      summary: "Low-confidence fallback blended from the nearest published floor-family rows to avoid an empty impact lane."
    };
  }

  if (basis === "predictor_catalog_exact_match_official") {
    return {
      level: "high",
      provenance: "official_product_catalog",
      score: 0.89,
      summary: "Exact match against an official product-system technical-data row."
    };
  }

  if (basis === "predictor_catalog_lower_bound_official") {
    return {
      level: "high",
      provenance: "official_product_catalog",
      score: 0.83,
      summary: "Official product row publishes conservative lower-bound impact support only; treat it as guidance, not as an exact metric."
    };
  }

  if (basis === "predictor_catalog_product_delta_official") {
    return {
      level: "medium",
      provenance: "official_product_catalog",
      score: 0.79,
      summary: "Official product DeltaLw row carried against the fixed ISO heavy reference floor."
    };
  }

  if (basis === "predictor_heavy_floating_floor_iso12354_annexc_estimate") {
    return {
      level: "medium",
      provenance: "formula_estimate_narrow_scope",
      score: 0.74,
      summary: "Narrow Annex-C style floating-floor estimate with explicit dynamic stiffness and carried mass."
    };
  }

  if (basis === "predictor_heavy_bare_floor_iso12354_annexc_estimate") {
    return {
      level: "medium",
      provenance: "formula_estimate_narrow_scope",
      score: 0.68,
      summary: "Narrow bare heavy-floor screening estimate. Useful for early checks, but not a family-aware predictor."
    };
  }

  return {
    level: "low",
    provenance: "reference_derived",
    score: 0.56,
    summary: "Derived from a published DeltaLw value against a fixed heavy reference, not from the live assembly topology."
  };
}

export type ImpactGuideConfidence = {
  level: ImpactConfidenceLevel;
  provenance: "manual_guide_supplement";
  score: number;
  summary: string;
};

export function deriveImpactGuideConfidence(input: {
  baseConfidence?: ImpactCalculation["confidence"] | null;
  source: "heavy_reference" | "live_stack";
}): ImpactGuideConfidence {
  const inheritedScore = input.baseConfidence?.score ?? (input.source === "live_stack" ? 0.72 : 0.56);
  const score = clampScore(inheritedScore - (input.source === "live_stack" ? 0.04 : 0.08));

  return {
    level: levelFromScore(score),
    provenance: "manual_guide_supplement",
    score,
    summary:
      input.source === "live_stack"
        ? "Guide output inherits the live stack Ln,w and adds manual guide-side corrections."
        : "Guide output inherits a heavy-reference shortcut Ln,w and adds manual guide-side corrections."
  };
}
