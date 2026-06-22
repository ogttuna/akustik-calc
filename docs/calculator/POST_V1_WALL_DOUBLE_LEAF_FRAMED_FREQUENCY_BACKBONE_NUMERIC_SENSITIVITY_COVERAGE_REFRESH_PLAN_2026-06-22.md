# Post-V1 Wall Double-Leaf/Framed Frequency-Backbone Numeric Sensitivity Coverage Refresh Plan - 2026-06-22

Status:
`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_explicit_surface_mass_leaf_scope_opener`

Closeout:
the coverage refresh landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-coverage-refresh-contract.test.ts`
with `coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Selected next runtime scope opener:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_SCOPE_OPENER_PLAN_2026-06-22.md`
/
`post-V1 wall double-leaf/framed explicit surface-mass leaf scope opener`.

Runtime scope opener closeout:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_landed_runtime_selected_coverage_refresh`
with selected candidate
`wall.double_leaf_framed.explicit_surface_mass_leaf_scope_opener`.
It opened `surfaceMassKgM2` side-leaf stacks and selected
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_COVERAGE_REFRESH_PLAN_2026-06-22.md`.
Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 3`, `newCalculableTargetOutputs: 14`,
`runtimeBasisPromotions: 3`, `runtimeValuesMoved 14`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Purpose

This is the selected next no-runtime coverage refresh after the wall
double-leaf/framed frequency-backbone numeric-sensitivity owner landed.
It re-probes the bounded Gate S / Gate I / Gate AR double-leaf/framed
route so the newly explicit calculated frequency-curve backbone and
rating-adapter basis cannot regress.

Selected coverage refresh action:

`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_plan`

Selected coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_FREQUENCY_BACKBONE_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:

`post-V1 wall double-leaf/framed frequency-backbone numeric sensitivity coverage refresh`

## Previous Owner

Previous owner action:

`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-owner-contract.test.ts`

Previous owner plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_FREQUENCY_BACKBONE_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-22.md`

Previous owner status:

`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Previous owner selected candidate:

`wall.double_leaf_framed.frequency_backbone_numeric_sensitivity_owner`

Previous owner follows rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_frequency_backbone_numeric_sensitivity_owner`

The owner made the calculated Gate S frequency backbone an explicit
runtime basis for lab `Rw`, `STC`, `C`, and `Ctr` across light,
baseline, heavy, and asymmetric double-leaf/framed gypsum leaf stacks.
It pinned 76 frequency-band values across those four request shapes and
asserted that `Rw`, `STC`, `C`, and `Ctr` are derived from the same
calculated curve. Scalar rating pins stayed numerically stable; no
hidden formula retune was made.

Owner counters: `accuracyPromotedRequestShapes: 4`,
`accuracyPromotedTargetOutputs: 16`, `frequencyCurveBandsOwned: 76`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 4`,
`runtimeValuesMoved 16`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Selection Card

User construction / formula family:

- double-leaf/framed wall stacks with side A and side B gypsum leaf
  groups, explicit cavity depth, porous damping, independent-frame
  support topology, and support spacing.

Target outputs to protect:

- lab `Rw`, `STC`, `C`, and `Ctr` over the same calculated frequency
  curve;
- route basis fields `frequencyBands`, `calculatedFrequencyCurveShape`,
  ISO 717-1 rating inputs, ISO 717-1 spectrum adaptation inputs, and
  ASTM E413 STC adapter boundary.

Route:

- existing Gate S calculated transmission-loss curve;
- existing `buildRatingsFromCurve` ISO 717-1 / ASTM E413 adapters;
- no measured/source rows and no UI work.

Required physical inputs:

- `sideALeafGroup`, `sideBLeafGroup`;
- `sideALeafMassKgM2`, `sideBLeafMassKgM2`;
- `cavity1DepthMm`;
- `flowResistivityPaSM2`;
- `absorberCoverageRatio` and `absorberThicknessMm` when supplied by
  advanced wall context;
- `frameBridgeClass`, `supportTopology`, `supportSpacingMm`;
- `massAirMassResonanceHz`, `bridgeCouplingDeltaDb`,
  `porousCavityDampingCreditDb`;
- `calculatedFrequencyCurveShape`, ISO 717-1 `Rw` adapter, ISO 717-1
  `C`/`Ctr` spectrum adapter, and ASTM E413 `STC` adapter boundary.

`needs_input` behavior:

- missing side-leaf grouping stays `needs_input`;
- unresolved side-leaf surface mass stays `needs_input`;
- missing or non-positive cavity depth stays `needs_input`;
- missing porous `flowResistivityPaSM2` stays `needs_input`;
- missing support spacing for the framed bridge route stays
  `needs_input`.

`unsupported` boundaries:

- `IIC`, `AIIC`, and other impact aliases remain `unsupported`;
- STC remains an ASTM E413 adapter output over the curve, not an alias
  of `Rw`;
- field/building/flanking aliases are not broadened by this refresh;
- exact measured rows and compatible anchors keep their existing
  precedence only when construction and metric basis match.

Expected counters for the refresh:

- `coverageRefreshContractFilesTouched: 1`;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Implementation Rules

- Re-probe the four owner request shapes: light, baseline, heavy, and
  asymmetric double-leaf/framed gypsum leaf stacks.
- Re-assert the calculated frequency bands and representative
  transmission-loss values.
- Re-assert that `Rw`, `STC`, `C`, and `Ctr` derive from the same curve.
- Re-assert missing input and unsupported impact boundaries.
- Add the refresh file to `tools/dev/run-calculator-current-gate.ts`
  after it lands.
- Do not retune formulas, import source rows, add UI work, or turn this
  into a broad source crawl.
