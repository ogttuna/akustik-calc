# Checkpoint - 2026-05-05 - Broad Revalidation And Next-Step Handoff

Checkpoint role:

Broad calculator/repo validation and plan refresh after V27 Gate A.

Current selected slice:

`ubiq_open_web_packaged_finish_current_gate_guard_v1`

Selected next file:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate`

Active planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md`

## Broad Validation Result

`pnpm check` passed on 2026-05-05.

Validation summary:

- lint clean.
- typecheck clean.
- engine full suite passed: 403 files / 2374 tests.
- web full suite passed: 166 files / 936 passed + 18 skipped.
- repo build passed: 5 / 5 tasks.
- final `git diff --check` green before this checkpoint write.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx` during the Next build. They did not fail
build or typecheck.

## Implementation/Docs Comparison

The broad suite confirms the active implementation and docs are
aligned with the V27 posture:

- UBIQ weak-band and supported-band source-backed current-gate packs are
  already guarded.
- V27 selected the UBIQ packaged-finish current-gate guard and did not
  change runtime values.
- existing UBIQ packaged-finish tests already cover `90 exact` and
  `21 bound` open-web rows across engine and visible workbench surfaces.
- many-layer, edit-history, reorder, save/load, hostile-input, and
  wall/floor mixed-mode surfaces are green in full validation.
- Rockwool adjacent support remains corrected at
  `Rw 51 / R'w 49 / DnT,w 51`.
- split/internal gypsum-leaf Rockwool remains withheld or
  screening-only at `Rw 41` until source-owned exact runtime data is
  available.

## Correct Direction

The correct immediate path is not to retune Rockwool by guesswork.
The next step should make existing source-backed UBIQ packaged-finish
guards current-gate owned, because they are already source-backed,
calculation-relevant, and broad-test green.

After that current-gate ownership is closed, the project should re-rank:

1. direct Rockwool exact runtime only if the
   `rights_safe_source_owned_curve_payload_absent` blocker is closed.
2. generic/raw open-web widening only if raw carrier topology, metric,
   tolerance, and negative-boundary owners are named.
3. company-internal high-accuracy opening only after remaining numeric
   blockers are closed or explicitly bounded.

## Next Action

Create:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Then add these existing guard files to
`tools/dev/run-calculator-current-gate.ts`:

- `src/ubiq-open-web-packaged-finish-family-design.test.ts`
- `src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts`
- `src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`

Keep runtime values, output support, API shape, route-card values,
output-card statuses, proposal/report copy, and workbench input
behavior frozen in this next gate.
