# Slice Plan - Floor Fallback / Low-Confidence Cleanup

Status: ACTIVE - Gate A source/formula audit next

Selected: 2026-04-27 by
`post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts`

## Objective

Improve personal-use floor accuracy and honesty for the remaining
low-confidence fallback lane without promoting unsupported combinations
to defended values.

The selected runtime candidate is
`floor.steel_fallback_low_confidence.field` from the realistic
layer-combination cartography. It is common enough to matter for
private use, but today it is intentionally `screening` /
`low_confidence`:

- generated id: `floor-steel-fallback`;
- stack:
  `16 firestop_board + 16 firestop_board + 100 rockwool +
  120 ubiq_resilient_ceiling + 3 vinyl_flooring +
  250 steel_joist_floor`;
- evidence tier: `screening`;
- origin basis: `predictor_floor_system_low_confidence_estimate`;
- estimate kind: `low_confidence`;
- supported field outputs: `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`,
  `L'nT,w`;
- unsupported field output: `L'nT,50`.

## Gate A - Current Surface And Source Audit

Gate A is no-runtime. It must add a focused executable contract that
pins the current engine and web posture before any retune:

- generated `floor-steel-fallback` lab and field values;
- `floorSystemMatch`, `floorSystemEstimate`, `impact`, and origin/basis
  posture;
- exact, bound, and low-confidence estimate precedence;
- source rows that are nearby but must not match by family adjacency;
- route/card wording that tells the user the result is low-confidence;
- unsupported `L'nT,50` behavior.

Gate A should inspect, at minimum:

- `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`;
- `packages/engine/src/raw-floor-screening-carrier-support.test.ts`;
- `packages/engine/src/floor-source-corpus-contract.test.ts`;
- `packages/engine/src/floor-library-sweep.test.ts`;
- `packages/catalogs/src/floor-systems/exact-floor-systems.ts`;
- `packages/catalogs/src/floor-systems/bound-floor-systems.ts`;
- `apps/web/features/workbench/raw-floor-screening-route-support.test.ts`;
- `apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts`;
- `apps/web/features/workbench/impact-result-panel.tsx`;
- `apps/web/features/workbench/result-summary.tsx`.

Gate A is complete when the new contract can answer:

1. Is the selected steel fallback stack an exact, bound, formula, or
   low-confidence fallback today?
2. Which source/bound rows are near misses, and why do they not match?
3. Which outputs are supported and unsupported in lab, field, and
   building-style contexts?
4. Does the web surface keep low-confidence posture visible?
5. What exact evidence would be required before any runtime value or
   confidence promotion is allowed?

## Gate B - Possible Runtime Tightening

Gate B is allowed only if Gate A names a defensible evidence path.

Acceptable runtime changes:

- promote from low-confidence fallback to exact/bound only when the
  selected stack matches a source row by layer roles, materials,
  thicknesses, and context;
- add a bounded family rule for steel/open-web fallback only when the
  rule lists source anchors, expected tolerance, and exact-row
  precedence;
- fail-close or narrow unsupported outputs if Gate A finds a
  defended-looking value without evidence;
- update web cards only when engine origin/confidence changes.

Unacceptable runtime changes:

- promoting `floor-steel-fallback` from nearby Ubiq/open-web or other
  steel rows by family adjacency alone;
- reopening `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact, or
  wall-selector behavior from nearby green tests;
- borrowing wall timber/CLT conclusions into floor source truth;
- hiding low-confidence posture behind generic "estimated" labels;
- adding `L'nT,50` support without a source, bound, or explicit formula
  basis.

## Gate C - Closeout

Gate C closes after Gate A and any justified Gate B work are reflected
in implementation and docs.

If Gate B is no-runtime, close the slice with an explicit blocker list
and select the next calculator-readiness slice:
`ui_input_output_honesty_v1`.

If Gate B changes runtime or web posture, Gate C must include:

- targeted engine tests for numeric values, confidence/origin, support,
  unsupported outputs, and near misses;
- targeted web tests for visible low-confidence/exact/bound posture;
- `pnpm calculator:gate:current`;
- broad `pnpm check` before commit because the slice changes user-facing
  calculation readiness.

## Validation

Current selection baseline:

- `pnpm calculator:gate:current` after Gate C selection: engine
  94 files / 428 tests, web 36 files / 170 passed + 18 skipped,
  build 5/5, whitespace guard clean.
- `pnpm check` after Gate C selection: engine 227 files / 1248 tests,
  web 150 files / 864 passed + 18 skipped, build 5/5.
- Known non-fatal `sharp/@img` optional-package warnings remain.

Minimum per change:

- targeted Gate A engine test;
- targeted web test only if card/origin/support wording changes;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Run broad `pnpm check` before closing the slice or when shared/user
visible behavior changes.
