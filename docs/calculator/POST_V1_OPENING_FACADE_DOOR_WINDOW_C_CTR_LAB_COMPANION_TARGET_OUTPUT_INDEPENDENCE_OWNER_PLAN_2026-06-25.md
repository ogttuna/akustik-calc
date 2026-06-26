# Post-V1 Opening/Facade Door/Window C/Ctr Lab-Companion Target-Output Independence Owner Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner_landed_runtime_basis_selected_coverage_refresh`

Owner action:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner_plan`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_plan`

Rerank trigger coverage action:
`post_v1_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_plan`

Selected rerank status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner`

Selected rerank estimated counter:
`estimatedNextRuntimeValuesMoved: 8`; no support-only loop.

Owner file:
`packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-owner-contract.test.ts`

Selected candidate:
`opening.facade_door_window_c_ctr_lab_companion_target_output_independence_owner`

Selected owner label:
`post-V1 opening/facade door/window C/Ctr lab-companion target-output independence owner`

Selected next action:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Selected next label:
`post-V1 opening/facade door/window C/Ctr lab-companion target-output independence coverage refresh`

Coverage refresh landed status:
`post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh`

Coverage refresh landed next:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan`

Coverage refresh landed file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Coverage refresh landed counters:
`coverageRefreshContractFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`; not a broad
source crawl.

## Selection Card

User construction / formula family:
complete indoor partition door/window/facade opening in a host wall,
with explicit host wall area, opening area, opening element `Rw`,
element type, frequency/rating basis, seal/leakage class, and complete
field/building context when the request is made from those contexts.

Target outputs opened:
`C` and `Ctr` as lab companions for complete indoor
`field_between_rooms` and `building_prediction` door/window/facade
requests. Mixed requests keep `Rw 38.2`, `STC 39`, `C -1.6`, and
`Ctr -6.3` basis-separated from field/building values.

Route:
the owner clones the complete indoor field/building request to an
`element_lab` context, runs the owned Gate S opening/leak composite
area-energy route to calculate the opening loss, applies that loss to
the host-wall transmission-loss curve, and reads `C`/`Ctr` from the
ISO 717-1 spectrum rating. It is an owned runtime/formula route, not a
source-row import, source catalog lookup, formula retune, or lab-to-field
copy.

Required physical inputs:
`hostWallAreaM2`, `openingLeakElements`, opening area, element `Rw`,
element type, frequency band set or rating basis, seal/leakage class,
and `facadeOutdoorContext: indoor_partition`. Existing field/building
requests must still provide their field/building context for those
outputs; C/Ctr remain lab companions.

`needs_input` behavior:
missing opening frequency/rating basis remains
`openingFrequencyBandsOrRatingBasis` `needs_input`. The owner does not
bypass the existing frequency-input boundary.

`unsupported` boundaries:
field/building `C`/`Ctr` aliases, outdoor-indoor facade prediction,
`OITC`, scalar STC rating shortcuts, broad facade prediction,
source-row imports, formula retunes, and impact aliases remain blocked.

Expected counters:
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 2`, `requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 4`, `runtimeValuesMoved 8`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 7`.

## Landed Runtime Behavior

Complete indoor field/building door/window/facade requests now support
request-scoped `C` and `Ctr` lab companions. C/Ctr-only requests return
`C -1.6` and `Ctr -6.3` on the Gate S shifted ISO 717-1 lab spectrum
basis. Single-output requests keep support narrow, so a `C` request
does not claim `Ctr` as a supported target.

Mixed lab requests keep `Rw 38.2`, `STC 39`, `C -1.6`, and
`Ctr -6.3` visible as lab companions. Mixed field/building requests
keep field/building values on the opening/leak field/building runtime
basis: `R'w 31.6`, `Dn,w 31.9`, `Dn,A 31.1`, `DnT,w 32.1`,
`DnT,A 31.3`, and `DnT,A,k 30.4`, while `C -1.6` and `Ctr -6.3`
remain lab companions.

Missing frequency/rating basis remains `needs_input`. Outdoor-indoor
facade/OITC, scalar STC ratings, source imports, broad catalog crawl,
formula retunes, frontend work, and impact aliases remain outside this
owner. This is not a broad source crawl.
