# Post-V1 Wall Opening/Leak Building Apparent Dn,w/Dn,A Companion Coverage Refresh Plan - 2026-06-23

Status:
`post_v1_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_opening_leak_building_apparent_dna_companion_coverage_refresh`

## Purpose

This is the landed no-runtime guard after the opening/leak building
apparent `Dn,w` / `Dn,A` companion owner. It re-probes the new
apparent-normalized building companions, the full mixed
apparent-and-standardized output set, and the fail-closed boundaries.

This is not a broad source crawl, UI polish pass, confidence-labeling
task, or generic docs cleanup. It protects a landed calculator behavior
that increased calculable target outputs for a real opening/leak wall
family.

Previous runtime owner:
`post_v1_wall_opening_leak_building_apparent_dna_companion_owner_plan`
/
`packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts`
/
`post_v1_wall_opening_leak_building_apparent_dna_companion_owner_landed_runtime_selected_coverage_refresh`

Previous refresh status:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_opening_leak_building_apparent_dna_companion_owner`

Selected candidate to re-probe:
`wall.opening_leak_building_apparent_dna_companion_owner`

Selected coverage refresh action:
`post_v1_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_plan`

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Selected coverage refresh label:
`post-V1 wall opening/leak building apparent Dn,w/Dn,A companion coverage refresh`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Selected next label:
`post-V1 runtime-first route-family rerank after wall opening/leak building apparent Dn,w/Dn,A companion coverage refresh`

Previous owner counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Expected refresh counters:

- `coverageRefreshContractFilesTouched: 1`;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Refresh Scope

- Re-probe complete apparent-and-standardized opening/leak building
  outputs: `R'w 31.6`, `Dn,w 31.9`, `Dn,A 31.1`,
  `DnT,w 32.1`, `DnT,A 31.3`, and `DnT,A,k 30.4`.
- Re-probe apparent-only behavior: `R'w`, `Dn,w`, and `Dn,A`
  supported; standardized and characteristic outputs unsupported.
- Keep missing frequency honest: `Dn,w` remains supported while `Dn,A`
  is unsupported.
- Keep missing volume and missing output basis as `needs_input`.
- Keep lab context and impact aliases outside this owner.
