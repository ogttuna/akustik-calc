import type { ImpactBoundCalculation, ImpactCalculation } from "@dynecho/shared";

export type ImpactLaneKind =
  | "bound_only"
  | "exact_family"
  | "exact_source"
  | "official_catalog"
  | "published_family"
  | "scoped_formula"
  | "unavailable";

export function getImpactLaneKind(input: {
  impact: ImpactCalculation | null | undefined;
  lowerBoundImpact?: ImpactBoundCalculation | null | undefined;
}): ImpactLaneKind {
  const impact = input.impact ?? null;

  if (!impact) {
    return input.lowerBoundImpact ? "bound_only" : "unavailable";
  }

  if (
    impact.basis === "exact_source_band_curve_iso7172" ||
    impact.basis === "exact_source_improvement_curve_iso7172"
  ) {
    return "exact_source";
  }

  if (impact.confidence.provenance === "exact_floor_system_family") {
    return "exact_family";
  }

  if (impact.confidence.provenance === "official_product_catalog") {
    return "official_catalog";
  }

  if (impact.confidence.provenance === "published_family_estimate" && impact.scope === "family_estimate") {
    return "published_family";
  }

  return "scoped_formula";
}

export function getImpactLanePillLabel(kind: ImpactLaneKind): string {
  switch (kind) {
    case "exact_source":
      return "Exact live";
    case "exact_family":
      return "Exact family live";
    case "published_family":
      return "Family estimate live";
    case "official_catalog":
      return "Official live";
    case "bound_only":
      return "Bound support live";
    case "scoped_formula":
      return "Scoped live";
    case "unavailable":
      return "Awaiting supported topology";
  }
}

export function getImpactLaneHeadline(kind: ImpactLaneKind): string {
  switch (kind) {
    case "exact_source":
      return "Exact impact outputs";
    case "exact_family":
      return "Exact family outputs";
    case "published_family":
      return "Published family estimate";
    case "official_catalog":
      return "Official impact outputs";
    case "bound_only":
      return "Conservative upper-bound support";
    case "scoped_formula":
      return "Ln,w and DeltaLw";
    case "unavailable":
      return "Ln,w and DeltaLw";
  }
}

export function getImpactLaneNarrative(kind: ImpactLaneKind, hasExactFamilyCompanion: boolean): string {
  const narrative =
    kind === "exact_source"
      ? "Exact impact-band sources now stay on their own evidence lane. Airborne Rw/TL remains on the screening path while impact ratings come directly from the imported nominal grid."
      : kind === "exact_family"
        ? "Curated exact floor families now feed the main impact lane as well. Published Ln,w and companion terms from exact floor rows are no longer stranded in a side panel."
        : kind === "published_family"
          ? "When no exact floor row lands, DynEcho can now keep the estimate inside the right physical family and label the result with the published branch it came from instead of returning an empty impact lane."
          : kind === "official_catalog"
            ? "Official product rows now stay on their own evidence lane. Exact manufacturer-system rows, lower-bound support rows, and catalog DeltaLw entries are surfaced without pretending they are generic topology solvers."
            : kind === "bound_only"
              ? "Some official rows publish conservative impact support only, such as Ln,w upper bounds, Ln,w+CI upper bounds, or DeltaLw lower bounds. DynEcho now carries those bounds honestly instead of inventing a precise live metric."
              : kind === "scoped_formula"
                ? "This lane stays honest: the local formula and predictor branch still covers the narrow heavy-floor estimate path, while exact families, official rows, exact imports, and labeled published-family fallbacks can light up their own evidence lanes when the topology supports them. Broader family import and deeper field-side continuations still need more adoption work."
                : "The current stack does not yet hit a supported impact lane.";

  return hasExactFamilyCompanion ? `${narrative} A curated exact family match is active below, so use that lane for family-published Ln,w and companion terms.` : narrative;
}
