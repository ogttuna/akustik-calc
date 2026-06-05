export const COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS =
  "predictor_composite_panel_published_interaction_estimate" as const;

export const COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID =
  "floor.composite_panel.published_interaction_family_solver" as const;

export const COMPOSITE_PANEL_PUBLISHED_INTERACTION_LN_W_TOLERANCE_DB = 8;
export const COMPOSITE_PANEL_PUBLISHED_INTERACTION_RW_TOLERANCE_DB = 8;
export const COMPOSITE_PANEL_PUBLISHED_INTERACTION_DELTA_LW_TOLERANCE_DB = 8;

export const COMPOSITE_PANEL_PUBLISHED_INTERACTION_REQUIRED_FIELDS = [
  "baseSlabOrFloor",
  "toppingOrFloatingLayer",
  "resilientLayerThicknessMm_or_equivalent_family_row",
  "ceilingOrLowerAssembly_when_lower_treatment_is_requested"
] as const;
