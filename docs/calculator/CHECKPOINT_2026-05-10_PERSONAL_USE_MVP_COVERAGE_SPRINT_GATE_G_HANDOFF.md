# Checkpoint 2026-05-10 - Personal-Use MVP Coverage Sprint Gate G Handoff

## Scope

Gate G lands generalized wall multi-cavity / triple-leaf route readiness
for the Personal-Use MVP Coverage Sprint. It is an engine contract and
hostile-input guard move. It does not crawl broad sources, retune floor
formula corridors, promote measured rows, or change the current grouped
mineral-wool numeric pins.

Landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts`

Landed engine helpers:

`packages/engine/src/wall-triple-leaf-topology-readiness.ts`

`packages/engine/src/dynamic-calculator-route-input-topology.ts`

`packages/engine/src/dynamic-airborne-gate-g-rockwool.ts`

Landed action:

`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan`

Selection status:

`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_landed_selected_lined_masonry_clt_wall_gate_h`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`

Selected next action:

`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan`

## Result

- Complete grouped 50/50 mineral-wool triple-leaf topology still routes
  to `triple_leaf_two_cavity_frequency_solver` with `Rw 50 / STC 55`,
  `family_physics_prediction`, and the existing `+/-5 dB`
  uncalibrated error budget.
- Complete grouped non-50/50 construction-image topology still routes
  to the same solver with `Rw 55 / STC 56`, proving the route is not the
  old 50/50 fixture gate.
- Unequal cavity depths and safe explicit group reorders keep the same
  physical route instead of drifting through visual layer order.
- Flat-list multi-cavity ambiguity stays `needs_input` with the seven
  grouped topology prompts.
- Partial grouped topology now blocks missing cavity fill/absorption
  fields explicitly, including `cavity1FillCoverage`,
  `cavity2FillCoverage`, and `absorberClass` as applicable.
- Duplicate or out-of-range grouped layer ownership is refused before
  formula promotion through the `leafGrouping` physical input prompt.
- Lined massive/masonry and CLT walls stay out of the triple-leaf route
  and remain queued for Gate H.
- Field/apparent output requests remain basis-explicit; lab `Rw`/`STC`
  values are not treated as `R'w` or `DnT,w` without field context.
- Exact source precedence remains above the formula route only when a
  full-stack, metric-compatible, rights-safe source anchor is present.
- Current gate runner now includes the Gate G engine contract.

## Gate H Entry Criteria

Gate H should target the next highest wall ROI lane:
lined massive/masonry plus CLT wall upgrade. It should use the Gate A
matrix rows `wall.lined_massive_masonry.lab` and
`wall.clt_mass_timber.lab`, preserve exact-source precedence and
field-output boundaries, and only promote runtime if numeric values,
basis/origin, support bucket, error budget, warnings, and visible/API or
report parity are pinned in the same gate.

Do not return to steel-floor tolerance tightening unless independent
source-owned same-stack ISO `DeltaLw` packets exist. Do not crawl broad
sources unless Gate H names a specific source or holdout as the
highest-impact unblocker.

## Validation

Validation completed on 2026-05-10:

- focused Gate G engine contract passed 1 file / 8 tests;
- Gate E/G doc-alignment continuity passed 2 files / 12 tests;
- Gate A/F/G coverage continuity plus route-input topology and grouped
  Rockwool regressions passed 5 files / 33 tests;
- engine typecheck passed;
- final `pnpm calculator:gate:current` passed with engine 348 files /
  2017 tests, web 68 files / 294 passed + 18 skipped, repo build 5/5,
  and whitespace guard clean.

Known non-fatal warnings remain the existing Zustand unavailable
test-storage warnings and optional `sharp/@img` package resolution
warnings during the Next build.
