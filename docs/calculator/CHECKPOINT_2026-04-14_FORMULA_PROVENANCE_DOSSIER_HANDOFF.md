# Checkpoint 2026-04-14 Formula Provenance Dossier Handoff

Document role:

- define the committed end-of-day checkpoint after the heavy concrete formula
  provenance history, trace/report, method-dossier, and evidence-packet passes
- map the completed work back to the living calculator docs
- make unfinished or deliberately deferred work explicit before the next
  planning slice starts
- give a new agentic worker a direct restart path without scanning every
  historical plan note

This is a checkpoint document, not a new solver plan.

Historical status update:

- as of `2026-04-15`, the follow-on planning action recorded in this checkpoint
  is now closed in [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
- the current committed restart point now lives in
  [CHECKPOINT_2026-04-15_REQUESTED_OUTPUT_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-15_REQUESTED_OUTPUT_HISTORY_REPLAY_HANDOFF.md)
- use `NEXT_IMPLEMENTATION_PLAN.md` as the current next-step authority; this
  checkpoint remains the accepted `2026-04-14` close-out snapshot
- live suites after that follow-on planning-contract refresh now sit at full
  engine `124` files / `854` tests and full web `113` files / `643` tests
- the selected follow-on slices
  `mixed_floor_wall_seeded_cross_mode_chain_expansion_v1` and
  `mixed_floor_wall_duplicate_swap_grid_expansion_v1` are now implemented and
  target-green in the working tree
- the current next-step selection after that closeout also lives in
  [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md); the validation
  section below remains the accepted historical checkpoint gate

## Where This Document Lives

Path:

- `docs/calculator/CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md`

Primary indexes that point here:

- `docs/README.md`
- `docs/calculator/README.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`

If an incoming agent only knows the repo root, start at `docs/README.md`; it
links this file as the current clean checkpoint. If already inside calculator
docs, start at `docs/calculator/README.md`; this file remains the current
checkpoint and the first item in the resume shortcut even though the active
next-step plan now appears before it in the general read order.

## Two-Minute Restart

Use this sequence for a fast, safe restart:

1. Read this file first.
2. Open [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) and use it
   as the current next-step authority.
3. Open [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) before considering any
   new floor-family source widening.
4. Open [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
   if the next candidate touches formula ownership, source confidence, metric
   basis, field carry-over, or unsupported-output posture.
5. Run `git status --short` before making changes.

Do not start by editing solver/catalog/runtime code. The next action is still a
no-runtime shared torture-pass slice, not a broad runtime widening.

## Current Answer In One Screen

- latest checkpoint doc commit:
  `9250c06 docs(calculator): record formula provenance checkpoint`
- latest technical implementation commit:
  `137e0c8 test(workbench): carry formula provenance into method dossiers`
- latest closed implementation slice:
  `formula_provenance_method_evidence_dossier_v1`
- latest closed behavior:
  heavy concrete formula provenance is now visible across workbench history
  cards, trace/report surfaces, proposal method dossiers, and evidence packets
- latest validation:
  full engine `121` files / `846` tests, full web `113` files / `640` tests,
  engine/web typecheck and lint, `pnpm build`, and `git diff --check` were
  green on `2026-04-14`
- follow-on planning action at that checkpoint:
  `post_method_evidence_formula_provenance_next_slice_selection_v1`
- checkpoint rule:
  pick one route family and one output surface before any new behavior
  widening

## Current State

Checkpoint date: `2026-04-14`

Accepted technical checkpoint commit:

- `137e0c8 test(workbench): carry formula provenance into method dossiers`

Accepted documentation checkpoint commit:

- `9250c06 docs(calculator): record formula provenance checkpoint`

Latest implementation sequence since the prior UBIQ checkpoint:

- `7896399 test(workbench): lock CLT combined anchor history cards`
- `94b4e97 test(workbench): guard heavy concrete formula history cards`
- `ee7107e test(workbench): preserve heavy concrete formula provenance`
- `137e0c8 test(workbench): carry formula provenance into method dossiers`

Current restart posture:

- working tree was clean after `9250c06`
- no numeric acoustic runtime behavior changed in the latest slice
- no source rows, formula constants, supported family scope, or broad selector
  behavior were widened
- at this checkpoint, the next selected planning action was:
  `post_method_evidence_formula_provenance_next_slice_selection_v1`

## What Changed Since The Prior Checkpoint

Prior current checkpoint:

- `docs/calculator/CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md`
- accepted commit:
  `1be632d test(calculator): lock UBIQ packaged floor source and history surfaces`

New work after that checkpoint closed a chain of no-widening formula provenance
risks:

- CLT combined anchor history card guard
- heavy concrete formula history card guard
- heavy concrete formula field carry-over trace/report provenance guard
- heavy concrete formula proposal method/evidence dossier guard

The important distinction: these passes made already-owned answers harder to
misread. They did not claim new acoustic truth for new layer families.

## Closed Slices

### CLT Combined Anchor History

- slice id: `clt_combined_anchor_history_replay_matrix_v1`
- commit: `7896399`
- purpose:
  - keep CLT combined exact/predictor/fail-closed routes stable through
    realistic workbench edit histories
- result:
  - field impact cards survive split, row-order bounce, save/load, and
    floor/wall mode detours without losing guarded route posture

### Heavy Concrete Formula History Cards

- slice id: `heavy_concrete_formula_history_card_matrix_v1`
- commit: `94b4e97`
- purpose:
  - prove bare concrete and heavy floating-floor formula routes keep card values
    stable through hostile but source-equivalent user histories
- result:
  - guarded cards: `Rw`, `Ln,w`, `DeltaLw`, `L'n,w`, and `L'nT,w`
  - no formula scope or formula constants changed

### Heavy Concrete Formula Trace/Report Provenance

- slice id: `heavy_concrete_formula_field_provenance_surface_v1`
- commit: `ee7107e`
- purpose:
  - preserve formula ownership after field-side `K` and standardized
    room-volume carry-over change `impact.basis` to a mixed field lane
- result:
  - `impact.metricBasis`, `impactPredictorStatus`,
    `impactSupport.formulaNotes`, `dynamicImpactTrace.selectedLabel`, the
    impact trace panel, and the Markdown report now keep formula ownership
    visible

### Formula Method/Evidence Dossier Provenance

- slice id: `formula_provenance_method_evidence_dossier_v1`
- commit: `137e0c8`
- purpose:
  - carry the same formula ownership into proposal method dossiers and evidence
    packets
- result:
  - formula-owned impact lanes reserve method-dossier note budget for
    `impactSupport.formulaNotes`
  - the heavy floating formula route keeps scoped formula and Annex-C
    derivation notes in the proposal solver rationale appendix
  - the evidence packet dynamic impact citation is guarded as:
    `Heavy floating-floor formula · Estimated evidence · Standardized
    field-volume carry-over.`

## Documentation Mapping

- [README.md](../README.md)
  - repo-level docs index; points new agents to this checkpoint before older
    handoff notes
- [README.md](./README.md)
  - calculator docs index; this checkpoint is first in read order, status
    shortcut, and resume shortcut
- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
  - current restart point, latest closed slice, validation counts, next planning
    action, and the rejected immediate runtime-widening candidates
- [CURRENT_STATE.md](./CURRENT_STATE.md)
  - short verified posture, architecture scan, current validation gate, and
    latest formula-provenance checkpoint facts
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
  - answer-origin meaning for formula-backed, predictor-backed, exact,
    bound-only, field-carried, and unsupported outputs
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
  - source-backed widening boundaries and the explicit deferred posture for
    raw bare open-box/open-web, `GDMTXA04A`, and `C11c`
- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)
  - long-form execution status and the current next planning action
- [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md)
  - test-first coverage/accuracy rules and why broad runtime widening stays
    blocked until a route family and output surface are selected
- [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
  - remaining cross-floor/wall work order and long-form backlog context

## Latest Validation Gate

Green on `2026-04-14`:

- targeted web method/evidence/report formula guard:
  - `pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-method-dossier.test.ts features/workbench/simple-workbench-evidence.test.ts features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts --maxWorkers=1`
  - `3` files / `6` tests
- targeted engine planning/provenance guard:
  - `pnpm --filter @dynecho/engine exec vitest run src/post-formula-provenance-report-next-slice-selection-contract.test.ts src/post-heavy-concrete-formula-history-next-slice-selection-contract.test.ts src/source-gap-candidate-re-rank-contract.test.ts --maxWorkers=1`
  - `3` files / `7` tests
- full engine suite:
  - `pnpm --filter @dynecho/engine test`
  - `121` files / `846` tests
- full web suite:
  - `pnpm --filter @dynecho/web test`
  - `113` files / `640` tests
- typecheck:
  - `pnpm --filter @dynecho/engine typecheck`
  - `pnpm --filter @dynecho/web typecheck`
  - green; web prints the known Next TypeScript plugin recommendation
- lint:
  - `pnpm --filter @dynecho/engine lint`
  - `pnpm --filter @dynecho/web lint`
  - green
- build:
  - `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX
    dependency and the existing Next TypeScript plugin recommendation
- whitespace:
  - `git diff --check`
  - green

## Explicitly Not Done

The following were considered or remain visible in the plans, but are not done
at this checkpoint:

- `post_method_evidence_formula_provenance_next_slice_selection_v1`
  - selected next planning action only
  - no implementation has started for it yet
- raw bare open-box/open-web impact widening
  - still deferred because no bare carrier impact source owns the target lane
- Dataholz `GDMTXA04A` visible exact reopen
  - still deferred because the source top layer is a composite dry screed
    element that the current visible material surface does not encode honestly
- TUAS `C11c` exact import
  - still deferred / impact-fail-closed because the weak weighted tuple remains
    unexplained by the available source fields
- broad heavy-concrete formula family widening
  - not done; latest work only guarded provenance for the already scoped
    heavy concrete formula routes
- wall-selector behavior widening
  - not done; no new classified wall-selector solver bug was selected after the
    current trace checkpoint
- architecture extraction of large files
  - not done in this checkpoint; future work touching
    `packages/engine/src/dynamic-airborne.ts`,
    `apps/web/features/workbench/simple-workbench-proposal.ts`,
    `apps/web/features/workbench/simple-workbench-proposal-panel.tsx`, or
    `packages/engine/src/impact-predictor-input.ts` should budget extraction or
    a dedicated architecture slice before widening behavior

## Files Most Likely To Matter Next

Planning and source posture:

- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/SOURCE_GAP_LEDGER.md`
- `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
- `packages/engine/src/post-formula-provenance-report-next-slice-selection-contract.test.ts`

Formula provenance surfaces just closed:

- `apps/web/features/workbench/simple-workbench-method-dossier.ts`
- `apps/web/features/workbench/simple-workbench-method-dossier.test.ts`
- `apps/web/features/workbench/simple-workbench-evidence.test.ts`
- `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`

Numeric formula ownership already guarded elsewhere:

- `packages/engine/src/calculate-assembly.test.ts`
- `packages/engine/src/impact-support.ts`
- `packages/engine/src/impact-predictor-status.ts`
- `packages/engine/src/dynamic-impact.ts`

Source-family widening candidates still deferred:

- `packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts`
- `packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts`
- `packages/engine/src/tuas-c11c-frequency-source-recheck.test.ts`

## Restart Rule

Tomorrow, do not start with broad runtime widening.

Start with `post_method_evidence_formula_provenance_next_slice_selection_v1` and
name exactly one:

- route family
- output surface
- source/formula/provenance owner
- focused test pack

Only after that should code change. If the next selected slice is numeric, add
numeric correctness tests first; if it is documentation/UI provenance, keep it
explicitly no-numeric-runtime as this checkpoint did.
