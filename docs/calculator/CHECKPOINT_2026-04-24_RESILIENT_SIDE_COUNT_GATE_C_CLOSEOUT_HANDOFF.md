# Checkpoint - 2026-04-24 Resilient Side Count Gate C Closeout

Status: checkpoint handoff

## What Landed

Gate C of `wall_resilient_bar_side_count_modeling_v1` is implemented and
the slice is closed.

The four official RB1/RB2 timber resilient-bar rows are now exact imports
when the user selects an explicit side count:

| Source row | Side count | Lab Rw |
|---|---:|---:|
| Knauf GB EN-TP-RB1 | one side | 56 dB |
| Knauf GB EN-TP-RB2 | both sides | 59 dB |
| British Gypsum A046005 | one side | 55 dB |
| British Gypsum A046006 | both sides | 58 dB |

Legacy `auto` remains value-stable and side-count-blind. This is
intentional: old saved scenarios and presets do not silently inherit a
side-count-specific exact row.

## Implementation Vs Plan

Gate C chose the exact-import posture for all four RB1/RB2 timber rows
because Gate B made the missing topology dimension explicit:

- `packages/engine/src/wall-timber-lightweight-source-corpus.ts`
  promotes the rows to `exact_import_landed` with reason
  `resilient_bar_side_count_topology_exactly_representable`.
- `packages/engine/src/airborne-verified-catalog.ts` includes
  `resilientBarSideCount` in exact/companion metadata matching, so
  explicit `one_side` and `both_sides` discriminate rows while `auto`
  does not.
- `packages/engine/src/airborne-verified-catalog.test.ts` proves each
  landed RB1/RB2 row requires the matching explicit side count.
- `packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts`
  now proves both postures: `auto` keeps the old blind behavior, explicit
  side count yields the official 3 dB lab delta.
- `apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts`
  pins the user-visible lab/field/building cards for both legacy `auto`
  and explicit side-count exact anchors.

The proprietary FireLine timber row remains `secondary_benchmark`.
The live direct double-board timber preset remains formula/low-confidence
because it still does not exact-match a landed source row.

## Executable Evidence

Targeted tests passed before the closeout docs:

- engine Gate C targets: 4 files / 28 tests green
- web Gate C targets: 3 files / 28 tests green

Closeout validation:

- `pnpm calculator:gate:current` green:
  - engine focused gate: 77 files / 369 tests
  - web focused gate: 33 files / 166 passed + 18 skipped
  - build: 5/5 tasks
  - whitespace guard: clean
- `pnpm check` green:
  - engine full suite: 210 files / 1189 tests
  - web full suite: 147 files / 860 passed + 18 skipped
  - build: 5/5 tasks with the known non-fatal `sharp/@img` warnings
- `pnpm --filter @dynecho/web typecheck` green after build to restore the
  generated Next route-type reference.

## Next Selected Slice

`floor_field_continuation_expansion_v1`

Planning surface:
[SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md](./SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md).

Start with Gate A no-runtime inventory:

1. Re-run `pnpm calculator:gate:current`.
2. Inventory current floor lab, field, and building continuation tests.
3. Add representative value/support/origin/card pins for floor
   continuations.
4. Do not fix runtime behavior until the inventory names a real drift.

## Boundaries Still Active

- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  heavy-concrete parity or formula scope, reinforced-concrete reopening,
  wall-selector behavior, or timber-stud widening from nearby green tests.
- Do not retune broad wall timber/resilient formulas from the new exact
  side-count rows.
- Keep `project_access_policy_route_integration_v1` deferred until the
  selected calculator slice closes or priority explicitly changes.

## Documents Updated In This Checkpoint

- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/MASTER_PLAN.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md`
- `docs/calculator/SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md`
- `tools/dev/run-calculator-current-gate.ts`
- this checkpoint file
