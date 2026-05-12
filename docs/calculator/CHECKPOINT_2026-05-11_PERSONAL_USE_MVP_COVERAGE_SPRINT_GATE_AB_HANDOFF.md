# Personal-Use MVP Coverage Sprint Gate AB Handoff

Date: 2026-05-11

## Status

Gate AB has landed:

`gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan`

Selection status:

`gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_landed_selected_surface_parity_gate_ac`

Selected next action:

`gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ac-flat-multicavity-topology-surface-parity-contract.test.ts`

## What Changed

Gate AB is an engine/shared input-contract gate. It does not move
runtime values, formulas, source evidence, tolerances, API shapes, route
cards, or workbench input behavior.

The route-input assessment now treats realistic flat/many-layer
multicavity wall schedules as explicit topology-ownership work:

- an ambiguous flat list still returns `needs_input` with the same
  physical owner prompts for side A leaf, cavity depths, internal leaf,
  internal coupling, side B leaf, and support topology;
- a complete grouped owner set covers side A leaf group, leaf grouping,
  cavity 1 depth/fill/absorption, internal leaf group, internal coupling,
  cavity 2 depth/fill/absorption, side B leaf group, and support
  topology;
- stale `flat_layer_order` group indices, duplicate/overlapping group
  indices, out-of-range groups, and empty required groups stay blocked by
  `leafGrouping` instead of being accepted as complete topology;
- safe grouped triple-leaf runtime continuity remains pinned at
  `Rw 50 / STC 55 / C 0.8 / Ctr -7.3` through
  `triple_leaf_two_cavity_frequency_solver`;
- field/apparent and ASTM output requests still require their own basis
  owners and are not aliased from lab `Rw` / `STC`.

## Files

Landed Gate AB helper:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab.ts`

Landed Gate AB contract test:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab-flat-multicavity-topology-input-surface-contract.test.ts`

Updated route-input contract:

`packages/engine/src/dynamic-calculator-route-input-topology.ts`

Updated current-gate runner:

`tools/dev/run-calculator-current-gate.ts`

## Validation

Validation completed on 2026-05-11:

- focused Gate AB: 1 file / 6 tests;
- route/input continuity: Gate G/K/L/X/Y/Z/AA/AB, 8 files / 57 tests;
- engine typecheck: passed;
- `pnpm calculator:gate:current`: engine 369 files / 2134 tests, web
  73 files / 314 passed + 18 skipped, repo build 5/5, whitespace guard
  clean.

## Next

Gate AC should wire the same physical topology fields through visible
surfaces: workbench controls, saved replay, API payloads, output cards,
and Markdown/PDF/DOCX report parity. Gate AC should not retune the
triple-leaf solver or promote source rows; it should prove that complete
UI-owned topology reaches the existing owned family solver while partial
or stale UI state remains `needs_input`.
