# Checkpoint - CLT / Mass-Timber Wall Source Pack Extraction Gate A Handoff

Date: 2026-04-29

## Summary

`clt_mass_timber_wall_source_pack_extraction_v1` Gate A landed as a
no-runtime source-group and metric-context extraction contract. It
classifies WoodWorks/NRC CLT, NLT, and double-CLT wall source surfaces
as later row-mapping candidates, formula-tolerance context, or
rejection-only context.

No acoustic formulas, runtime values, support classes, confidence
classes, evidence tiers, API shape, route-card values, output-card
statuses, proposal/report copy, or workbench input behavior changed.

## Implementation

Executable Gate A contract:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`

Focused gate runner update:

`tools/dev/run-calculator-current-gate.ts`

Planning surfaces:

- `docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SOURCE_GAP_LEDGER.md`
- `docs/calculator/MASTER_PLAN.md`
- `AGENTS.md`

## Source Classification

Gate A classifies:

- WoodWorks Table 7 Single CLT Wall:
  `eligible_for_later_row_mapping`, but blocked by exact row selection,
  STC/FSTC/ASTC metric handling, tolerance ownership, and paired
  visible tests.
- WoodWorks Table 8 Single NLT Wall:
  `formula_tolerance_context_only` because there is no live NLT wall
  route and the metric context is STC / transmission-loss oriented.
- WoodWorks Table 9 Double CLT Wall:
  `eligible_for_later_row_mapping`, but only for a future double-CLT
  wall family. It does not widen the current single-leaf `wall-clt-local`
  route.
- WoodWorks Mass Timber Fire & Acoustic Database:
  `rejection_context_only` until a specific underlying report, table,
  row, and metric context are named.
- NRC RR-335 mass-timber report:
  `formula_tolerance_context_only` for ASTC, flanking, and
  transmission-loss context. It does not promote direct `Rw` / `R'w`
  values.
- NRC NLT addendum:
  `formula_tolerance_context_only` for NLT STC and one-third-octave
  transmission-loss context.
- Local Dataholz CLT exact rows:
  `rejection_context_only` for CLT wall import because they remain
  floor-only source truth.

## Decision

The selected next action remains inside the same slice:

`gate_b_bound_metric_mapping_and_formula_tolerance_decision_no_runtime`

Next target:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts`

Gate B should decide whether a bounded metric-mapping or
formula-tolerance slice is defensible. If it is not, Gate B should
select a no-runtime closeout / roadmap-only path.

## Validation

- Targeted Gate A engine contract:
  `pnpm --filter @dynecho/engine exec vitest run src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`
  passed: 1 file / 7 tests.
- Focused current calculator gate:
  `pnpm calculator:gate:current` passed: engine 134 files / 637 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with the known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- Broad repo gate:
  `pnpm check` passed: lint/typecheck green, engine 267 files / 1457
  tests, web 157 files / 890 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings.
