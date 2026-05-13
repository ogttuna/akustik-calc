# Docs

Living reference docs for the DynEcho acoustic calculator.
Historical checkpoints, analysis notes, and closed-slice plans
live under `docs/archive/`; they inform history but never
override the living triangle under `docs/calculator/`.

## Start Here — Agent Resume Triangle

Three docs are authoritative for "where are we and what comes
next". If they disagree, fix the drift before starting work.

1. [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md)
   — short snapshot (what is stable right now, completion
   signals, active slice, deferred follow-up tracks)
2. [calculator/MASTER_PLAN.md](./calculator/MASTER_PLAN.md) —
   strategic roadmap, ROI ranking, accuracy preservation
   contract, quantitative completion targets
3. [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
   — tactical detail for the active slice

Then run `pnpm calculator:gate:current` before calculator runtime
changes. Productization slices should add their own focused tests and
use `pnpm check` when shared contracts move.

## Supporting Reads

- [calculator/CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md)
  — productization closeout: server-backed project storage v1 closed.
- [calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md)
  — historical broad handoff: broad validation green and calculator
  accuracy/coverage refocus selected.
- [calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_HANDOFF.md](./calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_HANDOFF.md)
  — company-internal daily-use ready handoff: Gate AU closed and
  selected Gate AV post-release accuracy/adapters roadmap.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_HANDOFF.md)
  — post-release roadmap handoff: Gate AV landed no-runtime and selected
  Gate AW source-absent solver gap cartography. Landed action:
  `gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan`;
  selection status:
  `gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw`;
  selected next action:
  `gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_HANDOFF.md)
  — source-absent cartography handoff: Gate AW landed no-runtime source-absent
  solver gap cartography and selected Gate AX advanced wall source-absent solver contract.
  Landed action:
  `gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`;
  selection status:
  `gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_landed_no_runtime_selected_advanced_wall_source_absent_solver_contract_gate_ax`;
  selected next action:
  `gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_HANDOFF.md)
  — advanced wall contract handoff: Gate AX landed no-runtime advanced wall source-absent solver contract
  and selected Gate AY runtime corridor. Landed action:
  `gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`;
  selection status:
  `gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_landed_no_runtime_selected_runtime_corridor_gate_ay`;
  selected next action:
  `gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_HANDOFF.md)
  — advanced wall runtime handoff: Gate AY landed the advanced wall
  source-absent solver runtime corridor and selected Gate AZ input
  surface. Landed action:
  `gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`;
  selection status:
  `gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_landed_selected_input_surface_gate_az`;
  selected next action:
  `gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts`.
  Short label: advanced wall source-absent solver runtime corridor.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_HANDOFF.md)
  — advanced wall input-surface handoff: Gate AZ landed the advanced wall
  source-absent solver input surface and selected Gate BA floor-impact
  source-absent solver gap cartography. Landed action:
  `gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`;
  selection status:
  `gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_landed_selected_floor_impact_source_absent_solver_gap_cartography_gate_ba`;
  selected next action:
  `gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts`.
  Short label: advanced wall source-absent solver input surface.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_HANDOFF.md)
  — prior calculator handoff: Gate BA landed no-runtime floor-impact
  source-absent solver gap cartography and selected Gate BB
  floor-impact source-absent input contract. Landed action:
  `gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`;
  selection status:
  `gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_landed_no_runtime_selected_floor_impact_source_absent_input_contract_gate_bb`;
  selected next action:
  `gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts`.
  Short label: floor-impact source-absent solver gap cartography.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_HANDOFF.md)
  — prior calculator handoff: Gate BB landed no-runtime
  floor-impact source-absent input contract and selected Gate BC
  floor-impact source-absent formula corridor. Landed action:
  `gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`;
  selection status:
  `gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_landed_no_runtime_selected_formula_corridor_gate_bc`;
  selected next action:
  `gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts`.
  Short label: floor-impact source-absent input contract.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_HANDOFF.md)
  — prior calculator handoff: Gate BC landed no-runtime
  floor-impact source-absent formula corridor and selected Gate BD
  floor-impact source-absent runtime corridor. Landed action:
  `gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`;
  selection status:
  `gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_bd`;
  selected next action:
  `gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts`.
  Short label: floor-impact source-absent formula corridor.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md)
  — prior calculator handoff: Gate BD landed the floor-impact
  source-absent runtime corridor and selected Gate BE surface parity.
  Landed action:
  `gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`;
  selection status:
  `gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_landed_selected_surface_parity_gate_be`;
  selected next action:
  `gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts`.
  Complete heavy-concrete combined input now returns `Ln,w 44.4` /
  `DeltaLw 30.1` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
  with `+/-6.5 dB` / `+/-5.5 dB` not-measured budgets. Short label:
  floor-impact source-absent runtime corridor. Next plain label:
  floor-impact source-absent surface parity. Validation passed on
  2026-05-13 with focused Gate BD, BA-BD continuity, impact regression,
  engine typecheck/build, `pnpm calculator:gate:current`, and
  `git diff --check`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_HANDOFF.md)
  — latest calculator handoff: Gate BH landed no-runtime
  floor-impact source-absent coverage matrix refresh after the
  `Heavy concrete combined input surface`. Landed action:
  `gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`;
  selection status:
  `gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_landed_no_runtime_selected_field_building_adapter_gate_bi`;
  selected next action:
  `gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`.
  The refreshed executable matrix has 21 floor rows and adds Gate BF/BG
  combined-heavy rows plus `floor.building_impact.prediction_adapter_boundary`.
  Complete and safe-reordered combined-heavy input remains lab
  `Ln,w 44.4` / `DeltaLw 30.1` with the same source-absent
  not-measured budgets. Short label: floor-impact source-absent coverage
  matrix refresh. Gate BI plain label: floor-impact field/building adapter contract.
  Validation passed on 2026-05-13 with focused Gate BH, Gate BG/BH
  continuity, engine typecheck, `pnpm calculator:gate:current`, full
  `pnpm check`, and whitespace guard clean.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_HANDOFF.md)
  — prior calculator handoff: Gate BG landed no-runtime
  floor-impact source-absent post-input-surface revalidation after the
  `Heavy concrete combined input surface` and selected Gate BH
  coverage matrix refresh. Landed action:
  `gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`;
  selection status:
  `gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_landed_no_runtime_selected_coverage_matrix_refresh_gate_bh`;
  selected next action:
  `gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts`.
  The revalidated runtime remains lab `Ln,w 44.4` / `DeltaLw 30.1`
  through the Gate BD predictor with the same source-absent
  not-measured budgets. Safe reorders, missing load basis, duplicate
  concrete base ownership, exact source precedence, and field/ASTM
  boundaries are covered. Short label: floor-impact source-absent
  post-input-surface revalidation. Next plain label:
  floor-impact source-absent coverage matrix refresh. Validation passed
  on 2026-05-13 with focused Gate BG, Gate BF/BG continuity, engine
  typecheck, `pnpm calculator:gate:current`, full `pnpm check`, and
  `git diff --check`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_HANDOFF.md)
  — prior calculator handoff: Gate BF landed the floor-impact
  source-absent input surface for the `Heavy concrete combined input surface`
  and selected Gate BG post-input-surface revalidation. Landed action:
  `gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`;
  selection status:
  `gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_landed_selected_revalidation_gate_bg`;
  selected next action:
  `gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg-floor-impact-source-absent-post-input-surface-revalidation-contract.test.ts`.
  Complete UI-derived heavy-concrete combined input now returns the
  same lab `Ln,w 44.4` / `DeltaLw 30.1` through the Gate BD runtime
  corridor with the same source-absent not-measured budgets. Partial
  fields stay `needs_input`, ambiguous concrete base ownership is
  unsafe, exact source precedence remains first, and field/building/ASTM
  aliases remain blocked. Short label: floor-impact source-absent input
  surface. Next plain label: floor-impact source-absent post-input-surface
  revalidation.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md)
  — prior calculator handoff: Gate BE landed the floor-impact
  source-absent surface parity for the `Heavy concrete combined formula corridor`
  and selected Gate BF input surface. Landed action:
  `gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`;
  selection status:
  `gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_landed_selected_input_surface_gate_bf`;
  selected next action:
  `gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts`.
  Runtime stays lab `Ln,w 44.4` / `DeltaLw 30.1` with the same
  source-absent not-measured budgets. Short label: floor-impact
  source-absent surface parity. Next plain label: floor-impact
  source-absent input surface. Validation passed on 2026-05-13 with
  focused Gate BE, Gate BD/BE continuity, focused web surface parity,
  engine/web typecheck, `pnpm calculator:gate:current`, full
  `pnpm check`, and `git diff --check`.
- [calculator/CHECKPOINT_2026-05-13_POST_GATE_BD_FULL_REVALIDATION_AND_GATE_BE_PLAN_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_POST_GATE_BD_FULL_REVALIDATION_AND_GATE_BE_PLAN_HANDOFF.md)
  — latest broad revalidation and planning checkpoint: post-Gate BD
  `pnpm check` passed with lint, typecheck, engine 522 files / 3103
  tests, web 182 files / 985 passed + 18 skipped, and build 5/5 after
  two lint-only cleanups. It confirms Gate BE surface parity is the
  first next implementation step.
- [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  — active calculator tactical plan; currently Gate BI floor-impact
  field/building adapter contract.
- [calculator/SLICE_PERSONAL_USE_MVP_GATE_AV_POST_RELEASE_ACCURACY_AND_ADAPTER_ROADMAP_PLAN.md](./calculator/SLICE_PERSONAL_USE_MVP_GATE_AV_POST_RELEASE_ACCURACY_AND_ADAPTER_ROADMAP_PLAN.md)
  — Gate AV analysis slice: no-runtime post-release roadmap,
  source-absent solver gap cartography selection, and ranked next
  accuracy/adapters work.
- [calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md)
  — productization closeout: team-access policy model closed.
- [calculator/CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md)
  — productization closeout: auth-session hardening closed.
- [calculator/CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md)
  — productization closeout: project-access authorization closed.
- [calculator/CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md)
  — latest calculator closeout: final audit closed and
  productization handoff opened.
- [calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
  — productization roadmap; route integration is deferred while the
  calculator accuracy/coverage slice is active.
- [calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md](./calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md)
  — closed calculator accuracy/coverage re-entry plan.
- [calculator/SYSTEM_MAP.md](./calculator/SYSTEM_MAP.md) —
  end-to-end system model, runtime boundaries, persistence
  posture, test surface map.
- [calculator/CALCULATION_MODEL_AND_VALIDATION.md](./calculator/CALCULATION_MODEL_AND_VALIDATION.md)
  — answer-origin and evidence-tier composition.
- [calculator/SOURCE_GAP_LEDGER.md](./calculator/SOURCE_GAP_LEDGER.md)
  — source-backed widening / tightening / deferred-family
  ledger.
- [calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
  — split refactor blueprint (v1 landed, v2 composer-injection
  follow-up deferred).
- [archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md](./archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md)
  — tactical plan for master-plan step 7b (closed
  2026-04-22). Reference doc for future agents auditing the
  wall corridor surface or the ~160-cell VALUE-pin matrix
  discipline.
- [archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md](./archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md)
  — tactical plan for master-plan step 7 (closed 2026-04-22).
  Reference doc for future agents investigating the same-
  material-split fixes (F1/F2) and the cross-mode torture
  matrix authoring pattern.
- [archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md](./archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md)
  — tactical plan for master-plan step 8 (closed 2026-04-23).
- [foundation/README.md](./foundation/README.md) — repo-level
  direction + rules.
- [imports/README.md](./imports/README.md) — upstream import
  workflow.

## Directory Layout

```text
docs/
  calculator/   living reference docs + latest checkpoint
  foundation/   long-lived project direction + repo rules
  imports/      upstream import notes + helper commands
  archive/      dated status, handoffs, closed-slice plans,
                historical analysis
```

If a file under `docs/archive/` disagrees with a living doc
under `docs/calculator/` or `docs/foundation/`, the living doc
wins.

## Fast Paths

- "Where do I resume implementation now?" →
  [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md)
  → [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  → Gate BE file named in the current selected slice.
- "What is stable right now?" →
  [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md)
  → [calculator/SYSTEM_MAP.md](./calculator/SYSTEM_MAP.md)
  → [calculator/CALCULATION_MODEL_AND_VALIDATION.md](./calculator/CALCULATION_MODEL_AND_VALIDATION.md).
- "What should be implemented next?" →
  [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  → [calculator/MASTER_PLAN.md](./calculator/MASTER_PLAN.md) §3
  state grid + §4 master sequence.
- "What was the session narrative?" →
  [calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md).

## Status Reading Rule

- Use `CURRENT_STATE.md` for "what is stable right now".
- Use `NEXT_IMPLEMENTATION_PLAN.md` for "what exactly should be
  implemented next".
- Use `calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md`
  for the most recent calculator session narrative.
- Use older checkpoints under `docs/archive/handoffs/` only when
  you need the historical context that predates the living
  triangle.

## Historical Notes

Use [archive/README.md](./archive/README.md) for the dated
status timeline, handoffs, closed-slice plans, and analysis
index.
