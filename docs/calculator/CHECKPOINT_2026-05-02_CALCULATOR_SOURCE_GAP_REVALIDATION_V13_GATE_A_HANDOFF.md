# Checkpoint - 2026-05-02 - Calculator Source Gap Revalidation v13 Gate A

Slice:

`calculator_source_gap_revalidation_v13`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout`

Status:

`selected_post_georgia_pacific_source_acquisition_v1_after_v13_rerank_found_no_runtime_ready_candidate_and_post_british_gypsum_official_locators_closed_no_runtime`

Selected next slice:

`calculator_post_georgia_pacific_source_acquisition_v1`

Selected next label:

post-Georgia-Pacific source acquisition

Selected next action:

`gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import`

Selected next file:

`packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md`

Implementation artifact:

`packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`

Prior closeout status:

`closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row`

## Summary

Gate A re-ranks the source / accuracy backlog after Georgia-Pacific
Fire & Sound Assemblies closed no-runtime. The post-British-Gypsum
official locator chain has now been consumed:

- ROCKWOOL Acoustic Wall Assemblies closed no-runtime;
- USG Acoustical Assemblies closed no-runtime;
- National Gypsum Fire & Sound Selector closed no-runtime;
- Georgia-Pacific Fire & Sound Assemblies closed no-runtime.

No candidate names exact live topology, source-owned metric policy or
full-band curve, local material alias mapping, tolerance owner,
protected negative boundaries, and paired engine/web visible tests
together. Therefore v13 selects a fresh post-Georgia-Pacific source
acquisition pass rather than runtime, support, confidence, evidence,
API, route-card, output-card, proposal/report, or workbench-input
movement.

## Rerank Result

Selected:

`calculator_post_georgia_pacific_source_acquisition_v1`

Reason:

The known official locator reservoir after British Gypsum is exhausted
for runtime movement. Reopening Georgia-Pacific, National Gypsum, USG,
ROCKWOOL, British Gypsum, or Knauf by proximity would duplicate closed
no-runtime decisions. Reopening the original Uris 2006 rockwool /
triple-leaf lane would be worse: the rights-safe source packet is still
missing, so the current `Rw 41` answer remains low-confidence
`multileaf_screening_blend`.

## Protected Boundaries

- `closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_remain_context_only`
- `paused_uris_2006_lane_does_not_promote_rw_41_screening_without_rights_safe_packet`
- `clt_floor_no_stud_lined_heavy_and_historical_routes_do_not_reopen_from_nearby_green_tests`
- `georgia_pacific_gate_b_actual_directory_or_test_report_payload_missing_blocks_runtime_import`
- `georgia_pacific_gate_b_stc_ranges_and_sound_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`
- `georgia_pacific_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Rockwool Defect Posture

This checkpoint does not fix or retune the original rockwool reorder /
triple-leaf defect. The split-rockwool wall answer remains
low-confidence `multileaf_screening_blend` (`Rw 41`) and must not be
presented as fixed, correct, or source-validated. The Uris 2006 source
lane remains `paused_waiting_rights_safe_source_packet`.

## Next Step

Implement:

`packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`

with:

`gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import`

The next acquisition pass must search for rights-safe source packets or
concrete source locators for rockwool / triple-leaf / two-cavity,
CLT / mass timber, generated floor, no-stud, lined-heavy, double-board
wall, floor, and field-output metric-policy gaps. It may select a new
extraction, mapping, or source-packet slice only if a concrete locator
or packet appears and the exact topology / metric / tolerance /
material / negative-boundary / paired-visible-test requirements remain
explicit.

## Validation

Validation completed on 2026-05-02:

- focused v13 Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts --maxWorkers=1`;
  1 file / 8 tests passed;
- route-source risk register contract: 1 file / 4 tests passed;
- continuity with Georgia-Pacific Gate C / Gate B / Gate A / v12 /
  National Gypsum / USG / ROCKWOOL / British Gypsum source gates and
  the route-source risk register: 19 files / 134 tests passed;
- `pnpm calculator:gate:current`: engine 210 files / 1151 tests,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed.
