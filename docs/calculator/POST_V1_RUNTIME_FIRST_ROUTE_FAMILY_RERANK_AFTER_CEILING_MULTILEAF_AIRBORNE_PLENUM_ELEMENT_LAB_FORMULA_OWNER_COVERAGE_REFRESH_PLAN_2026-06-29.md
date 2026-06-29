# Post-V1 Runtime-First Route-Family Rerank After Ceiling Multileaf Airborne Plenum Element-Lab Formula Owner Coverage Refresh - 2026-06-29

Status:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_field_building_adapter_owner`

Action:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`

Planning status:
landed no-runtime rerank after
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh`.

Expected rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`

Expected rerank plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected candidate:
`ceiling.multileaf_airborne_plenum_field_building_adapter_owner`.

Selected next action:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_plan`.

Selected next file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts`.

Selected next plan:
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-29.md`.

Selected next label:
`post-V1 ceiling multileaf airborne plenum field/building adapter owner`.

Selected by landed coverage refresh:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh`.

Previous owner:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_landed_runtime_basis_selected_coverage_refresh`.

Previous rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_element_lab_formula_owner`.

Protected owner candidate:
`ceiling.multileaf_airborne_plenum_element_lab_formula_owner`.

Protected runtime method:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner`.

Protected values:
`Rw 48`, `STC 48`, `C -1.7`, and `Ctr -6.5`.

Protected required inputs:
`airborneContext.ceilingPlenum.leafGrouping`,
`airborneContext.ceilingPlenum.leafSurfaceMassKgM2`,
`airborneContext.ceilingPlenum.cavityOrPlenumDepthMm`,
`airborneContext.ceilingPlenum.absorberThicknessMm`,
`airborneContext.ceilingPlenum.absorberFlowResistivityPaSM2`, and
`airborneContext.ceilingPlenum.supportCouplingOrHangerClass`.

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
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextCalculableTargetOutputs: 6`,
`estimatedNextRequiredPhysicalInputsCaptured: 4`,
`estimatedNextRuntimeBasisPromotions: 2`,
`estimatedNextRuntimeValuesMoved: 11`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

This rerank selects the field/building adapter owner because the
element-lab plenum formula route is now owned and protected. It rejects
route-split cleanup until after the field/building adapter, rejects
calibration without same-family same-basis holdout evidence, and keeps
`IIC`/`AIIC`, `OITC`, broad source crawling, confidence labels, and
frontend polish out of this slice.

## Purpose

This rerank is the exit step after the no-runtime coverage refresh. It
must choose the next highest-ROI calculator slice without turning the
fresh ceiling plenum formula owner into a support loop. The expected
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

### 1. Ceiling Multileaf/Plenum Field and Building Adapter

Use if the just-landed element-lab route can be adapted through explicit
room normalization and flanking context without copying lab `Rw` into
field/building outputs.

Expected selection card if chosen:

- user construction / formula family: ceiling-only multileaf or
  suspended-plenum airborne stack with explicit `ceilingPlenum` context;
- target outputs to open: `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, and
  when basis-owned, `DnT,A,k`;
- route: owned ceiling field/building adapter using the plenum lab
  formula as a hidden anchor plus explicit field/building context;
- required context: element area, receiving room volume, RT60 or
  normalization basis, junction/flanking context, and route-specific
  mounting/coupling context;
- missing input behavior: return `needs_input` for absent field/building
  context;
- unsupported boundaries: impact, `IIC`/`AIIC`, OITC, ASTM aliases,
  scalar lab copying, source-row proximity, and confidence fallback.

Reject if the adapter would reuse `Rw 48` directly as `R'w`, `Dn,w`, or
`DnT,w`, or if it cannot name the missing room/flanking inputs.

### 2. Ceiling/Roof/Suspended-Ceiling Route Split and Input Boundaries

Use if common user-entered ceiling, roof, or suspended-ceiling stacks are
still falling into the wrong family and a narrow `needs_input` or
`unsupported` boundary would prevent misleading values.

Good examples: roof-vs-ceiling split, airborne-vs-impact separation,
hanger/coupling context boundary, or absorber-property boundary.

Reject if the route is chosen by name only or if floor impact values are
promoted for airborne ceiling stacks.

### 3. Ceiling Multileaf/Plenum Formula Accuracy Calibration

Use when same-family admissible evidence can tighten the just-landed
formula corridor without broad source crawling.

Good examples: bounded holdout comparison for the exact plenum family,
or a spectral-shape correction for `C`/`Ctr` that remains tied to the
same route and basis.

Reject if it imports unrelated source rows, tunes against a different
construction family, or treats confidence labels as a substitute for
physics.

### 4. Mature Adjacent Metric Ownership

Use when a high-value adjacent metric can be opened on its correct
basis with existing route-owned context.

Good examples: floor `IIC`/`AIIC` rating ownership after impact route
inputs are explicit, or opening/facade `OITC` spectral adapter after the
outdoor-indoor spectral basis is owned.

Reject if the work aliases `STC`, `Rw`, `Ln,w`, or indoor `DnT,w` to
the adjacent metric.

## Acceptance Criteria

- The rerank contract compares at least four candidate classes and
  records why the selected candidate is highest ROI.
- It must keep
  `post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner`
  and `ceiling.multileaf_airborne_plenum_element_lab_formula_owner`
  protected.
- It must keep the complete fixture pinned at `Rw 48`, `STC 48`,
  `C -1.7`, and `Ctr -6.5`.
- It must not move runtime values itself:
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- It must select a next plan and file only when the selected candidate
  is bounded enough to implement without guessing.
- If no safe runtime/accuracy/input-boundary owner can move, the rerank
  must stop with the concrete blocker instead of selecting a weak slice.
