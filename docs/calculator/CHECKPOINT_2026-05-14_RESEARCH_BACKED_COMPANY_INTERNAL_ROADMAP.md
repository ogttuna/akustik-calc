# Research-Backed Company-Internal Calculator Roadmap

Date: 2026-05-14

Document role: analysis checkpoint after reviewing the active
company-internal mainline, current implementation posture, and external
standards/tooling references. This is a roadmap sharpening document, not
a runtime change.

## Bottom Line

The core product rule is correct:

1. Use an exact measured/source row first when assembly, topology,
   metric, and basis truly match.
2. Use nearby measured rows as anchors, calibration evidence, holdouts,
   and negative boundaries.
3. When no exact row exists, calculate with the family-specific solver
   that matches the physical topology.
4. If physical inputs required by that solver are absent, return
   `needs_input` with exact fields.
5. If a metric/basis genuinely has no adapter, return `unsupported`.

The earlier source-heavy work is not wasted. It becomes high-value when
it is wired into exact precedence, calibration, holdout tests, and
negative boundaries. It is harmful only when it replaces solver work or
keeps common source-absent scenarios in `screening_fallback` /
`low_confidence`.

## External Research Findings

The current calculator architecture matches the direction implied by the
standards:

- ISO 12354-1 describes airborne building prediction from element
  performance plus direct/flanking transmission and structural
  propagation terms. It also distinguishes detailed frequency-band
  calculation from restricted simplified single-number calculation.
- ISO 12354-2 applies the same building-estimation concept to impact
  sound between rooms. It also depends on direct/indirect participating
  building elements and can use frequency-band calculation before single
  number rating.
- ISO 717-1 and ISO 717-2 define the single-number rating layer for
  airborne and impact results. They are not permission to freely alias
  `Rw`/`STC`, `Ln,w`/`IIC`, or lab/field/building metrics.
- ISO 10140-2 and ISO 10140-3 are laboratory measurement standards.
  ISO's own abstracts state that lab results are measured with flanking
  suppressed and are not directly field results without accounting for
  flanking, boundary conditions, and loss factors.
- ISO 16283-1 and ISO 16283-2 are field measurement standards for
  airborne and impact insulation. They reinforce that room volume,
  frequency range, measured pressure levels, and rating conversion are
  separate from lab element values.
- INSUL is useful as a benchmark shape for element-level wall/floor
  prediction, but its manual explicitly treats building flanking as a
  separate limitation: it does not directly calculate building flanking
  transmission and uses reminders or limited simple/experimental
  treatments.

The external tool landscape points to the same split:

- Element solvers such as INSUL and Acoulatis focus on wall/floor element
  prediction. Acoulatis explicitly markets third-octave element
  prediction, ISO/ASTM rating output, and modules for concrete, timber,
  steel, CLT, LVL, CMU, brick, and aerated concrete.
- Building solvers such as SONarchitect, CadnaB, and BASTIAN focus on
  ISO/EN 12354 room-pair or whole-building prediction. They need room
  geometry, junctions, flanking paths, databases, and one-third-octave
  results rather than only a layer stack.

DynEcho should therefore keep two explicit calculation kernels:

1. element solver kernel: lab wall/floor family physics, exact source
   precedence, spectrum/rating adapters, and source-absent error budget;
2. field/building adapter kernel: room area/volume/RT60, direct curve,
   junction/coupling, flanking energy, normalization basis, and separate
   building uncertainty.

That is the practical answer to "why formulas do not cover everything":
the formula can be correct only after the route has selected the right
kernel and required physical owners for that kernel.

References:

- ISO 12354-1:2017:
  https://www.iso.org/standard/70242.html
- ISO 12354-2:2017:
  https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/02/70243.html
- ISO 717-1:2020:
  https://www.iso.org/standard/77435.html
- ISO 717-2:2020:
  https://www.iso.org/standard/69867.html
- ISO 10140-2:2021:
  https://www.iso.org/standard/79487.html
- ISO 10140-3:2021:
  https://www.iso.org/standard/79483.html
- ISO 16283-1:2014:
  https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/05/59/55997.html
- ISO 16283-2:2020:
  https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/74/77436.html
- Marshall Day / INSUL software page:
  https://marshallday.com/software
- INSUL manual, flanking section:
  https://www.insul.co.nz/media/30049/Insul-Manual-2017-word-version.pdf
- Acoulatis software page:
  https://www.sonusoft.com/acoulatis
- SONarchitect ISO page:
  https://www.acousticware.com/sonarchitect/index.php/en/sonarchitect-iso/whatit
- CadnaB building acoustics page:
  https://www.datakustik.com/products/cadnab/cadnab-for-building-acoustics
- BASTIAN overview:
  https://www.schallmessung.com/bastian/

## Current Implementation Read

DynEcho already has the correct spine:

- exact/source precedence exists;
- source-absent formula corridors exist across steel, timber/CLT,
  heavy/reinforced concrete impact, opening/leak, AAC/masonry,
  lined/mass-timber walls, heavy-composite walls, field context, and
  building-prediction corridors;
- route input surfaces and APIs already move many physical inputs into
  runtime rather than hard-coded fixture cases;
- visible cards/reports/API payloads already carry basis, origin,
  support bucket, and error budget for many live corridors;
- hostile-input testing exists for many-layer, duplicate, reorder,
  unsupported, and source-precedence cases.

The remaining readiness problem is narrower than "we have no
calculator". The issue is that the company-internal path still needs a
strict acceptance envelope and a few common complete-input routes must
not end in `screening_fallback`, `low_confidence`, or a proxy nearby-row
answer.

## Implementation Vs Docs Audit - 2026-05-14 Follow-Up

After comparing the docs with the current runtime and executable matrix,
the important correction is this:

- Airborne building prediction is not greenfield anymore. Gate AR/AS/AT
  already have complete-context runtime coverage. A complete lined
  massive building-prediction request supports `R'w 58` and `DnT,w 59`
  through
  `gate_ar_airborne_building_prediction_all_owner_runtime_corridor` with
  the Gate O/AQ `+/-9 dB` building-prediction error budget.
- The current company-internal matrix still lags that fact. The active
  matrix has 61 rows and still includes only the stale
  `wall.building_prediction_missing_context.needs_input` building row in
  the mainline acceptance view. So the selected company-internal
  building file must be a reconciliation/acceptance contract, not a
  from-scratch solver plan.
- The steel suspended-ceiling `DeltaLw` owner prompt has landed, but
  numeric `DeltaLw` runtime has not. `Ln,w 62.2` is live for the
  suspended-ceiling-only route; `DeltaLw` still correctly asks for
  `toppingOrFloatingLayer`,
  `resilientLayerDynamicStiffnessMNm3`, and `loadBasisKgM2`.
- A hidden acceptance issue remains in the matrix: the heavy concrete
  floating-floor row has `family_physics` posture but still carries
  runtime origin `screening_fallback` through
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`. That may be
  physically acceptable as an Annex-C estimate, but it must be
  reclassified with an owned basis or marked out of the company-internal
  complete-input envelope. It should not silently pass a "zero
  screening" promise.
- The docs were drifting toward "selected building owner must promote
  runtime". More precise wording is: selected building owner must import
  and prove the existing Gate AR/AS/AT runtime facts in the
  company-internal acceptance matrix, keep partial context as exact
  `needs_input`, and keep lab/field/building aliases blocked.

Landed reconciliation file:

`packages/engine/src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts`

Landed gate:

`company_internal_airborne_building_prediction_runtime_terms_owner_contract_plan`

Selection status:

`company_internal_airborne_building_prediction_runtime_terms_owner_contract_landed_selected_matrix_v2_refresh`

That work reconciled the existing Gate AR/AS/AT building-prediction
runtime with the company-internal mainline:

- complete building context proves current `R'w 58` / `DnT,w 59`,
  method, candidate id, and `+/-9 dB` budget;
- partial context proves exact missing-input paths;
- broad `Rw`/`STC` requests under building context stay unsupported for
  lab metrics;
- opening/leak building context stays unsupported until a later adapter
  owns it;
- successful reconciliation selected
  `company_internal_calculation_grade_mainline_matrix_v2_refresh_plan`,
  with selected file
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts`.

The selected matrix v2 refresh has now landed:

`company_internal_calculation_grade_mainline_matrix_v2_refresh_plan`

Selection status:

`company_internal_calculation_grade_mainline_matrix_v2_refresh_landed_selected_steel_suspended_ceiling_delta_lw_runtime_corridor`

Matrix v2 preserves the accepted Gate AT building runtime rows, retires
the stale `wall.building_prediction_missing_context.needs_input` row,
turns steel suspended-ceiling `DeltaLw` into a precise `needs_input`
owner prompt, and records the heavy-floating floor route through the
owned ISO 12354 Annex-C estimate instead of a hidden `screening_fallback`
origin.

Current selected next action:

`company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan`

Current selected next file:

`packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts`

## Roadmap Decision

Stop broad source crawling and broad planning loops. The next work must
be measured by whether it removes an in-scope company scenario from
`screening`/`low_confidence`, or turns it into a precise `needs_input` /
`unsupported` boundary.

### Phase 0 - Refresh The Company-Internal Acceptance Envelope

Status: landed by
`company_internal_calculation_grade_mainline_matrix_v2_refresh_plan`.

Refresh one executable company-internal acceptance matrix with plain
scenario rows:

- route: wall or floor;
- basis: lab, field/apparent, or building prediction;
- requested metrics;
- physical inputs required;
- expected state: exact, calibrated/family physics, bounded formula,
  `needs_input`, or `unsupported`;
- forbidden final states: `low_confidence`, `screening_fallback`, live
  proxy nearby-row fallback, lab/field/building alias;
- UI/API/report parity owner;
- hostile variants: many layers, duplicate roles, safe/unsafe reorder,
  missing required fields, wrong metric basis.

Closure signal:

- In-scope complete scenarios have zero selected
  `screening_fallback`, zero `low_confidence`, and zero
  `predictor_floor_system_low_confidence_estimate` finals.
- Out-of-scope scenarios are explicitly marked as `needs_input` or
  `unsupported`, not hidden in old docs.
- The matrix preserves latest Gate AT building runtime rows and latest
  steel suspended-ceiling `DeltaLw` owner state instead of reporting an
  older company-internal selection.
- The heavy concrete floating-floor `screening_fallback` origin is
  either reclassified to an owned ISO 12354 Annex-C family estimate with
  visible budget or split out as not yet company-internal complete.

### Phase 0.5 - Steel Suspended-Ceiling DeltaLw Runtime Corridor

Status: landed by
`company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan`.

Promote numeric ISO lab `DeltaLw` only for the complete steel
suspended-ceiling route that already owns `Ln,w 62.2` and now names the
remaining upper/reference package fields:

- `toppingOrFloatingLayer`;
- `resilientLayerDynamicStiffnessMNm3`;
- `loadBasisKgM2`.

Required closure:

- exact source rows still win;
- missing owner fields stay `needs_input`;
- ASTM `IIC` / `AIIC`, field/building, and `L'nT,50` stay blocked;
- visible surfaces carry the same not-measured formula basis and error
  budget as the engine result.

Landed runtime:

- complete lower suspended-ceiling plus upper/reference package input
  returns lab `Ln,w 51.6` / `DeltaLw 22.4`;
- missing `toppingOrFloatingLayer` blocks the formula instead of broad
  fallback;
- selection status:
  `company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_landed_selected_surface_parity`;
- selected next action:
  `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan`;
- selected next file:
  `packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts`.

### Phase 1 - Building Prediction Runtime Terms Reconciliation

Use the selected company-internal file to prove that the existing
building-prediction runtime is company-internal acceptable.

Required owner terms:

- direct separating-element frequency curve from the selected wall
  solver;
- flanking path energy contribution;
- junction/coupling terms, including junction class and coupling length;
- room standardization terms, including separating area, source-room
  volume, receiving-room volume, and receiving-room RT60;
- `R'w` / `DnT,w` uncertainty budget and visible not-measured posture.

Closure signal:

- Complete building-prediction context returns `R'w` / `DnT,w` through
  the owned building-prediction basis, with visible uncertainty.
- Missing building context returns exact `needs_input` fields.
- Lab `Rw`/`STC` and field-between-rooms values are not reused as
  building results.

If the existing runtime fails this contract, do not start another broad
gate. Implement the smallest missing runtime owner or keep the failing
building row out of the company-internal in-scope envelope until that
owner lands. If it passes, update the matrix and move to the next
calculation gap.

### Phase 2 - ISO Floor Impact Mainline

Prioritize the floor cases users will enter most often:

1. Steel suspended-ceiling / upper-package `DeltaLw`.
   - The owner prompt has landed.
   - Next runtime work should compute `DeltaLw` when
     `toppingOrFloatingLayer`, `resilientLayerDynamicStiffnessMNm3`,
     and `loadBasisKgM2` are complete.
   - Keep `Ln,w 62.2` live for the suspended-ceiling-only route and
     keep `DeltaLw` blocked until the upper/reference package exists.
2. Floor field outputs `L'n,w` / `L'nT,w`.
   - Use explicit field context: area, receiving-room volume, RT60,
     normalization basis, and flanking/junction assumptions.
   - Keep `L'nT,50` blocked until a low-frequency owner exists.
3. Reinforced/heavy concrete combined routes.
   - Preserve the newer combined upper/lower formula corridor.
   - Any leftover low-confidence fallback must become owned formula or
     `needs_input`.

Closure signal:

- Common steel, timber/CLT, and reinforced/heavy concrete floor
  scenarios return ISO lab/field outputs from named solvers or precise
  prompts.
- ASTM `IIC` / `AIIC` remains parked unless explicitly reselected.

### Phase 3 - Wall Airborne Solver Cleanup

Prioritize wall cases that a company user will actually build:

1. Complete lined massive/heavy-core and heavy-composite walls.
2. Double/framed and grouped multi-cavity walls with explicit topology.
3. Triple-leaf/Rockwool-like scenarios where old screening guards still
   exist.
4. Opening/leak composite lab `Rw`/`STC` and field/building boundaries.

Closure signal:

- Complete in-scope wall inputs use exact source, calibrated/family
  physics, or bounded formula.
- Partial grouped topology returns missing fields.
- Stale `multileaf_screening_blend` / split-Rockwool guards stay
  historical unless they are upgraded to a real solver or marked out of
  scope.

### Phase 4 - Targeted Calibration, Not Broad Source Crawling

Source work should continue only as targeted packets tied to a solver
decision:

- same-stack ISO lab `DeltaLw` holdouts for steel floors;
- same-family wall/floor measured frequency curves for solver residuals;
- paired negative rows that prove a similar-looking source must not
  match;
- exact-row promotions only when topology, metric, basis, and rights-safe
  metadata are complete.

Closure signal:

- Every imported source row has one role: exact override, calibration,
  holdout, negative boundary, or acquisition lead.
- No source row silently changes runtime values without residual-policy
  tests and visible docs.

## Test Strategy

The calculator should be tested like a calculator, not like a library:

- value pins for `Rw`, `R'w`, `DnT,w`, `Ln,w`, `DeltaLw`, `STC`, `C`,
  `Ctr` where applicable;
- metric basis and origin assertions;
- exact source precedence tests;
- wrong-basis negative tests (`STC` vs `Rw`, `IIC` vs `Ln,w`, lab vs
  field/building);
- missing-input issue-path tests;
- hostile layer tests: many layers, duplicates, split roles, safe and
  unsafe reorder;
- UI/API/report parity tests for every newly supported metric;
- one company-internal matrix test that fails if any complete in-scope
  row falls back to `screening_fallback` or `low_confidence`.

## Plain Priority List

1. Refresh the company-internal acceptance matrix so it reflects Gate AT
   building runtime, latest steel `DeltaLw` owner prompts, and the
   heavy-concrete floating-floor origin cleanup.
2. Promote steel suspended-ceiling `DeltaLw` runtime when upper/reference
   package inputs are complete.
3. Promote ISO floor field `L'n,w` / `L'nT,w`; keep `L'nT,50` blocked.
4. Clean wall heavy-core/double/framed/triple screening remnants.
5. Add targeted calibration packets only when they directly tighten or
   validate a selected solver.

This is the route to company-internal readiness: fewer broad "what next"
documents, more executable scenarios that either calculate with a named
solver or ask for the exact missing physical fields.
