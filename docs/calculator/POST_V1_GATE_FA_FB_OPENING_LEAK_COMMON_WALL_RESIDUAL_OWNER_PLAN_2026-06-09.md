# Post-V1 Gate FA/FB Opening Leak Common Wall Residual Owner Plan - 2026-06-09

Status: Gate FA landed no-runtime and selected Gate FB.

Update: Gate FB has landed no-runtime, owner rejected, and selected Gate
FC. Current follow-up plan:
`docs/calculator/POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md`.

Gate FA landed gate:
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan`

Gate FA status:
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_landed_no_runtime_selected_opening_leak_common_wall_same_basis_residual_owner_gate_fb`

Selected Gate FA gap:
`wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`

Selected next action:
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`

Selected next file:
`packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts`

Gate FB landed gate:
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`

Gate FB status:
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fc`

Gate FB owner rejected:
`wall.opening_leak_common_wall.same_basis_residual_owner_rejected_missing_holdouts`

Gate FB selected next action:
`post_v1_next_numeric_coverage_gap_gate_fc_plan`

Gate FB selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts`

## Purpose

Gate FA closes the fresh current coverage/accuracy gap ledger after Gate
EZ. It re-read the current implementation instead of continuing from a
stale candidate list. The heavy-core / lined-massive owner is still
rejected after Gate EY, so that route remains blocked and its runtime
values stay frozen.

The highest-ROI current accuracy gap is now the opening/leak and common
wall residual owner boundary. Opening/leak field, building, and
A-weighted runtime rows are live, but their source-absent budgets are
still intentionally wide. Gate CL also recorded no same-basis holdouts
for the opening/leak field/building residual and the common wall
building-prediction residual. Gate FB must prove a same-basis residual
owner before any budget tightening or runtime value movement.

## Gate FA Ledger

Gate FA selected:

- `wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`
  as the only selected owner gap;
- Gate FB as the next no-runtime owner proof;
- opening/leak field/building/A-weighted and common wall budget
  tightening as runtime candidates only after the owner proof;
- floor raw-bare/floating holdouts as later candidates, not the current
  highest ROI action;
- heavy-core / lined-massive as still blocked by the rejected owner;
- direct-fixed field/building, reinforced-concrete visible-derived,
  thick-board Auto family safety, ASTM exact-band, and steel visible
  formula-surface entries as closed repeats;
- broad source crawling, confidence wording, finite scenario packs, and
  frontend polish as non-goals for this slice.

## Counters

- `ledgerRows 11`
- `candidateCount 11`
- `ownerGapRows 1`
- `runtimeCandidateRowsHeldBehindOwner 2`
- `closedRepeatRows 5`
- `blockedHeavyCoreOwnerRejectedRows 1`
- `blockedNonGoalRows 1`
- `estimatedNextOwnerLedgers 1`
- `estimatedNextRuntimeCandidateFamiliesAfterOwner 2`
- `estimatedNextBoundaryLedgers 3`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions 0`
- `runtimeFormulaRetunes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Gate FB Work Order

Create:
`packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts`.

Gate FB must:

- prove whether a same-basis residual owner exists for the current
  opening/leak field/building/A-weighted and common wall residual rows;
- keep source-absent runtime values frozen until that owner proof passes;
- preserve exact-source precedence before residual or formula routes;
- keep lab, field, building-prediction, and A-weighted basis boundaries
  separate;
- keep missing opening/leak physical inputs as `needs_input`;
- keep unsupported lab aliases, ASTM aliases, and unsupported
  A-weighted metric/basis requests as `unsupported`;
- import no broad source rows and avoid finite scenario-library work;
- move no runtime values during Gate FB unless a later selected runtime
  gate explicitly proves and owns the value movement.

## Stop Conditions

Do not continue into runtime budget tightening if Gate FB cannot name a
same-basis residual owner, if it needs cross-basis borrowing, if it
would alias lab values to field/building/A-weighted outputs, or if it
would weaken any `needs_input` / `unsupported` boundary.

## Validation Plan

Gate FA focused validation must run:

- `pnpm -C packages/engine exec vitest run src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts --maxWorkers=1`
- `pnpm -C packages/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Gate FB must add focused tests before any runtime value movement so a
failure immediately shows whether the owner proof, basis boundary, or
missing-input boundary regressed.

## Gate FB Closeout

Gate FB rejected runtime budget tightening for
`wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`
because source-owned same-basis holdouts are absent for opening/leak
field, opening/leak building, opening/leak A-weighted, and common wall
building residuals. This is an owner rejected closeout, not a runtime
move.

Frozen runtime budgets:

- opening/leak field budget `8`;
- opening/leak building budget `10`;
- opening/leak A-weighted field budget `9`;
- opening/leak A-weighted building budget `11`.

Gate FB counters: `ownerLedgersRejected 5`,
`sameBasisHoldoutLedgersMissing 5`, `boundaryLedgersPinned 7`,
`runtimeBudgetTighteningAdmitted 0`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Gate FB selected Gate FC:
`post_v1_next_numeric_coverage_gap_gate_fc_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts`.
