# Checkpoint - Post-V1 Acoustic Calculator State Reconciliation - 2026-05-23

Status: checkpoint after rereading the active docs, comparing them with
the current implementation, and preparing the repo for a clean handoff.

## Product Lock

DynEcho is an acoustic calculator, not a source catalog.

The calculator answer order remains:

1. exact measured answer for the same stack, topology, metric, and basis;
2. compatible measured anchor when topology and metric scope allow it;
3. calibrated family formula;
4. source-absent family formula;
5. `needs_input` with exact missing physical fields;
6. `unsupported` with the missing basis or standard owner.

Source rows are exact overrides, anchors, calibration evidence,
holdouts, and bounds. They are not the product. A next slice that mainly
adds rows, confidence wording, or finite scenarios while leaving formula
coverage, input contracts, or basis-correct publication untouched is the
wrong default move.

## Documents Reviewed

- `AGENTS.md`
- `docs/README.md`
- `docs/calculator/README.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/USABLE_V1_EXECUTION_PLAN.md`
- `docs/calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md`
- `docs/calculator/CHECKPOINT_2026-05-22_ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_RECONCILIATION.md`

Finding: the usable V1 execution plan, current state, and tactical plan
already describe Steps 0-5 as closed for the current company-internal
usable V1 envelope. Some top-level README text still described the
pre-V1 state where the V1 contract did not exist and flat double-leaf
inputs could leak untraced screening values. That text is stale after
the landed V1 slices and is corrected by this checkpoint.

## Implementation Compared

The answer-engine contract now exists at
`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`
and is part of `pnpm calculator:gate:current`.

The current implementation has the intended shared answer-engine shape:

- exact wall, floor, and ISO 717-2 impact rows are metric-scoped exact
  overrides, not broad metric adapters;
- source-absent single-leaf, explicit double-leaf/framed wall, grouped
  triple-leaf/local-substitution, raw-bare floor, helper-only floor,
  direct-fixed, supported-band, package-transfer, heavy floating floor,
  lined massive wall, and heavy-composite wall lanes feed the shared
  resolver trace when they own the requested basis;
- missing topology, missing resilient side count, missing floor roles,
  missing field context, pure ASTM `IIC` / `AIIC`, and unsupported
  building/opening owners stop as `needs_input` or `unsupported` before
  user-facing value publication;
- workbench cards, answer charts, API payloads, saved replay, server
  snapshot replay, and Markdown report surfaces use the selected answer
  scope instead of diagnostic values.

Live resolver summary from the current code:

- 25 declared resolver candidates;
- 22 active runtime-basis mappings;
- basis rows: 19 `element_lab`, 4 `field_apparent`, 1
  `building_prediction`, 1 `astm_rating_boundary`;
- candidate kinds: 3 exact measured overrides, 2 similarity anchors, 1
  calibrated family solver, 12 source-absent family solvers, 4
  field/building adapters, 1 `needs_input` boundary, 1 basis boundary,
  and 1 unsupported boundary;
- routes: 12 wall candidates and 13 floor candidates;
- company-internal V0 operating envelope: 22 allowed exact or budgeted
  rows, 1 needs-user-input row, 2 blocked rows, and 4 blocked action
  categories.

## Current Useful Formula/Adapter Coverage

Wall coverage that is now traced through the answer engine includes:

- single-leaf mass-law banded lab formula;
- double-leaf/framed mass-air-mass / bridge / damping lab formula;
- grouped triple-leaf and local-substitution wall formula lanes;
- guarded adjacent flat-list double-leaf lab and complete field paths;
- complete wall `field_between_rooms` field-apparent adapter;
- lined massive-wall lab formula;
- company-internal heavy-composite wall lab formula;
- exact wall same-stack precedence, including reversed same-stack order,
  only for owned exact metrics.

Floor coverage that is now traced through the answer engine includes:

- exact measured floor rows only for owned floor metrics;
- exact ISO 717-2 impact-band rows only for owned ISO impact metrics;
- package-transfer and supported-band compatible anchors;
- raw-bare, helper-only, direct-fixed, and heavy floating floor formula
  lanes when their physical input contracts are satisfied;
- lab impact formulas and field-impact stops with explicit missing
  context;
- visible ASTM `IIC` / `AIIC` unsupported boundaries instead of ISO
  impact aliasing.

## Current Gaps

No usable V1 acceptance step remains open for the current tested
company-internal envelope. The remaining work is post-V1 product
improvement and should be selected explicitly.

Good next-slice families:

- broaden formula coverage and adapters for still-unowned families such
  as direct-fixed double-leaf variants, grouped triple/multicavity cases
  beyond the current owner set, building-prediction productization, ASTM
  `IIC` / `AIIC` ownership, and additional floor systems with explicit
  physical inputs;
- improve measured-holdout calibration and error budgets for owned
  formula families, without blind tolerance retuning;
- improve UI input ergonomics where formula-required fields are already
  known but not easy enough to supply;
- promote source rows only when they are exact overrides, compatible
  anchors, calibration evidence, or holdouts for a selected formula
  family.

Blocked defaults:

- broad source crawling;
- a new finite scenario library as the next move;
- metric alias promotion;
- confidence wording as a substitute for answer correctness;
- deleting or bypassing the existing solver lanes.

## Validation Status

Latest full gate evidence before this checkpoint: `pnpm
calculator:gate:current` passed on 2026-05-23 with engine 510 files /
2912 tests, web 94 files / 397 passed + 18 skipped, repo build 5 / 5,
and whitespace guard passed.

Checkpoint validation after the documentation updates:

- targeted answer-engine/resolver regression passed: 7 files / 52 tests;
- one stale model-first doc-alignment assertion initially caught that
  `docs/README.md` no longer carried the historical
  `acoustic_calculator_answer_engine_v1_plan` id; the README was updated
  to keep that id as a historical product-direction lock, and the
  targeted Gate A doc-alignment test then passed: 1 file / 5 tests;
- full `pnpm calculator:gate:current` then passed again: engine 510
  files / 2912 tests, web 94 files / 397 passed + 18 skipped, repo
  build 5 / 5, and whitespace guard passed;
- `git diff --check` is clean.

This is a good stopping point if commit staging excludes generated or
unrelated artifacts such as PDFs, output folders, Playwright scratch
state, and TypeScript build info.
