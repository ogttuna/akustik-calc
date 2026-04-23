# Slice Plan - Auth Session Hardening v1

Status: CLOSED (opened and closed 2026-04-23)

## Objective

Make the existing authentication session boundary executable and
supportable before adding invitations, team roles, billing, or database
project storage.

This slice should harden login/session/logout behavior without changing
calculator outputs or the owner-scoped project repository contract that
just closed in `project_access_authorization_v1`.

## Non-Goals

- Do not add team membership, invitations, revocation, or billing.
- Do not change calculator formulas, source-gap posture, output support,
  or acoustic result values.
- Do not move project storage from filesystem JSON to a database.
- Do not claim multi-user collaboration; workbench editing remains
  local-first unless a server project is explicitly synced or loaded.
- Do not add broad UI copy unless a route/page needs an actionable auth
  error state.

## Current Baseline

- `project_access_authorization_v1` is closed.
- Project/proposal routes share `project-route-auth.ts` for owner-scope
  failures and storage-error responses.
- Route tests prove configured-auth rejection, configured owner success,
  preview/configured isolation, and cross-owner proposal audit denial.
- `apps/web/lib/auth.ts`, `/api/auth/login`, `/login`, and `/logout`
  exist, but the actual signed-cookie/session behavior is not yet covered
  by focused unit/route tests.
- Project route tests currently mock the auth state to prove owner
  boundaries; they intentionally do not prove cookie signing, expiry,
  tamper rejection, or logout clearing.

## Implementation Plan

1. [done] Add focused `auth.ts` unit tests for:
   - configured vs preview-mode config detection,
   - session cookie creation and valid readback,
   - tampered signatures,
   - expired sessions,
   - wrong configured username,
   - invalid TTL fallback,
   - `normalizeNextPath` open-redirect guard.
2. [done] Add `/api/auth/login` route tests for:
   - unreadable JSON,
   - missing auth configuration,
   - invalid credentials,
   - successful login sets the signed session cookie with expected
     security attributes and safe redirect target.
3. [done] Add `/logout` route tests proving the session cookie is cleared and
   the route redirects to `/login`.
4. [done] Review whether auth response shapes need a tiny shared helper. Add it
   only if it removes real duplication from login/logout routes.
5. [done] Update docs/env notes only if the tests reveal drift or an unclear
   production setup requirement.
6. [done] Run focused auth route/unit tests, `pnpm calculator:gate:current`,
   and broad `pnpm check` because auth gates shared product routes.

## What Landed

- `apps/web/lib/auth.test.ts` now covers preview/configured auth
  detection, configured credential validation, TTL handling, signed
  session cookie readback, tampered/expired/wrong-user rejection,
  missing configured sessions, and `normalizeNextPath` open-redirect
  guards.
- `apps/web/lib/auth-routes.test.ts` now covers unreadable login JSON,
  preview-mode login pass-through without a cookie, invalid configured
  credentials, successful configured login with a signed secure session
  cookie, and logout cookie clearing.
- The existing auth implementation did not need behavior changes. The
  tests confirmed the current signed-cookie/session contract.
- No calculator runtime behavior changed.

## Closeout Validation

- `pnpm --filter @dynecho/web exec vitest run lib/auth.test.ts lib/auth-routes.test.ts lib/server-project-routes.test.ts --maxWorkers=1`
  passed: 3 files, 19 tests.
- `pnpm --filter @dynecho/web typecheck` passed.
- `pnpm calculator:gate:current` passed after the auth-session tests:
  engine focused gate 67 files / 316 tests, web focused gate 29 files /
  132 tests + 18 skipped, build 5/5 tasks, whitespace guard clean.
- `pnpm check` passed after the auth-session tests: lint, typecheck,
  full tests, and build. Full tests were engine 201 files / 1145 tests
  and web 142 files / 819 tests + 18 skipped. The build still emits the
  known non-fatal optional `sharp/@img` resolution warnings through
  `@turbodocx/html-to-docx`.

## Completion Criteria

- Signed-session behavior is covered for valid, expired, tampered, and
  wrong-user cookies.
- Login/logout routes have focused tests for success and failure paths.
- No calculator runtime behavior changes.
- The project access authorization tests from the previous slice remain
  green.
- Docs continue to state browser-local workbench editing honestly.

## Selected Follow-Up

`team_access_model_v1`

Reason: route owner isolation and signed-session behavior are now
test-backed. The next auth/multi-user risk is the explicit team/project
role model and action policy before adding invitations, billing, or a
database-backed project repository.
