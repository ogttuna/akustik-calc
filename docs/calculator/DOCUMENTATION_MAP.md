# Calculator Documentation Map

Last reviewed: 2026-06-12

## Purpose

This file is the navigation layer for the calculator documentation. It
does not replace the source-of-truth docs or implementation contracts.
It tells a new agent what each live document is for, which files must be
kept in sync, and where the current implementation evidence lives.

DynEcho's calculator goal is unchanged: calculate more user-entered
layer combinations, and calculate current combinations more accurately,
with explicit `needs_input` / `unsupported` boundaries when a route is
not physically owned.

Long-range calculator direction:
`docs/calculator/INDUSTRY_GRADE_CALCULATOR_DIRECTION.md`. This file is
the strategic gap map for becoming an industry-grade calculator. It does
not replace the source of truth or selected-next implementation plan.

## Operating Principles

- Calculator behavior is the product. Docs, ledgers, and source rows are
  support tools.
- Measured rows are preferred evidence, not the end state. Missing
  measured rows are normal for arbitrary layer combinations.
- Formula routes must ask for physical inputs they need, not silently
  guess through the wrong family.
- Metric and basis ownership must stay explicit: lab, field, building,
  ISO, ASTM, A-weighted, and spectrum-adapter outputs are not aliases.
- A surface parity or coverage refresh is valid only when it protects or
  exposes calculator behavior. It should not become UI polish or process
  work.
- A new candidate is selected only after the current selected next file
  is closed or explicitly rejected with evidence.
- Long-range strategy is useful only when it feeds the selected-next
  mechanism through scope, accuracy, input-surface, calibration,
  building-prediction, or boundary-preserving calculator work.

## Current Canonical State

Latest committed calculator checkpoint:

`bfd5be0 Checkpoint post-V1 calculator route coverage`

Current reconciliation checkpoint:

`docs/calculator/CHECKPOINT_2026-06-11_DIRECT_FIXED_A_WEIGHTED_SURFACE_PARITY.md`

Latest landed runtime/surface/coverage chain:

- user-material double-leaf/framed route-input rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`;
- user-material double-leaf/framed route-input owner:
  `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`;
- user-material double-leaf/framed route-input coverage refresh:
  `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts`;
- post-user-material numeric coverage-gap rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`;
- user-material missing-topology input-surface owner:
  `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`;
- post-missing-topology numeric coverage-gap rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`;
- user-material porous flow-resistivity input owner:
  `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`;
- user-material porous flow-resistivity coverage refresh:
  `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`;
- post-flow numeric coverage-gap rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`;
- floor user-material impact context dynamic-stiffness owner:
  `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`;
- selected next floor user-material impact context dynamic-stiffness coverage refresh:
  `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`;
- direct-fixed double-leaf/framed A-weighted field/building owner:
  `packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`;
- direct-fixed double-leaf/framed A-weighted workbench parity:
  `apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`;
- direct-fixed double-leaf/framed A-weighted coverage refresh:
  `packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`;
- current gate registration:
  `tools/dev/run-calculator-current-gate.ts`.

Latest floor user-material impact context dynamic-stiffness owner status:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`

Owner action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`

Owner file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`

Owner plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_OWNER_PLAN_2026-06-12.md`

Selected candidate:

`floor.user_material_impact_context_dynamic_stiffness_owner`

Current selected next:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_COVERAGE_REFRESH_PLAN_2026-06-12.md`
/
`post-V1 floor user-material impact context dynamic-stiffness coverage refresh`

The owner lets custom visible heavy floating-floor stacks use
`floorImpactContext.resilientLayerDynamicStiffnessMNm3` and
`floorImpactContext.loadBasisKgM2`; the pinned custom stack calculates
`Ln,w 50.3` and `DeltaLw 24.3` through
`predictor_heavy_floating_floor_iso12354_annexc_estimate`. Missing
dynamic stiffness/load basis remains `needs_input`, and low-density
custom concrete remains outside the heavy concrete carrier route.
Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Latest user-material porous flow-resistivity input coverage refresh
status:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Coverage refresh action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`

Coverage refresh plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md`

Previous owner status:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh`

Owner action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`

Owner plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_OWNER_PLAN_2026-06-12.md`

Owner counters: `accuracyBoundaryRowsMoved: 2`,
`needsInputBoundaryRowsAdded: 1`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`

Rerank action:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`

Rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`

Previous owner action:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`

Previous owner status:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`

Previous selected candidate:

`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`

Latest post-flow rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`

Post-flow rerank action:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`

Post-flow rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`

Post-flow rerank plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_PLAN_2026-06-12.md`

Selected candidate:

`floor.user_material_impact_context_dynamic_stiffness_owner`

Historical selected next at the post-flow rerank checkpoint:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_OWNER_PLAN_2026-06-12.md`
/
`post-V1 floor user-material impact context dynamic-stiffness owner`

The refresh re-probes numeric user-supplied porous flow, explicit
engineering-default flow, context-owned absorber flow, and missing
user/unknown `flowResistivityPaSM2` for lab, field, and building bases.
It moves no runtime values and keeps missing flow at `needs_input`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

The post-flow rerank ran `roiAnalysisIterations: 3` with
`candidateCount 11`, `estimatedNextRuntimeValuesMoved: 2`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 2`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Latest post-missing-topology rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`

The rerank ran `roiAnalysisIterations: 3` with `candidateCount 10`,
`estimatedNextAccuracyBoundaryRowsMoved: 2`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesProtectedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Latest user-material coverage refresh status:

`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Coverage refresh action:

`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_plan`

Previous owner action:

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`

Previous owner status:

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_landed_runtime_selected_coverage_refresh`

The preceding rerank status is
`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_landed_no_runtime_selected_user_material_double_leaf_route_input_owner`.
It selected `wall.double_leaf_framed.user_material_route_input_owner`
after `roiAnalysisIterations: 3` with
`estimatedNextRuntimeValuesMoved: 12`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. The owner moved
`runtimeValuesMoved 12` with `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 0`. The coverage refresh re-probes
lab `Rw 46 / STC 46 / C -1 / Ctr -6.1`, field `R'w 40 / Dn,w 41 /
Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`, and building `R'w 40 / Dn,w 41 /
Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`; it moved `runtimeValuesMoved 0`
with `coverageRefreshContractFilesTouched: 1`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Latest user-material missing-topology input-surface owner status:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`

Owner action:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`

Owner plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_OWNER_PLAN_2026-06-12.md`

Selected candidate:

`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`

The owner keeps explicit custom user-material lab and field/building
values pinned, while no-topology and partial explicit topology requests
ask for `sideALeafGroup`, `cavity1DepthMm`, `sideBLeafGroup`,
`frameBridgeClass`, `supportTopology`, and `supportSpacingMm` instead of
guessing support details. Counters:
`inputSurfaceOwnerContractFilesTouched: 1`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next action at this checkpoint:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`

Historical selected next plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_PLAN_2026-06-12.md`

Historical selected next implementation file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`

Historical selected next label:

`post-V1 next numeric coverage gap after user-material missing-topology input surface`

Latest no-runtime rerank:

`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_user_material_route_input_landed_no_runtime_selected_user_material_missing_topology_input_surface_owner`
/
`post-V1 next numeric coverage gap after user-material route input`
selected
`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`
after `roiAnalysisIterations: 3`. Counters include
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Current Handoff At A Glance

| Question | Current answer |
| --- | --- |
| What landed most recently? | User-material porous flow-resistivity input coverage refresh. |
| Did runtime values move in the latest slice? | No; the refresh re-probed pinned values and `needs_input` boundaries. |
| What values are pinned? | Lab `Rw 46 / STC 46 / C -1 / Ctr -6.1`; field/building `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`. |
| Which engine basis is used? | Lab: `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`; field: `gate_i_airborne_field_apparent_context_adapter_runtime`; building: `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`. |
| What is next? | Add the no-runtime numeric coverage-gap rerank after user-material porous flow-resistivity input. |
| What should not happen next? | Do not silently guess porous flow resistivity, broaden sources, retune formulas, touch material-editor UI, or pick a runtime owner before the rerank. |

## Active Route File Set

| Purpose | File |
| --- | --- |
| Current checkpoint | `docs/calculator/CHECKPOINT_2026-06-11_DIRECT_FIXED_A_WEIGHTED_SURFACE_PARITY.md` |
| Latest rerank plan | `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_PLAN_2026-06-12.md` |
| Latest rerank contract | `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts` |
| Historical route-input rerank plan | `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_ROUTE_INPUT_PLAN_2026-06-12.md` |
| Historical route-input rerank contract | `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts` |
| Latest porous flow-resistivity owner plan | `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_OWNER_PLAN_2026-06-12.md` |
| Latest porous flow-resistivity owner contract | `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts` |
| Latest porous flow-resistivity coverage refresh plan | `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md` |
| Latest porous flow-resistivity coverage refresh contract | `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts` |
| Selected post-flow numeric-gap plan | `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_PLAN_2026-06-12.md` |
| Selected post-flow numeric-gap contract | `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts` |
| Selected next plan | `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md` |
| Selected next contract | `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts` |
| Latest coverage refresh evidence | `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts` |
| Runtime owner evidence | `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts` |
| Runtime implementation | `packages/engine/src/dynamic-airborne.ts`; `packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts` |
| Workbench parity evidence | `apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts` |
| Workbench input/report surfaces | `apps/web/features/workbench/advanced-wall-source-absent-input-surface.ts`; `apps/web/features/workbench/compose-workbench-report.ts` |
| Current gate runner | `tools/dev/run-calculator-current-gate.ts` |

The selected next owner contract is the only file in this table expected
not to exist yet.

## Next Slice Guardrails

The selected owner should:

- preserve explicit numeric `flowResistivityPaSM2`;
- preserve explicit engineering-default flow with property-default
  disclosure and wider budget;
- prevent missing user-supplied porous flow from publishing as a
  complete clean-budget result;
- keep lab, field, building, A-weighted, ASTM, and impact metric bases
  separate.

The selected owner should not:

- import source rows;
- retune formulas;
- touch frontend implementation;
- broaden source crawling or touch material-editor UI.

## Read Order

1. `AGENTS.md`
   Agent guardrails, drift guard, current selected next pointer.

2. `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
   Product goal and decision rules. This wins over older checkpoints,
   roadmaps, and historical selected-next notes.

3. `docs/calculator/DOCUMENTATION_MAP.md`
   This navigation file: where things are and which files should stay in
   sync.

4. `docs/calculator/NEXT_AGENT_BRIEF.md`
   Fast operational handoff: latest checkpoint, current next action, and
   current validation posture.

5. `docs/calculator/CURRENT_STATE.md`
   Snapshot of stable calculator behavior already landed.

6. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
   Tactical detail for the active/selected slice. Its top section should
   name the currently selected next file.

7. The selected slice plan doc.
   For the current checkpoint, this is the direct-fixed A-weighted
   field/building coverage refresh plan named above.

8. `docs/calculator/SYSTEM_MAP.md`
   Route-level implementation map after the current handoff is
   understood.

## Document Roles

- `CALCULATOR_SOURCE_OF_TRUTH.md`: calculator mission, allowed evidence
  order, drift guard, and next-slice decision rules.
- `NEXT_AGENT_BRIEF.md`: short handoff for the next implementation turn.
- `NEXT_IMPLEMENTATION_PLAN.md`: tactical current-slice work order and
  active selected-next chain.
- `CURRENT_STATE.md`: stable behavior snapshot, not the place to pick a
  new candidate.
- `SYSTEM_MAP.md`: route and surface map for implementation orientation.
- `CHECKPOINT_*.md`: dated reconciliation/validation snapshots.
- `POST_V1_*.md`: individual slice plans and closeouts. Historical
  `POST_V1_*` files are evidence, not current authority unless named by
  the source-of-truth or next-agent brief.
- `README.md` and `docs/calculator/README.md`: human entry points. They
  should point to this map and the current checkpoint.

## Historical Reference Docs

These documents still contain useful analysis, but they are not current
next-slice selectors. Their top-of-file override should point back to
this map and the source of truth:

- `MASTER_PLAN.md`: strategic historical roadmap.
- `BROAD_ACCURACY_CALCULATOR_PLAN.md`: broad-accuracy reference and
  external research notes.
- `PERSONAL_USE_READINESS_ROADMAP.md`: historical readiness framing.
- `POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`: productization backlog;
  not calculator engine progress.
- `CALCULATION_MODEL_AND_VALIDATION.md`: validation model reference;
  use after the active slice is chosen.
- `DYNAMIC_AIRBORNE_CARTOGRAPHY.md`: architecture cartography; optional
  hygiene work must not displace calculator scope/accuracy work.
- `SOURCE_GAP_LEDGER.md`: source-risk background; not a source-crawl
  selector.

If any of these documents names a selected next action that conflicts
with this map, `CALCULATOR_SOURCE_OF_TRUTH.md`, or
`NEXT_AGENT_BRIEF.md`, treat that mention as historical.

## Implementation Sync Points

When calculator runtime values move, keep these in sync:

- engine owner/contract file under `packages/engine/src/`;
- runtime implementation files touched by that owner;
- active slice plan doc;
- `CALCULATOR_SOURCE_OF_TRUTH.md`;
- `NEXT_AGENT_BRIEF.md`;
- `NEXT_IMPLEMENTATION_PLAN.md`;
- `CURRENT_STATE.md`;
- `SYSTEM_MAP.md`;
- current gate runner if a new contract file is added.

When workbench/surface parity lands, keep these in sync:

- web parity contract under `apps/web/features/workbench/`;
- related surface/report/snapshot implementation files if touched;
- active surface parity plan doc;
- `NEXT_AGENT_BRIEF.md`;
- `CURRENT_STATE.md`;
- `SYSTEM_MAP.md`;
- current gate runner if a new web test is added.

When a no-runtime coverage refresh lands, keep these in sync:

- coverage refresh contract under `packages/engine/src/`;
- current gate runner;
- active coverage refresh plan doc;
- `NEXT_AGENT_BRIEF.md`;
- `NEXT_IMPLEMENTATION_PLAN.md`;
- `CURRENT_STATE.md`;
- `SYSTEM_MAP.md`;
- selected next candidate or rerank plan.

## Current Validation Baseline

Checkpoint validation:

- `pnpm calculator:gate:current` passed;
- engine: 707 test files, 3905 tests passed;
- web: 126 test files, 494 passed, 18 skipped;
- repo build: 5 tasks successful;
- `git diff --check` passed.

Known non-fatal noise:

- optional `sharp` / `@img` warnings through `@turbodocx/html-to-docx`;
- `zustand persist middleware` storage-unavailable stderr in saved-replay
  web tests.

## Commit Hygiene

Calculator commits should include only calculator code, tests, and docs.
Local artifacts such as PDFs, `output/`, `tmp/`, `.playwright-cli/`,
and `apps/web/tsconfig.next.tsbuildinfo` are not calculator checkpoint
evidence and should stay out of commits unless a user explicitly asks
for them.
