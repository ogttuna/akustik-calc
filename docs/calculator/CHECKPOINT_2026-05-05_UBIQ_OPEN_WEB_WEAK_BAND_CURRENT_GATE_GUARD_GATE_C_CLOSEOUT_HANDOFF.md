# Checkpoint - 2026-05-05 - UBIQ Open-Web Weak-Band Current-Gate Guard Gate C Closeout

Gate file:

`packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Slice closed:

`ubiq_open_web_weak_band_current_gate_guard_v1`

Selection status:

`closed_ubiq_open_web_weak_band_current_gate_guard_selected_supported_band_current_gate_guard`

Selected next slice:

`ubiq_open_web_supported_band_current_gate_guard_v1`

Selected next file:

`packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_promote_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate`

Selected planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

## Closeout Summary

Gate C closes the weak-band current-gate guard no-runtime and selects
the UBIQ supported-band current-gate guard.

Required artifacts:

- `closed_ubiq_weak_band_current_gate_guard_summary`
- `weak_band_current_gate_pack_carry_forward`
- `ubiq_supported_band_source_ready_next`
- `rockwool_blockers_still_carry_forward_after_ubiq_weak_band_closeout`

The weak-band current-gate pack remains in `pnpm calculator:gate:current`:

- `src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
- `src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`
- `src/ubiq-open-web-weaker-band-posture-guard.test.ts`
- `features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`

## Next Accuracy Work

Selected:

`ubiq_supported_band_source_ready_next`

Reason:

FL-24/26/28 already have source-owned exact bare/timber rows and
carpet bound rows. The next accuracy step is to make their exact, bound,
and visible fail-closed surfaces current-gate owned before any generic
open-web family widening.

Source facts:

- 36 exact FL-24/26/28 bare/timber supported-band rows.
- 18 carpet bound rows.
- representative exact FL-28 bare stack: `Rw 64`, `Ln,w 58`,
  `Ln,w+CI 56`.
- representative FL-28 carpet bound stack: `Rw 64`,
  `Ln,w+CI <= 45`, no exact `Ln,w`.

## Rockwool Carry-Forward

`rockwool_blockers_still_carry_forward_after_ubiq_weak_band_closeout`
keeps the Rockwool boundary unchanged:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41` screening-only.
- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

## Frozen Surfaces

Gate C changes no calculator behavior. Runtime values, source rows,
output support semantics, confidence, evidence promotion, API shape,
route-card values, output-card statuses, proposal/report copy, and
workbench input behavior stay unchanged.

## Validation

Required focused validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts --maxWorkers=1
```

Required final gate:

```sh
pnpm calculator:gate:current
git diff --check
```
