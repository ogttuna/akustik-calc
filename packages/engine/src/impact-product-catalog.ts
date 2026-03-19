import { OFFICIAL_IMPACT_PRODUCT_CATALOG } from "@dynecho/catalogs";
import type {
  FloorRole,
  ImpactBoundCalculation,
  ImpactCalculation,
  ImpactCatalogMatchResult,
  ImpactProductCatalogEntry,
  ImpactProductRoleCriteria,
  ImpactPredictorInput,
  MaterialDefinition,
  ResolvedLayer
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { createImpactMetricBasis } from "./impact-metric-basis";
import { resolveMaterial } from "./material-catalog";
import { deriveHeavyReferenceImpactFromDeltaLw } from "./impact-reference";
import { ksRound1 } from "./math";

const THICKNESS_TOLERANCE_MM = 2;
const PRODUCT_DELTA_DYNAMIC_STIFFNESS_TOLERANCE_MNM3 = 5;

const ROLE_LABELS: Record<FloorRole, string> = {
  base_structure: "base structure",
  ceiling_board: "ceiling board",
  ceiling_cavity: "ceiling cavity",
  ceiling_fill: "ceiling fill",
  floating_screed: "floating screed",
  floor_covering: "floor covering",
  resilient_layer: "resilient layer",
  upper_fill: "upper fill"
};

type CatalogEvaluation = {
  entry: ImpactProductCatalogEntry;
  exact: boolean;
  score: number;
};

function layersForRole(layers: readonly ResolvedLayer[], role: FloorRole): ResolvedLayer[] {
  return layers.filter((layer) => layer.floorRole === role);
}

function thicknessMatches(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) <= THICKNESS_TOLERANCE_MM;
}

function scoreRoleCriteria(criteria: ImpactProductRoleCriteria): number {
  return (criteria.layerCount ? 1 : 0) + (criteria.materialIds ? 1 : 0) + (typeof criteria.thicknessMm === "number" ? 1 : 0);
}

function evaluateRoleCriteria(
  layers: readonly ResolvedLayer[],
  role: FloorRole,
  criteria: ImpactProductRoleCriteria
): { exact: boolean; matchedSignals: number } {
  let matchedSignals = 0;

  if (criteria.layerCount && layers.length === criteria.layerCount) {
    matchedSignals += 1;
  }

  if (criteria.materialIds && layers.length > 0 && layers.every((layer) => criteria.materialIds?.includes(layer.material.id))) {
    matchedSignals += 1;
  }

  if (
    typeof criteria.thicknessMm === "number" &&
    layers.length > 0 &&
    layers.every((layer) => thicknessMatches(layer.thicknessMm, criteria.thicknessMm as number))
  ) {
    matchedSignals += 1;
  }

  return {
    exact: matchedSignals === scoreRoleCriteria(criteria),
    matchedSignals
  };
}

function buildImpactFromCatalog(entry: ImpactProductCatalogEntry): ImpactCalculation | null {
  if (entry.matchMode === "exact_system") {
    if (typeof entry.impactRatings.LnW !== "number") {
      return null;
    }

    const availableOutputs: ImpactCalculation["availableOutputs"] = ["Ln,w"];
    if (typeof entry.impactRatings.DeltaLw === "number") {
      availableOutputs.push("DeltaLw");
    }

    return {
      DeltaLw: entry.impactRatings.DeltaLw,
      LnW: entry.impactRatings.LnW,
      availableOutputs,
      basis: "predictor_catalog_exact_match_official",
      confidence: getImpactConfidenceForBasis("predictor_catalog_exact_match_official"),
      labOrField: "lab",
      metricBasis: createImpactMetricBasis({
        DeltaLw:
          typeof entry.impactRatings.DeltaLw === "number" ? "predictor_catalog_exact_match_official" : undefined,
        LnW: typeof entry.impactRatings.LnW === "number" ? "predictor_catalog_exact_match_official" : undefined
      }),
      notes: [
        `${entry.label} matched an official product-system row in the curated impact catalog.`,
        `Source: ${entry.source}.`,
        "This lane is a direct manufacturer-row match, not the generic heavy-floor formula."
      ],
      referenceFloorType: entry.referenceFloorType,
      scope: "exact_floor_system_family"
    };
  }

  if (entry.matchMode === "lower_bound_support") {
    return null;
  }

  if (typeof entry.impactRatings.DeltaLw !== "number") {
    return null;
  }

  const derived = deriveHeavyReferenceImpactFromDeltaLw(entry.impactRatings.DeltaLw);
  if (!derived) {
    return null;
  }

  return {
    ...derived,
    basis: "predictor_catalog_product_delta_official",
    confidence: getImpactConfidenceForBasis("predictor_catalog_product_delta_official"),
    metricBasis: createImpactMetricBasis({
      DeltaLw: typeof derived.DeltaLw === "number" ? "predictor_catalog_product_delta_official" : undefined,
      LnW:
        typeof derived.LnW === "number"
          ? "predictor_catalog_product_delta_heavy_reference_derived"
          : undefined
    }),
    notes: [
      `${entry.label} matched an official product DeltaLw row in the curated impact catalog.`,
      `Source: ${entry.source}.`,
      "DeltaLw was carried from the official product row and derived against the fixed ISO heavy reference floor."
    ],
    referenceFloorType: entry.referenceFloorType,
    scope: "reference_heavy_floor_derived"
  };
}

function buildLowerBoundImpactFromCatalog(entry: ImpactProductCatalogEntry): ImpactBoundCalculation | null {
  if (entry.matchMode !== "lower_bound_support") {
    return null;
  }

  const deltaLwLowerBound =
    typeof entry.impactRatings.DeltaLwLowerBound === "number"
      ? ksRound1(entry.impactRatings.DeltaLwLowerBound)
      : undefined;
  const derivedLnWUpperBound =
    typeof entry.impactRatings.LnWUpperBound === "number"
      ? ksRound1(entry.impactRatings.LnWUpperBound)
      : deltaLwLowerBound !== undefined && entry.referenceFloorType === "heavy_standard"
        ? ksRound1(78 - deltaLwLowerBound)
        : undefined;

  if (!Number.isFinite(deltaLwLowerBound) && !Number.isFinite(derivedLnWUpperBound)) {
    return null;
  }

  const bounds: ImpactBoundCalculation = {
    DeltaLwLowerBound: deltaLwLowerBound,
    LnWUpperBound: derivedLnWUpperBound,
    basis: "predictor_catalog_lower_bound_official",
    confidence: getImpactConfidenceForBasis("predictor_catalog_lower_bound_official"),
    notes: [
      `${entry.label} matched an official product row that publishes conservative lower-bound impact support only.`,
      `Source: ${entry.source}.`,
      "These bounds stay outside the live impact metric and should be read as guidance, not as measured exact ratings."
    ],
    scope: "reference_heavy_floor_derived"
  };

  return bounds;
}

function evaluateEntry(layers: readonly ResolvedLayer[], entry: ImpactProductCatalogEntry): CatalogEvaluation {
  const roleChecks: Array<[FloorRole, ImpactProductRoleCriteria | undefined]> = [
    ["base_structure", entry.match.baseStructure],
    ["resilient_layer", entry.match.resilientLayer],
    ["floating_screed", entry.match.floatingScreed],
    ["floor_covering", entry.match.floorCovering]
  ];

  let exact = true;
  let score = entry.match.absentRoles.length;

  for (const role of entry.match.absentRoles) {
    if (layersForRole(layers, role).length !== 0) {
      exact = false;
    }
  }

  for (const [role, criteria] of roleChecks) {
    if (!criteria) {
      continue;
    }

    const evaluation = evaluateRoleCriteria(layersForRole(layers, role), role, criteria);
    score += evaluation.matchedSignals;
    if (!evaluation.exact) {
      exact = false;
    }
  }

  return {
    entry,
    exact,
    score
  };
}

function toMatchResult(evaluation: CatalogEvaluation): ImpactCatalogMatchResult | null {
  const impact = buildImpactFromCatalog(evaluation.entry);
  const lowerBoundImpact = buildLowerBoundImpactFromCatalog(evaluation.entry);

  if (!impact && !lowerBoundImpact) {
    return null;
  }

  const roleHint = ([
    ["base_structure", evaluation.entry.match.baseStructure],
    ["resilient_layer", evaluation.entry.match.resilientLayer],
    ["floating_screed", evaluation.entry.match.floatingScreed],
    ["floor_covering", evaluation.entry.match.floorCovering]
  ] as const)
    .filter(([, criteria]) => Boolean(criteria))
    .map(([role]) => ROLE_LABELS[role])
    .join(", ");

  return {
    catalog: evaluation.entry,
    impact,
    lowerBoundImpact,
    matchKind: "automatic",
    notes: [
      `Official product lane active via ${evaluation.entry.matchMode.replaceAll("_", " ")} match.`,
      roleHint ? `Matched roles: ${roleHint}.` : "Matched through product metadata only.",
      `Match score ${evaluation.score} with +/- ${THICKNESS_TOLERANCE_MM} mm tolerance on explicit thickness checks.`
    ],
    score: evaluation.score
  };
}

export function resolveImpactProductCatalogById(id: string): ImpactCatalogMatchResult | null {
  const entry = OFFICIAL_IMPACT_PRODUCT_CATALOG.find((catalogEntry) => catalogEntry.id === id);
  if (!entry) {
    return null;
  }

  const impact = buildImpactFromCatalog(entry);
  const lowerBoundImpact = buildLowerBoundImpactFromCatalog(entry);

  if (!impact && !lowerBoundImpact) {
    return null;
  }

  return {
    catalog: entry,
    impact,
    lowerBoundImpact,
    matchKind: "automatic",
    notes: [
      `Official impact product row was selected directly: ${entry.label}.`,
      `Selected lane: ${entry.matchMode.replaceAll("_", " ")}.`,
      "Layer-role scoring was bypassed because the curated product row id is already known."
    ],
    score: 0
  };
}

export function matchImpactProductCatalog(layers: readonly ResolvedLayer[]): ImpactCatalogMatchResult | null {
  const exactMatches = OFFICIAL_IMPACT_PRODUCT_CATALOG.map((entry) => evaluateEntry(layers, entry))
    .filter((evaluation) => evaluation.exact)
    .sort((left, right) => {
      if (left.entry.matchMode !== right.entry.matchMode) {
        const priority: Record<ImpactProductCatalogEntry["matchMode"], number> = {
          exact_system: 0,
          lower_bound_support: 1,
          product_property_delta: 2
        };

        return priority[left.entry.matchMode] - priority[right.entry.matchMode];
      }

      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.entry.label.localeCompare(right.entry.label);
    });

  const best = exactMatches[0];
  return best ? toMatchResult(best) : null;
}

export function filterImpactCatalogMatchForExplicitPredictorInput(
  match: ImpactCatalogMatchResult | null,
  predictorInput: ImpactPredictorInput | null,
  catalog: readonly MaterialDefinition[]
): ImpactCatalogMatchResult | null {
  if (!match || match.catalog.matchMode !== "product_property_delta") {
    return match;
  }

  if (!predictorInput) {
    return null;
  }

  if (
    predictorInput.floorCovering?.mode !== "delta_lw_catalog" ||
    predictorInput.referenceFloorType !== "heavy_standard"
  ) {
    return null;
  }

  if (typeof predictorInput.floorCovering?.deltaLwDb === "number") {
    return null;
  }

  const expectedMaterialId = match.catalog.match.resilientLayer?.materialIds?.[0];
  const expectedDynamicStiffnessMNm3 = expectedMaterialId
    ? resolveMaterial(expectedMaterialId, catalog).impact?.dynamicStiffnessMNm3
    : undefined;
  const actualDynamicStiffnessMNm3 = predictorInput.resilientLayer?.dynamicStiffnessMNm3;

  if (
    typeof actualDynamicStiffnessMNm3 === "number" &&
    typeof expectedDynamicStiffnessMNm3 === "number" &&
    Math.abs(actualDynamicStiffnessMNm3 - expectedDynamicStiffnessMNm3) >
      PRODUCT_DELTA_DYNAMIC_STIFFNESS_TOLERANCE_MNM3
  ) {
    return null;
  }

  return match;
}
