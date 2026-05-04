# Slice Plan - Company Internal Frequent Combination Lane Snapshot Guard

Slice id: `company_internal_frequent_combination_lane_snapshot_guard_v1`

Status: GATE A LANDED / GATE B NEXT

Selected by:

`calculator_source_gap_revalidation_v21` Gate A

Selection status:

`selected_company_internal_frequent_combination_lane_snapshot_guard_after_v21_consumed_field_output_guard_and_kept_rockwool_source_blocked`

Landed Gate A file:

`packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`

Landed Gate A action:

`gate_a_pin_company_internal_frequent_combination_lane_snapshot_matrix_no_runtime`

Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A_HANDOFF.md`

Gate A status:

`company_internal_frequent_combination_snapshot_matrix_landed_no_runtime_selected_visible_gate_b`

Selected Gate B file:

`apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`

Selected Gate B action:

`gate_b_add_company_internal_visible_route_output_snapshot_guard_no_runtime`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A_HANDOFF.md`

## Objective

Create a no-runtime company-internal snapshot guard for frequent wall
and floor combinations before any high-accuracy internal opening. The
guard must catch wrong lane / wrong source / overconfident output
posture early by pinning current family, strategy, support, confidence,
source or origin, warnings, and visible route/output posture for common
stacks.

This slice exists because the project can pass tests while still being
unsafe to market as high-accuracy if common combinations silently fall
into the wrong lane, promote a near-source row, or show finite
screening/field-continuation values too confidently.

## Gate A Landed

Gate A added the no-runtime
`company_internal_frequent_combination_snapshot_matrix` executable
contract. It pins the current family, strategy, support, confidence,
source/origin, warnings, and intended visible posture for frequent
wall/floor combinations. It intentionally does not change runtime
values, support, confidence, evidence, API behavior, route-card values,
output-card status, proposal/report copy, or workbench-input behavior.

Gate A artifacts now present:

- `company_internal_frequent_combination_snapshot_matrix`
- `rockwool_triple_leaf_screening_and_flat_swap_negative_rows`
- `ordinary_lsf_timber_layer_swap_snapshot_rows`
- `masonry_lined_massive_boundary_snapshot_rows`
- `floor_role_inference_duplicate_stack_snapshot_rows`
- `near_source_alias_and_hostile_input_negative_rows`
- `field_outputs_never_design_grade_without_owner`
- `selected_gate_b_visible_or_api_guard_or_no_runtime_closeout`

Rockwool triple-leaf remains not fixed: grouped split-rockwool is still
`Rw 41`, `multileaf_screening_blend`, low confidence, screening only,
not exact, and not source-validated. Uris 2006 remains
`paused_waiting_rights_safe_source_packet`.

Gate A also carries forward the
`standing_lane_misclassification_monitoring_mandate`: every future
implementation pass must keep looking for wrong lane / wrong source /
false exact promotion / field-output leakage in common combinations.
When suspicious behavior appears, follow `note_test_document_or_easy_fix`:
note it, test the repro, document it if it is not immediately fixable,
and only apply a bounded easy fix when the contract is clear.

## Gate B Must Produce

Gate B must make the Gate A snapshot posture visible in web route/output
coverage before any company-internal high-accuracy opening decision.

Selected Gate B file:

`apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`

Selected Gate B action:

`gate_b_add_company_internal_visible_route_output_snapshot_guard_no_runtime`

Gate B must prove frequent rockwool triple-leaf, flat-list swap,
ordinary double-leaf/stud, lined-massive boundary, raw floor role
prompt, near-source alias, hostile input, and field-output continuation
states do not look exact or design-grade in the UI when their engine
posture is screening, fail-closed, needs-input, or context-only.

## Required Snapshot Cells

The first matrix should cover at least these risk families:

1. rockwool / gypsum / MLV triple-leaf grouped topology and equivalent
   flat-list adjacent swaps;
2. ordinary steel-stud and timber double-board stacks with small layer
   reorder or duplicate-stack perturbations;
3. masonry / lined-massive boundary hybrids including AAC, pumice,
   concrete, board / fill / gap, and furring-like combinations;
4. raw floor stacks without role tags, duplicate impact layers, and
   excessive layers;
5. near-source alias rows such as rockwool vs glass-fiber, generic
   gypsum vs Type C, MLV vs plaster, and manufacturer rows without
   owned mapping/tolerance;
6. hostile API/import payloads: NaN, Infinity, negative thickness,
   unknown material, missing layer id, and very large layer count.

## Non-Promotion Rules

- Do not mark `Rw 41` rockwool triple-leaf fixed unless source packet,
  grouped topology, material mapping, metric/tolerance, negative
  boundaries, and paired visible tests all exist.
- Do not treat the field-output copy guard as a field-output owner.
- Do not promote Knauf, British Gypsum, NRC-like, USG, National Gypsum,
  Georgia-Pacific, PABCO, CertainTeed, ROCKWOOL, or similar rows from
  near-source context to runtime exact without topology/material/metric/
  tolerance/negative-boundary/visible-test ownership.
- Do not claim arbitrary raw floor reorder invariance while raw role
  inference is still a documented risk.
- Do not smooth or retune formulas just to make a snapshot look better;
  if a snapshot exposes nonsense, document the repro and select a
  bounded fix gate.

## Validation

Gate A completed:

1. create
   `packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`;
2. pin frequent wall/floor family, strategy, support, confidence,
   source/origin, warnings, and visible posture snapshots;
3. preserve runtime values, support, confidence, evidence, API,
   route-card, output-card, proposal/report, and workbench-input
   behavior.

Gate A validation completed on 2026-05-04:

- focused Gate A passed 1 file / 8 tests;
- engine continuity passed 7 files / 50 tests;
- web continuity passed 4 files / 15 tests;
- `pnpm calculator:gate:current` passed with engine 243 files / 1404
  tests, web 50 files / 238 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.

Required for Gate B:

1. create
   `apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`;
2. assert route/output posture for the Gate A matrix rows;
3. keep runtime values frozen unless a later bounded implementation gate
   is explicitly selected;
4. run focused web validation, relevant engine/web continuity, and
   `pnpm calculator:gate:current`;
5. run `pnpm check` before any company-internal high-accuracy handoff;
6. update this plan and the latest checkpoint with exact validation
   counts.
