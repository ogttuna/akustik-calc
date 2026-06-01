# Post-V1 Gate BR Numeric Coverage And Accuracy Rerank Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BR is a no-runtime calculator-capability rerank after Gate BQ. It
selects the next implementation slice only by calculator scope and
correctness: more realistic layer combinations must calculate owned
acoustic outputs when route-required inputs are present, or an existing
route must become more numerically defensible.

Gate BR explicitly rejects broad source crawling, finite scenario packs,
confidence wording, generic UI/report polish, storage/auth work, and
metric aliasing as the active slice.

## Selection

Gate BR has now landed as:

`post_v1_next_numeric_coverage_gap_gate_br_plan`

Gate BR status:

`post_v1_next_numeric_coverage_gap_gate_br_landed_no_runtime_selected_floor_open_box_eps_screed_field_companion_gate_bs`

Selected candidate:

`floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap`

Selected next action:

`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan`

Selected next file:

`packages/engine/src/post-v1-floor-open-box-eps-screed-field-companion-gate-bs-contract.test.ts`

## Why This Is The Highest-ROI Next Step

The finished open-box timber package lanes already calculate owned lab
anchors:

- dry gypsum-fiber package-transfer: `Ln,w 50.8`, `CI,50-2500 3.3`,
  `Rw 66`;
- EPS/screed hybrid package: `Ln,w 47`, `CI,50-2500 1`, `Rw 72`.

The remaining usage gap has one correctness part and one coverage part.
Dry gypsum-fiber package-transfer mixed requests calculate
`L'n,w 52.8`, `L'nT,w 50.4`, and `L'nT,50 53.7`, but field-only
requests currently publish a mismatched `46.7` / `44.3` / `48.1` tuple
from a different anchor path. EPS/screed hybrid requests still leave
`L'n,w`, `L'nT,w`, and `L'nT,50` unsupported even when the lab anchor is
requested. Gate BS must align dry field-only values with the mixed
anchor path, apply the existing field-context adapter to the EPS/screed
field route, pin before/after numeric values, and keep exact rows first.

This is higher ROI than the alternatives because it opens core field
impact outputs for already-calculable finished floors without requiring
new source rows or unsafe metric aliases.

## Rejected Alternatives

- `floor.open_box_timber_finished_package.airborne_building_companion_gap`
  remains useful, but has higher semantic risk around `Rw` versus `Rw+C`
  and building airborne context; it should follow the field-impact
  companion.
- `floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap`
  remains accuracy work, but current residual policy still keeps partial
  and mixed staged rows outside runtime, so it is lower immediate
  coverage ROI.
- `floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap` remains
  important, but ASTM `IIC` / `AIIC` require complete ASTM E492/E1007
  band-curve ownership; ISO `Ln,w` / `CI` single numbers must not be
  aliased into ASTM ratings.

## Gate BS Acceptance

Gate BS must prove:

1. Dry gypsum-fiber open-box package-transfer field-only requests move
   from the mismatched `L'n,w 46.7` / `L'nT,w 44.3` / `L'nT,50 48.1`
   tuple to the mixed-request anchor tuple `L'n,w 52.8` /
   `L'nT,w 50.4` / `L'nT,50 53.7`.
2. EPS/screed hybrid open-box requests with explicit
   `impactFieldContext`, including field-only requests, calculate the
   same field companions from the owned `Ln,w 47` / `CI,50-2500 1` lab
   anchor.
3. The user does not have to request `Ln,w` to receive field outputs.
4. Missing `impactFieldContext` remains `needs_input`.
5. Exact TUAS rows remain rank-zero exact rows.
6. `R'w`, `DnT,w`, `IIC`, and `AIIC` remain separate owners unless a
   later selected gate explicitly owns them.

## Gate BS Closeout

Gate BS has now landed as:

`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan`

Gate BS status:

`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_landed_selected_next_numeric_coverage_gap_gate_bt`

This was runtime calculator coverage and correctness. Dry
package-transfer field-only requests now use the same owned
package-transfer anchor as mixed requests and calculate `L'n,w 52.8` /
`L'nT,w 50.4` / `L'nT,50 53.7`. EPS/screed hybrid requests with
explicit `impactFieldContext` now calculate `L'n,w 49` / `L'nT,w 46.6`
/ `L'nT,50 47.6` from the owned `Ln,w 47` / `CI,50-2500 1` lab anchor.

Missing `impactFieldContext` remains `needs_input`; `R'w`, `DnT,w`, and
ASTM `IIC` / `AIIC` remain separate owners.

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_bt_plan`
