# Checkpoint - 2026-05-05 - UBIQ Open-Web Supported-Band Current-Gate Guard Gate C Closeout

Gate file:

`packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Slice closed:

`ubiq_open_web_supported_band_current_gate_guard_v1`

Selection status:

`closed_ubiq_open_web_supported_band_current_gate_guard_selected_source_gap_revalidation_v27`

Selected next slice:

`calculator_source_gap_revalidation_v27`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout`

Selected planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md`

## Closeout Summary

Gate C closes the UBIQ supported-band current-gate guard no-runtime and
selects source-gap revalidation V27 before any generic open-web or
Rockwool exact runtime promotion.

Required artifacts:

- `closed_ubiq_supported_band_current_gate_guard_summary`
- `supported_band_current_gate_pack_carry_forward`
- `source_gap_revalidation_v27_selected_after_ubiq_supported_band_closeout`
- `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_closeout`

The supported-band current-gate pack remains in
`pnpm calculator:gate:current`:

- `src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
- `src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-supported-band-finish-completion.test.ts`
- `src/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`

## Source-Gap Revalidation V27 Selection

Selected artifact:

`source_gap_revalidation_v27_selected_after_ubiq_supported_band_closeout`

Reason:

UBIQ FL-23/25/27 exact/fail-closed and FL-24/26/28 exact/bound
surfaces are now current-gate owned. The next correctness step is a
fresh source-gap re-rank before selecting any generic/raw open-web
widening, direct Rockwool exact runtime promotion, or company-internal
high-accuracy opening.

## Rockwool Carry-Forward

`rockwool_blockers_still_carry_forward_after_ubiq_supported_band_closeout`
keeps the Rockwool boundary unchanged:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41` screening-only.
- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

## Frozen Surfaces

Gate C changes no calculator runtime behavior. Runtime values, source
rows, support semantics, confidence, evidence promotion, API shape,
route-card values, output-card statuses, proposal/report copy, and
workbench input behavior stay unchanged.

## Validation

Required focused validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts --maxWorkers=1
```

Required final gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Validation completed on 2026-05-05:

- focused supported-band Gate C closeout passed 1 file / 5 tests.
- focused UBIQ continuity passed: engine 7 files / 27 tests and web
  3 files / 5 tests.
- final `pnpm calculator:gate:current` passed with engine 274 files /
  1562 tests, web 57 files / 268 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx` when the web build runs. The Next build
rewrote `apps/web/next-env.d.ts`; it was restored to the repo's
`.next-typecheck` reference after validation.
