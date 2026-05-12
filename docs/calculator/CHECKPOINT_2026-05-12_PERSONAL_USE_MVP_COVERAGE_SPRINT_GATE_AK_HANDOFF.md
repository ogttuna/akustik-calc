# Gate AK Coverage Matrix Refresh After Opening/Leak STC Handoff - 2026-05-12

Landed action:

`gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_plan`

Selection status:

`gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_landed_selected_building_prediction_owner_gap_gate_al`

Selected next action:

`gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al-airborne-building-prediction-owner-gap-refresh-contract.test.ts`

## Summary

Gate AK is a no-runtime STC-aware matrix refresh after Gate AH, Gate AI,
and Gate AJ made opening/leak `STC` runtime and visible surface stable.
It does not add source rows, does not retune formulas, and does not move
visible workbench/API/report behavior.

The executable matrix remains the Gate AA 40-row matrix with no added or
removed row ids. Gate AK revalidates that supported metric pins are still
separate from unsupported targets after the opening/leak `STC` surface:

- complete opening/leak remains lab `Rw 38.2 / STC 39`;
- high-leakage two-opening remains lab `Rw 33.7 / STC 34`;
- `STC`-only target requests still return `STC 39` only when the
  compatible opening input owns `Rw`;
- duplicate opening input remains unsupported without a budget;
- `R'w`, `DnT,w`, field, building, source-absent, and wrong-basis
  opening routes remain blocked or unsupported without a promoted budget.

## Lane Decision

Gate AK ranks the remaining calculator-first lanes from the refreshed
matrix and selects the building prediction owner gap refresh for Gate AL.
This is not a building runtime promotion. The selected lane exists
because the matrix still contains explicit building-prediction blockers:

- `wall.complete_building_prediction.unsupported`;
- `wall.building_prediction_partial_context.needs_input`;
- `wall.opening_leak_composite_building_boundary.unsupported`.

Gate AL should map the missing direct separating-element curve,
flanking-energy, junction/coupling, room-standardization, and uncertainty
budget owners into a clean next contract. It must keep current building
requests parked unless executable owners exist.

Lower-ranked lanes:

- ASTM `IIC` / `AIIC` adapter boundary remains important but lower ROI
  and must not alias ISO `Ln,w` / `DeltaLw`;
- opening/leak field or building adapters stay blocked until field and
  building owners are explicit;
- broad source crawling remains blocked because the current highest
  blocker is route/formula ownership, not missing catalog rows.

## Validation

Validation passed before commit:

- Focused Gate AK:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-ak-coverage-matrix-refresh-after-opening-leak-stc-contract.test.ts --maxWorkers=1`
  passed with 6 tests.
- Gate AJ + Gate AK continuity:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-ak-coverage-matrix-refresh-after-opening-leak-stc-contract.test.ts --maxWorkers=1`
  passed with 13 tests.
- Engine typecheck:
  `pnpm --filter @dynecho/engine typecheck` passed.
- Current gate:
  `pnpm calculator:gate:current` passed. Focused engine gate passed
  378 files / 2181 tests, focused web gate passed 74 files /
  318 passed + 18 skipped, build passed 5/5 packages, and whitespace
  guard passed.
- Full repo:
  `pnpm check` passed. Lint and typecheck passed 5/5 packages, engine
  tests passed 503 files / 2983 tests, web tests passed 180 files /
  993 passed + 18 skipped, and build passed 5/5 packages. The known
  optional `sharp/@img` build warnings and unavailable test-storage
  Zustand warnings remain non-fatal.

## Next Gate AL

Gate AL has now consumed this handoff and closed as the no-runtime
building prediction owner gap refresh. See
[CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_HANDOFF.md](./CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_HANDOFF.md).

Gate AL implemented:

1. an executable owner-gap map for airborne `building_prediction` after
   Gate L/M/N/O/P and Gate AK;
2. proof that current building prediction requests remain `unsupported`
   or `needs_input` without runtime/budget movement;
3. explicit blockers for direct curve, flanking path energy, junction
   vibration reduction/coupling, room standardization, and `+/-9 dB`
   budget ownership;
4. rejection of lab `Rw`/`STC`, field `R'w`/`DnT,w`, and opening/leak
   lab adapters as building-output aliases;
5. Gate AM as the selected no-runtime direct separating-element
   frequency curve owner contract.
