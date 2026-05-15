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

Current calculator handoff:

- Active mainline has been realigned after the no-runtime ASTM scaffold:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MAINLINE_REALIGNMENT_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MAINLINE_REALIGNMENT_HANDOFF.md).
- Active tactical plan:
  [calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md](./calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md).
- Research-backed remaining-road checkpoint:
  [calculator/CHECKPOINT_2026-05-14_RESEARCH_BACKED_COMPANY_INTERNAL_ROADMAP.md](./calculator/CHECKPOINT_2026-05-14_RESEARCH_BACKED_COMPANY_INTERNAL_ROADMAP.md).
  Use this to keep the next work tied to company-internal acceptance
  scenarios, ISO lab/field/building basis separation, targeted source
  calibration, implementation-vs-doc drift cleanup, and zero complete
  in-scope `low_confidence` / `screening_fallback` finals.
- Current checkpoint review:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_CHECKPOINT_REVIEW_AND_VALIDATION.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_CHECKPOINT_REVIEW_AND_VALIDATION.md).
  Use this as the checkpoint before the opening/leak A-weighted
  formula-corridor handoff below; its selected formula action has now
  landed.
- Opening/leak A-weighted formula-corridor handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`
  has landed with selection status
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  Formula pins: field `Dn,A 35.9`; field `DnT,A 36.1`; building `DnT,A 31.3`.
  The selected next action, now landed, is
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`;
  selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts`;
  selected next label, now landed: opening/leak Dn,A / DnT,A
  spectrum-adapter runtime corridor.
  Selected next label literal: opening/leak Dn,A / DnT,A spectrum-adapter runtime corridor.
- Opening/leak A-weighted runtime-corridor handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`
  has landed with selection status
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_landed_selected_surface_parity`.
  Runtime pins: field `Dn,A 35.9`; field `DnT,A 36.1`; building `DnT,A 31.3`.
  `frequencyBandSet` is now a runtime input: missing it keeps A-weighted
  outputs unsupported. The selected next action, now landed, is
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`;
  selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts`;
  selected next label, now landed: opening/leak Dn,A / DnT,A card/report/API parity.
- Current opening/leak A-weighted surface-parity handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`
  has landed with selection status
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_landed_selected_matrix_v6_refresh`.
  It preserves field `Dn,A 35.9`, field `DnT,A 36.1`, building
  `DnT,A 31.3`, and carries the frequency band set through cards,
  report, API, saved replay, server snapshot replay, and workbench
  input surface. Selected next action:
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`;
  selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts`;
  selected next label: company-internal matrix v6 refresh after opening/leak Dn,A / DnT,A surface parity.
- Current company-internal Matrix V6 handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_MATRIX_V6_REFRESH_AFTER_A_WEIGHTED_SURFACE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_MATRIX_V6_REFRESH_AFTER_A_WEIGHTED_SURFACE_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`
  has landed with selection status
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_landed_selected_boundary_revalidation`.
  Matrix V6 has 71 rows, preserves field `Dn,A 35.9`, field
  `DnT,A 36.1`, and building `DnT,A 31.3`, retires the stale
  A-weighted unsupported row, and keeps building `Dn,A`,
  missing `frequencyBandSet`, lab aliases, ASTM aliases, and
  exact-source precedence as explicit boundaries. Selected next action:
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`;
  selected next file:
  `packages/engine/src/company-internal-building-astm-boundary-revalidation-contract.test.ts`;
  selected next label: building partial-context and ASTM parked-boundary revalidation.
- Current building/ASTM boundary revalidation handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_HANDOFF.md).
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`
  has landed with selection status
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_landed_selected_final_internal_use_rehearsal`.
  It proves building partial-context and opening/leak building
  missing-owner rows remain `needs_input` with named physical owners such
  as `sourceRoomVolumeM3`, no value pins, and no budget. It also proves
  floor ASTM `IIC` / `AIIC` and airborne A-weighted-to-ASTM alias rows
  remain unsupported without ISO alias values. Selected next action:
  `company_internal_final_internal_use_rehearsal_after_boundary_revalidation_plan`;
  selected next file:
  `packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`;
  selected next label: final internal-use rehearsal and operating envelope.
- Current remaining-gap analysis and execution plan:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md).
  Use this for the concrete path to controlled company-internal
  readiness: final internal-use rehearsal.
- Next plain label: company-internal ISO floor / wall solver coverage
  and field/building missing-input safety.
- Previous company-internal input-surface step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_INPUT_SURFACE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_INPUT_SURFACE_HANDOFF.md).
  `company_internal_opening_leak_building_input_surface_plan` has
  landed. The Dynamic Calculator wall input surface now feeds the
  opening/leak field/building adapter from first-class physical fields:
  opening package, partition geometry, receiving-room volume/RT60,
  source-room volume, flanking/junction class, conservative flanking
  assumption, junction coupling length, and building output basis.
  UI-derived field input preserves `R'w 36.4` / `Dn,w 36.7` /
  `DnT,w 36.9` with `+/-8 dB`; UI-derived building input preserves
  `R'w 31.6` / `DnT,w 32.1` with `+/-10 dB`. Selection status:
  `company_internal_opening_leak_building_input_surface_landed_selected_matrix_v5_refresh`.
  Selected next action:
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`.
  Selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts`.
  Selected next label: company-internal matrix v5 refresh after
  opening/leak field/building input surface.
- Latest company-internal Matrix V5 step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V5_REFRESH_AFTER_OPENING_LEAK_INPUT_SURFACE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V5_REFRESH_AFTER_OPENING_LEAK_INPUT_SURFACE_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`
  has landed. Matrix V5 records opening/leak field `R'w 36.4` /
  `Dn,w 36.7` / `DnT,w 36.9` and building `R'w 31.6` / `DnT,w 32.1`
  as supported calculation-grade rows, retires the stale
  `wall.opening_leak_composite_building_boundary.unsupported` row, and
  keeps `Dn,A` / `DnT,A` unsupported until a spectrum-adapter owner
  exists. Selection status:
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_landed_selected_opening_leak_a_weighted_adapter_owner`.
  Selected next action:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`.
  Selected next file:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts`.
- Latest company-internal opening/leak A-weighted owner step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_OWNER_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_OWNER_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`
  has landed as a no-runtime owner gate. Field opening/leak remains
  `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9`; building opening/leak
  remains `R'w 31.6` / `DnT,w 32.1`. `Dn,A` / `DnT,A` still stay
  unsupported until the formula corridor owns `frequencyBandSet`, the
  same-route spectrum curve, ISO 717 C or A-weighted adapter,
  uncertainty budget, exact A-weighted packet precedence, and lab
  `Rw` / `STC` alias guard. Selection status:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_landed_no_runtime_selected_formula_corridor`.
  Selected next action:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`.
  Selected next file:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts`.
  Selected next label: opening/leak Dn,A / DnT,A spectrum-adapter formula corridor.
- Preceding company-internal Matrix V4 step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V4_REFRESH_AFTER_LNT50_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V4_REFRESH_AFTER_LNT50_SURFACE_PARITY_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`
  has landed and selected the opening/leak adapter owner contract.
  Selection status:
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_landed_selected_opening_leak_building_adapter_owner`.
  Selected next action, now landed:
  `company_internal_opening_leak_building_adapter_owner_contract_plan`.
  Selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-building-adapter-owner-contract.test.ts`.
  Owner contract selection status, now superseded by the runtime
  corridor:
  `company_internal_opening_leak_building_adapter_owner_contract_landed_no_runtime_selected_runtime_corridor`.
  Owner selected next action, now landed:
  `company_internal_opening_leak_building_runtime_corridor_plan`.
  Owner selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts`.
  Runtime corridor landed with complete field `R'w 36.4` / `DnT,w 36.9`
  and complete building `R'w 31.6` / `DnT,w 32.1` through separate
  opening/leak field/building adapters. Selection status, now superseded
  by surface parity:
  `company_internal_opening_leak_building_runtime_corridor_landed_selected_surface_parity`.
  Runtime selected next action, now landed:
  `company_internal_opening_leak_building_surface_parity_plan`.
  Runtime selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-building-surface-parity-contract.test.ts`.
  Runtime selected next label, now landed:
  opening/leak field/building card/report/API parity.
- Preceding company-internal surface-parity step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`
  has landed as a no-runtime surface parity closeout. Steel suspended-
  ceiling lab `Ln,w 51.6` / `DeltaLw 22.4` stays frozen; complete field
  context with `fieldKDb = 3`, receiving-room volume `60 m3`, and
  `CI,50-2500 = -1 dB` returns `L'n,w 54.6`, `L'nT,w 51.8`, and
  `L'nT,50 50.8`. Cards, corridor dossier, saved/server replay,
  calculator API, impact-only API, and Markdown report now carry the
  same
  `estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`
  basis and `+/-7 dB` source-absent field adapter budget. ASTM `IIC` /
  `AIIC` remain unsupported. Selection status:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_landed_selected_matrix_v4_refresh`.
  Selected next action:
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`.
  Selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts`.
  Selected next label, now landed by Matrix V4: company-internal matrix v4 refresh after steel L'nT,50 surface parity.
- Preceding company-internal Matrix V3 step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V3_REFRESH_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V3_REFRESH_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`
  has landed. Matrix V3 retires
  `floor.lightweight_steel_suspended_ceiling_delta_lw.needs_input` and
  records
  `floor.lightweight_steel_suspended_ceiling_delta_lw.runtime` as
  supported lab `Ln,w 51.6` / `DeltaLw 22.4` through the
  `steel_suspended_ceiling_lower_reference` formula corridor. Selection
  status:
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_landed_selected_steel_suspended_ceiling_low_frequency_lnt50_owner`.
  Matrix V3 selected next action, now landed by the low-frequency owner:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan`.
  Matrix V3 selected next file, now landed by the low-frequency owner:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`.
- Preceding low-frequency `L'nT,50` owner step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan`
  landed as the no-runtime owner boundary with selection status
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_landed_no_runtime_selected_runtime_corridor`.
  It requires explicit `lowFrequencyImpactSpectrumOrCI50_2500Owner`
  before source-absent `L'nT,50` runtime can promote. Owner contract
  file:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`.
  Owner selected next action, now landed by the runtime corridor:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`.
  Owner selected next file, now landed by the runtime corridor:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts`.
- Preceding steel surface-parity step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan`
  has landed. Complete lower suspended-ceiling plus upper/reference
  package input still returns lab `Ln,w 51.6` / `DeltaLw 22.4`; cards,
  dossier, saved/server replay, calculator API, impact-only API, and
  Markdown report now show the same suspended-ceiling lower-reference
  basis and source-absent budgets. Selection status:
  `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_landed_selected_matrix_v3_refresh`.
  Surface parity selected next action, now landed by Matrix V3:
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`.
  Surface parity selected next file, now landed by Matrix V3:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts`.
- Preceding company-internal matrix step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V2_REFRESH_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V2_REFRESH_HANDOFF.md).
  Preceding building reconciliation landed
  `company_internal_airborne_building_prediction_runtime_terms_owner_contract_plan`
  with selection status
  `company_internal_airborne_building_prediction_runtime_terms_owner_contract_landed_selected_matrix_v2_refresh`
  and selected
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts`,
  which is now landed by Matrix V2.
  `company_internal_calculation_grade_mainline_matrix_v2_refresh_plan`
  has landed. It preserves the accepted Gate AR/AS/AT building runtime,
  retires the stale building row, turns steel suspended-ceiling
  `DeltaLw` into a precise `needs_input` owner prompt, and removes the
  hidden heavy-floating `screening_fallback` matrix origin.
  Selection status:
  `company_internal_calculation_grade_mainline_matrix_v2_refresh_landed_selected_steel_suspended_ceiling_delta_lw_runtime_corridor`.
  Matrix V2 selected next action, now landed by the steel `DeltaLw`
  runtime corridor:
  `company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan`.
  Matrix V2 selected next file, now landed by the steel `DeltaLw`
  runtime corridor:
  `packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts`.
- Preceding low-frequency runtime step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`
  landed the source-absent `L'nT,50 50.8` runtime with selection status
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_landed_selected_surface_parity`.
  Runtime selected next action, now landed by surface parity:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`.
  Runtime selected next file, now landed by surface parity:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts`.
  Runtime selected next label, now landed by surface parity:
  steel suspended-ceiling L'nT,50 card/report/API parity.
- Preceding surface-parity selected next action, now landed:
  `company_internal_opening_leak_building_input_surface_plan`.
- Preceding surface-parity selected next file, now landed:
  `apps/web/features/workbench/company-internal-opening-leak-building-input-surface.test.ts`.
- Preceding surface-parity selected next label, now landed:
  opening/leak field/building input surface.
- Latest opening/leak field/building surface parity:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_HANDOFF.md).
  `company_internal_opening_leak_building_surface_parity_plan`
  has landed with selection status
  `company_internal_opening_leak_building_surface_parity_landed_selected_input_surface`.
  Cards, dossiers, saved replay, API, and reports now carry the same
  source-absent field/building values and budgets without lab or
  A-weighted aliases.
- ASTM `IIC` / `AIIC` work is parked as no-runtime boundary history.
  Do not continue Gate BW unless a later active plan explicitly selects
  it again.

Parked ASTM handoff history:

- Gate BV has now landed:
  `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`.
- Latest checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_HANDOFF.md).
- Gate BV selection status:
  `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_landed_no_runtime_selected_contour_rating_owner_gate_bw`.
- Selected next action:
  `gate_bw_personal_use_mvp_floor_impact_astm_iic_aiic_contour_rating_owner_plan`.
- Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bw-floor-impact-astm-iic-aiic-contour-rating-owner-contract.test.ts`.
- Next plain label: floor-impact ASTM IIC/AIIC contour rating owner.
- Gate BV is no-runtime. It owns the declared ASTM impact
  one-third-octave curve scaffold for lab `IIC` and field `AIIC`, but
  does not ingest standard text, source documents, or measured values and
  does not promote runtime values. Current runtime still lacks the
  executable ASTM E989 contour/rating owner, exact ASTM source
  precedence runtime owner, source-absent ASTM uncertainty, and visible
  parity. ISO `Ln,w` / `DeltaLw`, ISO field impact values,
  building-prediction metrics, and ASTM E413/STC rows must not alias to
  ASTM E989 impact ratings.
- Preceding Gate BU landed:
  `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`.
- Preceding Gate BU checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_HANDOFF.md).
- Gate BU selection status:
  `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_exact_source_owner_closed_no_runtime_selected_rating_curve_owner_scaffold_gate_bv`.
- Gate BU selected next action:
  `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`.
- Gate BU selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv-floor-impact-astm-iic-aiic-rating-curve-owner-scaffold-contract.test.ts`.
- Gate BU next plain label: floor-impact ASTM IIC/AIIC rating curve owner scaffold.
- Preceding Gate BT landed:
  `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`.
- Preceding Gate BT checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_HANDOFF.md).
- Gate BT selection status:
  `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_adapter_bridge_landed_no_runtime_selected_rating_procedure_exact_source_owner_gate_bu`.
- Gate BT selected next action:
  `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`.
- Gate BT selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts`.
- Gate BT next plain label: floor-impact ASTM IIC/AIIC rating procedure and exact-source owner.
- Preceding Gate BS landed:
  `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`.
- Preceding Gate BS checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_HANDOFF.md).
- Gate BS selection status:
  `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_closed_no_runtime_selected_metric_schema_adapter_bridge_gate_bt`.
- Gate BS selected next action:
  `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`.
- Gate BS selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts`.
- Gate BS next plain label: floor-impact ASTM IIC/AIIC metric schema and adapter bridge.
- Preceding Gate BR landed:
  `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`.
- Preceding Gate BR checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_HANDOFF.md).
- Gate BR selection status:
  `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_landed_no_runtime_selected_runtime_corridor_gate_bs`.
- Selected next action:
  `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`.
- Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts`.
- Next plain label: floor-impact ASTM IIC/AIIC runtime corridor.
- Gate BR is no-runtime. It defines the ASTM lab `IIC` and field
  `AIIC` owner contract, keeps complete ISO impact formulas unsupported
  for ASTM outputs, and records that ISO `Ln,w` / `DeltaLw`, field
  `L'n,w` / `L'nT,w`, and building-prediction metrics must not alias to
  ASTM ratings.
- Preceding Gate BQ landed:
  `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`.
- Preceding Gate BQ checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_HANDOFF.md).
- Gate BQ selection status:
  `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_landed_no_runtime_selected_floor_impact_astm_iic_aiic_adapter_gate_br`.
- Gate BQ selected next action:
  `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`.
- Gate BQ selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts`.
- Gate BQ next plain label: floor-impact ASTM IIC/AIIC adapter contract.
- Gate BQ refreshed the executable matrix after the reinforced-concrete
  cleanup. The old low-confidence coverage-gap row is gone; complete
  owner input stays lab `Ln,w 58.1` / `DeltaLw 13.7` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`,
  partial owner input stays `needs_input`, exact source rows still win,
  and field/building/ASTM boundaries remain non-alias boundaries.
- Preceding Gate BP has now landed:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan`.
- Preceding Gate BP checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_HANDOFF.md).
- Gate BP selection status:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_landed_selected_matrix_refresh_gate_bq`.
- Selected next action:
  `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`.
- Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts`.
- Next plain label: coverage matrix refresh after reinforced-concrete cleanup.
- Gate BP keeps Gate BO runtime values frozen while making the
  reinforced-concrete cleanup visible across cards, trace, report,
  saved replay, calculator API, and impact-only API. Complete owner
  input returns lab `Ln,w 58.1` / `DeltaLw 13.7` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`;
  incomplete owner input shows impact cards as `needs_input` with named
  physical fields instead of a low-confidence result.
- Preceding Gate BO landed:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan`;
  selection status:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_landed_selected_surface_parity_gate_bp`;
  selected next action:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp-reinforced-concrete-cleanup-surface-parity-contract.test.ts`.
- Preceding Gate BN selected Gate BO:
  `gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_plan`;
  selection status:
  `gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_landed_no_runtime_selected_reinforced_concrete_low_confidence_cleanup_gate_bo`;
  selected next action:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo-reinforced-concrete-low-confidence-cleanup-contract.test.ts`.
  Next plain label: reinforced-concrete low-confidence cleanup.
  Gate BN pinned steel suspended-ceiling `Ln,w 62.2`.

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
- [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_HANDOFF.md)
  — prior calculator handoff: Gate BI landed no-runtime
  floor-impact field/building adapter ownership and selected the
  runtime-producing Gate BJ corridor. Landed action:
  `gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`;
  selection status:
  `gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_landed_no_runtime_selected_field_building_runtime_corridor_gate_bj`;
  selected next action:
  `gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bj-floor-impact-field-building-runtime-corridor-contract.test.ts`.
  Next plain label: floor-impact field/building runtime corridor. Gate
  BI keeps lab and field values unchanged, keeps `IIC` / `AIIC`
  unsupported, and records the company-internal calculation-grade bar:
  common complete-input scenarios should not end on live
  low-confidence/screening final answers.
- [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_HANDOFF.md)
  — prior calculator handoff: Gate BJ landed the floor-impact
  field/building runtime corridor and selected Gate BK steel-floor
  low-confidence fallback cleanup. Landed action:
  `gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`;
  selection status:
  `gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_landed_selected_steel_floor_low_confidence_cleanup_gate_bk`;
  selected next action:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts`.
  Gate BJ pins field-volume `L'n,w 52.3` / `L'nT,w 49.9`, building
  direct+flanking `L'nT,w 52.4`, direct+flanking medium confidence, and
  `source_absent_field_building_adapter_error_budget`; source-absent
  `L'nT,50` stays blocked until a low-frequency owner exists. Next plain
  label: steel-floor low-confidence fallback cleanup.
- [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_HANDOFF.md)
  — latest calculator handoff: Gate BK landed the steel-floor
  low-confidence fallback cleanup and selected Gate BL steel-floor
  suspended-ceiling input surface. Landed action:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`;
  selection status:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_landed_selected_suspended_ceiling_input_surface_gate_bl`;
  selected next action:
  `gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts`.
  Gate BK adds
  `predictor_lightweight_steel_suspended_ceiling_corridor_estimate`
  for complete steel suspended-ceiling-only lab `Ln,w 62.2` with
  `+/-6 dB` source-absent budget, while Gate AD steel upper/lower
  `Ln,w 55.6` / `DeltaLw 22.4` stays frozen. Next plain label:
  steel-floor suspended-ceiling input surface.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_HANDOFF.md)
  — prior calculator handoff: Gate BH landed no-runtime
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
- [calculator/CHECKPOINT_2026-05-13_POST_GATE_BH_PLAN_AND_TEST_REVIEW.md](./calculator/CHECKPOINT_2026-05-13_POST_GATE_BH_PLAN_AND_TEST_REVIEW.md)
  — post-Gate-BH checkpoint review: docs and implementation still agree
  that Gate BI is the next floor-impact field/building adapter contract.
  It records the remaining owner/input gaps, keeps lab values and
  budgets frozen, keeps building-impact runtime unsupported, and defines
  the next Gate BI execution order. Validation passed with focused Gate
  BH, `pnpm calculator:gate:current`, and `git diff --check`.
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
  field/building adapter contract, revalidated by the post-Gate-BH
  checkpoint.
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
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md)
  → [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  → `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts`.
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
- Use `calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md`
  for the most recent calculator session narrative.
- Use older checkpoints under `docs/archive/handoffs/` only when
  you need the historical context that predates the living
  triangle.

## Historical Notes

Use [archive/README.md](./archive/README.md) for the dated
status timeline, handoffs, closed-slice plans, and analysis
index.
