# Slice Plan - Team Access Model v1

Status: CLOSED (opened and closed 2026-04-23)

## Objective

Define and test the first explicit project/team access policy model
before invitations, billing, or database-backed project storage.

This slice should make project access roles and actions executable as a
small policy layer. It should not claim real team collaboration yet; the
workbench remains local-first and server project persistence remains
explicit sync/load.

## Non-Goals

- Do not implement invitation emails, revocation UI, billing, or
  metering.
- Do not migrate project storage from filesystem JSON to a database.
- Do not add real-time shared editing.
- Do not change calculator formulas, source-gap posture, output support,
  or acoustic result values.
- Do not make role or plan tier affect acoustic calculations.

## Current Baseline

- `server_backed_project_storage_v1` is closed.
- `project_access_authorization_v1` is closed.
- `auth_session_hardening_v1` is closed.
- Project records are still owner-scoped filesystem JSON records.
- Auth is a single configured username/password plus signed session
  cookie; there is not yet a user/team membership model.
- Server project routes currently protect owner scope. They do not yet
  expose team-role semantics or reusable action policy decisions.

## Implementation Plan

1. [done] Add a narrow shared vocabulary for project access roles and actions:
   owner, editor, reviewer, viewer, and explicit actions such as create,
   list, read, import local scenarios, append proposal audit, and manage
   members.
2. [done] Add a pure access-policy helper that maps auth mode, owner scope,
   project ownership/team metadata, and optional membership role to an
   allow/deny decision with a stable denial reason.
3. [done] Add a role/action matrix test that proves:
   - owner can perform all project actions,
   - editor can mutate project scenarios but cannot manage members,
   - reviewer/viewer can read but cannot mutate,
   - preview mode stays isolated from configured/team access,
   - unauthenticated configured mode denies every project action.
4. [done] Keep route behavior owner-scoped unless the new policy can be
   integrated without pretending teams already exist.
5. [done] Update docs to state clearly that this is a policy contract, not
   invitations, billing, or shared editing.
6. [done] Run focused policy/project tests, `pnpm calculator:gate:current`, and
   broad `pnpm check` because the policy will become a shared
   authorization boundary.

## What Landed

- `packages/shared/src/domain/project.ts` now exports executable
  project access role/action vocabulary:
  `owner`, `editor`, `reviewer`, `viewer`, and the project actions
  `create_project`, `list_projects`, `read_project`,
  `import_local_scenarios`, `append_proposal_audit`, and
  `manage_members`.
- `apps/web/lib/project-access-policy.ts` now owns the first pure
  project-access decision helper. It maps authenticated owner scope,
  preview/configured auth mode, project ownership/team metadata, and an
  optional membership role to stable allow/deny decisions.
- Stable denial reasons are executable:
  `authentication_required`, `project_required`,
  `preview_team_access_denied`, `owner_scope_mismatch`,
  `team_membership_required`, and `role_not_permitted`.
- `apps/web/lib/project-access-policy.test.ts` proves the role/action
  matrix, preview isolation, project-bound action requirements, and
  denial reason contract.
- Existing project storage/routes remained owner-scoped. No route now
  claims real team access, invitations, billing, database-backed
  membership, or shared editing.
- No calculator runtime behavior changed.

## Closeout Validation

- Baseline `pnpm calculator:gate:current` passed before the slice.
- `pnpm --filter @dynecho/web exec vitest run lib/project-access-policy.test.ts lib/server-project-storage.test.ts lib/server-project-routes.test.ts --maxWorkers=1`
  passed: 3 files, 17 tests.
- `pnpm --filter @dynecho/shared typecheck` passed.
- `pnpm --filter @dynecho/web typecheck` passed.
- Final `pnpm calculator:gate:current`, `pnpm check`, and
  `git diff --check` were run after the docs and code closeout.

## Completion Criteria

- Role/action semantics are executable in tests.
- The policy helper has stable allow/deny outputs for later API routes.
- Existing project route authorization and auth-session tests remain
  green.
- No calculator runtime behavior changes.
- Docs continue to distinguish owner-scoped persistence, access policy,
  and future collaboration.

## Selected Follow-Up

`project_access_policy_route_integration_v1`

Reason: the pure access policy and role/action matrix are now
test-backed. The next risk is integrating that policy into existing
project/proposal route boundaries through the current owner-only auth
adapter while keeping behavior honest until a real membership source
exists.
