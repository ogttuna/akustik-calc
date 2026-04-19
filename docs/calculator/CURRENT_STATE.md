# Dynamic Calculator Current State

Document role:

- primary short snapshot for the current dynamic calculator and workbench posture
- read this before historical analysis or older checkpoint notes
- for the current checkpoint, also read:
  - [CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md)
- for the authoritative next step, read:
  - [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
- for end-to-end product flow and file boundaries, read:
  - [SYSTEM_MAP.md](./SYSTEM_MAP.md)
- for answer-origin / source-vs-formula questions, read:
  - [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- for source-backed widening posture, read:
  - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## Scope

- floor and wall dynamic-calculator behavior
- workbench-side layer normalization and operator flow
- result stability under duplicate/split/reorder/save-load/history misuse
- executable evidence for source/formula/support/origin honesty

## Revalidated Snapshot

Last full engine revalidation: `2026-04-19`

Last full web revalidation: `2026-04-19`

Last cross-package build revalidation: `2026-04-19`

Planning / implementation update: `2026-04-19`

## Operator Snapshot

- active slice:
  `blocked_source_backed_widening_rerank_refresh_v2`
- current broad-pass conclusion:
  the mixed seeded floor/wall evidence pass is now closed cleanly, and all
  four blocked source-backed runtime candidates still remain explicit holds
- immediate next decision:
  rerank the explicit blocked source-backed runtime candidates again after the
  mixed seeded-chain closeout instead of reopening any one candidate by
  inertia
- first implementation question now:
  whether any fresh classified runtime red actually emerged from the mixed
  seeded closeout, or whether the blocked candidate order should remain intact
- current explicit blocked candidate order:
  1. `dataholz_gdmtxa04a_visible_exact_reopen`
  2. `tuas_c11c_exact_import`
  3. `raw_bare_open_box_open_web_impact_widening`
  4. `wall_selector_behavior_widening`
- do not do first:
  - direct blocked-family reopening
  - blocked source-family widening
  - another broad generated family grid without a fresh classified red

- latest slice closeout selection on `2026-04-19`:
  - landed
    `packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts`
  - closed `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
  - selected `blocked_source_backed_widening_rerank_refresh_v2` as the next
    honest no-runtime slice because the mixed seeded closeout produced no
    fresh classified runtime red
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening blocked after the closeout
  - added the new closeout selection contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `11/11` files
    and `31/31` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest broad validation pass on `2026-04-19`:
  - reran `pnpm check` after the mixed seeded-chain closeout selection wiring
    and doc refresh
  - full engine suite: `160/160` test files passed, `961/961` tests passed
  - full web suite: `118/118` test files passed, `676/676` tests passed
  - reran `pnpm build`: green with the known optional `sharp/@img` DOCX
    warnings
  - the full green pass confirmed the new mixed seeded closeout contract and
    selected requested-output descriptor contract without reopening any blocked
    runtime candidate

- earlier active-slice mixed floor/wall seeded-chain progress on `2026-04-19`:
  - split the requested-output partial-restore descriptor branch so broad and
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
  - next narrow task inside the slice was closeout selection, not more replay
    widening

- earlier active-slice mixed floor/wall seeded-chain progress on `2026-04-19`:
  - widened the selected web duplicate/swap replay family from a single
    global reverse toggle to explicit per-plan reverse-mask variants on the
    defended seeded boundary routes
  - aligned the selected generated-history grid and selected output-card
    partial-restore helper so save-load replay can reverse individual split
    plans while broad and representative requested-output grids stay on their
    compact contract
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `4/4` files and `23/23` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
  - next narrow task inside the slice is the remaining selected
    requested-output replay runner loop, not a blocked runtime candidate

- earlier active-slice mixed floor/wall seeded-chain landing on `2026-04-19`:
  - widened the selected seeded edit-history replay set from the prior
    direct-only quartet to an eight-variant selected-only family that now
    includes reversed split-order chains
  - kept broad and representative requested-output edit-history surfaces on
    their previous direct-only contract so the active slice stays selected-
    route scoped
  - aligned the selected generated edit-history helper and the selected
    requested-output output-card helper so reversed hostile replay collapses
    back onto the canonical direct-final row order before scenario and
    save-load assertions
  - widened selected engine duplicate/swap pressure from complementary
    direct-plus-single/all reversal coverage to exhaustive reverse-mask
    combinations on the defended seeded boundary routes
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `4/4` files and `23/23` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest active-slice CLT calibration closeout on `2026-04-17`:
  - landed `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - kept the visible `GDMTXA04A`-like composite dry-screed boundary on the
    defended estimate route with candidate `dataholz_gdmtxa01a_clt_lab_2026`
  - capped lab-side `Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI` against the
    direct official exact row so the route no longer drifts optimistically on
    those outputs
  - moved the visible field-side `L'nT,50` path onto the standardized
    `CI,50-2500` companion instead of the weaker local-guide fallback
  - kept direct `GDMTXA04A` exact reopen blocked
- latest active-slice CLT calibration validation on `2026-04-17`:
  - targeted CLT engine pack: `5/5` test files passed, `17/17` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `155/155` files and `949/949` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest blocked-source rerank order update on `2026-04-17`:
  - refreshed the explicit blocked order to:
    `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector
  - kept `blocked_source_backed_widening_rerank_v1` selected without opening a
    runtime candidate yet
  - kept all four candidates fail-closed while landing the order in the
    executable rerank contract
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
  - kept rank-1 `GDMTXA04A` blocked after an explicit feasibility audit
    because visible exact reopening still requires honest composite dry-screed
    surface modeling
  - advanced the active rerank comparison target to `tuas_c11c_exact_import`
    without changing runtime behavior or the blocked candidate order
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
  - kept rank-2 `C11c` blocked after an explicit feasibility audit because the
    combined wet tuple remains anomalous and the visible route still stays
    impact-fail-closed
  - advanced the active rerank comparison target to raw bare
    open-box/open-web without changing runtime behavior or the blocked
    candidate order
  - targeted rerank engine pack: `5/5` test files passed, `15/15` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `33/33` tests plus focused web `3/3` files and `9/9` tests
  - `pnpm check`: green with full engine `157/157` files and `953/953` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest broad audit and replanning pass on `2026-04-17`:
  - reran the focused gate, full repo gate, and build after the rank-2
    `C11c` feasibility hold landed
  - found no new runtime mismatch between implementation and the living rerank
    docs
  - confirmed that the active next move is the rank-3 raw bare
    open-box/open-web feasibility audit, not a direct widening pass
  - full engine suite: `157/157` test files passed, `953/953` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `10/10` test files passed, `33/33` tests passed
  - focused web gate: `3/3` test files passed, `9/9` tests passed
  - `git diff --check`: green
- latest blocked-source rank-3 progress update on `2026-04-18`:
  - landed
    `packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts`
  - kept rank-3 raw bare open-box/open-web blocked after an explicit
    feasibility audit because current TUAS and UBIQ rows still prove packaged
    systems rather than true bare-carrier impact behavior
  - advanced the active rerank comparison target to
    `wall_selector_behavior_widening` without changing runtime behavior or the
    blocked candidate order
  - targeted rerank engine pack: `6/6` test files passed, `18/18` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `11/11` files
    and `35/35` tests plus focused web `3/3` files and `9/9` tests
  - `git diff --check`: green
- latest blocked-source rank-4 progress update on `2026-04-18`:
  - landed
    `packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts`
  - kept rank-4 `wall_selector_behavior_widening` blocked after an explicit
    feasibility audit because the current wall trace/card guard is already
    closed and no fresh classified wall red exists
  - exhausted the comparison queue inside
    `blocked_source_backed_widening_rerank_v1` without changing runtime
    behavior, so the next honest move is rerank closeout selection instead of
    another feasibility pass
  - targeted rerank engine pack: `7/7` test files passed, `20/20` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `12/12` files
    and `37/37` tests plus focused web `3/3` files and `9/9` tests
  - `git diff --check`: green
- latest blocked-source rerank closeout selection on `2026-04-18`:
  - closed `blocked_source_backed_widening_rerank_v1`
  - selected `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2` as the
    next honest no-runtime slice
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening blocked after their explicit feasibility audits
  - reused the defended seeded mixed floor/wall boundary-route family instead
    of inventing a new runtime urgency after the rerank exhausted its
    candidate queue
  - targeted closeout engine pack: `10/10` test files passed, `28/28` tests
    passed
  - targeted closeout web pack: `4/4` test files passed, `23/23` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest broad validation stability pass on `2026-04-18`:
  - narrowed the only broad-gate failure to two throughput-only web
    deep-hybrid swap timeouts
  - widened
    `apps/web/features/workbench/dynamic-route-deep-hybrid-test-helpers.ts`
    swap timeout headroom from `90_000` to `150_000`
  - kept calculator/runtime behavior unchanged
  - full engine suite: `160/160` test files passed, `960/960` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `10/10` test files passed, `28/28` tests passed
  - focused web gate: `4/4` test files passed, `23/23` tests passed
  - `pnpm typecheck`: green
  - `pnpm lint`: green
  - `pnpm check`: green
  - `pnpm calculator:gate:current`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green

- latest live verification after the runtime candidate rerank closeout:
  - full engine suite: `160/160` test files passed, `960/960` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `10/10` test files passed, `28/28` tests passed
  - focused web gate: `4/4` test files passed, `23/23` tests passed
  - `pnpm typecheck`: green
  - `pnpm lint`: green
  - `pnpm check`: green
  - `pnpm calculator:gate:current`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest no-runtime closeout on `2026-04-16`:
  - closed `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
  - selected `heavy_concrete_formula_family_widening_v1` as the next honest
    widening direction
  - kept `dataholz_clt_calibration_tightening` as the held second candidate
  - kept raw bare open-box/open-web, `GDMTXA04A`, `C11c`, and wall-selector
    widening blocked
  - no runtime or numeric calculator behavior changed
- latest active-slice progress on `2026-04-16`:
  - kept the selected slice on `heavy_concrete_formula_family_widening_v1`
  - landed the explicit predictor-input separator-retention fix for reinforced
    concrete combined wet packages
  - widened the defended reinforced-concrete wet ceramic-tile + elastic-ceiling
    predictor corridor onto the published heavy-concrete upper-treatment lane
  - widened the defended reinforced-concrete wet ceramic-tile + rigid gypsum
    ceiling predictor corridor onto the published heavy-concrete
    upper-treatment lane without widening into firestop-board variants
  - restored visible-stack parity for the same gypsum-board wet concrete
    ceiling corridors by accepting the derived `generic_gypsum_board` token on
    the same defended heavy-concrete lane while keeping DeltaLw on the
    visible-stack formula companion
  - restored explicit predictor parity for reinforced-concrete firestop-board
    archetype inputs by treating the `fire_board` alias as the same bounded
    corridor token instead of letting those cases fall back to the bare-slab
    formula route
  - restored split-cover parity for reinforced-concrete timber-underlay
    archetype inputs by keeping `engineered_timber_flooring` plus a generic
    resilient underlay on the same bounded Knauf timber-underlay corridor
    instead of letting those cases collapse to the bare-slab formula lane
  - completed the final explicit carpet-plus-generic-underlay probe and pinned
    it as a negative guard:
    canonical carpet still stays on the bounded Knauf carpet archetype lane,
    while carpet plus an extra generic underlay remains formula-owned on the
    impact side and keeps only the heavy-concrete airborne companion estimate
  - kept the concrete vinyl + elastic-ceiling branch on the low-confidence
    posture
- latest focused active-slice revalidation on `2026-04-17`:
  - targeted heavy-concrete engine pack: `4/4` test files passed,
    `312/312` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest final-probe guard validation on `2026-04-17`:
  - targeted concrete closeout/benchmark/regression pack: `3/3` test files
    passed, `114/114` tests passed
  - `pnpm calculator:gate:current`: green with `4/4` test files passed and
    `15/15` tests passed in the focused engine/web gate
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest parity-audit conclusion on `2026-04-17`:
  - no seventh defended parity-widening step is currently proven
  - already-landed gypsum, `fire_board`, and split timber-underlay parity
    fixes remain the full defended set
  - split carpet/soft-cover plus generic-underlay concrete inputs were
    explicitly rechecked and remain unproven because current runtime
    canonicalization does not show that they are the same physical system as
    the bounded carpet archetype lane
  - final explicit carpet-plus-generic-underlay probe now confirms the same
    boundary in executable tests:
    canonical carpet stays on the bounded Knauf carpet archetype lane, while
    carpet plus extra generic underlay falls back to bare-floor impact formula
    ownership and only keeps the heavy-concrete airborne companion estimate
  - unless a new already-proven equivalent representation appears, the
    heavy-concrete parity queue stays closed
- latest closeout-audit progress on `2026-04-17`:
  - landed `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - the active concrete corridor now has a central executable ownership matrix
    for:
    - bare formula-only reinforced concrete
    - floating-floor formula-only reinforced concrete
    - published heavy-concrete family-general lanes with Annex C DeltaLw
      companions
    - family-archetype lanes that intentionally keep `DeltaLw` unsupported
    - the reinforced-concrete `vinyl + elastic ceiling` low-confidence branch
- latest slice closeout selection on `2026-04-17`:
  - closed `heavy_concrete_formula_family_widening_v1`
  - selected `reinforced_concrete_accuracy_tightening_follow_up_v1` as the next
    honest move
  - kept `dataholz_clt_calibration_tightening` as the held second candidate
  - kept the heavy-concrete parity queue closed unless a new proof-backed
    equivalence appears
  - kept raw bare open-box/open-web, `GDMTXA04A`, `C11c`, and wall-selector
    widening blocked
  - no runtime or numeric calculator behavior changed in the selection closeout
- latest slice closeout selection validation on `2026-04-17`:
  - focused engine gate: `5/5` test files passed, `23/23` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green
  - full engine suite: `148/148` test files passed, `930/930` tests passed
  - full web suite: `113/113` test files passed, `655/655` tests passed
  - `pnpm check`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest visible-stack continuity guard validation on `2026-04-17`:
  - targeted reinforced-concrete visible continuity pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `3/3` web files and `7/7` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest high-visibility low-confidence lane-label validation on `2026-04-17`:
  - targeted reinforced-concrete low-confidence panel pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `6/6` web files and `13/13` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest proposal/diagnostics honesty validation on `2026-04-17`:
  - targeted reinforced-concrete proposal honesty pack: `1/1` test file
    passed, `2/2` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `15/15` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest source-lineage honesty validation on `2026-04-17`:
  - targeted reinforced-concrete lineage/provenance pack: `3/3` test files
    passed, `8/8` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest nearby-row carry-through validation on `2026-04-17`:
  - targeted reinforced-concrete nearby-row honesty pack: `3/3` test files
    passed, `10/10` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest nearby-row ranking-label validation on `2026-04-17`:
  - targeted reinforced-concrete nearby-row ranking pack: `2/2` test files
    passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest same-ceiling candidate-order validation on `2026-04-17`:
  - targeted reinforced-concrete order-regression pack: `8/8` test files
    passed, `20/20` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest same-ceiling score-rationale validation on `2026-04-17`:
  - targeted reinforced-concrete ranking-helper pack: `1/1` test file
    passed, `4/4` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest solver-side overlap-removal progress on `2026-04-17`:
  - removed the dormant direct published-family helper overlap for the
    reinforced-concrete combined `vinyl + elastic ceiling` corridor
  - active solver routing and direct family-helper behavior now agree that the
    corridor remains intentionally `low_confidence`
  - targeted engine overlap pack: `4/4` test files passed, `35/35` tests
    passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `34/34` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm check`: green with full engine `152/152` files and `942/942` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest reinforced-concrete closeout selection on `2026-04-17`:
  - closed `reinforced_concrete_accuracy_tightening_follow_up_v1`
  - selected `dataholz_clt_calibration_tightening` as the next honest move
  - kept `GDMTXA04A`, raw bare open-box/open-web, `C11c`, and wall-selector
    widening blocked
  - kept reinforced-concrete reopening conditional on fresh proof instead of
    letting the low-confidence corridor drift back into the active queue
- latest reinforced-concrete closeout validation on `2026-04-17`:
  - focused engine gate: `5/5` test files passed, `23/23` tests passed
  - focused web gate: `2/2` test files passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `153/153` files and `945/945` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest Dataholz CLT closeout selection on `2026-04-17`:
  - closed `dataholz_clt_calibration_tightening`
  - selected `blocked_source_backed_widening_rerank_v1` as the next honest
    move
  - kept direct `GDMTXA04A`, raw bare open-box/open-web, `C11c`, and
    wall-selector widening blocked during the selection step
  - kept reinforced-concrete reopening conditional on fresh proof
- latest Dataholz CLT closeout validation on `2026-04-17`:
  - focused engine gate: `8/8` test files passed, `50/50` tests passed
  - focused web gate: `3/3` test files passed, `9/9` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `155/155` files and `949/949` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest nearby-row ranking-rationale surface validation on `2026-04-17`:
  - targeted reinforced-concrete rationale pack: `3/3` test files
    passed, `9/9` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest solver-side low-confidence note-honesty validation on `2026-04-17`:
  - targeted reinforced-concrete note-honesty pack: `3/3` test files
    passed, `17/17` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest support-note rationale carry-through validation on `2026-04-17`:
  - targeted reinforced-concrete support-note pack: `5/5` test files
    passed, `314/314` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest evidence-ranked-row carry-through validation on `2026-04-17`:
  - targeted reinforced-concrete evidence/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest evidence-citation-prioritization validation on `2026-04-17`:
  - targeted reinforced-concrete evidence/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest screening-package wording validation on `2026-04-17`:
  - targeted reinforced-concrete proposal/dossier pack: `2/2` test files
    passed, `4/4` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest consultant-trail screening validation on `2026-04-17`:
  - targeted reinforced-concrete consultant/proposal trail pack: `2/2` test
    files passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest proposal-recommendation screening validation on `2026-04-17`:
  - targeted reinforced-concrete proposal brief pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest consultant-emphasis screening validation on `2026-04-17`:
  - targeted reinforced-concrete consultant/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest proposal-summary screening validation on `2026-04-17`:
  - targeted reinforced-concrete proposal summary pack: `3/3` test files
    passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest diagnostics-screening posture validation on `2026-04-17`:
  - targeted reinforced-concrete diagnostics/proposal pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest broad repo revalidation on `2026-04-17`:
  - `pnpm check`: green
  - full engine suite: `154/154` test files passed, `946/946` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - `pnpm calculator:gate:current`: green with `6/6` engine files and
    `24/24` engine tests plus `4/4` web files and `12/12` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
  - repo-wide validation surfaced one stale CLT workbench posture contract; it
    was aligned to the new visible-boundary calibration values without changing
    the intended CLT ownership posture

## Current Answer In One Screen

- latest closed implementation slice:
  `dataholz_clt_calibration_tightening`
- latest closed planning action:
  `post_dataholz_clt_calibration_tightening_next_slice_selection_v1`
- current active next slice:
  `blocked_source_backed_widening_rerank_v1`
- current rule:
  the requested-output harness chain stays frozen; the defended CLT
  calibration pass is closed, and the next move is blocked-source rerank
  selection, not another solver-side micro-pass
- current explicit not-done item:
  the blocked-source rerank pass is open; raw bare open-box/open-web,
  `GDMTXA04A`, `C11c`, and wall-selector widening still need an explicit fresh
  priority order before any one of them becomes the next active runtime slice

## Current Hotspot Map

- selected rerank anchors:
  - `packages/engine/src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts`
  - `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - `packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts`
  - `packages/engine/src/remaining-source-gap-posture-matrix.test.ts`
- closed CLT evidence:
  - `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts`
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- closed reinforced-concrete guard evidence:
  - `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts`
- focused checkpoint gate:
  `tools/dev/run-calculator-current-gate.ts`
- source-backed rerank ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

## Harness Hard Stop

The requested-output output-card harness refactor chain is now complete enough.

Rule from this point:

- do not create another requested-output harness-only micro-slice
- only reopen that harness if the selected blocked-source rerank exposes a new
  mixed-route red that cannot be localized otherwise

## Immediate Candidate Posture

- `blocked_source_backed_widening_rerank_v1`
  - selected now

- `dataholz_clt_calibration_tightening`
  - closed and guarded, not selected

Still blocked:

- rank 1:
  Dataholz `GDMTXA04A` visible exact reopen
- rank 2:
  TUAS `C11c` exact import
- rank 3:
  raw bare open-box/open-web impact widening
- rank 4:
  wall-selector behavior widening without a fresh classified red

## Current Next Steps

1. Keep the requested-output harness frozen at the current green baseline.
2. Keep the heavy-concrete widening closed.
   The final carpet-plus-generic-underlay probe is now a negative guard, and
   the parity queue should stay shut unless a new proof-backed equivalence
   appears later.
3. Open `blocked_source_backed_widening_rerank_v1`.
   Entry posture:
   the defended CLT corridor is now closed, so the next honest move is a
   no-runtime rerank of the still-blocked source-backed widening candidates.
   Current order:
   `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector.
4. Treat the current blocked boundaries as hard stops, not “later in the same
   pass” items.
   Do not reopen raw open-box/open-web, `GDMTXA04A`, `C11c`, reinforced-
   concrete, or wall-selector work without the rerank selecting them first.
5. Keep the closed reinforced-concrete low-confidence corridor as a guard, not
   as a reopened target.
6. Do not blur blocked source-anomaly candidates into the rerank or treat them
   as implicitly reopened.

## Priority Order From Here

This is the ROI-ranked order, not just the chronological queue.

1. `blocked_source_backed_widening_rerank_v1`.
   The defended CLT corridor is now explicitly closed, so the best next return
   is to re-rank the blocked source-backed candidates before opening another
   runtime slice.
   Current order:
   `GDMTXA04A` first, `C11c` second, raw bare open-box/open-web third,
   wall-selector fourth.
2. The single runtime candidate selected by that rerank.
3. Reopen reinforced-concrete or `GDMTXA04A` only if a new proof-backed
   equivalence or material-surface rule appears.
