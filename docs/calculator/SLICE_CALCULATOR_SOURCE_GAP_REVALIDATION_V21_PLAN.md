# Slice Plan - Calculator Source Gap Revalidation V21

Slice id: `calculator_source_gap_revalidation_v21`

Status: SELECTED / GATE A NEXT

Selected by:

`field_output_lab_screening_leakage_guard_v1` Gate B

Selection status:

`gate_b_strengthened_visible_field_output_basis_copy_no_runtime_selected_source_gap_revalidation_with_rockwool_and_misclassification_blockers`

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_gap_order_after_field_output_guard_and_company_internal_blocker`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_GATE_B_HANDOFF.md`

## Objective

Re-rank the next source/accuracy slice after the field-output visible
basis guard and the company-internal high-accuracy blocker. The goal is
to pick the next bounded implementation target without accidentally
promoting a near-source row, a wrong lane, or a finite field-style
output as exact.

The revalidation must explicitly consider:

1. rockwool / gypsum / MLV triple-leaf remains unresolved and still
   needs either source-owned exact closure or visible screening-only
   posture;
2. frequent wall/floor lane-family snapshots must remain green before
   any company-internal high-accuracy opening;
3. field-style outputs are now visibly guarded, but they still require
   source/field-overlay ownership before design-grade promotion;
4. near-source rows from Knauf, British Gypsum, NRC-like papers, USG,
   National Gypsum, Georgia-Pacific, PABCO, CertainTeed, ROCKWOOL, or
   similar sources must not promote without topology/material/metric/
   tolerance/negative-boundary/visible-test ownership;
5. hostile API/import input paths remain release blockers if they can
   bypass UI normalization and produce NaN, Infinity, negative,
   unknown-material, duplicate-stack, or excessive-layer behavior.

## Gate A Must Produce

- `post_gate_b_source_gap_candidate_order`
- `rockwool_triple_leaf_fix_path_status`
- `company_internal_high_accuracy_blocker_alignment`
- `field_output_guard_consumed_as_prerequisite`
- `frequent_combination_lane_snapshot_risk_order`
- `selected_next_slice_or_no_runtime_closeout`

Gate A must keep runtime values, support, confidence, evidence, API,
route-card, output-card, proposal/report, and workbench-input behavior
frozen unless it explicitly selects a later bounded implementation gate.

## Non-Promotion Rules

- Do not mark the current `Rw 41` rockwool triple-leaf answer fixed.
- Do not import Uris 2006 or NRC-like rows without rights-safe,
  source-owned curves or numeric bands plus tolerance ownership.
- Do not merge rockwool / glass-fiber, generic gypsum / Type C, MLV /
  plaster, or board/fill/gap aliases without an owned mapping and
  negative-boundary tests.
- Do not let a finite `R'w`, `DnT,w`, `L'n,w`, or `L'nT,w` become
  design-grade unless the field-output owner and visible copy tests are
  present.

## Validation

Required for Gate A:

1. create
   `packages/engine/src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts`;
2. run its focused engine test;
3. run continuity with Gate B field-output web copy, company-internal
   blocker, v20, Uris Gate U, route/source risk register, and rockwool
   triple-leaf visible tests;
4. add the Gate A file to `tools/dev/run-calculator-current-gate.ts`
   only after it exists;
5. run `pnpm calculator:gate:current`;
6. run `git diff --check`;
7. run `pnpm check` before any company-internal high-accuracy handoff
   or commit that claims broad readiness.
