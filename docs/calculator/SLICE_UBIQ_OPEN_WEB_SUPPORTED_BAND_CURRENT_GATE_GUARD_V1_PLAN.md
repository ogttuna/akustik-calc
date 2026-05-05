# Slice Plan - UBIQ Open-Web Supported-Band Current-Gate Guard V1

Slice id: `ubiq_open_web_supported_band_current_gate_guard_v1`

Status: GATE C CLOSED / NEXT SLICE SELECTED

Selected by:

`ubiq_open_web_weak_band_current_gate_guard_v1` Gate C closeout

Selection status:

`closed_ubiq_open_web_weak_band_current_gate_guard_selected_supported_band_current_gate_guard`

Gate A file:

`packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`

Gate A action:

`gate_a_promote_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate`

Gate A selection status:

`gate_a_promoted_ubiq_supported_band_exact_and_bound_guards_into_current_gate_selected_closeout`

Selected closeout file:

`packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Selected closeout action:

`gate_c_closeout_ubiq_open_web_supported_band_current_gate_guard_and_select_next_accuracy_slice`

Selected planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

## Objective

Promote the already implemented UBIQ FL-24/26/28 supported-band exact
and bound guard pack into current-gate ownership.

This is a source-backed correctness guard, not a confidence or
productization pass. It protects the UBIQ supported resilient-band
open-web surface:

- bare and timber supported-band rows stay exact with published `Rw`,
  `Ln,w`, and `Ln,w+CI`.
- carpet + foam-underlay supported-band rows stay bound-only where the
  source publishes `Ln,w+CI <= 45`; `Ln,w` must not be fabricated.
- generic open-web family widening must stay blocked until exact and
  bound UBIQ negative boundaries are current-gate owned.

## Source-Backed Facts

Selected artifact:

`ubiq_supported_band_source_ready_next`

Source URL:

`https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`

Existing guard surface:

- `packages/engine/src/ubiq-open-web-supported-band-finish-completion.test.ts`
- `packages/engine/src/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `apps/web/features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `packages/engine/src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
- `apps/web/features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`

Expected source facts:

- 36 exact FL-24/26/28 bare/timber supported-band rows.
- 18 FL-24/26/28 carpet bound rows.
- representative FL-28 bare exact stack:
  `ubiq_fl28_open_web_steel_400_19mm_bare_exact_lab_2026`,
  `Rw 64`, `Ln,w 58`, `Ln,w+CI 56`.
- representative FL-28 carpet bound stack:
  `ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026`,
  `Rw 64`, `Ln,w+CI <= 45`, no exact `Ln,w`.

## Carry-Forward From Weak-Band Closeout

Required artifacts:

- `closed_ubiq_weak_band_current_gate_guard_summary`
- `weak_band_current_gate_pack_carry_forward`
- `ubiq_supported_band_source_ready_next`
- `rockwool_blockers_still_carry_forward_after_ubiq_weak_band_closeout`

Rockwool remains unchanged:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41` screening-only.
- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

## Gate A Required Work

Gate A must:

1. Create
   `packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`.
2. Add the existing supported-band engine/web exact, bound-history, and
   near-miss guards to `tools/dev/run-calculator-current-gate.ts`.
3. Prove exact bare/timber rows stay live and carpet bound rows remain
   bound-only without fabricated `Ln,w`.
4. Keep runtime values, source rows, support semantics, APIs, route-card
   values, output-card statuses, and workbench input behavior unchanged.
5. Run focused UBIQ continuity, `pnpm calculator:gate:current`, and
   `git diff --check`.

Gate A landed artifacts:

- `ubiq_supported_band_current_gate_guard_gate_a_summary`
- `current_gate_promoted_ubiq_supported_band_engine_visible_pack`
- `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_gate_a`

Current-gate promoted pack:

- `src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-supported-band-finish-completion.test.ts`
- `src/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`

Protected values:

- FL-24 bare exact:
  `ubiq_fl24_open_web_steel_300_19mm_bare_exact_lab_2026`, `Rw 61`,
  `Ln,w 62`, `Ln,w+CI 60`.
- FL-26 bare exact:
  `ubiq_fl26_open_web_steel_200_16mm_bare_exact_lab_2026`, `Rw 60`,
  `Ln,w 62`, `Ln,w+CI 61`.
- FL-28 bare exact:
  `ubiq_fl28_open_web_steel_400_19mm_bare_exact_lab_2026`, `Rw 64`,
  `Ln,w 58`, `Ln,w+CI 56`.
- FL-28 carpet bound:
  `ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026`,
  `Rw 64`, `Ln,w+CI <= 45`, no exact `Ln,w`.

## Gate C Closeout Next

Closeout must:

1. Create
   `packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`.
2. Close `ubiq_open_web_supported_band_current_gate_guard_v1` no-runtime.
3. Confirm the supported-band exact/bound guard pack remains in
   `tools/dev/run-calculator-current-gate.ts`.
4. Re-rank remaining source-backed accuracy work and select the next
   bounded slice.
5. Keep Rockwool exact runtime blocked until a rights-safe
   source-owned curve payload exists.

Gate C closeout landed:

`packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Gate C selection status:

`closed_ubiq_open_web_supported_band_current_gate_guard_selected_source_gap_revalidation_v27`

Selected next slice:

`calculator_source_gap_revalidation_v27`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout`

Selected next planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md`

Gate C artifacts:

- `closed_ubiq_supported_band_current_gate_guard_summary`
- `supported_band_current_gate_pack_carry_forward`
- `source_gap_revalidation_v27_selected_after_ubiq_supported_band_closeout`
- `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_closeout`

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts --maxWorkers=1
```

Focused continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-supported-band-finish-completion.test.ts src/ubiq-lnw-plus-ci-bound-history-guard.test.ts src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts --maxWorkers=1
```

Final gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Latest validation:

Supported-band Gate C closeout validation completed on 2026-05-05:
focused closeout passed 1 file / 5 tests; focused UBIQ continuity
passed with engine 7 files / 27 tests and web 3 files / 5 tests; final
`pnpm calculator:gate:current` passed with engine 274 files / 1562
tests, web 57 files / 268 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green. Known non-fatal `sharp/@img` warnings
remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was
restored to `.next-typecheck` after the Next build.

Prior Gate A validation completed on 2026-05-05: focused Gate A passed
1 file / 5 tests; focused continuity passed with engine 3 files /
7 tests and web 2 files / 3 tests; focused V26 + weak-band +
supported-band doc continuity pack passed 4 files / 20 tests; final
`pnpm calculator:gate:current` passed with engine 273 files / 1557
tests, web 57 files / 268 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green.
