# Slice Plan - Project Access Authorization v1

Status: CLOSED (opened and closed 2026-04-23)

## Objective

Turn the server-backed project store from preview/single-owner
persistence into an explicit authorization surface without changing
calculator outputs.

This is the first slice under the productization roadmap's
auth/multi-user track. It should make access decisions testable and
visible before adding invitations, billing, or team collaboration.

## Non-Goals

- Do not widen floor or wall calculator formulas.
- Do not reopen blocked source families.
- Do not implement full invitation, team membership, or billing flows
  in this slice.
- Do not make plan tier affect acoustic outputs.
- Do not claim shared multi-user editing; workbench editing remains
  local-first until a server project is explicitly synced or loaded.

## Current Baseline

- `server_backed_project_storage_v1` is closed.
- Project records are owner-scoped and backed by filesystem JSON.
- `/api/projects`, `/api/projects/import-local`, and
  `/api/projects/[projectId]` use `resolveProjectOwnerScope`.
- Proposal PDF/DOCX routes append audit events when `projectId` is
  present.
- Preview mode maps to an explicit preview owner when auth is not
  configured.
- Configured auth without a valid session is rejected.

## Implementation Plan

1. [done] Centralize project-route authorization helpers so project reads,
   imports, detail loads, and proposal audit appends share one error
   shape and owner-scope decision path.
2. [done] Add configured-auth route tests that prove:
   - unauthenticated configured mode rejects project list/import/detail,
   - authenticated configured mode can create/list/read its own project,
   - preview-mode projects and configured-auth projects are isolated,
   - proposal audit append cannot target a project outside the resolved
     owner scope.
3. [done] Add a visible storage/auth posture note in docs only; do not add
   user-facing explanatory copy unless the UI needs an actionable error
   state.
4. [done] Keep the current file-backed repository interface narrow enough that
   a later database-backed repository can replace it without changing
   workbench components.
5. [done] Re-run focused app/API tests, `pnpm calculator:gate:current`, and
   broad `pnpm check` because auth/project routes are shared product
   boundaries.

## What Landed

- `apps/web/lib/project-route-auth.ts` is now the shared project/proposal
  route authorization response and storage-error response boundary.
- `/api/projects`, `/api/projects/import-local`,
  `/api/projects/[projectId]`, `/api/proposal-pdf`, and
  `/api/proposal-docx` use the shared owner-scope and error-response
  helpers.
- `apps/web/lib/server-project-routes.test.ts` now covers configured-auth
  rejection, authenticated configured owner success, preview/configured
  isolation, and cross-owner proposal audit denial.
- Calculator runtime behavior did not change.

## Closeout Validation

- `pnpm --filter @dynecho/web exec vitest run lib/server-project-routes.test.ts lib/server-project-storage.test.ts --maxWorkers=1`
  passed: 2 files, 12 tests.
- `pnpm --filter @dynecho/web typecheck` passed.
- `pnpm calculator:gate:current` passed after the authorization changes:
  engine focused gate 67 files / 316 tests, web focused gate 29 files /
  132 tests + 18 skipped, build 5/5 tasks, whitespace guard clean.
- `pnpm check` passed after the authorization changes: lint, typecheck,
  full tests, and build. Full tests were engine 201 files / 1145 tests
  and web 140 files / 807 tests + 18 skipped. The build still emits the
  known non-fatal optional `sharp/@img` resolution warnings through
  `@turbodocx/html-to-docx`.

## Completion Criteria

- Project and proposal routes have a single documented authorization
  contract.
- Focused tests cover configured-auth rejection, configured-auth owner
  success, preview/configured isolation, and cross-owner audit denial.
- No calculator runtime behavior changes.
- Docs state that v1 has owner-scoped persistence, not full team
  collaboration.

## Selected Follow-Up

`auth_session_hardening_v1`

Reason: project/proposal owner isolation is now test-backed. The next
auth/multi-user risk is the underlying login/session/logout contract:
signed cookie validity, tamper/expiry handling, configured-vs-preview
login behavior, logout clearing, and route-level error shapes.
