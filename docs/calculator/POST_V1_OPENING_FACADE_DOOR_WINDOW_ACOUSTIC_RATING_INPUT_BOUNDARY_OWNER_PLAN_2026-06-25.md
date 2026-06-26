# Post-V1 Opening/Facade Door/Window Acoustic-Rating Input Boundary Owner Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`

Owner action:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner_plan`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan`

Previous coverage action:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan`

Previous coverage file:
`packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous rerank status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_acoustic_rating_input_boundary_owner`

Previous rerank estimated counter:
`estimatedNextRequiredPhysicalInputsCaptured: 1`; no support-only loop.

Owner file:
`packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-owner-contract.test.ts`

Owner helper:
`packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-owner.ts`

Selected candidate:
`opening.facade_door_window_acoustic_rating_input_boundary_owner`

Selected next action:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Selected next label:
`post-V1 opening/facade door/window acoustic-rating input boundary coverage refresh`

Counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`newNeedsInputRequestShapes: 3`,
`requiredPhysicalInputsCaptured: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 6`.

This is an input-boundary owner, not a broad source crawl, source-row
import, formula retune, frontend slice, scalar STC shortcut,
outdoor-indoor/OITC adapter, or impact owner.

Landed coverage refresh handoff:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh`
/
`packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts`.
Coverage counters: `coverageRefreshContractFilesTouched: 1`,
`requiredPhysicalInputsCaptured: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next rerank after coverage refresh:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md`.

## Selection Card

User construction / formula family:
complete-looking indoor door/window/facade opening leakage requests on
a gypsum / cavity / rockwool / concrete host wall, with explicit
opening area, count, element type, frequency/rating basis, leakage
class, indoor context, and room/building context, but missing the
opening element acoustic rating `openingElementRwDb`.

Target outputs to open:
no new numeric output is opened. The owner opens a stricter input
boundary for `Rw`, `STC`, `C`, `Ctr`, `R'w`, `Dn,w`, `Dn,A`,
`DnT,w`, `DnT,A`, and `DnT,A,k` when the route cannot physically run.

Formula, measured-row, anchor, or adapter route:
Gate S / Gate AH / ISO 717-1 opening leakage routes remain the owned
formula/adapter chain for complete inputs. This owner does not retune
that chain; it blocks the chain before calculation when the opening
element acoustic rating is missing.

Required physical inputs:
`openingElementRwDb`.

`needs_input` behavior:
if the existing door/window/facade frequency/input boundary is otherwise
complete but any opening element lacks a positive `openingElementRwDb`,
the engine returns `needs_input` with missing physical input
`openingElementRwDb`, moves the affected requested outputs to
unsupported, and exposes the acoustic-rating input-boundary warning.

`unsupported` boundaries that remain blocked:
host-wall value substitution for missing opening acoustic data, generic
door/window label shortcuts, scalar STC opening rating aliases,
outdoor-indoor facade and `OITC` promotion, impact fallback,
source-row import, broad catalog crawl, and formula retune.

Expected counters:
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Landed Runtime/Input Behavior

Complete opening requests are unchanged:

- mixed lab requests still calculate `Rw 38.2`, `STC 39`, `C -1.6`,
  and `Ctr -6.3`;
- complete building requests still calculate `R'w 31.6`, `Dn,w 31.9`,
  `Dn,A 31.1`, `DnT,w 32.1`, `DnT,A 31.3`, and `DnT,A,k 30.4`;
- C/Ctr-only requests still calculate `C -1.6` and `Ctr -6.3`.

Missing opening acoustic rating now returns a precise needs-input
boundary:

- lab request `Rw`/`STC`/`C`/`Ctr` returns
  `missingPhysicalInputs: ["openingElementRwDb"]`;
- C/Ctr-only requests return the same missing input instead of using a
  host-wall spectrum or generic unsupported basis;
- field/building opening leakage requests return the same missing input
  instead of parking behind the indoor field/building adapter.

Older boundaries remain in charge when they are more specific:
missing frequency/rating basis still returns
`openingFrequencyBandsOrRatingBasis`, and impact aliases remain
unsupported outside this owner.
