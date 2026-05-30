# Calculator Source Of Truth

Last reviewed: 2026-05-30

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
- the shared resolver surface has 39 declared candidates and 36 active runtime-basis mappings;
- cards, answer charts, API payloads, Markdown reports, saved replay,
  server snapshot replay, and resolver traces are expected to show the
  same selected answer basis and stopped-output state;
- the latest documented full gate, after Gate BF on 2026-05-27, passed
  `pnpm calculator:gate:current` with engine 569 files / 3155 tests,
  web 112 files / 435 passed + 18 skipped, repo build 5 / 5, and
  whitespace guard passed.
- the latest landed slice is Gate BF floor suspended-ceiling
  lower-treatment field companion:
  `post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
  with status
  `post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_landed_selected_next_numeric_coverage_gap_gate_bg`.
  This is runtime coverage movement: assembly field-only lower-treatment
  requests now calculate the already-owned field adapter values from the
  same source-absent lab anchor. The acoustic-hanger stack pins
  `L'n,w 47.6 / L'nT,w 44.8 / L'nT,50 48.8`; the resilient-stud stack
  pins `L'n,w 46.6 / L'nT,w 43.8 / L'nT,50 47.8`. Missing
  `impactFieldContext.ci50_2500Db` still stops only `L'nT,50`, and ASTM
  `IIC` / `AIIC` aliases remain unsupported. Gate BG numeric coverage
  rerank is selected next:
  `post_v1_next_numeric_coverage_gap_gate_bg_plan`
  in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts`.
- the previous landed slice was Gate BE next numeric coverage gap:
  `post_v1_next_numeric_coverage_gap_gate_be_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_be_landed_no_runtime_selected_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf`.
  It selected
  `floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap`
  because it directly increases supported outputs (`L'n,w`, `L'nT,w`,
  `L'nT,50`) for the just-landed lower-treatment formula lane without
  source-row crawling or confidence wording work. Gate BE selected
  `post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
  in
  `packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf-contract.test.ts`.
- the previous landed slice was Gate BD floor suspended-ceiling
  lower-treatment coverage refresh:
  `post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
  with status
  `post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_be`.
  Acoustic-hanger, resilient-stud, and impact-only lower-treatment rows
  are now counted as source-absent family-physics coverage with pins
  `Ln,w 45.6` / `DeltaLw 28.9` and `Ln,w 44.6` / `DeltaLw 29.9`.
  Missing load basis, missing lower assembly, and ASTM `IIC` / `AIIC`
  remain value-less boundaries. Gate BE numeric coverage rerank is
  selected next:
  `post_v1_next_numeric_coverage_gap_gate_be_plan`
  in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts`.
- the previous landed slice was Gate BC floor suspended-ceiling
  lower-treatment surface parity:
  `post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`
  with status
  `post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_landed_selected_coverage_refresh_gate_bd`.
  Workbench cards, Markdown report, saved replay, estimate API,
  impact-only API, and resolver trace expose the same layer-derived
  lower-treatment answer. Gate BC selected
  `post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
  in
  `packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts`.
- the previous landed slice was Gate AU floor explicit-DeltaLw lab companion
  coverage:
  `post_v1_floor_explicit_deltalw_lab_companion_gate_au_plan`. It lets
  the explicit heavy-reference `DeltaLw` lane carry explicit lab
  companion inputs: `CI`, `Ln,w+CI`, and `CI,50-2500`.
- the previous landed slice was Gate AT floor explicit-CI,50-2500 lab companion
  coverage:
  `post_v1_floor_explicit_ci50_lab_companion_gate_at_plan`. It lets floor
  impact lanes that already own live `Ln,w` or conservative `Ln,w` upper
  bound and receive explicit user `CI,50-2500` calculate `CI,50-2500`
  without requiring field K, Hd, receiving-room volume, small-room
  toggle, or `CI`. Pinned values are hollow-core vinyl `Ln,w 48`,
  `CI,50-2500 +4`; heavy concrete `Ln,w 50`, `CI,50-2500 +4`; steel
  fallback `Ln,w 58`, `CI,50-2500 +4`; open-web / UBIQ 300 bound
  `Ln,w <= 51`, `CI,50-2500 +4`; UBIQ 200 bound `Ln,w <= 53`,
  `CI,50-2500 +4`; and UBIQ 250 bound `Ln,w <= 52`,
  `CI,50-2500 +4`. `CI`, `Ln,w+CI`, field outputs `L'n,w`, `L'nT,w`,
  `L'nT,50`, and ASTM `IIC` / `AIIC` remain blocked.
- the previous landed slice was Gate AS floor explicit-CI lab companion
  coverage:
  `post_v1_floor_explicit_ci_lab_companion_gate_as_plan`. It lets floor
  impact lanes that already own live `Ln,w` or conservative `Ln,w` upper
  bound and receive explicit user `CI` calculate `CI` and `Ln,w+CI`
  without requiring field K, Hd, receiving-room volume, small-room
  toggle, or `CI,50-2500`.
- the earlier landed slice was Gate AR floor small-room `CI,50-2500`
  low-frequency coverage:
  `post_v1_floor_small_room_ci50_low_frequency_gate_ar_plan`. It lets
  floor impact lanes that already calculate `L'nT,w` through the
  explicit Turkish small-room guide and receive explicit `CI,50-2500`
  calculate `L'nT,50 = L'nT,w + CI,50-2500`.

There is no open usable V1 acceptance step. Future work must be selected
as a post-V1 product slice.

Current selected post-V1 plan:
[POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md).

Current reconciliation checkpoint:
[CHECKPOINT_2026-05-30_POST_V1_GATE_BF_STATE_RECONCILIATION.md](./CHECKPOINT_2026-05-30_POST_V1_GATE_BF_STATE_RECONCILIATION.md).

Latest landed post-V1 numeric value-moving coverage action:

`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`

Latest landed post-V1 numeric coverage file:

`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf-contract.test.ts`

Gate BF selection status:

`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_landed_selected_next_numeric_coverage_gap_gate_bg`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_bg_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts`

Latest landed no-runtime selection action:

`post_v1_next_numeric_coverage_gap_gate_be_plan`

Latest landed no-runtime selection file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts`

Gate AW direction plan:

[POST_V1_GATE_AW_DIRECTION_ANALYSIS_AND_PLAN_2026-05-27.md](./POST_V1_GATE_AW_DIRECTION_ANALYSIS_AND_PLAN_2026-05-27.md)

Gate AZ numeric coverage plan:

[POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md](./POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md)

Earlier Gate AY evidence remains recorded for closed-gate continuity:
`post_v1_floor_tuas_c11c_iso_impact_gate_ay_plan` with status
`post_v1_floor_tuas_c11c_iso_impact_gate_ay_landed_selected_next_numeric_coverage_gap_gate_az`
selected `post_v1_next_numeric_coverage_gap_gate_az_plan` for
`floor-tuas-c11c-fail-closed`. It pins `Ln,w 59`, `CI 1`,
`CI,50-2500 1`, `Ln,w+CI 60`, and field `L'nT,50 60.2` on
`tuas_c11c_visible_iso_weighted_impact_tuple_guarded`.

Gate BF landed runtime field-companion coverage for the suspended-ceiling
lower-treatment floor lane. Assembly field-only lower-treatment now
calculates `L'n,w 47.6 / L'nT,w 44.8 / L'nT,50 48.8` for the
acoustic-hanger case and `L'n,w 46.6 / L'nT,w 43.8 / L'nT,50 47.8`
for the resilient-stud case. Missing `impactFieldContext.ci50_2500Db`
stops only `L'nT,50`, and ASTM `IIC` / `AIIC` remain unsupported. Gate
BG is selected next through `post_v1_next_numeric_coverage_gap_gate_bg_plan`;
do not drift into broad source crawling, confidence wording, finite
scenario packs, or no-runtime cartography gates.
Full `pnpm calculator:gate:current` passed after Gate BF with engine 569
files / 3155 tests, web 112 files / 435 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate BD has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_be`.
It is no-runtime coverage refresh: acoustic-hanger, resilient-stud, and
impact-only lower-treatment rows are now counted as source-absent
family-physics coverage with pins `Ln,w 45.6` / `DeltaLw 28.9` and
`Ln,w 44.6` / `DeltaLw 29.9`; missing load basis, missing lower
assembly, and ASTM `IIC` / `AIIC` remain value-less boundaries. The
remaining high-risk `floor.mixed_support_family.multi_family_solver_gap`
is carried forward for reranking. Gate BD selects
`post_v1_next_numeric_coverage_gap_gate_be_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts`.

Gate AZ has now landed as no-runtime numeric coverage selection:

`post_v1_next_numeric_coverage_gap_gate_az_plan`

Gate AZ selection status:

`post_v1_next_numeric_coverage_gap_gate_az_landed_no_runtime_selected_floor_dynamic_stiffness_load_basis_owner_gate_ba`

Gate AZ selected next action:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`

Gate AZ selected next file:

`packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts`

Gate AZ implementation comparison is documented in
[POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md](./POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md).
It records that Gate AZ ranks the existing floor-impact source-absent
gaps already visible in implementation:
`floor.material_owner_gap.dynamic_stiffness_load_basis`,
`floor.suspended_ceiling.lower_treatment_coupling_gap`, and
`floor.mixed_support_family.multi_family_solver_gap`. Gate AZ selected
dynamic stiffness / load basis ownership as Gate AZ+1, with
before/after output evidence required before any runtime movement.

Gate BA has now landed as no-runtime dynamic stiffness / load basis
owner contract:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`

Gate BA selection status:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_landed_no_runtime_selected_suspended_ceiling_lower_treatment_gate_bb`

Gate BA selected next action:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan`

Gate BA selected next file:

`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts`

Gate BA pins `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`
as no-default physical owner fields. Complete heavy floating inputs keep
the existing `Ln,w 48.7` / `DeltaLw 25.8` runtime; missing dynamic
stiffness or load basis cannot invent `DeltaLw`. The next selected
runtime-family target is suspended-ceiling lower-treatment coupling.

Gate BB has now landed as runtime coverage for that target:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan`

Gate BB selection status:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_landed_selected_surface_parity_gate_bc`

Gate BB selected next action:

`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`

Gate BB selected next file:

`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc-contract.test.ts`

Complete visible heavy-concrete combined upper/lower floor stacks with
`acoustic_hanger_ceiling` or `resilient_stud_ceiling` lower-treatment
support now calculate on
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
Pinned values: acoustic hanger `Ln,w 45.6` / `DeltaLw 28.9`;
resilient stud `Ln,w 44.6` / `DeltaLw 29.9`. Missing
`ceilingOrLowerAssembly` or `loadBasisKgM2` still stops, and ASTM
`IIC` / `AIIC` aliases remain unsupported.

Previous Gate AX landed as
`post_v1_wall_framed_building_adapter_gate_ax_plan` with status
`post_v1_wall_framed_building_adapter_gate_ax_landed_selected_next_numeric_coverage_gap_gate_ay`;
it added framed LSF/timber building adapter coverage for source-absent
wall direct-curve families. Complete Gate AR
`building_prediction` requests for `wall-lsf-knauf` now pin `Rw 51`,
STC 51, `C -1.4`, `Ctr -6.4`, `R'w 51`, `Dn,w 51`, `Dn,A 49.6`,
`DnT,w 52`, and `DnT,A 51.1`; `wall-timber-stud` now pins `Rw 42`,
STC 42, `C 0.4`, `Ctr -4.3`, `R'w 42`, `Dn,w 42`, `Dn,A 42.4`,
`DnT,w 43`, and `DnT,A 43.9`. Gate AY is selected next through
`post_v1_next_numeric_coverage_gap_gate_ay_plan` for the
`floor-tuas-c11c-fail-closed` ISO impact gap; do not drift into a broad
source crawl, confidence wording pass, finite scenario pack, or
no-runtime cartography gate.

Initial landed post-V1 action:

`post_v1_calculator_capability_roi_confirmation_gate_0_plan`

Initial landed post-V1 file:

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
Gate M selected Gate N action
`post_v1_floor_field_building_expansion_gate_n_plan` in
`packages/engine/src/post-v1-floor-field-building-expansion-gate-n-contract.test.ts`;
selected next label: post-V1 floor field/building expansion Gate N.
Gate N action `post_v1_floor_field_building_expansion_gate_n_plan`
landed with status
`post_v1_floor_field_building_expansion_gate_n_landed_selected_gate_o_input_surface_guided_physical_fields`.
Gate N selected Gate O action
`post_v1_input_surface_guided_physical_fields_gate_o_plan` in
`packages/engine/src/post-v1-input-surface-guided-physical-fields-gate-o-contract.test.ts`;
Gate N selected Gate O label: post-V1 input-surface guided physical fields Gate O.
Gate N now
maps the generalized floor impact field-context adapter through
`floor.impact_field_context.field_building_adapter` on
`source_absent_field_building_adapter_error_budget`: dynamic
lightweight-concrete field requests with a live lab `Ln,w` anchor plus
`impactFieldContext.fieldKDb` and
`impactFieldContext.receivingRoomVolumeM3` publish
`L'n,w 66.3 / L'nT,w 63.9`. Missing field-impact context stops as
`needs_input` with `impactFieldContext` and `receivingRoomVolumeM3`;
building prediction and ASTM `IIC` / `AIIC` aliases remain blocked.
Gate O then added flat multicavity auto-topology for explicit
air-gap/porous-fill wall stacks (`Rw 53` / STC 57 / `C -0.6` /
`Ctr -8`), Gate P added flat double-leaf auto-topology for explicit
support context and stud spacing: independent support `Rw 45` / STC 45
/ `C -1` / `Ctr -6.1`, resilient both-sides `Rw 47` / STC 47 /
`C -1` / `Ctr -6.1`, Gate Q added full-fill flat multicavity
auto-topology when explicit support context is present. The Gate Q
pinned wall stack `gypsum / rockwool / gypsum / rockwool / gypsum`
now derives grouped triple-leaf topology and calculates `Rw 52` /
STC 53 / `C -2.6` / `Ctr -9.4`; legacy support hints are not guessed
and explicit `flat_layer_order` stays blocked. Gate R now lets that
same explicit-support full-fill flat stack calculate field/apparent
outputs from complete `field_between_rooms` context: `R'w 50`,
`Dn,w 50`, `Dn,A 48.5`, `DnT,w 53`, and `DnT,A 50.9`; missing field
RT60 is reported as `needs_input` instead of asking for manual leaf
groups. Gate S then promotes the common flat double-leaf field request
with explicit support context and `studSpacingMm` from screening fallback
to the owned double-leaf family physics plus field adapter: `R'w 39`,
`Dn,w 40`, `Dn,A 38.5`, `DnT,w 42`, and `DnT,A 40.9`; missing
`receivingRoomRt60S` is the only input stop and support is still not
guessed. Gate T keeps that same calculable stack complete when the user
requests mixed lab-spectrum plus field outputs: `Rw 39`, STC 39,
`C -1`, `Ctr -5.7`, `R'w 39`, `Dn,w 40`, `Dn,A 38.5`, `DnT,w 42`,
and `DnT,A 40.9`; the field adapter trace still pins only field metrics
so lab values are not relabelled as field candidates. Gate U applies the
same calculable-output rule to the explicit-support full-fill flat
multicavity field stack: `Rw 50`, STC 51, `C -2`, `Ctr -8.5`,
`R'w 50`, `Dn,w 50`, `Dn,A 48.5`, `DnT,w 53`, and `DnT,A 50.9`, again
with the field adapter trace pinning only field metrics. Gate V keeps
explicitly requested `Rw` live even when the user asks only for `Rw`
plus field outputs, without requiring STC or spectrum companions:
double-leaf `Rw 39` / `R'w 39` / `DnT,w 42`, and multileaf `Rw 50` /
`R'w 50` / `DnT,w 53`. Gate W extends that calculable-output rule to
complete heavy-composite and local-substitution grouped triple-leaf field
adapters: heavy-composite `Rw 60` / `R'w 60` / `DnT,w 61`, and
local-substitution `Rw 51` / `R'w 51` / `DnT,w 53`; field-only requests
still remain field-only. The shared resolver surface now has 39 declared candidates and 36 active runtime-basis mappings.
This is not source crawling, confidence wording, docs-only work, or a
finite scenario pack.

Previously landed Gate P action:

`post_v1_wall_double_leaf_auto_topology_gate_p_plan`

Previously landed Gate P file:

`packages/engine/src/post-v1-wall-double-leaf-auto-topology-gate-p-contract.test.ts`

Gate P selection status:

`post_v1_wall_double_leaf_auto_topology_gate_p_landed_selected_next_numeric_coverage_gap_gate_q`

Previous selected label:

post-V1 wall double-leaf auto-topology Gate P

Gate P selected Gate Q action:

`post_v1_next_numeric_coverage_gap_gate_q_plan`

Gate P selected Gate Q file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-q-contract.test.ts`

Gate P selected Gate Q label:

post-V1 next numeric coverage gap Gate Q

Previously landed Gate Q action:

`post_v1_wall_full_fill_multicavity_auto_topology_gate_q_plan`

Previously landed Gate Q file:

`packages/engine/src/post-v1-wall-full-fill-multicavity-auto-topology-gate-q-contract.test.ts`

Gate Q selection status:

`post_v1_wall_full_fill_multicavity_auto_topology_gate_q_landed_selected_next_numeric_coverage_gap_gate_r`

Gate Q selected Gate R action:

`post_v1_next_numeric_coverage_gap_gate_r_plan`

Gate Q selected Gate R file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-r-contract.test.ts`

Gate Q selected Gate R label:

post-V1 next numeric coverage gap Gate R

Previously landed Gate R action:

`post_v1_wall_field_auto_topology_gate_r_plan`

Previously landed Gate R file:

`packages/engine/src/post-v1-wall-field-auto-topology-gate-r-contract.test.ts`

Gate R selection status:

`post_v1_wall_field_auto_topology_gate_r_landed_selected_next_numeric_coverage_gap_gate_s`

Gate R selected next action:

`post_v1_next_numeric_coverage_gap_gate_s_plan`

Gate R selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-s-contract.test.ts`

Gate R selected next label:

post-V1 next numeric coverage gap Gate S

Previously landed Gate S action:

`post_v1_wall_double_leaf_field_auto_topology_gate_s_plan`

Previously landed Gate S file:

`packages/engine/src/post-v1-wall-double-leaf-field-auto-topology-gate-s-contract.test.ts`

Gate S selection status:

`post_v1_wall_double_leaf_field_auto_topology_gate_s_landed_selected_next_numeric_coverage_gap_gate_t`

Gate S selected next action:

`post_v1_next_numeric_coverage_gap_gate_t_plan`

Gate S selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-t-contract.test.ts`

Gate S selected next label:

post-V1 next numeric coverage gap Gate T

Previously landed Gate T action:

`post_v1_wall_mixed_lab_field_output_gate_t_plan`

Previously landed Gate T file:

`packages/engine/src/post-v1-wall-mixed-lab-field-output-gate-t-contract.test.ts`

Gate T selection status:

`post_v1_wall_mixed_lab_field_output_gate_t_landed_selected_next_numeric_coverage_gap_gate_u`

Gate T selected next action:

`post_v1_next_numeric_coverage_gap_gate_u_plan`

Gate T selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-u-contract.test.ts`

Gate T selected next label:

post-V1 next numeric coverage gap Gate U

Latest Gate T validation is green. Full `pnpm calculator:gate:current`
passed on 2026-05-25 with engine 531 files / 2991 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Previously landed Gate U action:

`post_v1_wall_multileaf_mixed_lab_field_output_gate_u_plan`

Previously landed Gate U file:

`packages/engine/src/post-v1-wall-multileaf-mixed-lab-field-output-gate-u-contract.test.ts`

Gate U selection status:

`post_v1_wall_multileaf_mixed_lab_field_output_gate_u_landed_selected_next_numeric_coverage_gap_gate_v`

Gate U selected next action:

`post_v1_next_numeric_coverage_gap_gate_v_plan`

Gate U selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-v-contract.test.ts`

Gate U selected next label:

post-V1 next numeric coverage gap Gate V

Latest Gate U validation is green. Full `pnpm calculator:gate:current`
passed on 2026-05-25 with engine 532 files / 2995 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Latest landed runtime action:

`post_v1_wall_rw_field_output_gate_v_plan`

Latest landed runtime file:

`packages/engine/src/post-v1-wall-rw-field-output-gate-v-contract.test.ts`

Gate V selection status:

`post_v1_wall_rw_field_output_gate_v_landed_selected_next_numeric_coverage_gap_gate_w`

Gate V selected next action:

`post_v1_next_numeric_coverage_gap_gate_w_plan`

Gate Z selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-w-contract.test.ts`

Gate Z selected next label:

post-V1 next numeric coverage gap Gate W

Latest Gate V validation is green. Full `pnpm calculator:gate:current`
passed on 2026-05-25 with engine 533 files / 2999 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Previously landed Gate W action:

`post_v1_wall_field_rw_companion_gate_w_plan`

Previously landed Gate W file:

`packages/engine/src/post-v1-wall-field-rw-companion-gate-w-contract.test.ts`

Gate W selection status:

`post_v1_wall_field_rw_companion_gate_w_landed_selected_next_numeric_coverage_gap_gate_x`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_x_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-x-contract.test.ts`

Selected next label:

post-V1 next numeric coverage gap Gate X

Latest Gate W validation is green. Full `pnpm calculator:gate:current`
passed on 2026-05-25 with engine 534 files / 3003 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Latest landed runtime action:

`post_v1_floor_airborne_spectrum_companion_gate_x_plan`

Latest landed runtime file:

`packages/engine/src/post-v1-floor-airborne-spectrum-companion-gate-x-contract.test.ts`

Gate X selection status:

`post_v1_floor_airborne_spectrum_companion_gate_x_landed_selected_next_numeric_coverage_gap_gate_y`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_y_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-y-contract.test.ts`

Selected next label:

post-V1 next numeric coverage gap Gate Y

Latest Gate X focused validation is green. Gate X targeted validation
passed 1 file / 4 tests, and the relevant regression sentinel passed 11
files / 64 tests. Full `pnpm calculator:gate:current` passed after Gate
X with engine 535 files / 3007 tests, web 95 files / 402 passed + 18
skipped, repo build 5 / 5, and whitespace guard passed.

Previous landed runtime action:

`post_v1_floor_screening_rw_companion_gate_z_plan`

Previous landed runtime file:

`packages/engine/src/post-v1-floor-screening-rw-companion-gate-z-contract.test.ts`

Gate Z selection status:

`post_v1_floor_screening_rw_companion_gate_z_landed_selected_next_numeric_coverage_gap_gate_aa`

Gate Z selected next action:

`post_v1_next_numeric_coverage_gap_gate_aa_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aa-contract.test.ts`

Selected next label:

post-V1 next numeric coverage gap Gate AA

Gate Z opens already-calculated `Rw` for source-absent floor
`screening_mass_law_curve_seed_v3` requests with visible floor roles
while preserving exact-source metric scope, UBIQ bound missing-`C`
boundaries, and impact / ASTM stops. The pinned TUAS C11c fail-closed
stack now supports `Rw 47`, STC 47, `C -1`, `Ctr -5.7`, `R'w 47`, and
`DnT,w 49` through `floor.screening_airborne.source_absent`; `Ln,w`,
`DeltaLw`, `L'n,w`, and `L'nT,w` remain stopped. Latest validation:
focused Gate Z / Gate Y / Gate X / resolver passed 6 files / 30 tests,
and full `pnpm calculator:gate:current` passed on 2026-05-26 with
engine 537 files / 3016 tests, web 95 files / 402 passed + 18 skipped,
repo build 5 / 5, and whitespace guard passed.

Latest landed post-V1 capability action:

`post_v1_floor_bound_low_frequency_field_companion_gate_ak_plan`

Latest landed post-V1 capability file:

`packages/engine/src/post-v1-floor-bound-low-frequency-field-companion-gate-ak-contract.test.ts`

Gate AK selection status:

`post_v1_floor_bound_low_frequency_field_companion_gate_ak_landed_selected_next_numeric_coverage_gap_gate_al`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_al_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-al-contract.test.ts`

Selected next label:

post-V1 next numeric coverage gap Gate AL

Gate AA opens the already-calculated `Rw` companion for complete
source-absent lined-massive wall field requests whose base lab-family
method is `gate_h_lined_massive_wall_cavity_aware_family_physics_runtime`.
The pinned concrete lined wall now supports `Rw 55`, STC 55, `C -1.6`,
`Ctr -6.3`, `R'w 55`, `Dn,w 55`, `Dn,A 53.4`, `DnT,w 56`, and
`DnT,A 54.9` even when unrelated floor/impact outputs remain stopped as
`needs_input` / `unsupported`. Grouped-topology flat wall cases still
stop as `needs_input`, and exact/floor metric-scope boundaries remain
unchanged. Latest validation: focused Gate AA / Gate Z / Gate Y / Gate
X / Gate W / resolver passed 6 files / 26 tests, and full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 538
files / 3019 tests, web 95 files / 402 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AB opens calculated `Rw` for complete single-leaf wall field
requests on the screening fallback lane. The masonry brick wall now
supports `Rw 40`, STC 40, `C -0.2`, `Ctr -4.7`, `R'w 40`, `Dn,w 40`,
`Dn,A 39.8`, `DnT,w 42`, and `DnT,A 41.3`; the laminated CLT wall now
supports `Rw 41`, STC 41, `C -1.8`, `Ctr -7.6`, `R'w 41`, `Dn,w 41`,
`Dn,A 39.2`, `DnT,w 42`, and `DnT,A 40.7`. Framed/grouped wall routes
that still need topology fields remain `needs_input`; exact/floor
metric scopes and UBIQ bound missing-`C` guards remain closed. Gate AB
status is
`post_v1_wall_screening_rw_field_companion_gate_ab_landed_selected_next_numeric_coverage_gap_gate_ac`;
selected next action was `post_v1_next_numeric_coverage_gap_gate_ac_plan`.
Latest validation: focused Gate AB passed 1 file / 4 tests; focused
Gate AB / Gate AA / Gate Z / Gate Y / Gate X / Gate W / resolver /
origin matrix passed 8 files / 31 tests; web Gate B visibility passed
1 file / 4 tests; web origin card matrix passed 1 file / 1 test; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 539
files / 3023 tests, web 95 files / 402 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AC opens the already-calculated floor field/building airborne
outputs `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` through
`floor.impact_field_context.field_building_adapter` and automatic
workbench floor presets. The heavy concrete floor now supports
`Dn,w 57`, `Dn,A 56.1`, `DnT,w 60`, and `DnT,A 58.6`; the lightweight
steel fallback supports `Dn,w 69`, `Dn,A 68.1`, `DnT,w 72`, and
`DnT,A 70.6`. Exact floor metric scope, bound-only missing-`C`,
ASTM/IIC, and unrelated `needs_input` boundaries remain closed. Gate AC
status is
`post_v1_floor_field_a_weighted_surface_gate_ac_landed_selected_next_numeric_coverage_gap_gate_ad`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ad_plan`.
Latest validation: focused Gate AC passed engine 1 file / 4 tests and
web 1 file / 4 tests; focused Gate N + Gate AC passed engine 2 files /
9 tests; focused Gate AC + floor preset web passed 2 files / 6 tests;
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
540 files / 3027 tests, web 96 files / 406 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.

Gate AD opens the already-calculated `Rw` companion for framed wall
field/building requests on the stud-surrogate/framed-calibration route. Explicit
`connectionType` / `studType` metadata is required, but the field values
stay on the defended calibration lane instead of moving to the less
accurate source-absent double-leaf formula. The LSF Knauf framed wall
now supports `Rw 51`, STC 51, `C -1.4`, `Ctr -6.4`, `R'w 51`,
`Dn,w 51`, `Dn,A 49.6`, `DnT,w 52`, and `DnT,A 51.1`; the timber-stud
wall now supports `Rw 42`, STC 42, `C 0.4`, `Ctr -4.3`, `R'w 42`,
`Dn,w 42`, `Dn,A 42.4`, `DnT,w 43`, and `DnT,A 43.9`. No-support
framed metadata and grouped AAC/triple-leaf cases still stop as
`needs_input`; exact/bound floor metric scope and ASTM/IIC aliases
remain closed. Gate AD status is
`post_v1_wall_framed_metadata_auto_topology_gate_ad_landed_selected_next_numeric_coverage_gap_gate_ae`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ae_plan`.
Latest validation: focused Gate AD passed engine 1 file / 4 tests;
framed/source regression coverage passed 21 files / 157 tests; resolver
and answer-engine regression coverage passed 5 files / 41 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 541
files / 3031 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AE opens the same defended framed-calibration lane's calculated
lab spectrum companions, not just `Rw`. Complete explicit framed
building requests now publish `Rw`, STC, `C`, and `Ctr` when the
stud-surrogate/framed-calibration curve already owns finite values,
while `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` remain parked behind
building/field input boundaries until their owners are complete. The LSF
Knauf building case supports `Rw 51`, STC 51, `C -1.4`, and `Ctr -6.4`;
the timber-stud building case supports `Rw 42`, STC 42, `C 0.4`, and
`Ctr -4.3`. Direct timber and British Gypsum framed building cards now
show the same calculated lab-spectrum companions. No framed metadata,
grouped AAC/triple-leaf, exact metric-scope, floor bound, and ASTM/IIC
boundaries remain closed. Gate AE status is
`post_v1_wall_framed_lab_spectrum_companion_gate_ae_landed_selected_next_numeric_coverage_gap_gate_af`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_af_plan`.
Latest validation: focused Gate AD + Gate AE passed engine 2 files / 8
tests; focused wall card coverage passed web 3 files / 31 tests.

Gate AF opens source-absent building lab-spectrum companions for owned
single-leaf / lined-massive wall traces. Complete building-prediction
requests now publish `Rw`, STC, `C`, and `Ctr` when the calculated lab
curve already owns finite values, while `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
and `DnT,A` remain parked behind field/building owners. The lined
concrete building case supports `Rw 55`, STC 55, `C -1.6`, and
`Ctr -6.3`; masonry brick supports `Rw 40`, STC 40, `C -0.2`, and
`Ctr -4.7`; laminated CLT supports `Rw 41`, STC 41, `C -1.8`, and
`Ctr -7.6`. Grouped AAC/multileaf, opening/leak building, exact
metric-scope, floor bound, and ASTM/IIC boundaries remain closed. Gate
AF status is
`post_v1_wall_source_absent_building_lab_spectrum_companion_gate_af_landed_selected_next_numeric_coverage_gap_gate_ag`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ag_plan`.
Latest validation: focused Gate AE + Gate AF passed engine 2 files / 8
tests; focused wall surface coverage passed web 3 files / 12 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 543
files / 3039 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AG opens heavy-composite building lab-spectrum companions for the
guarded double-leaf / heavy-unframed-cavity-cap wall trace. Complete
building-prediction requests now publish `Rw`, STC, `C`, and `Ctr` when
that calculated lab trace already owns finite values, while `R'w`,
`Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` remain parked behind
field/building owners. The heavy-composite building case supports
`Rw 60`, STC 60, `C -1.4`, and `Ctr -6.1`. Grouped AAC/multileaf,
opening/leak building, exact metric-scope, floor bound, ASTM/IIC, and
field/building value aliases remain closed. Gate AG status is
`post_v1_wall_heavy_composite_building_lab_spectrum_companion_gate_ag_landed_selected_next_numeric_coverage_gap_gate_ah`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ah_plan`.
Latest validation: focused Gate AG + Gate AF + heavy-composite
regressions passed engine 5 files / 22 tests; focused wall surface
coverage passed web 3 files / 12 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 544
files / 3042 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AH opens the calculated `Rw` companion for support-backed
AAC/multileaf field requests on the existing `multileaf_screening_blend`
wall path. The support-backed AAC/multileaf field case now supports
`Rw 41`, STC 41, `C -1.7`, `Ctr -6.8`, `R'w 41`, `Dn,w 41`,
`Dn,A 39.3`, `DnT,w 42`, and `DnT,A 40.8`. Missing support topology
still stops as `needs_input`; floor bound `C`, exact floor STC/`C`/`Ctr`
aliases, opening/leak building, ASTM/IIC, and field/building value
aliases remain closed. Gate AH status is
`post_v1_wall_multileaf_screening_rw_field_companion_gate_ah_landed_selected_next_numeric_coverage_gap_gate_ai`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ai_plan`.
Latest validation: focused Gate AH + Gate AG + wall/floor regression
coverage passed engine 5 files / 19 tests; focused wall surface
coverage passed web 4 files / 19 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 545
files / 3046 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AI promotes that support-backed AAC/multileaf field request from
the screening fallback into the Gate AE two-cavity physics solver plus
Gate I field adapter. The same field request now supports `Rw 60`, STC
60, `C -1.9`, `Ctr -8`, `R'w 60`, `Dn,w 60`, `Dn,A 58.1`, `DnT,w 61`,
and `DnT,A 59.6`. Missing support topology still stops as
`needs_input`, missing `receivingRoomRt60S` remains that exact
`needs_input` field, and floor bound `C`, exact floor STC/`C`/`Ctr`
aliases, opening/leak building, ASTM/IIC, and field/building value
aliases remain closed. Gate AI status is
`post_v1_wall_flat_multicavity_field_physics_companion_gate_ai_landed_selected_next_numeric_coverage_gap_gate_aj`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_aj_plan`.
Latest validation: focused Gate AI + Gate AH + wall/floor regression
coverage passed engine 5 files / 21 tests; focused wall surface
coverage passed web 4 files / 19 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 546
files / 3051 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AJ promotes complete support-backed AAC/multileaf building requests
from the screening/`needs_input` stop into the Gate AE two-cavity
physics solver plus building-prediction runtime basis. The same building
request now supports `R'w 60`, `Dn,w 60`, `Dn,A 58.1`, `DnT,w 61`, and
`DnT,A 59.6`; lab `Rw`, STC, `C`, and `Ctr` remain unsupported on the
building route instead of being aliased. Missing support topology still
stops as `needs_input`, missing `sourceRoomVolumeM3` remains that exact
`needs_input` field, and floor bound `C`, exact floor STC/`C`/`Ctr`
aliases, opening/leak building, ASTM/IIC, and field/building value
aliases remain closed. Gate AJ status is
`post_v1_wall_flat_multicavity_building_physics_gate_aj_landed_selected_next_numeric_coverage_gap_gate_ak`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ak_plan`.
Latest validation: focused Gate AJ + Gate AI + answer-engine regression
coverage passed engine 5 files / 40 tests; focused wall/building
surface coverage passed web 5 files / 25 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 547
files / 3056 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AK calculates the source-owned low-frequency field companion for
bound-only floor impact lanes. When the bound lane already owns
`Ln,w`, `L'n,w`, and `L'nT,w` upper bounds and the user supplies
`impactFieldContext.ci50_2500Db`, DynEcho now publishes
`L'nT,50 upper bound = L'nT,w upper bound + CI,50-2500` instead of
leaving the metric unsupported. The UBIQ open-web bound case now
supports `Ln,w <= 51`, `L'n,w <= 54`, `L'nT,w <= 51.2`, and
`L'nT,50 <= 55.2`; selected lightweight-steel bound interpolation
families pin `L'nT,50 <= 55.2`, `<= 56.2`, or `<= 57.2`. Missing
`impactFieldContext.ci50_2500Db` still stops pure `L'nT,50` requests
as `needs_input`, mixed bound field requests leave only `L'nT,50`
explicit, and ASTM `IIC` / `AIIC` remain unsupported. Gate AK status is
`post_v1_floor_bound_low_frequency_field_companion_gate_ak_landed_selected_next_numeric_coverage_gap_gate_al`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_al_plan`.
Latest validation: focused Gate AK + Gate AJ + answer-engine
regression coverage passed engine 5 files / 46 tests; focused floor
low-frequency surface coverage passed web 4 files / 33 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 548
files / 3062 tests, web 97 files / 408 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

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
