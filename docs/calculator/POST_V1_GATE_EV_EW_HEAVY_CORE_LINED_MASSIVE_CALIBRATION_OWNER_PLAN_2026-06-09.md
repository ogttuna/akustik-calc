# Post-V1 Gate EV/EW Heavy-Core Lined-Massive Calibration Owner Plan - 2026-06-09

Status: Gate EV landed no-runtime and selected Gate EW. Gate EW landed
no-runtime, owner rejected, and selected Gate EX.

Gate EV landed gate:
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan`

Gate EV status:
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_landed_no_runtime_selected_wall_heavy_core_lined_massive_calibration_owner_gate_ew`

Selected Gate EV gap:
`wall.heavy_core_lined_massive_calibration_owner_gap_after_bounded_basis`

Selected next action:
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan`

Selected next file:
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts`

Gate EW status:
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_ex`

Gate EW owner decision:
`wall.heavy_core_lined_massive.calibration_owner_rejected_missing_wall_specific_source_or_bounded_rule`

Gate EW selected next action:
`post_v1_next_numeric_coverage_gap_gate_ex_plan`

Gate EW selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts`

## Purpose

Gate EV is a no-runtime current coverage/accuracy gap ledger. It closes
the Gate EU work order by reading current implementation evidence and
selecting the next calculator slice from the live post-V1 surface, not
from stale selected-next text.

The selected next slice is the heavy-core / lined-massive calibration
owner Gate EW. This is an owner proof, not a retune. Gate DG already
bounded the heavy-core / lined-massive wall route and kept the existing
`bounded_prediction` values live, but it did not prove the calibration
owner or the holdout boundary needed before future value movement.

The expected payoff is accuracy-oriented: Gate EW can make a future
lined-massive/heavy-core wall retune safe if it proves a wall-specific
owner and tolerance boundary. If it cannot prove that boundary, the
route must remain frozen instead of importing broad source rows or
moving values from weak evidence.

## Gate EV Ledger

Gate EV classifies the current calculator surface into 10 evidence rows.
The selected row is:
`wall.heavy_core_lined_massive_calibration_owner_gap_after_bounded_basis`.

Selected evidence:

- Gate DG:
  `packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts`
- Gate A lined-massive/heavy-core source posture:
  `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`
- broad accuracy reference evidence:
  `packages/engine/src/broad-accuracy-reference-benchmark-expansion.ts`
- source-ready intake backlog:
  `docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md`

Gate EV rejects immediate runtime retune because the current live route
still needs a wall-specific lined concrete or heavy-masonry source row,
or a named bounded wall lining rule, before values can move safely. The
current `bounded_prediction` values frozen by Gate DG stay frozen during
Gate EW.
In plain terms: bounded_prediction values frozen is the safety invariant
for Gate EW until the owner proof is accepted.

Gate EV also subtracts closed or non-current work:

- Gate ER direct-fixed field/building adapter is already live for
  complete bounded requests.
- Gate ET reinforced-concrete visible-derived lower assembly correctly
  remains `needs_input` when physical inputs are missing.
- The thick-board Auto family guard correctly keeps generic board/panel
  stacks out of lined-massive promotion by surface mass alone.
- Gate EJ ASTM exact-band work stays separated by metric and basis.
- Gate DK steel visible formula input surface is already live.
- Gate EL visible wall route reconciliation is a closed repeat.
- broad source crawling, confidence wording, frontend polish, and finite
  scenario packs fail the calculator advancement test for this slice.

Gate EV counters:

- `ledgerRows 10`
- `currentEvidenceSurfaces 10`
- `ownerGapRows 1`
- `runtimeCandidateRowsHeldBehindOwner 1`
- `blockedSourceOrHoldoutRows 1`
- `blockedNonGoalRows 1`
- `closedRepeatRows 2`
- `estimatedNextOwnerLedgers 1`
- `estimatedNextRuntimeCandidateFamiliesAfterOwner 1`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions 0`
- `runtimeFormulaRetunes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Gate EV Validation

Historical validation after Gate EV, superseded by the Gate EW validation
record below for the current latest full-gate count:

- focused Gate EV contract:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts --maxWorkers=1`
  passed 5 / 5 tests;
- focused Gate EU + Gate EV continuity:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts --maxWorkers=1`
  passed 10 / 10 tests;
- focused Gate ET + Gate EU + Gate EV continuity:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts --maxWorkers=1`
  passed 14 / 14 tests;
- full current gate:
  `pnpm calculator:gate:current` passed with engine 666 files / 3701
  tests, web 115 files / 447 passed and 18 skipped, repo build 5 / 5,
  and whitespace guard passed.

Known non-fatal validation noise: web focused tests still print
Zustand storage-unavailable warnings, and Next build still prints
optional `sharp/@img` package warnings through `@turbodocx/html-to-docx`.
Both were present in the existing current-gate posture and did not fail
the gate.

## Gate EW Work Order

Create:
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts`.

Gate EW must prove or reject the calibration owner for the bounded
heavy-core / lined-massive wall route. It must not move runtime values,
import source rows, or touch frontend/shared/API implementation.

Gate EW must pin:

- whether a wall-specific lined concrete or heavy-masonry source row, or
  a named bounded wall lining rule, is sufficient evidence for this
  route family;
- side-order and mounting metadata needed to prevent floor-only or
  wrong-side lined assemblies from entering the wall owner;
- the lab, field, and building metric owner boundary for `Rw`, `STC`,
  `C`, `Ctr`, `R'w`, `Dn,w`, `DnT,w`, and `DnT,A`;
- the tolerance and holdout boundary that would make a later retune
  acceptable;
- floor-only rejection and true wall-positive examples.

Gate EW may select a later runtime action only if the owner proof is
accepted. If the proof is rejected or incomplete, the correct outcome is
to keep the current Gate DG `bounded_prediction` values frozen and
select a more precise evidence-acquisition or owner-boundary action.

## Gate EW Closeout

Gate EW rejected the calibration owner:
`wall.heavy_core_lined_massive.calibration_owner_rejected_missing_wall_specific_source_or_bounded_rule`.
The current evidence still lacks a wall-specific lined concrete or
heavy-masonry source row and lacks a named bounded wall lining rule with
coefficient scope, local tolerance, holdouts, and protected negative
boundaries. Gate EW keeps bounded_prediction values frozen and selected
Gate EX:
`post_v1_next_numeric_coverage_gap_gate_ex_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts`.

Gate EW counters:

- `acceptedOwnerLedgers 0`
- `calibrationOwnerRejectedLedgers 1`
- `evidenceBoundaryLedgersPinned 8`
- `metricBasisBoundariesPinned 4`
- `wallSpecificPositiveRowsAccepted 0`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions 0`
- `runtimeFormulaRetunes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Validation after Gate EW:

- focused Gate EW contract:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts --maxWorkers=1`
  passed 5 / 5 tests;
- focused Gate EV + Gate EW continuity:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts --maxWorkers=1`
  passed 10 / 10 tests;
- focused Gate ET + Gate EU + Gate EV + Gate EW continuity:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts --maxWorkers=1`
  passed 19 / 19 tests;
- full current gate:
  `pnpm calculator:gate:current` passed with engine 667 files / 3706
  tests, web 115 files / 447 passed and 18 skipped, repo build 5 / 5,
  and whitespace guard passed.

Known non-fatal validation noise remains unchanged: web focused tests
print Zustand storage-unavailable warnings, and Next build prints
optional `sharp/@img` package warnings through
`@turbodocx/html-to-docx`. Both were present in the existing gate
posture and did not fail validation.

## Acceptance And Stop Conditions

Gate EW is acceptable only if:

- it moves `runtimeValuesMoved 0`;
- it keeps `sourceRowsImported: 0`;
- it keeps `frontendImplementationFilesTouched: 0`;
- it does not weaken existing `needs_input` / `unsupported` boundaries;
- it explains exactly why a future runtime retune is allowed or still
  blocked.

Stop before runtime implementation if Gate EW cannot name a wall-specific
owner and tolerance boundary. Do not replace that missing owner with
broad source crawling, confidence wording, a finite scenario pack, or a
generic retune.
