# Post-V1 Gate EE/EF Composite-Panel Suspended-Ceiling Route Plan - 2026-06-07

Document role: Gate EE no-runtime ROI selection plus the bounded Gate
EF implementation plan. This is calculator work only: formula-route
ownership, metric basis correctness, and `needs_input` / `unsupported`
boundaries. It is not a source-row crawl, frontend task, confidence
wording pass, or formula retune.

## Gate EE Selection

Selected candidate:
`floor.composite_panel_suspended_ceiling_only_route_boundary`.

Selected next action:
`post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_plan`.

Selected next file:
`packages/engine/src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts`.

Gate EE runs after Gate ED closed the visible heavy-concrete
`resilient_channel` lower-treatment runtime gap. Two ROI iterations
were completed:

1. Gate ED's selected heavy-concrete gap is closed, so selecting it
   again would duplicate value. The remaining candidates were rechecked
   for calculator scope or accuracy only.
2. The strongest remaining engine-only signal is the composite-panel
   suspended-ceiling-only visible route. Gate CY already owns the PMC
   composite-panel published-interaction family, while a legacy
   layer-driven parity row still expects the upstream low-confidence
   lane for the same suspended-ceiling-only visible stack.

Gate EE counters:

- `candidateCount 10`
- `roiAnalysisIterations: 2`
- `estimatedNextAccuracyBoundaryLedgers 1`
- `estimatedNextRuntimeCorrectedLayerTemplates 1`
- `estimatedNextRuntimeCorrectedRequestShapes 3`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Current Runtime Evidence

Gate CY already owns composite-panel published-interaction runtime
answers for dry, suspended-ceiling-only, and combined PMC-family
profiles. The current visible suspended-ceiling-only stack is:

```text
steel_deck_composite 150 mm base_structure
resilient_channel 150 mm ceiling_cavity
rockwool 100 mm ceiling_fill
firestop_board 16 mm ceiling_board
firestop_board 16 mm ceiling_board
```

With target outputs `Rw`, `Ln,w`, and `DeltaLw`, current runtime resolves
to:

- basis: `predictor_composite_panel_published_interaction_estimate`
- runtime candidate:
  `floor.composite_panel.published_interaction_family_solver`
- `Rw 48.6`
- `Ln,w 63.3`
- `DeltaLw 20.7`

The discrepancy is not numeric drift. The current value matches the
owned suspended-ceiling-only profile, but
`packages/engine/src/impact-layer-stack-driven.test.ts` still contains a
legacy expectation that the same visible stack should stay on
`predictor_floor_system_low_confidence_estimate`. Gate EF must reconcile
that route boundary before the next runtime expansion.

## Why This Is Highest ROI

This candidate has higher ROI than the other Gate EE candidates because
it is engine-only, already has a named formula/anchor family, and affects
the route by which visible layer combinations reach `Rw`, `Ln,w`, and
`DeltaLw`. It either prevents an incorrectly widened owner route or
officially unlocks a broader visible layer path through an already-owned
published-family estimate.

Deferred or rejected alternatives:

- ASTM `IIC` / `AIIC` user-band intake remains useful later, but it
  needs API/workbench/report/replay input-surface work and is not the
  highest-ROI engine-only slice.
- Explicit `CI`, `CI,50-2500`, and `L'nT,50` routes already calculate
  when `impactFieldContext` supplies the required fields; missing fields
  remain `needs_input`.
- Held AAC / board-fill multicavity walls without `supportTopology`
  remain a correct `needs_input` boundary.
- Open-web, hollow-core, Pliteq, and Knauf lower-treatment subtraction
  remains rejected as wrong-metric `DeltaLw` derivation until a bounded
  same-family owner is named.
- Opening/leak holdout tightening remains blocked by insufficient
  same-family holdouts.
- Broad source crawling and frontend polish do not move calculator scope
  or accuracy here.

## Gate EF Acceptance Plan

Gate EF must stay bounded to the composite-panel suspended-ceiling-only
route boundary.

1. Reproduce the visible stack above through
   `buildImpactPredictorInputFromLayerStack` and pin the selected
   runtime basis.
2. Decide the route-owner branch:
   - Branch A, expected: the published-interaction route is correct
     because Gate CY already owns the suspended-ceiling-only
     composite-panel profile. Gate EF should update the stale
     low-confidence parity expectation and add a dedicated route-boundary
     contract for `Rw 48.6 / Ln,w 63.3 / DeltaLw 20.7`.
   - Branch B, only if evidence disproves Branch A: add a guard that
     restores the conservative low-confidence boundary for this visible
     route without weakening Gate CY's explicit predictor pins.
3. Preserve negative boundaries:
   - no formula retune;
   - no source-row import;
   - no frontend implementation work;
   - no generic steel/open-web/hollow-core lower-treatment `DeltaLw`
     derivation;
   - no ASTM `IIC` / `AIIC` aliasing;
   - missing base structure or lower-treatment physical inputs still
     stop as `needs_input`.
4. Run focused validation:
   - `post-v1-next-numeric-coverage-gap-gate-ee-contract.test.ts`
   - new Gate EF contract
   - `post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts`
   - `impact-layer-stack-driven.test.ts` if Branch A updates the stale
     parity row
   - `impact-predictor-input.test.ts`
   - `calculate-impact-only` focused coverage if route code changes

Gate EF is the next action. Gate EE itself moves no runtime values.

## Gate EF Landed Result

Gate EF landed as:
`post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_plan`.

Gate EF status:
`post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_eg`.

Gate EF selected:
`post_v1_next_numeric_coverage_gap_gate_eg_plan`.

Gate EF took Branch A. The visible suspended-ceiling-only stack is now
contract-pinned to the Gate CY published-interaction owner:

- basis: `predictor_composite_panel_published_interaction_estimate`
- runtime candidate:
  `floor.composite_panel.published_interaction_family_solver`
- `Rw 48.6`
- `Ln,w 63.3`
- `DeltaLw 20.7`

The old `impact-layer-stack-driven.test.ts` low-confidence expectation
was stale and has been corrected to the owned published-family route.
Gate EF did not move numeric values, retune formulas, import source
rows, touch frontend implementation, promote ASTM `IIC` / `AIIC`, or
derive generic lower-treatment `DeltaLw` outside the composite-panel
published-interaction family.

Gate EF counters:

- `routeBoundaryLedgersPinned: 1`
- `staleLowConfidenceParityRowsCorrected: 1`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
