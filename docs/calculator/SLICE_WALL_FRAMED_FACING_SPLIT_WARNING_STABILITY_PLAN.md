# Slice Plan - Wall Framed Facing Split Warning Stability v1

Status: CLOSED AT GATE C (opened 2026-04-28 by
`post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts`;
closed by
`post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts`)

## Objective

Close the remaining documented F3 framed-wall split drift without
changing defended acoustic values for physically equivalent board split
edits.

The older F3 handoff described the issue as warning-only: when a framed
wall board/facing layer is split into equal parts, numeric outputs were
expected to stay unchanged while the framed-wall monotonic-floor guard
could emit an extra diagnostic warning. Gate A revalidated this against
the current implementation and found the current LSF field/building
lane is stricter than that old description: splitting any one
`acoustic_gypsum_board` board row into 6.25 + 6.25 raises the LSF field
outputs by +1 dB and adds the monotonic-floor warning. LSF lab and
timber lab/field contexts remain stable.

Gate B fixed the current LSF field board-split value/warning drift
without using a global coalescing shortcut that merges physically
meaningful board layers or breaks framed-wall benchmark/source matching.

## Why This Slice Is Next

`floor_layer_order_invariance_expansion_v1` closed Gate C with no
runtime/card drift. Remaining source import and runtime widening
candidates are blocked by missing source evidence or bounded tolerance
owners. The highest-value non-source-blocked calculator issue still
documented in the living plan is F3:

- it is a real user edit pattern: users split, duplicate, and adjust
  board/facing layers;
- Gate A is now complete and shows LSF lab plus timber lab/field are
  stable, but LSF field board splits currently move all apparent field
  metrics by +1 dB;
- warning and value drift both reduce trust in a correct answer if the
  UI appears to change after a physically equivalent split;
- the prior failed broad coalescing attempt is documented, so the
  negative boundary is clear.

## Gate A - Warning / Value Drift Inventory

Gate A is executable and no-runtime. It created
`packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts`
and records:

1. representative light-steel framed and timber framed wall stacks
   before and after board/facing split edits;
2. pinned values for `Rw`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`,
   `Ctr`, and any supported companion outputs before and after split;
3. warning arrays before and after split, with the exact drift
   classified as LSF field value+warning drift, timber absent, and LSF
   lab absent;
4. source/exact/benchmark precedence before and after split;
5. the negative boundary against global same-material entry coalescing
   and against treating distinct board topology as source-equivalent;
6. paired web route-card requirements before any visible warning copy,
   confidence, evidence, support, or value movement;
7. selected next action: Gate B LSF field board-split value/warning
   stability fix.

## Gate B - LSF Field Board-Split Stability Fix

Gate B added
`packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts`
and
`apps/web/features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts`.
The bounded runtime change proves:

1. LSF field/building board splits keep baseline values:
   `R'w=51`, `Dn,w=51`, `Dn,A=49.6`, `DnT,w=52`, `DnT,A=51.1`,
   `STC=51`, `C=-1.4`, `Ctr=-6.4`.
2. LSF lab remains exact at `Rw=55`, `STC=55`, `C=-1.5`,
   `Ctr=-6.4`.
3. Timber stud lab and field stay stable at the Gate A pinned values.
4. The fix does not use global same-material entry coalescing or merge
   distinct 12.5 + 12.5 board topology into a single 25 mm board.
5. Exact/source precedence, supported/unsupported outputs, confidence,
   evidence text, API behavior, and visible route-card values stay
   frozen. The web matrix also pins that acoustic warnings are stable
   after filtering normal guided thickness-sanity notes for 6.25 mm
   split fragments.

## Gate C - Closeout / Next-Slice Selection

Gate C should add
`packages/engine/src/post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts`
and closed the slice because the current Gate B posture remained green:

1. close `wall_framed_facing_split_warning_stability_v1`;
2. preserve the LSF field split fix and the no-global-board-coalescing
   boundary;
3. selected `calculator_source_gap_revalidation_v3` from the living
   source-gap posture;
4. updated `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`,
   `MASTER_PLAN.md`, `README.md`, `SOURCE_GAP_LEDGER.md`, `AGENTS.md`,
   and the Gate C checkpoint together.

## Acceptance Rules

Gate B has landed and may remain accepted only if it fixes the concrete
LSF field board-split value/warning drift without changing:

- defended acoustic values for baseline, lab exact, timber, or
  unrelated wall/floor corridors;
- supported/unsupported outputs;
- exact/catalog/benchmark precedence;
- source-family posture;
- visible card behavior without paired web tests.

Gate B must not rely on broad layer coalescing at the engine entry
point. That route previously caused broad framed-wall benchmark
failures and would erase physically meaningful board-layer distinctions.

## Handoff

This slice is closed. Continue in
[SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md)
at Gate A:

`packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`
