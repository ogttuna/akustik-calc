# Post-V1 Wall Context-Owned Porous-Cavity Field/Building Lab-Companion Basis Integrity Coverage Refresh - 2026-06-19

## Purpose

This is the selected next no-runtime coverage refresh after the wall
context-owned porous-cavity field/building lab-companion basis-integrity
owner. It should re-probe the landed runtime behavior, protect the
metric/basis boundary, and then choose the next calculator-first slice.

This is not UI polish, broad source crawling, confidence-copy work,
process cleanup, or a formula retune.

## Previous Rerank And Owner

Previous rerank:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner`

Runtime owner:

`post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-owner-contract.test.ts`

Runtime owner plan:

`docs/calculator/POST_V1_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-19.md`

Runtime owner status:

`post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner`

The owner promotes a context-owned physical input variant of the
double-leaf/framed wall formula route. A wall with explicit side leaf
groups, independent frame topology, absorptive cavity depth/fill, and
`advancedWall.cavities[].absorberFlowResistivityPaSM2` now keeps
field/building lab companions on the owned direct lab curve:
`Rw 46`, `STC 46`, `C -1`, and `Ctr -6.1`. Field/building adapter
outputs remain `R'w 40`, `Dn,w 41`, `Dn,A 39.5`, `DnT,w 43`, and
`DnT,A 41.9`.

Owner counters: `accuracyPromotedRequestShapes: 4`,
`accuracyPromotedTargetOutputs: 16`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 4`, `runtimeValuesMoved 16`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Coverage Refresh Job

Create the coverage refresh contract:

`packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Re-probe these owned positives:

- lab context `Rw`, `STC`, `C`, and `Ctr` stay on the double-leaf
  formula lab basis;
- field lab-only `Rw`, `STC`, `C`, and `Ctr` stay supported from the
  direct lab curve;
- building lab-only `Rw`, `STC`, `C`, and `Ctr` stay supported from the
  direct lab curve;
- mixed field and building target sets keep lab companions on lab
  values while `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` stay on the
  field/building adapters;
- single and partial lab companion target sets are target-output
  independent.

Protect these boundaries:

- missing `advancedWall.cavities[].absorberFlowResistivityPaSM2` remains
  `needs_input`;
- missing side leaf grouping, cavity depth/fill, or absorptive cavity
  class does not silently default into the route;
- impact aliases such as `IIC` and `AIIC` remain unsupported;
- opening/leak, generic flanking, source crawling, and formula retuning
  remain outside this refresh.

## Closeout Requirements

When the refresh lands, update `AGENTS.md`,
`docs/calculator/DOCUMENTATION_MAP.md`,
`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`,
`docs/calculator/CURRENT_STATE.md`,
`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`, and
`docs/calculator/NEXT_AGENT_BRIEF.md`.

## Coverage Refresh Closeout

Coverage refresh action:

`post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Coverage refresh plan:

`docs/calculator/POST_V1_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`

Coverage refresh status:

`post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

The refresh re-probes the owner without runtime movement. It protects
lab context, field lab-only, building lab-only, mixed field/building,
single-output, and partial lab companion requests. It keeps `Rw 46`,
`STC 46`, `C -1`, `Ctr -6.1`, `R'w 40`, `Dn,w 41`, `Dn,A 39.5`,
`DnT,w 43`, and `DnT,A 41.9` on their owned bases.

It also protects missing flow/topology input boundaries and impact
aliases. It does not retune formulas, import source rows, touch
frontend implementation files, or broaden opening/leak and generic
flanking behavior. This is not a broad source crawl.

Coverage counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Current Selected Next

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_plan`

Selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-19.md`

Selected next label:

`post-V1 runtime-first route-family rerank after wall context-owned porous-cavity field/building lab-companion basis integrity`
