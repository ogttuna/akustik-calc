# Checkpoint - Calculator Source Gap Revalidation v5 Gate A Handoff

Date: 2026-04-30

Slice: `calculator_source_gap_revalidation_v5`

Gate: Gate A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`
lands v5 Gate A as an executable source/accuracy rerank after Knauf
Gate C.

Gate A found no source-ready runtime candidate. It selects:

`timber_double_board_knauf_tb5a_mapping_tolerance_v1`

Next first implementation file:

`packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`

Selection status:

`selected_no_runtime_knauf_tb5a_timber_double_board_mapping_tolerance_after_v5_rerank_found_no_runtime_ready_candidate`

## Why TB.5A Is Next

Knauf `TB.5A` is the highest-value no-runtime follow-up because it
targets a common company-use timber double-board wall lane and has a
concrete official Knauf locator. It is closer to the live caveated
`wall-timber-stud` generated route than the other remaining candidates.

It is still not a runtime import:

- exact stud-depth column remains unresolved;
- `SHEETROCK ONE` needs local board mapping or rejection;
- `KI 75G11` needs local insulation mapping or rejection;
- lab / field metric and output policy remain unresolved;
- tolerance owner remains missing;
- paired engine value tests and web visible tests are not yet named.

## Rerank Result

Gate A ranked the current candidates as:

1. `knauf_tb5a_timber_double_board_mapping_tolerance` - selected
   no-runtime.
2. `knauf_mwi2a_lined_masonry_mapping_tolerance` - still blocked by
   substrate, furring/cavity, coupling, board mapping, field policy, and
   tolerance ownership.
3. `clt_mass_timber_metric_policy_tolerance` - still blocked by STC /
   FSTC / ASTC / IIC to DynEcho metric policy and tolerance ownership.
4. `generated_floor_fallback_pliteq_ubiq_topology` - still blocked by
   exact topology / bounded family rule.
5. `no_stud_double_leaf_tolerance_or_direct_row` - still blocked by
   missing direct row or local Davy / Sharp single-number tolerance
   owner.
6. `historical_blocked_family_reopen` - stays fail-closed until each
   original blocker is directly satisfied.
7. `internal_use_pilot_defect_or_promotion` - controlled-use evidence
   exists but does not promote source-gated families.
8. `productization_only_work` - deferred while source/accuracy coverage
   remains the active priority.

## Frozen Surfaces

This checkpoint moves no calculator behavior. These surfaces remain
frozen:

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

No acoustic values, support buckets, confidence, evidence tiers, output
support, API shape, route-card values, output-card statuses,
proposal/report copy, missing-input guidance, or workbench-input
behavior moved.

## Next Action

Implement:

`packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`

Use the plan:

[SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md](./SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md)

The next Gate A must resolve or keep blocked the `TB.5A` row / column,
`SHEETROCK ONE` mapping, `KI 75G11` mapping, lab / field metric policy,
tolerance owner, negative boundaries, and paired visible-test plan.

## Validation

Baseline before v5 Gate A implementation:

- `pnpm calculator:gate:current`: green on 2026-04-30, engine 148 files
  / 723 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with
  known non-fatal `sharp/@img` warnings, whitespace guard clean.

Completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts --maxWorkers=1`:
  green, 1 file / 7 tests.
- `pnpm calculator:gate:current`: green, engine 149 files / 730 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
