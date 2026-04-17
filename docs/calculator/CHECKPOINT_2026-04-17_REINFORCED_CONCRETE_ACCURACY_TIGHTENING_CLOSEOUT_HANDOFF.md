# Checkpoint 2026-04-17 Reinforced-Concrete Accuracy Tightening Closeout Handoff

Document role:

- define the current checkpoint after the reinforced-concrete accuracy
  tightening slice closes cleanly
- map the living plan to implemented work without pretending the next CLT
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
3. Confirm the active selected slice is now `dataholz_clt_calibration_tightening`.
4. Open:
   - [predictor-published-family-estimate.ts](../../packages/engine/src/predictor-published-family-estimate.ts)
   - [predictor-floor-system-estimate.ts](../../packages/engine/src/predictor-floor-system-estimate.ts)
   - [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
   - [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts)
   - [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
   - [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts)
   - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
5. Run `pnpm calculator:gate:current` before touching runtime code.

Do not reopen reinforced-concrete wording passes, heavy-concrete parity
widening, raw open-box/open-web, `GDMTXA04A` exact reopening, `C11c`, or
wall-selector widening first. The next safe step is the selected Dataholz CLT
calibration tightening.

## Current Answer In One Screen

- latest closed implementation slice:
  `reinforced_concrete_accuracy_tightening_follow_up_v1`
- latest selected next slice:
  `dataholz_clt_calibration_tightening`
- current checkpoint rule:
  the reinforced-concrete tightening is closed; the next move is CLT
  calibration tightening, not another reinforced-concrete honesty micro-pass
- explicit not-done item:
  the CLT tightening pass is still open; exact-vs-estimate calibration and the
  explicit `GDMTXA04A` blocked surface decision remain the active bounded risk,
  but no fresh evidence currently justifies reopening that blocked exact path

## What Closed In This Checkpoint

- `reinforced_concrete_accuracy_tightening_follow_up_v1`
  - kept the reinforced-concrete `vinyl + elastic ceiling` corridor explicitly
    frozen on the `low_confidence` lane
  - removed the dormant direct published-family helper overlap so the active
    solver and direct helper behavior no longer disagree about a hidden
    `family_general` lane
  - kept nearby-row ranking and support/proposal/report wording screening-only
    under hostile history, replay, and visible-stack variants
  - carried the same nearby-row fallback posture through trace, support,
    proposal, diagnostics, and consultant-decision surfaces
  - closed the residual solver-side fit decision with executable guards instead
    of leaving helper-only ambiguity behind

No additional runtime or numeric calculator behavior changed in this closeout
selection step itself.

## File Map For This Checkpoint

- selected planning contract:
  [post-reinforced-concrete-accuracy-tightening-follow-up-next-slice-selection-contract.test.ts](../../packages/engine/src/post-reinforced-concrete-accuracy-tightening-follow-up-next-slice-selection-contract.test.ts)
- closed reinforced-concrete evidence:
  - [reinforced-concrete-formula-family-closeout-audit.test.ts](../../packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts)
  - [reinforced-concrete-family-formula-fit-audit.test.ts](../../packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts)
  - [reinforced-concrete-low-confidence-proposal-honesty.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts)
- selected Dataholz CLT evidence:
  - [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts)
  - [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
  - [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts)
- selected runtime anchors:
  - [predictor-published-family-estimate.ts](../../packages/engine/src/predictor-published-family-estimate.ts)
  - [predictor-floor-system-estimate.ts](../../packages/engine/src/predictor-floor-system-estimate.ts)
  - [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
  - [calculate-assembly.ts](../../packages/engine/src/calculate-assembly.ts)
- current focused gate:
  [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts)
- source-backed boundary ledger:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## What Is Planned But Not Done Now

- `dataholz_clt_calibration_tightening`
  remains selected and not started
  - first tightening targets:
    - keep exact Dataholz CLT rows numerically/source-truth pinned
    - tighten the defended CLT estimate lane without reopening blocked exact
      surfaces
    - keep `GDMTXA04A` explicit as a blocked material-surface boundary unless
      new evidence appears
- reinforced-concrete reopening remains conditional-only
  - do not reopen the closed low-confidence corridor unless a new proof-backed
    family overlap appears
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
  - focused web gate: `2/2` test files passed, `5/5` tests passed
- `pnpm check`
  - green
  - full engine suite: `153/153` test files passed, `945/945` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

## Minimal Resume Commands

1. `pnpm calculator:gate:current`
2. `pnpm --filter @dynecho/engine exec vitest run src/post-reinforced-concrete-accuracy-tightening-follow-up-next-slice-selection-contract.test.ts src/reinforced-concrete-formula-family-closeout-audit.test.ts src/reinforced-concrete-family-formula-fit-audit.test.ts src/dataholz-clt-source-truth-audit.test.ts src/floor-source-corpus-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/web exec vitest run features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts --maxWorkers=1`
4. Read [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) before tightening runtime code.

## Exact Resume Target

Keep the next scope on:

- planning contract:
  [post-reinforced-concrete-accuracy-tightening-follow-up-next-slice-selection-contract.test.ts](../../packages/engine/src/post-reinforced-concrete-accuracy-tightening-follow-up-next-slice-selection-contract.test.ts)
- selected engine guards:
  [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts)
  and [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
- selected workbench guard:
  [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts)
- closed-slice guard:
  [reinforced-concrete-family-formula-fit-audit.test.ts](../../packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts)
- source-gap evidence map:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- living plan:
  [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)

Do not claim the Dataholz CLT tightening is closed until runtime edits land and
full validation is green again.
