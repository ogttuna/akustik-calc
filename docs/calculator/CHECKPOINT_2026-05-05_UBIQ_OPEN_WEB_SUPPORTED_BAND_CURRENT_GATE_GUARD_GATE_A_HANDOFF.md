# Checkpoint - 2026-05-05 - UBIQ Open-Web Supported-Band Current-Gate Guard Gate A

Gate file:

`packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`

Slice:

`ubiq_open_web_supported_band_current_gate_guard_v1`

Selection status:

`gate_a_promoted_ubiq_supported_band_exact_and_bound_guards_into_current_gate_selected_closeout`

Selected next file:

`packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_ubiq_open_web_supported_band_current_gate_guard_and_select_next_accuracy_slice`

Planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

## Gate A Summary

Gate A promotes the source-backed UBIQ FL-24/26/28 supported-band exact
and bound guard pack into `pnpm calculator:gate:current` ownership.

Required artifacts:

- `ubiq_supported_band_current_gate_guard_gate_a_summary`
- `current_gate_promoted_ubiq_supported_band_engine_visible_pack`
- `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_gate_a`

Current-gate pack:

- `src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-supported-band-finish-completion.test.ts`
- `src/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`

## Protected UBIQ Behavior

Source URL:

`https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`

Pinned source facts:

- 36 exact UBIQ FL-24/26/28 bare/timber supported-band rows remain
  exact on published `Rw`, `Ln,w`, and `Ln,w+CI`.
- 18 UBIQ FL-24/26/28 carpet + foam-underlay supported-band rows remain
  bound-only on the published `Ln,w+CI <= 45` posture.
- representative FL-24 bare exact stack:
  `ubiq_fl24_open_web_steel_300_19mm_bare_exact_lab_2026`, `Rw 61`,
  `Ln,w 62`, `Ln,w+CI 60`.
- representative FL-26 bare exact stack:
  `ubiq_fl26_open_web_steel_200_16mm_bare_exact_lab_2026`, `Rw 60`,
  `Ln,w 62`, `Ln,w+CI 61`.
- representative FL-28 bare exact stack:
  `ubiq_fl28_open_web_steel_400_19mm_bare_exact_lab_2026`, `Rw 64`,
  `Ln,w 58`, `Ln,w+CI 56`.
- representative FL-28 carpet bound stack:
  `ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026`,
  `Rw 64`, `Ln,w+CI <= 45`, no exact `Ln,w`.
- supported-band carpet near misses remain impact-fail-closed instead
  of borrowing `Ln,w` or `Ln,w+CI` from nearby source rows.

## Rockwool Carry-Forward

`rockwool_blockers_still_carry_forward_after_ubiq_supported_band_gate_a`
keeps the Rockwool boundary unchanged:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41` screening-only.
- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

## Frozen Surfaces

Gate A changes current-gate ownership only. Runtime values, source rows,
support semantics, confidence, evidence promotion, API shape,
route-card values, output-card statuses, proposal/report copy, and
workbench input behavior stay unchanged.

## Validation

Required focused validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts --maxWorkers=1
```

Required continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-supported-band-finish-completion.test.ts src/ubiq-lnw-plus-ci-bound-history-guard.test.ts src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts --maxWorkers=1
```

Required final gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Validation completed on 2026-05-05:

- focused supported-band Gate A passed 1 file / 5 tests.
- focused supported-band continuity passed: engine 3 files / 7 tests
  and web 2 files / 3 tests.
- focused V26 + weak-band + supported-band doc continuity pack passed
  4 files / 20 tests after restoring prior carry-forward strings in
  `docs/calculator/CURRENT_STATE.md`.
- final `pnpm calculator:gate:current` passed with engine 273 files /
  1557 tests, web 57 files / 268 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx` when the web build runs. The Next build
rewrote `apps/web/next-env.d.ts`; it was restored to the repo's
`.next-typecheck` reference after validation.
