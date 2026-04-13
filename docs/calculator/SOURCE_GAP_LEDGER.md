# Dynamic Calculator Source Gap Ledger

Last reviewed: 2026-04-13

Purpose:

- keep a living map of the current floor-dynamic support gaps
- record which families are already source-backed enough to tighten
- record which families must stay fail-closed until stronger evidence exists

Read together with:

- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)
- [../foundation/SOURCE_REPO_POLICY.md](../foundation/SOURCE_REPO_POLICY.md)

Important scope note:

- this ledger is floor-dominant
- wall-side dynamic behavior still stays mostly under benchmark and stability guardrails
- if wall-family widening becomes active work, add a separate wall ledger instead of overloading this one

Current planning implication:

- the answer-origin docs gap is now explicit and has a first executable trace
  matrix:
  - formulas are active, but exact source rows, predictor lanes, bound lanes,
    and unsupported support gates can own different requested outputs
  - `output_origin_trace_matrix_v1` now pins representative outputs with
    value/origin/support evidence and matching workbench card status
  - adjacent validation and the full engine suite are green after that matrix:
    engine `3` files / `7` tests, workbench `3` files / `4` tests, full engine
    `99` files / `787` tests, full web `94` files / `602` tests
  - before any new source-led widening, extend that matrix for the candidate
    route instead of relying only on prose confidence
- `mixed_floor_wall_seeded_route_history_expansion_v1` is closed and committed
  for the first heavy-composite wall target
- `dataholz_clt_source_truth_audit_v1` is now closed as a no-widening source
  audit before any new raw-floor widening
- latest implemented floor-side guard:
  - `open_box_finish_tolerance_mixed_history_boundary_v1`
  - this is a no-widening workbench history/card guard for the already narrowed
    TUAS open-box walking-finish tolerance boundary
  - reason: the source-band vs outside-band open-box laminate/EPS boundary was
    already narrowed, but user-hostile duplicate/split/reorder-bounce/save-load
    and floor/wall mode history still needed answer/card pinning
  - result:
    - no solver, catalog, selector, source, support, or workbench runtime
      behavior changed
    - source-band `10 mm` laminate split as `4 + 6 mm` remains exact on
      `tuas_r2b_open_box_timber_measured_2026` with live `Rw 62`, `Ln,w 46`,
      `L'n,w 48`, and `L'nT,w 45.6`
    - outside-band `12 mm` laminate split as `6 + 6 mm` remains impact
      unsupported / needs-input, while `Rw` remains screening live at `44 dB`
  - test anchor:
    - `apps/web/features/workbench/open-box-finish-tolerance-mixed-history-boundary.test.ts`
  - validation:
    - focused workbench boundary: `1` file, `1` test, green
    - workbench mixed/history/floor adjacent pack: `5` files, `112` tests,
      green
    - engine source/route adjacent pack: `4` files, `36` tests, green
    - full engine suite: `102` files, `790` tests, green
    - full web suite: `98` files, `606` tests, green
    - `pnpm build`: green with known `sharp/@img` and Next.js TypeScript
      plugin warnings
    - engine/web typechecks and `git diff --check`: green
- previous implemented floor-side guard:
  - `ubiq_open_web_packaged_lane_trace_matrix_v1`
  - this is a no-widening UBIQ open-web packaged lower-lane guard before any
    new raw-floor or open-web carrier behavior widening
  - reason: UBIQ has explicit open-web source rows and the visible route is
    already live through a source-backed family estimate, but exact/split,
    tagged/split, and reordered layer inputs needed answer-level and card-level
    pinning before any route behavior could be considered safe
  - result:
    - no solver, catalog, selector, source, support, or workbench runtime
      behavior changed
    - canonical, raw split, and tagged split lower packages all stay on
      candidate ids:
      - `ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026`
      - `ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026`
      - `ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026`
    - canonical/split/tagged variants are pinned as `family_general` at
      `56.7%` fit with live floor and field output cards
    - reordered lower-package input remains live but is pinned as
      `low_confidence` at `29%` fit with duplicate-role warning coverage
    - this checkpoint does not open bare open-web raw carrier support
  - test anchors:
    - `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
    - `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`
  - validation:
    - engine packaged-lane/UBIQ adjacent pack: `7` files, `24` tests, green
    - workbench packaged-lane adjacent pack: `7` files, `13` tests, green
    - full engine suite: `102` files, `790` tests, green
    - full web suite: `97` files, `605` tests, green
    - `pnpm build`: green with the known `sharp/@img` optional-package
      warnings and Next.js TypeScript plugin recommendation
    - engine/web typechecks and `git diff --check`: green
- previous implemented floor-side guard:
  - `raw_floor_hostile_input_answer_matrix_v1`
  - this is a no-widening hostile-input guard before new raw-floor behavior
    widening
  - reason: after the wall selector trace checkpoint exposed no behavior bug,
    raw-floor remains the largest fake-confidence risk; before naming a new
    support lane, long split, reordered, and weak-carrier raw stacks needed
    answer-level pinning
  - result:
    - no solver, catalog, selector, source, or workbench runtime behavior
      changed
    - engine matrix pins numeric `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, and
      `L'nT,w` answers where live, plus fail-closed unsupported buckets where
      not live
    - workbench matrix pins matching output-card status/value snapshots
    - open-web helper-heavy raw stacks and fragmented CLT lower-only raw stacks
      stay impact-unsupported / needs-input
    - concrete moved away from the terminal position keeps requested field `Rw`
      unsupported
  - test anchors:
    - `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
    - `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
  - validation:
    - engine raw adjacent pack: `6` files, `12` tests, green
    - workbench raw adjacent pack: `6` files, `9` tests, green
    - full engine suite: `101` files, `789` tests, green
    - full web suite: `96` files, `604` tests, green
    - engine/web typechecks and `git diff --check`: green
- previous implemented floor-side guard:
  - `raw_concrete_helper_permutation_answer_guard_v1`
  - umbrella: `floor_raw_inference_source_led_widening_v1`
  - this is not a new exact/source import; it is the answer-measuring guard for
    the already-open raw terminal-concrete plus ceiling-helper corridor
  - reason: current implementation has a narrow helper signal, and current
    tests already defend support buckets; the remaining gap is explicit numeric
    answer snapshots and workbench route/card parity across wider helper
    permutations
  - result:
    - no solver, catalog, selector, or workbench runtime behavior changed
    - engine answer snapshots and workbench route/card snapshots are now in
      place and target-green
- keep the continued fail-closed posture for `C11c`, weak UBIQ bands,
  helper-only timber carriers, open-web steel raw carriers, and exact-only
  Dataholz rows until stronger source evidence exists

## Latest Source-Truth Rebaseline

- latest closed slice: `tuas_floor_source_truth_rebaseline_v1`
- source checked: `TUAS2023FloorSoundInsulationDataR1.xlsx`, sheet `SoundInsulation`
- implementation correction:
  - imported TUAS floor rows now match spreadsheet rows `34` (`Ln,w`), `35` (`Ln,w+CI`), `36` (`Ln,w+CI,50-2500`), `41` (`Rw`), and `42` (`Rw+C`)
  - TUAS-backed published predictor lanes for CLT bare interpolation, open-box basic/dry archetypes, `X5`, and `C5c` were rebaselined to the same truth
  - `packages/engine/src/tuas-candidate-backlog-contract.test.ts` now guards the imported TUAS single-number truth directly against the spreadsheet fixture values
- closed source-label gap:
  - spreadsheet row `42` is `Rw+C`
  - the current domain still stores that companion in the legacy numeric
    `RwCtr` field for compatibility, but `RwCtrSemantic: "rw_plus_c"` now
    prevents the value from being exposed as `Ctr`
  - target-output support and workbench cards now support TUAS `C` while keeping
    TUAS `Ctr` unsupported

## Current Audited Posture

### Raw Terminal Concrete With Ceiling Helpers

- current posture:
  - raw visible inputs with no explicit `floorRole` can reopen field `Rw` only
    when inferred impact roles find terminal `concrete` as `base_structure`
    and the lower side is composed only of `ceiling_board`, `ceiling_cavity`,
    and/or `ceiling_fill`
  - the signal requires at least one ceiling board and at least one helper
    (`ceiling_cavity` or `ceiling_fill`)
  - top-side finish after the concrete, non-terminal concrete, wall-like heavy
    hybrids, open-box timber, open-web steel, lightweight steel, steel joist,
    timber frame, timber joist, and engineered timber remain closed against
    this raw helper shortcut
- current guard coverage:
  - support-bucket behavior is already covered in
    `packages/engine/src/raw-floor-screening-carrier-support.test.ts`
  - route-side support behavior is already covered in
    `apps/web/features/workbench/raw-floor-screening-route-support.test.ts`
  - weaker-carrier and safe-bare split parity guards cover nearby negatives
- latest closed gap:
  - `raw_concrete_helper_permutation_answer_guard_v1`
  - added explicit numeric answer snapshots for wider helper permutations so
    formula or route movement is visible as answer movement, not just as
    support-bucket movement
  - treat the snapshots as local implementation baselines; they are not a new
    external source import
  - test anchors:
    - `packages/engine/src/raw-concrete-helper-answer-guard.test.ts`
    - `apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts`

### Bare CLT Slab

- current posture:
  - lab: live `Rw`, `Ln,w`, `Ln,w+CI`
  - impact field: live `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
  - current lab basis: `predictor_mass_timber_clt_bare_interpolation_estimate`
- why it is open:
  - the current CLT lane is already narrowed to same-family anchors and guarded by CLT-specific monotonicity tests
  - this is no longer a blind generic lightweight-floor fallback
- latest tightening guard:
  - `clt_laminate_underlay_interpolation_guard_v1` is closed
  - `clt_dry_finish_package_guard_v1` is closed
  - `clt_combined_finish_fallback_guard_v1` is closed
  - raw bare CLT remains live on the conservative TUAS X2/C2 interpolation with
    the raw-slab penalty
  - source-backed `laminate + EPS underlay` CLT remains live
  - laminate-only CLT and out-of-band laminate thicknesses no longer inherit
    source-backed impact support from the TUAS `X2/C2` laminate-plus-EPS rows
  - dry CLT `X5/C5c` interaction no longer accepts explicit out-of-band
    laminate or EPS thicknesses through predictor-specific or generic fallback
    routes
  - combined CLT stacks with lower treatment and malformed laminate/EPS walking
    finishes no longer reopen through the generic same-family CLT archetype
    after the direct predictor rejects them
  - C7-style wet packages remain live when the valid laminate/EPS pair is
    present alongside additional upper-package layers
- next work:
  - keep tightening monotonicity and treatment-strength relations
  - do not widen CLT by inventing a broader generic lane first
- current test anchors:
  - `packages/engine/src/clt-floor-monotonicity.test.ts`
  - `packages/engine/src/predictor-published-family-estimate.test.ts`
  - `packages/engine/src/bare-floor-raw-support.test.ts`
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`

### Bare Open-Box Timber Slab

- current posture:
  - lab: `Rw` only
  - impact field: fail-closed
  - no live impact basis is exposed
- latest tightening guard:
  - `open_box_finish_tolerance_guard_v1` is closed
  - `open_box_finish_package_guard_v1` is closed
  - `open_box_disjoint_upper_fallback_guard_v1` is closed
  - TUAS open-box rows that expose a walking finish are source-backed only for
    the thin `8 mm` laminate plus `3 mm` EPS underlay pair
  - the open-box fallback band now follows the exact visible-role tolerance for
    that pair: `10 mm` laminate remains a tolerated near source-band predictor
    input, while `12 mm` laminate no longer borrows `R2b/R5b/R9b` impact values
    after exact matching falls off
  - malformed basic, dry, or hybrid visible inputs that carry missing,
    incomplete, or out-of-band laminate/EPS walking finishes now withhold impact
    support instead of borrowing predictor-specific or generic same-family
    `R2b/R5b/R9b` values
  - valid exact open-box source rows remain live, and direct predictor input with
    source-band `3 mm` underlay but no product id remains accepted
  - TUAS hybrid open-box wet upper packages with the source-backed
    `geotextile + screed` floating-screed schedule stay exact when the full
    source schedule is entered faithfully
  - if that staged upper package is disjoint or mixed out of order and exact
    matching falls off, the visible route now withholds `family_general`
    impact support instead of borrowing neighboring `R8b/R9b/R2c` rows
  - generic dry open-box disjoint `upper_fill` rows remain on the existing
    family-general warning lane; this guard is not a broad open-box fallback
    shutdown
- why it stays closed:
  - the current TUAS open-box rows are defended combined systems, not a defended raw bare open-box impact lane
  - the fail-closed posture now also explicitly covers raw and tagged lower-only ceiling-helper packages plus upper-only dry packages
  - widening this lane without stronger same-family evidence would create fake confidence
- next research question:
  - can the TUAS measured corpus defend a narrow near-bare or single-side-treatment open-box lane
  - if not, keep the raw bare open-box lane fail-closed
- current test anchors:
  - `packages/engine/src/bare-floor-raw-support.test.ts`
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `packages/engine/src/raw-floor-screening-carrier-support.test.ts`
  - `packages/engine/src/raw-floor-weaker-carrier-posture.test.ts`
  - `packages/engine/src/tuas-support-surface-decision-contract.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`

### Role-Gated Timber Carriers

- current posture:
  - raw bare, lower-only, and upper-only `timber_frame_floor`, `timber_joist_floor`, and `engineered_timber_structural` rows stay fail-closed on impact
  - explicit `base_structure` rows can still reopen the predictor/family lane
  - raw combined rows can still use the defended exact/family corridors when the visible package carries upper-plus-lower evidence
- why it stays gated:
  - current timber evidence is strong enough for explicit-role and defended combined-package corridors
  - it is not strong enough to let helper-only or top-side-only raw rows auto-promote into the same-family lane
- next work:
  - widen timber only through explicit-role or defended combined-package evidence
  - do not let helper-only raw timber rows become an accidental generic widening shortcut
- current test anchors:
  - `packages/engine/src/raw-floor-weaker-carrier-posture.test.ts`
  - `apps/web/features/workbench/raw-floor-weaker-carrier-route-posture.test.ts`
  - `packages/engine/src/impact-predictor-input.test.ts`
  - `packages/engine/src/impact-raw-layer-inference.test.ts`

### TUAS Open-Box Dry Exact Package

- current posture:
  - exact live lane
  - exact id: `tuas_r5b_open_box_timber_measured_2026`
  - lab: live `Rw`, `Ln,w`, `Ln,w+CI`
  - impact field: live `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
- why it matters:
  - it is the strongest current open-box anchor for future same-family widening
  - it proves that open-box timber can stay exact and stable when the package is fully described
- latest tightening guard:
  - the dry open-box walking-finish fallback is source-bounded to the measured
    `8 mm` laminate plus `3 mm` EPS pair
  - the laminate tolerance is now aligned with exact open-box matching; `12 mm`
    laminate no longer borrows the `R5b` dry tuple after exact matching rejects it
  - malformed dry rows with out-of-band EPS underlay no longer borrow the
    `R5b` impact tuple through direct predictor or visible same-family fallback
  - exact `tuas_r5b_open_box_timber_measured_2026` remains live when the full
    source package is entered
- next work:
  - prefer widening around this defended package before attempting any raw bare open-box lane
- current test anchors:
  - `packages/engine/src/calculate-assembly.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`
  - `apps/web/features/workbench/floor-stack-invariance.test.ts`
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`

### Bare Open-Web Steel Carrier

- current posture:
  - lab: `Rw` only
  - impact field: fail-closed
  - no live impact basis is exposed
- why it stays closed:
  - the current UBIQ source is strongest on combined upper-plus-lower system tables
  - that does not defend a raw bare open-web impact lane by itself
- next research question:
  - can a narrow same-family open-web lane be defended from official rows or measured sources without guessing across support-form ambiguity
  - if not, keep the raw bare open-web lane fail-closed
- current test anchors:
  - `packages/engine/src/bare-floor-raw-support.test.ts`
  - `packages/engine/src/bare-floor-tagged-family-contract.test.ts`
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `packages/engine/src/floor-profile-boundary-matrix.test.ts`
  - `apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts`

### Open-Web Lower-Only Packaged Ceiling Lane

- current posture:
  - raw and tagged lower-only `2 x 16 mm` open-web ceiling packages are live
  - lab: `family_general`
  - field: `mixed_predicted_plus_estimated_local_guide`
  - candidate ids:
    - `ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026`
    - `ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026`
    - `ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026`
- why this does not contradict the bare closure:
  - this is a packaged lower-only ceiling lane, not a bare open-web carrier lane
  - the current family estimate stays inside explicit open-web support-form rows instead of borrowing from ambiguous generic steel families
  - schedule-equivalent contiguous lower-board splits now stay on that same branch instead of parking predictor derivation
  - neutral same-total non-packable mixed lower-board schedules also stay on that same `FL-26` branch even though the predictor blocker remains visible
  - disjoint/intervening lower-board topology no longer stays on that defended `FL-26` family-general tier; it now steps down to `low_confidence` and surfaces explicit blocker copy
  - disjoint/intervening lower-helper topology in `ceiling_fill` or `ceiling_cavity` also no longer stays on that defended `FL-26` family-general tier; it now steps down to `low_confidence` on the same conservative surface where predictor derivation was already fail-closed
  - a helper-heavy noncanonical `gypsum_board + rockwool + gypsum_board + open_web_steel_floor` package is now explicitly frozen on a conservative same-family `low_confidence` continuation:
    - candidate id: `ubiq_fl24_open_web_steel_300_16mm_exact_lab_2026`
    - blocker reason: split lower-only ceiling-board topology
    - posture reason: visible `FL-24` direct `2 x 13 mm` plasterboard support exists, but the live stack still lacks the explicit `INEX FLOOR` top package and introduces extra fill
  - that adjacent boundary is therefore not the same thing as the defended contiguous `FL-26` package and should stay a dedicated continuation class, not an implicit widening
  - direct final-row entry and duplicate/swap/remove-rebuild store detours now also converge back onto that same branch
- current test anchors:
  - `packages/engine/src/floor-role-topology.test.ts`
  - `packages/engine/src/impact-predictor-input.test.ts`
  - `packages/engine/src/raw-floor-packaged-lane-audit.test.ts`
  - `apps/web/features/workbench/raw-floor-packaged-lane-route-audit.test.ts`
  - `packages/engine/src/floor-packaged-lane-disjoint-detour.test.ts`
  - `packages/engine/src/floor-packaged-lane-helper-disjoint-detour.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-disjoint-route-detour.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-helper-disjoint-route-detour.test.ts`
  - `packages/engine/src/floor-profile-boundary-matrix.test.ts`
  - `apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts`
  - `packages/engine/src/floor-split-layer-parity.test.ts`
  - `packages/engine/src/floor-packaged-lane-order-parity.test.ts`
  - `apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-edit-path-parity.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-helper-edit-path-parity.test.ts`
  - `packages/engine/src/floor-core-coverage-matrix.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`
  - `packages/engine/src/floor-profile-boundary-matrix.test.ts`
  - `apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts`

### UBIQ Open-Web Combined FL-28 Package

- current posture:
  - exact live lane
  - exact id: `ubiq_fl28_open_web_steel_300_exact_lab_2026`
  - lab: live `Rw`, `Ln,w`, `Ln,w+CI`
  - impact field: live `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
- why it matters:
  - it is the strongest current open-web steel anchor
  - it already supports defended exact rows and family interpolation inside the FL-28 branch
- next work:
  - widen supported combined open-web families from this branch first
  - do not skip directly to a raw bare open-web lane
- current test anchors:
  - `packages/engine/src/lightweight-steel-fl28-estimate.ts`
  - `packages/engine/src/predictor-published-family-estimate.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`
  - `apps/web/features/workbench/floor-stack-invariance.test.ts`
  - `apps/web/features/workbench/complex-stack-audit.test.ts`
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `packages/engine/src/floor-profile-boundary-matrix.test.ts`
  - `apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts`

### Composite Ceiling-Only Conservative Lane

- current posture:
  - raw and tagged composite ceiling-only packaged rows are live
  - lab: `low_confidence`
  - field: `mixed_predicted_plus_estimated_standardized_field_volume_normalization`
  - candidate ids:
    - `pmc_m1_bare_composite_lab_2026`
    - `pmc_m1_dry_floating_plus_c2x_lab_2026`
    - `pmc_m1_dry_floating_plus_c1x_lab_2026`
    - `pmc_m1_dry_floating_floor_lab_2026`
- why it stays conservative:
  - the PMC source family does support a ceiling-side continuation
  - but the visible lower-only package still does not justify silently promoting that continuation into a broader family-general reopen
  - schedule-equivalent contiguous lower-board splits now stay on the same conservative continuation instead of drifting into the bare-composite family lane
  - neutral same-total mixed-thickness lower-board schedules now also stay on that same conservative continuation even though the predictor blocker remains active
  - disjoint/intervening lower-board topology still stays on that same conservative continuation, but it now carries explicit topology notes and blocker copy instead of reading like the canonical packaged shape
  - disjoint/intervening lower-helper topology in `ceiling_fill` or `ceiling_cavity` also now stays on that same conservative continuation instead of drifting up into `family_general`
  - direct final-row entry and duplicate/swap/remove-rebuild store detours now also converge back onto that same conservative continuation
- neighboring negative guard:
  - CLT lower-only stays fail-closed on both engine and route surfaces
  - open-box lower-only also stays fail-closed on the adjacent split surface
- current test anchors:
  - `packages/engine/src/floor-role-topology.test.ts`
  - `packages/engine/src/raw-floor-packaged-lane-audit.test.ts`
  - `apps/web/features/workbench/raw-floor-packaged-lane-route-audit.test.ts`
  - `packages/engine/src/floor-packaged-lane-disjoint-detour.test.ts`
  - `packages/engine/src/floor-packaged-lane-helper-disjoint-detour.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-disjoint-route-detour.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-helper-disjoint-route-detour.test.ts`
  - `packages/engine/src/floor-split-layer-parity.test.ts`
  - `packages/engine/src/floor-packaged-lane-order-parity.test.ts`
  - `apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-edit-path-parity.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-helper-edit-path-parity.test.ts`
  - `packages/engine/src/impact-predictor-input.test.ts`
  - `packages/engine/src/predictor-floor-system-estimate.test.ts`
  - `packages/engine/src/composite-panel-published-interaction-estimate.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`

### Wall Stability Guardrail

- current posture:
  - wall-side work is still benchmark- and stability-driven, not widening-driven
  - the first deterministic wall audit pack now freezes the contiguous split behavior of the baseline mineral-wool row
- why it matters:
  - mixed floor/wall torture work should not quietly widen floor logic while regressing wall edit stability
- current test anchors:
  - `apps/web/features/workbench/complex-stack-audit.test.ts`
  - `apps/web/features/workbench/wall-seeded-edit-stability.test.ts`

## Current Widening And Tightening Candidates

### Open-Box Timber: Widening-First

- current implementation-backed branches:
  - `open_box basic archetype`
    - candidate id: `tuas_r2b_open_box_timber_measured_2026`
    - current gate:
      - `combined_upper_lower_system`
      - source-band `8 mm` laminate floor covering plus `3 mm` EPS walking
        underlay when the route exposes that finish package
      - open-box fallback uses the exact visible-role tolerance here; `12 mm`
        laminate is unsupported rather than a tolerated source-band finish
      - suspended ceiling with `2 x 13 mm` board and `~100 mm` cavity fill
      - generic `resilient_stud_ceiling` visible-layer shorthand
  - `open_box basic family_a exact`
    - candidate id: `tuas_r2a_open_box_timber_measured_2026`
    - current gate:
      - all `basic archetype` conditions except the ceiling support is explicit `tuas_open_box_ceiling_family_a`
  - `open_box dry archetype`
    - candidate id: `tuas_r5b_open_box_timber_measured_2026`
    - current gate:
      - all `basic` gate conditions
      - `generic_fill ~50 mm`
      - `dry_floating_gypsum_fiberboard ~60 mm`
      - resilient walking underlay remains `~3 mm`; out-of-band underlay is now
        treated as unsupported instead of falling back to `R5b`
- why this is widening-first:
  - the family already has a defended `b` corridor anchor and stronger same-family branches
  - the explicit `family_a` surface is now available, so family splits no longer need to alias through one generic ceiling token
  - widening can stay inside the same upper-plus-lower package semantics instead of inventing a raw bare lane
- safe next move:
  - mine the TUAS measured corpus for near-match rows that preserve the same laminate-plus-ceiling family logic
  - keep `R6b` closed as the exact-only reinforced `b` branch now that the drawing-backed lower-treatment difference is imported
  - keep `R7a` closed as the exact-only heavy/wet `a` branch now that the upper-EPS-board surface and selector guard are landed
  - prefer tolerance and same-package widening before any new topology widening
- do not do next:
  - do not reinterpret these rows as a bare open-box impact lane
  - do not widen through disjoint upper-fill patterns or non-laminate coverings without source-backed anchors
- current contract anchors:
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`

### Open-Web Steel: Widening-First

- current implementation-backed branches:
  - `ubiq_open_web_suspended_vinyl`
    - candidate ids:
      - `ubiq_fl33_open_web_steel_200_lab_2026`
      - `ubiq_fl33_open_web_steel_300_lab_2026`
      - `ubiq_fl28_open_web_steel_200_exact_lab_2026`
      - `ubiq_fl28_open_web_steel_300_exact_lab_2026`
      - `ubiq_fl28_open_web_steel_400_exact_lab_2026`
    - current gate:
      - `suspended_ceiling_only`
      - vinyl floor covering
      - elastic suspended ceiling
      - open-web support form explicit
  - `steel_open_web_carpet_combined`
    - candidate ids:
      - `ubiq_fl28_open_web_steel_300_exact_lab_2026`
      - `ubiq_fl28_open_web_steel_200_exact_lab_2026`
      - `ubiq_fl28_open_web_steel_400_exact_lab_2026`
    - current gate:
      - `combined_upper_lower_system`
      - carpet with acoustic underlay
      - open-web support form explicit
- why this is widening-first:
  - the UBIQ source is strongest on defended combined or suspended packaged systems, not raw bare carriers
  - widening can continue inside the FL-28 and FL-33 style package families first
- safe next move:
  - the first same-family UBIQ sibling import pass is now complete:
    - FL-28 exact `16 mm INEX>FLOOR` open-web rows at `200`, `300`, and `400` are now imported
    - the visible `FL-28 (FRL/D)` open-web `400` row for the conservative `2 x 16 mm` ceiling family is now imported
  - the UBIQ corridor decision is now closed without widening:
    - the defended `FL-24 -> FL-26 -> FL-28` corridor still has no clean new package-variant import beyond the already imported rows
    - only treat `FL-23/25/27` as a deliberate defer/widen decision with explicit posture tests, not as the default follow-on import
    - a second official UBIQ brochure exposes the same open-web FRL/D `2 x 16 mm` package as `FL-26 (FRL/D)` instead of `FL-28 (FRL/D)`
    - that conflict is now frozen as provenance-only drift, not as a widening or runtime rename prompt
  - prefer official-table neighborhoods before any generic lightweight-steel broadening
- do not do next:
  - do not open a bare open-web impact lane from these rows
  - do not blur `open_web_or_rolled` into ambiguous steel families without an explicit support-form rule
- current contract anchors:
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `packages/engine/src/ubiq-candidate-backlog-contract.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`
  - `apps/web/features/workbench/complex-stack-audit.test.ts`

### CLT And Dataholz CLT: Tightening-First

- current implementation-backed branches:
  - `clt_bare`
    - candidate ids:
      - `tuas_x2_clt140_measured_2026`
      - `tuas_c2_clt260_measured_2026`
    - posture:
      - measured interpolation lane
      - conservative raw-slab penalty only for truly bare slabs
  - `clt_dry`
    - candidate ids:
      - `tuas_x5_clt140_measured_2026`
      - `tuas_c5c_clt260_measured_2026`
    - posture:
      - dry upper-only and dry combined interaction branches
  - `dataholz_clt_dry`
    - candidate ids:
      - `dataholz_gdmtxn01_dry_clt_lab_2026`
      - `dataholz_gdmtxa01a_clt_lab_2026`
  - `clt_wet`
    - candidate ids:
      - `dataholz_gdmnxn06_fill_clt_lab_2026`
      - `dataholz_gdmnxn05_wet_clt_lab_2026`
  - `dataholz_clt_wet_suspended`
    - candidate ids:
      - `dataholz_gdmnxa02a_00_clt_lab_2026`
      - `dataholz_gdmnxa02a_02_clt_lab_2026`
- why this is tightening-first:
  - CLT already has multiple defended measured and published branches
  - the highest value is now deviation tightening, monotonicity, and package-strength relations, not a broader generic timber lane
- safe next move:
  - tighten within measured and published CLT subfamilies first
  - keep dry, wet, and suspended variants distinct instead of collapsing them into one universal CLT formula
- do not do next:
  - do not widen CLT by bypassing the existing TUAS and Dataholz branch structure
  - do not merge dry and wet packages into a single generic predictor lane
- current contract anchors:
  - `packages/engine/src/clt-floor-monotonicity.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`

## Current Local Source Corpus Snapshot

This section is implementation-backed from the current local catalog import, not from wishful roadmap assumptions.

### TUAS Exact Corpus

- open-box exact rows in the catalog: `15`
  - `tuas_r2a_open_box_timber_measured_2026`
  - `tuas_r2b_open_box_timber_measured_2026`
  - `tuas_r3a_open_box_timber_measured_2026`
  - `tuas_r3b_open_box_timber_measured_2026`
  - `tuas_r5a_open_box_timber_measured_2026`
  - `tuas_r5b_open_box_timber_measured_2026`
  - `tuas_r6a_open_box_timber_measured_2026`
  - `tuas_r6b_open_box_timber_measured_2026`
  - `tuas_r7a_open_box_timber_measured_2026`
  - `tuas_r7b_open_box_timber_measured_2026`
  - `tuas_r8b_open_box_timber_measured_2026`
  - `tuas_r9b_open_box_timber_measured_2026`
  - `tuas_r2c_open_box_timber_measured_2026`
  - `tuas_r10a_open_box_timber_measured_2026`
  - `tuas_r11b_open_box_timber_measured_2026`
- CLT exact rows in the catalog: `14`
  - `tuas_x2_clt140_measured_2026`
  - `tuas_x3_clt140_measured_2026`
  - `tuas_x4_clt140_measured_2026`
  - `tuas_x5_clt140_measured_2026`
  - `tuas_c2_clt260_measured_2026`
  - `tuas_c3_clt260_measured_2026`
  - `tuas_c4_clt260_measured_2026`
  - `tuas_c5_clt260_measured_2026`
  - `tuas_c7_clt260_measured_2026`
  - `tuas_c2c_clt260_measured_2026`
  - `tuas_c3c_clt260_measured_2026`
  - `tuas_c4c_clt260_measured_2026`
  - `tuas_c5c_clt260_measured_2026`
  - `tuas_c7c_clt260_measured_2026`
- current meaning:
  - the TUAS open-box and CLT branches are already using the full currently imported TUAS floor slice
  - widening here means mining additional source rows from the broader TUAS corpus, not unlocking dormant imported rows that already exist locally
  - the TUAS article reports `15` open-box floors and `15` CLT floors tested in total, so the local open-box import is complete and one CLT row, `C11c`, remains deliberately deferred

### TUAS Candidate Import Backlog

- source universe seen in `TUAS2023FloorSoundInsulationDataR1.xlsx`:
  - open-box timber ids:
    - `R2a`, `R3a`, `R5a`, `R6a`, `R7a`, `R10a`, `R2b`, `R3b`, `R5b`, `R6b`, `R7b`, `R8b`, `R9b`, `R11b`, `R2c`
  - CLT ids:
    - `X2`, `X3`, `X4`, `X5`, `C2`, `C3`, `C4`, `C5`, `C7`, `C2c`, `C3c`, `C4c`, `C5c`, `C7c`, `C11c`
- installation-family hints from `TUAS2023FloorDetails.pdf`:
  - `R2a-R10a` share one suspended-ceiling installation family
  - `R2b-R11b` share a second suspended-ceiling installation family
  - `C2c-C11c` share a combined CLT suspended-ceiling installation family
  - explicit physical difference called out in `TUAS2023FloorDetails.pdf`:
    - `R2a-R10a` uses `25 mm` wooden laths under the open-box slab
    - `R2b-R11b` uses `25 mm` resilient steel studs under the open-box slab
- current imported subset:
  - open-box:
    - `R2a`
    - `R2b`
    - `R3a`
    - `R3b`
    - `R5a`
    - `R5b`
    - `R6a`
    - `R6b`
    - `R7a`
    - `R7b`
    - `R8b`
    - `R9b`
    - `R2c`
    - `R10a`
    - `R11b`
  - CLT:
    - `X2`
    - `X3`
    - `X4`
    - `X5`
    - `C2`
    - `C3`
    - `C4`
    - `C5`
    - `C5c`
- completed safe open-box `b`-family tier:
  - `R2b`
    - reason:
      - `TUAS2023FloorConstructionDrawingsR1.pdf` confirms this is the basic `b`-family laminate + EPS package on the resilient-stud ceiling
      - it closes the missing lower-end `b` anchor without inventing a new visible-layer abstraction
  - `R3b`
    - reason:
      - same `b` suspended-ceiling family as imported `R5b`
      - adds a defended mid-strength packaged row instead of jumping straight from `R2b` to `R5b`
  - `R11b`
    - reason:
      - same `b` family with a wet screed top package
      - brackets the stronger end of the current `b` corridor without inventing a new ceiling-support abstraction
- completed drawing-backed open-box reinforced `b` branch:
  - `R6b`
    - reason:
      - `TUAS2023FloorConstructionDrawingsR1.pdf` page `10/40` shows the same basic upper package already used by `R2b`
        - 8 mm laminate
        - 3 mm EPS underlay
      - the real branch difference is the lower treatment, which the current role surface can already express honestly:
        - 25 mm resilient stud ceiling
        - 100 mm glass wool
        - `4 x 15 mm` gypsum board
      - this is therefore safe as a narrow exact import without widening the broader `family_b` shorthand or predictor family-archetype lane
- completed explicit open-box `a`-family tier:
  - `R3a`
    - reason:
      - same open-box family ladder as `R2a`
      - now lands exactly because the visible-layer route can carry the family split through `tuas_open_box_ceiling_family_a`
  - `R5a`
    - reason:
      - same `a` family, materially stronger than `R3a`
      - now lands without aliasing `R5b` because the exact route distinguishes the two suspended-ceiling families explicitly
- current engine groundwork:
  - predictor-side exact inference carries an explicit `tuas_open_box_family_a` vs `tuas_open_box_family_b` support-class signal
  - the visible-layer / workbench surface now exposes `family_a` via `tuas_open_box_ceiling_family_a`
  - the generic `resilient_stud_ceiling` material stays as the shorthand for the imported `b` corridor
- completed hybrid lower-treatment open-box tier:
  - `R7b`, `R8b`, `R9b`, `R2c`
  - reason:
    - the visible exact route now carries the defended hybrid lower morphology (`45 mm` family A cavity + `25 mm` resilient stud)
    - the same route now also carries the narrow geotextile/screed and no-fill variants without reopening a generic topology lane
- post-corridor numeric screening from `TUAS2023FloorSoundInsulationDataR1.xlsx`:
  - geometry-cleared and now imported:
    - `R2b`
      - `Ln,w 46`, `Rw 62`
      - drawing result:
        - `TUAS2023FloorConstructionDrawingsR1.pdf` shows the same visible-layer shorthand already used by the imported `b` corridor:
          - 8 mm laminate
          - 3 mm EPS underlay
          - 25 mm resilient stud ceiling
          - 2 x 13 mm gypsum board
          - 100 mm glass wool
      - implementation outcome:
        - `R2b` is now the basic `b`-family anchor
        - the generic `resilient_stud_ceiling` surface now lands on the `b` corridor rather than aliasing family `a`
  - branch-audit resolved and now imported:
    - `R6b`
      - `Ln,w 47`, `Rw 71`
      - spreadsheet companions:
        - `Ln,w+CI 44`
        - `Ln,w+CI,50-2500 48`
        - `Rw+C 69.5361374042257`
      - drawing result:
        - `TUAS2023FloorConstructionDrawingsR1.pdf` page `10/40` keeps the same `b`-family top package as `R2b`
        - the lower branch is explicitly stronger:
          - `4 x 15 mm` gypsum board instead of `2 x 13 mm`
      - implementation outcome:
        - `R6b` now lands as an exact reinforced lower-treatment `b` branch
        - current predictor exact-id inference can reach it directly from:
          - `tuas_open_box_family_b`
          - `boardLayerCount 4`
          - `boardThicknessMm 15`
        - the broader published-family archetype lane remains unchanged and still stays anchored to `R2b` / `R5b`
  - branch-surface resolved and now imported:
    - `R7a`
      - `Ln,w 63`, `Rw 60`
      - drawing result:
        - `TUAS2023FloorConstructionDrawingsR1.pdf` page `5/40` shows a materially heavier top package:
          - 50 mm EPS
          - 40 mm screed
          - 3 mm EPS underlay
          - 8 mm laminate
        - the lower side still follows the existing `a`-family support morphology from `R5a` (`TUAS2023FloorConstructionDrawingsR1.pdf` page `3/40`)
      - implementation outcome:
        - `R7a` now lands as an exact-only heavy/wet `a` branch
        - the catalog now has a dedicated rigid upper-insulation-board surface through `eps_floor_insulation_board`
        - engine and workbench inference both keep that layer on `upper_fill`
        - the open-box published-family selector now guards against non-dry upper packages collapsing onto the `R2b` basic archetype
  - support-surface resolved and now imported:
    - `R6a`
      - `Ln,w 60`, `Rw 56`
      - drawing result:
        - `TUAS2023FloorConstructionDrawingsR1.pdf` page `4/40`
        - same lower `family_a` morphology as the imported `a` corridor, but the lower board schedule is mixed (`2 x 13 mm` plus `4 x 15 mm`)
      - implementation outcome:
        - exact row `tuas_r6a_open_box_timber_measured_2026` is now landed
        - exact visible and predictor surfaces now carry the mixed lower-board schedule honestly
        - grouped packed shorthand `26 mm + 60 mm` is also defended on the same exact row
        - lab support remains `Rw` plus `Ln,w`, while `Ln,w+CI` stays unsupported
        - field continuation remains `Ln,w`, `L'n,w`, and `L'nT,w`, while `L'nT,50` stays unsupported
    - `R10a`
      - `Ln,w 55`, `Rw 56`
      - spreadsheet companions:
        - `Ln,w+CI 55`
        - `Ln,w+CI,50-2500 56`
        - `Rw+C 50.89680103538985`
      - drawing result:
        - `TUAS2023FloorConstructionDrawingsR1.pdf` page `6/40`
        - same lower `family_a` morphology as the imported corridor
        - the upper package is a staged mixed visible stack:
          - `13 mm` glass wool board
          - `15 mm` gypsum board
          - `3 mm` mortar
          - `15 mm` gypsum board
          - `3 mm` EPS underlay
          - `8 mm` laminate
      - implementation outcome:
        - exact row `tuas_r10a_open_box_timber_measured_2026` is now landed
        - the exact visible-layer route now carries a dedicated `floating_screed` material/thickness schedule for the source-backed split stack
        - lab support now carries `Rw`, `Ln,w`, and `Ln,w+CI`
        - field continuation now carries `Ln,w`, `L'n,w`, `L'nT,w`, and `L'nT,50`
        - over-abstracted `upper_fill 13 mm + dry_floating_gypsum_fiberboard 33 mm` shorthand still remains non-exact on `family_archetype`
        - predictor derivation still stays fail-closed on the staged mixed floating-screed package
  - drawing-audit-resolved hybrid lower-treatment set:
    - `R7b` (`Ln,w 47`, `Rw 72`)
      - `TUAS2023FloorConstructionDrawingsR1.pdf` page `11/40`
      - landed as exact row `tuas_r7b_open_box_timber_measured_2026`
    - `R8b` (`Ln,w 50`, `Rw 72`)
      - `TUAS2023FloorConstructionDrawingsR1.pdf` page `12/40`
      - landed as exact row `tuas_r8b_open_box_timber_measured_2026`
    - `R9b` (`Ln,w 45`, `Rw 68`)
      - `TUAS2023FloorConstructionDrawingsR1.pdf` page `13/40`
      - landed as exact row `tuas_r9b_open_box_timber_measured_2026`
      - source correction is now frozen:
        - `R9b` carries `40 mm` screed + `3 mm` EPS underlay + `8 mm` laminate
        - no extra upper `plastic-layer` or `geotextile` item is present on that top package
    - `R2c` (`Ln,w 70`, `Rw 54`)
      - `TUAS2023FloorConstructionDrawingsR1.pdf` page `15/40`
      - landed as exact row `tuas_r2c_open_box_timber_measured_2026`
      - the no-fill variant closed without reopening a generic `__none` topology widening lane
  - why no new TUAS import opened after the finished drawing audit:
    - the spreadsheet values remain trustworthy, but the finished drawing/detail audit shows the remaining rows need new surfaces rather than just a catalog copy pass
    - `TUAS2023FloorDetails.pdf` page `5/7` visually confirms the existing family split remains correct:
      - `R2a-R10a` uses `25 mm` wooden laths
      - `R2b-R11b` uses `25 mm` resilient steel studs
    - `R7a` is already closed because the dedicated upper-EPS-board surface and selector guard exist
    - the nearby open-web noncanonical continuation parity debt is also already closed
    - the next safe move is therefore no longer another immediate TUAS row import; it is a re-rank toward the next evidence-backed slice
  - current re-rank result on `2026-04-10`:
    - the next floor code slice first moved to UBIQ before TUAS
    - reason:
      - remaining TUAS open-box rows now need new visible/support surfaces rather than another safe same-package import
    - current follow-on after that UBIQ close-out and the landed `R6a` surface:
      - the next open floor code slice now moves from TUAS open-box back to TUAS CLT decision work
      - the current implementation comparison now narrows the next TUAS move further:
        - the same-family open-box staged-package debt is closed because `R10a` is now landed
        - the hybrid lower-treatment branch is now fully closed through `R2c`
        - deferred TUAS CLT imports are now the narrower next floor decision surface
        - that TUAS CLT decision slice is now selected
- deferred TUAS CLT tier:
  - `C7`
  - `C2c`, `C3c`, `C4c`, `C7c`, `C11c`
  - reason:
    - these remain worthwhile future imports after the staged-upper and heavy dry-top CLT tiers are now landed through `C5`
    - the selected next step is now CLT-local again because the hybrid open-box branch is closed and `C7` is the narrowest remaining exact-row debt
  - re-rank result on `2026-04-10`:
    - closed slices:
      - `tuas_x3_staged_upper_clt_surface_design_v1`
      - `tuas_c3_staged_upper_clt_surface_design_v1`
      - `tuas_x4_heavy_dry_top_clt_surface_design_v1`
      - `tuas_c4_heavy_dry_top_clt_surface_design_v1`
      - `tuas_c5_heavy_dry_top_clt_surface_design_v1`
    - reason:
      - `X3` reused the landed `R10a` staged upper-package material/thickness schedule without introducing a new lower-treatment surface
      - exact row `tuas_x3_clt140_measured_2026` is now landed with lab `Ln,w 52`, `Ln,w+CI 52`, `Ln,w+CI,50-2500 60`, `Rw 49`
      - field continuation is now `L'n,w 54`, `L'nT,w 52`, `L'nT,50 60`
      - exact row `tuas_c3_clt260_measured_2026` is now landed with lab `Ln,w 47`, `Ln,w+CI 49`, `Ln,w+CI,50-2500 53`, `Rw 54`
      - field continuation is now `L'n,w 49`, `L'nT,w 47`, `L'nT,50 53`
      - exact row `tuas_x4_clt140_measured_2026` is now landed with lab `Ln,w 50`, `Ln,w+CI 51`, `Ln,w+CI,50-2500 58`, `Rw 55`
      - field continuation is now `L'n,w 52`, `L'nT,w 50`, `L'nT,50 58`
      - exact row `tuas_c4_clt260_measured_2026` is now landed with lab `Ln,w 45`, `Ln,w+CI 46`, `Ln,w+CI,50-2500 51`, `Rw 61`
      - field continuation is now `L'n,w 47`, `L'nT,w 45`, `L'nT,50 51`
      - exact row `tuas_c5_clt260_measured_2026` is now landed with lab `Ln,w 60`, `Ln,w+CI 62`, `Ln,w+CI,50-2500 63`, `Rw 61`
      - field continuation is now `L'n,w 62`, `L'nT,w 60`, `L'nT,50 63`
      - adjacent bare-CLT visible fallback now also admits `tuas_x4` as a third exact sibling and is frozen at `Ln,w 57.7` / `Rw 40.6`
      - over-abstracted `X4`, `C4`, and `C5` shorthand still stay off the exact lane at `family_general` `94%` fit against `tuas_x5`
      - packed `60 mm` gypsum shorthand still stays exact on `tuas_c5_clt260_measured_2026`
      - the `C5` close-out also caught and re-closed a route leak:
        - under-described combined direct-fixed CLT stacks briefly tried to reuse `tuas_c5` through a profile-mismatched `family_general` lane
        - the narrow `massTimberCombinedDirectFixedTierHold` now keeps those stacks screening-only unless a real profile-aligned candidate exists
        - the hybrid decision is now implemented and closed:
        - exact row `tuas_r7b_open_box_timber_measured_2026` is landed with lab `Ln,w 47`, `Ln,w+CI 47`, `Ln,w+CI,50-2500 48`, `Rw 72`
        - field continuation is now `L'n,w 49`, `L'nT,w 46.6`, `L'nT,50 47.6`
        - the old separator-free proxy still stays broader `family_general` at `54%` fit, but it is now re-ranked to `tuas_r9b`, `tuas_r7b`, `tuas_r7a` with `Ln,w 48.3`, `Ln,w+CI 49.2`, and `Rw 67.3`
        - exact row `tuas_r8b_open_box_timber_measured_2026` is now landed with lab `Ln,w 50`, `Ln,w+CI 49`, `Ln,w+CI,50-2500 50`, `Rw 72`
        - field continuation is now `L'n,w 52`, `L'nT,w 49.6`, `L'nT,50 49.6`
        - exact row `tuas_r9b_open_box_timber_measured_2026` is now also landed with lab `Ln,w 45`, `Ln,w+CI 46`, `Ln,w+CI,50-2500 48`, `Rw 68`
        - field continuation is now `L'n,w 47`, `L'nT,w 44.6`, `L'nT,50 47.6`
        - TUAS drawing page `13/40` is now frozen as the source correction:
          - `R9b` carries `40 mm screed + 3 mm EPS underlay + 8 mm laminate`
          - no extra upper `plastic-layer` or `geotextile` item is present on that top package
        - exact row `tuas_r2c_open_box_timber_measured_2026` is now also landed with lab `Ln,w 70`, `Ln,w+CI 70`, `Ln,w+CI,50-2500 70`, `Rw 54`
        - field continuation is now `L'n,w 72`, `L'nT,w 69.6`, `L'nT,50 69.6`
        - the no-fill hybrid lower-treatment branch is therefore closed without reopening a generic `__none` topology lane
      - historical closed slice: `tuas_clt_remaining_combined_source_schedule_research_v1`
      - current closed-truth after the source-schedule research pass:
        - TUAS drawing pages `25/40` through `30/40` now freeze the real visible schedules for `C2c/C3c/C4c/C5c/C7c/C11c`
        - exact row `tuas_c2c_clt260_measured_2026` is now landed with lab `Ln,w 35`, `Ln,w+CI 39`, `Ln,w+CI,50-2500 44`, `Rw 70`
        - exact row `tuas_c7_clt260_measured_2026` still stays narrow under engine split/noise parity and route-side contiguous split invariance
        - visible `C5c` stacks stay on the predictor-backed combined lane with `Ln,w 38`, `Ln,w+CI 42`, `Ln,w+CI,50-2500 44`, and `Rw 75`
        - `C5c` remains a defended visible-layer combined corridor, but still not a direct source-schedule exact row
        - source-backed `C3c`, `C4c`, `C11c`, and `C7c` were all drawing-backed at that point, but only `C7c` was the narrowest next import candidate
        - the Dataholz dry combined predictor lineage and CLT `lower_only` guard were both re-closed after `C2c` landed
      - historical closed slice: `tuas_c7c_combined_wet_clt_surface_design_v1`
        - exact row `tuas_c7c_clt260_measured_2026` is now landed with lab `Ln,w 30`, `Ln,w+CI 35`, `Ln,w+CI,50-2500 44`, `Rw 75`
        - field continuation is now `L'n,w 32`, `L'nT,w 30`, `L'nT,50 44`
        - `C3c/C4c/C11c` remain screening-only after `C7c` lands
        - the root cause is now explicit:
          - combined CLT visible stacks with lower treatment plus multi-entry `floating_screed` no longer auto-normalize into inferred or predictor-derived shorthand lanes
          - `C3c/C4c` therefore stay fail-closed and now warn toward `C7c` as the closest same-family candidate
      - historical closed slice: `tuas_remaining_combined_clt_exact_import_decision_matrix_v1`
        - exact row `tuas_c3c_clt260_measured_2026` is now landed with lab `Ln,w 27`, `Ln,w+CI 29`, `Ln,w+CI,50-2500 43`, `Rw 73`
        - field continuation is now `L'n,w 29`, `L'nT,w 27`, `L'nT,50 43`
        - source correction: TUAS drawing page `26/40` shows `13 mm gypsum board + 2 x 15 mm gypsum board`, not the stale `13 mm glass wool` upper-fill proxy
        - exact split parity now accepts only merge-safe contiguous same-role/same-material packed thickness equivalents, so mixed-material schedules still need explicit exact rows
      - historical closed slice: `tuas_c4c_combined_heavy_dry_exact_candidate_v1`
        - exact row `tuas_c4c_clt260_measured_2026` is now landed with lab `Ln,w 24`, `Ln,w+CI 26`, `Ln,w+CI,50-2500 40`, `Rw 74`
        - field continuation is now `L'n,w 26`, `L'nT,w 24`, `L'nT,50 40`
        - route-control result: under-described combined CLT lower board/fill stacks without explicit `ceiling_cavity` remain fail-closed even though profile-aligned `C4c` now exists
      - historical closed slice: `tuas_c11c_wet_stack_anomaly_audit_v1`
        - decision: keep `C11c` deferred / fail-closed; do not import it as an exact floor row yet
        - reason: the visible schedule is known (`CLT 260`, `30 mm` glass wool, geotextile, `40 mm` screed, same suspended lower ceiling), but the source tuple `Ln,w 59`, `Ln,w+CI 60`, `Ln,w+CI,50-2500 60`, `Rw 74` is still anomalously weak beside the frozen combined CLT anchors
        - anomaly scale now locked by test:
          - `35 dB` weaker than same-airborne `C4c` on `Ln,w`
          - `29 dB` weaker than nearby wet combined `C7c` on `Ln,w`
          - `21 dB` weaker than predictor-backed dry combined `C5c` on `Ln,w`
        - current route behavior: visible C11c stays screening-only with `Rw 49`, no exact match, no predictor estimate, and all impact outputs unsupported
      - `C11c` remains later combined CLT backlog because its exact-import semantics are now deliberately deferred, not because its visible schedule is unknown
      - the repo-local TUAS measured reference fixture now exposes:
        - exact `C2c`
        - exact `C3c`
        - exact `C4c`
        - exact `C7c`
        - predictor-backed imported `C5c`
- current contract anchors:
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `packages/engine/src/tuas-candidate-backlog-contract.test.ts`
  - `packages/engine/src/tuas-post-corridor-screening-contract.test.ts`
  - `packages/engine/src/tuas-support-surface-decision-contract.test.ts`
  - `packages/engine/src/tuas-clt-backlog-decision-contract.test.ts`
  - `packages/engine/src/tuas-c11c-wet-stack-anomaly-audit.test.ts`

### Dataholz CLT Exact Corpus

- Dataholz CLT exact rows in the catalog: `9`
- predictor-active CLT family rows today: `8`
  - `dataholz_gdmnxn02_wet_clt_lab_2026`
  - `dataholz_gdmnxn02_05_wet_clt_lab_2026`
  - `dataholz_gdmtxn01_dry_clt_lab_2026`
  - `dataholz_gdmtxa01a_clt_lab_2026`
  - `dataholz_gdmnxn06_fill_clt_lab_2026`
  - `dataholz_gdmnxn05_wet_clt_lab_2026`
  - `dataholz_gdmnxa02a_00_clt_lab_2026`
  - `dataholz_gdmnxa02a_02_clt_lab_2026`
- exact-only CLT tightening slack today: `1`
  - `dataholz_gdmtxa04a_clt_lab_2026`
- current meaning:
  - the wet no-lining Dataholz exact slack is now consumed on the predictor-exact path:
    - `dataholz_gdmnxn02_wet_clt_lab_2026`
    - `dataholz_gdmnxn02_05_wet_clt_lab_2026`
  - the only remaining imported CLT exact-only row is not another straightforward wet/fill fingerprint:
    - `dataholz_gdmtxa04a_clt_lab_2026` still carries `manualMatch: false`
    - it currently routes through the dry CLT estimate neighborhood rather than an exact predictor/manual lane
  - the `2026-04-09` boundary review narrowed the reason further:
    - the official `GDMTXA04A` source still describes the top dry-floor layer only as `65.0 mm, m' approx. 37 kg/m²`
    - the nearby `GDMTXA01a` source names an explicit `20 mm` dry screed element (`Rigidur`)
    - local `dry_floating_gypsum_fiberboard 65 mm` therefore remains a convenience mapping for preset-only exact-id resolution, not yet an honest visible exact surface
  - the next CLT decision is now effectively made:
    - keep `gdmtxa04a` estimate-routed on visible and predictor surfaces
    - do not treat it as generic CLT widening slack until a more honest material surface exists
- latest source-truth audit:
  - slice id: `dataholz_clt_source_truth_audit_v1`
  - status: closed as no-widening source-truth guard
  - implementation result:
    - no solver, catalog, selector, or workbench runtime behavior changed
    - all `9` imported Dataholz CLT rows are now pinned to explicit catalog
      `Rw`, `Ctr`, `Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI` source truth
    - official-id field continuations now measure `L'n,w`, `L'nT,w`, and
      `L'nT,50` support/unsupported buckets for every Dataholz CLT row
    - visible raw/tagged routes now explicitly prove:
      - manual-match-enabled CLT rows still resolve exact
      - `GDMNXA02A-00` and `GDMNXA02A-02` remain screening-only on visible rows
      - `GDMTXA04A` remains routed to the dry CLT estimate candidate
        `dataholz_gdmtxa01a_clt_lab_2026`, not to a visible exact row
    - disjoint/intervening dry CLT role splits are now measured as broader
      family-general fallback with an explicit duplicate-role warning instead
      of silently preserving the exact row
  - current test anchors:
    - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
    - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`

### UBIQ Open-Web Steel Corpus

- exact open-web rows in the catalog: `18`
  - `ubiq_fl24_open_web_steel_200_16mm_exact_lab_2026`
  - `ubiq_fl24_open_web_steel_200_exact_lab_2026`
  - `ubiq_fl24_open_web_steel_300_16mm_exact_lab_2026`
  - `ubiq_fl24_open_web_steel_300_exact_lab_2026`
  - `ubiq_fl24_open_web_steel_400_16mm_exact_lab_2026`
  - `ubiq_fl24_open_web_steel_400_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_200_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_300_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_400_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_200_16mm_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_200_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_300_16mm_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_300_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_400_16mm_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_400_exact_lab_2026`
- bound FL-33 open-web rows in the catalog: `3`
  - `ubiq_fl33_open_web_steel_200_lab_2026`
  - `ubiq_fl33_open_web_steel_300_lab_2026`
  - `ubiq_fl33_open_web_steel_400_lab_2026`
  - current meaning:
  - the active predictor branches already cite the full currently imported UBIQ open-web neighborhood
  - the first same-family UBIQ sibling import pass is complete, so exact-match and bound-match coverage include the missing FL-28 `16 mm` siblings and the `400 mm` conservative bound sibling
  - the adjacent-family widening passes are complete for `FL-24` and `FL-26`, so direct exact coverage now reaches both source-backed neighbors below the FL-28 corridor without dropping into the much weaker `FL-23/25/27` band
  - the lightweight-steel `lower_only` family-general fallback can now legitimately prefer the imported `FL-26` `2 x 16 mm` corridor when the visible ceiling package matches that lower profile more closely than `FL-28`
  - widening here should next mine adjacent packaged-system variants from the official UBIQ tables before any raw open-web impact lane is considered
  - the current source trace also has a visible-code drift:
    - the exact `3 x 16 mm` open-web family is visibly labeled `UBIQ FL-28` in the May 2023 brochure
    - the bound `2 x 16 mm` open-web FRL/D family is visibly labeled `UBIQ FL-28 (FRL/D)` there
    - local `ubiq_fl33_*` ids should therefore be treated as stable internal ids pending cleanup, not as the authoritative visible row code from the current source URL

### UBIQ Candidate Import Backlog

- visible source rows from the May 2023 official acoustic table on page `7`:
  - `UBIQ FL-28`
  - open-web trusses
  - `3 x 16 mm` resilient ceiling package
  - joist depths `200`, `300`, `400`
  - both `16 mm` and `19 mm INEX>FLOOR` variants are published
- visible source rows from the May 2023 official FRL/D table on page `14`:
  - `UBIQ FL-28 (FRL/D)`
  - open-web trusses
  - `2 x 16 mm` resilient ceiling package
  - joist depths `200`, `300`, `400`
  - `19 mm INEX>FLOOR`
- current imported exact subset:
  - `UBIQ FL-24`
  - `UBIQ FL-26`
  - open-web trusses
  - resilient `2 x 16 mm` fire-rated plasterboard ceiling package with `145 mm` insulation and `65 mm` cavity
  - joist depths `200`, `300`, `400`
  - both `16 mm` and `19 mm INEX>FLOOR` variants are now imported
  - `UBIQ FL-28`
  - open-web trusses
  - direct `2 x 13 mm` plasterboard ceiling package for `FL-24`
  - joist depths `200`, `300`, `400`
  - resilient `3 x 16 mm` fire-rated plasterboard ceiling package with `145 mm` insulation and `65 mm` cavity for `FL-28`
  - imported depths: `200`, `300`, `400` across all three imported families
- current imported bound subset:
  - the `200`, `300`, and `400` local `ubiq_fl33_*` open-web bound rows are imported
  - the visible May 2023 source family behind that bound package is `UBIQ FL-28 (FRL/D)`
- completed first UBIQ import tier:
  - same-family exact siblings from visible `UBIQ FL-28`:
    - `200 mm` joist, `16 mm INEX>FLOOR`
      - `Rw / Rw+Ctr = 62 / 55`
      - `Ln,w / Ln,w+Ci` with timber + underlay: `52 / 51`
    - `300 mm` joist, `16 mm INEX>FLOOR`
      - `Rw / Rw+Ctr = 63 / 57`
      - `Ln,w / Ln,w+Ci` with timber + underlay: `51 / 49`
    - `400 mm` joist, `16 mm INEX>FLOOR`
      - `Rw / Rw+Ctr = 63 / 57`
      - `Ln,w / Ln,w+Ci` with timber + underlay: `50 / 48`
  - same-family bound sibling from visible `UBIQ FL-28 (FRL/D)`:
    - `400 mm` joist, `19 mm INEX>FLOOR`
      - `Rw / Rw+Ctr = 63 / 58`
      - timber + underlay: `Ln,w <= 51`
      - carpet + underlay: `Ln,w+Ci <= 45`
  - current value:
    - exact-match and bound-match coverage now include the missing siblings inside the exact same published open-web package families the product already uses
    - this tightened corridor coverage without inventing a new topology or broadening across support-form ambiguity
- completed adjacent-family import tier:
  - visible `UBIQ FL-24`:
    - `200 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 59 / 52`, timber + underlay `Ln,w / Ln,w+Ci = 55 / 54`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 60 / 53`, timber + underlay `Ln,w / Ln,w+Ci = 55 / 54`
    - `300 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 60 / 54`, timber + underlay `Ln,w / Ln,w+Ci = 54 / 52`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 61 / 55`, timber + underlay `Ln,w / Ln,w+Ci = 54 / 52`
    - `400 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 60 / 54`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 61 / 55`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
  - current value:
    - this extends direct exact coverage one step below FL-28 while still staying inside the `45 or less` carpet corridor
  - visible `UBIQ FL-26`:
    - `200 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 60 / 53`, timber + underlay `Ln,w / Ln,w+Ci = 54 / 53`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 61 / 55`, timber + underlay `Ln,w / Ln,w+Ci = 54 / 53`
    - `300 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 61 / 55`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 62 / 57`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
    - `400 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 61 / 55`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 62 / 57`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
  - current value:
    - exact coverage now spans the defended `FL-24 -> FL-26 -> FL-28` open-web corridor while still staying inside the `45 or less` carpet band
    - the next widening question is therefore whether to stop at this corridor or deliberately enter the materially weaker `FL-23/25/27` band
- active remaining UBIQ open-web backlog:
  - imported adjacent-family exact corridor:
    - `FL-24`
    - `FL-26`
    - current reason:
      - both families stay at `45 or less` on carpet + underlay across the visible `200 / 300 / 400 mm` corridor
      - their timber + underlay values stay inside the defended `55 -> 53` band immediately below FL-28
      - this makes them credible one-step and two-step widenings without broadening into the much weaker band
  - explicitly deferred weaker families from the same acoustic table:
    - `FL-23`
    - `FL-25`
    - `FL-27`
    - current reason:
      - their timber + underlay values stay around `71 / 70 / 70` or `70 / 69 / 69`
      - their carpet + underlay values stay around `64 / 63` or `63 / 62`
      - that is materially below the current supported FL-28 corridor, so importing them next would broaden the lightweight-steel family too aggressively
  - implementation note:
    - the next step is no longer another automatic adjacent-family import
    - the `2026-04-10` UBIQ corridor decision is now closed:
      - the product stays stopped at the defended `FL-24 -> FL-26 -> FL-28` corridor for now
      - no corridor-internal package variant was strong enough to justify a new import
      - only after a future explicit posture slice should `FL-23/25/27` be reconsidered
- source-trace note:
  - the current `sourceUrl` for local `ubiq_fl32_*` and `ubiq_fl33_*` rows resolves to the May 2023 brochure
  - in that brochure the visible FRL/D steel-joist family code is `FL-17 (FRL/D)` and the visible open-web FRL/D family code is `FL-28 (FRL/D)`
  - a second current official brochure now also matters:
    - `INEX-FLOOR-FLOOR-SOLUTIONS-16PP-2023-1.pdf`
    - there the visible open-web FRL/D family code is `FL-26 (FRL/D)` for the same `2 x 16 mm` package
  - the `2026-04-09` provenance/boundary-freeze slice is now closed:
    - keep the current internal ids and labels stable as internal runtime references
    - keep the visible-family drift documented explicitly in docs and contract tests
    - do not rename published-family lanes ad hoc just because the source brochure uses different visible FRL/D family codes
- current contract anchors:
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `packages/engine/src/ubiq-candidate-backlog-contract.test.ts`
- `2026-04-09` primary-source recheck:
  - rechecked against the May 2023 official UBIQ brochure:
    - `FL-24` and `FL-26` still sit in the defended corridor immediately below `FL-28`
    - `FL-23`, `FL-25`, and `FL-27` still sit in the materially weaker band
  - current reason to keep deferring `FL-23/25/27` remains intact:
    - timber + underlay values stay around `71 / 70 / 70` or `70 / 69 / 69`
    - carpet + underlay values stay around `64 / 63` or `63 / 62`
  - decision impact:
    - do not use UBIQ weaker-band widening as the first post-wall corridor slice
    - provenance/source-trace cleanup is now closed as a docs plus contract freeze rather than a runtime rename
    - the current cross-brochure FRL/D conflict also does not justify a new corridor import
    - if UBIQ work resumes again, the next honest UBIQ move is either:
      - a deliberate weaker-band defer/widen decision with explicit posture tests
      - or a later source-backed package-variant widening inside the current defended corridor

### Dataholz Timber-Frame Corpus

- Dataholz timber-frame exact rows in the catalog: `10`
- current meaning:
  - the `dataholz_timber_frame_role_gated_raw_predictor_audit_v1` slice is
    closed as a source-truth audit and no-widening decision
  - the prior blocker was that open-box, open-web, and Dataholz CLT boundary
    decisions still needed closure; those are now closed enough, and the
    timber-frame audit confirmed that generic raw widening is still not
    defensible
  - curated exact rows, explicit `base_structure` routes, predictor/family
    estimates, low-confidence continuations, and raw fail-closed carriers must
    remain separate
  - `packages/engine/src/dataholz-timber-frame-source-truth-audit.test.ts`
    now pins all `10` imported rows to numeric source truth, official-id field
    continuations, visible exact/raw route posture, split-topology behavior, and
    supported/unsupported output buckets
  - `apps/web/features/workbench/dataholz-timber-frame-source-truth-route.test.ts`
    now verifies that exact Dataholz `GDRNXA11A` reaches the workbench output
    cards with source `Rw 83`, `Ctr -17`, `Ln,w 42`, `CI +2`,
    `CI,50-2500 +14`, `Ln,w+CI 44`, `L'n,w 44`, `L'nT,w 42`, and
    `L'nT,50 56`
  - workbench floor-study `Ctr` cards must read the active floor-system
    companion before live airborne screening estimates; this prevents exact
    Dataholz source `Ctr -17 dB` from being masked by screening `-6 dB`
  - do not use the timber-frame corpus to reopen generic raw
    `timber_frame_floor`, `timber_joist_floor`, or
    `engineered_timber_structural` lanes unless source-backed role evidence is
    strong enough to preserve the weaker-carrier guard

## Immediate Research Order

Scope note:

- this ledger ranks source-family research, not the active implementation slice
- the active implementation slice selected on `2026-04-13` is
  `wall_selector_wider_trace_matrix_v1`
- raw-floor, CLT-local, UBIQ, and Dataholz source-family widening remains
  deferred unless a future candidate first gets value/origin/support/card trace
  evidence

1. Floor airborne companion semantics
   - current status:
     - latest closed implementation slice:
       `floor_airborne_companion_c_ctr_semantic_audit_v1`
   - closed purpose:
     - preserved the now-fixed Dataholz `Ctr` source-card path while resolving
       the TUAS row `42` `Rw+C` companion semantics honestly
     - prevented `C`, `Ctr`, `Rw+C`, and `Rw+Ctr` from being mixed by engine
       target-output support or workbench output cards
   - closed checks:
     - Dataholz rows with explicit `RwCtrSemantic: "ctr_term"` still expose
       source `Ctr` and are not masked by screening companions
     - all `31` imported TUAS exact rows with an airborne companion carry
       `RwCtrSemantic: "rw_plus_c"` and do not get mislabeled as `Ctr`
     - requested `C` support is source-backed and tested; requested `Ctr` stays
       unsupported for those TUAS rows
     - engine support changes have matching workbench output-card tests
2. TUAS measured corpus
   - current status:
     - latest audit closed as a no-widening source-truth decision:
       `tuas_measured_lightweight_timber_source_triage_v1`
   - closed checks:
     - `packages/engine/src/tuas-measured-source-truth-audit.test.ts` pins all
       `29` imported TUAS measured open-box / CLT rows to numeric source truth
       for `Rw`, `Rw+C`, `Ln,w`, `CI`, `CI,50-2500`, `Ln,w+CI`, and official-id
       field continuations
     - `R6b`, `R7a`, `R7b`, `R8b`, `R9b`, `R10a`, and `R2c` remain exact only
       under their defended visible schedules
     - raw bare, lower-only, and upper-only open-box carrier attempts remain
       impact fail-closed
     - missing-role raw CLT / hybrid open-box / combined-CLT drift is numeric and
       intentional, not a hidden widening lane
     - `C11c` remains a source anomaly / fail-closed row and must not reopen
       combined-CLT inference
     - workbench cards did not need expansion in this slice because output
       support buckets did not change
3. Dataholz timber-frame component sheets and imported exact corpus
   - current status:
     - latest audit closed; keep as defended no-widening/fail-closed reference
   - immediate purpose:
     - preserve the explicit source-truth guards and only reopen this family
       with stronger component-sheet evidence, not with generic raw inference
   - closed checks:
     - raw-vs-tagged drift around `dataholz_gdsnxn01a_timber_frame_lab_2026`
       remains intentional
     - explicit `base_structure` exact behavior for imported timber-frame rows is
       measured against source truth
     - helper-only raw timber carriers remain fail-closed unless role evidence
       is explicit
     - contiguous split noise preserves exact rows; disjoint/intervening role
       splits do not promote weak carriers
4. UBIQ official system tables
   - current status:
     - the corridor decision is closed for now
     - the current official-source conflict is frozen as provenance drift, not as new coverage
   - treat bare open-web support as a separate research question
5. Dataholz CLT component sheets
   - first tightening target for CLT calibration after the selected timber-frame
     audit
   - use them to tighten deviation, not to justify a generic universal lightweight-floor lane
6. Broader modeling literature
   - useful for later model research
   - not enough by itself to open new production lanes without family-specific source anchors

## External Sources

- TUAS open measured dataset article:
  - https://www.diva-portal.org/smash/get/diva2%3A1781019/FULLTEXT01.pdf
  - current value:
    - 30 wooden and 8 concrete floors
    - ISO 10140 / ISO 717 results
    - construction drawings and resilient-layer metadata
- TUAS raw dataset:
  - https://data.mendeley.com/datasets/y83p8mpryd/2
- UBIQ official floor systems:
  - https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf
  - current value:
    - official system tables for timber and steel joists
    - strongest current source for defended open-web combined families
- Dataholz example CLT sheet:
  - https://www.dataholz.eu/en/index/download/en/gdmtxa04a-0.pdf
  - current value:
    - exact component-level `Rw`, `Ln,w`, and `CI50` style anchors with full layer schedules
- CLT laboratory review:
  - https://www.mdpi.com/2076-3417/12/15/7642
  - current value:
    - supports the direction that multilayered CLT packages outperform bare slabs
- ANN-based wooden-floor study:
  - https://www.mdpi.com/2624-599X/4/1/13
  - current value:
    - useful as later model-research context, not as direct production evidence
- FEM timber-floor study:
  - https://www.sciencedirect.com/science/article/pii/S0141029624006928
  - current value:
    - shows model-based prediction can be reasonable with good inputs, but does not replace source-backed family lanes

## Decision Rules

- do not open a new lane merely because a family looks physically plausible
- prefer narrow same-family widening over broad cross-family formula widening
- if the best available source only supports a combined upper-plus-lower system, do not reinterpret it as a bare-carrier lane
- if the source does not defend `CI`, `DeltaLw`, or `L'nT,50`, keep those metrics conditional or unsupported
- treat this ledger as the decision checkpoint before any new floor-family widening PR
