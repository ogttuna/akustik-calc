# Post-V1 Floor User-Material Impact Context Dynamic-Stiffness Coverage Refresh Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. This follow-up exists only to freeze
the runtime owner that lets custom visible heavy floating-floor stacks
calculate ISO lab impact outputs when the user supplies the missing
physical inputs through `floorImpactContext`.

This is not material-editor UI work, source crawling, a finite source
row pack, or a formula retune.

## Previous Owner

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`

Landed owner:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`

Owner file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`

Owner status:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`floor.user_material_impact_context_dynamic_stiffness_owner`

The owner moves one custom floor request shape from unsupported to
calculated: a visible `base_structure / resilient_layer /
floating_screed / floor_covering` stack with custom heavy concrete,
custom resilient underlay, and explicit
`floorImpactContext.resilientLayerDynamicStiffnessMNm3` plus
`floorImpactContext.loadBasisKgM2` now calculates `Ln,w 50.3` and
`DeltaLw 24.3` through
`predictor_heavy_floating_floor_iso12354_annexc_estimate`.

Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Selected Work

Selected action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`

Selected file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`

Selected label:

`post-V1 floor user-material impact context dynamic-stiffness coverage refresh`

## Coverage Refresh Scope

The coverage refresh should re-probe and freeze:

- context-owned custom heavy floating-floor stack:
  `Ln,w 50.3`, `DeltaLw 24.3`;
- runtime basis:
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`;
- metric basis:
  `LnW` and `DeltaLw` both on the same heavy floating-floor formula;
- supported outputs:
  `Ln,w`, `DeltaLw`;
- missing dynamic stiffness or missing load basis:
  keep `needs_input` and do not use a published-family estimate as a
  substitute for `DeltaLw`;
- low-density custom concrete with concrete tags:
  keep unsupported, because it is not an eligible heavy concrete carrier;
- ASTM `IIC` / `AIIC`, field `L'n,w` / `L'nT,w`, and building impact
  outputs:
  keep outside this owner.

## Expected Counters

Expected refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
