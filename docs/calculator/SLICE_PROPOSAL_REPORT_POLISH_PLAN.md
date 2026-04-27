# Slice Plan - Proposal Report Polish v1

Status: CLOSED (opened 2026-04-27 after
`project_access_policy_route_integration_v1`; closed 2026-04-27 and
selected `calculator_source_gap_revalidation_v1`)

## Objective

Improve the private/internal-use proposal and report surfaces without
changing acoustic calculations.

The calculator is now usable with evidence-tier caveats, but generated
PDF/DOCX/workbench proposal surfaces must make those caveats difficult
to miss. This slice should improve report honesty, long-label handling,
and scenario packaging while preserving every numeric result and support
classification.

## Non-Goals

- Do not change calculator formulas, runtime values, source posture,
  output support, confidence scores, or result rounding.
- Do not implement billing, plan tiers, invitations, deployment,
  monitoring, or database storage.
- Do not make role/team access affect acoustic output.
- Do not reopen blocked calculator source families without a new
  source-backed calculator slice.

## Current Baseline

- `ui_input_output_honesty_v1` closed the calculator private/internal-use
  readiness chain with evidence-tier caveats.
- `project_access_policy_route_integration_v1` closed owner-only route
  policy integration.
- Proposal generation already has PDF and DOCX routes plus focused
  proposal tests, but the next pass should audit whether reports expose
  support/origin/confidence/missing-input/unsupported states consistently
  across representative wall and floor scenarios.

## Progress Log

- 2026-04-27 Gate A first carve:
  - baseline `pnpm calculator:gate:current` was green before edits:
    engine 98 files / 445 tests, web 43 files / 211 passed + 18 skipped,
    build 5/5 with the known non-fatal `sharp/@img` warnings;
  - inventory found branded proposal HTML and copy-ready text already
    carry the output coverage register, but the simple PDF/DOCX HTML path
    only showed live measured/predicted indices, so `needs_input` and
    `unsupported` outputs could disappear from short-form exports;
  - `apps/web/features/workbench/simple-workbench-proposal-simple.ts`
    now renders a compact output coverage register with metric, support
    status, evidence class, current state, and next action;
  - `apps/web/features/workbench/simple-workbench-proposal.test.ts`
    now pins the simple export path for live, missing-input, and
    unsupported output posture text;
  - targeted proposal/export tests are green:
    `simple-workbench-proposal.test.ts`,
    `simple-workbench-proposal-preview-html.test.ts`, and
    `simple-workbench-proposal-pdf.test.ts` (3 files / 12 tests);
  - post-change `pnpm calculator:gate:current` is green with the same
    counts as baseline: engine 98 files / 445 tests, web 43 files /
    211 passed + 18 skipped, build 5/5 with the known non-fatal
    `sharp/@img` warnings;
  - no acoustic values, formulas, support decisions, confidence scores,
    or engine routes changed.
- 2026-04-27 Gate A second carve:
  - added
    `apps/web/features/workbench/simple-workbench-proposal-generated-document-honesty.test.ts`;
  - the test builds proposal documents from real workbench output models
    via `evaluateScenario`, `buildOutputCard`,
    `buildSimpleWorkbenchOutputPosture`,
    `buildSimpleWorkbenchMethodDossier`, and
    `buildSimpleWorkbenchEvidencePacket`;
  - representative floor case: reinforced-concrete low-confidence
    fallback with live `Ln,w` / `Rw` / `Ctr`, missing field-impact
    inputs for `L'n,w` / `L'nT,w`, and unsupported `DeltaLw`;
  - representative wall case: dynamic field-airborne wall with live
    `R'w`, `Dn,w`, and `DnT,w`, while requested lab `Rw` remains
    explicitly unsupported;
  - copy-ready proposal text, branded preview HTML, and simple preview
    HTML are all pinned to carry the same support/origin/confidence
    caveats;
  - targeted proposal/export tests are now green across 4 files /
    14 tests;
  - post-change `pnpm calculator:gate:current` is green with engine
    98 files / 445 tests, web 43 files / 211 passed + 18 skipped, build
    5/5, and only the known non-fatal `sharp/@img` warnings.
- 2026-04-27 Gate A third carve:
  - extended
    `apps/web/features/workbench/simple-workbench-proposal-generated-document-honesty.test.ts`
    with a 53-row UBIQ exact floor-system scenario from the live
    workbench output model;
  - the regression stresses long material labels with an unbroken token
    so report tables must wrap instead of expanding out of their parent;
  - branded and simple report HTML now apply fixed table layout plus
    `overflow-wrap` / `word-break` guards;
  - construction SVG annotations remain compact/truncated while the full
    material labels stay present in wrapping table/text surfaces;
  - simple short-form exports now disclose when the visible layer table
    is capped and state that the construction section still uses all
    solver rows;
  - targeted proposal/report tests are green across 5 files / 18 tests,
    and `pnpm --filter @dynecho/web lint` is green;
  - post-change `pnpm calculator:gate:current` is green with engine
    98 files / 445 tests, web 43 files / 211 passed + 18 skipped, build
    5/5, and only the known non-fatal `sharp/@img` warnings;
  - broad `pnpm check` is green: lint/typecheck, engine 232 files /
    1270 tests, web 155 files / 885 passed + 18 skipped, build 5/5,
    with the same known non-fatal `sharp/@img` warnings;
  - no acoustic values, formulas, support decisions, confidence scores,
    or engine routes changed.
- 2026-04-27 closeout:
  - added
    `docs/calculator/CHECKPOINT_2026-04-27_PROPOSAL_REPORT_POLISH_CLOSEOUT_HANDOFF.md`;
  - added
    `packages/engine/src/post-proposal-report-polish-next-slice-selection-contract.test.ts`;
  - selected
    `calculator_source_gap_revalidation_v1` because the user priority
    is now calculator scope/accuracy and remaining runtime improvements
    must be source/formula gated;
  - Gate A of the selected next slice is no-runtime source-gap
    inventory/rerank.

## Implementation Plan

1. Inventory current PDF, DOCX, and workbench proposal surfaces for:
   - exact/source, formula, screening, bound, low-confidence, and
     unsupported outputs;
   - missing-field and invalid-input caveats;
   - long material names, many layers, and reordered layer scenarios.
   - Status: started. First gap found in the simple PDF/DOCX HTML path
     and patched; representative wall/floor generated-document route
     snapshots are now covered; many-layer / long-label report wrapping
     is now covered.
2. Add focused tests that pin the report-visible text/model for the
   representative private-use scenarios before changing rendering.
   - Status: started. Current test pins simple export visibility for
     live, `needs_input`, and `unsupported` output posture. The
     generated-document test now pins real floor/wall workbench output
     models across proposal text, branded preview, and simple preview,
     plus a 53-row long-label floor report stress case.
3. Tighten proposal/report sections so evidence tier, origin/support
   posture, and unsupported outputs are visible in the generated model
   and preview HTML.
   - Status: started. Simple report coverage register is now explicit;
     representative wall/floor generated-document coverage is pinned.
4. Add overflow/long-label regression coverage where the current render
   model exposes fixed labels or tables.
   - Status: implemented for generated proposal text, branded HTML,
     simple HTML, construction SVG truncation, and simple short-form
     layer-table cap disclosure.
5. Keep PDF/DOCX route behavior and project audit appends stable unless
   a test proves a narrower error shape is needed.
6. Run targeted proposal/report tests, `pnpm calculator:gate:current`,
   and `pnpm check` before closing.
   - Status: complete; all are green.

## Completion Criteria

- Representative floor and wall proposal outputs expose the same
  honesty posture as the workbench calculator cards.
- Missing/unsupported/low-confidence states do not disappear in report
  generation.
- Long labels and many-layer scenario summaries have regression tests.
- PDF and DOCX generation routes remain green.
- No calculator runtime behavior changes.

## Next Bounded Step

Resume from
[SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md).
Start Gate A by running the baseline focused gate and writing the
no-runtime source-gap revalidation contract. Keep report/polish changes
closed unless a future productization slice deliberately reopens them.
