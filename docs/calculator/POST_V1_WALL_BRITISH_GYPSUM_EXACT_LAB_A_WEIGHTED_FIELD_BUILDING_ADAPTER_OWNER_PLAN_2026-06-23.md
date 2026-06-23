# Post-V1 Wall British Gypsum Exact Lab A-Weighted Field/Building Adapter Owner Plan - 2026-06-23

Status:
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

## Purpose

This runtime owner follows
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_plan`
and the selected runtime-first candidate
`wall.british_gypsum_exact_lab_a_weighted_field_building_adapter_owner`.

The previous British Gypsum owner opened exact `A046005` / `A046006`
field/building `R'w`, `Dn,w`, and `DnT,w` from the exact element-lab
`Rw` row through Gate I / Gate AR. This owner opens the A-weighted
companions on the same defended route, without copying the lab row into
field/building outputs.

## Selection Card

- User construction / formula family: British Gypsum `A046005` one-side
  RB1 and `A046006` both-side RB2 timber resilient-bar exact lab rows.
- Target outputs opened: `Dn,A` and `DnT,A` for explicit complete
  `field_between_rooms` and `building_prediction` contexts.
- Route: exact lab `Rw` direct curve, then owned Gate I / Gate AR
  field/building adapter with A-weighted companion calculation.
- Required physical inputs: exact source row identity, explicit
  `resilientBarSideCount`, direct curve basis, partition area, receiving
  room volume, receiving-room RT60, and for building
  `buildingPredictionOutputBasis`, flanking/junction class,
  conservative flanking assumption, and junction coupling length.
- `needs_input` behavior: missing room or building context remains
  precise `needs_input`; the owner does not infer missing basis from the
  lab row.
- `unsupported` boundaries: field/building `Rw`, `STC`, `C`, `Ctr`,
  impact aliases, nearby British Gypsum rows, legacy `auto` exact-source
  promotion, and lab-to-field/building copying remain blocked.

## Runtime Behavior

`A046005` complete field/building requests now carry:
`R'w 49`, `Dn,w 49`, `Dn,A 48.0`, `DnT,w 50`, and `DnT,A 49.1`.

`A046006` complete field/building requests now carry:
`R'w 52`, `Dn,w 52`, `Dn,A 51.0`, `DnT,w 53`, and `DnT,A 52.1`.

A-only requests for `Dn,A` / `DnT,A` are calculable on the same exact
BG source route when the field/building context is complete.

## Counters

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 4`
- `newCalculableTargetOutputs: 8`
- `runtimeBasisPromotions: 4`
- `runtimeValuesMoved 8`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 6`

## Implementation

Owner action:
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-owner-contract.test.ts`

Owner plan doc:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-23.md`

Selected candidate:
`wall.british_gypsum_exact_lab_a_weighted_field_building_adapter_owner`

Previous coverage refresh:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_british_gypsum_exact_lab_field_building_adapter_coverage_refresh`

## Selected Next

Historical selected next action, now landed:
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_plan`

Historical selected next file, now landed:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-coverage-refresh-contract.test.ts`

Historical selected next plan doc, now landed:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Historical selected next label, now landed:
`post-V1 wall British Gypsum exact lab A-weighted field/building adapter coverage refresh`

Coverage refresh status:
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_landed_no_runtime_selected_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner`

Coverage refresh file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-coverage-refresh-contract.test.ts`

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next action:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner_plan`

Current selected next file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-building-dntak-characteristic-adapter-owner-contract.test.ts`

Current selected next plan doc:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-23.md`

Current selected next label:
`post-V1 wall British Gypsum exact lab building DnT,A,k characteristic adapter owner`
