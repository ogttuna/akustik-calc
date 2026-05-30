# Post-V1 Gate AZ Numeric Coverage Gap Plan - 2026-05-27

Document role: active Gate AZ planning bridge. Read after
[CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md) and
[POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md).

Gate AZ has now landed as:

`post_v1_next_numeric_coverage_gap_gate_az_plan`

Gate AZ selection status:

`post_v1_next_numeric_coverage_gap_gate_az_landed_no_runtime_selected_floor_dynamic_stiffness_load_basis_owner_gate_ba`

Gate AZ selected next action:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`

Gate AZ selected next file:

`packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts`

The landed Gate AZ executable contract is:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-az-contract.test.ts`

Gate AZ turns Gate AY's selected next label into a measurable calculator
capability path. It is a no-runtime selection gate: it does not move
numeric values, but it selects the next physical owner slice that can
increase floor-impact calculation coverage without guessing.

Gate BA has now landed as:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`

Gate BA selection status:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_landed_no_runtime_selected_suspended_ceiling_lower_treatment_gate_bb`

Gate BA selected next action:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan`

Gate BA selected next file:

`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts`

Gate BA pins `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`
as no-default physical owner fields. Complete heavy floating inputs keep
the existing `Ln,w 48.7` / `DeltaLw 25.8` runtime; missing dynamic
stiffness or load basis cannot invent `DeltaLw`.

Gate BB has now landed as:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan`

Gate BB selection status:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_landed_selected_surface_parity_gate_bc`

Gate BB selected next action:

`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`

Gate BB selected next file:

`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc-contract.test.ts`

Gate BB promotes complete visible heavy-concrete combined upper/lower
floor stacks with `acoustic_hanger_ceiling` or `resilient_stud_ceiling`
lower-treatment support into
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
Pinned values: acoustic hanger `Ln,w 45.6` / `DeltaLw 28.9`;
resilient stud `Ln,w 44.6` / `DeltaLw 29.9`. Missing
`ceilingOrLowerAssembly` or `loadBasisKgM2` still stops, and ASTM
`IIC` / `AIIC` aliases remain unsupported.

Gate BC has now landed as:

`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`

Gate BC selection status:

`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_landed_selected_coverage_refresh_gate_bd`

Gate BC selected next action:

`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`

Gate BC selected next file:

`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts`

Gate BC is no-runtime surface parity. Workbench cards, Markdown report,
saved replay, estimate API, impact-only API, and resolver trace now
expose the same layer-derived heavy-concrete combined lower-treatment
answer: acoustic hanger `Ln,w 45.6` / `DeltaLw 28.9`, resilient stud
`Ln,w 44.6` / `DeltaLw 29.9`. Visible `acoustic_hanger_ceiling` and
`resilient_stud_ceiling` support products are accepted without duplicate
lower support-class fields, while `resilientLayerDynamicStiffnessMNm3`
and `loadBasisKgM2` remain required physical inputs. ASTM `IIC` /
`AIIC` aliases remain unsupported.

Gate BD has now landed as:

`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`

Gate BD selection status:

`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_be`

Gate BD selected next action:

`post_v1_next_numeric_coverage_gap_gate_be_plan`

Gate BD selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts`

Gate BD is no-runtime coverage refresh. The acoustic-hanger,
resilient-stud, and impact-only lower-treatment rows are counted as
source-absent family-physics coverage with pins `Ln,w 45.6` /
`DeltaLw 28.9` and `Ln,w 44.6` / `DeltaLw 29.9`. Missing load basis,
missing lower assembly, and ASTM `IIC` / `AIIC` remain value-less
boundaries. The remaining high-risk
`floor.mixed_support_family.multi_family_solver_gap` is carried forward
for Gate BE reranking.

## Current Implementation Comparison

| Area | Current implementation fact | Planning implication |
| --- | --- | --- |
| Latest landed slice | Gate AY is landed in `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ay-contract.test.ts`. It calculates guarded ISO weighted impact values for `floor-tuas-c11c-fail-closed`: `Ln,w 59`, `CI 1`, `CI,50-2500 1`, `Ln,w+CI 60`, and complete field values `L'n,w 62`, `L'nT,w 59.2`, `L'nT,50 60.2`. | Gate AZ must build from a green calculator surface, not reopen C11c exact import or ASTM aliases. |
| Selected next hook | `packages/engine/src/post-v1-floor-tuas-c11c-iso-impact-gate-ay.ts` selects `post_v1_next_numeric_coverage_gap_gate_az_plan` and `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-az-contract.test.ts`. | The next implementation artifact must be this Gate AZ contract. |
| Gate AZ artifact | `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-az-contract.test.ts` now exists and is included in the current gate runner. | Gate AZ+1 can proceed through the selected dynamic-stiffness/load-basis owner contract. |
| Resolver surface | Current documented count is 39 declared candidates and 36 active runtime-basis mappings. | Any selected runtime follow-up must add candidate and basis mappings only when it publishes owned values. |
| Existing floor-impact lanes | `impact-lane.ts` already routes exact floor rows, bounded floor systems, product/catalog `DeltaLw`, explicit user `DeltaLw`, heavy concrete formulas, steel formula fallback, timber/CLT `DeltaLw`, open-box/open-web raw-bare, helper-only timber/open-web, and the guarded C11c tuple. | The next slice should extend source-absent formula capability or physical-input ownership around these lanes, not duplicate catalog matching. |
| Existing visible trace surface | `dynamic-impact.ts` already names visible impact bases for heavy floating/combined/bare, steel, lightweight-steel suspended ceiling, timber/CLT, open-box/open-web, helper-only, and C11c-style family outputs. | A new formula lane must publish a named basis and visible candidate trace, with card/API/report parity. |
| Existing physical input surface | Shared/domain and workbench files already include key floor-impact inputs such as `loadBasisKgM2`, dynamic stiffness, lower treatment / ceiling assembly, and suspended-ceiling treatment types. | Gate AZ should reuse these input contracts before inventing new fields. Missing fields must produce `needs_input`, not guessed values. |
| Existing gap evidence | `calculator-personal-use-mvp-coverage-sprint-gate-ba.ts` already ranks floor-impact source-absent gaps: dynamic stiffness/load basis priority `0.96`, suspended-ceiling lower-treatment coupling priority `0.92`, mixed-support-family fail-closed priority `0.89`. Gate BB/BC already contain historical owner-contract/formula-corridor work for this family. | Gate AZ should reuse this evidence as the candidate pool and select one concrete post-V1 implementation path. |

## Gate AZ Decision

Gate AZ is an executable selection gate with no runtime value movement.
It compares the current implementation against the highest-ROI
floor-impact source-absent gaps and selects the next concrete slice.

Gate AZ must select one of these candidates:

1. `floor.material_owner_gap.dynamic_stiffness_load_basis` - selected
   - Preferred if the contract proves common resilient-layer or floor
     covering stacks are blocked only because `s'`, supported load,
     product curve, or tested `DeltaLw` ownership is missing.
   - Expected product gain: more realistic floor-impact stacks can move
     from `needs_input` / `unsupported` into a named source-absent
     calculation once the required physical fields are present.
   - Accuracy guard: no default dynamic stiffness or load basis. Missing
     fields stay `needs_input`.

2. `floor.suspended_ceiling.lower_treatment_coupling_gap` - next runtime-family candidate after owner fields
   - Preferred if lower treatment and ceiling coupling are the bigger
     visible blocker after current input ownership is checked.
   - Expected product gain: floors with suspended ceiling / lower board
     stacks can calculate `Ln,w`, `CI`, `CI,50-2500`, and field
     continuations when required inputs are present.
   - Accuracy guard: lower treatment reduction cannot be reinterpreted
     as upper `DeltaLw`; hanger/support class, cavity, absorber, and
     board mass must be owned.

3. `floor.mixed_support_family.multi_family_solver_gap` - fail-closed candidate
   - Preferred only as a boundary slice if mixed support inference is
     currently leaking values.
   - Expected product gain: improved correctness through fail-closed
     `needs_input`, not immediate numeric coverage.
   - Accuracy guard: require one explicit carrier family before any
     source-absent formula promotion.

Broad source crawling, confidence wording, finite scenario packs, ASTM
`IIC` / `AIIC` aliases, and C11c exact import are not valid Gate AZ
selections.

## Required Gate AZ Acceptance

The Gate AZ contract proves these points:

1. It consumes Gate AY status
   `post_v1_floor_tuas_c11c_iso_impact_gate_ay_landed_selected_next_numeric_coverage_gap_gate_az`.
2. It confirms the selected Gate AZ file path:
   `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-az-contract.test.ts`.
3. It inventories the current relevant implementation surfaces:
   `impact-lane.ts`, `dynamic-impact.ts`, shared impact predictor input
   schema, and workbench input/output surfaces.
4. It ranks the three floor-impact source-absent candidates above by
   expected coverage gain, accuracy risk, and implementation readiness.
5. It selects exactly one next action and file for Gate AZ+1:
   `post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`.
6. It states that Gate AZ+1 is input-owner work; runtime corridor and
   surface parity come later.
7. It defines before/after evidence for the selected next slice:
   supported outputs that will move, exact metric owners, basis ids,
   candidate ids, value pins or missing-input prompts, and negative alias
   cases.

## Recommended Gate AZ+1 Path

Gate AZ chose dynamic-stiffness/load-basis ownership first, then
suspended-ceiling lower-treatment runtime as the next family candidate
after owner fields.

Implementation sequence:

1. Gate AZ executable selection contract - closed
   - No runtime value movement.
   - Output: selected Gate AZ+1 action, file, candidate id, and
     acceptance matrix.

2. Dynamic stiffness / load basis owner contract - closed
   - Name required fields, default policy, and `needs_input` behavior.
   - Reuse existing shared/workbench fields where possible.
   - Keep exact, product `DeltaLw`, explicit `DeltaLw`, heavy concrete,
     steel, timber/CLT, open-box/open-web, helper-only, and C11c lanes
     separate.

3. Runtime corridor for the selected floor-impact family
   - Add or extend a named formula basis only when required physical
     inputs are complete.
   - Publish owned `Ln,w`, `CI`, `CI,50-2500`, `Ln,w+CI`, and field
     continuations only through explicit owners.
   - Add resolver registry mapping, dynamic impact trace, support
     matrix, and answer-engine parity.

4. Surface parity
   - Cards, output cards, charts, `/api/estimate`, saved replay, server
     snapshot replay, and Markdown reports must show the same selected
     answer outputs and stopped outputs.

## Validation Plan

For Gate AZ planning-only work:

- targeted Gate AY continuity / Gate AZ selection contract;
- `git diff --check`.

For Gate AZ+1 input-owner work:

- targeted engine contract for missing fields, exact precedence,
  negative aliases, and hostile topology;
- targeted shared schema / workbench input-surface tests if visible
  fields move;
- `pnpm calculator:gate:current`;
- `git diff --check`.

For Gate AZ+1 runtime/surface work:

- targeted engine formula/runtime tests with value pins and budgets;
- targeted resolver registry and answer-engine candidate tests;
- targeted web card/API/report parity tests;
- `pnpm calculator:gate:current`;
- `git diff --check`.

## Single Direction

The next step is not "more planning" in the abstract. Gate AZ and Gate
BA are closed. Implement only the selected Gate BB slice:
`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan`. The
desired outcome is more layer combinations calculating more owned values
with better physical correctness, while unsafe combinations fail closed
with exact missing inputs.
