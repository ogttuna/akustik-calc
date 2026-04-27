# Slice Plan - Proposal Report Polish v1

Status: SELECTED (opened 2026-04-27 after
`project_access_policy_route_integration_v1`)

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

## Implementation Plan

1. Inventory current PDF, DOCX, and workbench proposal surfaces for:
   - exact/source, formula, screening, bound, low-confidence, and
     unsupported outputs;
   - missing-field and invalid-input caveats;
   - long material names, many layers, and reordered layer scenarios.
2. Add focused tests that pin the report-visible text/model for the
   representative private-use scenarios before changing rendering.
3. Tighten proposal/report sections so evidence tier, origin/support
   posture, and unsupported outputs are visible in the generated model
   and preview HTML.
4. Add overflow/long-label regression coverage where the current render
   model exposes fixed labels or tables.
5. Keep PDF/DOCX route behavior and project audit appends stable unless
   a test proves a narrower error shape is needed.
6. Run targeted proposal/report tests, `pnpm calculator:gate:current`,
   and `pnpm check` before closing.

## Completion Criteria

- Representative floor and wall proposal outputs expose the same
  honesty posture as the workbench calculator cards.
- Missing/unsupported/low-confidence states do not disappear in report
  generation.
- Long labels and many-layer scenario summaries have regression tests.
- PDF and DOCX generation routes remain green.
- No calculator runtime behavior changes.
