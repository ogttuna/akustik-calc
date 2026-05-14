# Checkpoint - 2026-05-14 Heavy-Composite Wall Solver Cleanup

## Status

Landed on the company-internal calculation-grade mainline.

This checkpoint covers the first wall screening cleanup after the
building-prediction parking fix: the generated heavy-composite wall
case `wall-heavy-composite-hint-suppression` no longer resolves as a
`screening_fallback` / `low` confidence final answer when its physical
topology is complete.

## Runtime Change

Complete heavy-composite double-leaf wall stacks with two heavy
mineral/composite leaves, one explicit unframed air cavity, complete
surface-mass inputs, no stud/support owner, and no porous fill now get
the named lab basis:

`company_internal_heavy_composite_wall_mass_air_mass_capped_family_physics_runtime`

The solver does not retune the current values. It preserves:

- lab `Rw 63 / STC 63 / C -1.4 / Ctr -6.3`;
- field `R'w 60 / Dn,w 60 / DnT,w 61 / DnT,A 60.1`;
- exact-source precedence above the source-absent family solver;
- the heavy unframed cavity cap as a conservative mass-based corridor.

The lab basis carries `errorBudgetDb: 8` and
`origin: family_physics_prediction`. Field `field_between_rooms`
requests wrap that owned lab-family basis through the existing Gate I
field adapter with `errorBudgetDb: 10`; lab `Rw` is not aliased to
`R'w` / `DnT,w`.

## Boundaries

- Ordinary lightweight double-leaf walls do not receive the
  heavy-composite basis.
- Duplicated / multi-cavity hostile stacks remain on their guarded
  multi-leaf behavior.
- Complete heavy-composite safe trims/reorders are now `medium`
  confidence with a visible uncalibrated budget instead of a `low`
  confidence screening answer.
- Source rows can still override when topology, metric basis, and
  rights-safe source ownership are present.

## Changed Runtime Files

- `packages/engine/src/dynamic-airborne-company-internal-heavy-composite-wall.ts`
- `packages/engine/src/dynamic-airborne.ts`
- `packages/engine/src/dynamic-airborne-gate-i-airborne-field-context.ts`
- `packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`
- `packages/engine/src/index.ts`

## Validation

Focused validation passed:

- `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-heavy-composite-wall-family-physics-contract.test.ts src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts src/dynamic-airborne-instability-repro.test.ts src/dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts`
  - 4 files / 18 tests passed.
- `pnpm --filter @dynecho/web exec vitest run --maxWorkers=1 features/workbench/mixed-study-mode-torture.test.ts`
  - 1 file / 5 tests passed.

An accidental broad `@dynecho/engine test -- ...` invocation expanded
to the full engine suite and failed in unrelated floor-impact /
predictor backlog files. The heavy-composite focused files above passed
after updating the expected confidence and composer line-count guard.

## Next Step

Refresh the company-internal coverage matrix, then select the next
calculation-grade lane. The likely next highest-ROI targets are:

1. reinforced-concrete / suspended-ceiling floor-impact cleanup where
   broad tests still show missing predictor lanes;
2. remaining wall heavy-core/concrete matrix cleanup if its docs still
   describe old `screening` posture;
3. field/building wall surface parity for generic family-physics bases.
