# Post-V1 Wall British Gypsum Exact Lab Field/Building Adapter Coverage Refresh Plan - 2026-06-23

Status:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_british_gypsum_exact_lab_field_building_adapter_coverage_refresh`

## Purpose

This is the selected no-runtime coverage refresh after
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_owner_plan`.

The owner opened complete explicit British Gypsum `A046005` and
`A046006` field/building requests through the exact lab `Rw` direct
curve plus Gate I / Gate AR. This refresh must re-probe those values and
boundaries without broadening source coverage, adding nearby British
Gypsum rows, retuning formulas, or opening A-weighted/impact/lab aliases.

## Follows

Owner action:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-field-building-adapter-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-23.md`

Owner status:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

## Selected Refresh

Selected action:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_plan`

Selected file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-field-building-adapter-coverage-refresh-contract.test.ts`

Selected plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Selected label:
`post-V1 wall British Gypsum exact lab field/building adapter coverage refresh`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-british-gypsum-exact-lab-field-building-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Selected next label:
`post-V1 runtime-first route-family rerank after wall British Gypsum exact lab field/building adapter coverage refresh`

## Coverage Card

- User construction / formula family: British Gypsum `A046005`
  one-side RB1 and `A046006` both-side RB2 timber resilient-bar exact
  lab wall rows.
- Target outputs to re-probe: `R'w`, `Dn,w`, and `DnT,w` for complete
  `field_between_rooms` and `building_prediction` contexts.
- Route: exact lab `Rw` direct curve owner, then Gate I field adapter or
  Gate AR building adapter.
- Required inputs to keep live: explicit `resilientBarSideCount`,
  `panelWidthMm`, `panelHeightMm`, `receivingRoomVolumeM3`,
  `receivingRoomRt60S`, and for building `buildingPredictionOutputBasis`,
  `flankingJunctionClass`, `conservativeFlankingAssumption`, and
  `junctionCouplingLengthM`.
- Boundaries to re-probe: missing field/building context, legacy `auto`
  side-count, `Dn,A`, `DnT,A`, field/building `Rw`, `STC`, `C`, `Ctr`,
  impact aliases, nearby non-selected British Gypsum rows, and
  lab-to-field/building copying.

## Owner Runtime Summary

The landed owner calculates:

- `A046005` complete field/building: direct `Rw 55`, `R'w 49`,
  `Dn,w 49`, `DnT,w 50`;
- `A046006` complete field/building: direct `Rw 58`, `R'w 52`,
  `Dn,w 52`, `DnT,w 53`.

Counters from the landed owner: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 12`,
`runtimeBasisPromotions: 4`, `runtimeValuesMoved 12`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 7`.

Expected refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Landed refresh status:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_british_gypsum_exact_lab_field_building_adapter_coverage_refresh`.

Selected candidate re-probed:
`wall.british_gypsum_exact_lab_field_building_adapter_owner`.

This is not a broad source crawl.

## Validation Plan

1. Add the selected coverage-refresh contract.
2. Run it with the owner and previous British Gypsum needs-input
   boundary contract.
3. Run `git diff --check`.
4. Run `pnpm calculator:gate:current` after the refresh lands or when
   the current-gate runner changes.

## Stop Rule

Do not turn this refresh into a new runtime owner, source crawl, value
retune, or A-weighted/impact/lab-alias opener. If a boundary fails, fix
the boundary or stop with the failing evidence.
