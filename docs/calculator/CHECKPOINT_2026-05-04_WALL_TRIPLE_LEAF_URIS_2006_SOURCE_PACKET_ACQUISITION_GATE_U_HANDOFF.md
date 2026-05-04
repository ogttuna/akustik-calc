# Checkpoint - 2026-05-04 - Wall Triple-Leaf Uris 2006 Source Packet Acquisition Gate U

Slice:

`wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`

Gate landed:

`gate_u_acquire_or_reject_rights_safe_uris_2006_source_packet_no_runtime`

Status:

`gate_u_rechecked_uris_2006_rights_safe_source_packet_absent_no_runtime_selected_source_gap_revalidation_v20`

Selected next slice:

`calculator_source_gap_revalidation_v20`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_uris_2006_acquisition_attempt`

Implementation artifact:

`packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A_HANDOFF.md`

## Summary

Gate U performed the fresh source-packet acquisition decision selected
by v19. It found concrete Uris 2006 identity metadata and authorized
access paths, but no rights-safe local source packet, page image,
numeric table, authorized TDM payload, source-owned one-third-octave
band vector, curve identity map, or rating derivation usable by
runtime.

Therefore the original split-rockwool triple-leaf defect remains
unfixed. The grouped wall answer stays `Rw 41`,
`multileaf_screening_blend`, low confidence, not exact, and not
source-validated.

## Gate U Artifacts

`uris_2006_rights_safe_source_packet_acquisition_attempt`

- Crossref metadata confirms the source identity:
  `10.1016/j.apacoust.2005.11.006`, PII `S0003682X05001799`,
  Applied Acoustics 67(9), 918-925.
- The Elsevier TDM endpoint is an authorized access path only in this
  repo state; it is not a locally available source-owned curve payload.
- ScienceDirect / DOI locators are concrete, but no local rights-safe
  PDF, page image, numeric table, or authorized TDM output is present.
- Public catalogue metadata is identity context only.

`equivalent_rockwool_two_cavity_source_payload_scan`

- NRC 2024 remains a comparator boundary, not local rockwool runtime.
- Uris 2008 remains a perforated-facing negative boundary.
- ROCKWOOL / USG / National Gypsum / Georgia-Pacific / PABCO /
  CertainTeed rows remain context-only near-source rows.
- Public metadata and DOI summaries are not source packets.

`source_packet_runtime_readiness_or_rejection_reason`

First blocker:

`rights_safe_source_owned_curve_payload_absent`

Runtime remains blocked until all of these are owned:

- rights-safe source file or authorized TDM payload;
- page/figure/table locator for the internal-board curve;
- curve identity map for side A, cavity 1, internal leaf, cavity 2,
  and side B;
- one-third-octave band vectors or reproducible digitization payload;
- Rw/STC derivation and uncertainty owner;
- local rockwool / MLV / gypsum board / gypsum plaster mapping with
  tolerance;
- paired engine and web-visible tests.

`nrc_2024_comparator_boundary_still_not_local_runtime`

NRC 2024 can remain calibration/comparator context only. It cannot
substitute for the missing Uris 2006 rockwool/mineral-wool two-cavity
source packet.

`rw41_screening_answer_remains_not_fixed_until_packet_mapping_and_visible_tests`

The live grouped stack remains:

- `Rw 41`
- `multileaf_screening_blend`
- low confidence
- not fixed
- not exact
- not source-validated

`selected_next_gate_with_target_file_and_validation_scope`

Gate U selected `calculator_source_gap_revalidation_v20` because no
runtime-ready source packet exists after the acquisition attempt. v20
must re-rank the backlog while carrying forward the source-packet
absence, wrong-lane monitoring, field-output leakage guard, material
alias guard, hostile-input guard, and curve-provenance guard.

## Frozen Surfaces

Gate U did not change:

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

`pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts --maxWorkers=1`

Continuity validation:

`pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts src/wall-triple-leaf-source-packet-availability-gate-s.test.ts src/calculator-route-source-risk-register-contract.test.ts --maxWorkers=1`

Current gate:

`pnpm calculator:gate:current`

Final hygiene:

`git diff --check`
