# Checkpoint - 2026-05-05 - Calculator Source Gap Revalidation V27 Gate A

Gate file:

`packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`

Slice landed:

`calculator_source_gap_revalidation_v27`

Selection status:

`selected_ubiq_open_web_packaged_finish_current_gate_guard_after_v27_rerank_preserved_rockwool_and_raw_open_web_blockers`

Selected next slice:

`ubiq_open_web_packaged_finish_current_gate_guard_v1`

Selected next file:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate`

Selected planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md`

## Gate A Summary

V27 Gate A re-ranked the source/accuracy gap order after UBIQ
weak-band and supported-band open-web rows became current-gate owned.
It selected the UBIQ open-web packaged-finish current-gate guard as the
next bounded correctness step.

This is no-runtime. Runtime values, source rows, support semantics,
confidence, evidence promotion, API shape, route-card values,
output-card statuses, proposal/report copy, and workbench input
behavior stayed unchanged.

Required artifacts:

- `remaining_accuracy_gap_order_after_ubiq_supported_band_closeout`
- `ubiq_packaged_finish_ready_surfaces_after_v27`
- `packaged_finish_current_gate_guard_selected_after_v27`
- `rockwool_source_blockers_carry_forward_after_v27`

## Selected UBIQ Packaged-Finish Guard

`ubiq_packaged_finish_ready_surfaces_after_v27` records the existing
source-backed surface:

- `90 exact` UBIQ open-web rows from
  `https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`.
- `21 bound` UBIQ open-web rows from the same source.
- engine family-design guard:
  `packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts`.
- engine near-miss guard:
  `packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts`.
- engine packaged-lane trace guard:
  `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`.
- visible family-card guard:
  `apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts`.
- visible near-miss-card guard:
  `apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts`.
- visible history replay guard:
  `apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`.
- visible packaged-lane card guard:
  `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`.

`packaged_finish_current_gate_guard_selected_after_v27` is selected
because those exact/bound/near-miss/history/visible guards are already
source-backed and calculation-relevant, but they need one current-gate
owner before broader open-web coverage claims.

## Blockers Preserved

`rockwool_source_blockers_carry_forward_after_v27` remains active:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41`, `multileaf_screening_blend`,
  screening-only, not exact, and not source-validated.
- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

Generic/raw open-web widening remains blocked by
`source_owned_raw_carrier_negative_boundary_absent`.

## Validation

Required focused validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts --maxWorkers=1
```

Required final gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Validation completed on 2026-05-05:

- focused V27 Gate A passed 1 file / 5 tests.
- focused UBIQ packaged-finish engine continuity passed 5 files / 15
  tests.
- focused UBIQ packaged-finish visible continuity passed 4 files / 5
  tests.
- final `pnpm calculator:gate:current` passed with engine 275 files /
  1567 tests, web 57 files / 268 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx` when the web build runs. The Next build
rewrote `apps/web/next-env.d.ts`; it was restored to the repo's
`.next-typecheck` reference after validation.
