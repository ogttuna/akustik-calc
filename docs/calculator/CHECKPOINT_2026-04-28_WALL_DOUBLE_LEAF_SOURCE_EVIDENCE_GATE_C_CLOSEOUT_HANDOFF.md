# Checkpoint - Wall Double-Leaf Source Evidence Gate C Closeout Handoff

Date: 2026-04-28

## What Landed

`wall_double_leaf_source_evidence_acquisition_v1` Gate C closed
no-runtime:

- `packages/engine/src/post-wall-double-leaf-source-evidence-acquisition-v1-next-slice-selection-contract.test.ts`
  closes the source-evidence slice and selects
  `wall_source_catalog_acquisition_v1`.
- `docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md`
  is the selected planning surface for the next slice.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate C
  closeout contract.

No acoustic runtime values, formulas, confidence classes, support,
evidence text, warnings, API behavior, or web route-card copy changed.

## Closeout Decision

Gate A and Gate B proved the current wall double-leaf / stud-cavity
posture is honest but source-limited:

- generic empty/no-stud double-leaf rows remain frozen until a direct
  source row or formula tolerance owner exists;
- W111 / W112 single-stud framed rows already fit current tolerances;
- W112 field rows already use exact verified field proxy anchors;
- W115 / W119 split-cavity rows already match current
  `double_stud_system` behavior;
- no paired web route-card work is required because no visible behavior
  moved.

The next accuracy path is source acquisition rather than another retune.
`wall_source_catalog_acquisition_v1` starts with a no-runtime Gate A
inventory of candidate wall source rows, required metadata, import
readiness, and negative boundaries.

Forward pointer: that source-catalog slice has now advanced through
Gate B in
[CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md).
Use the Gate B checkpoint for the active handoff.

## Validation

- Baseline before Gate C edits: `pnpm calculator:gate:current` green
  with engine 109 files / 500 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate C validation:
  `pnpm --filter @dynecho/engine exec vitest run src/post-wall-double-leaf-source-evidence-acquisition-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green with 1 file / 5 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 110 files / 505 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- `git diff --check` clean.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Gate A implementation file:

- `packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts`

Gate A stayed no-runtime and classified source catalog targets and
acceptance rules before any import, runtime, confidence, support, or
route-card behavior changes. Continue from the Gate A handoff.
