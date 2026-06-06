# DynEcho UI Rebuild Phase 3 Visual Prototypes - 2026-06-05

Document role: implementation note for the protected graph and layer
illustration prototype gate. This follows
`docs/ui/DYNECHO_UI_REBUILD_PHASE_2_PUBLIC_INTRO_2026-06-05.md`.

## Scope

Phase 3 creates isolated frontend visual components for:

- the professional response graph;
- the professional construction layer illustration.

This phase does not rebuild the full calculator workbench, report editor, or
PDF output.

Allowed work:

- add new frontend-only prototype components;
- reuse protected graph data/model concepts;
- reuse protected layer sizing/material-cue helper logic;
- add central style classes in `apps/web/app/globals.css`;
- validate the components without changing calculator behavior.

Blocked work:

- backend, engine, endpoint, shared-schema, auth, or storage changes;
- proposal/PDF output builder or renderer changes;
- changing generated/exported PDF content;
- using the rejected current Workbench V2 UI as a style baseline;
- broad calculator-page implementation before the visual primitives are
  accepted.

## Protected Source Handling

Graph:

- Source reference:
  `apps/web/features/workbench/response-curve-figure-card.tsx`.
- Data/model reference:
  `apps/web/features/workbench/response-curve-model.ts`.
- New prototype must keep the log-spaced low/speech/high band idea, numeric
  frequency axis, curve, points, and direction rule.
- New prototype must use central classes and semantic tokens rather than the
  old card styling.

Layer illustration:

- Source reference:
  `apps/web/features/workbench/simple-workbench-layer-diagram.tsx`.
- Helper reference:
  `apps/web/features/workbench/simple-workbench-illustration.ts`.
- New prototype must keep construction-section semantics, wall/floor
  orientation, bounded thickness cues, active layer state, and a technical
  layer schedule.
- New prototype must not edit the existing proposal/PDF construction figure.

PDF:

- PDF output is explicitly out of scope.
- Do not edit proposal PDF server/builders/templates/API routes.
- If later work needs report preview handoff, package the existing snapshot;
  do not redesign the exported document.

## Visual Thesis

The graph and layer visuals should read like compact engineering software:
measured, quiet, high-contrast, and precise. They should improve scanning and
selection feedback without adding decorative panels or marketing language.

## Acceptance Checklist

- [x] New graph prototype is isolated from rejected Workbench V2 UI styling.
- [x] New layer illustration prototype is isolated from rejected Workbench V2
      UI styling.
- [x] Both prototypes use central style tokens/classes from
      `apps/web/app/globals.css`.
- [x] Wall and floor layer orientations remain visually distinct.
- [x] Active/selected layer state is clear.
- [x] Graph still shows low/speech/high bands, axes, curve, points, and
      direction rule.
- [x] No backend, engine, API, schema, auth, storage, or PDF-output files are
      edited.

## Implemented Files

- `apps/web/features/workbench-rebuild/professional-response-curve.tsx`
- `apps/web/features/workbench-rebuild/professional-layer-illustration.tsx`
- `apps/web/app/globals.css`

Validation:

- Focused ESLint passed for the new TypeScript components.
- `git diff --check` passed for the Phase 3 touched files.
- Protected proposal/PDF output, graph source, and existing layer source files
  show no diff in this phase.
- Full web typecheck currently fails in unrelated pre-existing workbench test
  files; the failure list does not include the new `workbench-rebuild`
  components.

## Next Gate

After these prototypes are accepted, the next gate is calculator information
architecture and then the real authenticated workbench rebuild. The old
Workbench V2 shell should not be polished incrementally.
