# Post-V1 Wall Double-Leaf/Framed Context-Owned Porous-Cavity Building DnT,A,k Characteristic Adapter Coverage Refresh Plan - 2026-06-22

Status:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_compatible_anchor_delta_building_dntak_characteristic_adapter_owner`

## Purpose

This landed no-runtime guard follows the double-leaf/framed
context-owned porous-cavity building `DnT,A,k` characteristic adapter
owner. It re-probes the just-opened `DnT,A,k` output and mixed Gate AR
building outputs for the complete double-leaf/framed
porous-cavity route while preserving missing-input and unsupported
boundaries.

This is not a broad source crawl, UI polish pass, confidence-labeling
task, or generic docs cleanup. It protects a landed calculator behavior
that increased calculable target outputs.

Previous runtime owner:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous refresh status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_double_leaf_framed_building_dntak_characteristic_adapter_owner`

Selected candidate to re-probe:
`wall.double_leaf_framed.context_owned_porous_cavity_building_dntak_characteristic_adapter_owner`

Selected coverage refresh action:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_OWNED_POROUS_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:
`post-V1 wall double-leaf/framed context-owned porous-cavity building DnT,A,k characteristic adapter coverage refresh`

Coverage refresh landed status:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_compatible_anchor_delta_building_dntak_characteristic_adapter_owner`

Selected next runtime action:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_plan`

Selected next runtime file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-owner-contract.test.ts`

Selected next runtime plan:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Selected next runtime label:
`post-V1 wall compatible anchor-delta building DnT,A,k characteristic adapter owner`

Selected next runtime owner status:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Selected next runtime candidate:
`wall.compatible_anchor_delta.building_dntak_characteristic_adapter_owner`

Selected next coverage action after that owner:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected next coverage file after that owner:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected next coverage plan after that owner:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next runtime owner counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Previous owner counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 1`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selection Card

User construction / formula family:

- context-owned double-leaf/framed porous-cavity wall;
- complete Gate AR `building_prediction` context.

Target outputs to protect:

- `DnT,A,k`;
- mixed building requests containing `R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, `DnT,A`, and `DnT,A,k`.

Route:

- owned double-leaf/framed direct curve;
- Gate AR building-prediction adapter;
- characteristic adapter from `DnT,A`, receiving-room volume, and
  partition area with `T0=0.5 s`.

Required physical inputs:

- complete double-leaf/framed topology and porous cavity inputs;
- complete Gate AR building context.

`needs_input` / fail-closed behavior:

- missing volume or porous-flow inputs must stay outside;
- apparent-only output basis must not publish `DnT,A,k`;
- field and lab contexts remain outside this characteristic owner.

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

Landed counters:

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

1. Add a no-runtime coverage refresh contract for complete
   double-leaf/framed porous-cavity `DnT,A,k` pins.
2. Re-probe mixed building outputs, missing volume, missing porous-flow
   inputs, apparent-only basis, field context, lab context, and impact
   unsupported boundaries.
3. Select the next action as runtime-first; do not chain support-only
   work unless it protects another just-landed calculator behavior.
