# Checkpoint - 2026-05-08 Model-First Physics Prediction Pivot Gate AS

Slice:

`calculator_model_first_physics_prediction_pivot_v1`

Landed gate:

`gate_as_steel_floor_formula_owner_evidence_targeting_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts`

Selection status:

`gate_as_owner_evidence_targeting_landed_no_runtime_selected_same_stack_delta_lw_packet_target_gate_at`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts`

Selected next action:

`gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan`

## What Landed

Gate AS turns the Gate AQ owner map and Gate AR evidence ledger into a
ranked owner-evidence targeting decision. It does not search broadly,
retune the formula, promote any source row, or change runtime values.

Covered cases:

1. All seven Gate AQ evidence owners are ranked by calculator impact,
   acquisition feasibility, current ledger gap, and rejection-boundary
   risk.
2. The selected next target is the same-stack ISO lab `DeltaLw` packet
   owner because it covers both `Ln,w` and `DeltaLw`, current accepted
   local packet count is zero, and the required packet shape is already
   defined by Gate AK/AQ/AR.
3. The selected packet shape requires lab ISO 10140 / 717-2 `DeltaLw`,
   same-stack steel reference, and source-owned metric, topology/support
   family, carrier spacing, load basis, dynamic stiffness, lower support
   class, upper resilient topology, and paired negative boundary owner.
4. Product-only, inferred, ASTM/IIC/STC, field/building,
   concrete-reference, boundary-only, and missing-owner-field evidence
   remains rejected.
5. Exact measured rows stay exact overrides only when the full assembly
   matches; otherwise source rows stay calibration evidence, holdouts,
   anchors, or boundaries.
6. Runtime values remain `Ln,w 55.6` and `DeltaLw 22.4`; tolerances
   remain `+/-4.5 dB` and `+/-2.0 dB`.

## Next Step

Gate AT should implement the selected same-stack ISO `DeltaLw` packet
target contract. It should describe the precise packet acquisition /
fixture shape, acceptance checks, paired negative boundaries, and
source-owned rejection rules for that one target. It must not perform a
broad source-library crawl and must not retune runtime values.

Validation result:

Focused Gate AS validation completed on 2026-05-08: Gate AS engine
contract passed 1 file / 6 tests. Focused Gate AR/AS continuity passed
2 files / 13 tests. Engine typecheck passed. Engine DTS build passed.
Full `pnpm calculator:gate:current` passed with engine 325 files / 1845
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Broad `pnpm check` was not
rerun because Gate AS is no-runtime/no-API/no-UI and the current-gate
plus engine typecheck/build cover the changed surfaces. Known non-fatal
warnings remain the Node/Vitest Zustand persist storage warning and
optional `sharp` / `@img` Next build warnings via the DOCX export
dependency.
