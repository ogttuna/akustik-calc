# Post-V1 Wall Double-Leaf/Framed Porous Absorber Coverage-Ratio Numeric Sensitivity Coverage Refresh - 2026-06-19

## Purpose

This is the selected next coverage refresh after the porous absorber
coverage-ratio numeric sensitivity runtime owner. It should protect the
new numeric behavior without moving runtime values, retuning formulas,
importing source rows, or touching frontend surfaces.

This is not a broad source crawl, UI/report work, confidence-copy work,
or process cleanup.

Coverage refresh action:

`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-coverage-refresh-contract.test.ts`

## Previous Runtime Owner

Previous refresh:

`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_coverage_ratio_numeric_sensitivity_owner`

Previous refresh selected candidate:

`wall.double_leaf_framed.porous_flow_resistivity_numeric_sensitivity_owner`

Previous owner:

`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_COVERAGE_RATIO_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`
/
`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.double_leaf_framed.porous_absorber_coverage_ratio_numeric_sensitivity_owner`

The owner made `advancedWall.cavities[].absorberCoverageRatio`
numerically active in the context-owned double-leaf/framed porous
damping formula. Ratio `1` preserves `Rw 46`, `STC 46`, `C -1`,
`Ctr -6.1`, `R'w 40`, `Dn,w 41`, `Dn,A 39.5`, `DnT,w 43`, and
`DnT,A 41.9`; ratio `0.5` returns lab `Rw 44` / `STC 44` and
field/building `R'w 38`, `Dn,w 39`, `Dn,A 37.5`, `DnT,w 41`, and
`DnT,A 39.9`; ratio `0.25` returns lab `Rw 43` / `STC 43` and
field/building `R'w 37`, `Dn,w 38`, `Dn,A 36.5`, `DnT,w 40`, and
`DnT,A 38.9`. Missing flow remains `needs_input`, impact aliases remain
`unsupported`, and no numeric ratio preserves legacy enum behavior.

Owner counters:

- `accuracyPromotedRequestShapes: 3`
- `accuracyPromotedTargetOutputs: 13`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 13`
- `runtimeFormulaRetunes: 1`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Coverage Refresh Job

Create the coverage refresh contract:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-coverage-refresh-contract.test.ts`

Re-probe these positives:

- ratio `1`, `0.5`, and `0.25` lab values remain pinned;
- field and building adapters continue to derive from the ratio-sensitive
  owned lab curve;
- no-ratio legacy contexts preserve enum behavior;
- `absorberCoverageRatio` appears in required inputs only when the
  advanced-wall cavity supplies the numeric input.

Protect these boundaries:

- missing `flowResistivityPaSM2` remains `needs_input`;
- exact source precedence and compatible anchors retain priority;
- impact/ASTM aliases remain unsupported unless their own owner lands;
- direct-fixed double-leaf owners must not be retuned by this refresh.

Expected refresh counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Closeout Requirements

When this refresh lands, update `AGENTS.md`,
`docs/calculator/DOCUMENTATION_MAP.md`,
`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`,
`docs/calculator/CURRENT_STATE.md`,
`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`, and
`docs/calculator/NEXT_AGENT_BRIEF.md`.
