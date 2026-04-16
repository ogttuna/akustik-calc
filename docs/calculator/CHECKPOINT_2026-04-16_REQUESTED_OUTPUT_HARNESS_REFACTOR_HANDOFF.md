# Checkpoint 2026-04-16 Requested Output Harness Refactor Handoff

Superseded note:

- this checkpoint is historical
- use [CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md](./CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md) for the latest restart point after the post-harness rerank


Document role:

- define the current checkpoint after the requested-output snapshot harness closeout
- map the living plan to implemented work without pretending the next runtime widening is already chosen
- give the next agent a short restart path, a fresh validation gate, and an explicit not-done list

This is a checkpoint document, not a new solver plan.

Use [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) as the current next-step authority.
Use [CURRENT_STATE.md](./CURRENT_STATE.md) as the short verified snapshot.
Use [SYSTEM_MAP.md](./SYSTEM_MAP.md) for the live runtime/file map.

## Two-Minute Restart

1. Read this file first.
2. Open [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Confirm the active selected slice is now
   `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`.
4. Open:
   - [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
   - [mixed-study-mode-output-card-snapshot-requested-output-surface-message-bundles.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-message-bundles.ts)
   - [mixed-study-mode-output-card-snapshot-requested-output-surface-phrase-templates.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-phrase-templates.ts)
   - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
5. Run `pnpm calculator:gate:current` before touching runtime code.

Do not start with catalog or solver widening. The next safe step is the runtime/source candidate rerank.

## Current Answer In One Screen

- latest closed implementation slice:
  `mixed_floor_wall_output_card_snapshot_requested_output_surface_phrase_template_extraction_v1`
- latest selected next slice:
  `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
- current checkpoint rule:
  the requested-output harness refactor chain is hard-stopped; no new harness-only micro-slice should be opened
- explicit not-done item:
  no new runtime widening has landed yet; the next job is to select one honest widening direction from the current deferred candidate set

## What Closed In This Checkpoint

- `mixed_floor_wall_output_card_snapshot_requested_output_surface_message_bundle_extraction_v1`
  - direct / replay / restore bundle assembly moved into a dedicated shared helper
- `mixed_floor_wall_output_card_snapshot_requested_output_surface_phrase_template_extraction_v1`
  - direct / replay / restore wording stems moved into a dedicated phrase-template helper
  - `mixed-study-mode-output-card-snapshot-requested-output-surface-message-bundles.ts`
    dropped to about `95` lines
  - `mixed-study-mode-output-card-snapshot-requested-output-surface-phrase-templates.ts`
    now owns the wording shell at about `359` lines
- local test stability hardening that came with this closeout:
  - broad requested-output partial-restore output-card test now uses `10_000` ms
  - representative non-AAC wall boundary scan now uses `30_000` ms

None of those changes altered runtime or numeric calculator behavior.

## File Map For This Checkpoint

- visible assertion surface:
  [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
- requested-output wrapper/export layer:
  [mixed-study-mode-output-card-snapshot-requested-output-runners.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts)
- thin requested-output descriptor wrapper:
  [mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.ts)
- thin requested-output message-bundle wrapper:
  [mixed-study-mode-output-card-snapshot-requested-output-surface-message-bundles.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-message-bundles.ts)
- shared phrase-template helper:
  [mixed-study-mode-output-card-snapshot-requested-output-surface-phrase-templates.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-phrase-templates.ts)
- shared family descriptor builder helper:
  [mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders.ts)
- shared runner-loop helper:
  [mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop.ts)
- shared branch setup helper:
  [mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts)
- engine companion:
  [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
- current focused gate:
  [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts)
- next selection evidence docs:
  - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
  - [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)

## What Is Planned But Not Done Now

- `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
  remains selected-only
  - heavy-concrete formula family widening and Dataholz CLT calibration tightening are the only immediate rerank-eligible candidates
  - raw bare open-box/open-web impact, visible `GDMTXA04A` exact reopen, TUAS `C11c` exact import, and wall-selector behavior widening remain blocked
- no new runtime/source/formula widening was attempted in this checkpoint

## Validation Gate For This Checkpoint

Revalidated on `2026-04-16`:

- `pnpm calculator:gate:current`
  - green
- `pnpm --filter @dynecho/engine test`
  - green: `145/145` test files passed, `897/897` tests passed
- `pnpm --filter @dynecho/web test`
  - green: `113/113` test files passed, `655/655` tests passed
- `pnpm typecheck`
  - green
- `pnpm lint`
  - green
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

## Minimal Resume Commands

1. `pnpm calculator:gate:current`
2. `pnpm --filter @dynecho/engine exec vitest run src/post-mixed-floor-wall-output-card-snapshot-requested-output-surface-phrase-template-extraction-next-slice-selection-contract.test.ts src/mixed-floor-wall-generated-matrix.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts --maxWorkers=1`
4. Read [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) before any rerank decision.

## Exact Resume Target

Keep the next scope on:

- planning contract:
  [post-mixed-floor-wall-output-card-snapshot-requested-output-surface-phrase-template-extraction-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-output-card-snapshot-requested-output-surface-phrase-template-extraction-next-slice-selection-contract.test.ts)
- engine companion:
  [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
- source-gap evidence map:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- cross-floor/wall remaining-work map:
  [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
- living plan:
  [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)

Do not claim a new runtime widening is selected until the rerank compares the eligible and blocked candidates explicitly and records the reason for the chosen next slice.
