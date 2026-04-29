# Slice Plan - Knauf Wall Systems Source Pack Extraction v1

Slice id: `knauf_wall_systems_source_pack_extraction_v1`

Status: GATE A LANDED / GATE B NEXT (selected 2026-04-29 by
`calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`; Gate A
landed 2026-04-29 by
`knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`).

Current first implementation file:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`

Selection reason: `calculator_source_gap_revalidation_v4` found no
runtime-ready accuracy candidate. Official Knauf UK/AU wall-system
sources are concrete enough for no-runtime source-pack extraction, but
they still need row/table locator extraction, system-code topology
mapping, metric context, tolerance ownership, protected negative
boundaries, and paired tests before any runtime or visible behavior can
move.

No runtime import, value movement, confidence promotion, support
promotion, evidence-tier promotion, route-card movement, output-card
movement, proposal/report copy change, or workbench-input movement is
allowed in this slice. Keep
`runtime/support/confidence/evidence/API/route-card/output-card` and
`proposal/report/workbench-input` frozen.

## Objective

Extract and classify Knauf wall-system source packs as source-intake
evidence before any calculator behavior changes.

The slice should answer:

- which Knauf UK/AU tables contain timber, steel, masonry-upgrade, or
  lining rows relevant to current wall gaps;
- whether any table row is a direct live-stack candidate, an adjacent
  source row, a negative boundary, or context only;
- what metric context each row actually owns (`Rw`, `Rw+Ctr`, field
  proxy, lab-only, or other);
- what topology, tolerance, and local material mapping blockers remain;
- what engine and web tests would be required before a later runtime or
  visible-surface slice can move behavior.

## Source Inputs

Freshly rechecked on 2026-04-29:

- Knauf UK Drywall Systems Performance Guide, April 2026:
  `https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB`
- Knauf AU Systems+ page:
  `https://knauf.com/en-AU/knauf-gypsum/services/training/systems-plus`
- Knauf AU Systems+ Section D Timber Stud Walls:
  `https://knauf.com/api/download-center/v1/assets/4e58706c-df9d-4579-8d5b-8e685cf29194?country=AU&download=true&locale=en-AU`
- Knauf AU Systems+ Section F Masonry Upgrades:
  `https://knauf.com/api/download-center/v1/assets/16b8f406-a9be-47bd-9e7a-7212d6f19a28?country=AU&download=true&locale=en-AU`

These are source locators, not source-ready runtime packs.

## Gate A - Source Table Locator Extraction

Gate A landed no-runtime in:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`

Required artifacts:

- Knauf UK 2026 performance-guide table locator register;
- Knauf AU Systems+ Section D timber-stud table locator register;
- Knauf AU Systems+ Section F masonry-upgrade table locator register;
- system-code to engine topology blocker matrix;
- metric-context and tolerance-owner blocker matrix;
- positive and negative engine test plan;
- visible-surface test plan only if a later slice moves runtime,
  confidence, support, evidence, card copy, or report copy.

Required evidence fields for every extracted candidate row:

- source label, URL, section, page/table, row/system code, and retrieval
  date;
- layer/leaf order, board material/count/thickness, stud or masonry
  substrate, cavity/fill, mounting/coupling, and side-count metadata;
- reported metric and context (`Rw`, `Rw+Ctr`, lab/field/proxy);
- local material mapping confidence;
- exact, bound, adjacent, negative, or context-only classification;
- first missing topology, metric, tolerance, or visible-test
  prerequisite;
- protected negative boundaries.

Gate A result:

- official source locators are extracted as table/row candidates only;
- `EN-PC-50-055-6-2-12.5-WB-25`, `TB.5A`, `TTF30.2A`, and `MWI.2A`
  are eligible for Gate B mapping/tolerance decision;
- `TSF120.1A` and `AAC.1A` are adjacent context only;
- `TO120.1A` is a one-side-lined timber negative boundary;
- no runtime import, support promotion, confidence promotion, evidence
  promotion, API/card/status/copy/input movement, or output support
  movement happened.

## Gate B - Mapping / Tolerance Decision

Gate B should add:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`

Required decision:

- choose whether any extracted row has exact topology and metric/tolerance
  ownership for a later runtime slice;
- otherwise keep all rows no-runtime as adjacent/negative context and
  select Gate C closeout.

Required blockers to resolve:

- exact stud/substrate column selection where a source table gives
  multiple widths, stud depths, insulation states, or furring gaps;
- board product mapping to local material ids;
- substrate mass, AAC panel density, cavity/furring/gap, and coupling
  assumptions;
- `Rw` versus `Rw+Ctr` ownership and whether field outputs remain
  unsupported/proxy-only;
- positive engine value-pin or explicit rejection tests;
- visible web route-card/report tests only if later behavior or copy
  surfaces move.

## Acceptance Rules

Gate A may select a later runtime import slice only if it names all of:

- exact source row or bounded family rule;
- metric owner and lab/field context;
- tolerance owner;
- material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card/report tests.

Gate A may select a Gate B no-runtime mapping/tolerance decision if one
or more rows are promising but still need metric or tolerance ownership.

Gate A must close no-runtime if all extracted material is adjacent
context only.

Gate A must not:

- promote timber double-board from single-board, steel-stud, or
  resilient-bar context alone;
- promote lined-heavy or masonry-upgrade routes from floor-only,
  ceiling-only, or generic lining context alone;
- alter generated floor fallback behavior;
- reopen `GDMTXA04A`, `C11c`, raw open-box/open-web, wall selector,
  no-stud double-leaf, or CLT wall from nearby source rows;
- change `runtime/support/confidence/evidence/API/route-card/output-card`
  or `proposal/report/workbench-input` surfaces.

Protected boundary tokens for the active slice:

- `source_locators_are_not_runtime_import_approval`
- `uk_steel_stud_rows_do_not_promote_timber_double_board_routes`
- `one_side_lined_timber_rows_do_not_become_two_sided_wall_truth`
- `staggered_and_twin_timber_topologies_do_not_reopen_no_stud_or_raw_open_box_routes`
- `masonry_upgrade_rows_do_not_promote_lined_heavy_wall_without_substrate_and_coupling_mapping`
- `aac_panel_upgrade_rows_do_not_promote_generic_aac_routes_without_exact_panel_gap_mapping`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Validation

- Pre-v4 Gate A focused baseline is green on 2026-04-29:
  - `pnpm calculator:gate:current`;
  - engine 144 files / 697 tests;
  - web 45 files / 216 passed + 18 skipped;
  - build 5/5 with known non-fatal `sharp/@img` warnings;
  - whitespace guard clean.
- Selected-by-v4 Gate A validation is green on 2026-04-29:
  - targeted v4 Gate A contract: 1 engine file / 7 tests;
  - targeted prior Gate C compatibility plus v4 Gate A: 2 engine files /
    13 tests;
  - `pnpm calculator:gate:current`: engine 145 files / 704 tests, web
    45 files / 216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean;
  - `pnpm check`: lint/typecheck green, engine 278 files / 1524 tests,
    web 157 files / 890 passed + 18 skipped, build 5/5 with known
    non-fatal `sharp/@img` warnings.
- For this slice Gate A, run the targeted Knauf extraction contract,
  `pnpm calculator:gate:current`, `git diff --check`, and `pnpm check`
  if the gate is treated as a release gate or selects runtime/import/
  visible behavior work.
- Gate A landed validation is green on 2026-04-29:
  - targeted Knauf Gate A contract: 1 engine file / 6 tests;
  - targeted v4 compatibility plus Knauf Gate A: 2 engine files / 13
    tests;
  - `pnpm calculator:gate:current`: engine 146 files / 710 tests, web
    45 files / 216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean.
  - `pnpm check`: lint/typecheck green, engine 279 files / 1530 tests,
    web 157 files / 890 passed + 18 skipped, build 5/5 with known
    non-fatal `sharp/@img` warnings.
