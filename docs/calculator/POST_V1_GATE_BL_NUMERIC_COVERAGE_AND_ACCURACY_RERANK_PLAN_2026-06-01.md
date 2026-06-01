# Post-V1 Gate BL Numeric Coverage And Accuracy Rerank Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

Gate BL is a no-runtime selection gate after Gate BK. Its job is to
choose the next implementation that increases calculator scope or
numeric correctness for user-entered wall/floor layer combinations. It
must not select source crawling, finite scenario packs, confidence
wording, generic UI/report polish, storage/auth work, or unrelated
cleanup.

## External Method Check

The research check supports a field-companion slice, not metric aliasing:

- ISO 12354-2:2017 defines calculation models for estimating impact
  sound insulation between rooms, using direct/flanking element data and
  theoretical sound propagation methods. Source:
  https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/02/70243.html
- ISO 717-2:2020 defines single-number quantities for impact sound
  insulation from band measurements; this is why ISO `Ln,w` cannot be
  treated as ASTM `IIC` / `AIIC`. Source:
  https://www.iso.org/standard/69867.html
- INSUL is a professional reference point for layer-based prediction:
  it predicts airborne and impact performance for walls/floors/ceilings,
  including lightweight and timber floors, from construction inputs.
  Source:
  https://navcon.com/wp-content/uploads/2023/08/INSUL_v9_Brochure.pdf

## Current State From Gate BK

Gate BK landed as:

`post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan`

Gate BK status:

`post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl`

Gate BK opened raw-bare open-web steel field companions. The base-only
stack keeps lab `Ln,w 96`, `CI 1.8`, `CI,50-2500 5.2`, and `Ln,w+CI
97.8`; with explicit `impactFieldContext` it calculates `L'n,w 98`,
`L'nT,w 95.6`, and `L'nT,50 100.8`. Field-only requests derive the lab
anchor internally. Missing field context remains `needs_input`; building
prediction, open-box raw-bare field transfer, and ASTM `IIC` / `AIIC`
remain blocked.

Gate BK selected:

`post_v1_next_numeric_coverage_gap_gate_bl_plan`

## Gate BL Selection

Gate BL lands as:

`post_v1_next_numeric_coverage_gap_gate_bl_plan`

Gate BL selection status:

`post_v1_next_numeric_coverage_gap_gate_bl_landed_no_runtime_selected_floor_open_box_raw_bare_field_companion_gate_bl`

Selected candidate:

`floor.open_box_timber_raw_bare.field_companion_runtime_gap`

Selected next action:

`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan`

Selected next file:

`packages/engine/src/post-v1-floor-open-box-raw-bare-field-companion-gate-bl-contract.test.ts`

Selected next label:

post-V1 floor open-box raw-bare field companion Gate BL

## Why This Is Highest ROI

This directly increases calculable scope. Current raw-bare open-box
timber stacks already own lab impact anchors through
`broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor`,
but the same explicit field-context adapter used by Gate BK is not yet
applied to this family.

The selected slice is low-risk because it does not invent a formula. It
uses the existing `impactFieldContext` route: lab `Ln,w` plus explicit
field `K` and receiving-room volume, then `CI,50-2500` for low-frequency
standardized field output.

It is also accuracy-positive: it prevents the next agent from filling
the gap by aliasing lab `Ln,w` to field/building values or ASTM ratings.
Field apparent outputs move only when their inputs are present; building
prediction and ASTM remain blocked.

## Required Gate BL Runtime Acceptance

Gate BL must prove before/after value movement for open-box raw-bare
field impact:

- before: 220 mm `open_box_timber_slab` with field context supports only
  lab `Ln,w 91.1`; `L'n,w`, `L'nT,w`, `L'nT,50`, and `IIC` are stopped;
- after: 220 mm `open_box_timber_slab`, `fieldKDb 2`, and receiving
  room volume `55 m3` calculate `L'n,w 93.1`, `L'nT,w 90.7`, and
  `L'nT,50 94.1`;
- after: 370 mm `open_box_timber_slab`, `fieldKDb 2`, and receiving
  room volume `55 m3` calculate `L'n,w 90.2`, `L'nT,w 87.8`, and
  `L'nT,50 90.9`;
- field-only requests must derive the lab anchor internally, as Gate BK
  does for open-web steel;
- missing `impactFieldContext` must remain `needs_input`;
- `building_prediction` must remain stopped until a direct/flanking
  building owner exists;
- `IIC` / `AIIC` must remain unsupported unless complete ASTM
  E492/E989 or E1007 ownership is added in a separate gate;
- Gate BK open-web pins must remain unchanged: `L'n,w 98`, `L'nT,w
  95.6`, and `L'nT,50 100.8`.

Implementation surfaces:

- `packages/engine/src/open-box-timber-raw-bare-estimate.ts`: add the
  field output requests to the runtime target set and make field-only
  requests request the lab anchor internally;
- `packages/engine/src/impact-lane.ts`: allow
  `applyImpactFieldContextToImpact` for
  `OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS` when context mode is not
  `building_prediction`, with direct flanking skipped as in Gate BK;
- `packages/engine/src/post-v1-floor-open-box-raw-bare-field-companion-gate-bl-contract.test.ts`:
  pin before/after outputs and negative boundaries;
- `tools/dev/run-calculator-current-gate.ts`: include the Gate BL
  runtime contract.

## Gate BL Runtime Closeout

Gate BL runtime has now landed as:

`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan`

Gate BL runtime status:

`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_landed_selected_next_numeric_coverage_gap_gate_bm`

This is runtime calculator coverage. The raw-bare open-box timber
formula lane already calculated lab anchors; it now applies the existing
explicit `impactFieldContext` adapter when context mode is not
`building_prediction`.

Pinned 220 mm raw-bare open-box field result:

- lab anchor remains `Ln,w 91.1`, `CI -0.9`, `CI,50-2500 3.4`, and
  `Ln,w+CI 90.2`;
- with `fieldKDb 2` and receiving room volume `55 m3`, it calculates
  `L'n,w 93.1`, `L'nT,w 90.7`, and `L'nT,50 94.1`.

Pinned 370 mm raw-bare open-box field result:

- lab anchor remains `Ln,w 88.2`, `CI,50-2500 3.1`;
- with `fieldKDb 2` and receiving room volume `55 m3`, it calculates
  `L'n,w 90.2`, `L'nT,w 87.8`, and `L'nT,50 90.9`.

Field-only requests derive the lab anchor internally. Missing
`impactFieldContext` still stops the field outputs as `needs_input`;
building prediction and ASTM `IIC` / `AIIC` remain blocked.

Validation after Gate BL runtime: `pnpm calculator:gate:current` passed
with engine 576 files / 3189 tests, web 113 files / 437 passed + 18
skipped, repo build 5 / 5, and whitespace guard passed.

Gate BL selected next action:

`post_v1_next_numeric_coverage_gap_gate_bm_plan`

## Ranked Later Work

1. `floor.raw_bare_open_web.building_prediction_owner_gap`
   - High eventual value, but not selected now because ISO 12354-style
     building prediction needs direct/flanking ownership. Field outputs
     must not be relabelled as `R'w` / `DnT,w`.

2. `floor.open_box_timber_raw_bare.building_prediction_owner_gap`
   - Same building-owner problem as open-web. It should follow after the
     lower-risk open-box field companion lands.

3. `floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap`
   - Useful for ASTM coverage, but requires complete ASTM E492/E989 or
     E1007 band/contour ownership. ISO `Ln,w` / `CI` cannot create
     `IIC` / `AIIC`.

4. `floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap`
   - Accuracy tightening for finished open-box package estimates. It is
     not the immediate coverage blocker because raw-bare field outputs
     currently do not calculate at all.

Blocked as active calculator progress:

- broad source-row crawl without a selected calculation owner;
- finite scenario packs that do not widen formula routing;
- low-confidence wording or confidence-surface work;
- generic UI/report/storage/auth work unrelated to the selected
  calculator route.
