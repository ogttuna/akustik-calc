# Checkpoint - Calculator Source Gap Revalidation v2 Gate A Handoff

Date: 2026-04-28

## What Landed

`calculator_source_gap_revalidation_v2` Gate A landed no-runtime:

- `packages/engine/src/calculator-source-gap-revalidation-v2-gate-a-contract.test.ts`
  re-ranks the remaining calculator source and accuracy gaps after the
  wall source-research chain closed no-runtime.
- The selected next slice is
  `floor_layer_order_invariance_expansion_v1`, with planning surface
  `docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md`.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate A Decision

Gate A selected a bounded floor layer-order accuracy audit because:

- wall source-chain holdouts remain source-blocked;
- historical blocked-source families remain fail-closed;
- floor fallback remains low-confidence without exact source topology or
  a bounded steel/open-web family rule;
- floor field-continuation already has a representative no-runtime
  audit and found no required Gate B fix;
- broad arbitrary floor reorder value invariance remains unclaimed;
- user layer moves/reorders are a direct calculator correctness and
  edge-case risk that can be audited without new source evidence.

| Candidate | Gate A status | Why |
|---|---|---|
| Wall no-stud / timber double-board / CLT / lined-massive holdouts | not selected | no import-ready row or bounded formula/tolerance owner exists |
| `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector | not selected | remain closed fail-closed without fresh source evidence |
| Floor steel fallback | not selected | still low-confidence; lacks exact Pliteq/UBIQ topology or bounded family rule |
| Floor field-continuation reopen | not selected | representative floor field/building audit is already closed no-runtime |
| Optional dynamic-airborne guard carves | not selected | C6 architecture hygiene is closed; remaining carves are optional backlog |
| Productization-only work | not selected | calculator accuracy has a bounded ready slice |
| Floor layer-order invariance expansion | selected | engine-addressable user-edit risk; can audit role-defined vs raw order behavior no-runtime |

## Next Slice

`floor_layer_order_invariance_expansion_v1` should start with Gate A:

- target file:
  `packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`;
- planning file:
  `docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md`.

Gate A should not claim broad arbitrary floor reorder value invariance.
It should inventory narrower, defensible invariants:

- role-defined exact/bound floor rows under UI order changes;
- raw terminal/helper stacks where order sensitivity is expected;
- raw fail-closed impact representatives;
- many-layer or split/duplicate floor stacks after representative order
  edits;
- numeric finiteness and supported/unsupported output buckets.

## Validation

- Baseline before Gate A edits: `pnpm calculator:gate:current` green
  with engine 122 files / 569 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, whitespace guard clean, and the known non-fatal
  `sharp/@img` warnings.
- Targeted Gate A validation:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v2-gate-a-contract.test.ts --maxWorkers=1`
  green with 1 file / 6 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 123 files / 575 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, whitespace guard clean, and the known non-fatal
  `sharp/@img` warnings.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Then implement
`packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`.
