# Checkpoint - Project/User Measured Wall Airborne Frequency Target-Output Coverage - 2026-06-18

## Scope

This checkpoint covers the project/user measured wall airborne frequency
chain through field/building lab-companion target-output independence
and its no-runtime coverage refresh.

Calculator goal relevance:

- exact measured frequency curves remain first;
- compatible exterior-board measured-frequency deltas remain bounded;
- field/building outputs stay on Gate I / Gate AR context adapters;
- lab companions `Rw`, `STC`, `C`, and `Ctr` are now target-output
  independent only when the measured-frequency lab basis and complete
  field/building context are both owned;
- missing context and impact metrics still fail closed.

## Landed Runtime

Latest landed runtime owner:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_plan`

Runtime owner contract:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts`

Runtime implementation:

`packages/engine/src/calculate-assembly.ts`

The runtime now supports exact and compatible measured-frequency
field/building lab-only requests for:

- `Rw`
- `STC`
- `C`
- `Ctr`

It does not retune formulas, import source rows, touch frontend files,
or alias lab metrics into field/building metrics.

## Landed Coverage Refresh

Latest landed no-runtime coverage refresh:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

Coverage refresh contract:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Current Selected Next

Current selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

Current selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

That contract file is intentionally not landed in this checkpoint. It is
the expected first file for the next no-runtime rerank slice.

Current selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

The selected next action is a no-runtime rerank. It should subtract the
closed measured-frequency chain and compare the high-ROI streams:
user-material physical input coverage, building/flanking runtime,
frequency-band backbone, companion metric completeness,
calibration/holdouts, and residual families such as opening/leak or
common-wall only when same-basis evidence exists.

## Validation

Green targeted validation:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts \
  src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts \
  src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts \
  src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts \
  src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts \
  --maxWorkers=1 --reporter=basic
```

Result: 5 files / 24 tests passed.

Tracked whitespace check:

```bash
git diff --check
```

Result: passed.

Full current gate:

```bash
pnpm calculator:gate:current
```

Result after resolver/candidate-surface reconciliation:

- shared project/user measured anchor schema gate: 2 files / 19 tests
  passed;
- engine calculator final-audit focused gate: 775 files / 4246 tests
  passed;
- web calculator final-audit focused gate: 127 files / 505 tests passed,
  18 skipped;
- repo build initially exposed a TypeScript DTS issue in the dirty
  advanced-wall source-absent field/building adapter path, where
  `advancedWall.targetOutputs` was readonly. The follow-up type-only
  fix made the lookup context use a mutable `RequestedOutputId[]`.

Additional validation after the type-only fix:

```bash
pnpm build
```

Result: 5 packages built successfully. The only warnings were the known
optional `sharp/@img` package warnings from the DOCX/PDF dependency
chain.

Resolver reconciliation detail:

- `project_user_measured_wall_airborne_frequency_compatible_delta_owner`
  is now counted as a first-class active runtime candidate;
- resolver totals are now `candidateCount: 50` and
  `activeRuntimeCandidateCount: 47`;
- `element_lab`, `similarity_anchor`, and `wall` registry buckets each
  moved by +1;
- company-internal V0 classifies the compatible-delta candidate as
  `allowed_with_budget`;
- no runtime formula retune or source crawl was introduced by the
  alignment fix.

## Stop/Commit Posture

This checkpoint is a good bounded stopping point for the measured
frequency calculator chain and resolver-surface reconciliation because:

- runtime movement is covered by owner tests;
- no-runtime coverage refresh is landed;
- resolver registry, candidate surface, company-internal V0, and older
  resolver snapshot contracts now agree on the 50/47 candidate surface;
- tests and build are green after the type-only advanced-wall DTS fix;
- docs point to a no-runtime rerank, not another implicit runtime owner;
- the next work is selected by ROI rerank rather than by re-opening the
  closed target-output slice.

Commit only coherent calculator engine/shared/docs/current-gate files
from this reconciliation. Do not include parallel report-assistant,
Workbench V2 preset-library, PDF, generated-output, or unrelated UI
changes in the checkpoint commit.
