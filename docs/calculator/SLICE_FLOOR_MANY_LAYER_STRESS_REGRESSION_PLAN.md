# Slice Plan - Floor Many-Layer Stress Regression v1

Status: CLOSED (2026-04-24, no-runtime Gate A audit; next slice
selected: `floor_layer_order_edit_stability_v1`)

## Objective

Increase floor-calculator robustness and accuracy confidence by making
50+ layer floor-stack behavior executable. The calculator must either
return a defended answer or fail closed with honest support/status data;
it must not produce `NaN`, `undefined`, crashes, or unsupported live
cards when a user builds a very large stack.

This is a stress-regression slice first. Gate A pins current behavior
without runtime change. Gate B exists only for concrete drift such as a
crash, non-finite value, support/card mismatch, or an unsupported value
leaking live.

## Non-Goals

- Do not reopen `GDMTXA04A` direct exact without a modeled composite
  dry-screed source surface.
- Do not reopen `C11c` exact import while the combined wet tuple remains
  anomalous.
- Do not infer bare open-box/open-web impact behavior from packaged
  system rows.
- Do not retune reinforced-concrete, raw-helper, CLT, UBIQ, Knauf, or
  wall timber formulas from stress-stack proximity.
- Do not claim arbitrary floor layer reorder value invariance. Floor
  layer order is physically meaningful; only same-material split/parity
  and explicitly modeled reorder surfaces can be invariant.
- Do not resume `project_access_policy_route_integration_v1` until this
  selected calculator slice closes or priority explicitly changes.

## Why This Slice Is High ROI

The previous floor continuation audit closed with no runtime fix needed.
The best next move is a narrow operator-risk hardening slice that matches
how users can stress the calculator in practice: duplicating, splitting,
and extending floor layer stacks until the stack is far larger than
normal source rows.

This also closes a documented planning gap. `MASTER_PLAN.md` already
requires 50+ layer stacks to return a defended answer or fail closed, but
only wall 50-layer behavior is pinned today. Floor many-layer coverage is
still deferred.

## Current Baseline

- Wall 50+ layer identical/mixed stacks are pinned in
  `raw-wall-hostile-input-answer-matrix.test.ts`.
- Floor hostile-input tests cover malformed, fragmented, and long floor
  stacks, but current long floor representatives are not a dedicated 50+
  stress regression.
- Floor same-material split/parity and continuation surfaces are pinned,
  but arbitrary floor reorder expansion remains unclaimed.
- Blocked source families remain fail-closed:
  `GDMTXA04A`, `C11c`, and raw bare open-box/open-web impact.

## Gate Plan

### Gate A - inventory current floor 50+ layer stability

Status: LANDED (2026-04-24, no runtime change).

No runtime change. Build an executable matrix that expands representative
floor assemblies to 50+ layers and pins:

- finite numeric outputs or explicit fail-closed states,
- support buckets and output-origin metadata,
- card-level `live` / `needs_input` / `unsupported` parity where a web
  route surface is involved,
- missing-input behavior for field/building continuations,
- bounded behavior when unsupported impact lanes are requested.

Candidate rows:

- an exact supported floor row, preferably UBIQ or Knauf, expanded by
  same-material split/duplication that preserves the intended topology;
- a Dataholz CLT dry exact row expanded into many thin CLT or dry-system
  leaves without changing its exact-match expectation unless the current
  engine cannot represent that split;
- a reinforced-concrete low-confidence/formula row with many neutral
  finish/helper leaves that must remain finite and honest;
- a raw terminal concrete helper row expanded beyond 50 layers;
- a raw bare open-web or open-box impact-blocked representative that must
  remain fail-closed for unsupported impact output without crashing;
- at least one route/card or workbench-projection case if engine support
  posture alone cannot prove user-visible stability.

Gate A should record current values and statuses exactly. If it finds a
real crash or non-finite value, add the failing case first, then move the
fix to Gate B.

Gate A landed with:

- `packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts`
  pinning numeric values, support buckets, origins, finite-value
  guarantees, and fail-closed warnings for five representative 50+
  stacks.
- `apps/web/features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts`
  pinning visible card status/value posture for representative exact,
  helper/formula, and blocked-impact 50+ stacks.

Representative families now covered:

- 53-layer UBIQ split exact stack
  (`ubiq_fl28_open_web_steel_200_exact_lab_2026`),
- 52-layer Dataholz CLT dry split exact stack
  (`dataholz_gdmtxn01_dry_clt_lab_2026`),
- 53-layer raw terminal concrete helper stack,
- 53-layer raw open-web impact-blocked stack,
- 52-layer reinforced-concrete low-confidence/formula stack.

Findings:

- split-equivalent UBIQ and Dataholz CLT 50+ stacks stay exact;
- helper/formula 50+ stacks stay finite and keep supported outputs live;
- unsupported impact lanes stay explicit as `unsupported` or
  `needs_input` at the web card layer;
- raw open-web impact remains fail-closed while airborne building
  companions remain finite and formula-owned;
- no source-blocked family, reinforced-concrete formula scope, or
  arbitrary floor reorder reopening happened.

### Gate B - fix only concrete many-layer drift

Status: NOT REQUIRED BY GATE A FINDINGS.

Gate A did not surface a runtime/card drift that needs an immediate fix.
Keep this gate as a contingency only if closeout or future targeted
review finds a concrete many-layer defect.

Valid Gate B fixes:

- prevent crashes, non-finite values, or runaway diagnostics,
- preserve support/card parity for very large floor stacks,
- normalize or fail closed on invalid many-layer input that bypasses the
  workbench,
- keep exact/benchmark/formula precedence stable when split-equivalent
  layers are present.

Invalid Gate B fixes:

- source-family reopening,
- formula retunes from stress-stack adjacency,
- arbitrary reorder invariance claims,
- broad UI redesign.

### Gate C - closeout and next-slice selection

Status: LANDED (2026-04-24, no runtime change).

Gate C closed this slice after the focused current gate stayed green and
Gate A found no required Gate B fix. The closeout contract is
`packages/engine/src/post-floor-many-layer-gate-c-v1-next-slice-selection-contract.test.ts`.

The selected next slice is `floor_layer_order_edit_stability_v1`,
documented in
`docs/calculator/SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md`.
That slice was selected because layer move/reorder behavior is the next
direct operator risk after many-layer stability, but it must be audited
without claiming arbitrary floor layer order invariance.

## Immediate Next Steps

1. Continue `floor_layer_order_edit_stability_v1` from Gate A.
2. Reopen this slice's Gate B only if a later review finds concrete many-layer drift
   that the Gate A matrices missed.
3. Keep `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`, this closed plan,
   the current checkpoint, and the planning-contract test synchronized.

## Validation

Minimum:

- `pnpm calculator:gate:current` before and after the slice,
- targeted Gate A engine/web many-layer matrices while iterating,
- `git diff --check`.

Use broad `pnpm check` if Gate B changes shared contracts,
user-visible route/card behavior, calculator values, or input
normalization.

## Completion Criteria

- floor 50+ layer stacks are executable across supported and fail-closed
  families,
- all pinned values are finite where live and honestly blocked where
  unsupported,
- field/building missing-input behavior remains explicit,
- blocked-source families remain blocked,
- arbitrary floor reorder expansion remains deferred unless separately
  selected.
