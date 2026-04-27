# Checkpoint - Project Access Policy Route Integration

Date: 2026-04-27

Slice: `project_access_policy_route_integration_v1`

Status: closed. Existing project/proposal routes now flow through the
pure project-access policy by way of an owner-only route adapter.

## What Changed

- `apps/web/lib/project-route-auth.ts` now adapts the resolved
  `ProjectOwnerScope` into a `ProjectAccessSubject`.
- The adapter calls `resolveProjectAccessDecision(...)` for:
  - `list_projects`;
  - `create_project`;
  - `import_local_scenarios`;
  - `read_project`;
  - `append_proposal_audit`.
- Project list/create/import/detail routes use the adapter while keeping
  the same owner-scoped storage model.
- Proposal PDF/DOCX audit appends read the owner-scoped project, then
  authorize the append through the policy adapter before writing the
  audit event.
- Route tests now document that team-role route hints are ignored until
  a real membership source exists.

No calculator formula, runtime value, source posture, output support,
confidence score, or result rounding changed.

## Behavior Boundary

This slice does not enable team collaboration. The pure policy still
knows about owner/editor/reviewer/viewer roles, but routes only construct
owner subjects from the authenticated owner scope. There is no
membership lookup yet, so cross-owner/team access stays denied by the
existing owner-scoped storage boundary and by the owner-only adapter
contract.

HTTP behavior intentionally remains stable:

- configured auth without a session still returns `401`;
- configured owners can create, list, read, import, and append proposal
  audit events for their own projects;
- preview and configured projects remain isolated;
- cross-owner proposal audit attempts still return the existing
  not-found storage shape.

## Executable Evidence

New / updated route-policy evidence:

- `apps/web/lib/project-route-auth.test.ts`
- `apps/web/lib/project-access-policy.test.ts`
- `apps/web/lib/server-project-routes.test.ts`
- `apps/web/lib/post-project-access-policy-route-integration-next-slice-selection-contract.test.ts`

Latest validation for this closeout:

- targeted route/policy set: web 4 files / 23 tests;
- `pnpm calculator:gate:current`: engine 98 files / 445 tests, web
  43 files / 211 passed + 18 skipped, build 5/5;
- `pnpm check`: lint green, typecheck green, engine 231 files /
  1265 tests, web 154 files / 882 passed + 18 skipped, build 5/5;
- build warnings are only the known non-fatal `sharp/@img`
  optional-package warnings through `@turbodocx/html-to-docx`.

## Next Selected Slice

The next selected implementation slice is `proposal_report_polish_v1`.

Why:

- calculator private/internal-use readiness is already closed with
  evidence-tier caveats;
- route authorization is now policy-backed while staying owner-only;
- the next highest-value internal-use gap is making PDF/DOCX/workbench
  report outputs consistently expose provenance, caveats, and
  unsupported states without changing acoustic calculations.

Boundaries:

- do not change calculator values or confidence;
- do not make plan/role tier affect acoustic results;
- do not start billing, deployment, invitations, or database migration;
- keep report polish tied to tested scenarios and output honesty.
