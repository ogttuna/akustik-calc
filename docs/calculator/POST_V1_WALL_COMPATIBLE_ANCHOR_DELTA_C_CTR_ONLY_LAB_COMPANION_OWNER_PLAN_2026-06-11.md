# Post-V1 Wall Compatible Anchor-Delta C/Ctr-Only Lab Companion Owner Plan - 2026-06-11

Document role: selected value-moving calculator slice after the STC-only
lab companion coverage refresh. This is not a broad source crawl, source
row catalog, UI polish task, or formula retune. It exists to let the
calculator answer more valid target-output requests from the already
owned compatible anchor-delta shifted curve.

Plan doc path:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md`.

## Dependency

Previous surface parity:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan`.

Previous surface parity file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts`.

Previous surface parity status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.

Coverage refresh:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_plan`.

Coverage refresh file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts`.

Coverage refresh status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_landed_no_runtime_selected_c_ctr_only_lab_companion_owner`.

The refresh freezes paired exterior-board `STC 59` and one-side
exterior-board `STC 57` for Knauf `416889` compatible anchor-delta
STC-only element-lab requests through
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
It keeps the candidate `ready_with_budget` / `allowed_with_budget`, moves
no runtime values, imports no source rows, retunes no formula, and is not
a broad source crawl. Closeout counters:
`coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableRequestShapes: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

## Selected Next

Selected next action:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_plan`.

Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`.

Selected next label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion owner`.

Owner status:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_landed_runtime_selected_surface_parity`.

## Iteration 1 - Current Runtime Evidence

The mixed lab companion route already calculates C and Ctr values from
the owned shifted direct transmission-loss curve:

- paired exterior-board Knauf `416889` mixed `Rw+STC/C/Ctr` element-lab:
  `Rw 59 / STC 59 / C -1.1 / Ctr -6`;
- one-side exterior-board Knauf `416889` mixed `Rw+STC/C/Ctr`
  element-lab: `Rw 57 / STC 57 / C -0.6 / Ctr -5.5`;
- selected candidate:
  `wall.compatible_anchor_delta.calculated_lab_companions`;
- runtime basis:
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.

At selection time, standalone C-only and Ctr-only requests were still
unsupported even when the same stack, context, and route-required inputs
were present. That was a scope gap in the calculator output selection,
not a missing source-row problem; the landed owner below closes it.

## Iteration 2 - Product ROI

This owner should open only standalone element-lab C and Ctr requests
whose values are already calculated by the owned mixed lab companion
route:

- paired C-only -> `C -1.1`;
- paired Ctr-only -> `Ctr -6`;
- one-side C-only -> `C -0.6`;
- one-side Ctr-only -> `Ctr -5.5`.

Expected movement:
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

This is higher ROI than source crawling because it turns already-owned
calculated values into usable calculator outputs without claiming new
measurement evidence.

## Iteration 3 - Boundaries

Do not broaden the owner beyond the route that is already proven:

- no measured C/Ctr claim; C and Ctr remain calculated companion metrics
  with visible budget;
- direct single `Rw` remains on
  `wall.compatible_anchor_delta.extra_board_on_verified_lsf`;
- STC-only remains on the already-landed STC-only companion owner;
- mixed `Rw+STC/C/Ctr` remains on the existing lab companion route;
- field/building, A-weighted, ASTM/IIC/AIIC, non-selected-anchor, and
  missing-input rows remain outside this owner;
- non-Knauf rows remain unsupported until separately evidenced.

If a future slice wants `C+Ctr` together without `Rw` or `STC`, it should
either be explicitly included in this owner contract with the same
boundary proof or selected as a separate small owner. The initial target
is the four single-metric standalone request shapes above.

## Implementation Steps

1. Add
   `packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`
   to pin paired and one-side C-only/Ctr-only outputs and boundaries.
2. Extend the compatible anchor-delta lab companion request predicate so
   the four standalone C/Ctr request shapes select
   `wall.compatible_anchor_delta.calculated_lab_companions`.
3. Keep value pins scoped to only the requested metric: `C` or `Ctr`.
4. Preserve existing direct `Rw`, STC-only, mixed lab, field/building,
   A-weighted, ASTM/IIC/AIIC, missing-input, and non-Knauf tests.
5. Update current-gate and living docs after the owner lands.

Expected follow-up after owner:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`.

Follow-up plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.

Follow-up label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion surface parity`.

## Landed Outcome

The owner landed runtime. Standalone element-lab C-only and Ctr-only
requests now calculate through
`wall.compatible_anchor_delta.calculated_lab_companions` on runtime basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`:
paired `C -1.1`, paired `Ctr -6`, one-side `C -0.6`, and one-side
`Ctr -5.5`. These are calculated companion values, not measured C/Ctr
source evidence.

Landed counters: `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 2`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next action:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_plan`.

Selected next file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`.

Selected next plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.

Selected next label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion surface parity`.

Historical selected next after that surface parity:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion coverage refresh`.
