# Playwright / Next Dev Memory Analysis - 2026-06-15

Document role: read-only investigation notes for the Playwright/Next dev
server memory and orphan-process feedback. This document does not change
calculator behavior, engine formulas, project storage, or test runner code.

## Summary

The feedback is directionally correct. The current Playwright/Next dev flow can
leave Next dev servers behind, can accumulate generated `.next-playwright-*`
worlds, and can compile an unnecessarily large engine graph into small Next API
routes.

The highest-risk issue is the broad `@dynecho/engine` barrel import used by
runtime web API routes. The cleanup and generated-cache issues amplify the
problem by allowing multiple oversized dev compilers to survive and by
increasing the type/build surface over time.

## Evidence Snapshot

Observed from read-only inspection on 2026-06-15:

- `tools/dev/run-playwright.ts` selects the first available port in the
  `3100-3149` range and spawns `pnpm exec playwright test`.
- `tools/dev/run-playwright-web-server.ts` starts `next dev` on the selected
  `PLAYWRIGHT_PORT` with `NEXT_DIST_DIR=.next-playwright-${port}`.
- Both wrappers pass `...process.env` through and only listen to child `exit`.
  They do not install robust parent `SIGINT`, `SIGTERM`, `uncaughtException`,
  `unhandledRejection`, or process-exit cleanup.
- One leftover `next dev` chain was observed on port `3106` after interrupted
  test runs. It was not killed during this read-only analysis.
- `apps/web` contains 21 generated `.next-playwright-*`, `.next-dev-*`, and
  `.next-codex-*` directories, totaling about 4.2 GB.
- `apps/web/tsconfig.playwright.json` includes both
  `.next-playwright-*/types/**/*.ts` and many explicit historical
  `.next-playwright-PORT/types/**/*.ts` entries.
- `apps/web/app/api/estimate/route.ts` imports `calculateAssembly` from the
  package root `@dynecho/engine`.
- `apps/web/app/api/impact-only/route.ts` imports `calculateImpactOnly` from
  the package root `@dynecho/engine`.
- `packages/engine/package.json` currently exports only `"."` mapped to
  `./src/index.ts`.
- `packages/engine/src/index.ts` contains 199 `export *` entries. This includes
  runtime code, contract surfaces, coverage/gate surfaces, and test-like
  artifacts that should not all be pulled into a small Next API route.
- The generated `apps/web/.next-playwright-3106/server/app/api/estimate/route.js`
  file was about 21 MB. Text inspection found thousands of engine source
  references and many `contract` / `.test` references inside that one route
  bundle.
- `NODE_OPTIONS` is not set by the repository scripts found in this inspection.
  The risk comes from inheriting the caller environment unchanged. If a shell or
  agent session provides a high `--max-old-space-size` and source maps, the
  Playwright Next server receives it.

## Root Causes

### 1. Playwright Server Cleanup Is Not Strong Enough

Current behavior:

- `run-playwright.ts` starts the Playwright CLI as a child process.
- Playwright's `webServer.command` then starts
  `tools/dev/run-playwright-web-server.ts`.
- The web-server wrapper starts `next dev`.
- If an intermediate wrapper, terminal session, or test run is interrupted in an
  unlucky way, `next dev` can survive as an orphaned process.

Why this matters:

- Each survivor owns its own port and `.next-playwright-*` dist directory.
- The next run probes forward to a new port instead of reusing the old one.
- Multiple Next dev compilers can remain resident at once.

Safe fix direction:

- Add shared child cleanup helpers for dev wrappers.
- Start children in a killable process group on POSIX where possible.
- Handle `SIGINT`, `SIGTERM`, `SIGHUP`, `uncaughtException`,
  `unhandledRejection`, parent `beforeExit`, and child `error`.
- Ensure cleanup is idempotent so normal child exit does not double-kill.
- Prefer graceful termination first, then bounded force-kill if needed.

### 2. Playwright Next Server Inherits Unsafe `NODE_OPTIONS`

Current behavior:

- Both Playwright wrappers pass `...process.env`.
- No script-level guard removes or bounds `NODE_OPTIONS` before launching
  Playwright or Next.

Why this matters:

- A high inherited `--max-old-space-size` lets runaway Next compilers grow very
  large instead of failing early.
- `--enable-source-maps` can increase memory and CPU cost during large route
  compilation.

Safe fix direction:

- Sanitize environment specifically for Playwright-managed Next dev servers.
- Recommended first pass:
  - preserve non-memory options only if there is an explicit need;
  - otherwise set `NODE_OPTIONS=--max-old-space-size=4096` for the Playwright
    web server child;
  - document why Playwright Next dev intentionally differs from broad local
    dev/build shells.

### 3. Generated Playwright Type Paths Accumulate

Current behavior:

- `tsconfig.playwright.json` includes wildcard generated types and also dozens
  of explicit historical port paths.
- Next config chooses `tsconfig.playwright.json` when `NEXT_DIST_DIR` starts
  with `.next-playwright-`.

Why this matters:

- The wildcard already covers all generated Playwright type directories.
- Explicit historical paths make the config noisy, unstable, and tied to port
  drift.
- This is not likely the main source of multi-GB RSS by itself, but it expands
  the type surface and makes generated state look canonical.

Safe fix direction:

- Remove explicit historical `.next-playwright-PORT/types/**/*.ts` entries.
- Keep only one generated include pattern if needed.
- Longer term, prefer a deterministic Playwright dist dir or current-run type
  path over unbounded wildcard scanning.

### 4. `@dynecho/engine` Package Root Is Too Broad For Web Runtime Routes

Current behavior:

- Web API routes import runtime functions from `@dynecho/engine`.
- The package root points to `src/index.ts`.
- `src/index.ts` re-exports 199 modules with `export *`.

Why this matters:

- Next must trace/transpile the package used by server routes.
- The package root looks like the entire engine public surface.
- Small API routes pull contract/gate/coverage/test-like surfaces into their
  compiler graph.
- This directly explains the large `api/estimate/route.js` generated output.

Safe fix direction:

- Add a narrow runtime subpath, for example:
  - `packages/engine/src/runtime.ts`
  - package export `"./runtime": "./src/runtime.ts"`
- Export only runtime web/API functions from that subpath, initially:
  - `calculateAssembly`
  - `calculateImpactOnly`
  - any direct runtime helpers currently used by web production code, but not
    broad contract/gate/test surfaces.
- Move runtime Next route imports to:
  - `@dynecho/engine/runtime`
- Keep existing `@dynecho/engine` root export for tests, tools, and historical
  internal use until a separate migration is planned.

Important constraint:

- Do not retune calculator formulas while creating the runtime export.
- The runtime subpath must re-export the same implementation functions, not
  duplicate or alter calculation logic.

## Recommended Fix Order

1. **Harden Playwright child cleanup first.**
   - This prevents new orphan Next dev servers while deeper bundle work happens.
   - Validation: interrupt a Playwright run and verify no `next dev --port
     <PLAYWRIGHT_PORT>` process remains.

2. **Sanitize `NODE_OPTIONS` for Playwright web server.**
   - Cap the blast radius of any remaining compiler graph issue.
   - Validation: inspect the child Next process environment and confirm the
     huge inherited heap setting is absent or bounded.

3. **Add the narrow engine runtime export and migrate web runtime routes.**
   - Start with `estimate` and `impact-only`.
   - Leave web tests and tooling imports alone unless they are part of the
     runtime server graph.
   - Validation: rebuild one Playwright dist and compare
     `server/app/api/estimate/route.js` size and source reference counts before
     and after.

4. **Simplify `tsconfig.playwright.json`.**
   - Remove explicit historical port type paths.
   - Decide whether wildcard is acceptable for the first pass or whether the
     wrapper should generate/use a current-run tsconfig.
   - Validation: Playwright Next server starts, route typing remains valid, and
     no old port paths are re-added.

5. **Clean stale generated caches only after approval.**
   - Cleaning helps disk and noise, but it is not the root cause.
   - Do not delete `.next-dev-*`, `.next-codex-*`, or `.next-playwright-*`
     directories without explicit approval because other agents may be using a
     running server or debugging artifact.

## Things To Avoid

- Do not delete generated cache directories before fixing cleanup and imports.
  They will come back if root causes remain.
- Do not change calculator formulas, runtime numeric behavior, or route payload
  schemas as part of this infrastructure fix.
- Do not replace all `@dynecho/engine` imports across tests and docs in one
  broad mechanical pass. Runtime Next server imports are the immediate target.
- Do not rely only on port probing. Port probing hides leaked servers by moving
  to a new port.
- Do not make `NODE_OPTIONS` globally small for every repo script without
  checking engine gates/builds; scope the limit to Playwright-managed Next dev
  first.

## Validation Plan

Minimum validation after implementation:

- `pnpm --filter @dynecho/web build`
- `PLAYWRIGHT_PORT=3100 pnpm exec playwright test e2e/workbench-v2-material-editor.spec.ts -g "proposal saves a local report to a selected project"`
- A deliberate interrupted Playwright run:
  - start a Playwright command,
  - interrupt it,
  - verify no `next dev --hostname 127.0.0.1 --port <port>` process remains.
- Bundle check:
  - build/start a Playwright dist,
  - inspect `apps/web/.next-playwright-<port>/server/app/api/estimate/route.js`,
  - confirm route size and engine source reference counts drop materially.
- `git diff --check`.

Optional broader validation:

- `pnpm --filter @dynecho/web exec vitest run` for route/web helper tests touched
  by import migration.
- `pnpm --filter @dynecho/engine typecheck` if package exports or engine runtime
  entry files change.

## Current Open Questions

- Should Playwright use a single deterministic dist dir, or keep per-port dist
  dirs after cleanup is fixed?
  - Recommendation: keep per-port for the first cleanup pass, then revisit.
- Should `tsconfig.playwright.json` include all `.next-playwright-*` generated
  type dirs or only the active one?
  - Recommendation: remove historical explicit paths immediately; active-only
    generated typing is cleaner but needs a small wrapper/config design.
- Should the engine runtime subpath include type-only exports used by web UI
  files?
  - Recommendation: no for the first pass. Target server routes first, then
    measure before expanding.

## Status

Implementation first pass complete on 2026-06-15.

Implemented changes:

- `tools/dev/managed-child-process.ts` now provides shared child lifecycle
  handling for the Playwright wrappers.
- `tools/dev/run-playwright.ts` now launches the Playwright CLI through the
  managed helper so interrupted top-level runs terminate the Playwright process
  group instead of only letting port probing move to the next port.
- `tools/dev/run-playwright-web-server.ts` now:
  - caps the Next dev child `NODE_OPTIONS` at `--max-old-space-size=4096` by
    default, with `PLAYWRIGHT_NEXT_NODE_OPTIONS` as the explicit override;
  - keeps the Next dev child in the Playwright web-server process group so
    normal Playwright shutdown can clean it up;
  - writes a per-run ignored `.next-playwright-tsconfig-<port>.json` in the web
    app root and points Next at it with `NEXT_PLAYWRIGHT_TSCONFIG_PATH`, so Next
    no longer appends active port type paths to tracked
    `tsconfig.playwright.json`.
- `apps/web/next.config.ts` now honors `NEXT_PLAYWRIGHT_TSCONFIG_PATH` for
  Playwright dist dirs.
- `packages/engine/src/runtime.ts` and the `@dynecho/engine/runtime` package
  export now expose the same `calculateAssembly` and `calculateImpactOnly`
  functions used by the package root.
- `/api/estimate` and `/api/impact-only` now import from
  `@dynecho/engine/runtime` instead of the broad `@dynecho/engine` root barrel.
- `apps/web/tsconfig.playwright.json` has had historical explicit
  `.next-playwright-PORT` include entries removed.

Validation completed:

- `pnpm --filter @dynecho/web build` passed. The only warnings observed were
  the known optional `sharp/@img` warnings from the proposal DOCX path.
- `pnpm exec tsc --noEmit --pretty false --moduleResolution Bundler --module
  ESNext --target ES2022 --types node tools/dev/managed-child-process.ts
  tools/dev/run-playwright.ts tools/dev/run-playwright-web-server.ts` passed.
- `PLAYWRIGHT_PORT=3193 pnpm exec playwright test
  e2e/workbench-v2-material-editor.spec.ts -g "proposal saves a local report to
  a selected project"` passed and exited cleanly.
- A direct high-heap server test with
  `NODE_OPTIONS='--max-old-space-size=15896 --enable-source-maps'
  PLAYWRIGHT_PORT=3194 tsx tools/dev/run-playwright-web-server.ts` showed the
  Next dev child receiving `NODE_OPTIONS=--max-old-space-size=4096` and
  `NEXT_PLAYWRIGHT_TSCONFIG_PATH=./.next-playwright-tsconfig-3194.json`.
- Ctrl-C on that direct web-server run exited with code 130 and left no
  `next dev --port 3194` process or listener behind.
- The tracked `apps/web/tsconfig.playwright.json` did not receive new 3193/3194
  port entries after the generated-tsconfig change.
- Runtime export identity check passed:
  `@dynecho/engine/runtime` returns the same `calculateAssembly` and
  `calculateImpactOnly` function objects as `@dynecho/engine`.
- Playwright dev estimate route bundle spot check on port 3193:
  `server/app/api/estimate/route.js` was `15,917,874` bytes, down from the
  earlier observed roughly `21.5 MB`; engine source references dropped from the
  earlier `3659` observation to `2205`, and test references dropped from `802`
  to `579`. Contract references are still present because the current
  calculator runtime directly imports some `contract`-named modules; removing
  those would be a separate calculator-runtime factoring task and was not part
  of this process-safety fix.

Validation caveat:

- `pnpm --filter @dynecho/engine typecheck` was attempted and failed on existing
  contract-test type errors outside this implementation slice:
  `post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd`,
  `post-v1-next-numeric-coverage-gap-gate-fc`, and several
  `post-v1-wall-compatible-anchor-delta-*` contract tests. No calculator
  formula files were changed by this implementation.

Not done:

- Stale `.next-playwright-*`, `.next-dev-*`, and `.next-codex-*` directories
  were not deleted because other agents may still be using them.
- The remaining calculator-runtime dependency graph was not refactored beyond
  the narrow public runtime export and web API import migration.
