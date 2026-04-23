# Checkpoint - 2026-04-23 Project Access Authorization Handoff

Status: productization closeout handoff

## Closed Slice

`project_access_authorization_v1` closed on 2026-04-23.

Slice plan:
`docs/calculator/SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md`

## What Closed

- Project and proposal route authorization helpers were centralized in
  `apps/web/lib/project-route-auth.ts`.
- `/api/projects`, `/api/projects/import-local`, and
  `/api/projects/[projectId]` now share the same owner-scope failure
  response and storage-error response helper.
- `/api/proposal-pdf` and `/api/proposal-docx` now use the same auth
  owner-scope failure and proposal-audit storage-error response path.
- Proposal audit appends resolve owner scope through the shared project
  route auth helper before writing audit events.
- Route tests now cover configured-auth rejection, authenticated
  configured owner create/list/read success, preview/configured project
  isolation, and cross-owner proposal audit denial.

## Selected Next Slice

`auth_session_hardening_v1`

Planning surface:
`docs/calculator/SLICE_AUTH_SESSION_HARDENING_PLAN.md`

Reason: route-level project owner isolation is now test-backed. The next
auth/multi-user risk is the underlying login/session/logout contract:
signed-cookie validity, tamper/expiry rejection, safe redirect handling,
and logout clearing.

## Explicit Deferrals Carried Forward

- Full team/multi-user collaboration
- Invitations and revocation
- Billing entitlements and usage metering
- Database-backed project repository
- Server-side real-time shared editing
- Any calculator/source-backed widening

## Validation

- `pnpm --filter @dynecho/web exec vitest run lib/server-project-routes.test.ts lib/server-project-storage.test.ts --maxWorkers=1`
  passed: 2 files, 12 tests.
- `pnpm --filter @dynecho/web typecheck` passed.
- `pnpm calculator:gate:current` passed after closeout: engine focused
  gate 67 files / 316 tests, web focused gate 29 files / 132 tests +
  18 skipped, build 5/5 tasks, whitespace guard clean. The build still
  emits the known non-fatal optional `sharp/@img` resolution warnings
  through `@turbodocx/html-to-docx`.
- `pnpm check` passed after closeout: lint, typecheck, full tests, and
  build. Full tests were engine 201 files / 1145 tests and web 140
  files / 807 tests + 18 skipped. The same known non-fatal
  `sharp/@img` build warnings remain.

## Resume Notes

- Start with `SLICE_AUTH_SESSION_HARDENING_PLAN.md`.
- Keep auth language precise: this is signed-session hardening, not team
  access, invitations, or billing.
- Productization work must not change calculator runtime/source posture
  without a selected calculator slice.
