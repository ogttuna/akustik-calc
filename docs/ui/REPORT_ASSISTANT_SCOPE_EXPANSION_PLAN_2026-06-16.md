# Report Assistant Scope Expansion Plan - 2026-06-16

## Purpose

This document analyzes how to broaden the DynEcho report assistant without
implementing the active calculator documentation backlog.

The target is not to let the assistant change calculator behavior. The target is
to make the assistant more useful around the current workbench, project,
assembly, preset, report, and revision context while preserving the existing
review-before-mutation posture.

Recommended direction:

1. Expand assistant-visible read context first.
2. Add a bounded read-only query path second.
3. Add preview-only action proposals third.
4. Defer direct write-capable assistant tools until the preview contracts and
   stale-update guards are proven.

## Related Rule Sources

These existing rule and planning documents constrain this assistant expansion:

- `AGENTS.md`: DynEcho remains calculator-first; assistant work must not weaken
  metric/basis integrity, `needs_input`, `unsupported`, formula ownership, or
  source-row selection rules.
- `docs/foundation/PROJECT_PLAN.md`: the engine stays portable and framework
  free; Next/server/auth/storage concerns stay in `apps/web`; `Acoustic2` is not
  a mutable runtime dependency.
- `docs/foundation/SOURCE_REPO_POLICY.md`: upstream `Acoustic2` can be inspected
  read-only for parity or migration research, but this repo must not edit it,
  symlink to it, import from it at runtime, or depend on live upstream code.
- `apps/web/app/workbench/README.md` and
  `apps/web/features/workbench/README.md`: `/workbench-v2` is the active
  calculator surface, `/workbench/proposal` remains the active report handoff
  surface, and legacy workbench shells should not be changed unless explicitly
  requested.
- `docs/ui/DYNECHO_UI_REBUILD_PHASE_5_REPORT_EDITOR_2026-06-05.md`: the report
  editor is a review workspace; assistant output must be proposed and reviewed
  before draft mutation, and existing PDF/DOCX export functions should be
  preserved.
- `docs/calculator/REPORT_ASSISTANT_OUTPUT_MANIPULATION_AND_REVIEW_QUEUE_PLAN_2026-06-01.md`:
  the assistant/model returns operations, not rewritten documents; the app owns
  mutation; research answers remain non-mutating and any later value edit goes
  through the patch validator.
- `docs/ui/PROJECT_WORKSPACE_MODEL_PLAN_2026-06-12.md`: project assistant/MCP
  visibility starts read-only/preview-only; save/apply remains user-driven;
  report adjustments are report-only and must preserve engine value provenance.
- `docs/ui/WORKBENCH_V2_USER_PRESET_LIBRARY_PLAN_2026-06-15.md`: presets are
  owner-scoped starter snapshots, not project children, reports, or calculator
  logic; applying a preset clears selected assembly/report child context.
- `docs/ui/WORKBENCH_V2_COMMON_LAYER_PRESET_SEED_PLAN_2026-06-15.md`: common
  presets and source comparisons must stay separate from engine exact-source row
  promotion; seeds must not retune formulas or alias metric bases.
- `docs/ui/WORKBENCH_V2_WORKSPACE_FLOW_SIMPLIFICATION_PLAN_2026-06-16.md`:
  project, saved combination, report, template/preset, and material states must
  stay distinct; UI copy should avoid generic save language that hides which
  object is changing.
- `docs/ui/DYNECHO_UI_REBUILD_PHASE_10_MODE_AND_TRUTHFULNESS_HARDENING_2026-06-05.md`:
  UI context must not present misleading evidence; frontend truthfulness fixes
  must not change calculator values, API contracts, or protected PDF output.

## Standing Rules For This Assistant Expansion

1. **Calculator truth stays owned by the engine.** Assistant context, research,
   project reads, presets, and report patches cannot become calculator source
   rows, formula retunes, metric aliases, or runtime-value owners.
2. **Report edits stay report-only.** Assistant-applied metric changes are
   `SimpleWorkbenchProposalDocument` edits with provenance; they do not change
   engine values, saved assembly calculation output, or source route selection.
3. **Research does not create patches.** Source-backed or grounded research can
   recommend a value/range with citations and comparability notes, but it must
   not preload or apply a patch. A later edit needs a separate explicit user
   instruction and `validateReportAssistantPatch`.
4. **Model/tool authority is lower than app authority.** The model may propose
   operations or read/query answers. The app/server owns validation, access,
   stale checks, confirmation, persistence, export, and review-queue writes.
5. **Default assistant context is summary-first.** Full project JSON, report
   bodies, assembly snapshots, preset snapshots, and revision documents require
   explicit child ids and a route designed for that read.
6. **Workspace object boundaries stay visible.** Local draft, selected project,
   saved combination, saved report, report revision, preset/template, and
   material state must not be collapsed into one assistant-visible "project"
   concept.
7. **Persistence copy must name the object being changed.** Assistant UI should
   distinguish applied-to-draft, saved local draft, saved project report,
   appended report revision, saved combination, and preset/template actions.
8. **Upstream and legacy surfaces are out of scope.** Do not edit `Acoustic2`,
   do not create runtime dependencies on it, and do not modify legacy workbench
   shells unless a later task explicitly asks for those surfaces.
9. **Protected exports remain protected.** Assistant scope expansion should not
   redesign PDF/DOCX builders or imply export side effects; exports render the
   current report document through existing paths.
10. **Failures preserve user drafts.** Storage, stale-update, provider, parsing,
    and write failures should leave the browser-local draft and prior project
    files intact.

## Current System Findings

### Current assistant role

The assistant is currently a report-draft helper. It can propose changes to the
current report document, but it does not apply those changes by itself.

Primary files:

- `apps/web/features/workbench/report-assistant-context.ts`
- `apps/web/features/workbench/report-assistant-model.ts`
- `apps/web/features/workbench/report-assistant-patch.ts`
- `apps/web/features/workbench/report-assistant-tools.ts`
- `apps/web/features/workbench/report-assistant-intent.ts`
- `apps/web/features/workbench/report-assistant-request-client.ts`
- `apps/web/app/api/report-assistant/patch/route.ts`
- `apps/web/app/api/report-assistant/plausibility/route.ts`
- `apps/web/app/api/report-assistant/assembly-alternatives/route.ts`
- `apps/web/app/api/report-assistant/findings/route.ts`
- `apps/web/app/api/report-assistant/project-read/route.ts`
- `apps/web/app/api/report-assistant/status/route.ts`

The model contract in `report-assistant-model.ts` is intentionally narrow:

- output must be one `ReportAssistantPatch` JSON object;
- allowed model-facing operation types are report patch operations;
- the model is told not to apply, export, save, reset, write files, call tools,
  or rewrite the full report;
- project workspace and revision data are read-only context;
- the patch route is explicitly not a tool-calling loop;
- the app validator and user confirmation layer own all mutations.

This is the correct boundary to keep for the next scope expansion.

### Existing patch surface

`report-assistant-patch.ts` currently supports these patch operations:

- `adjust_metric_db`
- `set_metric_display_value`
- `replace_report_text_value`
- `append_report_note`

The model prompt exposes only:

- `adjust_metric_db`
- `set_metric_display_value`
- `append_report_note`

Important validator behavior:

- metric operations must target metric ids already present in
  `context.metrics`;
- unsupported or `needs_input` outputs must not be turned into numeric values;
- over-5 dB report movements require confirmation;
- over-10 dB assistant movements are rejected;
- stale document signatures block old patches from editing newer drafts;
- text replacement is guarded by report-surface classification.

Conclusion: this patch layer is a good pattern for future assistant action
proposals. New action types should not be mixed into `ReportAssistantPatch`
unless they edit only the current report document.

### Existing read-only report tools

`report-assistant-tools.ts` already defines MCP-compatible report helper tools,
all with `mutates: false`:

- `resolve_report_metric_reference`
- `preview_report_patch`
- `find_report_value_mentions`
- `research_acoustic_reference`
- `prepare_calculator_finding`

These are not write tools. Even `prepare_calculator_finding` only prepares the
record; the actual JSONL append goes through the API route and requires explicit
confirmation.

Conclusion: this is a strong foundation for a read-only or preview-only
assistant tool model, but it should not be treated as a hidden mutation channel.

### Project-read surface

The project read surface already exists and is the main expansion point.

Files:

- `apps/web/features/workbench/report-assistant-project-read-contract.ts`
- `apps/web/features/workbench/report-assistant-project-tools.ts`
- `apps/web/app/api/report-assistant/project-read/route.ts`
- `apps/web/features/workbench/report-assistant-project-tools.test.ts`
- `apps/web/features/workbench/report-assistant-project-read-route.test.ts`

Current read actions:

- `list_projects`
- `read_project_summary`
- `list_project_assemblies`
- `read_project_assembly_snapshot`
- `list_project_reports`
- `read_project_report_document`
- `list_project_report_revisions`
- `read_project_report_revision`

Current guarantees:

- all tool definitions declare `mutates: false`;
- owner scope is resolved through the same project route access policy;
- list actions return summary-first payloads and exclude full report bodies and
  assembly snapshots;
- full document/snapshot bodies are returned only through explicit child read
  actions with project id plus child id;
- unsupported write-like actions such as `save_report` are rejected before
  storage work;
- configured auth mode keeps the route behind the existing auth guard.

Conclusion: the app already has most of the safe read infrastructure needed for
a broader assistant. The gap is not backend read capability; the gap is how much
of that read capability is fed into assistant turns and how the assistant asks
for it.

### Assistant project workspace context

`ReportAssistantContext` can already carry `projectWorkspace` with:

- project summary;
- report summary;
- current revision summary;
- revision summaries;
- available read tool manifest;
- scope: `browser_local`, `project`, or `project_report`.

`apps/web/features/workbench/report-assistant-project-workspace.ts` loads only a
summary slice:

- `read_project_summary`
- `list_project_reports`
- `list_project_report_revisions`

It deliberately does not automatically read:

- full report documents;
- report revision documents;
- assembly snapshots.

This is good for default payload size and safety, but it limits how much the
assistant can answer without another read step.

Current inconsistency to resolve before broadening:

- the proposal configure flow has a client snapshot loader that carries the
  read tool manifest;
- the Workbench V2 report editor builds an assistant `projectWorkspace`, but its
  editor-local mapping starts with an empty `availableReadTools` list before
  `buildReportAssistantContext` normalizes it to the shared read manifest;
- the behavior is currently safe because the context builder rehydrates the
  manifest, but the editor mapping should still be made explicit so future
  tests and readers do not infer that the V2 assistant has fewer read tools;
- the project workspace contract and loader files are present in the current
  working tree, but some of them are untracked in git. Baseline work must
  reconcile that state before implementation.

### UI integration

There are two assistant consumers to keep aligned:

1. `apps/web/app/workbench/proposal/configure/proposal-adjust-client-page.tsx`
2. `apps/web/features/workbench-rebuild/report-editor.tsx`

The Workbench V2 report editor currently:

- builds `assistantContext` from the current report document;
- includes project/report/revision summary context when available;
- sends patch requests to `/api/report-assistant/patch`;
- validates returned patch proposals;
- shows a review panel;
- applies accepted patches only to the current draft;
- marks the project save source as `assistant`;
- still requires the user to save the report/revision explicitly.

This is the correct UX invariant:

```text
assistant response -> validated preview -> user applies to draft -> user saves
```

Future assistant actions should follow the same shape:

```text
assistant action proposal -> validated preview -> user confirms -> app route mutates
```

### Existing research routes

The assistant has two research-style routes:

- `/api/report-assistant/plausibility`
- `/api/report-assistant/assembly-alternatives`

They require current context and document payloads. Plausibility research may
return a suggested report patch, but that patch is validated through the same
shared patch validator before being returned. Assembly-alternative research
returns a review object, not a mutation.

Conclusion: research expansion should continue to be evidence/preview oriented.
It should not silently import source rows, retune formulas, or update project
state.

### Findings queue

`/api/report-assistant/findings` is the one current assistant-adjacent write
path. It writes a JSONL review record only when `confirmed === true`.

This is an important precedent for future write-like flows:

- require explicit confirmation;
- prepare/validate before writing;
- keep a compact audit record;
- avoid mutating the report, project scenario, or engine output as a side
  effect.

### Presets and workspace persistence context

The user preset and common preset plans deliberately kept assistant/MCP
visibility out of their first implementation slices.

Relevant constraints from existing UI plans:

- presets belong to an owner, not a project;
- presets store Workbench V2 input snapshots, not calculation output;
- presets must not store project ids, assembly ids, report ids, or assistant
  context;
- presets must not store assistant conversation state;
- applying a preset can leave the project selected but must clear selected
  assembly/report child context;
- Workbench V2 remains usable as a local calculator without requiring a
  project.

Conclusion: exposing presets to the assistant is reasonable as read-only
context, but assistant-visible preset data must not blur presets into project
records or report revisions.

## Deep System Safety Analysis

### Ownership and mutation map

| Surface | Read path | Mutation path | Existing guardrails | Expansion rule |
| --- | --- | --- | --- | --- |
| Current report draft | `ReportAssistantContext`, current `SimpleWorkbenchProposalDocument` | `applyValidatedReportAssistantPatch` in the browser draft only | document signature, context signature, patch validator, unsupported/needs-input rejection, max dB movement | Assistant may propose report-draft edits only through `ReportAssistantPatch` |
| Project summaries | `/api/report-assistant/project-read` summary actions | none in assistant path | owner scope, project access policy, `mutates: false`, summary-first response | Safe to expand read summaries with caps |
| Project assembly records | project routes and project-read explicit child reads | `/api/projects/[projectId]/assemblies` and child `PATCH`/`DELETE` routes | owner scope, access policy, Zod schemas, UUID path guards, byte limits, delete blocked when reports depend on assembly | Assistant must not write directly; future action proposals should call existing routes after confirmation |
| Project report records | project routes and project-read explicit report reads | `/api/projects/[projectId]/reports` and report child routes | owner scope, access policy, Zod schemas, report byte limit, optional `expectedReportUpdatedAtIso` conflict check when supplied | Assistant can read summaries; report writes must stay user-confirmed and future assistant apply paths must require the stale guard for existing reports |
| Report revisions | project-read revision list/read | `/api/projects/[projectId]/reports/[reportId]/revisions` | owner scope, access policy, Zod schema, revision max count, report byte limit, optional `expectedReportUpdatedAtIso` conflict check when supplied, source enum | Best first action proposal target because the current UI already sends the stale guard for revision append/restore |
| Preset library | `/api/workbench-v2/presets` and child `GET` | preset `POST`, `PATCH`, `DELETE`, duplicate route | owner scope, UUID preset id guard, byte limits, max count, summary omits snapshot, create validates parseable Workbench V2 snapshot | Assistant visibility should start as summaries; no apply or create until action proposal phase |
| Findings queue | prepared record via read-only helper | `/api/report-assistant/findings` | explicit `confirmed === true`, parse current context, JSONL append only | Keep as precedent for confirmation and audit |
| Assistant conversation | localStorage keyed by context signature | localStorage only | max message count, max text length, sanitized research packets, best-effort storage | Do not persist full chat in project records |
| Plausibility and alternatives research | current context/document plus optional provider | no project mutation; optional suggested patch is validated | source-bounded research contract, shared patch validator for suggestions | Research may inform previews, not calculator calibration or storage mutation |

### Critical data flows

#### Flow A - Report patch proposal

```text
current report document
  -> buildReportAssistantContext
  -> /api/report-assistant/patch
  -> model or deterministic parser returns ReportAssistantPatch
  -> validateReportAssistantPatch
  -> UI shows proposal
  -> user applies
  -> applyValidatedReportAssistantPatch mutates browser draft only
  -> user separately saves local draft or project revision
```

Safety properties:

- the model never applies the patch;
- validator recomputes the current document signature;
- metric ids must come from the current context;
- engine values are preserved as audit/reference values;
- unsupported and missing-input values cannot be promoted by a patch.

New assistant scope must not change this flow. If a user asks "save this", that
should become a separate action proposal, not a `ReportAssistantPatch`.

#### Flow B - Project report save or revision append

```text
current browser report draft
  -> user chooses Save project report / Save revision
  -> report editor builds documentForProject
  -> project route parses shared schema
  -> project route resolves owner and access
  -> repository appends report or report revision
  -> repository writes full report document and compact assistant metadata
  -> UI updates project context with report id and updatedAtIso
```

Safety properties:

- project writes are server-side;
- the current report editor sends `expectedReportUpdatedAtIso` when appending a
  revision to an existing report;
- the repository rejects stale report update/revision writes when that expected
  timestamp is supplied; the shared schema still allows omission, so future
  assistant apply paths must make it required for existing report writes;
- assistant-applied changes become durable only as part of the full saved report
  document;
- assistant metadata is compact and explanatory, not the source of truth.

Future assistant action proposals should reuse this path. They should not write
project JSON directly.

#### Flow C - Revision restore

```text
user opens revision history
  -> read_project_report_revision through assistant project-read route
  -> UI previews the old revision read-only
  -> user chooses Restore as new revision
  -> project revision route appends a new current revision
```

Safety properties:

- old revision is never overwritten;
- restore is a new revision append;
- archived reports are blocked in the UI before restore;
- the current restore UI sends `expectedReportUpdatedAtIso`, and the repository
  rejects the restore append if that timestamp is stale.

This is the right model for future assistant "restore" suggestions: propose a
restore target, preview the document, then append a new revision only after
confirmation.

#### Flow D - Project-read assistant context

```text
selected project/report ids
  -> /api/report-assistant/project-read
  -> read helper resolves owner and project access
  -> summary actions return bounded summaries
  -> explicit child actions return selected document/snapshot
  -> assistant context receives projectWorkspace summary
```

Safety properties:

- list/read actions declare `mutates: false`;
- unsupported write-like action names are rejected;
- summary actions do not include full report documents or assembly snapshots;
- full documents/snapshots require explicit child ids.

This should remain separate from `/api/report-assistant/patch`.

#### Flow E - Preset save/read

```text
Workbench V2 snapshot
  -> parseWorkbenchV2ProjectSnapshot
  -> /api/workbench-v2/presets
  -> owner-scoped preset repository
  -> preset summary list or explicit preset read
```

Safety properties:

- preset belongs to owner, not project;
- preset summary excludes `snapshot`;
- create validates that the snapshot parses as Workbench V2 project snapshot;
- stored preset records do not need assistant context.

Assistant preset visibility should start with summaries. Full preset snapshot
reads should require explicit preset id and should not imply apply.

### Existing guardrails that must be preserved

1. `mutatingToolsExposed` stays `false` for the assistant tool registry while
   status-listed tools are read/preview-only; any write-capable assistant tool
   needs a separate accepted plan.
2. Every assistant-visible tool definition keeps an explicit `mutates` flag.
3. `/api/report-assistant/patch` remains patch-only and never executes project
   reads or writes.
4. Project writes always resolve owner scope through `resolveProjectRouteOwner`.
5. Project writes always run `resolveProjectRouteAccess` with the intended
   project action.
6. Project and preset ids are UUID-guarded before file paths are built.
7. Project document/snapshot writes and preset create/update flows keep their
   existing byte, count, name, and description limits.
8. Existing report update/revision routes keep the optional
   `expectedReportUpdatedAtIso` conflict check, and assistant-owned apply paths
   must require it for existing report writes.
9. Old report revisions remain immutable; restore creates a new current
   revision.
10. Assistant patch application changes only the browser draft until the user
    saves.
11. Assistant conversation storage remains local, bounded, and best-effort.
12. Research output can suggest a report patch, but the shared patch validator
    decides whether that patch can be returned.
13. Preset records remain owner-scoped and do not store project/report ids.
14. Engine/calculator outputs are not changed by assistant report patching.

### Gaps and risk hot spots found in the current system

1. **Dirty baseline risk.** Several assistant, project storage, preset, and UI
   files are already modified or untracked in the working tree. Any
   implementation must first identify which files are intentionally in-scope so
   it does not overwrite parallel work.
2. **Editor context mapping clarity.** Workbench V2 report editor currently
   builds an assistant workspace object with `availableReadTools: []`, relying
   on the context builder to normalize it. This works, but future contributors
   may misread it. Make it explicit or add a test that proves normalization.
3. **Multi-step project save partial success.** Saving a report to a selected
   project can create an assembly first and then create a report. If the second
   call fails, the assembly can remain. This is existing behavior. Future
   assistant action proposals should avoid multi-write actions first, or expose
   the partial-success behavior clearly.
4. **Stale guards are uneven.** Existing report update/revision storage checks
   `expectedReportUpdatedAtIso` only when the caller supplies it; the current UI
   supplies it for report revision save/restore. Assembly update currently
   increments version but does not require an expected updated timestamp. Avoid
   starting with assistant assembly update proposals.
5. **Explicit full reads exist.** `read_project_report_document`,
   `read_project_report_revision`, and `read_project_assembly_snapshot` can
   return full bodies by explicit id. Query/default context code must not call
   them automatically.
6. **Model prompt is patch-only.** Expanding assistant action classes requires a
   separate model contract. Do not overload the patch model prompt with save or
   restore instructions.
7. **Instruction parser blocks action words.** The deterministic parser has a
   forbidden-action hint list for words such as apply, save, write, delete, and
   tool. Do not remove that globally. New action proposal handling should route
   through a separate classifier/parser.
8. **Context payload growth.** `assistantTraceSnapshot`, output facts,
   projectWorkspace, revision summaries, and future preset summaries can make
   the model payload large. Add caps before adding more arrays.
9. **Project read/action terminology.** Existing "MCP-compatible" language can
   be confused with a real standalone MCP server. Keep the plan precise:
   current app tools are local contracts/routes, not a broad external tool
   runtime.
10. **Local draft vs saved report state.** The UI already distinguishes local
    draft, applied-to-draft, and saved revision. New assistant action UI must
    preserve that distinction.

### Error-prevention principles for implementation

- Add one capability at a time and keep each capability behind a typed contract.
- Prefer summaries over full documents in default assistant context.
- Make every server mutation call an existing project/preset route or shared
  repository helper with the same schema and access checks.
- Require both user confirmation and stale guards for every future assistant
  apply route; for existing report writes, require `expectedReportUpdatedAtIso`
  even though the current shared route schema marks it optional.
- Keep query routes read-only; keep action routes preview-only until a separate
  apply request.
- Never infer project, report, assembly, revision, or preset ids from names when
  writing.
- Never let model output decide access, stale state, or persistence.
- Record `usedReads` for query responses so reads are auditable.
- Treat assistant-generated recommendations as report/editor advice, not
  calculator truth.
- Keep source-backed research, common preset source notes, and project report
  evidence out of engine calibration unless a later calculator/source-owner
  slice explicitly accepts that work.
- Keep `/workbench-v2` and `/workbench/proposal` as the active surfaces; do not
  revive or edit legacy workbench shells for assistant expansion.
- Preserve current PDF/DOCX export routes and builders. Assistant work can
  change the report document draft, but not the protected export pipeline.
- Use copy and action labels that name the object being changed: draft, project
  report, revision, saved combination, or preset.
- Add contract tests before UI wiring for every new route or action type.

### Stop conditions

Stop implementation and re-plan if any of these occur:

- a required assistant feature needs direct engine/calculator mutation;
- a write action cannot be expressed through existing project/preset route
  schemas;
- a proposed default context requires full project JSON;
- owner scope cannot be proven for a read or write;
- stale update detection cannot be added or required for a mutation;
- tests show `/api/report-assistant/patch` must become a tool loop;
- a proposed assistant feature needs legacy `/workbench` shell changes rather
  than the active `/workbench-v2` or `/workbench/proposal` surfaces;
- a feature requires editing `Acoustic2`, importing from it at runtime, or
  depending on live upstream files;
- a feature needs PDF/DOCX renderer changes instead of report-document changes;
- another active change is touching the same report assistant or project route
  files and the merge boundary is unclear.

## Scope Expansion Options

### Option 1 - Expand read context only

Add more bounded data to `ReportAssistantContext` and the project workspace
snapshot. No new assistant route and no new mutation.

Candidate additions:

- linked assembly summary for the current report;
- current source assembly snapshot summary, not the full raw snapshot by
  default;
- current report document summary;
- current revision summary plus previous revision summary;
- no revision diff summary until Phase 2;
- active Workbench V2 draft snapshot summary;
- active project/assembly/report dirty-state summary;
- user preset and common preset summaries;
- current material/custom-material summary;
- current selected output set and context modes;
- available read tools populated consistently across both assistant consumers.

Benefits:

- lowest risk;
- immediately improves assistant answers;
- preserves current patch route contract;
- needs only context parsing/model payload/test updates.

Risks:

- context payloads can become too large;
- duplicated summary parsing between the proposal configure page and Workbench
  V2 editor can diverge;
- full documents could be accidentally included in default assistant turns.

Recommendation: implement this first as "Assistant Workspace Scope V1".

### Option 2 - Add a bounded read-only query path

Add an endpoint such as `/api/report-assistant/query` that can answer project or
workspace questions using whitelisted reads.

Important design choice:

- the model should not get arbitrary tool execution;
- the host app should resolve allowed reads from explicit ids and a bounded
  request shape;
- each read result should record `mutates: false`;
- the response should include which reads were used.

Example tasks:

- "Which saved report am I editing?"
- "What changed between the current revision and the previous one?"
- "List other saved assemblies in this project."
- "Compare this report draft against the saved current revision."
- "Which preset looks closest to the current stack?"

Benefits:

- much more useful than static context for project questions;
- keeps `/api/report-assistant/patch` narrow;
- avoids defaulting every assistant turn to large project payloads.

Risks:

- query planning can become an implicit tool loop if not bounded;
- project ids and child ids must remain explicit;
- answers can become stale if the project changes after read.

Recommendation: implement second, after the static context expansion is stable.

### Option 3 - Add preview-only action proposals

Introduce a new action proposal contract separate from `ReportAssistantPatch`.

Candidate type:

```ts
type ReportAssistantActionProposal = {
  actionId: string;
  type:
    | "create_project_report_from_current_draft"
    | "save_project_report_revision_from_current_draft"
    | "restore_report_revision_as_new_draft"
    | "save_current_stack_as_project_assembly"
    | "create_user_preset_from_current_stack";
  summary: string;
  requiredConfirmation: true;
  staleGuards: {
    documentSignature?: string;
    projectId?: string;
    reportId?: string;
    expectedReportUpdatedAtIso?: string;
    expectedAssemblyUpdatedAtIso?: string;
  };
  preview: JsonValue;
  mutatesOnApplyOnly: true;
};
```

The proposal route should not mutate. It should only return a validated preview.
The apply route should require:

- explicit confirmation;
- auth/owner scope;
- expected timestamps or document signatures, with `expectedReportUpdatedAtIso`
  mandatory for existing report writes;
- route-specific validator;
- compact audit metadata;
- no hidden changes to calculator values.

Benefits:

- lets the assistant become action-oriented without silent writes;
- reuses the existing "review first" UX model;
- can cover useful workflows that are currently manual.

Risks:

- too many action types can turn the assistant into a hidden project manager;
- applying project mutations from stale assistant context can overwrite newer
  work;
- action proposals must not bypass existing project save/restore/preset routes.

Recommendation: implement third, starting with one report-only action:
`save_project_report_revision_from_current_draft`.

### Option 4 - Add direct write-capable assistant tools

This means exposing tools like:

- `save_report`
- `apply_report_patch`
- `update_project`
- `delete_project_child`
- `update_material`

Recommendation: do not implement this now.

Direct write tools should be revisited only after:

- read-only query works;
- preview-only action proposals are stable;
- route validators and stale-update guards are tested;
- the UI clearly distinguishes draft, saved project record, and issued report
  state.

## Recommended Implementation Plan

### Phase 0 - Baseline and ownership cleanup

Goal: make the current assistant/project-read state explicit before adding
scope.

Tasks:

1. Confirm which current assistant files are intended to be committed.
2. Reconcile untracked assistant project context files before building on them.
3. Record a short owned-file list before editing: assistant context/model/route,
   report editor UI, preset read helpers, or docs only.
4. Do not touch calculator engine files or calculator selected-next docs.
5. Do not update preset storage behavior unless the selected slice needs
   assistant-visible preset summaries.
6. Capture current targeted test status.
7. Check whether `apps/web/lib/server-project-storage.ts`,
   `apps/web/app/api/workbench-v2/*`, and preset storage files are pre-existing
   dirty work. Treat those as shared boundaries unless the next slice explicitly
   owns them.

Suggested baseline tests:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-context.test.ts \
  features/workbench/report-assistant-instruction.test.ts \
  features/workbench/report-assistant-model.test.ts \
  features/workbench/report-assistant-patch.test.ts \
  features/workbench/report-assistant-project-tools.test.ts \
  features/workbench/report-assistant-project-read-route.test.ts \
  features/workbench/report-assistant-project-workspace.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts \
  features/workbench/report-assistant-request-client.test.ts \
  features/workbench/report-assistant-intent.test.ts
```

Exit criteria:

- current assistant tests are either green or unrelated failures are documented;
- project-read contract files are no longer ambiguous/untracked baseline work;
- dirty/shared project storage and preset files are identified before edits;
- implementation owner knows whether to update both assistant consumers or only
  Workbench V2.

### Phase 1 - Assistant Workspace Scope V1

Goal: give the assistant richer read-only context without adding writes or a
tool loop.

Data additions:

- `projectWorkspace.availableReadTools` surfaced consistently in both assistant
  consumers, either directly or through tested context-builder normalization;
- linked assembly summary;
- linked assembly calculation summary;
- current report summary;
- current revision summary;
- previous revision summary when available;
- active draft persistence state: local draft, project unsaved stack, saved
  assembly clean, saved assembly modified, project report draft;
- preset library summary counts and latest names, not full snapshots by default.

Existing `ReportAssistantProjectWorkspaceSnapshot.report`,
`currentRevision`, and `revisionSummaries` already cover the core report and
revision summaries. Suggested additional V1 context fields:

```ts
type ReportAssistantWorkspaceContextV1 = {
  activeDraftState?: {
    assemblyId?: string;
    assemblyName?: string;
    assemblyVersion?: number;
    dirty: boolean;
    kind:
      | "combination_clean"
      | "combination_dirty"
      | "local_draft"
      | "project_draft"
      | "project_report_draft"
      | "template_draft";
    projectId?: string;
    projectName?: string;
    reportId?: string;
    reportUpdatedAtIso?: string;
  };
  linkedAssembly?: {
    calculationPrimaryOutput?: string;
    calculationPrimaryValueLabel?: string;
    displayCode?: string;
    id: string;
    kind: "floor" | "wall";
    name: string;
    updatedAtIso?: string;
    version: number;
  };
  presetLibrarySummary?: {
    commonPresetCount?: number;
    recentUserPresets: readonly {
      id: string;
      kind: "floor" | "wall";
      layerCount: number;
      name: string;
      updatedAtIso: string;
    }[];
    userPresetCount?: number;
  };
};
```

The exact type can be folded into `ReportAssistantProjectWorkspaceSnapshot` or
kept as a sibling field on `ReportAssistantContext`. Prefer a sibling field if
the data is not strictly project-owned, such as preset summaries or local draft
state.

Implementation notes:

- extend `ReportAssistantProjectWorkspaceSnapshot` rather than sending raw
  project JSON;
- keep default payloads summary-first;
- full report/revision/assembly reads remain explicit child-read operations;
- add a size cap to any new summary list;
- include source timestamps and ids for human traceability and stale checks;
- keep assistant conversation transcripts out of project records;
- do not call `read_project_report_document`, `read_project_report_revision`, or
  `read_project_assembly_snapshot` automatically during normal patch requests;
- if a comparison needs a saved document, do it in a separate explicit read or
  query flow and summarize the result before model payload construction;
- add snapshot/list caps before exposing preset summaries to model context.

Likely files:

- `apps/web/features/workbench/report-assistant-context.ts`
- `apps/web/features/workbench/report-assistant-instruction.ts`
- `apps/web/features/workbench/report-assistant-model.ts`
- `apps/web/features/workbench/report-assistant-project-workspace.ts`
- `apps/web/features/workbench-rebuild/report-editor.tsx`
- `apps/web/app/workbench/proposal/configure/proposal-adjust-client-page.tsx`
- related tests beside those modules.

Acceptance:

- no-project assistant behavior is unchanged;
- selected project context appears in assistant context;
- selected report context appears in assistant context;
- revision summaries and current revision are available to the model;
- linked assembly summary appears when a report has `assemblyId`;
- active draft state reflects local/project/report dirty state without implying
  a save;
- no default assistant request includes full report bodies or assembly snapshots;
- context signatures change when new assistant-visible workspace context changes;
- runtime status still reports no mutating tools exposed.

### Phase 2 - Revision and document comparison summaries

Goal: let the assistant reason about saved/current report differences without
reading or sending unbounded documents.

Add a helper that can compare:

- current browser draft vs saved current report document;
- current revision vs previous revision;
- assistant-adjusted draft vs generated baseline.

Summary should include:

- compared ids and timestamps;
- changed top-level report fields;
- changed primary metric/report metric display values;
- changed warnings/assumptions/recommendations counts;
- assistant patch metadata when present;
- whether the comparison source is stale or unavailable.

Do not include:

- complete report body text by default;
- raw localStorage conversation;
- generated PDF/export data.

Acceptance:

- assistant can answer "what changed since last revision?" from bounded summary;
- tests prove large text fields are summarized, not blindly copied;
- stale or missing saved report context yields a recoverable assistant/UI state.

Implementation status on 2026-06-16:

- `report_assistant_revision_and_document_comparison_summaries_v1` landed
  locally as a no-route, no-write assistant context expansion.
- `ReportAssistantContext` now carries `documentComparisonSummaries`, with
  compared references, document signatures, issued timestamps, changed
  top-level field names, metric display-value changes, bounded count changes,
  text-field length summaries, assistant adjustment metadata, and source status.
- The landed comparison source is `current_draft_vs_generated_baseline` when a
  `baseDocument` is available in the report editor or proposal configure flow.
- Large text fields such as `executiveSummary` and `briefNote` are summarized
  by field name and string length only; the comparison summary does not copy
  full report body text.
- The parser and model payload now round-trip the bounded comparison summaries
  as read-only context while the model contract remains
  `ReportAssistantPatch JSON only`.
- Current revision vs previous revision and current draft vs saved report
  document comparisons remain intentionally parked for the bounded query/explicit
  child-read path. Default assistant context still does not call
  `read_project_report_document`, `read_project_report_revision`, or
  `read_project_assembly_snapshot`.
- No query route, action proposal route, project/report write, preset apply,
  export builder change, or calculator behavior change was added.
- Focused validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench-rebuild/report-editor-project-context.test.ts`
  passed `5` files / `24` tests.
- Broader assistant validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench-rebuild/report-editor-project-context.test.ts`
  passed `12` files / `87` tests.
- `pnpm --filter @dynecho/web typecheck` was rerun after fixing the new
  assistant fixture requirement. It still fails on unrelated existing
  calculator/test fixture type errors (`exactImpactSource`, `PresetId`,
  `OutputCardModel`, and citation `tone` fixture issues); no remaining
  `documentComparisonSummaries` type error is reported.
- Current selected next slice:
  `report_assistant_read_only_query_v1`
  (`Phase 3 - Read-only Assistant Query V1`).

### Phase 3 - Read-only Assistant Query V1

Goal: support project/workspace questions without overloading the patch route.

New route candidate:

```text
POST /api/report-assistant/query
```

Request shape:

```ts
type ReportAssistantQueryRequest = {
  context: ReportAssistantContext;
  document?: SimpleWorkbenchProposalDocument;
  instruction: string;
  allowedReadActions?: ReportAssistantQueryReadActionName[];
};

type ReportAssistantQueryReadActionName =
  | ReportAssistantProjectReadToolName
  | ReportAssistantPresetReadToolName;
```

Response shape:

```ts
type ReportAssistantQueryResponse = {
  ok: true;
  answer: string;
  evidence: readonly {
    label: string;
    source: "current_context" | "project_read" | "report_document" | "revision_summary" | "preset_summary";
    referenceId?: string;
  }[];
  usedReads: readonly {
    action: ReportAssistantQueryReadActionName;
    mutates: false;
  }[];
  warnings: readonly string[];
};
```

Rules:

- the query route is not allowed to return `ReportAssistantPatch`;
- patch generation remains in `/api/report-assistant/patch`;
- the route may call only whitelisted read actions;
- write-like actions are unsupported;
- each used read must be explicit in the response;
- default payloads remain summary-first;
- query planning is bounded to at most three internal reads per request in V1;
- the route must refuse mutation/export/delete/save/apply intents before any
  project or preset repository call;
- full child document reads require explicit id fields already present in
  current context or selected by the user.

Acceptance:

- project question with selected project uses read-only project context;
- question without project asks for selection or answers from current draft only;
- wrong-owner project ids use the same project access policy, while preset reads
  stay owner-scoped rather than project-scoped;
- unsupported query action returns a typed error and `mutates: false`;
- query response includes `usedReads` for every internal read and an empty list
  when it answered only from current context;
- query route tests prove no project/preset repository write method is called.

Implementation status on 2026-06-16:

- `report_assistant_read_only_query_v1` landed locally as a separate
  `/api/report-assistant/query` route.
- The route parses the existing `ReportAssistantContext`, optional current
  proposal document, user instruction, and optional `allowedReadActions`; it
  returns an answer, evidence, explicit `usedReads`, warnings, and
  `mutates: false`.
- Mutation-like intents such as save, apply, export, restore, update, write,
  and delete are refused before project storage reads.
- Default query planning is summary-first and bounded to at most three project
  reads. Default reads cover project summary, assembly summaries, report
  summaries, and revision summaries only.
- Full saved report/revision document reads are not default. They run only when
  the caller explicitly includes `read_project_report_document` or
  `read_project_report_revision` in `allowedReadActions`, and the route returns
  only bounded comparison summaries instead of raw report bodies.
- Current draft vs saved current report comparison is now available through the
  explicit full-report read path.
- Current revision vs previous revision comparison is available through the
  explicit revision-read path and remains capped at three reads:
  `list_project_report_revisions` plus two `read_project_report_revision`
  calls.
- Unsupported `allowedReadActions` such as `save_report` return a typed
  non-mutating query error.
- The route uses the same auth/owner scope and project-read helper as the
  existing assistant project-read route; no preset reads or writes were added.
- No patch route change, action proposal route, project/report write, preset
  apply, export builder change, or calculator behavior change was added.
- Validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench-rebuild/report-editor-project-context.test.ts`
  passed `13` files / `93` tests.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on
  unrelated existing calculator/test fixture type errors (`exactImpactSource`,
  `PresetId`, `OutputCardModel`, and citation `tone` fixture issues); no query
  route or `report-assistant-query` type error is reported.
- Current selected next slice:
  `report_assistant_preset_visibility_v1`
  (`Phase 4 - Preset visibility for the assistant`).

### Phase 4 - Preset visibility for the assistant

Goal: let the assistant reference saved user/common presets without turning
presets into project or report state.

Read-only preset summary fields:

- preset id;
- name;
- route/kind;
- layer count;
- selected output count;
- updated timestamp;
- whether custom materials are included;
- whether visual overrides are included;
- optional compact source label for common presets.

Default assistant context should include only:

- counts;
- a small recent/favorite/top match list;
- no full preset snapshot unless explicitly selected.

Candidate read actions:

- `list_user_preset_summaries`
- `read_user_preset_snapshot`
- `list_common_preset_summaries`
- `read_common_preset_snapshot`

Rules:

- preset reads are owner-scoped where applicable;
- preset snapshots do not include project/report ids;
- applying a preset remains a normal workbench UI action, not an assistant
  mutation;
- applying a preset while a project is selected must still clear selected
  assembly/report child context.

Acceptance:

- assistant can answer "which preset is closest to this stack?" using summaries;
- assistant can propose a preset to inspect without applying it;
- no assistant request stores preset snapshots in project records.

Implementation status on 2026-06-16:

- `report_assistant_preset_visibility_v1` landed locally as a read-only,
  summary-first assistant expansion.
- `ReportAssistantContext` now carries `presetLibrarySummary`. When a caller
  does not provide one, the context builder supplies capped common preset
  summaries from the built-in Workbench V2 preset library. User preset summaries
  can be merged by routes that have owner scope.
- `apps/web/features/workbench/report-assistant-preset-library.ts` defines the
  assistant-facing preset summary shape and read manifest. The assistant summary
  includes id, name, route, kind, layer count, selected output count,
  custom-material/visual-override flags, updated timestamp, tags, and compact
  common-source labels. It does not include full Workbench V2 snapshots,
  project ids, report ids, assembly ids, source URLs, or assistant chat state.
- User preset storage/list summaries now expose derived
  `selectedOutputCount`, `hasCustomMaterials`, and `hasVisualOverrides`
  metadata. Existing stored records remain readable because missing metadata is
  derived from the stored snapshot at parse time; list summaries still omit the
  snapshot body.
- `/api/report-assistant/query` now accepts both project read action names and
  preset read action names through `ReportAssistantQueryReadActionName`.
  Default query reads include `list_common_preset_summaries` and
  `list_user_preset_summaries` in addition to the existing project summary
  reads.
- Preset questions such as "which preset looks closest to this stack?" are
  answered from summary lists only. The answer reports read-only visibility,
  user/common template counts, a closest summary match by route/layer count, and
  explicitly states that applying or saving a template is outside the query
  route.
- `read_common_preset_snapshot` and `read_user_preset_snapshot` are defined in
  the read manifest for a future explicit inspect flow, but the landed Phase 4
  query path does not execute snapshot reads and does not return snapshot
  bodies.
- No patch route change, model patch operation expansion, action proposal
  route, preset apply, preset create/update/delete, project/report write, export
  builder change, source-row import, formula retune, or calculator behavior
  change was added.
- Focused validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-query-route.test.ts lib/workbench-v2-preset-storage.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-v2-presets.test.ts`
  passed `6` files / `31` tests.
- Broader assistant and preset validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench-rebuild/report-editor-project-context.test.ts lib/workbench-v2-preset-storage.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-v2-presets.test.ts features/workbench-rebuild/workbench-preset-library-panel.test.ts`
  passed `17` files / `107` tests.
- After the final import-boundary fix, the focused parser/context/query/model
  regression command:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-model.test.ts`
  passed `4` files / `26` tests.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on unrelated
  existing calculator/test fixture type errors (`exactImpactSource`,
  `PresetId`, `OutputCardModel`, and citation `tone` fixture issues); no
  remaining `report-assistant-query`, `report-assistant-preset-library`,
  preset-storage, preset-route, context, instruction, or model type error is
  reported.
- Current selected next slice:
  `report_assistant_action_proposal_contract_v1`
  (`Phase 5 - Preview-only action proposal contract`).

### Phase 5 - Preview-only action proposal contract

Goal: make assistant suggestions actionable while preserving explicit user
mutation.

Add a separate module, not part of `ReportAssistantPatch`:

- `report-assistant-action-proposal.ts`
- `report-assistant-action-proposal.test.ts`
- optional route: `/api/report-assistant/action-proposal`

Start with one action:

- `save_project_report_revision_from_current_draft`

Then add only if the first action is stable:

- `restore_report_revision_as_new_draft`
- `create_project_report_from_current_draft`
- `save_current_stack_as_project_assembly`
- `create_user_preset_from_current_stack`

Rules:

- proposal route validates and previews only;
- apply route requires explicit confirmation;
- apply route calls existing project/preset routes or shared storage helpers
  with the same auth, validation, byte-limit, and conflict-check behavior;
- every mutation has stale guards;
- generated assistant text never replaces route-side validation;
- calculator values are not changed;
- action proposal payloads must include `documentSignature` and, for project
  report actions, `assistantContextSignature`;
- action apply must recompute the current document signature before mutation;
- action apply must require `expectedReportUpdatedAtIso` for existing report
  revisions, even though the current shared schema accepts omitted values;
- action apply must persist the full report document, not just assistant
  metadata;
- action apply must return the saved server ids and updated timestamps.

Do not start action proposals with:

- assembly update;
- assembly delete;
- report delete/archive;
- preset delete;
- material update;
- any action requiring multiple writes unless the UI clearly handles partial
  success.

Acceptance:

- assistant can propose saving a current draft as a new revision;
- user sees exact target project/report/revision;
- stale report update is blocked;
- saved revision includes full report document plus compact assistant metadata;
- assistant still cannot save/delete/update through the patch route;
- failed apply leaves the browser draft unchanged;
- successful apply updates local project context with the returned
  `serverProjectReportUpdatedAtIso`.

Implementation status on 2026-06-16:

- `report_assistant_action_proposal_contract_v1` landed locally as a
  preview-only action proposal contract and route.
- `apps/web/features/workbench/report-assistant-action-proposal.ts` initially
  defined the first supported proposal action:
  `save_project_report_revision_from_current_draft`. Later bounded follow-ups
  added `restore_report_revision_as_new_draft`,
  `create_project_report_from_current_draft`, and
  `save_current_stack_as_project_assembly`; see the current follow-up status
  below.
- The proposal validator is deterministic. It can infer save/revision wording
  for `save_project_report_revision_from_current_draft` and restore/rollback
  wording for `restore_report_revision_as_new_draft` when an explicit selected
  revision preview target is supplied. It can infer create/new report wording
  for `create_project_report_from_current_draft` only when a saved project
  assembly target is selected and no project report is already selected. It
  can infer save stack/layer-combination wording for
  `save_current_stack_as_project_assembly` only when a saved project is
  selected and no project report is already selected. It can infer save/create
  template or preset wording for `create_user_preset_from_current_stack` only
  when the editor confirms a source stack is available. It
  still refuses unsupported destructive actions such as delete, export, update,
  write, or apply.
- The proposal requires a valid current `ReportAssistantContext`, a parseable
  `SimpleWorkbenchProposalDocument`, matching current `documentSignature`, a
  UUID project id, a UUID report id, and a valid
  `expectedReportUpdatedAtIso` from the selected project report context.
- Archived project reports are rejected before previewing an apply route.
- `/api/report-assistant/action-proposal` was added as a separate route from
  `/api/report-assistant/patch` and `/api/report-assistant/query`. It keeps the
  existing auth guard, returns `mutates: false`, and does not call project
  storage, preset storage, export builders, or calculator code.
- The response includes a preview title, target project/report ids and labels,
  `assistantContextSignature`, `documentSignature`, `requiresConfirmation:
  true`, and an apply-route preview for the existing project report revision
  endpoint. The response deliberately does not include the full report document;
  the body preview identifies whether confirmation will use the
  `current_report_document` or the `selected_revision_document`.
- No apply route was added in this slice. Confirmed mutation remains a future
  UI/app step that must call the existing project report revision endpoint with
  the full current report document and `expectedReportUpdatedAtIso`.
- Runtime status now lists read-only preset read tools and separates preview
  action proposals from the read/preview tool registry while keeping
  `mutatingToolsExposed: false`. It advertises supported preview-only action
  proposals: create current draft as a project report, create current source
  stack as an owner-scoped user preset, save current source stack as a project
  assembly, save current draft as a new revision, and restore a selected saved
  revision as a new current revision.
- Focused validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-runtime-status.test.ts`
  passed `2` files / `11` tests.
- Broader assistant, query, preset, and action validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench-rebuild/report-editor-project-context.test.ts lib/workbench-v2-preset-storage.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-v2-presets.test.ts features/workbench-rebuild/workbench-preset-library-panel.test.ts`
  passed `18` files / `113` tests.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on unrelated
  existing calculator/test fixture type errors (`exactImpactSource`,
  `PresetId`, `OutputCardModel`, and citation `tone` fixture issues); no
  remaining `report-assistant-action-proposal`, action route, runtime-status,
  query, preset, context, instruction, or model type error is reported.
- Current selected next slice:
  `report_assistant_ui_unification_hardening_v1`
  (`Phase 6 - UI unification and hardening`).

### Phase 6 - UI unification and hardening

Goal: avoid two assistant experiences drifting apart.

Tasks:

- extract shared assistant context strip or view-model logic where practical;
- align proposal configure page and Workbench V2 report editor on the same
  context fields;
- keep mobile layout compact;
- show whether the assistant is reviewing local draft, selected project,
  selected report, or saved revision;
- show "not saved yet" vs "applied to draft" vs "saved revision" explicitly;
- expose read/query/action proposal results in the same response thread pattern.

Acceptance:

- user can tell whether assistant output has been applied, saved, or only
  proposed;
- no visible copy implies project mutation before Save/Confirm;
- desktop and mobile assistant panels have no horizontal overflow;
- proposal configure page and Workbench V2 editor do not send incompatible
  context shapes.

Implementation status on 2026-06-16:

- `report_assistant_ui_unification_hardening_v1` landed locally for the
  Workbench V2 report editor assistant panel.
- The editor now classifies assistant instructions through
  `classifyReportAssistantEditorRequest` before sending a request:
  mutation-like wording goes to the preview-only action proposal route,
  workspace/report/preset questions go to the read-only query route, and
  report-value edit instructions remain on the patch proposal route.
- The existing patch path is still centered on the current
  `ReportAssistantContext`, current report document, and instruction. Patch
  validation and `applyValidatedReportAssistantPatch` remain the only path that
  changes the browser draft from the assistant panel.
- Query and action proposal responses are shown in the same assistant response
  thread as patch results, but they do not set `assistantValidation`, do not
  apply a patch, do not save a project report, and do not call project or preset
  write helpers from the browser.
- The action proposal path calls `/api/report-assistant/action-proposal` and
  displays preview text only. Confirmed persistence remains outside this slice
  and must continue to use the existing project report save/revision route with
  `expectedReportUpdatedAtIso`.
- `ReportAssistantRequestKind` and the request lifecycle registry now include
  `read_only_query` and `action_proposal`, so delayed query/action results stay
  isolated from patch and research requests.
- The assistant panel command copy is now general enough for answers, previews,
  and patch proposals, while the empty response state no longer implies every
  response is an edit.
- Assistant context, proposal, thread header, and message CSS now have stronger
  `min-width: 0` and `overflow-wrap: anywhere` handling for long project names,
  report names, query answers, and preview summaries.
- Focused validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-request-lifecycle.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-request-client.test.ts`
  passed `4` files / `29` tests.
- Broader assistant, query, preset, action, lifecycle, and editor validation
  completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-request-lifecycle.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench-rebuild/report-editor-project-context.test.ts lib/workbench-v2-preset-storage.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-v2-presets.test.ts features/workbench-rebuild/workbench-preset-library-panel.test.ts`
  passed `20` files / `125` tests.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on unrelated
  existing calculator/test fixture type errors (`exactImpactSource`,
  `PresetId`, `OutputCardModel`, and citation `tone` fixture issues); no
  remaining report-editor, workflow, request-client, request-lifecycle, action,
  query, preset, status, context, instruction, or model type error is reported.
Follow-up implementation status on 2026-06-16:

- `report_assistant_confirmed_revision_action_apply_v1` landed locally as the
  first confirmed assistant action apply flow.
- At this checkpoint, scope remained limited to the already-previewed
  `save_project_report_revision_from_current_draft` action. No create report,
  restore revision, assembly save, preset create, preset apply, export, delete,
  archive, or material update action was added.
- The Workbench V2 report editor now stores a parsed action proposal only when
  the `/api/report-assistant/action-proposal` response matches the expected
  save-revision shape.
- The assistant panel renders that preview separately from patch proposals with
  `Confirm save revision` and `Dismiss preview` actions.
- Confirming the preview rechecks the current `documentSignature`, selected
  project id, selected report id, and `expectedReportUpdatedAtIso` against the
  proposal target before any write request is sent.
- The confirmed write uses the existing project report revision endpoint from
  the proposal's `applyRoute.pathname`, sends the current report document,
  `source: "assistant"`, the previewed `expectedReportUpdatedAtIso`, and the
  latest assistant patch summary when present.
- Successful confirmation updates the local project report context with the
  returned `serverProjectReportUpdatedAtIso`, stores the updated preview, clears
  the action proposal, and logs an assistant-thread success message.
- Failed or stale confirmation leaves the browser draft intact and clears stale
  previews where appropriate.
- Focused validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-editor-workflow.test.ts`
  passed `3` files / `16` tests.
- Broader assistant, query, preset, action, lifecycle, editor, and confirm
  validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-request-lifecycle.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench-rebuild/report-editor-project-context.test.ts lib/workbench-v2-preset-storage.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-v2-presets.test.ts features/workbench-rebuild/workbench-preset-library-panel.test.ts`
  passed `20` files / `126` tests.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on unrelated
  existing calculator/test fixture type errors (`exactImpactSource`,
  `PresetId`, `OutputCardModel`, and citation `tone` fixture issues); no
  remaining report-editor, workflow, action proposal, request-client,
  request-lifecycle, query, preset, status, context, instruction, or model type
  error is reported.
- Current selected next decision:
  further write-capable assistant actions should remain parked until a separate
  bounded slice selects exactly one next action and its stale/confirmation
  contract.

Follow-up implementation status on 2026-06-16:

- `report_assistant_restore_revision_action_apply_v1` landed locally as the
  second confirmed assistant action flow.
- Scope is limited to `restore_report_revision_as_new_draft`. No create report,
  save assembly, create preset, apply preset, export, delete, archive, material
  update, calculator route, source-row import, or formula retune was added.
- The action proposal contract now supports both
  `save_project_report_revision_from_current_draft` and
  `restore_report_revision_as_new_draft`. Both remain preview-only proposals
  (`mutates: false`, `previewOnly: true`, `requiresConfirmation: true`) until
  the user presses the editor confirm button.
- Restore proposals require an explicit selected revision preview target from
  the editor: UUID-shaped `selectedRevision.id` plus optional display code.
  Restore wording without a selected non-current revision is rejected before
  previewing an apply route.
- Restore proposals reject attempts to restore the current revision id. Archived
  report targets continue to be rejected by the shared project-report target
  guard before any preview is returned.
- The restore proposal response identifies the apply body as
  `document: "selected_revision_document"` and `source: "manual"`. It does not
  embed the full historical document in the proposal payload.
- The Workbench V2 report editor passes `selectedRevision` to
  `/api/report-assistant/action-proposal` only when a revision preview is loaded
  and the instruction matches restore/rollback wording. Normal save-revision
  proposals still use the current report draft.
- The editor parser accepts restore proposals only when the payload uses the
  selected-revision document marker, manual source marker, and a concrete
  `target.restoreRevisionId`.
- Confirming restore rechecks the current `documentSignature`, selected project
  id, selected report id, `expectedReportUpdatedAtIso`, and loaded revision
  preview id before sending any write request. A stale/missing preview clears
  the proposal and leaves the browser draft intact.
- The confirmed restore write reuses the existing project report revision
  endpoint from `applyRoute.pathname`, sends the selected historical revision
  document as the new full report document, sends `source: "manual"`, and keeps
  the existing `expectedReportUpdatedAtIso` conflict guard.
- Successful restore updates local project report context with the returned
  `serverProjectReportUpdatedAtIso`, stores the updated preview, clears the
  action proposal, and logs an assistant-thread success message naming the
  restored revision.
- The existing save-current-draft confirmation flow remains unchanged in
  behavior: it still sends the current report document, `source: "assistant"`,
  and the compact latest assistant patch summary when present.
- Focused validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench-rebuild/report-editor-project-context.test.ts`
  passed `3` files / `19` tests.
- Broader assistant, query, preset, action, lifecycle, editor, and restore
  validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-request-lifecycle.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench-rebuild/report-editor-project-context.test.ts lib/workbench-v2-preset-storage.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-v2-presets.test.ts features/workbench-rebuild/workbench-preset-library-panel.test.ts`
  passed `20` files / `129` tests.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on unrelated
  existing calculator/test fixture type errors (`exactImpactSource`,
  `PresetId`, `OutputCardModel`, and citation `tone` fixture issues); no new
  report-editor, workflow, action-proposal, request-client, request-lifecycle,
  query, preset, status, context, instruction, or model type error was reported.
- Current selected next decision:
  remaining assistant write-like capabilities stay parked until one bounded
  slice selects exactly one action and its guard contract. The likely candidates
  are `create_project_report_from_current_draft`,
  `save_current_stack_as_project_assembly`,
  `create_user_preset_from_current_stack`, or a preset apply proposal; each
  needs separate stale-target, partial-success, and UI confirmation analysis.

Follow-up implementation status on 2026-06-16:

- `report_assistant_create_project_report_action_apply_v1` landed locally as
  the third confirmed assistant action flow.
- Scope is limited to `create_project_report_from_current_draft`. No assembly
  create/update, preset create/apply, export, delete, archive, material update,
  calculator route, source-row import, or formula retune was added.
- The action proposal contract now supports three preview-only actions:
  `create_project_report_from_current_draft`,
  `save_project_report_revision_from_current_draft`, and
  `restore_report_revision_as_new_draft`. They remain `mutates: false`,
  `previewOnly: true`, and `requiresConfirmation: true` until a user confirms
  in the editor.
- Create-report proposals require a selected saved project assembly target
  (`projectId` and `assemblyId`) and reject drafts already linked to a project
  report. Existing report drafts must use the save-revision action instead.
- The create-report proposal response identifies the apply body as
  `document: "current_report_document"`, `source: "assistant"`,
  `assemblyId: "selected_project_assembly"`,
  `name: "current_report_library_name"`,
  `sourceAssemblySnapshot: "selected_project_assembly_snapshot"`, and
  `sourceMaterialSnapshot: "selected_project_material_snapshot"`. It does not
  embed the full report document or assembly snapshot in the proposal payload.
- The Workbench V2 report editor accepts create-report proposals only when the
  body markers and `target.assemblyId` are present.
- Confirming create-report rechecks the current `documentSignature`, selected
  project id, selected assembly id, and absence of an already selected report
  before sending any write request. Stale or incompatible targets clear the
  proposal and leave the browser draft intact.
- The confirmed create-report write reuses the existing
  `/api/projects/:projectId/reports` route, sends one POST with the current
  report document, selected assembly id, current report library name, selected
  source assembly snapshot, optional calculation output, and selected material
  snapshot. It does not create an assembly first, so the known multi-write
  partial-success risk stays outside this slice.
- Successful create-report confirmation updates local project context with the
  returned `serverProjectReportId` and `serverProjectReportUpdatedAtIso`, stores
  the updated preview, clears the action proposal, and logs an assistant-thread
  success message.
- Focused validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-runtime-status.test.ts`
  passed `4` files / `27` tests.
- Broader assistant, query, preset, action, lifecycle, editor, and create-report
  validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-request-lifecycle.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench-rebuild/report-editor-project-context.test.ts lib/workbench-v2-preset-storage.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-v2-presets.test.ts features/workbench-rebuild/workbench-preset-library-panel.test.ts`
  passed `20` files / `132` tests.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on unrelated
  existing calculator/test fixture type errors (`exactImpactSource`,
  `PresetId`, `OutputCardModel`, and citation `tone` fixture issues); after the
  target typing fix, no new report-editor, workflow, action-proposal,
  request-client, request-lifecycle, query, preset, status, context,
  instruction, or model type error was reported.
- Current selected next decision:
  remaining assistant write-like capabilities stay parked until one bounded
  slice selects exactly one action and its guard contract. The likely candidates
  are `save_current_stack_as_project_assembly`,
  `create_user_preset_from_current_stack`, or a preset apply proposal. Assembly
  save is riskier than report create because it writes a different project
  child object; preset actions need a separate owner-scoped preset/apply
  contract.

Follow-up implementation status on 2026-06-16:

- `report_assistant_save_current_stack_as_project_assembly_action_apply_v1`
  landed locally as the fourth confirmed assistant action flow.
- Scope is limited to `save_current_stack_as_project_assembly`. No project
  report create/revision behavior was changed in this slice, and no preset
  create/apply, export, delete, archive, material update, calculator route,
  source-row import, or formula retune was added.
- The action proposal contract now supports four preview-only actions:
  `create_project_report_from_current_draft`,
  `save_current_stack_as_project_assembly`,
  `save_project_report_revision_from_current_draft`, and
  `restore_report_revision_as_new_draft`. They remain `mutates: false`,
  `previewOnly: true`, and `requiresConfirmation: true` until a user confirms
  in the editor.
- Assembly-save proposals require a selected project target and reject drafts
  already linked to a project report. Existing report drafts must use
  save-revision/restore flows instead of silently changing their source
  assembly.
- The assembly-save proposal response identifies the apply body as
  `document: "current_report_document"`,
  `calculationSummary: "current_project_calculation_summary_if_present"`,
  `kind: "current_stack_kind"`, `name: "current_assembly_library_name"`, and
  `snapshot: "current_source_assembly_snapshot"`. It does not embed the source
  stack snapshot in the proposal payload.
- The Workbench V2 report editor accepts assembly-save proposals only when the
  body markers are present and the target project id still matches the selected
  project.
- Confirming assembly-save rechecks the current `documentSignature`, selected
  project id, source stack availability, and absence of an already selected
  report before sending any write request. Stale or incompatible targets clear
  the proposal and leave the browser draft intact.
- The confirmed assembly-save write reuses the existing
  `/api/projects/:projectId/assemblies` route, sends one POST with the current
  stack kind, assembly library name, source stack snapshot, and optional
  calculation summary. It does not create a report afterward, so this slice
  avoids the multi-write partial-success risk.
- Successful assembly-save confirmation updates local project context and the
  local report draft with the returned `serverProjectAssemblyId`, stores the
  updated preview, clears the action proposal, and logs an assistant-thread
  success message.
- Focused validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-runtime-status.test.ts`
  passed `4` files / `30` tests.
- Broader assistant, query, preset, action, lifecycle, editor, and assembly-save
  validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-request-lifecycle.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench-rebuild/report-editor-project-context.test.ts lib/workbench-v2-preset-storage.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-v2-presets.test.ts features/workbench-rebuild/workbench-preset-library-panel.test.ts`
  passed `20` files / `135` tests.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on unrelated
  existing calculator/test fixture type errors (`exactImpactSource`,
  `PresetId`, `OutputCardModel`, and citation `tone` fixture issues); no new
  report-editor, workflow, action-proposal, request-client, request-lifecycle,
  query, preset, status, context, instruction, or model type error was reported.
- Current selected next decision:
  remaining assistant write-like capabilities stay parked until one bounded
  slice selects exactly one action and its guard contract. The likely candidates
  are now `create_user_preset_from_current_stack` or a preset apply proposal.
  Both require owner-scoped preset validation and must keep presets distinct
  from project/report records.

Follow-up implementation status on 2026-06-16:

- `report_assistant_create_user_preset_from_current_stack_action_apply_v1`
  landed locally as the fifth confirmed assistant action flow.
- Scope is limited to `create_user_preset_from_current_stack`. No preset apply,
  preset update/delete, project report write, project assembly write,
  calculator route, source-row import, or formula retune was added in this
  slice.
- The action proposal contract now supports five preview-only actions:
  `create_project_report_from_current_draft`,
  `create_user_preset_from_current_stack`,
  `save_current_stack_as_project_assembly`,
  `save_project_report_revision_from_current_draft`, and
  `restore_report_revision_as_new_draft`. They remain `mutates: false`,
  `previewOnly: true`, and `requiresConfirmation: true` until a user confirms
  in the editor.
- Preset-create proposals require the editor to send
  `sourceStackAvailable: true`; the server-side preview route does not infer a
  source stack from names or project/report ids.
- The preset-create proposal response identifies the apply body as
  `document: "current_report_document"`,
  `name: "current_assembly_library_name"`, and
  `snapshot: "current_source_assembly_snapshot"`. It does not embed the full
  source stack snapshot in the proposal payload and does not target a project,
  assembly, report, or revision id.
- The Workbench V2 report editor accepts preset-create proposals only when the
  owner-scoped preset markers are present. It does not require a project target
  for this action.
- Confirming preset-create rechecks the current `documentSignature` and actual
  source stack availability before sending any write request. A missing source
  stack clears the proposal and leaves the browser draft intact.
- The confirmed preset-create write reuses the existing
  `/api/workbench-v2/presets` route, sends one POST with the current assembly
  library name, source stack snapshot, and a compact description derived from
  the report name. The preset route still parses the Workbench V2 snapshot and
  stores the preset under the owner scope, not the selected project.
- Successful preset-create confirmation leaves project/report/assembly context
  unchanged, clears the action proposal, and logs an assistant-thread success
  message naming the saved preset.
- Focused validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-runtime-status.test.ts`
  passed `4` files / `33` tests.
- Broader assistant, query, preset, action, lifecycle, editor, and preset-create
  validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-request-lifecycle.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench-rebuild/report-editor-project-context.test.ts lib/workbench-v2-preset-storage.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-v2-presets.test.ts features/workbench-rebuild/workbench-preset-library-panel.test.ts`
  passed `20` files / `138` tests.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on unrelated
  existing calculator/test fixture type errors (`exactImpactSource`,
  `PresetId`, `OutputCardModel`, and citation `tone` fixture issues); no new
  report-editor, workflow, action-proposal, request-client, request-lifecycle,
  query, preset, status, context, instruction, or model type error was reported.
- Current selected next decision:
  only the preset apply proposal remains from the documented bounded candidate
  list. It needs a separate implementation surface check because applying a
  preset changes the Workbench V2 calculator stack, while the current assistant
  action UI lives in the report editor.

Preset apply surface check on 2026-06-16:

- Preset apply was inspected but not implemented in this report-editor
  assistant slice.
- The existing apply behavior lives in
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`:
  `useSelectedWorkbenchPreset` reads `/api/workbench-v2/presets/:presetId`,
  parses the Workbench V2 snapshot, optionally asks for browser confirmation,
  calls `restoreWorkbenchV2Snapshot`, clears selected project child context via
  `clearSelectedProjectChildren`, and updates local calculator/template state.
- Common preset apply is similarly local to the calculator workbench:
  `useSelectedWorkbenchCommonPreset` parses the built-in snapshot, confirms
  replacement when needed, restores the calculator snapshot, clears selected
  project child context, and updates template state.
- There is no server-side "apply preset" route, because applying a preset is a
  browser-local calculator state transition, not an owner-scoped storage write.
- The current assistant action proposal UI is in the report editor, where
  confirming a preset apply would have to mutate another surface's calculator
  draft. Bridging that from the report editor would blur report state,
  calculator state, selected project children, and template state.
- Therefore preset apply should not be added to the report-editor action
  proposal handler. The next safe design is a separate Workbench V2 calculator
  assistant/action surface, or a shared calculator-level action controller that
  can preview the exact preset snapshot, show the replacement/child-context
  effects, and call the same restore/clear functions inside the calculator
  component.
- Current selected next decision:
  the report-editor assistant scope expansion candidate list is complete except
  for preset apply, which is intentionally parked until a calculator-surface
  assistant/action controller exists.

Calculator-use first slice status on 2026-06-17:

- `workbench_v2_calculator_assistant_preview_v1` landed locally as the first
  assistant capability that can use the calculator without changing calculator
  behavior.
- Scope is limited to previewing a Workbench V2 calculator snapshot through the
  existing runtime route shape. It does not change formulas, source rows,
  route selection, saved project records, report documents, presets, or browser
  calculator state.
- New helper:
  `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`.
  It parses the supplied Workbench V2 snapshot with
  `parseWorkbenchV2ProjectSnapshot`, builds the same dynamic estimate payload
  shape used by the calculator workbench, runs `calculateAssembly` from
  `@dynecho/engine/runtime`, and returns bounded assistant context:
  calculation summary, output rows, route tasks, selected outputs, request
  snapshot summary, optional estimate payload, and engine support/boundary
  summary.
- New preview-only route:
  `apps/web/app/api/report-assistant/calculator-preview/route.ts`.
  It uses the existing configured-auth guard, accepts `{ snapshot,
  targetOutputs? }`, returns `mutates: false` and `previewOnly: true`, and
  rejects malformed payloads, invalid snapshots, or output overrides that the
  assistant preview helper cannot display before calculation.
- Runtime status now lists
  `preview_workbench_v2_calculator_snapshot` through
  `WORKBENCH_V2_CALCULATOR_ASSISTANT_TOOL_DEFINITIONS`, while
  `mutatingToolsExposed` remains `false`.
- The route is a calculator-use surface, not a calculator-edit surface. It is
  safe for assistant read/preview flows because the assistant must provide an
  explicit Workbench V2 snapshot and receives only a preview result. There is
  no server-side "apply calculator change" or "apply preset" mutation in this
  slice.
- Incomplete snapshots return a `needs_input` preview with workbench snapshot
  tasks instead of trying to calculate. Runtime `needs_input` boundaries are
  surfaced as calculator-route tasks, preserving the engine-owned
  `needs_input`/`unsupported` posture.
- Focused validation completed:
  `pnpm exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench/report-assistant-runtime-status.test.ts`
  from `apps/web`, passing `3` files / `12` tests.
- ESLint validation completed:
  `pnpm exec eslint features/workbench-rebuild/workbench-v2-calculator-assistant.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench/report-assistant-runtime-status.ts features/workbench/report-assistant-runtime-status.test.ts app/api/report-assistant/calculator-preview/route.ts --max-warnings=0`
  from `apps/web`.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on
  unrelated existing fixture/type issues (`exactImpactSource`, `PresetId`,
  `OutputCardModel` posture fields, and citation `tone`), but no
  `workbench-v2-calculator-assistant`, calculator-preview route, or runtime
  status type error remains after this slice.
- An attempted `pnpm --filter @dynecho/web test -- ...` focused run was
  stopped because the repo wrapper expanded into the broad long-running web
  test batch. The direct Vitest command above is the relevant focused
  validation for this slice.
- Current selected next decision:
  build a Workbench V2 calculator assistant/action surface that can feed the
  current browser snapshot into this preview route and display the resulting
  output rows/tasks. Confirmed calculator state changes, including preset
  apply, should remain parked until that surface can call the calculator
  component's existing restore/clear/update functions after user confirmation.

Workbench V2 calculator assistant surface status on 2026-06-17:

- `workbench_v2_calculator_assistant_surface_v1` landed locally as the first
  browser-visible surface for the calculator preview route.
- Scope is limited to `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
  plus review-panel CSS and a source-guard test. No calculator engine files,
  formula routes, source rows, saved project records, report documents, preset
  storage behavior, or browser calculator state mutation were changed.
- The Workbench V2 calculator review panel now has an `Assistant preview`
  section with an explicit `Run` button. It calls
  `/api/report-assistant/calculator-preview` only on that click, sending the
  current `currentWorkbenchDraftSnapshot` and current selected outputs as
  `targetOutputs`.
- The client imports only the assistant preview type from
  `workbench-v2-calculator-assistant`; it does not import `@dynecho/engine` or
  run `calculateAssembly` in the browser component. Calculator execution stays
  behind the preview route added in the prior slice.
- The panel displays bounded preview data returned by the route: calculation
  summary, layer/output counts, `needs_input`/route tasks, and assistant output
  rows. The existing calculator result panel remains the primary live
  calculator result.
- Preview state is cleared when the Workbench V2 snapshot changes, so stale
  assistant preview rows do not remain visible after the user edits the stack,
  context, materials, selected output set, or active assembly/template name.
- New guard test:
  `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`.
  It proves the calculator workbench calls the preview-only route with the
  active snapshot/selected outputs and keeps direct engine execution outside
  the client component.
- Focused validation completed from `apps/web`:
  `pnpm exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench/report-assistant-runtime-status.test.ts`
  passed `4` files / `14` tests.
- ESLint validation completed from `apps/web`:
  `pnpm exec eslint features/workbench-rebuild/calculator-workbench.tsx features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench/report-assistant-runtime-status.ts features/workbench/report-assistant-runtime-status.test.ts app/api/report-assistant/calculator-preview/route.ts --max-warnings=0`.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on unrelated
  existing fixture/type issues (`exactImpactSource`, `PresetId`,
  `OutputCardModel` posture fields, and citation `tone`), but no
  `calculator-workbench`, `workbench-v2-calculator-assistant-ui`,
  calculator-preview route, helper, or runtime-status type error was reported.
- Browser smoke validation completed on a preview-mode dev server at
  `http://localhost:3013/workbench-v2`: Playwright opened the page, confirmed
  the `Assistant preview` panel rendered, clicked `Run`, and observed the
  preview route result in the panel (`57 dB`, `3` layers, `1` output, `Rw`
  calculated). Console output contained only React DevTools/Fast Refresh dev
  messages.
- Browser artifact:
  `output/playwright/workbench-v2-calculator-assistant-preview.png`.

Workbench V2 calculator assistant surface hardening status on 2026-06-17:

- `workbench_v2_calculator_assistant_surface_stale_preview_guard_v1` landed
  locally as a narrow client-side hardening follow-up.
- The Workbench V2 calculator assistant preview now tracks an in-flight request
  id and `AbortController`. Starting a new preview aborts the prior preview
  request, and changing the Workbench V2 snapshot invalidates/aborts any pending
  preview before clearing the displayed assistant preview state.
- The snapshot-change guard intentionally skips the initial mount effect before
  storing the first snapshot reference, so a very early user/automation click on
  `Run` cannot be canceled by the first effect pass.
- Late responses from an older snapshot no longer write into
  `calculatorAssistantState`; the result is accepted only when the request id
  still matches and the request signal was not aborted.
- Component unmount also invalidates and aborts the pending preview request.
- The guard test in
  `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
  now covers the request id, abort controller, fetch signal, and stale-response
  predicate. Client-side direct engine execution is still forbidden by the same
  test file.
- Focused validation completed from `apps/web`:
  `pnpm exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench/report-assistant-runtime-status.test.ts`
  passed `4` files / `15` tests.
- ESLint validation completed from `apps/web` for the touched calculator
  assistant UI/helper/route/status files.
- Browser smoke validation was repeated on
  `http://localhost:3013/workbench-v2` after the guard landed: Playwright
  clicked `Run`, observed the transient `Running` state, then observed the
  accepted preview result (`57 dB`, `3` layers, `1` output, `Rw` calculated).
  Console output contained only React DevTools/Fast Refresh dev messages.
- The preview panel now also surfaces the route basis context already returned
  by the preview route: calculator label/id, method, supported target-output
  count, and unsupported target-output count. The verified default wall preview
  shows `Dynamic Topology`, method `dynamic`, `1` supported output, and `0`
  unsupported outputs.
- `pnpm --filter @dynecho/web typecheck` was rerun. It still fails on unrelated
  existing fixture/type issues (`exactImpactSource`, `PresetId`,
  `OutputCardModel` posture fields, and citation `tone`), but no stale-preview
  guard, `calculator-workbench`, calculator assistant UI test, route, helper,
  or runtime-status type error was reported.
- Current selected next decision:
  next calculator-assistant work can consider a separate preview-only
  calculator action controller. Confirmed calculator state changes, including
  preset apply, remain parked until that controller can call the calculator
  component's existing restore/clear/update functions after explicit user
  confirmation.

Described layer calculator-use status on 2026-06-17:

- `report_assistant_described_layer_calculator_preview_v1` landed locally to
  close the gap between previewing an already-entered Workbench stack and
  letting the assistant use the calculator from a layer configuration described
  by the user.
- Follow-up plan doc:
  `docs/ui/REPORT_ASSISTANT_CALCULATOR_PREVIEW_PRODUCTIZATION_PLAN_2026-06-17.md`.
  It selects structured assistant calculator result rendering plus described
  wall parser hardening as the next safe slice, while parking floor description
  parsing and Workbench mutation.
- New helper:
  `previewDescribedLayerConfiguration` in
  `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`.
  It accepts a non-empty description, parses wall layer segments with explicit
  positive `mm` thicknesses, maps conservative material aliases to the resolved
  catalog, builds a temporary Workbench V2 wall snapshot, and reuses the
  existing snapshot calculator preview path. It does not write Workbench state.
- New advertised tool:
  `preview_described_layer_configuration`, with `mutates: false`,
  `previewOnly: true`, and required input `description`. Runtime status now
  lists it beside `preview_workbench_v2_calculator_snapshot`.
- The calculator-preview route now accepts either `{ snapshot, targetOutputs? }`
  or `{ description | layerConfiguration, mode?, targetOutputs? }`. Snapshot
  behavior is unchanged; described configurations return the new tool name and
  include parsed layer metadata in `describedConfiguration`.
- The read-only report assistant query route now detects bounded calculator
  requests that include an `mm` layer description plus calculator/output intent
  such as `calculator`, `hesapla`, `Rw`, or `STC`. Those requests return a
  calculator preview answer with `calculator_preview` evidence and no project
  reads or mutations.
- First described scope is intentionally wall-only. Explicit or inferred floor
  descriptions return `needs_input` explaining that floor calculator context
  should still come from a Workbench V2 snapshot until floor description parsing
  captures route-required physical inputs such as load basis, dynamic stiffness,
  and field context. The helper must not guess those inputs.
- Unmatched material phrases return `needs_input` tasks instead of selecting a
  nearest catalog row. This preserves the calculator north-star rule to ask for
  input or return unsupported instead of aliasing unknown constructions.
- Validation completed from `apps/web`:
  `pnpm exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts`
  passed `4` files / `23` tests.
- ESLint validation completed from `apps/web` for the touched assistant
  calculator/query files:
  `pnpm exec eslint app/api/report-assistant/calculator-preview/route.ts features/workbench-rebuild/workbench-v2-calculator-assistant.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench/report-assistant-query.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-runtime-status.test.ts`.
- No calculator engine formula, source-row import, preset apply, export builder,
  project storage mutation, or Workbench stack mutation was added in this slice.

## Non-Goals

- No calculator formula changes.
- No engine source row imports.
- No changes to active calculator selected-next docs for this assistant scope.
- No direct model write tools.
- No silent project save, report save, preset apply, or material update.
- No assistant control over PDF export.
- No PDF/DOCX builder redesign.
- No storage of full assistant chat transcripts in project records.
- No broad source crawl or acoustic calibration from assistant research.
- No full project JSON in default assistant requests.
- No database migration for this slice.
- No `Acoustic2` edits, runtime imports, symlinks, or live upstream dependency.
- No legacy `/workbench` simple/advanced shell work unless a future task names
  that surface explicitly.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Patch route becomes an implicit tool loop | Model may start performing actions outside validator control | Keep `/patch` output as `ReportAssistantPatch` only; add separate `/query` and action-proposal routes |
| Assistant writes project state too early | Hidden mutation and stale overwrites | Use preview-only proposals first; require confirmation and stale guards for apply |
| Default context sends too much data | Slow requests and unnecessary exposure | Summary-first payloads, list caps, explicit child document reads |
| Two assistant UIs drift | Different safety behavior between old configure and V2 editor | Shared context contract tests and one view-model for project workspace summaries |
| Presets become project records | Confusing ownership and bad restores | Keep preset summaries separate; never store project/report ids inside presets |
| Assistant claims values are saved | User trust issue | UI copy distinguishes proposed, applied-to-draft, and saved revision states |
| Wrong-owner project ids leak data | Security/privacy issue | Reuse existing project route owner resolution and tests for every read/query route |
| Stale assistant response edits newer draft | Data loss | Preserve document signatures and expected updated timestamps in proposals |
| Multi-write assistant action partially succeeds | Orphaned assembly/report mismatch | Do not start with multi-write actions; expose partial-success recovery before allowing them |
| Assembly update race | Saved combination overwritten by older context | Defer assistant assembly update until an expected assembly timestamp/version guard exists |
| Full saved documents leak into routine model turns | Large payloads and unnecessary exposure | Never call full child reads during default patch requests; summarize explicit reads before model use |
| Deterministic parser guard is loosened globally | Save/write/delete wording reaches patch parser | Add separate action-intent parser; keep patch parser forbidden-action hints intact |
| Research is treated as calibration | Assistant recommendations start moving calculator truth | Keep research output report-only; require separate calculator/source-owner slice for formula/source-row changes |
| Common preset sources become exact rows by accident | Seed library weakens metric/basis ownership | Keep preset/source comparison metadata separate from engine runtime and source-row imports |
| Legacy workbench shells are edited | Active `/workbench-v2` behavior diverges from old shells | Keep assistant expansion on `/workbench-v2` and `/workbench/proposal` unless legacy work is explicitly requested |
| Export pipeline is changed for assistant convenience | PDF/DOCX regressions outside assistant scope | Preserve existing export builders and verify assistant edits flow through the report document only |
| Workspace objects collapse into one project concept | Users cannot tell draft, report, revision, combination, or preset state | Use state-specific context fields and UI copy that names the object being read or changed |
| Runtime status misrepresents capability | Operators think write tools are available or absent incorrectly | Update status tests whenever query/action proposal routes are added |
| Dirty working tree hides ownership conflict | Parallel changes are overwritten | Phase 0 owned-file list and status snapshot before implementation |

## Test Strategy

Baseline tests before implementation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-context.test.ts \
  features/workbench/report-assistant-instruction.test.ts \
  features/workbench/report-assistant-model.test.ts \
  features/workbench/report-assistant-patch.test.ts \
  features/workbench/report-assistant-project-tools.test.ts \
  features/workbench/report-assistant-project-read-route.test.ts \
  features/workbench/report-assistant-project-workspace.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts \
  features/workbench/report-assistant-request-client.test.ts \
  features/workbench/report-assistant-intent.test.ts
```

Add tests as scope expands:

- context parser accepts new summary fields and rejects malformed bodies;
- model payload includes summaries but not full documents by default;
- Workbench V2 report editor either populates `availableReadTools` directly or
  deliberately relies on `buildReportAssistantContext` normalization with test
  coverage;
- Workbench V2 report editor context remains safe when `availableReadTools` is
  omitted and normalized by `buildReportAssistantContext`;
- active draft state changes the assistant context signature;
- linked assembly summary does not include raw snapshots by default;
- project query route rejects write intents before repository access;
- query route records `usedReads` with `mutates: false`;
- query route caps internal reads and returns a typed error when the request
  needs an explicit id;
- revision diff helper truncates or summarizes long text fields;
- revision diff helper reports stale/unavailable saved context without throwing
  away the current draft;
- preset summary reads do not include project/report ids;
- preset/template context clears or excludes selected assembly/report child
  state when a preset is applied;
- research responses and common preset source metadata do not generate patch
  drafts or engine/source-row changes;
- action proposal validator blocks stale report saves;
- action apply route requires confirmation;
- action apply recomputes document signature before mutation;
- action apply persists full report document plus compact assistant metadata;
- action proposal tests prove the deterministic patch parser still rejects
  save/apply/write/delete hints, the model contract still excludes those
  operations, and `/api/report-assistant/patch` remains `ReportAssistantPatch`
  only;
- runtime status continues to expose `mutatingToolsExposed: false` for the
  assistant tool registry until direct write tools are intentionally introduced;
  preview/apply routes should be reported separately if added.
- route/UI tests continue to target `/workbench-v2` and `/workbench/proposal`
  rather than legacy workbench shells;
- export-path smoke or source-diff checks prove assistant scope changes did not
  edit PDF/DOCX builders.

Suggested broader check after implementation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-context.test.ts \
  features/workbench/report-assistant-instruction.test.ts \
  features/workbench/report-assistant-model.test.ts \
  features/workbench/report-assistant-patch.test.ts \
  features/workbench/report-assistant-project-tools.test.ts \
  features/workbench/report-assistant-project-read-route.test.ts \
  features/workbench/report-assistant-project-workspace.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts \
  features/workbench/report-assistant-request-client.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench-rebuild/project-workspace-panel.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  features/workbench-rebuild/workbench-preset-library-panel.test.ts \
  features/workbench-rebuild/workbench-v2-presets.test.ts \
  features/workbench-rebuild/workbench-v2-common-presets.test.ts \
  features/workbench-rebuild/workbench-v2-persistence-state.test.ts \
  lib/workbench-v2-preset-storage.test.ts \
  lib/workbench-v2-preset-routes.test.ts
```

Run `pnpm check` only if shared schemas, route contracts, broad UI behavior, or
project persistence code move enough to justify the full gate.

## Historical First Slice

The initial implementation slice was intentionally limited to Phase 0 and
Phase 1. Later local slices have since landed through Phase 4; the current
selected next slice is recorded in the Phase 4 implementation status above.

First slice label:

```text
report_assistant_workspace_scope_v1
```

Implementation status on 2026-06-16:

- `report_assistant_workspace_scope_v1` landed locally as a no-write assistant
  context expansion.
- `ReportAssistantProjectWorkspaceSnapshot` now carries summary-only
  `linkedAssembly` and `activeDraftState` fields.
- The shared project workspace loader now uses `list_project_assemblies` only
  for linked assembly summaries; it still does not call
  `read_project_assembly_snapshot`, `read_project_report_document`, or
  `read_project_report_revision` during default patch context loading.
- Workbench V2 report editor now populates the read-tool manifest directly
  instead of relying on an empty `availableReadTools` placeholder.
- Proposal configure and Workbench V2 report editor pass active draft state into
  `buildReportAssistantContext`; patch generation remains centered on current
  context, current document, and instruction.
- No query route, action proposal route, project/report write, preset apply,
  export builder change, or calculator behavior change was added.
- Validation completed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-intent.test.ts features/workbench-rebuild/report-editor-project-context.test.ts`
  passed `11` files / `81` tests.
- Historical selected next slice after this first slice:
  `report_assistant_revision_and_document_comparison_summaries_v1`
  (`Phase 2 - Revision and document comparison summaries`).

First slice deliverables:

1. Reconcile assistant project workspace baseline files.
2. Populate `availableReadTools` consistently in Workbench V2 report editor, or
   make the context-builder normalization dependency explicit with tests.
3. Add linked project/report/revision/assembly summary fields to assistant
   context.
4. Add current/previous revision summary context only; leave bounded diff helpers
   to Phase 2.
5. Add tests proving full documents/snapshots are not sent by default.
6. Add a targeted test that patch requests still use only current context,
   current document, and instruction.
7. Add a baseline note for pre-existing dirty/untracked assistant, project
   storage, preset, and report editor files.
8. Keep `/api/report-assistant/patch` unchanged as a patch-only route.
9. Update this plan with landed status and the selected next slice.

First slice should not add:

- query route;
- action proposal route;
- preset apply;
- project/report writes;
- calculator changes.

This gives the assistant a larger useful scope while preserving the current
safety model.
