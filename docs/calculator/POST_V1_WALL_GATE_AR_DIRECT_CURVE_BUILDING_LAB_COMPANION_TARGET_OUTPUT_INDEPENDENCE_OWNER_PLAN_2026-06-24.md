# Post-V1 Wall Gate AR Direct-Curve Building Lab Companion Target-Output Independence Owner Plan - 2026-06-24

Status:
`post_v1_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_owner_landed_runtime_accuracy_selected_coverage_refresh`

Owner action:
`post_v1_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_owner_plan`

## Purpose

This runtime owner closes the built-in Gate AR building-prediction
lab-companion target-output independence gap found after the
user-material double-leaf building companion owner.

A complete built-in gypsum/rockwool/gypsum double-leaf wall has an
owned direct calculated lab curve with `Rw 44`, `STC 44`, `C -1.3`,
and `Ctr -6.4`. Before this owner, the same stack in complete
`building_prediction` context showed building `R'w 38` correctly but
also surfaced `Rw/STC 38` when the user requested `Rw`, `STC`, or a
mixed `Rw + R'w` output set. That silently blurred the lab companion
and building apparent bases.

## Selection Card

- User construction / formula family: built-in gypsum board +
  rockwool + gypsum board double-leaf/framed wall with explicit
  building prediction context.
- Target outputs opened or corrected: `Rw`, `STC`, `C`, `Ctr` as lab
  companions beside `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, and
  `DnT,A,k`.
- Formula route: existing Gate AR ISO 12354 building-prediction route
  plus the existing calculated direct separating-element frequency
  curve and rating adapters.
- Required physical inputs: partition dimensions, source/receiving room
  volumes, receiving-room RT60, flanking junction class, coupling
  length, building output basis, leaf masses, cavity depth, topology,
  support spacing, and porous damping inputs.
- `needs_input` behavior: missing building room/flanking context remains
  `needs_input`.
- `unsupported` boundaries: impact aliases, source-row import,
  formula retune, field/building value changes, and catalog fallback
  promotion remain outside this owner.

## Landed Runtime Behavior

Complete Gate AR building-prediction requests now keep visible lab
companions target-output-independent from the owned direct curve:

- `Rw 44`
- `STC 44`
- `C -1.3`
- `Ctr -6.4`

The field/building outputs remain unchanged:

- `R'w 38`
- `Dn,w 39`
- `Dn,A 37.8`
- `DnT,w 41`
- `DnT,A 39.8`
- `DnT,A,k 36.7`

Single-output requests for `Rw`, `STC`, `C`, `Ctr`, `R'w`, `Dn,w`,
`Dn,A`, `DnT,w`, `DnT,A`, and `DnT,A,k` keep the supported output list
limited to the requested output while the visible companion metrics stay
on the same direct curve.

## Counters

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 3`
- `newCalculableTargetOutputs: 3`
- `requiredPhysicalInputsCaptured: 0`
- `runtimeBasisPromotions: 3`
- `runtimeValuesMoved 40`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `accuracyPromotedRequestShapes: 10`
- `targetOutputIndependentMetricSets: 10`

This is not a broad source crawl, catalog import, UI polish pass, or
formula retune.

## Follows

Previous coverage refresh action:
`post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_plan`

Previous coverage refresh file:
`packages/engine/src/post-v1-wall-user-material-double-leaf-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous coverage refresh status:
`post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh`

Previous rerank action:
`post_v1_runtime_first_rerank_after_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_plan`

Previous rerank file:
`packages/engine/src/post-v1-runtime-first-rerank-after-wall-user-material-double-leaf-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous rerank status:
`post_v1_runtime_first_rerank_after_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_owner`

Selected candidate:
`wall.gate_ar_direct_curve_building_lab_companion_target_output_independence_owner`

Selected owner label:
`post-V1 wall Gate AR direct-curve building lab-companion target-output independence owner`

Owner file:
`packages/engine/src/post-v1-wall-gate-ar-direct-curve-building-lab-companion-target-output-independence-owner-contract.test.ts`

Rerank counters:
`candidateCount: 6`, `roiAnalysisIterations: 4`, `runtimeValuesMoved 0`,
and `sourceRowsImported: 0`.

Current selected next action:
`post_v1_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_coverage_refresh_plan`

Current selected next file:
`packages/engine/src/post-v1-wall-gate-ar-direct-curve-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Current selected next plan doc:
`docs/calculator/POST_V1_WALL_GATE_AR_DIRECT_CURVE_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-24.md`

Current selected next label:
`post-V1 wall Gate AR direct-curve building lab-companion target-output independence coverage refresh`
