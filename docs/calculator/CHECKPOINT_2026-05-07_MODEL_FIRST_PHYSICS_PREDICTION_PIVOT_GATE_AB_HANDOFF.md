# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate AB

Status: Gate AB landed. Gate AC steel-floor physics input contract is
selected next.

Selection status:

`gate_ab_floor_family_source_guard_landed_selected_steel_floor_physics_input_gate_ac`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts`

Landed action:

`gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts`

Selected next action:

`gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`

## What Changed

Gate AB closes the floor-side version of the construction-image accuracy
incident. A generic modular/lightweight steel floor with upper and lower
impact packages was previously able to produce `Ln,w 53.3` by blending
nearby UBIQ open-web steel rows even though the input did not declare the
steel support form or a matching impact package.

The new guard keeps that route on `needs_input` / unsupported impact
outputs until these physical owners are explicit:

- `open_web_or_rolled` vs `joist_or_purlin` steel support form;
- steel carrier depth and spacing;
- upper impact package dynamic stiffness or a matching source row;
- lower ceiling isolation/support form.

Exact same-family steel rows still promote when the full topology truly
matches. Same-family UBIQ bound rows remain visible as bound support, but
they are not converted into exact `Ln,w`.

## Implementation Notes

- `packages/engine/src/floor-family-source-guard.ts` owns the generic
  lightweight-steel needs-input guard.
- `packages/engine/src/floor-system-estimate.ts` withholds family
  estimates when that guard is active, preventing source rows from
  becoming numeric anchors before the support form is known.
- `packages/engine/src/impact-lane.ts`,
  `packages/engine/src/calculate-impact-only.ts`, and
  `packages/engine/src/calculate-assembly.ts` pass the guard warning into
  impact predictor status and top-level warnings.

## Validation Scope

Gate AB contract covers:

- generic modular steel floor negative: no `impact`, no
  `floorSystemEstimate`, no UBIQ/Pliteq selected source ids, impact
  outputs unsupported with a targeted missing-input warning;
- Pliteq steel-joist exact positive: `LnW 58` remains exact-source
  supported;
- UBIQ FL-32 steel bound positive: lower-bound support remains visible
  and does not become exact `Ln,w`;
- docs/current-gate alignment.

Validation completed on 2026-05-07:

- focused Gate AB contract: 1 file / 5 tests passed;
- focused floor-impact source/fallback regression: 7 files / 140 tests
  passed;
- focused Gate AA + Gate AB doc/runtime pair: 2 files / 10 tests passed;
- `pnpm --filter @dynecho/engine typecheck` passed;
- `pnpm calculator:gate:current` passed with engine 308 files / 1754
  tests, web 62 files / 275 tests plus 18 skipped, repo build, and
  whitespace guard.

Known optional `sharp/@img` Next build warnings remain non-fatal.

## Next Step

Gate AC should stop at the input/formula readiness boundary before any
new steel-floor runtime value movement. It should define the physical
input schema, formula candidates, calibration/holdout requirements, and
expected numeric corridors for source-absent steel floor impact
prediction.
