# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate I

Slice:
`calculator_model_first_physics_prediction_pivot_v1`

Gate landed:
`gate_i_expand_family_material_properties_and_benchmark_scenarios`

Selection status:
`gate_i_family_material_properties_and_benchmark_scenarios_landed_no_runtime_selected_personal_use_readiness_gate_j`

Selected next file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts`

Selected next action:
`gate_j_build_personal_use_readiness_scenario_pack`

## Summary

Gate I lands the material-property widening contract needed before
broader family physics can move safely. It does not move runtime
calculator values. The goal is to stop future one-off solver expansions
from silently using sparse material rows without a basis, uncertainty
posture, positive benchmark, and nearby negative case.

Implemented surfaces:

- `packages/shared/src/domain/material.ts`
  - adds optional `acoustic` material properties:
    behaviour, Young's modulus, Poisson ratio, loss factor, flow
    resistivity, porosity, and property source status.
- `packages/catalogs/src/materials/seed-materials.ts`
  - adds nominal engineering defaults for common materials used by the
    first readiness matrix: concrete, gypsum boards, AAC, CLT, screed,
    mineral plaster, MLV, Rockwool/glasswool, air gap, and resilient
    underlay.
  - these defaults are explicitly not source-owned exact rows.
- `packages/engine/src/airborne-family-material-expansion.ts`
  - defines M8 benchmark/readiness scenarios for single-leaf,
    double/framed, triple-leaf, lined masonry, CLT/mass timber, and
    floating-floor routes.
  - required material-property gaps return `needs_input`.
  - optional precision gaps return `complete_with_defaults` with an
    error-budget adjustment.
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`
  - makes the Gate I posture executable.

## Runtime Boundary

Runtime values stay frozen. The protected grouped Rockwool result remains
lab `Rw 50 / STC 55 / C 0.8 / Ctr -7.3` as uncalibrated
`family_physics_prediction`, and the ambiguous flat-list triple-leaf path
remains guarded at diagnostic `Rw 41` with unsupported target outputs.

Nominal material properties may support uncalibrated or bounded physics
with visible uncertainty. They do not permit measured-exact,
source-validated, or calibrated-family promotion. Source promotion still
must pass through the Gate H policy with rights-safe evidence,
topology/material/metric/tolerance owners, paired positive/negative
tests, and holdout metadata.

## Validation

Validation completed in this working tree:

- pre-change `pnpm calculator:gate:current` passed with engine 288 files
  / 1632 tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- `pnpm --filter @dynecho/shared typecheck` passed.
- `pnpm --filter @dynecho/engine typecheck` passed.
- `pnpm --filter @dynecho/shared lint` passed.
- `pnpm --filter @dynecho/engine lint` passed.
- `pnpm --filter @dynecho/catalogs lint` passed.
- `pnpm --filter @dynecho/catalogs typecheck` passed.
- focused Gate I passed 1 file / 7 tests.
- Gate A/B/C/D/E/G/H/I pivot continuity passed 8 files / 52 tests.
- final `pnpm calculator:gate:current` passed with engine 289 files /
  1639 tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- `git diff --check` passed.

The known non-fatal `sharp` optional dependency warning still appears
during the web build. `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after the Next build side effect.

## Next Step

Gate J should build the personal-use readiness scenario pack. It should
combine wall/floor, exact source, anchored delta, uncalibrated
prediction, calibrated prediction, field continuation, `needs_input`,
unsupported, hostile input, visible-card, saved/replayed scenario, and
report parity assertions.
