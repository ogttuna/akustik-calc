# Checkpoint - Wall No-Stud Double-Leaf Source Research Gate A Handoff

Date: 2026-04-28

## What Landed

`wall_no_stud_double_leaf_source_research_v1` Gate A landed
no-runtime:

- `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts`
  classifies direct no-stud empty/porous double-leaf source candidates,
  Davy/Sharp formula/tolerance evidence, NRC row-extraction evidence,
  and protected negative boundaries.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate A
  contract in the focused calculator gate.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate A Decision

No direct runtime import row is ready now.

| Candidate | Gate A status | Why it stays frozen |
|---|---|---|
| Gypsum block double walls with air chambers | direct-family adjacent material | direct no-stud family evidence, but not the current AAC / gypsum-board live material stack and row-level table data is not imported |
| Gypsum block double walls with absorbent material | direct-family adjacent material | direct porous/fill family evidence, but needs full row extraction, absorber metadata, and local material mapping |
| Davy / Sharp cavity-wall formula line | formula-tolerance candidate | relevant to cavities with and without absorption, but Gate B must translate the model evidence into a bounded local `Rw` tolerance before movement |
| NRC gypsum-board wall transmission-loss archive | row archive needs extraction | strong wall data reservoir, but no extracted row has yet proven no-stud/no-rail/no-coupling fit |
| Stud-type double-leaf studies and framed manufacturer rows | adjacent context only | useful boundary evidence, but stud/framed rows cannot promote no-stud values |

Gate A selects a no-runtime Gate B feasibility audit:

- test whether the Davy/Sharp line can produce a bounded tolerance for
  the current empty and porous no-stud routes;
- extract/check whether the NRC archive contains a true no-stud/no-rail
  gypsum-board wall row that maps to the live material/cavity topology;
- keep all current no-stud values formula-owned unless Gate B names a
  complete tolerance or direct row with executable negative boundaries.

## Validation

- Baseline before Gate A edits: `pnpm calculator:gate:current` green
  with engine 113 files / 522 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate A validation:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts --maxWorkers=1`
  green with 1 file / 6 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` to be
  green with engine 114 files / 528 tests, web 43 files / 211 passed +
  18 skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- `git diff --check` clean.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Next implementation file:

- `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts`

Gate B must stay no-runtime unless it proves a complete direct row or a
bounded formula tolerance owner. It should not import values, change
confidence/support/evidence text, or add route-card copy without paired
engine value and web route-card tests.
