# Next Implementation Plan

Last reviewed: 2026-04-14

This is the short execution plan for the acoustic calculator. It exists because the
long-form calculator docs contain useful history, but the current next step must be
unambiguous.

Read together with:

- [CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md)
  for the latest committed checkpoint, accepted commit, validation snapshot,
  and next-agent cautions
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
  when the question is whether a shown answer is source-backed, formula-backed,
  predictor-backed, bound-only, or unsupported
- [CURRENT_STATE.md](./CURRENT_STATE.md) for the latest verified posture
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) before widening any floor
  family lane

## 2026-04-14 Post-Checkpoint Planning Iteration

Checkpoint commit:

- `1be632d test(calculator): lock UBIQ packaged floor source and history surfaces`

Working tree posture at this review:

- clean at review start
- no runtime source widening is selected from the checkpoint alone
- the immediate risk is stale planning/executable-contract drift, not a known
  solver regression

Source review performed for this planning pass:

- UBIQ official INEX floor table:
  <https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf>
  - open-web rows remain explicit INEX deck / finish / resilient-ceiling system
    table rows
  - carpet rows publish `Ln,w+CI 45 or less`, so the current bound-only
    treatment remains correct
  - this is still not bare open-web carrier impact evidence
- Dataholz `GDMTXA04A` sheet:
  <https://www.dataholz.eu/en/index/download/en/gdmtxa04a-0.pdf>
  - source still exposes `Ln,w (CI) 49(4)` and `CI50-2500 9 dB`
- Dataholz `GDMTXA04A` component page:
  <https://www.dataholz.eu/bauteile/geschossdecke/detail/kz/gdmtxa04a.htm>
  - the English PDF/component surface keeps the top `65.0 mm` layer at
    mass-level wording, while the German component page identifies it as a
    composite dry screed element: `2x12.5 mm` gypsum fibre board with `40 mm`
    mineral wool
  - the local single `dry_floating_gypsum_fiberboard` convenience surface is
    therefore not a faithful visible exact-match material model for that
    composite top layer
- TUAS/Mendeley measured floor dataset:
  <https://data.mendeley.com/datasets/y83p8mpryd/2>
  - current imported TUAS open-box rows remain measured packaged systems
  - no new bare open-box/open-web carrier impact lane is justified by this
    planning pass

Implementation comparison after the checkpoint:

- catalog posture remains:
  - exact floor systems: `173`
  - bound floor systems: `23`
    - `5` legacy `Ln,w` upper-bound rows
    - `18` UBIQ supported-band carpet `Ln,w+CI` upper-bound rows
  - official impact product rows: `10`
  - TUAS open-box exact rows: `15`
  - TUAS CLT / TUAS concrete exact rows under `tuas_[cxh]`: `16`
  - Dataholz CLT exact rows: `9`
  - UBIQ open-web exact rows for `FL-23/24/25/26/27/28`: `90`
  - UBIQ weak-band exact rows for `FL-23/25/27`: `54`
  - UBIQ supported resilient-band exact rows for `FL-24/26/28`: `36`
  - UBIQ supported-band carpet + foam-underlay official bound rows: `18`
- the UBIQ weak-band source-gap item is closed as exact-only import plus
  no-family-estimate posture, not a still-active next step
- UBIQ packaged open-web exact/bound/near-miss/history replay surfaces are now
  guarded across engine and workbench
- `C11c`, `GDMTXA04A`, raw bare open-box/open-web impact, helper-only timber,
  and helper-only open-web remain deliberately guarded or fail-closed
- wall boundary holding remains limited to the defended
  `double_leaf <-> lined_massive_wall` pair inside `2 visible leaves / 1 cavity`
- unsupported outputs are still gated before workbench cards show values

Current decision:

1. Do not start broad raw-floor, CLT, wall-selector, Dataholz, or UBIQ runtime
   widening from the checkpoint.
2. The planning-contract drift is closed in this pass: the executable
   source-gap contract no longer points to the completed UBIQ weak-band path.
3. The TUAS `C11c` source/frequency recheck is closed as no-runtime:
   the weak tuple is not explained by `CI` or `CI,50-2500`, so exact import
   remains blocked.
4. The Dataholz `GDMTXA04A` material-surface recheck is closed as no-runtime:
   the source top layer is a composite dry screed surface that the current local
   single-material convenience surface cannot represent honestly.
5. The checkpoint validation and commit-preparation action is now closed; the
   next action is a fresh no-runtime slice-selection pass, not an exact reopen
   and not raw-floor/runtime widening.

Closed during this planning pass:

- slice id: `post_ubiq_source_gap_decision_matrix_v1`
- type: no-runtime executable planning-contract refresh
- status: implemented and target-green on 2026-04-14
- objective:
  - update the source-gap re-rank contract so it no longer selects the already
    completed UBIQ weak-band exact-import path as the active next step
  - keep all remaining source-gap candidates explicitly non-widening until a
    stronger source or frequency-level explanation exists
  - preserve the current checkpoint as the baseline before the next actual
    behavior slice is selected
- required artifacts:
  - `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - this plan document
  - `CURRENT_STATE.md`, `README.md`, and `SOURCE_GAP_LEDGER.md` wording that
    identifies the checkpoint as committed rather than commit-prep work
- acceptance:
  - the planning-contract refresh is recorded as:
    `post_ubiq_source_gap_decision_matrix_v1`
  - after the follow-up C11c and Dataholz no-runtime rechecks, no source-gap
    candidate is selected for runtime widening
  - closed checkpoint action is:
    `checkpoint_validation_and_commit_v1`
  - selected next planning action is:
    `post_checkpoint_next_slice_selection_v1`
  - `runtimeBehaviorChange` is `false`
  - UBIQ weak-band rows stay imported as exact-only with
    `familyEstimateEligible: false`
  - non-selected candidates remain deferred:
    `C11c`, `GDMTXA04A`, raw bare open-box/open-web impact, helper-only timber,
    and helper-only open-web
  - targeted engine/web source-gap packs stay green
  - no production runtime file changes are needed

Closed during this implementation pass:

- slice id: `tuas_c11c_frequency_source_recheck_v1`
- type: no-runtime source/frequency audit before exact import
- status: implemented and target-green on 2026-04-14
- why this is first:
  - it is one known deferred source row, so the blast radius is smaller than
    raw bare open-box/open-web impact widening
  - visible schedule evidence is already known, but the weak impact tuple is
    not explained well enough to expose exact impact outputs
  - resolving this either produces a narrowly justified exact-import plan or
    locks the row as intentionally deferred with stronger evidence
- non-goals:
  - no import of `tuas_c11c_clt260_measured_2026` until the source/frequency
    audit explains the anomaly
  - no Dataholz `GDMTXA04A` exact reopen
  - no raw bare open-box/open-web impact support
  - no UBIQ raw open-web widening
- required first checks:
  - compare `C11c` source tuple against landed `C2c/C3c/C4c/C7c` combined CLT
    anchors on value, basis, support bucket, and visible source schedule
  - inspect any available TUAS frequency/source data before deciding whether the
    weak tuple is an importable measured truth or a deferred anomaly
  - keep workbench card posture at fail-closed unless the engine exact import is
    source-explained
- initial starting validation before adding the recheck guard:
  - engine C11c/source-gap pack: `4` files / `16` tests green
  - workbench remaining-source-gap card pack: `1` file / `6` tests green
- result:
  - source frame remains narrow: TUAS says floors were not tested bare, measured
    frequency range is `20..5000 Hz`, and `20..40 Hz` is outside the ISO
    supported range
  - `C11c` has `Ln,w 59`, `Ln,w+CI 60`, and `Ln,w+CI,50-2500 60`, so `CI` and
    `CI,50-2500` are both only `+1 dB`
  - landed combined CLT anchors have much stronger weighted impact values and
    larger low-frequency companion terms; therefore the C11c issue is the
    weighted impact tuple itself, not a low-frequency companion explanation
  - `C11c` remains fail-closed until a raw one-third-octave spectrum or source
    correction/lab note explains the weak tuple
- final validation:
  - engine C11c/source-gap pack with the new recheck guard:
    `4` files / `14` tests green
  - workbench remaining-source-gap card pack: `1` file / `6` tests green
  - engine typecheck and lint green
  - `git diff --check` green

Closed during this implementation pass:

- slice id: `dataholz_gdmtxa04a_material_surface_recheck_v1`
- type: no-runtime source/material-surface audit before exact reopen
- status: implemented; target validation belongs to the checkpoint close-out
- why this followed C11c:
  - it is a single imported Dataholz CLT row with exact source numbers but
    `manualMatch: false`
  - current blocker is visible material-surface ambiguity, not missing acoustic
    numbers
  - blast radius is smaller than raw bare open-box/open-web impact widening
- non-goals:
  - no exact visible reopen unless the official source exposes an honest
    material surface for the `65 mm` top layer
  - no generic dry floating gypsum-fiberboard shortcut
  - no change to `GDMTXA04A` estimate-only workbench posture unless the engine
    route becomes source-explained
- required first checks:
  - compare the Dataholz PDF and component page wording for the `65 mm` top
    layer against the local `dry_floating_gypsum_fiberboard` convenience fixture
  - keep source `Ln,w`, `CI`, and `CI,50-2500` truth separate from visible-route
    eligibility
  - verify `dataholz_gdmtxa04a_clt_lab_2026` stays `manualMatch: false` and
    estimate-routed unless source material evidence changes
- result:
  - English Dataholz source surfaces do not expose a generic visible material
    model for the `65 mm` top layer
  - German Dataholz source text identifies a composite dry screed element:
    `2x12.5 mm` gypsum fibre board with a `40 mm` mineral-wool core
  - the current local single material id, `dry_floating_gypsum_fiberboard`, is
    kept as direct-official-id convenience only and is not promoted to manual
    visible exact matching
  - direct official-id resolution still returns the source truth:
    `Rw 70`, `Ctr -19`, `Ln,w 49`, `CI 4`, `CI,50-2500 9`, `Ln,w+CI 53`
  - visible `GDMTXA04A`-shaped layer entry stays on the defended dry-CLT
    estimate route: candidate `dataholz_gdmtxa01a_clt_lab_2026`, `Rw 65`,
    `Ln,w 47`, `CI 2`, `Ln,w+CI 49`
- starting validation before adding the new recheck guard:
  - engine Dataholz/source-gap pack: `3` files / `14` tests green
  - workbench remaining-source-gap card pack: `1` file / `6` tests green
- checkpoint validation completed in this implementation pass:
  - updated engine source-gap/Dataholz/C11c pack including
    `src/dataholz-gdmtxa04a-material-surface-recheck.test.ts`: `6` files /
    `23` tests green
  - workbench remaining-source-gap + Dataholz source-truth card pack: `2` files
    / `8` tests green
  - full engine suite: `117` files / `837` tests green
  - full web suite: `110` files / `633` tests green
  - engine typecheck and lint green
  - web typecheck and lint green; the existing Next.js TypeScript plugin
    recommendation remains informational
  - `pnpm build` green with the known optional `sharp/@img` warnings and the
    existing Next.js TypeScript plugin recommendation
  - `git diff --check` green

Closed checkpoint action:

- slice id: `checkpoint_validation_and_commit_v1`
- type: no-runtime validation / docs close-out
- status: implemented and target-green on 2026-04-14
- why this followed the source rechecks:
  - the two remaining source-specific post-checkpoint questions, `C11c` and
    `GDMTXA04A`, are now both closed without runtime widening
  - source evidence still does not justify raw bare open-box/open-web impact
    support, a `GDMTXA04A` exact visible reopen, or a `C11c` exact import
  - the honest move was to prove the checkpoint, update docs, and then commit
    the guard/docs state
- non-goals:
  - no solver/catalog/workbench runtime change
  - no new exact/bound row import
  - no broad predictor/family fallback widening
- acceptance:
  - targeted engine source-gap pack green
  - targeted web remaining-source-gap card pack green
  - full engine and full web suites green
  - engine typecheck and lint green
  - web typecheck and lint green
  - `pnpm build` green
  - `git diff --check` green
  - docs identify no source-gap candidate as runtime-widening eligible

Selected next planning action:

- slice id: `post_checkpoint_next_slice_selection_v1`
- type: no-runtime planning / source-gap rebaseline
- purpose:
  - choose exactly one next behavior or research slice from the current guarded
    state
  - keep `C11c`, `GDMTXA04A`, and raw bare open-box/open-web impact closed
    unless stronger source/material/frequency evidence appears
  - if a runtime widening is selected, name one route family and one output
    surface before code changes

## 2026-04-14 Validated Restart Plan

The existing plans are not finished. The implementation is at a clean,
validated checkpoint, but the remaining phase still needs more evidence before
any broad wall-selector, raw-floor, CLT, UBIQ, or open-box behavior widening.

Current implementation comparison after
`ubiq_open_web_packaged_finish_history_replay_matrix_v1` and checkpoint commit
`1be632d`:

- working tree was clean at the start of the post-checkpoint planning review
- catalog posture verified from `@dynecho/catalogs` after implementation:
  - exact floor systems: `173`
  - bound floor systems: `23`
    - `5` legacy `Ln,w` upper-bound rows
    - `18` UBIQ supported-band carpet `Ln,w+CI` upper-bound rows
  - official impact product rows: `10`
  - TUAS open-box exact rows: `15`
  - TUAS CLT / TUAS concrete exact rows under `tuas_[cxh]`: `16`
  - Dataholz CLT exact rows: `9`
  - UBIQ open-web exact rows for `FL-23/24/25/26/27/28`: `90`
  - UBIQ weak-band exact rows for `FL-23/25/27`: `54`
  - UBIQ supported resilient-band exact rows for `FL-24/26/28`: `36`
    - bare INEX exact rows: `18`
    - timber + acoustic underlay exact rows: `18`
  - UBIQ supported resilient-band carpet + foam underlay rows for
    `FL-24/26/28`: `18` official bound rows
    - imported as `LnWPlusCIUpperBound: 45`
    - not imported as exact `Ln,w`
    - not allowed to imply exact `CI`, `Ln,w`, `L'n,w`, `L'nT,w`, or
      `L'nT,50`
  - `C11c`: not imported
  - UBIQ `FL-23`, `FL-25`, and `FL-27`: imported as exact-only correction
    rows with `familyEstimateEligible: false`, so they can match exact user
    stacks but cannot become nearby-family estimate anchors
  - UBIQ `FL-24`: corrected from the old direct-ceiling criteria to the
    resilient lower-treatment topology (`ubiq_resilient_ceiling` + `rockwool` +
    `2 x 13 mm` boards); direct `2 x 13 mm` stacks now correctly land on
    `FL-23`
  - UBIQ `FL-24`: remains exact-only with `familyEstimateEligible: false`
  - UBIQ `FL-26/28`: timber supported-band rows remain the current defended
    family-estimate anchors; newly imported bare rows are exact-only and cannot
    widen raw/lower-only helper estimates
  - UBIQ supported-band carpet stacks now receive official
    `Ln,w+CI <= 45 dB` bound support where the exact source topology is visible
  - those same carpet stacks still keep `Ln,w`, `CI`, and field continuations
    unsupported unless another source/formula lane owns them
  - UBIQ carpet combined-bound history is now guarded:
    - source-equivalent split/reordered stacks, including a `49`-layer engine
      split, stay on the same official `Ln,w+CI <=45` bound
    - malformed near-misses stay off official bound provenance
    - workbench duplicate/split/reorder/save-load and floor/wall detours keep
      card status/value support stable
  - UBIQ carpet combined-bound near-miss posture is now guarded:
    - malformed open-web + carpet/foam combined-bound stacks fail closed for
      exact and field impact outputs once official bound matching falls off
    - derived predictor fallback cannot borrow nearby bare/timber
      `FL-24/26/28` rows to fabricate `Ln,w`, `CI`, `Ln,w+CI`, `L'n,w`,
      `L'nT,w`, or `L'nT,50`
    - assembly keeps only screening/live `Rw`; impact-only keeps all requested
      outputs unsupported for those malformed stacks
- code boundaries still match the living docs:
  - wall boundary holding is still limited to the defended
    `double_leaf <-> lined_massive_wall` pair inside `2 visible leaves / 1 cavity`
  - unsupported outputs are still gated before workbench cards show values
  - raw terminal-concrete helper support is still narrow and does not open
    helper-only timber, open-web steel, or generic raw-floor support
- current broad validation baseline after the UBIQ exact, combined-bound,
  report-surface, history-guard, near-miss, source-gap, packaged-route, and
  history-replay slices:
  - catalog, engine, and web typecheck green
  - catalog, engine, and web lint green
  - targeted engine regression pack after the `Ln,w+CI` bound conversion:
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
  - full engine suite: `115` files / `830` tests green
  - full web suite: `110` files / `633` tests green
  - `pnpm build` green with known `sharp/@img` optional-package warnings and
    the existing Next.js TypeScript plugin recommendation
  - `git diff --check` green

Closed implementation slice:

- slice id: `ubiq_lnw_plus_ci_near_miss_estimate_posture_decision_v1`
- type: no-widening UBIQ combined-bound near-miss fail-closed posture
- status: implemented and target-green on 2026-04-14
- implemented artifacts:
  - [bound-only-floor-near-miss.ts](../../packages/engine/src/bound-only-floor-near-miss.ts)
  - [ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts](../../packages/engine/src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts)
  - [ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts](../../apps/web/features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts)
- goal:
  - decide and pin what happens after malformed UBIQ carpet combined-bound
    stacks lose official `Ln,w+CI <=45` provenance
  - keep metric-specific bound reporting honest by refusing to synthesize exact
    `Ln,w`, `CI`, `Ln,w+CI`, or field continuations from nearby rows
- implemented result:
  - malformed disjoint-carpet, extra-board, missing-fill, missing-INEX, and
    wrong-depth near-misses fail closed for impact outputs
  - `packages/engine/src/floor-system-estimate.ts` now blocks the broader
    lightweight-steel estimate for this bound-only combined profile
  - `calculateAssembly` and `calculateImpactOnly` now reject the derived
    predictor fallback for the same visible/source profile
  - canonical and source-equivalent UBIQ carpet stacks still land on the
    official bound through the earlier history guard
- validation:
  - targeted engine near-miss/bound pack:
    `3` files / `7` tests green
  - targeted workbench near-miss/history/report pack:
    `3` files / `5` tests green

Closed implementation slice:

- slice id: `remaining_source_gap_posture_matrix_v1`
- type: no-widening source-gap route/card posture matrix
- status: implemented and target-green on 2026-04-14
- artifacts:
  - [remaining-source-gap-posture-matrix.test.ts](../../packages/engine/src/remaining-source-gap-posture-matrix.test.ts)
  - [remaining-source-gap-posture-card-matrix.test.ts](../../apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts)
- result:
  - `C11c` remains deferred / impact-fail-closed
  - `GDMTXA04A` remains estimate-only on the defended Dataholz dry-CLT estimate
    lane
  - raw bare open-box/open-web impact and helper-only timber/open-web negatives
    remain deferred
  - targeted engine and workbench matrices are green at `1` file / `6` tests
    each

Closed implementation slice:

- slice id: `raw_bare_open_web_open_box_source_evidence_re_rank_v1`
- type: source-evidence re-rank before any raw bare floor impact widening
- status: implemented as a no-runtime source contract on 2026-04-14
- artifact:
  - [raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts](../../packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts)
- source findings:
  - TUAS/Mendeley explicitly says the load-bearing slabs were not tested bare;
    tested floors included at least a covering and usually floating floor,
    suspended ceiling, or both
  - UBIQ open-web evidence is INEX deck / floor-finish / resilient-ceiling
    system-table evidence, not raw open-web carrier impact evidence
- result:
  - raw bare open-box impact remains fail-closed
  - raw bare open-web impact remains fail-closed
  - no runtime behavior changed in this slice
- validation:
  - targeted engine source-evidence contract: `1` file / `3` tests green
  - full engine suite after the assertion correction: `112` files / `824`
    tests green
  - engine typecheck, engine lint, and `git diff --check` green

Closed implementation slice:

- slice id: `tuas_open_box_same_package_fragmentation_design_v1`
- type: source-backed packaged open-box design/guard slice
- status: implemented as a no-runtime exact-route/card guard on 2026-04-14
- artifacts:
  - [tuas-open-box-same-package-fragmentation-design.test.ts](../../packages/engine/src/tuas-open-box-same-package-fragmentation-design.test.ts)
  - [tuas-open-box-same-package-fragmentation-card-design.test.ts](../../apps/web/features/workbench/tuas-open-box-same-package-fragmentation-card-design.test.ts)
- result:
  - all `15` imported TUAS open-box exact rows now have a generated
    source-equivalent fragmentation guard
  - canonical and contiguous-fragmented same-package stacks keep the same exact
    source id, impact basis, `Rw`, `Ln,w`, `Ln,w+CI`, field continuations, target
    support buckets, and workbench card statuses/values
  - no runtime behavior changed; this confirms existing exact matching is safe
    for same-package fragmentation and does not reopen raw/lower-only/upper-only
    open-box impact lanes
- validation:
  - targeted engine same-package guard: `1` file / `2` tests green
  - targeted workbench same-package card guard: `1` file / `2` tests green
  - final broad validation: engine/web typecheck and lint green; full engine
    `113` files / `826` tests green; full web `107` files / `629` tests
    green; `pnpm build` green with the known `sharp/@img` optional-package
    warnings and the existing Next.js TypeScript plugin recommendation;
    `git diff --check` green

Closed implementation slice:

- slice id: `ubiq_open_web_packaged_finish_family_design_v1`
- type: source-backed packaged UBIQ open-web exact/bound route-card guard
- status: implemented as a no-runtime generated guard on 2026-04-14
- artifacts:
  - [ubiq-open-web-packaged-finish-family-design.test.ts](../../packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts)
  - [ubiq-open-web-packaged-finish-family-card-design.test.ts](../../apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts)
- result:
  - all `90` imported UBIQ open-web exact rows and all `21` UBIQ open-web bound
    rows now have generated source-equivalent fragmentation coverage
  - canonical and contiguous-fragmented stacks keep the same exact/bound source
    id, metric basis, `Rw`, `Ln,w`, `Ln,w+CI`, `Ln,w+CI <=45` bound, field
    continuations where supported, target-output buckets, and workbench card
    statuses/values
  - weak-band carpet exact rows (`FL-23/25/27`, `18` rows) remain exact-only,
    while supported-band carpet rows (`FL-24/26/28`, `18` rows) remain
    `Ln,w+CI` bound-only; no raw bare open-web or broad weak-band family fallback
    was opened
- validation:
  - targeted engine finish-family guard: `1` file / `3` tests green
  - targeted workbench finish-family card guard: `1` file / `2` tests green
  - final broad validation: engine/web typecheck and lint green; full engine
    `114` files / `829` tests green; full web `108` files / `631` tests green;
    `pnpm build` green with the known `sharp/@img` optional-package warnings and
    the existing Next.js TypeScript plugin recommendation; `git diff --check`
    green

Closed implementation slice:

- slice id: `ubiq_open_web_packaged_finish_near_miss_matrix_v1`
- type: no-widening UBIQ packaged open-web near-miss/drop-off route-card matrix
- status: implemented as generated guard coverage on 2026-04-14
- artifacts:
  - [ubiq-open-web-packaged-finish-near-miss-matrix.test.ts](../../packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts)
  - [ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts](../../apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts)
- result:
  - representative weak-band exact-only, supported-band exact, and supported-band
    `Ln,w+CI <=45` bound packages now pin drop-off behavior for source-critical
    deck, board, and fill drift
  - source-critical mismatches do not retain official exact/bound provenance:
    weak direct packages fail closed for impact; supported exact timber packages
    drop to the current `family_archetype` estimate lane; supported bound carpet
    packages fail closed for impact
  - valid finish switches are explicitly separated from near-misses: weak carpet
    can switch to weak timber exact, supported timber can switch to supported
    carpet bound, and supported carpet bound can switch to supported timber exact
- validation:
  - targeted engine near-miss matrix: `1` file / `1` test green
  - targeted workbench near-miss card matrix: `1` file / `1` test green
  - final broad validation: engine/web typecheck and lint green; full engine
    `115` files / `830` tests green; full web `109` files / `632` tests green;
    `pnpm build` green with the known `sharp/@img` optional-package warnings and
    the existing Next.js TypeScript plugin recommendation

Closed implementation slice:

- slice id: `ubiq_open_web_packaged_finish_history_replay_matrix_v1`
- type: no-widening UBIQ packaged open-web workbench history-replay guard
- status: implemented as a no-runtime workbench store/history replay guard on
  2026-04-14
- artifact:
  - [ubiq-open-web-packaged-finish-history-replay-matrix.test.ts](../../apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts)
- result:
  - weak carpet exact `FL-27`, supported carpet `Ln,w+CI <=45` bound `FL-28`,
    supported carpet extra-board near-miss, supported carpet-to-timber valid
    finish switch, and supported timber wrong-deck fallback now replay through
    duplicate/split/reorder/save-load and floor/wall mode detours
  - source-equivalent histories keep the same exact/bound ids, basis/source
    lanes, support buckets, and output-card statuses/values
  - source-critical near-misses remain off official exact/bound provenance after
    history replay
  - valid finish switches remain controlled official route switches instead of
    accidental fallback or raw open-web widening
- validation:
  - targeted history replay guard: `1` file / `1` test green
  - adjacent UBIQ web history/near-miss pack: `3` files / `4` tests green
  - engine/web typecheck and lint green
  - full engine suite: `115` files / `830` tests green
  - full web suite: `110` files / `633` tests green
  - `pnpm build` green with the known `sharp/@img` optional-package warnings
    and the existing Next.js TypeScript plugin recommendation
  - `git diff --check` green

Selected post-checkpoint planning slice:

- slice id: `post_ubiq_source_gap_re_rank_v1`
- type: no-runtime source-led re-rank before any behavior widening
- status: converted into an executable decision contract during this planning
  pass
- objective:
  - re-rank raw-floor, CLT-local, wall-selector, Dataholz, and remaining UBIQ
    candidates after the packaged UBIQ exact/bound/near-miss/history surfaces are
    now frozen
  - name exactly one next implementation slice with value/origin/basis/support
    and workbench/report test requirements before any runtime widening
- acceptance:
  - raw bare open-web/open-box impact, `C11c`, and `GDMTXA04A` remain deferred
    unless stronger source/frequency evidence is found
  - if runtime widening becomes eligible, it is scoped to one route family and
    one output surface first
  - docs and executable contracts clearly explain why the next slice is selected

Completed first task from this planning slice:

- slice id: `post_ubiq_source_gap_decision_matrix_v1`
- status: implemented and target-green on 2026-04-14
- why:
  - the previous executable re-rank contract still named the UBIQ weak-band
    posture/import path as the selected next work even though that path is now
    closed
  - leaving that stale selector in place would mislead the next agent into
    redoing completed UBIQ work instead of ranking the remaining source gaps
- expected result:
  - no production runtime changes
  - after the C11c and Dataholz follow-up rechecks, no current source-gap
    candidate is runtime-widening eligible
  - the checkpoint action is closed:
    `checkpoint_validation_and_commit_v1`
  - the current selected next planning action is:
    `post_checkpoint_next_slice_selection_v1`
  - all remaining risky behavior candidates stay non-widening until another
    source-backed matrix proves otherwise

Second-pass correction from implementation review:

- `mixed_floor_wall_seeded_long_chain_family_grid_v1` is no longer the selected
  next slice because the implementation already has the broad generated family
  grid and long-chain route-history coverage that the first 2026-04-14 pass
  planned:
  - `apps/web/features/workbench/mixed-study-mode-generated-test-helpers.ts`
    contains `32` generated route cases across floor and wall families
  - `packages/engine/src/mixed-floor-wall-generated-test-helpers.ts` contains
    the matching `32` engine cases
  - targeted web mixed pack was re-run on 2026-04-14:
    `3` files / `5` tests green
  - targeted engine mixed pack was re-run on 2026-04-14:
    `2` files / `2` tests green
- no internet research was needed for that selected slice because it did not
  change source truth, import new rows, or alter acoustic formulas; it only
  hardens internal route/card projection.

Closed implementation slice:

- slice id: `mixed_floor_wall_output_card_snapshot_grid_v1`
- type: no-widening mixed route-history output-card projection guard
- status: implemented and target-green on 2026-04-14
- implemented artifact:
  - [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
- goal:
  - explicitly pin workbench `buildOutputCard` status/value snapshots across the
    existing broad generated mixed floor/wall grid
  - close the remaining projection blind spot between "engine/result snapshot is
    stable" and "user-facing cards still show the same status/value after replay"
  - keep all solver, catalog, selector, support, and workbench runtime behavior
    unchanged unless the new matrix exposes a classified red
- why it was selected:
  - current mixed tests already compare final rows, result snapshots, support
    buckets, and basic card sanity
  - they do not yet compare full output-card status/value snapshots for the broad
    generated grid after duplicate/swap, partial-edit, cross-mode, and save/load
    replay
  - this is the smallest non-regressive guard before selecting any behavior or
    source-widening slice
  - it avoids starting MorphologyV2, C11c, GDMTXA04A, UBIQ weak-band, or broad
    raw-floor work without fresh evidence

Implemented scope for `mixed_floor_wall_output_card_snapshot_grid_v1`:

1. Started with tests only and did not change runtime behavior while building
   the matrix.
2. Reused the current generated mixed-route helpers:
   - `apps/web/features/workbench/mixed-study-mode-generated-test-helpers.ts`
   - `apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts`
3. Added a focused output-card snapshot helper local to the new test.
4. Captured, per requested output:
   - card status
   - display value
   - supported / unsupported bucket membership
   - result match id / bound id / estimate kind where already present in the
     existing scenario snapshot
5. Compared direct-final card snapshots with replayed snapshots for:
   - one direct generated split-detour path
   - one duplicate/swap/remove/rebuild path
   - one partial-edit abort plus opposite-mode restore path
   - one save/load roundtrip after an opposite-mode detour
6. Kept the full `32`-case generated route set.
7. Required sentinel cases inside the grid:
   - TUAS `C11c` remains fail-closed / deferred
   - Dataholz `GDMTXA04A` remains estimate-only
   - UBIQ open-web exact/bound corridors keep their current live/bound posture
   - held AAC wall boundary keeps its user-facing card values stable
   - raw bare open-box and raw bare open-web impact support remain closed where
     they are represented by the current generated cases
8. Acceptance:
   - direct and replayed card snapshots match exactly for the chosen paths
   - no unsupported output becomes live through history replay
   - no exact/bound/product route silently downgrades on cards because of
     duplicate/swap, partial-edit abort, save/load, or study-mode detours
   - any red is classified before code changes as stale fixture,
     store-history replay drift, card projection drift, support-bucket drift,
     trace-field drift, or solver behavior drift
9. Validation for the slice:
   - focused card-snapshot grid:
     `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts --reporter=basic`:
     `1` file / `2` tests green
   - adjacent web mixed pack including the new guard:
     `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts --reporter=basic`:
     `4` files / `7` tests green
   - adjacent engine mixed pack:
     `pnpm --filter @dynecho/engine exec vitest run src/mixed-floor-wall-generated-matrix.test.ts src/mixed-floor-wall-complex-stack.test.ts --reporter=basic`:
     `2` files / `2` tests green
   - `pnpm --filter @dynecho/web typecheck`: green with the known Next.js
     TypeScript plugin recommendation
   - `pnpm --filter @dynecho/engine typecheck`: green
   - focused new-file lint:
     `pnpm --filter @dynecho/web exec eslint features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`:
     green
   - full web lint was rerun after cleaning the small existing lint debt in
     `mixed-study-mode-generated-history-grid.test.ts`,
     `mixed-study-mode-torture.test.ts`, and `normalize-rows.ts`: green

Closed source re-rank slice:

- slice id: `source_gap_candidate_research_re_rank_v1`
- type: source-backed candidate selection and guard design; no runtime behavior
  change
- status: implemented and target-green on 2026-04-14
- implemented artifact:
  - [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts)
- source checks used:
  - Dataholz official `GDMTXA04A` component page:
    <https://www.dataholz.eu/en/components/intermediate-floor/detail/kz/gdmtxa04a.htm>
  - UBIQ official fire/acoustic floor table PDF:
    <https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf>
  - TUAS/Mendeley measured floor dataset:
    <https://data.mendeley.com/datasets/y83p8mpryd/2>
  - TUAS dataset article / PubMed record:
    <https://pubmed.ncbi.nlm.nih.gov/37492232/>
- re-rank result:
  - Dataholz `GDMTXA04A`: keep deferred from visible exact reopening because the
    official source still describes the `65 mm` top dry-floor layer by mass
    only; local `dry_floating_gypsum_fiberboard` remains a convenience
    representation, not an honest generic visible surface
  - TUAS `C11c`: keep deferred because the primary dataset remains credible but
    the weak wet-stack tuple is still not frequency/source-explained beside the
    landed combined CLT anchors
  - raw bare open-box / open-web impact: keep deferred because the TUAS dataset
    explicitly describes measured floors with coverings/ceilings rather than
    bare slabs, and UBIQ open-web evidence is packaged-system evidence, not a
    bare-carrier lane
  - UBIQ `FL-23`, `FL-25`, `FL-27`: selected for the next no-runtime posture
    guard because the official table gives explicit values, but they sit in a
    materially weaker band than the current defended `FL-24 -> FL-26 -> FL-28`
    corridor
- validation:
  - focused source re-rank contract:
    `pnpm --filter @dynecho/engine exec vitest run src/source-gap-candidate-re-rank-contract.test.ts --reporter=basic`:
    `1` file / `3` tests green

Closed selected implementation slice:

- slice id: `ubiq_open_web_weaker_band_posture_guard_v1`
- type: source-backed UBIQ weak-band posture guard with a narrow runtime
  false-confidence fix
- status: implemented and target-green on 2026-04-14
- implemented artifacts:
  - [ubiq-open-web-weaker-band-posture-guard.test.ts](../../packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts)
  - [ubiq-open-web-weaker-band-card-posture.test.ts](../../apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts)
- goal:
  - pin the official `FL-23`, `FL-25`, and `FL-27` source values and current
    no-borrow posture before any exact/bound/runtime widening
  - make the decision explicit on engine trace and workbench card surfaces:
    keep deferred, import exact rows, or add a separate low-confidence/bound
    posture only if the guard evidence justifies it
- implemented result:
  - official `FL-23`, `FL-25`, and `FL-27` weak-band values are now pinned as
    source fixtures
  - at this guard checkpoint, `ubiq_fl23_*`, `ubiq_fl25_*`, and `ubiq_fl27_*`
    remained absent from exact and bound catalogs; this was superseded by the
    later closed `ubiq_weak_band_exact_import_source_mapping_v1` exact-only
    import
  - representative open-web upper-only weak-band visible packages no longer
    borrow `FL-24/26/28` lower-treatment impact ratings through the generic
    lightweight-steel family estimate
  - at that guard checkpoint, workbench impact cards for those packages stayed
    unsupported / needs-input until an exact or bound weak-band import was
    deliberately added
  - no catalog rows were imported in this guard slice and no supported
    `FL-24 -> FL-26 -> FL-28` corridor was changed
- validation:
  - focused engine posture guard:
    `pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-weaker-band-posture-guard.test.ts --reporter=basic`:
    `1` file / `3` tests green
  - focused workbench card posture guard:
    `pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts --reporter=basic`:
    `1` file / `1` test green

Closed implementation slice:

- slice id: `ubiq_weak_band_exact_import_source_mapping_v1`
- type: source-table extraction, exact import, and topology correction
- status: implemented and target-green on 2026-04-14
- implemented artifacts:
  - [ubiq-open-web-weak-band-rows.ts](../../packages/catalogs/src/floor-systems/ubiq-open-web-weak-band-rows.ts)
  - [ubiq-open-web-weak-band-exact-source-mapping.test.ts](../../packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts)
  - [ubiq-open-web-weaker-band-posture-guard.test.ts](../../packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts)
  - [ubiq-open-web-weaker-band-card-posture.test.ts](../../apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts)
- implemented result:
  - extract the full official `FL-23`, `FL-25`, and `FL-27` table rows across
    joist depth, `INEX FLOOR` thickness, finish type, `Rw/Rw+Ctr`, and
    `Ln,w/Ln,w+CI`
  - import `54` exact-only rows:
    `3` families x `3` joist depths x `2` INEX thicknesses x `3` finishes
  - keep the rows out of nearby-family recommendation/interpolation by honoring
    `familyEstimateEligible: false` in
    [floor-system-match.ts](../../packages/engine/src/floor-system-match.ts)
  - keep upper-only weak-band visible packages fail-closed for impact unless the
    user also provides the direct lower-board source stack
  - correct existing `FL-24` rows to require the resilient lower-treatment
    topology instead of colliding with direct `FL-23`
- validation so far:
  - focused engine UBIQ exact/source/posture/re-rank/backlog pack:
    `5` files / `210` tests green, including the full
    [calculate-assembly.test.ts](../../packages/engine/src/calculate-assembly.test.ts)
  - floor library sweep/source/raw parity/companion pack:
    `4` files / `29` tests green
  - focused workbench weak-band and packaged-lane card pack:
    `2` files / `3` tests green

Closed implementation slice:

- slice id: `ubiq_open_web_supported_band_finish_completion_v1`
- type: source-table completion and catalog extraction for the official UBIQ
  supported-band `FL-24/26/28` corridor
- status: implemented and target-green on 2026-04-14
- implemented artifacts:
  - [ubiq-open-web-supported-band-rows.ts](../../packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-rows.ts)
  - [ubiq-open-web-supported-band-finish-completion.test.ts](../../packages/engine/src/ubiq-open-web-supported-band-finish-completion.test.ts)
  - updated [ubiq-candidate-backlog-contract.test.ts](../../packages/engine/src/ubiq-candidate-backlog-contract.test.ts)
  - updated [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
  - updated [floor-family-regressions.test.ts](../../apps/web/features/workbench/floor-family-regressions.test.ts)
- implemented result:
  - moved the touched UBIQ supported-band rows out of the monolithic
    [exact-floor-systems.ts](../../packages/catalogs/src/floor-systems/exact-floor-systems.ts)
  - imported the official bare INEX and timber + acoustic underlay exact values
    for `FL-24`, `FL-26`, and `FL-28`:
    `3` families x `3` joist depths x `2` INEX thicknesses x `2` exact finish
    lanes = `36` exact rows
  - preserved the old timber-row ids for compatibility and added explicit bare
    ids ending in `_bare_exact_lab_2026`
  - kept all bare rows exact-only with `familyEstimateEligible: false`
  - kept all `FL-24` rows exact-only; `FL-26/28` timber rows remain the current
    family-estimate anchors
  - did not import the official carpet `45 or less` values as exact `Ln,w`
    rows because the source gives `Ln,w+CI <= 45`, not exact `Ln,w`
  - at that exact-import checkpoint, kept supported-band carpet visible stacks
    off official exact and official bound rows; this was superseded by the
    later `impact_lnw_plus_ci_bound_surface_v1` bound import
- validation:
  - engine supported-band/backlog/corpus pack:
    `3` files / `16` tests green
  - web floor-family regression route pack:
    `1` file / `96` tests green
  - catalog, engine, and web typecheck green
  - catalog, engine, and web lint green
  - full engine suite: `107` files / `806` tests green
  - full web suite: `101` files / `615` tests green
  - `pnpm build` green with known `sharp/@img` optional-package warnings and
    the existing Next.js TypeScript plugin recommendation
  - `git diff --check` green

Closed implementation slice:

- slice id: `impact_lnw_plus_ci_bound_surface_v1`
- type: honest bound-output surface for source tables that publish
  `Ln,w+CI <= X` without exact `Ln,w`
- status: implemented and target-green on 2026-04-14
- implemented artifacts:
  - [impact-bound.ts](../../packages/shared/src/domain/impact-bound.ts)
  - [floor-system.ts](../../packages/shared/src/domain/floor-system.ts)
  - [bound-floor-system-match.ts](../../packages/engine/src/bound-floor-system-match.ts)
  - [target-output-support.ts](../../packages/engine/src/target-output-support.ts)
  - [ubiq-open-web-supported-band-carpet-bound-rows.ts](../../packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-carpet-bound-rows.ts)
  - [impact-lnw-plus-ci-bound-surface.test.ts](../../packages/engine/src/impact-lnw-plus-ci-bound-surface.test.ts)
  - [floor-family-regressions.test.ts](../../apps/web/features/workbench/floor-family-regressions.test.ts)
- implemented result:
  - shared bound schemas now accept `LnWPlusCIUpperBound` independently of
    `LnWUpperBound`
  - engine support buckets can mark `Ln,w+CI` supported from a bound row while
    leaving `Ln,w`, `CI`, `L'n,w`, `L'nT,w`, and `L'nT,50` unsupported
  - workbench output cards, summary/chart surfaces, trace panels, exact/bound
    panels, and scenario comparison can show `Ln,w+CI <= X dB` without falling
    back to a fake `Ln,w` value
  - UBIQ `FL-24/26/28` supported-band carpet + foam-underlay rows are imported
    as `18` official `Ln,w+CI <=45` bound rows
  - existing `LnWUpperBound` and `DeltaLwLowerBound` bound rows keep their
    metric-specific behavior
- acceptance:
  - carpet supported-band stacks never fabricate exact `Ln,w`
  - `Ln,w+CI` can surface as an official upper bound with clear basis/provenance
  - `Ln,w`, `CI`, `L'n,w`, and field continuations stay unsupported unless a
    separate source/formula/predictor lane owns them
  - existing `LnWUpperBound` and `DeltaLwLowerBound` rows keep their current
    behavior and tests
- validation so far:
  - targeted engine regression pack:
    `pnpm --filter @dynecho/engine exec vitest run src/calculate-assembly.test.ts src/calculate-impact-only.test.ts src/impact-upstream-parity-acceptance.test.ts src/impact-validation-benchmark.test.ts src/impact-validation-regime.test.ts --maxWorkers=1`:
    `5` files / `296` tests green
  - full web suite during this slice: `101` files / `615` tests green

Closed implementation slice:

- slice id: `bound_metric_report_surface_completion_v1`
- type: no-source-widening report/reference/performance-criteria completion for
  metric-specific impact bounds
- status: implemented and target-green on 2026-04-14
- implemented artifacts:
  - [compose-workbench-report.ts](../../apps/web/features/workbench/compose-workbench-report.ts)
  - [dutch-impact-reference.ts](../../apps/web/features/workbench/dutch-impact-reference.ts)
  - [impact-field-guides.ts](../../apps/web/features/workbench/impact-field-guides.ts)
  - [impact-product-catalog-panel.tsx](../../apps/web/features/workbench/impact-product-catalog-panel.tsx)
  - [compose-workbench-report-bound-metrics.test.ts](../../apps/web/features/workbench/compose-workbench-report-bound-metrics.test.ts)
  - [impact-field-guides-bound-metrics.test.ts](../../apps/web/features/workbench/impact-field-guides-bound-metrics.test.ts)
- implemented result:
  - report markdown now prints `Ln,w+CI upper bound` wherever the active lower
    bound owns that metric
  - target `Ln,w` delta calculations still ignore combined `Ln,w+CI` bounds
  - Dutch impact references mention the combined bound only as a proxy and keep
    compliance verdicts staged until exact `LnT,A` exists
  - field-guide status text now states that a combined `Ln,w+CI` bound is not a
    valid base `Ln,w` for guide derivation
- acceptance:
  - every user-facing surface either shows `Ln,w+CI <=45 dB` with official
    bound provenance or explicitly marks the requested downstream metric
    unsupported / needs input
  - no report or criteria path subtracts a target `Ln,w` from a combined
    `Ln,w+CI` bound
  - existing `Ln,w` upper-bound reports and Dutch/local guide flows remain
    unchanged where the source truly owns `LnWUpperBound`
- validation:
  - targeted web report/reference/guide pack:
    `4` files / `103` tests green

Closed implementation slice:

- slice id: `ubiq_lnw_plus_ci_bound_history_guard_v1`
- type: no-widening hostile-input and route-history guard for the new UBIQ
  combined-bound lane
- status: implemented and target-green on 2026-04-14
- implemented artifacts:
  - [ubiq-lnw-plus-ci-bound-history-guard.test.ts](../../packages/engine/src/ubiq-lnw-plus-ci-bound-history-guard.test.ts)
  - [ubiq-lnw-plus-ci-bound-history-guard.test.ts](../../apps/web/features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts)
- goal:
  - pin duplicate/split/reorder/save-load behavior for UBIQ carpet
    `Ln,w+CI <=45` rows on engine and workbench surfaces
  - prove long or noisy user input keeps the official combined bound only when
    the source topology is still visible
  - prove near-miss lower-treatment, carpet, fill, and board-count changes do
    not fall back to fake exact `Ln,w`, fake `CI`, or field continuations
- acceptance:
  - the canonical and source-equivalent hostile routes keep
    `supportedTargetOutputs = ["Rw", "Ln,w+CI"]`
  - `Ln,w`, `CI`, `L'n,w`, `L'nT,w`, and `L'nT,50` stay unsupported from the
    combined-bound source
  - malformed near-miss routes either fail closed or move to an already-labeled
    non-source estimate without claiming official bound provenance
  - report/card snapshots stay stable after save/load and floor/wall detours
- implemented result:
  - canonical, `49`-layer split, and role-reordered source-equivalent stacks
    stay on
    `ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026`
  - disjoint carpet, extra board, missing fill, and wrong-depth near-misses do
    not receive `lowerBoundImpact` or bound-floor provenance
  - workbench card snapshots keep official `Rw 64 dB` and
    `Ln,w+CI <= 45 dB` bound output through duplicate/split/reorder,
    save/load, and floor/wall detours
  - malformed carpet near-miss impact estimates are superseded by the
    fail-closed posture slice below
- validation:
  - targeted engine history/bound pack:
    `2` files / `5` tests green
  - targeted workbench history/report/floor pack:
    `3` files / `100` tests green

Do not start these after the
`raw_bare_open_web_open_box_source_evidence_re_rank_v1` closure unless a new
source contract explicitly reopens them:

- broad raw-floor inference widening
- C11c exact import
- GDMTXA04A exact reopen
- raw bare open-box or raw bare open-web impact support
- wall MorphologyV2 or general score-first selector rewrite

After the selected raw bare floor source-evidence re-rank is green, behavior
work is still allowed only one named route family and one named output surface
at a time, with value/origin/support/card guards written before runtime code
changes.

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
- latest implementation baseline before the docs-only end-of-day handoff:
  - `8f321de test(calculator): pin open box dry package fragmentation`
  - `b2cc5b7 test(web): pin open box finish tolerance history boundary`
  - `81f15c6 test(calculator): pin ubiq open web packaged lane traces`
  - `646bdf8 test(calculator): pin raw floor hostile input answers`
  - `e664c81 test(calculator): add wall selector trace matrices`
  - `014be88 docs(calculator): detail wall trace implementation plan`
  - `8f73493 docs(calculator): select next wall trace slice`
  - `08c918e docs(calculator): document answer origins and next gates`
- latest completed working slice:
  - `open_box_dry_package_fragmentation_trace_matrix_v1`
  - no solver, catalog, selector, source, support, or workbench runtime behavior
    changed
  - engine trace matrix:
    `packages/engine/src/open-box-dry-package-fragmentation-trace-matrix.test.ts`
  - workbench card matrix:
    `apps/web/features/workbench/open-box-dry-package-fragmentation-card-matrix.test.ts`
  - pinned behavior:
    high-fragmentation source-equivalent TUAS `R5b` open-box dry input stays
    exact with lab `Rw 75`, `Ln,w 44`, `Ln,w+CI 44`, and field `L'n,w 46`,
    `L'nT,w 43.6`, `L'nT,50 46.6`; disjoint upper-fill dry input stays off
    exact `R5b` and remains `family_general` at `54%` fit with duplicate
    upper-fill warning coverage
  - validation:
    focused engine/web tests green; engine adjacent pack `6` files / `50`
    tests green; workbench adjacent pack `5` files / `111` tests green;
    engine/web typechecks green; full engine `103` files / `791` tests green;
    full web `99` files / `607` tests green; `pnpm build` green with known
    warnings
- previous completed working slice:
  - `open_box_finish_tolerance_mixed_history_boundary_v1`
  - no solver, catalog, selector, source, support, or workbench runtime behavior
    changed
  - workbench mixed-history boundary guard:
    `apps/web/features/workbench/open-box-finish-tolerance-mixed-history-boundary.test.ts`
  - pinned behavior:
    the source-band `10 mm` laminate finish split (`4 + 6 mm`) survives
    duplicate/edit/reorder-bounce/save-load/floor-wall-mode history as exact
    `tuas_r2b_open_box_timber_measured_2026` with live `Rw 62`, `Ln,w 46`,
    `L'n,w 48`, and `L'nT,w 45.6`; the outside-band `12 mm` laminate split
    (`6 + 6 mm`) stays fail-closed on impact cards while `Rw` remains
    screening live at `44 dB`
  - validation:
    focused workbench open-box boundary `1` file / `1` test green; workbench
    adjacent mixed/history/floor pack `5` files / `112` tests green; engine
    adjacent source/route pack `4` files / `36` tests green; engine/web
    typechecks green; full engine `102` files / `790` tests green; full web
    `98` files / `606` tests green; `pnpm build` green with known warnings;
    `git diff --check` green
- previous completed working slice:
  - `ubiq_open_web_packaged_lane_trace_matrix_v1`
  - no solver, catalog, selector, source, support, or workbench runtime behavior
    changed
  - engine trace matrix:
    `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
  - workbench card matrix:
    `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`
  - pinned behavior:
    canonical, raw split, and tagged split UBIQ open-web lower packages stay
    `family_general` at `59.3%` fit; reordered input stays live but is pinned
    as `low_confidence` at `29%` fit
  - validation:
    focused UBIQ engine/web tests green; engine adjacent pack `7` files /
    `24` tests green; workbench adjacent pack `7` files / `13` tests green;
    engine/web typechecks green; full engine `102` files / `790` tests green;
    full web `97` files / `605` tests green
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
  - result: `102` files passed, `790` tests passed
- full web suite:
  - command: `pnpm --filter @dynecho/web test`
  - result: `97` files passed, `605` tests passed
- latest cross-package build gate:
  - `pnpm build`: green with the known `sharp/@img` optional-package warnings
    and Next.js TypeScript plugin recommendation
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
  - `open_box_finish_tolerance_mixed_history_boundary_v1`
  - `open_box_dry_package_fragmentation_trace_matrix_v1`
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
  - optional `open_box_finish_tolerance_mixed_history_boundary_v1` is now
    closed as a no-widening workbench history/card boundary guard
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

Current raw-floor hostile-input checkpoint:

- slice id: `raw_floor_hostile_input_answer_matrix_v1`
- type: no-widening pre-widening raw-floor answer/card matrix
- status: implemented and target-green
- behavior scope:
  - no solver, catalog, source, selector, support, or workbench runtime behavior
    changed
  - this is a guard before any raw-floor behavior widening, not a support-lane
    opening
- why it follows the wall trace checkpoint:
  - the wall trace matrix exposed no classified behavior bug, so widening wall
    selector math would be premature
  - CLT combined behavior still has `C11c` and `GDMTXA04A` source/frequency
    blockers
  - raw-floor widening remains high-risk, so the next useful move is stronger
    hostile-input answer evidence
- implemented edit set:
  - [raw-floor-hostile-input-answer-matrix.test.ts](../../packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts)
    pins engine numeric answers, support buckets, impact basis, no-match
    posture, warnings, and layer counts
  - [raw-floor-hostile-input-route-card-matrix.test.ts](../../apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts)
    mirrors those rows through workbench output-card status/value snapshots
- covered rows:
  - `11`-layer split terminal-concrete helper: all requested floor/field outputs
    stay live with pinned numeric answers
  - same materials with concrete no longer terminal: impact field outputs remain
    live, but requested field `Rw` stays unsupported
  - `13`-layer open-web helper-heavy raw stack: field airborne outputs stay live
    while `Rw` and impact outputs stay unsupported/needs-input
  - fragmented CLT lower-only raw stack: field airborne outputs stay live while
    `Rw` and impact outputs stay unsupported/needs-input
- validation completed in this checkpoint:
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

- `wall_selector_wider_trace_matrix_v1` and
  `raw_floor_hostile_input_answer_matrix_v1` are implemented as no-widening
  checkpoints
- `ubiq_open_web_packaged_lane_trace_matrix_v1` is now also implemented as the
  next no-widening floor checkpoint
- `open_box_finish_tolerance_mixed_history_boundary_v1` is now implemented as
  the follow-up no-widening workbench history/card boundary checkpoint
- `open_box_dry_package_fragmentation_trace_matrix_v1` is now implemented as a
  no-widening TUAS `R5b` dry-package fragmentation trace/card checkpoint
- these matrices did not expose a classified behavior bug in the current
  representative rows, so no selector, source, or raw-floor support behavior
  was changed
- do not immediately widen wall, floor, or CLT behavior from this evidence alone
- the next implementation step must stay narrow:
  - the 2026-04-14 second-pass re-rank verified the mixed route-history family
    grid was already covered
  - the follow-up `mixed_floor_wall_output_card_snapshot_grid_v1` guard is now
    implemented and target-green
  - the source-backed `source_gap_candidate_research_re_rank_v1` planning slice
    is now implemented and target-green
  - the UBIQ weak-band posture guard then exposed and fixed a narrow classified
    false-confidence route:
    `ubiq_open_web_weaker_band_posture_guard_v1`
  - `ubiq_weak_band_exact_import_source_mapping_v1` and its supported-band,
    bound, report, near-miss, source-gap, packaged-route, and history-replay
    follow-ups are now closed
  - `tuas_c11c_frequency_source_recheck_v1` is now also closed as no-runtime
  - `dataholz_gdmtxa04a_material_surface_recheck_v1` is now also closed as
    no-runtime
  - the checkpoint validation/commit-preparation step
    `checkpoint_validation_and_commit_v1` is now closed
  - the next step is the no-runtime planning pass
    `post_checkpoint_next_slice_selection_v1`
  - if a future behavior widening is selected after this checkpoint,
    name exactly one route family and one output surface first and add
    answer/card guards before code changes
- do not use the UBIQ packaged lower-lane trace as permission to open bare
  open-web raw carrier support
- do not use the open-box mixed-history guard as permission to expand the
  laminate/EPS tolerance band beyond the source-backed boundary
- do not use the `R5b` fragmentation guard as permission to open raw bare
  open-box impact support; it only freezes source-equivalent fragmentation and
  disjoint upper-fill fallback behavior
- 2026-04-14 second-pass implementation comparison completed the requested
  re-rank and the follow-up guard:
  - `mixed_floor_wall_seeded_long_chain_family_grid_v1` is implementation-covered
    by the existing generated mixed grid and targeted green packs
  - the selected no-widening implementation slice was
    `mixed_floor_wall_output_card_snapshot_grid_v1`
  - it is now implemented in
    `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`
  - it closes the remaining user-facing card-snapshot blind spot before behavior
    widening is attempted
  - the follow-up source re-rank selected
    `ubiq_open_web_weaker_band_posture_guard_v1`
  - that selected UBIQ posture guard and its follow-ups are now implemented
    through the UBIQ exact/source, supported-band, combined-bound, report,
    history, near-miss posture, source-gap matrix, raw bare open-web/open-box
    source-evidence re-rank, TUAS open-box same-package guard, UBIQ packaged
    open-web finish-family guard, UBIQ packaged open-web near-miss/drop-off
    matrix, and UBIQ packaged open-web history-replay slices; the post-UBIQ
    decision matrix refresh and C11c frequency/source recheck are closed; the
    Dataholz `GDMTXA04A` material-surface recheck is also closed; the
    checkpoint validation/commit-preparation action is closed; the active next
    no-runtime action is `post_checkpoint_next_slice_selection_v1`

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
- no UBIQ weak-band exact reopen inside this card-projection slice
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

Historical purpose at selection time:

- execute the then-selected `source_led_raw_or_predictor_widening_v1` plan on
  one concrete family instead of opening a broad raw or predictor pass
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

Current checkpoint / post-UBIQ re-rank starting pack:

```sh
pnpm --filter @dynecho/engine exec vitest run src/source-gap-candidate-re-rank-contract.test.ts src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts src/remaining-source-gap-posture-matrix.test.ts src/tuas-c11c-wet-stack-anomaly-audit.test.ts src/dataholz-clt-source-truth-audit.test.ts src/ubiq-candidate-backlog-contract.test.ts src/floor-source-corpus-contract.test.ts
```

```sh
pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts features/workbench/remaining-source-gap-posture-card-matrix.test.ts features/workbench/compose-workbench-report-bound-metrics.test.ts features/workbench/impact-field-guides-bound-metrics.test.ts
```

Closed `C11c` source/frequency recheck pack:

```sh
pnpm --filter @dynecho/engine exec vitest run src/source-gap-candidate-re-rank-contract.test.ts src/tuas-c11c-frequency-source-recheck.test.ts src/tuas-c11c-wet-stack-anomaly-audit.test.ts src/remaining-source-gap-posture-matrix.test.ts
```

```sh
pnpm --filter @dynecho/web exec vitest run features/workbench/remaining-source-gap-posture-card-matrix.test.ts
```

Next Dataholz `GDMTXA04A` material-surface recheck starting pack:

```sh
pnpm --filter @dynecho/engine exec vitest run src/source-gap-candidate-re-rank-contract.test.ts src/dataholz-clt-source-truth-audit.test.ts src/remaining-source-gap-posture-matrix.test.ts
```

```sh
pnpm --filter @dynecho/web exec vitest run features/workbench/remaining-source-gap-posture-card-matrix.test.ts
```

Full checkpoint gate:

```sh
pnpm typecheck
pnpm lint
pnpm --filter @dynecho/engine typecheck
pnpm --filter @dynecho/engine lint
pnpm --filter @dynecho/engine test
pnpm --filter @dynecho/web typecheck
pnpm --filter @dynecho/web lint
pnpm --filter @dynecho/web test
pnpm build
git diff --check
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
