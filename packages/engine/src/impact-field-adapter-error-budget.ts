import type {
  ImpactCalculation,
  ImpactErrorBudget,
  ImpactErrorBudgetTerm
} from "@dynecho/shared";

import { ksRound1 } from "./math";

export const FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN =
  "source_absent_field_building_adapter_error_budget" as const;

export const FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB = 5;
export const FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB = 5.5;
export const FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB = 7;
export const FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB = 6;
export const FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB = 6.5;
export const FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_50_TOLERANCE_DB = 8;

type FloorImpactFieldAdapterMetricId = "L'n,w" | "L'nT,w" | "L'nT,50";
type FloorImpactFieldAdapterProfile = "direct_flanking_energy_sum" | "standardized_field_volume_normalization";

function term(
  termId: string,
  db: number,
  origin: string,
  reason: string,
  tightenRequires: readonly string[]
): ImpactErrorBudgetTerm {
  return {
    db,
    origin,
    reason,
    termId,
    tightenRequires: [...tightenRequires]
  };
}

function sumTermDb(terms: readonly ImpactErrorBudgetTerm[]): number {
  return ksRound1(terms.reduce((sum, item) => sum + item.db, 0));
}

function toleranceDbFor(metricId: FloorImpactFieldAdapterMetricId, profile: FloorImpactFieldAdapterProfile): number {
  if (profile === "direct_flanking_energy_sum") {
    if (metricId === "L'n,w") {
      return FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB;
    }

    return metricId === "L'nT,w"
      ? FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB
      : FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_50_TOLERANCE_DB;
  }

  if (metricId === "L'n,w") {
    return FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB;
  }

  return metricId === "L'nT,w"
    ? FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB
    : FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB;
}

function standardizedFieldVolumeTerms(metricId: FloorImpactFieldAdapterMetricId): ImpactErrorBudgetTerm[] {
  const baseTerms = [
    term(
      "lab_anchor_basis_transfer",
      1.8,
      "source_absent_formula_or_lab_anchor_transfer",
      "Field impact output is anchored to the selected lab-side Ln,w family result instead of a same-room field measurement.",
      ["same_stack_field_impact_measurement_or_exact_field_band_owner"]
    ),
    term(
      "field_k_or_mass_ratio_policy",
      1.4,
      "explicit_field_policy",
      "K is supplied directly or looked up from a simplified mass-ratio policy rather than a measured project junction.",
      ["project_specific_field_k_or_measured_mass_ratio_packet"]
    ),
    term(
      "source_absent_field_holdout_absence",
      metricId === "L'n,w" ? 1.8 : metricId === "L'nT,w" ? 1.5 : 1.2,
      "missing_source_owned_holdout",
      "No source-owned same-stack field impact holdout has been admitted for this field adapter corridor yet.",
      ["source_owned_same_stack_field_impact_holdouts"]
    )
  ];

  if (metricId === "L'n,w") {
    return baseTerms;
  }

  const standardizedTerms = [
    ...baseTerms,
    term(
      "room_volume_normalization_precision",
      0.8,
      "explicit_user_input_precision",
      "Standardized field impact uses receiving-room volume as a scalar normalization input.",
      ["project_room_absorption_and_volume_measurement_owner"]
    )
  ];

  return metricId === "L'nT,50"
    ? [
        ...standardizedTerms,
        term(
          "low_frequency_ci50_2500_owner_precision",
          1.8,
          "explicit_low_frequency_owner_input",
          "L'nT,50 uses an explicit CI,50-2500 or low-frequency spectrum owner rather than a same-stack source-owned field band packet.",
          ["source_owned_same_stack_lnt50_or_ci50_2500_field_packet"]
        )
      ]
    : standardizedTerms;
}

function directFlankingTerms(metricId: FloorImpactFieldAdapterMetricId): ImpactErrorBudgetTerm[] {
  const baseTerms = [
    term(
      "lab_anchor_basis_transfer",
      1.6,
      "source_absent_formula_or_lab_anchor_transfer",
      "Field impact output is anchored to the selected lab-side impact result before direct and flanking path summation.",
      ["same_stack_field_impact_measurement_or_exact_field_band_owner"]
    ),
    term(
      "direct_path_offset_policy",
      1.2,
      "explicit_field_policy",
      "The direct path offset is supplied as a bounded project input rather than a measured direct path curve.",
      ["measured_direct_path_or_project_specific_direct_offset_owner"]
    ),
    term(
      "flanking_path_energy_model",
      1.8,
      "topology_simplification",
      "Flanking paths are represented by weighted path offsets, junction modifiers, and family scales instead of full path-specific frequency transfer functions.",
      ["source_owned_flanking_path_energy_holdouts"]
    ),
    term(
      "junction_and_support_family_mapping",
      metricId === "L'n,w" ? 1.4 : 1.1,
      "topology_simplification",
      "Junction class, path length, edge isolation, short-circuit risk, and support family are reduced to bounded modifiers.",
      ["project_junction_kij_or_coupling_measurement_owner"]
    )
  ];

  if (metricId === "L'n,w") {
    return baseTerms;
  }

  const standardizedTerms = [
    ...baseTerms,
    term(
      "room_standardization_precision",
      0.8,
      "explicit_user_input_precision",
      "Standardized field impact applies a scalar receiving-room volume normalization after direct/flanking summation.",
      ["project_room_absorption_and_volume_measurement_owner"]
    )
  ];

  return metricId === "L'nT,50"
    ? [
        ...standardizedTerms,
        term(
          "low_frequency_ci50_2500_owner_precision",
          1.5,
          "explicit_low_frequency_owner_input",
          "L'nT,50 uses a CI,50-2500 or low-frequency spectrum owner after direct/flanking summation.",
          ["source_owned_same_stack_lnt50_or_ci50_2500_field_packet"]
        )
      ]
    : standardizedTerms;
}

function termsFor(
  metricId: FloorImpactFieldAdapterMetricId,
  profile: FloorImpactFieldAdapterProfile
): ImpactErrorBudgetTerm[] {
  return profile === "direct_flanking_energy_sum"
    ? directFlankingTerms(metricId)
    : standardizedFieldVolumeTerms(metricId);
}

export function buildFloorImpactFieldBuildingAdapterErrorBudget(input: {
  estimate: number;
  metricId: FloorImpactFieldAdapterMetricId;
  profile: FloorImpactFieldAdapterProfile;
}): ImpactErrorBudget {
  const terms = termsFor(input.metricId, input.profile);
  const toleranceDb = toleranceDbFor(input.metricId, input.profile);

  return {
    estimate: input.estimate,
    max: ksRound1(input.estimate + toleranceDb),
    metricId: input.metricId,
    min: ksRound1(input.estimate - toleranceDb),
    notMeasuredEvidence: true,
    origin: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
    terms,
    toleranceDb,
    totalBudgetDb: sumTermDb(terms)
  };
}

export function mergeFloorImpactFieldBuildingAdapterErrorBudgets(input: {
  impact: ImpactCalculation;
  lPrimeNT50?: number;
  lPrimeNW?: number;
  lPrimeNTw?: number;
  profile: FloorImpactFieldAdapterProfile;
}): ImpactErrorBudget[] {
  const budgets = (input.impact.errorBudgets ?? []).filter(
    (budget) => budget.metricId !== "L'n,w" && budget.metricId !== "L'nT,w" && budget.metricId !== "L'nT,50"
  );

  if (typeof input.lPrimeNW === "number" && Number.isFinite(input.lPrimeNW)) {
    budgets.push(
      buildFloorImpactFieldBuildingAdapterErrorBudget({
        estimate: input.lPrimeNW,
        metricId: "L'n,w",
        profile: input.profile
      })
    );
  }

  if (typeof input.lPrimeNTw === "number" && Number.isFinite(input.lPrimeNTw)) {
    budgets.push(
      buildFloorImpactFieldBuildingAdapterErrorBudget({
        estimate: input.lPrimeNTw,
        metricId: "L'nT,w",
        profile: input.profile
      })
    );
  }

  if (typeof input.lPrimeNT50 === "number" && Number.isFinite(input.lPrimeNT50)) {
    budgets.push(
      buildFloorImpactFieldBuildingAdapterErrorBudget({
        estimate: input.lPrimeNT50,
        metricId: "L'nT,50",
        profile: input.profile
      })
    );
  }

  return budgets;
}
