# DynEcho UI Rebuild Phase 9 Professional Polish Plan - 2026-06-05

Document role: next execution plan for raising the rebuilt frontend from
"usable" to a more professional engineering-tool surface.

This plan follows Phase 8 feedback hardening and keeps the same hard scope:
frontend UI only, central styles, no backend/engine/API/schema/auth/storage
behavior changes, and no PDF output changes.

## Current Assessment

The rebuild is no longer the rejected cluttered Workbench V2 shell, but it is
not final. The calculator surface is functional and simpler, yet several UI
details still read as unpolished or accidental rather than designed.

The user-provided layer-row screenshot exposes a representative issue:

- the desktop layer row header and the actual row do not share one exact grid;
- the material field is much wider than role/thickness without a clearly
  justified column system;
- action buttons sit visually high relative to the fields;
- row rail, material field, role select, thickness input, and actions do not
  share one vertical alignment baseline;
- the active-row border/outline is heavy and makes the row feel like a selected
  form card rather than a precise editor row;
- controls look individually usable, but the combined row does not read as
  professional engineering software.

This is the kind of issue to fix before calling the UI finished.

## Additional User Feedback - 2026-06-05

These notes must be carried into the next implementation passes:

- Topbar mark currently reads `DE`; it should read `DAC`, preferably with a
  slightly more refined/fancy mark treatment while staying restrained and
  tool-appropriate.
- The simple PDF/report presentation appears inconsistent, possibly falling
  into a two-column structure where one column would be clearer. This must be
  audited carefully:
  - first distinguish web report preview/editor layout from generated/exported
    PDF output;
  - keep the protected PDF output unchanged unless the user explicitly opens a
    PDF-output correction task;
  - if the issue is only the web report editor/preview shell, fix it in the web
    UI without touching PDF renderer/template files.
- The response graph appears to render as a similar linear upward curve
  regardless of layer changes. This may be a frontend graph-data/model issue,
  not necessarily an engine issue. Audit the response-curve handoff before
  styling it further:
  - verify whether `buildWorkbenchResponseCurveFigures` receives distinct
    figure data for different assemblies/results;
  - verify whether the protected graph wrapper is accidentally showing a
    generic placeholder-like curve;
  - do not change calculator engine values while investigating this.
- The tool background may benefit from a more matte, quieter surface color.
  Before changing it, document the current reversible tokens:
  - light `--paper`: `oklch(0.985 0.003 252)`;
  - light `--paper-strong`: `oklch(0.963 0.005 252)`;
  - light `--panel`: `oklch(0.938 0.007 252)`;
  - dark `--paper`: `oklch(0.172 0.010 252)`;
  - dark `--panel`: `oklch(0.245 0.013 252)`.
- Sign-in flow should route users to `/workbench-v2` during the rebuild, not
  the old `/workbench`, unless an explicit route-promotion decision changes
  that.
- The report assistant needs a visible answer/conversation area. The user must
  be able to see assistant responses, pending suggestions, and applied/rejected
  state without hunting.

Agent analysis to carry forward:

- The `DAC` mark should become a shared brand/topbar component or at least a
  shared central class, so the public intro, login, calculator, and report
  editor do not drift.
- The response graph must be treated as both a visual component and a data
  integrity surface. A polished chart that always shows the same generic curve
  is misleading for an engineering calculator.
- The report editor needs a task-oriented layout pass after the layer-row pass:
  preview, assistant, and manual fields should each have a clear job and no
  hidden critical feedback.
- Background color tuning should be token-only in `globals.css`, with before
  tokens documented so the palette can be reverted quickly.

## UI/UX Gap Analysis - 2026-06-05

The current rebuild is usable enough to inspect, but it is not yet at the
professional engineering-tool bar. The main issue is not one missing style; it
is the combination of small inconsistencies that make the surface feel
assembled rather than designed.

Structural gaps:

- The layer editor row is the most visible alignment failure. Header labels,
  editable cells, action buttons, row rail, and active state must be governed
  by one shared desktop grid.
- The calculator still needs a stronger workspace/inspector relationship:
  layer stack and inputs are primary work, result/graph/blockers are operating
  feedback, and report handoff is a downstream action.
- The report editor must separate three jobs clearly: preview report content,
  edit report snapshot fields, and review assistant suggestions.
- The public intro can stay more visual, but it must not leak promotional
  composition or copy into calculator/report surfaces.

Interaction gaps:

- Material search popovers and any report controls need another z-index and
  overflow audit after the next layout pass.
- Sign-in/default next-route behavior must be aligned with the staged rebuild
  route, so users land on `/workbench-v2` during this phase.
- The assistant needs a visible conversation/answer area, plus pending
  suggestion and applied/rejected states.
- Missing-input warnings should remain short and actionable; if the field can
  be focused, the warning action should focus or scroll to it.

Visual gaps:

- Branding currently uses a `DE` mark in places. It must become `DAC` with one
  shared restrained mark treatment.
- Background surfaces may be slightly too bright/sharp for a desktop tool. Any
  matte adjustment must be token-only and reversible from the documented old
  token values.
- Light/dark mode must be tested route-by-route because contrast failures have
  already appeared in login and controls.
- Buttons, fields, rows, panels, graph frames, and illustration frames must use
  central tokens/classes rather than local visual decisions.

Data and truthfulness gaps:

- The response graph cannot be treated as decoration. If changing layers or
  outputs always produces the same linear upward-looking curve, that must be
  isolated as a frontend graph-data issue or shown as an unavailable state.
- The layer illustration can be visually improved, but it must still represent
  construction order, material, role, and thickness semantics.
- The user's PDF concern must be audited without conflating the web report
  page with the generated/exported PDF output. PDF output remains protected.

Definition of done for Phase 9 polish:

- Desktop calculator row alignment looks intentional at 1440 x 960.
- All main routes support light and dark mode without unreadable controls.
- Dropdowns/popovers render above surrounding panels and are not clipped.
- `DAC` branding is consistent across public intro, login, calculator, and
  report editor.
- Login/sign-in path reaches the staged calculator route.
- Graph data either changes with materially different results or clearly
  reports that graph data is unavailable.
- Report editor has visible assistant responses and reviewable suggestions.
- Protected PDF/API files remain unchanged unless a separate PDF-output task is
  explicitly selected.

## Binding Rules

- Do not touch backend, engine, API routes, shared schemas, auth behavior,
  storage behavior, calculation values, or PDF output.
- Do not reuse the rejected old UI shell.
- Keep protected PDF output files unchanged.
- Keep protected response graph and layer illustration sources/wrappers.
- Keep styles centralized in `apps/web/app/globals.css`.
- Tool pages must stay operational: no marketing copy, decorative sections,
  fake dashboard content, or unnecessary explanatory paragraphs.

## Phase 9 Priority Order

### 1. Calculator Layer Row Alignment

Goal: make the layer editor look intentionally engineered, not assembled from
loosely aligned form controls.

Required changes:

- Define one shared desktop grid for header and rows, for example:
  rail/index, material, role, thickness, actions.
- Use the same column template for `.calc-layer-list-head` and
  `.calc-layer-row`.
- Align all row children vertically to the same centerline.
- Make material, role, and thickness controls share consistent heights.
- Move action buttons to the same vertical center as the editable fields.
- Reduce the heavy selected-row treatment into a clearer but quieter state.
- Keep drag, move up/down, duplicate, and remove controls available.
- Keep material search inside the popover.

Acceptance:

- Header labels align pixel-consistently with row columns.
- The actions column is centered relative to the row controls.
- Material field width is intentional and documented in the grid, not an
  accidental side effect.
- No text overlaps, clipped controls, or horizontal overflow at 1440 x 960.

### 2. Calculator Visual Hierarchy Pass

Goal: make the calculator read as one engineering workspace with an inspector,
not as a set of unrelated cards.

Required changes:

- Rebalance setup, layer stack, illustration, graph, result, and report handoff
  spacing.
- Make the right column feel like an inspector panel with clear status and
  secondary sections.
- Reduce unnecessary border/shadow repetition.
- Keep output selection compact and scannable.
- Preserve needs-input/error states.

Acceptance:

- First desktop viewport communicates: mode, requested outputs, layer stack,
  current result, graph context.
- No element appears only decorative.
- Graph and layer illustration remain visually protected and readable.

### 3. Overlay And Dropdown Audit

Goal: ensure no dropdown/popover appears underneath another panel.

Required changes:

- Audit calculator material popover, native selects, report editor controls,
  assistant controls, command/menu/toast layers.
- Verify z-index tokens remain above sticky chrome.
- Where native select behavior cannot be controlled, avoid placing it in
  clipped/overflow-hidden containers.
- Prefer overflow-visible on local editor rows where popovers are anchored.

Acceptance:

- Browser smoke verifies active popover is the top sampled element.
- No dropdown is clipped by layer row, right inspector, report side panel, or
  sticky topbar.

### 4. Light/Dark Contrast Audit

Goal: ensure theme switching is reliable and every main surface is readable in
both modes.

Required surfaces:

- `/`
- `/login`
- `/workbench-v2`
- `/workbench/proposal`

Required checks:

- theme toggle visible and synced;
- text and background contrast readable;
- inputs/selects/buttons readable;
- disabled states visible but not dominant;
- graph and layer illustration remain legible;
- report preview/editor chrome remains readable.

Acceptance:

- Playwright screenshots for light and dark calculator/report/login.
- No same-color text/background failures in audited controls.

### 5. Report Editor Polish

Goal: improve the web report editor without touching generated PDF output.

Required changes:

- Keep PDF iframe/preview output content unchanged.
- Audit whether the user's "simple PDF two-column" concern is caused by the web
  report editor/preview shell or the generated/exported PDF output.
- Improve preview/editor/assistant layout density.
- Keep manual fields collapsible and compact.
- Make assistant state, pending proposal, and apply/reject flow clearer.
- Add a visible assistant answer/conversation area.
- Avoid long explanatory text.

Acceptance:

- User can scan preview, edit fields, and use assistant without hunting.
- PDF export/download routes still use protected existing output code.
- If exported PDF output itself needs redesign/correction, pause and get
  explicit user approval because that is outside this UI-shell polish scope.

### 6. Response Graph Data Integrity Audit

Goal: verify the protected response graph is displaying result-specific graph
data rather than the same generic upward curve for every assembly.

Required changes:

- Compare graph figure data for at least two materially different layer stacks.
- Confirm whether the curve is produced by frontend fallback/model code or
  result-provided data.
- Preserve the protected visual idea: log-spaced bands, axes, curve, points,
  engineering readability.
- Do not alter engine formulas or calculation values in this UI polish slice.

Acceptance:

- Browser or unit-level evidence shows graph data changes when the result data
  changes, or a documented frontend graph-data bug is isolated for a dedicated
  fix.
- No misleading placeholder-like curve remains in the calculator if real graph
  data is unavailable; show an honest unavailable/insufficient-data state
  instead.

### 7. Brand, Background, And Route Handoff

Goal: fix visible product-shell inconsistencies.

Required changes:

- Replace `DE` topbar/public mark with `DAC`.
- Make the mark slightly more refined without decorative noise.
- Keep background palette token-only and document any new matte token values.
- Route public login/sign-in affordances to `/login?next=/workbench-v2` or
  otherwise ensure rebuild login lands on `/workbench-v2`.
- Do not promote `/workbench-v2` to `/workbench` until explicitly approved.

Acceptance:

- Public intro, login, calculator, and report editor show consistent `DAC`
  branding.
- User clicking sign in/open calculator during rebuild reaches `/workbench-v2`.
- Any background color change is reversible from the documented tokens.

### 8. Route Promotion Decision

Goal: decide when the rebuilt calculator becomes the main `/workbench` route.

Do not do this automatically.

Acceptance before promotion:

- calculator polish passes;
- report editor polish passes;
- light/dark audit passes;
- dropdown/overlay audit passes;
- user explicitly approves replacing or redirecting old `/workbench`.

## Phase 9 First Implementation Slice

Start with calculator layer-row alignment because it is visible, concrete, and
representative of the current polish gap.

Implementation files expected:

- `apps/web/app/globals.css`
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx` only if the
  DOM structure must change for alignment.
- `docs/ui/DYNECHO_UI_REBUILD_PHASE_9_PROFESSIONAL_POLISH_PLAN_2026-06-05.md`

Validation:

- focused ESLint for touched frontend files;
- Playwright screenshot at 1440 x 960;
- Playwright audit for header/row column alignment and action vertical center;
- protected PDF/API diff check;
- web build if any React/CSS changes are implemented.

Status update - 2026-06-05:

- Phase 9A layer-row alignment is implemented in central CSS.
- Header and row now share one desktop grid.
- Material, role, thickness, and actions align on the same row centerline.
- Action buttons no longer wrap in the desktop row.
- Active-row treatment is quieter.
- Evidence screenshot:
  `output/playwright/ui-phase9/workbench-layer-row-alignment.png`.
- Browser measurement at 1440 x 960:
  - header/row x deltas: `1px`, `1px`, `0.2px`, `-0.4px`, `-1px`;
  - vertical center spread: `0px`;
  - action button top spread: `0px`;
  - horizontal overflow: `0px`.

## Phase 9 Execution Slices

Proceed in this order unless the user explicitly redirects:

1. Phase 9A - Layer row alignment
   - Fix calculator row/header grid, baseline, action placement, and active
     row treatment.
   - Validate with a desktop screenshot and a small alignment audit.

2. Phase 9B - Brand, route, and matte shell consistency
   - Replace `DE` with shared `DAC` branding.
   - Ensure sign-in lands on `/workbench-v2`.
   - Try matte background token tuning only through `globals.css`, with old
     token values kept documented for rollback.

3. Phase 9C - Graph data integrity
   - Compare graph figure data across at least two different assemblies.
   - Fix only frontend graph handoff/fallback behavior if needed.
   - Do not change engine formulas or result values.

4. Phase 9D - Report editor assistant and preview polish
   - Add visible assistant answer/conversation area.
   - Make manual fields compact and collapsible.
   - Audit simple report preview layout without changing generated PDF output.

5. Phase 9E - Dropdown and theme regression pass
   - Re-check overlays, z-index, overflow, light/dark contrast, and route
     screenshots after the layout changes.

6. Phase 9F - Promotion readiness review
   - Only after the above passes, decide with the user whether `/workbench-v2`
     can replace `/workbench`.

Evidence required for each implementation slice:

- focused ESLint for touched frontend files;
- `git diff --check`;
- protected PDF/API diff check;
- Playwright desktop screenshot;
- light/dark screenshots when styles or route shells change;
- web build for React/CSS route changes.

Status update - 2026-06-05:

- Phase 9B brand, route, and matte shell consistency is implemented for the
  active rebuilt surfaces.
- Public intro, calculator topbar, and report editor topbar now show `DAC`
  instead of `DE`.
- Public intro calculator/sign-in CTAs now route through
  `/login?next=/workbench-v2`.
- `/login` without an explicit `next` now defaults to `/workbench-v2` at the
  login page level, without changing the auth API route or shared auth helper
  contract.
- Matte shell token values are changed only in `apps/web/app/globals.css`.
- Evidence screenshots:
  - `output/playwright/ui-phase9/phase9b-public-dac-shell.png`;
  - `output/playwright/ui-phase9/phase9b-login-default-workbench-v2.png`;
  - `output/playwright/ui-phase9/phase9b-report-dac-shell.png`.
- Browser checks:
  - public intro mark: `DAC`;
  - public intro calculator/sign-in hrefs:
    `/login?next=/workbench-v2`;
  - `/login` default result in preview mode: `/workbench-v2`;
  - calculator topbar mark: `DAC`;
  - report topbar mark: `DAC`;
  - horizontal overflow: `0px` on checked routes.
- Previous light token values remain documented above in this plan. Current
  Phase 9B token values:
  - light `--paper`: `oklch(0.978 0.004 252)`;
  - light `--paper-strong`: `oklch(0.954 0.005 252)`;
  - light `--panel`: `oklch(0.927 0.007 252)`;
  - light `--panel-strong`: `oklch(0.894 0.010 252)`;
  - dark `--paper`: `oklch(0.166 0.010 252)`;
  - dark `--paper-strong`: `oklch(0.198 0.011 252)`;
  - dark `--panel`: `oklch(0.236 0.013 252)`;
  - dark `--panel-strong`: `oklch(0.284 0.014 252)`.

Status update - 2026-06-05:

- Phase 9C graph data integrity audit is implemented as a frontend-only
  honesty/presentation correction.
- API/result handoff comparison showed that materially different airborne
  assemblies produce different weighted answers and transmission-loss arrays,
  but the active airborne curve method stays
  `screening_mass_law_curve_seed_v3`; this explains why the curve shape can
  look similarly linear across stacks.
- The calculator graph no longer presents that shape without context:
  - airborne figures now carry optional `evidenceLabel` and `evidenceTone`;
  - screening-mass-law airborne figures show `Mass-law screening`;
  - the visible note is: `Values shift per result; shape follows the screening
    mass-law family until exact bands exist.`;
  - impact trace figures show `Trace-backed bands`.
- The evidence fields are optional for backward compatibility with old saved
  proposal/preview graph payloads; no protected proposal/PDF output file was
  edited.
- Evidence screenshot:
  `output/playwright/ui-phase9/phase9c-graph-basis-label.png`.
- Browser checks at `/workbench-v2`:
  - airborne graph meta badges:
    `Mass-law screening`, `63..4000 Hz`, `Higher is better`;
  - graph note is visible;
  - horizontal overflow: `0px`.
- Validation:
  - `pnpm --filter @dynecho/web exec eslint features/workbench/response-curve-model.ts features/workbench/response-curve-model.test.ts features/workbench-rebuild/professional-response-curve.tsx`;
  - `pnpm --filter @dynecho/web exec vitest run features/workbench/response-curve-model.test.ts`;
  - `git diff --check` for touched frontend/doc files;
  - protected PDF/API diff check returned no changed files;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain.

Status update - 2026-06-05:

- Phase 9D report editor assistant/preview polish is implemented as a web UI
  shell change only.
- The report assistant is now visually prioritized above manual fields in the
  side panel, so the user can see assistant state without scrolling past the
  manual editor.
- The assistant panel now always exposes a visible response thread:
  - status badge: `Ready`, `Working`, or `Review`;
  - empty state: `Ready for a focused edit`;
  - assistant results and apply/reject state appear in the same thread.
- Assistant patch review now has both `Apply to draft` and `Reject proposal`.
  Applying or rejecting logs an explicit status message.
- Manual fields remain available but are less dominant:
  - `Header` opens by default;
  - `Results`, `Output rows`, `Sender`, and `Notes` start collapsed;
  - collapsible sections now have a visible chevron affordance.
- Generated/exported PDF output and PDF/API route files were not changed.
- Evidence screenshots:
  - `output/playwright/ui-phase9/phase9d-report-assistant-first.png`;
  - `output/playwright/ui-phase9/phase9d-report-assistant-thread.png`.
- Browser checks at `/workbench/proposal` after opening report from
  `/workbench-v2`:
  - report empty state: `false`;
  - assistant status: `Ready`;
  - assistant panel is above manual fields;
  - collapsible states: `Header` open, all other manual groups closed;
  - horizontal overflow: `0px`;
  - preview panel width: `816px` at the checked desktop viewport.
- Validation:
  - `pnpm --filter @dynecho/web exec eslint features/workbench-rebuild/report-editor.tsx`;
  - `git diff --check` for touched frontend/doc files;
  - protected PDF/API diff check returned no changed files;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain.

Status update - 2026-06-05:

- Phase 9E dropdown/theme regression pass is complete for the active rebuilt
  surfaces.
- Material search popover was browser-tested with real Playwright click:
  - popover opens from the layer material control;
  - sampled top element is inside `.calc-material-popover`;
  - popover z-index resolves to `1600`;
  - horizontal overflow remains `0px`.
- Calculator dark mode was browser-tested:
  - root theme: `dark`;
  - body text/background use central dark tokens;
  - horizontal overflow remains `0px`.
- Report editor dark mode was browser-tested after opening the report from
  `/workbench-v2`:
  - report empty state: `false`;
  - assistant status: `Ready`;
  - panel/input colors use central dark tokens;
  - horizontal overflow remains `0px`.
- `/login` currently redirects to `/workbench-v2` in preview/auth-disabled
  mode, but login page/form text and error styling were updated from legacy
  `--ink*` and literal amber classes to central `--text-*` and
  `ui-warning-panel` tokens to prevent light/dark contrast drift when auth is
  configured.
- Evidence screenshots:
  - `output/playwright/ui-phase9/phase9e-calculator-dark.png`;
  - `output/playwright/ui-phase9/phase9e-report-dark.png`;
  - `output/playwright/ui-phase9/phase9e-calculator-dark-material-popover.png`.
- Validation:
  - `pnpm --filter @dynecho/web exec eslint app/login/page.tsx app/login/login-form.tsx features/workbench-rebuild/report-editor.tsx features/workbench/response-curve-model.ts features/workbench/response-curve-model.test.ts features/workbench-rebuild/professional-response-curve.tsx`;
  - `git diff --check` for touched frontend/doc files;
  - protected PDF/API diff check returned no changed files;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain.

Status update - 2026-06-05:

- Phase 9F promotion readiness review is complete.
- No route promotion was performed. `/workbench` remains the legacy route until
  the user explicitly approves replacing or redirecting it.
- The active rebuilt route set is ready for user review:
  - `/` public intro routes calculator/sign-in CTAs through
    `/login?next=/workbench-v2`;
  - `/login` defaults to `/workbench-v2` in preview/auth-disabled mode;
  - `/workbench-v2` shows `DAC`, live result, graph basis badge, layer editor,
    illustration, and report handoff without horizontal overflow;
  - `/workbench/proposal` opens from the rebuilt calculator handoff with report
    preview ready, assistant visible above manual fields, and compact manual
    sections;
  - unknown routes now point to `/login?next=/workbench-v2` instead of the
    legacy `/workbench` route.
- Readiness verdict:
  - accepted for staged rebuilt-route review at `/workbench-v2`;
  - not promoted to `/workbench`;
  - remaining promotion gate is explicit user approval.
- Evidence screenshots:
  - `output/playwright/ui-phase9/phase9f-calculator-readiness.png`;
  - `output/playwright/ui-phase9/phase9f-report-readiness.png`;
  - `output/playwright/ui-phase9/phase9f-not-found-staged-handoff.png`.
- Browser checks:
  - public intro mark: `DAC`;
  - public intro calculator/sign-in hrefs:
    `/login?next=/workbench-v2`;
  - unknown route CTA href:
    `/login?next=/workbench-v2`;
  - calculator graph badges:
    `Mass-law screening`, `63..4000 Hz`, `Higher is better`;
  - calculator report handoff button is enabled;
  - report empty state: `false`;
  - report preview ready: `true`;
  - report assistant is above manual fields;
  - horizontal overflow: `0px` on checked routes.
- Validation:
  - `pnpm --filter @dynecho/web exec eslint app/not-found.tsx app/login/page.tsx app/login/login-form.tsx features/workbench-rebuild/report-editor.tsx features/workbench/response-curve-model.ts features/workbench/response-curve-model.test.ts features/workbench-rebuild/professional-response-curve.tsx`;
  - `pnpm --filter @dynecho/web exec vitest run features/workbench/response-curve-model.test.ts`;
  - `git diff --check` for touched frontend/doc files;
  - protected PDF/API diff check returned no changed files;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain.
