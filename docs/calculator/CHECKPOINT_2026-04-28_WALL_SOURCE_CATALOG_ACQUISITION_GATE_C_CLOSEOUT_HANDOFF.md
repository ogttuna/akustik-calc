# Checkpoint - Wall Source Catalog Acquisition Gate C Closeout Handoff

Date: 2026-04-28

## What Landed

`wall_source_catalog_acquisition_v1` Gate C closed no-runtime:

- `packages/engine/src/post-wall-source-catalog-acquisition-v1-next-slice-selection-contract.test.ts`
  closes the source-catalog slice and selects
  `wall_no_stud_double_leaf_source_research_v1`.
- `docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md`
  is the selected planning surface for the next calculator accuracy
  slice.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate C
  closeout contract.

No acoustic runtime values, formulas, confidence classes, support,
evidence text, warnings, API behavior, or web route-card copy changed.

## Closeout Decision

Gate A and Gate B proved the current wall source catalog posture is
honest but source-limited:

- manufacturer framed W111 / W112 / W115 / W119 rows already fit
  current behavior and do not need a new import;
- no-stud empty/porous double-leaf remains blocked by missing direct
  rows or a named formula tolerance owner;
- timber double-board lacks a live-topology source match;
- CLT wall lacks wall-specific source rows;
- lined-massive / heavy-core concrete lacks a bounded lining rule;
- floor, impact, product-delta, report, and adjacent context rows are
  rejected as wall source truth.

The next accuracy path is direct source/tolerance research for
no-stud double-leaf walls. That target is common enough to matter for
private/internal use, narrow enough to avoid guessing, and still fully
blocked without direct evidence.

Forward pointer: the selected no-stud source research slice has now
landed Gate A in
[CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A_HANDOFF.md).
Use that checkpoint for the active handoff.

## Validation

- Baseline before Gate C edits: `pnpm calculator:gate:current` green
  with engine 112 files / 517 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate C validation:
  `pnpm --filter @dynecho/engine exec vitest run src/post-wall-source-catalog-acquisition-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green with 1 file / 5 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 113 files / 522 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- `git diff --check` clean.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

This checkpoint is now historical. The active implementation file is
listed in the no-stud Gate A handoff. Runtime, confidence, support, and
route-card behavior must remain frozen until a direct row or bounded
formula tolerance is proven with paired tests.
