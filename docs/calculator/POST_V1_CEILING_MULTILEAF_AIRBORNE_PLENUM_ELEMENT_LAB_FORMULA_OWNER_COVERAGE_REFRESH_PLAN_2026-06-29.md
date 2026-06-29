# Post-V1 Ceiling Multileaf Airborne Plenum Element-Lab Formula Owner Coverage Refresh Plan

Date: 2026-06-29

Status:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh`

Action:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`

Planning status:
landed no-runtime coverage refresh after
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_landed_runtime_basis_selected_coverage_refresh`.

Previous rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_element_lab_formula_owner`.

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`.

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`.

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`.

Selected next label:
`post-V1 runtime-first route-family rerank after ceiling multileaf airborne plenum element-lab formula owner coverage refresh`.

## Selection Card

- User construction / formula family: ceiling-only multileaf or suspended
  plenum airborne stack with gypsum-board leaf, plenum/cavity/fill
  layers, and explicit plenum physical context.
- Target outputs to protect: `Rw`, `STC`, `C`, and `Ctr` on
  `element_lab`.
- Route: runtime owner
  `post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner`
  through route `ceiling`.
- Required physical inputs already consumed by the owner:
  `ceilingLeafGrouping`, `ceilingLeafSurfaceMassKgM2`,
  `ceilingCavityOrPlenumDepthMm`,
  `ceilingAbsorberThicknessAndFlowResistivity`, and
  `ceilingSupportCouplingOrHangerClass`.
- `needs_input` behavior: incomplete plenum context must stay on
  `post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`.
- Unsupported boundaries: field/building outputs, floor impact outputs,
  `IIC`/`AIIC`, `OITC`, ASTM aliases, source-row proximity
  substitution, and confidence fallback must remain blocked.

## Landed Runtime To Preserve

The owner action is
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_plan`
in
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts`.
It landed as
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_landed_runtime_basis_selected_coverage_refresh`.

Complete fixture values:

- `Rw 48`
- `STC 48`
- `C -1.7`
- `Ctr -6.5`
- route `ceiling`
- basis `element_lab`
- selected candidate
  `ceiling.multileaf_airborne_plenum_element_lab_formula_owner`

Counters to preserve:

- `newCalculableLayerTemplates: 1`
- `newCalculableRequestShapes: 1`
- `newCalculableTargetOutputs: 4`
- `requiredPhysicalInputsCaptured: 0`
- `runtimeBasisPromotions: 1`
- `runtimeValuesMoved 4`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 6`

## Coverage Refresh Contract

Selected next action:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`.

Selected next file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`.

Selected next label:
`post-V1 ceiling multileaf airborne plenum element-lab formula owner coverage refresh`.

The refresh should not move runtime values. It should re-run the complete
plenum element-lab fixture, the incomplete-input fixture, and the
field/impact/OITC hostile fixtures, then select the next highest-ROI
runtime owner from the opening sequence.

Landed counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`.
This is not a broad source crawl.
