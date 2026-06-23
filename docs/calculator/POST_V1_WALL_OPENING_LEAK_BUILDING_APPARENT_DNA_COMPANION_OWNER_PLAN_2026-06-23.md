# Post-V1 Wall Opening/Leak Building Apparent Dn,w/Dn,A Companion Owner Plan - 2026-06-23

Status:
`post_v1_wall_opening_leak_building_apparent_dna_companion_owner_landed_runtime_selected_coverage_refresh`

## Purpose

This landed runtime owner opens apparent-normalized building companions
`Dn,w` and `Dn,A` for the already-owned opening/leak building prediction
route. It follows the no-runtime `DnT,A,k` coverage refresh and keeps
the work inside the calculator goal: more target outputs calculated for
a real user-entered opening/leak wall construction through owned
geometry, flanking, room, and A-weighted adapter inputs.

This is not a broad source crawl, UI polish pass, confidence-labeling
task, or generic docs cleanup.

Previous refresh:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-opening-leak-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`
/
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_opening_leak_building_apparent_dna_companion_owner`

Previous owner status:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous refresh re-probed candidate:
`wall.opening_leak_building_dntak_characteristic_adapter_owner`

Previous refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected candidate:
`wall.opening_leak_building_apparent_dna_companion_owner`

Owner action:
`post_v1_wall_opening_leak_building_apparent_dna_companion_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_OWNER_PLAN_2026-06-23.md`

Owner label:
`post-V1 wall opening/leak building apparent Dn,w/Dn,A companion owner`

Owner counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next action:
`post_v1_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Selected next label:
`post-V1 wall opening/leak building apparent Dn,w/Dn,A companion coverage refresh`

## Selection Card

User construction / formula family:

- wall host stack: gypsum board, air gap, rockwool, concrete;
- one catalogued opening/leak element with explicit area, count, Rw,
  rating basis, seal/leakage class, and origin;
- complete `building_prediction` context with opening/leak route fields,
  panel geometry, receiving/source volumes, RT60, flanking/junction
  inputs, `buildingPredictionOutputBasis`, and
  `third_octave_100_3150` for A-weighted `Dn,A`.

Target outputs opened:

- `Dn,w`;
- `Dn,A`.

Route:

- Gate S calculates the lab opening/leak composite Rw from the host wall
  and opening/leak element;
- the opening/leak building area-energy route calculates `R'w 31.6`;
- apparent normalized `Dn,w 31.9` is derived from `R'w` plus
  `10log10(S/10)`, using the explicit partition area;
- A-weighted `Dn,A 31.1` is derived from `Dn,w` with the owned
  opening/leak A-weighted adapter over `third_octave_100_3150`;
- existing standardized companions stay on the same route:
  `DnT,w 32.1`, `DnT,A 31.3`, and `DnT,A,k 30.4`.

Required physical inputs:

- `hostWallAreaM2`, opening element area/count/Rw/rating basis/seal
  class/origin;
- `panelWidthMm`, `panelHeightMm`, `receivingRoomVolumeM3`,
  `receivingRoomRt60S`, `sourceRoomVolumeM3`;
- `flankingJunctionClass`, `conservativeFlankingAssumption`,
  `junctionCouplingLengthM`, `buildingPredictionOutputBasis`;
- `frequencyBandSet: third_octave_100_3150` for owned `Dn,A`.

`needs_input` behavior:

- missing receiving-room volume or missing building output basis returns
  `needs_input`;
- missing frequency keeps `Dn,w` calculable while `Dn,A` remains
  unsupported until the A-weighted basis is present.

`unsupported` boundaries:

- apparent-only building basis calculates only apparent outputs
  `R'w`, `Dn,w`, and `Dn,A`; `DnT,w`, `DnT,A`, and `DnT,A,k` remain
  unsupported;
- lab context keeps `Dn,w` and `Dn,A` unsupported;
- impact aliases remain unsupported.

## Landed Runtime Behavior

- Complete apparent-and-standardized opening/leak building request:
  `R'w 31.6`, `Dn,w 31.9`, `Dn,A 31.1`, `DnT,w 32.1`,
  `DnT,A 31.3`, and `DnT,A,k 30.4`.
- Apparent-only opening/leak building request:
  `R'w 31.6`, `Dn,w 31.9`, and `Dn,A 31.1`; standardized and
  characteristic outputs stay closed.
- Missing frequency request:
  `Dn,w 31.9` remains live while `Dn,A` remains unsupported with the
  opening/leak A-weighted missing-frequency warning.

## Validation / Docs Sync

Focused validation for this owner should run with the previous
opening/leak coverage refresh and the owner contract:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-opening-leak-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts --maxWorkers=1 --reporter=dot`

The owner is included in `tools/dev/run-calculator-current-gate.ts`.
