# Post-V1 Wall Opening/Leak Building DnT,A,k Characteristic Adapter Coverage Refresh Plan - 2026-06-22

Status:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_opening_leak_building_apparent_dna_companion_owner`

## Purpose

This is the selected next no-runtime guard after the opening/leak
building `DnT,A,k` characteristic adapter owner. It should re-probe the
opening/leak building `DnT,A,k` pin, mixed building outputs, and
fail-closed boundaries.

This is not a broad source crawl, UI polish pass, confidence-labeling
task, or generic docs cleanup. It protects a landed calculator behavior
that increased calculable target outputs for a real opening/leak wall
family.

Previous runtime owner:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-opening-leak-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous refresh status:
`post_v1_wall_local_substitution_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_opening_leak_building_dntak_characteristic_adapter_owner`

Selected candidate to re-probe:
`wall.opening_leak_building_dntak_characteristic_adapter_owner`

Selected coverage refresh action:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-opening-leak-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:
`post-V1 wall opening/leak building DnT,A,k characteristic adapter coverage refresh`

Coverage refresh status:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_opening_leak_building_apparent_dna_companion_owner`

Selected next action:
`post_v1_wall_opening_leak_building_apparent_dna_companion_owner_plan`

Selected next file:
`packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_OWNER_PLAN_2026-06-23.md`

Selected next label:
`post-V1 wall opening/leak building apparent Dn,w/Dn,A companion owner`

Selected next owner status:
`post_v1_wall_opening_leak_building_apparent_dna_companion_owner_landed_runtime_selected_coverage_refresh`

Selected next owner candidate:
`wall.opening_leak_building_apparent_dna_companion_owner`

Selected next owner counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next owner follow-up:
`post_v1_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Previous owner counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 1`,
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

- Re-probe `DnT,A 31.3` and `DnT,A,k 30.4` for the complete
  opening/leak building request.
- Re-probe mixed building outputs:
  `R'w`, `DnT,w`, `DnT,A`, and `DnT,A,k`.
- Keep missing frequency band, missing volume, and missing building
  output basis fail-closed.
- Keep apparent-only building basis, field context, lab context,
  building `Dn,A`, and impact aliases outside this characteristic
  owner.

## Implementation Sync Before Starting

The previous runtime owner file exists and is included in
`tools/dev/run-calculator-current-gate.ts`. Targeted validation for the
owner plus previous local-substitution coverage refresh passed
`2 files / 10 tests`, and the opening/local neighbor chain passed
`5 files / 26 tests`. `git diff --check` was clean.

`pnpm calculator:gate:current` ran with this owner in the gate; the new
opening/leak owner and previous local-substitution coverage files passed
inside it, but the full gate still exits non-zero because of existing
unrelated global failures. This selected coverage refresh should add
only the guard file named above and must not retune runtime values.

## Landed Refresh Behavior

- The complete opening/leak building request still returns
  `DnT,A 31.3` and `DnT,A,k 30.4`.
- Mixed building requests still keep `R'w 31.6`, `DnT,w 32.1`,
  `DnT,A 31.3`, and `DnT,A,k 30.4` together on the opening/leak
  A-weighted building basis.
- Missing frequency band, missing receiving-room volume, missing
  building output basis, apparent-only standardized basis, field
  context, lab context, and impact aliases remain outside this
  characteristic owner.
- Counters: `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
  This is not a broad source crawl.
