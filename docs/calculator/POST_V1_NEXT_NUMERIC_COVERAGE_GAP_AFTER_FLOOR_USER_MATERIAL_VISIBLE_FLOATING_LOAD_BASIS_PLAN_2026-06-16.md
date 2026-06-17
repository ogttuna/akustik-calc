# Post-V1 Next Numeric Coverage Gap After Floor User-Material Visible Floating Load-Basis Plan - 2026-06-16

## North Star

DynEcho is an acoustic calculator. This bounded rerank exists only to
choose the next high-ROI calculator slice after the visible
floating-floor load-basis coverage refresh. It must improve calculator
scope, numeric accuracy, formula-route ownership, route-required input
capture, or metric/basis integrity.

This is not a UI polish pass, broad source crawl, source catalog task,
confidence-labeling pass, framework cleanup, or generic refactor.

## Previous Chain

Previous selected action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_floating_floor_family_plan`

Runtime owner action:

`post_v1_floor_user_material_visible_floating_load_basis_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts`

Runtime owner status:

`post_v1_floor_user_material_visible_floating_load_basis_owner_landed_runtime_selected_coverage_refresh`

Runtime owner candidate:

`floor.user_material_visible_floating_load_basis_owner`

Coverage refresh action:

`post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

## Closed Route To Subtract

The refresh re-probes the visible floating-floor load-basis owner without
moving runtime values. The closed route derives `loadBasisKgM2` from
visible upper package surface mass when the custom/user-supplied floor
stack has a `resilient_layer` plus `floor_covering`, `floating_screed`,
and optional `upper_fill` layers.

Closed value pins:

- low-density custom floor without manual `loadBasisKgM2`: `Ln,w 64.3`,
  `DeltaLw 24.4`, `L'n,w 66.3`, `L'nT,w 63.9`, `L'nT,50 66.9`;
- heavy custom floor without manual `loadBasisKgM2`: `Ln,w 50.1`,
  `DeltaLw 24.4`, `L'n,w 52.1`, `L'nT,w 49.7`, `L'nT,50 52.7`;
- explicit `loadBasisKgM2: 76` still overrides the derived
  `77.6 kg/m2`;
- missing dynamic stiffness and non-derivable load basis remain
  `needs_input`;
- generic `IIC` / `AIIC` remains unsupported unless exact ASTM band
  ownership is supplied through the separate ASTM route.

Refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## ROI Rerank Rules

Run at least three explicit ROI passes before selecting the next owner.
Each pass must subtract the closed lanes from the previous chain:

- compatible anchor-delta wall companions and field/building adapters;
- direct-fixed double-leaf/framed lab, field, building, and A-weighted
  lanes;
- default-catalog and explicit user-material double-leaf/framed route
  input lanes;
- user-material missing-topology and porous flow-resistivity input
  ownership;
- floor user-material impact-context dynamic-stiffness ownership;
- floor user-material field-only adapter ownership;
- floor user-material low-density/lightweight floating-floor family
  ownership;
- visible floating-floor load-basis derivation ownership closed by this
  refresh.

Candidate categories to compare:

- a physically ready runtime owner that moves additional `Ln,w`,
  `DeltaLw`, `L'n,w`, `L'nT,w`, `L'nT,50`, `Rw`, `R'w`, `Dn,w`,
  `DnT,w`, `STC`, `IIC`, or `AIIC` outputs for user-entered stacks;
- an input-surface owner that captures route-required physical inputs
  and immediately protects or unlocks numeric outputs;
- a metric/basis boundary owner only when it prevents real aliasing or
  false support on user-visible calculator outputs;
- a source/anchor owner only when the construction and metric basis
  truly match and it improves calculation or calibration, not just
  catalog coverage.

Reject candidates that mainly produce docs, process cleanup, UI
polish, broad source collection, formula retuning without evidence,
metric aliasing, or silent defaults for dynamic stiffness, field K,
room volume, CI, topology, band spectra, or load basis.

## Selected Work

Selected candidate:

`floor.user_material_visible_floating_mixed_lab_companion_owner`

Selected next action:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan`

Selected next file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_OWNER_PLAN_2026-06-16.md`

Selected next label:

`post-V1 floor user-material visible floating mixed lab-companion owner`

The selected owner preserves already-owned lab-side impact companion
values in mixed target sets while leaving unsupported field metrics
explicit. It moves calculator values without formula retune, source
import, UI work, or metric aliasing.

## Landed Closeout

Rerank action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_plan`

Rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-load-basis-contract.test.ts`

Rerank plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_PLAN_2026-06-16.md`

Rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_landed_no_runtime_selected_floor_user_material_visible_floating_mixed_lab_companion_owner`

The rerank ran four ROI passes, subtracted the closed visible
floating-floor load-basis owner, rejected silent CI50 defaults, generic
IIC/AIIC aliasing, building-prediction impact promotion without owned
inputs, broad source crawling, and UI cleanup, then selected the mixed
lab-companion runtime owner.

Counters: `candidateCount 7`, `estimatedNextRuntimeValuesMoved: 3`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextCalculableTargetOutputs: 3`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Validation

The rerank contract asserts `candidateCount`, `roiAnalysisIterations`,
rejected non-goal candidates, the selected candidate, and expected next
runtime movement. It lands with `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0` because the rerank itself only
chooses the next implementation slice.
