# Slice Plan - ROCKWOOL Acoustic Wall Assemblies Source Pack Extraction v1

Slice id: `rockwool_acoustic_wall_assemblies_source_pack_extraction_v1`

Status: GATE C CLOSED / SELECTED `calculator_source_gap_revalidation_v10`
(selected 2026-05-02 by
`calculator_post_british_gypsum_source_acquisition_v1` Gate A; Gate A
landed 2026-05-02; Gate B landed 2026-05-02 no-runtime; Gate C closed
2026-05-02 no-runtime).

Prior selection status:

`selected_rockwool_acoustic_wall_assemblies_source_pack_extraction_after_post_british_gypsum_acquisition_found_official_stone_wool_wall_rows_but_no_runtime_ready_import`

Selected first file:

`packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Selected first action:

`gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import`

Latest status:

`closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row`

Current next file:

`packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`

Current next action:

`gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout`

## Objective

Extract a no-runtime source pack from the official
`ROCKWOOL Acoustic Wall Assemblies Catalog`.

The catalog is useful because it is an official stone-wool wall source
with assembly numbers, wall components, ROCKWOOL product names,
reported `STC` / `OITC`, and test report references. It is not runtime
truth for DynEcho yet. Gate A must extract source rows and blockers,
not move values, support, confidence, evidence, route cards, output
cards, proposal/report copy, API shape, or workbench input behavior.

## Source Locator

Official locator:

`https://www.rockwool.com/siteassets/o2-rockwool/documentation/technical-guides/commercial/acoustic-wall-assemblies-catalog-techincal-guide.pdf`

Gate A should classify at least:

- interior steel stud `ISS` assemblies;
- interior wood stud `IWS` assemblies;
- exterior steel stud `ESS` assemblies;
- ROCKWOOL product/material aliases: `AFB`, `Comfortbatt`,
  `Cavityrock`, and generic local `rockwool`;
- reported `STC`, `OITC`, and test report number context.

Representative source examples from the acquisition gate:

- `ISS-00`: `5/8"` gypsum, `2 1/2"` steel stud, `16" oc`, `AFB`
  `1.5"`, `STC 43`, `OITC 28`;
- `ISS-22`: asymmetric gypsum, `2 1/2"` steel stud, `24" oc`, `AFB`
  `1.5"`, `STC 50`;
- `ISS-39`: `2x5/8"` gypsum, `3 5/8"` steel stud, `24" oc`, `AFB`
  `3"`, `STC 57`;
- `IWS-04`: `2x5/8"` gypsum, `2x4` wood stud, `16" oc`, `AFB`
  `3"`, `STC 40`;
- `ESS-05`: exterior steel stud assembly with `Comfortbatt` and
  `Cavityrock`, `STC 49`.

## Critical Boundaries

This slice must not claim the user-reported triple-leaf / rockwool
defect is fixed. The Uris 2006 lane remains paused on
`paused_waiting_rights_safe_source_packet`, and the split-rockwool wall
answer remains low-confidence `multileaf_screening_blend` (`Rw 41`).

The ROCKWOOL catalog is a strong source candidate for stone-wool wall
row extraction, but it is not the missing Uris 2006 two-cavity internal
leaf source packet. It must not coalesce `AFB`, `Comfortbatt`,
`Cavityrock`, local generic `rockwool`, `glass-fiber`, and generic
mineral wool without an explicit material-mapping and tolerance owner.

## Gate A - Source Row Extraction

Gate A should add:

`packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Gate A landed no-runtime. It extracts representative `ISS`, `IWS`, and
`ESS` row locators and selects Gate B mapping/tolerance decision. It
does not move runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, or workbench-input behavior.

Required records:

1. Row locator matrix for `ISS`, `IWS`, and `ESS` assembly numbers.
2. Per-row gypsum layer count/thickness, stud type, stud size, stud
   spacing, resilient channel/mounting, ROCKWOOL product, product
   thickness, `STC`, `OITC`, and report number where available.
3. `STC` / `OITC` metric policy: direct runtime `Rw`, `R'w`, or
   `DnT,w` import is blocked until metric conversion or rejection is
   explicitly owned.
4. Local material alias policy for `AFB`, `Comfortbatt`, `Cavityrock`,
   local `rockwool`, generic mineral wool, and `glass-fiber`.
5. Negative boundaries against:
   - Uris 2006 triple-leaf / rockwool source packet;
   - NRC 2024 glass-fiber triple-leaf comparator;
   - British Gypsum and Knauf closed rows;
   - floor-only rows and generated floor fallback;
   - masonry / lined-heavy / no-stud routes.
6. Paired engine and web visible test plan before any runtime or
   visible movement.

Extracted Gate A row matrix:

| Assembly | Family | Topology / product | Metrics | Runtime posture |
| --- | --- | --- | --- | --- |
| `ISS-00` | interior steel stud | `5/8"` gypsum, `2 1/2"` steel stud, `16"` oc, `AFB 1.5"` | `STC 43`, `OITC 28`, `J2247-13-303-11-R0` | context only |
| `ISS-22` | interior steel stud | asymmetric `1/2"` gypsum / `2x1/2"` one side, `2 1/2"` steel stud, `24"` oc, `AFB 1.5"` | `STC 50`, `RAL-TL90-186` | context only |
| `ISS-39` | interior steel stud | `2x5/8"` gypsum, `3 5/8"` steel stud, `24"` oc, `AFB 3"` | `STC 57`, `RAL-TL96-268` | context only |
| `IWS-04` | interior wood stud | `2x5/8"` gypsum, `2x4` wood stud, `16"` oc, `AFB 3"` | `STC 40`, `OITC 32`, report number incomplete in catalog text extraction | context only |
| `ESS-05` | exterior steel stud | `5/8"` gypsum, `3 5/8"` steel stud, `Comfortbatt 3.5"`, `Cavityrock 2"`, Z-girts, no cladding | `STC 49`, `OITC 32`, `H5383.03-113-11-R0` | context only |

Metric policy from Gate A:

- `STC`, `OITC`, and report numbers are source context only.
- Direct `Rw`, `R'w`, `Dn,w`, `DnT,w`, or `DnT,A` import is blocked.
- Report numbers are not one-third-octave curve packets.
- The catalog points to ROCKWOOL Technical Services for transmission
  loss curve data / additional documentation, so runtime calibration
  needs a later source-packet or mapping gate.

Material alias policy from Gate A:

- `AFB`, `Comfortbatt`, and `Cavityrock` do not become local generic
  `rockwool` without density / flow-resistivity / thickness / source
  family ownership.
- `AFB` does not coalesce with `glass_fiber` or generic mineral wool.
- `Comfortbatt` and `Cavityrock` are exterior/envelope context in
  `ESS` rows unless a later mapping gate names a bounded role.

Protected Gate A negative boundaries:

- `rockwool_acoustic_catalog_stc_oitc_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `rockwool_afb_comfortbatt_cavityrock_do_not_coalesce_with_glass_fiber_or_generic_mineral_wool_without_mapping_tolerance`
- `rockwool_single_stud_iss_iws_rows_do_not_replace_nrc_2024_internal_board_glass_fiber_triple_leaf_comparator`
- `rockwool_catalog_rows_do_not_reopen_closed_british_gypsum_or_knauf_rows_without_new_gate_b_mapping`
- `rockwool_catalog_rows_do_not_promote_floor_only_generated_floor_masonry_lined_heavy_or_no_stud_routes`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Gate B - Mapping / Tolerance Decision

Gate B landed no-runtime in:

`packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`

Gate B action:

`gate_b_mapping_tolerance_decision_no_runtime`

Gate B status:

`rockwool_gate_b_found_no_runtime_ready_row_selected_closeout`

Selected next file:

`packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Gate B decided that no extracted `ISS`, `IWS`, or `ESS` row can map to a
local runtime candidate yet. Runtime stays frozen because exact
topology, material aliases, metric policy, tolerance ownership, negative
boundaries, and paired engine/web visible tests are not all owned
together.

Gate B row decisions:

| Assembly | Decision | First blocker |
| --- | --- | --- |
| `ISS-00` | blocked from runtime | `STC` / `OITC` policy, exact `2 1/2"` steel stud topology, `AFB 1.5"` mapping, tolerance, and Knauf / Uris precedence tests |
| `ISS-22` | context only | asymmetric leaf inputs, `STC` policy, `AFB` mapping, and row tolerance |
| `ISS-39` | blocked from runtime | exact `3 5/8"` stud / `24"` oc / double-board / `AFB 3"` mapping, metric policy, tolerance, and anchor precedence |
| `IWS-04` | blocked from runtime | report-number completion, wood-stud / `AFB` mapping, metric policy, tolerance, and `A046006` precedence |
| `ESS-05` | exterior envelope context only | Z-girt, air-barrier, cladding, `Comfortbatt`, `Cavityrock`, metric policy, and envelope topology mapping |

Gate B material-alias blockers:

- `afb_does_not_coalesce_with_local_rockwool_without_density_flow_resistivity_thickness_and_source_family_owner`
- `afb_does_not_coalesce_with_glass_fiber_or_generic_mineral_wool`
- `comfortbatt_is_not_generic_interior_cavity_absorber_truth`
- `cavityrock_is_continuous_exterior_board_context_not_cavity_batt_truth`
- `rockwool_catalog_rows_do_not_override_nrc_2024_glass_fiber_or_uris_2006_rockwool_source_lane`

Gate B protected boundaries:

- `rockwool_gate_b_source_rows_are_not_runtime_import_approval`
- `rockwool_gate_b_stc_oitc_report_numbers_do_not_promote_iso_rw_or_field_outputs`
- `rockwool_gate_b_afb_comfortbatt_cavityrock_do_not_coalesce_with_local_rockwool_glass_fiber_or_generic_mineral_wool`
- `rockwool_gate_b_iss_rows_do_not_override_knauf_lsf_or_nrc_uris_triple_leaf_lanes`
- `rockwool_gate_b_iws_04_does_not_reopen_a046006_or_generic_timber_routes`
- `rockwool_gate_b_ess_05_does_not_promote_interior_wall_floor_masonry_lined_heavy_or_triple_leaf_routes`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Gate C - Closeout / Next-Slice Selection

Gate C landed no-runtime in:

`packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Gate C status:

`closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row`

Selected next slice:

`calculator_source_gap_revalidation_v10`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout`

Gate C closes this source-pack slice no-runtime. Gate B found no
runtime-ready `ISS`, `IWS`, or `ESS` row, and no new source-ready pack
appeared with exact topology, metric owner, tolerance owner, local
material mapping, protected negative boundaries, and paired engine/web
visible tests.

Gate C protected boundaries:

- `iss_00_remains_context_only_and_does_not_replace_knauf_lsf_or_uris_2006_triple_leaf_routes`
- `iss_22_remains_asymmetric_context_only_and_does_not_promote_symmetric_double_leaf_or_triple_leaf_routes`
- `iss_39_high_stc_single_frame_context_does_not_override_knauf_lsf_nrc_or_uris_triple_leaf_families`
- `iws_04_remains_context_only_and_does_not_reopen_a046006_or_generic_timber_routes`
- `ess_05_remains_exterior_envelope_context_and_does_not_promote_interior_wall_floor_masonry_lined_heavy_or_triple_leaf_routes`

## Frozen Surfaces

Until a later gate names a fully source-ready runtime candidate, all of
these surfaces stay frozen:

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Acceptance Rules

Gate C may select runtime work only if a candidate already names all of:

- exact source row and exact local topology mapping;
- `STC` / `OITC` to DynEcho metric policy or explicit metric rejection;
- tolerance owner;
- local material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate C must close no-runtime or select a
source-packet / mapping follow-up without moving runtime or visible
surfaces.

## Validation

Required for Gate A:

- `pnpm --filter @dynecho/engine exec vitest run src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`
- continuity with `calculator_post_british_gypsum_source_acquisition_v1`
  Gate A;
- `pnpm calculator:gate:current`
- `git diff --check`

Gate A validation completed:

- focused ROCKWOOL Gate A: 1 file / 6 tests passed;
- ROCKWOOL Gate A + post-BG continuity: 7 files / 48 tests passed;
- current gate includes this file after Gate A and passed engine
  195 files / 1043 tests, web 47 files / 227 passed + 18 skipped, and
  build 5 / 5 with the known non-fatal `sharp/@img` optional dependency
  warnings;
- `git diff --check` passed, and the build side-effect in
  `apps/web/next-env.d.ts` was restored to `.next-typecheck`.

Run `pnpm check` only if Gate C selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.

Required for Gate B:

- `pnpm --filter @dynecho/engine exec vitest run src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts --maxWorkers=1`
- continuity with ROCKWOOL Gate A, post-British-Gypsum acquisition, v9,
  and the route/source risk register;
- `pnpm calculator:gate:current`
- `git diff --check`

Gate B validation completed:

- focused ROCKWOOL Gate B: 1 file / 8 tests passed;
- ROCKWOOL Gate B / Gate A / post-British-Gypsum acquisition / v9 /
  route-source-risk continuity: 5 files / 34 tests passed;
- current gate includes this file after Gate A and passed engine
  196 files / 1051 tests, web 47 files / 227 passed + 18 skipped, and
  build 5 / 5 with the known non-fatal `sharp/@img` optional dependency
  warnings;
- `apps/web/next-env.d.ts` build side-effect was restored to
  `.next-typecheck`; `git diff --check` passed after the docs-only
  validation-count update.

Required for Gate C:

- `pnpm --filter @dynecho/engine exec vitest run src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
- continuity with ROCKWOOL Gate B, Gate A, post-British-Gypsum
  acquisition, v9, and the route/source risk register;
- `pnpm calculator:gate:current`
- `git diff --check`

Gate C validation completed:

- focused ROCKWOOL Gate C closeout: 1 file / 6 tests passed;
- ROCKWOOL Gate C / Gate B / Gate A / post-British-Gypsum acquisition /
  v9 / route-source-risk continuity: 6 files / 40 tests passed;
- current gate includes this file after Gate B and passed engine
  197 files / 1057 tests, web 47 files / 227 passed + 18 skipped, and
  build 5 / 5 with the known non-fatal `sharp/@img` optional dependency
  warnings;
- `apps/web/next-env.d.ts` build side-effect was restored to
  `.next-typecheck`; `git diff --check` passed after validation-count
  docs were updated.
