# Post-V1 Runtime-First Route-Family Rerank After Ceiling Multileaf Airborne Plenum Input-Boundary Coverage Refresh - 2026-06-29

Status:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_element_lab_formula_owner`

Action:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`

Planning status:
landed no-runtime rerank after
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh`.

Expected rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`

Expected rerank plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected candidate:
`ceiling.multileaf_airborne_plenum_element_lab_formula_owner`.

Selected next action:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_plan`.

Selected next file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts`.

Selected next plan:
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_PLAN_2026-06-29.md`.

Selected next label:
`post-V1 ceiling multileaf airborne plenum element-lab formula owner`.

Selected by landed coverage refresh:
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

Previous rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_input_boundary_owner`.

Protected candidate and method:
`ceiling.multileaf_airborne_plenum_input_boundary_owner` /
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`.

Protected required inputs:
`ceilingLeafGrouping`, `ceilingLeafSurfaceMassKgM2`,
`ceilingCavityOrPlenumDepthMm`,
`ceilingAbsorberThicknessAndFlowResistivity`, and
`ceilingSupportCouplingOrHangerClass`.

Protected coverage counters:
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

Rerank counters:
`candidateCount: 7`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 4`,
`estimatedNextRequiredPhysicalInputsCaptured: 0`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 4`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Purpose

This rerank is the exit step after the no-runtime coverage refresh. It
must choose the next highest-ROI calculator slice without turning the
fresh ceiling plenum boundary into another support loop. The expected
outcome is either a behavior-moving runtime, accuracy, input-surface, or
boundary owner, or a precise blocker if no safe owner can move.

## Selection Rules

Keep the calculator answer order:

1. exact measured/source rows only on exact construction and basis;
2. same-family anchors or bounded deltas only with an owned boundary;
3. otherwise owned formula routes with route-required physical inputs;
4. `needs_input` or `unsupported` when physics is not owned.

Reject broad source crawling, confidence-label work, cosmetic UI work,
metric aliasing, lab-to-field copying, and re-landing already landed
owners unless the candidate adds real calculator scope, accuracy,
required input capture, or boundary protection.

## Candidate Classes To Compare

### 1. Ceiling Multileaf/Plenum Formula Owner

Use if the now-captured inputs are enough to open a defensible
element-lab airborne route for a ceiling board plus plenum/cavity/fill
assembly.

Expected selection card if chosen:

- user construction / formula family: ceiling-only multileaf or
  suspended-plenum airborne stack;
- target outputs to open: `Rw`, `STC`, `C`, and `Ctr` first;
- route: owned ceiling airborne formula, not floor impact;
- required inputs: leaf grouping, leaf surface mass, cavity/plenum
  depth, absorber properties, and support/coupling class;
- missing input behavior: keep the landed `needs_input` boundary;
- unsupported boundaries: field/building, impact, OITC, ASTM/IIC/AIIC,
  source-row proximity, and confidence fallback.

Reject if formula selection would guess coupling, flow resistivity,
mass per leaf, cavity depth, or spectrum/rating companions.

### 2. Ceiling Multileaf Field/Building Adapter

Use only after an element-lab ceiling multileaf route exists. It may
consume explicit room and flanking context, but must not copy lab values
into `R'w`, `Dn,w`, `DnT,w`, or `DnT,A`.

Reject for this rerank if the lab route is still only `needs_input`.

### 3. Adjacent Ceiling/Roof Input Boundary

Use when a common user-entered family is still falling into the wrong
route and a narrow `needs_input`/`unsupported` owner would prevent
misleading values while enabling the later formula owner.

Good examples: explicit roof-vs-ceiling route split, hanger/coupling
class boundary, or absorber-property boundary for a specific selected
route.

### 4. Mature Route Accuracy Or Companion Completion

Use when an already owned route can safely improve numeric fidelity or
derived outputs with the correct basis.

Good examples: same-family holdout calibration, owned spectral
`C`/`Ctr`/`STC` completion, or a missing companion block that prevents
scalar aliases.

Reject if it derives companions from `Rw` alone or expands a source
catalog instead of improving a selected formula route.

## Acceptance Criteria

- The rerank contract compares at least four candidate classes and
  records why the selected candidate is highest ROI.
- It must keep
  `post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`
  and the five required physical inputs protected.
- It must not move runtime values itself:
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- It must select a next plan and file only when the selected candidate
  is bounded enough to implement without guessing.
- If no safe runtime/accuracy/input-boundary owner can move, the rerank
  must stop with the concrete blocker instead of selecting a weak slice.
