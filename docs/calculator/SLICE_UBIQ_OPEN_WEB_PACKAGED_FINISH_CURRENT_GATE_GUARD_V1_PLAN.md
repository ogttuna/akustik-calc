# Slice Plan - UBIQ Open-Web Packaged-Finish Current-Gate Guard V1

Slice id: `ubiq_open_web_packaged_finish_current_gate_guard_v1`

Status: GATE C CLOSED / V28 SELECTED

Selected by:

`calculator_source_gap_revalidation_v27` Gate A

Selection status:

`selected_ubiq_open_web_packaged_finish_current_gate_guard_after_v27_rerank_preserved_rockwool_and_raw_open_web_blockers`

Gate A file:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Gate A action:

`gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate`

Gate A status:

`gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate_selected_closeout`

Selected next file:

`packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_ubiq_open_web_packaged_finish_current_gate_guard_and_select_next_accuracy_slice`

Gate C status:

`closed_ubiq_open_web_packaged_finish_current_gate_guard_selected_source_gap_revalidation_v28`

Gate C file:

`packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Selected V28 file:

`packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`

Selected V28 action:

`gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout`

Selected planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md`

## Objective

Promote the existing UBIQ open-web packaged-finish engine and visible
guard pack into `pnpm calculator:gate:current`.

This is a no-runtime correctness guard slice. It does not change
published numeric values, support semantics, API shape, route-card
values, output-card statuses, proposal/report copy, or workbench input
behavior. Its job is to make the source-backed UBIQ packaged
open-web surface a permanent current-gate owner before any broader
generic/raw open-web widening is attempted.

## Source-Backed Surface

Artifact carried from V27:

`ubiq_packaged_finish_ready_surfaces_after_v27`

Existing source-backed rows:

- `90 exact` UBIQ open-web rows from
  `https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`.
- `21 bound` UBIQ open-web rows from the same source.
- representative weak-band exact carpet row:
  `ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026`,
  `Rw 55`, `Ln,w 63`, `Ln,w+CI 62`.
- representative supported-band timber exact row:
  `ubiq_fl28_open_web_steel_300_exact_lab_2026`, `Rw 64`,
  `Ln,w 51`, `Ln,w+CI 49`.
- representative supported-band carpet bound row:
  `ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026`,
  `Rw 64`, `Ln,w+CI <= 45`, no exact `Ln,w`.

Existing guard files to make current-gate owned:

- `packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts`
- `packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts`
- `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`

## Required Gate A Work

Gate A landed on 2026-05-05. The next implementation step is the Gate C
closeout file above.

Gate A must:

1. Create
   `packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`.
2. Add the existing UBIQ packaged-finish engine and web guard files to
   `tools/dev/run-calculator-current-gate.ts`.
3. Prove the guard pack protects exact family design, bound-only
   behavior, near-miss fail-closed behavior, route/card visibility, and
   saved/edit history replay.
4. Keep runtime values, support, confidence, evidence, API,
   route-card values, output-card statuses, proposal/report copy, and
   workbench-input behavior frozen.
5. Keep direct Rockwool exact runtime blocked by
   `rights_safe_source_owned_curve_payload_absent`.
6. Keep generic/raw open-web widening blocked until a later source-gap
   step names source-owned raw carrier topology, metric, tolerance, and
   negative-boundary owners.
7. Run focused UBIQ packaged-finish validation,
   `pnpm calculator:gate:current`, and `git diff --check`.

## Gate A Landed - 2026-05-05

Landed artifacts:

- `ubiq_packaged_finish_current_gate_guard_gate_a_summary`
- `current_gate_promoted_ubiq_packaged_finish_engine_visible_pack`
- `source_verified_ubiq_packaged_finish_pdf_status`
- `rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a`

Current-gate promoted pack:

- `src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-packaged-finish-family-design.test.ts`
- `src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts`
- `src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`

Gate A changes current-gate ownership only. Runtime values, source rows,
support semantics, confidence, evidence promotion, API shape,
route-card values, output-card statuses, proposal/report copy, and
workbench input behavior stay unchanged.

Gate A validation completed on 2026-05-05: focused Gate A passed
1 file / 5 tests; focused packaged-finish continuity passed with engine
4 files / 10 tests and web 4 files / 5 tests; final
`pnpm calculator:gate:current` passed with engine 279 files / 1577
tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green.

## Gate C Closeout Landed - 2026-05-05

Gate C closeout landed in:

`packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Closeout status:

`closed_ubiq_open_web_packaged_finish_current_gate_guard_selected_source_gap_revalidation_v28`

Closeout artifacts:

- `closed_ubiq_packaged_finish_current_gate_guard_summary`
- `packaged_finish_current_gate_pack_carry_forward`
- `source_gap_revalidation_v28_selected_after_ubiq_packaged_finish_closeout`
- `rockwool_and_raw_open_web_blockers_carry_forward_after_ubiq_packaged_finish_closeout`

Gate C closes this implementation slice without runtime, source-row,
support, confidence, evidence, API, route-card, output-card,
proposal/report, or workbench-input behavior changes.

Selected next slice:

`calculator_source_gap_revalidation_v28`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout`

Carry-forward blockers remain unchanged:

- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.
- generic/raw open-web widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`.

Gate C validation completed on 2026-05-05: focused Gate C closeout
passed 1 file / 5 tests; focused packaged-finish continuity passed
with engine 5 files / 15 tests and web 4 files / 5 tests; final
`pnpm calculator:gate:current` passed with engine 280 files / 1582
tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green. Final `git diff --check` passed. Known
non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after the Next build.

## Pre-Gate A Analysis Refresh - 2026-05-05

Implementation comparison:

- `packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`
  is still absent and remains the correct next file.
- the seven existing UBIQ packaged-finish engine/web guard files exist
  and passed focused continuity.
- `tools/dev/run-calculator-current-gate.ts` carries the prior UBIQ
  weak-band/supported-band current-gate pack but does not yet carry the
  packaged-finish pack as one current-gate owned surface.
- no broad-suite failure or focused UBIQ failure currently requires an
  emergency repair before Gate A.

Source check:

- the official UBIQ source PDF remains available at
  `https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`.
- Gate A is not a formula/source import; it promotes already imported
  `90 exact` and `21 bound` UBIQ open-web rows into the current gate.
- no new internet research is needed before this no-runtime guard
  promotion.

Gate A contract should name these artifacts:

- `ubiq_packaged_finish_current_gate_guard_gate_a_summary`
- `current_gate_promoted_ubiq_packaged_finish_engine_visible_pack`
- `source_verified_ubiq_packaged_finish_pdf_status`
- `rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a`

Guard-rail for the next implementer: do not use this slice to widen
generic/raw open-web, retune UBIQ numbers, or promote Rockwool exact
runtime. Rockwool exact remains blocked by
`rights_safe_source_owned_curve_payload_absent`; generic/raw open-web
widening remains blocked by
`source_owned_raw_carrier_negative_boundary_absent`.

## Carry-Forward Blockers

`rockwool_source_blockers_carry_forward_after_v27` remains active:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41`, `multileaf_screening_blend`,
  screening-only, not exact, and not source-validated.
- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

`generic_or_raw_open_web_family_widening` remains blocked by
`source_owned_raw_carrier_negative_boundary_absent`.

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts --maxWorkers=1
```

Focused continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts src/ubiq-open-web-packaged-finish-family-design.test.ts src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts src/ubiq-open-web-packaged-lane-trace-matrix.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts --maxWorkers=1
```

Final gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Selection validation:

V27 Gate A selected this slice on 2026-05-05 after confirming
`remaining_accuracy_gap_order_after_ubiq_supported_band_closeout`,
`ubiq_packaged_finish_ready_surfaces_after_v27`,
`packaged_finish_current_gate_guard_selected_after_v27`, and
`rockwool_source_blockers_carry_forward_after_v27`.
