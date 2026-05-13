# Post-Gate BD Full Revalidation And Gate BE Plan Handoff

Date: 2026-05-13

## Scope

This checkpoint is a broad post-Gate BD revalidation and planning pass.
It does not move runtime values, tolerances, source precedence, input
contracts, API payload shape, cards, or report copy.

Gate BD remains the latest landed runtime gate:

`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`

Current selected status remains:

`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_landed_selected_surface_parity_gate_be`

Current selected next action:

`gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`

Current selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts`

## Revalidation Result

The first broad `pnpm check` run stopped at lint. The failures were
non-runtime hygiene only:

- unused `PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTION_STATUS`
  import in the Gate BA contract module;
- redundant `Boolean(...)` checks in the Gate AY advanced-wall dynamic
  adapter.

Both were fixed without changing calculator behavior.

Final `pnpm check` passed on 2026-05-13:

- lint: passed;
- typecheck: passed;
- engine tests: 522 files / 3103 tests passed;
- web tests: 182 files / 985 passed + 18 skipped;
- build: 5 / 5 tasks successful.

Known non-fatal output:

- Next build still reports the existing optional `sharp/@img` resolution
  warnings through `@turbodocx/html-to-docx`;
- some web tests print the existing zustand unavailable-storage warning
  in the Vitest environment while still passing.

`apps/web/next-env.d.ts` was restored to the repo-standard
`.next-typecheck` route reference after Next type generation rewrote it
during validation.

## Current Implementation Read

Gate BD successfully promoted complete explicit heavy-concrete combined
upper/lower predictor input to lab `Ln,w 44.4` / `DeltaLw 30.1` through:

`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`

The runtime keeps source-absent not-measured budgets:

- `+/-6.5 dB` for `Ln,w`;
- `+/-5.5 dB` for `DeltaLw`.

Exact UBIQ rows still outrank the formula, existing heavy floating
behavior remains `Ln,w 50.3` / `DeltaLw 24.3`, missing-load published
anchors remain budget-free, missing lower-treatment or missing dynamic
stiffness blocks broad fallback, and ASTM/field/building impact outputs
remain non-alias boundaries.

The web surface already has the new impact basis label available, but
there is no Gate BE executable surface-parity contract yet. That means
the next useful work is not a new formula, retune, input-surface, ASTM
adapter, field/building adapter, or source crawl. The next useful work
is to prove the new Gate BD runtime basis and budget are consistently
visible everywhere an internal consultant reads the answer.

## Gate BE Implementation Order

Gate BE should land as a narrow surface-parity gate:

1. Add
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts`.
2. Reuse Gate BD's runtime fixture and assert the same lab values:
   `Ln,w 44.4` / `DeltaLw 30.1`.
3. Assert cards, posture, impact metric basis copy, support trace,
   corridor/method dossier, scenario analysis, saved replay, calculator
   API payload, impact-only API payload, and Markdown report all expose
   the same source-absent not-measured basis and budgets.
4. Assert missing lower-treatment, missing dynamic stiffness, exact
   source precedence, existing heavy floating, steel/timber/CLT,
   field/building, and ASTM/IIC cases remain outside the Gate BD
   promoted budget.
5. Keep runtime values and tolerances frozen.

## Non-Goals

- Do not retune `Ln,w 44.4`, `DeltaLw 30.1`, `+/-6.5 dB`, or
  `+/-5.5 dB`.
- Do not add new source rows or broaden source crawling.
- Do not add the first-class UI input surface for the heavy-concrete
  combined upper/lower route yet.
- Do not alias the lab budget onto `IIC`, `AIIC`, `L'n,w`, `L'nT,w`, or
  building-prediction outputs.
- Do not use field/building adapters until their owner contracts are
  explicit.

## Next Step

Start Gate BE surface parity. This is the highest-confidence next step
because Gate BD moved runtime behavior and internal-use readiness now
depends on making that new basis, budget, and boundary posture visible
and replay-stable before adding another calculator lane.
