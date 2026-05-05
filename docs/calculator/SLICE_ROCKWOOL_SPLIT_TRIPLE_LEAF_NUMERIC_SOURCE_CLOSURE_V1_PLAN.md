# Slice Plan - Rockwool Split Triple-Leaf Numeric Source Closure V1

Slice id: `rockwool_split_triple_leaf_numeric_source_closure_v1`

Status: GATE C CLOSED / NEXT SLICE SELECTED

Selected by:

`calculator_source_gap_revalidation_v25` Gate A

Selection status:

`v25_fixed_adjacent_rockwool_flat_list_numeric_hold_selected_split_internal_leaf_numeric_source_closure`

Selected first file:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`

Selected first action:

`gate_a_decide_split_internal_leaf_numeric_model_or_topology_required_stop`

Gate A landed file:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`

Gate A landed status:

`gate_a_kept_split_internal_leaf_finite_screening_diagnostic_but_rejected_exact_numeric_closure_selected_runtime_withhold_gate_b`

Gate A landed action:

`gate_a_decided_split_internal_leaf_requires_source_owned_topology_before_exact_numeric_closure`

Gate A landed decision:

`rockwool_split_internal_leaf_exact_numeric_rejected_without_source_owned_topology`.

The adjacent Rockwool correction stays defended at
`Rw 51 / R'w 49 / DnT,w 51`.

The split/internal gypsum-leaf value still exists as a finite screening
diagnostic (`Rw 41 / R'w 39 / DnT,w 40`), but Gate A explicitly rejects
closing that value as a defended physical triple-leaf penalty. NRC 2024
and Uris 2006 show internal-board triple-leaf risk/deltas, and Ballagh
2013 gives a solver shape, but none currently provides the rights-safe
source-owned band curves, local Rockwool/material mapping,
topology/coupling owner, metric context owner, tolerance owner,
negative-boundary owner, calibration holdout, and paired visible/API
tests needed to call this stack exact.

Gate B landed file:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts`

Gate B landed action:

`gate_b_withhold_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`

Gate B landed gate:

`gate_b_withheld_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`

Gate B landed status:

`gate_b_withheld_flat_list_split_internal_leaf_supported_outputs_selected_closeout`

Gate B landed result:

Flat-list split/internal gypsum-leaf Rockwool stacks no longer expose
the current finite diagnostic as supported output-card/API-ready
targets. The engine still calculates the diagnostic
`Rw 41 / R'w 39 / DnT,w 40`, but requested wall airborne outputs for
that flat-list split stack move from `supportedTargetOutputs` to
`unsupportedTargetOutputs` until grouped topology and a source-owned
calibrated model exist. The workbench card surface now shows
`Not ready` with explicit grouped-topology/source-owned-model copy for
the flat-list split case.

Adjacent Rockwool stays on the corrected supported double-leaf lane:
`Rw 51 / R'w 49 / DnT,w 51`. Grouped Rockwool remains the existing
screening-only/source-blocked path: `Rw 41`, live as screening, not
exact, not source-validated, and not design-grade.

Selected next file:

`packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_split_triple_leaf_numeric_source_closure_and_select_next_accuracy_slice`

Gate C landed file:

`packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`

Gate C landed status:

`closed_rockwool_split_triple_leaf_numeric_source_closure_selected_source_gap_revalidation_v26`

Gate C selected next slice:

`calculator_source_gap_revalidation_v26`

Gate C selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`

Gate C selected next action:

`gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout`

Gate C selected planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md`

Gate C closeout artifacts:

- `rockwool_split_numeric_closure_gate_c_summary`
- `flat_list_split_output_withhold_carry_forward`
- `adjacent_rockwool_51_49_51_carry_forward`
- `grouped_rockwool_screening_source_blocker_status`
- `remaining_accuracy_gap_order_after_rockwool_closeout`
- `selected_gate_a_source_gap_revalidation_v26_with_target_file`

Gate C result:

This slice is closed. The flat-list split/internal gypsum-leaf
Rockwool case remains blocked from defended exact output consumption:
it still calculates `Rw 41 / R'w 39 / DnT,w 40`, but wall airborne
outputs stay withheld from `supportedTargetOutputs` until grouped
topology or a source-owned calibrated model exists. Adjacent Rockwool
stays corrected and supported at `Rw 51 / R'w 49 / DnT,w 51`. Grouped
Rockwool stays live screening-only/source-blocked at `Rw 41`, not
exact and not source-validated.

## Objective

Close the remaining numeric correctness question for
`rockwool_split_internal_leaf_remains_numeric_open`.

The adjacent Rockwool flat-list case is now corrected by
`rockwool_adjacent_flat_list_numeric_recovery`: `Rw 51`, `R'w 49`,
`DnT,w 51`. The remaining split/internal gypsum-leaf case still returns
`Rw 41`, `R'w 39`, `DnT,w 40` through `multileaf_screening_blend`.

Gate A must decide one of two defensible outcomes:

1. Treat the internal gypsum layer as a physical triple-leaf penalty only
   when grouped topology and source/model ownership prove it.
2. Treat flat-list split intent as ambiguous and stop for grouped
   topology input instead of returning a potentially wrong numeric
   penalty.

Do not spend this slice on confidence wording. The output must either be
numerically defended or clearly blocked for missing topology/source.

## Required Checks

- Reproduce the PDF-like adjacent and split stacks in engine tests.
- Keep the adjacent stack on `R'w 49` / `DnT,w 51`.
- Gate A done: the split stack may not keep `R'w 39` / `DnT,w 40` as a
  defended physical penalty without grouped topology and source/model
  ownership.
- Gate A done: no source/model/tolerance owner exists yet for exact
  numeric closure.
- Gate B done: withheld flat-list split/internal-leaf exact outputs and
  make them require grouped topology/source ownership before the user
  can read the penalty as a defended result.
- Gate C done: closed this slice, preserved the flat-list split
  unsupported-output boundary, and selected
  `calculator_source_gap_revalidation_v26`.

## Validation Plan

Focused first gate:

```sh
pnpm --filter @dynecho/engine exec vitest run src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts --maxWorkers=1
```

Gate A validation completed on 2026-05-05: focused Gate A passed 1 file
/ 4 tests; Rockwool triple-leaf engine continuity passed 9 files / 49
tests; `pnpm calculator:gate:current` passed with engine 262 files /
1513 tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
tasks, and whitespace guard green.

Focused next gate:

```sh
pnpm --filter @dynecho/engine exec vitest run src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts --maxWorkers=1
```

Gate B validation completed on 2026-05-05:

- focused engine Gate B passed 1 file / 5 tests.
- focused web visible Gate B passed 1 file / 3 tests.
- web Rockwool continuity passed 5 files / 28 tests after updating the
  internal acceptance rehearsal to expect `Not ready` for flat-list
  split `Rw`.
- Rockwool engine continuity passed 7 files / 38 tests.
- final `pnpm calculator:gate:current` passed with engine 263 files /
  1518 tests, web 54 files / 263 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- broad validation after Gate B: lint and typecheck passed, engine full
  suite passed 396 files / 2338 tests, web full suite passed on rerun
  with 166 files / 936 passed + 18 skipped, repo build passed 5 / 5
  tasks, and final `git diff --check` passed. The first monolithic
  `pnpm check` run hit a transient timeout in the long AAC-G5 web route
  scan; the isolated rerun and full web-suite rerun passed.

Focused closeout gate:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts --maxWorkers=1
```

Gate C validation completed on 2026-05-05:

- focused Gate C passed 1 file / 6 tests.
- final `pnpm calculator:gate:current` passed with engine 264 files /
  1524 tests, web 54 files / 263 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
