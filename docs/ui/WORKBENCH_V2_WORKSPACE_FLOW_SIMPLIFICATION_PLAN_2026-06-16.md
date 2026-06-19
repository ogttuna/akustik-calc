# Workbench V2 Workspace Flow Simplification Plan - 2026-06-16

Document role: focused UX/product-flow plan for the Workbench V2 project,
saved-combination, report, template, and material workflows. This is a planning
document only. It does not select or modify calculator behavior.

## Status

Proposed after reviewing the existing project workspace model, user preset plan,
current Workbench V2 implementation, and the latest hands-on feedback from the
project/create/save/report flow.

Primary recommendation:

- keep the existing project/preset/material persistence model;
- make the active workbench persistence state visible in the header;
- move source layer-combination save decisions back into Workbench V2 before the
  user enters the report editor;
- make the project drawer an object manager, not a mixed always-visible form;
- use precise action labels instead of generic "Save to project" wording;
- keep the main report action stable as `Open report`, and only ask a source
  save/update question when the current stack is unsaved or modified.

## Sources Reviewed

- `docs/ui/PROJECT_WORKSPACE_MODEL_PLAN_2026-06-12.md`
- `docs/ui/WORKBENCH_V2_USER_PRESET_LIBRARY_PLAN_2026-06-15.md`
- `docs/ui/WORKBENCH_V2_COMMON_LAYER_PRESET_SEED_PLAN_2026-06-15.md`
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/project-workspace-panel.tsx`
- `apps/web/features/workbench-rebuild/project-workspace-identity.tsx`
- `apps/web/features/workbench-rebuild/project-workspace-combinations.tsx`
- `apps/web/features/workbench-rebuild/project-workspace-reports.tsx`
- `apps/web/features/workbench-rebuild/report-editor.tsx`
- `packages/shared/src/domain/project.ts`

## Current Implementation Facts

The data model is mostly sound:

- Projects are named workspaces.
- Saved combinations are project-scoped assembly snapshots.
- Saved reports are project-scoped documents with durable revisions.
- User templates/presets are starter snapshots, not project children.
- Materials are currently workbench/snapshot-level, with project material
  ownership planned as a later stronger model.

The report model is stronger than the layer-combination model:

- Reports have real revision history through `reports[].revisions[]`,
  `currentRevisionId`, `REV-000n`, source labels, and full stored documents.
- Saved combinations have a `version` counter, but not a browsable revision
  history. The UI should present this as "current saved version", not as report
  style history.

The main problem is not persistence capability. The problem is that the UI does
not expose the persistence state and save target clearly enough.

## User-Visible Problems

1. Project creation does not answer "what am I editing now?"

   After creating a project, the current layer stack is still a draft until it is
   saved as a named combination. The UI shows project controls and a combination
   creation area, but the active object is still ambiguous.

2. "Save" means too many things.

   Today users can see or infer these meanings:

   - save browser-local report edits;
   - save current layer stack as a new project combination;
   - update the selected combination;
   - save source stack as a template;
   - create a project report;
   - save a report revision.

   A generic "Save to project" label hides these differences.

3. The drawer mixes selection, creation, editing, and library management.

   Project list, new project form, new combination form, selected combination
   edit form, reports, templates, and materials compete for attention.

4. Report creation can create project artifacts too late in the flow.

   The current report editor can save an unlinked report draft by creating the
   source assembly first and then the report. This is technically useful, but it
   is a bad default mental model. Users should decide what happens to the source
   layer stack before leaving the workbench.

5. Report local draft persistence is not obvious.

   `Save edits` writes the browser-local report draft. It does not mean a
   project report revision unless the user explicitly saves the project report
   or revision.

## Re-Evaluation Passes

### Pass 1 - Keep the Product Model

The existing object model is the right base. Do not collapse templates into
projects, do not make every calculator session require a project, and do not
turn saved combinations into reports.

Decision: keep the current model, improve state visibility and action language.

### Pass 2 - Test Against the Confusing Scenario

Scenario:

1. User creates project `deneme2`.
2. User edits the layer stack.
3. User sees a layer-combination save area but is not sure whether clicking
   report/save will update, create, or duplicate.
4. User closes drawer and clicks a save/report action from the main screen.
5. A new project artifact appears, but the user did not understand which object
   was created.

The current implementation can handle this, but the flow does not teach it. The
fix is to make these states explicit:

- project selected, no combination selected;
- combination selected and clean;
- combination selected and modified;
- local draft with no project.

Decision: add a Workbench V2 persistence state machine and drive visible copy
from it.

### Pass 3 - Compare Alternatives

Option A: copy-only patch.

- Change button labels and helper text but keep the current drawer layout.
- Lowest risk.
- Not enough, because the form layout still implies simultaneous workflows.

Option B: state machine plus object-manager drawer.

- Derive the active persistence state.
- Show that state in the header.
- Make the drawer list-first and reveal creation/edit forms only when needed.
- Move report source save decisions to Workbench V2.
- Moderate risk, high clarity.

Option C: full project dashboard route.

- Move projects/combinations/reports to a separate dashboard.
- Too heavy for the current product. The calculator should remain the primary
  workspace.

Option D: require a project before calculation.

- Would simplify persistence.
- Bad product fit. Workbench V2 must remain usable as a fast local calculator.

Decision: Option B is the most balanced next slice.

### Pass 4 - Final Flow Check

The clearest ownership split is:

- Workbench V2 owns the current layer stack, project attachment, saved
  combination creation/update, templates, and material editing.
- Report editor owns report draft edits, saved project report creation, report
  revisions, revision history, and export.
- Report editor should not be the default place where a user discovers that the
  source layer stack must be saved as a combination.

Decision: before opening or project-saving a report, Workbench V2 should make
the source-stack target explicit.

### Pass 5 - Label And Friction Check

Two labels from the first draft are too weak:

- `Attach to project` sounds abstract. Use `Choose project` when the user only
  needs to pick a project, and `Save as new combination` when the current stack
  will actually be persisted.
- `Open temporary report` sounds unsafe. Use `Open report draft` for a local
  report that is not linked to a project.

Do not make the report button label change across every state. A stable
`Open report` action is easier to learn. If the stack is local-only, unsaved in
a selected project, or dirty against a selected combination, the click should
open a compact source decision sheet.

Decision: keep report entry simple, move complexity into a decision sheet only
when the source is ambiguous.

### Pass 6 - Visual Complexity Check

The first drawer viewport must not contain multiple empty forms. A list-first
drawer is still the right choice, but selected-row editing can also become noisy
if it expands large inputs inside every row.

Decision:

- project and combination creation forms are revealed only after explicit
  `+ New project` or `+ Save this stack as new combination`;
- selected-row metadata editing should use a compact inline editor or a small
  detail panel below the list, not a second full card nested inside the row;
- destructive and secondary actions should be icon buttons with labels/tooltips
  where the existing UI system supports them;
- long names should truncate or wrap inside the text column without resizing the
  action rail.

## Target Mental Model

### Current stack

The active layer stack on screen. It can be local-only or attached to a saved
project combination.

### Project

A named workspace that contains saved combinations and reports.

### Saved combination

A named project-scoped snapshot of the current stack. It has a current version
counter. Updating it overwrites the current snapshot and increments the version.

### Report

A generated/editable document created from a source combination or local source
stack. Project reports have real revision history.

### Template

A reusable starter snapshot. Loading it replaces the current draft and clears
selected saved combination/report state. It does not mean the user is editing
the template.

### Material

A catalog/workbench editing concern. Material editing should be accessible from
the drawer, but it should not be part of the project save decision unless a later
project material library slice is implemented.

## Persistence State Machine

Add a derived state in Workbench V2. The names below are product states, not
necessarily exported type names.

| State | Condition | Header status | Primary persistence action | Report action |
| --- | --- | --- | --- | --- |
| `localDraft` | no selected project | `Local draft` | `Choose project` | `Open report` creates a local report draft |
| `projectDraft` | project selected, no selected combination | `Project: X / Unsaved stack` | `Save as new combination` | `Open report` asks whether to save the source first |
| `combinationClean` | selected combination and current snapshot matches baseline | `Project: X / Combination: Y / Saved / vN` | `Saved` or secondary `Save as copy` | `Open report` |
| `combinationDirty` | selected combination and current snapshot differs from baseline | `Project: X / Combination: Y / Modified / vN` | `Update combination` | `Open report` asks update/copy/local-draft |
| `templateDraft` | template was loaded, no selected combination | `Template loaded / Unsaved stack` | project-dependent `Save as new combination` | same as `localDraft` or `projectDraft` |

Dirty comparison should use the same snapshot surface that saving uses:

- mode;
- layers;
- selected outputs;
- context;
- custom materials;
- material visual overrides;
- calculation summary only for saved metadata, not dirty comparison unless we
  intentionally want result changes to mark the stack dirty.

If exact deep compare is expensive, use a stable JSON signature from
`buildCurrentWorkbenchV2ServerSnapshot`.

## Workbench Header Recommendation

The header should carry the active object identity. It should not rely on drawer
state.

Recommended left header:

```text
[menu icon] Workspace
Local draft
```

or:

```text
[menu icon] Workspace
deneme2 / Wall build-up A / Modified / v3
```

Recommended compact status chips:

- `Local draft`
- `Project selected`
- `Unsaved stack`
- `Saved v3`
- `Modified`

The header should answer these questions without opening the drawer:

- Am I local-only?
- Which project is active?
- Am I editing a saved combination?
- Are my current layer changes saved?

## Main Workbench Actions

Do not show several equal-weight save actions. Use one primary action for the
current state and move less common actions behind a small secondary menu.

Recommended action labels:

- `Choose project`
- `Save as new combination`
- `Update combination`
- `Save as copy`
- `Save as template`
- `Open report`
- `Open report draft`
- `Save and open report`
- `Update combination and open report`

Avoid:

- `Save current stack` as a standalone label;
- `Save to project` in Workbench V2;
- `Save edits` when the target is browser-local only;
- `Snapshot` in user-facing copy.

## Project Drawer Recommendation

The drawer should be a workspace object manager.

### Drawer top

Tabs can remain:

- `Projects`
- `Templates`
- `Materials`

But the Projects tab should be list-first:

```text
Projects
  Local draft
  deneme2
  Hotel concept
  + New project
```

Creation should be revealed by `+ New project`, not always competing with the
selected project and combination controls.

### Active project area

After a project is selected:

```text
Active project
deneme2
2 combinations / 1 report
```

Use this as orientation only. Do not make it another large form.

### Saved combinations area

This should be the primary project child list.

Recommended row:

```text
ASM-0003  Wall build-up A
Wall / v3 / Updated 16 Jun 2026 / Rw 55 dB
[Open] [Rename] [Copy] [...]
```

Recommended list actions:

- row click selects;
- `Open` loads into the current stack;
- `Rename` opens inline metadata fields;
- `Copy` creates a new combination;
- destructive actions stay behind confirmation.

Recommended create action:

```text
+ Save this stack as new combination
```

Clicking it reveals:

- combination name;
- optional description;
- primary button `Save as new combination`.

The save-new form should not be always visible. Always-visible empty forms make
users think they are required before understanding the project list.

### Reports area

Reports should be less prominent than saved combinations in the project drawer.

Recommended first pass:

- keep reports in a collapsed `Reports` section;
- when a combination is selected, show linked reports first;
- generic project reports can stay below linked reports.

Future better pass:

- add a `Reports` tab only if the list becomes large enough.

## Report Handoff Recommendation

Report handoff should not silently decide project persistence.

### Local draft, no project

Show:

- `Open report`
- secondary `Choose project`

Local report status in report editor:

```text
Report draft
Not saved to a project
```

### Project selected, no combination

The visible report button can still read:

- `Open report`

Because the source stack is not saved yet, this opens a compact sheet in
Workbench V2:

- combination name;
- optional description;
- confirm button `Save and open report`;
- secondary `Open as local report draft`.

### Selected combination, clean

Primary:

- `Open report`

The handoff includes project id and assembly id. The report editor can create a
project report from that known source.

### Selected combination, modified

The visible report button can still read:

- `Open report`

Because the selected combination is modified, this opens a compact sheet with:

- `Update combination and open report`;
- `Save as copy and open report`;
- `Open as local report draft`;
- cancel.

This prevents the report editor from being the first place where the user learns
that the layer source is not saved.

## Report Editor Recommendation

Rename browser-local report draft actions:

- `Save edits` -> `Save local draft`
- status `Draft saved` -> `Local draft saved` when unlinked
- status `Unsaved draft` -> `Unsaved local draft` when unlinked

Project report actions:

- first persistent save from linked source: `Save project report`
- subsequent saves: `Save revision`
- revision panel: keep `Revision history`

If a report is unlinked but has a source snapshot, the existing save-target
panel can remain as a fallback, but it should be demoted and copy should be
explicit:

```text
Save report in project
This will first save the source layer stack as a new combination, then save the report.
```

Do not call this fallback `Save to project`.

## Templates Recommendation

Templates are starter snapshots. Keep them separate from project combinations.

Recommended copy:

- tab: `Templates`
- panel title: `Layer templates`
- action: `Save as template`
- apply action: `Use template`

When a template is applied:

- keep the selected project if one exists;
- clear selected combination and report;
- mark state as `templateDraft` or `projectDraft`;
- require explicit `Save as new combination` before it becomes a project child.

This matches the existing user preset plan.

## Materials Recommendation

Keep Materials in the drawer, but do not make it part of the project save flow
for this slice.

Recommended copy:

- tab: `Materials`
- subtitle: `Catalog editor`

When project material library ownership is later implemented, this tab can show:

- built-in catalog;
- project materials;
- usage by saved combinations.

Until then, the material editor should behave as current workbench state that is
included in snapshots.

## UX Stress-Test Matrix

| Scenario | Expected UI behavior | Failure to avoid |
| --- | --- | --- |
| User only wants to calculate quickly | Workbench opens as `Local draft`; project controls are available but not required. | Forcing project creation before calculation. |
| User creates a project | Header becomes `Project: X / Unsaved stack`; current stack is not silently saved. | Project creation also creating a hidden combination. |
| User wants to save the current stack | `Save as new combination` requires a name and creates one project child. | Empty always-visible forms or duplicate saves. |
| User loads a saved combination | Header shows project, combination name, saved state, and version. | Loading a combination while still implying the old draft/template is active. |
| User edits a loaded combination | Header changes to `Modified`; primary stack action becomes `Update combination`. | Letting the user believe edits are already saved. |
| User opens report from a clean combination | `Open report` goes straight to the report editor with project/assembly context. | Asking unnecessary confirmation for a clean, known source. |
| User opens report from a dirty combination | `Open report` opens source options: update, save as copy, or local report draft. | Silently overwriting the selected combination or silently creating a copy. |
| User opens report from project with unsaved stack | Source sheet asks for combination name or local report draft. | Report editor being the first place that explains source persistence. |
| User opens report from no-project local draft | Opens a local report draft and labels it as not saved to a project. | Calling it saved or hiding local-only status. |
| User edits report wording | `Save local draft` stores browser-local draft; `Save project report`/`Save revision` stores project history. | One generic save button that hides localStorage vs server persistence. |
| User applies a template while project is selected | Project remains selected, selected combination/report clears, state becomes unsaved stack. | Applying template over an existing saved combination without clearing selection. |
| User edits materials | Materials remain part of current stack/snapshot; project save flow does not add a new material decision. | Making material editing another required project-save step. |
| User is on mobile | Lists stay first, forms are revealed on demand, action rails wrap cleanly. | Drawer full of wide inputs and clipped action labels. |
| Server rejects stale update | Keep local dirty stack, explain conflict, offer reload or save as copy. | Dropping the user's current stack after a failed save. |

## Rejected UX Patterns

- A full project dashboard route as the default path. It separates persistence
  from the calculator and slows the common engineering workflow.
- Making project creation mandatory. This harms the fast calculator use case.
- Showing project, combination, report, template, and material forms at once.
  It optimizes for implementation visibility, not user comprehension.
- A single global `Save to project` button. It is too vague for a system with
  combinations, reports, revisions, templates, and local drafts.
- Silent report-source persistence. Report creation must not unexpectedly
  create or overwrite a saved combination.
- Treating layer-combination `version` as if it were report-style revision
  history. It is a current snapshot version counter until a real history model
  is planned.

## Implementation Plan

### Phase 1 - Derive Workbench Persistence State

Files likely involved:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- possibly a new helper near `workbench-v2-project-snapshot.ts`

Tasks:

- derive `localDraft`, `projectDraft`, `combinationClean`,
  `combinationDirty`, and `templateDraft`;
- store the selected combination baseline signature after load/save/update;
- compare the current snapshot signature against that baseline;
- expose a single view model for labels, status chips, primary action, and
  report handoff action.

Validation:

- unit test the state reducer/helper with no React if possible;
- Playwright smoke through local draft, project draft, clean combination, dirty
  combination.

### Phase 2 - Header And Action Rail

Files likely involved:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/app/globals.css`

Tasks:

- move the workspace trigger to the left header position if not already there;
- show project/combination/dirty state in the header;
- replace generic handoff save labels with state-specific labels;
- keep only one visually primary button in the report handoff area.

Acceptance:

- user can understand current state without opening the drawer;
- buttons do not wrap or overlap on the tested desktop/mobile widths.

### Phase 3 - Project Drawer Object Manager

Files likely involved:

- `project-workspace-panel.tsx`
- `project-workspace-identity.tsx`
- `project-workspace-combinations.tsx`
- `project-workspace-reports.tsx`
- `apps/web/app/globals.css`

Tasks:

- make project list the first visible object;
- make `+ New project` reveal the project creation form;
- make `+ Save this stack as new combination` reveal the combination save
  form;
- keep combination rows scannable and compact;
- keep report list collapsed or grouped under selected combination.

Acceptance:

- project list is immediately visible;
- no empty save form dominates the first drawer viewport;
- mobile drawer has no horizontal overflow.

### Phase 4 - Report Handoff Decision Sheet

Files likely involved:

- `calculator-workbench.tsx`
- proposal preview handoff storage/types if labels or source context need
  clearer flags.

Tasks:

- if local-only, open a local report draft explicitly;
- if project selected but no saved combination, require name or offer a local
  report draft;
- if selected combination is dirty, offer update/copy/local-draft choices before
  opening report;
- if selected combination is clean, open the report directly without a decision
  sheet;
- only send project assembly id in project context when the source combination
  is known.

Acceptance:

- report editor no longer surprises the user by creating a source combination as
  the default path;
- fallback unlinked report save remains possible but clearly labeled.

### Phase 5 - Report Editor Copy And Persistence Labels

Files likely involved:

- `apps/web/features/workbench-rebuild/report-editor.tsx`
- `apps/web/app/globals.css`

Tasks:

- rename `Save edits` to `Save local draft`;
- rename first project report save to `Save project report`;
- keep linked saved report action as `Save revision`;
- change status chips to distinguish local draft from project saved report;
- rename unlinked fallback panel from `Save to project` to `Save report in
  project`.

Acceptance:

- user can tell whether a click writes localStorage or server project storage;
- saved report revision history remains unchanged.

### Phase 6 - Tests And QA

Recommended focused tests:

- project create does not save current stack automatically;
- save as new combination requires name and creates one assembly;
- update combination increments version and does not create duplicate assembly;
- selected clean combination opens linked report;
- selected dirty combination opens save decision before report;
- local report draft remains local until explicit project save;
- report `Save local draft` survives reload through local preview storage;
- linked report `Save revision` creates a new report revision;
- template apply clears selected assembly/report but keeps selected project;
- drawer desktop and mobile screenshots have no overlapping text or horizontal
  overflow.

Recommended commands after implementation:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench-rebuild/project-workspace-panel.test.ts \
  features/workbench-rebuild/workbench-v2-project-snapshot.test.ts \
  features/workbench-rebuild/workbench-preset-library-panel.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  lib/server-project-routes.test.ts --maxWorkers=1

pnpm --dir apps/web build
git diff --check
```

Add or update Playwright coverage for the source-stack/report handoff decision
because that is the flow that caused confusion.

## Non-Goals For This Slice

- Do not change calculator formulas or engine behavior.
- Do not add browsable saved-combination revision history.
- Do not make projects mandatory for calculation.
- Do not merge templates into projects.
- Do not implement a full project dashboard route.
- Do not implement project material ownership in this pass.
- Do not change PDF/DOCX rendering unless a separate report-output task asks
  for it.

## Acceptance Criteria

The slice is successful when a user can answer these questions from the UI:

- Am I working locally or inside a project?
- Which project is active?
- Am I editing a saved combination or an unsaved stack?
- If I click the primary save button, will it create or update?
- If I open a report, is it linked to a saved combination or local-only?
- If I save in the report editor, is it local draft storage, first project
  report save, or a new report revision?

The implementation should feel boring and operational: lists, clear status,
clear verbs, and no hidden project artifact creation.
