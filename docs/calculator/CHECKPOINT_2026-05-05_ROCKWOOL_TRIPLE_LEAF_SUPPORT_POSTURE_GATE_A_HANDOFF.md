# Checkpoint - 2026-05-05 - Rockwool Triple-Leaf Support Posture Gate A

Slice:

`rockwool_triple_leaf_support_posture_v1`

Gate:

`gate_a_decide_supported_vs_unsupported_output_posture_for_source_required_rockwool`

Status:

`gate_a_kept_rockwool_source_required_values_screening_supported_no_runtime_selected_source_gap_revalidation_v25`

Implementation files:

- `packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`
- `packages/engine/src/rockwool-triple-leaf-support-posture.ts`

Selected next slice:

`calculator_source_gap_revalidation_v25`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_gap_order_after_rockwool_support_posture`

Selected planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_PLAN.md`

## Decision

Gate A chose the screening-supported posture for source-required
Rockwool triple-leaf outputs. `supportedTargetOutputs` currently means
that a finite calculator value exists; it does not mean source-backed
exactness. Moving `Rw`, `STC`, `C`, `Ctr`, `R'w`, or `DnT,w` to
`unsupportedTargetOutputs` right now would make the workbench display
`Not ready` and hide the useful `Rw 41` diagnostic unless a separate
screening-preview value channel is added first.

Artifacts landed:

- `rockwool_support_semantics_decision`
- `rockwool_screening_supported_values_not_exact`
- `rockwool_posture_surface_map`
- `rockwool_unsupported_without_preview_rejected`
- `source_gap_revalidation_v25_selected`

## Runtime Status

No numeric runtime, support, confidence, evidence, API shape,
route-card value, output-card status, proposal/report value, visible
behavior, or workbench-input behavior changed.

Current values remain:

- grouped Rockwool triple-leaf: `Rw 41`, `STC 41`
- flat-list adjacent swap: `Rw 42`, `STC 42`
- field continuation: `R'w 34`, `DnT,w 36`

These are `finite_screening_metric_available_not_source_backed_exact`;
they are not exact, not source-validated, and not design-grade.

## Carry-Forward

Exact/source-backed Rockwool runtime remains blocked by
`rights_safe_source_owned_curve_payload_absent`. Do not repeat Uris 2006
acquisition without a new rights-safe source-owned packet or equivalent
authorized payload.

If a later slice wants unsupported exact posture, it must first add:

- `machine_readable_exact_vs_screening_support_semantics`
- `separate_screening_preview_value_channel`
- `paired_visible_output_and_proposal_copy`
- `hostile_import_and_flat_list_negative_boundaries`

## Validation

Validation passed on 2026-05-05:

- focused Gate A: 1 file / 5 tests
- engine continuity: 8 files / 49 tests
- web Rockwool/output continuity: 4 files / 29 tests
- `pnpm calculator:gate:current`: engine 260 files / 1505 tests, web
  53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks,
  whitespace guard green
- broad `pnpm check`: lint and typecheck clean, engine 393 files / 2325
  tests, web 165 files / 933 passed + 18 skipped, repo build 5 / 5
  tasks

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`. `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after the Next build.
