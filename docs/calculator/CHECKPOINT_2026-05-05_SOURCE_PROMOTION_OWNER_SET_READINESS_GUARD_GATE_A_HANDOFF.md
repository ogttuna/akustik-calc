# Checkpoint - 2026-05-05 - Source Promotion Owner-Set Readiness Guard Gate A Handoff

Slice:

`source_promotion_owner_set_readiness_guard_v1`

Gate:

`gate_a_inventory_source_promotion_owner_set_after_v24_rerank`

Landed file:

`packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`

Landed status:

`gate_a_locked_source_promotion_owner_set_no_runtime_selected_rockwool_triple_leaf_resolution`

Selected next slice:

`rockwool_triple_leaf_resolution_v1`

Selected next file:

`packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`

Selected next action:

`gate_a_decide_rockwool_triple_leaf_exact_source_or_fail_closed_path`

Selected planning surface:

`docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md`

## Gate A Result

Gate A locked the source-promotion owner-set boundary no-runtime and did
not open another generic guard chain. It selected the user-reported
Rockwool triple-leaf defect as the next accuracy target because the
owner-set boundary is now explicit and Rockwool remains the highest
visible unresolved correctness issue.

Gate A landed these artifacts:

- `source_promotion_owner_set_inventory`
- `ownerless_source_promotion_blocked`
- `hostile_import_snapshot_not_evidence_carry_forward`
- `rockwool_resolution_selected_as_next_accuracy_target`

Runtime values, support, confidence, evidence, API shape, route-card
values, output-card status, proposal/report values, visible behavior,
and workbench-input behavior stayed frozen.

## Owner-Set Boundary

Future exact/source-backed promotion still requires the complete owner
set:

- `source_provenance`
- `topology_owner`
- `material_mapping_owner`
- `metric_context_owner`
- `tolerance_owner`
- `negative_boundaries`
- `paired_engine_tests`
- `paired_visible_tests`

Near-source aliases, official source locators, source rows without full
mapping, imported snapshots, finite copied numbers, visible copy, and
official-sounding material names remain non-promoting context unless the
full owner set is present.

## Rockwool Carry-Forward

Rockwool is still not fixed. Current outputs remain grouped `Rw 41`,
flat-list `Rw 42`, field `R'w 34` and `DnT,w 36`, low confidence,
screening-only, not exact/source-validated. Uris 2006 remains
`paused_waiting_rights_safe_source_packet`.

The next Rockwool slice must make an explicit decision:

- exact/source-backed runtime only if a rights-safe source-owned packet
  and full owner set exist;
- otherwise fail closed or stay explicitly screening-only so the user
  cannot mistake the result for an exact calculation.

## Validation

Validation completed on 2026-05-05:

- Focused source-promotion owner-set Gate A passed 1 file / 6 tests.
- Engine continuity passed 7 files / 42 tests.
- Web continuity passed 2 files / 15 tests.
- `pnpm calculator:gate:current` passed with engine 258 files / 1494
  tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- Final `git diff --check` passed after restoring
  `apps/web/next-env.d.ts` to `.next-typecheck`.

Broad `pnpm check` was not run because this Gate A made no runtime,
visible, shared-schema, API, report/proposal, or workbench-input
behavior movement. Known non-fatal `sharp/@img` warnings through
`@turbodocx/html-to-docx` remain unchanged.
