# Calculator Docs

Living reference docs for the DynEcho acoustic calculator. Read
these before anything under `docs/archive/`.

## Agent Resume Triangle

Three docs, in order. If they disagree with each other, stop and
fix the drift before starting work.

1. [CURRENT_STATE.md](./CURRENT_STATE.md) — short snapshot of
   what is stable right now, completion signals, active slice,
   deferred follow-up tracks.
2. [MASTER_PLAN.md](./MASTER_PLAN.md) — strategic roadmap,
   quantitative completion targets, ROI table, accuracy
   preservation contract, master sequence.
3. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
   — tactical detail for the active slice.

Then run `pnpm calculator:gate:current` to confirm the green
baseline.

## Supporting Reads

- [CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md](./CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md)
  — latest session narrative (27 commits, five slices closed) +
  explicit deferral ledger for the three follow-up tracks.
- [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
  — `dynamic-airborne.ts` split blueprint. v1 landed 2026-04-21;
  v2 composer-injection follow-up is the deferred track.
- [SYSTEM_MAP.md](./SYSTEM_MAP.md) — end-to-end system model,
  runtime boundaries, persistence posture, test surface map.
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
  — answer-origin semantics and evidence-tier composition.
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) — source-backed
  widening / tightening / deferred-family ledger.

## Archived Documents

The following docs have moved to `docs/archive/`. They informed
earlier decisions but the living triangle above now supersedes
them. Check archive when you need historical context.

- `docs/archive/handoffs/` — closed-slice plans
  (`SLICE_LSF_TIMBER_PRESET_WITH_INVARIANTS_PLAN.md`,
  `SLICE_WALL_HOSTILE_INPUT_WITH_CARTOGRAPHY_PLAN.md`,
  `SLICE_WALL_FIELD_CONTINUATION_VALUE_PINNING_PLAN.md`); older
  checkpoint handoffs (2026-04-08 → 2026-04-19);
  `STABILIZATION_CHECKPOINT_2026-04-13.md`.
- `docs/archive/analysis/` — closed planning docs
  (`DYNAMIC_CALCULATOR_PLAN.md`,
  `DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md`,
  `DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md`,
  `WALL_COVERAGE_EXPANSION_PLAN.md`);
  `SYSTEM_AUDIT_2026-04-20.md`; historical wall-stability +
  suite-triage analyses.

## Document Freshness Rule

Every closed slice updates:

1. `CURRENT_STATE.md` — active slice moved + latest closed slice
   recorded + completion-signal table flipped.
2. `NEXT_IMPLEMENTATION_PLAN.md` — "Now" section points at the
   new active slice.
3. The slice's post-contract test — executable closure record.
4. `MASTER_PLAN.md` §3 implementation state grid + §4 master
   sequence row for the closed slice.

Skipping any of the four is how drift restarts.
