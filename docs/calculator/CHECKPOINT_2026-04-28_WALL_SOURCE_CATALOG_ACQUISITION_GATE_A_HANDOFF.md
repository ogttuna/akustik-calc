# Checkpoint - Wall Source Catalog Acquisition Gate A Handoff

Date: 2026-04-28

## What Landed

`wall_source_catalog_acquisition_v1` Gate A landed no-runtime:

- `packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts`
  records the source-target inventory, required row metadata, import
  readiness decisions, negative boundaries, and Gate B decision.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate A
  contract in the focused calculator gate.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate A Decision

Gate A found one bounded direct family and no runtime-ready new import:

| Target | Gate A readiness | Runtime now |
|---|---|---|
| W111 / W112 / W115 / W119 and adjacent manufacturer framed systems | `bounded_existing_rows` | frozen; existing bounded rows already fit |
| No-stud empty or porous double-leaf walls | `needs_research` | frozen until direct row or formula tolerance owner |
| Timber double-board stud walls | `needs_research` | frozen until matching board count, cavity, fill, stud/coupling, and side-count metadata |
| CLT wall assemblies | `needs_research` | frozen until wall-specific CLT row or laminated-leaf tolerance |
| Lined-massive / heavy-core concrete | `needs_research` | frozen as screening until topology source row or bounded family rule |
| Floor / impact / product-delta adjacent context | `reject_adjacent_context` | never wall source truth |

Every future source row must carry source label, URL/local path,
page/table/row locator, retrieval date, exact layer order, material
properties, mounting/cavity/stud/side-count metadata where relevant,
metric context, tolerance, local material mapping confidence, precedence
impact, and paired engine/web tests before visible behavior can move.

Gate B should close source-pack readiness no-runtime unless a direct row
pack is actually complete. A future import slice is allowed only after a
direct source row pack names its metric owner, tolerance, protected
negative boundaries, and paired engine value plus web route-card tests.

## Validation

- Baseline before Gate A edits: `pnpm calculator:gate:current` green
  with engine 110 files / 505 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate A validation:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-source-catalog-acquisition-gate-a-contract.test.ts --maxWorkers=1`
  green with 1 file / 6 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 111 files / 511 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- `git diff --check` clean.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Next implementation file:

- `packages/engine/src/wall-source-catalog-acquisition-gate-b-contract.test.ts`

Keep Gate B no-runtime unless a direct row pack with complete metadata,
tolerance, protected negative boundaries, and paired engine/web tests is
ready. Do not use adjacent framed, floor CLT, floor impact,
product-delta, timber single-board, or generic formula-context rows as
wall source truth.
