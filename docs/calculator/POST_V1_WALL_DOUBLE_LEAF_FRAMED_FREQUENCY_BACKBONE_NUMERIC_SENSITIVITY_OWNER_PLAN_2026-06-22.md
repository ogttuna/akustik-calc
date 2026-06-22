# Post-V1 Wall Double-Leaf/Framed Frequency-Backbone Numeric Sensitivity Owner Plan - 2026-06-22

## Purpose

This is the selected next runtime/accuracy owner after the runtime-first
rerank following the wall double-leaf/framed leaf surface-mass
numeric-sensitivity coverage refresh. It keeps the calculator on the
owned Gate S / Gate I / Gate AR double-leaf/framed route and tightens
the calculated frequency-curve backbone that feeds lab `Rw`, `STC`,
`C`, and `Ctr` outputs.

Selected owner action:

`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_owner_plan`

Selected owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-owner-contract.test.ts`

Selected owner plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_FREQUENCY_BACKBONE_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-22.md`

Selected owner label:

`post-V1 wall double-leaf/framed frequency-backbone numeric sensitivity owner`

## Previous Rerank

Previous coverage refresh action:

`post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_landed_input_boundary_selected_runtime_first_route_family_rerank`

Previous rerank action:

`post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-coverage-refresh-contract.test.ts`

Previous rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_DOUBLE_LEAF_FRAMED_LEAF_SURFACE_MASS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_frequency_backbone_numeric_sensitivity_owner`

Selected candidate:

`wall.double_leaf_framed.frequency_backbone_numeric_sensitivity_owner`

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextRuntimeValuesMoved: 16`,
`estimatedNextAccuracyPromotedTargetOutputs: 16`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Selection Card

User construction / formula family:

- double-leaf/framed wall stacks with side A and side B leaf groups,
  explicit leaf surface masses or resolvable boards, cavity depth,
  porous damping, support topology, bridge class, support spacing, and
  the existing Gate S / Gate I / Gate AR wall airborne route.

Target outputs to improve:

- lab `Rw`, `STC`, `C`, and `Ctr` from the same calculated frequency
  curve;
- field/building companions stay downstream consumers of the direct
  element curve, not direct retune targets for this owner.

Route:

- formula-backed calculated frequency curve from `buildGateSCurve`;
- ISO 717-1 `Rw` / spectrum-adaptation adapters and ASTM E413 `STC`
  adapter over that same curve;
- no measured/source rows are required for selecting or landing this
  owner.

Required physical inputs:

- `sideALeafGroup`, `sideBLeafGroup`;
- `sideALeafMassKgM2`, `sideBLeafMassKgM2`;
- `cavity1DepthMm`;
- `flowResistivityPaSM2`;
- `absorberCoverageRatio` when supplied by advanced wall context;
- `absorberThicknessMm` when supplied by advanced wall context;
- `frameBridgeClass`, `supportTopology`, `supportSpacingMm`;
- `massAirMassResonanceHz`;
- the calculated frequency bands used by the rating adapters.

`needs_input` behavior:

- missing side-leaf grouping stays `needs_input`;
- unresolved side-leaf surface mass stays a precise `needs_input`
  boundary;
- missing or non-positive cavity depth stays `needs_input`;
- missing porous `flowResistivityPaSM2` stays `needs_input`;
- missing support spacing for the framed bridge route stays
  `needs_input`.

`unsupported` boundaries:

- `IIC`, `AIIC`, and other impact aliases remain `unsupported`;
- unowned field/building or flanking aliases are not promoted by this
  owner;
- STC must remain an ASTM E413 adapter output over the curve, not an
  alias of `Rw`;
- exact measured rows and compatible anchors keep their existing
  precedence only when construction and metric basis match.

Expected counters for the owner:

- `accuracyPromotedRequestShapes: 4`;
- `accuracyPromotedTargetOutputs: 16`;
- planned pre-implementation estimate was `runtimeFormulaRetunes: 1`,
  but the landed owner deliberately avoided hidden scalar retuning
  after the existing curve already produced coherent rating pins;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 4`;
- `runtimeValuesMoved 16`;
- `frequencyCurveBandsOwned: 76`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Landed Status

Owner status:

`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Selected next action:

`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_FREQUENCY_BACKBONE_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:

`post-V1 wall double-leaf/framed frequency-backbone numeric sensitivity coverage refresh`

Landed behavior:

- light, baseline, heavy, and asymmetric double-leaf/framed gypsum leaf
  stacks now have their calculated Gate S transmission-loss curves
  explicitly pinned as the runtime frequency backbone;
- lab `Rw`, `STC`, `C`, and `Ctr` are asserted to derive from that
  same calculated curve through ISO 717-1 and ASTM E413 adapters;
- runtime basis now exposes `calculatedFrequencyCurveShape` and the
  ISO 717-1 `C`/`Ctr` spectrum adaptation adapter as required route
  inputs alongside the existing Rw and STC adapter boundaries;
- missing flow resistivity, missing support spacing, and impact aliases
  stay outside the owner as `needs_input` or `unsupported`;
- scalar rating pins stayed numerically stable, so no hidden formula
  retune was made.

Landed counters: `accuracyPromotedRequestShapes: 4`,
`accuracyPromotedTargetOutputs: 16`, `frequencyCurveBandsOwned: 76`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 4`,
`runtimeValuesMoved 16`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Coverage Refresh Closeout

Coverage refresh status:

`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_explicit_surface_mass_leaf_scope_opener`

Coverage refresh action:

`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-coverage-refresh-contract.test.ts`

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Selected runtime scope opener after the refresh:

`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_SCOPE_OPENER_PLAN_2026-06-22.md`
/
`post-V1 wall double-leaf/framed explicit surface-mass leaf scope opener`

Runtime scope opener status:

`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_landed_runtime_selected_coverage_refresh`

Runtime scope opener selected candidate:

`wall.double_leaf_framed.explicit_surface_mass_leaf_scope_opener`

Runtime scope opener selected next:

`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Runtime scope opener counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 3`, `newCalculableTargetOutputs: 14`,
`runtimeBasisPromotions: 3`, `runtimeValuesMoved 14`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Implementation Rules

- Start from existing double-leaf/framed owner fixtures and vary the
  calculated curve shape across at least baseline, light leaf, heavy
  leaf, and asymmetric leaf-mass cases.
- Assert that `Rw`, `STC`, `C`, and `Ctr` come from one calculated
  frequency curve with frequency-band basis present.
- Keep field/building companion values tied to the same direct curve
  but do not broaden flanking or building-context ownership inside this
  slice.
- Keep all missing-input and unsupported boundaries explicit.
- Do not import source rows, do not add UI work, and do not turn this
  into a broad source crawl.

## Stop Conditions

- If the existing curve route cannot be made sensitive without breaking
  already landed physical-input pins, stop with the failing fixture and
  do not retune hidden constants.
- If a requested output is not derived from the same curve, keep it out
  of scope and document the missing adapter.
- If source evidence is needed for calibration, create a separate
  bounded calibration/holdout plan rather than importing rows here.
