# Post-V1 Wall Compatible Anchor-Delta Building DnT,A,k Characteristic Adapter Owner Plan - 2026-06-22

Status:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

## Purpose

This runtime owner opens the `DnT,A,k` target output for compatible
anchor-delta lightweight steel frame wall building requests. The route
starts from the measured LSF reduced-stack anchor, applies the bounded
added exterior board delta, then uses the owned Gate AR
building-prediction adapter and characteristic `DnT,A,k` transform.

This is calculator scope work. It makes another real user-entered wall
variant calculable on the correct building basis instead of relabelling
lab `Rw`/`STC`, and it keeps required building inputs explicit. It is
not a broad source crawl, UI polish pass, confidence-labeling task, or
generic docs cleanup.

Previous no-runtime refresh:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_compatible_anchor_delta_building_dntak_characteristic_adapter_owner`

Previous refresh re-probed:
`wall.double_leaf_framed.context_owned_porous_cavity_building_dntak_characteristic_adapter_owner`

Previous refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Previous owner:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Owner action:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Owner candidate:
`wall.compatible_anchor_delta.building_dntak_characteristic_adapter_owner`

Selected next action:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:
`post-V1 wall compatible anchor-delta building DnT,A,k characteristic adapter coverage refresh`

Selected coverage refresh landed status:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_direct_fixed_double_leaf_building_dntak_characteristic_adapter_owner`

Follow-up runtime action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner_plan`

Follow-up runtime file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts`

Follow-up runtime plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selection Card

User construction / formula family:

- lightweight steel frame anchor stack with two acoustic gypsum boards
  each side, `5 mm` air gap, and `70 mm` glasswool;
- variant A: one `12.5 mm` acoustic gypsum board added to both outer
  faces;
- variant B: one `12.5 mm` acoustic gypsum board added to one outer
  face;
- complete Gate AR `building_prediction` context.

Target output opened:

- `DnT,A,k` for both compatible anchor-delta building request shapes.

Route:

- measured compatible reduced-stack LSF anchor;
- bounded added exterior board delta;
- Gate AR building-prediction adapter from the owned shifted direct
  curve;
- characteristic adapter:
  `DnT,A,k = DnT,A - 10log10(0.16 * V / (T0 * Sr))`,
  with `T0=0.5 s` and `Sr=max(partitionAreaM2, 7 m2)`;
- resolver trace now carries `DnT,A,k` in `supportedMetrics` and
  `valuePins` when the route calculates it.

Required physical inputs:

- exact compatible anchor stack boundary;
- added-board delta boundary;
- `contextMode=building_prediction`;
- partition area or `panelWidthMm` / `panelHeightMm`;
- `sourceRoomVolumeM3`;
- `receivingRoomVolumeM3`;
- `receivingRoomRt60S`;
- `flankingJunctionClass`;
- `conservativeFlankingAssumption`;
- `junctionCouplingLengthM`;
- `buildingPredictionOutputBasis`.

`needs_input` / fail-closed behavior:

- missing receiving-room volume keeps `DnT,A,k` out;
- missing building output basis keeps `DnT,A,k` out;
- apparent-only output basis may publish `DnT,A` but not `DnT,A,k`.

`unsupported` boundaries:

- field-context `DnT,A,k` remains outside this owner;
- lab-only `DnT,A,k` remains outside this owner;
- impact aliases remain unsupported;
- non-compatible anchors must not borrow this measured-anchor delta.

## Landed Runtime Behavior

- Paired exterior-board compatible anchor-delta building request:
  `DnT,A 51.9` and `DnT,A,k 49.0`.
- One-side exterior-board compatible anchor-delta building request:
  `DnT,A 50.4` and `DnT,A,k 47.5`.

This owner does not import source rows and does not broaden unrelated
families.
