# Calculator High-ROI System Strengthening Plan - 2026-06-29

Status:
`calculator_high_roi_system_strengthening_plan_2026_06_29`

Purpose:
record the user-requested remote system analysis after the OITC owner
handoff, identify why DynEcho still cannot calculate enough arbitrary
layer combinations, and lock the highest-ROI implementation sequence
without displacing the active selected calculator slice.

This is a strategic planning and drift-prevention document. It does not
replace `CALCULATOR_SOURCE_OF_TRUTH.md`,
`CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`, or the active owner
plan. The current selected implementation remains:

`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan`
/
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`
/
`docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md`
/
`post-V1 opening/facade outdoor-indoor OITC spectral rating owner`.

## Analysis Iterations

This plan is based on four passes over the system.

1. Current-state pass:
   `AGENTS.md`, `CALCULATOR_SOURCE_OF_TRUTH.md`,
   `CURRENT_STATE.md`, `DOCUMENTATION_MAP.md`,
   `CALCULATOR_OPENING_SEQUENCE_DRIFT_LOCK_2026-06-29.md`,
   and the OITC owner plan all agree that the next bounded behavior is
   the outdoor-indoor facade `OITC` spectral rating owner. The selected
   owner contract is intentionally not implemented yet.

2. Runtime architecture pass:
   the calculator has many correct owner slices, but core runtime
   assembly is still concentrated in a few very large files. At this
   checkpoint `calculate-assembly.ts` is about 9.5k lines and the
   resolver registry is about 3.5k lines. This makes every new route
   family pay repeated integration cost: candidate resolution, input
   completeness, metric support, basis metadata, warnings, unsupported
   outputs, and docs all have to be patched together.

3. Shared-schema pass:
   the shared schemas already protect many basis boundaries, but they
   are still uneven across route families. `RequestedOutputSchema`
   includes `OITC`, `IIC`, and `AIIC`; `RatingAdapterIdSchema` includes
   ISO 717-1, ISO 717-2, ASTM E413, and ASTM E989 adapters; however
   OITC / ASTM E1332-style outdoor-indoor spectral rating is not yet a
   first-class rating adapter. `AcousticAnswerBoundaryRouteSchema`
   currently names `wall`, `floor`, and `ceiling`, but not
   `opening`, `facade`, or `roof`. `AcousticInputRouteFamilySchema` is
   wall/floor heavy and does not yet make ceiling/plenum, roof, opening,
   facade, or outdoor-indoor OITC first-class route families.

4. Market/standards pass:
   market tools and standards reinforce the same direction. INSUL-like
   element tools normalize frequency-band prediction across walls,
   floors, ceilings, roofs, windows, glazing, impact, leakage, and
   outdoor-indoor facade questions. ISO 12354-style building prediction
   requires direct path, flanking, room, junction, area, and
   normalization context. ASTM E1332 OITC is not a scalar `Rw` or `STC`
   alias; it requires the outdoor-indoor transmission loss or noise
   reduction spectrum over the relevant one-third-octave bands.

External references checked:

- INSUL features: `https://www.insul.co.nz/features/`
- INSUL documentation: `https://docs.insul.co.nz/v9/`
- ASTM E1332 OITC: `https://store.astm.org/e1332-22.html`
- ISO 12354-1: `https://www.iso.org/standard/92742.html`
- ISO 12354-2: `https://www.iso.org/standard/70243.html`
- ISO 717-1: `https://www.iso.org/standard/51968.html`

## Implementation Cross-Check - 2026-06-29

This plan was rechecked against the current implementation after being
written.

Verified implementation facts:

- the selected OITC owner contract file is not present yet, so this
  plan does not incorrectly mark the selected runtime behavior as
  landed;
- `calculate-assembly.ts` is about 9.5k lines and
  `layer-combination-resolver-registry.ts` is about 3.5k lines, so the
  integration-cost diagnosis is real;
- `RequestedOutputSchema` already accepts `OITC`, `IIC`, and `AIIC`;
- `RatingAdapterIdSchema` includes ISO 717-1, ISO 717-2, ASTM E413,
  and ASTM E989 adapters, but no first-class OITC / ASTM E1332
  outdoor-indoor spectral rating adapter;
- `curve-rating.ts` owns ISO 717-1 and ASTM E413 style ratings from
  curves, while impact ASTM E989 is separate in `impact-astm-e989.ts`;
- `AcousticAnswerBoundaryRouteSchema` currently names only `wall`,
  `floor`, and `ceiling`;
- `AcousticInputRouteFamilySchema` currently names the historical wall
  and floor route families and does not yet make opening/facade, roof,
  ceiling/plenum, or outdoor-indoor OITC first-class input families;
- the existing OITC bridge owner makes `OITC` requestable, but
  deliberately keeps complete outdoor-indoor facade values
  `unsupported` until an owned spectral rating adapter is implemented.

Correction sharpened by the implementation check:

- current shared band-set metadata for airborne context and opening
  leak elements only exposes `third_octave_100_3150`;
- existing opening/facade OITC bridge test fixtures can carry curve
  points outside that label, including the low and high outdoor-indoor
  bands, but the metadata does not yet distinguish an OITC/ASTM E1332
  band basis;
- therefore Step 1 must not publish OITC by treating
  `third_octave_100_3150` as equivalent to the ASTM E1332
  outdoor-indoor band requirement. The OITC owner must either add a
  first-class outdoor-indoor/OITC band-set basis or validate the exact
  required OITC frequency coverage from the supplied curve and record
  that basis in the new adapter.

## Core Diagnosis

DynEcho is not weak because it lacks a source catalog. It is weak
where route ownership is still too bespoke.

The current architecture has strong discipline: exact rows do not leak
across bases, same-family deltas are bounded, and unsupported aliases
are blocked. That is the correct foundation. The remaining bottleneck is
that new calculable coverage often requires a custom vertical owner,
custom input list, custom rating/basis handling, and custom unsupported
surface updates. This slows the rate at which new arbitrary layer
combinations become calculable.

The most important blockers are:

1. Spectral ratings are fragmented.
   `curve-rating.ts` can derive `Rw`, `STC`, `C`, `Ctr`, and some
   field/building airborne companions from curves. ASTM impact rating
   is implemented separately in `impact-astm-e989.ts`. OITC is
   requestable, but the selected OITC spectral rating owner has not
   landed. This fragmentation makes every new market-facing rating
   feel like a new project instead of a reusable adapter.

2. Route families are not equally first-class.
   Wall and floor routes have deep historical coverage. Ceiling/plenum
   has just become stronger through the latest chain. Opening/facade,
   outdoor-indoor OITC, roof, and route-split context are newer and are
   not yet represented as first-class shared input-completeness and
   answer-boundary families everywhere.

3. Required-input capture is route-local instead of planner-wide.
   Many route owners correctly return `needs_input`, but there is not
   yet a single user-facing route-input planner that can ask for the
   next physical inputs across all major families. That means an
   arbitrary stack often stops at a technically correct boundary even
   when the next question is obvious: surface mass, cavity depth, flow
   resistivity, dynamic stiffness, load basis, flanking class, facade
   context, area, room volume, or spectral bands.

4. Calibration and holdout evidence are uneven.
   Some families have strong source, exact, or benchmark protection.
   Others are formula-owned but source-absent, screening, or
   research-only. The triple-leaf wall frequency solver is the clearest
   example of the right restraint: it exists, but runtime promotion is
   blocked until calibration and holdout tolerance ownership lands.

5. Integration is too centralized.
   Large integration files make every owner more expensive and increase
   risk that agents focus on local patching instead of reusable route
   infrastructure. This is not a call for generic refactoring. The
   high-ROI response is to extract only repeated calculator primitives:
   spectral rating adapters, route/input completeness declarations, and
   scenario matrix evaluation.

## Why More Layer Combinations Still Fail Closed

When a new user-entered assembly fails closed today, it is usually for
one of these reasons:

- the route cannot identify the physical family without more topology
  context;
- the formula requires physical properties that are not present on the
  layers or context;
- the metric requested is not on the basis owned by the route;
- the route owns only a scalar estimate, but the requested companion
  metric requires a spectrum;
- field/building outputs need room, area, flanking, or normalization
  context;
- the route is research-only until calibration/holdout evidence exists;
- the shared route/input schemas do not yet express the family as a
  first-class calculable route.

Those are correct reasons to block. The weakness is not the blocking;
the weakness is that we do not yet turn enough of these blockers into
fast, reusable next-input or next-adapter paths.

## High-ROI Implementation Sequence

### Step 1: Land The Current OITC Spectral Rating Owner

ROI:
high, because it opens a market-facing output and forces correct
outdoor-indoor spectral basis ownership.

Expected movement:

- `newCalculableRequestShapes: 1`
- `newCalculableTargetOutputs: 1`
- `requiredPhysicalInputsCaptured: 4`
- `runtimeBasisPromotions: 1`
- `runtimeValuesMoved: 1`
- `unsupportedBoundariesProtected: 7`

Implementation rule:
do not implement OITC as a local scalar shortcut. Build the owner so the
rating procedure and band validation can become reusable in Step 2.
The implementation must also resolve the current band-set metadata gap:
OITC cannot reuse the `third_octave_100_3150` label as if it were an
ASTM E1332 outdoor-indoor band basis.

Required physical inputs:

- `outdoorIndoorTransmissionLossOrNoiseReductionCurve`
- `oneThirdOctaveBands80To4000Hz`
- `facadeOutdoorContext=outdoor_indoor_facade`
- `openingOrFacadeAreaEnergyContext`

Boundaries to keep:

- no `STC` to `OITC` alias;
- no `Rw` to `OITC` alias;
- no `NISR` / `ISR` to `OITC` alias;
- no indoor `DnT,w` to outdoor-indoor facade metric alias;
- no source report scalar OITC unless construction, metric, standard,
  basis, and context truly match.

### Step 2: Promote A Reusable Spectral Rating Backbone

ROI:
very high, because it reduces repeated work for OITC, STC, Rw/C/Ctr,
field/building companions, exact user curves, opening curves, and later
triple-leaf or roof/facade routes.

Candidate label:
`post_v1_spectral_rating_backbone_v1`.

Target behavior:

- add a shared adapter inventory row for outdoor-indoor OITC rather
  than leaving it as only a target output and owner-specific logic;
- centralize band-set validation for airborne TL, outdoor-indoor TL/NR,
  and impact level curves;
- stop overloading `third_octave_100_3150` for outdoor-indoor OITC
  curves by adding an explicit band-set basis or exact OITC frequency
  coverage validation;
- keep `buildRatingsFromCurve` from becoming a dumping ground by
  separating rating procedures from route-family solvers;
- expose a route-owned `ratingsFromOwnedCurve` style primitive that can
  derive all valid companions for the curve and explicitly block invalid
  companions.

Expected movement:

- immediate runtime values may be zero if this is done as support, but
  the exit condition must be a selected value-moving owner that consumes
  the backbone;
- after OITC lands, this should reduce the implementation cost of each
  future spectral owner by removing duplicated band/rating/basis code.

Do not select this as a long support loop. It is valid only if it is
implemented tightly around the just-landed OITC owner or a selected
curve-producing route.

### Step 3: Make Route/Input Families First-Class

ROI:
very high, because arbitrary user stacks fail mainly when route-required
inputs are not represented uniformly.

Candidate label:
`post_v1_route_input_family_first_class_surface_v1`.

Target behavior:

- extend shared input-completeness route families for at least:
  `ceiling_airborne_plenum`, `roof_airborne`,
  `opening_facade_indoor`, `opening_facade_outdoor_indoor_oitc`, and
  `field_building_flanking_context`;
- decide whether `AcousticAnswerBoundaryRouteSchema` should include
  `opening`, `facade`, and `roof`, or whether a separate route-family
  field should own that precision;
- map each route family to required, conditional, optional precision,
  and source-evidence inputs;
- make route-local `needs_input` owners feed this common structure.

Expected movement:

- mostly input-surface and boundary movement;
- large downstream scope unlock because agents stop rediscovering the
  same required input lists in every owner.

Exit test:
an executable contract should prove that wall, floor, ceiling/plenum,
opening/facade, OITC, and building/flanking families all have explicit
required input rows and no missing-input boundary can hide source-only
evidence.

### Step 4: Add A Golden Scenario Matrix

ROI:
very high, because it makes the "best calculator" target measurable and
prevents drift into weak slices.

Candidate label:
`post_v1_industry_grade_golden_scenario_matrix_v1`.

Target behavior:

- define 40 to 60 representative requests across wall, floor, ceiling,
  roof/facade, opening, impact, and building contexts;
- for each scenario assert target outputs, basis, expected numeric
  corridor or exact value, required inputs, unsupported aliases, and
  tolerance class;
- include hostile cases: missing topology, missing dynamic stiffness,
  scalar-only route asking for spectral companions, OITC without
  outdoor-indoor bands, lab value copied to field/building, and
  ambiguous roof/ceiling/suspended-ceiling context.

This is support work, but it directly accelerates calculator work
because it changes slice selection from document counters to executable
coverage gaps.

Exit test:
the matrix must produce a ranked gap ledger with at least one selected
value-moving next owner and explicit rejected wrong paths.

### Step 5: Build The Route-Required Input Question Engine

ROI:
high, because a calculator for arbitrary user assemblies must ask for
missing physics instead of merely saying unsupported.

Candidate label:
`post_v1_route_required_input_question_engine_v1`.

Target behavior:

- turn `needs_input` boundaries into ordered next questions by route;
- prefer the minimum unblocker set, not a long form;
- distinguish hard blockers from optional precision inputs;
- expose conservative defaults only where the route explicitly owns the
  default and the result labels the assumption.

Examples:

- double-leaf wall: leaf groups, cavity depth, support topology,
  bridge class, support spacing, absorber flow resistivity;
- floor impact: dynamic stiffness, load basis, base slab/carrier,
  resilient layer role, lower ceiling support/cavity;
- ceiling/plenum: leaf grouping, plenum depth, absorber properties,
  support/coupling class, route intent;
- facade/OITC: outdoor-indoor context, TL/NR band set, element area,
  rating basis;
- building: element area, receiving room volume, RT60 or normalization
  basis, flanking/junction context.

This may touch UI/workbench later, but the first owner should be an
engine/shared contract, not a cosmetic UI pass.

### Step 6: Promote Triple-Leaf / Multi-Cavity Runtime Only After Calibration

ROI:
high, but only after the backbone and scenario matrix prevent unsafe
promotion.

Candidate label:
`post_v1_wall_triple_leaf_multicavity_runtime_promotion_after_holdout_v1`.

Reason:
triple-leaf/multi-cavity walls are a major real-world gap. The current
system already has research-only frequency solver and source-pack work.
The right next move is not to guess runtime values; it is to close
calibration/holdout tolerance ownership and then expose runtime where
the route is source-owned or explicitly source-absent with a defensible
budget.

Exit test:
runtime promotion requires source-family calibration, holdout tolerance,
negative boundaries, and paired engine/web-visible behavior. Until then
the route must stay `needs_input` or `unsupported` rather than claiming
industry-grade accuracy.

### Step 7: Generalize Building / Flanking Adapters By Route Family

ROI:
high, because real users ask for field and building metrics, not only
lab element ratings.

Candidate label:
`post_v1_building_flanking_adapter_backbone_v1`.

Target behavior:

- reuse route-owned direct curves or direct scalar anchors only when
  the basis permits;
- require element area, receiving room volume, RT60 or normalization
  basis, junction/flanking class, coupling length, opening/leak context,
  and mounting/topology as applicable;
- derive `R'w`, `Dn,w`, `DnT,w`, `Dn,A`, `DnT,A`, `L'n,w`, and
  `L'nT,w` through owned adapters;
- preserve lab, field, building, ISO, ASTM, and A-weighted basis
  separation.

Do not implement a generic "building penalty" shortcut.

## Actionable Backlog

These items convert the plan above into implementation slices. They are
ordered. Do not skip to a lower item unless a higher item is either
landed, explicitly blocked by a named implementation fact, or rejected
by a newer source-of-truth document.
Suffix items such as `A4a` are conditional accelerators for the nearest
parent item. They do not replace A0/A1 and should be selected only when
their parent prerequisite is landed or when the parent is explicitly
blocked by the missing primitive the suffix item supplies.

### Backlog Implementation Fit Check - 2026-06-29

The actionable backlog was rechecked against the implementation after
being written. The sequence is still valid and calculator-aligned.

- A0 is correct because the selected owner plan exists and the selected
  owner contract file is still absent. The next action should create and
  implement that contract instead of selecting another rerank.
- A1 is correct because `OITC` is already requestable in
  `RequestedOutputSchema`, while `RatingAdapterIdSchema` has no OITC /
  ASTM E1332 adapter, `calculate-assembly.ts` only emits the OITC bridge
  warning, and shared band metadata still only exposes
  `third_octave_100_3150`.
- A2 is correct as a post-runtime protection step only. Its files are
  expected to be new; it must not run before A1 lands and must move no
  runtime values.
- A3 is correct because `buildRatingsFromCurve` currently owns ISO 717-1
  / ASTM E413 style airborne ratings, while ASTM E989 impact rating is
  implemented separately. A small spectral-rating backbone would remove
  real duplication, but only after OITC proves the shared shape.
- A4 is correct because `input-completeness.ts` already has many
  opening/frequency/context field ids, but route-family and answer-route
  enums are still not first-class for opening/facade, roof,
  ceiling/plenum, or OITC.
- A5 is correct because there is already a 24-row executable scenario
  matrix pattern for wall/floor coverage. The proposed industry-grade
  matrix should reuse that pattern after at least one new runtime owner
  lands.
- A6 is correct because many owners return precise `needs_input`, but
  there is no shared next-question payload that orders the minimum
  unblocker inputs across route families.
- A7 is correctly blocked. The triple-leaf readiness code still reports
  runtime promotion as false and names calibration/source/paired-test
  blockers; this item must not be implemented as a shortcut runtime
  promotion.
- A8 is correct because building-prediction formula corridors and
  route-specific adapters exist, but there is not yet a reusable
  route-family building/flanking adapter primitive.
- Second-iteration strengthening found three additional high-ROI
  accelerators: a shared layer physical-property resolver, a direct tie
  between the future golden matrix and the existing realistic
  layer-combination cartography, and an explicit roof/facade airborne
  owner after route/input families are first-class. These expand
  calculable scope without displacing the selected OITC owner.

Implementation conclusion:
the backlog is useful because each item either opens a target output,
captures route-required physical inputs, protects metric/basis
integrity, or reduces repeated owner cost. None of the items depend on
broad source crawling, confidence labeling, cosmetic UI work, or
metric aliasing.

### Global Execution Rules

Apply these rules to every backlog item.

- Respect the selected slice. A0/A1 remain first unless a newer
  source-of-truth document explicitly changes the selected action.
- Contract first. New runtime behavior starts with a focused contract
  test that proves the complete request, missing-input behavior, and
  hostile unsupported aliases.
- Exact evidence stays exact. Source rows may win only on true
  construction, metric, standard, basis, and context identity.
- No metric aliases. `Rw`, `STC`, `NISR`, `ISR`, indoor `DnT,w`,
  `Ln,w`, or `DeltaLw` must not be used as OITC/IIC/AIIC substitutes.
- No hidden basis promotion. If a metric changes from lab to field,
  building, ASTM, outdoor-indoor, A-weighted, or spectral basis, the
  route must own that adapter and expose required inputs.
- Missing physics returns `needs_input`. Unsupported physics returns
  `unsupported`. Do not silently default dynamic stiffness, load basis,
  flow resistivity, cavity depth, flanking, room volume, RT60, or
  frequency-band requirements unless a route explicitly owns and labels
  that default.
- Support-only slices need an exit. Coverage refreshes, reranks,
  matrices, and docs updates must name the runtime, accuracy,
  input-surface, or boundary behavior they protect or unlock.
- Keep abstractions calculator-local. Extract a primitive only when it
  removes repeated rating, band-validation, route-input, or
  building/flanking logic that is already needed by a selected owner.
- Do not broaden source work. Importing or crawling many product rows is
  out of scope unless the selected item names an exact-match,
  calibration, holdout, or bounded-delta use.
- Keep frontend work behind engine ownership. UI/workbench changes are
  valid only after the engine/shared layer owns the required input,
  output, or question payload.
- Validate proportionally. For runtime/schema moves, run the focused
  Vitest contract while iterating, `pnpm calculator:gate:current`
  before and after behavior movement, and `git diff --check` before
  handoff. For docs-only updates, `git diff --check` is enough.
- Handoffs must include a progress ledger: behavior opened, new request
  shapes, new target outputs, inputs captured, runtime values moved,
  aliases protected, and support work done.

### A0: Keep The Current Selected Slice Unblocked

Status:
ready to implement.

Purpose:
avoid reopening planning while the selected behavior is already known.

Start files:

- `docs/calculator/DOCUMENTATION_MAP.md`
- `docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md`
- `packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`

Actions:

- create the selected OITC owner contract test file if it is still
  absent;
- keep the test name, owner label, selected candidate id, and handoff
  counters aligned with the documentation map;
- write the contract around one complete outdoor-indoor facade request,
  one missing-context `needs_input` request, and hostile alias requests.

Exit test:
the contract file exists and fails for the right reason before runtime
work: complete OITC is not calculated yet, while missing inputs and
alias boundaries are asserted.

Do not:
select another rerank, source crawl, confidence-label pass, or UI slice
before this selected owner is either implemented or explicitly blocked.

### A1: Land Outdoor-Indoor OITC Spectral Rating Runtime

Status:
highest immediate ROI.

Purpose:
open one market-facing target output on its correct outdoor-indoor
spectral basis.

Start files:

- `packages/shared/src/domain/output.ts`
- `packages/shared/src/domain/rating-adapter.ts`
- `packages/shared/src/domain/airborne-context.ts`
- `packages/engine/src/curve-rating.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/layer-combination-resolver-registry.ts`
- `packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`

Actions:

- add or validate an explicit OITC outdoor-indoor band basis instead of
  reusing `third_octave_100_3150`;
- add a first-class OITC / ASTM E1332 style adapter id or equivalent
  owned adapter metadata;
- implement OITC from an owned outdoor-indoor TL/NR spectrum, not from
  `Rw`, `STC`, `NISR`, `ISR`, or indoor `DnT,w`;
- require outdoor-indoor facade context, curve coverage, and area /
  energy-composite context where the route needs it;
- wire the runtime route so complete OITC requests publish one `OITC`
  value and incomplete requests return precise `needs_input`;
- keep source scalar OITC usable only for exact construction, standard,
  basis, and context matches.

Exit test:
the selected contract passes with `newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`, and
`runtimeValuesMoved: 1`; hostile aliases stay `unsupported`.

Do not:
publish OITC from scalar STC/Rw, generic source proximity, or the
current `third_octave_100_3150` label without exact OITC coverage
validation.

### A2: Add A Tight OITC Coverage Refresh

Status:
support-only, allowed only immediately after A1.

Purpose:
protect the newly opened OITC runtime owner before selecting the next
value-moving slice.

Start files:

- `packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`
- `packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts`
- `docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Actions:

- re-probe the exact landed OITC runtime fixture;
- re-probe missing band/context `needs_input`;
- re-probe `Rw`, `STC`, `NISR`, `ISR`, indoor `DnT,w`, impact, and
  source-row proximity aliases as blocked;
- select the next item from this backlog, preferably A3 or A4.

Exit test:
runtime values moved remain `0`; the refresh names the next
behavior-moving item and does not start a support loop.

Do not:
add new source rows, retune formulas, or expand UI scope in this
refresh.

### A3: Extract The Reusable Spectral Rating Backbone

Status:
next preferred support/architecture slice after OITC runtime lands.

Purpose:
make future curve-producing routes cheaper and safer by centralizing
rating procedure and band validation.

Start files:

- `packages/shared/src/domain/rating-adapter.ts`
- `packages/shared/src/domain/airborne-context.ts`
- `packages/engine/src/curve-rating.ts`
- `packages/engine/src/impact-astm-e989.ts`
- new focused helper if needed, for example
  `packages/engine/src/spectral-rating.ts`
- new contract:
  `packages/engine/src/post-v1-spectral-rating-backbone-v1-contract.test.ts`

Actions:

- define a shared band-set / frequency-coverage validation primitive
  for airborne TL, outdoor-indoor TL/NR, and impact curves;
- move OITC, ISO 717-1, ASTM E413, and ASTM E989 adapter metadata into
  a consistent inventory without forcing one route solver to own all
  procedures;
- expose a `ratingsFromOwnedCurve` style engine primitive that returns
  only basis-valid companions and explicit blocked outputs;
- update the landed OITC owner to consume the primitive;
- keep `curve-rating.ts` focused on rating math, not route-family
  selection.

Exit test:
OITC still passes through the backbone; existing ISO/STC/impact tests
remain green; the contract proves invalid companions are blocked rather
than silently omitted or aliased.

Do not:
turn this into a broad refactor of `calculate-assembly.ts`.

### A4: Make Route/Input Families First-Class

Status:
high ROI after A1/A3, or earlier only if A1 is blocked by shared schema
limits.

Purpose:
turn recurring route-local `needs_input` logic into a reusable input
surface for arbitrary user stacks.

Start files:

- `packages/shared/src/domain/input-completeness.ts`
- `packages/shared/src/domain/acoustic-answer-boundary.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/layer-combination-resolver-registry.ts`
- new contract:
  `packages/engine/src/post-v1-route-input-family-first-class-surface-v1-contract.test.ts`

Actions:

- add first-class route families for ceiling/plenum, roof airborne,
  opening/facade indoor, opening/facade outdoor-indoor OITC, and
  field/building flanking context;
- decide whether answer boundary `route` should add `opening`,
  `facade`, and `roof`, or whether a separate route-family field should
  carry that precision;
- map required, conditional, optional-precision, and source-evidence
  inputs for each family;
- feed route-local missing-input owners through this shared structure.

Exit test:
an executable contract shows wall, floor, ceiling/plenum, roof,
opening/facade, OITC, and building/flanking families all expose
required input rows and no source-only evidence is mislabeled as
physical `needs_input`.

Do not:
claim new numeric calculator coverage unless a runtime owner actually
publishes a value.

### A4a: Add A Shared Layer Physical-Property Resolver

Status:
conditional accelerator after A4, or earlier only if a selected runtime
owner is blocked by duplicated material-property derivation.

Purpose:
increase arbitrary user-layer coverage by resolving physical properties
once, with provenance, instead of each route rediscovering
`surfaceMassKgM2`, density-derived mass, flow resistivity, dynamic
stiffness, stiffness, and loss-factor requirements.

Start files:

- `packages/shared/src/domain/layer.ts`
- `packages/shared/src/domain/material.ts`
- `packages/shared/src/domain/input-completeness.ts`
- `packages/engine/src/material-catalog.ts`
- existing owner patterns such as
  `packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-owner-contract.test.ts`
  and
  `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`
- new helper if needed:
  `packages/engine/src/layer-physical-properties.ts`
- new contract:
  `packages/engine/src/post-v1-layer-physical-property-resolver-backbone-v1-contract.test.ts`

Actions:

- define one route-consumable resolved-property payload for layer
  surface mass, material density, acoustic behavior, property source
  status, absorber flow resistivity, impact dynamic stiffness, panel
  stiffness, and loss factor;
- derive surface mass only from explicit `layer.surfaceMassKgM2` or
  `materialCatalog.densityKgM3 * layer.thicknessMm`; reject zero or
  unknown density unless the route explicitly owns a zero-mass layer;
- carry provenance for every resolved value:
  `user_supplied`, `catalog_nominal`, `source_owned`,
  `engineering_default`, or `unknown`;
- map missing route-required properties into `AcousticInputCompleteness`
  instead of route-local warning strings;
- prove at least one wall airborne route and one floor-impact route can
  consume the same resolved-property shape.

Exit test:
the contract proves explicit mass wins over derived mass, density-based
mass is derived consistently, unknown density returns `needs_input`,
flow resistivity and dynamic stiffness are not guessed, and no runtime
value moves unless an existing owner already had the same physical
inputs.

Do not:
create a generic material library project, crawl product catalogs, or
invent acoustic properties from material names.

### A5: Build The Industry-Grade Golden Scenario Matrix

Status:
support slice with strong ROI after at least one runtime owner lands.

Purpose:
make the "best calculator" goal measurable and keep future selection
based on executable coverage gaps.

Start files:

- existing scenario patterns:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`
- new matrix module if needed:
  `packages/engine/src/industry-grade-golden-scenario-matrix.ts`
- new contract:
  `packages/engine/src/post-v1-industry-grade-golden-scenario-matrix-v1-contract.test.ts`

Actions:

- define 40 to 60 scenarios across wall, floor, ceiling/plenum, roof,
  opening/facade, OITC, impact, and building contexts;
- for each scenario record request shape, target outputs, basis,
  expected value/corridor when owned, required inputs when missing, and
  unsupported aliases;
- include hostile cases for missing topology, missing dynamic
  stiffness, scalar route asking for spectral companions, OITC without
  outdoor-indoor bands, lab-to-field copying, and ambiguous
  roof/ceiling/suspended-ceiling context;
- produce a ranked gap ledger that names the next behavior-moving
  owner.

Exit test:
the matrix contract passes and outputs a deterministic ranked gap
summary with at least one selected runtime, accuracy, or input-surface
owner.

Do not:
use the matrix as a substitute for runtime work; it must select the next
calculator behavior.

### A5a: Tie The Golden Matrix To Realistic Cartography

Status:
support accelerator after A5 matrix shape is defined.

Purpose:
make future slice selection depend on realistic user-entered stack
failures, not only curated plan counters.

Start files:

- `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`
- `packages/engine/src/industry-grade-golden-scenario-matrix.ts`
- new contract:
  `packages/engine/src/post-v1-industry-grade-golden-scenario-cartography-gap-ledger-v1-contract.test.ts`

Actions:

- reuse the existing cartography vocabulary for evidence tier,
  candidate type, support bucket, expected supported outputs, expected
  unsupported outputs, and evidence paths;
- include wall, floor, ceiling/plenum, roof/facade, opening/facade,
  OITC, impact, and building rows in a single ranked gap ledger;
- separate `fail_closed`, `needs_input`, `partial`, and `supported`
  rows so correct blocking is not mistaken for calculator weakness;
- rank next owners by observed real-stack scope gain, target-output
  gain, basis integrity risk, and implementation readiness;
- require the ledger to name at least one behavior-moving owner and at
  least two rejected wrong paths.

Exit test:
the contract produces a deterministic gap ledger from matrix rows plus
cartography rows, and its top-ranked next owner points to a runtime,
accuracy, input-surface, or boundary behavior rather than another
support loop.

Do not:
turn cartography into confidence wording, UI copy, or a broad product
catalog import.

### A6: Build The Route-Required Input Question Engine

Status:
high ROI after A4 or after enough repeated `needs_input` rows exist.

Purpose:
turn calculator boundaries into the next minimum physical questions a
user must answer.

Start files:

- `packages/shared/src/domain/input-completeness.ts`
- `packages/shared/src/domain/acoustic-answer-boundary.ts`
- new shared/engine helper if needed, for example
  `packages/shared/src/domain/route-required-input-question.ts`
- new contract:
  `packages/engine/src/post-v1-route-required-input-question-engine-v1-contract.test.ts`

Actions:

- convert `needs_input` rows into ordered question groups by route
  family;
- distinguish hard blockers from optional precision inputs;
- expose conservative defaults only where the route explicitly owns the
  default and can label the assumption;
- keep the first owner engine/shared-only unless the engine can already
  produce stable question data for the workbench.

Exit test:
contracts prove that double-leaf wall, floor impact, ceiling/plenum,
facade/OITC, and building/flanking routes return minimal unblocker
questions instead of a long generic form.

Do not:
start a cosmetic workbench redesign before the engine owns the question
payload.

### A7: Promote Triple-Leaf / Multi-Cavity Runtime After Holdout

Status:
blocked until calibration and holdout evidence are explicit.

Purpose:
open a major real-world wall family without promoting research-only
math as industry-grade output.

Start files:

- `packages/engine/src/wall-triple-leaf-frequency-solver.ts`
- `packages/engine/src/wall-triple-leaf-calibration-regime.ts`
- `packages/engine/src/wall-triple-leaf-runtime-promotion-readiness.ts`
- `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver.ts`
- new contract:
  `packages/engine/src/post-v1-wall-triple-leaf-multicavity-runtime-promotion-after-holdout-v1-contract.test.ts`

Actions:

- name the source-family calibration rows and holdout rows;
- define numeric tolerance corridors and failure budgets;
- prove negative boundaries for uncalibrated topology, missing cavity
  data, missing panel mass/stiffness, and unsupported field/building
  companions;
- only then promote runtime values for owned triple-leaf/multi-cavity
  requests.

Exit test:
runtime values move only for calibrated or explicitly source-absent
owned corridors; unsupported adjacent bases remain blocked.

Do not:
promote the existing research solver directly to runtime.

### A8: Generalize Building / Flanking Adapters By Route Family

Status:
high ROI after A3/A4 expose enough route and basis metadata.

Purpose:
produce field/building outputs from owned lab/direct paths without a
generic penalty shortcut.

Start files:

- existing building prediction modules such as
  `packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts`
- existing field/building adapter owners under `packages/engine/src`
- `packages/shared/src/domain/input-completeness.ts`
- `packages/shared/src/domain/acoustic-answer-boundary.ts`
- new contract:
  `packages/engine/src/post-v1-building-flanking-adapter-backbone-v1-contract.test.ts`

Actions:

- inventory existing field/building adapters and the physical context
  each requires;
- extract a route-family adapter primitive for direct path, flanking,
  room normalization, area, RT60, coupling length, opening/leak context,
  and mounting/topology;
- derive only basis-valid `R'w`, `Dn,w`, `DnT,w`, `Dn,A`, `DnT,A`,
  `L'n,w`, and `L'nT,w`;
- preserve lab, field, building, ISO, ASTM, and A-weighted boundaries.

Exit test:
at least two different route families consume the same building/flanking
primitive and a hostile lab-to-field copy case remains blocked.

Do not:
implement a generic "building penalty" or copy lab values into field
outputs.

### A8a: Open An Explicit Roof/Facade Airborne Owner

Status:
scope-expansion candidate after A3/A4 and preferably after A5/A5a rank
roof/facade as a top gap.

Purpose:
turn the already-landed roof/ceiling/suspended-ceiling boundary from a
correct block into calculable roof/facade airborne coverage where the
route and formula basis are owned.

Start files:

- `packages/shared/src/domain/airborne-context.ts`
- `packages/shared/src/domain/input-completeness.ts`
- `packages/shared/src/domain/acoustic-answer-boundary.ts`
- `packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/layer-combination-resolver-registry.ts`
- new contract:
  `packages/engine/src/post-v1-roof-facade-airborne-route-owner-v1-contract.test.ts`

Actions:

- require explicit `routeIntent: roof_airborne` and
  `roofOrCeilingMountingContext` before any roof/facade value is
  published;
- start with the narrowest owned formula route, such as an explicit
  transmission-loss curve or a single-leaf mass-law-compatible
  roof/facade element, then derive only valid `Rw`, `STC`, `C`, and
  `Ctr` companions through the spectral rating backbone;
- keep outdoor-indoor `OITC` separate unless the OITC adapter and
  outdoor-indoor band basis are present;
- keep ceiling airborne plenum, suspended-ceiling impact,
  field/building, and source-row proximity substitutions blocked unless
  separately owned.

Exit test:
one explicit roof/facade airborne request becomes calculable on route
`roof` or an explicitly named roof/facade route family, while ambiguous
ceiling/roof stacks, OITC, suspended-ceiling impact, and borrowed
ceiling values remain `needs_input` or `unsupported`.

Do not:
reuse ceiling plenum values as roof/facade ratings or publish
field/building roof/facade metrics from lab values.

## Current Highest-ROI Decision

The immediate highest-ROI implementation remains the selected OITC
owner, but it must be implemented as the first reusable spectral-rating
backbone step:

1. land OITC spectral rating owner;
2. run a bounded OITC coverage refresh only if it protects the landed
   runtime owner;
3. select the next owner from the high-ROI sequence above, with strong
   preference for reusable spectral rating backbone or first-class
   route/input families;
   if a selected owner is blocked by duplicated material-property
   derivation, use A4a as the narrow accelerator;
4. do not select broad source crawling, confidence wording, UI polish,
   or another support-only loop unless the just-landed behavior needs a
   concrete protection contract.

## Wrong Paths To Reject

Reject these unless a newer source-of-truth deliberately changes the
plan:

- crawling all layer combinations or all product catalog rows;
- importing many source rows without exact-match, anchor, calibration,
  or holdout use;
- using `Rw`, `STC`, `NISR`, `ISR`, `DnT,w`, `Ln,w`, or `DeltaLw` as
  OITC/IIC/AIIC aliases;
- promoting research-only frequency solvers without calibration and
  holdouts;
- using generic confidence labels as a substitute for route-owned
  physics;
- broad refactors of `calculate-assembly.ts` that do not extract a
  reusable calculator primitive;
- frontend polish before the engine knows which physical input it needs
  next;
- chaining coverage refreshes, reranks, or docs updates after this plan
  without selecting a behavior-moving owner.

## Progress Metrics For Future Handoffs

Every future handoff that claims calculator progress should report:

- new calculable request shapes;
- new target outputs;
- required physical inputs captured;
- route families made first-class;
- runtime values moved;
- formula retunes or calibration rows moved;
- unsupported aliases protected;
- whether the change reduced the next-owner implementation cost by
  reusing a backbone instead of adding another bespoke path.

If no runtime or accuracy behavior moved, the handoff must name the
specific blocker it removed and the exact next behavior it unlocks.

## Summary Judgment

DynEcho's strategic weakness is not insufficient documentation and not
insufficient source rows. The weakness is that too many route families
still become calculable through bespoke owner chains rather than shared
calculator primitives.

The fastest path to a much stronger calculator is:

`OITC spectral owner`
-> `spectral rating backbone`
-> `first-class route/input families`
-> `shared layer physical-property resolver when selected routes need it`
-> `golden scenario matrix`
-> `realistic cartography gap ledger`
-> `route-required input question engine`
-> `explicit roof/facade airborne owner when ranked as top gap`
-> `calibrated triple-leaf/multi-cavity runtime`
-> `generalized building/flanking adapters`.

This sequence keeps the product a calculator, increases the number of
layer combinations that can be calculated, preserves metric/basis
integrity, and prevents agent drift into source catalog, confidence
wording, or UI-only work.
