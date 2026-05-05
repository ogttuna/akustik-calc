# Checkpoint - 2026-05-05 - Calculator Source Gap Revalidation V25 Gate A

Gate A landed:

`packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`

Landed status:

`v25_fixed_adjacent_rockwool_flat_list_numeric_hold_selected_split_internal_leaf_numeric_source_closure`

## Result

V25 changed direction after the user clarified that numeric correctness
matters more than confidence/support posture.

`rockwool_adjacent_flat_list_numeric_recovery` landed as a runtime
numeric correction. The PDF-like adjacent Rockwool stack is no longer
forced into `multileaf_screening_blend_fail_closed_until_grouped_topology`
from flat-list route sensitivity alone. It now stays on the current
double-leaf numeric lane:

- lab `Rw 51`
- field `R'w 49`
- field `DnT,w 51`
- strategy:
  `double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology`

This fixes the prior bad guarded corridor that produced approximately
`Rw 42`, `R'w 40`, and `DnT,w 41` for an adjacent Rockwool stack.

## Still Open

`rockwool_split_internal_leaf_remains_numeric_open`: the split/internal
gypsum-leaf stack still returns `Rw 41`, `R'w 39`, `DnT,w 40` through
`multileaf_screening_blend`. Gate A did not declare this value correct.
The next slice must close whether the internal gypsum layer is a real
physical triple-leaf penalty or a flat-list intent ambiguity that should
ask for grouped topology input.

## Selected Next Slice

Selected next slice:

`rockwool_split_triple_leaf_numeric_source_closure_v1`

Selected next file:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`

Selected next action:

`gate_a_decide_split_internal_leaf_numeric_model_or_topology_required_stop`

## Validation

Validation completed on 2026-05-05:

- `pnpm --filter @dynecho/engine exec vitest run src/dynamic-airborne-order-sensitivity.test.ts src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts src/company-internal-controlled-use-handoff-gate-a-contract.test.ts src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm --filter @dynecho/web exec vitest run features/workbench/dynamic-route-order-sensitivity.test.ts features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts --maxWorkers=1`
- focused V25 docs/runtime contract: 1 file / 4 tests
- expanded engine continuity after old snapshot updates: 21 files / 156 tests
- `pnpm calculator:gate:current`: engine 261 files / 1509 tests, web
  53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks,
  whitespace guard green
- `pnpm check`: lint and typecheck clean, engine full suite 394 files /
  2329 tests, web full suite 165 files / 933 passed + 18 skipped, repo
  build 5 / 5 tasks
- final `git diff --check` green after confirming
  `apps/web/next-env.d.ts` remained on `.next-typecheck`

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.
