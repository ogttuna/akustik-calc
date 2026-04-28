# Checkpoint - Wall Lined Massive Heavy-Core Source Research Gate C Closeout Handoff

Date: 2026-04-28

## What Landed

`wall_lined_massive_heavy_core_source_research_v1` Gate C closed
no-runtime:

- `packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice after Gate A found no direct wall
  source import and no bounded formula/tolerance gate.
- The selected next slice is
  `calculator_source_gap_revalidation_v2`, with planning surface
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md`.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate C Decision

The current generated `wall-screening-concrete` route remains
screening-tier and medium-confidence:

- generated lab `Rw=57`;
- generated field `R'w=55`;
- generated field-context `DnT,w=56`;
- generated `DnT,A=54.9`;
- dynamic family `lined_massive_wall`;
- strategy `lined_massive_blend`;
- supported field outputs `R'w`, `Dn,w`, `DnT,w`, and `DnT,A`.

Gate C closed no-runtime because Gate A established:

| Blocker | Closeout result |
|---|---|
| Wall-specific lined concrete / heavy masonry rows | missing; no import-ready row has wall scope, lining, cavity/absorber, mounting, metric context, and tolerance metadata |
| Knauf CC60 concrete rows | floor-only source truth; not wall lining `Rw` tolerance |
| Manufacturer lining context | adjacent and unimported; mounting, coupling, side order, boundary, and tolerance metadata are insufficient for runtime import |
| ISO / Sharp / Davy / lined-massive formulas | relevant framework context but not a named bounded local single-number tolerance owner |
| Selector value pins and deep-hybrid rows | stability boundaries, not source truth |
| Route-card work | not required because no visible values/support/confidence/evidence/missing-input behavior changed |

## Next Slice

`calculator_source_gap_revalidation_v2` is selected because the wall
source-research chain has now closed no-runtime for no-stud
double-leaf, timber double-board, CLT / mass-timber wall, and lined
massive / heavy-core wall. The next honest step is a fresh cross-floor /
wall source-accuracy rerank before any new runtime movement or
productization-only work.

Next implementation file:

- `packages/engine/src/calculator-source-gap-revalidation-v2-gate-a-contract.test.ts`

Gate A should remain no-runtime and should rank:

- wall source-chain holdouts;
- floor fallback low-confidence and possible bounded source evidence;
- floor field-continuation / reorder accuracy surfaces;
- historical blocked-source families;
- many-layer, reorder, invalid-thickness, unsupported-output guardrails;
- optional architecture guard carves;
- productization-only work.

## Validation

- Baseline before Gate C edits: `pnpm calculator:gate:current` green
  with engine 121 files / 564 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, whitespace guard clean, and the known non-fatal
  `sharp/@img` warnings.
- Targeted Gate C validation:
  `pnpm --filter @dynecho/engine exec vitest run src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green with 1 file / 5 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 122 files / 569 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, whitespace guard clean, and the known non-fatal
  `sharp/@img` warnings.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Then implement
`packages/engine/src/calculator-source-gap-revalidation-v2-gate-a-contract.test.ts`.
