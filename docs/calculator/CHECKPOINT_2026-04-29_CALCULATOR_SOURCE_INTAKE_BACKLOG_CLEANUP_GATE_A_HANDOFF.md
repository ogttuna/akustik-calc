# Checkpoint - Calculator Source Intake Backlog Cleanup Gate A

Date: 2026-04-29

Slice: `calculator_source_intake_backlog_cleanup_v1`

Gate: A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

Gate A lands the source-ready intake backlog as a no-runtime planning
contract:

`packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts`

Primary artifact:

[SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md)

Selected next file:

`packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`

## What Changed

- Added one cross-family source-ready backlog for:
  - `clt_mass_timber_wall`;
  - `timber_double_board_stud_wall`;
  - `no_stud_double_leaf_wall`;
  - `generated_floor_fallback`;
  - `lined_massive_heavy_core_wall`;
  - `historical_blocked_families`.
- Verified current public source locators as context only:
  Knauf UK/AU, WoodWorks, NRC, UBIQ, Pliteq, and Dataholz.
- Recorded the first missing runtime-import requirement per family.
- Recorded negative boundaries and near misses that must stay protected.
- Kept the roadmap/ledger role split explicit:
  `SOURCE_READY_INTAKE_BACKLOG.md` is the current source-intake surface;
  `CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md` remains long-horizon
  strategy; `SOURCE_GAP_LEDGER.md` remains historical/floor-dominant
  context.

## Frozen Surfaces

No runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, or workbench-input behavior changed.

Every family remains `runtimeImportReadyNow: false`.

## Current Blocker Summary

- CLT / mass timber wall: exact wall row plus metric policy / tolerance
  owner is missing.
- Timber double-board stud wall: direct live-stack row or bounded
  formula tolerance owner is missing.
- No-stud double-leaf wall: no-stud/no-rail row or local Davy/Sharp
  tolerance owner is missing.
- Generated floor fallback: exact Pliteq/UBIQ topology or bounded
  steel/open-web family rule is missing.
- Lined massive / heavy-core wall: wall-specific lined heavy source row
  or bounded lining rule is missing.
- Historical blocked families: original closed blockers still stand.

## Validation

Green on 2026-04-29:

- targeted Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts --maxWorkers=1`
  - 1 file / 6 tests passed.
- focused current gate:
  `pnpm calculator:gate:current`
  - engine 141 files / 679 tests passed;
  - web 45 files / 216 passed + 18 skipped;
  - build 5/5 with known non-fatal `sharp/@img` warnings;
  - whitespace guard clean.
- broad release gate:
  `pnpm check`
  - lint/typecheck green;
  - engine 274 files / 1499 tests passed;
  - web 157 files / 890 passed + 18 skipped;
  - build 5/5 with known non-fatal `sharp/@img` warnings.

## Next Action

Implement Gate C:

`packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`

Gate C should close this slice unless a source-ready runtime pack is
actually available. Do not promote low-confidence, screening,
formula-owned, or source-gated lanes for pilot convenience.
