# Calculation Model And Validation

Last reviewed: 2026-04-13

Document role:

- explain where each calculator answer comes from
- separate formula-backed, source-backed, predictor-backed, bound-only, and
  unsupported outputs
- define how tests prove that a shown answer is defensible
- give future agents a fast map before changing solver, selector, or card logic

Read this before selecting a new widening slice. A green test can only prove the
answer it actually measures; it does not make the whole acoustic domain complete.

## Core Rule

There is no single formula that owns every output.

`calculateAssembly` builds multiple candidate lanes, then support gating decides
which requested outputs are allowed to surface. A visible `Rw`, `Ln,w`, `R'w`,
or `DnT,w` can therefore come from different origins depending on the active
route.

The implementation is correct only when all of these are true:

- the numeric value is produced by the right origin for that route
- the origin is source/formula/predictor/bound/unsupported as documented
- unsupported outputs stay explicit instead of being guessed
- workbench cards show the same support posture as the engine
- split, duplicated, reordered, or saved/replayed input does not silently switch
  to a broader lane

## Runtime Pipeline

Primary entry point:

- `packages/engine/src/calculate-assembly.ts`

Main stages:

1. Parse layers and optional contexts.
   - input layers are schema-validated
   - optional impact predictor input, exact impact source, impact field context,
     and airborne context are parsed before routing
2. Resolve material data and floor-role topology.
   - fully tagged floor stacks preserve operator intent
   - contiguous same-role pieces can be coalesced for split parity
   - raw stacks can be inferred only through guarded floor-role inference
3. Build the airborne lane.
   - screening seed: `estimateRwDb`
   - curve seed: `buildCalibratedMassLawCurve`
   - rating pass: `buildRatingsFromCurve`
   - dynamic/imported calculator overlays can replace the screening curve
   - verified catalog anchors and approximate field companions can overlay the
     selected airborne result
4. Build the impact lane.
   - exact impact source, exact floor system, bound floor system, official
     product row, explicit `DeltaLw`, predictor-specific floor system, narrow
     formula estimate, bound estimate, then family estimate
   - impact field context can add `L'n,w`, `L'nT,w`, or `L'nT,50`
5. Build floor airborne companions.
   - floor cards prefer `floorSystemRatings` for `Rw`, `C`, and `Ctr` when a
     floor lane owns those companions
   - otherwise airborne metrics from the selected curve can be shown
6. Gate requested outputs.
   - `analyzeTargetOutputSupport` decides supported and unsupported buckets
   - workbench cards read those buckets before showing values

## Formula Map

### Airborne Screening

Code:

- `packages/engine/src/estimate-rw.ts`
- `packages/engine/src/curve-rating.ts`

Formula-backed seed:

- total surface mass is converted into a screening `Rw` estimate with:
  - base term: `(19 * log10(totalSurfaceMassKgM2)) + 8`
  - lightweight density penalties
  - cavity/topology penalties
  - a narrow dense-composite bonus
  - clamp/round guards
- the selected mass-law curve starts from:
  - `TL(f) = 20 * log10(frequencyHz * surfaceMassKgM2) - 48`
  - then shifts the curve so its contour rating matches the selected target
    `Rw`
- `Rw`, `C`, `Ctr`, and `STC` are rated from the selected curve

Important boundary:

- this is a local calibrated screening/formula lane, not external source truth
- exact measured or official source rows can supersede it for floor-system
  companions

### Airborne Field Outputs

Code:

- `packages/engine/src/curve-rating.ts`
- `packages/engine/src/calculate-assembly.ts`

Formula-backed field outputs:

- `R'w` comes from the apparent airborne curve
- `DnT,w` uses receiving-room volume and partition area:
  - `10log10(0.32V/S)` in the current implementation
- `Dn,w` uses reference absorption area and partition area:
  - `10log10(A0/S)`
- `DnT,A` and `Dn,A` are companion A-style sums from the same field curve terms

Important boundary:

- missing geometry blocks field outputs that need that geometry
- exact floor `Rw` and apparent `R'w` are different surfaces and must not be
  collapsed into each other

### Floor Airborne Companions

Code:

- `packages/engine/src/floor-system-ratings.ts`
- `apps/web/features/workbench/simple-workbench-output-model.ts`

Origins:

- exact floor-system row: use source airborne companion ratings
- published family estimate: use estimated source-family airborne companions
- bound-only family: use bound source-family airborne companions
- heavy reference companion: use the explicit heavy-concrete companion lane
- screening fallback: use the selected airborne `Rw`/`Rw+Ctr` curve result

Important boundary:

- floor `Rw` cards prefer `floorSystemRatings.Rw`
- non-floor or non-companion `Rw` cards use `metrics.estimatedRwDb`
- `C`, `Ctr`, `Rw+C`, and `Rw+Ctr` are not interchangeable; the current
  `RwCtrSemantic` field decides whether a legacy numeric companion is a `Ctr`
  term, `Rw+C`, or `Rw+Ctr`

### Impact Outputs

Code:

- `packages/engine/src/impact-lane.ts`
- `packages/engine/src/impact-exact.ts`
- `packages/engine/src/impact-field-context.ts`
- `packages/engine/src/impact-guide.ts`

Impact selection order:

1. exact source impact bands or exact floor-system row
2. bound floor-system row
3. official impact product catalog row
4. explicit `DeltaLw` input
5. predictor-specific floor-system estimate
6. narrow layer-based impact estimate
7. bound floor-system estimate
8. broader floor-system estimate

Outputs:

- `Ln,w` is owned by the active impact lane, not by the airborne `Rw` curve
- `CI`, `CI,50-2500`, and `Ln,w+CI` are shown only when the impact lane carries
  those companions
- `L'n,w` is a field-side continuation from K/direct field support
- `L'nT,w` is a standardized field continuation from K plus room-volume context,
  or from the explicit local small-room guide lane
- `L'nT,50` is shown only when low-frequency companion data is present
- bound-only rows can show conservative upper/lower bounds without pretending to
  be exact measurements

Important boundary:

- exact impact-band sources are rated on the ISO 717-2 nominal grid without
  reusing the airborne TL curve
- field impact continuation requires explicit field context; otherwise cards
  stay `needs_input` or `unsupported`

## Source Truth Vs Formula Truth

Use this distinction when deciding whether an answer is "right":

- source truth:
  - imported measured rows, official rows, exact source ids, and explicit product
    rows
  - tests should assert exact ids, source values, basis/provenance, and support
    buckets
- formula truth:
  - local mass-law screening, curve rating, field normalization, guide lookup,
    and predictor formulas
  - tests should assert numeric outputs, formula basis, and nearby negative
    cases
- predictor truth:
  - source-family or published-family estimates that are not exact source rows
  - tests should assert fit/candidate/basis labels and fail-closed boundaries
- bound truth:
  - official or source-family bounds
  - tests should assert bound values and make sure exact values are not
    fabricated
- unsupported truth:
  - intentionally unavailable outputs
  - tests should assert unsupported buckets and workbench `Not ready` cards

## How Tests Prove Correctness

A strong calculator test is not just "result is finite".

The minimum useful assertion set is:

- answer value:
  - exact number or bounded value for every output being defended
- origin:
  - basis, match id, estimate kind, product/source id, or metric basis
- support bucket:
  - `supportedTargetOutputs`, `unsupportedTargetOutputs`,
    `supportedImpactOutputs`, and `unsupportedImpactOutputs`
- UI parity:
  - workbench output-card status and value for the same requested outputs
- negative shape:
  - adjacent inputs that must stay fail-closed
- stability shape:
  - contiguous split parity, disjoint split rejection, duplicate/reorder/history
    behavior where relevant

Current examples:

- Output-origin trace matrix:
  - `packages/engine/src/output-origin-trace-matrix.test.ts`
  - `apps/web/features/workbench/output-origin-trace-card-matrix.test.ts`
- Dataholz CLT source truth:
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- Raw terminal concrete with ceiling helpers:
  - `packages/engine/src/raw-concrete-helper-answer-guard.test.ts`
  - `apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts`
- Field/card support gating:
  - `packages/engine/src/raw-floor-screening-carrier-support.test.ts`
  - `apps/web/features/workbench/raw-floor-screening-route-support.test.ts`
- Broad defended gate:
  - `pnpm --filter @dynecho/engine test`

## Current Confidence Reading

High-confidence current posture:

- exact imported source rows that have source-truth audit tests
- source rows whose workbench cards are also pinned
- raw terminal-concrete plus ceiling-helper corridor as an implementation
  baseline, because numeric answers and card statuses are now pinned
- explicit fail-closed negatives around weaker carriers, top-side finish after
  terminal concrete, and disjoint role splits

Medium-confidence current posture:

- formula-backed screening and field companions inside already defended
  corridors
- predictor/family estimates with candidate ids, basis labels, and negative
  guards

Low-confidence / open posture:

- broad raw-floor widening outside source-led families
- helper-only timber and open-web steel raw carriers
- weak UBIQ bands
- C11c impact import
- `GDMTXA04A` visible exact reopening
- broader wall selector widening beyond the currently defended hold

This means the project is making real progress, but it should not be declared
globally ready until every product-critical output family has the same origin,
answer, support, card, and hostile-input coverage.

## Current Documentation Finding

The implementation has formulas, but the living docs did not previously provide
a single answer-origin map. That made it too easy to talk about "the formula" as
if every card came from the same calculation path.

The correct mental model is:

- exact source rows beat formulas
- formula lanes generate screening and field-derived outputs
- predictor lanes interpolate or estimate only inside guarded family evidence
- support gating decides what the user is allowed to see
- workbench cards must mirror engine support instead of inventing their own
  confidence

Architecture watch:

- `calculate-assembly.ts` is already a large orchestration file
- do not grow it with ad hoc card/origin reporting logic during the next slice
- if structured output-origin reporting becomes necessary, prefer a small
  helper/module that derives origin records from the existing calculation result
  fields instead of embedding more UI-facing explanation inside the solver

## Latest Trace Slice

The first trace/measurement slice is implemented:

- slice id: `output_origin_trace_matrix_v1`
- type: test-first trace and card-origin hardening
- status: implemented; focused, adjacent, typecheck, diff, and full engine gates
  are green
- goal:
  - make each defended representative output answerable as:
    `output -> value -> origin -> basis/source -> support/card status`
- implemented coverage:
  - exact Dataholz dry CLT source row
  - Dataholz `GDMTXA04A` source-family estimate route
  - raw terminal-concrete plus ceiling-helper formula/predictor route
  - UBIQ bound-only source row
  - dynamic wall airborne field route
  - dynamic wall field route with missing volume, where `DnT,w`/`DnT,A` stay
    needs-input on cards
  - steel-joist helper-heavy raw fail-closed impact route
- tests assert:
  - engine numeric values where live
  - conservative upper-bound values where bound-only
  - basis/source/estimate ids
  - engine support buckets
  - workbench card status/value parity
- validation:
  - engine trace/source/raw pack: `3` files, `7` tests, green
  - workbench trace/source/raw pack: `3` files, `4` tests, green
  - full engine suite: `99` files, `787` tests, green
  - full web suite: `94` files, `602` tests, green
  - engine/web typechecks and `git diff --check`: green

After this trace slice and the current no-widening guard set were checkpointed,
the next wall-selector trace slice was implemented:

- `wall_selector_wider_trace_matrix_v1`

It stayed trace-only and did not widen behavior. The proof shape is the same
value/origin/support/card structure above, applied to settled wall families, the
currently held `double_leaf <-> lined_massive_wall` boundary, non-AAC heavy-core
controls, and a strong framed control route.

Implemented artifacts:

- `packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts`
- `apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts`

The matrix pins:

- live `Rw`, `R'w`, and `DnT,w` values where supported
- unsupported `Rw` on field-only wall routes and field `needs_input` on
  lab-only double-stud routes
- family decision class, runner-up, hold metrics, trim counts, and warnings
- matching workbench card status/value, branch summary, validation posture, and
  consultant wording

Latest wall-selector validation:

- focused engine trace matrix: `1` file, `1` test, green
- focused workbench card matrix: `1` file, `1` test, green
- engine selector/boundary pack: `3` files, `15` tests, green
- workbench selector/boundary/validation pack: `5` files, `26` tests, green
- engine/web typechecks: green
- full engine suite: `100` files, `788` tests, green
- full web suite: `95` files, `603` tests, green
- `git diff --check`: green

The next no-widening raw-floor guard is also implemented:

- slice id: `raw_floor_hostile_input_answer_matrix_v1`
- engine artifact:
  `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
- workbench artifact:
  `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
- purpose:
  - prove that hostile raw floor inputs are measured by answers, not only by
    finite/non-finite checks
  - keep raw-floor widening blocked until a source-backed carrier/output surface
    is named
- pinned routes:
  - long split terminal-concrete helper: all requested floor/field outputs live
    with numeric answer snapshots
  - same-material concrete helper with non-terminal concrete: field `Rw`
    unsupported while impact field continuations remain live
  - long open-web helper-heavy raw stack: impact outputs unsupported/needs-input
  - fragmented CLT lower-only raw stack: impact outputs unsupported/needs-input
- validation:
  - focused engine hostile-input matrix: `1` file, `1` test, green
  - focused workbench hostile-input card matrix: `1` file, `1` test, green
  - engine raw adjacent pack: `6` files, `12` tests, green
  - workbench raw adjacent pack: `6` files, `9` tests, green
  - full engine suite: `101` files, `789` tests, green
  - full web suite: `96` files, `604` tests, green
  - engine/web typechecks and `git diff --check`: green

The next no-widening UBIQ open-web packaged-lane guard is also implemented:

- slice id: `ubiq_open_web_packaged_lane_trace_matrix_v1`
- engine artifact:
  `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
- workbench artifact:
  `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`
- purpose:
  - prove that an already-live UBIQ open-web packaged lower lane is measured by
    numeric answers and output-card values, not only by "supported" flags
  - keep the current family-estimate posture honest before any UBIQ behavior
    widening is considered
- pinned routes:
  - canonical raw `2 x 16 mm` lower package:
    `family_general`, `56.7%` fit, live `Rw`, `R'w`, `DnT,w`, `Ln,w`,
    `L'n,w`, and `L'nT,w`
  - raw split lower package:
    same numeric answers and card values as canonical raw input
  - tagged split lower package:
    same numeric answers and card values as canonical raw input
  - reordered lower package:
    same live answer values, but explicitly `low_confidence` at `29%` fit with
    duplicate-role warning coverage
- validation:
  - focused engine UBIQ trace matrix: `1` file, `1` test, green
  - focused workbench UBIQ card matrix: `1` file, `1` test, green
  - engine packaged-lane/UBIQ adjacent pack: `7` files, `24` tests, green
  - workbench packaged-lane adjacent pack: `7` files, `13` tests, green
  - full engine suite: `102` files, `790` tests, green
  - full web suite: `97` files, `605` tests, green
  - `pnpm build`: green with the known `sharp/@img` optional-package warnings
    and Next.js TypeScript plugin recommendation
  - engine/web typechecks and `git diff --check`: green

The deferred open-box finish-tolerance mixed-history boundary is now closed:

- slice id: `open_box_finish_tolerance_mixed_history_boundary_v1`
- workbench artifact:
  `apps/web/features/workbench/open-box-finish-tolerance-mixed-history-boundary.test.ts`
- purpose:
  - prove that the source-band vs outside-band open-box walking-finish boundary
    survives realistic workbench history, not only direct evaluation
  - keep the current open-box tolerance posture measured before any new
    behavior widening
- pinned routes:
  - `10 mm` laminate split as `4 + 6 mm` plus `3 mm` EPS:
    exact `tuas_r2b_open_box_timber_measured_2026`, live `Rw 62`, `Ln,w 46`,
    `L'n,w 48`, and `L'nT,w 45.6`
  - `12 mm` laminate split as `6 + 6 mm` plus `3 mm` EPS:
    no exact impact support, `Rw 44` screening live, `Ln,w` unsupported, and
    field impact cards needs-input
  - both routes pass through duplicate/edit, row-order bounce, save/load, and
    floor/wall mode switching before evaluation
- validation:
  - focused workbench boundary guard: `1` file, `1` test, green
  - workbench adjacent mixed/history/floor pack: `5` files, `112` tests, green
  - engine adjacent source/route pack: `4` files, `36` tests, green
  - full engine suite: `102` files, `790` tests, green
  - full web suite: `98` files, `606` tests, green
  - `pnpm build`: green with known `sharp/@img` and Next.js TypeScript plugin
    warnings
  - engine/web typechecks and `git diff --check`: green

Deferred until after these checkpoints:

- `floor_raw_inference_source_led_widening_v1`
- `clt_local_combined_interaction_evidence_v1`

Do not widen either deferred route until it has its own source-led or
frequency-led evidence and trace rows.
