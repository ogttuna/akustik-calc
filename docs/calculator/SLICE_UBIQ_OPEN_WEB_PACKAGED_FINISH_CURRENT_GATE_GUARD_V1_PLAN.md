# Slice Plan - UBIQ Open-Web Packaged-Finish Current-Gate Guard V1

Slice id: `ubiq_open_web_packaged_finish_current_gate_guard_v1`

Status: SELECTED / GATE A NEXT

Selected by:

`calculator_source_gap_revalidation_v27` Gate A

Selection status:

`selected_ubiq_open_web_packaged_finish_current_gate_guard_after_v27_rerank_preserved_rockwool_and_raw_open_web_blockers`

Selected first file:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Selected first action:

`gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate`

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
