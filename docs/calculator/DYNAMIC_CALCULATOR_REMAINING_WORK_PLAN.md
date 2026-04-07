# Dynamic Calculator Remaining Work Plan

Last reviewed: 2026-04-07

Document role:

- single place for the remaining dynamic-calculator work across both wall and floor
- use this after [CURRENT_STATE.md](./CURRENT_STATE.md) when deciding what should be fixed next
- optimize for non-regressive work only: every item here must improve the calculator without weakening defended corridors

## 1. Non-Regressive Rules

These rules are mandatory for every next change.

- do not widen any family lane just because it is numerically convenient
- do not normalize or sort layers globally to make outputs look calmer
- do not trade a known benchmark corridor for a broader but less honest fallback
- prefer fail-closed support over fabricated support
- if a route is physically order-sensitive, keep it order-sensitive and label it honestly
- if a route is only unstable because of solver handoff brittleness, fix the handoff instead of smoothing the output afterward

Every change must keep these guardrails green:

- wall standard engine corridor
- wall standard route corridor
- wall deep-hybrid cluster
- floor standard engine corridor
- floor standard route corridor
- mixed floor/wall torture pack

If a proposed fix cannot preserve those corridors, it is not ready.

## 2. Current Verified Posture

### Wall

Current verified result:

- standard engine wall corridor: green
  - `8` files
  - `34` tests
- standard route wall corridor: green
  - `6` files
  - `24` tests
- broad defended revalidation: green
  - included inside the `2026-04-07` broad packs
  - no new wall-side solver regression was reproduced there
- wall deep-hybrid cluster:
  - current documented validation posture remains the isolated `--maxWorkers=1` cluster in [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
  - the underlying wall contract set is still the defended posture for duplicate, reorder, boundary, and deep-hybrid swap cases

Interpretation:

- the reproduced wall jump class is materially reduced inside the defended corridor
- the remaining wall debt is no longer “basic instability everywhere”
- the remaining wall debt is corridor widening and selector architecture outside the currently defended `double_leaf <-> lined_massive_wall` hold

### Floor

Current verified result:

- standard route floor corridor plus support/card parity pack: green
  - `11` files
  - `227` tests
- standard engine floor corridor plus support/raw-screening cross-check pack: green
  - `23` files
  - `311` tests
- raw safe-bare contiguous-split parity packs: green
  - engine: [raw-floor-safe-bare-split-parity.test.ts](../../packages/engine/src/raw-floor-safe-bare-split-parity.test.ts)
  - route: [raw-floor-safe-bare-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts)
- raw treated/inferred contiguous-split parity packs: green
  - engine: [raw-floor-inferred-split-parity.test.ts](../../packages/engine/src/raw-floor-inferred-split-parity.test.ts)
  - route: [raw-floor-inferred-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts)
- broad defended revalidation: green
  - included inside the `2026-04-07` broad packs
  - no new floor-side solver regression was reproduced there

Interpretation:

- floor is not in a broad stability failure state
- the previously active reinforced-concrete support-posture regression is now closed
- the newly reproduced raw safe-bare contiguous-split inference gap is also now closed:
  - raw same-material splits on hollow-core, bare CLT, and composite deck carriers now stay on the same predictor/family lane as their single-layer and tagged equivalents
  - open-box timber and wall-like heavy hybrids stayed fail-closed through the same fix
- the first treated/inferred raw-floor contiguous-split cohort is also now frozen:
  - exact Dataholz dry CLT, exact TUAS open-box dry floor, integrated dry CLT, and promoted heavy-concrete family-estimate packages now stay identical across defended raw split and tagged split variants
- the current floor debt is no longer a live blocker; it is coverage and future widening discipline
- secondary route-surface revalidation on `2026-04-07` also showed that the latest red workbench tests were stale surface contracts, not a fresh calculator regression:
  - bound floor status now keeps companion `Rw` live on the defended carry-over lane
  - wall apparent-route `Rw` now stays explicitly unsupported in the route contracts, matching engine support buckets
  - a new wall output-card parity pack now sits beside the floor parity pack so future support-surface drift is caught earlier

### Shared Mixed-Mode Torture Coverage

Current verified result:

- engine mixed floor/wall contiguous-split parity pack: green
  - `1` file
  - `1` test
- engine mixed floor/wall generated matrix pack: green
  - `1` file
  - `1` test
- route mixed study-mode torture pack: green
  - `1` file
  - `2` tests
- route mixed study-mode generated matrix pack: green
  - `1` file
  - `1` test

Interpretation:

- the repo now has both a representative mixed torture slice and a first generated split-detour matrix rather than only isolated floor and wall seeded tests
- cross-mode operator detours are now defended at the workbench route layer on representative deep stacks
- remaining debt is no longer “no mixed torture exists”; it is that the mixed torture surface still stops at the first generated matrix instead of longer edit chains and larger duplicate/swap grids

### Cross-Surface Interpretation

Current overall reading:

- there is no active known blocker in the defended dynamic-calculator corridors right now
- current debt is mostly “how far is the evidence frozen” rather than “which reproduced bug is still open today”
- before the latest revalidation, two red route tests looked like regressions but were not:
  - bound floor carry-over `Rw` was now correctly live
  - wall apparent-route `Rw` was now correctly explicit/unsupported
- this means the next phase should prioritize evidence expansion and route-surface audit discipline, not a blind solver rewrite

## 2.1 Completion Checklist

Use this section to answer “is that old doc item actually done yet?” without having to infer it from several documents.

Completed and defended now:

- floor baseline phases `0-3`
- reinforced-concrete field-side floor-carrier `Rw` support fix
- representative floor output-card parity audit
- representative wall output-card parity audit
- safe-bare raw carrier contiguous-split parity fix
- treated/inferred raw-floor contiguous-split parity first cohort
- wall Phase A hardening
- wall Phase B.1 boundary diagnostics
- mixed floor/wall representative torture slice
- mixed floor/wall first generated split-detour matrix

Partially complete:

- floor Phase `4`
  - active and defended on the currently targeted family-tightening corridor
  - not a statement that all family-by-family tightening work is complete
- wall Phase B.2
  - shipped only on the currently defended `double_leaf <-> lined_massive_wall` corridor
  - not a general ambiguity-aware selector yet

Still open:

- wall MorphologyV2 / score-first selector architecture
- wider-than-first-slice mixed floor/wall generated torture matrices
- wider raw-floor inference audit beyond the current representative reopening guard, safe-bare split cohort, and first treated/inferred split cohort
- source-led widening decisions for remaining open-box / open-web / deferred family branches
- later floor phases `5-8`

Important reading rule:

- “completed” means the defended corridor exists and is guarded by executable tests
- “partially complete” means a narrow defended slice exists, but the general problem class is not closed
- “still open” means the work should not be inferred as solved just because nearby representative corridors are green

## 3. Recently Closed: Concrete Floor Carrier `Rw` Support Regression

### What Was Wrong

For reinforced-concrete screening rows under field-style assembly context:

- descriptor is `R'w`
- `floorSystemRatings.Rw` is finite
- `supportedTargetOutputs` hides `Rw`

At the same time, the workbench `Rw` card could still show live because it read `floorSystemRatings.Rw` directly. That made the bug cross-surface, not just a stale engine expectation.

### Fix That Shipped

The fix now does two things:

1. [calculate-assembly.ts](../../packages/engine/src/calculate-assembly.ts)
   - reopens assembly-route floor-carrier `Rw` only when all of these are true:
     - `floorSystemRatings` is finite
     - the impact lane is active
     - visible input carries explicit floor-role evidence
   - this deliberately avoids reopening raw wall-like heavy hybrids that happen to land on the narrow heavy-floor impact lane
2. [simple-workbench-output-model.ts](../../apps/web/features/workbench/simple-workbench-output-model.ts)
   - stops rendering floor `Rw` as live when the engine support bucket has already marked it unsupported

### Contracts That Now Defend It

- engine concrete coverage:
  - [floor-core-coverage-matrix.test.ts](../../packages/engine/src/floor-core-coverage-matrix.test.ts)
- engine positive/negative support guard:
  - [calculate-assembly.test.ts](../../packages/engine/src/calculate-assembly.test.ts)
- route parity:
  - [floor-output-availability-matrix.test.ts](../../apps/web/features/workbench/floor-output-availability-matrix.test.ts)
- direct card-model parity:
  - [simple-workbench-output-model.test.ts](../../apps/web/features/workbench/simple-workbench-output-model.test.ts)
- broader representative card/support audit:
  - [floor-output-card-support-parity.test.ts](../../apps/web/features/workbench/floor-output-card-support-parity.test.ts)
- representative raw-screening carrier audit:
  - [raw-floor-screening-carrier-support.test.ts](../../packages/engine/src/raw-floor-screening-carrier-support.test.ts)
- representative raw-screening route audit:
  - [raw-floor-screening-route-support.test.ts](../../apps/web/features/workbench/raw-floor-screening-route-support.test.ts)
- real-world open-box branch-split benchmark:
  - [impact-real-world-floor-coverage.test.ts](../../packages/engine/src/impact-real-world-floor-coverage.test.ts)
- broad negative guard that stayed green during the fix:
  - [output-combination-sweep.test.ts](../../packages/engine/src/output-combination-sweep.test.ts)

### Residual Caution

- severity: medium-high
- why it matters:
  - the shipped fix is intentionally narrow
  - it protects real floor-role assemblies without widening raw heavy screening rows automatically
- remaining caution:
  - the first representative raw-screening carrier audits are now defended, but they are not a license to widen every raw screening row
  - if broader raw rows need `Rw` reopening later, that must go through wider raw-floor inference evidence, not another generic support shortcut

## 3.1 Recently Closed: Raw Safe-Bare Contiguous Split Inference Gap

### What Was Wrong

For raw floor inputs with no explicit floor-role tags, contiguous same-material structural splits such as:

- `hollow_core_plank 200` -> `100 + 100`
- `clt_panel 140` -> `70 + 70`
- `composite_steel_deck 150` -> `75 + 75`

could silently fall off the predictor/family lane even though the normalized topology reduced back to a single safe bare carrier.

Key diagnostic result:

- raw split rows drifted away from their raw single-layer siblings
- tagged split rows did not drift
- that proved the bug was in raw inference gating, not in the defended tagged family corridors

### Fix That Shipped

The fix stays narrow and only touches coalesced single safe-bare carriers:

1. [impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
   - raw floor-role inference now accepts a normalized single safe-bare `base_structure` layer even when the visible raw input arrives as contiguous same-material splits
2. [impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
   - predictor-input derivation now accepts that same normalized safe-bare carrier shape, so raw split rows land on the same predictor/family lane as their single-layer and tagged equivalents

What this does not widen:

- open-box timber raw carriers
- wall-like heavy hybrids
- raw heavy rows that are not reducible to one safe-bare structural carrier

### Contracts That Now Defend It

- engine contiguous-split parity:
  - [raw-floor-safe-bare-split-parity.test.ts](../../packages/engine/src/raw-floor-safe-bare-split-parity.test.ts)
- engine raw-vs-tagged parity:
  - [assembly-raw-floor-inference.test.ts](../../packages/engine/src/assembly-raw-floor-inference.test.ts)
- engine raw-screening support split:
  - [raw-floor-screening-carrier-support.test.ts](../../packages/engine/src/raw-floor-screening-carrier-support.test.ts)
- route contiguous-split parity and card surface:
  - [raw-floor-safe-bare-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts)
- route raw-screening support split:
  - [raw-floor-screening-route-support.test.ts](../../apps/web/features/workbench/raw-floor-screening-route-support.test.ts)
- route output-card parity:
  - [floor-output-card-support-parity.test.ts](../../apps/web/features/workbench/floor-output-card-support-parity.test.ts)
- wider treated/inferred split parity:
  - [raw-floor-inferred-split-parity.test.ts](../../packages/engine/src/raw-floor-inferred-split-parity.test.ts)
  - [raw-floor-inferred-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts)

## 4. Route-Surface Audit Rules

These rules are now important enough to keep separate from the generic non-regressive rules because they were the source of the latest false alarm.

- do not treat a finite metric or companion value as automatically surface-live
- `supportedTargetOutputs` / `unsupportedTargetOutputs` remain the source of truth for route cards and target-output status
- if a route-surface contract is red, confirm whether engine support buckets agree before treating it as a solver regression
- keep explicit wall/floor output-card parity audits green before widening any new route surface

What is intentionally defended today:

- floor carry-over `Rw` may stay live on defended floor-carrier lanes
- wall-side `Rw` may stay explicit once the airborne descriptor is `R'w`
- route cards must fail-close unsupported outputs even when some raw payload field is finite

Current parity guards:

- [floor-output-card-support-parity.test.ts](../../apps/web/features/workbench/floor-output-card-support-parity.test.ts)
- [wall-output-card-support-parity.test.ts](../../apps/web/features/workbench/wall-output-card-support-parity.test.ts)
- [target-output-status.test.ts](../../apps/web/features/workbench/target-output-status.test.ts)
- [simple-workbench-output-model.test.ts](../../apps/web/features/workbench/simple-workbench-output-model.test.ts)

## 5. Remaining Wall Plan

Wall is no longer blocked by the old reproduced jump class, but it still has architectural debt.

### Remaining Wall Risks

- family selection still ends in a hard branch outside the held corridor
- `multileaf_multicavity` is still a conservative surrogate rather than a dedicated multi-cavity solver
- the current hold is intentionally narrow and should not be widened blindly
- wider-than-representative deep-hybrid route palettes are not yet frozen
- a future stack could still expose more than one plausible runner-up family outside the current defended corridor

### Risk Level

- severity: medium
- why it matters:
  - the defended wall corridor is currently green
  - remaining risk is concentrated in wider hybrid matrices and future selector handoff surfaces, not in the old reproduced main bug set
- regression risk of further wall work: high if rushed
  - wall family routing is benchmark-anchored now
  - any widening without stronger generated evidence can easily reopen the same class of handoff bug

### Safe Wall Fix Order

1. finish the mixed-stack torture pass first
   - do not widen the hold before this exists

2. extend evidence, not logic, on the next pass
   - wider route-side deep-hybrid palettes
   - larger duplicate/reorder/swap matrices
   - multi-runner-up detection scans

3. only then consider selector architecture work
   - shadow-mode candidate scoring
   - ambiguous-family hold rules outside the current corridor
   - only if every widening survives exact trace and parity contracts

4. leave MorphologyV2 as a later step
   - this is the “make the parser physically smarter” move
   - it should only begin after the current corridor is fully frozen

### Likely Code Touch Surface

Primary likely code touch surface:

- [dynamic-airborne.ts](../../packages/engine/src/dynamic-airborne.ts)
  - selector scoring, ambiguity handling, or bounded hold logic
- [airborne-topology.ts](../../packages/engine/src/airborne-topology.ts)
  - only if future evidence proves topology decomposition itself is the blocker
- [dynamic-calc-branch.ts](../../apps/web/features/workbench/dynamic-calc-branch.ts)
  - only for trace/report wording after engine posture changes

Do not touch these first in the next pass:

- published wall benchmark fixtures
- framed-wall calibration constants
- global layer-order normalization helpers

### What Must Not Happen On Wall Side

- no global wall canonicalization
- no silent output clamping
- no widening of `stud_wall_system` on metadata alone
- no expansion of the hold beyond `double_leaf <-> lined_massive_wall` without new generated scans

## 6. Remaining Floor Plan

Floor should now stay on controlled widening and tightening only.

### Remaining Floor Risks

- mixed floor/wall complex stacks still need broader generated edit-chain and duplicate/swap torture beyond the first generated matrix
- raw-vs-tagged parity, safe-bare contiguous-split parity, and the first treated/inferred split cohort are defended only on the currently harvested floor cohorts
- intentionally fail-closed structural carriers still need source-led widening decisions
- route coverage now defends representative support-bucket/card parity and representative raw-screening posture, but not yet every wider raw-screening widening decision
- the TUAS open-box real-world coverage fixture is now aligned with the defended `a/b` branch split:
  - generic `resilient_stud_ceiling` basic rows bind to `R2b`
  - explicit `tuas_open_box_ceiling_family_a` rows bind to `R2a`

### Risk Level

- severity of the remaining floor debt: medium
- why it matters:
  - most defended floor corridors are green
  - remaining debt is coverage, source-led widening, and complex-stack stability, not a universal solver collapse
- regression risk of future widening: medium-high
  - floor widening can silently create fake confidence on raw carriers if source gating weakens

### Safe Floor Fix Order

1. extend the raw-floor screening-carrier audit beyond the current representative rows, safe-bare split cohort, and first treated/inferred split cohort before reopening any more `Rw` support:
   - weaker structural carriers
   - wider inferred floor packages with clear upper/lower treatment evidence
   - raw wall-like heavy hybrids and other rows that must stay closed

2. run a broader complex-stack torture pass before any new widening

3. continue source-led widening only in this order:
   - open-box timber corridor decisions
   - open-web steel corridor decisions
   - CLT family tightening
   - only then any broader generic family opening

4. keep unsupported raw lanes fail-closed unless the source corpus clearly supports them

### Likely Code Touch Surface

Primary likely code touch surface:

- [impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
  - if raw-floor inference needs to become more selective or more permissive
- [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
  - if same-family widening or tightening is required
- [predictor-floor-system-estimate.ts](../../packages/engine/src/predictor-floor-system-estimate.ts)
  - if predictor-side family deviation tightening is needed
- [floor-system-ratings.ts](../../packages/engine/src/floor-system-ratings.ts)
  - only when rating derivation itself changes
- [floor-role-topology.ts](../../packages/engine/src/floor-role-topology.ts)
  - only when the torture pass proves a raw-role interpretation problem

Avoid these until evidence forces them:

- broad generic lightweight-floor fallback rules
- universal raw-layer canonicalization
- new unsupported floor-carrier exposure shortcuts

### Floor Families That Still Need Deliberate Decisions

- bare open-box timber:
  - still fail-closed on impact field outputs
  - should only open if TUAS measured rows defend a narrow same-family lane
- bare open-web steel:
  - still fail-closed on impact field outputs
  - should only open from official or measured same-family evidence
- remaining TUAS corridor questions:
  - `R7a`
  - `R6b`
- deferred weaker UBIQ corridor rows:
  - `FL-23`
  - `FL-25`
  - `FL-27`

## 7. Shared Torture-Pass Plan

This is now the next major cross-cutting work item.

### Goal

Prove that the dynamic calculator stays physically honest and numerically stable under difficult operator behavior:

- deep layer counts
- duplicate packages
- adjacent swaps
- split/merge edits
- reset and partial-edit cycles
- mixed floor/wall stacks that look similar but should route differently

### Required Matrix Shapes

At minimum:

- `8+` layer wall hybrids
- `8+` layer floor hybrids
- mixed dry/wet floor packages
- ceiling-only vs upper-only floor variants
- heavy-core wall plus light-lining variants
- duplicate package replay
- adjacent swap scans
- move-up / move-down edit chains
- partial delete and rebuild chains

### Required Surfaces

Every new torture pack should touch both:

- engine route
- workbench route

Current shipped mixed-torture surface:

- engine:
  - [mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts)
  - [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
- route:
  - [mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts)
  - [mixed-study-mode-generated-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts)

What this already covers:

- alternating floor/wall study-mode switches
- representative deep floor exact/bound rows
- representative deep wall hybrid rows
- neutral split-detour parity
- broader support-bucket/card sanity after cross-mode edit chains

What it does not yet cover:

- longer seeded cross-mode edit chains
- mixed floor/wall duplicate-swap grids beyond the current first generated split-detour matrix
- any wider preset-family expansion that still proves necessary after those chains and swap grids

And should check both:

- numeric delta behavior
- support posture / warnings / confidence posture

### Test Pattern Requirements

Each new torture-pass change should add more than one test shape:

- one exact anchor
- one generated scan
- one edit-sequence or route-parity test

That keeps the suite from becoming overly optimistic around a single hand-picked stack.

## 8. Definition Of Done For The Next Phase

The next phase is only complete when all of these are true:

1. standard wall corridor still stays green
2. standard floor corridor still stays green
3. wall and floor output-card parity packs still stay green
4. mixed-stack torture coverage is widened beyond the current first generated split-detour matrix
   The representative anchors and first generated split-detour matrix already exist; the remaining step is to widen that matrix into longer chains and larger swap grids.
5. no new widening has been merged without source-backed or benchmark-backed evidence
6. every newly opened lane is labeled honestly on route and export surfaces
7. any new red route-surface contract is first classified as solver, support-bucket, or stale-surface drift before logic changes are proposed

## 9. Recommended Execution Order

Do this in order:

1. extend the raw-floor inference audit before reopening any broader screening-carrier posture
2. widen the mixed floor/wall torture surface beyond the current first generated split-detour matrix
3. widen wall-side evidence only, not wall-side logic
4. re-check whether any wall corridor widening is still justified after those scans
5. only then resume source-led floor widening

This order is the safest one because the previous blocker is already closed; the next risk is accidental widening without enough frozen evidence.
