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

Then run `pnpm calculator:gate:current` to confirm the green
baseline.

## Supporting Reads

- [calculator/CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md](./calculator/CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md)
  — latest session narrative + explicit deferral ledger. Read
  this before any archived checkpoint.
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
- [calculator/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md](./calculator/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md)
  — tactical plan for the active slice (master-plan step 7b,
  authored 2026-04-22).
- [archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md](./archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md)
  — tactical plan for master-plan step 7 (closed 2026-04-22).
  Reference doc for future agents investigating the same-
  material-split fixes (F1/F2) and the cross-mode torture
  matrix authoring pattern.
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
  [calculator/CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md](./calculator/CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md)
  → [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  → `pnpm calculator:gate:current`.
- "What is stable right now?" →
  [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md)
  → [calculator/SYSTEM_MAP.md](./calculator/SYSTEM_MAP.md)
  → [calculator/CALCULATION_MODEL_AND_VALIDATION.md](./calculator/CALCULATION_MODEL_AND_VALIDATION.md).
- "What should be implemented next?" →
  [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  → [calculator/MASTER_PLAN.md](./calculator/MASTER_PLAN.md) §3
  state grid + §4 master sequence.
- "What was the session narrative?" →
  [calculator/CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md](./calculator/CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md).

## Status Reading Rule

- Use `CURRENT_STATE.md` for "what is stable right now".
- Use `NEXT_IMPLEMENTATION_PLAN.md` for "what exactly should be
  implemented next".
- Use `CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md` for the
  most recent session narrative.
- Use older checkpoints under `docs/archive/handoffs/` only when
  you need the historical context that predates the living
  triangle.

## Historical Notes

Use [archive/README.md](./archive/README.md) for the dated
status timeline, handoffs, closed-slice plans, and analysis
index.
