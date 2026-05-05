# Slice Plan - Source Promotion Hostile-Input Readiness Guard V1

Slice id: `source_promotion_hostile_input_readiness_guard_v1`

Status: GATE C CLOSED / NEXT SLICE SELECTED

Selected by:

`rockwool_triple_leaf_explicit_screening_only_policy_v1` Gate C

Selection status:

`closed_rockwool_triple_leaf_explicit_screening_only_policy_no_runtime_and_selected_source_promotion_hostile_input_readiness_guard`

Selected first file:

`packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`

Selected first file status:

Landed at Gate A.

Selected first action:

`gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout`

Gate A status:

`gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout`

Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_A_HANDOFF.md`

Selected closeout file:

`packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`

Selected closeout action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Gate C closeout status:

`closed_source_promotion_hostile_input_readiness_guard_no_runtime_and_selected_company_internal_high_accuracy_opening_rehearsal`

Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

Selected next slice:

`company_internal_high_accuracy_opening_rehearsal_v1`

Selected next file:

`packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`

Selected next action:

`gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_C_CLOSEOUT_HANDOFF.md`

Planning surface:

`docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md`

Required carry-forward artifacts:

- `rockwool_policy_gate_c_closeout_summary`
- `rockwool_exact_or_screening_company_criterion_closed`
- `source_promotion_hostile_input_opening_blockers_carry_forward`
- `source_promotion_hostile_input_readiness_guard_selected`
- `selected_gate_a_source_promotion_hostile_input_readiness_with_target_file`

Gate A landed artifacts:

- `source_promotion_surface_inventory`
- `hostile_api_import_fail_closed_surface_inventory`
- `estimate_json_1e309_rejected_by_finite_layer_schema`
- `server_import_snapshot_not_runtime_promotion_surface`
- `near_source_rows_context_only_until_owner_set_exists`
- `rockwool_gate_c_policy_freeze_carry_forward`
- `selected_source_promotion_hostile_closeout_with_target_file`

Gate C landed artifact:

- `company_internal_high_accuracy_opening_rehearsal_selected`

Gate A implementation summary:

Gate A found one bounded hostile API gap: JSON bodies can encode
`1e309`, which `JSON.parse` turns into `Infinity`. The old shared
`LayerInputSchema` used `z.number().positive()`, so estimate and
impact-only API validation could pass the non-finite value to the
engine. The engine still failed closed and did not leak an exact-looking
value, but the public route could return a calculated fail-closed result
instead of a 400 validation response. Gate A tightened
`packages/shared/src/domain/layer.ts` to
`thicknessMm: z.number().finite().positive()` and pinned the public
estimate / impact-only routes in
`apps/web/lib/calculator-api-validation.test.ts`.

No source row was promoted. Exact source controls and near-source rows
remain separated: `near_source_rows_context_only_until_owner_set_exists`.
Server project import remains snapshot persistence only:
`server_import_snapshot_not_runtime_promotion_surface`; it stores
`calculatorInput` / optional `calculatorOutput` snapshots, does not run
calculator runtime, rejects non-finite JSON snapshots through
`JsonValueSchema`, and workbench restore uses the parsed input snapshot,
not stored output payloads. Rockwool Gate C remains frozen by
`rockwool_gate_c_policy_freeze_carry_forward`: grouped `Rw 41`,
flat-list `Rw 42`, field `R'w 34`, `DnT,w 36`, no exact/source
validation, Uris 2006 still
`paused_waiting_rights_safe_source_packet`.

## Objective

Close or precisely inventory the remaining company-internal opening
blockers after field-output owner policy and Rockwool explicit
screening-only policy are both closed. This slice is about preventing
false confidence: near-source/source rows must not promote to exact
runtime without full ownership, and hostile API/import payloads must
fail closed before any company-internal high-accuracy opening handoff.

This slice is not source evidence, not a Uris 2006 retry, and not a
value retune. It must not promote Rockwool triple-leaf exactness or
change runtime values unless a later gate names complete topology,
material mapping, metric context, tolerance, negative-boundary, source
provenance, and paired visible-test ownership.

## Inputs From Rockwool Gate C

`rockwool_policy_gate_c_closeout_summary`

Gate A inventoried the Rockwool triple-leaf screening-only gap and Gate
B made output-card/proposal/report copy explicit. Gate C closes that
policy no-runtime.

`rockwool_exact_or_screening_company_criterion_closed`

The company-internal Rockwool criterion is closed as explicit
screening-only, not as exact runtime. Grouped split-rockwool remains
`Rw 41`, `multileaf_screening_blend`, low confidence, screening-only,
not exact, and not source-validated. Flat-list adjacent swaps remain
`Rw 42` fail-closed until grouped topology is supplied. Field `R'w 34`
and `DnT,w 36` remain continuations from the screening lane.

`source_promotion_hostile_input_opening_blockers_carry_forward`

Company-internal high-accuracy opening remains blocked by:

- `source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests`
- `hostile_api_import_payloads_fail_closed`
- `pnpm_calculator_gate_current_and_pnpm_check_green_at_opening_handoff`

## Gate A Plan

Gate A landed on 2026-05-05 with finite layer-schema tightening and
selected closeout / next-slice selection:

`packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`

The selected closeout consumed `source_promotion_surface_inventory`,
`hostile_api_import_fail_closed_surface_inventory`,
`estimate_json_1e309_rejected_by_finite_layer_schema`,
`server_import_snapshot_not_runtime_promotion_surface`,
`near_source_rows_context_only_until_owner_set_exists`,
`rockwool_gate_c_policy_freeze_carry_forward`, and
`selected_source_promotion_hostile_closeout_with_target_file`, then
selected `company_internal_high_accuracy_opening_rehearsal_v1` as the
next bounded final-validation step. Company-internal high-accuracy
opening is still blocked until the selected rehearsal produces a current
acceptance matrix and final current-gate plus broad `pnpm check`
evidence.

Gate C validation completed on 2026-05-05: focused Gate C 1 file / 5
tests; engine continuity 7 files / 36 tests; `pnpm
calculator:gate:current` with engine 252 files / 1459 tests, web 53
files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and whitespace
guard green; broad `pnpm check` with lint/typecheck clean, engine 385
files / 2279 tests, web 165 files / 933 passed + 18 skipped, repo build
5 / 5 tasks; final `git diff --check` green.

1. Create
   `packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`.
2. Inventory existing source-promotion and hostile-input surfaces:
   - near-source/material alias rows that are context-only;
   - manufacturer/source rows that must not override exact anchors;
   - raw wall and raw floor hostile input matrices;
   - API/import caller paths that can bypass workbench normalization;
   - visible route/output/report surfaces that could make screening or
     context-only rows look design-grade.
3. Prove the Rockwool Gate C policy remains closed without exact
   promotion: `Rw 41` grouped, `Rw 42` flat-list fail-closed, and field
   continuations remain frozen.
4. Select exactly one next bounded action:
   - a small implementation fix if Gate A names a concrete caller/import
     path that can leak an exact-looking result;
   - a visible guard if the issue is only user-facing wording;
   - a no-runtime closeout if all audited source/hostile surfaces are
     already owned and green.
5. Keep company-internal high-accuracy opening blocked unless source
   promotion ownership, hostile-input proof, current-gate, and broad
   `pnpm check` are all green at the opening handoff.

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts --maxWorkers=1
```

Continuity should include at least:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts src/raw-wall-hostile-input-answer-matrix.test.ts src/raw-floor-hostile-input-answer-matrix.test.ts --maxWorkers=1
```

Then run:

```sh
pnpm calculator:gate:current
git diff --check
```

Run broad `pnpm check` if Gate A moves runtime behavior, API/import
guards, shared schemas, route/report surfaces, or company-internal
opening posture.
