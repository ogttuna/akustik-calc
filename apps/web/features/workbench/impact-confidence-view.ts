import type { ImpactConfidence, ImpactConfidenceLevel, ImpactConfidenceProvenance } from "@dynecho/shared";

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

export function describeConfidence(confidence: Pick<ImpactConfidence, "level" | "score" | "summary">): string {
  return `${formatConfidenceLevel(confidence.level)} at ${formatConfidenceScore(confidence.score)}. ${confidence.summary}`;
}
