# Post-V1 Gate BN Numeric Plausibility And Calibration Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BN is an accuracy gate after Gate BM. Its job is to prevent the
calculator from publishing physically suspicious source-absent field or
building values just because a route happens to be executable.

This is calculator work because it improves numeric correctness,
formula-route selection, and metric/basis boundaries for layer
combinations that already calculate. It is not source crawling,
confidence wording, finite scenario work, generic UI/report polish,
storage/auth work, or a catalog expansion.

Selected action:

`post_v1_next_numeric_coverage_gap_gate_bn_plan`

Selected file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bn-contract.test.ts`

Selected candidate:

`calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes`

## Landed Action

Gate BN has now landed as:

`post_v1_next_numeric_coverage_gap_gate_bn_plan`

Gate BN status:

`post_v1_next_numeric_coverage_gap_gate_bn_landed_no_runtime_selected_floor_open_box_raw_bare_building_prediction_owner_gate_bo`

Gate BN is no-runtime accuracy work. It adds an executable
source-absent field/building plausibility matrix and keeps the corrected
`L'n,w 112.1` severe direct/flanking case blocked behind the `12 dB`
uplift guard.

Selected next candidate:

`floor.open_box_timber_raw_bare.building_prediction_owner_gap`

Selected next action:

`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`

Selected next file:

`packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts`

## Gate BO Closeout

Gate BO has now landed as:

`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`

Gate BO status:

`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_landed_runtime_selected_next_numeric_coverage_gap_gate_bp`

Gate BO is runtime calculator coverage for:

`floor.open_box_timber_raw_bare.building_prediction_owner_gap`

The 220 mm raw-bare open-box carrier with explicit direct+flanking
`impactFieldContext` now calculates `L'n,w 92.9`, `L'nT,w 90.5`, and
`L'nT,50 93.9` under `contextMode=building_prediction`. The 370 mm
carrier calculates `L'n,w 90`, `L'nT,w 87.6`, and `L'nT,50 90.7`.

Simple `fieldKDb`, severe source-absent direct+flanking uplift, `R'w`,
`DnT,w`, lab `Ln,w`, and ASTM `IIC` / `AIIC` remain blocked.

Gate BO selected next action:

`post_v1_next_numeric_coverage_gap_gate_bp_plan`

Gate BO selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bp-contract.test.ts`

## External Method Check

The research check changes the next priority from "open the next
runtime gap immediately" to "prove the currently open source-absent
field/building routes cannot publish outliers".

- ISO 12354-1:2017 and ISO 12354-2:2017 both describe building acoustic
  prediction from element performance using direct/indirect flanking
  data and theoretically derived structural propagation methods. They
  also distinguish detailed frequency-band models from restricted
  single-number simplified models. Sources:
  https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/02/70242.html
  and
  https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/02/70243.html
- Approved Document E uses field metrics for separating constructions:
  new-build floors/stairs have `L'nT,w` maximum `62 dB`, and material
  change-of-use floors/stairs have `64 dB`. Source:
  https://assets.publishing.service.gov.uk/media/5a809c4fe5274a2e87dbacb9/ADE_LOCKED.pdf
- INSUL treats `Ln,w` as an ISO 717-2 impact rating from one-third
  octave normalized impact sound pressure levels, with higher values
  meaning worse impact insulation. It also states that `IIC` and `Ln,w`
  should not be compared directly, and records typical impact prediction
  agreement around `+/- 3-6 Ln,w/IIC` points for many massive/lightweight
  supported constructions. Source:
  https://www.insul.co.nz/media/15677/Insul-Manual-2014-word-version.pdf
- Measured timber evidence confirms that very poor raw-bare timber
  floors can sit around the high-80s for `Ln,w`, while finished floating
  assemblies can improve dramatically. A hollow-box timber floor study
  reports a span from `Rw 35 / Ln,w 85` for a bare empty-cavity floor to
  `Rw 61 / Ln,w 50` for a floating floor on elastic units with gravel in
  the cavity. Source:
  https://journals.sagepub.com/doi/10.1177/1351010X221100604
- A CLT laboratory measurement study reports a reference CLT floor
  around `Rw 32 / Ln,w 86` and impact improvements up to roughly `32 dB`
  from resilient/floating configurations. Source:
  https://www.mdpi.com/2076-3417/12/15/7642

Interpretation for DynEcho: raw-bare `Ln,w` values in the `90-100`
range can be plausible for deliberately unfinished/lightweight carrier
states, but they are not normal finished-building performance. A
source-absent single-number continuation from that raw-bare anchor must
not add another large direct/flanking uplift without exact path, band, or
holdout evidence.

## Implementation Comparison

Current implementation facts after Gate BM:

- raw-bare open-web steel 300 mm calculates lab `Ln,w 96`,
  `CI 1.8`, `CI,50-2500 5.2`, and field companions `L'n,w 98`,
  `L'nT,w 95.6`, `L'nT,50 100.8` when explicit field context is
  present;
- raw-bare open-web steel 300 mm now calculates building impact
  direct+flanking outputs `L'n,w 97.8`, `L'nT,w 95.4`, and
  `L'nT,50 100.6` only when explicit direct/flanking owners are present;
- the earlier synthetic `L'n,w 112.1` acceptance pin is now blocked by a
  source-absent single-number direct/flanking uplift guard above `12 dB`;
- raw-bare open-box timber 220 mm calculates lab `Ln,w 91.1` and field
  companions `L'n,w 93.1`, `L'nT,w 90.7`, `L'nT,50 94.1`, but building
  prediction remains blocked;
- lower-treatment, mixed-support, and C11c impact lanes publish much
  lower field values only when their own owners and physical inputs are
  present;
- ASTM `IIC` / `AIIC` remain unsupported unless ASTM E492/E1007/E989
  route ownership exists.

The remaining risk is not that one formula is missing. The risk is that
the calculator has several source-absent single-number field/building
continuations, and only Gate BM currently has an explicit severe-uplift
regression. Gate BN must make that protection systematic.

## Gate BN Acceptance

Gate BN must land a focused contract and, where needed, runtime guards
that prove the current calculator values are admissible:

1. Enumerate active source-absent floor-impact field/building routes,
   including open-web raw-bare, open-box raw-bare, lower-treatment,
   mixed-support, explicit `DeltaLw`, C11c weighted tuple, and local
   guide/bound lanes.
2. Pin each route's lab anchor, field/building outputs, metric basis,
   error budget, and stopped aliases in one plausibility matrix.
3. Keep raw-bare `Ln,w > 90` admissible only when the route is explicitly
   raw-bare/source-absent, carries a formula error budget, and does not
   claim compliance-style finished-building performance.
4. Require every source-absent `L'n,w` continuation to expose its uplift
   over the lab `Ln,w` anchor. Uplifts above `12 dB` stay blocked unless
   exact impact-band or path-specific evidence exists.
5. Require every `L'nT,w` and `L'nT,50` continuation to show the
   room-volume and `CI,50-2500` owners that created it. Missing
   `CI,50-2500` may stop only `L'nT,50`; it must not silently invent
   low-frequency output.
6. Split direct/flanking path input semantics if needed: a measured or
   user-owned `levelOffsetDb` must not be double-counted with heuristic
   path, junction, isolation, and short-circuit modifiers unless that
   additive basis is explicit in the owner fields.
7. Confirm wall airborne building routes still keep `Rw`, `R'w`,
   `DnT,w`, and `DnT,A` basis boundaries separate; floor impact building
   routes must not publish `R'w` or `DnT,w`.
8. Confirm ISO `Ln,w` / `L'n,w` never creates ASTM `IIC` / `AIIC`
   without the ASTM contour/band route owner.

## Implementation Surfaces

- `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bn-contract.test.ts`:
  add the matrix and selection contract.
- `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bn.ts`:
  rank Gate BN as the selected accuracy slice and reject non-calculator
  alternatives.
- `packages/engine/src/impact-direct-flanking.ts`: preserve the Gate BM
  severe-uplift stop and tighten direct/flanking offset semantics if the
  matrix exposes another double-count path.
- `packages/engine/src/impact-field-context.ts` and
  `packages/engine/src/impact-lane.ts`: keep building prediction from
  falling back to simple `fieldKDb` when direct/flanking evidence is not
  admissible.
- `tools/dev/run-calculator-current-gate.ts`: include the Gate BN
  contract after it lands.

## Ranked Follow-Ups After BN

Gate BN decides the next value-moving slice from evidence, not from the
old handoff chain:

1. If the matrix is green and direct/flanking semantics are safe:
   `floor.open_box_timber_raw_bare.building_prediction_owner_gap`.
   This increases scope by opening building impact outputs for open-box
   raw-bare carriers with explicit direct/flanking owners.
2. If the matrix finds direct/flanking single-number risk:
   land the direct/flanking owner-basis correction first, then rerun
   open-web/open-box building predictions.
3. If ASTM exact-band evidence is more executable than building
   direct/flanking calibration:
   `floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap`, but only
   with E492/E1007/E989 band/contour ownership and no ISO aliasing.
4. If raw-bare lab anchors remain the largest error source:
   `floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap`
   or source-owned holdout calibration for the raw-bare formula corridor.

Blocked as active calculator progress:

- broad source-row crawl without a selected calculation owner;
- finite scenario packs;
- low-confidence wording or confidence-surface work;
- generic UI/report/storage/auth work unrelated to a selected
  calculator route.
