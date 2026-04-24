# Slice Plan - Project Access Policy Route Integration v1

Status: DEFERRED (opened 2026-04-23; deferred 2026-04-23 after broad calculator refocus)

## Objective

Wire the pure project-access policy from `team_access_model_v1` into
the existing project/proposal route authorization boundary without
claiming team collaboration that does not exist yet.

This slice should keep current owner-scoped route behavior stable while
making route decisions flow through the reusable policy contract. Team
membership remains a future data source; this slice provides the route
adapter and regression tests.

## Deferral Note

The pure access policy remains valid, but this route-integration slice is
no longer the current selected work. After broad revalidation the project
priority was reasserted as calculation accuracy and coverage first, so
the active calculator work has moved through wall formula-family,
timber source-corpus, resilient side-count, and floor continuation
closeouts, then floor many-layer closeout, to
floor layer-order closeout and all-caller invalid-thickness closeout.
The current selected calculator slice is
`dynamic_airborne_split_refactor_v2`. Resume this productization
slice after the selected calculator slice closes or if deployment/access
risk becomes the chosen priority again.

## Non-Goals

- Do not implement invitation emails, member management UI, revocation,
  billing, metering, or plan tiers.
- Do not migrate filesystem JSON project storage to a database.
- Do not add real-time shared editing.
- Do not make role or plan tier affect acoustic calculations.
- Do not change calculator formulas, source-gap posture, output support,
  or acoustic result values.
- Do not expose team access in routes until there is a real membership
  source to verify it.

## Current Baseline

- `team_access_model_v1` is closed.
- Shared role/action vocabulary lives in
  `packages/shared/src/domain/project.ts`.
- The pure policy helper lives in
  `apps/web/lib/project-access-policy.ts`.
- Policy tests prove owner/editor/reviewer/viewer action boundaries,
  preview isolation, project-bound action requirements, and stable
  denial reasons.
- Project routes and proposal audit appends are still owner-scoped via
  `resolveProjectOwnerScope` and `project-route-auth.ts`.

## Implementation Plan

1. Add a small route-policy adapter that converts the current resolved
   `ProjectOwnerScope` into a `ProjectAccessSubject` with no membership
   role.
2. Route project list/create/import/detail and proposal audit appends
   through `resolveProjectAccessDecision(...)` using the correct action
   ids:
   - `list_projects`
   - `create_project`
   - `import_local_scenarios`
   - `read_project`
   - `append_proposal_audit`
3. Preserve existing owner-scoped route behavior and HTTP status/error
   shapes unless a test proves a narrower policy-specific error is
   needed.
4. Extend route tests so configured owner success, configured unauth
   rejection, preview/configured isolation, and cross-owner audit denial
   prove the policy adapter path, not only repository owner filtering.
5. Add a negative test documenting that team roles are not accepted by
   routes yet because no membership source exists.
6. Update docs to distinguish:
   - pure policy contract,
   - owner-only route adapter,
   - future membership/invitation/database work.
7. Run focused route/policy tests, `pnpm calculator:gate:current`, and
   broad `pnpm check`.

## Completion Criteria

- Existing project/proposal route behavior remains green and
  owner-scoped.
- Route decisions use the policy helper or a thin adapter around it.
- Tests prove the adapter does not accidentally enable team access.
- Docs clearly state that team policy exists but route access is still
  owner-only until membership storage lands.
- No calculator runtime behavior changes.
