# Checkpoint - Wall Source Catalog Acquisition Gate B Handoff

Date: 2026-04-28

## What Landed

`wall_source_catalog_acquisition_v1` Gate B landed no-runtime:

- `packages/engine/src/wall-source-catalog-acquisition-gate-b-contract.test.ts`
  closes source-pack readiness for the six Gate A target families.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate B
  contract in the focused calculator gate.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate B Decision

No direct runtime import pack is ready now.

| Source pack | Gate B status | Why it stays frozen |
|---|---|---|
| Manufacturer framed W111 / W112 / W115 / W119 | `already_reconciled_no_new_import` | existing bounded rows already fit current runtime; adjacent rows still need their own pack and route-card tests |
| No-stud empty / porous double-leaf | `blocked_direct_source_missing` | no direct no-stud row, no empty-vs-porous split source, no named formula tolerance owner |
| Timber double-board stud | `blocked_live_topology_missing` | corpus does not match the live double-board material/fill/cavity/stud topology |
| CLT wall | `blocked_wall_specific_source_missing` | floor CLT rows are not wall source truth; wall-specific row or laminated-leaf tolerance is missing |
| Lined-massive / heavy-core concrete | `blocked_lining_rule_missing` | no source row or bounded family rule for lining topology; screening remains honest |
| Floor / impact / product-delta adjacent rows | `rejected_not_wall_source_truth` | not eligible for wall import; can only explain gaps |

Gate B keeps the import acceptance criteria explicit: a future import
needs a direct wall source row, complete row metadata, named metric
context and tolerance owner, pinned precedence impact, executable
negative boundaries, and paired engine value plus web route-card tests.

Forward pointer: Gate C has now closed this source-catalog slice
no-runtime in
[CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md).
Use that checkpoint for the active handoff.

## Validation

- Baseline before Gate B edits: `pnpm calculator:gate:current` green
  with engine 111 files / 511 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate B validation:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-source-catalog-acquisition-gate-b-contract.test.ts --maxWorkers=1`
  green with 1 file / 6 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 112 files / 517 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- `git diff --check` clean.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

This checkpoint is now historical. The active implementation file is
listed in the Gate C closeout checkpoint. Do not select a runtime import
slice unless a complete direct row pack appears with source metadata,
tolerance, protected negative boundaries, and paired engine/web tests.
