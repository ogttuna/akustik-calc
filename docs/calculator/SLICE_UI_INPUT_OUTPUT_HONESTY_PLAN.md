# Slice Plan - UI Input / Output Honesty

Status: CLOSED - Gate C closeout landed

Selected: 2026-04-27 by
`post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts`

## Objective

Make the existing calculator honesty visible and hard to misuse in the
workbench before calling the project reasonable for private day-to-day
use.

This slice is not a formula retune. It should not widen coverage or
change acoustic values unless Gate A finds a defended-looking bad answer
that must fail closed. The first priority is ensuring the user can see
what the engine already knows: which inputs are missing, which outputs
are supported, what evidence tier produced a value, and which requested
outputs are unsupported.

## Scope

Primary surfaces:

- wall / floor mode-specific input requirements in the workbench;
- `/api/estimate` and `/api/impact-only` validation and error payloads;
- result summary and impact/result cards;
- scenario save/load and local-first workbench persistence;
- layer edit, reorder, and many-layer routes that can disturb visible
  output posture;
- existing engine contracts for target-output support and origin trace.

Outputs that must stay explicit where applicable:

- airborne: `Rw`, `R'w`, `Dn,w`, `DnT,w`, `DnT,A`;
- impact: `Ln,w`, `Ln,w+CI`, `DeltaLw`, `L'n,w`, `L'nT,w`,
  `L'nT,50`;
- unsupported values must remain unavailable/null rather than displayed
  as defended estimates.

## Gate A - Inventory Current Honesty Surface

Status: landed no-runtime in
`apps/web/features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts`.

Audited and pinned:

- which fields are required for wall, floor, lab, and field outputs;
- how missing required fields are reported in the workbench and API
  routes;
- whether output cards distinguish exact, benchmark, formula, family,
  screening, bound, low-confidence, unsupported, and fail-closed values;
- whether origin/confidence/support text survives layer edits, reorder,
  many-layer stacks, and save/load;
- whether requesting unsupported outputs keeps them visible as
  unsupported instead of hiding them or inventing values.

Gate A result:

- the focused web contract inventories current behavior;
- no runtime math, formula, confidence, or support-classification change;
- no defended-looking unsupported live/bound value was found;
- schema-level API validation already exposes structured issue paths;
- field airborne status already separates partition geometry blockers
  from receiving-room volume blockers;
- explicitly unsupported requested outputs stay non-numeric;
- existing card matrices already cover support parity, layer reorder,
  many-layer, and save/load posture.

Gate A blockers for Gate B:

- API routes still expose generic top-level validation messages even
  though schema issue detail is structured;
- simple output-card precedence can label an engine-rejected field
  impact output as `needs_input` when it should be visibly unsupported
  on the current path.

## Gate B - Implement Honesty Fixes

Status: implemented in
`apps/web/lib/calculator-api-validation.ts`,
`apps/web/app/api/estimate/route.ts`,
`apps/web/app/api/impact-only/route.ts`, and
`apps/web/features/workbench/simple-workbench-output-model.ts`.

Gate B implemented only the fixes justified by Gate A.

Allowed changes:

- make missing-input messages identify the next concrete field to enter;
- normalize `/api/estimate` and `/api/impact-only` validation payloads
  into user-facing next-field guidance while preserving structured issue
  details;
- keep support/origin/confidence labels visible on relevant cards;
- make unsupported requested outputs visible and non-numeric, with
  unsupported/current-path labels when the engine already rejected the
  output;
- preserve existing exact/bound/formula/screening runtime precedence;
- add UI tests for wall/floor flows, edge edits, and persistence.

Gate B result:

- `/api/estimate` invalid layer-stack requests now include a concrete
  `nextField` payload and keep raw schema `issues`;
- `/api/impact-only` source-less requests now include concrete source
  guidance and keep raw schema `issues`;
- simple output cards preserve `needs_input` for genuinely missing
  field-impact continuation inputs;
- active field-continuation outputs rejected by the engine, such as
  `L'nT,50`, now stay `Not ready` with `unsupported` status instead of
  a misleading missing-input label;
- no acoustic formulas, runtime values, confidence scores, or
  exact/bound/formula precedence changed.

Disallowed changes:

- retuning acoustic formulas or confidence scores as part of UI copy;
- changing `floor-steel-fallback` runtime values;
- hiding low-confidence, screening, bound, or unsupported posture behind
  generic "estimated" wording;
- inventing `L'nT,50`, `Ln,w+CI`, or `DeltaLw` when no source, formula,
  or bound exists;
- resuming productization route integration before this calculator
  readiness slice closes.

## Gate C - Closeout

Status: closed in
`packages/engine/src/post-ui-input-output-honesty-gate-c-next-slice-selection-contract.test.ts`.

Gate C can close when:

- Gate A inventory and any Gate B UI/API fixes are reflected in docs;
- focused web and engine tests cover the changed behavior;
- `pnpm calculator:gate:current` is green;
- broad `pnpm check` is green before closeout if user-visible behavior
  changed;
- the readiness roadmap states whether the calculator is now private-use
  ready or names the next calculator-only blocker.

Gate C result:

- calculator personal/internal-use readiness chain is closed;
- the calculator is ready for private/internal estimates with visible
  evidence-tier caveats;
- no acoustic runtime behavior changed;
- `project_access_policy_route_integration_v1` is selected next.

## Validation

Minimum before edits:

- `pnpm calculator:gate:current`.

Minimum after Gate A:

- targeted inventory contract(s);
- `pnpm calculator:gate:current`;
- `git diff --check`.

Latest Gate A validation:

- targeted inventory contract: 1 file / 4 tests;
- `pnpm calculator:gate:current`: engine 97 files / 440 tests, web
  37 files / 174 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Latest Gate B targeted validation:

- targeted web set: 3 files / 18 tests
  (`ui-input-output-honesty-gate-a-inventory`,
  `simple-workbench-output-model`, `calculator-api-validation`).

Latest Gate B full validation:

- `pnpm calculator:gate:current`: engine 97 files / 440 tests, web
  39 files / 188 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- `pnpm check`: lint green, typecheck green, engine 230 files /
  1260 tests, web 152 files / 871 passed + 18 skipped, build 5/5 with
  the same known non-fatal `sharp/@img` warnings.

Latest Gate C closeout validation:

- targeted closeout contract: 1 file / 5 tests
  (`post-ui-input-output-honesty-gate-c-next-slice-selection-contract`).
- `pnpm calculator:gate:current`: engine 98 files / 445 tests, web
  39 files / 188 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- `pnpm check`: lint green, typecheck green, engine 231 files /
  1265 tests, web 152 files / 871 passed + 18 skipped, build 5/5 with
  the same known non-fatal `sharp/@img` warnings.

Minimum after Gate B or Gate C:

- targeted engine/web tests for every changed behavior;
- `pnpm calculator:gate:current`;
- broad `pnpm check` before closeout;
- `git diff --check`.
