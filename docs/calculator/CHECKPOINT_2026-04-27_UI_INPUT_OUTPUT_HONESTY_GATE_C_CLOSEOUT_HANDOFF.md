# Checkpoint - UI Input / Output Honesty Gate C Closeout

Date: 2026-04-27

Slice: `ui_input_output_honesty_v1`

Status: closed. Calculator is ready for private/internal use with
evidence-tier caveats; this is not a certification or full
productization claim.

## What Closed

Gate C closes the personal-use calculator readiness chain:

1. heavy-core/concrete wall lane remains honest screening;
2. timber stud + CLT wall lanes remain formula/source-gated rather than
   over-promoted;
3. floor fallback / low-confidence cleanup remains explicit and
   low-confidence until new source or bounded-family evidence appears;
4. UI/input/output honesty now surfaces missing inputs, unsupported
   requested outputs, origin/support posture, and non-numeric
   fail-closed states clearly enough for a knowledgeable private user.

No acoustic formula, runtime value, confidence score, exact/source
precedence, support classification, or result rounding changed in Gate C.

## Readiness Decision

DynEcho is now reasonable for private/internal acoustic estimates across
common wall and floor layer combinations when used with its visible
evidence tiering:

- finite outputs are returned where the engine has an exact/source,
  benchmark, formula-owned, family, screening, or bound lane;
- exact/source and bound precedence remain guarded before broader
  formula/screening lanes;
- screening, low-confidence, bound, unsupported, and fail-closed states
  remain visible rather than looking exact;
- invalid thickness, missing inputs, many layers, layer reorder/edit
  paths, and unsupported output requests are covered by focused tests and
  do not emit defended-looking bad numbers.

This does not claim:

- every possible floor/wall family corridor is complete;
- the app is ready as a certified design or regulatory submission tool;
- blocked source families such as `GDMTXA04A`, `C11c`, raw bare
  open-box/open-web, heavy-concrete promotion, timber-stud widening, or
  CLT wall promotion can reopen without new source evidence;
- product concerns such as route policy integration, deployment,
  billing, team collaboration, monitoring, or polished reporting are
  done.

## Executable Evidence

New closeout contract:

- `packages/engine/src/post-ui-input-output-honesty-gate-c-next-slice-selection-contract.test.ts`

Gate C evidence ledger:

- `apps/web/features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts`
- `apps/web/lib/calculator-api-validation.test.ts`
- `apps/web/features/workbench/simple-workbench-output-model.test.ts`
- `packages/engine/src/post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts`
- `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`
- `docs/calculator/SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md`

Latest validation during closeout:

- `pnpm calculator:gate:current`: engine 98 files / 445 tests, web
  39 files / 188 passed + 18 skipped, build 5/5, whitespace guard clean.
- `pnpm check`: lint green, typecheck green, engine 231 files /
  1265 tests, web 152 files / 871 passed + 18 skipped, build 5/5.
- build warnings are only the known non-fatal `sharp/@img`
  optional-package warnings through `@turbodocx/html-to-docx`.

## Next Selected Slice

The next selected implementation slice is
`project_access_policy_route_integration_v1`.

Why now:

- the calculator personal-use readiness chain is closed;
- productization route integration was deferred, not cancelled;
- the pure team-access policy exists, but project/proposal routes still
  use owner-scoped authorization directly.

Boundaries for the next slice:

- keep routes owner-scoped;
- adapt the current owner scope into the pure policy helper;
- prove team roles are not route-enabled until a real membership source
  exists;
- do not change calculator runtime, formulas, source posture, output
  support, or acoustic values.
