# Company-Internal Remaining Gap Analysis And Plan

Date: 2026-05-15

## Decision

The active company-internal mainline is still valid, but the remaining
work should not be described as "2-3 iterations" anymore. The first two
slices below, the opening/leak `Dn,A` / `DnT,A` formula and runtime
corridors, have now landed. The realistic controlled company-internal
readiness path is:

1. opening/leak `Dn,A` / `DnT,A` formula corridor - landed;
2. opening/leak `Dn,A` / `DnT,A` runtime corridor - landed;
3. opening/leak `Dn,A` / `DnT,A` card/API/report surface parity - landed;
4. company-internal Matrix V6 refresh after that surface parity - landed;
5. building partial-context and ASTM parked-boundary revalidation - landed;
6. final internal-use rehearsal with the current gate and a plain
   operating envelope.

If the formula corridor and runtime corridor are clean, this is a
six-slice path. If surface/report or matrix drift appears, expect seven
or eight slices. More than that should happen only if the acceptance bar
changes to require ASTM `IIC` / `AIIC` runtime or a large new exact-source
calibration packet before internal use.

## Current Implementation Read

The current code and docs agree on the immediate stop point after the
runtime-corridor implementation:

- Active slice: `company_internal_calculation_grade_mainline`.
- Latest landed gate:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`.
- Selection status:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_landed_selected_surface_parity`.
- Current selected next action:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`.
- Current selected next file:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts`.
- Current selected next label:
  opening/leak Dn,A / DnT,A card/report/API parity.

At the time of the initial checkpoint read, the selected next test file
did not exist yet. That was expected because it was the next
implementation slice.

2026-05-15 update: that first slice has now landed as
`company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`
with selection status
`company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
The formula corridor pins field `Dn,A 35.9`, field `DnT,A 36.1`, and
building `DnT,A 31.3` as no-runtime design estimates. The selected next
action is
`company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`;
selected next file:
`packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts`;
selected next label: opening/leak Dn,A / DnT,A spectrum-adapter runtime corridor.

2026-05-15 runtime update: the runtime corridor has now landed as
`company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`
with selection status
`company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_landed_selected_surface_parity`.
The runtime pins field `Dn,A 35.9`, field `DnT,A 36.1`, and building
`DnT,A 31.3` when `frequencyBandSet` is present. Missing
`frequencyBandSet` keeps A-weighted outputs unsupported with a precise
warning. Field budget is `+/-9 dB`; building budget is `+/-11 dB`.

2026-05-15 surface update: the surface parity slice has now landed as
`company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`
with selection status
`company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_landed_selected_matrix_v6_refresh`.
It keeps field `Dn,A 35.9`, field `DnT,A 36.1`, and building
`DnT,A 31.3` frozen while carrying the frequency band set through cards,
report, API, saved replay, server snapshot replay, and the workbench
input surface. The previous `frequencyBandSet` UI caveat is closed; the
next selected action is
`company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`
with selected file
`packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts`
and selected label: company-internal matrix v6 refresh after opening/leak Dn,A / DnT,A surface parity.

Matrix V5 currently reports:

- 65 executable rows;
- 36 `family_physics`, 5 `exact`, 2 `source_anchored_delta`, 16
  `needs_input`, and 6 `unsupported`;
- 0 hidden complete-input `screening_fallback` rows;
- 0 `coverage_gap` failure-class rows;
- remaining blocker rows:
  `wall.opening_leak_a_weighted_boundary.unsupported`,
  `wall.opening_leak_building_missing_owner.needs_input`,
  `wall.building_prediction_partial_context.needs_input`,
  `floor.astm_iic_aiic_boundary.unsupported`,
  `floor.lightweight_steel_suspended_ceiling_astm.unsupported`, and
  `floor.reinforced_concrete_combined_astm_iic.unsupported`.

The first blocker is the only high-ROI calculation-grade blocker that is
both complete-input and common-user-facing in the ISO mainline. The
building missing-owner rows are correct `needs_input` behavior. The ASTM
rows are intentionally parked boundary history, not the next ISO-first
internal-use lane.

2026-05-15 Matrix V6 / boundary update: Matrix V6 and the
building/ASTM boundary revalidation are now landed. Matrix V6 has 71
rows, preserves field `Dn,A 35.9`, field `DnT,A 36.1`, and building
`DnT,A 31.3`, and the boundary revalidation keeps `sourceRoomVolumeM3`
building prompts as `needs_input` while ASTM `IIC` / `AIIC` rows stay
unsupported. The remaining mainline slice is the final internal-use
rehearsal.

## External Research Refresh

The standards and current acoustic software landscape support the same
implementation direction already in the docs:

- ISO 717-1:2020 defines airborne single-number ratings from
  octave/one-third-octave measurement results and accounts for different
  sound spectra. It is a rating/spectrum-adaptation layer, not a license
  to alias lab `Rw` or `STC` into field/building `Dn,A` / `DnT,A`.
- ISO 16283-1:2014 is the field-measurement layer for airborne sound
  between rooms. It reinforces that room context and frequency-dependent
  results precede the single-number rating conversion.
- ISO 12354-1:2017 building prediction combines element performance with
  direct/indirect flanking and structural propagation terms. Building
  outputs cannot be borrowed from lab or simple field outputs without the
  owned building route.
- INSUL and Acoulatis show the same industry split: element-level
  wall/floor prediction is separate from whole-building ISO 12354
  workflows and needs frequency-band information for stronger adapters.

This means the next slice should not crawl more source rows. Source rows
remain valuable as exact overrides, anchors, holdouts, and calibration
evidence, but the current blocker is a route-owned spectrum adapter
problem.

Reference links checked for this refresh:

- ISO 717-1:2020:
  https://www.iso.org/standard/77435.html
- ISO 16283-1:2014:
  https://www.iso.org/standard/55997.html
- ISO 12354-1:2017:
  https://www.iso.org/standard/70242.html
- INSUL Version 10 overview:
  https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf
- Acoulatis / Sonusoft building acoustic software overview:
  https://www.sonusoft.com/

## Landed Slice - Formula Corridor

`company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`
has landed as a no-runtime contract in
`packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.ts`.

The formula corridor defines:

- field targets: `Dn,A` and `DnT,A`;
- building target: `DnT,A` only;
- building `Dn,A` remains unsupported because the current building
  opening/leak route owns apparent `R'w` and standardized `DnT,w`, not
  local `Dn,w`;
- required same-route base values:
  - field `Dn,w` and `DnT,w`;
  - building `DnT,w`;
- required physical inputs from the owner gate, especially
  `frequencyBandSet`;
- required owner inputs from the owner gate:
  same-route A-weighted spectrum curve owner, ISO 717 `C` or A-weighted
  adapter policy, A-weighted uncertainty budget, exact packet precedence,
  and lab `Rw` / `STC` alias guard;
- candidate formula policy:
  - field `Dn,A = Dn,w + ownedAdapterDb`;
  - field `DnT,A = DnT,w + ownedAdapterDb`;
  - building `DnT,A = DnT,w + ownedAdapterDb`;
  - the current owner probes expose `cAdapterDb = -0.8`, so the expected
    first pins are field `Dn,A 35.9`, field `DnT,A 36.1`, and building
    `DnT,A 31.3` if the corridor accepts the current C-adapter as the
    owned adapter;
- budget policy:
  keep the base field/building budgets no tighter than `+/-8 dB` field
  and `+/-10 dB` building, and add an explicit adapter-budget term rather
  than presenting the result as measured evidence.

The negative tests must prove:

- no lab `Rw` / `STC` alias to `Dn,A` / `DnT,A`;
- no ASTM `IIC` / `AIIC` alias;
- no building `Dn,A` promotion;
- missing `frequencyBandSet` returns `needs_input`;
- missing spectrum/adapter/budget owners return owner-missing status;
- exact A-weighted packet precedence remains reserved for a true exact
  same-basis source row.

## Landed Slice - Runtime Corridor

`company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`
has landed in
`packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.ts`.

The runtime corridor now:

- supports field `Dn,A` and field `DnT,A` from same-route `Dn,w` /
  `DnT,w` plus the `-0.8 dB` adapter;
- supports building `DnT,A` from same-route building `DnT,w` plus the
  `-0.8 dB` adapter;
- uses
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor`
  as the runtime basis;
- selects
  `candidate_company_internal_opening_leak_a_weighted_family_physics_prediction`;
- keeps building `Dn,A`, lab `Rw` / `STC`, ASTM `IIC` / `AIIC`, and
  missing `frequencyBandSet` as fail-closed boundaries.

## Following Slices

After this landed surface parity, continue in this order.

1. Matrix V6 refresh:
   retire `wall.opening_leak_a_weighted_boundary.unsupported` only after
   supported field/building A-weighted rows are pinned, and add negatives
   for building `Dn,A`, lab alias, ASTM alias, missing band set, and
   exact-source precedence.
2. Boundary revalidation:
   prove the two building `needs_input` rows still produce exact missing
   fields and the three ASTM rows remain intentionally parked.
3. Final internal-use rehearsal:
   run the current calculator gate, focused A-weighted/formula/surface
   suites, whitespace guard, and a plain operating-envelope note that
   says exactly which ISO routes are supported and which rows are parked.

## Acceptance Bar

Controlled company-internal readiness can be called only when:

- complete in-scope ISO rows do not end as `low_confidence`,
  `screening_fallback`, live nearby-row proxy fallback, or lab/field/
  building alias;
- exact measured/source rows still win only on true assembly, topology,
  metric, and basis match;
- missing physical context returns precise `needs_input`;
- unsupported ASTM or wrong-basis requests stay visibly unsupported;
- output cards, API payloads, saved replay, and reports agree on value,
  basis, origin, and budget;
- `pnpm calculator:gate:current` and the focused current-slice tests are
  green.

## What This Means For Planning

The project is not months away from a controlled internal ISO-first pilot
unless the scope changes. It is also not one magic iteration away. The
remaining path is a small sequence of explicit calculator slices:
surface, matrix, boundary revalidation, release rehearsal.

Broad source acquisition should stay behind this path. It becomes the
next best investment only after the ISO-first internal pilot is green or
when a specific solver needs source-owned holdouts to tighten its error
budget.
