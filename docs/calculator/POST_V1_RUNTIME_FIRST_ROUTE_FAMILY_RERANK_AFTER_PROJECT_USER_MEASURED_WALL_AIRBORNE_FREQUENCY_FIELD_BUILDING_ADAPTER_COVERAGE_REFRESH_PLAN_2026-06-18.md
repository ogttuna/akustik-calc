# Post-V1 Runtime-First Route-Family Rerank After Project/User Measured Wall Airborne Frequency Field/Building Adapter Coverage Refresh Plan - 2026-06-18

## Purpose

This is the selected no-runtime rerank after
`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`.

The previous owner and coverage refresh closed the project/user
measured wall airborne frequency chain for exact and compatible
near-measured wall field/building outputs. The next step is not another
measured-frequency patch by default. It is a runtime-first rerank across
the highest-ROI calculator families, with closed-chain subtraction so
agents do not loop on the same completed route.

## Follows

Previous coverage refresh:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`

Previous coverage refresh plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Previous coverage refresh status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Previous selected candidate:

`project_user_measured_wall_airborne_frequency_field_building_adapter_owner`

Previous owner:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts`

Previous owner status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

Current selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`

Current selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`

Current selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Current selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building adapter coverage refresh`

Coverage refresh counters carried into this rerank: `coverageRefreshContractFilesTouched: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Applied Rerank Result

Rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_advanced_wall_source_absent_field_building_adapter_owner`

Selected candidate:

`wall.advanced_wall_source_absent_field_building_adapter_owner`

Selected next action:

`post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan`

Selected next file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`

Selected next label:

`post-V1 wall advanced-wall source-absent field/building adapter owner`

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextCalculableTargetOutputs: 10`,
`estimatedNextRequiredPhysicalInputsCaptured: 10`,
`estimatedNextRuntimeBasisPromotions: 2`,
`estimatedNextRuntimeValuesMoved: 10`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

The selected owner is the bounded user-material/building-prediction
slice: Gate AY already owns a complete advanced-wall source-absent
direct TL curve for lab `Rw`, `STC`, `C`, and `Ctr`, while complete
field/building requests are still parked to avoid lab aliasing. The next
runtime owner should feed that owned direct curve through Gate I / Gate
AR only when explicit room, area, and flanking context exists.

## Rerank Scope

The rerank must compare calculator work that can improve one or more of:

- calculable user-entered wall/floor/ceiling/opening layer combinations;
- numeric accuracy or error-budget ownership;
- field/building/flanking prediction scope;
- frequency-band backbone or companion derivation from owned curves;
- route-required physical input capture;
- metric/basis integrity and unsupported/needs-input boundaries.

The rerank must reject:

- broad source crawling;
- UI/report work without calculator route movement;
- confidence wording or process cleanup;
- scalar metric aliasing;
- lab-to-field/building copying without an owned adapter;
- opening new runtime without named formula/anchor/source evidence.

## Closed-Chain Subtraction

Treat these as already closed for the purpose of selecting the next
runtime owner unless a new request shape or metric basis is explicitly
identified:

- project/user measured wall scalar `Rw` exact bridge;
- project/user measured wall airborne frequency exact curve bridge;
- project/user measured wall airborne frequency compatible exterior-board
  delta;
- project/user measured wall airborne frequency Gate I / Gate AR
  field/building adapter;
- wall compatible-anchor A-weighted field/building chain;
- wall user-material formula companion, basis-integrity, and
  target-output-independence chains;
- floor low-density exact ASTM lab-airborne / impact target-output
  independence chains.

## Candidate Families To Compare

1. `user_material_physical_input_coverage`
   - Candidate value: arbitrary layer combinations.
   - Required proof: explicit topology, support, absorber, stiffness,
     load, and material physical inputs.
   - No-go: guessed topology or name-based shortcuts.

2. `building_prediction_flanking_runtime`
   - Candidate value: `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`,
     `L'n,w`, and `L'nT,w`.
   - Required proof: direct curve, room/area normalization, junction or
     flanking path ownership, and output basis.
   - No-go: lab metric copies.

3. `frequency_band_backbone_narrow_route`
   - Candidate value: deriving scalar metrics from one-third-octave
     curves instead of patches.
   - Required proof: one route already owns a curve and rating adapter.
   - No-go: global rewrite before moving a bounded request shape.

4. `companion_metric_completeness`
   - Candidate value: expose hidden `Rw`, `STC`, `C`, `Ctr`, `OITC`,
     `Ln,w`, or IIC companions from already-owned spectra.
   - Required proof: owned spectrum/rating basis.
   - No-go: scalar-only or single-number source aliases.

5. `calibration_holdout_packet`
   - Candidate value: tighter error budgets and formula accuracy.
   - Required proof: rights-safe, same-family, same-basis evidence.
   - No-go: broad source crawl.

6. `opening_leak_common_wall_open_box_open_web_residuals`
   - Candidate value: named current residual families likely to unlock
     real user constructions.
   - Required proof: owned formula, exact row, compatible anchor, or
     same-basis holdout path.
   - No-go: applying near-miss rows without boundary proof.

## Expected Rerank Contract

Create:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`

The contract should:

1. assert the previous coverage refresh landed no-runtime;
2. subtract closed measured-frequency chains;
3. evaluate at least six candidate families;
4. record rejected-candidate reasons;
5. select exactly one next owner or a no-runtime evidence packet;
6. create or name the selected owner plan doc;
7. keep counters explicit: `candidateCount`, `roiAnalysisIterations`,
   estimated runtime movement, `runtimeValuesMoved 0`,
   `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
   `frontendImplementationFilesTouched: 0`.

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts --maxWorkers=1
git diff --check
```
