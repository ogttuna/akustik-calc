# Checkpoint 2026-06-30 - Route-Required Input Question Engine Handoff

Status:
`checkpoint_2026_06_30_route_required_input_question_engine_handoff`

Checkpoint scope:
post-OITC spectral rating owner, spectral rating backbone, route/input
family first-class surface, industry-grade golden scenario matrix, and
route-required input question engine are reconciled against the current
implementation and authority docs.

Prerequisite route/input action:
`post_v1_route_input_family_first_class_surface_v1_plan`

Prerequisite route/input status:
`post_v1_route_input_family_first_class_surface_v1_landed_input_surface_selected_post_v1_industry_grade_golden_scenario_matrix_v1`

Previous matrix action:
`post_v1_industry_grade_golden_scenario_matrix_v1_plan`

Previous matrix status:
`post_v1_industry_grade_golden_scenario_matrix_v1_landed_no_runtime_selected_post_v1_route_required_input_question_engine_v1`

Landed question-engine action:
`post_v1_route_required_input_question_engine_v1_plan`

Landed question-engine status:
`post_v1_route_required_input_question_engine_v1_landed_input_surface_selected_post_v1_roof_airborne_formula_owner_after_input_surface_v1`

Landed question-engine candidate:
`post_v1_route_required_input_question_engine_v1`

Current selected next action:
`post_v1_roof_airborne_formula_owner_after_input_surface_v1_plan`

Current selected next file:
`packages/engine/src/post-v1-roof-airborne-formula-owner-after-input-surface-v1-contract.test.ts`

Current selected next plan:
`docs/calculator/POST_V1_ROOF_AIRBORNE_FORMULA_OWNER_AFTER_INPUT_SURFACE_V1_PLAN_2026-06-30.md`

Current selected next label:
`post-V1 roof airborne formula owner after input surface V1`

## Implementation Reconciliation

Landed implementation:

- `packages/engine/src/post-v1-route-required-input-question-engine-v1.ts`
- `packages/engine/src/post-v1-route-required-input-question-engine-v1-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

The implementation matches the landed plan:

- `post_v1_route_required_input_question_engine_v1_landed_input_surface_selected_post_v1_roof_airborne_formula_owner_after_input_surface_v1`
  is the current landed status.
- The question engine consumes typed `AcousticInputCompleteness` rows
  and builds ordered minimum unblocker questions.
- It captures `minimumUnblockerQuestions: 9`,
  `routeQuestionFamiliesCaptured: 9`,
  `requiredPhysicalInputsCaptured: 9`, and
  `optionalPrecisionQuestions: 0`.
- It keeps `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.
- Unsupported-only requests stay unsupported-only; OITC, IIC/AIIC, and
  source-row proximity aliases are not converted into route questions.
- The current gate includes
  `src/post-v1-route-required-input-question-engine-v1-contract.test.ts`.

Question groups now covered:

1. ceiling/roof/suspended-ceiling route intent and support coupling;
2. double-leaf framed wall topology, cavity, spacing, and absorber
   ownership;
3. ceiling plenum mass, cavity, absorber, and hanger/support physics;
4. roof airborne route, mounting, band, surface-mass, and cavity inputs;
5. indoor opening/facade area, count, rating basis, and seal inputs;
6. outdoor-indoor OITC spectral opening and ASTM E1332 band inputs;
7. ASTM IIC/AIIC band and field context inputs;
8. floating-floor impact slab, lower assembly, dynamic stiffness, and
   load basis inputs;
9. field/building room, reverberation, flanking, and output-basis
   inputs.

## Plan Review

The active next plan is still the right high-ROI move:

`docs/calculator/POST_V1_ROOF_AIRBORNE_FORMULA_OWNER_AFTER_INPUT_SURFACE_V1_PLAN_2026-06-30.md`

Reason:

- The question engine removed the immediate input-surface blocker for
  roof airborne requests.
- The roof plan is value-moving, not support-only: it targets `Rw`,
  `STC`, `C`, and `Ctr` on the roof airborne element-lab basis.
- Required roof inputs are explicit: `routeIntent`,
  `roofOrCeilingMountingContext`, `frequencyBandSet`,
  `surfaceMassKgM2`, and `cavityDepthMm`.
- The plan keeps missing roof physics as `needs_input` and blocks
  indoor wall/ceiling borrowing, OITC aliases, field/building promotion,
  impact aliases, and source-row proximity substitution.

No higher-ROI support blocker remains ahead of this selected runtime
owner. The right next implementation step is the roof airborne formula
owner, not another docs loop, broad source crawl, or confidence-label
pass.

This checkpoint is not a broad source crawl.

## Known Gaps

Runtime values did not move in this checkpoint by design. The next
unopened calculator gap is roof airborne runtime calculation.

The selected roof owner must still discover or implement the owned roof
formula corridor. It must not borrow indoor wall, ceiling, OITC, or
source-report values as roof outputs.

Historical docs below the top live sections still contain older
`current` wording from the checkpoint that created them. The top
authority sections, this checkpoint, `CURRENT_STATE.md`,
`NEXT_AGENT_BRIEF.md`, and `NEXT_IMPLEMENTATION_PLAN.md` are the live
handoff.

## Validation

Checkpoint validation command:

`pnpm calculator:gate:current`

Latest result for this checkpoint:

- shared gate: 23 tests passed;
- engine gate: 896 files, 4855 tests passed;
- web gate: 127 files, 508 tests passed, 18 skipped;
- repo build: 5 successful tasks;
- whitespace guard: passed;
- known non-fatal warnings: test-environment Zustand storage warnings
  and optional `sharp/@img` build warnings from the proposal docx path.

Additional focused checks:

- `pnpm --filter @dynecho/engine exec vitest run src/post-v1-route-required-input-question-engine-v1-contract.test.ts`
- `pnpm --filter @dynecho/engine exec vitest run src/post-v1-route-input-family-first-class-surface-v1-contract.test.ts src/post-v1-industry-grade-golden-scenario-matrix-v1-contract.test.ts src/post-v1-route-required-input-question-engine-v1-contract.test.ts`
- `git diff --check`

## Commit Readiness

This is a good stop point if the full current gate remains green after
the checkpoint doc update. The commit should include the landed question
engine, its contract, current-gate wiring, authority docs, this
checkpoint, and the selected roof owner plan. It should not include
unrelated user work outside this calculator checkpoint.
