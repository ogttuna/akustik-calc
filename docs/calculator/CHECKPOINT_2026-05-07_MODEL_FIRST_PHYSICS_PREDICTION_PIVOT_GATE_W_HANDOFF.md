# Checkpoint - 2026-05-07 - Model-First Physics Prediction Pivot Gate W

## Status

Landed:

`gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator`

Selection status:

`gate_w_floor_impact_runtime_landed_selected_next_dynamic_calculator_solver_or_field_context_gate_x`

Selected next file:

Gate X planning / contract file for the next Dynamic Calculator solver
or field-context boundary is the next selection item.

Selected next action:

`gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary`

## What Changed

- Added the Gate W floor-impact runtime contract:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`.
- Promoted only the complete Dynamic Calculator ISO 717-2 lab impact
  lane for resilient heavy floating-floor `Ln,w` / `DeltaLw` requests.
- Carried `loadBasisKgM2` from Dynamic Calculator floor context into the
  impact predictor input so the heavy floating-floor estimate uses the
  owned load basis instead of an implicit guess.
- Added `estimateImpactFromPredictorInput` so the runtime lane can
  compute the existing bare-slab, `DeltaLw`, resonance, and `LnW`
  equations directly from complete predictor input.
- Kept field impact outputs (`L'n,w`, `L'nT,w`) separate from lab
  `Ln,w` / `DeltaLw`, and kept ASTM `IIC` / `AIIC` blocked until an
  ASTM E989 adapter owner exists.
- Suppressed unready unmeasured Dynamic Calculator floor-impact runtime
  candidates when the user requests impact outputs but the required
  physical inputs are missing.
- Passed `floorImpactContext` through the estimate API route and shared
  estimate schema so UI/workbench callers can provide the same owned
  physical inputs as the engine contract.

## Runtime Pins

The promoted complete scenario is a 150 mm reinforced-concrete base slab,
8 mm resilient layer, 30 mm screed, and 8 mm ceramic finish with
`loadBasisKgM2: 76` and `resilientLayerDynamicStiffnessMNm3: 30`.

Expected promoted lab impact values:

- `DeltaLw 24.3`
- `LnW 50.3`
- basis `predictor_heavy_floating_floor_iso12354_annexc_estimate`
- selected origin `family_physics_prediction`
- support bucket `family_physics_prediction`

## Boundaries Captured

Gate W adds positive and nearby-negative coverage for:

- complete Dynamic Calculator lab `Ln,w` / `DeltaLw` runtime promotion;
- missing `loadBasisKgM2` staying `needs_input`;
- missing catalog and user context dynamic stiffness staying
  `needs_input`;
- user-entered `resilientLayerDynamicStiffnessMNm3` filling a missing
  catalog property;
- safe role-defined floor reorders keeping the same promoted values;
- field impact outputs remaining blocked behind room/context ownership;
- ASTM `IIC` / `AIIC` remaining unsupported behind adapter ownership;
- current docs and `pnpm calculator:gate:current` runner alignment.

## Validation

- Focused Gate W passed: 1 file / 6 tests.
- Focused Gate V regression passed: 1 file / 6 tests.
- Gate J/K regressions passed after updating the old floor-output
  expectations to the Gate W `needs_input` boundary: 2 files / 16 tests.
- `pnpm --filter @dynecho/engine typecheck` passed.
- `pnpm calculator:gate:current` passed: engine 303 files / 1728 tests,
  web 62 files / 275 tests plus 18 skipped, repo build, and whitespace
  guard.
- `pnpm check` passed: lint, typecheck, full tests, and build. Full
  engine tests passed 428 files / 2530 tests; full web tests passed 168
  files / 950 tests plus 18 skipped. The known optional
  `sharp/@img` warnings appeared during cached Next build replay and the
  build still completed successfully.
- `git diff --check` passed.

## Next Step

Gate X should choose the next Dynamic Calculator solver or
field-context boundary after Gate W. The decision should compare the
remaining high-impact gaps instead of defaulting to more finite source
rows: field/building impact adapters, generalized floor-impact input
surfacing, double/framed calibration, multi-cavity expansion, and any
solver family whose missing physical inputs can now be made explicit.
