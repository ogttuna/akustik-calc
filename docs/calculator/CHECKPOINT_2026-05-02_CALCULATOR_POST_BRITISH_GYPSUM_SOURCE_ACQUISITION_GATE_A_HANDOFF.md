# Checkpoint - 2026-05-02 - Calculator Post-British-Gypsum Source Acquisition Gate A

Slice: `calculator_post_british_gypsum_source_acquisition_v1`

Gate landed:

`gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import`

Status:

`selected_rockwool_acoustic_wall_assemblies_source_pack_extraction_after_post_british_gypsum_acquisition_found_official_stone_wool_wall_rows_but_no_runtime_ready_import`

Selected next slice:

`rockwool_acoustic_wall_assemblies_source_pack_extraction_v1`

Selected next action:

`gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import`

Selected next file:

`packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Implementation artifact:

`packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`

## Summary

Gate A acquires and classifies official source locators after British
Gypsum Gate B / Gate C and source-gap revalidation v9 closed the
current source set no-runtime.

It does not select runtime import, value movement, support promotion,
confidence promotion, evidence promotion, output support movement, API
movement, route-card movement, output-card movement, proposal/report
copy movement, or workbench-input behavior movement.

The selected next slice is the official ROCKWOOL Acoustic Wall
Assemblies Catalog extraction because it has concrete stone-wool wall
assembly numbers, wall component fields, `STC` / `OITC`, and report
number context. It is selected only for no-runtime row extraction.

## Source Locator Ranking

Rank 1, selected for no-runtime extraction:

- ROCKWOOL Acoustic Wall Assemblies Catalog technical guide:
  `https://www.rockwool.com/siteassets/o2-rockwool/documentation/technical-guides/commercial/acoustic-wall-assemblies-catalog-techincal-guide.pdf`
  - examples: `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, `ESS-05`;
  - metrics: `STC`, `OITC`, test report number;
  - first missing requirement: exact row extraction, `STC` / `OITC`
    metric policy, local material alias mapping, tolerance owner,
    protected negative boundaries, and paired visible tests.

Ranked but not selected:

- USG Acoustical Assemblies SA200:
  `https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf`
  remains context until exact floor/wall topology and `IIC` / `STC`
  metric policy are owned.
- National Gypsum Fire & Sound Assembly Selector:
  `https://www.nationalgypsum.com/newsroom/press-releases/introducing-national-gypsums-fire-sound-assembly-selector`
  remains context until row payloads or downloadable test reports are
  extracted.
- Georgia-Pacific Fire & Sound Assemblies:
  `https://www.buildgp.com/resources/assemblies`
  remains planning context until actual test report / directory rows
  are resolved.
- Stora Enso / WoodWorks / NRC mass-timber context remains governed by
  prior CLT closeouts until new exact metric or row truth exists.

## Rockwool Defect Posture

This gate still does not fix or retune the original rockwool reorder /
triple-leaf defect. The ROCKWOOL catalog is relevant stone-wool wall
source context, but it is not the missing Uris 2006 internal-leaf /
two-cavity source packet. The split-rockwool wall answer remains
low-confidence `multileaf_screening_blend` (`Rw 41`) and must not be
presented as fixed, correct, or source-validated.

## Frozen Surfaces

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Next Step

Implement:

`packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts`

with:

`gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import`

Gate A must extract row locators and blockers. It may only select
runtime work if exact topology, metric owner, tolerance owner, local
material mapping, protected negative boundaries, and paired engine/web
visible tests are named together.

## Validation

Validation completed for this checkpoint on 2026-05-02:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Observed no-runtime gate shape after adding this Gate A to the current
runner: focused post-British-Gypsum Gate A 1 file / 8 tests; post-BG /
v9 / Gate C / Gate B / v8 continuity 5 files / 38 tests; current-gate
engine 193 files / 1033 tests, web 47 files / 227 passed + 18 skipped,
build 5/5 with known non-fatal `sharp/@img` warnings, and whitespace
guard clean.

Run `pnpm check` only if a later gate selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
