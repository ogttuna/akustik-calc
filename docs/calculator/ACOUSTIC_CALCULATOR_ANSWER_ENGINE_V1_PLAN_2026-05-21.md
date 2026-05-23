# Acoustic Calculator Answer Engine V1 Plan - 2026-05-21

Status: company-internal usable V1 answer-engine correction closed for
the current tested envelope; keep this as the product-direction lock for
post-V1 accuracy and adapter work.

DynEcho is an acoustic calculator. A user brings an acoustic project,
chooses wall or floor, enters the layer stack and the extra physical
inputs required for that construction, and gets an acoustic answer.

The answer engine must do this:

1. use an exact measured value when the same construction, metric, and
   basis is already known;
2. use a very similar measured construction only as an anchor when the
   family, topology, metric, and physical delta are compatible;
3. otherwise choose the correct acoustic formula family for the entered
   layers and calculate the result;
4. return `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, STC, `C`, `Ctr`, `CI`,
   `CI,50-2500`, and related outputs on the correct lab, field,
   building, ISO, or ASTM basis;
5. require extra physical inputs only when the formula genuinely needs
   them to choose or calculate the answer.

This is not a test project. This is not a source catalog. This is not a
finite scenario library. Tests and docs are only guardrails. The product
is the calculator answer.

## Product Direction Lock - 2026-05-22

User-confirmed priority: DynEcho must keep moving toward a usable
acoustic calculator. Implementation slices must improve answer
selection, formula-family selection, required physical-input prompting,
or basis-correct output publication. A slice that only adds source rows,
finite scenarios, confidence wording, or docs while leaving calculator
answer behavior unmoved is off-track unless the active plan explicitly
selects that work.

Selected action for this correction:

`acoustic_calculator_answer_engine_v1_plan`

Primary contract file:

`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`

Correction label:

acoustic calculator answer engine V1

This replaces the previous immediate focus on a narrow
post-double-leaf coverage revalidation. The double-leaf coverage refresh
is still useful and stays landed, but the next work must make the
existing calculator infrastructure answer real layer combinations.

## 2026-05-22 Checkpoint And First Implementation Slice

Latest checkpoint:

[CHECKPOINT_2026-05-22_ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_RECONCILIATION.md](./CHECKPOINT_2026-05-22_ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_RECONCILIATION.md)

Latest post-V1 state checkpoint:

[CHECKPOINT_2026-05-23_POST_V1_ACOUSTIC_CALCULATOR_STATE_RECONCILIATION.md](./CHECKPOINT_2026-05-23_POST_V1_ACOUSTIC_CALCULATOR_STATE_RECONCILIATION.md)

The docs and implementation were reread against this plan on
2026-05-22. The first V1 implementation slice then landed:

- `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`
  now exists and locks the product direction to calculator answers, not
  source catalog drift.
- Single-leaf gypsum, explicit double-leaf/framed wall, and tagged
  helper-only timber/open-web floor stacks remain published formula
  answers when their required physical inputs are present.
- Missing `resilientBarSideCount` now selects `needs_input`, parks
  `Rw` / STC / `C` / `Ctr` from the user-facing answer, and exposes the
  missing field through the resolver trace.
- Flat gypsum / absorber / gypsum without explicit wall topology now
  selects a double-leaf missing-input boundary instead of an untraced
  screening answer.
- Roleless helper-only timber/open-web floor stacks now select a
  floor-role `needs_input` boundary before publishing helper-only impact
  values. The boundary is intentionally narrow so existing raw floor
  screening and field-airborne carrier routes stay available when they
  are the selected answer path.
- Shared engine/API schemas now carry `acousticAnswerBoundary`, and web
  output cards show answer-engine floor missing-role boundaries as
  `needs_input`, including companion `Rw` / `C` / `Ctr` cards.
- `pnpm calculator:gate:current` passed with engine 510 files / 2912
  tests, web 94 files / 397 passed + 18 skipped, repo build 5 / 5, and
  whitespace guard passed.

The latest Step 2 wall acceptance follow-up adds the engine-side Wall V1
Acceptance Matrix and the wall field-apparent resolver candidate
`wall.airborne_field_context.field_apparent_adapter`. Complete Gate I
wall `field_between_rooms` requests now keep a wall `field_apparent`
trace with owned `R'w` / `DnT,w` pins instead of being hidden by
incidental floor artifacts. Partial wall field context remains
`needs_input`, and unsupported building/opening owners remain value-less.
The web parity follow-up closes Step 2 across output cards, Markdown
report lines, and `/api/estimate`: live wall formulas, exact wall metric
scope, complete wall field values, partial field `needs_input`, and
unsupported building/opening boundaries now surface the same selected
candidate, basis, support bucket, values, and stopped-output state.

The latest V1 follow-up also applies the exact metric-scope rule to
measured floor rows and impact-only exact floor traces. Exact
floor-family answers keep only the measured or source-owned floor
metrics live (`Rw`, derivable `C`/`Ctr` when declared, `Ln,w`, `CI`,
`CI,50-2500`, `Ln,w+CI`) and keep `STC`, `IIC`/`AIIC`, and unowned field
aliases out of the exact answer. The resolver trace pins only those
owned floor metrics instead of showing broad declaration capabilities as
if they were all measured.

The latest exact impact-band follow-up maps
`exact_source_band_curve_iso7172` into the resolver as a rank-zero floor
exact candidate. Exact lab impact-band sources pin only owned ISO
717-2 metrics such as `Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI`; exact
field impact-band sources trace as `field_apparent` for owned metrics
such as `L'nT,w` and `LnT,A`; ASTM `IIC`/`AIIC` stays unsupported until
an ASTM E989 owner exists. Mixed exact impact-band plus floor airborne
requests keep the source-absent airborne values on their own calculation
basis; the exact impact resolver trace supports and pins only
impact-owned outputs such as `Ln,w` and `CI`, so `Rw`, STC, `C`, and
`Ctr` do not appear as if they were owned by the ISO 717-2 impact
source.

The latest owner-audit follow-up keeps that rule architectural without
muting valid calculated formula lanes. A shared audit helper runs after
answer boundaries on assembly and impact-only paths. It enforces exact
owner scope only when the selected exact trace declares owned metrics,
and it enforces active `needs_input`, `unsupported`, and
`basis_boundary` stops only for the outputs named by that boundary.
Formula and anchor owner broadening is intentionally left to the wall
and floor V1 acceptance matrices so valid calculated answers stay live
while their trace ownership surfaces are completed.

The latest floor ASTM follow-up keeps pure `IIC` / `AIIC` requests on a
value-less unsupported answer boundary. Exact floor rows and exact ISO
impact-band sources still win for their owned ISO metrics in mixed
requests, but when the requested answer is only ASTM `IIC` / `AIIC`,
assembly and impact-only paths now select
`generic.astm_iic_aiic.unsupported_boundary`, require
`astmRatingCurveOwner`, `astmReferenceContour`, and `testStandardBasis`,
and publish no resolver value pins. This is not an ASTM runtime
promotion; it prevents ISO `Ln,w` / `CI` evidence from being presented as
ASTM output.

The latest floor field-impact follow-up keeps pure `L'n,w` / `L'nT,w`
requests behind a `needs_input` boundary when the selected evidence is
still lab impact and the field context is missing. Assembly paths ask
for `contextMode`, `partitionAreaM2`, `receivingRoomVolumeM3`,
`receivingRoomRt60S`, and `impactFieldContext`; impact-only paths ask
for `impactFieldContext`. Mixed lab-plus-field floor requests preserve
owned lab `Ln,w` while parking only unavailable field output.

The latest floor trace follow-up also makes runtime resolver traces
scenario-scoped. Package-transfer similarity anchors now expose only the
outputs the selected calculation publishes, supported-band anchors pin
their live `Ctr`, and field adapter traces pin live `R'w`, `DnT,w`,
`L'n,w`, `L'nT,w`, and `L'nT,50` values without carrying generic
registry metric declarations into the user-facing answer trace.

The latest floor impact follow-up also makes missing physical inputs a
floor answer boundary on assembly routes when no impact value candidate
is selected. Missing `loadBasisKgM2` parks lab `Ln,w` / `DeltaLw`, and
missing field impact context parks `L'n,w` / `L'nT,w`, with a floor
`needs_input` resolver trace, exact required fields, and no value pins.
Exact and similarity floor impact candidates keep precedence when they
are the selected value path.

The latest Step 3 floor acceptance follow-up lands both the engine-side
floor V1 matrix and the web parity surface for the same answers. The
matrix covers exact measured floor rows, exact ISO 717-2 impact-band
sources, package-transfer anchors, supported-band anchors, raw-bare,
helper-only, direct-fixed, heavy floating lab-impact formula,
field-impact missing context, and ASTM blockers. The heavy concrete
floating-floor lab-impact basis
`predictor_heavy_floating_floor_iso12354_annexc_estimate` now maps to
`floor.heavy_concrete_floating_floor.lab_impact_formula`, so mixed
`Ln,w` / `DeltaLw` / `IIC` requests keep calculated ISO lab values live
while `IIC` remains a boundary candidate. Output cards, Markdown report
lines, and `/api/estimate` now expose the same selected floor candidate,
basis, support bucket, value pins, missing inputs, and stopped-output
state for those Step 3 cases.

The follow-up V1 slice now also parks detected flat
multileaf/multicavity wall answers until grouped topology fields are
supplied. The engine exposes a wall `acousticAnswerBoundary`, the
resolver trace stays `needs_input` with no value pins, wall lab/field
output cards and answer charts show no active `Rw` / `R'w` / `Dn,w` /
`DnT,w` / STC / `C` / `Ctr` answer, and adjacent-swap double-leaf guard
plus source-like resilient-bar lanes stay available when they are the
selected answer path.

The next V1 follow-up also keeps wall field/building answer boundaries
visible as wall answer boundaries. Partial building-prediction requests
with missing room/context fields now carry wall `acousticAnswerBoundary`
`needs_input` payloads and resolver traces with the exact missing fields.
Opening/leak building requests whose adapter owner is still missing now
carry wall `unsupported` payloads and a wall basis-boundary trace with
the missing owner terms. Both cases keep value pins empty. Incidental
floor artifacts on the calculation object no longer steal the resolver
trace route, and actual floor impact field-adapter/source-absent lanes
remain floor traces when they are the selected answer path.

The next V1 follow-up also parks partial wall field-apparent requests.
If `field_between_rooms` is selected but partition area is missing, or a
field-only request is missing receiving-room volume or RT60, DynEcho now
exposes a wall `needs_input` answer boundary and wall resolver trace with
exact missing fields, keeps unavailable field value pins empty, and
leaves complete Gate I field requests live. Mixed lab-plus-field requests
preserve separately owned lab outputs while parking only the field
outputs that still need physical context.

The next V1 follow-up also restores rank-zero exact measured wall
precedence ahead of formula missing-input prompts. A truly exact Knauf
LSF lab stack now selects the measured full-stack answer, exposes the
resolver trace as the exact measured override candidate on
`verified_airborne_exact_source`, pins only the requested supported
`Rw 55`, and carries no answer boundary. The precedence is deliberately
route-scoped to wall; floor exact, package-transfer, raw-bare,
helper-only, and field-impact lanes remain separate and must not borrow
this airborne exact-source path.

The next metric-scope follow-up keeps exact measured overrides from
becoming metric aliases. If an exact wall source row reports only `Rw`,
mixed target-output requests may publish exact `Rw`, but `STC`, `C`, and
`Ctr` remain unsupported on that exact answer unless a separate metric
basis owner calculates or measures them. The resolver trace therefore
pins only `Rw 55` for the Knauf exact row.

The metric-scope follow-up also keeps field exact precedence same-metric
only. A field source labelled `R'w` can outrank the field formula for
`R'w`, while official `DnT,A,k` rows remain bounded to the owned
`DnT,A` proxy lane and do not become `R'w` / `DnT,w` aliases. Exact wall
catalog matching treats a fully reversed layer order as the same wall
stack, so the same measured construction viewed from the opposite side
does not lose exact-source precedence.

The resolver trace surface is now scoped the same way. When an official
field row reports `DnT,A,k`, the selected exact trace is
`field_apparent`, its supported metrics are only `DnT,A` and
`DnT,A,k`, and its value pins are the measured/proxy field metrics. It
does not display the lab exact `Rw` / STC / `C` / `Ctr` capabilities for
that field answer.

The Step 4 surface-parity follow-up closes the remaining answer-scope
display leaks around those selected paths. Result answer charts only draw
airborne or impact lanes when the selected answer supports those
outputs; impact-only floor answers do not show incidental `Rw` / STC /
`C` / `Ctr` lanes; exact `Rw`-only wall answers do not show unowned STC
or spectrum companions; and report live-stack summaries use the same
scoped answer summary as replay and candidate-trace surfaces. Stopped
wall and floor answers stay visible as `needs_input` with exact missing
fields across saved replay, server snapshot replay, cards, resolver
trace, and Markdown reports.

The Step 5 company-internal usable V1 acceptance gate is now closed in
`packages/engine/src/acoustic-calculator-company-internal-usable-v1-acceptance-gate-contract.test.ts`.
It exercises realistic wall and floor exact, anchor, source-absent
formula, `needs_input`, unsupported, hostile layer-order,
duplicate/split-layer, missing-context, missing-role, and
metric-alias-negative behavior without turning the project into a broad
source crawl or finite scenario library. The gate is included in
`pnpm calculator:gate:current`; the full gate passed with engine 510
files / 2912 tests, web 94 files / 397 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Steps 0-5 of the usable V1 finish plan are now closed. The current
tested envelope is ready for company-internal usable V1. Future slices
must be selected as post-V1 accuracy/adapters or expanded formula
coverage, and must keep the same calculator-first answer order instead
of broad source crawling, confidence wording, or finite scenario packs.

Post-V1 trace reconciliation on 2026-05-23 extended the same
answer-engine surface to calculated wall paths that already existed in
runtime: local-substitution grouped triple-leaf `Rw`, lab-spectrum
`STC`/`C`/`Ctr`, complete field `R'w`/`DnT,w`, guarded adjacent
flat-list lab/field paths, Gate H lined massive-wall lab formula, and
company-internal heavy-composite wall lab formula. The shared resolver
surface now has 25 declared candidates and 22 active runtime-basis
mappings. This does not reopen V1; it is post-V1 answer correctness and
trace honesty.

## INSUL Benchmark Shape

Official INSUL materials confirm the target product shape:

- INSUL presents itself as a quick prediction tool for sound insulation
  in walls, floors, and ceilings.
- It predicts sound insulation for walls, floors, roofs, ceilings,
  windows, impact sound, and rain noise.
- It calculates TL or `Ln` in 1/3 octave bands, then derives weighted
  ratings such as STC, `Rw`, IIC, or `LnTw`.
- It lets users evaluate material and design changes rather than only
  searching a finite catalog.
- Its methods use acoustic theory: mass law, critical frequency,
  elastic plate theory, Sharp/Cremer-style complex partition methods,
  finite-size effects, double-panel mass-air-mass behavior, cavity
  coupling, and bridging.
- It is refined by comparison with lab tests, and lab tests remain the
  stronger truth when available.

DynEcho must compete with that product shape and improve on it where we
can: clearer basis/origin, visible formula choice, measured-row
precedence, and better handling of arbitrary entered layer stacks.

Primary official references checked on 2026-05-21:

- https://www.insul.co.nz/
- https://www.insul.co.nz/features/
- https://www.insul.co.nz/tech-info/
- https://docs.insul.co.nz/v10/

## What Already Exists

The last three months are not worthless. The useful pieces are:

- exact/source rows;
- measured-row matching and source precedence rules;
- single-leaf mass-law source-absent runtime;
- double-leaf/framed wall source-absent runtime when explicit topology
  is present;
- grouped/triple-leaf wall runtimes;
- floor impact lanes for exact, package transfer, supported band,
  raw-bare, helper-only, direct-fixed, bounds, and predictors;
- a shared candidate registry;
- a runtime basis adapter;
- API, workbench, replay, and Markdown report trace surfaces;
- coverage ledgers that protect already-landed behavior.

These pieces should not be deleted. They must be used by the answer
engine.

## Current Failure Mode

The current runtime can calculate numbers before the product answer has
been chosen.

Examples observed in live probes:

- single gypsum wall works: it selects the single-leaf source-absent
  formula and returns `Rw 31`;
- explicit double-leaf/framed wall works: it selects the double-leaf
  source-absent formula and returns `Rw 45`;
- flat gypsum / rockwool / gypsum without explicit topology now asks for
  the missing double-leaf ownership fields before publishing the answer;
- missing `resilientBarSideCount` is now a value-parking
  `needs_input` answer boundary;
- detected flat triple-leaf / multicavity without grouping now asks for
  missing grouping inputs and keeps the selected answer surfaces
  value-less instead of publishing the diagnostic airborne numbers;
- tagged floor raw-bare and helper-only impact stacks already calculate
  through useful source-absent formula lanes;
- roleless helper-like floor stacks that would otherwise publish
  helper-only impact values now become clear missing-role prompts, while
  raw floor screening / field-airborne carrier routes remain separate.

That is the core product gap. The calculator must choose the answer
path first, then publish the answer.

## Required Answer Flow

For every user request:

```text
user selects wall or floor
user enters layers and thicknesses
user enters requested outputs
engine identifies the construction family
engine checks exact measured matches
engine checks compatible measured anchors
engine chooses the right formula family
engine asks for any physical inputs the chosen formula needs
engine calculates banded TL or Ln where the formula owns that route
engine derives the requested single-number ratings
engine returns the answer with basis, formula, and uncertainty
```

This is the mental model. Implementation details can use registries,
adapters, traces, or tests, but they must serve this answer flow.

## Formula Families To Use

Wall:

- single visible leaf: mass law, stiffness/coincidence, thick-panel
  behavior where relevant, ISO 717-1 rating;
- double-leaf/framed: side masses, cavity depth, mass-air-mass
  resonance, absorber damping, support/bridge coupling, ISO 717-1
  rating;
- grouped triple-leaf/multicavity: grouped leaf/cavity model, calibrated
  or source-absent family solver, strict grouping input ownership;
- massive/masonry/AAC/lined massive/CLT/opening/leak lanes where already
  owned by existing runtime code.

Floor:

- exact measured floor systems first;
- package-transfer and supported-band similarity only when compatible;
- raw-bare open-box timber and open-web steel source-absent formulas;
- helper-only lower-treatment formulas when roles/geometry are known or
  safely inferred;
- direct-fixed open-web lining formula where compatible;
- floating floor / underlay / resilient package formulas where physical
  inputs such as dynamic stiffness, load, screed/finish mass, and support
  family are owned;
- field/building and ASTM/IIC outputs only through named rating or field
  adapters, not aliases.

## Historical V1 Slice Requirement - Closed

This section described what the pre-V1 next slice had to do. It is now
closed for the current tested company-internal envelope. Keep it as a
regression checklist, not as the active next-slice selection. New work
must be selected from post-V1 accuracy/adapters or expanded formula
coverage, and must preserve this answer order.

1. Build the answer selection layer.
   For a given stack, it must choose exact measured, similar measured
   anchor, calibrated formula, source-absent formula, missing-input
   prompt, or unsupported basis.
2. Publish values only from the chosen answer path.
   Internal diagnostic curves can exist, but if the chosen answer is
   missing-input or unsupported, the user-facing answer must not show a
   calculated `Rw`, STC, `Ln,w`, or field/building value as if it were
   the answer.
3. Make flat double-leaf-like stacks useful.
   Gypsum / absorber / gypsum must not silently become an untraced
   screening answer. It must either use the double-leaf formula when
   enough physical data is present or ask for the missing fields.
4. Make floor helper-like stacks useful.
   If roles are present, use the helper-only formula. If roles are
   absent but safe inference is possible, infer. If not, ask for the
   missing roles or physical inputs.
5. Keep exact and measured evidence valuable.
   Exact matches win. Similar measured combinations can calibrate or
   anchor only when physically compatible.
6. Keep basis boundaries strict.
   Lab `Rw` is not field `R'w`; ISO `Ln,w` is not ASTM IIC; `Rw` is not
   automatically STC unless a named rating adapter owns that output.
7. Add the gate only to prevent regression.
   The gate is not the product. It is the brake that stops future work
   from drifting back into source crawling, isolated scenario patches,
   or answer/value leakage.

Post-V1 trace integration landed on 2026-05-23: the existing wall
triple-leaf local-substitution formula family, adjacent flat-list
guarded lab/field paths, Gate H lined massive-wall lab formula, and
company-internal heavy-composite wall lab formula now participate in the
shared answer engine trace. Live answers publish scenario-specific value
pins instead of falling through as untraced calculation results. This
preserves the V1 rule above: the project is improving calculator
behavior and basis honesty, not collecting more catalog rows.

## Non-Goals

- turning the project into a source-row catalog;
- adding another narrow scenario pack as a substitute for formula
  selection;
- broad source crawling;
- tolerance retuning without measured holdouts;
- deleting the existing solver lanes;
- hiding behind `low confidence` instead of choosing the best available
  formula and explaining its uncertainty;
- publishing field/building or ASTM values by alias.

## Done Means

For realistic acoustic project inputs, DynEcho behaves like a
calculator:

- if the exact construction is known, it uses the measured answer;
- if a compatible measured construction can anchor the calculation, it
  uses it honestly;
- otherwise it chooses the right formula family and calculates;
- if that formula needs a real physical input, the app asks for that
  input and then calculates;
- if the requested basis genuinely has no owned method, the app says so
  instead of pretending another metric is the answer.

The goal is a better acoustic calculator, not a better-looking test
suite.
