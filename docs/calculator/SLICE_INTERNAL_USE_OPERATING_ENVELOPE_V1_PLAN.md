# Slice Plan - Internal Use Operating Envelope v1

Status: GATE B LANDED (opened 2026-04-28 by
`calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`; Gate A
landed the short pilot pack no-runtime; Gate B landed the regular
internal-use visibility audit and a focused wall source-gated copy fix;
post-Gate-B broad `pnpm check` is green; next bounded action is Gate C
closeout / next-slice selection)

Next implementation file:

`packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`

Selection reason: `calculator_source_gap_revalidation_v3` Gate A found
no higher-priority calculator drift, card dishonesty, or source-backed
runtime unlock. The next practical readiness gap is a concise company
pilot operating envelope and scenario summary.

## Objective

Make DynEcho usable for short company-internal pilot work, then for
regular internal use, without overstating calculator certainty.

This slice is about operating envelope, scenario evidence, and visible
honesty. It must not change acoustic formulas, runtime values, source
precedence, support classification, confidence class, or evidence text
unless Gate B or a later focused audit finds a concrete mismatch between
implementation and visible behavior and pairs the fix with tests.

## Why This Is The Next Prepared Internal-Use Slice

The private/internal-use readiness chain is already closed for a
knowledgeable user. The remaining practical risk is not that the engine
usually crashes; the focused gate currently covers hostile inputs,
many-layer stress, layer-order behavior, exact/source precedence,
unsupported outputs, and route-card honesty.

The risk is that a company pilot needs a concise operating envelope:

- which families are safe for ordinary internal estimating;
- which families are low-confidence or screening only;
- which families are source-gated and should not be treated as defended;
- which example scenarios prove the current implementation posture.

## Gate A - Short Internal Pilot Pack

Gate A landed no-runtime. It did not find a docs/UI mismatch requiring
runtime, support, confidence, evidence, API, or route-card movement.

Landed artifacts:

- [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md);
- `packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts`;
- a test scenario summary that names representative wall/floor stacks,
  expected target outputs, evidence tier, support posture, and visible
  warnings;
- no confidence or evidence promotion.

Minimum scenario set:

| Scenario | Expected posture | Existing proof owner |
|---|---|---|
| LSF exact wall preset | exact / benchmark-backed route | `wall-lsf-timber-stud-preset-benchmarks.test.ts` |
| masonry / AAC single-leaf wall | benchmark/formula-owned as documented | `wall-preset-expansion-benchmarks.test.ts` |
| timber double-board wall | formula-owned, low-confidence/source-gated | `wall-timber-double-board-source-research-gate-a-contract.test.ts` |
| CLT wall | formula-owned, medium-confidence/source-gated | `wall-clt-wall-source-research-gate-a-contract.test.ts` |
| lined/heavy-core concrete wall | screening only | `wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts` |
| exact/bound floor corridor | exact/bound precedence | `airborne-verified-catalog.test.ts`, `floor-source-corpus-contract.test.ts` |
| generated steel floor fallback | low-confidence/screening | `floor-fallback-low-confidence-gate-b-source-contract.test.ts` |
| invalid/missing inputs | fail-closed or `needs_input` | `all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`, `calculator-api-validation.test.ts` |
| many-layer and reorder edits | finite, stable, or explicitly unsupported | `floor-many-layer-stress-gate-a-matrix.test.ts`, `floor-layer-order-invariance-expansion-gate-a-contract.test.ts` |

Pilot close signal:

- a fresh agent can read the usage note and know which calculator
  outputs are suitable for internal estimates and which require caveats;
- targeted Gate A validation is green: 1 file / 6 tests;
- current focused gate is green after docs/current-gate runner updates:
  131 engine files / 618 tests, 45 web files / 216 passed + 18 skipped,
  build 5/5;
- `git diff --check` is clean.

## Gate B - Regular Internal Use Visibility

Gate B landed with no runtime, support, confidence, evidence-tier, API,
route-card value, or output-card status movement.

The audit found one visible-honesty gap: dynamic wall formula routes
were numerically and evidentially caveated, but the validation/evidence
and proposal/report surfaces did not always say explicitly that no exact
wall source row was active. Gate B added the missing
formula-owned/source-gated scoped-estimate wording to:

- `apps/web/features/workbench/validation-regime.ts`;
- `apps/web/features/workbench/guided-validation-summary.ts`;
- `apps/web/features/workbench/simple-workbench-evidence.ts`.

New proof:

- `apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts`
  covers timber double-board wall, CLT wall, lined/heavy-core wall, and
  generated steel floor fallback visibility;
- `packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts`
  pins the no-runtime Gate B decision and selects Gate C.

The generated steel floor fallback remains low-confidence,
screening-only, and unsupported for `L'nT,50`. Wall timber
double-board, CLT wall, and lined/heavy-core routes remain
formula-owned/source-gated scoped estimates unless a later source slice
changes the executable contract.

Post-Gate-B broad validation:

- `pnpm check` green after a type-only cleanup in the framed split
  Gate A/B contract tests;
- engine full suite: 264 files / 1438 tests green;
- web full suite: 157 files / 890 passed + 18 skipped;
- build: 5/5 with known non-fatal `sharp/@img` warnings.

## Gate C - Closeout And Next Selection

Gate C should close the internal-use operating envelope when:

- the pilot note and scenario summary are complete;
- low-confidence/screening/fail-closed surfaces are visibly documented;
- focused tests cover any new scenario or card/report behavior;
- no known internal-use blocker remains outside the long source-gated
  accuracy roadmap.

Next implementation file:

`packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`

Expected next selection after Gate C:

- either a narrow source-research slice if a source pack is ready, or
- the long-horizon source-gated accuracy roadmap if no bounded source
  import can be named.

## Boundaries

Disallowed in this slice:

- upgrading timber double-board, CLT wall, lined/heavy-core wall, or
  floor fallback confidence just because the pilot needs friendlier
  output;
- importing public source rows without topology, metric, tolerance, and
  negative-boundary extraction;
- broadening layer-order invariance beyond the existing audited
  physical/topology boundaries;
- changing route-card copy without paired tests;
- treating this as productization, deployment, billing, or team
  collaboration work.

## Validation

Before edits:

- `pnpm calculator:gate:current`

During Gate A:

- targeted test for any new contract or scenario matrix;
- if only docs change, run `pnpm calculator:gate:current` after the docs
  update because the active calculator gate is the current baseline.

Before closeout:

- `pnpm calculator:gate:current`
- `git diff --check`
