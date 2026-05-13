# Gate BD Handoff - Floor-Impact Source-Absent Runtime Corridor

Date: 2026-05-13

## Landed Gate

`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`

Selection status:

`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_landed_selected_surface_parity_gate_be`

Selected next action:

`gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts`

## What Changed

Gate BD promotes the Gate BC heavy-concrete combined upper/lower
source-absent lab corridor to runtime for complete explicit predictor
input. The runtime basis is:

`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`

The complete Gate BD fixture now returns:

- `Ln,w 44.4`
- `DeltaLw 30.1`
- `+/-6.5 dB` source-absent not-measured budget for `Ln,w`
- `+/-5.5 dB` source-absent not-measured budget for `DeltaLw`

The formula keeps Gate BC's shape:

`DeltaLw_total = DeltaLw_upper(m'load, s') + DeltaLw_lower(lower assembly) - couplingPenalty(upper, lower)`

`Ln,w = Ln,w_bare_heavy_reference - DeltaLw_total`

## Protected Boundaries

Exact floor-system rows still outrank the formula. The UBIQ exact row
stays `Ln,w 51` and does not invent `DeltaLw`.

Existing heavy floating-floor behavior remains `Ln,w 50.3` /
`DeltaLw 24.3` through
`predictor_heavy_floating_floor_iso12354_annexc_estimate`.

Missing load still preserves only the published-family `Ln,w 47`
anchor with `DeltaLw` unsupported.

Complete combined input with missing lower treatment or missing dynamic
stiffness now blocks broad fallback instead of silently returning an
upper-only formula result.

ASTM `IIC` / `AIIC`, field, and building impact outputs remain
unsupported basis boundaries; the new lab budget is not an ASTM, field,
or building alias.

## Files

- `packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts`
- `packages/engine/src/impact-estimate.ts`
- `packages/engine/src/impact-lane.ts`
- `packages/shared/src/domain/impact.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

## Validation

Validation completed on 2026-05-13:

- focused Gate BD: 1 file / 6 tests
- Gate BC + Gate BD continuity: 2 files / 14 tests
- Gate BA + Gate BB + Gate BC + Gate BD continuity: 4 files / 29 tests
- impact regression guard: 3 files / 109 tests
- Gate AZ fixture type-safety guard: 1 file / 5 tests
- engine typecheck and engine build
- `pnpm calculator:gate:current`: engine 397 files / 2301 tests, web
  76 files / 325 passed + 18 skipped, repo build 5/5, whitespace guard
  clean
- `git diff --check` clean

Known non-fatal build warnings: the existing optional `sharp/@img`
package resolution warnings from `@turbodocx/html-to-docx`.

## Next Step

Gate BE should make the new lab runtime basis and not-measured budgets
visible across cards, support trace, scenario analysis, report payloads,
and API surfaces without retuning `Ln,w 44.4` or `DeltaLw 30.1`.

Next plain label: floor-impact source-absent surface parity.
