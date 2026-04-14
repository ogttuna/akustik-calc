# Dynamic Calculator Current State

Document role:

- primary short snapshot for the current dynamic calculator and workbench posture
- read this before the execution plan or any archived analysis note
- for the latest committed checkpoint, also read:
  - [CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md)
    for the current end-of-day formula-provenance checkpoint
  - [CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md)
    for the prior UBIQ packaged open-web history checkpoint
- for the latest UI handoff restart point, also read:
  - [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md)
- for answer-origin, formula/source confidence, and test-meaning questions, also read:
  - [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)

## Scope

- floor and wall dynamic-calculator behavior
- workbench-side layer normalization and operator flow
- result stability under edit/reorder/localized numeric input

## Revalidated Snapshot

Last full engine revalidation: `2026-04-14`

Last full web revalidation: `2026-04-14`

Last cross-package build revalidation: `2026-04-14`

Planning / implementation update: `2026-04-14`

- latest accepted checkpoint commit:
  `1be632d test(calculator): lock UBIQ packaged floor source and history surfaces`
- post-checkpoint planning pass selected
  `post_ubiq_source_gap_decision_matrix_v1` as the immediate no-runtime
  executable planning-contract refresh and completed it target-green before any
  behavior widening
- closed no-runtime research action:
  `tuas_c11c_frequency_source_recheck_v1`
  - no runtime import was opened because the weak measured tuple is not
    explained by `CI` or `CI,50-2500`
  - `C11c` stays fail-closed until raw one-third-octave spectrum or source
    correction explains the tuple
  - validation is green: engine `4` files / `14` tests for the direct C11c pack,
    plus the wider source-gap packs listed in the plan
- closed no-runtime research action:
  `dataholz_gdmtxa04a_material_surface_recheck_v1`
  - no exact visible reopen was opened because the Dataholz source surface is a
    composite `65 mm` dry screed element (`2x12.5 mm` gypsum fibre with
    `40 mm` mineral wool), not the current local single
    `dry_floating_gypsum_fiberboard` surface
  - direct official-id source truth stays available, but visible user-entered
    `GDMTXA04A`-shaped layers stay estimate-routed
- closed checkpoint action:
  `checkpoint_validation_and_commit_v1`
  - current close-out validation is green: engine source-gap/Dataholz/C11c pack
    `6` files / `23` tests, web remaining-source-gap + Dataholz card pack `2`
    files / `8` tests, full engine suite `117` files / `837` tests, full web
    suite `110` files / `633` tests, engine/web typecheck and lint, and
    `pnpm build` plus `git diff --check`
- closed planning action:
  `post_checkpoint_next_slice_selection_v1`
  - selected the no-runtime
    `clt_combined_anchor_history_replay_matrix_v1` workbench field-card guard;
    raw bare open-box/open-web impact, `GDMTXA04A` exact reopen, `C11c` exact
    import, and wall-selector architecture widening stayed non-eligible
- closed no-runtime history guard:
  `clt_combined_anchor_history_replay_matrix_v1`
  - `C4c` exact, `C5c` predictor-backed, and under-described combined-CLT
    fail-closed routes now survive workbench split, row-order bounce,
    save/load, and floor/wall mode detour on field impact cards
  - focused web guard is green: `1` file / `1` test
- closed planning action:
  `post_heavy_concrete_formula_history_next_slice_selection_v1`
  - selected the narrow runtime-metadata slice
    `heavy_concrete_formula_field_provenance_surface_v1`
  - rejected broad raw timber, open-box, open-web, Dataholz, C11c,
    heavy-concrete formula widening, and wall-selector widening as immediate
    follow-ups
- closed planning action:
  `post_clt_combined_anchor_history_next_slice_selection_v1`
  - selected and implemented
    `heavy_concrete_formula_history_card_matrix_v1` instead of opening a new
    source-family runtime lane
- closed no-runtime formula guard:
  `heavy_concrete_formula_history_card_matrix_v1`
  - bare concrete and heavy floating-floor formula-owned impact routes now
    survive source-equivalent mass splits, row-order bounce, save/load, and
    floor/wall mode detour on workbench field impact cards
  - covered cards: `Rw`, `Ln,w`, `DeltaLw`, `L'n,w`, and `L'nT,w`
  - focused engine selection guard is green: `2` files / `4` tests
  - focused web formula history guard is green: `1` file / `3` tests
- closed runtime-metadata formula provenance guard:
  `heavy_concrete_formula_field_provenance_surface_v1`
  - numeric results did not change
  - field-carried heavy bare/floating concrete formula metrics are now still
    identified from `impact.metricBasis` after `impact.basis` changes to the
    mixed field-normalization lane
  - `impactPredictorStatus.implementedFormulaEstimate`,
    `impactSupport.formulaNotes`, `dynamicImpactTrace.selectedLabel`, the
    impact trace panel, and the Markdown report now keep the formula origin
    visible
  - focused engine provenance guard is green: `3` files / `7` tests
  - focused web provenance/history/branch guard is green: `4` files / `16`
    tests
  - full validation is green: engine `120` files / `844` tests, web `113`
    files / `638` tests, engine/web typecheck and lint, `pnpm build`, and
    `git diff --check`
- closed no-numeric-runtime proposal/method/evidence provenance guard:
  `formula_provenance_method_evidence_dossier_v1`
  - numeric results, formula constants, source rows, and supported route
    families did not change
  - field-carried heavy floating formula results now keep Annex-C formula
    derivation notes inside the proposal method dossier instead of showing
    only generic dynamic trace notes
  - the evidence packet dynamic impact citation is guarded as
    `Heavy floating-floor formula · Estimated evidence · Standardized
    field-volume carry-over.`
  - focused engine selection guard is green: `3` files / `7` tests
  - focused web method/evidence/report guard is green: `3` files / `6` tests
  - full validation is green: engine `121` files / `846` tests, web `113`
    files / `640` tests, engine/web typecheck and lint, `pnpm build`, and
    `git diff --check`
- selected next planning action:
  `post_method_evidence_formula_provenance_next_slice_selection_v1`
  - choose the next single behavior, research, or architecture slice after
    formula provenance is explicit on trace, report, method dossier, and
    evidence packet surfaces
- architecture checkpoint scan:
  - production changes in this pass are metadata/provenance-only:
    `packages/engine/src/impact-support.ts`,
    `packages/engine/src/impact-predictor-status.ts`, and
    `packages/engine/src/dynamic-impact.ts`
  - no formula scope, source row, source-family lane, or numeric acoustic
    result was widened
  - existing large-file hotspots remain manageable only because they are heavily
    covered, but future work touching them should budget extraction before
    widening behavior:
    `packages/engine/src/dynamic-airborne.ts` (about `6.6k` lines),
    `apps/web/features/workbench/simple-workbench-proposal.ts` (about `3.1k`
    lines), `apps/web/features/workbench/simple-workbench-proposal-panel.tsx`
    (about `2.0k` lines), and
    `packages/engine/src/impact-predictor-input.ts` (about `2.0k` lines)
  - the current CLT history checkpoint did not add to those hotspots
- source review during that pass kept the conservative posture:
  - UBIQ open-web evidence remains packaged INEX / finish / resilient-ceiling
    table evidence, not bare open-web impact evidence
  - Dataholz `GDMTXA04A` remains estimate-routed because the visible top layer
    cannot yet be represented by an equivalent local composite material/role
  - TUAS open-box rows remain measured packaged systems, not a raw bare carrier
    lane
- implementation comparison confirmed the existing plans are not complete
- the no-widening `mixed_floor_wall_output_card_snapshot_grid_v1` slice is now
  implemented and target-green
- the source-backed `ubiq_weak_band_exact_import_source_mapping_v1` slice is now
  implemented and target-green:
  - `FL-23`, `FL-25`, and `FL-27` are imported as `54` exact-only correction
    rows across `3` joist depths, `2` INEX deck thicknesses, and `3` finishes
  - every weak-band row carries `familyEstimateEligible: false`, so exact user
    stacks can match but nearby-family estimates cannot borrow those weaker
    rows as anchors
  - existing `FL-24` exact rows now require the resilient lower-treatment
    topology (`ubiq_resilient_ceiling` + `rockwool` + `2 x 13 mm` boards);
    direct `2 x 13 mm` open-web stacks now land on `FL-23`
  - `FL-24` also carries `familyEstimateEligible: false`; it can exact-match
    the resilient source topology, but it no longer seeds nearby-family
    estimates for raw/split lower-only helper stacks
  - upper-only weak-band visible packages still fail closed for impact unless
    the direct lower-board source stack is actually present
- the source-backed `ubiq_open_web_supported_band_finish_completion_v1` slice is
  now implemented and target-green:
  - exact floor-system catalog count is now `173`
  - UBIQ open-web exact coverage for `FL-23/24/25/26/27/28` is now `90` rows
  - supported resilient-band coverage for `FL-24/26/28` is now `36` exact rows:
    `18` bare INEX rows plus `18` timber + acoustic underlay rows
  - touched supported-band rows now live in
    [ubiq-open-web-supported-band-rows.ts](../../packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-rows.ts)
    instead of the monolithic exact catalog file
  - supported-band carpet values were left out of this exact-import slice
    because the table gives `Ln,w+CI <= 45`, not exact `Ln,w`
- the source-backed `impact_lnw_plus_ci_bound_surface_v1` slice is now
  implemented and target-green:
  - bound floor-system catalog count is now `23`
  - `18` UBIQ supported-band carpet + foam-underlay rows are imported as
    official `Ln,w+CI <=45` bound rows through `LnWPlusCIUpperBound`
  - those rows support requested `Ln,w+CI` only; they do not imply exact
    `Ln,w`, exact `CI`, or field continuations
  - workbench output cards, trace panels, exact/bound panels, charts, summaries,
    and scenario comparison now have a first pass of metric-specific
    `Ln,w+CI` bound display support
- the no-widening `bound_metric_report_surface_completion_v1` slice is now
  implemented and target-green:
  - report markdown now prints `Ln,w+CI upper bound` as a metric-specific bound
  - target `Ln,w` gap calculations do not subtract against combined
    `Ln,w+CI` bounds
  - Dutch impact reference lines keep the combined bound as a proxy and do not
    emit contact-sound compliance verdicts without exact `LnT,A`
  - field-guide copy now explicitly says combined `Ln,w+CI` bounds are not
    valid guide-base `Ln,w`
- the no-widening `ubiq_lnw_plus_ci_bound_history_guard_v1` slice is now
  implemented and target-green:
  - engine guards pin canonical, `49`-layer split, and role-reordered UBIQ
    carpet source-equivalent stacks on the same official
    `Ln,w+CI <=45` bound
  - malformed near-misses such as disjoint carpet, extra boards, missing fill,
    and wrong joist depth do not receive official bound provenance
  - workbench guards keep official `Rw 64 dB` and `Ln,w+CI <=45 dB` cards
    stable through duplicate/split/reorder, save/load, and floor/wall detours
  - this provenance-only guard is superseded by the near-miss posture slice
    below for malformed carpet stacks that leave the official bound
- the no-widening `ubiq_lnw_plus_ci_near_miss_estimate_posture_decision_v1`
  slice is now implemented and target-green:
  - malformed UBIQ open-web + carpet/foam combined-bound near-misses now fail
    closed for impact outputs after official bound matching falls off
  - the engine blocks the route from re-entering through broader
    lightweight-steel family estimates or derived predictor fallback
  - assembly keeps only screening/live `Rw` for those malformed floor stacks;
    `Ln,w`, `CI`, `Ln,w+CI`, `L'n,w`, `L'nT,w`, and `L'nT,50` stay unsupported
  - impact-only keeps all requested outputs unsupported for those same
    malformed visible/source stacks unless a separate exact/bound/source lane
    owns them
  - workbench cards mirror that posture: `Rw` stays live, exact impact cards
    stay unsupported, and field continuation cards stay `needs_input`
- the no-widening `remaining_source_gap_posture_matrix_v1` slice is now
  implemented and target-green:
  - `C11c` remains deferred / impact-fail-closed rather than borrowing nearby
    CLT combined rows
  - `GDMTXA04A` remains estimate-only on the defended Dataholz dry-CLT estimate
    lane instead of exact-reopening from a visible shorthand
  - raw bare open-web and raw bare open-box keep impact outputs deferred
  - helper-only timber and helper-only open-web negatives keep impact outputs
    deferred while field-side airborne cards remain explicit
  - engine and workbench matrices now pin value, origin, basis/source, support
    bucket, and card status for these remaining high-risk gaps
- implemented test:
  - [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
- second-pass implementation review verified the broader generated mixed
  route-history grid is already covered by `32` web cases and `32` engine cases;
  the new guard pins the missing output-card status/value projection surface on
  top of that grid
- latest targeted validation:
  - focused new card grid: `1` file / `2` tests green
  - adjacent web mixed pack including the new guard: `4` files / `7` tests
    green
  - adjacent engine mixed pack: `2` files / `2` tests green
  - focused source re-rank contract: `1` file / `3` tests green
  - focused UBIQ exact/source/posture/re-rank/backlog engine pack:
    `5` files / `210` tests green, including the full
    [calculate-assembly.test.ts](../../packages/engine/src/calculate-assembly.test.ts)
  - floor library sweep/source/raw parity/companion pack:
    `4` files / `29` tests green
  - focused UBIQ weak-band + packaged-lane workbench card pack:
    `2` files / `3` tests green
  - focused UBIQ supported-band engine pack:
    `3` files / `16` tests green
  - focused UBIQ supported-band workbench route pack:
    `1` file / `96` tests green
  - targeted `Ln,w+CI` bound regression pack:
    `5` files / `296` tests green
  - targeted report/reference/guide bound-metric web pack:
    `4` files / `103` tests green
  - targeted UBIQ combined-bound history engine pack:
    `2` files / `5` tests green
  - targeted UBIQ combined-bound workbench history/report/floor pack:
    `3` files / `100` tests green
  - targeted UBIQ combined-bound near-miss engine pack:
    `3` files / `7` tests green
  - targeted UBIQ combined-bound near-miss workbench pack:
    `3` files / `5` tests green
  - targeted remaining-source-gap posture engine pack:
    `1` file / `6` tests green
  - targeted remaining-source-gap posture workbench pack:
    `1` file / `6` tests green
  - web typecheck green with the known Next.js TypeScript plugin recommendation
  - engine typecheck green
  - focused new-file ESLint green
  - full web lint green after cleaning small existing lint debt in
    `mixed-study-mode-generated-history-grid.test.ts`,
    `mixed-study-mode-torture.test.ts`, and `normalize-rows.ts`
  - final 2026-04-14 validation after the UBIQ exact, combined-bound,
    report-surface, history-guard, near-miss posture, and remaining-source-gap
    posture slices:
    - catalog, engine, and web typecheck green
    - catalog, engine, and web lint green
    - full engine suite: `111` files / `821` tests green
    - full web suite: `106` files / `627` tests green
    - `pnpm build` green with known `sharp/@img` optional-package warnings and
      the existing Next.js TypeScript plugin recommendation
    - `git diff --check` green
- source re-rank is also now executable through:
  - [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts)
- the selected UBIQ weak-band guard is now executable through:
  - [ubiq-open-web-weaker-band-posture-guard.test.ts](../../packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts)
  - [ubiq-open-web-weaker-band-card-posture.test.ts](../../apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts)
- narrow runtime behavior changed:
  - representative open-web upper-only weak-band packages no longer borrow
    `FL-24/26/28` lower-treatment impact ratings through the generic
    lightweight-steel family estimate
  - exact direct lower-board weak-band stacks now land on official `FL-23/25/27`
    rows
  - the defended supported-band topology remains separated by resilient
    lower-treatment criteria; `FL-24` is exact-only, bare supported-band rows
    are exact-only, and `FL-26/28` timber rows remain the current
    family-estimate anchors
- latest closed no-runtime source-evidence slice:
  `raw_bare_open_web_open_box_source_evidence_re_rank_v1`
  - source re-rank found no defensible bare-carrier impact evidence for raw
    open-box or raw open-web widening
  - TUAS open-box evidence remains packaged measured systems; UBIQ open-web
    evidence remains INEX deck / finish / resilient-ceiling system tables
  - raw bare open-box and raw bare open-web impact outputs stay fail-closed
  - validation is green: targeted source-evidence contract `1` file / `3`
    tests; full engine `112` files / `824` tests; engine typecheck/lint;
    `git diff --check`
- latest closed packaged open-box guard:
  `tuas_open_box_same_package_fragmentation_design_v1`
  - all `15` imported TUAS open-box exact rows now have generated
    source-equivalent fragmentation coverage on engine route and workbench card
    surfaces
  - canonical and contiguous-fragmented same-package stacks keep identical exact
    source ids, impact values, field continuations, support buckets, and output
    card statuses/values
  - validation is green: targeted engine `1` file / `2` tests; targeted
    workbench `1` file / `2` tests; full engine `113` files / `826` tests;
    full web `107` files / `629` tests; engine/web typecheck and lint;
    `pnpm build`; `git diff --check`
- latest closed UBIQ packaged open-web finish-family guard:
  `ubiq_open_web_packaged_finish_family_design_v1`
  - all `90` imported UBIQ open-web exact rows and all `21` UBIQ open-web bound
    rows now have generated source-equivalent fragmentation coverage on engine
    route and workbench card surfaces
  - weak-band `FL-23/25/27` carpet rows stay exact-only; supported-band
    `FL-24/26/28` carpet rows stay `Ln,w+CI <=45` bound-only
  - validation is green: targeted engine `1` file / `3` tests; targeted
    workbench `1` file / `2` tests; full engine `114` files / `829` tests;
    full web `108` files / `631` tests; engine/web typecheck and lint;
    `pnpm build`; `git diff --check`
- latest closed UBIQ packaged open-web near-miss/drop-off matrix:
  `ubiq_open_web_packaged_finish_near_miss_matrix_v1`
  - representative weak-band exact-only, supported-band exact, and supported-band
    `Ln,w+CI <=45` bound packages now pin source-critical deck/board/fill drift
    across engine route and workbench card surfaces
  - source-critical mismatches do not retain official exact/bound provenance;
    valid finish switches are explicitly routed to their other official exact or
    bound row
  - validation is green: targeted engine `1` file / `1` test; targeted workbench
    `1` file / `1` test; full engine `115` files / `830` tests; full web `109`
    files / `632` tests; engine/web typecheck and lint; `pnpm build`
- latest closed UBIQ packaged open-web history replay matrix:
  `ubiq_open_web_packaged_finish_history_replay_matrix_v1`
  - representative exact, bound, source-critical near-miss, and valid
    finish-switch UBIQ packages now replay through workbench
    duplicate/split/reorder/save-load and floor/wall detours
  - source-equivalent histories preserve exact/bound ids, basis lanes, support
    buckets, and output-card statuses/values
  - source-critical near-misses remain off official exact/bound provenance after
    history replay; valid finish switches remain controlled official route
    switches
  - validation is green: targeted web guard `1` file / `1` test; adjacent UBIQ
    web pack `3` files / `4` tests; engine/web typecheck and lint; full engine
    `115` files / `830` tests; full web `110` files / `633` tests;
    `pnpm build`; `git diff --check`
- post-UBIQ source-gap planning slice:
  `post_ubiq_source_gap_re_rank_v1`
  - executable refresh closed as
    `post_ubiq_source_gap_decision_matrix_v1`
  - C11c source/frequency recheck closed as no-runtime
  - Dataholz `GDMTXA04A` material-surface recheck closed as no-runtime
  - closed checkpoint action:
    `checkpoint_validation_and_commit_v1`
  - closed follow-up planning action:
    `post_checkpoint_next_slice_selection_v1`
  - closed CLT combined anchor history guard:
    `clt_combined_anchor_history_replay_matrix_v1`
  - closed formula-lane planning action:
    `post_clt_combined_anchor_history_next_slice_selection_v1`
  - closed heavy-concrete formula history guard:
    `heavy_concrete_formula_history_card_matrix_v1`
  - closed heavy-concrete formula provenance guard:
    `heavy_concrete_formula_field_provenance_surface_v1`
  - closed proposal/method/evidence formula provenance guard:
    `formula_provenance_method_evidence_dossier_v1`
  - next selected planning action:
    `post_method_evidence_formula_provenance_next_slice_selection_v1`

Verified broad corridors:

- latest open-box dry-package fragmentation checkpoint:
  - slice id: `open_box_dry_package_fragmentation_trace_matrix_v1`
  - implemented on: `2026-04-13`
  - type: no-widening TUAS `R5b` open-box dry exact trace/card guard
  - status: implemented and target-green
  - reason this was selected:
    - raw-floor behavior widening still needs source-led evidence one carrier
      and one output surface at a time
    - TUAS `R5b` is the strongest current open-box dry anchor for future
      same-package widening, but high fragmentation and disjoint upper-package
      input needed answer/card snapshots before any widening
    - `apps/web/features/workbench/floor-family-regressions.test.ts` is already
      large, so this guard was kept in separate focused files instead of
      growing that workbench regression file
  - implemented tests:
    - `packages/engine/src/open-box-dry-package-fragmentation-trace-matrix.test.ts`
      pins lab and field values, exact/estimate route ids, basis, support
      buckets, candidate ids, and warnings
    - `apps/web/features/workbench/open-box-dry-package-fragmentation-card-matrix.test.ts`
      mirrors the same cases through workbench output-card status/value
      snapshots
  - pinned behavior:
    - a `17`-row fragmented but source-equivalent `R5b` dry package remains
      exact on `tuas_r5b_open_box_timber_measured_2026`
    - exact lab answers stay `Rw 75`, `Ln,w 44`, `Ln,w+CI 44`, with
      `DeltaLw` unsupported
    - exact field answers stay `Rw 75`, `Ln,w 44`, `L'n,w 46`,
      `L'nT,w 43.6`, and `L'nT,50 46.6`
    - a disjoint upper-fill dry package does not silently collapse onto exact
      `R5b`; it stays on `family_general` at `54%` fit with explicit duplicate
      upper-fill warning coverage
  - latest validation:
    - focused engine fragmentation trace matrix:
      `1` file, `1` test, green
    - focused workbench fragmentation card matrix:
      `1` file, `1` test, green
    - engine adjacent open-box/split pack:
      `6` files, `50` tests, green
    - workbench adjacent open-box/card/history pack:
      `5` files, `111` tests, green
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
    - `pnpm --filter @dynecho/engine test`: `103` files, `791` tests, green
    - `pnpm --filter @dynecho/web test`: `99` files, `607` tests, green
    - `pnpm build`: green with the known `sharp/@img` optional-package
      warnings and Next.js TypeScript plugin recommendation
  - next planning implication:
    - future open-box widening should stay same-package/source-led first; this
      guard is evidence for `R5b` fragmentation and disjoint fallback behavior,
      not permission to open raw bare open-box impact support
- latest open-box finish-tolerance mixed-history checkpoint:
  - slice id: `open_box_finish_tolerance_mixed_history_boundary_v1`
  - implemented on: `2026-04-13`
  - type: no-widening workbench store-history/output-card boundary guard
  - status: implemented and target-green
  - reason this was selected:
    - it was the last explicitly deferred optional route-history guard after
      `open_box_finish_tolerance_guard_v1`
    - it checks a user-hostile edit path that can otherwise hide route drift:
      duplicate a walking finish, split the laminate total, bounce row order,
      save/load the floor, detour through wall mode, then reload the floor
    - the slice measures the existing answer/card boundary before any new
      open-box or raw-floor behavior widening
  - implemented test:
    - `apps/web/features/workbench/open-box-finish-tolerance-mixed-history-boundary.test.ts`
      pins the final normalized rows plus output-card values for:
      - source-band `10 mm` laminate split as `4 + 6 mm`
      - outside-band `12 mm` laminate split as `6 + 6 mm`
  - behavior scope:
    - no solver, catalog, selector, source, support, or workbench runtime
      behavior changed
    - the `10 mm` split remains exact on
      `tuas_r2b_open_box_timber_measured_2026` with live `Rw 62`, `Ln,w 46`,
      `L'n,w 48`, and `L'nT,w 45.6`
    - the `12 mm` split remains outside the source band: `Rw` stays screening
      live at `44 dB`, while `Ln,w`, `L'n,w`, and `L'nT,w` stay unsupported /
      needs-input
  - latest validation:
    - focused workbench open-box mixed-history boundary:
      `1` file, `1` test, green
    - workbench adjacent mixed/history/floor pack:
      `5` files, `112` tests, green
    - engine adjacent source/route pack:
      `4` files, `36` tests, green
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
    - `pnpm --filter @dynecho/engine test`: `102` files, `790` tests, green
    - `pnpm --filter @dynecho/web test`: `98` files, `606` tests, green
    - `pnpm build`: green with the known `sharp/@img` optional-package
      warnings and Next.js TypeScript plugin recommendation
    - `git diff --check`: green
  - next planning implication:
    - the deferred open-box history boundary is now closed; behavior widening
      still requires naming one route family and one output surface first
- latest UBIQ open-web packaged-lane checkpoint:
  - slice id: `ubiq_open_web_packaged_lane_trace_matrix_v1`
  - implemented on: `2026-04-13`
  - type: no-widening UBIQ open-web lower-package trace/card slice
  - status: implemented and target-green
  - reason this was selected:
    - raw-floor behavior widening still carries high fake-confidence risk
    - UBIQ has explicit open-web packaged rows, but the visible route currently
      lands through source-backed family estimates rather than exact matching
    - split/tagged and reordered layer input needed answer-level and card-level
      coverage before deciding whether any UBIQ behavior should widen
  - implemented tests:
    - `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
      pins lab and field numeric answers, support buckets, candidate ids,
      estimate kind, fit percent, and warning fragments for:
      - canonical raw `2 x 16 mm` lower package
      - raw split lower package
      - tagged split lower package
      - reordered lower package
    - `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`
      mirrors those rows through workbench output-card status/value snapshots
      and user-facing warning fragments
  - behavior scope:
    - no solver, catalog, selector, source, or workbench runtime behavior changed
    - canonical, raw split, and tagged split inputs stay on
      `family_general` at `59.3%` fit
    - reordered input still returns live values, but is explicitly
      `low_confidence` at `29%` fit with duplicate-role warning coverage
    - this does not open a bare open-web raw carrier lane
  - latest validation:
    - focused engine UBIQ trace matrix:
      `1` file, `1` test, green
    - focused workbench UBIQ card matrix:
      `1` file, `1` test, green
    - engine packaged-lane/UBIQ adjacent pack:
      `7` files, `24` tests, green
    - workbench packaged-lane adjacent pack:
      `7` files, `13` tests, green
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
    - `pnpm --filter @dynecho/engine test`: `102` files, `790` tests, green
    - `pnpm --filter @dynecho/web test`: `97` files, `605` tests, green
    - `pnpm build`: green with the known `sharp/@img` optional-package
      warnings and Next.js TypeScript plugin recommendation
    - `git diff --check`: green
  - next planning implication:
    - continue re-ranking before behavior work; this checkpoint is evidence
      for the packaged lower lane, not a mandate to widen open-web support
- latest raw-floor hostile-input checkpoint:
  - slice id: `raw_floor_hostile_input_answer_matrix_v1`
  - implemented on: `2026-04-13`
  - type: no-widening pre-widening raw-floor answer/card slice
  - status: implemented and target-green
  - reason this was selected:
    - the wall-selector trace checkpoint exposed no classified behavior bug
    - raw-floor behavior widening still has the largest fake-confidence blast
      radius, so the next safe move is a stronger hostile-input guard before
      any new support lane opens
    - existing raw helpers already had support-bucket and some answer snapshots,
      but long split, reordered, and weak-carrier raw stacks needed a compact
      answer/card matrix
  - implemented tests:
    - `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
      pins numeric answers, support buckets, impact basis, no-match posture,
      warning fragments, and layer counts for:
      - long split terminal-concrete helper
      - same-material concrete helper with non-terminal concrete
      - long open-web helper negative
      - fragmented CLT lower-only negative
    - `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
      mirrors those rows through workbench output-card status/value snapshots
  - behavior scope:
    - no solver, catalog, selector, source, or workbench runtime behavior changed
    - open-web helper-heavy and fragmented CLT lower-only raw stacks still fail
      closed on impact outputs
    - concrete moved away from the terminal position still withholds field `Rw`
      even when impact field continuations remain live
  - latest validation:
    - focused engine hostile-input matrix:
      `1` file, `1` test, green
    - focused workbench hostile-input card matrix:
      `1` file, `1` test, green
    - engine raw adjacent pack:
      `6` files, `12` tests, green
    - workbench raw adjacent pack:
      `6` files, `9` tests, green
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
    - `pnpm --filter @dynecho/engine test`: `101` files, `789` tests, green
    - `pnpm --filter @dynecho/web test`: `96` files, `604` tests, green
    - `git diff --check`: green
  - next planning implication:
    - raw-floor widening remains behavior-deferred until a single
      source-backed carrier/output surface is named; this checkpoint is a guard,
      not a widening
- latest wall-selector trace checkpoint:
  - slice id: `wall_selector_wider_trace_matrix_v1`
  - implemented on: `2026-04-13`
  - type: no-widening wall-selector trace/card slice
  - status: implemented and target-green
  - reason this was selected:
    - floor source/answer/origin guards are now much stronger, but broad
      raw-floor widening still has the highest fake-confidence blast radius
    - CLT combined behavior has exact/predictor anchors, but `C11c` remains a
      deliberate deferred anomaly and `GDMTXA04A` remains estimate-only
    - wall Phase B.2 is still partial: only the defended
      `double_leaf <-> lined_massive_wall` hold is shipped
  - completed posture:
    - added engine and workbench trace/card rows before any selector behavior
      change
    - keep solver selection, source catalogs, CLT support, and raw-floor support
      unchanged unless the trace exposes a classified bug
    - the trace exposed no classified behavior bug in the representative rows,
      so no runtime behavior changed
  - implementation comparison result:
    - current trace fields already expose family decision class, runner-up
      scores, optional secondary runner-up, family-boundary hold metrics, and
      trimmed outer-span counts
    - the closed gap is now a compact wall selector output-origin/card matrix
      tying those trace fields to `Rw`, `R'w`, `DnT,w`, support buckets, and
      workbench cards
    - `packages/engine/src/dynamic-airborne.ts` is about `6630` lines, so this
      slice avoided growing it
  - implemented tests:
    - `packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts`
      pins clear double-leaf, held AAC boundary, clear lined-massive, held G5
      sibling, non-AAC heavy-core trim control, and lab double-stud control rows
    - `apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts`
      mirrors those rows through output cards, branch summary, validation
      posture, and consultant decision wording
  - latest validation:
    - focused engine trace matrix:
      `1` file, `1` test, green
    - focused workbench card matrix:
      `1` file, `1` test, green
    - engine selector/boundary pack:
      `pnpm --filter @dynecho/engine exec vitest run src/dynamic-airborne-wall-selector-trace-matrix.test.ts src/dynamic-airborne-family-boundary.test.ts src/dynamic-airborne-family-boundary-scan.test.ts --reporter=basic`
      passed: `3` files, `15` tests
    - workbench selector/boundary/validation pack:
      `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-selector-output-origin-card-matrix.test.ts features/workbench/dynamic-route-family-boundary.test.ts features/workbench/dynamic-route-family-boundary-scan.test.ts features/workbench/validation-regime.test.ts features/workbench/consultant-decision-trail.test.ts --reporter=basic`
      passed: `5` files, `26` tests
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
    - `pnpm --filter @dynecho/engine test`: `100` files, `788` tests, green
    - `pnpm --filter @dynecho/web test`: `95` files, `603` tests, green
    - `git diff --check`: green
  - next planning implication:
    - re-rank before any behavior slice; do not turn the trace checkpoint into
      automatic wall selector widening
- latest trace/measurement slice:
  - slice id: `output_origin_trace_matrix_v1`
  - status: implemented as no-widening engine/workbench evidence; no solver,
    catalog, selector, or workbench runtime behavior changed
  - result:
    - representative outputs are now pinned as
      `output -> value -> origin -> basis/source -> support/card status`
    - covered origin classes:
      - exact Dataholz dry CLT source row
      - Dataholz `GDMTXA04A` source-family estimate route
      - raw terminal-concrete plus ceiling-helper formula/predictor route
      - UBIQ bound-only source row
      - dynamic wall airborne field route
      - field-airborne missing-geometry `needs_input` posture
      - unsupported impact fail-closed posture
  - validation:
    - engine trace matrix:
      `pnpm --filter @dynecho/engine exec vitest run src/output-origin-trace-matrix.test.ts --reporter=basic`
      passed
    - workbench trace-card matrix:
      `pnpm --filter @dynecho/web exec vitest run features/workbench/output-origin-trace-card-matrix.test.ts --reporter=basic`
      passed
    - engine trace/source/raw pack:
      `pnpm --filter @dynecho/engine exec vitest run src/output-origin-trace-matrix.test.ts src/raw-concrete-helper-answer-guard.test.ts src/dataholz-clt-source-truth-audit.test.ts --reporter=basic`
      passed: `3` files, `7` tests
    - workbench trace/source/raw pack:
      `pnpm --filter @dynecho/web exec vitest run features/workbench/output-origin-trace-card-matrix.test.ts features/workbench/raw-concrete-helper-route-card-guard.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts --reporter=basic`
      passed: `3` files, `4` tests
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
    - `pnpm --filter @dynecho/engine test`: `99` files, `787` tests, green
    - `pnpm --filter @dynecho/web test`: `94` files, `602` tests, green
    - `git diff --check`: green
  - test anchors:
    - `packages/engine/src/output-origin-trace-matrix.test.ts`
    - `apps/web/features/workbench/output-origin-trace-card-matrix.test.ts`
- latest broad web-suite cleanup:
  - status: test/runner stabilization; no calculator runtime behavior changed
  - result:
    - stale workbench expectations were aligned to the current defended source
      truth and support posture:
      - TUAS `R5b` open-box dry exact `Ln,w` is `44`, matching the engine
        source-truth rebaseline
      - Dataholz `GDMTXA04A` visible route is a combined upper/lower
        source-family estimate, not an exact dry-only route
      - custom laminate mimic over open-box timber now fails closed on impact
        and stays on screening `Rw`
      - timber bare-floor low-confidence lane withholds unsupported `Ctr`
      - concrete wall screening preset keeps `Rw` live while `C` is unsupported
      - replace-base CLT store flow stays on the defended TUAS `X2/C2`
        source-family estimate
    - `apps/web` package test script now uses `vitest run --maxWorkers=1`, the
      same stable full-suite posture already used by `packages/engine`
    - web deep-hybrid route scan helpers yield periodically to the Vitest worker
      loop without reducing the scan surface
  - validation:
    - focused stale-expectation pack: `6` files, `189` tests, green
    - isolated web deep-hybrid pack: `5` files, `10` tests, green
    - full web suite: `94` files, `602` tests, green
- latest docs/analysis correction:
  - slice id: `calculation_model_and_validation_docs_v1`
  - status: docs-only local implementation audit; no solver, catalog, selector,
    or workbench runtime behavior changed
  - result:
    - [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
      now explains where `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, `L'nT,w`,
      companions, bounds, and unsupported cards come from
    - the doc separates source truth, formula truth, predictor truth, bound
      truth, and unsupported truth
    - future widening must extend the trace/measurement matrix before changing
      support or solver behavior
  - reviewed local implementation paths:
    - `calculateAssembly` orchestration
    - airborne screening and mass-law/curve rating
    - floor companion selection
    - impact-lane selection and field continuation
    - target-output support gating
    - workbench output-card value/status selection
- latest change-adjacent revalidation after the raw concrete helper answer
  guard: green
  - selected/closed slice:
    `raw_concrete_helper_permutation_answer_guard_v1`
  - engine raw/source guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/raw-concrete-helper-answer-guard.test.ts src/raw-floor-screening-carrier-support.test.ts src/raw-floor-weaker-carrier-posture.test.ts src/raw-floor-safe-bare-split-parity.test.ts src/dataholz-clt-source-truth-audit.test.ts --reporter=basic`
    - result: `5` files passed, `14` tests passed
  - workbench route/raw guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/raw-concrete-helper-route-card-guard.test.ts features/workbench/raw-floor-screening-route-support.test.ts features/workbench/raw-floor-weaker-carrier-route-posture.test.ts features/workbench/raw-floor-inferred-split-parity.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts --reporter=basic`
    - result: `5` files passed, `7` tests passed
  - typechecks:
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine test`
    - result: `98` files passed, `786` tests passed
  - scope:
    - raw terminal-concrete plus ceiling-helper answer snapshots are pinned on
      the engine surface
    - matching workbench output-card status/value snapshots are pinned
    - top-finish, wall-like heavy hybrid, and steel-joist helper negatives stay
      fail-closed where intended
    - no solver, catalog, selector, or workbench runtime behavior changed
- latest change-adjacent revalidation after the Dataholz CLT source-truth audit:
  green
  - selected/closed slice:
    `dataholz_clt_source_truth_audit_v1`
  - engine source/raw guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/dataholz-clt-source-truth-audit.test.ts src/floor-source-corpus-contract.test.ts src/raw-floor-inferred-split-parity.test.ts src/raw-floor-packaged-lane-audit.test.ts src/raw-floor-screening-carrier-support.test.ts --reporter=basic`
    - result: `5` files passed, `16` tests passed
  - workbench route/raw guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/dataholz-clt-source-truth-route.test.ts features/workbench/raw-floor-inferred-split-parity.test.ts features/workbench/raw-floor-packaged-lane-route-audit.test.ts features/workbench/raw-floor-screening-route-support.test.ts --reporter=basic`
    - result: `4` files passed, `7` tests passed
  - typechecks:
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine test`
    - result: `97` files passed, `785` tests passed
  - scope:
    - all imported Dataholz CLT rows are pinned to explicit source answers
    - `GDMTXA04A` remains estimate-routed on visible routes instead of reopening
      manual exact matching
    - no solver, catalog, selector, or workbench runtime behavior changed
- latest change-adjacent revalidation after the open-box finish tolerance guard:
  green
  - selected/closed slice:
    `open_box_finish_tolerance_guard_v1`
  - engine direct predictor guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts --reporter=basic`
    - result: `1` file passed, `19` tests passed
  - engine source/route guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/tuas-support-surface-decision-contract.test.ts --reporter=basic`
    - result: `1` file passed, `11` tests passed
  - workbench route guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
    - result: `1` file passed, `92` tests passed
  - engine route/broad guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/tuas-support-surface-decision-contract.test.ts src/floor-widening-candidate-contract.test.ts src/floor-source-corpus-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
    - result: `6` files passed, `323` tests passed
  - workbench broad route guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts --reporter=basic`
    - result: `2` files passed, `107` tests passed
  - typechecks:
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine test`
    - result: `96` files passed, `780` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages
      through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - scope:
    - TUAS open-box walking-finish fallback is now aligned to the exact visible
      role tolerance around the source `8 mm` laminate plus `3 mm` EPS pair
    - `10 mm` laminate remains accepted as a near source-band predictor input,
      while `12 mm` laminate is outside the exact open-box band and now stays
      impact-unsupported instead of borrowing `R2b/R5b/R9b` values
    - the narrower open-box guard does not change the separate CLT interpolation
      band
- previous change-adjacent revalidation after the open-box laminate/EPS walking
  finish fallback guard: green
  - selected/closed slice:
    `open_box_finish_package_guard_v1`
  - engine source/route guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/tuas-support-surface-decision-contract.test.ts --reporter=basic`
    - result: `1` file passed, `11` tests passed
  - workbench route guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
    - result: `1` file passed, `92` tests passed
  - engine route/broad guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/tuas-support-surface-decision-contract.test.ts src/floor-widening-candidate-contract.test.ts src/floor-source-corpus-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
    - result: `6` files passed, `322` tests passed
  - workbench broad route guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts --reporter=basic`
    - result: `2` files passed, `107` tests passed
  - typechecks:
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine test`
    - result: `96` files passed, `779` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages
      through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - scope:
    - TUAS open-box rows that expose a walking finish are source-backed only for
      the thin `8 mm` laminate plus `3 mm` EPS pair
    - if exact matching falls off because that laminate/EPS walking finish is
      missing, incomplete, or out of band, both the predictor-specific lane and
      visible same-family fallback now withhold impact support
    - representative `R2b`, `R5b`, and `R9b` malformed inputs stay `Rw`-only in
      lab support and withhold field impact outputs instead of borrowing
      same-family `Ln,w` values
    - valid exact open-box source rows remain live; predictor inputs with
      source-band `3 mm` underlay and no product id remain accepted, while
      explicit non-EPS or out-of-band underlay input is blocked
- previous change-adjacent revalidation after the open-box disjoint upper-package
  fallback guard: green
  - selected/closed slice:
    `open_box_disjoint_upper_fallback_guard_v1`
  - engine source/route guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/tuas-support-surface-decision-contract.test.ts --reporter=basic`
    - result: `1` file passed, `10` tests passed
  - workbench route guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
    - result: `1` file passed, `91` tests passed
  - engine source-adjacent guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/tuas-support-surface-decision-contract.test.ts src/floor-widening-candidate-contract.test.ts src/floor-source-corpus-contract.test.ts src/floor-packaged-lane-disjoint-detour.test.ts src/floor-packaged-lane-helper-disjoint-detour.test.ts --reporter=basic`
    - result: `5` files passed, `23` tests passed
  - workbench broad route guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts --reporter=basic`
    - result: `2` files passed, `106` tests passed
  - engine route/broad guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/tuas-measured-source-truth-audit.test.ts src/floor-widening-candidate-contract.test.ts src/floor-gap-ledger-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
    - result: `7` files passed, `321` tests passed
  - typechecks:
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine test`
    - result: `96` files passed, `778` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages
      through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - scope:
    - TUAS open-box hybrid wet upper packages with the source-backed
      `geotextile + screed` floating-screed schedule no longer re-enter through
      generic same-family blending when exact matching falls off because the
      staged upper schedule is disjoint or mixed out of order
    - true source rows such as `R7b/R8b/R9b/R2c` remain exact when their staged
      upper/lower schedules are entered as source-backed rows
    - the existing generic dry open-box disjoint `upper_fill` posture remains
      on the documented `family_general` lane; this guard is not a broad
      open-box fallback shutdown
- latest change-adjacent revalidation after the CLT combined malformed-finish
  fallback guard: green
  - selected/closed slice:
    `clt_combined_finish_fallback_guard_v1`
  - engine direct/route guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts --reporter=basic`
    - result: `2` files passed, `24` tests passed
  - workbench route guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts --reporter=basic`
    - result: `1` file passed, `90` tests passed
  - engine source-adjacent guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/raw-floor-inferred-split-parity.test.ts src/floor-exact-companion-split-parity.test.ts src/impact-predictor-input.test.ts src/floor-source-corpus-contract.test.ts src/floor-widening-candidate-contract.test.ts src/clt-floor-monotonicity.test.ts src/predictor-published-family-estimate.test.ts src/tuas-measured-source-truth-audit.test.ts --reporter=basic`
    - result: `8` files passed, `83` tests passed
  - engine route/broad guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/tuas-measured-source-truth-audit.test.ts src/floor-widening-candidate-contract.test.ts src/floor-gap-ledger-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
    - result: `7` files passed, `321` tests passed
  - workbench broad route guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts features/workbench/raw-floor-inferred-split-parity.test.ts --reporter=basic`
    - result: `3` files passed, `106` tests passed
  - typechecks:
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine test`
    - result: `96` files passed, `777` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages
      through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - scope:
    - combined CLT stacks with explicit lower treatment and malformed
      laminate/EPS walking finishes no longer re-enter through the generic
      same-family CLT archetype after the direct predictor rejects them
    - valid source-backed laminate/EPS pairs remain live for the defended TUAS
      CLT rows, including the existing C7-style wet package posture
    - malformed combined CLT finishes stay impact-unsupported instead of
      borrowing `Ln,w` / `Ln,w+CI` values from `C2c/C3c/C4c/C5c` neighbors
- latest change-adjacent revalidation after the CLT dry finish-package guard:
  green
  - selected/closed slice:
    `clt_dry_finish_package_guard_v1`
  - engine direct/source guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/tuas-measured-source-truth-audit.test.ts --reporter=basic`
    - result: `3` files passed, `31` tests passed
  - engine source-adjacent guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/raw-floor-inferred-split-parity.test.ts src/floor-exact-companion-split-parity.test.ts src/impact-predictor-input.test.ts src/floor-source-corpus-contract.test.ts src/floor-widening-candidate-contract.test.ts src/clt-floor-monotonicity.test.ts src/predictor-published-family-estimate.test.ts src/tuas-measured-source-truth-audit.test.ts --reporter=basic`
    - result: `8` files passed, `83` tests passed
  - engine route/broad guard pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/tuas-measured-source-truth-audit.test.ts src/floor-widening-candidate-contract.test.ts src/floor-gap-ledger-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
    - result: `7` files passed, `321` tests passed
  - workbench route guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts features/workbench/raw-floor-inferred-split-parity.test.ts --reporter=basic`
    - result: `3` files passed, `105` tests passed
  - typechecks:
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine test`
    - result: `96` files passed, `777` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages
      through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - scope:
    - TUAS `X5/C5c` dry CLT interaction lanes still accept the source-backed
      `8 mm` laminate plus `3 mm` EPS finish band
    - explicitly out-of-band laminate or EPS thicknesses no longer borrow the
      measured dry interaction lane or the fallback same-family CLT archetype
    - source-backed C7-style wet upper packages remain on their existing
      family-estimate posture when entered as missing-role raw rows
- latest change-adjacent revalidation after the CLT laminate-underlay
  interpolation guard: green
  - selected/closed slice:
    `clt_laminate_underlay_interpolation_guard_v1`
  - engine direct/route guard packs:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts --reporter=basic`
    - result: `2` files passed, `22` tests passed
    - command: `pnpm --filter @dynecho/engine exec vitest run src/raw-floor-inferred-split-parity.test.ts src/floor-exact-companion-split-parity.test.ts src/impact-predictor-input.test.ts src/floor-source-corpus-contract.test.ts src/floor-widening-candidate-contract.test.ts src/clt-floor-monotonicity.test.ts src/predictor-published-family-estimate.test.ts --reporter=basic`
    - result: `7` files passed, `74` tests passed
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/clt-floor-monotonicity.test.ts src/floor-widening-candidate-contract.test.ts src/floor-gap-ledger-contract.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
    - result: `6` files passed, `312` tests passed
  - workbench route guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-family-regressions.test.ts features/workbench/floor-stack-invariance.test.ts features/workbench/raw-floor-inferred-split-parity.test.ts --reporter=basic`
    - result: `3` files passed, `104` tests passed
  - typechecks:
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine test`
    - result: `96` files passed, `775` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages
      through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - scope:
    - raw bare CLT remains on the conservative TUAS X2/C2 interpolation lane
    - source-backed `laminate + EPS underlay` CLT entries remain live and stable
    - laminate-only CLT and physically out-of-band laminate entries no longer
      inherit the full TUAS X2/C2 impact improvement
    - workbench now keeps those malformed CLT finish packages at `Rw`-only /
      impact-unsupported instead of showing source-like `Ln,w` cards
- latest change-adjacent revalidation after the floor airborne companion
  semantics audit: green
  - selected/closed slice:
    `floor_airborne_companion_c_ctr_semantic_audit_v1`
  - engine semantic guard packs:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/predictor-family-estimate-shared.test.ts src/target-output-support-contract.test.ts src/tuas-measured-source-truth-audit.test.ts src/output-combination-sweep.test.ts src/dataholz-timber-frame-source-truth-audit.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts src/dynamic-floor-regression-matrix.test.ts src/predictor-branch-stability-sweep.test.ts --reporter=basic`
    - result: `9` files passed, `326` tests passed
  - workbench semantic guard pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/scenario-analysis.test.ts features/workbench/simple-workbench-output-model.test.ts features/workbench/dataholz-timber-frame-source-truth-route.test.ts features/workbench/floor-output-card-support-parity.test.ts --reporter=basic`
    - result: `4` files passed, `84` tests passed
  - typechecks:
    - `pnpm --filter @dynecho/shared typecheck`: green
    - `pnpm --filter @dynecho/catalogs typecheck`: green
    - `pnpm --filter @dynecho/engine typecheck`: green
    - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
      TypeScript plugin recommendation
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine test`
    - result: green in this companion-semantics slice; the current full-suite
      count is recorded in the latest CLT guard section above
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages
      through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - scope:
    - floor airborne companion semantics now distinguish `rw_plus_c`,
      `rw_plus_ctr`, and `ctr_term`
    - all `31` currently imported TUAS exact floor-system rows with a
      spreadsheet airborne companion now carry `RwCtrSemantic: "rw_plus_c"`
    - TUAS source row `42` is exposed as source-backed `C` / `Rw+C`, not as
      `Ctr`
    - Dataholz timber-frame rows keep `Ctr` term behavior through
      `RwCtrSemantic: "ctr_term"` and still prefer source `Ctr` over screening
      `Ctr`
    - target-output support, exact/official-id floor routes, predictor-family
      propagated companions, output-combination sweeps, and floor workbench
      cards now share the same C-vs-Ctr contract
    - low-confidence mixed-source predictor companions now fail closed when the
      source candidate set mixes Dataholz `ctr_term` with Knauf `Rw+Ctr`
      semantics
- engine defended corridor: green
  - `22` files
  - `365` tests
- workbench defended corridor: green
  - `24` files
  - `294` tests
- latest change-adjacent revalidation after the TUAS measured lightweight timber
  source-truth audit: green
  - selected/closed slice:
    `tuas_measured_lightweight_timber_source_triage_v1`
  - engine targeted pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/tuas-measured-source-truth-audit.test.ts src/tuas-candidate-backlog-contract.test.ts src/tuas-support-surface-decision-contract.test.ts src/tuas-clt-backlog-decision-contract.test.ts src/tuas-c11c-wet-stack-anomaly-audit.test.ts src/raw-floor-exact-exception-audit.test.ts src/raw-floor-weaker-carrier-posture.test.ts src/calculate-impact-only.test.ts src/calculate-assembly.test.ts --reporter=basic`
    - result: `9` files passed, `345` tests passed
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine test`
    - result: `95` files passed, `770` tests passed
  - engine typecheck:
    - command: `pnpm --filter @dynecho/engine typecheck`
    - result: green
  - web standalone typecheck:
    - command: `pnpm --filter @dynecho/web typecheck`
    - result: green with the known Next.js TypeScript plugin recommendation
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages
      through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - new audit contract:
    - `packages/engine/src/tuas-measured-source-truth-audit.test.ts`
    - result: `7` tests passed
  - scope:
    - no solver, catalog, or workbench behavior changed in this slice
    - all `29` currently imported TUAS measured open-box / CLT rows are pinned
      to explicit spreadsheet single-number truth for `Rw`, `Rw+C`, `Ln,w`,
      `CI`, `CI,50-2500`, `Ln,w+CI`, and official-id field continuations
    - role-tagged visible stacks stay exact except the deliberately
      predictor-backed `X5` and `C5c` rows, which remain non-exact
      family-general routes with their source row as the only candidate
    - current missing-role drift is numeric and intentional: under-described raw
      CLT / hybrid open-box / combined-CLT stacks either stay impact
      unsupported or remain on family estimate routes instead of widening into
      exact rows
    - raw bare, upper-only, and lower-only open-box carrier attempts remain
      impact fail-closed
    - contiguous merge-safe split pieces preserve exact TUAS source answers,
      while disjoint/intervening single-entry role splits withhold exact routes
      and emit visible topology warnings
    - workbench card tests were not expanded because this audit did not change
      any route support bucket or output-card surface
- latest change-adjacent revalidation after the Dataholz timber-frame
  role-gated source-truth audit: green
  - selected/closed slice:
    `dataholz_timber_frame_role_gated_raw_predictor_audit_v1`
  - engine targeted pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/dataholz-timber-frame-source-truth-audit.test.ts src/target-output-support-contract.test.ts src/raw-floor-exact-exception-audit.test.ts src/raw-floor-weaker-carrier-posture.test.ts src/floor-exact-companion-split-parity.test.ts src/floor-source-corpus-contract.test.ts src/calculate-assembly.test.ts src/calculate-impact-only.test.ts --reporter=basic`
    - result: `8` files passed, `310` tests passed
  - workbench targeted pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-output-model.test.ts features/workbench/dataholz-timber-frame-source-truth-route.test.ts features/workbench/floor-family-regressions.test.ts features/workbench/raw-floor-weaker-carrier-route-posture.test.ts features/workbench/floor-stack-invariance.test.ts --reporter=basic`
    - result: `5` files passed, `114` tests passed
  - engine typecheck:
    - command: `pnpm --filter @dynecho/engine typecheck`
    - result: green
  - web standalone typecheck:
    - command: `pnpm --filter @dynecho/web typecheck`
    - result: green after the workbench test typing hygiene pass
  - workbench typing hygiene pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/dynamic-route-family-boundary-scan.test.ts features/workbench/dynamic-route-family-boundary.test.ts features/workbench/dynamic-route-order-sensitivity.test.ts features/workbench/floor-output-availability-matrix.test.ts features/workbench/floor-output-card-support-parity.test.ts features/workbench/wall-output-card-support-parity.test.ts features/workbench/floor-packaged-lane-disjoint-route-detour.test.ts features/workbench/floor-packaged-lane-helper-disjoint-route-detour.test.ts features/workbench/floor-profile-boundary-route-matrix.test.ts features/workbench/raw-floor-inferred-split-parity.test.ts features/workbench/raw-floor-packaged-lane-route-audit.test.ts features/workbench/raw-floor-safe-bare-split-parity.test.ts features/workbench/raw-floor-screening-route-support.test.ts features/workbench/raw-floor-weaker-carrier-route-posture.test.ts features/workbench/simple-workbench-output-model.test.ts features/workbench/dataholz-timber-frame-source-truth-route.test.ts --reporter=basic`
    - result: `16` files passed, `64` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages
      through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - scope:
    - no generic raw widening was taken for `timber_frame_floor`,
      `timber_joist_floor`, or `engineered_timber_structural`
    - all `10` imported Dataholz timber-frame rows now have executable
      source-truth guards for `Rw`, companion `Ctr`/`Rw+Ctr`, `Ln,w`, `CI`,
      `CI,50-2500`, `Ln,w+CI`, field continuations, basis labels, and
      support/unsupported buckets
    - role-tagged exact rows stay exact, raw no-lining timber-frame input stays
      impact fail-closed, and disjoint/intervening split topology does not
      preserve exact-match state
    - workbench floor-study `Ctr` output cards now prefer the active floor-system
      companion before live airborne screening `Ctr`, so exact Dataholz
      `GDRNXA11A` displays source `Ctr -17 dB` instead of screening `-6 dB`
    - strict web test typing debt is closed for the touched workbench route and
      output-card test files by using literal `FloorRole` rows, string-normalized
      draft thicknesses, explicit evaluated-result guards, typed warning/note
      callbacks, and output-status maps scoped to requested outputs
- latest change-adjacent revalidation after the TUAS `C7` wet geotextile exact landing: green
  - engine targeted pack: `6` files, `313` tests
  - workbench targeted pack: `1` file, `81` tests
- latest change-adjacent revalidation after the TUAS post-`C7` CLT boundary tightening closure: green
  - engine targeted pack: `8` files, `333` tests
  - workbench targeted pack: `2` files, `91` tests
- latest change-adjacent revalidation after the TUAS `C5c` visible combined CLT semantics closure: green
  - engine targeted pack: `5` files, `340` tests
  - workbench targeted pack: `2` files, `91` tests
- latest change-adjacent revalidation after the TUAS remaining combined backlog boundary-matrix closure: green
  - engine targeted pack: `3` files, `58` tests
  - workbench targeted pack: `2` files, `95` tests
- latest change-adjacent revalidation after the TUAS remaining combined source-schedule research, `C2c` exact landing, and CLT adjacency re-close: green
  - engine targeted pack: `12` files, `381` tests
  - workbench targeted pack: `2` files, `96` tests
- latest app-local workbench boundary matrix revalidation after the same CLT adjacency re-close: green
  - workbench targeted pack: `1` file, `14` tests
  - operational note: run this pack from `apps/web` with the local Vitest config so `@` aliases resolve correctly
- latest repository build revalidation on `2026-04-10`: green
  - command: `pnpm build`
  - engine DTS blocker and web typecheck blocker are both closed
  - the same non-blocking `Node >=22` engine mismatch and `sharp/@img` `proposal-docx` warnings still remain
- latest change-adjacent revalidation after the TUAS floor source-truth rebaseline: green
  - selected/closed slice: `tuas_floor_source_truth_rebaseline_v1`
  - engine targeted pack: `6` files, `331` tests
  - workbench targeted pack: `2` files, `98` tests
  - repository build: green
  - key finding:
    - imported TUAS floor rows and TUAS-backed predictor lanes had source drift from the `SoundInsulation` spreadsheet single-number rows
    - catalog and predictor values are now rebaselined to rows `34` (`Ln,w`), `35` (`Ln,w+CI`), `36` (`Ln,w+CI,50-2500`), `41` (`Rw`), and `42` (`Rw+C`)
    - later companion-semantics work closed the row `42` label debt: TUAS
      `Rw+C` rows now use `RwCtrSemantic: "rw_plus_c"` and expose `C`, not
      `Ctr`
- latest change-adjacent revalidation after the `C7c` exact landing plus combined-CLT predictor/inference re-close: green
  - engine targeted pack: `4` files, `345` tests
  - workbench targeted pack: `2` files, `98` tests
  - key route-control anchor:
    - combined CLT visible stacks with lower treatment plus multi-entry `floating_screed` now stay fail-closed on auto inference and predictor derivation
    - `C3c/C4c/C11c` therefore remain screening-only after `C7c` instead of reopening through packed shorthand aliases
- latest change-adjacent revalidation after the `C3c` exact decision-matrix import: green
  - selected/closed slice: `tuas_remaining_combined_clt_exact_import_decision_matrix_v1`
  - engine targeted pack: `6` files, `325` tests
  - workbench targeted pack: `2` files, `100` tests
  - repository build: green
  - known non-blocking warnings remain: local Node is `20.20.1` while package engines want `>=22`, and the existing `sharp/@img` optional-package warnings still flow through `proposal-docx`
  - key route-control anchor:
    - `C3c` is now exact as `tuas_c3c_clt260_measured_2026`
    - source correction: TUAS drawing page `26/40` shows `13 mm gypsum board + 2 x 15 mm gypsum board`, not a `13 mm` glass-wool upper-fill layer
    - `C3c` source truth is `Ln,w 27`, `Ln,w+CI 29`, `Ln,w+CI,50-2500 43`, `Rw 73`; later companion-semantics work marks spreadsheet row `42` as `Rw+C` through `RwCtrSemantic: "rw_plus_c"`
    - exact split parity now admits only merge-safe contiguous same-role/same-material packed thickness equivalents; mixed-material schedules still stay explicit
    - at that checkpoint, `C4c` and `C11c` remained deferred; `C4c` was the next narrow exact candidate, while `C11c` needed a separate wet-stack anomaly check before any import
- latest change-adjacent revalidation after the `C4c` exact candidate landing and combined-CLT guard re-close: green
  - selected/closed slice: `tuas_c4c_combined_heavy_dry_exact_candidate_v1`
  - engine C4c/backlog/source/split/predictor pack: `6` files, `83` tests
  - engine assembly/impact-only route guard pack: `2` files, `287` tests
  - engine gap/noise/support pack: `3` files, `12` tests
  - workbench targeted pack: `2` files, `102` tests
  - repository build: green
  - known non-blocking warnings remain: local Node is `20.20.1` while package engines want `>=22`, and the existing `sharp/@img` optional-package warnings still flow through `proposal-docx`
  - key route-control anchor:
    - `C4c` is now exact as `tuas_c4c_clt260_measured_2026`
    - `C4c` source truth is `Ln,w 24`, `Ln,w+CI 26`, `Ln,w+CI,50-2500 40`, `Rw 74`; later companion-semantics work marks spreadsheet row `42` as `Rw+C` through `RwCtrSemantic: "rw_plus_c"`
    - under-described combined CLT stacks with lower board/fill but no explicit `ceiling_cavity` stay fail-closed even though profile-aligned `C4c` now exists
    - at that checkpoint, `C11c` was the only remaining source-backed combined CLT backlog row and still needed a separate wet-stack anomaly audit before any import
- latest change-adjacent revalidation after the `C11c` wet-stack anomaly audit: green
  - selected/closed slice: `tuas_c11c_wet_stack_anomaly_audit_v1`
  - engine C11c audit pack: `1` file, `2` tests
  - key route-control anchor:
    - `C11c` remains deliberately deferred / fail-closed; no exact catalog row is imported
    - visible source schedule is known: `CLT 260`, `30 mm` glass wool, geotextile, `40 mm` screed, and the same suspended lower ceiling
    - source truth is `Ln,w 59`, `Ln,w+CI 60`, `Ln,w+CI,50-2500 60`, `Rw 74`
    - anomaly scale is now executable: `C11c` is `35 dB` weaker than same-airborne `C4c`, `29 dB` weaker than nearby wet combined `C7c`, and `21 dB` weaker than predictor-backed dry combined `C5c` on `Ln,w`
    - current route behavior remains honest: screening-only `Rw 49`, no exact match, no predictor estimate, and impact outputs unsupported
- latest source-truth fixture revalidation after the first TUAS broad-suite refresh: green
  - engine fixture pack: `5` files, `88` tests
  - refreshed stale TUAS/Open Box/CLT expectations in predictor, layer-driven, common-floor, validation-regime, and dynamic-route snapshots
  - full engine-suite status after this refresh: `83` files passed, `10` failed; `743` tests passed, `13` failed; `3` worker-timeout errors
- latest raw bare CLT posture revalidation after the documented `clt_bare` penalty alignment: green
  - engine bare-CLT posture pack: `2` files, `7` tests
  - no solver logic changed in this slice; stale raw bare CLT snapshots were aligned to the already-documented `-3 dB` airborne / `+3 dB` impact raw-slab penalty
  - current `140 mm` raw CLT snapshot is `Rw 35`, `Ln,w 64`, `Ln,w+CI 64`, with standardized field outputs `R'w 33`, `L'n,w 66`, `L'nT,w 63.6`, and `L'nT,w+CI,50-2500 63.6`
  - full engine-suite status after this refresh: `86` files passed, `7` failed; `746` tests passed, `10` failed; `4` worker-timeout errors
- latest broad-suite cleanup after stale impact fixture, field/topology, upstream-parity, wall-stability, and runner-stability refresh: green
  - impact/field/topology/parity/wall target pack: `7` files, `21` tests
  - validation-regime pack: `2` files, `5` tests
  - deep-hybrid runner pack: `5` files, `10` tests
  - web validation-regime pack: `2` files, `13` tests
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 --reporter=basic`
    - result: `93` files passed, `757` tests passed
  - repository build: green
    - known non-blocking warnings remain: `sharp/@img` optional packages through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - engine package typecheck: green in the follow-up test-typing cleanup slice below
  - operational note:
    - direct multi-worker `vitest run` currently has all assertions green but can still exit non-zero from Vitest worker RPC `onTaskUpdate` timeout after the CPU-heavy dynamic-airborne scan cluster
    - `packages/engine` package `test` now uses `--maxWorkers=1` so the default package-level full suite follows the stable path
  - key route-control anchors:
    - stale TUAS/Open Box/CLT/UBIQ validation tuples are aligned to current source truth
    - under-described combined dry-plus-wet CLT is tracked as explicit `unsupported_gap`
    - workbench validation-regime reporting now labels that unsupported posture instead of assuming every benchmark mode is exact/estimate/bound/field/low-confidence
    - accepted local upstream impact divergences are listed per metric and remain fail-strict for any unlisted mismatch
    - AAC lined-massive wall stability is aligned to the existing `100 mm` family-boundary hold contract without solver widening
    - deep-hybrid stress tests now yield periodically to the Vitest worker RPC loop and split the largest non-AAC swap cohort by board pair while preserving the same search space
- latest engine test-typing cleanup after the broad-suite triage: green
  - command: `pnpm --filter @dynecho/engine typecheck`
  - result: green
  - targeted touched-test pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/dynamic-airborne-family-boundary-scan.test.ts src/dynamic-airborne-family-boundary.test.ts src/dynamic-airborne-instability-repro.test.ts src/dynamic-airborne-order-sensitivity.test.ts src/floor-packaged-lane-disjoint-detour.test.ts src/floor-packaged-lane-helper-disjoint-detour.test.ts src/floor-source-corpus-contract.test.ts src/raw-floor-weaker-carrier-posture.test.ts src/tuas-c11c-wet-stack-anomaly-audit.test.ts src/tuas-candidate-backlog-contract.test.ts src/tuas-clt-backlog-decision-contract.test.ts src/tuas-post-corridor-screening-contract.test.ts src/tuas-support-surface-decision-contract.test.ts src/ubiq-candidate-backlog-contract.test.ts --reporter=basic`
    - result: `14` files passed, `97` tests passed
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 --reporter=basic`
    - result: `93` files passed, `757` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - scope:
    - no acoustic solver behavior changed in this cleanup slice
    - closed test-only strict typing debt for warning/note callbacks, empty TUAS backlog arrays, nullable UBIQ fixture arrays, and C11c audit option/rating typing
- latest mixed floor/wall torture expansion after the green full-suite gate: green
  - selected/closed slice: `mixed_boundary_floor_torture_expansion_v1`
  - engine targeted pack:
    - command: `pnpm --filter @dynecho/engine exec vitest run src/mixed-floor-wall-generated-matrix.test.ts --reporter=basic`
    - result: `1` file passed, `1` test passed
  - workbench targeted pack:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts --reporter=basic`
    - result: `3` files passed, `5` tests passed
  - engine typecheck:
    - command: `pnpm --filter @dynecho/engine typecheck`
    - result: green
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 --reporter=basic`
    - result: `93` files passed, `757` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages through `proposal-docx`, and the Next.js TypeScript plugin recommendation
  - scope:
    - no acoustic solver or catalog behavior changed
    - generated mixed engine/workbench grids now include the TUAS `C11c` combined wet fail-closed stack
    - generated mixed engine/workbench grids now include the Dataholz `GDMTXA04A` manual-match boundary stack
    - split, duplicate/swap/remove/rebuild, cross-mode partial edit, and save/load chains now guard both risk surfaces
  - route-control anchor:
    - `C11c` remains screening-only / impact-unsupported under split and history detours
    - `GDMTXA04A` remains dry-family estimate-routed instead of reopening the manual exact lane under split and history detours
- latest generated mixed history-grid variant expansion: green
  - selected/closed slice: `mixed_history_grid_variant_expansion_v1`
  - scope:
    - no acoustic solver, catalog, selector, or workbench behavior changed
    - the generated mixed workbench history grid now covers four complementary
      duplicate/swap/rebuild variants instead of two
    - the added variants cover ascending direct trailing rebuild and descending
      reversed leading rebuild paths
    - the same generated floor/wall case set remains stable through direct final
      parity, longer cross-mode partial-edit restore chains, and save/load
      roundtrips
  - targeted validation:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-generated-history-grid.test.ts --reporter=basic`
    - result: `1` file passed, `3` tests passed
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts --reporter=basic`
    - result: `3` files passed, `5` tests passed
    - command: `pnpm --filter @dynecho/engine exec vitest run src/mixed-floor-wall-generated-matrix.test.ts --reporter=basic`
    - result: `1` file passed, `1` test passed
    - command: `pnpm --filter @dynecho/engine typecheck`
    - result: green
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 --reporter=basic`
    - result: `93` files passed, `757` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages through `proposal-docx`, and the Next.js TypeScript plugin recommendation
- latest seeded mixed cross-mode edit-chain expansion: green
  - selected/closed slice: `mixed_seeded_cross_mode_wall_family_expansion_v1`
  - scope:
    - no acoustic solver, catalog, selector, or workbench store behavior changed
    - the representative mixed torture save/load chain now alternates the seeded
      floor detour matrix with two distinct wall-family detours instead of one
    - the new concrete-wall detour splits and reorders rockwool/concrete layers,
      changes the lining board, saves the scenario, and verifies reload parity at
      the saved-scenario retention boundary
    - the existing deep hybrid wall detour remains in the same chain, so the
      wider seeded cross-mode chain now checks both framed/deep-hybrid and
      concrete-wall edit families
  - targeted validation:
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-torture.test.ts --reporter=basic`
    - result: `1` file passed, `3` tests passed
    - command: `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-torture.test.ts features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts features/workbench/floor-seeded-edit-stability.test.ts features/workbench/wall-seeded-edit-stability.test.ts --reporter=basic`
    - result: `6` files passed, `10` tests passed
    - command: `pnpm --filter @dynecho/engine exec vitest run src/mixed-floor-wall-generated-matrix.test.ts src/mixed-floor-wall-complex-stack.test.ts --reporter=basic`
    - result: `2` files passed, `2` tests passed
    - command: `pnpm --filter @dynecho/engine typecheck`
    - result: green
  - stable full engine suite:
    - command: `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 --reporter=basic`
    - result: `93` files passed, `757` tests passed
  - repository build:
    - command: `pnpm build`
    - result: green
    - known non-blocking warnings remain: `sharp/@img` optional packages through `proposal-docx`, and the Next.js TypeScript plugin recommendation
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
  - the same historical slice re-confirmed that `FL-23`, `FL-25`, and `FL-27`
    stayed deliberately deferred at that checkpoint; superseded on `2026-04-14`
    by exact-only correction import
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
  - TUAS open-box exact rows: `15`
  - TUAS CLT exact rows: `12`
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
- latest Dataholz CLT source-truth guard:
  - slice id: `dataholz_clt_source_truth_audit_v1`
  - status: closed as no-widening audit
  - no solver, catalog, selector, or workbench runtime behavior changed
  - every imported Dataholz CLT row is now pinned to explicit catalog source
    truth and official-id field continuation answers
  - visible raw/tagged CLT routes now also assert the actual answer posture:
    - manual-match-enabled rows remain exact
    - `GDMNXA02A-00` and `GDMNXA02A-02` remain screening-only on visible rows
    - `GDMTXA04A` stays on the dry CLT estimate route through
      `dataholz_gdmtxa01a_clt_lab_2026`
  - workbench output-card coverage now checks exact dry CLT cards and the
    `GDMTXA04A` estimate-routed card surface, including `Rw`, `Ctr`, `Ln,w`,
    and `Ln,w+CI`
- the living source-gap ledger now includes a TUAS candidate-import backlog:
  - safe `b`-family widening is imported: `R2b`, `R3b`, `R11b`
  - explicit `a`-family open-box widening is now also imported: `R3a`, `R5a`
  - drawing-backed reinforced `b`-family widening is now also imported: `R6b`
  - the TUAS CLT staged-upper, heavy dry-top, and wet geotextile tiers are now landed through `C7`; the remaining CLT backlog is the combined `c`-family rows plus the adjacent CLT boundary-tightening work
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
  - the original deferred drawing-audit shortlist is now partially resolved on exact surfaces:
    - `TUAS2023FloorDetails.pdf` page `5/7` visually confirms the existing family split remains correct:
      - `R2a-R10a` uses `25 mm` wooden laths
      - `R2b-R11b` uses `25 mm` resilient steel studs
    - `R6a` (`4/40`) no longer stays parked:
      - dedicated mixed lower-board schedule semantics now exist on exact visible-layer and predictor surfaces for the existing `family_a` support morphology
      - exact row `tuas_r6a_open_box_timber_measured_2026` is landed at `Ln,w 64`, `Rw 56`
      - grouped packed shorthand such as `26 mm + 60 mm` gypsum packages also resolves to that same exact row, but monolithic same-total shorthand still does not
      - lab support remains `Rw` plus `Ln,w`; `Ln,w+CI` stays unsupported
      - field continuation remains `Ln,w`, `L'n,w`, and `L'nT,w`; `L'nT,50` stays unsupported
    - `R10a` (`6/40`) no longer stays parked:
      - page `6/40` is now frozen and landed on the exact visible-layer route as:
        - lower corridor unchanged: `2 x 13 mm` gypsum board + `100 mm` mineral wool + `25 mm` `family_a` cavity
        - staged upper package: `13 mm` glass wool board + `15 mm` gypsum board + `3 mm` mortar + `15 mm` gypsum board + `3 mm` EPS underlay + `8 mm` laminate
        - source spreadsheet exact lab tuple:
          - `Ln,w 63`
          - `Ln,w+CI 64`
          - `Ln,w+CI,50-2500 66`
          - `Rw 56`
      - implementation outcome:
        - exact row `tuas_r10a_open_box_timber_measured_2026` is now landed
        - a dedicated exact `floating_screed` material/thickness schedule now exists for the source-backed split visible stack
        - lab support is now `Rw`, `Ln,w`, and `Ln,w+CI`
        - field continuation is now `Ln,w`, `L'n,w`, `L'nT,w`, and `L'nT,50`
      - narrow honesty guard remains explicit:
        - the physical split visible stack now lands exact without surfacing the old duplicate `floating_screed x3` warning
        - the over-abstracted shorthand still does not land exact:
          - `upper_fill 13 mm` + `dry_floating_gypsum_fiberboard 33 mm`
          - it still only reaches `family_archetype` at `90%` fit
        - predictor derivation still stays fail-closed on the staged mixed floating-screed package, so this slice widened the visible exact surface only
    - `R2c` (`15/40`) no longer stays parked:
      - page `15/40` is now frozen and landed on the exact visible-layer route as:
        - lower hybrid corridor unchanged: `45 mm` `family_a` cavity + `25 mm` resilient stud + `2 x 13 mm` gypsum board
        - no mineral wool
        - top package: `3 mm` EPS underlay + `8 mm` laminate
        - source spreadsheet exact lab tuple:
          - `Ln,w 70`
          - `Ln,w+CI 70`
          - `Ln,w+CI,50-2500 70`
          - `Rw 54`
      - implementation outcome:
        - exact row `tuas_r2c_open_box_timber_measured_2026` is now landed
        - lab support is now `Rw`, `Ln,w`, and `Ln,w+CI`
        - field continuation is now `Ln,w`, `L'n,w`, `L'nT,w`, and `L'nT,50`
      - narrow honesty guard remains explicit:
        - the exact route reuses the defended hybrid lower-treatment visible surface instead of inventing a generic `__none` / no-mineral-wool widening lane
        - the older separator-free proxy still stays non-exact on the broader `family_general` lane
    - the finished implementation comparison now narrows the remaining open TUAS set further:
    - TUAS open-box exact rows now number `15`
    - TUAS CLT exact rows now number `12`
    - the same-family staged upper-package debt on the defended `family_a` corridor is now closed
    - the first same-surface staged-upper CLT debt is also now closed:
      - exact row `tuas_x3_clt140_measured_2026` is landed
      - source-backed lab tuple is now live on the exact route:
        - `Ln,w 52`
        - `Ln,w+CI 52`
        - `Ln,w+CI,50-2500 60`
        - `Rw 49`
      - field continuation is now live on the standardized continuation route:
        - `L'n,w 54`
        - `L'nT,w 52`
        - `L'nT,50 60`
      - the visible exact route no longer surfaces the duplicate `floating_screed x3` blocker for the defended stack
      - predictor derivation still stays fail-closed on that staged mixed floating-screed package, so no broader predictor shortcut was invented
    - new adjacent-family drift found during close-out is now frozen explicitly:
      - the nearby bare-CLT visible fallback now admits `tuas_x4_clt140_measured_2026` as the third adjacent candidate
      - the source-truth rebaseline later shifted the defended fallback tuple again to `Ln,w 57.7` / `Rw 40.6`
      - this is accepted because the route remains an estimate lane and the change came from a new nearer source-backed exact sibling rather than a heuristic widening
    - the current separator-free hybrid open-box lower-treatment proxy still falls to `family_general` at `54%` fit with a duplicate `ceiling_cavity` blocker
    - the thicker staged-upper CLT follow-on is now also closed:
      - exact row `tuas_c3_clt260_measured_2026` is landed
      - source-backed exact lab tuple is now live on the exact route:
        - `Ln,w 47`
        - `Ln,w+CI 49`
        - `Ln,w+CI,50-2500 53`
        - `Rw 54`
      - field continuation is now live on the standardized continuation route:
        - `L'n,w 49`
        - `L'nT,w 47`
        - `L'nT,50 53`
      - the visible exact route again avoids the duplicate `floating_screed x3` blocker because the landed schedule remains the same defended `15 mm gypsum + 3 mm mortar + 15 mm gypsum` stack
      - predictor derivation still stays fail-closed on that staged mixed floating-screed package, so the slice widened only the defended visible exact surface
    - the first heavy dry-top CLT follow-on is now also closed:
      - exact row `tuas_x4_clt140_measured_2026` is landed
      - source-backed exact lab tuple is now live on the exact route:
        - `Ln,w 50`
        - `Ln,w+CI 51`
        - `Ln,w+CI,50-2500 58`
        - `Rw 55`
      - field continuation is now live on the standardized continuation route:
        - `L'n,w 52`
        - `L'nT,w 50`
        - `L'nT,50 58`
      - packed visible shorthand such as `30 mm` gypsum board still resolves to the same exact row because it preserves the defended `2 x 15 mm` same-material schedule
      - over-abstracted shorthand still does not land exact:
        - `upper_fill 50 mm generic_fill` + `dry_floating_gypsum_fiberboard 30 mm`
        - it only reaches `family_general` at `94%` fit against `tuas_x5_clt140_measured_2026`
      - predictor derivation still stays fail-closed on this visible heavy dry-top package, so the slice widened only the defended exact surface
    - the thicker same-surface heavy dry-top follow-on is now also closed:
      - exact row `tuas_c4_clt260_measured_2026` is landed
      - source-backed exact lab tuple is now live on the exact route:
        - `Ln,w 47`
        - `Ln,w+CI 49`
        - `Ln,w+CI,50-2500 53`
        - `Rw 61`
      - field continuation is now live on the standardized continuation route:
        - `L'n,w 49`
        - `L'nT,w 47`
        - `L'nT,50 53`
      - packed visible shorthand such as `30 mm` gypsum board still resolves to the same exact row because it preserves the defended `2 x 15 mm` same-material schedule
      - over-abstracted shorthand still does not land exact:
        - `upper_fill 50 mm generic_fill` + `dry_floating_gypsum_fiberboard 30 mm`
        - it only reaches `family_general` at `94%` fit against `tuas_x5_clt140_measured_2026`
      - predictor derivation still stays fail-closed on this visible heavy dry-top package, so the slice widened only the defended exact surface
    - the heavier same-surface heavy dry-top follow-on is now also closed:
      - exact row `tuas_c5_clt260_measured_2026` is landed
      - source-backed exact lab tuple is now live on the exact route:
        - `Ln,w 45`
        - `Ln,w+CI 46`
        - `Ln,w+CI,50-2500 51`
        - `Rw 61`
      - field continuation is now live on the standardized continuation route:
        - `L'n,w 47`
        - `L'nT,w 45`
        - `L'nT,50 51`
      - packed visible shorthand such as `60 mm` gypsum board still resolves to the same exact row because it preserves the defended `4 x 15 mm` same-material schedule
      - over-abstracted shorthand still does not land exact:
        - `upper_fill 50 mm generic_fill` + `dry_floating_gypsum_fiberboard 60 mm`
        - it only reaches `family_general` at `94%` fit against `tuas_x5_clt140_measured_2026`
      - predictor derivation still stays fail-closed on this visible heavy dry-top package, so the slice widened only the defended exact surface
    - a new route-honesty leak found during the `C5` close-out is now frozen explicitly:
      - under-described combined CLT direct-fixed stacks briefly tried to reuse `tuas_c5` through a profile-mismatched `family_general` lane
      - a narrow `massTimberCombinedDirectFixedTierHold` now keeps those stacks screening-only / impact-unsupported unless a real profile-aligned candidate exists
    - the heavy dry-top visible tier is now closed before the broader open-box hybrid branch reopens
    - the hybrid lower-treatment branch is no longer only a decision artifact:
      - exact row `tuas_r7b_open_box_timber_measured_2026` is now landed on the visible exact route
      - source-backed lab tuple is now live on the exact route:
        - `Ln,w 47`
        - `Ln,w+CI 47`
        - `Ln,w+CI,50-2500 48`
        - `Rw 72`
      - field continuation is now live on the standardized continuation route:
        - `L'n,w 49`
        - `L'nT,w 46.6`
        - `L'nT,50 47.6`
      - the exact route now carries the true hybrid lower-treatment `45 mm family_a + 25 mm resilient stud` underside plus the explicit `1 mm geotextile + 40 mm screed` floating-screed schedule without duplicate-role blocker warnings
      - the workbench sanity band now treats `1 mm geotextile` as an expected separator layer instead of flagging it as an out-of-band false positive
      - exact row `tuas_r8b_open_box_timber_measured_2026` is now landed with lab `Ln,w 50`, `Ln,w+CI 49`, `Ln,w+CI,50-2500 50`, `Rw 72`
      - field continuation is now `L'n,w 52`, `L'nT,w 49.6`, `L'nT,50 49.6`
      - exact row `tuas_r9b_open_box_timber_measured_2026` is now landed with lab `Ln,w 45`, `Ln,w+CI 46`, `Ln,w+CI,50-2500 48`, `Rw 68`
      - field continuation is now `L'n,w 47`, `L'nT,w 44.6`, `L'nT,50 47.6`
      - the source correction is now explicit:
        - TUAS drawing page `13/40` shows `40 mm screed + 3 mm EPS underlay + 8 mm laminate`
        - there is no extra upper `plastic-layer` or `geotextile` item on the `R9b` top package
      - the old separator-free proxy is still broader `family_general`, but its nearest candidates are now re-ranked by the landed exact sibling:
        - candidate set is now `tuas_r9b`, `tuas_r7b`, `tuas_r7a`
        - frozen estimate is now `Ln,w 48.3`, `Ln,w+CI 49.2`, and `Rw 67.3`
      - exact row `tuas_r2c_open_box_timber_measured_2026` is now also landed with lab `Ln,w 70`, `Ln,w+CI 70`, `Ln,w+CI,50-2500 70`, `Rw 54`
      - field continuation is now `L'n,w 72`, `L'nT,w 69.6`, `L'nT,50 69.6`
      - the no-fill open-box debt is therefore closed without reopening a generic `__none` topology widening lane
    - the `C7` wet geotextile CLT follow-on is now closed:
      - TUAS drawing page `24/40` is now frozen as the landed exact stack:
        - `260 mm` CLT
        - `35 mm` EPS
        - `1 mm` geotextile
        - `40 mm` screed
        - `3 mm` EPS underlay
        - `8 mm` laminate
      - exact row `tuas_c7_clt260_measured_2026` is now landed with lab `Ln,w 39`, `Ln,w+CI 40`, `Ln,w+CI,50-2500 42`, `Rw 57`
      - field continuation is now `L'n,w 41`, `L'nT,w 39`, `L'nT,50 42`
      - the old `family_general` `54%` proxy is now retired on the true source-backed stack instead of serving as the live corridor
    - `C2c`, `C3c`, `C4c`, and `C7c` are now exact anchors, while `C11c` remains later combined CLT backlog because its visible route is still screening-only / impact-unsupported today
- the real-world open-box coverage benchmark now matches the defended visible-layer truth surface:
  - generic `resilient_stud_ceiling` basic rows anchor `R2b`
  - explicit `tuas_open_box_ceiling_family_a` basic rows anchor `R2a`
  - the coverage fixture no longer aliases a generic `b` shorthand row to the `a` branch
- the first UBIQ same-family sibling import pass is now complete:
  - exact coverage now includes visible `FL-28` open-web `16 mm INEX>FLOOR` siblings at `200`, `300`, `400`
  - bound coverage now includes the visible `FL-28 (FRL/D)` open-web `400` row
  - the adjacent-family widening passes are now complete for `FL-24` and `FL-26`
  - the generic lightweight-steel `lower_only` fallback now lands on the nearer `FL-26` `2 x 16 mm` corridor when the visible ceiling package matches that profile
  - at that historical checkpoint, `FL-23`, `FL-25`, and `FL-27` were
    explicitly deferred because their timber and carpet lanes sat materially
    below the supported corridor; superseded on `2026-04-14` by exact-only
    correction import
  - the remaining later clean-up is now explicit provenance conflict, not a hidden widening backlog:
    - the May 2023 Fire/Acoustic brochure still shows the open-web FRL/D package as `FL-28 (FRL/D)`
    - the May 2023 Floor Solutions brochure shows the same `2 x 16 mm` open-web FRL/D package as `FL-26 (FRL/D)`
    - current `ubiq_fl33_*` ids therefore remain frozen as internal runtime ids, and this conflict does not by itself justify a new corridor import or runtime rename

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
    - superseded historical note: the adjacent
      `gypsum_board + rockwool + gypsum_board + open_web_steel_floor`
      helper-heavy open-web package used to stay on an `FL-24` low-confidence
      continuation; after the 2026-04-14 topology correction, it is
      impact-fail-closed and does not reopen as a defended contiguous `FL-26`
      family-general package
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

Current checkpoint before the remaining ordered list:

- `open_box_dry_package_fragmentation_trace_matrix_v1` is now closed as a
  no-widening TUAS `R5b` trace/card guard:
  - source-equivalent high fragmentation remains exact/live through engine and
    workbench card surfaces
  - disjoint upper-fill dry-package input remains on the documented
    `family_general 54%` warning lane instead of silently collapsing onto exact
    `R5b`
- `mixed_floor_wall_seeded_route_history_expansion_v1` is closed and committed
  for the first heavy-composite wall target; no solver, catalog, selector, or
  store behavior changed
- `open_box_finish_tolerance_mixed_history_boundary_v1` is now closed as a
  no-widening store-history/output-card guard:
  - source-band `10 mm` laminate split remains exact/live through duplicate,
    reorder bounce, save/load, and floor/wall mode switching
  - outside-band `12 mm` laminate split remains impact-unsupported /
    needs-input through the same history path
- `dataholz_clt_source_truth_audit_v1` is closed as a no-widening source-truth
  audit:
  - no solver, catalog, selector, or workbench runtime behavior changed
  - engine tests now pin numeric source truth, official-id field continuation,
    visible raw/tagged posture, contiguous-split stability, and disjoint-role
    fallback behavior for all imported Dataholz CLT rows
  - workbench tests now pin output-card behavior for exact dry CLT and the
    `GDMTXA04A` estimate-routed boundary
- `raw_concrete_helper_permutation_answer_guard_v1` is implemented as the latest
  no-widening answer/support guard:
  - `raw_concrete_helper_permutation_answer_guard_v1`
  - umbrella: `floor_raw_inference_source_led_widening_v1`
  - no solver, catalog, selector, or workbench runtime behavior changed
  - local code review confirms the helper signal is deliberately narrow:
    visible rows must be raw/unlabeled, inferred concrete must be terminal
    `base_structure`, the layers before it must be ceiling-side
    board/cavity/fill roles only, and at least one board plus one helper must
    be present
  - new engine tests pin numeric answers for three wider terminal-concrete
    helper permutations and adjacent top-finish / wall-like / steel-joist
    negatives
  - new workbench tests pin route/card status and values for the same
    representative corridor
  - validation:
    - engine raw/source pack: `5` files, `14` tests, green
    - workbench raw/source pack: `5` files, `7` tests, green
    - engine and web typechecks: green
  - do not use `GDMTXA04A`, weak UBIQ bands, C11c, helper-only timber rows, or
    open-web steel as shortcut reasons for broad raw inference widening
- implemented follow-on checkpoint:
  - `wall_selector_wider_trace_matrix_v1` is now implemented as a trace-only
    and no-widening wall-selector matrix
  - it measures settled families, the defended
    `double_leaf <-> lined_massive_wall` hold, non-AAC heavy-core controls, and
    a strong framed control on engine and workbench surfaces
  - no solver selection, source catalogs, CLT support, raw-floor support, wall
    selector math, or workbench runtime behavior changed
  - 2026-04-14 second-pass re-rank selected and then closed
    `mixed_floor_wall_output_card_snapshot_grid_v1`; the follow-up source
    re-rank selected `ubiq_open_web_weaker_band_posture_guard_v1`, which is now
    implemented with a narrow UBIQ weak-band false-confidence fix; the follow-up
    `ubiq_weak_band_exact_import_source_mapping_v1`,
    `ubiq_open_web_supported_band_finish_completion_v1`,
    `impact_lnw_plus_ci_bound_surface_v1`,
    `bound_metric_report_surface_completion_v1`, and
    `ubiq_lnw_plus_ci_bound_history_guard_v1` are also closed; the UBIQ
    near-miss posture follow-up and remaining source-gap posture matrix are
    closed; the raw bare open-web/open-box source-evidence re-rank, TUAS
    open-box same-package fragmentation guard, and UBIQ packaged open-web
    finish-family guard, near-miss/drop-off matrix, and history-replay matrix
    are closed; the post-UBIQ decision matrix refresh and C11c frequency/source
    recheck are closed; the Dataholz `GDMTXA04A` material-surface recheck is
    also closed; the checkpoint action is closed; the active next no-runtime
    action is closed as `post_checkpoint_next_slice_selection_v1`; the CLT
    combined anchor history guard, formula-lane selection pass,
    heavy-concrete formula history guard, formula provenance guard, and
    proposal/method/evidence provenance guard are also closed, and the next
    planning action is
    `post_method_evidence_formula_provenance_next_slice_selection_v1`

1. Keep the closed raw-floor negative audit, the closed official-product representative breadth slice, the closed UBIQ provenance/boundary-freeze slice, and the closed interpolation-steel mixed seeded-family slice frozen:
   - do not use the new `FL-23/25/27` exact-only correction rows as generic
     nearby-family anchors just because provenance is now clearer
   - do not turn the provenance freeze into an ad hoc runtime rename
   - do not treat the corrected direct-fixed CLT screening contract as a widening target
2. Freeze the now-closed wall-side trace-first slice before any new widening:
   - `wall_selector_shadow_trace_audit_v1` is now closed
   - primary route wording parity is landed:
     - `dynamic-calc-branch.ts` surfaces ambiguous/narrow boundary state and protected corridor hold on the defended wall corridor
   - secondary non-advanced posture parity is also landed:
     - shared validation posture, corridor dossier, consultant decision trail, evidence packet, and result summary no longer flatten the defended wall boundary into family-plus-confidence wording
   - the latest route-control pass stays narrow:
     - engine wall pack: `4` files, `23` tests, green
     - workbench wall honesty pack: `9` files, `49` tests, green
     - no second held family pair survives on the representative non-AAC heavy-core palette
     - no framed multi-candidate boundary surface survives yet
   - decision:
     - keep the current runner-up-aware hold limited to `double_leaf <-> lined_massive_wall`
     - do not invent a second held family until a new trace/scan/parity pack proves it
3. Freeze the now-closed UBIQ corridor decision before any new widening:
   - `ubiq_open_web_corridor_decision_v1` is now closed
   - current close-out result:
     - the current official UBIQ corridor still has no clean new package-variant import beyond the already imported `FL-24 -> FL-26 -> FL-28` rows
     - historically the weaker `FL-23/25/27` band stayed explicitly deferred;
       superseded on `2026-04-14` by exact-only correction import
     - a second official UBIQ brochure exposes the same open-web FRL/D package as `FL-26 (FRL/D)` instead of `FL-28 (FRL/D)`
     - that is now tracked as provenance conflict, not as a new widening prompt or a runtime rename prompt
   - current support nuance now locked in tests:
     - bound open-web support keeps `Rw` and conservative `Ln,w` live on lab outputs
     - field continuation keeps `Ln,w`, `L'n,w`, and `L'nT,w` conservative-upper-bound live
     - `L'nT,50` still stays unsupported on that current bound lane
4. Freeze the now-closed TUAS staged upper-package slice before reopening broader floor work:
   - closed widening slice: `tuas_r10a_staged_upper_package_surface_design_v1`
   - landed result:
     - exact row `tuas_r10a_open_box_timber_measured_2026`
     - narrow exact visible-layer `floating_screed` schedule for the source-backed `15 mm gypsum + 3 mm mortar + 15 mm gypsum` stack
     - lab support now carries `Rw`, `Ln,w`, and `Ln,w+CI`
     - field continuation now carries `Ln,w`, `L'n,w`, `L'nT,w`, and `L'nT,50`
     - the shorthand `upper_fill 13 mm` + `dry_floating_gypsum_fiberboard 33 mm` remains non-exact
     - predictor derivation remains intentionally fail-closed on that staged mixed floating-screed package
  - closed decision slice: `tuas_clt_backlog_decision_v1`
  - close-out result:
    - `X3` was the selected first staged-upper TUAS CLT import candidate
    - `C3` is now landed as the adjacent thicker same-surface follow-on
    - `X4` and `C4` are now both landed as the first upper-only heavy dry-top follow-ons
    - `C5` was still the next broader heavy dry-top backlog item at that historical checkpoint
    - current rebaseline truth supersedes that checkpoint: `C2c`, `C3c`, `C4c`, and `C7c` are exact anchors, `C5c` is predictor-backed, and only `C11c` remains combined lower-ceiling exact-import backlog
  - closed widening slice: `tuas_x3_staged_upper_clt_surface_design_v1`
  - landed result:
    - exact row `tuas_x3_clt140_measured_2026`
    - exact visible-layer `floating_screed` material/thickness schedule now carries the source-backed `15 mm gypsum + 3 mm mortar + 15 mm gypsum` stack on `140 mm` CLT
    - lab posture is explicit:
      - basis `open_measured_floor_system_exact_match`
      - supported outputs `Rw`, `Ln,w`, `Ln,w+CI`
      - unsupported output `DeltaLw`
    - field posture is explicit:
      - basis `mixed_exact_plus_estimated_standardized_field_volume_normalization`
      - supported outputs `Rw`, `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
      - unsupported outputs `none`
    - predictor derivation remains fail-closed on the staged mixed floating-screed package, so the slice widened only the defended visible exact surface
    - adjacent bare-CLT estimate drift is frozen and accepted because the new exact sibling is now part of the visible neighboring-family set
  - closed slice: `tuas_c3_staged_upper_clt_surface_design_v1`
  - landed result:
    - exact row `tuas_c3_clt260_measured_2026`
    - exact visible-layer `floating_screed` material/thickness schedule now also carries the source-backed `15 mm gypsum + 3 mm mortar + 15 mm gypsum` stack on `260 mm` CLT
    - lab posture is explicit:
      - basis `open_measured_floor_system_exact_match`
      - supported outputs `Rw`, `Ln,w`, `Ln,w+CI`
      - unsupported output `DeltaLw`
    - field posture is explicit:
      - basis `mixed_exact_plus_estimated_standardized_field_volume_normalization`
      - supported outputs `Rw`, `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
      - unsupported outputs `none`
    - predictor derivation remains fail-closed on the staged mixed floating-screed package, so the slice widened only the defended visible exact surface
    - adjacent heavy-dry estimate drift is frozen and accepted because the new exact sibling is now part of the visible neighboring-family set
  - closed slice: `tuas_x4_heavy_dry_top_clt_surface_design_v1`
  - landed result:
    - exact row `tuas_x4_clt140_measured_2026`
    - exact visible-layer `floating_screed` material/thickness schedule now carries the source-backed `50 mm glass wool + 2 x 15 mm gypsum board + 3 mm EPS + 8 mm laminate` stack on `140 mm` CLT
    - lab posture is explicit:
      - basis `open_measured_floor_system_exact_match`
      - supported outputs `Rw`, `Ln,w`, `Ln,w+CI`
      - unsupported output `DeltaLw`
    - field posture is explicit:
      - basis `mixed_exact_plus_estimated_standardized_field_volume_normalization`
      - supported outputs `Rw`, `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
      - unsupported outputs `none`
    - packed same-material shorthand such as `30 mm` gypsum board still resolves to that same exact row
    - predictor derivation remains fail-closed on the generic dry shorthand:
      - `generic_fill 50 mm` + `dry_floating_gypsum_fiberboard 30 mm`
      - still only reaches `family_general` at `94%` fit against `tuas_x5_clt140_measured_2026`
    - adjacent heavier-sibling estimate drift is frozen and accepted because the new exact sibling is now part of the visible neighboring-family set
  - closed slice: `tuas_c4_heavy_dry_top_clt_surface_design_v1`
  - landed result:
    - exact row `tuas_c4_clt260_measured_2026`
    - exact visible-layer `floating_screed` material/thickness schedule now also carries the source-backed `50 mm glass wool + 2 x 15 mm gypsum board + 3 mm EPS + 8 mm laminate` stack on `260 mm` CLT
    - lab posture is explicit:
      - basis `open_measured_floor_system_exact_match`
      - supported outputs `Rw`, `Ln,w`, `Ln,w+CI`
      - unsupported output `DeltaLw`
    - field posture is explicit:
      - basis `mixed_exact_plus_estimated_standardized_field_volume_normalization`
      - supported outputs `Rw`, `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
      - unsupported outputs `none`
    - packed same-material shorthand such as `30 mm` gypsum board still resolves to that same exact row
    - predictor derivation remains fail-closed on the generic dry shorthand:
      - `generic_fill 50 mm` + `dry_floating_gypsum_fiberboard 30 mm`
      - still only reaches `family_general` at `94%` fit against `tuas_x5_clt140_measured_2026`
    - adjacent heavier-sibling estimate drift is frozen and accepted because the new exact sibling is now part of the visible neighboring-family set
  - closed slice: `tuas_c5_heavy_dry_top_clt_surface_design_v1`
  - landed result:
    - exact row `tuas_c5_clt260_measured_2026`
    - exact visible-layer `floating_screed` material/thickness schedule now also carries the source-backed `50 mm glass wool + 4 x 15 mm gypsum board + 3 mm EPS + 8 mm laminate` stack on `260 mm` CLT
    - lab posture is explicit:
      - basis `open_measured_floor_system_exact_match`
      - supported outputs `Rw`, `Ln,w`, `Ln,w+CI`
      - unsupported output `DeltaLw`
    - field posture is explicit:
      - basis `mixed_exact_plus_estimated_standardized_field_volume_normalization`
      - supported outputs `Rw`, `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
      - unsupported outputs `none`
    - packed same-material shorthand such as `60 mm` gypsum board still resolves to that same exact row
    - predictor derivation remains fail-closed on the generic dry shorthand:
      - `generic_fill 50 mm` + `dry_floating_gypsum_fiberboard 60 mm`
      - still only reaches `family_general` at `94%` fit against `tuas_x5_clt140_measured_2026`
    - combined direct-fixed CLT under-described stacks now stay fail-closed again because a narrow `massTimberCombinedDirectFixedTierHold` blocks profile-mismatched `family_general` reuse when no profile-aligned candidate exists
  - closed slice: `tuas_r8b_hybrid_lower_finishless_follow_on_v1`
  - landed result:
    - exact row `tuas_r8b_open_box_timber_measured_2026`
    - exact visible-layer `floating_screed` material/thickness schedule now also carries the source-backed finishless sibling `35 mm EPS board + 1 mm geotextile + 40 mm screed` stack
    - the hybrid underside exact route now also carries the defended `45 mm family_a cavity + 25 mm resilient stud` lower-treatment schedule
    - lab posture is explicit:
      - basis `open_measured_floor_system_exact_match`
      - supported outputs `Rw`, `Ln,w`, `Ln,w+CI`
      - unsupported outputs `none`
    - field posture is explicit:
      - basis `mixed_exact_plus_estimated_standardized_field_volume_normalization`
      - supported outputs `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
      - unsupported outputs `none`
    - proxy and sibling posture are now frozen more honestly:
      - the old proxy without the separator layer still stays broader `family_general` at `54%` fit, but it is now re-ranked through `tuas_r9b`, `tuas_r7b`, `tuas_r7a` with `Ln,w 48.3`, `Ln,w+CI 49.2`, and `Rw 67.3`
      - the true finishless sibling `R8b` now lands exactly at `Ln,w 50` / `Rw 72`
      - the true wet-top sibling `R9b` now also lands exactly at `Ln,w 45` / `Rw 68`
      - the true no-fill sibling `R2c` now also lands exactly at `Ln,w 70` / `Rw 54`
  - historical closed slice: `tuas_clt_remaining_combined_source_schedule_research_v1`
  - current status: `closed`
  - the current implementation-backed result is now explicit:
    - the TUAS drawing corpus now freezes the remaining combined CLT visible schedules directly:
      - `C2c` on page `25/40`
      - `C3c` on page `26/40`
      - `C4c` on page `27/40`
      - `C5c` on page `28/40`
      - `C7c` on page `29/40`
      - `C11c` on page `30/40`
    - `C2c` is now landed as a true exact row:
      - exact row `tuas_c2c_clt260_measured_2026`
      - lab posture: `Ln,w 35`, `Ln,w+CI 39`, `Ln,w+CI,50-2500 44`, `Rw 70`
      - field posture: `L'n,w 37`, `L'nT,w 35`, `L'nT,50 44`
    - the remaining combined backlog is now split more honestly:
      - `C7c` is now landed exactly as `tuas_c7c_clt260_measured_2026`
        - lab: `Ln,w 30`, `Ln,w+CI 35`, `Ln,w+CI,50-2500 44`, `Rw 75`
        - field: `L'n,w 32`, `L'nT,w 30`, `L'nT,50 44`
      - `C5c` remains a predictor-backed combined corridor, not a direct source-schedule exact row; the source-truth predictor lane is now `Ln,w 38`, `Ln,w+CI 42`, `Ln,w+CI,50-2500 44`, `Rw 75`
      - `C3c` is now landed exactly as `tuas_c3c_clt260_measured_2026`
        - lab: `Ln,w 27`, `Ln,w+CI 29`, `Ln,w+CI,50-2500 43`, `Rw 73`
        - field: `L'n,w 29`, `L'nT,w 27`, `L'nT,50 43`
        - source correction: page `26/40` is `13 mm gypsum board + 2 x 15 mm gypsum board`, not a `13 mm` glass-wool upper-fill layer
      - `C4c` is now landed exactly as `tuas_c4c_clt260_measured_2026`
        - lab: `Ln,w 24`, `Ln,w+CI 26`, `Ln,w+CI,50-2500 40`, `Rw 74`
        - field: `L'n,w 26`, `L'nT,w 24`, `L'nT,50 40`
      - `C11c` remains source-backed but intentionally screening-only after the wet-stack anomaly audit
      - the old `C11c` shorthand proxy is now known to be source-inaccurate and should not be treated as the real visible schedule
    - the latest slice exposed and re-closed the next combined CLT drift before it could become silent widening:
      - combined CLT visible stacks with lower treatment plus multi-entry `floating_screed` were being packed into shorthand inference/predictor routes
      - `impact-predictor-input.ts` now keeps those stacks fail-closed for both `maybeInferFloorRoleLayerStack` and `maybeBuildImpactPredictorInputFromLayerStack`
      - `floor-system-estimate.ts` keeps the adjacent combined CLT family-estimate lane fail-closed on the same surface
    - the current fail-closed truth is therefore explicit:
      - under-described direct-fixed CLT upper-plus-lower stacks now stay screening-only even after `C4c` creates a profile-aligned combined exact row
      - source-backed `C11c` still stays screening-only with impact outputs unsupported
  - historical closed slice: `tuas_remaining_combined_clt_exact_import_decision_matrix_v1`
  - latest closed follow-up slice: `tuas_c4c_combined_heavy_dry_exact_candidate_v1`
  - historical closed slice: `tuas_c11c_wet_stack_anomaly_audit_v1`
  - current status: `closed as deferred / fail-closed`
  - the current implementation-backed reason is now explicit:
    - `C7c`, `C3c`, and `C4c` are no longer open gaps; they are exact anchors
    - `C11c` should not be imported until a source correction or frequency-level explanation resolves the weak wet-stack tuple
    - the decision depends on source/anomaly evidence and route discipline, not on missing drawings
5. After the now-closed TUAS hybrid lower-treatment, `C7`, post-`C7` boundary, `C5c` visible combined, remaining-backlog boundary, and source-schedule-research decisions, continue floor growth in this order:
   - keep the landed `C3c`, `C4c`, and `C7c` exact corridors plus the combined-CLT inference/predictor fail-closed guard frozen
   - keep `C11c` screening-only after the anomaly audit unless source correction or frequency-level evidence justifies a different posture
   - only land the next row if it stays a pure exact corridor and does not weaken the new combined-CLT guards
   - raw widening is now eligible, but only one source-backed family at a time
6. Keep the broader mixed/history grid and the now-implemented no-widening
   `mixed_floor_wall_output_card_snapshot_grid_v1` card-projection guard frozen:
   - keep the compact representative seeded-family roundtrip matrix green across:
     - heavy-concrete and open-web-bound seeded detours
     - official product-data exact seeded detours
     - official no-screed exact seeded detours
     - interpolation steel lower-bound seeded detours
     - product-backed lower-bound seeded detours
     - product-property `DeltaLw` seeded detours
     - warning-heavy and warning-light steel bound seeded detours
   - keep the existing generated `32`-case web and engine mixed grids green
   - keep the new output-card snapshot grid green for direct split detours,
     noisy edit-history replay, partial-edit restore, and save/load roundtrips
   - do not treat the card guard as behavior-widening evidence; it only freezes
     current user-facing projection behavior
   - the source-backed candidate re-rank, UBIQ weak-band posture guard, UBIQ
     weak-band exact import, UBIQ supported-band finish completion,
     `Ln,w+CI` bound-surface import, report-surface completion, UBIQ
     combined-bound history guard, and UBIQ combined-bound near-miss posture
     guard are now closed; the remaining source-gap posture matrix is also
     closed; the raw bare open-web/open-box source-evidence re-rank is closed;
     the TUAS open-box same-package fragmentation guard and UBIQ packaged
     open-web finish-family guard, near-miss/drop-off matrix, and
     history-replay matrix are closed; the post-UBIQ decision matrix refresh is
     closed; the C11c frequency/source recheck and Dataholz `GDMTXA04A`
     material-surface recheck are closed; the checkpoint action is closed; the
     `post_checkpoint_next_slice_selection_v1` planning pass and CLT combined
     anchor history guard are closed; the formula-lane selection pass,
     heavy-concrete formula history guard, formula provenance guard, and
     proposal/method/evidence provenance guard are closed; the next action is
     `post_method_evidence_formula_provenance_next_slice_selection_v1`
     before any wider runtime change

Use the source gap ledger to decide which families should be researched or widened first instead of opening new lanes ad hoc:

- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

Current wall-side guardrails after the selector-slice close-out:

- the wall selector slice is now closed at honesty hardening rather than promoted into a second widening pass
- the current defended held rows remain:
  - `ytong_aac_d700 100`
  - `ytong_aac_d700 120`
  - `ytong_g5_800 100`
- no second held family pair is currently defended on the representative non-AAC heavy-core palette
- no multi-candidate framed palette is currently defended
- the primary workbench route summary now mirrors those guardrails instead of hiding the current boundary/hold state behind anchor-only wording
- the shared wall validation/evidence wording surfaces now also mirror those guardrails instead of collapsing the same case into family-plus-confidence wording
- no remaining non-advanced user-facing wall surface is currently known to hide runner-up or hold posture outside the advanced diagnostics
- treat any candidate beyond those sets as unproven until it survives the same exact trace, scan, and workbench-parity contracts

The torture pass should include:

- deep multi-layer floor assemblies
- deep multi-layer wall assemblies
- reorder, duplicate, split, partial-edit, and reset cycles
- browser-driven manual checks on the built app in addition to regression tests

The next widening audit should answer:

- which raw or predictor source family can be widened without changing the documented raw-vs-tagged drift posture accidentally?
- does any future C11c source correction or frequency-level evidence resolve the weak wet-stack tuple enough to revisit the exact-import decision?

## Canonical Documents

- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- [../foundation/PROJECT_PLAN.md](../foundation/PROJECT_PLAN.md)
- [../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md](../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md)
