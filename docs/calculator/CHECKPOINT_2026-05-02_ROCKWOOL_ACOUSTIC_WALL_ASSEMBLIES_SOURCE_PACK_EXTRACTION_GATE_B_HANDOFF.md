# Checkpoint - 2026-05-02 - ROCKWOOL Acoustic Wall Assemblies Source Pack Extraction Gate B

Slice:

`rockwool_acoustic_wall_assemblies_source_pack_extraction_v1`

Landed gate:

`gate_b_mapping_tolerance_decision_no_runtime`

Status:

`rockwool_gate_b_found_no_runtime_ready_row_selected_closeout`

Implementation artifact:

`packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`

Selected next file:

`packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

## Summary

Gate B compared the official `ROCKWOOL Acoustic Wall Assemblies Catalog`
rows extracted by Gate A against the live calculator topology, material
mapping, metric policy, tolerance ownership, negative-boundary, and
paired visible-test requirements.

No extracted ROCKWOOL row is runtime-ready now. Runtime, support,
confidence, evidence, API, route-card, output-card, proposal/report, and
workbench-input behavior stay frozen.

Source locator:

`https://www.rockwool.com/siteassets/o2-rockwool/documentation/technical-guides/commercial/acoustic-wall-assemblies-catalog-techincal-guide.pdf`

## Row Decisions

- `ISS-00`: blocked from runtime. It is an interior single steel-stud
  source row with `STC 43` / `OITC 28`, but it still needs `STC` /
  `OITC` metric policy, exact `2 1/2"` steel stud topology, `AFB 1.5"`
  material mapping, tolerance ownership, and visible precedence tests
  before it can influence the existing Knauf LSF lane or any
  triple-leaf lane.
- `ISS-22`: context only. It is an asymmetric board single-stud row
  with `STC 50`; live inputs do not yet own asymmetric leaf topology,
  `AFB` mapping, `STC` conversion/rejection, or row tolerance.
- `ISS-39`: blocked from runtime. It is a high-`STC` steel-stud row,
  but it still lacks exact `3 5/8"` stud / `24"` oc / double-board /
  `AFB 3"` mapping, metric policy, tolerance ownership, and precedence
  tests against the current Knauf LSF anchor and triple-leaf research
  lanes.
- `IWS-04`: blocked from runtime. It is a single wood-stud source row
  with `STC 40` / `OITC 32`, but the extracted catalog text lacks a
  complete report-number packet and the row still needs wood-stud /
  `AFB` mapping, metric policy, tolerance ownership, and precedence
  tests against the existing British Gypsum `A046006` timber anchor.
- `ESS-05`: exterior envelope context only. It includes `Comfortbatt`,
  `Cavityrock`, Z-girts, sheathing / air barrier context, `STC 49`, and
  `OITC 32`; it does not map to the current interior wall, floor,
  masonry, lined-heavy, or triple-leaf runtime routes.

## Metric Policy

- `STC` is not imported as DynEcho `Rw`.
- `OITC` is not imported as `Rw`, `R'w`, `Dn,w`, `DnT,w`, `DnT,A`, or
  any field/building output.
- Report numbers are not one-third-octave transmission loss curves.
- A future runtime gate needs source-owned one-third-octave curves or an
  explicit `STC` / `OITC` rejection policy, ISO 717 `Rw` derivation
  ownership, uncertainty, and tolerance ownership.

## Material Alias Policy

Gate B keeps material aliases blocked:

- `afb_does_not_coalesce_with_local_rockwool_without_density_flow_resistivity_thickness_and_source_family_owner`
- `afb_does_not_coalesce_with_glass_fiber_or_generic_mineral_wool`
- `comfortbatt_is_not_generic_interior_cavity_absorber_truth`
- `cavityrock_is_continuous_exterior_board_context_not_cavity_batt_truth`
- `rockwool_catalog_rows_do_not_override_nrc_2024_glass_fiber_or_uris_2006_rockwool_source_lane`

## Protected Boundaries

- `rockwool_gate_b_source_rows_are_not_runtime_import_approval`
- `rockwool_gate_b_stc_oitc_report_numbers_do_not_promote_iso_rw_or_field_outputs`
- `rockwool_gate_b_afb_comfortbatt_cavityrock_do_not_coalesce_with_local_rockwool_glass_fiber_or_generic_mineral_wool`
- `rockwool_gate_b_iss_rows_do_not_override_knauf_lsf_or_nrc_uris_triple_leaf_lanes`
- `rockwool_gate_b_iws_04_does_not_reopen_a046006_or_generic_timber_routes`
- `rockwool_gate_b_ess_05_does_not_promote_interior_wall_floor_masonry_lined_heavy_or_triple_leaf_routes`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Rockwool Defect Posture

This checkpoint does not fix or retune the original rockwool reorder /
triple-leaf defect. The Uris 2006 source lane remains paused on
`paused_waiting_rights_safe_source_packet`, and the split-rockwool wall
answer remains low-confidence `multileaf_screening_blend` (`Rw 41`).
It must not be presented as fixed, correct, or source-validated.

## Next

Continue with Gate C closeout / next-slice selection:

`packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C should close this ROCKWOOL source-pack slice no-runtime unless a
new source-ready runtime pack appears with exact topology, metric owner,
tolerance owner, local material mapping, protected negative boundaries,
and paired engine/web visible tests.

## Validation

Validation completed on 2026-05-02:

- focused ROCKWOOL Gate B: 1 file / 8 tests passed;
- ROCKWOOL Gate B / Gate A / post-British-Gypsum acquisition / v9 /
  route-source-risk continuity: 5 files / 34 tests passed;
- `pnpm calculator:gate:current`: engine 196 files / 1051 tests passed,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with the known
  non-fatal `sharp/@img` optional dependency warnings, and whitespace
  guard clean;
- `apps/web/next-env.d.ts` build side-effect was restored to
  `.next-typecheck`; `git diff --check` passed after the docs-only
  validation-count update.

Run `pnpm check` only if a later gate selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
