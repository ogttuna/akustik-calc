# Post-V1 Ceiling Multileaf Airborne Plenum Element-Lab Formula Owner - 2026-06-29

Status:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_plan`

Landed status:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_landed_runtime_basis_selected_coverage_refresh`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_element_lab_formula_owner`.

Selected candidate:
`ceiling.multileaf_airborne_plenum_element_lab_formula_owner`.

Expected owner file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts`

Plan file:
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_PLAN_2026-06-29.md`

Selected next label:
`post-V1 ceiling multileaf airborne plenum element-lab formula owner`.

Selected next action after landing:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`

Selected next file after landing:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`

Selected next plan after landing:
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected next label after landing:
`post-V1 ceiling multileaf airborne plenum element-lab formula owner coverage refresh`.

Latest landed no-runtime coverage refresh after this owner:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh`.
The refresh re-probes selected candidate
`ceiling.multileaf_airborne_plenum_element_lab_formula_owner`, keeps
`Rw 48`, `STC 48`, `C -1.7`, and `Ctr -6.5` pinned, and selects next
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`. This is not a broad source crawl.

Landed runtime values:
complete explicit ceiling plenum element-lab context now publishes
`Rw 48`, `STC 48`, `C -1.7`, and `Ctr -6.5` through route `ceiling`.
Incomplete plenum context remains on
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`;
field/building, impact, `IIC`/`AIIC`, `OITC`, ASTM aliases, source-row
proximity substitution, and confidence fallback remain blocked.

Previous coverage refresh:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh`.

Previous owner:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_OWNER_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`.

Selecting rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`.

This is not a broad source crawl.

## Purpose

Open the first owned element-lab formula route for ceiling-only
multileaf or suspended-plenum airborne stacks. The preceding boundary
already prevents wrong fallback. This owner should consume the named
physical inputs and publish values only for the bounded ceiling airborne
family.

## Selection Card

User construction / formula family:
ceiling-only board leaf or leaves below a plenum/cavity, with optional
absorber/fill and explicit support/coupling class. This is airborne
ceiling calculation, not floor impact lower-treatment calculation.

Target outputs to open:
`Rw`, `STC`, `C`, and `Ctr` on `element_lab`.

Formula route:
owned ceiling multileaf/plenum airborne formula corridor using explicit
leaf grouping, leaf surface mass, cavity/plenum depth, absorber
properties, and support/coupling class. The owner may use the existing
single-leaf mass-law banded corridor only as a leaf-level component, not
as a fallback answer for the whole plenum assembly.

Required physical inputs:
`ceilingLeafGrouping`, `ceilingLeafSurfaceMassKgM2`,
`ceilingCavityOrPlenumDepthMm`,
`ceilingAbsorberThicknessAndFlowResistivity`, and
`ceilingSupportCouplingOrHangerClass`.

`needs_input` behavior:
missing or incomplete formula inputs must keep the landed boundary
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`.

Unsupported boundaries that must remain blocked:

- field/building outputs until a separate adapter owns room and flanking
  context;
- floor-impact `Ln,w`, `DeltaLw`, `IIC`, and `AIIC`;
- opening/facade `OITC`;
- ASTM aliases;
- source-row proximity substitution;
- confidence fallback;
- scalar-only `Rw` to spectral companion fabrication.

Expected next-owner counters:
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 4`,
`requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 1`,
`runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 6`.

Selecting rerank counters:
`candidateCount: 7`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 4`,
`estimatedNextRequiredPhysicalInputsCaptured: 0`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 4`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Implementation Steps

1. Add the owner contract at
   `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts`.
2. Model one complete ceiling-only plenum airborne stack using the five
   required physical inputs and request `Rw`, `STC`, `C`, and `Ctr`.
3. Implement the bounded formula route only for that explicit family.
   Keep the existing input-boundary behavior for missing inputs.
4. Prove board-only ceiling single-leaf requests still use
   `ceiling.single_leaf_airborne_mass_law.source_absent` and do not
   inherit plenum assumptions.
5. Prove field/building, floor impact, OITC, ASTM/IIC/AIIC, source-row
   proximity, and confidence fallback remain outside this owner.
6. Wire the owner into `tools/dev/run-calculator-current-gate.ts` only
   after the focused owner contract passes and active docs are synced.

## Acceptance Criteria

- Complete explicit ceiling plenum airborne lab requests calculate
  `Rw`, `STC`, `C`, and `Ctr` through route `ceiling`.
- Missing physical inputs keep the prior `needs_input` boundary and do
  not publish partial values.
- The owner publishes no field/building, impact, OITC, or ASTM values.
- The route does not use nearby source rows, confidence labels, or a
  whole-assembly single-leaf fallback as the answer.
- The handoff records `runtimeValuesMoved 4` only after runtime values
  actually move.
