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
- [CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md)
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

## Immediate Execution Frame

Use this section first when deciding what to do next.

### Now

- active slice:
  `dataholz_clt_calibration_tightening`
- current highest-ROI task:
  continue the defended Dataholz CLT tightening pass by auditing the residual
  `CI50_2500` / `L'nT,50` slack after the first visible `GDMTXA04A`-like
  estimate calibration landed
- closeout decision now landed:
  reinforced-concrete `vinyl + elastic ceiling` remains intentionally
  `low_confidence`, and the dormant direct published-family overlap was
  removed so no hidden narrower defended lane remains
- active-slice progress now landed:
  the visible `GDMTXA04A`-like composite dry-screed boundary stays on the
  defended estimate lane, but its lab-side impact outputs are now capped
  against the direct official exact row so the route no longer drifts
  optimistically on `Ln,w`, `CI`, or `Ln,w+CI`

### Next

1. Keep the visible `GDMTXA04A`-like CLT boundary on its estimate-only route
   with the new lab-side impact cap in place.
2. Decide whether the remaining `CI50_2500` / `L'nT,50` slack can be tightened
   without reopening blocked exact ownership.
3. Keep `GDMTXA04A` as an explicit blocked exact-reopen decision unless fresh
   evidence supports a narrower surface rule.

### Later

1. blocked source-backed widening re-rank
2. conditionally reopen reinforced-concrete or `GDMTXA04A` only if fresh proof
   appears

### Explicit Non-Goals Right Now

- do not reopen heavy-concrete parity widening
- do not widen raw source families from nearby green tests
- do not spend another reinforced-concrete wording micro-pass now that the
  solver-side closeout is explicit

## Verified Against Implementation - 2026-04-17

- latest active-slice CLT calibration progress on `2026-04-17`:
  - landed `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - the visible `GDMTXA04A`-like composite dry-screed boundary stays
    estimate-only with candidate `dataholz_gdmtxa01a_clt_lab_2026`
  - lab-side impact outputs are now capped against the direct official exact
    row on `Ln,w`, `CI`, and `Ln,w+CI`
  - residual `CI50_2500` / `L'nT,50` slack remains the next CLT tightening
    target; the direct `GDMTXA04A` exact reopen stays blocked
- latest active-slice CLT calibration validation on `2026-04-17`:
  - targeted CLT engine pack: `7/7` test files passed, `318/318` tests passed
  - focused engine gate: `6/6` test files passed, `24/24` tests passed
  - focused web gate: `4/4` test files passed, `12/12` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `154/154` files and `946/946` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
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
  - full engine suite: `152/152` test files passed, `942/942` tests passed
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
- local verification in this solver-side overlap-removal pass:
  - targeted engine overlap pack: `4/4` test files passed, `35/35` tests
    passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `34/34` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm check`: green
  - full engine suite: `152/152` test files passed, `942/942` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this reinforced-concrete closeout selection pass:
  - focused engine gate: `5/5` test files passed, `23/23` tests passed
  - focused web gate: `2/2` test files passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green
  - full engine suite: `153/153` test files passed, `945/945` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - `pnpm check`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green

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
  `dataholz_clt_calibration_tightening`
- closed but still guarded candidate:
  `reinforced_concrete_accuracy_tightening_follow_up_v1`
- why Dataholz CLT moves up now:
  - reinforced-concrete overlap and solver-side honesty risk are now explicitly
    closed
  - the defended CLT exact/estimate corridor is already benchmarked and
    source-truth pinned
  - the only remaining exact-only CLT slack is `GDMTXA04A`, which stays a
    blocked material-surface decision rather than a reason to delay CLT
    calibration work
  - blocked source-family widening still has lower ROI than tightening the
    defended CLT corridor next
- why reinforced-concrete does not stay active:
  - the corridor is now intentionally frozen on the low-confidence branch
    without a hidden helper overlap
  - remaining work there is no longer the best next runtime return
- no runtime or numeric calculator behavior changed in the closeout selection
  itself

## Current Position

- latest committed checkpoint:
  `CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md`
- latest closed implementation slice:
  `reinforced_concrete_accuracy_tightening_follow_up_v1`
- closed planning action in this pass:
  `post_reinforced_concrete_accuracy_tightening_follow_up_next_slice_selection_v1`
- selected next implementation slice:
  `dataholz_clt_calibration_tightening`
- slice type:
  runtime accuracy tightening on the defended Dataholz CLT corridor
- implementation status:
  in progress; the reinforced-concrete tightening corridor is closed as an
  explicit low-confidence helper/solver agreement, and the CLT slice has now
  landed its first visible-boundary calibration step without reopening blocked
  source-anomaly surfaces
- explicit not-done item at this checkpoint:
  the CLT tightening slice is open; residual `CI50_2500` / `L'nT,50` slack
  still needs to be audited, while `GDMTXA04A` stays blocked as a
  material-surface exact reopen until fresh evidence appears

## Selected Next Slice

- slice id:
  `dataholz_clt_calibration_tightening`
- workstream:
  `runtime_accuracy_tightening`
- route family:
  `mass_timber_clt_floor_lane`
- output surface:
  `dataholz_clt_calibration_tightening_matrix`
- engine companion surface:
  `dataholz_clt_source_truth_audit`
- behavior class:
  runtime tightening inside an already-defended Dataholz CLT floor corridor

### Scope

- tighten Dataholz CLT exact-vs-estimate behavior only inside the already-
  defended corridor
- preserve exact row, catalog, bound, family, and blocked exact-only ownership
  boundaries
- keep `GDMTXA04A` explicit as a blocked material-surface decision unless fresh
  source evidence changes that posture
- use this slice to improve CLT calibration posture, not to reopen blocked
  source widening or reinforce-concrete wording churn

### Closeout Selection Result

Selected now:

- `dataholz_clt_calibration_tightening`
  - posture: selected after the reinforced-concrete tightening closeout
  - reason: the reinforced-concrete corridor is now explicitly frozen, so CLT
    becomes the highest-ROI defended tightening family

Conditionally reopen only if new proof appears:

- `reinforced_concrete_accuracy_reopen`
  - posture: explicitly not selected
  - reason: the `vinyl + elastic ceiling` branch now has an explicit
    low-confidence closeout with no hidden family overlap left to reopen

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
  `packages/engine/src/post-reinforced-concrete-accuracy-tightening-follow-up-next-slice-selection-contract.test.ts`
- closed reinforced-concrete evidence:
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts`
- selected CLT evidence:
  - `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
  - `apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts`
  - `apps/web/features/workbench/output-origin-trace-card-matrix.test.ts`
- likely runtime edit anchors for the selected tightening:
  - `packages/engine/src/predictor-published-family-estimate.ts`
  - `packages/engine/src/predictor-floor-system-estimate.ts`
  - `packages/engine/src/floor-system-estimate.ts`
  - `packages/engine/src/calculate-assembly.ts`
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

1. Freeze the reinforced-concrete closeout as the entry contract.
   - keep
     `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
     and
     `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`
     green so the closed low-confidence corridor does not silently reopen
2. Tighten only inside the already-defended Dataholz CLT corridor.
   - start with exact-vs-estimate calibration and remaining exact-only slack
     boundaries
   - keep
     `packages/engine/src/predictor-published-family-estimate.ts`,
     `packages/engine/src/predictor-floor-system-estimate.ts`,
     `packages/engine/src/floor-system-estimate.ts`, and
     `packages/engine/src/calculate-assembly.ts` as the primary runtime edit
     anchors
   - do not use this slice to reopen reinforced-concrete wording work, raw
     open-box/open-web, `GDMTXA04A`, `C11c`, selector behavior, or parity
     probes
3. Keep exact-vs-estimate provenance explicit while tightening.
   - preserve exact-vs-family wording on engine and workbench surfaces
   - if CLT wording reaches the workbench, keep
     `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
     green without broadening support semantics
4. Close the tightening slice only when the tighter CLT route remains bounded
   and repeatable.
   - update the planning contract only after tightening edits land
   - keep the focused gate green throughout
   - rerun the broad repo gate before calling the slice closed

### Tightening Queue

1. Exact-vs-estimate calibration audit
   - re-evaluate defended Dataholz CLT estimate rows against the exact rows
     already pinned in the source-truth audit
   - tighten only where the estimate lane stays inside the defended CLT family
2. Remaining exact-only slack audit
   - keep `GDMTXA04A` explicit as the only remaining exact-only CLT row
   - do not reopen it unless a new honest material-surface rule appears
3. Workbench route-carry-through audit
   - ensure exact, estimate, and blocked-exact CLT surfaces stay explicit on
     cards, summaries, and report exports

### Queue Status Right Now

1. Reinforced-concrete closeout queue
   - current status: closed
   - reopen only if a new helper-vs-solver overlap or proof-backed equivalent
     lane appears later
2. CLT tightening queue
   - current status: selected and in progress
   - use
     `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
     as the exact-row source-truth ledger for this pass
   - use
     `packages/engine/src/floor-source-corpus-contract.test.ts`
     as the remaining exact-only slack contract
   - first landed step:
     visible `GDMTXA04A`-like dry-screed estimates now cap `Ln,w`, `CI`, and
     `Ln,w+CI` against the direct official exact row without reopening exact
     ownership
   - next tightening target:
     residual `CI50_2500` / `L'nT,50` slack on the same defended corridor
3. Blocked source-anomaly queue
   - current status: still blocked
   - `GDMTXA04A`, raw bare open-box/open-web, `C11c`, and wall-selector
     widening stay out of scope until fresh evidence appears

### Step Transition Rule

1. Start with one defended CLT exact-vs-estimate or blocked-slack problem.
2. Tighten it only if all of the following are true:
   - the branch already belongs to the defended Dataholz CLT corridor
   - the tighter posture is justified by current exact rows, bounded family
     evidence, or explicit blocked-surface rules
   - the change does not reopen a blocked source-anomaly boundary
3. If any one of those checks fails, leave the branch on its current posture.
4. If a tightening pass ends without a defended improvement, keep the CLT
   corridor frozen and move to the next ranked family only after documenting
   that result.

### Execution Loop From Here

1. Probe one defended Dataholz CLT calibration target locally.
2. Reject it immediately if it depends on reopening a blocked exact or source
   family.
3. Add route-level and workbench-route tests that describe the tighter
   intended posture.
4. Land the smallest tightening change that satisfies those tests.
5. Run the targeted CLT engine/web pack.
6. Run `pnpm calculator:gate:current`.
7. Update `NEXT_IMPLEMENTATION_PLAN.md` and `CURRENT_STATE.md` if the step
   lands.
8. Stop the slice when the remaining CLT queue contains only blocked-surface
   decisions that still lack evidence for a tighter posture.

### Validation Commands For This Checkpoint

1. `pnpm --filter @dynecho/engine exec vitest run src/post-reinforced-concrete-accuracy-tightening-follow-up-next-slice-selection-contract.test.ts src/reinforced-concrete-formula-family-closeout-audit.test.ts src/reinforced-concrete-family-formula-fit-audit.test.ts src/dataholz-clt-calibration-tightening-audit.test.ts src/dataholz-clt-source-truth-audit.test.ts src/floor-source-corpus-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/web exec vitest run features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts features/workbench/remaining-source-gap-posture-card-matrix.test.ts features/workbench/output-origin-trace-card-matrix.test.ts --maxWorkers=1`
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
   - closed and guarded; do not reopen unless new proof appears
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

1. `dataholz_clt_calibration_tightening`
   - ROI: high
   - why:
     - reinforced-concrete is explicitly closed, so CLT is the next defended
       corridor with real tightening headroom
     - exact rows, estimate rows, and remaining exact-only slack are already
       pinned in executable source-truth and route tests
   - keep the scope tightening-first:
     - no broad CLT widening
     - no blocked exact reopen hidden inside calibration work
2. Source-backed widening re-rank for currently blocked families
   - ROI: conditional / later
   - why:
     - these items can be valuable, but they carry the highest evidence and
       model-risk burden
     - they should only be reopened after CLT tightening leaves a clean
       baseline
   - currently includes:
     - raw bare open-box/open-web impact widening
     - `GDMTXA04A`
     - `C11c`
     - wall-selector widening
3. Reopen reinforced-concrete or `GDMTXA04A` only if a new proof-backed
   equivalence appears
   - ROI: conditional / opportunistic
   - why:
     - both boundaries are now intentionally closed rather than forgotten
     - reopen them only if canonicalization, visible-stack derivation, or a
       source-backed material/topology rule changes

## Decision Gates From Here

This is the mechanical sequence from the current checkpoint.

1. Keep the final defended-equivalence probe closed as a negative guard.
2. Keep the parity queue closed unless a new proof-backed equivalence appears.
3. Open `dataholz_clt_calibration_tightening`.
4. Only after CLT tightening stabilizes, re-rank blocked source-backed
   widening families.
5. Reopen reinforced-concrete or `GDMTXA04A` only if fresh proof appears.

## Immediate Next Steps

1. Keep this file as the authoritative immediate plan until the
   Dataholz CLT tightening is actually closed.
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
   start `dataholz_clt_calibration_tightening` instead of reopening a closed
   reinforced-concrete micro-pass.
13. First tightening targets:
   Dataholz CLT exact-vs-estimate calibration, explicit remaining exact-only
   slack, and route/citation carry-through on the defended CLT corridor.
   Entry posture:
   reinforced-concrete is now solver-honest and repo-wide green, so the next
   honest move is CLT tightening instead of more concrete wording or support
   polishing.
14. Keep the blocked source-anomaly candidates explicit; do not silently blur
   `GDMTXA04A`, `C11c`, or raw bare-carrier widening into the selected CLT
   tightening.
