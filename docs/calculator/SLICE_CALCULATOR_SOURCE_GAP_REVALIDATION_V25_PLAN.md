# Slice Plan - Calculator Source Gap Revalidation V25

Slice id: `calculator_source_gap_revalidation_v25`

Status: GATE A LANDED / CLOSED

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`

Gate A landed status:

`v25_fixed_adjacent_rockwool_flat_list_numeric_hold_selected_split_internal_leaf_numeric_source_closure`

## Objective

The user clarified that confidence/support wording is secondary: the
calculator must return the most correct numeric result it can defend.
V25 therefore stopped re-ranking away from Rockwool and made a runtime
numeric correction.

Gate A fixed `rockwool_adjacent_flat_list_numeric_recovery`: the
PDF-like adjacent Rockwool stack is no longer pulled into
`multileaf_screening_blend_fail_closed_until_grouped_topology` just
because nearby flat-list swaps can look multi-leaf. It now stays on the
double-leaf numeric lane:

- lab: `Rw 51`
- field: `R'w 49`, `DnT,w 51`
- strategy:
  `double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology`

## Remaining Numeric Opening

`rockwool_split_internal_leaf_remains_numeric_open`: the split/internal
gypsum-leaf stack still returns `Rw 41`, `R'w 39`, `DnT,w 40` on
`multileaf_screening_blend`. That value is not closed as correct yet.
The next slice must decide whether that internal gypsum leaf is a real
physical triple-leaf penalty requiring source/topology ownership, or a
flat-list intent ambiguity that should stop for topology input.

## Selected Next Slice

Selected next slice:

`rockwool_split_triple_leaf_numeric_source_closure_v1`

Selected next file:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`

Selected next action:

`gate_a_decide_split_internal_leaf_numeric_model_or_topology_required_stop`

## Validation

Validation completed on 2026-05-05: focused V25 passed 1 file / 4
tests; expanded engine continuity passed 21 files / 156 tests; `pnpm
calculator:gate:current` passed with engine 261 files / 1509 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green; broad `pnpm check` passed with lint/typecheck
clean, engine 394 files / 2329 tests, web 165 files / 933 passed + 18
skipped, and repo build 5 / 5 tasks. Final `git diff --check` passed.
