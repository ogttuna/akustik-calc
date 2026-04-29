# Slice Plan - Internal Use Acceptance Rehearsal v1

Status: SELECTED / GATE A NEXT (selected 2026-04-29 by
`post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts`;
no-runtime company-internal acceptance pack).

Next implementation file:

`packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`

Selection reason: `clt_mass_timber_wall_source_pack_extraction_v1`
closed no-runtime after Gate B found no bounded metric-mapping or
formula-tolerance path ready for CLT / mass-timber wall runtime
movement. Source-pack readiness still blocks every accuracy import. The
highest-value next action for company use is therefore not another
runtime import attempt, but an executable acceptance rehearsal that
turns the current operating envelope into concrete company-use
scenarios, expected values/statuses, caveats, and fail-closed checks.

This slice must not change acoustic formulas, runtime values, support
classes, confidence classes, evidence tiers, API shape, route-card
values, output-card statuses, proposal/report copy, or workbench input
behavior unless a later gate explicitly finds a mismatch between
documented acceptance behavior and implementation.

## Objective

Make the calculator safer for controlled company-internal use by
building a 10-20 scenario acceptance pack from the already closed
operating envelope.

The acceptance pack should answer:

- which representative wall/floor stacks are ordinary internal
  estimates with standard caveat;
- which stacks are useful only with visible formula, low-confidence,
  screening, or source-gated caveats;
- which requests must fail closed, ask for missing inputs, or report
  unsupported outputs;
- whether hostile edits, many layers, layer reordering, save/load, and
  missing field/building inputs keep the same honest posture.

## Gate A - Build Company Internal Acceptance Matrix

Gate A should add:

`packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`

The contract should build a no-runtime acceptance matrix from
[INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md).

Minimum scenario buckets:

- `pilot_ready_with_standard_caveat`
  - LSF exact preset;
  - AAC single-leaf benchmark;
  - masonry single-leaf benchmark;
  - source-backed floor corridor.
- `pilot_allowed_with_visible_caveat`
  - timber double-board generated wall;
  - CLT local generated wall;
  - lined/heavy-core screening wall;
  - generated steel floor fallback;
  - many-layer and reorder guardrails.
- `not_defended_fail_closed_or_source_gated`
  - invalid or missing inputs;
  - unsupported target outputs;
  - no-stud double-leaf source-gated family;
  - historical blocked floor families.
- `hostile_many_layer_reorder_and_missing_input_edges`
  - many-layer finite/stable behavior;
  - layer reorder/edit stability;
  - missing field/building inputs stay `needs_input`;
  - unsupported low-frequency/impact outputs stay unsupported.

Minimum assertions:

- value snapshot or supported-output status for each selected scenario;
- evidence/confidence/caveat visibility for every caveated scenario;
- required-input or unsupported-output message where appropriate;
- route-card or report posture when user-visible behavior is involved;
- no runtime/support/confidence/evidence promotion from acceptance
  convenience.

Gate A should target 20 scenarios and must include at least 10. If a
scenario is too unstable to pin numerically, it must be pinned by
status, support class, confidence/evidence class, or explicit
unsupported/needs-input reason.

## Gate B - Workbench And Report Acceptance Visibility

Gate B should be selected only if Gate A finds that values/statuses are
stable but the workbench, route-card, or proposal/report visibility does
not make the acceptance posture clear enough for company use.

Possible Gate B scope:

- route-card caveat visibility for every acceptance bucket;
- proposal/report note fidelity for caveated results;
- missing-input and unsupported-output copy consistency;
- no value movement unless Gate A exposed a real implementation bug.

## Gate C - Pilot Readiness Closeout

Gate C should close this slice only when:

- the acceptance matrix is executable and green;
- docs identify the exact controlled-use envelope and known source-gated
  gaps;
- no source-gated family was promoted for pilot convenience;
- the next slice is selected from either a concrete acceptance defect or
  a genuinely source-ready accuracy pack.

## Validation

- Run the targeted Gate A engine contract while iterating.
- Add the Gate A contract to `tools/dev/run-calculator-current-gate.ts`
  when it lands.
- Run `pnpm calculator:gate:current`.
- Run `git diff --check`.
- Run `pnpm check` before a full company-pilot handoff or if Gate B
  touches user-visible workbench/report behavior.

Latest selection validation, 2026-04-29:

- selected by CLT / mass-timber extraction Gate C no-runtime closeout;
- focused current gate after selection green: engine 136 files / 649
  tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean;
- broad `pnpm check` after selection green: lint/typecheck green,
  engine 269 files / 1469 tests, web 157 files / 890 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
