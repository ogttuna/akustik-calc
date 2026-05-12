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

This plan has now landed as the active Personal-Use MVP
post-flat-multicavity revalidation gate. The repo still contains many
historical `Gate AF` references, but this landed gate is the
Personal-Use MVP Gate AF, not the older steel-floor Gate AF.

Implementation comparison:

| Surface | Expected active Gate AF state | Current repo state |
|---|---|---|
| Gate AE runtime | Landed and exported | Present in `dynamic-airborne-gate-ae-flat-multicavity.ts` and `index.ts` |
| Gate AE current-gate coverage | Included | Present in `tools/dev/run-calculator-current-gate.ts` |
| Gate AF summary module | Must exist before closeout | Present in `calculator-personal-use-mvp-coverage-sprint-gate-af.ts` |
| Gate AF contract test | Must exist before closeout | Present in the selected Gate AF contract file |
| Gate AF current-gate runner entry | Must exist before closeout | Present in `tools/dev/run-calculator-current-gate.ts` |
| Gate AF docs closeout checkpoint | Must exist after tests are green | Present in `CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_HANDOFF.md` |
| Next selected lane | Must be selected by executable Gate AF policy | `floor_formula_surface_polish` |

Validated baseline:

- `pnpm calculator:gate:current` passes on 2026-05-12 with engine 372
  files / 2148 tests, web 74 files / 318 passed + 18 skipped, repo
  build 5/5, and whitespace guard clean.
- Broad `pnpm check` passes on 2026-05-12 with lint clean, typecheck
  clean, engine Vitest 497 files / 2950 tests, web Vitest 180 files /
  993 passed + 18 skipped, and repo build 5/5.
- Known non-fatal Next build warnings remain limited to optional
  `sharp/@img` packages through the DOCX/PDF path.
- The active Gate AF summary and contract files now exist. This plan is
  retained as implementation guidance and closeout context.
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
- Focused Gate AD/AE smoke passed on 2026-05-12 after this plan
  iteration: 2 files / 10 tests.
- Gate AF summary, contract, export, current-gate runner entry, and
  closeout docs now exist.
- The executable post-Gate-AE lane policy selects
  `floor_formula_surface_polish` for Gate AG.

Important namespace warning:

- The repo already has an older steel-floor Gate AF at
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`.
- That older Gate AF is landed historical work and must not be edited as
  the active slice.
- The active unfinished Gate AF is the personal-use post-flat-
  multicavity revalidation file named above.

## Research Decision - 2026-05-12

No internet or standards research is needed to implement Gate AF. Gate AF
is a no-runtime revalidation and lane-selection gate using already
landed local evidence. External research should wait until a later gate
actually promotes a new formula, tolerance, rating adapter, or source
packet. If the selected post-Gate-AF lane introduces new STC, field,
building, or impact formula behavior, use primary/official sources only
and keep measured/source rows separate from formula ownership.

Implementation-verified reasons:

- Gate AF does not introduce a new physics formula, rating conversion,
  product source row, measured holdout, or standard interpretation.
- The evidence rows for Gate AF already live in the local 40-row Gate AA
  matrix.
- The runtime values to protect are already owned by local Gate G and
  Gate AE tests.
- The selected next lane is a local prioritization decision after Gate
  AE closed the flat multicavity solver gap.
- Broad source crawling remains explicitly disfavored unless a later
  executable gate names a source-owned unblocker.

Research trigger for later gates:

- Use official/primary sources before any future gate changes an acoustic
  equation, retunes a tolerance, promotes an STC/IIC/AIIC adapter,
  promotes field/building outputs, or ingests new measured/source
  evidence.
- Do not use internet research for Gate AF closeout alone.

## Implementation-Verified Dependency Map

| Artifact | Current implementation fact | Gate AF use |
|---|---|---|
| `calculator-personal-use-mvp-coverage-sprint-gate-aa.ts` | Exports the 40-row matrix builder and summary; row count is pinned at 40. | Revalidate matrix shape, failure classes, supported values, and evidence row ids. |
| `calculator-personal-use-mvp-coverage-sprint-gate-ad.ts` | Provides the pre-Gate-AE lane scoring pattern and still selects `flat_multicavity_solver_broadening`. | Reuse the scoring shape, but do not reuse the old selected candidate; Gate AF must remove the now-landed flat lane. |
| `calculator-personal-use-mvp-coverage-sprint-gate-ae.ts` | Exports Gate AE selected-next metadata and the flat multicavity metric/budget pins. | Use as the previous selection status and as the runtime movement boundary to protect. |
| `dynamic-airborne-gate-ae-flat-multicavity.ts` | Owns `gate_ae_flat_multicavity_two_cavity_frequency_solver` and the selected candidate id. | Assert the Gate AE method/candidate remains selected for complete grouped flat multicavity input. |
| `calculator-personal-use-mvp-coverage-sprint-gate-ab.ts` | Exports grouped flat, stale topology, duplicate group, field-output, and pinned triple-leaf fixtures. | Drive no-runtime checks for complete, hostile, and basis-boundary cases. |
| `calculator-personal-use-mvp-coverage-sprint-gate-ac.ts` and web parity file | Own the flat multicavity topology surface parity targets. | Keep workbench/report/API/card parity in the focused web gate; Gate AF should not add new UI fields. |
| `packages/engine/src/index.ts` | Exports Gate AC/AD/AE and the Gate AE runtime module; no Gate AF export exists. | Add the Gate AF summary export after the summary module exists. |
| `tools/dev/run-calculator-current-gate.ts` | Current focused engine gate includes Gate AA through Gate AE; no Gate AF contract exists in the runner. | Add the Gate AF contract file to the focused engine gate after it exists. |
| `docs/calculator/README.md`, `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md` | They point to Gate AF as selected, not landed. | Update only after Gate AF summary, contract, export, runner, and focused assertions are in place. |
| Historical steel-floor Gate AF | `calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts` is already landed legacy work. | Treat as namespace collision only; do not edit it for this active Gate AF. |

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

Execute Gate AF in this exact order. Gate AF has two validation phases:

- Phase A proves implementation facts without claiming closeout docs are
  landed yet.
- Phase B updates closeout docs and then proves docs/export/runner
  alignment.

Do not mark Gate AF as landed in `CURRENT_STATE.md`,
`NEXT_IMPLEMENTATION_PLAN.md`, `docs/calculator/README.md`, or a new
checkpoint until Phase A assertions, export, and runner updates exist.

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

   Required exports:

   - `PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_LANDED_GATE`;
   - `PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS`;
   - `PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_ACTION`;
   - `PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_FILE`;
   - `PersonalUseMvpCoverageSprintGateAGLaneId`;
   - `PersonalUseMvpCoverageSprintGateAGLaneCandidate`;
   - `rankPersonalUseMvpCoverageSprintGateAGLanes`;
   - `summarizePersonalUseMvpCoverageSprintGateAF`.

   Summary fields must include `gateAAMatrixRows: 40`,
   `gapFreeAfterGateAF: true`, `noRuntimeValueMovement: true`,
   `previousSelectionStatus:
   PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS`,
   selected Gate AG lane/action/file, protected Gate AE value pins,
   protected Gate G value pins, blocked row ids, and the post-Gate-AE
   selection policy.

   Type guard:

   - Do not type the final Gate AF selection as
     `PersonalUseMvpCoverageSprintGateAELaneSelection`, because that
     type is bound to Gate AD's old selected next action/file.
   - Gate AF may copy the scoring pattern, but it needs its own
     post-Gate-AE lane ids and selected action/file types.

2. Add the Gate AF contract test at the selected file path in two
   passes.

   The contract should assert metadata, current selected status, no
   runtime value movement relative to Gate AE, matrix stability, Gate
   G/AB/AC/AD/AE continuity, basis boundaries, docs alignment, exports,
   and current-gate runner coverage.

   Phase A test cases can pass before closeout docs are updated. Phase B
   docs/export/runner alignment must pass only after steps 5-7.

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

   Stop condition:

   - If the executable score does not select
     `floor_formula_surface_polish`, do not force the planned winner.
     Update this plan and docs with the actual selected lane and why the
     evidence changed.

5. Update `packages/engine/src/index.ts`.

   Export `calculator-personal-use-mvp-coverage-sprint-gate-af` so web
   parity tests and future docs can import Gate AF constants without
   reaching into private module paths.

6. Update `tools/dev/run-calculator-current-gate.ts`.

   Add the Gate AF contract to the engine focused gate. Keep the
   existing flat multicavity web parity check in the web focused gate.

7. Update docs after the Gate AF test, export, and runner updates are
   present and Phase A assertions are green.

   Update `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`,
   `docs/calculator/README.md`, and add a Gate AF checkpoint. The docs
   should name Gate AF as landed and point to the selected next lane.
   Then run the full Gate AF contract including the docs/export/runner
   alignment assertion.

8. Run final validation and only then consider Gate AF closed.

   Minimum final commands are the focused engine command below,
   focused web parity, `pnpm typecheck`, `pnpm calculator:gate:current`,
   and `git diff --check`.

## Failure Policy

Stop Gate AF implementation and investigate instead of updating closeout
docs if any of these happen:

- the 40-row matrix is no longer 40 rows;
- `remainingCoverageGapRowIds` is not empty;
- Gate AE flat multicavity values move from
  `Rw 53 / STC 57 / C -0.6 / Ctr -8`;
- Gate G grouped triple-leaf values move from
  `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`;
- stale/duplicate/missing topology, field, building, ASTM, or IIC cases
  start returning supported runtime values;
- the runner cannot include Gate AF without broad unrelated failures;
- the selected next lane requires new standards/source research before
  it can even be named.

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

0. Optional pre-implementation smoke if you need to confirm the current
   baseline before editing:

   `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts --maxWorkers=1`

1. Focused engine after the Gate AF file exists:

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

Gate AF is complete because all of these are true:

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

## Immediate Next Steps

1. Start Gate AG at
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ag-floor-formula-surface-polish-contract.test.ts`.
2. Keep Gate AG no-runtime unless its contract proves a narrow floor
   formula surface polish can move visible prompts without changing
   formula values.
3. Preserve Gate AF pins while implementing Gate AG: Gate AE flat
   multicavity `Rw 53 / STC 57 / C -0.6 / Ctr -8`, Gate G grouped
   triple-leaf `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`, and all
   field/building/ASTM/IIC/source-crawl boundaries.
