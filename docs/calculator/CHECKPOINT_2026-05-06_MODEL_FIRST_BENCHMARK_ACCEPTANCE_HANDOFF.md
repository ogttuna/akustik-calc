# Checkpoint: Model-First Benchmark Acceptance Handoff

Date: 2026-05-06

Status: benchmark/acceptance refinement added; no runtime behavior
changed.

## Purpose

Tighten the model-first milestone plan so implementation can proceed
with measurable exit criteria instead of another broad planning loop.

## Additional Research Used

- ISO 10848-1/2/3/4:
  flanking transmission measurement context. These standards support the
  rule that apparent/field results require flanking, junction, and room
  context instead of only a separating stack.
  <https://www.iso.org/standard/67226.html>
  <https://www.iso.org/standard/67227.html>
  <https://www.iso.org/standard/67228.html>
  <https://www.iso.org/standard/67229.html>
- ISO 12999-1:2020:
  procedures for assessing measurement uncertainty of sound insulation in
  building acoustics. This supports explicit non-exact `errorBudgetDb`
  and `toleranceClass` metadata.
  <https://www.iso.org/standard/73930.html>
- ASTM E413-22:
  STC is a rating classification connected to ASTM E90-style airborne
  transmission-loss data, not a blind alias of `Rw`.
  <https://store.astm.org/e0413-22.html>
- ASTM E989-21:
  impact single-number metrics including IIC are connected to ASTM
  E492-style impact band data, not airborne curves.
  <https://store.astm.org/e0989-21.html>
- ASTM E90-23 / E492-25:
  current ASTM lab measurement lanes for airborne transmission loss and
  impact transmission through floor-ceiling assemblies.
  <https://store.astm.org/e0090-23.html>
  <https://store.astm.org/standards/e492>
- ISO 16283-3 and ASTM E1332:
  facade/OITC references kept as future-output boundary context. Facade
  and outdoor-indoor ratings should remain unsupported/needs-input until
  their own context and rating path exists.
  <https://www.iso.org/standard/59748.html>
  <https://store.astm.org/e1332-10.html>

## Plan Changes

`docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
now includes:

- a `Benchmark And Acceptance Matrix` with B0-B12 lanes;
- `Initial Tolerance Classes`;
- runtime movement stop rules.

`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md` now summarizes the
benchmark lanes and stop rules in the active decision map.

`AGENTS.md` now points to this checkpoint before older model-first
handoffs.

## Benchmark Lanes

The accepted benchmark lanes are:

1. B0 no-runtime direction contract.
2. B1 exact full-stack source row.
3. B2 exact subassembly anchor plus delta.
4. B3 single-leaf / massive physics.
5. B4 double-leaf / framed / cavity physics.
6. B5 triple-leaf / multi-cavity physics.
7. B6 porous fill / absorption data boundary.
8. B7 floating floor / impact prediction.
9. B8 field / apparent output context.
10. B9 rating adapter integrity.
11. B10 hostile layer input stability.
12. B11 calibration / holdout.
13. B12 personal-use scenario pack.

## Correct Next Step

Still create:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Gate A should remain no-runtime, but now it should also assert that the
benchmark lanes and stop rules are the accepted acceptance frame for
later runtime movement.

## Stop Rules

- No non-exact result may surface without `errorBudgetDb` or
  `toleranceClass`.
- No field/apparent metric may surface as design-grade without required
  field context.
- No runtime value may move without at least one positive benchmark row
  and one nearby negative/hostile row.
- No source row may promote a broader family than its topology, metric,
  material mapping, and tolerance owner allow.

## Validation

This handoff is docs-only. Handoff checks passed:

- `git diff --check`;
- trailing-whitespace scan over active authority docs.
