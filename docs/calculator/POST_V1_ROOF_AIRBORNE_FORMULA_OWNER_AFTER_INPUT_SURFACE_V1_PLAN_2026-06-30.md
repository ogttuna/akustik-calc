# Post-V1 Roof Airborne Formula Owner After Input Surface V1 - 2026-06-30

Status:
`post_v1_roof_airborne_formula_owner_after_input_surface_v1_plan`

Selected by:
`post_v1_route_required_input_question_engine_v1_landed_input_surface_selected_post_v1_roof_airborne_formula_owner_after_input_surface_v1`

Selected candidate:
`post_v1_roof_airborne_formula_owner_after_input_surface_v1`

Selected next action:
`post_v1_roof_airborne_formula_owner_after_input_surface_v1_plan`

Selected next file:
`packages/engine/src/post-v1-roof-airborne-formula-owner-after-input-surface-v1-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_ROOF_AIRBORNE_FORMULA_OWNER_AFTER_INPUT_SURFACE_V1_PLAN_2026-06-30.md`

Selected next label:
`post-V1 roof airborne formula owner after input surface V1`

Previous action:
`post_v1_route_required_input_question_engine_v1_plan`

Previous status:
`post_v1_route_required_input_question_engine_v1_landed_input_surface_selected_post_v1_roof_airborne_formula_owner_after_input_surface_v1`

Previous file:
`packages/engine/src/post-v1-route-required-input-question-engine-v1-contract.test.ts`

Previous plan:
`docs/calculator/POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PLAN_2026-06-30.md`

Earlier matrix action:
`post_v1_industry_grade_golden_scenario_matrix_v1_plan`

Earlier matrix status:
`post_v1_industry_grade_golden_scenario_matrix_v1_landed_no_runtime_selected_post_v1_route_required_input_question_engine_v1`

Earlier input-surface action:
`post_v1_route_input_family_first_class_surface_v1_plan`

Earlier input-surface status:
`post_v1_route_input_family_first_class_surface_v1_landed_input_surface_selected_post_v1_industry_grade_golden_scenario_matrix_v1`

Previous counters:
`minimumUnblockerQuestions: 9`,
`routeQuestionFamiliesCaptured: 9`,
`optionalPrecisionQuestions: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 9`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 8`.

## Purpose

The route/input family surface and question engine now make roof
airborne requests ask for route intent, roof/facade mounting context,
frequency band set, surface mass, and cavity depth instead of failing as
loose missing-input prose. The next highest-ROI value-moving step is to
turn the complete roof airborne input surface into an owned formula
route for roof/facade airborne lab outputs.

This is a runtime formula owner, not a broad source crawl, UI polish
slice, confidence-label pass, or metric aliasing pass.

## Selection Card

User construction / formula family:
roof or facade-like airborne element stacks where the user supplies a
roof/facade route intent, mounting context, one-third-octave or owned
band basis, surface mass, and cavity/depth context.

Target outputs to open:
`Rw`, `STC`, `C`, and `Ctr` on the roof airborne element-lab basis.

Route:
use the `roof_airborne` route family selected by
`buildPostV1RouteInputFamilyFirstClassSurface`, then calculate through
an owned roof airborne mass/cavity formula corridor. Exact measured
rows still win only on same construction and basis; same-family anchors
or deltas require an explicit bounded rule.

Required physical inputs:
`routeIntent`, `roofOrCeilingMountingContext`, `frequencyBandSet`,
`surfaceMassKgM2`, and `cavityDepthMm`.

`needs_input` behavior:
missing roof route intent, mounting context, band set, surface mass, or
cavity depth must return the question-engine minimum unblocker instead
of publishing a guessed roof value.

`unsupported` boundaries:
do not copy indoor partition, ceiling-plenum, facade OITC, or source
report rows into roof airborne outputs. Do not alias OITC, NISR/ISR,
field/building `R'w`/`DnT,w`, or impact metrics from the roof lab route.

Expected counters:
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 4`,
`requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 1`,
`runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 6`.

## Implementation Scope

Start files:

- `packages/engine/src/post-v1-roof-airborne-formula-owner-after-input-surface-v1-contract.test.ts`
- `packages/engine/src/post-v1-route-input-family-first-class-surface-v1.ts`
- `packages/engine/src/post-v1-route-required-input-question-engine-v1.ts`
- roof/airborne resolver files discovered by `rg "roof_airborne|routeIntent|surfaceMassKgM2"`
- `tools/dev/run-calculator-current-gate.ts`

Actions:

- add a complete roof airborne request fixture with route intent,
  mounting context, frequency band set, surface mass, and cavity depth;
- route it through an owned formula owner on the roof route;
- publish `Rw`, `STC`, `C`, and `Ctr` on the roof element-lab basis;
- keep missing roof physics as `needs_input` question groups;
- keep OITC, field/building, indoor partition, ceiling/plenum, impact,
  and source-row proximity aliases blocked;
- update docs/current gate only after the runtime owner lands.

Do not:

- crawl roof source rows broadly;
- borrow indoor wall or ceiling values as roof outputs;
- promote field/building outputs without a building adapter;
- alias OITC/NISR/ISR/STC/Rw across different standards or contexts;
- hide missing physical inputs behind conservative defaults unless the
  route owner explicitly documents and exposes the default.
