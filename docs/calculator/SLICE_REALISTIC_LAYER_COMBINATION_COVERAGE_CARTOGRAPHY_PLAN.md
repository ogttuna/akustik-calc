# Slice Plan - Realistic Layer Combination Coverage Cartography

Status: CLOSED - Gate A landed no-runtime 2026-04-27; first Gate B
candidate closed no-runtime; next selected slice is
`wall_timber_stud_clt_accuracy_pass_v1`

## Objective

Build an executable map of realistic floor and wall layer combinations
so the next runtime widening slice is selected from evidence rather than
from the nearest green test.

The product goal is not to fabricate exact answers for every possible
stack. The goal is broader practical coverage with honest accuracy:

- common user-built combinations should return a finite, physically
  plausible result when a source, benchmark, formula, or family lane can
  defend that result;
- unsupported combinations should stay explicit as `unsupported`,
  `needs_input`, screening-only, or low-confidence instead of looking
  exact;
- every widened corridor should preserve the existing source/benchmark
  lanes and the support/card posture.

## Activation Rule

This slice is active because `dynamic_airborne_split_refactor_v2`
Gate C is closed. The architecture slice reduced
`dynamic-airborne.ts` to 1793 lines, below the 2000-line C6 threshold,
and broad validation stayed green.

Activation requires:

1. `dynamic_airborne_split_refactor_v2` Gate C closeout is recorded.
2. `CURRENT_STATE.md`, `MASTER_PLAN.md`, `NEXT_IMPLEMENTATION_PLAN.md`,
   `DYNAMIC_AIRBORNE_CARTOGRAPHY.md`, and the post-contract agree on C6.
3. `pnpm calculator:gate:current`, broad `pnpm check`, and
   `git diff --check` are green at the split closeout baseline.

Activation status: satisfied on 2026-04-26. Gate A landed on
2026-04-27 in
`packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`.
No runtime calculator code changed.

## Current Evidence Inputs

Use existing repo surfaces before adding new runtime logic:

- `MASTER_PLAN.md` section 3 implementation state grid;
- `coverage-grid-consistency.test.ts`;
- `apps/web/features/workbench/preset-definitions.ts`;
- `packages/engine/src/mixed-floor-wall-generated-test-helpers.ts`
  (`ENGINE_MIXED_GENERATED_CASES`);
- wall preset/card/value matrices:
  `wall-full-preset-contract-matrix.test.ts`,
  `wall-preset-expansion-benchmarks.test.ts`,
  `wall-lsf-timber-stud-preset-benchmarks.test.ts`,
  `wall-field-continuation-completeness-matrix.test.ts`,
  `dynamic-airborne-wall-selector-value-pins.test.ts`,
  `wall-resilient-bar-side-count-*.test.ts`, and
  `wall-direct-timber-exact-route-card-matrix.test.ts`;
- floor preset/card/value matrices:
  `floor-full-preset-contract-matrix.test.ts`,
  `floor-field-continuation-gate-a-matrix.test.ts`,
  `floor-field-continuation-gate-a-card-matrix.test.ts`,
  `floor-many-layer-stress-gate-a-matrix.test.ts`,
  `floor-layer-order-edit-stability-gate-a-matrix.test.ts`,
  exact/source audits, and raw-floor hostile-input matrices;
- source-blocked references in `SOURCE_GAP_LEDGER.md`.

## Non-Goals

- Do not retune formulas during Gate A.
- Do not import a source row from a random web page or marketing snippet.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
  reinforced-concrete reopening, wall-selector behavior, or timber exact
  rows without new source evidence and an explicit selected source slice.
- Do not downgrade an exact or benchmark-backed lane to a broader formula
  just to make more combinations return numbers.
- Do not claim "all possible layer stacks" are covered. Coverage is
  representative and evidence-tiered.

## Gate A - Coverage Cartography, No Runtime Change

Create an executable matrix that classifies realistic layer
combinations by evidence tier and support posture.

The first matrix should include:

### Wall Families

- single-leaf masonry and AAC;
- CLT / mass timber wall;
- concrete or heavy-core lined/double-leaf wall;
- light-steel stud wall;
- timber stud wall;
- resilient-bar framed wall with `auto`, `one_side`, and `both_sides`;
- mixed board single-board framed walls already handled by dynamic
  airborne template/correction guards;
- deep-hybrid swap families (`heavy_core`, `aac_d700_100`,
  `aac_d700_120`, `aac_g5`).

### Floor Families

- heavy concrete with and without resilient/floating finish;
- reinforced-concrete formula and low-confidence corridors;
- CLT dry/wet/suspended source families;
- timber-frame exact and timber mount families;
- open-web/open-box steel/timber families;
- UBIQ exact, bound, and packaged-finish families;
- Pliteq / Regupol / Getzner spot exact/delta families;
- raw terminal-concrete helper and raw fail-closed carriers.

### Classification Columns

For each representative cell record:

- `studyMode`;
- canonical stack id;
- evidence tier: `exact`, `benchmark`, `formula`, `family`,
  `screening`, `bound`, `fail_closed`;
- output coverage for `Rw`, `R'w`, `Dn,w`, `DnT,w`, `DnT,A`,
  `Ln,w`, `Ln,w+CI`, `L'n,w`, `L'nT,w`, and `L'nT,50` where
  applicable;
- origin/basis id or null;
- confidence posture shown to the user;
- engine support bucket and web card status;
- invariants that must hold;
- whether the cell is a runtime-widening candidate, a value-pin-only
  candidate, or source-blocked.

Gate A deliverables:

1. `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`
   landed. It executes 29 representative cells: 14 floor cells and 15
   wall cells.
2. A paired web card/status matrix was not added because every Gate A
   cell is either already backed by existing web/card evidence or is an
   engine-only stress/cartography cell with explicit evidence paths.
3. Gate A handoff:
   `CHECKPOINT_2026-04-27_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_GATE_A_HANDOFF.md`.

Gate A is complete only if no runtime code changes and the focused gate
is green.

Gate A candidate result:

1. `wall.concrete_heavy_core_screening.field` - highest-ROI runtime
   candidate. It is common, currently screening-tier, already returns
   finite field outputs, and should be tightened before claiming
   benchmark/source confidence.
2. `wall.timber_stud_formula.field` - common direct double-board timber
   stud formula lane, but current exact rows still do not match the live
   topology.
3. `wall.clt_formula.field` - mass-timber wall formula lane.
4. No runtime rank is assigned to deep-hybrid swaps because Gate A found
   existing engine/web parity; they stay value-pin-only.
5. `floor.steel_fallback_low_confidence.field` - lower-priority floor
   fallback candidate. Source-blocked floor rows (`GDMTXA04A`, `C11c`)
   stay blocked.

## Gate B - First Runtime Widening Selection

Select exactly one widening/tightening target from Gate A. Ranking
should prefer common user value, source/benchmark availability, low
blast radius, and improvement in honest coverage.

Gate A ranking after executable cartography:

1. Concrete / heavy-core wall lane currently shown as screening-only:
   likely high user value, common topology, and currently the weakest
   wall preset evidence tier.
2. Timber stud direct double-board wall formula lane: common topology,
   currently formula/low-confidence despite nearby source-corpus and
   side-count evidence.
3. CLT wall formula lane: common mass-timber wall, formula-owned today.
4. Deep-hybrid swap VALUE pins did not become a runtime target because
   existing web/card parity is already pinned.
5. Steel suspended floor fallback stays the only runtime floor fallback
   candidate in this matrix; reinforced-concrete exact/product lanes are
   already separated from source-blocked rows.

This Gate B selection is also the first item in
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).
The concrete/heavy-core subplan is
[SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md](./SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md).
The first no-runtime Gate B audit contract landed in
`packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts`;
it now includes the source/formula evidence audit. The audit found no
exact catalog row, no direct external benchmark match in the current
audit, and no topology-specific tolerance for the selected concrete
lining stack, so the lane remains `screening`. Gate B then closed
no-runtime in
`post-wall-heavy-core-concrete-gate-b-next-slice-selection-contract.test.ts`
and selected
[SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md](./SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md).
The remaining private-use readiness chain is timber stud + CLT wall
accuracy, floor fallback / low-confidence cleanup, and UI/input/output
honesty.

Source-blocked families stay out of Gate B unless new source evidence
is deliberately imported:

- `GDMTXA04A` direct exact;
- `C11c` exact import;
- raw bare open-box/open-web impact;
- wall-selector behavior widening.

## External Evidence Policy

Internet research is not required for the current mechanical split. It
is required only when Gate A selects a runtime widening that needs new
source or formula evidence.

Acceptable evidence:

- official manufacturer/system datasheets with clear assembly layers and
  acoustic ratings;
- official catalog rows already mirrored by an upstream source corpus;
- standards summaries only when the implementation already owns the
  formula lane and the source is official or directly citable;
- peer-reviewed or university/lab reports with enough layer detail to
  reproduce the route.

Unacceptable evidence:

- unsourced blog tables;
- isolated marketing claims without assembly details;
- values that cannot be tied to a layer stack, context, and output
  metric;
- any source that would make a fail-closed route look exact without
  enough provenance.

## Gate C - Closeout And Next Slice

Close the cartography slice after:

- the coverage matrix is executable and green;
- candidate ranking is documented;
- the selected first widening slice has its own plan;
- `CURRENT_STATE.md`, `MASTER_PLAN.md`, and
  `NEXT_IMPLEMENTATION_PLAN.md` agree on the new active slice;
- `pnpm calculator:gate:current`, broad `pnpm check`, and
  `git diff --check` are green.

## Validation

Minimum Gate A validation:

- targeted coverage-cartography engine test;
- paired web card matrix if added;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Gate C validation:

- broad `pnpm check`;
- post-contract test naming the selected runtime widening slice.

Latest validation note: 2026-04-27 broad `pnpm check` is green after
heavy-core/concrete Gate B no-runtime closeout and timber+CLT
next-slice selection. Engine broad is 223 files / 1232 tests. Web broad
keeps all 150 files in scope via `tools/dev/run-web-vitest.ts` with 864
passed + 18 skipped; the runner isolates long route scans, including
the heavy family-boundary scan that uses `--pool=threads` to avoid
Vitest worker RPC timeout noise. Build is 5/5 with the known non-fatal
`sharp/@img` optional-package warnings.
