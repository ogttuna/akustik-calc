# Checkpoint - Knauf Wall Systems Source Pack Extraction Gate A Handoff

Date: 2026-04-29

Slice: `knauf_wall_systems_source_pack_extraction_v1`

Gate: A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

Gate A extracted official Knauf UK/AU wall-system table locators and
classified them as source-intake evidence. The extracted rows are useful
for the accuracy backlog, but they are not runtime import approval.

Landed contract:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`

Selected next action:

`gate_b_mapping_tolerance_decision_no_runtime`

Selected next file:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`

## Extracted Locator Groups

- Knauf UK Drywall Systems Performance Guide, April 2026:
  EN Compliance Performer Wallboard table guide and row
  `EN-PC-50-055-6-2-12.5-WB-25`. This is a steel-stud lab `Rw`
  locator and a Gate B mapping/tolerance candidate only.
- Knauf AU Systems+ Section D Timber Stud Walls:
  `TO120.1A` is a one-side-lined timber negative boundary;
  `TB.5A` is a timber double-board Gate B mapping/tolerance candidate;
  `TSF120.1A` is staggered timber adjacent context; `TTF30.2A` is a
  twin-timber Gate B mapping/tolerance candidate.
- Knauf AU Systems+ Section F Masonry Upgrades:
  `MWI.2A` is a lined-masonry Gate B mapping/tolerance candidate;
  `AAC.1A` is AAC-panel discontinuous-construction adjacent context.

## Gate B Blockers

Gate B must decide exact-row / exact-column mapping, metric context,
tolerance ownership, local material mapping, and visible test shape
before any later runtime slice can be selected.

The required blockers are:

- exact stud/substrate column selection where a table gives multiple
  widths or stud depths;
- board product mapping to local materials;
- substrate mass, panel density, cavity, furring, and coupling mapping;
- `Rw` versus `Rw+Ctr` ownership and any field-output proxy policy;
- positive engine value-pin or rejection tests;
- web route-card/report tests only if later runtime, confidence,
  support, evidence, or copy surfaces move.

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

- `pnpm calculator:gate:current`: green, engine 145 files / 704 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.

Completed after Gate A landed:

- Targeted Knauf Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`;
  green, 1 engine file / 6 tests.
- Targeted v4 compatibility plus Knauf Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`;
  green, 2 engine files / 13 tests.
- `pnpm calculator:gate:current`: green, engine 146 files / 710 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `pnpm check`: green, lint/typecheck green, engine 279 files / 1530
  tests, web 157 files / 890 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings.

## Next Action

Implement Gate B:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`

Gate B must stay no-runtime unless it can name exact source topology,
metric owner, tolerance owner, protected negative boundaries, and paired
engine/web visible tests for a later behavior-moving slice.
