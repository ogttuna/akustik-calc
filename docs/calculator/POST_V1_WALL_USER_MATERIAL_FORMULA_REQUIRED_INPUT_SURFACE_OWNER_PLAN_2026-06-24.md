# Post-V1 Wall User-Material Formula Required Input Surface Owner Plan - 2026-06-24

Status:
`post_v1_wall_user_material_formula_required_input_surface_owner_landed_runtime_input_boundary_selected_coverage_refresh`

Owner action:
`post_v1_wall_user_material_formula_required_input_surface_owner_plan`

## Purpose

This is the selected next runtime/input-surface owner after
`post_v1_runtime_first_route_family_rerank_after_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan`.

The previous British Gypsum chain opened exact-row lab companions and
then stopped with a no-runtime coverage refresh. This owner deliberately
moves back toward arbitrary user-entered wall combinations: source-absent
single-leaf and double-leaf/framed wall stacks should calculate through
owned formula routes when route-critical physical inputs are explicit,
and should return precise `needs_input` when they are not.

This is not a source crawl, catalog-rating copy, UI polish pass, or
confidence-labeling task. This is not a broad source crawl.

## Follows

Previous no-runtime coverage refresh action:
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan`

Previous no-runtime coverage refresh file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-calculated-lab-companion-coverage-refresh-contract.test.ts`

Previous no-runtime coverage refresh status:
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan`

Rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-british-gypsum-exact-lab-calculated-lab-companion-coverage-refresh-contract.test.ts`

Rerank status:
`post_v1_runtime_first_route_family_rerank_after_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_landed_no_runtime_selected_wall_user_material_formula_required_input_surface_owner`

Selected candidate:
`wall.user_material_formula_required_input_surface_owner`

Selected next plan:
`docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_OWNER_PLAN_2026-06-24.md`

Owner status:
`post_v1_wall_user_material_formula_required_input_surface_owner_landed_runtime_input_boundary_selected_coverage_refresh`

Selected follow-up coverage refresh action:
`post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_plan`

Selected follow-up coverage refresh file:
`packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`

Selected follow-up coverage refresh plan:
`docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_COVERAGE_REFRESH_PLAN_2026-06-24.md`

Selected follow-up coverage refresh status:
`post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh`

Selected runtime-first rerank after coverage refresh:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_plan`

Selected runtime-first rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`

Selected runtime-first rerank plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_COVERAGE_REFRESH_PLAN_2026-06-24.md`

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Selection Card

- User construction / formula family:
  arbitrary user-entered wall stacks with no exact acoustic source row:
  single-leaf user panels and double-leaf/framed user-material walls
  with panel leaves, cavities, and optional porous absorption.
- Target outputs to open:
  `Rw`, `STC`, `C`, and `Ctr` for complete element-lab formula routes;
  `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` only when the existing
  field/building adapters receive complete room and area context.
- Formula route:
  owned single-leaf mass-law / double-leaf-framed dynamic airborne
  formula routes plus existing ISO 717-1 / ASTM E413 rating adapters
  and Gate I / Gate AR field-building adapters where applicable.
- Required physical inputs:
  `surfaceMassKgM2` or density-derived surface mass from
  `materialCatalog.densityKgM3 + layer.thicknessMm`, layer thickness,
  leaf grouping, support topology, support/stud spacing, cavity depth,
  cavity fill, absorber flow resistivity or a named safe-default
  posture, and field/building room context when field/building outputs
  are requested.
- `needs_input` behavior:
  missing leaf mass, missing density, missing topology, missing cavity
  depth, missing absorber property, missing support spacing, or missing
  field/building room context must be named exactly; the calculator must
  not fall back to a nearby material or copy a catalog rating.
- `unsupported` boundaries:
  impact aliases (`Ln,w`, `DeltaLw`, `IIC`, `AIIC`), nearby British
  Gypsum row deltas, manufacturer headline acoustic ratings, lab-to-field
  copying without adapters, and source-row claims without exact identity
  remain blocked.
- Expected `newCalculableRequestShapes`: 2.
- Expected `newCalculableTargetOutputs`: 8.
- Expected `requiredPhysicalInputsCaptured`: 8.
- Expected `runtimeBasisPromotions`: 2.
- Expected `runtimeValuesMoved`: 8.

## Planning Iterations

Iteration 1 - answer-order check:
there is no exact measured/source row for arbitrary user-entered
project material stacks. The correct answer-order path is the owned
physics route, not British Gypsum exact-row reuse and not catalog rating
copy.

Iteration 2 - existing route inventory:
the engine already has single-leaf explicit-surface-mass, double-leaf /
framed explicit-surface-mass, user-material formula companion, and
field/building adapter owners. This slice should not re-open those as a
support loop; it should make the remaining input surface explicit and
testable for source-absent wall stacks.

Iteration 3 - missing-input discipline:
the runtime owner must prefer precise `needs_input` over low-confidence
defaults. Density-derived surface mass is allowed only when the request
has a project/catalog material density and layer thickness; otherwise
the missing field remains `surfaceMassKgM2` or `densityKgM3`.

Iteration 4 - boundary and ROI:
this owner has higher calculator ROI than a nearby British Gypsum delta
because the local BG evidence is limited to `A046005` / `A046006`, while
the selected owner benefits many user-entered source-absent stacks
through owned formulas. If a later BG nearby-delta owner is selected,
it must first bring primary-source same-family evidence and a bounded
delta rule.

## Implementation Rules

1. Keep runtime changes in the engine; do not touch Workbench UI unless
   a failing contract proves the API cannot expose required inputs.
2. Do not import acoustic source rows or copy manufacturer acoustic
   ratings.
3. Prefer small route-bound helpers over broad resolver rewrites.
4. Surface route-critical missing inputs in `airborneBasis`,
   `acousticAnswerBoundary`, and resolver traces consistently.
5. Preserve already-landed exact-source, field/building, A-weighted,
   `DnT,A,k`, and calculated lab companion boundaries.

## Expected Counters

- `candidateCount: 6`
- `roiAnalysisIterations: 4`
- `estimatedNextCalculableRequestShapes: 2`
- `estimatedNextCalculableTargetOutputs: 8`
- `estimatedNextRequiredPhysicalInputsCaptured: 8`
- `estimatedNextRuntimeBasisPromotions: 2`
- `estimatedNextRuntimeValuesMoved: 8`
- `runtimeValuesMoved 0` for the preceding no-runtime rerank
- `newCalculableRequestShapes: 2`
- `newCalculableTargetOutputs: 8`
- `requiredPhysicalInputsCaptured: 8`
- `runtimeBasisPromotions: 2`
- `runtimeValuesMoved 8`
- `zeroMassFallbackTargetOutputsParked: 9`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Validation Plan

1. Add the runtime/input-surface owner contract:
   `packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-owner-contract.test.ts`.
2. Prove complete source-absent wall stacks calculate through owned
   formula routes when all required inputs are present.
3. Prove missing route-critical inputs return precise `needs_input`
   instead of fallback values.
4. Prove impact aliases, nearby British Gypsum rows, manufacturer
   acoustic ratings, and lab-to-field copies stay closed.
5. Run the owner contract, the just-landed rerank contract, the relevant
   source-absent wall formula contracts, `git diff --check`, and
   `pnpm calculator:gate:current` after current-gate sync changes.
