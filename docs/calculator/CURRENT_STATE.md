# Dynamic Calculator Current State

Document role:

- primary short snapshot for the current dynamic calculator and workbench posture
- read this before the execution plan or any archived analysis note
- for the latest UI handoff restart point, also read:
  - [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md)

## Scope

- floor and wall dynamic-calculator behavior
- workbench-side layer normalization and operator flow
- result stability under edit/reorder/localized numeric input

## Revalidated Snapshot

Last full revalidation: `2026-04-07`

Verified broad corridors:

- engine defended corridor: green
  - `22` files
  - `365` tests
- workbench defended corridor: green
  - `24` files
  - `294` tests
- latest repository build revalidation on `2026-04-08`: green
  - command: `pnpm build`
  - engine DTS blocker and web typecheck blocker are both closed
- latest change-adjacent revalidation after the raw-floor split/posture widening work: green
  - engine targeted/broad pack: `15` files, `227` tests
  - workbench targeted/broad pack: `14` files, `47` tests
- latest change-adjacent revalidation after the ceiling-board schedule normalization fix: green
  - engine targeted/broad pack: `8` files, `79` tests
  - workbench targeted/broad pack: `7` files, `26` tests
- latest change-adjacent revalidation after the neutral non-packable composite lower-board conservative-continuation fix: green
  - engine targeted/broad pack: `9` files, `76` tests
  - workbench targeted/broad pack: `7` files, `26` tests
- latest audit-surface revalidation after the packaged lower-board edit-path parity expansion: green
  - engine targeted pack: `4` files, `21` tests
  - workbench targeted pack: `4` files, `18` tests
- latest change-adjacent revalidation after the disjoint lower-board topology hardening: green
  - engine targeted/broad pack: `9` files, `243` tests
  - workbench targeted/broad pack: `6` files, `91` tests
- latest change-adjacent revalidation after the lower-helper topology hardening: green
  - engine targeted/broad pack: `8` files, `67` tests
  - workbench targeted/broad pack: `7` files, `94` tests
- latest audit-surface revalidation after the helper edit-path parity expansion: green
  - engine adjacent pack: `4` files, `46` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the generated edit-history matrix expansion: green
  - engine adjacent pack: `2` files, `2` tests
  - workbench targeted pack: `3` files, `4` tests
- latest mixed-surface revalidation after the wider generated duplicate/swap grid expansion: green
  - engine adjacent pack: `2` files, `2` tests
  - workbench targeted pack: `4` files, `5` tests
- latest mixed-surface revalidation after the longer cross-mode chain expansion: green
  - engine adjacent pack: `2` files, `2` tests
  - workbench targeted pack: `4` files, `6` tests
- latest change-adjacent revalidation after the exact floor-system companion split normalization and mixed concrete-exact breadth expansion: green
  - engine targeted/broad pack: `6` files, `16` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the exact steel breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the mounted timber exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the Dry RC exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the concrete dry exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the direct timber exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the deeper exact steel breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the measured open-box exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the lighter mounted timber exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the measured CLT exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the direct-lined dry timber exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the timber-frame exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the heavier measured CLT exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests

Interpretation:

- there is no active known solver blocker in the currently defended wall/floor corridors
- the latest red route tests were stale surface contracts, not a fresh calculator regression
- the latest raw-floor and mixed-surface widening work did not introduce a fresh wall-side or floor-side regression in the defended corridors
- the remaining risk is widening discipline and coverage depth, not a currently reproduced broad failure

## Current Stable Gains

- localized numeric input is normalized consistently across thickness, density, and dynamic stiffness parsing
- reset behavior no longer silently jumps between floor and wall presets
- the simple heavy-floor lane now has deterministic solver ordering for the narrow top-side package that was producing edit-path drift
- section preview and technical layer schedule now follow solver layers instead of raw visible row order
- the first deterministic complex-stack audit pack is now in place for:
  - wall mineral-wool contiguous splits
  - UBIQ open-web steel ceiling-fill contiguous splits on the field route
- the first direct dynamic duplicate / reorder reproduction matrix is now in place for the current wall-side instability cases documented under:
  - [../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md](../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md)
- the living wall-side remediation note is now the canonical design for fixing those instability cases without breaking framed and masonry benchmark corridors:
  - [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
- the cross-floor/wall remaining-work plan is now the canonical place for current open work, completion status, and the non-regressive next fix order:
  - [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
- the reinforced-concrete floor-carrier `Rw` support regression is now closed:
  - assembly-field concrete screening rows with real floor roles now keep `Rw` exposed again
  - the reopening is deliberately narrow: it now allows either visible floor-role evidence or the first defended raw concrete ceiling-helper inference cohort, plus an active impact-backed floor carrier
  - workbench `Rw` cards now also respect engine support buckets instead of surfacing unsupported floor-carrier companions
  - direct engine, route parity, and output-card consistency contracts now defend that fix
- representative floor output-card parity is now defended more broadly:
  - the workbench card model now fail-closes any explicitly unsupported requested output before reading live/bound values
  - representative preset matrices and raw floor/raw hybrid scenarios now assert that supported outputs never render as `unsupported/needs_input`, and unsupported outputs never render as `live/bound`
  - floor route parity is therefore no longer guarded only on `Rw`; it now has a broader representative support-bucket/card audit
- representative raw-floor screening posture is now defended explicitly on both engine and route layers:
  - raw concrete single-layer and upper-treatment rows keep the intended split between closed and reopened field-side `Rw`
  - raw concrete ceiling-side helper rows with a coherent inferred package now also reopen field-side `Rw`:
    - at least one inferred `ceiling_board`
    - plus at least one inferred `ceiling_cavity` or `ceiling_fill`
    - plus a concrete base carrier
  - raw open-box rows stay fail-closed on field-side `Rw`
  - that defended open-box closure now also explicitly includes raw lower-only ceiling-helper packages and raw upper-only dry packages
  - raw hollow-core screening rows keep their defended reopened carrier posture
  - raw wall-like heavy hybrids stay closed even when a finite screening carrier `Rw` exists
- safe-bare raw carrier contiguous-split parity is now defended explicitly on both engine and route layers:
  - raw same-material contiguous splits on `hollow_core_plank`, bare `clt_panel`, `composite_steel_deck`, and `steel_deck_composite` no longer fall off the predictor/family lane
  - the fix is deliberately narrow to coalesced single safe-bare carriers; open-box timber and wall-like heavy hybrids stay fail-closed
  - raw vs tagged single-layer heavy concrete remains intentionally different on the field route because a bare safe-bare carrier still does not reopen `Rw` without the defended helper-package evidence
- the first treated/inferred raw-floor contiguous-split cohort is now also defended on both engine and route layers:
  - exact Dataholz dry CLT, exact TUAS open-box dry floor, integrated dry CLT, and promoted heavy-concrete family-estimate packages now stay identical across defended raw split and tagged split variants
  - this widens the raw-floor audit beyond bare carriers without opening new weaker carriers or broader screening shortcuts
- a first weaker-carrier raw-floor posture cohort is now also defended on both engine and route layers:
  - bare `open_box_timber_slab`, `open_web_steel_floor`, `lightweight_steel_floor`, and `steel_joist_floor` stay fail-closed even when explicitly tagged as `base_structure`
  - that bare open-web closure is now also explicitly separated from the defended lower-only packaged lane:
    - raw and tagged open-web `2 x 16 mm` ceiling packages stay on the same UBIQ `FL-26` family-general branch
    - this remains a packaged lower-only ceiling lane, not a reopened bare open-web carrier lane
  - `timber_frame_floor`, `timber_joist_floor`, and `engineered_timber_structural` stay role-gated: raw rows remain fail-closed while explicit `base_structure` rows reopen the predictor/family lane
  - that role-gated timber posture now also explicitly covers raw lower-only and raw upper-only non-combined packages
  - open-box timber widening now stays inside defended combined upper-plus-lower semantics; non-combined upper-only and lower-only packages stay closed even when visible floor roles are explicit
  - composite ceiling-only packaged rows are now also explicitly frozen as a conservative PMC continuation:
    - raw and tagged variants stay on the same `low_confidence` lane
    - they do not silently promote into a broader family-general ceiling-only reopen
  - CLT lower-only remains fail-closed and now serves as the adjacent negative guard against over-broad ceiling-side widening
  - raw and tagged contiguous splits now stay stable on both sides of that gate
- a first family/profile boundary matrix is now also defended on both engine and route layers:
  - adjacent `upper_only`, `lower_only`, `bare`, and `combined` lanes are now frozen side by side across reinforced concrete, CLT, open-box timber, open-web steel, and composite families
  - this makes future widening work prove that it changed only the intended profile instead of silently reclassifying neighbors
- packable ceiling-board schedule parity is now also defended on both engine and route layers:
  - schedule-equivalent contiguous lower-board splits now normalize back onto the defended lane instead of parking the predictor and silently promoting or falling off
  - composite lower-only packaged rows now stay on the same conservative PMC `low_confidence` continuation across raw single, raw split, tagged single, and tagged split variants
  - open-web lower-only packaged rows stay on the same UBIQ `FL-26` family-general branch across the same split surface
  - CLT and open-box lower-only guards remain fail-closed on the adjacent split surface, so the fix is not a generic ceiling-side widening shortcut
  - non-packable mixed-thickness lower-board schedules still park the predictor; this fix did not reopen generic predictor derivation
  - neutral same-total non-packable composite lower-only schedules now also stay on the same conservative PMC continuation instead of degrading into the bare-composite family lane
  - neutral same-total non-packable open-web lower-only schedules stay on the same `FL-26` branch, while adjacent CLT and open-box lower-only guards remain fail-closed
- the first packaged lower-board edit-path parity matrix is now also defended on both engine and route layers:
  - contiguous mixed lower-board order now stays invariant across composite/open-web packaged lanes and adjacent CLT/open-box guard lanes
  - workbench direct-entry and duplicate/swap/remove-rebuild detours now converge back onto the same final route snapshot on that same lower-only surface
- disjoint lower-board topology hardening is now also defended on both engine and route layers:
  - auto predictor derivation now stays fail-closed when identical ceiling-board layers are split across separated segments
  - open-web lower-only packaged rows keep the defended `FL-26` family-general branch only on contiguous lower-board schedules; disjoint/intervening lower-board topology now steps down to `low_confidence`
  - composite lower-only disjoint topology still stays on the same conservative PMC continuation, but now carries explicit topology notes instead of masquerading as the canonical packaged shape
  - contiguous schedule-equivalent splits and defended contiguous non-packable mixed schedules remain unchanged, so this hardening did not collapse the existing packaged lower-only corridor
- lower-helper topology hardening is now also defended on both engine and route layers:
  - auto predictor derivation already stayed fail-closed on duplicated or split `ceiling_fill` / `ceiling_cavity`; now the family tier also stays conservative on that same surface
  - open-web lower-only packaged rows now step down off the defended `FL-26` family-general tier when `ceiling_fill` or `ceiling_cavity` is split across a disjoint helper topology
  - composite lower-only helper detours now stay on the same conservative PMC `low_confidence` continuation instead of silently lifting into `family_general`
  - CLT and open-box helper detours remain fail-closed, and contiguous helper split parity remains unchanged, so this did not collapse the defended packaged corridor
- lower-helper edit-path parity is now also defended on the route layer:
  - direct final-row entry and duplicate/swap/remove/rebuild helper detours now converge onto the same final route snapshot for the defended open-web/composite lower-only helper surface
  - adjacent CLT and open-box helper-detour guards also keep the same fail-closed route snapshot across those same store-history detours
- secondary route-surface revalidation on `2026-04-07` found two stale contracts but no new solver regression:
  - bound floor carry-over status was still expecting companion `Rw` to stay unavailable even though the defended floor carrier now keeps it supported
  - the wall full-preset matrix was still expecting apparent-route `Rw` to stay live even though the engine deliberately keeps wall-side `Rw` explicit once the descriptor becomes `R'w`
  - a dedicated wall output-card parity audit now defends this surface directly so card/status drift is caught before it is mistaken for a calculator regression
- the first broader mixed floor/wall torture pack is now in place:
  - engine-side deep floor and wall packages now have a shared contiguous-split parity contract
  - workbench route now has an alternating study-mode torture test that switches between deep floor and wall edit chains
  - that route pack defends both neutral split-detour parity and broader support-honest sanity after cross-mode edit sequences
- the first generated mixed floor/wall matrix is now also in place:
  - engine-side generated split variants now defend twenty-one broader floor and wall packages against neutral contiguous-split drift
  - workbench route now mirrors that generated matrix across floor/wall study-mode detours, support-surface parity, and restore-to-baseline snapshots
  - the generated route/engine family breadth is now aligned on Knauf concrete exact, TUAS concrete dry exact, Knauf direct timber exact, Knauf timber mount exact, Knauf acoustic timber exact, Dataholz timber-frame exact, Dataholz Dry exact, Dataholz Dry RC exact, dry CLT exact, TUAS CLT exact, TUAS CLT 260 exact, TUAS open-box exact, open-box dry exact, open-web 200 exact, open-web 400 exact, and hollow-core vinyl exact floors, so the mixed generated surface no longer skips the defended published-exact concrete branch, the defended upper-treatment concrete exact branch, the defended direct-fixed timber exact branch, the defended lighter and heavier mounted timber exact branches, the defended wet-screed timber-frame, direct-lined dry, and suspended dry-timber exact branches, the defended dry and measured CLT exact branches, the defended measured and dry open-box exact branches, the defended exact steel branches, or the first defended precast hollow-core family on one side
- the first generated mixed floor/wall edit-history matrix is now also in place:
  - workbench route now defends the same generated floor and wall case set against duplicate/swap/remove/rebuild store histories, not only direct split detours
  - those generated histories are also checked across opposite-mode resets before restoring the original study mode
- the first wider generated mixed floor/wall duplicate/swap grid is now also in place:
  - workbench route now defends the same generated floor and wall case set across more than one distinct duplicate/swap/rebuild history shape instead of a single representative edit-history path
  - this still does not claim closure on wider preset families; it only widens the defended grid on the current generated case set
- the first longer generated mixed floor/wall cross-mode chain is now also in place:
  - workbench route now defends restore-to-baseline after partial generated edits, opposite-mode noise chains, and repeated study-mode switches on the current generated case set
  - this still does not claim closure on wider preset families or seeded long-chain families; it only freezes the first deterministic long-chain slice
- exact floor-system companion split parity is now also defended on the floor side:
  - contiguous same-material splits on defended exact floor rows now keep screening-anchored airborne companion metrics stable instead of drifting by `0.1 dB` across exact-match-preserving concrete splits
  - the shipped fix only normalizes the airborne companion path on explicit or inferred floor-like stacks; impact matching, published floor-system selection, and wall routes remain untouched
  - adjacent hollow-core exact, TUAS open-box exact, TUAS CLT exact, TUAS CLT 260 exact, open-box dry exact, Knauf direct timber exact, Knauf timber mount exact, Knauf acoustic timber exact, Dataholz timber-frame exact, Dataholz Dry exact, Dataholz Dry RC exact, TUAS concrete dry exact, open-web 200 exact, open-web 400 exact, split parity, raw parity, and mixed generated route surfaces all stayed green after that hardening
- Phase A of that wall-side remediation note is now shipped:
  - hint-only framed metadata no longer forces heavy mineral/composite stacks onto the stud-wall lane
  - heavy unframed cavity walls can now be capped against a conservative screening corridor instead of over-scoring
  - asymmetrical heavy-plus-light cavity walls can now fall onto `lined_massive_wall` earlier instead of staying on the old optimistic double-leaf route
  - the first deep hybrid duplicate / adjacent-swap stress matrix now defends both engine and workbench routes
- residual post-Phase-A stress work now distinguishes true order-sensitive multi-leaf cases from false family-promotion bugs:
  - lightweight triple-leaf stacks now emit an explicit warning instead of being silently treated like stable two-leaf walls
  - broader multi-leaf cavity stacks now also emit an explicit order-sensitive warning and carry lower confidence
- Phase B.1 boundary diagnostics are now also shipped on the wall side:
  - narrow two-leaf family boundaries can now surface runner-up-aware warnings and notes
  - those boundary cases can step down in confidence without changing the numeric lane yet
- Phase B.2 partial wall-side corridor holding is now also shipped:
  - the `double_leaf <-> lined_massive_wall` boundary can now apply a bounded conservative hold after the family pick
  - this currently stays deliberately narrow: only `2 visible leaves / 1 cavity` topology on that defended pairing
  - deeper 5-layer hybrids that trim back to that morphology are now covered by direct engine and workbench matrix tests
  - exact boundary, trimmed-prefix, instability, and order-sensitivity contracts now exist on both engine and workbench routes for that corridor
  - hold trace now exposes runner-up, ceiling, current, and target metrics so the trim can be audited numerically
  - trim trace now also exposes leading/trailing outer compliant removals so hold + trim interactions are no longer hidden inside free-form notes
  - the wider current scan evidence still shows only `ytong_aac_d700 100/120` and `ytong_g5_800 100` inside that held corridor
  - a representative workbench route scan now also defends the same pairing at scenario-analysis level, not just engine level
- field-side support posture was tightened during validation:
  - hybrid wall-like stacks no longer surface `Rw` on assembly field bundles just because a generic impact signal existed downstream
- the living source-gap ledger now records which floor families are source-backed enough to tighten and which must stay fail-closed
- the living source-gap ledger now also names the current implementation-backed widening-first and tightening-first family branches
- the living source-gap ledger now includes a local source-corpus snapshot:
  - TUAS open-box exact rows: `7`
  - TUAS CLT exact rows: `4`
  - Dataholz CLT exact rows: `9`, with `3` currently still exact-only tightening slack
  - UBIQ open-web rows: `18` exact plus `3` bound
- the living source-gap ledger now includes a TUAS candidate-import backlog:
  - safe `b`-family widening is imported: `R2b`, `R3b`, `R11b`
  - explicit `a`-family open-box widening is now also imported: `R3a`, `R5a`
  - deferred TUAS CLT import remains behind Dataholz CLT tightening
- predictor-side and visible-layer TUAS ceiling-family groundwork is now in place:
  - explicit predictor input distinguishes `tuas_open_box_family_a` vs `tuas_open_box_family_b`
  - visible-layer/workbench stacks can now surface `family_a` honestly through `tuas_open_box_ceiling_family_a`
  - the generic `resilient_stud_ceiling` material remains the shorthand for the current imported `b` corridor
  - `TUAS2023FloorDetails.pdf` confirms the physical split behind that surface:
    - `R2a-R10a` uses `25 mm` wooden laths
    - `R2b-R11b` uses `25 mm` resilient steel studs
- TUAS post-corridor numeric screening is now explicit:
  - `R2b` is now drawing-cleared and imported as the basic `b`-family anchor
  - remaining open-box shortlist for geometry audit: `R7a`, `R6b`
  - lower-priority numeric outliers stay deferred until drawings justify them: `R6a`, `R10a`, `R7b`, `R8b`, `R9b`, `R2c`
- the real-world open-box coverage benchmark now matches the defended visible-layer truth surface:
  - generic `resilient_stud_ceiling` basic rows anchor `R2b`
  - explicit `tuas_open_box_ceiling_family_a` basic rows anchor `R2a`
  - the coverage fixture no longer aliases a generic `b` shorthand row to the `a` branch
- the first UBIQ same-family sibling import pass is now complete:
  - exact coverage now includes visible `FL-28` open-web `16 mm INEX>FLOOR` siblings at `200`, `300`, `400`
  - bound coverage now includes the visible `FL-28 (FRL/D)` open-web `400` row
  - the adjacent-family widening passes are now complete for `FL-24` and `FL-26`
  - the generic lightweight-steel `lower_only` fallback now lands on the nearer `FL-26` `2 x 16 mm` corridor when the visible ceiling package matches that profile
  - `FL-23`, `FL-25`, and `FL-27` are explicitly deferred because their timber and carpet lanes sit materially below the current supported corridor
  - the remaining later clean-up is the source-trace drift around the `ubiq_fl32_*` and `ubiq_fl33_*` internal ids

## Implemented Output Posture

The current output surface in code is broader than the older status snapshots suggest.

Implemented output families today:

- live airborne outputs: `Rw`, `R'w`, `STC`, `C`, `Ctr`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, `DnT,A,k`
- scoped impact outputs: `Ln,w`, `DeltaLw`, `LnT,A`
- guide, field-continuation, or conditional companions: `CI`, `CI,50-2500`, `Ln,w+CI`, `L'n,w`, `L'nT,w`, `L'nT,50`

Tracked but intentionally unsupported today:

- `IIC`, `AIIC`, `NISR`, `ISR`, `LIIC`, `LIR`, `HIIC`

Important nuance:

- not every requested output is available on every lane
- support still depends on topology, source class, and the active route
- the workbench keeps unsupported outputs explicit instead of fabricating them

## Not A Bug

These behaviors are now explicitly defended and should not be treated as regressions unless the underlying engine contract changes first.

- bound floor carry-over can keep `Rw` live while `Ln,w`, `L'n,w`, and `L'nT,w` stay bound-only
- wall-side `Rw` can stay explicitly unsupported once the airborne descriptor is apparent `R'w`
- floor-side `Rw` can stay live on a defended floor-carrier lane even when the visible airborne descriptor is apparent
- unsupported outputs should stay explicit on route surfaces even when a finite numeric companion exists somewhere else in the result payload

## What Is Intentionally Narrow

- reorder canonicalization is currently limited to the simple top-side heavy-floor package
- it was not widened blindly to every floor or wall combination
- true order-sensitive assemblies should remain order-sensitive until explicitly audited

## Current Open Risk

- complex mixed floor and wall stacks still need a wider manual and automated torture pass
- the next hardening step should decide which combinations are genuinely path-invariant and which must stay physically order-sensitive
- the mixed floor/wall torture surface is no longer representative-only:
  - the original mixed-study-mode torture pack proves cross-mode store detours do not silently leak result posture on representative deep floor and wall packages
  - the first generated split-detour matrix, first generated edit-history matrix, first wider duplicate/swap grid, and first deterministic long-chain slice are now also green on the defended mixed surface
  - it is still not a full mixed matrix across wider preset families beyond the current heavy-concrete plus concrete exacts, Knauf timber exacts, Dataholz timber exacts, open-box exacts, CLT exacts, open-web exacts, and hollow-core cohort or broader seeded long-chain families
- the concrete floor-carrier `Rw` blocker from the 2026-04-07 revalidation is now fixed, but the narrowing rule is intentionally strict:
  - visible floor roles reopen the carrier
  - raw wall-like heavy hybrids stay closed
  - untagged screening-only floor-like rows do not get widened automatically just because a finite screening `Rw` exists
  - the first representative raw-screening audits, the safe-bare contiguous-split cohort, the first treated/inferred split cohort, the first weaker-carrier posture cohort, and the first raw concrete ceiling-side inferred support cohort are now green, but broader reopening still requires wider inference evidence rather than another generic support shortcut
- reproduced dynamic-route duplicate and reorder instability cases are documented separately under:
  - [../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md](../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md)
- the intended fix order and protected-corridor rules for that wall-side work now live under:
  - [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
- wall-side Phase A reduced the currently reproduced jump class materially, and Phase B.1 plus the first shipped Phase B.2 hold now cover the defended `double_leaf <-> lined_massive_wall` boundary, but family selection still ends in a hard branch outside that narrow held corridor
- the largest remaining reorder deltas now cluster mainly around true multi-leaf / triple-leaf topologies, which should stay order-sensitive rather than being flattened blindly
- `multileaf_multicavity` remains a conservative surrogate rather than a dedicated multi-cavity solver
- expanded engine and representative route scans over non-AAC heavy cores did not surface a second hold-worthy family pair; Porotherm, sand-lime, pumice, and concrete rows currently stay clear of boundary/hold diagnostics in the defended palettes
- dedicated engine and route deep-hybrid trailing-trim scans now extend that evidence into a broader representative `4 x 4 x 3` prefix/suffix/cavity grid; the defended corridor still stays limited to the same three AAC core rows, with the full `0/0` through `2/2` trim grid now covered explicitly
- that same representative deep-hybrid matrix now also has adjacent-swap contracts on both engine and route layers; the current result is still `0` silent `>=8 dB` jumps, and the coverage is now split into nine executable cohorts, with the slow `ytong_aac_d700 100`, `ytong_aac_d700 120`, and `ytong_g5_800 100` rows further divided by board pair so the contract stays executable without hiding behind oversized timeouts
- practical validation note: this deep-hybrid cluster now passes reliably when isolated under `--maxWorkers=1`; combined multi-worker Vitest invocations can still trip a worker RPC timeout even when the assertions themselves stay green
- the new selector score-surface trace now also shows that the defended AAC boundary is genuinely conflicted at score level, while the current representative framed palettes still do not produce a second plausible runner-up family
- the new selector-conflict flag is currently confined to one defended sub-corridor: `ytong_aac_d700 100` inside the `lined_massive_wall <-> double_leaf` hold
- that same sub-corridor is now the only current place where the hold is allowed to consume an extra `1 dB` conflict-trim budget; denser AAC siblings and non-AAC heavy cores stay on the pre-existing trim limits
- the remaining widening risk is no longer “basic alternative core rows”; it is wider-than-representative deep-hybrid route matrices and any future boundary that shows more than one plausible runner-up family
- the remaining TUAS shortlist is no longer a pure import question:
  - `R7a` likely wants a separate heavy/wet `a` branch
  - `R6b` likely wants a separate reinforced lower-treatment `b` branch

## Immediate Next Tasks

Work in this order:

1. Extend the raw-floor inference audit beyond the current representative screening rows, safe-bare contiguous-split cohort, first treated/inferred split cohort, first weaker-carrier posture cohort, and first raw concrete ceiling-side inferred support cohort before considering any broader screening-carrier reopening:
   - wider inferred family rows
   - wider-than-first ceiling-side inferred packages
   - raw heavy wall-like hybrids and any remaining weaker carriers that must stay closed
2. Expand the current mixed floor/wall torture surface beyond the first deterministic long-chain slice:
   - wider preset-family case sets beyond the current heavy-concrete plus concrete exacts, Knauf timber exacts, Dataholz timber exacts, open-box exacts, CLT exacts, open-web exacts, and hollow-core cohort
   - broader seeded long-chain families once the current generated grid is no longer the limiting surface
   - only then decide whether broader mixed-family widening is still needed
3. Widen the wall-side Phase B.2 evidence base before extending the hold beyond the current defended corridor:
   - keep the current runner-up-aware hold limited to `double_leaf <-> lined_massive_wall`
   - focus next on wider-than-representative route palettes and any boundary that produces more than one plausible runner-up family outside the currently defended framed/heavy-core representative palettes
   - only widen if the next candidate pairing survives the same exact trace, scan, and workbench-parity contracts
4. Do a mini branch-design audit for `R7a` and `R6b` before importing either row.
5. Only after that decide whether the next widening move is TUAS branch extension, UBIQ source-trace cleanup, or the next wall-side held family pairing.

Use the source gap ledger to decide which families should be researched or widened first instead of opening new lanes ad hoc:

- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

The torture pass should include:

- deep multi-layer floor assemblies
- deep multi-layer wall assemblies
- reorder, duplicate, split, partial-edit, and reset cycles
- browser-driven manual checks on the built app in addition to regression tests

The TUAS branch-design audit should answer:

- does `R7a` fit the existing `family_a` visible-layer surface or require a dedicated heavy/wet `a` branch?
- does `R6b` fit the existing `b` ceiling shorthand or require an explicit four-board lower-treatment branch?
- if either answer is “new branch”, what is the smallest honest surface that avoids aliasing?

## Canonical Documents

- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- [../foundation/PROJECT_PLAN.md](../foundation/PROJECT_PLAN.md)
- [../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md](../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md)
