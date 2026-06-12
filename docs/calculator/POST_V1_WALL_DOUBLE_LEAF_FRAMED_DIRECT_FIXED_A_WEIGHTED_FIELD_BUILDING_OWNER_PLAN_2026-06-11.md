# Post-V1 Wall Double-Leaf/Framed Direct-Fixed A-Weighted Field/Building Owner Plan - 2026-06-11

## Landed Closeout

This owner landed as
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
Selected candidate:
`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`.
It follows
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`.
Runtime moved A-only direct-fixed `Dn,A` / `DnT,A` values onto Gate ER:
empty `24.9 / 27`, full absorptive `28.9 / 31`, partial absorptive
`26.9 / 29`. This is not a broad source crawl. Counters:
`newCalculableRequestShapes: 4`, `correctedRequestShapes: 2`,
`newCalculableTargetOutputs: 2`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 12`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_SURFACE_PARITY_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building surface parity`.

Surface parity has since landed as
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It keeps `Dn,A 24.9` / `DnT,A 27`, `Dn,A 28.9` / `DnT,A 31`, and
`Dn,A 26.9` / `DnT,A 29` aligned across workbench/API/replay/cards/status/report
on `gate_i_airborne_field_apparent_context_adapter_runtime` /
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor` with
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
Surface counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_COVERAGE_REFRESH_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building coverage refresh`.

## North Star

DynEcho is an acoustic calculator. This slice must make complete
direct-fixed double-leaf/framed wall assemblies answer A-weighted
field/building requests through the already-owned Gate EO + Gate ER
calculation route. It must not import source rows, retune the formula,
or alias lab `Rw` / `STC` into field or building `Dn,A` / `DnT,A`.

## Previous Gate

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`

Selected candidate:

`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`

Previous rerank counters: `roiAnalysisIterations: 3`,
`estimatedNextRuntimeValuesMoved: 12`, `immediateRuntimeValuesMoved: 0`,
`runtimeBasisPromotions: 0`, `runtimeFormulaRetunes: 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

The rerank found that direct-fixed field/building mixed requests already
calculate A-weighted companions through the Gate ER route when base
metrics are requested:

- empty direct-fixed field/building: `Dn,A 24.9`, `DnT,A 27`;
- full context-owned absorptive cavity field/building: `Dn,A 28.9`,
  `DnT,A 31`;
- partial context-owned absorptive cavity field/building: `Dn,A 26.9`,
  `DnT,A 29`.

The gap is request-shape and route ownership, not formula absence:
full/partial A-weighted-only requests are currently unsupported, while
empty direct-fixed A-weighted-only requests can fall through to a
non-Gate-ER single-leaf/misaligned path. The owner must align A-only
requests with the same Gate EO direct curve and Gate I / Gate AR adapter
used by mixed base+A requests.

## Iteration 1 - Scope Boundary

Admit only complete direct-fixed double-leaf/framed wall contexts:

- `supportTopology=direct_fixed`;
- `connectionType=direct_fix`;
- complete side A / side B leaf grouping;
- complete cavity depth and support spacing;
- `field_between_rooms` with the Gate I field physical inputs, or
  `building_prediction` with the Gate AR building physical inputs;
- for absorptive cavities, owned absorber coverage/class and
  `absorberFlowResistivityPaSM2`.

Do not admit Gate AY panelized advanced-wall input, missing absorber
ownership, non-direct-fixed absorptive stacks, ASTM/IIC/AIIC, impact
metrics, or lab aliases.

## Iteration 2 - Runtime Movement

The implementation should reuse the existing Gate ER field/building
adapter over the Gate EO direct separating-element curve. The expected
runtime movement is:

- 4 newly calculable A-only request shapes: full/partial absorptive
  field and full/partial absorptive building;
- 2 corrected A-only request shapes: empty direct-fixed field and empty
  direct-fixed building, which must stop using the wrong non-Gate-ER
  path;
- 12 total A-weighted target values moved or corrected across
  `Dn,A` / `DnT,A`.

No formula retune is allowed. If the values do not match the already
live mixed base+A Gate ER values, the slice must stop and investigate
instead of inventing a new adapter.

## Iteration 3 - Surface And Boundaries

After the owner lands, add or update surface parity only if the
workbench/API/card/report layer still parks A-only requests differently
from the engine. The owner itself should remain engine-first. Existing
base field/building `R'w`, `Dn,w`, `DnT,w` values must not change.

## Work Order

Selected action:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`

Selected file:

`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`

Selected label:

`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building owner`

Expected counters:

- `newCalculableRequestShapes: 4`;
- `correctedRequestShapes: 2`;
- `newCalculableTargetOutputs: 2`;
- `runtimeBasisPromotions: 2`;
- `runtimeValuesMoved 12`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.
