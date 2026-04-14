# Dynamic Calculator Plan

Document role:

- active execution plan for dynamic-calculator hardening and coverage expansion
- use this after `CURRENT_STATE.md` when deciding implementation order

This note defines the recommended implementation order for expanding DynEcho's dynamic calculator so it becomes both broader in coverage and tighter in numerical behavior.

Read together with:

- `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SOURCE_GAP_LEDGER.md`
- `docs/archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md`
- `docs/foundation/PROJECT_PLAN.md`
- `docs/README.md`

This note is intentionally execution-oriented. It is not a product snapshot and not a one-day handoff.

Important scope note:

- this plan is floor-dominant
- it covers wall-side dynamic behavior mainly as a stability constraint and benchmark guardrail, not as a symmetric coverage-expansion roadmap
- if the product priority shifts toward broader wall-family import or wall-side field/detail expansion, that should be tracked as a separate execution plan rather than assumed to be fully covered here

Current execution status:

- `ubiq_weak_band_exact_import_source_mapping_v1` is now closed:
  - official UBIQ `FL-23`, `FL-25`, and `FL-27` page-7 weak-band values are
    imported as `54` exact-only correction rows
  - those rows require the direct lower-board source stack and carry
    `familyEstimateEligible: false`, so they do not become nearby-family
    interpolation anchors
  - upper-only weak-band visible packages remain impact-fail-closed
  - `FL-24` now requires the resilient lower-treatment topology, so direct
    `2 x 13 mm` open-web stacks land on `FL-23` instead of borrowing `FL-24`
  - `FL-24` is exact-only after the topology correction
    (`familyEstimateEligible: false`); raw/split lower-only helper stacks that
    do not exactly expose the resilient source topology stay fail-closed
  - focused engine UBIQ exact/source/posture/re-rank/backlog validation is green
    at `5` files / `210` tests; floor library sweep/source/raw parity/companion
    validation is green at `4` files / `29` tests; workbench weak-band and
    packaged-lane card validation is green at `2` files / `3` tests
  - final 2026-04-14 package validation is also green: catalog/engine/web
    typecheck, catalog/engine/web lint, full engine `107` files / `806` tests,
    full web `101` files / `615` tests, `pnpm build` with known `sharp/@img`
    optional-package warnings, and `git diff --check`
- `ubiq_open_web_supported_band_finish_completion_v1` is now closed:
  - touched `FL-24/26/28` supported-band rows were split into
    `packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-rows.ts`
  - UBIQ open-web exact coverage is now `90` rows across `FL-23/24/25/26/27/28`
  - supported resilient-band coverage is now `36` exact rows:
    `18` bare INEX rows plus `18` timber + acoustic underlay rows
  - bare rows are exact-only; `FL-24` remains exact-only; `FL-26/28` timber
    rows remain the current defended family-estimate anchors
  - official carpet `Ln,w+CI <=45` values were deferred from exact import
    because they are combined metric bounds, not exact `Ln,w`
- `impact_lnw_plus_ci_bound_surface_v1` is now closed:
  - the bound schema now has first-class `LnWPlusCIUpperBound`
  - UBIQ supported-band carpet rows are imported as `18` official
    `Ln,w+CI <=45` bound rows
  - support gating keeps requested `Ln,w+CI` live as a bound while `Ln,w`, `CI`,
    and field continuations stay unsupported
  - targeted engine regression pack is green at `5` files / `296` tests, and
    the full web suite during the slice is green at `101` files / `615` tests
- `bound_metric_report_surface_completion_v1` is now closed:
  - report markdown, Dutch impact references, guide field status, and product
    bound cards now display `Ln,w+CI` bounds as combined bounds instead of
    `Ln,w` bounds
  - target `Ln,w` gap calculations still ignore combined `Ln,w+CI` bounds
  - targeted web validation is green at `4` files / `103` tests
  - final broad validation is green: catalog/engine/web typecheck and lint,
    full engine `108` files / `811` tests, full web `103` files / `618` tests,
    `pnpm build` with known `sharp/@img` optional-package warnings and the
    existing Next.js TypeScript plugin recommendation, and `git diff --check`
- `ubiq_lnw_plus_ci_bound_history_guard_v1` is now closed:
  - canonical, `49`-layer split, and role-reordered UBIQ carpet stacks stay on
    the same official `Ln,w+CI <=45` bound
  - malformed disjoint carpet, extra board, missing fill, and wrong-depth
    near-misses do not receive official bound provenance
  - workbench duplicate/split/reorder/save-load and floor/wall detours keep the
    official bound card stable
  - targeted engine validation is green at `2` files / `5` tests; targeted
    workbench validation is green at `3` files / `100` tests
  - final broad validation is green: catalog/engine/web typecheck and lint,
    full engine `109` files / `813` tests, full web `104` files / `620` tests,
    `pnpm build` with known `sharp/@img` optional-package warnings and the
    existing Next.js TypeScript plugin recommendation, and `git diff --check`
- `ubiq_lnw_plus_ci_near_miss_estimate_posture_decision_v1` is now closed:
  - malformed UBIQ open-web + carpet/foam combined-bound near-misses fail
    closed for impact outputs once the official `Ln,w+CI <=45` bound no longer
    matches
  - those stacks no longer borrow bare/timber `FL-24/26/28` rows through
    broader lightweight-steel family estimates or derived predictor fallback
  - assembly keeps only screening/live `Rw`; `Ln,w`, `CI`, `Ln,w+CI`,
    `L'n,w`, `L'nT,w`, and `L'nT,50` stay unsupported
  - impact-only keeps all requested outputs unsupported for the same malformed
    visible/source stacks unless a separate exact/bound/source lane owns them
  - targeted engine validation is green at `3` files / `7` tests; targeted
    workbench validation is green at `3` files / `5` tests
  - final broad validation after the follow-up source-gap matrix is green:
    catalog/engine/web typecheck and lint, full engine `111` files / `821`
    tests, full web `106` files / `627` tests, `pnpm build` with known
    `sharp/@img` optional-package warnings and the existing Next.js TypeScript
    plugin recommendation, and `git diff --check`
- follow-up completed slice:
  `remaining_source_gap_posture_matrix_v1`
  - status: implemented and target-green on 2026-04-14
  - `C11c` remains deferred / impact-fail-closed
  - `GDMTXA04A` remains estimate-only on the defended Dataholz dry-CLT estimate
    lane
  - raw bare open-box/open-web impact and helper-only timber/open-web negatives
    remain deferred
  - targeted engine validation is green at `1` file / `6` tests; targeted
    workbench validation is green at `1` file / `6` tests
- follow-up completed slice:
  `raw_bare_open_web_open_box_source_evidence_re_rank_v1`
  - status: implemented as a no-runtime source evidence contract
  - result: raw bare open-web and raw bare open-box impact support remain
    closed; the current source corpus supports packaged systems only
  - validation: targeted engine source-evidence contract `1` file / `3` tests
    green; full engine suite `112` files / `824` tests green; engine
    typecheck/lint and `git diff --check` green
- follow-up completed slice:
  `tuas_open_box_same_package_fragmentation_design_v1`
  - implemented as a no-runtime generated exact-route/card guard
  - all `15` imported TUAS open-box exact rows preserve their exact id, impact
    values, field continuations, support buckets, and workbench card statuses
    when source-equivalent contiguous fragmentation is used
  - final validation is green: targeted engine/workbench guards `1` file / `2`
    tests each; full engine `113` files / `826` tests; full web `107` files /
    `629` tests; engine/web typecheck and lint; `pnpm build`;
    `git diff --check`
- follow-up completed slice:
  `ubiq_open_web_packaged_finish_family_design_v1`
  - implemented as a no-runtime generated exact/bound route-card guard
  - all `90` UBIQ open-web exact rows and all `21` UBIQ open-web bound rows
    preserve their official exact/bound source id, metric basis, support buckets,
    and workbench card statuses when source-equivalent contiguous fragmentation
    is used
  - weak-band carpet rows remain exact-only; supported-band carpet rows remain
    `Ln,w+CI <=45` bound-only
  - final validation is green: targeted engine `1` file / `3` tests; targeted
    workbench `1` file / `2` tests; full engine `114` files / `829` tests; full
    web `108` files / `631` tests; engine/web typecheck and lint; `pnpm build`;
    `git diff --check`
- follow-up completed slice:
  `ubiq_open_web_packaged_finish_near_miss_matrix_v1`
  - representative weak-band exact-only, supported-band exact, and supported-band
    `Ln,w+CI <=45` bound packages now pin source-critical deck/board/fill drift
    and valid finish switches on engine route and workbench card surfaces
  - source-critical mismatches do not retain official exact/bound provenance
  - final validation is green: targeted engine `1` file / `1` test; targeted
    workbench `1` file / `1` test; full engine `115` files / `830` tests; full
    web `109` files / `632` tests; engine/web typecheck and lint; `pnpm build`
- follow-up completed slice:
  `ubiq_open_web_packaged_finish_history_replay_matrix_v1`
  - representative UBIQ exact, bound, near-miss, and valid finish-switch states
    now replay through duplicate/split/reorder/save-load and floor/wall mode
    detours before runtime changes
  - source-equivalent histories keep the same route/card values; source-critical
    near-misses remain off official exact/bound provenance
  - final validation is green: targeted workbench `1` file / `1` test; adjacent
    UBIQ web pack `3` files / `4` tests; full engine `115` files / `830`
    tests; full web `110` files / `633` tests; engine/web typecheck and lint;
    `pnpm build`; `git diff --check`
- selected next planning slice:
  `post_ubiq_source_gap_re_rank_v1`
  - re-rank source-backed candidates before any raw-floor, CLT, wall-selector,
    Dataholz, or UBIQ runtime widening
  - do not use the finish-family or near-miss guards as permission to open raw
    bare open-web impact support or a broad weak-band family fallback
- selected immediate no-runtime action from that planning slice:
  `post_ubiq_source_gap_decision_matrix_v1`
  - refresh the executable source-gap selector so completed UBIQ weak-band work
    is no longer shown as the active next task
  - keep all remaining runtime widening candidates non-eligible until a stronger
    source/frequency matrix exists
- closed no-runtime research action:
  `tuas_c11c_frequency_source_recheck_v1`
  - audit the remaining deferred combined-CLT row before any exact import or
    predictor widening
  - result: keep `C11c` fail-closed because the weak tuple is not explained by
    `CI` or `CI,50-2500`
- closed no-runtime research action:
  `dataholz_gdmtxa04a_material_surface_recheck_v1`
  - result: keep `GDMTXA04A` direct-official-id exact only and visible
    estimate-routed because the source top layer is a composite dry screed
    element, not the current local single visible material surface
- closed checkpoint action:
  `checkpoint_validation_and_commit_v1`
  - validate and commit the no-runtime source-gap guard/docs checkpoint before
    any solver/catalog/workbench runtime widening
- selected next no-runtime planning action:
  `post_checkpoint_next_slice_selection_v1`
  - choose exactly one next behavior or research slice before runtime widening
- `open_box_dry_package_fragmentation_trace_matrix_v1` is now closed:
  - this was a no-widening engine/workbench trace-card checkpoint for the TUAS
    `R5b` open-box dry package
  - a `17`-row source-equivalent fragmented dry package remains exact on
    `tuas_r5b_open_box_timber_measured_2026`
  - exact lab answers remain `Rw 75`, `Ln,w 44`, and `Ln,w+CI 44`; exact field
    answers remain `Rw 75`, `Ln,w 44`, `L'n,w 46`, `L'nT,w 43.6`, and
    `L'nT,50 46.6`
  - disjoint upper-fill dry input remains off exact `R5b` and stays on
    `family_general` at `54%` fit with explicit duplicate upper-fill warning
    coverage
  - no solver, catalog, selector, source, support, or workbench runtime behavior
    changed
  - focused engine/workbench validation is green; adjacent engine validation is
    green at `6` files / `50` tests; adjacent workbench validation is green at
    `5` files / `111` tests; full engine is green at `103` files / `791`
    tests; full web is green at `99` files / `607` tests; repository build is
    green with known warnings
- `open_box_finish_tolerance_mixed_history_boundary_v1` is now closed:
  - this was a no-widening workbench store-history/output-card checkpoint for
    the open-box walking-finish tolerance boundary
  - source-band `10 mm` laminate split as `4 + 6 mm` remains exact on
    `tuas_r2b_open_box_timber_measured_2026` after duplicate/edit,
    reorder-bounce, save/load, and floor/wall mode switching
  - the exact/live source-band answer remains pinned at `Rw 62`, `Ln,w 46`,
    `L'n,w 48`, and `L'nT,w 45.6`
  - outside-band `12 mm` laminate split as `6 + 6 mm` remains outside exact
    support: `Rw` is screening live at `44 dB`, while `Ln,w`, `L'n,w`, and
    `L'nT,w` stay unsupported / needs-input
  - no solver, catalog, selector, source, support, or workbench runtime behavior
    changed
  - focused workbench validation is green at `1` file / `1` test; adjacent
    web validation is green at `5` files / `112` tests; adjacent engine
    validation is green at `4` files / `36` tests; full web validation is
    green at `98` files / `606` tests; full engine validation is green at
    `102` files / `790` tests; repository build is green with known warnings
- `ubiq_open_web_packaged_lane_trace_matrix_v1` is now closed:
  - this was a no-widening trace/card checkpoint for the UBIQ open-web
    `2 x 16 mm` packaged lower lane
  - canonical raw, raw split, and tagged split visible inputs stay on the
    current `family_general` source-backed estimate at `59.3%` fit
  - reordered lower-package input remains live but is explicitly pinned as
    `low_confidence` at `29%` fit with duplicate-role warning coverage
  - engine and workbench matrices now measure numeric answers, support buckets,
    card status/value, candidate ids, and warnings for this lane
  - no solver, catalog, selector, source, support, or workbench runtime behavior
    changed
  - full engine validation is green at `102` files / `790` tests; full web
    validation is green at `97` files / `605` tests
  - `pnpm build` is green with the known `sharp/@img` optional-package warnings
    and Next.js TypeScript plugin recommendation
- the 2026-04-12 broad engine-suite cleanup is now closed:
  - stale TUAS/Open Box/CLT/UBIQ validation fixtures, field continuation fixtures,
    floor-topology expectations, and impact upstream-parity acceptance fixtures
    were aligned to current defended source truth
  - under-described combined dry-plus-wet CLT now has an explicit
    `unsupported_gap` validation posture
  - wall-side AAC lined-massive stability is aligned to the existing `100 mm`
    family-boundary hold contract; no solver widening was made in that wall
    slice
  - stable full engine validation is green with
    `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 --reporter=basic`
    (`93` files, `757` tests)
  - the engine package `test` script pins `--maxWorkers=1` because broad
    multi-worker Vitest runs can still report worker RPC timeouts after all
    assertions pass in CPU-heavy dynamic-airborne generated scans
- `tuas_floor_source_truth_rebaseline_v1` is now closed:
  - TUAS exact floor rows and TUAS-backed predictor lanes were compared back to `TUAS2023FloorSoundInsulationDataR1.xlsx` / `SoundInsulation`
  - numeric truth now follows rows `34` (`Ln,w`), `35` (`Ln,w+CI`), `36` (`Ln,w+CI,50-2500`), `41` (`Rw`), and `42` (`Rw+C`)
  - engine, workbench, and build gates are green after the rebaseline
- `floor_airborne_companion_c_ctr_semantic_audit_v1` is now closed:
  - row `42` remains stored in the legacy numeric `RwCtr` field for
    compatibility, but it now carries `RwCtrSemantic: "rw_plus_c"`
  - TUAS exact/official-id rows support `C` / `Rw+C` and withhold `Ctr`
  - Dataholz `ctr_term` rows still support source `Ctr` and withhold `C`
  - engine support buckets, predictor-family propagated companions, output
    sweeps, and workbench floor cards all share this C-vs-Ctr contract
- `clt_laminate_underlay_interpolation_guard_v1` is now closed:
  - TUAS `X2/C2` interpolation remains available for raw bare CLT and the
    defended `laminate + EPS underlay` CLT package
  - laminate-only CLT and out-of-band laminate thicknesses no longer inherit
    measured laminate-plus-EPS impact support
  - direct predictor, visible layer route, and workbench scenario tests now
    measure the same fail-closed package-completeness boundary
- `clt_dry_finish_package_guard_v1` is now closed:
  - TUAS `X5/C5c` dry CLT interaction remains available for the source-backed
    `8 mm` laminate plus `3 mm` EPS finish band
  - out-of-band laminate or EPS thicknesses no longer borrow dry CLT impact
    support through either the predictor-specific lane or generic same-family
    CLT fallback
  - C7 wet upper-package missing-role behavior remains on the documented
    family-estimate posture
- `clt_combined_finish_fallback_guard_v1` is now closed:
  - combined CLT stacks with lower suspended treatment and malformed
    laminate/EPS walking finishes now fail closed before the generic
    same-family CLT archetype can reopen
  - this is a tightening-only follow-up to the dry finish-package guard:
    valid source-backed laminate/EPS pairs remain live, while out-of-band
    combined finishes stay impact-unsupported
  - engine, workbench, typecheck, full engine, and repository build gates are
    green after the guard
- `open_box_disjoint_upper_fallback_guard_v1` is now closed:
  - TUAS open-box hybrid wet upper packages with a source-backed
    `geotextile + screed` floating-screed schedule now fail closed when that
    staged upper schedule is disjoint or mixed out of order and exact matching
    falls off
  - true `R7b/R8b/R9b/R2c` source rows remain exact, while the existing generic
    dry open-box disjoint `upper_fill` route remains on the documented
    `family_general` lane
  - engine, workbench, typecheck, full engine, and repository build gates are
    green after the guard
- `open_box_finish_package_guard_v1` is now closed:
  - TUAS open-box walking-finish support is now constrained to the source-backed
    `8 mm` laminate plus `3 mm` EPS underlay band
  - malformed basic/dry/hybrid open-box walking finishes now fail closed before
    predictor-specific or generic same-family impact fallback can borrow
    `R2b/R5b/R9b` values
  - valid exact open-box rows remain live, and direct predictor rows with
    source-band `3 mm` underlay but no product id remain accepted
  - engine, workbench, typecheck, full engine, and repository build gates are
    green after the guard
- `open_box_finish_tolerance_guard_v1` is now closed:
  - open-box walking-finish fallback now uses the exact visible-role tolerance
    around the source `8 mm` laminate plus `3 mm` EPS pair
  - `10 mm` laminate remains accepted as a near source-band direct predictor
    input, while `12 mm` laminate no longer borrows `R2b/R5b/R9b` impact values
    after exact matching rejects it
  - this was kept open-box-specific and does not change the separate CLT
    interpolation band
  - engine, workbench, typecheck, full engine, and repository build gates are
    green after the guard
- latest source-led floor checkpoint:
  - `dataholz_clt_source_truth_audit_v1`
  - this is a no-widening source-truth guard, not a solver behavior change
  - all imported Dataholz CLT rows now have answer-measuring engine coverage for
    catalog truth, official-id field continuation, visible raw/tagged posture,
    contiguous split stability, and disjoint-role fallback behavior
  - workbench output-card coverage now covers exact dry CLT and the
    `GDMTXA04A` estimate-routed boundary
  - `mixed_floor_wall_seeded_route_history_expansion_v1` is already closed and
    committed for the first heavy-composite wall target; the optional open-box
    mixed-history boundary is now closed as
    `open_box_finish_tolerance_mixed_history_boundary_v1`
  - historical follow-up selected after that checkpoint:
    `raw_concrete_helper_permutation_answer_guard_v1`, under source-led
    raw-floor inference widening
- latest no-widening answer guard:
  - `raw_concrete_helper_permutation_answer_guard_v1` is implemented and
    target-green
  - no solver, catalog, selector, or workbench runtime behavior changed
  - engine tests now pin numeric answers for wider raw terminal-concrete helper
    permutations plus top-finish, wall-like hybrid, and steel-joist negatives
  - workbench tests now pin route/card status and values for the same
    representative shapes
  - engine raw/source pack, workbench raw/source pack, and engine/web
    typechecks are green
  - full engine suite is green: `98` files, `786` tests
- latest docs/analysis correction:
  - `calculation_model_and_validation_docs_v1` is implemented as a docs-only
    local implementation audit
  - the living docs now make explicit that formulas are active, but exact
    source rows, predictor estimates, bound-only lanes, field continuations,
    and unsupported support gates can own different requested outputs
- latest trace/measurement guard:
  - `output_origin_trace_matrix_v1` is implemented and fully validated through
    the current target, typecheck, engine, and web gates
  - no solver, catalog, selector, or workbench runtime behavior changed
  - representative exact-source, source-family estimate, formula/predictor,
    bound-only, dynamic field, missing-geometry, and unsupported routes are now
    executable as value/origin/support/card evidence rather than prose
    confidence
  - future widening should extend this matrix for the candidate route before
    changing support or solver behavior
  - adjacent validation is green:
    - engine trace/source/raw pack: `3` files, `7` tests
    - workbench trace/source/raw pack: `3` files, `4` tests
    - full engine suite: `99` files, `787` tests
    - full web suite: `94` files, `602` tests
    - engine/web typechecks and `git diff --check`: green
  - the web full-suite runner now mirrors the engine package by using
    `--maxWorkers=1`; web deep-hybrid route scans also yield periodically so
    long CPU scans do not trip Vitest worker-RPC timeout after assertions pass
- latest wall-selector trace checkpoint:
  - `wall_selector_wider_trace_matrix_v1`
  - type: no-widening wall-selector trace/card slice
  - status: implemented and target-green
  - reason it was selected:
    - wall Phase B.2 remains partial beyond the defended
      `double_leaf <-> lined_massive_wall` hold
    - raw-floor behavior widening is now better answer-measured, but still has
      the largest fake-confidence blast radius
    - CLT combined behavior has exact/predictor anchors, but `C11c` and
      `GDMTXA04A` stay deliberately deferred/estimate-only
  - implementation result:
    - added dedicated engine and workbench trace/card matrix tests for the wall
      selector output path
    - used the existing boundary scan packs as the adjacent baseline
    - did not change solver selection, source catalogs, floor support, wall
      selector math, or workbench runtime behavior
    - did not expand `dynamic-airborne.ts` during the trace-only pass
  - validation:
    - focused engine trace matrix: `1` file, `1` test, green
    - focused workbench card matrix: `1` file, `1` test, green
    - engine selector/boundary pack: `3` files, `15` tests, green
    - workbench selector/boundary/validation pack: `5` files, `26` tests, green
    - engine/web typechecks: green
    - full engine suite: `100` files, `788` tests, green
    - full web suite: `95` files, `603` tests, green
    - `git diff --check`: green
- previous raw-floor hostile-input guard:
  - `raw_floor_hostile_input_answer_matrix_v1` is implemented and target-green
  - no solver, catalog, source, selector, support, or workbench runtime behavior
    changed
  - engine tests now pin numeric answer/support snapshots for:
    - long split terminal-concrete helper
    - same-material helper stack where concrete is not terminal
    - long open-web helper-heavy negative
    - fragmented CLT lower-only negative
  - workbench tests now pin matching output-card status/value snapshots
  - adjacent raw-floor engine and web packs plus engine/web typechecks are green
  - full engine suite is green: `101` files, `789` tests
  - full web suite is green: `96` files, `604` tests
- the 2026-04-07 reinforced-concrete assembly-field `Rw` support blocker is now closed:
  - concrete screening rows with visible floor roles now keep `Rw` exposed again on the assembly route
  - workbench `Rw` cards now also respect engine support buckets instead of surfacing unsupported floor companions
  - the reopening stays intentionally narrow so wall-like heavy hybrids remain closed
  - representative raw-screening carrier audits are now in place on both engine and route layers, so that narrow reopening is defended explicitly rather than implied
- Phase 0 is complete and defended by the route/support regression matrix
- Phase 1 is complete and defended by explicit support-contract tests
- Phase 2 is complete for the currently known raw-vs-tagged floor drift set
- Phase 3 is complete for the currently harvested primary-source corpus:
  - support hardening for floor-side companion `Rw` on the assembly field surface is complete
  - representative floor-core coverage audits are now in place
  - the remaining `4 / 48` screening-only floor topologies were re-audited against primary sources and intentionally stayed source-gated
- Phase 4 is now active:
  - reinforced-concrete monotonicity guardrails have been added
  - the first CLT deviation-tightening pass is complete for the bare-floor lane:
    - raw bare CLT slabs no longer outperform the defended TUAS laminate-plus-underlay anchors
    - a dedicated predictor-side bare CLT interpolation rule now carries the lane before the broader generic family blend
  - the active CLT guard pack now covers raw bare slabs, thin laminate-plus-underlay interpolation, and stronger dry / wet treatment packages
  - cross-family fallback warnings on the assembly route were hardened so fail-closed floor cases no longer advertise misleading closest-family labels

Completion-reading note:

- this status block is floor-roadmap progress, not a universal “all calculator work is complete” statement
- for cross-floor/wall open work, use [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
- for wall-specific phase closure, use [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
- today’s accurate shorthand is:
  - floor phases `0-3`: complete and defended
  - floor phase `4`: active / partial, with TUAS numeric source truth now rebaselined
  - floor phases `5-8`: open

Current queued follow-up:

- re-rank the next implementation slice after the wall-selector trace
  checkpoint:
  - the trace matrix now pins clear `double_leaf`, held AAC boundary, clear
    `lined_massive_wall`, denser held G5 sibling, non-AAC heavy-core control,
    and strong framed control rows
  - no behavior bug was exposed in those rows, so there is no automatic selector
    widening to do next
  - any future wall selector behavior work needs a fresh classified red or a
    separately named evidence-backed behavior slice
- keep raw-floor inference widening deferred for now:
  - the first raw safe-bare contiguous-split cohort is defended on both engine
    and workbench routes
  - the first treated/inferred contiguous-split cohort is also defended on both
    engine and workbench routes
  - the first weaker-carrier posture cohort is also defended on both engine and
    workbench routes
  - the first raw concrete ceiling-side inferred support cohort is also
    defended on both engine and workbench routes
  - the next raw-floor move must name one source-backed carrier and first add
    no-widening origin/card evidence
- keep widening the new mixed floor/wall torture pass before any more reorder canonicalization:
  - a representative mixed pack and a first generated split-detour matrix now exist on both engine and workbench routes
  - the next step there is to widen that first generated matrix into longer edit-chain and duplicate/swap grids
- the broader workbench support-bucket vs output-card parity audit is now in place for representative floor presets and raw floor/raw hybrid scenarios
- use the source gap ledger and widening-candidate contract to decide which family branches are widening-first versus tightening-first
- mine dormant exact-only source rows before inventing any broader generic family formula
- when sourcing new TUAS rows, first compare the target row against the rebaselined TUAS spreadsheet truth before importing or changing predictor expectations
- the first defended TUAS open-box `a/b` corridor is now complete:
  - `R2a`, `R2b`, `R3a`, `R3b`, `R5a`, `R5b`, `R6b`, `R7a`, and `R11b` are imported as exact rows
  - predictor-side exact inference carries the explicit `a/b` suspended-ceiling support-class split
  - the visible-layer/workbench material route now exposes `family_a` through `tuas_open_box_ceiling_family_a`
  - `R2b` is now source-cleared and imported as the basic `b`-family anchor because `TUAS2023FloorConstructionDrawingsR1.pdf` shows it uses the existing visible-layer shorthand directly
  - `R6b` is now source-cleared and imported as a narrow exact-only reinforced `b` branch because the published drawing package shows the stronger lower treatment directly on the current visible-layer surface
  - `R7a` is now source-cleared and imported as a narrow exact-only heavy/wet `a` branch with a dedicated upper-EPS-board surface
  - the real-world lab coverage benchmark now also reflects that defended split explicitly:
    - generic `resilient_stud_ceiling` basic rows land on `R2b`
    - explicit `tuas_open_box_ceiling_family_a` basic rows land on `R2a`
  - selector-side backdoor collapse is now also guarded:
    - non-dry upper packages no longer fall into the `basic` open-box case just because they are not `dry`
  - one nearby stale expectation was corrected instead of widened:
    - under-described direct-fixed CLT dry stacks stay screening-only until explicit combined-family evidence exists
- on the UBIQ open-web side, the first same-family FL-28 corridor fill is now complete:
  - visible FL-28 `16 mm INEX>FLOOR` exact siblings are imported
  - the visible FL-28 `(FRL/D)` `400 mm` bound sibling is imported
  - superseded on 2026-04-14: `FL-24` is no longer a broad adjacent-family
    widening anchor; it is exact-only after its resilient topology correction
  - `FL-23`, `FL-25`, and `FL-27` are no longer deferred as source rows; they
    are imported exact-only and cannot seed nearby-family estimates
  - the current boundary-freeze decision is to keep `FL-24` exact-only and use
    the supported `FL-26/28` corridor as the family-estimate surface until the
    finish completion slice re-audits the official table
- keep the current `ubiq_fl32_*` and `ubiq_fl33_*` ids stable as internal ids:
  - the current May 2023 brochure still exposes visible FRL/D families as `FL-17 (FRL/D)` for steel joist / purlin and `FL-28 (FRL/D)` for open-web / rolled steel
  - the provenance/boundary-freeze slice closes this as docs plus contract truth, not as an ad hoc runtime rename
- treat that audit as a contract decision point:
  - widen deterministic normalization only where the final physical package should be path-invariant
  - keep true order-sensitive combinations explicitly order-sensitive

## 0. Read This First

This document is written for an implementer who may be seeing this part of the system for the first time.

Use it in this order:

1. read Section 0.1 before touching code
2. read the file map in Section 0.3
3. verify the invariants in Section 0.4
4. then begin with the first incomplete phase shown in the status block above; Phases 0 through 3 still define the active guardrails even when later hardening is active

If you skip directly to the coverage-expansion phases, you are likely to break:

- exact floor-system routing
- bound-only posture
- workbench support messaging
- `calculateAssembly` and `calculateImpactOnly` symmetry

### 0.1 Immediate Quick Start

Before writing code:

1. read these files in order:
   - `packages/engine/src/impact-lane.ts`
   - `packages/engine/src/calculate-assembly.ts`
   - `packages/engine/src/calculate-impact-only.ts`
   - `packages/engine/src/impact-predictor-input.ts`
   - `packages/engine/src/floor-system-estimate.ts`
   - `packages/engine/src/floor-system-ratings.ts`
   - `packages/engine/src/target-output-support.ts`
   - `packages/engine/src/dynamic-impact.ts`
   - `apps/web/features/workbench/dynamic-calc-branch.ts`
   - `apps/web/features/workbench/scenario-analysis.ts`
2. run the baseline gates from Section 7 before making routing or support changes
3. capture the current route and support posture for the scenario you intend to change
4. only then make a code change

If you are unsure where a behavior is coming from, do not guess:

- routing order lives in `impact-lane.ts`
- visible-layer inference lives in `impact-predictor-input.ts`
- support posture lives in `target-output-support.ts`
- floor companion airborne posture lives in `floor-system-ratings.ts`
- UI wording lives in `dynamic-calc-branch.ts`

### 0.2 Term Map

These terms are used precisely in this document and should not be reinterpreted loosely:

- `exact floor-system match`
  - a curated row landed directly through exact matching
- `bound floor-system match`
  - a curated row landed directly, but impact remains conservative rather than live
- `family estimate`
  - a live estimate built from nearby same-family or broader-family source rows
- `corridor-limited estimate`
  - a live estimate that is intentionally constrained to broad defended corridors rather than presented as narrow exact evidence
- `bound support`
  - upper/lower-bound semantics only; not a live exact-looking metric
- `companion airborne`
  - `Rw` or related airborne carrier values surfaced through floor-carrier logic, not through direct impact math
- `conditional metric`
  - a metric that should only appear when the underlying source semantics justify it

Important distinction:

- `bound` and `corridor-limited estimate` are not the same thing
- `bound` means conservative upper/lower support
- `corridor-limited estimate` means a live estimate with intentionally limited confidence posture

### 0.3 Reference Map

Use this file map instead of rediscovering the architecture from scratch.

Core routing and orchestration:

- `packages/engine/src/impact-lane.ts`
  - floor-impact lane precedence
- `packages/engine/src/calculate-assembly.ts`
  - main assembly orchestration, warnings, support, floor carrier wiring
- `packages/engine/src/calculate-impact-only.ts`
  - impact-only orchestration and support posture differences

Floor estimation and bounds:

- `packages/engine/src/floor-system-estimate.ts`
  - live family estimate generation
- `packages/engine/src/predictor-floor-system-estimate.ts`
  - predictor-specific estimate strategies
- `packages/engine/src/bound-floor-system-match.ts`
  - exact bound rows and bound-family estimate entry points
- `packages/engine/src/lightweight-steel-bound-estimate.ts`
  - current bound-family interpolation implementation
- `packages/engine/src/floor-system-ratings.ts`
  - companion airborne carrier generation

Input inference and topology normalization:

- `packages/engine/src/impact-predictor-input.ts`
  - raw visible-layer role inference and predictor derivation
- `apps/web/features/workbench/workbench-store.ts`
  - workbench-side role inference and editor behavior

Support, trace, and posture:

- `packages/engine/src/target-output-support.ts`
  - supported vs unsupported output partition
- `packages/engine/src/dynamic-impact.ts`
  - branch summaries and selection-kind trace
- `packages/engine/src/impact-predictor-status.ts`
  - implementer-facing predictor status summary
- `packages/engine/src/impact-support.ts`
  - user-facing posture and formula notes

Field continuation:

- `packages/shared/src/domain/impact-field-context.ts`
  - schema and accepted field context
- `packages/engine/src/impact-field-context.ts`
  - field continuation application
- `packages/engine/src/impact-guide.ts`
  - local-guide and standardized field continuation logic

Workbench contract surface:

- `apps/web/features/workbench/dynamic-calc-branch.ts`
  - branch wording shown to users
- `apps/web/features/workbench/scenario-analysis.ts`
  - scenario evaluation path used heavily by workbench tests
- `apps/web/features/workbench/common-floor-combinations.test.ts`
  - stable workbench floor-combination contract
- `apps/web/features/workbench/guided-combination-sweep.test.ts`
  - workbench sweep coverage and support partition checks

### 0.4 Non-Negotiable Invariants

Every implementation pass must preserve these unless the change explicitly and deliberately revises them:

- exact rows land before estimate rows
- bound rows remain conservative
- official product rows land before broad family fallback
- `calculateAssembly` and `calculateImpactOnly` differences are understood, not accidental
- workbench wording matches actual engine posture
- unsupported outputs remain explicit
- wall-side dynamic airborne benchmarks stay green unless the task explicitly targets wall-side behavior

## 1. Problem Statement

The target behavior is:

- the operator can compose arbitrary or near-arbitrary layer stacks
- DynEcho should return defended outputs for the combinations it genuinely understands
- unsupported outputs must remain explicit instead of fabricated
- supported outputs must stay inside broad physical corridors
- evidence posture must stay visible: `exact`, `bound`, `estimate`, or `unsupported`

The important clarification is that the current floor-side engine is not one universal dynamic solver.

Today the floor-impact path is a lane resolver with this order:

1. exact floor-system match
2. bound floor-system match
3. official impact product catalog
4. explicit product-delta heavy-reference derive when the predictor input carries a defended `DeltaLw` row
5. predictor-specific estimate
6. narrow heavy-floor formula
7. bound family estimate
8. general family estimate

Source:

- `packages/engine/src/impact-lane.ts`

That architecture is not wrong. It is the reason existing exact and published lanes are relatively stable. The plan below preserves that architecture and expands it carefully.

## 2. Current Reality

### 2.1 What is already strong

- Wall-side dynamic airborne is already benchmark-anchored and should be treated as high-risk to disturb.
- Floor-side exact and bound library support is real and non-trivial.
- Raw visible-layer inference is better than expected on representative topology sweeps.
- The engine already fails closed for unsupported outputs instead of inventing them.

### 2.2 What is still structurally weak

- Floor-side broad coverage is mostly family-estimate driven, not universal physics driven.
- The narrow formula lane is intentionally limited to heavy concrete behavior.
- Some floor airborne companions still come from screening seeds when no exact/published carrier exists.
- Field continuations are mathematically coherent but sensitive to missing or weakly bounded context.
- Some metrics are semantically much harder than others and should not be widened at the same speed.

### 2.3 Numbers that matter

Current library and validation shape:

- exact floor-system rows: `63`
- bound floor-system rows: `4`
- official impact product rows: `10`
- exact rows that actually auto-land as exact matches: `57 / 63`
- exact rows intentionally left out of auto-match because `manualMatch: false`: `6 / 63`

Representative topology sweep:

- `48 / 48` floor combinations stayed `ok`
- `44 / 48` landed on a defended published-family estimate
  - `12 / 44` on `family_archetype`
  - `30 / 44` on `family_general`
  - `2 / 44` on `low_confidence`
- `4 / 48` stayed explicit `screening_only`
- `0 / 48` exact floor-system matches
- `0 / 48` bound floor-system matches

Exact-library support shape under a mixed lab/field request:

- `CI` available on `28 / 63`
- `CI,50-2500` available on `12 / 63`
- `DeltaLw` available on `0 / 63`
- `L'nT,50` available on `12 / 63`

Raw-layer parity observations:

- representative topology sweep parity: `48 / 48`
- bound library parity: `4 / 4`
- exact library parity: `58 / 61`

Important current nuance:

- `calculateAssembly` and `calculateImpactOnly` do not expose support posture identically in every case
- `calculateAssembly` currently counts conservative bound support as supported by default
- `calculateImpactOnly` currently keeps conservative bound support out of `supportedTargetOutputs`
- any roadmap change that touches support posture must preserve or deliberately revise that distinction

Interpretation:

- broad raw-stack handling is already viable enough to build on
- exact/bound lanes are valuable and must be preserved
- floor-side expansion should focus on the large middle zone between exact rows and total unsupportedness

## 3. Core Decision

The correct implementation order is not:

- coverage first and accuracy later
- accuracy first and coverage later

The correct implementation order is:

1. freeze the contract
2. stabilize routing and inference
3. widen corridor-limited lab-side coverage
4. tighten deviation inside the widened lanes
5. harden field continuations on top of the improved lab lanes
6. only then consider wider metric families

Reasoning:

- If routing is unstable, calibration work is wasted because the wrong lane is being calibrated.
- If coverage is widened before contracts are frozen, outputs will start appearing without a stable meaning.
- If field-side work is widened before lab-side posture is clean, room-volume and flanking corrections amplify upstream drift.
- If extended metrics are added too early, the product will look broader while actually becoming less honest.

This is therefore an `accuracy-gated coverage expansion` plan.

## 4. Metric Policy

Not every metric should expand at the same speed.

### 4.1 Broad-coverage direct impact metrics

These should be the first broad-coverage target on floor-side topology expansion:

- `Ln,w`
- `L'n,w`
- `L'nT,w`

Why:

- they are the most operationally useful
- they already have active lanes in the engine
- they can be widened with bounded posture without pretending to be exact

### 4.2 Broad-coverage companion airborne metric

This metric should expand with the floor carrier, not with the direct impact lane itself:

- `Rw`

Why:

- in the current implementation `Rw` is surfaced through floor-carrier ratings, not as a direct impact metric
- broadening `Rw` therefore means broadening defended `floorSystemRatings` generation, not injecting an isolated `Rw` number into the impact path
- this distinction must stay explicit so the engine does not silently mix companion airborne posture with direct impact posture

### 4.3 Conditional-coverage metrics

These should only expand when the necessary evidence is truly available:

- `DeltaLw`
- `CI`
- `CI,50-2500`
- `Ln,w+CI`
- `L'nT,50`

Why:

- these metrics are more source-dependent
- they often require exact band data, guide carry-over, or product semantics
- widening them too early would produce fake completeness

### 4.4 Exact-only or staged metrics

These should remain staged until explicit standards-backed adapters exist:

- `IIC`
- `AIIC`
- `NISR`
- `ISR`
- `LIIC`
- `LIR`
- `HIIC`

## 5. Execution Order

## Phase 0 — Freeze Current Behavior

Goal:

- make existing exact, bound, catalog, and validated family behavior harder to accidentally break

Why first:

- without a frozen baseline, every new lane creates regression ambiguity

Implementation:

- formalize a regression-safe output matrix for representative floor cases
- snapshot exact/bound/catalog family selection kinds
- snapshot supported/unsupported output partitions for key requests
- keep current broad corridor sweeps green

Primary files:

- `packages/engine/src/impact-lane.ts`
- `packages/engine/src/target-output-support.ts`
- `packages/engine/src/dynamic-floor-regression-matrix.test.ts`
- `packages/engine/src/floor-topology-sanity-sweep.test.ts`
- `packages/engine/src/output-combination-sweep.test.ts`
- `packages/engine/src/acoustic-output-coverage.test.ts`

Exit criteria:

- exact rows still land exact unless intentionally excluded
- bound rows still stay conservative
- catalog rows still pre-empt broader fallback lanes
- supported/unsupported output partitions do not drift silently

### Phase 0 Progress — 2026-04-03

Implemented now:

- a dedicated route/support regression matrix in `packages/engine/src/dynamic-floor-regression-matrix.test.ts`
- explicit freeze coverage for both `calculateAssembly` and `calculateImpactOnly`
- a named check that preserves the current bound-support asymmetry between assembly and impact-only surfaces

Validated on 2026-04-03:

- `pnpm exec vitest run packages/engine/src/dynamic-floor-regression-matrix.test.ts`
  - `15 / 15` tests passed
- `pnpm exec vitest run packages/engine/src/assembly-raw-floor-inference.test.ts packages/engine/src/floor-library-raw-parity.test.ts packages/engine/src/floor-topology-sanity-sweep.test.ts packages/engine/src/output-combination-sweep.test.ts packages/engine/src/acoustic-output-coverage.test.ts`
  - `21 / 21` tests passed
- `pnpm exec vitest run packages/engine/src/impact-real-world-floor-coverage.test.ts packages/engine/src/impact-common-floor-combinations.test.ts packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
  - `50 / 50` tests passed
- `pnpm exec vitest run apps/web/features/workbench/dynamic-calc-branch.test.ts apps/web/features/workbench/scenario-analysis.test.ts apps/web/features/workbench/common-floor-combinations.test.ts apps/web/features/workbench/guided-combination-sweep.test.ts apps/web/features/workbench/floor-family-regressions.test.ts`
  - `197 / 197` tests passed
- `pnpm engine:benchmark-airborne`
  - dynamic stayed rank `#1` with `MAE 0.00`, `RMSE 0.00`, `MaxAE 0.00`, `Win 7 / 7`

The matrix currently freezes these representative lanes:

- assembly exact floor-system lane
- assembly bound floor-system lane
- assembly official catalog exact lane
- assembly narrow formula lane
- assembly family-archetype estimate lane
- assembly family-general estimate lane
- assembly low-confidence estimate lane
- impact-only exact floor-system lane
- impact-only bound floor-system lane
- impact-only official catalog exact lane
- impact-only narrow formula lane
- impact-only family-archetype estimate lane
- impact-only family-general estimate lane
- impact-only low-confidence estimate lane

What the matrix deliberately freezes for each lane:

- `dynamicImpactTrace.selectionKind`
- `evidenceTier`
- `estimateTier` where applicable
- the active impact basis or lower-bound basis
- exact/bound/catalog identity where applicable
- floor-carrier companion posture (`Rw`, `Rw+Ctr`, basis)
- supported vs unsupported target-output partition
- supported vs unsupported impact-output partition

What remains covered by existing dedicated tests instead of the new matrix:

- raw vs tagged parity
  - `packages/engine/src/assembly-raw-floor-inference.test.ts`
  - `packages/engine/src/floor-library-raw-parity.test.ts`
- broad topology sanity and corridor checks
  - `packages/engine/src/floor-topology-sanity-sweep.test.ts`
  - `packages/engine/src/output-combination-sweep.test.ts`
  - `packages/engine/src/acoustic-output-coverage.test.ts`
- workbench wording and operator posture
  - `apps/web/features/workbench/dynamic-calc-branch.test.ts`
  - `apps/web/features/workbench/scenario-analysis.test.ts`
  - `apps/web/features/workbench/common-floor-combinations.test.ts`
  - `apps/web/features/workbench/guided-combination-sweep.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`

Interpretation:

- if a future change moves a representative stack from exact to family, from family to formula, or from supported to unsupported, Phase 0 should now fail loudly
- if a future change intentionally revises a lane, this section and the matrix test must be updated in the same pass

## Phase 1 — Define the Floor Metric Contract

Goal:

- state clearly which outputs are legal under which evidence posture

Why now:

- coverage expansion without a metric contract creates fake support

Implementation:

- document output support policy by metric and by evidence tier
- separate `broad coverage`, `conditional coverage`, and `staged metrics`
- make this policy explicit in engine tests and UI copy
- keep `target-output-support` as the single truth boundary for support posture
- freeze the current difference between `calculateAssembly` and `calculateImpactOnly` around conservative bound support unless a deliberate product decision changes it

Primary files:

- `packages/engine/src/target-output-support.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/calculate-impact-only.ts`
- `apps/web/features/workbench/workbench-data.ts`
- `apps/web/features/workbench/dynamic-calc-branch.ts`

Exit criteria:

- for every requested output there is a defended reason why it is supported or unsupported
- no metric appears only because a number happened to be finite

### Phase 1 Contract Snapshot — Current Implementation

This is the current support boundary implemented in `packages/engine/src/target-output-support.ts` on 2026-04-03.

Companion airborne support:

- `Rw`
  - supported when assembly-side airborne metrics expose lab `Rw`
  - or when a floor carrier / floor-system rating exposes `Rw`
  - on the assembly surface, the floor carrier must continue to expose `Rw` even when the active airborne descriptor becomes `R'w`
- `Ctr`
  - supported when airborne metrics expose it directly
  - or when a floor carrier exposes a defensible `Rw` + companion term
- `R'w`
  - supported only from field-airborne metrics
  - current support logic does not silently reinterpret field `R'w` as lab `Rw`

Broad direct impact support:

- `Ln,w`
- `L'n,w`
- `L'nT,w`
  - supported when the live impact lane explicitly exposes them
  - conservative lower-bound carry-over counts as supported only on surfaces that opt into `countBoundSupportAsSupported`
  - current implementation means assembly can count bound carry-over as supported while impact-only deliberately does not

Conditional impact support:

- `CI`
- `CI,50-2500`
- `Ln,w+CI`
- `L'nT,50`
- `LnT,A`
  - supported only when the live impact lane exposes the metric in `impact.availableOutputs`
  - they are not synthesized from lower-bound support
- `DeltaLw`
  - supported when the live impact lane exposes it
  - or when lower-bound support exposes `DeltaLwLowerBound` and the caller opted into bound support as supported
  - this is a current implementation rule, not permission to broaden `DeltaLw` into generic estimate lanes without provenance

Staged metrics:

- `IIC`
- `AIIC`
- `NISR`
- `ISR`
- `LIIC`
- `LIR`
- `HIIC`
  - currently hard-disabled in the support boundary

Phase 1 direct verification added in this pass:

- `packages/engine/src/target-output-support-contract.test.ts`
  - freezes live-only conditional metrics
  - freezes the assembly vs impact-only bound-support split
  - freezes the `Rw` vs `R'w` descriptor separation
- `packages/engine/src/calculate-assembly.test.ts`
  - freezes floor-carrier `Rw` exposure on the assembly surface when airborne field context makes the active wall descriptor apparent (`R'w`)

Validated on 2026-04-03:

- `pnpm exec vitest run packages/engine/src/target-output-support-contract.test.ts packages/engine/src/dynamic-floor-regression-matrix.test.ts packages/engine/src/output-combination-sweep.test.ts`
  - `22 / 22` tests passed
- `pnpm exec vitest run packages/engine/src/calculate-assembly.test.ts packages/engine/src/dynamic-floor-regression-matrix.test.ts packages/engine/src/impact-common-floor-combinations.test.ts packages/engine/src/acoustic-output-coverage.test.ts packages/engine/src/target-output-support-contract.test.ts`
  - `217 / 217` tests passed
- `pnpm exec vitest run apps/web/features/workbench/scenario-analysis.test.ts apps/web/features/workbench/floor-family-regressions.test.ts apps/web/features/workbench/common-floor-combinations.test.ts apps/web/features/workbench/dynamic-calc-branch.test.ts`
  - `193 / 193` tests passed

## Phase 2 — Stabilize Layer Routing and Inference

Goal:

- ensure the same physical topology lands on the same lane whether the user supplies explicit roles or only visible layers

Why before widening:

- wrong routing is a more dangerous problem than missing coverage

Implementation:

- harden raw visible-layer floor-role inference
- reduce remaining exact-library parity misses from `58 / 61` toward full defended parity where appropriate
- define explicit exceptions where raw stacks should not auto-land exact
- keep predictor blocker warnings explicit when topology is ambiguous
- separate "cannot infer safely" from "inferred but lower confidence"
- keep single-layer structural-carrier policy intentionally narrow after resolving the bare `140 mm concrete` exact-row gap

Primary files:

- `packages/engine/src/impact-predictor-input.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/calculate-impact-only.ts`
- `apps/web/features/workbench/workbench-store.ts`

Key focus:

- single-layer bare structural carriers
- dry-floor vs floor-covering interpretation
- direct-fixed vs suspended ceiling inference
- raw exact-row parity for concrete, timber-frame, CLT, hollow-core, steel, and composite families

Exit criteria:

- representative raw/tagged parity stays green
- exact library parity improves or all remaining exceptions become documented and intentional
- no ambiguous raw stack is silently promoted into a false exact lane

### Phase 2 Starting Audit — Current Exception Set

Direct audit added in this pass:

- `packages/engine/src/raw-floor-exact-exception-audit.test.ts`

Validated on 2026-04-03:

- `pnpm exec vitest run packages/engine/src/impact-predictor-input.test.ts packages/engine/src/raw-floor-exact-exception-audit.test.ts packages/engine/src/assembly-raw-floor-inference.test.ts packages/engine/src/floor-library-raw-parity.test.ts packages/engine/src/dynamic-floor-regression-matrix.test.ts packages/engine/src/floor-topology-sanity-sweep.test.ts packages/engine/src/output-combination-sweep.test.ts packages/engine/src/impact-real-world-floor-coverage.test.ts`
  - `71 / 71` tests passed
- `pnpm exec vitest run packages/engine/src/impact-common-floor-combinations.test.ts packages/engine/src/acoustic-output-coverage.test.ts packages/engine/src/target-output-support-contract.test.ts`
  - `52 / 52` tests passed
- `pnpm exec vitest run apps/web/features/workbench/dynamic-calc-branch.test.ts apps/web/features/workbench/scenario-analysis.test.ts apps/web/features/workbench/common-floor-combinations.test.ts apps/web/features/workbench/guided-combination-sweep.test.ts apps/web/features/workbench/floor-family-regressions.test.ts`
  - `197 / 197` tests passed
- `pnpm engine:benchmark-airborne`
  - dynamic stayed rank `#1` with `MAE 0.00`, `RMSE 0.00`, `MaxAE 0.00`, `Win 7 / 7`

Current implementation correction from the 2026-04-12 suite triage:

- current explicit no-safe-inference exact row:
  - `dataholz_gdsnxn01a_timber_frame_lab_2026`
- raw `140 mm concrete` now infers a safe `base_structure` and still lands
  `euracoustics_f0_bare_concrete_lab_2026`
- the impact-only surface reports that concrete route as `visible_stack`, not the
  older `predictor_input` source mode
- the detailed broad-suite classification is recorded in
  `FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md`

Current evidence-rich manual exact raw/base-only drift set:

- `tuas_x3_clt140_measured_2026`
- `tuas_x4_clt140_measured_2026`
- `tuas_r7b_open_box_timber_measured_2026`
- `tuas_r8b_open_box_timber_measured_2026`
- `tuas_r10a_open_box_timber_measured_2026`
- `tuas_c3_clt260_measured_2026`
- `tuas_c4_clt260_measured_2026`
- `tuas_c5_clt260_measured_2026`
- `tuas_c7_clt260_measured_2026`
- `tuas_c7c_clt260_measured_2026`
- `tuas_c3c_clt260_measured_2026`
- `tuas_c4c_clt260_measured_2026`

Resolved in the second Phase 2 inference pass:

- raw/tagged parity is now defended for the preset-only integrated dry-floor rows:
  - `dataholz_gdrtxa06a_timber_frame_dry_lab_2026`
  - `dataholz_gdmtxa04a_clt_lab_2026`
- root cause was not predictor-lane override:
  - raw visible-layer inference was classifying thick `dry_floating_gypsum_fiberboard` as `floating_screed` even when no separate top finish existed
  - the published rows above model the same board as `floor_covering`, so raw stacks were being routed into a different family-estimate pool than their tagged equivalents
- the fix was kept deliberately narrow in `packages/engine/src/impact-predictor-input.ts`:
  - `dry_floating_gypsum_fiberboard` is now inferred as `floating_screed` only when a separate top finish exists
  - integrated dry-floor boards without a separate finish stay `floor_covering`
  - this preserves the existing open-box / laminate dry-floor interpretation while aligning the integrated Dataholz rows with curated published topology
- new regression guards added:
  - `packages/engine/src/impact-predictor-input.test.ts`
  - `packages/engine/src/assembly-raw-floor-inference.test.ts`
  - `packages/engine/src/raw-floor-exact-exception-audit.test.ts`

Current raw-vs-tagged core drift set:

- `dataholz_gdsnxn01a_timber_frame_lab_2026`
- the 12 TUAS ids listed above

Current implementation reading:

- do not attempt to “fix parity” by force-promoting raw stacks into exact lanes blindly
- prefer narrow topology-inference corrections when published rows show the raw stack is being routed through the wrong role schedule
- keep `manualMatch: false` rows estimate-only unless a deliberate preset-aware exact policy is introduced later
- isolate narrow single-layer carrier rules from broader dry-floor / integrated-topology inference changes

## Phase 3 — Add a Generic Corridor-Limited Floor-Core Estimate Lane

Goal:

- cover more stacks without disturbing exact/bound/catalog/predictor/formula precedence

Architectural rule:

- the new lane must sit after current stronger lanes and before the broadest low-confidence family fallback only if its evidence posture is genuinely better
- otherwise it should sit at the very end as a bounded fallback
- for broad live core-metric coverage, prefer extending the existing `family_estimate` posture rather than inventing a new top-level selection kind
- reserve `bound_floor_system` and `bound_family_estimate` for true conservative upper/lower-bound semantics, because those paths currently carry `ImpactBoundCalculation`, not live impact metrics

If the remaining gaps still justify a new lane after the Phase 3 audits, the first implementation should be:

- add a `generic corridor-limited core estimate` for floor-side core metrics:
  - `Ln,w`
  - `L'n,w`
  - `L'nT,w`
- make `Rw` ride through the corresponding floor carrier instead of treating it as a standalone direct-impact output
- prefer reusing the existing `family_general` estimate kind and introducing a narrower basis / note set first; add a new estimate kind only if the existing kind cannot represent the new posture honestly
- first try to express this through the existing `floorSystemEstimate` path, with a new estimate kind if needed, before adding another top-level resolver tier beside it
- add parallel conservative bound support only where that posture is genuinely useful, not as a substitute for live core-metric expansion

What it should use:

- structural family
- base surface mass
- upper treatment presence and class
- lower treatment presence and class
- treatment interaction topology
- bounded corridors per family

What it should not claim:

- `DeltaLw` unless product or source-backed semantics exist
- `CI`, `CI,50-2500`, or `L'nT,50` unless band-based or guide-backed evidence exists

Primary files:

- `packages/engine/src/impact-lane.ts`
- `packages/engine/src/floor-system-estimate.ts`
- possibly a new helper such as `packages/engine/src/floor-core-corridor-estimate.ts`
- `packages/engine/src/floor-system-ratings.ts`
- `packages/engine/src/dynamic-impact.ts`
- `packages/engine/src/impact-predictor-status.ts`
- `packages/engine/src/impact-support.ts`
- `packages/shared/src/domain/floor-system.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/calculate-impact-only.ts`

Exit criteria:

- unsupported floor combinations shrink materially for core metrics
- exact and catalog routes are not overridden
- new live results are clearly labeled as corridor-limited estimates, not exact family matches
- assembly and impact-only surfaces both understand the new posture without silently collapsing their existing support-policy differences

### Phase 3 Progress — 2026-04-03

Direct verification added in this pass:

- `packages/engine/src/floor-core-coverage-matrix.test.ts`
  - freezes 13 representative family/topology anchors across reinforced concrete, CLT, hollow-core, timber, open-box timber, open-web steel, and composite families
  - freezes the defended lab/field basis, estimate kind, and support posture for each anchor
- `packages/engine/src/floor-topology-sanity-sweep.test.ts`
  - now freezes a 48-case generated floor-topology sweep across:
    - 4 base structures: concrete, CLT, hollow-core, open-box timber
    - 4 upper packages: wet tile, wet vinyl, dry laminate, timber-acoustic upper package
    - 3 ceiling states: none, resilient-channel ceiling, stud ceiling
  - with full room-to-room airborne context plus impact field context, the sweep now requires either:
    - the full core bundle where defended impact evidence exists
    - or the explicit screening-only posture `R'w + DnT,w` where impact continuation still stays fail-closed
  - the defended full core bundle is:
    - `Rw`
    - `R'w`
    - `DnT,w`
    - `Ln,w`
    - `L'n,w`
    - `L'nT,w`
- `packages/engine/src/predictor-published-family-estimate.test.ts`
  - freezes the new narrow Dataholz suspended wet CLT family rule
  - keeps that rule limited to thin-underlay wet CLT stacks with suspended ceilings
  - prevents the remaining open-box and hollow-core screening cases from being widened by the same rule
- `packages/engine/src/bare-floor-tagged-family-contract.test.ts`
  - freezes the explicit-role single-layer bare contract for known structural families
  - prevents tagged bare open-box / open-web / generic steel carriers from borrowing unrelated concrete/composite recommendation sources
  - keeps bare timber-frame on same-family timber recommendations instead of cross-family fallback
- `packages/engine/src/bare-floor-raw-support.test.ts`
  - keeps the intentionally fail-closed bare structural families explicit
  - currently this remains true for bare open-box timber and bare open-web steel

Current quantitative reading after the support hardening pass:

- on the representative 48-case floor topology sweep with full room-to-room context:
  - `44 / 48` cases support the full floor core bundle
  - `4 / 48` cases intentionally stay on a screening-only room-to-room posture with only `R'w` and `DnT,w`
- on the same 48-case sweep with impact field context only:
  - the same `4` cases remain explicitly fail-closed on impact-continuation outputs instead of fabricating `Ln,w`, `L'n,w`, or `L'nT,w`
  - remaining screening-only / fail-closed topology ids:
    - `hollow_core_200__timber_acoustic__resilient_channel`
    - `open_box_370__tile_wet__none`
    - `open_box_370__vinyl_wet__none`
    - `open_box_370__timber_acoustic__none`
- on the 13-case family anchor matrix, all cases keep defended core metric support on both lab and field surfaces
- the remaining obvious widening target is no longer the defended concrete/CLT/timber/composite core corridor itself
- the remaining obvious widening target is the intentionally fail-closed and screening-only set:
  - unsafe bare structural families
  - under-described same-family topologies that currently have no defensible same-family live impact lane

Narrow widening completed in this pass:

- three previously screening-only CLT wet+suspended topology cases now land on a source-defended published-family lane
- the new lane is intentionally narrow:
  - CLT only
  - wet screed with thin generic resilient underlay
  - suspended ceiling present
  - no explicit upper fill and no product-specific resilient layer
- the source lineage is official Dataholz suspended wet CLT data:
  - `dataholz_gdmnxa02a_00_clt_lab_2026`
  - `dataholz_gdmnxa02a_02_clt_lab_2026`
- these source rows were added as preset-only catalog entries (`manualMatch: false`) so:
  - direct visible-layer exact matching does not widen accidentally
  - predictor-specific published-family logic can still cite official source ids
- official source URLs used for this widening:
  - `https://www.dataholz.eu/en/index/download/en/gdmnxa02a-0.pdf`
  - `https://www.dataholz.eu/en/index/download/en/gdmnxa02a-2.pdf`

Why the remaining fail-closed set still exists:

- this is not a statement that open-box timber or open-web steel are unsupported in general
- those families already have defended published / measured routes once enough topology evidence exists:
  - open-box timber exact/measured rows
  - UBIQ open-web steel exact and bound-family rows
- the remaining gap is specifically the raw single-layer bare entry posture
- current code keeps that posture fail-closed on purpose:
  - `packages/engine/src/impact-predictor-input.ts` only treats a narrow material set as safe for single-layer bare base-role inference
  - open-box timber and open-web steel are intentionally outside that safe set
  - `packages/engine/src/impact-predictor-input.test.ts` freezes this policy explicitly
- any future opening here must therefore answer a concrete policy question:
  - should these bare structural carriers gain a source-defended corridor-limited entry lane
  - or should they remain fail-closed until more topology evidence is supplied

Primary-source audit completed after the CLT widening:

- TUAS Mendeley dataset audit:
  - dataset DOI page: `https://data.mendeley.com/datasets/y83p8mpryd/2`
  - source article: `https://pmc.ncbi.nlm.nih.gov/articles/PMC10365936/`
  - the `TUAS2023FloorConstructionDrawingsR1.pdf` open-box block (`R2a` through `R2c`, pages `1-15`) was re-read directly
  - the deferred shortlist was then re-read directly against the construction drawings plus `TUAS2023FloorDetails.pdf`
  - result:
    - all currently harvested open-box rows remain laminate / EPS / dry-floor variants
    - all inspected open-box rows still include some lower-treatment build-up
    - `R2c` looked promising at first glance, but it still contains a resilient-stud + `2 x 13 mm` gypsum lower build-up, so it does not justify any `__none` topology widening
    - `R6a` and `R10a` did not open safe new imports on the audit-time surfaces because they required mixed board / staged dry-pack exact semantics
    - `R7b`, `R8b`, `R9b`, and `R2c` do not open safe new imports on current surfaces because they require a new hybrid lower-treatment support surface beyond the existing `family_a` vs `family_b` split
    - `TUAS2023FloorDetails.pdf` page `5/7` visually confirms the existing family split remains correct:
      - `R2a-R10a` uses `25 mm` wooden laths
      - `R2b-R11b` uses `25 mm` resilient steel studs
    - no TUAS open-box row was found that defends:
      - `open_box_370__tile_wet__none`
      - `open_box_370__vinyl_wet__none`
      - `open_box_370__timber_acoustic__none`
  - update on `2026-04-10`:
    - both `R6a` and `R10a` are now landed as exact rows on the current implementation surface
    - `R7b`, `R8b`, `R9b`, and `R2c` are now also landed as exact rows on the hybrid lower-treatment open-box surface
    - the hybrid open-box branch is therefore closed without reopening a generic `__none` topology lane
    - `tuas_c7_wet_geotextile_clt_surface_design_v1` is now also closed as an exact row landing
    - `tuas_post_c7_clt_boundary_tightening_v1`, `tuas_clt_remaining_combined_source_schedule_research_v1`, and `tuas_c7c_combined_wet_clt_surface_design_v1` are now also closed
    - `tuas_remaining_combined_clt_exact_import_decision_matrix_v1` is now also closed with `C3c` as the first remaining combined exact import
    - `tuas_c4c_combined_heavy_dry_exact_candidate_v1` is now also closed as exact `tuas_c4c_clt260_measured_2026`
    - `tuas_c11c_wet_stack_anomaly_audit_v1` is now also closed as deferred / fail-closed
    - the current source-backed blocker is no longer material-surface absence:
      - TUAS drawing page `24/40` exact stack is now landed as `tuas_c7_clt260_measured_2026`
      - `C2c`, `C3c`, `C4c`, and `C7c` are exact anchors, and `C5c` is predictor-backed
      - the remaining risk is accidentally widening `C11c` into combined shorthand inference, predictor aliases, or under-described direct-fixed stacks while its weak wet-stack tuple remains unexplained
    - current restart truth lives in:
      - [CURRENT_STATE.md](./CURRENT_STATE.md)
      - [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md)
- Pliteq hollow-core audit:
  - official source used: `https://genieboard.pliteq.com/wp-content/uploads/sites/8/Mar2022-ESR-3816.pdf`
  - existing official hollow-core evidence still only defends:
    - bare hollow-core with isolated ceiling
    - vinyl + resilient underlayment
    - porcelain / tile + resilient underlayment
  - no official hollow-core row was found that defends:
    - engineered-timber acoustic upper package
    - elastic bonded fill
    - resilient-channel ceiling
    - in the same topology
  - therefore `hollow_core_200__timber_acoustic__resilient_channel` remains intentionally source-gated

Result of the source audit:

- no additional safe Phase 3 widening was available from the currently harvested primary-source set
- the residual `4` screening-only topology ids are now treated as a deliberate source-gated backlog, not as an unreviewed omission

Cross-family bare fallback bug fixed in this pass:

- before this fix, some explicit single-layer bare tagged stacks for known families could slip into `family_archetype` or `low_confidence` posture using unrelated recommendations
- the observed bad symptom was concrete/composite candidate leakage into bare timber / open-box / open-web / generic steel single-layer stacks
- the fix was made in `packages/engine/src/floor-system-estimate.ts`:
  - known families without same-family evidence no longer fall back to the entire recommendation list
  - `low_confidence` now also stays inside the same-family bridge pool, except for the deliberate `unknown` family posture
- result:
  - bare open-box timber, open-web steel, steel-joist, and generic lightweight-steel tagged stacks now align with the fail-closed raw policy
  - bare timber-frame stays open, but only on same-family timber recommendations (`knauf_ct2g_timber_nil_lab_2026`, `knauf_ct2h_timber_nil_lab_2026`)

Closest-family warning hardening added after the source audit:

- before this fix, some fail-closed floor cases still printed a misleading `Closest family candidate is ...` warning from a cross-family scored row
- observed examples:
  - open-box wet / no-ceiling could mention a CLT row
  - hollow-core timber-acoustic + resilient-channel could mention a timber-frame row
- the assembly warning surface now:
  - keeps the closest-family label only when the scored row stays inside the same defended structural family
  - falls back to a generic same-family-withheld warning otherwise
- this does not change routing or supported outputs
- it only removes a misleading diagnostic that could push an implementer or user toward the wrong family

Validated on 2026-04-03:

- `pnpm exec vitest run packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts packages/engine/src/calculate-assembly.test.ts packages/engine/src/floor-topology-sanity-sweep.test.ts packages/engine/src/floor-core-coverage-matrix.test.ts packages/engine/src/dynamic-floor-regression-matrix.test.ts packages/engine/src/bare-floor-tagged-family-contract.test.ts packages/engine/src/predictor-published-family-estimate.test.ts packages/engine/src/calculate-impact-only.test.ts`
  - `278 / 278` tests passed
- `pnpm exec vitest run packages/engine/src/bare-floor-tagged-family-contract.test.ts packages/engine/src/bare-floor-raw-support.test.ts packages/engine/src/floor-core-coverage-matrix.test.ts packages/engine/src/floor-topology-sanity-sweep.test.ts packages/engine/src/dynamic-floor-regression-matrix.test.ts packages/engine/src/calculate-assembly.test.ts packages/engine/src/calculate-impact-only.test.ts packages/engine/src/impact-common-floor-combinations.test.ts packages/engine/src/acoustic-output-coverage.test.ts packages/engine/src/predictor-published-family-estimate.test.ts packages/engine/src/floor-library-sweep.test.ts`
  - `340 / 340` tests passed
- `pnpm exec vitest run apps/web/features/workbench/scenario-analysis.test.ts apps/web/features/workbench/floor-family-regressions.test.ts apps/web/features/workbench/common-floor-combinations.test.ts apps/web/features/workbench/dynamic-calc-branch.test.ts`
  - `193 / 193` tests passed
- `pnpm engine:benchmark-airborne`
  - dynamic stayed rank `#1` with `MAE 0.00`, `RMSE 0.00`, `MaxAE 0.00`, `Win 7 / 7`

Current implementation reading:

- do not add a new generic corridor-limited lane merely because the phrase exists in the plan
- representative floor-side core coverage with adequate field context is broad but no longer described as universal
- the defended posture is now:
  - full live core bundle where same-family evidence exists
  - screening-only airborne field bundle where impact evidence does not
  - fail-closed where even a corridor-limited impact carry would currently be dishonest
- the next widening pass must target a real remaining gap, not a corridor that is already green under the current support contract
- any future widening for bare open-box timber or bare open-web steel must be source-defended and keep the current fail-closed tests honest until the policy changes deliberately

## Phase 4 — Family-by-Family Deviation Tightening

Goal:

- reduce drift inside the expanded estimate space

Why after corridor-limited expansion:

- once coverage is stable, calibration can target real active lanes instead of a moving routing surface

Implementation order:

1. reinforced concrete
2. mass timber CLT
3. timber frame / joists
4. hollow core
5. lightweight steel / open-web
6. composite panel
7. open-box timber

Reasoning:

- reinforced concrete is the cleanest calibration anchor
- CLT and timber families are already active and commercially important
- steel and composite remain more topology-sensitive and should come after the earlier families

Phase 4 kickoff completed on 2026-04-03:

- `packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts`
  - freezes the first reinforced-concrete family monotonicity pack
  - current guardrails now require:
    - thicker bare heavy concrete improves `Rw`, `R'w`, and `L'nT,w`
    - a published wet heavy-floating package beats the bare heavy floor clearly on `Ln,w` and `L'nT,w`
    - adding a suspended ceiling to the published wet package does not regress the active impact posture while improving the airborne companions
- this is intentionally a relation-based guard, not an exact-number freeze
- it is the first concrete step of Phase 4 because it gives calibration freedom without letting the concrete family drift into obviously wrong directionality

CLT bare-lane tightening completed on 2026-04-03:

- problem:
  - the raw bare CLT screening lane was semantically wrong
  - a `bare_floor` CLT slab could land on a generic same-family blend that mixed:
    - TUAS thin-finish anchors
    - and occasionally wet floating CLT rows
  - this could let a raw bare CLT slab look better than the defended TUAS `x2 / c2` laminate-plus-EPS rows
- why this was a real bug:
  - it violated the intended meaning of the `predictor_mass_timber_clt_bare_interpolation_estimate` label
  - it also violated the expected physical direction:
    - bare CLT should not outperform finished or treated CLT floor packages
  - the local TUAS measured corpus only contains CLT floors with at least one floor covering
  - wider literature also points the same way:
    - multilayered CLT floors improve `Rw` and `Ln,w` relative to bare CLT slabs
    - bare CLT slabs are generally the weakest posture in the family
- implementation:
  - `packages/engine/src/predictor-published-family-estimate.ts`
    - adds a new predictor-side `clt_bare` rule on the `bare_floor` topology
    - anchors the lane to:
      - `tuas_x2_clt140_measured_2026`
      - `tuas_c2_clt260_measured_2026`
    - if the input is a true raw slab with no thin finish at all:
      - apply a conservative raw-slab penalty of `-3 dB` on the airborne side
      - apply a conservative raw-slab penalty of `+3 dB` on the impact side
    - if the input already contains the defended laminate-plus-underlay thin finish:
      - no raw-slab penalty is applied
      - the lane stays a narrow interpolation between the TUAS anchors
- why this is architecturally safer than a broader generic fix:
  - it does not change exact matching
  - it does not change bound posture
  - it does not widen support into a new topology family
  - it corrects a real CLT-specific semantic drift at the predictor lane before the generic `family_general` blend can distort the result
- guard tests added or updated:
  - `packages/engine/src/predictor-published-family-estimate.test.ts`
    - freezes the new `clt_bare` rule id and priority
    - verifies both:
      - raw bare slab with conservative penalty
      - thin-finish interpolation without the penalty
  - `packages/engine/src/bare-floor-raw-support.test.ts`
    - updates the raw bare CLT lab and field snapshot to the new conservative posture
  - `packages/engine/src/clt-floor-monotonicity.test.ts`
    - freezes these CLT relation checks:
      - raw bare `140 mm` CLT stays weaker than exact TUAS `x2`
      - raw bare `160 mm` CLT improves monotonically over raw bare `140 mm`
      - dry and wet CLT treatment packages stay clearly better than the raw bare slab
      - laminate-plus-underlay CLT interpolation stays between the defended TUAS `x2 / c2` anchors
- 2026-04-12 revalidation note:
  - the test snapshot was re-aligned to the documented raw-slab penalty without changing solver logic
  - current `140 mm` raw CLT output is `Rw 35`, `Ln,w 64`, and `Ln,w+CI 64`
  - standardized field output for the same slab is `R'w 33`, `L'n,w 66`, `L'nT,w 63.6`, and `L'nT,w+CI,50-2500 63.6`
  - dry/wet treatment guards remain relation-based; their minimum improvement margins now reflect the current source-backed Dataholz dry/wet outputs instead of the older over-strong expectation
- CLT combinations explicitly exercised in this pass:
  - raw bare CLT:
    - `140 mm`
    - `160 mm`
  - defended thin-finish anchors:
    - TUAS `x2` (`140 mm CLT + laminate + EPS`)
    - TUAS `c2` (`260 mm CLT + laminate + EPS`)
  - thin-finish interpolation:
    - `180 mm CLT + laminate + EPS`
  - stronger same-family treatment packages:
    - Dataholz dry CLT family (`dry_floating_gypsum_fiberboard + elastic_bonded_fill`)
    - Dataholz wet CLT family (`generic screed + non_bonded_chippings`)
- validation run after the change:
  - engine targeted gates:
    - `282 / 282` passed
  - workbench targeted gates:
    - `193 / 193` passed
  - airborne benchmark:
    - `dynamic` remained rank `#1`
    - `MAE 0.00`
    - `RMSE 0.00`
- remaining CLT open point after this step:
  - the dry combined CLT corridor still depends partly on `manualMatch: false` source rows such as `tuas_c5c_clt260_measured_2026`
  - those rows are intentionally excluded from generic recommendation participation today
  - do not widen that part of the CLT family casually
  - if that corridor is tightened next:
    - decide explicitly whether `manualMatch: false` rows may participate in recommendation-only routing
    - or add a new narrow predictor rule with primary-source justification instead

Sources used to justify the CLT directionality check:

- TUAS open dataset summary:
  - `https://pmc.ncbi.nlm.nih.gov/articles/PMC10365936/`
  - relevant point:
    - the published CLT families in that corpus already span from relatively weak thin-finish cases to much stronger multilayer packages
- CLT laboratory review:
  - `https://www.mdpi.com/2076-3417/12/15/7642`
  - relevant point:
    - multilayered CLT floors improve both airborne and impact single-number values compared with bare CLT slabs

Per-family tasks:

- assemble benchmark and representative topology packs
- compare exact rows against surrounding family estimates
- tighten bounded corridors
- tune estimate fit and family branch rules
- add monotonicity checks where thickness, mass, or treatment strength should move outputs predictably

Primary files:

- `packages/engine/src/floor-system-estimate.ts`
- `packages/engine/src/predictor-floor-system-estimate.ts`
- `packages/engine/src/predictor-published-family-estimate.ts`
- `packages/engine/src/predictor-low-confidence-family-estimate.ts`

Exit criteria:

- family estimates stay inside defended tolerances against curated reference rows
- fit-based branch selection becomes more stable
- low-confidence posture is reserved for true fallback use, not routine family behavior

## Phase 5 — Conditional Metric Expansion

Goal:

- widen `DeltaLw`, `CI`, `CI,50-2500`, `Ln,w+CI`, and `L'nT,50` only where semantics are legitimate

Implementation:

- keep `DeltaLw` tied to:
  - official product rows
  - exact measured systems
  - defensible treatment-transfer logic where source semantics allow it
- keep `CI` and `CI,50-2500` tied to:
  - exact measured curves
  - family rows with real companion evidence
  - explicit local-guide carry-over logic
- keep `L'nT,50` tied to:
  - exact or guide-backed paths
  - standardized or local-guide continuations with justified source terms

Primary files:

- `packages/engine/src/impact-guide.ts`
- `packages/engine/src/impact-metric-basis.ts`
- `packages/engine/src/impact-trace.ts`
- `packages/engine/src/target-output-support.ts`

Exit criteria:

- conditional metrics expand only where provenance is explicit
- the engine never exposes those metrics merely because a generic estimate lane exists

## Phase 6 — Field Continuation Hardening

Goal:

- improve field outputs after lab-side routing and estimate quality are cleaner

Scope:

- `R'w`
- `Dn,w`
- `Dn,A`
- `DnT,w`
- `DnT,A`
- `Ln,w -> L'n,w`
- `L'n,w -> L'nT,w`
- `Ln,w+CI -> L'nT,50`

Implementation:

- add physical envelopes for expert field inputs where currently too permissive
- tighten context validation for impact-side field continuation
- distinguish standardized-volume continuation from local-guide continuation more explicitly
- align field posture with the exact lab-side source quality beneath it

Primary files:

- `packages/shared/src/domain/impact-field-context.ts`
- `packages/engine/src/impact-field-context.ts`
- `packages/engine/src/impact-guide.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/calculate-impact-only.ts`

Exit criteria:

- field continuations remain honest and bounded
- implausible expert inputs are rejected or clamped by policy
- field-side support remains explicit when standardized context is incomplete

## Phase 7 — UI And Reporting Alignment

Goal:

- make the operator see solver posture as clearly as the engine understands it

Implementation:

- update workbench messaging so floor-side branch labels match actual evidence posture
- surface whether a result is:
  - exact family
  - conservative bound
  - bounded estimate
  - low-confidence fallback
- show why a conditional metric is hidden
- carry this posture into reports and exports

Primary files:

- `apps/web/features/workbench/dynamic-calc-branch.ts`
- `apps/web/features/workbench/workbench-data.ts`
- report/export helpers under `apps/web/features/workbench/`

Exit criteria:

- operator does not need to inspect raw diagnostics to understand why a result exists
- export surfaces do not overstate estimated or bounded lanes

## Phase 8 — Extended Metric Families

Goal:

- implement staged metrics only after the core ISO-side calculator is broader and tighter

Metrics:

- `IIC`
- `AIIC`
- `NISR`
- `ISR`
- `LIIC`
- `LIR`
- `HIIC`

Rule:

- do not begin this phase until Phases 0 through 7 are materially complete

Reasoning:

- extended labels add product breadth but do not fix the core calculator
- adding them early would hide more urgent architectural work

## 6. Guardrails

These rules apply to every phase.

### 6.1 Preserve lane precedence

Never allow a new estimate lane to override:

- exact floor-system match
- bound floor-system match
- official impact product row
- predictor-specific floor-system estimate
- narrow heavy-floor formula where it is legitimately applicable

### 6.2 Preserve fail-closed behavior

If support is not defended, keep the output unsupported.

### 6.3 Separate posture from value

Two numbers can be close while still having very different evidence posture. Posture must stay explicit in traces, warnings, UI, and exports.

### 6.4 Prefer bounded estimates over fake precision

When choosing between:

- a narrow but honest bounded lane
- a broader but over-precise lane

choose the bounded lane.

### 6.5 Keep assembly and impact-only in sync

If a routing or estimate change is made in:

- `calculateAssembly`
- `resolveLayerBasedImpactLane`
- `buildFloorSystemRatings`
- `target-output-support`

the corresponding `calculateImpactOnly` behavior must be reviewed in the same pass.

### 6.6 Freeze wall-side dynamic airborne unless explicitly justified

Phases 0 through 6 are floor-side dominant.

Do not modify wall-side dynamic airborne selection or calibration during those phases unless:

- a failing benchmark or parity test proves it is necessary
- the change is isolated
- airborne benchmarks stay green

## 7. Test Gates

Every phase should close with explicit verification.

Minimum gates:

- `pnpm --filter @dynecho/engine exec vitest run src/airborne-benchmark.test.ts src/impact-validation-benchmark.test.ts src/dynamic-guided-combination-sweep.test.ts src/output-perturbation-sweep.test.ts`
- `pnpm engine:benchmark-airborne`
- `pnpm --filter @dynecho/web exec vitest run dynamic-calc-branch.test.ts scenario-analysis.test.ts common-floor-combinations.test.ts guided-combination-sweep.test.ts floor-family-regressions.test.ts`

Phase 0 targeted gates:

- `pnpm exec vitest run packages/engine/src/dynamic-floor-regression-matrix.test.ts`
- `pnpm exec vitest run packages/engine/src/assembly-raw-floor-inference.test.ts packages/engine/src/floor-library-raw-parity.test.ts packages/engine/src/floor-topology-sanity-sweep.test.ts packages/engine/src/output-combination-sweep.test.ts packages/engine/src/acoustic-output-coverage.test.ts`
- `pnpm exec vitest run apps/web/features/workbench/dynamic-calc-branch.test.ts apps/web/features/workbench/scenario-analysis.test.ts apps/web/features/workbench/common-floor-combinations.test.ts apps/web/features/workbench/guided-combination-sweep.test.ts apps/web/features/workbench/floor-family-regressions.test.ts`

Additional gates by phase:

- routing/inference work:
  - raw vs tagged parity tests
  - exact library sweep
  - bound library sweep
  - `calculateAssembly` and `calculateImpactOnly` route-selection parity where both surfaces are expected to agree
- coverage expansion work:
  - floor topology sanity sweep
  - floor core coverage matrix
  - output coverage tests
  - support partition tests
  - workbench scenario-analysis and common-floor-combination regressions
- field hardening work:
  - guide and standardized continuation tests
  - expert-input envelope tests

## 8. What Should Be Implemented Next

Immediate next implementation pass:

1. keep the selected TUAS floor baseline packs and `pnpm build` green
2. keep the landed `C3c`, `C4c`, and `C7c` exact corridors plus the re-closed combined-CLT inference/predictor guard green
3. keep `tuas_c11c_wet_stack_anomaly_audit_v1` closed as deferred / fail-closed
4. keep `raw_concrete_helper_permutation_answer_guard_v1` frozen as the latest
   no-widening answer guard under `floor_raw_inference_source_led_widening_v1`
5. keep `wall_selector_wider_trace_matrix_v1` frozen as the latest
   no-widening selector trace/card checkpoint
6. keep `raw_floor_hostile_input_answer_matrix_v1` frozen as the latest
   no-widening raw-floor hostile-input guard
7. keep `ubiq_open_web_packaged_lane_trace_matrix_v1` frozen as the latest
   no-widening UBIQ packaged lower-lane checkpoint
8. re-rank before any new solver, selector, or support-widening behavior slice

Why this is the correct next cut:

- the hybrid open-box branch is already closed through `R2c`
- the staged-upper, heavy dry-top, and wet geotextile TUAS CLT branch is now closed through `C7`
- the source-evidence pass is now also closed:
  - TUAS drawing pages `25/40` through `30/40` freeze the real visible schedules for `C2c/C3c/C4c/C5c/C7c/C11c`
  - `C2c` is now landed exactly
  - `C3c` is now landed exactly after correcting the stale page `26/40` proxy from `13 mm glass wool` to `13 mm gypsum board + 2 x 15 mm gypsum board`
  - `C4c` is now landed exactly
  - `C11c` is no longer blocked by missing drawings; it is blocked by a wet-stack anomaly and route-discipline decision
- the visible combined CLT semantics pass is now also closed:
  - visible `C5c` stacks now land on the predictor-backed combined lane instead of staying screening-only
  - the enabling predictor-type fix is now narrow and the `C5c` published lane is geometry-gated
  - `C7c` is now landed exactly as the wet combined sibling
- the remaining combined backlog boundary pass is still closed and the `C7c` slice re-closed the next drift:
  - Dataholz dry combined predictor input no longer blends `tuas_c2c`
  - CLT `lower_only` no longer reopens through `C2c`
  - combined CLT visible stacks with lower treatment plus multi-entry `floating_screed` no longer auto-normalize into inferred or predictor-derived shorthand lanes
- the first remaining combined exact decision is closed with `C3c`, the C4c exact-candidate pass is closed, and the C11c wet-stack anomaly audit is closed as deferred / fail-closed
- the raw terminal-concrete plus ceiling-helper corridor has now received that
  no-widening answer guard
- the next risk is silently broadening behavior before the next route can be
  explained by value, origin, basis/source, support bucket, and workbench card
  status
- wall Phase B.2 is still partial: only the defended
  `double_leaf <-> lined_massive_wall` hold is shipped
- the next honest cut is therefore a wall selector trace matrix that expands
  evidence around settled families, the defended hold, non-AAC heavy-core
  controls, and unsupported or held user-facing routes without changing selector
  math

Completed widening-prep target after the torture pass:

- `raw_concrete_helper_permutation_answer_guard_v1`
- scope:
  - no solver behavior change
  - added explicit answer snapshots for wider concrete ceiling-helper
    permutations
  - preserve top-finish, wall-like heavy hybrid, weaker-carrier, UBIQ weak-band,
    `GDMTXA04A`, and C11c fail-closed/estimate-only boundaries
- first answer baselines from the local implementation probe:
  - split full helper over `160 mm` concrete:
    `Rw 57`, `R'w 57`, `Ln,w 72.7`, `L'n,w 74.7`, `L'nT,w 72.3`
  - split board/fill helper over `180 mm` concrete:
    `Rw 58`, `R'w 58`, `Ln,w 71.0`, `L'n,w 73.0`, `L'nT,w 70.6`
  - split board/cavity helper over `140 mm` concrete:
    `Rw 55`, `R'w 55`, `Ln,w 74.6`, `L'n,w 76.6`, `L'nT,w 74.2`
  - helper plus top-side finish after terminal concrete remains field-`Rw`
    unsupported

Deferred widening targets after this guard:

- do not widen reinforced concrete, CLT combined interaction, or raw support blindly
- first keep `C3c`, `C4c`, and `C7c` frozen as exact combined anchors, and keep `C11c` deferred unless it earns its own explicit exact corridor
- before revisiting `C11c` or raw widening, keep `tuas_floor_source_truth_rebaseline_v1` as the baseline:
  - `C2c` is now `Ln,w 35`, `Ln,w+CI 39`, `Ln,w+CI,50-2500 44`
  - `C3c` is now `Ln,w 27`, `Ln,w+CI 29`, `Ln,w+CI,50-2500 43`
  - `C4c` is now `Ln,w 24`, `Ln,w+CI 26`, `Ln,w+CI,50-2500 40`
  - `C5c` predictor-backed truth is now `Ln,w 38`, `Ln,w+CI 42`, `Ln,w+CI,50-2500 44`
  - `C7c` is now `Ln,w 30`, `Ln,w+CI 35`, `Ln,w+CI,50-2500 44`
- then re-check the intentionally fail-closed structural carriers and other real remaining gaps:
  - bare open-box timber
  - bare open-web steel
  - any future corridor-limited openings that still lack defended `CI`, `DeltaLw`, or `L'nT,50` semantics

Research order behind that widening target:

- use the now-recovered TUAS measured corpus first for the remaining CLT-local debt:
  - the published TUAS dataset contains 30 wooden and 8 concrete floors
  - it reports ISO 10140 / ISO 717 results, detailed construction drawings, and resilient-layer details for all 38 floors
  - the real visible schedules for `C2c/C3c/C4c/C5c/C7c/C11c` are now recovered locally from pages `25/40` through `30/40`
  - use that source truth to keep `C3c/C4c/C7c` frozen and to decide whether `C11c` can ever be imported without reopening shorthand-derived aliases
- mine UBIQ official rows next for open-web steel:
  - the current UBIQ source is strongest for combined upper-plus-lower system tables, not for bare open-web carriers
  - prefer widening supported open-web combined families from those official rows before attempting any bare open-web lane
- use Dataholz and other dense CLT family sources for deviation tightening before inventing a new universal lightweight-floor formula:
  - where a family has enough measured or official rows, a family-specific calibrated estimate is safer than a broad one-formula shortcut
- do not treat lightweight floor research as evidence for a single universal predictor:
  - the current literature shows strong dependence on boundary conditions, toppings, cavities, and low-frequency behavior
  - if the source corpus does not defend a lane, keep it fail-closed

Recommended tightening target after the torture pass:

- keep using family-by-family deviation tightening, but prefer lanes where:
  - source-backed anchors already exist
  - monotonicity or treatment-strength relations are physically obvious
  - the active route is already live often enough that drift matters to real operators

That is now the highest-leverage path because the defended representative concrete / CLT / timber / composite core corridor is already green under full field context, and the next meaningful gain comes from deciding the remaining combined CLT exact imports one row at a time after the landed `C7c` anchor and the re-closed inference/predictor boundary. For the live current-state truth, use `CURRENT_STATE.md`, `DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md`, and `DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md`.

## 9. Definition of Success

This execution plan succeeds when all of the following are true:

- the operator can compose substantially more floor stacks without immediately falling into unsupported outputs
- exact, bound, and product-backed lanes still land first
- estimate lanes are broader but still explicitly labeled
- core metrics become broadly available on defended topology corridors
- conditional metrics remain conditional
- field continuations are tighter and better bounded
- UI and export surfaces describe the same posture the engine actually used

The desired end state is not a calculator that always returns a number.

The desired end state is a calculator that returns the broadest honest answer it can defend.

## 10. Per-PR Checklist

Before opening or merging a PR driven by this plan, confirm all of the following:

- which phase this PR belongs to
- which lane precedence rule it touches
- whether it changes `calculateAssembly`, `calculateImpactOnly`, or both
- whether it changes support posture, routing posture, or only numerical values
- which workbench tests protect the affected user-facing contract
- whether the change introduces a new evidence posture or can live inside an existing one
- whether any unsupported metric became supported, and if so, why that is semantically justified
- whether any exact or catalog route was displaced
- whether the warnings, trace, and UI wording still describe the new behavior honestly

If any of those answers are unclear, the PR is not ready.
