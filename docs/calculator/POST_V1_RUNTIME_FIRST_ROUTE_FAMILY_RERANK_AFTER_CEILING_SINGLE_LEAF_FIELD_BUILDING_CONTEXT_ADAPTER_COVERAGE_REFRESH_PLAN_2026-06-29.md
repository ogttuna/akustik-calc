# Post-V1 Runtime-First Route-Family Rerank After Ceiling Single-Leaf Field/Building Context Adapter Coverage Refresh - 2026-06-29

Status:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`

Planning status:
current selected implementation after
`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh`.

Landed status:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_input_boundary_owner`.

Selected next candidate:
`ceiling.multileaf_airborne_plenum_input_boundary_owner`.

Selected next action:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_plan`.

Selected next file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-owner-contract.test.ts`.

Selected next plan:
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_OWNER_PLAN_2026-06-29.md`.

Selected next label:
`post-V1 ceiling multileaf airborne plenum input-boundary owner`.

Rerank counters:
`candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 0`,
`estimatedNextCalculableTargetOutputs: 0`,
`estimatedNextRequiredPhysicalInputsCaptured: 5`,
`estimatedNextRuntimeBasisPromotions: 0`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedNextUnsupportedBoundariesProtected: 7`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Expected rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`

Expected rerank plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Precondition:
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`
exists, passes, and is wired into `tools/dev/run-calculator-current-gate.ts`.

Selected by landed coverage refresh:
`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-26.md`
/
`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh`.

Previous runtime owner:
`post_v1_ceiling_single_leaf_field_building_context_adapter_owner_plan`
/
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts`
/
`post_v1_ceiling_single_leaf_field_building_context_adapter_owner_landed_runtime_basis_selected_coverage_refresh`.

Previous rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_field_building_context_adapter_owner`.

Protected candidates and values:
`ceiling.single_leaf_field_building_context_adapter_owner`,
`ceiling.single_leaf_airborne_field_context_adapter`, and
`ceiling.single_leaf_airborne_building_prediction_adapter`; field
requests stay at `R'w 33`, `Dn,w 33`, `Dn,A 36.5`, `DnT,w 36`, and
`DnT,A 38.9`; building requests stay at `R'w 33`, `Dn,w 33`,
`Dn,A 36.5`, `DnT,w 36`, `DnT,A 38.9`, and `DnT,A,k 36`.
The coverage refresh counters were `coverageRefreshContractFilesTouched:
1`, `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`. Missing context, impact,
ASTM/IIC/AIIC, OITC, source-row fallback, and confidence-label fallback
remain blocked. This is not a broad source crawl.

Compact landed coverage ledger:
`coverageRefreshContractFilesTouched: 1`, `newCalculableLayerTemplates:
0`, `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`.

## Purpose

The rerank selects the next bounded calculator slice after the ceiling
single-leaf field/building adapter behavior is protected. It must prevent
two failure modes:

- drifting into another support loop without a blocker;
- jumping into a runtime owner whose physics, input surface, metric
  basis, or evidence boundary is not owned.

This rerank is itself no-runtime support. Its value is selecting the
next behavior-moving slice or recording the exact blocker that makes a
support step necessary.

## Rerank Result

Selected:
`ceiling.multileaf_airborne_plenum_input_boundary_owner`.

Reason:
the current ceiling route now calculates and adapts single-leaf
gypsum-board ceilings, but arbitrary user-entered ceiling assemblies
quickly become multileaf or suspended-plenum constructions. Direct
runtime is unsafe until the route owns leaf grouping, leaf surface mass,
cavity/plenum depth, absorber properties, and support/coupling class.
The selected input-boundary owner is therefore the highest-ROI next
calculator slice: it captures the physical inputs needed by the future
formula route and prevents wrong fallbacks into the single-leaf ceiling
route, floor suspended-ceiling impact route, OITC, ASTM aliases, source
proximity, or confidence-label behavior.

## Candidate Classes To Compare

### 1. Ceiling/Roof/Suspended-Ceiling Formula Expansion

Use when the next best move is to widen first-class ceiling calculation
beyond the current single-leaf gypsum-board lane.

Good owner shapes:

- suspended ceiling lower-treatment airborne owner with explicit cavity
  depth, hanger/resilient support class, board surface mass, and absorber
  flow resistivity;
- roof or ceiling/roof single-leaf route if layer roles and metric basis
  can be separated from floor impact routes;
- ceiling multi-leaf route only when leaf grouping, cavity, coupling,
  and absorber inputs are explicit.

Reject if:

- it would treat a floor lower-treatment stack as a ceiling route by
  name only;
- it would infer support topology, cavity depth, or absorber properties;
- it would open impact metrics without an impact owner.

### 2. Frequency-Band Or Companion-Metric Completeness

Use when an existing route owns or carries enough band data to expose
more derived metrics safely.

Good owner shapes:

- expose `C`, `Ctr`, `STC`, or `OITC` only from an owned spectrum and the
  correct rating adapter;
- make scalar-only routes explicitly block missing companions;
- align engine/API/workbench/report surfaces only after the engine owner
  is clear.

Reject if:

- it derives companions from `Rw` alone;
- it fabricates a curve to unlock a label;
- it carries lab spectral companions into field/building outputs without
  an owned adapter.

### 3. User-Material Physical Input Capture

Use when the route formula already exists or is blocked primarily by
missing user-provided physical inputs.

Good owner shapes:

- add one missing input surface for a selected route, such as leaf
  grouping, bridge class, support spacing, cavity depth, flow
  resistivity, dynamic stiffness, load basis, or surface mass;
- prove the route consumes the value or keeps `needs_input` when it is
  absent;
- keep material display names irrelevant when numeric physical inputs
  are identical.

Reject if:

- the new field is UI-only and no runtime/boundary logic consumes it;
- the route would silently default an unknown physical property;
- the slice tries to add a broad material catalog instead of one input
  needed by one owner.

### 4. Opening/Facade Outdoor-Indoor Or OITC Runtime Ownership

Use only when the route has the required spectrum, facade/opening
context, and output basis.

Good owner shapes:

- one outdoor-indoor facade or opening route with explicit area ratio,
  opening/leak data, exterior/facade context, and room normalization;
- `OITC` derived only through an owned outdoor-indoor spectral rating
  adapter;
- missing facade/opening context returns `needs_input`.

Reject if:

- it aliases `STC`, `Rw`, `NISR`, `ISR`, or indoor `DnT,w` into OITC;
- it reuses a generic opening row as door/window/facade support;
- it copies opaque-wall values through small openings without
  area/leakage math.

### 5. Calibration Or Holdout Packet For A Mature Route

Use when a route already calculates but its tolerance/error budget needs
source-owned same-family same-basis evidence.

Good owner shapes:

- small rights-safe evidence packet for exactly one formula family;
- separate exact rows, calibration rows, holdout rows, and benchmark-only
  rows;
- retune only if the selected owner is explicitly a retune/calibration
  slice.

Reject if:

- it becomes a broad source crawl;
- it uses source-absent formula values to validate themselves;
- it mixes lab, field, building, ISO, ASTM, or A-weighted bases.

## Rerank Selection Card

The rerank contract should write one selection card with these fields:

- selected candidate id;
- user construction or route family;
- target outputs to open or protect;
- formula, measured-row, anchor/delta, adapter, input-surface, or
  calibration route;
- route-required physical inputs;
- expected `needs_input` behavior;
- unsupported boundaries that must remain blocked;
- expected `newCalculableRequestShapes`;
- expected `newCalculableTargetOutputs`;
- expected `requiredPhysicalInputsCaptured`;
- expected `runtimeBasisPromotions`;
- expected `runtimeValuesMoved`;
- explicit reason rejected for the next-best alternatives.

## Rerank Acceptance Criteria

The rerank must:

- compare current implementation evidence, not stale historical
  selected-next prose;
- avoid reselecting already-landed owners unless the new slice clearly
  opens new scope, accuracy, input capture, or boundary protection;
- select exactly one next owner or one blocker-removal support slice;
- move no runtime values;
- retune no formula;
- import no source rows;
- touch no frontend files;
- name the follow-up selected action, file, plan, and label;
- pass `git diff --check`.

Expected rerank counters:

- `candidateCount`: count the concrete candidates compared;
- `roiAnalysisIterations`: at least `2`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`;
- estimated next counters for the selected follow-up slice.

## Stop Conditions

If no behavior-moving owner is safe, the rerank should stop with the
first concrete blocker and select the smallest support step that removes
it. Valid blockers:

- missing route-owned spectrum;
- missing route-required input surface;
- missing same-family same-basis holdout evidence;
- required lab-to-field or lab-to-building copy would be unsafe;
- required ISO/ASTM alias would be unsafe;
- candidate would reopen an already-landed owner without real movement;
- current implementation state is unclear enough that a narrow
  validation/support slice is needed first.

This stop record is acceptable only if it names the exact unblocker and
keeps the support slice bounded.
