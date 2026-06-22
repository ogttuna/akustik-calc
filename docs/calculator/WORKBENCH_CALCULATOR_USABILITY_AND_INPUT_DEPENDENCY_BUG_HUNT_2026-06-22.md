# Workbench Calculator Usability And Input Dependency Bug Hunt - 2026-06-22

## Status

New user-requested application usability and bug-hunt track.

This track is intentionally adjacent to, but separate from, the current
runtime calculator implementation chain. The immediate goal is not to
open a new formula family. The goal is to make the calculator screen
truthful, understandable, and less error-prone while preserving the
calculator's metric/basis integrity.

Do not treat this document as a replacement for:

- `docs/calculator/DOCUMENTATION_MAP.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- the currently selected runtime/coverage-refresh handoff

This document records the usability and bug surface we will work through
without forgetting the user's concerns.

## User Request Summary

The user wants a focused pass on application rough edges, bugs, and
calculator-screen usability rather than another formula-owner slice.

The specific concern is the calculator/workbench input surface:

- The calculator screen exposes many inputs.
- Selecting modes such as Lab, Field, Building, Room, or similar output
  contexts changes which inputs are shown.
- Not every visible input is always used by the active calculation.
- The active route depends on the layer combination, selected outputs,
  metric basis, source/exact-match status, and formula family.
- A user can enter a value into a visible input, but the active route may
  ignore it because a mass-law route, exact-source route, scalar-only
  route, lab-only output, or another formula path is currently selected.
- The UI must explain that clearly. On hover, the user should be able to
  understand whether a field is used, needed, defaulted, or inactive,
  and why.
- The user also suspects other inconsistencies where values are displayed
  incorrectly or stale values are shown. We should actively search for
  these, reproduce them, document them, and fix them without interfering
  with other agents' unrelated work.

Example desired behavior:

When the current selected output is `Rw` and the active route is a lab
mass/formula route, a room/building input should not look influential.
On hover, it should explain that the current `Rw` output is lab-based and
does not depend on that room/building field. When `R'w`, `Dn,w`, or
`DnT,w` is selected through an owned field/building route, the same
field can become `Needed`, `Used`, or `Default` depending on the route
and entered values.

## Relationship To Existing Input Effectiveness Work

Existing plan:

`docs/calculator/WORKBENCH_ROUTE_INPUT_EFFECTIVENESS_INDICATOR_PLAN_2026-06-19.md`

That plan already landed an important first pass:

- route inputs can show `Needed`, `Used`, `Inactive`, and `Default`;
- material and layer-row fields can show route effectiveness badges;
- lab-only `Rw` in Building mode should keep building inputs inactive;
- mixed lab plus field/building outputs should keep the required
  building fields active;
- output cards should not show helper metrics from stale
  `metrics.estimated*` fields when the target output is not supported.

This new track continues from that state. It does not assume the first
pass is complete. It treats the existing route-input effectiveness
implementation as the baseline to audit, harden, and make more
explanatory.

Relevant current files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
- `apps/web/features/workbench-rebuild/material-route-input-effectiveness.ts`
- `apps/web/features/workbench-rebuild/material-route-input-effectiveness.test.ts`
- `apps/web/features/workbench-rebuild/material-editor-panel.tsx`
- `apps/web/features/workbench-rebuild/material-editor-panel.test.ts`
- `apps/web/app/globals.css`
- `apps/web/features/workbench/simple-workbench-output-model.test.ts`
- workbench surface-parity tests that assert cards, saved replay, server
  replay, reports, and API responses stay aligned

## System Comparison - 2026-06-22

The request is understood as an interaction-truthfulness problem:

- the user is not asking for another acoustic formula owner in this
  track;
- the user wants the calculator screen to tell them whether each visible
  input affects the currently selected output and route;
- the user wants hover explanations that name the reason, not just a
  status badge;
- the user wants us to actively hunt stale or inconsistent values across
  cards, saved replay, reports, API previews, and assistant previews.

The current implementation already has a first-pass structure that
matches this direction, but it is not yet rich enough to call complete.

### What Already Exists

`apps/web/features/workbench-rebuild/calculator-workbench.tsx` currently
builds route input badges through:

- `buildRouteInputEffectiveness`
- `buildLayerInputEffectiveness`
- `buildOutputRows`
- `showAirborneContext`
- `showBuildingPredictionContext`
- `showImpactContext`
- `showFloorImpactContext`
- `showWallTopologyContext`

The current route input model recognizes these field families:

- airborne context:
  `airborneMode`, panel width/height, receiving room volume, RT60;
- building prediction:
  source room volume, flanking junction, conservative flanking
  assumption, coupling length, building output basis;
- wall topology:
  topology mode, side A/B groups, cavity group, cavity depth/fill,
  absorption class, support topology, support spacing, resilient bar
  side count;
- floor impact:
  load basis and resilient layer dynamic stiffness;
- impact field context:
  field K, CI, CI50-2500, impact receiving room volume.

The current code already treats `needs_input` tasks as strongest: when a
route task maps to an input element, the badge becomes `Needed` before
other statuses.

The current code already uses `supportedTargetOutputs` before showing a
live output row in `buildOutputRows`. This is important because it
prevents stale `metrics.estimated*` fields from appearing as supported
cards when the engine did not support that requested output.

The current material editor already has its own route-input helper:

`apps/web/features/workbench-rebuild/material-route-input-effectiveness.ts`

It marks:

- provenance fields such as source status, tags, and notes as inactive;
- material category, behavior, and density as used for live formula
  routes;
- flow resistivity as needed/used/inactive depending on porous absorber
  route proof;
- dynamic stiffness as used only when the live floor impact result echoes
  the material value;
- selected materials outside the active layer stack as inactive.

The current test baseline is meaningful:

- `route-input-effectiveness.test.ts` already covers lab-only `Rw` in
  Building mode, mixed `Rw + DnT,w`, missing context tasks, exact source
  topology inactivity, impact-only stale building-panel hiding, and
  layer role semantics.
- `material-route-input-effectiveness.test.ts` already covers flow
  resistivity, dynamic stiffness, metadata inactivity, exact source
  inactivity, and mechanical field usage only when the route basis
  reports it.
- `material-editor-surface-parity.test.ts` already covers at least one
  stale rating/value class: visible lab companion metrics should come
  from the supported metric fields instead of stale rating-surface values.

### Where The Current System Falls Short Of The User Request

The existing badge statuses are useful, but the hover text is often too
generic.

Initial examples observed before the tooltip slices:

- `Required before this route can calculate`
- `Used by the active building-prediction context`
- `Used by the current wall route`
- `Not used by the current output set`
- `Using a route default for this input`

As of Slice 13 below, the listed generic strings no longer remain in the
`buildRouteInputEffectiveness` production helper. They stay here as the
original bug class that motivated the route-context tooltip work.

These are technically helpful, but they do not fully answer the user's
question: "Why does this input not change my current `Rw` or `R'w`
result?"

The tooltip needs to name the active output family, basis, and route
reason where possible.

Examples of target detail:

- `Inactive: current output is lab Rw, so room volume is not part of the
  selected lab formula route. Select R'w, Dn,w, or DnT,w with Field or
  Building mode to make this input relevant.`
- `Used: the double-leaf/framed formula route uses cavity depth in
  mass-air-mass resonance and cavity-depth credit for the selected Rw.`
- `Default: the current route is using a fallback RT60 or flow
  assumption because no user value was supplied. Entering a value may
  change field/building outputs.`

The current status builder also has a broad first pass for airborne
context outputs. When a field/building output is selected and the mode
is not Lab, it can mark context fields as `Used` or `Default` based on
screen state before checking whether the live result actually supports
that output through the active route. A later live-route pass exists,
but the helper keeps the first assigned status. This should be audited
carefully because it can overstate usage in unsupported, exact-source,
or route-mismatch cases.

The current model relies on inference from:

- selected outputs;
- UI context mode;
- `supportedTargetOutputs`;
- `requiredInputs`;
- `propertyDefaults`;
- missing-input tasks;
- route method strings and basis text.

That is a reasonable first implementation, but it is not a complete
per-input dependency contract. Some statuses may be conservative, but
some may still be too broad.

### Current Value-Display Guardrails

`buildOutputRows` in the main workbench gates live rows by
`supportedTargetOutputs`, `unsupportedTargetOutputs`, and
`acousticAnswerBoundary`.

`workbench-v2-calculator-assistant.ts` contains a similar output-row
model and should be kept in sync with the main workbench output-row
logic. Any stale-value bug fixed in one output-row path should be checked
against the other.

Older/simple workbench surfaces still contain direct reads of
`metrics.estimated*` in several places. Some are legitimate internal
test helpers or legacy surfaces, but this bug class should be searched
whenever a user reports a value appearing after an output becomes
unsupported.

## Populated Bug-Hunt Backlog

### P0 - Tooltip Explanations Are Too Generic

Problem:

The current badge labels and `title` attributes often say only
`Used`, `Needed`, `Default`, or `Inactive` with short generic reasons.
This does not meet the requested UX bar.

Expected fix:

Create reason builders that can generate field-specific text from:

- selected output family: lab airborne, field airborne, building
  airborne, impact, impact field;
- result basis: formula, exact source, measured exact, needs input,
  unsupported;
- field family: airborne context, building prediction, wall topology,
  material physical property, layer role/thickness/material, floor
  impact;
- live route proof: supported target output plus finite display value.

Acceptance:

Hover text should explain why changing the input will or will not affect
the current selected output.

### P0 - Audit Broad `Used` / `Default` Context Marking

Problem:

For selected airborne context outputs, context fields can be marked
`Used` or `Default` from UI mode and selected output before the route is
proven live. Because `setRouteInputEffectiveness` keeps the first status,
the later live-route check cannot refine it.

Scenarios to verify:

- `R'w` selected, Building mode, but route returns unsupported.
- `R'w` selected, Building mode, exact source/lab-only route owns `Rw`
  but not field output.
- `DnT,w` selected with missing building terms.
- mixed `Rw + R'w` where only lab output is live and field output is
  `needs_input` or `unsupported`.

Expected fix:

Do not mark context fields `Used` unless at least one selected context
output is live and supported, or the field is explicitly `Needed`.
Otherwise prefer `Inactive`, `Default`, or no badge with precise reason.

### P0 - Output Row Logic Must Stay Support-Gated Everywhere

Problem:

The main workbench output rows now gate live display by
`supportedTargetOutputs`, but similar logic exists in calculator
assistant previews and older/simple surfaces.

Scenarios to verify:

- Change selected outputs after a result exists.
- Request an unsupported field/building metric after a lab result.
- Request unsupported ASTM/impact aliases on a wall route.
- Save/reload the stack and compare cards, assistant preview, report,
  server snapshot, and API result.

Expected fix:

Any displayed output must be live only when the current result says the
target output is supported. Stale metric fields are not enough.

### P1 - Field-Specific Route Dependency Is Inferred, Not Owned

Problem:

The web infers input usage from result basis strings and selected output
groups. This can miss field-level nuance, especially for routes where a
field is generally required by the family but not by the exact selected
output.

Expected fix direction:

Short term: keep web inference conservative and improve tests for known
route families.

Long term: consider adding an engine-provided dependency contract such
as:

- `usedInputFields`
- `defaultedInputFields`
- `inactiveInputFields`
- `inputDependencyReasons`

Only emit these when the route can prove them.

### P1 - Exact Source Versus Formula Explanations Need Separate Copy

Problem:

Exact source routes use construction identity and metric basis. Formula
routes consume physical inputs. The same visible field can be used under
one route and inactive under another.

Scenarios to verify:

- exact wall source with manual topology fields filled;
- exact impact source with dynamic stiffness and load basis filled;
- formula wall route with the same fields filled;
- formula floor impact route with the same fields filled.

Expected fix:

Tooltip text must say whether the result is exact-source owned or
formula-route owned.

### P1 - Defaulted Status Needs Better Consequence Text

Problem:

`Default` currently says the route is using a fallback, but often not
which route term is defaulted or whether entering a value can change the
result.

Scenarios to verify:

- RT60 default in field/building outputs.
- building output basis fallback.
- flow resistivity engineering default.
- support spacing or topology fallback, if any route reports it through
  `propertyDefaults`.

Expected fix:

Default tooltips should identify the fallback and say whether user input
can replace it.

### P1 - Panel Visibility Needs Scenario Re-Audit

Problem:

`showBuildingPredictionContext` shows the building section when any
airborne output is selected and Building mode is active. This is useful
for transparency, but lab-only `Rw` can show building fields that are
inactive. That is acceptable only if the inactive explanation is clear.

Scenarios to verify:

- `Rw` only + Building mode.
- `STC`, `C`, or `Ctr` only + Building mode.
- `Rw + DnT,w` + Building mode.
- floor impact-only after a previous wall Building mode.

Expected fix:

Keep panels visible when they help users understand mode state, but do
not imply influence. The inactive tooltip must explain the basis
boundary.

### P1 - Material Editor Needs The Same Explanation Quality

Problem:

Material fields currently have route badges, but text is also fairly
generic. The user needs to understand whether changing density, flow
resistivity, dynamic stiffness, modulus, loss factor, tags, or notes can
change the current result.

Scenarios to verify:

- selected material not in active layer stack;
- material in stack but exact source owns output;
- porous absorber with missing flow resistivity;
- porous absorber with flow used by double-leaf/framed route;
- resilient layer with dynamic stiffness used by floor impact;
- material metadata fields.

Expected fix:

Material tooltip copy should name the active route family or explain why
the field is metadata only.

### P2 - Build A Route/Input Snapshot Fixture Pack

Problem:

Manual testing will miss combinations. Current tests cover important
cases but not a full user-facing matrix.

Expected fix:

Add compact fixtures for:

- lab-only wall formula;
- field wall formula;
- building wall formula;
- exact wall source;
- double-leaf/framed wall formula;
- floor impact formula;
- exact impact source;
- unsupported alias request;
- stale selected-output switch.

Each fixture should assert:

- visible panels;
- badge status;
- tooltip reason;
- output rows;
- saved/server replay if relevant.

### P2 - Consider A Dev Audit View

Problem:

It is hard to debug whether an input is visible, sent in payload, used by
route, defaulted, or inactive.

Possible fix:

Add a dev-only diagnostic table or test helper that records for each
input:

- visible;
- has user value;
- sent in estimate payload;
- present in required inputs;
- present in property defaults;
- mapped from `needs_input`;
- badge status;
- tooltip text;
- supported outputs.

This does not need to be user-facing.

## Actionable Implementation Items - 2026-06-22

Use this as the implementation order for this usability track. Each item
should be a small slice with its own targeted tests. Do not edit current
runtime formula-owner files unless a later item explicitly opens an
engine dependency-contract spike.

### Progress Log

2026-06-22 - Slice 1 baseline:

- Edited only
  `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`.
- Added a current route-context badge title baseline for lab-only
  inactive, live building, missing building context, exact source, and
  floor impact formula scenarios.
- No engine, shared schema, API route, route selection, formula math, or
  UI rendering behavior changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts`
  passed with `16 tests`.
- Next safe slice:
  add the first desired failing test for unsupported/stale-helper
  field-building context inputs, then tighten
  `buildRouteInputEffectiveness` in its existing helper region only if
  no other agent has touched that region.

2026-06-22 - Slice 2 unsupported/stale-helper context truthfulness:

- Edited:
  `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
  and the existing `buildRouteInputEffectiveness` helper region in
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.
- `calculator-workbench.tsx` already had unrelated dirty preset/Rw
  anchor work from another agent; this slice only touched the
  route-input helper area around the context-effectiveness logic.
- Added a failing regression test first: unsupported `R'w` with finite
  stale helper metrics must keep panel/source/building-basis inputs
  `Inactive`, not `Used`.
- Removed the broad UI-mode-based early `Used` / `Defaulted` marking for
  field/building context inputs.
- Field/building context inputs now become `Used` only through the later
  live-route branch when a selected context output is supported and
  finite.
- Unsupported, exact-source, or non-live field/building context outputs
  now get conservative `Inactive` explanations unless an explicit
  `needs_input` task or route default has already claimed the field.
- No engine, shared schema, API payload, route selection, formula math,
  source matching, or output-support production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts`
  passed with `17 tests`;
  `pnpm --filter @dynecho/web typecheck` passed;
  scoped `git diff --check` passed for the touched files.
- Next safe slice:
  improve route-input title wording with small reason helpers, keeping
  the same conservative status semantics and adding title-token tests
  before changing copy.

2026-06-22 - Slice 3 lab-only context tooltip wording:

- Edited:
  `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
  and the existing route-input helper region in
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.
- Added a title-token expectation before changing implementation:
  lab-only `Rw` while Building mode is selected should explain that the
  current output set is lab airborne and that field/building context
  inputs affect outputs such as `R'w`, `Dn,w`, or `DnT,w`.
- Replaced the generic `Not used by the current output set` tooltip for
  this case with a lab/field-building basis-boundary explanation.
- Status semantics did not change in this slice; inactive stayed
  inactive.
- No panel visibility, engine, shared schema, API payload, route
  selection, formula math, source matching, or output-support production
  changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts`
  passed with `17 tests`;
  `pnpm --filter @dynecho/web typecheck` passed;
  scoped `git diff --check` passed for the touched files.
- Next safe slice:
  improve the Field/Building-output-in-Lab-mode inactive tooltip so it
  names the mode boundary rather than only saying the field is not used.

2026-06-22 - Slice 4 field/building output blocked by Lab mode wording:

- Edited:
  `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
  and the same existing route-input helper region in
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.
- Added a title-token expectation first for `R'w` requested while
  Airborne mode is still Lab: inactive RT60 should mention both
  `Field or Building` and `Lab mode`.
- Replaced the generic `Not used until Field or Building mode is
  selected` tooltip with a mode-boundary explanation:
  selected field/building outputs need Field or Building mode, and the
  input is inactive while Airborne mode is Lab.
- Status semantics did not change; the field remains `Inactive` unless
  a route task marks a mapped field `Needed`.
- No panel visibility, engine, shared schema, API payload, route
  selection, formula math, source matching, or output-support production
  changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts`
  passed with `17 tests`;
  `pnpm --filter @dynecho/web typecheck` passed;
  scoped `git diff --check` passed for the touched files.
- Next safe slice:
  move to layer-row title assertions or material-editor title assertions,
  whichever target file is not being actively edited by another agent.

2026-06-22 - Slice 5 material-editor route tooltip wording:

- Edited:
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.ts`
  and
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.test.ts`.
- These material-route files were not already dirty, so this slice
  avoided the active dirty `calculator-workbench.tsx` regions owned by
  other agents.
- Added title-token expectations before changing implementation for:
  porous absorber flow resistivity, resilient dynamic stiffness, exact
  source material inactivity, and material-not-in-active-stack
  inactivity.
- Improved material tooltip titles so they name:
  the physical input (`flow resistivity`, `dynamic stiffness`), the
  route family (`porous absorber`, `floor impact`, `formula route`),
  exact-source ownership of the current output, and the active layer
  stack boundary.
- Status semantics did not change; this slice only changed explanatory
  `title` text returned by the material route-input helper.
- No material editor layout, panel visibility, engine, shared schema,
  API payload, route selection, formula math, source matching, or
  output-support production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  passed with `27 tests`;
  `pnpm --filter @dynecho/web typecheck` passed;
  scoped `git diff --check` passed for the touched files.
- Next safe slice:
  layer-row title assertions in `buildLayerInputEffectiveness`, after
  re-checking that the relevant helper region is not being edited by
  another agent.

2026-06-22 - Slice 6 material-editor needed tooltip wording:

- Edited only the isolated material route helper/test files:
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.ts`
  and
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.test.ts`.
- Stayed away from the actively dirty `calculator-workbench.tsx` regions
  to avoid other-agent overlap.
- Added title-token expectations before changing implementation for:
  missing porous absorber flow resistivity and missing resilient-layer
  dynamic stiffness.
- Improved `Needed` material tooltip titles so they name the missing
  physical input, the route family, and that the current output cannot
  calculate until the input is supplied.
- Status semantics did not change; missing route-owned material inputs
  still return `Needed`.
- No material editor layout, panel visibility, engine, shared schema,
  API payload, route selection, formula math, source matching, or
  output-support production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  passed with `28 tests`;
  `pnpm --filter @dynecho/web typecheck` passed;
  scoped `git diff --check` passed for the touched files.
- Next safe slice:
  pause code changes and reassess active dirty files before touching
  `calculator-workbench.tsx`; if it is still busy, continue only with
  isolated helper/test files or documentation.

2026-06-22 - Slice 7 material-editor mechanical-field used tooltip
wording:

- Edited only the isolated material route helper/test files:
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.ts`
  and
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.test.ts`.
- Re-checked the shared worktree first. `calculator-workbench.tsx`,
  engine runtime files, API files, active runtime handoff docs, and
  `AGENTS.md` were already dirty from other agents, so this slice stayed
  out of those surfaces.
- Added title-token expectations before changing implementation for
  panel mechanical material fields used by a live airborne formula
  route: `youngModulusPa`, `poissonRatio`, and `lossFactor`.
- Improved `Used` material tooltip titles so they name the mechanical
  input and route reason:
  Young modulus is used for panel bending stiffness, Poisson ratio is a
  formula-route input, and loss factor is the panel loss-factor input.
- Status semantics did not change; mechanical fields still become
  `Used` only when the active live formula basis reports the matching
  route token.
- No material editor layout, panel visibility, engine, shared schema,
  API payload, route selection, formula math, source matching, output
  support, or runtime handoff production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  passed with `28 tests`;
  `pnpm --filter @dynecho/web typecheck` passed.
- Next safe slice:
  stop or reassess before any broader workbench edits. If continuing,
  stay in isolated helper/test files unless the dirty workbench regions
  have been coordinated.

2026-06-22 - Slice 8 material-editor mechanical-field needed tooltip
wording:

- Edited only the same isolated material route helper/test files:
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.ts`
  and
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.test.ts`.
- Added failing title-token expectations first for missing mechanical
  panel inputs: `youngModulusPa`, `poissonRatio`, and `lossFactor`.
- Confirmed the old behavior failed because all three fields used the
  generic `Required before this route can calculate` title.
- Added a mechanical `Needed` title helper that names the missing input
  and why it matters to the current output:
  Young modulus for the panel formula route, Poisson ratio for the
  formula route, and loss factor for the panel formula route.
- Status semantics did not change; the fields are still marked
  `Needed` only when the result's missing-physical-input list references
  the matching route token.
- No material editor layout, panel visibility, engine, shared schema,
  API payload, route selection, formula math, source matching, output
  support, or runtime handoff production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  first failed on the generic title, then passed with `11 tests` after
  the title helper landed;
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  passed with `28 tests`;
  `pnpm --filter @dynecho/web typecheck` passed;
  scoped `git diff --check` passed for the touched material helper/test
  and usability-tracking doc.
- Next safe slice:
  stop and reassess before any broader code changes. The remaining
  obvious route/layer tooltip work is in `calculator-workbench.tsx`,
  which is currently dirty with other-agent work, so it should not be
  touched without coordination.

2026-06-22 - Slice 9 material-editor absorber-class and porosity tooltip
wording:

- Edited only the isolated material route helper/test files:
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.ts`
  and
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.test.ts`.
- Kept avoiding `calculator-workbench.tsx`, engine runtime files, API
  files, active runtime handoff docs, and `AGENTS.md` because those
  surfaces are dirty with other-agent work or outside this UI helper
  slice.
- Added failing title-token expectations first for:
  `absorberClass` needed by a porous absorber with unknown class,
  `absorberClass` used by a porous absorber airborne formula route,
  `porosity` needed by a porous absorber route, and `porosity` used by a
  live formula route.
- Confirmed the old behavior failed on generic absorber-class titles
  before patching production copy.
- Improved tooltip titles so absorber class and porosity name the
  physical input, route family, and current-output dependency instead
  of only saying the route can or cannot calculate.
- Status semantics did not change; the fields are still marked
  `Needed` or `Used` only when the existing missing-input or route-basis
  token checks already prove that status.
- No material editor layout, panel visibility, engine, shared schema,
  API payload, route selection, formula math, source matching, output
  support, or runtime handoff production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  first failed on generic absorber-class copy, then passed with
  `11 tests` after the title copy landed;
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  passed with `28 tests`;
  `pnpm --filter @dynecho/web typecheck` passed;
  scoped `git diff --check` passed for the touched material helper/test
  and usability-tracking doc.
- Next safe slice:
  stop and reassess again before broader work. Remaining route/layer
  tooltip work still lives in `calculator-workbench.tsx`, so avoid it
  unless that file's active dirty regions are coordinated.

2026-06-22 - Slice 10 material-editor exact-source inactive tooltip
wording:

- Edited only the isolated material route helper/test files:
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.ts`
  and
  `apps/web/features/workbench-rebuild/material-route-input-effectiveness.test.ts`.
- Added failing title-token expectations first for exact-source
  inactivity on `flowResistivityPaSM2` and `dynamicStiffnessMNm3`.
- Confirmed the old exact-source copy did not explain that the exact
  source owns the current output or that the material field is bypassed
  by a formula route.
- Improved exact airborne and exact impact tooltip titles so they name
  the source ownership boundary and the physical input that is inactive.
- Status semantics did not change; exact-source material fields still
  remain `Inactive` through the same existing exact-source checks.
- No material editor layout, panel visibility, engine, shared schema,
  API payload, route selection, formula math, source matching, output
  support, or runtime handoff production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  first failed on the generic exact-airborne copy, then passed with
  `12 tests` after the title copy landed;
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  passed with `29 tests`;
  `pnpm --filter @dynecho/web typecheck` passed;
  scoped `git diff --check` passed for the touched material helper/test
  and usability-tracking doc.
- Next safe slice:
  pause code changes. The remaining high-value tooltip/status work is
  outside the isolated material helper and would require touching the
  currently busy `calculator-workbench.tsx` layer/route helper regions.

2026-06-22 - Slice 11 layer-row tooltip wording with coordination
comment:

- Edited:
  `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
  and the `buildLayerInputEffectiveness` helper region in
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.
- Because `calculator-workbench.tsx` is a shared dirty file, added a
  short `AGENT COORDINATION 2026-06-22` comment directly above
  `buildLayerInputEffectiveness` stating that this slice is only working
  on layer input effectiveness tooltip copy.
- Added failing title-token expectations first for:
  exact-source layer material/thickness matching, exact impact role
  matching, formula-route layer material/thickness titles, wall role
  inactivity, and missing layer thickness.
- Confirmed the old copy failed on exact-source layer matching because
  it did not name the current output, and on missing thickness because
  it did not name layer thickness.
- Improved layer tooltip titles so missing thickness says layer
  thickness is needed for the current output to calculate the layer
  stack, and exact-source layer matching says the exact construction is
  used for the current output.
- Status semantics did not change; `Needed`, `Used`, and `Inactive`
  decisions still follow the existing live-route, exact-source, and
  missing-thickness checks.
- No material editor layout, workbench layout, engine, shared schema,
  API payload, route selection, formula math, source matching, output
  support, or runtime handoff production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts`
  first failed on the generic layer titles, then passed with
  `18 tests` after the title copy landed;
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  passed with `30 tests`;
  `pnpm --filter @dynecho/web typecheck` passed;
  scoped `git diff --check` passed for the touched workbench helper,
  route/material helper tests, material helper, and usability-tracking
  doc.
- Next safe slice:
  reassess before touching any other `calculator-workbench.tsx` region.
  If the same helper region is still needed, update the coordination
  comment before editing.

2026-06-22 - Slice 12 route-context wall-topology and impact tooltip
wording:

- Edited:
  `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
  and the `buildRouteInputEffectiveness` helper region in
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.
- Because `calculator-workbench.tsx` is a shared dirty file, added a
  short `AGENT COORDINATION 2026-06-22` comment directly above
  `buildRouteInputEffectiveness` stating that this slice is only working
  on route input effectiveness tooltip copy and must not change status
  semantics without tests.
- Added failing title-token expectations first for live wall topology,
  exact-source wall topology inactivity, live floor impact inputs,
  exact impact source inactivity, live impact-field context, and
  impact-field inputs inactive for a selected output that does not need
  impact field context.
- Confirmed the old copy failed on generic `Used by the current wall
  route` and `Used by the current floor impact route` titles.
- Improved route-context tooltip titles so wall topology names the
  topology/formula/current-output boundary, exact wall source names the
  current-output/manual-topology boundary, floor impact inputs name load
  basis or dynamic stiffness as formula-route inputs, exact impact
  source names the formula-route bypass, and impact-field context names
  the selected-output boundary.
- Status semantics did not change; `Needed`, `Used`, and `Inactive`
  decisions still follow the existing live-route, exact-source,
  selected-output, and context-input-sent checks.
- No material editor layout, workbench layout, engine, shared schema,
  API payload, route selection, formula math, source matching, output
  support, or runtime handoff production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts`
  first failed on the generic wall/impact titles, then passed with
  `20 tests` after the title copy landed;
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  passed with `32 tests`;
  scoped `git diff --check` passed for the touched workbench helper,
  route/material helper tests, material helper, and usability-tracking
  doc;
  global `git diff --check` passed.
- Validation blocker:
  `pnpm --filter @dynecho/web typecheck` is currently blocked by
  unrelated active worktree state:
  untracked
  `apps/web/features/workbench-rebuild/workbench-v2-assistant-source-alternative-candidate.test.ts`
  imports missing
  `./workbench-v2-assistant-source-alternative-candidate` and has
  implicit-`any` parameters. This slice did not create or edit that
  file, so it is recorded as an unrelated other-agent blocker rather
  than fixed here.
- Next safe slice:
  route-context copy can continue only after re-checking the shared
  worktree. Remaining low-risk copy targets are needed/defaulted,
  building-prediction-outside-building, non-airborne-output-set, and
  auto-topology inactive titles.

2026-06-22 - Slice 13 route-context needed/defaulted and mode-boundary
tooltip wording:

- Edited:
  `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
  and the `buildRouteInputEffectiveness` helper/title-builder region in
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.
- Because `calculator-workbench.tsx` is still a shared dirty file,
  updated the existing `AGENT COORDINATION 2026-06-22` comment above
  `buildRouteInputEffectiveness` to state that this slice is limited to
  needed/defaulted/mode-boundary tooltip titles.
- Added failing title-token expectations first for:
  needed panel width, route-defaulted panel width, field-mode
  building-prediction inactivity, non-airborne output-set inactivity,
  auto wall-topology inactivity, and field airborne used titles.
- Confirmed the old behavior failed on generic `Required before this
  route can calculate` and field airborne used copy before patching
  production title helpers.
- Added small route-input title helpers that name the field, selected
  output/current output, route default replacement path, airborne
  mode-boundary, non-airborne selected-output boundary, and Auto
  topology boundary.
- Status semantics did not change; `Needed`, `Defaulted`, `Used`, and
  `Inactive` decisions still follow the existing task/default/live-route
  and selected-output checks.
- No material editor layout, workbench layout, engine, shared schema,
  API payload, route selection, formula math, source matching, output
  support, or runtime handoff production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts`
  first failed on the old generic route titles, then passed with
  `22 tests` after the title helpers landed;
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts`
  passed with `34 tests`;
  `pnpm --filter @dynecho/web typecheck` passed.
- Next safe slice:
  stop broadening route tooltip copy for now. The next lower-risk work
  is a visibility/parity audit that proves currently visible inactive
  panels and output rows are still truthful across lab, field/building,
  impact-only, unsupported, and exact-source scenarios before changing
  any UI visibility.

2026-06-22 - Slice 14 output-row stale-value and detail-copy polish:

- Edited:
  `apps/web/features/workbench-rebuild/material-editor-surface-parity.test.ts`,
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`,
  `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`,
  and
  `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts`.
- Because `calculator-workbench.tsx` is a shared dirty file, added a
  short `AGENT COORDINATION 2026-06-22` comment above the output-row
  detail helper stating that this slice is copy-only and must keep
  support/status gating unchanged. Added the same comment above the
  assistant preview output-row detail helper for parity.
- Added a failing parity test first for a result that still contains
  stale helper scalar values (`R'w` and `STC`) while the selected output
  is outside the supported bucket.
- Confirmed the old behavior already kept status/value safe
  (`unsupported` or `pending`, value `--`) but used generic details:
  `Unsupported for route` and `No value`.
- Polished main calculator and assistant preview output-row detail copy
  to:
  `Unsupported by the current route` and
  `No supported value for the selected output yet`.
- Status semantics did not change; live rows still require
  `supportedTargetOutputs` plus a finite display value, and unsupported
  or pending rows still withhold stale scalar values.
- No workbench layout, engine, shared schema, API payload, route
  selection, formula math, source matching, output support, or runtime
  handoff production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-editor-surface-parity.test.ts`
  first failed on the old generic details, then passed with `6 tests`;
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts`
  passed with `20 tests`;
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts features/workbench-rebuild/material-editor-surface-parity.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts`
  passed with `60 tests`;
  `pnpm --filter @dynecho/web typecheck` passed.
- Next safe slice:
  continue parity audit only if it stays in tests or small copy-level
  surfaces. The next candidate is assistant/report/saved replay parity
  for stale unsupported output rows, not any engine or schema change.

2026-06-22 - Slice 15 report-context and replay stale-value audit:

- Edited:
  `apps/web/features/workbench/report-assistant-current-calculator-review-packet.ts`,
  `apps/web/features/workbench/report-assistant-current-calculator-review-packet.test.ts`,
  `apps/web/features/workbench/report-assistant-plausibility.ts`, and
  `apps/web/features/workbench/report-assistant-plausibility.test.ts`.
- Tarama sonucu:
  main calculator, assistant preview, candidate apply proposal, candidate
  comparison, report preview result, and query answer surfaces already
  gate calculator-backed basis/value rows through `row.status ===
  "live"` or an equivalent live-row authority check.
- Found and fixed two adjacent report/replay risks:
  report-context current-calculator packets could carry a captured
  `engineDisplayValue` into `calculatorDisplayValue` even when the
  metric status was `unsupported` or `needs_input`; and serialized/old
  current-calculator packets with a stale `calculatorDisplayValue` could
  replay that value back into report-assistant context.
- Added failing tests first:
  unsupported report-context metrics with stale captured engine values
  must not expose `calculatorDisplayValue`; and blocked replay packets
  must not turn stale `calculatorDisplayValue` into context
  `engineDisplayValue`.
- Production fixes are limited to value gating:
  report-context packets now accept captured engine values only when the
  derived review status is `ready`, and packet-to-context replay uses
  `calculatorDisplayValue` only when the packet is both `ready` and
  `numericReviewAllowed`.
- Status semantics did not change; blocked packets remain
  `needs_input`/`unsupported` with their existing blockers, and ready
  packets still carry calculator values normally.
- No workbench layout, engine, shared schema, API payload, route
  selection, formula math, source matching, output support, or runtime
  handoff production changed.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-current-calculator-review-packet.test.ts`
  first failed on stale captured value authority, then passed with
  `6 tests`;
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-plausibility.test.ts`
  first failed on stale replay display value, then passed with
  `10 tests`;
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-current-calculator-review-packet.test.ts features/workbench/report-assistant-plausibility.test.ts features/workbench/report-assistant-plausibility-research.test.ts features/workbench/report-assistant-query-route.test.ts`
  passed with `52 tests`;
  the broader targeted polish regression set passed with `112 tests`;
  `pnpm --filter @dynecho/web typecheck` passed.
- Next safe slice:
  saved/project snapshot UI replay can be audited next, but only with
  tests first and without changing engine/runtime behavior.

2026-06-22 - Slice 16 saved/project snapshot and project-summary replay audit:

- Edited:
  `apps/web/features/workbench-rebuild/workbench-v2-project-snapshot.test.ts`,
  `apps/web/features/workbench-rebuild/project-workspace-panel.tsx`,
  `apps/web/features/workbench-rebuild/project-workspace-panel.test.ts`,
  `apps/web/features/workbench-rebuild/project-workspace-combinations.tsx`,
  `apps/web/features/workbench-rebuild/project-workspace-types.ts`,
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`,
  `apps/web/features/workbench-rebuild/report-editor.tsx`,
  `apps/web/features/workbench/report-assistant-project-workspace.ts`,
  `apps/web/features/workbench/report-assistant-project-workspace.test.ts`,
  `apps/web/features/workbench/report-assistant-project-tools.ts`, and
  `apps/web/features/workbench/report-assistant-project-tools.test.ts`.
- Tarama sonucu:
  `WorkbenchV2ProjectSnapshot` is input/context/material-state only.
  It does not own or replay raw calculator `outputRows`, `estimateResult`,
  or `sourceCalculationOutput`. Unknown output-cache fields are dropped
  by the parser and the workbench must recompute rows from the current
  estimate route.
- Found and fixed adjacent replay risk:
  saved server/project assembly summaries can contain an older
  `calculationSummary.primaryValueLabel`. That value was accepted by
  project workspace parsers, project panel labels, report editor project
  context, and assistant project-read summaries even when
  `calculationSummary.status` was `needs_input`, `unsupported`, or
  `error`.
- Production fixes are limited to summary display-value gating:
  `primaryValueLabel` is now carried/rendered/exposed only when the
  assembly calculation summary status is `ready`. Blocked summaries keep
  their status, `primaryOutput`, and `selectedOutputs`, but do not
  surface a stale numeric value.
- This intentionally does not change storage schema, project API write
  acceptance, engine/runtime behavior, formula math, route selection,
  source matching, output support, or the active calculator handoff.
- Added tests:
  saved project snapshots with injected stale `outputRows`,
  `estimateResult`, and `sourceCalculationOutput` must not replay `99 dB`;
  project workspace rendering must show blocked status instead of a
  stale blocked value; assistant project workspace snapshots must drop
  stale blocked `calculationPrimaryValueLabel`; and project-read
  summaries must strip blocked `primaryValueLabel` before assistant
  context sees it.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-project-snapshot.test.ts features/workbench-rebuild/project-workspace-panel.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-project-tools.test.ts`
  passed with `15 tests`;
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-current-calculator-review-packet.test.ts features/workbench/report-assistant-plausibility.test.ts features/workbench/report-assistant-plausibility-research.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench-rebuild/workbench-v2-project-snapshot.test.ts features/workbench-rebuild/project-workspace-panel.test.ts`
  passed with `85 tests`;
  scoped `git diff --check` for the touched files passed; global
  `git diff --check` passed.
- Typecheck note:
  `pnpm --filter @dynecho/web typecheck` is currently blocked by
  unrelated worktree errors in
  `features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts`
  (`./workbench-v2-assistant-bounded-edit-plan` missing plus implicit
  `any` parameters). This Slice 16 patch did not touch that file.
- Next safe slice:
  continue with report/proposal normalization or candidate comparison
  parity only if tests prove a stale value can cross a non-ready
  boundary. Otherwise stop this support loop and return to a selected
  calculator runtime slice when requested.

2026-06-22 - Slice 17 report/proposal normalization and candidate
comparison scan:

- Edited:
  `apps/web/features/workbench/simple-workbench-proposal.ts`,
  `apps/web/features/workbench/report-assistant-context.ts`,
  `apps/web/features/workbench/report-assistant-context.test.ts`,
  `apps/web/features/workbench/report-assistant-instruction.ts`, and
  `apps/web/features/workbench/report-assistant-instruction.test.ts`.
- Tarama sonucu:
  candidate comparison/ranking is already gated by live calculator rows.
  `buildCalculatorAssistantCandidateComparisonRanking` only ranks a
  candidate when the selected metric has a `live` output row with a
  parseable value; if any candidate lacks that live value the ranking is
  withheld. Candidate apply proposal summaries also filter preview rows
  through `row.status === "live"`.
- Found and fixed report/proposal normalization risk:
  `coverageItems` with `status: "needs_input"` or `status:
  "unsupported"` could still carry stale `engineDisplayValue`,
  `numericDb`, or trace `valuePinDb` into assistant context. Serialized
  older assistant context payloads could replay the same blocked numeric
  evidence through `parseReportAssistantContextPayload`.
- Production fixes are limited to calculator-backed evidence gating:
  report display text and blocked statuses are preserved, but
  `engineDisplayValue`, `numericDb`, `valuePinDb`, and `value pin`
  used-input text are carried only for `live` or `bound` metrics.
- This intentionally does not change report storage shape, report UI
  editing, engine/runtime behavior, formula math, route selection,
  source matching, output support, or the active calculator handoff.
- Added failing tests first:
  a blocked coverage row with stale `99 dB` must remain a blocked report
  display value while losing calculator-backed `engineDisplayValue`,
  `numericDb`, `valuePinDb`, and `value pin` evidence; and an older
  serialized context payload with the same stale blocked fields must be
  sanitized during parse.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-context.test.ts`
  first failed on stale blocked `engineDisplayValue`, then passed with
  `8 tests`;
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-instruction.test.ts`
  first failed on stale serialized blocked `engineDisplayValue`, then
  passed with `6 tests`;
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-plausibility.test.ts features/workbench/report-assistant-current-calculator-review-packet.test.ts features/workbench/report-assistant-finding.test.ts features/workbench/simple-workbench-proposal.test.ts --testTimeout=15000`
  passed with `45 tests`;
  `pnpm --filter @dynecho/web typecheck` passed;
  scoped `git diff --check` for the touched files passed; global
  `git diff --check` passed.
- Validation note:
  the same broad set without `--testTimeout=15000` hit the existing
  `report-assistant-finding.test.ts` API-route confirmation test at the
  default 5000 ms timeout. The test passed with a 15 second timeout and
  no behavior assertion changed.
- Next safe slice:
  candidate comparison appears already safely live-gated from static
  inspection. If continuing this support track, prefer a small rendered
  visibility/status audit or stop and return to the active calculator
  coverage-refresh slice when requested.

2026-06-22 - Slice 18 route-input visibility/status audit:

- Edited:
  `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`.
- Tarama sonucu:
  the route input section intentionally keeps some context families
  visible even when the current output does not consume those inputs.
  That is acceptable only if visible fields carry truthful
  `Inactive`/`Needed` badges with route-specific hover titles.
- Added visibility/status regression coverage:
  when Building mode is selected for lab-only `Rw`, the Building panel
  remains visible but every airborne/building context input in that
  visible surface is `inactive` with lab-airborne/field-building wording;
  when a field/building output is selected while still in Lab mode,
  the actual blockers (`Airborne mode`, panel width, receiving room
  volume) are `needed`, while non-blocking visible context fields such
  as `RT60` and building-only inputs remain `inactive`.
- No production code changed in this slice. The first test run exposed
  two stale test literals for rendered ids
  (`rebuild-flanking-junction` and `rebuild-conservative-flanking`);
  those were corrected to the actual UI ids
  `rebuild-flanking-junction-class` and
  `rebuild-conservative-flanking-assumption`.
- Validation:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts`
  passed with `24 tests`;
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts features/workbench-rebuild/material-editor-surface-parity.test.ts`
  passed with `42 tests`;
  `pnpm --filter @dynecho/web typecheck` passed.
- Next safe slice:
  the visibility/status behavior is now locked at helper level. Further
  work should only add browser/rendered screenshots if the user wants
  visual QA, or return to the active calculator coverage-refresh slice.

### Remaining Work Re-Analysis And Hardened Plan - 2026-06-22

Current implementation comparison:

- `AGENTS.md` now shows the active calculator runtime path has moved to
  `wall.double_leaf_framed.frequency_backbone_numeric_sensitivity_owner`.
  This UI usability track must not touch that engine/runtime owner.
- The shared worktree remains busy. `calculator-workbench.tsx`,
  assistant/preset files, API files, engine runtime files, active
  calculator docs, and `AGENTS.md` all have other-agent work.
- Our current safe surface is the route/layer/material effectiveness
  helper test corridor. It has targeted coverage at:
  `route-input-effectiveness.test.ts` and
  `material-route-input-effectiveness.test.ts`.
- Material editor, layer-row, and route-context tooltip copy are now at
  the intended bar for the generic strings identified in this bug-hunt.
  A fresh `rg` after Slice 13 found no remaining instances of the prior
  generic route strings in `calculator-workbench.tsx` or
  `route-input-effectiveness.test.ts`.

Remaining low-risk candidate class:

- visibility/status parity for currently visible inactive context
  panels;
- stale scalar/output-row display parity beyond the main calculator,
  assistant preview, report-context review, and current-calculator packet
  replay, especially report/proposal normalization and candidate
  comparison/ranking;
- future generic tooltip strings introduced by parallel agent work.

Next audit targets and test strategy:

1. Saved/project snapshot UI replay:
   completed in Slice 16. Project snapshots are input-only; stale raw
   output caches are dropped; adjacent project-summary display values
   are now status-gated to `ready`.
2. Report/proposal normalization:
   completed in Slice 17. Blocked coverage rows and older serialized
   context payloads now preserve report display text but cannot carry
   calculator-backed `engineDisplayValue`, `numericDb`, `valuePinDb`, or
   `value pin` evidence.
3. Candidate comparison/ranking:
   static scan completed in Slice 17. Ranking and apply-proposal preview
   summaries are already live-row gated. Add a focused regression test
   only if future edits change those helpers.
4. Query/route answer text:
   analyze assistant text summaries because they stringify output rows
   for users. Test that unsupported/pending rows are displayed with
   blocker text and `--`, and are not exported as `basis` evidence.
5. Visibility panels:
   analyze after stale-value parity is locked. Test rendered state only
   if pure helper tests show a panel is both visible and misleading; do
   not hide panels simply because a field is inactive.

Hardened implementation order:

1. Route-context copy:
   completed through Slice 13 for the currently known generic strings.
   Do not keep editing copy unless a new generic or inaccurate tooltip
   appears in a targeted test.
2. Visibility audit, tests first:
   verify visible-but-inactive context panels are intentional for lab
   airborne, field/building, impact-only, and unsupported routes. Do not
   hide panels until tooltip/status truthfulness is locked.
3. Output-row support-gating parity:
   compare main calculator, assistant preview, and older shell output
   row builders for stale scalar display. Start with parity tests; do
   not centralize duplicate builders unless tests prove drift and the
   refactor is smaller than keeping them aligned.
4. Saved/report/server replay audit:
   only after row-builder parity is proven, check saved replay/report
   surfaces for unsupported stale values.
5. Shared abstraction consideration:
   only after route/layer/material semantics are stable, decide whether
   to extract shared title builders. Do not add abstraction just to
   reduce strings while other-agent work is active.

Coordination rules for the remaining work:

- Before touching any shared dirty file, re-run `git status --short`
  and inspect the exact target hunk.
- If editing a shared helper region, place or update a short
  `AGENT COORDINATION 2026-06-22` comment at that helper boundary that
  says the exact slice scope.
- Do not remove another agent's coordination comments.
- If a coordination comment outlives the slice and becomes misleading,
  update it to the current region owner/scope instead of deleting it
  silently.
- Stop if a required fix crosses into `packages/engine/**`,
  `packages/shared/**`, API payload/schema, active runtime handoff docs,
  or `tools/dev/run-calculator-current-gate.ts`.

Validation ladder:

1. Run the single touched helper test first.
2. Run
   `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-route-input-effectiveness.test.ts`.
3. Run `pnpm --filter @dynecho/web typecheck` for any TS production
   change.
4. Run scoped `git diff --check` for touched files.
5. Run global `git diff --check` before final handoff if the worktree is
   still highly dirty.
6. Do not run `pnpm calculator:gate:current` for copy/helper-only UI
   slices. Run it only if runtime behavior, payload shape, shared schema,
   or broad workbench behavior moves.

Next safest executable slice:

- Add pure helper tests or a minimal rendering test that verifies
  visible inactive context panels are intentional and truthful for
  lab-only airborne, live field/building, impact-only, unsupported
  field/building, and exact-source scenarios.
- Do not hide or rearrange panels in the first pass; prove current
  visibility/status parity first.
- If a real visibility bug is proven, patch the smallest owning
  workbench surface and keep route/engine behavior unchanged.
- Keep or update the coordination comment before touching any shared
  `calculator-workbench.tsx` region again.

### Safety Iterations Applied To This Plan

This pass tightens the plan so it can only improve the workbench
experience and cannot accidentally move engine behavior.

Iteration 1 - blast-radius reduction:

- first pass is web/helper/test only;
- do not edit `packages/engine/**`, `packages/shared/**`,
  `apps/web/app/api/estimate/route.ts`, active runtime handoff docs,
  `tools/dev/run-calculator-current-gate.ts`, or `AGENTS.md`;
- do not change request payload shape, shared schemas, route selection,
  formula math, source matching, or `supportedTargetOutputs`
  production;
- do not centralize duplicate output-row builders until parity tests
  prove a real drift; duplicate code can stay duplicated if it is
  behaviorally locked.

Iteration 2 - truthfulness over optimism:

- `Used` requires live proof: selected output is supported, the display
  value is finite, and the active basis is not an exact source that
  bypasses that physical field;
- `Needed` stays strongest when an engine/task maps directly to an
  input;
- `Default` requires an explicit route default signal such as
  `airborneBasis.propertyDefaults`; UI mode alone is not enough;
- unsupported, stale-helper-only, exact-source, or lab-only answers
  should prefer `Inactive` or no badge over an optimistic `Used`;
- if the web cannot prove dependency, the tooltip should say the current
  route does not report using the field rather than claiming usage.

Iteration 3 - test-first sequencing:

- each behavior change starts with a targeted failing test or a baseline
  assertion that captures the current bug class;
- assert status plus stable reason tokens instead of brittle full
  sentence snapshots unless exact copy is the behavior being tested;
- use pure helper tests before browser-level tests;
- run only the touched targeted tests first, then typecheck when code
  changes are broader.

Iteration 4 - surface consistency:

- the main calculator, assistant preview, and older workbench shell must
  agree that live output rows require `supportedTargetOutputs`;
- panel visibility should not change until tooltip/status truthfulness
  is locked;
- material editor, layer rows, and route context badges should share the
  same status semantics even if their implementation helpers remain
  separate.

Iteration 5 - stop conditions:

- stop and document the ambiguity if a fix requires engine/shared-schema
  changes; do not smuggle engine changes into this UI polish track;
- stop before editing a file already modified by another agent in the
  same region;
- stop if a test failure points to unrelated active runtime work;
- prefer a smaller incomplete but verified slice over a broad change
  that makes route ownership less clear.

### 0. Shared-Worktree Guard

Implementation comparison:

The repo is expected to have parallel agent work. The current usability
track only needs the workbench UI/effectiveness files and tests listed
below.

Action:

1. Before each implementation slice, run `git status --short`.
2. If a target file is already modified, inspect only that file's diff
   and stack changes in a non-overlapping region.
3. Do not touch active runtime handoff files, source import files, or
   unrelated docs.
4. If a file becomes dirty after the slice starts, re-read the touched
   hunk before applying another patch.

Done when:

- the slice edits only its named workbench/test/doc files;
- unrelated dirty files remain untouched.

### 1. Freeze The Current Badge Baseline

Implementation comparison:

`buildRouteInputEffectiveness` in
`apps/web/features/workbench-rebuild/calculator-workbench.tsx` already
returns `needed`, `used`, `defaulted`, and `inactive`. Existing tests in
`route-input-effectiveness.test.ts` cover important statuses, but mostly
assert the status, not the user-facing explanation.

Action:

1. Add a compact baseline test matrix in
   `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`.
2. Assert `status` and stable `title` reason tokens for these starter
   scenarios:
   lab-only `Rw` while Building mode is selected, live `R'w`, live
   `DnT,w`, missing field/building input, exact source row, unsupported
   field output with stale helper values, floor impact formula, exact
   impact source.
3. Keep fixtures local to the test file unless reuse becomes obvious.

Done when:

- tests prove what the UI says today before changing copy/logic;
- every later tooltip change has an assertion that can fail.

### 2. Replace Generic Tooltip Titles With Reason Builders

Implementation comparison:

Status after Slice 13:

The initially observed generic route-context strings have been replaced
in `buildRouteInputEffectiveness` with small reason builders for
needed/defaulted, live route, exact-source, mode-boundary,
selected-output, wall-topology, and impact-context cases. Keep this item
as a guardrail for any new generic copy introduced later.

Action:

1. Add small helper functions near `buildRouteInputEffectiveness` for
   route-input reason text.
2. Generate titles from:
   selected output group, context mode, live support status, exact-source
   versus formula route, field family, and missing/defaulted field.
3. Keep the return type unchanged:
   `{ status: RouteInputEffectivenessStatus; title: string }`.
4. Do not introduce a new UI component yet; the existing
   `RouteInputEffectivenessBadge` can continue using `title`.

Done when:

- `Inactive` says why the field cannot affect the selected output;
- `Used` names the current route family or basis when known;
- `Needed` names the output or route the field unblocks;
- `Default` names the fallback/default and whether user input can
  replace it.
- no route explanation requires engine fields that are not already
  present in the result.

Primary files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`

### 3. Fix Early Broad `Used` / `Defaulted` Context Marking

Implementation comparison:

`buildRouteInputEffectiveness` has an early branch for selected airborne
context outputs when the UI mode is Field or Building. That branch can
mark panel, room, and building inputs `used` or `defaulted` from UI mode
and selected outputs before the live result proves that the requested
field/building output is supported. `setRouteInputEffectiveness` is
first-wins, so later live-route checks cannot refine that status.

Action:

1. Keep `needed` from `routeInputTaskElementIds` strongest.
2. For field/building context inputs, only mark `used` when
   `routeHasLiveAirborneContextOutput` proves a selected context output
   is supported and finite.
3. If a selected context output is waiting on route inputs, mark mapped
   fields `needed`; do not downgrade them to `defaulted`.
4. If the result is unsupported, exact lab-only, or stale helper-only,
   mark the visible fields `inactive` with basis-boundary text.
5. Use `defaulted` only when the result exposes a route default through
   `airborneBasis.propertyDefaults` or an equivalent explicit route
   signal.
6. Do not change panel visibility in this item; change only status and
   explanation.

Done when:

- unsupported `R'w` or `DnT,w` cannot make room/building fields look
  used just because Building mode is selected;
- exact source/lab-only answers keep formula context inputs inactive;
- mixed `Rw + DnT,w` keeps missing field/building inputs needed when the
  field/building output is blocked.

Primary tests:

- extend `route-input-effectiveness.test.ts` with unsupported and
  needs-input stale-helper cases.

### 4. Keep Output Rows Support-Gated Across All Surfaces

Implementation comparison:

The rebuilt workbench `buildOutputRows` already gates a live row by
`supportedTargetOutputs` plus a finite display value. The calculator
assistant has a similar local implementation. The older
`apps/web/features/workbench-v2/workbench-v2-shell.tsx` also has output
row logic and should remain aligned.

Action:

1. Compare these three output-row builders:
   `calculator-workbench.tsx`, `workbench-v2-calculator-assistant.ts`,
   and `workbench-v2-shell.tsx`.
2. Add or extend tests where a metric scalar exists but the target output
   is unsupported.
3. Prefer parity tests over centralization in the first pass. Only
   centralize after tests prove duplicate implementations are drifting
   and the refactor is smaller than keeping them aligned.
4. Include saved/server/report surfaces only when the bug touches those
   surfaces; otherwise keep this slice focused on row builders.
5. Do not touch engine support calculation; this item only verifies
   display gating.

Done when:

- no UI row displays a stale `metrics.estimated*` value unless the
  current result supports that target output;
- assistant preview and main calculator cards agree for unsupported and
  needs-input rows.

Primary files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`
- `apps/web/features/workbench-v2/workbench-v2-shell.tsx`
- related output-row/parity tests.

### 5. Add Panel Visibility Assertions Before Changing Visibility

Implementation comparison:

`showAirborneContext`, `showBuildingPredictionContext`,
`showImpactContext`, `showFloorImpactContext`, and
`showWallTopologyContext` intentionally show some sections because of
selected mode or missing inputs, not because every visible field is used.
This is acceptable only when badges explain the basis boundary.

Action:

1. Add targeted visibility tests for:
   `Rw` only + Building mode, `STC/C/Ctr` only + Building mode,
   `Rw + DnT,w` + Building mode, floor impact-only after a wall/building
   mode state, and missing topology inputs.
2. Avoid hiding panels in the first pass unless a panel is provably
   misleading with no useful context role.
3. Pair each visible-but-inactive panel with tooltip assertions from
   items 2 and 3.

Done when:

- panel visibility is intentional and test-covered;
- visible inactive fields have basis-boundary explanations.

### 6. Bring Layer Row Explanations To The Same Bar

Implementation comparison:

`buildLayerInputEffectiveness` already distinguishes formula routes,
exact source matching, wall roles, floor impact roles, and missing layer
thickness. Its titles are clearer than route context titles, but still
generic around exact-source versus formula ownership.

Action:

1. Add title assertions for layer `material`, `thickness`, and `role`.
2. Make copy explicit:
   formula routes calculate from material/thickness, exact routes match
   construction identity, wall layer role is ignored when explicit wall
   topology owns grouping, floor role is used by impact formula/exact
   impact matching.
3. Keep wall role inactive unless implementation later starts sending it
   to the calculator.

Done when:

- changing layer material/thickness/role has a truthful explanation for
  the active route and selected outputs.

Primary files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`

### 7. Bring Material Editor Explanations To The Same Bar

Implementation comparison:

`material-route-input-effectiveness.ts` already marks catalog metadata
inactive, selected-outside-stack inactive, exact source inactive, flow
resistivity needed/used/inactive, dynamic stiffness used only when the
live result echoes the material value, and mechanical fields used only
when the route basis references them. The status logic is useful; the
titles still need route-specific explanatory copy.

Action:

1. Add title assertions in
   `material-route-input-effectiveness.test.ts`.
2. Improve titles for:
   metadata-only fields, selected material outside stack, exact source,
   porous absorber flow resistivity, resilient dynamic stiffness, and
   mechanical fields.
3. Ensure material editor UI surfaces the same title text wherever it
   renders material badges.

Done when:

- the user can tell whether changing density, flow resistivity, dynamic
  stiffness, modulus, loss factor, tags, or notes can affect the current
  result.

Primary files:

- `apps/web/features/workbench-rebuild/material-route-input-effectiveness.ts`
- `apps/web/features/workbench-rebuild/material-route-input-effectiveness.test.ts`
- `apps/web/features/workbench-rebuild/material-editor-panel.tsx`
- `apps/web/features/workbench-rebuild/material-editor-panel.test.ts`

### 8. Add A Route/Input Snapshot Fixture Pack

Implementation comparison:

Current tests cover representative cases, but there is no compact matrix
that records visible panels, status, title, output row state, and stale
metric behavior together.

Action:

1. Build small test fixtures for:
   lab-only wall formula, field wall formula, building wall formula,
   exact wall source, double-leaf/framed formula, floor impact formula,
   exact impact source, unsupported alias request, and selected-output
   switch after a prior result.
2. Keep fixture assertions close to the workbench helpers first.
3. Add broader surface replay tests only for bugs that actually cross
   live/saved/server/report boundaries.

Done when:

- the known user-facing route/input combinations are regression-covered
  without needing manual clicking.

### 9. Decide Whether The Web Inference Is Enough

Implementation comparison:

The web currently infers field usage from selected outputs, UI mode,
`supportedTargetOutputs`, `requiredInputs`, `propertyDefaults`, missing
input tasks, method strings, basis text, and live scalar values. This is
reasonable for the first pass, but it is not an owned per-field
dependency contract.

Action:

1. After items 1-8, list any remaining ambiguous fields where the web
   cannot truthfully decide `used/defaulted/inactive`.
2. If ambiguity remains, write a separate engine-contract design note
   before changing shared types.
3. Candidate contract shape:
   `usedInputFields`, `defaultedInputFields`, `inactiveInputFields`,
   and `inputDependencyReasons`.
4. Only emit such fields from engine routes that can prove them.
5. Treat this as a future design checkpoint, not an implementation step
   in the current UI polish pass, unless the user explicitly approves
   engine/shared-schema work.

Done when:

- either the web-only inference is sufficient for known scenarios, or a
  separate engine-contract slice is selected with clear scope.

### 10. Validation Order For This Track

Run targeted checks before any broad gate:

1. `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts`
2. `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-route-input-effectiveness.test.ts`
3. `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-editor-panel.test.ts features/workbench-rebuild/material-editor-surface-parity.test.ts`
4. Add assistant/output-row tests when item 4 is touched.
5. `pnpm --filter @dynecho/web typecheck`
6. `git diff --check`
7. Run `pnpm calculator:gate:current` only when the slice changes broad
   calculator/workbench behavior or any shared runtime contract.

Done when:

- each fixed inconsistency has a targeted regression test;
- no broad runtime calculator behavior moves accidentally.
- engine/shared-schema files remain untouched for this track unless a
  separate explicitly approved slice opens them.

## Core Product Principle

The user should never have to guess whether a visible input matters.

For each visible calculator input, the UI should either:

- show no claim when usage cannot be proven; or
- show a conservative status with an explanation:
  - `Needed`: the selected route cannot calculate the requested output
    until this input is supplied;
  - `Used`: the selected route consumes this input and changing it can
    change at least one currently requested output;
  - `Default`: the selected route is using an owned fallback/default
    because the user has not supplied this value;
  - `Inactive`: this input is visible but does not affect the currently
    requested output under the active route and basis.

Tooltips should explain the route reason, not just repeat the badge.

Good tooltip shape:

`Inactive: the current output is lab Rw from the selected mass-law route;
room volume is only used by field/building outputs such as R'w, Dn,w, or
DnT,w.`

Bad tooltip shape:

`Inactive.`

## Suspected Root Causes To Audit

### 1. UI Visibility And Route Usage Are Not The Same Thing

Some panels are shown because a broad mode is selected, but a specific
requested output may not consume those inputs.

Examples:

- Building mode selected while only lab `Rw` is requested.
- Room fields visible while no field/building metric is selected.
- Impact-only output selected while stale airborne building mode remains
  in UI state.
- Wall topology fields visible while an exact source row owns the answer.

Risk:

The user changes a visible value and sees no result change, which makes
the calculator feel broken even when the route is correct.

### 2. Output Context And Metric Basis Can Drift Apart

The selected screen mode, requested outputs, and engine result basis may
not always line up.

Examples:

- `contextMode = building_prediction` with only lab outputs requested.
- `R'w` requested while context is still `element_lab`.
- `DnT,w` requested without room/normalization inputs.
- ASTM/impact outputs requested on a wall airborne route.

Risk:

The UI may mark a field as active because a mode says Building, while
the actual supported output is still lab-only or unsupported.

### 3. Result Cards May Read Stale Metric Fields

Previous work already found a related issue: output cards can be tempted
to read `metrics.estimated*` fields even when the engine did not list
that output in `supportedTargetOutputs`.

Risk:

Cards, reports, saved replay, or server replay can display values that
the current request did not actually support.

Rule:

Displayed values must be gated by `supportedTargetOutputs`,
`unsupportedTargetOutputs`, `needs_input`, and result basis, not by the
mere presence of a stale scalar field.

### 4. Engine Basis Does Not Yet Expose Per-Field Usage Enough

The web currently infers usage from route basis fields such as
`requiredInputs`, `propertyDefaults`, selected outputs, missing-input
tasks, and known route methods.

Risk:

Inference can be incomplete or too broad. A field can be marked `Used`
because the route family generally uses it, while this exact target
output or exact-source route does not.

Possible fix direction:

Introduce or derive a more structured `usedInputs` / `inactiveInputs` /
`defaultedInputs` contract from the engine only when the route can prove
it. Until then, keep web badges conservative.

### 5. Exact Source Rows And Formula Routes Need Different Explanations

Exact source ownership uses layer identity, material, thickness, and
metric basis for matching. It may not consume formula tuning fields such
as room volume, flow resistivity, dynamic stiffness, or topology fields.

Formula routes may consume those physical inputs directly.

Risk:

The same field can legitimately be `Used` under one route and
`Inactive` under another. Tooltips must explain the active route rather
than using generic text.

### 6. Defaulted Inputs Can Be Misread As User Inputs

Some routes use owned engineering defaults or fallback assumptions when
an input is absent.

Risk:

The UI can make the user think they supplied a value or that the value is
not important. `Default` must clearly say the route is using a fallback
and that entering a route-owned value may change the result.

### 7. Saved Replay, Server Replay, Cards, Reports, And API Can Diverge

The workbench has multiple surfaces:

- live estimate;
- local saved replay;
- server project/snapshot replay;
- output cards;
- report/proposal previews;
- calculator API validation/results.

Risk:

One surface may show correct route usage while another shows stale or
incorrect values. Each fixed bug should include at least one test that
keeps the relevant surfaces aligned.

### 8. Material Editor And Layer Row Inputs Have Route-Specific Meaning

Layer `Material`, `Role`, and `Thickness` do not always mean the same
thing across wall and floor modes.

Examples:

- Wall layer role can be inactive because explicit wall topology owns
  leaf/cavity grouping.
- Floor layer role can be used by impact formula routes.
- A selected material in the material editor may not be in the active
  stack, so its fields should be inactive for the current result.
- Material metadata such as tags and notes should not imply acoustic
  influence.

Risk:

Users may tune material fields that do not affect the current result, or
miss the fields that would actually unblock the route.

## Initial Audit Matrix

Use this matrix to hunt inconsistencies before making broad changes.

### Wall Airborne

- `Rw` only with Lab context.
- `Rw` only with Building context selected.
- `Rw + R'w` with Lab context.
- `Rw + R'w` with Field context and missing panel/room inputs.
- `Rw + Dn,w` / `DnT,w` with Building context and missing flanking/room
  inputs.
- Exact source wall route where manual topology inputs should not be
  marked formula-used.
- Single-leaf mass-law route where room/building inputs should be
  inactive for lab output.
- Double-leaf/framed formula route where side leaf groups, cavity depth,
  support spacing, flow resistivity, absorber coverage, and absorber
  thickness may be active.
- Direct-fixed double-leaf route where independent-frame inputs must not
  be implied as active.
- Advanced-wall source-absent route with partial physical inputs.

### Floor / Impact

- `Ln,w` with missing load basis.
- `DeltaLw` with and without dynamic stiffness.
- `IIC` / `AIIC` when ASTM route is unsupported or exact-band-only.
- Floor impact-only output after a previous wall Building-mode state.
- Floating floor material dynamic stiffness selected on a material that
  is not in the active layer stack.

### Mixed / Persistence

- Change selected outputs after a result exists and confirm old metric
  cards disappear when unsupported.
- Save a project, reload it, and confirm badges and values still match
  the active route.
- Server snapshot replay should match live result status, basis, and
  displayed outputs.
- Report/proposal output rows should not display unsupported stale
  helper metrics.

## Bug-Hunt Workflow

For each inconsistency:

1. Record the exact visible scenario:
   selected mode, requested outputs, layer stack, relevant context
   fields, and current result status.
2. Identify the active route/basis from the engine result.
3. Decide whether the bug is:
   UI visibility, badge status, tooltip explanation, stale metric
   display, saved replay mismatch, server/API mismatch, or actual
   calculator behavior.
4. Add a targeted regression test first when practical.
5. Fix the smallest surface that owns the bug.
6. Validate with targeted tests and `git diff --check`.
7. Run `pnpm calculator:gate:current` only when the change touches broad
   calculator/workbench behavior enough to justify the full gate.

## Tooltip Requirements

Every tooltip should answer these questions when the status is shown:

- Which output or route is active?
- Is the field used, needed, defaulted, or inactive?
- Why does that status apply now?
- What would make the field matter, if applicable?

Tooltip examples to preserve as intent:

- `Used: the selected double-leaf/framed route uses cavity depth in the
  mass-air-mass resonance and cavity-depth credit for the requested Rw.`
- `Needed: R'w requires field context; enter panel area and receiving
  room volume before this output can be calculated.`
- `Default: the current route is using an engineering-default porous
  flow resistivity. Enter product-specific flow resistivity to replace
  the fallback.`
- `Inactive: the current request is lab Rw only; source/room volume is
  used by field/building outputs, not by this lab output.`
- `Inactive: this material is not in the active layer stack, so changing
  its acoustic fields will not change the current result.`

## Non-Goals For This Track

- Do not retune acoustic formulas as part of UI tooltip work.
- Do not import source rows.
- Do not promote unsupported metric aliases.
- Do not change the current selected calculator runtime handoff unless
  the user explicitly asks.
- Do not edit unrelated agent-owned files.
- Do not hide inputs just because they are currently inactive if the
  user needs them to understand or switch context; prefer truthful
  status and explanation.

## Acceptance Criteria

The track is successful when:

- visible calculator inputs have conservative and accurate route
  effectiveness explanations where proof exists;
- fields that do not affect the active output are not presented as
  silently influential;
- missing fields explain the route and output they unblock;
- defaulted fields explain the fallback and how user input changes it;
- cards, reports, saved replay, server replay, and API surfaces do not
  display unsupported stale values;
- targeted bug tests cover every fixed inconsistency;
- other agents' runtime calculator work remains untouched unless a
  discovered issue directly crosses that boundary and is coordinated.

## First Suggested Implementation Slice

Start with an audit of `buildRouteInputEffectiveness` and its tests:

- verify `Rw + Building` keeps building/room fields inactive with a
  reason tied to lab basis;
- verify `Rw + DnT,w + Building` marks the same fields needed/used
  depending on entered values;
- verify impact-only outputs do not keep stale airborne Building panels
  visible;
- verify exact source routes do not claim formula-only physical inputs
  as used;
- expand tooltip text so it names the active output family and reason,
  not only the status.

This is a UI/bug-hunt slice. It should be kept small and validated
against the existing workbench route-input tests before broadening.

## Expanded Validation Pass - 2026-06-22

The user explicitly called out that the previous test set was not enough, so
the validation pass was broadened from focused workbench-rebuild tests into
the current calculator gate, full workbench surface tests, build/type output,
and representative reruns around the failures found.

What the broader pass found:

- `features/workbench-rebuild` passed after the route-input visibility work:
  `23 files / 189 tests`.
- An early full `features/workbench` run failed broadly with
  `104 failed files`, `321 failed tests`, `1321 passed`, and `18 skipped`.
  The failure pattern was dominated by `surfaceMassKgM2` validation/cascading
  no-result states. The first failing web file passed in isolation, so this was
  treated as a valid warning signal, not a single deterministic web spec fix.
- The first full current-gate attempt also exposed a broad
  `surfaceMassKgM2` pattern in engine tests. Representative failing engine
  files passed in isolation, but the run still proved that the optional layer
  surface-mass schema change needed stronger type/build validation.
- A deterministic typecheck/build issue was found after
  `LayerInputSchema.surfaceMassKgM2` became optional:
  `dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts` and
  `calculate-assembly.ts` had code paths where TypeScript could still see
  `number | undefined` while resolved/runtime layers require finite `number`
  surface mass.
- A deterministic doc-contract drift was found in
  `post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`:
  the test still expected the old "no airborne measured source anchor list"
  wording, while the active plan now distinguishes the existing scalar measured
  `Rw` lane from the still-blocked user-verified calculated anchor lane.

Fixes made during this validation pass:

- Narrowed explicit `surfaceMassKgM2` locally before using it as a numeric
  layer mass in the double-leaf/framed bridge solver contract.
- Narrowed explicit `surfaceMassKgM2` locally in `resolveLayers` so the engine
  DTS build sees `ResolvedLayer.surfaceMassKgM2` as a guaranteed `number`.
- Updated the stale rerank contract wording to assert the current boundary:
  bare/invalid measured-anchor rows are still rejected, and project/user
  user-verified calculated anchor lists are still not accepted.

Latest validation results:

- `pnpm --filter @dynecho/engine exec vitest run ...` focused rerun around
  explicit surface mass, route-input widening, doc sync, CLT, and reinforced
  concrete closeout passed: `6 files / 31 tests`.
- `pnpm --filter @dynecho/engine build` passed, including DTS generation.
- `pnpm build` passed: `5 successful / 5 total`.
- The post-doc-sync full `pnpm calculator:gate:current` run passed shared
  `2 files / 21 tests`, engine `795 files / 4361 tests`, and web
  `127 files / 506 passed + 18 skipped`; it then failed only at repo build
  because of the `calculate-assembly.ts` DTS narrowing issue above. After that
  fix, standalone repo build passed.
- The final post-build-fix full `pnpm calculator:gate:current` run passed end
  to end: shared `2 files / 21 tests`, engine `797 files / 4372 tests`, web
  `127 files / 506 passed + 18 skipped`, repo build `5 successful / 5 total`,
  and the current-gate whitespace guard. The only build warnings were the known
  optional `sharp/@img` package warnings from the proposal DOCX route import
  chain.
- `git diff --check` passed.

Notes for the next validation pass:

- The `zustand persist middleware` storage warnings in web workbench tests are
  noisy but were non-fatal in the passing web gate. Do not classify them as the
  current calculator blocker unless they start failing assertions.
- The earlier broad `features/workbench` red should remain recorded as a
  warning that full-suite order/state can expose issues not visible in a single
  focused file. The current accepted evidence is the later current-gate web
  segment passing all selected workbench files.
- The final full current gate supersedes the earlier partial-gate note. Keep
  using targeted reruns while iterating, but use `pnpm calculator:gate:current`
  again before handoff if any subsequent runtime, schema, or build-facing
  calculator files move.

## Targeted Regression Test Increase - 2026-06-22

After the final full current gate, the user asked for additional tests focused
only on the changes made in this pass. Four narrow regression cases were added
to
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts`:

- Known catalog leaf materials with positive explicit `surfaceMassKgM2` now
  prove that the explicit mass overrides density-derived mass in resolved
  layers. This catches regressions where TypeScript narrowing or fallback logic
  accidentally recomputes the gypsum board mass and hides the user-supplied
  value.
- Unknown material allowance is now proven to stay scoped to explicit side
  leaves. An unknown cavity material without mass fails closed with the precise
  unknown-material warning instead of being hidden by the side-leaf allowance.
- Field and building companion outputs now prove that missing explicit side-leaf
  mass parks `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` as
  `needs_input` instead of publishing stale adapter values or reporting a vague
  unsupported building-adapter owner.
- The Gate R double-leaf/framed bridge solver contract now proves that omitted,
  zero, negative, and non-finite explicit leaf mass all collapse to the same
  `surfaceMassKgM2` `needs_input` boundary with no candidate basis or benchmark
  range.

The field/building companion test caught a real inconsistency: complete
building-context requests with one explicit side leaf missing mass were falling
through to `dynamic_calculator_building_prediction_runtime_adapter_owner_missing`
with no missing physical input, while the same route should have reported the
route-required `surfaceMassKgM2`. The fix keeps the explicit double-leaf/framed
surface-mass `needs_input` boundary eligible for the building-adapter owner
missing basis, but only for the owned airborne output set (`Rw`, `STC`, `C`,
`Ctr`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`). Impact and ASTM aliases remain
outside this boundary.

Targeted validation command:
`pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-owner-contract.test.ts src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts --testTimeout=20000 --reporter=verbose`
passed `6 files / 39 tests`.

Additional build validation: `pnpm --filter @dynecho/engine build` passed,
including DTS generation. The first build attempt caught an implicit-any DTS
issue in the new helper; it was fixed with an explicit `RequestedOutputId`
callback type before the passing build and targeted rerun.

## Additional Mixed-Output Error Hunt - 2026-06-22

After the user asked whether similar bugs could be found, the next audit focused
on the same failure family: requests that mix an airborne wall output with an
unsupported impact alias. These are high-risk because the engine must split the
request cleanly:

- the physically owned airborne output may be `supported` or `needs_input`;
- the adjacent impact alias (`IIC`/`AIIC`) must remain `unsupported`;
- warning and boundary text must not imply that impact aliases can be unlocked
  by supplying an airborne-only physical input.

Two additional inconsistencies were found.

### Mixed explicit surface-mass plus impact request

Reproduction:

- explicit double-leaf/framed wall topology;
- one side leaf has positive `surfaceMassKgM2`, the other side leaf is missing
  it;
- target outputs such as `Rw + IIC`, `R'w + IIC`, or `DnT,w + IIC`.

Observed bug before the fix:

- the lab/field mixed request could leave the airborne output on a
  `screening_fallback` path instead of reporting `surfaceMassKgM2`
  `needs_input`;
- the building mixed request could fall through to the building adapter owner
  missing path with no useful missing-input explanation;
- the impact alias was part of the target-output list, so the explicit
  surface-mass boundary was skipped when it required every requested output to
  be airborne.

Fix:

- the explicit double-leaf/framed surface-mass boundary now applies when at
  least one requested output is in the owned airborne output set;
- the boundary parks only its airborne `unsupportedOutputs`, so `IIC` remains
  impact-unsupported and is not described as a `surfaceMassKgM2` needs-input
  output;
- no formula value, source matching rule, or impact alias support changed.

Regression coverage:

`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts`
now includes a mixed airborne-plus-impact case for lab, field, and building
contexts.

### Flow-resistivity warning included impact aliases

Reproduction:

- double-leaf/framed porous absorber route;
- user-supplied porous material is missing `flowResistivityPaSM2`;
- target outputs such as `Rw + IIC`, `R'w + IIC`, or `DnT,w + IIC`.

Observed bug before the fix:

- value parking was already broadly correct: the airborne output was blocked
  and `IIC` stayed in `unsupportedImpactOutputs`;
- the warning text was wrong because it said the route selected `needs_input`
  for both the airborne output and `IIC`;
- this could mislead the UI or user into thinking that entering
  `flowResistivityPaSM2` might make a wall impact alias valid.

Fix:

- generic Answer Engine V1 needs-input parking now filters warning/parked
  outputs through the wall-airborne needs-input boundary helper before wording
  the warning;
- impact aliases remain unsupported aliases and are not named as
  `flowResistivityPaSM2` needs-input outputs;
- no numeric output values or route selection priorities changed.

Regression coverage:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
now includes lab, field, and building mixed airborne-plus-impact probes that
assert the warning names only the airborne needs-input output.

Targeted validation command:
`pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-owner-contract.test.ts src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts --testTimeout=20000 --reporter=verbose`
passed `7 files / 47 tests`.

Additional validation:

- `pnpm --filter @dynecho/engine build` passed after the generic parking
  filter change.
- `git diff --check` passed for the tracked worktree diff.
- A direct trailing-whitespace scan passed for the untracked bug-hunt doc and
  explicit surface-mass coverage-refresh test file.

## Mixed Wall Needs-Input Plus Floor-Impact Needs-Input Matrix - 2026-06-22

The user correctly pointed out that finding new inconsistencies one at a time
means the audit was still too incremental. The next pass stopped probing only
`IIC`/`AIIC` and expanded the same bug class to a finite matrix:

- wall route with missing `surfaceMassKgM2`;
- wall route with missing `flowResistivityPaSM2`;
- lab, field, and building airborne outputs;
- mixed with every non-airborne impact/alias output currently in
  `RequestedOutputSchema`: `Ln,w`, `L'n,w`, `CI`, `CI,50-2500`,
  `Ln,w+CI`, `DeltaLw`, `L'nT,w`, `L'nT,50`, `LnT,A`, `IIC`, `AIIC`,
  `NISR`, `ISR`, `LIIC`, `LIR`, and `HIIC`.

This matrix found a second real inconsistency that the earlier `IIC`-only
regression did not cover:

- `Rw + L'n,w` and `Rw + L'nT,w` could leave `Rw` supported even though the
  selected double-leaf/framed wall route was still missing
  `surfaceMassKgM2` or `flowResistivityPaSM2`;
- the floor-impact `needs_input` boundary was taking precedence, so the wall
  airborne output was not parked;
- the same issue existed for field/building wall airborne outputs paired with
  floor-impact needs-input outputs.

Fix:

- wall needs-input output filtering now treats route-owned missing inputs
  separately from field/floor context missing inputs;
- the wall boundary no longer defers to a selected floor-impact path when the
  wall route itself has an owned physical input stop;
- the explicit double-leaf/framed surface-mass boundary also remains eligible
  when the selected basis was a generic route-input `needs_input`, not only
  `screening_fallback` or building-adapter owner-missing.

Permanent coverage:

- `packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts`
  now runs the full mixed alias matrix for lab, field, and building
  surface-mass needs-input cases.
- `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
  now runs the same matrix for lab, field, and building flow-resistivity
  needs-input cases.

The temporary probe after the fix reported `96 probes / 0 issues` for this
specific mixed wall-needs-input plus impact/alias class.

Initial targeted validation:
`pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts --testTimeout=20000 --reporter=verbose`
passed `2 files / 18 tests`.

Final validation for this matrix slice:

- `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-owner-contract.test.ts src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts --testTimeout=20000 --reporter=verbose`
  passed `7 files / 47 tests`.
- `pnpm --filter @dynecho/engine build` passed. The first build attempt caught
  one DTS-only implicit-any callback type in the new warning guard; it was
  fixed with an explicit `string` parameter type before the passing build.
- `git diff --check` passed.
- Direct trailing-whitespace scan for the touched tracked and untracked files
  passed.

## Material Property Completeness Analysis - 2026-06-22

The user challenged whether `flowResistivityPaSM2` should be treated as a
calculator input at all, since it is a material property. The deeper analysis
separates three cases:

- Material does not physically have the property. Example: concrete, gypsum
  board, or a rigid mass panel has no `flowResistivityPaSM2`; this is normal and
  must not be requested.
- Built-in porous material has a catalog value or an explicitly marked
  engineering default. This is complete enough for the route, with provenance
  exposed.
- Custom/project material is classified as `porous_absorber` but has no
  `flowResistivityPaSM2`. This is not a room/context input problem; it is an
  incomplete material-definition problem.

Implementation analysis:

- The double-leaf/framed bridge input contract asks for
  `flowResistivityPaSM2` only when the topology declares a porous absorptive
  filled/partially filled cavity and a visible cavity material has
  `acoustic.behavior === "porous_absorber"` without a numeric flow value.
- It does not ask concrete, gypsum, panel leaves, or rigid/non-porous cavity
  materials for flow resistivity.
- Built-in catalog audit found `16` porous/porous-absorptive materials, and all
  `16` have `flowResistivityPaSM2`; none are missing the field.
- The prompt source for missing custom porous flow is `material_property`, not
  `wall_topology`, so the contract already has the semantic distinction the UI
  should expose.

New permanent coverage:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
now includes `keeps flow-resistivity completeness scoped to porous absorber
material definitions`. It proves:

- every built-in porous/porous-absorptive material has positive finite
  `flowResistivityPaSM2`;
- a custom porous absorber with missing flow produces a material-property
  prompt;
- a rigid/non-porous cavity layer does not produce `flowResistivityPaSM2`
  missing input or prompt;
- an explicitly empty/non-absorptive rigid cavity is complete without a flow
  field.

Initial validation:
`pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts --testTimeout=20000 --reporter=verbose`
passed `1 file / 8 tests`.

Final validation:

- `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-owner-contract.test.ts src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts --testTimeout=20000 --reporter=verbose`
  passed `7 files / 48 tests`.
- `pnpm --filter @dynecho/engine build` passed, including DTS generation.

UX implication:

The engine contract is physically coherent, but the UI should not present
`flowResistivityPaSM2` as a generic calculator-context input. When it is
missing, the user-facing copy should say that the selected porous absorber
material is incomplete for the active route and direct the user to complete the
material definition, pick a catalog material with a flow value, or consciously
accept an engineering-default material.

## UI Language Alignment For Material-Property Route Inputs - 2026-06-22

Goal:

Improve user-facing language without changing calculator behavior, route
selection, or engine contracts. The specific ambiguity was that
`needs_input` could read like the user forgot an ordinary calculator context
field, even when the missing value is actually a material-property definition
such as porous absorber `flowResistivityPaSM2` or resilient-layer dynamic
stiffness.

Implemented copy-only changes:

- Material field descriptions now state the physical scope:
  `flowResistivityPaSM2` is a porous absorber material property used by porous
  cavity damping routes; rigid panels and non-absorptive fills do not use it.
- Material-editor warnings now say the selected material is incomplete for the
  route instead of implying every material should carry every property.
- Material route-effectiveness badges now distinguish:
  - `needed`: this selected material is missing the property required by the
    active formula route;
  - `used`: this material property feeds the current formula route;
  - `inactive`: exact sources, impact-only selections, or out-of-stack
    materials do not use the field.
- Main workbench required-task copy now maps material-property field ids to
  human labels such as `Flow resistivity` and `Leaf surface mass`.
- Assistant preview route-task copy now uses the same material-property
  language instead of `Calculator route requires rawFieldId`.

Safety boundary:

- No engine code changed in this slice.
- No route selection, support/unsupported/needs-input status semantics, payload
  construction, or field-focusing behavior changed.
- Dirty shared UI files were touched only in copy helper regions and marked
  with coordination comments.

Validation:

- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-route-input-effectiveness.test.ts features/workbench-rebuild/material-editor-state.test.ts features/workbench-rebuild/material-editor-panel.test.ts features/workbench-rebuild/material-editor-surface-parity.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts --testTimeout=20000 --reporter=verbose`
  passed `5 files / 55 tests`.
- `pnpm --filter @dynecho/web typecheck` passed.

## Additional Bug Hunt Pass - 2026-06-22

Scope:

Look for user-visible calculator/workbench inconsistencies after the
material-property language alignment, without changing engine behavior.

Findings and fixes:

- UI route task copy still leaked the raw grouped field id
  `impactFieldContext` in assistant preview/output rows, while sibling
  fields such as `impactFieldContext.ci50_2500Db` were already mapped to
  user-readable labels like `CI,50-2500`.
  - Fix: map grouped `impactFieldContext` to `Impact field context` in
    both the main workbench required-task helper and the assistant preview
    helper.
  - Boundary: nested fields still keep their existing specific labels and
    focusing behavior; route status and calculation behavior did not change.
- Current single-leaf building `DnT,A,k` coverage-refresh runtime tests
  passed, but the docs/current-gate sync assertion failed because the
  landed no-runtime coverage-refresh status and selected double-leaf next
  owner were not present across every required handoff doc.
  - Fix: add the missing landed-refresh ledger to the documentation map and
    the previous runtime-owner status to the selected double-leaf owner plan.
  - Boundary: docs were updated only to record already-landed behavior; no
    engine route or selected runtime code changed.

Validation:

- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-editor-surface-parity.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts --testTimeout=20000 --reporter=verbose`
  passed `2 files / 28 tests`.
- A direct required-docs string probe passed for the single-leaf building
  `DnT,A,k` owner/coverage-refresh handoff and selected double-leaf next
  owner.
- `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-owner-contract.test.ts src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts --testTimeout=20000 --reporter=verbose`
  passed `2 files / 10 tests`.

## Additional Raw Route-Input Copy Bug Hunt - 2026-06-22

Scope:

Continue the bug hunt for user-visible calculator/workbench copy that leaked
raw route-input ids such as `loadBasisKgM2`, `impactFieldContext.ciDb`,
`sideALeafGroup`, `resilientBarSideCount`, or `openingElementRwDb`.

Findings and fixes:

- Result summary cards showed raw missing physical inputs on both floor
  stopped answers and parked airborne answers.
  - Fix: format missing physical inputs to user labels such as `Load basis`,
    `Impact field context`, `CI,50-2500`, `Side A leaf group`, and
    `First cavity depth`.
- Wall route cards, output cards, and generated proposal text showed raw
  airborne prompt ids such as `resilientBarSideCount` and `sideALeafGroup`.
  - Fix: central airborne physical prompt copy now uses labels only.
- Floor output cards showed raw floor/field-context missing input ids such as
  `floorRole:base_structure`, `impactFieldContext`, `impactFieldContext.ciDb`,
  and `impactFieldContext.guideHdDb_or_receivingRoomVolumeM3`.
  - Fix: floor missing-input detail now formats floor roles and field-impact
    inputs as readable labels.
- Markdown report rendering copied raw route ids from answer summaries and
  engine warning strings.
  - Fix: report rendering sanitizes known route-input ids only at render time;
    API/engine warning payloads remain unchanged.
- Opening/leak composite cards and report lines showed raw opening input ids
  such as `openingElementRwDb`.
  - Fix: opening/leak surface copy now formats missing inputs and warning
    lines while preserving raw `missingInputs` data.
- Assembly-alternative review rationale showed raw missing physical inputs.
  - Fix: context trace rationale now formats known physical inputs to user
    labels.
- Rebuild calculator assistant/main workbench unknown-field fallback could show
  a raw field leaf.
  - Fix: fallback labels are now humanized instead of directly echoing the raw
    leaf id.

Safety boundary:

- No engine formula, route ownership, support bucket, `needs_input`, or
  `unsupported` semantics changed.
- Raw ids remain in deterministic result payloads, boundary arrays, and API
  warnings where tests intentionally assert engine contracts.
- Changes are UI/report/assistant copy only.

Validation:

- `pnpm --filter @dynecho/web exec vitest run features/workbench/result-answer-chart.test.ts --testTimeout=20000 --reporter=verbose`
  passed `1 file / 6 tests`.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-output-model.test.ts features/workbench/wall-double-leaf-framed-bridge-runtime-route-card-matrix.test.ts features/workbench/result-answer-chart.test.ts --testTimeout=20000 --reporter=verbose`
  passed `3 files / 23 tests`.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-assembly-alternatives.test.ts --testTimeout=20000 --reporter=verbose`
  passed `1 file / 8 tests`.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-output-model.test.ts features/workbench/post-v1-floor-combined-bound-local-guide-gate-al.test.ts features/workbench/post-v1-floor-local-guide-input-surface-gate-am.test.ts features/workbench/post-v1-floor-explicit-ci-local-guide-gate-an.test.ts features/workbench/post-v1-floor-bound-explicit-ci-local-guide-gate-ap.test.ts features/workbench/post-v1-floor-explicit-ci50-standardized-field-gate-ao.test.ts features/workbench/post-v1-floor-bound-low-frequency-field-companion-gate-ak.test.ts features/workbench/reinforced-concrete-cleanup-surface-parity.test.ts --testTimeout=30000 --reporter=verbose`
  passed `8 files / 31 tests`.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/reinforced-concrete-cleanup-surface-parity.test.ts features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts --testTimeout=40000 --reporter=verbose`
  passed `2 files / 17 tests`.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/opening-leak-composite-surface-parity.test.ts features/workbench/opening-leak-composite-input-surface-acceptance.test.ts --testTimeout=30000 --reporter=verbose`
  passed `2 files / 8 tests`.
- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/material-editor-surface-parity.test.ts --testTimeout=20000 --reporter=verbose`
  passed `2 files / 28 tests`.
- `pnpm --filter @dynecho/web typecheck` passed.
- `git diff --check` passed.

## Additional Report Assistant And Scenario Warning Copy Bug Hunt - 2026-06-22

Scope:

Continue the bug hunt for user-visible copy paths that still exposed raw
route-input ids, runtime boundary ids, or engine warning field ids after the
previous result-card/report cleanup.

Findings and fixes:

- Report assistant context, trace explanation, and plausibility research copy
  could still render raw route inputs such as `impactFieldContext.ci50_2500Db`
  or `loadBasisKgM2` in resolver-required, missing-input, and parked-metric
  rationale text.
  - Fix: format those copy paths with physical-input labels such as
    `CI,50-2500`, `load basis`, and `support spacing`.
  - Boundary: raw context/trace objects remain unchanged for deterministic
    machine traceability.
- Scenario warnings rendered raw runtime boundary ids for opening/leak,
  advanced-wall, and open-web field/building blockers.
  - Fix: format known boundary ids such as `duplicateOpeningId`,
    `openingAreaExceedsHostWallArea`, `field_or_building_output_basis`, and
    `floor_open_web_building_prediction_runtime_owner_missing` before they
    reach user-visible warning copy.
  - Boundary: raw `hostileInputBoundaries` and `unsupportedBoundaries` arrays
    remain unchanged on input-surface objects.
- Opening/leak cards and report lines could reintroduce raw engine warning ids
  even after scenario warning copy was formatted.
  - Fix: opening/leak surface copy now formats missing inputs and known warning
    ids such as `sourceAbsentOpeningValueBudgetOwner`, duplicate opening ids,
    and opening-area boundary ids.
  - Boundary: engine `result.warnings` stays intact; formatting happens only
    in the web surface.
- Advanced-wall source-absent cards/report lines and scenario warnings could
  expose raw Gate AY field ids such as `panelLossFactor` and
  `panelCriticalFrequencyHz`.
  - Fix: Gate AY surface copy now reuses the advanced-wall input label map, and
    workbench warning notes sanitize known advanced-wall field ids.
  - Boundary: engine `missingPhysicalInputs` remains raw and unchanged.
- Report assistant current-calculator review blocker could say
  `Missing calculator inputs: supportSpacingMm`.
  - Fix: blocker copy now formats route-input labels while packet
    `missingInputs` remain raw for traceability.

Safety boundary:

- No engine formula, route selection, route ownership, numeric value, support
  bucket, `needs_input`, or `unsupported` semantics changed.
- Raw ids remain in engine payloads, input-surface boundary arrays, and packet
  trace fields where they are contract data.
- The only runtime-visible change is user-facing copy in warning, card, report,
  and assistant-review text.
- Existing route `method` ids are still visible in some trace-style details;
  that is left for a separate copy/trace policy pass because changing it would
  touch a much wider surface than this bug fix.

Validation:

- `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-trace-explanation.test.ts features/workbench/report-assistant-plausibility-research.test.ts features/workbench/report-assistant-context.test.ts --testTimeout=30000 --reporter=verbose`
  passed `3 files / 36 tests`.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/opening-leak-composite-input-surface-acceptance.test.ts features/workbench/opening-leak-composite-surface-parity.test.ts features/workbench/advanced-wall-source-absent-input-surface-acceptance.test.ts features/workbench/open-web-field-building-input-surface.test.ts --testTimeout=30000 --reporter=verbose`
  passed `4 files / 17 tests`.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/advanced-wall-source-absent-input-surface-acceptance.test.ts features/workbench/report-assistant-current-calculator-review-packet.test.ts --testTimeout=30000 --reporter=verbose`
  passed `2 files / 10 tests`.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-trace-explanation.test.ts features/workbench/report-assistant-plausibility-research.test.ts features/workbench/report-assistant-context.test.ts features/workbench/opening-leak-composite-input-surface-acceptance.test.ts features/workbench/opening-leak-composite-surface-parity.test.ts features/workbench/advanced-wall-source-absent-input-surface-acceptance.test.ts features/workbench/open-web-field-building-input-surface.test.ts features/workbench/report-assistant-current-calculator-review-packet.test.ts --testTimeout=30000 --reporter=verbose`
  passed `8 files / 59 tests`.
- A focused raw-join scan for `missingInputs`, `missingPhysicalInputs`,
  `requiredInputs`, `unsupportedBoundaries`, and `hostileInputBoundaries`
  found no remaining direct user-copy joins in non-test workbench files.
- `pnpm --filter @dynecho/web typecheck` passed.
- `git diff --check` passed.

## Documentation Sync - 2026-06-22

Reason:

After the report-assistant/scenario-warning copy bug hunt, the workbench
usability record existed but was not referenced from the live calculator
navigation docs. That could make the support work look either orphaned or
like hidden runtime progress.

Synchronized docs:

- `docs/calculator/DOCUMENTATION_MAP.md` now lists this bug-hunt record as
  the latest workbench calculator usability/input-dependency support record.
- `docs/calculator/CURRENT_STATE.md` now calls out the same record as
  non-runtime work that moved no engine behavior, route support bucket,
  selected next implementation, or calculator counters.
- `docs/calculator/NEXT_AGENT_BRIEF.md` now warns the next agent to treat
  this as UI/report/assistant copy and validation context only, not as a
  formula-owner or coverage-refresh step.

Safety boundary:

- No runtime, formula, route-selection, shared-schema, API, or test code was
  changed in this documentation sync.
- The current selected next implementation remains
  `post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_plan`.
- The bug-hunt counters remain zero for new calculable request shapes, new
  calculable target outputs, runtime basis promotions, runtime values moved,
  formula retunes, and source rows imported.
- Historical calculator/engine planning docs may still name raw ids such as
  `supportSpacingMm`, `sourceAbsentOpeningValueBudgetOwner`, or
  `flowResistivityPaSM2` when they are describing deterministic engine
  contracts, required-input boundaries, or formula inputs. That is intentional;
  this bug hunt only removed raw-id leakage from user-facing workbench,
  report, card, warning, and assistant copy paths.
