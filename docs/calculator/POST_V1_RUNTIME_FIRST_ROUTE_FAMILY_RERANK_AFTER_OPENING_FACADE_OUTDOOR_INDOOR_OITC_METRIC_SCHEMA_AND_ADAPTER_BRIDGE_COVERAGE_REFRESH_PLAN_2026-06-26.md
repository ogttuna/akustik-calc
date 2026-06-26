# Post-V1 Runtime-First Route-Family Rerank After Opening/Facade Outdoor-Indoor OITC Metric Schema And Adapter Bridge Coverage Refresh - 2026-06-26

Status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_floor_user_material_impact_lower_treatment_depth_owner`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan`

Rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts`

Previous coverage refresh:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan`

Previous coverage refresh status:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh`

Previous coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`, `newRequestedTargetOutputs: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected candidate:
`floor.user_material_impact_lower_treatment_depth_owner`

Selected next action:
`post_v1_floor_user_material_impact_lower_treatment_depth_owner_plan`

Selected next file:
`packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_OWNER_PLAN_2026-06-26.md`

Selected next label:
`post-V1 floor user-material impact lower-treatment depth owner`

## Purpose

The OITC schema/boundary bridge and its coverage refresh are now
protected. A direct OITC value owner is still unsafe because the current
implementation has no owned outdoor-indoor spectral OITC rating
adapter, reference contour, or rating-adapter entry. Publishing a value
now would force an alias from `STC`, `Rw`, `NISR`/`ISR`, indoor
partition field metrics, or source report rows.

Because the user explicitly prioritizes calculator scope, this rerank
does not chain another no-runtime OITC prerequisite. It selects the
highest ROI value-moving route family currently ready for a vertical
milestone: user-entered floor impact stacks with explicit
lower-treatment depth/support inputs, routed through existing owned
impact formula corridors and field adapters when their physical inputs
are present.

Counters:
`candidateCount: 9`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 3`,
`estimatedNextCalculableTargetOutputs: 4`,
`estimatedNextRequiredPhysicalInputsCaptured: 2`,
`estimatedNextRuntimeBasisPromotions: 3`,
`estimatedNextRuntimeValuesMoved: 8`,
`estimatedNextUnsupportedBoundariesProtected: 7`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

no support-only loop: this rerank moves no runtime values itself, but it
selects a runtime scope owner whose next implementation must calculate
additional floor-impact outputs or return precise `needs_input`.

## Candidate Decision

Selected:
`floor.user_material_impact_lower_treatment_depth_owner`.

Why selected:
- common visible/user-entered floor stacks already have owned impact
  formula corridors for heavy and steel families;
- the remaining gap is route input ownership: lower-treatment depth,
  lower support form, dynamic stiffness/load, and field context must be
  captured from user-entered layers and context instead of relying on
  hidden predictor input;
- the owner should increase calculable request shapes for `Ln,w`,
  `DeltaLw`, `L'n,w`, and `L'nT,w` while preserving `IIC`/`AIIC`,
  airborne, OITC, and source-row boundaries.

Rejected direct OITC runtime:
`opening.facade_outdoor_indoor_oitc_direct_spectral_runtime_owner`.
The request surface exists, but no owned OITC rating adapter exists yet.
No `STC`-to-`OITC`, `Rw`-to-`OITC`, `NISR`/`ISR`-to-`OITC`, or indoor
partition field-output alias is allowed.

Rejected OITC rating-adapter prerequisite:
`opening.facade_outdoor_indoor_oitc_rating_adapter_basis_owner`.
It is valid later, but it is another non-value-moving prerequisite. The
next selected action must prioritize calculator scope.

Rejected broad source crawl/frontend polish:
These do not directly expand physically owned calculation coverage and
would violate the current calculator-first selection rule.

## Next Selection Card

User construction / formula family:
visible user-entered floor stacks with a base floor, upper package where
present, and explicit lower treatment such as suspended ceiling,
resilient stud/furred support, ceiling cavity depth, fill, and ceiling
boards.

Target outputs to open:
`Ln,w`, `DeltaLw`, `L'n,w`, and `L'nT,w`.

Route:
use owned floor-impact formula corridors and field adapters only when
the required physical inputs are complete. Do not import source rows or
retune existing formula coefficients in this owner.

Required physical inputs:
`lowerTreatmentDepthMm`, `lowerCeilingIsolationSupportForm`,
`resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`, visible lower
ceiling/fill/board layers, and explicit `impactFieldContext` for field
outputs.

`needs_input` behavior:
missing lower-treatment depth/support, dynamic stiffness, load basis,
or field context must return precise missing physical inputs instead of
defaulting.

`unsupported` boundaries:
`IIC`/`AIIC`, airborne `Rw`/`STC`, OITC, source-row proximity
substitution, lower-treatment defaults, and field outputs without
field context remain blocked.

Expected next movement:
`newCalculableRequestShapes: 3`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 3`, and `runtimeValuesMoved: 8`.
