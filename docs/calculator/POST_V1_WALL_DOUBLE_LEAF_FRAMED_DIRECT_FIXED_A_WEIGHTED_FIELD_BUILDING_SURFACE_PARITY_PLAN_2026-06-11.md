# Post-V1 Wall Double-Leaf/Framed Direct-Fixed A-Weighted Field/Building Surface Parity Plan - 2026-06-11

## Landed Closeout

This surface parity landed as
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, output cards, target-output status, and report
summaries now keep empty `Dn,A 24.9` / `DnT,A 27`, full absorptive
`Dn,A 28.9` / `DnT,A 31`, and partial absorptive `Dn,A 26.9` /
`DnT,A 29` on `gate_i_airborne_field_apparent_context_adapter_runtime`
/
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor` with
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
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

DynEcho is an acoustic calculator. After the direct-fixed A-weighted
field/building owner lands, the workbench surface must show the same
Gate ER `Dn,A` / `DnT,A` values that the engine calculates. This is a
surface parity slice, not report polish or generic UI work.

## Previous Gate

Previous owner:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`

Previous owner status:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`

Previous selected candidate:

`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`

The owner opens A-only direct-fixed double-leaf/framed field/building
requests through the same Gate EO + Gate I / Gate AR route already used
by mixed base+A requests:

- empty direct-fixed field/building: `Dn,A 24.9`, `DnT,A 27`;
- full context-owned absorptive cavity field/building: `Dn,A 28.9`,
  `DnT,A 31`;
- partial context-owned absorptive cavity field/building: `Dn,A 26.9`,
  `DnT,A 29`.

Runtime counters: `newCalculableRequestShapes: 4`,
`correctedRequestShapes: 2`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 12`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Surface Checks

The surface parity file must verify:

- workbench live calculation uses the Gate I field surface for
  `field_between_rooms` A-only requests;
- workbench live calculation uses the Gate AR building surface for
  `building_prediction` A-only requests;
- calculator API payloads, saved replay, server snapshot replay, output
  cards, target-output status, and report summaries show the same
  `Dn,A` / `DnT,A` values and basis;
- missing absorber ownership, Gate AY panelized input, non-direct-fixed
  absorptive stacks, ASTM/IIC/AIIC, impact outputs, and lab aliases
  remain outside this surface.

## Work Order

Selected action:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`

Selected file:

`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`

Selected label:

`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building surface parity`

Expected counters:

- `webSurfaceParityContractFilesTouched: 1`;
- `frontendImplementationFilesTouched: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`.

This is not a broad source crawl.
