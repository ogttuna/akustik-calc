# Docs

This directory separates living reference docs from dated historical notes.

## Start Here — Agent Resume Triangle

Three docs are authoritative for "where are we and what comes next". If
they disagree, fix the drift before starting work.

1. [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md) —
   snapshot (what just closed, what is selected, what is frozen).
2. [calculator/MASTER_PLAN.md](./calculator/MASTER_PLAN.md) — strategic
   roadmap (why the current slice is the current slice, and the next
   ten moves; definition of "done" for the calculator).
3. [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
   §Now and §Selected Next Slice — tactical detail for the active slice.

Then run `pnpm calculator:gate:current` to confirm green baseline.

## Supporting Reads By Intent

- Calculator system model and runtime boundaries:
  [calculator/SYSTEM_MAP.md](./calculator/SYSTEM_MAP.md)
- Answer-origin and evidence-tier composition:
  [calculator/CALCULATION_MODEL_AND_VALIDATION.md](./calculator/CALCULATION_MODEL_AND_VALIDATION.md)
- Source-backed and deferred-family ledger:
  [calculator/SOURCE_GAP_LEDGER.md](./calculator/SOURCE_GAP_LEDGER.md)
- Wall coverage expansion program (master plan steps 2-6):
  [calculator/WALL_COVERAGE_EXPANSION_PLAN.md](./calculator/WALL_COVERAGE_EXPANSION_PLAN.md)
- Active slice detailed plan (wall field continuation value pinning, master-plan step 5):
  [calculator/SLICE_WALL_FIELD_CONTINUATION_VALUE_PINNING_PLAN.md](./calculator/SLICE_WALL_FIELD_CONTINUATION_VALUE_PINNING_PLAN.md)
- Split refactor cartography (step 4 v1 closed 2026-04-21; v2 follow-up deferred for composer injection):
  [calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
- Historical slice detailed plan (wall hostile input matrix with airborne cartography, closed 2026-04-21):
  [calculator/SLICE_WALL_HOSTILE_INPUT_WITH_CARTOGRAPHY_PLAN.md](./calculator/SLICE_WALL_HOSTILE_INPUT_WITH_CARTOGRAPHY_PLAN.md)
- Historical slice detailed plan (LSF + timber stud preset pack with physical invariants, closed 2026-04-21):
  [calculator/SLICE_LSF_TIMBER_PRESET_WITH_INVARIANTS_PLAN.md](./calculator/SLICE_LSF_TIMBER_PRESET_WITH_INVARIANTS_PLAN.md)
- Latest broad audit:
  [calculator/SYSTEM_AUDIT_2026-04-20.md](./calculator/SYSTEM_AUDIT_2026-04-20.md)
- Most recent historical checkpoint handoff:
  [calculator/CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md](./calculator/CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md)
- Repo-level direction and rules:
  [foundation/README.md](./foundation/README.md)
- Upstream import workflow:
  [imports/README.md](./imports/README.md)
- Dated status / handoff / analysis history:
  [archive/README.md](./archive/README.md)

## Fast Paths

- If the question is "where do I resume implementation now?":
  read [calculator/CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md](./calculator/CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md),
  then [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md),
  then run `pnpm calculator:gate:current`.
- If the question is "what is stable right now?":
  read [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md),
  then [calculator/SYSTEM_MAP.md](./calculator/SYSTEM_MAP.md),
  then [calculator/CALCULATION_MODEL_AND_VALIDATION.md](./calculator/CALCULATION_MODEL_AND_VALIDATION.md).
- If the question is "what should be implemented next?":
  read [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md),
  then [calculator/SOURCE_GAP_LEDGER.md](./calculator/SOURCE_GAP_LEDGER.md),
  then [calculator/DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./calculator/DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md).

## Hierarchy

```text
docs/
  calculator/   current calculator and workbench behavior
  foundation/   long-lived project direction and repo rules
  imports/      upstream import notes and helper commands
  archive/      dated status, handoff, and analysis notes
```

If a file under `docs/archive` disagrees with a living document under `docs/calculator` or `docs/foundation`, the living document wins.

## Current Canonical Documents

- [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan and validated next steps
- [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md): short living snapshot of the current calculator/workbench posture
- [calculator/SYSTEM_MAP.md](./calculator/SYSTEM_MAP.md): end-to-end system model, runtime boundaries, persistence posture, and test surface map
- [calculator/CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md](./calculator/CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md): current clean restart point, latest validation gate, post mixed floor/wall seeded-chain closeout and blocked-source refresh selection, with explicit not-done list
- [calculator/CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md](./calculator/CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md): historical post-harness runtime rerank closeout handoff
- [calculator/CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./calculator/CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md): historical formula-provenance checkpoint and close-out context
- [calculator/CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md](./calculator/CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md): historical UBIQ packaged open-web checkpoint
- [calculator/CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md](./calculator/CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md): historical clean resume point after the accepted 2026-04-13 guard slices
- [calculator/STABILIZATION_CHECKPOINT_2026-04-13.md](./calculator/STABILIZATION_CHECKPOINT_2026-04-13.md): historical package map for the accepted large dirty-worktree stabilization
- [calculator/FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md](./calculator/FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md): current full-engine-suite failure classification and cleanup notes
- [calculator/SYSTEM_AUDIT_2026-04-20.md](./calculator/SYSTEM_AUDIT_2026-04-20.md): broad system audit findings after the CLT second-pass closeout (docs, architecture, test coverage, wall coverage, user scenarios) with ROI-ranked fix list
- [calculator/WALL_COVERAGE_EXPANSION_PLAN.md](./calculator/WALL_COVERAGE_EXPANSION_PLAN.md): closed planning slice — produced the first executed sub-slice `wall_preset_expansion_v1` (AAC + masonry + CLT wall presets) plus the active next runtime slice `wall_reorder_output_set_consistency_v1`
- [calculator/DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./calculator/DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): explicit cross-floor/wall completion checklist and next-step order
- [calculator/DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./calculator/DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): execution model for coverage growth, accuracy tightening, and test-first slice planning
- [calculator/DYNAMIC_CALCULATOR_PLAN.md](./calculator/DYNAMIC_CALCULATOR_PLAN.md): active execution order for dynamic-calculator hardening
- [calculator/SOURCE_GAP_LEDGER.md](./calculator/SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family ledger
- [foundation/PROJECT_PLAN.md](./foundation/PROJECT_PLAN.md): long-lived product direction and repo constraints
- [foundation/SOURCE_REPO_POLICY.md](./foundation/SOURCE_REPO_POLICY.md): upstream import and parity policy

Status reading rule:

- use `CURRENT_STATE.md` for “what is stable right now”
- use `NEXT_IMPLEMENTATION_PLAN.md` for “what exactly should be implemented next”
- use `CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md` for “where the next agent should resume”
- use `STABILIZATION_CHECKPOINT_2026-04-13.md` for “how the accepted stabilization worktree was grouped and validated”
- use `DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md` for “what is done / partial / still open”
- use `DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md` for “how the next widening or tightening slice should be selected and tested”
- use `DYNAMIC_CALCULATOR_PLAN.md` only as the long-form roadmap, not as the sole current-status snapshot

## Historical Notes

Use [archive/README.md](./archive/README.md) for the dated status timeline, handoffs, and analysis index.
