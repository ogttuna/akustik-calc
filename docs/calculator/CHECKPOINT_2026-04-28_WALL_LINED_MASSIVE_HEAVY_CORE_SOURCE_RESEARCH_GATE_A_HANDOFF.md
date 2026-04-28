# Checkpoint - Wall Lined Massive Heavy-Core Source Research Gate A Handoff

Date: 2026-04-28

## What Landed

`wall_lined_massive_heavy_core_source_research_v1` Gate A landed
no-runtime:

- `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`
  pins the current generated `wall-screening-concrete` route, classifies
  wall-specific lined concrete / heavy masonry rows as missing, keeps
  Knauf CC60 concrete rows floor-only, records manufacturer lining and
  formula-framework context as unbounded, protects selector/deep-hybrid
  rows as stability boundaries, and selects Gate C closeout.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate A
  contract in the focused calculator gate.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate A Decision

No direct runtime import and no formula/tolerance Gate B are ready now.

| Candidate | Gate A status | Why it stays frozen |
|---|---|---|
| Current generated `wall-screening-concrete` route | screening baseline | no verified exact match, no lab-fallback match, no wall source row, and no named topology-specific tolerance owner |
| Wall-specific lined concrete / heavy masonry rows | missing | no current catalog row has wall scope, lining, cavity/absorber, mounting, metric context, and tolerance metadata |
| Knauf CC60 concrete rows | floor-only source truth | floor covering / ceiling roles and impact metrics do not supply wall lining `Rw` tolerance |
| Manufacturer lining rows / Gyproc context | adjacent family context | relevant family evidence, but no imported row matches the live wall stack with complete mounting and side-order metadata |
| ISO / Sharp / Davy / lined-massive formula context | formula context only | framework evidence is not translated into a bounded local single-number `Rw` tolerance for this route |
| Selector value pins and deep-hybrid heavy-core rows | stability boundaries | drift guards and route-stability evidence, not source truth or retune permission |
| `concrete_wall` workbench preset | visible screening surface | not a source row and no route-card copy changed |
| Prior heavy-core Gate B audit | frozen baseline | closed no-runtime; useful context, not an active runtime-reopen permission |

Gate A selected Gate C no-runtime closeout / next-slice selection as the
next bounded action. The current generated route remains screening-tier
and medium-confidence, with generated lab `Rw=57`, generated field
`R'w=55`, generated field-context `DnT,w=56`, `DnT,A=54.9`, dynamic
family `lined_massive_wall`, and strategy `lined_massive_blend`.

## Validation

- Baseline before Gate A edits: `pnpm calculator:gate:current` green
  with engine 120 files / 559 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, whitespace guard clean, and the known non-fatal
  `sharp/@img` warnings.
- Targeted Gate A validation:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts --maxWorkers=1`
  green with 1 file / 5 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 121 files / 564 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, whitespace guard clean, and the known non-fatal
  `sharp/@img` warnings.
- `git diff --check` clean after the current plan/current state
  updates.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Next implementation file:

- `packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts`

Gate C should close the lined-massive / heavy-core source research
slice no-runtime and select the next calculator source/accuracy
planning step. It should not import values, change confidence/support
/evidence text, or add route-card copy.
