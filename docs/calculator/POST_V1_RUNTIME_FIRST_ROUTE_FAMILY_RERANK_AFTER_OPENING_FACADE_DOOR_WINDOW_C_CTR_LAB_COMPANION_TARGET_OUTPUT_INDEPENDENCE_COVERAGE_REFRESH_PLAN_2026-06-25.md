# Post-V1 Runtime-First Route-Family Rerank After Opening/Facade Door/Window C/Ctr Lab-Companion Target-Output Independence Coverage Refresh Plan - 2026-06-25

Status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_acoustic_rating_input_boundary_owner`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan`

Selected by:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan`

Previous owner action:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner_plan`

Previous coverage file:
`packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous coverage status:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh`

Rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected candidate:
`opening.facade_door_window_acoustic_rating_input_boundary_owner`

Selected next action:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_PLAN_2026-06-25.md`

Selected next label:
`post-V1 opening/facade door/window acoustic-rating input boundary owner`

Counters:
`candidateCount: 9`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 0`,
`estimatedNextCalculableTargetOutputs: 0`,
`estimatedNextRequiredPhysicalInputsCaptured: 1`,
`estimatedNextRuntimeBasisPromotions: 0`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl, source-row import, formula retune,
frontend slice, scalar STC shortcut, outdoor-indoor/OITC adapter, or
impact owner. There is no support-only loop: this rerank selects the
input-boundary owner named above.

## Trigger Refresh Summary

The selected no-runtime refresh re-probed
`opening.facade_door_window_c_ctr_lab_companion_target_output_independence_owner`.
It kept complete indoor field/building door/window/facade `C -1.6` and
`Ctr -6.3` live as lab companions, kept mixed lab `Rw 38.2`, `STC 39`,
`C -1.6`, and `Ctr -6.3`, kept mixed field/building values
`R'w 31.6`, `Dn,w 31.9`, `Dn,A 31.1`, `DnT,w 32.1`,
`DnT,A 31.3`, and `DnT,A,k 30.4` basis-separated, and kept missing
frequency input, outdoor-indoor/OITC facade, scalar STC shortcuts, and
impact aliases blocked. Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Rerank Decision

Selected:
`opening.facade_door_window_acoustic_rating_input_boundary_owner`.

Reason:
the opening/facade door/window runtime chain can now calculate
element-lab `Rw`/`STC`, C/Ctr lab companions, and indoor field/building
opening leakage values when the opening acoustic rating is complete.
However, a complete-looking door/window/facade context that omits
`openingElementRwDb` still parks behind generic unsupported or host-wall
fallback surfaces instead of asking for the exact missing physical
input. The next safest calculator move is a vertical input-boundary
owner that requires `openingElementRwDb` before Gate S, lab companions,
or field/building leakage adapters can publish values.

Rejected stale repeats:
the C/Ctr lab-companion owner, Rw/STC lab-companion owner, and indoor
field/building adapter are already landed. Repeating them would not
increase input capture or target-output scope.

Rejected schema/adapter gaps:
outdoor-indoor facade and `OITC` still need a schema/output and
spectral facade adapter lane. Scalar STC opening ratings remain blocked
because the current input model exposes `elementRwDb`, not
`elementStcDb`, and Gate AH derives STC from a shifted transmission-loss
spectrum rather than a scalar alias.

Rejected landed or blocked floor lanes:
ASTM exact-band `IIC`/`AIIC` ownership and input-surface parity are
already landed. Dynamic-stiffness, visible load-basis, and field-only
user-material impact lanes are already landed for their selected
stacks. The raw-bare/floating same-basis holdout owner was rejected
because admissible holdouts were absent.

Rejected parallel support work:
source crawling and frontend polish do not outrank a ready calculator
input-boundary owner that prevents wrong opening/facade claims.

## Selected Owner Guardrails

- No host-wall value substitution for missing `openingElementRwDb`.
- No generic door/window label shortcut.
- No scalar STC opening rating alias.
- No outdoor-indoor facade or `OITC` promotion.
- No impact fallback.
- No source-row import.
- No broad catalog crawl.
- No support-only loop.
