# Next Implementation Plan

Last reviewed: 2026-04-13

This is the short execution plan for the acoustic calculator. It exists because the
long-form calculator docs contain useful history, but the current next step must be
unambiguous.

Read together with:

- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
  when the question is whether a shown answer is source-backed, formula-backed,
  predictor-backed, bound-only, or unsupported
- [CURRENT_STATE.md](./CURRENT_STATE.md) for the latest verified posture
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) before widening any floor
  family lane

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
- latest local checkpoint commits:
  - `08c918e docs(calculator): document answer origins and next gates`
  - `631f16d test(web): stabilize full workbench validation gate`
  - `b172d5b test(calculator): add output origin trace matrices`
  - `9abdd5f test(calculator): pin source and raw floor answer guards`
  - `5d5a2b1 test(web): reuse mixed wall history fixture`
- the checkpoint commit stack was clean after `08c918e` before this docs-only
  next-slice selection review
- `git diff --check`: green
- `pnpm --filter @dynecho/engine typecheck`: green
- `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
  TypeScript plugin recommendation
- latest change-adjacent engine direct predictor guard:
  - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts --reporter=basic`
  - result: `1` file passed, `19` tests passed
- latest change-adjacent engine source/route guard:
  - command: `pnpm --filter @dynecho/engine exec vitest run src/tuas-support-surface-decision-contract.test.ts --reporter=basic`
  - result: `1` file passed, `11` tests passed
- latest change-adjacent workbench route guard:
  - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
  - result: `1` file passed, `92` tests passed
- latest engine route/broad guard pack:
  - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/tuas-support-surface-decision-contract.test.ts src/floor-widening-candidate-contract.test.ts src/floor-source-corpus-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
  - result: `6` files passed, `323` tests passed
- latest workbench broad route guard pack:
  - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts --reporter=basic`
  - result: `2` files passed, `107` tests passed
- full engine suite:
  - command: `pnpm --filter @dynecho/engine test`
  - result: `98` files passed, `786` tests passed
- `pnpm build`: green
- known non-blocking build warnings:
  - `sharp/@img` optional-package warnings through `proposal-docx`
  - Next.js TypeScript plugin recommendation
- latest closed implementation slices:
  - `floor_airborne_companion_c_ctr_semantic_audit_v1`
  - `clt_laminate_underlay_interpolation_guard_v1`
  - `clt_dry_finish_package_guard_v1`
  - `clt_combined_finish_fallback_guard_v1`
  - `open_box_disjoint_upper_fallback_guard_v1`
  - `open_box_finish_package_guard_v1`
  - `open_box_finish_tolerance_guard_v1`
- direct broad multi-worker `vitest run` currently has all assertions green but
  can still exit non-zero from Vitest worker RPC timeout after CPU-heavy
  dynamic-airborne generated scans; use the package `test` script for the
  accepted full engine gate

Latest closed source-truth slice:

- slice id: `dataholz_clt_source_truth_audit_v1`
- type: source-led raw/predictor guard; no widening and no solver behavior
  change
- current status: implemented and target-green
- reason:
  - `mixed_floor_wall_seeded_route_history_expansion_v1` is already closed and
    committed for the first heavy-composite wall target
  - optional `open_box_finish_tolerance_mixed_history_boundary_v1` is deferred
    to keep this pass small
  - source-led floor widening is eligible, but the remaining Dataholz CLT
    exact-only slack had to be measured first so `GDMTXA04A` cannot become a
    broad raw-inference shortcut
- implemented edit set:
  - [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts)
    - pins all `9` imported Dataholz CLT rows to explicit catalog source truth
    - measures official-id field continuations for `L'n,w`, `L'nT,w`, and
      `L'nT,50`
    - asserts visible raw/tagged route posture for exact rows, manual-match
      disabled rows, contiguous split stability, and disjoint-role fallback
  - [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts)
    - checks output cards for exact dry CLT
    - checks `GDMTXA04A` remains estimate-routed through
      `dataholz_gdmtxa01a_clt_lab_2026`, with `Ctr` unsupported on the visible
      lab route
- validation:
  - pre-edit engine raw/corpus baseline: `4` files, `11` tests, green
  - post-edit Dataholz CLT audit: `1` file, `5` tests, green
  - post-edit engine source/raw pack: `5` files, `16` tests, green
  - post-edit workbench route/raw pack: `4` files, `7` tests, green
  - `pnpm --filter @dynecho/engine typecheck`: green
  - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
    TypeScript plugin recommendation
  - `pnpm --filter @dynecho/engine test`: `97` files, `785` tests, green

Current completed answer-guard slice:

- slice id: `raw_concrete_helper_permutation_answer_guard_v1`
- umbrella: `floor_raw_inference_source_led_widening_v1`
- type: test-first answer/support guard around an already-open raw-floor
  corridor; no planned solver behavior change
- current status: implemented and target-green
- selection result:
  - choose this before `wall_selector_wider_trace_matrix_v1` because the wall
    selector currently has no new proven runner-up family beyond the defended
    wall hold
  - choose this before `clt_local_combined_interaction_evidence_v1` because the
    latest CLT source audit deliberately froze `GDMTXA04A` and the remaining
    CLT combined work would need new source evidence before changing routes
  - choose it inside `floor_raw_inference_source_led_widening_v1` because the
    implementation already contains a deliberately narrow raw terminal-concrete
    helper signal, while the current tests still lean more on support buckets
    than explicit answer snapshots
- researched implementation boundary:
  - the raw helper signal only applies when the visible input has no explicit
    floor roles
  - impact inference must identify terminal `concrete` as `base_structure`
  - every inferred layer before the concrete must be `ceiling_board`,
    `ceiling_cavity`, or `ceiling_fill`
  - at least one `ceiling_board` and at least one helper layer
    (`ceiling_cavity` or `ceiling_fill`) must be present
  - adding a top-side finish after the concrete, moving concrete away from the
    terminal position, or using weaker carriers such as open-box timber,
    open-web steel, lightweight steel, steel joist, timber frame, timber joist,
    or engineered timber must not reopen field `Rw`
- current probe values to pin as answer-regression baselines, not external
  source truth:
  - split full helper over `160 mm` concrete:
    `Rw 57`, `R'w 57`, `Ln,w 72.7`, `L'n,w 74.7`, `L'nT,w 72.3`
  - split board/fill helper over `180 mm` concrete:
    `Rw 58`, `R'w 58`, `Ln,w 71.0`, `L'n,w 73.0`, `L'nT,w 70.6`
  - split board/cavity helper over `140 mm` concrete:
    `Rw 55`, `R'w 55`, `Ln,w 74.6`, `L'n,w 76.6`, `L'nT,w 74.2`
  - helper plus top-side finish after `160 mm` concrete:
    field `Rw` remains unsupported while `R'w`, `DnT,w`, and impact field
    outputs remain live
- implemented edit set:
  - [raw-concrete-helper-answer-guard.test.ts](../../packages/engine/src/raw-concrete-helper-answer-guard.test.ts)
    - pins answer snapshots for three wider raw terminal-concrete helper
      permutations
    - keeps adjacent top-finish, wall-like heavy hybrid, and steel-joist helper
      negatives in the same answer guard
    - asserts basis, estimate kind, match id, support buckets, `Rw`, `R'w`,
      `DnT,w`, `Ln,w`, `L'n,w`, and `L'nT,w`
  - [raw-concrete-helper-route-card-guard.test.ts](../../apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts)
    - mirrors the representative raw terminal-concrete helper cases on the
      workbench route surface
    - asserts output card status and value for `Rw`, `R'w`, `DnT,w`, `Ln,w`,
      `L'n,w`, and `L'nT,w`
    - proves top-finish and wall-like negatives withhold field `Rw`, and the
      steel-joist helper negative keeps impact cards unsupported / needs-input
- validation:
  - pre-edit engine raw/source baseline:
    `4` files passed, `13` tests passed
  - pre-edit workbench raw/source baseline:
    `4` files passed, `6` tests passed
  - new focused engine guard:
    `1` file passed, `1` test passed
  - new focused workbench guard:
    `1` file passed, `1` test passed
  - post-edit engine raw/source pack:
    `5` files passed, `14` tests passed
  - post-edit workbench raw/source pack:
    `5` files passed, `7` tests passed
  - `pnpm --filter @dynecho/engine typecheck`: green
  - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
    TypeScript plugin recommendation
  - `pnpm --filter @dynecho/engine test`: `98` files, `786` tests, green

Closed follow-up after this guard:

- finish the documentation/analysis correction that makes answer origins
  explicit before new solver widening:
  - slice id: `calculation_model_and_validation_docs_v1`
  - status: implemented as a docs-only local implementation audit
  - result:
    - [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
      now documents formula lanes, source rows, predictor estimates, bound-only
      support, unsupported outputs, workbench card gating, and the minimum test
      assertions needed to call an answer defensible
  - code paths reviewed:
    - `packages/engine/src/calculate-assembly.ts`
    - `packages/engine/src/estimate-rw.ts`
    - `packages/engine/src/curve-rating.ts`
    - `packages/engine/src/floor-system-ratings.ts`
    - `packages/engine/src/impact-lane.ts`
    - `packages/engine/src/impact-field-context.ts`
    - `apps/web/features/workbench/simple-workbench-output-model.ts`
- latest trace/measurement implementation slice:
  - slice id: `output_origin_trace_matrix_v1`
  - type: test-first origin/card matrix; no solver behavior change and no
    widening
  - status: implemented and validated through focused, adjacent, typecheck,
    full engine, and full web gates
  - purpose: make each representative output answerable as
    `output -> value -> origin -> basis/source -> support/card status`
  - implemented edit set:
    - [output-origin-trace-matrix.test.ts](../../packages/engine/src/output-origin-trace-matrix.test.ts)
      pins representative engine value/origin/support snapshots
    - [output-origin-trace-card-matrix.test.ts](../../apps/web/features/workbench/output-origin-trace-card-matrix.test.ts)
      pins matching workbench card status/value snapshots
  - covered origins:
    - exact Dataholz dry CLT source row
    - Dataholz `GDMTXA04A` source-family estimate route
    - raw terminal-concrete plus ceiling-helper formula/predictor route
    - UBIQ bound-only source row
    - dynamic wall airborne field route
    - dynamic wall field route with missing volume
    - steel-joist helper-heavy raw fail-closed impact route
  - focused validation:
    - `pnpm --filter @dynecho/engine exec vitest run src/output-origin-trace-matrix.test.ts --reporter=basic`: green
    - `pnpm --filter @dynecho/web exec vitest run features/workbench/output-origin-trace-card-matrix.test.ts --reporter=basic`: green
  - adjacent validation:
    - `pnpm --filter @dynecho/engine exec vitest run src/output-origin-trace-matrix.test.ts src/raw-concrete-helper-answer-guard.test.ts src/dataholz-clt-source-truth-audit.test.ts --reporter=basic`:
      `3` files, `7` tests, green
    - `pnpm --filter @dynecho/web exec vitest run features/workbench/output-origin-trace-card-matrix.test.ts features/workbench/raw-concrete-helper-route-card-guard.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts --reporter=basic`:
      `3` files, `4` tests, green
  - typecheck and broad gate:
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
    - `pnpm --filter @dynecho/engine test`: `99` files, `787` tests, green
    - `pnpm --filter @dynecho/web test`: `94` files, `602` tests, green
    - `git diff --check`: green
- web full-suite expectation cleanup:
  - stale broad workbench expectations were aligned to current source-truth and
    support posture without changing calculator runtime behavior
  - `@dynecho/web` now runs its package test script with `--maxWorkers=1`, and
    web deep-hybrid route scans yield periodically to avoid Vitest worker-RPC
    timeouts during long CPU scan files

Current wall-selector trace checkpoint:

- slice id: `wall_selector_wider_trace_matrix_v1`
- type: no-widening wall-selector trace/card matrix
- status: implemented and target-green
- behavior scope:
  - no solver selection, source catalog, floor support, wall selector math, or
    workbench runtime behavior changed
  - the slice only pins the current answer/support/card posture so any future
    selector change has a compact regression surface
- implemented edit set:
  - [dynamic-airborne-wall-selector-trace-matrix.test.ts](../../packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts)
    pins engine values, support buckets, selected family, confidence, strategy,
    runner-up, boundary-hold metrics, trim visibility, notes, and warnings
  - [wall-selector-output-origin-card-matrix.test.ts](../../apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts)
    mirrors the same rows through workbench cards, branch summary, validation
    posture, and consultant decision wording
- covered rows:
  - clear field `double_leaf`:
    `ytong_aac_d700 80 / air_gap 50 / gypsum_board 12.5`
  - held AAC boundary:
    `ytong_aac_d700 100 / air_gap 50 / gypsum_board 12.5`
  - clear field `lined_massive_wall`:
    `ytong_aac_d700 160 / air_gap 50 / gypsum_board 12.5`
  - denser held G5 sibling:
    `ytong_g5_800 100 / air_gap 50 / diamond_board 12.5`
  - non-AAC heavy-core trim control:
    `rockwool / porotherm / air_gap / diamond_board / glasswool`
  - strong lab double-stud control:
    double gypsum leaves around split cavities and mineral wool
- validation completed in this checkpoint:
  - focused engine trace matrix:
    `1` file, `1` test, green
  - focused workbench card matrix:
    `1` file, `1` test, green
  - engine selector/boundary pack:
    `3` files, `15` tests, green
  - workbench selector/boundary/validation pack:
    `5` files, `26` tests, green
  - `pnpm --filter @dynecho/engine typecheck`: green
  - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
    TypeScript plugin recommendation
  - `pnpm --filter @dynecho/engine test`: `100` files, `788` tests, green
  - `pnpm --filter @dynecho/web test`: `95` files, `603` tests, green
  - `git diff --check`: green

## Next Slice Selection Review

Review date: 2026-04-13

This review is intentionally conservative. The next slice must make the next
behavior decision safer; it should not widen solver support just because the
previous guard set is green.

Selection criteria:

- source evidence:
  - exact source rows, measured rows, official bounds, or already-defended
    predictor-family evidence must exist before behavior widening
- current risk:
  - prefer the slice that reduces silent route drift, fake confidence, or
    unsupported-output leakage first
- test readiness:
  - the slice must be expressible as value/origin/basis/support/card evidence
    before any runtime behavior change
- blast radius:
  - no broad selector or family-lane changes without a trace-only pass first
- architecture:
  - avoid growing `calculate-assembly.ts` with ad hoc explanation code; prefer
    focused trace tests or small helper modules if origin reporting later needs
    structure

Candidate ranking:

1. `wall_selector_wider_trace_matrix_v1`
   - selected and now implemented as the latest no-widening checkpoint
   - type: no-widening trace/research slice
   - why:
     - wall Phase B.2 is only partially shipped; the current hold is limited to
       the defended `double_leaf <-> lined_massive_wall` corridor
     - existing deep-hybrid engine and workbench scans show the current
       representative corridors are stable, but the docs still identify
       wider-than-representative deep-hybrid matrices and future multi-runner-up
       boundaries as the remaining wall-side risk
     - a trace-only slice can expand evidence without changing solver behavior
       or weakening source-backed floor corridors
   - required outputs:
     - engine trace rows for clear settled families, current held boundary,
       non-AAC heavy-core non-boundary controls, and at least one intentionally
       unsupported or held route
     - matching workbench route/card/branch rows where user-facing status can
       drift
     - no numeric lane changes unless the trace exposes a classified bug and a
       separate behavior slice is opened
   - validation gate:
     - focused engine wall selector trace pack
     - focused workbench wall selector trace/card pack
     - `pnpm --filter @dynecho/engine typecheck`
     - `pnpm --filter @dynecho/web typecheck`
     - `pnpm --filter @dynecho/engine test`
     - `pnpm --filter @dynecho/web test`
     - `git diff --check`

2. `floor_raw_inference_source_led_widening_v1`
   - not selected for immediate behavior widening
   - why:
     - the raw terminal-concrete plus ceiling-helper corridor is now
       answer-measured, but broad raw-floor widening still needs source-family
       evidence one carrier at a time
     - helper-only timber, open-web steel raw carriers, weak UBIQ bands, and
       wall-like heavy hybrids remain explicit fail-closed or conservative
       corridors
   - next eligible shape:
     - only after a narrow source-backed candidate is named and first added to
       the output-origin trace matrix as a no-widening baseline

3. `clt_local_combined_interaction_evidence_v1`
   - not selected for behavior work yet
   - why:
     - `C2c`, `C3c`, `C4c`, and `C7c` are already exact anchors, `C5c` is
       predictor-backed, and `C11c` remains deliberately deferred because its
       weak wet-stack tuple is unexplained
     - `GDMTXA04A` is frozen as estimate-routed and must not become a visible
       exact shortcut
   - next eligible shape:
     - source/frequency audit only, unless new evidence explains the deferred
       combined-CLT behavior well enough to justify a separate exact or
       predictor slice

Current decision after the checkpoint:

- `wall_selector_wider_trace_matrix_v1` is now implemented as a trace-only
  checkpoint
- the matrix exposed no classified behavior bug in the current representative
  rows, so no selector behavior was changed
- do not immediately widen wall, floor, or CLT behavior from this evidence
  alone
- next work must re-rank candidates again against source evidence and current
  risk; the likely candidates remain narrow wall-selector behavior only if a
  new trace red appears, source-led raw-floor widening one carrier at a time, or
  CLT combined evidence only after stronger source/frequency support

## Wall Selector Implementation Comparison

Review date: 2026-04-13, second pass

Implementation facts verified locally:

- wall family ambiguity is already represented in `DynamicAirborneTrace` through:
  - `familyDecisionClass`
  - `familyDecisionMargin`
  - `familyDecisionSelectedBelowRunnerUp`
  - `runnerUpFamily` / `runnerUpFamilyScore`
  - optional `secondaryRunnerUpFamily` / `secondaryRunnerUpFamilyScore`
  - `familyBoundaryHold*` metric fields
  - `trimmedOuter*` fields
- boundary scoring currently only runs on `2 visible leaves / 1 cavity` and only
  for selected families in the `double_leaf`, `lined_massive_wall`,
  `stud_wall_system`, and `double_stud_system` set
- the numeric hold is deliberately narrower than the scoring surface:
  - it can only apply to the `double_leaf <-> lined_massive_wall` pair
  - it requires `narrow` or `ambiguous`
  - it compares the active metric against a forced runner-up calculation
  - it allows `4 dB` lead for `ambiguous` and `5 dB` for `narrow`
  - it trims at most `2 dB` for `ambiguous`, `1.5 dB` for `narrow`, plus
    `1 dB` when the hard-selected family is scoring below the runner-up
- current route wording already projects the held boundary through:
  - `dynamic-calc-branch.ts`
  - validation posture
  - consultant decision trail
- architecture watch:
  - `packages/engine/src/dynamic-airborne.ts` is currently about `6630` lines
  - do not add new ad hoc explanation logic to that file in this slice
  - if a behavior bug later requires code, first prefer a small extracted
    boundary/trace helper or a tightly scoped patch around the existing boundary
    functions; do not start MorphologyV2 inside this trace slice

Existing green coverage before the next slice:

- engine boundary pack:
  - command:
    `pnpm --filter @dynecho/engine exec vitest run src/dynamic-airborne-family-boundary.test.ts src/dynamic-airborne-family-boundary-scan.test.ts --reporter=basic`
  - result: `2` files, `14` tests, green
  - existing scope:
    - AAC `80/100/160 mm` lower/boundary/upper corridor values
    - denser `ytong_g5_800` held sibling
    - board matrix for gypsum, diamond, firestop, and security boards
    - trimmed-prefix and dual-sided trim variants
    - non-AAC heavy-core exclusion
    - no silent `>=8 dB` adjacent-swap jumps in the expanded held and non-AAC
      palettes
    - no multi-candidate framed boundary surface in the current representative
      framed palette
- workbench boundary pack:
  - command:
    `pnpm --filter @dynecho/web exec vitest run features/workbench/dynamic-route-family-boundary.test.ts features/workbench/dynamic-route-family-boundary-scan.test.ts features/workbench/validation-regime.test.ts features/workbench/consultant-decision-trail.test.ts --reporter=basic`
  - result: `4` files, `25` tests, green
  - existing scope:
    - same boundary/trim/non-AAC/framed surfaces through `evaluateScenario`
    - representative workbench hold count:
      `40` held routes across AAC/G5 cores
    - representative non-AAC count:
      `144` clear `lined_massive_wall` routes with no boundary diagnostics
    - route wording for ambiguous boundary and protected corridor hold

Gap after comparing plan to implementation:

- current scan tests prove broad stability, but they are not a compact
  output-origin/card matrix for the selected wall selector slice
- the existing cross-domain `output_origin_trace_matrix_v1` has a generic
  dynamic wall field case and a missing-volume wall case, but it does not pin the
  boundary-specific trace fields or workbench cards for the held selector
  corridor
- no true positive for `familyDecisionMultiplePlausibleFamilies` currently
  survives the representative framed palette; do not design behavior around a
  hypothetical multi-runner-up route until a real trace row exposes it

Implemented checkpoint details:

1. Added a compact engine trace matrix.
   - file:
     `packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts`
   - covered rows:
     - clear `double_leaf` field row:
       `ytong_aac_d700 80 / air_gap 50 / gypsum_board 12.5`
     - held AAC boundary row:
       `ytong_aac_d700 100 / air_gap 50 / gypsum_board 12.5`
     - clear `lined_massive_wall` field row:
       `ytong_aac_d700 160 / air_gap 50 / gypsum_board 12.5`
     - denser held sibling:
       `ytong_g5_800 100 / air_gap 50 / diamond_board 12.5`
     - non-AAC heavy-core control:
       one `porotherm`, `silka`, or `pumice` lined-massive route with trim
       visibility but no boundary diagnostics
     - strong framed control:
       one `double_stud_system` or `stud_wall_system` route with no boundary
       diagnostics
   - assertions:
     - `Rw`, `R'w`, and/or `DnT,w` numeric values where live
     - `supportedTargetOutputs` and `unsupportedTargetOutputs`
     - selected family, strategy, confidence class, runner-up fields, hold
       metrics, trim counts, notes, and warnings
2. Added a compact workbench card/route matrix.
   - file:
     `apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts`
   - mirrors the representative engine rows through `evaluateScenario`
   - assertions:
     - output-card status/value for `Rw`, `R'w`, and `DnT,w`
     - branch summary value/tone/detail from `getDynamicCalcBranchSummary`
     - validation posture / consultant wording for the held route only where it
       is user-facing
     - no boundary/hold wording on clear double-leaf, clear lined-massive, and
       non-AAC control rows
3. Re-ran the existing broad selector packs.
   - the new compact matrix is not a replacement for the scan tests
   - the expanded engine scan and representative web scan remain green in the
     adjacent validation packs listed above
4. For a future selector behavior slice:
   - classify the failure as stale fixture, card projection drift, support-bucket
     drift, trace-field drift, or solver behavior drift
   - fix card/projection drift in web-only code where possible
   - open a separate behavior slice before changing `dynamic-airborne.ts`

Non-goals for this slice:

- no `GDMTXA04A` exact reopen
- no C11c import
- no UBIQ weak-band reopen
- no helper-only timber or open-web steel widening
- no generic raw-floor base widening
- no broad wall selector behavior work

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
  `pnpm --filter @dynecho/engine test`; the engine package test script pins
  `--maxWorkers=1` to avoid Vitest worker RPC timeouts in CPU-heavy generated
  scan files. A direct `--reporter=basic` full-suite run can report all
  assertions green and still exit non-zero from a Vitest worker RPC timeout, so
  it is not the accepted green gate for this checkpoint
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

### Step 2: Dataholz Timber-Frame Raw/Predictor Role-Gate Audit

Status: closed as source-truth audit / no broad raw widening

Baseline validation after selecting this slice:

- engine starting pack: `6` files, `300` tests, green
- workbench starting pack: `3` files, `104` tests, green
- no solver behavior changed during this plan-selection pass
- new measurement guard added after review feedback:
  - `dataholz-timber-frame-source-truth-audit.test.ts`
  - pins all `10` imported Dataholz timber-frame rows to explicit numeric
    source truth, official-id field continuations, visible tagged exact routes,
    raw fail-closed exceptions, basis labels, and unsupported output buckets

Slice result:

- no generic raw widening was taken for `timber_frame_floor`,
  `timber_joist_floor`, or `engineered_timber_structural`
- all `10` imported Dataholz timber-frame rows now have executable numeric
  source-truth guards for `Rw`, companion `Ctr`/`Rw+Ctr`, `Ln,w`, `CI`,
  `CI,50-2500`, `Ln,w+CI`, field continuations, basis labels, and
  support/unsupported buckets
- role-tagged exact rows stay exact, while raw no-lining timber-frame input
  remains screening-only for impact outputs
- contiguous same-role split pieces preserve the exact Dataholz `GDRNXA11A`
  answer; disjoint/intervening role splits are intentionally withheld from the
  exact route and fall back to the family estimate with explicit warnings
- workbench output cards now read floor-study `Ctr` from the active floor-system
  companion before the live airborne screening estimate, so the Dataholz
  `GDRNXA11A` exact card shows source `Ctr -17 dB` instead of the unrelated
  screening `-6 dB`

Purpose:

- execute the `source_led_raw_or_predictor_widening_v1` plan on one concrete
  family instead of opening a broad raw or predictor pass
- use Dataholz timber-frame because TUAS combined-CLT, UBIQ open-web, Dataholz
  GDMTXA04A, and mixed/history stabilization are now closed enough to stop
  blocking the next source-led family selection
- decide whether any Dataholz timber-frame raw or predictor surface can be
  tightened safely, or whether the current role-gated fail-closed posture should
  be frozen more explicitly

Work:

- slice id: `dataholz_timber_frame_role_gated_raw_predictor_audit_v1`
- audit the `10` imported Dataholz timber-frame exact rows against current
  visible-stack, predictor-input, and raw-vs-tagged behavior
- keep direct curated exact rows and explicit `base_structure` routes separate
  from raw helper-only rows
- classify each representative branch as:
  - direct exact
  - explicit-role exact
  - predictor/family estimate
  - low-confidence continuation
  - unsupported / fail-closed
- prefer exact/bound/product rows before raw family inference
- add representative hostile-input tests:
  - many layers
  - repeated identical layers
  - same material split into contiguous pieces
  - same material split with intervening roles
  - upper/lower package reorder attempts
  - missing role labels
  - preset-only rows modeled manually
- add the smallest workbench route-parity guard if the slice changes support
  buckets or makes a new timber-frame corridor representative
- do not widen generic `timber_frame_floor`, `timber_joist_floor`, or
  `engineered_timber_structural` raw carriers unless the source-backed role
  evidence is explicit enough to preserve the existing weaker-carrier guard

Acceptance:

- closed for this slice:
  - new support is explicitly labeled as exact, bound, product, family estimate,
    or low confidence
  - unsupported surfaces stay unsupported instead of producing optimistic values
  - route snapshots do not drift under contiguous split tests
  - disjoint/intervening split topology does not preserve exact-match state
  - no source-backed raw widening was defensible, so the slice closes as a
    documented no-widening/fail-closed audit instead of forcing a behavior change

### Step 2.5: TUAS Measured Lightweight Timber Source-Triage

Status: closed as no-widening source-truth audit

Slice id:

- `tuas_measured_lightweight_timber_source_triage_v1`

Purpose:

- use the already-landed TUAS measured open-box and CLT rows to choose the next
  narrow, source-defensible calculator improvement
- avoid widening raw open-box, raw CLT, or helper-only timber carriers unless the
  measured corpus and visible schedule defend the exact route
- turn the next TUAS decision into executable source-truth tests before changing
  solver behavior

Starting posture:

- TUAS open-box exact rows are broad enough to support defended combined
  upper-plus-lower packages
- raw bare open-box, lower-only open-box, and upper-only open-box rows still stay
  fail-closed on impact
- `R6b` is already landed as a reinforced lower-treatment `b` branch
- `R7a` is already landed as a heavy/wet `a` branch with an upper EPS-board
  surface
- `R7b`, `R8b`, `R9b`, `R10a`, and `R2c` are landed exact routes; any next move
  must not reopen their shorthand/proxy variants accidentally
- TUAS combined CLT rows through `C7c` are landed, while `C11c` remains
  deliberately deferred / fail-closed

Work:

- build a TUAS measured-source audit table for the currently imported open-box
  and CLT rows that are still candidates for route tightening
- classify each candidate branch as:
  - exact already defended
  - exact but only under explicit role tags
  - family estimate
  - raw/helper-only fail-closed
  - source anomaly / defer
- add answer-measuring tests before implementation:
  - numeric `Rw`, `Ln,w`, `Ln,w+CI`, `CI,50-2500`
  - field continuations where `impactFieldContext` is available
  - support/unsupported output buckets
  - exact match id or family estimate candidate ids
  - warning/basis labels for fail-closed or low-confidence routes
- include hostile-input guards:
  - contiguous split parity for exact rows
  - disjoint/intervening role splits withholding exact routes
  - missing `floorRole` labels
  - upper-only, lower-only, and bare raw carrier attempts
  - workbench card parity for any route whose supported output bucket changes
- if no safe widening is found, close the slice as a no-widening source audit and
  keep the fail-closed posture explicit

Slice result:

- no solver, catalog, or workbench behavior changed in this slice
- new executable contract:
  - `packages/engine/src/tuas-measured-source-truth-audit.test.ts`
  - result: `7` tests green
- target validation:
  - command: `pnpm --filter @dynecho/engine exec vitest run src/tuas-measured-source-truth-audit.test.ts src/tuas-candidate-backlog-contract.test.ts src/tuas-support-surface-decision-contract.test.ts src/tuas-clt-backlog-decision-contract.test.ts src/tuas-c11c-wet-stack-anomaly-audit.test.ts src/raw-floor-exact-exception-audit.test.ts src/raw-floor-weaker-carrier-posture.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
  - result: `9` files passed, `345` tests passed
- full engine validation:
  - command: `pnpm --filter @dynecho/engine test`
  - result: `95` files passed, `770` tests passed
- standalone typechecks:
  - `pnpm --filter @dynecho/engine typecheck`: green
  - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
    TypeScript plugin recommendation
- repository build:
  - command: `pnpm build`
  - result: green, with the known non-blocking `sharp/@img` optional-package
    warnings and Next.js TypeScript plugin recommendation
- all `29` currently imported TUAS measured open-box / CLT rows are pinned to
  explicit spreadsheet single-number truth:
  - `Rw`
  - `Rw+C` in the current legacy floor companion slot
  - `Ln,w`
  - `CI`
  - `CI,50-2500`
  - `Ln,w+CI`
  - official-id field continuations for `L'n,w`, `L'nT,w`, and `L'nT,50`
- visible tagged routes stay exact except `X5` and `C5c`, which remain
  deliberate predictor-backed non-exact rows
- missing-role raw drift is now numeric and intentional:
  - some raw CLT / combined-CLT stacks remain impact-unsupported
  - selected hybrid open-box and combined-CLT raw stacks remain family-estimate
    routes with explicit candidate ids and fit percentages
  - raw bare, upper-only, and lower-only open-box carrier attempts remain impact
    fail-closed
- contiguous merge-safe splits preserve exact TUAS source answers; disjoint
  single-entry role splits do not preserve exact state
- no workbench route/card test was needed because output support buckets did not
  change

Acceptance:

- closed for this slice:
  - the TUAS candidate decision is based on measured-source rows, not family
    guesswork
  - no behavior change was taken because the measured corpus did not defend a
    safer raw/helper widening
  - raw/helper-only routes do not become optimistic by accident
  - exact rows remain stable under contiguous split input and unstable topology
    is withheld with visible warnings

### Step 2.6: Floor Airborne Companion Semantics

Status: closed and green

Slice id:

- `floor_airborne_companion_c_ctr_semantic_audit_v1`

Purpose:

- remove the remaining ambiguity around floor airborne companion outputs
- preserve the Dataholz timber-frame `Ctr` term fix while handling TUAS row `42`
  honestly as `Rw+C`, not as a generic `Ctr` term
- prevent output cards, target-output support, and engine routes from silently
  mixing `C`, `Ctr`, `Rw+C`, and `Rw+Ctr`

Starting posture:

- Dataholz timber-frame rows now carry explicit `RwCtrSemantic: "ctr_term"` and
  workbench floor cards correctly show source `Ctr` before screening `Ctr`
- TUAS spreadsheet row `42` is source truth for `Rw+C`; those values now remain
  in the legacy numeric `RwCtr` field for compatibility but carry explicit
  `RwCtrSemantic: "rw_plus_c"`
- `RequestedOutputId` already has both `C` and `Ctr`, but floor-system carrier
  support now distinguishes those outputs instead of deriving one from the
  other

Work:

- closed engine target-output support audit for floor-system carrier companions:
  - official floor-system id route
  - visible exact route
  - predictor/family route
  - screening-only route
- closed web output-card mapping for the same companion semantics
- domain now has a distinct `rw_plus_c` semantic while preserving the legacy
  numeric field name for saved-data/catalog compatibility
- added numeric tests that keep:
  - Dataholz `Ctr` term rows as `Ctr`
  - TUAS `Rw+C` rows as `C` / `Rw+C`, not mislabeled `Ctr`
  - screening estimates separate from source companions
- output-combination sweeps now request `C` alongside `Ctr` and assert the
  supported/unsupported partition plus finite source values

Acceptance:

- closed for this slice:
  - `rw_plus_c`, `rw_plus_ctr`, and `ctr_term` are distinct shared-domain
    semantics
  - all `31` currently imported TUAS exact floor-system rows with an airborne
    companion carry `RwCtrSemantic: "rw_plus_c"`
  - TUAS exact/official-id routes support `C` and withhold `Ctr`
  - Dataholz `ctr_term` routes still support `Ctr` and withhold `C`
  - floor workbench cards surface source `C` for TUAS-style companions and do
    not show those same values as `Ctr`
  - predictor/family airborne companions inherit a unanimous source semantic and
    withhold the companion when the source set mixes `C`, `Ctr`, and `Rw+Ctr`
    semantics

Validation:

- `pnpm --filter @dynecho/engine exec vitest run src/predictor-family-estimate-shared.test.ts src/target-output-support-contract.test.ts src/tuas-measured-source-truth-audit.test.ts src/output-combination-sweep.test.ts src/dataholz-timber-frame-source-truth-audit.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts src/dynamic-floor-regression-matrix.test.ts src/predictor-branch-stability-sweep.test.ts --reporter=basic`
  - result: `9` files, `326` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/scenario-analysis.test.ts features/workbench/simple-workbench-output-model.test.ts features/workbench/dataholz-timber-frame-source-truth-route.test.ts features/workbench/floor-output-card-support-parity.test.ts --reporter=basic`
  - result: `4` files, `84` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/impact-upstream-parity-acceptance.test.ts --reporter=basic`
  - result: `1` file, `2` tests, green
- `pnpm --filter @dynecho/shared typecheck`: green
- `pnpm --filter @dynecho/catalogs typecheck`: green
- `pnpm --filter @dynecho/engine typecheck`: green
- `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
  TypeScript plugin recommendation
- `pnpm --filter @dynecho/engine test`: green in this companion-semantics
  slice; the current full-suite count is recorded in Step 2.7 below
- `pnpm build`: green with the known `sharp/@img` optional-package warnings
  through `proposal-docx` and the Next.js TypeScript plugin recommendation

### Step 2.9: CLT Combined Malformed-Finish Fallback Guard

Status: closed and green

Slice id:

- `clt_combined_finish_fallback_guard_v1`

Purpose:

- close the remaining CLT visible-route gap where malformed laminate/EPS
  walking finishes could pass the direct predictor guard but still land on the
  generic same-family combined CLT archetype
- preserve source-backed combined CLT rows that still carry the valid
  `8 mm` laminate plus `3 mm` EPS pair
- keep explicit lower-treatment combined CLT packages fail-closed when their
  walking finish is outside the measured source band

Work:

- broadened the visible-layer malformed laminate/EPS finish hold to include
  `combined` CLT profiles in addition to `upper_only` and `heavy_floating`
- kept the looser pair detector for valid CLT packages so C7-style wet stacks
  and other source-backed rows with extra EPS board layers do not get mistaken
  for malformed walking underlay
- added engine and workbench route tests that measure thick-laminate and
  thick-underlay combined CLT packages as impact-unsupported rather than
  estimated from `C2c/C3c/C4c/C5c` neighbors

Acceptance:

- malformed combined CLT walking finishes have no exact match, no fallback
  estimate, and no impact result
- lab support remains `Rw`-only for those malformed combined packages
- field support remains apparent-airborne only (`R'w`, `DnT,w`) and withholds
  impact outputs
- valid source-backed laminate/EPS combined CLT routes remain live

Validation:

- `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts --reporter=basic`
  - result: `2` files, `24` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
  - result: `1` file, `90` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/raw-floor-inferred-split-parity.test.ts src/floor-exact-companion-split-parity.test.ts src/impact-predictor-input.test.ts src/floor-source-corpus-contract.test.ts src/floor-widening-candidate-contract.test.ts src/clt-floor-monotonicity.test.ts src/predictor-published-family-estimate.test.ts src/tuas-measured-source-truth-audit.test.ts --reporter=basic`
  - result: `8` files, `83` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/tuas-measured-source-truth-audit.test.ts src/floor-widening-candidate-contract.test.ts src/floor-gap-ledger-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
  - result: `7` files, `321` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts features/workbench/raw-floor-inferred-split-parity.test.ts --reporter=basic`
  - result: `3` files, `106` tests, green
- `pnpm --filter @dynecho/engine typecheck`: green
- `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
  TypeScript plugin recommendation
- `pnpm --filter @dynecho/engine test`: `96` files, `777` tests, green
- `pnpm build`: green with the known `sharp/@img` optional-package warnings
  through `proposal-docx` and the Next.js TypeScript plugin recommendation

### Step 2.10: Open-Box Disjoint Upper-Package Fallback Guard

Status: closed and green

Slice id:

- `open_box_disjoint_upper_fallback_guard_v1`

Purpose:

- close the open-box visible-route gap where a TUAS hybrid wet upper package
  could lose exact matching because its staged upper schedule was disjoint or
  mixed out of order, then still borrow impact support from the broader
  same-family `R8b/R9b/R2c` corridor
- preserve exact source rows whose staged upper/lower schedule is entered
  faithfully
- preserve the existing generic dry open-box disjoint `upper_fill` posture so
  this tightening does not become a broad open-box fallback shutdown

Work:

- added an estimator hold for open-box combined stacks whose floating-screed
  conflict carries the source-backed `geotextile + screed` wet hybrid package
- kept the guard narrower than the existing generic dry upper-fill disjoint
  warning lane
- added engine support-surface tests that measure lab and field output buckets:
  no exact match, no estimate, no impact, `Rw`-only lab support, and no field
  impact support for the malformed hybrid schedule
- added the same workbench route guard and preserved the adjacent dry
  `family_general` regression expectation

Acceptance:

- true `R7b/R8b/R9b/R2c` source rows remain exact
- disjoint or mixed `geotextile + screed` wet hybrid upper schedules do not
  reopen through generic open-box blending after exact matching rejects them
- the user-facing warning still identifies the duplicated/split
  `floating screed x2 (Geotextile Separator Layer, Mineral Screed)` role
- generic dry open-box disjoint `upper_fill` rows remain on the documented
  `family_general` lane with the existing warning

Validation:

- `pnpm --filter @dynecho/engine exec vitest run src/tuas-support-surface-decision-contract.test.ts --reporter=basic`
  - result: `1` file, `10` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
  - result: `1` file, `91` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/tuas-support-surface-decision-contract.test.ts src/floor-widening-candidate-contract.test.ts src/floor-source-corpus-contract.test.ts src/floor-packaged-lane-disjoint-detour.test.ts src/floor-packaged-lane-helper-disjoint-detour.test.ts --reporter=basic`
  - result: `5` files, `23` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts --reporter=basic`
  - result: `2` files, `106` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/tuas-measured-source-truth-audit.test.ts src/floor-widening-candidate-contract.test.ts src/floor-gap-ledger-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
  - result: `7` files, `321` tests, green
- `pnpm --filter @dynecho/engine typecheck`: green
- `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
  TypeScript plugin recommendation
- `pnpm --filter @dynecho/engine test`: `96` files, `778` tests, green
- `pnpm build`: green with the known `sharp/@img` optional-package warnings
  through `proposal-docx` and the Next.js TypeScript plugin recommendation

### Step 2.11: Open-Box Laminate/EPS Walking-Finish Fallback Guard

Status: closed and green

Slice id:

- `open_box_finish_package_guard_v1`

Purpose:

- close the open-box visible-route gap where malformed walking finishes could
  lose exact matching but still borrow predictor-specific or generic
  same-family `Ln,w` support from TUAS `R2b`, `R5b`, or `R9b` neighbors
- keep TUAS open-box walking-finish support source-led to the thin
  `8 mm` laminate plus `3 mm` EPS band currently present in the measured rows
- preserve valid exact open-box source rows and preserve direct predictor inputs
  that omit a product id but still carry the source-band `3 mm` underlay

Work:

- added an open-box combined-profile hold in `floor-system-estimate.ts` when the
  visible stack contains a laminate/EPS walking finish but no source-backed
  laminate-underlay pair
- added the matching published-predictor guard so direct open-box family lanes
  reject explicit non-EPS or out-of-band laminate/underlay input before returning
  `R2b`, `R5b`, or `R9b` estimates
- added engine and workbench route tests for malformed basic, dry, and hybrid
  open-box walking-finish inputs

Acceptance:

- malformed `R2b`-style thick laminate, `R5b`-style thick underlay, and
  `R9b`-style thick laminate inputs have no exact match, no estimate, and no
  impact result
- lab support remains `Rw`-only for those malformed open-box packages
- field support withholds impact outputs instead of surfacing borrowed
  `Ln,w`/apparent impact values
- exact source-backed open-box packages remain live

Validation:

- `pnpm --filter @dynecho/engine exec vitest run src/tuas-support-surface-decision-contract.test.ts --reporter=basic`
  - result: `1` file, `11` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
  - result: `1` file, `92` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/tuas-support-surface-decision-contract.test.ts src/floor-widening-candidate-contract.test.ts src/floor-source-corpus-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
  - result: `6` files, `322` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts --reporter=basic`
  - result: `2` files, `107` tests, green
- `pnpm --filter @dynecho/engine typecheck`: green
- `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
  TypeScript plugin recommendation
- `pnpm --filter @dynecho/engine test`: `96` files, `779` tests, green
- `pnpm build`: green with the known `sharp/@img` optional-package warnings
  through `proposal-docx` and the Next.js TypeScript plugin recommendation

### Step 2.12: Open-Box Finish Tolerance Guard

Status: closed and green

Slice id:

- `open_box_finish_tolerance_guard_v1`

Purpose:

- align the open-box laminate/EPS walking-finish fallback band with the exact
  visible-role tolerance used by curated TUAS open-box source rows
- prevent near-looking but exact-outside laminate inputs, such as `12 mm`, from
  borrowing `R2b/R5b/R9b` impact values after exact matching rejects them
- preserve tolerated near source-band input, such as `10 mm` laminate, and keep
  the wider CLT interpolation band separate

Work:

- added direct predictor tests that accept `10 mm` laminate but reject `12 mm`
  laminate on open-box published-family routes
- extended the engine support-surface and workbench malformed-finish route tests
  to cover basic, dry, and hybrid open-box stacks at the exact-tolerance boundary
- introduced an open-box-specific laminate/EPS pair guard in
  `floor-system-estimate.ts` so the visible fallback path uses the exact
  tolerance instead of the broader CLT interpolation tolerance

Acceptance:

- `12 mm` laminate open-box basic, dry, and hybrid inputs have no exact match, no
  estimate, and no impact result
- lab support remains `Rw`-only for those exact-outside packages
- field support withholds impact outputs
- `10 mm` laminate direct predictor input remains on the source-band open-box
  lane

Validation:

- `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts --reporter=basic`
  - result: `1` file, `19` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/tuas-support-surface-decision-contract.test.ts --reporter=basic`
  - result: `1` file, `11` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
  - result: `1` file, `92` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/tuas-support-surface-decision-contract.test.ts src/floor-widening-candidate-contract.test.ts src/floor-source-corpus-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
  - result: `6` files, `323` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts --reporter=basic`
  - result: `2` files, `107` tests, green
- `pnpm --filter @dynecho/engine typecheck`: green
- `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
  TypeScript plugin recommendation
- `pnpm --filter @dynecho/engine test`: `96` files, `780` tests, green
- `pnpm build`: green with the known `sharp/@img` optional-package warnings
  through `proposal-docx` and the Next.js TypeScript plugin recommendation

### Step 2.8: CLT Dry Finish-Package Guard

Status: closed and green

Slice id:

- `clt_dry_finish_package_guard_v1`

Purpose:

- tighten the TUAS `X5/C5c` dry CLT interaction lane without removing the
  existing source-backed dry shorthand corridor
- keep malformed walking finishes from borrowing measured dry CLT impact values
- preserve the C7 wet upper-package raw drift posture found by the TUAS measured
  source-truth audit

Work:

- direct predictor dry CLT rule now rejects explicitly out-of-band laminate or
  EPS thicknesses before returning the `X5/C5c` dry interaction estimate
- visible-layer fallback now applies the same malformed-finish hold before the
  generic same-family CLT archetype can reopen
- bare CLT interpolation still uses its stricter complete-package guard
- C7-style wet packages use a looser source-backed laminate/EPS pair check so
  extra upper EPS board layers do not get mistaken for malformed walking
  underlay

Acceptance:

- `8 mm` laminate plus `3 mm` EPS dry CLT shorthand remains supported
- `30 mm` laminate dry CLT and `12 mm` EPS dry CLT stay `Rw`-only /
  impact-unsupported
- C7 missing-role source-truth drift remains on its documented family-estimate
  posture

Validation:

- `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/tuas-measured-source-truth-audit.test.ts --reporter=basic`
  - result: `3` files, `31` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/raw-floor-inferred-split-parity.test.ts src/floor-exact-companion-split-parity.test.ts src/impact-predictor-input.test.ts src/floor-source-corpus-contract.test.ts src/floor-widening-candidate-contract.test.ts src/clt-floor-monotonicity.test.ts src/predictor-published-family-estimate.test.ts src/tuas-measured-source-truth-audit.test.ts --reporter=basic`
  - result: `8` files, `83` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/tuas-measured-source-truth-audit.test.ts src/floor-widening-candidate-contract.test.ts src/floor-gap-ledger-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
  - result: `7` files, `321` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts features/workbench/raw-floor-inferred-split-parity.test.ts --reporter=basic`
  - result: `3` files, `105` tests, green
- `pnpm --filter @dynecho/engine typecheck`: green
- `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
  TypeScript plugin recommendation
- `pnpm --filter @dynecho/engine test`: `96` files, `777` tests, green
- `pnpm build`: green with the known `sharp/@img` optional-package warnings
  through `proposal-docx` and the Next.js TypeScript plugin recommendation

### Step 2.7: CLT Laminate-Underlay Interpolation Guard

Status: closed and green

Slice id:

- `clt_laminate_underlay_interpolation_guard_v1`

Purpose:

- tighten the CLT X2/C2 interpolation lane without widening any new family
- preserve the current raw bare CLT interpolation and the defended
  laminate-plus-EPS route
- stop incomplete or physically out-of-band finish packages from borrowing the
  full measured `laminate + EPS underlay` impact improvement

Starting posture:

- TUAS `X2` and `C2` source anchors are explicitly `8 mm` laminate on `3 mm`
  EPS underlay over CLT
- direct predictor inputs already had a CLT bare interpolation rule, but it did
  not fully distinguish:
  - true raw bare CLT
  - source-backed laminate-plus-EPS CLT
  - laminate-only CLT
  - out-of-band laminate thickness
- the visible layer route could still derive a family estimate from `X2/C2`
  when the user supplied laminate without the matching EPS underlay

Work:

- direct predictor rule now requires a complete source-backed finish package
  before removing the raw-slab penalty:
  - laminate floor covering around the source thickness band
  - thin EPS underlay around the source thickness band
- `floor-system-estimate.ts` applies the same guard on visible layer routes
- raw bare CLT remains live on the existing conservative interpolation
- malformed CLT finish packages now stay screening-only / impact-unsupported
  instead of showing `Ln,w` and `Ln,w+CI`
- workbench scenario coverage now verifies the same user-facing output bucket

Acceptance:

- closed for this slice:
  - raw bare CLT stays supported
  - defended laminate-plus-EPS CLT stays supported
  - laminate-only CLT with no EPS underlay withholds impact outputs
  - `30 mm` laminate over thin EPS withholds impact outputs
  - workbench cards keep malformed CLT finish packages at `Rw`-only support

Validation:

- `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts --reporter=basic`
  - result: `2` files, `22` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/raw-floor-inferred-split-parity.test.ts src/floor-exact-companion-split-parity.test.ts src/impact-predictor-input.test.ts src/floor-source-corpus-contract.test.ts src/floor-widening-candidate-contract.test.ts src/clt-floor-monotonicity.test.ts src/predictor-published-family-estimate.test.ts --reporter=basic`
  - result: `7` files, `74` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/floor-widening-candidate-contract.test.ts src/floor-gap-ledger-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
  - result: `6` files, `312` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts features/workbench/raw-floor-inferred-split-parity.test.ts --reporter=basic`
  - result: `3` files, `104` tests, green
- `pnpm --filter @dynecho/engine typecheck`: green
- `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
  TypeScript plugin recommendation
- `pnpm --filter @dynecho/engine test`: `96` files, `775` tests, green
- `pnpm build`: green with the known `sharp/@img` optional-package warnings
  through `proposal-docx` and the Next.js TypeScript plugin recommendation

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

Status: closed for the current checkpoint; ongoing as the broad gate for future
slices

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

Closed Dataholz checkpoint pack:

```sh
pnpm --filter @dynecho/engine exec vitest run src/dataholz-timber-frame-source-truth-audit.test.ts src/target-output-support-contract.test.ts src/raw-floor-exact-exception-audit.test.ts src/raw-floor-weaker-carrier-posture.test.ts src/floor-exact-companion-split-parity.test.ts src/floor-source-corpus-contract.test.ts src/calculate-assembly.test.ts src/calculate-impact-only.test.ts
```

```sh
pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-output-model.test.ts features/workbench/dataholz-timber-frame-source-truth-route.test.ts features/workbench/floor-family-regressions.test.ts features/workbench/raw-floor-weaker-carrier-route-posture.test.ts features/workbench/floor-stack-invariance.test.ts
```

Selected next-slice starting pack:

```sh
pnpm --filter @dynecho/engine exec vitest run src/tuas-candidate-backlog-contract.test.ts src/tuas-support-surface-decision-contract.test.ts src/tuas-post-corridor-screening-contract.test.ts src/floor-gap-ledger-contract.test.ts src/floor-profile-boundary-matrix.test.ts src/raw-floor-safe-bare-split-parity.test.ts src/calculate-assembly.test.ts src/calculate-impact-only.test.ts
```

```sh
pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-profile-boundary-route-matrix.test.ts features/workbench/raw-floor-inferred-split-parity.test.ts features/workbench/raw-floor-weaker-carrier-route-posture.test.ts features/workbench/floor-output-card-support-parity.test.ts
```

General floor/source guard packs:

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

Broad checkpoint gates:

```sh
pnpm --filter @dynecho/engine test
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
