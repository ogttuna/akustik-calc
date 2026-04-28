# Checkpoint - Internal Use Operating Envelope Clean Stop

Date: 2026-04-28

Slice: `internal_use_operating_envelope_v1`

Checkpoint type:
`clean_stop_gate_c_ready`

## Summary

This checkpoint re-read the current calculator docs, compared them with
the implementation surface, and reran the focused and broad gates before
stopping.

Current finding:

- Docs and implementation agree that Gate B has landed.
- The Gate C closeout / next-slice selection contract is still absent,
  which matches the selected next step.
- Runtime values, support classes, confidence classes, evidence tiers,
  API shape, route-card values, and output-card statuses did not move.
- Dynamic wall formula routes remain visibly caveated as
  formula-owned/source-gated scoped estimates.
- Generated steel floor fallback remains low-confidence/screening and
  `L'nT,50` remains unsupported.
- No source-ready accuracy pack was identified by this checkpoint.

## Implementation Comparison

The selected next implementation file is still:

`packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`

That file does not exist yet. This is expected: Gate C has not been
implemented, and the active plan still correctly says Gate C is the next
bounded action.

Do not reopen timber double-board, CLT wall, lined/heavy-core wall,
no-stud double-leaf, floor fallback, or other source-gated families from
green tests alone. They remain source-gated until a bounded source pack
names exact topology, metric owner, tolerance, protected negative
boundaries, and paired engine/web tests.

## Validation

Focused gate:

- command: `pnpm calculator:gate:current`
- result: green;
- engine focused suite: 131 files / 618 tests green;
- web focused suite: 45 files / 216 passed + 18 skipped;
- build: 5/5 green with the known non-fatal `sharp/@img` warnings;
- whitespace guard: clean.

Broad gate:

- command: `pnpm check`
- result: green;
- engine full suite: 264 files / 1438 tests green;
- web full suite: 157 files / 890 passed + 18 skipped;
- build: 5/5 green with the known non-fatal `sharp/@img` warnings.

The first broad run in this checkpoint started from a clean worktree.
After the docs were updated, `pnpm check` was run again and stayed
green, replaying stable lint/typecheck/test/build work from Turbo cache
because only calculator docs changed. That is acceptable for this
checkpoint: no runtime or test implementation changed.

## Current Decision

This is a clean stopping point. The correct next step is still Gate C:

`packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`

Gate C should close `internal_use_operating_envelope_v1` only if it
confirms:

- Gate A pilot note and scenario matrix are complete;
- Gate B visible-honesty proof covers the caveated regular-use lanes;
- focused current-gate validation remains green;
- no source-ready accuracy slice can be named with a bounded source pack.

If no bounded source pack is ready, Gate C should keep
[CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
as roadmap context and avoid speculative runtime, support, confidence,
evidence, API, or route-card movement.
