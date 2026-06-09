# Post-V1 Gate EZ/FA Current Coverage Accuracy Gap Ledger Plan - 2026-06-09

Status: Gate EZ landed no-runtime and selected Gate FA.

Follow-up status: Gate FA has now landed no-runtime and selected Gate FB:
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`
in
`packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts`.
Gate FA status:
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_landed_no_runtime_selected_opening_leak_common_wall_same_basis_residual_owner_gate_fb`.
Gate FA selected:
`wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`.
Gate FA selected a same-basis residual owner proof for opening/leak
field/building/A-weighted rows and the common wall building residual.
Counters: `ledgerRows 11`, `candidateCount 11`, `ownerGapRows 1`,
`runtimeCandidateRowsHeldBehindOwner 2`, `closedRepeatRows 5`,
`blockedHeavyCoreOwnerRejectedRows 1`, `blockedNonGoalRows 1`,
`estimatedNextOwnerLedgers 1`,
`estimatedNextRuntimeCandidateFamiliesAfterOwner 2`,
`estimatedNextBoundaryLedgers 3`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate FA/FB plan:
`docs/calculator/POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md`.

Gate EZ landed gate:
`post_v1_next_numeric_coverage_gap_gate_ez_plan`

Gate EZ status:
`post_v1_next_numeric_coverage_gap_gate_ez_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_fa`

Selected Gate EZ candidate:
`calculator.current_coverage_accuracy_gap_ledger_after_gate_ey_owner_rejection_closeout`

Selected next action:
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan`

Selected next file:
`packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts`

## Purpose

Gate EZ closes the post-Gate-EY numeric coverage/accuracy rerank. Gate
EY found targeted MWI.2A and B226010 evidence, but the heavy-core /
lined-massive owner remains rejected because neither context is runtime-
admissible and no bounded wall lining rule was accepted. Gate EZ
therefore does not reopen the Gate DG `bounded_prediction` values.

The selected next action is Gate FA: a fresh executable current
coverage/accuracy gap ledger. This is calculator work because it reads
the current implementation, subtracts closed or blocked routes, and
selects the next real owner/runtime/boundary candidate from current
evidence before any values move.

## Gate EZ Iteration 1

Gate EZ subtracts:

- heavy-core / lined-massive runtime retune, still blocked after Gate EY;
- broad source crawling or source-row import;
- closed direct-fixed field/building runtime;
- closed ASTM exact-band input surface;
- closed steel visible input surface;
- closed reinforced-concrete visible-derived boundary;
- closed thick-board route-family safety guard;
- closed visible-wall reconciliation repeats.

## Gate EZ Iteration 2

The highest ROI next slice is the current coverage/accuracy gap ledger.
The old Gate EV/EX candidate list is now exhausted or blocked: heavy-
core still lacks an owner, opening/leak holdout tightening needs a
current residual owner, and the other candidates are closed repeats.

Gate FA must re-read the current engine behavior and name the next
calculator slice only if it improves scope or accuracy while preserving
`needs_input` / `unsupported` boundaries.

## Counters

- `candidateCount 10`
- `roiAnalysisIterations: 2`
- `estimatedNextGapLedgers 1`
- `estimatedNextBoundaryLedgers 2`
- `estimatedNextRuntimeCandidateFamiliesToEvaluate 6`
- `heavyCoreLinedMassiveRuntimeStillBlocked true`
- `broadSourceCrawlSelected false`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions 0`
- `runtimeFormulaRetunes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Gate FA Work Order

Create:
`packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts`.

Gate FA must:

- build a current implementation ledger from the active current-gate
  posture, not from stale pre-Gate-EY assumptions;
- keep heavy-core / lined-massive runtime retune blocked unless new
  runtime-admissible wall evidence or a bounded wall lining rule exists;
- classify opening/leak residual and holdout work only if a current
  owner, metric basis, and residual set are named;
- subtract closed direct-fixed, ASTM, steel, reinforced-concrete,
  thick-board, and visible-wall repeats;
- reject broad source crawling, finite scenario packs, confidence
  wording, frontend polish, and catalog work;
- move no runtime values and import no source rows.

## Validation

Focused Gate EZ selection validation passed on 2026-06-09:

- `pnpm -C packages/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts --maxWorkers=1`
  passed 1 file / 5 tests.
- `pnpm -C packages/engine exec vitest run src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts --maxWorkers=1`
  passed 2 files / 11 tests.
- `pnpm calculator:gate:current` passed with engine 670 files / 3722
  tests, web 115 files / 447 passed and 18 skipped, repo build 5 / 5,
  and whitespace guard exit 0. The run emitted only the known Zustand
  unavailable-storage test warnings and optional `sharp/@img` build
  warnings.
- `git diff --check` passed.
