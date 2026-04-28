# Slice Plan - Floor Layer-Order Invariance Expansion v1

Status: CLOSED NO-RUNTIME (opened 2026-04-28 by
`calculator-source-gap-revalidation-v2-gate-a-contract.test.ts`; Gate A
landed in
`floor-layer-order-invariance-expansion-gate-a-contract.test.ts`; Gate C
closed in
`post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts`
and selected `wall_framed_facing_split_warning_stability_v1`)

## Objective

Expand floor layer-order edit confidence without pretending that every
floor layer order is physically equivalent.

The prior `floor_layer_order_edit_stability_v1` slice proved the first
representative edit-stability surface: explicit-role exact rows stay
exact under common UI order edits, raw terminal/helper rows expose
order-sensitive support changes honestly, and blocked raw open-web
impact remains fail-closed. It deliberately left broad arbitrary floor
reorder value invariance unclaimed.

This slice is the next bounded accuracy/edge-case audit after source
gaps revalidated as blocked. It should determine which narrower floor
order invariants are safe to claim and where raw/order-inferred stacks
must remain explicitly order-sensitive.

Current validation baseline after selection:

- `pnpm calculator:gate:current` green with engine 123 files / 575
  tests, web 43 files / 211 passed + 18 skipped, build 5/5, whitespace
  guard clean, and the known non-fatal `sharp/@img` warnings.

Current Gate A result:

- targeted Gate A contract is green: 1 file / 6 tests.
- `pnpm calculator:gate:current` is green after Gate A with engine
  124 files / 581 tests, web 43 files / 211 passed + 18 skipped, build
  5/5, whitespace guard clean, and the known non-fatal `sharp/@img`
  warnings.
- no runtime, support, confidence, evidence, warning, API, or route-card
  behavior changed.
- Gate A found no crash, non-finite value, role-defined exact
  precedence drift, unsupported output leak, hidden raw support change,
  or route-card movement requirement.
- Gate B is not required; proceed to Gate C no-runtime closeout /
  next-slice selection.

Gate C result:

- targeted Gate C closeout contract is green: 1 file / 5 tests.
- `pnpm calculator:gate:current` is green after Gate C with engine
  125 files / 586 tests, web 43 files / 211 passed + 18 skipped, build
  5/5, whitespace guard clean, and the known non-fatal `sharp/@img`
  warnings.
- the slice closed no-runtime.
- selected next slice:
  `wall_framed_facing_split_warning_stability_v1`.
- selected planning surface:
  [SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md](./SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md).

## Non-Goals

- Do not claim broad arbitrary floor reorder value invariance in Gate A.
- Do not normalize raw floor layer order as if all orders were
  physically equivalent.
- Do not change acoustic runtime values, formulas, output support,
  confidence, evidence text, warnings, API behavior, or route-card copy
  during Gate A.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector, floor fallback, no-stud, timber double-board, CLT, or
  lined-massive / heavy-core source holdouts from nearby green tests.
- Do not edit `/home/ogttuna/Dev/Machinity/Acoustic2`; it remains
  read-only upstream/reference material.

## Why This Slice Is Next

`calculator_source_gap_revalidation_v2` found no source/import
candidate ready for immediate runtime movement. The strongest
engine-addressable risk left is user layer movement and reorder:

- users can drag, duplicate, rotate, and rebuild floor layers;
- role-defined exact floor systems should not drift just because the UI
  order changes;
- raw/order-inferred stacks may legitimately change, but they must stay
  finite and explicit about supported vs unsupported outputs;
- many-layer and split/edit combinations should not amplify reorder
  into non-finite or misleading results.

This is directly aligned with private/internal-use calculator accuracy:
it verifies that common user edits do not produce arbitrary jumps,
silent false exact matches, unsupported live values, or hidden
fail-open behavior.

## Gate A - Role-Defined Vs Raw Order-Invariance Inventory

Gate A is executable and no-runtime. It created
`packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`
and records:

1. role-defined exact floor systems under reverse, rotate, base-first,
   grouped-by-role, and interleaved UI order edits;
2. exact/bound/family/formula precedence before and after each edit;
3. raw terminal/helper floor stacks where order sensitivity is expected
   and must stay explicit;
4. raw open-web/open-box or fail-closed impact representatives after
   reorder;
5. many-layer or split/duplicate floor stacks after representative
   order edits;
6. numeric finiteness and supported/unsupported output buckets for all
   selected cases;
7. the web route-card tests required before any visible support,
   confidence, evidence, warning, or value movement.

Required evidence fields:

- case id and current user-visible risk;
- topology class: role-defined exact, role-defined bound, raw terminal,
  raw order-inferred, many-layer, or fail-closed;
- expected invariant: exact row preserved, support bucket preserved,
  explicit support change, finite output only, or fail-closed;
- affected metrics (`Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`,
  `L'nT,w`, `L'nT,50`, `Ln,w+CI`, `Ctr`, `DeltaLw`);
- engine evidence owner and paired web-card requirement;
- selected next action: Gate B fix, Gate C no-runtime closeout, or a
  narrower follow-up matrix.

## Acceptance Rules

Gate A may select a Gate B fix only if it finds a concrete runtime/card
drift:

- crash or non-finite value after a reorder;
- explicit-role exact row falls out of exact precedence solely because
  UI order changed;
- unsupported impact or airborne outputs leak as live/bound values;
- route-card status disagrees with engine support buckets;
- raw/order-sensitive support changes are hidden instead of explicit.

Gate A must not select a Gate B fix for physically meaningful raw-order
differences. Those should be documented as expected support/value
changes unless they fail closed incorrectly or leak unsupported values.

## Gate A Landing Notes

Gate A pinned two role-defined exact systems through reverse, rotate,
base-first, grouped-by-role, and interleaved order edits:

- UBIQ FL-28 open-web steel exact row stays exact at `Rw=63`,
  `R'w=68`, `DnT,w=70`, `Ln,w=52`, `L'n,w=55`,
  `L'nT,w=52.2`, `L'nT,50=52`, `Ln,w+CI=51`, `Ctr=-6`.
- Dataholz GDMTXN01 dry CLT exact row stays exact at `Rw=62`,
  `R'w=46`, `DnT,w=47`, `Ln,w=50`, `L'n,w=53`,
  `L'nT,w=50.2`, `L'nT,50=50`, `Ln,w+CI=49`; `Ctr`
  remains unsupported.

It also pinned raw terminal concrete helper order sensitivity, raw
open-web impact fail-closed behavior, and many-layer split raw concrete
finiteness. These are explicit support-honesty findings, not a broad
claim that arbitrary raw floor order is value-invariant.

## Immediate Execution Order

Closed. Resume from
[SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md](./SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md)
and start Gate A:
`packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts`.
