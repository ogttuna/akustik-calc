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

Result: failed before completion of a green checkpoint because of
separate dirty resolver/candidate-surface changes outside this slice.
The failing groups were around:

- `layer-combination-resolver-registry-contract.test.ts`
- `layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh-contract.test.ts`
- `layer-combination-resolver-company-internal-v0-rehearsal-contract.test.ts`
- several `post-v1-floor-* family solver owner` resolver mapping
  contracts
- `post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts`

Those failures correlate with unrelated dirty files such as
`packages/engine/src/layer-combination-resolver-registry.ts`,
`packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts`,
`packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`,
`packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts`,
and `tools/dev/run-calculator-current-gate.ts`. They should be resolved
or committed by the owner of that resolver slice before treating the
whole worktree as gate-green.

## Stop/Commit Posture

This checkpoint is a good bounded stopping point for the measured
frequency calculator chain because:

- runtime movement is covered by owner tests;
- no-runtime coverage refresh is landed;
- docs point to a no-runtime rerank, not another implicit runtime owner;
- the next work is selected by ROI rerank rather than by re-opening the
  closed target-output slice.

Commit only the measured-frequency chain and live calculator docs. Do
not include parallel web, resolver registry, candidate-surface, PDF,
or generated-output changes in the checkpoint commit.
