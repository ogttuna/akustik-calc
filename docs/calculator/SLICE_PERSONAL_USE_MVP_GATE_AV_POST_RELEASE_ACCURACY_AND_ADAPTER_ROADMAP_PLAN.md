# Slice - Personal-Use MVP Gate AV Post-Release Accuracy And Adapter Roadmap

Date: 2026-05-13

Status: landed no-runtime roadmap slice. No runtime movement is
authorized by this file.

Selected current slice:

`personal_use_mvp_coverage_sprint_after_gate_au_daily_use_release_handoff`

Landed previous gate:

`gate_au_personal_use_mvp_daily_use_release_handoff_plan`

Current selected Gate AV action:

`gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan`

Recommended next Gate AW action:

`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`

Recommended next Gate AW file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts`

Gate AV selection status:

`gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw`

## Purpose

Gate AU made DynEcho company-internal daily-use ready inside the current
Personal-Use MVP envelope. Gate AV is the next planning and ranking gate
after that handoff. Its job is not to collect every possible measured
source row and not to move runtime values immediately.

Gate AV must make the next implementation path explicit:

1. Preserve exact measured/source precedence when a source row truly
   matches the requested route, topology, metric, and basis.
2. Preserve formula-backed calculation for source-absent assemblies when
   the physical input contract is complete.
3. Refuse guesses by returning `needs_input` with the precise missing
   physical fields.
4. Keep lab element, field/apparent, building-prediction, ISO, and ASTM
   bases separate.
5. Expand coverage by improving source-absent family solvers and
   adapters before broad source-library crawling.

The current product goal is still an acoustic calculator, not a finite
catalog. Source rows are exact overrides, anchors, calibration evidence,
holdouts, bounds, and regression fixtures. They are not the whole product.

## Implementation Evidence Read Before This Plan

This plan was written after re-reading the active docs and the current
runtime paths around:

- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-au.ts`
- `packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/target-output-support.ts`
- `packages/shared/src/domain/airborne-basis.ts`
- `packages/engine/src/dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor.ts`
- `packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
- `docs/calculator/SYSTEM_MAP.md`

Current implementation posture:

- Candidate resolution is already model-first. Exact rows can win first,
  but source-absent candidates are valid when they carry a named basis,
  support bucket, missing-input contract, and error budget.
- `needs_input` and `unsupported` are first-class outcomes rather than
  hidden failures.
- `target-output-support` keeps unsupported metric/basis requests
  explicit, including ASTM impact ratings such as `IIC` and `AIIC`.
- The shared candidate schema requires non-exact prediction candidates to
  expose an error budget or tolerance class.
- Gate AU's release envelope already covers wall lab, wall field,
  airborne building-prediction, opening/leak lab, floor impact lab,
  floor field, and accepted fail-closed boundaries.

## Current Runtime Coverage Shape

The implementation currently has useful runtime lanes:

- Exact/source candidates remain the first eligible result when the row
  truly matches the assembly and metric basis.
- Wall lab single-leaf and family routes include mass-law / Sharp-Davy /
  Kurtovic-style delegates, AAC/non-homogeneous masonry family physics,
  CLT/mass-timber `Rw`, `STC`, `C`, and `Ctr`, lined massive/masonry
  walls, grouped multi-cavity / triple-leaf routes, and opening/leak
  area-energy `Rw` plus opening/leak ASTM `STC`.
- Wall field/apparent routes are owned for selected lab-family routes
  when explicit field context is present.
- Airborne building prediction now has a named ISO 12354-1 corridor with
  explicit physical owners and `+/-9 dB` source-absent budget.
- Floor impact lab routes include steel, timber joist, and CLT/mass
  timber source-absent formula corridors for `Ln,w` / `DeltaLw` where
  their physical owner sets are complete.
- Floor field routes keep explicit field basis boundaries for
  `L'n,w` / `L'nT,w`.
- Cards, scenario analysis, saved replay, API payloads, and Markdown
  reports are contractually expected to preserve basis, origin, posture,
  support bucket, and budget.

That is enough for daily internal use, but it is not the final accuracy
ceiling.

## Main Remaining Accuracy And Coverage Risks

1. Source-absent arbitrary wall stacks are not yet governed by one
   generalized frequency-domain solver contract. The current family lanes
   are valuable, but a hostile N-layer wall can still fall outside the
   best named delegate if panels, cavities, studs, resilient couplings,
   openings, and linings are mixed in an unowned topology.

2. Some wall routes still return one-number family estimates where later
   rating and field/building adapters would be stronger if they consumed
   a complete one-third-octave direct curve.

3. Floor impact coverage is still family-lane oriented. Steel, timber
   joist, and CLT corridors are useful, but concrete slabs, floating
   screeds, resilient underlays, floor coverings, suspended ceilings, and
   mixed timber/concrete packages need a broader mass-spring /
   dynamic-stiffness gap map before more runtime promotion.

4. Opening/leak element-lab `Rw` and `STC` are owned, but field and
   building adapters for opening/leak composites remain separate
   post-release work.

5. ASTM impact ratings are intentionally not aliases of ISO impact
   metrics. `IIC`, `AIIC`, and related outputs need their own adapter
   contract before becoming supported.

6. Error budgets are honest design budgets, not measured evidence. Budget
   tightening must wait for source-owned holdouts and paired negatives;
   otherwise the calculator would appear more accurate than the evidence
   supports.

7. Material-property defaults and user-entered physical inputs need a
   clearer global map: which properties can be safely defaulted by family,
   which require explicit user input, and which must block as
   `needs_input`.

## External Reference Check - 2026-05-13

The research direction supports a frequency-curve-first calculator, with
single-number outputs derived from the correct rating basis. It does not
support turning DynEcho into a source-row catalog.

Primary and official anchors:

- ISO 12354-1:2017 defines airborne building estimation from element
  performance, direct/indirect flanking transmission, structural
  propagation, and frequency-band calculation before single-number
  rating:
  https://www.iso.org/standard/70242.html
- ISO 12354-2:2017 defines impact building estimation from element
  performance, direct/indirect flanking transmission, structural
  propagation, and frequency-band calculation:
  https://www.iso.org/standard/70243.html
- ISO 717-1:2020 is the airborne single-number and spectrum-adapter
  rating basis:
  https://www.iso.org/standard/77435.html
- ISO 717-2:2020 is the impact single-number and floor-covering /
  floating-floor reduction rating basis:
  https://www.iso.org/standard/69867.html
- ASTM E413 defines STC and related airborne single-number
  classifications for ASTM measurement contexts:
  https://store.astm.org/e0413-10.html
- ASTM E989 defines IIC/AIIC-style impact single-number classification
  from ASTM impact measurement contexts:
  https://store.astm.org/e0989-21.html

Public acoustic-software references are useful only as shape checks, not
as formulas to copy:

- INSUL publicly describes third-octave calculation for walls, ceilings,
  floors, glazing, frames, multilayer shells, coupling models, impact
  floors, and composite sound reduction:
  https://www.k5-akustik.de/en/software/insul/
- Acoulatis publicly describes third-octave airborne and impact
  prediction for individual building elements, with modules for timber,
  steel frame, CLT/LVL, concrete, CMU, brick, and aerated concrete:
  https://www.sonusoft.com/acoulatis
- SONarchitect publicly describes ISO 12354 building calculation in
  one-third-octave bands across separators, flanks, and transmission
  paths:
  https://www.acousticware.com/sonarchitect/index.php/en/sonarchitect-iso/whatit

Research anchor:

- The Herrick paper "A Review of Theories for Sound Transmission through
  Infinite Double Panels" is a useful reminder that double-panel and
  multi-cavity prediction needs impedance / transfer-matrix / stiffness /
  cavity-coupling reasoning rather than a single shortcut formula:
  https://docs.lib.purdue.edu/herrick/210/

Gate AV interpretation:

- Future solver work should prefer frequency-band direct curves where
  possible, then derive `Rw`, `C`, `Ctr`, `STC`, `R'w`, `DnT,w`, `Ln,w`,
  `L'n,w`, and `L'nT,w` through the correct basis-specific adapter.
- One-number shortcuts can remain accepted only when their family scope,
  input contract, uncertainty, and non-aliasing boundaries are explicit.

## Gate AV Decision

Gate AV lands as a no-runtime roadmap and selects Gate AW:

`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`

Gate AW is deliberately a cartography gate. It should not implement a
new solver yet. It should produce an executable, test-backed map of:

- every currently supported route/basis/metric family;
- every current source-absent formula corridor;
- every exact-source precedence boundary;
- every current `needs_input` physical owner set;
- unsupported outputs that are intentionally unsupported;
- realistic layer combinations that still need a stronger source-absent
  solver or adapter;
- the highest-ROI next runtime gate after the map is complete.

The key rule: Gate AW ranks source-absent solver gaps before source-row
acquisition. Source acquisition remains useful for calibration and exact
overrides, but it must not become the main implementation lane unless a
later gate explicitly selects a narrow calibration packet.

## Recommended Post-Gate-AV Order

1. Gate AW - source-absent solver gap cartography.

   No runtime movement. Build an executable matrix that compares current
   implementation coverage against realistic wall and floor assemblies:
   homogeneous massive walls, AAC/non-homogeneous masonry, CLT/mass
   timber, framed double leaf, resilient channels, lined masonry,
   grouped triple leaf, flat multi-cavity, opening/leak composites,
   concrete floors, timber floors, CLT floors, steel floors, floating
   screeds, resilient underlays, suspended ceilings, and field/building
   contexts. The output must rank gaps by personal-use impact and
   accuracy risk.

2. Gate AX - advanced wall source-absent solver contract.

   No runtime movement at first. Select the next wall solver corridor
   from the Gate AW map. The likely winner is a frequency-band
   multi-panel / multi-cavity direct-curve contract that can consume
   panel surface mass, stiffness, loss factor, critical frequency,
   cavity depth, cavity absorption, frame/coupling stiffness, stud
   spacing, resilient connections, and opening/leak sub-elements. The
   contract must define when current family delegates still win and when
   the generalized solver is allowed to run.

3. Gate AY - selected wall solver runtime corridor.

   Runtime movement allowed only after Gate AX closes. Promote one narrow
   lab element route first, with `Rw`, `C`, `Ctr`, and optionally `STC`
   only if the correct rating adapter basis is owned. It must show
   rejected candidates, error budget, exact-source precedence, and nearby
   negative boundaries.

4. Gate AZ - floor impact source-absent solver gap cartography.

   No runtime movement. Expand the floor map beyond current steel,
   timber, and CLT corridors. Target concrete slabs, toppings, floating
   screeds, resilient layers, underlays, load basis, dynamic stiffness,
   floor coverings, suspended ceilings, joist/deck support form, and
   field/building impact context boundaries.

5. Later floor runtime gate - selected impact formula corridor.

   Runtime movement allowed only for a complete family lane selected from
   Gate AZ. It should prefer frequency-band or dynamic-stiffness models
   that can derive `Ln,w` / `DeltaLw` through ISO 717-2 without aliasing
   ASTM `IIC` or field metrics.

6. Later building/opening adapter gate.

   Extend opening/leak composites into field or building prediction only
   after the direct curve, area-energy, flanking, room normalization,
   and uncertainty owners are explicit. Do not reuse lab `Rw` / `STC` as
   `R'w` or `DnT,w`.

7. Later ASTM impact adapter gate.

   Add `IIC` / `AIIC` support only as a named ASTM E989 adapter. It must
   consume the correct one-third-octave impact curve or source-owned ASTM
   basis, not `Ln,w` aliases.

8. Later calibration and budget tightening gate.

   Tighten budgets only after source-owned holdouts, paired negatives,
   rights-safe locator metadata, and residual thresholds exist. Until
   then current design budgets stay visible and honest.

## Gate AW Acceptance Shape

The next implementation gate should add a contract file named:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts`

It should assert:

- landed Gate AV action is
  `gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan`;
- selected next action is
  `gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`;
- no runtime values, tolerances, source rows, API payload values, cards,
  reports, or basis labels move in Gate AV;
- source-absent solver gaps are ranked before broad source crawling;
- exact-source precedence remains first;
- missing physical owners stay `needs_input`;
- lab, field, building, ISO, and ASTM bases remain separated;
- the first selected post-Gate-AW runtime lane is allowed only after the
  gap cartography proves the highest-ROI family and its input contract.

## Runtime Movement Rule

Gate AV and Gate AW must not move runtime. Runtime promotion can resume
only after a later selected formula-corridor gate owns:

- route and metric basis;
- physical input schema;
- family/topology recognition;
- frequency-band or one-number calculation method;
- exact-source precedence;
- rejected candidate reasons;
- `needs_input` owner fields;
- hostile input boundaries;
- error budget or tolerance class;
- card/API/report parity;
- focused tests and at least one broad current-gate revalidation.
