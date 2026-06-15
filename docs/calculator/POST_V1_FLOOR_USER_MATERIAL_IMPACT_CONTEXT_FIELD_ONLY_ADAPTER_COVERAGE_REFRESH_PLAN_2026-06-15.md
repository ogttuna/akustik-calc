# Post-V1 Floor User-Material Impact Context Field-Only Adapter Coverage Refresh Plan - 2026-06-15

## North Star

DynEcho is an acoustic calculator. This refresh protects the newly
landed custom floor field-only impact route without widening into UI,
source crawling, formula retuning, or ASTM aliasing.

The landed owner lets a custom visible heavy floating-floor stack use
the already-owned context lab anchor internally for field-only requests:
`L'n,w 52.3`, `L'nT,w 49.9`, and `L'nT,50 52.9` from `Ln,w 50.3`,
`DeltaLw 24.3`, explicit `fieldKDb 2`, receiving-room volume `55 m3`,
and `impactFieldContext.ci50_2500Db 3`.

## Previous Runtime Owner

Previous rerank action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`

Owner action:

`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`

Owner file:

`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`

Owner status:

`post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`floor.user_material_impact_context_field_only_adapter_owner`

The owner opened one request shape and three field impact target
outputs without importing source rows or changing the heavy floating
floor formula. Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Selected Work

Selected action:

`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`

Selected file:

`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`

Selected plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-15.md`

Selected label:

`post-V1 floor user-material impact context field-only adapter coverage refresh`

## Refresh Scope

Re-probe the owner without moving runtime values:

- field-only custom heavy floating-floor stack supports `L'n,w 52.3`,
  `L'nT,w 49.9`, and `L'nT,50 52.9`;
- mixed lab+field request still supports `Ln,w 50.3`, `DeltaLw 24.3`,
  and the same field values;
- missing `impactFieldContext` stays `needs_input`;
- missing `floorImpactContext.resilientLayerDynamicStiffnessMNm3` or
  `floorImpactContext.loadBasisKgM2` stays `needs_input`;
- missing `ci50_2500Db` leaves only `L'nT,50` unsupported;
- low-density custom concrete remains outside the heavy-concrete
  carrier route;
- generic `IIC` / `AIIC` remain unsupported.

## Non-Goals

- Do not retune `predictor_heavy_floating_floor_iso12354_annexc_estimate`.
- Do not import source rows.
- Do not add building-prediction impact outputs.
- Do not infer field K, receiving-room volume, CI, dynamic stiffness,
  or load basis from tags.
- Do not touch frontend implementation files.

## Implementation Steps

1. Add the coverage refresh contract and pin the landed owner values.
2. Verify missing-input and unsupported boundaries remain exact.
3. Update the live handoff docs and current gate runner.
4. Select the next numeric coverage gap only after subtracting this
   closed field-only route.
5. Validate with the owner, refresh, prior floor dynamic-stiffness
   owner/refresh, rerank contract, and `pnpm calculator:gate:current`.

## Expected Counters

Expected refresh counters:

- `coverageRefreshContractFilesTouched: 1`;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Landed No-Runtime Closeout

Coverage refresh action:

`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

It follows:

`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`

/

`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`

/

`post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh`

and:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`

/

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`

/

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`

Selected candidate:

`floor.user_material_impact_context_field_only_adapter_owner`

The refresh re-probes field-only custom heavy floating-floor impact
values at `L'n,w 52.3`, `L'nT,w 49.9`, and `L'nT,50 52.9`; mixed
lab+field requests still publish `Ln,w 50.3` and `DeltaLw 24.3`.
Missing field context, missing dynamic stiffness/load basis, missing
`ci50_2500Db`, generic `IIC`/`AIIC`, and low-density custom concrete
for this historical heavy-route owner remain parked. Low-density custom
concrete is opened by the later low-density floating-floor family owner.
This is not a broad source crawl.

Closeout counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_PLAN_2026-06-15.md`
