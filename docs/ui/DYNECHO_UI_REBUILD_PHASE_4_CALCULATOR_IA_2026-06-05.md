# DynEcho UI Rebuild Phase 4 Calculator IA - 2026-06-05

Document role: binding information architecture for the first real calculator
workbench rebuild slice. This follows
`docs/ui/DYNECHO_UI_REBUILD_PHASE_3_VISUAL_PROTOTYPES_2026-06-05.md`.

## Scope

Phase 4 replaces the rejected staged calculator surface with a new
engineering-tool layout. It must not use the old Workbench V2 shell as a
visual or component baseline.

Allowed work:

- new frontend-only workbench shell under `apps/web/features/workbench-rebuild`;
- route wiring for `/workbench-v2` to use the new shell;
- central workbench classes in `apps/web/app/globals.css`;
- existing `/api/estimate` request/response contract usage;
- existing auth page guard and session bar behavior.

Blocked work:

- backend, engine, endpoint, shared-schema, auth, or storage changes;
- proposal/PDF output builder, template, API, or renderer changes;
- generated PDF content changes;
- polishing or extending the rejected `features/workbench-v2` visual shell;
- old dense multi-scroll UI patterns.

## IA Thesis

The calculator is a desktop-first engineering workbench. The main screen must
support repeated calculation work with short labels, clear hierarchy, and
one primary operating path:

1. Setup: wall/floor context and requested outputs.
2. Stack: layer order, material, role, thickness, copy/move/remove.
3. Route inputs: only context fields relevant to selected outputs.
4. Result: live values, stopped outputs, blockers, graph, and layer
   illustration.
5. Report handoff: open report flow only after at least one live result.

## Layout Rules

- One page-level scroll only.
- No independent column scrollbars.
- Left side is the primary editing lane.
- Right side is a sticky review lane on desktop.
- Do not show long diagnostic paragraphs in the main flow.
- Missing input rows must be actionable and focus the relevant field.
- Dropdowns/selects must not render under other components.
- Controls must stay compact but readable.

## Screen Regions

Primary lane:

- mode segmented control;
- requested output checkboxes;
- route/context input fields;
- layer stack editor;
- professional layer illustration.

Review lane:

- current result summary;
- missing-input/blocker list;
- requested output rows;
- professional response graph when curve data exists;
- report handoff action.

## Copy Rules

- Use utility copy only.
- Headings identify the work area, not marketing claims.
- Supporting text is allowed only when it explains scope or required action.
- Remove any element that does not improve operation, status reading, or
  task completion.

## Implementation Notes

- New shell file:
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.
- Route file:
  `apps/web/app/workbench-v2/page.tsx`.
- Existing `apps/web/features/workbench-v2/workbench-v2-shell.tsx` is not
  edited or reused.
- Phase 3 graph/layer prototypes are the only visual primitives carried into
  this workbench slice.

## Acceptance Checklist

- [x] `/workbench-v2` renders the new workbench shell.
- [x] The rejected Workbench V2 shell is not imported by the route.
- [x] Workbench uses central classes from `globals.css`.
- [x] Existing `/api/estimate` is used without contract changes.
- [x] Layer editor supports add, duplicate, move up/down, remove, material,
      role, and thickness.
- [x] Missing local inputs focus the relevant field.
- [x] Results show live/stopped rows without text walls.
- [x] Graph and layer illustration use Phase 3 components.
- [x] Backend, engine, API, schema, auth, storage, and PDF output remain
      untouched.

## Implemented Files

- `apps/web/app/workbench-v2/page.tsx`
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/professional-response-curve.tsx`
- `apps/web/features/workbench-rebuild/professional-layer-illustration.tsx`
- `apps/web/app/globals.css`

Validation:

- Focused ESLint passed for the new route and workbench-rebuild components.
- `pnpm --filter @dynecho/web build` passed after this slice. Known optional
  `sharp/@img` warnings remain from the protected proposal DOCX route.
- Playwright smoke logged in with local dev credentials and opened
  `/workbench-v2`.
- Desktop and mobile screenshots were written under
  `output/playwright/ui-phase4/`.
- Playwright audit found no console warnings/errors, no horizontal overflow,
  and no old Workbench V2 shell markers.
- The protected proposal/PDF output files were not edited.
