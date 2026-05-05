# Slice Plan - Rockwool Triple-Leaf Support Posture V1

Slice id: `rockwool_triple_leaf_support_posture_v1`

Status: GATE A LANDED / CLOSED

Selected by:

`rockwool_triple_leaf_resolution_v1` Gate A

Selection status:

`gate_a_confirmed_rockwool_triple_leaf_source_packet_absent_runtime_diagnostic_selected_support_posture`

Selected first file:

`packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`

Selected first action:

`gate_a_decide_supported_vs_unsupported_output_posture_for_source_required_rockwool`

Gate A landed status:

`gate_a_kept_rockwool_source_required_values_screening_supported_no_runtime_selected_source_gap_revalidation_v25`

Gate A implementation files:

- `packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`
- `packages/engine/src/rockwool-triple-leaf-support-posture.ts`

Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A_HANDOFF.md`

Selected next slice:

`calculator_source_gap_revalidation_v25`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_gap_order_after_rockwool_support_posture`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A_HANDOFF.md`

Planning surface:

`docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md`

## Objective

Gate A confirmed the exact Rockwool/Uris runtime path is still blocked
by `rights_safe_source_owned_curve_payload_absent`. Runtime now emits the
source-required diagnostic:

`Grouped triple-leaf topology is present, but DynEcho still needs a source-calibrated triple-leaf solver, rights-safe source-owned curve payload, local Rockwool/material mapping, metric context owner, tolerance owner, negative boundaries, and paired visible tests before promoting this beyond the screening blend; treat it as source-required screening, not exact or design-grade.`

This slice decides the next API/output posture for source-required
Rockwool triple-leaf values:

1. Keep `Rw`, `STC`, `C`, `Ctr`, `R'w`, and `DnT,w` supported only as
   explicit screening-derived outputs with machine/visible guards.
2. Or mark exact/design-grade requested outputs unsupported while
   retaining a separate screening preview path.

Do not retune the numeric value unless a rights-safe source-owned
packet and full owner set land.

Gate A decision: keep the current Rockwool outputs in
`supportedTargetOutputs` as explicit screening-supported finite metrics.
This is the correct posture because `unsupportedTargetOutputs` currently
renders `Not ready`; without a separate screening-preview value channel,
moving these outputs to unsupported would hide the only useful `Rw 41`
diagnostic instead of making it more honest.

Gate A landed:

- `rockwool_support_semantics_decision`
- `rockwool_screening_supported_values_not_exact`
- `rockwool_posture_surface_map`
- `rockwool_unsupported_without_preview_rejected`
- `source_gap_revalidation_v25_selected`

## Required Carry-Forward

- `rockwool_exact_source_packet_decision`
- `rockwool_source_required_screening_boundary`
- `rockwool_flat_list_reorder_boundary`
- `rockwool_support_posture_selected`

Current values are still grouped `Rw 41`, flat-list `Rw 42`, field
`R'w 34` and `DnT,w 36`. They are source-required screening values, not
exact or design-grade.

## Gate A Scope - Closed

The first gate answered:

1. Source-required Rockwool lab outputs stay in
   `supportedTargetOutputs` as screening-supported finite metrics.
2. The posture is represented by
   `packages/engine/src/rockwool-triple-leaf-support-posture.ts`,
   runtime warnings, visible Rockwool screening-only copy, proposal copy,
   and this checkpoint chain.
3. Unsupported exact posture is rejected until a separate screening
   preview value channel exists.
4. Flat-list adjacent swaps remain fail-closed under
   `multileaf_screening_blend_fail_closed_until_grouped_topology`.
5. Field outputs continue from the same screening basis and remain not
   design-grade.

## Validation Plan

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
`@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after the Next build.

Focused Gate A command:

```sh
pnpm --filter @dynecho/engine exec vitest run src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts --maxWorkers=1
```

If Gate A changes support semantics, add paired web visible tests and
run broad `pnpm check`. If it remains a planning/contract gate, focused
engine continuity plus `pnpm calculator:gate:current` and
`git diff --check` are sufficient.
