# DynEcho UI Rebuild Master Plan - 2026-06-05

Document role: single binding UI rebuild plan. This document replaces the
previous June 5 UI refactor/reset plans for new frontend work.

The current Workbench V2 visual implementation is rejected. Do not continue
polishing it. Rebuild the product UI from a clean frontend direction while
preserving calculator behavior and the original PDF output.

## Latest User Direction - 2026-06-05

All UI/UX is being restarted from scratch.

Current open polish plan:
`docs/ui/DYNECHO_UI_REBUILD_PHASE_9_PROFESSIONAL_POLISH_PLAN_2026-06-05.md`.
This plan captures the remaining professional-quality gap after the first
calculator/report rebuild passes. The first selected polish slice is calculator
layer-row alignment, including the user-reported issue where material, role,
thickness, and action controls do not share a professional desktop grid or
vertical baseline. The same plan also carries newer user feedback for the DAC
brand mark, simple PDF/report presentation audit, response graph data-integrity
audit, reversible matte background tokens, sign-in routing to `/workbench-v2`,
and a visible report-assistant response area.

The new UI must keep and improve only these established product visuals:

1. Response graph visual
   - Baseline: the log-spaced band curve view shown in the user's reference.
   - Code reference to start from:
     `apps/web/features/workbench/response-curve-figure-card.tsx`.
   - Supporting model reference:
     `apps/web/features/workbench/response-curve-model.ts`.
   - Keep the low/speech/high band idea, axes, curve, points, and engineering
     readability.
   - Improve the visual polish, spacing, typography, contrast, and
     professional chart treatment.

2. Layer illustration visual
   - Baseline: the older wall/floor section preview with technical layer
     schedule shown in the user's reference.
   - Code references to start from:
     `apps/web/features/workbench/simple-workbench-layer-diagram.tsx`,
     `apps/web/features/workbench/simple-workbench-illustration.ts`, and
     `apps/web/features/workbench/simple-workbench-proposal-construction-figure.tsx`.
   - Keep the idea of a real construction-section illustration and technical
     layer schedule.
   - Improve it into a more professional, modern, readable engineering
     diagram.

3. Proposal/PDF output content
   - Baseline: the older accepted PDF/proposal output shown in the user's
     references, including the proposal content, response curve, indices,
     visible layer schedule, and report structure.
   - Code references that must be protected:
     `apps/web/features/workbench/simple-workbench-proposal.ts`,
     `apps/web/features/workbench/simple-workbench-proposal-simple.ts`,
     `apps/web/features/workbench/simple-workbench-proposal-pdf-server.ts`,
     `apps/web/features/workbench/simple-workbench-proposal-docx-server.ts`,
     and `apps/web/app/api/proposal-pdf/route.ts`.
   - The web proposal page may be redesigned.
   - The generated/exported PDF output must remain the same baseline unless
     the user explicitly opens a PDF-output task.

## Product Shape

DynEcho is an engineering calculator tool, not a marketing website.

The product has three primary surfaces plus the existing login gate:

1. Public intro
   - Route: `/`.
   - Auth: public.
   - Job: show the product, explain the tool briefly, and route users to
     login/calculator.
   - Tone: this is the only surface that may be visual, promotional, and
     showy.
   - It may use images, preview visuals, and stronger product presentation.
   - It must still stay concise; no slogan wall, fake dashboard, or noisy
     ornament.

2. Calculator workbench
   - Route: authenticated calculator route, staged route can remain
     `/workbench-v2` until promotion is approved.
   - Auth: required.
   - Job: collect inputs, define the layer stack, request outputs, show
     calculation state, show blockers, and hand off to report preparation.
   - This is the core product surface. It must feel like a usable engineering
     tool.
   - It must show the improved response graph and improved layer
     illustration.
   - Desktop/PC experience is the primary quality target.
   - No advertising copy, slogan content, or sales-oriented explanation.

3. Report editor
   - Route: authenticated report editing surface.
   - Auth: required.
   - Job: preview report content, allow manual edits, and host the assistant
     that proposes report edits.
   - Assistant edits are proposed and reviewed. They must not silently mutate
     calculator inputs, output values, engine behavior, or PDF output.
   - The page can be new. The PDF output content must remain the old accepted
     baseline.
   - Desktop/PC experience is the primary quality target.
   - No advertising copy, slogan content, or sales-oriented explanation.

4. Login
   - Route: `/login`.
   - Current login is acceptable unless explicitly selected.

## Absolute Scope Rules

- Frontend UI only unless the user explicitly selects another scope.
- Do not change calculator engine behavior.
- Do not change endpoint contracts.
- Do not change shared schemas.
- Do not change auth or storage behavior unless explicitly selected.
- Do not change calculation output values.
- Do not interfere with other agents working on calculator/backend files.
- Current failed UI surfaces are not a style baseline.
- Reuse behavior and data contracts where useful; do not reuse the failed
  visual language.
- Do not reuse old UI components for the new rebuild unless they are part of
  the protected exceptions below.

Allowed legacy exceptions:

- PDF output builders/renderers/export path;
- response graph source, to be improved;
- layer illustration source, to be improved.

Everything else in the new public intro, calculator workbench, and report
editor should be rebuilt from the new central style system and purpose-built
components.

## User Rule Coverage

This document must keep the user's operating rules visible before any
implementation slice starts:

- three primary product pages are required: public intro, calculator
  workbench, and report editor, plus the existing login gate;
- the public intro is the only page that may behave like promotion or product
  showcase;
- the calculator and report editor are engineering-tool surfaces, not
  marketing pages;
- simplicity, usability, consistency, and clear purpose are the design goals;
- every visible element must improve use, function, decision-making, or
  engineering clarity;
- central styling in `apps/web/app/globals.css` is required so palette,
  spacing, controls, state colors, and light/dark themes can be changed from
  one place;
- old failed UI shell/components must not be used as the rebuild baseline;
- the only legacy UI/code exceptions are protected PDF output, protected
  response graph source/wrapper, and protected layer illustration
  source/wrapper;
- generated/exported PDF output must stay on the oldest accepted baseline;
- backend, engine, endpoint contracts, schemas, auth behavior, storage
  behavior, and calculation values are out of scope;
- other agents may be working in backend/calculator areas, so UI work must not
  touch or revert unrelated files.

## PDF Rule: Output, Not Page

This distinction is binding:

- PDF output means the generated/exported PDF document/file: layout,
  typography, cover, sections, layer figure, tables, values, copy, spacing,
  and renderer behavior.
- PDF page means the web UI route used to preview, configure, package, or
  export the PDF.

The rebuild may change web UI pages, buttons, and navigation around report
preparation. The rebuild must not redesign the PDF output.

The PDF output must remain the oldest accepted/original PDF output baseline.
Do not alter proposal PDF renderer code, PDF export API, proposal document
templates, generated values, generated report text, or printed layer figure
unless the user explicitly starts a separate PDF-output task.

If the PDF flow is broken during UI rebuild, fix only the handoff:

- package the existing proposal snapshot correctly;
- navigate to the existing preview/export route correctly;
- preserve stored proposal snapshot compatibility;
- do not redesign the exported PDF file.

## Visual Direction

The UI must be rebuilt as a quiet, modern engineering tool:

- simple;
- clean;
- usable;
- consistent;
- purpose-driven;
- short labels over long explanations;
- obvious hierarchy;
- no random panels;
- no nested card stacks;
- no decorative gradients;
- no slogan-heavy blocks inside tool pages;
- no old cluttered table/panel look;
- no fake marketing dashboard composition.

Public intro can have stronger product presence and visual assets. That is
the only surface where promotional presentation is allowed. The calculator
and report editor must be operational engineering-tool surfaces, not
advertisements.

Desktop/PC priority:

- The calculator and report editor must look professional on desktop first.
- They should feel like serious engineering software: precise, controlled,
  scannable, and efficient.
- Mobile support is secondary. Mobile must not be broken, clipped, or
  impossible to use, but the product quality bar is desktop-first.

Advertising/copy boundary:

- Public intro may explain and sell the product.
- Calculator workbench may only use utility copy: labels, values, states,
  blockers, and direct actions.
- Report editor may only use utility copy: field labels, edit status,
  assistant actions, preview/export state, and validation messages.
- Do not add campaign-style headlines, slogans, emotional copy, or
  non-operational explanations outside the public intro.

Every visible element must pass at least one of these tests:

- it improves usability;
- it improves task completion;
- it adds a necessary function;
- it communicates meaningful engineering information;
- it explains a blocker, risk, result, or next action.

If an element does not pass one of those tests, remove it. Do not add content
only because the screen feels empty.

Use UI/UX best practices:

- clear information architecture;
- obvious primary action;
- compact repeated controls;
- predictable keyboard and pointer interactions;
- accessible focus states;
- no clipped menus or popovers;
- no accidental horizontal overflow;
- consistent spacing and typography;
- clear empty, loading, error, and needs-input states.

## Engineering Tool Quality Bar

The calculator and report editor must feel like professional engineering
software on desktop:

- alignment must be exact enough that rows, labels, controls, actions, and
  inspectors read as one designed system;
- repeated editor rows must use one shared grid, not accidental field widths;
- tool panels should be dense but calm, with minimal borders and no nested card
  stacks;
- controls must expose real actions quickly: add, search, reorder, duplicate,
  delete, request outputs, fix missing inputs, open report;
- labels should be short and operational; long explanatory paragraphs belong
  outside the tool flow unless they explain a blocker;
- graph, layer illustration, results, and blockers are engineering evidence
  surfaces and must not show misleading placeholders;
- dropdowns, popovers, toasts, and assistant state must never hide underneath
  panels or sticky chrome;
- light and dark modes are both product requirements, not optional polish;
- desktop screenshots are the primary acceptance evidence, with mobile sanity
  checks only to ensure the UI is not broken.

## Central Style System

All styling must be centrally controllable.

Primary style source:

- `apps/web/app/globals.css`

Rules:

- Define theme tokens first: background, surface, text, border, accent,
  success, warning, danger, focus, disabled.
- Define semantic component classes before page-specific styling.
- Component files may use layout utilities, but must not scatter raw color,
  border, radius, or state decisions.
- Palette changes must be possible from token edits, not by hunting through
  React components.
- Light mode and dark mode are required.
- Any new visual system must replace the failed old look, not layer on top of
  it.

Required central class groups:

- app shell;
- top navigation;
- tool workspace;
- workbench input groups;
- layer editor;
- layer illustration;
- result summary;
- blocker/error rows;
- report editor shell;
- assistant panel;
- buttons and icon buttons;
- fields, selects, toggles, checkboxes;
- chips/badges;
- modals/popovers.

## Calculator Workbench Requirements

The calculator workbench has one job: let the user build a construction,
request outputs, and understand what happened.

Required areas:

- study/assembly mode;
- layer stack editor;
- professional layer illustration;
- professional response graph;
- requested output selector;
- route-required physical inputs;
- calculation result summary;
- stopped/error/needs-input state;
- report handoff that packages the existing proposal snapshot correctly.

Layer editor interactions:

- add layer;
- drag reorder;
- move up/down;
- duplicate/copy layer;
- remove layer;
- clear selected layer fields when appropriate;
- select material from a searchable dropdown;
- select role from a searchable or clearly grouped dropdown when option
  count requires it;
- keep dropdowns/popovers above other components and inside the viewport;
- keep keyboard navigation and focus states usable;
- show selected layer clearly in both editor and illustration.

Input behavior:

- show only inputs relevant to the selected assembly/output route when
  possible;
- show missing required inputs as actionable warnings;
- every missing input warning must focus or scroll to the field it needs;
- do not bury needs-input states in diagnostics;
- avoid long explanatory copy.

Output behavior:

- support requested outputs such as `Rw`, `R'w`, `Ln,w`, `L'n,w`,
  `L'nT,w`, `DeltaLw`, `STC`, `C`, and `Ctr` according to existing engine
  support;
- show calculated outputs clearly;
- show unsupported or needs-input outputs in short, actionable rows;
- show the protected/improved response graph when curve data exists.

Must avoid:

- independent column scrollbars;
- text walls;
- repeated status panels;
- huge diagnostic surfaces in the main flow;
- hidden next action;
- old dense table UI as the primary visual structure;
- layer illustrations that look like plain cards or fake random bars.

Mobile:

- Mobile is not the top design priority.
- It still must not be broken, clipped, horizontally overflowing, or
  impossible to use.
- Desktop/tablet engineering usability is the primary target.
- Desktop/PC screenshots are the primary visual acceptance evidence.

## Layer Illustration Requirements

The current layer illustration work is rejected.

The new layer representation must start from the older accepted wall/floor
section preview idea and improve it. It must be designed as a real
construction-stack visual, not a decorative list:

- visible layer order;
- material names;
- role labels;
- thickness values;
- proportional thickness only when it improves understanding;
- minimum visual thickness for thin layers;
- wall and floor orientation must be different when the semantics differ;
- selected layer must connect clearly to the editor row;
- mobile must remain readable without horizontal scroll.
- include a technical layer schedule near the diagram;
- show solver-layer vs visible-row distinction only when it helps the user;
- do not create a new fake illustration that loses construction semantics.

Implementation approach:

- First prototype the layer illustration in isolation.
- Prefer a deterministic CSS/SVG implementation before adding a new
  visualization dependency.
- Add a library only if it solves a real interaction/layout problem and does
  not create dropdown, portal, z-index, or bundle risk.
- Validate with desktop and mobile screenshots before wiring it into the
  full workbench.

## Response Graph Requirements

The response graph must start from the older accepted log-spaced band view
and improve it.

Required graph behavior:

- low, speech, and high band regions remain visible;
- log-spaced frequency axis remains readable;
- curve and points remain visible;
- axis labels and units remain clear;
- "higher is better" or equivalent rule remains visible where relevant;
- summary band cards/readouts can remain if useful;
- graph can be reused in workbench and report preview UI;
- PDF output graph must not be redesigned unless PDF-output work is selected.

Implementation approach:

- Start from `response-curve-figure-card.tsx`.
- Improve chart polish, sizing, spacing, and responsiveness.
- Do not replace it with a generic chart library unless needed.
- If a library is used, prove it does not harm bundle size, SSR, or PDF
  output boundaries.

## Report Editor Requirements

The report editor is a web editing surface, not the PDF output itself.

Required areas:

- report preview;
- manual editable report fields/text;
- assistant conversation;
- assistant proposed patch/review state;
- accept/reject controls;
- export/open existing PDF output.

Manual edit UI:

- editable fields must be grouped into collapsible sections so they do not
  consume the whole page;
- sections should follow the proposal structure: cover/client details,
  primary metrics, supporting metrics, layer schedule, assumptions/notes,
  branding/sender details, and export settings;
- show unsaved changes clearly;
- reset to packaged snapshot must be possible;
- manual edits affect report snapshot only.

Assistant UI:

- assistant lives beside the report preview/editor;
- assistant can explain, propose edits, and prepare patch drafts;
- assistant output must be reviewable before applying;
- assistant must never silently change PDF output, calculator values, or
  engine behavior.

Rules:

- Manual edits affect the report snapshot, not calculator truth.
- Assistant edits are never silent.
- Calculator values and PDF output baseline must remain protected.
- The PDF output must stay the original accepted output unless a separate
  PDF-output task is explicitly selected.
- The report page may look new. The exported PDF content must stay the old
  accepted content.

## Public Intro Requirements

The public intro is allowed to introduce the product, but it must not define
the style of the tool surfaces.

Required content:

- DynEcho identity;
- one short explanation;
- direct login/calculator call to action;
- maybe a restrained workflow preview.

Must avoid:

- fake dashboards;
- broken static screenshots;
- visual noise;
- long sales copy;
- old workbench screenshots as product truth.

## Roadmap

Step 0: Freeze the failed UI
- Treat current Workbench V2 and public intro experiments as rejected.
- Do not continue incremental polish on the rejected UI.
- Preserve backend, engine, schemas, auth, storage, and PDF output.

Step 1: Establish the central style foundation
- Define the new token set in `globals.css`.
- Define the minimal shared UI classes.
- Remove dependency on the old cluttered visual language for new surfaces.
- Verify light/dark mode before building pages.

Step 2: Recover protected visual baselines
- Locate and isolate the accepted response graph source.
- Locate and isolate the accepted layer illustration source.
- Locate and mark the protected PDF output builders/export routes.
- Add implementation notes before changing any UI.

Step 3: Public intro rebuild
- Build a restrained public entry page.
- Keep it public.
- Route to login and calculator.
- Do not use stale screenshots.
- This page may use imagery and product-showcase presentation.

Step 4: Calculator information architecture
- Define the exact workbench flow:
  setup -> layer stack -> required inputs -> result -> report handoff.
- Decide what is primary, secondary, and advanced.
- Keep diagnostics out of the main workflow unless required for action.

Step 5: Layer illustration and graph prototypes
- Build the layer representation separately.
- Validate wall and floor orientation.
- Validate selected-layer linking.
- Validate mobile.
- Build the improved response graph separately.
- Validate graph in desktop and report-preview contexts.
- Only then integrate into the calculator page.

Step 6: Calculator page rebuild
- Build the actual authenticated workbench UI.
- Use the new central style system.
- Wire existing estimate behavior without changing engine/API contracts.
- Add report handoff that packages the existing proposal snapshot correctly.
- Add drag/copy/move layer controls.
- Add searchable dropdowns where needed.
- Add missing-input warnings that focus the relevant fields.
- Show requested outputs and graph.

Step 7: Report editor rebuild
- Build preview + manual edit + assistant surface.
- Use existing proposal snapshot/storage contracts where available.
- Keep PDF output unchanged.
- Put manual edit fields inside collapsible sections.
- Keep assistant patch application explicit.

Step 8: Verification and promotion
- Compare public intro, calculator, and report editor against the plan.
- Validate representative wall and floor workflows.
- Validate proposal snapshot handoff.
- Validate PDF export output has not changed.
- Promote staged routes only after acceptance.

## Detailed Execution Plan

This rebuild must proceed in small gated slices. Do not start the next slice
until the current slice has screenshots, route smoke, and explicit acceptance
against this plan.

### Phase 0: Freeze, Audit, And Baseline

Goal:

- Stop extending the rejected UI.
- Identify the exact protected graph, layer illustration, and PDF-output
  sources before rebuilding anything.

Allowed work:

- Read frontend files.
- Add documentation.
- Add screenshots under `output/playwright/`.
- Add isolated prototype files only if clearly named as prototypes.

Forbidden work:

- No engine/backend/API/schema/auth/storage changes.
- No PDF-output builder/export changes.
- No broad refactor.
- No reuse of rejected Workbench V2 components as the new baseline.

Required outputs:

- File map for protected graph code.
- File map for protected layer illustration code.
- File map for protected PDF-output builder/export code.
- Screenshot references for the accepted visual baselines.
- Written implementation notes before Phase 1.

Acceptance:

- The protected exceptions are named before implementation.
- Other agents can read the plan and understand what not to touch.

### Phase 1: Central Style Foundation

Goal:

- Create the new UI visual system before building pages.
- Make palette, surfaces, controls, spacing, and state colors centrally
  adjustable.

Primary file:

- `apps/web/app/globals.css`.

Allowed supporting files:

- Small new UI primitives if needed, under a clearly named new frontend path.
- No old page-specific component reuse unless it is one of the protected
  exceptions.

Required style groups:

- app shell;
- navigation;
- workspace layout;
- buttons and icon buttons;
- fields, selects, comboboxes, checkboxes, toggles;
- popovers/dropdowns;
- layer editor rows;
- layer illustration frame;
- graph frame;
- result and output rows;
- warning/error/needs-input rows;
- report editor shell;
- assistant panel;
- collapsible sections.

Acceptance:

- Light and dark tokens exist.
- No one-off component palette decisions are needed for the next pages.
- Controls have focus states.
- Popover/dropdown z-index rules are defined centrally.
- CSS does not encode the rejected old visual language.

Validation:

- `git diff --check`.
- A tiny visual harness or screenshots if a harness exists.
- Desktop and dark mode visual check once first page uses the system.

### Phase 2: Public Intro Page

Goal:

- Rebuild the public intro as the only show/presentation page.

Route:

- `/`.

Allowed:

- Stronger product identity.
- Images or product visuals.
- Concise product explanation.
- Direct login/calculator calls to action.

Forbidden:

- No fake operational dashboard.
- No stale screenshots.
- No old workbench component reuse.
- No long marketing copy.
- No tool-page style decisions that force the calculator/report pages to look
  like a landing page.

Acceptance:

- First viewport clearly says what DynEcho is.
- The page routes to login/calculator.
- The page does not imply calculator outputs are marketing claims.
- The page uses the central style system.

Validation:

- Desktop light screenshot.
- Desktop dark screenshot.
- Mobile sanity screenshot.
- Route smoke for `/` and `/login`.
- Console warning/error check.
- Horizontal overflow check.

Stop gate:

- Do not start calculator implementation until the public intro direction is
  accepted or explicitly deferred.

### Phase 3: Protected Visual Prototypes

Goal:

- Improve the graph and layer illustration before wiring them into the full
  calculator.

Graph prototype:

- Start from `apps/web/features/workbench/response-curve-figure-card.tsx`.
- Keep low/speech/high bands, log frequency axis, curve, points, labels, and
  engineering readability.
- Improve professional polish only.

Layer illustration prototype:

- Start from `apps/web/features/workbench/simple-workbench-layer-diagram.tsx`,
  `apps/web/features/workbench/simple-workbench-illustration.ts`, and
  `apps/web/features/workbench/simple-workbench-proposal-construction-figure.tsx`.
- Keep the construction-section idea and technical layer schedule.
- Improve wall/floor orientation, selected-layer connection, thickness cues,
  and material readability.

Forbidden:

- Do not change PDF-output graph/figure builders.
- Do not replace these with generic cards.
- Do not add a visualization library unless the prototype proves it is
  necessary.

Acceptance:

- Graph looks better than the baseline while preserving the baseline idea.
- Layer illustration looks like an engineering construction visual, not a
  list or decorative stack.
- Wall and floor cases both make sense.
- Selected layer can be visually linked to editor state.

Validation:

- Desktop screenshot for graph.
- Desktop screenshot for layer illustration.
- Mobile sanity screenshot.
- Light and dark screenshot if styles changed.

Stop gate:

- Do not integrate into calculator until graph and layer illustration are
  accepted.

### Phase 4: Calculator Workbench IA And Interaction Model

Goal:

- Design the calculator workflow before implementing the full page.

Required flow:

- setup;
- layer stack;
- route-required inputs;
- requested outputs;
- result and graph;
- blockers/needs-input;
- report handoff.

Layer editor interaction requirements:

- add;
- drag reorder;
- move up/down;
- duplicate/copy;
- remove;
- select material with search;
- select role with search/grouping when useful;
- maintain selected layer state;
- show selected layer in the illustration.

Dropdown requirements:

- no clipping behind other components;
- viewport collision handling;
- keyboard usable;
- search available for large option sets;
- clear empty/no-results state.

Missing input requirements:

- warning states must be actionable;
- action focuses or scrolls to the required field;
- warning text is short;
- no hidden diagnostic-only blockers.

Acceptance:

- A user can understand where to start, what is missing, what result exists,
  and how to proceed to report.
- No useless panels or decorative elements exist.
- Every visible element passes the purpose test.

Validation:

- Static review against this document before implementation.
- Component/state map documented in the implementation note.

### Phase 5: Calculator Workbench Implementation

Goal:

- Build the authenticated engineering tool page from the new style system and
  approved prototypes.

Route:

- Staged route can remain `/workbench-v2` until promotion is approved.

Allowed:

- New purpose-built frontend components.
- Existing estimate/API behavior as data source.
- Protected graph prototype.
- Protected layer illustration prototype.
- Existing proposal snapshot storage/handoff functions when needed.

Forbidden:

- No backend/engine/API/schema/auth/storage changes.
- No PDF-output changes.
- No old component reuse outside protected exceptions.
- No dense old table/panel visual language.

Acceptance:

- Required inputs can be entered.
- Layers can be added, dragged, copied, moved, removed.
- Searchable dropdowns work and render above content.
- Missing inputs focus the relevant field.
- Requested outputs display clearly.
- Graph displays when curve data exists.
- Layer illustration is integrated and selected layer is clear.
- Report handoff packages existing proposal snapshot correctly.

Validation:

- `pnpm exec eslint <touched frontend files>`.
- `git diff --check`.
- `pnpm --filter @dynecho/web build`.
- Playwright desktop screenshot.
- Playwright dark screenshot.
- Mobile sanity screenshot.
- Console warning/error check.
- Horizontal overflow check.
- Nested scroll audit.
- Route smoke for `/`, `/login`, calculator route, and report/PDF route.
- One representative wall workflow.
- One representative floor workflow when floor support is present.

Stop gate:

- Do not start report editor until the calculator workbench is accepted.

### Phase 6: Report Editor Page

Goal:

- Build the web report editor page without changing PDF output content.

Required layout:

- report preview;
- assistant panel;
- manual edit sections;
- export/open PDF output actions.

Manual edit requirements:

- fields live inside collapsible sections;
- sections are compact by default;
- changed fields are visible;
- reset to packaged snapshot is available;
- edits affect report snapshot only.

Assistant requirements:

- assistant can propose changes;
- proposed changes are reviewable;
- accept/reject is explicit;
- no silent mutation;
- no calculator truth changes.

Protected PDF rule:

- The page can look new.
- The generated/exported PDF output must stay the old accepted baseline.

Acceptance:

- User can preview report content.
- User can manually edit relevant report fields.
- User can ask assistant for edits and review them.
- User can export/open the existing PDF output.
- PDF output content is unchanged.

Validation:

- `pnpm exec eslint <touched frontend files>`.
- `git diff --check`.
- `pnpm --filter @dynecho/web build`.
- Playwright desktop screenshot.
- Playwright dark screenshot.
- Route smoke.
- Proposal snapshot read/write check.
- PDF export output comparison or explicit evidence that protected builders
  were not changed.

### Phase 7: Final Acceptance And Promotion

Goal:

- Promote only after all three surfaces work together.

Acceptance checklist:

- Public intro accepted.
- Calculator workbench accepted.
- Graph accepted.
- Layer illustration accepted.
- Report editor accepted.
- PDF output unchanged.
- Backend/engine/API/schema/auth/storage untouched.
- No old UI components reused outside allowed exceptions.
- Central styles own palette and state styling.
- No visible element fails the purpose test.

Promotion:

- Only after acceptance decide whether `/workbench-v2` replaces `/workbench`
  or remains staged.

## Validation Required For Every UI Slice

- `pnpm exec eslint <touched frontend files>`.
- `git diff --check -- <touched files>`.
- `pnpm --filter @dynecho/web build` for route/layout changes.
- Playwright desktop screenshot.
- Playwright mobile screenshot.
- Light mode and dark mode screenshot for visual changes.
- Console warning/error check.
- Horizontal overflow check.
- Nested scroll audit.
- Route smoke for `/`, `/login`, calculator route, and report/PDF route.

For any slice touching report handoff:

- prove proposal snapshot is packaged before opening report/PDF UI;
- prove existing PDF preview/export route can read it;
- prove exported PDF output is unchanged unless explicitly selected.

## Current Next Action

Do not return to the rejected Workbench V2 shell or old cluttered component
language.

Current open polish plan:

- `docs/ui/DYNECHO_UI_REBUILD_PHASE_9_PROFESSIONAL_POLISH_PLAN_2026-06-05.md`

Current implementation posture:

- Public intro, staged calculator route, report editor route, login polish,
  theme toggle, and protected graph/layer wrappers have initial rebuilt
  versions.
- The rebuild is still not accepted as final.
- The current quality gap is professional polish and correctness of the
  frontend presentation, especially layer-row alignment, consistent `DAC`
  branding, route handoff to `/workbench-v2`, graph data integrity, report
  assistant visibility, dropdown layering, and light/dark contrast.
- Backend, engine, endpoint contracts, schemas, auth behavior, storage
  behavior, calculation values, and generated/exported PDF output remain out of
  scope.

Next implementation action:

1. Execute Phase 9A layer-row alignment first.
2. Keep edits limited to frontend UI files and central styles.
3. Validate with focused ESLint, `git diff --check`, protected PDF/API diff
   check, and a desktop Playwright screenshot.
4. Continue through Phase 9B-9F only after each slice has evidence.

Route promotion remains blocked:

- `/workbench-v2` stays the staged calculator route.
- Do not replace or redirect `/workbench` until the user explicitly approves
  promotion after Phase 9 acceptance.
