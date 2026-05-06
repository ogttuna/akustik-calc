# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate S

## Status

Landed Gate S for the active slice:

`calculator_model_first_physics_prediction_pivot_v1`

Gate S landed action:

`gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator`

Gate S landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts`

Selection status:

`gate_s_double_leaf_framed_bridge_runtime_landed_selected_family_material_gap_gate_t`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts`

Selected next action:

`gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator`

Previous Gate R selection status:

`gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s`

## What Changed

Gate S adds
`packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts` and
wires it into `packages/engine/src/dynamic-airborne.ts`.

The helper promotes the Gate R double-leaf / framed bridge solver into
Dynamic Calculator runtime for explicit complete contexts only. It keeps
the model-first candidate stack intact:

- exact full-stack source can still override when Gate H source
  promotion prerequisites are satisfied;
- calibrated family rows remain a higher-precedence future candidate;
- the source-absent double-leaf/framed bridge family physics prediction
  is selected when physical inputs are complete;
- screening remains a lower-precedence fallback.

The central Dynamic Calculator candidate resolver now preserves the
Gate S family-physics candidate id:

`candidate_double_leaf_framed_bridge_family_physics_prediction`

This avoids relabelling the double-leaf/framed solver as the older
grouped-Rockwool family candidate.

## Runtime Pins

Independent absorbed gypsum / rockwool / gypsum, with explicit side leaf
groups and independent frames, now selects:

- `Rw 45`
- `STC 45`
- `C -1`
- `Ctr -6.1`
- origin `family_physics_prediction`
- method
  `gate_s_double_leaf_framed_bridge_mass_air_mass_bridge_damping_runtime`
- `errorBudgetDb: 7`

Resilient channel with explicit both-side resilient side count selects:

- `Rw 46`
- `STC 46`
- origin `family_physics_prediction`
- `errorBudgetDb: 8`

These are uncalibrated family-physics predictions, not measured exact
values. The warning and basis keep the visible error budget attached.
`STC` is carried as an ASTM rating-adapter output over the calculated
curve, not as an alias of `Rw`.

## Boundaries

The following boundaries stay protected:

- missing `resilientBarSideCount` remains `needs_input`;
- explicit double-leaf/framed wall route/output/report surfaces park as
  `needs_input` for that missing side-count boundary instead of showing
  the older fallback numeric trace;
- direct-fixed double-leaf/framed stacks do not promote into the bridge
  runtime candidate;
- non-explicit multi-cavity flat lists do not auto-group into this
  runtime lane;
- Gate G grouped Rockwool triple-leaf pins remain `Rw 50` / `STC 55`;
- Gate O single gypsum pin remains `Rw 31` / `STC 31` with no runtime
  value movement in the central resolver.

## Visible Surfaces

Gate S adds paired web coverage in:

`apps/web/features/workbench/wall-double-leaf-framed-bridge-runtime-route-card-matrix.test.ts`

That test pins complete-context route card, output card, and proposal
snapshot parity for `Rw`, `STC`, `C`, and `Ctr`. It also pins the
missing side-count visible behavior for the explicit
double-leaf/framed input-completeness contract so stale fallback numbers
are not shown as live values on that route. The web prompt is scoped to
`gate_q_double_leaf_framed_bridge_route_inputs`, so older exact,
screening, and guarded-source wall surfaces keep their previous card
posture.

## Next Step

Implement Gate T:

`gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator`

Gate T should close the highest-impact material-property gaps needed by
the Dynamic Calculator solvers and uncertainty budgets. This must remain
a calculator task: add or require physical/acoustic material properties
where the solver needs them, widen uncertainty where only engineering
defaults are available, and avoid replacing the solver with a finite
catalog of measured rows.

## Validation

Completed validation:

- `pnpm --filter @dynecho/engine typecheck`
- `pnpm --filter @dynecho/web typecheck`
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts --maxWorkers=1`
- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-double-leaf-framed-bridge-runtime-route-card-matrix.test.ts features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts features/workbench/rockwool-split-triple-leaf-numeric-source-closure-gate-b-visible.test.ts features/workbench/output-origin-trace-card-matrix.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

`pnpm calculator:gate:current` passed 299 engine test files / 1705
tests, 62 web test files / 275 passed / 18 skipped, repo build, and
the whitespace guard. Next build still prints the known optional
`sharp/@img` warnings through `@turbodocx/html-to-docx`; they are
non-fatal in this checkpoint.
