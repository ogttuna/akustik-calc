# Slice Plan - Floor Fallback / Low-Confidence Cleanup

Status: ACTIVE - Gate A landed no-runtime; Gate B source/formula
decision next

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

Gate A is no-runtime and has landed in
`packages/engine/src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts`.
It pins the current engine and web posture before any retune:

- generated `floor-steel-fallback` lab and field values;
- `floorSystemMatch`, `floorSystemEstimate`, `impact`, and origin/basis
  posture;
- exact, bound, and low-confidence estimate precedence;
- source rows that are nearby but must not match by family adjacency;
- route/card wording that tells the user the result is low-confidence;
- unsupported `L'nT,50` behavior.

Gate A inspected, at minimum:

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

Gate A answers:

1. The selected steel fallback stack is a `low_confidence` fallback
   today. It has no exact match, no bound match, and no formula
   promotion.
2. Pliteq steel joist rows and UBIQ FL-32 bound rows are near misses.
   Pliteq requires INEX deck / GenieMat / glasswool / exact finish
   topology; UBIQ FL-32 is 200/300 mm bound evidence with INEX deck,
   engineered timber finish, and no ceiling fill, not the live 250 mm
   vinyl + rockwool stack.
3. Lab supports `Rw`, `Ln,w` and does not support `Ln,w+CI`,
   `DeltaLw`. Field supports `Rw`, `R'w`, `DnT,w`, `Ln,w`,
   `L'n,w`, `L'nT,w` and does not support `L'nT,50`.
4. Existing web surface evidence keeps "low-confidence fallback"
   visible through `impact-result-panel.tsx`, `result-summary.tsx`, and
   route/card tests.
5. Runtime promotion now requires exact source evidence, a bounded
   steel/open-web family rule with anchors/tolerance/exact precedence,
   or a fail-closed correction.

Pinned Gate A values:

- lab: floor-system `Rw=61`, screening `Rw=72.2`, `Ln,w=58.3`,
  confidence low / score `0.54`;
- field: floor-system `Rw=61`, screening `R'w=70`,
  `Dn,w=69`, `DnT,w=72`, `DnT,A=70.6`, `Ln,w=58.3`,
  `L'n,w=61.3`, `L'nT,w=58.5`, confidence medium / score `0.72`;
- unsupported field output: `L'nT,50`.

## Gate B - Possible Runtime Tightening

Gate B is next. It is a source/formula decision and is allowed to
change runtime only if it names a defensible evidence path.

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
