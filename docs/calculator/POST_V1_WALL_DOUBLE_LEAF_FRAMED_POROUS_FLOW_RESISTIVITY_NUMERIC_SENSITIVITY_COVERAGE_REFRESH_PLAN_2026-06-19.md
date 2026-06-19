# Post-V1 Wall Double-Leaf/Framed Porous Flow-Resistivity Numeric Sensitivity Coverage Refresh - 2026-06-19

## Purpose

This is the selected next coverage refresh after the porous
flow-resistivity numeric sensitivity runtime owner. It should protect
the new numeric behavior without changing runtime values, then select
the next calculator-first slice.

This is not a broad source crawl, UI/report work, confidence-copy work,
or process cleanup.

Coverage refresh action:

`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts`

## Previous Owner

Previous coverage refresh:

`post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`
/
`post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Runtime owner:

`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-owner-contract.test.ts`

Runtime owner plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_FLOW_RESISTIVITY_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`

Runtime owner status:

`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.double_leaf_framed.porous_flow_resistivity_numeric_sensitivity_owner`

The owner makes `flowResistivityPaSM2` numerically active in the
double-leaf/framed porous cavity damping route. Nominal `15000 Pa*s/m2`
keeps the previous pins, while low/high off-nominal values move lab,
field, and building metrics. Counters: `accuracyPromotedRequestShapes:
4`, `accuracyPromotedTargetOutputs: 18`, `runtimeValuesMoved 18`,
`runtimeFormulaRetunes: 1`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Coverage Refresh Job

Create the coverage refresh contract:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts`

Re-probe these positives:

- explicit user-material porous absorber at `15000 Pa*s/m2` keeps
  existing lab and field/building pins;
- explicit user-material porous absorber at low/high off-nominal flow
  remains numerically distinct from nominal flow;
- context-owned `advancedWall.cavities[].absorberFlowResistivityPaSM2`
  uses the same numeric sensitivity;
- partial output requests remain target-output independent.

Protect these boundaries:

- missing user-supplied `flowResistivityPaSM2` remains `needs_input`;
- exact measured/source rows and compatible anchors retain precedence;
- impact/ASTM aliases remain unsupported unless their own owner lands;
- the refresh must not retune formulas or import source rows.

## Closeout Requirements

When this refresh lands, update `AGENTS.md`,
`docs/calculator/DOCUMENTATION_MAP.md`,
`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`,
`docs/calculator/CURRENT_STATE.md`,
`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`, and
`docs/calculator/NEXT_AGENT_BRIEF.md`.

## Landed Closeout

Coverage refresh status:

`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_coverage_ratio_numeric_sensitivity_owner`

Coverage refresh counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Selected candidate re-probed:

`wall.double_leaf_framed.porous_flow_resistivity_numeric_sensitivity_owner`

Selected next action:

`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_COVERAGE_RATIO_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`

Selected next label:

`post-V1 wall double-leaf/framed porous absorber coverage-ratio numeric sensitivity owner`

The refresh made no runtime value movement, imported no source rows, and
did not retune formulas. It selected the next adjacent runtime slice
because `advancedWall.cavities[].absorberCoverageRatio` was accepted by
the input surface but did not yet change the owned porous damping
calculation inside a coverage bucket. This is not a broad source crawl.
