# Post-V1 Wall Compatible Anchor-Delta STC-Only Lab Companion Surface Parity Plan - 2026-06-11

Document role: selected calculator-surface follow-up after the
STC-only lab companion owner. This is not broad UI polish; it verifies
that the newly calculable STC-only route is visible and consistently
labelled anywhere the calculator result is surfaced.

Plan doc path:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.

## Dependency

Previous closeout:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`.

Previous closeout file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.

Previous closeout status:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_landed_no_runtime_selected_stc_only_lab_companion_owner`.

Runtime owner:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan`.

Runtime owner file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`.

Runtime owner status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_landed_runtime_selected_surface_parity`.

The owner opens paired exterior-board `STC 59` and one-side exterior-board
`STC 57` for Knauf `416889` compatible anchor-delta element-lab
STC-only requests through
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
It is value-moving: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Selected Next

Selected next action:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan`.

Selected next file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts`.

Selected next label:
`post-V1 wall compatible anchor-delta STC-only lab companion surface parity`.

## Iteration 1 - Surface Scope

The engine now answers the two STC-only request shapes, but the user sees
the calculator through the workbench, API payloads, saved/server replay,
cards, target-output status, and report summaries. Surface parity is
therefore useful only if it proves those surfaces expose the existing
runtime result without changing formulas.

Expected visible values:

- paired exterior-board Knauf `416889`: `STC 59`;
- one-side exterior-board Knauf `416889`: `STC 57`;
- runtime candidate:
  `wall.compatible_anchor_delta.calculated_lab_companions`;
- runtime basis:
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.

## Iteration 2 - Boundaries

The surface must not broaden the runtime:

- direct single `Rw` remains on
  `wall.compatible_anchor_delta.extra_board_on_verified_lsf`;
- mixed `Rw+STC/C/Ctr` remains on the existing calculated lab companion
  route;
- C-only and Ctr-only remain unsupported until a separate owner exists;
- field/building, A-weighted, ASTM/IIC/AIIC, missing-input, and
  non-Knauf requests remain outside this owner;
- no source rows are imported and no formulas are retuned.

## Iteration 3 - Work Order

1. Add
   `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts`.
2. Reuse existing workbench fixture patterns from the compatible
   anchor-delta lab companion and A-weighted surface parity contracts.
3. Assert live calculation, calculator API payload, saved replay, server
   snapshot replay, output cards, target-output status, and report
   summaries align on `STC 59` / `STC 57`.
4. Keep runtime untouched unless the surface proves the supported STC
   output is hidden or incorrectly labelled.

Expected counters for the surface parity closeout:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
