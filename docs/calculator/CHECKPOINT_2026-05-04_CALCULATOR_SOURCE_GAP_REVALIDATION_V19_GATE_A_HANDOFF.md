# Checkpoint - 2026-05-04 - Calculator Source Gap Revalidation V19 Gate A

Slice:

`calculator_source_gap_revalidation_v19`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_floor_tolerance_edge_closeout`

Status:

`selected_uris_2006_rights_safe_source_packet_acquisition_after_v19_rerank_prioritized_unfixed_split_rockwool_and_found_no_runtime_ready_candidate`

Selected next slice:

`wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`

Selected next file:

`packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`

Selected next action:

`gate_u_acquire_or_reject_rights_safe_uris_2006_source_packet_no_runtime`

Selected planning surface:

`docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md`

Implementation artifact:

`packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT_HANDOFF.md`

## Summary

Gate A re-ranked the source/accuracy backlog after the floor
tolerance-edge promotion guard closed no-runtime. It carried the floor
Gate B exact/bound edge checks forward as protected evidence, not as
support, confidence, evidence, field-output, or visible-copy promotion.

The highest-impact unresolved defect remains the original split-rockwool
triple-leaf issue. Gate A therefore selected a formal Uris 2006
rights-safe source-packet acquisition slice, not runtime promotion.

## Gate A Artifacts

`floor_tolerance_edge_gate_b_closeout_summary`

- `+2 mm` exact and bound floor tolerance edges remain protected.
- `+2.1 mm` just-outside variants remain outside exact/bound support.
- Direct `officialFloorSystemId` remains a known-row bypass, not
  layer-match proof.

`exact_bound_tolerance_edge_and_visible_wording_carry_forward`

- Existing exact/bound/screening wording remains separated.
- No floor support or field-output copy movement is selected.

`post_floor_tolerance_source_ready_runtime_candidate_rerank`

The ranked candidate order is:

1. `wall_triple_leaf_uris_2006_source_packet_or_acquisition_lane`
2. `field_output_lab_screening_leakage_guard`
3. `material_alias_and_near_source_false_promotion_guard`
4. `hostile_input_and_curve_provenance_guard`
5. `no_runtime_source_gap_rerank_closeout`

Only the Uris 2006 source-packet acquisition lane is selected, and it is
selected as a no-runtime source-acquisition step.

`rockwool_uris_2006_source_packet_status`

- The lane remains `paused_waiting_rights_safe_source_packet`.
- The grouped split-rockwool answer remains
  `multileaf_screening_blend`, `Rw 41`, low confidence.
- It is not exact, fixed, or source validated.
- Runtime still requires source-owned band curves or equivalent measured
  data, rating derivation, uncertainty, local material mapping, grouped
  topology guards, negative boundaries, and paired engine plus
  web-visible tests.

`field_output_alias_hostile_input_curve_provenance_status`

- `R'w`, `DnT,w`, `L'nT,w`, and similar field-style outputs must not
  look design-grade without lab/source curve ownership and a field
  overlay owner.
- Rockwool/glass-fiber, generic gypsum/Type C, MLV/plaster, and
  manufacturer context rows remain blocked from alias promotion.
- API/import hostile input and curve-provenance guards remain active.

## Frozen Surfaces

Gate A did not change:

- runtime values
- support
- confidence
- evidence
- API behavior
- route cards
- output cards
- proposal/report copy
- workbench input behavior

## Next Step

Create:

`packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`

with:

`gate_u_acquire_or_reject_rights_safe_uris_2006_source_packet_no_runtime`

Gate U must decide whether a rights-safe Uris 2006 source packet or
equivalent rockwool two-cavity curve payload exists. If not, it must
keep the source lane paused and select the next no-runtime action.

## Validation

Required focused validation:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts --maxWorkers=1`

Continuity validation:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts src/calculator-route-source-risk-register-contract.test.ts src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts --maxWorkers=1`

Current gate:

`pnpm calculator:gate:current`

Final hygiene:

`git diff --check`
