# Post-V1 Wall Timber-Stud + CLT Formula Building Lab-Companion Basis Integrity Owner - 2026-06-17

## Purpose

This is the selected runtime accuracy owner after the runtime-first
route-family rerank that followed the wall timber-stud + CLT formula
field lab-companion target-output independence coverage refresh.

The owner fixes a calculator metric/basis integrity bug for generated
timber-stud and CLT wall formula routes under complete
`building_prediction` context. Building outputs are already physically
owned by Gate AR from an owned direct curve plus explicit flanking,
junction, room, and output-basis inputs. However, when users request
lab companions such as `Rw`, `STC`, `C`, or `Ctr` in the same
building request, those lab outputs can currently be parked when
requested alone or filled from the building-adapter basis when mixed
with `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, or `DnT,A`.

The fix must keep building outputs on Gate AR and publish lab
companions only from the same direct formula lab curve. This is not a
source crawl, formula retune, UI pass, confidence-labeling pass, or
generic cleanup.

Owner action:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-owner-contract.test.ts`

Owner plan doc:

`docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-17.md`

## Previous Rerank

Rerank action:

`post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_plan`

Rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-contract.test.ts`

Rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md`

Rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner`

Selected candidate:

`wall.timber_stud_clt_formula_building_lab_companion_basis_integrity_owner`

Rerank counters: `candidateCount: 9`, `roiAnalysisIterations: 4`,
`estimatedNextAccuracyPromotedRequestShapes: 4`,
`estimatedNextAccuracyPromotedTargetOutputs: 8`,
`estimatedNextNewCalculableRequestShapes: 2`,
`estimatedNextNewCalculableTargetOutputs: 8`,
`estimatedNextRuntimeBasisPromotions: 2`,
`estimatedNextRuntimeValuesMoved: 16`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Runtime Target

Route family:

`wall.timber_stud_clt_formula.building_prediction`

Target output groups:

- lab companions: `Rw`, `STC`, `C`, `Ctr`;
- building outputs: `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`;
- partial and single-output requests such as `Rw`, `C`, `Rw + R'w`,
  and full mixed lab/building requests.

Owned basis:

- timber-stud direct lab curve from the existing timber-stud bounded
  runtime route;
- CLT direct lab curve from the existing CLT / mass-timber formula route
  and its spectrum adapter where applicable;
- Gate AR building-prediction adapter for apparent and standardized
  building values from complete `building_prediction` context.

Required physical inputs:

- `airborneContext.contextMode = building_prediction`;
- `panelWidthMm` and `panelHeightMm` or equivalent partition area;
- `sourceRoomVolumeM3`;
- `receivingRoomVolumeM3`;
- `receivingRoomRt60S`;
- `flankingJunctionClass`;
- `conservativeFlankingAssumption`;
- `junctionCouplingLengthM`;
- `buildingPredictionOutputBasis`;
- timber-stud framed metadata when using the timber-stud generated
  route: `connectionType`, `studType`, and `studSpacingMm`.

## Expected Values

For generated `wall-timber-stud` complete building context:

- lab companions: `Rw 50`, `STC 50`, `C 0.5`, `Ctr -4.2`;
- building values remain `R'w 42`, `Dn,w 42`, `Dn,A 42.4`,
  `DnT,w 43`, and `DnT,A 43.9`.

For generated `wall-clt-local` complete building context:

- lab companions: `Rw 42`, `STC 43`, `C -1.1`, `Ctr -7.1`;
- building values remain `R'w 41`, `Dn,w 41`, `Dn,A 39.2`,
  `DnT,w 42`, and `DnT,A 40.7`.

## Non-Goals And Boundaries

Do not retune the timber-stud, CLT, or Gate AR formulas in this owner.
Do not import source rows. Do not generalize to exact/source LSF rows,
opening-leak common-wall residuals, floors, ASTM/IIC/AIIC aliases, or
impact metrics. Do not publish building outputs when Gate AR required
inputs are missing. Do not make `STC`, `C`, or `Ctr` by scalar aliasing
from building values.

Exact/source rows, compatible anchors, user-material formulas, and
opening-leak routes keep their existing boundaries. If a route lacks a
physically owned direct lab curve or complete building context, return
`needs_input` or `unsupported` instead of borrowing this owner.

## Implementation Steps

1. Add an owner contract for generated timber-stud and CLT
   `building_prediction` requests covering lab-only, single/partial
   lab, mixed lab/building, and building-only target outputs.
2. Add the runtime companion gate in `calculate-assembly.ts` beside the
   existing timber-stud + CLT field lab-companion logic, but scope it to
   Gate AR building basis and the same generated family traces.
3. Keep building outputs and `airborneBasis.method` on
   `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
4. Move only requested lab companion metrics to direct lab formula
   values and move unsupported lab-only building companion outputs to
   supported only when the direct lab values are finite.
5. Preserve missing-input, exact/source, opening-leak, floor, ASTM, and
   impact boundaries.
6. Close the owner by selecting a short coverage refresh.

## Owner Closeout

Owner status:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

Selected next action:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-17.md`

Selected next label:

`post-V1 wall timber-stud + CLT formula building lab-companion basis integrity coverage refresh`

Runtime counters: `accuracyPromotedRequestShapes: 4`,
`accuracyPromotedTargetOutputs: 8`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 8`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 16`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Validation

Run targeted Vitest for:

- `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-contract.test.ts`;
- `packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`;
- the new owner contract.

Then run:

- `pnpm calculator:gate:current`;
- `git diff --check`.
