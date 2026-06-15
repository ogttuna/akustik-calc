# Post-V1 Floor User-Material Impact Context Field-Only Adapter Owner Plan - 2026-06-15

## North Star

DynEcho is an acoustic calculator. This slice must make the dynamic
calculator calculate more user-entered floor layer combinations without
turning lab impact values into field or ASTM aliases.

The target gap is narrow: custom visible heavy floating-floor stacks now
calculate lab `Ln,w 50.3` and `DeltaLw 24.3` from
`floorImpactContext.resilientLayerDynamicStiffnessMNm3` and
`floorImpactContext.loadBasisKgM2`. Mixed lab+field requests can already
carry those anchors through the existing field adapter. Field-only
requests for the same custom stack still do not calculate because the
field-only path does not compute the owned custom lab anchor internally.

This is not UI/UX work, broad source crawling, source-row import,
material-editor work, or formula retuning.

## Previous Rerank

Previous owner action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`

Previous owner status:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`

Previous coverage refresh action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Rerank action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`

Rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`

Rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`

Selected candidate:

`floor.user_material_impact_context_field_only_adapter_owner`

The rerank ran `roiAnalysisIterations: 4`, subtracted closed compatible
anchor-delta, direct-fixed, default-catalog double-leaf/framed,
explicit user-material, missing-topology, porous-flow, floor
dynamic-stiffness, and mixed floor field-adapter lanes, then selected
the custom floor field-only adapter owner. Counters: `candidateCount 12`,
`estimatedNextRuntimeValuesMoved: 3`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 3`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Selected Work

Selected action:

`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`

Selected file:

`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`

Selected plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_OWNER_PLAN_2026-06-15.md`

Selected label:

`post-V1 floor user-material impact context field-only adapter owner`

## Runtime Owner Scope

The owner should make field-only requests calculate for the same custom
visible heavy floating-floor stack that is already lab-owned:

- `L'n,w 52.3` from `Ln,w 50.3` plus explicit `fieldKDb 2`;
- `L'nT,w 49.9` from `L'n,w 52.3` plus receiving-room volume
  normalization at `55 m3`;
- `L'nT,50 52.9` only when `impactFieldContext.ci50_2500Db` is supplied.

The runtime should use the existing owned routes:

- lab anchor: `predictor_heavy_floating_floor_iso12354_annexc_estimate`;
- field adapter: `floor.impact_field_context.field_building_adapter`;
- field basis: `source_absent_field_building_adapter_error_budget`;
- metric bases:
  - `LPrimeNW`: `estimated_field_lprimenw_from_lnw_plus_k`;
  - `LPrimeNTw`:
    `estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume`;
  - `LPrimeNT50`:
    `estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`.

## Required Inputs

The owner may calculate only when the same physical boundary is present:

- visible floor roles include `base_structure`, `resilient_layer`, and
  a visible upper load such as `floating_screed` or `floor_covering`;
- heavy concrete carrier remains in the owned heavy-concrete density
  envelope;
- `floorImpactContext.resilientLayerDynamicStiffnessMNm3` is finite and
  positive;
- `floorImpactContext.loadBasisKgM2` is finite and positive;
- `impactFieldContext.fieldKDb`, `guideMassRatio`, or another already
  owned field-K path is present for `L'n,w`;
- `impactFieldContext.receivingRoomVolumeM3` is present for `L'nT,w`;
- `impactFieldContext.ci50_2500Db` or an already owned low-frequency
  impact owner is present for `L'nT,50`.

Missing route-required inputs must remain `needs_input`. Do not infer
dynamic stiffness, load basis, field K, receiving-room volume, or
low-frequency correction from material tags.

## Non-Goals

- Do not change the pinned mixed request values.
- Do not retune the heavy floating-floor formula.
- Do not import source rows.
- Do not promote low-density custom concrete into the heavy-concrete
  carrier route.
- Do not add building-prediction impact outputs.
- Do not alias ISO `Ln,w`, `DeltaLw`, `L'n,w`, or `L'nT,w` to ASTM
  `IIC` or `AIIC`.
- Do not touch frontend implementation files.

## Implementation Steps

1. Add the selected owner contract file and pin the current before/after
   behavior:
   - mixed `Ln,w` + field request already calculates;
   - field-only request is the selected runtime gap;
   - missing `floorImpactContext`, missing `impactFieldContext`, low
     density carrier, and ASTM aliases stay parked.
2. Inspect the floor impact path in `calculate-assembly.ts` and the
   existing `floor.impact_field_context.field_building_adapter` route.
   Reuse the same internal lab-anchor calculation already used by
   raw/open-web field-only routes.
3. Make the smallest runtime change that lets field-only custom
   context-owned heavy floating-floor requests compute their lab anchor
   internally before field adaptation.
4. Keep support arrays and trace metadata consistent:
   - field-only `targetOutputs:["L'n,w","L'nT,w","L'nT,50"]` should
     support all three when all required inputs are present;
   - missing low-frequency owner should support only `L'n,w` and
     `L'nT,w`, with `L'nT,50` remaining `needs_input`;
   - generic `IIC`/`AIIC` stay unsupported.
5. Update the current-gate runner and live handoff docs with the landed
   owner status and selected follow-up, expected to be a no-runtime
   coverage refresh.
6. Validate with the rerank test, the new owner contract, the previous
   owner/coverage refresh tests, then `pnpm calculator:gate:current`.

## Expected Counters

Expected owner counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 1`;
- `newCalculableTargetOutputs: 3`;
- `runtimeBasisPromotions: 1`;
- `runtimeValuesMoved 3`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

The expected selected next action after landing is:

`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`

with selected file:

`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`

## Landed Runtime Closeout

Owner action:

`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`

Owner file:

`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`

Owner status:

`post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh`

It follows:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`

/

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`

/

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`

Selected candidate:

`floor.user_material_impact_context_field_only_adapter_owner`

The implementation landed the narrow runtime owner. Field-only custom
visible heavy floating-floor requests now calculate `L'n,w 52.3`,
`L'nT,w 49.9`, and `L'nT,50 52.9` from the existing context-owned
`Ln,w 50.3` / `DeltaLw 24.3` anchor and explicit field inputs. Missing
field context, missing dynamic stiffness/load basis, missing
`ci50_2500Db`, generic `IIC`/`AIIC`, and low-density custom concrete
for this historical heavy-route owner remain parked. Low-density custom
concrete is opened by the later low-density floating-floor family owner.

Landed counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 1`;
- `newCalculableTargetOutputs: 3`;
- `runtimeBasisPromotions: 1`;
- `runtimeValuesMoved 3`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.

Selected next action:

`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-15.md`

## Follow-Up Coverage Refresh Closeout

The selected follow-up refresh
`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows this owner:
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`
/
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh`
and the prior rerank:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`.
It re-probes selected candidate
`floor.user_material_impact_context_field_only_adapter_owner` without
moving runtime values. Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Current selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`

Current selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`

Current selected next plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_PLAN_2026-06-15.md`
