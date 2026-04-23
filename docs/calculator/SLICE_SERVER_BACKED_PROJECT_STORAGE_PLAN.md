# Slice Plan - Server-Backed Project Storage v1

Status: CLOSED (opened and closed 2026-04-23)

## Objective

Create the first durable project-storage boundary without changing
calculator runtime behavior.

The slice exists to move saved scenario snapshots from browser-only
storage toward server-backed project records while keeping the current
truth visible: the workbench still edits and restores from local Zustand
state until a server project is explicitly synced or loaded.

## Non-Goals

- Do not widen floor or wall calculator formulas.
- Do not reopen blocked source families.
- Do not claim full multi-user/team collaboration before roles and
  invitations exist.
- Do not make plan tier affect acoustic outputs.

## Landed Scope

- Shared project schema:
  `packages/shared/src/domain/project.ts`
  - project records with owner scope,
  - versioned calculator input/output snapshots,
  - proposal audit event schema,
  - local-scenario import request schema.
- Server repository:
  `apps/web/lib/server-project-storage.ts`
  - owner-scoped filesystem-backed JSON records,
  - atomic writes,
  - payload size and import-count guards,
  - project summaries and detail reads,
  - proposal audit append primitive.
- Auth boundary:
  `apps/web/lib/project-storage-auth.ts`
  - configured sessions map to configured owner ids,
  - auth-disabled preview mode maps to an explicit preview owner,
  - configured auth without a session is rejected.
- API surface:
  - `GET /api/projects`
  - `POST /api/projects`
  - `POST /api/projects/import-local`
  - `GET /api/projects/[projectId]`
- Workbench sync surface:
  `Scenario compare` now labels local saves as `Browser-local` until
  they are copied to a server project through `Sync to server`.
- Default workbench project recovery:
  `/workbench` now has a `Server Project` selector with refresh,
  load, and sync actions. Synced simple-workbench snapshots are
  schema-marked before import and parsed before restore.
- Proposal audit append:
  `POST /api/proposal-pdf` and `POST /api/proposal-docx` append a
  project-scoped proposal audit event when `projectId` is present
  in the route or proposal snapshot.
- Storage configuration:
  `DYNECHO_PROJECT_STORE_DIR` controls the store directory; default
  local runtime writes stay under `.dynecho/project-store`, which is
  gitignored.

## Validation Landed

- `pnpm calculator:gate:current` baseline passed before the slice.
- `pnpm --filter @dynecho/shared typecheck` passed.
- `pnpm --filter @dynecho/web exec vitest run lib/server-project-storage.test.ts lib/server-project-routes.test.ts --maxWorkers=1`
  passed: 2 files, 7 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-toolbar.test.ts features/workbench/server-project-workbench-snapshot.test.ts features/workbench/simple-workbench-proposal-pdf.test.ts lib/server-project-routes.test.ts --maxWorkers=1`
  passed after list/load + audit append: 4 files, 13 tests.
- `pnpm --filter @dynecho/web typecheck` passed.
- `pnpm --filter @dynecho/shared lint` passed.
- `pnpm --filter @dynecho/web lint` passed.
- `pnpm calculator:gate:current` passed after the landed foundation:
  engine focused gate 67 files / 316 tests, web focused gate 29
  files / 132 tests + 18 skipped, build 5/5 tasks, whitespace guard
  clean.
- `pnpm check` passed after the landed foundation: lint, typecheck,
  full tests, and build. Full tests were engine 201 files / 1145
  tests and web 139 files / 799 tests + 18 skipped. The known
  non-fatal optional `sharp/@img` build warnings remain.
- `pnpm calculator:gate:current` passed after the complete slice:
  engine focused gate 67 files / 316 tests, web focused gate 29
  files / 132 tests + 18 skipped, build 5/5 tasks, whitespace guard
  clean.
- `pnpm check` passed after the complete slice: lint, typecheck,
  full tests, and build. Full tests were engine 201 files / 1145
  tests and web 140 files / 803 tests + 18 skipped. The known
  non-fatal optional `sharp/@img` build warnings remain.

## Remaining Before Closing

None for v1. Broader team/project collaboration belongs to the next
slice:
[SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md](./SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md).

## Completion Criteria

- Local saved scenarios can be imported into durable server project
  records with versioned calculator input and output snapshots.
- Server project reads/lists are owner-scoped.
- The UI does not imply server persistence before sync.
- A synced project can be listed and loaded back into the workbench.
- Proposal exports can record an audit event against a server project.
- Focused app/API tests cover the storage, migration, owner boundary,
  UI load path, and audit append path.
