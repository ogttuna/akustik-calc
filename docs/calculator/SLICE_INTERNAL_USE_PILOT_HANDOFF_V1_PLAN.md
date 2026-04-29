# Slice Plan - Internal Use Pilot Handoff v1

Slice id: `internal_use_pilot_handoff_v1`

Status: CLOSED AT GATE C (selected 2026-04-29 by
`post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts`;
Gate A landed 2026-04-29 in
`internal-use-pilot-handoff-v1-gate-a-contract.test.ts`; Gate C closed
2026-04-29 in
`post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts`).

Closed implementation file:

`packages/engine/src/post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts`

Selected follow-up:

`calculator_source_intake_backlog_cleanup_v1`

Next implementation file:

`packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts`

Selection reason: `internal_use_acceptance_rehearsal_v1` closed
no-runtime after Gate A landed a 20-scenario company-internal
acceptance matrix and Gate C found no concrete acceptance defect and no
source-ready accuracy pack. The highest-value next action is therefore a
no-runtime handoff pack that makes the controlled company-use envelope
operationally clear before any broader pilot.

This slice must not change acoustic formulas, runtime values, support
classes, confidence classes, evidence tiers, API shape, route-card
values, output-card statuses, proposal/report copy, or workbench input
behavior unless Gate A discovers a documented-vs-implemented mismatch
that needs a separately selected fix.

## Objective

Prepare a company-internal pilot handoff that a knowledgeable internal
user can follow without reading the whole development history.

The handoff should answer:

- which wall and floor scenarios are pilot-ready estimates with the
  normal internal-use caveat;
- which scenarios are useful only with visible formula, source-gated,
  low-confidence, or screening caveats;
- which requests must stay fail-closed, `needs_input`, unsupported, or
  roadmap-only;
- which validation commands prove the current controlled envelope;
- which source-ready accuracy prerequisites are still missing before
  runtime widening or confidence promotion is allowed.

## Gate A - Prepare Company Internal Pilot Handoff Pack

Gate A landed:

`packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts`

Handoff artifact:

[INTERNAL_USE_PILOT_HANDOFF.md](./INTERNAL_USE_PILOT_HANDOFF.md)

Implementation read map before coding:

- `packages/engine/src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts`
  for the Gate C closure decision and selected handoff constraints.
- `packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`
  for the 20 executable acceptance scenarios.
- [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md)
  for the current operator-facing pilot envelope.
- [CURRENT_STATE.md](./CURRENT_STATE.md) and
  [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) for
  current validation and next action.
- [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
  and [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) for blocked
  source-gated families.

No external source research is required for Gate A. This is a handoff
and validation-readiness slice, not a runtime import or formula retune.

Required Gate A artifacts:

- a concise company-internal pilot handoff summary;
- a scenario bucket table that separates ready, caveated, blocked, and
  hostile/edge behavior;
- a validation evidence map with exact commands and expected suite
  counts;
- a known-gap register for source-gated, screening, low-confidence, and
  unsupported families;
- an operator checklist for wall/floor selection, required inputs, layer
  entry, result review, caveat copying, and fail-closed handling.

Gate A landed the recommended handoff artifact at
`docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md`. It documents the
operator workflow, all 20 acceptance scenarios, known source-gated gaps,
and validation map without moving
`runtime/support/confidence/evidence/API/route-card/output-card` or
`proposal/report/workbench-input` behavior.

Minimum assertions:

- the handoff references all 20 acceptance scenario ids or their exact
  bucket aliases;
- ready lanes include current value expectations or proof owners;
- caveated lanes explicitly forbid exact/source-backed wording unless a
  later source slice changes the contract;
- blocked lanes preserve `needs_input`, unsupported, source-gated, or
  fail-closed behavior;
- validation instructions include targeted Gate A/Gate C, current gate,
  broad `pnpm check` policy, and `git diff --check`;
- no runtime/support/confidence/evidence/API/route-card/output-card
  movement is allowed.

Gate A should run focused validation and should decide whether a broad
`pnpm check` is needed before declaring the pilot handoff ready. If the
handoff is intended as the company-use release candidate, run the broad
gate and record the result.

Failure response:

- Missing or ambiguous pilot lane: fix the handoff text and contract
  first.
- Handoff says a family is ready while the executable acceptance matrix
  says caveated/blocked: treat as a documentation defect and keep
  runtime frozen.
- Validation drift: stop and fix the regression before closing the
  handoff.
- New source evidence appears: do not import it in this slice; write a
  source-ready accuracy candidate only if exact row locators, metric
  policy, tolerance owner, negative boundaries, and paired visible tests
  are all present.

## Gate B - Handoff Visibility Fix

Gate B should be selected only if Gate A finds that the handoff pack is
structurally correct but user-facing pilot copy, proposal/report notes,
or route-card caveat wording are inconsistent with the handoff.

Possible Gate B scope:

- workbench route-card language for pilot-ready vs caveated lanes;
- proposal/report note consistency for caveated lanes;
- missing-input and unsupported-output text clarity;
- no numeric/formula movement unless Gate A exposes a real
  implementation defect.

## Gate C - Pilot Handoff Closeout

Gate C should close this slice only when:

- the handoff pack is complete and current;
- focused validation is green;
- broad validation has either been run for release-candidate handoff or
  explicitly deferred with a no-runtime rationale;
- no source-gated or low-confidence family was promoted for pilot
  convenience;
- the next slice is selected from a concrete pilot defect, a
  source-ready accuracy pack, or a no-runtime source-intake/backlog
  cleanup.

Target:

`packages/engine/src/post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts`

Gate C landed no-runtime and selected
`calculator_source_intake_backlog_cleanup_v1` because focused/broad
validation did not identify a concrete pilot defect and no
source-ready accuracy pack exists. The handoff remains controlled
company-use evidence; it is not runtime import, confidence promotion,
or external certification permission.

## Validation

- Run the targeted Gate A contract while iterating.
- Add the Gate A contract to `tools/dev/run-calculator-current-gate.ts`
  when it lands.
- Run `pnpm calculator:gate:current` before closeout.
- Run `git diff --check`.
- Run `pnpm check` if the Gate A handoff is treated as the internal-use
  release candidate.

Latest Gate A validation, 2026-04-29:

- baseline `pnpm calculator:gate:current` before editing: engine 138
  files / 661 tests, web 45 files / 216 passed + 18 skipped, build 5/5
  with known non-fatal `sharp/@img` warnings, whitespace guard clean;
- targeted Gate A engine contract green: 1 file / 6 tests;
- prior acceptance rehearsal Gate A retest green after a type-only
  helper fix: 1 file / 7 tests;
- engine typecheck green after the helper fix;
- focused `pnpm calculator:gate:current` green after runner sync:
  engine 139 files / 667 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings, whitespace guard
  clean;
- release-candidate broad `pnpm check` green: lint/typecheck green,
  engine 272 files / 1487 tests, web 157 files / 890 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings;
- `git diff --check` clean after final doc updates.

Gate C closeout validation, 2026-04-29:

- targeted Gate C contract green: 1 file / 6 tests;
- targeted Gate A + Gate C compatibility retest green: 2 files / 12
  tests;
- focused `pnpm calculator:gate:current` green after runner sync:
  engine 140 files / 673 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings, whitespace guard
  clean;
- release-candidate broad `pnpm check` green: lint/typecheck green,
  engine 273 files / 1493 tests, web 157 files / 890 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings;
- `git diff --check` clean after final doc updates.
