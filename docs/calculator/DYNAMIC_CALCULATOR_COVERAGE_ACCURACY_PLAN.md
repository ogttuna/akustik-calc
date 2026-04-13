# Dynamic Calculator Coverage And Accuracy Plan

Last reviewed: 2026-04-13

Document role:

- living execution plan for increasing dynamic-calculator coverage and numerical accuracy together
- use this when choosing the next widening or tightening slice
- this document is test-first: every slice should define its contract pack before code changes begin
- update this document as slices are selected, closed, deferred, or re-ordered

Read together with:

- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)

## Current Active Slice Ledger

- latest completed slice:
  `ubiq_open_web_packaged_lane_trace_matrix_v1`
- status: implemented as a no-widening UBIQ open-web lower-package trace/card
  guard; focused, adjacent, typecheck, full-suite, and diff gates are green
- latest completed slice intent:
  - pin a source-backed UBIQ open-web lower-package lane before any new
    raw-floor widening
  - prove exact, raw split, tagged split, and reordered user inputs with
    numeric `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, and `L'nT,w` snapshots
  - keep the current distinction explicit: canonical and split lower packages
    stay on `family_general` at `56.7%` fit, while reordered input stays live
    but is labeled `low_confidence` at `29%` fit
  - avoid opening a bare open-web raw carrier lane or changing solver/catalog
    behavior
- latest completed slice artifacts:
  - `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
  - `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`
- latest completed slice validation:
  - focused engine UBIQ trace matrix: `1` file, `1` test, green
  - focused workbench UBIQ card matrix: `1` file, `1` test, green
  - engine packaged-lane/UBIQ adjacent pack: `7` files, `24` tests, green
  - workbench packaged-lane adjacent pack: `7` files, `13` tests, green
  - engine/web typechecks: green; web still prints the known Next.js
    TypeScript plugin recommendation
  - full engine suite: `102` files, `790` tests, green
  - full web suite: `97` files, `605` tests, green
  - `pnpm build`: green with the known `sharp/@img` optional-package warnings
    and Next.js TypeScript plugin recommendation
  - `git diff --check`: green
- previous raw hostile-input slice:
  `raw_floor_hostile_input_answer_matrix_v1` is implemented as a no-widening
  pre-widening raw-floor answer/card guard; focused, adjacent, typecheck, and
  full-suite gates are green
- previous raw hostile-input intent:
  - broaden the raw-floor hostile-input stress surface before any behavior
    widening
  - pin numeric answers, support buckets, impact basis, and workbench card
    status/value for long split, reordered, and weak-carrier raw stacks
  - keep helper-only timber, open-web steel raw carriers, CLT lower-only
    fragments, and non-terminal concrete helper arrangements from becoming
    accidental widening shortcuts
- previous raw hostile-input artifacts:
  - `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
- previous raw hostile-input validation:
  - focused engine hostile-input matrix: `1` file, `1` test, green
  - focused workbench hostile-input card matrix: `1` file, `1` test, green
  - engine raw adjacent pack: `6` files, `12` tests, green
  - workbench raw adjacent pack: `6` files, `9` tests, green
  - full engine suite: `101` files, `789` tests, green
  - full web suite: `96` files, `604` tests, green
- previous wall-selector trace slice:
  `wall_selector_wider_trace_matrix_v1` is implemented as a no-widening
  wall-selector trace/card guard; focused, adjacent, typecheck, and full-suite
  gates are green
- previous wall-selector slice intent:
  - pin the current wall selector answer/support/card posture before any wider
    selector behavior change
  - keep the current defended `double_leaf <-> lined_massive_wall` hold visible
    on engine traces and user-facing workbench explanations
  - prove clear settled wall families, held AAC/G5 boundaries, non-AAC
    heavy-core controls, and strong framed controls without touching solver math
- previous wall-selector artifacts:
  - `packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts`
  - `apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts`
- previous wall-selector validation:
  - focused engine trace matrix: `1` file, `1` test, green
  - focused workbench card matrix: `1` file, `1` test, green
  - engine selector/boundary pack: `3` files, `15` tests, green
  - workbench selector/boundary/validation pack: `5` files, `26` tests, green
  - engine/web typechecks: green; web still prints the known Next.js
    TypeScript plugin recommendation
  - full engine suite: `100` files, `788` tests, green
  - full web suite: `95` files, `603` tests, green
  - `git diff --check`: green
- previous trace/measurement slice:
  `output_origin_trace_matrix_v1` is implemented as a no-widening
  cross-domain origin/card guard; focused, adjacent, typecheck, and full engine
  gates are green
- previous no-widening answer guard:
  `raw_concrete_helper_permutation_answer_guard_v1` is closed as an
  answer/support guard; target engine/workbench packs are green
- previous source-led slice: `dataholz_clt_source_truth_audit_v1` is closed as
  a no-widening source-truth guard; target engine/workbench packs are green
- previous route-history slice: `mixed_floor_wall_seeded_route_history_expansion_v1`
  is closed and committed for the first heavy-composite wall target
- previous floor answer-guard intent:
  - keep the newly pinned Dataholz CLT source truth frozen
  - measure the already-open raw terminal-concrete plus ceiling-helper corridor
    with explicit numeric answer snapshots, not only support-bucket checks
  - keep implementation test-first and avoid changing acoustic selection math
  - preserve the current defended floor/wall corridors and classify any new red
    before changing solver behavior
- previous floor answer-guard acceptance:
  - one route corridor at a time: raw visible inputs inferred as terminal
    concrete with ceiling-side board/helper layers
  - route/card/support-bucket parity assertions plus numeric `Rw`, `R'w`,
    `Ln,w`, `L'n,w`, and `L'nT,w` snapshots
  - green targeted engine and workbench packs, plus engine/web typechecks
- previous trace/floor guard validation:
  - latest output-origin trace engine/source/raw pack:
    `3` files, `7` tests, green
  - latest output-origin trace workbench/source/raw pack:
    `3` files, `4` tests, green
  - latest full engine suite:
    `99` files, `787` tests, green
  - latest full web suite:
    `94` files, `602` tests, green
  - latest engine/web typechecks: green
  - latest `git diff --check`: green
  - engine raw/source pack: `5` files, `14` tests, green
  - workbench raw/source pack: `5` files, `7` tests, green
  - engine typecheck: green
  - web typecheck: green with the known Next.js TypeScript plugin
    recommendation
  - full engine suite: `98` files, `786` tests, green
- completed slice non-goals:
  - no `GDMTXA04A` exact reopen
  - no C11c import
  - no UBIQ weak-band reopen
  - no helper-only timber, open-web steel, or generic raw-floor widening
- active next decision:
  - re-rank candidates again before selecting behavior work
  - keep `wall_selector_wider_trace_matrix_v1` frozen as evidence, not as a
    mandate to widen wall selector math
  - keep `ubiq_open_web_packaged_lane_trace_matrix_v1` frozen as a packaged
    lower-lane guard, not as permission to open bare open-web carrier support
  - keep `raw_floor_hostile_input_answer_matrix_v1` frozen as the latest
    hostile-input pre-widening guard
  - raw-floor behavior widening, CLT-local combined behavior work, C11c, and
    `GDMTXA04A` exact reopening remain deferred until they have stronger
    source/frequency evidence and their own output-origin trace rows
- next slice selection contract:
  - name one route family and one output surface before implementation
  - add value/origin/support/card assertions first when behavior will widen
  - classify any red as stale fixture, projection drift, support-bucket drift,
    trace-field drift, or solver behavior drift before changing code
- previous route-history first target, now closed:
  - promoted the existing heavy-composite wall instability shape into the mixed
    route-history coverage net as a third wall-family detour
  - the shape is concrete / pumice block / air gap / gypsum board / concrete
  - the generated variants split material totals without changing the
    intended final visible stack
  - the workbench seeded chain saves and reloads this wall detour at the
    retained-scenario boundary beside the existing deep-hybrid and concrete-wall
    detours
  - validation:
    - engine mixed pack: `2` files, `2` tests, green
    - web mixed pack: `6` files, `10` tests, green
    - engine and web typechecks: green
    - full engine suite: `96` files, `780` tests, green
    - repository build: green with known `sharp/@img` and Next TypeScript-plugin
      warnings
- deferred optional route-history target:
  - add the latest open-box finish-tolerance boundary to the generated mixed
    floor set so exact-outside `12 mm` laminate plus `3 mm` EPS stays
    impact-unsupported under route-history variants
  - keep it as a separate follow-up if it exposes a real solver/support red
- source/implementation comparison:
  - the open-box finish tolerance guard closed the latest source-led tightening
    slice:
    - the previous guard correctly blocked missing/incomplete/out-of-band
      laminate/EPS walking finishes, but source inspection found that the
      open-box predictor/fallback band still used a wider CLT interpolation
      laminate tolerance
    - TUAS open-box exact matching uses the visible-role tolerance around
      `8 mm` laminate plus `3 mm` EPS, so `10 mm` laminate remains a tolerated
      near source-band predictor input while `12 mm` laminate no longer borrows
      the `R2b/R5b/R9b` impact lanes after exact matching falls off
    - this is open-box-specific; it does not tighten the separate CLT
      interpolation band
  - previous open-box laminate/EPS walking-finish fallback posture remains:
    - the open-box laminate/EPS walking-finish fallback guard closed the earlier
    source-led tightening slice:
    - TUAS open-box rows that expose a walking finish are source-backed for the
      same thin finish band:
      - `8 mm` laminate
      - `3 mm` EPS underlay
    - malformed visible inputs that still look like `R2b`, `R5b`, or `R9b`
      neighbors but carry missing, incomplete, or out-of-band laminate/EPS
      walking finishes now withhold impact support instead of borrowing the
      predictor-specific or generic same-family open-box impact lanes
    - valid exact open-box source rows remain live
    - direct predictor inputs that carry a source-band `3 mm` underlay without a
      product id remain accepted; explicit non-EPS or out-of-band underlay input
      is blocked
  - previous open-box disjoint upper-package posture remains:
    - the TUAS hybrid open-box wet upper package is source-backed only while
      its staged `geotextile + screed` floating-screed schedule remains exact
    - if exact matching falls off because that staged upper schedule is
      disjoint or mixed out of order, the visible route now withholds
      `family_general` impact support instead of borrowing `R8b/R9b/R2c`
      neighbors
    - true source rows such as `R7b/R8b/R9b/R2c` remain exact when their
      source-backed upper/lower schedule is entered faithfully
    - the existing generic dry open-box disjoint `upper_fill` route remains on
      the documented `family_general` lane, so this is a narrow wet hybrid
      guard rather than a broad open-box fallback shutdown
  - previous combined CLT fallback posture remains:
    - the combined CLT malformed-finish fallback guard closed the remaining
      visible-route gap after the dry finish-package guard:
    - direct predictor already rejected out-of-band laminate/EPS walking
      finishes
    - visible-layer combined CLT stacks could still re-enter through the
      generic same-family CLT archetype if they also carried lower treatment
    - the fallback hold now covers `combined` CLT profiles as well as the
      existing `upper_only` and `heavy_floating` dry profiles
    - malformed combined CLT walking finishes now stay impact-unsupported
      instead of borrowing `Ln,w` / `Ln,w+CI` values from
      `C2c/C3c/C4c/C5c` neighbors
    - valid source-backed laminate/EPS pairs remain live, including C7-style
      wet packages that also contain extra upper-package layers
  - previous dry finish-package posture remains:
    - the dry CLT finish-package guard compared TUAS `X5/C5c` dry interaction
      behavior against the visible source finish band:
      - `8 mm` laminate
      - `3 mm` EPS underlay
    - explicitly out-of-band laminate or EPS thicknesses now fail closed on
      both direct predictor and visible-layer routes instead of borrowing the
      measured dry interaction lane
    - the route fallback guard also prevents malformed dry CLT rows from
      re-entering through the generic same-family CLT archetype
    - source-backed C7-style wet upper packages remain live on their existing
      missing-role family-estimate posture because the dry-finish guard now
      looks for a valid laminate/EPS pair rather than requiring the whole upper
      package to contain only one resilient layer
  - previous CLT interpolation posture remains:
    - the CLT interpolation pass compared the implementation against the TUAS
      `X2/C2` source anchors, whose visible package is `8 mm` laminate on
      `3 mm` EPS underlay over CLT
    - raw bare CLT remains source-backed as a conservative bare-slab
      interpolation with the existing raw-slab penalty
    - CLT with the defended laminate-plus-EPS package remains supported on the
      same interpolation lane
    - CLT with laminate only, or laminate far outside the source thickness band,
      now stays screening-only / impact-unsupported instead of borrowing the
      full measured `X2/C2` impact improvement
    - direct predictor, visible layer route, and workbench scenario surfaces now
      share this package-completeness guard
  - previous companion-semantics posture remains:
    - the companion-semantics pass compared implementation against TUAS
      spreadsheet row `42` (`Rw+C`) and the already-fixed Dataholz timber-frame
      rows that publish `Ctr` as a term
    - TUAS source `Rw+C` values stay in the legacy numeric `RwCtr` field for
      compatibility but now carry explicit `RwCtrSemantic: "rw_plus_c"`
    - all `31` imported TUAS exact rows with an airborne companion support `C`
      and withhold `Ctr`; Dataholz `ctr_term` rows still support `Ctr` and
      withhold `C`
    - target-output support, predictor-family propagated companions, output
      combination sweeps, and workbench floor cards now share the same C-vs-Ctr
      contract
    - low-confidence mixed-source predictor companions now withhold the
      companion instead of relabeling a mixed `C`/`Ctr`/`Rw+Ctr` candidate set
  - previous active source-row posture remains:
  - the C4c candidate pass compared implementation against the rebaselined TUAS spreadsheet rows `34`, `35`, `36`, `41`, and `42` plus drawing page `27/40`
  - `C3c` remains frozen exactly as `tuas_c3c_clt260_measured_2026`
  - `C4c` is now landed exactly as `tuas_c4c_clt260_measured_2026`
  - `C4c` page `27/40` source stack is `50 mm glass wool + 2 x 15 mm gypsum board + 3 mm EPS + 8 mm laminate` over `CLT 260`, plus the same `70 mm` acoustic hanger ceiling with `100 mm` mineral wool and `2 x 13 mm` gypsum board
  - `C4c` landed with `Ln,w 24`, `Ln,w+CI 26`, `Ln,w+CI,50-2500 40`, `Rw 74`, and numeric `Rw+C 69.69668895954507`
  - `C11c` anomaly audit is now closed as deferred/fail-closed: page `30/40` shows `30 mm glass wool + geotextile + 40 mm screed` plus the same lower suspended ceiling, but the source truth is much weaker at `Ln,w 59`, `Ln,w+CI 60`, `Ln,w+CI,50-2500 60`, `Rw 74`
  - the C11c source tuple is `35 dB` weaker than same-airborne `C4c`, `29 dB` weaker than nearby wet combined `C7c`, and `21 dB` weaker than predictor-backed dry combined `C5c` on `Ln,w`
  - current C11c route behavior therefore remains screening-only with `Rw 49`, no exact match, no predictor estimate, and impact outputs unsupported
  - row `42` is `Rw+C`; the companion-semantics audit now keeps it in the
    legacy numeric `RwCtr` field with explicit `RwCtrSemantic: "rw_plus_c"` so
    TUAS supports `C` and withholds `Ctr`
  - exact split parity now accepts only merge-safe contiguous same-role/same-material packed thickness equivalents; mixed-material schedules still require explicit material/thickness schedules
  - route-control finding from this slice:
    - adding `C4c` correctly created a profile-aligned combined CLT exact row, but it also exposed that under-described combined CLT stacks with lower board/fill and no `ceiling_cavity` could drift into family estimates
    - `floor-system-estimate.ts` now keeps those stacks fail-closed unless the lower suspended-cavity topology is explicit
- validation:
  - `pnpm --filter @dynecho/engine exec vitest run src/tuas-support-surface-decision-contract.test.ts --reporter=basic`
  - result: `1` file, `11` tests, green
  - `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts --reporter=basic`
  - result: `1` file, `19` tests, green
  - `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
  - result: `1` file, `92` tests, green
  - `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts --reporter=basic`
  - result: `2` files, `107` tests, green
  - `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/tuas-support-surface-decision-contract.test.ts src/floor-widening-candidate-contract.test.ts src/floor-source-corpus-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
  - result: `6` files, `323` tests, green
  - `pnpm --filter @dynecho/engine typecheck`: green
  - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
    TypeScript plugin recommendation
  - `pnpm --filter @dynecho/engine test`: `96` files, `780` tests, green
  - `pnpm build`: green with the known `sharp/@img` optional-package warnings
    through `proposal-docx` and the Next.js TypeScript plugin recommendation
  - previous combined CLT fallback validation:
  - `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts --reporter=basic`
  - result: `2` files, `24` tests, green
  - `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
  - result: `1` file, `90` tests, green
  - `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/tuas-measured-source-truth-audit.test.ts --reporter=basic`
  - result: `3` files, `31` tests, green
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
  - previous CLT interpolation validation:
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
  - previous companion-semantics validation:
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
    slice; the current full-suite count is recorded in the latest slice
    validation above
  - `pnpm build`: green with the known `sharp/@img` optional-package warnings
    through `proposal-docx` and the Next.js TypeScript plugin recommendation
- next intended move:
  - keep `C3c` and `C4c` frozen as staged/heavy-dry combined exact anchors
  - keep `C11c` deferred unless a future source correction or frequency-level explanation resolves the anomaly
  - do not let `C11c` reopen shorthand inference, predictor aliases, or under-described direct-fixed stacks
  - resume raw/predictor widening only one source-backed family at a time

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

Two execution orders matter here:

### 5.1 Default Cold-Start Order

Use this ordering when the repo does not yet have a strong current-state signal.

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

### 5.2 Current Repo-Specific Order (`2026-04-10`)

This repo is no longer at a cold-start point, so the live next-step order is now:

0. freeze the already-closed floor, mixed/history, and support-surface gains
   - keep the selected TUAS floor baseline packs and `pnpm build` green
   - treat the wall-selector and UBIQ provenance slices as closed guardrails, not as the next widening prompts
1. Workstream A
   - `tuas_c7_wet_geotextile_clt_surface_design_v1` is closed
   - `C7` now lands as an exact row on the already-defended `geotextile + screed + EPS underlay + laminate` visible surface on `260 mm` CLT
   - the previous `C7` proxy is no longer the live corridor on the true source-backed stack
2. Workstream A source-truth rebaseline
   - `tuas_floor_source_truth_rebaseline_v1` is now the active numeric baseline
   - TUAS floor rows must read `Ln,w` from row `34`, `Ln,w+CI` from row `35`, `Ln,w+CI,50-2500` from row `36`, `Rw` from row `41`, and the current companion numeric from row `42` (`Rw+C` in source)
   - `floor_airborne_companion_c_ctr_semantic_audit_v1` closed the semantic-label
     debt: row `42` now carries `RwCtrSemantic: "rw_plus_c"` and cannot be
     exposed as `Ctr`
3. Workstream A remaining combined-CLT matrix
   - `tuas_remaining_combined_clt_exact_import_decision_matrix_v1` is closed with `C3c` as the first landed exact import
   - `tuas_c4c_combined_heavy_dry_exact_candidate_v1` is also closed with exact `tuas_c4c_clt260_measured_2026`
   - `tuas_c11c_wet_stack_anomaly_audit_v1` is closed as deferred/fail-closed
   - keep `C11c` screening-only unless the weak wet-stack tuple is explained by source correction or frequency-level evidence
   - `C2c`, `C3c`, `C4c`, and `C7c` are already exact anchors, and `C5c` is already predictor-backed
4. Workstream A/B boundary hold
   - do not let `C2c`, `C5c`, or `C7c` silently reopen shorthand aliasing or broader combined-CLT predictor lanes
   - keep under-described combined direct-fixed CLT stacks fail-closed unless the exact source row is imported deliberately
5. Workstream C
   - resume raw/predictor widening on corridors that are now stronger from A/B, but keep it source-led and one family at a time
6. Workstream D / E2
   - broader wall widening and broader mixed/history grids remain evidence-triggered follow-up work, not the default next move

Mandatory parallel rule:

- run `Workstream E1` inside the same slice whenever a new corridor becomes a representative floor or wall route surface
- do not defer that first mixed/history follow-up to a later cleanup pass

Reasoning:

- the implementation already landed the hybrid open-box branch through `R2c`, the CLT dry-top branch through `C5`, and the wet geotextile CLT branch through `C7`
- `packages/engine/src/tuas-clt-backlog-decision-contract.test.ts` now keeps the remaining combined CLT backlog fail-closed unless a row earns a pure exact import
- the next floor move is therefore no longer `C7`, `C3c`, `C4c`, or `C11c`; C11c is audited and deliberately deferred
- the combined `c`-family CLT backlog is a different class of debt:
  - `C2c`, `C3c`, `C4c`, and `C7c` are now exact anchors
  - `C5c` is now predictor-backed
  - `C11c` current visible route is still screening-only / impact-unsupported
  - the missing interaction surface should not be smuggled in under a nearby exact-row landing
- raw inference widening should consume stronger corridor evidence instead of leading it
- wall selector and UBIQ current questions are now frozen as honesty/provenance decisions, not as the next widening queue

## 6. Priority Backlog By Corridor

### 6.1 Priority P0: Floor Same-Corridor Evidence Fill

These are the safest next gains.

- TUAS `C7` wet geotextile CLT follow-on is now closed
  - exact row `tuas_c7_clt260_measured_2026` is now landed on the already-defended `35 mm EPS + 1 mm geotextile + 40 mm screed + 3 mm EPS underlay + 8 mm laminate` visible surface
  - rebaselined landed posture is `Ln,w 39`, `Ln,w+CI 40`, `Ln,w+CI,50-2500 42`, `Rw 57`
- freeze the adjacent CLT-local neighbors now that `C7` is landed
  - keep `C11c` screening-only / impact-unsupported after the wet-stack anomaly audit unless source correction or frequency-level evidence justifies another posture
  - keep `C2c`, `C3c`, `C4c`, and `C7c` exact-only, and keep `C5c` predictor-backed
  - keep under-described combined direct-fixed CLT stacks fail-closed
- treat the wall-selector and UBIQ provenance slices as closed
  - do not reopen them as ad hoc coverage work unless new evidence changes the corridor

### 6.2 Priority P1: Floor Family Accuracy Tightening

- CLT-local boundary tightening immediately after the landed `C7`
  - keep the new exact `C7` surface narrow
  - keep nearby combined `c`-family rows off the exact lane unless a real lower-ceiling interaction surface is added
- Dataholz / CLT monotonicity and treatment-strength tightening
- reinforced-concrete upper-treatment tightening
- lightweight-steel interpolation and boundary tightening
- composite lower-only and combined continuation tightening

### 6.3 Priority P2: Raw-Inference Expansion

- safe normalized raw shapes that reduce to already-defended combined or exact corridors strengthened by the `C7` / CLT-local follow-on
- concrete helper-side widening only if same-family evidence remains explicit
- do not let raw widening outrun the currently selected exact/bound corridor work

### 6.4 Priority P3: Wall Selector Architecture

- keep the current selector-honesty corridor frozen
- widen only after a new trace / scan / workbench parity pack proves a second defended hold surface
- MorphologyV2 only after that proof exists

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

1. freeze the current TUAS floor baseline before any new edit
   - rerun the active floor pack:
   - engine: `9` files, `366` tests
   - workbench: `2` files, `82` tests
   - keep `pnpm build` green
2. freeze the now-closed neighbor truth around the next slice
   - treat `R7b/R8b/R9b/R2c` as closed on the hybrid open-box branch
   - treat `X3/C3/X4/C4/C5` as closed on the staged-upper / heavy dry-top CLT branch
   - do not reopen wall-selector or UBIQ provenance work as part of the next floor slice
3. freeze the current `C7` source and proxy truth before changing logic
   - source-backed visible stack:
   - `260 mm` CLT
   - `35 mm` EPS
   - `1 mm` geotextile
   - `40 mm` screed
   - `3 mm` EPS underlay
   - `8 mm` laminate
   - current proxy posture:
   - `family_general`
   - `54%` fit
   - candidate set `tuas_c4`, `tuas_c2`, `tuas_x4`
   - frozen estimate `Ln,w 59` / `Rw 48.3`
   - source exact lab tuple:
   - `Ln,w 60`
   - `Ln,w+CI 62`
   - `Ln,w+CI,50-2500 63`
   - `Rw 57`
4. land `C7` narrowly
   - add the exact row on the existing defended geotextile/screed visible surface
   - keep the route narrow enough that adjacent combined or shorthand CLT routes do not inherit the new exact row
   - do not widen any combined lower-ceiling CLT route in the same slice
5. keep the adjacent negative controls explicit
   - historical `C7` close-out checkpoint: `C2c/C3c/C4c/C7c/C11c` stayed screening-only / impact-unsupported
   - current rebaseline truth supersedes this: `C2c`, `C3c`, `C4c`, and `C7c` are exact anchors, `C5c` is predictor-backed, and only `C11c` remains screening-only / impact-unsupported
   - under-described combined direct-fixed CLT stacks stay fail-closed
6. rerun the slice-closing packs and only then re-rank the next CLT-local move
   - if `C7` becomes a representative corridor, add the first mixed/history follow-up in the same slice (`E1`)
   - if combined lower-ceiling semantics are still absent, keep `E2` breadth deferred and prefer CLT-local boundary tightening over a premature combined import

What this means in practice:

- the next slice is no longer wall-first, UBIQ-first, open-box-first, C7-first, or mixed-history-first
- the first remaining combined exact-import decision matrix is closed with `C3c`, the `C4c` exact-candidate pass is also closed, and the `C11c` anomaly audit is closed as deferred / fail-closed
- the real risk is no longer "can we find one more same-family open-box or upper-only CLT row":
  - it is accidentally using combined CLT source rows to smuggle in broader shorthand inference, predictor aliases, or raw widening
- each floor widening slice should still carry its own first mixed/history follow-up if it creates a new representative corridor
- wall work stays frozen unless a future trace/scan/parity pack proves a second defended hold surface
- raw widening should only happen after the matching exact / boundary packs are already green
- docs should be updated at slice close, not batched after several slices

If only one slice should start now, the best candidate is:

- `source_led_raw_or_predictor_widening_v1`, after selecting one concrete source family

Reason:

- the wall-selector honesty question is already answered and frozen
- the UBIQ corridor question is also already answered and frozen:
  - the remaining drift is provenance-only, not new coverage
- the hybrid open-box branch is now fully closed through `R2c`
- the staged-upper, heavy dry-top, wet geotextile, and combined-anchor TUAS CLT baseline is now closed through `C2c`, `C3c`, `C4c`, `C5c`, and `C7c`
- the C11c anomaly discipline is now closed as deferred / fail-closed, not a source discovery blocker
- the immediate risk is therefore narrow and easy to reason about:
  - keep the landed `C2c`, `C3c`, `C4c`, predictor-backed `C5c`, and landed `C7c` anchors from reopening combined shorthand inference, predictor aliases, or broad raw inference

Important notes for the next operator:

- floor exact/bound/product widening is still the current high-confidence lever
- support parity and route wording are part of correctness, not follow-up cleanup
- mixed generated breadth is already useful, but it is still a secondary net after targeted corridor packs
- the first sign of a bad slice will usually be adjacent profile drift, not a dramatic broad failure
- if a change looks numerically better but moves a route from `exact/bound/product` to a broader estimate lane, treat that as suspect until proven safe

## 11. Current Decision

This document now establishes the rule for the next stage:

- immediate next execution step is a concrete `source_led_raw_or_predictor_widening_v1` family selection
- the repo-specific order now treats the rebaselined `C2c`, `C3c`, `C4c`, predictor-backed `C5c`, landed `C7c`, and deferred C11c guard as frozen; raw widening may proceed only behind those guards
- `wall_selector_shadow_trace_audit_v1` remains a closed selector-honesty hardening slice, not an open widening prompt
- `ubiq_open_web_corridor_decision_v1` also remains closed:
  - the current official-source conflict does not justify new coverage or a runtime rename
- the TUAS hybrid open-box branch is now closed through `R2c`
- the TUAS staged-upper, heavy dry-top, wet geotextile, and combined-CLT anchor branches are closed through `C4c` / `C7c`
- the next floor move is therefore source-led raw/predictor widening, not another open-box bulk pass or the already-closed `C4c` / `C11c` passes
- remaining combined `c`-family CLT rows stay deferred unless they can land as pure exact rows without weakening the combined-CLT inference/predictor guards
- raw inference widening still stays behind the separate screening-reopen guardrail and the frozen combined-CLT boundary work
- mixed/history breadth remains `E2`, not the immediate next slice, unless landed `C7` or its follow-on exposes a real history blind spot
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
- wall selector shadow-trace audit closed
- UBIQ open-web corridor decision closed
- TUAS open-box support-surface decision closed
- TUAS `R6a` mixed-board surface design closed
- TUAS `R10a` staged upper-package surface design closed
- TUAS CLT backlog decision selected

Closed slice just before the current floor re-rank:

- slice id: `wall_selector_shadow_trace_audit_v1`
- workstream: `D` wall selector accuracy
- status: `closed`
- close-out reason:
  - the selected engine/workbench packs still defend only the current narrow AAC boundary
  - the remaining user-facing debt inside the slice turned out to be wording parity, not a second selector corridor
  - a final route-control pass therefore supports stopping wall hold widening here instead of inventing more wall work
- close-out evidence on `2026-04-10`:
  - engine wall isolation pack:
    - `pnpm exec vitest run packages/engine/src/dynamic-airborne-family-boundary.test.ts packages/engine/src/dynamic-airborne-family-boundary-scan.test.ts packages/engine/src/dynamic-airborne-order-sensitivity.test.ts packages/engine/src/dynamic-airborne-instability-repro.test.ts --maxWorkers=1`
    - `4` files, `23` tests, green
  - workbench wall honesty pack:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/dynamic-calc-branch.test.ts features/workbench/dynamic-route-family-boundary.test.ts features/workbench/dynamic-route-family-boundary-scan.test.ts features/workbench/dynamic-route-order-sensitivity.test.ts features/workbench/dynamic-route-instability.test.ts features/workbench/validation-regime.test.ts features/workbench/simple-workbench-corridor-dossier.test.ts features/workbench/simple-workbench-evidence.test.ts features/workbench/consultant-decision-trail.test.ts`
    - `9` files, `49` tests, green
  - build gate:
    - `pnpm build`
    - green
  - frozen result:
    - keep the defended hold limited to `double_leaf <-> lined_massive_wall`
    - no second held family pair survives on the representative non-AAC heavy-core palette
    - no multi-candidate framed palette survives yet
    - non-advanced wall surfaces no longer hide runner-up or hold posture outside advanced diagnostics
- close-out note:
  - the `sharp` / `@img` module-resolution warnings during web build remain environmental and unchanged from before this slice

Closed slice just before the current TUAS re-rank:

- slice id: `ubiq_open_web_corridor_decision_v1`
- workstream: `A` widening-first corridor decision
- status: `closed`
- close-out reason:
  - the current official UBIQ open-web corridor still has no clean new package-variant import beyond the already imported `FL-24 -> FL-26 -> FL-28` rows
  - `FL-23/25/27` remain materially weaker and stay deferred
  - a second official UBIQ brochure changes the visible open-web FRL/D family code from `FL-28 (FRL/D)` to `FL-26 (FRL/D)` for the same `2 x 16 mm` package
  - that conflict is provenance-only and does not justify a new import or runtime rename
- close-out evidence on `2026-04-10`:
  - engine UBIQ decision pack:
    - `pnpm exec vitest run packages/engine/src/ubiq-candidate-backlog-contract.test.ts packages/engine/src/floor-gap-ledger-contract.test.ts packages/engine/src/floor-widening-candidate-contract.test.ts packages/engine/src/floor-source-corpus-contract.test.ts`
    - `4` files, `14` tests, green
  - workbench floor regression pack:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/complex-stack-audit.test.ts`
    - `2` files, `63` tests, green
  - build gate:
    - `pnpm build`
    - green
  - frozen result:
    - keep the defended `FL-24 -> FL-26 -> FL-28` corridor frozen
    - keep `FL-23/25/27` deferred
    - keep current `ubiq_fl32_*` and `ubiq_fl33_*` ids frozen as internal ids
    - keep the cross-brochure FRL/D visible-code drift explicit in docs and contracts only
  - support nuance now explicit:
    - the current bound open-web lane still supports `Rw` plus conservative `Ln,w` on lab outputs
    - field continuation still supports `Ln,w`, `L'n,w`, and `L'nT,w`
    - `L'nT,50` remains unsupported on that current bound lane

Closed slice just before the current `R6a` design pass:

- slice id: `tuas_open_box_support_surface_decision_v1`
- workstream: `A` widening-first corridor decision
- status: `closed`
- close-out reason:
  - implementation comparison now shows the old two-bucket TUAS defer set was too coarse for the next slice
  - the `R6a` proxy remains on a near-corridor `family_archetype` lane at `89%` fit with a duplicate `ceiling_board` blocker
  - the hybrid lower-treatment proxy already falls to `family_general` at `54%` fit with a duplicate `ceiling_cavity` blocker
  - `R10a` shares the `family_a` support morphology but does not share the same new surface with `R6a`; it stays separate staged upper-package debt
- close-out evidence on `2026-04-10`:
  - engine:
    - `pnpm exec vitest run packages/engine/src/tuas-candidate-backlog-contract.test.ts packages/engine/src/tuas-post-corridor-screening-contract.test.ts packages/engine/src/floor-gap-ledger-contract.test.ts packages/engine/src/floor-widening-candidate-contract.test.ts packages/engine/src/tuas-support-surface-decision-contract.test.ts`
  - workbench:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/complex-stack-audit.test.ts`
- close-out baseline is green:
  - engine: `5` files, `18` tests
  - workbench: `2` files, `63` tests
- frozen decision:
  - first promotable candidate: `R6a`
  - separate upper-package debt: `R10a`
  - secondary support-surface branch: `R7b`, `R8b`, `R9b`, `R2c`

Closed slice just before the current `R10a` design pass:

- slice id: `tuas_r6a_mixed_board_surface_design_v1`
- workstream: `A` widening-first corridor decision
- status: `closed`
- close-out reason:
  - the mixed lower-board schedule is now represented honestly on exact visible-layer and predictor surfaces without broadening the surrounding `family_a` corridor
  - grouped packed shorthand survives narrowly inside same-material uniform runs, so the exact route no longer depends on six separate visible board entries
  - the old parked `family_archetype` route and duplicate `ceiling_board` blocker are now removed for the supported `R6a` schedule
- close-out evidence on `2026-04-10`:
  - engine:
    - `pnpm exec vitest run packages/engine/src/calculate-assembly.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/impact-predictor-input.test.ts packages/engine/src/tuas-support-surface-decision-contract.test.ts packages/engine/src/tuas-post-corridor-screening-contract.test.ts packages/engine/src/tuas-candidate-backlog-contract.test.ts packages/engine/src/floor-gap-ledger-contract.test.ts packages/engine/src/floor-source-corpus-contract.test.ts`
  - workbench:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/complex-stack-audit.test.ts`
- close-out baseline is green:
  - engine: `8` files, `318` tests
  - workbench: `2` files, `66` tests
- build gate:
  - `pnpm build`
  - green
- landed result:
  - exact row `tuas_r6a_open_box_timber_measured_2026`
  - exact visible and predictor surfaces now carry the mixed lower-board schedule `2 x 13 mm + 4 x 15 mm`
  - grouped packed shorthand `26 mm + 60 mm` is now defended on the same exact row
  - lab posture is explicit:
    - basis `open_measured_floor_system_exact_match`
    - supported outputs `Rw`, `Ln,w`
    - unsupported output `Ln,w+CI`
  - field posture is explicit:
    - basis `mixed_exact_plus_estimated_standardized_field_volume_normalization`
    - supported outputs `Ln,w`, `L'n,w`, `L'nT,w`
    - unsupported output `L'nT,50`
  - the remaining open TUAS debt now narrows to:
    - staged upper-package `R10a`
    - hybrid lower-treatment `R7b/R8b/R9b/R2c`
- close-out note:
  - the `sharp` / `@img` module-resolution warnings during web build remain environmental and unchanged from before this slice

Closed slice just before the current TUAS CLT re-rank:

- slice id: `tuas_r10a_staged_upper_package_surface_design_v1`
- workstream: `A` widening-first corridor decision
- status: `closed`
- close-out reason:
  - the source-backed staged upper package now lands honestly on a narrow exact visible-layer surface without reopening a generic dry-floor shorthand
  - the shorthand `upper_fill 13 mm + dry_floating_gypsum_fiberboard 33 mm` remains fail-closed, so the slice widened only the defended split stack
  - predictor derivation still stays fail-closed on the staged mixed floating-screed package, so no broader predictor surface was invented during the exact widening
- close-out evidence on `2026-04-10`:
- engine:
  - `pnpm exec vitest run packages/engine/src/calculate-impact-only.test.ts packages/engine/src/calculate-assembly.test.ts packages/engine/src/impact-predictor-input.test.ts packages/engine/src/tuas-support-surface-decision-contract.test.ts packages/engine/src/tuas-post-corridor-screening-contract.test.ts packages/engine/src/tuas-candidate-backlog-contract.test.ts packages/engine/src/floor-gap-ledger-contract.test.ts packages/engine/src/floor-source-corpus-contract.test.ts`
- workbench:
  - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/complex-stack-audit.test.ts`
- close-out baseline is green:
  - engine: `8` files, `324` tests
  - workbench: `2` files, `66` tests
- build gate:
  - `pnpm build`
  - green
- landed result:
  - exact row `tuas_r10a_open_box_timber_measured_2026`
  - exact visible-layer `floating_screed` material/thickness schedule now carries the source-backed `15 mm gypsum + 3 mm mortar + 15 mm gypsum` stack
  - lab posture is explicit:
    - basis `open_measured_floor_system_exact_match`
    - supported outputs `Rw`, `Ln,w`, `Ln,w+CI`
  - field posture is explicit:
    - basis `mixed_exact_plus_estimated_standardized_field_volume_normalization`
    - supported outputs `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
  - the shorthand `upper_fill 13 mm + dry_floating_gypsum_fiberboard 33 mm` remains on `family_archetype` at `90%` fit and is still not promoted
  - predictor derivation remains fail-closed on the staged mixed floating-screed package and still surfaces the duplicate-role blocker when queried directly
  - the remaining open-box debt now narrows to the hybrid lower-treatment branch `R7b/R8b/R9b/R2c`

Active slice:

- closed slice: `tuas_c4_heavy_dry_top_clt_surface_design_v1`
- close-out result:
  - landed exact row `tuas_c4_clt260_measured_2026`
  - lab tuple is now explicit on the exact route:
    - `Ln,w 47`
    - `Ln,w+CI 49`
    - `Ln,w+CI,50-2500 53`
    - `Rw 61`
  - field continuation is now explicit on the standardized continuation route:
    - `L'n,w 49`
    - `L'nT,w 47`
    - `L'nT,50 53`
  - packed same-material shorthand such as `30 mm` gypsum board still resolves to the same exact row
  - over-abstracted shorthand still stays off the exact lane:
    - `generic_fill 50 mm` + `dry_floating_gypsum_fiberboard 30 mm`
    - frozen at `family_general` `94%` fit against `tuas_x5_clt140_measured_2026`
  - predictor derivation still stays fail-closed on the generic dry shorthand
  - the adjacent heavier same-surface visible fallback now reranks onto `tuas_c4`, `tuas_x4`, and `tuas_c3` with frozen `family_archetype` fit `78.7%` and frozen estimate tuple `Ln,w 50` / `Rw 57.9`
- closed slice: `tuas_c5_heavy_dry_top_clt_surface_design_v1`
- workstream: `A` widening-first corridor design
- status: `closed`
- close-out reason:
  - the source-backed heavier same-surface CLT sibling is now landed as an exact row without inventing a generic dry shortcut
  - packed `60 mm` gypsum shorthand stays exact because it preserves the defended `4 x 15 mm` visible schedule
  - the generic dry shorthand remains fail-closed on `family_general` `94%` fit against `tuas_x5`
  - the slice also caught and re-closed an unintended combined direct-fixed CLT estimate leak before it could become silent widening
- close-out evidence on `2026-04-10`:
  - engine:
    - `pnpm exec vitest run packages/engine/src/calculate-assembly.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/impact-predictor-input.test.ts packages/engine/src/tuas-support-surface-decision-contract.test.ts packages/engine/src/tuas-clt-backlog-decision-contract.test.ts packages/engine/src/tuas-post-corridor-screening-contract.test.ts packages/engine/src/tuas-candidate-backlog-contract.test.ts packages/engine/src/floor-gap-ledger-contract.test.ts packages/engine/src/floor-source-corpus-contract.test.ts`
    - `9` files, `352` tests, green
  - workbench:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts features/workbench/complex-stack-audit.test.ts`
    - `2` files, `78` tests, green
  - build:
    - `pnpm build`
    - green
- landed result:
  - exact row `tuas_c5_clt260_measured_2026`
  - exact visible-layer `floating_screed` material/thickness schedule now also carries the source-backed `50 mm glass wool + 4 x 15 mm gypsum board + 3 mm EPS + 8 mm laminate` stack on `260 mm` CLT
  - exact lab tuple is now explicit:
    - `Ln,w 45`
    - `Ln,w+CI 46`
    - `Ln,w+CI,50-2500 51`
    - `Rw 61`
  - field continuation is now explicit:
    - `L'n,w 47`
    - `L'nT,w 45`
    - `L'nT,50 51`
  - combined direct-fixed CLT under-described stacks now stay fail-closed because `massTimberCombinedDirectFixedTierHold` blocks profile-mismatched `family_general` reuse when there is no profile-aligned candidate
- closed slice: `tuas_open_box_hybrid_lower_treatment_support_surface_decision_v1`
- workstream: `A` widening-first corridor decision
- status: `closed`
- close-out reason:
  - the hybrid lower-treatment backlog is no longer a single unresolved bucket
  - `R7b` is now frozen as the first promotable anchor because it preserves the landed `R7a` finish family and only adds hybrid lower-treatment plus `geotextile`
  - `R8b` is the immediate same-surface sibling once that anchor exists
  - `R9b` and `R2c` remain later because they widen different wet-top / no-fill variants
  - the true `R7b/R8b` source stacks were the last blocker before the `R7b` landing; that blocker is now closed
- close-out evidence on `2026-04-10`:
  - focused engine decision pack:
    - `pnpm exec vitest run packages/engine/src/tuas-support-surface-decision-contract.test.ts packages/engine/src/tuas-candidate-backlog-contract.test.ts packages/engine/src/tuas-post-corridor-screening-contract.test.ts`
    - `3` files, `26` tests, green
  - workbench parity:
    - `cd apps/web && pnpm exec vitest run --config vitest.config.ts features/workbench/floor-family-regressions.test.ts`
    - `1` file, `78` tests, green
- frozen result:
  - landed anchor: `R7b`
  - immediate sibling: `R8b`
  - later variants: `R9b`, `R2c`
  - closed blocker: missing `geotextile` material surface on the true source stack
- slice id: `tuas_r7b_hybrid_lower_geotextile_surface_design_v1`
- workstream: `A` widening-first corridor design
- status: `closed`
- landed result:
  - exact row `tuas_r7b_open_box_timber_measured_2026`
  - exact visible-layer schedule now carries `35 mm EPS + 1 mm geotextile + 40 mm screed + 3 mm EPS underlay + 8 mm laminate`
  - exact lower-treatment schedule now carries `45 mm family_a cavity + 25 mm resilient stud`
  - exact lab tuple is now explicit:
    - `Ln,w 47`
    - `Ln,w+CI 47`
    - `Ln,w+CI,50-2500 48`
    - `Rw 72`
  - field continuation is now explicit:
    - `L'n,w 49`
    - `L'nT,w 46.6`
    - `L'nT,50 47.6`
  - workbench sanity posture now carries an explicit `geotextile 0.5-5 mm` band, so the source-backed `1 mm` separator no longer emits a false-positive thickness warning
- slice id: `tuas_r8b_hybrid_lower_finishless_follow_on_v1`
- workstream: `A` widening-first corridor design
- status: `closed`
- current objective:
  - determine whether the same hybrid lower-treatment plus geotextile surface can honestly carry the finishless `R8b` sibling without reopening a broader family shortcut
  - keep `R9b` and `R2c` explicitly later unless the `R8b` follow-on proves narrow and source-aligned
- current non-goals:
  - no automatic widening of `R9b` or `R2c` in the same slice
  - no combined `c`-family CLT widening in the same slice
  - no reopening of already closed wall, UBIQ, or same-surface CLT decisions
- landed result:
  - exact row `tuas_r8b_open_box_timber_measured_2026` is now landed
  - exact visible-layer route now carries the finishless sibling `35 mm EPS board + 1 mm geotextile + 40 mm screed`
  - exact match uses `absentRoles` to keep `resilient_layer` and `floor_covering` explicitly out of the landed surface instead of widening a family shortcut
  - lab tuple is now explicit:
    - `Ln,w 50`
    - `Ln,w+CI 49`
    - `Ln,w+CI,50-2500 50`
    - `Rw 72`
  - field continuation is now explicit:
    - `L'n,w 52`
    - `L'nT,w 49.6`
    - `L'nT,50 49.6`
- historical closed slice id: `tuas_c11c_wet_stack_anomaly_audit_v1`
- historical slice status: `closed`
- historical follow-on slice id: `clt_laminate_underlay_interpolation_guard_v1`
- historical follow-on slice status: `closed and green`; the current latest
  closed CLT tightening slice is `clt_dry_finish_package_guard_v1`
- follow-on source-led raw/predictor widening remains deferred until the next
  concrete source family is selected
- audit test pack:
  - engine:
    - `pnpm --filter @dynecho/engine exec vitest run src/tuas-c11c-wet-stack-anomaly-audit.test.ts`
    - `pnpm --filter @dynecho/engine exec vitest run src/tuas-candidate-backlog-contract.test.ts src/floor-source-corpus-contract.test.ts src/tuas-clt-backlog-decision-contract.test.ts src/floor-exact-companion-split-parity.test.ts src/floor-widening-candidate-contract.test.ts src/impact-predictor-input.test.ts`
    - `pnpm --filter @dynecho/engine exec vitest run src/calculate-assembly.test.ts src/calculate-impact-only.test.ts`
    - `pnpm --filter @dynecho/engine exec vitest run src/floor-input-noise-parity.test.ts src/floor-gap-ledger-contract.test.ts src/tuas-support-surface-decision-contract.test.ts`
  - workbench:
    - `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts`
  - audit baseline was green:
  - engine C4c/backlog/source/split/predictor pack: `6` files, `83` tests
  - engine assembly/impact-only route guard pack: `2` files, `287` tests
  - engine gap/noise/support pack: `3` files, `12` tests
  - workbench: `2` files, `102` tests
  - `pnpm build`: green
  - existing `sharp` / `@img` warnings remain environmental and unchanged
- current implementation reality check:
  - TUAS open-box exact corpus is now `15`, not `10`
  - TUAS CLT exact corpus is now `13`, not `4`
  - the last same-family open-box staged-package debt is now closed on the visible exact surface
  - the staged-upper CLT corridor is now closed on both defended carriers:
    - exact row `tuas_x3_clt140_measured_2026` is landed with `Ln,w 52`, `Ln,w+CI 52`, `Ln,w+CI,50-2500 60`, `Rw 49`
    - field continuation now carries `L'n,w 54`, `L'nT,w 52`, `L'nT,50 60`
    - exact row `tuas_c3_clt260_measured_2026` is landed with `Ln,w 47`, `Ln,w+CI 49`, `Ln,w+CI,50-2500 53`, `Rw 54`
    - field continuation now carries `L'n,w 49`, `L'nT,w 47`, `L'nT,50 53`
    - predictor derivation still stays fail-closed on the staged mixed floating-screed package
  - the first heavy dry-top CLT corridor is now also closed on both defended carriers:
    - exact row `tuas_x4_clt140_measured_2026` is landed with `Ln,w 50`, `Ln,w+CI 51`, `Ln,w+CI,50-2500 58`, `Rw 55`
    - field continuation now carries `L'n,w 52`, `L'nT,w 50`, `L'nT,50 58`
    - packed `30 mm` gypsum shorthand still stays exact because it preserves the same defended visible schedule
    - predictor derivation still stays fail-closed on the generic dry shorthand, which remains `family_general` `94%` fit against `tuas_x5`
    - exact row `tuas_c4_clt260_measured_2026` is landed with `Ln,w 45`, `Ln,w+CI 46`, `Ln,w+CI,50-2500 51`, `Rw 61`
    - field continuation now carries `L'n,w 47`, `L'nT,w 45`, `L'nT,50 51`
    - packed `30 mm` gypsum shorthand still stays exact because it preserves the same defended visible schedule
    - predictor derivation still stays fail-closed on the generic dry shorthand, which remains `family_general` `94%` fit against `tuas_x5`
    - exact row `tuas_c5_clt260_measured_2026` is now also landed with `Ln,w 60`, `Ln,w+CI 62`, `Ln,w+CI,50-2500 63`, `Rw 61`
    - field continuation now carries `L'n,w 62`, `L'nT,w 60`, `L'nT,50 63`
    - packed `60 mm` gypsum shorthand still stays exact because it preserves the same defended visible schedule
    - predictor derivation still stays fail-closed on the generic dry shorthand, which remains `family_general` `94%` fit against `tuas_x5`
  - the nearby bare-CLT visible fallback is now reweighted by the new exact sibling:
    - candidate set is now `tuas_x2`, `tuas_c2`, `tuas_x4`
    - frozen fit is now `79.7%`
    - frozen estimate tuple is now `Ln,w 57.7` / `Rw 40.6`
  - the heavy dry-top CLT branch no longer has an unresolved same-surface sibling inside the defended visible tier
  - a new honesty guard is now explicit:
    - under-described combined direct-fixed CLT stacks stay fail-closed because combined mass-timber stacks with lower board/fill and no explicit `ceiling_cavity` cannot reuse the new C4c-aligned family estimate lane
  - the hybrid lower-treatment branch is now explicit:
    - exact `R7b` is landed on the visible route
    - exact `R8b` is now also landed on the visible route at `Ln,w 50` / `Rw 72`
    - exact `R9b` is now also landed on the visible route at `Ln,w 45` / `Rw 68`
    - exact `R2c` is now also landed on the visible route at `Ln,w 70` / `Rw 54`
    - field continuation for `R2c` now carries `L'n,w 72`, `L'nT,w 69.6`, `L'nT,50 69.6`
    - the stale `plastic-layer` reading is now closed:
      - TUAS drawing page `13/40` shows `40 mm screed + 3 mm EPS underlay + 8 mm laminate`
      - no extra upper `plastic-layer` or `geotextile` item appears on the `R9b` top package
    - the old separator-free proxy still falls to `family_general` at `54%` fit, but it now re-ranks to `tuas_r9b`, `tuas_r7b`, `tuas_r7a` with frozen estimate `Ln,w 48.3`, `Ln,w+CI 49.2`, and `Rw 67.3`
    - the no-fill open-box branch is now closed without inventing a generic `__none` widening lane
  - the wet geotextile CLT follow-on is now closed before the remaining combined backlog:
    - exact row `tuas_c7_clt260_measured_2026` is now landed on the source-backed `35 mm` EPS + `1 mm` geotextile + `40 mm` screed + `3 mm` EPS underlay + `8 mm` laminate surface on `260 mm` CLT
    - landed lab tuple is `Ln,w 39`, `Ln,w+CI 40`, `Ln,w+CI,50-2500 42`, `Rw 57`
    - field continuation now carries `L'n,w 41`, `L'nT,w 39`, `L'nT,50 42`
    - historical checkpoint then: `C2c`, `C3c`, `C4c`, `C7c`, and `C11c` remained later combined CLT backlog because the raw visible routes were still screening-only / impact-unsupported
    - current rebaseline truth supersedes this: `C2c`, `C3c`, `C4c`, and `C7c` are exact anchors, `C5c` is predictor-backed, and only `C11c` remains later combined CLT exact-import backlog
  - focused validation during the `C4` close-out also surfaced an unrelated stale predictor guard:
    - low-density reinforced-concrete heavy-floating predictor input currently falls back to `family_general` `45%` fit against `tuas_h2_concrete160_measured_2026`
    - frozen truth is now `Ln,w 47` / `Rw 49`, not the older broader multi-candidate expectation
- exact step order inside the now-closed `C7` slice:
  1. freeze the landed `R2c` truth and the closed hybrid no-fill branch
     - status: completed
  2. freeze the `C7` source stack and current proxy truth
     - status: completed
  3. land `C7` as a narrow exact row on the existing geotextile/screed visible surface
     - status: completed
  4. historical checkpoint then: keep `C2c/C3c/C4c/C7c/C11c` screening-only unless a real combined lower-ceiling interaction lane is added explicitly
     - status: completed
- follow-on queue after the now-closed `C7` slice:
  1. `tuas_floor_source_truth_rebaseline_v1`
     - status: completed
  2. `tuas_remaining_combined_clt_exact_import_decision_matrix_v1`
     - status: completed with `C3c` as the first landed exact import
     - original scope: `C3c/C4c/C11c`; `C2c` and `C7c` were exact anchors, and `C5c` was predictor-backed
  3. `tuas_c4c_combined_heavy_dry_exact_candidate_v1`
     - status: completed as exact `tuas_c4c_clt260_measured_2026`
  4. `tuas_c11c_wet_stack_anomaly_audit_v1`
     - status: selected; decide anomaly before any import
  5. raw widening only on corridors strengthened by the previous steps
- implementation-backed source snapshot used for this plan:
  - current local TUAS open-box exact count is `15`, not `8`
  - `R7a` is part of the imported exact set
  - `R6a` is now also part of the imported exact set
  - `R7b`, `R8b`, `R9b`, and `R2c` are now also part of the imported exact set
  - `R10a` is now also part of the imported exact set
  - use the catalog-backed contract counts as truth if an older note still says `8` or `9`
- pause-safe restart protocol:
  - read this live-state block first
  - then read:
    - [CURRENT_STATE.md](./CURRENT_STATE.md)
    - [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
    - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
  - rerun the selected TUAS floor test pack before any edit
  - if wall context is needed again, inspect the closed selector-honesty corridor in:
    - [dynamic-airborne-family-boundary.test.ts](../../packages/engine/src/dynamic-airborne-family-boundary.test.ts)
- historical repo-backed follow-on after the landed `C7` slice:
  - `tuas_post_c7_clt_boundary_tightening_v1` is now also closed
  - current frozen truth:
    - engine exact-companion split parity and engine raw-order/noise parity now keep the landed `C7` corridor narrow
    - route-side contiguous split invariance now also keeps the landed `C7` corridor narrow on the workbench path
    - combined wet `C7c` visible proxies are fail-closed again at `Rw 49`; impact outputs stay unsupported
    - visible `C5c` combined CLT stacks now land on the explicit predictor-backed lane with `Ln,w 38`, `Ln,w+CI 42`, `Ln,w+CI,50-2500 44`, and `Rw 75`
- historical closed slice id: `tuas_clt_remaining_combined_source_schedule_research_v1`
- historical slice status: `closed`
- historical slice result:
  - TUAS drawing pages `25/40` through `30/40` now freeze the real visible schedules for `C2c/C3c/C4c/C5c/C7c/C11c`
  - `C2c` is now landed exactly as `tuas_c2c_clt260_measured_2026`
    - rebaselined lab tuple: `Ln,w 35`, `Ln,w+CI 39`, `Ln,w+CI,50-2500 44`, `Rw 70`
  - `C3c` and `C4c` are now exact; `C11c` remains deferred because of route-semantics discipline and its wet-stack anomaly instead of missing source drawings
  - the slice re-closed two adjacency drifts:
    - Dataholz dry combined predictor input no longer blends `tuas_c2c`
    - CLT `lower_only` no longer reopens through `C2c`
- historical closed slice id: `tuas_c7c_combined_wet_clt_surface_design_v1`
- historical slice status: `closed`
- historical slice result:
  - `C7c` is now landed exactly as `tuas_c7c_clt260_measured_2026`
    - rebaselined lab tuple: `Ln,w 30`, `Ln,w+CI 35`, `Ln,w+CI,50-2500 44`, `Rw 75`
  - `C3c` is now exact after the decision-matrix pass; `C4c/C11c` remain screening-only after that landing
  - the slice exposed and re-closed the root drift:
    - combined CLT visible stacks with lower treatment plus multi-entry `floating_screed` no longer auto-normalize into inferred or predictor-derived shorthand lanes
    - that guard now sits in both auto role inference and predictor derivation
  - `C3c/C4c` closest-family warnings now honestly point at `C7c`
- historical closed slice id: `tuas_remaining_combined_clt_exact_import_decision_matrix_v1`
- historical slice status: `closed`
- historical slice result:
  - `C3c` is now landed exactly as `tuas_c3c_clt260_measured_2026`
    - rebaselined lab tuple: `Ln,w 27`, `Ln,w+CI 29`, `Ln,w+CI,50-2500 43`, `Rw 73`
    - field continuation: `L'n,w 29`, `L'nT,w 27`, `L'nT,50 43`
  - source correction: drawing page `26/40` is `13 mm gypsum board + 2 x 15 mm gypsum board`, not `13 mm glass wool`
  - `C4c/C11c` remain screening-only / impact-unsupported after the first decision-matrix import
  - exact split parity now supports only merge-safe contiguous same-role/same-material packed thickness equivalents, preserving fail-closed posture for mixed-material schedules
- previous selected next slice id after the C3c decision-matrix import: `tuas_c4c_combined_heavy_dry_exact_candidate_v1`
- previous selected next slice reason:
  - `C4c` is the remaining row closest to defended dry/staged exact surfaces and has local source truth from drawing page `27/40`
  - `C11c` stays deferred because its wet `30 mm glass wool + geotextile + 40 mm screed` stack has a weaker `Ln,w 59` tuple that the later anomaly audit kept fail-closed
  - the next import must preserve the re-closed inference/predictor boundary instead of reopening shorthand aliases
- historical closed slice id: `tuas_c4c_combined_heavy_dry_exact_candidate_v1`
- historical slice status: `closed`
- historical slice result:
  - `C4c` is now landed exactly as `tuas_c4c_clt260_measured_2026`
    - rebaselined lab tuple: `Ln,w 24`, `Ln,w+CI 26`, `Ln,w+CI,50-2500 40`, `Rw 74`
    - field continuation: `L'n,w 26`, `L'nT,w 24`, `L'nT,50 40`
  - the new C4c row did not weaken C2c/C3c/C5c/C7c/C7c exact or predictor anchors
  - the under-described CLT upper-plus-lower direct-fixed guard is now stronger:
    - lower board/fill without explicit `ceiling_cavity` remains screening-only even though profile-aligned C4c now exists
- latest closed follow-up slice id: `tuas_c11c_wet_stack_anomaly_audit_v1`
- closed decision:
  - `C11c` is the only remaining source-backed combined CLT backlog row
  - its wet `30 mm glass wool + geotextile + 40 mm screed` stack has a weak tuple (`Ln,w 59`, `Ln,w+CI 60`, `Ln,w+CI,50-2500 60`) despite `Rw 74`
  - current implementation keeps it deferred / fail-closed; revisit only with source correction or frequency-level evidence
- follow-on queue after the now-closed `C4c` and `C11c` passes:
  1. source-led raw/predictor widening, one family at a time
  2. raw widening only on corridors strengthened by the previous steps
    - [dynamic-airborne-family-boundary-scan.test.ts](../../packages/engine/src/dynamic-airborne-family-boundary-scan.test.ts)
    - [dynamic-route-family-boundary.test.ts](../../apps/web/features/workbench/dynamic-route-family-boundary.test.ts)
    - [dynamic-route-family-boundary-scan.test.ts](../../apps/web/features/workbench/dynamic-route-family-boundary-scan.test.ts)

Historical route-control trail kept for provenance:

- the live current-state truth is the block above:
  - `wall_selector_shadow_trace_audit_v1` is closed
  - `tuas_open_box_support_surface_decision_v1` is closed
  - `tuas_r6a_mixed_board_surface_design_v1` is closed
  - `tuas_r10a_staged_upper_package_surface_design_v1` is closed
  - `tuas_clt_backlog_decision_v1` is closed
  - `tuas_x3_staged_upper_clt_surface_design_v1` is closed
  - `tuas_c3_staged_upper_clt_surface_design_v1` is closed
  - `tuas_x4_heavy_dry_top_clt_surface_design_v1` is closed
  - `tuas_c4_heavy_dry_top_clt_surface_design_v1` is closed
  - `tuas_c5_heavy_dry_top_clt_surface_design_v1` is closed
  - `tuas_r2c_hybrid_lower_no_fill_surface_design_v1` is closed
  - `tuas_c7_wet_geotextile_clt_surface_design_v1` is closed
  - `tuas_post_c7_clt_boundary_tightening_v1` is closed
  - `tuas_clt_combined_visible_interaction_semantics_v1` is closed
  - `tuas_clt_remaining_combined_backlog_boundary_matrix_v1` is closed
  - `tuas_clt_remaining_combined_source_schedule_research_v1` is closed
  - `tuas_c7c_combined_wet_clt_surface_design_v1` is the active selected slice
- the notes below explain how the repo reached this point; they do not override the live-state block above

- the TUAS deferred shortlist drawing audit is now also closed:
  - `TUAS2023FloorDetails.pdf` page `5/7` visually confirms the existing `family_a` vs `family_b` split remains correct
  - at audit time, `R6a` and `R10a` still stayed deferred because they required mixed board / staged dry-pack surfaces the exact route did not yet encode honestly
  - `R7b`, `R8b`, `R9b`, and `R2c` stay deferred because they require hybrid lower-treatment surfaces outside the defended `family_a` / `family_b` split
  - `R2c` still does not justify any `__none` topology widening
- because that audit produced no honest new TUAS import candidate, the floor evidence path does not currently justify another immediate open-box widening slice
- at that point, the clean next move was to tighten wall selector evidence before reopening broader wall work:
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
  - at that point, the first real corridor decision slice should therefore move to TUAS open-box branch audit, not to UBIQ weaker-band import
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
- that historical corridor re-rank was then resolved as:
  - official-product representative breadth is now closed on already-imported rows
  - UBIQ provenance/boundary-freeze is now also closed as docs plus contract work
  - at that point, the clean next move was mixed/history regression-net expansion, not another immediate coverage slice
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
- the first post-full-suite shared torture expansion is now also closed:
  - slice id: `mixed_boundary_floor_torture_expansion_v1`
  - the generated mixed engine and workbench grids now include:
    - TUAS `C11c` combined wet fail-closed stack
    - Dataholz `GDMTXA04A` manual-match boundary stack
  - this was a regression-net expansion, not a solver widening:
    - no C11c exact import or impact reopen
    - no Dataholz manual visible exact reopen
    - no catalog row change
  - validation:
    - engine generated matrix: `1` file, `1` test, green
    - workbench generated matrix/edit-history/history-grid pack: `3` files, `5`
      tests, green
    - engine typecheck: green
    - stable full engine suite: `93` files, `757` tests, green
    - repository build: green
- the complementary generated mixed history-grid expansion is now also closed:
  - slice id: `mixed_history_grid_variant_expansion_v1`
  - this was a route-history regression-net expansion, not a solver widening:
    - widened the generated mixed workbench history grid from two to four
      complementary duplicate/swap/rebuild variants
    - added ascending direct trailing rebuild and descending reversed leading
      rebuild paths
    - kept the same generated floor/wall final rows and route snapshots stable
      through direct parity, cross-mode partial restore chains, and save/load
      roundtrips
    - no solver, catalog, selector, or store behavior changed
  - targeted validation:
    - workbench generated history grid: `1` file, `3` tests, green
    - workbench generated matrix/edit-history/history-grid pack: `3` files, `5`
      tests, green
    - engine generated matrix: `1` file, `1` test, green
    - engine typecheck: green
    - stable full engine suite: `93` files, `757` tests, green
    - repository build: green
- the second-wall-family seeded cross-mode expansion is now also closed:
  - slice id: `mixed_seeded_cross_mode_wall_family_expansion_v1`
  - this was a route-history regression-net expansion, not a solver widening:
    - added a concrete-wall detour beside the existing deep-hybrid wall detour in
      the representative mixed torture save/load chain
    - the new detour splits/reorders rockwool and concrete layers, changes the
      lining board, saves the scenario, and checks reload parity at the
      saved-scenario retention boundary
    - the seeded cross-mode matrix now alternates floor-family detours with two
      distinct wall-family edit histories
    - no solver, catalog, selector, or store behavior changed
  - targeted validation:
    - workbench mixed torture file: `1` file, `3` tests, green
    - workbench mixed/generated plus seeded edit-stability pack: `6` files, `10`
      tests, green
    - engine mixed pack: `2` files, `2` tests, green
    - engine typecheck: green
    - stable full engine suite: `93` files, `757` tests, green
    - repository build: green

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
  - historical next selected slice at that checkpoint was `tuas_deferred_shortlist_drawing_audit_v1`
    - the immediate gain then was source-led corridor ranking on the still-deferred TUAS shortlist, not another adjacent raw or open-web parity slice

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

- slice id: `dataholz_clt_source_truth_audit_v1`
- workstream: `B` family-specific source-truth guard before widening
- status: `closed`
- landed scope:
  - added an engine Dataholz CLT source-truth audit covering all `9` imported
    rows
  - pinned catalog numeric truth, official-id field continuations, visible
    raw/tagged route posture, contiguous split stability, and disjoint-role
    fallback behavior
  - added workbench output-card coverage for exact dry CLT and the
    `GDMTXA04A` estimate-routed boundary
- explicit non-landed scope:
  - no solver behavior change
  - no catalog row import
  - no `GDMTXA04A` manual visible exact reopen
  - no generic raw CLT or timber widening
- validation:
  - pre-edit engine raw/corpus baseline: `4` files, `11` tests, green
  - post-edit engine source/raw pack: `5` files, `16` tests, green
  - post-edit workbench route/raw pack: `4` files, `7` tests, green
  - engine typecheck: green
  - web typecheck: green with the known Next.js TypeScript plugin recommendation
  - full engine suite: `97` files, `785` tests, green

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
- historical next selected slice at that checkpoint was a source-led TUAS shortlist audit:
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
  - the `dataholz_clt_source_truth_audit_v1` guard now pins this boundary on
    both engine and workbench route/card surfaces
- UBIQ visible-code drift is now frozen as documentation truth:
  - do not reopen it as a runtime rename prompt unless a future slice deliberately changes user-facing provenance semantics
  - do not use it as a backdoor reason to widen into the weaker band

Next recommended move:

- keep the closed `dataholz_clt_source_truth_audit_v1` validation checkpoint
  frozen
- keep `raw_concrete_helper_permutation_answer_guard_v1` frozen as the latest
  no-widening answer guard before any wider family or selector work
- result of the frozen floor guard:
  - local implementation review showed the raw concrete helper signal is already
    narrow: raw visible input only, inferred terminal `concrete`
    `base_structure`, ceiling-side-only board/cavity/fill roles, and at least
    one board plus one helper
  - the new engine guard now pins numeric answer snapshots for wider helper
    permutations and adjacent top-finish / wall-like / steel-joist negatives
  - the new workbench guard mirrors the same representative shapes on output
    card status and values
  - no solver behavior was widened, no new family was reopened, and
    `GDMTXA04A` remains estimate-only
- implemented move after the guard-set checkpoint:
  - `wall_selector_wider_trace_matrix_v1`
  - stayed no-widening trace/research, not selector behavior change
  - proved settled wall families, the current
    `double_leaf <-> lined_massive_wall` hold, non-AAC heavy-core controls, and
    a strong framed route on engine plus workbench card surfaces
  - no behavior bug was exposed, so CLT-local combined evidence and true
    raw-floor behavior widening remain deferred until candidates are re-ranked
    again
- classify any new failure before changing implementation:
  - solver drift
  - support-bucket or output-card drift
  - stale fixture expectation
  - intentionally unsupported/fail-closed behavior
- the old `tuas_deferred_shortlist_drawing_audit_v1` recommendation is closed:
  - the shortlist was reduced into explicit mixed-schedule and hybrid
    lower-treatment groups
  - the subsequent TUAS support-surface, `R6a`, `R10a`, hybrid open-box, CLT
    source-truth, and source-backed fallback guard slices have now closed the
    currently defended branch set
  - do not treat the corrected CLT direct-fixed screening contract as a reason
    to open a broader family lane
