# Personal-Use MVP Coverage Sprint Gate BK Handoff

Date: 2026-05-14

Gate BK has now landed:

`gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`

Gate BK selection status:

`gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_landed_selected_suspended_ceiling_input_surface_gate_bl`

Selected Gate BL action:

`gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_plan`

Selected Gate BL file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts`

Next plain label: steel-floor suspended-ceiling input surface.

## What Landed

Gate BK removes the complete steel suspended-ceiling-only predictor path
from the broad low-confidence Pliteq/UBIQ fallback. Complete input now
uses:

`predictor_lightweight_steel_suspended_ceiling_corridor_estimate`

The first complete runtime pin is:

- lab `Ln,w 62.2`;
- `+/-6 dB` source-absent formula error budget;
- origin `source_absent_formula_error_budget`;
- not measured evidence;
- exact measured rows still outrank the formula.

The existing Gate AD upper/lower steel formula corridor is unchanged:

- `Ln,w 55.6`;
- `DeltaLw 22.4`;
- `+/-4.5 dB` / `+/-2.0 dB` tolerances;
- basis `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`.

## Protected Boundaries

Gate BK keeps these boundaries closed:

- no exact-source retune or tolerance tightening;
- no broad source-row crawl;
- no `DeltaLw` for suspended-ceiling-only steel unless an upper package
  owns load and dynamic stiffness;
- no `IIC`, `AIIC`, or `L'nT,50` alias;
- no field/building promotion from this new lab lane without the
  separate field/building owner path;
- generated `floor-steel-fallback` remains incomplete because carrier
  spacing and lower ceiling isolation support form are not first-class
  visible inputs yet.

## Why Gate BL Next

Gate BK proves the physics route for complete steel suspended-ceiling
input, but the visible generated fallback still cannot supply all owner
fields from the Dynamic Calculator surface. Gate BL should add the
first-class input surface for steel suspended-ceiling carrier spacing
and lower ceiling isolation support form, then turn partial cases into
precise `needs_input` prompts instead of a low-confidence final answer.

## Validation Target

Focused Gate BK validation:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts --maxWorkers=1`

After docs and runner updates, also run:

- the affected steel impact regression tests;
- engine typecheck;
- `pnpm calculator:gate:current`;
- `git diff --check`.
