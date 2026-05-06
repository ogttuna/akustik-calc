# Checkpoint - 2026-05-05 Pre UBIQ Packaged-Finish Gate A Analysis Replan Handoff

Purpose: one more analysis/planning pass before implementing
`ubiq_open_web_packaged_finish_current_gate_guard_v1` Gate A.

## Status

This checkpoint is documentation-only. Runtime values, support
semantics, confidence, evidence promotion, API shape, route-card values,
output-card statuses, proposal/report copy, and workbench input behavior
remain frozen.

Current selected slice remains:

`ubiq_open_web_packaged_finish_current_gate_guard_v1`

Selected first implementation file remains:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Selected first action remains:

`gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate`

## Implementation Comparison

Implementation and docs agree on the next gap:

- the selected Gate A contract file is intentionally absent.
- the source-backed UBIQ packaged-finish engine and visible guard files
  already exist and pass focused continuity.
- those existing UBIQ packaged-finish guard files are not yet promoted
  into `tools/dev/run-calculator-current-gate.ts` as one current-gate
  owned pack.
- no broad or focused validation failure currently requires an emergency
  repair before this guard promotion.

Existing guard pack still ready for Gate A:

- `packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts`
- `packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts`
- `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`

## Source Check

The UBIQ packaged-finish slice remains source-backed by the official
UBIQ PDF:

`https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`

Verified accessible on 2026-05-05 as an official UBIQ PDF with 15 pages.
The current Gate A does not need new formula research because it is not
importing or retuning values; it is promoting already imported,
source-backed exact/bound rows into current-gate ownership.

## Why This Is Still The Correct First Step

The calculator priority is correct numeric behavior and source-backed
coverage, not confidence copy or product polish. The fastest correctness
gain that is currently unblocked is to make the existing UBIQ open-web
packaged-finish coverage permanent in `pnpm calculator:gate:current`.

This protects:

- `90 exact` UBIQ open-web rows.
- `21 bound` UBIQ open-web rows.
- exact family-design routing.
- bound-only behavior when the source only owns an upper-bound impact
  answer.
- near-miss fail-closed behavior.
- visible route/card behavior.
- saved/edit history replay behavior.

This is more correct than jumping to direct Rockwool exact runtime right
now because the Rockwool exact path still lacks a rights-safe,
source-owned curve/topology packet. It is also more correct than opening
generic/raw open-web widening because raw carriers still lack a
source-owned negative-boundary owner set.

## Blockers Carried Forward

Rockwool remains user-visible and high priority, but direct exact
runtime remains blocked by:

`rights_safe_source_owned_curve_payload_absent`

Current Rockwool posture remains:

- adjacent Rockwool supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool withheld from supported
  outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool live only as `Rw 41`, `multileaf_screening_blend`,
  screening-only, not exact, and not source-validated.

Generic/raw open-web widening remains blocked by:

`source_owned_raw_carrier_negative_boundary_absent`

## Next Implementation Steps

1. Create
   `packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`.
2. In that contract, assert a no-runtime Gate A with artifacts:
   `ubiq_packaged_finish_current_gate_guard_gate_a_summary`,
   `current_gate_promoted_ubiq_packaged_finish_engine_visible_pack`,
   `source_verified_ubiq_packaged_finish_pdf_status`, and
   `rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a`.
3. Add the seven existing UBIQ packaged-finish engine/web guard files to
   `tools/dev/run-calculator-current-gate.ts`.
4. Prove the current-gate runner contains those seven guard files plus
   the new Gate A contract.
5. Keep all numeric/runtime/user-visible behavior frozen.
6. Run focused Gate A, focused UBIQ engine/web continuity,
   `pnpm calculator:gate:current`, and `git diff --check`.
7. Write the Gate A checkpoint and select closeout/revalidation only
   after validation passes.

## Validation Evidence For This Replan

Commands completed on 2026-05-05:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts src/ubiq-open-web-packaged-finish-family-design.test.ts src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts src/ubiq-open-web-packaged-lane-trace-matrix.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts --maxWorkers=1
```

Results:

- engine focused continuity: 4 files / 10 tests passed.
- web focused continuity: 4 files / 5 tests passed.
