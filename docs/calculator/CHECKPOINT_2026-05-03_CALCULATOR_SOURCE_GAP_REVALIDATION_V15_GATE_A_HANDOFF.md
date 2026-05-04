# Checkpoint - 2026-05-03 - Calculator Source Gap Revalidation v15 Gate A

Slice:

`calculator_source_gap_revalidation_v15`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout`

Status:

`selected_route_family_lane_drift_common_stack_watchlist_after_v15_rerank_found_no_runtime_ready_source_candidate_and_user_prioritized_rockwool_like_lane_errors`

Selected next slice:

`route_family_lane_drift_common_stack_watchlist_v1`

Selected next action:

`gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime`

Selected next file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md`

Implementation artifact:

`packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`

Prior CertainTeed closeout status:

`closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row`

## Summary

Gate A re-ranks the source and accuracy backlog after the CertainTeed
SilentFX / NRC ASTC source pack closed no-runtime. It finds no
source-ready runtime candidate: CertainTeed, PABCO, Georgia-Pacific,
National Gypsum, USG, ROCKWOOL, British Gypsum, and Knauf rows remain
context-only; GA-600 still lacks rights-safe current row payloads; and
the Uris 2006 triple-leaf source lane remains paused.

Because the user priority is to catch rockwool-like wrong-lane errors
before the calculator looks precise, Gate A selects a no-runtime
common-stack lane-drift watchlist. This next slice must inventory
frequently used wall and floor combinations, snapshot route family /
source lane / output value / support / confidence behavior, and test
small reorder, duplicate, many-layer, masonry boundary, raw-floor,
field-output, material-alias, hostile-input, and provenance variants.

This gate does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

## Standing Monitoring Mandate

`standing_lane_misclassification_monitoring_mandate`

Every revalidation, source-pack, mapping/tolerance, runtime-promotion,
and calculator-hardening slice must keep looking for route-family or
source-lane mistakes like the original rockwool reorder defect.

If a frequent wall or floor combination appears to fall into the wrong
lane, produces a large value jump after a small layer edit, promotes a
near-source row as exact truth, leaks field metrics into lab outputs, or
returns an obviously absurd value, the next action is:

`note_test_document_or_easy_fix`

The agent must reproduce it with a focused test if possible. If the
cause is real and the fix is small and bounded, fix it in the same
slice with regression tests. If it is not safe to fix immediately,
document it in the risk register or active handoff and keep the
calculator fail-closed rather than presenting the value as precise.

Watchlist families:

- flat-list route-family flip;
- duplicate or many-layer stack drift;
- masonry / lined-massive boundary drift;
- raw floor role inference;
- near-source false promotion;
- field-output leakage;
- material alias / coalescing;
- hostile API input;
- curve digitization / provenance.

## Re-Rank Result

Rank 1, selected:

- `route_family_lane_drift_common_stack_watchlist_v1`
  - reason: all current source rows remain no-runtime, the Uris 2006
    packet is still absent, and common-stack route/source drift is
    actionable now without pretending to fix the solver;
  - target:
    `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`;
  - first missing requirement:
    `frequently_used_wall_and_floor_stack_inventory`,
    `route_family_source_lane_output_value_support_confidence_snapshot_matrix`,
    `small_layer_reorder_duplicate_many_layer_and_boundary_variant_reprobes`,
    `rockwool_like_wrong_lane_defect_note_test_document_or_easy_fix_rule`,
    `field_output_source_metric_material_alias_and_hostile_input_leakage_guards`,
    and paired engine/web visible tests.

Ranked but not selected:

- `wall_triple_leaf_uris_2006_source_packet_lane`: urgent but blocked
  on `paused_waiting_rights_safe_source_packet`.
- `gypsum_association_ga600_2024_context`: authoritative context but
  blocked on rights-safe current row payloads.
- `closed_certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows`:
  context-only negative boundaries.
- `post_certainteed_fresh_source_acquisition`: still needed later, but
  no concrete new locator outranks the actionable lane-drift watchlist
  in this gate.
- `clt_mass_timber_generated_floor_no_stud_lined_heavy_followups`:
  important but still missing exact source/topology/metric owners.

## Rockwool Defect Posture

This gate still does not fix or retune the original rockwool reorder /
triple-leaf defect. The split-rockwool wall answer remains
low-confidence `multileaf_screening_blend` (`Rw 41`) and must not be
presented as fixed, correct, or source-validated. The Uris 2006 lane
remains `paused_waiting_rights_safe_source_packet`.

The selected watchlist is specifically meant to keep this class of
error visible while the runtime fix remains blocked by missing source
packet, material mapping, topology guard, tolerance owner, and paired
visible tests.

## Frozen Surfaces

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Next Step

Implement:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`

with:

`gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime`

Gate A must build the common-stack watchlist and decide which suspicious
lane/value cases need immediate regression tests, documentation-only
tracking, or easy bounded fixes.

## Validation

Completed on 2026-05-03:

- focused v15 Gate A: 1 file / 9 tests;
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts --maxWorkers=1`;
- continuity with CertainTeed Gate C / Gate B / Gate A, v14, PABCO
  Gate C / Gate B / Gate A, and the route-source risk register: 9 files
  / 67 tests;
- `pnpm calculator:gate:current`: engine 219 files / 1222 tests; web
  47 files / 227 passed + 18 skipped; repo build 5 / 5 with known
  non-fatal `sharp/@img` warnings; whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after the final documentation sync.
