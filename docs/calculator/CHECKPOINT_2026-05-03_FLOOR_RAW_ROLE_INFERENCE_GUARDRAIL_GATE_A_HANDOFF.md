# Checkpoint - Floor Raw Role Inference Guardrail Gate A

Date: 2026-05-03

Slice id: `floor_raw_role_inference_guardrail_v1`

Landed gate:

`gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime`

Landed status:

`floor_raw_role_inference_inventory_landed_no_runtime_selected_gate_b_prompt_guard_design`

Selected next file:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts`

Selected next action:

`gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime`

Implementation artifact:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`

Planning surface:

`docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md`

## Summary

Gate A landed as a no-runtime inventory gate for the floor-side
wrong-lane risk class:

`raw_floor_role_inference`

It found that role-tagged exact floor rows are the promoted exact path,
while arbitrary raw floor reorder value invariance remains unclaimed:

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

Current inventory:

- exact floor rows: 173
- manual exact rows: 167
- manual exact rows with current raw inference: 166
- raw no-safe-inference row:
  `dataholz_gdsnxn01a_timber_frame_lab_2026`
- raw-vs-role-tagged drift rows: 12
- bound floor rows: 23

Current raw-vs-role-tagged drift rows:

- `tuas_x3_clt140_measured_2026`
- `tuas_x4_clt140_measured_2026`
- `tuas_r7b_open_box_timber_measured_2026`
- `tuas_r8b_open_box_timber_measured_2026`
- `tuas_r10a_open_box_timber_measured_2026`
- `tuas_c3_clt260_measured_2026`
- `tuas_c4_clt260_measured_2026`
- `tuas_c5_clt260_measured_2026`
- `tuas_c7_clt260_measured_2026`
- `tuas_c7c_clt260_measured_2026`
- `tuas_c3c_clt260_measured_2026`
- `tuas_c4c_clt260_measured_2026`

## Pinned Snapshot Matrix

- TUAS R5b raw and role-tagged layers currently match the exact floor
  source row and remain a green raw-inference representative.
- TUAS X3 CLT raw layers drift away from the role-tagged exact row and
  drop to an Rw-only screening answer; duplicate ceiling-board warnings
  remain visible.
- TUAS R7b raw layers drift to a warned family-general estimate with
  duplicate ceiling-cavity and floor-covering warnings.
- Dataholz GDSNXN01A has no safe raw-role inference and stays out of
  exact floor promotion without role ownership.

## Runtime Posture

No runtime or visible calculator behavior moved in Gate A.

Frozen surfaces:

- runtime values
- runtime import
- support/confidence/evidence promotion
- API shape
- output support
- route-card values
- output-card status
- proposal/report copy
- workbench input behavior

Gate B must design the prompt / guard boundary before any movement.
The likely safe rule is not "make raw floors exact"; it is to keep
role-tagged exact rows as the promoted path and require role ownership
before exact output, support, confidence, or route-card promotion.

## Original Rockwool Posture

This floor slice does not fix the original wall triple-leaf rockwool
calculation. The Uris 2006 lane remains:

`paused_waiting_rights_safe_source_packet`

The current flat-list guard remains:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

That guard prevents the confirmed flat-list wrong-lane jump, but it is
not a source-validated triple-leaf solver and must not be presented as
the rockwool exact fix.

## Standing Mandate

`standing_lane_misclassification_monitoring_mandate`

Every future calculator slice must keep watching common wall/floor
stacks for wrong route-family or source-lane behavior, small-edit value
jumps, near-source false exact promotion, field-output leakage,
material alias coalescing, hostile API input, and digitization
provenance mistakes.

When suspicious behavior appears, apply:

`note_test_document_or_easy_fix`

Reproduce with a focused test, fix immediately only if bounded, or
document the risk and keep output fail-closed.

## Validation

Completed on 2026-05-03:

- focused Gate A contract: 1 file / 7 tests
- continuity with v16 and raw-floor/floor-order matrices: 8 files / 39
  tests
- `pnpm calculator:gate:current`: engine 227 files / 1284 tests, web
  48 files / 230 passed + 18 skipped, repo build 5 / 5 passed
- known non-fatal build warnings: `sharp/@img` optional package
  resolution warnings
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  Next build side-effect
- whitespace guard passed
