# Slice Plan - Calculator Source Gap Revalidation v10

Slice id: `calculator_source_gap_revalidation_v10`

Status: GATE A LANDED / SELECTED
`usg_acoustical_assemblies_source_pack_extraction_v1` (selected
2026-05-02 by this gate after ROCKWOOL Acoustic Wall Assemblies
source-pack extraction Gate C).

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout`

Selection status:

`closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row`

Gate A result:

`selected_usg_acoustical_assemblies_source_pack_extraction_after_v10_rerank_found_official_floor_wall_stc_iic_rows_but_no_runtime_ready_import`

Selected next file:

`packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Selected next action:

`gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import`

Selected next plan:

`docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`

## Objective

Re-rank source-readiness and accuracy work after the ROCKWOOL Acoustic
Wall Assemblies source-pack slice closed no-runtime. This is a
no-runtime revalidation gate: it must not move runtime values, support,
confidence, evidence, API shape, route cards, output cards,
proposal/report copy, output support, or workbench-input behavior.

## Inputs

- ROCKWOOL Gate A / Gate B / Gate C closeout summary.
- ROCKWOOL `ISS`, `IWS`, and `ESS` row boundaries and material-alias
  blockers.
- Paused Uris 2006 triple-leaf source-packet lane.
- Remaining post-British-Gypsum source locators.
- Closed British Gypsum and Knauf source rows and negative boundaries.
- CLT / mass-timber, generated floor, no-stud, lined-heavy, and
  historical blocked families.

## Gate A Requirements

Gate A should add:

`packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`

Required artifacts:

1. `rockwool_gate_a_gate_b_gate_c_closeout_summary`.
2. `rockwool_iss_iws_ess_row_boundaries_and_material_alias_blockers`.
3. `paused_uris_2006_triple_leaf_source_packet_lane_status`.
4. `remaining_post_british_gypsum_source_locator_rerank`.
5. `closed_british_gypsum_and_knauf_rows_with_negative_boundary_refresh`.
6. `clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank`.
7. `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags`.
8. `selected_next_slice_with_target_gate_file_and_validation_scope`.

Gate A may select a new source-pack extraction or mapping/tolerance
slice only if it names a concrete source locator or source packet and
keeps all exact-topology, metric, tolerance, material, negative-boundary,
and paired visible-test requirements explicit.

Gate A landed with the official USG Acoustical Assemblies SA200 locator
as a no-runtime extraction-only next step. `STC` / `IIC` rows remain
source context only; no runtime import, support promotion, confidence
promotion, evidence promotion, API shape, route-card value, output-card
status, proposal/report copy, output support, or workbench-input
behavior moved.

## Protected Boundaries

- The original split-rockwool grouped stack remains low-confidence
  `multileaf_screening_blend`, `Rw 41`, and is not fixed by the
  ROCKWOOL catalog closeout. The Uris 2006 lane remains
  `paused_waiting_rights_safe_source_packet`.
- `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and `ESS-05` remain source
  context only until a later gate proves exact runtime prerequisites.
- AFB, Comfortbatt, Cavityrock, local rockwool, glass-fiber, and
  generic mineral wool do not coalesce without source/tolerance
  ownership.
- Closed British Gypsum and Knauf rows do not reopen from nearby source
  context alone.
- Runtime, support, confidence, evidence, API, route-card, output-card,
  proposal/report, and workbench-input surfaces remain frozen.
- USG `STC` / `IIC` floor-wall context does not import into DynEcho
  `Rw`, `R'w`, `Ln,w`, `DnT,w`, `Dn,w`, or `DnT,A` until a later
  mapping/tolerance gate owns exact topology, metric policy, material
  mapping, tolerance, negative boundaries, and paired engine/web visible
  tests.

## Validation

Required for Gate A:

- focused v10 Gate A contract;
- continuity with ROCKWOOL Gate C, Gate B, Gate A, post-British-Gypsum
  acquisition, v9, and the route/source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Focused v10 command:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts --maxWorkers=1`

Validation completed on 2026-05-02:

- focused v10 Gate A: 1 file / 8 tests passed;
- v10 / ROCKWOOL Gate C / ROCKWOOL Gate B / ROCKWOOL Gate A /
  post-British-Gypsum acquisition / v9 / route-source-risk continuity:
  7 files / 48 tests passed;
- current gate passed engine 198 files / 1065 tests, web 47 files / 227
  passed + 18 skipped, and build 5 / 5 with known non-fatal
  `sharp/@img` optional dependency warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the build
  side-effect;
- `git diff --check` passed.

Selection validation completed by ROCKWOOL Gate C closeout:

- focused ROCKWOOL Gate C closeout: 1 file / 6 tests passed;
- ROCKWOOL Gate C / Gate B / Gate A / post-British-Gypsum acquisition /
  v9 / route-source-risk continuity: 6 files / 40 tests passed;
- current gate passed engine 197 files / 1057 tests, web 47 files / 227
  passed + 18 skipped, and build 5 / 5 with the known non-fatal
  `sharp/@img` optional dependency warnings.
