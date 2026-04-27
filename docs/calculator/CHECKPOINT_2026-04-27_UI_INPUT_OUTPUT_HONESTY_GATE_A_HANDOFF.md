# Checkpoint - UI Input / Output Honesty Gate A

Date: 2026-04-27

Slice: `ui_input_output_honesty_v1`

Status: Gate A landed no-runtime; Gate B is next.

## What Landed

Gate A added a focused web inventory contract:

- `apps/web/features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts`

The contract does not change formulas, runtime values, confidence
scores, or support classification. It pins current input/output honesty
behavior so Gate B can fix only the visible gaps.

## Already Honest

- `EstimateRequestSchema` rejects requests without a layer stack and
  exposes a structured `layers` issue path.
- `ImpactOnlyRequestSchema` rejects source-less impact-only requests and
  tells callers that at least one source is required.
- Field airborne output status already distinguishes partition geometry
  blockers from receiving-room volume blockers.
- Explicitly unsupported requested outputs stay non-numeric: the card
  value remains `Not ready`, not a live or bound number.
- Existing route/card matrices already cover output support parity,
  layer reorder, many-layer stress, and mixed study-mode save/load
  posture.

## Gate B Blockers

Gate B should be UI/API honesty wiring, not formula work.

1. API routes still use generic top-level validation messages
   (`Invalid estimate payload.`, `Invalid impact-only payload.`) even
   though schema issues are structured. Gate B should normalize these
   into next-field user messages without losing issue detail.
2. The simple output card model can label an engine-rejected field
   impact output as `needs_input` when route-blocking precedence wins.
   Gate B should prefer a clearer unsupported/current-path label when
   `unsupportedTargetOutputs` already contains the requested output,
   while preserving missing-input labels for genuinely incomplete
   inputs.

## Must Fail Closed Before Private Use

None found in Gate A. The inventory did not find a defended-looking
unsupported or invalid value that leaks as a live/bound answer.

## Validation

- Targeted Gate A web contract:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts --maxWorkers=1`
  passed: 1 file / 4 tests.
- `pnpm calculator:gate:current` passed after wiring the contract into
  the focused gate:
  - engine: 97 files / 440 tests;
  - web: 37 files / 174 passed + 18 skipped;
  - build: 5/5 tasks, with only the known non-fatal `sharp/@img`
    optional-package warnings;
  - whitespace guard clean.

Broad `pnpm check` was intentionally not run because Gate A is
no-runtime and no user-visible behavior changed. Run broad before Gate C
closeout or after Gate B changes visible behavior.

## Next Action

Start Gate B for `ui_input_output_honesty_v1`:

1. add a small shared validation-message mapper for `/api/estimate` and
   `/api/impact-only`;
2. update the simple output-card unsupported-vs-missing-input
   precedence;
3. add focused tests for the changed API payloads and card labels;
4. keep acoustic runtime values unchanged.
