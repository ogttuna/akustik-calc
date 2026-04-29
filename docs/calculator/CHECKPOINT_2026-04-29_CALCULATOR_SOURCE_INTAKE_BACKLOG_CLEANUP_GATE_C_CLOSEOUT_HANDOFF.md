# Checkpoint - Calculator Source Intake Backlog Cleanup Gate C Closeout

Date: 2026-04-29

Slice: `calculator_source_intake_backlog_cleanup_v1`

Gate: C

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

Gate C closes `calculator_source_intake_backlog_cleanup_v1` no-runtime.

Closeout contract:

`packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`

Selected next slice:

`generated_floor_fallback_topology_delta_v1`

Selected next file:

`packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`

Selected planning surface:

[SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md](./SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md)

## Why This Slice

No source-ready runtime import exists after the source-intake backlog
cleanup. Every family in
[SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md)
remains `runtimeImportReadyNow: false`.

The generated floor fallback is the best next bounded no-runtime action
because it has concrete source topologies to compare against:

- Pliteq exact steel-joist rows;
- UBIQ INEX / FL-32 bound rows;
- existing low-confidence `floor-steel-fallback` runtime evidence.

Gate A for the next slice should build a topology-delta matrix, not
import or promote values.

## Frozen Surfaces

No runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, or workbench-input behavior changed.

No candidate was promoted for pilot convenience.

## Preserved Boundaries

- `floor-steel-fallback` remains low-confidence/screening.
- Pliteq exact rows apply only when exact topology is present.
- UBIQ bound rows apply only when bound topology is present.
- `L'nT,50`, lab `Ln,w+CI`, and lab `DeltaLw` stay unsupported without
  source evidence.
- Exact and bound source precedence must not be weakened by generated
  fallback logic.
- `GDMTXA04A`, `C11c`, raw open-box/open-web, wall selector behavior,
  CLT wall, timber double-board, no-stud double-leaf, and lined-heavy
  wall remain source-blocked or fail-closed until their own blockers are
  directly satisfied.

## Validation

Green on 2026-04-29:

- targeted Gate C:
  `pnpm --filter @dynecho/engine exec vitest run src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  - 1 engine file / 6 tests.
- focused current gate:
  `pnpm calculator:gate:current`
  - engine 142 files / 685 tests;
  - web 45 files / 216 passed + 18 skipped;
  - build 5/5 with the known non-fatal `sharp/@img` warnings;
  - whitespace guard clean.
- whitespace guard:
  `git diff --check`

- broad `pnpm check`:
  - lint/typecheck green;
  - engine 275 files / 1505 tests;
  - web 157 files / 890 passed + 18 skipped;
  - build 5/5 with the known non-fatal `sharp/@img` warnings.

## Next Action

Implement Gate A:

`packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`

Gate A should prove the topology deltas and keep all runtime / visible
surfaces frozen unless a true source-ready exact or bounded floor
runtime candidate is found and selected for a later bounded slice.
