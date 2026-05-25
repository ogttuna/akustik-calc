# Calculator Source Of Truth

Last reviewed: 2026-05-25

Document role: this is the first document to read before any acoustic
calculator implementation, planning, or handoff work. It defines the
product goal, the current implementation status, and the only acceptable
direction for future slices.

If this file conflicts with an older checkpoint, slice plan, roadmap, or
"selected next" handoff, this file wins. Historical files remain useful
for facts about what landed, but they do not select the next work.

## Product Goal

DynEcho must be a usable acoustic calculator, not a source catalog,
finite scenario library, or research notebook.

The user chooses `wall` or `floor`, enters the layer materials, order,
thicknesses, requested outputs, and the physical/context inputs required
by that route. DynEcho then calculates every owned output it can
defensibly calculate, including `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`,
`L'nT,w`, STC, `C`, `Ctr`, `CI`, `CI,50-2500`, and related values.

The engine must choose the right acoustic family and formula for the
submitted combination. When the exact measured value is already owned
for the same stack, topology, metric, and basis, that exact value wins.
When a measured row is physically similar enough, it may anchor or
calibrate a prediction only through a named algorithm with matching
topology, metric scope, and basis. When no source row exists, DynEcho
must still calculate through the best owned family-specific model if the
required physical inputs are present.

Missing physical input is not permission to guess. It must return
`needs_input` with exact missing fields. Unsupported metric/basis
requests must return `unsupported` with the missing owner or standard.

## Non-Negotiable Answer Order

Every published answer must follow this order:

1. exact measured answer for the same stack, topology, metric, and basis;
2. compatible measured anchor when topology and metric scope allow it;
3. calibrated family formula;
4. source-absent family formula;
5. `needs_input` with exact missing physical fields;
6. `unsupported` with the missing basis, route, or standard owner.

Diagnostic curves, screening values, catalog hints, or helper lanes may
exist internally. They are not user-facing answers unless the selected
candidate owns the route, basis, metric set, required inputs, support
bucket, origin, and value pins.

## Metric And Basis Boundaries

Do not casually alias metrics or bases:

- lab `Rw` is not field `R'w`;
- `Rw` is not STC unless a selected owner explicitly owns that display;
- `Ln,w` is not IIC;
- lab impact is not field impact;
- field/apparent values are not building-prediction values;
- `DnT,A` / `DnT,A,k` evidence does not become `R'w` / `DnT,w` unless a
  selected adapter owns that conversion.

Mixed requests may publish only the outputs owned by the selected
candidate or by explicitly selected companion candidates. Stopped
outputs must remain visible as `needs_input` or `unsupported`.

## Current Implementation Status

Company-internal usable V1 is closed for the current tested envelope.
The binding V1 acceptance contract remains
[USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md), and its
Steps 0-5 are closed.

Current implementation facts:

- the answer-engine V1 contract exists in
  `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`;
- the company-internal acceptance gate exists in
  `packages/engine/src/acoustic-calculator-company-internal-usable-v1-acceptance-gate-contract.test.ts`;
- the shared resolver surface has 35 declared candidates and 32 active
  runtime-basis mappings;
- cards, answer charts, API payloads, Markdown reports, saved replay,
  server snapshot replay, and resolver traces are expected to show the
  same selected answer basis and stopped-output state;
- the latest documented full gate, after Gate N on 2026-05-25, passed
  `pnpm calculator:gate:current` with engine 525 files / 2969 tests,
  web 95 files / 402 passed + 18 skipped, repo build 5 / 5, and
  whitespace guard passed.

There is no open usable V1 acceptance step. Future work must be selected
as a post-V1 product slice.

Current selected post-V1 plan:
[POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md).

Latest landed post-V1 action:

`post_v1_calculator_capability_roi_confirmation_gate_0_plan`

Latest landed post-V1 file:

`packages/engine/src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts`

Selection status:

`post_v1_calculator_capability_roi_confirmation_gate_0_landed_selected_wall_multileaf_gate_a`

Previously landed Gate A action:

`post_v1_wall_multileaf_generalized_formula_gate_a_input_owner_and_gap_matrix_plan`

Previously landed Gate A file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts`

Gate A selection status:

`post_v1_wall_multileaf_generalized_formula_gate_a_landed_no_runtime_selected_gate_b_runtime_corridor`

Previously landed Gate B action:

`post_v1_wall_multileaf_generalized_formula_gate_b_runtime_corridor_plan`

Previously landed Gate B file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts`

Gate B selection status:

`post_v1_wall_multileaf_generalized_formula_gate_b_landed_selected_gate_c_surface_parity_and_guided_inputs`

Previously landed Gate C action:

`post_v1_wall_multileaf_generalized_formula_gate_c_surface_parity_and_guided_inputs_plan`

Previously landed Gate C file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts`

Gate C selection status:

`post_v1_wall_multileaf_generalized_formula_gate_c_landed_selected_gate_d_compatible_anchor_delta`

Latest landed post-V1 implementation action:

`post_v1_wall_compatible_anchor_delta_gate_d_plan`

Latest landed post-V1 implementation file:

`packages/engine/src/post-v1-wall-compatible-anchor-delta-gate-d-contract.test.ts`

Gate D selection status:

`post_v1_wall_compatible_anchor_delta_gate_d_landed_selected_gate_e_floor_or_wall_next_formula_gap`

Landed Gate E action:

`post_v1_floor_or_wall_next_formula_gap_gate_e_plan`

Landed Gate E file:

`packages/engine/src/post-v1-floor-or-wall-next-formula-gap-gate-e-contract.test.ts`

Gate E selection status:

`post_v1_floor_or_wall_next_formula_gap_gate_e_landed_selected_gate_f_floor_astm_iic_aiic_contour_runtime`

Latest landed runtime action:

`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_plan`

Latest landed runtime file:

`packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts`

Gate F selection status:

`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_landed_selected_surface_parity_or_next_floor_formula_gap`

Latest landed surface action:

`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_plan`

Latest landed surface file:

`packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts`

Gate G selection status:

`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_landed_selected_gate_h_floor_formula_expansion`

Latest landed floor formula-expansion action:

`post_v1_floor_formula_expansion_gate_h_plan`

Latest landed floor formula-expansion file:

`packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts`

Previously selected label:

post-V1 floor formula expansion Gate H

Gate H selection status:

`post_v1_floor_formula_expansion_gate_h_landed_selected_gate_i_floor_formula_gap_refresh`

Landed Gate I action:

`post_v1_floor_formula_gap_refresh_gate_i_plan`

Landed Gate I file:

`packages/engine/src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts`

Previously selected label:

post-V1 floor formula gap refresh Gate I

Gate I selection status:

`post_v1_floor_formula_gap_refresh_gate_i_landed_no_runtime_selected_gate_j_reinforced_concrete_combined_resolver`

Gate I selected next action:

`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan`

Gate I selected next file:

`packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts`

Gate I selected next label:

post-V1 floor reinforced-concrete combined resolver Gate J

Landed Gate J action:

`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan`

Landed Gate J file:

`packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts`

Gate J selection status:

`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_landed_selected_gate_k_timber_clt_delta_lw_resolver`

Gate J selected Gate K label:

post-V1 floor timber/CLT DeltaLw resolver Gate K

Landed Gate K action:

`post_v1_floor_timber_clt_delta_lw_resolver_gate_k_plan`

Landed Gate K file:

`packages/engine/src/post-v1-floor-timber-clt-delta-lw-resolver-gate-k-contract.test.ts`

Gate K selection status:

`post_v1_floor_timber_clt_delta_lw_resolver_gate_k_landed_selected_gate_l_composite_panel_family_solver_owner`

Gate K selected Gate L action:

`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan`

Gate K selected Gate L file:

`packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts`

Gate K selected Gate L label:

post-V1 floor composite-panel family solver owner Gate L

Landed Gate L action:

`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan`

Landed Gate L file:

`packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts`

Gate L selection status:

`post_v1_floor_composite_panel_family_solver_owner_gate_l_landed_selected_gate_m_lightweight_concrete_family_solver_owner`

Gate L selected Gate M action:

`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan`

Gate L selected Gate M file:

`packages/engine/src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts`

Gate L selected Gate M label:

post-V1 floor lightweight-concrete family solver owner Gate M

Gate A was selected by measurable Gate 0 ROI and closed the no-runtime
input owner/gap matrix. Gate B expanded owned calculator coverage for
complete grouped Rockwool wall multileaf element-lab `Rw`, STC, `C`,
and `Ctr` by routing the existing
`triple_leaf_two_cavity_frequency_solver` through the shared resolver
candidate surface, while preserving `needs_input` for missing topology.
Gate C made that runtime path visible across workbench/API/report
surfaces and guided input flow: mixed lab+field requests keep lab value
pins live on
`candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver`
while `R'w` and `DnT,w` stop with exact missing field inputs. Gate D
then added the first wall compatible measured-anchor delta: the Knauf
LSF exact `Rw 55` row can now anchor a same-side added acoustic-board
delta and publish `Rw 57` with a `+/-5 dB` not-measured budget, while
STC, `C`, and `Ctr` remain unsupported unless separately owned. Gate E
then selected ASTM `IIC` / `AIIC` as the next highest-ROI exact-band
runtime gap. Gate F now calculates complete ASTM E492 lab bands into
`IIC` and complete ASTM E1007 field bands into `AIIC` through the ASTM
E989 contour bridge, while ISO `Ln,w` rows and incomplete ASTM curves
remain unsupported for ASTM ratings. Gate G closed surface parity for
that rating path across cards, answer chart, report, API payloads,
resolver trace, and metric-basis provenance. Gate H then increased
floor formula coverage by mapping existing lightweight-steel upper/lower
mass-spring and suspended-ceiling-only source-absent floor formulas into
the shared resolver and answer-engine surface. Complete upper/lower
steel now publishes `Ln,w 51.6` / `DeltaLw 22.4`; suspended-only steel
publishes `Ln,w 62.2`, while `DeltaLw` without a complete upper package
remains unsupported/needs owner inputs and ASTM/field aliases remain
blocked. Gate I refreshed the next floor formula
gap and selected Gate J: the existing reinforced-concrete combined
upper/lower formula already calculates lab `Ln,w 58.1` / `DeltaLw 13.7`
on `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`,
but still needed shared resolver/answer-engine ownership. Gate J now
maps that route through
`floor.heavy_concrete_combined_upper_lower.lab_impact_formula`;
complete requests publish `Ln,w 58.1` / `DeltaLw 13.7`, `IIC` /
`AIIC` remain unsupported ASTM boundaries, and missing `loadBasisKgM2`
or `ceilingOrLowerAssembly` stops as `needs_input`. Gate K now maps the
existing timber-joist and mass-timber CLT `DeltaLw` formula corridors
through `floor.timber_joist.delta_lw_formula` and
`floor.mass_timber_clt.delta_lw_formula`; timber joist publishes
`DeltaLw 25.2`, CLT publishes `DeltaLw 22.6`, exact or published
`Ln,w` companions remain separate, missing timber/CLT physical inputs
stop as `needs_input`, and ASTM/field aliases remain blocked. Gate L now
maps the existing composite-panel published interaction runtime through
`floor.composite_panel.published_interaction_family_solver`; dry floating
publishes `Ln,w 69.4 / Rw 45.1`, suspended ceiling publishes
`Ln,w 63.3 / Rw 48.6`, and combined upper/lower publishes
`Ln,w 48.5 / Rw 60.6`. Composite `DeltaLw`, ASTM, and field aliases
remain blocked until separate owners exist. Gate M now maps the
lightweight-concrete family path through
`floor.lightweight_concrete.family_solver_owner` on
`predictor_lightweight_concrete_family_estimate`: visible lightweight
floating floor publishes `Ln,w 64.3 / Rw 53`, and low-density predictor
input publishes `Ln,w 47 / Rw 49`. Lightweight-concrete `DeltaLw`, ASTM,
and field aliases remain blocked until separate owners exist. Gate M action
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan`
landed with status
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_landed_selected_gate_n_floor_field_building_expansion`.
Gate N now
maps the generalized floor impact field-context adapter through
`floor.impact_field_context.field_building_adapter` on
`source_absent_field_building_adapter_error_budget`: dynamic
lightweight-concrete field requests with a live lab `Ln,w` anchor plus
`impactFieldContext.fieldKDb` and
`impactFieldContext.receivingRoomVolumeM3` publish
`L'n,w 66.3 / L'nT,w 63.9`. Missing field-impact context stops as
`needs_input` with `impactFieldContext` and `receivingRoomVolumeM3`;
building prediction and ASTM `IIC` / `AIIC` aliases remain blocked. The shared resolver surface now has 35 declared candidates and 32 active runtime-basis mappings.
This is not source crawling, confidence wording, docs-only work, or a
finite scenario pack.

Latest landed runtime action:

`post_v1_floor_field_building_expansion_gate_n_plan`

Latest landed runtime file:

`packages/engine/src/post-v1-floor-field-building-expansion-gate-n-contract.test.ts`

Gate N selection status:

`post_v1_floor_field_building_expansion_gate_n_landed_selected_gate_o_input_surface_guided_physical_fields`

Previous selected label:

post-V1 floor field/building expansion Gate N

Selected next action:

`post_v1_input_surface_guided_physical_fields_gate_o_plan`

Selected next file:

`packages/engine/src/post-v1-input-surface-guided-physical-fields-gate-o-contract.test.ts`

Selected next label:

post-V1 input-surface guided physical fields Gate O

Latest Gate N validation is green. Full `pnpm calculator:gate:current`
passed on 2026-05-25 with engine 525 files / 2969 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

## Allowed Next-Slice Families

Select the next implementation explicitly from calculator capability
gaps, not from old selected-next chains. Acceptable post-V1 slice
families include:

- expanded formula coverage for realistic wall and floor combinations;
- adapters that turn already-owned runtime values into traceable,
  basis-correct answers;
- measured holdout calibration and error-budget improvement;
- UI input ergonomics for route/formula-required physical fields;
- source row promotion only as exact overrides, compatible anchors,
  calibration evidence, holdouts, or bounds;
- building/field prediction expansion only when direct, flanking,
  junction, room, and standard owners are explicit.

Blocked default moves:

- broad source crawling as the next step;
- finite scenario packs as a substitute for formula coverage;
- confidence wording, tolerance retune, or marketing copy without
  behavior movement;
- metric alias promotion without an owned standard/adapter;
- deleting, bypassing, or hiding existing solver lanes instead of
  routing them through selected answer candidates.

## INSUL Benchmark

INSUL is the category benchmark to beat: public official material
describes it as a quick prediction tool for walls, floors, and ceilings,
with construction selection, one-third-octave transmission-loss graphs,
STC/Rw airborne predictions, IIC/Ln,w impact predictions, and single,
double, triple, and quad system modelling.

DynEcho should learn the product lesson, not copy proprietary equations,
assets, or data. The lesson is:

- users need a fast working calculator, not a pile of source rows;
- formula families, input ownership, and visible limits matter;
- exact measurements are valuable, but they do not replace prediction
  for unbounded layer combinations;
- model depth and real-world input ergonomics are the bar for becoming
  the best acoustic calculator.

Relevant public sources:

- https://www.insul.co.nz/
- https://www.insul.co.nz/tech-info/
- https://www.insul.co.nz/download/
- https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf

## Agent Protocol

Before implementation:

1. read this file;
2. read [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md) for
   the closed V1 contract and answer-order rules;
3. read [CURRENT_STATE.md](./CURRENT_STATE.md) for current stable facts;
4. read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
   only for the explicitly selected active slice.

If no post-V1 slice has been explicitly selected, do not infer one from
historical "selected next" text. First classify the proposed work as
calculator formula/adapters, calibration/holdout, UI input ergonomics,
source promotion, or blocked drift.

Final handoff must say:

- which calculator capability moved;
- which route, basis, metric, and candidate owns the moved answer;
- which tests prove value, boundary, trace, and UI/API/report parity;
- which acceptance gap remains.
