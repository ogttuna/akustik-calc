# Next Implementation Plan

Last reviewed: 2026-04-17

Document role:

- authoritative current next-step plan for calculator work
- use this before any historical backlog note
- keep older long-form backlog detail in:
  - [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
  - [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md)
  - [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)

Read together with:

- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [SYSTEM_MAP.md](./SYSTEM_MAP.md)
- [CHECKPOINT_2026-04-17_HEAVY_CONCRETE_FORMULA_FAMILY_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_HEAVY_CONCRETE_FORMULA_FAMILY_CLOSEOUT_HANDOFF.md)
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## Primary Objective

The primary product goal is not merely to make the calculator return more
answers. It is to make the calculator:

- support a broader set of floor and wall corridors
- stay numerically and physically tighter on the corridors it already owns
- preserve answer-origin honesty while coverage grows

In practice that means:

- every widening slice must preserve or improve accuracy on the same corridor
- every tightening slice must preserve or improve defended coverage
- no slice is complete if it gains coverage by creating fake confidence,
  weakening precedence, or blurring provenance

## Planning Model

Use this decision model for every next slice:

1. widen only inside a corridor that is already benchmark-backed,
   source-anchored, or formula-owned
2. pair each widening with a tightening pass on the same family whenever the
   widened lane still relies on low-confidence or broad family blending
3. re-rank blocked families only after the current corridor is both broader and
   still numerically honest

Project-level definition of progress:

- broader supported coverage on defended corridors
- fewer low-confidence results where same-family evidence exists
- stable exact/catalog/bound/formula precedence
- stable workbench/report/card origin wording under hostile history

## Verified Against Implementation - 2026-04-17

- latest closed implementation slice:
  `heavy_concrete_formula_family_widening_v1`
- latest focused active-slice verification on `2026-04-17`:
  - targeted heavy-concrete engine pack: `4/4` test files passed,
    `312/312` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this closeout pass:
  - focused engine gate: `4/4` test files passed, `14/14` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green
  - full engine suite: `147/147` test files passed, `923/923` tests passed
  - full web suite: `113/113` test files passed, `655/655` tests passed
  - `pnpm typecheck`: green
  - `pnpm lint`: green
  - `pnpm check`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this final-probe pass:
  - targeted concrete closeout/benchmark/regression pack:
    `3/3` test files passed, `114/114` tests passed
  - `pnpm calculator:gate:current`: green with `4/4` test files passed and
    `15/15` tests passed in the focused engine/web gate
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this slice-closeout selection pass:
  - focused engine gate: `5/5` test files passed, `23/23` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green
  - full engine suite: `148/148` test files passed, `930/930` tests passed
  - full web suite: `113/113` test files passed, `655/655` tests passed
  - `pnpm check`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this visible-stack continuity pass:
  - targeted reinforced-concrete visible continuity pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `3/3` web files and `7/7` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this high-visibility low-confidence lane-label pass:
  - targeted web honesty pack: `2/2` test files passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `6/6` web files and `13/13` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this proposal/diagnostics honesty pass:
  - targeted reinforced-concrete proposal honesty pack: `1/1` test file
    passed, `2/2` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `15/15` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this source-lineage honesty pass:
  - targeted reinforced-concrete lineage/provenance pack: `3/3` test files
    passed, `8/8` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this nearby-row carry-through pass:
  - targeted reinforced-concrete nearby-row honesty pack: `3/3` test files
    passed, `10/10` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this nearby-row ranking-label pass:
  - targeted reinforced-concrete nearby-row ranking pack: `2/2` test files
    passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this same-ceiling candidate-order pass:
  - targeted reinforced-concrete order-regression pack: `8/8` test files
    passed, `20/20` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this same-ceiling score-rationale pass:
  - targeted reinforced-concrete ranking-helper pack: `1/1` test file passed,
    `4/4` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this nearby-row ranking-rationale surface pass:
  - targeted reinforced-concrete rationale pack: `3/3` test files passed,
    `9/9` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this solver-side low-confidence note-honesty pass:
  - targeted reinforced-concrete note-honesty pack: `3/3` test files passed,
    `17/17` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this support-note rationale carry-through pass:
  - targeted reinforced-concrete support-note pack: `5/5` test files passed,
    `314/314` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this evidence-ranked-row carry-through pass:
  - targeted reinforced-concrete evidence/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this evidence-citation-prioritization pass:
  - targeted reinforced-concrete evidence/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this screening-package wording pass:
  - targeted reinforced-concrete proposal/dossier pack: `2/2` test files
    passed, `4/4` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this consultant-trail screening pass:
  - targeted reinforced-concrete consultant/proposal trail pack: `2/2` test
    files passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this proposal-recommendation screening pass:
  - targeted reinforced-concrete proposal brief pack: `2/2` test files passed,
    `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this consultant-emphasis screening pass:
  - targeted reinforced-concrete consultant/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this proposal-summary screening pass:
  - targeted reinforced-concrete proposal summary pack: `3/3` test files
    passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this diagnostics-screening posture pass:
  - targeted reinforced-concrete diagnostics/proposal pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this broad repo revalidation pass:
  - `pnpm check`: green
  - full engine suite: `152/152` test files passed, `941/941` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- broad-pass conclusion from this revalidation:
  - repo-wide validation surfaced one stale lint leak, one stale typecheck
    leak, and three stale engine expectation/parity contracts
  - all five drifts were aligned without reopening concrete widening or
    changing the intended reinforced-concrete low-confidence corridor posture
  - the next high-ROI move is no longer wording-only screening polish; it is a
    solver-side residual evidence/fit decision on the same reinforced-concrete
    branch

## Closeout Summary

The requested-output harness chain remains frozen. The no-runtime rerank and
the heavy-concrete widening that followed it are now both closed.

Heavy-concrete closeout result:

- latest closed implementation slice:
  `heavy_concrete_formula_family_widening_v1`
- closeout basis:
  - six defended predictor / visible parity substeps landed
  - the final explicit carpet-plus-generic-underlay probe closed as a negative
    guard
  - the reinforced-concrete formula-vs-family ownership matrix is now pinned in
    executable tests
  - no seventh defended parity widening remains proven
  - blocked branches stayed blocked
- selected next tightening direction:
`reinforced_concrete_accuracy_tightening_follow_up_v1`
- held but not selected candidate:
  `dataholz_clt_calibration_tightening`
- why reinforced-concrete tightening wins now:
  - widening is honestly exhausted unless a new proof-backed equivalence
    appears
  - the concrete corridor is already the most owned user-facing floor family
  - the highest remaining ROI is accuracy tightening inside the same corridor,
    not broader widening
  - the closeout audit, benchmark, monotonicity, and provenance guards already
    define a stable baseline for tightening
- why Dataholz CLT did not move up yet:
  - it remains defended and useful, but it is a lower-ROI tightening target
    than reinforced concrete right now
  - there is still no fresh classified runtime red forcing immediate CLT work
  - the blocked exact-reopen/source-anomaly boundaries are unchanged
- no runtime or numeric calculator behavior changed in the closeout selection
  itself

## Current Position

- latest committed checkpoint:
  `CHECKPOINT_2026-04-17_HEAVY_CONCRETE_FORMULA_FAMILY_CLOSEOUT_HANDOFF.md`
- latest closed implementation slice:
  `heavy_concrete_formula_family_widening_v1`
- closed planning action in this pass:
  `post_heavy_concrete_formula_family_widening_next_slice_selection_v1`
- selected next implementation slice:
  `reinforced_concrete_accuracy_tightening_follow_up_v1`
- slice type:
  runtime accuracy tightening on the defended reinforced-concrete corridor
- implementation status:
  started; first engine-side proxy-airborne honesty tightening and second
  workbench-side wording tightening are landed on the reinforced-concrete
  low-confidence branch, and the candidate pool is narrowed away from carpet
  and bare-slab rows while the branch remains low-confidence; predictor-only
  fit now shares the same 29% displayed ceiling as the derived low-confidence
  tier; trace, report, and validation-posture surfaces now carry the same 29%
  mixed-row / proxy-companion honesty language as the warning and output-card
  surfaces; the branch now also shares the defended combined-vinyl bounded
  geometry slope, so Ln,w and Rw move continuously inside the current
  low-confidence envelope instead of staying frozen at the baseline tuple; a
  visible-stack continuity guard now also freezes neutral reorder/alias/safe-
  split variants on the same low-confidence lane while keeping the expanded
  four-board ceiling schedule as an intentional formula-owned boundary; the
  impact lane headline/pill and the high-visibility impact summary, result,
  delivery-assist, and curated floor-estimate panels now also label the branch
  as a low-confidence fallback instead of a generic published family estimate,
  the main confidence/provenance detail now reads as low-confidence fallback
  provenance instead of generic published-family provenance, and the runtime
  diagnostics/proposal evidence chain is now pinned on the same scenario so it
  keeps screening-only low-confidence wording instead of drifting back to
  generic published-family language; the dynamic impact trace itself now also
  emits `Low-confidence fallback` as the live trace label and first note
  instead of a generic published-family note, and candidate/source-row
  surfaces now read as nearby published rows rather than a narrow family
  match across the trace panel, curated floor-estimate card, and generated
  report export; the same nearby-row wording now also carries through the main
  impact result panel and the hidden-row evidence detail instead of reverting
  to generic `Candidate lineage` / `estimate anchor` copy, and the raw
  candidate-id surfaces now read as ranked nearby published row ids rather
  than a privileged narrow-match candidate list; the same nearby-row score
  offsets are now centralized in one helper with a geometry-sensitive third-row
  penalty so the same-ceiling-first order and the family-vs-low-confidence
  penalty gap cannot silently drift apart, and the same ranking rationale now
  appears directly on trace/evidence/report surfaces instead of staying hidden
  behind raw score lists alone; solver-side predictor notes for this branch
  now also say nearby published rows / low-confidence fallback lineage instead
  of leaking generic published-family wording into raw engine notes or
  downstream trace summaries, and `impactSupport.notes` now also carries the
  same mixed-row / elastic-first ranking rationale so report and support-basis
  surfaces do not collapse back to a vague low-confidence label; the same
  evidence packet now also carries ranked nearby-row anchor labels into
  proposal and diagnostics surfaces instead of falling back to generic
  `Nearby published row N` numbering, and the same evidence packet now puts
  the dynamic impact anchor plus fallback rationale ahead of raw row anchors so
  proposal/diagnostics surfaces do not lead with what feels like a narrow
  best-match citation; proposal brief and dossier wording now also keep this
  branch explicitly in screening territory by saying `screening output` and
  `screening package` instead of generic `ready output` / `issue package`
  language, and the consultant decision trail now also treats the same branch
  as a screening posture with an explicit delivery-posture warning instead of
  leaving the floor-side trail in generic posture/delivery-neutral wording;
  the low-confidence proposal brief now also keeps both warning-present and
  no-warning paths in screening territory by replacing optimistic `freeze the
  stack` / `attach the citation appendix` copy with screening-snapshot and
  nearby-row appendix language when this branch is active, and the consultant
  decision trail `Output coverage` item now stays warning-toned on this branch
  instead of leaking a green/success signal merely because several outputs are
  populated inside the screening fallback; the same low-confidence proposal
  brief executive summary and proposal dossier headline now also read as a
  screening route with nearby-row citations attached instead of repeating a
  generic low-confidence posture in more delivery-neutral language, and the
  low-confidence diagnostics dossier now also keeps trace coverage,
  evidence-courier, and no-warning warning-board surfaces in explicit
  screening posture instead of leaking green/clear readiness cues; broad
  repo-wide revalidation then found and fixed one stale lint leak, one stale
  typecheck leak, and three stale engine expectation/parity contracts, so the
  current honesty/ranking chain is no longer the primary risk surface
- explicit not-done item at this checkpoint:
  the tightening slice is open; low-confidence `vinyl + elastic ceiling`
  remains low-confidence, and residual family-vs-formula fit plus edge-
  continuity tightening are still open after the landed honesty substeps,
  predictor-only fit-cap alignment, bounded numeric continuity tightening, and
  broad repo-wide validation of the current screening/evidence wording chain

## Selected Next Slice

- slice id:
  `reinforced_concrete_accuracy_tightening_follow_up_v1`
- workstream:
  `runtime_accuracy_tightening`
- route family:
  `reinforced_concrete_floor_lane`
- output surface:
  `reinforced_concrete_accuracy_tightening_matrix`
- engine companion surface:
  `reinforced_concrete_formula_family_closeout_audit`
- behavior class:
  runtime tightening inside an already-owned reinforced-concrete floor corridor

### Scope

- tighten broad or low-confidence reinforced-concrete branches only inside the
  already-owned corridor
- preserve exact row, catalog, bound, family, formula, and low-confidence
  ownership boundaries
- keep companion-output honesty explicit on engine, workbench, trace, and
  report surfaces
- use this slice to improve fit and confidence posture, not to reopen widening
  on blocked families or parity probes

### Closeout Selection Result

Selected now:

- `reinforced_concrete_accuracy_tightening_follow_up_v1`
  - posture: selected after the heavy-concrete widening closeout
  - reason: widening is honestly exhausted; the biggest remaining value is
    tightening the same owned corridor

Held for later:

- `dataholz_clt_calibration_tightening`
  - posture: held second tightening candidate
  - reason: current CLT estimate lane is still defended, but reinforced
    concrete has the higher immediate ROI and no fresh CLT runtime red forces a
    reorder

Conditionally reopen only if new proof appears:

- `reinforced_concrete_parity_reopen`
  - posture: explicitly not selected
  - reason: the final explicit carpet-plus-generic-underlay probe closed
    without producing a new defended widening candidate

Still blocked:

- `raw_bare_open_box_open_web_impact_widening`
  - blocked until bare-carrier impact source evidence exists
- `dataholz_gdmtxa04a_visible_exact_reopen`
  - blocked until the composite dry-screed surface is modeled honestly
- `tuas_c11c_exact_import`
  - blocked until the frequency/source anomaly is explained
- `wall_selector_behavior_widening`
  - blocked until a fresh classified wall-selector red exists

### Current Implementation Anchors

- planning contract:
  `packages/engine/src/post-heavy-concrete-formula-family-widening-next-slice-selection-contract.test.ts`
- reinforced-concrete engine evidence:
  - `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
  - `packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts`
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts`
  - `packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts`
  - `packages/engine/src/calculate-impact-only.test.ts`
- reinforced-concrete web evidence:
  - `apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts`
  - `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts`
  - `apps/web/features/workbench/simple-workbench-evidence.test.ts`
  - `apps/web/features/workbench/simple-workbench-output-model.test.ts`
  - `apps/web/features/workbench/target-output-status.test.ts`
  - `apps/web/features/workbench/dynamic-calc-branch.test.ts`
  - `apps/web/features/workbench/guided-validation-summary.test.ts`
  - `apps/web/features/workbench/workbench-warning-notes.test.ts`
- held CLT evidence:
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- likely runtime edit anchors for the selected tightening:
  - `packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts`
  - `packages/engine/src/predictor-published-family-estimate.ts`
  - `packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-airborne.ts`
  - `packages/engine/src/impact-support.ts`
  - `packages/engine/src/impact-predictor-status.ts`
- focused gate entrypoint:
  `tools/dev/run-calculator-current-gate.ts`
- source-backed boundary ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

### Current Corridor Audit Map

Use this map before touching runtime logic. It separates what is already
landed, what is explicitly blocked, and what the tightening slice may revisit
numerically without widening.

1. Published heavy-concrete upper-treatment corridor
   - lane owner:
     `packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts`
   - landed:
     - heavy-floating ceramic-tile upper-treatment family lane
     - combined wet concrete + elastic gypsum ceiling family lane
     - combined wet concrete + rigid gypsum ceiling family lane
     - visible-stack `generic_gypsum_board` parity on the same bounded gypsum
       corridor
   - still blocked:
     - firestop-board rigid ceiling widening on this lane
     - no-fill / tile-only / lower-only gypsum ceiling variants
     - concrete `vinyl + elastic ceiling` promotion beyond low-confidence
2. Reinforced-concrete archetype corridor
   - lane owner:
     `packages/engine/src/predictor-published-family-estimate.ts`
   - landed:
     - Knauf concrete timber-underlay archetype near-match lane
     - `fire_board` alias parity on defended firestop-board archetype inputs
     - split `engineered_timber_flooring + generic resilient underlay` parity
       onto the same timber-underlay archetype lane
     - Knauf concrete tile-ceiling archetype near-match lane
     - Knauf concrete tile-underlay combined archetype near-match lane
   - support boundary:
     - these archetype lanes still do not fabricate `DeltaLw`; unsupported
       outputs remain unsupported on purpose
3. Formula and low-confidence guardrails
   - keep owned formula scope on:
     - bare reinforced-concrete slabs
     - explicit dynamic-stiffness floating-floor formulas
   - keep low-confidence posture on:
     - reinforced-concrete `vinyl + elastic ceiling`
   - do not blur formula, family, and low-confidence ownership just to increase
     answer count

### Latest Parity Audit Conclusion - 2026-04-17

The current re-read of the reinforced-concrete corridor still does not prove a
seventh defended parity widening.

- confirmed still-defended and already landed:
  - wet ceramic-tile + elastic gypsum ceiling
  - wet ceramic-tile + rigid gypsum ceiling
  - visible-stack `generic_gypsum_board` parity on the same bounded gypsum
    corridor
  - `fire_board` alias parity on defended concrete firestop-board archetype
    inputs
  - split `engineered_timber_flooring + generic resilient underlay` parity on
    the defended timber-underlay archetype lane
- explicitly rechecked and still not safe to widen from nearby green tests
  alone:
  - split carpet/soft-cover plus generic underlay concrete inputs
  - there is no current runtime canonicalization or visible-stack topology rule
    that proves those split inputs are the same physical system as the bounded
    carpet archetype lane
  - treat those cases as unproven, not as missed parity fixes
- final explicit defended-equivalence probe now completed:
  - canonical concrete carpet inputs still stay on the bounded
    `knauf_cc60_1a_concrete150_carpet_lab_2026` archetype lane
  - adding an extra generic resilient underlay does not preserve that
    equivalence
  - the route falls back to the bare-floor impact formula and only keeps the
    heavy-concrete airborne companion estimate
  - this is now pinned in:
    - `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
    - `packages/engine/src/calculate-impact-only.test.ts`
    - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
- planning consequence:
  - the heavy-concrete widening is now closed
  - keep the parity queue shut unless a new already-proven equivalent
    representation appears later
  - use the closed audit as the entry point for reinforced-concrete accuracy
    tightening instead of inventing a new corridor

### Direction Correctness Checklist

Every next widening/parity step must pass this checklist before code changes
are kept.

1. There is already a stronger defended lane for the same physical system.
   - if the system does not already own an exact/family lane, a formula or
     low-confidence result is not automatically wrong
2. The alternative representation is proven equivalent by runtime
   canonicalization, visible-stack derivation, or source-backed topology rules.
   - examples already landed:
     `fire_board -> firestop_board`,
     `engineered_timber_flooring + generic underlay -> engineered_timber_with_acoustic_underlay`,
     `generic_gypsum_board -> bounded gypsum ceiling corridor`
3. The patch stays inside the current reinforced-concrete corridor.
   - no new source family, no CLT/open-web/open-box/wall-selector widening, and
     no reopening blocked anomalies
4. The patch does not overclaim supported outputs.
   - if `DeltaLw`, `CI`, field continuations, or companion airborne outputs are
     not owned by the stronger lane, they remain formula-owned or unsupported
5. The route is pinned in tests before and after the change.
   - benchmark basis
   - candidate ids
   - support buckets
   - main-route regression on `calculate-impact-only` and `calculate-assembly`
6. If any of the above is ambiguous, stop and keep the branch on its current
   formula or low-confidence posture.

### Execution Plan For This Slice

1. Freeze the current ownership matrix as the tightening entry contract.
   - keep
     `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
     green as the central route/basis/support ledger
   - keep
     `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
     and
     `packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts`
     green so tightening does not buy apparent accuracy by weakening the
     defended corridor
2. Tighten only inside the already-owned reinforced-concrete corridor.
   - start with the low-confidence `vinyl + elastic ceiling` branch, residual
     family-vs-formula fit drift, and companion-output honesty
   - keep
     `packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts`,
     `packages/engine/src/predictor-published-family-estimate.ts`,
     `packages/engine/src/impact-estimate.ts`, and
     `packages/engine/src/target-output-support.ts` as the primary runtime edit
     anchors
   - do not use this slice to reopen CLT, raw open-box/open-web,
     `GDMTXA04A`, `C11c`, selector behavior, or closed parity probes
3. Keep provenance and support surfaces explicit while tightening.
   - preserve formula-vs-family-vs-low-confidence wording on engine and
     workbench surfaces
   - if wording changes reach the workbench, keep
     `apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts`
     and
     `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`
     green without broadening support semantics
4. Close the tightening slice only when the tighter route remains bounded and
   repeatable.
   - update the planning contract only after tightening edits land
   - keep the focused gate green throughout
   - rerun the broad repo gate before calling the slice closed

### Tightening Queue

This queue is ordered. Do not skip to CLT or blocked families before the
earlier concrete tightening steps are either landed or explicitly classified as
still unready.

1. Low-confidence posture audit
   - re-evaluate the reinforced-concrete `vinyl + elastic ceiling` branch
   - either tighten its confidence posture with evidence-backed guards or leave
     it explicitly low-confidence
2. Residual family-vs-formula fit audit
   - compare the surviving published-family and formula-owned reinforced-
     concrete branches
   - tighten only where the family lane is already bounded and the fit drift is
     measurable
3. Companion-output and edge-continuity audit
   - ensure companion airborne outputs, unsupported buckets, and hostile edge
     continuity stay honest under the tighter posture

### Queue Status Right Now

Use this as the live handoff state, not as a hypothetical queue.

1. Heavy-concrete parity queue
   - current status: closed
   - reopen only if a new explicit predictor vs visible-stack mismatch is
     backed by current canonicalization or existing source-topology rules
2. Concrete tightening queue
   - current status: started
   - use
     `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
     as the living ownership matrix for this pass
   - landed honesty substeps:
     - reinforced-concrete low-confidence proxy-airborne honesty on warnings,
       predictor status, and support notes
     - reinforced-concrete low-confidence wording on workbench warning notes,
       output cards, target-status details, branch summary, and guided
       validation summary
     - reinforced-concrete low-confidence candidate pooling now stays on the
       nearer combined concrete rows instead of mixing in carpet and bare-slab
       rows
     - reinforced-concrete low-confidence predictor-only fit now shares the
       same displayed 29% ceiling as the derived tier, and trace/report
       surfaces now carry the same mixed-row / proxy-companion honesty wording
     - reinforced-concrete low-confidence validation-posture detail now uses
       the same 29% mixed-row fallback wording instead of the generic final
       fallback copy
     - residual reinforced-concrete family-vs-formula fit posture now has a
       living audit guard that keeps the low-confidence combined-vinyl lane on
       the bounded combined-geometry slope while preserving a visible numeric
       gap from the formula-owned heavy-floating corridor
     - predictor-side reinforced-concrete low-confidence edge continuity now
       has a living audit guard for small near-threshold slab and ceiling
       changes plus neutral board-class presence, so the lane stays stable
       without hidden branch flips or abrupt numeric jumps
     - visible-stack reinforced-concrete low-confidence edge continuity now
       has a living audit guard for neutral reorder, board-alias, and safe
       same-material split variants, while the expanded four-board ceiling
       schedule is pinned as an intentional formula-owned boundary instead of
       a silent low-confidence carry-over
     - scenario-driven diagnostics/proposal guards now pin the same branch on
       low-confidence fallback wording across evidence citations, diagnostics
       dossier, and proposal brief outputs instead of generic published-family
       phrasing
3. Held CLT queue
   - current status: still held second
   - reopen only after reinforced-concrete tightening stabilizes

### Step Transition Rule

Follow this rule mechanically to avoid drifting into unsupported tightening or
accidental re-widening.

1. Start with one defended reinforced-concrete honesty or fit problem.
2. Tighten it only if all of the following are true:
   - the branch already belongs to the owned reinforced-concrete corridor
   - the tighter posture is justified by current benchmarks, bounded family
     evidence, or explicit formula ownership
   - the change does not reopen a blocked parity or source-anomaly boundary
3. If any one of those checks fails, leave the branch on its current posture.
4. If a tightening pass ends without a defended improvement, keep the corridor
   frozen and move to the next ranked family only after documenting that result.

### Execution Loop From Here

Use this loop for each reinforced-concrete tightening step.

1. Probe one owned reinforced-concrete honesty / fit target locally.
2. Reject it immediately if it depends on reopening a blocked family or a
   closed parity candidate.
3. Add route-level, benchmark, and support-bucket tests that describe the
   tighter intended posture.
4. Land the smallest tightening change that satisfies those tests.
5. Run the targeted reinforced-concrete engine pack.
6. Run `pnpm calculator:gate:current`.
7. Update `NEXT_IMPLEMENTATION_PLAN.md` and `CURRENT_STATE.md` if the step
   lands.
8. Stop the slice when the remaining tightening queue contains only branches
   that still lack evidence for a tighter posture.

### Validation Commands For This Checkpoint

1. `pnpm --filter @dynecho/engine exec vitest run src/post-heavy-concrete-formula-family-widening-next-slice-selection-contract.test.ts src/reinforced-concrete-formula-family-closeout-audit.test.ts src/impact-heavy-floor-planned-scope-benchmark.test.ts src/reinforced-concrete-floor-monotonicity.test.ts src/dataholz-clt-source-truth-audit.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/web exec vitest run features/workbench/heavy-concrete-formula-history-card-matrix.test.ts features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts --maxWorkers=1`
3. `pnpm check`
4. `pnpm build`
5. `git diff --check`

### Slice Stop Conditions

- stop if the tightening leaks outside reinforced-concrete carriers into CLT,
  open-box, open-web, or selector-specific behavior
- stop if exact, catalog, product-delta, lower-bound, family, formula, or
  low-confidence ownership is blurred to make the result look cleaner
- stop if field/report/provenance surfaces become less explicit about answer
  origin
- stop if Dataholz `GDMTXA04A`, TUAS `C11c`, or any bare-carrier source anomaly
  is implicitly reopened by the same change

## Explicitly Deferred Until This Tightening Closes

- Dataholz CLT calibration tightening
- raw bare open-box/open-web impact widening
- Dataholz `GDMTXA04A` visible exact reopen
- TUAS `C11c` exact import
- wall-selector behavior widening

## Provisional Next Phase Order

This order is provisional and should be revalidated when the active slice
closes, but it is the current safest program sequence.

1. `reinforced_concrete_accuracy_tightening_follow_up_v1`
   - tighten any still-broad or low-confidence reinforced-concrete branches that
     remain after the widening closeout
   - especially re-check the combined vinyl + elastic-ceiling concrete lane
     before allowing it to graduate beyond low-confidence
2. `dataholz_clt_calibration_tightening`
   - keep CLT as a tightening-first family, not a broadening-first family
   - only improve same-family deviation, monotonicity, and exact-vs-estimate
     discipline
3. source-backed widening re-rank
   - reconsider only after the concrete pass and CLT tightening are stable
   - raw bare open-box/open-web, `GDMTXA04A`, `C11c`, and wall-selector work
     remain blocked until their existing evidence posture changes

## ROI-Ranked Order From Here

Use this order when choosing the next implementation action. The point is not
just “what is technically next”, but “what buys the most defended progress per
unit of risk and engineering time”.

1. `reinforced_concrete_accuracy_tightening_follow_up_v1`
   - ROI: high
   - why:
     - reinforced concrete is already an owned corridor, so accuracy work here
       compounds across the existing user-facing answer surface
     - the biggest remaining honesty risk is no longer missing reach inside the
       current corridor, but broad family or low-confidence branches that may
       still be too loose
   - likely targets:
     - `vinyl + elastic ceiling` evidence posture
     - solver-side residual family-vs-formula fit decision on the
       `vinyl + elastic ceiling` branch
     - companion-output honesty and edge continuity
2. `dataholz_clt_calibration_tightening`
   - ROI: medium-high
   - why:
     - CLT is already defended enough to tighten
     - but it has lower immediate ROI than reinforced-concrete tightening
       because there is no fresh classified runtime red forcing it now
   - keep the scope tightening-first:
     - no broad CLT widening
     - no blocked exact reopen hidden inside calibration work
3. Source-backed widening re-rank for currently blocked families
   - ROI: conditional / later
   - why:
     - these items can be valuable, but they carry the highest evidence and
       model-risk burden
     - they should only be reopened after concrete widening and tightening
       leave a clean baseline
   - currently includes:
     - raw bare open-box/open-web impact widening
     - `GDMTXA04A`
     - `C11c`
     - wall-selector widening
4. Reopen reinforced-concrete parity widening only if a new proof-backed
   equivalence appears
   - ROI: conditional / opportunistic
   - why:
     - this queue is no longer presumed to contain a hidden win
     - reopen it only if canonicalization, visible-stack derivation, or a
       source-backed topology rule changes

## Decision Gates From Here

This is the mechanical sequence from the current checkpoint.

1. Keep the final defended-equivalence probe closed as a negative guard.
2. Keep the parity queue closed unless a new proof-backed equivalence appears.
3. Open `reinforced_concrete_accuracy_tightening_follow_up_v1`.
4. Only after reinforced-concrete tightening stabilizes, re-open CLT
   tightening.
5. Only after both tightening families are stable, re-rank blocked
   source-backed widening families.

## Immediate Next Steps

1. Keep this file as the authoritative immediate plan until the
   reinforced-concrete accuracy tightening is actually closed.
2. Treat the requested-output harness chain as closed and frozen.
3. Keep the heavy-concrete widening closed:
   the landed parity fixes, negative guard, and closeout audit are now the
   fixed baseline for tightening.
4. Landed widening ledger:
   explicit predictor-input `combined_upper_lower_system` concrete stacks with
   a generic floating upper package no longer drop the resilient separator and
   collapse onto the bare-slab formula path.
5. Landed widening ledger:
   reinforced-concrete `combined_upper_lower_system` wet ceramic-tile plus
   elastic-ceiling predictor input promotes onto the defended published
   heavy-concrete upper-treatment lane, anchored to the curated
   `euracoustics_f2_elastic_ceiling_concrete_lab_2026` row while keeping the
   same-stack DeltaLw companion explicit.
6. Landed widening ledger:
   reinforced-concrete `combined_upper_lower_system` wet ceramic-tile plus
   rigid gypsum-ceiling predictor input promotes onto the defended published
   heavy-concrete upper-treatment lane without widening into blocked ceiling
   variants.
7. Landed widening ledger:
   visible combined wet reinforced-concrete stacks with plain gypsum ceilings
   derive back onto the same defended elastic and rigid published
   heavy-concrete lanes, while DeltaLw remains the visible-stack formula
   companion.
8. Landed widening ledger:
   explicit predictor input that uses the `fire_board` alias on the defended
   reinforced-concrete firestop-board archetype corridor resolves onto the same
   bounded family-archetype lanes as canonical `firestop_board` inputs.
9. Landed widening ledger:
   split `engineered_timber_flooring` plus generic resilient-underlay concrete
   inputs canonicalize onto the same bounded Knauf timber-underlay archetype
   lane as `engineered_timber_with_acoustic_underlay`.
10. Final widening-boundary guard:
   canonical concrete carpet inputs still use the defended carpet archetype
   lane, but adding a generic resilient underlay does not count as the same
   physical system.
   That route now stays on the bare-floor impact formula while carrying only
   the heavy-concrete airborne companion estimate.
11. Residual closeout guard:
   the concrete formula-vs-family ownership matrix is now executable in
   `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`.
12. Next execution step:
   start `reinforced_concrete_accuracy_tightening_follow_up_v1` instead of
   reopening speculative widening.
13. First tightening targets:
   `vinyl + elastic ceiling` evidence posture, the solver-side residual
   family-vs-formula fit decision on that branch, and companion-output /
   edge-continuity honesty.
   First landed substep:
   reinforced-concrete low-confidence proxy-airborne honesty now stays explicit
   on engine warnings plus predictor/support provenance surfaces without
   promoting the branch out of `low_confidence`.
   Broad revalidation result:
   that honesty/ranking chain is now repo-wide green, so the next honest move
   is solver-side tightening instead of another wording-only micro-pass.
14. Keep the held Dataholz CLT candidate explicit; do not silently substitute it
   for the selected reinforced-concrete tightening.
