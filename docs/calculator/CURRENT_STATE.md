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
- latest audit-surface revalidation after the raw-floor screening stress expansion: green
  - engine targeted gate: `2` files, `4` tests
  - workbench targeted gate: `2` files, `3` tests
  - engine baseline gate: `4` files, `24` tests
  - workbench baseline gate: `5` files, `18` tests
- latest change-adjacent plus baseline revalidation after the `R7a` upper-EPS exact branch and stale CLT direct-fixed contract correction: green
  - engine adjacent + baseline gate: `12` files, `353` tests
  - workbench adjacent + baseline gate: `7` files, `103` tests
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
- latest mixed-surface revalidation after the official product-data exact breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the official product-backed lower-bound breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the steel interpolation lower-bound breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the product-property DeltaLw breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest change-adjacent revalidation after the official-product representative breadth closure: green
  - engine targeted pack: `4` files, `253` tests
  - workbench targeted pack: `6` files, `11` tests
- latest change-adjacent revalidation after the UBIQ provenance/boundary-freeze closure: green
  - engine targeted pack: `5` files, `276` tests
  - workbench targeted pack: `3` files, `67` tests
- latest mixed-surface revalidation after the representative seeded-family interpolation steel expansion: green
  - engine targeted pack: `4` files, `252` tests
  - workbench targeted pack: `6` files, `11` tests
- latest mixed-surface revalidation after the representative seeded-family official no-screed exact expansion: green
  - engine targeted pack: `4` files, `253` tests
  - workbench targeted pack: `7` files, `13` tests
- latest change-adjacent revalidation after the Dataholz CLT exact slack tightening slice: green
  - engine targeted pack: `6` files, `262` tests
  - workbench targeted pack: `5` files, `70` tests
- latest boundary-decision revalidation after the Dataholz GDMTXA04A manual-match closure: green
  - engine targeted/baseline pack: `6` files, `307` tests
  - workbench targeted/baseline pack: `5` files, `96` tests
- pre-edit broad candidate pack for that same slice was not fully green:
  - `features/workbench/scenario-analysis.test.ts`
  - `2` stale broad-family expectation drifts
  - classification: pre-existing baseline drift, not adjacent to the landed official-product slice
- latest mixed-surface revalidation after the converged crossover bound breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the missing support-form bound breadth expansion: green
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- latest mixed-surface revalidation after the representative seeded-family roundtrip matrix tightening: green
  - engine adjacent pack: `2` files, `2` tests
  - workbench targeted pack: `4` files, `8` tests
- latest mixed-surface revalidation after the representative seeded-family product-data exact expansion: green
  - engine mixed checkpoint pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `8` tests
- latest mixed-surface revalidation after the representative seeded-family longer-chain tightening: green
  - engine mixed checkpoint pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `8` tests
- latest mixed-surface revalidation after the representative seeded-family retention-boundary tightening: green
  - engine mixed checkpoint pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `8` tests
- latest mixed-surface revalidation after the representative seeded-family exact-family expansion: green
  - engine mixed checkpoint pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `8` tests
- latest mixed-surface revalidation after the representative seeded-family age-position tightening: green
  - engine mixed checkpoint pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `8` tests
- latest mixed-surface revalidation after the representative seeded-family hollow-core exact expansion: green
  - engine mixed checkpoint pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `8` tests
- latest change-adjacent revalidation after the open-web noncanonical continuation parity follow-up: green
  - engine selected pack: `4` files, `22` tests
  - workbench selected pack: `4` files, `19` tests
  - engine adjacent pack: `3` files, `267` tests
  - workbench adjacent pack: `3` files, `80` tests

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
- representative official-product breadth is now also broader on the user-visible workbench surface:
  - official product-system exact rows now include both `REGUPOL sonus curve 8` and `REGUPOL sonus multi 4.5` representatives
  - official product-delta rows now include the lighter `Getzner AFM 21`, the existing `AFM 33`, and the stronger `AFM 35` representatives
  - mixed generated engine and route parity now also include a second official exact topology (`REGUPOL sonus multi 4.5` porcelain) plus a stronger official product-delta lane (`Getzner AFM 35`)
  - this closure widened user-visible breadth without changing the solver/catalog lane order or reopening any generic fallback
- UBIQ provenance and boundary posture is now also frozen more explicitly without changing runtime solver behavior:
  - the full current UBIQ bound cluster is now contract-frozen on the shared official brochure URL
  - local `ubiq_fl32_*` and `ubiq_fl33_*` rows remain stable internal ids and labels
  - the visible FRL/D family drift is now documented explicitly as:
    - steel joist / purlin -> `FL-17 (FRL/D)`
    - open-web / rolled steel -> `FL-28 (FRL/D)`
  - the same slice also re-confirms that `FL-23`, `FL-25`, and `FL-27` stay deliberately deferred
- representative raw-floor screening posture is now defended explicitly on both engine and route layers:
  - raw concrete single-layer and upper-treatment rows keep the intended split between closed and reopened field-side `Rw`
  - raw concrete ceiling-side helper rows with a coherent inferred package now also reopen field-side `Rw`:
    - at least one inferred `ceiling_board`
    - plus at least one inferred `ceiling_cavity` or `ceiling_fill`
    - plus a concrete base carrier
    - that helper-side reopening now also survives a first wider contiguous-split stress cohort on both engine and route surfaces:
      - split cavity helper packages
      - split fill-plus-cavity helper packages
  - raw open-box rows stay fail-closed on field-side `Rw`
  - that defended open-box closure now also explicitly includes raw lower-only ceiling-helper packages and raw upper-only dry packages
  - split helper-side open-box raw rows also stay fail-closed on the same stress surface
  - raw hollow-core screening rows keep their defended reopened carrier posture
  - raw wall-like heavy hybrids stay closed even when a finite screening carrier `Rw` exists
    - this now explicitly includes helper-fill wall-like heavy hybrids where the concrete layer is not the terminal base layer
  - route/card parity now also covers those wider raw helper and heavy-hybrid stress shapes, not only the first harvested cohort
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
  - that same representative mixed torture slice now also stays stable through save/load serialization roundtrips after alternating deep floor and wall detours
  - the representative save/load roundtrip surface now also includes the first official product-backed lower-bound floor detour (`REGUPOL wet bound`), the first product-property DeltaLw detour (`Getzner AFM 33 Delta`), the first interpolation steel lower-bound detour (`UBIQ steel 250 bound`), the first official no-screed exact product detour (`REGUPOL Multi 4.5 porcelain exact`), the first warning-heavy missing-support-form steel bound detour (`UBIQ steel 300 unspecified bound`), and the first warning-light converged-crossover steel bound detour (`UBIQ steel 200 unspecified bound`), not only heavy-concrete and open-web-bound seeded stacks
- the first generated mixed floor/wall matrix is now also in place:
  - engine-side generated split variants now defend twenty-seven broader floor and wall packages against neutral contiguous-split drift
  - workbench route now mirrors that generated matrix across floor/wall study-mode detours, support-surface parity, and restore-to-baseline snapshots
  - the generated route/engine family breadth is now aligned on Knauf concrete exact, TUAS concrete dry exact, Knauf direct timber exact, Knauf timber mount exact, Knauf acoustic timber exact, Dataholz timber-frame exact, Dataholz Dry exact, Dataholz Dry RC exact, dry CLT exact, TUAS CLT exact, TUAS CLT 260 exact, TUAS open-box exact, open-box dry exact, REGUPOL Curve 8 exact, REGUPOL wet bound, Getzner AFM 33 Delta, open-web 200 exact, open-web 400 exact, UBIQ steel 250 bound, UBIQ steel 200 unspecified bound, UBIQ steel 300 unspecified bound, and hollow-core vinyl exact floors, so the mixed generated surface no longer skips the defended published-exact concrete branch, the defended upper-treatment concrete exact branch, the defended direct-fixed timber exact branch, the defended lighter and heavier mounted timber exact branches, the defended wet-screed timber-frame, direct-lined dry, and suspended dry-timber exact branches, the defended dry and measured CLT exact branches, the defended measured and dry open-box exact branches, the defended official product-backed resilient-underlay exact and lower-bound branches, the defended product-property DeltaLw branch, the defended exact steel branches, the first defended interpolation steel lower-bound branch, the defended converged crossover steel lower-bound branch, the defended missing-support-form steel lower-bound branch, or the first defended precast hollow-core family on one side
- the first generated mixed floor/wall edit-history matrix is now also in place:
  - workbench route now defends the same generated floor and wall case set against duplicate/swap/remove/rebuild store histories, not only direct split detours
  - those generated histories are also checked across opposite-mode resets before restoring the original study mode
- the first wider generated mixed floor/wall duplicate/swap grid is now also in place:
  - workbench route now defends the same generated floor and wall case set across more than one distinct duplicate/swap/rebuild history shape instead of a single representative edit-history path
  - this still does not claim closure on wider preset families; it only widens the defended grid on the current generated case set
- the first longer generated mixed floor/wall cross-mode chain is now also in place:
  - workbench route now defends restore-to-baseline after partial generated edits, opposite-mode noise chains, and repeated study-mode switches on the current generated case set
  - that same generated long-chain surface now also stays stable through save/load serialization roundtrips after those cross-mode noise chains
  - this still does not claim closure on wider preset families or broader seeded long-chain families; it now freezes the first deterministic generated long-chain plus save/load roundtrip slice
- exact floor-system companion split parity is now also defended on the floor side:
  - contiguous same-material splits on defended exact floor rows now keep screening-anchored airborne companion metrics stable instead of drifting by `0.1 dB` across exact-match-preserving concrete splits
  - official product-data exact rows now also stay stable across neutral same-material screed/slab splits, including `DeltaLw` support posture on the REGUPOL Curve 8 lane
  - official product-backed lower-bound rows now also stay stable across neutral same-material wet-screed/slab splits, keeping `Ln,w` bound while `DeltaLw` remains live on the REGUPOL wet-support lane
  - product-property DeltaLw rows now also stay stable across neutral same-material screed/slab splits, keeping `DeltaLw` live while `Ln,w+CI` remains unavailable on the Getzner AFM 33 lane
  - converged crossover steel lower-bound rows now also stay stable across neutral same-material ceiling-board and floor-covering splits, keeping `Ln,w` bound while `Ln,w+CI` and `DeltaLw` remain unavailable and the unspecified-support warning stays closed on the UBIQ steel 200 lane
  - missing-support-form steel lower-bound rows now also stay stable across neutral same-material ceiling-board and floor-covering splits, keeping `Ln,w` bound while `Ln,w+CI` and `DeltaLw` remain unavailable and the missing-support-form steel bound lane stays intact on the UBIQ steel 300 lane
  - interpolation steel lower-bound rows now also stay stable across neutral same-material ceiling-board and base-structure splits, keeping `Ln,w` bound while `DeltaLw` remains unavailable on the UBIQ steel 250 lane
  - the shipped fix only normalizes the airborne companion path on explicit or inferred floor-like stacks; impact matching, published floor-system selection, and wall routes remain untouched
  - adjacent hollow-core exact, TUAS open-box exact, TUAS CLT exact, TUAS CLT 260 exact, open-box dry exact, Knauf direct timber exact, Knauf timber mount exact, Knauf acoustic timber exact, Dataholz timber-frame exact, Dataholz Dry exact, Dataholz Dry RC exact, TUAS concrete dry exact, REGUPOL Curve 8 exact, REGUPOL wet bound, Getzner AFM 33 Delta, open-web 200 exact, open-web 400 exact, UBIQ steel 250 bound, UBIQ steel 200 unspecified bound, UBIQ steel 300 unspecified bound, split parity, raw parity, and mixed generated route surfaces all stayed green after that hardening
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
  - TUAS open-box exact rows: `8`
  - TUAS CLT exact rows: `4`
  - Dataholz CLT exact rows: `9`, with `1` currently still exact-only tightening slack
  - UBIQ open-web rows: `18` exact plus `3` bound
- Dataholz CLT exact-preserving tightening is now narrower and more explicit:
  - `dataholz_gdmnxn02_wet_clt_lab_2026` and `dataholz_gdmnxn02_05_wet_clt_lab_2026` now both resolve as exact rows from defended predictor fingerprints
  - the landed `gdmnxn02_05` change kept adjacent wet-family estimates intact and added an explicit suspended-dry negative for `dataholz_gdmtxa04a_clt_lab_2026`
  - the remaining imported CLT exact-only slack is therefore no longer a generic dormant bucket; it is the single manual-match-disabled `gdmtxa04a` boundary question
- that remaining `gdmtxa04a` boundary question is now also narrowed and frozen more honestly:
  - the official source still under-describes the `65 mm` top dry-floor layer as an areal-mass entry rather than a named generic board product
  - the current `dry_floating_gypsum_fiberboard 65 mm` mapping therefore remains good enough for preset-only exact-id resolution but not yet good enough for manual visible exact reopening
  - engine and workbench route contracts now defend that row as an estimate-routed dry CLT boundary instead of leaving it as an undocumented near-miss
- the living source-gap ledger now includes a TUAS candidate-import backlog:
  - safe `b`-family widening is imported: `R2b`, `R3b`, `R11b`
  - explicit `a`-family open-box widening is now also imported: `R3a`, `R5a`
  - drawing-backed reinforced `b`-family widening is now also imported: `R6b`
  - deferred TUAS CLT import remains behind Dataholz CLT tightening
- predictor-side and visible-layer TUAS ceiling-family groundwork is now in place:
  - explicit predictor input distinguishes `tuas_open_box_family_a` vs `tuas_open_box_family_b`
  - visible-layer/workbench stacks can now surface `family_a` honestly through `tuas_open_box_ceiling_family_a`
  - the generic `resilient_stud_ceiling` material remains the shorthand for the current imported `b` corridor
  - `TUAS2023FloorDetails.pdf` confirms the physical split behind that surface:
    - `R2a-R10a` uses `25 mm` wooden laths
    - `R2b-R11b` uses `25 mm` resilient steel studs
- TUAS post-corridor numeric screening is now explicit:
  - a `2026-04-09` Mendeley public API recheck confirmed the currently published TUAS drawing/detail files used in the audit are:
    - `TUAS2023FloorConstructionDrawingsR1.pdf`
    - `TUAS2023FloorDetails.pdf`
  - first-tier geometry / branch-surface audit is now closed for:
    - `R2b` as the basic `b`-family anchor
    - `R6b` as the reinforced lower-treatment `b` branch
    - `R7a` as the exact-only heavy/wet `a` branch
  - the deferred drawing-audit shortlist is now also closed without opening a new import:
    - `TUAS2023FloorDetails.pdf` page `5/7` visually confirms the existing family split remains correct:
      - `R2a-R10a` uses `25 mm` wooden laths
      - `R2b-R11b` uses `25 mm` resilient steel studs
    - `R6a` (`4/40`) and `R10a` (`6/40`) stay deferred because they introduce mixed board / staged dry-pack schedules that the current exact role surface cannot encode honestly
    - `R7b` (`11/40`), `R8b` (`12/40`), `R9b` (`13/40`), and `R2c` (`15/40`) stay deferred because they introduce hybrid lower-treatment morphologies outside the current `family_a` vs `family_b` support surfaces
    - `R2c` specifically still does not justify any `__none` topology widening
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
  - that same representative torture slice now also proves save/load roundtrips do not leak snapshot, warning, or support posture after alternating deep floor and wall detours
  - the representative seeded roundtrip slice is now frozen as a compact explicit matrix instead of a one-by-one ladder:
    - heavy-concrete
    - open-web-bound
    - official product-data exact
    - curated exact family/system match
    - exact family/system match with low-frequency closures
    - product-backed wet-support lower-bound
    - product-property `DeltaLw`
    - interpolation steel lower-bound
    - official no-screed exact product topology
    - warning-heavy missing-support-form steel bound
    - warning-light converged-crossover steel bound
  - that compact matrix now proves each representative seeded family survives reload after a wall detour plus three neighboring seeded-family detour chains, not only after a single alternating floor/wall switch
  - the same matrix now also survives at the current `savedScenarios` retention boundary:
    - the oldest retained wall anchor survives reload after a longer floor-family chain
    - a mid-window exact-family snapshot also survives reload with the same route/support/warning posture
    - the newest warning-heavy steel snapshot still reloads cleanly at the same time
    - each seeded floor family still reloads cleanly even when it sits at the tail of the current eight-entry saved-scenario window
  - the latest seeded-family addition inside that matrix is `REGUPOL Multi 4.5 porcelain exact`, so the representative roundtrip surface now also covers the first official no-screed exact product topology in addition to the already defended official product-data exact, lower-bound, `DeltaLw`, interpolation-steel, and steel-warning classes
  - the latest class expansion inside that matrix is `dataholz_timber_frame_exact`, so the representative roundtrip surface now also covers a curated exact family/system match with `Ln,w+CI` live, `DeltaLw` closed, and the local-guide supplement still intact after reload
  - the latest support-surface expansion inside that matrix is `hollow_core_vinyl_exact`, so the representative roundtrip surface now also covers an exact family/system match where `Ln,w+CI`, `DeltaLw`, and `L'nT,50` stay explicitly closed while the exact family lane still survives reload
  - the wall-side representative detour anchor also now survives reload after a bound floor detour plus a product-data exact floor detour chain, not just a single floor switch
  - the first generated split-detour matrix, first generated edit-history matrix, first wider duplicate/swap grid, and first deterministic generated long-chain plus save/load roundtrip slice are now also green on the defended mixed surface
  - it is still not a full mixed matrix across broader seeded long-chain families or wider preset families beyond the current heavy-concrete plus concrete exacts, Knauf timber exacts, Dataholz timber exacts, open-box exacts, CLT exacts, open-web exacts, and hollow-core cohort
- the concrete floor-carrier `Rw` blocker from the 2026-04-07 revalidation is now fixed, but the narrowing rule is intentionally strict:
  - visible floor roles reopen the carrier
  - raw wall-like heavy hybrids stay closed
  - untagged screening-only floor-like rows do not get widened automatically just because a finite screening `Rw` exists
  - the first representative raw-screening audits, the safe-bare contiguous-split cohort, the first treated/inferred split cohort, the first weaker-carrier posture cohort, and the first raw concrete ceiling-side inferred support cohort are now green, but broader reopening still requires wider inference evidence rather than another generic support shortcut
  - the first wider raw-helper negative pass is now also green:
    - mixed-order ceiling-helper concrete schedules still reopen field-side `Rw` as long as concrete remains the terminal inferred base layer
    - disjoint `ceiling_board + ceiling_fill + ceiling_board + ceiling_cavity + concrete` helper schedules still keep that same reopened carrier posture
    - adding a top-side finish above the concrete closes the helper-side `Rw` reopening again
    - helper-heavy lightweight-steel raw rows stay fail-closed on the same adjacent stress surface
  - the second wider raw-helper negative pass is now also green:
    - helper-heavy steel-joist raw and tagged rows now stay fail-closed on that same weaker-carrier surface
    - wider wall-like heavy hybrids with split fill on both sides of the concrete core still stay on the same screening-only heavy-concrete posture
    - wider wall-like heavy hybrids with `board + fill + board + concrete + board` mixed helper topology also stay on that same posture
    - the adjacent `gypsum_board + rockwool + gypsum_board + open_web_steel_floor` helper-heavy open-web package is now also resolved:
      - it stays on a same-family `low_confidence` continuation anchored to the visible `FL-24` direct `2 x 13 mm` plasterboard corridor
      - it does not reopen as a defended contiguous `FL-26` family-general package
      - it does not collapse back to the fail-closed weaker-carrier guard
      - blocker copy now explicitly records that the lower-only ceiling-board topology is split in the visible stack
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
- the TUAS open-box shortlist is now closed for the current source-backed branch set:
  - `R6b` is landed as a narrow exact-only reinforced lower-treatment `b` branch
  - `R7a` is landed as a narrow exact-only heavy/wet `a` branch with:
    - dedicated `eps_floor_insulation_board` upper-EPS surface
    - explicit `upper_fill` inference on engine and workbench paths
    - selector guard so non-dry upper packages do not collapse onto the `R2b` basic archetype
  - the same slice also closed a stale contract on a nearby CLT stack:
    - the old "upper-plus-lower" direct-fixed CLT expectation was not a real defended combined-family lane
    - current predictor topology reads it as `dry_floating_floor` plus `direct_fixed_ceiling`
    - it now stays screening-only / fail-closed on impact outputs until explicit combined-family evidence exists

## Immediate Next Tasks

Work in this order:

1. Keep the closed raw-floor negative audit, the closed official-product representative breadth slice, the closed UBIQ provenance/boundary-freeze slice, and the closed interpolation-steel mixed seeded-family slice frozen:
   - do not reopen `FL-23/25/27` just because provenance is now clearer
   - do not turn the provenance freeze into an ad hoc runtime rename
   - do not treat the corrected direct-fixed CLT screening contract as a widening target
2. Expand the current mixed floor/wall torture surface only where the next representative seeded gap is still clearly higher value than a fresh widening slice:
  - keep the new compact representative seeded-family roundtrip matrix green across:
    - heavy-concrete and open-web-bound seeded detours
    - official product-data exact seeded detours
    - official no-screed exact seeded detours
    - the interpolation steel lower-bound seeded detour now also in place
    - product-backed lower-bound seeded detours
    - product-property `DeltaLw` seeded detours
    - warning-heavy and warning-light steel bound seeded detours
  - wider preset-family case sets beyond the current heavy-concrete plus concrete exacts, Knauf timber exacts, Dataholz timber exacts, open-box exacts, CLT exacts, open-web exacts, and hollow-core cohort
   - broader seeded long-chain families now that the compact representative matrix already survives the first three-neighbor operator-history chain, the current saved-scenario retention boundary, the first age-position reload audit, and the first curated exact-family match class
   - mixed/history is no longer the first blocker now that the no-screed official exact topology is also inside the representative matrix
   - only widen broader mixed-family grids if the next tightening slice exposes a real route-history blind spot
3. Tighten the next exact-preserving family before opening a broader widening slice:
   - the open-web helper continuation boundary is now closed as a conservative same-family `low_confidence` decision
   - its parity follow-up is now also closed:
     - the same continuation now survives representative raw/tagged, split/order, and edit-path detours
     - the landed fix was a packed-schedule evaluator correction, not a stronger lane reopen
   - the next clean local target is back on evidence-first widening:
     - audit the deferred TUAS shortlist against drawings/details before importing new rows
   - keep raw weaker-carrier closures, defended contiguous `FL-26` packaged rows, and the noncanonical `FL-24`-anchored continuation explicitly separated
4. Widen the wall-side Phase B.2 evidence base before extending the hold beyond the current defended corridor:
   - keep the current runner-up-aware hold limited to `double_leaf <-> lined_massive_wall`
   - focus next on wider-than-representative route palettes and any boundary that produces more than one plausible runner-up family outside the currently defended framed/heavy-core representative palettes
   - only widen if the next candidate pairing survives the same exact trace, scan, and workbench-parity contracts
5. Only after that decide whether the next widening move is:
   - a TUAS-backed floor evidence widening move
   - another official-product representative closure if a real gap remains
   - or the next wall-side held family pairing

Use the source gap ledger to decide which families should be researched or widened first instead of opening new lanes ad hoc:

- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

The torture pass should include:

- deep multi-layer floor assemblies
- deep multi-layer wall assemblies
- reorder, duplicate, split, partial-edit, and reset cycles
- browser-driven manual checks on the built app in addition to regression tests

The next widening audit should answer:

- after the selected raw-floor negative audit closes, which source-led corridor now has the cleanest widening evidence?
- does the next corridor candidate preserve route honesty without reopening raw weak-carrier or helper-side shortcuts?
- are any stale family expectations being mistaken for real widening opportunities?

## Canonical Documents

- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- [../foundation/PROJECT_PLAN.md](../foundation/PROJECT_PLAN.md)
- [../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md](../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md)
