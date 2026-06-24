# Workbench V2 Route Input Validation And Needs-Input Bug Hunt - 2026-06-24

User-requested analysis-only support handoff. This records Workbench V2
route-input consistency issues seen in the 2026-06-24 screenshots. No
runtime, formula, source-row, or numeric behavior moved.

Follow-up fix plan:
`WORKBENCH_V2_ROUTE_INPUT_VALIDATION_AND_NEEDS_INPUT_FIX_PLAN_2026-06-24.md`.
Use that plan for implementation ordering, broad-vs-narrow fix
boundaries, and regression coverage. Keep this file as the diagnosis and
verification record.

## Scope

The report covers these user-visible symptoms:

- Floor mode with mixed airborne and impact outputs selected shows
  `Panel width` highlighted while empty `Panel height` is not highlighted.
- The needs-input card shows raw route ids `toppingOrFloatingLayer` and
  `impactFieldContext` with a generic missing-input sentence.
- The error card can expose raw validation JSON for
  `ratings.field.partitionAreaM2` with `Number must be greater than 0`.

This is calculator-integrity support work because these fields control
route-required physical input capture and basis integrity. It is not a
new calculator slice and should not be treated as runtime progress.

## Current Evidence

`/workbench-v2` renders the rebuild workbench, not the legacy shell:
`apps/web/app/workbench-v2/page.tsx` mounts
`features/workbench-rebuild/calculator-workbench.tsx`.

Workbench rebuild uses `panelWidthMm` and `panelHeightMm` to construct
`airborneContext`; blank, zero, or non-positive values are omitted by
`parseOptionalPositiveNumber`. The route never receives a valid
partition area unless both dimensions are positive.

Relevant implementation points:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
  maps both panel fields to `partitionAreaM2` in
  `ROUTE_INPUT_DEFAULT_FIELD_ALIASES`.
- `getMissingInputTask` maps `partitionAreaM2` to a "Panel area" task,
  but its primary `targetElementId` is currently `panelWidthMm`.
- `buildRouteInputTaskElementIds` adds both `panelWidthMm` and
  `panelHeightMm` when the task id includes `partitionAreaM2`.
- `NumberField` renders red missing state from `isRouteInputMissing`.
- `/api/estimate` returns structured validation payloads through
  `buildCalculatorValidationErrorPayload`, but the Workbench client
  currently renders only the top-level `error` string.

Engine/shared evidence:

- `packages/engine/src/dynamic-calculator-route-input-topology.ts`
  records missing `partitionAreaM2` when either panel dimension is absent.
- `packages/engine/src/dynamic-calculator-floor-impact-field-context-contract.ts`
  includes `partitionAreaM2` and `impactFieldContext` in field-impact
  required context.
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb.ts`
  records `toppingOrFloatingLayer` as a real floor-impact physical input.
- `packages/shared/src/domain/rating.ts` requires
  `ratings.field.partitionAreaM2` to be a positive number when present.
- `packages/engine/src/calculate-assembly.ts` validates the final result
  with `AssemblyCalculationSchema.parse(result)`, so result-shape issues
  can throw after request validation has already succeeded.
- `packages/engine/src/curve-rating.ts` and
  `packages/engine/src/company-internal-opening-leak-building-runtime-corridor.ts`
  can publish rounded `partitionAreaM2` values into `ratings.field`.

Prior docs already noted the same class of issue:

- `docs/ui/DYNECHO_UI_REBUILD_PHASE_10_MODE_AND_TRUTHFULNESS_HARDENING_2026-06-05.md`
  called out raw ids such as `contextMode` and `partitionAreaM2` in the
  needs-input inspector.
- `docs/calculator/WORKBENCH_CALCULATOR_USABILITY_AND_INPUT_DEPENDENCY_BUG_HUNT_2026-06-22.md`
  recorded raw route-input copy leaks, including grouped
  `impactFieldContext`.

The 2026-06-24 screenshots therefore look like either a regression or a
coverage gap across Workbench V2 surfaces, not a new physics requirement.

## Second-Pass Diagnosis Plan

This pass treats the three screenshots as separate failures that happen
to meet at route-input presentation. They should not be fixed as one
generic "make errors nicer" pass.

### Issue A. Panel Width Red, Panel Height Blank

Observed state:

- floor mode;
- mixed airborne and impact outputs selected: `Rw`, `R'w`, `Ln,w`,
  `L'n,w`;
- airborne mode is `Building`;
- `Panel width` contains `30` and is red;
- `Panel height` is blank and is not red;
- `RT60`, `Load basis`, and `Dynamic stiffness` are red.

Diagnosis:

1. Showing airborne route inputs is expected. `R'w` is a
   field/building airborne output, and the floor output catalog permits
   mixed floor airborne and impact output sets.
2. Isolating only `Panel width` is not physically coherent when the
   missing requirement is partition area. `partitionAreaM2` is derived
   from the pair `panelWidthMm * panelHeightMm`; neither width nor height
   alone satisfies that route input.
3. Rebuild code already has partial intent to handle this correctly:
   `ROUTE_INPUT_DEFAULT_FIELD_ALIASES` maps both panel inputs to
   `partitionAreaM2`, and `buildRouteInputTaskElementIds` adds both
   panel fields when the remote task id includes `partitionAreaM2`.
4. Therefore the screenshot most likely came from one of these narrower
   paths:
   - the engine emitted `panelWidthMm` directly rather than the grouped
     `partitionAreaM2`;
   - the red state came from validation/error state, not from the normal
     `needs_input` task mapper;
   - another surface reused the same visual component but bypassed
     `buildRouteInputTaskElementIds`;
   - a previously selected output or stale estimate state left only the
     width task id in `routeInputTaskElementIds`.
5. There is also a unit/scale trap. `30` in this UI is millimetres, not
   metres. If height later becomes small as well, the physical area can
   be positive but round to `0.0 m2` at one decimal place. That does not
   make a valid field/building partition area.

Fix direction:

- Normalize every area-family field id to the same paired UI state:
  `partitionAreaM2`, `panelWidthMm`, `panelHeightMm`,
  `ratings.field.partitionAreaM2`, and
  `fieldContext.partitionAreaM2_or_panelWidthHeight` should focus or
  mark both panel dimensions unless a future explicit area control is
  introduced.
- Add client-side copy that says "Panel area from width and height" when
  the route is asking for area, instead of making width look uniquely
  wrong.
- Add a guard for physically unusable tiny panel area before it reaches
  a result-shape schema failure. The guard should explain the minimum
  practical area or ask for realistic dimensions; it must not invent an
  area default.

No-go:

- Do not treat `30` as metres.
- Do not auto-fill height.
- Do not silently clamp area to `0.1 m2` or `7 m2`; characteristic area
  floors belong only to routes that explicitly own them.

### Issue B. Raw `toppingOrFloatingLayer`

Diagnosis:

1. This is a real engine input id. The floating-floor impact topology
   records `toppingOrFloatingLayer` when the selected impact route needs
   an upper topping, floating screed, dry deck, finish package, or other
   route-owned upper treatment.
2. The user screenshot shows it as a raw id with generic missing-input
   text. That is a UI actionability failure, not proof that the engine
   should calculate without the input.
3. The rebuild main mapper has no dedicated
   `toppingOrFloatingLayer` branch, so it falls through to humanized raw
   copy. Assistant preview has the same gap.

Fix direction:

- Add a first-class Workbench missing-input presentation for
  `toppingOrFloatingLayer`:
  label `Upper topping / floating layer`;
  detail "Add or classify the upper floor treatment needed by the impact
  route";
  target the layer stack or role selector, not a numeric route input.
- If possible, show the missing role next to the layer stack and not only
  in the generic `Needs input` card.

No-go:

- Do not create an implicit topping/floating layer.
- Do not promote `Ln,w` or `DeltaLw` from a nearby source family just to
  remove the task.

### Issue C. Raw `impactFieldContext`

Diagnosis:

1. This is also a real engine boundary. Field impact outputs such as
   `L'n,w`, `L'nT,w`, and `L'nT,50` require field context before a lab
   impact anchor can be promoted.
2. `impactFieldContext` is a grouped requirement. Specific owner routes
   may accept K correction, direct/local flanking context, receiving-room
   volume, `CI`, or `CI,50-2500`.
3. The rebuild main mapper has a basic `impactFieldContext` branch, but
   other UI surfaces still have separate dictionaries. The report
   assistant result card renders `task.code` directly, and the legacy
   shell has a separate `getMissingInputCopy` fallback. This explains how
   a raw id can still leak even if one surface has been fixed.

Fix direction:

- Centralize one Workbench missing-input presenter and have rebuild,
  legacy shell, assistant preview, report assistant result cards, and
  proposal/apply task views call it.
- For grouped `impactFieldContext`, prefer the most specific missing
  sub-field when present. When only the group is present, point to the
  visible impact context controls and explain acceptable alternatives:
  K correction, impact room volume, CI/CI,50-2500, or owned flanking path
  inputs.

No-go:

- Do not assume `fieldKDb = 0`.
- Do not copy lab `Ln,w` into field `L'n,w`.
- Do not hide the grouped task if none of the acceptable context inputs
  is present.

### Issue D. Raw `ratings.field.partitionAreaM2` JSON Error

Diagnosis:

1. The error path is `ratings.field.partitionAreaM2`, not request input
   `airborneContext.panelWidthMm` or `airborneContext.panelHeightMm`.
   That points to final result validation, not initial request schema
   validation.
2. `/api/estimate` catches thrown errors and returns only
   `error.message`. The Workbench parser then displays that string
   directly. A thrown Zod result-parse issue can therefore become raw JSON
   in the UI.
3. A concrete numeric trigger exists. With millimetre inputs:
   `30 mm * 150 mm / 1_000_000 = 0.0045 m2`; rounded to one decimal this
   becomes `0.0`. Shared schema requires `ratings.field.partitionAreaM2`
   to be positive when present. The result can therefore fail schema
   validation even though the unrounded physical area was technically
   positive.
4. `curve-rating.ts` assigns `ksRound1(partitionAreaM2)` after checking
   the unrounded area is positive. The opening/leak corridor has a helper
   that returns `round1(area)` directly. Both are plausible publishers of
   a rounded zero.

Fix direction:

- Engine/result layer: never publish `ratings.field.partitionAreaM2` if
  the value that will be serialized is not positive. Prefer storing the
  physically exact area internally and only rounding for display, or make
  the route return `needs_input` / validation guidance for unusably tiny
  areas.
- API layer: distinguish request validation errors from result-shape
  `ZodError`s and return a structured calculator validation payload
  instead of raw `error.message`.
- UI layer: map `ratings.field.partitionAreaM2` to panel-area guidance
  and focus both panel dimensions.

No-go:

- Do not loosen the shared schema to allow `partitionAreaM2: 0`.
- Do not swallow result parse errors without surfacing a developer trace.
- Do not fix only the client string; the engine should stop emitting an
  invalid result shape.

### Cross-Cutting Root

The underlying consistency problem is split ownership of missing-input
presentation. At least these surfaces currently contain their own
mapping or fallback:

- rebuild workbench remote tasks;
- legacy Workbench V2 shell tasks;
- calculator assistant preview tasks;
- report assistant result cards;
- older simple workbench/report helpers.

Any one-off label fix will probably regress because engine ids are valid
domain ids and will continue to be returned by future formula owners.

## Additional Diagnostic Iterations

These iterations are meant to keep the next implementation agent from
fixing the visible symptom while leaving the deeper inconsistency alive.

### Iteration 3. Layer-By-Layer Failure Chains

Panel-area visual state:

1. The output selection legitimately opens both airborne and impact
   context because `R'w` and `L'n,w` are selected together.
2. Workbench request assembly accepts `30` as a positive
   `panelWidthMm` and omits blank `panelHeightMm`.
3. The physical route requirement is not "width"; it is derived
   partition area.
4. If the engine returns grouped `partitionAreaM2`, rebuild should mark
   both width and height through `buildRouteInputTaskElementIds`.
5. If only width is red, the task set probably contains a direct
   `panelWidthMm` id, a validation-path id that was not area-normalized,
   or stale route-input state from a previous estimate.

`toppingOrFloatingLayer` needs-input:

1. The engine is allowed to block floating-floor impact routes until an
   upper treatment is present.
2. The missing id is domain-correct and should remain in trace data.
3. The UI failure happens when the id is rendered as primary copy instead
   of being mapped to a layer-stack action.
4. The fix is presentation/action targeting, not a formula shortcut.

`impactFieldContext` needs-input:

1. The engine is allowed to block field impact promotion until field
   context exists.
2. The group id can be valid when no more specific sub-input has been
   selected by the owner route.
3. The UI should still translate the group into actionable choices:
   K correction, impact room volume, CI/CI,50-2500, or owned flanking
   path context.
4. Raw leakage can come from any surface that still renders `task.code`
   or has a local fallback mapper.

`ratings.field.partitionAreaM2` JSON error:

1. The request schema does not have a `ratings.field.partitionAreaM2`
   input path. That path belongs to the result object.
2. `calculateAssembly` validates the final object with
   `AssemblyCalculationSchema.parse(result)`.
3. `curve-rating.ts` checks the unrounded area is positive, then writes
   `ksRound1(partitionAreaM2)` into `ratings.field.partitionAreaM2`.
   Values below `0.05 m2` can therefore serialize as `0`.
4. The opening/leak building corridor computes `areaM2` with `round1`
   before writing it into the field rating, which has the same rounded
   zero risk.
5. `/api/estimate` catches thrown errors generically and returns only
   `error.message`; Workbench then displays that string.

### Iteration 4. Confidence And Discriminators

| Issue | Current confidence | What is already proven | What still needs discriminating before code |
| --- | --- | --- | --- |
| `Panel width` red while `Panel height` is blank | High that the state is incoherent; medium-high on possible sources | Active rebuild red state comes only from `routeInputTaskElementIds`; grouped `partitionAreaM2` would mark both panel fields; context changes can leave stale estimate tasks during debounce | Capture the active `remoteTasks`, `routeInputTaskElementIds`, `estimateState.status`, and whether the user had just edited width before the screenshot |
| Raw `toppingOrFloatingLayer` | High | Engine topology declares it as a real floating-floor physical input; rebuild/assistant mappers lack a dedicated branch | Identify whether the screenshot card is rebuild remote tasks, assistant preview, or report assistant task rendering |
| Raw `impactFieldContext` | High on split-surface/stale-envelope leak; medium on exact surface | Engine field-impact boundary is real; rebuild has one mapper branch; legacy/report/assistant surfaces have separate mappings or direct code rendering; exact generic sentence is absent from current source | Identify which card rendered the generic sentence and whether it came from current rebuild, saved assistant envelope, report-assistant task, or stale bundle |
| Raw `ratings.field.partitionAreaM2` JSON | High on result-parse/API leak and rounded-zero bug class; medium on exact publisher route | The path is result-side; shared schema requires positive; `curve-rating` is shared and can publish rounded zero; opening/leak can also publish rounded zero; API/client pass raw message through | Capture whether the thrown error is a ZodError from `AssemblyCalculationSchema.parse` and which runtime route populated `ratings.field` |

### Iteration 5. Per-Issue Fix Readiness

Ready to implement without more runtime research:

- shared missing-input presenter for known ids;
- `toppingOrFloatingLayer` copy and layer-stack action target;
- `impactFieldContext` group/sub-field copy;
- hiding raw task codes from primary report-assistant UI;
- client mapping for `ratings.field.partitionAreaM2` to panel-area copy.

Needs one short diagnostic capture before implementation:

- exact reason only `Panel width` is red in the screenshot state;
- whether the red state is coming from `needs_input`, validation error,
  assistant preview, report card, or stale estimate state.

Needs engine-side care:

- rounded-zero `partitionAreaM2` publishers. This must preserve internal
  physical precision for formulas and only change invalid serialized
  result shape or missing-input behavior.

### Iteration 6. Reduced Uncertainty On Panel Width

The active rebuild screen has only one red-border route-input path:

1. `remoteTasks = getRemoteTasks(estimateResult)`.
2. `routeInputTaskElementIds = buildRouteInputTaskElementIds(remoteTasks)`.
3. `isRouteInputMissing(inputId)` checks membership in that set.
4. `NumberField` receives `invalid={isRouteInputMissing(id)}`.
5. CSS applies the red border only through
   `.calc-field[data-missing="true"]`.

That rules out a purely CSS-driven or local "filled value is bad" state
for the screenshot. In active rebuild, `Panel width` being red means the
route-input target set contains `rebuild-panel-width`.

It also narrows the impossible path: if the remote task id contains
`partitionAreaM2`, `buildRouteInputTaskElementIds` adds both
`rebuild-panel-width` and `rebuild-panel-height`. Therefore grouped
`partitionAreaM2` alone cannot explain width-only red.

The remaining plausible width-only sources are now narrower:

- the remote task is a direct `panelWidthMm` / width-like id rather than
  grouped `partitionAreaM2`;
- a validation/result path was mapped only to width and not normalized
  as an area-family error;
- stale remote tasks from the previous estimate remain visible after the
  user typed `30`, because context changes do not immediately clear
  `estimateState`; the old `estimateResult` can drive red state until the
  debounced estimate transitions.

This changes the diagnostic priority. The next implementation should
first capture the exact `remoteTasks` and `routeInputTaskElementIds` for
the failing state. If the set contains only `rebuild-panel-width`, then
the fix is target normalization or stale-result clearing, not a generic
field validation tweak.

### Iteration 7. Reduced Uncertainty On Raw Needs-Input Cards

The exact sentence `Required physical input is missing.` does not exist
in the current source tree outside this bug-hunt context. Current active
rebuild remote tasks would use either a specific mapper detail or the
fallback sentence:

```text
The active formula route needs this physical input before it can
calculate the selected output.
```

The legacy shell fallback is also different:

```text
Enter the required physical input.
```

This means screenshot #2 is unlikely to be produced by the current
checked-in rebuild mapper exactly as-is. Remaining possibilities:

- stale browser bundle or stale saved UI state;
- report-assistant `result.tasks` where `message` is free text and
  `task.code` is rendered directly as the bold label;
- an assistant/provider result envelope persisted with raw task codes;
- a route surface not covered by the current static source scan.

The engine ids are still real. The uncertainty is only the exact UI
surface that rendered the generic sentence.

### Iteration 8. Reduced Uncertainty On `ratings.field.partitionAreaM2`

The exact route that produced screenshot #3 still needs a failing
payload/result capture, but the bug class is now clearer:

- `ratings.field.partitionAreaM2` is a result path.
- The final result is parsed by `AssemblyCalculationSchema`.
- `FieldAirborneRatingSchema` requires `partitionAreaM2` to be positive.
- `curve-rating.ts` is a shared adapter used by many airborne routes via
  `buildRatingsFromCurve(..., airborneContext)`.
- `curve-rating.ts` checks the unrounded area is positive, then serializes
  `ksRound1(partitionAreaM2)`. Any area below `0.05 m2` can become `0`.
- `company-internal-opening-leak-building-runtime-corridor.ts` has a
  separate `round1` area helper and writes that rounded value into
  `fieldRating.partitionAreaM2`.

So the exact publisher route is still unknown, but the fix should not be
route-local unless the capture proves only one route can emit the
invalid shape. The safer first fix is shared result-shape hardening:
do not serialize rounded-zero `partitionAreaM2` into `ratings.field`.

## Verification Pass - 2026-06-24

The user later asked to verify the diagnoses with targeted tests/probes
instead of leaving this as analysis only. This pass stayed narrow: no
broad current gate was run, no formula behavior was changed, and no
implementation files were edited.

Targeted checks run:

- `apps/web`: `pnpm exec vitest run
  features/workbench-rebuild/route-input-effectiveness.test.ts
  --maxWorkers=1` passed `25` tests.
- `apps/web`: a TSX probe imported `buildEstimatePayload` and
  `buildRouteInputEffectiveness` from the active rebuild Workbench.
- repo root: TSX probes imported `buildRatingsFromCurve`,
  `TL_PLOT_FREQS`, `FieldAirborneRatingSchema`, and
  `AssemblyCalculationSchema`.
- `apps/web`: `pnpm exec vitest run
  features/workbench/report-assistant-result-card.test.ts
  --maxWorkers=1` passed `4` tests.
- `apps/web`: a React server-render probe rendered
  `AssistantResultCard` with explicit `toppingOrFloatingLayer` and
  `impactFieldContext` tasks.
- `packages/engine`: `pnpm exec vitest run
  src/post-v1-floor-user-material-visible-floating-load-basis-coverage-refresh-contract.test.ts
  src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts
  --maxWorkers=1` passed `12` tests.

Confirmed results:

- Workbench request assembly accepts `panelWidthMm: 30` as a positive
  value and omits blank `panelHeightMm`. The screenshot is therefore not
  explained by local validation deciding that the typed `30` is invalid.
- The route-input effectiveness helper marks only `Panel width` when the
  task target set contains only `rebuild-panel-width`; the same helper
  marks both `Panel width` and `Panel height` when the set contains both
  area-pair targets. This proves width-only red is a target-set problem:
  direct width id, validation-path id, stale remote task, or another
  surface bypassing area normalization.
- `buildRatingsFromCurve` with a tiny positive panel area
  (`30 mm * 150 mm`) emits `ratings.field.partitionAreaM2: 0` after
  one-decimal rounding. `FieldAirborneRatingSchema.safeParse` rejects it
  with `too_small` on `partitionAreaM2`.
- Wrapping that same rating object in an assembly result reproduces the
  full schema issue path `ratings.field.partitionAreaM2`, matching the
  screenshot error path.
- A thrown `ZodError.message` is the JSON-like issue list. `/api/estimate`
  catches thrown errors and returns `error.message`; the rebuild client
  returns that `error` string unchanged from `parseEstimateError`. This
  confirms the raw JSON exposure chain.
- `AssistantResultCard` can render `toppingOrFloatingLayer` and
  `impactFieldContext` as bold task labels with the generic sentence
  `Required physical input is missing.` when an envelope supplies those
  task `code` and `message` values. The existing result-card test also
  preserves raw task code rendering. This reproduces screenshot #2 as a
  presentational leak shape.
- Engine floor-impact boundary tests passed for both the visible
  floating/topping layer requirement and field impact context boundary.
  The ids are real route-owned requirements, not random UI strings.

Remaining uncertainty after verification:

- Screenshot #1 still needs one live state capture to discriminate the
  exact source of the width-only target set: direct `panelWidthMm`, a
  non-normalized validation/result path, stale estimate state, or a
  non-rebuild surface.
- Screenshot #2 is reproducible through the report-assistant result-card
  shape, but the exact live surface that produced the user's card still
  needs capture because the current checked-in rebuild mapper does not
  contain that exact generic sentence.
- Screenshot #3's bug class is confirmed. The exact publisher route in
  the user's session still needs a failing payload/result capture, but
  shared hardening should cover `curve-rating.ts` and any sibling
  publisher that serializes rounded-zero `partitionAreaM2`.

## Refined Fix Order

1. Add a tiny diagnostic seam around Workbench estimate handling during
   implementation: record the missing input ids, normalized target ids,
   and estimate status for the failing state. This can be temporary test
   instrumentation or a focused unit fixture; it should not be a user
   visible feature.
2. Land shared missing-input presentation and replace direct raw-code
   rendering in the Workbench task surfaces.
3. Land area-family target normalization in the presenter/task target
   layer so grouped and direct area ids mark both panel dimensions.
4. Tie displayed remote tasks to the request that produced them, or clear
   stale remote tasks when the draft changes, so old width/height
   blockers cannot remain after the user edits a dimension.
5. Harden `/api/estimate` error normalization for thrown Zod result
   errors and map result paths to Workbench fields.
6. Patch the engine result publishers so rounded display values cannot
   violate `FieldAirborneRatingSchema`.
7. Add focused regression coverage after the fix. Do not run broad gates
   for this analysis-only note.

## Mapping Targets

The shared presenter should cover at least these route ids and result
paths before the bug is considered closed:

- route/missing input ids:
   `toppingOrFloatingLayer`, `impactFieldContext`,
   `impactFieldContext.ciDb`, `impactFieldContext.ci50_2500Db`,
   `impactFieldContext.guideHdDb_or_receivingRoomVolumeM3`,
   `partitionAreaM2`, `panelWidthMm`, `panelHeightMm`,
   `receivingRoomVolumeM3`, `receivingRoomRt60S`,
   `loadBasisKgM2`, and `resilientLayerDynamicStiffnessMNm3`.
- validation/result paths:
  `ratings.field.partitionAreaM2`,
  `airborneContext.panelWidthMm`,
  `airborneContext.panelHeightMm`, and any returned
  `fieldContext.partitionAreaM2_or_panelWidthHeight` trace.
- UI surfaces:
  rebuild remote tasks, legacy V2 shell tasks, assistant preview tasks,
  report assistant result-card tasks, draft validation tasks, and
  proposal/apply task summaries.

## Guardrails

- Do not change formula ownership, route selection, or numeric outputs.
- Do not alias lab impact values to field impact values.
- Do not copy lab airborne values into field/building outputs.
- Do not create silent defaults for partition area, RT60, K correction,
  dynamic stiffness, load basis, or topping/floating layers unless a
  separate runtime owner explicitly owns that default.
- Do not hide `needs_input`; make it more precise and actionable.
- Keep engine ids available in trace/dev details if needed, but do not
  make them primary user-facing labels.

## Suggested Validation Later

The verification pass above ran diagnosis-only targeted checks. When a
fix is implemented, the likely focused regression checks are:

- Workbench rebuild route-input effectiveness tests for paired
  `partitionAreaM2` highlighting.
- Workbench draft-change test proving old remote task targets are cleared
  or ignored after width/height changes until the matching estimate
  request returns.
- Workbench V2 shell/rebuild tests proving raw `toppingOrFloatingLayer`
  and `impactFieldContext` do not render in user task labels.
- API/client validation tests proving `ratings.field.partitionAreaM2`
  errors become friendly panel-area guidance.
- Engine result-shape tests proving tiny positive panel areas do not
  serialize `partitionAreaM2: 0` into `ratings.field`.
- A no-runtime assertion that selected outputs, route status, and numeric
  calculator results are unchanged.

## Progress Ledger

- calculator behavior opened: none;
- new calculable request shapes: 0;
- new calculable target outputs: 0;
- required inputs captured: 0;
- runtime/formula values moved: 0;
- source rows imported: 0;
- frontend implementation files touched: 0;
- docs files touched: 2;
- targeted verification run: `41` focused tests passed across `4` files,
  plus `5` TSX probes;
- broad current gate run: 0;
- support work done: Workbench V2 route-input validation and
  needs-input presentation bug analysis recorded and diagnosis-checked
  for follow-up.
