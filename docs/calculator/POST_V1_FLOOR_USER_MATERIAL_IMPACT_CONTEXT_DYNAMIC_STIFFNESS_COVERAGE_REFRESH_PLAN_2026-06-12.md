# Post-V1 Floor User-Material Impact Context Dynamic-Stiffness Coverage Refresh Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. This follow-up exists only to freeze
the runtime owner that lets custom visible heavy floating-floor stacks
calculate ISO lab impact outputs when the user supplies the missing
physical inputs through `floorImpactContext`.

This is not material-editor UI work, source crawling, a finite source
row pack, or a formula retune.

## Previous Owner

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`

Landed owner:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`

Owner file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`

Owner status:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`floor.user_material_impact_context_dynamic_stiffness_owner`

The owner moves one custom floor request shape from unsupported to
calculated: a visible `base_structure / resilient_layer /
floating_screed / floor_covering` stack with custom heavy concrete,
custom resilient underlay, and explicit
`floorImpactContext.resilientLayerDynamicStiffnessMNm3` plus
`floorImpactContext.loadBasisKgM2` now calculates `Ln,w 50.3` and
`DeltaLw 24.3` through
`predictor_heavy_floating_floor_iso12354_annexc_estimate`.

Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Selected Work

Selected action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`

Selected file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`

Selected label:

`post-V1 floor user-material impact context dynamic-stiffness coverage refresh`

## Coverage Refresh Scope

The coverage refresh should re-probe and freeze:

- context-owned custom heavy floating-floor stack:
  `Ln,w 50.3`, `DeltaLw 24.3`;
- runtime basis:
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`;
- metric basis:
  `LnW` and `DeltaLw` both on the same heavy floating-floor formula;
- supported outputs:
  `Ln,w`, `DeltaLw`;
- missing dynamic stiffness or missing load basis:
  keep `needs_input` and do not use a published-family estimate as a
  substitute for `DeltaLw`;
- low-density custom concrete with concrete tags:
  keep outside this heavy-concrete owner, because it is not an eligible
  heavy concrete carrier;
- ASTM `IIC` / `AIIC`, field `L'n,w` / `L'nT,w`, and building impact
  outputs:
  keep outside this owner.

## Expected Counters

Expected refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Implementation State Audit - 2026-06-15

This plan is now implemented as the active no-runtime
coverage-refresh closeout for the floor user-material impact-context
dynamic-stiffness owner.

Implemented and verified:

- Runtime owner contract exists:
  `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`.
- The owner proves the calculator route for a custom visible heavy
  floating-floor stack with explicit `floorRole`s and
  `floorImpactContext.resilientLayerDynamicStiffnessMNm3` /
  `floorImpactContext.loadBasisKgM2`.
- The owner freezes ISO lab impact outputs at `Ln,w 50.3` and
  `DeltaLw 24.3` through
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`.
- The owner keeps missing context inputs at `needs_input` and keeps
  low-density custom concrete outside the heavy concrete carrier route.
- The current calculator gate includes the owner contract.
- The selected coverage-refresh contract file now exists:
  `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`.
- The current gate includes that coverage-refresh contract.
- The post-refresh numeric-gap rerank plan now exists:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md`.

Related but not current:

- `POST_V1_COMPANION_METRIC_COMPLETENESS_BUG_PLAN_2026-06-12.md`
  is locally implemented and validated. It does not override this active
  calculator lane.

## Calculator Scope Fit

This is calculator-engine scope, not UI or UX work.

The closed owner expands dynamic calculator coverage for this lane:

- Layer family:
  `floor.user_material_impact_context_dynamic_stiffness_owner`.
- Assembly shape:
  custom visible floating floor over a heavy concrete base, using
  explicit floor roles:
  `floor_covering / floating_screed / resilient_layer / base_structure`.
- Required runtime inputs:
  `floorImpactContext.resilientLayerDynamicStiffnessMNm3` and
  `floorImpactContext.loadBasisKgM2`.
- Target outputs:
  ISO lab impact `Ln,w` and `DeltaLw`.
- Formula route:
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`.

The coverage refresh must protect that calculator behavior without
moving new runtime values, importing source rows, retuning formulas, or
touching frontend implementation files.

## Landed Status

Landed action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`

Landed file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`

Landed status:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

The refresh re-probes the context-owned custom visible heavy
floating-floor stack at `Ln,w 50.3` and `DeltaLw 24.3`, preserves the
`predictor_heavy_floating_floor_iso12354_annexc_estimate` basis, keeps
missing `resilientLayerDynamicStiffnessMNm3` or `loadBasisKgM2` at
`needs_input`, keeps low-density custom concrete outside this
historical heavy-concrete owner, and keeps ASTM/IIC/AIIC plus
field/building impact outputs outside this owner.
Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md`

Selected next label:

`post-V1 next numeric coverage gap after floor user-material impact context dynamic stiffness`

## Contract Added

Added:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`

Use the recent coverage-refresh contract shape from:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`

The contract should carry these lifecycle constants:

- Previous rerank action:
  `post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`.
- Previous rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`.
- Previous rerank status:
  `post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`.
- Previous owner action:
  `post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`.
- Previous owner file:
  `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`.
- Previous owner status:
  `post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`.
- Coverage-refresh action:
  `post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`.
- Coverage-refresh file:
  `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`.
- Coverage-refresh status:
  `post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.

Recommended selected next after this refresh lands:

- Selected next action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`.
- Selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`.
- Selected next plan doc:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md`.
- Selected next label:
  `post-V1 next numeric coverage gap after floor user-material impact context dynamic stiffness`.

Expected counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved: 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Required Coverage Assertions

The coverage-refresh contract should re-probe and freeze these runtime
boundaries:

1. Happy path custom floor stack:
   - custom tile covering, custom floating screed, custom resilient
     layer, and custom heavy concrete base.
   - `floorImpactContext.loadBasisKgM2: 76`.
   - `floorImpactContext.resilientLayerDynamicStiffnessMNm3: 30`.
   - outputs `Ln,w 50.3` and `DeltaLw 24.3`.
   - answer basis and metric basis:
     `predictor_heavy_floating_floor_iso12354_annexc_estimate`.
   - supported outputs include exactly the owner lane outputs:
     `Ln,w` and `DeltaLw`.

2. Missing dynamic stiffness only:
   - keep `floorImpactContext.loadBasisKgM2`.
   - omit `resilientLayerDynamicStiffnessMNm3`.
   - no impact result is produced.
   - unsupported outputs remain `Ln,w` and `DeltaLw`.
   - answer boundary origin is `needs_input`.
   - missing input includes `resilientLayerDynamicStiffnessMNm3`.

3. Missing load basis only:
   - keep `floorImpactContext.resilientLayerDynamicStiffnessMNm3`.
   - omit `loadBasisKgM2`.
   - no impact result is produced.
   - unsupported outputs remain `Ln,w` and `DeltaLw`.
   - answer boundary origin is `needs_input`.
   - missing input includes `loadBasisKgM2`.

4. Missing both dynamic stiffness and load basis:
   - preserve the owner boundary.
   - missing inputs include both
     `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`.

5. Low-density custom concrete carrier:
   - even with full impact context, keep this historical heavy-concrete
     route unsupported.
   - do not silently treat low-density custom concrete as a heavy base.

6. Out-of-scope output families:
   - ASTM/IIC/AIIC outputs remain outside this owner.
   - field/building normalized impact outputs remain outside this
     owner.
   - no source import, formula retune, or frontend implementation change
     is allowed in this refresh.

7. Documentation and gate synchronization:
   - this plan, `DOCUMENTATION_MAP.md`,
     `CALCULATOR_SOURCE_OF_TRUTH.md`, `CURRENT_STATE.md`,
     `NEXT_AGENT_BRIEF.md`, `NEXT_IMPLEMENTATION_PLAN.md`,
     `SYSTEM_MAP.md`, and `AGENTS.md` must agree on the landed
     coverage-refresh status and the selected next rerank.
   - `tools/dev/run-calculator-current-gate.ts` must include the new
     coverage-refresh contract after implementation.

## Implementation Order

1. Add the coverage-refresh contract using the owner fixtures as the
   runtime source of truth.
2. Run the focused engine validation:
   `pnpm exec vitest run src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts --maxWorkers=1`
   from `packages/engine`.
3. Add the coverage-refresh contract to
   `tools/dev/run-calculator-current-gate.ts`.
4. Create the selected-next rerank plan doc:
   `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md`.
5. Synchronize the active docs listed above from
   `selected coverage refresh` to
   `coverage refresh landed, selected next numeric-gap rerank`.
6. Run `pnpm calculator:gate:current`.
7. Run `git diff --check`.

## Out Of Scope

Do not use this refresh to:

- add broad source crawls,
- import measured source rows,
- retune the heavy floating-floor formula,
- change UI/workbench behavior,
- add material editor controls,
- claim ASTM/IIC/AIIC coverage,
- claim field or building impact prediction coverage,
- select a new runtime owner before this coverage refresh lands.
