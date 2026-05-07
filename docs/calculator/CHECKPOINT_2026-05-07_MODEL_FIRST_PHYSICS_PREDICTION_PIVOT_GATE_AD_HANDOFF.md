# Checkpoint - 2026-05-07 - Model-First Physics Prediction Pivot Gate AD

## Status

Gate AD landed:

`gate_ad_steel_floor_impact_formula_numeric_corridor_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts`

Implementation surface:

- `packages/engine/src/steel-floor-impact-formula-corridor.ts`
- `packages/engine/src/impact-estimate.ts`
- `packages/engine/src/impact-lane.ts`
- `packages/shared/src/domain/impact.ts`
- `packages/engine/src/impact-confidence.ts`
- `packages/engine/src/impact-predictor-status.ts`
- `packages/engine/src/dynamic-impact.ts`
- `tools/dev/run-calculator-current-gate.ts`

Selection status:

`gate_ad_steel_floor_impact_formula_corridor_landed_selected_card_report_parity_gate_ae`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts`

Selected next action:

`gate_ae_steel_floor_formula_card_and_report_parity_plan`

## What Changed

Gate AC only made source-absent steel floors input/formula-ready. Gate
AD is the first runtime steel-floor impact formula corridor. Complete
explicit steel predictor input now selects
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`
instead of the broad floor-system family blend.

The formula corridor requires support form, carrier depth, carrier
spacing, resilient-layer dynamic stiffness, load basis, and lower ceiling
isolation/support. If any formula-critical field is missing, the runtime
does not fall through to a broad steel-family blend.

Exact measured floor-system rows still outrank the formula corridor.
Source rows are used as holdouts/calibration checks, not as the whole
calculator.

## Numeric Behavior

Pinned Gate AD source-absent open-web steel example:

- `LnW 55.6`
- `DeltaLw 22.4`
- basis:
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`
- scope: `steel_floor_formula_corridor`
- lab output basis only unless Gate Z field context is explicitly
  supplied.

The corridor stores:

- `Ln,w` estimate `55.6`, tolerance `+/-4.5 dB`
- `DeltaLw` estimate `22.4`, tolerance `+/-2.0 dB`

Same-family holdouts currently covered by the Gate AD scenario pack:

- `pliteq_steel_joist_250_rst02_vinyl_lab_2026`
- `pliteq_steel_joist_250_rst12_porcelain_lab_2026`

## Research Notes

The Gate AD `DeltaLw` part follows the existing DynEcho Annex-C style
mass-spring relation already used by the heavy floating-floor Gate W
lane: floating load mass `m'`, resilient-layer dynamic stiffness `s'`,
and the existing runtime coefficient set. Public EN/ISO 12354-2
descriptions and recent literature consistently identify `m'` and `s'`
as the governing inputs for floating-floor `DeltaLw`; the exact
coefficient variant must be rechecked against the controlled standards
packet before tightening the corridor.

Gate AD therefore deliberately keeps a tolerance corridor and holdout
comparison instead of presenting the steel formula as final standards
precision. The next useful accuracy move is to tighten this with
additional same-family steel holdouts and verified standards/INSUL-style
low-frequency behavior.

## Validation

Started from a green baseline before implementation:

- `pnpm calculator:gate:current` passed with engine 309 files / 1760
  tests, web 62 files / 275 tests plus 18 skipped, repo build, and
  whitespace guard.

Gate AD validation completed on 2026-05-07:

- focused Gate AD contract: 1 file / 6 tests passed
- focused Gate AC/Gate AD plus predictor-input regression: 3 files /
  55 tests passed
- focused impact-only fallback regression: 1 file / 102 tests passed
- `pnpm --filter @dynecho/engine typecheck` passed
- `pnpm calculator:gate:current` passed with engine 310 files / 1766
  tests, web 62 files / 275 tests plus 18 skipped, repo build, and
  whitespace guard
- Next build still emits the known non-fatal `sharp` optional `@img`
  package warnings during the DOCX import trace.
- `git diff --check` passed after this validation note update.
