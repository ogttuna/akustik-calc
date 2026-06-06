# DynEcho UI Rebuild Phase 2 Public Intro - 2026-06-05

Document role: Phase 2 implementation note for the public intro route.
This follows
`docs/ui/DYNECHO_UI_REBUILD_PHASE_1_STYLE_FOUNDATION_2026-06-05.md`.

## Scope

Phase 2 rebuilds only the public intro page.

- Edited: `apps/web/app/page.tsx`.
- Edited: `apps/web/app/globals.css` for new central intro classes.
- No backend, engine, endpoint contract, shared schema, auth, storage, or
  calculator behavior changes.
- No PDF output builders, renderers, document templates, or export routes.
- No calculator workbench, graph prototype, layer illustration prototype, or
  report editor implementation.

## Explicit Rebuild Rule

The previous/current public UI was not reused as a component or style
baseline.

Removed from the public intro implementation:

- old route-list landing structure;
- old preview-state block;
- old dashboard-like preview composition;
- existing theme-toggle component import;
- old explanatory route copy.

Kept only route destinations needed for navigation:

- `/login`;
- `/workbench-v2`.

## Public Intro Direction

The public intro is the only presentation-oriented surface.

The new page uses:

- product name as the first-viewport signal;
- concise one-sentence product description;
- direct sign-in/calculator actions;
- a new inline engineering visual for layer stack, response curve, and
  supported output families;
- three short workflow steps.

The page avoids:

- long marketing copy;
- fake operational dashboards;
- stale screenshots;
- old UI component reuse;
- claims that a visible sample value is a guaranteed calculator output;
- report/PDF output changes.

## PDF, Graph, And Layer Boundaries

This phase does not touch the protected PDF output path.

This phase does not edit the protected graph source or protected layer
illustration source. Those remain future Phase 3 prototype work:

- `apps/web/features/workbench/response-curve-figure-card.tsx`;
- `apps/web/features/workbench/response-curve-model.ts`;
- `apps/web/features/workbench/simple-workbench-layer-diagram.tsx`;
- `apps/web/features/workbench/simple-workbench-illustration.ts`;
- `apps/web/features/workbench/simple-workbench-proposal-construction-figure.tsx`.

The public intro visual is a new explanatory visual, not the accepted
calculator graph/layer illustration implementation.

## Phase 2 Acceptance Checklist

- [x] `/` clearly says what DynEcho is.
- [x] `/` links to login and the staged calculator route.
- [x] The page uses central styles from `apps/web/app/globals.css`.
- [x] Existing UI components were not reused.
- [x] PDF output, graph source, layer illustration source, backend, engine,
      endpoint, schema, auth, storage, and calculator behavior were not
      edited.

## Next Gate

Do not start full calculator implementation next.

Next planned gate:

1. Phase 3 protected graph prototype.
2. Phase 3 protected layer illustration prototype.
3. Only after acceptance, calculator IA and implementation.
