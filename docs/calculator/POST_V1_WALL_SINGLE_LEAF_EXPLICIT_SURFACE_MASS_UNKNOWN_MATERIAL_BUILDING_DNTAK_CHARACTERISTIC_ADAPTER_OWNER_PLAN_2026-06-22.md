# Post-V1 Wall Single-Leaf Explicit Surface-Mass Unknown-Material Building DnT,A,k Characteristic Adapter Owner Plan - 2026-06-22

Status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

## Purpose

This runtime owner opens the `DnT,A,k` target output for complete
`building_prediction` requests on project/user single-leaf and
laminated single-leaf panels with positive `surfaceMassKgM2`.

This is a calculator-scope increase, not a source crawl, UI polish
pass, confidence-labeling task, or generic docs cleanup. It uses the
already owned Gate AR building `DnT,A` value and applies the
characteristic room/area correction with explicit receiving-room volume
and partition area. It does not copy lab `Rw`/`STC`, and it does not
blindly alias `DnT,A` as `DnT,A,k`.

Previous no-runtime refresh:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-context-adapter-coverage-refresh-contract.test.ts`
/
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_coverage_refresh_landed_no_runtime_selected_building_dntak_characteristic_adapter_owner`

Previous runtime owner status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous refresh re-probed candidate:
`wall.single_leaf.explicit_surface_mass_unknown_material_building_context_adapter_owner`

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

Selected candidate:
`wall.single_leaf.explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner`

Owner action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Owner label:
`post-V1 wall single-leaf explicit surface-mass unknown-material building DnT,A,k characteristic adapter owner`

Selected next action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:
`post-V1 wall single-leaf explicit surface-mass unknown-material building DnT,A,k characteristic adapter coverage refresh`

Selected next coverage refresh landed status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_double_leaf_framed_building_dntak_characteristic_adapter_owner`

Selected follow-up runtime owner:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_OWNED_POROUS_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`
/
`post-V1 wall double-leaf/framed context-owned porous-cavity building DnT,A,k characteristic adapter owner`

Selected next coverage refresh counters:
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

Counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selection Card

User construction / formula family:

- cavity-free project single-leaf panel or laminated project panel;
- positive user-supplied `surfaceMassKgM2`;
- positive `thicknessMm`;
- complete `building_prediction` context;
- `buildingPredictionOutputBasis=standardized` or
  `apparent_and_standardized`.

Target outputs opened:

- `DnT,A,k` for the project single panel;
- `DnT,A,k` for the laminated project panel stack.

Route:

- owned single-leaf mass-law / banded calculated lab curve;
- Gate AR building-prediction adapter from base;
- explicit flanking/junction and room-standardization inputs;
- characteristic adapter:
  `DnT,A,k = DnT,A - 10log10(0.16 * V / (T0 * Sr))`,
  with `T0=0.5 s` and `Sr=max(partitionAreaM2, 7 m2)`.

Required physical inputs:

- positive user-supplied `surfaceMassKgM2`;
- positive `thicknessMm`;
- `contextMode=building_prediction`;
- partition area or `panelWidthMm` / `panelHeightMm`;
- `receivingRoomVolumeM3`;
- `receivingRoomRt60S` and the existing Gate AR inputs needed to
  produce `DnT,A`;
- `sourceRoomVolumeM3`;
- `flankingJunctionClass`;
- `conservativeFlankingAssumption`;
- `buildingPredictionOutputBasis`;
- `junctionCouplingLengthM`.

`needs_input` / fail-closed behavior:

- missing or non-positive `surfaceMassKgM2` stays outside the owner;
- missing receiving-room volume, panel area, or building context inputs
  keep `DnT,A,k` unsupported/needs-input;
- `buildingPredictionOutputBasis=apparent` does not publish
  `DnT,A,k`.

`unsupported` boundaries:

- field-context `DnT,A,k` remains outside this owner;
- lab-only requests remain outside this owner;
- `IIC`, `AIIC`, `Ln,w`, and other impact aliases remain unsupported;
- exact measured/source rows and compatible anchors keep precedence
  when they truly match basis and construction.

## Landed Runtime Behavior

- Project single panel `18 kg/m2`, `18 mm`:
  `DnT,A 35.2` and `DnT,A,k 32.3`.
- Laminated project panel `10 + 8 kg/m2`, `12 + 9 mm`:
  `DnT,A 33.6` and `DnT,A,k 30.7`.

This owner does not import source rows and does not broaden unrelated
families.
