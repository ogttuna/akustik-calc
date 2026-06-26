# Post-V1 Runtime-First Route-Family Rerank After Opening/Facade Door/Window Building Lab-Companion Coverage Refresh - 2026-06-25

Status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_indoor_field_building_adapter_owner`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_plan`

Selected by:
`post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_plan`

Previous coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous coverage refresh status:
`post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh`

Previous coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Previous owner:
`post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_owner_plan`

Selected rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected rerank label:
`post-V1 runtime-first route-family rerank after opening/facade door/window building lab-companion target-output independence coverage refresh`

Selected next action:
`post_v1_opening_facade_door_window_indoor_field_building_adapter_owner_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-25.md`

Selected next label:
`post-V1 opening/facade door/window indoor field/building adapter owner`

## Rerank Result

The selected candidate is
`opening.facade_door_window_indoor_field_building_adapter_owner`.
The current implementation already owns the opening/leak field/building
area-energy runtime corridor with explicit panel area, receiving-room
volume, reverberation time, field flanking, building junction/flanking,
room normalization, and A-weighted `Dn,A` / `DnT,A` adapter terms.
The door/window/facade boundary was correctly preventing broad facade
promotion; however, complete `facadeOutdoorContext:
indoor_partition` field/building requests now have the physical inputs
needed to call that existing runtime without copying lab `Rw` / `STC`.

Expected next runtime owner scope:

- complete indoor partition door/window/facade `field_between_rooms`
  outputs: `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`;
- complete indoor partition door/window/facade `building_prediction`
  outputs: `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, and companion
  `DnT,A,k` when the owned building `DnT,A` value exists;
- mixed lab + field/building requests keep `Rw 38.2` and `STC 39` as
  lab companions while the field/building metrics remain on the
  field/building runtime basis;
- outdoor-indoor facade/OITC, missing frequency input, scalar STC
  opening ratings, impact aliases, source-row imports, broad facade
  prediction, and formula retunes remain blocked.

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 4`,
`estimatedNextCalculableTargetOutputs: 6`,
`estimatedNextRequiredPhysicalInputsCaptured: 0`,
`estimatedNextRuntimeBasisPromotions: 4`,
`estimatedNextRuntimeValuesMoved: 22`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This closes the support refresh with no support-only loop.

## Candidate Decisions

- Selected:
  `opening.facade_door_window_indoor_field_building_adapter_owner`,
  because it moves runtime calculator values through an already owned
  field/building physics corridor and directly widens openings/facades.
- Rejected stale repeat:
  `opening.facade_door_window_building_lab_companion_target_output_independence_owner`,
  because the lab companion owner and coverage refresh have already
  landed.
- Rejected missing adapter:
  `opening.facade_outdoor_indoor_oitc_runtime_owner`, because no OITC
  output schema or outdoor-indoor spectral adapter is owned yet.
- Rejected alias:
  `opening.stc_single_number_scalar_rating_owner`, because Gate AH owns
  STC only from a shifted spectrum, not scalar opening STC input.
- Rejected holdout retune:
  `opening.common_wall_same_basis_holdout_retune`, because the local
  holdout packet did not admit a same-basis retune.
- Rejected support lane:
  broad source crawling or frontend input polish, because the current
  no-runtime refresh must be followed by a runtime owner, not a
  support-only loop.

## Non-Goals

- No broad source crawl.
- This is not a broad source crawl.
- No product catalog import.
- No source-row import.
- No formula retune inside the rerank.
- No runtime value movement inside the rerank.
- No outdoor-indoor/OITC shortcut.
- No impact metric fallback.
- No support-only loop after the coverage refresh.
