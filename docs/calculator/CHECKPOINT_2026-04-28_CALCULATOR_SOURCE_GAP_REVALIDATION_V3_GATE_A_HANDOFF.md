# Checkpoint - Calculator Source Gap Revalidation v3 Gate A Handoff

Date: 2026-04-28

## What Landed

`calculator_source_gap_revalidation_v3` Gate A landed no-runtime:

- `packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`
  re-ranks the remaining source, accuracy, and readiness gaps after the
  framed split fix.
- The selected next slice is `internal_use_operating_envelope_v1`, with
  planning surface
  `docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md`.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate A Decision

Gate A selected the internal-use operating-envelope slice because:

- the framed split runtime drift is closed and covered by paired engine
  and web tests;
- wall holdouts remain source-gated:
  no-stud double-leaf, timber double-board, CLT / mass-timber wall, and
  lined-massive / heavy-core wall;
- floor fallback remains low-confidence without exact source topology
  or a bounded steel/open-web family rule;
- historical blocked families remain fail-closed:
  `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
  behavior;
- public sources found during the prior planning pass are useful intake
  candidates but not import-ready rows;
- the short company pilot needs a clear safe/caveated operating
  envelope and scenario summary before regular internal use hardening.

| Candidate | Gate A status | Why |
|---|---|---|
| Internal use operating envelope | selected | highest-value next step once source/runtime unlocks remain blocked |
| Wall source holdouts | not selected | no direct row or bounded formula/tolerance owner is ready |
| Floor fallback promotion | not selected | generated stack still lacks exact Pliteq/UBIQ topology or bounded family rule |
| Historical blocked floor/source families | not selected | closed fail-closed without new source evidence |
| Comprehensive accuracy program | not selected as active slice | roadmap only; requires multiple source-research slices |
| Productization-only work | not selected | calculator scope/accuracy remains the active priority |

## Next Slice

`internal_use_operating_envelope_v1` should start with Gate A:

- target file:
  `packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts`;
- planning file:
  `docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md`.

Gate A should prepare the short company pilot pack:

- short internal pilot usage note;
- scenario summary with expected evidence tier, supported outputs,
  unsupported outputs, and visible warnings;
- focused contract/matrix only where the scenario summary needs
  executable protection;
- no confidence/evidence promotion for pilot convenience.

## Validation

- Baseline before Gate A edits: `pnpm calculator:gate:current` green
  with 128 engine files / 601 tests, 44 web files / 212 passed + 18
  skipped, build 5/5, whitespace guard clean, and the known non-fatal
  `sharp/@img` warnings.
- Targeted Gate A validation:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts --maxWorkers=1`
  green with 1 file / 6 tests.
- Post-doc focused validation:
  `pnpm calculator:gate:current` green with 129 engine files / 607
  tests, 44 web files / 212 passed + 18 skipped, build 5/5, whitespace
  guard clean, and the known non-fatal `sharp/@img` warnings.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Then implement
`packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts`.
