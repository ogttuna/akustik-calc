# Checkpoint 2026-05-10 - Personal-Use MVP Coverage Sprint Gate I

Status:

`gate_i_personal_use_mvp_airborne_field_context_continuation_landed_selected_field_surface_parity_gate_j`

Landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts`

Landed action:

`gate_i_personal_use_mvp_airborne_field_context_continuation_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts`

Selected next action:

`gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan`

## What Landed

- Complete `field_between_rooms` airborne context now lets already-owned
  lab family routes promote to a field/apparent family-physics basis
  without relabelling lab `Rw` / `STC` as field metrics.
- The first owned routes are grouped mineral-wool triple-leaf,
  lined massive/masonry, and CLT/mass-timber wall families.
- Required physical context is explicit: field context mode, partition
  area or panel dimensions, receiving-room volume, and RT60.
- Building-prediction/flanking output remains blocked from this lane.
- Exact field source rows still outrank the Gate I family adapter.

## Gate J Handoff

Gate J should prove visible surface parity for the new airborne
field-context basis. Output cards, dynamic trace, API payloads, saved
replay, and report payloads must show the same `R'w` / `DnT,w` values,
candidate id, basis, warning, and uncertainty posture. It should not
move numeric values or broaden into building-prediction/flanking.

## Validation

Validation completed on 2026-05-10:

- focused Gate I passed 1 file / 6 tests;
- Gate G/H/I plus Gate O/P continuity passed 5 files / 30 tests;
- engine typecheck passed;
- dynamic-airborne split line-count guard passed after updating the
  current composer size to 1912 physical lines, still below the 2000-line
  threshold;
- final `pnpm calculator:gate:current` passed with engine 350 files /
  2030 tests, web 68 files / 294 passed + 18 skipped, repo build 5/5,
  and whitespace guard clean.

Known non-fatal warnings remain the existing Zustand unavailable
test-storage warnings and optional `sharp/@img` package resolution
warnings during the Next build.
