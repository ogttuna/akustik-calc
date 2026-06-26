# Industry-Grade Calculator Gap Analysis And Route Selection Guard

Last reviewed: 2026-06-25

## Purpose

This document records the current gap analysis for turning DynEcho into
an industry-grade acoustic calculator. It is a planning and route
selection guard. It does not replace the source of truth, the current
selected implementation plan, the latest checkpoint, or any runtime
contract.

Current selected implementation:

`post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan`

Current selected file:

`packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts`

Current selected plan:

`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Latest landed input-boundary owner:

`post_v1_opening_facade_door_window_frequency_input_boundary_owner_plan`
/
`packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner-contract.test.ts`
/
`post_v1_opening_facade_door_window_frequency_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`.
It used selected candidate
`opening.facade_door_window_frequency_input_boundary_owner`,
captured `requiredPhysicalInputsCaptured: 6`, protected
`unsupportedBoundariesProtected: 8`, and selected
`post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts`
/
`post-V1 opening/facade door/window frequency-input boundary coverage refresh`.

Latest landed no-runtime rerank:

`post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-advanced-wall-current-gate-checkpoint-contract.test.ts`
/
`post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_landed_no_runtime_selected_opening_facade_door_window_frequency_input_boundary_owner`.
It selected
`opening.facade_door_window_frequency_input_boundary_owner` from
`candidateCount: 8` live candidates.

Use this document to avoid wrong strategic turns after that fresh
rerank: do not turn the calculator into a source catalog, scalar rating
table, UI polish project, or broad source crawl. Use it to select
vertical formula-family milestones that increase physically owned
calculable request shapes, target outputs, required input capture,
accuracy, calibration, or metric/basis protection.

## Current Judgment

DynEcho is aligned with the right product architecture. Its strongest
asset is not the number of plan files or source rows; it is the strict
calculation posture:

- use exact measured/source rows only when the construction identity,
  metric, standard, basis, and context truly match;
- use compatible anchors or bounded deltas only when family, basis, and
  construction boundaries are proven;
- otherwise calculate through the best owned physics or formula route;
- otherwise return precise `needs_input` or `unsupported`.

That posture is the correct foundation for an industry-grade
calculator. The remaining gap is breadth and evidence depth: formula
coverage, frequency-band consistency, calibration/holdout evidence,
route-required input capture, and building/flanking prediction depth.

Approximate maturity as of this review:

- controlled internal V1 calculator: about 75-85 percent;
- broad industry-grade calculator comparable in posture to mature
  acoustic prediction tools: about 40-50 percent.

The lower second score is not a criticism of architecture. It reflects
the much higher bar for arbitrary user-entered stacks across walls,
floors, ceilings, roofs, facades, openings, impact, field, and building
prediction.

## External Market Bar

### Element-Level Prediction

Element-level tools such as INSUL establish the practical expectation
that a useful acoustic calculator predicts frequency-band behavior for
walls, floors, ceilings, glazing/windows, leakage, facades, and impact
questions rather than only storing scalar ratings. INSUL's public
material describes predicted frequency ranges, wall/floor/ceiling/window
coverage, leakage handling, outdoor-to-indoor facade use, and single
number outputs derived from the prediction flow.

Implication for DynEcho:

- scalar `Rw`, `STC`, `Ln,w`, or `IIC` expansion is not enough;
- the durable target is route-owned one-third-octave curves where the
  route family can support them;
- companion metrics should be derived from the owned curve through the
  correct rating adapter when the spectrum is available;
- scalar-only routes must keep adjacent spectral companions blocked
  unless the required spectrum or adapter is owned.

### Building-Level Prediction

Building-level tools such as SONarchitect and CadnaB normalize ISO
12354-style thinking: direct transmission, flanking transmission,
junctions, room pairs, receiving-room normalization, facade/exterior
transfer, and building context. The public descriptions of these tools
and ISO 12354 point toward third-octave calculation, direct and indirect
paths, and single-number ratings derived from calculated spectra.

Implication for DynEcho:

- lab values must not be copied into field or building outputs;
- `R'w`, `Dn,w`, `DnT,w`, `Dn,A`, `DnT,A`, `L'n,w`, and `L'nT,w`
  require direct-path, room, area, normalization, junction, coupling,
  flanking, and mounting context;
- building prediction should grow through narrow owned adapters, not a
  broad generic "building penalty" shortcut.

### Standards And Basis Integrity

The relevant standards reinforce the current engine discipline:

- ISO 717-1 and ISO 717-2 derive single-number airborne and impact
  ratings from octave or one-third-octave band data, with laboratory
  ISO 10140 work tied to one-third-octave bands.
- ASTM E90 laboratory transmission loss is not a field result; the
  standard notes that building measurements include many flanking paths
  and that laboratory ratings are an upper-limit posture for field
  results.
- ASTM E336 field sound isolation includes direct and flanking paths;
  NIC, NNIC, and ASTC are distinct and not interchangeable labels.
- ASTM E492 and ASTM E989 tie IIC to one-third-octave laboratory impact
  data; ASTM E1007 field impact ratings include field/flanking context.

Implication for DynEcho:

- ISO and ASTM rating adapters must remain explicit;
- lab, field, building, A-weighted, and characteristic metrics must
  remain basis-separated;
- ISO impact values must not be aliased into ASTM IIC/AIIC;
- exact measured rows are evidence, not permission to cross metric or
  context boundaries.

## Repo-Grounded Current Strengths

### Metric And Basis Guardrails

`packages/shared/src/domain/rating-adapter.ts` and related domain files
already encode the most important safety rule: metric families and
bases are not interchangeable. This is a real competitive advantage
because it prevents attractive but wrong shortcuts.

### Input Completeness Model

`packages/shared/src/domain/input-completeness.ts` already names route
families and physical inputs for materials, topology, field context,
building context, flanking context, openings, dynamic stiffness, load
basis, surface mass, cavity, frame, and other route requirements. This
is the correct foundation for arbitrary user materials and assemblies.

### Existing Field And Building Adapter Discipline

The Gate AR and Gate AY chains show the correct pattern for field and
building work: keep lab companions on their lab basis, require building
context for building outputs, and protect missing physical context with
`needs_input` instead of guessing.

### Runtime Boundary Discipline

Some routes are intentionally not runtime eligible when evidence is not
strong enough. The triple-leaf frequency solver being kept
research-only is a good example. That kind of restraint is necessary if
DynEcho is to become trusted rather than merely broad.

### Current Documentation State

The current selected next action is a fresh runtime-first rerank after
the advanced-wall current-gate checkpoint. That is correct. The next
runtime owner should be selected from current state, not from stale
historical selected-next prose.

## Repo-Grounded Weak Signals

The codebase has strong wall and floor surface area, but the runtime
surface for other market-critical families is materially thinner.
String and filename scans are not proof of behavior, but they are useful
directional signals:

- wall and floor coverage is much denser than facade, roof, door,
  window, and standalone ceiling coverage;
- ceiling appears more often as a floor lower-treatment role than as a
  first-class independent route family;
- flanking, frequency/spectrum, calibration, and holdout terms appear
  much less often than wall/floor terms;
- several landed owners record `runtimeFormulaRetunes: 0`, which is
  fine for boundary or companion work but not enough for long-term
  accuracy maturity;
- holdout coverage exists in some lanes, but is not yet a uniform
  requirement across mature route families.

Do not over-interpret this as "nothing works" in these areas. The
correct interpretation is narrower: the architecture is ready, but the
route-family ownership is uneven.

## Implementation Validation Notes

Targeted implementation validation on 2026-06-25 exercised the route
families and guardrails named in this document. The sampled contract set
covered advanced-wall field/building lab companions, Gate AR building
lab companions, user-material floor impact dynamic stiffness,
opening/leak composite runtime, opening/leak same-basis holdout gating,
ASTM IIC/AIIC impact blocking, double-leaf/framed frequency backbone,
triple-leaf research-only frequency blocking, and steel-floor DeltaLw
holdout intake.

The sampled suite passed:

- `10` engine contract/test files;
- `61` tests;
- `0` runtime files changed by this validation.

Validation outcome:

- The fresh rerank is still genuinely pending: the selected contract
  file named by the active plan does not yet exist.
- The basis-integrity guard is real, not just documented. Existing
  tests keep lab companions basis-separated from field/building values
  and keep ASTM impact aliases blocked.
- The user-material floor-impact dynamic-stiffness sub-owner has
  already landed. Future work in that lane must not redo the landed
  dynamic-stiffness owner; it should extend remaining floor-impact
  depth such as broader resilient/floating stacks, lower-treatment
  interactions, field/building impact adapters, ASTM IIC/AIIC runtime
  ownership, or calibration/holdout support.
- The double-leaf/framed wall frequency-backbone numeric-sensitivity
  owner has already landed. Future frequency-first work must not repeat
  that owner; it should either globalize the backbone pattern across
  other major families or extend it to a family that still lacks an
  owned runtime curve.
- Opening/leak element-lab composite runtime has already landed, but
  same-basis holdout evidence remains intentionally constrained and
  some local candidates are benchmark-only or rejected. Future
  opening/facade work should focus on same-basis evidence, facade or
  door/window-specific inputs, and building/facade context rather than
  reopening the already-landed Gate S element-lab composite behavior.
- The triple-leaf frequency solver remains correctly research-only and
  runtime-blocked pending calibration and holdout tolerance ownership.

These findings reinforce the plan direction, but they narrow the next
work. The rerank should compare continuation/expansion owners, not
reselect already-landed sub-owners as if they were absent.

## Actionable Items After Implementation Comparison

This section converts the validated gap analysis into concrete
implementation candidates. The items are intentionally framed as
selection-ready work, not permission to skip the current rerank. The
active next step is still Action 0.

### Action 0: Land The Active Fresh Rerank

Status:

- pending;
- selected by current source-of-truth docs;
- selected contract file does not exist yet.

Start here:

- `docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_ADVANCED_WALL_CURRENT_GATE_CHECKPOINT_PLAN_2026-06-24.md`;
- `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-advanced-wall-current-gate-checkpoint-contract.test.ts`.

Implementation work:

- create the selected rerank contract file;
- re-read the checkpoint, current state, documentation map, next-agent
  brief, source of truth, and this guard document;
- compare concrete candidate owners from Actions 1-6;
- select exactly one next owner or record a precise no-safe-runtime
  reason.

Acceptance criteria:

- candidate comparisons are explicit and current-state based;
- already-landed owners are not reselected as if absent;
- selected owner names route family, target outputs, route-required
  inputs, `needs_input`, and unsupported boundaries;
- no runtime values move;
- no source rows are imported;
- no formula is retuned;
- no frontend files are touched;
- `git diff --check` passes.

Useful existing regression evidence:

- `post-v1-runtime-first-rerank-after-wall-gate-ar-direct-curve-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`;
- `post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`;
- `post-v1-runtime-first-route-family-rerank-after-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-contract.test.ts`.

No-go:

- do not use stale selected-next prose;
- do not select a support-only refresh unless it protects a landed
  runtime behavior and the rerank explains why no runtime move is safe.

### Action 1: Select A New Frequency-First Runtime Owner

Status:

- useful only if it extends beyond the already-landed
  double-leaf/framed wall frequency-backbone owner.

Best candidate shape:

- one high-use route family that still lacks an owned runtime curve; or
- one reusable backbone consolidation that makes curve-derived metric
  support consistent across existing families.

Implementation work:

- identify the selected family and current scalar/spectrum behavior;
- create an owner contract that proves a curve is computed or carried;
- derive allowed single-number metrics through the rating adapters;
- keep scalar-only adjacent companions blocked when no spectrum exists;
- add `needs_input` for any missing route-critical physical input.

Acceptance criteria:

- one-third-octave or explicitly owned band grid is named;
- `Rw`, `C`, `Ctr`, `STC`, `OITC`, `Ln,w`, or `IIC` are derived only
  through the correct adapter and only when the basis is owned;
- field/building outputs remain blocked unless a separate adapter and
  context are complete;
- exact/source rows are not imported just to create a curve-shaped
  catalog.

Useful existing regression evidence:

- `post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-owner-contract.test.ts`;
- `post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-coverage-refresh-contract.test.ts`;
- `post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts`;
- `wall-triple-leaf-frequency-solver.test.ts`.

No-go:

- do not re-land the double-leaf/framed wall frequency-backbone owner;
- do not promote triple-leaf runtime from the research-only solver until
  calibration and holdout tolerance owners are present.

### Action 2: Continue User-Material Floor Impact Depth

Status:

- useful, but dynamic stiffness for one custom visible heavy
  floating-floor stack is already runtime-owned.

Best candidate shape:

- broaden user-material impact coverage into one missing physical
  dimension: lower-treatment interaction, base-structure variation,
  field/building impact adapter, ASTM exact-band runtime ownership, or
  admissible calibration/holdout support.

Implementation work:

- choose one real user-entered floor stack;
- name the base floor/slab/subfloor, resilient layer, finish/topping,
  dynamic stiffness, load basis, and lower-treatment assumptions;
- open only the metrics whose basis is owned;
- keep field/building or ASTM metrics blocked until their context,
  bands, and rating owners are complete.

Acceptance criteria:

- `Ln,w` and `DeltaLw` open only through the selected ISO impact route;
- `IIC` and `AIIC` stay blocked unless ASTM E989/E492/E1007-style
  band/method ownership is complete;
- missing dynamic stiffness, load basis, base structure, or field
  context returns precise `needs_input`;
- adjacent airborne outputs remain independently owned or blocked.

Useful existing regression evidence:

- `post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`;
- `post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`;
- `calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts`;
- `post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts`.

No-go:

- do not count dynamic-stiffness capture alone as new progress unless a
  new family, input dimension, or target output is actually opened;
- do not alias ISO impact values into ASTM IIC/AIIC.

### Action 3: Continue Opening, Facade, Door, Or Window Ownership

Status:

- useful, but Gate S element-lab opening/leak composite `Rw` and `STC`
  runtime is already landed.

Best candidate shape:

- a same-basis holdout packet for opening/leak common-wall behavior; or
- facade/outdoor-to-indoor context for one bounded route; or
- door/window-specific physical input ownership that prevents generic
  opening labels from over-claiming support.

Implementation work:

- choose one composite assembly with opaque element, opening element,
  opening area ratio, and leakage/opening context;
- decide whether the owner is evidence/holdout, facade context, or
  runtime metric movement;
- keep element-lab, field, building, A-weighted, and facade bases
  separate;
- add exact missing inputs for opening acoustic data, area ratio,
  facade/exterior context, and room context.

Acceptance criteria:

- composite output is not the opaque wall value copied through;
- missing opening acoustic data or area ratio blocks the composite
  route;
- missing facade/room context blocks facade or building metrics only;
- local source-absent runtime probes remain benchmark-only unless a
  rights-safe same-basis holdout is accepted.

Useful existing regression evidence:

- `calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts`;
- `post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`;
- `company-internal-opening-leak-building-runtime-corridor-contract.test.ts`;
- `company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts`.

No-go:

- do not re-land Gate S;
- do not infer door, window, or facade support from a generic opening
  row;
- do not treat small openings as harmless without area/leakage math.

### Action 4: Add One Narrow Building/Flanking Runtime Owner

Status:

- useful when attached to a route family that already owns a direct
  element result.

Best candidate shape:

- one wall or floor family plus one explicit junction/flanking context;
- one target basis such as `R'w`, `Dn,w`, `DnT,w`, `Dn,A`, `DnT,A`,
  `L'n,w`, or `L'nT,w`.

Implementation work:

- select the direct element route that will feed the adapter;
- require room geometry/volume, reverberation or absorption
  normalization, separating area, junction class, coupling length, and
  flanking path assumptions;
- implement direct-plus-flanking behavior only for that bounded
  context;
- keep lab companions visible only on their lab basis.

Acceptance criteria:

- missing room, area, or junction context returns `needs_input`;
- no lab-to-field or lab-to-building copying occurs;
- unsupported adjacent building, A-weighted, characteristic, ASTM, and
  impact metrics remain blocked;
- trace text states the direct route and building/flanking basis.

Useful existing regression evidence:

- `calculator-personal-use-mvp-coverage-sprint-gate-am-airborne-building-prediction-direct-curve-owner-contract.test.ts`;
- `calculator-personal-use-mvp-coverage-sprint-gate-an-airborne-building-prediction-flanking-path-energy-owner-contract.test.ts`;
- `calculator-personal-use-mvp-coverage-sprint-gate-ao-airborne-building-prediction-junction-vibration-owner-contract.test.ts`;
- `post-v1-wall-gate-ar-direct-curve-building-lab-companion-target-output-independence-owner-contract.test.ts`;
- `calculator-personal-use-mvp-coverage-sprint-gate-bj-floor-impact-field-building-runtime-corridor-contract.test.ts`.

No-go:

- do not add a generic building penalty;
- do not extrapolate flanking across construction families without
  explicit ownership.

### Action 5: Add A Calibration/Holdout Packet For One Mature Route

Status:

- useful when a route already has stable runtime behavior but weak
  tolerance or evidence story.

Best candidate shape:

- one mature route with live runtime outputs and a small source-owned,
  same-family, same-basis evidence packet.

Implementation work:

- separate calibration rows from holdout rows;
- record source rights, construction identity, metric basis, standard,
  and route family;
- define accepted, rejected, and benchmark-only evidence decisions;
- keep runtime values frozen unless the owner explicitly becomes a
  retune/calibration slice.

Acceptance criteria:

- holdout rows are not also used as exact output rows;
- wrong-basis, missing-locator, missing-context, and source-absent rows
  are rejected or benchmark-only;
- tolerance policy and negative boundaries are explicit;
- `runtimeFormulaRetunes` is `0` unless a retune owner is explicitly
  selected.

Useful existing regression evidence:

- `calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`;
- `calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`;
- `post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`;
- `post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts`.

No-go:

- do not run a broad source crawl;
- do not use source rows as a catalog substitute for formula ownership;
- do not tune on the same rows used to prove holdout accuracy.

### Action 6: Add Route-Required Input Capture Only For The Selected Owner

Status:

- useful only after the rerank selects a runtime, accuracy, or boundary
  owner that names missing physical inputs.

Best candidate shape:

- one missing input surface that directly unlocks or protects the
  selected route.

Implementation work:

- add or expose the exact physical field in shared schema, API,
  workbench state, route-card status, saved replay, and report payloads
  only where needed;
- map raw route/internal ids into user-facing input labels;
- keep missing values visible as `needs_input`;
- preserve stale-result suppression when required inputs are invalid.

Acceptance criteria:

- route uses the captured field in runtime or boundary logic;
- omitted value returns precise `needs_input`;
- invalid zero/non-finite/hostile values fail closed;
- no UI-only polish is counted as calculator progress.

Useful existing regression evidence:

- `post-v1-required-physical-input-surface-parity-gate-cm-contract.test.ts`;
- `post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`;
- `post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`;
- `post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts`;
- `apps/web/features/workbench/steel-floor-formula-input-surface-acceptance.test.ts`;
- `apps/web/features/workbench/opening-leak-composite-input-surface-acceptance.test.ts`.

No-go:

- do not add free-floating UI fields that no route consumes;
- do not hide `needs_input` by defaulting unknown physical values.

### Action 7: Explicit Stop Conditions For The Rerank

If the rerank cannot safely select a runtime owner, it should stop with
one of these concrete blockers instead of choosing a weak slice:

- no route-owned spectrum for the requested companion metrics;
- no same-family same-basis calibration or holdout evidence;
- missing route-required physical input not yet capturable through API
  or workbench;
- candidate would copy lab values into field/building outputs;
- candidate would alias ISO impact to ASTM IIC/AIIC;
- candidate would reopen an already-landed owner without increasing
  scope, accuracy, input capture, or boundary protection.

The stop record should name the first unblocker as the next actionable
support slice.

## Critical Remaining Workstreams

### 1. Fresh Rerank

The immediate next action remains the fresh current-state rerank. It
must compare runtime-first candidates after the advanced-wall checkpoint
and select either:

- one high-ROI runtime owner; or
- an explicit no-safe-runtime reason with the exact missing evidence or
  implementation blocker.

This rerank must not move runtime values, import source rows, retune
formulas, or touch frontend files. Its value is preventing stale route
selection.

### 2. Formula Coverage

DynEcho still needs more vertical runtime owners for arbitrary
user-entered stacks. The important families are:

- user-material wall and floor assemblies;
- floor impact routes, including dynamic stiffness and load basis;
- ceilings and floor-ceiling assemblies as more than lower-treatment
  labels;
- facades, openings, windows, doors, and leakage/composite paths;
- roof and exterior assemblies;
- narrow building/flanking variants for common structural contexts.

The test for success is not "more route ids." A family is owned only
when it has:

- a physical route or exact measured-row identity rule;
- route-required inputs;
- correct output basis;
- `needs_input` for missing physical data;
- `unsupported` for adjacent metrics or contexts that are not owned;
- tests proving both the opened path and the blocked boundaries.

### 3. Frequency-First Backbone

The long-term calculator should be curve-first. A mature route should
prefer:

- compute or carry one-third-octave bands;
- derive `Rw`, `C`, `Ctr`, `STC`, `OITC`, `Ln,w`, `IIC`, or companion
  metrics through the correct rating adapter;
- expose the curve and rating provenance consistently through engine,
  API, workbench, saved replay, and report surfaces;
- keep scalar-only routes honest when no spectrum is owned.

Not every route should be forced into a spectral solver immediately.
The correct next move is to choose high-use families where curve
ownership unlocks many metrics and improves adapter correctness.

### 4. Calibration And Holdouts

Industrial trust needs admissible calibration and holdout evidence per
major route family. Source rows should be used as:

- exact rows only when construction identity and basis match;
- same-family anchors only when bounded by owned physics or admissible
  evidence;
- calibration or holdout cases for formula routes;
- negative examples that protect unsupported boundaries.

Every mature route family should eventually carry:

- small source-owned calibration set;
- separate holdout set;
- allowed tolerance by metric and family;
- basis and standard metadata;
- no-go cases that prove adjacent routes do not silently promote.

Do not tune against the same rows used as exact outputs. Do not use
source rows as a disguised catalog replacement for formula ownership.

### 5. User Input Model

The engine already returns `needs_input` in important cases. The next
maturity step is making every required input discoverable, structured,
and tied to the route that actually uses it.

High-value inputs include:

- surface mass, density, thickness, and known mass per area;
- leaf grouping and layer roles;
- cavity depth, absorber thickness, flow resistivity, and coverage;
- stud/joist spacing, support topology, bridge class, and connection
  type;
- dynamic stiffness and load basis for resilient/floating/impact
  routes;
- base slab or subfloor type;
- receiving-room volume, reverberation, partition area, and panel size;
- junction class, coupling length, flanking assumption, and opening or
  leakage context.

Input-surface work is calculator progress only when it unlocks an owned
route or turns vague missing context into precise `needs_input`.

### 6. Building And Flanking Prediction

The project has started this correctly, but the remaining work is long.
Building prediction needs:

- direct element curve or scalar on the correct basis;
- element area and room normalization;
- receiving-room volume and reverberation or equivalent absorption;
- junction and flanking path model;
- mounting/framing/support topology;
- opening and leakage context where relevant;
- strict separation of lab, field, building, and characteristic values.

The correct growth pattern is narrow vertical owners, for example one
wall family with one explicit junction/flanking context. A generic
building correction factor would move fast but undermine trust.

## Wrong Paths To Avoid

Avoid these unless the user explicitly asks for a separate non-
calculator task:

1. Broad source crawling framed as calculator progress.
2. Manufacturer acoustic ratings copied into runtime outputs without
   exact construction identity.
3. Lab-to-field or lab-to-building value copying.
4. Scalar metric expansion that bypasses available frequency curves.
5. Frequency solver runtime promotion without admissible holdout or
   conservative boundaries.
6. Same-family deltas without explicit bounded physics or evidence.
7. UI input polish that is not tied to a route-required physical input.
8. Claiming facade, window, door, roof, or ceiling coverage because
   a mode, enum, or partial schema exists.
9. ISO impact to ASTM IIC/AIIC aliasing.
10. Confidence labels that are not backed by route evidence, tolerance,
    or validation.

## Recommended Sequence

### P0: Land The Fresh Rerank

Implement the current selected rerank contract and compare the highest
ROI candidates using the current gate state. This should remain a
no-runtime support slice.

Expected counters:

- `runtimeValuesMoved: 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`;
- `candidateCount` and `roiAnalysisIterations` recorded;
- selected next owner or explicit no-safe-runtime reason recorded.

### P1 Option A: Frequency-First Owner For One High-Use Family

Candidate family:

- a high-use family that still lacks an owned runtime curve, or a
  global backbone consolidation that makes existing curve-derived
  metrics reusable across route families. The already-landed
  double-leaf/framed wall frequency-backbone numeric-sensitivity owner
  should not be repeated.

Target outputs:

- airborne route: `Rw`, `C`, `Ctr`, `STC`, possibly `OITC` if adapter
  and bands are owned;
- impact route: `Ln,w`, `DeltaLw`, `IIC` or ISO-only companions only
  when the standard and band basis are owned.

Route:

- owned frequency solver or source-carried one-third-octave curve;
- rating adapters derive single-number metrics;
- scalar fallback remains blocked for spectral companions unless the
  spectrum is owned.

Required inputs:

- construction-specific physical inputs for the selected family;
- material surface mass or density/thickness;
- cavity or absorber data where relevant;
- topology, support, bridge, or dynamic stiffness where relevant.

`needs_input` behavior:

- missing route-critical inputs name the exact missing physical fields;
- missing spectrum owner blocks companion metrics.

Unsupported boundaries:

- adjacent metric families not derived from the owned spectrum;
- field/building metrics unless an adapter is selected and context is
  complete;
- ISO/ASTM crossing without the proper adapter.

Expected movement:

- new calculable target outputs through companion derivation;
- runtime basis promotions where curve-derived metrics become owned;
- possible runtime values moved if current scalar estimates are
  replaced by curve-derived values;
- no source-row import unless a narrow calibration or holdout packet is
  part of the selected owner.

### P1 Option B: User-Material Floor Impact Runtime/Input Owner

Candidate family:

- user-entered floating or resilient floor stack with explicit base
  structure, resilient layer, finish/package, and optional lower
  ceiling/treatment. The already-landed dynamic-stiffness sub-owner
  should be treated as prior work; a new owner must expand beyond it.

Target outputs:

- `Ln,w`, `DeltaLw`, and ISO impact companions first;
- `IIC` or `AIIC` only when ASTM band and method requirements are
  explicitly owned.

Route:

- owned impact route using dynamic stiffness, load basis, base slab or
  floor structure, resilient layer role, and finish/top layer context;
- exact rows only for exact systems;
- field/building adapter only with explicit field/building context.

Required inputs:

- dynamic stiffness;
- load basis;
- resilient layer thickness and role;
- base floor/slab/subfloor type and mass or thickness;
- finish/topping/floating layer roles;
- receiving-room or field context for field/building requests.

`needs_input` behavior:

- missing dynamic stiffness or load basis blocks runtime calculation;
- missing base structure blocks impact prediction;
- missing field context blocks field/building output only, not lab
  output when lab route is complete.

Implementation note:

- dynamic stiffness for one custom visible heavy floating-floor stack is
  already runtime-owned. Treat remaining value as broader route-family
  depth, additional physical inputs, field/building impact adapters,
  ASTM IIC/AIIC runtime ownership, or calibration/holdout expansion.

Unsupported boundaries:

- ISO impact values must not become ASTM IIC/AIIC;
- lab impact must not become field AIIC without ASTM E1007-style
  context;
- adjacent airborne outputs remain blocked unless independently owned.

Expected movement:

- high user-value new calculable request shapes;
- required physical inputs captured;
- stronger arbitrary user-material posture.

### P1 Option C: Opening, Facade, Or Composite Transmission Owner

Candidate family:

- wall or facade with explicit opaque element, opening element, area
  ratio, and leakage/opening context.

Target outputs:

- `Rw`, `STC`, `OITC`, `Dn,w`, `Dn,A`, or facade/outdoor-to-indoor
  metrics only where basis is owned.

Route:

- composite transmission through area-weighted transmission coefficient
  or route-owned equivalent;
- opening/leakage path treated as its own physical component;
- field/building adapter only with room, area, and normalization
  context.

Required inputs:

- opaque element area and rating or curve;
- opening area and rating or curve;
- leakage/open path parameters where relevant;
- facade/exterior context for outdoor-to-indoor metrics;
- room normalization inputs for building metrics.

`needs_input` behavior:

- missing area ratio or opening acoustic data blocks composite output;
- missing facade or room context blocks facade/building metrics only.

Unsupported boundaries:

- do not treat a tiny opening as harmless without area/leakage math;
- do not copy opaque wall lab values into composite or facade outputs;
- do not infer door/window behavior from generic opening labels.

Expected movement:

- high market-value request shapes;
- fewer misleading wall-only answers for real user assemblies;
- possible foundation for facade/window/door expansion.

Implementation note:

- element-lab opening/leak composite `Rw` and `STC` behavior already has
  a runtime corridor. Future work should not repeat that corridor; it
  should add same-basis holdout evidence, facade/outdoor-to-indoor
  context, door/window-specific physical inputs, or bounded
  field/building adapters.

### P1 Option D: Narrow Building/Flanking Owner

Candidate family:

- one already-owned wall or floor element family plus one explicit
  junction/flanking context.

Target outputs:

- `R'w`, `Dn,w`, `DnT,w`, `Dn,A`, `DnT,A`, `L'n,w`, or `L'nT,w`
  depending on selected family and owned basis.

Route:

- direct element route plus explicit room normalization and selected
  flanking path assumptions;
- no generic building penalty.

Required inputs:

- source and receiving room dimensions or volume;
- reverberation time or absorption normalization;
- separating element area;
- junction class, coupling length, mounting/topology, and flanking path
  descriptors;
- opening/leakage context if present.

`needs_input` behavior:

- missing room, area, or junction context blocks building outputs;
- lab companions remain calculable when the lab route is complete.

Unsupported boundaries:

- no lab-to-building copying;
- no cross-family flanking extrapolation;
- no broad building predictor without validation.

Expected movement:

- smaller request-shape expansion than formula-family work;
- high trust improvement for field/building outputs.

### P1 Option E: Calibration/Holdout Packet For A Mature Route

Candidate family:

- a route with stable runtime behavior but weak tolerance story.

Target outputs:

- the route's existing owned metrics, not new speculative metrics.

Route:

- source-owned calibration rows separated from holdout rows;
- explicit same-family and same-basis metadata;
- negative cases for adjacent unsupported boundaries.

Required inputs:

- construction identity metadata;
- metric basis and standard;
- route-family tags;
- tolerance and error-budget policy.

`needs_input` behavior:

- missing construction identity or metric basis prevents exact or
  anchor use;
- formula route can still run with wider budget where safe.

Unsupported boundaries:

- no tuning to exact rows that are also used as holdouts;
- no cross-basis calibration;
- no source-row catalog import disguised as calibration.

Expected movement:

- possible runtime formula retune;
- narrower error budgets;
- stronger confidence in current route family.

## Vertical Owner Acceptance Checklist

Every future runtime owner selected from this analysis should include a
selection card before implementation:

- user construction or formula family;
- target outputs to open;
- measured-row, anchor, formula, adapter, or calibration route;
- required physical inputs;
- precise `needs_input` behavior for missing inputs;
- unsupported adjacent bases, aliases, families, and metrics;
- expected `newCalculableRequestShapes`;
- expected `newCalculableTargetOutputs`;
- expected `runtimeBasisPromotions`;
- expected `runtimeValuesMoved`;
- expected `requiredPhysicalInputsCaptured`;
- expected `runtimeFormulaRetunes`;
- expected `sourceRowsImported`;
- expected frontend files touched, if any.

The owner is successful only if tests prove both:

- the newly opened calculation behavior; and
- the boundaries that must remain blocked.

## Practical Decision Rule After The Fresh Rerank

If the rerank identifies a safe frequency-first owner, prefer it for
long-term industry-grade posture.

If the rerank identifies a safer user-material floor impact owner with
clear dynamic-stiffness/load-basis inputs, prefer it for immediate user
utility.

If both are blocked, choose a narrow calibration/holdout packet for an
already mature route rather than widening formula scope without
evidence.

Avoid another no-runtime coverage refresh unless the rerank shows that
coverage must be refreshed to protect a just-landed runtime behavior.
The next move after support work should normally be a vertical runtime,
accuracy, input-capture, or boundary owner.

## Research References

- INSUL public product page:
  `https://navcon.com/resources/software/insul/`
- CadnaB building acoustics overview:
  `https://www.datakustik.com/products/cadnab/cadnab-for-building-acoustics`
- CadnaB calculation features:
  `https://www.datakustik.com/products/cadnab/features/calculation`
- SONarchitect ISO 12354 method:
  `https://www.acousticware.com/sonarchitect/index.php/en/sonarchitect-iso/isoen12354/142-method`
- ISO 12354-1 overview:
  `https://www.iso.org/standard/92742.html`
- ISO 717-1 overview:
  `https://www.iso.org/standard/51968.html`
- ISO 717-2 overview:
  `https://www.iso.org/standard/51969.html`
- ISO 16283-1 overview:
  `https://www.iso.org/standard/55997.html`
- ISO 16283-2 overview:
  `https://www.iso.org/standard/59747.html`
- ASTM E90:
  `https://store.astm.org/e0090-09r16.html`
- ASTM E336:
  `https://store.astm.org/standards/e336`
- ASTM E492:
  `https://store.astm.org/e0492-09r16e01.html`
- ASTM E989:
  `https://store.astm.org/e0989-06r12.html`
- ASTM E1007:
  `https://store.astm.org/e1007-16.html`
