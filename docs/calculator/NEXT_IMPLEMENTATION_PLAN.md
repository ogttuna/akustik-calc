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
- [CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md](./CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md)
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
  `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
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

## Closeout Summary

The requested-output harness chain remains frozen. The no-runtime rerank that
followed it is now also closed.

Concrete comparison result:

- selected next widening direction:
  `heavy_concrete_formula_family_widening_v1`
- held but not selected candidate:
  `dataholz_clt_calibration_tightening`
- why heavy concrete won the rerank:
  - the formula lane is already live on bare and floating reinforced-concrete
    routes
  - official catalog exact rows, product-delta rows, and lower-bound anchors
    already defend the same corridor
  - monotonicity, helper-negative, history, trace, report, and method-dossier
    provenance guards are already green
  - widening can stay inside a physically obvious reinforced-concrete corridor
    instead of reopening a blocked source anomaly
- why Dataholz CLT did not win the rerank:
  - exact-only slack is now mostly consumed
  - the remaining `GDMTXA04A` row is still a manual-match/material-surface
    boundary, not generic calibration slack
  - there is no fresh classified runtime red on the current defended CLT estimate
    lane
- no runtime or numeric calculator behavior changed in the rerank itself

## Current Position

- latest committed checkpoint:
  `CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md`
- latest closed implementation slice:
  `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
- closed planning action in this pass:
  `post_mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_next_slice_selection_v1`
- selected next implementation slice:
  `heavy_concrete_formula_family_widening_v1`
- slice type:
  runtime formula-family widening on the defended reinforced-concrete corridor
- implementation status:
  selected, contract-guarded, and partially landed
- explicit not-done item at this checkpoint:
  the full heavy-concrete corridor widening is not closed yet; only the first
  six defended predictor-side substeps have landed

## Selected Next Slice

- slice id:
  `heavy_concrete_formula_family_widening_v1`
- workstream:
  `runtime_formula_family_widening`
- route family:
  `heavy_concrete_formula_floor_lane`
- output surface:
  `heavy_concrete_formula_family_widening_matrix`
- engine companion surface:
  `reinforced_concrete_formula_scope_benchmark`
- behavior class:
  runtime widening inside an already-owned reinforced-concrete formula corridor

### Scope

- widen the current heavy-concrete formula family lane only where the reinforced
  concrete corridor is already source-anchored or formula-owned
- preserve exact row, exact catalog, product-delta, and lower-bound precedence
  over the formula lane
- keep formula provenance explicit on engine, workbench, trace, and report
  surfaces
- do not use this slice to reopen CLT, raw open-box/open-web, `GDMTXA04A`,
  `C11c`, or wall-selector behavior

### Candidate Re-rank Result

Selected now:

- `heavy_concrete_formula_family_widening`
  - posture: selected after the post-harness rerank
  - reason: live formula lane plus catalog/lower-bound anchors and green
    monotonicity / provenance guards make it the highest-ROI honest widening

Held for later:

- `dataholz_clt_calibration_tightening`
  - posture: held second candidate after rerank
  - reason: current CLT estimate lane is defended, the remaining exact-only row
    is still a blocked material-surface boundary, and no fresh runtime red is
    forcing immediate CLT calibration work

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
  `packages/engine/src/post-mixed-floor-wall-runtime-candidate-re-rank-after-requested-output-harness-next-slice-selection-contract.test.ts`
- heavy-concrete engine evidence:
  - `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
  - `packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts`
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/calculate-impact-only.test.ts`
- heavy-concrete web evidence:
  - `apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts`
  - `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`
- held CLT evidence:
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- likely runtime edit anchors for the selected widening:
  - `packages/engine/src/impact-estimate.ts`
  - `packages/engine/src/floor-system-estimate.ts`
  - `packages/engine/src/dynamic-impact.ts`
  - `packages/engine/src/impact-support.ts`
- focused gate entrypoint:
  `tools/dev/run-calculator-current-gate.ts`
- source-backed boundary ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

### Current Corridor Audit Map

Use this map before touching runtime logic. It separates what is already
landed, what is explicitly blocked, and what still needs parity audit.

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

The current re-read of the reinforced-concrete corridor did not prove a
seventh defended parity widening yet.

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
- planning consequence:
  - keep searching only for already-proven equivalent representations
  - if none remain, switch from parity widening to the residual
    formula-vs-family closeout audit instead of inventing a new corridor

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

1. Freeze the widening envelope in tests before changing runtime behavior.
   - extend `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
     only with reinforced-concrete cases that are already source-anchored or
     formula-owned today
   - keep the benchmark limited to the currently defended precedence classes:
     official exact catalog, official product-delta, narrow formula plus
     lower-bound carry-over, and any published-family estimate that stays inside
     the reinforced-concrete corridor
   - extend `packages/engine/src/calculate-impact-only.test.ts` for the
     precedence edges that the widening must preserve
2. Land the runtime widening only inside the reinforced-concrete lane.
   - keep `packages/engine/src/impact-estimate.ts` scoped to bare slabs and
     explicit dynamic-stiffness floating-floor formulas
   - widen
     `packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts`
     and `packages/engine/src/floor-system-estimate.ts` only for
     reinforced-concrete upper-only / heavy-floating / combined cases already
     defended by the current benchmark pack
   - do not let the widening activate on CLT, open-box, open-web, composite,
     `GDMTXA04A`, `C11c`, or wall-selector-specific behavior
3. Keep provenance and support surfaces explicit if the selected lane broadens.
   - preserve formula-vs-family labels in
     `packages/engine/src/dynamic-impact.ts` and
     `packages/engine/src/impact-support.ts`
   - if wording changes reach the workbench, keep
     `apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts`
     and
     `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`
     green without broadening support semantics
4. Close the slice only when the selected widening is both bounded and
   repeatable.
   - update the planning contract to the follow-up selection only after the
     heavy-concrete runtime widening has actually landed
   - keep the focused gate green throughout
   - rerun the full engine suite before calling the slice closed
   - rerun targeted web validation and broader repo gates only if user-facing
     provenance or support wording changes

### Remaining Audit Queue

This queue is ordered. Do not skip to broader items before the earlier audit
steps are either landed or explicitly classified as blocked.

1. Remaining defended reinforced-concrete upper-treatment representation audit
   - search for explicit predictor vs visible-stack mismatches that still stay
     inside the current wet ceramic-tile + bounded gypsum corridor
   - do not widen into firestop rigid, no-fill, tile-only, lower-only, or
     vinyl-elastic branches while doing this audit
2. Remaining defended reinforced-concrete archetype representation audit
   - search for input-shape mismatches that still map onto the existing Knauf
     concrete timber-underlay or tile archetype candidates
   - accept only canonicalization/parity fixes; reject anything that invents a
     new archetype family
3. Residual formula-vs-family audit for slice closeout
   - once no further defended parity gap is found, explicitly compare the
     surviving reinforced-concrete formula and family lanes
   - document which branches remain formula-owned, which remain low-confidence,
     and why they are not being promoted yet
   - only after that audit should the slice be considered for closeout and the
     next tightening slice be opened

### Queue Status Right Now

Use this as the live handoff state, not as a hypothetical queue.

1. Upper-treatment parity queue
   - current status: no new defended mismatch proven in the latest audit pass
   - reopen only if a new explicit predictor vs visible-stack mismatch is
     backed by current canonicalization or existing source-topology rules
2. Archetype parity queue
   - current status: no new defended mismatch proven beyond the six landed
     substeps
   - reopen only for alias/canonicalization fixes that map onto the already
     owned Knauf timber-underlay or tile archetype lanes
3. Residual formula-vs-family closeout audit
   - current status: executable audit guard is now landed
   - use
     `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
     as the living ownership matrix for the remaining concrete closeout pass
   - this is now the default next move, not a fallback after speculative
     widening

### Step Transition Rule

Follow this rule mechanically to avoid drifting into unsupported widening.

1. Start with one candidate representation mismatch.
2. Promote it to implementation only if all of the following are true:
   - a stronger defended lane already exists for the same physical system
   - equivalence is proven by canonicalization, visible-stack derivation, or an
     existing source-backed topology rule
   - the stronger lane does not cross a blocked boundary
3. If any one of those checks fails, classify the candidate as blocked or
   unproven and do not widen runtime behavior.
4. If an audit pass ends with no implementation-qualified candidate, move the
   slice to the residual formula-vs-family closeout audit.

### Execution Loop From Here

Use this loop for each remaining heavy-concrete step.

1. Probe one candidate representation mismatch locally.
2. Reject it immediately if it crosses a blocked boundary or lacks a defended
   stronger lane.
3. Add route-level and benchmark tests that describe the intended stronger lane.
4. Land the smallest canonicalization/parity fix that satisfies those tests.
5. Run the targeted heavy-concrete engine pack.
6. Run `pnpm calculator:gate:current`.
7. Update `NEXT_IMPLEMENTATION_PLAN.md` and `CURRENT_STATE.md` if the step
   lands.
8. Stop the slice when the remaining queue contains only blocked or unproven
   candidates.

### Accuracy Pairing For This Slice

The current widening is only acceptable if it also sharpens the reinforced-
concrete corridor.

- preserve the narrow Annex-C heavy-floor formulas as the owned formula route
  for bare slabs and explicit dynamic-stiffness floating floors
- keep officially anchored exact/product/lower-bound rows ahead of any broader
  reinforced-concrete family estimate
- do not silently promote the current reinforced-concrete combined vinyl +
  elastic-ceiling low-confidence lane into a stronger posture without new
  corridor-specific benchmark evidence
- if the widening adds a new reinforced-concrete family branch, refresh the
  reinforced-concrete benchmark/test pack so the new route is classified as
  exact, family-specific, family-general, or low-confidence on purpose

### Validation Commands For This Checkpoint

1. `pnpm --filter @dynecho/engine exec vitest run src/post-mixed-floor-wall-runtime-candidate-re-rank-after-requested-output-harness-next-slice-selection-contract.test.ts src/impact-heavy-floor-planned-scope-benchmark.test.ts src/reinforced-concrete-floor-monotonicity.test.ts src/dataholz-clt-source-truth-audit.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/web exec vitest run features/workbench/heavy-concrete-formula-history-card-matrix.test.ts features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine test`
4. `pnpm --filter @dynecho/web test`
5. `pnpm typecheck`
6. `pnpm lint`
7. `pnpm build`
8. `git diff --check`

### Slice Stop Conditions

- stop if the widening leaks outside reinforced-concrete carriers into CLT,
  open-box, open-web, or selector-specific behavior
- stop if exact, catalog, product-delta, or lower-bound precedence is weakened
  by the new formula-family lane
- stop if the widening makes field/report/provenance surfaces less explicit
  about formula ownership
- stop if Dataholz `GDMTXA04A`, TUAS `C11c`, or any bare-carrier source anomaly
  is implicitly reopened by the same change

## Explicitly Deferred Until This Widening Closes

- Dataholz CLT calibration tightening
- raw bare open-box/open-web impact widening
- Dataholz `GDMTXA04A` visible exact reopen
- TUAS `C11c` exact import
- wall-selector behavior widening

## Provisional Next Phase Order

This order is provisional and should be revalidated when the active slice
closes, but it is the current safest program sequence.

1. `heavy_concrete_formula_family_widening_v1`
   - broaden reinforced-concrete runtime coverage only inside the owned corridor
   - preserve precedence and provenance
2. `reinforced_concrete_accuracy_tightening_follow_up`
   - tighten any still-broad or low-confidence reinforced-concrete branches that
     remain after the widening lands
   - especially re-check the combined vinyl + elastic-ceiling concrete lane
     before allowing it to graduate beyond low-confidence
3. `dataholz_clt_calibration_tightening`
   - keep CLT as a tightening-first family, not a broadening-first family
   - only improve same-family deviation, monotonicity, and exact-vs-estimate
     discipline
4. source-backed widening re-rank
   - reconsider only after the concrete pass and CLT tightening are stable
   - raw bare open-box/open-web, `GDMTXA04A`, `C11c`, and wall-selector work
     remain blocked until their existing evidence posture changes

## Immediate Next Steps

1. Keep this file as the authoritative immediate plan until the
   heavy-concrete widening is actually closed.
2. Treat the requested-output harness chain as closed and frozen.
3. Benchmark/precedence expansion for the reinforced-concrete corridor is now
   in progress.
4. First landed runtime substep:
   explicit predictor-input `combined_upper_lower_system` concrete stacks with a
   generic floating upper package no longer drop the resilient separator and
   collapse onto the bare-slab formula path.
5. Second landed runtime substep:
   reinforced-concrete `combined_upper_lower_system` wet ceramic-tile plus
   elastic-ceiling predictor input now promotes onto the defended published
   heavy-concrete upper-treatment lane, anchored to the curated
   `euracoustics_f2_elastic_ceiling_concrete_lab_2026` row while keeping the
   same-stack DeltaLw companion explicit.
6. Third landed runtime substep:
   reinforced-concrete `combined_upper_lower_system` wet ceramic-tile plus
   rigid gypsum-ceiling predictor input now promotes onto the defended
   published heavy-concrete upper-treatment lane, using the bounded rigid
   family blend that mirrors the visible-layer corridor without widening into
   firestop-board or other blocked ceiling variants.
7. Fourth landed runtime substep:
   visible combined wet reinforced-concrete stacks with plain gypsum ceilings
   now derive back onto the same defended elastic and rigid published
   heavy-concrete lanes, because the runtime treats the derived
   `generic_gypsum_board` token as the same bounded gypsum corridor. The
   carried DeltaLw companion remains the visible-stack formula result, not an
   overridden family value.
8. Fifth landed runtime substep:
   explicit predictor input that uses the `fire_board` alias on the defended
   reinforced-concrete firestop-board archetype corridor now resolves onto the
   same bounded family-archetype lanes as canonical `firestop_board` inputs,
   instead of falling closed onto the bare-concrete formula path.
9. Sixth landed runtime substep:
   split `engineered_timber_flooring` plus generic resilient-underlay concrete
   inputs now canonicalize onto the same bounded Knauf timber-underlay
   archetype lane as `engineered_timber_with_acoustic_underlay`, instead of
   dropping to the bare-concrete formula route when the underlay stays generic
   and otherwise empty.
10. Next runtime substep:
   widen only the remaining defended reinforced-concrete upper/combined
   predictor cases without touching blocked families, selector behavior, the
   firestop-board rigid ceiling boundary, or the concrete vinyl +
   elastic-ceiling low-confidence boundary.
    If one more explicit defended-equivalence probe does not produce an
    implementation-qualified candidate, stop widening and move the slice to
    closeout preparation.
11. Residual closeout guard landed:
   the concrete formula-vs-family ownership matrix is now executable in
   `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`.
12. Pair each widening step with explicit reinforced-concrete accuracy checks
   instead of treating broader support as success by itself.
13. Keep the held Dataholz CLT candidate explicit; do not silently substitute it
   for the selected heavy-concrete widening.
