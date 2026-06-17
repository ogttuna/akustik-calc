# Post-V1 Floor User-Material Visible Floating Mixed Lab-Companion Owner Plan - 2026-06-16

## Purpose

Implement the runtime owner selected by
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_plan`.

Selected candidate:

`floor.user_material_visible_floating_mixed_lab_companion_owner`

This owner protects a real calculator route: a user-entered custom
visible heavy floating-floor stack can already calculate lab-side
impact companion outputs from explicit user inputs, but a mixed request
that also asks for an unready field output must not suppress those
available lab-side values.

This is not a UI pass, broad source crawl, source-row import, confidence
copy change, or formula retune.

## Route Boundary

Allowed route:

- calculator: `dynamic`;
- construction: fully floor-role-tagged visible floating-floor stack;
- impact basis: `predictor_heavy_floating_floor_iso12354_annexc_estimate`;
- explicit user inputs: `impactFieldContext.ciDb` for `CI` and
  `Ln,w+CI`, and/or `impactFieldContext.ci50_2500Db` for
  `CI,50-2500`;
- mixed request may include unready field outputs such as `L'nT,50`.

The owner may preserve supported lab-side outputs in a mixed request:

- `CI`;
- `CI,50-2500`;
- `Ln,w+CI`.

The owner must keep unsupported field outputs explicit. It must not
invent `fieldKDb`, receiving-room volume, `ci50_2500Db`, project field
context, ASTM `IIC` / `AIIC`, or any source-family value.

## Required Runtime Checks

- With explicit `ciDb: -1` and `ci50_2500Db: 3`, target outputs
  `CI`, `CI,50-2500`, `Ln,w+CI`, and `L'nT,50` must support the three
  lab companions and keep `L'nT,50` unsupported when field context is
  incomplete.
- With complete field context (`fieldKDb`, receiving-room volume, and
  `ci50_2500Db`), the same mixed request must keep field outputs live.
- With no explicit CI inputs, lab companions must remain unsupported.
- Generic `IIC` and `AIIC` must remain unsupported unless the separate
  ASTM route owns exact ASTM bands or ratings.

## Landed Closeout

Owner action:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan`

Owner file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts`

Owner status:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_landed_runtime_selected_coverage_refresh`

Runtime behavior:

- custom visible heavy floating-floor mixed request now keeps `CI -1`,
  `CI,50-2500 3`, and `Ln,w+CI 49.1` supported when those inputs are
  explicit;
- incomplete `L'nT,50` field context remains unsupported field output
  explicit;
- complete field context still supports `L'n,w 52.1`, `L'nT,w 49.7`,
  and `L'nT,50 52.7`;
- no formula retune, source import, metric aliasing, or frontend change.

Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selected Next

Selected next action:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

Selected next label:

`post-V1 floor user-material visible floating mixed lab-companion coverage refresh`

## Follow-On Coverage Refresh Closeout

The selected coverage refresh above has now landed.

Coverage refresh action:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Selected candidate re-probed:

`floor.user_material_visible_floating_mixed_lab_companion_owner`

Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_plan`

Current selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts`

Current selected next plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 next numeric coverage gap after floor user-material visible floating mixed lab-companion`
