# DynEcho UI Rebuild Phase 6 Calculator Interactions - 2026-06-05

Document role: binding interaction-hardening slice for the rebuilt calculator
workbench. This follows
`docs/ui/DYNECHO_UI_REBUILD_PHASE_5_REPORT_EDITOR_2026-06-05.md`.

## Scope

Phase 6 improves the rebuilt calculator workbench interaction model without
touching calculator behavior, backend routes, endpoint contracts, schemas, auth,
storage systems, or PDF output.

Allowed work:

- frontend-only changes in `apps/web/features/workbench-rebuild`;
- central interaction styles in `apps/web/app/globals.css`;
- documentation updates under `docs/ui`;
- browser smoke validation for the rebuilt workbench.

Blocked work:

- backend, engine, endpoint, shared-schema, auth, storage, or PDF output
  changes;
- extending the rejected old workbench visual shell;
- changing estimate request/response contracts;
- adding a broad UI library or drag package for this small slice.

## Interaction Goals

- Layer ordering must be fast for desktop users.
- Material selection must support search inside the dropdown flow.
- Popovers/dropdowns must stay above adjacent controls and not clip under
  other panels.
- Existing keyboard/button controls remain available for predictable operation.
- No additional marketing or explanatory copy is added to the calculator.

## Acceptance Checklist

- [x] Layer rows can be reordered by drag/drop.
- [x] Existing move up/down/copy/remove controls remain available.
- [x] Material selection uses a searchable popover instead of a second native
      select stacked under the search input.
- [x] Material popover has a bounded height and explicit dropdown z-index.
- [x] No backend, engine, API, schema, auth, storage, or PDF output files are
      edited.
- [x] Focused ESLint passes for the rebuilt workbench files.
- [x] Web build passes with only known optional PDF/DOCX warnings.
- [x] Browser smoke shows no horizontal overflow and no old Workbench V2
      markers.

## Implemented Files

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/app/globals.css`

## Validation Notes

- Focused ESLint passed for the rebuilt workbench route, calculator,
  protected graph/layer illustration wrappers, and report editor files.
- `pnpm --filter @dynecho/web build` passed. The only warnings were the known
  optional Sharp package resolution warnings from the protected PDF/DOCX import
  chain.
- Playwright desktop smoke on `/workbench-v2` at 1440 x 960 verified:
  searchable material selection changed the first layer to high density rock
  wool, drag/drop reordered the layer stack, dropdown z-index was `600`, there
  was no horizontal overflow, no old Workbench V2 markers were visible, and no
  browser console errors were emitted.
- Screenshot artifact:
  `output/playwright/ui-phase6/workbench-interactions-desktop-final.png`.

Protected PDF output files remained untouched. The protected graph and layer
illustration visuals are still sourced through the rebuild wrappers.
