# Next Implementation Plan

Last reviewed: 2026-04-16

Document role:

- authoritative current next-step plan for calculator work
- use this before any historical backlog note
- keep older long-form backlog detail in:
  - [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
  - [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md)
  - [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)

Read together with:

- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [SYSTEM_MAP.md](./SYSTEM_MAP.md)
- [CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md](./CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md)
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## Verified Against Implementation - 2026-04-16

- latest closed implementation slice:
  `mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_v1`
- local verification in this closeout pass:
  - focused engine gate: `2` files / `5` tests, green
  - focused web gate: `3` files / `18` tests, green
  - `pnpm calculator:gate:current`: green
  - full engine suite: `140` files / `887` tests, green
  - full web suite: `113` files / `655` tests, green
  - `pnpm typecheck`: green
  - `pnpm lint`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green

## Closeout Summary

The active selected slice from the previous pass is now implemented.

Concrete comparison findings after the closeout:

- compact replay, edit-history, and partial-restore branch setup now live in a
  dedicated helper module:
  `mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts`
- `mixed-study-mode-output-card-snapshot-requested-output-runners.ts`
  shrank from about `1147` lines to about `979` lines while the new
  variant-driver helper stayed compact at about `212` lines and the main grid
  file stayed at about `315` lines
- no runtime or numeric calculator behavior changed
- the next honest gap is now the repeated broad / selected / representative
  outer runner-loop harness and label scaffolding still duplicated across the
  requested-output snapshot surfaces

## Current Position

- latest committed checkpoint:
  `CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md`
- latest closed implementation slice:
  `mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_v1`
- closed planning action in this pass:
  `post_mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_next_slice_selection_v1`
- selected next implementation slice:
  `mixed_floor_wall_output_card_snapshot_requested_output_surface_runner_loop_extraction_v1`
- slice type:
  no-runtime harness hardening
- implementation status:
  selected and contract-guarded, but not implemented yet
- explicit not-done item at this checkpoint:
  output-card coverage is green, and shared variant drivers now exist, but the
  requested-output runner helper still duplicates broad / selected /
  representative outer loop orchestration, case-selection wiring, and label
  scaffolding across `10` exported runners

## Why This Slice Was Chosen

- requested-output variant-branch driver extraction is now closed
- the main snapshot-grid regression file remains under control at about
  `315` lines, and the runner helper dropped to about `979` lines, so the next
  maintainability hotspot is the repeated surface runner-loop shell rather than
  branch choreography
- `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts`
  still repeats the same direct-expectation prep, variant loop, save/load
  orchestration, and assertion label envelope across broad / selected /
  representative requested-output surfaces
- extracting a shared surface runner-loop harness is safer than reopening
  raw-source, Dataholz, `C11c`, heavy-concrete formula, or wall-selector
  runtime scope
- this keeps following the repo rule to split large test harnesses before they
  become hidden blockers for future calculator widening

## Selected Next Slice

- slice id:
  `mixed_floor_wall_output_card_snapshot_requested_output_surface_runner_loop_extraction_v1`
- workstream:
  `test_harness_hardening`
- route family:
  `mixed_floor_wall_route_matrix`
- output surface:
  `workbench_output_card_snapshot_requested_output_surface_runner_loop_harness`
- engine companion surface:
  `mixed_generated_route_support_bucket_parity`
- behavior class:
  no-runtime refactor / evidence-harness hardening

### Scope

- extract a shared broad / selected / representative requested-output surface
  runner-loop harness out of
  `mixed-study-mode-output-card-snapshot-requested-output-runners.ts`
- centralize repeated case-selection wiring, direct expectation preparation,
  variant iteration, save/load detour orchestration, and final failure collapse
  envelopes so exported runners become thin wrappers around surface descriptors
- centralize repeated label scaffolding for rows/cards/save-load snapshots so
  per-surface differences live in small descriptors rather than open-coded
  string templates across `10` exported runners
- keep these surfaces green as regression guards:
  - broad requested-output compact replay breadth
  - broad requested-output compact replay restore breadth
  - broad requested-output edit-history restore breadth
  - broad requested-output partial-restore breadth
  - selected requested-output partial-restore
  - selected requested-output generated-history restore
  - selected requested-output edit-history restore
  - representative requested-output partial-restore
  - representative requested-output generated-history restore
  - representative requested-output edit-history restore
  - representative broad default-output restore
- keep runtime behavior and numeric results unchanged

### Requested-Output Surface Runner Extraction Targets

- `requested_output_surface_case_selector`
- `requested_output_surface_runner_loop_driver`
- `requested_output_surface_label_descriptor`
- `requested_output_surface_failure_closeout`

### Current Implementation Anchors

- planning contract:
  `packages/engine/src/post-mixed-floor-wall-output-card-snapshot-requested-output-variant-branch-driver-extraction-next-slice-selection-contract.test.ts`
- engine companion:
  `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
- visible web target:
  `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`
- requested-output harness hotspot:
  `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts`
- shared branch setup helper:
  `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts`
- focused gate entrypoint:
  `tools/dev/run-calculator-current-gate.ts`

### Non-goals

- no raw bare open-box/open-web impact widening
- no `GDMTXA04A` visible exact reopen
- no `C11c` exact import
- no broad heavy-concrete formula widening
- no wall-selector behavior change
- no requested-output bundle definition change
- no numeric/runtime calculator change
- no new route-family widening until the surface runner-loop harness is shared

### Focused Test Pack

- engine:
  - `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
- web:
  - `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`
  - `apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts`
  - `apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts`
- planning contract:
  - `packages/engine/src/post-mixed-floor-wall-output-card-snapshot-requested-output-variant-branch-driver-extraction-next-slice-selection-contract.test.ts`

### Acceptance

- broad, selected, and representative requested-output card restore coverage
  stays green after surface runner-loop extraction
- the requested-output runner helper shrinks further and becomes more reviewable
- outer requested-output runner-loop orchestration and label scaffolding are
  shared instead of repeated across multiple exported runners
- targeted test pack is green
- close the slice with:
  `post_mixed_floor_wall_output_card_snapshot_requested_output_surface_runner_loop_extraction_next_slice_selection_v1`

### Focused Validation Order

1. `pnpm --filter @dynecho/engine exec vitest run src/post-mixed-floor-wall-output-card-snapshot-requested-output-variant-branch-driver-extraction-next-slice-selection-contract.test.ts src/mixed-floor-wall-generated-matrix.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine test`
4. `pnpm --filter @dynecho/web test`
5. `pnpm typecheck`
6. `pnpm lint`
7. `pnpm build`
8. `git diff --check`

### Slice Stop Conditions

- stop and re-scope if surface runner-loop extraction hides scenario meaning or
  makes requested-output test intent harder to read than the current explicit
  wrappers
- stop and classify separately if any extracted helper changes requested-output
  card projection semantics instead of just reducing repetition
- stop and split again if the runner helper remains too large for safe future
  widening even after the outer surface loop harness is shared

## Explicitly Deferred After This Selection

- raw bare open-box/open-web impact widening
- Dataholz `GDMTXA04A` visible exact reopen
- TUAS `C11c` exact import
- broad heavy-concrete formula family widening
- wall-selector behavior widening

## Immediate Next Steps

1. Keep this plan as the authoritative next-step file.
2. Execute
   `mixed_floor_wall_output_card_snapshot_requested_output_surface_runner_loop_extraction_v1`
   as a no-runtime harness-hardening slice.
3. Keep runtime widening blocked until the requested-output surface runner-loop
   harness is shared and still green.
