# Post-V1 Wall Single-Leaf Explicit Surface-Mass Unknown-Material Building DnT,A,k Characteristic Adapter Coverage Refresh Plan - 2026-06-22

Status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_double_leaf_framed_building_dntak_characteristic_adapter_owner`

## Purpose

This is the selected next no-runtime guard after the
single-leaf explicit surface-mass unknown-material building
`DnT,A,k` characteristic adapter owner. It should re-probe the
just-opened `DnT,A,k` output for project/user single-leaf and
laminated single-leaf panels so the characteristic adapter does not
regress while preserving missing-input and unsupported boundaries.

This is not a broad source crawl, UI polish pass, confidence-labeling
task, or generic docs cleanup. It protects a landed calculator behavior
that increased calculable target outputs.

Previous runtime owner:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous owner follows:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_coverage_refresh_landed_no_runtime_selected_building_dntak_characteristic_adapter_owner`

Selected candidate to re-probe:
`wall.single_leaf.explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner`

Selected coverage refresh action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:
`post-V1 wall single-leaf explicit surface-mass unknown-material building DnT,A,k characteristic adapter coverage refresh`

Selected next runtime owner:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_OWNED_POROUS_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`
/
`post-V1 wall double-leaf/framed context-owned porous-cavity building DnT,A,k characteristic adapter owner`

Selected next candidate:
`wall.double_leaf_framed.context_owned_porous_cavity_building_dntak_characteristic_adapter_owner`

Selected next status:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Selected next counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 1`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Current selected next after the runtime owner:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_OWNED_POROUS_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`
/
`post-V1 wall double-leaf/framed context-owned porous-cavity building DnT,A,k characteristic adapter coverage refresh`

Previous owner counters:
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
- complete `building_prediction` context;
- `buildingPredictionOutputBasis=standardized` or
  `apparent_and_standardized`.

Target outputs to protect:

- `DnT,A,k` for the project single panel;
- `DnT,A,k` for the laminated project panel stack;
- mixed building requests containing `R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, `DnT,A`, and `DnT,A,k`.

Route:

- owned single-leaf mass-law / banded calculated lab curve;
- Gate AR building-prediction adapter from base;
- characteristic adapter from Gate AR `DnT,A`, receiving-room volume,
  and partition area with `T0=0.5 s`.

Required physical inputs:

- positive user-supplied `surfaceMassKgM2`;
- positive `thicknessMm`;
- `contextMode=building_prediction`;
- partition area or `panelWidthMm` / `panelHeightMm`;
- `receivingRoomVolumeM3`;
- complete Gate AR building context.

`needs_input` / fail-closed behavior:

- missing mass and missing building inputs must stay outside;
- apparent-only output basis must not publish `DnT,A,k`;
- field-context `DnT,A,k` remains outside this owner.

`unsupported` boundaries:

- impact aliases remain unsupported;
- exact measured/source rows and compatible anchors keep precedence.

Expected counters:

- `coverageRefreshContractFilesTouched: 1`;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Implementation Steps

1. Add a no-runtime coverage refresh contract for project single-leaf
   and laminated project-panel `DnT,A,k` pins.
2. Re-probe missing mass, missing building inputs, apparent-only basis,
   field context, and impact unsupported boundaries.
3. Select the double-leaf/framed context-owned porous-cavity building
   `DnT,A,k` characteristic adapter owner as the next runtime-first
   action.
