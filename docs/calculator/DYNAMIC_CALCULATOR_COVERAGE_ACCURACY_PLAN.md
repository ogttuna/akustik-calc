# Dynamic Calculator Coverage And Accuracy Plan

Last reviewed: 2026-04-09

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

- only after a new corridor is already defended on its targeted floor/wall packs

## 5. Execution Order

Recommended order:

1. Workstream A
   - floor evidence widening
2. Workstream B
   - family-specific accuracy tightening
3. Workstream C
   - raw/predictor widening on already-defended corridors
4. Workstream D
   - wall selector architecture and ambiguity work
5. Workstream E
   - mixed history breadth expansion after the above slices settle

Reasoning:

- widening exact, bound, and product corridors gives the safest coverage gain
- tightening estimates then improves numerical quality where evidence already exists
- raw inference widening should reuse those stronger corridors instead of inventing its own
- wall architecture work is high value but higher regression risk
- mixed-mode breadth should lag behind targeted corridor stabilization, not lead it

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

### 8.3 Required Tests

- engine positive:
- engine adjacent negative:
- route parity:
- support parity:
- mixed/history follow-up:
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

## 10. Recommended Immediate Starting Sequence

The safest next execution sequence is:

1. floor same-corridor evidence fill
   - prioritize TUAS open-box, UBIQ open-web, and official resilient-product rows
2. floor family-specific tightening
   - CLT, reinforced concrete, lightweight steel, composite
3. raw inference widening only on the newly frozen corridors
4. wall selector scoring and ambiguity work
5. mixed long-chain breadth expansion after the above slices settle

If only one slice should start now, the best candidate is:

- a floor evidence widening slice inside an already-defended corridor

Reason:

- this is where coverage can grow fastest with the lowest honesty risk
- the exact/bound/product architecture is already designed for this
- wall still has higher selector-regression risk
- raw inference widening is safer after the stronger family corridors exist

## 11. Current Decision

This document now establishes the rule for the next stage:

- coverage grows through evidence corridors first
- accuracy improves through family-specific tightening second
- raw inference widens third
- wall selector architecture improves before broad wall widening
- every slice is selected with its test pack up front

That should remain the operating model unless a future living doc explicitly replaces it.
