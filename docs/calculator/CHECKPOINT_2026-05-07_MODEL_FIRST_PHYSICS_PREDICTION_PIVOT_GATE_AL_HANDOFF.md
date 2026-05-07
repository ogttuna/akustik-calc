# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate AL

Document role: handoff for the active Dynamic Calculator slice after
Gate AL.

## Scope

Gate AL continues the steel-floor formula corridor after Gate AK made
source-owned same-stack lab `DeltaLw` ownership executable. The goal was
not to weaken the gate or accept product/source-library evidence as the
product; the goal was to decide whether a first real measured
source-owned `DeltaLw` holdout is present and to keep the formula
residual policy honest.

## Landed

- New Gate AL contract:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`.
- New Gate AL helper:
  `packages/engine/src/steel-floor-formula-first-source-owned-delta-lw-holdout.ts`.
- Current candidate inventory still has zero accepted measured
  source-owned same-stack ISO lab `DeltaLw` holdouts.
- Near-miss rejections are now executable for:
  - Pliteq steel-joist `Ln,w`-only rows;
  - UBIQ open-web `Ln,w`/`Rw` rows without owned `DeltaLw`;
  - product-catalog `DeltaLw` rows that do not own the same-stack steel
    assembly;
  - Annex/companion inferred `DeltaLw` values;
  - REGUPOL steel C-joist ASTM/IIC/STC basis evidence, which is useful
    context but not an ISO lab `DeltaLw` holdout.
- A future acceptance probe proves that a same-stack ISO lab packet
  counts only when the metric value and every Gate AK owner field are
  source-owned.
- Runtime calculator values did not move.

## Selection

Gate AL landed status:

`gate_al_source_owned_delta_lw_first_holdout_guard_landed_no_runtime_selected_source_packet_acquisition_gate_am`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`

Selected next action:

`gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`

Gate AM should search narrowly for ISO 10140 / ISO 717-2 steel-floor or
steel-joist same-stack lab sources that publish `DeltaLw` and own the
Gate AK fields. If no packet qualifies, land the rejection ledger and
next acquisition decision without weakening the Gate AK/AL rule.

## Validation

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`
  passed: 1 file / 4 tests.
- `pnpm --filter @dynecho/engine typecheck` passed.
- Focused Gate AJ/AK/AL contract run passed: 3 files / 14 tests.
- First `pnpm calculator:gate:current` run exposed stale Gate AJ/AK doc
  alignment after the plan was advanced to Gate AL. This was fixed by
  preserving the historical Gate AK selected-action string in
  `NEXT_IMPLEMENTATION_PLAN.md`.
- Final `pnpm calculator:gate:current` passed:
  - engine: 318 files / 1802 tests;
  - web: 65 files / 284 passed + 18 skipped;
  - repo build: 5/5 tasks successful;
  - whitespace guard clean.
- `git diff --check` passed.

Known non-fatal warnings remain the Node/Vitest Zustand persist storage
warning and optional `sharp` / `@img` Next build warnings through the
DOCX export dependency.

## Notes

This gate intentionally did not “find a source row” by broadening what
counts as source-owned. That is important for calculator accuracy: a
wrong-basis or product-only `DeltaLw` value would make the steel-floor
formula look better while actually training the calculator on a
different metric scope.
