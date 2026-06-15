# Industry-Grade Calculator Direction

Last reviewed: 2026-06-15

## Purpose

This document is the long-range calculator direction. It does not select
the next implementation slice, replace the source of truth, or authorize
large speculative work. Use it to keep post-V1 slice selection aligned
with the product goal: DynEcho must become an industry-grade acoustic
calculator that predicts defensible outputs from user-entered layer
combinations and route-required physical inputs.

Current selected implementation work remains owned by
`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`,
`docs/calculator/CURRENT_STATE.md`, and
`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`.

Latest market-bar and cleanup reconciliation:
`docs/calculator/CALCULATOR_EXCELLENCE_AND_CLEANUP_REVIEW_2026-06-15.md`.
It records external calculator references and temporary cleanup
guardrails, without selecting a new runtime slice.

## Product Bar

The target is not a source-row catalog or report generator. The target
is a calculator that can accept arbitrary physically valid wall, floor,
ceiling, roof, facade, and opening assemblies and then:

- use exact measured rows only when the construction and metric basis
  truly match;
- use compatible anchors or bounded deltas only when the family, metric
  basis, and construction boundary are owned;
- otherwise calculate through the best dynamic formula route;
- return precise `needs_input` or `unsupported` when the necessary
  physical inputs, owner, metric basis, or route boundary is absent.

End-state outputs should include, where physically owned, airborne,
impact, field, and building metrics such as `Rw`, `STC`, `OITC`, `C`,
`Ctr`, `R'w`, `Dn,w`, `DnT,w`, `Dn,A`, `DnT,A`, `Ln,w`, `IIC`,
`L'n,w`, and `L'nT,w`.

The competitive bar is higher than a scalar metric table. Element-level
tools such as INSUL normalize one-third-octave prediction for walls,
floors, ceilings, and impact questions. Building-level tools such as
SONarchitect/BASTIAN-style ISO 12354 workflows normalize room,
junction, facade, flanking, and building prediction context. DynEcho's
strategy should therefore favor frequency-band ownership, route-
required physical input capture, strict lab/field/building and ISO/ASTM
basis separation, and measured rows as evidence rather than the whole
product.

## Strategic Capability Map

### 1. Formula Scope

DynEcho needs broad owned dynamic routes for the assembly families users
actually build: single-leaf massive walls, double-leaf and framed walls,
lined massive walls, triple or multi-leaf walls, heavy and lightweight
floating floors, CLT and timber systems, concrete and steel floors,
ceilings, roofs, facades, windows, doors, and openings/leaks.

Scope work is high-value when it lets more layer combinations calculate
without weakening existing boundaries. It is low-value when it creates a
finite scenario library or imports many measured rows without a route
owner, calibration use, or exact-match path.

### 2. Spectral Backbone

The strongest calculator posture is frequency-first. Route solvers
should increasingly produce owned one-third-octave curves, with single
number ratings derived from the curve rather than patched in as isolated
outputs. This matters for `Rw`, `STC`, `OITC`, `C`, `Ctr`, `Ln,w`, IIC,
and field/building adapters.

The current project already contains spectral and spectrum-adapter work
in some lanes, but this is not yet a single global backbone. Future
high-ROI slices should favor reusable frequency-band outputs when the
route evidence and implementation risk justify it.

### 3. Calibration And Holdouts

Measured rows are evidence, not the product. Their best use is exact
override when the stack truly matches, bounded anchor delta when the
change is proven, and calibration or holdout evidence for formula
routes.

Each mature formula family should have a small, rights-safe set of
source-owned calibration and holdout cases with explicit metric basis,
construction family, tolerance, and negative boundaries. If admissible
holdouts are absent, the route should keep the wider budget or stay
unpromoted instead of pretending source-absent formula values validate
themselves.

### 4. Building Prediction And Flanking

Industry-grade building outputs require more than copying lab values.
`R'w`, `Dn,w`, `DnT,w`, `L'n,w`, and `L'nT,w` need owned direct curve,
room normalization, element area, receiving-room context, flanking path,
junction/coupling, and output-basis owners.

Building prediction work is high-value when it introduces or reuses
explicit physical inputs and keeps lab, field, and building bases
separate. It is not acceptable to silently promote lab outputs into
field or building metrics.

### 5. User Material Input Model

User-created materials must become first-class calculator inputs when
their physical properties are complete. The material name itself should
not change a result when all calculation-relevant numeric properties,
roles, topology, and route context are identical.

High-value user-material work defines the exact required inputs for each
route, such as density, thickness, surface mass, elastic modulus, loss
factor, flow resistivity, dynamic stiffness, load basis, cavity depth,
leaf grouping, bridge class, support topology, and support spacing. When
those values are missing, the engine should ask for them with precise
`needs_input` boundaries.

### 6. Route Selection And Boundary Safety

Correct route selection is as important as the formula. The engine must
distinguish massive substrate, board or panel leaf, framed double leaf,
lined massive wall, floating floor, raw bare floor, finished package,
opening/leak, and direct-fixed bridge cases without using unsafe
shortcuts.

Boundary-preserving work, such as thick-board Auto family protection, is
calculator progress when it prevents wrong answers. New route widening
must preserve existing concrete, AAC, masonry, CLT, and other
massive-core posture while keeping board-like leaves from silently
becoming massive substrates.

### 7. Metric And Basis Integrity

Lab, field, building, ISO, ASTM, A-weighted, spectrum-adapter, and
single-number metrics are not interchangeable labels. Each metric needs
an owner, a route basis, and tests that prove unsupported aliases remain
unsupported.

Any slice that moves values must state which request shapes and target
outputs become calculable, which bases are promoted, and which adjacent
metrics remain blocked.

### 8. Companion Metric Completeness

Some metrics are natural companions only when the route owns the data
needed to derive them. For example, an owned lab one-third-octave
airborne curve can usually support `Rw`, `C`, `Ctr`, and often `STC`
or `OITC` through the proper rating adapters. In that case, publishing
`Rw` while hiding `C` or `Ctr` is likely an implementation gap unless a
specific basis boundary says otherwise.

The reverse is not always true. A scalar-only `Rw` estimate, measured
single-number row, anchored delta, or field/building adapter can be
valid without owning the spectrum required for `C`, `Ctr`, `STC`,
`OITC`, or their field/building companions. In that case the correct
behavior is not to fabricate missing companions, but to return explicit
`unsupported` or `needs_input` with the missing owner named.

Future slices should audit route families for this pattern: whenever a
solver computes or carries an owned spectrum, all derivable companion
metrics should be surfaced consistently across engine, API, workbench,
saved replay, and reports. Whenever only a scalar metric is owned,
adjacent companions must remain blocked with a precise boundary.

### 9. Explainability And Sensitivity

The calculator should expose why a result exists: selected route, basis,
required assumptions, missing inputs, source or formula ownership, and
the strongest uncertainty drivers. This is not report polish; it is
calculation trust.

The next maturity step beyond route trails is sensitivity: identify
which physical inputs most affect a result and which missing inputs
would most improve accuracy. Sensitivity work should trail reliable
route ownership and should not become generic UI prose.

## ROI Selection Rules

When choosing future post-V1 work, prefer slices in this order:

1. Runtime formula or adapter work that calculates more physically valid
   layer combinations with owned inputs.
2. Accuracy work that retunes, calibrates, bounds, or validates an
   existing route with admissible evidence.
3. Input-surface work that unlocks many already-owned calculations by
   collecting route-required physical fields.
4. Boundary work that prevents common wrong-route answers.
5. Coverage refresh or surface parity only when it freezes or exposes a
   value-moving calculator route.

Avoid broad source crawling, finite scenario packs, confidence wording,
auth/storage, report polish, or UI-only work as calculator slices unless
the user explicitly asks for them separately.

## Highest-ROI Work Streams

These are the recurring work streams most likely to move DynEcho toward
the most accurate and comprehensive calculator in the market. They are
not an override of the current selected next file. After the active
coverage refresh closes, the normal numeric coverage/accuracy rerank
should compare concrete candidates against these streams.

### 1. User-Material Physical Input Coverage

Why it is high ROI: user-created materials create an effectively
unbounded set of layer combinations. When the engine can use their
physical properties correctly, every custom wall or floor stack becomes
eligible for owned formula routes instead of needing a measured row.

Good slices:

- capture missing route-required fields for custom double-leaf/framed
  walls, such as leaf grouping, support topology, bridge class, support
  spacing, cavity depth, and absorber flow resistivity;
- extend impact routes to custom floor stacks when dynamic stiffness,
  load basis, base structure, resilient layer role, and finish/package
  roles are explicit;
- preserve the rule that material names do not affect results when all
  calculation-relevant numeric properties, roles, and route context are
  identical.

Boundaries to protect: do not guess missing topology, do not treat a
board leaf as a massive substrate by mass alone, and do not use generic
engineering defaults when the route needs explicit user input.

### 2. Frequency-Band Solver Backbone

Why it is high ROI: a frequency-first backbone improves both scope and
accuracy. It lets multiple ratings derive from the same owned curve
instead of maintaining isolated `Rw`, `STC`, `C`, `Ctr`, `OITC`, `Ln,w`,
or IIC values.

Good slices:

- make selected airborne or impact routes return an owned one-third-
  octave curve plus derived single-number metrics;
- reuse the same spectrum owner for lab, field, and building adapters
  only when each basis conversion is owned;
- prioritize common families first: single-leaf massive, double-leaf
  framed, lined massive, and heavy or lightweight floating floors.

Boundaries to protect: do not synthesize a spectrum just to unlock a
label; unsupported metric aliases must stay unsupported until the curve,
adapter, and rating method are owned.

### 3. Companion Metric Completeness Audit

Why it is high ROI: incomplete metric sets feel like bugs to users and
can hide already-computed value. If a route has enough owned curve or
rating information to calculate `Rw` and also derive `C`, `Ctr`, `STC`,
or `OITC`, the calculator should expose the whole owned companion set.

Good slices:

- audit routes that publish `Rw`, `R'w`, `Dn,w`, or `DnT,w` without
  expected companions and classify each row as owned-spectrum,
  scalar-only, measured-single-number, anchor-delta, or adapter-only;
- promote `C`, `Ctr`, `STC`, or `OITC` companions only when the route
  already owns the required spectrum or rating adapter;
- add contract tests that prove unsupported companions are explicit
  when the route is scalar-only, while owned-spectrum routes expose the
  complete companion set.

Boundaries to protect: do not infer `C` or `Ctr` from `Rw` alone; do
not carry lab spectrum companions into field/building outputs unless the
field/building spectrum or adapter basis is owned.

### 4. Building Prediction And Flanking Runtime

Why it is high ROI: market-grade calculators must answer real building
questions, not just lab element questions. Users need `R'w`, `DnT,w`,
`L'n,w`, and `L'nT,w` for actual room and junction conditions.

Good slices:

- collect room volume, receiving room normalization, separating element
  area, flanking path topology, junction class, coupling length, and
  output basis as explicit inputs;
- promote a narrow direct-plus-flanking route only when the direct
  curve, flanking terms, junction reduction, and metric basis are all
  owned;
- keep building adapters family-specific before widening them across
  unrelated construction types.

Boundaries to protect: never copy lab values into field or building
outputs; never hide missing flanking or junction assumptions behind a
confidence label.

### 5. Calibration And Holdout Expansion

Why it is high ROI: formula routes become credible when their error
budgets are checked against admissible measured evidence. A small set of
rights-safe, same-basis holdouts can improve accuracy more than a large
unstructured source crawl.

Good slices:

- define calibration and holdout packets for one formula family at a
  time;
- retune or tighten budgets only when same-family, same-basis,
  source-owned holdouts exist;
- use measured rows as exact overrides, bounded anchors, calibration
  rows, or holdouts according to explicit owner rules.

Boundaries to protect: source-absent formula values cannot validate
themselves; near-miss rows must remain benchmarks until family, basis,
and construction deltas are owned.

### 6. General Formula Family Expansion

Why it is high ROI: broad formula coverage is the path to more
comprehensive calculation. Once the input model and route selection are
safe, new family solvers can unlock many layer combinations at once.

Good slices:

- widen wall families beyond the current strongest lanes: lined massive,
  triple or multi-leaf, CLT and mass timber, masonry/AAC, facade,
  window, door, and opening/leak systems;
- widen floor and ceiling families: raw bare, floating, finished
  package, concrete, steel, timber/open-web, suspended ceiling, roof,
  and resilient support systems;
- add formulas only with route inputs, metric basis, and negative
  boundary tests.

Boundaries to protect: do not turn family expansion into finite scenario
packs; a route should calculate from layer physics, not from a list of
hand-picked examples.

### 7. Route Selection And Topology Safety

Why it is high ROI: a wrong route can produce a confident but wrong
answer. Better classification increases usable scope and protects
accuracy at the same time.

Good slices:

- improve Auto classification only where there is a physically owned
  boundary;
- add route-input prompts when the layer stack is ambiguous;
- keep board/panel/membrane leaves separate from true massive
  substrates unless the user explicitly provides massive-substrate
  intent or the material route owns it.

Boundaries to protect: keep `needs_input` when route-required topology
is missing, and do not weaken existing massive-core routes for concrete,
AAC, masonry, CLT, or other owned substrates.

### 8. Sensitivity And Input Priority

Why it is high ROI after route ownership matures: sensitivity tells the
user which physical inputs most affect the answer and which missing
inputs would most improve accuracy. That improves trust and helps users
provide the right data.

Good slices:

- expose per-route dominant uncertainty drivers after the route is
  owned;
- rank missing inputs by expected impact on `Rw`, `DnT,w`, `Ln,w`, or
  related outputs;
- keep sensitivity numerical or route-evidence based rather than
  generic explanatory prose.

Boundaries to protect: sensitivity should not become a substitute for
calculation, calibration, or missing-input ownership.

## Practical Next-Selection Heuristic

After the current selected coverage refresh closes, choose the next
runtime or accuracy candidate by asking:

1. Does it let many user-entered layer combinations calculate from owned
   physical inputs?
2. Does it improve the correctness or error budget of an already common
   route?
3. Does it unlock multiple target outputs from one owned route, such as
   a spectrum or building adapter?
4. Does it preserve lab/field/building and ISO/ASTM basis boundaries?
5. Can it be implemented as a bounded owner with positive, negative,
   missing-input, and non-goal tests?

The highest-confidence answer to those questions should become the next
plan, then implementation should proceed through the normal selected-
next contract path.

## Current Maturity Snapshot

As of this checkpoint, the strongest active line is user-material route
coverage: explicit double-leaf/framed topology, porous absorber flow
resistivity, and floor impact dynamic-stiffness context. These are good
because they make custom layer stacks calculable when the user provides
the physics.

The biggest strategic gaps are:

- a more central frequency-band backbone across airborne and impact
  routes;
- a companion-metric completeness audit so owned spectrum routes expose
  all derivable `C`, `Ctr`, `STC`, `OITC`, and related outputs while
  scalar-only routes block them explicitly;
- broader formula families for common wall, floor, ceiling, roof,
  facade, window, door, and opening assemblies;
- stronger calibration and holdout coverage for each formula family;
- more complete building prediction and flanking ownership;
- a richer user-material physical-property model;
- explicit sensitivity reporting once route ownership is stable.

These gaps should be addressed incrementally through the normal
selected-next mechanism. This document is a direction guard, not a
parallel roadmap that overrides the current active slice.
