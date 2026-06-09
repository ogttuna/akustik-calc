# Post-V1 Gate EY/EZ Heavy-Core Lined-Massive Targeted Evidence Closeout Plan - 2026-06-09

Status: Gate EY landed no-runtime and selected Gate EZ.

Gate EY landed gate:
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan`

Gate EY status:
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_landed_no_runtime_owner_remains_rejected_selected_next_numeric_coverage_gap_gate_ez`

Gate EY decision:
`wall.heavy_core_lined_massive.targeted_evidence_acquired_owner_still_rejected_no_runtime_admissible_row_or_rule`

Selected next action:
`post_v1_next_numeric_coverage_gap_gate_ez_plan`

Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts`

## Purpose

Gate EY closes the Gate EX targeted evidence acquisition without moving
runtime values. It is not a broad source crawl. The gate inspected the
specific evidence type Gate EW said was missing: wall-specific lined
concrete or heavy-masonry rows, or a bounded wall lining rule with
coefficient scope, local tolerance, holdouts, and negative boundaries.

The outcome protects calculator accuracy. MWI.2A and B226010 are useful
targeted wall-specific evidence surfaces, but neither is a runtime-
admissible owner for the live generic heavy-core / lined-massive route.
No bounded wall lining rule was accepted. The calibration owner remains
rejected, and Gate DG `bounded_prediction` values remain frozen.

## Gate EY Evidence

Accepted targeted evidence context, not runtime owner:

- MWI.2A, Knauf AU Systems+ Section F Masonry Upgrades: wall-specific
  lined concrete/block context with lab `Rw` and `Rw+Ctr`; not a runtime
  owner because Sheetrock One, furring/coupling, concrete panel/block
  variants, KI glasswool, side-order, field metrics, and tolerance
  boundaries do not match the live generic
  `gypsum_board 12.5 / rockwool 50 / air_gap 50 / concrete 100` route.
- B226010, British Gypsum White Book GypLyner Single: wall-specific
  lined brick context with lab `Rw` and `Rw+Ctr`; not a runtime owner
  because solid brick, plaster, GL1 channels, APR insulation, SoundBloc,
  and lined-brick topology do not own generic lined concrete/heavy-core
  calculation or field/building outputs.

Rejected adjacent or incomplete contexts:

- Knauf CC60 floor rows remain floor-only and cannot be used as wall
  truth.
- ISO/Sharp/Davy formula context remains useful background but is not a
  bounded wall lining rule without coefficient scope, local tolerance,
  holdouts, and negative boundaries.
- Current Gate DG pins are runtime behavior, not measured calibration
  holdouts.
- Presets, selector pins, and deep-hybrid guards are stability evidence,
  not acoustic source truth.

## Counters

- `targetedEvidenceLedgers 6`
- `acceptedTargetedEvidenceLedgers 2`
- `runtimeAdmissibleEvidenceLedgers 0`
- `acceptedBoundedWallLiningRules 0`
- `calibrationOwnerReopened false`
- `calibrationOwnerRemainsRejected true`
- `broadSourceCrawlSelected false`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions 0`
- `runtimeFormulaRetunes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Gate EZ Work Order

Create:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts`.

Gate EZ must rerank the current calculator coverage/accuracy gaps after
subtracting the closed Gate EY heavy-core / lined-massive evidence
thread. It must not reopen the heavy-core / lined-massive calibration
owner unless a later selected slice brings new runtime-admissible
wall-specific evidence or a bounded wall lining rule. It must not import
source rows, crawl a broad source library, weaken metric/basis
boundaries, or touch frontend/shared/API code unless the rerank selects
an explicitly scoped input-surface action.

If Gate EZ selects a runtime action, that action must state the route,
metric basis, required physical inputs, value movement, and holdout or
formula owner before any calculator values move.

## Validation

- Focused Gate EY contract:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts --maxWorkers=1`
  passed 6 / 6.
- Gate EW/EX/EY chain:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts --maxWorkers=1`
  passed 16 / 16.
- Full current gate:
  `pnpm calculator:gate:current` passed with engine 669 test files /
  3717 tests, web 115 test files / 447 passed and 18 skipped, repo build
  5 / 5, and whitespace guard passed.
