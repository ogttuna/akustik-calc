# Workbench V2 Route Input Validation And Needs-Input Fix Plan - 2026-06-24

User-requested support plan. This plan follows the verified bug hunt in
`WORKBENCH_V2_ROUTE_INPUT_VALIDATION_AND_NEEDS_INPUT_BUG_HUNT_2026-06-24.md`
and turns it into an implementation sequence. It is calculator-integrity
support: route-required inputs, basis-specific missing-input visibility,
result-shape validity, and user-facing error consistency. It is not a
formula retune, source-row import, route ownership change, or numeric
calculator slice.

## Scope

The plan covers these verified symptom families:

- `Panel width` can be highlighted while the paired `Panel height` is not.
- Raw engine/domain ids such as `toppingOrFloatingLayer` and
  `impactFieldContext` can appear as primary user-facing copy.
- Result validation failures such as `ratings.field.partitionAreaM2`
  can leak raw Zod issue JSON to the Workbench.
- Tiny positive physical values can round to `0` in field-rating
  metadata while the shared schema requires those metadata fields to
  remain positive when present.

The plan does not open new calculable outputs. A correct implementation
should move `runtimeValuesMoved 0`, preserve supported/unsupported
target-output semantics, and make existing `needs_input` states more
actionable without hiding them.

## Evidence Reviewed

Implementation points re-read for this plan:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
  - `ROUTE_INPUT_DEFAULT_FIELD_ALIASES`;
  - `getMissingInputTask`;
  - `buildRouteInputTaskElementIds`;
  - `buildEstimatePayload`;
  - `buildRouteInputEffectiveness`;
  - `parseEstimateError`;
  - estimate debounce/fetch state handling.
- `apps/web/app/api/impact-only/route.ts`
  - same generic `catch` / `error.message` pattern as `/api/estimate`.
- `apps/web/app/api/estimate/route.ts`
  - request schema validation;
  - generic `catch` returning `error.message`.
- `apps/web/lib/calculator-api-validation.ts`
  - structured calculator validation payload shape.
- `apps/web/features/workbench/report-assistant-result-card.tsx`
  - calculator preview task rendering uses label/detail;
  - result-envelope task rendering currently uses `task.code` and
    `task.message` directly.
- `packages/engine/src/curve-rating.ts`
  - field rating metadata is rounded before assignment.
- `packages/engine/src/company-internal-opening-leak-building-runtime-corridor.ts`
  - opening/leak field rating publishes rounded area metadata.
- `packages/shared/src/domain/rating.ts`
  - `FieldAirborneRatingSchema` positive optional metadata fields.
- `packages/engine/src/calculate-assembly.ts`
  - final `AssemblyCalculationSchema.parse(result)` result validation.

## Root-Cause Model

### Root 1. Split Missing-Input Presentation

The engine correctly returns domain ids and grouped physical-input ids.
Those ids are valid trace data, but several UI surfaces translate them
independently. Some surfaces use friendly labels; others fall back to raw
codes. This is why a point fix in `getMissingInputTask` cannot guarantee
that assistant result cards, proposal/apply summaries, legacy shell
tasks, and candidate previews will stay consistent.

Required fix shape: shared presentation resolver used by all Workbench
task surfaces.

Do not fix this by renaming engine ids. Engine ids are useful domain
contracts and must remain available in trace/dev detail.

### Root 2. Mixed Identity Types For The Same Physical Requirement

The system mixes at least four identity layers:

- engine missing-input ids such as `partitionAreaM2`;
- request input ids such as `panelWidthMm` and `panelHeightMm`;
- UI element ids such as `rebuild-panel-width`;
- result validation paths such as `ratings.field.partitionAreaM2`.

These are not interchangeable. The physical requirement "partition
area" is derived from width and height, but a direct `panelWidthMm` error
can be either a true one-field absence or stale/non-normalized area
state. Over-broadly mapping every width id to both fields would create a
new inconsistency; failing to normalize area-family paths leaves the
current inconsistency.

Required fix shape: a value-aware route-input target resolver, not a
string-only mapper.

### Root 3. Stale Estimate Results Can Still Drive Input State

The active rebuild derives `estimateResult` from `estimateState.status ===
"ready"` and immediately derives `remoteTasks` from that result. The
fetch effect debounces for `220 ms`, and there is existing request
matching for verified-calculated capture, but not for the visible
route-input task state. During draft edits, a previous ready result can
therefore remain visible long enough to drive red fields for the wrong
request.

Required fix shape: visible remote tasks and output rows must be bound to
the request that produced them, or ignored while the draft no longer
matches the ready result.

### Root 4. Result Metadata Is Rounded Before Schema Validation

`FieldAirborneRatingSchema` requires optional metadata fields such as
`partitionAreaM2`, `absorptionAreaM2Sabine`, `receivingRoomRt60S`, and
`receivingRoomVolumeM3` to be positive when present. `curve-rating.ts`
checks raw values for positivity, then serializes rounded display values.
Any small positive raw value below the display precision can become `0`
and fail final `AssemblyCalculationSchema.parse(result)`.

Required fix shape: enforce a shared "positive metadata after rounding"
invariant at result-publisher boundaries.

Do not loosen the shared schema to accept `0`; that would make invalid
field-rating metadata look legitimate.

### Root 5. Result-Parse Errors Are Treated Like Generic Exceptions

`/api/estimate` uses structured validation payloads for request schema
errors, but its generic `catch` returns `error.message`. A Zod result
parse error's message is a JSON-like issue list, and the rebuild client
currently displays that top-level `error` string unchanged.

Required fix shape: normalize thrown result-validation errors into the
same user-safe calculator validation envelope family while keeping issue
details available for developer trace/tests.

### Root 6. Shared UI Helpers Can Create The Wrong Dependency Direction

`CONTEXT_INPUT_IDS` and `RequiredTask` are currently local to the rebuild
Workbench file. A shared presenter under `apps/web/features/workbench/`
should not import those rebuild-local DOM ids directly, because report
assistant surfaces do not need rebuild DOM ids and a direct import path
would make future extraction/circular dependencies more likely.

Required fix shape: shared helpers should return semantic target fields
or target intents. Rebuild-specific adapters should translate those
semantic targets into `CONTEXT_INPUT_IDS` / DOM element ids.

## Fix Classification

Broad fixes that should be centralized:

- missing-input presentation and task target resolution;
- area-family/result-path target normalization;
- stale ready-result suppression for visible task state;
- API/client error normalization for estimate and impact-only failures;
- positive field-rating metadata publishing invariant and tiny critical
  geometry validation.

Narrow fixes that should stay specific:

- `toppingOrFloatingLayer` copy and layer-stack action targeting;
- `impactFieldContext` grouped copy and visible impact-context targets;
- report-assistant result-card task rendering of envelope tasks;
- `curve-rating.ts` and opening/leak publisher metadata assignments.

Fixes that must not be done:

- do not default `panelHeightMm`, `partitionAreaM2`, `RT60`, field K,
  load basis, dynamic stiffness, or topping/floating layers;
- do not treat `30` entered in a millimetre field as metres;
- do not clamp tiny areas to `0.1 m2` or `7 m2` unless a separate
  formula owner explicitly owns that policy;
- do not copy lab values into field/building outputs to remove tasks;
- do not hide `needs_input` just because the text is awkward;
- do not publish live field/building outputs while omitting critical
  geometry metadata that was used to calculate those outputs;
- do not change output availability, formula routing, or numeric
  acoustic values as part of this support fix.

## Implementation Plan

### Step 0. Capture Or Fixture The Width-Only State

Before changing the red-field logic, add a focused fixture or temporary
debug assertion that records the failing state's:

- current request payload;
- `estimateState.status`;
- stored ready-result request;
- `remoteTasks`;
- normalized task ids;
- `routeInputTaskElementIds`;
- parsed context values for panel width and height.

This does not need to become a permanent user-visible feature. The goal
is to decide whether the observed width-only red came from direct
`panelWidthMm`, a non-normalized result path, stale ready result, or a
non-rebuild surface.

Exit criterion:

- the implementation agent can name the exact source of
  `rebuild-panel-width` for the failing state before changing behavior.

### Step 1. Add A Shared Required-Input Presenter

Create a shared Workbench presentation helper, for example under
`apps/web/features/workbench/`, that accepts a domain code/path and
returns UI-neutral presentation data:

- `label`;
- `detail`;
- `actionLabel`;
- one or more semantic `targetFields` / `targetIntents`;
- `severity`;
- raw `traceCode` for developer/debug display only.

Required first mappings:

- `toppingOrFloatingLayer`
  - label: `Upper topping / floating layer`;
  - action: classify or add the upper floor treatment;
  - target: layer stack / role controls, not a numeric context field.
- `impactFieldContext`
  - label: `Impact field context`;
  - detail: enter field K, impact receiving-room volume, CI/CI,50-2500,
    or the owned flanking context required by the route;
  - targets: visible impact context controls.
- `impactFieldContext.ciDb`;
- `impactFieldContext.ci50_2500Db`;
- `impactFieldContext.guideHdDb_or_receivingRoomVolumeM3`;
- `partitionAreaM2`;
- `ratings.field.partitionAreaM2`;
- `fieldContext.partitionAreaM2_or_panelWidthHeight`;
- direct `panelWidthMm` and `panelHeightMm`;
- `receivingRoomVolumeM3`;
- `receivingRoomRt60S`;
- `loadBasisKgM2`;
- `resilientLayerDynamicStiffnessMNm3`.

Adapter rule:

- rebuild maps semantic target fields to `CONTEXT_INPUT_IDS`;
- report assistant cards use label/detail/severity and keep `traceCode`
  only in trace/dev detail;
- legacy shell/proposal/candidate views should not import rebuild DOM ids
  just to render friendly text.

Adopt the helper in these surfaces:

- rebuild remote tasks;
- rebuild output-row needs-input details;
- Workbench V2 shell tasks if still user reachable;
- assistant calculator preview task conversion;
- report-assistant result-card envelope tasks;
- candidate/proposal/apply task summaries that currently print task
  codes or local task strings.

Safety rule:

- keep raw ids in trace/dev details, redacted trace events, or test-only
  assertions; do not use them as primary visible labels.

Expected tests:

- raw `toppingOrFloatingLayer` and `impactFieldContext` no longer appear
  in rendered user task labels;
- trace/debug data still contains the original codes;
- existing task counts and route statuses do not change.

### Step 2. Add Value-Aware Area Target Resolution

Replace string-only route-input target selection with a resolver that can
classify a route-input id/path as:

- `area_group`;
- `direct_width`;
- `direct_height`;
- `other_context`;
- `unknown_trace`.

Target behavior:

- `partitionAreaM2`, `ratings.field.partitionAreaM2`, and
  `fieldContext.partitionAreaM2_or_panelWidthHeight` are `area_group`
  and should target both width and height because the route requires
  derived area.
- A pair of simultaneous direct `panelWidthMm` and `panelHeightMm` tasks
  should also present as panel area.
- A single direct `panelWidthMm` task should target width only when the
  current draft has no positive width.
- A single direct `panelHeightMm` task should target height only when the
  current draft has no positive height.
- A direct dimension task that targets a field already present in the
  current request should not make that valid field look wrong. If the
  paired dimension is missing and the route is field/building airborne,
  present the issue as panel area; otherwise treat it as stale and rely
  on Step 3 freshness suppression.

This step must not silently calculate or store `partitionAreaM2` in the
client request. Width and height remain the user-entered source of truth.

Expected tests:

- grouped area task marks both panel fields;
- direct missing width with height present marks width only;
- direct missing height with width present marks height only;
- direct width task does not mark a positive current width red when the
  ready result request is stale;
- `buildRouteInputEffectiveness` reports the same target ids that the UI
  renders.

### Step 3. Bind Visible Remote Tasks To The Matching Request

Derive a `currentEstimateRequest` during render and compare it with
`estimateState.request` before using ready-result remote tasks, output
rows, response figures, and route-input highlights. Existing request
comparison code used for verified-calculated capture is the right local
pattern to inspect.

Preferred behavior:

- if the current draft no longer matches the ready result, suppress
  ready-result remote tasks and route-input highlights for that stale
  result;
- show loading/pending state during debounce/fetch, but do not keep old
  missing-input red borders tied to the previous request;
- do not discard local validation tasks, because those are derived from
  the current draft.

Why this is broad enough:

- it solves width-only stale highlight symptoms;
- it also prevents old unsupported/needs-input output details from being
  shown for a new draft.

Why this is still narrow:

- it does not alter request construction or engine calculation;
- it only controls whether a result is allowed to drive visible state for
  the current draft.

Expected tests:

- after editing panel width or height, old remote tasks no longer mark
  fields unless the ready result request still matches;
- local layer/material validation tasks still appear immediately;
- ready result output rows still appear when the request matches.

### Step 4. Normalize Estimate Error Payloads

Extend estimate error handling so result-validation exceptions do not
surface raw JSON strings.

Server-side behavior:

- detect Zod-like thrown errors with an `issues` array;
- preserve the issue list in the JSON payload;
- return a user-safe `error` string;
- return `nextField` guidance using the same path-to-field resolver used
  for request validation where practical;
- distinguish result validation from request validation in a non-breaking
  optional field if useful, for example `errorKind:
  "result_validation"`.

Apply the same normalization helper to `/api/impact-only` after the
estimate path. The screenshot class was observed through Workbench
estimate, but the sibling route has the same raw exception pattern and
would otherwise preserve the inconsistency.

Client-side behavior:

- keep `parseEstimateError` safe for old payloads;
- prefer structured `error` and `nextField` copy when present;
- never display raw Zod issue JSON as the primary Workbench error;
- map `ratings.field.partitionAreaM2` to panel-area guidance and both
  panel dimension targets.

Expected tests:

- a simulated thrown result-validation issue for
  `ratings.field.partitionAreaM2` returns friendly panel-area copy;
- malformed/generic thrown errors still return a generic estimate failure
  without leaking stack traces;
- existing request schema validation payloads remain compatible.
- impact-only generic thrown validation errors use the same safe envelope
  shape instead of raw exception text.

### Step 5. Enforce Positive Field-Rating Metadata At Publishers

Add a small engine-side helper for optional positive metadata, for
example:

- calculate formulas from raw physical values;
- round only for serialized/display metadata;
- classify metadata as critical or optional trace metadata;
- for optional trace metadata, assign the field only when the rounded
  value is still positive;
- for critical geometry metadata used to produce live field/building
  outputs, block the field/building output with structured validation or
  `needs_input` when the value would serialize as non-positive;
- optionally add an existing-style warning/trace when optional metadata
  is omitted because it rounds to zero.

Apply it to:

- `field.partitionAreaM2`;
- `field.receivingRoomVolumeM3`;
- `field.receivingRoomRt60S`;
- `field.absorptionAreaM2Sabine`;
- opening/leak field-rating area metadata.

Important boundary:

- this step should not retune formulas or clamp raw values used for
  calculations;
- introducing a broad practical minimum room/panel policy would be a
  separate calculator/input policy owner, but preventing schema-invalid
  critical geometry from producing live field/building outputs belongs to
  this hardening fix.

Expected tests:

- tiny positive panel area no longer serializes
  `ratings.field.partitionAreaM2: 0`;
- tiny critical panel area does not publish a live field/building output
  that depended on hidden/omitted area metadata;
- standard-sized room/panel examples keep their existing numeric outputs;
- schema validation still rejects any manually constructed
  `partitionAreaM2: 0`;
- opening/leak route metadata follows the same invariant.

### Step 6. Add Regression Coverage Across Surfaces

Focused coverage should be enough for implementation iteration:

- Workbench rebuild route-input target resolver tests;
- Workbench stale ready-result suppression test;
- report-assistant result-card rendering test for task label mapping;
- assistant preview task mapping test if it uses a separate conversion;
- API estimate error normalization test;
- API impact-only error normalization test for the same raw exception
  class;
- engine result-shape tests for tiny positive metadata;
- engine tiny critical geometry boundary test proving invalid metadata
  becomes user-safe validation/needs-input rather than a live value or raw
  Zod error;
- no-runtime assertion that selected outputs, route status, and known
  standard numeric values are unchanged.

Run the broad current gate only if implementation touches shared schemas
or runtime result publishers enough to warrant it. At minimum, run
targeted web and engine tests plus `git diff --check`.

## Plan Revalidation Iterations - 2026-06-24

These extra iterations were added after the first fix plan draft to
reduce the chance that the implementation fixes one screenshot while
creating a new consistency problem.

### Iteration 1. Presenter Ownership And Import Direction

Finding:

- `CONTEXT_INPUT_IDS` and the rebuild `RequiredTask` shape are local to
  `calculator-workbench.tsx`.
- report assistant files already import some rebuild types, but importing
  rebuild DOM ids into every assistant/task surface would spread a
  page-specific implementation detail.

Plan adjustment:

- the shared presenter should return semantic target fields/intents, not
  rebuild DOM ids;
- rebuild should adapt semantic targets to `CONTEXT_INPUT_IDS`;
- report/candidate/proposal surfaces should use label/detail/severity and
  preserve the raw code only as trace data.

Why this matters:

- it keeps the broad fix broad at the domain/presentation layer, while
  keeping DOM focus behavior narrow to the surface that owns those DOM
  ids.

### Iteration 2. Report Envelope Schema Stability

Finding:

- `ReportAssistantResultTask` currently stores only `code`, `message`,
  and `severity`.
- persisted/saved assistant envelopes may already contain those fields.

Plan adjustment:

- do not require a report-envelope schema migration just to fix visible
  copy;
- map `code` and `message` through the shared presenter at render time;
- adding optional label/detail fields can be considered later, but the
  first fix should be backward compatible with existing envelopes.

Why this matters:

- it removes raw codes from the UI without invalidating saved assistant
  results or provider-returned envelopes.

### Iteration 3. Estimate And Impact-Only Error Symmetry

Finding:

- `/api/estimate` and `/api/impact-only` both use structured request
  validation but return raw `error.message` from generic catches.

Plan adjustment:

- implement the result-validation normalizer as a shared helper;
- land it first on `/api/estimate` for the observed Workbench issue;
- apply it to `/api/impact-only` in the same support slice or an
  immediately adjacent follow-up to avoid preserving the same raw-error
  class in a sibling calculator route.

Why this matters:

- otherwise a user can still see raw Zod-like JSON through a nearby route
  after the visible Workbench estimate path is fixed.

### Iteration 4. Critical Geometry Cannot Be Silently Omitted

Finding:

- omitting `partitionAreaM2` after it rounds to zero would satisfy the
  schema but could still leave a live field/building output calculated
  from an unusably tiny area.

Plan adjustment:

- distinguish optional trace metadata from critical geometry metadata;
- optional trace metadata may be omitted with trace/warning when it
  rounds to non-positive;
- critical geometry used by live field/building outputs must produce
  structured validation or `needs_input` when it cannot be serialized
  validly.

Why this matters:

- the system becomes safer than the current raw-error state without
  converting unrealistic tiny geometry into silent live numeric outputs.

### Iteration 5. Request Comparator Naming

Finding:

- the existing stable request comparator is exported as
  `estimateRequestsEqualForVerifiedCalculatedCapture`, even though the
  stale-result fix needs the same concept for visible route-input state.

Plan adjustment:

- either extract a generic `estimateRequestsEqual` helper and keep the
  old export as a compatibility wrapper, or create a clearly named local
  wrapper before using it for stale visual state;
- do not make new route-input behavior appear semantically owned by
  verified-calculated anchor capture.

Why this matters:

- the implementation remains understandable for later agents and avoids
  coupling unrelated Workbench features by name.

### Iteration 6. Direct Width/Height Must Stay Narrow

Finding:

- grouped area paths should mark both dimensions, but true direct
  `panelWidthMm` or `panelHeightMm` requirements can be legitimate.

Plan adjustment:

- area-family ids and result paths map to both dimensions;
- true direct width/height ids map to the missing direct field only;
- if a direct width/height id targets a field already present in the
  current request, treat that as stale/non-normalized state and rely on
  freshness suppression or area resolver diagnostics.

Why this matters:

- the fix does not train users to distrust valid entered dimensions.

## Implementation Flow Comparison - 2026-06-24

This pass compares each plan step against the current implementation
flow. The purpose is to prevent a fix that only removes the screenshots
while moving the inconsistency into another Workbench surface.

### Step 0. Capture Or Fixture The Width-Only State

Current implementation flow:

- `buildEstimatePayload` sends only positive numeric context values. With
  `panelWidthMm = 30` and blank `panelHeightMm`, the request can contain
  width but no height.
- remote tasks are built from `estimateState.result` when
  `estimateState.status === "ready"`.
- visible route-input highlights are derived from those remote tasks via
  `buildRouteInputTaskElementIds`.
- verified-calculated capture already compares the current request with
  the stored ready-result request, but the visible remote task/output-row
  state does not use that freshness check.

Plan fit:

- Step 0 is necessary before code changes because the current red width
  can come from more than one source: a direct `panelWidthMm` task, an
  area-family task, a result-validation path, or a stale ready result.
- The current implementation gives us enough instrumentation points to
  identify the source without changing engine behavior.

Risk if skipped:

- an implementation could globally map width to height or suppress width
  errors, hiding a legitimate direct width requirement.
- an implementation could miss the stale-ready-result class and leave old
  remote tasks driving current input borders.

Implementation guard:

- record the ready-result request and current draft request together with
  `remoteTasks` and `routeInputTaskElementIds`;
- do not treat the screenshot as proof that `panelWidthMm` itself is
  wrong until that source is named.

Confidence: high.

### Step 1. Shared Required-Input Presenter

Current implementation flow:

- rebuild Workbench has its own `getMissingInputTask` and local
  `RequiredTask` shape.
- legacy Workbench V2 shell has a separate `getMissingInputCopy`.
- report-assistant result cards render envelope tasks with
  `task.code` as the visible strong label.
- assistant preview conversion and wall-candidate comparison convert
  route tasks into result-envelope `code` / `message` pairs, so raw codes
  can reappear even when the original preview task had friendly copy.

Plan fit:

- Step 1 is correctly broad at the presentation/domain boundary. A single
  helper should translate engine ids and result paths into friendly
  label/detail/severity while preserving raw trace codes.
- The helper must return semantic targets, not rebuild DOM ids. Rebuild
  can adapt semantic targets to `CONTEXT_INPUT_IDS`; report and candidate
  surfaces should not import rebuild element ids just to render copy.

Risk if implemented too narrowly:

- fixing only `getMissingInputTask` leaves `getMissingInputCopy` and
  report-assistant result envelopes able to show raw ids.
- changing persisted/envelope task schema as the first move risks
  invalidating saved assistant results when a render-time presenter would
  be enough.

Implementation guard:

- update rendered UI tests that currently expect raw task codes in HTML;
- keep trace/redacted-eval task-code fields raw where they are diagnostic
  data, not primary visible copy;
- add comments at the adapter boundary explaining that shared presenter
  output is UI-neutral and rebuild owns DOM focus ids.

Confidence: high.

### Step 2. Value-Aware Area Target Resolution

Current implementation flow:

- `getMissingInputTask("partitionAreaM2")` targets panel width as the
  primary focus field.
- `buildRouteInputTaskElementIds` then special-cases normalized task ids
  containing `partitionaream2` and adds both panel width and panel height.
- direct `panelWidthMm` and `panelHeightMm` tasks still target only their
  corresponding field.
- result-validation paths such as `ratings.field.partitionAreaM2` are not
  the same identity layer as request field ids or DOM element ids.
- `buildRouteInputEffectiveness` consumes the same target-element set as
  the red-border logic, so a wrong target set also affects badges and
  status copy.

Plan fit:

- Step 2 is the right fix because it treats area-family requirements,
  direct dimension requirements, and result paths as different identity
  classes.
- The current special-case already proves grouped area should mark both
  fields, but it is string-only and cannot decide whether a direct width
  task is legitimate or stale relative to the current draft values.

Risk if implemented too broadly:

- mapping every `panelWidthMm` occurrence to both fields would make a
  valid positive width look bad whenever only height is missing.
- mapping only `partitionAreaM2` and ignoring
  `ratings.field.partitionAreaM2` would leave the raw-error screenshot
  class without a targetable fix.

Implementation guard:

- resolver input must include the current parsed context values and, when
  available, the ready-result request that produced the task;
- `area_group` maps to both width and height;
- true direct width/height maps only to the missing direct field;
- direct dimension tasks against already-present current values should be
  treated as stale/non-normalized and covered by Step 3.

Confidence: high for the resolver shape; medium until Step 0 confirms the
exact screenshot source.

### Step 3. Bind Visible Remote Tasks To Matching Requests

Current implementation flow:

- render derives `estimateResult` from any ready result.
- `outputRows`, response figures, `remoteTasks`,
  `routeInputTaskElementIds`, and route-input effectiveness are then
  derived from that result.
- current-request comparison exists for verified-calculated capture, and
  a second use appears near verified-calculated save/applicability logic,
  but visible task state is not gated by the same freshness concept.
- the fetch effect debounces before replacing state, so stale ready data
  can remain on screen after a user edits the draft.

Plan fit:

- Step 3 is necessary even if Step 2 fixes target mapping, because a
  perfectly mapped old result should not color the current draft.
- The change should be a render-state guard: an old ready result can
  remain in state, but it must not drive current visible tasks/output rows
  unless its stored request matches the current draft request.

Risk if implemented incompletely:

- suppressing only red borders but leaving stale output rows or response
  figures visible still allows old calculations to look current.
- leaving verified-calculated save/applicability on the old result can
  expose a save action for a value that no longer matches the draft.

Implementation guard:

- derive an `activeEstimateResult` or equivalent from
  `estimateState.status === "ready"` plus request equality;
- use that active result consistently for output rows, remote tasks,
  route-input highlights, response figures, and any save/apply affordance
  that depends on the calculated result;
- preserve local validation tasks because those are based on the current
  draft, not a stale server result;
- extract or wrap the existing request comparator with a neutral name so
  later agents do not think route-input freshness is owned by
  verified-calculated capture.

Confidence: high.

### Step 4. Normalize Estimate Error Payloads

Current implementation flow:

- `/api/estimate` and `/api/impact-only` both use structured request
  validation payloads.
- both routes still return raw `error.message` from generic catch blocks.
- `calculateAssembly` performs final `AssemblyCalculationSchema.parse`;
  a thrown schema issue can therefore reach the API catch as a Zod-like
  result-validation error.
- client `parseEstimateError` displays the top-level `error` string as
  Workbench error copy.

Plan fit:

- Step 4 should live at the API/helper boundary, not only in the client,
  because the server currently decides whether raw issue JSON becomes the
  public response.
- Applying the same helper to impact-only is justified by identical catch
  behavior, even though the screenshot came through estimate.

Risk if implemented only client-side:

- other API consumers and sibling Workbench routes can still receive raw
  Zod issue text.
- client parsing of stringified issue JSON would be brittle and would
  duplicate server-side validation knowledge.

Implementation guard:

- preserve existing request-validation response compatibility;
- add a non-breaking discriminator such as `errorKind` only if useful;
- map `ratings.field.partitionAreaM2` through the same presenter/target
  resolver so the friendly error and highlighted fields agree;
- generic unexpected exceptions should remain user-safe and must not
  expose stack traces.

Confidence: high.

### Step 5. Positive Field-Rating Metadata And Critical Tiny Geometry

Current implementation flow:

- `FieldAirborneRatingSchema` allows metadata fields only when they are
  positive.
- `curve-rating.ts` checks raw physical values for positivity, calculates
  field/building companions, then serializes rounded metadata such as
  `partitionAreaM2`.
- opening/leak building runtime also serializes rounded partition-area
  metadata.
- tiny positive raw values can therefore pass the calculation precheck but
  serialize as `0`, causing final result parsing to throw.

Plan fit:

- Step 5 is correctly placed at publisher boundaries: formulas should
  keep using raw physical values, while serialized metadata must respect
  the shared schema.
- The plan's critical/optional split is essential. Optional trace
  metadata can be omitted when it rounds to non-positive, but critical
  geometry used for a live field/building value cannot simply disappear.

Risk if implemented as a simple omit:

- the schema error disappears, but the user may still receive a live
  field/building output calculated from an unusably tiny hidden area.
- that would be a worse consistency bug than the raw error because the
  calculator would look successful while withholding critical context.

Implementation guard:

- no formula retune and no raw-value clamp;
- no schema loosening to accept `0`;
- no hidden minimum area policy unless a separate calculator owner opens
  that physical policy;
- standard-sized examples must keep the same numeric outputs;
- tiny critical geometry should become structured validation or
  `needs_input`, not a live output with omitted critical metadata.

Confidence: high for the invariant; medium on final UX shape until the
implementation owner decides whether the tiny critical case is surfaced
as API validation, `needs_input`, or unsupported-boundary copy.

### Step 6. Regression Coverage Across Surfaces

Current implementation flow:

- existing report-assistant result-card tests assert raw task codes in
  rendered HTML.
- calculator API validation tests already cover request-validation
  payloads but not thrown result-validation normalization.
- engine tests cover many calculator routes, but tiny rounded-positive
  metadata needs focused publisher coverage.
- route-input effectiveness and UI highlighting share target-element
  resolution, so one resolver test can protect both only if it exercises
  the shared target set.

Plan fit:

- Step 6 must include tests that intentionally change current bad
  expectations. In particular, rendered task labels should stop exposing
  raw codes while trace/eval code lists remain raw.
- A no-runtime assertion is needed because this support fix must not open
  outputs, change route status, or move numeric values for normal inputs.

Risk if coverage is too local:

- a rebuild-only test can pass while report-assistant cards still show raw
  ids.
- an API-only error test can pass while engine publishers still emit
  schema-invalid rounded metadata.
- an engine-only metadata test can pass while the Workbench still shows
  raw JSON for any future result-validation exception.

Implementation guard:

- update tests by surface: rebuild resolver/freshness, legacy shell if
  reachable, report-assistant render, API estimate/impact-only, and engine
  publisher metadata;
- run targeted suites first, then the broad current gate only if the
  implementation touches shared schemas or runtime publishers enough to
  justify it.

Confidence: high.

### Cross-Step Conclusion

The plan remains valid after comparison with the current implementation,
with these tightened constraints:

1. The shared presenter must be UI-neutral and must not import rebuild DOM
   ids.
2. Area target resolution and stale-result suppression are separate fixes;
   neither one fully replaces the other.
3. Visible calculated state must be derived from a request-matching active
   result, not merely from any ready result.
4. Raw task codes should stay available for trace/eval data, but rendered
   user labels must be presenter-owned.
5. Result-validation normalization belongs on the API side first, with
   client fallback safety kept for old payloads.
6. Tiny positive critical geometry must not be turned into a silent live
   field/building result by omitting invalid metadata.

This means the fixes are technically small and localized, but not one
single-line change. The safe path is a sequence of narrow adapters and
focused tests that keep calculator numeric behavior unchanged.

## Implementation Execution Log - 2026-06-24

This section is the live implementation ledger for the bugfix. Keep it
updated before and after each code step so parallel agents can see which
surface is being changed and why.

### Execution Step A. UI-Neutral Presenter And Target Resolver

Status: implemented.

Code surfaces touched:

- `apps/web/features/workbench/route-input-presentation.ts`;
- `apps/web/features/workbench/route-input-presentation.test.ts`;
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`;
- `apps/web/features/workbench-v2/workbench-v2-shell.tsx`;
- `apps/web/features/workbench/report-assistant-result-card.tsx`;
- `apps/web/features/workbench/report-assistant-result-card.test.ts`.

Implemented behavior:

- added a shared UI-neutral presenter that maps route-input ids/result
  paths to friendly label/detail/severity and semantic targets;
- rebuild Workbench now adapts semantic targets to local
  `CONTEXT_INPUT_IDS`;
- legacy Workbench V2 shell uses the same presenter for remote tasks;
- report-assistant result cards keep envelope `task.code` as trace data
  but render friendly task labels/details.

Reason:

- current copy/target logic is duplicated and some surfaces expose raw
  engine ids as primary UI labels;
- the resolver must understand area-family result paths such as
  `ratings.field.partitionAreaM2` without making direct width/height
  inputs over-broad.

Required code comments:

- added a short agent coordination comment at the shared helper explaining
  that raw ids remain trace data and semantic targets are adapted per UI
  surface;
- added short adapter comments where rebuild/legacy maps semantic targets to DOM
  ids, because those ids are intentionally not imported by the shared
  helper.

Tests:

- `pnpm --dir apps/web exec vitest run features/workbench/route-input-presentation.test.ts features/workbench/report-assistant-result-card.test.ts --maxWorkers=1`
  passed: 2 files / 10 tests.
- presenter maps `toppingOrFloatingLayer`, `impactFieldContext`, nested
  impact receiving-room context, direct
  panel dimensions, and area-family result paths to friendly labels;
- area-family targets include both panel dimensions;
- direct width/height targets remain narrow;
- report-assistant rendered HTML no longer exposes raw task ids as the
  primary visible label while trace/eval task codes remain untouched.

Regression risks to watch:

- task counts and route statuses must not change;
- saved/envelope assistant result shape must stay backward compatible;
- focus behavior must still work in rebuild because DOM ids are adapted
  locally.

### Execution Step B. Stale Ready-Result Suppression

Status: implemented.

Code surfaces touched:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`;
- `apps/web/features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts`.

Implemented behavior:

- extracted generic `estimateRequestsEqual` while keeping
  `estimateRequestsEqualForVerifiedCalculatedCapture` as a compatibility
  wrapper;
- added `getActiveEstimateResultForCurrentRequest`;
- rebuild Workbench render-state derivation around `estimateResult`,
  `outputRows`, `remoteTasks`, route-input highlights, response figures,
  curve-missing warnings, report opening, and verified-reference save now
  uses a request-matching active result.

Reason:

- current visible route-input state can be driven by any ready result
  while the debounced current draft no longer matches that result.

Tests:

- `pnpm --dir apps/web exec vitest run features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench/route-input-presentation.test.ts features/workbench/report-assistant-result-card.test.ts --maxWorkers=1`
  passed: 3 files / 15 tests.
- stale ready result does not return an active result for current visible
  Workbench state;
- local validation tasks still appear without waiting for a server result;
- matching ready result still renders output rows and route-input tasks.

Regression risks to watch:

- do not hide current local blockers;
- do not remove valid output rows when the ready result request still
  matches the current draft;
- do not leave verified-calculated save/apply controls tied to stale
  output values.

### Execution Step C. API Result-Validation Error Normalization

Status: implemented.

Code surfaces touched:

- `apps/web/lib/calculator-api-validation.ts`;
- `apps/web/lib/calculator-api-validation.test.ts`;
- `/api/estimate`;
- `/api/impact-only`.

Implemented behavior:

- added `buildCalculatorExceptionErrorPayload`;
- request-validation payloads keep the existing structured contract with
  optional `errorKind: "request_validation"`;
- Zod-like thrown result-validation issues now return
  `errorKind: "result_validation"`, friendly `error` copy, structured
  `issues`, and `nextField` guidance;
- generic estimate/impact-only exceptions now return safe fallback copy
  and do not expose raw exception messages.

Reason:

- request validation is structured, but result parse exceptions are
  currently returned as raw exception text.

Tests:

- `pnpm --dir apps/web exec vitest run lib/calculator-api-validation.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench/route-input-presentation.test.ts features/workbench/report-assistant-result-card.test.ts --maxWorkers=1`
  passed: 4 files / 22 tests.
- simulated Zod-like result error for `ratings.field.partitionAreaM2`
  returns friendly panel-area guidance and structured issues;
- generic exceptions remain user-safe and do not leak stacks;
- existing request-validation payload tests stay compatible;
- impact-only uses the same safe envelope for the same exception class.

Regression risks to watch:

- do not swallow developer issue paths;
- do not change valid estimate response shape;
- do not turn request validation into a different payload contract.

### Execution Step D. Engine Positive Metadata Boundary

Status: implemented.

Code surfaces touched:

- `packages/engine/src/curve-rating.ts`;
- `packages/engine/src/company-internal-opening-leak-building-runtime-corridor.ts`;
- `packages/engine/src/field-rating-positive-metadata-boundary.test.ts`.

Implemented behavior:

- curve-rating now computes formulas from raw positive geometry but only
  serializes metadata that remains positive after display rounding;
- generic Dn / DnT field outputs are parked with `geometryMissing` when
  critical area or room-volume metadata would serialize as zero;
- opening/leak field/building runtime returns the existing blocked
  `missingPhysicalInputs: ["partitionAreaM2"]` shape instead of
  promoting live field/building outputs with zero serialized area.

Reason:

- positive raw physical values can round to serialized `0`, violating the
  shared result schema.

Tests:

- `pnpm --dir packages/engine exec vitest run src/field-rating-positive-metadata-boundary.test.ts --maxWorkers=1`
  passed: 1 file / 4 tests.
- `pnpm --dir packages/engine exec vitest run src/field-rating-positive-metadata-boundary.test.ts src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts src/airborne-masonry-regression.test.ts --maxWorkers=1`
  passed: 3 files / 13 tests.
- tiny positive optional/critical metadata no longer serializes invalid
  zero;
- tiny critical area does not publish a live field/building output with
  hidden invalid geometry;
- standard-sized examples keep numeric outputs unchanged;
- manually constructed schema values with `partitionAreaM2: 0` remain
  rejected.

Regression risks to watch:

- no formula retune;
- no raw-value clamp;
- no schema loosening;
- no hidden minimum-area policy.

### Final Validation - 2026-06-24

Status: targeted validation complete for the changed surfaces and their
nearest regression risks.

Passed:

- `pnpm --dir apps/web exec vitest run lib/calculator-api-validation.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-v2/workbench-v2-route-input-presentation.test.ts features/workbench/route-input-presentation.test.ts features/workbench/report-assistant-result-card.test.ts --maxWorkers=1`
  - 6 files / 53 tests passed.
- `pnpm --dir apps/web typecheck`
  - passed; Next route types generated successfully.
- `pnpm --dir packages/engine exec vitest run src/field-rating-positive-metadata-boundary.test.ts src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts src/airborne-masonry-regression.test.ts --maxWorkers=1`
  - 3 files / 13 tests passed.
- `git diff --check`
  - passed.

Historical note from the first implementation pass:

- `pnpm --dir packages/engine typecheck`
  - failed in existing/other-agent test files:
    `calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`,
    `post-v1-runtime-first-route-family-rerank-after-current-gate-stale-metric-basis-reconciliation-contract.test.ts`,
    `post-v1-wall-british-gypsum-exact-lab-needs-input-boundary-fix-contract.test.ts`,
    and
    `post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts`.
  - none of those files were touched by this bugfix.

### Extra Test Gap Closeout - 2026-06-24

Status: implemented and validated.

Reason:

- the first targeted test pass covered the shared presenter, report-card
  rendering, API error normalization, stale-result helper, and engine
  metadata boundary;
- two affected adapter surfaces still need direct tests before this
  bugfix can be called sufficiently covered:
  - rebuild `buildRouteInputTaskElementIds` should be tested with actual
    remote tasks so area-family ids highlight both panel dimensions while
    direct width/height ids stay narrow;
  - legacy Workbench V2 `getMissingInputCopy` should be tested directly so
    the old shell cannot regress to raw `toppingOrFloatingLayer` /
    `impactFieldContext` copy.

Closeout implementation:

- exported rebuild `getMissingInputTask` and
  `buildRouteInputTaskElementIds` so target-set behavior is directly
  covered by tests;
- exported legacy `getMissingInputCopy` so the old shell copy adapter is
  directly covered by tests;
- added rebuild route-input target-set tests for
  `ratings.field.partitionAreaM2`, `panelWidthMm`, `panelHeightMm`, and
  `impactFieldContext`;
- added legacy shell copy tests for `toppingOrFloatingLayer`,
  `impactFieldContext`, and `ratings.field.partitionAreaM2`;
- reran the web targeted set plus engine positive-metadata regression set.

Closeout tests:

- `pnpm --dir apps/web exec vitest run features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-v2/workbench-v2-route-input-presentation.test.ts --maxWorkers=1`
  - 2 files / 31 tests passed.
- `pnpm --dir apps/web exec vitest run lib/calculator-api-validation.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-v2/workbench-v2-route-input-presentation.test.ts features/workbench/route-input-presentation.test.ts features/workbench/report-assistant-result-card.test.ts --maxWorkers=1`
  - 6 files / 53 tests passed.
- `pnpm --dir apps/web typecheck`
  - passed; Next route types generated successfully.
- `pnpm --dir packages/engine exec vitest run src/field-rating-positive-metadata-boundary.test.ts src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts src/airborne-masonry-regression.test.ts --maxWorkers=1`
  - 3 files / 13 tests passed.

### Additional Test Expansion - 2026-06-24

Status: implemented and validated after broader impact review.

Reason:

- the closeout tests prove the newly exported adapters behave directly,
  but the changed surfaces can still regress through adjacent variants:
  report-assistant task rendering can receive raw engine ids directly,
  API routes can bypass helper-level tests if catch wiring is wrong, and
  engine metadata can fail through room-volume / RT60 / building
  opening-leak variants that are not covered by the first area-only test.

Risk model for expansion:

- UI rendering risk:
  - `ReportAssistantResultEnvelope.tasks` may contain raw
    `toppingOrFloatingLayer`, `impactFieldContext`, or
    `ratings.field.partitionAreaM2` codes directly, not only assistant
    layer-stack prefixed codes.
  - Test should assert rendered HTML uses friendly labels/details and does
    not contain those raw codes.
- API route catch risk:
  - helper-level normalization can pass while `/api/estimate` or
    `/api/impact-only` catch blocks still return raw `error.message`.
  - Test should mock the engine runtime to throw a Zod-like issues object
    and prove route responses contain safe `error`, structured `issues`,
    and no raw JSON primary message.
- Engine metadata risk:
  - panel area is not the only rounded-positive metadata field;
    receiving-room volume and RT60 can also round to zero.
  - Test should cover tiny volume and tiny RT60 variants without loosening
    schemas or publishing hidden critical geometry.
- Opening/leak variant risk:
  - the first opening/leak test covers field context; building prediction
    has extra output-basis branches and must also stay blocked for tiny
    serialized area.

Planned expansion tests:

- extended report-assistant result-card render tests for direct raw
  `toppingOrFloatingLayer`, `impactFieldContext`, and
  `ratings.field.partitionAreaM2` tasks;
- added route-level mocked exception tests for `/api/estimate` and
  `/api/impact-only`;
- extended engine positive-metadata tests for tiny receiving-room volume,
  tiny RT60 metadata omission, and opening/leak building tiny-area block;
- reran the expanded web targeted set, web typecheck, engine targeted
  regression set, and `git diff --check`.

Expansion implementation details:

- `apps/web/features/workbench/report-assistant-result-card.tsx`
  now treats low-level validation text such as `Number must be greater
  than 0` as non-user-facing detail when a known route-input presenter
  mapping exists. This was found by the first expanded web test run:
  labels were friendly, but the partition-area detail still rendered the
  raw validation phrase.
- `apps/web/features/workbench/report-assistant-result-card.test.ts`
  now asserts direct raw task codes render as friendly labels/details and
  the HTML contains neither raw ids nor the raw numeric-validation text.
- `apps/web/lib/calculator-api-exception-routes.test.ts` now mocks
  `@dynecho/engine/runtime` at the route boundary and proves both public
  calculation routes return the safe result-validation envelope.
- `packages/engine/src/field-rating-positive-metadata-boundary.test.ts`
  now covers tiny receiving-room volume, tiny RT60 metadata, and
  `building_prediction` opening/leak tiny-area blocking in addition to
  the original field-area boundary.

Expansion validation:

- First expanded web run:
  - failed intentionally-useful coverage at
    `features/workbench/report-assistant-result-card.test.ts`;
  - diagnosis: report-assistant task detail could still use raw
    low-level validation text when the code was known but the message did
    not include the raw code;
  - fix landed in `getVisibleAssistantTaskCopy`.
- Final expanded web run:
  - `pnpm --dir apps/web exec vitest run lib/calculator-api-validation.test.ts lib/calculator-api-exception-routes.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-v2/workbench-v2-route-input-presentation.test.ts features/workbench/route-input-presentation.test.ts features/workbench/report-assistant-result-card.test.ts --maxWorkers=1`
  - 7 files / 56 tests passed.
- Final expanded engine run:
  - `pnpm --dir packages/engine exec vitest run src/field-rating-positive-metadata-boundary.test.ts src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts src/airborne-masonry-regression.test.ts --maxWorkers=1`
  - 3 files / 16 tests passed.
- Type/diff checks:
  - `pnpm --dir apps/web typecheck` passed;
  - `git diff --check` passed.

Expansion conclusion:

- The reported raw-code/awkward-copy issue is covered across shared
  presenter, rebuild, legacy shell, and report-assistant direct envelope
  rendering.
- The reported raw JSON/Zod-style error issue is covered both at helper
  level and through mocked public API routes.
- The `partitionAreaM2` zero-after-rounding root cause is covered by the
  original panel-area case plus receiving-room volume, RT60 metadata, and
  opening/leak field/building route variants.
- No tests in this expansion assert new acoustic values, new output
  availability, schema loosening, or formula retuning; the fix remains a
  presentation/error-boundary/metadata-publishing hardening change.

### Further Test Expansion - 2026-06-24

Status: implemented and validated.

Reason:

- the previous expansion covered the primary reported cases and direct
  route/API/engine variants, but more subtle regressions can still enter
  through formatting variants, fallback paths, and non-Zod runtime
  exceptions;
- this pass stays inside the same bugfix boundary and does not expand
  calculator scope or acoustic values.

Additional risk model:

- Presenter normalization risk:
  - route ids can arrive with prefixes, underscores, punctuation, or
    result-path style forms such as
    `fieldContext.partitionAreaM2_or_panelWidthHeight`;
  - area-family paths must still target both dimensions, while direct
    `panelWidthMm` / `panelHeightMm` must stay narrow;
  - unknown codes must remain readable and keep fallback detail instead
    of becoming blank or raw JSON.
- Workbench target aggregation risk:
  - multiple remote tasks can be present together and should merge target
    fields without dropping unrelated field/basis controls;
  - layer-stack intent tasks such as `toppingOrFloatingLayer` should not
    create bogus numeric context element ids.
- API route generic-exception risk:
  - result-validation errors are now normalized, but a plain runtime
    exception from either public route must also remain user-safe and not
    expose private stack/message text;
  - malformed issue arrays should fall back to generic-safe handling
    rather than pretending to be structured calculator guidance.
- Engine metadata risk:
  - `absorptionAreaM2Sabine` can also round below display precision;
  - no-field-context / missing geometry paths must continue returning
    schema-valid ratings without publishing fake field metadata;
  - the shared schema should still reject zero for every positive
    metadata field when manually constructed.

Planned additional tests:

- added presenter tests for prefixed/underscored area-family ids,
  `fieldContext.partitionAreaM2_or_panelWidthHeight`, and unknown-code
  fallback behavior;
- added rebuild target aggregation tests for mixed area + building +
  impact tasks and for layer-stack tasks producing no context DOM ids;
- added route-level tests for plain `Error` throws and malformed issue
  objects on both `/api/estimate` and `/api/impact-only`;
- added engine metadata tests for sub-precision absorption area omission,
  missing field context schema validity, and manual zero-schema rejection
  across all positive optional metadata fields;
- reran the expanded web targeted set, web typecheck, engine targeted
  regression set, and `git diff --check`.

Additional implementation details:

- `apps/web/features/workbench/route-input-presentation.test.ts`
  now verifies prefixed/underscored area-family ids normalize to
  `Panel area` with both panel dimensions, and unknown task codes remain
  readable with fallback detail.
- `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
  now verifies mixed remote tasks merge area, building, and impact
  targets, while `toppingOrFloatingLayer` does not create bogus numeric
  context highlights.
- `apps/web/lib/calculator-api-exception-routes.test.ts` now verifies
  plain runtime `Error` throws from both public calculator routes return
  safe fallback copy and no private exception text, and malformed
  issue-like objects fall back to `internal_error`.
- `packages/engine/src/field-rating-positive-metadata-boundary.test.ts`
  now verifies sub-precision absorption metadata is omitted without
  parking otherwise valid Dn/DnT geometry outputs, element-lab ratings do
  not publish field metadata, and all positive optional field metadata
  schema fields still reject manual zero values.

Additional validation:

- Narrow web expansion run:
  - `pnpm --dir apps/web exec vitest run lib/calculator-api-exception-routes.test.ts features/workbench/route-input-presentation.test.ts features/workbench-rebuild/route-input-effectiveness.test.ts --maxWorkers=1`
  - 3 files / 43 tests passed.
- Narrow engine expansion run:
  - first attempt failed in the new absorption metadata test because the
    test assumed `receivingRoomRt60S` would still be published when
    `absorptionAreaM2Sabine` is below display precision;
  - diagnosis: current publisher only serializes RT60 inside the
    available-absorption metadata branch. Changing that would be a
    separate metadata completeness behavior change, not required for the
    zero-after-rounding bug;
  - assert narrowed to the owned invariant: no invalid zero metadata is
    published, valid Dn/DnT outputs remain live, schema parse stays
    valid.
  - final narrow run:
    `pnpm --dir packages/engine exec vitest run src/field-rating-positive-metadata-boundary.test.ts --maxWorkers=1`
  - 1 file / 9 tests passed.
- Final combined web run:
  - `pnpm --dir apps/web exec vitest run lib/calculator-api-validation.test.ts lib/calculator-api-exception-routes.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-v2/workbench-v2-route-input-presentation.test.ts features/workbench/route-input-presentation.test.ts features/workbench/report-assistant-result-card.test.ts --maxWorkers=1`
  - 7 files / 63 tests passed.
- Final combined engine run:
  - `pnpm --dir packages/engine exec vitest run src/field-rating-positive-metadata-boundary.test.ts src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts src/airborne-masonry-regression.test.ts --maxWorkers=1`
  - 3 files / 18 tests passed.
- Type/diff checks:
  - `pnpm --dir apps/web typecheck` passed;
  - `git diff --check` passed.

### Third Test Expansion - 2026-06-24

Status: implemented and validated.

Reason:

- the previous expansions covered the core reported failures and nearby
  presentation/API/metadata variants;
- remaining risk is not in the primary fix path, but in adjacent
  consumers and public runtime entry points:
  - Workbench client error parsing can still render unsafe strings even
    when API routes return structured safe payloads;
  - direct route-input ids for building, impact, load, RT60, and dynamic
    stiffness need a table-style guard so future presenter edits do not
    drift;
  - non-panel result-validation paths should remain structured and safe,
    not accidentally mapped to panel-area guidance;
  - public `calculateAssembly` calls should prove the metadata hardening
    survives the full result assembly/schema parse path, not only
    `buildRatingsFromCurve`.

Third-pass tests:

- exported and tested `parseEstimateError` as a client-side boundary:
  structured `result_validation` payloads should produce the friendly
  `error`, and malformed/non-object payloads should fall back to
  `Estimate failed.`;
- extended presenter tests with a direct-field mapping table for
  `receivingRoomRt60S`, `receivingRoomVolumeM3`,
  `sourceRoomVolumeM3`, `buildingPredictionOutputBasis`,
  `flankingJunctionClass`, `conservativeFlankingAssumption`,
  `junctionCouplingLengthM`, `impactFieldContext.ciDb`,
  `impactFieldContext.ci50_2500Db`, `loadBasisKgM2`, and
  `resilientLayerDynamicStiffnessMNm3`;
- added route-level non-partition result-validation tests for both
  `/api/estimate` and `/api/impact-only`;
- added public `calculateAssembly` regression tests for tiny area and tiny
  receiving-room volume, proving unsupported Dn/DnT outputs are parked
  without result-schema exceptions and without publishing zero metadata;
- reran the enlarged targeted web set, web typecheck, targeted engine
  set, and `git diff --check`.

Third-pass implementation details:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
  exports `parseEstimateError` for focused client-boundary tests. This
  does not change runtime behavior; it makes the existing Workbench
  error-copy parser directly testable.
- `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
  now covers structured estimate error parsing and malformed payload
  fallback in addition to route-input target effectiveness.
- `apps/web/features/workbench/route-input-presentation.test.ts`
  now has a table guard for direct building/field/impact/load/dynamic
  stiffness route-input ids.
- `apps/web/lib/calculator-api-exception-routes.test.ts` now covers
  non-panel result-validation paths for both public routes and verifies
  they do not get incorrect `Panel area` guidance.
- `packages/engine/src/field-rating-positive-metadata-boundary.test.ts`
  now includes public `calculateAssembly` tiny-area and tiny-volume
  regressions, proving the final assembly result remains schema-valid and
  parks only the unsafe outputs.

Third-pass validation:

- Narrow web run:
  - `pnpm --dir apps/web exec vitest run lib/calculator-api-exception-routes.test.ts features/workbench/route-input-presentation.test.ts features/workbench-rebuild/route-input-effectiveness.test.ts --maxWorkers=1`
  - 3 files / 48 tests passed.
- Narrow engine run:
  - `pnpm --dir packages/engine exec vitest run src/field-rating-positive-metadata-boundary.test.ts --maxWorkers=1`
  - 1 file / 11 tests passed.
- Final combined web run:
  - `pnpm --dir apps/web exec vitest run lib/calculator-api-validation.test.ts lib/calculator-api-exception-routes.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-v2/workbench-v2-route-input-presentation.test.ts features/workbench/route-input-presentation.test.ts features/workbench/report-assistant-result-card.test.ts --maxWorkers=1`
  - 7 files / 68 tests passed.
- Final combined engine run:
  - `pnpm --dir packages/engine exec vitest run src/field-rating-positive-metadata-boundary.test.ts src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts src/airborne-masonry-regression.test.ts --maxWorkers=1`
  - 3 files / 20 tests passed.
- Type/diff checks:
  - `pnpm --dir apps/web typecheck` passed;
  - `git diff --check` passed.

## Ordering Recommendation

1. Capture/fixture width-only state.
2. Add shared presenter and area target resolver with tests, but keep
   raw trace codes available.
3. Extract or wrap a generic estimate-request comparator for stale visual
   state.
4. Bind ready-result visual state to matching current requests.
5. Normalize estimate API/client errors, then the same class in
   impact-only.
6. Harden engine metadata publishers and critical tiny-geometry
   boundaries.
7. Expand targeted tests to all affected surfaces.

This order keeps the UI consistency work separate from engine result
shape work. If Step 0 proves the live width-only state is purely stale
result state, Step 2 should still land because result validation paths
and grouped area ids need normalized targets anyway.

## Safety Checklist

Before marking the fix done, verify:

- no lab-to-field or lab-to-building alias was introduced;
- no missing physical input gained an implicit default;
- no selected output became supported only because a task was hidden;
- no shared schema was loosened to accept invalid metadata;
- raw task codes remain in trace/dev details but not primary UI labels;
- shared presenter code does not import rebuild DOM ids directly;
- current draft changes cannot show ready-result tasks from an old
  request;
- tiny positive metadata cannot round to schema-invalid zero;
- critical geometry that cannot be serialized validly cannot still drive
  a live field/building numeric output;
- standard-size calculator results are numerically unchanged.

## Progress Ledger

- calculator behavior opened: none;
- new calculable request shapes: 0;
- new calculable target outputs: 0;
- required inputs captured: 0;
- runtime/formula values moved: 0;
- source rows imported: 0;
- implementation files touched by this plan: 14;
- docs files touched by this plan: 3;
- support work done: Workbench route-input presentation centralized,
  value-aware semantic targets added, visible ready-result state bound to
  matching requests, estimate/impact-only exception payloads normalized,
  positive field-rating metadata publishers hardened, targeted regression
  coverage added, and the implementation plan kept synchronized with each
  step.
