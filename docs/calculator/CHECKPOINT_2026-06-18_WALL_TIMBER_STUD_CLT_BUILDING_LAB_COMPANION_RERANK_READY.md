# Checkpoint - Wall Timber-Stud + CLT Building Lab-Companion Rerank Ready - 2026-06-18

## Purpose

This checkpoint reconciles the current calculator documentation,
implementation, plan, and validation state after the wall timber-stud +
CLT formula building lab-companion basis integrity coverage refresh.

DynEcho remains calculator-first. The active work must improve
calculable layer combinations, numeric accuracy, formula-route
ownership, route-required input capture, metric/basis integrity, or a
boundary that protects those properties. This checkpoint does not select
UI polish, report-assistant work, broad source crawling, generic
refactoring, or confidence wording.

## Current Landed State

Latest landed no-runtime coverage refresh:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

It follows runtime owner:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-owner-contract.test.ts`

Owner status:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

Previous rerank:

`post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-contract.test.ts`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner`

Selected candidate re-probed:

`wall.timber_stud_clt_formula_building_lab_companion_basis_integrity_owner`

Coverage counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Implementation Reconciliation

Runtime implementation in `packages/engine/src/calculate-assembly.ts`
matches the docs and owner contracts:

- complete generated timber-stud `building_prediction` requests keep
  Gate AR building values while publishing direct lab companions
  `Rw 50`, `STC 50`, `C 0.5`, and `Ctr -4.2` when requested;
- complete generated CLT `building_prediction` requests keep Gate AR
  building values while publishing direct lab companions `Rw 42`,
  `STC 43`, `C -1.1`, and `Ctr -7.1` when requested;
- timber-stud building outputs remain `R'w 42`, `Dn,w 42`,
  `Dn,A 42.4`, `DnT,w 43`, and `DnT,A 43.9`;
- CLT building outputs remain `R'w 41`, `Dn,w 41`, `Dn,A 39.2`,
  `DnT,w 42`, and `DnT,A 40.7`;
- field and lab contexts stay on their previous field/lab owners;
- exact/source LSF boundaries remain outside this owner;
- missing `buildingPredictionOutputBasis`, ASTM `IIC` / `AIIC`, and
  impact `Ln,w` / `DeltaLw` stay `needs_input` or `unsupported`
  instead of being aliased into supported outputs.

The current gate runner includes both the runtime owner and coverage
refresh contracts. The selected next rerank file is intentionally not
created yet; it is the next implementation artifact.

## Plan Review

Current selected next action:

`post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_plan`

Current selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-contract.test.ts`

Current selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-18.md`

Current selected next label:

`post-V1 runtime-first route-family rerank after wall timber-stud + CLT formula building lab-companion basis integrity`

The plan remains valid. It subtracts closed floor and wall chains,
requires candidate comparison before another owner, rejects metric
aliasing and missing-input defaulting, and only allows internet research
if local evidence cannot prove the formula or measured-anchor basis.
Local implementation and contract evidence is sufficient for this
checkpoint; no web evidence is needed to keep the selected rerank.

## Open Gaps

- The next runtime owner has not been selected yet; the rerank must
  compare route families and name the selected candidate, target
  outputs, formula or anchor basis, required physical inputs, and
  unsupported boundaries.
- Broader arbitrary layer coverage still depends on future runtime
  owners, especially wall openings/leaks, common-wall residuals,
  timber/open-web floor residuals, and bounded formula retuning where
  measured evidence exists.
- There is a separate dirty web/report-assistant/workbench worktree.
  It is outside this calculator checkpoint and should not be mixed into
  calculator commits unless explicitly reviewed as its own slice.

## Validation

Checkpoint validation passed on 2026-06-18:

- targeted Vitest for owner, coverage refresh, and adjacent rerank:
  `3` files passed, `14` tests passed;
- `pnpm calculator:gate:current`: engine focused gate passed with
  `766` files and `4200` tests; web focused gate passed with `127`
  files and `505` tests, with `18` skipped; repo build passed with
  `5` successful tasks; whitespace guard passed;
- build warnings were limited to the known optional `sharp/@img`
  package warnings through `@turbodocx/html-to-docx`;
- web test stderr was limited to the known unavailable
  `dynecho-workbench-store` persistence warning in the test
  environment;
- scoped git status review keeps non-calculator web/report-assistant,
  PDF, output, and workspace artifacts outside the calculator
  checkpoint commit.

Run `git diff --check` immediately before the checkpoint commit.
