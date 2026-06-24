# Excel Impact Product Candidate Rescreen Handoff - 2026-06-24

Document role: user-requested calculator/catalog boundary handoff for
the Excel impact-product candidate rescreen after impact product catalog
matcher hardening. This is a bounded calculator-integrity slice, not a
broad source crawl, not a generic seed import, not a formula retune, and
not a replacement for the active selected runtime-first wall chain.

Excel source reviewed:
`seedverisi/Akustik_Malzeme_ve_DeltaLnw_Veritabani (1).xlsx`.

Current selected calculator implementation action remains
`post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_plan`.
This handoff only records the impact product catalog boundary work and
the two exact Getzner rows that were safe to open.

## Selection Card

- User construction / formula family:
  `Getzner AFM29 11 mm` under a single concrete screed on a
  `160 mm` reinforced-concrete base slab, with no floor covering,
  suspended ceiling, ceiling cavity, ceiling fill, or upper fill.
- Target outputs opened:
  `Ln,w` and `DeltaLw` for the two exact official lab stacks.
- Route:
  exact official manufacturer product-system rows in
  `OFFICIAL_IMPACT_PRODUCT_CATALOG`; not the generic heavy-reference
  `product_property_delta` route.
- Required physical inputs:
  typed support family `reinforced_concrete`, one `concrete`
  `base_structure` layer at `160 mm`, one `screed` `floating_screed`
  layer with resolved surface mass `172 kg/m2` or `197 kg/m2`, one
  `getzner_afm_29` `resilient_layer` at `11 mm`, and absent finish /
  ceiling / upper-fill roles.
- `needs_input` behavior:
  no new needs-input branch was added. If the exact row criteria do not
  match, the catalog exact row does not activate and the existing
  formula / lower-bound / unsupported behavior owns the request.
- Unsupported boundaries that remain blocked:
  Getzner dry gypsum-board package without a typed dry floating-board
  role, Getzner generic AFM headline DeltaLw rows, DAMTEC screed-mass
  dependent DeltaLw rows without a live `Ln,w` / reference-basis row,
  Isolgomma UPGREI / UPROLL / GREI / ROLL / HIGHMAT / BIFLOOR headline
  rows without encoded screed/base boundaries, DANOSA `DeltaLn` rows,
  Forbo generic acoustic-vinyl rows, generic range rows, and damping /
  barrier product references outside an owned damping or airborne
  product-system route.

## Matcher Hardening Context

The rescreen depends on the landed impact product catalog hardening:

- shared catalog criteria now support typed
  `supportingElementFamilies`, role-level `surfaceMassKgM2`,
  `surfaceMassRangeKgM2`, `surfaceMassToleranceKgM2`, and row-level
  `thicknessToleranceMm`;
- catalog matching is fail-closed when a row declares those criteria;
- direct `officialImpactCatalogId` selection no longer bypasses stack
  criteria for product-delta or lower-bound rows;
- small product layers use tighter row-level thickness tolerances
  instead of the global `+/-2 mm` fallback;
- lower-bound support rows are also gated by their stack boundary;
- generic Getzner AFM product-delta rows stay parked.

Primary implementation surfaces:

- `packages/shared/src/domain/impact-product-catalog.ts`
- `packages/engine/src/impact-product-catalog.ts`
- `packages/engine/src/calculate-impact-only.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/catalogs/src/impact/official-product-catalog.ts`

## Landed Exact Rows

Implementation file:
`packages/catalogs/src/impact/official-product-catalog.ts`.

Two official Getzner AFM29 rows were added as `exact_system` rows:

- `getzner_afm29_rc160_screed172_exact_2026`
  - `LnW: 49`
  - `DeltaLw: 29`
  - `baseStructure`: one `concrete` layer at `160 mm`
  - `floatingScreed`: one `screed` layer at `172 kg/m2`
  - `resilientLayer`: one `getzner_afm_29` layer at `11 mm`
  - `referenceFloorType: getzner_afm29_rc160_screed172_lab`
- `getzner_afm29_rc160_screed197_exact_2026`
  - `LnW: 46`
  - `DeltaLw: 33`
  - `baseStructure`: one `concrete` layer at `160 mm`
  - `floatingScreed`: one `screed` layer at `197 kg/m2`
  - `resilientLayer`: one `getzner_afm_29` layer at `11 mm`
  - `referenceFloorType: getzner_afm29_rc160_screed197_lab`

Source:
`https://www.getzner.com/media/14078/download/Data%20Sheet%20Acoustic%20Floor%20Mat%2029%20EN.pdf?v=5`.

The Getzner rows carry both `Ln,w` and `DeltaLw`, so they do not use the
fixed `78 dB` heavy-reference derivation used by the product-delta lane.

## Parked Candidate Decisions

- REGUPOL sound / REGUFOAM rows:
  already represented as material seeds and lower-bound support rows
  with heavy-base and screed surface-mass boundaries. No duplicate rows
  were added.
- Schlueter DITRA-SOUND, Isolgomma SYLCER 3, and Tarkett Comfort /
  iQ Optima:
  already represented as bounded product-delta rows. They remain gated
  to their concrete support / tile or floor-covering stack shapes.
- Isolgomma UPGREI, UPROLL, GREI, ROLL, HIGHMAT 30, and BIFLOOR:
  material seeds stay available for formula routing where dynamic
  stiffness is known. Headline DeltaLw rows remain parked because their
  screed/base construction boundary is not encoded enough for live
  product rows.
- DAMTEC estra / estra 3D / 3D 17/8:
  material seeds stay available for formula routing. Screed-dependent
  DeltaLw rows remain parked because the current live catalog route does
  not have a same-row `Ln,w` or typed bare/reference basis for those
  systems.
- Getzner AFM29 dry gypsum-board system:
  source data appears exact, but the current floor role model does not
  cleanly encode the dry gypsum-board floating package as a distinct
  package owner. Parked until that boundary exists.
- DANOSA CONFORDAN 900 HS:
  source declares `DeltaLn = 23 dB`, not a current `DeltaLw` /
  `Ln,w`-ready row with a compatible basis. Parked.
- Forbo Sarlon / Eternal / Modul'up and Tarkett iQ Natural:
  floor-covering identity material seeds remain useful, but live
  product rows stay parked unless exact product thickness and test stack
  boundaries are encoded.
- Generic range rows, Pyrotek Decidamp SP150 damping rows, 3M damping
  film rows, and DANOSA barrier product references:
  not imported into live acoustic outputs because the current calculator
  does not own the required damping/product-system route.

## Contract Evidence

Updated engine contracts:

- `packages/engine/src/material-catalog-expansion-direct-calculation-contract.test.ts`
  proves the two Getzner exact rows activate only on the encoded
  `160 mm` reinforced-concrete + exact screed surface-mass + `11 mm`
  AFM29 stacks, and proves wrong screed mass, wrong support family, or
  wrong AFM thickness no-match.
- `packages/engine/src/impact-catalog-integrity.test.ts`
  now permits only the two encoded Getzner exact rows and continues to
  reject generic Getzner product-delta catalog rows.
- `packages/engine/src/calculate-impact-only.test.ts`
  remains green for direct official catalog selection guard behavior.

## Counters

- `impactMatcherSchemaFieldsAdded: 5`
- `impactExactSystemRowsAdded: 2`
- `sourceRowsImported: 2`
- `materialSeedRowsAdded: 0`
- `newCalculableRequestShapes: 2`
- `newCalculableTargetOutputs: 4`
- `runtimeBasisPromotions: 2`
- `runtimeValuesMoved: 4`
- `runtimeFormulaRetunes: 0`
- `frontendImplementationFilesTouched: 0`
- `genericDeltaLwRowsImported: 0`

## Validation

Focused validation passed:

- `pnpm exec vitest run src/material-catalog-expansion-direct-calculation-contract.test.ts src/impact-catalog-integrity.test.ts src/calculate-impact-only.test.ts --maxWorkers=1`
  from `packages/engine`: `3 files / 127 tests passed`
- `pnpm --filter @dynecho/catalogs test`
- `git diff --check`

Current calculator gate passed:

- shared schema gate: `2 files / 23 tests passed`
- engine focused gate: `836 files / 4571 tests passed`
- web focused gate: `127 files / 508 passed / 18 skipped`
- repo build: `5/5 tasks successful`
- whitespace guard: passed

Known non-fatal validation noise:

- web tests emit expected `zustand persist middleware` storage warnings
  in the test environment;
- Next build emits known optional `sharp/@img` dependency warnings
  through `@turbodocx/html-to-docx`, but the build succeeds.

## Next-Agent Guardrails

- Do not reintroduce generic Getzner AFM product-delta rows.
- Do not copy DAMTEC, Isolgomma, DANOSA, Forbo, Tarkett, or generic
  range headline values into live rows without exact stack/basis
  criteria.
- Do not use `product_property_delta` when the source row has its own
  `Ln,w`; use `exact_system` with row-specific criteria.
- If a future source row needs screed/base conditions, encode typed
  support family and surface mass criteria before making it live.
- If a future row asks for dry-board floating packages, add a typed
  package boundary before matching the Getzner dry gypsum-board system.
