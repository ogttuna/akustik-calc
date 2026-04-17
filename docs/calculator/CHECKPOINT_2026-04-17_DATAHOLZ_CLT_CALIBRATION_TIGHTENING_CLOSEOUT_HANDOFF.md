# Checkpoint 2026-04-17 Dataholz CLT Calibration Tightening Closeout Handoff

Document role:

- define the current checkpoint after the defended Dataholz CLT calibration
  tightening slice closes cleanly
- map the living plan to implemented work without pretending the blocked-source
  rerank is already landed
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
   `blocked_source_backed_widening_rerank_v1`.
4. Open:
   - [post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts)
   - [blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts)
   - [blocked-source-rank-2-c11c-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts)
   - [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts)
   - [raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts](../../packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts)
   - [remaining-source-gap-posture-matrix.test.ts](../../packages/engine/src/remaining-source-gap-posture-matrix.test.ts)
   - [dataholz-gdmtxa04a-material-surface-recheck.test.ts](../../packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts)
   - [remaining-source-gap-posture-card-matrix.test.ts](../../apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts)
   - [output-origin-trace-card-matrix.test.ts](../../apps/web/features/workbench/output-origin-trace-card-matrix.test.ts)
   - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
5. Run `pnpm calculator:gate:current` before touching behavior code.

Do not reopen `GDMTXA04A`, raw open-box/open-web, `C11c`,
reinforced-concrete, heavy-concrete parity, or wall-selector widening first.
The next safe step is the selected blocked-source rerank.

## Current Answer In One Screen

- latest closed implementation slice:
  `dataholz_clt_calibration_tightening`
- latest selected next slice:
  `blocked_source_backed_widening_rerank_v1`
- current checkpoint rule:
  the defended CLT calibration pass is closed; the next move is a no-runtime
  rerank of the still-blocked source-backed widening families, not another CLT
  micro-tightening or a direct reopen
- explicit not-done item:
  the rerank pass is still open; blocked-family ROI and order still need to be
  refreshed before any new runtime widening or exact reopen is selected

## What Closed In This Checkpoint

- `dataholz_clt_calibration_tightening`
  - kept the visible `GDMTXA04A`-like composite dry-screed boundary on the
    defended estimate route instead of reopening exact matching
  - capped lab-side `Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI` against the
    direct official exact row so the visible estimate route no longer drifts
    optimistically
  - moved the same visible boundary onto the standardized
    `L'nT,50` companion path instead of the weaker local-guide fallback
  - preserved the explicit blocked `GDMTXA04A` material-surface posture
  - left no higher-ROI runtime tightening item on the defended CLT corridor

No additional runtime or numeric calculator behavior changed in the selection
step itself.

## File Map For This Checkpoint

- selected planning contract:
  [post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts)
- closed Dataholz CLT evidence:
  - [dataholz-clt-calibration-tightening-audit.test.ts](../../packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts)
  - [dataholz-gdmtxa04a-material-surface-recheck.test.ts](../../packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts)
  - [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts)
  - [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
  - [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts)
- selected rerank evidence:
  - [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts)
  - [raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts](../../packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts)
  - [remaining-source-gap-posture-matrix.test.ts](../../packages/engine/src/remaining-source-gap-posture-matrix.test.ts)
  - [remaining-source-gap-posture-card-matrix.test.ts](../../apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts)
  - [output-origin-trace-card-matrix.test.ts](../../apps/web/features/workbench/output-origin-trace-card-matrix.test.ts)
- current focused gate:
  [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts)
- source-backed boundary ledger:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## What Is Planned But Not Done Now

- `blocked_source_backed_widening_rerank_v1`
  remains selected and now has rank-1 progress landed
  - current rerank order:
    1. visible `GDMTXA04A` exact reopen
    2. TUAS `C11c` exact import
    3. raw bare open-box/open-web impact widening
    4. wall-selector behavior widening
  - current rerank progress:
    - rank-1 `GDMTXA04A` keeps its order position but stays blocked after an
      explicit feasibility audit
    - rank-2 `C11c` also stays blocked after an explicit feasibility audit
    - the next active comparison target inside the rerank is now raw bare
      open-box/open-web
  - each candidate must stay explicit on value, origin, support, and current
    evidence posture before any direct runtime change is selected
- reinforced-concrete reopening remains conditional-only
  - do not reopen the closed low-confidence corridor unless a new proof-backed
    family overlap appears
- heavy-concrete parity reopening remains conditional-only
  - do not reopen the parity queue unless a new proof-backed equivalence
    appears

## Validation Gate For This Checkpoint

Revalidated on `2026-04-17`:

- `pnpm calculator:gate:current`
  - green
  - focused engine gate: `8/8` test files passed, `29/29` tests passed
  - focused web gate: `3/3` test files passed, `9/9` tests passed
- `pnpm check`
  - green
  - full engine suite: `155/155` test files passed, `949/949` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

Latest rerank progress revalidation on `2026-04-17`:

- `pnpm calculator:gate:current`
  - green
  - focused engine gate: `9/9` test files passed, `31/31` tests passed
  - focused web gate: `3/3` test files passed, `9/9` tests passed
- `pnpm check`
  - green
  - full engine suite: `156/156` test files passed, `951/951` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

Latest rank-2 rerank progress revalidation on `2026-04-17`:

- `pnpm calculator:gate:current`
  - green
  - focused engine gate: `10/10` test files passed, `33/33` tests passed
  - focused web gate: `3/3` test files passed, `9/9` tests passed
- `pnpm check`
  - green
  - full engine suite: `157/157` test files passed, `953/953` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

## Minimal Resume Commands

1. `pnpm calculator:gate:current`
2. `pnpm --filter @dynecho/engine exec vitest run src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts src/blocked-source-rank-2-c11c-feasibility-contract.test.ts src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts src/source-gap-candidate-re-rank-contract.test.ts src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts src/remaining-source-gap-posture-matrix.test.ts src/dataholz-gdmtxa04a-material-surface-recheck.test.ts src/floor-source-corpus-contract.test.ts src/tuas-c11c-wet-stack-anomaly-audit.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/web exec vitest run features/workbench/remaining-source-gap-posture-card-matrix.test.ts features/workbench/output-origin-trace-card-matrix.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts --maxWorkers=1`
4. Read [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) before changing routing or support posture.

## Exact Resume Target

Keep the next scope on:

- planning contract:
  [post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts)
- selected engine rerank guards:
  [blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts),
  [blocked-source-rank-2-c11c-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts),
  [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts),
  [raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts](../../packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts),
  and [remaining-source-gap-posture-matrix.test.ts](../../packages/engine/src/remaining-source-gap-posture-matrix.test.ts)
- selected workbench rerank guards:
  [remaining-source-gap-posture-card-matrix.test.ts](../../apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts)
  and [output-origin-trace-card-matrix.test.ts](../../apps/web/features/workbench/output-origin-trace-card-matrix.test.ts)
- CLT closeout guard:
  [dataholz-clt-calibration-tightening-audit.test.ts](../../packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts)
- source-gap evidence map:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- living plan:
  [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)

Do not claim the blocked-source rerank is closed until the candidate ordering,
held boundaries, docs, and focused gate are all updated and green again.
