# Checkpoint - 2026-05-05 - Source Promotion Hostile-Input Readiness Guard Gate A Handoff

Slice id:

`source_promotion_hostile_input_readiness_guard_v1`

Landed Gate A file:

`packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`

Landed Gate A action:

`gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout`

Gate A status:

`gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout`

Selected next file:

`packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

## What Changed

Gate A found and fixed one bounded hostile API validation gap. A hostile
JSON body can encode `1e309`; `JSON.parse` turns that into `Infinity`.
The old shared layer schema accepted the value because it used
`z.number().positive()`. The engine still failed closed and did not
return an exact-looking result, but estimate / impact-only API routes
could return a 200 fail-closed calculation instead of rejecting the
request.

Gate A tightened `packages/shared/src/domain/layer.ts` to
`thicknessMm: z.number().finite().positive()` and pinned the behavior in
`apps/web/lib/calculator-api-validation.test.ts` for both `/api/estimate`
and `/api/impact-only`.

Calculator numeric runtime values, output support, confidence,
evidence, route-card values, output-card status, proposal/report values,
and workbench-input behavior stayed frozen. This is an API/shared-schema
validation tightening, not a value retune and not source evidence.

## Gate A Artifacts

- `source_promotion_surface_inventory`
- `hostile_api_import_fail_closed_surface_inventory`
- `estimate_json_1e309_rejected_by_finite_layer_schema`
- `server_import_snapshot_not_runtime_promotion_surface`
- `near_source_rows_context_only_until_owner_set_exists`
- `rockwool_gate_c_policy_freeze_carry_forward`
- `selected_source_promotion_hostile_closeout_with_target_file`

## Source Promotion Result

`source_promotion_surface_inventory` confirms exact source controls and
near-source aliases remain separated. Exact source rows may promote only
with source provenance, topology ownership, material mapping ownership,
metric context ownership, tolerance ownership, negative boundaries,
paired engine tests, and paired visible tests.

`near_source_rows_context_only_until_owner_set_exists` remains active.
Near-source gypsum / rockwool / firestop aliases do not inherit curated
exact source warnings or exact source confidence. No source row or
near-source material alias was imported into runtime.

## Hostile API / Import Result

`hostile_api_import_fail_closed_surface_inventory` confirms:

- `estimate_json_1e309_rejected_by_finite_layer_schema`;
- impact-only `1e309` layer payloads are also rejected by the finite
  layer schema;
- unknown material IDs can still pass request shape validation, but
  engine runtime fail-closes with no supported outputs and an unknown
  material warning;
- raw wall, raw floor, and all-caller invalid-thickness guard matrices
  remain part of the current-gate runner.

`server_import_snapshot_not_runtime_promotion_surface` confirms server
project import is persistence, not calculator promotion. It stores
browser-local `calculatorInput` and optional `calculatorOutput`
snapshots, rejects non-finite JSON snapshots through `JsonValueSchema`,
does not run calculator runtime, and restore paths parse
`calculatorInput.payload` rather than seeding live exact values from
stored `calculatorOutput`.

## Rockwool Carry-Forward

`rockwool_gate_c_policy_freeze_carry_forward` remains unchanged:

- grouped split-rockwool stays `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only, not
  exact, and not source-validated;
- flat-list adjacent swap stays `Rw 42` on
  `multileaf_screening_blend_fail_closed_until_grouped_topology`;
- field `R'w 34` and `DnT,w 36` remain continuations from the Rockwool
  screening lane, not independent measured field or design-grade
  results;
- Uris 2006 remains `paused_waiting_rights_safe_source_packet`.

## Next Step

Create and run:

`packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`

The closeout should consume the Gate A artifacts and select the next
bounded company-internal opening or final validation step. High-accuracy
company-internal opening remains blocked until this closeout, current
gate, broad `pnpm check`, and final opening handoff evidence are green.

## Validation

Validation completed on 2026-05-05.

Focused Gate A passed 1 file / 6 tests:

```sh
pnpm --filter @dynecho/engine exec vitest run src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts --maxWorkers=1
```

Focused web API validation passed 1 file / 3 tests:

```sh
pnpm --filter @dynecho/web exec vitest run lib/calculator-api-validation.test.ts --maxWorkers=1
```

Engine continuity passed 8 files / 44 tests:

```sh
pnpm --filter @dynecho/engine exec vitest run src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts src/raw-wall-hostile-input-answer-matrix.test.ts src/raw-floor-hostile-input-answer-matrix.test.ts src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts --maxWorkers=1
```

`pnpm calculator:gate:current` passed:

- engine 251 files / 1454 tests;
- web 53 files / 260 passed + 18 skipped;
- repo build 5 / 5 tasks;
- whitespace guard green.

Broad `pnpm check` was required because this gate changes shared API
validation behavior. The first broad attempt stopped on a lint-only
unused test constant; the constant was removed and the full rerun passed:

- lint clean;
- typecheck clean;
- engine 384 files / 2274 tests;
- web 165 files / 933 passed + 18 skipped;
- repo build 5 / 5 tasks.

Final `git diff --check` was green after restoring
`apps/web/next-env.d.ts` to `.next-typecheck`.

Final command:

```sh
pnpm check
git diff --check
```

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`. `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after Next build rewrote the route-types path.
