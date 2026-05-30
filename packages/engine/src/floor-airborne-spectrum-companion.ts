export const POST_V1_FLOOR_FAMILY_AIRBORNE_SPECTRUM_COMPANION_BASES = new Set<string>([
  "predictor_composite_panel_published_interaction_estimate",
  "predictor_floor_system_family_archetype_estimate",
  "predictor_floor_system_family_general_estimate",
  "predictor_heavy_concrete_published_upper_treatment_estimate",
  "predictor_lightweight_concrete_family_estimate",
  "predictor_mass_timber_clt_dataholz_dry_estimate"
]);

export const POST_V1_FLOOR_SCREENING_AIRBORNE_SPECTRUM_COMPANION_BASIS =
  "screening_mass_law_curve_seed_v3" as const;

export function hasPostV1FloorFamilyAirborneSpectrumCompanionBasis(
  input: unknown
): boolean {
  const basis = (input as { readonly basis?: string | null } | null | undefined)?.basis;

  return (
    typeof basis === "string" &&
    POST_V1_FLOOR_FAMILY_AIRBORNE_SPECTRUM_COMPANION_BASES.has(basis)
  );
}

export function hasPostV1FloorScreeningAirborneSpectrumCompanionBasis(
  input: unknown
): boolean {
  const basis = (input as { readonly basis?: string | null } | null | undefined)?.basis;

  return basis === POST_V1_FLOOR_SCREENING_AIRBORNE_SPECTRUM_COMPANION_BASIS;
}
