# Checkpoint - 2026-05-05 - Calculator Source Gap Revalidation V26 Gate A

Gate file:

`packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`

Slice:

`calculator_source_gap_revalidation_v26`

Selection status:

`selected_ubiq_open_web_weak_band_current_gate_guard_after_v26_rerank_preserved_rockwool_blockers_and_found_source_backed_floor_exact_guard_gap`

Selected next slice:

`ubiq_open_web_weak_band_current_gate_guard_v1`

Selected next file:

`packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_promote_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate`

Selected planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

## Gate A Summary

V26 re-ranked remaining source/accuracy gaps after the Rockwool split
numeric closure and selected a source-backed floor guard rather than
another confidence or copy pass.

Required artifacts:

- `remaining_accuracy_gap_order_after_rockwool_closeout`
- `rockwool_source_blockers_carry_forward_after_v26`
- `selected_ubiq_open_web_weak_band_current_gate_guard`

The selected UBIQ guard protects FL-23/25/27 open-web weak-band source
rows that already exist in the catalog and already have focused
engine/web guards. The next work is to promote those guards into
`pnpm calculator:gate:current` ownership.

## Accuracy Decision

Selected:

`selected_ubiq_open_web_weak_band_current_gate_guard`

Reason:

FL-23/25/27 have source-owned exact rows and existing engine/web guards,
but the current gate must explicitly carry both the exact lower-board
lane and the upper-only impact fail-closed lane before broader floor
coverage can be treated as stable.

Representative pinned behavior:

- FL-23 exact lower-board stack: `Rw 51`, `Ln,w 71`, `Ln,w+CI 70`,
  field `R'w 72`, `DnT,w 74`, `L'n,w 73`, `L'nT,w 70.6`.
- FL-23 upper-only stack: airborne `Rw 73` remains live, but impact
  outputs remain unsupported or need input.

## Rockwool Carry-Forward

`rockwool_source_blockers_carry_forward_after_v26` keeps Rockwool exact
runtime blocked:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41` screening-only on
  `multileaf_screening_blend`.
- direct exact Rockwool runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

## Frozen Surfaces

Gate A is no-runtime: runtime values, output support, confidence,
evidence promotion, API shape, route-card values, output-card status,
proposal/report copy, and workbench input behavior stay unchanged.

## Validation

Required focused validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts --maxWorkers=1
```

Continuity for the selected next slice:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-weak-band-exact-source-mapping.test.ts src/ubiq-open-web-weaker-band-posture-guard.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts --maxWorkers=1
```

Final required gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Validation completed on 2026-05-05:

- focused V26 Gate A passed 1 file / 5 tests.
- focused V26 + UBIQ Gate A pack passed 2 files / 10 tests.
- selected UBIQ continuity passed: engine 2 files / 6 tests and web
  1 file / 2 tests.
- final `pnpm calculator:gate:current` passed with engine 268 files /
  1540 tests, web 55 files / 265 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- final `git diff --check` passed.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx` when the web build runs. The Next build
rewrote `apps/web/next-env.d.ts`; it was restored to the repo's
`.next-typecheck` reference after validation.
