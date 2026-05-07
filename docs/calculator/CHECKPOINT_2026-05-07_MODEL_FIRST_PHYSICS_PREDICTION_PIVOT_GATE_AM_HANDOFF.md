# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate AM

Document role: handoff for the active Dynamic Calculator slice after
Gate AM.

## Scope

Gate AM follows Gate AL's source-owned same-stack ISO lab `DeltaLw`
holdout guard. The purpose was a narrow acquisition pass for steel-floor
or steel-joist `DeltaLw` packets that could own the Gate AK fields. The
purpose was not to turn DynEcho into a source catalog or loosen the
acceptance rule to make a near-miss count.

## Landed

- New Gate AM contract:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`.
- New Gate AM helper:
  `packages/engine/src/steel-floor-formula-source-owned-delta-lw-source-packet-acquisition.ts`.
- Current accepted source-owned same-stack ISO lab `DeltaLw` holdout
  count remains zero.
- Narrow source leads are now executable:
  - REGUPOL US L0146 steel deck / steel joist rows: rejected as
    wrong-basis STC/IIC evidence, not ISO lab `DeltaLw`.
  - REGUPOL sonus core 5 steel C-joist lead: rejected as wrong-basis
    STC/IIC evidence.
  - REGUPOL sonusfit / sonus curve ISO `DeltaLw` rows: rejected as
    solid/concrete reference-floor evidence, not same-stack steel-floor
    formula holdouts.
  - SoundAdvisor ISO `DeltaLw` text: retained as a metric-scope
    boundary reference, not as a candidate packet.
- Runtime calculator values did not move.
- Broad source-library crawl remains blocked because the next useful
  calculator step is source-absent steel-floor formula uncertainty and
  error-budget work.

## Selection

Gate AM landed status:

`gate_am_source_packet_acquisition_landed_no_runtime_selected_source_absent_uncertainty_gate_an`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts`

Selected next action:

`gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`

Gate AN should make the source-absent steel-floor formula expose an
explicit error budget for `Ln,w` and `DeltaLw`, preserve exact-source
precedence, keep Gate AK/AM source packet rules unchanged, and add
hostile cases for complete, partial, duplicated, and unsafe formula
inputs.

## Validation

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`
  passed: 1 file / 5 tests.
- `pnpm --filter @dynecho/engine typecheck` passed.
- Focused Gate AJ/AK/AL/AM contract run passed: 4 files / 19 tests.
- Full `pnpm calculator:gate:current` passed:
  - engine: 319 files / 1807 tests;
  - web: 65 files / 284 passed + 18 skipped;
  - repo build: 5/5 tasks successful;
  - whitespace guard clean.
- `git diff --check` passed.

Known non-fatal warnings remain the Node/Vitest Zustand persist storage
warning and optional `sharp` / `@img` Next build warnings through the
DOCX export dependency.

## Source Notes

- REGUPOL US test report index:
  `https://acoustics.regupol.us/downloads/test-reports/`
  shows steel deck / steel joist rows with STC/IIC values and separate
  `DeltaLw` rows on concrete or solid reference assemblies.
- REGUPOL sonus core 5:
  `https://acoustics.regupol.com/products/range/regupol-sonus-core/regupol-sonus-core-5/`
  remains wrong-basis context for the checked steel C-joist lead.
- SoundAdvisor:
  `https://philadelphia.soundadvisor.com/`
  describes ISO `DeltaLw` as a comparison on a 150 mm concrete slab
  without ceiling; useful boundary evidence, not a steel-floor packet.
