# Checkpoint - Rockwool Triple-Leaf Explicit Screening-Only Policy Gate A

Date: 2026-05-05

Slice id:

`rockwool_triple_leaf_explicit_screening_only_policy_v1`

Landed status:

`gate_a_inventoried_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_visible_gate_b`

Landed action:

`gate_a_inventory_rockwool_triple_leaf_screening_only_policy_after_v23_rerank`

Landed file:

`packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts`

Selected next action:

`gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy`

Selected next file:

`apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts`

Selected next file status:

Landed by Gate B in
`apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts`.

## What Landed

Gate A landed no-runtime. Runtime values, support, confidence,
evidence, API behavior, route-card values, output-card status,
proposal/report values, and workbench-input behavior stayed frozen.

Gate A artifacts:

- `rockwool_triple_leaf_screening_surface_inventory`
- `grouped_rw41_and_flat_rw42_runtime_freeze`
- `visible_route_output_report_policy_gap`
- `rockwool_visible_gate_b_selected`
- `source_promotion_hostile_input_carry_forward`
- `pre_company_internal_use_exit_criteria`

## Findings

- Grouped split-rockwool remains `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only, not
  exact, and not source-validated.
- Flat-list adjacent swaps remain `Rw 42` on
  `multileaf_screening_blend_fail_closed_until_grouped_topology`.
- Field `R'w 34` and `DnT,w 36` remain continuations from the screening
  lane, not design-grade field results.
- Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
- Engine and route-card surfaces are guarded, but output-card/report
  surfaces can still show generic live/screening copy without a
  Rockwool-specific screening-only label.
- Gate A selected visible Gate B to pin Rockwool-specific output-card
  and proposal/report wording before company-internal high-accuracy
  opening.

## Next Step

Implement:

`apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts`

Gate B should pin visible output-card and proposal/report wording so
`Rw 41`, field continuations, and generated report coverage cannot look
exact, source-validated, or design-grade for the Rockwool triple-leaf
screening lane.

## Validation

Validation completed on 2026-05-05:

- focused Gate A passed 1 file / 6 tests;
- engine continuity passed 5 files / 29 tests;
- web visible continuity passed 3 files / 16 tests;
- `pnpm calculator:gate:current` passed with engine 249 files / 1442
  tests, web 52 files / 252 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- final `git diff --check` was green after restoring
  `apps/web/next-env.d.ts` to `.next-typecheck`.

Broad `pnpm check` was not run because Gate A made no runtime, visible,
API, shared-schema, route/report, or workbench-input behavior change.
Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

Focused command:

```sh
pnpm --filter @dynecho/engine exec vitest run src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts --maxWorkers=1
```

Continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts --maxWorkers=1
```

Visible continuity:

```sh
pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts --maxWorkers=1
```

Current gate:

```sh
pnpm calculator:gate:current
```

Whitespace:

```sh
git diff --check
```
