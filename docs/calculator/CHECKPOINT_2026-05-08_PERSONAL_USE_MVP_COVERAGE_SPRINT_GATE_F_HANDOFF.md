# Checkpoint 2026-05-08 - Personal-Use MVP Coverage Sprint Gate F Handoff

## Scope

Gate F lands first-class Dynamic Calculator input-surface parity for the
timber/CLT floor-impact `DeltaLw` formula corridor. This is a UI,
snapshot, and API bridge move. It does not retune formulas, crawl
sources, or promote measured rows.

Landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-f-timber-clt-floor-impact-delta-lw-input-surface-contract.test.ts`

Landed engine helper:

`packages/engine/src/timber-clt-delta-lw-input-surface.ts`

Landed web proof:

`apps/web/features/workbench/timber-clt-delta-lw-input-surface-acceptance.test.ts`

Landed action:

`gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan`

Selection status:

`gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_landed_selected_wall_multicavity_gate_g`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts`

Selected next action:

`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan`

## Result

- Added an engine input-surface builder for timber joist and mass-timber
  CLT `DeltaLw` predictor input.
- Workbench floor controls now expose support family, impact system,
  load basis, resilient dynamic stiffness, upper treatment/fill mass
  inputs, base overrides, and lower assembly fields.
- Live scenario evaluation, local saved replay, server snapshot replay,
  calculator API payload, and impact-only API payload can feed the same
  predictor input as Gate D/E.
- Complete UI-derived timber returns exact `Ln,w 51` plus formula
  `DeltaLw 25.2`.
- Complete UI-derived CLT returns family `Ln,w 50` plus formula
  `DeltaLw 22.6`.
- Partial or invalid UI fields stay parked with precise missing
  `baseSlabOrFloor`, `toppingOrFloatingLayer`,
  `resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`, or
  `ceilingOrLowerAssembly` warnings and no `DeltaLw` budget.
- Exact-source precedence, field/ASTM non-aliasing, wrong-family steel
  boundaries, duplicate timber/CLT carrier refusal, and safe reorder
  stability are guarded.
- Current gate runner now includes the Gate F engine and web tests.

## Gate G Entry Criteria

Gate G should pivot back to wall coverage from the executable matrix:
generalized wall multi-cavity / triple-leaf route readiness beyond
fixture gates. It should classify physically complete grouped
multi-cavity walls, ambiguous/hostile grouped cases, exact-source
precedence, and field/basis boundaries. Complete grouped physical input
must reach the correct family-solver/readiness lane or return exact
missing topology fields. Do not crawl broad sources, retune floor
formulas, or rely on old fixture-specific gates.

## Validation

Validation completed on 2026-05-10 after post-doc revalidation:

- focused Gate F engine contract passed 1 file / 4 tests;
- focused Gate F web input-surface acceptance passed 1 file / 4 tests;
- Gate E/F engine continuity passed 2 files / 8 tests;
- web Gate E/F/snapshot continuity passed 3 files / 12 tests;
- engine typecheck passed;
- web typecheck passed;
- final `pnpm calculator:gate:current` passed with engine 347 files /
  2009 tests, web 68 files / 294 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean;
- `git diff --check` passed.

Known non-fatal warnings remain the existing Zustand unavailable
test-storage warnings in focused web tests and optional `sharp/@img`
package resolution warnings during the Next build.
