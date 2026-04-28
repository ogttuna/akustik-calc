# Checkpoint - Wall Double-Leaf Source Evidence Gate B Handoff

Date: 2026-04-28

## What Landed

`wall_double_leaf_source_evidence_acquisition_v1` Gate B landed as a
no-runtime reconciliation contract:

- `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts`
  compares bounded Knauf W111 / W112 / W115 / W119 framed-wall rows
  against current dynamic lab and field outputs.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate B
  contract in the focused calculator gate.
- No runtime values, formulas, confidence classes, output support,
  evidence text, warnings, API behavior, or web route-card copy changed.

## Gate B Result

The bounded rows already fit the source-owned corridors:

| Family | Rows reconciled | Result |
|---|---:|---|
| W111 single-stud holdouts | 4 lab/field rows | current max error 0.3 dB, inside 3 dB tolerance |
| W112 single-stud rows | 8 lab / exact-field rows | lab holdouts match current values; exact field proxy anchors match exactly |
| W115 / W119 double-stud split-cavity rows | 4 lab/field rows | current values match source expected values exactly |

The current double-stud rows remain on `double_stud_system` /
`double_stud_surrogate_blend+double_stud_calibration`, and W112 field
rows remain on the existing `exact_verified_field_proxy_anchor` lane.

## Decision

Gate B does **not** authorize a runtime retune. The right next step is a
small Gate C closeout that:

1. closes `wall_double_leaf_source_evidence_acquisition_v1` no-runtime;
2. keeps generic empty/no-stud double-leaf rows frozen until a direct
   source row or formula tolerance owner exists;
3. selects the next calculator accuracy gap from the current roadmap.

Any later visible movement for these wall families still needs paired
engine value tests and web route-card tests.

## Validation

- Baseline before edits: `pnpm calculator:gate:current` green with
  engine 108 files / 496 tests, web 43 files / 211 passed + 18 skipped,
  build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate B validation:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts --maxWorkers=1`
  green with 1 file / 4 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 109 files / 500 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- `git diff --check` clean.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Do not change runtime during Gate C unless the selected next-slice
contract explicitly changes priority. The immediate implementation file
should be a no-runtime post/closeout contract for
`wall_double_leaf_source_evidence_acquisition_v1`.
