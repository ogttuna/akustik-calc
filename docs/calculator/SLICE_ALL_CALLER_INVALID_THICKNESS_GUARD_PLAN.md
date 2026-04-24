# Slice Plan - All-Caller Invalid Thickness Guard v1

Status: CLOSED (2026-04-24, no-runtime Gate A audit and Gate C closeout;
next slice selected: `dynamic_airborne_split_refactor_v2`)

## Objective

Close the remaining cross-cutting calculator robustness gap around
invalid layer thickness for direct engine callers.

Workbench row normalization already catches common invalid text input,
and the wall hostile-input matrix pins several direct wall classes. The
remaining risk is narrower but important: code that bypasses workbench
normalization must not be able to get a defended-looking answer from
`0`, negative, `NaN`, `Infinity`, or otherwise non-finite thicknesses.
The calculator should either return a specifically labeled fail-closed
answer or preserve an already-supported warning/output posture without
crashes, `NaN`, `undefined`, or unsupported live leakage.

## Non-Goals

- Do not change defended numeric values for valid floor or wall stacks.
- Do not broaden source-family support.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
  wall-selector behavior, reinforced-concrete formula scope, or timber
  wall exact-row follow-ups.
- Do not normalize physical layer order, merge layers, or retune
  formulas as part of this guard.
- Do not make invalid thickness estimate-owned; invalid input must be
  explicit and fail closed where it cannot be safely interpreted.
- Do not resume `project_access_policy_route_integration_v1` until this
  selected calculator slice closes or priority explicitly changes.

## Why This Slice Is High ROI

The latest broad check is green, and the floor layer-order audit found
no runtime drift. The next highest-value calculator move is therefore a
small cross-cutting correctness guard that maps directly to
`MASTER_PLAN.md` D3 and the §3 cross-cutting grid:

- D3 requires invalid `0`, negative, non-numeric, `NaN`, and `Infinity`
  thicknesses to produce specific warnings and defended fail-closed
  outputs.
- The grid still marks engine thickness validity as partial because
  direct all-caller floor/wall engine coverage remains deferred.
- This improves accuracy honesty rather than cosmetic behavior: hostile
  direct callers must not receive plausible-looking values from invalid
  physical input.

## Current Baseline

- `apps/web/features/workbench/normalize-rows.test.ts` and the
  workbench route/card tests cover user-facing row normalization.
- `packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts`
  pins direct wall hostile-input classes, including invalid thickness.
- `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
  and related floor route/card matrices pin important floor hostile
  surfaces, but they are not yet a standalone all-caller guard.
- `MASTER_PLAN.md` still lists engine thickness validity as partial
  because callers that bypass workbench normalization need a dedicated
  cross-cutting audit.

Post-commit checkpoint `2026-04-24`: the active docs and implementation
anchors were re-read after commit `3b2f300`. No drift was found.
`pnpm calculator:gate:current`, broad `pnpm check`, and post-build web
typecheck were green. That confirmed Gate A could start from the
current runtime without first retuning formulas or adding a guard. Gate A
has since landed no-runtime and found no direct-caller drift requiring
Gate B.

### Implementation Reconnaissance - 2026-04-24

Local implementation review confirms the current guard shape:

- `calculateAssembly(...)` calls `evaluateAssemblyInputGuard(...)`
  before `LayerInputSchema.parse(...)`, so malformed direct layer input
  is intercepted before Zod can throw.
- `evaluateAssemblyInputGuard(...)` currently treats non-numeric,
  non-finite, `NaN`, `Infinity`, `<= 0`, and `> 100000` mm thickness
  values as invalid.
- `buildFailClosedAssemblyResult(...)` returns a schema-valid
  `AssemblyCalculation` with:
  - flat finite curve bands;
  - zeroed finite metrics;
  - empty `supportedTargetOutputs`;
  - every requested target output in `unsupportedTargetOutputs`;
  - empty `supportedImpactOutputs`;
  - `impact: null`;
  - no floor-system match, estimate, ratings, or recommendations.
- One-off direct probes for wall lab `0`, wall field `Infinity`, floor
  field `NaN`, and raw floor non-numeric thickness all matched that
  fail-closed shape.

No internet research is required for Gate A. This slice does not import
new source rows, retune formulas, or decide an acoustic evidence tier; it
only proves the local engine-boundary guard for direct callers.

## Gate Plan

### Gate A - inventory current direct invalid-thickness surfaces

Status: LANDED (2026-04-24, no runtime change).

No runtime change. Add a direct engine matrix that exercises both floor
and wall callers with representative invalid thickness variants:

- `0`;
- negative finite value;
- `Number.NaN`;
- `Number.POSITIVE_INFINITY`;
- non-numeric input where the public type boundary allows it through
  test construction.

The matrix should pin:

- no crash;
- no non-finite output values;
- support buckets and answer origins;
- warning fragments or unsupported reasons where they carry the
  fail-closed meaning;
- floor and wall parity where the same invalid physical condition enters
  different caller paths.

#### Gate A execution contract - 2026-04-24

Use a single new engine test file:

- `packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`

The file should call `calculateAssembly` directly. Do not route through
`normalizeRows`, `evaluateScenario`, or any workbench helper, because this
slice is about API / CLI / test callers that bypass workbench
normalization.

Exercise these caller surfaces:

1. Wall lab direct caller:
   - untagged wall layers;
   - `calculator: "dynamic"`;
   - `airborneContext.contextMode: "element_lab"`;
   - target outputs: `Rw`, `R'w`, `DnT,w`, `STC`, `C`, `Ctr`.
2. Wall field direct caller:
   - same invalid layer shape;
   - `calculator: "dynamic"`;
   - `airborneContext.contextMode: "field_between_rooms"` with panel
     geometry;
   - same target outputs.
3. Floor field direct caller:
   - explicit floor-role stack, with the invalid value placed on a
     representative `base_structure` layer;
   - airborne field context plus impact field context;
   - target outputs: `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`,
     `L'nT,w`.
4. Floor raw direct caller:
   - raw floor-like stack with no workbench-normalized roles where that
     is useful to prove the guard happens before floor-role inference;
   - same invalid classes and target outputs as the floor field caller.

For each caller surface, cover these invalid classes:

- `0`;
- a negative finite value such as `-5`;
- `Number.NaN`;
- `Number.POSITIVE_INFINITY`;
- a non-numeric hostile value constructed with a narrow test cast at the
  layer boundary.

Every cell should assert:

- `calculateAssembly` does not throw;
- every numeric metric and curve band in the returned result is finite;
- `supportedTargetOutputs` is empty;
- `unsupportedTargetOutputs` contains the requested outputs;
- `supportedImpactOutputs` is empty for floor callers;
- warnings include a thickness-specific fragment;
- the result does not expose an exact/family/formula-looking match,
  candidate id, impact lane, or floor-system rating from the invalid
  physical input.

Do not treat `metrics.method: "screening_mass_law_curve_seed_v3"` in the
fail-closed result as a defended formula origin. It is only the
schema-compatible placeholder used by `buildFailClosedAssemblyResult(...)`;
the assertions should focus on empty supported outputs, requested
unsupported outputs, null lanes, finite zeroed values, and the specific
warning.

Gate A should be expected to pass without runtime change because the
current central engine boundary already calls
`evaluateAssemblyInputGuard(...)` before `LayerInputSchema.parse(...)`,
but this is still an inventory step. If the matrix proves the central
guard is not reached by a caller surface, open Gate B and fix only that
boundary.

After the matrix is green, add it to
`tools/dev/run-calculator-current-gate.ts` so future focused calculator
gates keep the all-caller invalid-thickness contract live.

#### Gate A landed evidence - 2026-04-24

Gate A landed with:

- `packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`
- `tools/dev/run-calculator-current-gate.ts` updated to include the new
  matrix.

The matrix covers 4 direct caller surfaces × 5 invalid thickness classes:
wall lab, wall field, explicit-role floor field, and raw floor
pre-inference callers across `0`, `-5`, `Number.NaN`,
`Number.POSITIVE_INFINITY`, and a non-numeric runtime value.

Findings:

- no direct caller crashed;
- every returned metric, rating, and curve band stayed finite;
- `supportedTargetOutputs` stayed empty;
- requested outputs moved to `unsupportedTargetOutputs`;
- impact/floor-system lanes stayed null or absent;
- every cell emitted a thickness-specific warning;
- no source family, exact row, formula lane, or unsupported live answer
  leaked from invalid physical input.

Gate A found no concrete runtime drift, so Gate B is not required.

### Gate B - add a guard only for concrete drift

Status: NOT REQUIRED by Gate A findings. Reopen only if a later review
finds a direct invalid-thickness caller surface not covered by Gate A or
a regression in the central engine-boundary guard.

Open Gate B only if Gate A proves that any direct caller can produce a
crash, `NaN`, `Infinity`, `undefined`, unsupported live leakage, or a
defended-looking value without a specific invalid-thickness warning.

Valid Gate B fixes:

- add or reuse a central layer-thickness validation helper at the
  engine boundary;
- make direct floor/wall callers fail closed consistently;
- keep existing valid-stack values unchanged;
- preserve workbench normalization semantics.

Invalid Gate B fixes:

- broad formula retunes;
- source-family reopening;
- layer-order normalization;
- changing valid-stack outputs to make invalid inputs easier to handle.

### Gate C - closeout and next-slice selection

Status: LANDED (2026-04-24, no runtime change).

Close after targeted tests, `pnpm calculator:gate:current`, broad
`pnpm check`, web typecheck after build, and `git diff --check` are
green. If Gate B changes runtime behavior, document exact invalid-input
behavior changes and prove that valid defended values stayed stable.

Gate C landed with
`packages/engine/src/post-all-caller-invalid-thickness-gate-c-v1-next-slice-selection-contract.test.ts`.
It records:

- `all_caller_invalid_thickness_guard_v1` closed no-runtime;
- Gate B was not required by Gate A findings;
- `MASTER_PLAN.md` engine thickness validity moved from partial to
  benchmark with matching `coverage-grid-consistency.test.ts` evidence;
- `dynamic_airborne_split_refactor_v2` is selected next because
  source-family gaps are blocked or lower-ROI while
  `dynamic-airborne.ts` remains above the 2000-line architecture hygiene
  threshold.

## Immediate Next Steps

1. Continue
   [SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md](./SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md)
   from Gate A.
2. Treat this plan as closed reference context unless a future focused
   regression proves a direct invalid-thickness caller surface was missed.

Completed Gate A implementation order:

1. Create
   `packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`.
2. Define shared output arrays and contexts in the test file:
   - wall outputs: `Rw`, `R'w`, `DnT,w`, `STC`, `C`, `Ctr`;
   - floor outputs: `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`,
     `L'nT,w`;
   - wall lab context, wall field context, floor airborne field context,
     and floor impact field context.
3. Define four caller-surface builders:
   - `wall_lab_direct`;
   - `wall_field_direct`;
   - `floor_field_explicit_roles`;
   - `floor_raw_pre_inference`.
4. Define five invalid thickness variants:
   - `zero`;
   - `negative`;
   - `nan`;
   - `infinity`;
   - `non_numeric_runtime_value`.
5. Iterate the 4 × 5 matrix and collect failures into a single readable
   failure list, following the style used by existing matrix tests.
6. Add targeted assertions for:
   - no throw;
   - finite metrics and finite curve bands;
   - empty supported outputs;
   - requested outputs all unsupported;
   - no impact/floor-system lanes;
   - thickness-specific warning.
7. Run the new test directly.
8. Add the new file to `tools/dev/run-calculator-current-gate.ts`.
9. Run `pnpm calculator:gate:current`.
10. If still no runtime change is required, proceed to Gate C docs and
    post-contract selection instead of opening Gate B.

## Validation

Minimum:

- targeted Gate A engine invalid-thickness matrix;
- existing floor/wall hostile-input matrices touched by the same caller
  path;
- `pnpm calculator:gate:current`;
- `pnpm check`;
- `pnpm --filter @dynecho/web typecheck` after build;
- `git diff --check`.

## Completion Criteria

- direct floor and wall engine callers are audited for invalid
  thickness;
- invalid thickness never yields a crash, non-finite output, or
  unsupported live leakage;
- valid defended stacks keep their current values;
- workbench normalization assumptions stay honest;
- blocked-source families remain blocked;
- the next selected slice is recorded in a post-contract test.
