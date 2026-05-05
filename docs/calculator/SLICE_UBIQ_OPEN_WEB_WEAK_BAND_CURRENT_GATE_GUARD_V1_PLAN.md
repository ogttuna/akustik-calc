# Slice Plan - UBIQ Open-Web Weak-Band Current-Gate Guard V1

Slice id: `ubiq_open_web_weak_band_current_gate_guard_v1`

Status: GATE C CLOSED / NEXT SLICE SELECTED

Selected by:

`calculator_source_gap_revalidation_v26` Gate A

Selection status:

`selected_ubiq_open_web_weak_band_current_gate_guard_after_v26_rerank_preserved_rockwool_blockers_and_found_source_backed_floor_exact_guard_gap`

Selected first file:

`packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`

Selected first action:

`gate_a_promote_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate`

Selected planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

Gate A file:

`packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`

Gate A selection status:

`gate_a_promoted_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate_selected_closeout`

Selected closeout file:

`packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Selected closeout action:

`gate_c_closeout_ubiq_open_web_weak_band_current_gate_guard_and_select_next_accuracy_slice`

Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md`

Gate C closeout file:

`packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Gate C closeout status:

`closed_ubiq_open_web_weak_band_current_gate_guard_selected_supported_band_current_gate_guard`

Selected next slice:

`ubiq_open_web_supported_band_current_gate_guard_v1`

Selected next file:

`packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_promote_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate`

Selected next planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

## Objective

Promote the already source-backed UBIQ FL-23/25/27 open-web weak-band
exact and fail-closed guards into the current calculator gate.

This is a correctness and coverage guard, not a confidence or copy-only
pass. It protects two user-relevant floor outcomes:

- exact lower-board UBIQ stacks must stay live on their published
  `Rw`, `Ln,w`, `Ln,w+CI`, `R'w`, `DnT,w`, `L'n,w`, and `L'nT,w`
  values.
- upper-only open-web weak-band stacks must not borrow nearby family
  impact ratings; impact outputs stay fail-closed until the source
  lower-board topology is present.

## Source-Backed Facts

`selected_ubiq_open_web_weak_band_current_gate_guard` is selected
because FL-23/25/27 already have a rights-safe source URL and exact
catalog rows:

`https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`

Existing surfaces to promote into the current gate:

- `packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`
- `packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts`
- `apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`

Expected exact-row facts:

- 54 exact UBIQ weak-band rows across FL-23/25/27.
- no bound/family-estimate fallback for these weak-band correction rows.
- representative FL-23 exact lower-board stack: `Rw 51`, `Ln,w 71`,
  `Ln,w+CI 70`, field `R'w 72`, `DnT,w 74`, `L'n,w 73`,
  `L'nT,w 70.6`.
- representative FL-23 upper-only stack: live airborne `Rw 73`, but
  `Ln,w`, `Ln,w+CI`, and field impact outputs remain unsupported or
  need input.

## Carry-Forward From V26

Required artifacts:

- `remaining_accuracy_gap_order_after_rockwool_closeout`
- `rockwool_source_blockers_carry_forward_after_v26`
- `selected_ubiq_open_web_weak_band_current_gate_guard`

Rockwool carry-forward remains unchanged:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported target outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41` screening-only on
  `multileaf_screening_blend`.
- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

## Gate A Required Work

Gate A must:

1. Create
   `packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`.
2. Add the existing UBIQ weak-band engine and web guards to
   `tools/dev/run-calculator-current-gate.ts`.
3. Prove exact lower-board rows stay live and upper-only weak-band
   impact outputs stay fail-closed.
4. Keep runtime values, source rows, support semantics, APIs, route-card
   values, output-card statuses, and workbench input behavior unchanged.
5. Select closeout or the next source-gap revalidation only after the
   focused UBIQ pack and `pnpm calculator:gate:current` pass.

Gate A landed the current-gate promotion with:

- `ubiq_weak_band_current_gate_guard_gate_a_summary`
- `current_gate_promoted_ubiq_weak_band_engine_visible_pack`
- `rockwool_source_blockers_carry_forward_after_ubiq_gate_a`

Current-gate pack now includes:

- `src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`
- `src/ubiq-open-web-weaker-band-posture-guard.test.ts`
- `features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts --maxWorkers=1
```

Focused UBIQ continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-weak-band-exact-source-mapping.test.ts src/ubiq-open-web-weaker-band-posture-guard.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts --maxWorkers=1
```

Final gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Validation completed on 2026-05-05:

- focused UBIQ Gate A passed 1 file / 5 tests.
- focused UBIQ continuity passed: engine 2 files / 6 tests and web
  1 file / 2 tests.
- final `pnpm calculator:gate:current` passed with engine 268 files /
  1540 tests, web 55 files / 265 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- final `git diff --check` passed.

Gate C landed no-runtime with:

- `closed_ubiq_weak_band_current_gate_guard_summary`
- `weak_band_current_gate_pack_carry_forward`
- `ubiq_supported_band_source_ready_next`
- `rockwool_blockers_still_carry_forward_after_ubiq_weak_band_closeout`

It selected `ubiq_open_web_supported_band_current_gate_guard_v1` because
FL-24/26/28 have 36 source-owned exact bare/timber rows and 18 carpet
bound rows that should be current-gate owned before any generic
open-web widening.
