# Post-V1 Wall Opening/Leak Building DnT,A,k Characteristic Adapter Owner Plan - 2026-06-22

Status:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

## Purpose

This landed runtime owner opens `DnT,A,k` for the already-owned
opening/leak `building_prediction` A-weighted adapter. It reuses the
characteristic formula already owned by the Gate AR building route:

`DnT,A,k = DnT,A - 10log10(0.16 * V / (T0 * Sr))`

where `T0=0.5 s` and `Sr=max(partition area, 7 m2)`.

This is not a broad source crawl, UI polish pass, confidence-labeling
task, or generic docs cleanup. It increases calculator target-output
scope for a real opening/leak wall request whose building `DnT,A` is
already calculated from owned opening area-energy and A-weighted
adapter logic.

Previous refresh:
`post_v1_wall_local_substitution_building_dntak_characteristic_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-local-substitution-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`
/
`post_v1_wall_local_substitution_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_opening_leak_building_dntak_characteristic_adapter_owner`

Previous owner status:
`post_v1_wall_local_substitution_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous refresh re-probed candidate:
`wall.local_substitution_building_dntak_characteristic_adapter_owner`

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
`wall.opening_leak_building_dntak_characteristic_adapter_owner`

Owner action:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-opening-leak-building-dntak-characteristic-adapter-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Owner label:
`post-V1 wall opening/leak building DnT,A,k characteristic adapter owner`

Owner counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 1`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next action:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-opening-leak-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:
`post-V1 wall opening/leak building DnT,A,k characteristic adapter coverage refresh`

Selected next coverage refresh status:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_opening_leak_building_apparent_dna_companion_owner`

Selected next coverage refresh candidate:
`wall.opening_leak_building_dntak_characteristic_adapter_owner`

Selected next coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Post-refresh selected runtime action:
`post_v1_wall_opening_leak_building_apparent_dna_companion_owner_plan`

Post-refresh selected runtime file:
`packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts`

Post-refresh selected runtime plan:
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_OWNER_PLAN_2026-06-23.md`

## Selection Card

User construction / formula family:

- wall host stack: gypsum board, air gap, rockwool, concrete;
- one catalogued opening/leak element with explicit area, count, Rw,
  rating basis, seal/leakage class, and origin;
- complete `building_prediction` context with opening/leak route fields,
  room geometry, receiving/source volumes, RT60, flanking/junction
  inputs, and `third_octave_100_3150` A-weighted frequency basis.

Target output opened:

- `DnT,A,k`, beside the already-owned opening/leak building outputs
  `R'w`, `DnT,w`, and `DnT,A`.

Route:

- Gate S owns the lab opening/leak composite Rw from host wall,
  opening area, opening Rw, and seal/leakage penalty;
- the opening/leak building area-energy adapter calculates
  `R'w` and `DnT,w`;
- the opening/leak A-weighted adapter calculates building `DnT,A 31.3`;
- the characteristic adapter derives `DnT,A,k 30.4` from `DnT,A`,
  receiving-room volume, partition area, and `T0=0.5 s`.

Required physical inputs:

- `hostWallAreaM2`, opening element area/count/Rw/rating basis/seal
  class/origin;
- `panelWidthMm`, `panelHeightMm`, `receivingRoomVolumeM3`,
  `receivingRoomRt60S`, `sourceRoomVolumeM3`;
- `flankingJunctionClass`, `conservativeFlankingAssumption`,
  `junctionCouplingLengthM`, `buildingPredictionOutputBasis`;
- `frequencyBandSet: third_octave_100_3150` for owned A-weighted
  `DnT,A`.

`needs_input` behavior:

- missing receiving-room volume or missing building output basis returns
  `needs_input`;
- missing frequency band keeps `DnT,A` and `DnT,A,k` unsupported instead
  of fabricating A-weighted values.

`unsupported` boundaries:

- apparent-only building basis keeps `DnT,A,k` unsupported;
- field context keeps `DnT,A,k` unsupported;
- lab context keeps `DnT,A,k` and `DnT,A` unsupported;
- building `Dn,A` alias and impact aliases remain unsupported.

## Landed Runtime Behavior

- Complete opening/leak building request:
  `DnT,A 31.3`, `DnT,A,k 30.4`.
- Mixed opening/leak building request:
  `R'w 31.6`, `DnT,w 32.1`, `DnT,A 31.3`, and `DnT,A,k 30.4`.
- Runtime method remains
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor`.
- The result carries the characteristic basis marker
  `nen_5077_characteristic_dntak_from_gate_ar_building_prediction`.

## Validation / Docs Sync

Validation completed for the landed owner:

- targeted owner + previous local-substitution coverage refresh:
  `2 files / 10 tests passed`;
- opening/local neighbor chain:
  `5 files / 26 tests passed`;
- `git diff --check` passed.

`pnpm calculator:gate:current` included this owner and the previous
local-substitution coverage refresh, and both new files passed inside
that gate. The full current gate still exits non-zero because of
pre-existing global dirty-state failures outside this opening/leak
`DnT,A,k` slice. Do not treat those existing failures as a reason to
undo this runtime owner.
