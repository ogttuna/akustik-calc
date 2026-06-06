# DynEcho UI Rebuild Phase 1 Style Foundation - 2026-06-05

Document role: Phase 1 implementation note for the central UI style system.
This follows
`docs/ui/DYNECHO_UI_REBUILD_PHASE_0_BASELINE_2026-06-05.md`.

## Scope

Phase 1 establishes central styles only.

- Edited: `apps/web/app/globals.css`.
- No backend, engine, endpoint contract, shared schema, auth, storage, or
  calculator behavior changes.
- No PDF output builders, renderers, document templates, or export routes.
- No public intro, calculator workbench, graph prototype, layer illustration
  prototype, or report editor page implementation in this phase.

## Style Direction

The style foundation is for a desktop-first engineering tool:

- calm neutral surfaces;
- restrained blue accent;
- separate success, warning, and danger states;
- short utility labels;
- compact controls;
- visible focus states;
- clear popover/dropdown z-index boundaries;
- no decorative gradients, slogan styling, or old cluttered panel language.

The public intro may later use stronger presentation, but tool pages must use
this restrained operational system.

## Central Token Groups

Primary token source:

- `apps/web/app/globals.css`

Token groups now defined centrally:

- raw light/dark palette: `--paper`, `--panel`, `--line`, `--ink`,
  `--accent`, `--success`, `--warning`, `--danger`, `--focus`;
- semantic surfaces: `--surface-app`, `--surface-page`,
  `--surface-control`, `--surface-inset`;
- semantic text and borders: `--text-primary`, `--text-secondary`,
  `--text-muted`, `--border-default`, `--border-strong`;
- semantic state tokens: accent, success, warning, danger;
- geometry: control heights, page gutter, workspace max width, radii;
- layering: dropdown, popover, modal, and toast z-index tokens;
- shadows: small restrained shadows only.

Palette changes should happen through these tokens, not page or component
color edits.

## Central Class Groups

The foundation now covers:

- app/page shell: `.ui-app-surface`, `.ui-page`, `.ui-shell`,
  `.ui-tool-shell`;
- navigation: `.ui-topbar`, `.ui-nav`;
- workspace layout: `.ui-tool-grid`, `.ui-workbench-grid`,
  `.ui-report-grid`;
- panels/sections: `.ui-panel`, `.ui-panel-muted`, `.ui-panel-strong`,
  `.ui-section`, `.ui-section-header`;
- buttons: `.ui-button`, `.ui-button-primary`, `.ui-button-warning`,
  `.ui-button-danger`, `.ui-icon-button`;
- fields and choices: `.ui-field`, `.ui-choice-row`, `.ui-toggle`,
  `.ui-checkbox-row`;
- chips/badges: `.ui-chip`, `.ui-badge` and state variants;
- blocker/status rows: `.ui-warning-panel`, `.ui-danger-panel`,
  `.ui-info-panel`, `.ui-required-row`;
- calculator workbench frames: layer rows, output rows, result summary;
- protected visual frames: `.ui-graph-frame`,
  `.ui-layer-illustration-frame`;
- report editor frames: `.ui-report-preview`, `.ui-report-editor`,
  `.ui-report-field-group`, `.ui-collapsible`;
- assistant panel: `.ui-assistant-panel`, `.ui-assistant-thread`,
  `.ui-assistant-message`;
- dropdown/popover/modal boundaries: `.ui-popover`, `.ui-dropdown`,
  `.ui-menu`, `.ui-modal-backdrop`, `.ui-modal`.

Compatibility aliases remain for existing temporary pages and legacy workbench
surfaces so the app is not broken while the new UI is rebuilt.

## Design Rules Captured In CSS

- Control and panel radii stay at 8 px or lower.
- CSS-defined letter spacing is zero.
- CSS-defined font sizes do not use viewport scaling.
- Popovers, command dialogs, modals, and toasts have explicit z-index tokens.
- Touch targets keep minimum 44 px, 48 px on coarse pointers.
- Reduced-motion mode disables animations and transitions.
- Page-level horizontal overflow is clipped defensively.

## Next Gate

The next phase should not implement the full calculator yet.

Recommended next action:

1. Build or stage the public intro direction from the central style system,
   or explicitly defer it.
2. Then isolate the protected graph and layer illustration prototypes before
   integrating them into the calculator.

Do not change PDF output code in either path.

## Phase 1 Acceptance Checklist

- [x] Light mode tokens exist.
- [x] Dark mode tokens exist.
- [x] Semantic surface/text/border/state tokens exist.
- [x] Button, field, chip, dropdown, modal, workbench, report, assistant,
      graph, and layer illustration class groups exist.
- [x] Palette and state styling can be changed centrally.
- [x] PDF output, backend, engine, endpoint, schema, auth, storage, and
      calculator behavior were not edited.
