# Checkpoint 2026-06-10 - Compatible Anchor-Delta Building Dn,A Owner

Document role: checkpoint record for the calculator-focused compatible
anchor-delta chain after the building `Dn,A` owner landed. This file is a
state reconciliation note, not a new implementation plan that overrides
`CALCULATOR_SOURCE_OF_TRUTH.md` or `NEXT_IMPLEMENTATION_PLAN.md`.

## Product Direction Check

The direction is still aligned with the calculator mission. This checkpoint
does not add a catalog-only feature, report polish, auth/storage work, or a
source crawl. It opens already-computed same-route Gate AR values for a
bounded layer family:

- route family: Knauf `416889` compatible anchor-delta light steel stud wall;
- input basis: existing shifted direct curve plus Gate AR building prediction;
- target output moved: building `Dn,A`;
- new calculable request shapes: paired exterior-board building and one-side
  exterior-board building;
- runtime values moved: paired building `Dn,A 49.5` and one-side building
  `Dn,A 48`.

This is scope expansion for the calculator: a user asking for building
`Dn,A` on those physically compatible layer combinations now receives a
calculated value instead of an unsupported stop.

## Implementation Facts

Landed owner:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`.

Owner contract:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`.

Previous numeric gap action:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`.

Previous numeric gap contract:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`.

Previous numeric gap status:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner`.

Owner status:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh`.

Runtime change:
`packages/engine/src/calculate-assembly.ts` now includes `Dn,A` in
`WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_A_WEIGHTED_OUTPUTS`.

Route warning:
`packages/engine/src/post-v1-wall-compatible-anchor-delta.ts` now states
that field `Dn,A` / `DnT,A` and building `Dn,A` / `DnT,A` are calculated
route values.

Workbench parity was updated through the existing compatible anchor-delta
surface tests so cards, target-output status, report summaries, saved replay,
server replay, and API payloads stay aligned.

## Boundaries Still Pinned

- Lab aliases do not become field/building `Dn,A` or `DnT,A`.
- Building requests missing `buildingPredictionOutputBasis` still stop as
  missing input.
- Non-selected compatible anchors remain outside this owner.
- ASTM/IIC/AIIC outputs remain unsupported on this wall airborne route.
- No source rows were imported.
- No direct curve, Gate I, Gate AR, or ISO 717 adapter formula was retuned.

Counters: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 2`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

## Documentation Reconciliation

The reviewed docs now distinguish between historical intermediate states and
the current checkpoint:

- earlier A-weighted field/building owner and surface parity blocks may say
  building `Dn,A` was parked at that checkpoint;
- the current source of truth and current-state snapshot say the building
  `Dn,A` owner has landed and selected the coverage refresh;
- the selected next file is intentionally still open:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.

## Current Selected Next

Selected next action:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`.

Selected next label:
`post-V1 wall compatible anchor-delta building Dn,A coverage refresh`.

This is still the right next step. It should not move new runtime values. It
should freeze the landed building `Dn,A` owner through the current-gate,
resolver registry/runtime surface, coverage matrix, and company-internal V0
coverage expectations before another value-moving slice is selected.

## Validation At Checkpoint

Latest full gate:
`pnpm calculator:gate:current`.

Result:

- engine: 688 test files, 3810 tests passed;
- web: 119 test files, 464 tests passed and 18 skipped;
- repo build: 5 packages successful;
- whitespace guard passed.

Known non-fatal warnings remain the test-environment Zustand persist storage
warning and optional `sharp/@img` build warnings.
