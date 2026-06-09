# Post-V1 Gate FB/FC Opening Leak Common Wall Owner Closeout And Next Numeric Gap Plan - 2026-06-09

Status: Gate FB landed no-runtime, owner rejected, and selected Gate FC.

Gate FB landed gate:
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`

Gate FB status:
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fc`

Gate FB owner decision:
`wall.opening_leak_common_wall.same_basis_residual_owner_rejected_missing_holdouts`

Selected next action:
`post_v1_next_numeric_coverage_gap_gate_fc_plan`

Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts`

Gate FC landed status:
`post_v1_next_numeric_coverage_gap_gate_fc_landed_no_runtime_selected_floor_raw_bare_and_floating_same_basis_holdout_gate_fd`

Gate FC selected candidate:
`floor.raw_bare_and_floating_same_basis_holdout_prerequisite_after_gate_fb`

Gate FC selected next action:
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan`

Gate FC selected next file:
`packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts`

## Purpose

Gate FB closes the Gate FA selected opening/leak and common-wall
same-basis residual owner proof. It does not move runtime values because
the current implementation and Gate CL residual ledgers show that
source-owned same-basis holdouts are absent for opening/leak field,
opening/leak building, opening/leak A-weighted, and common-wall building
residuals.

This is an engine protection step, not a product detour: it prevents a
false accuracy improvement where source-absent budgets would be tightened
without calibration evidence. Since the owner is rejected, the next step
must stop spending effort on this blocked budget-tightening path and
rerank the current implementation for a safe calculator slice: a
value-moving runtime action if evidence supports one, otherwise the
smallest bounded prerequisite that can unlock future accuracy.

## Gate FB Closeout

Gate FB freezes the current opening/leak values and budgets:

- field runtime remains `R'w 36.4`, `Dn,w 36.7`, `DnT,w 36.9` with
  budget `8`;
- building runtime remains `R'w 31.6`, `DnT,w 32.1` with budget `10`;
- A-weighted field runtime remains `Dn,A 35.9`, `DnT,A 36.1` with
  budget `9`;
- A-weighted building runtime remains `DnT,A 31.3` with budget `11`;
- Gate CJ common-wall building pins remain unchanged.

Gate FB rejects runtime budget tightening because same-basis holdouts
are absent. Lab Rw/STC rows do not calibrate field/building/A-weighted
residuals, field rows do not calibrate building prediction, building
prediction rows do not calibrate field apparent output, and A-weighted
rows require the explicit owned frequency-band basis.

## Counters

- `ownerLedgersRejected 5`
- `sameBasisHoldoutLedgersMissing 5`
- `boundaryLedgersPinned 7`
- `runtimeBudgetTighteningAdmitted 0`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions 0`
- `runtimeFormulaRetunes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Gate FC Outcome

Gate FC has landed as
`post_v1_next_numeric_coverage_gap_gate_fc_plan`. It does not move
runtime values. It selected
`floor.raw_bare_and_floating_same_basis_holdout_prerequisite_after_gate_fb`
after two ROI plan iterations (`roiAnalysisIterations: 2`).

Gate FC reranked current engine gaps after Gate FB and selected the
highest-ROI calculator slice that can improve future accuracy without
weakening metric/basis or `needs_input` / `unsupported` boundaries.

Gate FC did not reselect opening/leak or common-wall budget tightening
because Gate FB rejected that owner. It also kept heavy-core
lined-massive retune blocked, and treated direct-fixed,
reinforced-concrete visible-derived, thick-board safety, ASTM exact-band,
and steel visible input-surface work as closed repeats. No safe
immediate value-moving runtime candidate remains from current evidence,
so Gate FC selected Gate FD, a bounded targeted same-basis holdout
prerequisite for floor raw-bare/floating residual accuracy. This is not
a broad source crawl.

Gate FC counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`blockedByGateFBOwnerRejectionRows 2`,
`blockedHeavyCoreOwnerRejectedRows 1`, `closedRepeatRows 5`,
`estimatedNextTargetedHoldoutLedgers 3`,
`floorResidualLedgersSelected 3`, `immediateRuntimeCandidatesSelected
0`, `broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Gate FD work order:
`packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts`.

Gate FC/FD plan:
`docs/calculator/POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md`.

## Validation Plan

- `pnpm -C packages/engine exec vitest run src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts --maxWorkers=1`
- `pnpm -C packages/engine exec vitest run src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Gate FC validation must include a focused test that proves the selected
candidate is not the rejected Gate FB opening/leak/common-wall residual
budget tightening path.
