# Checkpoint - 2026-05-05 - Rockwool Split Triple-Leaf Numeric Source Closure Gate A

Gate file:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`

Slice:

`rockwool_split_triple_leaf_numeric_source_closure_v1`

Landed status:

`gate_a_kept_split_internal_leaf_finite_screening_diagnostic_but_rejected_exact_numeric_closure_selected_runtime_withhold_gate_b`

Landed action:

`gate_a_decided_split_internal_leaf_requires_source_owned_topology_before_exact_numeric_closure`

Landed decision:

`rockwool_split_internal_leaf_exact_numeric_rejected_without_source_owned_topology`

## What Changed

Gate A added an executable source-closure decision helper:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure.ts`

The adjacent Rockwool flat-list correction from V25 remains defended:
`Rw 51 / R'w 49 / DnT,w 51` on
`double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology`.

The split/internal gypsum-leaf stack still returns the finite screening
diagnostic `Rw 41 / R'w 39 / DnT,w 40` on
`multileaf_screening_blend`, but Gate A explicitly rejects closing that
value as an exact or defended physical triple-leaf penalty.

## Source Decision

Available source-pack material does not currently authorize a fixed
Rockwool penalty:

- NRC 2024 internal gypsum double-stud rows show internal-board
  triple-leaf risk, but the curves are plotted and require digitization;
  they do not authorize importing a fixed 7-17 dB penalty for the user
  stack.
- Uris 2006 reports a 7-8 dB weighted-index decrease in abstract/source
  metadata, but that delta is not a local Rockwool Rw owner and cannot
  replace source-owned band curves/specimen topology.
- Ballagh 2013 provides a triple-panel solver shape, but it has no
  measured local Rw row and is not calibrated/held out for runtime.

Required before exact numeric closure remains:

`rights_safe_source_owned_curve_payload`, `source_provenance`,
`topology_owner`, `local_rockwool_material_mapping`,
`metric_context_owner`, `tolerance_owner`, `negative_boundaries`,
`paired_engine_tests`, `paired_visible_tests`,
`no_digitized_triple_leaf_source_rows`, `no_source_owned_holdout_rows`,
`insufficient_source_owned_calibration_rows`, and
`insufficient_source_owned_holdout_rows`.

## Selected Next Gate

Selected next file:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts`

Selected next action:

`gate_b_withhold_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`

Gate B should prevent flat-list split/internal gypsum-leaf outputs from
being consumed as exact/defended results unless grouped topology and a
source-owned model are present, while keeping the adjacent Rockwool
correction at `Rw 51 / R'w 49 / DnT,w 51`.

## Validation

Validation completed on 2026-05-05:

- focused Gate A passed 1 file / 4 tests:
  `pnpm --filter @dynecho/engine exec vitest run src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts --maxWorkers=1`
- Rockwool triple-leaf engine continuity passed 9 files / 49 tests.
- `pnpm calculator:gate:current` passed with engine 262 files / 1513
  tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks,
  and whitespace guard green.
- final `git diff --check` green after restoring
  `apps/web/next-env.d.ts` to `.next-typecheck`.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx` when the web build runs.
