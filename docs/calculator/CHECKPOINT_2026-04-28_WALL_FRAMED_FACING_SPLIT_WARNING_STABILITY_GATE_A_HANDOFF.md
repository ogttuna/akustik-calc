# Checkpoint - Wall Framed Facing Split Warning Stability Gate A

Date: 2026-04-28

## Scope

Gate A landed no-runtime for
`wall_framed_facing_split_warning_stability_v1`.

Executable evidence:
`packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts`.

## Finding

The historical F3 note was too narrow. The current LSF framed-wall board
split is not only warning drift in the field/building context:

- LSF lab context remains stable after splitting an
  `acoustic_gypsum_board` 12.5 mm row into 6.25 + 6.25:
  `Rw=55`, `STC=55`, `C=-1.5`, `Ctr=-6.4`, exact Knauf lab match still
  active.
- LSF field/building context drifts by +1 dB on every tested board row:
  baseline `R'w=51`, `Dn,w=51`, `Dn,A=49.6`, `DnT,w=52`,
  `DnT,A=51.1`, `STC=51`; split result `R'w=52`, `Dn,w=52`,
  `Dn,A=50.6`, `DnT,w=53`, `DnT,A=52.1`, `STC=52`.
- The LSF field split also adds the framed reinforcement monotonic-floor
  warning and changes strategy to
  `stud_surrogate_blend+framed_wall_calibration+reinforcement_monotonic_floor`.
- Timber stud lab and field contexts remain stable across all four
  gypsum-board split positions.
- A global same-material entry coalescing fix remains disallowed:
  coalescing the two 12.5 mm acoustic boards into one 25 mm board per
  face produces a materially different field topology (`R'w=38`) and
  enters the premium single-board field correction path.

## Decision

Gate B is required, but it is no longer a warning-only fix. The next
bounded action is:

`packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts`

Gate B should fix the LSF field board-split value/warning drift without
global board coalescing, without changing exact/source precedence, and
without visible route-card movement unless a paired web route-card test
is added first.

## Validation

- Baseline before Gate A edits: `pnpm calculator:gate:current` green
  with 125 engine files / 586 tests, 43 web files / 211 passed + 18
  skipped, build 5/5, known non-fatal `sharp/@img` warnings, whitespace
  guard clean.
- Targeted Gate A validation:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- Post-Gate-A focused validation: `pnpm calculator:gate:current` green
  with 126 engine files / 591 tests, 43 web files / 211 passed + 18
  skipped, build 5/5, known non-fatal `sharp/@img` warnings, whitespace
  guard clean.

## Handoff

Read this checkpoint after
`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`. Then continue the active
slice at Gate B. Do not reopen source-blocked wall/floor families from
this local split finding.
