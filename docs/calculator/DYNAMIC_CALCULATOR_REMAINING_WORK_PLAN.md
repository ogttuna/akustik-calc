# Dynamic Calculator Remaining Work Plan

Last reviewed: 2026-04-08

Document role:

- single place for the remaining dynamic-calculator work across both wall and floor
- use this after [CURRENT_STATE.md](./CURRENT_STATE.md) when deciding what should be fixed next
- optimize for non-regressive work only: every item here must improve the calculator without weakening defended corridors
- for the detailed execution model that separates coverage widening, accuracy tightening, and required test packs, also read:
  - [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md)
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
- the remaining wall debt is corridor widening and selector architecture outside the currently defended `double_leaf <-> lined_massive_wall` hold

### Floor

Current verified result:

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
- that representative roundtrip slice is now frozen as a compact explicit seeded-family matrix across heavy-concrete, open-web-bound, official product-data exact (`REGUPOL Curve 8 exact`), curated exact family/system match (`dataholz_timber_frame_exact`), exact family/system match with low-frequency closures (`hollow_core_vinyl_exact`), official product-backed lower-bound (`REGUPOL wet bound`), product-property DeltaLw (`Getzner AFM 33 Delta`), warning-heavy missing-support-form steel bound (`UBIQ steel 300 unspecified bound`), and warning-light converged-crossover steel bound (`UBIQ steel 200 unspecified bound`) detours
- that compact matrix now proves each representative seeded family survives save/load after a wall detour plus two neighboring seeded-family detour chains, not only after one alternating floor/wall switch
- that same matrix now also survives at the current `savedScenarios` retention boundary, so the representative anchor no longer depends on a sparse saved-snapshot list
- the generated route/engine case sets are now aligned on Knauf concrete exact, TUAS concrete dry exact, Knauf direct timber exact, Knauf timber mount exact, Knauf acoustic timber exact, Dataholz timber-frame exact, Dataholz Dry exact, Dataholz Dry RC exact, dry CLT exact, TUAS CLT exact, TUAS CLT 260 exact, TUAS open-box exact, open-box dry exact, REGUPOL Curve 8 exact, REGUPOL wet bound, Getzner AFM 33 Delta, open-web 200 exact, open-web 400 exact, UBIQ steel 250 bound, UBIQ steel 200 unspecified bound, UBIQ steel 300 unspecified bound, and hollow-core vinyl exact floors, so mixed generated breadth no longer skips the defended published-exact concrete branch, the defended upper-treatment concrete exact branch, the defended direct-fixed timber exact branch, the defended lighter and heavier mounted timber exact branches, the defended wet-screed timber-frame, direct-lined dry, and suspended dry-timber exact branches, the defended dry and measured CLT exact branches, the defended measured and dry open-box exact branches, the defended official product-backed resilient-underlay exact and lower-bound branches, the defended product-property DeltaLw branch, the defended exact steel branches, the first defended interpolation steel lower-bound branch, the defended converged crossover steel lower-bound branch, the defended missing-support-form steel lower-bound branch, or the first defended precast hollow-core family on one side
- remaining debt is no longer “no mixed torture exists” or “the representative seeded-family matrix is missing”; it is that the mixed torture surface still stops at the first deterministic generated longer chain plus save/load roundtrip slice, the compact representative seeded-family matrix with its first two-seeded operator-history chain, and the wider generated grid instead of:
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
  - latest seeded-family widening inside that slice: `REGUPOL wet bound`, `Getzner AFM 33 Delta`, `UBIQ steel 300 unspecified bound`, plus `UBIQ steel 200 unspecified bound`
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

1. extend the raw-floor screening-carrier audit beyond the current representative rows, safe-bare split cohort, first treated/inferred split cohort, first weaker-carrier posture cohort, and first raw concrete ceiling-side inferred support cohort before reopening any more `Rw` support:
   - wider inferred floor packages with clear upper/lower treatment evidence
   - wider-than-first ceiling-side inferred packages
   - raw wall-like heavy hybrids and any remaining weaker carriers that must stay closed

2. run a broader complex-stack torture pass before any new widening

3. continue source-led widening only in this order:
   - open-box timber corridor decisions
   - open-web steel corridor decisions
   - CLT family tightening
   - only then any broader generic family opening

4. keep unsupported raw lanes fail-closed unless the source corpus clearly supports them

### Missing Test Surfaces To Add Next

These are the most likely next useful tests. They are not currently defended enough to claim closure.

- wider-than-first raw concrete ceiling-helper permutations:
  - helper contiguous-split variants
  - board-only plus fill/cavity permutations across more thickness pairs
  - route/card parity on those same variants
- wider inferred floor-family rows:
  - additional CLT, composite, and hollow-core inferred packages beyond the current first cohort
  - ceiling-side inferred packages that should still stay closed
- negative guards around raw heavy hybrids:
  - concrete-plus-board hybrids that infer ceiling-board shapes but should still remain fail-closed
  - weaker carrier plus helper-package rows that must not inherit the concrete reopening rule
- broader mixed floor/wall generated grids:
  - broader seeded long-chain families beyond the current first deterministic save/load-aware chain and compact representative seeded-family matrix
  - duplicate/swap permutations beyond the current first widened grid
  - wider preset-family case sets beyond the current heavy-concrete plus concrete exacts, Knauf timber exacts, Dataholz timber exacts, open-box exacts, CLT exacts, open-web exacts, and hollow-core cohort after the current partial-edit reset surface

### Likely Code Touch Surface

Primary likely code touch surface:

- [impact-predictor-input.ts](../../packages/engine/src/impact-predictor-input.ts)
  - if raw-floor inference needs to become more selective or more permissive
- [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
  - if same-family widening or tightening is required
- [predictor-floor-system-estimate.ts](../../packages/engine/src/predictor-floor-system-estimate.ts)
  - if predictor-side family deviation tightening is needed
- [calculate-assembly.ts](../../packages/engine/src/calculate-assembly.ts)
  - if a future drift lands specifically in screening-anchored airborne companions on otherwise stable floor-system matches
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
  - `R7a`
  - `R6b`
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
- first deterministic longer cross-mode chain with partial-edit abort, restore, and save/load roundtrip
- broader support-bucket/card sanity after cross-mode edit chains

What it does not yet cover:

- broader seeded cross-mode edit-chain families
- mixed floor/wall duplicate-swap grids beyond the current first widened generated grid
- any wider preset-family expansion that still proves necessary after those chains and swap grids

And should check both:

- numeric delta behavior
- support posture / warnings / confidence posture

### Test Pattern Requirements

Each new torture-pass change should add more than one test shape:

- one exact anchor
- one generated scan
- one edit-sequence or route-parity test

That keeps the suite from becoming overly optimistic around a single hand-picked stack.

## 8. Definition Of Done For The Next Phase

The next phase is only complete when all of these are true:

1. standard wall corridor still stays green
2. standard floor corridor still stays green
3. wall and floor output-card parity packs still stay green
4. mixed-stack torture coverage is widened beyond the current first deterministic longer chain and first widened generated duplicate/swap grid
   The representative anchors, compact representative seeded-family matrix, first generated split-detour matrix, first generated edit-history matrix, first widened duplicate/swap grid, and first deterministic longer chain already exist; the remaining step is to widen that surface into broader seeded chain families and wider family grids.
5. no new widening has been merged without source-backed or benchmark-backed evidence
6. every newly opened lane is labeled honestly on route and export surfaces
7. any new red route-surface contract is first classified as solver, support-bucket, or stale-surface drift before logic changes are proposed

## 9. Recommended Execution Order

Do this in order:

1. extend the raw-floor inference audit before reopening any broader screening-carrier posture
2. widen the mixed floor/wall torture surface beyond the current first deterministic longer chain and first widened generated duplicate/swap grid
3. widen wall-side evidence only, not wall-side logic
4. re-check whether any wall corridor widening is still justified after those scans
5. only then resume source-led floor widening

This order is the safest one because the previous blocker is already closed; the next risk is accidental widening without enough frozen evidence.
