# Post-V1 Wall Double-Leaf/Framed Cavity-Depth Numeric Sensitivity Coverage Refresh - 2026-06-20

## Purpose

This no-runtime coverage refresh follows the cavity-depth numeric
sensitivity runtime owner. Its job is to re-probe the landed behavior
without changing formulas: topology `cavity1DepthMm` remains
depth-sensitive, and advanced-only `advancedWall.cavities[0].depthMm`
continues to feed the owned Gate S / Gate I / Gate AR double-leaf/framed
formula route.

This is the immediate next step because the previous owner moved real
runtime coverage. Before selecting another owner, the new calculable
advanced-only cavity-depth surface must be locked into the current gate
as a regression boundary. This is not intended to displace the next
value-moving calculator slice; it is a short stabilization step that
keeps the just-landed calculator improvement from being lost.

Coverage refresh action:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts`

Current implementation status:

- The preceding owner file exists and is included in the current
  calculator gate.
- This coverage-refresh file does not exist yet.
- Latest full `pnpm calculator:gate:current` after the owner landed
  passed: shared `2 files / 19 tests`, engine `787 files / 4318 tests`,
  web `127 files / 505 passed + 18 skipped`, and repo build `5/5`.

Previous owner:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Previous refresh:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_cavity_depth_numeric_sensitivity_owner`

Selected candidate re-probed:

`wall.double_leaf_framed.cavity_depth_numeric_sensitivity_owner`

## Refresh Scope

- Re-probe topology depth values `60`, `90`, and `140 mm` for lab
  `Rw`, `STC`, `C`, and `Ctr`.
- Re-probe advanced-only `advancedWall.cavities[0].depthMm` with
  topology depth omitted, including lab, field, and building contexts.
- Re-probe `needs_input` boundaries for missing and non-positive cavity
  depth.
- Re-probe the topology-authoritative boundary when topology and
  advanced cavity depth are both supplied but differ.
- Re-probe `unsupported` impact aliases such as `IIC` and `AIIC`.
- Keep source rows, formula coefficients, frontend files, and route
  family selection unchanged.

## Implementation Steps

1. Create
   `packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts`
   by re-probing the landed owner through public calculator/runtime
   surfaces, not by changing route logic.
2. Assert the three topology-depth values still produce distinct
   expected lab outputs, so `cavity1DepthMm` remains numerically active.
3. Assert advanced-only `advancedWall.cavities[0].depthMm` still
   calculates lab, field, and building outputs through the owned Gate S /
   Gate I / Gate AR route.
4. Assert missing, zero, and negative cavity depth stay `needs_input`
   with precise physical-input prompts.
5. Assert topology depth remains authoritative when topology and
   advanced cavity depth differ, and that mismatch does not invent extra
   porous-thickness precision.
6. Assert `IIC` and `AIIC` remain `unsupported`, not aliased from
   airborne values.
7. Add the coverage-refresh file to `tools/dev/run-calculator-current-gate.ts`
   immediately after the owner file.
8. Run the targeted owner + coverage-refresh tests, then run
   `pnpm calculator:gate:current`.

## Stop Conditions

- Do not retune formulas in this refresh.
- Do not import source rows.
- Do not touch frontend files.
- Do not promote new target outputs beyond those already landed by the
  owner.
- If the re-probe shows a real runtime regression, fix only the
  regression that breaks the landed owner contract; otherwise keep this
  refresh no-runtime.

## Next After This Refresh

After this coverage refresh lands, return immediately to a
runtime-first route-family rerank. The next selected work should be a
value-moving calculator slice, preferably in user-material physical
input coverage unless the rerank proves a higher-confidence runtime
candidate elsewhere. The rerank must compare candidate families by
calculator scope and accuracy impact, not by documentation volume.

Expected next-rerank priority order:

- user-material physical input coverage that opens additional
  source-absent wall/floor combinations through owned formulas;
- building prediction / flanking runtime only where lab-to-field basis
  terms are physically owned;
- frequency-band backbone work when it unlocks curve-derived companion
  metrics rather than scalar aliases;
- companion metric completeness only when the route already owns the
  basis and spectrum/rating data;
- calibration or holdout packets only when they tighten an existing
  formula family;
- named residual families such as opening/leak, common-wall, and
  open-web/open-box only when an owned formula or same-basis anchor is
  available.

The rerank should explicitly reject broad source crawling, UI polish,
confidence-copy cleanup, and docs-only work unless they are a direct
prerequisite for the selected calculator runtime owner.

## Landed Owner Summary

The owner protects topology `cavity1DepthMm` sensitivity and opens the
same owned formula route when only `advancedWall.cavities[0].depthMm` is
supplied. It publishes advanced-only lab `Rw`/`STC`/`C`/`Ctr` plus
field/building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`. Counters:
`accuracyPromotedRequestShapes: 6`, `accuracyPromotedTargetOutputs:
26`, `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 3`,
`newCalculableTargetOutputs: 13`, `runtimeBasisPromotions: 3`,
`runtimeValuesMoved 13`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Expected Refresh Counters

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Coverage Refresh Closeout

Coverage refresh status:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

The refresh landed as a no-runtime regression boundary. It re-probes
topology `cavity1DepthMm = 60`, `90`, and `140 mm`; advanced-only
`advancedWall.cavities[0].depthMm` lab, field, and building outputs;
missing, zero, and negative cavity depth as precise `needs_input`;
topology-authoritative mismatch behavior; and `IIC` / `AIIC` as
`unsupported`. It does not retune formulas, import source rows, touch
frontend files, or broaden the source crawl. This is not a broad source
crawl.

Coverage counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Current Selected Next

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:

`post-V1 runtime-first route-family rerank after wall double-leaf/framed cavity-depth numeric sensitivity coverage refresh`
