# Checkpoint - Wall Framed Facing Split Warning Stability Gate B

Date: 2026-04-28

## Scope

Gate B landed for `wall_framed_facing_split_warning_stability_v1`.

Executable evidence:

- `packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts`
- `apps/web/features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts`

## Runtime Change

The LSF field/building board-split drift is fixed. Splitting one
outer-facing `acoustic_gypsum_board` 12.5 mm layer into 6.25 + 6.25 no
longer promotes the framed reinforcement monotonic-floor guard.

Pinned LSF field/building split values now match baseline:

- `R'w=51`
- `Dn,w=51`
- `Dn,A=49.6`
- `DnT,w=52`
- `DnT,A=51.1`
- `STC=51`
- `C=-1.4`
- `Ctr=-6.4`

The fix is intentionally local. It detects adjacent thin same-material
board fragments on the outer leaves before the framed reinforcement
monotonic-floor sibling comparison. It does not globally coalesce
same-material layers and does not merge the physically distinct
12.5 + 12.5 double-board topology into a single 25 mm board.

## Guardrails

Gate B preserves:

- LSF lab exact behavior at `Rw=55`, `STC=55`, `C=-1.5`, `Ctr=-6.4`
  with the Knauf exact anchor still active;
- timber stud lab/field split stability at the Gate A values;
- supported/unsupported output posture;
- `stud_surrogate_blend+framed_wall_calibration` strategy for the fixed
  LSF field split;
- the negative boundary where a coalesced 25 mm board per face remains
  a different topology (`R'w=38`) and still enters the premium
  single-board field correction path.

Because Gate B removes a visible split-only acoustic warning and visible
+1 dB card drift, it adds paired web route-card coverage. The web
matrix pins the LSF field cards at baseline values and verifies the
acoustic warnings stay equal to baseline after filtering ordinary guided
thickness-sanity notes. Those guided notes can still differ when a user
splits a 12.5 mm board into 6.25 + 6.25 fragments, which is a UI input
sanity signal rather than the acoustic monotonic-floor drift.

## Decision

The next bounded action is Gate C closeout / next-slice selection:

`packages/engine/src/post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts`

Gate C should close this slice if validation remains green, update the
current plan/current-state/agent notes together, and select the next
source or accuracy slice without reopening source-blocked families from
this local split fix.

## Validation

- Baseline before Gate B edits: `pnpm calculator:gate:current` green
  with 126 engine files / 591 tests, 43 web files / 211 passed + 18
  skipped, build 5/5, known non-fatal `sharp/@img` warnings, whitespace
  guard clean.
- Targeted Gate A validation after the runtime fix:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- Targeted Gate B validation:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- Targeted web route-card validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts --maxWorkers=1`
  green: 1 file / 1 test.
- Post-Gate-B focused validation: `pnpm calculator:gate:current` green
  with 127 engine files / 596 tests, 44 web files / 212 passed + 18
  skipped, build 5/5, known non-fatal `sharp/@img` warnings, whitespace
  guard clean.

## Handoff

Read this checkpoint after
`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`. Then continue the active
slice at Gate C closeout / next-slice selection. Do not use global board
coalescing as a follow-up; the negative boundary remains protected.
