# Next Implementation Plan

Last reviewed: 2026-04-13

This is the short execution plan for the acoustic calculator. It exists because the
long-form calculator docs contain useful history, but the current next step must be
unambiguous.

## Goal

Grow coverage and accuracy together for floor and wall acoustic outputs:

- floor and wall layer combinations should produce defensible `Rw`, `Ln,w`,
  `R'w`, `DnT,w`, and adjacent outputs where evidence supports them
- unsupported or under-described combinations should fail closed instead of
  inventing optimistic values
- layer order, duplicated layers, split layers, save/load history, and long edit
  chains must not create sudden unexplained jumps
- user-hostile input should be treated as normal input, not an edge case that can
  break routing silently

## Operating Rules

These rules govern calculator work:

- Documentation is part of the implementation.
  Keep living docs accurate, remove or archive stale guidance only when it is
  demonstrably wrong or obsolete, and preserve useful historical context when it
  still explains a current decision.
- Docs must support agentic development.
  A new agent should be able to find the current state, next step, evidence rules,
  validation commands, and deferred risks without reading every historical note.
- Accuracy and coverage move together.
  Do not widen support for more layer combinations unless the result is
  evidence-backed and labeled honestly.
- User-hostile input is expected input.
  Test many-layer stacks, duplicated roles, split layers, reorder attempts,
  missing labels, save/load replay, and mixed floor/wall route histories.
- Architecture remains deliberate.
  Portable packages must stay free of web, DOM, auth, database, billing, or
  analytics dependencies. Non-obvious routing or fail-closed behavior should have
  short code comments near the decision point.
- Tests are first-class work.
  Any behavior change needs focused tests for the new behavior plus regression
  coverage for nearby old behavior. Run the target packs before considering the
  slice complete.
- If a documented plan is completed, run broad validation.
  If broad validation is red, classify and fix or document the failures before
  selecting the next ambitious plan.

## Current Verified State

Use this as the current baseline:

- branch: `main`
- latest checked commit: `c41b4c1 Land TUAS C4c exact floor anchor`
- working tree at the start of this review was clean after the GitHub refresh;
  the checkout now carries the uncommitted review changes listed in this plan
- current uncommitted changes from this review: docs, test helpers, focused
  engine robustness guards, and tests that classify current raw drift posture
- `pnpm build`: green
- known non-blocking build warnings:
  - `sharp/@img` optional-package warnings through `proposal-docx`
  - Next.js TypeScript plugin recommendation
- first TUAS source-truth fixture refresh is green:
  - `predictor-published-family-estimate`
  - `impact-layer-stack-driven`
  - `impact-common-floor-combinations`
  - `impact-validation-regime`
  - `dynamic-floor-regression-matrix`
- raw bare CLT posture refresh is green:
  - `bare-floor-raw-support`
  - `clt-floor-monotonicity`
  - current `140 mm` raw CLT snapshot is `Rw 35`, `Ln,w 64`,
    `Ln,w+CI 64`, with standardized field outputs `R'w 33`, `L'n,w 66`,
    `L'nT,w 63.6`, and `L'nT,w+CI,50-2500 63.6`
- stale impact fixture, field/topology, upstream-parity, validation-regime, and
  wall-stability cleanup is green:
  - target pack: `7` files, `21` tests
  - validation-regime pack: `2` files, `5` tests
  - deep-hybrid runner pack: `5` files, `10` tests
  - web validation-regime pack: `2` files, `13` tests
- stable full engine-suite triage after that cleanup is green:
  - command: `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 --reporter=basic`
  - result: `93` files passed, `757` tests passed
- `pnpm build`: green after the `unsupported_gap` posture was added to the
  workbench validation-regime reporting helpers
- engine test-typing cleanup is green:
  - `pnpm --filter @dynecho/engine typecheck`
  - touched-test pack: `14` files passed, `97` tests passed
  - stable full engine suite: `93` files passed, `757` tests passed
  - `pnpm build`: green
  - closed classes: implicit `warning` / `note` callback parameter types, stale
    empty-array `never` narrowing in TUAS contract tests, nullable UBIQ candidate
    arrays, and C11c audit option/rating typing
  - no acoustic solver behavior changed in this cleanup slice
- direct broad multi-worker `vitest run` currently has all assertions green but
  can still exit non-zero from Vitest worker RPC timeout after CPU-heavy
  dynamic-airborne generated scans; use the package `test` script or the explicit
  `--maxWorkers=1` command for full validation

The currently defended floor/wall corridors match the living state docs:

- no active known solver blocker in the defended floor/wall corridors
- C4c is landed as exact `tuas_c4c_clt260_measured_2026`
- C2c, C3c, C4c, and C7c are exact combined-CLT anchors
- C5c is predictor-backed and `manualMatch: false`
- C11c is the only remaining source-backed combined-CLT row that is deliberately
  not imported
- C11c wet-stack anomaly audit is closed as "defer/fail-closed": source truth is
  known, but the weak impact tuple is not explained well enough to expose exact
  impact outputs
- wall Phase B.2 is only a narrow `double_leaf <-> lined_massive_wall` hold, not a
  general MorphologyV2 selector

## Important Doc Corrections From Review

The following rules supersede stale historical wording in older plan sections:

- the next floor move is not C4c anymore; C4c is done
- the next floor move is not C11c anymore; C11c is audited and remains deferred
- raw-floor inference widening is unblocked by C11c, but it must proceed one
  source family at a time and must not bulk-rebaseline the broad suite
- raw bare CLT should not be reopened as raw-equals-tagged parity; it now follows
  the documented `clt_bare` conservative raw-slab penalty posture
- broad engine test failures seen in a full suite run are not equivalent to
  target-slice failure; classify them before changing solver logic
- current validation commands should call `pnpm --filter <pkg> exec vitest run`,
  not `pnpm --filter <pkg> test -- <files>`, because the latter broadened the
  run in this checkout
- full engine-suite validation should use
  `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1` or
  `pnpm --filter @dynecho/engine test`; the engine package test script pins
  `--maxWorkers=1` to avoid Vitest worker RPC timeouts in CPU-heavy generated
  scan files
- full engine-suite triage is recorded in
  `FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md`; do not treat every broad-suite red as
  a solver regression without checking that classification first
- `unsupported_gap` is now a supported validation posture for source-backed but
  under-described cases that must fail closed instead of producing a
  low-confidence estimate
- accepted upstream impact parity divergences must remain explicit per metric;
  a new unlisted mismatch is a failure until it is tied to source truth
- engine package typecheck is now part of the green gate again; keep future
  strict typing debt separate from acoustic source-truth or solver widening work

## Evidence Rules

Every widening or accuracy-tightening slice must satisfy these rules:

1. Source-backed first.
   Use exact measured rows, bound rows, or explicit product/source evidence before
   any family-level inference.

2. Fail closed on ambiguity.
   Missing lower cavity, duplicate roles, mixed-material packed layers,
   under-described combined CLT stacks, and unknown user intent should not produce
   exact or high-confidence outputs.

3. Preserve route stability.
   Reordering adjacent layers, splitting merge-safe layers, duplicating neutral
   layers, or replaying saved edit history must not create large unexplained jumps.

4. Test the surface that changed.
   If a new floor or wall route becomes representative, add the first mixed/history
   guard in the same slice instead of deferring it.

5. Do not widen by accident.
   A nearby exact row must not unlock generic aliases, shorthand proxy rows,
   preset-only rows, or predictor lanes beyond the explicit scope.

## Execution Plan

### Step 0: Plan And Test Hygiene

Status: closed for the current broad-suite/typecheck triage; ongoing as a
discipline for future slices

Purpose:

- remove current ambiguity before more solver work
- separate stale fixture failures from real regressions

Work:

- keep this file as the first execution plan
- keep `CURRENT_STATE.md` as the stable-state snapshot
- keep `DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md` as the full completion ledger
- keep `SOURCE_GAP_LEDGER.md` as the source/deferred-family ledger
- keep broad-suite failures triaged into stale expectations, test builder bugs,
  real solver regressions, and intentionally unsupported surfaces before changing
  solver logic
- keep the current raw-vs-tagged exact drift set explicit:
  - Dataholz timber-frame remains the one exact row without safe raw inference
  - the TUAS raw/base-only drift rows are current posture, not a silent green
    corridor

Acceptance:

- this plan is linked from both docs indexes
- known stale C4c/C11c wording is corrected
- current target validation commands are documented
- no solver behavior changes are made during this cleanup unless a real regression
  is isolated; the isolated fixes in this review are limited to explicit-role
  routing, split-thickness exact-row selection, and test-only strict typing
  cleanup

### Step 1: C11c Wet-Stack Anomaly Audit

Status: closed as deferred / fail-closed

Purpose:

- decide whether C11c can land as a pure exact row, or must remain deferred
- prevent the weak C11c wet stack from weakening the frozen combined-CLT guards

Inputs:

- TUAS spreadsheet rows `34`, `35`, `36`, `41`, and `42`
- TUAS drawing page `30/40`
- nearby anchors: C4c, C7c, C5c, C3c, C2c
- current contracts in `tuas-clt-backlog-decision-contract.test.ts`
- current guards in `impact-predictor-input.ts` and `floor-system-estimate.ts`

Work:

- confirm the visible C11c schedule:
  - CLT 260
  - 30 mm glass wool
  - geotextile
  - 40 mm screed
  - lower suspended ceiling
- confirm source truth:
  - `Ln,w 59`
  - `Ln,w+CI 60`
  - `Ln,w+CI,50-2500 60`
  - `Rw 74`
- compare frequency behavior against C4c and C7c
- determine whether the weak impact tuple is physically/source plausible
- add an audit contract that records the decision

Decision:

- do not import `tuas_c11c_clt260_measured_2026` as an exact row in the current
  engine state
- keep the visible C11c schedule screening-only and impact-unsupported
- reason:
  - C11c source truth is `Ln,w 59`, `Ln,w+CI 60`, `Ln,w+CI,50-2500 60`, `Rw 74`
  - same-airborne C4c is `Ln,w 24`, so C11c is `35 dB` weaker on `Ln,w`
  - nearby C7c is `Ln,w 30`, so C11c is `29 dB` weaker on `Ln,w`
  - predictor-backed C5c is `Ln,w 38`, so C11c is `21 dB` weaker on `Ln,w`
  - the source-visible stack and lower ceiling are known, so the blocker is not
    missing drawings; it is unexplained wet-stack source behavior

Executable contract:

- `packages/engine/src/tuas-c11c-wet-stack-anomaly-audit.test.ts`
- current result: `2` tests green

Acceptance:

- C11c cannot silently route through C4c, C7c, C5c, or a generic combined-CLT lane
- C11c decision is defended by executable tests
- all frozen anchors remain unchanged:
  - C2c exact
  - C3c exact
  - C4c exact
  - C5c predictor-backed
  - C7c exact
- workbench output cards show support/unsupported status honestly

### Step 2: Raw And Predictor Inference Widening

Status: unblocked after C11c, still source-led and one family at a time

Purpose:

- widen useful coverage only after the source-backed combined-CLT decision is safe

Work:

- select one family at a time from the source gap ledger
- prefer exact/bound/product rows before raw family inference
- add representative hostile-input tests:
  - many layers
  - repeated identical layers
  - same material split into contiguous pieces
  - same material split with intervening roles
  - upper/lower package reorder attempts
  - missing role labels
  - preset-only rows modeled manually

Acceptance:

- new support is explicitly labeled as exact, bound, product, family estimate, or
  low confidence
- unsupported surfaces stay unsupported instead of producing optimistic values
- route snapshots do not drift under split/reorder/noise tests

### Step 3: Mixed Floor/Wall Robustness Expansion

Status: active; first post-full-suite boundary expansion, first complementary
history-grid variant expansion, and first second-wall-family seeded chain
expansion closed

Purpose:

- make sure combined floor/wall workbench routes stay stable under realistic user
  editing abuse

Work:

- expand generated mixed floor/wall matrices beyond the first current slice
- cover longer edit histories:
  - duplicate/swap grids
  - save/load roundtrips
  - mode switches between wall and floor cases
  - generated split-detour cases
- add workbench route-history tests whenever a new representative engine route is
  created

Closed slice:

- `mixed_boundary_floor_torture_expansion_v1`
  - added TUAS `C11c` combined wet fail-closed stack to the generated mixed
    engine and workbench grids
  - added Dataholz `GDMTXA04A` manual-match boundary stack to the same grids
  - no solver/catalog widening
  - guards now cover split variants, duplicate/swap/remove/rebuild histories,
    cross-mode partial-edit chains, and save/load roundtrips for both surfaces
- `mixed_history_grid_variant_expansion_v1`
  - widened the generated mixed workbench history grid from two to four
    complementary duplicate/swap/rebuild variants
  - added ascending direct trailing rebuild and descending reversed leading
    rebuild paths
  - no solver/catalog/selector/workbench behavior changed
  - confirms the same generated floor/wall final rows and route snapshots survive
    direct history parity, cross-mode partial restore chains, and save/load
    roundtrips across a broader edit-order set
- `mixed_seeded_cross_mode_wall_family_expansion_v1`
  - widened the representative mixed torture save/load chain from one wall
    detour family to two
  - added a concrete-wall detour that splits/reorders rockwool and concrete
    layers, changes the lining board, saves the scenario, and verifies reload
    parity at the saved-scenario retention boundary
  - no solver/catalog/selector/workbench store behavior changed
  - keeps the existing deep-hybrid wall detour in the same chain, so the seeded
    cross-mode matrix now exercises both framed/deep-hybrid and concrete-wall
    edit histories

Acceptance:

- engine and workbench agree on supported/unsupported outputs
- route history does not preserve stale exact matches after layer changes
- no large hidden jump appears under adjacent swaps or neutral splits

### Step 4: Wall Selector Architecture

Status: open, not the immediate next slice

Purpose:

- replace narrow wall boundary holds with a more principled selector once enough
  evidence exists

Work:

- design MorphologyV2 / score-first selection
- keep current `double_leaf <-> lined_massive_wall` hold narrow until then
- add shadow traces before behavior changes
- scan held and non-held wall palettes before widening the selector

Acceptance:

- no new broad wall family suppression without generated scans
- held boundary diagnostics stay visible to the workbench
- representative wall thickness, board, cavity, and order perturbations stay
  smooth

### Step 5: Full Suite Triage And CI Gate

Status: open

Purpose:

- turn broad-suite red output into an actionable quality gate

Work:

- rerun full engine suite intentionally
- classify each failing file
- update stale fixtures only when current source truth is already defended
- fix test builders that cannot construct current catalog rows
- isolate true solver regressions into small focused tests before changing
  production code

Acceptance:

- target slice packs stay green
- build stays green
- broad suite either passes or has a documented, intentionally quarantined list
  of non-blocking historical failures

## Validation Commands

Run target packs with `exec vitest run`:

```sh
pnpm --filter @dynecho/engine exec vitest run src/floor-library-sweep.test.ts src/floor-library-raw-parity.test.ts src/raw-floor-exact-exception-audit.test.ts
```

```sh
pnpm --filter @dynecho/engine exec vitest run src/tuas-candidate-backlog-contract.test.ts src/floor-source-corpus-contract.test.ts src/tuas-clt-backlog-decision-contract.test.ts src/floor-exact-companion-split-parity.test.ts src/floor-widening-candidate-contract.test.ts src/impact-predictor-input.test.ts
```

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculate-assembly.test.ts src/calculate-impact-only.test.ts
```

```sh
pnpm --filter @dynecho/engine exec vitest run src/floor-input-noise-parity.test.ts src/floor-gap-ledger-contract.test.ts src/tuas-support-surface-decision-contract.test.ts
```

```sh
pnpm --filter @dynecho/engine exec vitest run src/dynamic-airborne-family-boundary.test.ts src/dynamic-airborne-instability-repro.test.ts src/dynamic-airborne-order-sensitivity.test.ts src/mixed-floor-wall-complex-stack.test.ts src/mixed-floor-wall-generated-matrix.test.ts
```

```sh
pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts
```

```sh
pnpm build
```

## Definition Of Done For Any Slice

A slice is done only when:

- implementation matches the source decision
- support status is honest on engine and workbench surfaces
- hostile-input stability has at least one focused guard where relevant
- docs say what changed, what stayed fail-closed, and what is still open
- target validation commands pass
- any broad-suite failures are either fixed or explicitly classified
