# Checkpoint - 2026-05-08 Model-First Physics Prediction Pivot Gate AR

Slice:

`calculator_model_first_physics_prediction_pivot_v1`

Landed gate:

`gate_ar_steel_floor_formula_calibration_evidence_intake_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts`

Selection status:

`gate_ar_calibration_evidence_intake_landed_no_runtime_selected_owner_evidence_targeting_gate_as`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts`

Selected next action:

`gate_as_steel_floor_formula_owner_evidence_targeting_plan`

## What Landed

Gate AR turns the Gate AQ calibration-readiness contract into a concrete
evidence-intake ledger. It classifies current local Gate AK and Gate AM
candidate evidence against the Gate AQ owner map without moving runtime
values, tightening tolerances, or promoting any source row.

Covered cases:

1. Gate AQ term owners are the only acceptance surface for steel-floor
   formula calibration evidence.
2. Current local AK/AM evidence is classified into accepted,
   missing-owner-field, wrong-basis, wrong-reference-floor,
   product/inferred, and boundary-only buckets.
3. Current local accepted source-owned calibration packet count remains
   zero.
4. Product-only, inferred, STC/IIC, ASTM/field/building,
   concrete-reference, and boundary-only evidence remains unable to
   tighten the lab steel-floor formula corridor.
5. A future source-owned same-stack ISO `DeltaLw` packet can satisfy the
   `source_owned_delta_lw_holdout_absence` Gate AQ owner, but still
   leaves residual-policy thresholds on `hold` until enough paired
   negative boundaries, holdouts, source-owned open-web inputs, and
   basis owners exist.
6. Runtime values remain `Ln,w 55.6` and `DeltaLw 22.4`; tolerances
   remain `+/-4.5 dB` and `+/-2.0 dB`.
7. Exact measured rows stay precedence and lab, field, ASTM, and
   building-prediction bases remain separate.

## Next Step

Gate AS should target the missing source-owned owner evidence from Gate
AQ/AR, not crawl broadly and not retune. The highest-signal next work is
an owner-evidence targeting plan that ranks which Gate AQ owner to pursue
first, states the packet shape, and keeps any candidate row as
calibration/holdout evidence unless source-owned residual policy
thresholds are satisfied.

Validation result:

Focused Gate AR validation completed on 2026-05-08: Gate AR engine
contract passed 1 file / 7 tests. Focused Gate AQ/AR continuity passed
2 files / 14 tests. Engine DTS build passed. Full `pnpm
calculator:gate:current` passed with engine 324 files / 1839 tests, web
66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` passed with lint/typecheck
clean, engine 449 files / 2641 tests, web 172 files / 961 passed + 18
skipped, and repo build 5/5 successful. Known non-fatal warnings remain
the Node/Vitest Zustand persist storage warning and optional `sharp` /
`@img` Next build warnings via the DOCX export dependency.
