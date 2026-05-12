# Gate AE Flat Multicavity Solver Broadening Handoff - 2026-05-11

## Landed Gate

`gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_plan`

## Selection Status

`gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_landed_selected_revalidation_gate_af`

## Selected Next Action

`gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan`

## Selected Next File

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts`

## What Changed

Gate AE is the bounded runtime promotion selected by Gate AD. It does
not crawl broad source rows and does not auto-group ambiguous flat layer
lists. It uses the explicit grouped topology owner set from Gate AB/AC
to route complete element-lab flat/many-layer multicavity wall stacks
through the existing two-cavity frequency solver.

New runtime/module surfaces:

- `packages/engine/src/dynamic-airborne-gate-ae-flat-multicavity.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts`

The selected runtime basis is:

- method `gate_ae_flat_multicavity_two_cavity_frequency_solver`
- origin `family_physics_prediction`
- strategy `gate_ae_flat_multicavity_two_cavity_solver_broadening_family_physics_prediction`
- error budget `+/-7 dB`
- selected candidate `candidate_gate_ae_flat_multicavity_family_physics_prediction`

## Runtime Boundary

The complete grouped flat/many-layer wall now promotes from broad
screening:

- previous screening pin: `Rw 38 / STC 38 / C -1 / Ctr -5.6`
- Gate AE solver pin: `Rw 53 / STC 57 / C -0.6 / Ctr -8`
- method `gate_ae_flat_multicavity_two_cavity_frequency_solver`
- origin `family_physics_prediction`
- error budget `+/-7 dB`

This is a source-absent family-physics prediction. Exact and calibrated
source candidates remain present but rejected for missing same-stack
source-owned curve/holdout evidence. The result must not be presented as
measured evidence.

Gate G remains first for the narrower full mineral-wool grouped
triple-leaf route. The existing pin remains unchanged:

- `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`
- method `triple_leaf_two_cavity_frequency_solver`
- origin `family_physics_prediction`
- error budget `+/-5 dB`

## Protected Boundaries

Gate AE only promotes complete `element_lab` grouped topology. It does
not:

- infer grouped topology from ambiguous flat layer lists;
- accept stale `flat_layer_order` grouping as complete;
- accept duplicate/overlapping layer groups;
- alias lab `Rw` / `STC` / `C` / `Ctr` onto `R'w` or `DnT,w`;
- support field, building-prediction, ASTM, or IIC outputs without
  separately owned adapters.

Field requests against the same stack remain `needs_input` until
`contextMode`, partition area, receiving-room volume, and RT60 are
explicit.

## Test Coverage

Gate AE adds:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts`

The tests cover:

- Gate AE metadata and Gate AF selection;
- complete grouped flat multicavity runtime values and basis;
- rejected exact/calibrated source candidates;
- dynamic trace, selected delegate, strategy, and warning copy;
- existing Gate G full mineral-wool triple-leaf precedence;
- stale/duplicate/no-topology negatives;
- field-output non-aliasing;
- docs, exports, runner, and web surface alignment.

## Validation

Validation passed on 2026-05-11:

- focused Gate AE/AC/AD engine contracts: 3 files / 14 tests;
- focused flat-multicavity web surface parity: 1 file / 4 tests;
- engine typecheck;
- web typecheck;
- focused dynamic-airborne split line-count contract after the Gate AE
  hook: 1 file / 5 tests;
- `pnpm calculator:gate:current` with engine 372 files / 2148 tests,
  web 74 files / 318 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean.

The Next build kept the known optional `sharp/@img` package warnings
from the DOCX/PDF path but completed.

Post-checkpoint broad revalidation passed on 2026-05-12 after one
lint-only cleanup in the Gate AA helper import. Final `pnpm check`
passed lint, typecheck, engine Vitest 497 files / 2950 tests, all web
Vitest split batches, and repo build 5/5. See
[CHECKPOINT_2026-05-12_POST_GATE_AE_CHECKPOINT_AND_BROAD_REVALIDATION_HANDOFF.md](./CHECKPOINT_2026-05-12_POST_GATE_AE_CHECKPOINT_AND_BROAD_REVALIDATION_HANDOFF.md).

## Next Step

Gate AF should run post-promotion broad revalidation. It should verify
that Gate AE did not destabilize the 40-row personal-use matrix, older
Gate G/AB/AC/AD expectations, visible workbench/report parity, or
lab/field/building/ASTM boundaries. If that revalidation is green, the
next lane should be selected from the updated matrix rather than by a
broad source crawl.
