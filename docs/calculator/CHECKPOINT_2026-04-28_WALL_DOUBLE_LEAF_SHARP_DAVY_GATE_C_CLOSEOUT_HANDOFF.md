# Checkpoint - Wall Double-Leaf Sharp/Davy Gate C Closeout Handoff

Date: 2026-04-28

Status: Gate C landed no-runtime. No acoustic runtime values, formulas,
confidence scores, evidence tiers, output support, source posture, or
web route-card behavior changed.

Closed implementation slice:
`wall_double_leaf_sharp_davy_scoping_v1`.

New selected implementation slice:
`wall_double_leaf_source_evidence_acquisition_v1`.

## What Landed

- `packages/engine/src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts`
  closes `wall_double_leaf_sharp_davy_scoping_v1` no-runtime.
- `docs/calculator/SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md`
  is the new selected planning surface.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate C
  closeout contract.

## Closeout Decision

Gate A and Gate B proved that the current representative double-leaf /
stud-cavity values are finite and guarded, but not source/tolerance
eligible for runtime movement:

| Case | Preserved field `R'w` | Gate C posture |
|---|---:|---|
| Empty double-leaf, no stud metadata | 46 | formula-owned, no exact/lab-fallback row |
| Porous double-leaf, no stud metadata | 41 | formula-owned, no exact/lab-fallback row |
| Explicit single-stud metadata | 37 | formula-owned, low confidence, no bounded rule |
| Explicit double-stud / split-cavity metadata | 52 | formula-owned, no stack source row |

Gate C therefore selects source-evidence acquisition instead of a
runtime retune. The selected next slice must classify direct stack rows,
family benchmarks, and formula tolerances before any value movement.

## New Slice

Next plan:
[SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md)

First implementation file:
`packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts`

Gate A requirements:

1. inventory source/tolerance candidates for empty double-leaf,
   porous-filled double-leaf, single-stud, and double-stud / split-cavity
   walls;
2. require source label/path, layer metadata, reported `Rw` or spectrum,
   cavity/fill/stud/coupling metadata, tolerance/fit threshold, and
   import decision;
3. keep exact catalog, resilient side-count, timber, single-leaf,
   lined-massive, heavy-core, CLT, direct-coupled, and triple-leaf
   boundaries out of the retune lane;
4. close no-runtime if evidence is too broad or topology-incomplete.

## Validation

- `pnpm --filter @dynecho/engine exec vitest run src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- `pnpm calculator:gate:current` green:
  - engine 107 files / 490 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

Broad `pnpm check` was not rerun for this no-runtime test/docs slice;
the last broad validation remains the 2026-04-28 green run from the
Gate B-ready revalidation checkpoint.

## Boundaries

- Keep `/home/ogttuna/Dev/Machinity/Acoustic2` read-only.
- Do not infer source truth without a dedicated source row, benchmark
  evidence note, formula tolerance owner, or bounded family rule.
- Do not use floor CLT/floor impact rows as wall double-leaf evidence.
- Do not merge direct-coupled or triple-leaf/multi-cavity shapes into
  decoupled double-leaf.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall,
  floor fallback, or wall exact-row follow-ups from nearby green tests
  alone.
