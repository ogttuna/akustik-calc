# Slice Plan - Rockwool Triple-Leaf Resolution V1

Slice id: `rockwool_triple_leaf_resolution_v1`

Status: GATE A LANDED / SELECTED SUPPORT-POSTURE FOLLOW-UP

Selected by:

`source_promotion_owner_set_readiness_guard_v1` Gate A

Selection status:

`gate_a_locked_source_promotion_owner_set_no_runtime_selected_rockwool_triple_leaf_resolution`

Selected first file:

`packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`

Selected first action:

`gate_a_decide_rockwool_triple_leaf_exact_source_or_fail_closed_path`

Gate A landed file:

`packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`

Gate A status:

`gate_a_confirmed_rockwool_triple_leaf_source_packet_absent_runtime_diagnostic_selected_support_posture`

Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A_HANDOFF.md`

Selected next slice:

`rockwool_triple_leaf_support_posture_v1`

Selected next file:

`packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`

Selected next action:

`gate_a_decide_supported_vs_unsupported_output_posture_for_source_required_rockwool`

Selected next planning surface:

`docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_GATE_A_HANDOFF.md`

Planning surface:

`docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md`

## Gate A Result - 2026-05-05

Gate A confirmed exact/source-backed Rockwool runtime is still blocked:
`rights_safe_source_owned_curve_payload_absent`. It did not retune
numeric values and did not select another generic guard chain.

Gate A landed:

- `rockwool_exact_source_packet_decision`
- `rockwool_source_required_screening_boundary`
- `rockwool_flat_list_reorder_boundary`
- `rockwool_support_posture_selected`

The grouped split-rockwool runtime warning now explicitly names the
source-required boundary:

`Grouped triple-leaf topology is present, but DynEcho still needs a source-calibrated triple-leaf solver, rights-safe source-owned curve payload, local Rockwool/material mapping, metric context owner, tolerance owner, negative boundaries, and paired visible tests before promoting this beyond the screening blend; treat it as source-required screening, not exact or design-grade.`

Current values remain grouped `Rw 41`, flat-list `Rw 42`, and field
`R'w 34` / `DnT,w 36`. These are source-required screening values, not
exact or design-grade.

The selected follow-up is
`rockwool_triple_leaf_support_posture_v1`, which must decide whether
these source-required outputs stay supported as explicit screening
outputs or become unsupported for exact/design-grade requests with a
separate screening preview.

Gate A validation completed on 2026-05-05: focused Gate A passed 1 file
/ 6 tests; engine continuity passed 9 files / 55 tests; web Rockwool
continuity passed 2 files / 14 tests; split-refactor size pin passed 1
file / 5 tests after updating `dynamic-airborne.ts` from 1829 to 1828
physical lines; final `pnpm calculator:gate:current` passed with engine
259 files / 1500 tests, web 53 files / 260 passed + 18 skipped, repo
build 5 / 5 tasks, and whitespace guard green. Broad `pnpm check`
passed after removing one unused source-promotion Gate A import: lint
and typecheck clean, engine 392 files / 2320 tests, web 165 files / 933
passed + 18 skipped, and repo build 5 / 5 tasks. Known non-fatal
`sharp/@img` warnings remain through `@turbodocx/html-to-docx`;
`apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
Next build.

Selection validation:

Focused source-promotion owner-set Gate A passed 1 file / 6 tests;
engine continuity passed 7 files / 42 tests; web continuity passed 2
files / 15 tests; `pnpm calculator:gate:current` passed with engine 258
files / 1494 tests, web 53 files / 260 passed + 18 skipped, repo build
5 / 5 tasks, and whitespace guard green; final `git diff --check`
passed after restoring `apps/web/next-env.d.ts` to `.next-typecheck`.
Broad `pnpm check` was not run because the selecting Gate A made no
runtime, visible, shared-schema, API, report/proposal, or
workbench-input behavior movement.

## Objective

Resolve the user-reported Rockwool triple-leaf defect by making an
explicit decision instead of continuing generic guard work:

1. If a rights-safe source-owned curve/source packet with complete owner
   set exists, implement an exact/source-backed runtime path with pinned
   values and paired visible tests.
2. If that source packet does not exist, make the calculator fail
   closed or remain explicitly screening-only for this combination so it
   cannot be mistaken for an exact calculation.

This slice is allowed to change runtime behavior only after Gate A
chooses a defensible path and names the validation surface. It must not
invent a better-looking number from unsupported source assumptions.

## Required Carry-Forward

The slice starts with these owner-set Gate A artifacts:

- `source_promotion_owner_set_inventory`
- `ownerless_source_promotion_blocked`
- `hostile_import_snapshot_not_evidence_carry_forward`
- `rockwool_resolution_selected_as_next_accuracy_target`

Rockwool current outputs remain:

- grouped split-rockwool triple-leaf: `Rw 41`, `STC 41`,
  `multileaf_screening_blend`, low confidence, screening-only.
- flat-list adjacent swap: `Rw 42`, `STC 42`,
  `FLAT_LIST_MULTILEAF_GUARD_STRATEGY`, low confidence, screening-only.
- building field continuation: `R'w 34`, `DnT,w 36`, low confidence,
  continuation from screening basis, not a design-grade field result.
- Uris 2006 disposition:
  `paused_waiting_rights_safe_source_packet`.

## Gate A Decision Scope

Gate A must answer these questions and select one implementation path:

1. Is there a rights-safe source-owned curve/source packet for the
   Rockwool/Uris two-cavity/triple-leaf case?
2. Does the source packet name source provenance, topology owner,
   material mapping owner, metric context owner, tolerance owner,
   negative boundaries, paired engine tests, and paired visible tests?
3. If the packet is absent, should the grouped triple-leaf result stay
   visible as screening-only, become a stronger fail-closed unsupported
   result for exact outputs, or expose a source-required diagnostic?
4. How should flat-list reorder and grouped topology behave so small
   layer edits do not create misleading confidence jumps?
5. How should field outputs inherit the screening/fail-closed basis
   without looking design-grade?

## Success Criteria

The resolution is done only when tests pin:

- grouped Rockwool triple-leaf `Rw`, `STC`, confidence, support,
  strategy, and warning/provenance behavior;
- flat-list reorder behavior and adjacent material swaps;
- field outputs `R'w` and `DnT,w` as either blocked or explicitly
  screening-derived continuations;
- visible route-card/output-card/proposal copy if runtime or visible
  semantics change;
- negative boundaries for near-source aliases, official-looking source
  locators, imported snapshots, and material substitutions;
- `pnpm calculator:gate:current` and `git diff --check`.

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts --maxWorkers=1
```

Continuity should include at least:

```sh
pnpm --filter @dynecho/engine exec vitest run src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts --maxWorkers=1
```

If Gate A selects runtime or visible behavior movement, add paired web
visible tests before closeout and run broad `pnpm check`. Known
non-fatal `sharp/@img` warnings through `@turbodocx/html-to-docx`
remain unchanged.
