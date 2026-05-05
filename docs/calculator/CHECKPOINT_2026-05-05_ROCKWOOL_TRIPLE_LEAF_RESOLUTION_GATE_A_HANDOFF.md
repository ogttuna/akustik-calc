# Checkpoint - 2026-05-05 - Rockwool Triple-Leaf Resolution Gate A

Slice:

`rockwool_triple_leaf_resolution_v1`

Gate:

`gate_a_decide_rockwool_triple_leaf_exact_source_or_fail_closed_path`

Status:

`gate_a_confirmed_rockwool_triple_leaf_source_packet_absent_runtime_diagnostic_selected_support_posture`

Landed file:

`packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`

Runtime diagnostic source:

`packages/engine/src/rockwool-triple-leaf-source-required-boundary.ts`

Selected next slice:

`rockwool_triple_leaf_support_posture_v1`

Selected next file:

`packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`

Selected next action:

`gate_a_decide_supported_vs_unsupported_output_posture_for_source_required_rockwool`

Selected planning surface:

`docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md`

## Result

Gate A did not select direct exact/source-backed Rockwool runtime. The
repo still has no rights-safe Uris 2006 or equivalent source-owned curve
payload with the full owner set. Repeating source acquisition without a
new packet is not useful.

Gate A landed these artifacts:

- `rockwool_exact_source_packet_decision`
- `rockwool_source_required_screening_boundary`
- `rockwool_flat_list_reorder_boundary`
- `rockwool_support_posture_selected`

Runtime values did not change: grouped split-rockwool remains `Rw 41`
and `STC 41` on `multileaf_screening_blend`; flat-list adjacent swap
remains `Rw 42` on
`multileaf_screening_blend_fail_closed_until_grouped_topology`; field
continuation remains `R'w 34` and `DnT,w 36`.

The grouped runtime warning now uses the source-required diagnostic:

`Grouped triple-leaf topology is present, but DynEcho still needs a source-calibrated triple-leaf solver, rights-safe source-owned curve payload, local Rockwool/material mapping, metric context owner, tolerance owner, negative boundaries, and paired visible tests before promoting this beyond the screening blend; treat it as source-required screening, not exact or design-grade.`

## Validation

Passed on 2026-05-05:

- Focused Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts --maxWorkers=1`
  passed 1 file / 6 tests.
- Engine continuity with source-promotion owner-set, V24, Rockwool
  screening policy, Uris Gate S/T/U, and company blocker contracts
  passed 9 files / 55 tests.
- Web continuity for Rockwool visible policy and company acceptance
  rehearsal passed 2 files / 14 tests.
- Split-refactor size pin was updated from `1829` to `1828` physical
  lines after the warning text moved to
  `rockwool-triple-leaf-source-required-boundary.ts`; focused split
  contract passed 1 file / 5 tests.
- Final `pnpm calculator:gate:current` passed with engine 259 files /
  1500 tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- Broad `pnpm check` passed after removing one unused source-promotion
  Gate A import: lint and typecheck clean, engine 392 files / 2320
  tests, web 165 files / 933 passed + 18 skipped, and repo build 5 / 5
  tasks.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`. `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after the Next build.
