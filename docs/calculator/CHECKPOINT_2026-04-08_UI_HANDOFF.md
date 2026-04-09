# UI Handoff Checkpoint — 2026-04-08

Document role:

- fast restart note before switching focus to UI work
- read this when the question is “where exactly did we leave the dynamic calculator work?”
- this is a checkpoint summary, not a replacement for the living docs

## Current Snapshot

- dynamic calculator is at a safe UI handoff point
- there is no active known solver blocker in the currently defended floor, wall, or mixed corridors
- latest mixed route-history expansion is green:
  - generated save/load roundtrip after cross-mode chain
  - representative deep-stack save/load roundtrip after alternating floor/wall detours
  - compact representative seeded-family roundtrip matrix across:
    - heavy-concrete
    - open-web-bound
    - `REGUPOL Curve 8 exact`
    - `dataholz_timber_frame_exact`
    - `hollow_core_vinyl_exact`
    - `REGUPOL wet bound`
    - `Getzner AFM 33 Delta`
    - `UBIQ steel 300 unspecified bound`
    - `UBIQ steel 200 unspecified bound`
  - each seeded family now survives reload after a wall detour plus two neighboring seeded-family detour chains, not only one alternating switch
  - the same matrix is now also green at the current eight-entry saved-scenario retention boundary
  - oldest, mid-window, and newest retained snapshots now all reload cleanly inside that same window
  - workbench targeted pack: `4` files, `8` tests
  - engine adjacent pack: `2` files, `2` tests
- current mixed generated floor/wall sample set defends `27` broader packages
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
    - save/load roundtrip parity after those longer cross-mode chains
    - representative deep-stack save/load roundtrip parity after alternating floor/wall detours
    - compact representative seeded-family roundtrip matrix across heavy-concrete, open-web-bound, product-data exact, product-backed lower-bound, product-property `DeltaLw`, warning-heavy steel bound, and warning-light steel bound detours

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
     - REGUPOL Curve 8 exact
     - REGUPOL wet bound
     - Getzner AFM 33 Delta
     - UBIQ open-web 200 exact
     - UBIQ open-web 400 exact
     - UBIQ steel 250 bound
     - UBIQ steel 200 unspecified bound
     - UBIQ steel 300 unspecified bound
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

## First UI Usability Slice

After the calculator checkpoint, the first UI-only slice focused on two concrete operator pain points:

1. example-loader clarity
   - the old toolbar mixed starter stacks, exact references, bound families, and low-confidence fallbacks into one flat preset list
   - the control now reads as an explicit optional loader instead of a calculator setting:
     - label: `Load Sample Rows`
     - helper copy explains:
       - it loads a ready-made assembly into the editor
       - it replaces the current rows
       - it does not change mode or project context
   - presets are now rendered in clearer optgroups:
     - `Quick starts`
     - `Measured examples`
     - `Conservative examples`
     - `Diagnostics`
   - the toolbar also shows the current sample name plus a short plain-language group description
   - later refinement:
     - the large helper card was removed
     - `Start empty` moved into the dropdown as the first option instead of sitting as a separate button
     - switching study mode now defaults back to the empty state instead of force-loading the first sample

2. narrow results-lane distortion
   - the weighted answer chart previously switched to two columns too early (`md:grid-cols-2`) even inside the already narrow guided results column
   - this caused the Rw / Ln,w cards to become tall, cramped, and visually misaligned
   - the answer chart now stays stacked until very wide layouts (`2xl:grid-cols-2`)
   - inside the simple workbench results rail, the weighted lanes are now forced to stay stacked and the hero split no longer switches to a side-by-side layout until `3xl`
   - this specifically prevents the “three squeezed answer cards in the right rail” failure mode that showed up during UI review
   - the live response-curve section now only opens a two-column grid when there is more than one chart, so a single live chart no longer renders as a half-width card with dead space beside it

Targeted UI tests added for this slice:

- from `apps/web`
- `pnpm vitest run features/workbench/simple-workbench-preset-groups.test.ts features/workbench/simple-workbench-toolbar.test.ts features/workbench/result-answer-chart.test.ts`

Those targeted tests are green.

## Build Tooling Fix

The web build failure that showed up as `/_not-found` page-data collection instability was traced to a tooling conflict, not to the route tree itself:

- `pnpm dev` and `pnpm build` were both writing into the same `apps/web/.next` directory
- the build wrapper clears the output directory before running `next build`
- when a local dev server was already using `.next`, this created a race and corrupted the dev/build artifact graph

The fix:

- `pnpm dev` now runs through [run-next-dev.ts](../../tools/dev/run-next-dev.ts)
- local development now defaults to `NEXT_DIST_DIR=.next-dev`
- production build keeps using `.next`
- `tsconfig.next.json` now includes `.next-dev/types/**/*.ts` so route/type generation still resolves cleanly in the new dev dist

Verified after the fix:

- `pnpm --filter @dynecho/web build`
- `pnpm build`
- both were run successfully while the local dev server was active on port `3010`

## Latest UI Shortcut

- the simple workbench toolbar now includes an `Edit PDFs` button directly next to `Simple PDF`
- this button stores the current proposal snapshot and opens `/workbench/proposal/configure` in a new tab
- the shortcut reuses the same proposal-preview storage path as the existing proposal panel flow, so the configure page opens with the current calculator state
- the configure route was simplified into a single `PDF Editor` flow with:
  - one export-target switch for `Branded PDF` vs `Simple PDF`
  - one download action that follows the selected target
  - tabbed editing so only essentials/content/issuer/details are visible at a time
- follow-up UI correction:
  - the toolbar shortcut now explicitly opens the editor in `simple` mode as `Edit Simple PDF`
  - both `/workbench/proposal` and `/workbench/proposal/configure` now render style-aware preview HTML, so `Simple PDF` actually previews the lightweight layout instead of the branded one
  - the editor tab order is now `Metrics -> Layers -> Cover -> Issuer` so `Rw / Ln,w` and layer/material rows are first-class instead of buried
  - metric visibility can now be toggled directly in the PDF editor:
    - one toggle for the primary headline metric
    - one toggle per packaged metric row
    - hidden metrics are removed from branded/simple preview and PDF output, not just visually muted in the editor
  - latest layout correction:
    - the configure page now uses a wider shell (`96rem`) instead of the default narrower workbench canvas
    - the old top-right export card was removed
    - export target, timestamps, and save/download controls now live inside the right sticky preview rail
    - the main editor grid now intentionally favors the left editing column so metric/layer cards stop looking compressed

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

1. treat the compact representative seeded-family matrix as the current mixed anchor
   - keep heavy-concrete, open-web-bound, product-data exact, exact family/system match, exact family/system match with low-frequency closures, product-backed lower-bound, product-property `DeltaLw`, warning-heavy steel bound, and warning-light steel bound detours green on every adjacent pack
2. after that, decide whether the next best move is broader seeded long-chain families beyond this first two-seeded, retention-boundary-safe chain or a genuinely new evidence class in mixed breadth
3. keep `pnpm build` and the mixed checkpoint packs green after every slice

Current strongest next candidates if breadth continues first:

- switch to broader seeded long-chain families
  - useful because the current risk is no longer “missing one more single preset” or “missing the compact seeded-family matrix”, but keeping the existing evidence classes stable under harsher operator-history chains
- or pause breadth unless a genuinely new evidence class appears
  - useful if the compact representative matrix and current generated breadth already cover the most meaningful supported lane types
- if breadth continues, prefer genuinely new evidence classes over sibling preset rows
  - useful if that matrix stays green and the bigger remaining risk is operator-history drift rather than one more preset-family proof point
  - the current mixed set already covers exact, product-data exact, product-backed bound, product-property DeltaLw, steel interpolation, steel convergence, and steel missing-support-form branches

That candidate order is an inference from the current preset inventory and defended sample-set shape, not a hard requirement.

## Known Caveats

- some workbench Vitest files still expect `apps/web` as the working directory because of `@/…` alias resolution
- when a root-run single-file Vitest call fails on `@/lib/format`, that is currently an invocation-context problem, not a fresh solver regression
- the dev server now writes into `.next-dev`; this is intentional so `pnpm build` can run safely in parallel
- if needed later, the web app runs on port `3010`
- the broader web typecheck still reports many pre-existing test-file typing issues outside this UI slice

## Files Most Likely To Matter Next

- [mixed-study-mode-generated-test-helpers.ts](../../apps/web/features/workbench/mixed-study-mode-generated-test-helpers.ts)
- [mixed-floor-wall-generated-test-helpers.ts](../../packages/engine/src/mixed-floor-wall-generated-test-helpers.ts)
- [floor-exact-companion-split-parity.test.ts](../../packages/engine/src/floor-exact-companion-split-parity.test.ts)
- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
