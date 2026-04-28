# Checkpoint - Internal Use Operating Envelope Broad Revalidation

Date: 2026-04-28

Slice: `internal_use_operating_envelope_v1`

Checkpoint type:
`broad_revalidation_gate_c_ready`

## Summary

The project was rechecked from a broad repo perspective after Gate B.
The implementation, docs, focused calculator gate, and full repo gate
now agree:

- Gate B is landed.
- Runtime values, support classes, confidence classes, evidence tiers,
  API shape, route-card values, and output-card statuses stayed frozen.
- Wall dynamic/formula routes now carry visible
  formula-owned/source-gated scoped-estimate language in validation,
  evidence, and proposal/report surfaces.
- Generated steel floor fallback remains low-confidence/screening and
  `L'nT,50` remains unsupported.
- The next first implementation action is Gate C closeout / next-slice
  selection.

## Broad Validation

`pnpm check` is green after one type-cleanup fix.

Final green run:

- lint: green;
- typecheck: green;
- engine full suite: 264 files / 1438 tests green;
- web full suite: 157 files / 890 passed + 18 skipped;
- build: 5/5 green with the known non-fatal `sharp/@img` warnings.

The first broad run found TypeScript `TS7006` implicit-`any` warnings in
the framed split Gate A/B contract tests. The fix was limited to typing
the `warning` callback parameter in:

- `packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts`
- `packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts`

No calculator behavior moved.

## Current Decision

Do not start new runtime widening from the green broad run alone. The
correct next step is:

`packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`

Gate C should close `internal_use_operating_envelope_v1` if it confirms:

- Gate A pilot note and scenario matrix are complete;
- Gate B visible-honesty proof covers the caveated regular-use lanes;
- focused and broad gates stay green;
- no source-ready accuracy pack is actually available now.

If no bounded source pack is ready, Gate C should keep
[CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
as roadmap context rather than selecting a speculative runtime slice.
