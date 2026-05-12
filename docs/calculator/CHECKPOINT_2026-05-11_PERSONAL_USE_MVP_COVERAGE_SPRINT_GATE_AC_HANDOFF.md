# Gate AC Flat Multicavity Topology Surface Parity Handoff - 2026-05-11

## Landed Gate

`gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_plan`

## Selection Status

`gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_landed_selected_broad_revalidation_gate_ad`

## Selected Next Action

`gate_ad_personal_use_mvp_flat_multicavity_broad_revalidation_and_internal_pilot_rehearsal_plan`

## Selected Next File

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts`

## What Changed

Gate AC closes the visible-surface parity gap left by Gate AB. The
workbench row-group controls, scenario evaluation, saved replay,
calculator API payload, output cards, and Markdown report now carry the
same explicit grouped multicavity topology owner set.

The new web surface is:

`apps/web/features/workbench/flat-multicavity-topology-surface.ts`

The surface reports:

- `Wall multicavity topology owner set`
- the runtime method and origin that actually evaluated the stack;
- the one-based visible row groups for side A, cavity 1, internal leaf,
  cavity 2, side B, and support topology;
- an explicit `not measured evidence` statement.

## Runtime Boundary

Gate AC does not retune solvers, promote source rows, change tolerance,
or alias lab/field/building/ASTM metrics.

The complete flat/many-layer topology remains a source-absent screening
route with explicit topology carried through the UI:

- `Rw 38`
- `STC 38`
- `C -1`
- `Ctr -5.6`
- method `screening_mass_law_curve_seed_v3`
- origin `screening_fallback`
- error budget `+/-10 dB`

The existing grouped triple-leaf owned solver pin remains unchanged:

- `Rw 50`
- `STC 55`
- `C 0.8`
- `Ctr -7.3`
- method `triple_leaf_two_cavity_frequency_solver`
- origin `family_physics_prediction`
- error budget `+/-5 dB`

Partial UI topology stays parked: it does not create a Gate AC report
surface and still exposes grouped-topology missing-input prompts.

## Test Coverage

Gate AC adds:

- engine contract:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ac-flat-multicavity-topology-surface-parity-contract.test.ts`
- web parity contract:
  `apps/web/features/workbench/flat-multicavity-topology-surface-parity.test.ts`

The tests cover:

- Gate AC metadata and Gate AD selection;
- complete flat/many-layer grouped topology remaining complete without
  runtime promotion;
- existing grouped triple-leaf solver values staying pinned;
- workbench card values;
- saved local replay;
- calculator API payload parity;
- Markdown report topology lines;
- partial topology refusing to create a report surface.

Validation completed on 2026-05-11: focused Gate AC engine 1 file / 4
tests passed, focused Gate AC web 1 file / 4 tests passed, Gate AB/AC
engine continuity 2 files / 10 tests passed, grouped-wall/AC web
continuity 2 files / 8 tests passed, engine typecheck passed, web
typecheck passed, and `pnpm calculator:gate:current` passed with engine
370 files / 2138 tests, web 74 files / 318 passed + 18 skipped, repo
build 5/5, and whitespace guard clean. The Next build still reports the
known optional `sharp/@img` package warnings, but it exits successfully.

## Next Step

Gate AD should be a broad revalidation and company-internal pilot
rehearsal, not a source crawl. It should run the current matrix, route
cards, saved/API/report parity, and hostile-input lanes together, then
decide whether the next highest-ROI move is solver broadening for flat
multicavity walls or a separate output-basis lane.
