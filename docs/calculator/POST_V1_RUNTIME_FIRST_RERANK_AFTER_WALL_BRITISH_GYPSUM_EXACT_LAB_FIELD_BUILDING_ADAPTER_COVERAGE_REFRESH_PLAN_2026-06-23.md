# Post-V1 Runtime-First Rerank After Wall British Gypsum Exact Lab Field/Building Adapter Coverage Refresh Plan - 2026-06-23

Status:
`post_v1_runtime_first_route_family_rerank_after_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_plan_selected_after_coverage_refresh`

Landed follow-up:
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-23.md`
/
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`.
The selected primary candidate has landed, so the current selected next
action is now
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md`
/
`post-V1 wall British Gypsum exact lab A-weighted field/building adapter coverage refresh`.
Counters for the landed owner: `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 8`, `runtimeBasisPromotions: 4`,
`runtimeValuesMoved 8`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Purpose

This is the selected next no-runtime rerank after
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_plan`.

The previous owner opened exact British Gypsum `A046005` / `A046006`
field/building `R'w`, `Dn,w`, and `DnT,w` through the exact lab `Rw`
direct curve plus Gate I / Gate AR. The coverage refresh re-probes that
runtime and protects A-weighted, lab-alias, impact, missing-input,
legacy `auto` side-count, nearby-row, and lab-to-field/building copying
boundaries.

This rerank must select the next highest-ROI calculator runtime owner
from current evidence. It must not implement values, retune formulas,
or crawl sources.

## Follows

Coverage refresh action:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_plan`

Coverage refresh file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-field-building-adapter-coverage-refresh-contract.test.ts`

Coverage refresh status:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_british_gypsum_exact_lab_field_building_adapter_coverage_refresh`

Coverage refresh re-probed candidate:
`wall.british_gypsum_exact_lab_field_building_adapter_owner`

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Previous owner:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_owner_plan`

Previous owner status:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

## Rerank Action

Selected action:
`post_v1_runtime_first_route_family_rerank_after_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_plan`

Selected file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-british-gypsum-exact-lab-field-building-adapter-coverage-refresh-contract.test.ts`

Selected plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Selected label:
`post-V1 runtime-first route-family rerank after wall British Gypsum exact lab field/building adapter coverage refresh`

## Candidate Card

Primary candidate to evaluate:
`wall.british_gypsum_exact_lab_a_weighted_field_building_adapter_owner`.

- User construction / formula family: British Gypsum `A046005`
  one-side RB1 and `A046006` both-side RB2 timber resilient-bar exact
  lab rows.
- Target outputs to open if selected: `Dn,A` and `DnT,A` for complete
  explicit `field_between_rooms` and `building_prediction` contexts.
- Route: exact lab `Rw` direct curve already selected by the landed
  owner, then existing Gate I / Gate AR A-weighted adapter logic only
  if the A-weighted basis is explicit and defensible.
- Required physical inputs: exact source row identity, explicit
  `resilientBarSideCount`, direct curve basis, panel area, receiving
  room volume, receiving-room reverberation time, and for building
  `buildingPredictionOutputBasis`, flanking/junction class,
  conservative flanking assumption, and junction coupling length.
- `needs_input` behavior: missing frequency/basis, missing room
  context, or missing building context must return precise
  `needs_input` or `unsupported`; do not infer them from the lab row.
- `unsupported` boundaries: `Rw`, `STC`, `C`, `Ctr`, impact aliases,
  nearby British Gypsum rows, legacy `auto` side-count, and
  lab-to-field/building copying remain blocked.
- Estimated `newCalculableRequestShapes`: 4.
- Estimated `newCalculableTargetOutputs`: 8.
- Estimated `runtimeBasisPromotions`: 4.
- Estimated `runtimeValuesMoved`: 8.

Secondary candidates to keep lower unless the rerank proves otherwise:

- `wall.british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner`:
  depends on a landed BG `DnT,A` owner first.
- `wall.british_gypsum_nearby_same_family_anchor_delta_owner`: requires
  explicit same-family/same-basis boundary proof for nearby rows.
- Broad source acquisition or UI/report copy work: out of scope unless
  the rerank finds no safe runtime candidate.

## Rerank Rules

1. Prefer runtime moves that calculate more user-entered combinations
   on the correct field/building basis.
2. Keep exact lab evidence as an anchor, not a field/building alias.
3. Do not reopen A-weighted, characteristic, lab-alias, or nearby-row
   outputs unless the candidate has an owned formula/adapter route.
4. Do not select a source crawl, UI polish task, or docs-only cleanup
   while a safe runtime calculator candidate exists.
5. If the primary A-weighted candidate cannot be defended, the rerank
   must explicitly name the blocker and select the next safe runtime
   owner or stop.

## Expected Rerank Counters

- `candidateCount: 4`
- `roiAnalysisIterations: 4`
- `estimatedNextCalculableRequestShapes: 4`
- `estimatedNextCalculableTargetOutputs: 8`
- `estimatedNextRequiredPhysicalInputsCaptured: 10`
- `estimatedNextRuntimeBasisPromotions: 4`
- `estimatedNextRuntimeValuesMoved: 8`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Validation Plan

1. Add the selected rerank contract.
2. Reuse the landed owner and coverage-refresh evidence; do not change
   runtime behavior in the rerank.
3. Assert the selected next runtime owner, its plan file, expected
   counters, and blocked boundaries.
4. Run targeted owner/coverage/rerank tests and `git diff --check`.
5. Run `pnpm calculator:gate:current` when the current-gate runner or
   live handoff docs are updated.

## Stop Rule

If no candidate can safely move runtime/accuracy/input-surface behavior,
stop after the rerank and record the exact blocker. Do not replace a
blocked runtime owner with a broad source crawl or copy-only task.
