# DynEcho UI Rebuild Phase 5 Report Editor - 2026-06-05

Document role: binding information architecture for the rebuilt report editor
surface. This follows
`docs/ui/DYNECHO_UI_REBUILD_PHASE_4_CALCULATOR_IA_2026-06-05.md`.

## Scope

Phase 5 replaces the rejected web proposal page shell with a clean report
editing surface. It preserves the existing proposal snapshot, existing preview
HTML builder, and existing PDF/DOCX export functions.

Allowed work:

- new frontend-only report editor under `apps/web/features/workbench-rebuild`;
- route wiring for `/workbench/proposal` to use the new report editor shell;
- central report editor classes in `apps/web/app/globals.css`;
- existing local proposal-preview storage contract;
- existing report assistant patch endpoint usage;
- existing PDF/DOCX export client functions.

Blocked work:

- backend, engine, endpoint, shared-schema, auth, or storage changes;
- proposal/PDF output builder, template, API, or renderer changes;
- generated PDF content redesign;
- extending the rejected dense proposal preview page UI;
- independent scrolling columns that make the page feel like stacked tools.

## IA Thesis

The report editor is a desktop-first engineering document workspace. The user
must see the current report preview, make explicit local edits, ask the
assistant for proposed changes, review those proposals, and export the existing
PDF output.

Primary path:

1. Load packaged proposal snapshot.
2. Review preview and issue status.
3. Edit report fields in collapsed groups.
4. Ask assistant for a proposed patch.
5. Apply proposal to the draft only after review.
6. Save local report edits or export the existing PDF/DOCX output.

## Layout Rules

- One page-level scroll.
- Preview is the main visual object.
- Editor/assistant lane is compact and sticky on desktop.
- Manual fields are grouped in collapsible sections.
- Assistant output must be proposed/reviewed before it mutates the draft.
- Export controls must be direct and visible.
- No marketing copy, banners, or explanatory text walls.

## Screen Regions

Preview lane:

- snapshot status strip;
- existing proposal preview iframe;
- print readiness state.

Editor lane:

- style switch: branded/simple;
- save, reload, reset, print, PDF/DOCX actions;
- collapsible header/results/sender/notes fields;
- assistant instruction input;
- assistant proposed-operation review;
- apply-to-draft action.

## Copy Rules

- Use utility labels only.
- Show concise state text: saved, unsaved, blocked, ready.
- Assistant copy explains only request state and proposed changes.
- Remove any text that does not help editing, reviewing, or exporting.

## Acceptance Checklist

- [x] `/workbench/proposal` renders the new report editor shell.
- [x] The old proposal page component is not used by the route.
- [x] The old configure editor route redirects into the new report editor.
- [x] The page keeps the existing proposal preview HTML and export functions.
- [x] Manual report fields are grouped inside collapsible sections.
- [x] Assistant patches require explicit review/apply before draft mutation.
- [x] Backend, engine, API, schema, auth, storage contract, and PDF output
      remain untouched.
- [x] Focused ESLint passes for the new report editor files.
- [x] Web build passes with only known optional PDF/DOCX warnings.

## Implemented Files

- `apps/web/app/workbench/proposal/page.tsx`
- `apps/web/app/workbench/proposal/configure/page.tsx`
- `apps/web/features/workbench-rebuild/report-editor.tsx`
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/app/globals.css`

Validation:

- Focused ESLint passed for the new report route, calculator handoff, report
  editor, graph, and layer illustration components.
- `pnpm --filter @dynecho/web build` passed after this slice. Known optional
  `sharp/@img` warnings remain from the protected proposal DOCX route.
- `/workbench-v2` now packages a valid local proposal snapshot before opening
  `/workbench/proposal`.
