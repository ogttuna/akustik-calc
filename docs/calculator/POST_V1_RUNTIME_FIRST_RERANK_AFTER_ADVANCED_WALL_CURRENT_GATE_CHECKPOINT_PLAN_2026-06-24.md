# Post-V1 Runtime-First Rerank After Advanced-Wall Current-Gate Checkpoint Plan - 2026-06-24

Status:
`post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_plan_selected_docs_sync`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-advanced-wall-current-gate-checkpoint-contract.test.ts`

Selected next label:
`post-V1 runtime-first route-family rerank after advanced-wall current-gate checkpoint`

## Purpose

This is the active post-checkpoint selection plan. It follows:

`docs/calculator/CHECKPOINT_2026-06-24_ADVANCED_WALL_CURRENT_GATE_HANDOFF.md`

That checkpoint validated the advanced-wall source-absent
field/building lab-companion target-output independence coverage
refresh as a no-runtime support slice. The refresh is now a protected
landed behavior in the current gate, not the next implementation task.

The next useful calculator step is a fresh runtime-first rerank against
the current post-gate state. The rerank must select a high-ROI runtime
owner, accuracy owner, required-input boundary owner, or explicitly
record why no safe runtime behavior can move yet.

## Selection Card

- User construction / formula family:
  current wall/floor/opening calculator families already represented in
  the post-V1 current gate, with priority for real arbitrary
  user-entered stacks where formula ownership, basis integrity, or
  missing-input capture can move next.
- Target outputs to open:
  to be selected by the rerank. Candidate outputs may include airborne
  lab companions, field/building companions, impact companions, or
  characteristic adapters only when the chosen route has owned physics.
- Route:
  no-runtime rerank contract. It compares candidate runtime families
  after the advanced-wall checkpoint and selects one bounded next owner.
- Required physical inputs:
  none for the rerank itself. The selected owner must name its required
  inputs before runtime work starts.
- `needs_input` behavior:
  unchanged by the rerank. Any selected owner must preserve precise
  `needs_input` for missing route-required physical inputs.
- `unsupported` boundaries:
  broad source crawling, copied manufacturer ratings, lab-to-field or
  lab-to-building aliasing, impact/airborne metric aliasing, and
  unbounded same-family deltas remain blocked unless the selected owner
  proves the boundary.
- Expected `newCalculableRequestShapes`:
  `0` for the rerank itself.
- Expected `newCalculableTargetOutputs`:
  `0` for the rerank itself.
- Expected `runtimeBasisPromotions`:
  `0` for the rerank itself.
- Expected `runtimeValuesMoved`:
  `0` for the rerank itself.

## Candidate Rules

The rerank must:

1. Re-read the checkpoint, current gate runner, current state, source of
   truth, documentation map, and next-agent brief.
2. Consider only calculator-first work: formula-route ownership,
   numeric accuracy, required input capture, metric/basis integrity, or
   a boundary that protects those properties.
3. Exclude support-only work unless it directly selects or protects the
   next calculator behavior.
4. Exclude Workbench V2 route-input presentation, Excel impact-product
   seed review, material catalog seeding, and other concurrent support
   handoffs from replacing the runtime-first calculator selection.
5. Select a single next owner or stop with a precise no-safe-runtime
   reason.

## Acceptance Criteria

- The rerank contract file exists at the selected next file path.
- It records at least several explicit candidate comparisons.
- It selects one high-ROI next owner, or explicitly records that no safe
  runtime/accuracy/input-boundary move is currently available.
- The selected owner is calculator-first and names its route family,
  target outputs, route-required inputs, `needs_input` behavior, and
  unsupported boundaries.
- It moves no runtime values, retunes no formulas, imports no source
  rows, and touches no frontend implementation.
- `git diff --check` passes after the rerank work.

## Non-Goals

- No broad source crawl.
- No manufacturer rating copy.
- No product catalog import.
- No frontend polish.
- No formula retune inside the rerank.
- No runtime value movement inside the rerank.
- No reuse of stale historical selected-next prose as current authority.
