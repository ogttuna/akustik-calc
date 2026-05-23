# Checkpoint - Acoustic Calculator Answer Engine V1 Reconciliation - 2026-05-22

Status: checkpoint after reading active docs, comparing the current
implementation, running probes, and re-running the current calculator
gate.

Superseded for current-state handoff by
[CHECKPOINT_2026-05-23_POST_V1_ACOUSTIC_CALCULATOR_STATE_RECONCILIATION.md](./CHECKPOINT_2026-05-23_POST_V1_ACOUSTIC_CALCULATOR_STATE_RECONCILIATION.md).
Keep this file as the historical reconciliation that selected and then
started Answer Engine V1.

## User Intent

The requested product is simple:

- user brings an acoustic project;
- user chooses wall or floor;
- user enters layers, order, thicknesses, and the extra physical inputs
  that are genuinely required by the selected acoustic route;
- DynEcho returns the acoustic answer: `Rw`, `R'w`, `DnT,w`, `Ln,w`,
  `L'n,w`, STC, `C`, `Ctr`, `CI`, `CI,50-2500`, and related outputs on
  the correct basis.

The product is the answer, not the test suite.

## Method

The answer method must be:

1. exact measured answer when the same construction, metric, and basis
   truly match;
2. compatible measured anchor only when family, topology, metric basis,
   and physical delta are owned;
3. calibrated formula family when calibration evidence applies;
4. source-absent formula family when no matching measured row exists;
5. `needs_input` only when a real physical input needed by that formula
   is missing;
6. `unsupported` only when DynEcho has no bounded method for that basis.

Basis boundaries are mandatory. Lab `Rw` is not field `R'w`, lab
`Ln,w` is not ASTM IIC, and STC must not be copied from `Rw` unless a
named adapter owns that relationship.

## Not Wanted

Do not steer the project toward:

- a source-row catalog as the product;
- a finite scenario library;
- another narrow scenario pack instead of answer selection;
- a broad source crawl as the next move;
- tolerance retuning without measured holdouts;
- low-confidence wording as a substitute for choosing the best owned
  formula;
- lab/field/building or ISO/ASTM aliasing;
- deleting existing solver lanes that can feed the answer engine.

## Documents Reviewed

- `AGENTS.md`
- `docs/README.md`
- `docs/foundation/PROJECT_PLAN.md`
- `docs/calculator/README.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/MASTER_PLAN.md`
- `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`
- `docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md`
- `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md`
- `docs/calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md`

These documents now agree that the active next work is
`acoustic_calculator_answer_engine_v1_plan` in
`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`.

## Implementation Read

Useful pieces that exist and should be reused:

- exact/source rows and source precedence rules;
- shared layer-combination candidate registry;
- runtime-basis-to-candidate adapter;
- candidate trace surface on engine, API, workbench, replay, and report
  paths;
- single-leaf source-absent formula runtime;
- explicit double-leaf/framed wall source-absent formula runtime;
- grouped/triple-leaf wall lanes;
- floor exact, package-transfer, supported-band, raw-bare,
  helper-only, direct-fixed, field/building boundary, and ASTM/IIC
  blocker lanes.

Product layer status after the first V1 slice:

- `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`
  now exists;
- the first answer-selection boundaries are live for missing wall
  physical inputs and roleless helper-only floor impact publication;
- the project still needs broader answer selection across every exact,
  anchor, calibrated formula, source-absent formula, `needs_input`, and
  unsupported candidate family.

## Runtime Probes

Local probes through `calculateAssembly` confirmed:

- single 12.5 mm gypsum board works through
  `candidate_layer_combination_resolver_single_leaf_mass_law_banded_source_absent_family_solver`
  and returns `Rw 31` / STC 31 with candidate trace;
- explicit gypsum / rockwool / gypsum double-leaf context works through
  `candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`
  and returns `Rw 45` / STC 45 / `C -1` / `Ctr -6.1` with candidate
  trace;
- flat gypsum / rockwool / gypsum without topology now selects a traced
  double-leaf missing-input boundary;
- resilient-channel double-leaf with missing `resilientBarSideCount`
  now selects `needs_input` and parks wall answer outputs instead of
  publishing `Rw` / STC / `C` / `Ctr`.

## Validation

Initial `pnpm calculator:gate:current` run failed one stale
documentation-alignment assertion:

- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`
  still required the active calculator README to contain
  `calculator_model_first_physics_prediction_pivot_v1`.

That test was updated so active docs assert the answer-engine plan, while
the old model-first Gate A remains preserved as historical foundation.

Initial validation after the doc-alignment update:

- targeted Gate A test: 1 file / 5 tests passed;
- this was superseded by the implementation validation below.

## Implementation Update - 2026-05-22

The first Answer Engine V1 implementation slice landed after this
reconciliation pass:

- added shared `acousticAnswerBoundary` payloads for engine/API result
  objects;
- added the V1 contract test file and covered single-leaf, explicit
  double-leaf, helper-only floor formula, wall missing-input parking,
  flat double-leaf missing topology, and roleless helper-only floor
  missing-role behavior;
- parked wall answer outputs when `resilientBarSideCount` is missing;
- parked flat gypsum / absorber / gypsum from screening and exposed the
  required double-leaf ownership fields;
- parked roleless helper-only timber/open-web impact publication until
  floor roles are supplied, while preserving raw floor screening and
  field-airborne carrier routes that do not publish helper-only impact
  values;
- surfaced floor answer-engine missing-role boundaries as `needs_input`
  cards in the workbench.

Latest validation:

- targeted engine V1 and related resolver/helper-only tests passed;
- targeted web output/resolver/helper-only tests passed;
- targeted Step 3 answer-engine and registry validation passed: 7 files
  / 51 tests;
- targeted Step 3 web parity validation passed: 1 file / 11 tests;
- `pnpm calculator:gate:current` passed with engine 510 files / 2912
  tests, web 94 files / 397 passed + 18 skipped, repo build 5 / 5, and
  whitespace guard passed.

Follow-up implementation after that pass extended the same exact
metric-scope rule to floor exact rows and impact-only exact floor
traces. Exact floor-family traces now pin only owned floor metrics
(`Rw`, derivable `C`/`Ctr` where declared, `Ln,w`, `CI`,
`CI,50-2500`, `Ln,w+CI`) and no longer advertise `STC`, ASTM/IIC
aliases, or broad field metrics as exact measured floor capabilities.

The latest follow-up also maps exact ISO 717-2 impact-band sources into
the resolver on `exact_source_band_curve_iso7172`. Lab exact impact-band
traces now pin only owned ISO impact metrics such as `Ln,w`, `CI`,
`CI,50-2500`, and `Ln,w+CI`; field exact impact-band traces use
`field_apparent` for owned metrics such as `L'nT,w` and `LnT,A`; ASTM
`IIC`/`AIIC` remains an unsupported boundary instead of an ISO impact
alias. Mixed exact impact-band plus floor airborne requests now keep the
source-absent airborne values on their own calculation basis: the exact
impact resolver trace supports and pins only impact-owned outputs such
as `Ln,w` and `CI`, so `Rw`, STC, `C`, and `Ctr` do not appear as if
they were owned by the ISO 717-2 impact source.

Follow-up implementation after that pass added a shared owner-audit
helper on assembly and impact-only paths. The helper enforces exact
metric ownership when exact traces declare owned metrics, and it enforces
active `needs_input`, `unsupported`, and `basis_boundary` stops only for
the outputs named by that boundary. This keeps exact impact-band and
answer-stop leaks closed while avoiding a broad formula/anchor shutdown
before the Step 2 wall and Step 3 floor acceptance matrices finish those
owner surfaces.

Follow-up implementation after that pass landed the engine side of Step
2 Wall V1 Acceptance Matrix. The matrix covers exact measured
same-stack metric scope, reversed exact same-stack matching,
source-absent single-leaf and double-leaf formulas, missing double-leaf
topology, missing resilient side count, grouped multicavity
`needs_input`, complete wall field-apparent context, partial wall field
context, and unsupported building/opening ownership. Complete Gate I
wall `field_between_rooms` requests now select
`wall.airborne_field_context.field_apparent_adapter`, trace as
`field_apparent`, and pin owned `R'w` / `DnT,w` field values instead of
losing the wall route to incidental floor artifacts.

Follow-up implementation after that pass closed the Step 2 wall
UI/API/report parity bar. The workbench candidate-surface parity test
now covers exact wall metric scope, complete wall field-apparent values,
partial wall field `needs_input`, and unsupported wall
building/opening boundaries across output cards, Markdown report lines,
and `/api/estimate` payloads. It also fixed the card precedence for
unsupported wall building/opening field outputs so those cards remain
`unsupported` instead of being relabeled as missing field input.

Follow-up implementation after that pass added a pure floor ASTM
`IIC` / `AIIC` unsupported answer boundary. Assembly and impact-only
requests whose target outputs are only `IIC` / `AIIC` now select
`generic.astm_iic_aiic.unsupported_boundary`, expose the required owner
terms `astmRatingCurveOwner`, `astmReferenceContour`, and
`testStandardBasis`, and keep resolver supported metrics and value pins
empty. Mixed requests that include owned ISO metrics continue to use the
exact or formula floor candidate for those owned metrics while keeping
ASTM outputs unsupported.

Follow-up implementation after that pass added a pure floor field-impact
`L'n,w` / `L'nT,w` missing-context answer boundary. Assembly requests
with lab impact evidence but no field context now select a floor
`needs_input` trace requiring `contextMode`, `partitionAreaM2`,
`receivingRoomVolumeM3`, `receivingRoomRt60S`, and
`impactFieldContext`. Impact-only requests ask for
`impactFieldContext`. Mixed exact floor requests can still publish owned
lab `Ln,w` while keeping the unavailable field output parked.

Follow-up implementation after that pass made floor runtime resolver
traces scenario-scoped. Package-transfer similarity anchors now expose
only the outputs actually published by the selected calculation and no
longer advertise unsupported `Ctr`, field, or ASTM/IIC metrics.
Supported-band anchors include the live `Ctr` value when that output is
published. Field adapter traces pin the live field values for outputs
such as `R'w`, `DnT,w`, `L'n,w`, `L'nT,w`, and `L'nT,50`, instead of
reusing generic registry pins.

Follow-up implementation after that pass added floor impact
missing-input answer boundaries on assembly routes. When no floor impact
value candidate is published, missing `loadBasisKgM2` for lab `Ln,w` /
`DeltaLw` and missing field impact context for `L'n,w` / `L'nT,w` now
select a floor `needs_input` boundary and resolver trace with exact
missing fields and empty value pins. Exact measured and similarity floor
candidates are not overridden when they remain the selected value path.

Follow-up implementation after that pass landed Step 3 Floor V1
Acceptance Matrix and the matching UI/API/report parity surface. The
engine matrix covers exact measured floor rows, exact ISO 717-2
impact-band rows, package-transfer anchors, supported-band anchors,
raw-bare, helper-only, direct-fixed, heavy floating lab-impact formula,
field-impact missing context, and ASTM blockers. The heavy concrete
floating-floor lab-impact basis
`predictor_heavy_floating_floor_iso12354_annexc_estimate` now registers
as `floor.heavy_concrete_floating_floor.lab_impact_formula`; mixed
`Ln,w` / `DeltaLw` / `IIC` requests keep calculated ISO lab values live
and park only `IIC` as a boundary candidate. The workbench candidate
surface parity test now proves the same floor candidates, basis ids,
value pins, missing fields, and stopped-output states across output
cards, Markdown report lines, and `/api/estimate` payloads.

Known non-fatal warnings remain:

- Zustand test-storage warnings in web tests;
- optional `sharp/@img` warnings during Next build.

## Current Verdict

This is now a landed Answer Engine V1 company-internal usable envelope,
not only a documentation checkpoint. It is not a claim that every future
acoustic family, ASTM adapter, or building-prediction route is complete;
it is a tested claim that the current V1 wall/floor envelope selects
exact, anchor, formula, `needs_input`, and `unsupported` answers without
publishing unowned metrics as answers.

The continuing implementation direction for post-V1 work remains:

`acoustic_calculator_answer_engine_v1_plan`

Regression work continues to include:

`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`

Follow-up implementation update on 2026-05-22: the next V1 slice began
by closing the detected flat multileaf/multicavity missing-grouping
answer leak. Flat multicavity wall stacks that the runtime detects as
`multileaf_multicavity` now select a wall `acousticAnswerBoundary`,
park requested airborne answer outputs, keep the resolver trace on
`needs_input` with no value pins, and keep workbench output cards,
answer charts, and summary cards from presenting diagnostic `Rw` / STC /
`C` / `Ctr` metrics as the active answer. Wall field cards now use the
same missing-physical-input prompt instead of surfacing the older
unsupported diagnostic guard for parked `R'w` / `DnT,w` style requests.

Follow-up implementation update on 2026-05-22: exact measured wall rows
now retain rank-zero precedence before formula missing-input prompts
when the source row is a true same-stack match. The Knauf LSF lab row now
returns the measured full-stack `Rw 55`, uses
`verified_airborne_catalog_exact_match` as the calculation method, maps
the resolver trace to `wall.exact_verified_airborne.same_leaf_schedule`
on `verified_airborne_exact_source`, and pins only the supported
requested `Rw` value. This path is route-scoped to wall so floor exact,
package-transfer, raw-bare, helper-only, and field-impact candidates keep
their own selection rules and do not inherit wall airborne exact-source
precedence.

Follow-up implementation update on 2026-05-22: exact measured wall
overrides are now metric-scoped. The Rw-only Knauf LSF source row still
wins for exact `Rw`, but a mixed `Rw` / STC / `C` / `Ctr` request keeps
only `Rw` supported and moves `STC`, `C`, and `Ctr` to unsupported
outputs with a warning instead of treating the Rw source as measured or
calculated evidence for those metrics. The resolver trace support and
value pins stay `Rw`-only.
The same metric-scope boundary now applies to field exact labels:
manually surfaced `R'w` exact rows restore precedence only for `R'w`,
and official `DnT,A,k` rows remain on the owned `DnT,A` proxy lane
instead of becoming `R'w` / `DnT,w` aliases. Full wall stack reversal is
accepted by the exact catalog matcher, preserving exact-source
precedence for the same measured wall entered from the opposite side.
The resolver trace now carries the same field metric scope: `DnT,A,k`
field exact answers trace as `field_apparent`, support only `DnT,A` /
`DnT,A,k`, and pin only those field metrics instead of advertising lab
`Rw` / STC / `C` / `Ctr` exact capabilities.
The adjacent-swap double-leaf guard and source-like resilient-bar lanes
remain available when they are still the selected answer path.

Follow-up implementation update on 2026-05-22: wall field/building
boundary traces now stay on the wall answer route. Partial
building-prediction requests with missing room/context fields expose a
wall `acousticAnswerBoundary` `needs_input` payload, the exact missing
fields, a wall resolver trace, empty supported metrics, and no value
pins. Opening/leak building requests without the owned building adapter
now expose a wall `unsupported` payload and a wall basis-boundary trace
with the missing owner terms, again without value pins. This fixes the
case where incidental floor artifacts could leave these wall answer
stops without a resolver trace. Actual floor impact field-adapter and
source-absent lanes remain on the floor route when they are the selected
answer path.

Follow-up implementation update on 2026-05-22: partial wall
field-apparent requests now stop as answer-engine `needs_input`
boundaries. If `field_between_rooms` is selected but partition area is
missing, or a field-only request is missing receiving-room volume or
RT60, DynEcho parks the unavailable field answer, emits the exact missing
field names on the wall resolver trace, and keeps value pins empty.
Mixed lab-plus-field requests keep separately owned lab outputs live and
park only the unavailable field outputs. Complete Gate I field-apparent
requests remain live and unchanged.

Follow-up implementation update on 2026-05-22: Step 3 Floor V1 is now
closed. The engine acceptance matrix and web output-card/report/API
parity both cover exact floor rows, exact ISO impact-band rows,
compatible floor anchors, source-absent floor formulas, heavy floating
lab-impact formula, field-impact `needs_input`, and ASTM unsupported
boundaries without metric aliasing.

Follow-up implementation update on 2026-05-22: Step 4 Surface Parity For
The Same Answer is now closed. Result answer charts, summary cards, and
Markdown report live-stack summaries are scoped to the selected answer
outputs instead of incidental diagnostic metrics. Impact-only floor
answers no longer show airborne `Rw` / STC / `C` / `Ctr` as if they were
answers; exact `Rw`-only wall answers no longer display unowned STC or
spectrum companions; and wall/floor `needs_input` stops remain visible
with exact missing fields across saved replay, server snapshot replay,
cards, resolver trace, and reports. Targeted Step 4 web validation
passed 5 files / 28 tests.

Follow-up implementation update on 2026-05-22: Step 5 Company-Internal
Usable V1 Acceptance Gate is now closed. The gate landed in
`packages/engine/src/acoustic-calculator-company-internal-usable-v1-acceptance-gate-contract.test.ts`
and is included in `pnpm calculator:gate:current`. It exercises
realistic wall and floor stacks across exact, anchor, source-absent
formula, `needs_input`, and unsupported outcomes, including hostile
layer order, duplicate/split layers, missing roles/topology/context,
mixed lab/field requests, and metric-alias negatives. The Step 5 fix
also keeps ownerless floor package-transfer STC parked, keeps exact
impact-band airborne companions parked, and preserves real floor
field/building continuation values only when the selected runtime
publishes them. Full current gate passed with engine 510 files / 2912
tests, web 94 files / 397 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed. This is still not a broad source crawl or a
finite scenario library.

Post-V1 follow-up implementation update on 2026-05-23: local-substitution
wall formula trace integration is now landed. The existing grouped
triple-leaf local-substitution `Rw` runtime, lab-spectrum `STC`/`C`/`Ctr`
adapter, and field-context `R'w`/`DnT,w` adapter now register with the
shared layer-combination resolver registry and runtime candidate
adapter. Live answers keep their calculated values but no longer lose
the shared answer trace: the local Rockwool/MLV/plaster grouped
triple-leaf case exposes source-absent `Rw 53`, lab-spectrum `STC 64`,
`C 1.6`, `Ctr -7.2`, and field `R'w 51` / `DnT,w 53` with the correct
candidate id, basis, support bucket, budgets, and scenario-specific
value pins. Registry and matrix counts are now 21 declared candidates
and 18 active runtime-basis mappings. No source rows were added, no
confidence retune was made, and no lab/field/STC alias was opened. Full
`pnpm calculator:gate:current` passed after the integration with engine
510 files / 2912 tests, web 94 files / 397 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.

Post-V1 follow-up implementation update on 2026-05-23: wall lab formula
trace reconciliation is now landed for two calculated paths that already
produced numeric lab answers but did not expose the shared answer-engine
candidate trace. The Gate H lined massive-wall runtime now registers as
`candidate_lined_massive_wall_family_physics_prediction` on
`gate_h_lined_massive_wall_cavity_aware_family_physics_runtime`; the
current tested lab stack pins `Rw 60`, STC 60, `C -0.8`, and
`Ctr -5.7`. The company-internal heavy-composite runtime now registers
as
`candidate_company_internal_heavy_composite_wall_family_physics_prediction`
on
`company_internal_heavy_composite_wall_mass_air_mass_capped_family_physics_runtime`;
the current tested lab stack pins `Rw 63`, STC 63, `C -1.4`, and
`Ctr -6.3`. Known wall airborne formula runtimes now keep the resolver
route on `wall` even when incidental floor-system artifacts are present
on the calculation object. Registry and matrix counts are now 25
declared candidates and 22 active runtime-basis mappings. Targeted
validation passed 7 engine files / 52 tests. Full
`pnpm calculator:gate:current` then passed with engine 510 files / 2912
tests, web 94 files / 397 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed. No source rows were added, no tolerance or
confidence retune was made, and no lab/field/building or ISO/ASTM alias
was opened.
