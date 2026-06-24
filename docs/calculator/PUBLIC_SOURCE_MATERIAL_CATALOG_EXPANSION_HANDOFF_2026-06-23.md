# Public-Source Material Catalog Expansion Handoff - 2026-06-23

Document role: user-requested support handoff for the material catalog
expansion landed on 2026-06-23. This is not the active selected
calculator slice, not a broad source crawl, not an acoustic source-row
import, and not a formula retune. It records product-specific material
seed rows and direct-calculation coverage so later agents do not treat
catalog data as measured acoustic results.

Current selected implementation action remains:
`post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-advanced-wall-current-gate-checkpoint-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_ADVANCED_WALL_CURRENT_GATE_CHECKPOINT_PLAN_2026-06-24.md`.

Follow-up handoff:
`docs/calculator/EXCEL_IMPACT_PRODUCT_CANDIDATE_RESCREEN_HANDOFF_2026-06-24.md`.
That later user-requested slice records impact product catalog matcher
hardening and two Getzner AFM29 exact-system rows. This 2026-06-23
handoff remains material-seed support only; its `sourceRowsImported: 0`
counter is intentionally not retroactively changed.

## Selection Card

- User construction / formula family:
  product-specific wall and floor material stacks that should resolve
  into the existing dynamic airborne and heavy floating-floor impact
  routes.
- Target outputs opened by the direct-calculation proof:
  `Rw` and `STC` for an element-lab wall stack; `Ln,w` and `DeltaLw`
  for a heavy floating-floor impact stack.
- Route:
  material catalog resolution, density-derived surface mass,
  material-provided dynamic stiffness, then existing `calculateAssembly`
  dynamic routes. No measured acoustic assembly result is copied into
  runtime output.
- Required physical inputs:
  layer thicknesses, layer roles where the route needs them,
  `airborneContext.contextMode` for airborne output, and
  `floorImpactContext.loadBasisKgM2` for the heavy floating-floor impact
  route. REGUPOL resilient products provide
  `impact.dynamicStiffnessMNm3` where public data supports it.
- `needs_input` behavior:
  missing impact load basis remains a route-required input. The material
  addition must not bypass this.
- `unsupported` boundaries:
  unknown material IDs, lab-to-field/building metric aliases, impact
  aliases, product-nearby acoustic substitutions, and copied
  manufacturer headline ratings remain closed unless a separate owner
  adds a physically owned route.

## Landed Catalog Rows

Implementation file:
`packages/catalogs/src/materials/seed-materials.ts`.

The expansion added these product-specific public-source rows:

- British Gypsum / Gyproc boards:
  `gyproc_soundbloc_12_5` at `824 kg/m3`,
  `gyproc_soundbloc_15` at `867 kg/m3`,
  `gyproc_habito_12_5` at `936 kg/m3`, and
  `gyproc_fireline_12_5` at `776 kg/m3`. These are `panel_leaf`
  materials derived from public mass-per-area and thickness values.
- Knauf boards:
  `knauf_soundshield_plus_12_5` at `920 kg/m3` and
  `knauf_soundshield_plus_15` at `887 kg/m3`, both `panel_leaf`.
- PABCO QuietRock boards:
  `quietrock_510` at `819 kg/m3` and `quietrock_530` at `884 kg/m3`,
  both `panel_leaf` with nominal higher damping for the laminated
  gypsum family.
- Mass and masonry products:
  `stora_enso_clt_490`, `hh_celcon_solar_460`,
  `hh_celcon_standard_600`, and `hh_celcon_high_strength_730`. The H+H
  IDs are current product-specific rows and do not replace the older
  Celcon acoustic-reference-slice IDs.
- Limp-mass membranes:
  `tecsound_sy_35`, `tecsound_sy_50`, `tecsound_sy_70`, and
  `tecsound_sy_100`, all represented as `limp_mass_membrane` with
  `2000 kg/m3` derived from declared area weight and thickness.
- Porous absorber:
  `rockwool_afb_40` at `40 kg/m3`; its flow resistivity is an
  engineering nominal because the public brochure gives density but not
  flow resistivity.
- REGUPOL impact resilient layers:
  `regupol_sound_12` and `regupol_sound_15` with `s'=6 MN/m3`,
  `regupol_sound_17` with `s'=19 MN/m3`,
  `regupol_sound_47` with `s'=30 MN/m3`,
  `regupol_comfort_8` with `s'=15 MN/m3`,
  `regupol_comfort_12` with `s'=10 MN/m3`, and
  `regupol_sound_and_drain_22` with `s'=21 MN/m3`. REGUPOL sound and
  sound-and-drain rows keep `densityKgM3: 0` when the source page does
  not declare mass density; use them as impact resilient layers, not as
  airborne mass contributors.

All rows carry `public-source` tags and source notes in the seed file.
They are material properties for formula routing, not source result rows
with `Rw`, `STC`, `Dn,w`, `Ln,w`, or other acoustic ratings.

## Alias Sync

Implementation file:
`packages/engine/src/material-catalog.ts`.

Aliases were added for assistant-generated and user-entered product
names, including:

- `gyproc_soundbloc`, `soundbloc_12_5`, `soundbloc_15`,
  `gyproc_habito`, `habito`, and `gyproc_fireline`;
- `knauf_soundshield_plus`, `quietrock510`, and `quietrock530`;
- `tecsound35`, `tecsound50`, `tecsound70`, `tecsound100`, plus
  `tecsound_sy*` aliases;
- `rockwool_afb`, `rockwool_afb_40kg`, and `stora_enso_clt`;
- `hh_celcon_solar`, `hh_celcon_standard`,
  `hh_celcon_high_strength`;
- `regupol_sound12`, `regupol_sound15`, `regupol_sound17`,
  `regupol_sound47`, `regupol_comfort8`, `regupol_comfort12`, and
  `regupol_sound_and_drain22`.

Existing aliases such as `soundbloc_board -> acoustic_gypsum_board`
were not overwritten, to avoid silently changing older behavior.

## Direct Calculation Evidence

New engine contract:
`packages/engine/src/material-catalog-expansion-direct-calculation-contract.test.ts`.

The contract proves:

- a wall stack using `gyproc_soundbloc_12_5`, `tecsound_sy_70`,
  `air_gap`, `rockwool_afb_40`, and `quietrock_510` calculates `Rw` and
  `STC` through the existing dynamic airborne route, with surface masses
  `10.3 kg/m2` for SoundBloc 12.5 and `7.0 kg/m2` for Tecsound SY 70;
- a heavy floating-floor stack using `screed`, `regupol_sound_15`, and
  `concrete` calculates `Ln,w` and `DeltaLw` through
  `predictor_heavy_floating_floor_iso12354_annexc_estimate` when
  `floorImpactContext.loadBasisKgM2` is supplied;
- practical aliases resolve to the new product-specific rows and still
  feed `computeLayerSurfaceMassKgM2`.

Catalog seed test:
`packages/catalogs/src/materials/seed-materials.test.ts`.

The seed test now asserts the new IDs, provenance tags, density or
dynamic-stiffness pins, and surface-mass derivation for representative
board, membrane, and CLT rows.

## Counters

- `materialSeedRowsAdded: 24`
- `engineAliasRowsAdded: 38`
- `engineDirectCalculationContractFilesAdded: 1`
- `catalogContractFilesTouched: 1`
- `newFormulaRoutesAdded: 0`
- `runtimeFormulaRetunes: 0`
- `runtimeValuesMoved: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Calculator-slice counters remain conservative: this work makes new
product-specific material IDs usable in existing owned routes, but it
does not claim a new acoustic rating source family or a new formula
owner.

## Validation

Passed:

- `pnpm vitest run packages/catalogs/src/materials/seed-materials.test.ts`
- `pnpm vitest run packages/engine/src/material-catalog-expansion-direct-calculation-contract.test.ts`
- `pnpm --filter @dynecho/catalogs typecheck`
- `git diff --check`

Known unrelated typecheck state:

- `pnpm --filter @dynecho/engine typecheck` still fails on existing
  branch errors outside this material expansion after this test's local
  implicit-`any` issue was fixed:
  `calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts:273`,
  `post-v1-runtime-first-route-family-rerank-after-current-gate-stale-metric-basis-reconciliation-contract.test.ts:286`,
  `post-v1-wall-british-gypsum-exact-lab-needs-input-boundary-fix-contract.test.ts:185`,
  and
  `post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts:390`.

## Next-Agent Guardrails

- Do not treat these material rows as measured acoustic assembly rows.
- Do not copy manufacturer headline acoustic ratings into calculator
  outputs from this handoff.
- Do not use REGUPOL sound rows as airborne mass contributors unless a
  future source provides mass density or surface mass.
- Preserve `floorImpactContext.loadBasisKgM2` as a required input for
  the heavy floating-floor impact route.
- If adding more catalog rows, add a direct-calculation contract when
  the product should be usable by the calculator immediately.
