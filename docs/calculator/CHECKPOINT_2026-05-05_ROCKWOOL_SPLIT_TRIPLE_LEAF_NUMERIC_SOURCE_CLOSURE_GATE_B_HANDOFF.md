# Checkpoint - 2026-05-05 - Rockwool Split Triple-Leaf Numeric Source Closure Gate B

Gate file:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts`

Slice:

`rockwool_split_triple_leaf_numeric_source_closure_v1`

Landed status:

`gate_b_withheld_flat_list_split_internal_leaf_supported_outputs_selected_closeout`

Landed gate:

`gate_b_withheld_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`

Landed action:

`gate_b_withhold_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`

## What Changed

Gate B added a runtime output-support boundary for the remaining
Rockwool split/internal gypsum-leaf flat-list problem.

The engine still calculates the diagnostic numbers:
`Rw 41 / R'w 39 / DnT,w 40` and `STC 41` through
`multileaf_screening_blend`.

For flat-list split/internal gypsum-leaf Rockwool stacks, requested wall
airborne targets now move from `supportedTargetOutputs` to
`unsupportedTargetOutputs`. That prevents the current diagnostic from
being consumed as a defended exact result while the required grouped
topology and source-owned calibrated model are absent.

The workbench visible output surface now mirrors the support boundary:
flat-list split/internal Rockwool output cards show `Not ready` and
explain that grouped triple-leaf topology plus a source-owned calibrated
model are required before the current diagnostic can be consumed as a
defended result.

## Protected Boundaries

Adjacent Rockwool remains fixed and supported:
`Rw 51 / R'w 49 / DnT,w 51` and `STC 51` on
`double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology`.

Grouped Rockwool remains the existing screening-only/source-blocked
path: `Rw 41`, live as screening, not exact, not source-validated, and
not design-grade.

Gate B did not add a source-owned Rockwool triple-leaf model, did not
promote Uris/NRC/Ballagh evidence into runtime, and did not change
numeric metrics for adjacent, grouped, or flat-list split stacks.

## Selected Next Gate

Selected next file:

`packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_split_triple_leaf_numeric_source_closure_and_select_next_accuracy_slice`

Gate C should close this slice, carry forward the flat-list split
unsupported-output boundary, keep adjacent `51/49/51` protected, keep
grouped Rockwool screening-only/source-blocked, and select the next
bounded accuracy slice.

## Validation

Validation completed on 2026-05-05:

- focused engine Gate B passed 1 file / 5 tests.
- focused web Gate B visible behavior passed 1 file / 3 tests.
- web Rockwool continuity passed 5 files / 28 tests after updating the
  internal acceptance rehearsal to expect `Not ready` for flat-list
  split `Rw`.
- focused Rockwool engine continuity passed 7 files / 38 tests.
- final `pnpm calculator:gate:current` passed with engine 263 files /
  1518 tests, web 54 files / 263 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- broad validation after Gate B: lint and typecheck passed, engine full
  suite passed 396 files / 2338 tests, web full suite passed on rerun
  with 166 files / 936 passed + 18 skipped, repo build passed 5 / 5
  tasks, and final `git diff --check` passed. The first monolithic
  `pnpm check` run hit a transient timeout in
  `features/workbench/dynamic-route-deep-hybrid-swap-aac-g5.test.ts`;
  the same file passed immediately when rerun in isolation, and the
  full web suite then passed.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx` when the web build runs.
