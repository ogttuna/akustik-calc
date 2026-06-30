# Post-V1 Route-Required Input Question Engine V1 - 2026-06-30

Status:
`post_v1_route_required_input_question_engine_v1_landed_input_surface_selected_post_v1_roof_airborne_formula_owner_after_input_surface_v1`

Action:
`post_v1_route_required_input_question_engine_v1_plan`

Action file:
`packages/engine/src/post-v1-route-required-input-question-engine-v1-contract.test.ts`

Action plan:
`docs/calculator/POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PLAN_2026-06-30.md`

Action label:
`post-V1 route-required input question engine V1`

Selected by:
`post_v1_industry_grade_golden_scenario_matrix_v1_landed_no_runtime_selected_post_v1_route_required_input_question_engine_v1`

Selected candidate:
`post_v1_route_required_input_question_engine_v1`

Selected next action:
`post_v1_roof_airborne_formula_owner_after_input_surface_v1_plan`

Selected next file:
`packages/engine/src/post-v1-roof-airborne-formula-owner-after-input-surface-v1-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_ROOF_AIRBORNE_FORMULA_OWNER_AFTER_INPUT_SURFACE_V1_PLAN_2026-06-30.md`

Selected next label:
`post-V1 roof airborne formula owner after input surface V1`

Previous action:
`post_v1_industry_grade_golden_scenario_matrix_v1_plan`

Previous status:
`post_v1_industry_grade_golden_scenario_matrix_v1_landed_no_runtime_selected_post_v1_route_required_input_question_engine_v1`

Previous file:
`packages/engine/src/post-v1-industry-grade-golden-scenario-matrix-v1-contract.test.ts`

Previous plan:
`docs/calculator/POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN_2026-06-30.md`

Earlier prerequisite action:
`post_v1_route_input_family_first_class_surface_v1_plan`

Earlier prerequisite status:
`post_v1_route_input_family_first_class_surface_v1_landed_input_surface_selected_post_v1_industry_grade_golden_scenario_matrix_v1`

Previous counters:
`goldenScenarioRows: 40`,
`rankedGapLedgerRows: 8`,
`selectedNextValueOrBoundaryOwner: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 12`.

## Purpose

The golden scenario matrix shows that the broadest current blocker is
not another broad source crawl or a cosmetic surface. Many real user
assemblies now fail closed with typed route/input missing fields, but
the calculator does not yet expose an ordered minimum set of questions
that can unblock the route.

This is an input-surface owner, not a runtime value publication. It is
calculator-aligned because arbitrary layer combinations cannot become
calculable unless the system asks for the missing physical inputs that
the owned formulas require.

This is not a broad source crawl, confidence-label pass, UI polish
slice, metric aliasing pass, formula retune, or source-row import.

## Selection Card

User construction / formula family:
wall double-leaf, floor impact, ceiling/plenum, roof airborne,
opening/facade OITC, ASTM impact, and field/building requests that
already produce `needs_input` through first-class route/input families.

Target outputs to open:
none directly in this slice. The output of this owner is the ordered
question payload that lets the next runtime/formula owner receive
complete route physics.

Route:
consume `AcousticInputCompleteness` rows from the route/input family
surface and build a stable question set by route family.

Required physical inputs:
leaf grouping, cavity/plenum depth, absorber properties, support
coupling, dynamic stiffness, load basis, lower treatment support/cavity,
facade outdoor-indoor context, frequency band set, opening area/count,
rating basis, seal/leakage class, room volumes, RT60, flanking/junction
class, and building output basis.

`needs_input` behavior:
return a minimum unblocker set first, then optional precision prompts.
Hard blockers must be distinct from conservative defaults. Missing
source evidence is not a physical-input question unless the route
requires a same-basis exact source.

`unsupported` boundaries:
keep OITC from Rw/STC/NISR blocked, keep IIC/AIIC from ISO
`Ln,w`/`DeltaLw` blocked, keep lab-to-field copies blocked, keep
roof/facade from indoor partition context blocked, and keep source-row
proximity substitution blocked.

Expected counters:
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`minimumUnblockerQuestions: 9`,
`requiredPhysicalInputsCaptured: 9`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 8`.

## Landed Summary

The question engine landed as
`post_v1_route_required_input_question_engine_v1_landed_input_surface_selected_post_v1_roof_airborne_formula_owner_after_input_surface_v1`.
It adds
`packages/engine/src/post-v1-route-required-input-question-engine-v1.ts`
and
`packages/engine/src/post-v1-route-required-input-question-engine-v1-contract.test.ts`.

The slice converts `AcousticInputCompleteness.missingPhysicalInputs`
into stable, ordered minimum unblocker question groups by route family.
It captures `minimumUnblockerQuestions: 9`,
`routeQuestionFamiliesCaptured: 9`, `optionalPrecisionQuestions: 0`,
`requiredPhysicalInputsCaptured: 9`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 8`.

The nine captured blocker groups cover ceiling/roof/suspended-ceiling
route intent, double-leaf framed wall topology, ceiling plenum physics,
roof airborne mass/band/cavity inputs, indoor opening/facade geometry,
outdoor-indoor OITC spectral opening inputs, ASTM `IIC`/`AIIC` band and
field context, floating-floor impact dynamic stiffness/load/lower
treatment, and field/building room/flanking context.

Unsupported-only requests remain unsupported-only questions: OITC is
not asked from Rw/STC/NISR aliases, IIC/AIIC is not asked from ISO
`Ln,w`/`DeltaLw`, and source-row proximity substitution remains
blocked. This is not a broad source crawl.

Selected next:
`post_v1_roof_airborne_formula_owner_after_input_surface_v1_plan`
/
`packages/engine/src/post-v1-roof-airborne-formula-owner-after-input-surface-v1-contract.test.ts`
/
`docs/calculator/POST_V1_ROOF_AIRBORNE_FORMULA_OWNER_AFTER_INPUT_SURFACE_V1_PLAN_2026-06-30.md`
/
`post-V1 roof airborne formula owner after input surface V1`.

## Implementation Scope

Start files:

- `packages/engine/src/post-v1-route-required-input-question-engine-v1-contract.test.ts`
- `packages/engine/src/post-v1-route-input-family-first-class-surface-v1.ts`
- `packages/engine/src/post-v1-industry-grade-golden-scenario-matrix-v1.ts`
- `packages/shared/src/domain/input-completeness.ts`
- `docs/calculator/POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN_2026-06-30.md`

Actions:

- define a route-required question payload with stable ids, label keys,
  blocker severity, optional/default policy, and target route family;
- transform `AcousticInputCompleteness.missingPhysicalInputs` into an
  ordered minimum unblocker set;
- rank hard blockers before optional precision fields;
- group duplicate missing fields across route families without hiding
  which route needs each field;
- keep `unsupported` rows as unsupported, not questions;
- select the next value-moving or accuracy owner after this input
  surface lands.

Do not:

- ask for every possible acoustic property at once;
- turn missing source evidence into generic physical-input prompts;
- introduce unowned conservative defaults;
- calculate OITC/IIC/AIIC aliases;
- import source rows or retune formulas;
- move runtime values in this slice.
