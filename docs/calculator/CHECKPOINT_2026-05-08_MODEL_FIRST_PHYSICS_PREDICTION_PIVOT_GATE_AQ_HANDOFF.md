# Checkpoint - 2026-05-08 Model-First Physics Prediction Pivot Gate AQ

Slice:

`calculator_model_first_physics_prediction_pivot_v1`

Landed gate:

`gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts`

Selection status:

`gate_aq_error_budget_calibration_readiness_landed_no_runtime_selected_calibration_evidence_intake_gate_ar`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts`

Selected next action:

`gate_ar_steel_floor_formula_calibration_evidence_intake_plan`

## What Landed

Gate AQ turns the Gate AO/AP steel-floor formula error-budget surface
into an executable calibration-readiness contract. It does not move
runtime values, retune the formula, or promote any source row.

Covered cases:

1. Every current runtime steel-floor formula budget term maps to a
   source-owned evidence owner and current blocker.
2. The term map is exhaustive against actual runtime
   `ImpactErrorBudget.terms`; an unmapped new term fails closed.
3. Current `Ln,w` and `DeltaLw` policies still resolve to `hold`.
4. Runtime values remain `Ln,w 55.6` and `DeltaLw 22.4`; tolerances
   remain `+/-4.5 dB` and `+/-2.0 dB`.
5. Product-only, inferred, STC/IIC, field/building,
   wrong-reference-floor, concrete-reference, and boundary-only evidence
   cannot shrink budget terms or tighten the steel formula corridor.
6. Future `hold`, `tighten`, `widen`, and `retune_candidate` branches
   are executable no-runtime policy cases.
7. Gate AP hostile-input stability and Gate AO payload shape stay in
   scope for the next evidence-intake work.

## Next Step

Gate AR should intake or classify calibration evidence against the Gate
AQ owner map. It is an evidence-intake / decision-ledger gate, not an
automatic source crawl or formula retune. A candidate packet may only
affect readiness if it satisfies the source-owned owner fields and keeps
lab, field, and building-prediction bases separate.

Validation result:

Focused Gate AQ validation completed on 2026-05-08: Gate AQ engine
contract passed 1 file / 7 tests. Focused Gate AP/AQ continuity passed
2 files / 14 tests. Full `pnpm calculator:gate:current` passed with
engine 323 files / 1832 tests, web 66 files / 286 passed + 18 skipped,
repo build 5/5 successful, and whitespace guard clean. Post-doc
`git diff --check` passed. Broad `pnpm check` also passed after Gate AQ:
lint, typecheck, engine 448 files / 2634 tests, web 172 files / 961
passed + 18 skipped, and build 5/5 successful. Known non-fatal warnings
remain the Node/Vitest Zustand persist storage warning and optional
`sharp` / `@img` Next build warnings via the DOCX export dependency.
