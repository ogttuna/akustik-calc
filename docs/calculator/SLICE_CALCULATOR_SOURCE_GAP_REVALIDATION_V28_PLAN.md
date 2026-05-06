# Slice Plan - Calculator Source Gap Revalidation V28

Slice id: `calculator_source_gap_revalidation_v28`

Status: GATE A LANDED / NEXT SLICE SELECTED

Selected by:

`ubiq_open_web_packaged_finish_current_gate_guard_v1` Gate C closeout

Selection status:

`closed_ubiq_open_web_packaged_finish_current_gate_guard_selected_source_gap_revalidation_v28`

Gate A file:

`packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`

Gate A action:

`gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout`

Gate A landed status:

`selected_rockwool_split_triple_leaf_rights_safe_source_packet_refresh_after_v28_rerank_no_runtime_candidates_after_ubiq_packaged_finish`

Selected next slice:

`rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2`

Selected next file:

`packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts`

Selected next action:

`gate_a_refresh_rights_safe_rockwool_triple_leaf_source_packet_search_without_runtime`

Selected next planning surface:

`docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md`

Selected planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md`

## Supersession Notice - 2026-05-05

V28 landed and selected the Rockwool source-packet refresh based on the
then-active source-gap framing. That selected next step has since been
superseded by the model-first physics prediction pivot:

`docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`

Use this V28 plan as historical context only. The missing Rockwool/Uris
source packet still blocks measured-exact/source-validated promotion,
but it no longer blocks the next calculator work, which is to add an
airborne candidate/basis contract and formula-backed prediction path.

## Objective

Re-rank the remaining source accuracy gaps after the UBIQ packaged-finish
current-gate pack is closed. This is the next correctness step because
the source-backed UBIQ open-web packaged-finish surface is now protected
in `pnpm calculator:gate:current`, while the remaining high-value
runtime changes still need source ownership or negative-boundary proof.

V28 must not promote direct Rockwool exact runtime or generic/raw
open-web widening unless the missing source ownership requirements are
actually satisfied in the same slice.

## Inputs From Gate C

Gate C handed off these artifacts:

- `closed_ubiq_packaged_finish_current_gate_guard_summary`
- `packaged_finish_current_gate_pack_carry_forward`
- `source_gap_revalidation_v28_selected_after_ubiq_packaged_finish_closeout`
- `rockwool_and_raw_open_web_blockers_carry_forward_after_ubiq_packaged_finish_closeout`

Current-gate protected UBIQ surface:

- `90 exact` UBIQ open-web rows.
- `21 bound` UBIQ open-web rows.
- engine family-design, near-miss, and lane-trace guards.
- visible family-card, near-miss-card, history-replay, and lane-card
  guards.

## Required Gate A Work

Create:

`packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`

Gate A should:

1. Read the latest current-gate state after packaged-finish closeout.
2. Confirm `ubiq_open_web_packaged_finish_current_gate_guard_v1` is
   closed and the current-gate pack remains protected.
3. Re-rank remaining source accuracy gaps by source readiness, numeric
   correctness impact, and blocker status.
4. Keep Rockwool exact blocked while
   `rights_safe_source_owned_curve_payload_absent` remains true.
5. Keep generic/raw open-web widening blocked while
   `source_owned_raw_carrier_negative_boundary_absent` remains true.
6. Select the next bounded accuracy slice with an explicit target file,
   action, blockers, and validation scope.
7. Keep runtime behavior frozen unless Gate A identifies a source-ready
   runtime candidate with topology, material, metric, tolerance,
   negative-boundary, visible, and hostile-input ownership.

## Current Known Candidate Order

Current expected ordering before Gate A verifies implementation state:

1. source-gap revalidation after UBIQ packaged-finish closeout:
   `calculator_source_gap_revalidation_v28`.
2. direct Rockwool split/internal leaf exact runtime fix:
   blocked by `rights_safe_source_owned_curve_payload_absent`.
3. generic/raw open-web widening:
   blocked by `source_owned_raw_carrier_negative_boundary_absent`.
4. company-internal high-accuracy opening:
   blocked until remaining numeric correctness/source ownership exit
   criteria close.
5. confidence or productization cleanup:
   lower priority than source-backed numeric accuracy work.

## Gate A Landed - 2026-05-05

Gate A landed in:

`packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`

Gate A artifacts:

- `ubiq_packaged_finish_current_gate_pack_preserved_after_v28`
- `rockwool_numeric_boundaries_after_v28`
- `rockwool_rights_safe_source_packet_refresh_selected_after_v28`
- `raw_open_web_and_company_internal_blockers_carry_forward_after_v28`

Gate A selected
`rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2` because
after UBIQ packaged-finish current-gate closeout, Rockwool remains the
highest user-visible numeric correctness blocker. Direct exact runtime
still cannot move while
`rights_safe_source_owned_curve_payload_absent` remains true, so the
next bounded step is source-packet refresh and explicit acceptance or
stop criteria.

Preserved boundaries:

- UBIQ packaged-finish remains current-gate owned for `90 exact` and
  `21 bound` open-web rows.
- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs and diagnostic-only at `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains screening-only/source-blocked at `Rw 41`.
- generic/raw open-web widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`.

Validation completed on 2026-05-05: focused V28 Gate A passed
1 file / 5 tests; focused UBIQ continuity passed 7 files / 25 tests;
focused Rockwool/source-packet continuity passed 4 files / 21 tests;
final doc-contract continuity passed 4 files / 20 tests after the
validation notes were updated;
final `pnpm calculator:gate:current` passed with engine 281 files /
1587 tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
tasks, and whitespace guard green. Final `git diff --check` passed.
Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after the Next build.

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts --maxWorkers=1
```

Continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts src/ubiq-open-web-packaged-finish-family-design.test.ts src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts src/ubiq-open-web-packaged-lane-trace-matrix.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts --maxWorkers=1
```

Final gate:

```sh
pnpm calculator:gate:current
git diff --check
```
