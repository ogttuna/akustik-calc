# Next Implementation Plan

Last reviewed: 2026-04-19

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
- [CHECKPOINT_2026-04-18_BLOCKED_SOURCE_RERANK_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-18_BLOCKED_SOURCE_RERANK_CLOSEOUT_HANDOFF.md)
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
  `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
- current highest-ROI task:
  close `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2` with an
  explicit next-slice selection contract now that the selected
  requested-output/save-load replay chain matches the engine-side
  reverse-mask coverage
- selected next slice posture:
  all four blocked source-backed runtime candidates are now explicit holds, so
  the highest-ROI next move is a no-runtime shared torture-pass follow-up
- selected route family:
  `mixed_floor_wall_seeded_boundary_routes`
- selected output surface:
  `workbench_saved_scenario_replay_and_output_cards`
- selected scope:
  - landed: broader selected seeded edit-history families beyond the current
    second wall-family expansion
  - landed: wider selected duplicate-swap pressure beyond the current
    complementary generated history-grid variants
  - landed: matching selected requested-output replay pressure beyond the
    compact requested-output runner loop
  - active: closeout readiness and next-slice selection
  - landed for selected edit-history replay: saved-scenario replay and
    output-card projection parity after longer cross-mode chains
- blocked runtime candidate posture stays explicit:
  1. `dataholz_gdmtxa04a_visible_exact_reopen`
  2. `tuas_c11c_exact_import`
  3. `raw_bare_open_box_open_web_impact_widening`
  4. `wall_selector_behavior_widening`

### Next

1. Keep `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
   behavior explicit blocked holds while this follow-up stays active.
2. Keep the widened selected edit-history replay set on the selected boundary
   routes; do not leak that broader replay contract back into broad or
   representative requested-output surfaces.
3. Keep the selected requested-output replay surfaces on the same seeded
   boundary routes on their new reverse-mask branch while broad and
   representative requested-output surfaces stay on the compact branch.
4. If the follow-up exposes a fresh classified runtime red, classify it before
   any widening proposal; do not reopen a blocked source-backed candidate by
   proximity alone.
5. Close `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2` with an
   explicit next-slice selection contract instead of auto-falling back to a
   blocked runtime candidate.

### Later

1. a fresh runtime-candidate selection pass only if this shared follow-up
   exposes a classified red worth reopening
2. otherwise keep all current blocked source-backed candidates fail-closed

### Explicit Non-Goals Right Now

- do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web, or
  wall-selector behavior from nearby green tests alone
- do not create another broad mixed generated family grid just because the
  shared torture pass is active
- do not reopen heavy-concrete parity widening or another CLT tightening
  micro-pass while the seeded mixed follow-up is active

## Verified Against Implementation - 2026-04-19

- earlier active-slice mixed floor/wall seeded-chain landing on `2026-04-19`:
  - split the requested-output partial-restore branch so broad and
    representative requested-output surfaces keep the compact replay variants
    while the selected seeded requested-output surfaces carry the explicit
    reverse-mask variants
  - landed
    `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts`
    and added it to the focused current gate so the branch split stays pinned
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
- earlier active-slice mixed floor/wall seeded-chain landing on `2026-04-19`:
  - widened the selected web duplicate/swap replay family from a single
    global reverse toggle to explicit per-plan reverse-mask variants on the
    defended seeded boundary routes
  - aligned
    `apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts`
    and
    `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-test-helpers.ts`
    so partial-restore and save-load replay can reverse individual split plans
    without leaking that broader contract into the compact broad replay lanes
  - kept broad and representative requested-output/output-card replay on the
    compact direct-vs-global-reverse contract while the selected seeded lane
    adopted per-plan reverse masks
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `4/4` files and `23/23` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
- latest active-slice mixed floor/wall seeded-chain progress on `2026-04-19`:
  - widened
    `apps/web/features/workbench/mixed-study-mode-generated-test-helpers.ts`
    selected edit-history variants from the prior direct-only quartet to an
    eight-variant selected-only replay set with reversed split-order chains
  - kept broad and representative requested-output edit-history descriptors on
    their previous direct-only contract while the selected requested-output
    lane adopted the broader selected replay set
  - normalized the selected generated edit-history helper and the selected
    requested-output output-card helper so reversed hostile replay still
    collapses onto the canonical direct-final row order before snapshot and
    save-load assertions
  - widened
    `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
    selected duplicate/swap reverse-mask pressure from the prior
    direct-plus-single/all-reversal coverage to exhaustive reverse-mask
    combinations on the defended seeded boundary routes
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `4/4` files and `23/23` tests
  - repo build inside the focused gate: green with the known optional
    `sharp/@img` DOCX warnings
  - `git diff --check`: green

- latest blocked-source rerank closeout selection on `2026-04-18`:
  - landed
    `packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts`
  - closed `blocked_source_backed_widening_rerank_v1` after all four ranked
    runtime candidates stayed explicitly blocked
  - selected `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2` as the
    next honest no-runtime slice on the shared seeded floor/wall boundary
    routes
  - updated the focused gate to pair the rerank closeout contract with the
    existing mixed floor/wall seeded-chain engine/web anchors
  - targeted closeout engine pack: `10/10` test files passed, `28/28` tests
    passed
  - targeted closeout web pack: `4/4` test files passed, `23/23` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `160/160` files and `960/960` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest broad validation stability pass on `2026-04-18`:
  - isolated the broad-gate failure to two throughput-only web deep-hybrid
    swap timeouts, not a runtime regression
  - widened
    `apps/web/features/workbench/dynamic-route-deep-hybrid-test-helpers.ts`
    swap timeout headroom from `90_000` to `150_000`
  - kept calculator/runtime behavior unchanged
  - confirmed the focused gate stayed green with engine `10/10` files and
    `28/28` tests plus web `4/4` files and `23/23` tests
  - reran `pnpm check`: green with full engine `160/160` files and `960/960`
    tests plus full web `117/117` files and `674/674` tests
  - reran `pnpm build`: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest active-slice CLT calibration closeout on `2026-04-17`:
  - landed `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - the visible `GDMTXA04A`-like composite dry-screed boundary stays
    estimate-only with candidate `dataholz_gdmtxa01a_clt_lab_2026`
  - lab-side impact outputs are now capped against the direct official exact
    row on `Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI`
  - the visible field-side boundary now uses the standardized
    `L'nT,50` companion path instead of the weaker local-guide fallback
  - the direct `GDMTXA04A` exact reopen stays blocked as a material-surface
    decision
- latest CLT closeout validation on `2026-04-17`:
  - targeted CLT engine pack: `5/5` test files passed, `17/17` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `155/155` files and `949/949` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest blocked-source rerank order update on `2026-04-17`:
  - refreshed the explicit no-runtime candidate order to:
    `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector
  - kept the selected slice on `blocked_source_backed_widening_rerank_v1`
    without selecting a runtime widening yet
  - kept every blocked family fail-closed while making the order executable in
    `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - targeted rerank engine pack: `6/6` test files passed, `23/23` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `8/8` files and
    `29/29` tests plus focused web `3/3` files and `9/9` tests
  - `pnpm check`: green with full engine `155/155` files and `949/949` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest blocked-source rerank progress update on `2026-04-17`:
  - landed
    `packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts`
  - froze rank-1 `GDMTXA04A` as still blocked after an explicit feasibility
    audit instead of letting the rerank drift toward a silent exact reopen
  - advanced the rerank comparison target to `tuas_c11c_exact_import` without
    changing runtime behavior or the blocked candidate order
  - targeted rerank engine pack: `4/4` test files passed, `10/10` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `9/9` files and
    `31/31` tests plus focused web `3/3` files and `9/9` tests
  - `pnpm check`: green with full engine `156/156` files and `951/951` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest blocked-source rank-2 progress update on `2026-04-17`:
  - landed
    `packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts`
  - froze rank-2 `C11c` as still blocked after an explicit feasibility audit
    because its combined wet tuple remains anomalous and cannot be imported
    honestly
  - advanced the rerank comparison target to
    `raw_bare_open_box_open_web_impact_widening` without changing runtime
    behavior or the blocked candidate order
  - targeted rerank engine pack: `5/5` test files passed, `15/15` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `33/33` tests plus focused web `3/3` files and `9/9` tests
  - `pnpm check`: green with full engine `157/157` files and `953/953` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest broad audit and replanning pass on `2026-04-17`:
  - reran `pnpm calculator:gate:current`, `pnpm check`, and `pnpm build`
  - found no hidden runtime regressions beyond the already-landed rank-2
    `C11c` feasibility hold
  - revalidated that the active rerank order still matches implementation and
    that the honest first move is the rank-3 raw bare open-box/open-web
    feasibility audit rather than a direct widening
  - full engine suite: `157/157` test files passed, `953/953` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `10/10` test files passed, `33/33` tests passed
  - focused web gate: `3/3` test files passed, `9/9` tests passed
  - `git diff --check`: green
- latest blocked-source rank-3 progress update on `2026-04-18`:
  - landed
    `packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts`
  - froze rank-3 raw bare open-box/open-web as still blocked after an explicit
    feasibility audit because current TUAS and UBIQ rows remain packaged-system
    evidence, not true bare-carrier impact evidence
  - advanced the rerank comparison target to `wall_selector_behavior_widening`
    without changing runtime behavior or the blocked candidate order
  - targeted rerank engine pack: `6/6` test files passed, `18/18` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `11/11` files
    and `35/35` tests plus focused web `3/3` files and `9/9` tests
  - `git diff --check`: green
- latest blocked-source rank-4 progress update on `2026-04-18`:
  - landed
    `packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts`
  - kept rank-4 wall-selector behavior blocked after an explicit feasibility
    audit because the current wall trace/card guard is already closed and no
    fresh classified wall red exists
  - exhausted the comparison queue inside
    `blocked_source_backed_widening_rerank_v1` without changing runtime
    behavior, so the next honest move is rerank closeout selection
  - targeted rerank engine pack: `7/7` test files passed, `20/20` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `12/12` files
    and `37/37` tests plus focused web `3/3` files and `9/9` tests
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
  `CHECKPOINT_2026-04-17_DATAHOLZ_CLT_CALIBRATION_TIGHTENING_CLOSEOUT_HANDOFF.md`
- latest closed implementation slice:
  `dataholz_clt_calibration_tightening`
- closed planning action in this pass:
  `post_dataholz_clt_calibration_tightening_next_slice_selection_v1`
- selected next implementation slice:
  `blocked_source_backed_widening_rerank_v1`
- slice type:
  no-runtime ROI rerank over the still-blocked source-backed widening families
- implementation status:
  selected and not started; the defended CLT tightening is now closed, and the
  next honest move is to rerank the blocked candidates before selecting
  another runtime change
- explicit not-done item at this checkpoint:
  the blocked-source rerank is open; raw bare open-box/open-web,
  `GDMTXA04A`, `C11c`, and wall-selector widening still need an explicit fresh
  candidate order before any one of them becomes the next active runtime slice

## Selected Next Slice

- slice id:
  `blocked_source_backed_widening_rerank_v1`
- workstream:
  `no_runtime_candidate_selection`
- route family:
  `deferred_floor_source_gap_candidates`
- output surface:
  `blocked_source_backed_widening_rerank_matrix`
- engine companion surface:
  `source_gap_candidate_re_rank_contract`
- behavior class:
  no-runtime selection work before any blocked widening or exact reopen

### Scope

- re-rank the still-blocked source-backed widening families without changing
  runtime behavior
- preserve the defended CLT closeout and the closed reinforced-concrete guard
  posture while reranking candidates
- keep `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector work
  explicit as candidates rather than silently reopening them
- use this slice to decide the next honest runtime target, not to make the
  runtime change itself

### Closeout Selection Result

Selected now:

- `blocked_source_backed_widening_rerank_v1`
  - posture: selected after the defended CLT tightening closeout
  - reason: CLT no longer has a higher-ROI tightening slack, so the next
    honest move is explicit candidate selection work before another runtime
    widening or exact reopen

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
  `packages/engine/src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts`
- closed CLT evidence:
  - `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts`
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- selected rerank evidence:
  - `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - `packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts`
  - `packages/engine/src/remaining-source-gap-posture-matrix.test.ts`
  - `apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts`
  - `apps/web/features/workbench/output-origin-trace-card-matrix.test.ts`
- closed reinforced-concrete guard evidence:
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts`
- likely next decision anchors:
  - `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - `packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts`
  - `packages/engine/src/remaining-source-gap-posture-matrix.test.ts`
  - `docs/calculator/SOURCE_GAP_LEDGER.md`
- focused gate entrypoint:
  `tools/dev/run-calculator-current-gate.ts`
- source-backed boundary ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

### Current Rerank Audit Map

Use this map before touching runtime logic. It separates what is already
closed, what remains blocked, and what the rerank must compare explicitly
before any new runtime widening is selected.

1. Closed defended corridors
   - reinforced-concrete closeout stays frozen on the explicit
     `low_confidence` lane without a hidden family overlap
   - Dataholz CLT visible `GDMTXA04A`-like boundary stays estimate-only with
     exact-row caps on `Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI`
2. Selected no-runtime rerank candidates
   - rank 1:
     visible `GDMTXA04A` exact reopen
   - rank 2:
     TUAS `C11c` exact import
   - rank 3:
     raw bare open-box/open-web impact widening
   - rank 4:
     wall-selector behavior widening
3. Hard-stop rules during the rerank
   - do not reopen any candidate by runtime drift
   - do not treat nearby green tests as proof of a direct reopen
   - do not blur blocked, exact, bound, family, formula, or low-confidence
     ownership to make one candidate look cleaner than it is

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
   - keep the defended CLT closeout frozen as a solved corridor, not a live
     runtime target
   - treat the CLT evidence set as the baseline for rerank decisions, not as a
     reason to reopen the corridor
2. Blocked-family rerank audit
   - compare `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and
     wall-selector widening on ROI, current evidence strength, and fake-
     confidence blast radius
   - current order:
     `GDMTXA04A` first because it has the strongest direct source truth,
     `C11c` second because it has a real row but an unresolved anomaly,
     raw bare open-box/open-web third because current evidence is still
     packaged-only, wall-selector fourth because no fresh classified red
     exists
3. Workbench/source carry-through audit
   - ensure blocked-family route, support, and report surfaces stay explicit
     while the rerank is active

### Queue Status Right Now

1. Reinforced-concrete closeout queue
   - current status: closed
   - reopen only if a new helper-vs-solver overlap or proof-backed equivalent
     lane appears later
2. CLT tightening queue
   - current status: closed and guarded
   - the visible `GDMTXA04A`-like dry-screed estimate route now caps `Ln,w`,
     `CI`, `CI,50-2500`, and `Ln,w+CI` against the direct official exact row
   - the same visible route now uses the standardized `L'nT,50` companion path
   - direct `GDMTXA04A` exact reopening remains blocked
3. Blocked source-anomaly queue
   - current status: selected for rerank, not for runtime widening
   - current order:
     `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector
   - all four stay blocked until the rerank selects exactly one next runtime
     target

### Step Transition Rule

1. Start with the blocked candidate list, not with a runtime code change.
2. Compare one candidate only if all of the following are true:
   - its current blocked posture is already pinned in executable tests
   - its evidence/source gaps are explicit enough to be compared honestly
   - evaluating it does not silently reopen runtime behavior by inertia
3. If any one of those checks fails, keep the candidate blocked.
4. End the rerank only when exactly one next runtime target is selected or the
   whole blocked set is explicitly held.

### Execution Loop From Here

1. Refresh the current blocked candidate matrix locally and keep the current
   order explicit:
   `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector.
2. Reject any candidate that still depends on a blocked exact reopen, missing
   bare-carrier source evidence, or a fresh classified red that does not
   exist.
3. Add or update planning-contract and posture tests that describe the rerank
   decision explicitly.
4. Land the smallest no-runtime documentation/contract/gate change that keeps
   that decision executable.
5. Run the targeted rerank engine/web pack.
6. Run `pnpm calculator:gate:current`.
7. Update `NEXT_IMPLEMENTATION_PLAN.md` and `CURRENT_STATE.md` if the step
   lands.
8. Stop the slice when one next runtime candidate is explicitly selected and
   every non-selected candidate remains explicitly blocked.

### Validation Commands For This Checkpoint

1. `pnpm --filter @dynecho/engine exec vitest run src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts src/source-gap-candidate-re-rank-contract.test.ts src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts src/remaining-source-gap-posture-matrix.test.ts src/dataholz-gdmtxa04a-material-surface-recheck.test.ts src/floor-source-corpus-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/web exec vitest run features/workbench/dataholz-clt-source-truth-route.test.ts features/workbench/remaining-source-gap-posture-card-matrix.test.ts features/workbench/output-origin-trace-card-matrix.test.ts --maxWorkers=1`
3. `pnpm check`
4. `pnpm build`
5. `git diff --check`

### Slice Stop Conditions

- stop if the rerank quietly changes runtime behavior instead of only changing
  selection/docs/contracts
- stop if exact, catalog, product-delta, lower-bound, family, formula, or
  low-confidence ownership is blurred to make the result look cleaner
- stop if field/report/provenance surfaces become less explicit about answer
  origin
- stop if `GDMTXA04A`, `C11c`, raw bare open-box/open-web, or wall-selector
  behavior is implicitly reopened by the same change

## Explicitly Deferred Until This Rerank Closes

- direct raw bare open-box/open-web impact widening
- direct Dataholz `GDMTXA04A` visible exact reopen
- direct TUAS `C11c` exact import
- direct wall-selector behavior widening
- direct reinforced-concrete reopening

## Provisional Next Phase Order

This order is provisional and should be revalidated when the active slice
closes, but it is the current safest program sequence.

1. `reinforced_concrete_accuracy_tightening_follow_up_v1`
   - closed and guarded; do not reopen unless new proof appears
2. `dataholz_clt_calibration_tightening`
   - keep CLT as a tightening-first family, not a broadening-first family
   - only improve same-family deviation, monotonicity, and exact-vs-estimate
     discipline
3. `blocked_source_backed_widening_rerank_v1`
   - selected now as the highest-ROI no-runtime step after CLT closes
   - raw bare open-box/open-web, `GDMTXA04A`, `C11c`, and wall-selector work
     remain blocked until their existing evidence posture changes

## ROI-Ranked Order From Here

Use this order when choosing the next implementation action. The point is not
just “what is technically next”, but “what buys the most defended progress per
unit of risk and engineering time”.

1. `blocked_source_backed_widening_rerank_v1`
   - ROI: high
   - why:
     - the defended CLT corridor is now as tight as it can get without
       reopening blocked exact ownership
     - the next meaningful progress depends on explicitly reordering the still
       blocked families instead of guessing the next runtime change
   - currently includes:
     - rank 1: `GDMTXA04A`
     - rank 2: `C11c`
     - rank 3: raw bare open-box/open-web impact widening
     - rank 4: wall-selector widening
2. Directly open the single runtime candidate chosen by the rerank
   - ROI: conditional / next
   - why:
     - the rerank should produce exactly one defended next runtime target
     - no blocked candidate should be opened before that explicit comparison
3. Reopen reinforced-concrete or `GDMTXA04A` only if a new proof-backed
   equivalence appears
   - ROI: conditional / opportunistic
   - why:
     - both boundaries are now intentionally closed rather than forgotten
     - reopen them only if canonicalization, visible-stack derivation, or a
       source-backed material/topology rule changes

## Decision Gates From Here

This is the mechanical sequence from the current checkpoint.

1. Keep the defended CLT closeout frozen on its estimate-only `GDMTXA04A`
   boundary.
2. Open `blocked_source_backed_widening_rerank_v1`.
3. Compare raw bare open-box/open-web, `GDMTXA04A`, `C11c`, and wall-selector
   widening explicitly.
4. Select exactly one next runtime target only after the rerank lands.
5. Reopen reinforced-concrete or `GDMTXA04A` only if fresh proof appears.

## Immediate Next Steps

1. Keep this file as the authoritative immediate plan until the blocked-source
   rerank is actually closed.
2. Treat the requested-output harness chain as closed and frozen.
3. Keep the defended CLT calibration closeout frozen:
   the visible `GDMTXA04A`-like boundary stays estimate-only and capped on the
   official exact row companions.
4. Keep the heavy-concrete widening closed:
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
   start `blocked_source_backed_widening_rerank_v1` instead of reopening a
   closed CLT or reinforced-concrete micro-pass.
13. First rerank targets:
   raw bare open-box/open-web, visible `GDMTXA04A`, TUAS `C11c`, and
   wall-selector widening.
   Entry posture:
   reinforced-concrete and the defended CLT corridor are now solver-honest and
   repo-wide green, so the next honest move is explicit candidate selection
   work instead of another solver micro-pass.
   polishing.
14. Keep the blocked source-anomaly candidates explicit; do not silently blur
   `GDMTXA04A`, `C11c`, or raw bare-carrier widening into the selected CLT
   tightening.
