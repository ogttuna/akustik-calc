# Checkpoint 2026-05-18 - End-of-Day Broad Accuracy Handoff

Status: stable end-of-day checkpoint after commit `c248db8`
(`checkpoint: land broad accuracy calculator slice`).

## Why This Checkpoint Exists

This checkpoint records where the calculator actually stands after the
latest broad-accuracy work, maps implementation back to the active docs,
and names the planned work that did not land today. It should be the
first handoff read before continuing with the open-box timber formula
corridor.

DynEcho remains an acoustic calculator. Source rows are exact overrides,
anchors, holdouts, bounds, and calibration evidence; they are not the
product. The next work must continue expanding source-absent calculation
coverage with named family solvers, explicit budgets, and strict
lab/field/building/ASTM basis separation.

## Document / Implementation Map

The code and docs are aligned at this checkpoint:

- [AGENTS.md](../../AGENTS.md) records the broad-accuracy chain through
  the landed open-box timber transfer-owner gate and points to the
  selected formula-corridor follow-up.
- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) remains
  the active tactical plan. It selects
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`
  as the next bounded action.
- [CURRENT_STATE.md](./CURRENT_STATE.md) records the current runtime and
  validation posture.
- [BROAD_ACCURACY_CALCULATOR_PLAN.md](./BROAD_ACCURACY_CALCULATOR_PLAN.md)
  keeps the broader coverage program focused on converting weak lanes
  into exact/source, similarity, calibrated solver, source-absent solver,
  precise `needs_input`, or precise `unsupported` outcomes.
- [SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md](./SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md)
  is still the detailed active slice plan.
- [CHECKPOINT_2026-05-18_OPEN_BOX_TIMBER_TRANSFER_OWNER.md](./CHECKPOINT_2026-05-18_OPEN_BOX_TIMBER_TRANSFER_OWNER.md)
  is the technical gate checkpoint for the latest open-box owner work.

Implementation evidence:

- `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner.ts`
  classifies the TUAS open-box timber source family and exact-only
  package boundaries.
- `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts`
  proves the no-runtime owner contract, exact precedence, predictor-owned
  rows, and negative boundaries.
- `tools/dev/run-calculator-current-gate.ts` includes the current
  broad-accuracy gate set.
- The broad-accuracy wall and open-web files committed in `c248db8`
  are part of the same validated slice, not separate loose experiments.

## Landed Today

- Broad-accuracy slice source/docs were committed as `c248db8`.
- The open-box timber transfer-owner gate landed as a no-runtime
  contract.
- The gate classifies 15 TUAS open-box timber exact rows on the 370 mm
  `open_box_timber_slab` carrier.
- The gate separates 10 predictor-owned rows from 5 exact-only hybrid /
  fragmented package rows.
- Exact source rows remain first.
- Open-web steel, raw bare open-box carriers, disjoint duplicate roles,
  partial laminate/EPS packages, field/building outputs, and ASTM/IIC
  aliases remain blocked.
- A dedicated checkpoint now records the current test evidence and
  artifact exclusions.

## Planned But Not Landed

These are not bugs in the current checkpoint; they are the next known
implementation gaps and must stay explicit:

- The open-box timber similarity formula corridor is not implemented.
- No open-box timber source-absent runtime values were promoted.
- No open-box timber workbench card, report, saved replay, calculator
  API, or impact-only API surface parity exists yet.
- No residual retune, tolerance tightening, or formula calibration
  movement happened.
- No raw bare open-box impact route was reopened from nearby TUAS rows.
- No `L'n,w`, `L'nT,w`, `R'w`, `DnT,w`, ASTM `IIC` / `AIIC`, or
  building-prediction alias was added for open-box timber.
- No broad source-library crawl or rights-sensitive measured-value
  ingestion was performed.

The next implementation should start by writing
`packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`
and the corresponding formula-corridor owner module before any runtime
promotion.

## Validation Evidence

Latest full current gate before the end-of-day docs commit:

- `pnpm calculator:gate:current`
- engine: 459 files / 2635 tests passed
- web: 87 files / 363 passed + 18 skipped
- repo build: 5 / 5 successful
- known non-fatal warnings: optional `sharp/@img` warnings from
  `@turbodocx/html-to-docx`; Zustand storage warnings in test runtime.

Targeted alignment checks also passed:

- `broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts`
- `broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh-contract.test.ts`
- `broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-contract.test.ts`

Whitespace guard passed with `git diff --check`.

## Worktree Hygiene

The checkpoint commit intentionally excluded generated/local artifacts:

- `.playwright-cli/`
- root PDF files
- `apps/web/output/`
- `output/`
- `tmp/`
- `apps/web/tsconfig.tsbuildinfo`

Those remaining files are not calculator source-of-truth and should not
be committed unless a later task explicitly owns them.

## Resume Order

1. Read this checkpoint.
2. Read
   [CHECKPOINT_2026-05-18_OPEN_BOX_TIMBER_TRANSFER_OWNER.md](./CHECKPOINT_2026-05-18_OPEN_BOX_TIMBER_TRANSFER_OWNER.md).
3. Re-read the active open-box section in
   [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
4. Implement the no-runtime formula corridor contract.
5. Only after that, decide whether a runtime corridor can promote a
   narrow same-family open-box timber prediction path.
