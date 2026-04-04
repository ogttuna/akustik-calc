# Numerical System Analysis — 2026-03-31

This note captures a focused numerical-behavior pass on DynEcho.

Scope:

- production web build on port `3010`
- live system-level tests for previously identified numerical edge cases
- error and warning capture
- solver-path tracing
- regression analysis if solver-path selection changes

This note intentionally ignores product/security/reporting concerns and focuses on numerical behavior, path activation, and fail-closed posture.

## 1. Build Status

- web production build command: `pnpm --filter @dynecho/web build`
- standalone artifact check: `apps/web/.next/standalone/apps/web/server.js`
- status: `PASS`

Observed build notes:

- Next.js build completed successfully.
- Build surfaced the existing informational TypeScript note about manually adding the Next.js plugin to the repo tsconfig chain.
- No build-breaking auth/env issue was encountered because auth falls back to preview mode when credentials are absent.

## 2. Hypotheses Under Test

The following numerical hypotheses were carried into live testing:

1. Extremely broad raw layer combinations may still activate impact or field continuations that should have stayed fail-closed.
2. The narrow heavy-floor impact formula may activate on lightweight AAC-style single layers because structural support inference is too permissive.
3. Expert field-impact inputs may be too weakly bounded, allowing physically implausible `L'n,w` / `L'nT,w` / `L'nT,50` values.
4. Airborne outputs are likely more numerically stable than impact outputs because the airborne curve is clamped and more heavily corridor-tested.

## 3. Live Test Log

### 3.1 Build-Artifact Verification

- standalone server artifact present after build
- production-start path remains available for live API testing on `3010`
- health check on the built server returned `{"ok":true,"service":"dynecho-web","upstreamPolicy":"acoustic2_read_only"}`

### 3.2 Case A — Raw Single-Layer AAC Through `/api/estimate`

Request:

- endpoint: `POST /api/estimate`
- payload:
  - `layers = [{ materialId: "ytong_aac_d700", thicknessMm: 9 }]`
  - `targetOutputs = ["Ln,w", "Rw", "CI", "Ln,w+CI"]`

Observed response:

- HTTP status: `200`
- `ok: true`
- `impact.basis = "predictor_heavy_bare_floor_iso12354_annexc_estimate"`
- `impact.LnW = 136`
- `impact.baseSurfaceMassKgM2 = 6.3`
- `impact.scope = "narrow_heavy_concrete_only"`
- supported target outputs: `["Ln,w", "Rw"]`
- unsupported target outputs: `["CI", "Ln,w+CI"]`

Observed warnings:

- `"Screening estimate only. This result is coming from the local calibrated seed lane."`
- `"Lightweight assemblies remain less reliable than dense mineral constructions in the current seed engine."`
- `"No curated exact floor-system landed. Closest family candidate is 140 mm concrete slab | bare lab floor."`

Observed error class:

- no transport error
- no schema error
- no runtime exception
- numerical/path-selection error: a lightweight AAC single leaf was accepted onto the narrow heavy bare-floor lane and produced a physically implausible `Ln,w`

### 3.3 Case B — Exact Lab Bands With Extreme `K` Through `/api/impact-only`

Request:

- endpoint: `POST /api/impact-only`
- payload:
  - `exactImpactSource = EXACT_IMPACT_SOURCE_19`
  - `impactFieldContext = { fieldKDb: 55, guideHdDb: 20, receivingRoomVolumeM3: 10 }`
  - `targetOutputs = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]`

Observed response:

- HTTP status: `200`
- `ok: true`
- `dynamicImpactTrace.fieldContinuation = "standardized_room_volume"`
- `dynamicImpactTrace.guideActive = false`
- `impact.basis = "mixed_exact_plus_estimated_standardized_field_volume_normalization"`
- `impact.LnW = 53`
- `impact.LPrimeNW = 108`
- `impact.LPrimeNTw = 113`
- `impact.LPrimeNT50 = 112`
- supported target outputs: `["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]`
- unsupported target outputs: `[]`

Observed error class:

- no transport error
- no schema error
- no runtime exception
- magnitude-control error: explicit expert `K` was accepted without a physical envelope, so the carry-over path stayed mathematically coherent but numerically implausible

Important path nuance:

- `guideHdDb = 20` was accepted by schema but did not affect this result
- because exact bands plus positive `receivingRoomVolumeM3` kept the solver on the standardized field-volume lane, `L'nT,50` came from `L'nT,w + CI,50-2500`, not from `Ln,w+CI + K + Hd`

### 3.4 Case C — Same Exact Source With Reasonable `K`

Request:

- endpoint: `POST /api/impact-only`
- payload:
  - `exactImpactSource = EXACT_IMPACT_SOURCE_19`
  - `impactFieldContext = { fieldKDb: 3, receivingRoomVolumeM3: 50 }`
  - `targetOutputs = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]`

Observed response:

- HTTP status: `200`
- `ok: true`
- `impact.LnW = 53`
- `impact.LPrimeNW = 56`
- `impact.LPrimeNTw = 54`
- `impact.LPrimeNT50 = 53`
- same path as Case B: standardized room-volume carry-over

Interpretation:

- the continuation formulas themselves are internally coherent
- the instability comes from the unbounded expert-input domain, not from arithmetic inconsistency in the lane

### 3.5 Case D — Type Error Rejection on `/api/impact-only`

Request:

- same as Case B, but `impactFieldContext.fieldKDb = "55"` as a string

Observed response:

- HTTP status: `400`
- `ok: false`
- `error = "Invalid impact-only payload."`
- issue:
  - `path = ["impactFieldContext", "fieldKDb"]`
  - `message = "Expected number, received string"`

Interpretation:

- route/schema validation exists and rejects wrong types
- the numerical issue is not lack of validation in general
- the numerical issue is that the accepted numeric domain is too permissive

### 3.6 Case E — Negative Receiving-Room Volume Still Accepted

Request:

- endpoint: `POST /api/impact-only`
- payload:
  - `exactImpactSource = EXACT_IMPACT_SOURCE_19`
  - `impactFieldContext = { fieldKDb: 3, guideHdDb: 20, receivingRoomVolumeM3: -10 }`
  - `targetOutputs = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]`

Observed response:

- HTTP status: `200`
- `ok: true`
- `dynamicImpactTrace.fieldContinuation = "local_guide_simple"`
- `dynamicImpactTrace.standardizedFieldActive = false`
- `dynamicImpactTrace.guideActive = true`
- `impact.basis = "mixed_exact_plus_estimated_local_guide"`
- `impact.LPrimeNW = 56`
- `impact.LPrimeNTw` unavailable
- `impact.LPrimeNT50 = 73`
- unsupported target outputs: `["L'nT,w"]`

Interpretation:

- negative room volume is not rejected at schema level on the impact side
- downstream logic treats non-positive volume as invalid for the standardized lane
- because explicit `Hd` is still present and `Ln,w+CI` exists on the exact source, the solver falls through to the Turkish simple-guide lane and still returns `L'nT,50`

## 4. Path Analysis

### 4.1 AAC Single Layer -> Heavy Bare-Floor Lane

Actual path:

1. `/api/estimate` accepts the payload through `EstimateRequestSchema` in `packages/shared/src/api/estimate.ts`.
2. `apps/web/app/api/estimate/route.ts` forwards the parsed payload directly into `calculateAssembly`.
3. `calculateAssembly` resolves layers and checks exact floor-system match, bound match, product catalog match, and predictor-specific lanes first.
4. None of those direct lanes land for the raw `9 mm` AAC single leaf.
5. `calculateAssembly` therefore opens `directNarrowImpact = estimateImpactFromLayers(impactResolvedLayers)`.
6. `estimateImpactFromLayers` chooses the last layer as base because there is no explicit `floorRole = "base_structure"`.
7. `isHeavyConcreteBase` calls `inferStructuralSupportTypeFromMaterial(baseLayer.material)`.
8. `inferStructuralSupportTypeFromMaterial` builds search text from `id + name + tags`.
9. For `ytong_aac_d700`, the material tags include `"autoclaved-aerated-concrete"` in `packages/catalogs/src/materials/seed-materials.ts`.
10. The regex `/reinforced[\s_-]*concrete|\bheavy[\s_-]*base\b|\bconcrete\b|\brc\b/` matches that search text and returns `"reinforced_concrete"`.
11. Because the base layer is now treated as heavy concrete and there is no resilient layer above it, the solver applies `Ln,w = 164 - 35 log10(m')`.
12. With `m' = 6.3 kg/m²`, the result becomes `136 dB`.
13. Because `directNarrowImpact` is now truthy, later fallback lanes such as bound-family estimate or broader family estimate do not activate.

Why this path activated:

- the support-family classifier keys off broad text matching, not off a stricter structural-floor envelope
- `findBaseIndex` falls back to the last layer, so a single raw layer is automatically treated as the base structure candidate
- the narrow heavy-floor formula has no minimum surface-mass threshold
- the impact schema accepts any positive thickness, even when that thickness is far outside a realistic structural slab range

What blockers did not fire:

- no AAC-specific exclusion in `inferStructuralSupportTypeFromMaterial`
- no minimum `surfaceMassKgM2` gate in `estimateImpactFromLayers`
- no requirement for an explicit structural floor role before opening the heavy bare-floor lane
- no “fail closed if lightweight-mineral / masonry block” gate before using the Annex C heavy-floor formula

Why the system still warned instead of erroring:

- the engine deliberately treats this lane as a low-confidence screening estimate, not as an exception path
- the route returns `200 OK` because the payload is valid and the solver produced finite numbers

What would move if this path were tightened:

- true concrete baselines in `packages/engine/src/impact-common-floor-combinations.test.ts` must stay on this lane
- direct finish-on-concrete cases in both engine and workbench tests also expect this basis
- custom heavy deck naming in `apps/web/features/workbench/scenario-analysis.test.ts` currently relies on `"Concrete"` text to stay on the conservative heavy bare-floor lane
- raw AAC inputs that currently receive some `Ln,w` would either go fail-closed or move onto a different family estimate
- any UI copy or chart logic keyed to `predictor_heavy_bare_floor_iso12354_annexc_estimate` would need review if the basis changes

### 4.2 Exact Lab Bands + `K`/`V` -> Standardized Field-Volume Carry-Over

Actual path:

1. `/api/impact-only` accepts the payload through `ImpactOnlyRequestSchema` in `packages/shared/src/api/impact-only.ts`.
2. `apps/web/app/api/impact-only/route.ts` forwards the parsed payload directly into `calculateImpactOnly`.
3. `calculateImpactOnly` sees `exactImpactSource` and sets `sourceMode = "exact_band_source"`.
4. `buildExactImpactFromSource` produces the base exact lab impact result, including `Ln,w`, `CI`, and `CI,50-2500`.
5. `calculateImpactOnly` then calls `applyImpactFieldContextToImpact(baseImpact, impactFieldContext, ...)`.
6. `applyDirectFlankingFieldEstimate` does not activate because there are no flanking paths and no `directPathOffsetDb`.
7. `shouldApplyGuideFieldContext` returns true because `fieldKDb`, `guideHdDb`, or `receivingRoomVolumeM3` are present.
8. `deriveImpactGuideMetrics` computes:
   - `L'n,w = Ln,w + K`
   - `L'nT,w = L'n,w + 10 log10(31.3 / V)` when `V > 0`
   - `L'nT,50 = L'nT,w + CI,50-2500` when standardized field continuation is active and `CI,50-2500` exists
9. Because standardized continuation is active, `guideProfile` stays undefined and the explicit `Hd` path does not take over.

Why this path activated:

- exact band input gives the engine a strong exact base lane
- `fieldKDb` and positive `receivingRoomVolumeM3` are enough to activate the standardized field-volume continuation
- the engine intentionally prioritizes the standardized field-volume path over the local-guide `Hd` path when both are available

Why the result can still become implausible:

- `fieldKDb` is only typed as `number`, not bounded to a physically credible range
- the formula is intentionally exact and monotonic; if `K = 55`, the output will move by `+55 dB`
- current sweeps in `packages/engine/src/output-perturbation-sweep.test.ts` protect arithmetic coherence, not physical plausibility caps

What would move if this path were tightened:

- exact-source property sweeps that assert `L'n,w = Ln,w + K` and `L'nT,w = L'n,w + 10 log10(31.3 / V)` must remain green for normal values
- benchmark corpora and field-coverage tests mostly use narrow expert values such as `K = 2` and `V = 50` or `55`; reasonable bounds should not disturb them
- external or internal callers currently relying on very large or negative expert values would start failing validation or clipping instead of receiving permissive outputs

### 4.3 Negative `V` -> Local Guide Fallback

Actual path:

1. The same exact-source setup enters `calculateImpactOnly`.
2. `applyDirectFlankingFieldEstimate` still does not activate.
3. `shouldApplyGuideFieldContext` still returns true because the fields are numeric.
4. In `deriveImpactGuideMetrics`, `receivingRoomVolumeM3 <= 0` disables standardized field continuation.
5. Because `Ln,w+CI`, explicit `K`, and explicit `Hd` are all available, the local guide path stays active and derives:
   - `L'n,w = Ln,w + K`
   - `L'nT,50 = Ln,w+CI + K + Hd`
6. `L'nT,w` remains unsupported because no valid room-volume standardization is available.

Why this matters:

- the impact-side schema is looser than the airborne-side schema for the same physical quantity
- airborne context requires `receivingRoomVolumeM3` to be positive, but impact field context accepts any number
- the result is not a crash; it is a silent lane change from standardized continuation to local guide continuation

### 4.4 Built-System Boundary Sweep: What Actually Switches the Lane

The live `3010` build was swept again with the correct exact-source API contract:

- `exactImpactSource.levelsDb` is required on `/api/impact-only`
- `exactImpactSource.normalizedImpactLevelsDb` is not accepted by the live route

This matters because route-level reproduction must match the actual API shape, not the internal shorthand used elsewhere in the repo.

Observed exact-source `K` sweep on the built system:

- source: full one-third-octave lab curve with `CI = -3` and `CI,50-2500 = -1`
- context: positive `V = 50 m³`
- result: the solver stayed on `mixed_exact_plus_estimated_standardized_field_volume_normalization` for every tested `K`

Observed points:

- `K = -10` -> `L'n,w = 43`, `L'nT,w = 41`, `L'nT,50 = 40`
- `K = -3` -> `L'n,w = 50`, `L'nT,w = 48`, `L'nT,50 = 47`
- `K = 0` -> `L'n,w = 53`, `L'nT,w = 51`, `L'nT,50 = 50`
- `K = 2` -> `L'n,w = 55`, `L'nT,w = 53`, `L'nT,50 = 52`
- `K = 20` -> `L'n,w = 73`, `L'nT,w = 71`, `L'nT,50 = 70`
- `K = 28` -> `L'n,w = 81`, `L'nT,w = 79`, `L'nT,50 = 78`
- `K = 55` -> `L'n,w = 108`, `L'nT,w = 106`, `L'nT,50 = 105`

Interpretation:

- there is no hidden stabilization or clipping on the impact `K` lane
- the lane is fully monotonic and numerically transparent
- any hard `K` bound would be a product-contract choice, not a solver bug fix

Observed exact-source `V` sweep on the built system:

- source: same full exact lab curve
- context: `K = 2 dB`

Observed points:

- `V = -10` with `Hd = 20` -> `mixed_exact_plus_estimated_local_guide`, `L'nT,w` unavailable, `L'nT,50 = 72`
- `V = 0` with `Hd = 20` -> same as above
- `V = 0.1` -> `mixed_exact_plus_estimated_standardized_field_volume_normalization`, `L'nT,w = 80`, `L'nT,50 = 79`
- `V = 5` -> standardized basis, `L'nT,w = 63`, `L'nT,50 = 62`
- `V = 10` -> standardized basis, `L'nT,w = 60`, `L'nT,50 = 59`
- `V = 29.9` -> standardized basis, `L'nT,w = 55.2`, `L'nT,50 = 54.2`
- `V = 50` -> standardized basis, `L'nT,w = 53`, `L'nT,50 = 52`
- `V = 100` -> standardized basis, `L'nT,w = 50`, `L'nT,50 = 49`
- `V = 1600` -> standardized basis, `L'nT,w = 37.9`, `L'nT,50 = 36.9`

Interpretation:

- any positive `V`, even `0.1 m³`, is enough to activate the standardized room-volume lane
- the Turkish `Hd` lookup brackets at `<10`, `<15`, `<30`, `<50`, `<100`, `<200`, `>=200` do not gate standardized continuation
- those brackets only matter when the solver falls back to the local-guide `Ln,w+CI + K + Hd` path
- a positive-only `V` guard is much lower-risk than a stronger physical minimum such as `5 m³`

Additional live observation:

- `guideHdDb` has no effect when `CI,50-2500` is available and standardized continuation is active
- this is not an accident; it is how `deriveImpactGuideMetrics` is written

### 4.5 Built-System Boundary Sweep: AAC Misclassification Is Lexical, Not Material-Family-Wide

The live `3010` build was also swept across all catalogued AAC-like materials.

Observed Ytong/AAC results at `9 mm` single-layer input:

- `ytong_aac_d700` -> heavy bare-floor basis, `Ln,w = 136`, `m' = 6.3`
- `ytong_g5_800` -> heavy bare-floor basis, `Ln,w = 134`, `m' = 7.2`
- `ytong_separatiepaneel_aac_4_600` -> heavy bare-floor basis, `Ln,w = 138.1`, `m' = 5.5`
- `ytong_separatiepaneel_aac_5_750` -> heavy bare-floor basis, `Ln,w = 134`, `m' = 7.2`
- `ytong_cellenbetonblok_g4_600` -> heavy bare-floor basis, `Ln,w = 138.1`, `m' = 5.5`
- `ytong_cellenbetonblok_g5_800` -> heavy bare-floor basis, `Ln,w = 134`, `m' = 7.2`
- `ytong_massief_g2_300` -> heavy bare-floor basis, `Ln,w = 148.9`, `m' = 2.7`
- `aac` -> heavy bare-floor basis, `Ln,w = 141.1`, `m' = 4.5`

Observed Celcon results at the same input:

- `celcon_solar_grade` -> no impact basis returned
- `celcon_standard_grade` -> no impact basis returned
- `celcon_high_strength` -> no impact basis returned

Interpretation:

- the false positive is not “all AAC gets misclassified”
- the false positive is specifically lexical: entries carrying the token `autoclaved-aerated-concrete` hit the broad `\\bconcrete\\b` regex
- Celcon entries use `aircrete` rather than `autoclaved-aerated-concrete`, so they currently escape the false positive
- this means an AAC exclusion or lexical narrowing can be highly targeted

### 4.6 Mixed-Basis Nuance: `local_guide` Does Not Mean “No Standardized Volume”

One subtle point was easy to misread until it was tested directly on the built system.

Two live exact-match floor cases were compared with the same field context:

- `fieldKDb = 2`
- `receivingRoomVolumeM3 = 50`

Case 1: `dataholz_gdmtxn01_dry_clt_lab_2026`

- basis: `mixed_exact_plus_estimated_local_guide`
- `Ln,w = 50`
- `Ln,w+CI = 49`
- `CI = -1`
- `CI,50-2500` unavailable
- `L'n,w = 52`
- `L'nT,w = 50`
- `L'nT,50 = 49`
- `guideEstimateProfile = tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd`

Case 2: `tuas_r5b_open_box_timber_measured_2026`

- basis: `mixed_exact_plus_estimated_standardized_field_volume_normalization`
- `Ln,w = 39`
- `Ln,w+CI = 41`
- `CI = 2`
- `CI,50-2500 = 5`
- `L'n,w = 41`
- `L'nT,w = 39`
- `L'nT,50 = 44`
- `guideEstimateProfile` unavailable

Interpretation:

- the distinction is not driven by the room-volume bracket
- the distinction is primarily driven by whether `CI,50-2500` exists
- when `CI,50-2500` is missing but `Ln,w+CI`, `K`, and `Hd` exist, the solver still carries `L'nT,w` from standardized volume but switches the overall basis to `local_guide` because `L'nT,50` is coming from `Ln,w+CI + K + Hd`
- therefore, a basis change from `standardized` to `local_guide` does not necessarily mean the entire field continuation switched to a different family of equations

This is the single most important semantic nuance for safe refactoring:

- `basis` is currently an aggregate label for the mixed result bundle
- it does not map one-to-one to the exact origin of every single field output
- any attempt to “simplify” basis naming will ripple into tests, trace panels, and parity fixtures

### 4.7 Exact-Floor Library Invariants Under Normal Field Context

The full exact floor-system library was swept with:

- `fieldKDb = 2`
- `receivingRoomVolumeM3 = 50`
- requested outputs: `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`

Observed exact-library summary:

- total exact floor systems checked: `58`
- `mixed_exact_plus_estimated_standardized_field_volume_normalization`: `42`
- `mixed_exact_plus_estimated_local_guide`: `16`

Observed invariant breakdown:

- local-guide rows with `Ln,w+CI` present: `16 / 16`
- local-guide rows with `CI,50-2500` present: `0 / 16`
- standardized rows with `CI,50-2500` present: `8`
- standardized rows with no `CI,50-2500` and no `L'nT,50`: `34`
- standardized rows with no `CI,50-2500` but still returning `L'nT,50`: `0`

Interpretation:

- under normal field context, the exact library currently partitions cleanly
- `local_guide` is acting as “exact row has `Ln,w+CI` but no `CI,50-2500`, so `L'nT,50` must come from the local guide”
- `standardized` is acting as either:
  - “exact row has `CI,50-2500`, so `L'nT,50` comes from standardized continuation”, or
  - “exact row has neither companion, so `L'nT,50` stays unavailable and the bundle remains standardized-only”

This gives a stronger non-regression rule than the earlier qualitative reading:

- changing basis semantics is not acceptable in the first hardening cycle
- the only safe first-cycle changes are those that leave this `42 / 16` exact-library partition untouched

## 5. Regression Surface

### 5.1 Current Test Surface That Defends the Existing Behavior

Heavy bare-floor lane:

- `packages/engine/src/impact-common-floor-combinations.test.ts`
- `apps/web/features/workbench/common-floor-combinations.test.ts`
- `apps/web/features/workbench/scenario-analysis.test.ts`

Field carry-over formulas:

- `packages/engine/src/output-perturbation-sweep.test.ts`
- `packages/engine/src/floor-topology-sanity-sweep.test.ts`
- `packages/engine/src/calculate-impact-only.test.ts`
- `packages/engine/src/calculate-assembly.test.ts`
- `packages/engine/src/impact-real-world-field-coverage.test.ts`
- `packages/engine/src/impact-validation-benchmark.test.ts`

These tests strongly protect:

- supported/unsupported output partitioning
- formula continuity on the `K` and `V` carry-over lane
- non-empty field continuation across several raw or exact-source cases

They do not strongly protect:

- physical magnitude caps for expert inputs
- lightweight AAC exclusion from the heavy bare-floor screening formula
- fail-closed posture for ultra-thin raw structural candidates

### 5.2 If AAC Is Excluded or Heavy-Lane Activation Is Tightened

Likely safe:

- canonical concrete slabs with realistic thickness and mass
- direct flooring-on-concrete cases where the base layer is still actual concrete
- heavy floating-floor cases that already depend on an explicit resilient layer above a concrete base

Likely to move:

- custom materials whose names or tags merely contain `"concrete"`
- raw single-leaf AAC or lightweight-mineral masses that currently get a permissive `Ln,w`
- any workbench classification or messaging that assumes this basis whenever a concrete-like name is seen

Most likely collateral break pattern:

- today the engine often prefers “return a narrow screening number” over “stay fail-closed”
- tightening this path would reduce coverage but improve plausibility

### 5.3 If Expert Impact Field Inputs Are Bounded

Likely safe:

- benchmark-style values around `K = 2`
- room volumes around `30` to `55 m³`
- exact-source carry-over tests operating inside ordinary design ranges

Likely to move:

- callers using very large `K`, `Hd`, `levelOffsetDb`, `kijDb`, or negative `V`
- permissive local-guide fallback behavior on malformed but numeric field context
- direct+flanking expert scenarios that currently accept arbitrary path offsets and penalties

Most likely collateral break pattern:

- requests that currently return `200 OK` with implausible numbers would instead return `400` or clipped outputs
- some current tests may need to be split into:
  - ordinary-range continuation tests
  - explicit schema-boundary tests

### 5.4 Consumer and Dependency Map

This behavior is not isolated to one solver function. The current basis/profile strings are consumed across engine, API, parity, and UI layers.

Repo-wide reference counts observed during this pass:

- `predictor_heavy_bare_floor_iso12354_annexc_estimate`: `29` references
- `direct_flanking_energy_sum`: `85` references
- `explicit_field_lprimenw_from_lnw_plus_k`: `13` references
- `mixed_exact_plus_estimated_standardized_field_volume_normalization`: `32` references
- `mixed_exact_plus_estimated_local_guide`: `21` references

Engine consumers:

- `packages/engine/src/impact-support.ts`
  - emits narrative and formula notes for Annex C style bases
  - emits different formula notes for direct+flanking vs `Ln,w + K` carry-over
- `packages/engine/src/impact-predictor-status.ts`
  - classifies heavy bare/floating paths as implemented formula estimates
- `packages/engine/src/floor-system-ratings.ts`
  - maps heavy bare/floating bases onto the heavy-concrete airborne companion basis
- `packages/engine/src/dynamic-impact.ts`
  - turns basis/profile combinations into human-readable trace labels
  - decides whether field continuation is shown as direct flanking, standardized volume, or local guide
- `packages/engine/src/impact-field-context.ts`
  - resolves whether the field supplement becomes direct flanking, explicit `K`, standardized volume, or local guide

Fixture and parity consumers:

- `packages/engine/fixtures/reference-benchmarks-impact-validation-2026.json`
  - carries expected standardized-volume basis rows
- `packages/engine/fixtures/reference-benchmarks-impact-real-world-field-coverage-2026.json`
  - carries expected standardized-volume and local-guide basis rows
- `tools/upstream/compare-impact-parity.ts`
  - explicitly treats `mixed_exact_plus_estimated_standardized_field_volume_normalization` as semantically equivalent inside a parity helper

API and e2e consumers:

- `e2e/api.spec.ts`
  - contains `9` direct assertions on these basis/profile strings and related metric-basis labels
  - asserts direct+flanking, direct-only, and explicit-`K` carry-over behavior at the API surface

Workbench/UI consumers:

- `apps/web/features/workbench/validation-regime.ts`
  - maps heavy bare/floating bases into the `formula_estimate` validation regime
  - maps field continuations into different validation mode buckets
- `apps/web/features/workbench/target-output-status.ts`
  - changes per-output explanation text based on `dynamicImpactTrace.fieldContinuation`
- `apps/web/features/workbench/impact-trace-panel.tsx`
  - renders a dedicated field-path trace card only when `fieldEstimateProfile === "direct_flanking_energy_sum"`
- `apps/web/features/workbench/impact-field-path-guides.ts`
  - changes operator guidance based on whether the direct+flanking path is currently active
- `apps/web/features/workbench/impact-field-path-panel.tsx`
  - changes badge state and explanatory copy from `Optional expert lane` to `Direct+flanking active`

Practical conclusion:

- changing a formula gate without preserving basis/profile semantics will break more than solver numerics
- changing basis/profile semantics without updating tests and UI wording will create false regressions even if the math improves

### 5.5 Baseline Verification Run Before Any Code Change

Engine baseline run executed during this pass:

- command intent: impacted impact/field/floor suites before any hardening
- actual Vitest expansion: broader engine regression surface
- result: `52` test files passed, `436` tests passed

Web baseline run executed during this pass:

- command intent: impacted workbench scenario/common-floor/floor-family suites before any hardening
- actual Vitest expansion: broader workbench regression surface
- result: `45` test files passed, `363` tests passed

Why this matters:

- current behavior is strongly codified, not incidental
- if a future change breaks things, it will almost certainly show up as:
  - basis/profile expectation failures
  - supported/unsupported output partition failures
  - warning-text or trace-label failures
  - parity fixture mismatches

### 5.6 UI vs API Inconsistencies That Change the Risk Profile

The system does not currently expose one single input contract.

Simple workbench live shell:

- `apps/web/features/workbench/simple-workbench-shell.tsx` uses `parsePositiveNumber(...)` for both `fieldKDb` and `receivingRoomVolumeM3`
- negative `K` values therefore do not enter the live simple-shell engine call at all

Saved scenario / full workbench route:

- `apps/web/features/workbench/workbench-shell.tsx` uses `parseFiniteNumber(...)`
- negative `K`, zero `Hd`, and other merely finite values can still reach the engine from the saved/full scenario route

Guided sanity layer:

- `apps/web/features/workbench/input-sanity.ts` defines soft bands:
  - `fieldKDb: -15 .. 20 dB`
  - `receivingRoomVolumeM3: 5 .. 1000 m³`
- `apps/web/features/workbench/scenario-analysis.test.ts` explicitly asserts that out-of-band values such as `K = 28` and `V = 1600` should raise warnings without blocking calculation
- the same test suite also asserts that negative `K` can legitimately lower carried field metrics while staying on the standardized field lane

Practical conclusion:

- a hard engine/API bound on `K` or `V` is not a pure numerical change; it is also a product-contract change
- UI warnings already exist, but they are not the same as engine rejection
- if hard bounds are introduced, some current “warn only” tests and saved-scenario semantics must be rewritten deliberately

### 5.7 Change Scenarios Ranked by Numerical Value vs Break Risk

Scenario A: exclude AAC-like materials from `reinforced_concrete` inference while keeping actual concrete and heavy-base detection

- numerical value: high
- break risk: medium
- blocks the reproduced `9 mm` AAC false positive directly
- must preserve custom concrete deck naming and true heavy slab screening
- likely break surface:
  - raw AAC permissive outputs
  - any custom material whose only route to the heavy lane is a broad `"concrete"` text match

Scenario B: add a minimum base surface-mass threshold before opening the heavy bare-floor Annex C lane

- numerical value: high
- break risk: low to medium
- a threshold well below real concrete slabs but well above lightweight AAC leaves would preserve current concrete baselines
- this is the least invasive numerical hardening lever because it does not require changing downstream basis/profile logic
- it also aligns with existing workbench sanity guidance where concrete base structures below the ordinary band are already warned as suspicious

Scenario C: require explicit `floorRole = "base_structure"` before opening the heavy bare-floor lane

- numerical value: medium
- break risk: high
- many tests and raw-entry flows still use bare concrete inputs without explicit floor roles
- this would change raw input ergonomics and likely remove currently expected permissive coverage

Scenario D: hard-bound `ImpactFieldContextSchema` numerically at the engine/API boundary

- numerical value: high
- break risk: medium to high
- positive-only room volume is probably low-risk numerically
- hard-bounding `fieldKDb` is more disruptive because web tests currently assert warning-only behavior for `K = 28`, and saved scenarios can pass negative `K`
- if chosen, this should be treated as an intentional contract change, not as a silent solver refactor

Scenario E: keep schema permissive, but add engine-side fail-closed guards only on implausible continuation magnitudes

- numerical value: medium
- break risk: medium
- preserves current route inputs at the API boundary
- still changes live outputs and supported-output partitions when guard thresholds are crossed
- easier to ship quietly than schema rejection, harder to reason about than explicit validation

Scenario F: bound direct+flanking expert offsets (`levelOffsetDb`, `kijDb`, `pathPenaltyDb`, `directPathOffsetDb`)

- numerical value: medium
- break risk: medium
- current direct+flanking branch is heavily traced and UI-explained, but not strongly protected by extreme-value tests
- likely safe if bounds remain permissive, but should be paired with dedicated boundary tests

### 5.8 Best Order If the Goal Is “Improve Numerics With Minimum Collateral”

Lowest-risk order from this analysis:

1. Add a heavy-lane mass gate.
2. Narrow AAC-to-concrete structural-family inference.
3. Add positive-only impact room-volume validation or fail-closed handling.
4. Decide explicitly whether `K` should stay warning-only or become a hard-bounded contract.
5. Only then consider stricter role requirements or aggressive expert-path bounds.

Reasoning:

- steps `1` and `2` target the reproduced false-positive lane directly
- they preserve most downstream basis/profile semantics
- steps `3` to `5` start touching the product contract, saved-scenario compatibility, and UI warning model

### 5.9 Change-by-Change Blast Radius Matrix

This section answers the practical question: “if we harden this, what is most likely to break?”

#### Lever A: Minimum `m'` gate before heavy bare-floor activation

Current verified heavy bare-floor baselines:

- `150 mm` concrete -> `m' = 360 kg/m²`
- `180 mm` concrete -> `m' = 432 kg/m²`
- `200 mm` concrete -> `m' = 480 kg/m²`

Additional reference masses:

- `60 mm` concrete -> `m' = 144 kg/m²`
- `80 mm` concrete -> `m' = 192 kg/m²`
- `100 mm` concrete -> `m' = 240 kg/m²`

Reproduced false positives:

- AAC misroutes currently land between `2.7` and `7.2 kg/m²`

Repo concrete base-structure references observed by grep:

- thicknesses present in repo floor inputs: `120`, `140`, `150`, `160`, `165`, `180`, `200`, `205 mm`
- no repo floor input currently references `lightweight_concrete`

Catalog sweep on the narrow heavy-bare lane:

- at `m' > 40`, many AAC rows still survive
- at `m' > 60`, some AAC rows still survive
- at `m' > 80`, several `150 mm` AAC rows still survive
- at `m' > 100`, higher-density `150 mm` AAC rows still survive
- at `m' > 120`, all reproduced AAC rows from the `9 / 60 / 100 / 150 mm` sweep are blocked
- at `m' > 120`, the following still remain on the heavy lane:
  - `concrete` at `60 / 100 / 150 mm`
  - `heavy_concrete` at `60 / 100 / 150 mm`
  - `lightweight_concrete` at `100 / 150 mm`

Interpretation:

- `m' > 120 kg/m²` is the first tested threshold that blocks all reproduced AAC false positives while preserving even `60 mm` plain concrete
- internally, it also stays well below the current repo’s real concrete floor references, whose minimum observed floor-base thickness is `120 mm`

Implication:

- a gate somewhere above single-digit AAC masses and well below `144 kg/m²` would preserve all current concrete baseline tests shown in the common-floor suites
- this is why the mass gate remains the least invasive hardening lever

Most likely break surface:

- ultra-thin raw concrete entries with no better fallback lane
- any ad hoc caller currently relying on a permissive `Ln,w` for very thin concrete-like leaves

Sentinel tests to rerun after this change:

- `packages/engine/src/impact-common-floor-combinations.test.ts`
- `apps/web/features/workbench/common-floor-combinations.test.ts`
- `apps/web/features/workbench/scenario-analysis.test.ts`

#### Lever B: Narrow lexical inference from `autoclaved-aerated-concrete` / broad `concrete`

Observed file-level dependency count:

- `predictor_heavy_bare_floor_iso12354_annexc_estimate` currently appears in `12` files across engine, workbench, fixtures, and validation layers

Observed behavior surface:

- Ytong/AAC entries misroute
- Celcon AAC entries do not
- true `materialId = "concrete"` slabs still need to stay on the heavy lane
- explicit `heavy-base` tags also still need to stay on the heavy lane

Catalog-wide classifier sweep:

- total materials currently inferred as `reinforced_concrete`: `11`
- clearly suspicious entries inside that set:
  - `lightweight_concrete`
  - `ytong_aac_d700`
  - `ytong_g5_800`
  - `ytong_separatiepaneel_aac_4_600`
  - `ytong_separatiepaneel_aac_5_750`
  - `ytong_cellenbetonblok_g4_600`
  - `ytong_cellenbetonblok_g5_800`
  - `ytong_massief_g2_300`
  - `aac`

Interpretation:

- lexical narrowing alone is enough to target the AAC/Ytong block
- lexical narrowing alone does not decide the fate of `lightweight_concrete`
- therefore the lowest-risk first cycle is still:
  - mass gate first
  - lexical narrowing second
  - defer any policy call on `lightweight_concrete` until after the first zero-regression hardening pass

Most likely break surface:

- custom materials whose only heavy-lane route is text matching rather than explicit `materialId`, `tag`, or realistic mass
- any UI text expecting “concrete-like name implies heavy formula”

Sentinel tests to rerun after this change:

- `packages/engine/src/impact-common-floor-combinations.test.ts`
- `apps/web/features/workbench/common-floor-combinations.test.ts`
- `packages/engine/src/calculate-assembly.test.ts`

#### Lever C: Positive-only `receivingRoomVolumeM3`

Observed current live behavior:

- `V <= 0` silently flips from standardized continuation to local guide when `Hd` is present
- any `V > 0`, including `0.1`, stays on standardized continuation

Most likely break surface:

- malformed saved scenarios or direct API calls using `V <= 0`
- tests that explicitly or implicitly expect silent fallback instead of rejection

Low-risk version:

- reject or fail-close only for `V <= 0`

Higher-risk version:

- enforce a stronger physical minimum such as `5 m³`
- this starts colliding with the current “warn only” posture in the workbench sanity layer

Sentinel tests to rerun after this change:

- `packages/engine/src/calculate-impact-only.test.ts`
- `packages/engine/src/calculate-assembly.test.ts`
- `apps/web/features/workbench/floor-family-regressions.test.ts`

#### Lever D: Hard-bound `fieldKDb`

Observed file-level dependency count:

- `explicit_field_lprimenw_from_lnw_plus_k` currently appears in `8` files
- negative `fieldKDb` appears explicitly in `1` workbench test file
- out-of-band `fieldKDb = 28` appears explicitly in `1` workbench test file

Observed current live behavior:

- negative `K` is accepted and lowers results
- `K = 28` is accepted and stays on the standardized lane
- `K = 55` is accepted and produces `L'n,w = 108`

Most likely break surface:

- `apps/web/features/workbench/scenario-analysis.test.ts`
- `apps/web/features/workbench/input-sanity.ts` contract assumptions
- saved/full workbench scenarios that currently accept finite but extreme `K`
- API/e2e callers using the permissive expert lane

Important distinction:

- bounding `K` at the schema layer is a contract change
- bounding `K` only at the solver layer is a semantic change in outputs/support without an API error

Sentinel tests to rerun after this change:

- `packages/engine/src/calculate-impact-only.test.ts`
- `packages/engine/src/calculate-assembly.test.ts`
- `apps/web/features/workbench/scenario-analysis.test.ts`
- `e2e/api.spec.ts`

#### Lever E: Change aggregate basis semantics

Observed file-level dependency counts:

- `mixed_exact_plus_estimated_standardized_field_volume_normalization` appears in `12` files
- `mixed_exact_plus_estimated_local_guide` appears in `9` files

Most likely break surface:

- parity fixtures
- UI validation regime tags
- trace labels and badges
- e2e/API assertions
- workbench field-path guidance

This is the highest-collateral refactor in the set.

Safe rule:

- do not change basis semantics while hardening the math unless there is a deliberate secondary cleanup pass prepared for fixtures, UI copy, and parity helpers

### 5.10 Off-Axis Fragilities Discovered During Broad Input Probing

While probing the broader catalog, a separate fragility surfaced that is not part of the current hardening target and should not be mixed into the first numerical-correction cycle.

Observed `calculateAssembly` failures for single-layer `base_structure` probes at `100 mm`:

- `air_gap`
- `resilient_support`
- `acoustic_mount_clip`
- `spring_hanger_track`
- `resilient_channel`
- `ubiq_resilient_ceiling`
- `genieclip_rst`
- `acoustic_hanger_ceiling`
- `resilient_stud_ceiling`
- `furring_channel`

Observed failure signature:

- predictor-input merge path raises a `ZodError`
- failing field: `baseSlab.densityKgM3`
- trigger: non-structural cavity / clip / channel products are being force-probed as if they were structural base slabs

Why this matters for planning:

- this is real broad-domain fragility, but it is not the same issue as the AAC heavy-lane false positive
- if we mix “single-layer non-structural fail-close cleanup” into the same PR as the heavy-lane corrections, we widen the blast radius unnecessarily
- the safe move is to treat this as a separate hardening stream after the first low-collateral numerical corrections are proven clean

### 5.11 Non-Regression Contract For The First Hardening Cycle

If the goal is “only more correct, nothing else moves”, the first cycle must be intentionally narrow.

Allowed behavior changes in cycle 1:

- raw low-mass AAC-like inputs that currently misroute onto the heavy bare-floor lane may change basis or fail closed
- malformed impact field contexts with `V <= 0` may fail closed instead of silently switching to local guide

Disallowed behavior changes in cycle 1:

- no exact floor-system id may change basis under normal field context `K = 2`, `V = 50`
- no workbench preset may change basis or numeric outputs unless it is a deliberately targeted malformed case
- no curated concrete baseline or floating concrete baseline may leave its current lane
- no field continuation basis/profile strings may change for the exact library or common-floor verified scenarios
- no supported/unsupported output partition may move for verified scenarios

Concrete acceptance gates:

1. Exact floor-system differential gate
   All `58` exact floor systems are re-run with `K = 2`, `V = 50`.
   Acceptance:
   `0` basis changes outside the targeted malformed domain.
   `0` metric changes outside the targeted malformed domain.

2. Workbench preset differential gate
   All floor presets are re-run.
   Acceptance:
   `0` basis changes outside the targeted malformed domain.
   `0` metric changes outside the targeted malformed domain.

3. Sentinel regression gate
   The focused `293`-test suite in Section `5.13` stays fully green.

4. Targeted-diff gate
   Only the pre-declared bad cases are allowed to move:
   - low-mass AAC / Ytong heavy-bare misroutes
   - `V <= 0` impact field contexts if we choose that lever

5. Basis-semantics freeze
   Any change that alters the `42 / 16` exact-library standardized/local-guide partition is rejected for cycle 1.

### 5.12 Safe Iteration Plan

The safest plan is not one big “fix numerics” branch. It is three very narrow iterations with hard diff gates between them.

Iteration 0: Freeze the baselines

- keep current code unchanged
- snapshot exact-library outputs, floor presets, and sentinel suite results
- this becomes the golden non-regression baseline

Iteration 1: Add only the heavy-bare `m'` gate

- no lexical classifier edits yet
- no basis-semantic edits
- no field-context edits

Acceptance:

- exact-library diff: zero unintended changes
- preset diff: zero unintended changes
- sentinel suite: fully green
- targeted improvement: AAC-like low-mass cases no longer land on the heavy bare-floor lane

Iteration 2: Narrow AAC lexical inference

- only after Iteration 1 is proven clean
- keep `lightweight_concrete` policy unchanged in this cycle

Acceptance:

- same zero-diff gates
- targeted improvement set should shrink further, but only inside the AAC lexical family

Iteration 3: Positive-only `V` fail-close

- only `V <= 0`
- do not hard-bound `K` yet
- do not enforce `V >= 5` yet

Acceptance:

- zero-diff on all positive-`V` verified scenarios
- only malformed `V <= 0` scenarios may change

Explicitly deferred beyond cycle 1:

- hard `K` bounds
- basis/profile semantic cleanup
- broader predictor-input fail-close for non-structural base candidates
- `lightweight_concrete` policy changes unless a separate evidence pass justifies them

### 5.13 Sentinel Regression Suite For Any Numerical Hardening

The following focused suite was run during this pass and is the minimum useful “did we break numerical behavior?” set:

- engine:
  - `packages/engine/src/calculate-impact-only.test.ts` -> `67` tests passed
  - `packages/engine/src/impact-common-floor-combinations.test.ts` -> `46` tests passed
- web:
  - `apps/web/features/workbench/scenario-analysis.test.ts` -> `68` tests passed
  - `apps/web/features/workbench/floor-family-regressions.test.ts` -> `38` tests passed
  - `apps/web/features/workbench/common-floor-combinations.test.ts` -> `74` tests passed

Focused suite total:

- `5` files passed
- `293` tests passed

Why this is the right sentinel surface:

- it covers raw heavy-floor screening
- it covers exact-match floor carry-over
- it covers local-guide vs standardized mixed-basis behavior
- it covers workbench warning semantics that already encode the current permissive contract

## 6. Live Workbench Flow Mapping

The solver is not exposed to the user as a raw basis string.

Before choosing the next numerical hardening target, the simple workbench flow was re-walked live on the built `3010` app with Playwright so the UI summary layers could be mapped back onto the real route logic.

This matters because the simple shell can make a route look like “heavy floating floor” or “bare floor” at the topology level while the actual active lane is still a broader published-family estimate or an exact family row.

### 6.1 Simple Workbench Input Contract On The Live Surface

Observed live simple-shell controls:

- `Study type` is a `<select>` with `floor` / `wall`
- `Project context` is a `<select>` with:
  - `element_lab`
  - `field_between_rooms`
  - `building_prediction`
- `Example stack` is a `<select>` with floor presets such as:
  - `heavy_concrete_impact_floor`
  - `clt_floor`
  - `dataholz_clt_dry_exact`
  - `ubiq_open_web_300_bound`
  - `timber_bare_impact_only_fallback`

Observed code mapping:

- `apps/web/features/workbench/preset-definitions.ts`
  defines `heavy_concrete_impact_floor` as:
  - `ceramic_tile 8 mm`
  - `screed 50 mm`
  - `generic_resilient_underlay 8 mm`
  - `concrete 150 mm`
- `apps/web/features/workbench/simple-workbench-shell.tsx`
  auto-derives the requested outputs from `getAutomaticOutputs(studyMode, airborneContextMode)`
- the same simple shell only forwards `impactFieldContext` when positive parsed `K` or positive parsed impact room volume exist

Practical consequence:

- the simple live workbench is stricter than the raw API for expert impact inputs
- negative `K` and non-positive floor-side room volume do not even enter the engine from this surface
- therefore, API reproductions and simple-shell reproductions are not interchangeable unless the input contract is matched intentionally

### 6.2 Live Validation-Posture Matrix On The Built App

The following representative floor routes were replayed live with Playwright against `http://127.0.0.1:3010/workbench`.

#### Formula / supported-estimate lane

Preset:

- `Impact Floor`

Live observations:

- `Lab element`
  - route detail:
    `Published family estimate is active through Published family blend · reinforced concrete. Published heavy-concrete upper-treatment estimate on the heavy floating floor topology.`
  - validation detail:
    `Published family estimate is active. Read this as a supported floor estimate, not as a measured claim.`
  - `Ln,w = 50 dB`
- `Between rooms`, no `K` / no floor-side `V`
  - same published-family estimate route remains active
  - same validation posture remains active
  - `Ln,w = 50 dB`
- `Between rooms`, `K = 2`, floor-side `V = 50`
  - route detail switches to:
    `Published family estimate is active through Published family blend · reinforced concrete. Standardized field-volume carry-over on the heavy floating floor topology.`
  - validation posture still remains `Scoped estimate`
  - `Ln,w = 50 dB`

Interpretation:

- the simple `Impact Floor` preset is not currently a pure “narrow Annex C formula card”
- its live route label already shows a published-family estimate lane
- adding positive `K` and `V` changes the field continuation detail, not the validation posture

#### Exact lane

Preset:

- `Dataholz CLT Dry`

Live observations:

- `Lab element`
  - route detail:
    `Dataholz GDMTXN01 | CLT floor | dry screed | no lining. Dry floating floor topology with published companion ratings is active on this route.`
  - validation detail:
    `Exact floor-system family is active. This route is anchored by exact or official source evidence instead of a screening-only estimate.`
  - `Ln,w = 50 dB`
- `Between rooms`, geometry entered, `K = 2`, floor-side `V = 50`
  - exact route label remains exact
  - exact validation posture remains exact
  - `Ln,w = 50 dB`

Interpretation:

- context changes can add field-side continuations without weakening the underlying evidence posture
- the exact family route remains clearly separable from the published-family estimate route on the live UI

#### Conservative-bound lane

Preset:

- `UBIQ Bound 300`

Live observations:

- route detail:
  `Bound floor-system family is active through UBIQ FL-33 | 300 mm open-web / rolled steel | INEX FLOOR 19 | 2 x 16 mm resilient ceiling. Standardized field-volume carry-over on the combined upper and lower system topology.`
- validation detail:
  `Bound floor-system family is active. This route is conservative support only, so the current number should be read as a bound instead of a delivery-ready claim.`
- primary read:
  `Ln,w <= 51 dB`

Interpretation:

- the bound lane is not merely a text badge
- the live UI does expose the `<=` posture directly in the weighted output

#### Low-confidence fallback lane

Preset:

- `Timber Bare Low-Confidence`

Live observations:

- route detail:
  `Low-confidence fallback · timber frame / joist is active. Final published-family fallback on the bare floor topology, so this branch stays source-backed but below the narrower same-family estimate corridor.`
- validation detail:
  `Low-confidence fallback is active. This is the final published-family fallback, so treat it as a last-resort estimate rather than a narrow solver match.`
- `Ln,w = 61.3 dB`

Interpretation:

- low-confidence fallback is also visible as its own route posture on the built UI
- it is therefore possible to distinguish:
  - exact evidence
  - scoped estimate
  - conservative bound
  - low-confidence fallback
  without opening engine traces directly

### 6.3 Topology Label vs Active Lane: The Important Semantic Split

One critical point became clear only after comparing the live route card with the underlying code.

Observed code path:

- `apps/web/features/workbench/dynamic-calc-branch.ts`
  sets the route-card headline `value` to:
  - `trace.systemTypeLabel`, or
  - `trace.selectionKindLabel`
- the route-card detail sentence carries the more specific lane explanation

Practical consequence:

- the route headline is often topology-oriented
- the route detail sentence is usually closer to the actual active lane

This is why the same live card can show:

- headline meaning:
  `Heavy floating floor`
- while the detail sentence still says:
  `Published family estimate is active through Published family blend · reinforced concrete`

Safe reading order for future numerical analysis:

1. actual returned metrics
2. validation posture
3. route detail sentence
4. only then the topology/headline label

Unsafe shortcut:

- picking the next solver hardening target from the route headline alone

### 6.4 Automatic Output Preset Nuance: Missing Card Does Not Mean Missing Solver

Observed code mapping:

- `apps/web/features/workbench/simple-workbench-constants.ts`
  defines:
  - `FLOOR_OUTPUT_PRESET_LAB = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"]`
  - `FLOOR_OUTPUT_PRESET_FIELD = ["Ln,w", "DeltaLw", "Rw", "R'w", "L'n,w", "Dn,w"]`
  - `FLOOR_OUTPUT_PRESET_BUILDING = ["Ln,w", "DeltaLw", "Rw", "R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"]`
- `apps/web/features/workbench/simple-workbench-utils.ts`
  exposes these through `getAutomaticOutputs(...)`
- `apps/web/features/workbench/guided-output-unlocks.ts`
  confirms:
  - `L'n,w` needs positive `K`
  - `L'nT,w` / `L'nT,50` need positive `K` plus positive floor-side room volume

Interpretation:

- in `Between rooms`, the simple shell does not request standardized floor-side impact outputs by default
- therefore, the absence of `L'nT,w` or `L'nT,50` on that surface is not automatically a solver failure
- the correct first question is:
  “Was the output requested on this surface?”
  not:
  “Why did the engine fail to compute it?”

This reduces false solver alarms during manual QA.

### 6.5 What This Changes About The Next Numerical Task

Before this flow pass, the next likely target looked like:

- “the heavy floating floor preset may not be sensitive enough to lighter base slabs”

After the live UI-to-code mapping, that conclusion is weaker than it first looked, because:

- the simple `Impact Floor` preset is currently traveling through a published-family estimate lane on the built UI
- it is not a clean isolated read of the narrow heavy-floor formula alone

Therefore the safer next decision rule is:

- do not infer solver insensitivity from the simple route headline alone
- first confirm whether the route under inspection is:
  - exact
  - scoped estimate
  - bound
  - low-confidence fallback
  - narrow formula estimate

Only after that classification should a new numerical hardening target be chosen.

### 6.6 Current High-Confidence Flow Conclusions

After the live Playwright pass plus code mapping, the following statements are now safe:

- the simple workbench does visibly distinguish exact, estimate, bound, and low-confidence floor lanes
- the simple workbench route headline is not a reliable substitute for the real active lane
- the route detail sentence plus validation posture is the reliable UI readout
- the simple floor `Between rooms` surface is not the same thing as the `Building prediction` surface in terms of automatic output requests
- negative or zero floor-side impact expert values are much harder to enter from the simple live surface than from the raw API or saved/full scenario route

Planning consequence:

- any next numerical hardening pass should be chosen against the engine/API truth first
- the simple workbench should then be used as a confirmation surface, not as the primary source of solver-path truth

## 7. High-Confidence Conclusion

The built system on port `3010` is numerically stable in the narrow sense that it does not throw, does not emit `NaN`, and keeps its carry-over formulas internally coherent. The main issue is semantic rather than arithmetic:

- raw AAC can be misrouted onto the heavy bare-floor screening formula
- expert impact field inputs are numerically accepted with almost no physical envelope
- some malformed numeric contexts do not fail closed; they silently switch continuation lane

So the current engine is robust against crashes, but not yet robust against all unreasonable yet schema-valid combinations.

## 8. Implemented Hardening Verification

The first hardening cycle was implemented as the narrowest possible three-part change set:

- heavy concrete impact screening now requires base surface mass `m' >= 120 kg/m²`
- AAC-like lexical labels (`aac`, `autoclaved-aerated-concrete`, `aircrete`, `gazbeton`, `porenbeton`) no longer qualify as reinforced concrete in the structural material classifier
- impact field context now rejects non-positive `receivingRoomVolumeM3`

No hard `K` bounds were added.
No basis/profile semantic cleanup was added.
No broader predictor fail-close was added.

### 8.1 Live 3010 Verification After The Fix

Built artifact:

- `pnpm --filter @dynecho/web build`
- `pnpm --filter @dynecho/web start -- --hostname 127.0.0.1 --port 3010`

Observed live cases on the built app:

1. Raw AAC base structure no longer enters the heavy bare-floor lane

- request: `POST /api/estimate`
- payload: single `ytong_aac_d700` base structure, `150 mm`
- result: `200 OK`
- impact basis: `predictor_floor_system_family_archetype_estimate`
- impact scope: `family_estimate`
- `Ln,w = 81.8`
- expected bad basis no longer appears: `predictor_heavy_bare_floor_iso12354_annexc_estimate`

2. Extreme thin AAC also stays off the heavy bare-floor lane

- request: `POST /api/estimate`
- payload: single `ytong_aac_d700` base structure, `9 mm`
- result: `200 OK`
- impact basis: `predictor_floor_system_family_archetype_estimate`
- `Ln,w = 80.5`
- the old pathological `Ln,w = 136` heavy-bare misroute is gone

3. True heavy concrete still keeps the narrow heavy bare-floor lane

- request: `POST /api/estimate`
- payload: single `concrete` base structure, `150 mm`
- result: `200 OK`
- impact basis: `predictor_heavy_bare_floor_iso12354_annexc_estimate`
- `Ln,w = 74.5`

4. Threshold boundary remains intentionally inclusive at `120 kg/m²`

- request: `POST /api/estimate`
- payload: single `concrete` base structure, `50 mm`
- result: `200 OK`
- base surface mass: `120 kg/m²`
- impact basis: `predictor_heavy_bare_floor_iso12354_annexc_estimate`
- `Ln,w = 91.2`

5. True heavy concrete floating-floor lane still resolves unchanged

- request: `POST /api/impact-only`
- visible layers: gap-only
- source layers: `ceramic_tile 8 mm`, `screed 30 mm`, `generic_resilient_underlay_s30 8 mm`, `concrete 150 mm`
- result: `200 OK`
- impact basis: `predictor_heavy_floating_floor_iso12354_annexc_estimate`
- `Ln,w = 50.3`
- `DeltaLw = 24.3`

6. Exact lab source with reasonable field context stays numerically identical

- request: `POST /api/impact-only`
- exact source: `EXACT_IMPACT_SOURCE_19`
- field context: `K = 2`, `V = 50`
- result: `200 OK`
- basis: `mixed_exact_plus_estimated_standardized_field_volume_normalization`
- `L'n,w = 55`
- `L'nT,w = 53`
- `L'nT,50 = 52`

7. Malformed `V <= 0` now fails closed at schema boundary

- request: `POST /api/impact-only`
- exact source: `EXACT_IMPACT_SOURCE_19`
- field context: `K = 2`, `V = 0`
- result: `400 Bad Request`
- rejection path: `impactFieldContext.receivingRoomVolumeM3`
- validation message: `Number must be greater than 0`

### 8.2 Trace-Meta Nuance Verified During Live Probing

The post-fix AAC cases still show `reinforced_concrete` inside some dynamic trace metadata. This is not the old heavy-formula misroute coming back.

What actually happens:

- the active solver basis stays `predictor_floor_system_family_archetype_estimate`
- the trace family label is inherited from the selected estimate source family, not from the AAC input itself
- therefore this is currently a trace-labeling nuance, not a numerical routing regression

This distinction matters because changing that label in cycle 1 would touch basis/trace semantics rather than the targeted numerical bug.

### 8.3 Cache-Free Test Verification After The Fix

Direct engine run:

- command: `pnpm --filter @dynecho/engine exec vitest run`
- result: `52` files passed, `439` tests passed

Direct web run:

- command: `pnpm --filter @dynecho/web exec vitest run`
- result: `45` files passed, `363` tests passed

Focused impact-heavy regression run:

- command: `pnpm vitest run packages/engine/src/impact-common-floor-combinations.test.ts packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts packages/engine/src/impact-validation-benchmark.test.ts packages/engine/src/impact-upstream-parity-acceptance.test.ts packages/engine/src/floor-library-sweep.test.ts`
- result: `5` files passed, `67` tests passed

What this verified in practice:

- heavy-floor planned-scope benchmark stayed inside tolerance
- impact validation benchmark stayed inside tolerance
- impact upstream parity against Acoustic2 remained green
- curated floor-library sweep remained stable
- full assembly and workbench regression surfaces remained green

### 8.4 Final Cycle-1 Assessment

The implemented cycle-1 hardening did what it was supposed to do:

- it removed the reproduced AAC heavy-bare false positive
- it preserved true heavy concrete bare and floating formula lanes
- it preserved the exact-lab `K + V` standardized carry-over path
- it converted malformed `V <= 0` field contexts from silent continuation changes into explicit rejection

Within the currently exercised regression surface, this change set is narrower and safer than any broader policy edit involving:

- hard `K` bounds
- basis/profile renaming
- lightweight concrete policy expansion
- broader predictor fail-close for unsupported base structures

## 9. Dense-Carrier Heavy-Floor Hardening

After the flow-mapping pass in Section `6`, the next numerical question was tested directly against engine/API truth rather than against the simple route headline.

### 9.1 Reproduced Problem

Low-density mineral carriers were still able to claim heavy-concrete-specific floor lanes as long as they remained inside the broad `reinforced_concrete` support family.

Reproduced before this hardening:

- visible-layer stack:
  - `ceramic_tile 8`
  - `screed 50`
  - `generic_resilient_underlay 8`
  - `lightweight_concrete 150`
- result:
  - `Ln,w = 50`
  - `Rw = 58`
  - basis: `predictor_heavy_concrete_published_upper_treatment_estimate`

The same issue also reproduced on explicit predictor input:

- `structuralSupportType = reinforced_concrete`
- `impactSystemType = heavy_floating_floor`
- `baseSlab = { materialClass: heavy_concrete, thicknessMm: 150, densityKgM3: 1800 }`
- result:
  - `Ln,w = 50`
  - `Rw = 58`
  - basis: `predictor_heavy_concrete_published_upper_treatment_estimate`

Interpretation:

- dense concrete and low-density concrete-like carriers were being treated as numerically interchangeable on the heavy-concrete-specific upper-treatment lane
- the same broad family classification could also reopen the narrow heavy-floating Annex C formula lane for low-density carriers

This was not a UI wording issue.
It was a real solver-path overreach.

### 9.2 Root Cause

Three separate path families were all too permissive in the same way:

1. `estimateImpactFromLayers(...)`
   - heavy-floor formula activation only checked:
     - reinforced-concrete-like support classification
     - minimum surface mass
   - low-density `lightweight_concrete` could therefore still reach the heavy-floor formula corridor

2. `deriveHeavyConcretePublishedUpperTreatmentEstimate(...)`
   - the dedicated REGUPOL-supported upper-treatment lane only checked:
     - reinforced-concrete support family
     - heavy floating topology
     - generic resilient layer
   - carrier density was ignored

3. predictor-input adaptation
   - explicit `reinforced_concrete` predictor bases were always adapted back onto the catalog `concrete` source layer
   - this erased the density distinction before broader family matching ran

### 9.3 Implemented Fix

The fix was intentionally narrow and policy-aligned:

- introduce one shared dense-carrier eligibility rule for heavy-concrete-specific lanes
- threshold:
  - `densityKgM3 >= 2000`
- apply that rule in:
  - `impact-estimate.ts`
    - heavy bare / heavy floating narrow formula activation
  - `heavy-concrete-published-upper-treatment-estimate.ts`
    - dedicated heavy-concrete published upper-treatment lane
  - `floor-system-estimate.ts`
    - heavy-concrete-specific basis labeling for broader family estimates
  - `impact-predictor-input.ts`
    - explicit low-density reinforced-concrete predictor bases now adapt to `lightweight_concrete` instead of being collapsed onto `concrete`

What this fix does not do:

- it does not remove low-density mineral carriers from the broader reinforced-concrete family estimate corridor entirely
- it only stops them from claiming dense-concrete-specific heavy-floor lanes

This is the important design choice:

- broad family support remains available
- heavy-concrete-specific support becomes dense-carrier-only

### 9.4 Live 3010 Verification

Built app:

- `pnpm --filter @dynecho/web build`
- `pnpm --filter @dynecho/web start -- --hostname 127.0.0.1 --port 3010`

Observed live API cases:

1. Dense concrete remains unchanged

- endpoint: `POST /api/estimate`
- stack:
  - `ceramic_tile 8`
  - `screed 50`
  - `generic_resilient_underlay 8`
  - `concrete 150`
- result:
  - basis: `predictor_heavy_concrete_published_upper_treatment_estimate`
  - `Ln,w = 50`
  - `Rw = 58`
  - candidate ids: `["regupol_curve8_concrete_tile_lab_2026"]`

2. Visible `lightweight_concrete 150` now leaves the heavy-concrete-specific lane

- endpoint: `POST /api/estimate`
- stack:
  - `ceramic_tile 8`
  - `screed 50`
  - `generic_resilient_underlay 8`
  - `lightweight_concrete 150`
- result:
  - basis: `predictor_floor_system_family_general_estimate`
  - `Ln,w = 69.4`
  - `Rw = 53`
  - candidate ids:
    - `tuas_h2_concrete160_measured_2026`
    - `euracoustics_f0_bare_concrete_lab_2026`

3. Explicit low-density reinforced-concrete predictor input now adapts onto `lightweight_concrete`

- endpoint: `POST /api/impact-only`
- predictor input:
  - `structuralSupportType = reinforced_concrete`
  - `impactSystemType = heavy_floating_floor`
  - `baseSlab = { materialClass: heavy_concrete, thicknessMm: 150, densityKgM3: 1800 }`
- result:
  - basis: `predictor_floor_system_family_general_estimate`
  - `Ln,w = 69.4`
  - `Rw = 53`
  - source base layer: `lightweight_concrete`

Observed live workbench UI case with Playwright:

- simple workbench preset:
  - `Impact Floor`
- change only the base structure from `Concrete` to `Lightweight Concrete`
- route card changed from:
  - `Published heavy-concrete upper-treatment estimate`
  to:
  - `Published family blend estimate`
- weighted answer changed from:
  - `Ln,w 50 dB`
  to:
  - `Ln,w 69.4 dB`
- `Rw estimate` changed from:
  - `59 dB`
  to:
  - `55 dB`

Interpretation:

- dense concrete stayed on its validated heavy-concrete support corridor
- low-density carriers now remain supported, but only on the broader published-family lane

### 9.5 Regression Verification

Targeted high-risk engine run after the fix:

- `packages/engine/src/impact-predictor-input.test.ts`
- `packages/engine/src/predictor-published-family-estimate.test.ts`
- `packages/engine/src/predictor-branch-stability-sweep.test.ts`
- `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
- `packages/engine/src/calculate-impact-only.test.ts`
- `packages/engine/src/calculate-assembly.test.ts`
- `packages/engine/src/impact-common-floor-combinations.test.ts`
- `packages/engine/src/output-perturbation-sweep.test.ts`
- result:
  - `8 / 8` files passed
  - `298 / 298` tests passed

Full engine regression run after the fix:

- result:
  - `52 / 52` files passed
  - `442 / 442` tests passed

Full web regression run after the fix:

- result:
  - `45 / 45` files passed
  - `363 / 363` tests passed

### 9.6 Assessment

This change is materially different from a cosmetic basis relabel:

- low-density carriers no longer inherit dense-concrete-specific heavy-floor formulas or dedicated REGUPOL-style upper-treatment support
- dense-concrete validated corridors stay unchanged
- broader family support remains available instead of failing closed

That is the right numerical posture for this corridor:

- keep coverage
- remove false specificity
- preserve validated dense-concrete lanes

## 10. Invalid Explicit `base_structure` Hardening

### 10.1 Refined Diagnosis

After the dense-carrier hardening pass, the next broad-domain fragility was not another calibration miss.
It was an eligibility problem:

- explicit floor `base_structure` rows that are not real structural floor carriers could still enter floor-family estimation paths
- zero-density helper rows such as `air_gap` could also throw predictor-input schema errors instead of failing closed
- the live workbench could reproduce the same issue by reassigning a helper layer to `base_structure`

Catalog probe of `100 mm` single-layer explicit `base_structure` inputs showed:

- `111` catalog materials scanned
- `10` explicit errors before the fix
- `87` false family-archetype estimate activations
- `4` false family-general estimate activations
- `8` false CLT interpolation activations
- `2` heavy-bare activations

The important distinction is that these were not all the same bug:

1. Some helper rows crashed because predictor-input derivation tried to coerce an invalid `base_structure` into a slab with positive density.
2. Some non-structural mass rows did not crash; they silently entered broad family lanes because `deriveFloorSystemEstimate` only cared that an explicit floor role existed.
3. Some support products also inherited structural-family false positives from lexical tags such as `hollow-core`, `clt`, or `engineered-timber`.

### 10.2 Policy Chosen

The safe correction was not “clamp all weird inputs”.
The chosen policy is narrower:

- an explicit floor `base_structure` must be a recognized structural floor carrier
- if it is not, predictor-input derivation returns `null` instead of forcing the lane
- family floor estimation also returns `null` instead of broadening into a misleading published-family result

The eligibility rule stays permissive only for:

- known structural floor-carrier ids
- or mass materials tagged `structural` that also classify to a structural support family

That keeps custom structural decks alive while rejecting:

- `air_gap`
- `gypsum_board`
- `geniemat_*`
- `mw_t_impact_layer_*`
- screed / fill / support helper rows when manually misassigned to `base_structure`
- AAC / masonry wall blocks that are not curated as structural floor carriers

### 10.3 Live 3010 API Verification

Fresh build and start on `3010`:

- `pnpm --filter @dynecho/web build`
- `pnpm --filter @dynecho/web start`

Observed live cases after the fix:

1. `POST /api/impact-only` with `gypsum_board 100` as explicit `base_structure`

- status: `200`
- `supportedTargetOutputs = []`
- `unsupportedTargetOutputs = ["Rw", "Ln,w"]`
- `impact = null`
- `floorSystemEstimate = null`
- `floorSystemRatings.basis = screening_mass_law_curve_seed_v3`
- interpretation:
  - impact side now fails closed
  - legacy visible-stack airborne screening sidecar remains visible
  - no supported output is fabricated

2. `POST /api/impact-only` with `air_gap 100` as explicit `base_structure`

- status: `200`
- `supportedTargetOutputs = []`
- `unsupportedTargetOutputs = ["Rw", "Ln,w"]`
- `impact = null`
- `floorSystemEstimate = null`
- `floorSystemRatings = null`
- interpretation:
  - the old schema/predictor crash is gone
  - zero-density helper inputs now fail closed cleanly

3. `POST /api/estimate` with `ytong_aac_d700 150` as explicit `base_structure`

- status: `200`
- `supportedTargetOutputs = ["Rw"]`
- `unsupportedTargetOutputs = ["Ln,w"]`
- `impact = null`
- `floorSystemEstimate = null`
- `floorSystemRatings.Rw = 41`
- interpretation:
  - AAC no longer receives any floor-impact lane at all
  - airborne screening remains readable
  - no false floor-family impact claim survives

4. `POST /api/estimate` with `concrete 150` as explicit `base_structure`

- status: `200`
- `supportedTargetOutputs = ["Rw", "Ln,w"]`
- `impact.basis = predictor_heavy_bare_floor_iso12354_annexc_estimate`
- `impact.LnW = 74.5`
- `impact.scope = narrow_heavy_concrete_only`
- interpretation:
  - validated heavy concrete bare-floor corridor stays unchanged

5. `POST /api/estimate` with `clt_panel 140` as explicit `base_structure`

- status: `200`
- `supportedTargetOutputs = ["Rw", "Ln,w"]`
- `impact.basis = predictor_mass_timber_clt_bare_interpolation_estimate`
- `impact.LnW = 67.3`
- `impact.scope = family_estimate`
- `floorSystemEstimate.kind = family_general`
- interpretation:
  - validated CLT corridor stays alive

### 10.4 Live Playwright Verification

The same invalid topology was reproduced through the real workbench UI on `3010`:

1. load preset `Impact Floor`
2. click `Add Gypsum Board`
3. change the original `Concrete` row role from `Base structure` to `Unassigned`
4. change the added `Gypsum Board` row role from `Ceiling board` to `Base structure`

Before the UI hardening fix:

- the page crashed with a client-side exception
- console error:
  - `TypeError: Cannot read properties of null (reading 'fieldContinuationLabel')`

Root cause:

- the UI used `dynamicImpactTrace?.fieldContinuation !== "none"`
- when `dynamicImpactTrace` was `null`, that expression still evaluated truthy
- the component then immediately dereferenced `dynamicImpactTrace.fieldContinuationLabel`

After the UI fix on the same live flow:

- no crash
- no application-error heading
- `Ln,w` status:
  - `Unavailable on current path`
  - `Current lane: Impact floor corridor / No live lane`
- `Rw` status:
  - still live on the airborne side

Positive UI smoke checks were also repeated:

- `Impact Floor` preset still reports a live reinforced-concrete floor lane
- `Dataholz CLT Dry` still reports an exact live CLT floor lane

### 10.5 Code Changes

Engine-side:

- added explicit floor-base eligibility guard in:
  - `packages/engine/src/floor-base-structure-eligibility.ts`
- predictor-input derivation now rejects invalid explicit floor carriers in:
  - `packages/engine/src/impact-predictor-input.ts`
- family floor estimation now fails closed on invalid explicit carriers in:
  - `packages/engine/src/floor-system-estimate.ts`
- `impact-only` schema now accepts coherent lane-less fail-close results in:
  - `packages/shared/src/domain/impact-only.ts`

Web-side:

- fixed null guard in:
  - `apps/web/features/workbench/impact-trace-panel.tsx`
- fixed false-positive carry-over activation in:
  - `apps/web/features/workbench/workbench-shell.tsx`

### 10.6 Regression Verification

Post-fix targeted verification:

- engine targeted suites passed
- web targeted suites passed
- added render guard coverage:
  - `apps/web/features/workbench/impact-trace-panel.test.tsx`

Full suite after the invalid-`base_structure` hardening and UI null-guard fix:

- engine:
  - `52 / 52` files passed
  - `445 / 445` tests passed
- web:
  - `45 / 45` files passed
  - `364 / 364` tests passed

### 10.7 Assessment

This iteration improved correctness in two distinct layers without broadening scope:

- numerical/path correctness:
  - invalid explicit floor carriers no longer fabricate impact-family lanes
- UI robustness:
  - the real operator flow now survives lane-less fail-close results instead of crashing

The preserved corridors were checked both in tests and in the live `3010` build:

- reinforced-concrete heavy bare floor stays live
- CLT family floor stays live
- invalid helper-as-base states fail closed
- AAC wall blocks no longer masquerade as supported floor-impact carriers

## 11. Replace-Base Flow Diagnosis and Eligibility Hardening

This section captures a later diagnosis pass focused on one remaining operator-flow ambiguity:

- when an operator wants to "change the structural floor carrier", does the current UI action actually remove the old carrier from topology selection, or does it only append another candidate and leave the previous one visible to both airborne and impact lanes?

### 11.1 Initial Suspicion and Correction

An earlier suspicion was that the advanced workbench had lost the explicit `Replace base` action and was forcing users into an unsafe append-only flow.

That suspicion was wrong.

What happened in the first live check:

- port `3010` was serving an older standalone build
- the page did not contain newer copy already present in source, including the updated structural-carrier helper text
- because of that stale build, the action surface looked narrower than the current implementation

After rebuilding `@dynecho/web` and restarting the standalone app, the current source behavior was visible:

- `Replace base with CLT Panel` existed
- `Add CLT Panel` also existed

Interpretation:

- the missing-action diagnosis was not an implementation defect
- it was a stale-build observation defect
- live verification must therefore always be tied to a freshly rebuilt standalone artifact before drawing a UI-flow conclusion

### 11.2 Implementation Comparison: `Unassigned` Is Not Removal

The more important implementation finding was that `Unassigned` does not mean "remove this layer from topology."

Actual web/store behavior:

1. `updateFloorRole` only clears the explicit `floorRole`.
2. The row remains in the visible stack.
3. `normalizeRows` still forwards the row to the engine as a visible layer.
4. On the impact predictor side, some materials with structural or concrete semantics can have their role re-inferred even when the explicit role is absent.

This means the following two operator actions are not equivalent:

- `Add CLT Panel` + set old concrete row to `Unassigned`
- `Replace base with CLT Panel`

They lead to materially different solver inputs.

### 11.3 Engine Comparison: Generic Base Inference vs Floor Eligibility

The core mismatch was not in the solver arithmetic. It was in the action surface exposed by the UI.

Two different concepts coexist in code:

1. generic floor-role inference
2. explicit eligibility to act as a floor base structure inside the impact floor corridor

Observed comparison:

- generic inference treated several materials as `base_structure`, including:
  - `concrete`
  - `lightweight_concrete`
  - `clt_panel`
  - `osb`
  - `plywood`
  - `hollow_core_plank`
  - `steel_joist_floor`
  - `lightweight_steel_floor`
  - `composite_steel_deck`
  - `timber_joist_floor`
  - `timber_frame_floor`
  - `open_box_timber_slab`
  - `open_web_steel_floor`
- explicit engine floor-base eligibility rejected:
  - `osb`
  - `plywood`

Interpretation:

- the UI was showing `Replace base` for some materials that the engine itself would not honor as valid impact-floor carriers
- this was too permissive as an operator action surface

### 11.4 Live Playwright Verification of the Hypothesis

The hypothesis was tested directly on the rebuilt `3010` workbench.

#### Case A — Append Instead of Replace

Flow:

1. load `Impact Floor`
2. click `Add CLT Panel`
3. keep the original concrete row visible

Observed result:

- duplicate-base warning remained visible
- the predictor stayed on the broad reinforced-concrete family corridor
- no clean CLT archetype transition occurred

Interpretation:

- appending a second structural carrier does not represent a clean base replacement
- the predictor correctly parks on the conservative broad-family lane

#### Case B — Explicit Replace

Flow:

1. load `Impact Floor`
2. click `Replace base with CLT Panel`

Observed result:

- duplicate-base warning disappeared
- the workbench moved onto the CLT archetype family corridor

Interpretation:

- the replace flow is the correct operator action when the intent is to change the structural carrier
- the earlier mixed-stack readings were not evidence of a broken CLT solver path

#### Case C — Ineligible Replace Candidates

Before the fix, advanced UI still exposed replace actions such as:

- `Replace base with OSB`
- `Replace base with Plywood`

Live behavior for those ineligible replacements:

- no clean live impact lane opened
- the action surface therefore invited a topology change that the engine did not truly support

This was the actual product defect in the flow.

### 11.5 Why the Fix Should Not Narrow Generic Role Inference

A tempting fix would have been to change generic role inference so that `osb` and `plywood` never infer to `base_structure`.

That was rejected as too broad.

Reason:

- generic inference is used in more places than the specialized `replace base` action
- changing it could alter mixed-stack analysis and broader family fallback behavior outside the narrow problem being fixed
- exploratory evaluator checks showed that demoting these materials globally could create different mixed-family estimates rather than a clean and intentional fail-close

Safer conclusion:

- keep generic inference unchanged
- narrow only the explicit replace-base action surface
- harden the specialized replace action itself

### 11.6 Implemented Hardening

The implemented fix followed the narrowest stable policy.

Engine export:

- exported `isMaterialEligibleFloorBaseStructure` from `packages/engine/src/index.ts`

Advanced workbench:

- `Replace base` is now shown only when the material both:
  - infers as `base_structure`
  - and passes `isMaterialEligibleFloorBaseStructure`

Simple workbench:

- the same eligibility rule now gates the draft-based replace action

Store action:

- `replaceSingleBaseStructureRow(...)` now refuses ineligible replacements
- if a material is not eligible as a floor base structure, the action keeps the existing rows unchanged instead of mutating topology into an unsupported state

### 11.7 Live Post-Fix Verification on `3010`

After the hardening:

- `Replace base with CLT Panel` remained available
- `Replace base with Open-web Steel Floor` remained available
- `Replace base with OSB` no longer appeared
- `Replace base with Plywood` no longer appeared

Behavior checks:

- `Add CLT Panel` still keeps the duplicate-base warning and stays on the broad reinforced-concrete family lane
- `Replace base with CLT Panel` removes the duplicate-base warning and lands on the CLT archetype family lane

Interpretation:

- the UI action surface is now aligned with the engine's own floor-base eligibility policy
- the operator can still do a real base replacement for supported structural carriers
- ineligible sheet/helper products no longer present themselves as valid replacement carriers

### 11.8 Regression Verification

Targeted regression:

- added store-level coverage to ensure ineligible replacements are ignored and the validated heavy-concrete corridor stays unchanged

Suite results after the change:

- engine:
  - `52 / 52` files passed
  - `445 / 445` tests passed
- web:
  - `45 / 45` files passed
  - `366 / 366` tests passed

Build verification:

- `pnpm --filter @dynecho/web build` completed successfully and produced the standalone artifact used for live `3010` verification

### 11.9 Assessment

This iteration did not change the impact formulas.

It corrected a narrower but important source of user-induced false topology:

- the UI could previously present `Replace base` for materials that the engine itself would not treat as valid floor carriers

The fix is therefore structural rather than cosmetic:

- supported replacements still work
- unsupported replacements are no longer presented as legitimate operator actions
- the specialized replace path now follows the same eligibility policy as the engine
- validated dense concrete and CLT corridors were preserved

## 12. Replace-Base Default Thickness Alignment

### 12.1 Diagnosis

After the base-eligibility hardening, a second issue remained:

- the advanced `Replace base` action still used the generic `defaultThicknessForMaterial(...)`
- the simple shell draft composer also preserved the previous draft thickness when the material changed from the default `Vinyl Flooring 4 mm` draft into a structural carrier

That meant the operator could stay on a correct base-family corridor but still start from an obviously bad carrier thickness.

Observed live examples before the fix:

- `Hollow-core Plank` defaulted to `100 mm`
- `Steel Joist Floor` defaulted to `100 mm`
- `Lightweight Steel Floor` defaulted to `100 mm`
- `Composite Steel Deck` defaulted to `100 mm`
- `Open-box Timber Slab` defaulted to `370 mm`

These values are not all invalid in a universal sense, but they were outside the workbench's own guided sanity bands for the current floor-base role. That creates two bad outcomes:

- the UI immediately warns on a fresh operator action that should have been a sane starting point
- the replacement surface biases users toward misleading first-pass results before any intentional thickness edit

### 12.2 Why This Was a Real Bug

The issue was not only aesthetic.

- advanced replace used a role-agnostic default helper even though the action itself is role-specific
- simple shell material switching kept the previous draft thickness if the user had not yet intentionally edited it
- the initial floor draft is `Vinyl Flooring 4 mm`, so changing only the material could leave a structural carrier at `4 mm`

That made the simple shell semantically inconsistent with the advanced shell:

- advanced replace acted on a structural role but used generic defaults
- simple draft inference changed the role to `base_structure` but did not reliably normalize the thickness along with that role shift

### 12.3 Narrow Fix Strategy

The correct fix was not to widen inference or relax the guided warnings.

The narrow stable policy is:

- keep the generic material default helper unchanged for ordinary append flows
- add a role-aware default helper for `base_structure`
- only auto-replace thickness when the current draft still matches a known default and therefore is not a user-authored override

This preserves manual edits while making default-driven transitions sane.

### 12.4 Implemented Hardening

Implemented changes:

- added `defaultThicknessForMaterialInRole(...)` in `apps/web/features/workbench/workbench-materials.ts`
- added a `BASE_STRUCTURE_DEFAULT_THICKNESS_BANDS` map for structural floor carriers
- added `resolveThicknessForMaterialChange(...)` so draft thickness changes only when the previous value still corresponds to a default baseline
- updated advanced `Replace base` to use the role-aware base-structure default
- updated the simple shell draft flow so structural carrier selection normalizes thickness instead of inheriting `4 mm` vinyl state
- kept append flows and manual overrides unchanged

The role-aware default map currently hardens these carrier bands:

- `concrete`: `80..250 mm`
- `lightweight_concrete`: `80..250 mm`
- `heavy_concrete`: `100..300 mm`
- `clt_panel`: `100..300 mm`
- `hollow_core_plank`: `120..400 mm`
- `composite_steel_deck`: `120..250 mm`
- `steel_joist_floor`: `180..350 mm`
- `lightweight_steel_floor`: `160..350 mm`
- `timber_joist_floor`: `150..350 mm`
- `timber_frame_floor`: `120..300 mm`
- `open_box_timber_slab`: `120..350 mm`
- `open_web_steel_floor`: `180..450 mm`

### 12.5 Live Simple-Shell Verification on `3010`

Fresh standalone build was served on `3010` and the simple shell was re-tested from clean local storage.

Protocol:

- open `/workbench?view=simple`
- clear `dynecho-workbench-store`
- set `Study type = Floor`
- open `Add layer`
- switch `New layer material`

Post-fix results:

- `Steel Joist Floor` -> `180 mm`, `base_structure`, no guided-band warning
- `Lightweight Steel Floor` -> `160 mm`, `base_structure`, no guided-band warning
- `Composite Steel Deck` -> `120 mm`, `base_structure`, no guided-band warning
- `Hollow-core Plank` -> `120 mm`, `base_structure`, no guided-band warning
- `Open-box Timber Slab` -> `350 mm`, `base_structure`, no guided-band warning

Interpretation:

- the old `4 mm` vinyl carry-over is gone
- role inference and thickness normalization now move together for base carriers
- the simple shell no longer starts these structural drafts in an obviously self-contradictory state

### 12.6 Live Advanced Replace Matrix on `3010`

Fresh standalone build was also re-tested on `/workbench?view=advanced` using the `Impact Floor` preset.

Protocol:

- load `Impact Floor`
- click the visible `Replace base` action for each structural carrier
- read the resulting rows from live store state
- resolve the clicked scenario through the same live `3010` instance with `K = 2 dB` and `V = 50 m³`

Scope guards:

- `Replace base with OSB` was not present
- `Replace base with Plywood` was not present

Post-fix matrix:

- `Concrete` -> base `concrete 150`, `Rw 59`, `Ln,w 50`, `L'n,w 52`, `L'nT,w 50`
- `Lightweight Concrete` -> base `lightweight_concrete 140`, `Rw 54`, `Ln,w 70.9`, `L'n,w 72.9`, `L'nT,w 70.9`, `L'nT,50 71.9`
- `Heavy Concrete` -> base `heavy_concrete 180`, `Rw 62`, `Ln,w 50`, `L'n,w 52`, `L'nT,w 50`
- `CLT Panel` -> base `clt_panel 140`, `Rw 49`, `Ln,w 68`, `L'n,w 70`, `L'nT,w 68`, `L'nT,50 68`
- `Hollow-core Plank` -> base `hollow_core_plank 120`, `Rw 57`, `Ln,w 58.5`, `L'n,w 60.5`, `L'nT,w 58.5`
- `Composite Steel Deck` -> base `composite_steel_deck 120`, `Rw 59`, `Ln,w 68`, `L'n,w 70`, `L'nT,w 68`
- `Steel Joist Floor` -> base `steel_joist_floor 180`, `Rw 73`, `Ln,w 67.7`, `L'n,w 69.7`, `L'nT,w 67.7`, `L'nT,50 67.7`
- `Lightweight Steel Floor` -> base `lightweight_steel_floor 160`, `Rw 72`, `Ln,w 59`, `L'n,w 61`, `L'nT,w 59`, `L'nT,50 60`
- `Timber Joist Floor` -> base `timber_joist_floor 240`, `Rw 53`, `Ln,w 69`, `L'n,w 71`, `L'nT,w 69`
- `Timber Frame Floor` -> base `timber_frame_floor 220`, `Rw 52`, `Ln,w 54.3`, `L'n,w 56.3`, `L'nT,w 54.3`, `L'nT,50 55.7`
- `Open-box Timber Slab` -> base `open_box_timber_slab 350`, `Rw 55`, `Ln,w 67.7`, `L'n,w 69.7`, `L'nT,w 67.7`, `L'nT,50 67.7`
- `Open-web Steel Floor` -> base `open_web_steel_floor 200`, `Rw 75`, `Ln,w 61.1`, `L'n,w 63.1`, `L'nT,w 61.1`

Common invariants across the matrix:

- row count stayed `4`
- each click produced exactly one explicit `base_structure`
- no `outside the guided sanity band` warning appeared
- field continuation stayed explicit and traceable

### 12.7 Regression Verification

Targeted web coverage added:

- `apps/web/features/workbench/workbench-materials.test.ts`
- extra replace-base and guided-band assertions in `apps/web/features/workbench/workbench-store.test.ts`

Suite results after the change:

- web:
  - `46 / 46` files passed
  - `371 / 371` tests passed
- engine:
  - `52 / 52` files passed
  - `445 / 445` tests passed

Build verification:

- `pnpm --filter @dynecho/web build` completed successfully
- the live `3010` verification above was run against that fresh standalone build, not a stale deleted artifact

### 12.8 Assessment

This iteration did not change solver formulas, family eligibility, or field-continuation math.

It fixed a narrower but important operator-surface error:

- structural base defaults are now role-aware
- the simple shell no longer leaks the old `4 mm` draft into base-structure candidates
- advanced replace no longer seeds obviously off-band starting thicknesses for the affected carriers
- manual thickness edits remain preserved instead of being overwritten opportunistically

This is the correct kind of hardening for the current stage:

- it improves first-pass numerical sanity
- it keeps the operator surface aligned with the shell's own guided bands
- it avoids touching validated engine corridors or broad family inference rules

### 12.9 Automated Regression Lock

The live `3010` checks from this iteration are no longer only manual walkthrough steps.

Playwright coverage was added to `e2e/workbench.spec.ts` for three critical operator paths:

- simple shell structural-carrier draft normalization
- simple shell replace-base eligibility and clean CLT replacement
- advanced-shell full `Impact Floor` replace-base matrix across all visible structural carriers

The automated matrix now asserts:

- eligible carrier defaults land on sane base-structure thicknesses
- `OSB` and `Plywood` stay outside the replace-base surface
- clean replacements keep a single explicit `base_structure`
- post-click scenarios still resolve through live `/api/estimate` with the expected `Rw`, `Ln,w`, `L'n,w`, `L'nT,w`, and `L'nT,50` values

Full end-to-end verification after wiring those tests:

- `pnpm e2e` with explicit auth env passed
- result: `113 passed`

Meaning:

- this operator-surface hardening is now guarded at three levels:
  - targeted unit/store coverage
  - live `3010` walkthrough
  - full authenticated Playwright end-to-end regression
