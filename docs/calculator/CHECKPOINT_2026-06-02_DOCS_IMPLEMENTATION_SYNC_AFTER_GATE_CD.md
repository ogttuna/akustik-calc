# Checkpoint 2026-06-02 - Docs/Implementation Sync After Gate CD

## Purpose

This checkpoint reconciles the living calculator documents with the
committed implementation after Gate CD. It exists to prevent drift back
to older Gate BF, Gate BT, or Gate BW "current selected next" wording.

## Documents Reviewed

- `AGENTS.md`
- `docs/README.md`
- `docs/calculator/README.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`
- `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
- Gate BU-CD plan documents in `docs/calculator/`
- Gate CC and Gate CD executable contracts in `packages/engine/src`
- `tools/dev/run-calculator-current-gate.ts`

Historical checkpoint and slice files were treated as history unless a
living document points to them as current. `CALCULATOR_SOURCE_OF_TRUTH.md`
and `POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md` remain the
authority when older files contain stale "selected next" statements.

## Implementation Comparison

The committed implementation agrees on the current state:

- latest value-moving runtime slice:
  `post_v1_floor_open_box_target_output_independence_gate_cd_plan`;
- Gate CD status:
  `post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce`;
- selected next action label:
  `post_v1_next_numeric_coverage_gap_gate_ce_plan`;
- Gate CE is selected but not scaffolded yet. There is no
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ce-contract.test.ts`
  file in the implementation after Gate CD closeout.

Gate CD increases calculator scope/correctness for finished open-box
target-output independence. Complete dry package-transfer and EPS/screed
hybrid building/impact requests now support already-owned single-output
asks without requiring the user to also request `R'w` or another
building output.

Pinned single-output values remain:

- dry package-transfer: `Rw 66`, `C -3.9`, `Ln,w 50.8`,
  `L'n,w 52.8`, `L'nT,w 50.4`, and `L'nT,50 53.7`;
- EPS/screed hybrid: `Rw 72`, `C -1.3`, `Ln,w 47`,
  `L'n,w 49`, `L'nT,w 46.6`, and `L'nT,50 47.6`.

Boundaries remain intact: missing `impactFieldContext` leaves
`L'n,w`, `L'nT,w`, and `L'nT,50` unsupported; `Ctr`, ASTM `IIC`, and
ASTM `AIIC` remain unsupported without their own metric-basis owners.

The shared resolver surface remains documented as 42 declared candidates
and 39 active runtime-basis mappings.

## Validation Evidence

Latest full calculator evidence remains the Gate CD closeout run:

- `pnpm calculator:gate:current`: engine 594 files / 3276 tests, web
  113 files / 437 passed + 18 skipped, repo build 5 / 5;
- whitespace guard passed.

This sync pass also keeps the Gate CD focused docs contract as the
executable guard for the living documents.

## Stop Point

This is a good documentation checkpoint. The next implementation is not
Gate BF, Gate BT, Gate BW, or broad source/documentation work. The next
calculator action is the selected Gate CE numeric coverage rerank, which
must choose a following scope/accuracy slice before runtime values move.
