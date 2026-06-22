# Post-V1 Wall Double-Leaf/Framed Leaf Surface-Mass Numeric Sensitivity Coverage Refresh Plan - 2026-06-22

## Purpose

This is the no-runtime coverage refresh after the wall
double-leaf/framed leaf surface-mass numeric-sensitivity owner lands.
It re-probes the owner without retuning formulas, importing source rows,
touching frontend files, or replacing the calculator objective with
process work. During refresh, the unresolved side-leaf surface-mass
boundary was tightened to precise `needs_input`; no numeric formula
values moved.

Selected coverage refresh action:

`post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_plan`

Selected coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_LEAF_SURFACE_MASS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:

`post-V1 wall double-leaf/framed leaf surface-mass numeric sensitivity coverage refresh`

Coverage refresh status:

`post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_landed_input_boundary_selected_runtime_first_route_family_rerank`

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_DOUBLE_LEAF_FRAMED_LEAF_SURFACE_MASS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:

`post-V1 runtime-first route-family rerank after wall double-leaf/framed leaf surface-mass numeric sensitivity coverage refresh`

## Rerank Handoff

Previous rerank action:

`post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_leaf_surface_mass_numeric_sensitivity_owner`

## Previous Owner

Previous owner action:

`post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-owner-contract.test.ts`

Previous owner plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_LEAF_SURFACE_MASS_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-22.md`

Previous owner status:

`post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.double_leaf_framed.leaf_surface_mass_numeric_sensitivity_owner`

The owner protects the owned Gate S / Gate I / Gate AR
double-leaf/framed route's side-leaf surface mass sensitivity. Light
`9.5 mm`, baseline `12.5 mm`, and heavy `18 mm` gypsum leaves remain
numerically active; asymmetric `12.5 + 25 mm` leaves keep mass ratio
active; field and building companions move from the same owned direct
curve; missing side-leaf grouping remains `needs_input`; and impact
aliases remain `unsupported`. Counters:
`accuracyPromotedRequestShapes: 3`,
`accuracyPromotedTargetOutputs: 13`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 13`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Coverage Refresh Scope

The refresh should re-probe:

- light, baseline, and heavy symmetric side-leaf mass lab pins;
- asymmetric side-leaf mass ratio pins;
- mass-sensitive field and building adapter values;
- missing side-leaf grouping and missing side-leaf mass `needs_input`;
- `IIC` and `AIIC` as unsupported impact aliases;
- docs/current-gate alignment for the owner and selected next action.

## Landing Result

The refresh landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-coverage-refresh-contract.test.ts`
and is included in `tools/dev/run-calculator-current-gate.ts`. It
protects light, baseline, heavy, and asymmetric side-leaf mass values
from the owned Gate S / Gate I / Gate AR direct curve; keeps missing
side-leaf grouping as `needs_input`; promotes unresolved side-leaf
surface mass from a generic solver negative boundary to
`needs_input`; and keeps `IIC` / `AIIC` unsupported. This is not a
broad source crawl.

## Stop Conditions

- Do not change formulas or retune leaf-mass constants in the refresh.
- Do not import source rows.
- Do not broaden into frequency backbone, building/flanking expansion,
  UI polish, confidence copy, or process cleanup.
- If a value has changed, stop and decide whether the owner behavior was
  intentionally moved by a separate runtime change.

## Expected Coverage Refresh Counters

- `coverageRefreshContractFilesTouched: 1`
- `requiredInputBoundariesMoved: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
