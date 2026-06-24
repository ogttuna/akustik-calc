# Post-V1 Wall User-Material Formula Required Input Surface Coverage Refresh Plan - 2026-06-24

Status:
`post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh`

## Purpose

This is the selected next no-runtime coverage refresh after
`post_v1_wall_user_material_formula_required_input_surface_owner_plan`.

The owner moved a calculator boundary, not a source catalog: complete
source-absent user-material wall stacks still calculate through owned
single-leaf and double-leaf/framed formula routes when route-critical
physical inputs are explicit, while zero-mass user/project leaves now
return precise `needs_input` instead of publishing screening or
field/building adapter values.

This refresh must re-probe the landed behavior without importing source
rows, retuning formulas, copying manufacturer ratings, or widening UI
scope.

## Follows

Previous runtime/input-surface owner action:
`post_v1_wall_user_material_formula_required_input_surface_owner_plan`

Previous runtime/input-surface owner file:
`packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-owner-contract.test.ts`

Previous runtime/input-surface owner status:
`post_v1_wall_user_material_formula_required_input_surface_owner_landed_runtime_input_boundary_selected_coverage_refresh`

Selected next implementation file:
`packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`

Selected next label:
`post-V1 wall user-material formula required input surface coverage refresh`

Coverage refresh action:
`post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_plan`

Coverage refresh file:
`packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`

Selected runtime-first rerank action:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_plan`

Selected runtime-first rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`

Selected runtime-first rerank plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_COVERAGE_REFRESH_PLAN_2026-06-24.md`

Selected runtime-first rerank label:
`post-V1 runtime-first route-family rerank after wall user-material formula required input surface coverage refresh`

## Selection Card

- User construction / formula family:
  source-absent user-entered wall stacks using project/catalog material
  rows: single-leaf user panels and double-leaf/framed user-material
  panel/cavity/absorber assemblies.
- Target outputs to re-probe:
  `Rw`, `STC`, `C`, and `Ctr` on element-lab formula routes; `R'w`,
  `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` only where the already-owned
  field/building adapters receive complete context.
- Formula route:
  existing single-leaf mass-law banded formula route,
  double-leaf/framed dynamic airborne formula route, ISO 717-1 /
  ASTM E413 rating adapters, and Gate I / Gate AR adapters.
- Required physical inputs:
  `layer.surfaceMassKgM2_or_materialCatalog.densityKgM3_and_thicknessMm`,
  material acoustic behavior, layer thickness, leaf grouping, support
  topology, support spacing, cavity depth, cavity fill, absorber flow
  resistivity or owned safe-default posture, and field/building room
  context when those outputs are requested.
- `needs_input` behavior:
  zero or missing user-material leaf mass must park all requested wall
  airborne outputs with method
  `post_v1_wall_user_material_formula_required_input_surface_missing_leaf_mass`.
- `unsupported` boundaries:
  impact aliases, manufacturer headline ratings, nearby British Gypsum
  deltas, and lab-to-field copying without adapters remain blocked.
- Expected `newCalculableRequestShapes`: 0 for this refresh.
- Expected `newCalculableTargetOutputs`: 0 for this refresh.
- Expected `runtimeBasisPromotions`: 0 for this refresh.
- Expected `runtimeValuesMoved`: 0 for this refresh.
- Expected `runtimeFormulaRetunes`: 0 for this refresh.
- Expected `sourceRowsImported`: 0 for this refresh.

## Landed No-Runtime Refresh

The refresh re-probes the landed owner behavior without moving runtime
values. Complete user-material single-leaf and double-leaf/framed wall
formula routes remain calculable when the physical inputs are explicit.
Zero-mass user/project leaf requests remain parked behind
`needs_input` for
`layer.surfaceMassKgM2_or_materialCatalog.densityKgM3_and_thicknessMm`.
Impact aliases, source-row imports, manufacturer-rating copies,
nearby British Gypsum deltas, formula retunes, and lab-to-field copies
remain closed.

Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Current selected next:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_COVERAGE_REFRESH_PLAN_2026-06-24.md`
/
`post-V1 runtime-first route-family rerank after wall user-material formula required input surface coverage refresh`.

## Validation Plan

1. Add
   `packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`.
2. Re-probe complete single-leaf density-derived and double-leaf/framed
   user-material routes.
3. Re-probe zero-mass user-material lab and building requests to ensure
   they stay `needs_input`.
4. Re-probe impact aliases and source-row/manufacturer-rating
   boundaries.
5. Add the refresh to `tools/dev/run-calculator-current-gate.ts`, update
   live handoff docs, run the targeted owner + refresh contracts, run
   `git diff --check`, then run `pnpm calculator:gate:current`.
