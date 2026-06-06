# DynEcho UI Rebuild Phase 7 Calculator Desktop Polish - 2026-06-05

Document role: calculator workbench visual polish slice after Phase 6
interaction hardening.

## Scope

Phase 7 improves the rebuilt `/workbench-v2` desktop calculator surface without
changing calculator behavior, request/response contracts, backend routes,
auth/storage, schemas, or PDF output.

Allowed work:

- frontend-only edits in `apps/web/features/workbench-rebuild`;
- central style edits in `apps/web/app/globals.css`;
- documentation under `docs/ui`;
- browser smoke validation on `/workbench-v2`.

Blocked work:

- backend, engine, API, schema, auth, storage, or PDF output changes;
- using rejected old UI shells or old workbench visual components;
- adding marketing copy to calculator/report tool surfaces;
- adding decorative UI that does not improve operation.

## Polish Goals

- Make the calculator read as a professional engineering tool on desktop.
- Reduce repeated labels and form clutter in the layer editor.
- Keep material search inside the dropdown flow, not permanently visible in
  every row.
- Make the right column feel like an inspector, not a dashboard card stack.
- Preserve the protected response graph and layer illustration wrappers.

## Acceptance Checklist

- [x] Layer rows remain reorderable with drag/drop and icon buttons.
- [x] Material search is inside the material popover and still selectable.
- [x] Desktop layer rows use one compact header row instead of repeated visible
      labels per row.
- [x] No backend, engine, API, schema, auth, storage, or PDF output files are
      edited.
- [x] Focused ESLint passes for rebuilt workbench files.
- [x] Browser smoke shows no horizontal overflow, no old Workbench V2 markers,
      working material search, and working drag/drop reorder.
- [x] Web build passes with only known optional PDF/DOCX warnings.

## Validation Notes

- Focused ESLint passed for `/workbench-v2` and rebuilt calculator visual
  components.
- Playwright desktop smoke on `/workbench-v2` at 1440 x 960 verified material
  search inside the popover, material selection, drag/drop reorder, no permanent
  per-row search inputs, visible desktop layer header, no horizontal overflow,
  no old Workbench V2 markers, and no browser console errors.
- `pnpm --filter @dynecho/web build` passed. The only warnings were the known
  optional Sharp package resolution warnings from the protected PDF/DOCX import
  chain.
- Screenshot artifact:
  `output/playwright/ui-phase7/workbench-desktop-polish.png`.
