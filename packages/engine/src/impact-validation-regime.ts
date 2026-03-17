import type { ImpactSupportingElementFamily } from "@dynecho/shared";

export type ImpactValidationFamilyId =
  | "reinforced_concrete"
  | "hollow_core"
  | "timber_frame"
  | "open_box_timber"
  | "mass_timber_clt"
  | "lightweight_steel"
  | "composite_panel";

export type ImpactValidationFloorCoverage = "exact" | "estimate" | "bound";
export type ImpactValidationFieldCoverage = "live" | "bound" | "staged";
export type ImpactValidationModeId =
  | "official_floor_system"
  | "official_floor_system_bound"
  | "official_catalog_exact"
  | "formula_estimate"
  | "formula_plus_lower_bound"
  | "family_specific_estimate"
  | "family_specific_bound_estimate"
  | "family_archetype_estimate"
  | "family_general_estimate"
  | "low_confidence_estimate"
  | "field_explicit_k_estimate"
  | "field_standardized_volume_estimate";

export type ImpactValidationModePosture = "exact" | "estimate" | "bound" | "field" | "low_confidence";

export type ImpactValidationModeRegime = {
  caseCount: number;
  id: ImpactValidationModeId;
  label: string;
  note: string;
  posture: ImpactValidationModePosture;
};

export type ImpactValidationFamilyModeDistribution = {
  caseCount: number;
  id: ImpactValidationModeId;
};

export type ImpactValidationFamilyPostureCounts = Record<ImpactValidationModePosture, number>;

export type ImpactValidationFamilyRegime = {
  benchmarkCaseCount: number;
  fieldCaseCount: number;
  fieldCoverage: ImpactValidationFieldCoverage;
  floorCaseCount: number;
  floorCoverage: ImpactValidationFloorCoverage;
  id: ImpactValidationFamilyId;
  label: string;
  maxToleranceDb: number;
  modeDistribution: readonly ImpactValidationFamilyModeDistribution[];
  note: string;
  postureCaseCounts: ImpactValidationFamilyPostureCounts;
};

export const IMPACT_VALIDATION_MODE_MATRIX: readonly ImpactValidationModeRegime[] = [
  {
    caseCount: 34,
    id: "official_floor_system",
    label: "Official floor-system exact",
    note: "Curated exact or manual-exact published floor rows with direct Ln,w and companion airborne data.",
    posture: "exact"
  },
  {
    caseCount: 2,
    id: "official_floor_system_bound",
    label: "Official floor-system bound",
    note: "Published support rows that keep airborne companions exact but expose impact only as a conservative upper bound.",
    posture: "bound"
  },
  {
    caseCount: 2,
    id: "official_catalog_exact",
    label: "Official product catalog exact",
    note: "Curated heavy-reference or product-backed catalog rows with exact DeltaLw and derived or published Ln,w semantics.",
    posture: "exact"
  },
  {
    caseCount: 2,
    id: "formula_estimate",
    label: "Heavy-floor formula estimate",
    note: "Narrow ISO 12354-2 Annex C style screening for bare heavy slabs and floating floors on reinforced concrete.",
    posture: "estimate"
  },
  {
    caseCount: 1,
    id: "formula_plus_lower_bound",
    label: "Formula plus lower-bound support",
    note: "Heavy-floor formula lane with an attached conservative product lower-bound guard to stop optimistic drift.",
    posture: "bound"
  },
  {
    caseCount: 9,
    id: "family_specific_estimate",
    label: "Family-specific estimate",
    note: "Narrow family branches such as CLT, composite, steel, or published heavy-concrete treatment estimates before broad averaging.",
    posture: "estimate"
  },
  {
    caseCount: 1,
    id: "family_specific_bound_estimate",
    label: "Family-specific bound estimate",
    note: "Family-local conservative interpolation where the engine keeps impact only as a bound instead of inventing an exact live Ln,w.",
    posture: "bound"
  },
  {
    caseCount: 8,
    id: "family_archetype_estimate",
    label: "Family archetype estimate",
    note: "Nearest curated same-family archetype blend after exact matching fails but before broad same-family fallback opens.",
    posture: "estimate"
  },
  {
    caseCount: 5,
    id: "family_general_estimate",
    label: "Family general estimate",
    note: "Broader same-family estimate layer used only after stricter exact and archetype corridors fail.",
    posture: "estimate"
  },
  {
    caseCount: 6,
    id: "low_confidence_estimate",
    label: "Low-confidence family fallback",
    note: "Last-resort published-family blend that keeps the result non-empty without pretending it is a narrow same-family fit.",
    posture: "low_confidence"
  },
  {
    caseCount: 2,
    id: "field_explicit_k_estimate",
    label: "Field explicit-K continuation",
    note: "Lab-side Ln,w carried into L'n,w through explicit K correction without claiming a full band-by-band in-situ solver.",
    posture: "field"
  },
  {
    caseCount: 8,
    id: "field_standardized_volume_estimate",
    label: "Field standardized-volume continuation",
    note: "L'n,w and L'nT,w or L'nT,50 continuation through room-volume normalization and, where available, CI,50-2500 carry-over.",
    posture: "field"
  }
] as const;

export function getImpactValidationModeRegimeById(
  id: ImpactValidationModeId | null | undefined
): ImpactValidationModeRegime | null {
  if (!id) {
    return null;
  }

  return IMPACT_VALIDATION_MODE_MATRIX.find((entry) => entry.id === id) ?? null;
}

function trimTrailingZero(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function buildPostureCaseCounts(
  modeDistribution: readonly ImpactValidationFamilyModeDistribution[]
): ImpactValidationFamilyPostureCounts {
  const postureCaseCounts: ImpactValidationFamilyPostureCounts = {
    bound: 0,
    estimate: 0,
    exact: 0,
    field: 0,
    low_confidence: 0
  };

  for (const distribution of modeDistribution) {
    const modeRegime = getImpactValidationModeRegimeById(distribution.id);

    if (modeRegime) {
      postureCaseCounts[modeRegime.posture] += distribution.caseCount;
    }
  }

  return postureCaseCounts;
}

function createImpactValidationFamilyRegime(
  input: Omit<ImpactValidationFamilyRegime, "benchmarkCaseCount" | "postureCaseCounts">
): ImpactValidationFamilyRegime {
  return {
    ...input,
    benchmarkCaseCount: input.modeDistribution.reduce((sum, entry) => sum + entry.caseCount, 0),
    postureCaseCounts: buildPostureCaseCounts(input.modeDistribution)
  };
}

export const IMPACT_VALIDATION_FAMILY_MATRIX: readonly ImpactValidationFamilyRegime[] = [
  createImpactValidationFamilyRegime({
    fieldCaseCount: 2,
    fieldCoverage: "live",
    floorCaseCount: 2,
    floorCoverage: "estimate",
    id: "reinforced_concrete",
    label: "reinforced concrete",
    maxToleranceDb: 0,
    modeDistribution: [
      { caseCount: 2, id: "official_floor_system" },
      { caseCount: 2, id: "official_catalog_exact" },
      { caseCount: 2, id: "formula_estimate" },
      { caseCount: 1, id: "formula_plus_lower_bound" },
      { caseCount: 1, id: "family_specific_estimate" },
      { caseCount: 1, id: "low_confidence_estimate" },
      { caseCount: 1, id: "field_explicit_k_estimate" },
      { caseCount: 2, id: "field_standardized_volume_estimate" }
    ],
    note: "Bare heavy slabs, published upper-treatment rows, and the last-resort combined concrete fallback are guarded, while the field chain still covers both predictor-backed and exact continuation."
  }),
  createImpactValidationFamilyRegime({
    fieldCaseCount: 1,
    fieldCoverage: "live",
    floorCaseCount: 1,
    floorCoverage: "exact",
    id: "hollow_core",
    label: "hollow core",
    maxToleranceDb: 0,
    modeDistribution: [
      { caseCount: 6, id: "official_floor_system" },
      { caseCount: 1, id: "family_archetype_estimate" }
    ],
    note: "Product-aware plank rows stay exact on floor-side output and continue cleanly into explicit K plus room-volume field normalization."
  }),
  createImpactValidationFamilyRegime({
    fieldCaseCount: 0,
    fieldCoverage: "staged",
    floorCaseCount: 1,
    floorCoverage: "estimate",
    id: "timber_frame",
    label: "timber frame / joist families",
    maxToleranceDb: 0.1,
    modeDistribution: [
      { caseCount: 13, id: "official_floor_system" },
      { caseCount: 2, id: "family_archetype_estimate" },
      { caseCount: 2, id: "family_general_estimate" },
      { caseCount: 2, id: "low_confidence_estimate" }
    ],
    note: "Dry timber-frame floor estimates and the remaining broad bare/direct-ceiling timber fallbacks are guarded, but the real-world field continuation corpus is still narrower than the floor-side family coverage."
  }),
  createImpactValidationFamilyRegime({
    fieldCaseCount: 2,
    fieldCoverage: "live",
    floorCaseCount: 2,
    floorCoverage: "exact",
    id: "open_box_timber",
    label: "open box timber",
    maxToleranceDb: 0,
    modeDistribution: [
      { caseCount: 2, id: "family_archetype_estimate" },
      { caseCount: 2, id: "field_standardized_volume_estimate" }
    ],
    note: "Open-measured TUAS rows now anchor both the weaker and stronger dry-floor open-box lanes on the floor side, plus both standardized field continuation chains."
  }),
  createImpactValidationFamilyRegime({
    fieldCaseCount: 3,
    fieldCoverage: "live",
    floorCaseCount: 3,
    floorCoverage: "exact",
    id: "mass_timber_clt",
    label: "mass timber CLT",
    maxToleranceDb: 0,
    modeDistribution: [
      { caseCount: 3, id: "official_floor_system" },
      { caseCount: 5, id: "family_specific_estimate" },
      { caseCount: 1, id: "family_archetype_estimate" },
      { caseCount: 1, id: "family_general_estimate" },
      { caseCount: 1, id: "field_explicit_k_estimate" },
      { caseCount: 4, id: "field_standardized_volume_estimate" }
    ],
    note: "CLT now has representative exact dry and fill floor rows in addition to the narrow CLT estimate corridors, and the field corpus covers both open-measured standardized-volume continuation and official-row local-guide carry-over."
  }),
  createImpactValidationFamilyRegime({
    fieldCaseCount: 1,
    fieldCoverage: "bound",
    floorCaseCount: 1,
    floorCoverage: "bound",
    id: "lightweight_steel",
    label: "lightweight steel / open-web joists",
    maxToleranceDb: 0,
    modeDistribution: [
      { caseCount: 7, id: "official_floor_system" },
      { caseCount: 2, id: "official_floor_system_bound" },
      { caseCount: 1, id: "family_specific_estimate" },
      { caseCount: 1, id: "family_specific_bound_estimate" },
      { caseCount: 1, id: "family_archetype_estimate" },
      { caseCount: 2, id: "family_general_estimate" },
      { caseCount: 2, id: "low_confidence_estimate" }
    ],
    note: "Published UBIQ and Pliteq support remains conservative on both lab and field chains; the engine now also tracks both final steel low-confidence fallbacks separately from the narrower exact, bound, and family-estimate corridors."
  }),
  createImpactValidationFamilyRegime({
    fieldCaseCount: 0,
    fieldCoverage: "staged",
    floorCaseCount: 1,
    floorCoverage: "exact",
    id: "composite_panel",
    label: "composite panel",
    maxToleranceDb: 0,
    modeDistribution: [
      { caseCount: 3, id: "official_floor_system" },
      { caseCount: 2, id: "family_specific_estimate" },
      { caseCount: 1, id: "family_archetype_estimate" },
      { caseCount: 1, id: "low_confidence_estimate" }
    ],
    note: "Composite families are covered on the floor-side corpus, including the remaining ceiling-only low-confidence fallback, but the real-world field continuation pack still needs broader composite anchors."
  })
] as const;

const FLOOR_COVERAGE_CASE_COUNTS = IMPACT_VALIDATION_FAMILY_MATRIX.reduce(
  (acc, entry) => {
    acc[entry.floorCoverage] += entry.floorCaseCount;
    return acc;
  },
  {
    bound: 0,
    estimate: 0,
    exact: 0
  } as Record<ImpactValidationFloorCoverage, number>
);

const FIELD_COVERAGE_CASE_COUNTS = IMPACT_VALIDATION_FAMILY_MATRIX.reduce(
  (acc, entry) => {
    acc[entry.fieldCoverage] += entry.fieldCaseCount;
    return acc;
  },
  {
    bound: 0,
    live: 0,
    staged: 0
  } as Record<ImpactValidationFieldCoverage, number>
);

export const IMPACT_VALIDATION_CORPUS_SUMMARY = {
  benchmarkCases: IMPACT_VALIDATION_FAMILY_MATRIX.reduce((sum, entry) => sum + entry.benchmarkCaseCount, 0),
  benchmarkModesTracked: IMPACT_VALIDATION_MODE_MATRIX.length,
  familiesTracked: IMPACT_VALIDATION_FAMILY_MATRIX.length,
  fieldBoundCases: FIELD_COVERAGE_CASE_COUNTS.bound,
  fieldCases: IMPACT_VALIDATION_FAMILY_MATRIX.reduce((sum, entry) => sum + entry.fieldCaseCount, 0),
  fieldLiveCases: FIELD_COVERAGE_CASE_COUNTS.live,
  floorBoundCases: FLOOR_COVERAGE_CASE_COUNTS.bound,
  floorCases: IMPACT_VALIDATION_FAMILY_MATRIX.reduce((sum, entry) => sum + entry.floorCaseCount, 0),
  floorEstimateCases: FLOOR_COVERAGE_CASE_COUNTS.estimate,
  floorExactCases: FLOOR_COVERAGE_CASE_COUNTS.exact,
  toleranceBandMaxDb: Math.max(...IMPACT_VALIDATION_FAMILY_MATRIX.map((entry) => entry.maxToleranceDb))
} as const;

export function formatImpactValidationTolerance(maxToleranceDb: number): string {
  return maxToleranceDb <= 0 ? "0 dB" : `0-${trimTrailingZero(maxToleranceDb)} dB`;
}

export function getImpactValidationFamilyIdFromSupportFamily(
  family: ImpactSupportingElementFamily | null | undefined
): ImpactValidationFamilyId | null {
  switch (family) {
    case "reinforced_concrete":
    case "hollow_core":
    case "open_box_timber":
    case "mass_timber_clt":
    case "composite_panel":
      return family;
    case "timber_joists":
      return "timber_frame";
    case "steel_joists":
      return "lightweight_steel";
    default:
      return null;
  }
}

export function getImpactValidationFamilyRegimeById(
  id: ImpactValidationFamilyId | null | undefined
): ImpactValidationFamilyRegime | null {
  if (!id) {
    return null;
  }

  return IMPACT_VALIDATION_FAMILY_MATRIX.find((entry) => entry.id === id) ?? null;
}
