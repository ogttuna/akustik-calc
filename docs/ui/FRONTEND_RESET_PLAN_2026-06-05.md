# DynEcho Frontend Reset Plan - 2026-06-05

## Superseded Master Plan Notice - 2026-06-05

New UI work must follow
`docs/ui/DYNECHO_UI_REBUILD_MASTER_PLAN_2026-06-05.md`. This file remains
only as an audit record of rejected reset attempts and their validation.

Document role: binding frontend reset plan after the failed Workbench V2
iterations. This document supersedes the earlier exploratory frontend plan
for new UI work. It is frontend-only unless a later user request explicitly
selects backend, engine, schema, auth, storage, or report-generation work.

## Implementation Progress - 2026-06-05

First controlled reset slice landed for `/workbench-v2`.

- Workbench V2 now uses one normal document scroll instead of independent
  setup/stack/result scroll regions.
- The render surface was reduced to setup, required inputs, layer stack,
  result, curve, warnings, and existing report handoff.
- Mobile layer editing now keeps only the selected layer expanded; other
  layers stay compact.
- Central style support was added in `apps/web/app/globals.css` through
  semantic `ui-workbench-*`, `ui-output-*`, and `ui-required-*` classes.
- `/workbench/proposal` remains the existing PDF/proposal route.
- No engine, endpoint, shared schema, auth, storage, proposal renderer, or
  PDF output behavior changed.

Validation for this slice:

- `pnpm exec eslint features/workbench-v2/workbench-v2-shell.tsx
  app/workbench-v2/page.tsx` passes.
- `git diff --check` passes for the touched frontend/docs files.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Playwright desktop light, desktop dark, and mobile light checks have no
  console warning/error messages and no accidental nested scroll containers.
- Route smoke returned `/`, `/workbench-v2`, and `/workbench/proposal` as
  200. `/login` redirects to `/workbench` in preview-auth mode.

Public intro correction landed after the first Workbench reset slice:

- `/` no longer depends on the stale `workbench-v2-preview.png` image.
- The public intro now renders a CSS/HTML tool preview through centralized
  `ui-public-*` classes instead of a static screenshot.
- Playwright desktop light, desktop dark, and mobile light checks show no
  console warning/error messages, no horizontal overflow, and no `<img>`
  elements on the public intro.

## Non-Negotiable Rules

- This product is an engineering tool, not a marketing website.
- The UI goal is usability, simplicity, consistency, and immediate
  orientation. Every visible element must help the user operate, inspect, or
  decide.
- Logged-in tool surfaces must not use slogan-heavy copy, decorative
  gradients, ornamental motion, dashboard-card mosaics, or long explanatory
  paragraphs.
- Central styling is mandatory. Colors, surfaces, borders, radius, controls,
  chips, panels, fields, and state colors must be managed through
  `apps/web/app/globals.css` tokens and semantic classes first.
- Component files may use layout utilities, but must not repeat raw palette,
  border, and state-color decisions when a central class exists.
- Light mode and dark mode must both remain supported and visually checked.
- Avoid nested scroll regions. The default is normal document scroll. A
  nested scroll container is allowed only for a deliberately bounded editor,
  table, preview pane, or modal and must be justified in the implementation
  note.
- Text must be short. Prefer labels, status, values, and direct actions over
  paragraphs.
- Dropdowns, menus, popovers, and assistants must not render in the wrong
  layer, behind content, or outside the usable viewport.
- Do not touch calculator engine behavior, endpoint contracts, shared
  schemas, auth/storage behavior, or report/PDF generation during this reset.

## Preserve Exactly

- Preserve the existing proposal/PDF output route and behavior unless the
  user explicitly selects report-output work.
- Preserve the existing PDF renderer, PDF export API, and proposal content
  values.
- Preserve existing calculator result values and API contracts.
- Preserve the existing graph/layer/result visualization behavior until a
  dedicated, explicit visualization slice is selected. A page-layout refactor
  may reposition or frame the existing visual, but must not replace it with a
  new graphic experiment.
- Preserve login behavior. The login page already exists and is acceptable
  unless a later request specifically targets it.

## Target Product Shape

There are three product surfaces plus the existing login gate:

1. Public Intro
   - Route: `/`.
   - Auth: no login required.
   - Purpose: explain what DynEcho is and route users to login/workbench.
   - Tone: this is the only surface that may feel promotional, but it must
     stay restrained and concise.
   - Content: product identity, one short value statement, supported workflow,
     and direct call to action.

2. Calculator Workbench
   - Route: canonical authenticated calculator route, currently staged as
     `/workbench-v2` until promotion is explicitly selected.
   - Auth: login required.
   - Purpose: collect required inputs, manage layer stack, choose requested
     outputs, show calculation state, show result values, and show blockers.
   - Must include:
     - study mode or assembly type;
     - required layer stack inputs;
     - route-required physical inputs;
     - requested output selection;
     - existing graph/layer/result representation;
     - result summary and stopped/error state;
     - clear handoff to the report/PDF route.
   - Must avoid:
     - multiple independent column scrollbars;
     - passive explanatory text walls;
     - duplicating the same state in several panels;
     - hiding required next actions behind diagnostics.

3. Report Editor
   - Route: authenticated report editing surface, to be designed after the
     calculator surface stabilizes.
   - Auth: login required.
   - Purpose: preview the report, manually edit report text, and use an
     assistant to propose report edits.
   - The assistant may propose edits, summarize issues, or queue patches. It
     must not silently change calculator inputs, output values, PDF values, or
     engine behavior.
   - The current `/workbench/proposal` PDF/proposal route remains the source
     of existing PDF behavior until a separate report-editor implementation
     is approved.

4. Login
   - Route: `/login`.
   - Auth: public gate.
   - Purpose: authenticate users before entering calculator/report tools.
   - Current surface is acceptable and should be left alone unless explicitly
     selected.

## UI Architecture Rules

- Use a small app shell with predictable navigation:
  public intro -> login -> calculator -> report.
- Logged-in tool pages should feel quiet and operational:
  compact header, clear mode/output state, primary workspace, concise
  secondary context.
- Use full-width sections or plain layout for page structure. Use cards only
  for repeated items, editor rows, modals, and genuinely framed previews.
- Keep actions close to the object they affect.
- Use icons for obvious commands such as add, move, duplicate, remove, open,
  save, and download.
- Use native controls unless a custom component clearly solves a real
  usability problem. If custom dropdowns/popovers are introduced, portal,
  z-index, collision, keyboard, and mobile behavior must be tested.
- Do not add a design system package casually. Prefer the existing stack,
  `lucide-react`, central CSS tokens, and small local components.

## Central Style Contract

The style source of truth is `apps/web/app/globals.css`.

Required central layers:

- theme tokens: light/dark palette, semantic aliases, state colors;
- surface classes: app, topbar, panels, muted panels, side bands;
- control classes: buttons, icon buttons, fields, chips, choice rows;
- state classes: success, warning, accent, disabled, focus;
- editor classes: rows, compact summaries, repeated item shells.

Implementation rules:

- Add or update semantic CSS classes before scattering Tailwind arbitrary
  color values in components.
- Component classes may define layout, spacing, responsive grid, and
  typography scale.
- Palette changes must be possible by editing token values, not by hunting
  through page components.
- Any new class family must be named by purpose, not color.

## Calculator Workbench Reset Roadmap

Step 0: Freeze and protect
- Stop changing PDF/proposal output, graph/layer visualization, engine,
  endpoint, schema, auth, and storage.
- Mark the earlier Workbench V2 experiments as non-binding.
- Keep the current preview route available only as staging until the reset is
  accepted.

Step 1: Information architecture
- Reduce the calculator surface to one main flow:
  setup -> layers -> required inputs -> result -> report handoff.
- Decide which information is primary, secondary, and advanced.
- Remove duplicate panels and repeated status blocks.

Step 2: Layout reset
- Build a single-scroll tool page.
- Desktop: compact left setup/inputs area, central work surface, concise
  result/next-action area only if it does not create scroll traps.
- Mobile: linear flow with clear step navigation and no side-by-side squeeze.
- Keep current graph/layer/result visual behavior intact.

Step 3: Input ergonomics
- Make layer editing compact and scannable.
- Keep add, move, duplicate, remove controls close to layer rows.
- Show only required physical inputs for the selected outputs/route.
- Convert blocker/error state into a direct next action.

Step 4: Result clarity
- Show one primary result summary.
- Show selected output states without overwhelming the page.
- Stopped outputs must explain the missing input or unsupported boundary in
  one short line.
- Preserve existing calculation values and API behavior.

Step 5: Report handoff
- Keep handoff to existing `/workbench/proposal`.
- Do not alter PDF export or proposal renderer.
- Prepare a later report-editor surface only after calculator reset is
  accepted.

Step 6: Report editor planning
- Design preview + assistant + manual edit as a separate surface.
- Assistant changes are proposed, reviewed, and accepted/rejected.
- No silent mutation of calculator outputs or PDF values.

Step 7: Promotion
- Compare reset calculator against legacy/current workbench on representative
  wall and floor workflows.
- Only then decide whether `/workbench-v2` replaces `/workbench`.

## Validation Required For Every UI Slice

- `pnpm exec eslint <touched frontend files>`.
- `git diff --check -- <touched files>`.
- `pnpm --filter @dynecho/web build` for route/layout changes.
- Playwright screenshots for desktop and mobile.
- Playwright console warning/error check.
- Light and dark mode check when visual style changes.
- Scroll audit when layout changes:
  there must be no accidental independent scroll containers.
- Route smoke:
  `/`, `/login`, calculator route, and `/workbench/proposal`.

## Current Next Action

Do not continue adding UI features. The next action is a controlled
calculator workbench layout reset based on this document:

1. Keep public intro and login stable.
2. Keep PDF/proposal route stable.
3. Keep graph/layer/result visualization behavior stable.
4. Rebuild the calculator page layout around a simple single-scroll tool
   workflow.
5. Validate before moving to the report editor.
