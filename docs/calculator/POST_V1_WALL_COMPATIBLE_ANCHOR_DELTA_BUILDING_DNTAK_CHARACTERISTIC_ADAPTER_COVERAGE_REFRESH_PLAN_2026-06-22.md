# Post-V1 Wall Compatible Anchor-Delta Building DnT,A,k Characteristic Adapter Coverage Refresh Plan - 2026-06-22

Status:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_direct_fixed_double_leaf_building_dntak_characteristic_adapter_owner`

## Purpose

This landed no-runtime guard follows the compatible anchor-delta
building `DnT,A,k` characteristic adapter owner. It re-probes paired and
one-side exterior-board compatible anchor-delta building requests, mixed
Gate AR outputs, resolver `DnT,A,k` value pins, and fail-closed
boundaries.

This is not a broad source crawl, UI polish pass, confidence-labeling
task, or generic docs cleanup. It protects a landed calculator behavior
that increased calculable target outputs for real wall variants.

Previous runtime owner:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous refresh status:
`post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_compatible_anchor_delta_building_dntak_characteristic_adapter_owner`

Selected candidate to re-probe:
`wall.compatible_anchor_delta.building_dntak_characteristic_adapter_owner`

Selected coverage refresh action:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:
`post-V1 wall compatible anchor-delta building DnT,A,k characteristic adapter coverage refresh`

Coverage refresh landed status:
`post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_direct_fixed_double_leaf_building_dntak_characteristic_adapter_owner`

Selected next runtime action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner_plan`

Selected next runtime file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts`

Selected next runtime plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Selected next runtime label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive-cavity building DnT,A,k characteristic adapter owner`

Selected next runtime owner status:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Selected next runtime candidate:
`wall.double_leaf_framed.direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner`

Selected next coverage action after that owner:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected next coverage file after that owner:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected next coverage plan after that owner:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

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
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selection Card

User construction / formula family:

- compatible anchor-delta LSF wall with exterior board added on both
  sides;
- compatible anchor-delta LSF wall with exterior board added on one
  side;
- complete Gate AR `building_prediction` context.

Target outputs to protect:

- `DnT,A,k`;
- mixed building requests containing `R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, `DnT,A`, and `DnT,A,k`.

Route:

- measured LSF anchor plus bounded exterior board delta;
- Gate AR building-prediction adapter;
- characteristic adapter from `DnT,A`, receiving-room volume, and
  partition area with `T0=0.5 s`.

Required physical inputs:

- compatible anchor and added-board boundary;
- complete Gate AR building context.

`needs_input` / fail-closed behavior:

- missing volume or missing building output basis must stay outside;
- apparent-only output basis must not publish `DnT,A,k`;
- field and lab contexts remain outside this characteristic owner.

`unsupported` boundaries:

- impact aliases remain unsupported;
- non-compatible anchor stacks remain outside this owner.

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

1. Add the no-runtime coverage refresh contract.
2. Re-probe paired and one-side `DnT,A,k` pins and mixed building
   outputs.
3. Re-probe missing-input, apparent-only, field, lab, impact, and
   non-compatible-anchor boundaries.
4. Select the next runtime-first calculator slice after this refresh;
   do not chain support-only work.
