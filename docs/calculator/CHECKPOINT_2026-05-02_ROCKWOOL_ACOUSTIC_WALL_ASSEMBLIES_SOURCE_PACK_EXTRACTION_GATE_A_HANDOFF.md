# Checkpoint - 2026-05-02 - ROCKWOOL Acoustic Wall Assemblies Source Pack Extraction Gate A

Slice:

`rockwool_acoustic_wall_assemblies_source_pack_extraction_v1`

Landed gate:

`gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import`

Status:

`rockwool_acoustic_wall_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Added:

- `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Selected next file:

`packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`

Selected next action:

`gate_b_mapping_tolerance_decision_no_runtime`

## What Landed

Gate A extracts a no-runtime source row matrix from the official
`ROCKWOOL Acoustic Wall Assemblies Catalog`:

`https://www.rockwool.com/siteassets/o2-rockwool/documentation/technical-guides/commercial/acoustic-wall-assemblies-catalog-techincal-guide.pdf`

The extracted representative rows are:

- `ISS-00`: interior steel stud, `5/8"` gypsum, `2 1/2"` steel stud,
  `16"` oc, `AFB 1.5"`, `STC 43`, `OITC 28`,
  `J2247-13-303-11-R0`.
- `ISS-22`: interior steel stud, asymmetric `1/2"` gypsum / `2x1/2"`
  one side, `2 1/2"` steel stud, `24"` oc, `AFB 1.5"`, `STC 50`,
  `RAL-TL90-186`.
- `ISS-39`: interior steel stud, `2x5/8"` gypsum, `3 5/8"` steel stud,
  `24"` oc, `AFB 3"`, `STC 57`, `RAL-TL96-268`.
- `IWS-04`: interior wood stud, `2x5/8"` gypsum, `2x4` wood stud,
  `16"` oc, `AFB 3"`, `STC 40`, `OITC 32`; report number is
  incomplete in the extracted catalog text and must not be filled by
  inference.
- `ESS-05`: exterior steel stud, `5/8"` gypsum, `3 5/8"` steel stud,
  `16"` oc, `Comfortbatt 3.5"`, `Cavityrock 2"`, Z-girts, no cladding,
  `STC 49`, `OITC 32`, `H5383.03-113-11-R0`.

Gate A also records the source family coverage:

- `ISS`: source catalog range `STC 40-57`.
- `IWS`: source catalog range `STC 36-66`.
- `ESS`: source catalog range `STC 43-52`.
- The catalog provides component descriptions, `STC`, `OITC`, ROCKWOOL
  test/report references, and product references.
- Transmission loss curves / additional documentation still require a
  later source packet or ROCKWOOL Technical Services follow-up before
  DynEcho runtime calibration.

## Runtime Posture

No runtime or visible behavior moved:

- runtime: frozen;
- support: frozen;
- confidence: frozen;
- evidence: frozen;
- API: frozen;
- route-card: frozen;
- output-card: frozen;
- proposal/report: frozen;
- workbench-input: frozen.

The user split-rockwool triple-leaf repro remains low-confidence
`multileaf_screening_blend`, `Rw 41`. The Uris 2006 source lane remains
paused on `paused_waiting_rights_safe_source_packet`.

## Metric Policy

Gate A keeps the ROCKWOOL source metrics as context only:

- `STC` is not imported as ISO `Rw`.
- `OITC` is not imported as DynEcho `Rw`, `R'w`, `Dn,w`, `DnT,w`, or
  `DnT,A`.
- Report numbers are not one-third-octave transmission loss curves.
- Field/building outputs stay blocked until lab curve ownership and a
  field/ISO 12354-style overlay policy exist.

## Material Alias Policy

Gate A blocks global material coalescing:

- `AFB` is not equivalent to local generic `rockwool` without density,
  flow-resistivity, thickness, source-family, and tolerance ownership.
- `Comfortbatt` is exterior/envelope batt context, not generic interior
  absorber truth.
- `Cavityrock` is continuous exterior board context, not local cavity
  batt truth.
- `AFB` is not `glass_fiber`.
- `AFB`, `Comfortbatt`, `Cavityrock`, local `rockwool`, generic
  mineral wool, and `glass_fiber` remain separate until Gate B or a
  later mapping gate proves a bounded equivalence.

## Protected Negative Boundaries

Gate A pins these boundaries:

- `rockwool_acoustic_catalog_stc_oitc_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `rockwool_afb_comfortbatt_cavityrock_do_not_coalesce_with_glass_fiber_or_generic_mineral_wool_without_mapping_tolerance`
- `rockwool_single_stud_iss_iws_rows_do_not_replace_nrc_2024_internal_board_glass_fiber_triple_leaf_comparator`
- `rockwool_catalog_rows_do_not_reopen_closed_british_gypsum_or_knauf_rows_without_new_gate_b_mapping`
- `rockwool_catalog_rows_do_not_promote_floor_only_generated_floor_masonry_lined_heavy_or_no_stud_routes`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Next

Continue with:

`packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`

Run:

`gate_b_mapping_tolerance_decision_no_runtime`

Gate B must decide whether any extracted `ISS`, `IWS`, or `ESS` row can
map to local runtime. It may select runtime only if exact topology,
source metric policy, product/material mapping, tolerance ownership,
negative boundaries, and paired engine/web visible tests are complete.
Otherwise it must close no-runtime or select a narrower mapping/source
follow-up.

## Validation

Validation completed on 2026-05-02:

- focused ROCKWOOL Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`
  passed 1 file / 6 tests.
- ROCKWOOL Gate A + post-British-Gypsum continuity:
  `pnpm --filter @dynecho/engine exec vitest run src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts src/calculator-route-source-risk-register-contract.test.ts --maxWorkers=1`
  passed 7 files / 48 tests.
- `pnpm calculator:gate:current` passed: engine 195 files / 1043 tests;
  web 47 files / 227 passed + 18 skipped; build 5 / 5 successful with
  the known non-fatal `sharp/@img` optional dependency warnings.
- `git diff --check` passed.
- Build rewrote `apps/web/next-env.d.ts` to `.next`; it was restored
  to the repo's `.next-typecheck` reference and verified with a clean
  `git diff -- apps/web/next-env.d.ts`.
