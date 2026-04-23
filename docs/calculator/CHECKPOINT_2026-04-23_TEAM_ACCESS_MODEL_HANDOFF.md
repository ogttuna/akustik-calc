# Checkpoint - 2026-04-23 Team Access Model Handoff

Status: productization closeout handoff

## Closed Slice

`team_access_model_v1` closed on 2026-04-23.

Slice plan:
`docs/calculator/SLICE_TEAM_ACCESS_MODEL_PLAN.md`

## What Closed

- Shared project access roles/actions landed in
  `packages/shared/src/domain/project.ts`.
- The pure project-access policy helper landed in
  `apps/web/lib/project-access-policy.ts`.
- Role/action boundaries are now executable:
  owner can perform all project actions, editor can read/list/import
  scenarios/append proposal audit, reviewer/viewer can read/list only.
- Stable denial reasons are test-backed for missing authentication,
  project-bound actions without a project, preview/team isolation,
  owner mismatch, missing team membership, and role/action mismatch.
- Existing project route and storage behavior stayed owner-scoped.
- No calculator runtime behavior changed.

## Selected Next Slice

`project_access_policy_route_integration_v1`

Planning surface:
`docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md`

Reason: the policy contract exists and is tested, but routes still use
only owner-scope helpers. The next step is to route project/proposal
authorization through the policy via an owner-only adapter, without
pretending invitations, database membership, billing, or shared editing
exist.

## Explicit Deferrals Carried Forward

- Invitation emails and revocation flow
- Database-backed team membership
- Billing entitlements and usage metering
- Server-side real-time shared editing
- Any calculator/source-backed widening

## Validation

- Baseline `pnpm calculator:gate:current` passed before touching the
  slice.
- `pnpm --filter @dynecho/web exec vitest run lib/project-access-policy.test.ts lib/server-project-storage.test.ts lib/server-project-routes.test.ts --maxWorkers=1`
  passed: 3 files, 17 tests.
- `pnpm --filter @dynecho/shared typecheck` passed.
- `pnpm --filter @dynecho/web typecheck` passed.
- Final `pnpm calculator:gate:current`, `pnpm check`, and
  `git diff --check` passed after closeout. The build still emits the
  known non-fatal optional `sharp/@img` warnings through
  `@turbodocx/html-to-docx`.

## Resume Notes

- Start with
  `SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md`.
- Keep language precise: policy exists, but route access is still
  owner-only until a real membership source lands.
- Productization work must not change calculator runtime/source posture
  without a selected calculator slice.
