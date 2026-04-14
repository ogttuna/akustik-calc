# Dynamic Calculator Remaining Work Plan

Last reviewed: 2026-04-14

Document role:

- single place for the remaining dynamic-calculator work across both wall and floor
- use this after [CURRENT_STATE.md](./CURRENT_STATE.md) when deciding what should be fixed next
- optimize for non-regressive work only: every item here must improve the calculator without weakening defended corridors
- for the detailed execution model that separates coverage widening, accuracy tightening, and required test packs, also read:
  - [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md)
- for output-origin, formula/source confidence, and card-support meaning, also read:
  - [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- for the latest UI handoff restart point, also read:
  - [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md)

## 1. Non-Regressive Rules

These rules are mandatory for every next change.

- do not widen any family lane just because it is numerically convenient
- do not normalize or sort layers globally to make outputs look calmer
- do not trade a known benchmark corridor for a broader but less honest fallback
- prefer fail-closed support over fabricated support
- if a route is physically order-sensitive, keep it order-sensitive and label it honestly
- if a route is only unstable because of solver handoff brittleness, fix the handoff instead of smoothing the output afterward

Every change must keep these guardrails green:

- wall standard engine corridor
- wall standard route corridor
- wall deep-hybrid cluster
- floor standard engine corridor
- floor standard route corridor
- mixed floor/wall torture pack

If a proposed fix cannot preserve those corridors, it is not ready.

## 2. Current Verified Posture

### Wall

Current verified result:

- wall selector trace/card checkpoint: green
  - slice id: `wall_selector_wider_trace_matrix_v1`
  - no solver, catalog, selector, floor support, or workbench runtime behavior
    changed
  - engine:
    `packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts`
  - workbench:
    `apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts`
  - focused validation:
    - engine trace matrix: `1` file, `1` test, green
    - workbench card matrix: `1` file, `1` test, green
  - adjacent validation:
    - engine selector/boundary pack: `3` files, `15` tests, green
    - workbench selector/boundary/validation pack: `5` files, `26` tests, green
  - full validation:
    - engine suite: `100` files, `788` tests, green
    - web suite: `95` files, `603` tests, green
    - engine/web typechecks and `git diff --check`: green
  - pinned surface:
    clear double-leaf, held AAC boundary, clear lined-massive, held G5 sibling,
    non-AAC heavy-core trim control, and lab double-stud control
- standard engine wall corridor: green
  - `8` files
  - `34` tests
- standard route wall corridor: green
  - `6` files
  - `24` tests
- broad defended revalidation: green
  - included inside the `2026-04-07` broad packs
  - no new wall-side solver regression was reproduced there
- wall deep-hybrid cluster:
  - current documented validation posture remains the isolated `--maxWorkers=1` cluster in [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
  - the underlying wall contract set is still the defended posture for duplicate, reorder, boundary, and deep-hybrid swap cases

Interpretation:

- the reproduced wall jump class is materially reduced inside the defended corridor
- the remaining wall debt is no longer “basic instability everywhere”
- the latest compact wall selector trace matrix did not expose a classified
  behavior bug, so the remaining wall debt is still corridor widening and
  selector architecture outside the currently defended
  `double_leaf <-> lined_massive_wall` hold
- that debt should not be touched without a newly named behavior slice and a
  failing or source-backed trace row

### Floor

Current verified result:

- UBIQ weak-band exact import and topology correction: green
  - slice id: `ubiq_weak_band_exact_import_source_mapping_v1`
  - source: official UBIQ fire/acoustic floor table PDF, page `7`
  - engine:
    `packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`
  - workbench:
    `apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`
  - focused validation:
    - engine UBIQ exact/source/posture/re-rank/backlog pack:
      `5` files, `210` tests, green
    - floor library sweep/source/raw parity/companion pack:
      `4` files, `29` tests, green
    - workbench weak-band and packaged-lane card pack:
      `2` files, `3` tests, green
  - pinned surface:
    - `FL-23`, `FL-25`, and `FL-27` direct weak-band source stacks are exact
      only when the direct lower-board package is visible
    - the `54` weak-band rows are excluded from nearby-family estimates with
      `familyEstimateEligible: false`
    - upper-only weak-band packages remain impact-fail-closed
    - `FL-24` now requires resilient lower-treatment criteria instead of
      colliding with direct `FL-23`
  - interpretation:
    - this closes the previous weak-band defer/import decision
    - it is not permission to open raw bare open-web impact support
    - the next UBIQ source work was completion of supported-band finish lanes
      and catalog extraction, not broad lightweight-steel widening
- UBIQ supported-band finish completion: green
  - slice id: `ubiq_open_web_supported_band_finish_completion_v1`
  - source: official UBIQ fire/acoustic floor table PDF, page `7`
  - catalog:
    `packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-rows.ts`
  - engine:
    `packages/engine/src/ubiq-open-web-supported-band-finish-completion.test.ts`
  - workbench:
    `apps/web/features/workbench/floor-family-regressions.test.ts`
  - focused validation:
    - engine supported-band/backlog/corpus pack:
      `3` files, `16` tests, green
    - workbench floor-family route pack:
      `1` file, `96` tests, green
    - catalog, engine, and web typecheck: green
    - catalog, engine, and web lint: green
    - full engine suite: `107` files, `806` tests, green
    - full web suite: `101` files, `615` tests, green
    - `pnpm build`: green with known `sharp/@img` optional-package warnings and
      the existing Next.js TypeScript plugin recommendation
    - `git diff --check`: green
  - pinned surface:
    - UBIQ open-web exact rows now total `90` across `FL-23/24/25/26/27/28`
    - supported resilient-band rows now total `36`: `18` bare INEX and `18`
      timber + acoustic underlay
    - bare rows are exact-only and cannot anchor nearby-family estimates
    - `FL-24` remains exact-only; `FL-26/28` timber rows remain the current
      defended family-estimate anchors
    - official carpet `Ln,w+CI <=45` values were intentionally left out of
      exact import because they are combined-metric bounds, not exact `Ln,w`
  - interpretation:
    - this closes the supported-band exact finish completion
    - follow-up UBIQ carpet work must stay schema/output support for
      `Ln,w+CI` upper bounds, not a shortcut exact import
    - raw bare open-web impact support remains deferred
- UBIQ supported-band carpet bound surface: green
  - slice id: `impact_lnw_plus_ci_bound_surface_v1`
  - source: official UBIQ fire/acoustic floor table PDF, page `7`
  - catalog:
    `packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-carpet-bound-rows.ts`
  - engine:
    `packages/engine/src/impact-lnw-plus-ci-bound-surface.test.ts`
  - workbench:
    `apps/web/features/workbench/floor-family-regressions.test.ts`
  - focused validation:
    - targeted engine regression pack: `5` files, `296` tests, green
    - full web suite during the slice: `101` files, `615` tests, green
  - pinned surface:
    - bound floor-system catalog now totals `23` rows
    - `18` UBIQ carpet rows expose official `Ln,w+CI <=45`
    - requested `Ln,w+CI` is supported as a bound; requested `Ln,w`, `CI`, and
      field continuations stay closed from this source
  - selected next floor slice:
    `bound_metric_report_surface_completion_v1`
  - interpretation:
    - the combined-metric source gap is closed for runtime/card support
    - the remaining risk is user-facing report/criteria/reference wording that
      still assumes every impact bound is `LnWUpperBound`
- Bound metric report/reference completion: green
  - slice id: `bound_metric_report_surface_completion_v1`
  - workbench:
    - `apps/web/features/workbench/compose-workbench-report.ts`
    - `apps/web/features/workbench/dutch-impact-reference.ts`
    - `apps/web/features/workbench/impact-field-guides.ts`
    - `apps/web/features/workbench/impact-product-catalog-panel.tsx`
  - tests:
    - `apps/web/features/workbench/compose-workbench-report-bound-metrics.test.ts`
    - `apps/web/features/workbench/impact-field-guides-bound-metrics.test.ts`
  - focused validation:
    - targeted web report/reference/guide pack: `4` files, `103` tests, green
    - final broad validation: catalog/engine/web typecheck and lint green,
      full engine `108` files / `811` tests green, full web `103` files /
      `618` tests green, `pnpm build` green with known `sharp/@img`
      optional-package warnings and the existing Next.js TypeScript plugin
      recommendation, and `git diff --check` green
  - pinned surface:
    - report markdown shows `Ln,w+CI upper bound` where that is the owned bound
    - target `Ln,w` math does not use combined `Ln,w+CI` bounds
    - Dutch impact references keep combined bounds as staged proxies, not
      compliance verdicts
    - field-guide copy says combined bounds are not valid guide-base `Ln,w`
  - follow-up floor slice:
    `ubiq_lnw_plus_ci_bound_history_guard_v1` is now closed
  - interpretation:
    - the report/reference wording gap is closed, and the route-history /
      hostile-input stability gap is now also closed by the follow-up guard
- open-box dry-package fragmentation trace/card matrix: green
  - slice id: `open_box_dry_package_fragmentation_trace_matrix_v1`
  - no solver, catalog, source, selector, support, or workbench runtime behavior
    changed
  - engine:
    `packages/engine/src/open-box-dry-package-fragmentation-trace-matrix.test.ts`
  - workbench:
    `apps/web/features/workbench/open-box-dry-package-fragmentation-card-matrix.test.ts`
  - focused validation:
    - engine trace matrix: `1` file, `1` test, green
    - workbench card matrix: `1` file, `1` test, green
  - adjacent validation:
    - engine open-box/split pack: `6` files, `50` tests, green
    - workbench open-box/card/history pack: `5` files, `111` tests, green
  - broad validation:
    - engine suite: `103` files, `791` tests, green
    - web suite: `99` files, `607` tests, green
    - repository build: green with known `sharp/@img` and Next.js TypeScript
      plugin warnings
    - engine/web typechecks and `git diff --check`: green
  - pinned surface:
    - source-equivalent high-fragmentation TUAS `R5b` dry package remains
      exact/live on lab and field output cards
    - disjoint upper-fill dry package stays on `family_general 54%` with
      duplicate upper-fill warning coverage instead of silently collapsing onto
      exact `R5b`
  - interpretation:
    - this is a guard on existing source-equivalent fragmentation and disjoint
      fallback behavior
    - it is not permission to widen raw bare open-box impact support
- open-box finish-tolerance mixed-history boundary: green
  - slice id: `open_box_finish_tolerance_mixed_history_boundary_v1`
  - no solver, catalog, source, selector, support, or workbench runtime behavior
    changed
  - workbench:
    `apps/web/features/workbench/open-box-finish-tolerance-mixed-history-boundary.test.ts`
  - focused validation:
    - workbench open-box mixed-history boundary: `1` file, `1` test, green
  - adjacent validation:
    - workbench mixed/history/floor pack: `5` files, `112` tests, green
    - engine source/route pack: `4` files, `36` tests, green
  - broad validation:
    - engine suite: `102` files, `790` tests, green
    - web suite: `98` files, `606` tests, green
    - repository build: green with known `sharp/@img` and Next.js TypeScript
      plugin warnings
    - engine/web typechecks and `git diff --check`: green
  - pinned surface:
    - source-band `10 mm` laminate split as `4 + 6 mm` remains exact/live
      through duplicate/edit/reorder-bounce/save-load/floor-wall history
    - outside-band `12 mm` laminate split as `6 + 6 mm` remains
      impact-unsupported / needs-input through the same history path
  - interpretation:
    - this closes the previously deferred optional open-box history boundary
    - it is a guard on existing behavior, not permission to widen open-box
      tolerance or raw-floor support
- UBIQ open-web packaged-lane trace/card matrix: green
  - slice id: `ubiq_open_web_packaged_lane_trace_matrix_v1`
  - no solver, catalog, source, selector, support, or workbench runtime behavior
    changed
  - engine:
    `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
  - workbench:
    `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`
  - focused validation:
    - engine UBIQ trace matrix: `1` file, `1` test, green
    - workbench UBIQ card matrix: `1` file, `1` test, green
  - adjacent validation:
    - engine packaged-lane/UBIQ pack: `7` files, `24` tests, green
    - workbench packaged-lane pack: `7` files, `13` tests, green
  - full validation:
    - engine suite: `102` files, `790` tests, green
    - web suite: `97` files, `605` tests, green
    - `pnpm build`: green with the known `sharp/@img` optional-package
      warnings and Next.js TypeScript plugin recommendation
    - engine/web typechecks and `git diff --check`: green
  - pinned surface:
    canonical raw, raw split, tagged split, and reordered UBIQ open-web
    `2 x 16 mm` lower packages
  - interpretation:
    - canonical/split/tagged variants stay on the current
      `family_general` source-backed estimate at `59.3%` fit
    - reordered input remains live but drops to `low_confidence` at `29%` fit
    - this checkpoint does not open bare open-web raw carrier support
- raw-floor hostile-input answer/card matrix: green
  - slice id: `raw_floor_hostile_input_answer_matrix_v1`
  - no solver, catalog, source, selector, support, or workbench runtime behavior
    changed
  - engine:
    `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
  - workbench:
    `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
  - focused validation:
    - engine hostile-input matrix: `1` file, `1` test, green
    - workbench hostile-input card matrix: `1` file, `1` test, green
  - adjacent validation:
    - engine raw adjacent pack: `6` files, `12` tests, green
    - workbench raw adjacent pack: `6` files, `9` tests, green
  - full validation:
    - engine suite: `101` files, `789` tests, green
    - web suite: `96` files, `604` tests, green
    - engine/web typechecks and `git diff --check`: green
  - pinned surface:
    long split terminal-concrete helper, same-material non-terminal concrete
    helper, long open-web helper-heavy negative, and fragmented CLT lower-only
    negative
- output-origin trace matrix: full current gates green
  - engine:
    `packages/engine/src/output-origin-trace-matrix.test.ts`
  - workbench:
    `apps/web/features/workbench/output-origin-trace-card-matrix.test.ts`
  - adjacent validation:
    - engine trace/source/raw pack: `3` files, `7` tests, green
    - workbench trace/source/raw pack: `3` files, `4` tests, green
    - full engine suite: `99` files, `787` tests, green
    - full web suite: `94` files, `602` tests, green
    - engine/web typechecks and `git diff --check`: green
  - covered answer origins:
    exact Dataholz CLT source, Dataholz source-family estimate, raw
    terminal-concrete formula/predictor, UBIQ bound-only source, dynamic wall
    field formula, field-airborne missing geometry, and unsupported impact
    fail-closed posture
  - planning implication:
    every new widening candidate should add its own value/origin/support/card
    row before solver behavior changes
- standard route floor corridor plus support/card parity pack: green
  - `11` files
  - `227` tests
- standard engine floor corridor plus support/raw-screening cross-check pack: green
  - `23` files
  - `311` tests
- raw safe-bare contiguous-split parity packs: green
  - engine: [raw-floor-safe-bare-split-parity.test.ts](../../packages/engine/src/raw-floor-safe-bare-split-parity.test.ts)
  - route: [raw-floor-safe-bare-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts)
- raw treated/inferred contiguous-split parity packs: green
  - engine: [raw-floor-inferred-split-parity.test.ts](../../packages/engine/src/raw-floor-inferred-split-parity.test.ts)
  - route: [raw-floor-inferred-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts)
- raw weaker-carrier posture packs: green
  - engine: [raw-floor-weaker-carrier-posture.test.ts](../../packages/engine/src/raw-floor-weaker-carrier-posture.test.ts)
  - route: [raw-floor-weaker-carrier-route-posture.test.ts](../../apps/web/features/workbench/raw-floor-weaker-carrier-route-posture.test.ts)
- official-product representative breadth closure pack: green
  - engine: `4` files, `253` tests
  - workbench: `6` files, `11` tests
- UBIQ provenance/boundary-freeze closure pack: green
  - engine: `5` files, `276` tests
  - workbench: `3` files, `67` tests
- TUAS floor source-truth rebaseline pack: green
  - engine: `6` files, `331` tests
  - workbench: `2` files, `98` tests
  - build: green
  - key correction:
    - imported TUAS exact rows and TUAS-backed predictor lanes now use the `SoundInsulation` spreadsheet rows `34`, `35`, `36`, `41`, and `42` as the numeric baseline
- floor airborne companion semantics pack: green
  - engine semantic guards: `9` files, `326` tests
  - workbench semantic guards: `4` files, `84` tests
  - upstream parity acceptance: `1` file, `2` tests
  - typechecks: shared, catalogs, engine, and web green
  - full engine suite: green in this companion-semantics slice; the current
    full-suite count is recorded in the CLT laminate-underlay guard pack below
  - build: green with the known `sharp/@img` optional-package warnings and
    Next.js TypeScript plugin recommendation
  - key correction:
    - row `42` is `Rw+C`; the numeric field remains `RwCtr` for compatibility,
      but TUAS rows now carry `RwCtrSemantic: "rw_plus_c"` so `C` is supported
      and `Ctr` stays unsupported
    - Dataholz `ctr_term` rows still expose source `Ctr` and withhold `C`
    - mixed-source predictor companion sets now fail closed instead of exposing
      an ambiguous legacy `RwCtr` value
- CLT laminate-underlay interpolation guard: green
  - engine direct guard: `2` files, `22` tests
  - engine adjacent guard: `7` files, `74` tests
  - engine route/broad guard: `6` files, `312` tests
  - workbench route guard: `3` files, `104` tests
  - typechecks: engine and web green
  - full engine suite: `96` files, `775` tests, green
  - build: green with the known `sharp/@img` optional-package warnings and
    Next.js TypeScript plugin recommendation
  - key correction:
    - TUAS `X2/C2` interpolation remains live for raw bare CLT and defended
      `laminate + EPS underlay` CLT
    - laminate-only CLT and out-of-band laminate thicknesses now stay
      impact-unsupported instead of inheriting the full measured
      laminate-plus-EPS improvement
- CLT dry finish-package guard: green
  - engine direct/source guard: `3` files, `31` tests
  - engine source-adjacent guard: `8` files, `83` tests
  - engine route/broad guard: `7` files, `321` tests
  - workbench route guard: `3` files, `105` tests
  - typechecks: engine and web green
  - full engine suite: `96` files, `777` tests, green
  - build: green with the known `sharp/@img` optional-package warnings and
    Next.js TypeScript plugin recommendation
  - key correction:
    - TUAS `X5/C5c` dry CLT interaction remains live for the source-backed
      `8 mm` laminate plus `3 mm` EPS finish band
    - out-of-band laminate or EPS thicknesses now stay impact-unsupported
      instead of re-entering through the dry interaction lane or generic CLT
      family archetype fallback
    - C7-style wet source packages remain on their documented family-estimate
      posture when entered as missing-role raw rows
- CLT combined malformed-finish fallback guard: green
  - engine direct/route guard: `2` files, `24` tests
  - workbench direct route guard: `1` file, `90` tests
  - engine source-adjacent guard: `8` files, `83` tests
  - engine route/broad guard: `7` files, `321` tests
  - workbench broad route guard: `3` files, `106` tests
  - typechecks: engine and web green
  - full engine suite: `96` files, `777` tests, green
  - build: green with the known `sharp/@img` optional-package warnings and
    Next.js TypeScript plugin recommendation
  - key correction:
    - combined CLT stacks with explicit lower treatment and malformed
      laminate/EPS walking finishes now fail closed before the generic
      same-family CLT archetype can reopen
    - valid source-backed laminate/EPS pairs remain live, including wet CLT
      packages with additional source-backed upper layers
    - malformed combined CLT finishes remain `Rw`-only in lab support and
      impact-unsupported instead of borrowing `C2c/C3c/C4c/C5c` neighbors
- open-box disjoint upper-package fallback guard: green
  - engine source/route guard: `1` file, `10` tests
  - workbench direct route guard: `1` file, `91` tests
  - engine source-adjacent guard: `5` files, `23` tests
  - workbench broad route guard: `2` files, `106` tests
  - engine route/broad guard: `7` files, `321` tests
  - typechecks: engine and web green
  - full engine suite: `96` files, `778` tests, green
  - build: green with the known `sharp/@img` optional-package warnings and
    Next.js TypeScript plugin recommendation
  - key correction:
    - TUAS open-box hybrid wet upper packages with a source-backed
      `geotextile + screed` floating-screed schedule now fail closed when
      exact matching falls off due to a disjoint or mixed upper schedule
    - exact `R7b/R8b/R9b/R2c` source rows remain live
    - generic dry open-box disjoint `upper_fill` rows remain on the documented
      `family_general` lane, so this did not broadly shut open-box fallback
- open-box laminate/EPS walking-finish fallback guard: green
  - engine source/route guard: `1` file, `11` tests
  - workbench direct route guard: `1` file, `92` tests
  - engine route/broad guard: `6` files, `322` tests
  - workbench broad route guard: `2` files, `107` tests
  - typechecks: engine and web green
  - full engine suite: `96` files, `779` tests, green
  - build: green with the known `sharp/@img` optional-package warnings and
    Next.js TypeScript plugin recommendation
  - key correction:
    - TUAS open-box walking-finish support is now limited to the source-backed
      `8 mm` laminate plus `3 mm` EPS underlay band
    - malformed `R2b` basic, `R5b` dry, and `R9b` hybrid style inputs no longer
      borrow predictor-specific or generic same-family impact values after exact
      matching falls off
    - valid exact open-box rows remain live; direct predictor rows with a
      source-band `3 mm` underlay and no product id remain accepted
- open-box finish tolerance guard: green
  - engine direct predictor guard: `1` file, `19` tests
  - engine source/route guard: `1` file, `11` tests
  - workbench direct route guard: `1` file, `92` tests
  - engine route/broad guard: `6` files, `323` tests
  - workbench broad route guard: `2` files, `107` tests
  - typechecks: engine and web green
  - full engine suite: `96` files, `780` tests, green
  - build: green with the known `sharp/@img` optional-package warnings and
    Next.js TypeScript plugin recommendation
  - key correction:
    - open-box walking-finish fallback is now aligned to exact visible-role
      tolerance for the source `8 mm` laminate plus `3 mm` EPS pair
    - `10 mm` laminate remains accepted as a near source-band predictor input,
      but `12 mm` laminate stays impact-unsupported instead of borrowing
      `R2b/R5b/R9b` values after exact matching falls off
    - this does not tighten the separate CLT interpolation band
- broad defended revalidation: green
  - included inside the `2026-04-07` broad packs
  - no new floor-side solver regression was reproduced there

Interpretation:

- floor is not in a broad stability failure state
- the previously active reinforced-concrete support-posture regression is now closed
- the newly reproduced raw safe-bare contiguous-split inference gap is also now closed:
  - raw same-material splits on hollow-core, bare CLT, and composite deck carriers now stay on the same predictor/family lane as their single-layer and tagged equivalents
  - open-box timber and wall-like heavy hybrids stayed fail-closed through the same fix
- the first treated/inferred raw-floor contiguous-split cohort is also now frozen:
  - exact Dataholz dry CLT, exact TUAS open-box dry floor, integrated dry CLT, and promoted heavy-concrete family-estimate packages now stay identical across defended raw split and tagged split variants
- the first weaker-carrier posture cohort is also now frozen:
  - open-box timber, open-web steel, lightweight steel, and steel-joist bare carriers stay fail-closed even when tagged
  - that bare open-web closure is now also separated from the defended lower-only packaged lane:
    - raw and tagged open-web `2 x 16 mm` ceiling packages stay on the same UBIQ `FL-26` family-general branch
    - this remains a packaged ceiling lane, not a reopened bare carrier lane
  - timber-frame, timber-joist, and engineered-timber structural carriers stay explicitly role-gated instead of widening raw support
  - raw timber lower-only and upper-only non-combined packages now also stay fail-closed until explicit base-structure evidence is present
  - open-box upper-only and lower-only non-combined packages now also stay fail-closed even when visible floor roles are explicit; defended open-box widening still starts from combined upper-plus-lower packages
  - composite ceiling-only packaged rows are now also explicitly frozen as a conservative PMC low-confidence continuation rather than a family-general reopen
  - CLT lower-only remains fail-closed and now acts as the adjacent negative guard for ceiling-side packaged widening
- packable ceiling-board schedule parity is also now frozen:
  - schedule-equivalent contiguous lower-board splits now reduce back to the defended predictor lane instead of parking the predictor and silently promoting or falling off
  - composite lower-only packaged rows now stay identical across raw single, raw split, tagged single, and tagged split variants
  - open-web lower-only packaged rows stay on the same defended `FL-26` branch across the same split surface
  - CLT and open-box lower-only guards remain the adjacent negative controls, so this does not widen generic ceiling-side packages
  - neutral same-total non-packable composite lower-only schedules now also stay on the same conservative continuation even though the predictor blocker remains active
  - neutral same-total non-packable open-web lower-only schedules stay on the same defended `FL-26` branch, while CLT and open-box lower-only still act as fail-closed adjacent controls
- packaged lower-board edit-path parity is also now frozen:
  - contiguous mixed lower-board order stays invariant across composite/open-web packaged lanes and the adjacent CLT/open-box guards
  - direct final-row entry and duplicate/swap/remove-rebuild workbench detours now land on the same final route snapshot on that lower-only surface
  - this widens the audit surface without widening any new family lane
- disjoint lower-board topology hardening is also now frozen:
  - auto predictor derivation now stays fail-closed when identical ceiling-board layers are separated by intervening lower-side roles
  - open-web lower-only packaged rows now keep the defended `FL-26` family-general tier only on contiguous lower-board schedules; disjoint/intervening topology steps down to `low_confidence`
  - composite lower-only disjoint topology still stays on the same conservative PMC continuation, but now carries explicit topology notes instead of reading like the canonical packaged shape
  - contiguous schedule-equivalent splits and defended contiguous non-packable mixed schedules remain unchanged, so this did not collapse the existing packaged lower-only corridor
- lower-helper topology hardening is also now frozen:
  - open-web lower-only packaged rows now keep the defended `FL-26` family-general tier only while `ceiling_fill` and `ceiling_cavity` stay coherent contiguous helpers
  - disjoint helper topology in `ceiling_fill` or `ceiling_cavity` now steps that open-web surface down to `low_confidence`
  - composite lower-only helper detours now stay on the same conservative PMC `low_confidence` continuation instead of drifting up into `family_general`
  - CLT and open-box helper detours remain fail-closed, and the defended contiguous helper split corridor remains unchanged
- lower-helper edit-path parity is also now frozen:
  - direct final-row entry and duplicate/swap/remove/rebuild helper detours now land on the same final route snapshot across the defended open-web/composite helper surface
  - adjacent CLT and open-box helper-detour guards keep the same fail-closed snapshot across those same store-history detours
  - this expands route-surface evidence without widening any new family lane
- a first family/profile boundary matrix is also now frozen:
  - adjacent `upper_only`, `lower_only`, `bare`, and `combined` lanes are now checked side by side across reinforced concrete, CLT, open-box timber, open-web steel, and composite families
  - future widening work should extend this boundary matrix before broadening support
- the first raw concrete ceiling-side inferred support cohort is also now frozen:
  - raw concrete rows with a coherent inferred ceiling helper package now reopen field-side `Rw` without needing explicit row roles
  - the defended shape is still narrow: at least one inferred `ceiling_board`, at least one inferred `ceiling_cavity` or `ceiling_fill`, and a concrete base carrier
  - raw wall-like heavy hybrids and weaker carriers stay outside that reopening rule
- official-product representative breadth is also now broader without changing the solver/catalog lanes:
  - workbench now exposes the missing `REGUPOL sonus multi 4.5` tile and porcelain exact rows
  - workbench now exposes a wider `Getzner AFM` delta range through `AFM 21`, `AFM 33`, and `AFM 35`
  - mixed generated engine and route surfaces now also include a second official exact topology plus a stronger product-delta lane
- the current floor debt is no longer a live blocker; it is coverage and future widening discipline
- secondary route-surface revalidation on `2026-04-07` also showed that the latest red workbench tests were stale surface contracts, not a fresh calculator regression:
  - bound floor status now keeps companion `Rw` live on the defended carry-over lane
  - wall apparent-route `Rw` now stays explicitly unsupported in the route contracts, matching engine support buckets
  - a new wall output-card parity pack now sits beside the floor parity pack so future support-surface drift is caught earlier

### Shared Mixed-Mode Torture Coverage

Current verified result:

- engine mixed floor/wall contiguous-split parity pack: green
  - `1` file
  - `1` test
- engine mixed floor/wall generated matrix pack: green
  - `1` file
  - `1` test
- route mixed study-mode torture pack: green
  - `1` file
  - `3` tests
- route mixed study-mode generated matrix pack: green
  - `1` file
  - `1` test
- route mixed study-mode generated edit-history matrix pack: green
  - `1` file
  - `1` test
- route mixed study-mode generated history-grid pack: green
  - `1` file
  - `3` tests

Interpretation:

- the repo now has a representative mixed torture slice, a first generated split-detour matrix, a first generated edit-history matrix, a first wider duplicate/swap grid, and a first deterministic generated longer cross-mode plus save/load roundtrip chain rather than only isolated floor and wall seeded tests
- cross-mode operator detours are now defended at the workbench route layer on representative deep stacks
- the representative deep-stack mixed torture slice now also defends save/load serialization roundtrips after alternating floor and wall detours, not only live in-memory edit sequences
- that representative roundtrip slice is now frozen as a compact explicit seeded-family matrix across heavy-concrete, open-web-bound, official product-data exact (`REGUPOL Curve 8 exact`), official no-screed exact product topology (`REGUPOL Multi 4.5 porcelain exact`), curated exact family/system match (`dataholz_timber_frame_exact`), exact family/system match with low-frequency closures (`hollow_core_vinyl_exact`), official product-backed lower-bound (`REGUPOL wet bound`), product-property DeltaLw (`Getzner AFM 33 Delta`), interpolation steel lower-bound (`UBIQ steel 250 bound`), warning-heavy missing-support-form steel bound (`UBIQ steel 300 unspecified bound`), and warning-light converged-crossover steel bound (`UBIQ steel 200 unspecified bound`) detours
- that compact matrix now proves each representative seeded family survives save/load after a wall detour plus three neighboring seeded-family detour chains, not only after one alternating floor/wall switch
- that same matrix now also survives at the current `savedScenarios` retention boundary, so the representative anchor no longer depends on a sparse saved-snapshot list
- the generated route/engine case sets are now aligned on Knauf concrete exact, TUAS concrete dry exact, Knauf direct timber exact, Knauf timber mount exact, Knauf acoustic timber exact, Dataholz timber-frame exact, Dataholz Dry exact, Dataholz Dry RC exact, dry CLT exact, TUAS CLT exact, TUAS CLT 260 exact, TUAS open-box exact, open-box dry exact, REGUPOL Curve 8 exact, REGUPOL wet bound, Getzner AFM 33 Delta, open-web 200 exact, open-web 400 exact, UBIQ steel 250 bound, UBIQ steel 200 unspecified bound, UBIQ steel 300 unspecified bound, and hollow-core vinyl exact floors, so mixed generated breadth no longer skips the defended published-exact concrete branch, the defended upper-treatment concrete exact branch, the defended direct-fixed timber exact branch, the defended lighter and heavier mounted timber exact branches, the defended wet-screed timber-frame, direct-lined dry, and suspended dry-timber exact branches, the defended dry and measured CLT exact branches, the defended measured and dry open-box exact branches, the defended official product-backed resilient-underlay exact and lower-bound branches, the defended product-property DeltaLw branch, the defended exact steel branches, the first defended interpolation steel lower-bound branch, the defended converged crossover steel lower-bound branch, the defended missing-support-form steel lower-bound branch, or the first defended precast hollow-core family on one side
- remaining debt is no longer “no mixed torture exists” or “the representative seeded-family matrix is missing”; it is that the mixed torture surface still stops at the first deterministic generated longer chain plus save/load roundtrip slice, the compact representative seeded-family matrix with its first three-neighbor operator-history chain, and the wider generated grid instead of:
  - broader seeded long-chain families beyond that compact matrix
  - wider preset-family case sets beyond the current heavy-concrete plus concrete exacts, Knauf timber exacts, Dataholz timber exacts, open-box exacts, CLT exacts, open-web exacts, and hollow-core cohort

### Cross-Surface Interpretation

Current overall reading:

- there is no active known blocker in the defended dynamic-calculator corridors right now
- current debt is mostly “how far is the evidence frozen” rather than “which reproduced bug is still open today”
- before the latest revalidation, two red route tests looked like regressions but were not:
  - bound floor carry-over `Rw` was now correctly live
  - wall apparent-route `Rw` was now correctly explicit/unsupported
- this means the next phase should prioritize evidence expansion and route-surface audit discipline, not a blind solver rewrite
- the latest post-widening revalidation stayed green on the change-adjacent packs as well:
  - engine pack: `15` files, `227` tests
  - route pack: `14` files, `47` tests
  - interpretation: the new raw-floor split/posture guards did not open a fresh regression in the currently defended wall, floor, or mixed surfaces
- the latest lower-board schedule normalization revalidation also stayed green on the change-adjacent packs:
  - engine pack: `8` files, `79` tests
  - route pack: `7` files, `26` tests
  - interpretation: restoring packable ceiling-board split parity did not open a fresh regression in raw-floor inference, weaker-carrier guards, or the defended route surfaces
- the latest neutral non-packable composite lower-board conservative-continuation revalidation also stayed green on the change-adjacent packs:
  - engine pack: `9` files, `76` tests
  - route pack: `7` files, `26` tests
  - interpretation: keeping composite lower-only mixed board schedules on the conservative PMC continuation did not open a fresh regression in open-web packaged lanes, adjacent CLT/open-box guards, or the defended route surfaces
- the latest packaged lower-board edit-path parity revalidation also stayed green on the change-adjacent packs:
  - engine pack: `4` files, `21` tests
  - route pack: `4` files, `18` tests
  - interpretation: freezing duplicate/swap/remove-rebuild convergence on the lower-only packaged surface did not expose a fresh regression in the adjacent packaged-lane, split-parity, or profile-boundary corridors
- the latest disjoint lower-board topology hardening revalidation also stayed green on the change-adjacent packs:
  - engine pack: `9` files, `243` tests
  - route pack: `6` files, `91` tests
  - interpretation: separating disjoint/intervening lower-board topology from the defended contiguous packaged lanes did not open a fresh regression in the packaged-lane, split-parity, or route warning surfaces
- the latest lower-helper topology hardening revalidation also stayed green on the change-adjacent packs:
  - engine pack: `8` files, `67` tests
  - route pack: `7` files, `94` tests
  - interpretation: separating disjoint helper topology from the defended packaged lower-only tiers did not open a fresh regression in predictor blockers, contiguous split parity, or the route support surfaces
- the latest helper edit-path parity expansion also stayed green on the change-adjacent packs:
  - engine adjacent pack: `4` files, `46` tests
  - route pack: `4` files, `6` tests
  - interpretation: freezing helper-detour direct-vs-store-history parity did not expose a fresh regression in the helper disjoint corridor, predictor blockers, or the adjacent lower-board edit-path surface
- the latest mixed generated edit-history expansion also stayed green on the change-adjacent packs:
  - engine adjacent pack: `2` files, `2` tests
  - route pack: `3` files, `4` tests
  - interpretation: freezing direct-vs-history parity on the generated mixed floor/wall case set did not expose a fresh regression in the representative mixed torture slice, the original generated matrix, or the adjacent engine mixed surface
- the latest mixed generated duplicate/swap grid expansion also stayed green on the change-adjacent packs:
  - engine adjacent pack: `2` files, `2` tests
  - route pack: `4` files, `5` tests
  - interpretation: widening the generated mixed route grid beyond one representative history path did not expose a fresh regression in the first mixed torture slice, the generated edit-history matrix, or the adjacent engine mixed surface
- the latest mixed longer cross-mode chain expansion also stayed green on the change-adjacent packs:
  - engine adjacent pack: `2` files, `2` tests
  - route pack: `4` files, `6` tests
  - interpretation: adding partial-edit abort plus opposite-mode restore chains on the generated mixed case set did not expose a fresh regression in the wider duplicate/swap grid, the representative mixed torture slice, or the adjacent engine mixed surface
- the latest mixed save-load roundtrip long-chain expansion also stayed green on the change-adjacent packs:
  - route pack: `4` files, `7` tests
  - interpretation: adding save/load serialization roundtrips after the generated cross-mode long chain did not expose fresh regression in the generated history grid, support-surface honesty, or the defended mixed route surface
- the latest representative mixed save-load torture expansion also stayed green on the change-adjacent packs:
  - route pack: `4` files, `8` tests
  - interpretation: adding save/load serialization roundtrips after alternating representative deep floor and wall detours did not expose fresh regression in the seeded mixed torture slice, route warnings, or support-surface honesty
  - latest seeded-family widening inside that slice: `REGUPOL wet bound`, `Getzner AFM 33 Delta`, `UBIQ steel 250 bound`, `UBIQ steel 300 unspecified bound`, plus `UBIQ steel 200 unspecified bound`
- the latest representative seeded-family interpolation steel expansion also stayed green on the change-adjacent packs:
  - engine mixed checkpoint pack: `4` files, `252` tests
  - route pack: `6` files, `11` tests
  - interpretation: adding `UBIQ steel 250 bound` to the compact representative seeded-family matrix closed the remaining mixed save/load gap on the first interpolation steel lower-bound branch without exposing fresh regression in save/load posture, route support honesty, or adjacent mixed generated coverage
- the latest representative seeded-family official no-screed exact expansion also stayed green on the change-adjacent packs:
  - engine mixed checkpoint pack: `4` files, `253` tests
  - route pack: `7` files, `13` tests
  - interpretation: adding `REGUPOL Multi 4.5 porcelain exact` to the compact representative seeded-family matrix closed the remaining mixed save/load gap on the first official no-screed exact product topology without exposing fresh regression in save/load posture, route support honesty, or adjacent mixed generated coverage
- the latest representative seeded-family roundtrip matrix tightening also stayed green on the change-adjacent packs:
  - engine adjacent pack: `2` files, `2` tests
  - route pack: `4` files, `8` tests
  - interpretation: converting the representative roundtrip slice into a compact explicit seeded-family matrix did not expose fresh regression in mixed save/load posture, warning surfaces, or adjacent generated engine coverage
- the latest representative seeded-family product-data exact expansion also stayed green on the change-adjacent packs:
  - engine mixed checkpoint pack: `3` files, `4` tests
  - route pack: `4` files, `8` tests
  - interpretation: adding the official product-data exact class (`REGUPOL Curve 8 exact`) to the compact representative seeded-family matrix did not expose fresh regression in mixed save/load posture, warning surfaces, or adjacent exact-split parity coverage
- the latest representative seeded-family longer-chain tightening also stayed green on the change-adjacent packs:
  - engine mixed checkpoint pack: `3` files, `4` tests
  - route pack: `4` files, `8` tests
  - interpretation: extending the compact representative seeded-family matrix from one neighboring seeded detour to a first two-seeded operator-history chain did not expose fresh regression in mixed save/load posture, warning surfaces, or adjacent exact-split parity coverage
- the latest representative seeded-family retention-boundary tightening also stayed green on the change-adjacent packs:
  - engine mixed checkpoint pack: `3` files, `4` tests
  - route pack: `4` files, `8` tests
  - interpretation: pushing the compact representative seeded-family matrix to the current eight-entry saved-scenario retention boundary did not expose fresh regression in snapshot reload, warning surfaces, requested outputs, or adjacent exact-split parity coverage
- the latest representative seeded-family exact-family expansion also stayed green on the change-adjacent packs:
  - engine mixed checkpoint pack: `3` files, `4` tests
  - route pack: `4` files, `8` tests
  - interpretation: adding the first curated exact family/system match class (`dataholz_timber_frame_exact`) to the compact representative seeded-family matrix did not expose fresh regression in mixed save/load posture, local-guide supplements, support buckets, or adjacent exact-split parity coverage
- the latest representative seeded-family hollow-core exact expansion also stayed green on the change-adjacent packs:
  - engine mixed checkpoint pack: `3` files, `4` tests
  - route pack: `4` files, `8` tests
  - interpretation: adding the first exact family/system match class with explicit low-frequency closures (`hollow_core_vinyl_exact`) to the compact representative seeded-family matrix did not expose fresh regression in mixed save/load posture, support buckets, unsupported-output honesty, or adjacent exact-split parity coverage
- the latest representative seeded-family age-position tightening also stayed green on the change-adjacent packs:
  - engine mixed checkpoint pack: `3` files, `4` tests
  - route pack: `4` files, `8` tests
  - interpretation: reloading oldest, mid-window, and newest retained snapshots inside the current eight-entry saved-scenario window did not expose fresh regression in snapshot age sensitivity, warning surfaces, support buckets, or adjacent exact-split parity coverage
- the latest exact floor-system companion split normalization and mixed concrete-exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `6` files, `16` tests
  - route pack: `4` files, `6` tests
  - interpretation: merge-safe airborne companion normalization closed a `0.1 dB` concrete exact split drift without reopening raw exact parity, split parity, or the defended mixed generated route surface
- the latest exact steel breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the first defended exact steel branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest mounted timber exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended mounted timber exact branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest Dry RC exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended suspended dry-timber exact branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest concrete dry exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended upper-treatment concrete exact branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest direct timber exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended direct-fixed timber exact branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest deeper exact steel breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the deeper defended exact steel branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest measured open-box exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended measured open-box exact branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest lighter mounted timber exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended lighter mounted timber exact branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest measured CLT exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended measured CLT exact branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest direct-lined dry timber exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended direct-lined dry timber exact branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest timber-frame exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended wet-screed timber-frame exact branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest heavier measured CLT exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended heavier measured CLT exact branch did not expose regression in exact companion parity, route history grid, or the adjacent engine mixed surface
- the latest official product-data exact breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended REGUPOL Curve 8 product-data exact branch did not expose regression in exact companion parity, `DeltaLw` support posture, route history grid, or the adjacent engine mixed surface
- the latest official product-backed lower-bound breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended REGUPOL wet-support lower-bound branch did not expose regression in support honesty, `DeltaLw` live posture, route history grid, or the adjacent engine mixed surface
- the latest steel interpolation lower-bound breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended UBIQ steel 250 lower-bound branch did not expose regression in support honesty, split-detour parity, route history grid, or the adjacent engine mixed surface
- the latest product-property DeltaLw breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended Getzner AFM 33 Delta branch did not expose regression in `DeltaLw` support posture, `Ln,w+CI` closure honesty, route history grid, or the adjacent engine mixed surface
- the latest converged crossover bound breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended UBIQ steel 200 unspecified branch did not expose regression in support-honest crossover handling, `Ln,w+CI`/`DeltaLw` closure honesty, route history grid, or the adjacent engine mixed surface
- the latest missing support-form bound breadth expansion also stayed green on the change-adjacent packs:
  - engine pack: `3` files, `4` tests
  - route pack: `4` files, `6` tests
  - interpretation: widening the mixed generated case set onto the defended UBIQ steel 300 unspecified branch did not expose regression in missing-support-form steel handling, `Ln,w+CI`/`DeltaLw` closure honesty, route history grid, or the adjacent engine mixed surface

## 2.1 Completion Checklist

Use this section to answer “is that old doc item actually done yet?” without having to infer it from several documents.

Completed and defended now:

- floor baseline phases `0-3`
- reinforced-concrete field-side floor-carrier `Rw` support fix
- representative floor output-card parity audit
- representative wall output-card parity audit
- safe-bare raw carrier contiguous-split parity fix
- treated/inferred raw-floor contiguous-split parity first cohort
- weaker-carrier raw-floor posture first cohort
- raw concrete ceiling-side inferred support first cohort
- wall Phase A hardening
- wall Phase B.1 boundary diagnostics
- mixed floor/wall representative torture slice
- mixed floor/wall representative save-load roundtrip torture slice
- mixed floor/wall first generated split-detour matrix
- mixed floor/wall first generated edit-history matrix
- mixed floor/wall first wider duplicate/swap grid
- mixed floor/wall first deterministic longer cross-mode chain
- mixed floor/wall first save-load roundtrip long-chain slice
- exact floor-system companion split parity on the defended floor exact rows

Partially complete:

- floor Phase `4`
  - active and defended on the currently targeted family-tightening corridor
  - not a statement that all family-by-family tightening work is complete
- wall Phase B.2
  - shipped only on the currently defended `double_leaf <-> lined_massive_wall` corridor
  - not a general ambiguity-aware selector yet

Still open:

- wall MorphologyV2 / score-first selector architecture
- wider-than-first-slice mixed floor/wall generated torture matrices
- wider raw-floor inference audit beyond the current representative reopening guard, safe-bare split cohort, first treated/inferred split cohort, first weaker-carrier posture cohort, and first raw concrete ceiling-side inferred support cohort
- source-led widening decisions for remaining open-box / open-web / deferred family branches
- later floor phases `5-8`

Important reading rule:

- “completed” means the defended corridor exists and is guarded by executable tests
- “partially complete” means a narrow defended slice exists, but the general problem class is not closed
- “still open” means the work should not be inferred as solved just because nearby representative corridors are green

## 3. Recently Closed: Concrete Floor Carrier `Rw` Support Regression

### What Was Wrong

For reinforced-concrete screening rows under field-style assembly context:

- descriptor is `R'w`
- `floorSystemRatings.Rw` is finite
- `supportedTargetOutputs` hides `Rw`

At the same time, the workbench `Rw` card could still show live because it read `floorSystemRatings.Rw` directly. That made the bug cross-surface, not just a stale engine expectation.

### Fix That Shipped

The fix now does two things:

1. [calculate-assembly.ts](../../packages/engine/src/calculate-assembly.ts)
   - reopens assembly-route floor-carrier `Rw` only when all of these are true:
     - `floorSystemRatings` is finite
     - the impact lane is active
     - visible input carries explicit floor-role evidence
   - this deliberately avoids reopening raw wall-like heavy hybrids that happen to land on the narrow heavy-floor impact lane
2. [simple-workbench-output-model.ts](../../apps/web/features/workbench/simple-workbench-output-model.ts)
   - stops rendering floor `Rw` as live when the engine support bucket has already marked it unsupported

### Contracts That Now Defend It

- engine concrete coverage:
  - [floor-core-coverage-matrix.test.ts](../../packages/engine/src/floor-core-coverage-matrix.test.ts)
- engine positive/negative support guard:
  - [calculate-assembly.test.ts](../../packages/engine/src/calculate-assembly.test.ts)
- route parity:
  - [floor-output-availability-matrix.test.ts](../../apps/web/features/workbench/floor-output-availability-matrix.test.ts)
- direct card-model parity:
  - [simple-workbench-output-model.test.ts](../../apps/web/features/workbench/simple-workbench-output-model.test.ts)
- broader representative card/support audit:
  - [floor-output-card-support-parity.test.ts](../../apps/web/features/workbench/floor-output-card-support-parity.test.ts)
- representative raw-screening carrier audit:
  - [raw-floor-screening-carrier-support.test.ts](../../packages/engine/src/raw-floor-screening-carrier-support.test.ts)
- representative raw-screening route audit:
  - [raw-floor-screening-route-support.test.ts](../../apps/web/features/workbench/raw-floor-screening-route-support.test.ts)
- real-world open-box branch-split benchmark:
  - [impact-real-world-floor-coverage.test.ts](../../packages/engine/src/impact-real-world-floor-coverage.test.ts)
- broad negative guard that stayed green during the fix:
  - [output-combination-sweep.test.ts](../../packages/engine/src/output-combination-sweep.test.ts)

### Residual Caution

- severity: medium-high
- why it matters:
  - the shipped fix is intentionally narrow
  - it protects real floor-role assemblies without widening raw heavy screening rows automatically
- remaining caution:
  - the first representative raw-screening carrier audits are now defended, but they are not a license to widen every raw screening row
  - if broader raw rows need `Rw` reopening later, that must go through wider raw-floor inference evidence, not another generic support shortcut

## 3.1 Recently Closed: Raw Safe-Bare Contiguous Split Inference Gap

### What Was Wrong

For raw floor inputs with no explicit floor-role tags, contiguous same-material structural splits such as:

- `hollow_core_plank 200` -> `100 + 100`
- `clt_panel 140` -> `70 + 70`
- `composite_steel_deck 150` -> `75 + 75`

could silently fall off the predictor/family lane even though the normalized topology reduced back to a single safe bare carrier.

Key diagnostic result:

- raw split rows drifted away from their raw single-layer siblings
- tagged split rows did not drift
- that proved the bug was in raw inference gating, not in the defended tagged family corridors

### Fix That Shipped

The fix stays narrow and only touches coalesced single safe-bare carriers:

1. [impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
   - raw floor-role inference now accepts a normalized single safe-bare `base_structure` layer even when the visible raw input arrives as contiguous same-material splits
2. [impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
   - predictor-input derivation now accepts that same normalized safe-bare carrier shape, so raw split rows land on the same predictor/family lane as their single-layer and tagged equivalents

What this does not widen:

- open-box timber raw carriers
- wall-like heavy hybrids
- raw heavy rows that are not reducible to one safe-bare structural carrier

### Contracts That Now Defend It

- engine contiguous-split parity:
  - [raw-floor-safe-bare-split-parity.test.ts](../../packages/engine/src/raw-floor-safe-bare-split-parity.test.ts)
- engine raw-vs-tagged parity:
  - [assembly-raw-floor-inference.test.ts](../../packages/engine/src/assembly-raw-floor-inference.test.ts)
- engine raw-screening support split:
  - [raw-floor-screening-carrier-support.test.ts](../../packages/engine/src/raw-floor-screening-carrier-support.test.ts)
- route contiguous-split parity and card surface:
  - [raw-floor-safe-bare-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts)
- route raw-screening support split:
  - [raw-floor-screening-route-support.test.ts](../../apps/web/features/workbench/raw-floor-screening-route-support.test.ts)
- route output-card parity:
  - [floor-output-card-support-parity.test.ts](../../apps/web/features/workbench/floor-output-card-support-parity.test.ts)
- wider treated/inferred split parity:
  - [raw-floor-inferred-split-parity.test.ts](../../packages/engine/src/raw-floor-inferred-split-parity.test.ts)
  - [raw-floor-inferred-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts)

## 3.2 Recently Closed: Packable Ceiling-Board Schedule Split Drift

### What Was Wrong

For defended lower-only packaged lanes, schedule-equivalent contiguous ceiling-board splits such as:

- `2 x 15 mm firestop_board` -> `7.5 + 7.5 + 15`
- `2 x 16 mm firestop_board` -> `8 + 8 + 16`

could park predictor derivation even though the visible stack still reduced to the same defended lower-board package.

Key reproduced drift:

- composite lower-only packaged rows dropped from the defended PMC `low_confidence` continuation into a worse `family_general` bare-composite fallback
- the same drift hit both raw split and tagged split route surfaces
- adjacent open-web lower-only, CLT lower-only, and open-box lower-only corridors showed that the issue was specifically schedule-equivalent ceiling-board normalization, not a broader family-boundary regression

### Fix That Shipped

The fix stays narrow and only normalizes packable contiguous ceiling-board schedules:

1. [impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
   - same-material contiguous ceiling-board blocks now normalize back to repeated copies of the thickest visible board only when the total board thickness packs exactly into that defended schedule
2. [impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
   - non-packable mixed-thickness board schedules still remain visible predictor blockers instead of being reinterpreted optimistically

At this stage:

- broad non-packable mixed-thickness schedules still remained outside the split-equivalence corridor
- the later narrow composite continuation hold in `3.3` closes one conservative subset without reopening generic predictor derivation

What this does not widen:

- CLT lower-only guards
- open-box lower-only guards
- non-packable mixed-thickness board schedules
- disjoint lower-board schedules with intervening roles

### Contracts That Now Defend It

- predictor normalization and blocker guards:
  - [impact-predictor-input.test.ts](../../packages/engine/src/impact-predictor-input.test.ts)
- engine split parity on defended and adjacent lower-only lanes:
  - [floor-split-layer-parity.test.ts](../../packages/engine/src/floor-split-layer-parity.test.ts)
- engine packaged-lane/profile audits:
  - [raw-floor-packaged-lane-audit.test.ts](../../packages/engine/src/raw-floor-packaged-lane-audit.test.ts)
  - [floor-profile-boundary-matrix.test.ts](../../packages/engine/src/floor-profile-boundary-matrix.test.ts)
- route raw/tagged split parity:
  - [raw-floor-inferred-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts)
- route packaged-lane/profile audits:
  - [raw-floor-packaged-lane-route-audit.test.ts](../../apps/web/features/workbench/raw-floor-packaged-lane-route-audit.test.ts)
  - [floor-profile-boundary-route-matrix.test.ts](../../apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts)

## 3.3 Recently Closed: Neutral Non-Packable Composite Lower-Board Drift

### What Was Wrong

For composite lower-only packaged rows, neutral same-total mixed board schedules such as:

- `2 x 15 mm firestop_board` -> `14 + 8 + 8`

still kept the lower-board schedule conflict visible, but could fall off the conservative PMC continuation into a worse bare-composite `family_general` fallback.

Key reproduced drift:

- the predictor blocker stayed active, so this was not a false-positive “predictor reopened” case
- composite lower-only raw split and tagged split rows both drifted away from their canonical raw single and tagged single siblings
- adjacent open-web non-packable lower-only rows stayed on the same `FL-26` branch, while adjacent CLT and open-box lower-only rows stayed fail-closed
- that proved the remaining bug was a narrow composite continuation/fallback mistake, not a generic ceiling-side widening rule

### Fix That Shipped

The fix stays narrow and only touches the composite lower-only mixed-board conflict path:

1. [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
   - when a composite `lower_only` stack still exposes a lower-board schedule conflict, the estimator now derives a predictor-specific estimate directly from the visible layers
2. [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
   - that path is reused only when it resolves to the conservative PMC `low_confidence` continuation, so the mixed schedule no longer degrades into the bare-composite `family_general` fallback

What this does not widen:

- generic non-packable lower-board schedules
- open-web lower-only packaged lanes
- CLT lower-only guards
- open-box lower-only guards
- generic predictor blockers outside this composite lower-only conservative continuation

### Contracts That Now Defend It

- engine neutral non-packable split parity:
  - [floor-split-layer-parity.test.ts](../../packages/engine/src/floor-split-layer-parity.test.ts)
- route raw/tagged neutral non-packable split parity:
  - [raw-floor-inferred-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts)
- adjacent packaged-lane audits:
  - [raw-floor-packaged-lane-audit.test.ts](../../packages/engine/src/raw-floor-packaged-lane-audit.test.ts)
  - [raw-floor-packaged-lane-route-audit.test.ts](../../apps/web/features/workbench/raw-floor-packaged-lane-route-audit.test.ts)
- adjacent family/profile boundary audits:
  - [floor-profile-boundary-matrix.test.ts](../../packages/engine/src/floor-profile-boundary-matrix.test.ts)
  - [floor-profile-boundary-route-matrix.test.ts](../../apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts)
- predictor/composite regression guards:
  - [impact-predictor-input.test.ts](../../packages/engine/src/impact-predictor-input.test.ts)
  - [predictor-floor-system-estimate.test.ts](../../packages/engine/src/predictor-floor-system-estimate.test.ts)
  - [composite-panel-published-interaction-estimate.test.ts](../../packages/engine/src/composite-panel-published-interaction-estimate.test.ts)

## 3.4 Newly Frozen Audit Surface: Packaged Lower-Board Edit-Path Parity

### What This Audit Proves

For the currently defended lower-only packaged surface:

- composite non-packable conservative continuation
- open-web non-packable `FL-26` branch
- adjacent CLT lower-only guard
- adjacent open-box lower-only guard

the same final visible stack now has direct executable coverage across both of these representations:

- direct final-row entry
- duplicate, split, adjacent-swap, remove, and rebuild detours through the workbench store

### Why This Matters

- this separates solver behavior from store-history noise on one of the remaining brittle-looking floor surfaces
- it also proves that contiguous mixed lower-board order is not silently changing the defended branch on the engine side
- future widening work on lower-only helper packages now has to preserve both final-row parity and edit-history parity

### Contracts That Now Defend It

- engine contiguous mixed-board order parity:
  - [floor-packaged-lane-order-parity.test.ts](../../packages/engine/src/floor-packaged-lane-order-parity.test.ts)
- route direct-vs-edit-path parity:
  - [floor-packaged-lane-edit-path-parity.test.ts](../../apps/web/features/workbench/floor-packaged-lane-edit-path-parity.test.ts)
- adjacent packaged-lane contracts:
  - [raw-floor-packaged-lane-audit.test.ts](../../packages/engine/src/raw-floor-packaged-lane-audit.test.ts)
  - [raw-floor-packaged-lane-route-audit.test.ts](../../apps/web/features/workbench/raw-floor-packaged-lane-route-audit.test.ts)
- adjacent split/profile contracts:
  - [floor-split-layer-parity.test.ts](../../packages/engine/src/floor-split-layer-parity.test.ts)
  - [raw-floor-inferred-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts)
  - [floor-profile-boundary-matrix.test.ts](../../packages/engine/src/floor-profile-boundary-matrix.test.ts)
  - [floor-profile-boundary-route-matrix.test.ts](../../apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts)

## 3.5 Recently Closed: Disjoint Lower-Board Topology Drift

### What Was Wrong

For lower-only packaged surfaces, disjoint/intervening lower-board topology such as:

- open-web: `16 mm board -> cavity -> 16 mm board`
- composite: `15 mm board -> fill -> 15 mm board -> cavity`

was still collapsing back onto the same visible lower-board package that the contiguous defended rows use.

Key reproduced drift:

- identical disjoint ceiling-board segments still auto-derived predictor input instead of staying fail-closed
- disjoint open-web lower-only rows kept the defended `FL-26` `family_general` tier even though the lower-board topology was no longer contiguous
- disjoint composite lower-only rows stayed on the conservative continuation, but they did so without explicit topology notes
- adjacent CLT and open-box disjoint lower-only rows stayed fail-closed numerically, but they were missing the same explicit blocker copy

### Fix That Shipped

The fix stays narrow and only hardens disjoint/intervening lower-board topology:

1. [floor-role-topology.ts](../../packages/engine/src/floor-role-topology.ts)
   - ceiling-board topology now distinguishes three cases:
     - schedule-equivalent contiguous splits: safe
     - contiguous mixed schedules: still visible schedule conflicts
     - disjoint/intervening ceiling-board segments: explicit topology conflicts
2. [impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
   - auto predictor derivation now stays fail-closed on that disjoint topology and surfaces the blocker warning copy
3. [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
   - lightweight-steel lower-only family holding now steps down only when the lower-board topology is disjoint
   - composite lower-only disjoint rows keep the same conservative PMC continuation, but now carry explicit topology notes

What this does not widen or collapse:

- schedule-equivalent contiguous lower-board splits
- defended contiguous non-packable open-web lower-only schedules
- defended contiguous non-packable composite lower-only schedules
- CLT lower-only guards
- open-box lower-only guards

### Contracts That Now Defend It

- topology and predictor blockers:
  - [floor-role-topology.test.ts](../../packages/engine/src/floor-role-topology.test.ts)
  - [impact-predictor-input.test.ts](../../packages/engine/src/impact-predictor-input.test.ts)
- engine disjoint packaged-lane detours:
  - [floor-packaged-lane-disjoint-detour.test.ts](../../packages/engine/src/floor-packaged-lane-disjoint-detour.test.ts)
- route disjoint packaged-lane detours:
  - [floor-packaged-lane-disjoint-route-detour.test.ts](../../apps/web/features/workbench/floor-packaged-lane-disjoint-route-detour.test.ts)
- adjacent contiguous parity guards:
  - [floor-split-layer-parity.test.ts](../../packages/engine/src/floor-split-layer-parity.test.ts)
  - [raw-floor-inferred-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts)

## 3.6 Recently Closed: Lower-Helper Topology Drift

### What Was Wrong

For lower-only packaged surfaces, duplicated or split helper roles such as:

- open-web: `board -> fill -> cavity -> fill`
- open-web: `board -> cavity -> fill -> cavity`
- composite: `board -> fill -> cavity -> fill`
- composite: `board -> cavity -> fill -> cavity`

were already keeping auto predictor derivation fail-closed, but the family tier was still too optimistic.

Key reproduced drift:

- open-web lower-only helper detours still stayed on the defended `FL-26` `family_general` tier with only a capped fit
- composite lower-only helper detours drifted from the canonical conservative `low_confidence` continuation up into `family_general`
- adjacent CLT and open-box helper detours stayed fail-closed numerically, so the issue was not missing guards but family-tier posture on the defended open-web/composite surface

### Fix That Shipped

The fix stays narrow and only touches `lower_only` helper-role conflicts:

1. [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
   - lower-only helper conflicts (`ceiling_fill`, `ceiling_cavity`) now hold back `family_general` on the same surface where predictor derivation is already fail-closed
2. [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
   - open-web lower-only helper detours now step down to `low_confidence` instead of staying on the defended `FL-26` tier
3. [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
   - composite lower-only helper detours now stay on the conservative PMC continuation and carry explicit helper-topology notes

What this does not widen or collapse:

- contiguous helper split parity
- lower-board topology hardening from `3.5`
- defended contiguous non-packable open-web lower-only schedules
- defended contiguous non-packable composite lower-only schedules
- CLT lower-only guards
- open-box lower-only guards

### Contracts That Now Defend It

- engine helper disjoint packaged-lane detours:
  - [floor-packaged-lane-helper-disjoint-detour.test.ts](../../packages/engine/src/floor-packaged-lane-helper-disjoint-detour.test.ts)
- route helper disjoint packaged-lane detours:
  - [floor-packaged-lane-helper-disjoint-route-detour.test.ts](../../apps/web/features/workbench/floor-packaged-lane-helper-disjoint-route-detour.test.ts)
- adjacent contiguous parity/profile guards:
  - [floor-split-layer-parity.test.ts](../../packages/engine/src/floor-split-layer-parity.test.ts)
  - [raw-floor-inferred-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts)
  - [floor-profile-boundary-matrix.test.ts](../../packages/engine/src/floor-profile-boundary-matrix.test.ts)
  - [floor-profile-boundary-route-matrix.test.ts](../../apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts)

## 3.7 Newly Frozen Audit Surface: Lower-Helper Edit-Path Parity

### What This Audit Proves

For the currently defended lower-only helper-detour surface:

- open-web helper disjoint `low_confidence` hold
- composite helper conservative continuation
- adjacent CLT helper fail-closed guard
- adjacent open-box helper fail-closed guard

the same final visible stack now has direct executable coverage across both of these representations:

- direct final-row entry
- duplicate, split, adjacent-swap, remove, and rebuild helper detours through the workbench store

### Why This Matters

- this closes the remaining obvious store-history blind spot beside the helper-topology hardening from `3.6`
- it proves that helper-detour route posture is not changing just because the same final helper topology was assembled through a noisier store path
- future widening work on lower-only helper packages now has to preserve direct-vs-edit-path parity, not only direct disjoint final-row parity

### Contracts That Now Defend It

- route helper direct-vs-edit-path parity:
  - [floor-packaged-lane-helper-edit-path-parity.test.ts](../../apps/web/features/workbench/floor-packaged-lane-helper-edit-path-parity.test.ts)
- adjacent helper disjoint route contracts:
  - [floor-packaged-lane-helper-disjoint-route-detour.test.ts](../../apps/web/features/workbench/floor-packaged-lane-helper-disjoint-route-detour.test.ts)
- adjacent lower-board edit-path parity:
  - [floor-packaged-lane-edit-path-parity.test.ts](../../apps/web/features/workbench/floor-packaged-lane-edit-path-parity.test.ts)
- predictor and profile guards that must stay unchanged:
  - [floor-role-topology.test.ts](../../packages/engine/src/floor-role-topology.test.ts)
  - [impact-predictor-input.test.ts](../../packages/engine/src/impact-predictor-input.test.ts)
  - [floor-profile-boundary-route-matrix.test.ts](../../apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts)

## 3.8 Recently Closed: Exact Floor-System Companion Split Drift

### What Was Wrong

When a defended exact floor-system row kept the same published match after a contiguous same-material split, the main exact outputs stayed stable but screening-anchored airborne companions could still drift by `0.1 dB`.

Reproduced example:

- `Knauf CC60.1A` stayed on the same exact floor-system match with the same `Rw` and `Ln,w`
- but `C`, `Ctr`, and the downstream field companion surface could shift slightly between canonical and split-equivalent rows
- the same mixed generated route case therefore failed even though impact matching and support posture stayed identical

Why this mattered:

- this was a real solver-output drift, not a stale route contract
- the drift appeared exactly on a family we wanted to add to the defended mixed generated breadth
- accepting the preset without fixing the drift would have widened coverage while lowering split-determinism on exact floor rows

### Fix That Shipped

The fix stays narrow and only touches the airborne companion path for floor-like stacks:

1. [calculate-assembly.ts](../../packages/engine/src/calculate-assembly.ts)
   - a merge-safe airborne-equivalent layer set now coalesces contiguous same-material, same-role floor segments before screening-anchored airborne companion calculations
2. [calculate-assembly.ts](../../packages/engine/src/calculate-assembly.ts)
   - the gate is limited to explicit or inferred floor-like stacks, so wall routes do not silently inherit the new normalization
3. [calculate-assembly.ts](../../packages/engine/src/calculate-assembly.ts)
   - coalesced surface mass is recomputed from the merged thickness instead of summing rounded split masses, which closes the residual `0.1 dB` drift on split `6.5 + 6.5` board rows

What this does not widen:

- exact impact matching
- published floor-system selection
- wall airborne routes
- generic lower-only packaged-lane logic

### Contracts That Now Defend It

- engine exact companion split parity:
  - [floor-exact-companion-split-parity.test.ts](../../packages/engine/src/floor-exact-companion-split-parity.test.ts)
- adjacent engine parity packs that stayed green:
  - [floor-split-layer-parity.test.ts](../../packages/engine/src/floor-split-layer-parity.test.ts)
  - [floor-input-noise-parity.test.ts](../../packages/engine/src/floor-input-noise-parity.test.ts)
  - [floor-library-raw-parity.test.ts](../../packages/engine/src/floor-library-raw-parity.test.ts)
- mixed generated route packs that stayed green after adding the concrete, exact steel, mounted timber exacts, measured CLT exacts, timber-frame exact, direct-lined dry timber exact, Dry RC exact, concrete dry exact, direct timber exact, deeper exact steel, and measured open-box exact cases:
  - [mixed-study-mode-generated-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts)
  - [mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts)
  - [mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts)

## 4. Route-Surface Audit Rules

These rules are now important enough to keep separate from the generic non-regressive rules because they were the source of the latest false alarm.

- do not treat a finite metric or companion value as automatically surface-live
- `supportedTargetOutputs` / `unsupportedTargetOutputs` remain the source of truth for route cards and target-output status
- if a route-surface contract is red, confirm whether engine support buckets agree before treating it as a solver regression
- keep explicit wall/floor output-card parity audits green before widening any new route surface

What is intentionally defended today:

- floor carry-over `Rw` may stay live on defended floor-carrier lanes
- wall-side `Rw` may stay explicit once the airborne descriptor is `R'w`
- route cards must fail-close unsupported outputs even when some raw payload field is finite

Current parity guards:

- [floor-output-card-support-parity.test.ts](../../apps/web/features/workbench/floor-output-card-support-parity.test.ts)
- [wall-output-card-support-parity.test.ts](../../apps/web/features/workbench/wall-output-card-support-parity.test.ts)
- [target-output-status.test.ts](../../apps/web/features/workbench/target-output-status.test.ts)
- [simple-workbench-output-model.test.ts](../../apps/web/features/workbench/simple-workbench-output-model.test.ts)

## 5. Remaining Wall Plan

Wall is no longer blocked by the old reproduced jump class, but it still has architectural debt.

### Remaining Wall Risks

- family selection still ends in a hard branch outside the held corridor
- `multileaf_multicavity` is still a conservative surrogate rather than a dedicated multi-cavity solver
- the current hold is intentionally narrow and should not be widened blindly
- wider-than-representative deep-hybrid route palettes are not yet frozen
- a future stack could still expose more than one plausible runner-up family outside the current defended corridor

### Risk Level

- severity: medium
- why it matters:
  - the defended wall corridor is currently green
  - remaining risk is concentrated in wider hybrid matrices and future selector handoff surfaces, not in the old reproduced main bug set
- regression risk of further wall work: high if rushed
  - wall family routing is benchmark-anchored now
  - any widening without stronger generated evidence can easily reopen the same class of handoff bug

### Safe Wall Fix Order

1. finish the mixed-stack torture pass first
   - do not widen the hold before this exists

2. extend evidence, not logic, on the next pass
   - wider route-side deep-hybrid palettes
   - larger duplicate/reorder/swap matrices
   - multi-runner-up detection scans

3. only then consider selector architecture work
   - shadow-mode candidate scoring
   - ambiguous-family hold rules outside the current corridor
   - only if every widening survives exact trace and parity contracts

4. leave MorphologyV2 as a later step
   - this is the “make the parser physically smarter” move
   - it should only begin after the current corridor is fully frozen

### Likely Code Touch Surface

Primary likely code touch surface:

- [dynamic-airborne.ts](../../packages/engine/src/dynamic-airborne.ts)
  - selector scoring, ambiguity handling, or bounded hold logic
- [airborne-topology.ts](../../packages/engine/src/airborne-topology.ts)
  - only if future evidence proves topology decomposition itself is the blocker
- [dynamic-calc-branch.ts](../../apps/web/features/workbench/dynamic-calc-branch.ts)
  - only for trace/report wording after engine posture changes

Do not touch these first in the next pass:

- published wall benchmark fixtures
- framed-wall calibration constants
- global layer-order normalization helpers

### What Must Not Happen On Wall Side

- no global wall canonicalization
- no silent output clamping
- no widening of `stud_wall_system` on metadata alone
- no expansion of the hold beyond `double_leaf <-> lined_massive_wall` without new generated scans

## 6. Remaining Floor Plan

Floor should now stay on controlled widening and tightening only.

### Remaining Floor Risks

- mixed floor/wall complex stacks still need broader generated edit-chain and duplicate/swap torture beyond the first generated matrix
- raw-vs-tagged parity, safe-bare contiguous-split parity, the first treated/inferred split cohort, the first weaker-carrier posture cohort, and the first raw concrete ceiling-side inferred support cohort are defended only on the currently harvested floor cohorts
- intentionally fail-closed structural carriers still need source-led widening decisions
- route coverage now defends representative support-bucket/card parity and representative raw-screening posture, but not yet every wider raw-screening widening decision
- the TUAS open-box real-world coverage fixture is now aligned with the defended `a/b` branch split:
  - generic `resilient_stud_ceiling` basic rows bind to `R2b`
  - explicit `tuas_open_box_ceiling_family_a` rows bind to `R2a`

### Risk Level

- severity of the remaining floor debt: medium
- why it matters:
  - most defended floor corridors are green
  - remaining debt is coverage, source-led widening, and complex-stack stability, not a universal solver collapse
- regression risk of future widening: medium-high
  - floor widening can silently create fake confidence on raw carriers if source gating weakens

### Safe Floor Fix Order

1. freeze the now-closed TUAS floor truth before any new widening:
   - hybrid open-box branch is closed through `R2c`
   - staged-upper / heavy dry-top CLT branch is closed through `C5`
   - wet geotextile CLT branch is now also closed through `C7`
   - keep the selected engine/workbench TUAS baseline packs and `pnpm build` green

2. keep the landed `C7`, `C2c`, `C3c`, `C4c`, `C5c`, and `C7c` anchors frozen after the source-truth rebaseline:
   - `C7`: exact upper/wet geotextile CLT row
   - `C2c`: exact lower-ceiling combined CLT anchor
   - `C3c`: exact staged dry-board combined CLT anchor
   - `C4c`: exact heavy dry-board combined CLT anchor
   - `C5c`: predictor-backed dry combined CLT anchor
   - `C7c`: exact wet combined CLT anchor

3. keep the remaining combined `c`-family CLT backlog deferred unless a pure exact import is proven:
   - `C11c` remains screening-only / impact-unsupported today
   - under-described combined direct-fixed CLT stacks remain fail-closed

4. keep `tuas_c11c_wet_stack_anomaly_audit_v1` closed as deferred / fail-closed before any raw-floor screening / inference widening:
   - any combined-row reopen must preserve the combined-CLT inference/predictor fail-closed guards
   - C11c is now kept deferred because the known source schedule still has an unexplained weak wet-stack tuple

5. only after that, resume raw-floor screening and inference widening:
   - wider inferred floor packages with clear upper/lower treatment evidence
   - ceiling-side inferred packages beyond the first widened contiguous-split helper cohort now in place
   - raw wall-like heavy hybrids and remaining weaker carriers that must stay closed

6. keep unsupported raw lanes, deferred UBIQ weaker bands, and broader wall widening fail-closed / frozen unless the source corpus or trace packs clearly support reopening them

### Missing Test Surfaces To Add Next

These are the most likely next useful tests. They are not currently defended enough to claim closure.

- closed optional route-history slice:
  - open-box finish-tolerance mixed-history boundary
  - landed reason:
    - `open_box_finish_tolerance_guard_v1` had already narrowed the source-band
      vs outside-band laminate/EPS support boundary
    - the remaining risk was store-history drift under duplicate/split,
      row-order bounce, save/load, and floor/wall mode switching
  - landed scope:
    - `10 mm` source-band laminate split remains exact/live on TUAS `R2b`
    - `12 mm` outside-band laminate split remains fail-closed on impact outputs
    - workbench output-card values and unsupported/needs-input status are pinned
  - current status:
    - closed

- closed provenance/boundary slice:
  - UBIQ provenance/boundary-freeze decision
  - landed reason:
    - the first widened raw-negative pass and the representative official-product breadth gap were already closed green
    - UBIQ weaker-band widening remained deliberately deferred
    - the honest move was therefore to freeze provenance and the no-weaker-band boundary more explicitly before any future UBIQ widening discussion
  - landed scope:
    - full current `ubiq_fl32_*` plus `ubiq_fl33_*` bound cluster is now frozen in contract tests
    - shared official brochure URL is now part of that contract
    - visible FRL/D drift is now documented explicitly without triggering a runtime rename
  - current status:
    - closed

- closed slice after the raw-negative, official-product, UBIQ provenance, mixed representative-chain, and official no-screed exact follow-up passes:
  - Dataholz CLT exact slack tightening
  - landed reason:
    - the imported Dataholz CLT corpus still had a narrow exact-preserving tightening opportunity
    - local probing showed that only `dataholz_gdmnxn02_05_wet_clt_lab_2026` was still missing a defended predictor-exact fingerprint
    - `dataholz_gdmnxn02_wet_clt_lab_2026` was already predictor-exact active, while `dataholz_gdmtxa04a_clt_lab_2026` remained a different class of problem because `manualMatch: false` keeps it outside predictor exact resolution
  - landed scope:
    - `gdmnxn02_05` now resolves on the exact lane from explicit predictor input
    - adjacent wet CLT family estimates stayed intact
    - `gdmtxa04a` now has an explicit adjacent negative guard that freezes it on the dry CLT estimate neighborhood
  - current status:
    - closed

- selected next slice after that Dataholz CLT tightening pass:
  - Dataholz GDMTXA04A manual-match boundary decision
  - current reason:
    - the wet no-lining Dataholz slack is now closed on the predictor-exact path
    - the only remaining imported CLT exact-only row is `dataholz_gdmtxa04a_clt_lab_2026`
    - this is not another straightforward fingerprint addition:
      - it stays `manualMatch: false`
      - visible and predictor surfaces currently route it through the dry CLT estimate branch
    - the next honest move is therefore a narrow boundary decision about whether that row should remain estimate-only or gain a new defended exact surface
  - current status:
    - closed
  - landed decision:
    - keep `gdmtxa04a` estimate-only on visible and predictor surfaces for now
    - reason:
      - the official source still describes the `65 mm` top dry-floor layer only as an areal-mass entry, not as a named generic board/product surface
      - that is enough for curated direct-id exact resolution, but not enough for an honest manual visible exact reopen
    - freeze this posture with:
      - engine exact-vs-estimate boundary tests
      - workbench branch-summary honesty tests

- selected next slice after the GDMTXA04A boundary closure:
  - raw floor negative audit expansion v3
  - current reason:
    - the remaining CLT exact-only row is now deliberately frozen instead of widened
    - the safest next gain is back on defended fail-closed posture:
      - broader helper permutations
      - wider heavy-hybrid negatives
      - additional weaker-carrier helper packages
    - this follows the explicit fallback rule already recorded in the coverage plan
  - current status:
    - closed
  - landed scope:
    - helper-heavy `steel_joist_floor` raw and tagged rows are now frozen on the same fail-closed weaker-carrier surface as helper-heavy lightweight steel
    - wider wall-like heavy hybrids now also stay frozen on the same screening-only heavy-concrete posture across:
      - split fill on both sides of the concrete core
      - `board + fill + board + concrete + board` mixed helper topology
    - engine, route, and output-card parity now all defend those added variants
  - landed note:
    - local probing exposed one adjacent open-web boundary question:
      - `gypsum_board + rockwool + gypsum_board + open_web_steel_floor` currently lands on `low_confidence` / local-guide continuation
      - that is not automatically a v3 bug because the source ledger already allows conservative open-web continuation inside explicit support-form evidence
      - it should be handled as a dedicated boundary-decision slice instead of broadening the weaker-carrier fail-closed rule

- selected next slice after raw floor negative audit expansion v3:
  - open-web helper continuation boundary decision
  - current reason:
    - the second raw-negative pass closed the steel-joist and wider heavy-hybrid fail-closed stress surface without a solver change
    - the remaining adjacent question is no longer generic raw-negative breadth:
      - it is whether helper-heavy noncanonical open-web lower packages should stay on conservative continuation or step down further
    - that decision must stay separate from both:
      - the defended contiguous `FL-26` packaged lane
      - the fail-closed weaker-carrier guard
  - current status:
    - closed
  - landed decision:
    - historical 2026-04-09 posture: keep helper-heavy noncanonical
      `gypsum_board + rockwool + gypsum_board + open_web_steel_floor` on a
      same-family `low_confidence` continuation
    - superseded on 2026-04-14: after the `FL-24` resilient topology
      correction and exact-only flag, this package is impact-fail-closed
    - still do not promote it to the defended contiguous `FL-26`
      family-general package
  - landed reason:
    - superseded source reading: `FL-24` requires resilient ceiling,
      `rockwool`, and `2 x 13 mm` boards rather than direct
      `2 x 13 mm` plasterboard lower lining
    - the live stack still has split lower-board topology plus extra fill and no explicit `INEX FLOOR` top package
    - current notes/warnings therefore correctly hold it below the narrower same-family corridor
  - landed scope:
    - engine note/warning contract now freezes the blocker copy
    - engine and route boundary matrices now freeze the same `low_confidence` candidate id and live-output posture
  - current validation:
    - targeted engine: `2` files, `18` tests, green
    - targeted workbench: `1` file, `14` tests, green
    - adjacent engine: `5` files, `28` tests, green
    - adjacent workbench: `5` files, `23` tests, green

- selected next slice after open-web helper continuation boundary decision:
  - open-web noncanonical continuation parity follow-up
  - current reason:
    - the boundary decision is now frozen on direct engine and route snapshots
    - the next honest gain is to widen parity around that newly classified continuation:
      - raw vs tagged
      - duplicate/swap/remove/rebuild edit paths
      - direct final-row entry parity
    - existing open-web edit-path suites mostly defend the canonical firestop/cavity package corridor, not this newly frozen gypsum/rockwool/gypsum low-confidence continuation
  - current status:
    - closed
  - landed scope:
    - engine split-layer parity now includes the noncanonical `gypsum + rockwool + gypsum + open-web` continuation
    - engine board-cluster order parity now includes the same continuation
    - workbench raw/tagged split parity now includes the same continuation
    - workbench duplicate/remove/rebuild edit-path parity now includes the same continuation
    - the underlying evaluator now preserves merge-safe packed board-schedule equivalence for layer-count/thickness signals without treating that as a material-match reopen
  - landed reason:
    - the boundary decision itself was already correct
    - the real adjacent defect was that schedule-equivalent split board entry drifted back to screening-only because packed schedule equivalence was still coupled to material matching
    - superseded on 2026-04-14: the parity lane is now fail-closed with the
      same impact-support posture in canonical and split forms instead of being
      an `FL-24`-anchored low-confidence lane
  - current validation:
    - targeted engine: `2` files, `4` tests, green
    - targeted workbench: `2` files, `2` tests, green
    - selected baseline engine: `4` files, `22` tests, green
    - selected baseline workbench: `4` files, `19` tests, green
    - adjacent engine: `3` files, `267` tests, green
    - adjacent workbench: `3` files, `80` tests, green

- selected next slice after open-web noncanonical continuation parity follow-up:
  - TUAS deferred shortlist drawing audit
  - current reason:
    - the nearby open-web parity debt is now closed without widening solver posture
    - the safest next coverage move is back on the evidence-first floor corridor path
    - the source gap ledger already names the next safe move explicitly:
    - audit `TUAS2023FloorConstructionDrawingsR1.pdf` and `TUAS2023FloorDetails.pdf` against the still-deferred numeric shortlist before importing new rows
    - this keeps the product on the defended exact/bound/product widening path instead of reopening generic raw or steel-family discussions
  - current status:
    - closed
  - landed result:
    - `TUAS2023FloorDetails.pdf` page `5/7` visually confirms the existing `family_a` vs `family_b` split remains correct
    - `R6a` and `R10a` stay deferred because they require mixed board / staged dry-pack surfaces the current exact route cannot encode honestly
    - `R7b`, `R8b`, `R9b`, and `R2c` stay deferred because they require hybrid lower-treatment surfaces outside the defended `family_a` / `family_b` split
    - `R2c` still does not justify any `__none` topology widening
    - the slice therefore closed as docs plus contract tightening, not as a new TUAS import
  - current validation:
    - selected baseline engine: `4` files, `187` tests, green
    - selected baseline workbench: `2` files, `68` tests, green

- selected next slice after TUAS deferred shortlist drawing audit:
  - wall selector shadow-trace audit
  - current reason:
    - the finished TUAS audit produced no honest new open-box import candidate on the current visible-layer surface
    - mixed/history coverage is already materially stronger than earlier in the plan
    - wall remains only partially complete outside the narrow `double_leaf <-> lined_massive_wall` hold corridor
    - the best next accuracy move is therefore selector-trace evidence, not forced floor widening from weak source fit
  - current status:
    - closed
    - stopped at selector-honesty hardening rather than promoted into a second held-family widening
  - pause baseline:
    - engine: `4` files, `23` tests, green
    - workbench: `5` files, `28` tests, green
  - current landed result inside the active slice:
    - `dynamic-calc-branch.ts` no longer hides the defended wall selector boundary behind anchor-only wording
    - the primary route summary now surfaces:
      - ambiguous boundary with runner-up family
      - protected corridor hold when the selected family sits below the runner-up score
      - narrow boundary with conservative hold wording
      - clear settled corridor cases stay compact
    - `dynamic-calc-branch.test.ts` now covers those wall cases directly
    - the next hidden posture turned out to be downstream wording reuse, not a new selector rule:
      - shared airborne validation wording had still collapsed the defended wall boundary into family + confidence + solver spread only
      - corridor dossier, consultant decision trail, output posture, and other downstream wall surfaces inherited that flattened wording
      - the dynamic airborne evidence citation also stayed too compact
    - the active slice now also lands shared secondary parity on those surfaces:
      - validation posture wording carries ambiguous / narrow boundary and protected corridor hold state
      - corridor dossier and consultant decision trail now keep that same posture visible
      - evidence packet and result summary no longer revert to family-plus-confidence shorthand on the defended boundary
  - current validation after that parity patch:
    - selected workbench wall pack after the first parity patch: `5` files, `31` tests, green
    - extended wall honesty pack after the secondary parity patch: `9` files, `49` tests, green
    - selected engine wall isolation pack after the final close-out pass: `4` files, `23` tests, green
    - `pnpm build`: green
    - existing build caveat unchanged:
      - `sharp` / `@img` module-resolution warnings still appear during the web build but do not currently fail the build
  - explicit close-out result:
    - the selected engine/workbench packs still show no second held family pair on the representative non-AAC heavy-core palette
    - no framed multi-candidate boundary surface survives yet
    - no remaining non-advanced user-facing wall surface is currently known to hide runner-up or hold posture
    - keep the defended hold limited to `double_leaf <-> lined_massive_wall` and return to floor work
  - restart protocol:
    - read the live state in [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md) first
    - rerun the selected wall baseline pack before any edit
    - inspect the defended hold corridor tests first:
      - [dynamic-airborne-family-boundary.test.ts](../../packages/engine/src/dynamic-airborne-family-boundary.test.ts)
      - [dynamic-airborne-family-boundary-scan.test.ts](../../packages/engine/src/dynamic-airborne-family-boundary-scan.test.ts)
      - [dynamic-airborne-order-sensitivity.test.ts](../../packages/engine/src/dynamic-airborne-order-sensitivity.test.ts)
      - [dynamic-route-family-boundary.test.ts](../../apps/web/features/workbench/dynamic-route-family-boundary.test.ts)
      - [dynamic-route-family-boundary-scan.test.ts](../../apps/web/features/workbench/dynamic-route-family-boundary-scan.test.ts)
      - [dynamic-calc-branch.test.ts](../../apps/web/features/workbench/dynamic-calc-branch.test.ts)
    - then treat the closed wall truth surface as frozen unless a new trace/scan/parity pack proves a second held family

- selected next slice after wall selector shadow-trace audit:
  - UBIQ open-web corridor decision
  - current reason:
    - the wall selector slice is now closed and no longer blocks floor work
    - remaining TUAS open-box rows need new visible/support surfaces rather than another safe same-package import
    - UBIQ still has one bounded next decision inside explicit support-form reasoning:
      - either a source-backed package variant exists inside the defended `FL-24 -> FL-26 -> FL-28` corridor
      - or, at that historical checkpoint, the honest answer was to keep
        `FL-23/25/27` deferred as the materially weaker band; superseded on
        `2026-04-14` by exact-only correction import
  - current status:
    - closed
  - pause baseline:
    - engine: `3` files, `9` tests, green
    - workbench: `2` files, `63` tests, green
  - current scope:
    - kept explicit open-web support-form reasoning frozen
    - did not auto-import `FL-23/25/27`
    - rechecked corridor-internal package-variant widening vs explicit weaker-band defer
    - current close-out result:
      - no honest new corridor import survived
      - a second official brochure exposes the same open-web FRL/D `2 x 16 mm` package as `FL-26 (FRL/D)` instead of `FL-28 (FRL/D)`
      - that is now frozen as provenance conflict only, not as a widening or runtime rename prompt
  - restart protocol:
    - read the live state in [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md) first
    - rerun:
      - [floor-gap-ledger-contract.test.ts](../../packages/engine/src/floor-gap-ledger-contract.test.ts)
      - [ubiq-candidate-backlog-contract.test.ts](../../packages/engine/src/ubiq-candidate-backlog-contract.test.ts)
      - [floor-widening-candidate-contract.test.ts](../../packages/engine/src/floor-widening-candidate-contract.test.ts)
      - [floor-family-regressions.test.ts](../../apps/web/features/workbench/floor-family-regressions.test.ts)
      - [complex-stack-audit.test.ts](../../apps/web/features/workbench/complex-stack-audit.test.ts)
    - recheck [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) before any widening decision

- selected next slice after UBIQ open-web corridor decision:
  - TUAS open-box support-surface decision
  - current reason:
    - UBIQ is now closed without widening
    - remaining TUAS open-box debt is the first real unresolved coverage blocker again
    - the finished TUAS drawing audit already reduced that debt to two concrete blocker classes:
      - mixed board / staged dry-pack outliers: `R6a`, `R10a`
      - hybrid lower-treatment outliers: `R7b`, `R8b`, `R9b`, `R2c`
  - current status:
    - closed
  - close-out result:
    - the current implementation comparison does not support treating `R6a` and `R10a` as one shared next surface
    - `R6a` is the first promotable candidate because its proxy still sits on the near-corridor `family_archetype` lane
    - `R10a` remained separate staged upper-package debt at that decision point
    - the hybrid branch remains secondary because its proxy already drops to broader `family_general`
  - close-out baseline:
    - engine: `5` files, `18` tests, green
    - workbench: `2` files, `63` tests, green

- selected next slice after the TUAS support-surface decision:
  - TUAS `R6a` mixed-board surface design
  - current status:
    - closed
  - close-out result:
    - exact row `tuas_r6a_open_box_timber_measured_2026` is landed
    - exact visible and predictor surfaces now carry the mixed lower-board schedule `2 x 13 mm + 4 x 15 mm`
    - grouped packed shorthand `26 mm + 60 mm` is now defended on the same exact row
    - lab support remains `Rw` plus `Ln,w`, while `Ln,w+CI` stays unsupported
    - field continuation remains `Ln,w`, `L'n,w`, and `L'nT,w`, while `L'nT,50` stays unsupported
    - the remaining TUAS open-box debt is now `R10a` plus the hybrid lower-treatment branch
  - close-out baseline:
    - engine: `8` files, `318` tests, green
    - workbench: `2` files, `66` tests, green
    - build: green
  - restart protocol:
    - read the live state in [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md) first
    - rerun:
      - [calculate-assembly.test.ts](../../packages/engine/src/calculate-assembly.test.ts)
      - [calculate-impact-only.test.ts](../../packages/engine/src/calculate-impact-only.test.ts)
      - [impact-predictor-input.test.ts](../../packages/engine/src/impact-predictor-input.test.ts)
      - [tuas-support-surface-decision-contract.test.ts](../../packages/engine/src/tuas-support-surface-decision-contract.test.ts)
      - [tuas-candidate-backlog-contract.test.ts](../../packages/engine/src/tuas-candidate-backlog-contract.test.ts)
      - [tuas-post-corridor-screening-contract.test.ts](../../packages/engine/src/tuas-post-corridor-screening-contract.test.ts)
      - [floor-gap-ledger-contract.test.ts](../../packages/engine/src/floor-gap-ledger-contract.test.ts)
      - [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
      - [floor-family-regressions.test.ts](../../apps/web/features/workbench/floor-family-regressions.test.ts)
      - [complex-stack-audit.test.ts](../../apps/web/features/workbench/complex-stack-audit.test.ts)
    - recheck [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) and the TUAS drawing notes before any widening decision

- selected next slice after the TUAS `R6a` mixed-board surface design:
  - TUAS `R10a` staged upper-package surface design
  - current status:
    - closed
  - close-out baseline:
    - engine: `8` files, `324` tests, green
    - workbench: `2` files, `66` tests, green
    - `pnpm build`: green
  - close-out result:
    - exact row `tuas_r10a_open_box_timber_measured_2026` is landed
    - exact visible-layer `floating_screed` material/thickness schedule now carries the source-backed split staged upper package
    - lab support now carries `Rw`, `Ln,w`, and `Ln,w+CI`
    - field continuation now carries `Ln,w`, `L'n,w`, `L'nT,w`, and `L'nT,50`
    - over-abstracted `upper_fill 13 mm` + `dry_floating_gypsum_fiberboard 33 mm` shorthand still remains non-exact on `family_archetype`
    - predictor derivation remains fail-closed on the staged mixed floating-screed package
    - the remaining TUAS open-box debt now narrows to the hybrid lower-treatment branch only
  - restart protocol:
    - read the live state in [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md) first
    - rerun:
      - [calculate-assembly.test.ts](../../packages/engine/src/calculate-assembly.test.ts)
      - [calculate-impact-only.test.ts](../../packages/engine/src/calculate-impact-only.test.ts)
      - [impact-predictor-input.test.ts](../../packages/engine/src/impact-predictor-input.test.ts)
      - [tuas-support-surface-decision-contract.test.ts](../../packages/engine/src/tuas-support-surface-decision-contract.test.ts)
      - [tuas-candidate-backlog-contract.test.ts](../../packages/engine/src/tuas-candidate-backlog-contract.test.ts)
      - [tuas-post-corridor-screening-contract.test.ts](../../packages/engine/src/tuas-post-corridor-screening-contract.test.ts)
      - [floor-gap-ledger-contract.test.ts](../../packages/engine/src/floor-gap-ledger-contract.test.ts)
      - [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
      - [floor-family-regressions.test.ts](../../apps/web/features/workbench/floor-family-regressions.test.ts)
      - [complex-stack-audit.test.ts](../../apps/web/features/workbench/complex-stack-audit.test.ts)
    - recheck [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) and the TUAS drawing notes before any widening decision

- selected next slice after the TUAS `R10a` staged upper-package surface design:
  - TUAS CLT backlog decision
  - current status:
    - closed
  - pause baseline:
    - engine: `8` files, `324` tests, green
    - workbench: `2` files, `66` tests, green
    - `pnpm build`: green
  - current scope:
    - re-rank the deferred TUAS CLT universe against the now-closed TUAS open-box exact corpus
    - freeze the next promotable TUAS CLT candidate and required CLT-family calibration axis
    - keep the hybrid open-box lower-treatment branch secondary unless the CLT decision fails
  - current frozen truth:
    - TUAS open-box exact corpus now numbers `11`
    - the same-family staged upper-package open-box debt is now closed
    - the remaining hybrid open-box proxy still falls to `family_general` at `54%` fit with duplicate `ceiling_cavity`
    - the deferred TUAS CLT set is therefore the narrower next floor decision surface
  - decision result:
    - `X3` is the selected next TUAS CLT import candidate
    - `C3` is the adjacent thicker follow-on once the `X3` surface is landed
    - `X4`, `C4`, and `C5` remain broader heavy dry-top backlog
    - historical checkpoint then: `C2c`, `C3c`, `C4c`, `C7c`, and `C11c` remained combined lower-ceiling backlog
    - historical checkpoint then: `C7` and `C7c` still remained geotextile-dependent backlog
    - current rebaseline truth supersedes this: `C2c`, `C3c`, `C4c`, and `C7c` are exact anchors, `C5c` is predictor-backed, and only `C11c` remains combined lower-ceiling exact-import backlog

- selected next slice after the TUAS CLT backlog decision:
  - TUAS `X3` staged upper CLT surface design
  - current status:
    - closed
  - pause baseline:
    - engine: `9` files, `332` tests, green
    - workbench: `2` files, `68` tests, green
    - `pnpm build`: green
  - current scope:
    - land `X3` as an exact staged-upper CLT row using the already-landed `R10a` material/thickness schedule semantics
    - freeze the adjacent bare-CLT estimate drift caused by the new exact sibling
    - keep combined `c`-family rows and geotextile-dependent rows deferred in the same slice
  - current frozen truth:
    - exact row `tuas_x3_clt140_measured_2026` is now landed
    - source-backed exact lab tuple is now `Ln,w 52`, `Ln,w+CI 52`, `Ln,w+CI,50-2500 60`, `Rw 49`
    - field continuation is now `L'n,w 54`, `L'nT,w 52`, `L'nT,50 60`
    - predictor derivation still stays fail-closed on the staged mixed floating-screed package
    - the nearby bare-CLT visible fallback now admits `tuas_x3` as a third adjacent exact sibling and is frozen at `Ln,w 67.2` / `Rw 40.4`
    - the heavier dry-top `X4` proxy still sits on a broader `family_archetype` lane
    - historical checkpoint then: the simpler combined `C2c` proxy still stayed screening-only with impact outputs unsupported
    - current rebaseline truth supersedes this: `C2c`, `C3c`, and `C4c` are now exact, while `C11c` remains deferred

- selected next slice after the landed TUAS `X3` staged upper CLT surface design:
  - TUAS `C3` staged upper CLT surface design
  - current status:
    - closed
  - pause baseline:
    - engine: `9` files, `335` tests, green
    - workbench: `2` files, `70` tests, green
    - `pnpm build`: green
  - current scope:
    - land `C3` as the thicker staged-upper CLT sibling using the same schedule semantics now proven on `X3`
    - avoid widening combined `c`-family or geotextile-dependent rows in the same slice
    - keep the hybrid open-box support-surface branch secondary unless `C3` fails
  - current frozen truth:
    - `X3` is no longer deferred; it is part of the exact TUAS CLT corpus
    - exact row `tuas_c3_clt260_measured_2026` is now landed
    - source-backed exact lab tuple is now `Ln,w 47`, `Ln,w+CI 49`, `Ln,w+CI,50-2500 53`, `Rw 54`
    - field continuation is now `L'n,w 49`, `L'nT,w 47`, `L'nT,50 53`
    - predictor derivation still stays fail-closed on the staged mixed floating-screed package
    - `X4` is now closed as the first upper-only heavy dry-top exact row
    - `C4` is now the nearest thicker same-surface follow-on
    - `C5` remains broader heavy dry-top backlog
    - historical checkpoint: `C2c/C3c/C4c/C7c/C11c` were still screening-only combined backlog then
    - current rebaseline truth supersedes this: `C2c`, `C3c`, `C4c`, and `C7c` are exact anchors, while `C11c` remains deferred
    - the nearby `C4` heavy dry-top proxy now reranks onto `tuas_x4`, `tuas_c3`, and `tuas_c2` with frozen `family_archetype` fit `82%` and frozen estimate tuple `Ln,w 55.9` / `Rw 51.3`

- selected next slice after the landed TUAS `X4` heavy dry-top CLT surface design:
  - TUAS `C4` heavy dry-top CLT surface design
  - current status:
    - closed
  - pause baseline:
    - engine: `9` files, `347` tests, green
    - workbench: `2` files, `76` tests, green
    - `pnpm build`: green
  - current scope:
    - land `C4` as the thicker heavy dry-top same-surface CLT row without widening a generic dry shortcut
    - avoid widening `C5`, combined `c`-family rows, or geotextile-dependent rows in the same slice
    - keep the hybrid open-box support-surface branch secondary unless `C4` fails
  - current frozen truth:
    - the staged-upper CLT corridor is now closed on both defended carriers:
      - `tuas_x3_clt140_measured_2026`
      - `tuas_c3_clt260_measured_2026`
    - the first heavy dry-top exact row is now also closed:
      - `tuas_x4_clt140_measured_2026`
      - shorthand `generic_fill 50 mm + dry_floating_gypsum_fiberboard 30 mm` still stays off the exact lane at `family_general` `94%` fit against `tuas_x5`
    - the exact thicker same-surface follow-on is now also closed:
      - `tuas_c4_clt260_measured_2026`
      - lab tuple `Ln,w 47`, `Ln,w+CI 49`, `Ln,w+CI,50-2500 53`, `Rw 61`
      - field continuation `L'n,w 49`, `L'nT,w 47`, `L'nT,50 53`
      - shorthand `generic_fill 50 mm + dry_floating_gypsum_fiberboard 30 mm` still stays off the exact lane at `family_general` `94%` fit against `tuas_x5`
    - the immediate unresolved heavier heavy dry-top proxy is now `C5`
    - that proxy currently stays on `family_archetype` at `78.7%` fit
    - current frozen candidate set is `tuas_c4`, `tuas_x4`, `tuas_c3`
    - current frozen estimate tuple is `Ln,w 50` / `Rw 57.9`
    - historical checkpoint: `C2c/C3c/C4c/C7c/C11c` were still screening-only combined backlog then
    - current rebaseline truth supersedes this: `C2c`, `C3c`, `C4c`, and `C7c` are exact anchors, while `C11c` remains deferred

- latest closed slice after the landed TUAS `R2c` hybrid lower no-fill follow-on:
  - TUAS `C7` wet geotextile CLT follow-on
  - current status:
    - closed
  - latest change-adjacent validation:
    - engine: `6` files, `313` tests, green
    - workbench: `1` file, `81` tests, green
    - `pnpm build`: green
  - closed scope:
    - land the already-supported geotextile/screed visible surface as the exact `C7` wet CLT sibling
    - keep combined `c`-family CLT rows and raw widening secondary while that exact row lands
  - current frozen truth:
    - the staged-upper CLT corridor is now closed on both defended carriers:
      - `tuas_x3_clt140_measured_2026`
      - `tuas_c3_clt260_measured_2026`
    - the heavy dry-top corridor is now closed through the heavier same-surface follow-on:
      - `tuas_x4_clt140_measured_2026`
      - `tuas_c4_clt260_measured_2026`
      - `tuas_c5_clt260_measured_2026`
    - `C5` is now landed exactly with:
      - lab `Ln,w 45`, `Ln,w+CI 46`, `Ln,w+CI,50-2500 51`, `Rw 61`
      - field `L'n,w 47`, `L'nT,w 45`, `L'nT,50 51`
    - packed `60 mm` gypsum shorthand still stays exact on `tuas_c5_clt260_measured_2026`
    - generic dry shorthand `generic_fill 50 mm + dry_floating_gypsum_fiberboard 60 mm` still stays off the exact lane at `family_general` `94%` fit against `tuas_x5`
    - under-described combined direct-fixed CLT stacks stay fail-closed because `massTimberCombinedDirectFixedTierHold` blocks profile-mismatched `family_general` reuse when no profile-aligned candidate exists
    - the hybrid decision is now implemented:
      - exact row `tuas_r7b_open_box_timber_measured_2026` is landed with lab `Ln,w 47`, `Ln,w+CI 47`, `Ln,w+CI,50-2500 48`, `Rw 72`
      - field continuation is now `L'n,w 49`, `L'nT,w 46.6`, `L'nT,50 47.6`
      - exact row `tuas_r8b_open_box_timber_measured_2026` is now landed with lab `Ln,w 50`, `Ln,w+CI 49`, `Ln,w+CI,50-2500 50`, `Rw 72`
      - field continuation is now `L'n,w 52`, `L'nT,w 49.6`, `L'nT,50 49.6`
      - exact row `tuas_r9b_open_box_timber_measured_2026` is now also landed with lab `Ln,w 45`, `Ln,w+CI 46`, `Ln,w+CI,50-2500 48`, `Rw 68`
      - field continuation is now `L'n,w 47`, `L'nT,w 44.6`, `L'nT,50 47.6`
      - TUAS drawing page `13/40` is now frozen as the decisive source correction:
        - `R9b` carries `40 mm screed + 3 mm EPS underlay + 8 mm laminate`
        - no extra upper `plastic-layer` or `geotextile` item is present on that top package
      - the old separator-free proxy still stays `family_general` `54%` fit, but it is now re-ranked to `tuas_r9b`, `tuas_r7b`, `tuas_r7a` at `Ln,w 48.3`, `Ln,w+CI 49.2`, and `Rw 67.3`
      - exact row `tuas_r2c_open_box_timber_measured_2026` is now also landed with lab `Ln,w 70`, `Ln,w+CI 70`, `Ln,w+CI,50-2500 70`, `Rw 54`
      - field continuation is now `L'n,w 72`, `L'nT,w 69.6`, `L'nT,50 69.6`
      - the no-fill hybrid lower-treatment branch is now closed without reopening a generic `__none` topology lane
    - the wet geotextile CLT follow-on is now also closed:
      - TUAS drawing page `24/40` freezes `C7` as:
        - `260 mm` CLT
        - `35 mm` EPS
        - `1 mm` geotextile
        - `40 mm` screed
        - `3 mm` EPS underlay
        - `8 mm` laminate
      - exact row `tuas_c7_clt260_measured_2026` is now landed with rebaselined lab `Ln,w 39`, `Ln,w+CI 40`, `Ln,w+CI,50-2500 42`, `Rw 57`
      - field continuation is now `L'n,w 41`, `L'nT,w 39`, `L'nT,50 42`
      - the previous `family_general` `54%` proxy is now retired on the true source-backed stack
    - historical checkpoint: `C2c/C3c/C4c/C7c/C11c` were still screening-only combined backlog then
      - current rebaseline truth supersedes this: `C2c`, `C3c`, `C4c`, and `C7c` are exact anchors, while `C11c` remains deferred

- latest closed slice after the remaining combined TUAS CLT source-schedule research and `C2c` exact landing:
  - `tuas_clt_remaining_combined_source_schedule_research_v1`
  - current status:
    - closed
  - current result:
    - TUAS drawing pages `25/40` through `30/40` now freeze the real visible schedules for `C2c/C3c/C4c/C5c/C7c/C11c`
    - `C2c` is now landed exactly as `tuas_c2c_clt260_measured_2026`
      - lab: `Ln,w 35`, `Ln,w+CI 39`, `Ln,w+CI,50-2500 44`, `Rw 70`
      - field: `L'n,w 37`, `L'nT,w 35`, `L'nT,50 44`
    - `C5c` remains predictor-backed rather than promoted into a direct source-schedule exact row
    - the remaining drawing-backed combined backlog is now explicit:
      - historical checkpoint then: `C3c`, `C4c`, `C7c`, and `C11c` stayed screening-only / impact-unsupported
      - current rebaseline truth supersedes this: `C3c`, `C4c`, and `C7c` are now exact, while `C11c` remains screening-only / impact-unsupported
      - `C11c` is now known to be a wet `30 mm glass wool + geotextile + 40 mm screed` stack, not the old shorthand proxy
    - two adjacency regressions were found and re-closed in the same slice:
      - Dataholz dry combined predictor input briefly blended `tuas_c2c`; specific CLT dry-family lineage is now source-filtered back to Dataholz-only
      - CLT `lower_only` briefly reopened through `C2c`; mass-timber CLT `lower_only` family estimation is now fail-closed again

- latest closed slice after the `C7c` exact landing plus combined-CLT route re-close:
  - `tuas_c7c_combined_wet_clt_surface_design_v1`
  - current status:
    - closed
  - current result:
    - `C7c` is now landed exactly as `tuas_c7c_clt260_measured_2026`
      - lab: `Ln,w 30`, `Ln,w+CI 35`, `Ln,w+CI,50-2500 44`, `Rw 75`
      - field: `L'n,w 32`, `L'nT,w 30`, `L'nT,50 44`
    - `C3c` is now exact after the decision-matrix pass; `C4c/C11c` remain screening-only after the `C7c` landing
    - the exact landing initially reopened `C3c/C4c/C11c` through shorthand normalization, but the root cause is now closed:
      - combined CLT visible stacks with lower treatment plus multi-entry `floating_screed` no longer auto-normalize into inferred or predictor-derived shorthand lanes
      - the same surface now stays fail-closed on both engine and workbench routes
    - closest-family warning posture also reranked honestly:
      - `C3c/C4c` now warn toward `C7c`, not `C2c`

- selected next slice after the closed `C7c` pass:
  - `tuas_remaining_combined_clt_exact_import_decision_matrix_v1`
  - current status:
    - closed
  - current scope:
    - audit `C3c/C4c/C11c` one row at a time as pure exact-import candidates
    - keep the new combined-CLT inference/predictor fail-closed guard frozen while that audit runs
    - only promote the next row if it does not reopen shorthand aliasing or broader family widening
  - current result:
    - `C3c` is now landed exactly as `tuas_c3c_clt260_measured_2026`
      - lab: `Ln,w 27`, `Ln,w+CI 29`, `Ln,w+CI,50-2500 43`, `Rw 73`
      - field: `L'n,w 29`, `L'nT,w 27`, `L'nT,50 43`
    - source correction: TUAS drawing page `26/40` shows `13 mm gypsum board + 2 x 15 mm gypsum board`, not the stale `13 mm glass wool` upper-fill proxy
    - `C4c` remains deferred with source truth `Ln,w 24`, `Ln,w+CI 26`, `Ln,w+CI,50-2500 40`, `Rw 74`
    - `C11c` remains deferred with source truth `Ln,w 59`, `Ln,w+CI 60`, `Ln,w+CI,50-2500 60`, `Rw 74`
    - exact split parity now accepts only merge-safe contiguous same-role/same-material packed thickness equivalents, so mixed-material schedules still need explicit exact rows
  - original reason:
    - the remaining gap is no longer source discovery; it is exact-import discipline
    - `C7c` is already the wet combined anchor, `C5c` is already the predictor-backed dry combined anchor, and `C2c` is already the lower-ceiling exact anchor
    - the next matrix must use the rebaselined truth:
      - `C2c`: `Ln,w 35`, `Ln,w+CI 39`, `Ln,w+CI,50-2500 44`
      - `C5c`: predictor-backed `Ln,w 38`, `Ln,w+CI 42`, `Ln,w+CI,50-2500 44`
      - `C7c`: `Ln,w 30`, `Ln,w+CI 35`, `Ln,w+CI,50-2500 44`
    - the first decision is now closed with `C3c`; the remaining honest decision is `C4c` first, with `C11c` held for a separate wet-stack anomaly audit

- selected next slice after the closed `C3c` decision-matrix import:
  - `tuas_c4c_combined_heavy_dry_exact_candidate_v1`
  - current status:
    - closed
  - current scope:
    - land `C4c` only if its page `27/40` stack can be encoded as a pure exact row without reopening shorthand aliases
    - preserve the current `C3c`, `C2c`, `C5c`, and `C7c` anchors
    - keep `C11c` deferred unless a dedicated wet-stack audit explains its weaker impact tuple
  - current result:
    - `C4c` is now landed exactly as `tuas_c4c_clt260_measured_2026`
      - lab: `Ln,w 24`, `Ln,w+CI 26`, `Ln,w+CI,50-2500 40`, `Rw 74`
      - field: `L'n,w 26`, `L'nT,w 24`, `L'nT,50 40`
    - the C4c landing exposed and re-closed a route-control edge:
      - under-described combined CLT lower board/fill stacks without explicit `ceiling_cavity` remain fail-closed even though profile-aligned `C4c` now exists

- selected next slice after the closed `C4c` exact-candidate pass:
  - `tuas_c11c_wet_stack_anomaly_audit_v1`
  - current status:
    - selected
  - current scope:
    - audit the source and frequency behavior behind `C11c` before any exact import
    - keep `C11c` screening-only unless the weak wet-stack tuple is explained
    - preserve `C2c`, `C3c`, `C4c`, `C5c`, `C7`, and `C7c` route anchors while auditing

- wider-than-first raw concrete ceiling-helper permutations:
  - the first wider helper-side cohort is now defended:
    - split cavity helper packages
    - split fill-plus-cavity helper packages
    - mixed-order helper package with terminal-base concrete
    - disjoint `board + fill + board + cavity + concrete` helper package
    - route/card parity on those same variants
    - top-side finish negative showing that helper-side reopening closes again once concrete is no longer terminal
  - still open:
    - board-only plus fill/cavity permutations across more thickness pairs
    - non-contiguous or mixed-order helper variants beyond the first widened split cohort
- wider inferred floor-family rows:
  - additional CLT, composite, and hollow-core inferred packages beyond the current first cohort
  - ceiling-side inferred packages that should still stay closed
- negative guards around raw heavy hybrids:
  - the first helper-fill wall-like heavy hybrid guard is now defended
  - helper-heavy lightweight-steel raw rows are now also defended as fail-closed on the adjacent stress surface
  - the second widened negative pass is now also defended:
    - broader concrete-plus-board hybrids that infer ceiling-board shapes but should still remain screening-only / field-`Rw` closed
    - helper-heavy steel-joist rows that must not inherit the concrete reopening rule
  - closed follow-up:
    - open-web helper-heavy noncanonical rows now have both the direct boundary
      posture and the first broader parity surface defended
- broader mixed floor/wall generated grids:
  - second-pass implementation review on 2026-04-14 confirmed the broad generated
    family grids already exist on both web and engine routes
  - the follow-up no-widening output-card snapshot guard is now also closed by
    `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`
  - the grid now pins full user-facing output-card status/value snapshots across
    direct split detours, replayed mixed histories, partial-edit restore, and
    save/load roundtrips
- `R7a` upper-EPS branch-design slice is now closed:
  - exact-only row is landed with a dedicated `eps_floor_insulation_board` surface
  - near-miss `generic_fill + screed` negatives are defended
  - selector negatives now keep non-dry upper packages off the `R2b` basic archetype
  - inference negatives now keep the new insulation-board material on `upper_fill` rather than `ceiling_fill`
  - residual caution:
    - do not use the nearby direct-fixed CLT screening contract as evidence for a broader combined-family widening

### Likely Code Touch Surface

Primary likely code touch surface:

- [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
  - if same-family widening or tightening is required
- [predictor-floor-system-estimate.ts](../../packages/engine/src/predictor-floor-system-estimate.ts)
  - if predictor-side family deviation tightening is needed
- [calculate-assembly.ts](../../packages/engine/src/calculate-assembly.ts)
  - if a future drift lands specifically in screening-anchored airborne companions on otherwise stable floor-system matches
- [floor-system-materials.ts](../../packages/catalogs/src/materials/floor-system-materials.ts)
  - if the landed `eps_floor_insulation_board` surface needs extension or a sibling rigid-insulation surface is introduced
- [impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
  - if the landed upper-EPS material or a sibling rigid-insulation surface needs explicit `upper_fill` inference and predictor-class roundtripping
- [floor-system-match.ts](../../packages/engine/src/floor-system-match.ts)
  - if the remaining `gdmtxa04a` boundary decision revisits manual visible exact eligibility instead of keeping that row estimate-only
- [predictor-published-family-estimate.ts](../../packages/engine/src/predictor-published-family-estimate.ts)
  - if the open-box published-family selector must be narrowed so non-dry upper packages stop collapsing onto the basic archetype
- [workbench-store.ts](../../apps/web/features/workbench/workbench-store.ts)
  - if workbench role inference must keep rigid floor-insulation boards on `upper_fill` rather than `ceiling_fill`
- [normalize-rows.ts](../../apps/web/features/workbench/normalize-rows.ts)
  - if split/merged rigid upper-insulation layers need solver-boundary collapse parity beyond the landed `R7a` surface
- [floor-system-ratings.ts](../../packages/engine/src/floor-system-ratings.ts)
  - only when rating derivation itself changes
- [floor-role-topology.ts](../../packages/engine/src/floor-role-topology.ts)
  - only when the torture pass proves a raw-role interpretation problem

Avoid these until evidence forces them:

- broad generic lightweight-floor fallback rules
- universal raw-layer canonicalization
- new unsupported floor-carrier exposure shortcuts

### Floor Families That Still Need Deliberate Decisions

- bare open-box timber:
  - still fail-closed on impact field outputs
  - should only open if TUAS measured rows defend a narrow same-family lane
- bare open-web steel:
  - still fail-closed on impact field outputs
  - should only open from official or measured same-family evidence
- remaining TUAS corridor questions:
  - note:
    - `R6b` is now landed as an exact reinforced lower-treatment `b` branch
    - `R7a` is now landed as an exact-only heavy/wet `a` branch with an honest upper-EPS-board surface
    - the remaining work is no longer this branch design; it is choosing the next evidence-led corridor after the TUAS open-box shortlist
- remaining Dataholz CLT manual-match boundary question:
  - `dataholz_gdmtxa04a_clt_lab_2026` remains the only imported exact-only CLT row
  - it stays estimate-routed today because `manualMatch: false` keeps it outside predictor exact resolution
  - any future reopen must prove an honest visible surface and an honest predictor surface together; it is not another straight wet/fill exact fingerprint
- deferred weaker UBIQ corridor rows:
  - `FL-23`
  - `FL-25`
  - `FL-27`

## 7. Shared Torture-Pass Plan

This is now the next major cross-cutting work item.

### Goal

Prove that the dynamic calculator stays physically honest and numerically stable under difficult operator behavior:

- deep layer counts
- duplicate packages
- adjacent swaps
- split/merge edits
- reset and partial-edit cycles
- mixed floor/wall stacks that look similar but should route differently

### Required Matrix Shapes

At minimum:

- `8+` layer wall hybrids
- `8+` layer floor hybrids
- mixed dry/wet floor packages
- ceiling-only vs upper-only floor variants
- heavy-core wall plus light-lining variants
- duplicate package replay
- adjacent swap scans
- move-up / move-down edit chains
- partial delete and rebuild chains

### Required Surfaces

Every new torture pack should touch both:

- engine route
- workbench route

Current shipped mixed-torture surface:

- engine:
  - [mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts)
  - [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
- route:
  - [mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts)
  - [mixed-study-mode-generated-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts)
  - [mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts)
  - [mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts)

What this already covers:

- alternating floor/wall study-mode switches
- representative deep floor exact/bound rows
- representative deep wall hybrid rows
- neutral split-detour parity
- first generated direct-vs-edit-history parity
- first wider generated duplicate/swap grid
- complementary generated duplicate/swap/rebuild history-grid variants across
  ascending/direct/trailing and descending/reversed/leading paths
- first deterministic longer cross-mode chain with partial-edit abort, restore, and save/load roundtrip
- second wall-family seeded cross-mode chain coverage through concrete-wall
  split/reorder/edit detours at the saved-scenario retention boundary
- broader support-bucket/card sanity after cross-mode edit chains
- TUAS `C11c` combined wet fail-closed stack through generated engine and route
  mixed grids
- Dataholz `GDMTXA04A` manual-match boundary stack through generated engine and
  route mixed grids
- split, duplicate/swap/remove/rebuild, cross-mode partial-edit, and save/load
  parity on those two high-risk floor boundary surfaces

What it does not yet cover:

- broader seeded cross-mode edit-chain families beyond the current second
  wall-family expansion
- wider mixed floor/wall duplicate-swap grids beyond the current complementary
  generated history-grid variants
- any wider preset-family expansion that still proves necessary after those chains and swap grids

And should check both:

- numeric delta behavior
- support posture / warnings / confidence posture

Closed slice:

- slice id: `mixed_boundary_floor_torture_expansion_v1`
- workstream: `7` shared torture-pass expansion
- status: `closed`
- landed scope:
  - added the known TUAS `C11c` source schedule to the generated mixed matrix as
    a fail-closed floor boundary case
  - added the Dataholz `GDMTXA04A` manual-match boundary stack to the generated
    mixed matrix as a preset-only / estimate-routed boundary case
  - propagated both surfaces through engine generated split parity and workbench
    generated split, edit-history, long-chain, and save/load parity
- explicit non-landed scope:
  - no exact row import
  - no catalog row change
  - no generic CLT widening
  - no C11c impact reopen
  - no manual visible exact reopen for `GDMTXA04A`
- validation:
  - engine generated matrix: `1` file, `1` test, green
  - workbench generated matrix/edit-history/history-grid pack: `3` files, `5`
    tests, green
  - engine typecheck: green
  - stable full engine suite: `93` files, `757` tests, green
  - repository build: green

Closed slice:

- slice id: `mixed_history_grid_variant_expansion_v1`
- workstream: `7` shared torture-pass expansion
- status: `closed`
- landed scope:
  - widened the generated mixed workbench history grid from two to four
    complementary duplicate/swap/rebuild variants
  - added ascending direct trailing rebuild and descending reversed leading
    rebuild paths beside the existing ascending reversed leading and descending
    direct trailing paths
  - kept the same generated floor/wall case set under direct final-row parity,
    longer cross-mode partial-edit restore chains, and save/load roundtrips
- explicit non-landed scope:
  - no acoustic solver behavior change
  - no catalog row change
  - no selector change
  - no workbench store behavior change
- targeted validation:
  - workbench generated history grid: `1` file, `3` tests, green
  - workbench generated matrix/edit-history/history-grid pack: `3` files, `5`
    tests, green
  - engine generated matrix: `1` file, `1` test, green
  - engine typecheck: green
  - stable full engine suite: `93` files, `757` tests, green
  - repository build: green

Closed slice:

- slice id: `mixed_seeded_cross_mode_wall_family_expansion_v1`
- workstream: `7` shared torture-pass expansion
- status: `closed`
- landed scope:
  - added a second wall-family detour to the representative mixed torture
    save/load chain
  - the new concrete-wall detour splits rockwool and concrete layers, reorders
    the split layers, changes the lining board, saves the scenario, and checks
    reload parity at the saved-scenario retention boundary
  - kept the existing deep-hybrid wall detour in the same chain while alternating
    it with the concrete-wall detour between seeded floor-family detours
- explicit non-landed scope:
  - no acoustic solver behavior change
  - no catalog row change
  - no selector change
  - no workbench store behavior change
- targeted validation:
  - workbench mixed torture file: `1` file, `3` tests, green
  - workbench mixed/generated plus seeded edit-stability pack: `6` files, `10`
    tests, green
  - engine mixed pack: `2` files, `2` tests, green
  - engine typecheck: green
  - stable full engine suite: `93` files, `757` tests, green
  - repository build: green

### Test Pattern Requirements

Each new torture-pass change should add more than one test shape:

- one exact anchor
- one generated scan
- one edit-sequence or route-parity test

That keeps the suite from becoming overly optimistic around a single hand-picked stack.

### Recently Closed Route-History Slice And Current Source-Led Guard

- slice id: `mixed_floor_wall_seeded_route_history_expansion_v1`
- status: closed and committed for the first heavy-composite wall target
- why it ran before source widening:
  - the latest floor source-led guard pack and companion-semantics pack are
    green
  - defended floor/wall corridors have no active known solver blocker
  - the next-phase definition of done still requires mixed-stack torture
    coverage beyond the first deterministic longer chain and first
    complementary generated duplicate/swap grid
  - a test-first route-history pass is lower risk than opening another solver
    widening lane immediately
- minimum useful scope:
  - add one broader seeded family chain
  - add one wider generated duplicate/swap or edit-history matrix
  - include route/card/support-bucket parity checks for the newly covered mixed
    histories
- selected first concrete target:
  - added the heavy-composite wall shape from the existing wall instability
    contracts as a third wall-family route-history surface:
    - concrete
    - pumice block
    - air gap
    - gypsum board
    - concrete
  - mirrored it in both generated helpers:
    - [mixed-floor-wall-generated-test-helpers.ts](../../packages/engine/src/mixed-floor-wall-generated-test-helpers.ts)
    - [mixed-study-mode-generated-test-helpers.ts](../../apps/web/features/workbench/mixed-study-mode-generated-test-helpers.ts)
  - added the seeded save/load chain coverage in
    [mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts)
  - validation:
    - pre-edit engine mixed pack: `2` files, `2` tests, green
    - pre-edit web mixed pack: `6` files, `10` tests, green
    - post-edit engine mixed pack: `2` files, `2` tests, green
    - post-edit focused web mixed pack: `4` files, `8` tests, green
    - post-edit full web mixed pack: `6` files, `10` tests, green
    - engine typecheck: green
    - web typecheck: green with the known Next.js TypeScript plugin
      recommendation
    - full engine suite: `96` files, `780` tests, green
    - repository build: green with the known `sharp/@img` optional-package
      warnings through `proposal-docx` and the Next.js TypeScript plugin
      recommendation
- implementation rule:
  - do not change solver behavior until a new test exposes a classified failure
  - classify every red as solver drift, support-surface drift, stale fixture, or
    intentionally unsupported/fail-closed behavior
- implemented optional second target:
  - after the heavy-composite wall route stayed green, the open-box
    finish-tolerance boundary was added as
    `open_box_finish_tolerance_mixed_history_boundary_v1`
  - `12 mm` laminate plus `3 mm` EPS open-box walking finish remains
    impact-unsupported through split/save-load/floor-wall history
  - current decision: closed
- current source-led follow-up:
  - `dataholz_clt_source_truth_audit_v1` is now closed as a no-widening guard
  - all imported Dataholz CLT rows have answer-measuring engine tests for
    catalog source truth, official-id field continuations, visible route posture,
    contiguous split stability, and disjoint-role fallback behavior
  - exact dry CLT and `GDMTXA04A` visible route/card surfaces now have workbench
    tests
  - `GDMTXA04A` remains estimate-routed through
    `dataholz_gdmtxa01a_clt_lab_2026`; no solver/catalog behavior changed
  - validation:
    - engine source/raw pack: `5` files, `16` tests, green
    - workbench route/raw pack: `4` files, `7` tests, green
    - engine and web typechecks: green
    - full engine suite: `97` files, `785` tests, green
- implemented follow-on after this checkpoint:
  - `raw_concrete_helper_permutation_answer_guard_v1`
  - umbrella: `floor_raw_inference_source_led_widening_v1`
  - reason: the raw terminal-concrete plus ceiling-helper corridor was already
    open and guarded for support buckets, but it needed explicit answer
    snapshots across wider helper permutations before any broader raw-floor
    widening could be justified
  - result:
    - no solver, catalog, selector, or workbench runtime behavior changed
    - engine guard now pins answer snapshots for wider terminal-concrete helper
      permutations plus top-finish, wall-like hybrid, and steel-joist negatives
    - workbench guard now pins route/card status and values for the same
      representative shapes
    - engine raw/source pack: `5` files, `14` tests, green
    - workbench raw/source pack: `5` files, `7` tests, green
    - engine and web typechecks: green
    - full engine suite: `98` files, `786` tests, green
- implemented follow-on after that guard:
  - `wall_selector_wider_trace_matrix_v1`
  - no solver, catalog, selector, floor-support, or workbench runtime behavior
    changed
  - engine/workbench matrix tests now pin settled wall families, the defended
    `double_leaf <-> lined_massive_wall` hold, non-AAC heavy-core controls, and
    a strong framed control
  - selector/boundary adjacent packs and engine/web typechecks are green
- deferred follow-on options after that checkpoint:
  - re-ranked source-led raw-floor widening, one carrier/output surface at a
    time
  - `clt_local_combined_interaction_evidence_v1`
  - wall selector behavior only if a future trace exposes a classified red

## 8. Definition Of Done For The Next Phase

The next phase is only complete when all of these are true:

1. standard wall corridor still stays green
2. standard floor corridor still stays green
3. wall and floor output-card parity packs still stay green
4. mixed-stack torture coverage stays green across the broad generated family
   grid already verified on 2026-04-14:
   - `32` web route cases
   - `32` engine route cases
   - duplicate/swap/remove/rebuild paths
   - partial-edit plus cross-mode restore paths
   - save/load roundtrips
   The explicit output-card status/value snapshot parity guard across that
   existing grid is now implemented and target-green; do not create another
   broad family grid unless a future classified red shows a missing route shape.
5. no new widening has been merged without source-backed or benchmark-backed evidence
6. every newly opened lane is labeled honestly on route and export surfaces
7. any new red route-surface contract is first classified as solver, support-bucket, or stale-surface drift before logic changes are proposed

## 9. Recommended Execution Order

Do this in order:

1. keep the rebaselined TUAS floor baseline and `pnpm build` green
2. use `tuas_floor_source_truth_rebaseline_v1` as the active numeric source of truth before any new exact import
3. keep `C4c` frozen as exact `tuas_c4c_clt260_measured_2026`; `C2c`, `C3c`, `C4c`, and `C7c` are already exact anchors, and `C5c` is already predictor-backed
4. keep under-described combined direct-fixed CLT stacks deferred against the exact anchors unless the source row is imported deliberately
5. keep `C11c` deferred after `tuas_c11c_wet_stack_anomaly_audit_v1` unless source correction or frequency-level evidence explains the weak tuple
6. keep the closed `mixed_floor_wall_seeded_route_history_expansion_v1` first
   heavy-composite target frozen; keep the now-closed open-box mixed-history
   boundary frozen as its own no-widening store-history/card guard
7. keep `dataholz_clt_source_truth_audit_v1` frozen as the latest source-led
   no-widening guard before any broad raw-floor widening
8. keep `raw_concrete_helper_permutation_answer_guard_v1` frozen as the latest
   no-widening answer guard:
   - numeric answers for terminal concrete helper permutations are pinned, not
     only finite outputs or supported-output lists
   - adjacent negatives for top-side finish after concrete, wall-like heavy
     hybrids, and weaker carriers remain in the validation pack
9. keep `wall_selector_wider_trace_matrix_v1` frozen as the latest
   no-widening wall-selector evidence checkpoint:
   - settled wall families, the currently held
     `double_leaf <-> lined_massive_wall` boundary, non-AAC heavy-core controls,
     and a strong framed control are now pinned on engine and workbench surfaces
   - no behavior bug was exposed, so do not change wall selector math from this
     checkpoint alone
   - `dynamic-airborne.ts` is already large, so any future selector behavior or
     refactor work must be split from trace-only checkpoints
10. keep `raw_floor_hostile_input_answer_matrix_v1` frozen as the latest
    raw-floor hostile-input guard:
    - long split terminal-concrete helper answers are pinned as live where
      supported
    - concrete that is no longer terminal keeps requested field `Rw`
      unsupported
    - open-web helper-heavy and fragmented CLT lower-only raw stacks stay
      fail-closed on impact outputs
11. keep `ubiq_open_web_packaged_lane_trace_matrix_v1` frozen as the latest
    UBIQ packaged lower-lane guard:
    - canonical, raw split, and tagged split open-web lower packages stay on
      `family_general` at `59.3%` fit
    - reordered lower-package input stays live but is pinned as
      `low_confidence` at `29%` fit
    - this is not permission to open bare open-web raw carrier support
12. re-rank candidates before selecting the next behavior slice:
    - explicit CLT-local combined-interaction work remains source/frequency
      evidence-led
    - true raw-floor inference widening remains one carrier/output surface at a
      time
    - wall selector behavior work needs a fresh classified red or a separate
      evidence-backed behavior plan
13. keep `gdmtxa04a` estimate-only until a future source-backed material surface exists
14. keep the now-closed `source_gap_candidate_research_re_rank_v1` frozen:
    - Dataholz `GDMTXA04A`, TUAS `C11c`, and raw bare open-box/open-web impact
      candidates remain deferred
    - the selected UBIQ weak-band guard is now closed:
      `ubiq_open_web_weaker_band_posture_guard_v1`
    - runtime widening is still blocked until the follow-up
      `ubiq_weak_band_exact_import_source_mapping_v1` lands or is explicitly
      superseded

2026-04-14 re-rank and implementation result:

- second-pass implementation review verified that the broader generated mixed
  route-history grid already exists:
  - `32` generated web route cases
  - `32` generated engine route cases
  - targeted web mixed pack: `3` files / `5` tests green on 2026-04-14
  - targeted engine mixed pack: `2` files / `2` tests green on 2026-04-14
- therefore the selected no-widening implementation slice was
  `mixed_floor_wall_output_card_snapshot_grid_v1`
- it is now implemented and target-green:
  - focused card grid: `1` file / `2` tests green
  - adjacent web mixed pack including the new guard: `4` files / `7` tests green
  - adjacent engine mixed pack: `2` files / `2` tests green
  - web and engine typechecks green
  - focused new-file ESLint green
- it pins user-facing output-card status/value snapshots across direct and
  replayed mixed histories before any behavior widening
- it remains no-widening; no solver/catalog/selector/support/runtime behavior
  changed
- the next selected planning slice was
  `source_gap_candidate_research_re_rank_v1`
- it supersedes older historical wording that says the open-box mixed-history
  boundary is still deferred or that the broad generated mixed grid still needs
  to be created
- follow-up source re-rank result:
  - `source_gap_candidate_research_re_rank_v1` is now implemented with
    `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - focused source re-rank contract: `1` file / `3` tests green
  - selected next slice at that checkpoint:
    `ubiq_open_web_weaker_band_posture_guard_v1`
  - Dataholz `GDMTXA04A`, TUAS `C11c`, and raw bare open-box/open-web impact
    remain deferred; UBIQ `FL-23/25/27` gets no-runtime posture tests before any
    exact/bound import decision
- UBIQ weak-band posture guard result:
  - `ubiq_open_web_weaker_band_posture_guard_v1` is now implemented with:
    - `packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts`
    - `apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`
  - focused engine posture guard: `1` file / `3` tests green
  - focused workbench card posture guard: `1` file / `1` test green
  - narrow runtime behavior changed so open-web upper-only weak-band packages no
    longer borrow `FL-24/26/28` lower-treatment impact estimates
  - follow-up exact import result:
    `ubiq_weak_band_exact_import_source_mapping_v1` imported `54` exact-only
    `FL-23/25/27` rows, corrected `FL-24` to the resilient lower-treatment
    topology, and made `FL-24` exact-only so raw/split lower-only helper stacks
    do not borrow it as a low-confidence continuation
  - supported-band exact completion result:
    `ubiq_open_web_supported_band_finish_completion_v1` imported `36`
    supported resilient-band exact rows across bare INEX and timber + acoustic
    underlay, then `impact_lnw_plus_ci_bound_surface_v1` imported the `18`
    supported carpet rows as honest `Ln,w+CI <=45` bound support
  - follow-up report/reference result:
    `bound_metric_report_surface_completion_v1` closed the remaining combined
    bound wording/math gap on report, Dutch reference, guide, and product-bound
    surfaces
  - follow-up history/hostile-input result:
    `ubiq_lnw_plus_ci_bound_history_guard_v1` closed the first UBIQ
    combined-bound route-history gap:
    - source-equivalent split/reordered stacks stay on the official
      `Ln,w+CI <=45` bound
    - malformed near-misses stay off official bound provenance
    - workbench duplicate/split/reorder/save-load and floor/wall detours keep
      official bound cards stable
    - final broad validation is green: catalog/engine/web typecheck and lint,
      full engine `109` files / `813` tests, full web `104` files / `620`
      tests, `pnpm build`, and `git diff --check`
  - follow-up near-miss posture result:
    `ubiq_lnw_plus_ci_near_miss_estimate_posture_decision_v1` closed the
    remaining UBIQ combined-bound false-confidence gap:
    - malformed open-web + carpet/foam combined-bound stacks now fail closed
      for impact outputs after official `Ln,w+CI <=45` bound matching falls off
    - derived predictor fallback no longer borrows nearby bare/timber
      `FL-24/26/28` rows for those malformed stacks
    - targeted engine near-miss/bound pack is green at `3` files / `7` tests
    - targeted workbench near-miss/history/report pack is green at `3` files /
      `5` tests
    - final broad validation after the follow-up source-gap matrix is green:
      catalog/engine/web typecheck and lint, full engine `111` files / `821`
      tests, full web `106` files / `627` tests, `pnpm build`, and
      `git diff --check`
  - follow-up remaining-source-gap posture result:
    `remaining_source_gap_posture_matrix_v1` closed the next no-widening
    matrix:
    - `C11c` stays deferred / impact-fail-closed
    - `GDMTXA04A` stays estimate-only instead of exact-reopened
    - raw bare open-web/open-box impact and helper-only timber/open-web
      negatives remain deferred
    - targeted engine matrix is green at `1` file / `6` tests
    - targeted workbench card matrix is green at `1` file / `6` tests
  - follow-up source-evidence re-rank result:
    `raw_bare_open_web_open_box_source_evidence_re_rank_v1` is implemented as
    a no-runtime source contract
    - TUAS open-box evidence is packaged measured systems, not raw bare carrier
      impact evidence
    - UBIQ open-web evidence is INEX / finish / resilient-ceiling system-table
      evidence, not raw bare carrier impact evidence
    - raw bare open-web/open-box impact remains fail-closed
    - validation is green: targeted engine source-evidence contract `1` file /
      `3` tests; full engine `112` files / `824` tests; engine typecheck/lint;
      `git diff --check`
	  - follow-up packaged open-box design guard:
	    `tuas_open_box_same_package_fragmentation_design_v1` is implemented as a
	    no-runtime generated route/card guard
    - all `15` imported TUAS open-box exact rows preserve exact id, source
      values, field continuations, support buckets, and workbench card
      statuses/values under source-equivalent contiguous fragmentation
	    - final validation is green: targeted engine/workbench guards `1` file /
	      `2` tests each; full engine `113` files / `826` tests; full web `107`
	      files / `629` tests; engine/web typecheck and lint; `pnpm build`;
	      `git diff --check`

	  - follow-up UBIQ packaged open-web finish-family guard:
	    `ubiq_open_web_packaged_finish_family_design_v1` is implemented as a
	    no-runtime generated exact/bound route-card guard
	    - all `90` UBIQ open-web exact rows and all `21` UBIQ open-web bound rows
	      preserve exact/bound source ids, metric basis, support buckets, and
	      workbench card statuses/values under source-equivalent contiguous
	      fragmentation
	    - weak-band carpet rows stay exact-only; supported-band carpet rows stay
	      `Ln,w+CI <=45` bound-only
	    - final validation is green: targeted engine `1` file / `3` tests;
	      targeted workbench `1` file / `2` tests; full engine `114` files /
	      `829` tests; full web `108` files / `631` tests; engine/web typecheck
	      and lint; `pnpm build`; `git diff --check`

	  - follow-up UBIQ packaged open-web near-miss/drop-off matrix:
	    `ubiq_open_web_packaged_finish_near_miss_matrix_v1` is implemented as a
	    no-runtime generated route/card guard
	    - representative weak-band exact-only, supported-band exact, and
	      supported-band `Ln,w+CI <=45` bound packages now pin source-critical
	      deck/board/fill drift and valid finish switches
	    - source-critical mismatches do not retain official exact/bound provenance
	    - final validation is green: targeted engine `1` file / `1` test;
	      targeted workbench `1` file / `1` test; full engine `115` files /
	      `830` tests; full web `109` files / `632` tests; engine/web typecheck
	      and lint; `pnpm build`

	  - follow-up UBIQ packaged open-web history-replay matrix:
	    `ubiq_open_web_packaged_finish_history_replay_matrix_v1`
	    is implemented as a no-runtime workbench store/history guard
	    - weak carpet exact, supported carpet bound, extra-board near-miss,
	      carpet-to-timber valid switch, and timber wrong-deck fallback routes
	      survive duplicate/split/reorder/save-load and floor/wall detours
	    - official exact/bound provenance is retained only for source-equivalent
	      and valid-switch histories; source-critical near-misses remain off
	      official exact/bound provenance
	    - validation is green: targeted workbench `1` file / `1` test; adjacent
	      UBIQ web pack `3` files / `4` tests; full engine `115` files / `830`
	      tests; full web `110` files / `633` tests; engine/web typecheck and
	      lint; `pnpm build`; `git diff --check`

	  - selected next planning slice:
	    `post_ubiq_source_gap_re_rank_v1`
	  - selected immediate no-runtime action:
	    `post_ubiq_source_gap_decision_matrix_v1`
	    - refresh the executable source-gap selector after the UBIQ weak-band and
	      packaged open-web work has been committed
	    - keep runtime widening candidates closed until the refreshed matrix
	      names one route family and output surface
	  - closed no-runtime research action:
	    `tuas_c11c_frequency_source_recheck_v1`
	    - audit the one remaining deferred combined-CLT source row before any
	      exact import
	    - keep `C11c` impact fail-closed because the weak tuple is not explained
	      by `CI` or `CI,50-2500`
	  - closed no-runtime research action:
	    `dataholz_gdmtxa04a_material_surface_recheck_v1`
	    - keep `GDMTXA04A` direct-official-id exact only and visible
	      estimate-routed because the source top layer is a composite dry screed
	      element, not the current local single visible material surface
	  - closed checkpoint action:
	    `checkpoint_validation_and_commit_v1`
	    - validate and commit the no-runtime source-gap guard/docs checkpoint
	      before any solver/catalog/workbench runtime widening
	  - selected next no-runtime planning action:
	    `post_heavy_concrete_formula_history_next_slice_selection_v1`
	    - `post_checkpoint_next_slice_selection_v1` is closed; it selected and
	      closed `clt_combined_anchor_history_replay_matrix_v1`
	    - `post_clt_combined_anchor_history_next_slice_selection_v1` is closed;
	      it selected and closed
	      `heavy_concrete_formula_history_card_matrix_v1`
	    - choose exactly one next behavior or research slice before runtime
	      widening

This order is the safest one because the previous broad blockers are already closed; the immediate risk is silently broadening behavior before the next route can be explained by value, origin, basis/source, support bucket, and workbench/report status. Raw-floor widening is now better measured, including hostile long-split and reordered negatives, but still has the largest fake-confidence blast radius. CLT combined behavior is better anchored, but `C11c` remains deliberately deferred and `GDMTXA04A` remains estimate-only. The wall trace, raw hostile-input slices, generated mixed route-history grid, output-card snapshot guard, source candidate re-rank, UBIQ weak-band posture guard, UBIQ weak-band exact import, UBIQ supported-band exact completion, `Ln,w+CI` bound-surface import, report/reference completion, UBIQ combined-bound history guard, UBIQ near-miss fail-closed guard, remaining-source-gap posture matrix, raw bare open-web/open-box source re-rank, packaged open-box same-package guard, UBIQ packaged open-web finish-family guard, UBIQ packaged open-web near-miss/drop-off matrix, UBIQ packaged open-web history-replay matrix, C11c frequency/source recheck, Dataholz GDMTXA04A material-surface recheck, checkpoint validation, post-checkpoint slice selection, and CLT combined anchor history replay reduced selector, raw-route, projection, source-selection, weak-band, supported-band, combined-bound, user-facing wording, history-replay, near-miss, deferred-gap, packaged-open-box, packaged-open-web, raw-carrier, frequency-source, visible-material, checkpoint, and CLT-history false-confidence uncertainty without weakening frozen corridors, so the next move is a new no-runtime slice-selection pass rather than automatic broad raw-floor widening.
