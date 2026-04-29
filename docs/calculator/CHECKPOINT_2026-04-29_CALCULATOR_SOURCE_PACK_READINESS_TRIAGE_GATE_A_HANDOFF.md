# Checkpoint - Calculator Source Pack Readiness Triage Gate A Handoff

Date: 2026-04-29

## Summary

`calculator_source_pack_readiness_triage_v1` Gate A landed as a
no-runtime planning contract. It ranks the current source-pack
candidates, keeps every candidate `runtimeImportReadyNow: false`, and
selects `clt_mass_timber_wall_source_pack_extraction_v1` only as a
no-runtime source-row and metric-context extraction slice.

No acoustic formulas, runtime values, support classes, confidence
classes, evidence tiers, API shape, route-card values, output-card
statuses, proposal/report copy, or workbench input behavior changed.

## Implementation

Executable Gate A contract:

`packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts`

Focused gate runner update:

`tools/dev/run-calculator-current-gate.ts`

Planning surfaces:

- `docs/calculator/SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md`
- `docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SOURCE_GAP_LEDGER.md`
- `docs/calculator/MASTER_PLAN.md`
- `AGENTS.md`

## Decision

Gate A classified the readiness ladder as:

1. CLT / mass-timber wall - selected for no-runtime row/metric
   extraction only.
2. Timber double-board stud wall - still runtime-blocked until a direct
   live-stack row or bounded formula tolerance owner exists.
3. No-stud double-leaf wall - still runtime-blocked until no-stud /
   no-rail row mapping or local Davy/Sharp tolerance ownership exists.
4. Generated floor fallback - still low-confidence/screening until an
   exact Pliteq/UBIQ topology match or bounded steel/open-web family
   rule exists.
5. Lined-massive / heavy-core wall - still screening until a
   wall-specific lined-heavy source row or bounded lining rule exists.
6. Historical blocked families - remain fail-closed until new evidence
   satisfies their old blockers.

The selected follow-up is:

`clt_mass_timber_wall_source_pack_extraction_v1`

First target:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`

Planning doc:

`docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md`

## Source Boundary

The CLT / mass-timber follow-up may extract WoodWorks/NRC source
locators and metric context, but it must not import rows or promote the
CLT wall route until a later contract proves:

- exact wall topology and material/thickness mapping;
- metric context mapping or explicit rejection for STC/ASTC/IIC rows;
- tolerance ownership;
- protected negative boundaries;
- paired engine and web route-card/report tests.

## Validation

- Targeted Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts --maxWorkers=1`
  passed: 1 file / 6 tests.
- Focused current gate:
  `pnpm calculator:gate:current` passed after adding the Gate A
  contract to the runner: engine 133 files / 630 tests; web 45 files /
  216 passed + 18 skipped; build 5/5.
- Broad repo gate:
  `pnpm check` passed after the Gate A contract and doc sync:
  lint/typecheck green; engine 266 files / 1450 tests; web 157 files /
  890 passed + 18 skipped; build 5/5.
- Known non-fatal build warnings:
  optional `sharp/@img` package warnings through
  `@turbodocx/html-to-docx`.
- Whitespace guard: clean.
