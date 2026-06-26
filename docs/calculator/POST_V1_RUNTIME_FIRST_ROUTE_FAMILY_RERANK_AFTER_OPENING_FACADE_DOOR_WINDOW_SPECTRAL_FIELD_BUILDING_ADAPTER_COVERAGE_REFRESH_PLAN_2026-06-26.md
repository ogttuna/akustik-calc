# Post-V1 Runtime-First Route-Family Rerank After Opening/Facade Door/Window Spectral Field/Building Adapter Coverage Refresh Plan - 2026-06-26

Status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_landed_no_runtime_selected_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan`

Selected by:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan`

Previous owner:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_owner_plan`

Previous owner file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-owner-contract.test.ts`

Previous owner status:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-coverage-refresh-contract.test.ts`

Previous coverage refresh status:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh`

Rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-spectral-field-building-adapter-coverage-refresh-contract.test.ts`

Rerank counters:
`candidateCount: 9`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 0`,
`estimatedNextCalculableTargetOutputs: 0`,
`estimatedNextRequiredPhysicalInputsCaptured: 0`,
`estimatedNextRuntimeBasisPromotions: 0`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedNextTargetOutputSurfacePromotions: 1`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next action:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_PLAN_2026-06-26.md`

Selected next label:
`post-V1 opening/facade outdoor-indoor OITC metric schema and adapter bridge owner`

## Purpose

Run a fresh runtime-first route-family rerank after the spectral
field/building adapter coverage refresh. The refresh is support work;
the rerank must select the next owner by calculator scope, target output
coverage, physical input capture, basis integrity, and runtime value
movement.

Selected owner:
`opening.facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner`.
The direct OITC runtime is intentionally not selected yet because the
current schema cannot safely represent OITC without a first-class
requested output and boundary. The selected owner opens that metric
surface while keeping `STC`, `Rw`, `NISR`/`ISR`, indoor `DnT,w`, and
source report rows from being used as aliases. This is no support-only
loop: it selects an input-surface calculator behavior required before
any valid outdoor-indoor OITC runtime can land.

## Protected Baseline

- Complete curve-only indoor partition field requests calculate
  `R'w 44.2`, `Dn,w 44.5`, `Dn,A 43.7`, `DnT,w 44.7`, and
  `DnT,A 43.9`.
- Complete curve-only indoor partition building requests calculate
  `R'w 39.4`, `Dn,w 39.7`, `Dn,A 38.9`, `DnT,w 39.9`,
  `DnT,A 39.1`, and `DnT,A,k 38.2`.
- The basis remains
  `post_v1_opening_facade_door_window_spectral_field_building_adapter_owner`
  with `curveBasis: calculated_frequency_curve`.
- Missing building context remains `needs_input`.
- Outdoor-indoor facade/OITC, impact aliases, scalar STC-to-Rw
  shortcuts, source-row imports, and direct lab-curve copying remain
  blocked.

## Candidate Focus

The rerank must compare at least:

- outdoor-indoor facade/OITC schema and adapter readiness;
- remaining opening/facade door/window C/Ctr lab-only gaps;
- user-material opening element input model depth;
- floor-impact user-material depth, including lower-treatment,
  field/building, ASTM, and calibration/holdout candidates;
- ceiling/facade first-class route ownership;
- support-only candidates, which must lose when a safe runtime owner is
  available.

Rerank result:

- Selected
  `opening.facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner`
  because it opens the missing `OITC` target-output surface and blocks
  facade/OITC aliases before a later spectral runtime adapter.
- Rejected direct OITC runtime because it would be unsafe before OITC is
  a first-class requested output with a protected facade boundary.
- Rejected `NISR`/`ISR` reuse because those metrics cannot stand in for
  facade OITC.
- Rejected stale spectral field/building owner repeats because the
  runtime owner and coverage refresh are already landed.
- Deferred floor-impact user-material depth and first-class ceiling
  route owners to the next global rerank after the OITC schema bridge,
  rather than leaving the current opening/facade chain with an
  unrepresentable target output.
- Rejected broad source crawl, frontend polish, and docs-only loops.

## Acceptance Criteria

- The selected candidate is current-state based and not a stale landed
  owner.
- The selection card names construction/family, target outputs, route,
  required inputs, `needs_input`, unsupported boundaries, and expected
  calculator counters.
- No runtime values move in the rerank contract.
- No source rows are imported.
- No frontend files are touched.
- No broad source crawl or docs-only loop is selected when a safe
  runtime owner exists.

The selected owner is an input-surface owner, not a runtime formula. It
must make `OITC` requestable and route it to explicit `unsupported` or
`needs_input`; it must not calculate OITC until a separate
outdoor-indoor spectral rating adapter owns the standard and formula.

This rerank is not broad source crawl, formula retune, or frontend work.
It has no support-only loop.
