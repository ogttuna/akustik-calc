# Calculator Opening Sequence Drift Lock - 2026-06-29

Status:
`calculator_opening_sequence_drift_lock_2026_06_29`

Purpose:
keep DynEcho moving toward an industry-grade acoustic calculator without
drifting into broad source crawling, confidence-label work, library
building, cosmetic UI passes, or support loops that do not protect or
unlock calculator behavior.

This document does not replace the active selected implementation plan.
It constrains what the next reranks and owners should select unless a
newer source-of-truth document records a deliberate change.

Current selected implementation:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan`
/
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`
/
`docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md`
/
`post-V1 opening/facade outdoor-indoor OITC spectral rating owner`.

Latest landed no-runtime rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_opening_facade_outdoor_indoor_oitc_spectral_rating_owner`.
It follows
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh`
and selects candidate
`opening.facade_outdoor_indoor_oitc_spectral_rating_owner`. It rejects
already-landed ASTM `IIC` / `AIIC` exact-band work, source-absent ASTM
estimation, ceiling boundary repeats, calibration without same-basis
evidence, and support drift. Counters: `candidateCount: 8`,
`roiAnalysisIterations: 4`, `estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 1`,
`estimatedNextRequiredPhysicalInputsCaptured: 4`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 1`,
`estimatedNextUnsupportedBoundariesProtected: 7`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl. Selected next:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan`
/
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`
/
`docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md`
/
`post-V1 opening/facade outdoor-indoor OITC spectral rating owner`.

Latest landed no-runtime coverage refresh:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh`.
It follows
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_landed_input_boundary_selected_coverage_refresh`
and re-probes selected candidate
`ceiling.roof_suspended_ceiling_route_split_boundary_owner`. Ambiguous
roof/ceiling/suspended-ceiling plenum stacks remain on
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_missing_route_context`;
explicit roof/facade, ceiling-airborne impact, and lower-treatment
airborne aliases remain on
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_unsupported_route_family`;
explicit ceiling-airborne plenum field/building values remain pinned at
`R'w 47`, `Dn,w 44.9`, `Dn,A 43.2`, `DnT,w 45.7`,
`DnT,A 44`, and `DnT,A,k 41.1`. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`. This is not a broad source crawl.
Selected next:
`post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post-V1 runtime-first route-family rerank after ceiling roof/suspended-ceiling route split boundary coverage refresh`.

Latest landed input-boundary owner:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_plan`
/
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_OWNER_PLAN_2026-06-29.md`
/
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_landed_input_boundary_selected_coverage_refresh`.
It follows the landed runtime-first rerank after the ceiling multileaf
airborne plenum field/building adapter coverage refresh and uses
selected candidate
`ceiling.roof_suspended_ceiling_route_split_boundary_owner`.
Ambiguous roof/ceiling/suspended-ceiling plenum stacks now return
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_missing_route_context`
with `airborneContext.routeIntent`,
`airborneContext.roofOrCeilingMountingContext`,
`airborneContext.suspendedCeilingAirborneOrImpactIntent`, and
`airborneContext.hangerOrSupportCouplingClass` as required inputs.
Explicit roof/facade, ceiling-airborne impact, and lower-treatment
airborne aliases return
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_unsupported_route_family`.
Explicit ceiling-airborne plenum route context keeps `R'w 47`,
`Dn,w 44.9`, `Dn,A 43.2`, `DnT,w 45.7`, `DnT,A 44`, and
`DnT,A,k 41.1` pinned. Counters: `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `requiredPhysicalInputsCaptured: 4`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 8`. This is not a broad source crawl.
Selected next:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post-V1 ceiling roof/suspended-ceiling route split boundary coverage refresh`.

Latest landed no-runtime rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_ceiling_roof_suspended_ceiling_route_split_boundary_owner`.
It follows
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh`
and previous owner
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_plan`
/
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_landed_runtime_basis_selected_coverage_refresh`.
It keeps candidates
`ceiling.multileaf_airborne_plenum_field_building_adapter_owner`,
`ceiling.multileaf_airborne_plenum_field_context_adapter`, and
`ceiling.multileaf_airborne_plenum_building_prediction_adapter`
protected, selects candidate
`ceiling.roof_suspended_ceiling_route_split_boundary_owner`, and selects
next
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_plan`
/
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_OWNER_PLAN_2026-06-29.md`
/
`post-V1 ceiling roof/suspended-ceiling route split boundary owner`.
Counters: `candidateCount: 7`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 0`,
`estimatedNextCalculableTargetOutputs: 0`,
`estimatedNextRequiredPhysicalInputsCaptured: 4`,
`estimatedNextRuntimeBasisPromotions: 0`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedNextUnsupportedBoundariesProtected: 8`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Latest landed no-runtime coverage refresh:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh`.
It re-probes runtime resolver candidates
`ceiling.multileaf_airborne_plenum_field_context_adapter` and
`ceiling.multileaf_airborne_plenum_building_prediction_adapter`,
keeps `R'w 47`, `Dn,w 44.9`, `Dn,A 43.2`, `DnT,w 45.7`,
`DnT,A 44`, and `DnT,A,k 41.1` pinned, and keeps missing
room/flanking context, lab aliasing, impact, `IIC`/`AIIC`, `OITC`,
ASTM aliases, source-row proximity substitution, and confidence fallback
blocked. Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`. This is not a broad source crawl.
Selected next:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`.

Latest landed runtime owner:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_landed_runtime_basis_selected_coverage_refresh`.
It uses selected owner candidate
`ceiling.multileaf_airborne_plenum_field_building_adapter_owner`
with runtime resolver candidates
`ceiling.multileaf_airborne_plenum_field_context_adapter` and
`ceiling.multileaf_airborne_plenum_building_prediction_adapter`.
Complete field requests publish `R'w 47`, `Dn,w 44.9`, `Dn,A 43.2`,
`DnT,w 45.7`, and `DnT,A 44`; complete building requests also publish
`DnT,A,k 41.1`. Counters: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 6`, `requiredPhysicalInputsCaptured: 4`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 11`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 6`. This is not a broad source crawl.
Selected next:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`.

Latest landed no-runtime rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_field_building_adapter_owner`.
It follows previous coverage
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`
/
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh`
and previous owner
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_plan`
/
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_landed_runtime_basis_selected_coverage_refresh`.
It keeps method
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner`
and candidate
`ceiling.multileaf_airborne_plenum_element_lab_formula_owner`
protected at `Rw 48`, `STC 48`, `C -1.7`, and `Ctr -6.5`, selects
candidate `ceiling.multileaf_airborne_plenum_field_building_adapter_owner`,
and selects next
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-29.md`
/
`post-V1 ceiling multileaf airborne plenum field/building adapter owner`.
Counters: `candidateCount: 7`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextCalculableTargetOutputs: 6`,
`estimatedNextRequiredPhysicalInputsCaptured: 4`,
`estimatedNextRuntimeBasisPromotions: 2`,
`estimatedNextRuntimeValuesMoved: 11`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Latest landed no-runtime coverage refresh:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh`.
It re-probes selected candidate
`ceiling.multileaf_airborne_plenum_element_lab_formula_owner`, keeps
`Rw 48`, `STC 48`, `C -1.7`, and `Ctr -6.5` pinned, keeps incomplete
plenum inputs on
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`,
and blocks field/building, impact, `IIC`/`AIIC`, `OITC`, ASTM aliases,
source-row proximity substitution, and confidence fallback. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`. This is not a broad source crawl.
Selected next:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`.

Latest landed no-runtime rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_element_lab_formula_owner`.
It follows previous coverage
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`
/
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh`
and previous owner
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_plan`
/
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`.
It keeps method
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`
protected, selects candidate
`ceiling.multileaf_airborne_plenum_element_lab_formula_owner`, and
selects next
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_PLAN_2026-06-29.md`
/
`post-V1 ceiling multileaf airborne plenum element-lab formula owner`.
Counters: `candidateCount: 7`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 4`,
`estimatedNextRequiredPhysicalInputsCaptured: 0`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 4`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Non-Negotiable Answer Order

Every calculator slice must preserve this order:

1. Use an exact measured/source row only when construction identity,
   metric, standard/basis, and context truly match.
2. Use a same-family, same-basis anchor or bounded delta only when the
   construction boundary and delta rule are owned.
3. Otherwise calculate through the best owned physics/formula route and
   capture route-required physical inputs.
4. If the route is not physically owned, return precise `needs_input`
   or `unsupported` instead of guessing, aliasing, or substituting a
   nearby source-family value.

## Iteration Rhythm

Use this cadence unless the user explicitly asks for a different support
slice:

1. runtime, accuracy, input-surface, or boundary owner;
2. focused coverage refresh for that owner;
3. runtime-first rerank that selects the next bounded owner;
4. next owner.

Support-only work is valid only when it has an exit condition and names
the calculator behavior it protects or unlocks. Do not chain support
work after a support-only refresh/rerank unless there is a concrete
blocker or a user request.

## Opening Sequence

### 0. Landed Rerank

Landed:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`.

Outcome:
selected the ceiling multileaf/plenum element-lab formula owner as the
next bounded behavior-moving owner.

No runtime values move in the rerank itself.

### 1. Ceiling Multileaf/Plenum Element-Lab Formula Owner

Open:
ceiling-only board plus plenum/cavity/fill airborne stacks that are not
single-leaf.

Target outputs:
`Rw`, `STC`, `C`, and `Ctr`.

Required physical inputs:
`ceilingLeafGrouping`, `ceilingLeafSurfaceMassKgM2`,
`ceilingCavityOrPlenumDepthMm`,
`ceilingAbsorberThicknessAndFlowResistivity`, and
`ceilingSupportCouplingOrHangerClass`.

Expected behavior:
calculate only when the selected formula route owns those inputs. Keep
the landed
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`
boundary when inputs are missing.

Blocked boundaries:
field/building copies, floor impact fallback, OITC, ASTM/IIC/AIIC
aliases, source-row proximity, and confidence fallback.

### 2. Ceiling Multileaf/Plenum Formula Coverage Refresh

Open:
no new runtime values.

Purpose:
pin the new element-lab route and prove it does not regress into
single-leaf mass-law, floor suspended-ceiling impact, source-row
proximity, or confidence fallback.

Expected counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

### 3. Ceiling Multileaf/Plenum Field and Building Adapter

Open:
field and building metrics for the same ceiling multileaf/plenum family
after the element-lab route exists.

Target outputs:
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, and, when the building basis
owns it, `DnT,A,k`.

Required context:
element area, receiving-room volume, reverberation/RT60 or
normalization basis, source-room context where needed, flanking or
junction context, and route-specific mounting/coupling context.

Blocked boundaries:
copying lab `Rw` into field/building outputs, scalar lab aliases, impact
aliases, OITC aliases, and missing room/flanking defaults that are not
explicitly surfaced.

### 4. Ceiling/Roof/Suspended-Ceiling Route Split and Input Boundaries

Open:
only the narrow route/input boundaries needed to stop common user stacks
from entering the wrong family.

Good owner shapes:
roof-vs-ceiling split, hanger/coupling class boundary, absorber-property
boundary, and suspended-ceiling airborne-vs-impact route separation.

Blocked boundaries:
route promotion by name only, floor impact values from ceiling airborne
stacks, and roof/facade promotion without route-owned context.

### 5. Floor Impact IIC/AIIC Rating Ownership

Open:
`IIC` and `AIIC` only when an exact source or owned rating curve/procedure
exists.

Current state:
the exact-band ASTM owner and input surface are already landed in the
current source-of-truth. Lab `ASTM E492 / ASTM E989` exact
one-third-octave bands calculate owned `IIC`; field `ASTM E1007 / ASTM
E989` exact bands calculate owned `AIIC`. Do not re-select those closed
owners unless a future slice names a new ASTM rating behavior that is
not already covered.

Prerequisites:
impact spectrum or rating curve, standard/basis ownership, field/lab
context separation, and explicit exact-source precedence.

Blocked boundaries:
blind ISO-to-ASTM aliasing, deriving `IIC`/`AIIC` from `Ln,w` or
`DeltaLw` alone, and copying field values into lab ratings.

### 6. Opening/Facade Outdoor-Indoor Spectral OITC Owner

Open:
`OITC` for outdoor-indoor opening/facade requests only through an owned
spectral rating adapter.

Prerequisites:
outdoor-indoor spectrum, opening/facade context, area/leakage math, and
room normalization where the requested basis requires it.

Blocked boundaries:
aliasing `STC`, `Rw`, `NISR`, `ISR`, or indoor `DnT,w` into `OITC`.

### 7. Accuracy and Calibration Pass

Open:
numeric accuracy improvements for mature routes rather than new metric
surface.

Good owner shapes:
same-family same-basis holdout packets, formula retunes with bounded
evidence, route-specific error budgets, and benchmark matrices that
measure calculation accuracy.

Blocked boundaries:
broad catalog crawling, using nearby rows as generic aliases, and
confidence-label polish without numeric behavior movement.

## Industry-Grade Milestones

### Strong Internal Calculator

Reached when common wall, floor, ceiling, and opening stacks return a
correct owned calculation, precise `needs_input`, or precise
`unsupported` boundary on the requested basis.

### Market-Comparable Calculator

Reached when the main route families have lab, field, and building
basis separation, companion metrics are derived from owned spectra or
adapters, and high-frequency user stacks are covered by formula routes
or exact measured rows.

### Best-In-Class Contender

Reached when mature routes carry benchmarked error budgets, same-family
holdout validation, calibrated formula corridors, and clear assumption
provenance while still refusing unowned metric aliases.

## Explicit No-Go Work

Do not select these unless the user explicitly asks for them and the
scope is separate from calculator progress:

- broad source crawling for all layer combinations;
- turning the project into a passive acoustic source library;
- confidence-label or copy-only work that does not move calculator
  scope, accuracy, input capture, or boundaries;
- cosmetic UI polish without a route-input or basis-integrity blocker;
- metric aliases such as lab-to-field copies, ISO-to-ASTM impact
  substitutions, or scalar `Rw` to spectral companion fabrication;
- re-landing already landed owners without new behavior, accuracy,
  input capture, or boundary protection.

## Handoff Rule

Every final handoff after calculator work must report:

- calculator behavior opened;
- new calculable request shapes;
- new calculable target outputs;
- required physical inputs captured;
- runtime/formula values moved;
- support work done;
- if no runtime/accuracy behavior moved, why stopping there was
  necessary.
