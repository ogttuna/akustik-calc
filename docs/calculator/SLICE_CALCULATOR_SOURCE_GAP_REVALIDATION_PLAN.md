# Slice Plan - Calculator Source Gap Revalidation v1

Status: CLOSED (opened 2026-04-27 after
`proposal_report_polish_v1`; Gate A closed no-runtime 2026-04-27)

## Objective

Re-enter calculator scope/accuracy work safely after proposal/report
polish. Refresh the remaining source-gap ranking and choose the next
runtime or source-acquisition slice only when the evidence supports it.

Gate A is intentionally no-runtime: it updates the executable map of
what is blocked, what is source-backed, and what should be worked next.

Gate A has now landed in
`packages/engine/src/calculator-source-gap-revalidation-gate-a-contract.test.ts`.
It selected `wall_coverage_expansion_planning_v2` because the
historical blocked-source queue has no runtime-eligible candidate and
wall coverage remains the highest-value scope/accuracy planning gap.

## Non-Goals

- Do not change formulas, runtime values, output support, confidence
  scores, or rounded results in Gate A.
- Do not promote a source-gated family because neighboring tests are
  green.
- Do not resume billing, deployment, team access, or other
  productization work while this calculator slice is selected.
- Do not edit `/home/ogttuna/Dev/Machinity/Acoustic2`; it remains
  read-only upstream/reference material.

## Current Baseline

- `ui_input_output_honesty_v1` closed the private/internal-use
  calculator readiness chain with visible caveats.
- `proposal_report_polish_v1` closed report-surface honesty without
  changing acoustic calculations.
- Heavy-core/concrete remains screening.
- Timber stud and CLT wall remain formula/source-gated except for the
  exact rows already landed in prior side-count/source slices.
- Floor fallback remains low-confidence until new source evidence or a
  bounded family rule exists.
- `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
  wall-selector behavior, reinforced-concrete reopening, and similar
  blocked families remain fail-closed unless deliberately selected with
  source evidence.

## Gate A - No-Runtime Revalidation

1. Re-read and reconcile:
   - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
   - [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
   - [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
   - [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
   - prior blocked-source contracts:
     `source-gap-candidate-re-rank-contract.test.ts`,
     `remaining-source-gap-posture-matrix.test.ts`,
     `blocked-source-rank-*`,
     `post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts`,
     `post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts`,
     and the recent heavy-core/timber/CLT/floor-fallback contracts.
2. Run `pnpm calculator:gate:current` as the baseline.
3. Add or update one executable revalidation contract that records:
   - current source-gap candidates;
   - why each candidate is still blocked or ready;
   - which evidence file/test owns that decision;
   - the selected next slice after Gate A.
4. Do not change runtime behavior in this gate. If a candidate appears
   ready, select a narrow Gate B runtime/source slice in a post-contract
   instead of changing values immediately.
5. Update the plan docs and handoff once the no-runtime ranking is
   green.

## Gate A Closeout - Landed 2026-04-27

Result:

- no calculator runtime behavior changed;
- `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact, and
  wall-selector behavior remain closed fail-closed;
- heavy-core/concrete, timber stud, CLT wall, and floor fallback remain
  in their current screening/formula/low-confidence posture rather than
  being promoted from nearby green tests;
- the selected next slice is
  [SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md](./SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md).

Handoff:

- [CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md)

## Candidate Families To Re-Rank

| Candidate | Current posture | Gate A question |
|---|---|---|
| `GDMTXA04A` visible exact composite surface | fail-closed / source-form mismatch | Is there now a source-backed surface model that can map visible layers without fabricating an exact row? |
| `C11c` TUAS exact import | fail-closed / frequency-source anomaly | Is the source anomaly resolved enough for exact import, or does it stay blocked? |
| Raw bare open-box/open-web impact | fail-closed | Is there a source or bounded rule for raw/bare topology, or must impact support remain explicit unsupported/low-confidence? |
| Heavy-core/concrete lined massive wall | screening | Is there topology-specific source/formula evidence to tighten beyond screening? |
| Timber stud / CLT wall holdouts | formula/source-gated | Are any remaining exact/topology rows ready without broad heuristic widening? |
| Floor fallback low-confidence | low-confidence screening | Is there source evidence or a bounded steel/open-web rule that can reduce low-confidence posture? |
| Reinforced concrete reopen | closed unless evidence appears | Is there new formula/source evidence, or should it stay sealed? |
| Wall selector behavior | closed unless explicit source-backed slice | Is a new selector source/model available, or should no selector widening occur? |

## Completion Criteria

- Gate A has an executable contract that names the current candidate
  ranking and blockers.
- `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, this plan, and the
  relevant checkpoint agree on the active selected slice.
- Runtime values, output support, confidence scores, and formulas remain
  unchanged in Gate A.
- `pnpm calculator:gate:current` and `git diff --check` are green after
  the revalidation contract/doc update.
- The next implementation step is explicit: either a source-acquisition
  task, a narrow Gate B runtime/source slice, or another no-runtime
  evidence audit.

## Next Bounded Step

Start `wall_coverage_expansion_planning_v2` Gate A:

1. run the baseline focused gate;
2. inventory current wall coverage and source/formula/screening
   ownership;
3. write the no-runtime wall planning contract;
4. select the first wall runtime/source slice only after that contract
   passes.
