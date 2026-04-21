# Checkpoint 2026-04-17 Heavy Concrete Formula Family Closeout Handoff

Superseded by
[CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md)
for the current restart point.

Document role:

- define the current checkpoint after the defended heavy-concrete widening
  closes cleanly
- map the living plan to implemented work without pretending the next accuracy
  tightening is already landed
- give the next agent a short restart path, a fresh validation gate, and an
  explicit not-done list

This is a checkpoint document, not a new solver plan.

Use [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) as the current
next-step authority.
Use [CURRENT_STATE.md](./CURRENT_STATE.md) as the short verified snapshot.
Use [SYSTEM_MAP.md](./SYSTEM_MAP.md) for the live runtime/file map.

## Two-Minute Restart

1. Read this file first.
2. Open [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Confirm the active selected slice is now
   `reinforced_concrete_accuracy_tightening_follow_up_v1`.
4. Open:
   - [heavy-concrete-published-upper-treatment-estimate.ts](../../packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts)
   - [predictor-published-family-estimate.ts](../../packages/engine/src/predictor-published-family-estimate.ts)
   - [impact-estimate.ts](../../packages/engine/src/impact-estimate.ts)
   - [target-output-support.ts](../../packages/engine/src/target-output-support.ts)
   - [reinforced-concrete-formula-family-closeout-audit.test.ts](../../packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts)
   - [impact-heavy-floor-planned-scope-benchmark.test.ts](../../packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts)
   - [reinforced-concrete-floor-monotonicity.test.ts](../../packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts)
   - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
5. Run `pnpm calculator:gate:current` before touching runtime code.

Do not reopen parity widening, CLT tightening, raw open-box/open-web,
`GDMTXA04A`, `C11c`, or wall-selector widening first. The next safe step is the
selected reinforced-concrete accuracy tightening.

## Current Answer In One Screen

- latest closed implementation slice:
  `heavy_concrete_formula_family_widening_v1`
- latest selected next slice:
  `reinforced_concrete_accuracy_tightening_follow_up_v1`
- current checkpoint rule:
  the heavy-concrete widening is closed; the next move is accuracy tightening
  on the same owned reinforced-concrete corridor, not more parity hunting
- explicit not-done item:
  the next tightening pass is still open; low-confidence
  `vinyl + elastic ceiling`, residual family-vs-formula fit, and companion /
  edge-continuity honesty are not tightened yet

## What Closed In This Checkpoint

- `heavy_concrete_formula_family_widening_v1`
  - landed six defended concrete widening / parity substeps:
    - combined wet concrete predictor inputs keep their resilient separator
      instead of collapsing to the bare-slab formula path
    - wet ceramic-tile + elastic gypsum ceiling predictor inputs promote onto
      the defended published heavy-concrete upper-treatment lane
    - wet ceramic-tile + rigid gypsum ceiling predictor inputs promote onto the
      defended published heavy-concrete upper-treatment lane without widening
      into firestop-board variants
    - visible-stack `generic_gypsum_board` parity restores the same bounded
      gypsum corridor while leaving DeltaLw on the visible-stack formula
      companion
    - `fire_board` predictor inputs resolve onto the bounded firestop-board
      family-archetype corridor
    - split `engineered_timber_flooring` plus generic resilient underlay
      resolves onto the bounded timber-underlay archetype corridor
  - closed the final explicit carpet-plus-generic-underlay probe as a negative
    guard:
    canonical carpet stays on the bounded Knauf carpet archetype lane, while
    carpet plus extra generic underlay remains formula-owned on the impact side
    and keeps only the heavy-concrete airborne companion estimate
  - landed the central ownership matrix:
    [reinforced-concrete-formula-family-closeout-audit.test.ts](../../packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts)
  - no seventh defended parity widening remains proven
  - blocked branches stayed blocked:
    - firestop rigid concrete ceiling
    - no-fill / tile-only / lower-only gypsum concrete variants
    - concrete `vinyl + elastic ceiling` beyond low-confidence
    - CLT / `GDMTXA04A` / `C11c` / raw open-box-open-web / wall-selector work

None of those closeout updates changed runtime or numeric calculator behavior
in the selection step itself.

## File Map For This Checkpoint

- selected planning contract:
  [post-heavy-concrete-formula-family-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-heavy-concrete-formula-family-widening-next-slice-selection-contract.test.ts)
- selected runtime anchors:
  - [heavy-concrete-published-upper-treatment-estimate.ts](../../packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts)
  - [predictor-published-family-estimate.ts](../../packages/engine/src/predictor-published-family-estimate.ts)
  - [impact-estimate.ts](../../packages/engine/src/impact-estimate.ts)
  - [target-output-support.ts](../../packages/engine/src/target-output-support.ts)
- selected reinforced-concrete engine evidence:
  - [reinforced-concrete-formula-family-closeout-audit.test.ts](../../packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts)
  - [impact-heavy-floor-planned-scope-benchmark.test.ts](../../packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts)
  - [reinforced-concrete-floor-monotonicity.test.ts](../../packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts)
  - [calculate-impact-only.test.ts](../../packages/engine/src/calculate-impact-only.test.ts)
- selected reinforced-concrete workbench evidence:
  - [heavy-concrete-formula-history-card-matrix.test.ts](../../apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts)
  - [heavy-concrete-formula-provenance-report-surface.test.ts](../../apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts)
- held Dataholz CLT evidence:
  - [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts)
  - [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
  - [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts)
- current focused gate:
  [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts)
- source-backed boundary ledger:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## What Is Planned But Not Done Now

- `reinforced_concrete_accuracy_tightening_follow_up_v1`
  remains selected and not started
  - first tightening targets:
    - low-confidence `vinyl + elastic ceiling` evidence posture
    - residual family-vs-formula fit drift on the defended corridor
    - companion-output honesty and hostile edge continuity
- `dataholz_clt_calibration_tightening`
  remains held-only
  - it is still a good next tightening family, but it is no longer the first
    honest move while reinforced concrete has the higher-ROI tightening path
- parity reopening remains conditional-only
  - do not reopen the heavy-concrete widening unless a new proof-backed
    equivalence appears
- still blocked:
  - raw bare open-box/open-web impact widening
  - visible `GDMTXA04A` exact reopen
  - TUAS `C11c` exact import
  - wall-selector behavior widening without a fresh classified red

## Validation Gate For This Checkpoint

Revalidated on `2026-04-17`:

- `pnpm calculator:gate:current`
  - green
  - focused engine gate: `5/5` test files passed, `23/23` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
- `pnpm check`
  - green
  - full engine suite: `148/148` test files passed, `930/930` tests passed
  - full web suite: `113/113` test files passed, `655/655` tests passed
  - `pnpm lint`: green
  - `pnpm typecheck`: green
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

## Minimal Resume Commands

1. `pnpm calculator:gate:current`
2. `pnpm --filter @dynecho/engine exec vitest run src/post-heavy-concrete-formula-family-widening-next-slice-selection-contract.test.ts src/reinforced-concrete-formula-family-closeout-audit.test.ts src/impact-heavy-floor-planned-scope-benchmark.test.ts src/reinforced-concrete-floor-monotonicity.test.ts src/dataholz-clt-source-truth-audit.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/web exec vitest run features/workbench/heavy-concrete-formula-history-card-matrix.test.ts features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts --maxWorkers=1`
4. Read [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) before tightening runtime code.

## Exact Resume Target

Keep the next scope on:

- planning contract:
  [post-heavy-concrete-formula-family-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-heavy-concrete-formula-family-widening-next-slice-selection-contract.test.ts)
- selected engine guards:
  [reinforced-concrete-formula-family-closeout-audit.test.ts](../../packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts),
  [impact-heavy-floor-planned-scope-benchmark.test.ts](../../packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts),
  and [reinforced-concrete-floor-monotonicity.test.ts](../../packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts)
- selected workbench guards:
  [heavy-concrete-formula-history-card-matrix.test.ts](../../apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts)
  and [heavy-concrete-formula-provenance-report-surface.test.ts](../../apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts)
- source-gap evidence map:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- living plan:
  [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)

Do not claim the reinforced-concrete accuracy tightening is closed until
runtime edits land and full validation is green again.
