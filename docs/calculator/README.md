# Calculator Docs

Living reference docs for the DynEcho acoustic calculator. Read these
before anything under `docs/archive/` and before older dated
checkpoints in this folder.

## Current Source Of Truth

As of 2026-05-07 the active calculator direction is the
model-first physics prediction pivot:

`calculator_model_first_physics_prediction_pivot_v1`

This is a correction to the previous source-packet-first route.
DynEcho is an acoustic calculator first. Exact lab/source rows can
override or anchor known assemblies, but missing source packets must
not block a labelled family-specific physics prediction when the
required topology and material inputs are present.

As of 2026-05-10, Personal-Use MVP Coverage Sprint Gate L has landed
the airborne `building_prediction` boundary after first-class airborne
field-context input-surface wiring for owned
lab-family wall routes
after Gate H lined massive/masonry and CLT wall lab family-physics
promotion and Gate G generalized wall multi-cavity / triple-leaf route
readiness beyond fixture gates. Gate D first promoted explicit complete timber/CLT
predictor input; Gate E proved visible/API/report parity; Gate F proved
first-class Dynamic Calculator input-surface parity for those
timber/CLT `DeltaLw` values; Gate G now proves complete grouped 50/50
and non-50/50 mineral-wool triple-leaf routes, flat-list and partial
topology `needs_input`, duplicate/overlapping group refusal, field
non-aliasing, and exact-source precedence; Gate H now proves complete
lined massive/masonry `Rw 60 / STC 60` and CLT `Rw 42 / STC 42` stay
numeric-stable while their origin moves from `screening_fallback` to
named `family_physics_prediction` with visible error budgets; Gate I now
promotes complete `field_between_rooms` requests for grouped
triple-leaf, lined massive/masonry, and CLT/mass-timber wall families to
a field/apparent family-physics basis without numeric retune; Gate J now
proves cards, posture, provenance, dossiers, saved replay, Markdown
report text, and calculator API payloads expose that basis honestly;
Gate K now makes `field_between_rooms`, panel geometry, receiving-room
volume, and RT60 first-class workbench inputs and keeps partial field
contexts parked as `needs_input` without a field budget; Gate L now
parks every airborne `building_prediction` request until
`flankingJunctionClass` and `conservativeFlankingAssumption` are
explicit flanking/junction owners, including the conservative flanking
assumption, suppresses legacy building overlay warnings while parked,
and keeps building cards out of Gate I field posture. The current
Gate M input contract now defines source-room volume, receiving-room
volume/RT60, flanking/junction class, conservative flanking assumption,
junction coupling length, and building output basis as the minimum
building-prediction owner set. Complete owner sets still select
`unsupported`; Gate N now scopes the building-prediction runtime
adapter and names the missing ISO 12354-1 flanking formula terms without
moving runtime values. Gate O now defines the building-prediction
formula corridor and same-building holdout budget without moving runtime
values. Gate P now closes the airborne building-prediction runtime
corridor as no-runtime because the direct-curve, flanking-energy,
junction/coupling, room-standardization, and `+/-9 dB` budget owners are
not executable runtime terms yet. The current selected next lane is Gate
Q opening/leak composite transmission-loss input ownership. Gate Q now
lands that contract as no-runtime with selection status
`gate_q_personal_use_mvp_opening_leak_composite_input_contract_landed_no_runtime_selected_formula_corridor_gate_r`
and selects Gate R
`gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan`.
Gate A
landed in
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`
with action `gate_a_personal_use_mvp_coverage_matrix_plan`; it selects
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`
with action
`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`.
Gate B landed in
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`
with action
`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`
with action
`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan`.
Gate C landed in that file and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts`
with action
`gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan`.
Gate D landed in that file and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts`
with action
`gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan`.
Gate E landed in that file and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-f-timber-clt-floor-impact-delta-lw-input-surface-contract.test.ts`
with action
`gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan`.
Gate F landed in that file and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts`
with action
`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan`.
Gate G landed in that file with selection status
`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_landed_selected_lined_masonry_clt_wall_gate_h`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`
with action
`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan`.
Gate H landed in that file with selection status
`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_landed_selected_airborne_field_context_gate_i`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts`
with action
`gate_i_personal_use_mvp_airborne_field_context_continuation_plan`.
Gate I landed in that file with selection status
`gate_i_personal_use_mvp_airborne_field_context_continuation_landed_selected_field_surface_parity_gate_j`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts`
with action
`gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan`.
Gate J landed in that file with selection status
`gate_j_personal_use_mvp_airborne_field_context_surface_parity_landed_selected_input_surface_gate_k`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts`
with action
`gate_k_personal_use_mvp_airborne_field_context_input_surface_plan`.
Gate K landed in that file with selection status
`gate_k_personal_use_mvp_airborne_field_context_input_surface_landed_selected_building_prediction_boundary_gate_l`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts`
with action
`gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan`.
Gate L landed in that file with selection status
`gate_l_personal_use_mvp_airborne_building_prediction_boundary_landed_selected_building_prediction_input_contract_gate_m`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts`
with action
`gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan`.
Gate M landed in that file with selection status
`gate_m_personal_use_mvp_airborne_building_prediction_input_contract_landed_no_runtime_selected_runtime_adapter_gate_n`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts`
with action
`gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan`.
Gate N landed in that file with selection status
`gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_landed_no_runtime_selected_formula_corridor_gate_o`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts`
with action
`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan`.
Gate O landed in that file with selection status
`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_p`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts`
with action
`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan`.
Gate P landed in that file with selection status
`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_closed_no_runtime_selected_opening_leak_composite_gate_q`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts`
with action
`gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan`.
Gate Q landed in that file with selection status
`gate_q_personal_use_mvp_opening_leak_composite_input_contract_landed_no_runtime_selected_formula_corridor_gate_r`
and selected
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts`
with action
`gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan`.
Gate BI landed in
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`
with action
`gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`.
See
[CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Q_HANDOFF.md](./CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Q_HANDOFF.md),
[CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_P_HANDOFF.md](./CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_P_HANDOFF.md),
[CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_O_HANDOFF.md](./CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_O_HANDOFF.md),
[CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_N_HANDOFF.md](./CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_N_HANDOFF.md),
[CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_M_HANDOFF.md](./CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_M_HANDOFF.md),
[CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_L_HANDOFF.md](./CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_L_HANDOFF.md),
[CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_K_HANDOFF.md](./CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_K_HANDOFF.md),
[CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_J_HANDOFF.md](./CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_J_HANDOFF.md),
[CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_I_HANDOFF.md](./CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_I_HANDOFF.md),
[CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_H_HANDOFF.md](./CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_H_HANDOFF.md),
[CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_G_HANDOFF.md](./CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_G_HANDOFF.md),
[CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md](./CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md),
[CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_F_HANDOFF.md](./CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_F_HANDOFF.md),
[CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_E_HANDOFF.md](./CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_E_HANDOFF.md),
[CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_D_HANDOFF.md](./CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_D_HANDOFF.md),
[CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_HANDOFF.md](./CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_HANDOFF.md),
[CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_HANDOFF.md](./CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_HANDOFF.md),
[CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_HANDOFF.md)
and
[CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md](./CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md).

The 2026-05-10 ROI revalidation selected Gate G after Gate F, Gate G
then selected Gate H, Gate H selected Gate I, Gate I selected Gate J,
Gate J selected Gate K, Gate K selected Gate L, Gate L selected Gate M,
Gate M selected Gate N, Gate N selected Gate O, Gate O selected Gate P,
Gate P selected Gate Q, and Gate Q has now selected Gate R. Gate K keeps
the new airborne field-context basis first-class on the wall input
surface and makes RT60 a visible blocker before `DnT,w` / `DnT,A` can be
defended. Gate L adds the explicit building-prediction flanking/junction
boundary and conservative flanking assumption blocker so
`building_prediction` cannot borrow Gate I field budgets. Gate M has now
defined the complete building-prediction input owner contract with
source-room volume, junction coupling length, and building output basis
explicit before runtime promotion. Gate N now defines the
building-prediction runtime adapter owner boundary: direct
separating-element curve ownership, flanking formula terms, junction
vibration reduction, room absorption normalization, and an explicit
building-prediction uncertainty budget are required before Gate O can
consider a formula corridor. Gate O now defines that source-absent
building-prediction formula corridor with separate `R'w` and `DnT,w`
lanes, `+/-9 dB` not-measured design budgets, same-building holdout
uncertainty, and strict alias blocks. Gate P confirms building runtime
stays parked and shifts the next calculator-readiness work to
opening/leak composite transmission-loss input ownership. Gate Q now
owns those first-class inputs, keeps runtime no-runtime, and selects the
Gate R formula-corridor step.
Steel-floor tolerance tightening stays deferred until
independent source-owned same-stack ISO `DeltaLw` packets exist.
Gate Q validation result:
focused Gate Q passed 1 file / 6 tests; Gate Q/P/O/N/M/L plus Gate
G/H/I/J/K continuity passed 11 files / 65 tests; final
`pnpm calculator:gate:current` passed with engine 358 files / 2074
tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Final standalone `git diff
--check` passed after this validation-note sync.
Gate P validation result:
focused Gate P passed 1 file / 6 tests; Gate P/O/N/M/L plus Gate I/J/K
continuity passed 8 files / 44 tests; final
`pnpm calculator:gate:current` passed with engine 357 files / 2068
tests, web 71 files / 306 passed + 18 skipped, and repo build 5/5
successful. `git diff --check` must be rerun after validation-note sync.
Gate O validation result:
focused Gate O validation passed 1 file / 6 tests; Gate O/N/M/L plus
Gate I/J/K continuity passed 7 files / 38 tests; engine typecheck
passed; final `pnpm calculator:gate:current` passed with engine 356
files / 2062 tests, web 71 files / 306 passed + 18 skipped, repo build
5/5 successful, whitespace guard clean, and final `git diff --check`
passed after the validation-doc sync. Known non-fatal warnings:
test-environment Zustand storage-unavailable messages and optional
`sharp` `@img/*` resolution warnings during web build.
Gate N validation completed on 2026-05-10: focused Gate N engine
runtime adapter contract passed 1 file / 6 tests; Gate M/L continuity
plus Gate I/J/K field continuity passed 6 files / 32 tests; focused
workbench building/field input surfaces passed 2 files / 8 tests;
engine/web typechecks passed; final `pnpm calculator:gate:current`
passed with engine 355 files / 2056 tests, web 71 files / 306 passed +
18 skipped, repo build 5/5 successful, and whitespace guard clean; final
`git diff --check` passed after the validation-doc sync.
Gate M validation completed on 2026-05-10: focused Gate M, Gate L
continuity, Gate I/J/K continuity, Gate K route-input continuity,
focused workbench building/field input surfaces, engine/web typechecks,
final `pnpm calculator:gate:current`, and whitespace guard all passed.
Final current-gate totals were engine 354 files / 2050 tests, web 71
files / 306 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean.
Gate L validation completed on 2026-05-10: focused Gate L engine
boundary contract, Gate L/K workbench input and card surface coverage,
targeted route-card regressions, Gate I/J/K/L engine continuity,
Gate J/K/L web continuity, targeted legacy engine/web regressions,
engine/web typechecks, final `pnpm calculator:gate:current`, and
whitespace guard all passed. Final current-gate totals were engine 353
files / 2044 tests, web 71 files / 306 passed + 18 skipped, repo build
5/5 successful, and whitespace guard clean.

Gate A, Gate B, Gate C, Gate D, Gate E, Gate G, Gate H, Gate I,
Gate J, Gate K, Gate L, Gate M, Gate N, Gate O, Gate P, Gate Q, Gate R,
Gate S, Gate T, Gate U, Gate V, Gate W, Gate X, Gate Y, Gate Z, Gate AA,
Gate AB, Gate AC, Gate AD, Gate AE, Gate AF, Gate AG, Gate AH, Gate AI,
Gate AJ, Gate AK, Gate AL, Gate AM, Gate AN, Gate AO, Gate AP, Gate AQ,
Gate AR, Gate AS, Gate AT, Gate AU, Gate AV, Gate AW, Gate AX, Gate AY,
Gate AZ, Gate BA, Gate BB, Gate BC, Gate BD, Gate BE, Gate BF, Gate BG,
Gate BH, Gate BI, and Personal-Use MVP Coverage Sprint Gate A, Gate B,
Gate C, Gate D, Gate E, Gate F, Gate G, Gate H, Gate I, Gate J,
Gate K, and Gate L for this pivot have landed. The original pivot Gate A
made the corrected rule
executable: source absence
blocks exact/calibration promotion only, not formula-backed prediction.
Gate B added shared airborne `airborneBasis` / `airborneCandidateSet`
schema support. Gate C added optional `ratingAdapterBasisSet` metadata
and rating-adapter schemas so `Rw`/`STC`, `Ln,w`/`IIC`, and lab/field
contexts stay basis-owned before runtime values move. Gate D added
optional `inputCompletenessSet` metadata and the physical input matrix
that separates missing source evidence from missing physical inputs.
Gate E added optional `airborneCandidateResolution` metadata so selected
and rejected airborne candidates carry precedence, input/source blockers,
and deterministic tie-breakers before runtime values move. Gate G made
the first deliberate runtime movement: explicit grouped Rockwool
triple-leaf topology now uses
`triple_leaf_two_cavity_frequency_solver_family_physics_prediction`.
Gate H added the source-promotion policy for exact full-stack,
calibrated family, and exact-subassembly-plus-delta candidates without
moving runtime values or deleting the physics-prediction lane. Gate I
added shared material acoustic property fields, nominal catalog
properties, and a family benchmark/readiness helper for single-leaf,
double/framed, triple-leaf, lined masonry, CLT/mass timber, and
floating-floor routes without moving runtime values.
Gate J added the personal-use readiness scenario pack and engine
inventory guard. It covers wall/floor routes, exact source, similar
source anchored delta, calibrated family, source-absent family physics,
bounded, screening, `needs_input`, and `unsupported` postures without
moving runtime values.
Gate K added the Dynamic Calculator route/input topology contract:
wall/floor route assessment, lab/field/building output-basis prompts,
grouped multi-cavity wall topology prompts, field/building room/flanking
prompts, floating-floor dynamic-stiffness/load prompts, and unsupported
`IIC`/`AIIC` posture without moving runtime values.
Gate L added the Dynamic Calculator topology normalizer and hostile input
guard: role-defined floor reorders/splits can normalize when physically
invariant, multi-cavity wall order is preserved, ambiguous flat-list
multi-cavity walls are not auto-grouped, and hostile layer input fails
closed without moving runtime values.
Gate M added the Dynamic Calculator candidate resolver runtime surface:
exact full-stack, anchored delta, calibrated family, family physics,
bounded, screening, `needs_input`, and `unsupported` candidates are now
visible with selected/rejected reasons without moving numeric runtime
values or support buckets.
Gate N added the no-runtime family-solver upgrade selection matrix and
picked single-leaf / laminated single-leaf / rigid massive panel as the
first runtime upgrade target. It explicitly deferred double/framed,
generalized multi-cavity, lined masonry/CLT, floor-impact, and
field/building continuations because those require larger topology,
bridge, impact-adapter, or room/flanking owners before safe promotion.
Gate O landed that selected runtime move for the Dynamic Calculator:
complete single-leaf / laminated single-leaf / rigid massive panel
results now select `family_physics_prediction` with an uncalibrated
error budget, while gypsum/laminated/concrete values and target-output
support remain pinned. Exact source rows still override when eligible,
Gate G grouped Rockwool remains unchanged, and CLT/mass timber remains
screening until orthotropic/directional properties are owned.
Gate P added the no-runtime next-family solver selection after Gate O:
it excludes the already-landed single-leaf family and selects
double-leaf / framed bridge as the next Dynamic Calculator family.
Runtime movement remains blocked until frame bridge, stud spacing,
resilient side count, support topology, porous cavity damping, and
mass-air-mass resonance owners are contracted with positive and
nearby-negative benchmarks.
Gate Q added the double-leaf / framed bridge input and benchmark
contract. Explicit `double_leaf_framed` wall topology now opens targeted
physical prompts for side groups, cavity depth, frame bridge class,
support topology, support spacing, and resilient-bar side count. Source
absence still blocks only exact/calibration promotion; runtime values
remain unchanged.
Gate R added the double-leaf / framed bridge solver-candidate and
equation contract without moving runtime values. It names the side-leaf
surface-mass, mass-air-mass resonance, bridge-coupling, porous-damping,
ISO 717-1 `Rw`, and ASTM E413 `STC` adapter owners; ships positive
benchmark corridors and direct-fixed / missing-input / multi-cavity
negative boundaries; and selects Gate S for runtime promotion with value
pins and visible/report parity.
Gate S promotes that solver into Dynamic Calculator runtime for complete
explicit double-leaf/framed contexts. Independent absorbed gypsum /
rockwool / gypsum now selects `family_physics_prediction` with
`Rw 45`, `STC 45`, `C -1`, `Ctr -6.1`, and a `7 dB` error budget;
resilient both-side bridge selects `Rw 46` / `STC 46` with an `8 dB`
error budget. Exact full-stack source rows still outrank this lane when
Gate H source-promotion prerequisites are satisfied, while missing
`resilientBarSideCount` visibly parks explicit double-leaf/framed
route/output/report surfaces as `needs_input`. Gate S selection status:
`gate_s_double_leaf_framed_bridge_runtime_landed_selected_family_material_gap_gate_t`.
Gate S selected Gate T file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts`.
Gate S selected Gate T action:
`gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator`.
Gate T closes remaining high-impact family material-property gaps for
Dynamic Calculator physics without replacing algorithms with a finite
source catalog. Material acoustic metadata now includes `absorberClass`,
seed materials carry engineering-default properties for board
leaves/finishes, masonry cores, porous absorbers, floor decks/screeds,
limp membranes, and resilient impact layers, required property gaps
remain `needs_input`, and optional precision gaps widen uncertainty.
Runtime values and support buckets stay unchanged. Gate T selection
status:
`gate_t_family_material_property_gap_closure_landed_no_runtime_selected_next_solver_or_calibration_gate_u`.
Gate T selected Gate U file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`.
Gate T selected Gate U action:
`gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`.
Gate U ranks the next solver/calibration lanes after material gap
closure and selects floor-impact dynamic-stiffness input/adapter
ownership for Gate V. This is a calculator-first floor coverage move,
not a source-library move: calibration holdouts stay later, exact source
rows still override only through owned policy, and `Ln,w`, `L'n,w`,
`L'nT,w`, `IIC`, and `AIIC` remain basis-separated before runtime
promotion.
Gate V adds the no-runtime floor-impact dynamic-stiffness input and
adapter contract. Resilient floating-floor `Ln,w` / `DeltaLw` now require
owned `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`; missing
values produce targeted `needs_input`. `L'n,w` / `L'nT,w` stay field
context outputs, `IIC` / `AIIC` remain blocked behind an ASTM E989
adapter owner, and safe role-defined floor reorders normalize without
runtime value movement.
Gate W promotes that floor-impact dynamic-stiffness lane into Dynamic
Calculator runtime only for complete ISO 717-2 lab resilient
floating-floor `Ln,w` / `DeltaLw` requests. The runtime predictor carries
explicit `loadBasisKgM2` into the heavy floating-floor estimate and pins
the promoted scenario at `DeltaLw 24.3` / `LnW 50.3` with basis
`predictor_heavy_floating_floor_iso12354_annexc_estimate`. Missing load
basis, missing dynamic stiffness, field impact outputs without
room/context ownership, and ASTM `IIC` / `AIIC` remain non-promoted
boundaries.
Gate X is a no-runtime selection gate after Gate W. It selects
floor-impact field-context ownership for Gate Y because `L'n,w` /
`L'nT,w` are the direct personal-use continuation of the promoted lab
impact lane, but must not be created by relabelling lab `Ln,w`. Gate Y
must define the room/context/flanking/input boundary before any field
impact value promotion.
Gate Y landed that no-runtime floor-impact field-context contract. It
requires `contextMode`, `partitionAreaM2`, `receivingRoomVolumeM3`,
`receivingRoomRt60S`, and `impactFieldContext`, plus lab-impact anchor,
field `K` / mass-ratio / direct-flanking policy, flanking path or
junction policy, and low-frequency owner before `L'nT,50`. It documented
the pre-Gate-Z blocked field-only boundary and the existing lab-anchored
mixed supplement that Gate Z needed to normalize.
Gate Z promoted that field-context runtime for complete field-only
`L'n,w` / `L'nT,w` requests. The runtime now uses the Gate W lab
`Ln,w` / `DeltaLw` anchor internally, then applies explicit field `K`
and receiving-room volume normalization. The pinned reference scenario
returns `LnW 50.3`, `DeltaLw 24.3`, `LPrimeNW 52.3`, and
`LPrimeNTw 49.9` on basis
`mixed_predicted_plus_estimated_standardized_field_volume_normalization`.
Missing field context still blocks field outputs, and `L'nT,50` remains
unsupported until `lowFrequencyImpactSpectrumOrCI50_2500Owner` exists.

Post-Gate-Z accuracy incident:
[ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md](./ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md).
The construction-image examples showed that Dynamic Calculator can miss
a physically relevant multi-leaf solver because selector eligibility is
too benchmark-fixture-specific, then fall to a screening blend. They
also exposed the floor-side risk of wrong-family nearby source blending
for explicit lightweight-steel support. Gate Z is landed; the incident
has now been split into landed wall route recovery and selected floor
family/source guard follow-up. Gate AA landed the numeric acceptance and
solver-domain hardening for complete grouped walls, not warning copy.
Gate AB landed the floor-family source guard: generic
`lightweight_steel_floor` impact routes now stay `needs_input` /
unsupported for `Ln,w`-family outputs until steel support form, carrier
geometry, upper impact package dynamic stiffness or source row, and
lower ceiling isolation are explicit. Exact same-family steel rows and
same-family bound rows still resolve. Gate AC has now landed the
steel-floor physics input/formula readiness boundary: source-absent
steel floors require explicit support form, carrier depth/spacing, upper
dynamic stiffness, load basis, and lower ceiling isolation before a
formula corridor can promote. Gate AD has now landed the first runtime
steel-floor impact formula corridor: complete explicit source-absent
steel predictor input now returns lab `Ln,w` / `DeltaLw` from
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`
instead of broad family blending, while exact measured rows remain first
precedence and missing carrier/lower-isolation inputs block fallback.
Gate AE has now landed steel-floor formula card/report parity: the Gate
AD runtime values stay unchanged, while workbench cards, output posture,
dynamic trace, support formula notes, validation mode, proposal dossier,
and Markdown report all expose `Lightweight-steel formula corridor`,
source-absent lab basis, and `+/-4.5 dB` / `+/-2.0 dB` tolerances
instead of generic scoped/heavy-reference wording. Gate AF has now
landed the first-class Dynamic Calculator steel-floor formula input
surface: user-facing support form, carrier depth/spacing, upper dynamic
stiffness, load basis, and lower ceiling isolation fields now bridge into
the Gate AD predictor input. Complete construction-image style steel rows
plus UI fields return lab `LnW 55.6`, `DeltaLw 22.4`, and
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`;
partial fields do not produce fake formula answers; unsafe duplicate
steel carriers are refused; exact measured rows remain first.
Gate AG has now landed steel-floor formula input-surface acceptance:
live workbench evaluation, local saved replay, server snapshot replay,
output cards, Markdown report payload, estimate API payload, impact-only
API payload, and hostile UI edits all preserve the same formula basis and
the same lab `LnW 55.6` / `DeltaLw 22.4` result for the complete
construction-image steel case. Missing and invalid steel physical fields
now name the exact blockers; field impact requests such as `L'n,w` and
`L'nT,w` remain unsupported instead of being promoted from the lab
formula.
Gate AG selection status:
`gate_ag_steel_floor_formula_input_surface_acceptance_landed_selected_accuracy_benchmark_gate_ah`.
Gate AG landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`.
Gate AG landed action:
`gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`.
Gate AG selected Gate AH file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`.
Gate AG selected Gate AH action:
`gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`.
Gate AG validation completed on 2026-05-07: Gate AG engine contract 1
file / 3 tests, web steel formula input-surface acceptance 1 file / 4
tests, Gate AF + Gate AG web focused suite 2 files / 8 tests, engine
typecheck, web typecheck, preflight `git diff --check`, and final `pnpm
calculator:gate:current` all passed. The final current gate covered
engine 313 files / 1778 tests, web 65 files / 284 tests plus 18 skipped,
repo build, and whitespace guard. The Gate AG web acceptance test emits
known non-fatal Zustand persist storage warnings under Node/Vitest; the
web build still emits the known non-fatal optional `sharp/@img` package
warnings.
Gate AH has now landed steel-floor formula accuracy benchmark expansion:
three same-family Pliteq steel-joist lab `Ln,w` holdouts compare against
explicit formula inputs and stay within the current `+/-4.5 dB Ln,w`
corridor, with max residual `0.6 dB` and mean residual `0.4 dB`.
`DeltaLw` measured residual count is still zero, so the `+/-2.0 dB
DeltaLw` corridor is kept but not tightened. 36 UBIQ open-web exact rows
are counted as source anchors but do not become residual rows when
carrier spacing, load basis, resilient dynamic stiffness, lower support
class, or upper-resilient topology is missing.
Gate AH selection status:
`gate_ah_steel_floor_formula_accuracy_benchmark_landed_selected_residual_policy_gate_ai`.
Gate AH landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`.
Gate AH landed action:
`gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`.
Gate AH selected Gate AI file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`.
Gate AH selected Gate AI action:
`gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`.
Gate AH focused validation completed on 2026-05-07: Gate AH engine
contract 1 file / 5 tests and engine typecheck passed. Full `pnpm
calculator:gate:current` passed with engine 314 files / 1783 tests, web
65 files / 284 passed + 18 skipped, and repo build 5/5 tasks. Known
non-fatal warnings remain the Node/Vitest Zustand persist storage warning
and optional `sharp` / `@img` Next build warnings via the DOCX export
dependency.

Gate AI has now landed steel-floor formula residual policy and
calibration readiness: `Ln,w` and `DeltaLw` each resolve through
executable `hold`, `tighten`, `widen`, or `retune_candidate` decisions.
The current evidence holds the corridor: `Ln,w` residuals are low but
come from only three same-family Pliteq holdouts; measured `DeltaLw`
residual count remains zero; paired negatives, source-owned open-web
formula inputs, and field/building basis owners are still missing. UBIQ
open-web exact rows remain calibration anchors only.
Gate AI selection status:
`gate_ai_steel_floor_formula_residual_policy_landed_selected_negative_boundary_delta_lw_gate_aj`.
Gate AI landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`.
Gate AI landed action:
`gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`.
Gate AI selected Gate AJ file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`.
Gate AI selected Gate AJ action:
`gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`.
Gate AI focused validation completed on 2026-05-07: Gate AI engine
contract 1 file / 5 tests and engine typecheck passed. Full `pnpm
calculator:gate:current` passed with engine 315 files / 1788 tests, web
65 files / 284 passed + 18 skipped, and repo build 5/5 tasks. Known
non-fatal warnings remain the Node/Vitest Zustand persist storage warning
and optional `sharp` / `@img` Next build warnings via the DOCX export
dependency.

Gate AJ has now landed steel-floor formula negative boundaries and
measured `DeltaLw` holdout intake. The four paired negatives protect
wrong support family selection, exact measured row precedence,
lab-to-field/building leakage, and source-absent design references. The
paired-negative blocker is removed from the residual-policy input, but
runtime values still hold because source-owned open-web formula inputs,
field/building owners, and accepted measured `DeltaLw` holdouts are not
complete. Product-catalog, Annex-C/inferred, field/ASTM, and
building-basis values cannot tighten the lab `DeltaLw` corridor.
Gate AJ selection status:
`gate_aj_steel_formula_negative_boundary_delta_lw_intake_landed_selected_source_owned_delta_lw_gate_ak`.
Gate AJ landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`.
Gate AJ landed action:
`gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`.
Gate AJ selected Gate AK file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`.
Gate AJ selected Gate AK action:
`gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`.
Gate AJ focused validation completed on 2026-05-07: Gate AJ engine
contract 1 file / 5 tests and engine typecheck passed. Full `pnpm
calculator:gate:current` passed with engine 316 files / 1793 tests, web
65 files / 284 passed + 18 skipped, repo build 5/5 tasks, and whitespace
guard clean. Known non-fatal warnings remain the Node/Vitest Zustand
persist storage warning and optional `sharp` / `@img` Next build
warnings via the DOCX export dependency.

Gate AK has now landed the source-owned same-stack lab `DeltaLw`
holdout packet contract. A candidate can tighten the steel-floor formula
residual only when the measured metric value, topology/support family,
carrier spacing, load basis, dynamic stiffness, lower support class,
upper-resilient topology, and paired negative boundary owner are all
source-owned. Current Pliteq rows remain `Ln,w` holdouts only; UBIQ
open-web rows remain anchors only; product-only, inferred, field, ASTM,
and building-prediction values are rejected for lab `DeltaLw` residual
tightening. Runtime values remain unchanged.
Gate AK selection status:
`gate_ak_delta_lw_holdout_packet_contract_landed_selected_first_source_owned_holdout_gate_al`.
Gate AK landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`.
Gate AK landed action:
`gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`.
Gate AK selected Gate AL file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`.
Gate AK selected Gate AL action:
`gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`.
Gate AK focused validation completed on 2026-05-07: Gate AK engine
contract 1 file / 5 tests and engine typecheck passed. Full `pnpm
calculator:gate:current` passed with engine 317 files / 1798 tests, web
65 files / 284 passed + 18 skipped, repo build 5/5 tasks, and whitespace
guard clean; `git diff --check` passed. Known non-fatal warnings remain
the Node/Vitest Zustand persist storage warning and optional `sharp` /
`@img` Next build warnings via the DOCX export dependency.

Gate AK report export/manual-edit revalidation checkpoint:
`docs/calculator/CHECKPOINT_2026-05-07_GATE_AK_REPORT_EXPORT_REVALIDATION_AND_PUSH_HANDOFF.md`.
The report editor remains a packaged proposal snapshot editor, not a
solver mutation surface. PDF and DOCX exports both consume the same
edited snapshot. Real manual-edit PDF and DOCX exports were generated
and checked with PDF text extraction, PDF PNG rendering/visual review,
DOCX zip integrity, and DOCX XML value extraction.

Broad Gate AK to Gate AL revalidation checkpoint:
`docs/calculator/CHECKPOINT_2026-05-07_BROAD_REVALIDATION_GATE_AK_TO_GATE_AL_HANDOFF.md`.
`pnpm check` passed after stale lint pins, impact validation fixture
drift, and ambiguous duplicate/disjoint lightweight-steel floor schedule
expectations were corrected. The Gate AD steel-floor formula corridor is
now present in the real-world floor and impact validation benchmark
corpora as an explicit predictor-input estimate lane. Runtime calculator
values were not retuned, and Gate AL remained the next step for a first
source-owned measured same-stack lab `DeltaLw` holdout packet.

Gate AL has now landed the first-holdout guard for source-owned
same-stack ISO lab `DeltaLw` steel-floor packets. It did not accept a
near-miss as a measured holdout: current Pliteq and UBIQ rows are
`Ln,w`/`Rw` evidence without owned `DeltaLw`, product-catalog `DeltaLw`
rows are not same-stack steel-floor formula holdouts, Annex/companion
values are inferred, and the checked REGUPOL steel C-joist source is
ASTM/IIC/STC basis rather than ISO lab `DeltaLw`. Runtime values remain
unchanged, and residual retune remains blocked until a real source-owned
packet exists.
Gate AL selection status:
`gate_al_source_owned_delta_lw_first_holdout_guard_landed_no_runtime_selected_source_packet_acquisition_gate_am`.
Gate AL landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`.
Gate AL landed action:
`gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`.
Gate AL selected Gate AM file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`.
Gate AL selected Gate AM action:
`gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`.
Gate AL focused validation completed on 2026-05-07: Gate AL engine
contract 1 file / 4 tests and engine typecheck passed. Full `pnpm
calculator:gate:current` passed after the Gate AJ/AK/AL doc-alignment
repair: engine 318 files / 1802 tests, web 65 files / 284 passed + 18
skipped, repo build 5/5 successful, and whitespace guard clean. `git
diff --check` passed. Known non-fatal warnings remain the Node/Vitest
Zustand persist storage warning and optional `sharp` / `@img` Next build
warnings via the DOCX export dependency.

Gate AM has now landed the source-owned `DeltaLw` source-packet
acquisition ledger. It did not loosen Gate AK/AL: REGUPOL steel
deck/joist and steel C-joist leads are wrong-basis STC/IIC evidence,
REGUPOL ISO `DeltaLw` leads are solid/concrete reference-floor evidence,
and SoundAdvisor is a metric-scope boundary reference rather than a
steel packet. Accepted source-owned same-stack ISO lab `DeltaLw`
holdouts remain zero, runtime values remain unchanged, and broad
source-library crawl remains blocked.
Gate AM selection status:
`gate_am_source_packet_acquisition_landed_no_runtime_selected_source_absent_uncertainty_gate_an`.
Gate AM landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`.
Gate AM landed action:
`gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`.
Gate AM selected Gate AN file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts`.
Gate AM selected Gate AN action:
`gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`.
Gate AM focused validation completed on 2026-05-07: Gate AM engine
contract 1 file / 5 tests, engine typecheck, focused Gate AJ/AK/AL/AM
contracts 4 files / 19 tests, full `pnpm calculator:gate:current`, and
`git diff --check` passed. Current gate totals: engine 319 files / 1807
tests, web 65 files / 284 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean.

Gate AN has now landed the source-absent steel-floor error-budget
contract. It keeps runtime values unchanged: complete steel formula
cases still report `Ln,w 55.6` and `DeltaLw 22.4`, with `Ln,w +/-4.5
dB` and `DeltaLw +/-2.0 dB` split into structured uncertainty terms.
Exact-source, needs-input, and unsafe-topology cases do not expose a
formula budget, and Gate AK/AM source rules remain strict.
Gate AN selection status:
`gate_an_source_absent_uncertainty_landed_no_runtime_selected_error_budget_surface_parity_gate_ao`.
Gate AN landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts`.
Gate AN landed action:
`gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`.
Gate AN selected Gate AO file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts`.
Gate AN selected Gate AO action:
`gate_ao_steel_floor_formula_error_budget_surface_parity_plan`.
Gate AN focused validation completed on 2026-05-07: Gate AN engine
contract 1 file / 6 tests, engine typecheck, focused Gate AM/AN
contracts 2 files / 11 tests, focused Gate AJ/AK/AL/AM/AN contracts 5
files / 25 tests, full `pnpm calculator:gate:current`, and `git diff
--check` passed before this validation-doc sync. Current gate totals:
engine 320 files / 1813 tests, web 65 files / 284 passed + 18 skipped,
repo build 5/5 successful, and whitespace guard clean.

Gate AO has now landed the steel-floor formula error-budget surface
parity contract. It carries Gate AN's structured payload through the
runtime impact schema, support trace, output cards, method/corridor
dossiers, Markdown report, calculator API, and impact-only API. Runtime
values remain unchanged at `Ln,w 55.6` and `DeltaLw 22.4`; exact-source,
needs-input, and unsafe-topology cases remain budget-free; the visible
payload keeps `origin source_absent_formula_error_budget` and
`notMeasuredEvidence true`.
Gate AO selection status:
`gate_ao_error_budget_surface_parity_landed_no_runtime_selected_error_budget_hostile_input_gate_ap`.
Gate AO landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts`.
Gate AO landed action:
`gate_ao_steel_floor_formula_error_budget_surface_parity_plan`.
Gate AO selected Gate AP file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts`.
Gate AO selected Gate AP action:
`gate_ap_steel_floor_formula_error_budget_hostile_input_plan`.
Gate AO validation completed on 2026-05-07: focused Gate AE/AN/AO
engine contracts passed 3 files / 15 tests, focused web steel-floor
card / budget-surface / input-surface parity passed 3 files / 7 tests,
full `pnpm calculator:gate:current` passed with engine 321 files / 1818
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Broad `pnpm check` passed after
a transient Google Fonts fetch timeout was isolated by a successful
build retry: lint, typecheck, engine 446 files / 2620 tests, web 172
files / 961 passed + 18 skipped, and build all passed. `git diff
--check` passed. Known non-fatal warnings remain the Node/Vitest Zustand
persist storage warning and optional `sharp` / `@img` Next build
warnings via the DOCX export dependency.

Gate AP has now landed the steel-floor formula error-budget hostile
input guard. Complete source-absent steel formula input, safe reorders,
and saved/API replay keep `Ln,w 55.6` / `DeltaLw 22.4` and identical
structured budgets. Missing physical inputs, duplicate/ambiguous steel
base structures, and exact-source precedence stay budget-free. Field
requests keep `L'n,w` and `L'nT,w` unsupported unless a field-context
route owns them; the lab budget is not aliased onto field metric ids.
Gate AP selection status:
`gate_ap_error_budget_hostile_input_landed_no_runtime_selected_calibration_readiness_gate_aq`.
Gate AP landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts`.
Gate AP landed action:
`gate_ap_steel_floor_formula_error_budget_hostile_input_plan`.
Gate AP selected Gate AQ file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts`.
Gate AP selected Gate AQ action:
`gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`.

Gate AQ has now landed the steel-floor formula error-budget calibration
readiness contract. Every current runtime budget term is mapped to a
source-owned evidence owner and current blocker; current `Ln,w` and
`DeltaLw` evidence still resolves to `hold`; product-only, inferred,
STC/IIC, field/building, wrong-reference-floor, concrete-reference, and
boundary-only evidence cannot tighten the corridor. Future `hold`,
`tighten`, `widen`, and `retune_candidate` branches are executable, but
runtime values and tolerances remain unchanged.
Gate AQ selection status:
`gate_aq_error_budget_calibration_readiness_landed_no_runtime_selected_calibration_evidence_intake_gate_ar`.
Gate AQ landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts`.
Gate AQ landed action:
`gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`.
Gate AQ selected Gate AR file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts`.
Gate AQ selected Gate AR action:
`gate_ar_steel_floor_formula_calibration_evidence_intake_plan`.
Gate AQ validation result:
focused Gate AQ passed 1 file / 7 tests; focused Gate AP/AQ continuity
passed 2 files / 14 tests; full `pnpm calculator:gate:current` passed
with engine 323 files / 1832 tests, web 66 files / 286 passed + 18
skipped, repo build 5/5 successful, whitespace guard clean, and post-doc
`git diff --check` passed. Broad `pnpm check` also passed: lint,
typecheck, engine 448 files / 2634 tests, web 172 files / 961 passed +
18 skipped, and build 5/5 successful.

Gate AR has now landed the steel-floor formula calibration evidence
intake ledger. Current Gate AK/AM local evidence is classified against
the Gate AQ owner map, accepted source-owned calibration packet count
remains zero, and wrong-basis, wrong-reference-floor, product/inferred,
missing-owner-field, and boundary-only evidence cannot tighten the lab
formula corridor. A future source-owned same-stack ISO `DeltaLw` packet
can satisfy the `source_owned_delta_lw_holdout_absence` owner, but still
cannot move runtime values until residual-policy thresholds are met.
Gate AR selection status:
`gate_ar_calibration_evidence_intake_landed_no_runtime_selected_owner_evidence_targeting_gate_as`.
Gate AR landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts`.
Gate AR landed action:
`gate_ar_steel_floor_formula_calibration_evidence_intake_plan`.
Gate AR selected Gate AS file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts`.
Gate AR selected Gate AS action:
`gate_as_steel_floor_formula_owner_evidence_targeting_plan`.
Gate AR validation result:
focused Gate AR passed 1 file / 7 tests; focused Gate AQ/AR continuity
passed 2 files / 14 tests; engine DTS build passed; full `pnpm
calculator:gate:current` passed with engine 324 files / 1839 tests, web
66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean; broad `pnpm check` passed with lint/typecheck
clean, engine 449 files / 2641 tests, web 172 files / 961 passed + 18
skipped, and repo build 5/5 successful.

Gate AS has now landed the steel-floor formula owner-evidence targeting
decision. It ranks all seven Gate AQ evidence owners, keeps current
local accepted source-owned packet count at zero, and selects same-stack
ISO lab `DeltaLw` packet ownership as the next narrow target. Runtime
values, current tolerances, exact-source precedence, and lab/field/building
basis separation remain unchanged.
Gate AS selection status:
`gate_as_owner_evidence_targeting_landed_no_runtime_selected_same_stack_delta_lw_packet_target_gate_at`.
Gate AS landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts`.
Gate AS landed action:
`gate_as_steel_floor_formula_owner_evidence_targeting_plan`.
Gate AS selected Gate AT file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts`.
Gate AS selected Gate AT action:
`gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan`.
Gate AS validation result:
focused Gate AS passed 1 file / 6 tests; focused Gate AR/AS continuity
passed 2 files / 13 tests; engine typecheck passed; engine DTS build
passed; full `pnpm calculator:gate:current` passed with engine 325
files / 1845 tests, web 66 files / 286 passed + 18 skipped, repo build
5/5 successful, and whitespace guard clean. Broad `pnpm check` was not
rerun because Gate AS is no-runtime/no-API/no-UI and the current-gate
plus engine typecheck/build cover the changed surfaces.

Gate AT has now landed the steel-floor formula same-stack ISO
`DeltaLw` packet target fixture contract. It uses the Gate AS selected
target as the only acceptance surface, accepts only the future
source-owned same-stack fixture as calibration evidence, rejects
product-only, wrong-basis, concrete-reference, boundary-only,
missing-owner, and rights-blocked fixtures, and keeps runtime values
unchanged.
Gate AT selection status:
`gate_at_same_stack_iso_delta_lw_packet_target_landed_no_runtime_selected_narrow_source_lead_gate_au`.
Gate AT landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts`.
Gate AT landed action:
`gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan`.
Gate AT selected Gate AU file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts`.
Gate AT selected Gate AU action:
`gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan`.
Gate AT validation result:
focused Gate AT passed 1 file / 7 tests; focused Gate AS/AT continuity
passed 2 files / 13 tests; engine typecheck passed; engine DTS build
passed; full `pnpm calculator:gate:current` passed with engine 326
files / 1852 tests, web 66 files / 286 passed + 18 skipped, repo build
5/5 successful, and whitespace guard clean. Broad `pnpm check` was not
rerun because Gate AT is no-runtime/no-API/no-UI and the current-gate
plus engine typecheck/build cover the changed surfaces.

Gate AU has now landed the steel-floor same-stack ISO `DeltaLw` narrow
source-lead plan. It uses the Gate AT acceptance surface as the only
source-lead scope, allows manufacturer lab-report index, accredited
lab-report index, and internal measurement packet leads to proceed only
as metadata-only acquisition targets, and rejects product-only,
wrong-basis, concrete-reference, boundary-only, missing-owner, and
rights-blocked leads.
Gate AU selection status:
`gate_au_same_stack_iso_delta_lw_narrow_source_lead_landed_no_runtime_selected_source_lead_intake_gate_av`.
Gate AU landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts`.
Gate AU landed action:
`gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan`.
Gate AU selected Gate AV file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts`.
Gate AU selected Gate AV action:
`gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan`.
Gate AU validation result:
focused Gate AU validation passed on 2026-05-08: Gate AU 1 file / 7
tests, Gate AT/AU continuity 2 files / 14 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate AU
has no runtime/API/UI surface change.

Gate AV has now landed the steel-floor same-stack ISO `DeltaLw`
source-lead intake ledger. It converts Gate AU accepted manufacturer
lab-report index, accredited lab-report index, and internal measurement
packet leads into metadata-only acquisition request targets, keeps
source text and measured metric values out of the ledger, blocks rejected
lead buckets at intake, and does not create source packets, calibration
evidence, exact overrides, retune evidence, or runtime movement.
Gate AV selection status:
`gate_av_same_stack_iso_delta_lw_source_lead_intake_landed_no_runtime_selected_packet_acquisition_readiness_gate_aw`.
Gate AV landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts`.
Gate AV landed action:
`gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan`.
Gate AV selected Gate AW file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts`.
Gate AV selected Gate AW action:
`gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan`.
Gate AV validation result:
focused Gate AV validation passed on 2026-05-08: Gate AV 1 file / 7
tests, Gate AU/AV continuity 2 files / 14 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate AV
has no runtime/API/UI surface change.

Gate AW has now landed the steel-floor same-stack ISO `DeltaLw`
packet-acquisition readiness contract. It uses only Gate AV accepted
intake rows as packet request candidates, requires rights-safe locator
metadata and all Gate AT/AK owner fields, blocks rejected intake rows,
and keeps ready packet requests separate from source packets, measured
rows, calibration evidence, exact overrides, retune evidence, and
runtime movement.
Gate AW selection status:
`gate_aw_same_stack_iso_delta_lw_packet_acquisition_readiness_landed_no_runtime_selected_packet_request_ledger_gate_ax`.
Gate AW landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts`.
Gate AW landed action:
`gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan`.
Gate AW selected Gate AX file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts`.
Gate AW selected Gate AX action:
`gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan`.
Gate AW validation result:
focused Gate AW validation passed on 2026-05-08: Gate AW 1 file / 7
tests, Gate AV/AW continuity 2 files / 14 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate AW
has no runtime/API/UI surface change.

Gate AX has now landed the steel-floor same-stack ISO `DeltaLw`
packet request ledger. It uses only Gate AW ready packet request rows as
rights-safe request-ledger entries, keeps blocked rows out, preserves
locator-only metadata and the Gate AT/AK owner checklist, and keeps
ledger entries separate from source packets, measured rows, calibration
evidence, exact overrides, retune evidence, and runtime movement.
Gate AX selection status:
`gate_ax_same_stack_iso_delta_lw_packet_request_ledger_landed_no_runtime_selected_packet_acceptance_boundary_gate_ay`.
Gate AX landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts`.
Gate AX landed action:
`gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan`.
Gate AX selected Gate AY file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts`.
Gate AX selected Gate AY action:
`gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan`.
Gate AX validation result:
focused Gate AX validation passed on 2026-05-08: Gate AX 1 file / 7
tests, Gate AW/AX continuity 2 files / 14 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate AX
has no runtime/API/UI surface change.

Gate AY has now landed the steel-floor same-stack ISO `DeltaLw`
packet acceptance boundary. It uses only Gate AX request-ledger rows as
current packet acceptance boundary rows, keeps current request entries in
request status until a source-owned packet exists, accepts only a
complete future same-stack ISO lab `DeltaLw` boundary probe, and rejects
wrong-basis, wrong-reference, product/inferred, rights-blocked,
missing-owner, and blocked-ledger probes. Accepted boundary packets are
not calibration evidence yet, not exact overrides, not retune input, not
field/building aliases, and not runtime movement.
Gate AY selection status:
`gate_ay_same_stack_iso_delta_lw_packet_acceptance_boundary_landed_no_runtime_selected_packet_calibration_candidate_gate_az`.
Gate AY landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts`.
Gate AY landed action:
`gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan`.
Gate AY selected Gate AZ file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`.
Gate AY selected Gate AZ action:
`gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan`.
Gate AY validation result:
focused Gate AY validation passed on 2026-05-08: Gate AY 1 file / 8
tests, Gate AX/AY continuity 2 files / 15 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate AY
has no runtime/API/UI surface change.

Gate AZ has now landed the steel-floor same-stack ISO `DeltaLw`
packet calibration-candidate boundary. It uses Gate AY accepted packet
boundary rows as the only calibration candidate source, keeps current
request-status rows and rejected Gate AY probes blocked, admits only the
accepted future same-stack ISO `DeltaLw` boundary probe as a calibration
evidence candidate, and requires rights-safe citation/locator metadata.
Calibration candidates are not residual-policy admissions, exact rows,
retune inputs, tolerance changes, field/building aliases, or runtime
movement.
Gate AZ selection status:
`gate_az_same_stack_iso_delta_lw_packet_calibration_candidate_landed_no_runtime_selected_residual_admission_boundary_gate_ba`.
Gate AZ landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`.
Gate AZ landed action:
`gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan`.
Gate AZ selected Gate BA file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`.
Gate AZ selected Gate BA action:
`gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan`.
Gate AZ validation result:
focused Gate AZ validation passed on 2026-05-08: Gate AZ 1 file / 8
tests, Gate AY/AZ continuity 2 files / 16 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate AZ
has no runtime/API/UI surface change.

Gate BA has now landed the steel-floor same-stack ISO `DeltaLw`
residual-admission boundary. It uses only Gate AZ accepted calibration
evidence candidates as residual-policy inputs, keeps current
request-status rows and rejected/blocked candidates out, requires
source-owned measured `DeltaLw`, same-stack steel reference, ISO lab
basis, all Gate AT/AK owner fields, paired negative-boundary ownership,
and rights-safe citation/locator metadata. The accepted future source
packet candidate can enter residual evaluation, but its policy remains
`hold` because holdout-count, paired-negative-boundary, open-web-input,
and field/building owner thresholds are incomplete. Gate BA does not
retune, tighten, widen, exact-promote, alias field/building metrics, or
move runtime.
Gate BA selection status:
`gate_ba_same_stack_iso_delta_lw_residual_admission_boundary_landed_no_runtime_selected_residual_policy_decision_gate_bb`.
Gate BA landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`.
Gate BA landed action:
`gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan`.
Gate BA selected Gate BB file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`.
Gate BA selected Gate BB action:
`gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan`.
Gate BA validation result:
focused Gate BA validation passed on 2026-05-08: Gate BA 1 file / 8
tests, Gate AZ/BA continuity 2 files / 16 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BA
has no runtime/API/UI surface change.

Gate BB has now landed the steel-floor same-stack ISO `DeltaLw`
residual-policy decision surface. It uses only Gate BA residual-admitted
rows as policy-decision inputs, keeps current blocked rows and rejected
probes out, and classifies the accepted future same-stack ISO lab
`DeltaLw` row as `hold_current_corridor_policy_decision`. The blocker
closure requirements are explicit: 2 more source-owned `DeltaLw`
holdouts, 3 more paired negative boundaries, source-owned open-web
formula inputs, and field/building basis owners. Future
`retune_candidate`, `tighten`, or `widen` labels are later-gate signals
only and do not move runtime or tolerance values.
Gate BB selection status:
`gate_bb_same_stack_iso_delta_lw_residual_policy_decision_landed_no_runtime_selected_blocker_closure_gate_bc`.
Gate BB landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`.
Gate BB landed action:
`gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan`.
Gate BB selected Gate BC file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`.
Gate BB selected Gate BC action:
`gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan`.
Gate BB validation result:
focused Gate BB validation passed on 2026-05-08: Gate BB 1 file / 8
tests, Gate BA/BB continuity 2 files / 16 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BB
has no runtime/API/UI surface change.

Gate BC has now landed the steel-floor same-stack ISO `DeltaLw`
residual blocker-closure ranking. It uses only Gate BB accepted
policy-decision rows, keeps blocked rows and rejected probes out, and
selects the source-owned same-stack ISO lab `DeltaLw` holdout-count
closure lane for Gate BD because it directly improves residual case
count and has a shortfall of 2. Paired negative-boundary, open-web input
ownership, and field/building basis owner closure lanes remain ranked
follow-ups. Gate BC does not start a broad source crawl, ingest source
text/documents, exact-promote, retune, move tolerances, or move runtime.
Gate BC selection status:
`gate_bc_same_stack_iso_delta_lw_residual_blocker_closure_landed_no_runtime_selected_holdout_closure_gate_bd`.
Gate BC landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`.
Gate BC landed action:
`gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan`.
Gate BC selected Gate BD file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`.
Gate BC selected Gate BD action:
`gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan`.
Gate BC validation result:
focused Gate BC validation passed on 2026-05-08: Gate BC 1 file / 8
tests, Gate BB/BC continuity 2 files / 16 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BC
has no runtime/API/UI surface change.

Gate BD has now landed the steel-floor same-stack ISO `DeltaLw`
holdout-count closure boundary. It uses only Gate BC's selected
holdout-count lane, requires two additional source-owned same-stack ISO
lab `DeltaLw` holdouts to own the measured metric value, same-stack
steel reference, ISO lab basis, all Gate AT/AK owner fields, paired
negative-boundary ownership, and rights-safe locator metadata, and keeps
accepted rows as residual-readiness evidence only. Missing metric,
missing paired-negative owner, missing locator metadata, wrong basis or
reference, product/inferred values, and rights-blocked packets remain
rejected. Gate BD does not start a broad source crawl, ingest source
text/documents, exact-promote, retune, move tolerances, alias field/
building bases, or move runtime.
Gate BD selection status:
`gate_bd_same_stack_iso_delta_lw_holdout_closure_landed_no_runtime_selected_paired_negative_closure_gate_be`.
Gate BD landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`.
Gate BD landed action:
`gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan`.
Gate BD selected Gate BE file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts`.
Gate BD selected Gate BE action:
`gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan`.
Gate BD validation result:
focused Gate BD validation passed on 2026-05-08: Gate BD 1 file / 9
tests, Gate BC/BD continuity 2 files / 17 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BD
has no runtime/API/UI surface change.

Gate BE has now landed the steel-floor same-stack ISO `DeltaLw`
paired-negative closure boundary. It uses Gate BD's selected paired-
negative lane, requires three additional source-owned paired negatives
to own the target metric family, ISO lab basis, explicit wrong-support
or wrong-reference boundary, boundary identity, same-stack steel
exclusion reason, not-holdout scope, and rights-safe locator metadata,
and keeps accepted rows as residual-policy readiness evidence only.
Missing boundary owner fields, missing locator metadata, wrong metric
basis/family, product/inferred values, rights-blocked packets,
non-explicit boundaries, and same-stack steel non-boundaries remain
rejected. Gate BE does not start a broad source crawl, ingest source
text/documents, exact-promote, retune, move tolerances, alias field/
building bases, or move runtime.
Gate BE selection status:
`gate_be_same_stack_iso_delta_lw_paired_negative_closure_landed_no_runtime_selected_open_web_input_ownership_gate_bf`.
Gate BE landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts`.
Gate BE landed action:
`gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan`.
Gate BE selected Gate BF file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts`.
Gate BE selected Gate BF action:
`gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan`.
Gate BE validation result:
focused Gate BE validation passed on 2026-05-08: Gate BE 1 file / 10
tests, Gate BD/BE continuity 2 files / 19 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BE
has no runtime/API/UI surface change.

Gate BF has now landed the steel-floor same-stack ISO `DeltaLw`
open-web formula input ownership closure boundary. It uses Gate BE's
selected open-web input ownership lane, requires a future source-owned
open-web packet to own support form, carrier depth/spacing, load basis,
dynamic stiffness, lower support class, upper resilient topology, and
rights-safe locator metadata, and keeps accepted rows as residual-policy
readiness evidence only. Missing owner fields, missing physical input
values, missing locator metadata, wrong basis, wrong support form,
product/inferred claims, rights-blocked packets, and missing upper
topology remain rejected. Gate BF does not start a broad source crawl,
ingest source text/documents, exact-promote, retune, move tolerances,
alias field/building bases, or move runtime.
Gate BF selection status:
`gate_bf_same_stack_iso_delta_lw_open_web_input_ownership_closure_landed_no_runtime_selected_field_building_basis_owner_gate_bg`.
Gate BF landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts`.
Gate BF landed action:
`gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan`.
Gate BF selected Gate BG file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts`.
Gate BF selected Gate BG action:
`gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan`.
Gate BF validation result:
focused Gate BF validation passed on 2026-05-08: Gate BF 1 file / 9
tests, Gate BE/BF continuity 2 files / 19 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BF
has no runtime/API/UI surface change.

Gate BG has now landed the steel-floor same-stack ISO `DeltaLw`
field/building basis owner closure boundary. It uses Gate BF's selected
field/building basis owner lane, requires separate field apparent impact
and building-prediction owners, and keeps accepted rows as
residual-policy readiness evidence only. Field packets must own
`L'n,w` / `L'nT,w` context, building packets must own building-
prediction context, and both must own room geometry/volume, separating
element area, junction/flanking context, reverberation/normalization
basis, and rights-safe locator or project-context metadata. Missing
owner fields, missing context values, missing locator/project metadata,
wrong basis, lab-corridor alias attempts, wrong metric family,
product/inferred claims, and rights-blocked packets remain rejected.
Gate BG does not start a broad source crawl, ingest source text/
documents, exact-promote, retune, move tolerances, alias lab values to
field/building outputs, or move runtime.
Gate BG selection status:
`gate_bg_same_stack_iso_delta_lw_field_building_basis_owner_closure_landed_no_runtime_selected_residual_policy_revalidation_gate_bh`.
Gate BG landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts`.
Gate BG landed action:
`gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan`.
Gate BG selected Gate BH file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`.
Gate BG selected Gate BH action:
`gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan`.
Gate BG validation result:
focused Gate BG validation passed on 2026-05-08: Gate BG 1 file / 9
tests, Gate BF/BG continuity 2 files / 18 tests, engine typecheck,
engine build, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BG
has no runtime/API/UI surface change.

Gate BH has now landed the steel-floor same-stack ISO `DeltaLw`
residual-policy closed-owner revalidation. It uses Gate BG's selected
closed-owner lane, preserves Gate BD holdout-count closure, Gate BE
paired-negative closure, Gate BF open-web formula input ownership, and
Gate BG field/building basis ownership as evidence-only owner-map
closures, and revalidates the closed map as a policy-only `tighten`
candidate (`max 0.6 dB`, `mean 0.6 dB`). Gate BH does not move runtime,
change tolerance, retune the formula, exact-promote, ingest source
text/documents, or alias lab values to field/building outputs.
Gate BH selection status:
`gate_bh_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_landed_no_runtime_selected_tighten_candidate_governance_gate_bi`.
Gate BH landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`.
Gate BH landed action:
`gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan`.
Gate BH selected Gate BI file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`.
Gate BH selected Gate BI action:
`gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`.
Gate BH validation result:
focused Gate BH validation passed on 2026-05-08: Gate BH 1 file / 8
tests, Gate BG/BH continuity 2 files / 17 tests, Gate BD/BE/BF/BG/BH
closure continuity 5 files / 45 tests, Gate AE doc breadcrumb regression
1 file / 4 tests, engine typecheck, engine build, full `pnpm
calculator:gate:current`, repo build 5/5, and whitespace guard clean.
Broad `pnpm check` was not rerun because Gate BH has no runtime/API/UI
surface change.

Gate BI has now landed as that no-runtime governance guard. The Gate BH
`tighten` candidate remains a proposal label only: no runtime value,
tolerance, source ingestion, exact row, formula coefficient,
card/report/API surface, or field/building alias moved. Future corridor
movement still requires independent measured residual ownership,
topology diversity, rights/citation posture, exact-source boundaries,
basis owners, a tolerance-delta runtime proposal, and visible/API parity.
The selected lane is
`personal_use_mvp_coverage_sprint_after_gate_bi`, starting with
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`
and action `gate_a_personal_use_mvp_coverage_matrix_plan`. This is the
highest-ROI path because it turns broad calculator usefulness into an
executable coverage map before selecting the next algorithmic solver
lane.
Gate BI selection status:
`gate_bi_same_stack_iso_delta_lw_tighten_candidate_governance_landed_no_runtime_selected_personal_use_mvp_coverage_sprint_gate_a`.
Gate BI landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`.
Gate BI landed action:
`gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`.
Gate BI validation result:
focused Gate BI validation passed on 2026-05-08: Gate BI 1 file / 7
tests, Gate BH/BI continuity 2 files / 15 tests, Gate BD/BE/BF/BG/BH/BI
closure continuity 6 files / 52 tests, engine typecheck, engine
build/DTS, full `pnpm calculator:gate:current`, repo build 5/5, and
whitespace guard clean. Known warnings were existing Zustand storage and
optional sharp package warnings.

Personal-Use MVP Coverage Sprint Gate A has now landed as the executable
coverage matrix selected by Gate BI. It records 24 common and hostile
wall/floor scenarios through current public engine entry points, pins
numeric values and basis where the calculator returns a result, and pins
missing-input or unsupported boundaries where it must fail closed. It
does not move runtime values. The selected Gate B lane is timber/CLT
floor-impact `DeltaLw` input and physics ownership because current
timber/CLT rows can produce `Ln,w` posture but still block `DeltaLw`.
Gate A selection status:
`gate_a_personal_use_mvp_coverage_matrix_landed_no_runtime_selected_timber_clt_floor_impact_delta_lw_gate_b`.
Gate A landed file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`.
Gate A landed action:
`gate_a_personal_use_mvp_coverage_matrix_plan`.
Gate A selected Gate B file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`.
Gate A selected Gate B action:
`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`.
Gate A validation result:
focused Gate A validation passed on 2026-05-08: Gate A 1 file / 7
tests, Gate BI/Gate A continuity 2 files / 14 tests, engine typecheck,
full `pnpm calculator:gate:current`, engine 342 files / 1979 tests, web
66 files / 286 passed + 18 skipped, repo build 5/5, and whitespace
guard clean. Known warnings were existing Zustand storage and optional
sharp package warnings.

Personal-Use MVP Coverage Sprint Gate B has now landed as the
timber/CLT floor-impact `DeltaLw` input and formula-readiness contract
selected by Gate A. It names the required physical fields
`baseSlabOrFloor`, `toppingOrFloatingLayer`,
`resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`, and
`ceilingOrLowerAssembly`; complete timber joist and CLT inputs are ready
for the next formula corridor, but current runtime remains unchanged:
timber exact `Ln,w 51` and CLT family `Ln,w 50` still leave `DeltaLw`
unsupported. Missing physical fields return `needs_input`; ASTM
`IIC`/`AIIC`, field `L'n,w`/`L'nT,w`, steel floors, and exact `Ln,w`
source precedence do not alias or promote lab `DeltaLw`.
Gate B selection status:
`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_landed_no_runtime_selected_formula_corridor_gate_c`.
Gate B landed file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`.
Gate B landed action:
`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`.
Gate B selected Gate C file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`.
Gate B selected Gate C action:
`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan`.
Gate B validation result:
focused Gate B validation passed on 2026-05-08: Gate B 1 file / 8
tests, Gate A/Gate B continuity 2 files / 15 tests, Gate BI/Gate A/Gate
B continuity 3 files / 22 tests, engine typecheck, full
`pnpm calculator:gate:current`, engine 343 files / 1987 tests, web 66
files / 286 passed + 18 skipped, repo build 5/5, and whitespace guard
clean. Known warnings were existing Zustand storage and optional sharp
package warnings.

Personal-Use MVP Coverage Sprint Gate C has now landed as the
timber/CLT floor-impact `DeltaLw` formula-corridor contract selected by
Gate B. It names separate source-absent formula corridors for timber
joist and mass-timber CLT, terms for reference-floor `Ln,w`, loaded
upper mass, resilient dynamic stiffness, lower-assembly coupling, and
structural-family correction, and `+/-7.5 dB` design budgets that are
not measured evidence. Runtime remains unchanged: timber exact
`Ln,w 51`, CLT family `Ln,w 50`, and `DeltaLw` unsupported. Missing
physical inputs, ASTM/field/building basis, steel-family leakage, and
exact `Ln,w` precedence remain blocked.
Gate C selection status:
`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_d`.
Gate C landed file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`.
Gate C landed action:
`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan`.
Gate C selected Gate D file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts`.
Gate C selected Gate D action:
`gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan`.
Gate C validation result:
focused Gate C validation passed on 2026-05-08: Gate C 1 file / 7
tests, Gate B/Gate C continuity 2 files / 15 tests, Gate BI/Gate A/Gate
B/Gate C continuity 4 files / 29 tests, engine typecheck, full
`pnpm calculator:gate:current`, engine 344 files / 1994 tests, web 66
files / 286 passed + 18 skipped, repo build 5/5, and whitespace guard
clean. Known warnings were existing Zustand storage and optional
`sharp/@img` package warnings.

Personal-Use MVP Coverage Sprint Gate D has now landed as the runtime
promotion for that timber/CLT `DeltaLw` corridor. Explicit complete
timber joist input returns exact `Ln,w 51` plus source-absent lab
`DeltaLw 25.2`; explicit complete CLT input returns family `Ln,w 50`
plus source-absent lab `DeltaLw 22.6`. Both `DeltaLw` values carry
metric-specific formula bases and `+/-7.5 dB`
`source_absent_formula_error_budget` payloads marked not measured
evidence. Gate D selected Gate E surface/API/report parity:
`gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan`.

Previous Gate BG selection status:
`gate_bg_same_stack_iso_delta_lw_field_building_basis_owner_closure_landed_no_runtime_selected_residual_policy_revalidation_gate_bh`.
Previous Gate BG landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts`.
Previous Gate BG landed action:
`gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan`.
Previous Gate BG selected Gate BH file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`.
Previous Gate BG selected Gate BH action:
`gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan`.

Historical Gate AE selected Gate AF action:
`gate_af_steel_floor_formula_input_surface_plan`.
Historical Gate AE selected Gate AF file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`.

Previous Gate AD selection status:
`gate_ad_steel_floor_impact_formula_corridor_landed_selected_card_report_parity_gate_ae`.
Previous Gate AD landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts`.
Previous Gate AD landed action:
`gate_ad_steel_floor_impact_formula_numeric_corridor_plan`.
Previous Gate AD selected Gate AE file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts`.
Previous Gate AD selected Gate AE action:
`gate_ae_steel_floor_formula_card_and_report_parity_plan`.
Gate AD validation completed on 2026-05-07: focused Gate AD 1 file / 6
tests, Gate AC/Gate AD plus predictor-input regression 3 files / 55
tests, impact-only fallback regression 1 file / 102 tests, engine
typecheck, final `pnpm calculator:gate:current` with engine 310 files /
1766 tests and web 62 files / 275 tests plus 18 skipped, repo build,
whitespace guard, and final `git diff --check` all passed. The Next
build still emits the known non-fatal `sharp` optional `@img` package
warnings.

Previous Gate AC selection status:
`gate_ac_steel_floor_physics_input_contract_landed_selected_formula_corridor_gate_ad`.
Previous Gate AC selected Gate AD file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts`.
Previous Gate AC selected Gate AD action:
`gate_ad_steel_floor_impact_formula_numeric_corridor_plan`.

Previous Gate AB selection status:
`gate_ab_floor_family_source_guard_landed_selected_steel_floor_physics_input_gate_ac`.
Previous Gate AB selected Gate AC file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts`.
Previous Gate AB selected Gate AC action:
`gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`.

Gate AA recovered the construction-image shared-wall accuracy incident:
complete grouped mineral-wool triple-leaf topology now routes to the
triple-leaf two-cavity frequency solver by physical domain, not by the
old `50 mm / 50 mm` benchmark fixture. The explicit 80/80 mm grouped
construction-image scenario now returns `Rw 61`, `STC 61`, `C -1.7`,
and `Ctr -6.8` from the same curve as the direct solver; flat-list
ACON-like input still remains `needs_input`.

Gate AA validation completed on 2026-05-07: focused Gate I/AA/G/J/M
regression passed 5 files / 32 tests. Engine typecheck passed. `pnpm
calculator:gate:current` passed with engine 307 files / 1749 tests, web
62 files / 275 tests plus 18 skipped, repo build, and whitespace guard.
Known optional `sharp/@img` Next build warnings remain non-fatal.

Current selection status:

`gate_aa_construction_image_route_selection_recovered_selected_floor_family_guard_gate_ab`

Gate AA landed action:

`gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`

Selected next Gate AB file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts`

Selected next Gate AB action:

`gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan`

Latest Gate AA checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AA_HANDOFF.md`

Previous Gate Z selection status:

`gate_z_floor_impact_field_runtime_landed_selected_construction_image_accuracy_incident_gate_aa`

Previous Gate Y selection status:

`gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z`

Previous Gate Y selected Gate Z action:

`gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`

Previous Gate X selection status:

`gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y`

Previous Gate X selected Gate Y file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`

Previous Gate X selected Gate Y action:

`gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`

Previous Gate X checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_X_HANDOFF.md`

Previous Gate W selection status:

`gate_w_floor_impact_runtime_landed_selected_next_dynamic_calculator_solver_or_field_context_gate_x`

Previous Gate W selected Gate X action:

`gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary`

Previous Gate V selection status:

`gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w`

Gate V selected Gate W file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`

Gate V selected Gate W action:

`gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator`

Latest Gate W checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_W_HANDOFF.md`

Previous Gate U selection status:

`gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`

Gate U selected Gate V file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`

Gate U selected Gate V action:

`gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`

Previous Gate V checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_V_HANDOFF.md`

Latest Gate U revalidation / commit-prep checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_REVALIDATION_AND_COMMIT_HANDOFF.md`

This revalidation confirms `main` is even with `origin/main`,
`pnpm calculator:gate:current` is green, broad `pnpm check` is green,
and Gate V remains the correct first implementation step. The broad
check caught and fixed two proposal-surface regressions outside the
focused current gate: developer/lab-ready proposal branding is distinct
again, and printable proposal HTML keeps missing-input caveats visible
under client-facing `Calculation caveats` / `Open issue notes` wording
without exposing the raw `Warnings` heading.

The latest manual export checkpoint also confirms the report-export
workflow with real generated artifacts: manual edits in
`/workbench/proposal/configure` change only the packaged proposal
snapshot, and both PDF and DOCX exports use that edited snapshot. PDF
was rendered to PNG and checked visually; DOCX package integrity and
Word XML content confirmed the same manual values. Calculator inputs,
solver routes, and engine outputs remain untouched by report edits.

Current runtime reality: grouped explicit-topology Rockwool triple-leaf
returns lab `Rw 50 / STC 55 / C 0.8 / Ctr -7.3` as uncalibrated
`family_physics_prediction`. It is not measured exact or
source-validated. The flat-list split/internal Rockwool stack remains
guarded at diagnostic `Rw 41` with unsupported target outputs until the
user supplies grouped topology.

Gate N landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts`

Gate N landed action:

`gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator`

Gate N selection status:

`gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o`

Gate N selected Gate O file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts`

Gate N selected Gate O action:

`gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`

Gate O landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts`

Gate O landed action:

`gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`

Gate O selection status:

`gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p`

Gate O selected Gate P file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`

Gate O selected Gate P action:

`gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`

Gate P landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`

Gate P landed action:

`gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`

Gate P selection status:

`gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q`

Gate P selected Gate Q file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`

Gate P selected Gate Q action:

`gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`

Gate Q landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`

Gate Q landed action:

`gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`

Gate Q selection status:

`gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r`

Gate Q selected Gate R file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`

Gate Q selected Gate R action:

`gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`

Gate R landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`

Gate R landed action:

`gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`

Gate R selection status:

`gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s`

Gate R selected Gate S file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts`

Gate R selected Gate S action:

`gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator`

Previous Gate M landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`

Previous Gate M landed action:

`gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator`

Previous Gate M selection status:

`gate_m_dynamic_candidate_resolver_runtime_landed_no_value_selected_family_solver_upgrade_gate_n`

Gate M selected Gate N file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts`

Gate M selected Gate N action:

`gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator`

Previous Gate L landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts`

Previous Gate L landed action:

`gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator`

Previous Gate L selection status:

`gate_l_topology_normalizer_hostile_input_guard_landed_no_runtime_selected_candidate_resolver_gate_m`

Gate L selected Gate M file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`

Gate L selected Gate M action:

`gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator`

Previous Gate K landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts`

Previous Gate K landed action:

`gate_k_define_route_input_topology_contracts_for_dynamic_calculator`

Previous Gate K selection status:

`gate_k_route_input_topology_contract_landed_no_runtime_selected_topology_normalizer_gate_l`

Gate K selected Gate L file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts`

Gate K selected Gate L action:

`gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator`

Previous Gate J landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts`

Previous Gate J landed action:

`gate_j_build_personal_use_readiness_scenario_pack`

Previous Gate J selection status:

`gate_j_personal_use_readiness_scenario_pack_landed_no_runtime_selected_route_input_topology_gate_k`

Gate J selected Gate K file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts`

Gate J selected Gate K action:

`gate_k_define_route_input_topology_contracts_for_dynamic_calculator`

Previous Gate I landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`

Gate I landed action:

`gate_i_expand_family_material_properties_and_benchmark_scenarios`

Gate I selection status:

`gate_i_family_material_properties_and_benchmark_scenarios_landed_no_runtime_selected_personal_use_readiness_gate_j`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`

Selected next action:

`gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`

Previous Gate H landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts`

Previous Gate H landed action:

`gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver`

Previous Gate H selection status:

`gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i`

Gate H selected Gate I file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`

Gate H selected Gate I action:

`gate_i_expand_family_material_properties_and_benchmark_scenarios`

Previous Gate G landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts`

Previous Gate G landed action:

`gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks`

Previous Gate G selection status:

`gate_g_grouped_rockwool_family_physics_prediction_landed_selected_source_calibration_gate_h`

Previous Gate E landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`

Previous Gate E landed action:

`gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`

Previous Gate E selection status:

`gate_e_airborne_candidate_resolver_landed_no_runtime_selected_grouped_rockwool_prediction_gate_g`

Previous Gate D landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`

Previous Gate D landed action:

`gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`

Previous Gate D selection status:

`gate_d_input_completeness_matrix_landed_no_runtime_selected_airborne_candidate_resolver_gate_e`

Previous Gate C landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`

Previous Gate C landed action:

`gate_c_inventory_rating_adapter_integrity_without_value_movement`

Previous Gate C selection status:

`gate_c_rating_adapter_integrity_landed_no_runtime_selected_input_completeness_gate_d`

Gate B landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`

Gate B landed action:

`gate_b_defined_shared_airborne_basis_candidate_schema_without_value_movement`

Gate A selected Gate B action:

`gate_b_define_shared_airborne_basis_candidate_schema_without_value_movement`

Gate C selected the Gate D file/action that has now landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`

Gate C selected Gate D action:

`gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`

If an untracked similarly named file such as
`packages/engine/src/calculator-model-first-pivot-gate-a-contract.test.ts`
is present, treat it as a stale/partial local artifact. The landed Gate A
target is
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`.

## Agent Resume Triangle

Read these in order. If they disagree with each other, stop and fix the
drift before starting implementation.

1. [../../AGENTS.md](../../AGENTS.md) — repository-level calculator
   authority order and current workflow.
2. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) —
   tactical detail for the active slice.
3. [CURRENT_STATE.md](./CURRENT_STATE.md) — short snapshot of what is
   stable right now, active slice, and deferred follow-up tracks.
4. [SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md](./SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md)
   — active model-first pivot plan.
5. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Q_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Q_HANDOFF.md)
   — latest landed Gate Q double-leaf / framed bridge input-contract
   and Gate R solver-candidate handoff.
6. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_P_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_P_HANDOFF.md)
   — previous landed Gate P next-family solver selection and Gate Q
   double-leaf / framed bridge input-contract handoff.
7. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_O_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_O_HANDOFF.md)
   — previous landed Gate O single-leaf / massive / panel runtime
   promotion and Gate P next-family selection handoff.
8. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_N_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_N_HANDOFF.md)
   — previous landed Gate N family-solver upgrade selection and Gate O
   single-leaf / massive / panel runtime handoff.
9. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_M_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_M_HANDOFF.md)
   — previous landed Gate M dynamic candidate resolver runtime surface
   and Gate N selection.
10. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_L_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_L_HANDOFF.md)
   — previous landed Gate L topology normalizer / hostile input guard and
   Gate M selection.
9. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_K_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_K_HANDOFF.md)
   — previous landed Gate K route/input topology contract, validation,
   and Gate L selection.
10. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_J_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_J_HANDOFF.md)
   — latest landed Gate J personal-use readiness scenario pack,
   validation, and Gate K selection.
11. [CHECKPOINT_2026-05-06_GATE_I_REPORT_EXPORT_MANUAL_EDIT_VALIDATION_HANDOFF.md](./CHECKPOINT_2026-05-06_GATE_I_REPORT_EXPORT_MANUAL_EDIT_VALIDATION_HANDOFF.md)
   — previous Gate I/report-export checkpoint with generated PDF/DOCX
   manual-edit verification and Gate J handoff.
12. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_I_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_I_HANDOFF.md)
   — previous landed Gate I material-property expansion / benchmark
   readiness contract and Gate J selection.
13. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md)
   — latest landed Gate H source calibration / exact-promotion policy
   contract and Gate I selection.
14. [CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md](./CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md)
   — Gate H validation, report editor PDF/DOCX export readiness, and
   Gate I handoff.
15. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md)
   — landed Gate G grouped Rockwool family-physics prediction contract
   and Gate H selection.
16. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md)
   — latest landed Gate E no-runtime airborne candidate resolver
   contract and Gate G selection.
17. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md)
   — landed Gate D no-runtime input-completeness contract and Gate E
   selection.
18. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md)
   — latest landed Gate C no-runtime rating-adapter integrity contract
   and Gate D selection.
19. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md)
   — latest landed Gate B no-runtime schema contract and Gate C
   selection.
20. [CHECKPOINT_2026-05-06_ACOUSTIC_CALCULATOR_PLAN_REVALIDATION_HANDOFF.md](./CHECKPOINT_2026-05-06_ACOUSTIC_CALCULATOR_PLAN_REVALIDATION_HANDOFF.md)
   — acoustic-calculator plan revalidation and execution handoff.
21. [CHECKPOINT_2026-05-06_MODEL_FIRST_GATE_A_REVALIDATION_COMMIT_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_GATE_A_REVALIDATION_COMMIT_HANDOFF.md)
   — checkpoint/revalidation handoff after Gate A; historical Gate B
   selection context and model-first calculation goal.
22. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md)
   — latest landed Gate A no-runtime contract and Gate B selection.
22. [CHECKPOINT_2026-05-06_MODEL_FIRST_BENCHMARK_ACCEPTANCE_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_BENCHMARK_ACCEPTANCE_HANDOFF.md)
   — benchmark/acceptance lanes and runtime stop rules.
23. [CHECKPOINT_2026-05-05_STANDARDS_RESEARCH_PLAN_DETAIL_HANDOFF.md](./CHECKPOINT_2026-05-05_STANDARDS_RESEARCH_PLAN_DETAIL_HANDOFF.md)
   — latest standards research and detailed gate plan.
24. [CHECKPOINT_2026-05-05_DOC_IMPLEMENTATION_RECONCILIATION_HANDOFF.md](./CHECKPOINT_2026-05-05_DOC_IMPLEMENTATION_RECONCILIATION_HANDOFF.md)
   — latest doc/implementation reconciliation checkpoint.
25. [CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md](./CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md)
   — model-first re-analysis checkpoint.
26. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
   — answer-origin contract: exact, anchored delta, calibrated physics,
   physics prediction, bounded, screening, needs-input, unsupported.
22. [SYSTEM_MAP.md](./SYSTEM_MAP.md) — runtime file map and user-flow
   boundaries.
23. [MASTER_PLAN.md](./MASTER_PLAN.md) — strategic roadmap and
   implementation sequence.

Older `CHECKPOINT_*` and `SLICE_*` docs are historical snapshots unless
one of the files above explicitly promotes them. Their words like
"current", "active", or "selected next action" are only true for the
date/slice they recorded.

Then run `pnpm calculator:gate:current` when runtime behavior changes,
and always run `git diff --check` before handoff.

## Supporting Reads

The entries below are backlog/history context. They are not the active
source of truth when they conflict with the resume triangle above.

- [CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md](./CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md)
  — productization closeout: server-backed project storage v1 closed.
- [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
  — closed calculator readiness chain and private/internal-use caveats.
- [CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A selected
  `internal_use_operating_envelope_v1`.
- [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_CLEAN_STOP_GATE_C_READY_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_CLEAN_STOP_GATE_C_READY_HANDOFF.md)
  — historical 2026-04-28 handoff for internal-use operating-envelope
  context.
- [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md)
  — prior calculator handoff: broad validation green, no runtime
  posture movement, Gate C ready.
- [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_B_HANDOFF.md)
  — prior calculator handoff: Gate B landed source-gated visible
  honesty for dynamic wall formula routes and selected Gate C closeout.
- [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_A_HANDOFF.md)
  — prior calculator handoff: pilot usage note and scenario summary
  landed no-runtime.
- [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md)
  — company-internal pilot operating envelope: pilot-ready lanes,
  caveated lanes, and fail-closed/source-gated lanes.
- [CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed the framed split slice and
  selected `calculator_source_gap_revalidation_v3`.
- [CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_B_HANDOFF.md)
  — prior calculator handoff: Gate B fixed current LSF field +1 dB
  value drift plus monotonic-floor warning and added paired web-card
  coverage.
- [SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md](./SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md)
  — closed implementation plan: Gate B fixed the LSF field board-split
  value/warning drift while keeping exact/source posture, support,
  confidence, and board-coalescing boundaries protected.
- [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md)
  — closed implementation plan: Gate A reranked remaining source and
  accuracy gaps after the framed split fix.
- [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md)
  — historical internal-use operating-envelope plan.
- [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
  — source-gated accuracy roadmap: timber double-board, CLT wall,
  lined/heavy-core wall, no-stud double-leaf, floor fallback, and
  historical blocked floor families.
- [CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed the expanded floor-order
  slice no-runtime and selected
  `wall_framed_facing_split_warning_stability_v1`.
- [CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A found no runtime/card drift and
  selected Gate C no-runtime closeout.
- [CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A selected
  `floor_layer_order_invariance_expansion_v1` after source/import
  candidates remained blocked.
- [SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md](./SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md)
  — closed implementation plan: Gate A landed the role-defined exact,
  raw order-sensitive, fail-closed impact, and many-layer/split reorder
  audit; Gate C closed no-runtime and selected framed-wall split
  warning stability.
- [CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed lined-massive /
  heavy-core source research no-runtime and selected source-gap
  revalidation v2.
- [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md)
  — closed implementation plan: Gate A re-ranked remaining floor/wall
  source and accuracy gaps and selected floor layer-order invariance
  expansion.
- [CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A landed lined-massive /
  heavy-core source and bounded lining-rule inventory no-runtime.
- [SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md)
  — closed implementation plan: Gate A inventoried source/tolerance
  posture and Gate C selected source-gap revalidation v2.
- [CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed CLT wall source research
  no-runtime and selected lined-massive / heavy-core source research.
- [CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A landed CLT wall source/tolerance
  inventory no-runtime and selected Gate C closeout.
- [SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md)
  — closed implementation plan: Gate A inventoried CLT wall
  source/tolerance posture and Gate C selected lined-massive /
  heavy-core source research.
- [CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed timber double-board
  no-runtime and selected CLT wall source research.
- [CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A landed timber double-board
  source/tolerance inventory no-runtime and selected Gate C closeout.
- [SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md)
  — closed implementation plan: Gate A inventoried timber double-board
  source/tolerance posture and Gate C selected CLT wall source research.
- [CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed no-stud double-leaf
  no-runtime and selected timber double-board source research.
- [CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed the source-catalog slice
  no-runtime and selected no-stud double-leaf source research.
- [SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md](./SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md)
  — closed implementation plan: Gate A inventoried targets, Gate B
  closed source-pack readiness, and Gate C selected no-stud double-leaf
  source research.
- [CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md)
  — prior calculator handoff: Gate B closed source-pack readiness
  no-runtime and selected no import pack.
- [CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A inventoried source targets,
  required metadata, readiness decisions, and negative boundaries.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed source-evidence
  acquisition no-runtime and selected wall source-catalog acquisition.
- [SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md)
  — closed implementation plan: Gate A classified evidence, Gate B
  reconciled bounded framed rows, and Gate C selected source-catalog
  acquisition.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B_HANDOFF.md)
  — prior calculator handoff: bounded W111 / W112 / W115 / W119 rows
  already fit current runtime behavior.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A classified source/tolerance
  candidates and selected bounded framed-wall reconciliation.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed double-leaf Sharp/Davy
  scoping no-runtime and selected source-evidence acquisition.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_HANDOFF.md)
  — prior calculator handoff: Gate B landed no-runtime and pinned the
  current formula-owned double-leaf / stud-cavity values.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_REVALIDATION.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_REVALIDATION.md)
  — prior calculator handoff: Gate B was still unimplemented, the plan
  still matched implementation, and validation was green.
- [CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md](./CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md)
  — prior calculator handoff: Gate A landed no-runtime and Gate B was
  made ready for the bounded current-value/source-tolerance matrix.
- [CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A_HANDOFF.md)
  — historical slice evidence: double-leaf, single-stud, and
  double-stud values were pinned with negative boundaries.
- [SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md)
  — closed implementation plan: Gate A and Gate B pinned the current
  double-leaf/stud posture, then Gate C closed no-runtime.
- [CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md)
  — prior handoff: source-gap revalidation Gate A closed no-runtime
  and selected wall coverage planning v2.
- [SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md](./SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md)
  — closed planning surface: selected single-leaf first and double-leaf
  / stud-cavity second.
- [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md)
  — closed Gate A implementation plan: source-gap revalidation selected
  wall coverage planning v2.
- [CHECKPOINT_2026-04-27_PROPOSAL_REPORT_POLISH_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-27_PROPOSAL_REPORT_POLISH_CLOSEOUT_HANDOFF.md)
  — prior handoff: proposal/report polish closed and calculator
  source-gap revalidation was selected.
- [CHECKPOINT_2026-04-27_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_HANDOFF.md](./CHECKPOINT_2026-04-27_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_HANDOFF.md)
  — productization handoff: owner-only route policy integration
  closed, and proposal/report polish was selected.
- [SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md](./SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md)
  — closed implementation plan: wired the pure owner/editor/reviewer/viewer
  policy through existing owner-scoped project/proposal routes without
  enabling team access yet.
- [SLICE_PROPOSAL_REPORT_POLISH_PLAN.md](./SLICE_PROPOSAL_REPORT_POLISH_PLAN.md)
  — closed implementation plan: tightened PDF/DOCX/workbench proposal
  honesty without changing acoustic calculations.
- [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_CLOSEOUT_HANDOFF.md)
  — previous calculator closeout: dynamic-airborne split v2 Gate C
  closed, C6 moved out of partial, and realistic layer-combination
  coverage cartography was selected.
- [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_ELEVENTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_ELEVENTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B eleventh carve
  landed before Gate C closeout.
- [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_TENTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_TENTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B tenth carve
  landed and the narrow-gap cap carve was selected.
- [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_NINTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_NINTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B ninth
  carve landed and the next bounded recursive monotonic-floor carve was
  selected.
- [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_EIGHTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_EIGHTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B eighth carve
  landed and the next bounded premium correction carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SEVENTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SEVENTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B seventh
  carve landed and the next bounded template carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SIXTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SIXTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B sixth
  carve landed and the next bounded field-trim carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FIFTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FIFTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B fifth
  carve landed and the next bounded field-lift carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FOURTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FOURTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B fourth
  carve landed and the next bounded field-lift carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_THIRD_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_THIRD_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B third
  carve landed and the next bounded field-lift carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SECOND_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SECOND_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B second
  carve landed and the next bounded field-trim carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FIRST_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FIRST_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B first
  carve landed and the next bounded cap carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_A_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate A landed
  no-runtime and selected the first Gate B composer-injection carve.
- [CHECKPOINT_2026-04-24_INVALID_THICKNESS_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_CLOSEOUT_HANDOFF.md)
  — calculator handoff: invalid-thickness closed no-runtime and
  dynamic-airborne split v2 was selected.
- [CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md)
  — calculator handoff: invalid-thickness Gate A landed no-runtime and
  Gate B was not required.
- [CHECKPOINT_2026-04-24_INVALID_THICKNESS_BASELINE_READY_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_BASELINE_READY_HANDOFF.md)
  — calculator handoff: post-commit baseline revalidated before
  invalid-thickness Gate A.
- [CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_CLOSEOUT_HANDOFF.md)
  — calculator handoff: floor layer-order closed no-runtime and
  all-caller invalid-thickness guard was selected.
- [CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_GATE_A_HANDOFF.md)
  — calculator handoff: floor layer-order Gate A landed no-runtime.
- [CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_CLOSEOUT_HANDOFF.md)
  — calculator handoff: floor 50+ layer stress regression closed
  no-runtime and floor layer-order edit stability was selected.
- [CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_GATE_A_HANDOFF.md)
  — calculator handoff: floor 50+ layer Gate A landed no-runtime.
- [CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_CLOSEOUT_HANDOFF.md)
  — calculator handoff: floor field-continuation closed no-runtime and
  floor 50+ layer stress regression was selected.
- [CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_C_CLOSEOUT_HANDOFF.md)
  — calculator handoff: resilient side-count Gate C closed and floor
  field-continuation expansion was selected.
- [CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md](./CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md)
  — productization closeout: team-access policy model closed.
- [CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md](./CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md)
  — productization closeout: auth-session hardening closed.
- [CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md](./CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md)
  — productization closeout: project-access authorization closed.
- [CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md](./CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md)
  — historical calculator closeout: final audit closed and
  productization handoff opened.
- [POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
  — productization roadmap; project-access route integration is
  deferred.
- [SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md](./SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md)
  — closed calculator architecture slice plan.
- [SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md](./SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md)
  — closed calculator planning surface; maps realistic layer
  combinations by evidence tier before selecting runtime widening.
- [SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md](./SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md)
  — closed UI/input/output honesty slice plan.
- [SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md)
  — closed direct invalid-thickness guard plan.
- [SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md](./SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md)
  — closed floor layer-order edit stability audit plan.
- [SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md](./SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md)
  — closed floor 50+ layer stress regression audit plan.
- [SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md](./SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md)
  — closed floor continuation audit plan.
- [SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md](./SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md)
  — closed resilient side-count modeling slice plan.
- [SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md](./SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md)
  — closed productization slice plan for wiring policy decisions into
  owner-scoped project/proposal routes.
- [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md)
  — closed calculator Gate A plan for source-gap inventory/rerank before
  runtime movement.
- [SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md](./SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md)
  — closed calculator planning slice for wall coverage expansion
  ordering.
- [SLICE_PROPOSAL_REPORT_POLISH_PLAN.md](./SLICE_PROPOSAL_REPORT_POLISH_PLAN.md)
  — closed productization slice plan for tightening proposal/report
  honesty without changing acoustic values.
- [SLICE_TEAM_ACCESS_MODEL_PLAN.md](./SLICE_TEAM_ACCESS_MODEL_PLAN.md)
  — closed productization slice plan for team/project role policy.
- [SLICE_AUTH_SESSION_HARDENING_PLAN.md](./SLICE_AUTH_SESSION_HARDENING_PLAN.md)
  — closed productization slice plan for login/session/logout hardening.
- [SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md](./SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md)
  — closed productization slice plan for project/proposal route
  authorization.
- [SLICE_SERVER_BACKED_PROJECT_STORAGE_PLAN.md](./SLICE_SERVER_BACKED_PROJECT_STORAGE_PLAN.md)
  — closed productization slice plan for server-backed project
  storage v1.
- [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
  — `dynamic-airborne.ts` split blueprint. v1 landed 2026-04-21;
  v2 Gate C closed on 2026-04-26, and the remaining recursive guards are
  optional architecture backlog.
- [SYSTEM_MAP.md](./SYSTEM_MAP.md) — end-to-end system model,
  runtime boundaries, persistence posture, test surface map.
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
  — answer-origin semantics and evidence-tier composition.
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) — source-backed
  widening / tightening / deferred-family ledger.

## Archived Documents

The following docs have moved to `docs/archive/`. They informed
earlier decisions but the living triangle above now supersedes
them. Check archive when you need historical context.

- `docs/archive/handoffs/` — closed-slice plans
  (`SLICE_LSF_TIMBER_PRESET_WITH_INVARIANTS_PLAN.md`,
  `SLICE_WALL_HOSTILE_INPUT_WITH_CARTOGRAPHY_PLAN.md`,
  `SLICE_WALL_FIELD_CONTINUATION_VALUE_PINNING_PLAN.md`,
  `SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md`,
  `SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md`,
  `SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md`); older
  checkpoint handoffs (2026-04-08 through 2026-04-22);
  `STABILIZATION_CHECKPOINT_2026-04-13.md`.
- `docs/archive/analysis/` — closed planning docs
  (`DYNAMIC_CALCULATOR_PLAN.md`,
  `DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md`,
  `DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md`,
  `WALL_COVERAGE_EXPANSION_PLAN.md`);
  `SYSTEM_AUDIT_2026-04-20.md`; historical wall-stability +
  suite-triage analyses.

## Document Freshness Rule

Every closed slice updates:

1. `CURRENT_STATE.md` — active slice moved + latest closed slice
   recorded + completion-signal table flipped.
2. `NEXT_IMPLEMENTATION_PLAN.md` — "Now" section points at the
   new active slice.
3. The slice's post-contract or focused route/unit tests —
   executable closure record.
4. `MASTER_PLAN.md` §3 implementation state grid + §4 master
   sequence row for the closed slice.

Skipping any of the four is how drift restarts.
