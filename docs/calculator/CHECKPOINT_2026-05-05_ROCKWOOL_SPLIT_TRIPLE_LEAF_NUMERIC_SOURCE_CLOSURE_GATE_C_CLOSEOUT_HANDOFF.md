# Checkpoint - 2026-05-05 - Rockwool Split Triple-Leaf Numeric Source Closure Gate C Closeout

Gate file:

`packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`

Slice closed:

`rockwool_split_triple_leaf_numeric_source_closure_v1`

Selection status:

`closed_rockwool_split_triple_leaf_numeric_source_closure_selected_source_gap_revalidation_v26`

Selected next slice:

`calculator_source_gap_revalidation_v26`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout`

Selected planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md`

## Closeout Summary

Gate C closes the Rockwool split numeric closure slice without another
runtime retune.

Required closeout artifacts:

- `rockwool_split_numeric_closure_gate_c_summary`
- `flat_list_split_output_withhold_carry_forward`
- `adjacent_rockwool_51_49_51_carry_forward`
- `grouped_rockwool_screening_source_blocker_status`
- `remaining_accuracy_gap_order_after_rockwool_closeout`
- `selected_gate_a_source_gap_revalidation_v26_with_target_file`

## Protected Boundaries

Flat-list split/internal gypsum-leaf Rockwool stacks still calculate
the diagnostic `Rw 41 / R'w 39 / DnT,w 40`, but requested wall airborne
outputs remain withheld from `supportedTargetOutputs` and appear under
`unsupportedTargetOutputs` until grouped topology or a source-owned
calibrated model exists.

Adjacent Rockwool remains corrected and supported at
`Rw 51 / R'w 49 / DnT,w 51`.

Grouped Rockwool remains live screening-only/source-blocked at `Rw 41`.
It is not exact, not source-validated, and not design-grade.

Gate C does not create source-owned Rockwool evidence, does not import
Uris/NRC/Ballagh into runtime, and does not open company-internal
high-accuracy use.

Frozen surfaces for Gate C: runtime values, support behavior,
confidence, evidence, API behavior, route-card values, output-card
status, proposal/report values, warning copy, and workbench-input
behavior.

## Next Slice Instruction

`calculator_source_gap_revalidation_v26` must re-rank remaining
accuracy/source gaps after this closeout and select one implementable
next slice. It should prefer numeric correctness, source-owned runtime
readiness, or coverage expansion over confidence-only or productization
work.

## Validation

Required focused validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts --maxWorkers=1
```

Required final gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Validation completed on 2026-05-05:

- focused Gate C passed 1 file / 6 tests.
- final `pnpm calculator:gate:current` passed with engine 264 files /
  1524 tests, web 54 files / 263 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx` when the web build runs.
