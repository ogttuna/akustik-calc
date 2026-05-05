export const ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_WARNING =
  "Grouped triple-leaf topology is present, but DynEcho still needs a source-calibrated triple-leaf solver, rights-safe source-owned curve payload, local Rockwool/material mapping, metric context owner, tolerance owner, negative boundaries, and paired visible tests before promoting this beyond the screening blend; treat it as source-required screening, not exact or design-grade.";

export const ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_BLOCKERS = [
  "rights_safe_source_owned_curve_payload",
  "source_provenance",
  "topology_owner",
  "local_rockwool_material_mapping",
  "metric_context_owner",
  "tolerance_owner",
  "negative_boundaries",
  "paired_engine_tests",
  "paired_visible_tests"
] as const;
