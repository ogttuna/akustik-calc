# Slice Plan - Field Output Lab / Screening Leakage Guard

Slice id: `field_output_lab_screening_leakage_guard_v1`

Status: SELECTED / GATE A NEXT

Selected by:

`calculator_source_gap_revalidation_v20` Gate A

Selection status:

`selected_field_output_lab_screening_leakage_guard_after_v20_rerank_found_no_source_ready_runtime_candidate_and_uris_packet_absent`

Selected first file:

`packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts`

Selected first action:

`gate_a_inventory_field_output_lab_screening_leakage_without_runtime_value_movement`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A_HANDOFF.md`

Prior implementation file:

`packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts`

## Objective

Inventory and guard places where field-style outputs such as `R'w`,
`DnT,w`, `L'n,w`, and `L'nT,w` are live even though the underlying
calculation basis is lab-derived, formula-owned, screening, bound, or
low-confidence. This slice is about output honesty and visible
wording, not source import and not value retuning.

The rockwool triple-leaf defect remains unresolved. Uris 2006 is still
blocked by `rights_safe_source_owned_curve_payload_absent`, and the
grouped split-rockwool stack remains `Rw 41`,
`multileaf_screening_blend`, low confidence, not fixed, and not
source-validated.

## Gate A Must Produce

- `field_output_lab_screening_leakage_inventory`
- `low_confidence_airborne_field_output_snapshot_matrix`
- `floor_impact_field_output_basis_snapshot_matrix`
- `visible_output_card_and_report_copy_inventory`
- `negative_boundaries_for_exact_field_or_design_grade_wording`
- `selected_gate_b_guard_or_no_runtime_closeout_with_target_file`

## Candidate Surfaces

1. Wall airborne low-confidence and screening lanes where `R'w` or
   `DnT,w` is computed from an apparent-curve overlay.
2. Exact or bound floor rows where `R'w`, `DnT,w`, `L'n,w`, or
   `L'nT,w` is available but must stay tied to the metric basis.
3. Generated floor fallback lanes where impact field outputs are
   estimated from predictor or guide formulas.
4. Web route cards, output cards, proposal/report copy, and evidence
   panels that could make low-confidence field outputs look exact.
5. Missing geometry / missing room-volume cases that should ask for
   input instead of silently promoting field metrics.

## Non-Promotion Rules

Gate A must not change runtime values, support, confidence, evidence,
API shape, route-card values, output-card status, proposal/report copy,
or workbench input behavior. A future bounded guard can move visible
wording only after it names paired engine and web/report tests.

Do not treat `R'w`, `DnT,w`, `L'n,w`, `L'nT,w`, `DnT,A`, or
`DnT,A,k` as design-grade just because a finite number exists. The
basis must remain visible: exact source row, bound row, formula-owned
screening, low-confidence screening, apparent overlay, or field
normalization with geometry.

## Validation

Required for Gate A:

1. focused field-output guard contract:
   `pnpm --filter @dynecho/engine exec vitest run src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts --maxWorkers=1`
2. continuity with v20, Gate U, v19, and route/source risk register;
3. add Gate A to `tools/dev/run-calculator-current-gate.ts` only after
   the file exists;
4. `pnpm calculator:gate:current`;
5. `git diff --check`.
