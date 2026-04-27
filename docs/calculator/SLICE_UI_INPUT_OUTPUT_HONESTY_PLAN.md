# Slice Plan - UI Input / Output Honesty

Status: ACTIVE - Gate A inventory next

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

Gate A is next and should be no-runtime by default.

Audit and pin:

- which fields are required for wall, floor, lab, and field outputs;
- how missing required fields are reported in the workbench and API
  routes;
- whether output cards distinguish exact, benchmark, formula, family,
  screening, bound, low-confidence, unsupported, and fail-closed values;
- whether origin/confidence/support text survives layer edits, reorder,
  many-layer stacks, and save/load;
- whether requesting unsupported outputs keeps them visible as
  unsupported instead of hiding them or inventing values.

Gate A deliverable:

- a focused web/engine contract inventorying the current behavior;
- a blocker list separating "already honest", "needs copy/UI wiring",
  and "must fail closed before private use";
- no runtime math changes unless a defended-looking unsupported value is
  found.

## Gate B - Implement Honesty Fixes

Gate B should implement only the fixes justified by Gate A.

Allowed changes:

- make missing-input messages identify the next concrete field to enter;
- keep support/origin/confidence labels visible on relevant cards;
- make unsupported requested outputs visible and non-numeric;
- preserve existing exact/bound/formula/screening runtime precedence;
- add UI tests for wall/floor flows, edge edits, and persistence.

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

Gate C can close when:

- Gate A inventory and any Gate B UI/API fixes are reflected in docs;
- focused web and engine tests cover the changed behavior;
- `pnpm calculator:gate:current` is green;
- broad `pnpm check` is green before closeout if user-visible behavior
  changed;
- the readiness roadmap states whether the calculator is now private-use
  ready or names the next calculator-only blocker.

## Validation

Minimum before edits:

- `pnpm calculator:gate:current`.

Minimum after Gate A:

- targeted inventory contract(s);
- `pnpm calculator:gate:current`;
- `git diff --check`.

Minimum after Gate B or Gate C:

- targeted engine/web tests for every changed behavior;
- `pnpm calculator:gate:current`;
- broad `pnpm check` before closeout;
- `git diff --check`.
