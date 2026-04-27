# Checkpoint - UI Input / Output Honesty Gate B

Date: 2026-04-27

Slice: `ui_input_output_honesty_v1`

Status: Gate B implemented and validated; Gate C closeout is next.

## What Landed

Gate B changed only UI/API honesty surfaces. Acoustic formulas, runtime
values, support classification, exact/bound/formula precedence, and
confidence scores were not changed.

Implementation:

- `apps/web/lib/calculator-api-validation.ts`
  - adds a small validation payload builder for calculator API routes;
  - preserves raw Zod `issues`;
  - adds `nextField` guidance with concrete field/action text.
- `apps/web/app/api/estimate/route.ts`
  - uses the validation payload builder for invalid estimate requests.
- `apps/web/app/api/impact-only/route.ts`
  - uses the validation payload builder for invalid impact-only requests.
- `apps/web/features/workbench/simple-workbench-output-model.ts`
  - preserves `needs_input` when field impact output is genuinely parked
    because field K / receiving-room volume is missing;
  - marks engine-rejected current-path field impact outputs as
    `unsupported` when the field continuation is already active.

Tests:

- `apps/web/lib/calculator-api-validation.test.ts`
  - pins next-field guidance for missing estimate layers;
  - pins next-field guidance for source-less impact-only requests.
- `apps/web/features/workbench/simple-workbench-output-model.test.ts`
  - pins missing field-impact input as `needs_input`;
  - pins active-field-continuation `L'nT,50` rejection as
    `unsupported` and non-numeric.
- `apps/web/features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts`
  - retained as the Gate A inventory and terminology bridge.
- `tools/dev/run-calculator-current-gate.ts`
  - now includes the Gate B API/card tests in the focused current gate.

## Behavior Now

- `/api/estimate` no longer returns only `Invalid estimate payload.` for
  a request without layers. It returns:
  - `error`: `Add at least one wall or floor layer before calculating.`
  - `nextField.path`: `layers`
  - raw schema `issues`.
- `/api/impact-only` no longer returns only
  `Invalid impact-only payload.` for a source-less request. It returns:
  - `error`: source guidance naming visible layers, source layers, exact
    bands, predictor input, and official source ids;
  - `nextField.path`: `layers`
  - raw schema `issues`.
- Simple output cards still show missing field-impact inputs as
  `needs_input`.
- If field continuation is already active and the engine explicitly
  rejects a requested field-impact companion such as `L'nT,50`, the card
  stays `Not ready` but now uses `unsupported` instead of a misleading
  missing-input label.

## Validation

Targeted Gate B web set passed:

- `pnpm --filter @dynecho/web exec vitest run features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts features/workbench/simple-workbench-output-model.test.ts lib/calculator-api-validation.test.ts --maxWorkers=1`
- result: 3 files / 18 tests.

Focused current gate passed after Gate B:

- `pnpm calculator:gate:current`
- result: engine 97 files / 440 tests, web 39 files / 188 passed +
  18 skipped, build 5/5, whitespace guard clean.

Broad validation passed because Gate B changes user-visible API/card
behavior:

- `pnpm check`
- result: lint green, typecheck green, engine 230 files / 1260 tests,
  web 152 files / 871 passed + 18 skipped through
  `tools/dev/run-web-vitest.ts`, build 5/5.
- build still emits only the known non-fatal `sharp/@img`
  optional-package warnings through `@turbodocx/html-to-docx`.

## Next Action

Gate C closeout should run next:

1. update the readiness roadmap and current-state docs to say
   whether the calculator is private-use ready or name the next
   calculator-only blocker;
2. keep productization deferred unless the calculator readiness chain is
   explicitly closed.
