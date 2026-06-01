# Post-V1 Gate BT Numeric Coverage And Accuracy Rerank Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BT is a no-runtime calculator-capability rerank after Gate BS. It
selects the next implementation slice only by calculator scope and
correctness: more realistic layer combinations must calculate owned
acoustic outputs when route-required inputs are present, or an existing
route must become more numerically defensible.

Gate BT explicitly rejects broad source crawling, finite scenario packs,
confidence wording, generic UI/report polish, storage/auth work, and
metric aliasing as the active slice.

## Selection

Gate BT has now landed as:

`post_v1_next_numeric_coverage_gap_gate_bt_plan`

Gate BT status:

`post_v1_next_numeric_coverage_gap_gate_bt_landed_no_runtime_selected_floor_open_box_finished_package_airborne_building_companion_gate_bu`

Selected candidate:

`floor.open_box_timber_finished_package.airborne_building_companion_gap`

Selected next action:

`post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan`

Selected next file:

`packages/engine/src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts`

## Why This Is The Highest-ROI Next Step

The finished open-box timber package lanes already calculate owned lab
airborne anchors:

- dry gypsum-fiber package-transfer: `Rw 66`;
- EPS/screed hybrid package: `Rw 72`, `C -1.3`;

The remaining usage/correctness gap is that complete building-only
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` requests can still use a
generic predictor or `screening_mass_law_curve_seed_v3` airborne basis
instead of the package anchor. Mixed lab-plus-building requests can find
the package anchor, but the requested lab companions are still marked
unsupported while the building metrics are published. Gate BU must use
the selected package `Rw` direct curve for the airborne building overlay
when complete `building_prediction` context is present.

This is higher ROI than residual package-transfer tightening because it
corrects a live wrong-anchor route for common finished floors. It is
higher ROI than ASTM `IIC` / `AIIC` work because it needs no new band
source rows and does not require unsafe ISO-to-ASTM aliasing.

## Rejected Alternatives

- `floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap`
  remains useful accuracy work, but it is narrower than correcting a
  live building-airborne path used by already-owned finished package
  stacks.
- `floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap` remains
  important, but ASTM `IIC` / `AIIC` require complete ASTM E492/E1007
  band-curve ownership; ISO `Ln,w` / `CI` single numbers must not be
  aliased into ASTM ratings.
- broad source crawling, finite scenario packs, confidence wording, and
  generic UI/report/storage work remain non-goals for the active
  calculator slice.

## Gate BU Acceptance

Gate BU must prove:

1. Dry package-transfer building-only `R'w` / `DnT,w` requests use the
   `broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor`
   `Rw 66` package anchor, not the generic
   `predictor_floor_system_family_archetype_estimate` basis.
2. EPS/screed hybrid building-only `R'w` / `DnT,w` requests use the
   `broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor`
   `Rw 72` package anchor, not `screening_mass_law_curve_seed_v3`.
3. Mixed package lab-plus-building requests keep calculable lab
   companions and building companions visible without forcing the user
   to request a workaround output set.
4. Missing `airborneContext.contextMode=building_prediction` and
   missing room/flanking inputs remain `needs_input`.
5. Impact field outputs and ASTM `IIC` / `AIIC` remain separate owners.
