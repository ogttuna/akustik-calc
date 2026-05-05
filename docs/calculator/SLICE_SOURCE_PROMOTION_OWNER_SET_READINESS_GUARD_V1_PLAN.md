# Slice Plan - Source Promotion Owner-Set Readiness Guard V1

Slice id: `source_promotion_owner_set_readiness_guard_v1`

Status: GATE A LANDED / ROCKWOOL RESOLUTION SELECTED

Selected by:

`calculator_source_gap_revalidation_v24` Gate A

Selection status:

`selected_source_promotion_owner_set_readiness_guard_after_v24_confirmed_rockwool_uris_blocked_and_controlled_use_handoff_closed`

Selected first file:

`packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`

Selected first action:

`gate_a_inventory_source_promotion_owner_set_after_v24_rerank`

Landed Gate A file:

`packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`

Landed Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_GATE_A_HANDOFF.md`

Landed Gate A status:

`gate_a_locked_source_promotion_owner_set_no_runtime_selected_rockwool_triple_leaf_resolution`

Selected next slice:

`rockwool_triple_leaf_resolution_v1`

Selected next file:

`packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`

Selected next action:

`gate_a_decide_rockwool_triple_leaf_exact_source_or_fail_closed_path`

Selected next planning surface:

`docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A_HANDOFF.md`

Planning surface:

`docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md`

Selection validation:

Focused V24 Gate A passed 1 file / 7 tests; engine continuity passed 8
files / 47 tests; web visible frequent-combination continuity passed 1
file / 8 tests; `pnpm calculator:gate:current` passed with engine 257
files / 1488 tests, web 53 files / 260 passed + 18 skipped, repo build
5 / 5 tasks, and whitespace guard green; final `git diff --check`
passed after restoring `apps/web/next-env.d.ts` to `.next-typecheck`.
Broad `pnpm check` was not run because V24 Gate A made no runtime,
visible, shared-schema, API, report/proposal, or workbench-input
behavior movement.

## Objective

Prevent near-source aliases, source rows, source locator metadata, import
snapshots, or official-sounding material names from becoming runtime
evidence unless the complete source-promotion owner set exists.

This is a no-runtime guard slice. It should make the promotion boundary
auditable before any future exact/source-backed value is allowed to move.
The guard exists because V24 confirmed the highest visible Rockwool/Uris
defect is still not runtime-actionable: the rights-safe source-owned
curve payload and local owner set are absent. The next highest actionable
accuracy work is therefore preventing false promotion from source-like
metadata while exact source packets remain blocked.

## Required Carry-Forward

The slice starts with these V24 artifacts:

- `controlled_use_handoff_gate_c_closeout_consumed`
- `rockwool_uris_exact_runtime_still_blocked_after_controlled_use`
- `source_promotion_owner_set_guard_selected`
- `hostile_api_import_and_frequent_combination_green_carry_forward`
- `field_outputs_non_design_grade_carry_forward`

Rockwool remains screening-only: grouped split-rockwool `Rw 41`,
flat-list adjacent swap `Rw 42`, field `R'w 34` and `DnT,w 36`, low
confidence, not exact, and not source-validated. Uris 2006 remains
`paused_waiting_rights_safe_source_packet`.

Field outputs remain continuations from the active lab/screening/
apparent/bound basis. They are not independent design-grade field
measurements without a future field-output owner set and source basis.

## Owner Set Required For Any Promotion

Any future exact/source-backed runtime promotion must name and test all
of these owners together:

- `source_provenance`
- `topology_owner`
- `material_mapping_owner`
- `metric_context_owner`
- `tolerance_owner`
- `negative_boundaries`
- `paired_engine_tests`
- `paired_visible_tests`

Partial ownership is not enough. A source row without topology, a source
locator without current rights-safe data, a material alias without local
mapping, or a finite imported number without provenance must stay
context-only.

## Gate A Result

Gate A landed no-runtime and added
`source_promotion_owner_set_inventory`,
`ownerless_source_promotion_blocked`,
`hostile_import_snapshot_not_evidence_carry_forward`, and
`rockwool_resolution_selected_as_next_accuracy_target`.

The owner-set boundary is now locked: source-like names, near-source
aliases, source locators, imported snapshots, finite copied numbers, and
visible copy cannot promote runtime evidence without the complete owner
set. Gate A intentionally did not open another generic guard chain. It
selected `rockwool_triple_leaf_resolution_v1` because Rockwool remains
the highest visible unresolved correctness issue after the owner-set
boundary is explicit.

Runtime values, support, confidence, evidence, API shape, route-card
values, output-card status, proposal/report values, visible behavior,
and workbench-input behavior stayed frozen.

Gate A validation completed on 2026-05-05: focused source-promotion
owner-set Gate A passed 1 file / 6 tests; engine continuity passed 7
files / 42 tests; web continuity passed 2 files / 15 tests; `pnpm
calculator:gate:current` passed with engine 258 files / 1494 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green; final `git diff --check` passed after restoring
`apps/web/next-env.d.ts` to `.next-typecheck`. Broad `pnpm check` was
not run because Gate A made no runtime, visible, shared-schema, API,
report/proposal, or workbench-input behavior movement.

## Gate A Plan

1. Create
   `packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`.
2. Inventory source-promotion surfaces for exact catalog rows,
   near-source aliases, source locator metadata, imported snapshots,
   material aliases, and visible route/output/report claims.
3. Classify each surface as exact-source-ready, context-only,
   screening-only, fail-closed, or blocked.
4. Assert that promotion requires the complete owner set: provenance,
   topology, material mapping, metric context, tolerance, negative
   boundaries, paired engine tests, and paired visible tests.
5. Keep runtime values, support, confidence, evidence, API shape,
   route-card values, output-card status, proposal/report values, and
   workbench-input behavior frozen.
6. Select a closeout or implementation file only if Gate A identifies a
   bounded owner-set gap that can be fixed without source-data
   invention.

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts --maxWorkers=1
```

Continuity should include at least:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts --maxWorkers=1
```

Then run:

```sh
pnpm calculator:gate:current
git diff --check
```

Use broad `pnpm check` if this slice moves runtime behavior, visible
behavior, shared schemas, API contracts, report/proposal wording, or
workbench input behavior. Known non-fatal `sharp/@img` warnings through
`@turbodocx/html-to-docx` remain unchanged.
