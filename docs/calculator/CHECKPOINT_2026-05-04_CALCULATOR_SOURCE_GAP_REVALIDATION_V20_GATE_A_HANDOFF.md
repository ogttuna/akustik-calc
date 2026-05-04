# Checkpoint - 2026-05-04 - Calculator Source Gap Revalidation V20 Gate A

Slice:

`calculator_source_gap_revalidation_v20`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_uris_2006_acquisition_attempt`

Status:

`selected_field_output_lab_screening_leakage_guard_after_v20_rerank_found_no_source_ready_runtime_candidate_and_uris_packet_absent`

Selected next slice:

`field_output_lab_screening_leakage_guard_v1`

Selected next file:

`packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_inventory_field_output_lab_screening_leakage_without_runtime_value_movement`

Implementation artifact:

`packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_GATE_U_HANDOFF.md`

## Summary

V20 re-ranked the source / accuracy backlog after the Uris 2006 source
packet acquisition attempt. Gate U confirmed the source identity but
found no rights-safe source-owned curve payload, local packet, page
image, numeric table, authorized TDM payload, band vector, or rating
derivation. That makes Uris 2006 an external/manual source-packet
dependency, not a runtime lane.

No source-ready wall or floor row is available for runtime import.
V20 therefore selected the bounded source-independent guard slice:
`field_output_lab_screening_leakage_guard_v1`. This targets a visible
honesty risk: `R'w`, `DnT,w`, `L'n,w`, and `L'nT,w` can be finite and
precise-looking while the underlying basis is still lab-derived,
screening, bound, formula-owned, or low-confidence.

The original split-rockwool triple-leaf defect remains unfixed. The
grouped wall answer stays `Rw 41`, `multileaf_screening_blend`, low
confidence, not exact, and not source-validated.

## Gate A Artifacts

`uris_2006_gate_u_acquisition_closeout_summary`

- Uris 2006 identity is confirmed.
- Runtime is still blocked by
  `rights_safe_source_owned_curve_payload_absent`.
- The grouped split-rockwool `Rw 41` answer is not fixed and not exact.

`source_packet_absence_and_external_dependency_carry_forward`

- DOI / Crossref / ScienceDirect / Elsevier TDM locators are not
  runtime packets without an authorized local payload.
- NRC 2024 graph rows remain comparator context, not local rockwool
  runtime evidence.
- Manufacturer STC/IIC/OITC rows remain context-only.

`post_uris_acquisition_source_ready_runtime_candidate_rerank`

- No candidate has complete topology, metric, material mapping,
  tolerance, negative-boundary, and visible-test ownership.
- No runtime import, support promotion, confidence promotion, evidence
  promotion, route-card movement, output-card movement, proposal/report
  movement, or workbench-input movement is selected.

`wrong_lane_and_frequent_combination_monitoring_carry_forward`

- Small layer reorder, duplicate stack, many-layer stack, material
  alias, masonry/lining boundary, raw floor role inference, hostile
  API/import input, and curve provenance remain active watch variants.
- If a frequent combination appears to switch lane, reproduce it in a
  focused contract before promoting values or copy.

`field_output_alias_hostile_input_curve_provenance_status`

- Field-style outputs can be live from lab/screening basis, but must
  not look design-grade without a field overlay owner.
- Rockwool/glass-fiber, generic gypsum/Type C, MLV/plaster, and
  manufacturer context aliases remain blocked without source/tolerance
  ownership.
- Unknown, negative, non-finite, and undocumented imported data stays
  fail-closed.
- New curve payloads still require axis, band, curve identity, rating
  derivation, and uncertainty ownership.

`selected_next_slice_with_target_file_and_validation_scope`

- Selected next slice:
  `field_output_lab_screening_leakage_guard_v1`.
- Selected next file:
  `packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts`.
- Selected validation scope: field-output inventory, low-confidence
  airborne field-output snapshots, floor impact field-output basis
  snapshots, web output-card/report copy inventory, continuity with v20
  and route/source risk register, then `pnpm calculator:gate:current`.

## Frozen Surfaces

V20 did not change:

- runtime values
- support
- confidence
- evidence
- API behavior
- route cards
- output cards
- proposal/report copy
- workbench input behavior

## Validation

Required focused validation:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts --maxWorkers=1`

Continuity validation:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts src/wall-triple-leaf-source-packet-availability-gate-s.test.ts src/calculator-route-source-risk-register-contract.test.ts --maxWorkers=1`

Current gate:

`pnpm calculator:gate:current`

Final hygiene:

`git diff --check`
