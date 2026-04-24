# Slice Plan - Floor Layer-Order Edit Stability v1

Status: CLOSED (2026-04-24, no-runtime Gate A audit; next slice selected:
`all_caller_invalid_thickness_guard_v1`)

## Objective

Increase floor-calculator robustness around user layer moves and
reorders without pretending that all floor layer orders are physically
equivalent.

The workbench lets users duplicate, move, remove, and rebuild layers.
The calculator must stay stable under those edit paths: explicit-role
floor rows should keep their intended topology when order changes, while
raw/order-inferred stacks should either return bounded defended answers
or fail closed honestly. The system must not crash, return non-finite
values, leak unsupported impact outputs live, or silently turn
order-sensitive raw input into a false exact match.

## Non-Goals

- Do not claim arbitrary floor layer reorder value invariance.
- Do not treat raw floor order as physically meaningless. Raw stacks may
  be order-sensitive because the engine infers roles from position.
- Do not reopen `GDMTXA04A` direct exact without a modeled composite
  dry-screed source surface.
- Do not reopen `C11c` exact import while the combined wet tuple remains
  anomalous.
- Do not infer bare open-box/open-web impact behavior from packaged
  system rows.
- Do not retune reinforced-concrete, raw-helper, CLT, UBIQ, Knauf, or
  wall timber formulas from reorder adjacency.
- Do not resume `project_access_policy_route_integration_v1` until this
  selected calculator slice closes or priority explicitly changes.

## Why This Slice Is High ROI

The previous slice closed the "too many layers" operator risk by pinning
50+ floor stacks. The next direct operator risk is layer movement:
users can drag, duplicate, reorder, and rebuild rows after selecting a
floor system.

Existing completion docs are honest: floor split/parity surfaces are
pinned, but arbitrary floor reorder is not claimed. This slice turns that
open risk into an executable audit with a narrower contract:

- explicit `floorRole` topology should be robust to UI ordering where
  roles fully describe the assembly;
- raw/order-inferred topology may change, but support buckets, card
  status, and numeric values must remain finite and honest.

## Current Baseline

- Floor split/parity is pinned through engine and web tests.
- Floor seeded edit stability already exercises broad duplicate/move/
  tweak/remove chains, but it is broad-corridor rather than row-level
  value/support pinning.
- Wall reorder behavior is separately pinned; floor arbitrary reorder
  remains unclaimed.
- Raw terminal concrete helper behavior is known to be order-sensitive:
  moving concrete away from terminal position can remove lab `Rw`
  support. That is allowed only if the unsupported posture is explicit.

## Gate Plan

### Gate A - inventory current floor layer-order edit surfaces

Status: LANDED 2026-04-24.

No runtime change. The executable matrix separates three classes of
floor order edits:

- explicit-role exact rows whose role-tagged topology should survive
  reverse/rotate/move edit paths;
- raw terminal/helper rows where order-sensitive support changes are
  expected and must be pinned as honest support-bucket changes;
- raw blocked-impact rows where reordered variants must stay finite for
  supported airborne companions and fail-closed for unsupported impact.

Landed evidence:

- engine:
  `packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts`
- web cards:
  `apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts`

Gate A pins:

- exact match id, ratings basis, and impact basis where exact rows stay
  exact;
- supported/unsupported output buckets;
- finite live values and explicit missing/unsupported values;
- web card status/value posture for the user-visible edit surface;
- warning fragments only where they carry support/fail-closed meaning.

Findings:

- UBIQ FL-28 and Dataholz GDMTXN01 explicit-role exact rows stay exact
  under reverse/rotate/base-first edit orders.
- Raw terminal concrete helper reorder removes `Rw` support when
  concrete is moved away from terminal position, but keeps the support
  change explicit and all live field/impact values finite.
- Raw open-web impact stays fail-closed for impact outputs after
  reorder while airborne building companions remain finite.
- No unsupported card leaked `live` or `bound`, so no Gate B runtime/card
  fix is required by this inventory.

### Gate B - fix only concrete order-edit drift

Status: NOT REQUIRED by Gate A findings. Reopen only if Gate C or a
later audit finds concrete order-edit drift.

Valid Gate B fixes:

- prevent crashes or non-finite values after reorder/edit paths,
- keep explicit-role exact rows on exact lanes when order is only a UI
  ordering artifact,
- make order-sensitive raw changes explicit in support buckets/cards,
- prevent unsupported impact values from leaking live after a move.

Invalid Gate B fixes:

- broad arbitrary floor reorder invariance,
- source-family reopening,
- formula retunes from reorder adjacency,
- UI redesign outside the calculation/card projection contract.

### Gate C - closeout and next-slice selection

Status: LANDED 2026-04-24.

Closed without runtime change. Gate A found no crash, non-finite value,
support/card mismatch, or unsupported live leakage, so Gate B stayed
closed. The closeout contract is:

- `packages/engine/src/post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts`

The selected next slice is
`all_caller_invalid_thickness_guard_v1`, because the master-plan
cross-cutting grid still marks direct engine thickness validity as
partial while workbench normalization and wall hostile-input coverage are
already guarded.

## Immediate Next Steps

1. Continue with
   [SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md).
2. Start its Gate A no-runtime direct engine inventory.
3. Keep broad arbitrary floor reorder value invariance unclaimed unless
   a future selected slice proves a narrower invariant.

## Validation

Minimum:

- `pnpm calculator:gate:current` before and after the slice,
- targeted Gate A engine/web order-edit matrices while iterating,
- `git diff --check`.

Use broad `pnpm check` if Gate B changes shared contracts,
user-visible route/card behavior, calculator values, or input
normalization.

## Completion Criteria

- explicit-role floor reorders are pinned where topology is role-defined,
- raw/order-sensitive reorders are pinned as bounded supported changes or
  honest fail-closed states,
- card projection matches engine support buckets,
- blocked-source families remain blocked,
- arbitrary floor reorder value invariance remains unclaimed unless a
  future selected slice proves a narrower invariant.
