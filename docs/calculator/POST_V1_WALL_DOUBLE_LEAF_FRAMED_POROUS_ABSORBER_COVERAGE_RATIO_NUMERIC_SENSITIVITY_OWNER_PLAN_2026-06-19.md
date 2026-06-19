# Post-V1 Wall Double-Leaf/Framed Porous Absorber Coverage-Ratio Numeric Sensitivity Owner - 2026-06-19

## Purpose

This runtime owner follows the porous flow-resistivity numeric
sensitivity refresh. It fixes the next adjacent physical-input gap in
the same double-leaf/framed porous cavity formula route:
`advancedWall.cavities[].absorberCoverageRatio` is currently accepted by
the input surface, but the public runtime only uses the coarse
`cavity1FillCoverage` enum. Ratios such as `0.25`, `0.5`, `0.75`, and
`1` therefore collapse to the same damping value inside each enum
bucket.

The owner should make the numeric coverage ratio scale the owned porous
damping credit, while preserving the existing no-ratio behavior for
visible-layer and legacy contexts.

This is calculator runtime work. It is not a broad source crawl, UI
work, confidence-copy work, or docs-only cleanup.

Owner action:

`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-owner-contract.test.ts`

## Previous Refresh

Previous refresh:

`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_coverage_ratio_numeric_sensitivity_owner`

Previous owner status:

`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Previous refresh selected candidate:

`wall.double_leaf_framed.porous_flow_resistivity_numeric_sensitivity_owner`

Previous refresh counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Selected Candidate

`wall.double_leaf_framed.porous_absorber_coverage_ratio_numeric_sensitivity_owner`

## Selection Card

- User construction / formula family:
  double-leaf/framed wall with explicit side leaf groups, independent
  frame topology, absorptive cavity, owned `flowResistivityPaSM2`, and
  context-owned `absorberCoverageRatio`.
- Target outputs to improve:
  lab `Rw`, `STC`, `C`, `Ctr`; field/building `R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, and `DnT,A` when adapters are already owned.
- Formula route:
  existing source-absent double-leaf/framed formula curve, with porous
  damping credit scaled by bounded numeric absorber coverage ratio
  before the ISO/field/building adapters run.
- Required physical inputs:
  side A/B leaf groups, cavity depth, support topology, support spacing,
  cavity absorption class, `flowResistivityPaSM2`, and
  `absorberCoverageRatio` when the advanced-wall cavity supplies it.
- `needs_input` behavior:
  missing user-supplied flow remains `needs_input`; absent coverage
  ratio on legacy/visible-layer contexts must preserve existing enum
  behavior rather than inventing a ratio.
- Unsupported boundaries:
  exact source precedence, impact/ASTM aliases, opening/leak paths, and
  unowned field/building contexts remain outside.

## Expected Movement

Expected counters:

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

Expected runtime behavior:

- ratio `1` keeps the current full-coverage pins;
- lower ratios reduce the same route's porous damping credit and move
  lab/field/building values downward;
- no numeric ratio preserves existing visible-layer behavior.

## Landed Closeout

Owner status:

`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-owner-contract.test.ts`

Runtime behavior landed:

- ratio `1` keeps `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`,
  `R'w 40`, `Dn,w 41`, `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`;
- ratio `0.5` returns lab `Rw 44` / `STC 44` and field/building
  `R'w 38`, `Dn,w 39`, `Dn,A 37.5`, `DnT,w 41`, and `DnT,A 39.9`;
- ratio `0.25` returns lab `Rw 43` / `STC 43` and field/building
  `R'w 37`, `Dn,w 38`, `Dn,A 36.5`, `DnT,w 40`, and `DnT,A 38.9`;
- missing user-supplied `flowResistivityPaSM2` remains `needs_input`;
- impact aliases remain `unsupported`;
- no numeric ratio preserves legacy enum behavior.

Landed counters:

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

Selected next action:

`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_COVERAGE_RATIO_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`

Selected next label:

`post-V1 wall double-leaf/framed porous absorber coverage-ratio numeric sensitivity coverage refresh`

This is not a broad source crawl.
