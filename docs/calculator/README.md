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

Gate A, Gate B, Gate C, Gate D, Gate E, Gate G, Gate H, Gate I,
Gate J, Gate K, Gate L, Gate M, Gate N, Gate O, Gate P, Gate Q, Gate R,
Gate S, Gate T, Gate U, and Gate V for this pivot have
landed. Gate A made the corrected rule executable: source absence
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

Current selection status:

`gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w`

Selected next Gate W file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`

Selected next Gate W action:

`gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator`

Previous Gate U selection status:

`gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`

Gate U selected Gate V file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`

Gate U selected Gate V action:

`gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`

Latest Gate V checkpoint:

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
