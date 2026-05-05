# Slice Plan - Calculator Source Gap Revalidation V27

Slice id: `calculator_source_gap_revalidation_v27`

Status: GATE A LANDED / NEXT SLICE SELECTED

Selected by:

`ubiq_open_web_supported_band_current_gate_guard_v1` Gate C closeout

Selection status:

`closed_ubiq_open_web_supported_band_current_gate_guard_selected_source_gap_revalidation_v27`

Landed Gate A file:

`packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`

Landed Gate A action:

`gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout`

Gate A selection status:

`selected_ubiq_open_web_packaged_finish_current_gate_guard_after_v27_rerank_preserved_rockwool_and_raw_open_web_blockers`

Selected next slice:

`ubiq_open_web_packaged_finish_current_gate_guard_v1`

Selected next file:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate`

Selected next planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md`

This plan remains the V27 historical planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md`

## Objective

Re-rank the remaining calculator source/accuracy gaps now that UBIQ
FL-23/25/27 weak-band and FL-24/26/28 supported-band exact/bound
surfaces are current-gate owned.

V27 must choose one bounded next implementation slice that improves
numeric correctness, source ownership, or source-backed guard coverage.
It must not use the completed UBIQ current-gate work as permission to
open generic/raw open-web widening or direct Rockwool exact runtime
promotion without a source-owned boundary.

## Carry-Forward From Supported-Band Closeout

Required closeout artifacts:

- `closed_ubiq_supported_band_current_gate_guard_summary`
- `supported_band_current_gate_pack_carry_forward`
- `source_gap_revalidation_v27_selected_after_ubiq_supported_band_closeout`
- `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_closeout`

Current-gate UBIQ pack carried forward:

- `src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`
- `src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
- `src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`
- `src/ubiq-open-web-weaker-band-posture-guard.test.ts`
- `features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`
- `src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`
- `src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
- `src/ubiq-open-web-supported-band-finish-completion.test.ts`
- `src/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`

Protected UBIQ boundaries:

- exact weak-band FL-23/25/27 lower-board rows stay source-owned and
  exact.
- upper-only weak-band open-web stacks keep impact outputs fail-closed.
- exact supported-band FL-24/26/28 bare/timber rows stay source-owned
  and exact.
- carpet + foam-underlay supported-band rows stay bound-only on
  `Ln,w+CI <= 45`; exact `Ln,w` is not fabricated.
- supported-band carpet near misses stay impact-fail-closed.

Rockwool remains unchanged:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41` screening-only.
- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

## Gate A Landed Work

Gate A landed:

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`.
2. Re-rank remaining source-backed accuracy work after UBIQ current-gate
   ownership closed.
3. Keep Rockwool exact runtime blocked unless a rights-safe
   source-owned curve/topology/material/metric/tolerance/negative-boundary
   packet exists.
4. Keep generic/raw open-web widening blocked unless V27 can name the
   source-owned topology, metric, tolerance, and negative-boundary owner.
5. Select one bounded next slice with target file and validation scope:
   `ubiq_open_web_packaged_finish_current_gate_guard_v1`.
6. Carry forward `remaining_accuracy_gap_order_after_ubiq_supported_band_closeout`,
   `ubiq_packaged_finish_ready_surfaces_after_v27`,
   `packaged_finish_current_gate_guard_selected_after_v27`, and
   `rockwool_source_blockers_carry_forward_after_v27`.
7. Run focused V27 validation, `pnpm calculator:gate:current`, and
   `git diff --check`.

## Gate A Selection

Selected next slice:

`ubiq_open_web_packaged_finish_current_gate_guard_v1`

Reason:

The existing UBIQ open-web packaged-finish tests already protect
`90 exact` and `21 bound` source-backed rows across engine family
design, near-miss behavior, packaged-lane tracing, visible workbench
cards, and saved/edit history replay. The next correctness step is to
make those guards one current-gate pack before attempting generic/raw
open-web widening.

Selected target:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Selected action:

`gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate`

Selected planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md`

Rockwool remains blocked by
`rights_safe_source_owned_curve_payload_absent`; raw/generic open-web
widening remains blocked by
`source_owned_raw_carrier_negative_boundary_absent`.

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts --maxWorkers=1
```

Continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts --maxWorkers=1
```

Final gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Selection validation:

Supported-band Gate C closeout validation completed on 2026-05-05:
focused closeout passed 1 file / 5 tests; focused UBIQ continuity
passed with engine 7 files / 27 tests and web 3 files / 5 tests; final
`pnpm calculator:gate:current` passed with engine 274 files / 1562
tests, web 57 files / 268 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green. Known non-fatal `sharp/@img` warnings
remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was
restored to `.next-typecheck` after the Next build.

Gate A validation completed on 2026-05-05: focused V27 Gate A passed
1 file / 5 tests; focused UBIQ packaged-finish engine continuity passed
5 files / 15 tests; focused UBIQ packaged-finish visible continuity
passed 4 files / 5 tests; final `pnpm calculator:gate:current` passed
with engine 275 files / 1567 tests, web 57 files / 268 passed + 18
skipped, repo build 5 / 5 tasks, and whitespace guard green. Known
non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after the Next build.
