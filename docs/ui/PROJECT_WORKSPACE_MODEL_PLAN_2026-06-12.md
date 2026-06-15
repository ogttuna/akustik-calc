# DynEcho Project Workspace Model Plan - 2026-06-12

Document role: product/data-model analysis and implementation planning for a
project-centered workspace model. This is a planning document only; it does not
select or modify calculator behavior.

## Implementation Status

Status on 2026-06-12:

- backend foundation started;
- shared project schema now has migration-safe `assemblies` and `reports`
  collections;
- project access vocabulary now includes assembly/report save/delete and project
  material management actions;
- file-backed project repository can append, rename, duplicate, and delete named
  workbench-v2 assemblies; it blocks assembly deletion while reports still
  reference that assembly;
- file-backed project repository can append, rename, duplicate, archive/restore,
  and delete project reports, and can append report revisions;
- child routes exist for assembly/report list, create, detail, update, duplicate,
  delete, and report revision create;
- route tests cover project -> assembly -> report -> assistant revision -> stale
  conflict, plus child rename/duplicate/archive/delete management;
- `/workbench-v2` now has first-pass project workspace controls for creating a
  project, selecting a project, saving the current stack as a named combination,
  and loading a saved combination;
- `/workbench-v2` report handoff now packages selected project id, selected
  saved-combination id, source workbench snapshot, calculation output summary,
  and material/visual snapshot into the proposal preview handoff when the report
  is opened from a selected project combination;
- proposal preview storage now preserves optional project/report context across
  local report edits and reset;
- `/workbench/proposal` can save the current report document as a project report
  and can save subsequent manual or assistant-adjusted editor drafts as project
  report revisions using the backend stale-update guard;
- `/workbench-v2` can list saved project reports and reopen a selected report
  into the report editor with project/report context preserved;
- `/workbench-v2` now exposes selected saved-combination and saved-report
  management controls for rename, duplicate, delete, and report archive/restore;
- `/workbench/proposal` can also hydrate a saved report directly from
  `projectId` and `reportId` URL params when the local preview handoff is
  missing or stale;
- visible project/report workspace copy was tightened after UI review: the
  workbench no longer exposes a legacy latest-snapshot load action, the idle
  local state reads as "Browser-local draft", loading copy reads "Loading
  projects", and the report editor now uses "report draft/preview" language
  instead of user-visible "snapshot" wording;
- fast fill-and-click project/combination create and rename flows were checked
  in Playwright and hardened against stale React state by keeping the latest
  input values in refs for submit handlers;
- project/report workspace mutation handlers now also use in-flight refs so
  rapid double-submit cannot create duplicate projects, combinations, reports,
  or report revisions while React disabled state is still rendering;
- project, saved-combination, and report-name inputs now apply the same 160
  character limit as the server schema; generated duplicate child names are
  truncated server-side so `Copy of ...` cannot exceed the schema limit;
- initial project report library names are bounded independently from the report
  document subject, so a long client-facing subject does not block
  "Save to project";
- the material editor E2E now covers project -> saved combination -> browser
  storage clear -> saved combination reload for custom material and appearance
  state;
- the workbench-v2 E2E now covers project -> saved combination -> open report ->
  save project report -> edit report -> save project revision -> combination
  rename/duplicate/delete -> report rename/duplicate/delete/archive/restore ->
  reopen saved report from the project;
- the workbench-v2 E2E now also covers mobile project workspace/report editor
  responsiveness and asserts the project controls and report header do not
  horizontally overflow;
- the workbench-v2 E2E now includes a rapid-submit guard path that double-clicks
  create project, save combination, duplicate combination, and save report in
  the same event turn and verifies only one corresponding server record is
  created.

Deferred follow-up, not implemented in this pass:

- assistant/MCP project visibility is still planned work. The Report Assistant
  exists and can operate on the current report context, but it does not yet have
  read-only project tools for listing accessible projects, reading saved
  assemblies, reading saved reports, or inspecting report revisions from project
  storage. Do not treat Slice E as complete until those tools and their owner-
  scoped tests are implemented.
- project workspace UI/UX refactor is still planned work. The current
  create/select project, saved-combination, and saved-report controls are a
  functional first pass, but the interaction model and visual organization are
  not considered accepted product UX. Do not treat the project workspace UI as
  final until it is refactored into a clearer, more deliberate management
  surface and rechecked on desktop and mobile.

## Planning Analysis Update - 2026-06-15

This update scopes the two remaining planned workstreams before implementation:
Assistant/MCP project visibility and project workspace UI/UX refactor.

### Assistant/MCP project visibility findings

Current code facts:

- `apps/web/features/workbench/report-assistant-tools.ts` exposes
  MCP-compatible tool definitions, but every current tool is scoped to the
  active report context/document. Existing tool names are
  `resolve_report_metric_reference`, `preview_report_patch`,
  `find_report_value_mentions`, `research_acoustic_reference`, and
  `prepare_calculator_finding`.
- `/api/report-assistant/patch` accepts only `context`, `document`, and
  `instruction`; it does not load or attach project storage context.
- the model request for the patch provider instructs the model to return one
  `ReportAssistantPatch` JSON object and not call tools. Therefore project
  visibility is not solved by adding tool declarations alone; the assistant
  request flow also needs an explicit project-read context path or a bounded
  server-side tool-call wrapper.
- the project API already has read surfaces that can be reused or wrapped:
  `GET /api/projects`, `GET /api/projects/:projectId`,
  `GET /api/projects/:projectId/assemblies`,
  `GET /api/projects/:projectId/assemblies/:assemblyId`,
  `GET /api/projects/:projectId/reports`, and
  `GET /api/projects/:projectId/reports/:reportId`.
- report revisions are currently available through the full saved report detail
  response; there is no dedicated `GET /revisions` route yet.
- project access policy already distinguishes `list_projects` and
  `read_project`, and those actions are available to read-only roles. Assistant
  tools should reuse this owner scope and access behavior rather than inventing
  a separate authorization path.

Planning implications:

- first implementation should add read-only project assistant tools, not write
  tools. Required first-pass tools are `list_projects`,
  `read_project_summary`, `list_project_assemblies`,
  `read_project_assembly_snapshot`, `list_project_reports`,
  `read_project_report_document`, and a revision summary/read path.
- project ids and child ids must be explicit together for child reads. Do not
  resolve an assembly/report by child id alone.
- tool outputs should return bounded summaries by default. Full assembly
  snapshots and full report documents should require explicit project/child ids
  because saved reports and snapshots can be large.
- wrong-owner, missing-project, and missing-child responses should mirror the
  HTTP route semantics and must not reveal whether another owner's id exists.
- because the patch endpoint does not run a model tool loop, implementation must
  choose between two safe integration shapes:
  - add a project-read assistant/tool route that the UI can call before asking
    the assistant a project question;
  - or attach a bounded selected-project summary to assistant requests when the
    user is working inside an active project/report.
- write-capable MCP tools such as `save_report`, `apply_report_patch`, or
  `update_project` remain out of scope. Save/apply stays in the reviewed UI
  flow.

### Project workspace UI/UX refactor findings

Current code facts:

- the first-pass workspace UI lives inline inside
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx` under one
  `calc-project-snapshot-section`.
- the same section currently combines project creation, project selection,
  refresh, saved-combination naming/saving/loading, selected-combination
  rename/duplicate/delete, saved-report selection/opening, and selected-report
  rename/duplicate/archive/delete.
- CSS keeps the controls responsive with an auto-fit grid in
  `.calc-project-snapshot-controls`, which helps prevent horizontal overflow but
  does not solve information architecture or action hierarchy.
- the state and handlers are mostly `serverProject*` values in the main
  workbench component. A UX refactor should include component boundaries, not
  only spacing/copy changes.

Planning implications:

- refactor should split the surface into clear workbench utility areas:
  project identity/select, saved combinations, and saved reports.
- project creation should not compete visually with child management actions.
  The empty state should guide the user to create/select a project, while the
  active state should emphasize the selected project and its saved children.
- saved combinations need list-like rows with display code/name, wall/floor
  kind, layer count or metric summary when available, updated time, and compact
  row actions. A select-only dropdown is acceptable for the first pass but is not
  the target UX.
- saved reports need list-like rows with report code/name, linked assembly,
  status, revision count/current revision, updated time, and compact row
  actions. Archive/delete must remain clearly destructive or reversible.
- the refactor should preserve dense workbench ergonomics. Do not turn this into
  a landing page or large decorative card layout.
- mobile behavior must remain first-class: no horizontal overflow, action labels
  must fit or collapse to icon/tooltip patterns, and selected project/report
  context must stay visible without forcing excessive scrolling.
- implementation should be incremental: extract component boundaries first,
  preserve route behavior and E2E coverage, then improve layout and copy.

## Implementation-Ready Plan Update - 2026-06-15

This section supersedes the older broad Step 1-9 sequence for the two remaining
workstreams only. The storage, child routes, report persistence, material editor
first pass, and project-workspace E2E foundation already exist. The next work
should stay tightly scoped to:

- Assistant/MCP project visibility;
- Project workspace UI/UX refactor.

### Shared implementation rules

- Do not change calculator formulas, runtime route selection, result values, or
  source-of-truth calculator docs for this UI/assistant slice.
- `/api/estimate` must continue receiving explicit layer/context/material
  payloads. Project id is persistence context, not hidden calculator input.
- Preserve all existing project storage semantics: owner-scoped file storage,
  UUID route ids, summary lists, stale-update guards, max child counts, max byte
  limits, and atomic writes.
- Keep assistant-visible project features read-only/preview-only in the first
  pass. No `apply_report_patch`, `save_report`, `update_project`, delete, archive,
  or material mutation tool should be exposed through assistant/MCP.
- Keep "MCP-compatible" terminology precise. The current app has
  MCP-compatible report assistant tool definitions, not a standalone project MCP
  server. If a real MCP wrapper is added later, it must wrap the same read-only
  helpers and access policy.
- Avoid one large workbench rewrite. Extract boundaries first, keep behavior
  stable, then improve information architecture and visual hierarchy.
- UI must remain a dense engineering workbench. Do not add a landing page, hero
  section, decorative card grid, nested cards, or marketing-like composition.
- Use existing UI primitives and icon language. Prefer lucide icons for compact
  row actions, with accessible labels/tooltips where icon-only buttons are used.
- Do not show raw UUIDs as normal UI labels. Use project/report/assembly names,
  display codes, status, counts, and timestamps.
- Any new test should target project/workbench/report/assistant surfaces only
  unless a payload contract intentionally changes.

### Whole-system architecture fit

The planned work belongs in the product/workbench persistence layer, not the
calculator layer. The calculator engine remains a pure calculation target that
receives explicit request payloads. The project workspace is the user's durable
work organization layer: it names projects, stores saved combinations, stores
report documents/revisions, and provides safe context for the assistant.

Current source-of-truth boundaries:

```text
Calculator engine
  Receives explicit material/layer/context/output payloads.
  Does not read project ids, browser state, report revisions, or assistant state.

Server project store
  Durable source for projects, saved combinations, saved reports, report
  revisions, source assembly snapshots, and compact assistant revision metadata.

Workbench-v2 client state
  Interactive draft state for the currently edited layer stack/materials.
  Can save into a selected project, but can still calculate without a project.

Report editor client state
  Interactive draft state for the current report document.
  Can save the full edited document as a project report/revision.

Report Assistant
  Proposal/review helper for report context.
  May read bounded project context after this work, but must not mutate project
  state directly in the first pass.
```

This is the right placement because it preserves reproducibility. A saved report
must remain explainable from its stored document and source snapshots even if a
project material, layer combination, or future calculator route changes later.
The assistant can improve review and navigation, but it must not become a hidden
write path or a hidden calculator input.

### Why this plan is the safer path

The current implementation already has working persistence and guarded report
revision saves. The risk is not missing basic capability anymore; the risk is
mixing concerns while polishing the UX:

- if project data is pushed into `/api/estimate`, calculations may become
  implicit and harder to reproduce;
- if assistant tools get write ability too early, assistant output can bypass the
  reviewed Apply/Save flow that currently protects report edits;
- if the UI is redesigned before component boundaries exist, the large
  `calculator-workbench.tsx` state surface becomes harder to reason about and
  easier to break;
- if assistant project reads return full project JSON by default, payloads can
  grow quickly and the model can receive stale or irrelevant report text;
- if raw ids become user-facing labels, the product stops matching the acoustic
  consulting mental model of projects, combinations, reports, and revisions.

The proposed sequence reduces those risks:

1. add read-only assistant project helpers behind the same project access policy;
2. expose those helpers through a bounded route/status surface;
3. connect selected project/report context to assistant UX without changing
   patch apply/save semantics;
4. extract project workspace UI components without behavior change;
5. then improve layout, hierarchy, row actions, and responsive polish.

Each step either adds a bounded read surface or moves UI structure without
changing calculator truth. That makes failures recoverable and keeps other
agents' calculator/report work isolated.

### Data-flow targets

Assistant project-read flow:

```text
Report editor or workbench UI
  -> assistant project-read endpoint/action
  -> auth owner resolution
  -> project access policy
  -> file-backed project repository
  -> bounded summary or explicit selected document
  -> assistant UI/model context
```

Report patch flow must remain:

```text
Report editor draft
  -> /api/report-assistant/patch
  -> model or deterministic patch proposal
  -> validateReportAssistantPatch
  -> user reviews Apply
  -> draft mutates locally
  -> Save to project creates report/revision through project routes
```

Project workspace UI flow after refactor:

```text
Project identity area
  Select/create project, refresh summaries, show counts/status.

Saved combinations area
  Save current workbench draft, list saved combinations, load/rename/duplicate/
  delete selected rows.

Saved reports area
  List saved reports, open/rename/duplicate/archive/restore/delete selected rows.

Calculator/editing areas
  Continue to calculate from explicit current draft payloads.
```

The important rule is that project selection changes persistence context, not
the current calculator draft. Loading a saved combination remains explicit.

### Dependency and parallelization map

These workstreams can be partially parallelized, but the overlap must be kept
small:

```text
Assistant visibility owner:
  report-assistant project helper, assistant read route, runtime status,
  report assistant tests.

UI refactor owner:
  project workspace component extraction, workbench-v2 layout, CSS, Playwright
  UI checks.

Shared/overlap:
  report-editor assistant context affordance. This should happen only after the
  assistant read route shape is stable.
```

Recommended coordination:

- do not have two agents edit `calculator-workbench.tsx` at the same time;
- do not have two agents edit `report-editor.tsx` at the same time;
- assistant helper/route work can proceed while the UI owner extracts
  project-workspace components, as long as both avoid changing shared route
  payload names without updating the plan;
- any route schema or access-policy change must update route tests before UI
  code depends on it;
- if a calculator-focused agent is active, this work must not touch engine files
  or calculator selected-next docs.

### Implementation gates

Gate 0 - Baseline:

- confirm current project route/storage tests pass or document unrelated
  failures;
- confirm current project workspace E2E selector names that the refactor will
  preserve or intentionally update;
- note any dirty parallel files before touching shared components.

Gate A - Assistant read foundation:

- project assistant helpers exist and are unit-tested;
- all new helper/tool definitions are `mutates: false`;
- wrong-owner/missing-project behavior matches project routes;
- summary actions do not return full report documents or assembly snapshots.

Gate B - Assistant route/status:

- route accepts only known read actions;
- unauthenticated configured mode still returns `401`;
- runtime status lists read-only project tools;
- route tests prove no mutation occurs.

Gate C - Assistant UX integration:

- report editor shows active project/report context when available;
- no selected project preserves old assistant behavior;
- patch proposal/apply/save flow remains unchanged;
- saved report preview stays validation-only until explicit Save to project.

Gate D - UI extraction:

- project workspace markup is extracted from `calculator-workbench.tsx`;
- current behavior, labels used by E2E, rapid-submit guards, and route calls are
  preserved;
- extracted component has empty/loading/active/error render coverage where
  practical.

Gate E - UI redesign:

- project identity, saved combinations, and saved reports are separate visual
  areas;
- combinations and reports render as compact rows with row actions;
- destructive actions remain confirmed and visually distinct;
- desktop and mobile no-overflow checks pass.

Gate F - Final hardening:

- focused assistant/project/workbench/report tests pass;
- Playwright covers create/select project, save/load combination, saved report
  open, assistant-adjusted report save, and mobile no-overflow;
- this plan is updated with actual route names, component names, and any
  intentionally deferred behavior.

### Acceptance definition for this remaining slice

The remaining slice is ready only when all of the following are true:

- the assistant can list accessible projects through a read-only server-backed
  path;
- the assistant can list saved combinations/reports under a selected project;
- the assistant can read one explicit saved report or assembly by
  `projectId + childId`;
- assistant project reads do not expose write tools or hidden mutation;
- report patch apply/save remains user-reviewed and revision-backed;
- project workspace UI no longer feels like one mixed debug strip;
- project create/select, combination management, and report management are
  visually separated but still compact;
- mobile and desktop layouts have no horizontal overflow;
- existing material editor and report persistence workflows still pass.

### Explicit non-goals for this slice

- No calculator formula retuning.
- No engine source row import.
- No conversion of file-backed project storage to a database.
- No global seed catalog editor.
- No project material library route unless selected as a separate follow-up.
- No assistant write tools.
- No automatic report refresh from latest assembly values.
- No storage of full assistant chat transcripts in project records.
- No replacement of old `/workbench` or old scenario snapshot compatibility.

### Workstream A - Assistant/MCP Project Visibility

Goal: the assistant can discover accessible saved projects and read selected
project children without mutating project state.

Target contract shape:

```ts
type AssistantProjectReadAction =
  | "list_projects"
  | "read_project_summary"
  | "list_project_assemblies"
  | "read_project_assembly_snapshot"
  | "list_project_reports"
  | "read_project_report_document"
  | "list_project_report_revisions"
  | "read_project_report_revision";

type AssistantProjectReadResult = {
  mutates: false;
  ok: boolean;
  result?: JsonValue;
  errors?: string[];
};
```

Summary payload rules:

- project summary: id, name, clientName, ownerLabel, created/updated timestamps,
  assembly/report/scenario/audit counts, latest child timestamps;
- assembly summary: id, displayCode, name, kind, version, source, updated time,
  calculationSummary;
- report summary: id, displayCode, name, linked assembly id, status,
  currentRevisionId, revisionCount, sourceAssemblyVersion, updated time;
- revision summary: id, displayCode, source, created time, changeSummary,
  assistantPatchSummary, sourceAssemblyId/sourceAssemblyVersion;
- full report document or full assembly snapshot: only returned by explicit
  project/child read actions.

Error posture:

- invalid action or malformed input: `400`-style tool error;
- unauthenticated configured mode: `401`-style tool error;
- missing project id for project-bound action: `400`-style tool error;
- missing child id for child read: `400`-style tool error;
- not found or wrong owner: same not-found/access posture as project routes;
- helper exceptions from storage are mapped through the existing project storage
  error vocabulary where possible.

#### Step A1 - Add server-side project assistant read helpers

Likely files:

- `apps/web/features/workbench/report-assistant-project-tools.ts` or an
  equivalent new helper near `report-assistant-tools.ts`;
- `apps/web/features/workbench/report-assistant-tools.ts`;
- `apps/web/features/workbench/report-assistant-tools.test.ts`;
- `apps/web/lib/server-project-storage.ts` only if a small summary helper is
  needed.

Tasks:

- introduce typed read-only helper functions for:
  - `list_projects`;
  - `read_project_summary`;
  - `list_project_assemblies`;
  - `read_project_assembly_snapshot`;
  - `list_project_reports`;
  - `read_project_report_document`;
  - `list_project_report_revisions` or `read_project_report_revision`;
- keep every tool definition `mutates: false`;
- require `projectId` for every project-bound read;
- require both `projectId` and `assemblyId` / `reportId` / `revisionId` for child
  reads;
- return bounded summaries for list tools and full saved documents only for
  explicit child reads;
- reuse `resolveProjectRouteOwner`, `resolveProjectRouteAccess`,
  `projectAccessRefFromRecord`, and `createDefaultServerProjectRepository`
  rather than bypassing app authorization;
- normalize missing/wrong-owner behavior so the tool does not leak whether
  another owner's project exists.

Things to watch:

- `repository.readProject(owner.scope, projectId)` already returns `null` for a
  wrong owner. Keep that property instead of probing by global id.
- `GET /api/projects/:projectId` returns full project data today. Assistant list
  tools should not mirror that full payload by default.
- Reports can contain up to 100 revisions and large JSON documents. Revision
  list output should include ids, display codes, source, timestamps, change
  summaries, and assistant metadata, not every document body.
- Do not couple these helpers to browser localStorage or the report editor page;
  server-side assistant reads must work from persisted project storage.

Tests:

- tool definitions include the new project read tools and all remain
  `mutates: false`;
- `list_projects` returns only owner-scoped project summaries;
- list tools do not include full report bodies or full assembly snapshots;
- child reads reject missing `projectId`;
- child reads reject missing child id;
- wrong-owner and missing ids return the same not-found/access posture without
  existence leaks;
- full report read returns a saved report document and current revision metadata
  by explicit authorized ids.

#### Step A2 - Expose a bounded assistant project-read route

Likely files:

- new route under `apps/web/app/api/report-assistant/`;
- `apps/web/features/workbench/report-assistant-runtime-status.ts`;
- route tests near existing report assistant or project route tests.

Tasks:

- add a read-only assistant project context endpoint or tool-call endpoint that
  accepts a narrow action name and typed input;
- return `{ ok: true, result, mutates: false }` for successful reads;
- return route-style auth/access errors for unauthenticated or unauthorized
  reads;
- include the new read tools in runtime status so deploy/status checks show that
  project visibility exists;
- keep this endpoint separate from `/api/report-assistant/patch` so patch
  proposal remains validation-first and does not silently get a hidden write path.

Things to watch:

- Do not pass arbitrary tool names directly to untyped code. Use a discriminated
  union or explicit switch.
- Do not let a project read route become a general project API mirror. The goal
  is assistant-safe summaries and explicit selected-document reads.
- If no project is selected, the UI should show or return a useful
  "select a project/report" state rather than sending the whole project list into
  every assistant turn.

Tests:

- unauthenticated configured mode returns `401`;
- unsupported tool/action returns `400`;
- read-only tools return `mutates: false`;
- status route lists the project read tools;
- no route response includes secrets, auth labels beyond allowed owner/project
  labels, or full project JSON from a summary action.

#### Step A3 - Connect project context to assistant UX without a tool loop

Likely files:

- `apps/web/features/workbench-rebuild/report-editor.tsx`;
- `apps/web/features/workbench/report-assistant-request-client.ts`;
- existing report assistant context/building helpers if a small context summary
  type is needed.

Tasks:

- show the active project/report context in the report assistant panel when the
  report was opened from a saved project report;
- allow the assistant UI to fetch a selected project/report summary before a
  project-context answer;
- keep patch proposal requests focused on the current report document and
  signature;
- when selected project context is attached to a model request, attach only a
  bounded summary unless the user explicitly selected a saved report/assembly;
- make assistant copy clear about whether it is reviewing the current draft or a
  saved report revision.

Things to watch:

- The current model request says "Return only one ReportAssistantPatch JSON
  object" and does not run tools. Do not pretend the model can browse project
  storage until a real tool-loop path exists.
- Assistant project context can support explanations and selection, but applying
  edits still requires `validateReportAssistantPatch` and the existing UI Apply
  action.
- Stale document signatures must keep blocking patch application.

Tests:

- report editor shows project/report/revision context when opened from a saved
  report;
- assistant request with no selected project keeps existing behavior;
- selected-project summary fetch failure produces a recoverable assistant/UI
  message;
- assistant patch preview still validates against the current draft signature.

#### Step A4 - Saved report preview support

Likely files:

- `apps/web/features/workbench/report-assistant-tools.ts`;
- `apps/web/features/workbench/report-assistant-patch.ts`;
- project assistant tool tests.

Tasks:

- let a saved report document read by explicit project/report id be passed into
  existing patch preview validation;
- ensure preview does not mutate the saved report or create a revision;
- include current revision id/display code in preview result so the UI can say
  which saved report was reviewed.

Tests:

- previewing a patch against a saved report returns validation only;
- saved report record is unchanged after preview;
- stale document signature rejects as it does for current draft previews.

### Workstream B - Project Workspace UI/UX Refactor

Goal: keep the first-pass functionality but make project creation, project
selection, saved combinations, and saved reports feel like a deliberate workbench
management surface.

Target component ownership:

```text
calculator-workbench.tsx
  Owns calculation draft state, selected project ids, fetch/mutation handlers,
  rapid-submit guards, and bridge functions for save/load/open.

project-workspace-panel.tsx
  Orchestrates the visible project workspace sections.
  Receives data and callbacks; does not fetch directly in the first extraction.

project-workspace-identity.tsx
  Project create/select/refresh/active project summary.

project-workspace-combinations.tsx
  Saved combination list rows and row actions.

project-workspace-reports.tsx
  Saved report list rows and row actions.

project-workspace-row-actions.tsx or local helpers
  Optional shared compact action buttons only if it reduces duplication without
  hiding semantics.
```

This split is intentionally presentational first. It lets the UI be redesigned
without moving persistence semantics and without introducing a global project
store. A future hook can be extracted only after behavior is stable and tests
prove the component split did not change route calls.

Target visual hierarchy:

```text
Project workspace
  Project identity row
    Active project, status/counts, refresh, switch project
    Empty state create/select when no project is active

  Saved combinations
    Save current combination
    Compact rows: load, rename, duplicate, delete

  Saved reports
    Compact rows: open, rename, duplicate, archive/restore, delete
```

The hierarchy should make the user's question obvious: "Which project am I in?",
"Which layer combinations are saved here?", and "Which reports belong here?"
The current mixed strip makes those questions compete with each other.

#### Step B1 - Extract project workspace component boundaries

Likely files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`;
- new components under `apps/web/features/workbench-rebuild/`, for example
  `project-workspace-panel.tsx`,
  `project-workspace-identity.tsx`,
  `project-workspace-combinations.tsx`, and
  `project-workspace-reports.tsx`;
- optional shared row/action helpers if they reduce real duplication.

Tasks:

- move the current inline `calc-project-snapshot-section` markup into extracted
  presentational components without changing behavior first;
- pass state, selected records, busy flags, drafts, and handlers through typed
  props;
- keep server mutation logic in the existing workbench component or an explicit
  hook only after the component extraction is stable;
- keep current tests green before changing layout or copy.

Things to watch:

- Do not introduce global project state. The selected project is still local to
  workbench-v2 until a broader app state decision is made.
- Avoid a "prop soup" that hides mutation semantics. Props should make it obvious
  which handlers create, load, rename, duplicate, archive, delete, or refresh.
- Keep rapid-submit guards in place during extraction.

Tests:

- existing workbench-v2 E2E still creates a project, saves a combination,
  reopens a report, and passes rapid-submit guard checks;
- component/unit tests can render the extracted panel in empty, loading, active,
  and error states.

#### Step B2 - Redesign project identity and empty state

Tasks:

- replace the single mixed control strip with a clear project identity area;
- when no project is selected, show a compact empty state with:
  - project name input;
  - create project primary action;
  - existing project selector if projects exist;
  - "Browser-local draft" status;
- when a project is selected, show:
  - project name/client label;
  - counts for saved combinations and reports;
  - last updated label;
  - refresh action;
  - project switcher as a secondary control.

UI/UX rules:

- primary action in empty state is "Create project";
- after a project is active, child save/load actions should be more prominent
  than creating another project;
- do not place destructive child actions next to project creation;
- use compact badges for counts/status, not large cards;
- long project names should truncate or wrap without pushing buttons off-screen.

Tests:

- no-project state is understandable and has no disabled-only dead surface;
- active-project state keeps selected project visible on desktop and mobile;
- long project/client names do not overflow.

#### Step B3 - Replace saved-combination dropdown management with list rows

Tasks:

- show saved combinations as compact rows instead of relying only on a select;
- each row should show display code/name, kind, version, updated time, and
  calculation summary when available;
- row actions should include load, rename, duplicate, and delete;
- save current stack should remain a clear primary action inside the combinations
  area;
- if loaded assembly dirty detection is added, show "modified" state and offer
  save changes/save as new only when the behavior is implemented.

UI/UX rules:

- row actions should use icon buttons where meaning is standard, with accessible
  labels/tooltips;
- destructive delete needs confirmation and should not sit as the first row
  action;
- empty list copy should say what saving a combination does, without explaining
  internal snapshots.

Tests:

- can save a combination and see it as a row;
- can load/rename/duplicate/delete from row actions;
- delete blocked by linked reports still shows a recoverable error;
- mobile rows do not clip labels or actions.

#### Step B4 - Replace saved-report dropdown management with list rows

Tasks:

- show saved reports as compact rows under the active project;
- each row should show report display code/name, linked assembly if known,
  status, revision count/current revision id, and updated time;
- row actions should include open, rename, duplicate, archive/restore, and delete
  where allowed by existing behavior;
- archived reports should remain visible but visually de-emphasized and
  restorable.

UI/UX rules:

- "Open" should be the primary row action;
- archive/restore should be visually distinct from hard delete;
- report name editing should not be confused with editing the report document
  subject/title;
- if linked assembly is missing or archived, show a compact warning badge, not a
  blocking error.

Tests:

- report rows render draft and archived states;
- open saved report preserves project/report context;
- rename/duplicate/archive/restore/delete still use existing routes;
- mobile report list remains usable without horizontal scrolling.

#### Step B5 - Layout, responsive behavior, and copy polish

Tasks:

- decide whether the project workspace remains a top workbench band or moves
  child lists into the review/sidebar column. Keep the first implementation
  inside `/workbench-v2`;
- use full-width bands or unframed workbench sections, not nested cards;
- keep stable dimensions for row actions and controls so labels/loading states
  do not resize the layout;
- update copy from technical "snapshot" language to user-facing project,
  combination, report, revision, and draft terms;
- add inline loading/empty/error states for project list, combination list, and
  report list separately.

UI/UX rules:

- no horizontal overflow at desktop, tablet, or mobile widths;
- buttons must not have text clipped inside them;
- icon-only row actions require accessible labels and tooltips;
- status badges should be short and scannable;
- avoid one-note palette changes; reuse existing workbench design tokens.

Tests:

- Playwright desktop and mobile screenshots or assertions cover no horizontal
  overflow;
- empty, loading, active, error, and long-name states are covered by component
  tests where practical;
- keyboard focus order remains project -> combinations -> reports -> calculator
  controls.

#### Step B6 - Assistant context affordance in the UI

Tasks:

- show whether the current report assistant has active project/report context;
- from a saved report, display project/report/revision label near the assistant
  panel;
- do not imply assistant suggestions are saved until the user applies and saves
  through the existing report save flow;
- if project assistant read tools are not yet implemented, show no misleading
  "project-aware" claim in the UI.

Tests:

- assistant panel copy distinguishes current draft, saved report, and project
  context;
- applying a patch marks the draft dirty but does not mark the project saved;
- saving the assistant-adjusted draft creates a report revision as before.

### Edge-case checklist for both workstreams

- No selected project: workbench can still calculate and use browser-local draft
  state; assistant project reads should ask for a project selection.
- Selected project deleted or inaccessible: next read/save shows a recoverable
  error and preserves local workbench/report draft state.
- Wrong-owner id: project assistant tools and project UI route calls must not
  reveal existence.
- Long names: project, combination, report, and duplicate names stay within the
  160-character schema limit and remain visually usable.
- Rapid submit: create/save/duplicate/report-save buttons keep in-flight guards.
- Large payloads: summary actions do not return full snapshots/reports; explicit
  full reads still respect project byte limits.
- Archived report: can be restored/opened according to existing route behavior,
  but should not look like the primary active report.
- Linked assembly deleted/blocked: report remains openable from frozen report
  data; UI should explain source assembly status.
- Material changed after report: saved report remains frozen; new reports from
  loaded assemblies can use current material state.
- Stale report revision: assistant patch and report save both use current
  signatures/timestamps and reject stale writes.
- Preview/auth mode: behavior should stay owner-scoped and should not assume team
  membership exists.

### Risk and mitigation matrix

| Risk | Mitigation | Verification |
| --- | --- | --- |
| Assistant accidentally mutates project state | Expose only read/preview actions with `mutates: false`; no save/apply/delete tool names | Tool definition tests and route tests assert no mutating actions |
| Assistant leaks another owner's project existence | Use `readProject(owner.scope, projectId)` and existing access-policy responses | Wrong-owner route/tool tests |
| Model receives too much project data | Summary-first tools; full docs only by explicit project/child id | Tests assert list outputs omit report documents and assembly snapshots |
| Patch route becomes an implicit tool loop | Keep project-read endpoint separate from `/api/report-assistant/patch` | Patch endpoint tests remain focused on current context/document |
| UI refactor breaks working saves | Extract presentational components before behavior changes | Existing E2E passes after extraction |
| UI row actions cause accidental destructive operations | Confirm delete/archive semantics; visually separate destructive actions | Component/E2E tests for delete/archive paths |
| Mobile layout regresses | Stable row/action dimensions and no-overflow checks | Playwright mobile assertions/screenshots |
| Long labels break layout | Truncate/wrap names and keep action controls fixed | Long-name component tests |
| Parallel agents overwrite each other | Keep assistant and UI file ownership separate; update plan before shared route payload changes | Handoff note includes touched files and deferred work |
| Project material/report reproducibility breaks | Keep saved report/source snapshots frozen; do not auto-refresh report from latest assembly | Report persistence tests after UI changes |

### Execution playbook

Use this as the working method once implementation starts. Each phase should
land with focused tests before the next phase begins. If a phase uncovers a
larger design conflict, update this plan before widening scope.

#### Phase 0 - Baseline audit

Purpose: avoid starting from a false assumption while parallel agents are active.

Entry checks:

- run `git status --short` and identify unrelated dirty files;
- inspect whether `calculator-workbench.tsx`, `report-editor.tsx`, project route
  files, or report assistant files are being touched by another agent;
- read the current implementation-ready section of this plan;
- confirm no calculator runtime/source-of-truth file needs to be changed for the
  selected phase.

Actions:

- run or record the current focused baseline if time allows:
  - `pnpm --filter @dynecho/web exec vitest run lib/server-project-routes.test.ts lib/server-project-storage.test.ts --maxWorkers=1`;
  - `pnpm exec playwright test e2e/workbench-v2-material-editor.spec.ts --config=playwright.config.ts` when touching browser-visible project workspace behavior;
- note any unrelated typecheck/calculator failures rather than fixing them in
  this slice.

Exit criteria:

- touched-file ownership is clear;
- baseline failures, if any, are known and not caused by this slice;
- implementation target is either Assistant visibility or UI refactor, not both
  in the same unbounded edit.

#### Phase 1 - Assistant read helper contract

Purpose: establish the read-only project visibility layer before UI/model
integration.

Entry checks:

- `report-assistant-tools.ts` still exposes only read/proposal tools;
- project routes still use `resolveProjectRouteOwner` and
  `resolveProjectRouteAccess`;
- no new project material/write route is needed.

Actions:

- write tests for the project read helper contract first;
- implement a server-side helper that accepts explicit read actions and input;
- use the project repository through owner scope;
- map project/report/assembly/revision outputs to bounded summaries;
- return full report documents or assembly snapshots only from explicit
  project/child read actions;
- update tool definitions/runtime status only after helper behavior is tested.

Do not:

- add model tool-loop behavior;
- add assistant write tools;
- make helper reads depend on localStorage;
- expose `GET /api/projects/:projectId` full project payload as the default
  assistant project summary.

Exit criteria:

- helper tests prove read-only behavior, owner scoping, missing-id validation,
  and summary-first output;
- all assistant project read definitions are `mutates: false`;
- saved report and revision reads identify the exact report/revision being read.

#### Phase 2 - Assistant read route and status

Purpose: make project visibility callable by UI/assistant code without mixing it
into patch proposal.

Entry checks:

- Phase 1 helper tests pass;
- selected route shape is documented in this plan before implementation;
- auth behavior is aligned with existing report assistant routes.

Actions:

- add a narrow assistant project-read route under `/api/report-assistant/`;
- parse a discriminated action/input payload;
- call only the Phase 1 read helper;
- return route-style errors for auth, access, malformed input, and missing ids;
- include project read tool metadata in `/api/report-assistant/status`.

Do not:

- overload `/api/report-assistant/patch`;
- accept arbitrary tool names without an explicit switch;
- include full documents in list/status responses.

Exit criteria:

- route tests cover configured unauthenticated `401`, bad action `400`,
  wrong-owner behavior, summary output, and explicit full read;
- status route lists the tools and still reports `mutatingToolsExposed: false`.

#### Phase 3 - Assistant UX integration

Purpose: let the assistant surface project/report context while preserving the
existing apply/save safety model.

Entry checks:

- Phase 2 route and status tests pass;
- current report editor can still save manual and assistant revisions;
- project report context is available in the proposal preview/project context.

Actions:

- show project/report/revision context near the assistant panel when present;
- fetch bounded selected-project/report context only when the assistant UI needs
  it;
- keep `/api/report-assistant/patch` body centered on current report
  `context`, `document`, and `instruction`;
- keep `validateReportAssistantPatch`, Apply, and Save to project unchanged;
- make copy clear when an answer is about a saved report versus the current
  unsaved draft.

Do not:

- mark a patch as saved after Apply;
- auto-save assistant results;
- store assistant conversation transcripts in project records.

Exit criteria:

- report editor tests prove old no-project assistant behavior remains;
- saved-report context appears when opened from project storage;
- applying a patch still dirties only the draft until Save to project creates a
  revision.

#### Phase 4 - UI component extraction

Purpose: reduce `calculator-workbench.tsx` complexity without behavior changes.

Entry checks:

- no parallel agent is editing `calculator-workbench.tsx`;
- current project workspace E2E selectors and button labels are known;
- rapid-submit guard code is identified and will not be removed.

Actions:

- extract presentational project workspace components;
- keep fetch/mutation handlers in `calculator-workbench.tsx` for the first
  extraction;
- pass explicit props for records, selected ids, draft names, status, busy flags,
  and handlers;
- keep existing layout/copy as much as practical until extraction tests pass.

Do not:

- introduce a global project store;
- rewrite all project mutations into a hook in the same patch unless the
  extraction is already stable;
- redesign rows and layout before behavior-preserving extraction is green.

Exit criteria:

- existing route calls and mutation guards are unchanged;
- component tests or E2E confirm create project, save combination, open report,
  and rapid-submit behavior still work;
- `calculator-workbench.tsx` becomes smaller or at least has a clear project
  workspace boundary.

#### Phase 5 - Project identity redesign

Purpose: make the selected project state understandable before changing child
management.

Entry checks:

- Phase 4 extraction is green;
- project summary data needed for identity/counts already exists in client
  state;
- no additional backend route is required.

Actions:

- separate no-project empty state from active-project state;
- make create project the primary no-project action;
- make active project name/client/counts/status visible;
- keep project switch/refresh secondary once a project is active;
- handle long project names and loading/error states.

Exit criteria:

- project creation/selection is visually separate from combination/report
  management;
- mobile and desktop no-overflow checks pass for long project names;
- existing save/load/report flows still work.

#### Phase 6 - Saved combinations row redesign

Purpose: replace the saved-combination dropdown management with scannable
workbench rows.

Entry checks:

- project identity redesign is stable;
- saved assembly summaries include enough row metadata;
- delete/duplicate/rename/load route behavior is already covered.

Actions:

- render saved combinations as compact rows;
- include display code/name, kind, version, updated time, and calculation
  summary where available;
- expose load, rename, duplicate, and delete as row actions;
- keep Save combination primary for the current draft;
- preserve confirmation and recoverable errors for delete.

Exit criteria:

- user can create, see, load, rename, duplicate, and delete combinations from
  rows;
- row actions are keyboard/focus accessible;
- mobile row layout does not clip actions or labels.

#### Phase 7 - Saved reports row redesign

Purpose: make report records understandable and distinct from report document
editing.

Entry checks:

- saved report summaries include report code/name/status/current revision;
- open saved report flow still carries project/report context;
- archive/restore/delete behaviors are stable.

Actions:

- render saved reports as compact rows;
- include display code/name, linked assembly, status, revision count/current
  revision, and updated time;
- make Open the primary row action;
- keep rename/duplicate/archive/restore/delete as secondary row actions;
- visually de-emphasize archived reports without hiding them.

Exit criteria:

- user can open, rename, duplicate, archive/restore, and delete reports from
  rows;
- report name management is not confused with editing report subject/title;
- saved report open still hydrates the report editor from project storage.

#### Phase 8 - Final responsive and regression hardening

Purpose: prove the feature is usable and stable after both workstreams land.

Actions:

- run focused route/storage tests;
- run assistant tool/route/status tests;
- run report editor tests covering assistant apply/save revision;
- run workbench component tests for project workspace states;
- run Playwright desktop/mobile project workspace flow;
- run `git diff --check`;
- update this document with actual file names, route names, labels, and any
  deferred behavior.

Exit criteria:

- no known regression in project create/select, combination save/load, report
  save/reopen, assistant-adjusted report save, or material editor persistence;
- no horizontal overflow at tested desktop/mobile widths;
- remaining gaps are explicitly documented as follow-ups.

### Stop conditions

Pause implementation and update the plan before proceeding if any of these
conditions happen:

- a step requires changing calculator formulas or engine route ownership;
- a project assistant read needs write authority to satisfy the UI;
- a list payload needs full report documents to make the UI work;
- component extraction requires changing route payloads;
- project material canonical storage becomes necessary for the UI refactor;
- typecheck failures move from unrelated parallel files into touched files;
- another agent changes the same workbench/report assistant files mid-phase.

### Suggested implementation order

1. Add assistant project read helper tests first, then helper implementation.
2. Add the read-only assistant project route/status exposure.
3. Connect selected project/report context to assistant UI without changing patch
   apply/save semantics.
4. Extract project workspace components without changing behavior.
5. Redesign project identity and empty/active states.
6. Convert saved combinations to row-based management.
7. Convert saved reports to row-based management.
8. Run focused unit/route/component tests and desktop/mobile Playwright checks.
9. Update this plan with exact file names, route names, and any consciously
   deferred behavior.

Implemented route surface so far:

```text
GET  /api/projects/:projectId/assemblies
POST /api/projects/:projectId/assemblies
GET  /api/projects/:projectId/assemblies/:assemblyId
PATCH /api/projects/:projectId/assemblies/:assemblyId
DELETE /api/projects/:projectId/assemblies/:assemblyId
POST /api/projects/:projectId/assemblies/:assemblyId/duplicate

GET  /api/projects/:projectId/reports
POST /api/projects/:projectId/reports
GET  /api/projects/:projectId/reports/:reportId
PATCH /api/projects/:projectId/reports/:reportId
DELETE /api/projects/:projectId/reports/:reportId
POST /api/projects/:projectId/reports/:reportId/duplicate
POST /api/projects/:projectId/reports/:reportId/revisions
```

## User Intent

The user wants the saved-work model to match how acoustic consulting work is
actually organized:

- create a named project such as "Bilmem Ne Oteli";
- keep many saved layer combinations under that project;
- keep generated and edited reports under the same project;
- let reports stay linked to the layer combination they came from;
- preserve the exact report state after manual edits or assistant-approved
  corrections;
- let the assistant see the user's project/assembly/report context through safe
  project-aware read tools instead of relying only on the current browser page;
- avoid losing report edits when the browser is cleared or another device/session
  opens the project;
- keep custom project materials available to all saved combinations inside that
  project.

The desired mental model is:

```text
Project
  Bilmem Ne Oteli
    Project materials
    Saved layer combinations / assemblies
    Reports
      Drafts
      Assistant-corrected revisions
      Issued/exported versions
```

This is a product-level model, not just a technical "save current snapshot"
button.

## Current Implementation Findings

### Server project store already exists

Relevant files:

- `packages/shared/src/domain/project.ts`
- `apps/web/lib/server-project-storage.ts`
- `apps/web/app/api/projects/route.ts`
- `apps/web/app/api/projects/[projectId]/route.ts`
- `apps/web/app/api/projects/import-local/route.ts`
- `apps/web/lib/server-project-routes.test.ts`

Current `ServerProjectRecord` fields are:

- project identity: `id`, `name`, `clientName`, `description`, `teamId`;
- ownership: `ownerId`, `ownerLabel`;
- audit: `proposalAuditEvents`;
- calculator snapshots: `scenarioSnapshots`;
- saved workbench-v2 assemblies: `assemblies`;
- saved report documents and revisions: `reports`;
- version/timestamps: `schemaVersion`, `createdAtIso`, `updatedAtIso`.

Storage is file-backed JSON under `DYNECHO_PROJECT_STORE_DIR` or
`.dynecho/project-store`. It is not a database, but the schema is already close
to a future DB table shape.

Current constraints:

- `GET /api/projects` lists project summaries.
- `POST /api/projects` creates an empty project.
- `GET /api/projects/:projectId` reads one full project.
- `POST /api/projects/import-local` creates a new project and imports 1-8
  browser-local scenario snapshots.
- `GET/POST /api/projects/:projectId/assemblies` lists or appends saved
  workbench-v2 combinations.
- `GET/PATCH/DELETE /api/projects/:projectId/assemblies/:assemblyId` reads,
  renames, or deletes one saved combination with its full snapshot.
- `POST /api/projects/:projectId/assemblies/:assemblyId/duplicate` creates a
  new saved combination from an existing snapshot.
- `GET/POST /api/projects/:projectId/reports` lists or appends project reports.
- `GET/PATCH/DELETE /api/projects/:projectId/reports/:reportId` reads, renames,
  archives/restores, or deletes one saved report.
- `POST /api/projects/:projectId/reports/:reportId/duplicate` creates a new
  draft report from the current saved report document.
- `POST /api/projects/:projectId/reports/:reportId/revisions` appends a manual
  or assistant-sourced report revision with optional stale-update protection.
- assembly delete is blocked while a report still references the assembly.

### Workbench-v2 already has a restorable snapshot

Relevant files:

- `apps/web/features/workbench-rebuild/workbench-v2-project-snapshot.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-project-snapshot.test.ts`
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`

`dynecho.workbench-v2.snapshot.v1` currently stores:

- study mode: wall/floor;
- layer stack: layer ids, material ids, roles, thickness;
- selected layer;
- selected outputs;
- context inputs;
- custom materials;
- material visual overrides.

This is a good serializer for a saved layer combination. Its current UI label is
"Project snapshot", but the actual product concept is closer to "saved assembly"
or "saved layer combination".

Current workbench-v2 behavior:

- the project workspace panel can create/select a project;
- `Save combination` appends the current V2 snapshot under the selected project;
- `Load combination` restores a selected saved assembly including custom
  materials and material visual overrides;
- legacy `scenarioSnapshots` remain readable in project detail for migration or
  future conversion, but the primary workbench-v2 UI no longer exposes a legacy
  load action;
- `Open report` keeps the local handoff but now also carries project/report
  source metadata when a saved combination is selected;
- selected saved combinations can be renamed, duplicated, and deleted when no
  report still references them;
- the saved report selector lists project reports and `Open saved report`
  rehydrates the report editor from the selected project report.
- selected saved reports can be renamed, duplicated, archived/restored, and
  deleted from the project workspace.

Remaining product gap: richer project library views are still pending. The
current UI is a compact inline management surface, not a dedicated searchable
project library page.

### Report edits are now project-backable from the editor

Relevant files:

- `apps/web/features/workbench/simple-workbench-proposal-preview-storage.ts`
- `apps/web/features/workbench-rebuild/report-editor.tsx`
- `apps/web/app/workbench/proposal/proposal-preview-client-page.tsx`
- `apps/web/app/api/proposal-pdf/route.ts`
- `apps/web/app/api/proposal-docx/route.ts`

Current report edit persistence:

- packaged report preview uses localStorage key `dynecho:proposal-preview:v1`;
- local storage contains `baseDocument`, optional `customDocument`,
  `customizedAtIso`, and `savedAtIso`;
- local storage can now also carry optional project context:
  `serverProjectId`, `serverProjectAssemblyId`, `serverProjectReportId`,
  `serverProjectReportUpdatedAtIso`, `sourceAssemblySnapshot`,
  `sourceCalculationOutput`, and `sourceMaterialSnapshot`;
- `Save edits` still writes the browser-local draft for fast preview iteration;
- `Save to project` creates a project report when the preview was opened from a
  selected saved combination;
- `Save revision` appends a new project report revision after the first project
  report save and preserves the updated report id/timestamp in local preview
  context;
- saved report reopen can use local preview handoff or, if needed, a guarded
  `projectId` + `reportId` detail fetch from the report editor.

Current server project report behavior:

- PDF/DOCX export can append a `proposalAuditEvent` to a server project;
- the audit event records format, style, source, and scenario ids;
- project report routes now store the full report document, source assembly
  snapshot/version, source calculation output, material/visual snapshot, and
  report revisions;
- report list/detail/update/duplicate/delete routes now back the workbench-v2
  saved report selector and inline report management controls.

Conclusion: report audit events remain useful issue/export history, while
project report records are now the durable report library foundation.

### Report assistant state is local/context-bound today

Relevant files:

- `apps/web/features/workbench/report-assistant-tools.ts`
- `apps/web/features/workbench/report-assistant-tools.test.ts`
- `apps/web/features/workbench/report-assistant-conversation-storage.ts`
- `apps/web/features/workbench/report-assistant-patch.ts`
- `apps/web/app/workbench/proposal/configure/proposal-adjust-client-page.tsx`

Current assistant behavior:

- MCP-compatible report assistant tools are intentionally read-only or
  proposal-only: resolve metric reference, preview patch, find stale value
  mentions, research acoustic reference, and prepare calculator finding;
- the tool list explicitly does not expose `apply_report_patch`;
- patch application still happens in the report UI after validation and user
  review;
- assistant conversation history is stored in localStorage under
  `dynecho:report-assistant-conversation:v1`;
- applied assistant changes become part of the report draft in memory/local
  preview, but they are not durable under a project unless the report document
  itself is later saved somewhere durable.

This is the right safety posture for mutation, but it is incomplete for the new
project model. Once the user approves an assistant correction, the resulting
`SimpleWorkbenchProposalDocument` and its `reportAdjustments` need to be saved
as a project report revision. The assistant also needs safe project read context
so it can answer "which projects can I access?" or "show this project's reports"
without scraping transient browser state.

### Access model exists but needs new actions

Relevant files:

- `packages/shared/src/domain/project.ts`
- `apps/web/lib/project-access-policy.ts`
- `apps/web/lib/project-route-auth.ts`

Current actions include:

- `create_project`
- `list_projects`
- `read_project`
- `import_local_scenarios`
- `append_proposal_audit`
- `save_project_assembly`
- `delete_project_assembly`
- `save_project_report`
- `delete_project_report`
- `manage_project_materials`
- `manage_members`

The target model still needs project material library routes before custom
materials become canonical at project level. Assembly/report rename and duplicate
reuse the save actions; assembly/report delete and report archive use delete
actions.

## Whole-System Analysis

### Current concept map

The same user concept is currently split across several implementation concepts:

| User concept | Current implementation concept | Current storage | Gap |
| --- | --- | --- | --- |
| Project | `ServerProjectRecord` | file-backed JSON | Exists with first child collections. |
| Layer combination | `ServerProjectAssemblyRecord`, `WorkbenchV2ProjectSnapshot` | server `assemblies`, local workbench state | Named reusable project child exists with rename/delete/duplicate UI. |
| Project material library | Material Editor `customMaterials` | localStorage and copied into V2 snapshot | Usable in a snapshot, but not canonical at project level. |
| Illustration material colors | `MaterialVisualOverride[]` | localStorage and copied into V2 snapshot | Works for current stack; not yet managed as project-level visual system. |
| Report package | `ServerProjectReportRecord`, `SimpleWorkbenchProposalDocument` | localStorage preview handoff plus server `reports` | Durable create/revision, list/reopen, rename/archive/delete/duplicate now exist. |
| Report export history | `proposalAuditEvents` | server project JSON | Durable audit only; not a report library. |

The important architectural issue is not lack of persistence primitives. The
issue is that the persistence vocabulary is still implementation-driven
(`scenarioSnapshots`, `import-local`, `proposalAuditEvents`) rather than
user-driven (`projects`, `saved combinations`, `reports`, `project materials`).

### Current workbench-v2 data flow

```text
Material Editor
  -> customMaterials + materialVisualOverrides in React state
  -> localStorage dynecho:workbench-v2:material-editor:v1
  -> /api/estimate materialCatalog when calculating
  -> workbench-v2 snapshot when saving a project combination

Layer stack + context + outputs
  -> buildEstimatePayload()
  -> /api/estimate
  -> calculateAssembly()
  -> output rows + report handoff

Save combination
  -> buildWorkbenchV2ProjectSnapshot()
  -> POST /api/projects/:projectId/assemblies
  -> appends one ServerProjectAssemblyRecord under the selected project
```

Observations:

- the workbench-v2 snapshot is already the right payload shape for a saved
  layer combination;
- the primary save route now matches the desired product model by appending a
  named combination under an existing project;
- `Load combination` loads an explicit assembly id instead of guessing the
  latest scenario;
- legacy imported snapshots stay in project detail for migration evidence; the
  primary UI now routes saved work through explicit `assemblies`.

### Current report data flow

```text
Open report from /workbench-v2
  -> buildReportSnapshot()
  -> localStorage dynecho:proposal-preview:v1
  -> /workbench/proposal

Save edits in report editor
  -> storeSimpleWorkbenchProposalPreviewCustomizations()
  -> localStorage preview draft

Save to project / Save revision in report editor
  -> POST /api/projects/:projectId/reports
  -> or POST /api/projects/:projectId/reports/:reportId/revisions
  -> stores full SimpleWorkbenchProposalDocument and source snapshots

Open saved report from /workbench-v2
  -> GET /api/projects/:projectId/reports/:reportId
  -> localStorage dynecho:proposal-preview:v1
  -> /workbench/proposal?projectId=:projectId&reportId=:reportId
  -> report editor uses URL fallback if local preview is missing

Export PDF/DOCX
  -> POST /api/proposal-pdf or /api/proposal-docx
  -> render existing protected output
  -> optionally append proposalAuditEvent to server project
```

Observations:

- report editor mutates only report snapshot fields, not calculator truth; this
  is aligned with the UI rebuild rules;
- report edits can now be linked to a server project before export when the
  preview was opened from a selected saved combination;
- workbench-v2 now packages selected project metadata into the report document
  and source assembly/material/output snapshots into preview project context;
- export audit remains separate from the durable report document library.

### Legacy workbench vs workbench-v2 persistence

Legacy/simple workbench already has broader project persistence behavior:

- local saved scenarios can be imported into a server project;
- active server project state can be kept in UI state;
- proposal documents can carry `serverProjectId` and
  `serverProjectScenarioId`;
- PDF/DOCX exports use that id to append audit events.

Workbench-v2 has the newer Material Editor and cleaner snapshot shape. The first
project workspace slice now gives it the active server project identity that the
legacy/simple workbench already had in rougher form:

- it creates or selects one user-named project as the primary workspace;
- it saves the current V2 stack as an explicit named assembly/combination under
  that project instead of creating a technical project for every save;
- report handoff carries project id, assembly id, source workbench snapshot,
  calculation output, and material/visual snapshot;
- report edits can be saved back to the same project as report revisions.

Remaining workbench-v2 gaps are narrower and should be planned as separate
slices: canonical project-level material libraries, assistant/MCP read tools,
and optional conversion of old `scenarioSnapshots` into named saved
combinations.

### Shared-schema and endpoint constraints

The UI rebuild master plan originally blocked endpoint/shared-schema/storage
changes unless explicitly selected. This project workspace feature explicitly is
a storage/API/shared-schema feature, so it must be treated as a separate selected
backend+frontend product slice.

Constraints:

- calculator behavior and output values still must not move;
- protected PDF/DOCX output rendering must not be redesigned;
- proposal document JSON may be persisted, but renderer output should remain
  identical for the same document;
- shared project schema changes must be migration-aware because strict Zod
  parsing currently validates stored project files;
- endpoint additions must preserve current `/api/projects` and
  `/api/projects/import-local` behavior for old tests and old saved files.

### File-backed storage implications

The current project store writes one JSON file per project under owner scope:

```text
.dynecho/project-store/
  owners/
    <ownerId>/
      projects/
        <projectId>.json
```

This is acceptable for a first project workspace implementation, but it implies:

- child record mutations are read/modify/write operations on one project file;
- atomic writes through temp file + rename must remain mandatory;
- payload byte limits are needed for report documents and project-level material
  catalogs;
- large projects may eventually need a DB or split files, but that should not
  block the first slice;
- list routes should continue returning summaries, not full report documents,
  to avoid expensive payloads in the project dropdown.

### Auth and ownership implications

Project owner scope already distinguishes configured auth and preview mode:

- configured users get owner ids derived from configured auth mode and username;
- preview mode gets a separate owner namespace;
- route tests already cover owner isolation and configured/preview isolation.

The new child routes must reuse the same access helpers. The role matrix should
be extended deliberately:

| Role | Should read | Save assemblies | Save reports | Delete/archive | Manage materials |
| --- | --- | --- | --- | --- | --- |
| owner | yes | yes | yes | yes | yes |
| editor | yes | yes | yes | likely archive, not hard delete | maybe yes |
| reviewer | yes | no | no, or comment-only later | no | no |
| viewer | yes | no | no | no | no |

The first pass can keep team behavior owner-only in practice if no membership
source exists yet, but shared action vocabulary and tests should be ready.

### Report lifecycle analysis

Reports need a lifecycle distinct from assemblies:

```text
draft -> issued -> archived
```

Draft:

- editable;
- can be overwritten by "Save";
- can be linked to the current assembly snapshot;
- can show stale-source warnings.

Issued:

- should be immutable or require creating a new revision;
- can still be exported;
- export audit events should reference the issued report id and format.

Archived:

- hidden from default active lists;
- retained for audit/history;
- should not block normal assembly work unless explicitly required.

This matters because report text is not calculation truth. A report can contain
manual wording, assistant-applied patches, client-facing metadata, and export
style choices. It must not silently refresh when the assembly changes.

### Assistant-edited report lifecycle analysis

The user explicitly wants this flow to survive project reload:

```text
save layer combination
  -> generate/open report
  -> ask assistant to check or adjust report
  -> user reviews and applies patch
  -> save corrected report under project
  -> later reopen project and see the corrected report state
```

Current implementation already separates safe proposal generation from mutation:

- `preview_report_patch` validates and previews changes;
- `find_report_value_mentions` identifies stale literal mentions;
- UI review applies the patch only after the user accepts it;
- `SimpleWorkbenchProposalDocument.reportAdjustments` can record before/after
  values, source, scope, and whether the engine value was preserved.

Persistence must store the post-apply document, not just the assistant patch. A
project report save should capture:

- the full edited `SimpleWorkbenchProposalDocument`;
- the current `reportAdjustments` array;
- a compact assistant revision entry with instruction, validation summary,
  applied operations, source, and timestamps;
- the source assembly id and source assembly version used when the report was
  generated;
- the frozen material/visual snapshot used by the report.

The assistant's local conversation transcript is useful as draft UI context, but
it should not be the only audit source. It is bounded and local by design. The
durable project record should keep only review-grade assistant metadata, not
unbounded chat history.

Recommended revision rule:

```text
draft report save
  -> overwrite current draft revision with expectedUpdatedAtIso

assistant patch applied to draft
  -> mark draft dirty
  -> Save to project persists the full corrected document

issued report changed
  -> create new draft revision from issued revision
  -> preserve issued revision immutable
```

### Assistant and MCP project visibility analysis

The assistant should be able to discover project context without hidden writes.
The existing report assistant tool adapter is read-only/proposal-only and should
stay that way for the first project-aware expansion.

Needed capabilities:

- list accessible project summaries;
- read one project summary by id;
- list assemblies for a project with compact calculation summaries;
- list reports for a project with status, linked assembly, and revision summary;
- read a selected assembly snapshot only after project/assembly id validation;
- read a selected report document only after project/report id validation;
- preview report patch against a saved project report document;
- prepare, but not apply, proposed project/report edits.

Rules:

- assistant project tools must reuse the same owner scope and access policy as
  HTTP routes;
- summaries should be returned before full documents to avoid accidentally
  feeding large or stale payloads to the assistant;
- write-capable MCP tools are out of scope for the first pass. If added later,
  they must be separate tools with explicit user confirmation and route-level
  authorization;
- assistant responses should use project/report names for humans, while internal
  ids remain machine references;
- no tool may accept only a child id. It must receive `projectId` plus child id
  so ownership and cross-reference checks are unambiguous.

This makes assistant-visible project context realistic without giving the
assistant a backdoor around the app's project permissions.

### Identity and reference model analysis

The current project store already treats project ids as UUIDs. The expanded
model should continue that pattern and separate internal ids from display codes.

Recommended identity rules:

- internal ids are UUIDs generated by the server for projects, assemblies,
  reports, revisions, and project materials where possible;
- user-facing codes are separate display fields, such as `PRJ-2026-0001`,
  `ASM-0003`, `RPT-0002`, and `REV-02`;
- never use a display code as the storage primary key;
- never show raw UUIDs as the primary UI label;
- every child mutation must validate `projectId` and child id together;
- every report must store `sourceAssemblyId`, `sourceAssemblyVersion`, and a
  frozen source assembly snapshot;
- every report revision must store the previous revision id when created from an
  issued or assistant-corrected state;
- material ids must not collide with built-in seed ids, and project material ids
  should be unique within one project namespace.

Double-check rule for implementation:

```text
incoming route/tool request
  -> validate id format
  -> load project in owner scope
  -> find child by id inside that project
  -> validate version/updatedAt precondition
  -> apply mutation
  -> validate whole project schema
  -> atomic write
```

### Source-of-truth and stale-state analysis

The project store should become the durable source of truth for project
children. Browser storage should remain a draft handoff/cache:

- workbench-v2 localStorage: current unsaved draft and no-project fallback;
- proposal preview localStorage: temporary handoff to report editor;
- report assistant conversation localStorage: short assistant UI memory;
- server project record: durable project, assemblies, reports, material library,
  report revisions, and export audit.

Important stale-state rules:

- loading an assembly replaces the current workbench baseline and should reset
  unsaved-change comparison;
- editing a project material after an assembly is saved should mark loaded
  assemblies that depend on it as potentially stale unless the assembly has a
  frozen material snapshot;
- editing an assembly after a report is saved should not mutate the report;
- opening a stale report should show source assembly version/timestamp mismatch
  and offer "create new report from latest assembly" rather than auto-refresh;
- assistant patches must validate against the current report document signature
  so an old assistant response cannot silently edit a newer draft.

### Assembly lifecycle analysis

Assemblies also need lifecycle/state:

```text
unsaved current stack -> saved assembly -> modified draft -> saved revision
```

Recommended fields beyond the raw snapshot:

- `name`: user-visible label, e.g. "Guest room party wall";
- `description`: optional note;
- `kind`: wall/floor;
- `version`: increment on overwrite;
- `lastCalculatedAtIso`: optional;
- `calculationSummary`: compact status/value for list UI;
- `source`: `workbench_v2`, `legacy_import`, or future import source.

The UI should make overwrite vs save-as-new explicit. Accidentally overwriting a
saved assembly would be worse than making the user name a new combination.

### Material lifecycle analysis

Project materials have three overlapping roles:

1. reusable library items for future assemblies;
2. calculation inputs for the current assembly;
3. historical facts frozen into reports.

Rules:

- built-in seed materials remain immutable;
- user copies and new materials become project materials;
- project materials can be edited, but edits should not retroactively mutate
  issued reports;
- deleting a material should be blocked if any saved assembly/report references
  it, unless the user chooses a replacement;
- visual overrides are project-level defaults, but assembly/report snapshots
  should freeze the actual colors used by diagrams if reports later start using
  those colors.

### Compatibility analysis

Existing project records can contain only:

- `scenarioSnapshots`;
- `proposalAuditEvents`;
- no `assemblies`;
- no `reports`;
- no project material library.

The project workspace UI must not break these records. Recommended behavior:

- list old projects normally;
- show a compatibility area called "Imported snapshots" or "Legacy snapshots";
- allow "Convert to saved combination" from a scenario snapshot;
- do not auto-convert all snapshots on read because old technical snapshots may
  not have good user-facing names;
- keep `scenarioSnapshots` read support until old workbench storage is retired.

## Gap Matrix

| Area | Current state | Needed state | Risk |
| --- | --- | --- | --- |
| Project creation | Exists | Use as first-class workspace container | Low |
| Project selection in V2 | Server project dropdown exists | Active project header + child lists | Medium UI complexity |
| Save current combination | Creates new project via import route | Append/update assembly under active project | Medium schema/API change |
| Load combination | Loads latest scenario only | Load selected assembly by id | Medium |
| Report edit persistence | localStorage only | Server `ProjectReportRecord` | High payload/schema surface |
| Report export history | Audit event only | Audit event linked to report and assembly | Medium |
| Project materials | local/V2 snapshot copies | Project-level material library | Medium |
| Old project compatibility | Works for scenarios | Show/convert legacy snapshots | Medium |
| Access policy | Existing actions | New child mutation actions | Medium |
| Validation | Existing route/storage tests | More route + browser flow tests | Medium |

## Non-Goals For First Implementation

- Do not move project storage to a database yet.
- Do not redesign exported PDF/DOCX output.
- Do not change calculator formulas, calculator route selection, or output
  values.
- Do not globally edit built-in seed materials.
- Do not implement comments, review approvals, or team collaboration UI.
- Do not add folders/tags/search across all projects unless basic project child
  persistence is already stable.
- Do not migrate old `/workbench` Zustand scenario storage into workbench-v2 in
  the first pass.

## Recommended Product Model

Use a project-centered model with stable child records:

```ts
type ProjectWorkspace = {
  id: string;
  name: string;
  clientName?: string;
  description?: string;
  displayCode?: string;
  customMaterials: ProjectMaterialRecord[];
  materialVisualOverrides: ProjectMaterialVisualOverride[];
  assemblies: ProjectAssemblyRecord[];
  reports: ProjectReportRecord[];
  auditEvents: ProjectAuditEvent[];
  createdAtIso: string;
  updatedAtIso: string;
};
```

### Project material records

Project materials should live at the project level, not only inside each saved
assembly. Assemblies should reference material ids.

Reasoning:

- the user expects "Bilmem Ne Oteli" custom materials to be reusable across many
  wall/floor combinations;
- the Material Editor already produces schema-valid `MaterialDefinition` entries;
- project-level storage avoids copy/paste drift between combinations.

Important rule:

- report snapshots must freeze the exact material values used at report creation
  time. If a project material changes later, old reports must remain historically
  stable.

### Assembly records

Use "assembly" as the internal domain term and present it in UI as "Saved
combination" or "Layer combination".

```ts
type ProjectAssemblyRecord = {
  id: string;
  displayCode?: string;
  projectId: string;
  name: string;
  description?: string;
  kind: "wall" | "floor";
  snapshot: WorkbenchV2ProjectSnapshot;
  calculationSummary?: {
    status: "ready" | "needs_input" | "unsupported" | "error";
    primaryOutput?: string;
    primaryValueLabel?: string;
    selectedOutputs: string[];
  };
  version: number;
  createdAtIso: string;
  updatedAtIso: string;
};
```

The existing `WorkbenchV2ProjectSnapshot` can be reused as the snapshot payload
for phase 1. Later, a stricter project-workspace assembly schema can wrap it.

### Report records

Reports must be first-class project children.

```ts
type ProjectReportRecord = {
  id: string;
  displayCode?: string;
  projectId: string;
  assemblyId: string;
  sourceAssemblyVersion: number;
  name: string;
  reportDocument: SimpleWorkbenchProposalDocument;
  sourceAssemblySnapshot: WorkbenchV2ProjectSnapshot;
  sourceCalculationOutput?: unknown;
  sourceMaterialSnapshot: {
    customMaterials: MaterialDefinition[];
    materialVisualOverrides: MaterialVisualOverride[];
  };
  status: "draft" | "issued" | "archived";
  currentRevisionId: string;
  revisions: ProjectReportRevisionRecord[];
  createdAtIso: string;
  updatedAtIso: string;
};
```

Key rule:

- report records should store the edited `SimpleWorkbenchProposalDocument`, not
  only the export audit event. Export audit events can still be appended when a
  report is exported.

Recommended report revision wrapper:

```ts
type ProjectReportRevisionRecord = {
  id: string;
  displayCode?: string;
  reportId: string;
  projectId: string;
  sourceAssemblyId: string;
  sourceAssemblyVersion: number;
  document: SimpleWorkbenchProposalDocument;
  changeSummary?: string;
  source: "generated" | "manual" | "assistant" | "import";
  assistantPatchSummary?: {
    appliedAtIso: string;
    instruction?: string;
    operationCount: number;
    validationStatus: "valid" | "warning";
  };
  createdAtIso: string;
  createdByLabel?: string;
};
```

Revision rule:

- draft reports can update `currentRevisionId` in place if the user explicitly
  saves over the draft;
- issued reports should create a new draft revision when edited;
- assistant-corrected reports should store the corrected full document as the
  revision payload, with assistant metadata as explanation, not as the only
  source of truth.

### Display codes and internal ids

Use internal ids for data integrity and display codes for humans.

Recommended pattern:

| Entity | Internal id | Display code | UI label |
| --- | --- | --- | --- |
| Project | UUID | `PRJ-2026-0001` | Project name |
| Assembly | UUID | `ASM-0001` | Saved combination name |
| Report | UUID | `RPT-0001` | Report name |
| Report revision | UUID | `REV-01` | Revision badge |
| Project material | UUID or `pmat_...` | optional | Material name |

Implementation notes:

- display code generation can be per project and monotonic for assemblies,
  reports, and revisions;
- if the file-backed store cannot safely guarantee global project display code
  monotonicity yet, project display codes can be optional until a DB-backed
  sequence exists;
- route ids should remain UUIDs, not display codes;
- duplicate names can be allowed because ids and display codes disambiguate;
- MCP/tool responses should include both display labels and ids, but prompt
  answers should prioritize labels unless the user asks for ids.

### Why not reuse `scenarioSnapshots` only?

`scenarioSnapshots` are currently calculator payload containers. They are useful
but too generic for the target product model:

- they do not have report children;
- they do not have report edit state;
- they do not distinguish draft assembly saves from immutable calculation
  captures;
- they encourage creating new technical projects for each save;
- they do not express "many combinations under one project" cleanly in the UI.

Keep them for compatibility, but introduce project workspace child collections
or a schema v2 that gives assemblies and reports explicit names.

## Proposed Storage Evolution

### Conservative path

Extend `ServerProjectRecord` with optional arrays:

```ts
assemblies: ProjectAssemblyRecord[];
reports: ProjectReportRecord[];
projectMaterials: MaterialDefinition[];
projectMaterialVisualOverrides: MaterialVisualOverride[];
```

Pros:

- works with existing file store;
- smallest operational change;
- avoids DB migration now;
- existing `/api/projects` list/detail can be extended.

Cons:

- `ServerProjectRecordSchema` strict parsing means existing stored v1 files need
  migration/defaulting logic;
- large projects can grow into large single JSON files;
- concurrent writes require careful atomic read/modify/write semantics.

### Cleaner path

Create `SERVER_PROJECT_SCHEMA_VERSION = 2` and add a migration reader:

- parse v1 records;
- convert `scenarioSnapshots` into initial `assemblies` only when safe;
- keep original `scenarioSnapshots` for backward compatibility during phase 1;
- write v2 after the first project mutation.

Recommended: use a v2 migration-aware reader, but implement the first feature
additively and keep v1 fields until all old routes are updated.

## Proposed API Surface

Keep existing project routes and add explicit child routes:

```text
GET  /api/projects
POST /api/projects
GET  /api/projects/:projectId

GET  /api/projects/:projectId/assemblies
POST /api/projects/:projectId/assemblies
GET  /api/projects/:projectId/assemblies/:assemblyId
PATCH /api/projects/:projectId/assemblies/:assemblyId
POST /api/projects/:projectId/assemblies/:assemblyId/duplicate
DELETE /api/projects/:projectId/assemblies/:assemblyId

GET  /api/projects/:projectId/reports
POST /api/projects/:projectId/reports
GET  /api/projects/:projectId/reports/:reportId
PATCH /api/projects/:projectId/reports/:reportId
POST /api/projects/:projectId/reports/:reportId/revisions
DELETE /api/projects/:projectId/reports/:reportId

Future project material library route, not landed in the current project
workspace first pass:

GET   /api/projects/:projectId/materials
PATCH /api/projects/:projectId/materials
```

Route behavior:

- create assembly: save current workbench-v2 snapshot under selected project;
- update assembly: overwrite a named assembly after explicit user action;
- duplicate assembly: create a new assembly from an existing snapshot;
- create report: package current report document and source assembly snapshot;
- update report: persist edited report document from the report editor;
- delete report: remove draft/archive reports only after confirmation;
- project materials: save project-scoped Material Editor catalog and visual
  overrides.

Assistant/MCP-facing read surface can reuse the same route handlers internally
or wrap repository methods directly:

```text
list_accessible_projects
read_project_summary
list_project_assemblies
read_project_assembly_snapshot
list_project_reports
read_project_report_document
preview_saved_report_patch
```

These are capability names, not necessarily HTTP route names. The important
rule is that they are read-only/preview-only in the first implementation and
they require project id plus child id for any child read.

### API payload expectations

Create assembly request:

```ts
type CreateProjectAssemblyRequest = {
  calculationSummary?: ProjectAssemblyRecord["calculationSummary"];
  description?: string;
  name: string;
  snapshot: WorkbenchV2ProjectSnapshot;
};
```

Update assembly request:

```ts
type UpdateProjectAssemblyRequest = {
  calculationSummary?: ProjectAssemblyRecord["calculationSummary"];
  description?: string;
  expectedVersion?: number;
  name?: string;
  snapshot?: WorkbenchV2ProjectSnapshot;
};
```

Create report request:

```ts
type CreateProjectReportRequest = {
  assemblyId: string;
  name: string;
  reportDocument: SimpleWorkbenchProposalDocument;
  sourceAssemblySnapshot: WorkbenchV2ProjectSnapshot;
  sourceCalculationOutput?: JsonValue;
  sourceMaterialSnapshot: {
    customMaterials: MaterialDefinition[];
    materialVisualOverrides: MaterialVisualOverride[];
  };
};
```

Update report request:

```ts
type UpdateProjectReportRequest = {
  expectedUpdatedAtIso?: string;
  name?: string;
  reportDocument?: SimpleWorkbenchProposalDocument;
  status?: "draft" | "issued" | "archived";
};
```

Create report revision request:

```ts
type CreateProjectReportRevisionRequest = {
  assistantPatchSummary?: ProjectReportRevisionRecord["assistantPatchSummary"];
  changeSummary?: string;
  document: SimpleWorkbenchProposalDocument;
  expectedReportUpdatedAtIso?: string;
  source: "generated" | "manual" | "assistant" | "import";
};
```

Project assistant summary response:

```ts
type ProjectAssistantSummary = {
  id: string;
  displayCode?: string;
  name: string;
  clientName?: string;
  assemblyCount: number;
  reportCount: number;
  materialCount: number;
  updatedAtIso: string;
};
```

Assistant-facing payloads should be summary-first:

- project lists never include full report documents;
- report lists never include full report body text unless the report id is
  explicitly requested;
- assembly lists include compact calculation summaries, not the whole layer
  snapshot unless the assembly id is explicitly requested.

Project detail response should eventually distinguish summary from heavy
payloads:

- `GET /api/projects` should stay summary-only;
- `GET /api/projects/:projectId` can return full project metadata plus child
  summaries;
- loading a specific report document may need a child route when reports become
  large;
- first pass can return full JSON from detail if payload limits are conservative,
  but the route shape should not assume this will scale forever.

### Error and conflict rules

Route errors should match existing project route style:

- invalid payload: `400` with Zod issues;
- project not found or wrong owner: existing `project_not_found` / access error;
- assembly/report not found: `404`;
- deleting an assembly with reports: `409`;
- version conflict when `expectedVersion` or `expectedUpdatedAtIso` mismatches:
  `409`;
- payload too large: `413`;
- attempting to overwrite issued report: `409` unless creating a revision;
- assistant/tool read without project access: same not-found/access behavior as
  HTTP routes, without leaking whether another owner's id exists.

## UI/UX Direction

### Project selector

The first pass has replaced the user-facing "Project snapshot" workflow in
`/workbench-v2` with a compact project workspace section:

- selected project name;
- create/select project;
- project status badge;
- quick counts: assemblies, reports, custom materials;
- save combination action.

Avoid making this a marketing-like landing page. It should stay a dense
workbench utility surface.

Detailed behavior:

- when no project is selected, show "Browser-local draft" and primary action
  "Create project";
- after project creation, keep that project active for assembly/report saves;
- project selection should not automatically overwrite the current unsaved layer
  stack; loading a saved assembly should be explicit;
- if the current stack has unsaved changes and the user switches project, show a
  confirm/save choice;
- project dropdown labels should include project name, client name if available,
  and updated date, not raw ids.

Current first-pass gap: the control is still a compact inline form/dropdown
surface and the project creation/selection flow needs a UI refactor before the
workspace is product-ready. A future project workspace surface should make
create/select/manage actions clearer, separate project identity from child
assembly/report management, add search once project counts grow, improve empty
and loading states, and keep dense workbench ergonomics without feeling like a
temporary debug panel.

### Saved combinations panel

Add a project panel or section:

- list saved combinations under the active project;
- show name, kind, layer count, thickness, latest primary metric, updated time;
- actions: load, save changes, save as copy, rename, delete;
- clearly mark unsaved changes compared with the loaded assembly.

Current first pass: create, explicit load, rename, duplicate, and delete are
implemented. "Save changes" over an existing saved combination and unsaved-dirty
badges are still future hardening; current saves create a new named combination
unless the user renames/duplicates/deletes an existing child.

Suggested UI labels:

- "Saved combinations" for the list;
- "Save combination" for the current stack;
- "Save as new" when editing an existing combination.

Detailed behavior:

- first save asks for a combination name;
- if a saved assembly is loaded, primary action becomes "Save changes";
- secondary action stays "Save as new";
- each row should show wall/floor, layer count, total thickness, primary result
  if known, and last updated time;
- rows with missing materials should show a warning badge but remain loadable;
- loading an assembly must restore layers, context, selected outputs, custom
  material snapshot, visual overrides, and selected layer where possible.

### Reports panel

Project reports should be visible from the same project context:

- report name;
- linked assembly name;
- status: draft/issued/archived;
- revision badge and source, e.g. `REV-02 assistant`;
- last edited/exported time;
- actions: open editor, export PDF/DOCX, duplicate, archive/delete.

The report editor should expose:

- "Save to project";
- "Save as report";
- linked assembly name and snapshot timestamp;
- stale-source warning if the assembly was updated after the report snapshot.

Current first pass: report create, revision save, list, reopen, rename,
duplicate, archive/restore, and delete are implemented. The UI still needs a
clearer distinction between the project report library name and editable report
document fields such as subject/client-facing title.

Detailed behavior:

- a report can be created only after there is either a saved assembly or an
  explicit "save assembly with report" operation;
- "Open report" from the workbench should create a local preview, but the report
  editor should know the intended project/assembly link;
- report editor "Save to project" creates or updates a `ProjectReportRecord`;
- saved reports open directly from project context, without relying on the
  localStorage preview handoff;
- exported PDF/DOCX uses the saved report document as request payload and appends
  audit metadata after successful generation.
- assistant-applied corrections should show as normal saved report revisions,
  not as invisible chat side effects.

### Assistant-aware report editing UX

The assistant should make project work easier without hiding mutation.

Recommended behavior:

- assistant panel can show the active project, linked assembly, report id/code,
  and revision;
- assistant can say which saved report it is reviewing before it proposes a
  patch;
- assistant patch preview remains separate from "Apply";
- applying a patch marks the report draft dirty;
- "Save to project" persists the corrected document as a report revision;
- if the assistant response was created against an old document signature, the
  UI blocks apply and asks for a fresh preview;
- the report editor should show "Saved to project" only after the server save
  succeeds, not after local draft mutation.

Do not show raw UUIDs in normal UI. The user should see:

```text
Bilmem Ne Oteli / Guest room party wall / RPT-0002 / REV-02
```

The raw ids can stay in developer details or copied diagnostics.

### Project visibility for assistant UX

When the user asks the assistant about projects, the assistant should use a
bounded project summary surface:

- "projects I can access" list with project name, client, counts, updated time;
- selected project summary with saved combinations, reports, and material count;
- report list grouped by linked assembly;
- no full report body unless a specific report is opened or explicitly selected;
- no write action unless the user confirms through app UI.

This prevents the assistant from requiring the user to manually restate project
context and avoids sending large project JSON into an assistant turn by default.

### Material Editor integration

Current Material Editor is project-local in spirit but stored at workbench
state/snapshot level. For the new model:

- project-level custom materials become the canonical editable material library;
- assemblies reference project material ids;
- saving an assembly should include a material snapshot for replay safety;
- reports must freeze the material values used when the report was created.

Detailed behavior:

- Material Editor can show "Project material library" when a project is active;
- creating a material under a project should update the project library before
  assemblies reference it;
- editing a project material should show where it is used by saved combinations;
- deleting a project material should be blocked when used by saved assemblies or
  reports unless a replacement material is selected;
- visual overrides can remain editable in the same Material Editor but should be
  labeled as visual defaults for the project library.

### Navigation and information architecture

Recommended first-pass IA inside `/workbench-v2`:

```text
Project workspace header
  Active project / create project / project switcher / counts

Main calculator column
  Setup
  Layer stack
  Material Editor
  Layer illustration

Review/sidebar column
  Current result
  Outputs
  Saved combinations
  Reports
  Report handoff
```

The saved-combinations and reports lists should be compact sidebar/workbench
sections, not separate landing pages. A future full project dashboard can be
added later if project count grows, but the first workflow should stay inside
the engineering workbench.

Report editor IA after project persistence:

```text
Report header
  Project / report name / linked assembly / saved status

Preview lane
  Existing HTML preview

Editor lane
  Save to project / save as report / export PDF/DOCX
  Manual fields
  Assistant patch review
```

The report editor should avoid independently inventing project state. It should
load report records from project routes or accept a handoff payload that can be
saved into a project.

### UI/UX principles for this slice

Use the existing workbench tone: dense, technical, and task-focused.

Principles:

- project controls should be compact and near the current work context;
- saved combinations and reports are operational lists, not marketing cards;
- do not nest card surfaces inside other cards;
- use icon buttons for load, duplicate, archive/delete, and export where the
  existing icon library is available;
- destructive actions require a confirmation step and should explain blocking
  references such as linked reports or used materials;
- button labels must fit on mobile without horizontal overflow;
- long project/report names should truncate with tooltips or wrap in list rows
  without changing control sizes;
- stale warnings should be visible but not modal unless the user is about to
  overwrite or issue/export a stale report;
- project and report display codes are secondary badges, not the primary name;
- assistant/project context should be visible in the report editor header so the
  user knows what will be saved.

Responsive expectations:

- desktop can show project header, calculator, layer illustration, saved
  combinations, and reports without layout shifts;
- tablet can stack project child lists under results while keeping save/load
  actions reachable;
- mobile can create/select a project, save a combination, open reports, and save
  report edits without clipped text or sideways scrolling;
- the first project workspace implementation should pass a no-horizontal-overflow
  browser check at common desktop and mobile widths.

## Edge Cases And Rules

- Missing material id on load: keep the layer visible and mark the material
  missing; do not silently remap to a seed material.
- Material changed after assembly save: assembly should use the project material
  current value when loaded only if the assembly has not frozen a material
  snapshot. Prefer freezing for reproducible calculations.
- Material changed after report creation: old report must not change.
- Deleted project material still used by assemblies: block deletion or require a
  replacement material.
- Deleted assembly with reports: block deletion unless reports are archived or
  explicitly detached.
- Report edited after source assembly changed: show stale-source warning, do not
  auto-update report text.
- Duplicate names: allow but disambiguate with timestamps, or enforce unique
  names per project for assemblies and reports.
- Large report documents: enforce payload byte limits similar to
  `MAX_SCENARIO_SNAPSHOT_BYTES`; do not allow unbounded JSON files.
- Concurrent saves: file store must read latest project, apply mutation, validate,
  and atomically rename temp file. Last-write-wins should be visible through
  `updatedAtIso`.
- Access roles: viewers/reviewers can read; editors can save assemblies/reports;
  owners can delete/manage materials/members.
- Import old snapshots: old server projects with only `scenarioSnapshots` should
  still open; the UI can offer "Convert latest snapshot to saved combination".
- Export audit: PDF/DOCX export should append audit events to the project and
  optionally to the report record.
- Assistant-approved report patch: applying the patch edits only the draft until
  `Save to project` succeeds.
- Assistant patch from stale document signature: block apply and ask for a fresh
  preview.
- MCP/project tool read: require project id and child id together; never resolve
  a child id globally.
- Report revision display code collision: regenerate or reject before write; do
  not rely on display code as primary key.
- Tool payload growth: assistant project list tools return summaries first and
  full documents only by explicit id.

### Detailed edge-case matrix

| Case | Expected behavior |
| --- | --- |
| Active project deleted from another session | Current UI should fail the next save/load with project-not-found and keep local draft intact. |
| Assembly renamed | Reports keep `assemblyId`; UI can display latest assembly name plus original source snapshot name if stored. |
| Assembly overwritten after report created | Report remains unchanged and shows stale-source warning. |
| Report created from unsaved current stack | Offer "Save combination and report" so the report has an assembly id. |
| Report saved without export | It appears as draft under project reports; no export audit event is appended yet. |
| Issued report edited | Block direct edit or require "Create new revision". |
| Project material id collides with built-in seed id | Reject, matching current `/api/estimate` seed-collision behavior. |
| Custom material malformed on project load | Drop invalid entry with warning; keep layers referencing it visible as missing. |
| Assembly references missing material | Load with missing-material state and `needs_input`/blocked calculation where appropriate. |
| Report references missing material | Report still opens because it stores frozen source material snapshot. |
| Duplicate assembly/report names | Prefer allow-with-disambiguation in list; hard uniqueness can frustrate revisions. |
| Project JSON exceeds byte limit | Mutation fails with `413`; existing project file remains unchanged. |
| Viewer attempts save | `403`, no mutation. |
| Preview-mode project opened by configured user | Existing owner-scope isolation returns empty/not found. |
| Browser localStorage cleared | Project, assemblies, reports, and project materials reload from server store. |
| Assistant patch applied but not saved | Draft shows unsaved changes; project record remains unchanged until explicit save. |
| Assistant patch targets old document signature | Apply is blocked; user must rerun preview on current report. |
| Assistant-corrected draft saved | Project report current revision stores the full corrected document plus assistant summary metadata. |
| Issued report receives assistant correction | Create a new draft revision from the issued document; issued revision remains immutable. |
| User asks assistant to list projects | Tool returns accessible project summaries only, scoped by owner/access policy. |
| Assistant reads report without project id | Reject request because child ids are not globally resolvable. |
| Assistant/project tool gets another owner's id | Return the same not-found/access behavior as app routes; do not leak existence. |
| Display code duplicates after concurrent save | Internal UUID remains authoritative; server should regenerate/reject duplicate display code before atomic write. |
| Report references assembly that was archived | Report still opens; UI labels source assembly archived and blocks auto-refresh. |
| Project material edited after assistant-corrected report | Saved report remains frozen; new report from latest assembly can use updated material. |
| Large assistant conversation exists locally | Persist only bounded revision metadata and report document, not the entire local conversation transcript. |

## Cross-Cutting Implementation Invariants

These rules should hold after every slice. If one is hard to satisfy, pause and
document the tradeoff before continuing.

Data ownership:

- `ServerProjectRecord` owns project children; assemblies/reports/materials
  should not become independent global records in the first pass.
- Every assembly/report/material mutation must happen inside one owner-scoped
  project record.
- No route or MCP/tool helper should update a child by child id alone.

Report integrity:

- every report must reference an existing `assemblyId` inside the same project
  unless it is an explicitly imported/detached legacy report;
- `currentRevisionId` must resolve to a revision inside the same report;
- a report revision stores a full `SimpleWorkbenchProposalDocument`, not a
  partial patch;
- assistant metadata explains a saved revision but never replaces the saved
  report document;
- issued revisions are immutable. Editing an issued report creates a new draft
  revision.

Assembly and material integrity:

- saved assembly snapshots must be enough to recalculate or show a recoverable
  `needs_input` state after reload;
- project material ids must not collide with built-in seed ids;
- `MaterialDefinition` remains calculation data; illustration colors stay in
  visual override state;
- reports freeze material/visual snapshots used for the report so later project
  material edits do not rewrite history.

Storage and migration integrity:

- v1 scenario-only project files must continue to parse;
- new arrays should default to empty during migration;
- `scenarioSnapshots` stay legacy/import history until old workbench flows have
  an explicit retirement path;
- every write validates the whole project record before atomic rename;
- localStorage is a draft/cache/handoff layer, not the durable source of truth
  once a project-backed save succeeds.

Assistant/tool integrity:

- first-pass MCP-compatible project tools are read-only or preview-only;
- assistant patch application remains a UI-reviewed action;
- saving a report after assistant correction is a normal project route save, not
  a hidden tool mutation;
- assistant project list/read payloads are bounded summaries unless the user or
  UI selects a specific project child.

## Implementation Plan

Use this section as the implementation checklist. Each step should be completed
with tests before moving to the next one because multiple agents may be touching
adjacent calculator/UI surfaces.

Global implementation rules:

- do not change calculator formulas, route selection, or output values;
- do not remove current localStorage fallback paths until project-backed flows
  are green;
- do not overload `/api/projects/import-local` for normal workbench-v2 saves;
- do not add assistant write tools in the first pass;
- always validate whole project records after mutation and before atomic write;
- keep project summaries summary-sized; fetch full snapshots/reports by id.

Parallel-agent rules:

- run `git status --short` before editing and ignore unrelated dirty files;
- keep this slice in project/workbench/report/tool surfaces unless a selected
  schema boundary requires a shared-domain edit;
- do not edit `packages/engine/src` or calculator docs for this project feature;
- avoid broad formatting or generated churn in files touched by other agents;
- if another agent changes a file needed by this slice, read the new file state
  and adapt rather than reverting it;
- update this plan when an implementation decision changes a route name, record
  field, or slice boundary.

### Step 0 - Baseline audit and fixtures

Files likely involved:

- `docs/ui/PROJECT_WORKSPACE_MODEL_PLAN_2026-06-12.md`
- `apps/web/lib/server-project-routes.test.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-project-snapshot.test.ts`
- `apps/web/features/workbench/report-assistant-tools.test.ts`

Tasks:

- capture current project route behavior with existing tests;
- create representative test fixtures for:
  - v1 scenario-only project;
  - v2 project with assemblies/reports/materials;
  - assistant-corrected draft report;
  - issued report with immutable revision;
- document any test fixture ids and display codes so later route/UI tests reuse
  the same vocabulary.

Detailed cautions:

- fixtures should use real `WorkbenchV2ProjectSnapshot` and
  `SimpleWorkbenchProposalDocument` shapes, not hand-wavy partial objects that
  would bypass parser bugs;
- keep fixture report documents small enough for readable tests but complete
  enough to pass existing proposal parser behavior;
- do not touch `packages/engine/src` for this step.

Exit criteria:

- current project route tests still pass;
- fixture parsing tests fail only for the fields not yet implemented, or are
  introduced together with Step 1 schema work.

### Step 1 - Shared schema design

Files likely involved:

- `packages/shared/src/domain/project.ts`
- `apps/web/lib/project-access-policy.ts`
- related route/policy tests.

Tasks:

- add project child record schemas for assemblies and reports;
- add report revision schema with `source`, `document`,
  `assistantPatchSummary`, and source assembly references;
- add internal id/display code fields without making display code the primary
  key;
- add material library fields or a clear `projectMaterialState` wrapper;
- add route access actions for saving/updating/deleting assemblies and reports;
- add read actions for assistant/project visibility if they need separate policy
  entries from normal project read;
- add byte limits for assembly/report payloads;
- add migration/default parsing for existing v1 records.

Do not:

- change calculator formulas;
- retune output values;
- remove `scenarioSnapshots` in the first pass.

Detailed cautions:

- `ServerProjectRecordSchema` is strict; adding required fields without a
  migration/default parser will break every existing stored project file.
- New action ids must be added to `ServerProjectAccessActionSchema` and mirrored
  in `project-access-policy.test.ts`; otherwise route authorization vocabulary
  and tests drift.
- Shared schemas should use `JsonValueSchema` only for intentionally opaque
  payloads. Named project child fields should be typed where practical.
- Reuse `WorkbenchV2ProjectSnapshot` for first assembly payloads, but do not
  confuse its `name` with the assembly record name. The assembly record is the
  user-facing saved-combination name.
- Do not store assistant patch metadata without the resulting full report
  document; patch metadata is explanatory, not authoritative.
- Keep report revision document parsing aligned with the existing proposal
  document parser so PDF/DOCX routes keep receiving known shapes.

Tests:

- v1 project record parses with empty/default child collections;
- v2 project record parses with assemblies, reports, revisions, and material
  state;
- invalid child ids/display codes fail where expected;
- report revision with assistant metadata still requires a valid full proposal
  document;
- access action schema accepts new child mutation/read actions.

### Step 2 - Repository methods

Files likely involved:

- `apps/web/lib/server-project-storage.ts`
- `apps/web/lib/server-project-storage.test.ts`
- `apps/web/lib/server-project-routes.test.ts`

Tasks:

- add `appendAssembly`, `updateAssembly`, `deleteAssembly`;
- add `appendReport`, `updateReport`, `deleteReport`;
- add `appendReportRevision` or equivalent revision creation method;
- add project material update method;
- add server-side id and display-code generation helpers;
- preserve owner isolation and team access behavior;
- keep atomic writes through temp file rename.

Detailed cautions:

- Every mutating method should read the latest stored project, validate access at
  route level, build a complete updated record, validate with the shared schema,
  and then write atomically.
- Do not mutate arrays in place. Return new arrays so tests can reason about
  before/after state.
- Keep project summaries cheap. `summarizeServerProject` should include child
  counts and latest timestamps, not full report documents.
- Enforce max counts for child records, similar to `MAX_PROJECT_SCENARIOS`, to
  prevent one project file from becoming unbounded.
- Validate `projectId` plus child id on every child mutation. Do not write helper
  methods that update an assembly/report by child id alone.
- Use expected version or expected timestamp checks for overwrite operations so
  two tabs cannot silently overwrite each other.
- Generate display codes inside the repository mutation where the latest project
  state is available.

Tests:

- append two assemblies and verify stable ids/display codes;
- update assembly with correct expected version and reject stale version;
- append report and create assistant-sourced revision;
- issued report edit creates or requires a new draft revision;
- display-code collision is regenerated or rejected before write;
- owner isolation still blocks every child mutation path;
- oversized project child payload leaves the existing project file unchanged.

### Step 3 - API routes

Files likely involved:

- `apps/web/app/api/projects/[projectId]/assemblies/route.ts`
- `apps/web/app/api/projects/[projectId]/assemblies/[assemblyId]/route.ts`
- `apps/web/app/api/projects/[projectId]/reports/route.ts`
- `apps/web/app/api/projects/[projectId]/reports/[reportId]/route.ts`
- `apps/web/app/api/projects/[projectId]/reports/[reportId]/revisions/route.ts`
- `apps/web/app/api/projects/[projectId]/materials/route.ts`

Tasks:

- validate payloads with shared schemas;
- route through access policy;
- return updated project summary or child record;
- add summary GET routes for assemblies/reports before exposing heavy payloads
  broadly;
- add full child GET routes for explicit assembly/report id loads;
- add revision create route for assistant/manual saved revisions;
- keep error shapes consistent with current project routes.

Detailed cautions:

- Quote bracketed route paths in shell/tests, as existing
  `apps/web/app/api/projects/[projectId]/route.ts` needs escaping in zsh.
- Do not overload `/api/projects/import-local` for normal saves. Keep it as a
  compatibility import route.
- Add route tests before UI work so workbench implementation does not need to
  guess response shapes.
- For report routes, store JSON report documents, not rendered PDF/DOCX blobs in
  the first pass.
- Do not expose full report documents from `GET /api/projects` project list.
- Route tests should assert wrong-owner reads/mutations do not leak whether the
  project id exists.

Tests:

- create project, create assembly, create report, create report revision, reload;
- `GET` list routes return summaries without full report documents;
- child `GET` routes return full payload only for authorized project/child ids;
- stale expected timestamp/version returns `409`;
- viewer can read but cannot mutate child records;
- wrong owner receives existing not-found/access semantics.

### Step 4 - Workbench-v2 project workspace UI

Files likely involved:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- possibly new extracted components under `apps/web/features/workbench-rebuild/`.

Tasks:

- replace "Save server snapshot" mental model with selected project + saved
  combinations;
- create/select project;
- save current layer stack as named assembly;
- load a selected assembly into current workbench state;
- keep active project id and active assembly id separate from current unsaved
  draft state;
- show unsaved changes against loaded assembly.

Keep UI consistent with the current dense workbench style:

- compact controls;
- no landing-page hero;
- no nested card stacks;
- responsive controls with no horizontal overflow.

Detailed cautions:

- Preserve the current calculate-on-input behavior. Saving an assembly should
  not be required before the user can calculate.
- Use the active project only for persistence; `/api/estimate` should continue
  receiving explicit layers/context/materialCatalog payloads.
- Keep current browser-local Material Editor fallback while project persistence
  is being introduced. Removing local fallback too early would make no-project
  workbench use worse.
- Loading an assembly must clear layer undo history because it replaces the
  current stack baseline.
- Project switch should not automatically call `load latest`; the user should
  choose a saved combination.
- Project creation should not force an immediate save of the current stack
  unless the user confirms "Save combination".
- Unsaved changes should compare against the loaded assembly snapshot, including
  layers, context, selected outputs, custom materials, and visual overrides.

Tests:

- create/select project in workbench-v2;
- save current state as named assembly;
- load saved assembly and verify layers/context/materials/visual overrides;
- switch project with unsaved changes and keep the local draft intact;
- browser E2E confirms no horizontal overflow on desktop and mobile widths;
- existing `/api/estimate` payload stays explicit and does not depend on project
  id.

### Step 5 - Report editor project persistence

Files likely involved:

- `apps/web/features/workbench-rebuild/report-editor.tsx`
- `apps/web/features/workbench/simple-workbench-proposal-preview-storage.ts`
- `apps/web/app/workbench/proposal/proposal-preview-client-page.tsx`
- export routes.

Tasks:

- add "Save to project" in report editor;
- create/update `ProjectReportRecord` with edited document;
- create report revision when assistant/manual correction should be preserved;
- keep localStorage preview as a temporary handoff/cache only;
- open report editor from a saved report id;
- export PDF/DOCX from saved report document;
- append audit event after export.

Detailed cautions:

- Keep `dynecho:proposal-preview:v1` as the temporary handoff/cache during
  transition; do not break the existing local preview route.
- Add project/report identifiers to the report editor state, but keep manual
  edits scoped to `SimpleWorkbenchProposalDocument`.
- Do not change `renderSimpleWorkbenchProposalPdf`,
  `renderSimpleWorkbenchProposalDocx`, or proposal output builders unless the
  user explicitly starts a PDF-output task.
- Existing assistant patch flow should still propose/review/apply before draft
  mutation. Saving to project should persist the reviewed draft, not auto-apply
  assistant output.
- If a saved report is opened by id, localStorage should become a cache, not the
  source of truth.
- Assistant-applied corrections must be saved as the full corrected document
  plus compact assistant revision metadata. Do not rely on conversation
  localStorage to reconstruct them.
- Keep `reportAdjustments` in the proposal document intact so rendered/exported
  reports can explain report-only changes without mutating calculator truth.
- If linked assembly version changed after report creation, show stale-source
  warning but let the user save report wording changes.

Tests:

- open saved report by project/report id without existing localStorage preview;
- apply assistant patch in UI, save to project, clear localStorage, reopen, and
  verify corrected report fields and `reportAdjustments`;
- stale assistant patch document signature blocks apply;
- issued report cannot be overwritten directly;
- PDF/DOCX export uses saved report document and appends project audit event;
- report save with another owner's project id fails without mutating local
  project state.

### Step 6 - Material Editor project library

Files likely involved:

- `apps/web/features/workbench-rebuild/material-editor-state.ts`
- `apps/web/features/workbench-rebuild/material-editor-panel.tsx`
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`

Tasks:

- move canonical custom materials from browser localStorage to selected project;
- keep localStorage only as fallback/unsaved draft cache;
- block deleting custom materials used by saved assemblies or reports;
- ensure assembly/report snapshots freeze material values needed for replay.

Detailed cautions:

- Do not allow project materials to override built-in seed ids. Keep the current
  seed-collision rule.
- Keep `MaterialDefinition` free of visual/color fields. Use
  `MaterialVisualOverride` or a project visual wrapper for illustration colors.
- Material deletion checks must inspect saved assemblies and reports, not only
  the currently visible layer stack.
- If project material editing changes calculations for a loaded assembly, the UI
  should mark the assembly as modified/unsaved.
- If a report stores a frozen material snapshot, deleting/editing the current
  project material should not corrupt that report.

Tests:

- create project material, save assembly using it, reload project, recalculate;
- edit project material and verify loaded assembly is marked dirty/stale as
  appropriate;
- delete material blocked when any saved assembly or report references it;
- visual override survives project reload and report snapshot freeze;
- built-in seed id collision is rejected in project material save route.

### Step 7 - Compatibility and cleanup

Files likely involved:

- old/simple workbench snapshot parser;
- project detail UI;
- server project list summaries;
- docs and E2E.

Tasks:

- show old `scenarioSnapshots` in a compatibility section or conversion action;
- preserve `/workbench` sync/list/load behavior while `/workbench-v2` moves to
  named assemblies;
- document that `scenarioSnapshots` are legacy/import payloads, not the primary
  user-facing saved-combination model;
- add migration tests that load a v1 project with only scenarios and no child
  arrays.

Detailed cautions:

- Do not delete `scenarioSnapshots` until both old workbench and existing stored
  projects have a clear migration route.
- Avoid one big UI rewrite. First make the project child routes reliable, then
  replace the V2 "Project snapshot" strip.

Tests:

- old scenario-only project reads and lists normally;
- old snapshots can be converted manually into saved combinations;
- old `/workbench` proposal audit flow still appends audit events;
- workbench-v2 no longer creates a new technical project for every normal save.

### Step 8 - Assistant/MCP project visibility

Files likely involved:

- `apps/web/features/workbench/report-assistant-tools.ts`
- `apps/web/features/workbench/report-assistant-tools.test.ts`
- project storage/repository helper files used by server-side assistant tools;
- any MCP adapter/route wrapper that exposes report assistant tools.

Tasks:

- add read-only project summary tool definitions;
- add read-only project assembly/report list tools;
- add explicit full-read tools for selected assembly/report ids;
- add preview tool support for saved report documents;
- ensure all project reads reuse owner scope and access policy;
- keep tool definitions `mutates: false`.

Detailed cautions:

- Do not add `apply_report_patch`, `save_report`, or `update_project` as MCP
  tools in this first pass.
- Tool input must include `projectId` for every child read. A naked `reportId`
  or `assemblyId` should be rejected.
- Tool output should be summary-first and bounded. Full documents are allowed
  only for explicit read by id.
- Assistant-visible project summaries should not include raw localStorage drafts.
- If a tool can run without browser localStorage, it must not depend on the
  report editor page being open.

Tests:

- tool definitions remain `mutates: false`;
- project list tool returns only accessible owner-scoped summaries;
- child list tool rejects missing `projectId`;
- full report read returns the saved report document by authorized project/report
  id;
- wrong-owner project/report ids return not-found/access behavior without
  leaking existence;
- preview saved report patch validates against saved report document signature
  and does not mutate the report.

### Step 9 - End-to-end workflow hardening

Files likely involved:

- new or existing Playwright E2E under `e2e/`;
- focused Vitest suites for project routes, workbench-v2, report editor, and
  assistant tools;
- docs under `docs/ui/`.

Tasks:

- add one happy-path E2E covering project -> two assemblies -> report ->
  assistant correction -> save -> clear browser storage -> reload;
- add one guarded-path E2E or component test covering stale report/assistant
  patch behavior;
- run focused route/storage/unit tests after each backend slice;
- run UI/browser checks after workbench/report UI changes;
- update docs with actual implemented route names and any deferred items.

Detailed cautions:

- E2E should verify persisted server state, not only visible local UI state;
- clearing localStorage/sessionStorage must happen before reload verification;
- do not make PDF binary rendering part of every E2E if it makes the suite slow;
  keep PDF/DOCX export validation focused where audit behavior changed;
- if parallel agents touch calculator tests, keep this slice's validation scoped
  to project/workbench/report/tool surfaces unless calculator payload contracts
  moved.

Exit criteria:

- user can create/select a project in `/workbench-v2`;
- user can save and reload multiple named layer combinations;
- user can create a report linked to a saved combination;
- user can apply an assistant-approved report correction and save it to the
  project;
- browser storage clear does not lose project materials, combinations, or saved
  report corrections;
- assistant can list/read accessible project summaries and selected saved report
  context without mutating anything.

## Validation Plan

Focused unit tests:

- shared project schema parses v1 and v2 records;
- invalid report/assembly payloads fail validation;
- assistant-sourced report revision requires a full valid report document;
- byte limits reject oversized reports/assemblies;
- access roles allow editor save and block viewer mutation;
- repository methods append/update/delete child records atomically.

Route tests:

- create project, save two assemblies, list project detail;
- save report linked to one assembly;
- save assistant-corrected report revision linked to one report;
- update report edit and reload project detail;
- reject report save for another owner's project;
- block deleting assembly with reports unless archived/detached policy is met.

Workbench tests:

- save current V2 layer stack into selected project;
- load saved assembly and recalculate;
- custom project material survives project reload;
- unsaved changes badge appears after editing loaded assembly.

Browser E2E:

- create "Bilmem Ne Oteli" project;
- create two layer combinations under it;
- create/edit/save a report under one combination;
- rapid double-submit project create, combination save, combination duplicate,
  and report save while verifying only one server record is created;
- apply an assistant-approved report correction and save it to the project;
- clear browser storage;
- reload project from server and verify assemblies + report edit are still there;
- export the saved report and verify audit event count increments.

Assistant/MCP tests:

- tool definitions remain read-only/proposal-only;
- assistant can list accessible projects with bounded summaries;
- assistant can list assemblies/reports under a selected project;
- assistant can read one selected saved report by project/report id;
- assistant preview patch validates against saved report document signature;
- assistant cannot apply/save/delete through MCP in first pass;
- wrong-owner and missing-project requests do not leak existence.

Regression checks:

- `pnpm --filter @dynecho/web exec vitest run ... --maxWorkers=1` for focused
  project/workbench/report suites;
- `pnpm exec playwright test e2e/... --config=playwright.config.ts` for the
  project workspace flow;
- `pnpm --filter @dynecho/web exec eslint ...`;
- `pnpm --filter @dynecho/web typecheck` when broad repo state allows it;
- `git diff --check`.

Current landed validation command sequence:

```bash
pnpm --filter @dynecho/web exec vitest run lib/server-project-routes.test.ts lib/server-project-storage.test.ts --maxWorkers=1
pnpm exec eslint e2e/workbench-v2-material-editor.spec.ts apps/web/features/workbench-rebuild/calculator-workbench.tsx apps/web/features/workbench-rebuild/report-editor.tsx --max-warnings=0
pnpm exec playwright test e2e/workbench-v2-material-editor.spec.ts --config=playwright.config.ts
git diff --check
```

Latest focused results for this slice: route/storage Vitest passes
`17` tests, and `e2e/workbench-v2-material-editor.spec.ts` passes `6`
browser tests covering material persistence, report persistence,
responsive controls, and rapid-submit guards.

`pnpm --filter @dynecho/web typecheck` currently still fails in unrelated
parallel calculator/report test files, not in the project workspace files. Keep
capturing the failing file list in handoff notes until those parallel branches
land or are reconciled. The important rule remains backend storage/routes first,
then workbench-v2 save/load, then report editor/project persistence, then
assistant/project visibility, then browser E2E.

### Detailed test matrix

Shared schema tests:

- parse v1 project record with no assemblies/reports/material library;
- parse v2 project record with assemblies/reports/material library;
- reject assembly snapshot with invalid `dynecho.workbench-v2.snapshot.v1`
  payload;
- reject report document that fails `parseSimpleWorkbenchProposalDocument`;
- reject material library seed-id collisions;
- enforce max report/assembly payload byte limits.

Repository tests:

- create project and append two assemblies;
- update assembly with expected version;
- reject stale expected version;
- append draft report linked to an assembly;
- update report document and preserve `createdAtIso`;
- reject hard delete of assembly with linked reports;
- archive report and verify project summary counts;
- owner A cannot read or mutate owner B project;
- preview owner and configured owner stay isolated.

Route tests:

- `POST /api/projects/:projectId/assemblies` returns child record and updated
  project summary;
- `PATCH /api/projects/:projectId/assemblies/:assemblyId` updates only selected
  child;
- `POST /api/projects/:projectId/reports` stores edited report JSON;
- `PATCH /api/projects/:projectId/reports/:reportId` persists manual edit;
- invalid payload returns existing route-style `400`;
- wrong owner returns existing route-style access/not-found behavior;
- oversized report returns `413`;
- deleting blocked assembly returns `409`.

Workbench component/unit tests:

- build current assembly save payload from V2 state;
- load assembly restores context, layers, selected outputs, materials, and visual
  overrides;
- unsaved change detection changes after layer/material/context edit;
- missing material load shows recoverable state;
- project material library merge keeps seed materials immutable.

Report editor tests:

- opening a saved report bypasses local-only preview dependency;
- `Save to project` calls report route with edited document;
- assistant-applied patch survives save/reload as corrected report document;
- assistant revision metadata is compact and does not store unbounded
  conversation history;
- stale-source warning appears when linked assembly updated after report source
  timestamp;
- export still sends the same report document shape to PDF/DOCX routes;
- localStorage preview remains backward-compatible.

Browser E2E:

- create project "Bilmem Ne Oteli";
- add custom material in project library;
- save wall combination "Guest room party wall";
- save second combination "Corridor wall";
- create report from first combination;
- ask/apply assistant correction such as lowering a metric display value after
  validation;
- edit report title/summary and save to project;
- clear localStorage/sessionStorage;
- reload, select project, verify two combinations and edited report;
- verify assistant-corrected value and `reportAdjustments` persisted in the
  saved report;
- open saved report and export PDF or DOCX;
- verify project detail has report record and export audit count.

UI/UX regression:

- desktop project workspace/report header has no horizontal overflow at 1440px;
- project header, saved combinations, and report list remain scannable;
- mobile can create/select project and save combination without clipped controls;
- report editor save/export buttons remain reachable on desktop and mobile;
- browser E2E now covers mobile project creation, mobile combination save,
  report handoff, report header overflow, and desktop report header overflow;
- assistant panel shows project/report/revision context and does not imply a
  patch is saved before server save succeeds;
- destructive actions require confirmation and cannot be reached accidentally.

## Things To Consider Before Implementation

Storage and data volume:

- first pass stores JSON documents, not generated PDF/DOCX binaries;
- report documents, assembly snapshots, and assistant revision metadata need byte
  limits before UI work depends on them;
- file-backed single-project JSON is acceptable now but should be shaped so a
  future DB split can map projects, assemblies, reports, revisions, materials,
  and audit events into separate tables.

Concurrency:

- two tabs can edit the same report or assembly. Use `expectedVersion` or
  `expectedUpdatedAtIso` on every overwrite;
- display code generation must happen after loading the latest project state;
- if a conflict happens, keep the user's local draft and offer reload/save-as-new
  rather than dropping edits.

Deletion and archival:

- prefer archive over hard delete for reports;
- block assembly deletion while active reports reference it;
- block material deletion while assemblies/reports reference it unless a
  replacement flow exists;
- issued reports should never be hard-deleted in the first implementation.

Assistant data boundaries:

- assistant can read summaries and selected documents, but cannot mutate project
  state through MCP in the first pass;
- save/apply remains user-driven in UI;
- persist compact assistant metadata, not full prompt/chat transcripts;
- avoid sending full project JSON to the assistant unless the user selects a
  specific child object.

Report truth model:

- calculator engine values remain the source for calculations;
- report adjustments are report-only and must preserve engine value provenance;
- stale-source warnings are better than automatic report refresh;
- saved report revisions should be reproducible even if project materials or
  assemblies change later.

UI rollout:

- do not replace the whole workbench in one pass;
- land backend routes and tests first;
- then switch workbench-v2 save/load to named assemblies;
- then make report persistence project-backed;
- then move Material Editor canonical state to project library;
- finally strengthen assistant/MCP project visibility and E2E coverage.

## Failure Modes And Recovery Plan

Project JSON parse failure:

- fail closed for mutation and return a clear project-load error;
- do not overwrite the unreadable project file;
- keep the user's current browser-local draft intact;
- add a storage test with malformed JSON to confirm no recovery path writes over
  the original file.

Schema migration failure:

- do not silently drop unknown child records;
- route should return a validation error with enough detail for diagnostics;
- implementation should add a fixture for the oldest supported v1 shape before
  writing any v2 migration.

Atomic write interruption:

- keep temp-file + rename semantics;
- failed write must leave the previous project file readable;
- route response should be an error and UI should keep local draft dirty.

Concurrent overwrite:

- expected version/timestamp mismatch returns `409`;
- UI should keep the unsaved local draft and offer reload, save as new, or retry
  after merge;
- do not silently last-write-wins for report documents or assemblies.

Report export succeeds but audit append fails:

- exported binary response should not be corrupted by audit failure;
- log/return non-blocking audit status where the existing route pattern allows;
- saved report record should not be mutated unless audit append succeeds.

Assistant patch generated against stale report:

- validation must compare document signature before apply;
- stale patch can be re-previewed, but not force-applied;
- saved report route should still require expected report timestamp/version.

Material replacement/delete failure:

- block delete before mutation if any saved assembly/report references the
  material;
- if a replacement flow is later added, validate every affected assembly before
  writing the project;
- failed replacement must not partially update child snapshots.

Payload-size failure:

- reject oversized report/assembly/material payload before write;
- UI should explain that the project was not saved and keep local draft state;
- tests should assert existing project file is unchanged after `413`.

MCP/tool read failure:

- wrong-owner or missing project returns the same access/not-found semantics as
  HTTP routes;
- tool output should not reveal whether another owner's project/report exists;
- assistant should ask the user to select a project/report if the id context is
  missing or ambiguous.

## Open Decisions

- Should assemblies freeze project material definitions at save time, or resolve
  current project material definitions at load time? Recommendation: freeze for
  reproducibility, while also keeping project material ids for library
  management.
- Should reports be mutable forever, or should an "issued" report become
  immutable? Recommendation: draft reports are mutable, issued reports require a
  new revision.
- Should old `scenarioSnapshots` be visible as saved combinations, or only
  convertible on demand? Recommendation: show a compatibility section or convert
  latest snapshot explicitly to avoid confusing historical technical imports with
  user-named combinations.
- Should files/PDF binaries be stored, or only report JSON plus export audit?
  Recommendation: start with report JSON and export audit; generated binaries can
  be regenerated.
- Do we need project folders or tags? Recommendation: not in first pass; project
  name plus assembly/report lists are enough.
- Should assistant conversation transcripts be stored? Recommendation: no for
  first pass. Store compact assistant revision metadata plus the resulting report
  document; keep full conversation local/bounded.
- Should MCP get write tools? Recommendation: no for first pass. Add only
  read/preview tools, then revisit write tools after project route authorization
  and UI save flows are stable.
- Should display codes be globally unique? Recommendation: child display codes
  only need to be unique inside one project. Project display codes can be
  optional until a DB-backed sequence exists.

## Architecture Recommendation

Recommended path:

1. Keep `ServerProjectRecord` as the user-level project container.
2. Introduce migration-safe v2 child arrays: `assemblies`, `reports`, and
   project material state.
3. Keep `scenarioSnapshots` as compatibility/import history.
4. Use `WorkbenchV2ProjectSnapshot` as the first assembly snapshot payload.
5. Use `SimpleWorkbenchProposalDocument` as the report document payload.
6. Store report revisions as full proposal documents with compact assistant/manual
   metadata.
7. Keep export routes rendering from the same report document payload.
8. Add child routes instead of overloading `/api/projects/import-local`.
9. Extend assistant/MCP capability through read-only, project-scoped summary and
   selected-document tools.

This is the right balance because it creates the product model the user wants
without forcing a database migration or PDF/calculator behavior change.

Avoid these paths for the first implementation:

- storing reports only as export audit events;
- making every saved combination a separate project;
- making project materials global across all projects;
- auto-updating old reports when assemblies/materials change;
- redesigning PDF/DOCX output while adding persistence;
- giving assistant tools direct project write ability before UI save flows are
  stable;
- deleting or replacing `scenarioSnapshots` immediately.

## Suggested Slice Order

### Slice A - Domain and repository foundation

Goal: server can store project child records without UI changes.

Deliverables:

- shared schemas;
- access actions;
- migration-safe read/write;
- repository methods;
- focused storage and route tests.

Exit criteria:

- create project -> append assembly -> append report -> reload project detail
  works in route tests;
- v1 scenario-only projects still read.

### Slice B - Workbench-v2 saved combinations

Goal: user can create/select a project and save/load multiple named layer
combinations.

Current status:

- functionally implemented as a first pass, but not UX-final. Project creation,
  project selection, saved-combination management, and saved-report management
  need a dedicated UI refactor before this slice should be considered polished
  product UX.

Deliverables:

- project workspace header;
- saved combinations list;
- save current stack as assembly;
- load selected assembly;
- unsaved-change badge.

Exit criteria:

- browser E2E proves two combinations under one project survive storage clear.

### Slice C - Report persistence

Goal: edited reports are saved under the project and linked to assemblies.

Deliverables:

- report save route integration;
- report editor "Save to project";
- open saved report by project/report id;
- report revision storage for manual and assistant-approved corrections;
- stale-source warning.

Exit criteria:

- browser E2E proves edited/assistant-corrected report survives storage clear
  and can be exported.

### Slice D - Project material library

Goal: Material Editor becomes project-library aware.

Deliverables:

- project-level material state load/save;
- usage checks before delete;
- assembly/report material snapshots;
- UI copy distinguishing project material library from built-in seed catalog.

Exit criteria:

- custom material can be reused across two saved combinations and old reports
  remain stable after material edit.

### Slice E - Assistant/MCP project visibility

Goal: assistant can discover accessible projects and selected saved context
without mutating project state.

Current status:

- deferred. The app has a Report Assistant and MCP-compatible read/proposal
  tool definitions for the active report context, but the assistant is not yet
  wired to the server project repository. Project/report discovery tools still
  need to be implemented before the assistant can answer questions from saved
  project storage.

Deliverables:

- read-only project summary/list tools;
- read-only assembly/report list tools;
- explicit saved report read tool;
- saved report patch preview against current document signature;
- tool tests for owner scoping and non-mutation.

Exit criteria:

- assistant can answer project/assembly/report context questions from project
  storage while all MCP-compatible tools remain `mutates: false`.

## Final Acceptance Criteria

The feature should not be considered complete until all of these are true:

Product workflow:

- user can create/select a named project in `/workbench-v2`;
- user can add or edit project materials and illustration color overrides under
  that project;
- user can save at least two named layer combinations under the same project;
- user can load either saved combination and recalculate from the restored state;
- user can create a report from a saved combination;
- user can manually edit the report, save it to the project, clear browser
  storage, and reopen the edited report from the project;
- user can apply an assistant-reviewed report correction, save it, clear browser
  storage, and reopen the corrected report with `reportAdjustments` preserved;
- user can export a saved report and the project audit history records the
  export.

Architecture and safety:

- v1 scenario-only project records still read;
- old `/api/projects/import-local` behavior still works for compatibility;
- normal workbench-v2 saves no longer create one technical project per save;
- calculator estimates still use explicit payloads and do not depend on hidden
  project server state;
- issued reports cannot be overwritten directly;
- project material deletion is blocked when saved assemblies/reports reference
  the material;
- assistant/MCP project tools remain read-only/preview-only in the first pass.

Quality gates:

- focused shared-schema/storage/route tests pass;
- focused workbench-v2 snapshot/load tests pass;
- focused report editor/assistant tool tests pass;
- project workspace browser E2E passes on desktop and mobile widths without
  horizontal overflow;
- `git diff --check` passes;
- this plan is updated with any implemented route/field name changes.

## Recommended First Slice

The smallest valuable slice is:

1. Extend project schema with `assemblies` and `reports` arrays, migration-safe.
2. Add repository + route support to save a named assembly under an existing
   project.
3. Update `/workbench-v2` to create/select a project and save/load named
   combinations.
4. Add a report save/revision route and one report editor "Save to project"
   action.
5. Add E2E for create project -> save assembly -> save edited/assistant-corrected
   report -> clear browser storage -> reload project.

This delivers the user's core workflow without changing calculator behavior.
