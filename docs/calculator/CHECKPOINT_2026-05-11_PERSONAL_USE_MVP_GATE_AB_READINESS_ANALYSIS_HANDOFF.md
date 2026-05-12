# Personal-Use MVP Gate AB Readiness Analysis Handoff

Date: 2026-05-11

## Status

This is a planning-only checkpoint after Gate AA. It does not move
runtime values, formulas, tests, APIs, or workbench behavior.

Current selected status remains:

`gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_landed_selected_flat_multicavity_input_surface_gate_ab`

Selected next action remains:

`gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan`

Selected next file remains:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab-flat-multicavity-topology-input-surface-contract.test.ts`

## Route Check

The route is still correct.

Gate AA proved the current 40-row personal-use matrix is gap-free, but
the new flat/many-layer multicavity wall row is correctly blocked as
`needs_input`. That is not a failure; it is the exact product gap that
must be closed next. A realistic calculator user can enter a long layer
schedule, but the engine must not guess which layers are side A leaf,
cavity 1, internal leaf, cavity 2, side B leaf, and support topology.

The current implementation already has the right underlying shape:

- `AirborneContext.wallTopology` can carry side leaf groups, cavity
  depths, cavity fill/absorption, internal leaf group, internal leaf
  coupling, and support topology.
- `buildDynamicCalculatorRouteInputTopologyAssessment` already names
  those missing physical fields instead of promoting an ambiguous result.
- Existing grouped triple-leaf workbench tests prove row-number parsing,
  persistence, and safe grouped topology conversion are possible.
- Existing runtime solvers can handle complete grouped double/triple
  leaf routes; the missing piece is the product input contract that lets
  a flat user schedule become an explicit physical topology.

## Why Gate AB Beats Alternatives

Gate AB has the best ROI because it unlocks realistic user behavior
without weakening basis honesty.

- It directly improves calculator usability for common wall stacks with
  many boards, membranes, insulation layers, and cavities.
- It reduces the largest current ambiguity: unsafe autogrouping from
  visual layer order.
- It uses existing schema and solver paths, so implementation risk is
  lower than a new field/building formula corridor.
- It keeps source rows in their correct role: exact overrides, anchors,
  calibration evidence, holdouts, and bounds, not the whole product.

The alternatives remain lower priority right now:

- Opening `STC` needs a spectrum/rating adapter and has basis leakage
  risk if it is treated like `Rw`.
- Building prediction needs executable direct, flanking, junction, room
  normalization, and error-budget owners before it can produce defended
  runtime terms.
- ASTM `IIC` / `AIIC` must not be aliased from ISO `Ln,w`.
- Broad source crawling does not solve source-absent layer combinations
  and should stay unselected until a specific exact/holdout unblocker is
  named.

## Gate AB Acceptance Shape

Gate AB should be a first input-surface contract, not a source crawl and
not a formula retune.

It should prove:

1. Flat many-layer multicavity walls continue to return `needs_input`
   with precise missing fields when topology ownership is absent.
2. A complete explicit topology owner set includes side A leaf group,
   cavity 1 depth/fill/absorption, internal leaf group, internal leaf
   coupling, cavity 2 depth/fill/absorption, side B leaf group, and
   support topology.
3. Invalid layer groups are refused: out-of-range row ids, duplicate
   indices, overlapping leaf/cavity groups, empty required groups, and
   stale groups after preset/load changes.
4. Safe grouped topology reaches the owned family solver without moving
   current pinned values.
5. Field, building, opening `STC`, and ASTM routes stay blocked unless
   their own basis owners are explicit.

## Recommended Sequence

1. Gate AB: engine/shared input contract for flat multicavity topology
   ownership and missing-input prompts.
2. Gate AC: workbench/API/saved-snapshot/report parity for the same
   physical topology fields.
3. Gate AD: broad revalidation and company-internal pilot readiness
   rehearsal over the expanded matrix and visible surfaces.
4. Re-rank next lane from evidence after Gate AD; likely candidates are
   opening `STC` spectrum adapter, field/building runtime terms, or
   floor input polish, but the matrix should decide.

## Company-Internal Readiness Signal

Controlled company-internal pilot becomes reasonable after Gate AB plus
surface parity and revalidation, provided:

- common wall/floor rows stay green with numeric pins, basis labels, and
  error budgets;
- ambiguous topology cases visibly ask for missing physical inputs;
- cards, saved replay, APIs, Markdown/PDF/DOCX reports agree;
- exact source precedence and lab/field/building separation remain
  executable tests;
- current-gate and at least one broad revalidation pass remain green.
