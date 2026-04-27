# Checkpoint - Proposal Report Polish Closeout Handoff

Date: 2026-04-27
Slice: `proposal_report_polish_v1`
Status: CLOSED
Next selected slice: `calculator_source_gap_revalidation_v1`

## What Closed

`proposal_report_polish_v1` closed as a no-calculator-runtime
productization/reporting slice. It improved whether generated proposal
surfaces preserve the same evidence-tier honesty already visible in the
workbench calculator cards.

No acoustic formulas, runtime values, source posture, output support,
confidence scores, or result rounding changed.

## Landed Work

Gate A first carve:

- `apps/web/features/workbench/simple-workbench-proposal-simple.ts`
  now renders a compact output coverage register in the simple
  PDF/DOCX HTML path.
- `apps/web/features/workbench/simple-workbench-proposal.test.ts`
  pins live, `needs_input`, and `unsupported` posture text in the
  short-form export.

Gate A second carve:

- `apps/web/features/workbench/simple-workbench-proposal-generated-document-honesty.test.ts`
  builds proposal documents from real workbench output models.
- The generated-document test covers a reinforced-concrete
  low-confidence floor case and a dynamic field-airborne wall case
  across copy-ready proposal text, branded preview HTML, and simple
  preview HTML.
- The same surfaces preserve low-confidence, missing-input, and
  unsupported output posture.

Gate A third carve:

- The generated-document test now includes a 53-row UBIQ exact floor
  stack with long material labels.
- Branded and simple report tables use fixed table layout with wrapping
  guards.
- Construction SVG labels stay compact/truncated while full labels
  remain available in wrapping text/table surfaces.
- Simple short-form exports disclose when the layer table is capped and
  state that all solver rows still feed the construction section.

## Validation

Latest validation during closeout:

- targeted proposal/report tests:
  `apps/web/features/workbench/simple-workbench-proposal-generated-document-honesty.test.ts`,
  `simple-workbench-proposal.test.ts`,
  `simple-workbench-proposal-preview-html.test.ts`,
  `simple-workbench-proposal-pdf.test.ts`, and
  `simple-workbench-proposal-reporting.test.ts`:
  5 files / 18 tests green;
- `pnpm --filter @dynecho/web lint`: green;
- `pnpm calculator:gate:current`: green after the closeout contract
  update with engine 99 files / 450 tests, web 43 files / 211 passed +
  18 skipped, build 5/5, and the known non-fatal `sharp/@img` warnings;
- `pnpm check`: green after the closeout contract update with
  lint/typecheck, engine 232 files / 1270 tests, web 155 files /
  885 passed + 18 skipped, build 5/5, and the same known non-fatal
  warnings.

The closeout also adds
`packages/engine/src/post-proposal-report-polish-next-slice-selection-contract.test.ts`
to record the selected next slice and keep planning contracts aligned.

## Selected Next Slice

The next selected slice is
`calculator_source_gap_revalidation_v1`.

Reason:

- the user priority is calculator scope and accuracy for private/internal
  use, not more productization polish;
- the personal-use readiness chain is already closed with caveats;
- the remaining meaningful calculator improvements are source/formula
  gated and must be revalidated before any runtime value/support change.

Start with
[SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md).

## First Action For The Next Agent

1. Read `NEXT_IMPLEMENTATION_PLAN.md`, this checkpoint,
   `CURRENT_STATE.md`, and
   `SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md`.
2. Run `pnpm calculator:gate:current` as the baseline.
3. Execute Gate A of `calculator_source_gap_revalidation_v1`:
   re-inventory and re-rank remaining source gaps without changing
   runtime values.

## Boundaries

- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  heavy-concrete formula parity, reinforced-concrete reopening,
  wall-selector behavior, timber-stud widening, floor fallback, or wall
  exact-row follow-ups from nearby green tests alone.
- Do not change calculator formulas, runtime values, confidence scores,
  output support, or evidence tiers until a source-backed or
  formula-owned candidate is deliberately selected and pinned by tests.
- Keep productization route/team/billing/deployment work deferred while
  this calculator revalidation slice is active.
