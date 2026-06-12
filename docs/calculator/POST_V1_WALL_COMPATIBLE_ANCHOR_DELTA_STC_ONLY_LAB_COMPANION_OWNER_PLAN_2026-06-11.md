# Post-V1 Wall Compatible Anchor-Delta STC-Only Lab Companion Owner Plan - 2026-06-11

Document role: selected value-moving follow-up after the compatible
anchor-delta building `Dn,A` coverage refresh. This plan keeps the next
implementation tied to calculator scope instead of another process-only
handoff.

Plan doc path:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md`.

## Current Closeout Dependency

Previous runtime owner:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`.

Previous owner file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`.

Previous owner status:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh`.

Landed closeout:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`.

Closeout file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.

Closeout status:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_landed_no_runtime_selected_stc_only_lab_companion_owner`.

The closeout re-probes paired exterior-board building `Dn,A 49.5` and
one-side exterior-board building `Dn,A 48`, keeps paired / one-side
`DnT,A`, keeps field A-weighted values live, and preserves lab,
STC-only, missing `buildingPredictionOutputBasis`, non-selected-anchor,
and ASTM/IIC/AIIC boundaries. Counters:
`coverageRefreshContractFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selected Next

Selected next action:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan`.

Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`.

Selected next label:
`post-V1 wall compatible anchor-delta STC-only lab companion owner`.

This is a value-moving calculator slice. It should open only the bounded
STC-only lab companion request shapes that the current shifted direct
curve already can rate, without importing source rows or weakening
metric-basis boundaries.

Landed status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_landed_runtime_selected_surface_parity`.

Selected follow-up action:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan`.

Selected follow-up file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts`.

Selected follow-up plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.

Selected follow-up label:
`post-V1 wall compatible anchor-delta STC-only lab companion surface parity`.

## Iteration 1 - Current Runtime Evidence

- Paired and one-side Knauf `416889` compatible anchor-delta lab mixed
  requests already calculate `Rw` plus calculated `STC`, `C`, and `Ctr`
  through
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
- The source row owns measured `Rw` only; the shifted direct curve and
  ASTM E413 / ISO 717 adapters own calculated companion metrics with a
  visible not-measured budget.
- `STC`-only requests for the same paired and one-side stacks currently
  remain unsupported even though the exact same curve rating is available.

Decision: the runtime evidence is already present; the missing piece is
an explicit STC-only owner boundary.

## Iteration 2 - Product ROI

This is not as broad as a new formula family, but it is high-confidence
scope movement:

- route family: wall compatible measured-anchor delta;
- target output: element-lab `STC`;
- expected new calculable request shapes: paired exterior-board STC-only
  and one-side exterior-board STC-only;
- expected runtime basis promotion: 1 bounded owner;
- source rows imported: 0;
- formula retunes: 0.

The slice is useful because users may request STC directly in markets that
use ASTM ratings, and the calculator should answer when it already owns a
bounded curve-rating route.

## Iteration 3 - Boundaries

The owner must not widen into:

- source-measured STC claims; the Knauf source row still reports `Rw`;
- non-Knauf or non-matching board stacks;
- field/building `R'w`, `Dn,w`, `DnT,w`, `Dn,A`, or `DnT,A`;
- A-weighted lab aliases;
- ASTM impact `IIC` / `AIIC`;
- standalone `C` / `Ctr` unless a later owner explicitly selects them.

Missing physical owner fields must remain `needs_input` where the current
route already requires them. Unsupported metric-basis rows must remain
unsupported.

## Implementation Work Order

1. Add
   `packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`.
2. Change the compatible anchor-delta lab companion predicate so paired
   and one-side `STC`-only element-lab requests may select the calculated
   lab companion runtime.
3. Move only `STC` from unsupported to supported for those STC-only
   request shapes.
4. Keep mixed `Rw+STC/C/Ctr`, direct single `Rw`, field/building,
   A-weighted, ASTM/IIC/AIIC, missing-input, and non-Knauf boundaries
   pinned.
5. Update the living docs and current gate after the owner lands.

Expected counters for the owner: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Landed Runtime Result

The owner opens paired exterior-board `STC 59` and one-side
exterior-board `STC 57` for Knauf `416889` compatible anchor-delta
element-lab STC-only requests through
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
It does not claim measured STC evidence, import source rows, or retune
formulas. Direct `Rw`, mixed `Rw+STC/C/Ctr`, field/building,
A-weighted, C/Ctr-only, ASTM/IIC/AIIC, missing-input, and non-Knauf
boundaries remain pinned.

The selected surface parity follow-up is intentionally narrow: prove the
workbench/API/replay/report surfaces expose `STC 59` / `STC 57` for the
newly supported STC-only requests without changing runtime values.
