import type { ImpactBoundCalculation, ImpactCalculation } from "@dynecho/shared";

import {
  getSteelFloorFormulaCorridorNarrative,
  isSteelFloorFormulaCorridorImpact
} from "./steel-floor-formula-corridor-view";
import {
  getHeavyConcreteCombinedFormulaCorridorNarrative,
  isHeavyConcreteCombinedFormulaCorridorImpact
} from "./heavy-concrete-combined-impact-corridor-view";
import {
  OPEN_WEB_SUPPORTED_BAND_SIMILARITY_LABEL,
  isOpenWebSupportedBandSimilarityImpact
} from "./open-web-supported-band-similarity-surface";
import {
  OPEN_WEB_DIRECT_FIXED_LINING_LABEL,
  isOpenWebDirectFixedLiningImpact
} from "./open-web-direct-fixed-lining-surface";

export type ImpactLaneKind =
  | "bound_only"
  | "exact_family"
  | "exact_source"
  | "heavy_concrete_combined_formula_corridor"
  | "low_confidence_fallback"
  | "official_catalog"
  | "open_web_direct_fixed_lining"
  | "open_web_supported_band_similarity"
  | "published_family"
  | "scoped_formula"
  | "steel_formula_corridor"
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

  if (impact.basis === "predictor_floor_system_low_confidence_estimate") {
    return "low_confidence_fallback";
  }

  if (isHeavyConcreteCombinedFormulaCorridorImpact(impact)) {
    return "heavy_concrete_combined_formula_corridor";
  }

  if (isSteelFloorFormulaCorridorImpact(impact)) {
    return "steel_formula_corridor";
  }

  if (isOpenWebSupportedBandSimilarityImpact(impact)) {
    return "open_web_supported_band_similarity";
  }

  if (isOpenWebDirectFixedLiningImpact(impact)) {
    return "open_web_direct_fixed_lining";
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
    case "low_confidence_fallback":
      return "Low-confidence live";
    case "published_family":
      return "Family estimate live";
    case "official_catalog":
      return "Official live";
    case "open_web_supported_band_similarity":
      return "Open-web similarity live";
    case "open_web_direct_fixed_lining":
      return "Direct-fixed open-web live";
    case "bound_only":
      return "Bound support live";
    case "scoped_formula":
      return "Scoped live";
    case "heavy_concrete_combined_formula_corridor":
      return "Heavy concrete formula live";
    case "steel_formula_corridor":
      return "Steel formula live";
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
    case "low_confidence_fallback":
      return "Low-confidence fallback";
    case "published_family":
      return "Published family estimate";
    case "official_catalog":
      return "Official impact outputs";
    case "open_web_supported_band_similarity":
      return OPEN_WEB_SUPPORTED_BAND_SIMILARITY_LABEL;
    case "open_web_direct_fixed_lining":
      return OPEN_WEB_DIRECT_FIXED_LINING_LABEL;
    case "bound_only":
      return "Conservative upper-bound support";
    case "scoped_formula":
      return "Ln,w and DeltaLw";
    case "heavy_concrete_combined_formula_corridor":
      return "Heavy concrete combined formula corridor";
    case "steel_formula_corridor":
      return "Steel floor formula corridor";
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
        : kind === "low_confidence_fallback"
          ? "This lane stays source-backed and non-empty, but it is the final low-confidence fallback built from nearby published rows rather than a narrow same-family estimate. Keep it explicit as a fallback and do not present it as a family-calibrated result."
        : kind === "open_web_supported_band_similarity"
          ? "This floor lane stays inside the UBIQ FL-24/FL-26 open-web steel supported-band source grid. Exact rows still win on true matches; FL-28 interpolation, carpet/bound-only support, field, building, ASTM, and IIC outputs stay outside this lab estimate."
        : kind === "open_web_direct_fixed_lining"
          ? "This floor lane stays inside the UBIQ FL-23/FL-25/FL-27 open-web steel direct-fixed source grid. Exact rows still win on true matches; resilient suspended-ceiling rows, broad steel blends, field, building, ASTM, and IIC outputs stay outside this lab estimate."
        : kind === "published_family"
          ? "When no exact floor row lands, DAC can now keep the estimate inside the right physical family and label the result with the published branch it came from instead of returning an empty impact lane."
          : kind === "official_catalog"
            ? "Official product rows now stay on their own evidence lane. Exact manufacturer-system rows, lower-bound support rows, and catalog DeltaLw entries are surfaced without pretending they are generic topology solvers."
            : kind === "bound_only"
              ? "Some official rows publish conservative impact support only, such as Ln,w upper bounds, Ln,w+CI upper bounds, or DeltaLw lower bounds. DAC now carries those bounds honestly instead of inventing a precise live metric."
              : kind === "scoped_formula"
                ? "This lane stays honest: the local formula and predictor branch still covers the narrow heavy-floor estimate path, while exact families, official rows, exact imports, and labeled published-family fallbacks can light up their own evidence lanes when the topology supports them. Broader family import and deeper field-side continuations still need more adoption work."
                : kind === "heavy_concrete_combined_formula_corridor"
                  ? getHeavyConcreteCombinedFormulaCorridorNarrative()
                : kind === "steel_formula_corridor"
                  ? getSteelFloorFormulaCorridorNarrative()
                : "The current stack does not yet hit a supported impact lane.";

  return hasExactFamilyCompanion ? `${narrative} A curated exact family match is active below, so use that lane for family-published Ln,w and companion terms.` : narrative;
}
