# Post-V1 Next Numeric Coverage Gap After Floor User-Material Low-Density Floating-Floor Family Plan - 2026-06-15

## North Star

DynEcho is an acoustic calculator. This is the bounded no-runtime
selection step after the low-density user-material floor coverage
refresh: subtract the newly closed custom low-density floating-floor
route, then choose the next highest-ROI numeric gap that improves
calculator scope, numeric accuracy, formula-route ownership, required
input capture, or metric/basis boundaries.

This is not a broad source crawl, UI polish pass, material-editor task,
library cleanup, formula retune without evidence, or metric aliasing
shortcut.

## Previous Chain

Previous rerank action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner`

Previous owner action:

`post_v1_floor_user_material_low_density_floating_floor_family_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts`

Previous owner status:

`post_v1_floor_user_material_low_density_floating_floor_family_owner_landed_runtime_selected_coverage_refresh`

Previous selected candidate:

`floor.user_material_low_density_floating_floor_family_owner`

Coverage refresh action:

`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

## Closed Route To Subtract

The refresh re-probes custom visible low-density concrete floating-floor
requests without moving runtime values. With
`floorImpactContext.resilientLayerDynamicStiffnessMNm3: 30`,
`floorImpactContext.loadBasisKgM2: 76`, `impactFieldContext.fieldKDb:
2`, receiving-room volume `55 m3`, and `ci50_2500Db: 3`, the route
supports `Rw 53`, `Ln,w 64.3`, `DeltaLw 24.3`, `L'n,w 66.3`,
`L'nT,w 63.9`, and `L'nT,50 66.9` through the existing lightweight-
concrete family, DeltaLw, and field-adapter corridors.

Refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Rerank Instructions

Run at least three ROI passes before selecting a runtime owner,
input-surface owner, evidence acquisition slice, or boundary owner. In
each pass, remove closed lanes first:

- compatible anchor-delta wall companions and field/building adapters;
- direct-fixed double-leaf/framed lab, field, building, and A-weighted
  lanes already owned by Gate EO, Gate I, and Gate AR;
- default-catalog and explicit user-material double-leaf/framed route
  input lanes;
- user-material missing-topology input-surface ownership;
- user-material porous flow-resistivity input ownership;
- floor user-material impact-context dynamic-stiffness ownership;
- custom heavy floating-floor field-only adapter ownership;
- custom low-density/lightweight concrete floating-floor ownership
  closed by this refresh.

Candidate categories to evaluate next:

- route-required floor inputs that can unlock real `Ln,w`, `DeltaLw`,
  `L'n,w`, `L'nT,w`, or `L'nT,50` values without guessing dynamic
  stiffness, load basis, room volume, field K, or CI terms;
- wall or floor user-material resolver/input ownership where the
  visible stack already carries enough physical data for an owned
  formula route but remains blocked before solver selection;
- building-prediction promotion only where lab/field bases and required
  geometry/room inputs are explicit;
- exact ASTM `IIC` / `AIIC` ownership only when the required banded
  spectra and rating contour route are explicitly available;
- source/exact holdouts only when the construction and metric basis
  truly match and the row can improve calibration or anchor selection.

Reject candidates that mainly create UI polish, source crawling,
confidence copy, broad refactoring, or metric aliasing. Do not infer
field K, room volume, CI, dynamic stiffness, load basis, topology, or
spectra from tags.

## Selected Work

Selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_floating_floor_family_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-floating-floor-family-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_PLAN_2026-06-15.md`

Selected next label:

`post-V1 next numeric coverage gap after floor user-material low-density floating-floor family`

The rerank has not selected the following runtime slice yet. It must
record `candidateCount`, `roiAnalysisIterations`, the rejected
non-goal candidates, the selected candidate, and expected next runtime
movement before any owner implementation starts.

## Validation

The next rerank contract should assert the closed refresh chain above,
run at least three explicit ROI iterations, and land with
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
It should select exactly one bounded calculator slice or explicitly
state why no higher-ROI calculator slice remains.
