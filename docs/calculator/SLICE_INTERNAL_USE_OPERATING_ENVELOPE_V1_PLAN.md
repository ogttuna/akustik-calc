# Slice Plan - Internal Use Operating Envelope v1

Status: CLOSED AT GATE C (opened 2026-04-28 by
`calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`; Gate A
landed the short pilot pack no-runtime; Gate B landed the regular
internal-use visibility audit and a focused wall source-gated copy fix;
Gate C closed no-runtime on 2026-04-29 and selected
`calculator_source_pack_readiness_triage_v1`)

Closeout implementation file:

`packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`

Selected next implementation file:

`packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts`

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

Clean-stop checkpoint:

- docs and implementation still agree that Gate B is landed and Gate C
  is next;
- the Gate C contract file is still absent, which is expected before
  implementation:
  `packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`;
- no source-ready accuracy pack was identified;
- focused current gate is green: 131 engine files / 618 tests, 45 web
  files / 216 passed + 18 skipped, build 5/5, whitespace guard clean;
- broad `pnpm check` is green: 264 engine files / 1438 tests, 157 web
  files / 890 passed + 18 skipped, build 5/5.

## Gate C - Closeout And Next Selection

Gate C closed the internal-use operating envelope when:

- the pilot note and scenario summary are complete;
- low-confidence/screening/fail-closed surfaces are visibly documented;
- focused tests cover any new scenario or card/report behavior;
- no known internal-use blocker remains outside the long source-gated
  accuracy roadmap.

Closeout implementation file:

`packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`

Selected next slice after Gate C:

- `calculator_source_pack_readiness_triage_v1`, because no bounded
  source import pack can yet name exact topology, metric owner,
  tolerance owner, protected negative boundaries, and paired engine/web
  route-card or report tests.
- [SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md](./SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md)
  is the next active planning surface.

### Gate C Implementation Checklist

Gate C landed as a planning contract, not a runtime change.

Target file:

`packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`

The contract asserts:

1. `internal_use_operating_envelope_v1` closes only after Gate A and
   Gate B evidence is present:
   - `docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md`;
   - `packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts`;
   - `packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts`;
   - `apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts`.
2. The closeout is no-runtime:
   - no acoustic formula change;
   - no numeric runtime movement;
   - no support, confidence, evidence-tier, API-shape, route-card value,
     or output-card status movement.
3. The Gate B visible-honesty copy remains the only behavior movement:
   dynamic wall formula routes stay visibly
   formula-owned/source-gated scoped estimates across validation,
   evidence, and proposal/report surfaces.
4. The generated steel floor fallback remains low-confidence,
   screening-only, and unsupported for `L'nT,50`.
5. No source-ready accuracy pack is selected unless the contract can
   name all of:
   - exact topology and material/thickness mapping;
   - metric owner and lab/field context;
   - tolerance owner;
   - protected negative boundaries;
   - paired engine and web route-card/report tests.
6. Because no bounded source pack is ready, the selected follow-up keeps
   `CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md` as roadmap context
   and avoids speculative runtime/support/confidence/evidence movement.

Docs to update with Gate C:

- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`;
- `docs/calculator/CURRENT_STATE.md`;
- this slice plan;
- `docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md`;
- a new Gate C checkpoint/handoff note.

Validation for Gate C:

- run `pnpm calculator:gate:current` before the Gate C edit;
- run the new engine contract test while iterating;
- add the new contract to `tools/dev/run-calculator-current-gate.ts`;
- run `pnpm calculator:gate:current` after the docs/runner update;
- keep `git diff --check` clean.

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

Gate C closeout validation:

- targeted Gate C contract: 1 file / 6 tests green;
- focused current gate: engine 132 files / 624 tests, web 45 files /
  216 passed + 18 skipped, build 5/5, whitespace guard clean;
- broad `pnpm check`: lint/typecheck green, engine 265 files / 1444
  tests, web 157 files / 890 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings.
