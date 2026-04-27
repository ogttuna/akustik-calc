# Personal Use Readiness Roadmap

Date: 2026-04-27

## Purpose

This roadmap records the calculator-focused work that made DynEcho
reasonable for private, day-to-day acoustic estimates across common wall
and floor layer combinations.

This is not a productization roadmap. Auth, billing, deployment,
collaboration, and polished reporting can stay deferred. The readiness
bar here is calculation functionality: common combinations should return
defensible values, unsupported combinations should fail honestly, and
the UI should make the evidence/confidence posture clear enough for a
single knowledgeable user.

## Readiness Definition

DynEcho is personal-use ready when these conditions hold:

1. Common wall and floor stacks return finite values for the applicable
   `Rw`, `R'w`, `Dn,w`, `DnT,w`, `Ln,w`, `L'n,w`, and `L'nT,w` outputs
   when the engine has a source, benchmark, formula, or bounded family
   lane.
2. Exact/source-backed lanes keep precedence over broader formulas.
3. Formula, family, screening, bound, and fail-closed lanes are visible
   as such; they must not look exact.
4. Missing input, invalid layer thickness, excessive layers, layer
   reordering, and unsupported output requests do not produce
   defended-looking bad answers.
5. Focused tests assert numerical behavior, support/origin posture, and
   edge-case stability, not only that the code runs.

## Priority Chain

### 1. Heavy-Core / Concrete Wall Lane

Status: closed no-runtime; remains screening until new source evidence
appears.

Gate A selected `wall.concrete_heavy_core_screening.field` as the
highest-ROI runtime target. It is common, currently screening-tier, and
already returns finite field outputs. Gate B must tighten/source this
lane before any runtime value is allowed to claim benchmark or family
confidence.

Gate B starts from
[SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md](./SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md).
The first no-runtime audit contract is now
`packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts`.
It keeps the generated dynamic candidate, the workbench
`concrete_wall` screening preset, selector value pins, and deep-hybrid
swap guards separate and pins the source/formula audit result: no exact
catalog row, no direct external benchmark match in the current audit,
and no topology-specific tolerance for the selected concrete lining
stack. Evidence remains `screening`.

Closed decision:

- keep `wall-screening-concrete` screening-tier at field `R'w = 55`;
- do not promote to formula/family/benchmark without a new source row or
  bounded family rule;
- continue personal-use readiness with the timber stud + CLT wall pass.

### 2. Timber Stud And CLT Wall Accuracy Pass

Status: closed no-runtime at Gate C.

The direct double-board timber stud and CLT wall lanes are common and
currently formula-owned where no exact topology row matches the live
stack. The work should improve accuracy or confidence only where source,
benchmark, or formula evidence supports the change.

Required before implementation:

- Gate A already separated exact-row opportunities from broad
  formula-owned lanes in
  `packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts`;
- generated `wall-timber-stud` is pinned at lab `Rw=50`, field
  `R'w=42`, low-confidence `stud_wall_system`, with no verified exact,
  lab-fallback, or landed exact timber row topology match;
- generated `wall-clt-local` is pinned at lab `Rw=42`, field `R'w=41`,
  medium-confidence `laminated_single_leaf`, with no verified exact,
  lab-fallback, or floor CLT source-truth import;
- timber-stud Gate B landed no-runtime in
  `packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts`;
  generated `wall-timber-stud` stays at lab `Rw=50`, field `R'w=42`,
  low-confidence `stud_wall_system`, because no exact source,
  lab-fallback, or bounded family rule currently matches the live stack;
- CLT wall Gate B landed no-runtime in
  `packages/engine/src/wall-clt-gate-b-source-contract.test.ts`;
  generated `wall-clt-local` stays at lab `Rw=42`, field `R'w=41`,
  medium-confidence `laminated_single_leaf`, because no wall-specific
  CLT source row, verified lab-fallback, documented laminated-leaf
  solver, or bounded family rule currently matches the live wall stack;
- keep resilient-bar and direct timber exact imports from bleeding into
  unmatched topologies;
- keep Dataholz CLT floor-system source rows from being borrowed as wall
  exact truth;
- Gate C closed no-runtime in
  `packages/engine/src/post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts`
  and selected floor fallback / low-confidence cleanup;
- start from
  [SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md](./SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md).

### 3. Floor Fallback / Low-Confidence Cleanup

Status: closed no-runtime at Gate C.

Most high-value floor lanes already have stronger evidence than the
remaining fallback corridors. The steel suspended fallback and other
low-confidence corridors should be tightened only when the evidence can
improve honest coverage without reopening blocked source families.

Gate A / Gate B result:

- start from
  [SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md](./SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md);
- Gate A contract landed in
  `packages/engine/src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts`;
- generated `floor-steel-fallback` is pinned as no-exact/no-bound,
  `low_confidence`, origin
  `predictor_floor_system_low_confidence_estimate`, fit `28%`;
- lab values are floor-system `Rw=61`, `Ln,w=58.3`, with
  `Ln,w+CI` and `DeltaLw` unsupported;
- field values are floor-system `Rw=61`, `R'w=70`, `Dn,w=69`,
  `DnT,w=72`, `DnT,A=70.6`, `Ln,w=58.3`, `L'n,w=61.3`,
  `L'nT,w=58.5`, with `L'nT,50` unsupported;
- Pliteq steel joist rows and UBIQ FL-32 bound rows remain lineage /
  near misses, not promotion evidence.
- Gate B landed no-runtime in
  `packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts`;
- true Pliteq source topology already lands on exact source id
  `pliteq_steel_joist_250_rst02_vinyl_lab_2026`;
- true UBIQ FL-32 source topology already lands on bound interpolation
  using `ubiq_fl32_steel_200_lab_2026` and
  `ubiq_fl32_steel_300_lab_2026`;
- the selected live generated stack lacks the critical source topology
  for both paths, so runtime promotion remains blocked;
- keep `GDMTXA04A`, `C11c`, and raw bare open-box/open-web impact
  source-blocked unless new source evidence is deliberately imported;
- separate exact/product-delta rows from predicted airborne or field
  companions;
- preserve explicit unsupported output posture for unavailable low
  frequency impact outputs.

Closed follow-up:

- `ui_input_output_honesty_v1` was selected and has now closed Gate C;
- keep `floor-steel-fallback` low-confidence until new source evidence
  or a bounded steel/open-web family rule exists.

### 4. UI / Input / Output Honesty Pass

Status: closed at Gate C.

This pass should make the existing engine honesty visible and ergonomic
for private use. It does not need full product polish, but it must avoid
misleading the user.

Gate A result:

- focused web contract:
  `apps/web/features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts`;
- no runtime math, formula, confidence, or support-classification change;
- schemas already reject missing estimate layers and source-less
  impact-only requests with structured issue paths;
- field airborne status already separates missing partition geometry from
  missing receiving-room volume;
- explicitly unsupported outputs stay non-numeric;
- no defended-looking unsupported live/bound value was found.

Gate B result:

- missing estimate layers and source-less impact-only requests now
  return concrete `nextField` guidance while preserving raw schema
  issue detail;
- simple output cards now prefer unsupported/current-path labels when
  the engine already rejected a requested field-impact output and field
  continuation is active;
- genuinely missing field-impact inputs still show `needs_input`;
- exact, benchmark, formula, family, screening, bound, unsupported, and
  fail-closed labels remain covered by existing focused matrices;
- no acoustic formula, runtime value, confidence score, or precedence
  changed.

Gate C closeout:

- `packages/engine/src/post-ui-input-output-honesty-gate-c-next-slice-selection-contract.test.ts`
  closes the readiness chain;
- DynEcho is private/internal-use ready with evidence-tier caveats;
- `project_access_policy_route_integration_v1` is selected next as a
  productization slice;
- no acoustic formula, runtime value, confidence score, or output
  support changed.

Start from
[SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md](./SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md).

## Current Order

Current validation baseline: 2026-04-27 `pnpm check` is green after
source-gap revalidation Gate A. Engine broad is 233 files /
1275 tests. Web broad keeps 155 files in scope through
`tools/dev/run-web-vitest.ts` with 885 passed + 18 skipped. Build is
5/5 with the known non-fatal `sharp/@img` optional-package warnings.
Focused current gate is 100 engine files / 455 tests, 43 web files /
211 passed plus 18 skipped, build 5/5. The targeted UI honesty Gate A
contract is 1 file / 4 tests green. The targeted Gate B web set is
3 files / 18 tests green, the targeted Gate C closeout contract is
1 file / 5 tests green, and the targeted route-policy closeout set is
4 files / 23 tests green. Proposal/report polish targeted validation is
5 files / 18 tests green.

## Readiness Decision

DynEcho is now ready for private/internal use by a knowledgeable user
who respects the visible evidence labels.

This means common wall/floor stacks can be used for day-to-day estimates
when they land on exact/source, benchmark, formula, family, screening,
or bound lanes, and unsupported or missing-input cases stay explicit.

This does not mean every possible floor/wall family corridor is covered,
or that the app is certified for regulatory submission. Blocked source
families remain blocked until new evidence is deliberately imported.

Next selected work:

1. `wall_double_leaf_sharp_davy_scoping_v1`.

`calculator_source_gap_revalidation_v1` Gate A and
`wall_coverage_expansion_planning_v2` Gate A are closed no-runtime.
`wall_single_leaf_mass_law_calibration_v1` also closed no-runtime at
Gate C: current generic concrete, solid-brick, and AAC values stay
formula-owned estimates until a stack-specific source row or bounded
tolerance pack exists. Calculator runtime/source posture should remain
frozen during Gate A of the selected double-leaf Sharp/Davy scoping
slice. The next movement must be a source-backed, benchmark-backed,
bounded, or formula-owned wall candidate selected by an executable
contract, not an implicit reopen from nearby green tests.
