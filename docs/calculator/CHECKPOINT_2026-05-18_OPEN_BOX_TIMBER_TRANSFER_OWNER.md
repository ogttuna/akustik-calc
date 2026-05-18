# Checkpoint 2026-05-18 - Open-Box Timber Transfer Owner

Status: stable checkpoint after the broad-accuracy floor open-box timber
similarity transfer-owner gate.

## Product Posture

DynEcho remains a calculator, not a source catalog. The current broad
accuracy lane is still focused on expanding real calculation coverage for
floor and wall layer combinations while keeping lab, field, building, and
ASTM bases separate.

The latest landed gate is:

`broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`

Selection status:

`broad_accuracy_floor_open_box_timber_similarity_transfer_owner_landed_no_runtime_selected_formula_corridor`

Selected next action:

`broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`

Selected next file:

`packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`

## Implementation vs Docs

Implementation and docs are aligned at this checkpoint:

- [AGENTS.md](../../AGENTS.md) names the open-box timber owner gate as
  landed and selects the formula corridor next.
- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) gives the
  next bounded implementation step and keeps the active path away from
  broad source crawl, raw bare carrier reopening, field/building aliasing,
  and ASTM/IIC aliasing.
- [CURRENT_STATE.md](./CURRENT_STATE.md) records the current gate result,
  the previous wall local-substitution doc drift fix, and the current
  open-box timber status.
- [BROAD_ACCURACY_CALCULATOR_PLAN.md](./BROAD_ACCURACY_CALCULATOR_PLAN.md)
  and
  [SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md](./SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md)
  keep source rows as exact rows, anchors, and holdouts rather than the
  product.

The implementation in
`packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner.ts`
matches those docs:

- 15 TUAS open-box timber exact rows are classified on the 370 mm
  `open_box_timber_slab` carrier.
- 10 rows are predictor-owned and 5 are exact-only hybrid / fragmented
  package rows.
- Exact rows still win before any formula.
- Open-web steel, raw bare open-box carriers, disjoint duplicate roles,
  partial laminate/EPS finishes, field/building outputs, and ASTM/IIC
  aliases stay blocked.

## Current Gaps

The calculator is at a good checkpoint, but company-internal broad
coverage is not finished.

Open next gaps:

- Define the open-box timber similarity formula corridor without moving
  runtime first.
- Own the package-family transfer terms for upper package, lower ceiling
  family, fragmented exact-equivalent packages, and `Ln,w` / `CI` /
  `Ln,w+CI` / `Rw` companion semantics.
- Add a source-absent budget and residual policy before runtime
  promotion.
- Keep raw bare open-box carriers as `needs_input` or unsupported for
  impact; do not reopen them from nearby TUAS rows.
- Keep field/building and ASTM/IIC outputs separate until metric-specific
  owners exist.
- After formula corridor, promote runtime only through a narrow
  same-family path and then add surface parity.

## Validation

Latest focused current gate:

- `pnpm calculator:gate:current`
- engine: 459 files / 2635 tests passed
- web: 87 files / 363 passed + 18 skipped
- repo build: 5 / 5 successful
- known non-fatal warnings: optional `sharp/@img` warnings from
  `@turbodocx/html-to-docx`

Targeted alignment checks also passed:

- `broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts`
- `broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh-contract.test.ts`
- `broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-contract.test.ts`

Whitespace guard:

- `git diff --check` passed.

## Commit Readiness

This is a good stopping point if the commit excludes generated and local
artefacts:

- do not commit `.playwright-cli/`;
- do not commit `apps/web/output/`, `output/`, or `tmp/`;
- do not commit PDFs in the repo root;
- do not commit `apps/web/tsconfig.tsbuildinfo`.

The code/docs checkpoint itself is coherent and validated.
