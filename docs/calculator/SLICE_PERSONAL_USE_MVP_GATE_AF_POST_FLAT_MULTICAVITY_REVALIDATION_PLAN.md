# Personal-Use MVP Gate AF Post Flat Multicavity Revalidation Plan

Date: 2026-05-12

## Purpose

Gate AF is the active unfinished calculator slice after Gate AE. Its job
is to revalidate the calculator after the Gate AE flat multicavity
runtime promotion, then select the next bounded lane from the current
personal-use evidence. Gate AF is not a new solver, source crawl, or
runtime retune.

Current selected status:

`gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_landed_selected_revalidation_gate_af`

Gate AF landed action to implement:

`gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan`

Gate AF selected implementation file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts`

## Plan Review Verdict - 2026-05-12

This plan is still active and not completed. The repo already contains
many historical `Gate AF` references, but the only unfinished active
one is this Personal-Use MVP post-flat-multicavity revalidation gate.

Implementation comparison:

| Surface | Expected active Gate AF state | Current repo state |
|---|---|---|
| Gate AE runtime | Landed and exported | Present in `dynamic-airborne-gate-ae-flat-multicavity.ts` and `index.ts` |
| Gate AE current-gate coverage | Included | Present in `tools/dev/run-calculator-current-gate.ts` |
| Gate AF summary module | Must exist before closeout | Missing |
| Gate AF contract test | Must exist before closeout | Missing |
| Gate AF current-gate runner entry | Must exist before closeout | Missing |
| Gate AF docs closeout checkpoint | Must exist after tests are green | Missing |
| Next selected lane | Must be selected by executable Gate AF policy | Not selected yet |

Validated baseline:

- `pnpm calculator:gate:current` passes on 2026-05-12 with engine 372
  files / 2148 tests, web 74 files / 318 passed + 18 skipped, repo
  build 5/5, and whitespace guard clean.
- Broad `pnpm check` passes on 2026-05-12 with lint clean, typecheck
  clean, engine Vitest 497 files / 2950 tests, web Vitest 180 files /
  993 passed + 18 skipped, and repo build 5/5.
- Known non-fatal Next build warnings remain limited to optional
  `sharp/@img` packages through the DOCX/PDF path.
- The active Gate AF summary and contract files are absent; this is the
  implementation gap, not a docs-only mismatch.
- No runtime, tolerance, source-precedence, card/report/API, or
  lab/field/building fix was required by this broad review.

## Current Implementation Read

Implemented and green:

- Gate AE runtime module exists in
  `packages/engine/src/dynamic-airborne-gate-ae-flat-multicavity.ts`.
- Gate AE summary constants exist in
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae.ts`.
- Gate AE contract coverage exists in
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts`.
- Gate AC web topology surface and parity coverage exist in
  `apps/web/features/workbench/flat-multicavity-topology-surface.ts`
  and
  `apps/web/features/workbench/flat-multicavity-topology-surface-parity.test.ts`.
- `tools/dev/run-calculator-current-gate.ts` includes Gate Y through
  Gate AE and the flat multicavity web parity check.
- `pnpm calculator:gate:current` passed on 2026-05-12 during this plan
  review with engine 372 files / 2148 tests, web 74 files / 318 passed
  + 18 skipped, repo build 5/5, and whitespace guard clean.
- `pnpm check` passed on 2026-05-12 during this plan review with lint
  clean, typecheck clean, engine Vitest 497 files / 2950 tests, web
  Vitest 180 files / 993 passed + 18 skipped, and repo build 5/5.

Not implemented yet:

- The active Gate AF contract file does not exist yet.
- No `calculator-personal-use-mvp-coverage-sprint-gate-af.ts` summary
  module exists yet.
- The next post-Gate-AE lane has not been selected by executable Gate AF
  policy yet.

Important namespace warning:

- The repo already has an older steel-floor Gate AF at
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`.
- That older Gate AF is landed historical work and must not be edited as
  the active slice.
- The active unfinished Gate AF is the personal-use post-flat-
  multicavity revalidation file named above.

## Research Decision

No internet or standards research is needed to implement Gate AF. Gate AF
is a no-runtime revalidation and lane-selection gate using already
landed local evidence. External research should wait until a later gate
actually promotes a new formula, tolerance, rating adapter, or source
packet. If the selected post-Gate-AF lane introduces new STC, field,
building, or impact formula behavior, use primary/official sources only
and keep measured/source rows separate from formula ownership.

## Gate AF Scope

Gate AF must prove these facts without moving runtime behavior:

- the 40-row personal-use matrix remains gap-free after Gate AE;
- Gate G full mineral-wool grouped triple-leaf remains
  `Rw 50 / STC 55 / C 0.8 / Ctr -7.3` with `+/-5 dB`;
- Gate AE explicit grouped flat multicavity remains
  `Rw 53 / STC 57 / C -0.6 / Ctr -8` through
  `gate_ae_flat_multicavity_two_cavity_frequency_solver`,
  `family_physics_prediction`, and `+/-7 dB`;
- Gate AB grouped topology ownership and invalid group refusals remain
  stable;
- Gate AC card, saved replay, calculator API payload, and Markdown
  report parity keep the same topology owner set and Gate AE method;
- Gate AD internal-pilot classification remains coherent after the Gate
  AE promotion;
- missing-input, unsupported, stale topology, duplicate group, field,
  building, ASTM, and IIC boundaries remain blocked without promoted
  budgets;
- exact and calibrated source candidates stay rejected until
  source-owned same-stack curve or holdout evidence exists.

## Implementation Order

Execute Gate AF in this exact order. Do not update closeout docs before
the new Gate AF contract passes, except for this plan file.

1. Add `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af.ts`.

   Define Gate AF constants, selected status, selected next file/action,
   a summary type, and a lane-selection helper. Keep it no-runtime.

   Use these names unless the executable post-Gate-AE ranking changes:

   - landed gate:
     `gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan`
   - selection status:
     `gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_landed_selected_floor_formula_surface_polish_gate_ag`
   - selected next action:
     `gate_ag_personal_use_mvp_floor_formula_surface_polish_plan`
   - selected next file:
     `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ag-floor-formula-surface-polish-contract.test.ts`

2. Add the Gate AF contract test at the selected file path.

   The contract should assert metadata, current selected status, no
   runtime value movement relative to Gate AE, matrix stability, Gate
   G/AB/AC/AD/AE continuity, basis boundaries, docs alignment, exports,
   and current-gate runner coverage.

   Minimum test cases:

   - `lands Gate AF as no-runtime post-promotion revalidation and selects the next lane`;
   - `keeps the 40-row personal-use matrix gap-free after Gate AE`;
   - `pins Gate AE flat multicavity and Gate G grouped triple-leaf values`;
   - `keeps stale, duplicate, missing-topology, field, building, ASTM, and IIC boundaries blocked`;
   - `keeps Gate AC web/report/API topology parity aligned with the Gate AE method`;
   - `selects the post-Gate-AE lane by executable score instead of broad source crawl`;
   - `keeps docs, exports, and current-gate runner aligned with Gate AF closeout`.

3. Revalidate the current matrix and explicit Gate AE fixture.

   Use `buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix`,
   `summarizePersonalUseMvpCoverageSprintGateAA`,
   `summarizePersonalUseMvpCoverageSprintGateAD`,
   `calculateAssembly`, and the existing Gate AB fixture constants. Do
   not create a new runtime path.

4. Add next-lane ranking for post-Gate-AE work.

   Start from the Gate AD candidate model, remove the now-landed
   `flat_multicavity_solver_broadening` lane, and rank the remaining
   bounded lanes by user frequency, accuracy lift, solver readiness,
   blocker evidence, implementation cost, basis leakage risk, and source
   crawl drift risk.

   Current expected next-lane candidates:

   - `floor_formula_surface_polish`: expected score `27.0`, evidence
     rows `floor.timber_joist_formula_missing_dynamic_stiffness.needs_input`,
     `floor.lightweight_steel_formula_missing_spacing.needs_input`, and
     `floor.heavy_concrete_floating_floor_safe_reorder.lab`.
   - `opening_leak_stc_spectrum_adapter`: expected score `21.8`,
     evidence rows `wall.opening_leak_composite.lab`,
     `wall.opening_leak_two_openings.lab`, and
     `wall.opening_leak_stc_only.unsupported`.
   - `airborne_field_building_basis_expansion`: expected score `11.3`,
     evidence rows `wall.complete_building_prediction.unsupported` and
     `wall.building_prediction_partial_context.needs_input`.
   - `broad_source_crawl`: expected score `0.2`, source rows required,
     remains parked unless a specific source-owned unblocker is named.

   The expected post-Gate-AE winner is
   `floor_formula_surface_polish`. Do not copy the stale Gate AD reason
   text for this candidate, because Gate AD correctly said floor polish
   was behind the flat wall solver gap before Gate AE landed. Gate AF
   should give the post-AE reason: the flat multicavity runtime gap is
   now closed, and the remaining highest-score bounded work is polishing
   existing floor formula input surfaces and prompts without changing
   formula values.

5. Update `packages/engine/src/index.ts`.

   Export `calculator-personal-use-mvp-coverage-sprint-gate-af` so web
   parity tests and future docs can import Gate AF constants without
   reaching into private module paths.

6. Update `tools/dev/run-calculator-current-gate.ts`.

   Add the Gate AF contract to the engine focused gate. Keep the
   existing flat multicavity web parity check in the web focused gate.

7. Update docs after the Gate AF test, export, and runner updates are
   green.

   Update `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`,
   `docs/calculator/README.md`, and add a Gate AF checkpoint. The docs
   should name Gate AF as landed and point to the selected next lane.
   Do not rename this plan to landed status until the Gate AF contract
   and current-gate runner entry exist and pass.

8. Run final validation and only then consider Gate AF closed.

   Minimum final commands are the focused engine command below,
   focused web parity, `pnpm typecheck`, `pnpm calculator:gate:current`,
   and `git diff --check`.

## Non-Goals

Gate AF must not:

- change `Rw`, `STC`, `C`, `Ctr`, `Ln,w`, `DeltaLw`, or any tolerance;
- add field, building, ASTM, IIC, or opening-STC runtime adapters;
- promote exact or calibrated source rows;
- auto-group ambiguous flat layer lists;
- crawl broad source libraries;
- change workbench input behavior.

## Validation Plan

Run these while implementing Gate AF:

1. Focused engine:

   `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts --maxWorkers=1`

2. Focused web parity:

   `pnpm --filter @dynecho/web exec vitest run features/workbench/flat-multicavity-topology-surface-parity.test.ts --maxWorkers=1`

3. Typecheck if shared exports or engine index changes:

   `pnpm typecheck`

4. Current gate:

   `pnpm calculator:gate:current`

5. Whitespace guard:

   `git diff --check`

Use full `pnpm check` only after Gate AF docs and runner updates are in
place, or if the implementation touches broad shared/web behavior.

## Completion Signal

Gate AF is complete when all of these are true:

- the selected Gate AF contract file exists and passes;
- a Gate AF summary module is exported from `packages/engine/src/index.ts`;
- `tools/dev/run-calculator-current-gate.ts` includes the Gate AF
  contract;
- the Gate AF contract proves the selected next lane is
  `floor_formula_surface_polish` unless the executable scoring evidence
  changed;
- docs state Gate AF is landed and name the next selected lane;
- `pnpm calculator:gate:current` passes;
- no runtime values, tolerances, source precedence, or lab/field/
  building basis boundaries move.
