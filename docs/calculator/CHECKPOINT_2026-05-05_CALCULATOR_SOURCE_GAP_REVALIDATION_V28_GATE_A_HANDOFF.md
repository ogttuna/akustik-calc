# Checkpoint - 2026-05-05 - Calculator Source Gap Revalidation V28 Gate A

Gate file:

`packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`

Slice:

`calculator_source_gap_revalidation_v28`

Gate A landed status:

`selected_rockwool_split_triple_leaf_rights_safe_source_packet_refresh_after_v28_rerank_no_runtime_candidates_after_ubiq_packaged_finish`

Selected next slice:

`rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2`

Selected next file:

`packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts`

Selected next action:

`gate_a_refresh_rights_safe_rockwool_triple_leaf_source_packet_search_without_runtime`

Selected planning surface:

`docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md`

Supersession notice - 2026-05-05:

This checkpoint is historical. Its selected Rockwool source-packet
refresh was superseded as the active next step by
`calculator_model_first_physics_prediction_pivot_v1` after re-analysis
showed that missing source packets should block exact/source-validated
promotion only, not formula-backed calculation. Read
`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md` first for the current
decision.

## Decision

V28 re-ranked the source/accuracy backlog after UBIQ packaged-finish
current-gate closeout. It did not select a runtime fix.

The selected next bounded correctness step is a Rockwool split
triple-leaf rights-safe source-packet refresh because the user-visible
Rockwool exact issue remains the highest known numeric blocker, but the
runtime fix is still blocked by:

`rights_safe_source_owned_curve_payload_absent`

Gate A artifacts:

- `ubiq_packaged_finish_current_gate_pack_preserved_after_v28`
- `rockwool_numeric_boundaries_after_v28`
- `rockwool_rights_safe_source_packet_refresh_selected_after_v28`
- `raw_open_web_and_company_internal_blockers_carry_forward_after_v28`

## Preserved Numeric Boundaries

UBIQ packaged-finish remains current-gate owned:

- `90 exact` UBIQ open-web rows.
- `21 bound` UBIQ open-web rows.
- representative supported timber exact row remains `Rw 64`,
  `Ln,w 51`, `Ln,w+CI 49`.
- representative supported carpet bound row remains `Rw 64`,
  `Ln,w+CI <= 45`, no exact `Ln,w`.

Rockwool remains bounded:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs and diagnostic-only at `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains screening-only/source-blocked at `Rw 41`,
  not exact and not source-validated.

Generic/raw open-web widening remains blocked by:

`source_owned_raw_carrier_negative_boundary_absent`

Company-internal high-accuracy opening remains blocked until remaining
numeric correctness/source-ownership exit criteria close.

## Validation

Validation completed on 2026-05-05:

- focused V28 Gate A passed 1 file / 5 tests.
- focused UBIQ continuity passed 7 files / 25 tests.
- focused Rockwool/source-packet continuity passed 4 files / 21 tests.
- final doc-contract continuity passed 4 files / 20 tests after the
  validation notes were updated.
- `pnpm calculator:gate:current` passed with engine 281 files / 1587
  tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- `git diff --check` passed.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`. The Next build rewrote
`apps/web/next-env.d.ts`; it was restored to `.next-typecheck` after
the current-gate run.
