# Checkpoint - Post-Knauf v5 Ready Revalidation Handoff

Date: 2026-04-29

Slice: `calculator_source_gap_revalidation_v5`

Gate: pre-Gate A checkpoint

Status: CHECKPOINT / NO RUNTIME MOVEMENT

## Decision

This checkpoint confirms the repository is at a clean stop before
`calculator_source_gap_revalidation_v5` Gate A.

The next implementation file remains:

`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`

No runtime import, support promotion, confidence promotion, evidence
promotion, output support movement, API movement, route-card movement,
output-card movement, proposal/report copy movement, or workbench-input
behavior movement is approved by this checkpoint.

## Docs and Implementation Comparison

Read and compared:

- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md)
- [CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md)
- [SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md)
- `AGENTS.md`
- `tools/dev/run-calculator-current-gate.ts`
- `packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
- `packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`

Implementation matches the plan:

- `calculator_source_gap_revalidation_v5` is the active selected slice.
- `packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`
  is intentionally absent and is the next bounded implementation file.
- `packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  exists and selects v5 after closing Knauf source-pack extraction
  no-runtime.
- `tools/dev/run-calculator-current-gate.ts` includes the landed Knauf
  Gate C closeout contract and does not include the not-yet-created v5
  Gate A file.
- No source-ready runtime candidate is currently selected.

One documentation drift was found and fixed: `CURRENT_STATE.md` resume
order pointed first at the Knauf Gate A handoff even though Gate C is
the latest checkpoint. The resume order now starts from this checkpoint
and the Gate C handoff.

## Current Gaps

The next v5 Gate A contract must keep these gaps explicit:

- Knauf rows `EN-PC-50-055-6-2-12.5-WB-25`, `TB.5A`, `TTF30.2A`,
  and `MWI.2A` remain research/backlog inputs only.
- `TO120.1A` remains a one-side-lined timber negative boundary.
- `TSF120.1A` and `AAC.1A` remain adjacent context only.
- Timber double-board stud wall still needs exact column, local
  board/insulation mapping, and tolerance ownership.
- Lined-massive / heavy-core wall still needs substrate, furring/cavity,
  coupling, board mapping, and tolerance ownership.
- CLT / mass-timber wall remains formula/source-gated until metric
  policy or tolerance ownership is solved.
- Generated floor fallback remains low-confidence/screening until an
  exact topology match or bounded family rule exists.
- No-stud double-leaf wall remains source-blocked until a direct row or
  local Davy/Sharp single-number tolerance owner exists.
- Historical blocked families remain fail-closed unless new evidence
  satisfies the original blocker directly.

## Next Action

Implement v5 Gate A:

`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`

The contract should re-rank source/accuracy candidates after Knauf Gate
C and select runtime work only if a candidate names exact topology,
metric owner, tolerance owner, material mapping, protected negative
boundaries, and paired engine/web visible tests. Otherwise it should
select the next no-runtime source acquisition, extraction, mapping,
planning, or validation slice.

## Validation

Completed during this checkpoint before documentation edits:

- `pnpm calculator:gate:current`: green, engine 148 files / 723 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `pnpm check`: green, lint/typecheck/test/build chain passed. The
  package stages replayed unchanged turbo cache artifacts for the broad
  suite: engine 281 files / 1543 tests, web 157 files / 890 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings.

Completed after documentation edits:

- `pnpm calculator:gate:current`: green, engine 148 files / 723 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `pnpm check`: green, lint/typecheck/test/build chain passed. The
  package stages replayed unchanged turbo cache artifacts for the broad
  suite: engine 281 files / 1543 tests, web 157 files / 890 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings.
