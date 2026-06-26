# Post-V1 Opening/Facade Door/Window C/Ctr Lab-Companion Target-Output Independence Coverage Refresh Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh`

Coverage refresh action:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan`

Selected by:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner_plan`

Previous rerank action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_plan`

Selected owner file:
`packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-owner-contract.test.ts`

Selected owner status:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner_landed_runtime_basis_selected_coverage_refresh`

Selected candidate:
`opening.facade_door_window_c_ctr_lab_companion_target_output_independence_owner`

Selected coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected coverage refresh label:
`post-V1 opening/facade door/window C/Ctr lab-companion target-output independence coverage refresh`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Selected next label:
`post-V1 runtime-first route-family rerank after opening/facade door/window C/Ctr lab-companion target-output independence coverage refresh`

Selected owner counters:
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 4`, `runtimeValuesMoved 8`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Purpose

This is the no-runtime coverage refresh selected after the opening /
facade door/window C/Ctr lab-companion owner. It should re-probe the
landed runtime behavior without moving additional values, importing
source rows, retuning formulas, widening outdoor facade/OITC, adding
scalar STC aliases, or adding impact aliases.
This is not a broad source crawl.

The refresh should prove that complete indoor field/building
door/window/facade requests keep `C -1.6` and `Ctr -6.3` as lab
companions, mixed lab requests keep `Rw 38.2`, `STC 39`, `C -1.6`, and
`Ctr -6.3`, and mixed field/building requests keep the C/Ctr lab
companions basis-separated from the opening/leak field/building runtime
values. Missing frequency input, outdoor-indoor/OITC facade, scalar STC
rating shortcuts, and impact aliases remain blocked.

Landed outcome:
the coverage refresh re-probed
`opening.facade_door_window_c_ctr_lab_companion_target_output_independence_owner`
without moving runtime values. Complete indoor field/building
door/window/facade requests still keep `C -1.6` and `Ctr -6.3` as
request-scoped lab companions; mixed lab requests keep `Rw 38.2`,
`STC 39`, `C -1.6`, and `Ctr -6.3`; mixed field/building requests keep
`R'w 31.6`, `Dn,w 31.9`, `Dn,A 31.1`, `DnT,w 32.1`,
`DnT,A 31.3`, and `DnT,A,k 30.4` basis-separated. The refresh selects
the runtime-first rerank named above. This is not a broad source crawl.

## Expected Counters

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `requiredPhysicalInputsCaptured: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Non-Goals

- No broad source crawl.
- No product catalog import.
- No formula retune.
- No runtime value movement.
- No outdoor-indoor/OITC adapter.
- No scalar STC rating shortcut.
- No impact metric owner.
- No frontend slice.
