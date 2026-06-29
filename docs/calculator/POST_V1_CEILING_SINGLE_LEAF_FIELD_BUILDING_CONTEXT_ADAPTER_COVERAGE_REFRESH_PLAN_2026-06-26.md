# Post-V1 Ceiling Single-Leaf Field/Building Context Adapter Coverage Refresh - 2026-06-26

Status:
`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh`

Coverage refresh action:
`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`

Coverage refresh file:
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`

Coverage refresh plan:
`docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Planning note added:
`2026-06-29`

Selected by:
`post_v1_ceiling_single_leaf_field_building_context_adapter_owner_plan`
/
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts`

Selected by status:
`post_v1_ceiling_single_leaf_field_building_context_adapter_owner_landed_runtime_basis_selected_coverage_refresh`

Previous rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_plan`

Previous rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts`

Previous rerank status:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_field_building_context_adapter_owner`

Owner action:
`post_v1_ceiling_single_leaf_field_building_context_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts`

Owner status:
`post_v1_ceiling_single_leaf_field_building_context_adapter_owner_landed_runtime_basis_selected_coverage_refresh`

Owner label:
`post-V1 ceiling single-leaf field/building context adapter owner`

Selected candidate to re-probe:
`ceiling.single_leaf_field_building_context_adapter_owner`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected next label:
`post-V1 runtime-first route-family rerank after ceiling single-leaf field/building context adapter coverage refresh`

Landed owner movement to preserve:
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 6`,
`requiredPhysicalInputsCaptured: 3`,
`runtimeBasisPromotions: 2`, and `runtimeValuesMoved 11`.

Expected refresh movement:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`.

Landed coverage refresh file:
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`

Landed coverage refresh status:
`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh`

Support-slice justification:
this refresh is valid even though it moves no runtime values because it
protects the already-landed ceiling field/building adapter behavior,
keeps the current gate synchronized, and prevents stale selection or
metric/basis regressions from hiding behind later work. Treat it as
support, not as new calculator scope.

## Scope Boundary

This slice is a closeout/protection slice for an already-landed runtime
owner. It must not try to discover a new formula family or improve
numeric values.

In scope:

- create
  `packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`;
- model the contract after the existing ceiling airborne route coverage
  refresh, but re-probe the field/building adapter owner instead of the
  element-lab airborne owner;
- prove complete ceiling-only field requests stay on
  `ceiling.single_leaf_airborne_field_context_adapter`;
- prove complete ceiling-only building requests stay on
  `ceiling.single_leaf_airborne_building_prediction_adapter`;
- prove requested target-output scoping remains stable for field-only,
  building-only, and mixed lab-companion requests;
- prove incomplete building context returns `needs_input` or
  unsupported results instead of selecting the building adapter;
- prove floor impact outputs, ASTM/IIC/AIIC impact aliases, and OITC do
  not enter the ceiling airborne field/building adapters;
- add the refresh contract to `tools/dev/run-calculator-current-gate.ts`
  immediately after the owner contract;
- keep all current live docs aligned with the refresh status and the
  follow-up rerank selection.

Out of scope:

- no formula retune;
- no runtime value change;
- no source row import or catalog crawl;
- no frontend/workbench slice;
- no new public target-output id;
- no widening from gypsum-board single-leaf ceiling to roof, suspended
  ceiling, multi-leaf, timber, steel, concrete, or impact routes;
- no lab-to-field or lab-to-building copying beyond the existing owned
  adapters.

## Acceptance Contract

The new coverage refresh should freeze these positive behaviors:

- field complete context publishes `R'w 33`, `Dn,w 33`, `Dn,A 36.5`,
  `DnT,w 36`, and `DnT,A 38.9` on route `ceiling`;
- building complete context publishes `R'w 33`, `Dn,w 33`, `Dn,A 36.5`,
  `DnT,w 36`, `DnT,A 38.9`, and `DnT,A,k 36` on route `ceiling`;
- lab companions requested alongside building outputs remain lab
  companions and do not become building pins;
- required inputs still include ceiling route, ceiling-only layer roles,
  panel area or width/height, room volume, RT60, and building flanking
  context where required.

The new coverage refresh should freeze these negative boundaries:

- incomplete building context does not select
  `ceiling.single_leaf_airborne_building_prediction_adapter`;
- impact outputs stay outside the ceiling airborne adapters and keep the
  floor `needs_input` boundary;
- OITC stays unsupported for this indoor ceiling route;
- nearby wall, floor, opening, source-row, or confidence labels do not
  become fallback answers.

Expected validation:

- focused Vitest over the previous ceiling airborne rerank, ceiling
  airborne owner/coverage refresh, ceiling field/building owner, and the
  new coverage refresh;
- `pnpm calculator:gate:current` if the current gate runner is touched;
- `git diff --check`.

Closeout ledger:

- `coverageRefreshContractFilesTouched: 1`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `requiredPhysicalInputsCaptured: 0`;
- `runtimeBasisPromotions: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

The refresh should keep complete ceiling field requests on
`ceiling.single_leaf_airborne_field_context_adapter`, complete ceiling
building requests on
`ceiling.single_leaf_airborne_building_prediction_adapter`, and preserve
the missing-context, impact, ASTM, and OITC boundaries.

Follow-up after this refresh lands:
create a runtime-first rerank after the ceiling single-leaf
field/building context adapter coverage refresh. Expected action name:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`.
Expected file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`.
Expected plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-29.md`.
That rerank should select one bounded runtime, accuracy, input-surface,
or boundary owner from current implementation evidence, or stop with the
exact blocker and the smallest support step that removes it.

This is not a broad source crawl, catalog import, formula retune,
confidence-labeling loop, cosmetic frontend slice, or unbounded process
cleanup.
