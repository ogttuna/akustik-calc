# Calculator Docs

Living reference docs for the DynEcho acoustic calculator. Read these
before anything under `docs/archive/` and before older dated
checkpoints in this folder.

## Current Source Of Truth

As of 2026-05-06 the active calculator direction is the
model-first physics prediction pivot:

`calculator_model_first_physics_prediction_pivot_v1`

This is a correction to the previous source-packet-first route.
DynEcho is an acoustic calculator first. Exact lab/source rows can
override or anchor known assemblies, but missing source packets must
not block a labelled family-specific physics prediction when the
required topology and material inputs are present.

Gate A, Gate B, Gate C, Gate D, Gate E, Gate G, and Gate H for this pivot have
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
moving runtime values or deleting the physics-prediction lane.

The latest wrap-up checkpoint also confirms the report-export workflow:
manual edits in `/workbench/proposal/configure` change only the packaged
proposal snapshot, and both PDF and DOCX exports use that edited
snapshot. Calculator inputs, solver routes, and engine outputs remain
untouched by report edits.

Current runtime reality: grouped explicit-topology Rockwool triple-leaf
returns lab `Rw 50 / STC 55 / C 0.8 / Ctr -7.3` as uncalibrated
`family_physics_prediction`. It is not measured exact or
source-validated. The flat-list split/internal Rockwool stack remains
guarded at diagnostic `Rw 41` with unsupported target outputs until the
user supplies grouped topology.

Gate H landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts`

Gate H landed action:

`gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver`

Gate H selection status:

`gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`

Selected next action:

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
5. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md)
   — latest landed Gate H source calibration / exact-promotion policy
   contract and Gate I selection.
6. [CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md](./CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md)
   — Gate H validation, report editor PDF/DOCX export readiness, and
   Gate I handoff.
7. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md)
   — landed Gate G grouped Rockwool family-physics prediction contract
   and Gate H selection.
8. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md)
   — latest landed Gate E no-runtime airborne candidate resolver
   contract and Gate G selection.
9. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md)
   — landed Gate D no-runtime input-completeness contract and Gate E
   selection.
10. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md)
   — latest landed Gate C no-runtime rating-adapter integrity contract
   and Gate D selection.
11. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md)
   — latest landed Gate B no-runtime schema contract and Gate C
   selection.
12. [CHECKPOINT_2026-05-06_ACOUSTIC_CALCULATOR_PLAN_REVALIDATION_HANDOFF.md](./CHECKPOINT_2026-05-06_ACOUSTIC_CALCULATOR_PLAN_REVALIDATION_HANDOFF.md)
   — acoustic-calculator plan revalidation and execution handoff.
13. [CHECKPOINT_2026-05-06_MODEL_FIRST_GATE_A_REVALIDATION_COMMIT_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_GATE_A_REVALIDATION_COMMIT_HANDOFF.md)
   — checkpoint/revalidation handoff after Gate A; historical Gate B
   selection context and model-first calculation goal.
14. [CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md)
   — latest landed Gate A no-runtime contract and Gate B selection.
15. [CHECKPOINT_2026-05-06_MODEL_FIRST_BENCHMARK_ACCEPTANCE_HANDOFF.md](./CHECKPOINT_2026-05-06_MODEL_FIRST_BENCHMARK_ACCEPTANCE_HANDOFF.md)
   — benchmark/acceptance lanes and runtime stop rules.
16. [CHECKPOINT_2026-05-05_STANDARDS_RESEARCH_PLAN_DETAIL_HANDOFF.md](./CHECKPOINT_2026-05-05_STANDARDS_RESEARCH_PLAN_DETAIL_HANDOFF.md)
   — latest standards research and detailed gate plan.
17. [CHECKPOINT_2026-05-05_DOC_IMPLEMENTATION_RECONCILIATION_HANDOFF.md](./CHECKPOINT_2026-05-05_DOC_IMPLEMENTATION_RECONCILIATION_HANDOFF.md)
   — latest doc/implementation reconciliation checkpoint.
18. [CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md](./CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md)
   — model-first re-analysis checkpoint.
19. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
   — answer-origin contract: exact, anchored delta, calibrated physics,
   physics prediction, bounded, screening, needs-input, unsupported.
20. [SYSTEM_MAP.md](./SYSTEM_MAP.md) — runtime file map and user-flow
   boundaries.
21. [MASTER_PLAN.md](./MASTER_PLAN.md) — strategic roadmap and
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
