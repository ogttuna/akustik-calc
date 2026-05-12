# Gate AJ Post Opening/Leak STC Surface Revalidation Handoff - 2026-05-12

Landed action:

`gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_plan`

Selection status:

`gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_ak`

Selected next action:

`gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ak-coverage-matrix-refresh-after-opening-leak-stc-contract.test.ts`

## Summary

Gate AJ is a no-runtime revalidation gate after Gate AI's visible
opening/leak `STC` surface. It keeps the landed runtime and surface
unchanged while proving the adjacent wall, field, building, and matrix
boundaries still fail closed where they should.

Pinned behavior:

- complete opening/leak fixture remains lab `Rw 38.2 / STC 39`;
- high-leakage two-opening case remains lab `Rw 33.7 / STC 34`;
- Gate S `+/-6 dB` source-absent opening/leak budget is still not
  measured evidence;
- Gate AH `ASTM E413` adapter remains visible only for owned element-lab
  `STC`;
- `R'w`, `DnT,w`, field, and building outputs are still not aliases of
  lab `Rw` or lab `STC`.

## What Changed

- Added Gate AJ engine contract:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts`.
- Added Gate AJ to the current-gate runner.
- Updated current calculator docs to make Gate AJ the latest landed
  checkpoint and Gate AK the selected next STC-aware matrix refresh.

## Boundaries Revalidated

- Missing opening fields remain `needs_input`.
- Duplicate opening ids/signatures remain unsupported with no budget or
  adapter.
- Source-absent opening values remain unsupported until a value owner
  exists.
- STC-only opening input basis remains blocked; compatible opening `Rw`
  is still required for the Gate AH spectrum adapter.
- Gate I/J/K airborne field context remains field/apparent and does not
  expose the Gate AH lab adapter.
- Gate L/M/N/O/P building prediction remains parked/unsupported until
  direct, flanking, junction, and normalization owners exist.
- Gate W/AA matrix rows remain gap-free with supported values separated
  from unsupported outputs.

## Validation

- Focused Gate AJ:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts --maxWorkers=1`
  passed with 7 tests.
- Gate AI + Gate AJ continuity:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts --maxWorkers=1`
  passed with 12 tests.
- Engine typecheck:
  `pnpm --filter @dynecho/engine typecheck` passed.
- Current gate:
  `pnpm calculator:gate:current` passed. Focused engine gate passed
  377 files / 2175 tests, focused web gate passed 74 files /
  318 passed + 18 skipped, and build passed 5/5 packages.
- Full repo:
  `pnpm check` passed. Lint and typecheck passed 5/5 packages, engine
  tests passed 502 files / 2977 tests, web tests passed 180 files /
  993 passed + 18 skipped, and build passed 5/5 packages. The Next build
  still reports the existing optional `sharp` package resolution
  warnings, but compilation and type validation succeeded.

## Next Gate AK

Gate AK has now consumed this handoff and closed as the no-runtime
STC-aware matrix refresh. See
[CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_HANDOFF.md](./CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_HANDOFF.md).

Gate AK should refresh the executable personal-use MVP matrix after the
opening/leak `STC` runtime and visible surface are both landed. Treat it
as an STC-aware matrix refresh, not a broad source crawl:

1. Keep Gate W/AA row count and row ids honest, or explicitly add/remove
   rows with reasons.
2. Preserve opening/leak `Rw 38.2 / STC 39`, high-leakage
   `Rw 33.7 / STC 34`, and `STC`-only target `STC 39`.
3. Keep unsupported `R'w`, `DnT,w`, field, building, source-absent,
   duplicate, and STC-only input-basis rows budget-free.
4. Re-rank next calculator-first lanes from the refreshed matrix.
5. Select a narrow next implementation lane only after the matrix proves
   the current highest-impact blocker.
