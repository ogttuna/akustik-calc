# Workbench V2 Common Layer Preset Seed Plan - 2026-06-15

## Status

Planning and source-fit audit started on 2026-06-15.
Implementation first pass landed on 2026-06-15 for Workbench V2 common `Rw`
wall presets only. The first pass adds the built-in seed module, read-only
Common presets UI section, common preset restore flow, source metadata tests,
and browser smoke validation. It does not touch engine formulas, source row
promotion, or personal preset storage semantics.

This plan covers a user-facing seed library for common Workbench V2 layer combinations and a separate source-reference comparison harness. It must not change calculator formulas, engine routing, metric aliases, or source-promotion policy.

## User Goal

The requested product idea:

- collect a few widely used layer combinations from public sources
- seed them so users can start from them instead of building every stack manually
- use the same seeded stacks as useful regression/reference cases
- compare DynEcho outputs such as `Rw`, `R'w`, `DnT,w`, and related metrics against published values where the source basis is clear

## Key Decision

Implement this as two related but separate surfaces:

1. `Common preset seeds`

   User-facing starter templates for Workbench V2. These can be loaded into the calculator and optionally saved into the user's preset library.

2. `Source reference comparisons`

   Test/diagnostic records that store the public source value, metric basis, source URL, tolerance, and whether the value is allowed to be treated as a hard expectation.

Do not merge these into engine exact-source rows unless a later source-promotion slice proves exact construction identity, metric ownership, tolerance, and route boundary.

## Why Separation Is Required

The user-facing preset can be useful even when the external value is not a strict calculator truth.

Examples:

- A North American `STC` assembly can be a good common seed, but it is not automatically an ISO `Rw` row.
- A field `DnT,A,k` or `DnT,w` reference depends on room volume, reverberation time, flanking, seals, junctions, and installation quality.
- A product catalog row may publish a rating for a branded board/stud/insulation system that DynEcho represents using generic material IDs.

Therefore:

- seeds may use generic materials and show source notes
- comparison tests may be broad tolerance / diagnostic
- engine runtime must continue to calculate through owned routes or return `needs_input` / `unsupported`
- source rows must not be promoted by this feature

## Current Repo Findings

### Existing Preset Surface

Legacy workbench presets live in:

```text
apps/web/features/workbench/preset-definitions.ts
apps/web/features/workbench/simple-workbench-preset-groups.ts
```

They already include starter, exact, bound, product, and fallback group concepts. They are legacy workbench definitions and should not be mutated blindly for Workbench V2.

Workbench V2 now has user preset storage:

```text
apps/web/lib/workbench-v2-preset-storage.ts
apps/web/app/api/workbench-v2/presets
apps/web/features/workbench-rebuild/workbench-preset-library-panel.tsx
```

Common seed presets should fit beside this new Workbench V2 preset feature, not inside project saved combinations.

### Existing Source Benchmark Fixtures

The repo already has source benchmark fixtures:

```text
packages/engine/fixtures/reference-benchmarks-official-primary-2026.json
packages/engine/fixtures/reference-benchmarks-british-gypsum-official-2026.json
packages/engine/fixtures/reference-benchmarks-siniat-official-2026.json
packages/engine/fixtures/reference-benchmarks-field-official-2026.json
packages/engine/fixtures/reference-benchmarks-impact-validation-2026.json
```

These are valuable because they already encode source URL, expected value, tolerance, material layers, and context metadata. They should be treated as the first source audit input before doing broader internet collection.

### Existing Source-Posture Rules

Many calculator docs and tests explicitly warn against broad source crawling and unsafe source promotion. This new feature must respect those constraints.

Allowed:

- seed common combinations as starter templates
- store source metadata for user/debug visibility
- compare current calculator outputs against published references under declared tolerance

Not allowed:

- importing source rows as exact runtime values
- aliasing `STC` to `Rw`
- using `DnT,A,k` as `DnT,w`
- changing formulas to match a seed
- touching `packages/engine` unless a later calculator/source slice explicitly owns that work

### Workbench V2 Fit Audit

The current Workbench V2 shape is compatible with built-in common presets:

```text
apps/web/features/workbench-rebuild/workbench-v2-project-snapshot.ts
apps/web/features/workbench-rebuild/workbench-v2-presets.ts
apps/web/features/workbench-rebuild/workbench-preset-library-panel.tsx
apps/web/features/workbench-rebuild/calculator-workbench.tsx
```

Important implementation facts:

- `WorkbenchV2ProjectSnapshot` already persists `mode`, `layers`,
  `selectedOutputs`, `context`, `customMaterials`, and
  `materialVisualOverrides`.
- Existing personal presets compare draft equality using `layers`, `context`,
  `customMaterials`, `materialVisualOverrides`, `mode`, and `selectedOutputs`.
  Common presets should use the same equality posture when warning before
  replacing the current draft.
- The restore path already applies `materialVisualOverrides`, so common presets
  can carry illustration colors when there is a source/UX reason. For first
  pack, avoid unnecessary visual overrides; material default colors are enough.
- The preset panel is already a hidden/on-demand surface. Common presets should
  be added there instead of adding visible project/preset controls to the main
  calculator surface.
- The common preset module should depend on snapshot types/builders only. It
  should not import API routes, filesystem storage, project storage, or engine
  runtime code.

Existing catalog material IDs that fit first and second seed waves:

```text
gypsum_board
acoustic_gypsum_board
diamond_board
rockwool
glasswool
glasswool_board
air_gap
ytong_g5_800
ytong_aac_d700
porotherm_pls_100
porotherm_pls_140
porotherm_pls_190
screed
generic_resilient_underlay
generic_resilient_underlay_s30
```

Likely first-pack mapping:

| Source product | Local material mapping | Note |
| --- | --- | --- |
| standard gypsum board / GKB | `gypsum_board` | acceptable generic starter |
| Gyproc SoundBloc / Siniat dB / Siniat Universal | `acoustic_gypsum_board` | product-specific board is approximated |
| Knauf Diamant | `diamond_board` | closest named local material |
| Deciwool / mineral wool | `rockwool`, `glasswool`, or `glasswool_board` | choose by source wording and local role support |
| empty stud cavity | `air_gap` | keep no-insulation rows explicit |

Layer-order rule:

- Wall presets should preserve physical order from side A to side B.
- Double-leaf/framed examples must include explicit wall topology context where
  the calculator route requires it: side A leaf indices, cavity indices, side B
  leaf indices, cavity depth, fill coverage, absorber class, frame bridge class,
  support topology, and support spacing.
- If a preset cannot provide required topology safely, it may still be a starter
  stack, but source comparison must accept `needs_input`.

UI fit:

- `My presets` remains the user-owned list.
- `Common presets` should be a compact read-only list in the same panel.
- Avoid long source explanations in-row. Use concise metadata chips and keep
  details available through title/description or a small expandable detail row.
- Do not require a project to use or save presets. Saving creates a personal
  preset, not a project artifact.

## Public Source Audit - Initial Candidates

These are initial candidates found from public technical sources. They are not yet implementation approval by themselves; each row still needs final mapping to Workbench V2 materials, roles, context fields, and test tolerance.

### Candidate 1 - Knauf W112 GKB + Deciwool 70 C75

Source:

```text
https://knauf.com/api/download-center/v1/assets/589f6519-4625-4e62-9fd2-3c9e8b71cfcd?download=true
```

Published basis:

- lab airborne measurement
- UNI EN ISO 10140-2:2021
- ISO 717-1 rating
- `Rw (C, Ctr) = 50 (-2, -8) dB`

Construction summary:

- 75 mm C-stud, 600 mm centres
- double 12.5 mm Knauf GKB boards each side
- 70 mm Deciwool mineral wool in cavity
- nominal total thickness 125 mm

Repo mapping candidate:

- `gypsum_board`, 12.5 mm
- `gypsum_board`, 12.5 mm
- split cavity with 70 mm `glasswool` or `rockwool`
- `gypsum_board`, 12.5 mm
- `gypsum_board`, 12.5 mm
- context: lab, line connection, light steel stud, 600 mm spacing, good airtightness

Status:

- Good first seed and benchmark candidate.
- Already resembles `knauf_lab_416702_primary_2026` in `reference-benchmarks-official-primary-2026.json`.

### Candidate 2 - Knauf mixed GKB Advanced + Diamant + Deciwool 70 C75

Source:

```text
https://knauf.com/api/download-center/v1/assets/c0933b87-57c9-470d-8cc1-4932a75bd8ee?download=true
```

Published basis:

- lab airborne measurement
- UNI EN ISO 10140-2:2010
- ISO 717-1 rating
- `Rw (C, Ctr) = 54 (-2, -6) dB`

Construction summary:

- 75 mm C-stud, 600 mm centres
- one 12.5 mm GKB Advanced + one 12.5 mm Diamant each side
- 70 mm Deciwool mineral wool in cavity
- nominal total thickness 125 mm

Repo mapping candidate:

- `gypsum_board`, 12.5 mm
- `diamond_board` or `acoustic_gypsum_board`, 12.5 mm
- split cavity with 70 mm `glasswool` or `rockwool`
- `gypsum_board`, 12.5 mm
- `diamond_board` or `acoustic_gypsum_board`, 12.5 mm
- context: lab, line connection, light steel stud, 600 mm spacing, good airtightness

Status:

- Good seed if the UI can explain generic material substitution.
- Benchmark should be tolerance-based unless exact board mapping is owned.

### Candidate 3 - ROCKWOOL interior steel stud AFB assemblies

Source:

```text
https://www.rockwool.com/siteassets/o2-rockwool/documentation/technical-guides/commercial/acoustic-wall-assemblies-catalog-techincal-guide.pdf
```

Published basis:

- catalog lists tested wall assemblies
- includes STC, OITC, test/report number, stud size, spacing, gypsum finish, insulation product and thickness

Example rows:

- 5/8 inch gypsum, 6 inch steel stud, 16 inch spacing, 3 inch AFB, STC 50 / OITC 34
- 1/2 inch gypsum, 3 5/8 inch steel stud, 24 inch spacing, 3 inch AFB with resilient channel, STC 53
- 2x 1/2 inch gypsum, 2 1/2 inch steel stud, 24 inch spacing, 1.5 inch AFB, STC 53

Repo mapping candidate:

- useful as common North American `STC` seed examples
- not usable as `Rw` without a dedicated metric-basis policy

Status:

- Good user seed candidates.
- Diagnostic comparison should target `STC` only, not `Rw`.

### Candidate 4 - USG sealed gypsum + sound attenuation blanket example

Source:

```text
https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf
```

Published basis:

- brochure example states a properly sealed wall assembly with 5/8 inch gypsum each side and 1-1/2 inch sound attenuation blanket in cavity achieves `STC 53`
- same text highlights seal quality as a major driver

Repo mapping candidate:

- `gypsum_board` or `acoustic_gypsum_board`, 15.9 mm each side
- 38 mm insulation in cavity
- context must include good sealing / airtightness

Status:

- Good educational/common seed candidate.
- Weak as a hard benchmark unless full stud size, spacing, and test report are captured from a detailed table row.

### Candidate 5 - Existing field references from Knauf KOMO

Source in repo fixture:

```text
packages/engine/fixtures/reference-benchmarks-field-official-2026.json
```

Examples:

- W111 50/75 with one 12.5 mm board each side, no mineral wool, `DnT,A,k 27 dB`
- W112 50/100 with double 12.5 mm board each side and 40 mm mineral wool, `DnT,A,k 43 dB`
- W112 50/100 with double Diamond Board and 40 mm mineral wool, `DnT,A,k 50 dB`

Status:

- Useful for field-context demo seeds.
- Must not be presented as `DnT,w` unless the metric basis is explicitly converted/owned.

## Research Round Findings

### Round 1 - Existing Repo Fixtures First

The safest starting point is not a fresh internet crawl. The repo already
contains curated official fixtures with metric basis, expected value, context,
source URLs, and tolerance posture. These should anchor the first candidate
pack because they have already passed at least one local source hygiene pass.

Best first-source families from local fixtures:

| Family | Why useful | First-slice posture |
| --- | --- | --- |
| Knauf W112 lab references | common steel stud + gypsum + mineral wool wall, ISO `Rw` | seed + diagnostic comparison |
| Siniat partition references | broad range of 15 mm board / glass wool metal stud walls, ISO `Rw` | seed + diagnostic comparison after exact row selection |
| British Gypsum GypWall references | common UK drywall systems with explicit system IDs and `Rw` values | seed + diagnostic comparison after exact row selection |
| Knauf KOMO field references | useful field-context examples | seed only or diagnostic under explicit `DnT,A,k` basis |

Do not use fixture presence as permission to promote source values into runtime
exact rows. This preset feature is a user workflow feature, not a calculator
source-ingestion slice.

### Round 2 - Public Official Wall Sources

The second pass confirms that official wall data is much stronger than floor
data for a first seed pack.

Strong ISO `Rw` candidates:

| Candidate | Source status | Metric posture | Implementation note |
| --- | --- | --- | --- |
| Knauf W112 GKB + 70 mm Deciwool | official Knauf download and local fixture-like mapping | ISO `Rw` lab | first-pack candidate |
| Knauf W112 Diamant + 70 mm Deciwool | official Knauf download and local fixture-like mapping | ISO `Rw` lab | first-pack candidate; clean local `diamond_board` mapping |
| Knauf W112 mixed GKB Advanced + Diamant | official Knauf download and strong layer detail | ISO `Rw` lab | alternate candidate; generic GKB Advanced mapping needs a source note |
| Siniat CS70R-15dB-50G | current official Siniat system page, 15 mm dB board, 70 mm C-stud, 50 mm glass mineral wool | ISO `Rw` | first-pack candidate; stronger than the brochure-only Universal row |
| Siniat AS70R-212dB-50G | current official Siniat system page, acoustic stud, double 12.5 mm dB boards, 50 mm glass mineral wool | ISO `Rw` | strong v1.1 or alternate high-performance seed |
| British Gypsum A206A281 | official technical spec gives 15 mm SoundBloc each side, AcouStud, no insulation, `Rw 45` | ISO `Rw` lab/system spec | good contrast seed: single-layer heavy board without wool |
| Siniat plywood + Universal board rows | current Siniat brochure, explicit ply plus gypsum board systems | ISO `Rw + Ctr`; board substitution needed | second pack because plywood layer must map carefully |

Useful STC-only candidates:

| Candidate | Source status | Metric posture | Implementation note |
| --- | --- | --- | --- |
| ROCKWOOL Acoustic Wall Assemblies Catalog | current 05/2026 official catalog, tested steel/wood stud rows | `STC` / `OITC`, not ISO `Rw` | useful North American common preset, diagnostic only |
| USG Acoustical Assemblies SA200 | official brochure, educational examples and assembly tables | `STC`, not ISO `Rw` | useful later if exact row captured from table |
| PABCO Sound Design Guide | current official guide with many wall assemblies | `STC`, not ISO `Rw` | useful later for North American pack |
| National Gypsum SoundBook | official/industry guide, many assemblies | `STC`, not ISO `Rw` | useful later after exact-row capture |

Rule for STC rows:

- They can be user-facing common presets.
- They can be diagnostic comparisons only for `STC`.
- They must not be compared to, substituted for, or displayed as `Rw`.

### Round 3 - Floor, Ceiling, and Impact Sources

Floor and ceiling sources are valuable but should not be the first seed pack.
The public sources found in this pass often publish a product reduction or a
field value rather than a full calculator-ready construction identity.

Observed source patterns:

| Source family | Typical published data | Risk |
| --- | --- | --- |
| Mapei Mapesilent | `DeltaLw`, `L'n,w`, dynamic stiffness for under-screed products | product layer is useful, but full base slab/screed/field context must be represented |
| British Gypsum GypFloor Silent | ceiling/floor system guidance and product components | useful as UI starter, but hard benchmark needs exact floor construction and metric basis |
| Weyerhaeuser / wood joist guides | `STC` and `IIC` floor/ceiling assemblies | North American basis; not `Rw` / `Ln,w` |
| Robust Details | robust floor treatments and performance deltas | regulatory/detail pack; should be handled as field/detail source, not generic lab truth |
| Mass timber / WoodWorks catalogs | measured CLT floor/wall assemblies | promising second-wave source set, but exact layer mass and connection details matter |

Floor first-slice rejection reasons:

1. `DeltaLw` is a layer/product improvement, not a complete floor result.
2. `L'n,w` is a field metric and depends on receiving space and installation.
3. `IIC` is not `Ln,w` and must not be aliased.
4. Workbench V2 can express floor layers, but calculator ownership may require
   dynamic stiffness, load basis, field K, receiving volume, or low-frequency
   companion inputs.

Recommendation:

- Use floor sources in a second seed pack after the first wall seed pack is
  stable.
- Start floor seeds as "starter stacks" with source metadata only.
- Add diagnostic comparisons only where the source metric basis is owned by the
  current calculator route and the required context fields are present.

### Round 4 - Masonry, AAC, Clay Block, and CLT Sources

Masonry/AAC/CLT sources are useful, but they should be second-wave seeds unless
the local material and source mapping are already exact.

Findings:

- Xella/Ytong official documents line up well with existing local AAC material
  IDs and existing fixture rows.
- Wienerberger/Porotherm public sources describe acoustic suitability, but exact
  `Rw` row extraction needs a narrower official product/system document.
- CLT and mass-timber references are valuable for expanding beyond drywall, but
  exact CLT grade, thickness, linings, cavities, resilient mounts, and fasteners
  must be preserved before any hard comparison.

Second-wave candidate posture:

| Family | Why not first pack | Safe later usage |
| --- | --- | --- |
| Ytong 100 mm with skim plaster | likely already covered by local fixture, less useful than common drywall starter for first UX slice | add as masonry/AAC common preset once exact local fixture row is chosen |
| Porotherm clay block | exact acoustic rows need stronger source capture | add only after source-row extraction |
| CLT walls/floors | details are sensitive and floor metrics are mixed | add as separate mass-timber pack |

### Round 5 - Exact Row Extraction and v1 Refinement

The v1 seed list should be refined to an `Rw`-first pack. Mixing `Rw`, field
`DnT,A,k`, and North American `STC` in the first visible built-in list would
test many guardrails at once and make the UX harder to explain. Keep `STC`
sources as a separate North America pack after the `Rw` workflow is stable.

Extracted v1-ready rows:

| Seed | Source facts | Workbench V2 snapshot mapping | Source-reference posture |
| --- | --- | --- | --- |
| Knauf W112 GKB + Deciwool 70 C75 | Test report 416702, 2024-05-09, ISO 10140-2 / ISO 717-1, `Rw 50`, `C -2`, `Ctr -8`, total 125 mm, mass 35 kg/m2, two 12.5 mm GKB each side, C75 studs at 600 mm, 70 mm Deciwool at 12 kg/m3 | `gypsum_board` x2 side A, `air_gap` 5 mm + `glasswool_board` 70 mm cavity, `gypsum_board` x2 side B; topology indices `1, 2` / `3, 4` / `5, 6`; cavity depth `75`; support `single_shared_stud`; spacing `600` | visible source metadata + diagnostic `Rw` comparison with generic material tolerance |
| Knauf W112 Diamant + Deciwool 70 C75 | Test report 416889, 2024-05-15, ISO 10140-2 / ISO 717-1, `Rw 55`, `C -2`, `Ctr -5`, total 125 mm, mass 54 kg/m2, two 12.5 mm high-density Diamant boards each side, C75 studs at 600 mm, 70 mm Deciwool at 12 kg/m3 | `diamond_board` x2 side A, `air_gap` 5 mm + `glasswool_board` 70 mm cavity, `diamond_board` x2 side B; same topology as W112 GKB | visible source metadata + diagnostic `Rw` comparison; this is stronger than mixed GKB Advanced + Diamant for local material mapping |
| Siniat CS70R-15dB-50G | Official Siniat system page, one 15 mm Siniat dB Board each side, CS70/Rx C-stud at 600 mm, 50 mm glass mineral wool, `Rw 50`, nominal thickness 100 mm | `acoustic_gypsum_board` side A 15 mm, `air_gap` 20 mm + `glasswool_board` 50 mm cavity, `acoustic_gypsum_board` side B 15 mm; topology indices `1` / `2, 3` / `4`; cavity depth `70`; support `single_shared_stud`; spacing `600` | visible source metadata + diagnostic `Rw` comparison |
| British Gypsum A206A281 | Official technical spec, one 15 mm Gyproc SoundBloc each side, Gypframe 92 AS 50 AcouStuds at 600 mm, no insulation, `Rw 45`, nominal thickness 124 mm, mass 27 kg/m2 | `acoustic_gypsum_board` side A 15 mm, `air_gap` 92 mm cavity, `acoustic_gypsum_board` side B 15 mm; topology indices `1` / `2` / `3`; cavity depth `92`; fill `empty`; support likely `single_shared_stud`; spacing `600` | visible source metadata + diagnostic `Rw` comparison with broader tolerance |

Strong alternate rows:

| Seed | Reason to hold for v1.1 |
| --- | --- |
| Knauf W112 mixed GKB Advanced + Diamant + Deciwool 70 C75, `Rw 54` | useful, but local material mapping is less direct than full Diamant; keep as alternate high-mass variant |
| Siniat AS70R-212dB-50G, `Rw 56` | useful high-performance acoustic-stud row; good after the baseline CS70R row proves topology restoration |
| ROCKWOOL ISS-21 or similar `STC 50` steel stud row | useful North American seed, but should live under an explicit `STC` pack, not the first `Rw` pack |

Extraction notes:

- The Knauf Deciwool product page lists the acoustic certificates and confirms
  the related `Rw 50`, `Rw 54`, and `Rw 55` certificate families. Prefer the
  individual report PDFs for exact layer data.
- Some PDF text extraction around Knauf report 416702 has a misleading English
  line in one extracted passage. The cover, report title, schematic legend, and
  local fixture all identify the 416702 row as GKB. Implementation should use
  exact PDF lines plus local fixture cross-check, not a single extracted line.
- Siniat Universal Board brochure rows remain useful, but the official
  `CS70R-15dB-50G` system page is cleaner for v1 because it names one system,
  one layer stack, and one `Rw` value.

## Prioritized Seed Pack v1

The first implementation should stay to 4 wall presets. That is enough to
prove the UX, storage separation, source metadata model, and calculator restore
path without expanding metric risk.

Recommended v1:

1. `Knauf W112 double gypsum + mineral wool`
   - basis: ISO lab `Rw`
   - purpose: common double-board metal stud baseline
   - expected behavior: calculator may calculate or request exact context, but
     UI seed application must always work

2. `Knauf W112 Diamant + mineral wool`
   - basis: ISO lab `Rw`
   - purpose: show higher-mass board variant
   - refinement: prefer full Diamant `Rw 55` for v1 because local
     `diamond_board` mapping is cleaner; keep mixed GKB Advanced + Diamant as
     an alternate

3. `Siniat CS70R-15dB-50G`
   - basis: ISO `Rw`
   - purpose: simple single-layer acoustic board + glass wool wall
   - edge: `Siniat dB Board` maps to `acoustic_gypsum_board` until product
     material exists

4. `British Gypsum A206A281 SoundBloc single-layer wall`
   - basis: ISO lab/system `Rw`
   - purpose: useful contrast case with no cavity insulation
   - edge: no-insulation cavity must be represented explicitly, not silently
     filled by a default absorber

Optional v1.1 after UI validation:

- `Siniat AS70R-212dB-50G`
- `ROCKWOOL North America steel stud STC wall`
- `Ytong 100 mm AAC with skim plaster`
- `Siniat plywood + Universal board`
- `Knauf KOMO field-context W112`

## Source Backlog

Keep this backlog explicit so implementation does not require another broad
search pass before the first seed module.

### First-Pack Sources

| Source | URL | Intended use |
| --- | --- | --- |
| Knauf W112 GKB + Deciwool | `https://knauf.com/api/download-center/v1/assets/589f6519-4625-4e62-9fd2-3c9e8b71cfcd?download=true` | ISO `Rw` wall seed and diagnostic reference |
| Knauf W112 Diamant + Deciwool | `https://knauf.com/api/download-center/v1/assets/f4c73202-1613-4953-b2dc-666f67ab1fab?download=true` | ISO `Rw` high-mass board variant |
| Siniat CS70R-15dB-50G | `https://www.siniat.co.uk/en-gb/products-and-systems/systems/partition-systems/cs70r-15db-50g/` | ISO `Rw` single-layer acoustic board and glass wool wall |
| British Gypsum A206A281 technical spec | `https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a206a281-en.pdf` | single-layer SoundBloc no-insulation contrast seed |

### Second-Pack Sources

| Source | URL | Intended use |
| --- | --- | --- |
| Knauf W112 GKB Advanced + Diamant | `https://knauf.com/api/download-center/v1/assets/c0933b87-57c9-470d-8cc1-4932a75bd8ee?download=true` | alternate ISO `Rw` high-mass mixed-board variant |
| Siniat AS70R-212dB-50G | `https://www.siniat.co.uk/en-gb/products-and-systems/systems/partition-systems/as70r-212db-50g/` | high-performance acoustic-stud wall |
| Siniat Universal / Universal MR brochure | `https://media.siniat.co.uk/doc_822980_gb/original/505852815/siniat_universalmr_brochure_feb26.pdf?brand=siniat&market=gb` | current Siniat single-layer and separating-wall options |
| ROCKWOOL Acoustic Wall Assemblies Catalog | `https://www.rockwool.com/siteassets/o2-rockwool/documentation/technical-guides/commercial/acoustic-wall-assemblies-catalog-techincal-guide.pdf` | North American `STC`-only common wall seed |
| British Gypsum GypWall Single Frame | `https://www.british-gypsum.com/documents/white-book/british-gypsum-wb-gypwall-single-frame-with-introduction.pdf` | broader UK drywall seed variants |
| British Gypsum GypFloor Silent | `https://www.british-gypsum.com/documents/white-book/british-gypsum-wb-gypfloor-silent.pdf` | floor/ceiling starter stack research |
| Mapei Soundproofing Systems | `https://cdnmedia.mapei.com/docs/librariesprovider17/line-technical-documentation-documents/soundproofing-systems.pdf?sfvrsn=173b8b8b_3` | floating screed / resilient layer source metadata |
| PABCO Sound Design Guide | `https://pabcogypsum.com/cms/resources/media/2025/06/The_Sound_Design_Guide-2025.pdf` | North American `STC` wall pack |
| Xella Ytong Modular Building System | `https://storefrontapi.commerce.xella.com/occ/v2/uk/catalogs/ukContentCatalog/versions/Online/xellamedia/Xella-Modular-building-system.pdf` | AAC/masonry pack |
| Stora Enso CLT technical brochure | `https://www.storaenso.com/-/media/documents/download-center/documents/product-brochures/wood-products/clt-by-stora-enso-technical-brochure-en.pdf` | mass-timber research only until exact assembly chosen |

## Exact-Row Extraction Checklist

Before implementation, each first-pack row needs one local extraction pass:

1. Capture source label, system ID, URL, issue date if visible, metric basis,
   target value, and tolerance posture.
2. Capture layer order, layer thicknesses, stud/frame depth, stud spacing,
   cavity fill thickness, and whether the cavity is empty or absorptive.
3. Choose local material IDs and write down every substitution.
4. Build a Workbench V2 snapshot and confirm it can be restored without a
   project.
5. Decide whether the source value is:
   - visible metadata only
   - diagnostic comparison
   - unsupported by current calculator and expected to return `needs_input`
6. Add a test expectation for UI application even when calculator output is
   `needs_input`.

Do not start with 15+ presets. A small high-quality seed pack will find UI,
snapshot, and metric-basis bugs faster than a large noisy source import.

## Preset Seed Versus Benchmark Decision Matrix

Use this matrix before adding any row:

| Question | If yes | If no |
| --- | --- | --- |
| Does the source publish exact layer order and thicknesses? | can be seed candidate | seed only if generic starter label is honest |
| Does the source publish the metric basis? | can hold source reference | no diagnostic comparison |
| Is the metric currently owned by the calculator route? | diagnostic comparison may run | store metadata only |
| Are source materials represented exactly in local catalog? | narrower tolerance | generic substitution note and broad tolerance |
| Is the source a field metric? | require explicit context | no hard expectation |
| Is the row North American `STC`/`IIC`? | compare only to same metric | never compare to ISO `Rw`/`Ln,w` |

## Implementation Guardrails From Research

- The seed module must not import `@dynecho/engine`.
- Source references must be plain metadata on the preset, not calculation
  inputs.
- Do not put target values into user-editable preset snapshots. Target values
  belong beside the preset in read-only source metadata.
- The UI should show one compact source chip such as `Source: Knauf - Rw 50 dB`
  or `Source: ROCKWOOL - STC 50`, but the calculator output remains authoritative
  for the current draft.
- Applying a common preset must not create a project, saved combination, report,
  or personal preset automatically.
- Saving after editing creates a personal preset copy with the user's chosen
  name/description and without mutating the built-in common preset.
- Source comparison tests must accept `needs_input` as an explicit outcome when
  the calculator correctly requires physical context.

## Recommended First Seed Pack

Start with 4 wall presets:

1. `Knauf W112 double gypsum + mineral wool`
2. `Knauf W112 Diamant + mineral wool`
3. `Siniat CS70R-15dB-50G acoustic board + glass wool`
4. `British Gypsum A206A281 SoundBloc single-layer wall`

Avoid floors in the first slice unless the source row has clear `Ln,w`,
`DeltaLw`, `Rw`, and layer stack with resilient layer dynamic stiffness/load
basis. Floor source rows are more likely to create metric and route confusion.

Use `ROCKWOOL North America STC wall`, `Knauf KOMO field-context W112`, and
floor/impact examples as v1.1+ rather than v1 unless the UI has a clear
metric-basis filter. They are useful, but they would make the first visible
common preset list mix lab `Rw`, field `DnT,A,k`, North American `STC`, and
impact metrics in one step.

## Product UX Model

The Workbench V2 `Presets` panel should distinguish:

- `My presets`
- `Common presets`

Recommended behavior:

- `Common presets` are read-only built-in starter templates.
- User can click `Use preset` to load one into the workbench.
- User can click `Save preset` after editing to save a personal copy.
- Optional later: `Save copy` from common preset into My presets.

Do not automatically seed common presets into every user's personal JSON file. That would pollute the owner store and make delete/rename semantics confusing.

Better architecture:

- built-in common preset module ships with the app
- personal preset storage remains owner-scoped file storage
- API continues to manage only user-created presets

## Data Model

Recommended common preset shape:

```ts
type WorkbenchV2CommonPreset = {
  id: string;
  description: string;
  label: string;
  sourceReferences: Array<{
    basis: "lab_rw" | "lab_stc" | "field_dntak" | "diagnostic";
    metric: string;
    sourceLabel: string;
    sourceUrl: string;
    targetValue: number;
    toleranceDb: number;
  }>;
  snapshot: WorkbenchV2ProjectSnapshot;
  tags: string[];
};
```

Important:

- `sourceReferences` are metadata and diagnostics, not exact runtime evidence.
- snapshot should reuse `buildWorkbenchV2ProjectSnapshot`.
- common presets should not include owner/project/report IDs.

## Test Strategy

### UI/Storage Tests

- common preset list renders separately from user presets
- common preset can be applied without a project
- applying a common preset keeps active project but clears active assembly/report
- user can save an edited common preset as a personal preset
- common presets cannot be renamed/deleted as if they were personal presets

### Source Comparison Tests

Create a focused test that:

- reads common preset source references
- runs calculator on each snapshot using current dynamic path
- compares only metrics whose basis is supported
- records unsupported / needs-input as explicit diagnostic outcomes

Recommended test naming:

```text
apps/web/features/workbench-rebuild/workbench-v2-common-presets.test.ts
packages/engine/src/common-preset-source-reference-comparison-contract.test.ts
```

The engine-side test should be added only if this becomes a calculator/source slice. For the UI feature, keep validation in web/helper tests and avoid touching `packages/engine`.

## Source Acceptance Rules

Before any candidate becomes a benchmark row:

1. Source URL must be public and stable enough to cite.
2. Source must publish exact layer stack or enough system detail to map safely.
3. Source must identify metric basis (`Rw`, `STC`, `DnT,A,k`, `DnT,w`, `Ln,w`, etc.).
4. Metric must not be aliased to another metric.
5. Source must not be used to retune formulas.
6. If the repo uses generic material substitution, tolerance must be broad and source note must say so.
7. If the source is a field metric, context fields must be explicit or the test must stay diagnostic.

## Implementation Plan

### Step 1 - Narrow Candidate Pack

Select 4 to 6 seeds from existing fixtures and the initial public source audit.

Exit criteria:

- each seed has a source URL
- each seed has mapped materials already available in `packages/catalogs/src/materials/seed-materials.ts`
- each seed has declared metric basis and tolerance

### Step 2 - Add Common Preset Module

Add a Workbench V2-only module:

```text
apps/web/features/workbench-rebuild/workbench-v2-common-presets.ts
```

Responsibilities:

- export common preset records
- build snapshots through existing snapshot builder
- keep source metadata next to each seed
- avoid API/storage imports
- avoid engine imports

### Step 3 - Add Common Preset UI

Extend `WorkbenchPresetLibraryPanel` carefully:

- keep current personal preset controls unchanged
- add a compact `Common presets` section below or behind a simple segmented/tab control
- keep rows scannable
- do not add cards inside cards
- no large explanatory copy
- common rows expose `Use preset` only

### Step 4 - Apply Common Preset

In `calculator-workbench.tsx`:

- add selected common preset state if needed
- apply through existing `restoreWorkbenchV2Snapshot`
- reuse the current replacement confirmation guard
- clear selected assembly/report
- keep active project selected

### Step 5 - Tests

Run:

```bash
pnpm exec vitest run features/workbench-rebuild/workbench-v2-common-presets.test.ts features/workbench-rebuild/workbench-preset-library-panel.test.ts features/workbench-rebuild/workbench-v2-project-snapshot.test.ts features/workbench-rebuild/material-editor-surface-parity.test.ts
git diff --check
```

Add browser smoke:

- open Workbench V2
- open Presets
- use a common preset
- verify layer stack changes
- save edited result as personal preset
- reload and apply personal copy
- mobile overflow check

## Risks

| Risk | Mitigation |
| --- | --- |
| STC gets treated as Rw | Store metric basis explicitly; never compare STC to Rw |
| Field metric gets treated as lab metric | Keep `field_*` basis and required context fields |
| Generic material substitution looks exact | Add source note and broad tolerance |
| User preset store is polluted | Do not copy common presets into owner JSON until user explicitly saves |
| UI becomes cluttered | Use hidden Presets panel with compact grouping |
| Engine graph expands | Common preset UI module must not import `@dynecho/engine` |
| Other agents conflict | Touch only Workbench V2 preset files and this doc |

## Recommendation

Proceed, but in a bounded first slice:

1. Add 4 wall common presets only.
2. Keep source values as visible/reference metadata, not exact truth.
3. Add UI under the existing `Presets` panel as `Common presets`.
4. Let users apply common presets and save edited copies as personal presets.
5. Add diagnostic comparison tests only after the UI seed pack is stable.
