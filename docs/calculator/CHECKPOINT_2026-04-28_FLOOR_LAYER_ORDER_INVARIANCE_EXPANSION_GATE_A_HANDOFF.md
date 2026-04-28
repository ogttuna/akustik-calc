# Checkpoint - 2026-04-28 Floor Layer-Order Invariance Expansion Gate A

Status: Gate A landed no-runtime

## What Landed

`floor_layer_order_invariance_expansion_v1` Gate A landed as an
executable no-runtime inventory:

- engine:
  `packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`
- current-gate runner:
  `tools/dev/run-calculator-current-gate.ts`

No acoustic runtime values, formulas, support buckets, confidence,
evidence text, warnings, API behavior, or route-card copy changed.

## Findings

- Role-defined exact floor systems remain exact under reverse, rotate,
  base-first, grouped-by-role, and interleaved UI order edits.
  The pinned exact rows are:
  - UBIQ FL-28 open-web steel 200 exact lab row:
    `Rw=63`, `R'w=68`, `DnT,w=70`, `Ln,w=52`,
    `L'n,w=55`, `L'nT,w=52.2`, `L'nT,50=52`,
    `Ln,w+CI=51`, `Ctr=-6`.
  - Dataholz GDMTXN01 dry CLT exact lab row:
    `Rw=62`, `R'w=46`, `DnT,w=47`, `Ln,w=50`,
    `L'n,w=53`, `L'nT,w=50.2`, `L'nT,50=50`,
    `Ln,w+CI=49`, with `Ctr` unsupported.
- Raw terminal concrete helper stacks remain order-sensitive by design.
  Moving concrete out of the terminal helper position removes `Rw`
  support, keeps the support change visible, and keeps field/building
  airborne and impact values finite.
- Raw open-web impact representatives remain fail-closed after reorder:
  impact outputs stay unsupported rather than leaking as live/bound
  answers while airborne companions remain finite and formula-owned.
- Many-layer split raw concrete stacks remain finite, keep supported
  and unsupported outputs partitioned, and do not fabricate exact or
  bound floor-system matches.
- The expanded audit found no crash, non-finite value, exact-precedence
  drift, unsupported output leak, hidden raw support change, or route
  card movement requirement.

## Decision

Gate B is not required for this slice.

Selected next action:
`gate_c_no_runtime_closeout_and_next_slice_selection`.

Next contract to add:
`packages/engine/src/post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts`.

Gate C should close this slice no-runtime, update the current plan and
state documents, and select the next bounded calculator accuracy slice.

## Boundaries

- Do not claim broad arbitrary floor layer-order value invariance.
- Do not normalize raw/order-inferred floor stacks as if every order is
  physically equivalent.
- Do not reopen floor fallback, wall source holdouts, `GDMTXA04A`,
  `C11c`, raw bare open-box/open-web impact, wall selector behavior,
  or productization-only work from this nearby green result.
- Add a new web route-card matrix before any later Gate B changes
  visible support, confidence, evidence, warning, or value behavior
  from this expanded inventory.

## Validation

Pre-Gate-A baseline was run before this active-slice edit:

- `pnpm calculator:gate:current`
  - engine 123 files / 575 tests green
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with known non-fatal `sharp/@img` warnings
  - whitespace guard clean

Post-Gate-A validation:

- targeted Gate A engine contract
  - `pnpm --filter @dynecho/engine exec vitest run src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts --maxWorkers=1`
  - 1 file / 6 tests green
- `pnpm calculator:gate:current`
  - engine 124 files / 581 tests green
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with known non-fatal `sharp/@img` warnings
  - whitespace guard clean
