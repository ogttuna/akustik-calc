# UI Handoff Checkpoint — 2026-04-08

Document role:

- fast restart note before switching focus to UI work
- read this when the question is “where exactly did we leave the dynamic calculator work?”
- this is a checkpoint summary, not a replacement for the living docs

## Current Snapshot

- dynamic calculator is at a safe UI handoff point
- there is no active known solver blocker in the currently defended floor, wall, or mixed corridors
- latest mixed generated breadth expansion is green:
  - heavier measured CLT exact (`TUAS CLT 260`)
  - engine targeted pack: `3` files, `4` tests
  - workbench targeted pack: `4` files, `6` tests
- current mixed generated floor/wall sample set defends `21` broader packages
- latest root repository build is green on `2026-04-08`:
  - command: `pnpm build`
  - engine DTS blocker closed
  - web typecheck/build blocker closed

## What Was Done In This Stretch

The latest calculator stretch closed four kinds of work:

1. floor-side hardening and audit widening
   - raw-floor posture, split parity, lower-only packaged lanes, disjoint topology, helper topology, and route-history parity were all tightened and frozen with executable tests
   - exact floor-system companion split drift was narrowed and fixed without widening solver behavior

2. mixed floor/wall route-history coverage
   - the mixed route surface now has:
     - generated split-detour parity
     - generated edit-history parity
     - wider duplicate/swap grid coverage
     - deterministic longer cross-mode restore chains

3. mixed generated breadth expansion
   - the generated mixed sample set was widened across defended exact/bound families instead of inventing new solver lanes
   - current defended floor cohort inside that generated set includes:
     - Knauf concrete exact
     - TUAS concrete dry exact
     - Knauf direct timber exact
     - Knauf timber mount exact
     - Knauf acoustic timber exact
     - Dataholz timber-frame exact
     - Dataholz Dry exact
     - Dataholz Dry RC exact
     - Dataholz CLT dry exact
     - TUAS CLT exact
     - TUAS CLT 260 exact
     - TUAS open-box exact
     - TUAS open-box dry exact
     - UBIQ open-web 200 exact
     - UBIQ open-web 400 exact
     - UBIQ open-web 300 bound
     - steel fallback
     - hollow-core vinyl exact
     - plus the representative wall cases already in the mixed set

4. build blockers
   - engine build blocker:
     - [dynamic-airborne.ts](../../packages/engine/src/dynamic-airborne.ts)
     - fixed a literal-union widening issue in `scoredFamilies`
   - web build blocker:
     - [dynamic-route-deep-hybrid-test-helpers.ts](../../apps/web/features/workbench/dynamic-route-deep-hybrid-test-helpers.ts)
     - fixed an implicit-`any` callback parameter

## What Is Stable Right Now

- build:
  - `pnpm build`
- engine mixed checkpoint pack:
  - `pnpm vitest run packages/engine/src/floor-exact-companion-split-parity.test.ts packages/engine/src/mixed-floor-wall-generated-matrix.test.ts packages/engine/src/mixed-floor-wall-complex-stack.test.ts`
- workbench mixed checkpoint pack:
  - from `apps/web`
  - `pnpm vitest run features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts features/workbench/mixed-study-mode-torture.test.ts`

All three are green at this checkpoint.

## Where To Resume After UI

Use this order:

1. read [CURRENT_STATE.md](./CURRENT_STATE.md)
2. read [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
3. then use this checkpoint note for the exact restart point

Recommended restart order after UI:

1. decide whether to continue mixed generated breadth or switch to broader seeded long-chain families
2. if continuing breadth first, prefer families that add a new evidence class instead of another near-duplicate exact row
3. keep `pnpm build` and the mixed checkpoint packs green after every slice

Current strongest next candidates if breadth continues first:

- `regupol_curve_8_exact`
  - useful because it adds an official product-data exact lane rather than another family-nearby timber or CLT row
- `regupol_curve_8_wet_bound`
  - useful because it adds a product-backed bound surface and support-honesty pressure
- `ubiq_steel_250_bound`
  - useful because it adds a steel interpolation/bound class distinct from the exact open-web rows

That candidate order is an inference from the current preset inventory and defended sample-set shape, not a hard requirement.

## Known Caveats

- some workbench Vitest files still expect `apps/web` as the working directory because of `@/…` alias resolution
- when a root-run single-file Vitest call fails on `@/lib/format`, that is currently an invocation-context problem, not a fresh solver regression
- the dev server is not part of this checkpoint; if needed later, the web app runs on port `3010`

## Files Most Likely To Matter Next

- [mixed-study-mode-generated-test-helpers.ts](../../apps/web/features/workbench/mixed-study-mode-generated-test-helpers.ts)
- [mixed-floor-wall-generated-test-helpers.ts](../../packages/engine/src/mixed-floor-wall-generated-test-helpers.ts)
- [floor-exact-companion-split-parity.test.ts](../../packages/engine/src/floor-exact-companion-split-parity.test.ts)
- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
