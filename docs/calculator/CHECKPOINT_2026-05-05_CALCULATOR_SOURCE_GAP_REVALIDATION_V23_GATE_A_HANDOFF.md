# Checkpoint - Calculator Source Gap Revalidation V23 Gate A

Date: 2026-05-05

Slice id:

`calculator_source_gap_revalidation_v23`

Landed status:

`selected_rockwool_triple_leaf_explicit_screening_only_policy_after_v23_confirmed_uris_source_blocked_and_field_output_owner_closed`

Landed action:

`gate_a_revalidate_source_accuracy_gap_order_after_field_output_owner_policy_closeout`

Landed file:

`packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts`

Selected next slice:

`rockwool_triple_leaf_explicit_screening_only_policy_v1`

Selected next action:

`gate_a_inventory_rockwool_triple_leaf_screening_only_policy_after_v23_rerank`

Selected next file:

`packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md`

Selected next file status:

Landed by
`rockwool_triple_leaf_explicit_screening_only_policy_v1` Gate A on
2026-05-05. See
`docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_A_HANDOFF.md`.

## What Landed

V23 Gate A landed no-runtime. Runtime values, support, confidence,
evidence, API behavior, route-card values, output-card status,
proposal/report values, and workbench-input behavior stayed frozen.

Gate A artifacts:

- `field_output_owner_policy_gate_c_closeout_summary`
- `rockwool_uris_exact_runtime_still_blocked`
- `rockwool_explicit_screening_only_policy_selected`
- `source_promotion_and_hostile_input_ownership_carry_forward`
- `repeat_uris_acquisition_blocked_without_new_packet`
- `pre_company_internal_use_exit_criteria`

## Findings

- Field-output owner policy is consumed as a closed visibility/honesty
  prerequisite, not as Rockwool/Uris source evidence.
- Direct Rockwool/Uris exact runtime promotion remains blocked by the
  missing rights-safe source-owned curve payload, local material mapping,
  metric context, tolerance owner, source-curve provenance, and complete
  negative-boundary / paired visible tests.
- Grouped split-rockwool remains `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only, not
  exact, and not source-validated.
- Flat-list adjacent swaps remain fail-closed until grouped topology is
  supplied.
- V23 selected the bounded no-runtime Rockwool explicit screening-only
  policy slice because company-internal opening requires Rockwool to be
  exact or explicitly screening-only before higher-trust private use.

## Next Step

Implement:

`packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts`

The next gate should inventory engine, route-card, output-card,
proposal/report, and workbench-visible Rockwool triple-leaf screening
posture. It should only select a visible wording Gate B if it finds a
concrete surface where `Rw 41` can still look exact or design-grade.

## Validation

Validation completed on 2026-05-05:

- focused V23 passed 1 file / 7 tests;
- engine continuity passed 6 files / 36 tests;
- web visible continuity passed 3 files / 16 tests;
- `pnpm calculator:gate:current` passed with engine 248 files / 1436
  tests, web 52 files / 252 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- final `git diff --check` was green after restoring
  `apps/web/next-env.d.ts` to `.next-typecheck`.

Broad `pnpm check` was not run because V23 made no runtime, visible,
API, shared-schema, route/report, or workbench-input behavior change.
Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

Focused command:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts --maxWorkers=1
```

Current gate:

```sh
pnpm calculator:gate:current
```

Whitespace:

```sh
git diff --check
```
