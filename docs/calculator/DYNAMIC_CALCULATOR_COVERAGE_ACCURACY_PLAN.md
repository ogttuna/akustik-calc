# Dynamic Calculator Coverage And Accuracy Plan

Last reviewed: 2026-04-10

Document role:

- living execution plan for increasing dynamic-calculator coverage and numerical accuracy together
- use this when choosing the next widening or tightening slice
- this document is test-first: every slice should define its contract pack before code changes begin
- update this document as slices are selected, closed, deferred, or re-ordered

Read together with:

- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)

## 1. Why This Document Exists

The existing living docs already answer three different questions:

- `CURRENT_STATE.md`
  - what is stable right now
- `DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md`
  - what is complete, partial, or still open
- `SOURCE_GAP_LEDGER.md`
  - which floor families are safe to widen and which must stay fail-closed

What they do not yet do in one place is define the execution model for the next stage:

- how to grow coverage without weakening honesty
- how to improve accuracy without opening topology drift
- how to choose the next slice safely
- which tests must be selected before coding starts
- which documents must be updated after each slice lands

This document fills that gap.

### 1.1 Operating Rules For This Plan

These rules define how work should proceed on top of this plan.

- every slice starts with a fresh comparison between:
  - the product goal
  - the current implementation
  - the living docs
  - the currently defended corridors
- do not treat the existing plan as self-proving
  - re-check that the implementation still matches the plan before widening or tightening anything
- keep this document current while work is happening, not only after work lands
  - the active slice, latest findings, latest green validation commands, and next intended move should always be recoverable from this doc
- if a new consideration appears that was not part of the original slice framing, stop and fold it back into the plan before continuing
- if local code and docs are not enough to justify a decision, escalate to source review or external research before implementation continues
- every decision should be checked against the actual project aim:
  - broader coverage
  - better accuracy
  - no loss of honesty
  - no hidden regressions on existing defended corridors
- if a change helps one metric but weakens route honesty, support posture, or corridor clarity, treat it as suspect until proven safe

## 2. Current Architecture Reading

### 2.1 Floor Is A Route Resolver First

Current floor impact behavior is not one universal physics solver.

The current lane order is implemented in:

- [../../packages/engine/src/impact-lane.ts](../../packages/engine/src/impact-lane.ts)

Current floor lane order:

1. exact floor-system match
2. bound floor-system match
3. official impact product catalog
4. explicit `DeltaLw` heavy-reference derive
5. predictor-specific family estimate
6. narrow formula estimate
7. bound family estimate
8. general family estimate

Implication:

- the safest way to increase floor coverage is to widen exact, bound, and official-product corridors first
- the riskiest way is to expand generic formula behavior first

### 2.2 Floor Accuracy Is Family-Specific, Not Global

The main family/profile estimator lives in:

- [../../packages/engine/src/floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)

Current floor behavior depends on:

- structural family
- floor profile
- visible role topology
- predictor-input derivability
- exact/bound/product evidence above it

Implication:

- accuracy work should be scoped by family and profile
- there should not be one broad “make all floor estimates smarter” change

### 2.3 Raw Visible Layers Are Gated On Purpose

Visible-layer inference and predictor-input derivation live in:

- [../../packages/engine/src/impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)

That code deliberately blocks promotion when:

- single-entry roles are duplicated
- ceiling-board topology is ambiguous or disjoint
- helper topology is split in ways that weaken the corridor
- raw topology is role-gated and lacks enough upper/lower evidence

Implication:

- raw-layer widening should come after family evidence and estimate tightening
- otherwise the system will get broader but less honest

### 2.4 Wall Accuracy Is Mostly A Selector Problem

Current wall-side dynamic behavior is driven by:

- [../../packages/engine/src/dynamic-airborne.ts](../../packages/engine/src/dynamic-airborne.ts)
- [../../packages/engine/src/airborne-topology.ts](../../packages/engine/src/airborne-topology.ts)

Current wall flow is:

1. trim outer compliant layers
2. collapse contiguous solid groups into visible leaves
3. count cavities and summarize topology
4. hard-pick a family
5. choose a delegate blend
6. apply family-specific guards and calibration caps

Implication:

- wall-side accuracy should prioritize selector and boundary quality before coverage widening
- the next major wall gain should come from better ambiguity handling, not from importing more corridors blindly

### 2.5 Workbench Is Part Of The Solver Contract

The workbench is not a passive UI shell.

Relevant files:

- [../../apps/web/features/workbench/normalize-rows.ts](../../apps/web/features/workbench/normalize-rows.ts)
- [../../apps/web/features/workbench/scenario-analysis.ts](../../apps/web/features/workbench/scenario-analysis.ts)
- [../../apps/web/features/workbench/dynamic-calc-branch.ts](../../apps/web/features/workbench/dynamic-calc-branch.ts)
- [../../apps/web/features/workbench/simple-workbench-output-model.ts](../../apps/web/features/workbench/simple-workbench-output-model.ts)
- [../../apps/web/features/workbench/target-output-status.ts](../../apps/web/features/workbench/target-output-status.ts)

Workbench currently:

- canonicalizes some visible row arrangements before solver submission
- keeps route wording aligned to engine traces
- keeps output cards aligned to engine support buckets
- carries mixed study-mode history, save/load, and restore-to-baseline risks

Implication:

- coverage or accuracy changes are not done when engine tests pass
- route parity and support-surface parity are required parts of the slice

### 2.6 Current System Vs This Plan

This plan needs to stay aligned to the actual defended system, not to an older mental model of the repo.

What the current system already has:

- broad defended floor corridor coverage with explicit support-bucket honesty
- a meaningful mixed floor/wall route harness, including save/load and retained-snapshot surfaces
- a first seeded-family matrix that already reaches exact, bound, official-product, and `DeltaLw` branches
- route/output-card parity packs that now catch stale-surface drift earlier than before

What is still weaker than the target operating model:

- floor coverage is still corridor-heavy rather than family-complete
- estimate quality is still uneven across families and profiles
- raw widening still has more risk than remaining exact/bound/product widening
- wall accuracy is still more limited by selector architecture than by missing delegate formulas
- mixed history breadth exists, but it is not yet wide enough to be the sole regression net for new corridors

Plan correction based on the current system:

- Workstream E should not be treated as “only after everything else”
- instead, use two levels:
  - `E1`: mandatory same-slice mixed follow-up whenever a new representative corridor becomes user-visible
  - `E2`: broader generated or seeded-family history expansion after targeted corridor stabilization
- support-surface parity is not optional documentation polish anymore; it is part of calculator correctness
- route wording changes must be tested together with support posture, not after it
- the current [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md) also shows a narrower immediate priority:
  - before opening the next widening slice, broaden the pre-widening raw-floor screening and complex-stack audit surface first
- practical consequence:
  - the high-level growth order still starts with floor evidence widening
  - but the immediate next executable slice is a guard-expansion slice that makes the next widening safer

## 3. Non-Negotiable Rules

These rules apply to every next slice.

- do not widen a lane just because a nearby number looks plausible
- do not treat a formula lane as a substitute for missing source-backed family evidence
- do not reopen raw or weakly-described topologies by bypassing predictor blockers
- do not make wall results “calmer” with UI smoothing or global layer sorting
- do not ship a finite metric unless support buckets also say it is supported
- do not widen a family without preserving adjacent negative controls
- do not add a new representative preset to mixed matrices before the targeted family tests exist
- do not update status docs as if a whole problem class is closed when only a narrow corridor was defended

## 4. Workstream Model

The next stage should be run through five separate workstreams.

### 4.1 Workstream A: Floor Evidence Widening

Goal:

- land more supported floor corridors through exact rows, bound rows, and official product rows

Primary code areas:

- [../../packages/catalogs/src/floor-systems/exact-floor-systems.ts](../../packages/catalogs/src/floor-systems/exact-floor-systems.ts)
- [../../packages/catalogs/src/floor-systems/bound-floor-systems.ts](../../packages/catalogs/src/floor-systems/bound-floor-systems.ts)
- [../../packages/catalogs/src/impact/official-product-catalog.ts](../../packages/catalogs/src/impact/official-product-catalog.ts)
- [../../packages/engine/src/floor-system-match.ts](../../packages/engine/src/floor-system-match.ts)
- [../../packages/engine/src/bound-floor-system-match.ts](../../packages/engine/src/bound-floor-system-match.ts)
- [../../packages/engine/src/impact-product-catalog.ts](../../packages/engine/src/impact-product-catalog.ts)

Do first:

- same-family corridor fill
- missing exact siblings inside already-defended corridor branches
- missing bound siblings inside already-defended bound branches
- official-product rows that map cleanly onto current material classes and system types

Do not do first:

- brand new generic families with weak anchors
- raw widening that depends on those rows before exact/bound/product support is frozen

### 4.2 Workstream B: Floor Family Estimate Tightening

Goal:

- improve estimate accuracy inside already-supported corridors

Primary code areas:

- [../../packages/engine/src/floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
- [../../packages/engine/src/predictor-floor-system-estimate.ts](../../packages/engine/src/predictor-floor-system-estimate.ts)
- [../../packages/engine/src/predictor-published-family-estimate.ts](../../packages/engine/src/predictor-published-family-estimate.ts)
- [../../packages/engine/src/predictor-low-confidence-family-estimate.ts](../../packages/engine/src/predictor-low-confidence-family-estimate.ts)
- [../../packages/engine/src/lightweight-steel-fl28-estimate.ts](../../packages/engine/src/lightweight-steel-fl28-estimate.ts)
- [../../packages/engine/src/lightweight-steel-bound-estimate.ts](../../packages/engine/src/lightweight-steel-bound-estimate.ts)
- [../../packages/engine/src/composite-panel-published-interaction-estimate.ts](../../packages/engine/src/composite-panel-published-interaction-estimate.ts)

Do first:

- monotonicity tightening
- same-family interpolation tightening
- profile-boundary corrections
- estimate-basis specificity improvements

Do not do first:

- broad cross-family blending
- hidden family promotions that weaken boundary discipline

### 4.3 Workstream C: Raw And Predictor Inference Widening

Goal:

- allow more raw visible stacks to reach already-defended family lanes without false promotion

Primary code areas:

- [../../packages/engine/src/impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
- [../../packages/engine/src/floor-role-topology.ts](../../packages/engine/src/floor-role-topology.ts)
- [../../apps/web/features/workbench/normalize-rows.ts](../../apps/web/features/workbench/normalize-rows.ts)

Do first:

- raw shapes that normalize back onto already-defended family/profile corridors
- shapes that can be defended with explicit adjacent negatives

Do not do first:

- weak carriers with only helper-side evidence
- topology classes that still lack same-family source anchors

### 4.4 Workstream D: Wall Selector Accuracy

Goal:

- reduce family-handoff brittleness and improve corridor honesty

Primary code areas:

- [../../packages/engine/src/dynamic-airborne.ts](../../packages/engine/src/dynamic-airborne.ts)
- [../../packages/engine/src/airborne-topology.ts](../../packages/engine/src/airborne-topology.ts)
- [../../apps/web/features/workbench/dynamic-calc-branch.ts](../../apps/web/features/workbench/dynamic-calc-branch.ts)

Do first:

- better family scoring
- runner-up visibility
- conservative hold rules on narrow boundaries
- stronger distinction between true order-sensitive cases and false family-promotion bugs

Do not do first:

- broad new wall-family widening
- mass-law tweaks without selector evidence

### 4.5 Workstream E: Mixed Route And History Hardening

Goal:

- keep supported floor and wall corridors stable across study-mode switches, duplicate/swap paths, and save/load

Primary code areas:

- [../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
- [../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts)
- [../../apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts)
- [../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts)
- [../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts)
- [../../apps/web/features/workbench/mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts)

Do first:

- `E1`: immediately after a new representative corridor is defended on targeted floor/wall packs
- `E2`: only after a cluster of targeted corridors has settled and needs broader generated or seeded-family history coverage

## 5. Execution Order

Recommended order:

0. pre-widening audit expansion
   - extend the raw-floor screening and stress surface before the next corridor opening
1. Workstream A
   - floor evidence widening
2. Workstream B
   - family-specific accuracy tightening
3. Workstream C
   - raw/predictor widening on already-defended corridors
4. Workstream D
   - wall selector architecture and ambiguity work
5. Workstream E2
   - broader mixed history breadth expansion after the above slices settle

Mandatory parallel rule:

- run `Workstream E1` inside the same slice whenever a new corridor becomes a representative floor or wall route surface
- do not defer that first mixed/history follow-up to a later cleanup pass

Reasoning:

- the remaining-work plan still has uncovered stress surfaces around raw concrete helper reopening and adjacent heavy-hybrid negatives
- widening exact, bound, and product corridors gives the safest coverage gain
- tightening estimates then improves numerical quality where evidence already exists
- raw inference widening should reuse those stronger corridors instead of inventing its own
- wall architecture work is high value but higher regression risk
- broader mixed-mode breadth should lag behind targeted corridor stabilization, not lead it
- but the first representative mixed/history follow-up should land with the corridor, not after it

## 6. Priority Backlog By Corridor

### 6.1 Priority P0: Floor Same-Corridor Evidence Fill

These are the safest next gains.

- TUAS open-box combined corridor widening
  - work around the currently defended `R2a / R2b / R3a / R3b / R5a / R5b / R11b` family logic
  - keep `family_a` and `family_b` support-class semantics explicit
- UBIQ open-web exact and bound corridor fill
  - stay inside defended `FL-24 -> FL-26 -> FL-28` logic first
  - keep unspecified-support and crossover bound rows separate from exact lanes
- official resilient-product corridor fill
  - add exact or lower-bound rows only where current `resilient_layer` material mapping is already stable

### 6.2 Priority P1: Floor Family Accuracy Tightening

- CLT monotonicity and treatment-strength tightening
- reinforced-concrete upper-treatment tightening
- lightweight-steel interpolation and boundary tightening
- composite lower-only and combined continuation tightening

### 6.3 Priority P2: Raw-Inference Expansion

- safe normalized raw shapes that reduce to already-defended combined or exact corridors
- concrete helper-side widening only if same-family evidence remains explicit

### 6.4 Priority P3: Wall Selector Architecture

- score-based candidate ranking in shadow mode
- runner-up trace widening
- conservative hold expansion beyond the current narrow boundary
- MorphologyV2 only after the above is understood

## 7. Test-First Contract Model

No slice should begin without naming these surfaces first.

### 7.1 Required Surfaces For Every Slice

For each slice, select at least:

1. one engine positive-control test
2. one engine adjacent negative-control test
3. one workbench route-parity test
4. one support-surface or output-card parity test
5. one mixed/history follow-up if the slice introduces a new representative corridor

### 7.2 Baseline Gate Before Any Slice

Run these before code changes when the slice touches engine routing, wall family selection, or support posture.

From repo root:

```bash
pnpm vitest run \
  packages/engine/src/dynamic-guided-combination-sweep.test.ts \
  packages/engine/src/dynamic-airborne-instability-repro.test.ts \
  packages/engine/src/raw-floor-weaker-carrier-posture.test.ts \
  packages/engine/src/floor-profile-boundary-matrix.test.ts
```

From `apps/web`:

```bash
pnpm vitest run \
  features/workbench/guided-combination-sweep.test.ts \
  features/workbench/dynamic-route-instability.test.ts \
  features/workbench/floor-output-card-support-parity.test.ts \
  features/workbench/wall-output-card-support-parity.test.ts \
  features/workbench/dynamic-calc-branch.test.ts
```

Current revalidation status:

- revalidated on `2026-04-09`
- engine baseline gate: `4` files, `24` tests, green
- workbench baseline gate: `5` files, `18` tests, green

### 7.2.1 Continuous Validation Cadence

Treat validation as a running loop, not a merge-time ritual.

For every slice:

1. before edits
   - run the baseline gate if the slice touches routing, support posture, wall family selection, or user-facing branch wording
2. after the first red-green step
   - run only the targeted positive and adjacent negative tests
3. after the first route-visible change
   - run route parity plus support/output-card parity immediately
4. before widening representative presets or mixed matrices
   - run the targeted engine/workbench pack first, then add the mixed/history follow-up
5. before commit
   - rerun the targeted pack, the baseline gate, and the build gate if required

Important rule:

- do not stack multiple unverified logic changes and “test at the end”
- if a route or support surface changes, test that same surface in the same edit cycle
- if a new representative corridor is exported to presets, guided flows, or mixed helpers, `E1` becomes mandatory in that same slice

### 7.2.2 Failure Classification Rule

When a test fails mid-slice, classify it before changing logic again.

Possible classes:

- intended targeted behavior
- adjacent corridor drift
- support-bucket or output-card drift
- route wording or stale-surface contract drift
- unrelated pre-existing failure

Operational rule:

- do not “fix” a red test until it is classified
- if the failure is stale-surface drift, update the contract and mention it in the slice note
- if the failure is adjacent drift, the slice is not done even if the targeted test is green

### 7.2.3 Stress-Combination Rule

New coverage should not be defended only by a single happy-path preset.

Whenever a slice changes layer interpretation, family selection, profile boundaries, or a new representative corridor, add tests for the hardest nearby shapes as well.

Minimum expectation:

1. one canonical positive case
2. one adjacent negative case
3. one neutral split/merge or reorder-invariant case when that surface should stay invariant
4. one more-layer or helper-heavy stress case if the route depends on upper/lower package interpretation
5. one route/support-surface parity check
6. one mixed/history follow-up when the new corridor becomes user-visible in presets, guided flows, or generated helpers

Stress shapes to prefer:

- additional ceiling-board schedules
- additional helper-layer combinations in `ceiling_fill` and `ceiling_cavity`
- combined vs `upper_only` vs `lower_only` neighbors
- disjoint helper or board topology adjacent to the targeted positive corridor
- save/load and duplicate/swap histories after the route becomes representative

Important rule:

- if the new behavior only survives the canonical stack but fails on the first nearby stress shape, the slice is not mature enough

### 7.3 Workstream-Specific Test Homes

Use these files as the default homes instead of creating ad hoc new files first.

#### Workstream A: Floor Evidence Widening

Engine:

- [../../packages/engine/src/calculate-assembly.test.ts](../../packages/engine/src/calculate-assembly.test.ts)
- [../../packages/engine/src/floor-gap-ledger-contract.test.ts](../../packages/engine/src/floor-gap-ledger-contract.test.ts)
- [../../packages/engine/src/floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
- [../../packages/engine/src/floor-library-sweep.test.ts](../../packages/engine/src/floor-library-sweep.test.ts)
- [../../packages/engine/src/impact-upstream-parity-acceptance.test.ts](../../packages/engine/src/impact-upstream-parity-acceptance.test.ts)
- [../../packages/engine/src/tuas-candidate-backlog-contract.test.ts](../../packages/engine/src/tuas-candidate-backlog-contract.test.ts)
- [../../packages/engine/src/ubiq-candidate-backlog-contract.test.ts](../../packages/engine/src/ubiq-candidate-backlog-contract.test.ts)

Workbench:

- [../../apps/web/features/workbench/floor-family-regressions.test.ts](../../apps/web/features/workbench/floor-family-regressions.test.ts)
- [../../apps/web/features/workbench/floor-stack-invariance.test.ts](../../apps/web/features/workbench/floor-stack-invariance.test.ts)
- [../../apps/web/features/workbench/common-floor-combinations.test.ts](../../apps/web/features/workbench/common-floor-combinations.test.ts)
- [../../apps/web/features/workbench/guided-combination-sweep.test.ts](../../apps/web/features/workbench/guided-combination-sweep.test.ts)
- [../../apps/web/features/workbench/scenario-corridor-summary.test.ts](../../apps/web/features/workbench/scenario-corridor-summary.test.ts)
- [../../apps/web/features/workbench/consultant-decision-trail.test.ts](../../apps/web/features/workbench/consultant-decision-trail.test.ts)

Support:

- [../../apps/web/features/workbench/floor-output-card-support-parity.test.ts](../../apps/web/features/workbench/floor-output-card-support-parity.test.ts)
- [../../apps/web/features/workbench/target-output-status.test.ts](../../apps/web/features/workbench/target-output-status.test.ts)

#### Workstream B: Floor Family Estimate Tightening

Engine:

- [../../packages/engine/src/predictor-floor-system-estimate.test.ts](../../packages/engine/src/predictor-floor-system-estimate.test.ts)
- [../../packages/engine/src/predictor-published-family-estimate.test.ts](../../packages/engine/src/predictor-published-family-estimate.test.ts)
- [../../packages/engine/src/predictor-low-confidence-family-estimate.test.ts](../../packages/engine/src/predictor-low-confidence-family-estimate.test.ts)
- [../../packages/engine/src/composite-panel-published-interaction-estimate.test.ts](../../packages/engine/src/composite-panel-published-interaction-estimate.test.ts)
- [../../packages/engine/src/clt-floor-monotonicity.test.ts](../../packages/engine/src/clt-floor-monotonicity.test.ts)
- [../../packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts](../../packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts)
- [../../packages/engine/src/floor-core-coverage-matrix.test.ts](../../packages/engine/src/floor-core-coverage-matrix.test.ts)
- [../../packages/engine/src/floor-profile-boundary-matrix.test.ts](../../packages/engine/src/floor-profile-boundary-matrix.test.ts)

Workbench:

- [../../apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts](../../apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts)
- [../../apps/web/features/workbench/floor-family-regressions.test.ts](../../apps/web/features/workbench/floor-family-regressions.test.ts)
- [../../apps/web/features/workbench/complex-stack-audit.test.ts](../../apps/web/features/workbench/complex-stack-audit.test.ts)

#### Workstream C: Raw And Predictor Inference Widening

Engine:

- [../../packages/engine/src/impact-predictor-input.test.ts](../../packages/engine/src/impact-predictor-input.test.ts)
- [../../packages/engine/src/impact-raw-layer-inference.test.ts](../../packages/engine/src/impact-raw-layer-inference.test.ts)
- [../../packages/engine/src/assembly-raw-floor-inference.test.ts](../../packages/engine/src/assembly-raw-floor-inference.test.ts)
- [../../packages/engine/src/raw-floor-safe-bare-split-parity.test.ts](../../packages/engine/src/raw-floor-safe-bare-split-parity.test.ts)
- [../../packages/engine/src/raw-floor-inferred-split-parity.test.ts](../../packages/engine/src/raw-floor-inferred-split-parity.test.ts)
- [../../packages/engine/src/raw-floor-weaker-carrier-posture.test.ts](../../packages/engine/src/raw-floor-weaker-carrier-posture.test.ts)
- [../../packages/engine/src/raw-floor-screening-carrier-support.test.ts](../../packages/engine/src/raw-floor-screening-carrier-support.test.ts)

Workbench:

- [../../apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts)
- [../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts)
- [../../apps/web/features/workbench/raw-floor-weaker-carrier-route-posture.test.ts](../../apps/web/features/workbench/raw-floor-weaker-carrier-route-posture.test.ts)
- [../../apps/web/features/workbench/raw-floor-screening-route-support.test.ts](../../apps/web/features/workbench/raw-floor-screening-route-support.test.ts)
- [../../apps/web/features/workbench/raw-floor-packaged-lane-route-audit.test.ts](../../apps/web/features/workbench/raw-floor-packaged-lane-route-audit.test.ts)

#### Workstream D: Wall Selector Accuracy

Engine:

- [../../packages/engine/src/airborne-framed-wall-benchmark.test.ts](../../packages/engine/src/airborne-framed-wall-benchmark.test.ts)
- [../../packages/engine/src/airborne-masonry-benchmark.test.ts](../../packages/engine/src/airborne-masonry-benchmark.test.ts)
- [../../packages/engine/src/airborne-lined-massive-stability.test.ts](../../packages/engine/src/airborne-lined-massive-stability.test.ts)
- [../../packages/engine/src/dynamic-airborne-instability-repro.test.ts](../../packages/engine/src/dynamic-airborne-instability-repro.test.ts)
- [../../packages/engine/src/dynamic-airborne-family-boundary.test.ts](../../packages/engine/src/dynamic-airborne-family-boundary.test.ts)
- [../../packages/engine/src/dynamic-airborne-family-boundary-scan.test.ts](../../packages/engine/src/dynamic-airborne-family-boundary-scan.test.ts)
- [../../packages/engine/src/dynamic-airborne-order-sensitivity.test.ts](../../packages/engine/src/dynamic-airborne-order-sensitivity.test.ts)
- [../../packages/engine/src/dynamic-airborne-deep-hybrid-scan.test.ts](../../packages/engine/src/dynamic-airborne-deep-hybrid-scan.test.ts)
- [../../packages/engine/src/output-combination-sweep.test.ts](../../packages/engine/src/output-combination-sweep.test.ts)

Workbench:

- [../../apps/web/features/workbench/dynamic-route-instability.test.ts](../../apps/web/features/workbench/dynamic-route-instability.test.ts)
- [../../apps/web/features/workbench/dynamic-route-family-boundary.test.ts](../../apps/web/features/workbench/dynamic-route-family-boundary.test.ts)
- [../../apps/web/features/workbench/dynamic-route-family-boundary-scan.test.ts](../../apps/web/features/workbench/dynamic-route-family-boundary-scan.test.ts)
- [../../apps/web/features/workbench/dynamic-route-order-sensitivity.test.ts](../../apps/web/features/workbench/dynamic-route-order-sensitivity.test.ts)
- [../../apps/web/features/workbench/wall-seeded-edit-stability.test.ts](../../apps/web/features/workbench/wall-seeded-edit-stability.test.ts)
- [../../apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts](../../apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts)
- [../../apps/web/features/workbench/guided-route-signals.test.ts](../../apps/web/features/workbench/guided-route-signals.test.ts)

#### Workstream E: Mixed Route And History Hardening

Engine:

- [../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
- [../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts)

Workbench:

- [../../apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts)
- [../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts)
- [../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts)
- [../../apps/web/features/workbench/mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts)

### 7.4 Build Gate

Run this whenever a slice touches exported engine types, workbench route/report wiring, or doc-backed user-facing branch wording:

```bash
pnpm build
```

## 8. Slice Template

Use this template before starting work on a new slice.

### 8.1 Slice Definition

- slice id:
- workstream:
- target family/profile/evidence class:
- exact user-visible gain:
- exact non-goals:

### 8.2 Preconditions

- current corridor is already source-cleared in [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md), or this slice explicitly adds that source-backed clearance
- adjacent negative controls are identified
- targeted tests are chosen before edits begin
- active-doc comparison is written down:
  - goal vs implementation
  - goal vs living docs
  - intended gain vs likely nearby risks

### 8.3 Required Tests

- engine positive:
- engine adjacent negative:
- route parity:
- support parity:
- mixed/history follow-up:
- mid-slice rerun cadence:
- build gate required: `yes/no`

### 8.4 Exit Criteria

- targeted tests green
- no adjacent corridor silently reclassified
- output-card/support posture still honest
- docs updated in the right places

## 9. Documentation Update Protocol

After every closed slice, update the living docs in this order:

1. this file
   - mark the slice as shipped, deferred, or revised
2. [CURRENT_STATE.md](./CURRENT_STATE.md)
   - add the stable gain and the latest revalidation snapshot
3. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
   - move the item between `completed / partial / still open`
4. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
   - only if source posture or widening permission changed
5. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
   - only if the slice touched wall family selection, wall confidence, or wall boundary holds
6. [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md)
   - only when the restart point materially changes

Important rule:

- update `CURRENT_STATE.md` only for defended gains
- update `REMAINING_WORK_PLAN.md` for status movement
- update `SOURCE_GAP_LEDGER.md` only when widening posture changed, not just because more tests were added
- record the exact validation commands and green counts when a slice closes

### 9.1 Live Progress Logging Rule

This file should stay compact but always answer these questions:

- where are we now
- what are we actively testing
- what new finding changed the route
- what is still risky
- what should happen next

At minimum, keep the live state block current when:

- a slice is selected
- a new finding changes the planned route
- a test pack becomes the active gate
- a slice is paused, deferred, or closed

## 10. Recommended Immediate Starting Sequence

The safest next execution sequence is:

1. re-rank the next widening-first corridor now that the TUAS open-box shortlist is no longer blocked by `R7a`
2. raw-floor stress-audit expansion beyond the current first widened cohort
   - widen raw concrete helper permutations, adjacent heavy-hybrid negatives, and route/support audits before any broader screening-carrier reopening
3. floor same-corridor evidence fill
   - continue with UBIQ and official-product rows after the post-`R7a` ranking is refreshed
4. floor family-specific tightening
   - CLT, reinforced concrete, lightweight steel, composite
5. raw inference widening only on the newly frozen corridors
6. wall selector scoring and ambiguity work
7. mixed long-chain breadth expansion after the above slices settle

What this means in practice:

- the next slice is no longer the `R7a` branch decision or the UBIQ provenance freeze
- the immediate next slice should strengthen the mixed/history regression net before another widening or selector move
- the stricter raw-floor reopening audit still remains separate and still blocks any broader screening-carrier reopening
- each floor widening slice should carry its own first mixed/history follow-up if it makes a new corridor representative
- wall work should stay narrow until selector scoring and hold behavior are easier to reason about from traces
- raw widening should only happen after the matching evidence corridor and family/profile boundary tests are already green
- docs should be updated at slice close, not batched after several slices

If only one slice should start now, the best candidate is:

- a mixed floor/wall representative chain expansion slice

Reason:

- the first guard slice, the first TUAS branch-design close-out, the official-product representative closure, and the UBIQ provenance freeze are already done
- the next safest gain is a stronger mixed/history guardrail before the next fresh coverage or selector decision
- wall still has higher selector-regression risk
- the raw-screening audit still matters, but it is now a separate reopening rule rather than the current first blocking task
- raw inference and corridor widening are safer once the mixed regression net is a bit broader

Important notes for the next operator:

- floor exact/bound/product widening is the current high-confidence lever
- support parity and route wording are part of correctness, not follow-up cleanup
- mixed generated breadth is already useful, but it is still a secondary net after targeted corridor packs
- the first sign of a bad slice will usually be adjacent profile drift, not a dramatic broad failure
- if a change looks numerically better but moves a route from `exact/bound/product` to a broader estimate lane, treat that as suspect until proven safe

## 11. Current Decision

This document now establishes the rule for the next stage:

- immediate next execution step is to expand the mixed/history regression net from the current representative seeded-family baseline
- after that decision, coverage keeps growing through evidence corridors first
- accuracy improves through family-specific tightening second
- raw inference widening still stays behind the separate screening-reopen guardrail
- wall selector architecture improves before broad wall widening
- every slice is selected with its test pack up front

That should remain the operating model unless a future living doc explicitly replaces it.

## 12. Live Working State

Current stage:

- first pre-widening guard slice closed
- first source-led TUAS branch-audit slice closed
- first upper-EPS open-box branch-design slice closed
- post-`R7a` revalidation and living-doc sync pass closed
- broader raw-floor negative audit expansion closed
- official-product representative breadth closure closed
- UBIQ provenance/boundary-freeze decision closed
- mixed floor/wall representative chain expansion closed
- official no-screed exact mixed follow-up closed
- Dataholz CLT exact slack tightening closed
- Dataholz GDMTXA04A manual-match boundary decision closed
- raw-floor negative audit expansion v3 closed
- open-web helper continuation boundary decision closed
- open-web noncanonical continuation parity follow-up closed
- TUAS deferred shortlist drawing audit closed
- next wall selector shadow-trace audit selected

Active slice:

- slice id: `wall_selector_shadow_trace_audit_v1`
- workstream: `D` wall selector accuracy
- status: `selected`
- current objective:
  - audit the currently defended wall hold corridor as a selector-trace problem before any broader wall widening
  - freeze which winner / runner-up / hold diagnostics are already stable on the `double_leaf <-> lined_massive_wall` corridor
  - identify the smallest next trace or scoring surface that improves selector honesty without reopening wall families
- current non-goals:
  - no broad wall-family widening
  - no MorphologyV2 rewrite
  - no mass-law or delegate retune without selector-trace evidence
  - no new floor corridor widening in the same slice
- selected test pack before first edit:
  - engine:
    - `pnpm exec vitest run packages/engine/src/dynamic-airborne-family-boundary.test.ts packages/engine/src/dynamic-airborne-family-boundary-scan.test.ts packages/engine/src/dynamic-airborne-order-sensitivity.test.ts packages/engine/src/dynamic-airborne-instability-repro.test.ts`
  - workbench:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/dynamic-route-family-boundary.test.ts features/workbench/dynamic-route-family-boundary-scan.test.ts features/workbench/dynamic-route-order-sensitivity.test.ts features/workbench/dynamic-route-instability.test.ts features/workbench/dynamic-calc-branch.test.ts`
- pause baseline before the next edit is green:
  - engine: `4` files, `23` tests
  - workbench: `5` files, `28` tests
- pause-safe restart protocol:
  - read this live-state block first
  - then read:
    - [CURRENT_STATE.md](./CURRENT_STATE.md)
    - [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
    - [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
  - rerun the selected wall test pack before any edit
  - then inspect the current defended wall hold corridor in:
    - [dynamic-airborne-family-boundary.test.ts](../../packages/engine/src/dynamic-airborne-family-boundary.test.ts)
    - [dynamic-airborne-family-boundary-scan.test.ts](../../packages/engine/src/dynamic-airborne-family-boundary-scan.test.ts)
    - [dynamic-airborne-order-sensitivity.test.ts](../../packages/engine/src/dynamic-airborne-order-sensitivity.test.ts)
    - [dynamic-route-family-boundary.test.ts](../../apps/web/features/workbench/dynamic-route-family-boundary.test.ts)
    - [dynamic-route-family-boundary-scan.test.ts](../../apps/web/features/workbench/dynamic-route-family-boundary-scan.test.ts)
    - [dynamic-calc-branch.test.ts](../../apps/web/features/workbench/dynamic-calc-branch.test.ts)

Latest route-control finding:

- the TUAS deferred shortlist drawing audit is now also closed:
  - `TUAS2023FloorDetails.pdf` page `5/7` visually confirms the existing `family_a` vs `family_b` split remains correct
  - `R6a` and `R10a` stay deferred because they require mixed board / staged dry-pack surfaces the current exact route cannot encode honestly
  - `R7b`, `R8b`, `R9b`, and `R2c` stay deferred because they require hybrid lower-treatment surfaces outside the defended `family_a` / `family_b` split
  - `R2c` still does not justify any `__none` topology widening
- because that audit produced no honest new TUAS import candidate, the floor evidence path does not currently justify another immediate open-box widening slice
- the clean next move is therefore to tighten wall selector evidence before reopening broader wall work:
  - wall remains only partially complete on the narrow `double_leaf <-> lined_massive_wall` hold corridor
  - mixed/history net is already materially stronger than it was at the start of this plan
  - a narrow selector-trace audit now has a better effort-to-safety ratio than forcing another floor import from weak visible evidence
- the TUAS audit closure is now validated on the selected slice pack:
  - engine selected baseline: `4` files, `187` tests, green
  - workbench selected baseline: `2` files, `68` tests, green
- the current repo is stronger on mixed/history and support-surface discipline than the earlier draft of this plan assumed
- because of that, mixed work should be split into:
  - `E1`: mandatory same-slice representative follow-up
  - `E2`: later broader generated/seeded expansion
- the living remaining-work plan previously narrowed the immediate move to a pre-widening raw-floor guard slice before the first corridor decision
- that prerequisite is now closed
- the first pass on that guard slice exposed a real gap:
  - a helper-fill wall-like heavy hybrid (`gypsum_board + rockwool + concrete + gypsum_board`) was incorrectly reopening field-side `Rw`
  - the guard is now narrowed so helper-based reopening only applies when concrete is the terminal inferred base layer under a pure ceiling-side helper package
- the first corridor decision pass after that guard slice is now also clearer:
  - official-product currently does not expose a near-term widening backlog large enough to justify the first post-guard slice
  - UBIQ weaker-band widening (`FL-23/25/27`) remains deliberately deferred after a fresh primary-source check of the May 2023 brochure
  - the first real corridor decision slice should therefore move to TUAS open-box branch audit, not to UBIQ weaker-band import
- that TUAS branch-audit line is now fully closed:
  - `R6b` is safe as a narrow exact-only reinforced branch because its stronger lower treatment is already representable on the current role/material surface
  - `R7a` is now safe as a narrow exact-only heavy/wet branch because the slice added:
    - an honest upper-EPS-board surface
    - explicit `upper_fill` inference on engine and workbench paths
    - a selector guard so non-dry upper packages do not collapse into the `basic` open-box estimate
- the same close-out also corrected one stale nearby contract:
  - under-described direct-fixed CLT dry stacks do not currently qualify as a defended combined-family lane
  - they now stay screening-only / fail-closed on impact outputs
- the immediate follow-up requirement after the `R7a` close-out was documentation truthfulness, not another solver change:
  - the targeted living docs are now aligned with the landed `R7a` branch and the corrected direct-fixed CLT contract
  - the next real code slice can now proceed from that frozen route-control state
- the post-`R7a` ranking result is now explicit:
  - official-product remains useful, but there is no immediately queued row set with a better effort-to-safety ratio than the remaining raw-floor guard work
  - UBIQ weaker-band widening stays deliberately deferred, and source-trace cleanup is still more provenance than coverage
  - the highest-confidence next slice is therefore a broader raw-floor negative audit before the next corridor-opening decision
- that broader raw-floor negative audit is now also closed on its first widened pass:
  - mixed-order ceiling-helper concrete schedules still reopen field-side `Rw` when concrete remains the terminal inferred base layer
  - disjoint `board + fill + board + cavity + concrete` helper schedules also keep that same reopened carrier posture
  - adding a top-side floor finish above the concrete closes the helper-side `Rw` reopening again
  - helper-heavy lightweight-steel raw rows remain fail-closed on the same adjacent stress surface
  - this widening needed no solver change; the current guard was already honest on those adjacent cases
- the source corpus reference also needed a correction:
  - a `2026-04-09` Mendeley public API recheck confirmed the current published drawing/detail files are:
    - `TUAS2023FloorConstructionDrawingsR1.pdf`
    - `TUAS2023FloorDetails.pdf`
  - older local wording that referenced a differently named construction PDF should be treated as stale provenance, not as the current source of truth
- the corridor re-rank is now resolved:
  - official-product representative breadth is now closed on already-imported rows
  - UBIQ provenance/boundary-freeze is now also closed as docs plus contract work
  - the clean next move is therefore mixed/history regression-net expansion, not another immediate coverage slice
- a `2026-04-09` official-source recheck also supports that choice:
  - REGUPOL curve 8 technical data still publishes the current exact and lower-bound assemblies
  - REGUPOL sonus multi 4.5 technical data still publishes the current ceramic-tile and porcelain exact assemblies
  - Getzner AFM catalog still publishes the current AFM `21/23/26/29/33/35` DeltaLw rows
- the pre-edit workbench baseline also exposed one unrelated watchpoint:
  - the broad-file `scenario-analysis.test.ts` pack currently has two stale expectation drifts on non-official fallback cases
  - those reds pre-date the chosen official-product slice and should be tracked as `pre-existing baseline drift`, not as a blocker that broadens this slice away from official-product work
- that official-product representative breadth slice is now also closed:
  - workbench preset surface now exposes a second official exact resilient-underlay branch through:
    - `REGUPOL sonus multi 4.5` tile exact
    - `REGUPOL sonus multi 4.5` porcelain exact
  - workbench preset surface now also exposes a wider product-delta range through:
    - `Getzner AFM 21`
    - `Getzner AFM 35`
  - mixed generated engine and route surfaces now include:
    - `REGUPOL sonus multi 4.5` porcelain exact
    - `Getzner AFM 35`
  - the slice kept solver and catalog behavior unchanged:
    - no new official catalog row
    - no new fallback lane
    - no UBIQ widening
  - after that closure the next clean floor evidence task is no longer official-product representation
    - it is UBIQ provenance and boundary freeze before any weaker-band conversation resumes
- that UBIQ provenance/boundary-freeze slice is now also closed:
  - a fresh May 2023 brochure recheck still shows visible FRL/D family drift:
    - steel joist / purlin -> `FL-17 (FRL/D)`
    - open-web / rolled steel -> `FL-28 (FRL/D)`
  - the landed decision is deliberately narrow:
    - freeze the current `ubiq_fl32_*` and `ubiq_fl33_*` rows as stable internal ids and labels
    - freeze the shared official brochure URL on the full current bound cluster
    - keep `FL-23/25/27` explicitly deferred
  - the slice does not widen coverage and does not rename runtime ids
  - the clean next move is now a mixed/history regression-net expansion before the next new widening or selector slice
- that mixed/history representative-chain slice is now also closed:
  - the compact representative save/load matrix now includes `UBIQ steel 250 bound`
  - the generated mixed engine/route surface already had that interpolation-steel lower-bound branch, so the landed change closed a mixed save/load coverage gap rather than widening solver or catalog behavior
  - the representative operator-history depth is now one wall detour plus three neighboring seeded-family detour chains, not only one or two
  - the next clean mixed follow-up is now the official no-screed exact product topology already present in generated and preset surfaces:
    - `REGUPOL Multi 4.5 porcelain exact`
- that official no-screed exact mixed follow-up slice is now also closed:
  - the compact representative save/load matrix now includes `REGUPOL Multi 4.5 porcelain exact`
  - generated and preset surfaces already had that topology, so the landed change closed a mixed save/load gap instead of widening solver or catalog behavior
  - after that closure, mixed/history is no longer the first blocker:
    - the clean next move is exact-preserving Dataholz CLT tightening on the imported dormant slack
- the first pass on that selected Dataholz CLT tightening line corrected one plan assumption before code landed:
  - `dataholz_gdmnxn02_wet_clt_lab_2026` was already predictor-exact active through an existing `estimateMatch`
  - `dataholz_gdmnxn02_05_wet_clt_lab_2026` was the narrow missing predictor-exact wet/fill fingerprint
  - `dataholz_gdmtxa04a_clt_lab_2026` is not the same class of slack because `manualMatch: false` keeps it outside predictor exact resolution
- that narrowed Dataholz CLT exact slack slice is now also closed:
  - `dataholz_gdmnxn02_05_wet_clt_lab_2026` now resolves as an exact row from explicit predictor input
  - existing visible exact behavior for that row stayed intact
  - adjacent wet-family estimate behavior stayed intact for near-but-not-exact heavy-floating CLT predictor input
  - `dataholz_gdmtxa04a_clt_lab_2026` now has an explicit adjacent negative guard so the remaining CLT slack cannot silently blur into a dry exact reopen
  - after that closure the next honest move is no longer “more Dataholz slack by default”:
    - the only remaining imported CLT exact-only row is now a manual-match boundary decision, not another straightforward fingerprint addition
- that GDMTXA04A manual-match boundary slice is now also closed:
  - the official source review confirmed the `65 mm` top dry-floor layer is still under-described as an areal-mass entry rather than a named generic board/product
  - the nearby `GDMTXA01a` source still names an explicit `Rigidur` dry-screed element, so the two rows are not equally specific on the visible surface
  - the landed decision is therefore conservative:
    - keep `gdmtxa04a` exact only through direct curated id resolution
    - keep raw/tagged visible and predictor surfaces on the dry CLT estimate route
    - freeze that honesty on both engine and workbench route-summary surfaces
  - after that closure the next honest move is no longer another CLT boundary experiment:
    - it is a second wider raw-floor negative audit pass
- that second wider raw-floor negative audit pass is now also closed:
  - helper-heavy `steel_joist_floor` raw and tagged rows now sit on the same defended fail-closed surface as the earlier lightweight-steel helper-heavy guard
  - wider wall-like heavy-concrete hybrids now also stay frozen on the same screening-only heavy-floor posture when the helper package grows beyond the first single-fill shape:
    - split fill on both sides of the concrete core
    - `board + fill + board + concrete + board` mixed helper topology
  - this slice again needed no solver change:
    - the current guard and support buckets were already honest on those adjacent cases
    - the landed work freezes them on engine, route, and output-card layers
  - a new adjacent boundary question surfaced during local probing:
    - raw/tagged `gypsum_board + rockwool + gypsum_board + open_web_steel_floor` currently lands on `low_confidence` / local-guide continuation, not on the fail-closed weaker-carrier surface
    - current docs and source-ledger posture mean that should not be auto-treated as a bug or auto-promoted as a defended packaged lane
    - it is now a dedicated next boundary-decision slice instead
  - `2026-04-09` validation for this close-out:
    - targeted engine: `2` files, `4` tests, green
    - targeted workbench: `3` files, `5` tests, green
    - selected baseline engine: `4` files, `18` tests, green
    - selected baseline workbench: `4` files, `8` tests, green
- that open-web helper continuation boundary slice is now also closed:
  - the landed decision is conservative and source-backed:
    - explicit `ceiling_board + ceiling_fill + ceiling_board + open_web_steel_floor` does not stay fail-closed
    - it also does not stay on the defended contiguous `FL-26` family-general packaged lane
    - it now remains frozen as a same-family `low_confidence` continuation anchored to:
      - `ubiq_fl24_open_web_steel_300_16mm_exact_lab_2026`
  - why this is the honest boundary:
    - the imported exact corpus already contains visible `FL-24` open-web rows with direct `2 x 13 mm` plasterboard lower lining
    - the live stack still has split lower-board topology plus extra fill and no explicit `INEX FLOOR` top package
    - current engine notes and warnings therefore keep it below the narrower same-family corridor instead of fabricating an exact or `family_general` lane
  - landed implementation scope:
    - no solver change
    - engine note/warning contract added for the noncanonical lower-board split topology
    - engine and route boundary matrices now freeze the same `low_confidence` candidate and live-output posture
  - `2026-04-09` validation for this close-out:
    - targeted engine: `2` files, `18` tests, green
    - targeted workbench: `1` file, `14` tests, green
    - adjacent engine pack: `5` files, `28` tests, green
    - adjacent workbench pack: `5` files, `23` tests, green
- that open-web noncanonical continuation parity follow-up slice is now also closed:
  - the slice exposed a real parity bug rather than just a missing stress test:
    - the frozen `FL-24`-anchored low-confidence continuation held on the direct `13 + 13` lower-board topology
    - but it dropped back to screening-only when those same two `13 mm` board segments were entered as merge-safe splits (`6.5 + 6.5` on each side of the fill)
  - the root cause was narrow and implementation-local:
    - packed board-schedule equivalence inside `floor-system-evaluation.ts` was still tying layer-count and thickness equivalence to material-match equivalence
    - that made schedule-equivalent gypsum splits lose the same continuation that the unsplit gypsum schedule already held
  - the landed fix keeps the posture conservative while restoring parity:
    - material matching is still required for the material signal
    - but merge-safe packed schedule equivalence now also preserves layer-count and thickness signals for the same physical lower-board schedule
    - no new exact lane, no `family_general` reopen, and no weaker-carrier reopening landed in the same slice
  - landed parity surface:
    - engine split-layer parity now includes the noncanonical `gypsum + rockwool + gypsum + open-web` continuation
    - engine board-order parity now includes split board clusters on both sides of the fill
    - workbench raw-vs-tagged split parity now includes the same continuation
    - workbench duplicate/remove/rebuild edit-path parity now includes the same continuation
  - `2026-04-09` validation for this close-out:
    - targeted engine: `2` files, `4` tests, green
    - targeted workbench: `2` files, `2` tests, green
    - selected baseline engine: `4` files, `22` tests, green
    - selected baseline workbench: `4` files, `19` tests, green
    - adjacent engine: `3` files, `267` tests, green
    - adjacent workbench: `3` files, `80` tests, green

Latest green baseline gate:

- date: `2026-04-09`
- engine baseline gate:
  - `4` files
  - `24` tests
  - green
- workbench baseline gate:
  - `5` files
  - `18` tests
  - green

Active slice gate:

- revalidated on `2026-04-09`
- landed official no-screed exact mixed follow-up gate:
  - engine:
    - `pnpm exec vitest run packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts packages/engine/src/mixed-floor-wall-generated-matrix.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts`
    - `4` files
    - `253` tests
    - green
  - workbench:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/mixed-study-mode-torture.test.ts features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts features/workbench/official-product-preset-breadth.test.ts features/workbench/floor-output-card-support-parity.test.ts features/workbench/wall-output-card-support-parity.test.ts`
    - `7` files
    - `13` tests
    - green
- pre-edit baseline for the selected Dataholz CLT exact slack slice:
  - engine:
    - `pnpm exec vitest run packages/engine/src/clt-floor-monotonicity.test.ts packages/engine/src/floor-widening-candidate-contract.test.ts packages/engine/src/floor-source-corpus-contract.test.ts packages/engine/src/mixed-floor-wall-generated-matrix.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts`
    - `6` files
    - `259` tests
    - green
  - workbench:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/floor-full-preset-contract-matrix.test.ts features/workbench/dynamic-calc-branch.test.ts features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/floor-output-card-support-parity.test.ts`
    - `5` files
    - `70` tests
    - green
- landed Dataholz CLT exact slack targeted guard gate:
  - engine:
    - `pnpm exec vitest run packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts packages/engine/src/floor-source-corpus-contract.test.ts`
    - `3` files
    - `256` tests
    - green
- landed Dataholz CLT exact slack gate:
  - engine:
    - `pnpm exec vitest run packages/engine/src/clt-floor-monotonicity.test.ts packages/engine/src/floor-widening-candidate-contract.test.ts packages/engine/src/floor-source-corpus-contract.test.ts packages/engine/src/mixed-floor-wall-generated-matrix.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts`
    - `6` files
    - `262` tests
    - green
  - workbench:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/floor-full-preset-contract-matrix.test.ts features/workbench/dynamic-calc-branch.test.ts features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/floor-output-card-support-parity.test.ts`
    - `5` files
    - `70` tests
    - green
- pre-edit baseline for the selected GDMTXA04A boundary slice:
  - engine:
    - `pnpm exec vitest run packages/engine/src/impact-predictor-input.test.ts packages/engine/src/assembly-raw-floor-inference.test.ts packages/engine/src/clt-floor-monotonicity.test.ts packages/engine/src/floor-source-corpus-contract.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts`
    - `6` files
    - `306` tests
    - green
  - workbench:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/floor-full-preset-contract-matrix.test.ts features/workbench/dynamic-calc-branch.test.ts features/workbench/workbench-store.test.ts features/workbench/floor-output-card-support-parity.test.ts`
    - `5` files
    - `95` tests
    - green
- landed GDMTXA04A boundary targeted gate:
  - engine:
    - `pnpm exec vitest run packages/engine/src/calculate-assembly.test.ts`
    - `1` file
    - `169` tests
    - green
  - workbench:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/dynamic-calc-branch.test.ts`
    - `1` file
    - `7` tests
    - green
- landed GDMTXA04A boundary gate:
  - engine:
    - `pnpm exec vitest run packages/engine/src/impact-predictor-input.test.ts packages/engine/src/assembly-raw-floor-inference.test.ts packages/engine/src/clt-floor-monotonicity.test.ts packages/engine/src/floor-source-corpus-contract.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts`
    - `6` files
    - `307` tests
    - green
  - workbench:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/floor-full-preset-contract-matrix.test.ts features/workbench/dynamic-calc-branch.test.ts features/workbench/workbench-store.test.ts features/workbench/floor-output-card-support-parity.test.ts`
    - `5` files
    - `96` tests
    - green
- landed mixed representative-chain interpolation-steel gate:
  - engine:
    - `pnpm vitest run packages/engine/src/mixed-floor-wall-complex-stack.test.ts packages/engine/src/mixed-floor-wall-generated-matrix.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts`
    - `4` files
    - `252` tests
    - green
  - workbench:
    - `pnpm vitest run --config vitest.config.ts features/workbench/mixed-study-mode-torture.test.ts features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts features/workbench/floor-output-card-support-parity.test.ts features/workbench/wall-output-card-support-parity.test.ts`
    - `6` files
    - `11` tests
    - green
- landed UBIQ provenance/boundary-freeze gate:
  - engine:
    - `pnpm vitest run packages/engine/src/floor-source-corpus-contract.test.ts packages/engine/src/ubiq-candidate-backlog-contract.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts packages/engine/src/predictor-published-family-estimate.test.ts`
    - `5` files
    - `276` tests
    - green
  - workbench:
    - `pnpm vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/dynamic-calc-branch.test.ts features/workbench/floor-full-preset-contract-matrix.test.ts`
    - `3` files
    - `67` tests
    - green
- green predecessor gate for the immediately previous official-product slice:
  - engine:
    - `pnpm vitest run packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
    - `4` files
    - `253` tests
    - green
  - workbench:
    - `pnpm vitest run --config vitest.config.ts features/workbench/floor-full-preset-contract-matrix.test.ts features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts features/workbench/official-product-preset-breadth.test.ts features/workbench/floor-output-card-support-parity.test.ts`
    - `6` files
    - `11` tests
    - green
- pre-edit baseline for the selected official-product slice:
  - engine:
    - `pnpm vitest run packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts`
    - `3` files
    - `252` tests
    - green
  - workbench broad candidate pack:
    - `pnpm vitest run --config vitest.config.ts features/workbench/floor-full-preset-contract-matrix.test.ts features/workbench/scenario-analysis.test.ts features/workbench/mixed-study-mode-torture.test.ts`
    - `3` files
    - `75` tests
    - not green
    - classification:
      - `features/workbench/scenario-analysis.test.ts`
      - `2` pre-existing broad-family expectation drifts
      - not adjacent to official-product preset breadth
- the latest executed green guardrail gate after closing `raw_floor_negative_audit_expansion_v2` is:
  - engine:
    - `pnpm vitest run packages/engine/src/raw-floor-screening-carrier-support.test.ts packages/engine/src/raw-floor-weaker-carrier-posture.test.ts packages/engine/src/raw-floor-packaged-lane-audit.test.ts packages/engine/src/assembly-raw-floor-inference.test.ts`
    - `4` files
    - `18` tests
    - green
  - workbench:
    - `pnpm vitest run --config vitest.config.ts features/workbench/raw-floor-screening-route-support.test.ts features/workbench/raw-floor-weaker-carrier-route-posture.test.ts features/workbench/raw-floor-packaged-lane-route-audit.test.ts features/workbench/floor-output-card-support-parity.test.ts`
    - `4` files
    - `8` tests
    - green
- the latest broader executed green gate is still the post-`R7a` adjacent + baseline revalidation below
- engine adjacent + baseline gate:
  - command:
    - `pnpm vitest run packages/engine/src/predictor-published-family-estimate.test.ts packages/engine/src/impact-predictor-input.test.ts packages/engine/src/calculate-assembly.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/floor-source-corpus-contract.test.ts packages/engine/src/tuas-candidate-backlog-contract.test.ts packages/engine/src/tuas-post-corridor-screening-contract.test.ts packages/engine/src/dynamic-floor-regression-matrix.test.ts packages/engine/src/dynamic-guided-combination-sweep.test.ts packages/engine/src/dynamic-airborne-instability-repro.test.ts packages/engine/src/raw-floor-weaker-carrier-posture.test.ts packages/engine/src/floor-profile-boundary-matrix.test.ts`
  - `12` files
  - `353` tests
  - green
- workbench adjacent + baseline gate:
  - command:
    - `pnpm vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/floor-output-card-support-parity.test.ts features/workbench/workbench-store.test.ts features/workbench/guided-combination-sweep.test.ts features/workbench/dynamic-route-instability.test.ts features/workbench/wall-output-card-support-parity.test.ts features/workbench/dynamic-calc-branch.test.ts`
  - `7` files
  - `103` tests
  - green
- slice result:
  - `dataholz_gdmtxa04a_manual_match_boundary_decision_v1` is `closed`
  - the slice landed as a conservative evidence decision, not a solver widening:
    - `gdmtxa04a` stays preset-only exact on direct curated id resolution
    - raw/tagged visible and predictor surfaces stay on the dry CLT estimate lane
    - route wording now also defends that honesty explicitly
  - `raw_floor_negative_audit_expansion_v3` is now also `closed`
    - the new defended negatives are steel-joist helper-heavy fail-closed packages plus two wider wall-like heavy-concrete helper variants
  - `open_web_helper_continuation_boundary_decision_v1` is now also `closed`
    - the noncanonical gypsum/rockwool/gypsum open-web lower package is now frozen on the conservative `FL-24`-anchored low-confidence continuation
  - `open_web_noncanonical_continuation_parity_followup_v1` is now also `closed`
    - the same continuation now survives split-board, split-fill, raw-vs-tagged, and duplicate/remove/rebuild edit-path detours
    - the landed fix was an evaluator parity correction, not a new widening lane
  - the next selected slice is now `tuas_deferred_shortlist_drawing_audit_v1`
    - the immediate next gain is source-led corridor ranking on the still-deferred TUAS shortlist, not another adjacent raw or open-web parity slice

- slice id: `open_web_noncanonical_continuation_parity_followup_v1`
- workstream: `E1` same-slice regression follow-up
- status: `closed`
- landed scope:
  - added engine split-layer parity for the noncanonical `gypsum + rockwool + gypsum + open-web` continuation
  - added engine board-cluster order parity for the same continuation
  - added workbench raw-vs-tagged split parity for the same continuation
  - added workbench duplicate/remove/rebuild edit-path parity for the same continuation
  - tightened `floor-system-evaluation.ts` so packed board-schedule equivalence preserves layer-count/thickness signals even when material match remains a separate missing signal
- explicit non-landed scope:
  - no new exact row
  - no `family_general` reopen
  - no weaker-carrier reopening
  - no new UBIQ weaker-band decision

Closed slice:

- slice id: `dataholz_gdmtxa04a_manual_match_boundary_decision_v1`
- workstream: `B` family-specific tightening boundary decision
- status: `closed`
- landed scope:
  - reviewed the official source posture behind the remaining manual-match-disabled Dataholz CLT row
  - froze `gdmtxa04a` as estimate-only on visible and predictor surfaces
  - added engine and workbench route-summary contracts so that honesty is explicit rather than implicit
- explicit non-landed scope:
  - no new material surface
  - no manual visible exact reopen
  - no predictor exact reopen
  - no generic CLT widening

- slice id: `dataholz_clt_exact_slack_tightening_v1`
- workstream: `B` family-specific tightening
- status: `closed`
- landed scope:
  - added a source-backed `estimateMatch` fingerprint for `dataholz_gdmnxn02_05_wet_clt_lab_2026`
  - aligned source-corpus contract truth so only `dataholz_gdmtxa04a_clt_lab_2026` remains exact-only slack
  - added an adjacent predictor-input negative guard that freezes `dataholz_gdmtxa04a_clt_lab_2026` on the dry CLT estimate route
- explicit non-landed scope:
  - no generic CLT widening
  - no manual visible exact reopen for `dataholz_gdmtxa04a_clt_lab_2026`
  - no raw inference widening
  - no mixed/history breadth expansion

- slice id: `mixed_official_no_screed_exact_followup_v1`
- workstream: `E1` same-slice mixed regression-net expansion
- status: `closed`
- landed scope:
  - added `REGUPOL Multi 4.5 porcelain exact` to the compact representative seeded save/load matrix in the mixed torture surface
  - kept route/support parity aligned with the already-defended generated and preset official no-screed exact topology
  - closed the remaining mixed save/load gap on the first official no-screed exact product class
- explicit non-landed scope:
  - no solver behavior change
  - no catalog row import
  - no broader mixed-family widening
  - no wall selector-hold widening

- slice id: `mixed_seeded_floor_wall_chain_expansion_v1`
- workstream: `E1` same-slice mixed regression-net expansion
- status: `closed`
- landed scope:
  - added `UBIQ steel 250 bound` to the compact representative seeded save/load matrix in the mixed torture surface
  - widened the representative operator-history chain from a wall detour plus two neighboring seeded-family chains to a wall detour plus three neighboring seeded-family chains
  - kept route/support parity and generated mixed coverage aligned on the same interpolation-steel lower-bound branch
- explicit non-landed scope:
  - no solver behavior change
  - no catalog row import
  - no official-product widening in the same slice
  - no wall selector-hold widening

- slice id: `ubiq_provenance_boundary_freeze_decision_v1`
- workstream: `A` widening-first corridor boundary freeze
- status: `closed`
- landed scope:
  - froze the full current UBIQ bound source cluster in engine contracts:
    - steel joist / purlin internal ids:
      - `ubiq_fl32_steel_200_lab_2026`
      - `ubiq_fl32_steel_300_lab_2026`
    - open-web / rolled steel internal ids:
      - `ubiq_fl33_open_web_steel_200_lab_2026`
      - `ubiq_fl33_open_web_steel_300_lab_2026`
      - `ubiq_fl33_open_web_steel_400_lab_2026`
  - froze the shared official brochure URL on that same cluster
  - documented the visible FRL/D family drift explicitly in living docs instead of renaming runtime ids
  - kept the weaker `FL-23/25/27` band deferred
- explicit non-landed scope:
  - no runtime id rename
  - no new UBIQ exact or bound row
  - no UBIQ weaker-band widening
  - no solver-lane behavior change

- slice id: `official_product_representative_breadth_closure_v1`
- workstream: `A` widening-first corridor refresh
- status: `closed`
- landed scope:
  - added representative workbench presets for the missing `REGUPOL sonus multi 4.5` exact rows and the wider `Getzner AFM` product-delta range
  - added dedicated workbench route-identity tests for those new official-product presets
  - widened mixed generated engine and route surfaces with one new exact official-product case and one new stronger product-delta case
  - kept official-product widening honest by reusing only already-imported catalog rows
- explicit non-landed scope:
  - no new official catalog row
  - no solver lane widening
  - no additional save/load representative seeded-family detour
  - no UBIQ provenance cleanup in the same slice

- slice id: `raw_floor_negative_audit_expansion_v2`
- workstream: `C` raw-screening guardrail expansion
- status: `closed`
- landed scope:
  - wider concrete helper-side support tests on mixed-order and disjoint helper schedules
  - adjacent negative guard proving that a top-side finish above concrete suppresses helper-side `Rw` reopening
  - adjacent weaker-carrier guard proving that helper-heavy lightweight-steel rows stay fail-closed
  - route/output-card parity on the widened helper-side stress surface
- explicit non-landed scope:
  - no solver behavior change
  - no broader raw screening-carrier reopening
  - no packaged-lane widening beyond current defended corridors
  - no next-corridor widening yet

- slice id: `r7a_upper_eps_branch_design_decision`
- workstream: `A` widening-first corridor decision, exact-only branch design
- status: `closed`
- landed scope:
  - dedicated upper-EPS board material surface
  - explicit upper-fill inference and normalization parity
  - exact-only `R7a` row
  - open-box selector guard against `basic` backdoor collapse
  - route/support/source-corpus parity
- explicit non-landed scope:
  - no broader open-box family widening
  - no raw screening-carrier reopening
  - no global recommendation-horizon widening
  - no attempt to reinterpret direct-fixed CLT stacks as defended combined-family evidence

Important current notes:

- the next widening target is still floor evidence widening inside already-defended exact/bound/product corridors
- the first guard-surface expansion needed before that widening is now in place
- the helper-side raw concrete reopening rule is now defended on a broader first stress surface:
  - order and disjoint board/fill helper variation alone do not close it
  - losing terminal-base concrete posture does close it
- the latest UBIQ provenance slice deliberately did not widen solver behavior:
  - current `ubiq_fl32_*` and `ubiq_fl33_*` ids stay frozen as internal ids
  - current source-backed truth stays documented separately from those runtime ids
- the mixed/history representative save/load matrix now also covers the first official no-screed exact product topology already visible in generated and preset surfaces
- the new open-web noncanonical continuation parity fix is intentionally narrower than a widening slice:
  - it restores merge-safe split/edit-path stability for a continuation that was already policy-approved
  - it does not promote that continuation into a stronger lane
- the next selected slice is now a source-led TUAS shortlist audit:
  - use drawings/details to decide which deferred numeric rows remain honest import candidates
  - do not import any row from that shortlist until visible-layer evidence is frozen in docs and tests
- support posture and route wording must be checked in the same cycle as solver changes
- mixed history coverage is strong enough to require same-slice representative follow-up, but not broad enough to replace targeted corridor packs
- the most likely bad widening symptom is adjacent profile drift, not a dramatic total failure
- `R6b` is no longer a backlog question
- `R7a` is no longer a backlog question:
  - the exact-only branch is landed with an honest upper-EPS surface
  - the selector backdoor into `tuas_r2b` basic is closed
- the stale CLT direct-fixed stack that previously looked like an "upper-plus-lower" fallback is now explicitly treated as a contract-correction, not as a widening target:
  - current predictor topology is `dry_floating_floor` plus `direct_fixed_ceiling`
  - current honest route is screening-only until source-backed combined evidence exists

Open watchpoints:

- raw concrete helper reopening is now defended on the first widened contiguous-split cohort and a second wider heavy-hybrid cohort, but not on every possible helper permutation
- avoid promoting broader estimate lanes where an `exact`, `bound`, or official-product lane should remain visible
- avoid reopening raw weak carriers through helper-side topology shortcuts
- avoid treating route-surface contract drift as a solver regression before classification
- raw wall-like heavy hybrids and helper-heavy weaker carriers are now wider than the first helper-fill closure, and the open-web helper-heavy noncanonical boundary plus parity surface are now both defended on their first representative cohort
- direct-fixed CLT dry stacks with ceiling-side boards/fill should stay fail-closed unless a future slice lands explicit combined-family evidence for that topology
- `dataholz_gdmtxa04a_clt_lab_2026` remains the only imported exact-only Dataholz CLT row:
  - keep it estimate-routed unless a future slice proves an honest visible plus predictor exact surface together
  - current source evidence is not yet enough for that reopen
- UBIQ visible-code drift is now frozen as documentation truth:
  - do not reopen it as a runtime rename prompt unless a future slice deliberately changes user-facing provenance semantics
  - do not use it as a backdoor reason to widen into the weaker band

Next recommended move:

- execute the selected `tuas_deferred_shortlist_drawing_audit_v1` slice
- keep the next comparison order explicit:
  - first classify the deferred TUAS shortlist against drawings/details into:
    - honest visible-layer import candidates
    - exact-only candidates needing a new surface
    - or rows that stay deferred
  - then re-rank whether the next code slice should be:
    - a TUAS-backed floor evidence widening move
    - a wall selector evidence move
    - or a later raw-floor negative pass
- if that TUAS audit stalls or collapses into weak visible evidence, re-rank between:
  - a floor evidence widening move
  - a wall selector evidence move
  - or a mixed representative follow-up
- the finished TUAS audit resolved the shortlist into two explicit blocker groups:
  - mixed-schedule outliers:
    - `R6a`
    - `R10a`
  - hybrid lower-treatment outliers:
    - `R7b`
    - `R8b`
    - `R9b`
    - `R2c`
- do not treat the corrected CLT direct-fixed screening contract as a reason to open a broader family lane
