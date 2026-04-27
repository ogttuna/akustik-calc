# Personal Use Readiness Roadmap

Date: 2026-04-27

## Purpose

This roadmap defines the remaining calculator-focused work needed before
DynEcho is reasonable for private, day-to-day acoustic estimates across
common wall and floor layer combinations.

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

Status: active slice; Gate A landed no-runtime, timber-stud Gate B is
next.

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
- Gate B starts with `wall.timber_stud_formula.field`; add a focused
  runtime/source contract first, then change math only if a named source
  row, documented formula-owned timber rule, or bounded family rule
  supports it;
- keep resilient-bar and direct timber exact imports from bleeding into
  unmatched topologies;
- start from
  [SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md](./SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md).

### 3. Floor Fallback / Low-Confidence Cleanup

Status: lower-priority calculator candidate.

Most high-value floor lanes already have stronger evidence than the
remaining fallback corridors. The steel suspended fallback and other
low-confidence corridors should be tightened only when the evidence can
improve honest coverage without reopening blocked source families.

Required before implementation:

- keep `GDMTXA04A`, `C11c`, and raw bare open-box/open-web impact
  source-blocked unless new source evidence is deliberately imported;
- separate exact/product-delta rows from predicted airborne or field
  companions;
- preserve explicit unsupported output posture for unavailable low
  frequency impact outputs.

### 4. UI / Input / Output Honesty Pass

Status: required before calling the calculator personally ready.

This pass should make the existing engine honesty visible and ergonomic
for private use. It does not need full product polish, but it must avoid
misleading the user.

Required before implementation:

- missing required fields should clearly identify what to enter next;
- output cards should distinguish exact, benchmark, formula, family,
  screening, bound, unsupported, and fail-closed values;
- origin/confidence and unsupported-output messages should stay visible
  after layer edits, reorder, many-layer stacks, and save/load;
- web tests should cover the main wall/floor input flows and visible
  confidence/support states.

## Current Order

Current validation baseline: 2026-04-27 `pnpm check` is green after
heavy-core/concrete Gate B no-runtime closeout and timber+CLT next-slice
selection. Engine broad is 223 files / 1232 tests. Web broad keeps 150
files in scope through `tools/dev/run-web-vitest.ts` with 864 passed +
18 skipped. Build is 5/5 with the known non-fatal `sharp/@img`
optional-package warnings. Focused current gate after the timber+CLT
Gate A audit is 91 engine files / 416 tests, 36 web files / 170 passed
plus 18 skipped, build 5/5.

Do these in order unless new evidence changes the ranking:

1. Timber stud + CLT wall accuracy pass.
2. Floor fallback / low-confidence cleanup.
3. UI / input / output honesty pass.

`project_access_policy_route_integration_v1` remains deferred until this
calculator readiness chain closes or priority explicitly changes.
