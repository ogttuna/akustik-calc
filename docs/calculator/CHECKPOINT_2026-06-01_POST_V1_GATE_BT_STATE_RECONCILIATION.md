# Checkpoint 2026-06-01 - Post-V1 Gate BT State Reconciliation

## Purpose

This checkpoint reconciles the living calculator documents with the
current implementation after Gate BS runtime movement and Gate BT
selection. It exists to stop drift back into stale Gate BF/Gate BG
handoffs.

## Documents Reviewed

- `AGENTS.md`
- `docs/README.md`
- `docs/calculator/README.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`
- `docs/calculator/POST_V1_GATE_BT_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md`
- Gate BS and Gate BT executable contracts in `packages/engine/src`

## Reconciled Current State

Usable V1 remains closed for the current company-internal envelope.
There is no open V1 acceptance step.

The latest value-moving post-V1 runtime slice is:

`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan`

Gate BS increases calculator coverage and correctness for finished
open-box floor impact field companions:

- dry package-transfer field-only requests now calculate `L'n,w 52.8`,
  `L'nT,w 50.4`, and `L'nT,50 53.7` from the same anchor as mixed
  requests;
- EPS/screed hybrid requests with explicit `impactFieldContext` now
  calculate `L'n,w 49`, `L'nT,w 46.6`, and `L'nT,50 47.6` from the
  owned `Ln,w 47` / `CI,50-2500 1` lab anchor;
- missing `impactFieldContext`, airborne building outputs, and ASTM
  `IIC` / `AIIC` remain separate owners or stopped outputs.

The latest no-runtime post-V1 selection slice is:

`post_v1_next_numeric_coverage_gap_gate_bt_plan`

Gate BT selected:

`floor.open_box_timber_finished_package.airborne_building_companion_gap`

The selected next implementation is:

`post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan`

Gate BU is the correct next high-ROI calculator slice because complete
finished open-box package `building_prediction` airborne requests can
still fall to a generic predictor or `screening_mass_law_curve_seed_v3`
instead of the owned package `Rw` anchors. Gate BU must make `R'w`,
`Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` use the package anchors when the
required building context is present.

## Implementation Comparison

The committed implementation and executable Gate BT contract agree that
Gate BU is not yet implemented. The selected Gate BU contract file path
is intentional next-work scaffolding:

`packages/engine/src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts`

Current open implementation work is therefore bounded: implement Gate BU
runtime ownership and keep missing building context as `needs_input`;
do not select broad source crawling, finite scenario packs, confidence
wording, report/storage/auth work, or generic UI cleanup.

## Validation

Current checkpoint validation after Gate BT:

- `pnpm calculator:gate:current`: engine 584 files / 3227 tests, web 113
  files / 437 passed + 18 skipped, repo build 5 / 5;
- `git diff --check`: clean.

## Stop Point

This is a good stop point after documentation reconciliation if the
validation remains green. The next implementation is Gate BU, and it is
directly tied to calculator scope/correctness: more complete finished
open-box package building-airborne requests should calculate from the
right owned acoustic anchor.
