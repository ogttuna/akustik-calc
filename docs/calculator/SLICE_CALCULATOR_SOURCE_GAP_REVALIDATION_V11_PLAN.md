# Slice Plan - Calculator Source Gap Revalidation v11

Slice id: `calculator_source_gap_revalidation_v11`

Status: GATE A LANDED / SELECTED
`national_gypsum_fire_sound_selector_source_pack_extraction_v1`
(landed 2026-05-02).

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout`

Selection status:

`closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row`

Prior USG Gate B status:

`usg_gate_b_found_no_runtime_ready_row_selected_closeout`

Gate A status:

`selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import`

Selected next slice:

`national_gypsum_fire_sound_selector_source_pack_extraction_v1`

Selected next file:

`packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`

Selected next action:

`gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`

## Objective

Re-rank source-readiness and accuracy work after the USG Acoustical
Assemblies source-pack slice closed no-runtime. This is a no-runtime
revalidation gate: it must not move runtime values, support, confidence,
evidence, API shape, route cards, output cards, proposal/report copy,
output support, or workbench-input behavior.

## Inputs

- USG Gate A / Gate B / Gate C closeout summary.
- USG Levelrock, SRM-25, SRB, I-joist, truss, steel partition,
  Sheetrock Firecode, Thermafiber SAFB, RC-channel, `STC`, `IIC`,
  range, and test-number blockers.
- Paused Uris 2006 triple-leaf source-packet lane.
- Closed ROCKWOOL, British Gypsum, and Knauf source rows and negative
  boundaries.
- National Gypsum Fire & Sound Assembly Selector and Georgia-Pacific
  Fire & Sound Assemblies locator context left by the post-British
  Gypsum acquisition slice.
- CLT / mass-timber, generated floor, no-stud, lined-heavy, and
  historical blocked families.

## Gate A Requirements

Gate A added:

`packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`

Required artifacts:

1. `usg_gate_a_gate_b_gate_c_closeout_summary`.
2. `usg_levelrock_steel_partition_stc_iic_range_and_alias_blockers`.
3. `paused_uris_2006_triple_leaf_source_packet_lane_status`.
4. `closed_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh`.
5. `national_gypsum_georgia_pacific_and_remaining_post_british_gypsum_locator_rerank`.
6. `clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank`.
7. `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags`.
8. `selected_next_slice_with_target_gate_file_and_validation_scope`.

Gate A may select a new source-pack extraction or mapping/tolerance
slice only if it names a concrete source locator or source packet and
keeps all exact-topology, metric, tolerance, material, negative-boundary,
and paired visible-test requirements explicit.

## Gate A Result

Gate A selects National Gypsum Fire & Sound Assembly Selector source-pack
extraction no-runtime:

`national_gypsum_fire_sound_selector_source_pack_extraction_v1`

First file:

`packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`

First action:

`gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`

Why selected:

- ROCKWOOL and USG official source packs are both closed no-runtime.
- Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
- National Gypsum is the highest-ranked remaining official locator with
  selector and related sound-test context.
- Georgia-Pacific remains planning context until actual directory rows
  or test reports are resolved.

National Gypsum is selected only for selector/report row extraction. It
does not approve runtime import, metric conversion, confidence
promotion, evidence promotion, support promotion, or visible behavior
movement.

## Protected Boundaries

- The original split-rockwool grouped stack remains low-confidence
  `multileaf_screening_blend`, `Rw 41`, and is not fixed by the USG
  closeout. The Uris 2006 lane remains
  `paused_waiting_rights_safe_source_packet`.
- USG `LEVELROCK_I_JOIST_SRM25_CARPET`,
  `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`,
  `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`,
  `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`, `USG_STEEL_FRAMED_A1`, and
  `USG_STEEL_FRAMED_A8` remain source context only.
- USG `STC`, `IIC`, ranges, and test numbers do not promote DynEcho
  `Rw`, `R'w`, `Ln,w`, `DnT,w`, `Dn,w`, `DnT,A`, support, confidence,
  evidence, field outputs, route-card values, output-card status, or
  proposal/report copy.
- Levelrock, SRM-25, SRB, I-joist, truss, Sheetrock Firecode,
  Thermafiber SAFB, and RC-channel rows do not coalesce with generic
  floor underlayments, generic gypsum, local rockwool, glass fiber,
  generic mineral wool, generic resilient bar, generated-floor routes,
  LSF anchors, or triple-leaf routes without source/tolerance ownership.
- Closed ROCKWOOL, British Gypsum, and Knauf rows do not reopen from
  nearby USG context alone.
- Runtime, support, confidence, evidence, API, route-card, output-card,
  proposal/report, and workbench-input surfaces remain frozen.

## Validation

Required for Gate A:

- focused v11 Gate A contract;
- continuity with USG Gate C, USG Gate B, USG Gate A, v10, ROCKWOOL
  Gate C, ROCKWOOL Gate B, ROCKWOOL Gate A, post-British-Gypsum
  acquisition, v9, and the route/source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Focused v11 command:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts --maxWorkers=1`

Gate A validation completed on 2026-05-02:

- focused v11 Gate A contract: 1 file / 8 tests passed;
- v11 / USG Gate C / Gate B / Gate A / v10 / ROCKWOOL Gate C /
  ROCKWOOL Gate B / ROCKWOOL Gate A / post-British-Gypsum acquisition /
  v9 / route-source-risk continuity: 11 files / 76 tests passed;
- `pnpm calculator:gate:current`: engine 202 files / 1093 tests passed,
  web 47 files / 227 tests passed / 18 skipped, build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.

Selection validation is owned by USG Gate C closeout:

- focused USG Gate C closeout contract: 1 file / 7 tests passed;
- USG Gate C / Gate B / Gate A / v10 / ROCKWOOL Gate C / ROCKWOOL Gate B
  / ROCKWOOL Gate A / post-British-Gypsum acquisition / v9 /
  route-source-risk continuity: 10 files / 68 tests passed;
- `pnpm calculator:gate:current`: engine 201 files / 1085 tests passed,
  web 47 files / 227 tests passed / 18 skipped, build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.
