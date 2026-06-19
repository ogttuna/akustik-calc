# Workbench V2 User Preset Library Plan - 2026-06-15

## Status

Implementation landed in Workbench V2 on 2026-06-15.

Implemented scope:

- owner-scoped server-backed preset storage
- `/api/workbench-v2/presets` route family
- defensive client preset parsers
- compact Workbench V2 preset library panel
- top-bar `Presets` launcher next to `Project`
- save current draft as preset without a project
- load preset as the current draft without a project
- confirm before replacing a different current draft with a preset
- clear selected project assembly/report when a preset is applied
- keep the active project selected when a preset is applied

Validation completed:

- `pnpm exec vitest run lib/workbench-v2-preset-storage.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-v2-presets.test.ts features/workbench-rebuild/workbench-preset-library-panel.test.ts`
- `pnpm exec vitest run features/workbench-rebuild/workbench-v2-project-snapshot.test.ts features/workbench-rebuild/material-editor-surface-parity.test.ts features/workbench-rebuild/project-workspace-panel.test.ts`
- Browser smoke on `http://localhost:3012/workbench-v2`: login, open presets, save preset, reload, use preset, mobile overflow check, delete smoke preset.
- Follow-up smoke after the confirmation guard: save preset, change current draft, accept the replace confirmation, verify preset load, mobile overflow check, delete smoke preset.

Known validation note:

- `pnpm --filter @dynecho/web typecheck` still fails in pre-existing `features/workbench/*` test type errors unrelated to this preset implementation. After fixing this feature's own test typing issue, no remaining typecheck error points at the new preset files.

The requested feature is a user preset library for Workbench V2:

- The calculator must remain usable without creating or selecting a project.
- A user must be able to save the current layer combination as a reusable preset.
- A user must be able to reopen the workbench later, select a preset, and use it as the starting layer stack.
- Presets are not calculation logic. They must not touch `packages/engine`.
- Presets must preserve the workbench inputs that make the layer combination meaningful: mode, layers, context fields, selected outputs, custom materials, and material visual overrides.
- UI must stay simple, clear, and consistent with the current Workbench V2 top-bar/panel model.

## Non-Goals

- Do not change formula routes, calculator decisions, metric support, source rows, or engine exports.
- Do not replace project saved combinations.
- Do not make project creation mandatory.
- Do not make presets report containers.
- Do not import or mutate the legacy static workbench preset catalog as part of the first implementation.
- Do not add assistant/MCP project visibility work in this feature unless a later task explicitly asks for it.

## Product Model

The feature should introduce a new concept:

`User preset`: a reusable, user-scoped starter snapshot for Workbench V2.

This is distinct from the existing concepts:

- `Project`: a named workspace for saved combinations and saved reports.
- `Saved combination`: a project-scoped assembly snapshot, with project metadata and report linkage.
- `Saved report`: a project-scoped report document with revisions.
- `Legacy preset`: the older hardcoded catalog in `apps/web/features/workbench/preset-definitions.ts`.

The most important boundary is:

Presets are starter templates. They should load into the current workbench draft, but they should not imply that the user is editing the source preset or a project assembly.

## Current Implementation Findings

### Workbench V2 already has the right snapshot shape

`apps/web/features/workbench-rebuild/workbench-v2-project-snapshot.ts` defines:

- `WORKBENCH_V2_PROJECT_SNAPSHOT_SCHEMA_ID`
- `WorkbenchV2ProjectSnapshot`
- `buildWorkbenchV2ProjectSnapshot`
- `parseWorkbenchV2ProjectSnapshot`

The snapshot already captures:

- `mode`
- `layers`
- `selectedLayerId`
- `selectedOutputs`
- `context`
- `customMaterials`
- `materialVisualOverrides`
- `name`
- `savedAtIso`

This is the correct base payload for user presets. Reusing it avoids a second, divergent persistence format.

### Snapshot restore already restores the important workbench state

`apps/web/features/workbench-rebuild/calculator-workbench.tsx` has `restoreWorkbenchV2Snapshot`.

It restores:

- mode
- layer stack
- selected layer
- selected outputs
- context fields
- custom material library entries
- material visual overrides
- material editor selected material
- material editor warning state
- undo stack and layer interaction state

This is the correct apply path for presets. The preset feature should call this same restore logic after fetching and parsing a stored preset snapshot.

### Project saved combinations are project-scoped by design

`apps/web/features/workbench-rebuild/project-workspace-combinations.tsx` already lets the user save, load, rename, duplicate, and delete combinations under a selected project.

`apps/web/features/workbench-rebuild/calculator-workbench.tsx` requires `selectedServerProjectId` before `saveCurrentAssemblyToServerProject` can persist a combination.

That behavior is correct for project workspace. It should not be reused as-is for presets because the user explicitly wants presets to work even when no project is selected.

### Existing server project storage has useful patterns

`apps/web/lib/server-project-storage.ts` provides:

- owner-scoped storage
- UUID validation
- payload size guards
- max child count guards
- schema validation before writes
- atomic temp-file then rename writes
- preview/configured owner separation through `project-storage-auth.ts`

Preset storage should follow the same engineering pattern, but should not be embedded into each project file. A preset library is user-scoped, not project-scoped.

### Existing project panel should not become the preset UI

The current project panel is already responsible for:

- project identity
- saved combinations
- saved reports

Adding presets into that same panel would blur the product model and bring back the clutter the user already called out. Presets need a small, separate launcher/panel in the Workbench V2 header area.

## Recommended Architecture

### Storage Scope

Use a server-backed, owner-scoped preset library.

Recommended path shape:

```text
.dynecho/project-store/owners/<ownerId>/workbench-v2-presets.json
```

This keeps presets next to the existing project store, but outside the project records.

Why this is the right default:

- Presets remain available without selecting a project.
- Presets survive browser storage clearing.
- The existing preview/configured auth owner model can be reused.
- No project record schema migration is needed.
- Project saved combinations and reports remain cleanly separated.

Browser-local only storage would be faster to implement, but it is a weaker product fit because the user described presets as something available whenever they enter the workbench. Since the project system already has file-backed owner storage, a server-backed preset library is the better first-class model.

### New Web-Local Storage Module

Add a new module, for example:

```text
apps/web/lib/workbench-v2-preset-storage.ts
```

The module should not import `packages/engine`.

Responsibilities:

- define preset record and summary types
- validate IDs
- list presets for an owner
- read one preset
- create preset
- update preset metadata
- duplicate preset
- delete preset
- atomically write the preset library file
- enforce count and payload limits

Recommended constants:

```ts
export const MAX_WORKBENCH_V2_PRESETS = 120;
export const MAX_WORKBENCH_V2_PRESET_BYTES = 500_000;
export const MAX_WORKBENCH_V2_PRESET_NAME_LENGTH = 160;
export const MAX_WORKBENCH_V2_PRESET_DESCRIPTION_LENGTH = 500;
```

The 500 KB payload limit matches the existing project assembly guard and should be enough because the snapshot is the same kind of payload.

### Preset Record Shape

Recommended stored record:

```ts
type WorkbenchV2UserPresetRecord = {
  createdAtIso: string;
  description?: string;
  id: string;
  kind: "floor" | "wall";
  layerCount: number;
  name: string;
  ownerId: string;
  schemaVersion: 1;
  snapshot: JsonValue;
  source: "workbench_v2";
  updatedAtIso: string;
};
```

Recommended list summary:

```ts
type WorkbenchV2UserPresetSummary = {
  createdAtIso: string;
  description?: string;
  id: string;
  kind: "floor" | "wall";
  layerCount: number;
  name: string;
  updatedAtIso: string;
};
```

Store the snapshot as JSON and parse it through `parseWorkbenchV2ProjectSnapshot` when reading/applying. This keeps preset storage tolerant of future snapshot parser improvements.

Layering note:

The storage repository should not need to import React, workbench UI components, or calculator code. If importing `parseWorkbenchV2ProjectSnapshot` from `features/workbench-rebuild` into `apps/web/lib` feels like a feature-to-lib inversion, keep parsing in the API route or a neutral helper and pass derived metadata into the repository. The repository can stay responsible for durable JSON storage and owner isolation.

### API Routes

Recommended route family:

```text
GET    /api/workbench-v2/presets
POST   /api/workbench-v2/presets
GET    /api/workbench-v2/presets/[presetId]
PATCH  /api/workbench-v2/presets/[presetId]
DELETE /api/workbench-v2/presets/[presetId]
POST   /api/workbench-v2/presets/[presetId]/duplicate
```

API rules:

- Reuse `getAuthState` and `resolveProjectOwnerScope`.
- Use owner-only access. Do not require a project.
- Return summaries for list calls.
- Return full preset record only for read/create/duplicate where the client may apply it.
- Reject malformed JSON with `400`.
- Reject oversized snapshots with `413`.
- Return `404` when the preset does not exist for the current owner.
- Do not expose raw filesystem paths.

Access actions can either:

- add preset-specific actions to the shared project access policy, or
- keep a small route-local owner-only check if no team/project policy is needed.

If project policy is extended, the names should be explicit:

- `list_workbench_presets`
- `read_workbench_preset`
- `save_workbench_preset`
- `delete_workbench_preset`

Do not reuse `save_project_assembly` because presets are not project children.

### Client State

Add preset state to `calculator-workbench.tsx` only after storage/routes are in place.

Recommended state:

- `presetPanelOpen`
- `presetStatus: "idle" | "loading" | "syncing" | "restoring" | "error"`
- `presetMessage`
- `presetSummaries`
- `selectedPresetId`
- `presetNameDraft`
- `presetDescriptionDraft`
- `presetRenameDraft`
- `presetRenameDescriptionDraft`
- `presetMutationInFlightRef`

Recommended client functions:

- `refreshWorkbenchPresets`
- `saveCurrentWorkbenchAsPreset`
- `loadSelectedWorkbenchPreset`
- `renameSelectedWorkbenchPreset`
- `duplicateSelectedWorkbenchPreset`
- `deleteSelectedWorkbenchPreset`

Apply behavior must be explicit:

1. Fetch full preset.
2. Parse `preset.snapshot` through `parseWorkbenchV2ProjectSnapshot`.
3. If parse fails, show an error and do not mutate the workbench.
4. Confirm replacement of the current draft if needed.
5. Call `restoreWorkbenchV2Snapshot(parsed)`.
6. Clear selected project assembly/report state so the loaded preset cannot masquerade as the selected saved combination or report.
7. Keep the selected project itself if one was already selected, because the user may want to save the preset-derived draft into that project.

The important state reset is:

- clear `selectedServerAssemblyId`
- clear `selectedServerReportId`
- clear report rename drafts tied to old selection

Do not forcibly clear `selectedServerProjectId`; keeping it makes "load preset, then save combination into active project" efficient.

### Snapshot Build Path

`calculator-workbench.tsx` already has `buildCurrentWorkbenchV2ServerSnapshot`.

Implementation should either:

- rename it to a neutral helper such as `buildCurrentWorkbenchV2Snapshot`, or
- add a small wrapper `buildCurrentWorkbenchV2PresetSnapshot`.

Avoid duplicating the snapshot construction field by field. The project and preset paths must stay in sync.

### UI Placement

Use a separate top-bar trigger next to `Project`.

Recommended header controls:

```text
[Project  No project] [Presets  3 saved] [Wall] [4 layers] [92 mm] [Ready]
```

The `Presets` panel should open in the same general area as the project panel, above the calculator main workspace, but not inside the project panel.

This keeps the default workbench clean:

- No preset list is visible until the user opens it.
- Project creation remains optional.
- The calculator remains the first screen.

### Preset Panel UI

Recommended component:

```text
apps/web/features/workbench-rebuild/workbench-preset-library-panel.tsx
```

Keep the layout compact:

- header row with title, status badge, close button
- "Save current as preset" row with name and description fields
- search/filter row if list size justifies it
- list rows for presets
- selected-row actions

Suggested primary actions:

- `Save preset`
- `Use preset`
- `Rename`
- `Duplicate`
- `Delete`

Avoid:

- nested cards
- always-visible project details
- large instructional text
- landing-page style sections
- exposing implementation terms like "snapshot" in the UI

Use existing button, badge, row, and focus-ring classes where possible so the visual system stays consistent with `ProjectWorkspacePanel`.

### UI Copy

Recommended user-facing labels:

- Header trigger: `Presets`
- Empty state: `No saved presets`
- Save button: `Save preset`
- Apply button: `Use preset`
- Success message: `Preset saved`
- Apply success: `Preset loaded`
- Error when apply parse fails: `Preset cannot be loaded`

Avoid "project", "assembly", and "snapshot" in preset UI copy unless the action really involves a project.

## Edge Cases

### No Project Selected

This must be the primary path:

- user edits calculator
- opens Presets
- enters name/description
- saves preset
- later applies preset

No project creation or project selection should be required.

### Project Selected

If a project is selected, saving a preset should still save to the user preset library, not to the selected project.

If a preset is loaded while a project is selected:

- keep the active project selected
- clear selected assembly/report
- let the user save the resulting draft as a new project combination if desired

### Loaded Project Assembly Then Save As Preset

This should be allowed. The preset becomes an independent starter copy of the current workbench state.

The preset must not retain project assembly IDs, report IDs, or project names in its stored record.

### Loaded Preset Then Edit

Edits should only affect the current workbench draft. They should not mutate the preset unless the user explicitly renames/updates the preset.

For first implementation, prefer not to support "overwrite preset with current draft" unless the UI makes that action unmistakable. `Save preset` should create a new preset.

### Duplicate Names

Recommended first behavior: allow duplicate names, because projects and assemblies are not currently forced unique.

Mitigation:

- show updated date
- show mode and layer count
- duplicate action can default to `Copy of <name>`

If duplicate names become confusing in QA, add a non-blocking inline warning later.

### Empty or Overlong Names

Rules:

- trim leading/trailing whitespace
- reject empty name
- truncate or reject names over 160 characters consistently with project child naming
- description max should be enforced by schema and input `maxLength`

Rejecting overlong input is clearer than silently cutting user text in the UI. Internal duplicate-name helpers can still truncate generated copy names.

### Malformed Stored Preset

If the stored preset library file fails schema validation:

- return a server error rather than partially trusting it
- do not crash the page

If one preset has a malformed snapshot:

- list can still show the summary if the record is valid
- applying that preset should fail with `Preset cannot be loaded`
- do not mutate the current workbench

### Missing Custom Materials

Preset snapshots must include `customMaterials` and `materialVisualOverrides`.

Reason:

- a layer can reference a custom material ID
- visual colors may be custom-edited
- applying only `layers` would create broken or visually wrong combinations

Use the existing snapshot builder/parser so the material editor state stays coupled to the layer stack.

### Built-In Material Drift

If a preset references a built-in material ID that no longer exists, do not silently map it to a different material. Let existing workbench behavior surface the missing/unknown material state.

Silent remapping would be a calculator integrity risk.

### Applying Preset With Current Unsaved Draft

Applying a preset replaces the current layer/context draft.

First implementation can use a simple confirmation before replacement if the current stack differs from the preset snapshot. Existing project delete flows already use browser confirmation, so this is acceptable as a conservative guard.

Better later UI:

- inline "Use preset" confirmation state on the row
- optional "Save current as preset first" affordance

Do not add a heavy modal unless the workbench already has a modal pattern.

### Rapid Clicks and Race Conditions

Use an in-flight ref like `serverProjectMutationInFlightRef`.

Guard:

- double save
- double delete
- load while delete is in progress
- refresh while mutation is applying

After mutation:

- refresh list silently
- preserve useful success message
- keep selected preset if still present
- clear selected preset if deleted

### Storage Quota

Use count and payload limits:

- max presets: 120
- max snapshot bytes: 500 KB

Return clear errors:

- `too_many_workbench_presets`
- `workbench_preset_too_large`

### Import From Legacy Presets

Do not implement automatic migration in first pass.

The old `apps/web/features/workbench/preset-definitions.ts` catalog has a different domain shape and typed preset IDs. It is not the user-created preset library.

A future "Save built-in template as user preset" feature can be planned separately.

## Implementation Plan

### Step 1 - Add Storage Types and Repository

Create `apps/web/lib/workbench-v2-preset-storage.ts`.

Key points:

- no engine imports
- reuse `getServerProjectStoreDir` for base directory
- store under owner directory, outside `projects`
- validate UUID preset IDs
- write atomically with temp file + rename
- enforce max count, name length, description length, and snapshot byte limit
- keep summaries separate from full records

Potential issue:

- importing shared `JsonValueSchema` from `@dynecho/shared` may pull more shared code into web server routes, but this is not an engine import. If the shared schema is too broad, define a small local JSON schema in the web lib.

Validation after step:

- targeted unit tests for repository create/list/read/update/duplicate/delete
- owner isolation test
- malformed file handling test

### Step 2 - Add API Routes

Create route family under:

```text
apps/web/app/api/workbench-v2/presets
```

Key points:

- runtime `nodejs`
- owner resolution through existing auth state
- no project required
- validate request payloads before repository calls
- return consistent `{ ok: true }` / `{ ok: false, error }` payloads
- do not leak file paths

Potential issue:

- if access policy is extended, shared schema/tests may need updates. Keep changes narrow and avoid project permission regressions.

Validation after step:

- route tests for list/create/read/update/delete/duplicate
- unauthenticated configured auth returns `401`
- preview owner can use presets
- cross-owner read returns `404`

### Step 3 - Add Client Parse Helpers

Create a small helper near the workbench rebuild feature, for example:

```text
apps/web/features/workbench-rebuild/workbench-v2-presets.ts
```

Responsibilities:

- parse API summaries defensively
- parse full preset records defensively
- format count/status labels
- keep UI code from growing more parser branches inside `calculator-workbench.tsx`

Key points:

- do not duplicate project snapshot parser
- do not import engine

Validation after step:

- unit test malformed API payloads
- ensure invalid records are ignored or rejected predictably

### Step 4 - Add Preset Panel Component

Create:

```text
apps/web/features/workbench-rebuild/workbench-preset-library-panel.tsx
```

Props should be data/actions only. Keep API fetch and state in `calculator-workbench.tsx`.

Key points:

- presentational component
- controlled inputs
- clear disabled states
- rows, not nested cards
- concise labels
- accessible buttons and `aria-controls`
- stable layout on narrow widths

Validation after step:

- component test for empty/list/selected/busy states
- visual check in desktop and mobile widths

### Step 5 - Integrate Into Calculator Workbench

Add top-bar `Presets` trigger next to `Project`.

Add client functions:

- refresh presets on mount
- save current as preset
- load selected preset
- rename selected preset
- duplicate selected preset
- delete selected preset

Apply flow:

1. fetch preset
2. parse snapshot
3. confirm replacement when appropriate
4. restore workbench snapshot
5. clear selected assembly/report state
6. show success message

Key points:

- keep project selected
- do not require project
- do not mutate project saved combinations
- do not touch report editor state
- do not touch engine

Validation after step:

- no-project save/apply works
- selected-project save/apply works
- loaded project assembly can be saved as preset
- loaded preset can be saved as project combination

### Step 6 - Add End-to-End Coverage

Add focused Playwright coverage for Workbench V2 presets.

Core path:

1. open Workbench V2 with no project selected
2. create or edit a layer stack
3. create a custom material and color override
4. save as preset with name and description
5. reload workbench
6. open Presets
7. use preset
8. verify mode, layers, selected outputs, custom material, and visual override are restored
9. run calculation through existing estimate API

Secondary path:

1. select a project
2. use a preset
3. verify selected assembly/report state is cleared
4. save current draft as a project combination

Validation command should be chosen after implementation, but expected focused commands:

```bash
pnpm --filter @dynecho/web test -- workbench-v2
pnpm --filter @dynecho/web e2e -- workbench
```

Use the repo's actual test scripts discovered at implementation time.

### Step 7 - Documentation Refresh

Update this plan or the project workspace model doc after implementation with:

- final route names
- final storage file path
- final UI placement
- validation commands and results
- known follow-ups

## UI/UX Principles For Implementation

- The default workbench should still look like a calculator, not a file manager.
- Project and Presets must be separate top-bar concepts.
- Presets should be available without project selection.
- Applying a preset should be explicit and reversible only by normal undo/rebuild patterns; do not auto-apply on row click.
- The panel should be compact and scannable.
- Use existing workbench classes and button hierarchy before adding new visual language.
- Do not put UI cards inside other cards.
- Avoid long instructional copy.
- Avoid presenting internal storage terms.
- Keep text short enough for Turkish/English expansion later.
- Use icon buttons only where the icon meaning is familiar and has accessible labels.

## Architecture Rules For Implementation

- No files under `packages/engine` should change.
- No calculation route should change.
- No `@dynecho/engine` import should be added.
- Preset routes should run in Node runtime because they use filesystem storage.
- Snapshot schema reuse is required; do not invent a separate layer-only format.
- Stored preset records must not include project IDs, assembly IDs, report IDs, or assistant context.
- Applying a preset must not call estimate directly; normal workbench calculation effects can run after state changes.
- Keep the project workspace behavior unchanged except for clearing stale selected assembly/report when a preset is applied.

## Test Matrix

| Area | Scenario | Expected Result |
| --- | --- | --- |
| No-project flow | Save current draft as preset | Preset is created without project selection |
| No-project flow | Apply preset | Workbench state is restored |
| Project flow | Project selected, save preset | Preset goes to user library, not project |
| Project flow | Apply preset with project selected | Project remains selected, assembly/report selection clears |
| Project flow | Save preset-derived draft as combination | New project assembly is created |
| Materials | Preset has custom material | Custom material restored |
| Materials | Preset has visual override | Illustration color restored |
| Context | Preset has field/building context values | Context restored |
| Outputs | Preset has custom selected outputs | Output selection restored |
| Error | Invalid preset payload | Error message, current draft unchanged |
| Error | Oversized snapshot | API returns `413`, current draft unchanged |
| Error | Deleted selected preset | Selection clears after refresh |
| UI | Narrow viewport | Header buttons and panel do not overlap |
| Race | Double click save | One preset created |
| Race | Load during delete | In-flight guard prevents conflicting mutation |

## Second-Pass Fit Audit

This feature fits the current Workbench V2 architecture if it stays on the existing snapshot and project-store rails.

Findings from the wider codebase:

- `workbench-v2-project-snapshot.test.ts` already proves that custom materials and visual overrides survive build/parse.
- `material-editor-surface-parity.test.ts` proves custom materials can remain solver-active and illustration-active after being passed through the workbench layer stack.
- `server-project-storage.test.ts` provides the repository test pattern for owner isolation, payload limits, duplicate naming, and path traversal guards.
- `server-project-routes.test.ts` provides the route test pattern for importing route handlers directly and passing `params` promises.
- `project-workspace-panel.test.ts` provides the presentational component test pattern and explicitly guards that panel files do not contain `fetch` or route strings.
- `globals.css` already has compact row/control styles for project workspace. Preset UI can reuse the same visual grammar without creating a second layout language.

Conclusion:

The preset feature should be a natural extension of Workbench V2 persistence. It should not require a new calculation path, a new snapshot schema, or a new large UI surface.

## Data Ownership Invariants

The following invariants must hold after implementation:

1. A preset belongs to an owner, not to a project.
2. A preset stores a Workbench V2 input snapshot, not calculation output.
3. A preset does not store report documents or report revisions.
4. A preset does not store assistant conversation state.
5. A preset does not store `serverProjectId`, `serverProjectAssemblyId`, or `serverProjectReportId`.
6. A preset can be created while no project is selected.
7. A preset can be applied while no project is selected.
8. Applying a preset can leave the active project selected, but must clear active assembly/report child selection.
9. Applying a preset must use `parseWorkbenchV2ProjectSnapshot` before mutating the workbench.
10. A malformed preset must never partially restore the workbench.

These invariants are the main guardrail against turning presets into a second project model.

## State Transition Matrix

| Starting State | User Action | Project Selection | Assembly/Report Selection | Workbench Draft | Expected Message |
| --- | --- | --- | --- | --- | --- |
| No project, local draft | Save preset | unchanged empty | unchanged empty | unchanged | `Preset saved` |
| No project, local draft | Use preset | unchanged empty | unchanged empty | replaced by preset snapshot | `Preset loaded` |
| Project selected, no child selected | Save preset | keep selected project | unchanged empty | unchanged | `Preset saved` |
| Project selected, no child selected | Use preset | keep selected project | unchanged empty | replaced by preset snapshot | `Preset loaded` |
| Project + assembly selected | Save preset | keep selected project | keep selected child | unchanged | `Preset saved` |
| Project + assembly selected | Use preset | keep selected project | clear assembly/report | replaced by preset snapshot | `Preset loaded` |
| Project + report selected | Save preset | keep selected project | keep selected child | unchanged | `Preset saved` |
| Project + report selected | Use preset | keep selected project | clear assembly/report | replaced by preset snapshot | `Preset loaded` |
| Preset loaded draft | Save combination | selected project required | new assembly selected after save | unchanged | `Saved combination` |
| Preset loaded draft | Save preset again | unchanged | unchanged | unchanged | new independent preset |

The only potentially surprising row is "Project + assembly selected / Use preset". Clearing the selected child is required because the current workbench no longer represents that saved assembly after the preset is applied.

## API Contract Detail

Recommended create request:

```ts
type CreateWorkbenchV2PresetRequest = {
  description?: string;
  name: string;
  snapshot: JsonValue;
};
```

Recommended update request:

```ts
type UpdateWorkbenchV2PresetRequest = {
  description?: string;
  name?: string;
};
```

Recommended duplicate request:

```ts
type DuplicateWorkbenchV2PresetRequest = {
  name?: string;
};
```

Recommended list response:

```ts
type ListWorkbenchV2PresetsResponse = {
  ok: true;
  presets: WorkbenchV2UserPresetSummary[];
};
```

Recommended detail response:

```ts
type ReadWorkbenchV2PresetResponse = {
  ok: true;
  preset: WorkbenchV2UserPresetRecord;
};
```

Recommended mutation error shape:

```ts
type WorkbenchV2PresetErrorResponse = {
  code?: string;
  error: string;
  issues?: unknown[];
  ok: false;
};
```

Validation details:

- `name` is required for create.
- `name` is trimmed before write.
- `description` is optional and trimmed; empty string can be stored as `undefined`.
- `snapshot` must be JSON and below byte limit.
- The API route should parse the snapshot and derive `kind` and `layerCount` before calling the repository.
- If snapshot parse fails during create, return `400` rather than storing an unusable preset.

That last point is stricter than project assemblies. It is acceptable because presets are only Workbench V2 starter templates; storing an invalid starter has no value.

## File Boundary Plan

Expected new files:

```text
apps/web/lib/workbench-v2-preset-storage.ts
apps/web/lib/workbench-v2-preset-storage.test.ts
apps/web/lib/workbench-v2-preset-routes.test.ts
apps/web/app/api/workbench-v2/presets/route.ts
apps/web/app/api/workbench-v2/presets/[presetId]/route.ts
apps/web/app/api/workbench-v2/presets/[presetId]/duplicate/route.ts
apps/web/features/workbench-rebuild/workbench-v2-presets.ts
apps/web/features/workbench-rebuild/workbench-v2-presets.test.ts
apps/web/features/workbench-rebuild/workbench-preset-library-panel.tsx
apps/web/features/workbench-rebuild/workbench-preset-library-panel.test.ts
```

Expected existing files to touch:

```text
apps/web/features/workbench-rebuild/calculator-workbench.tsx
apps/web/app/globals.css
docs/ui/WORKBENCH_V2_USER_PRESET_LIBRARY_PLAN_2026-06-15.md
```

Avoid touching unless a compile error proves it is necessary:

```text
packages/engine/**
packages/catalogs/**
apps/web/app/api/estimate/**
apps/web/features/workbench/**
apps/web/features/workbench-rebuild/project-workspace-*.tsx
apps/web/features/workbench-rebuild/report-editor.tsx
```

`@dynecho/shared` should also be avoided if route-local schemas are enough. Extending shared access-action enums is acceptable only if the existing access policy cannot be reused cleanly without weakening authorization clarity.

## Implementation Phases With Exit Criteria

### Phase 0 - Preflight

Goal: start from a clean understanding of concurrent work.

Actions:

- run `git status --short`
- identify files already modified by other agents
- avoid editing unrelated dirty files
- re-open `calculator-workbench.tsx` around project state before touching it
- re-open latest version of this plan

Exit criteria:

- implementation file boundary is still valid
- no engine files are planned for edit
- no unrelated dirty files need to be reverted

### Phase 1 - Repository

Goal: add owner-scoped preset persistence without UI.

Actions:

- create repository module
- add schema and error class
- add owner directory path under the project-store base
- add list/read/create/update/duplicate/delete
- add atomic write
- add count/name/description/byte guards
- keep snapshot parsing outside the repository unless the parser is moved to a neutral non-UI module

Exit criteria:

- storage tests pass
- owner A cannot read owner B presets
- invalid preset ID cannot traverse paths
- oversized preset rejects before write
- duplicate name helper respects max length

### Phase 2 - Routes

Goal: expose preset persistence through narrow API endpoints.

Actions:

- add list/create route
- add detail/update/delete route
- add duplicate route
- reuse `getAuthState` and owner resolution
- keep project ID out of route params and payloads
- parse `snapshot` with `parseWorkbenchV2ProjectSnapshot` during create
- pass `kind`, `layerCount`, and raw JSON snapshot to storage after parse succeeds

Exit criteria:

- route tests pass
- no project is required
- configured auth without session returns 401
- preview owner works
- malformed create payload returns 400
- oversized snapshot returns 413

### Phase 3 - Client Helpers

Goal: keep API parsing out of the large workbench component.

Actions:

- add summary/detail parser helpers
- add date/count label helpers if needed
- add status label helper for header trigger
- test malformed payload handling

Exit criteria:

- helper tests pass
- component can consume typed summaries
- invalid list entries do not crash render

### Phase 4 - Presentational Panel

Goal: build a compact preset UI without route logic.

Actions:

- create panel component
- use controlled props only
- use existing row/control classes
- render empty, list, selected, busy, and error states
- include save/use/rename/duplicate/delete actions

Exit criteria:

- static render test passes
- presentational source has no `fetch(`
- presentational source has no `/api/workbench-v2`
- labels remain concise
- layout uses rows, not nested cards

### Phase 5 - Workbench Integration

Goal: connect preset state into Workbench V2 safely.

Actions:

- add top-bar `Presets` trigger next to `Project`
- refresh presets on mount
- save current workbench snapshot as preset
- fetch and apply selected preset through parser/restore
- clear selected assembly/report when applying
- keep selected project when applying
- guard mutations with an in-flight ref

Exit criteria:

- no project selected flow works
- project selected flow works
- selected assembly/report clears on apply
- active project remains selected on apply
- material editor custom materials and visual overrides restore
- no engine imports are added

### Phase 6 - Focused Validation

Goal: verify the feature without running a broad, expensive suite first.

Candidate commands:

```bash
pnpm --filter @dynecho/web test -- apps/web/lib/workbench-v2-preset-storage.test.ts
pnpm --filter @dynecho/web test -- apps/web/lib/workbench-v2-preset-routes.test.ts
pnpm --filter @dynecho/web test -- apps/web/features/workbench-rebuild/workbench-v2-presets.test.ts
pnpm --filter @dynecho/web test -- apps/web/features/workbench-rebuild/workbench-preset-library-panel.test.ts
pnpm --filter @dynecho/web test -- apps/web/features/workbench-rebuild/workbench-v2-project-snapshot.test.ts
pnpm --filter @dynecho/web test -- apps/web/features/workbench-rebuild/material-editor-surface-parity.test.ts
```

Add browser validation only after unit/route tests are stable.

Exit criteria:

- targeted tests pass
- `git diff --check` passes
- manual UI smoke passes desktop and narrow viewport

### Phase 7 - Final Validation

Goal: make sure the feature did not disturb project/report workflows.

Candidate commands:

```bash
pnpm --filter @dynecho/web test -- apps/web/lib/server-project-routes.test.ts
pnpm --filter @dynecho/web test -- apps/web/features/workbench-rebuild/project-workspace-panel.test.ts
pnpm --filter @dynecho/web test -- apps/web/features/workbench-rebuild/report-editor-project-context.test.ts
pnpm --filter @dynecho/web typecheck
```

Use broader `pnpm check` only if shared schemas, route auth policy, or broad app behavior changes.

Exit criteria:

- project saved combinations still work
- reports and revisions still work
- typecheck passes or any unrelated existing failure is documented

## Risk Register

| Risk | Why It Matters | Mitigation | Validation |
| --- | --- | --- | --- |
| Presets become project children | Reintroduces mandatory project workflow | Separate API/storage outside `/api/projects` | No project selected create/apply test |
| Applying preset overwrites selected assembly mentally | User may think they are still editing project assembly | Clear selected assembly/report on apply | State transition test/manual QA |
| Custom material references break | Preset layer can depend on custom material ID | Store full snapshot including custom materials | Snapshot/material parity tests |
| Visual overrides are lost | User explicitly wants illustration colors preserved | Store `materialVisualOverrides` with snapshot | UI smoke and snapshot tests |
| Invalid snapshot gets stored | Later apply fails unexpectedly | Parse snapshot on create and read | Route 400 test |
| Large preset file slows dev | Project store can grow | Count and byte limits | Storage limit tests |
| Route auth leaks presets | Owner-scoped user data | Reuse owner resolution and owner path | Cross-owner tests |
| New CSS clutters workbench | User already rejected busy project UI | Reuse compact rows and hidden panel | Screenshot/manual QA |
| Broad shared schema change causes conflicts | Other agents may touch shared policy | Prefer route-local schemas | File boundary review |
| Engine graph expands again | Recent performance issue came from broad imports | No engine imports in preset modules | `rg '@dynecho/engine'` on new files |
| Race creates duplicate records | Double click/save in-flight | Mutation ref and disabled states | Double submit test |
| Dirty worktree conflict | Other agents are active | Edit only planned files and inspect before patch | `git status --short` before each phase |

## Manual QA Script

Run these after implementation in the browser:

1. Open `/workbench-v2`.
2. Confirm calculator is usable without project.
3. Open `Presets`.
4. Save current stack as `QA wall preset` with a short description.
5. Reload the page.
6. Open `Presets` again and select `QA wall preset`.
7. Click `Use preset`.
8. Confirm layers, mode, selected outputs, and context are restored.
9. Create a custom material, set a visible illustration color, save as `QA custom material preset`.
10. Reload and apply that preset.
11. Confirm the custom material exists in the material editor and the illustration color is visible.
12. Select or create a project.
13. Apply a preset while the project remains selected.
14. Confirm selected assembly/report is cleared.
15. Save the preset-derived draft as a project combination.
16. Load that saved combination and confirm the snapshot matches.

Narrow viewport pass:

1. Set viewport to mobile width.
2. Confirm `Project`, `Presets`, badges, and panel controls wrap without overlap.
3. Confirm preset row actions remain reachable.

## Rollback Plan

If implementation creates UI or route instability:

- remove the `Presets` trigger from `calculator-workbench.tsx`
- leave repository/routes/tests in place if they are green and unused
- or remove all files listed in the new-file boundary if the storage route itself is the issue
- no engine rollback should be needed because engine files are out of scope

Stored preset files can be ignored by the app if the UI route is disabled. They should not affect projects or calculator behavior.

## Acceptance Criteria

The feature is complete only when all of these are true:

- User can save a preset without creating/selecting a project.
- User can apply a preset without creating/selecting a project.
- User can save a preset while a project is selected and it does not create a project assembly.
- Applying a preset while a project is selected keeps the project but clears selected assembly/report.
- Presets restore layers, mode, selected outputs, context, custom materials, and visual overrides.
- Presets do not store report documents or revisions.
- Preset UI is hidden until opened from the top bar.
- Preset UI is compact, scannable, and visually consistent with Workbench V2.
- No files under `packages/engine` are touched.
- No new `@dynecho/engine` import is introduced by preset code.
- Focused storage, route, helper, panel, snapshot, and material parity tests pass.
- `git diff --check` passes.

## Open Decisions Before Implementation

1. Should first implementation include an explicit "Update preset from current draft" action?

   Recommendation: no. Start with create, use, rename, duplicate, delete. Add update later with clearer dirty-state UX.

2. Should duplicate names be blocked?

   Recommendation: no. Allow duplicates for consistency, but show updated date/mode/layer count.

3. Should the preset panel include search on day one?

   Recommendation: optional. If max presets is 120, a simple text filter is useful and cheap, but it should not make the panel busy.

4. Should presets be visible to the report assistant/MCP?

   Recommendation: not in this feature. The user asked for preset creation/use in the workbench. Assistant/MCP project visibility is a separate documented concern.

## Recommended First Implementation Slice

The safest first slice is:

1. server-backed owner-scoped preset repository
2. API routes
3. preset panel with save/list/use/delete
4. rename/duplicate if the component complexity stays low
5. focused tests

Keep the first implementation centered on the main user promise:

Save this layer combination as a preset, then reuse it later without creating a project.
