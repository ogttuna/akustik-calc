# Checkpoint - 2026-04-23 Server-Backed Project Storage Handoff

Status: productization closeout handoff

## Closed Slice

`server_backed_project_storage_v1` closed on 2026-04-23.

Slice plan:
`docs/calculator/SLICE_SERVER_BACKED_PROJECT_STORAGE_PLAN.md`

## What Closed

- Shared server project schemas landed in
  `packages/shared/src/domain/project.ts`.
- Owner-scoped filesystem project storage landed in
  `apps/web/lib/server-project-storage.ts`.
- Project routes landed:
  - `GET /api/projects`
  - `POST /api/projects`
  - `POST /api/projects/import-local`
  - `GET /api/projects/[projectId]`
- Default `/workbench` gained explicit server project sync/list/load
  controls. Workbench editing remains local-first.
- Server workbench snapshots are schema-marked before import and parsed
  before restore.
- Proposal PDF/DOCX export helpers carry `projectId` when available.
- Proposal PDF/DOCX routes append project audit events after successful
  generation when `projectId` is present.
- `.dynecho/project-store` remains local runtime storage and is
  gitignored. `DYNECHO_PROJECT_STORE_DIR` can override it.

## Selected Next Slice

`project_access_authorization_v1`

Planning surface:
`docs/calculator/SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md`

Reason: server project persistence now exists. The next product risk is
making configured-auth, preview isolation, and cross-owner denial
explicitly test-backed before invitations, billing, team roles, or
collaboration work.

## Explicit Deferrals Carried Forward

- Full team/multi-user collaboration
- Invitations and revocation
- Billing entitlements and usage metering
- Database-backed project repository
- Server-side real-time shared editing
- Any calculator/source-backed widening

## Validation

- `pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-toolbar.test.ts features/workbench/server-project-workbench-snapshot.test.ts features/workbench/simple-workbench-proposal-pdf.test.ts lib/server-project-routes.test.ts --maxWorkers=1`
  passed: 4 files, 13 tests.
- `pnpm --filter @dynecho/web typecheck` passed.
- `pnpm calculator:gate:current` passed after closeout: engine focused
  gate 67 files / 316 tests, web focused gate 29 files / 132 tests +
  18 skipped, build 5/5 tasks, whitespace guard clean. The build still
  emits the known non-fatal optional `sharp/@img` resolution warnings
  through `@turbodocx/html-to-docx`.
- `pnpm check` passed after closeout: lint, typecheck, full tests, and
  build. Full tests were engine 201 files / 1145 tests and web 140
  files / 803 tests + 18 skipped. The same known non-fatal
  `sharp/@img` build warnings remain.

## Resume Notes

- Start with `SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md`.
- Keep persistence language precise: v1 has explicit server sync/list/load,
  not full shared multi-user editing.
- Productization work must not change calculator runtime/source posture
  without a selected calculator slice.
