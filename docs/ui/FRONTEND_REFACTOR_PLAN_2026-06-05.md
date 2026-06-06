# DynEcho Frontend Refactor Plan - 2026-06-05

## Superseded Master Plan Notice - 2026-06-05

New UI work must follow
`docs/ui/DYNECHO_UI_REBUILD_MASTER_PLAN_2026-06-05.md`. This file remains
only as an audit record of exploratory and rejected frontend passes.

## Superseded Reset Notice - 2026-06-05

New frontend UI work must follow
`docs/ui/FRONTEND_RESET_PLAN_2026-06-05.md`. This older file remains an
audit log of exploratory and failed frontend passes. It is no longer the
binding implementation plan.

Document role: comprehensive frontend-only refactor plan for the public
site, login surface, calculator workbench, and report-editing workflow.
This plan deliberately does not select or change calculator behavior.

## Implementation Status - 2026-06-05

Correction after user feedback on the thirteenth pass:

- The Workbench V2 cross-section schematic experiment was rolled back.
  The active layer representation is again the compact `Layer order` list.
- The separate floor default-stack behavior from that experiment was also
  removed. Mode switching is back to the prior Workbench V2 behavior.
- The `h-svh` / `overflow-hidden` shell and per-column `overflow-y-auto`
  layout were removed from Workbench V2. The page now uses normal document
  scrolling instead of separate setup/stack/result scroll containers.
- `/workbench/proposal` remains the PDF/proposal route. `/report-v2` remains
  absent.
- No engine, endpoint, shared schema, auth, storage, proposal renderer, or
  PDF output behavior changed.

Validation for the correction:

- `pnpm exec eslint features/workbench-v2/workbench-v2-shell.tsx
  app/workbench-v2/page.tsx` passes.
- `git diff --check` passes for the touched Workbench V2 and global style
  files.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this correction is running at
  `http://localhost:3025`.
- Node `fetch` smoke returned `/`, `/workbench-v2`, and
  `/workbench/proposal` as 200, while `/report-v2` remains 404.
- Playwright desktop and mobile checks found no independent `overflow-y`
  scroll containers inside Workbench V2 and no console warnings.

Reverted thirteenth frontend-only experiment, kept here for audit:

- Workbench V2 layer representation now uses a professional construction
  cross-section schematic instead of the temporary plain list. Wall stacks
  render side-to-side; floor stacks render top-to-base.
- Layer bands are proportional to entered thickness but keep minimum visual
  size so thin layers such as boards, tiles, and resilient underlays remain
  selectable and visible.
- Material tone and pattern styling is centralized in `globals.css` through
  semantic layer tokens/classes (`ui-layer-schematic`, `ui-layer-visual`,
  `ui-layer-band`, `ui-layer-tone-*`, `ui-layer-key`, `ui-layer-row`).
- The layer key stays beside the schematic on desktop and below it on
  mobile, with full material names available even when the visual band must
  truncate text.
- Floor mode now gets its own UI default stack:
  ceramic tile / floating screed / resilient underlay / concrete. This
  prevents the previous UI-only mode switch from showing wall layers as
  incorrect all-`Base` floor rows.
- Library research was checked before implementation. React Flow is better
  suited to node/edge workflows, while visx/D3 would add low-level
  visualization dependency weight for a deterministic layer cross-section.
  Radix Select remains a later option for custom selects, but native selects
  were kept here to avoid portal/z-index/dropdown layering risk.
- No engine, endpoint, shared schema, auth, storage, proposal/PDF route,
  proposal renderer, or PDF output behavior changed.

Additional validation:

- `pnpm exec eslint features/workbench-v2/workbench-v2-shell.tsx` passes.
- `git diff --check` passes for the touched Workbench V2 and global style
  files.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this pass is running at `http://localhost:3025`.
- Node `fetch` smoke returned `/`, `/workbench-v2`, and
  `/workbench/proposal` as 200, while `/report-v2` remains 404.
- Playwright production verification covered desktop light schematic,
  desktop dark schematic, mobile floor schematic, floor mode switching,
  console warning checks, and preservation of the existing
  `/workbench/proposal` PDF route.

Landed in the twelfth frontend-only pass:

- `apps/web/app/globals.css` now owns a semantic UI style layer for the new
  surfaces: app/topbar, border rails, panels, warning panels, buttons,
  icon buttons, chips, fields, choice rows, layer rows, edit rows, row links,
  and divider helpers.
- Palette and theme changes should happen in the root light/dark token
  blocks and semantic aliases first. New Workbench/Public UI should prefer
  classes such as `ui-button`, `ui-chip`, `ui-field`, `ui-panel`,
  `ui-panel-muted`, `ui-warning-panel`, `ui-layer-row`, and `ui-edit-row`
  instead of repeating raw color/border combinations in component files.
- Public entry, authenticated session bar, visible theme toggle, and the
  Workbench V2 high-touch controls now use the shared semantic classes.
- Workbench V2 remains a compact engineering tool surface: no slogan-heavy
  content, decorative gradient treatment, marketing dashboard grid, engine
  adapter change, endpoint change, or PDF/report-output change was made.

Additional validation:

- Raw repeated component-side panel/background/border combinations were
  checked with `rg`; the new public/session/workbench V2 surfaces now route
  those choices through semantic classes.
- `pnpm exec eslint app/page.tsx components/auth/workbench-session-bar.tsx
  components/theme-mode-toggle.tsx features/workbench-v2/workbench-v2-shell.tsx`
  passes.
- `git diff --check` passes for the touched frontend and UI plan files.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this pass is running at `http://localhost:3025`.
- Node `fetch` smoke returned `/`, `/workbench-v2`, and
  `/workbench/proposal` as 200, while `/report-v2` remains 404.
- Playwright production verification covered desktop light mode, desktop
  dark mode, mobile Report handoff, console warning checks, and the PDF link
  navigating to `/workbench/proposal`.

Landed in the eleventh frontend-only pass:

- A visible light/dark mode toggle is now available in the app session bar
  and public entry header. The existing `data-theme` token system remains
  the source of truth.
- Workbench V2 layer representation no longer uses proportional fake bars.
  The stack overview is now a compact layer-order list with row number,
  material, role, and thickness.
- Report V2 staging links were removed from the public entry and Workbench
  V2 handoff. Workbench V2 now points report handoff back to the existing
  `/workbench/proposal` PDF/proposal preview route.
- The staging `/report-v2` route and shell were removed to avoid confusing
  the new report-edit experiment with the existing PDF output.
- No PDF renderer, proposal export API, engine, endpoint, shared schema,
  auth, storage, or calculation output behavior changed.

Additional validation:

- `pnpm exec eslint app/page.tsx components/auth/workbench-session-bar.tsx
  components/theme-mode-toggle.tsx features/workbench-v2/workbench-v2-shell.tsx`
  passes.
- `git diff --check` passes for the touched frontend and UI plan files.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this pass is running at `http://localhost:3024`.
- Playwright production verification covered light/dark toggle, simplified
  layer-order representation, mobile PDF handoff, old `/workbench/proposal`
  route availability, removed `/report-v2` route, and console warning check.

Landed in the tenth frontend-only pass:

- Workbench V2 result panel now has one concise state summary for ready,
  loading, local blocker, API error, no-output, and unsupported/no-live
  states.
- Selected output status counts are visible directly under the result:
  Ready, Needs input, and Unsupported.
- Local blocker and remote required-input states still point back to the
  first actionable field. Unsupported/no-live states now show `Review
  outputs`, which focuses the output picker instead of leaving the user on
  a dead result panel.
- Mobile Result and Report handoff panels use the same summary copy, so the
  workflow stays compact and consistent across desktop and mobile.
- No engine, endpoint, shared schema, auth, storage, or report-generation
  behavior changed.

Additional validation:

- `pnpm exec eslint features/workbench-v2/workbench-v2-shell.tsx` passes.
- `git diff --check -- apps/web/features/workbench-v2/workbench-v2-shell.tsx`
  passes.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this pass is running at `http://localhost:3022`.
- Playwright production verification covered desktop ready summary, local
  blocker focus, unsupported/no-live summary with `Review outputs`, mobile
  Result and Report tabs, and console warning check.

Landed in the ninth frontend-only pass:

- Report V2 preview now reads more like the editable report draft: compact
  title metadata, a clear result band, and separated Assessment,
  Assumptions, and Reviewer Notes sections.
- Assistant proposal review now exposes Pending, Accepted, and Rejected
  counts so review state is scannable without reading every card.
- Pending proposals show Current and Proposed text by default. Accepted and
  rejected proposals collapse into a compact post-decision view.
- Manual editing remains first-class. Assistant actions only queue report
  text proposals and never mutate calculator inputs, layer data, result
  values, endpoints, or engine behavior.
- No engine, endpoint, shared schema, auth, storage, or report-generation
  behavior changed.

Additional validation:

- `pnpm exec eslint features/report-v2/report-v2-shell.tsx` passes.
- `git diff --check -- apps/web/features/report-v2/report-v2-shell.tsx`
  passes.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this pass is running at `http://localhost:3020`.
- Playwright production verification covered desktop proposal queue, visible
  Current/Proposed comparison, accept flow updating the preview, mobile
  Preview and Assistant tabs, and console warning check.

Landed in the eighth frontend-only pass:

- Workbench V2 mobile layer rows now use a compact summary list: layer
  number, material, role, and thickness are visible for every layer.
- Only the selected mobile layer opens its material, thickness, role, and
  reorder/duplicate/remove controls. This keeps the stack editor usable
  without showing every row action at once.
- Desktop Workbench V2 keeps the full multi-row editor visible for repeated
  engineering entry work.
- Required-input focus still works with the collapsed mobile editor: a
  missing thickness task selects the affected layer, opens its editor, and
  focuses the thickness input.
- The linear mobile flow remains unchanged:
  `Setup -> Stack -> Result -> Report`.
- No engine, endpoint, shared schema, auth, storage, or report-generation
  behavior changed.

Additional validation:

- `pnpm exec eslint features/workbench-v2/workbench-v2-shell.tsx` passes.
- `git diff --check -- apps/web/features/workbench-v2/workbench-v2-shell.tsx`
  passes.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this pass is running at `http://localhost:3019`.
- Playwright production verification covered mobile layer collapse/expand,
  required-task focus into a collapsed layer editor, desktop editor
  preservation, and console warning check.

Landed in the seventh frontend-only pass:

- Workbench V2 required-input rows are now task actions instead of passive
  text. Each task has a short label, one-line detail, and an action label.
- Local blockers now point back to the exact control that needs work. A
  missing layer thickness task moves the mobile user from `Result` or
  `Setup` back to `Stack` and focuses the affected thickness input.
- Remote `needs_input` field ids are mapped to readable labels such as
  `CI50 dB`, `RT60`, `Room volume`, `Load kg/m2`, and `Dynamic stiffness`
  when the existing estimate boundary returns those fields.
- Result rows no longer expose long owner-style field ids for stopped
  outputs. Missing inputs read as `Needs <input label>` and unsupported
  outputs read as `Unsupported for current route`.
- Mobile result rows now wrap cleanly instead of forcing a four-column
  squeeze on narrow screens.
- No engine, endpoint, shared schema, auth, storage, or report-generation
  behavior changed.

Additional validation:

- `pnpm exec eslint features/workbench-v2/workbench-v2-shell.tsx` passes.
- `git diff --check -- apps/web/features/workbench-v2/workbench-v2-shell.tsx`
  passes.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this pass is running at `http://localhost:3018`.
- Playwright production verification covered:
  `Result -> Review required input -> Stack focused thickness input`,
  `Setup required task -> Stack focused thickness input`, and floor
  unsupported output rendering without raw owner/field-id copy.
- Current visible floor test stacks did not produce a remote
  `needs_input` boundary; the remote-label mapping is implemented and ready
  for boundaries returned by the existing API.

Analysis pass after sixth frontend-only pass:

- Current product shape is established in staging: public `/`, login, and
  `/workbench-v2` cover the simplified tool entry and workbench. Report
  output is back on the existing `/workbench/proposal` PDF/proposal route.
- The refactor has moved from "create the simplified UI" into
  "prove parity and promote safely." The remaining risk is not visual
  design; it is workflow coverage, blocker-state handling, and legacy route
  retirement.
- V2 is usable as a preview workbench, but it is not ready to replace
  `/workbench` until common wall/floor workflows are compared against the
  legacy surface and the required-input/error states are exercised more
  thoroughly.
- The logged-in tool direction remains unchanged: no marketing treatment,
  no decorative gradient/theme pass, no long explanatory copy, and no
  engine/backend/API/schema edits for UI convenience.

Roadmap status snapshot:

- Step 0, boundary protection: closed as a guardrail, still required before
  every slice because other agents are changing calculator files.
- Step 1, route and product IA: closed in staging. Public, login, Workbench
  V2, and the existing PDF/proposal route are the active user-facing paths.
- Step 2, Workbench V2 skeleton: closed. Desktop and mobile shells exist.
- Step 3, UI read model adapter: partially closed. V2 calls the existing
  estimate API and renders live/stopped/warning state, but promotion still
  needs common workflow comparison against legacy `/workbench`.
- Step 4, layer stack editor: partially closed. Add, duplicate, remove,
  reorder, material, thickness, role, selected-row state, and a compact
  stack diagram exist; mobile row density and compact action placement can
  still improve.
- Step 5, required inputs and output selection: partially closed. Requested
  outputs and route-specific context fields exist, but `needs_input` cases
  need a focused audit so every common blocker has a short next action.
- Step 6, result inspector: partially closed. Primary result, supporting
  outputs, stopped outputs, warnings, curve, route detail disclosure, and
  report handoff exist; loading, error, unsupported, and no-result states
  still need final hardening before route promotion.
- Step 7, report output surface: reverted to the existing PDF/proposal
  route. The separate Report V2 editor experiment is not active after the
  eleventh pass.
- Step 8, public page pass: closed enough for the current preview. It is a
  concise tool-entry surface, not a slogan page.
- Step 9, promotion and legacy retirement: open. This is the main remaining
  milestone.

Recommended next frontend slices:

1. Workbench V2 blocker-state audit.
   - Exercise common wall and floor workflows.
   - Capture live, `needs_input`, `unsupported`, loading, error, and empty
     result states.
   - Tighten missing-input task labels and focus behavior without changing
     endpoint contracts.

2. Workbench V2 mobile density pass.
   - Reduce layer-row action weight on mobile.
   - Keep the linear `Setup -> Stack -> Result -> Report` flow.
   - Avoid adding explanatory text; use labels, icons, and state only.

3. PDF/proposal handoff parity.
   - Keep Workbench V2 handoff connected to the existing proposal/PDF route.
   - Do not change exported PDF content, renderer, or report values in a UI
     refactor slice.
   - Add only the minimum packaging bridge needed after V2 promotion evidence
     exists.

4. Promotion audit.
   - Compare legacy `/workbench` and `/workbench-v2` on representative
     wall/floor flows.
   - Decide whether legacy remains as an advanced/operator route.
   - Promote V2 to `/workbench` only after screenshot and smoke coverage
     are clean.

Explicitly deferred:

- Legacy workbench cleanup before promotion evidence exists.
- Any API, schema, engine, persistence, auth, or report-generation changes.
- Broad theme/color refreshes, marketing copy, dashboard-style card grids,
  or decorative motion.

Landed in the sixth frontend-only pass:

- Workbench V2 mobile Setup now has a direct `Continue to stack` action so
  users can move from input selection into layer editing without hunting
  the top step tabs.
- Workbench V2 mobile Stack now has a direct `View result` action at the end
  of the layer editor, keeping the primary workflow linear:
  `Setup -> Stack -> Result -> Report`.
- Desktop Workbench V2 layout remains unchanged; the new actions are
  mobile-only flow affordances.
- No engine, endpoint, shared schema, auth, storage, or report-generation
  behavior changed.

Additional validation:

- `pnpm exec eslint features/workbench-v2/workbench-v2-shell.tsx` passes.
- `git diff --check -- apps/web/features/workbench-v2/workbench-v2-shell.tsx`
  passes.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this pass is running at `http://localhost:3017`.
- Playwright dev verification covered mobile Workbench V2
  `Setup -> Continue to stack -> Stack -> View result -> Result -> Report`
  plus report-link navigation into Report V2, with no console warnings or
  errors.
- Playwright production smoke covered the same mobile Workbench V2 forward
  flow and Report V2 navigation at `http://localhost:3017`, with no console
  warnings or errors.
- `pnpm --filter @dynecho/web typecheck` still fails on pre-existing legacy
  `features/workbench/*.test.ts` type errors; this pass did not edit those
  files.

Landed in the fifth frontend-only pass:

- Workbench V2 mobile `Report` tab now shows a dedicated report handoff
  panel instead of dropping the user into the full result inspector.
- The mobile handoff panel shows the selected live result, report readiness
  state, stopped-output blockers when present, and `Open report` as the
  primary action.
- Desktop Workbench V2 result inspector remains unchanged; the new handoff
  panel is mobile-only.
- Workbench V2 to Report V2 navigation was verified with metric/value/status
  query parameters.

Additional validation:

- `pnpm exec eslint features/workbench-v2/workbench-v2-shell.tsx` passes.
- `git diff --check -- apps/web/features/workbench-v2/workbench-v2-shell.tsx`
  passes.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this pass is running at `http://localhost:3016`.
- Playwright production verification covered mobile Workbench V2 `Report`
  tab and `Open report` navigation into Report V2, with no console warnings
  or errors.
- `pnpm --filter @dynecho/web typecheck` still fails on pre-existing legacy
  `features/workbench/*.test.ts` type errors; this pass did not edit those
  files.

Landed in the fourth frontend-only pass:

- Public `/` page was revised from a feature-card/product-pitch layout into
  a concise tool entry surface.
- The first viewport now shows the product name, one direct tool-purpose
  sentence, workbench/login actions, a compact preview-state table, and the
  real Workbench V2 screenshot.
- Public route links now mirror the V2 IA: `Workbench V2`, `Report V2`,
  and `Login`.
- The route section is a compact operational list rather than a marketing
  feature grid.
- Copy was kept utility-focused: no slogans, gradients, broad claims, or
  promotional filler.

Additional validation:

- `pnpm exec eslint app/page.tsx` passes.
- `git diff --check -- apps/web/app/page.tsx` passes.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Production preview for this pass is running at `http://localhost:3015`.
- Playwright production screenshots were captured for public `/` desktop
  and mobile, with no console warnings or errors.
- `pnpm --filter @dynecho/web typecheck` still fails on pre-existing legacy
  `features/workbench/*.test.ts` type errors; this pass did not edit those
  files.

Landed in the third frontend-only pass:

- Report V2 assistant actions now create reviewable local proposals instead
  of mutating the report draft immediately.
- Proposal cards show target section, proposed text, compare disclosure,
  and explicit accept/reject actions.
- Accepted proposals update the manual edit fields and live preview;
  rejected proposals leave the draft unchanged.
- Free-form assistant requests queue a reviewer-notes proposal rather than
  writing directly into the report.
- Report V2 now includes a compact outline summary for result, assessment,
  assumptions, and notes.
- Report V2 mobile now uses `Edit`, `Preview`, and `Assistant` tabs so the
  publication workflow is not a squeezed desktop stack.

Additional validation:

- `pnpm exec eslint features/report-v2/report-v2-shell.tsx` passes.
- `git diff --check -- apps/web/features/report-v2/report-v2-shell.tsx`
  passes.
- Playwright verified proposal queue, accept, reject, and free-form
  proposal flows on `http://localhost:3012/report-v2`.
- Playwright screenshots were captured for Report V2 desktop proposal
  state and mobile `Assistant` / `Preview` tabs.
- `pnpm --filter @dynecho/web build` currently fails on an unrelated
  engine type error in
  `packages/engine/src/dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor.ts`;
  this pass did not edit engine files.
- `pnpm --filter @dynecho/web typecheck` still fails on pre-existing
  legacy `features/workbench/*.test.ts` errors plus the unrelated engine
  type error above; Report V2 has no reported focused lint or whitespace
  issues.

Landed in the second frontend-only pass:

- Workbench V2 required-input handling now combines local UI blockers with
  engine `missingPhysicalInputs` boundaries when the existing estimate API
  returns them.
- Route-specific context inputs are now hidden by default and appear only
  for selected airborne field/building, impact field, or floor-impact
  output needs.
- Context input forwarding stays inside the existing estimate request
  surface; no endpoint, shared schema, or calculator logic changed.
- Layer editing now keeps a selected row state across add, duplicate, and
  remove actions.
- Workbench V2 now renders a compact construction stack diagram tied to
  the visible layer rows.
- Result inspection now includes supporting selected outputs, stopped
  outputs, concise warnings, a compact curve view, and route detail behind
  disclosure.

Additional validation:

- `pnpm exec eslint features/workbench-v2/workbench-v2-shell.tsx` passes.
- `git diff --check -- apps/web/features/workbench-v2/workbench-v2-shell.tsx`
  passes.
- `pnpm --filter @dynecho/web build` passes with the existing optional
  `sharp/@img` warnings from the proposal DOCX dependency path.
- Latest production preview is running at `http://localhost:3014`.
- Playwright production screenshots were captured for Workbench V2 desktop,
  Workbench V2 mobile setup/stack/result tabs, and Report V2.
- `pnpm --filter @dynecho/web typecheck` still fails only on pre-existing
  legacy `features/workbench/*.test.ts` type errors; Workbench V2 has no
  reported type errors.

Landed in the first frontend-only pass:

- Public `/` page simplified into a concrete product overview with a real
  Workbench V2 screenshot and direct V2 links.
- Authenticated `/workbench-v2` staging route added.
- Workbench V2 now has a reduced setup/sidebar, layer stack editor,
  selected-output controls, existing `/api/estimate` adapter, result
  inspector, concise stopped-output handling, and report link.
- Authenticated `/report-v2` staging route added with manual edit,
  preview, and local assistant draft actions.
- Root layout now includes the Next.js `data-scroll-behavior` attribute
  needed to keep route-transition console warnings clean.

Validation:

- Focused ESLint passes for the new/changed frontend files.
- Focused whitespace guard passes for the new/changed frontend files.
- Playwright desktop/mobile screenshots were captured for `/`,
  `/workbench-v2`, and `/report-v2`.
- `pnpm --filter @dynecho/web typecheck` still fails on pre-existing
  legacy `features/workbench/*.test.ts` type errors; no V2 route or V2
  shell type errors remain.

## Hard Scope Boundary

This is a UI refactor only.

Allowed edit areas:

- `apps/web/app`
- `apps/web/components`
- `apps/web/features/workbench`
- `apps/web/public`
- `apps/web/app/globals.css`
- `packages/ui` only for reusable visual primitives, if a repeated UI
  primitive genuinely belongs there
- `docs/ui`

Read-only areas unless the user explicitly approves a separate backend or
engine slice:

- `packages/engine`
- `packages/shared`
- `packages/catalogs`
- `apps/web/app/api`
- `apps/web/lib/auth*`
- `apps/web/lib/server-project-storage*`
- endpoint contracts, request/response schemas, calculator result shapes,
  resolver logic, formulas, source data, route ownership, persistence
  semantics, and report-generation server behavior

Coordination rule for parallel agents:

- Other agents may be working on calculator scope/accuracy. Do not edit,
  format, or "clean up" their files.
- Do not resolve unrelated git changes.
- Do not run broad mechanical formatters that rewrite calculator, shared,
  catalog, API, or docs outside this plan.
- Before every implementation slice, check `git status --short` and keep
  the diff restricted to the UI files selected for that slice.

## User Direction

The current UI is considered unacceptable because it is crowded,
text-heavy, hard to understand, and operationally inefficient. The refactor
must optimize for simplicity and usability before visual novelty.

The product owner direction is explicit:

- The inside of the application is an engineering tool, not a marketing
  site.
- The public no-login page may have a promotional/product-introduction
  role. The logged-in tool must not.
- Do not use decorative gradients, color transitions, loud slogan blocks,
  attention-grabbing visual effects, or decorative panels to make the app
  feel "designed".
- Do not add text unless it helps the user complete the task on that
  screen.
- Every visible element must have a job. If its purpose cannot be stated
  in one sentence, remove it or move it behind an advanced/detail
  disclosure.
- The default user should always know:
  - where to choose wall/floor
  - where to enter layers
  - where to enter missing required inputs
  - where to read the result
  - where to open the report editor
- The UI should feel calm, direct, and professional. It should not feel
  like a generic SaaS landing page, dashboard template, or experimental
  visual demo.

This direction overrides generic visual polish. A simpler screen that is
obvious and fast is better than a more decorative screen that looks
impressive in isolation.

## Product Goal

DynEcho needs four clear surfaces:

1. Public product page
   - Visible without login.
   - Explains what the calculator does, who it is for, and shows a compact
     example of layer input and acoustic output.
   - Primary action is login or open preview when preview mode is enabled.
   - This is the only surface allowed to use marketing-style positioning,
     and even there the copy must stay concrete and product-led.

2. Login page
   - Already acceptable.
   - Should remain simple and stable.
   - Only small visual alignment updates are allowed if needed for global
     consistency.

3. Calculator workbench
   - Main product surface.
   - User chooses wall or floor, requested outputs, layers, and only the
     physical/context inputs required for the chosen route.
   - UI shows construction stack, diagram, result values, charts, and exact
     stopped-output guidance.
   - Missing-input messages must be short and actionable, for example:
     `L'nT,50 needs CI,50-2500`.

4. Report edit page
   - Separate from the calculator workbench.
   - Shows report preview, manual edits, and report assistant chat.
   - Manual editing remains first-class; assistant edits are proposed and
     inspectable, not invisible magic.

The core simplification: workbench is for calculating. Report edit is for
publication. Diagnostic and assistant surfaces must not crowd the main
calculator workspace.

## Current UI Problems

Observed in the current `/workbench` desktop and mobile screenshots:

- The first screen is too dense. Setup, route status, input map, assembly,
  results, review actions, warnings, and report actions compete at the same
  visual level.
- The interface asks the user to read too much before they can act.
- The user starts in setup complexity instead of the core loop: choose
  route, build stack, see result.
- Rare expert surfaces, such as opening/leak composite inputs, appear too
  early and occupy primary screen space.
- Long explanatory text is used where short labels and state messages would
  work better.
- Paragraphs and helper text create visual noise and make the important
  controls harder to find.
- Result cards contain a strong primary value, but surrounding chips,
  nested details, review actions, and warnings dilute the answer.
- Desktop uses too many bordered regions. Everything looks equally
  important.
- Mobile is more navigable, but layer rows are tall and action-heavy.
- Report/proposal controls live too close to calculation controls.
- Advanced trace/debug content is visible as product UI instead of being
  opt-in.
- Many visible objects do not earn their space. The redesign must remove
  rather than rearrange this clutter.

## Refactor Principles

- Keep the calculator brain intact. The UI reads existing outputs and calls
  existing endpoints.
- Show one job per screen region.
- Prefer labels, numbers, and direct state over paragraphs.
- Prefer removing UI over compressing UI. If a region is not needed for the
  current task, hide it, defer it, or move it to a detail surface.
- Default to "normal operator" mode. Put expert fields behind clear
  disclosure or route-specific drawers.
- Do not hide stopped outputs. Show them as concise `needs input` or
  `unsupported` items near the result they affect.
- Make the first viewport useful without scrolling.
- Use cards only for actual repeated items, result objects, modals, and
  edit panels. Avoid card-inside-card structures.
- Keep debug traces, method dossiers, and raw resolver detail out of the
  main path.
- Design mobile as a stepper/workflow, not a squeezed desktop grid.
- Preserve accessibility: semantic headings, form labels, keyboard
  navigation, focus states, and non-color status cues.

## Non-Goals

The refactor must not become:

- a marketing redesign of the logged-in application
- a color/gradient/theme pass
- a decorative dashboard
- a slogan/copywriting pass
- a component-library rebuild
- a report-polish project inside the calculator workbench
- an attempt to expose every engine trace in the default UI
- a workaround for missing calculator/backend behavior

If a proposed UI change does not make the tool easier to understand or use,
it is out of scope.

## Proposed Route Structure

Target route model:

- `/`
  - Public product page.
  - No calculator editing.
  - Short product explanation, example stack, example output, login CTA.

- `/login`
  - Existing login flow.
  - Keep behavior unchanged.

- `/workbench`
  - New simplified calculator workbench.
  - Calls existing `/api/estimate` and `/api/impact-only`.
  - Does not include report assistant chat.
  - Can link to report edit once a report snapshot exists.

- `/workbench?view=advanced`
  - Temporary legacy/operator surface during migration, or keep as a
    protected advanced mode after V2 is stable.
  - Do not delete until the simplified workbench has parity for core tasks.

- `/workbench/proposal`
  - Existing report preview route can remain during migration.
  - Long term, this becomes or redirects to the report edit surface.

- `/workbench/proposal/configure`
  - Existing report adjustment route.
  - Long term, this is the report edit page with preview, manual edits, and
    assistant.

Optional migration route:

- `/workbench-v2`
  - Safe staging route for the new UI shell.
  - Uses existing API calls and store adapters.
  - Promoted to `/workbench` only after visual and behavioral acceptance.

## Workbench V2 Information Architecture

Core workbench contract:

- The workbench is not a report page.
- The workbench is not a methodology document.
- The workbench is not a dashboard of every available diagnostic.
- The workbench is a calculator input/result surface.

Default visible content:

- route mode
- requested outputs
- layer stack
- required input tasks
- construction diagram
- primary result
- stopped outputs
- concise warnings
- link/action to report edit

Default hidden or deferred content:

- long method explanations
- resolver traces
- candidate details
- report assistant
- report prose editing
- source/citation detail
- advanced expert fields not required by the current route
- rarely used opening/leak or field/basis controls unless they are required
  for the selected output

Desktop layout:

- Header
  - Project/session identity, route mode, save/report actions.
  - No long copy.

- Left rail: input workflow
  - Route: wall or floor.
  - Outputs: requested metrics.
  - Layers: stack editor entry points.
  - Required inputs: only currently blocking fields.
  - Optional/expert fields: collapsed.

- Center workspace
  - Layer stack editor.
  - Construction diagram.
  - Selected row editor.
  - Add/reorder/duplicate/remove layer actions.

- Right result inspector
  - Primary result value.
  - Supporting metrics.
  - Missing-input or unsupported list.
  - Small chart/curve area when available.
  - "Open report" action when ready.

Mobile layout:

- Step tabs or bottom-safe segmented control:
  - Setup
  - Stack
  - Result
  - Report
- Each step fills the screen.
- Result step starts with the primary value and missing-input list.
- Layer row actions collapse behind an action menu or compact icon row.

## Workbench V2 User Flow

1. Select route
   - `Wall` or `Floor`.
   - Context choices appear only after route is known.

2. Select desired outputs
   - Default output set is sensible for the route.
   - User can add/remove outputs.
   - Output selection should drive required input prompts.

3. Build layer stack
   - Add layer from material picker.
   - Enter thickness.
   - Assign role only when the route needs it.
   - Reorder and duplicate should be obvious but visually quiet.

4. Fill required inputs
   - Required inputs appear as a short task list.
   - Each task names the affected output.
   - No long explanatory paragraphs in the main flow.

5. Review results
   - Primary metric is large.
   - Supporting metrics are compact.
   - Stopped outputs are visible and actionable.
   - Charts are secondary and only shown when they add value.

6. Create or edit report
   - Workbench produces or opens a report snapshot.
   - Report editing happens on the report page.

## Report Edit IA

Report edit page layout:

- Left: report outline and editable fields
  - Client/project metadata.
  - Executive summary.
  - Assembly/layer schedule.
  - Result table.
  - Notes, assumptions, limitations.

- Center: live report preview
  - PDF-like page preview.
  - Shows final issue state.
  - Manual edits are visible immediately.

- Right: assistant panel
  - Chat with report assistant.
  - Suggested edits appear as reviewable patches.
  - User can accept/reject each patch.
  - Assistant must not mutate calculator inputs or engine results.

Report edit rules:

- Manual edit always wins over generated text.
- Assistant edits are report-content edits only.
- Calculator outputs can be quoted or formatted, but not recalculated.
- If a result is stopped as `needs_input` or `unsupported`, the report must
  not turn it into a numeric answer.

## Public Page Direction

The public page should be a real product introduction, not a generic SaaS
landing page.

This is the only route where promotional framing is acceptable. Even here,
the page should sell the product by showing what it does, not by using
abstract slogans, decorative gradients, or empty claims.

Content:

- DynEcho name and one direct promise:
  - acoustic calculation from real construction layers
- Small example:
  - wall/floor layer stack
  - requested outputs
  - result value and missing-input example
- Explain calculator boundaries:
  - exact/source-backed where owned
  - formula/anchor where defensible
  - `needs input` when physics is missing
- CTA:
  - login
  - open workbench preview if auth is not configured locally

Design:

- Strong first-viewport product signal.
- Use actual product UI preview or generated construction/diagram visual,
  not abstract marketing shapes.
- Short copy.
- No big feature-card grid.
- No generic gradient hero.
- No slogan-first composition.
- The visual should make the calculator easier to understand.

Public page acceptance check:

- A visitor understands within five seconds that DynEcho calculates acoustic
  performance from wall/floor layer constructions.
- The page points clearly to login/preview.
- The page does not imply calculator capabilities beyond what the app
  actually exposes.
- Product screenshots/examples use real or representative calculator states,
  not fake decorative dashboards.

## Component Strategy

Create V2 components beside the current workbench first. Avoid rewriting
the legacy shell in place until the new flow is proven.

Suggested component tree:

- `apps/web/features/workbench-v2/workbench-v2-shell.tsx`
- `apps/web/features/workbench-v2/workbench-v2-store-adapter.ts`
- `apps/web/features/workbench-v2/route-step.tsx`
- `apps/web/features/workbench-v2/output-picker.tsx`
- `apps/web/features/workbench-v2/layer-stack-editor.tsx`
- `apps/web/features/workbench-v2/layer-row.tsx`
- `apps/web/features/workbench-v2/required-input-list.tsx`
- `apps/web/features/workbench-v2/result-inspector.tsx`
- `apps/web/features/workbench-v2/result-metric-card.tsx`
- `apps/web/features/workbench-v2/construction-diagram.tsx`
- `apps/web/features/report-edit/report-edit-shell.tsx`
- `apps/web/features/report-edit/report-outline.tsx`
- `apps/web/features/report-edit/report-preview.tsx`
- `apps/web/features/report-edit/report-assistant-panel.tsx`
- `apps/web/features/report-edit/report-edit-state.ts`

Shared visual primitives may move to `packages/ui` only after two or more
V2 surfaces need the same primitive. Do not prematurely generalize.

## State And Data Boundary

Workbench V2 should consume existing data through adapters:

- Existing local workbench store can be read and written through a small UI
  adapter.
- API calls remain existing calls.
- Engine result payloads are projected into smaller view models for display.
- View models must not infer unsupported acoustic outputs.
- Required-input UI must come from existing missing/stopped state where
  available.

Do not change:

- endpoint URLs
- request payload structure
- response payload structure
- calculator target-output semantics
- project persistence format
- report generation server routes

## Copy Rules

Delete most explanatory text from the main workbench.

Main workbench text budget:

- Section heading: 1-3 words.
- Field label: 1-4 words where practical.
- Status or missing-input message: one short sentence max.
- Helper text: avoid by default; if necessary, one line only.
- Methodology, caveats, route explanations, and long reasoning: never in
  the default first viewport.

Allowed main-surface copy:

- labels
- values
- statuses
- direct missing-input instructions
- one-line section hints where necessary
- terse button labels such as `Add layer`, `Calculate`, `Open report`

Avoid:

- methodology paragraphs
- repeated "this route uses..." descriptions
- confidence prose
- marketing language inside the calculator
- helper text under every field
- slogan-style text
- abstract value propositions
- explanatory paragraphs beside routine controls
- duplicate labels that repeat the same state in multiple regions

Long text belongs in:

- report preview
- diagnostics drawer
- method detail drawer
- docs/help, not the first viewport

Examples:

- Good: `L'nT,50 needs CI,50-2500`
- Good: `4 live layers`
- Good: `Rw 57 dB`
- Good: `Missing thickness`
- Good: `Unsupported: ASTM owner absent`
- Bad: `Weighted airborne element rating from the active airborne calculator.`
- Bad: `Every visible row contributes to the active read.`
- Bad: `Unlock the power of acoustic intelligence.`
- Bad: `This advanced engineering workflow empowers confident design decisions.`

Copy acceptance check:

- A user scanning only headings, labels, numbers, and status messages must
  understand the screen.
- If deleting a sentence does not remove a required user action or required
  warning, delete it.
- If the same state appears in two places, keep the clearer one and remove
  the duplicate.

## Visual System

Tone:

- quiet engineering workspace
- dense but readable
- low border count
- strong numeric hierarchy
- limited accent color
- utilitarian, not promotional
- precise, not decorative

Layout rules:

- First viewport shows stack and primary result.
- Do not make setup the dominant desktop column.
- Avoid nested cards.
- Use dividers and spacing before borders.
- Make action buttons compact and icon-led where familiar.
- Keep text within containers on mobile and desktop.
- Every region must have one primary job.
- Secondary regions must be visually quieter than the stack editor and
  result inspector.
- Required inputs should appear as tasks, not as a large always-open form
  dump.

Visual prohibitions for logged-in app surfaces:

- no decorative gradients
- no gradient orbs, blobs, bokeh, aurora backgrounds, or ornamental glows
- no loud color transitions for attention
- no marketing hero sections inside `/workbench`
- no generic SaaS card mosaics
- no decorative illustration that does not explain the construction or
  report state
- no card-inside-card layouts
- no thick border around every region
- no large slogan panels
- no animated decoration unrelated to an interaction

Allowed visual emphasis:

- strong primary metric type
- clear construction diagram
- restrained status color for `Live`, `Needs input`, `Unsupported`, and
  `Warning`
- whitespace, alignment, and grouping
- icons that improve action recognition

Status language:

- `Live`
- `Needs input`
- `Unsupported`
- `Warning`
- `Exact`
- `Formula`
- `Anchor`

Each status needs text and shape/icon treatment, not color alone.

Visual acceptance check:

- The stack editor and primary result must be the two strongest elements in
  the workbench first viewport.
- The user must be able to point to the next action without reading a
  paragraph.
- Removing decorative styling should not change whether the screen works.
- Any visible panel that does not directly support setup, stack editing,
  required inputs, results, or report opening should be removed or moved
  behind an advanced/detail control.

## Accessibility And Interaction

Minimum requirements:

- All inputs have labels.
- All icon buttons have accessible names.
- Focus ring remains visible.
- Keyboard can add layers, move through fields, and open result/report.
- Required-input items link or scroll to their field where feasible.
- Mobile hit targets remain at least 44px.
- Reduced-motion users should not rely on animations.

## Testing Plan

Do not use calculator gate for pure UI shell changes unless calculator
surface projection semantics move. Prefer targeted UI checks:

- `pnpm --filter @dynecho/web typecheck`
- focused Vitest files for changed UI view models/components
- Playwright screenshots for:
  - `/`
  - `/login`
  - `/workbench` or `/workbench-v2`
  - report edit route
  - desktop 1440x1000
  - tablet 900x1000
  - mobile 390x844
- Manual smoke:
  - add layer
  - edit thickness
  - switch wall/floor
  - request output with missing input
  - see stopped output
  - open report edit
  - manual report edit
  - assistant suggestion shown as reviewable change

Acceptance screenshots should be saved under:

- `output/playwright/ui-refactor/`

## Roadmap

This roadmap is the intended execution order. Do not jump to report
assistant polish, advanced diagnostics, or visual theme work before the
core calculator path is simple and usable.

### Roadmap Step 0 - Protect The Boundary

Purpose: make the UI refactor safe while other agents work on calculator
scope/accuracy.

Do first:

- Re-read the hard scope boundary in this plan.
- Check `git status --short`.
- Identify unrelated changed files and leave them alone.
- Confirm the slice touches only UI files.
- Decide whether the next implementation happens behind `/workbench-v2`
  or in existing `/workbench` UI files.

Exit criteria:

- No engine, shared schema, catalog, API route, auth, storage, or endpoint
  file is in the intended diff.
- The slice can be reverted without affecting calculator behavior.

### Roadmap Step 1 - Route And Product IA

Purpose: establish the four-screen product shape before rebuilding
components.

Order:

1. Keep `/login` behavior stable.
2. Keep `/` as the public product-introduction page.
3. Add or reserve `/workbench-v2` as the simplified calculator staging
   route.
4. Keep current `/workbench?view=advanced` available for legacy/operator
   parity during migration.
5. Identify the report edit destination, using the existing proposal
   routes where practical.

Exit criteria:

- The app has a clear route map: public page, login, workbench, report edit.
- No logged-in calculator surface reads like a marketing page.
- No backend route changes are required.

### Roadmap Step 2 - Workbench V2 Skeleton

Purpose: create the simplified workbench frame without solving every
control yet.

Build:

- app/session header
- route/output area
- layer stack workspace placeholder
- result inspector placeholder
- required-input task area placeholder
- report edit link placeholder
- mobile step navigation

Do not build yet:

- assistant
- long diagnostics
- full report preview
- advanced resolver trace
- all rare expert input panels

Exit criteria:

- First viewport clearly shows where inputs go and where results will
  appear.
- No long paragraphs are present.
- Desktop and mobile screenshots show no layout collapse.

### Roadmap Step 3 - UI Read Model Adapter

Purpose: connect existing workbench/API/result state to V2 without
changing contracts.

Build UI-only adapters for:

- selected route mode
- requested outputs
- layer rows
- active missing inputs
- primary result
- supporting results
- stopped outputs
- warnings
- chart availability

Rules:

- Use existing store/API payloads.
- Do not alter request or response shapes.
- Do not infer unsupported acoustic outputs.
- Do not hide `needs_input` or `unsupported`.

Exit criteria:

- Same user input produces the same existing estimate/impact API calls.
- V2 can render a real result payload.
- Stopped outputs are visible in the V2 model.

### Roadmap Step 4 - Layer Stack Editor

Purpose: make the core construction-entry workflow usable.

Build:

- compact material selector
- thickness input
- role input only when route needs it
- add layer
- duplicate layer
- remove layer
- reorder layer
- selected row edit state
- construction diagram tied to rows

Remove or defer:

- always-open advanced physical overrides
- verbose row helper text
- oversized per-row action clusters on mobile
- repeated state labels

Exit criteria:

- A user can build a wall or floor stack without reading helper
  paragraphs.
- Layer rows are compact and scannable.
- The construction diagram helps understand the stack, not decorate it.

### Roadmap Step 5 - Required Inputs And Output Selection

Purpose: turn missing physics into a short task list.

Build:

- output picker for requested metrics
- required-input task list
- direct link/focus from task to field where feasible
- route-specific input fields shown only when needed
- optional/expert input disclosure

Rules:

- Required fields are tasks, not a form dump.
- Rare expert controls stay hidden until route/output selection needs
  them.
- Missing-input copy stays short.

Exit criteria:

- User can see exactly what blocks a requested output.
- Workbench does not show opening/leak, field, or advanced panels by
  default unless required.
- No methodology paragraphs appear in the main input path.

### Roadmap Step 6 - Result Inspector

Purpose: make the answer clear, dominant, and honest.

Build:

- primary metric card
- supporting metric list
- stopped-output list
- concise warning list
- compact chart/curve area when available
- route/source/method detail behind disclosure
- action to open report edit

Rules:

- Primary value is visually dominant.
- Supporting metrics do not compete with the primary value.
- `needs_input` and `unsupported` remain visible.
- Long method/candidate detail is opt-in.

Exit criteria:

- User can identify the main answer in under five seconds.
- User can identify what is missing or unsupported without opening
  diagnostics.
- Result area contains no marketing or explanatory filler.

### Roadmap Step 7 - Report Edit Surface

Purpose: move publication work out of the calculator workspace.

Build:

- report outline
- manual edit fields
- live report preview
- assistant panel
- reviewable assistant patch proposal UI
- accept/reject flow for assistant changes

Rules:

- Assistant edits report content only.
- Manual edits remain first-class.
- Calculator inputs and engine results are not mutated here.
- Stopped outputs do not become numeric report answers.

Exit criteria:

- User can edit report text manually.
- User can ask assistant for report edits and review proposed changes.
- Workbench remains focused on calculation rather than report prose.

### Roadmap Step 8 - Public Page Pass

Purpose: make the no-login page explain the product without infecting the
tool UI with marketing language.

Build or revise:

- direct DynEcho product statement
- compact example stack
- example result and missing-input state
- login/preview CTA
- real or representative product visual

Rules:

- Public page may be promotional, but must stay concrete.
- No fake capability claims.
- No generic gradient hero or slogan-first composition.

Exit criteria:

- Visitor understands the product quickly.
- Logged-in workbench remains visually and verbally utilitarian.

### Roadmap Step 9 - Promotion And Legacy Retirement

Purpose: make V2 default only after the core workflow is proven.

Do:

- compare legacy and V2 for common wall/floor workflows
- run focused UI tests
- capture desktop/tablet/mobile screenshots
- promote V2 to `/workbench`
- keep or remove legacy advanced path based on usage and parity
- remove unused UI code only after route/test audit

Exit criteria:

- `/workbench` is the simplified engineering tool.
- Advanced/debug surfaces are opt-in.
- Public page, login, workbench, and report edit have distinct jobs.
- No calculator/backend/API/schema behavior changed.

## Implementation Phases

### Phase 0 - Freeze The Boundary

Goal: prevent frontend work from drifting into calculator/backend work.

Tasks:

- Add this plan.
- Confirm owners agree that engine/backend/API/schema are read-only.
- Stop applying partial cosmetic patches to legacy workbench unless they
  unblock V2 migration.

Acceptance:

- New UI work references this plan.
- Diffs stay out of read-only areas.

### Phase 1 - Product IA And Route Shells

Goal: create route-level skeletons without changing behavior.

Tasks:

- Keep `/login` stable.
- Review public `/` content and reduce it to product-introduction purpose.
- Create staging route for V2 workbench, preferably `/workbench-v2`.
- Create or identify report-edit route target.
- Add placeholder layout shells using static mock data only where needed.

Acceptance:

- Routes render.
- No endpoint or engine changes.
- No calculator result claims are made from mock data in production paths.

### Phase 2 - Workbench V2 Read Model

Goal: project existing store/API/result data into a clean UI model.

Tasks:

- Build a V2 adapter around existing workbench state.
- Build result view model:
  - primary metric
  - supporting metrics
  - stopped outputs
  - warnings
  - chart availability
- Build required-input view model from existing stopped/missing data.

Acceptance:

- Same input produces same API result as legacy workbench.
- V2 view model does not invent outputs.
- Stopped outputs remain visible.

### Phase 3 - Workbench V2 Main UI

Goal: ship the simplified calculator workspace.

Tasks:

- Build route/output step.
- Build layer stack editor.
- Build construction diagram.
- Build required-input list.
- Build result inspector.
- Add responsive behavior.

Acceptance:

- First desktop viewport shows stack and primary result.
- Mobile flow is usable without horizontal scrolling.
- Long diagnostic text is absent from the main path.
- Required missing inputs are short and actionable.

### Phase 4 - Report Edit UI

Goal: separate report editing from calculation.

Tasks:

- Build report preview layout.
- Build manual edit panels.
- Place assistant in a right-side panel or mobile drawer.
- Make assistant edits reviewable.
- Keep calculator input/result immutable from report assistant actions.

Acceptance:

- Manual edits update preview.
- Assistant can propose visible changes.
- User can accept/reject proposals.
- No report edit action changes calculator route, layers, or engine result.

### Phase 5 - Promotion And Legacy Cleanup

Goal: make V2 the default workbench only after parity.

Tasks:

- Compare legacy and V2 core workflows.
- Run screenshot and UI tests.
- Promote V2 to `/workbench`.
- Keep legacy advanced route if still useful.
- Delete only UI code proven unused by tests and route audit.

Acceptance:

- `/workbench` is simplified V2.
- Advanced/debug remains opt-in.
- No calculator/backend diffs were introduced.

## Slice Rules For Future Agents

Each frontend slice must state:

- route/page being changed
- UI problem being solved
- files expected to change
- explicit confirmation that engine/backend/API/schema remain untouched
- screenshots or tests used for validation

Do not accept a slice if it says:

- "while I am here, clean up engine/shared types"
- "adjust API payload for UI convenience"
- "rename output ids"
- "simplify calculator route logic"
- "hide unsupported results because they look noisy"

## Definition Of Done

Frontend refactor is successful when:

- Public page explains the product without login.
- Login remains stable.
- Workbench first viewport is understandable in five seconds.
- Workbench reads as an engineering tool, not a marketing page.
- User can build a wall/floor stack without reading long helper text.
- Missing inputs are visible as direct tasks.
- Result values are visually dominant and not buried.
- Every persistent control or panel has an obvious task purpose.
- Decorative gradients, slogan blocks, and attention-seeking visuals are
  absent from logged-in app surfaces.
- Long explanatory paragraphs are absent from the default workbench path.
- Report edit is a separate surface with preview, manual edit, and
  assistant.
- Advanced diagnostics are opt-in.
- Desktop and mobile screenshots show no text overlap or clipped critical
  controls.
- No engine, backend, endpoint, schema, or calculator behavior changed.
