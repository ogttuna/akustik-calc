# Slice Plan - Company-Internal Calculation-Grade Mainline

Status: ACTIVE after the 2026-05-14 ASTM detour was parked.

## Objective

Bring DynEcho back to the calculator-first company-internal goal:
broader and more accurate ISO floor-impact and wall-airborne
calculation, with missing physical inputs surfaced as prompts instead
of unsupported guesses or low-confidence final answers.

Research-backed roadmap checkpoint:
[CHECKPOINT_2026-05-14_RESEARCH_BACKED_COMPANY_INTERNAL_ROADMAP.md](./CHECKPOINT_2026-05-14_RESEARCH_BACKED_COMPANY_INTERNAL_ROADMAP.md).
That checkpoint confirms the source-plus-solver strategy against
ISO 12354 / ISO 717 / ISO 10140 / ISO 16283, INSUL, and current
acoustic-software references. It also records the implementation-vs-docs
audit: building-prediction runtime already exists in Gate AR/AS/AT, while
the company-internal matrix still needs to import and prove that runtime.
The company-internal acceptance bar remains: complete in-scope scenarios
must not finish as `low_confidence`, `screening_fallback`, live
nearby-row proxy fallback, or lab/field/building alias.

This is the active mainline. ASTM `IIC` / `AIIC` work remains preserved
as a no-runtime boundary/history lane, but it is not the next
implementation path unless a later plan explicitly selects it.

## Priority Order

1. ISO floor-impact `Ln,w` / `DeltaLw` coverage and accuracy for common
   steel, timber/CLT, reinforced-concrete, floating floor, and suspended
   ceiling combinations.
2. Wall `Rw` / `R'w` / `DnT,w` support for more layer/topology families:
   lined massive/heavy-core, heavy composite, double/framed, grouped
   multi-cavity, AAC/non-homogeneous masonry, CLT/mass-timber, and
   opening/leak composite routes.
3. Field/building contexts must fail closed when physical context is
   missing. Building-prediction requests must not reuse lab or
   room-to-room field values without explicit flanking/junction,
   source-room, receiving-room, RT60, coupling-length, and output-basis
   owners.
4. Common `screening_fallback` or `low_confidence` rows should either
   become named family solvers with visible error budgets or return
   `needs_input` / `unsupported` with precise missing fields.

## Immediate Runtime Fix Landed In This Slice

`calculateAssembly` now parks all requested wall airborne outputs when
`contextMode:"building_prediction"` is selected but the Dynamic
Calculator resolver returns `needs_input` or `unsupported`.

Before this fix, a partial building context could still show requested
outputs as supported because the parking guard only activated after
`buildingPredictionOutputBasis` existed. That was backwards: the missing
output-basis field itself is one of the reasons the result must stay
parked.

The parked path also suppresses field/building metric leakage from the
returned runtime object: `R'w` / `Dn*` metrics, `ratings.field`, and
`iso717.RwPrime` are not exposed while the building route is waiting for
owned flanking/junction, source-room, receiving-room, RT60,
coupling-length, and output-basis inputs.

The focused regression is in:

- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts`

Current focused calculator gate validation is complete:

- engine: 415 files / 2409 tests passed
- web: 78 files / 334 passed + 18 skipped
- repo build: 5 / 5 tasks passed

## Heavy-Composite Wall Solver Cleanup Landed

The first wall screening cleanup in this mainline is now landed. Complete
heavy-composite double-leaf wall stacks with two heavy mineral/composite
leaves and one explicit unframed air cavity now promote from
`screening_fallback` / `low` confidence to the named source-absent
family solver:

`company_internal_heavy_composite_wall_mass_air_mass_capped_family_physics_runtime`

This keeps the existing numeric values unchanged while exposing a lab
`errorBudgetDb: 8`, exact-source precedence, and the heavy unframed
cavity cap as a conservative mass-based corridor. Field
`field_between_rooms` requests wrap the same lab-family basis through
the field adapter with `errorBudgetDb: 10` rather than aliasing lab
`Rw`.

Checkpoint:

[CHECKPOINT_2026-05-14_HEAVY_COMPOSITE_WALL_SOLVER_CLEANUP_HANDOFF.md](./CHECKPOINT_2026-05-14_HEAVY_COMPOSITE_WALL_SOLVER_CLEANUP_HANDOFF.md)

## Matrix Refresh After Heavy-Composite Landed

The company-internal coverage matrix refresh has now landed as:

`company_internal_calculation_grade_matrix_refresh_after_heavy_composite_plan`

It is a no-runtime refresh. The executable matrix has 61 rows: the 58
rows from the reinforced-concrete cleanup matrix plus three
heavy-composite / building-prediction safety rows. It keeps
heavy-composite lab `Rw 63 / STC 63 / C -1.4 / Ctr -6.3`, field
`R'w 60 / Dn,w 60 / DnT,w 61 / DnT,A 60.1`, lab
`errorBudgetDb: 8`, and field `errorBudgetDb: 10` pinned.

The refresh parks ASTM `IIC` / `AIIC` and selects the next ISO
calculation-grade lane:

`company_internal_steel_suspended_ceiling_delta_lw_owner_contract_plan`

Selected next file:

`packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-owner-contract.test.ts`

Checkpoint:

[CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_REFRESH_AFTER_HEAVY_COMPOSITE_HANDOFF.md](./CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_REFRESH_AFTER_HEAVY_COMPOSITE_HANDOFF.md)

## Latest Landed Step - Steel Suspended-Ceiling DeltaLw Owner

`company_internal_steel_suspended_ceiling_delta_lw_owner_contract_plan`
has landed.

Steel suspended-ceiling-only input still returns lab `Ln,w 62.2`, but
`DeltaLw` now has an explicit per-output missing-input owner set instead
of a silent unsupported gap:

- `toppingOrFloatingLayer`;
- `resilientLayerDynamicStiffnessMNm3`;
- `loadBasisKgM2`.

Mixed `Ln,w` / `DeltaLw` requests preserve the supported `Ln,w` value
and prompt only for the missing `DeltaLw` owner fields. No numeric
`DeltaLw` runtime or ASTM/field/building alias was added.

Checkpoint:

[CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_HANDOFF.md](./CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_HANDOFF.md)

## Next Implementation Steps

1. The selected airborne building-prediction runtime terms owner contract
   has landed:
   `packages/engine/src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts`.
   Landed gate:
   `company_internal_airborne_building_prediction_runtime_terms_owner_contract_plan`.
   Selection status:
   `company_internal_airborne_building_prediction_runtime_terms_owner_contract_landed_selected_matrix_v2_refresh`.
2. The contract imports the existing Gate AR/AS/AT complete-context
   facts into the company-internal envelope: `R'w 58`, `DnT,w 59`,
   `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`,
   `+/-9 dB` building budget, exact missing-input prompts, lab metric
   alias negatives, and unsupported opening/leak building boundary.
3. The selected matrix v2 refresh has landed:
   `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts`.
   Landed gate:
   `company_internal_calculation_grade_mainline_matrix_v2_refresh_plan`.
   Selection status:
   `company_internal_calculation_grade_mainline_matrix_v2_refresh_landed_selected_steel_suspended_ceiling_delta_lw_runtime_corridor`.
   The matrix preserves the accepted Gate AT building runtime rows,
   retires the stale `wall.building_prediction_missing_context.needs_input`
   row, changes steel suspended-ceiling `DeltaLw` from silent unsupported
   to precise `needs_input`, and normalizes
   `floor.heavy_concrete_floating_floor.lab` away from hidden
   `screening_fallback`.
4. The steel suspended-ceiling numeric `DeltaLw` runtime corridor has
   landed:
   `packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts`.
   Landed gate:
   `company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan`.
   Selection status:
   `company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_landed_selected_surface_parity`.
   Complete lower suspended-ceiling plus upper/reference package input now
   returns lab `Ln,w 51.6` / `DeltaLw 22.4`; missing
   `toppingOrFloatingLayer` blocks the formula instead of fabricating a
   broad fallback.
5. The steel suspended-ceiling `DeltaLw` surface parity gate has landed:
   `packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts`.
   Landed gate:
   `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan`.
   Selection status:
   `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_landed_selected_matrix_v3_refresh`.
   Cards, corridor dossier, local saved replay, server snapshot replay,
   calculator API payload, impact-only API payload, and Markdown report
   now show the same lab `Ln,w 51.6` / `DeltaLw 22.4` runtime with
   the suspended-ceiling lower-reference basis.
6. Matrix V3 has landed:
   `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts`.
   Landed gate:
   `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`.
   Selection status:
   `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_landed_selected_steel_suspended_ceiling_low_frequency_lnt50_owner`.
   It retires the old steel suspended-ceiling `DeltaLw` `needs_input`
   owner row and records the supported lab `Ln,w 51.6` / `DeltaLw 22.4`
   runtime row in the executable matrix.
7. The steel suspended-ceiling low-frequency `L'nT,50` owner contract
   has landed:
   `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`.
   Landed gate:
   `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan`.
   Selection status:
   `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_landed_no_runtime_selected_runtime_corridor`.
   Lab `Ln,w 51.6` / `DeltaLw 22.4` remains frozen; field
   `L'n,w 54.6` / `L'nT,w 51.8` remains available from explicit field
   context; `L'nT,50` remains unsupported until
   `lowFrequencyImpactSpectrumOrCI50_2500Owner`,
   `lnt50MetricBasisOwner`, and
   `lnt50SourceAbsentErrorBudgetOwner` are executable.
8. The steel suspended-ceiling low-frequency `L'nT,50` runtime corridor
   has landed:
   `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts`.
   Landed gate:
   `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`.
   Selection status:
   `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_landed_selected_surface_parity`.
   Lab `Ln,w 51.6` / `DeltaLw 22.4` remains frozen; complete field
   context with `fieldKDb = 3`, receiving-room volume `60 m3`, and
   `CI,50-2500 = -1 dB` now returns `L'nT,50 50.8` with
   `estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`
   and a `+/-7 dB` source-absent field adapter budget.
9. The steel suspended-ceiling low-frequency `L'nT,50` surface parity
   gate has landed:
   `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts`.
   Landed gate:
   `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`.
   Selection status:
   `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_landed_selected_matrix_v4_refresh`.
   Cards, corridor dossier, local saved replay, server snapshot replay,
   calculator API payload, impact-only API payload, and Markdown report
   now preserve `L'nT,50 50.8`, `CI,50-2500`, the
   `estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`
   metric basis, and the `+/-7 dB` source-absent budget without runtime
   movement.
   Runtime corridor selected label, now landed by this gate:
   steel suspended-ceiling L'nT,50 card/report/API parity.
   Surface parity selected label, now landed by Matrix V4:
   company-internal matrix v4 refresh after steel L'nT,50 surface parity.
10. Matrix V4 has landed:
   `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts`.
   Landed gate:
   `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`.
   Selection status:
   `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_landed_selected_opening_leak_building_adapter_owner`.
   Matrix V4 imports the supported steel suspended-ceiling `L'nT,50 50.8`
   row, keeps missing `CI,50-2500` blocked without an `L'nT,50` budget,
   preserves exact field-band precedence, and keeps ASTM `IIC` / `AIIC`
   unsupported.
11. The opening/leak field/building adapter owner contract has landed:
   `packages/engine/src/company-internal-opening-leak-building-adapter-owner-contract.test.ts`.
   Landed gate:
   `company_internal_opening_leak_building_adapter_owner_contract_plan`.
   Selection status:
   `company_internal_opening_leak_building_adapter_owner_contract_landed_no_runtime_selected_runtime_corridor`.
   Gate S lab opening/leak `Rw 38.2` / `STC 39` remains supported; field
   and building outputs require separate owner groups and cannot borrow
   the lab value. Missing physical fields return `needs_input`; missing
   owners return `runtime_owner_missing`; element-lab and ASTM requests
   stay outside this adapter.
12. The opening/leak field/building runtime corridor has landed:
   `packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts`.
   Landed action:
   `company_internal_opening_leak_building_runtime_corridor_plan`.
   Selection status:
   `company_internal_opening_leak_building_runtime_corridor_landed_selected_surface_parity`.
   Complete explicit field opening/leak context returns `R'w 36.4` /
   `Dn,w 36.7` / `DnT,w 36.9`; complete explicit building opening/leak
   context returns `R'w 31.6` / `DnT,w 32.1`. Gate S lab `Rw 38.2` /
   `STC 39` remains unchanged; `Dn,A` / `DnT,A` remain unsupported
   until a spectrum adapter owns them.
   Runtime selected next label:
   opening/leak field/building card/report/API parity.
13. The opening/leak field/building surface parity step has landed:
   `packages/engine/src/company-internal-opening-leak-building-surface-parity-contract.test.ts`.
   Landed action:
   `company_internal_opening_leak_building_surface_parity_plan`.
   Selection status:
   `company_internal_opening_leak_building_surface_parity_landed_selected_input_surface`.
   Cards, route posture, scenario summary, method/corridor dossiers,
   saved replay, calculator API payload, and Markdown report now keep
   field `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9` with `+/-8 dB` and
   building `R'w 31.6` / `DnT,w 32.1` with `+/-10 dB` visible on the
   same not-measured field/building basis.
14. The opening/leak field/building input surface has landed:
   `apps/web/features/workbench/company-internal-opening-leak-building-input-surface.test.ts`.
   Landed action:
   `company_internal_opening_leak_building_input_surface_plan`.
   Selection status:
   `company_internal_opening_leak_building_input_surface_landed_selected_matrix_v5_refresh`.
   The wall input surface now feeds the opening/leak field/building
   runtime from first-class UI/store/snapshot fields. UI-derived field
   input preserves `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9`; UI-derived
   building input preserves `R'w 31.6` / `DnT,w 32.1`. Missing building
   owner fields and duplicate openings fail closed.
15. Next refresh the company-internal executable matrix after the input
   surface:
   `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts`.
   Selected action:
   `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`.
   Selected label:
   company-internal matrix v5 refresh after opening/leak field/building
   input surface.
   That refresh has now landed with selection status:
   `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_landed_selected_opening_leak_a_weighted_adapter_owner`.
   It imports field `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9` and
   building `R'w 31.6` / `DnT,w 32.1` opening/leak runtime rows,
   retires
   `wall.opening_leak_composite_building_boundary.unsupported`, keeps
   `Dn,A` / `DnT,A` unsupported, and selects:
   `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`.
   Selected next file:
   `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts`.
   That owner contract has now landed with no runtime movement and
   selection status:
   `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_landed_no_runtime_selected_formula_corridor`.
   It keeps field `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9` and
   building `R'w 31.6` / `DnT,w 32.1` frozen, requires
   `frequencyBandSet`, same-route opening/leak spectrum curve ownership,
   ISO 717 C or A-weighted adapter ownership, uncertainty budget, exact
   A-weighted packet precedence, and lab `Rw` / `STC` alias guards
   before `Dn,A` / `DnT,A` can promote. It selects:
   `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`.
   Selected next file:
   `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts`.
   Selected next label:
   opening/leak Dn,A / DnT,A spectrum-adapter formula corridor.
16. For every selected lane, require an explicit formula/runtime contract:
   topology ownership, supported metrics, exact-source precedence,
   negative boundaries, visible `errorBudgetDb`, and hostile reorder /
   duplicate / many-layer tests.
17. Freeze or refresh the company-internal acceptance matrix so the next
   runtime work is judged by in-scope scenarios, not by broad planning
   progress. The matrix should fail complete in-scope rows that resolve
   to `low_confidence`, `screening_fallback`, live proxy fallback, or
   lab/field/building alias.

## Guardrails

- Do not continue ASTM `IIC` / `AIIC` runtime work from the previous
  no-runtime scaffold in this mainline.
- Do not treat `Rw` as `STC`, `Ln,w` as `IIC`, or lab values as field or
  building predictions.
- Do not broaden source catalogs as a substitute for source-absent
  family solvers.
- Do not accept a green test that only proves code execution; tests must
  assert expected values, metric basis, support bucket, tolerance/error
  budget, and hostile-input behavior.
