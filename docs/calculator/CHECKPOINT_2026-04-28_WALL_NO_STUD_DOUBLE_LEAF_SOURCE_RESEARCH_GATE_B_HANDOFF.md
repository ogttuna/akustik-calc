# Checkpoint - Wall No-Stud Double-Leaf Source Research Gate B Handoff

Date: 2026-04-28

## What Landed

`wall_no_stud_double_leaf_source_research_v1` Gate B landed
no-runtime:

- `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts`
  audits Davy/Sharp formula-tolerance feasibility for the current empty
  and porous no-stud routes.
- The same contract audits NRC and gypsum-block direct-row feasibility
  before any import.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate B
  contract in the focused calculator gate.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate B Decision

No bounded formula tolerance or direct row import is ready now.

| Candidate | Gate B status | Why it stays frozen |
|---|---|---|
| Davy / Sharp cavity-wall formula line | relevant scope but not runtime owner | it still needs local formula inputs for the live AAC/gap/gypsum and gypsum/wool/gap/gypsum routes, plus a translation from frequency-band model fit to a single-number `Rw` tolerance |
| NRC gypsum-board transmission-loss archive | useful data reservoir but not import-ready | no row has yet been extracted and proven as no-stud/no-rail/no-mechanical-coupling with live material/cavity mapping |
| Gypsum-block double walls with air chamber | direct-family adjacent material | row details and material mapping are still not enough to import into the live AAC / gypsum-board route |
| Gypsum-block double walls with absorbent material | direct-family adjacent material | absorber and material mapping are still not enough to import into the live gypsum-board / rockwool route |

Gate B selected a no-runtime Gate C closeout, which has now landed in
[CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md):

- close the no-stud double-leaf source research slice without value
  movement;
- preserve the current empty route (`R'w=46`, `Rw=48`) and porous route
  (`R'w=41`, `Rw=43`) as formula-owned;
- select the next accuracy slice only after the closeout contract
  records why runtime import, retune, support/confidence movement, and
  route-card copy are still blocked.

## Validation

- Baseline before Gate B edits: `pnpm calculator:gate:current` green
  with engine 114 files / 528 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate B validation:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts --maxWorkers=1`
  green with 1 file / 6 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 115 files / 534 tests, web 43 files / 211
  passed + 18 skipped, build 5/5, and the known non-fatal `sharp/@img`
  warnings.
- `git diff --check` clean.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Next implementation file:

- `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`

The no-stud Gate C closeout is now the latest handoff. Continue with
`wall_timber_double_board_source_research_v1` Gate A. It must not import
values, change confidence/support/evidence text, or add route-card copy.
