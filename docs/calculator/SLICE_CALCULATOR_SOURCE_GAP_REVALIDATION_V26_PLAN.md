# Slice Plan - Calculator Source Gap Revalidation V26

Slice id: `calculator_source_gap_revalidation_v26`

Status: GATE A LANDED / NEXT SLICE SELECTED

Selected by:

`rockwool_split_triple_leaf_numeric_source_closure_v1` Gate C closeout

Selection status:

`closed_rockwool_split_triple_leaf_numeric_source_closure_selected_source_gap_revalidation_v26`

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout`

Selected planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md`

Gate A file:

`packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`

Gate A selection status:

`selected_ubiq_open_web_weak_band_current_gate_guard_after_v26_rerank_preserved_rockwool_blockers_and_found_source_backed_floor_exact_guard_gap`

Selected next slice:

`ubiq_open_web_weak_band_current_gate_guard_v1`

Selected next file:

`packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_promote_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate`

Selected next planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A_HANDOFF.md`

## Objective

Run a fresh accuracy/source-gap revalidation after the Rockwool split
numeric closure.

This is not a confidence or copy-only pass. Gate A must produce
`remaining_accuracy_gap_order_after_rockwool_closeout` and select one
bounded next slice that improves numeric correctness, source ownership,
or data-backed coverage.

## Consumed Gate C Facts

Required carry-forward artifacts:

- `rockwool_split_numeric_closure_gate_c_summary`
- `flat_list_split_output_withhold_carry_forward`
- `adjacent_rockwool_51_49_51_carry_forward`
- `grouped_rockwool_screening_source_blocker_status`
- `remaining_accuracy_gap_order_after_rockwool_closeout`
- `selected_gate_a_source_gap_revalidation_v26_with_target_file`

Rockwool split/internal gypsum-leaf flat-list stacks still calculate the
diagnostic `Rw 41 / R'w 39 / DnT,w 40`, but wall airborne outputs stay
withheld from `supportedTargetOutputs` until grouped topology or a
source-owned calibrated model exists.

Adjacent Rockwool stays corrected and supported at
`Rw 51 / R'w 49 / DnT,w 51`.

Grouped Rockwool remains live screening-only/source-blocked at `Rw 41`.
It is not exact, not source-validated, and not design-grade.

## Gate A Required Decision

Gate A must:

1. Re-rank wall and floor source/accuracy gaps after the Rockwool
   split-output closeout.
2. Explicitly reject direct Rockwool exact runtime import unless a
   rights-safe source-owned curve payload, topology owner, local
   material mapping, metric context owner, tolerance owner, negative
   boundaries, and paired engine/visible tests exist.
3. Keep repeated Uris acquisition blocked without a new authorized or
   rights-safe numeric packet.
4. Select one implementable next file and one action.
5. Prefer a runtime/data accuracy candidate over confidence-only or
   productization work.

Gate A landed this requirement with
`remaining_accuracy_gap_order_after_rockwool_closeout`,
`rockwool_source_blockers_carry_forward_after_v26`, and
`selected_ubiq_open_web_weak_band_current_gate_guard`.

The selected UBIQ FL-23/25/27 guard is source-backed now and exercises
real floor output correctness: exact lower-board stacks stay live on
their published `Rw`, `Ln,w`, `Ln,w+CI`, `R'w`, `DnT,w`, `L'n,w`, and
`L'nT,w` values, while upper-only open-web weak-band stacks keep impact
outputs fail-closed instead of borrowing nearby family values.

Rockwool exact runtime remains blocked by
`rights_safe_source_owned_curve_payload_absent`; adjacent Rockwool stays
supported at `Rw 51 / R'w 49 / DnT,w 51`, flat-list split/internal
gypsum-leaf Rockwool stays withheld from supported outputs with
diagnostic `Rw 41 / R'w 39 / DnT,w 40`, and grouped Rockwool stays
`Rw 41` screening-only on `multileaf_screening_blend`.

## Validation Plan

Focused Gate A, once created:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts --maxWorkers=1
```

Gate A must also run any continuity tests for the selected candidate and
then `pnpm calculator:gate:current` plus `git diff --check`.
