# Slice Plan - Company Internal Frequent Combination Lane Snapshot Guard

Slice id: `company_internal_frequent_combination_lane_snapshot_guard_v1`

Status: SELECTED / GATE A NEXT

Selected by:

`calculator_source_gap_revalidation_v21` Gate A

Selection status:

`selected_company_internal_frequent_combination_lane_snapshot_guard_after_v21_consumed_field_output_guard_and_kept_rockwool_source_blocked`

Selected first file:

`packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`

Selected first action:

`gate_a_pin_company_internal_frequent_combination_lane_snapshot_matrix_no_runtime`

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

## Gate A Must Produce

- `company_internal_frequent_combination_snapshot_matrix`
- `rockwool_triple_leaf_screening_and_flat_swap_negative_rows`
- `ordinary_lsf_timber_layer_swap_snapshot_rows`
- `masonry_lined_massive_boundary_snapshot_rows`
- `floor_role_inference_duplicate_stack_snapshot_rows`
- `near_source_alias_and_hostile_input_negative_rows`
- `selected_gate_b_visible_or_api_guard_or_no_runtime_closeout`

Gate A must keep runtime values, support, confidence, evidence, API,
route-card, output-card, proposal/report, and workbench-input behavior
frozen unless it explicitly selects a later bounded implementation gate.

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

Required for Gate A:

1. create
   `packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`;
2. run the focused engine guard;
3. run continuity with V21, company-internal blocker, route/source risk
   register, rockwool visible tests, flat-list multileaf guard, field
   output Gate B, and hostile input tests if present;
4. add the Gate A file to `tools/dev/run-calculator-current-gate.ts`
   only after it exists;
5. run `pnpm calculator:gate:current`;
6. run `pnpm check` before any company-internal high-accuracy handoff;
7. update this plan and the latest checkpoint with exact validation
   counts.
