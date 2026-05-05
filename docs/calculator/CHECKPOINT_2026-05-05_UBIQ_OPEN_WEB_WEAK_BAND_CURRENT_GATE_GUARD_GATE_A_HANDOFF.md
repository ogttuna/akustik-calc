# Checkpoint - 2026-05-05 - UBIQ Open-Web Weak-Band Current-Gate Guard Gate A

Gate file:

`packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`

Slice:

`ubiq_open_web_weak_band_current_gate_guard_v1`

Selection status:

`gate_a_promoted_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate_selected_closeout`

Selected next file:

`packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_ubiq_open_web_weak_band_current_gate_guard_and_select_next_accuracy_slice`

Planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

## Gate A Summary

Gate A promotes the source-backed UBIQ FL-23/25/27 weak-band exact and
fail-closed guard pack into `pnpm calculator:gate:current` ownership.

Required artifacts:

- `ubiq_weak_band_current_gate_guard_gate_a_summary`
- `current_gate_promoted_ubiq_weak_band_engine_visible_pack`
- `rockwool_source_blockers_carry_forward_after_ubiq_gate_a`

Current-gate pack:

- `src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`
- `src/ubiq-open-web-weaker-band-posture-guard.test.ts`
- `features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`

## Protected UBIQ Behavior

Source URL:

`https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`

Pinned source facts:

- 54 exact UBIQ weak-band rows remain exact-only.
- FL-23 exact lower-board stack: `Rw 51`, `Ln,w 71`,
  `Ln,w+CI 70`, field `R'w 72`, `DnT,w 74`, `L'n,w 73`,
  `L'nT,w 70.6`.
- FL-25 exact lower-board stack: `Rw 52`, `Ln,w 71`,
  `Ln,w+CI 70`, field `R'w 72`, `DnT,w 74`, `L'n,w 73`,
  `L'nT,w 70.6`.
- FL-27 exact lower-board stack: `Rw 55`, `Ln,w 63`,
  `Ln,w+CI 62`, field `R'w 74`, `DnT,w 77`, `L'n,w 65`,
  `L'nT,w 62.6`.
- upper-only FL-23/25/27 open-web weak-band stacks keep impact outputs
  unsupported or needing input instead of borrowing nearby family impact
  ratings.

## Rockwool Carry-Forward

`rockwool_source_blockers_carry_forward_after_ubiq_gate_a` keeps the
Rockwool boundary unchanged:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41` screening-only.
- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

## Frozen Surfaces

Gate A changes current-gate ownership only. Runtime values, source rows,
output support semantics, confidence, evidence promotion, API shape,
route-card values, output-card statuses, proposal/report copy, and
workbench input behavior stay unchanged.

## Validation

Required focused validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts --maxWorkers=1
```

Required continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-weak-band-exact-source-mapping.test.ts src/ubiq-open-web-weaker-band-posture-guard.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts --maxWorkers=1
```

Required final gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Validation completed on 2026-05-05:

- focused UBIQ Gate A passed 1 file / 5 tests.
- focused UBIQ continuity passed: engine 2 files / 6 tests and web
  1 file / 2 tests.
- focused Rockwool Gate C + V26 + UBIQ pack passed 3 files / 16 tests
  after restoring the older Rockwool Gate C artifact names in
  `docs/calculator/CURRENT_STATE.md`.
- final `pnpm calculator:gate:current` passed with engine 268 files /
  1540 tests, web 55 files / 265 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- final `git diff --check` passed.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx` when the web build runs. The Next build
rewrote `apps/web/next-env.d.ts`; it was restored to the repo's
`.next-typecheck` reference after validation.
