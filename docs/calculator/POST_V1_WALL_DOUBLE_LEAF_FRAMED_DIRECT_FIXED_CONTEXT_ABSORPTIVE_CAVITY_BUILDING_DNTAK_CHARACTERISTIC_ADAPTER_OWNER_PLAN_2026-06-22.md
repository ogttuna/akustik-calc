# Post-V1 Wall Double-Leaf/Framed Direct-Fixed Context Absorptive-Cavity Building DnT,A,k Characteristic Adapter Owner Plan - 2026-06-22

Status:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

## Purpose

This runtime owner opens the `DnT,A,k` target output for direct-fixed
double-leaf/framed absorptive-cavity wall `building_prediction`
requests. The route uses the existing Gate EO direct-fixed bridge-loss
direct curve, the Gate ER / Gate AR building adapter, then the
characteristic `DnT,A,k` transform.

This is calculator scope work. It makes another real wall family
calculable on the building basis with explicit physical inputs instead
of relabelling lab `Rw`/`STC` or copying `DnT,A`. It is not a broad
source crawl, UI polish pass, confidence-labeling task, or generic docs
cleanup.

Previous no-runtime refresh:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`
/
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_direct_fixed_double_leaf_building_dntak_characteristic_adapter_owner`

Previous refresh re-probed candidate:
`wall.compatible_anchor_delta.building_dntak_characteristic_adapter_owner`

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

Previous owner:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Owner action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Owner candidate:
`wall.double_leaf_framed.direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner`

Selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive-cavity building DnT,A,k characteristic adapter coverage refresh`

Landed coverage refresh:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_local_substitution_building_dntak_characteristic_adapter_owner`.

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

Post-refresh selected next:
`post_v1_wall_local_substitution_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-local-substitution-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`
/
`post-V1 wall local-substitution building DnT,A,k characteristic adapter owner`

Counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selection Card

User construction / formula family:

- two visible `12.5 mm` gypsum boards;
- direct-fixed double-leaf/framed support topology;
- `45 mm` cavity;
- full absorptive cavity with `15000 Pa*s/m2` flow resistivity;
- partial absorptive cavity with `15000 Pa*s/m2` flow resistivity;
- complete Gate AR `building_prediction` context.

Target output opened:

- `DnT,A,k` for full and partial direct-fixed absorptive-cavity building
  requests.

Route:

- Gate EO direct-fixed double-leaf bridge-loss direct curve;
- Gate ER / Gate AR building adapter;
- characteristic adapter:
  `DnT,A,k = DnT,A - 10log10(0.16 * V / (T0 * Sr))`,
  with `T0=0.5 s` and `Sr=max(partitionAreaM2, 7 m2)`;
- resolver trace carries `DnT,A,k` in `supportedMetrics` and
  `valuePins` when the route calculates it.

Required physical inputs:

- side A and side B leaf groups and masses;
- `cavity1DepthMm`;
- `supportTopology=direct_fixed`;
- `connectionType=direct_fix`;
- `supportSpacingMm`;
- `cavity1FillCoverage`;
- `cavity1AbsorptionClass=porous_absorptive`;
- `absorberFlowResistivityPaSM2`;
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
- missing absorber flow keeps the direct-fixed absorptive route out;
- apparent-only output basis may publish `DnT,A` but not `DnT,A,k`.

`unsupported` boundaries:

- field-context `DnT,A,k` remains outside this owner;
- lab-only `DnT,A,k` remains outside this owner;
- impact aliases remain unsupported;
- direct-fixed bridge-loss route remains uncalibrated and source-absent,
  with explicit uncertainty instead of measured-field evidence.

## Landed Runtime Behavior

- Full absorptive direct-fixed building request:
  `DnT,A 31.0` and `DnT,A,k 27.7`.
- Partial absorptive direct-fixed building request:
  `DnT,A 29.0` and `DnT,A,k 25.7`.

This owner does not import source rows and does not broaden unrelated
families.
