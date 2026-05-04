# Checkpoint - 2026-05-04 - Field Output Lab / Screening Leakage Guard Gate A

Slice:

`field_output_lab_screening_leakage_guard_v1`

Gate landed:

`gate_a_inventory_field_output_lab_screening_leakage_without_runtime_value_movement`

Status:

`gate_a_inventoried_field_output_lab_screening_leakage_no_runtime_selected_visible_wording_guard_gate_b`

Selected next file:

`apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts`

Selected next action:

`gate_b_strengthen_visible_field_output_basis_copy_with_paired_engine_web_report_tests`

Implementation artifact:

`packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A_HANDOFF.md`

## Summary

Gate A inventories finite field-style outputs that can look more exact
than their basis allows. It keeps every runtime and visible behavior
frozen, then selects a bounded Gate B for visible output-card and
report-copy wording hardening.

The original split-rockwool triple-leaf defect remains unfixed. The
grouped wall answer still belongs to low-confidence
`multileaf_screening_blend`; `Rw 41` is not exact, not fixed, and not
source-validated. In building field context the same route can expose
finite `R'w 39` and `DnT,w 40` from
`apparent_curve_overlay + 10log10(0.32V/S)`, which is exactly the kind
of field-output leakage risk Gate B must make visually obvious.

## Gate A Artifacts

`field_output_lab_screening_leakage_inventory`

- Low-confidence split-rockwool `R'w` / `DnT,w`.
- Exact floor field continuations.
- Low-confidence reinforced-concrete floor field continuations.
- Raw generated fallback floor field continuations.
- Missing geometry / volume / field-K boundaries.

`low_confidence_airborne_field_output_snapshot_matrix`

- Split-rockwool grouped topology with building context remains
  `multileaf_screening_blend`, low confidence.
- `R'w 39` and `DnT,w 40` are finite but source-gated screening
  continuations.
- Uris 2006 remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.

`floor_impact_field_output_basis_snapshot_matrix`

- UBIQ exact floor row keeps exact row identity but field impact
  companions are continuations, not independent exact field rows.
- Reinforced-concrete fallback keeps
  `predictor_floor_system_low_confidence_estimate` /
  `mixed_predicted_plus_estimated_standardized_field_volume_normalization`.
- Raw terminal concrete helper keeps
  `screening_mass_law_curve_seed_v3` /
  `mixed_predicted_plus_estimated_standardized_field_volume_normalization`.

`visible_output_card_and_report_copy_inventory`

- `field-airborne-output.ts` already carries apparent-curve and
  missing-input wording.
- `field-airborne-provenance.ts` carries apparent / standardized /
  area-normalized derivation language.
- `simple-workbench-output-model.ts` has field impact live/bound copy
  that Gate B should snapshot and harden.
- `simple-workbench-output-posture.ts` is the main badge-level place
  to prevent exact/design-grade overread.
- `simple-workbench-evidence.ts` must keep field airborne, dynamic
  impact, and dynamic airborne anchors visible in report evidence.

`negative_boundaries_for_exact_field_or_design_grade_wording`

- finite `R'w` does not mean exact field measurement;
- finite `DnT,w` does not mean design-grade without a field overlay
  owner;
- exact floor system match does not make estimated field continuations
  exact;
- low-confidence floor or wall routes must not show exact/success
  posture;
- bound floor support must not render as live exact metric;
- missing room volume, field K, or direct field evidence must remain
  needs-input / unsupported.

`selected_gate_b_guard_or_no_runtime_closeout_with_target_file`

- Gate B selected:
  `apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts`.
- Gate B should add paired web output-card and report-copy snapshots,
  then strengthen visible basis wording if needed.

## Frozen Surfaces

Gate A did not change:

- runtime values
- support
- confidence
- evidence
- API behavior
- route-card values
- output-card status
- proposal/report copy
- workbench input behavior

## Validation

Required focused validation:

`pnpm --filter @dynecho/engine exec vitest run src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts --maxWorkers=1`

Completed on 2026-05-04: passed 1 file / 7 tests.

Continuity validation:

`pnpm --filter @dynecho/engine exec vitest run src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts src/calculator-route-source-risk-register-contract.test.ts --maxWorkers=1`

Completed on 2026-05-04: passed 5 files / 33 tests.

Current gate:

`pnpm calculator:gate:current`

Completed on 2026-05-04: engine focused gate passed 240 files /
1384 tests, web focused gate passed 49 files / 234 passed + 18 skipped,
repo build passed 5 / 5 tasks with the known non-fatal `sharp/@img`
warnings, and whitespace guard passed.

Final hygiene:

`git diff --check`

Completed on 2026-05-04 after restoring `apps/web/next-env.d.ts` to
the repo-local `.next-typecheck` reference.
