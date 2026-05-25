export const LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS =
  "predictor_lightweight_concrete_family_estimate" as const;

export const LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID =
  "floor.lightweight_concrete.family_solver_owner" as const;

export const LIGHTWEIGHT_CONCRETE_FAMILY_LN_W_TOLERANCE_DB = 10;
export const LIGHTWEIGHT_CONCRETE_FAMILY_RW_TOLERANCE_DB = 8;

export const LIGHTWEIGHT_CONCRETE_FAMILY_REQUIRED_FIELDS = [
  "baseSlabThicknessMm",
  "baseSlabDensityKgM3_or_lightweightConcreteMaterialClass",
  "upperTreatmentState",
  "floorCoveringOrWalkingSurface",
  "resilientLayerOrToppingState",
  "elementLabMetricBasis"
] as const;
