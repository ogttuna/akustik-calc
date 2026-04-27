# Slice Plan - Wall Heavy-Core Concrete Tightening

Status: NEXT Gate B subplan for
`realistic_layer_combination_coverage_cartography_v1`

Selected: 2026-04-27 by
`realistic-layer-combination-coverage-cartography.test.ts`

## Objective

Tighten the common concrete / heavy-core wall lane without making a
screening estimate look exact.

The selected Gate A cell is
`wall.concrete_heavy_core_screening.field`. It is high value because it
already returns finite field outputs for a common wall family, but its
evidence posture is still screening-tier. Gate B must either promote it
to a narrower formula/family/benchmark lane with defensible evidence or
leave it explicitly screening while adding better guards and user-facing
honesty.

## First Step

Do a source/formula and implementation-path audit before runtime math
changes.

The first PR/commit inside this slice should be no-runtime unless it can
name a precise source/formula rule and the exact tolerances it will
defend. The audit must answer:

1. Which surface is being changed: generated dynamic
   `wall-screening-concrete`, the workbench `concrete_wall` preset
   screening seed, or a selector/value-pin corridor?
2. Which evidence tier is justified after the change: `screening`,
   `formula`, `family`, or `benchmark`?
3. Which outputs are supported in each context: `Rw`, `R'w`, `Dn,w`,
   `DnT,w`, `DnT,A`, `C`, `Ctr`, and `STC`?
4. Which exact/benchmark lanes must remain untouched?

## Current Surfaces To Keep Separate

- Workbench `concrete_wall` preset:
  `wall-field-continuation-completeness-matrix.test.ts` pins the current
  screening mass-law seed values. It is not automatically the same as
  the generated Gate A dynamic candidate.
- Generated Gate A candidate:
  `realistic-layer-combination-coverage-cartography.test.ts` pins
  `wall.concrete_heavy_core_screening.field` as runtime rank 1 with
  expected dynamic family `lined_massive_wall`, supported field outputs,
  and screening confidence.
- Wall selector benchmark/value pins:
  `dynamic-airborne-wall-selector-value-pins.test.ts` and
  `wall-selector-output-origin-card-matrix.test.ts` pin double-leaf,
  lined-massive, boundary, sibling, and heavy-core-trim cells. These are
  drift guards, not permission to retune every heavy-core surface.
- Deep-hybrid swap guards:
  `dynamic-route-deep-hybrid-swap-heavy-core.test.ts`,
  `dynamic-airborne-deep-hybrid-swap-heavy-core.test.ts`, and
  `dynamic-route-family-boundary-scan.test.ts` protect adjacent-swap and
  family-boundary stability. They stay value-pin/stability evidence
  unless this slice explicitly selects one of those rows.

## Implementation Files To Inspect

- `packages/engine/src/dynamic-airborne.ts`
  - family scoring/selection around `double_leaf` and
    `lined_massive_wall`;
  - field/building output derivation and family-boundary diagnostics;
  - remaining in-file recursive guards, especially the boundary hold.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`
  - heavy unframed cavity cap;
  - narrow heavy double-leaf gap cap;
  - composer-backed correction guards that can affect this lane.
- `packages/engine/src/dynamic-airborne-family-detection.ts`
  - predicates that decide whether a wall is lined massive, double leaf,
    or another heavy family.
- `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`
  - selected candidate and rank contract.
- `apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts`
  - current user-visible concrete preset screening posture.
- `apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts`
  - card/origin behavior for selector-family wall rows.
- `apps/web/features/workbench/dynamic-calc-branch.test.ts`
  - user-facing branch summaries for screening vs dynamic wall paths.

## Evidence Policy

Acceptable evidence for a runtime tightening:

- official manufacturer/system rows with visible layers and acoustic
  ratings;
- source-corpus rows already represented in this repository or
  read-only upstream `Acoustic2`;
- a documented formula-owned rule that applies to the selected topology
  and preserves exact/benchmark precedence;
- a bounded family rule that narrows the current screening corridor
  without claiming exact source truth.

Unacceptable evidence:

- values copied from a generic blog or marketing table;
- a wall value with no assembly layers, no context, or no output metric;
- borrowing floor heavy-concrete formula scope for this wall lane;
- using nearby green deep-hybrid or selector pins as a blanket retune.

## Gate B Contract

Before runtime implementation, add or update a focused contract that
states:

- selected row id and topology;
- current value/origin/support posture;
- proposed value/origin/support posture;
- allowed tolerance in dB and why that tolerance is defensible;
- unsupported outputs that must stay unsupported;
- exact/benchmark rows that must remain unchanged;
- web-card wording if confidence/support/origin changes.

Minimum engine assertions:

- candidate output values stay finite and physically ordered;
- `R'w <= Rw` where both are present;
- field/building derived outputs stay inside the established corridor;
- exact/benchmark wall rows do not drift;
- adjacent layer swaps do not introduce silent large jumps.

Minimum web assertions if visible posture changes:

- concrete/heavy-core output cards show the right evidence tier;
- branch summary does not claim exact/benchmark support unless the engine
  supports that claim;
- origin/confidence text survives layer edit, reorder, and save/load
  paths already covered by workbench history helpers.

## Gate C Closeout

Close this slice only after:

- targeted engine/web tests pass;
- `pnpm calculator:gate:current` is green;
- broad `pnpm check` is green;
- `git diff --check` is clean;
- `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`,
  `PERSONAL_USE_READINESS_ROADMAP.md`, and this plan agree on the next
  readiness item.

If Gate B finds no defensible evidence for a runtime value change, close
honestly no-runtime and keep the lane screening, but leave the stronger
contract and documentation in place.
