# Checkpoint - Knauf Wall Systems Source Pack Extraction Gate B Handoff

Date: 2026-04-29

Slice: `knauf_wall_systems_source_pack_extraction_v1`

Gate: B

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

Gate B compared the extracted Knauf UK/AU locator rows against the live
calculator implementation and kept every row out of runtime import,
support promotion, confidence promotion, evidence promotion, and visible
surface movement.

Landed contract:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`

Selected next action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Selected next file:

`packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate B status token:

`no_knauf_locator_row_has_complete_topology_metric_tolerance_and_visible_test_ownership`

## Row Decisions

- `EN-PC-50-055-6-2-12.5-WB-25` owns a lab `Rw` row context only. It
  stays blocked until Wallboard / Acoustic Roll / stud-gauge mapping and
  a row-specific tolerance owner are named. It must not replace the
  existing Knauf lab-report exact steel-stud anchors by proximity.
- `TB.5A` remains a promising timber double-board candidate, but not an
  import row. It still needs exact stud-depth column selection,
  `SHEETROCK ONE` and `KI 75G11` local material mapping, and a timber
  double-board tolerance owner.
- `TTF30.2A` remains a twin-timber / asymmetric double-leaf topology
  research track. It must not reopen no-stud double-leaf or raw
  open-box/open-web routes without explicit topology mapping.
- `MWI.2A` remains lined-masonry research context. It still lacks
  substrate mass, furring/cavity, coupling, `SHEETROCK ONE` mapping, and
  lined-masonry tolerance ownership.
- `TO120.1A` remains a one-side-lined negative boundary.
- `TSF120.1A` and `AAC.1A` remain adjacent context only.

## Metric Decision

- Source lab `Rw` is a named metric context, but it is not runtime-ready
  without topology, material mapping, and tolerance ownership.
- `Rw+Ctr` is a reported sum, not a standalone DynEcho `C` / `Ctr` /
  `STC` or field-output policy.
- No row supplies DynEcho field/building outputs (`R'w`, `Dn,w`,
  `DnT,w`, `DnT,A`) or field-normalisation / flanking ownership.

## Frozen Surfaces

No numeric runtime behavior, support bucket, confidence score, evidence
tier, API shape, route-card value, output-card status, proposal/report
copy, or workbench-input behavior changed.

Frozen-surface shorthand:

`runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Protected Boundaries

- `source_locators_are_not_runtime_import_approval`
- `uk_steel_stud_rows_do_not_promote_timber_double_board_routes`
- `one_side_lined_timber_rows_do_not_become_two_sided_wall_truth`
- `staggered_and_twin_timber_topologies_do_not_reopen_no_stud_or_raw_open_box_routes`
- `masonry_upgrade_rows_do_not_promote_lined_heavy_wall_without_substrate_and_coupling_mapping`
- `aac_panel_upgrade_rows_do_not_promote_generic_aac_routes_without_exact_panel_gap_mapping`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Validation

Completed before editing:

- `pnpm calculator:gate:current`: green after Gate A baseline, engine
  146 files / 710 tests, web 45 files / 216 passed + 18 skipped, build
  5/5 with known non-fatal `sharp/@img` warnings, whitespace guard
  clean.

Completed after Gate B landed:

- Targeted Knauf Gate B contract:
  `pnpm --filter @dynecho/engine exec vitest run src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts --maxWorkers=1`;
  green, 1 engine file / 7 tests.
- Targeted Knauf Gate A + Gate B compatibility:
  `pnpm --filter @dynecho/engine exec vitest run src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts --maxWorkers=1`;
  green, 2 engine files / 13 tests.
- `pnpm calculator:gate:current`: green, engine 147 files / 717 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `pnpm check`: green, lint/typecheck green, engine 280 files / 1537
  tests, web 157 files / 890 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings.
- `git diff --check`: clean.

## Next Action

Implement Gate C closeout / next-slice selection:

`packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C should close this slice no-runtime unless a source-ready runtime
pack appears with exact topology, metric owner, tolerance owner, local
material mapping, protected negative boundaries, and paired engine/web
visible tests.
