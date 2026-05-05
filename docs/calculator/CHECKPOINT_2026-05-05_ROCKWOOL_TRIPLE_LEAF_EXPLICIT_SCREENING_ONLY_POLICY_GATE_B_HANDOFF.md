# Checkpoint - Rockwool Triple-Leaf Explicit Screening-Only Policy Gate B

Date: 2026-05-05

Slice id:

`rockwool_triple_leaf_explicit_screening_only_policy_v1`

Landed status:

`gate_b_pinned_visible_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_gate_c_closeout`

Landed action:

`gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy`

Landed file:

`apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts`

Selected next action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Selected next file:

`packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts`

Selected next file status:

Intentionally absent until the next implementation step.

## What Landed

Gate B is visible-copy only. Runtime values, support, confidence,
evidence, API behavior, route-card values, output-card status,
proposal/report values, and workbench-input behavior stayed frozen.

Gate B artifacts:

- `visible_rockwool_screening_only_policy_guard`
- `rockwool_output_card_screening_only_copy`
- `rockwool_proposal_report_screening_only_copy`
- `rockwool_field_continuation_screening_bridge`
- `rockwool_non_target_boundary_copy_guard`
- `selected_gate_c_closeout_or_next_slice_with_target_file`

## Findings

- Grouped split-rockwool remains `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only, not
  exact, and not source-validated.
- The visible output card and proposal/report coverage now carry the
  `Rockwool screening-only` label and state that grouped Rockwool
  triple-leaf is not exact, not source-validated, and not design-grade.
- Flat-list adjacent swaps remain `Rw 42` on
  `multileaf_screening_blend_fail_closed_until_grouped_topology`; the
  visible copy says grouped topology is required before exact,
  source-validated, or design-grade use.
- Field `R'w 34` and `DnT,w 36` remain continuations from the Rockwool
  screening lane, not independent measured field or design-grade
  results.
- Non-target Rockwool double-leaf rows keep the existing generic
  airborne screening copy and are not pulled into the triple-leaf
  policy.
- Uris 2006 remains `paused_waiting_rights_safe_source_packet`.

## Next Step

Implement:

`packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts`

Gate C should close the no-runtime policy slice, select the next
source/hostile-input readiness slice, and keep the following blockers
explicit:

- source promotion still requires topology, material mapping, metric
  context, tolerance, negative boundaries, and paired visible tests;
- hostile API/import payloads must remain fail-closed;
- company-internal high-accuracy opening is still blocked until final
  `pnpm calculator:gate:current` and broad `pnpm check` are green at
  the opening handoff.

## Validation

Validation completed on 2026-05-05:

- focused Gate B passed 1 file / 7 tests;
- web visible continuity passed 5 files / 31 tests;
- engine continuity passed 5 files / 29 tests;
- `pnpm calculator:gate:current` passed with engine 249 files / 1442
  tests, web 53 files / 259 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- broad `pnpm check` passed with lint/typecheck clean, engine 382 files
  / 2262 tests, web 165 files / 932 passed + 18 skipped, and repo build
  5 / 5 tasks;
- final `git diff --check` was green after restoring
  `apps/web/next-env.d.ts` to `.next-typecheck`.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

Focused command:

```sh
pnpm --filter @dynecho/web exec vitest run features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts --maxWorkers=1
```

Engine continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts --maxWorkers=1
```

Visible continuity:

```sh
pnpm --filter @dynecho/web exec vitest run features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts --maxWorkers=1
```

Final gates:

```sh
pnpm calculator:gate:current
pnpm check
git diff --check
```
