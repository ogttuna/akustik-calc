# Calculation Model And Validation

Last reviewed: 2026-06-01

Document role:

- explain where each calculator answer comes from
- separate formula-backed, source-backed, predictor-backed, bound-only, and
  unsupported outputs
- define how tests prove that a shown answer is defensible
- give future agents a fast map before changing solver, selector, or card logic

Read this before selecting a new widening slice. A green test can only prove the
answer it actually measures; it does not make the whole acoustic domain complete.
Read [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
first for product goal and next-slice selection. This file explains how
to validate a selected calculator answer once the slice is chosen.

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-30_POST_V1_GATE_BF_STATE_RECONCILIATION.md`

Latest landed implementation checkpoint:

`docs/calculator/CHECKPOINT_2026-05-30_POST_V1_GATE_BF_STATE_RECONCILIATION.md`

Current validation posture:

The acoustic calculator answer-engine V1 correction is landed for the
current company-internal usable V1 envelope. The engine must choose and
publish the calculator answer for a user-entered wall/floor layer stack:
exact measured answer when the construction truly matches, compatible
measured anchor when physically valid, otherwise the right family
formula. Missing physical inputs must be requested because the selected
formula or basis needs them, not because the project is a test harness.
Diagnostic curves are allowed internally, but they must not surface as
the user answer when the selected path is `needs_input` or
`unsupported`.

The current gate keeps the answer-engine contract included in
`pnpm calculator:gate:current`. The shared resolver surface currently
has 40 declared candidates and 37 active runtime-basis mappings.

The selected post-V1 plan is
[POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md).
Gate BF is the latest landed runtime coverage slice:
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`.
Assembly field-only lower-treatment now calculates owned field adapter
outputs from the same source-absent lab anchor. Gate BF selected
`post_v1_next_numeric_coverage_gap_gate_bg_plan`.
The active Gate BG plan is
[POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md](./POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md).
Gate BG has landed as `post_v1_next_numeric_coverage_gap_gate_bg_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_bg_landed_no_runtime_selected_floor_mixed_support_family_owner_boundary_gate_bh`;
it selected `floor.mixed_support_family.multi_family_solver_gap` and
`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan` in
`packages/engine/src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh-contract.test.ts`.
Gate BH has landed as
`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan` with
status
`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_landed_no_runtime_selected_floor_mixed_support_family_runtime_corridor_gate_bi`.
It pins `primaryCarrierFamily`, `dominantImpactTransferFamily`,
`mixedSupportRolePartition`, `secondarySupportTreatmentOwner`, and
`duplicateOwnershipGuard` as no-default owner fields and selects
`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan` in
`packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts`.

Gate BG and every later gate must be selected by calculator ROI:
increase calculable layer-combination scope, improve numeric
correctness/calibration, or tighten a boundary that protects correct
calculation. Validation for the next gate must prove any new answer
appears consistently across workbench cards, traces, API payloads,
reports, and missing-input prompts without aliasing lab, field,
building, ISO impact, or ASTM metrics.

## Core Rule

There is no single formula that owns every output, and there is no
single source catalog that replaces calculation.

`calculateAssembly` builds multiple candidate lanes, then support gating decides
which requested outputs are allowed to surface. A visible `Rw`, `Ln,w`, `R'w`,
or `DnT,w` can therefore come from different origins depending on the active
route.

Calculator-first rule:

- exact measured/source rows win when the full assembly matches them;
- exact measured/source rows can anchor subassembly-plus-delta
  candidates;
- similar measured rows can calibrate, bound, or anchor a delta only
  through a named algorithm and basis-compatible tolerance policy;
- when no exact row exists, the calculator must use the best
  family-specific physics model available and label the result as a
  prediction;
- missing source packets block measured-exact/source-validated
  promotion, not formula-backed calculation;
- source/lab rows are used for exact override, calibration, benchmark
  validation, tolerance ownership, and regression tests.
- narrow residual-policy work must not continue indefinitely when the
  broader calculator lacks an executable personal-use coverage matrix;
  after Gate BI, select solver work from common wall/floor matrix
  failures by coverage ROI and accuracy risk.

The implementation is correct only when all of these are true:

- the numeric value is produced by the right origin for that route
- the origin is source/formula/predictor/bound/unsupported as documented
- the selected output basis is correct: lab element, field/apparent, or
  building prediction
- `Rw`, `STC`, `Ln,w`, `IIC`, `R'w`, and `DnT,w` are not aliases unless a
  named adapter/source explicitly owns that relationship
- unsupported outputs stay explicit instead of being guessed
- workbench cards show the same support posture as the engine
- split, duplicated, reordered, or saved/replayed input does not silently switch
  to a broader lane

## Dynamic Calculator Validation Contract

Personal-use readiness requires tests that prove acoustic correctness,
not only that code paths run.

Every runtime-moving calculator change should add or update tests for:

- numeric expectation: exact value for exact/source rows, or a documented
  range/tolerance for physics predictions;
- curve integrity: frequency-band changes make sense, not only final
  integer ratings;
- rating adapter basis: ISO 717 / ASTM E413 / impact adapters are used
  explicitly and not copied;
- candidate selection: selected and rejected candidates explain exact
  source, anchored delta, calibrated solver, uncalibrated solver, bound,
  screening, `needs_input`, and `unsupported` decisions;
- missing-input posture: missing physical fields produce targeted prompts,
  while missing source evidence does not;
- hostile input: long layer lists, duplicate layers, split roles, extreme
  thickness, tiny gaps, unsafe reorder, saved replay, and manual report
  edits;
- visible parity: engine result, workbench cards, saved scenarios, PDF,
  and DOCX agree on value, basis, support bucket, assumptions, and
  uncertainty.

Current model-first helper contracts:

- Gate K:
  `packages/engine/src/dynamic-calculator-route-input-topology.ts`
  assesses wall/floor route, output basis, missing physical inputs,
  source absence, and unsupported outputs without moving runtime values.
- Gate L:
  `packages/engine/src/dynamic-calculator-topology-normalizer.ts`
  guards layer input before candidate selection. Role-defined floor
  reorder/split edits can normalize when physically invariant; grouped
  multi-cavity wall order is preserved; ambiguous flat-list multi-cavity
  stacks ask for topology instead of being auto-grouped; invalid or
  excessive layer input fails closed.
- Gate M:
  `packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`
  populates the runtime candidate resolver surface. Exact source,
  anchored delta, calibrated family, family physics, bounded, screening,
  `needs_input`, and `unsupported` candidates coexist with selected and
  rejected reasons; numeric values and support buckets stay unchanged.
- Gate N:
  `packages/engine/src/dynamic-calculator-family-solver-upgrade-selection.ts`
  selects the first family solver runtime upgrade without moving
  values. The selected Gate O target is single-leaf / laminated
  single-leaf / rigid massive panel because the family candidate is
  already visible but still screening-selected, material readiness is
  complete, and exact/source rows are not required for source-absent
  physics. Double/framed, generalized multi-cavity, lined masonry/CLT,
  floor impact, and field/building continuations remain deferred behind
  explicit physical owners.
- Gate O:
  `packages/engine/src/dynamic-airborne-gate-o-single-leaf.ts`
  promotes complete single-leaf / laminated single-leaf / rigid massive
  panel Dynamic Calculator results to `family_physics_prediction`
  without changing numeric values or target-output support. Exact
  full-stack rows remain higher precedence, Gate G grouped Rockwool
  remains unchanged, and CLT/mass timber stays screening until
  orthotropic/directional properties are owned. Selection status:
  `gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p`.
- Gate P:
  `packages/engine/src/dynamic-calculator-next-family-solver-upgrade-selection.ts`
  selects the next Dynamic Calculator family after Gate O without moving
  runtime values. It excludes the already-landed single-leaf family and
  selects double-leaf / framed bridge for Gate Q because it unlocks
  common wall calculator coverage through source-absent physics, while
  explicitly blocking runtime promotion until `frameBridgeClass`,
  `studSpacingMm`, `resilientSideCount`, `supportTopology`, porous
  cavity damping, and mass-air-mass resonance owners have positive and
  nearby-negative benchmarks. Selection status:
  `gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q`.
  Next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`.
  Next action:
  `gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`.
- Gate Q:
  `packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-input-contract.ts`
  defines the explicit double-leaf / framed bridge input and benchmark
  contract. `wallTopology.topologyMode: "double_leaf_framed"` now lets
  the route-input assessment ask for side leaf groups, cavity depth,
  frame bridge class, support topology, support spacing, and conditional
  resilient-bar side count before any solver promotion. Source absence
  stays exact/calibration-only; runtime values and support buckets stay
  unchanged. Selection status:
  `gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r`.
  Next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`.
  Next action:
  `gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`.
- Gate R:
  `packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts`
  defines the no-runtime double-leaf / framed bridge solver-candidate
  contract. It owns explicit side-leaf surface masses, mass-air-mass
  resonance, bridge coupling, porous damping, ISO 717-1 `Rw`, and ASTM
  E413 `STC` adapter boundaries before runtime promotion. Positive
  benchmark corridors cover independent absorbed and resilient bridge
  cases; nearby negatives cover missing resilient side count,
  direct-fixed bridges, and non-explicit multi-cavity flat lists.
  Selection status:
  `gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s`.
  Next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts`.
  Next action:
  `gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator`.
- Gate S:
  `packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts`
  promotes the double-leaf / framed bridge solver into Dynamic
  Calculator runtime for complete explicit contexts. Independent
  absorbed gypsum / rockwool / gypsum pins `Rw 45`, `STC 45`, `C -1`,
  `Ctr -6.1`, origin `family_physics_prediction`, and `errorBudgetDb:
  7`; resilient both-side bridge pins `Rw 46` / `STC 46` with
  `errorBudgetDb: 8`. Exact source rows remain higher precedence,
  missing `resilientBarSideCount` remains `needs_input`, and direct
  fixed / multi-cavity flat-list negative boundaries do not promote.
  Selection status:
  `gate_s_double_leaf_framed_bridge_runtime_landed_selected_family_material_gap_gate_t`.
  Next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts`.
  Next action:
  `gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator`.
- Gate T:
  `packages/engine/src/airborne-family-material-gap-closure.ts`
  closes high-impact material-property gaps for Dynamic Calculator
  family physics without replacing calculation with a finite source
  catalog. `absorberClass` is now part of shared acoustic material
  metadata, and the seed catalog has engineering-default acoustic
  properties for board leaves/finishes, masonry cores, porous
  absorbers, floor decks/screeds, limp membranes, and resilient impact
  layers. Required gaps stay `needs_input`; optional precision gaps
  widen uncertainty through explicit defaults; runtime values and
  support buckets stay unchanged. Selection status:
  `gate_t_family_material_property_gap_closure_landed_no_runtime_selected_next_solver_or_calibration_gate_u`.
  Next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`.
  Next action:
  `gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`.
- Gate U:
  `packages/engine/src/dynamic-calculator-next-solver-or-calibration-selection.ts`
  selects the next solver/calibration lane after Gate T material gap
  closure without moving runtime values. It ranks floor-impact dynamic
  stiffness, field/building continuation, generalized multi-cavity,
  lined masonry/CLT, and calibration holdout lanes, then selects floor
  impact for Gate V because it is the largest remaining personal-use
  floor coverage gap with complete material readiness. Calibration
  holdouts stay later error-budget tightening work; source rows still do
  not replace the algorithm. Selection status:
  `gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`.
  Next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`.
  Next action:
  `gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`.
- Post-Gate-U revalidation:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_REVALIDATION_AND_COMMIT_HANDOFF.md`
  confirms the current gate and broad `pnpm check` are green after
  fixing proposal-surface regressions. The validation result reinforces
  the same modeling boundary: Gate V should contract floor-impact
  dynamic stiffness, load basis, ISO 717-2 lab impact adapters, field
  impact context, and ASTM E989 `IIC`/`AIIC` separation before any
  runtime impact promotion.

Do not accept broad runtime movement from one happy-path number. A family
solver is ready only when it has required inputs, named equations or
method, positive benchmark, nearby negative, hostile-input guard,
error-budget ownership, and report-visible basis.

Current airborne engine reading before implementation:

- `packages/engine/src/airborne-calculator.ts` currently provides KS
  `Rw` calibration, mass-law, Sharp, and Kurtovic delegate engines.
- KS is appropriate as a massive/mineral mass-curve reference where its
  mass/type range is owned; it is not a generic answer for cavities,
  framing, field, or impact outputs.
- Sharp and Kurtovic currently provide single-panel frequency curves and
  coincidence behavior, plus a limited double-leaf gap adjustment. They
  are inputs to family solvers, not complete double/framed or multi-leaf
  solvers by themselves.
- `packages/engine/src/dynamic-airborne.ts` currently blends these
  delegates and still uses screening/surrogate strategies for
  multi-cavity and framed routes. Tests must make those strategies
  visible and prevent them from being reported as design-grade dynamic
  calculation.

## Runtime Pipeline

Primary entry point:

- `packages/engine/src/calculate-assembly.ts`

Main stages:

1. Parse layers and optional contexts.
   - input layers are schema-validated
   - optional impact predictor input, exact impact source, impact field context,
     and airborne context are parsed before routing
2. Resolve material data and floor-role topology.
   - fully tagged floor stacks preserve operator intent
   - contiguous same-role pieces can be coalesced for split parity
   - raw stacks can be inferred only through guarded floor-role inference
3. Build the airborne lane.
   - screening seed: `estimateRwDb`
   - curve seed: `buildCalibratedMassLawCurve`
   - rating pass: `buildRatingsFromCurve`
   - dynamic/imported calculator overlays can replace the screening curve
   - verified catalog anchors and approximate field companions can overlay the
     selected airborne result
   - model-first pivot target: replace this single selected-curve flow
     with an airborne candidate resolver that can compare whole-stack
     exact source, exact subassembly anchor plus calculated delta,
     family-specific physics, bounded prediction, and screening fallback
4. Build the impact lane.
   - exact impact source, exact floor system, bound floor system, official
     product row, explicit `DeltaLw`, predictor-specific floor system, narrow
     formula estimate, bound estimate, then family estimate
   - impact field context can add `L'n,w`, `L'nT,w`, or `L'nT,50`
5. Build floor airborne companions.
   - floor cards prefer `floorSystemRatings` for `Rw`, `C`, and `Ctr` when a
     floor lane owns those companions
   - otherwise airborne metrics from the selected curve can be shown
6. Gate requested outputs.
   - `analyzeTargetOutputSupport` decides supported and unsupported buckets
   - workbench cards read those buckets before showing values

## Formula Map

### Airborne Screening

Code:

- `packages/engine/src/estimate-rw.ts`
- `packages/engine/src/curve-rating.ts`

Formula-backed seed:

- total surface mass is converted into a screening `Rw` estimate with:
  - base term: `(19 * log10(totalSurfaceMassKgM2)) + 8`
  - lightweight density penalties
  - cavity/topology penalties
  - a narrow dense-composite bonus
  - clamp/round guards
- the selected mass-law curve starts from:
  - `TL(f) = 20 * log10(frequencyHz * surfaceMassKgM2) - 48`
  - then shifts the curve so its contour rating matches the selected target
    `Rw`
- `Rw`, `C`, `Ctr`, and `STC` are rated from the selected curve

Important boundary:

- this is a local calibrated screening/formula lane, not external source truth
- exact measured or official source rows can supersede it for floor-system
  companions

### Airborne Field Outputs

Code:

- `packages/engine/src/curve-rating.ts`
- `packages/engine/src/calculate-assembly.ts`

Formula-backed field outputs:

- `R'w` comes from the apparent airborne curve
- `DnT,w` uses receiving-room volume and partition area:
  - `10log10(0.32V/S)` in the current implementation
- `Dn,w` uses reference absorption area and partition area:
  - `10log10(A0/S)`
- `DnT,A` and `Dn,A` are companion A-style sums from the same field curve terms

Important boundary:

- missing geometry blocks field outputs that need that geometry
- exact floor `Rw` and apparent `R'w` are different surfaces and must not be
  collapsed into each other

### Floor Airborne Companions

Code:

- `packages/engine/src/floor-system-ratings.ts`
- `apps/web/features/workbench/simple-workbench-output-model.ts`

Origins:

- exact floor-system row: use source airborne companion ratings
- published family estimate: use estimated source-family airborne companions
- bound-only family: use bound source-family airborne companions
- heavy reference companion: use the explicit heavy-concrete companion lane
- screening fallback: use the selected airborne `Rw`/`Rw+Ctr` curve result

Important boundary:

- floor `Rw` cards prefer `floorSystemRatings.Rw`
- non-floor or non-companion `Rw` cards use `metrics.estimatedRwDb`
- `C`, `Ctr`, `Rw+C`, and `Rw+Ctr` are not interchangeable; the current
  `RwCtrSemantic` field decides whether a legacy numeric companion is a `Ctr`
  term, `Rw+C`, or `Rw+Ctr`

### Impact Outputs

Code:

- `packages/engine/src/impact-lane.ts`
- `packages/engine/src/impact-exact.ts`
- `packages/engine/src/impact-field-context.ts`
- `packages/engine/src/impact-guide.ts`

Impact selection order:

1. exact source impact bands or exact floor-system row
2. bound floor-system row
3. official impact product catalog row
4. explicit `DeltaLw` input
5. predictor-specific floor-system estimate
6. narrow layer-based impact estimate
7. bound floor-system estimate
8. broader floor-system estimate

Outputs:

- `Ln,w` is owned by the active impact lane, not by the airborne `Rw` curve
- `CI`, `CI,50-2500`, and exact `Ln,w+CI` are shown only when the impact lane
  carries those companions
- `Ln,w+CI` can also be shown as a conservative bound when a bound floor-system
  row carries `LnWPlusCIUpperBound`
- `LnWPlusCIUpperBound` does not imply exact `Ln,w`, exact `CI`, or any field
  continuation
- UBIQ open-web + carpet/foam rows that publish only combined
  `Ln,w+CI <=45` stay fail-closed for exact impact outputs when malformed
  near-misses leave the official bound; derived predictor fallback must not
  borrow nearby bare/timber rows to fabricate exact `Ln,w`, `CI`, or field
  continuations
- `L'n,w` is a field-side continuation from K/direct field support
- `L'nT,w` is a standardized field continuation from K plus room-volume context,
  or from the explicit local small-room guide lane
- `L'nT,50` is shown only when low-frequency companion data is present
- bound-only rows can show conservative upper/lower bounds without pretending to
  be exact measurements

Important boundary:

- exact impact-band sources are rated on the ISO 717-2 nominal grid without
  reusing the airborne TL curve
- field impact continuation requires explicit field context; otherwise cards
  stay `needs_input` or `unsupported`

## Source Truth Vs Formula Truth

Use this distinction when deciding whether an answer is "right":

- source truth:
  - imported measured rows, official rows, exact source ids, and explicit product
    rows
  - tests should assert exact ids, source values, basis/provenance, and support
    buckets
- formula truth:
  - local mass-law screening, curve rating, field normalization, guide lookup,
    family-specific physics solvers, and predictor formulas
  - tests should assert numeric outputs, formula basis, and nearby negative
    cases
  - source absence is not formula absence; when topology and material inputs are
    sufficient, a formula-backed prediction should still calculate and carry a
    non-exact basis
- similar-source truth:
  - measured rows that are close but not exact
  - can support anchored deltas, calibration corridors, response surfaces,
    holdouts, or conservative bounds only through a named algorithm
  - tests should assert topology/metric/basis scope, delta method, residuals or
    error budget, and a nearby negative that must not borrow the row
- predictor truth:
  - source-family or published-family estimates that are not exact source rows
  - tests should assert fit/candidate/basis labels and fail-closed boundaries
- bound truth:
  - official or source-family bounds
  - tests should assert bound values and make sure exact values are not
    fabricated
- unsupported truth:
  - intentionally unavailable outputs
  - tests should assert unsupported buckets and workbench `Not ready` cards

## Answer-Engine Origin Model

The 2026-05-05 model-first pivot identified the need for explicit
airborne/wall candidate ownership. That architecture target is now
implemented for the current usable V1 envelope through the shared
resolver registry, runtime candidate adapter, boundary payloads, owner
audit, and parity surfaces.

The origin ladder remains the validation model for new post-V1 slices:

1. `measured_exact_full_stack`
2. `measured_exact_subassembly_plus_calculated_delta`
3. `calibrated_family_physics`
4. `family_physics_prediction`
5. `bounded_prediction`
6. `screening_fallback`
7. `needs_input`
8. `unsupported`

For every new formula, adapter, or anchor, tests must prove which origin
owns the selected route, basis, metric set, required inputs, support
bucket, value pins, and visible stopped-output behavior. Grouped
triple-leaf, multicavity, direct-fixed, field, building, and ASTM/IIC
expansions remain valid future work only when they preserve this origin
model.

### Standards Alignment

The model-first pivot is standards-aware, not standards-blind:

- ISO 12354-1 and ISO 12354-2 define the building-estimation frame for
  airborne and impact performance from element performance, flanking
  paths, and theoretical propagation methods.
- ISO 717-1 and ISO 717-2 define rating conversion from band results to
  single-number airborne/impact quantities.
- ISO 10140-2 and ISO 10140-3 are lab element measurement contexts.
- ISO 16283-1 and ISO 16283-2 are field measurement contexts.
- ASTM E90/E336/E413 define the US airborne lab/field/STC lane.
- ASTM E492/E989 define the US impact/IIC lane.
- ISO 9053, ISO 354, and ASTM C423 describe porous/absorption input
  evidence. NRC/absorption can inform absorber/cavity assumptions, but
  it is not transmission-loss or impact-isolation evidence by itself.
- ISO 9052-1 dynamic stiffness is a required input context for
  design-grade floating-floor impact prediction; thickness and density
  alone are not enough.

Every non-trivial result should eventually expose:

- `measurementStandard` when the result comes from a measured row;
- `calculationStandard` when the result is predicted;
- `ratingStandard` when a curve is collapsed to a single number;
- `frequencyBands` and `curveBasis` when the engine has a curve;
- `errorBudgetDb` or `toleranceClass` when the result is not exact.

This prevents the old failure mode where a missing source packet was
treated as "no calculation possible". The corrected rule is:

- missing exact source packet -> no measured-exact/source-validated
  claim;
- sufficient physical inputs and family solver -> calculated prediction
  is still allowed;
- missing physical inputs/topology -> `needs_input`;
- unsupported family/output -> `unsupported`.

The planned airborne basis contract must therefore expose the difference
between evidence absence and input absence:

- `missingSourceEvidence`: exact/promotion/calibration blocker only;
- `missingPhysicalInputs`: fields the UI must ask the user to provide;
- `propertyDefaults`: conservative defaults the selected solver used;
- `errorBudgetDb`: widened uncertainty caused by defaults or
  uncalibrated family physics.

## How Tests Prove Correctness

A strong calculator test is not just "result is finite".

The minimum useful assertion set is:

- answer value:
  - exact number or bounded value for every output being defended
- origin:
  - basis, match id, estimate kind, product/source id, or metric basis
- support bucket:
  - `supportedTargetOutputs`, `unsupportedTargetOutputs`,
    `supportedImpactOutputs`, and `unsupportedImpactOutputs`
- UI parity:
  - workbench output-card status and value for the same requested outputs
- negative shape:
  - adjacent inputs that must stay fail-closed
- stability shape:
  - contiguous split parity, disjoint split rejection, duplicate/reorder/history
    behavior where relevant

Current examples:

- Output-origin trace matrix:
  - `packages/engine/src/output-origin-trace-matrix.test.ts`
  - `apps/web/features/workbench/output-origin-trace-card-matrix.test.ts`
- Dataholz CLT source truth:
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- Raw terminal concrete with ceiling helpers:
  - `packages/engine/src/raw-concrete-helper-answer-guard.test.ts`
  - `apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts`
- Field/card support gating:
  - `packages/engine/src/raw-floor-screening-carrier-support.test.ts`
  - `apps/web/features/workbench/raw-floor-screening-route-support.test.ts`
- Broad defended gate:
  - `pnpm --filter @dynecho/engine test`

## Current Confidence Reading

High-confidence current posture:

- exact imported source rows that have source-truth audit tests
- UBIQ `FL-23/25/27` exact weak-band rows when the direct lower-board source
  stack is visible; these rows are exact-only correction rows and not
  nearby-family estimate anchors
- UBIQ `FL-24` exact rows when the resilient lower-treatment source topology is
  visible; after the topology correction these rows are also exact-only and do
  not anchor raw/split lower-only helper estimates
- UBIQ `FL-24/26/28` supported resilient-band bare and timber rows when the
  exact source topology is visible; bare rows are exact-only, `FL-24` remains
  exact-only, and `FL-26/28` timber rows remain the current defended
  family-estimate anchors
- source rows whose workbench cards are also pinned
- raw terminal-concrete plus ceiling-helper corridor as an implementation
  baseline, because numeric answers and card statuses are now pinned
- explicit fail-closed negatives around weaker carriers, top-side finish after
  terminal concrete, and disjoint role splits

Medium-confidence current posture:

- formula-backed screening and field companions inside already defended
  corridors
- predictor/family estimates with candidate ids, basis labels, and negative
  guards

Low-confidence / open posture:

- broad raw-floor widening outside source-led families
- helper-only timber and open-web steel raw carriers
- UBIQ upper-only weak-band packages without the lower direct ceiling boards
- hostile-input/history coverage around the newly imported UBIQ
  `Ln,w+CI` bound lane
- C11c impact import
- `GDMTXA04A` visible exact reopening
- broader wall selector widening beyond the currently defended hold

This means the project is making real progress, but it should not be declared
globally ready until every product-critical output family has the same origin,
answer, support, card, and hostile-input coverage.

## Current Documentation Finding

The implementation has formulas, but the living docs did not previously provide
a single answer-origin map. That made it too easy to talk about "the formula" as
if every card came from the same calculation path.

The correct mental model is:

- exact source rows beat formulas
- formula lanes generate screening and field-derived outputs
- predictor lanes interpolate or estimate only inside guarded family evidence
- support gating decides what the user is allowed to see
- workbench cards must mirror engine support instead of inventing their own
  confidence

Architecture watch:

- `calculate-assembly.ts` is already a large orchestration file
- do not grow it with ad hoc card/origin reporting logic during the next slice
- if structured output-origin reporting becomes necessary, prefer a small
  helper/module that derives origin records from the existing calculation result
  fields instead of embedding more UI-facing explanation inside the solver

## Latest Trace Slice

The first trace/measurement slice is implemented:

- slice id: `output_origin_trace_matrix_v1`
- type: test-first trace and card-origin hardening
- status: implemented; focused, adjacent, typecheck, diff, and full engine gates
  are green
- goal:
  - make each defended representative output answerable as:
    `output -> value -> origin -> basis/source -> support/card status`
- implemented coverage:
  - exact Dataholz dry CLT source row
  - Dataholz `GDMTXA04A` source-family estimate route
  - raw terminal-concrete plus ceiling-helper formula/predictor route
  - UBIQ bound-only source row
  - dynamic wall airborne field route
  - dynamic wall field route with missing volume, where `DnT,w`/`DnT,A` stay
    needs-input on cards
  - steel-joist helper-heavy raw fail-closed impact route
- tests assert:
  - engine numeric values where live
  - conservative upper-bound values where bound-only
  - basis/source/estimate ids
  - engine support buckets
  - workbench card status/value parity
- validation:
  - engine trace/source/raw pack: `3` files, `7` tests, green
  - workbench trace/source/raw pack: `3` files, `4` tests, green
  - full engine suite: `99` files, `787` tests, green
  - full web suite: `94` files, `602` tests, green
  - engine/web typechecks and `git diff --check`: green

After this trace slice and the current no-widening guard set were checkpointed,
the next wall-selector trace slice was implemented:

- `wall_selector_wider_trace_matrix_v1`

It stayed trace-only and did not widen behavior. The proof shape is the same
value/origin/support/card structure above, applied to settled wall families, the
currently held `double_leaf <-> lined_massive_wall` boundary, non-AAC heavy-core
controls, and a strong framed control route.

Implemented artifacts:

- `packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts`
- `apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts`

The matrix pins:

- live `Rw`, `R'w`, and `DnT,w` values where supported
- unsupported `Rw` on field-only wall routes and field `needs_input` on
  lab-only double-stud routes
- family decision class, runner-up, hold metrics, trim counts, and warnings
- matching workbench card status/value, branch summary, validation posture, and
  consultant wording

Latest formula-lane history/card guard:

- `heavy_concrete_formula_history_card_matrix_v1`
- purpose:
  - prove that the calculator is not only hand-entered exact rows; the narrow
    heavy concrete formula lanes also survive realistic workbench history
  - keep formula-owned outputs visibly separate from exact source rows,
    source-family estimates, and unsupported outputs
- implemented artifacts:
  - `packages/engine/src/post-clt-combined-anchor-history-next-slice-selection-contract.test.ts`
  - `apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts`
- covered formula bases:
  - bare massive floor `Ln,w`:
    `predictor_bare_massive_floor_iso12354_annexc_estimate`
  - heavy floating-floor `Ln,w` / `DeltaLw`:
    `predictor_heavy_floating_floor_iso12354_annexc_estimate`
- covered workbench outputs:
  - `Rw`, `Ln,w`, `DeltaLw`, `L'n,w`, `L'nT,w`
- non-goal:
  - this did not import source rows or broaden raw timber/open-box/open-web
    support; it only guards formula-lane ownership and card stability

Latest formula provenance/report guard:

- `heavy_concrete_formula_field_provenance_surface_v1`
- purpose:
  - preserve formula ownership after field-side `K` and standardized
    room-volume carry-over changes `impact.basis` to a mixed field lane
  - make the formula origin visible in the same user-facing surfaces that show
    the result: predictor status, support formula notes, dynamic trace labels,
    the impact trace panel, and the Markdown report
- implemented artifacts:
  - `packages/engine/src/post-heavy-concrete-formula-history-next-slice-selection-contract.test.ts`
  - `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`
  - strengthened field-carry-over formula assertions in
    `packages/engine/src/calculate-assembly.test.ts`
- behavior now guarded:
  - field-carried bare concrete `Ln,w` still reports the narrow heavy bare-floor
    formula basis from `impact.metricBasis`
  - field-carried floating concrete `Ln,w` / `DeltaLw` still reports the
    narrow heavy floating-floor formula basis from `impact.metricBasis`
  - `impactPredictorStatus.implementedFormulaEstimate` remains true for those
    mixed field lanes
  - `impactSupport.formulaNotes` includes the Annex-C narrow-scope note,
    formula relation, resonance cross-check where relevant, and field-side
    `L'n,w` / `L'nT,w` derivations together
- non-goal:
  - this is metadata/provenance behavior only; it does not widen formula scope,
    source matching, catalog import, wall behavior, or numeric acoustic results

Latest proposal method/evidence formula guard:

- `formula_provenance_method_evidence_dossier_v1`
- purpose:
  - carry the already-owned heavy concrete formula provenance into the proposal
    method dossier and evidence packet surfaces
  - prevent field-carried formula lanes from looking like generic estimated
    impact lanes inside exported solver rationale material
- implemented artifacts:
  - `apps/web/features/workbench/simple-workbench-method-dossier.test.ts`
  - `apps/web/features/workbench/simple-workbench-evidence.test.ts`
  - `packages/engine/src/post-formula-provenance-report-next-slice-selection-contract.test.ts`
- behavior now guarded:
  - heavy floating formula with `K` and receiving-room volume still presents as
    `Heavy floating-floor formula`
  - the method trace group keeps the scoped formula note and Annex-C derivation
    notes from `impactSupport.formulaNotes`
  - the evidence packet dynamic impact citation keeps the selected formula
    label, `Estimated evidence` tier, and standardized field-volume basis
- validation:
  - full engine suite: `121` files / `846` tests green
  - full web suite: `113` files / `640` tests green
  - engine/web typecheck and lint, `pnpm build`, and `git diff --check` green
- non-goal:
  - this is no-numeric-runtime UI/documentation behavior only; it does not
    change acoustic equations, constants, source rows, or supported family scope

Latest wall-selector validation:

- focused engine trace matrix: `1` file, `1` test, green
- focused workbench card matrix: `1` file, `1` test, green
- engine selector/boundary pack: `3` files, `15` tests, green
- workbench selector/boundary/validation pack: `5` files, `26` tests, green
- engine/web typechecks: green
- full engine suite: `100` files, `788` tests, green
- full web suite: `95` files, `603` tests, green
- `git diff --check`: green

The next no-widening raw-floor guard is also implemented:

- slice id: `raw_floor_hostile_input_answer_matrix_v1`
- engine artifact:
  `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
- workbench artifact:
  `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
- purpose:
  - prove that hostile raw floor inputs are measured by answers, not only by
    finite/non-finite checks
  - keep raw-floor widening blocked until a source-backed carrier/output surface
    is named
- pinned routes:
  - long split terminal-concrete helper: all requested floor/field outputs live
    with numeric answer snapshots
  - same-material concrete helper with non-terminal concrete: field `Rw`
    unsupported while impact field continuations remain live
  - long open-web helper-heavy raw stack: impact outputs unsupported/needs-input
  - fragmented CLT lower-only raw stack: impact outputs unsupported/needs-input
- validation:
  - focused engine hostile-input matrix: `1` file, `1` test, green
  - focused workbench hostile-input card matrix: `1` file, `1` test, green
  - engine raw adjacent pack: `6` files, `12` tests, green
  - workbench raw adjacent pack: `6` files, `9` tests, green
  - full engine suite: `101` files, `789` tests, green
  - full web suite: `96` files, `604` tests, green
  - engine/web typechecks and `git diff --check`: green

The next no-widening UBIQ open-web packaged-lane guard is also implemented:

- slice id: `ubiq_open_web_packaged_lane_trace_matrix_v1`
- engine artifact:
  `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
- workbench artifact:
  `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`
- purpose:
  - prove that an already-live UBIQ open-web packaged lower lane is measured by
    numeric answers and output-card values, not only by "supported" flags
  - keep the current family-estimate posture honest before any UBIQ behavior
    widening is considered
- pinned routes:
  - canonical raw `2 x 16 mm` lower package:
    `family_general`, `59.3%` fit, live `Rw`, `R'w`, `DnT,w`, `Ln,w`,
    `L'n,w`, and `L'nT,w`
  - raw split lower package:
    same numeric answers and card values as canonical raw input
  - tagged split lower package:
    same numeric answers and card values as canonical raw input
  - reordered lower package:
    same live answer values, but explicitly `low_confidence` at `29%` fit with
    duplicate-role warning coverage
- validation:
  - focused engine UBIQ trace matrix: `1` file, `1` test, green
  - focused workbench UBIQ card matrix: `1` file, `1` test, green
  - engine packaged-lane/UBIQ adjacent pack: `7` files, `24` tests, green
  - workbench packaged-lane adjacent pack: `7` files, `13` tests, green
  - full engine suite: `102` files, `790` tests, green
  - full web suite: `97` files, `605` tests, green
  - `pnpm build`: green with the known `sharp/@img` optional-package warnings
    and Next.js TypeScript plugin recommendation
  - engine/web typechecks and `git diff --check`: green

The UBIQ weak-band exact source-mapping slice is now implemented:

- slice id: `ubiq_weak_band_exact_import_source_mapping_v1`
- source:
  <https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf>
- engine artifacts:
  - `packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`
  - `packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts`
- workbench artifact:
  `apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`
- pinned routes:
  - official `FL-23`, `FL-25`, and `FL-27` exact rows across direct lower-board
    source stacks
  - exact rows stay out of nearby-family recommendations via
    `familyEstimateEligible: false`
  - upper-only weak-band packages stay impact-fail-closed
  - `FL-24` now requires the resilient lower-treatment topology and no longer
    collides with direct `FL-23`
  - `FL-24` is exact-only until the supported-band finish completion slice
    revalidates its safe family-estimate surface
- validation:
  - engine UBIQ exact/source/posture/re-rank/backlog pack:
    `5` files, `210` tests, green
  - floor library sweep/source/raw parity/companion pack:
    `4` files, `29` tests, green
  - workbench UBIQ weak-band and packaged-lane card pack:
    `2` files, `3` tests, green

The UBIQ supported-band finish-completion slice is now implemented:

- slice id: `ubiq_open_web_supported_band_finish_completion_v1`
- source:
  <https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf>
- catalog artifact:
  `packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-rows.ts`
- engine artifacts:
  - `packages/engine/src/ubiq-open-web-supported-band-finish-completion.test.ts`
  - `packages/engine/src/ubiq-candidate-backlog-contract.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
- workbench artifact:
  `apps/web/features/workbench/floor-family-regressions.test.ts`
- pinned routes:
  - official `FL-24`, `FL-26`, and `FL-28` supported resilient-band bare INEX
    rows are exact only when the source topology is visible
  - official timber + acoustic underlay rows keep their existing exact ids and
    values
  - all bare supported-band rows are `familyEstimateEligible: false`
  - `FL-24` remains exact-only; `FL-26/28` timber rows remain the current
    defended family-estimate anchors
  - supported-band carpet source values are not exact rows because the source
    gives `Ln,w+CI <= 45`, not exact `Ln,w`
- validation:
  - engine supported-band/backlog/corpus pack:
    `3` files, `16` tests, green
  - workbench floor-family route pack:
    `1` file, `96` tests, green
  - full engine suite: `107` files, `806` tests, green
  - full web suite: `101` files, `615` tests, green
  - catalog, engine, and web typecheck/lint: green
  - `pnpm build`: green with known `sharp/@img` and Next.js TypeScript plugin
    warnings
The UBIQ supported-band carpet bound-surface slice is now implemented:

- slice id: `impact_lnw_plus_ci_bound_surface_v1`
- source:
  <https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf>
- catalog artifact:
  `packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-carpet-bound-rows.ts`
- engine artifacts:
  - `packages/engine/src/impact-lnw-plus-ci-bound-surface.test.ts`
  - `packages/engine/src/target-output-support-contract.test.ts`
  - `packages/engine/src/floor-library-sweep.test.ts`
- workbench artifact:
  `apps/web/features/workbench/floor-family-regressions.test.ts`
- pinned routes:
  - `18` UBIQ `FL-24/26/28` supported-band carpet + foam-underlay source rows
    are imported as official `Ln,w+CI <=45` bounds
  - `LnWPlusCIUpperBound` is a separate metric from `LnWUpperBound`
  - requested `Ln,w+CI` can be supported by the bound row
  - requested `Ln,w`, `CI`, `L'n,w`, `L'nT,w`, and `L'nT,50` stay unsupported
    from this combined bound
- validation:
  - targeted engine regression pack: `5` files, `296` tests, green
  - full web suite during the slice: `101` files, `615` tests, green
The metric-specific bound report/reference slice is now implemented:

- slice id: `bound_metric_report_surface_completion_v1`
- workbench artifacts:
  - `apps/web/features/workbench/compose-workbench-report.ts`
  - `apps/web/features/workbench/dutch-impact-reference.ts`
  - `apps/web/features/workbench/impact-field-guides.ts`
  - `apps/web/features/workbench/impact-product-catalog-panel.tsx`
- tests:
  - `apps/web/features/workbench/compose-workbench-report-bound-metrics.test.ts`
  - `apps/web/features/workbench/impact-field-guides-bound-metrics.test.ts`
- pinned behavior:
  - reports print `Ln,w+CI upper bound` for combined-bound rows
  - target `Ln,w` deltas are not computed from combined `Ln,w+CI` bounds
  - Dutch impact references mention the combined bound only as a proxy and do
    not issue compliance verdicts without exact `LnT,A`
  - guide status copy states that combined `Ln,w+CI` bounds are not valid
    guide-base `Ln,w`
- validation:
  - targeted web report/reference/guide pack: `4` files, `103` tests, green
  - final broad validation: catalog/engine/web typecheck and lint green, full
    engine `108` files / `811` tests green, full web `103` files / `618` tests
    green, `pnpm build` green with known `sharp/@img` optional-package warnings
    and the existing Next.js TypeScript plugin recommendation, and
    `git diff --check` green
The UBIQ combined-bound history guard is now implemented:

- slice id: `ubiq_lnw_plus_ci_bound_history_guard_v1`
- type: no-widening hostile-input and route-history guard for the UBIQ
  `Ln,w+CI <=45` combined-bound lane
- artifacts:
  - `packages/engine/src/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
  - `apps/web/features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- pinned behavior:
  - canonical, `49`-layer split, and role-reordered source-equivalent UBIQ
    carpet stacks stay on the official `Ln,w+CI <=45` bound
  - `Ln,w`, `CI`, `L'n,w`, `L'nT,w`, and `L'nT,50` stay unsupported from that
    combined-bound source
  - disjoint carpet, extra boards, missing fill, and wrong-depth near-misses do
    not receive official bound provenance
  - workbench duplicate/split/reorder/save-load and floor/wall detours keep
    official bound cards stable; disjoint carpet stays a labeled non-source
    estimate with duplicate floor-covering warning
- validation:
  - targeted engine history/bound pack: `2` files, `5` tests, green
  - targeted workbench history/report/floor pack: `3` files, `100` tests,
    green
  - final broad validation: catalog/engine/web typecheck and lint green, full
    engine `109` files / `813` tests green, full web `104` files / `620` tests
    green, `pnpm build` green with known `sharp/@img` optional-package warnings
    and the existing Next.js TypeScript plugin recommendation, and
    `git diff --check` green
- next model/test gap:
  - closed by `ubiq_lnw_plus_ci_near_miss_estimate_posture_decision_v1` below:
    malformed UBIQ carpet near-misses now fail closed for impact-combined
    outputs after official bound provenance falls off

The UBIQ combined-bound near-miss posture decision is now implemented:

- slice id: `ubiq_lnw_plus_ci_near_miss_estimate_posture_decision_v1`
- type: no-widening fail-closed decision for malformed UBIQ
  `Ln,w+CI <=45` combined-bound near-misses
- artifacts:
  - `packages/engine/src/bound-only-floor-near-miss.ts`
  - `packages/engine/src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
  - `apps/web/features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
- pinned behavior:
  - malformed disjoint-carpet, extra-board, missing-fill, missing-INEX, and
    wrong-depth UBIQ open-web + carpet/foam stacks do not receive official bound
    provenance
  - those same malformed stacks also do not receive broader family-estimate or
    derived-predictor impact values
  - assembly keeps only screening/live `Rw`; `Ln,w`, `CI`, `Ln,w+CI`,
    `L'n,w`, `L'nT,w`, and `L'nT,50` stay unsupported
  - impact-only keeps all requested outputs unsupported for those malformed
    visible/source stacks unless a separate exact/bound/source lane owns them
- validation:
  - targeted engine near-miss/bound pack: `3` files, `7` tests, green
  - targeted workbench near-miss/history/report pack: `3` files, `5` tests,
    green
  - final broad validation after the follow-up source-gap matrix:
    catalog/engine/web typecheck and lint green, full engine `111` files /
    `821` tests green, full web `106` files / `627` tests green, `pnpm build`
    green with known `sharp/@img` optional-package warnings and the existing
    Next.js TypeScript plugin recommendation, and `git diff --check` green

The remaining source-gap posture matrix is now implemented:

- slice id: `remaining_source_gap_posture_matrix_v1`
- type: no-widening value/origin/support/card matrix for deferred source gaps
- artifacts:
  - `packages/engine/src/remaining-source-gap-posture-matrix.test.ts`
  - `apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts`
- pinned behavior:
  - TUAS `C11c` remains deferred / impact-fail-closed
  - Dataholz `GDMTXA04A` remains estimate-only on the defended Dataholz dry-CLT
    estimate route
  - raw bare open-web and raw bare open-box impact support remains closed
  - helper-only timber and helper-only open-web negatives remain impact-closed
- validation:
  - targeted engine matrix: `1` file, `6` tests, green
  - targeted workbench card matrix: `1` file, `6` tests, green

The raw bare open-web/open-box source-evidence re-rank is now implemented:

- slice id: `raw_bare_open_web_open_box_source_evidence_re_rank_v1`
- type: no-runtime source contract before any raw bare impact widening
- artifact:
  - `packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts`
- pinned source boundary:
  - TUAS/Mendeley open-box evidence is packaged measured systems; the dataset
    states the load-bearing slabs were not tested bare
  - UBIQ open-web evidence is INEX deck / floor-finish / resilient-ceiling
    system tables; it is not raw open-web carrier impact evidence
- result:
  - raw bare open-web and raw bare open-box impact support remains closed
  - the route selected after this source contract was
    `tuas_open_box_same_package_fragmentation_design_v1`, constrained to
    source-equivalent packaged open-box exact impact matching
- validation:
  - targeted engine source-evidence contract: `1` file / `3` tests green
  - full engine suite: `112` files / `824` tests green
  - engine typecheck, engine lint, and `git diff --check` green

The TUAS open-box same-package fragmentation design guard is now implemented:

- slice id: `tuas_open_box_same_package_fragmentation_design_v1`
- type: no-runtime generated exact-route/card guard
- artifacts:
  - `packages/engine/src/tuas-open-box-same-package-fragmentation-design.test.ts`
  - `apps/web/features/workbench/tuas-open-box-same-package-fragmentation-card-design.test.ts`
- pinned behavior:
  - all `15` imported TUAS open-box exact rows preserve their exact source id,
    impact basis, `Rw`, `Ln,w`, `Ln,w+CI`, field continuations, support
    buckets, and workbench card values/statuses under source-equivalent
    contiguous fragmentation
  - this does not open raw bare, lower-only, upper-only, or disjoint
    open-box impact support
- validation:
  - targeted engine same-package guard: `1` file / `2` tests green
  - targeted workbench same-package card guard: `1` file / `2` tests green
  - final broad validation: engine/web typecheck and lint green; full engine
    `113` files / `826` tests green; full web `107` files / `629` tests
    green; `pnpm build` green with known optional-package warnings;
    `git diff --check` green
- route selected after this close-out:
  `ubiq_open_web_packaged_finish_family_design_v1`

The UBIQ open-web packaged finish-family design guard is now implemented:

- slice id: `ubiq_open_web_packaged_finish_family_design_v1`
- type: no-runtime generated exact/bound route-card guard
- artifacts:
  - `packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts`
  - `apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts`
- pinned behavior:
  - all `90` imported UBIQ open-web exact rows and all `21` imported UBIQ
    open-web bound rows preserve their official exact/bound source id, metric
    basis, target-output support buckets, and workbench card values/statuses
    under source-equivalent contiguous fragmentation
  - weak-band `FL-23/25/27` carpet rows are exact-only source rows; supported-band
    `FL-24/26/28` carpet rows are `Ln,w+CI <=45` bound-only source rows
  - this guard does not open raw bare open-web impact support or a broad
    weak-band family fallback
- validation:
  - targeted engine finish-family guard: `1` file / `3` tests green
  - targeted workbench finish-family card guard: `1` file / `2` tests green
  - final broad validation: engine/web typecheck and lint green; full engine
    `114` files / `829` tests green; full web `108` files / `631` tests green;
    `pnpm build` green with known optional-package warnings; `git diff --check`
    green
- route selected after this close-out:
  `ubiq_open_web_packaged_finish_near_miss_matrix_v1`

The UBIQ open-web packaged finish near-miss/drop-off matrix is now implemented:

- slice id: `ubiq_open_web_packaged_finish_near_miss_matrix_v1`
- type: no-runtime generated route-card matrix
- artifacts:
  - `packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts`
  - `apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts`
- pinned behavior:
  - representative weak-band exact-only, supported-band exact, and supported-band
    `Ln,w+CI <=45` bound packages now pin source-critical deck/board/fill drift
    on engine route and workbench card surfaces
  - source-critical mismatches do not retain official exact/bound provenance:
    weak direct packages fail closed for impact, supported exact timber packages
    drop to the current `family_archetype` estimate lane, and supported bound
    carpet packages fail closed for impact
  - valid finish switches are separated from near-misses and route to their other
    official UBIQ exact or bound row
- validation:
  - targeted engine near-miss matrix: `1` file / `1` test green
  - targeted workbench near-miss card matrix: `1` file / `1` test green
  - final broad validation: engine/web typecheck and lint green; full engine
    `115` files / `830` tests green; full web `109` files / `632` tests green;
    `pnpm build` green with known optional-package warnings
- follow-up history replay route:
  `ubiq_open_web_packaged_finish_history_replay_matrix_v1`
  - implemented as a no-runtime workbench store/history guard
  - exact, bound, near-miss, and valid finish-switch route/card states survive
    duplicate/split/reorder/save-load and floor/wall mode detours
  - validation is green: targeted web guard `1` file / `1` test; adjacent UBIQ
    web pack `3` files / `4` tests; engine/web typecheck/lint; full engine
    `115` files / `830` tests; full web `110` files / `633` tests;
    `pnpm build`; `git diff --check`
- post-UBIQ source-gap planning route:
  `post_ubiq_source_gap_re_rank_v1`
  - executable refresh closed as
    `post_ubiq_source_gap_decision_matrix_v1`
  - C11c source/frequency recheck closed as no-runtime; the weak tuple is not
    explained by `CI` or `CI,50-2500`
  - Dataholz `GDMTXA04A` material-surface recheck closed as no-runtime; the
    source top layer is a composite dry screed element, not the current local
    single-material visible surface
  - checkpoint validation/commit-preparation route closed as:
    `checkpoint_validation_and_commit_v1`
  - follow-up planning route closed as:
    `post_checkpoint_next_slice_selection_v1`
  - CLT combined anchor history guard closed as:
    `clt_combined_anchor_history_replay_matrix_v1`
  - formula-lane selection route closed as:
    `post_clt_combined_anchor_history_next_slice_selection_v1`
  - heavy-concrete formula history guard closed as:
    `heavy_concrete_formula_history_card_matrix_v1`
  - heavy-concrete formula provenance guard closed as:
    `heavy_concrete_formula_field_provenance_surface_v1`
  - proposal/method/evidence formula provenance guard closed as:
    `formula_provenance_method_evidence_dossier_v1`
  - next selected planning route:
    `post_method_evidence_formula_provenance_next_slice_selection_v1`

The deferred open-box finish-tolerance mixed-history boundary is now closed:

- slice id: `open_box_finish_tolerance_mixed_history_boundary_v1`
- workbench artifact:
  `apps/web/features/workbench/open-box-finish-tolerance-mixed-history-boundary.test.ts`
- purpose:
  - prove that the source-band vs outside-band open-box walking-finish boundary
    survives realistic workbench history, not only direct evaluation
  - keep the current open-box tolerance posture measured before any new
    behavior widening
- pinned routes:
  - `10 mm` laminate split as `4 + 6 mm` plus `3 mm` EPS:
    exact `tuas_r2b_open_box_timber_measured_2026`, live `Rw 62`, `Ln,w 46`,
    `L'n,w 48`, and `L'nT,w 45.6`
  - `12 mm` laminate split as `6 + 6 mm` plus `3 mm` EPS:
    no exact impact support, `Rw 44` screening live, `Ln,w` unsupported, and
    field impact cards needs-input
  - both routes pass through duplicate/edit, row-order bounce, save/load, and
    floor/wall mode switching before evaluation
- validation:
  - focused workbench boundary guard: `1` file, `1` test, green
  - workbench adjacent mixed/history/floor pack: `5` files, `112` tests, green
  - engine adjacent source/route pack: `4` files, `36` tests, green
  - full engine suite: `102` files, `790` tests, green
  - full web suite: `98` files, `606` tests, green
  - `pnpm build`: green with known `sharp/@img` and Next.js TypeScript plugin
    warnings
  - engine/web typechecks and `git diff --check`: green

The TUAS `R5b` open-box dry-package fragmentation guard is now closed:

- slice id: `open_box_dry_package_fragmentation_trace_matrix_v1`
- engine artifact:
  `packages/engine/src/open-box-dry-package-fragmentation-trace-matrix.test.ts`
- workbench artifact:
  `apps/web/features/workbench/open-box-dry-package-fragmentation-card-matrix.test.ts`
- purpose:
  - prove that source-equivalent high fragmentation of a strong open-box dry
    exact row keeps the same answers and card statuses
  - prove that disjoint upper-fill input does not silently become exact `R5b`
    even when it still lands on the documented family-general fallback
- pinned routes:
  - fragmented source-equivalent `R5b` package:
    exact `tuas_r5b_open_box_timber_measured_2026`, lab `Rw 75`, `Ln,w 44`,
    `Ln,w+CI 44`, and field `L'n,w 46`, `L'nT,w 43.6`, `L'nT,50 46.6`
  - disjoint upper-fill dry package:
    no exact match, `family_general` at `54%` fit, lab `Rw 63.8`,
    `Ln,w 56.3`, `Ln,w+CI 57.7`, and field `L'n,w 58.3`, `L'nT,w 55.9`,
    `L'nT,50 58.8`
- validation:
  - focused engine trace matrix: `1` file, `1` test, green
  - focused workbench card matrix: `1` file, `1` test, green
  - engine adjacent open-box/split pack: `6` files, `50` tests, green
  - workbench adjacent open-box/card/history pack: `5` files, `111` tests,
    green
  - full engine suite: `103` files, `791` tests, green
  - full web suite: `99` files, `607` tests, green
  - `pnpm build`: green with known `sharp/@img` and Next.js TypeScript plugin
    warnings
  - engine/web typechecks and `git diff --check`: green

Deferred until after these checkpoints:

- `floor_raw_inference_source_led_widening_v1`
- `clt_local_combined_interaction_evidence_v1`

Do not widen either deferred route until it has its own source-led or
frequency-led evidence and trace rows.
