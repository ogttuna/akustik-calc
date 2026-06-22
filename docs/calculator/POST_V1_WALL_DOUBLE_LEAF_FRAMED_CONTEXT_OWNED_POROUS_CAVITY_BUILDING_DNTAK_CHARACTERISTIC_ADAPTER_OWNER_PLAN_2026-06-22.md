# Post-V1 Wall Double-Leaf/Framed Context-Owned Porous-Cavity Building DnT,A,k Characteristic Adapter Owner Plan - 2026-06-22

Status:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

## Purpose

This runtime owner opens the `DnT,A,k` target output for complete
`building_prediction` requests on the context-owned double-leaf/framed
porous-cavity wall route.

This is calculator scope work. It extends the same owned characteristic
adapter used after Gate AR `DnT,A` to a second wall formula family with
explicit leaf groups, cavity depth, porous absorber inputs, support
spacing, room volume, partition area, flanking/junction context, and
building output basis. It is not a broad source crawl, UI polish pass,
confidence-labeling task, or generic docs cleanup.

Previous no-runtime refresh:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`
/
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_double_leaf_framed_building_dntak_characteristic_adapter_owner`

Previous runtime owner status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous refresh re-probed:
`wall.single_leaf.explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner`

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

Owner action:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_OWNED_POROUS_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Owner candidate:
`wall.double_leaf_framed.context_owned_porous_cavity_building_dntak_characteristic_adapter_owner`

Selected next action:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_OWNED_POROUS_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:
`post-V1 wall double-leaf/framed context-owned porous-cavity building DnT,A,k characteristic adapter coverage refresh`

Selected coverage refresh landed status:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_compatible_anchor_delta_building_dntak_characteristic_adapter_owner`

Follow-up runtime action:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_plan`

Follow-up runtime file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-owner-contract.test.ts`

Follow-up runtime plan:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 1`,
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

- double-leaf/framed wall with two gypsum leaves;
- independent framed support topology;
- `90 mm` sealed porous cavity;
- `15000 Pa*s/m2` porous absorber flow resistivity;
- full absorber coverage and full-depth absorber thickness;
- complete `building_prediction` context.

Target output opened:

- `DnT,A,k` for the complete context-owned double-leaf/framed
  porous-cavity building request.

Route:

- owned double-leaf/framed mass-air-mass / bridge / porous-cavity
  direct curve;
- Gate AR building-prediction adapter from the owned direct curve;
- characteristic adapter:
  `DnT,A,k = DnT,A - 10log10(0.16 * V / (T0 * Sr))`,
  with `T0=0.5 s` and `Sr=max(partitionAreaM2, 7 m2)`.

Required physical inputs:

- side A and side B leaf groups;
- leaf masses and thicknesses;
- `cavity1DepthMm`;
- `flowResistivityPaSM2`;
- `absorberCoverageRatio`;
- `absorberThicknessMm`;
- `supportTopology`;
- `supportSpacingMm`;
- `contextMode=building_prediction`;
- partition area or `panelWidthMm` / `panelHeightMm`;
- `receivingRoomVolumeM3`;
- complete Gate AR building context.

`needs_input` / fail-closed behavior:

- missing receiving-room volume or other Gate AR building inputs keeps
  `DnT,A,k` out;
- missing porous-flow/cavity owner inputs keeps the route parked;
- apparent-only output basis must not publish `DnT,A,k`.

`unsupported` boundaries:

- field-context `DnT,A,k` remains outside this owner;
- lab-only requests remain outside this owner;
- impact aliases remain unsupported;
- exact measured/source rows and compatible anchors keep precedence when
  they truly match basis and construction.

## Landed Runtime Behavior

- Complete double-leaf/framed porous-cavity building request:
  `DnT,A 43.6` and `DnT,A,k 40.7`.

This owner does not import source rows and does not broaden unrelated
families.
