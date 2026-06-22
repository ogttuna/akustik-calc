# Project/User Evidence Anchor Plan - 2026-06-15

## User Intent

The user wants presets to remain lightweight starter layer combinations by
default, but also wants an explicit path for trusted project/user values to
become calculator evidence anchors.

Target product flow:

1. A user saves a layer combination as a preset.
2. The preset does not automatically affect engine source matching.
3. The calculator produces a live result package for the current stack.
4. If the user knows that result package is correct for their use case, they
   explicitly confirm it with an action such as
   `Save current result as verified reference`.
5. DynEcho stores the frozen stack snapshot, route context, live output values,
   calculation basis/provenance, and user confirmation as a scoped evidence
   anchor.
6. Separately, lab reports, manufacturer source values, and user measurements
   can also become scoped evidence anchors when their basis and source details
   are explicit.
7. Later, tightly controlled variants, such as a compatible exterior board
   added to the same wall family, can use an eligible evidence anchor plus a
   bounded calculated delta when the construction boundary is proven.

This is meant to increase calculator capability over time. It is not a broad
source crawl, not a formula retune, and not a path where every preset or every
raw calculator result silently becomes calculator truth.

## Why This Is High ROI

- Repeated project assemblies can return user-verified or source-backed values
  instead of re-running a generic formula estimate.
- User/project libraries become calculator evidence, not only convenience
  templates, when the user explicitly promotes a trusted value package.
- Exact source coverage grows organically where users have verified results,
  real measurements, or reviewed source references.
- Common evidence-backed systems can later be promoted from project/user scope
  into a verified global catalog after review and tests.
- Assistant/MCP flows can explain and reuse previous measured/source or
  user-verified project systems.
- The existing engine already has exact-source and compatible anchor-delta
  concepts, so the feature can extend a proven pattern instead of inventing a
  new calculation class.

The ROI depends on strict boundaries. If every preset or raw estimate becomes
a source row, the calculator can become noisy and misleading. If only
explicitly verified, scoped, canonicalized anchors are admitted, this becomes
a durable accuracy asset.

## Current Runtime Evidence

Read-only validation was run on 2026-06-15.

This section describes pre-existing engine exact-source and bounded-delta
behavior. It is not evidence that Workbench user-verified calculated anchors
already exist, and it must not be read as permission to route calculated
packages through measured/lab schemas.

Targeted existing tests:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-wall-compatible-anchor-delta-gate-d-contract.test.ts \
  src/post-v1-wall-compatible-anchor-delta-scope-expansion-contract.test.ts \
  src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-owner-contract.test.ts \
  --maxWorkers=1
```

Result:

- 3 test files passed.
- 11 tests passed.

Direct runtime smoke with `calculateAssembly`:

| Scenario | Runtime result | Basis / candidate |
| --- | ---: | --- |
| Exact verified Knauf LSF stack | `Rw 55` | `verified_airborne_catalog_exact_match`, `measured_exact_full_stack` |
| Same stack plus one exterior acoustic gypsum board | `Rw 57` | `exact_subassembly_source_plus_calculated_delta`, `measured_exact_subassembly_plus_calculated_delta` |
| Same stack plus exterior boards on both sides | `Rw 59`, `STC 59`, `C -1.1`, `Ctr -6` | `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime` |
| Unsafe board inserted inside the cavity | requested lab outputs unsupported / needs input boundary | `dynamic_calculator_route_input_contract_missing_physical_fields` |

Conclusion:

- A verified source-anchor plus bounded delta exists and works for a narrow
  built-in verified wall source family.
- It is not currently connected to Workbench V2 user presets or project/user
  measured/source rows or user-verified calculated records.
- The existing boundary behavior is good: an unsafe cavity insertion does not
  silently reuse the source anchor.

## Common Preset Seed Mismatch Evidence

Additional read-only smoke was run on 2026-06-15 against the current Workbench
V2 common preset seed records. This check loaded the seeded starter stacks,
mapped their visible layers/context into `calculateAssembly`, and compared the
calculator `Rw` result with each preset's public source reference value.

Result:

| Seed preset | Source reference | Current calculated result | Delta |
| --- | ---: | ---: | ---: |
| Knauf W112 double gypsum + mineral wool | `Rw 50` | `Rw 48` | `-2 dB` |
| Knauf W112 Diamant + mineral wool | `Rw 55` | `Rw 51` | `-4 dB` |
| Siniat CS70R-15dB-50G acoustic board + glass wool | `Rw 50` | `Rw 45` | `-5 dB` |
| British Gypsum A206A281 SoundBloc single-layer wall | `Rw 45` | `Rw 43` | `-2 dB` |

Interpretation:

- These seeded common presets are useful Workbench starter combinations, but
  the source `targetValue` metadata is not engine truth.
- The mismatches are expected because the seed snapshots use local generic
  materials such as `gypsum_board`, `acoustic_gypsum_board`,
  `diamond_board`, and `glasswool_board` to represent branded systems.
- The Siniat row is the strongest warning: mapping Siniat dB Board and the
  exact glass wool/stud system to generic catalog materials produced `Rw 45`
  against the source `Rw 50`.
- Therefore common preset source references must remain diagnostic/reference
  metadata until a separate evidence-anchor flow captures exact source or
  user-verified result evidence, canonical material identity, metric basis,
  tolerance/provenance, and conflict policy.
- This is exactly why the evidence-anchor feature must be explicit. A user
  clicking `Save preset` should not create an engine source row; only an
  explicit verified-reference flow may do that after validation.

## Current System Boundary

Workbench V2 common presets currently store source references as UI metadata.
The `targetValue` on a preset does not enter the estimate request as measured
source evidence.

The estimate request currently accepts:

- visible layers;
- target outputs;
- airborne context;
- floor impact context;
- impact exact source input;
- custom material catalog.

It does not yet accept a project/user user-verified calculated anchor list.
The existing measured-anchor lane is scalar `Rw` only and is not the corrected
target for new capture work.

The built-in compatible anchor-delta path is hard-bound to verified engine
source rows, for example `knauf_lab_416889_primary_2026`. The engine also has a
separate project/user measured-frequency exact/delta lane. Neither path is a
generic resolver over user-saved presets or user-verified calculated packages.

## Required Product Model

Presets, measured/source anchors, and user-verified calculated anchors must be
separate concepts.

Preset:

- reusable draft layer combination;
- can be edited freely;
- does not change calculator source precedence;
- can exist without measured values.

Measured/source evidence anchor:

- immutable or revisioned evidence record derived from a preset snapshot;
- includes measured metric values and basis;
- participates in exact source matching;
- scoped to project/user/global verification level;
- never created implicitly.

User-verified calculated anchor:

- immutable or revisioned evidence record derived from the current calculator
  result package;
- includes only finite live values, the route basis/provenance, and the frozen
  stack/context snapshot;
- stores the user assertion that this calculated package is trusted for their
  use case;
- participates in exact matching only after a dedicated runtime owner exists;
- scoped to project/user verification level;
- never created implicitly and does not claim to be a lab/source measurement.

Recommended scope enum:

- `project_evidence`: valid only inside one project workspace;
- `user_evidence`: valid for one user's personal library;
- `team_evidence`: valid for a team/org library if access rules exist;
- `verified_global`: reviewed built-in source row with repo tests.

## Evidence Anchor Data Shape

Minimum fields:

- `id`: stable source id, not the preset id;
- `scope`: `project_evidence | user_evidence | team_evidence | verified_global`;
- `status`: `draft | active | conflict | retired | promoted`;
- `name`;
- `description`;
- `sourceUrl` or attachment references when available;
- `createdFromPresetId`;
- `createdFromProjectId` when project scoped;
- canonical `snapshot` of layers, context, custom materials, and material
  visual overrides;
- `anchorKind`: `measured_source_result | user_verified_calculated_result`;
- `values`: finite metric values with metric id, basis, value, and per-value
  provenance;
- `measurementMethodStandard` and `ratingStandard` when the anchor is backed
  by a lab/manufacturer/user measurement;
- `resultBasisTrace` when the anchor is backed by a user-verified calculated
  result;
- `toleranceDb`;
- `confidencePolicy`: not a vague confidence label, but a route policy such as
  `exact_only` or `exact_plus_compatible_exterior_board_delta`;
- `fingerprint`;
- `canonicalizationVersion`;
- revision fields: `createdAt`, `updatedAt`, `createdBy`, `revision`.

Naming rule:

- use neutral evidence-record names such as `status`, `name`, and
  `description` for the generalized schema;
- keep existing `sourceStatus`, `sourceLabel`, and `sourceDescription` only
  inside existing measured/source schemas or migration adapters;
- do not give user-verified calculated anchors field names that imply lab or
  measured source provenance.

Field/building metrics must stay separate because `Rw`, `R'w`, `Dn,w`, and
`DnT,w` are not aliases. A user-verified calculated package may store several
live outputs, but runtime may only consume the outputs that a dedicated owner
has opened on the correct basis.

## Canonical Fingerprint Requirements

The exact matcher needs stable fingerprints, not raw UI object equality.

Fingerprint inputs:

- mode: wall/floor/etc.;
- metric basis;
- layer order;
- material ids;
- material physical properties for custom materials;
- thicknesses with deterministic rounding;
- role/topology groups;
- cavity depths;
- cavity fill/absorption;
- support topology;
- support spacing;
- lab/field/building context basis;
- selected measurement standard;
- schema/canonicalization version.

Fingerprint must exclude:

- display name changes;
- UI-only color overrides;
- non-calculation notes;
- row order in source-reference metadata.

Conflict policy:

- same fingerprint and same metric with same value can dedupe;
- same fingerprint and same metric with different value must not silently win;
- conflict should show a resolver UI: keep both inactive, pick project
  precedence, or retire one.

## Runtime Resolution Order

Recommended order for an estimate:

1. Built-in verified exact source catalog.
2. Active project measured/source anchors.
3. Active user/team measured/source anchors allowed in the current project.
4. Active project/user `user_verified_calculated_result` anchors when an
   exact-runtime owner exists for the requested metric/basis.
5. Compatible evidence-anchor delta if exact match fails but a strict reduced
   stack exact match exists.
6. Owned formula/physics route.
7. `needs_input` or `unsupported` when the route is not owned.

Built-in verified global rows should normally outrank local rows unless the UI
lets the user explicitly select a project override. Any override must be
visible in the result trace.

## Bounded Delta Eligibility

Do not let every evidence anchor power variants.

First eligible variant should be selected by a dedicated owner test, not by
this plan. The narrow shape expected for the first compatible-delta slice is:

- wall only;
- same metric and basis as the anchor route supports;
- same source family;
- same basis and standard;
- reduced stack exact match exists;
- added layer is an exterior board on one or both outside faces;
- added layer is a panel leaf / board with sane thickness and surface mass;
- cavity layout, support topology, and core leaf grouping remain unchanged;
- no new internal board/triple-leaf condition;
- no field/building metric aliasing.

Initial ineligible cases:

- board inserted inside the cavity;
- cavity depth changed without an owned route;
- insulation type or fill coverage changed without an owned route;
- support topology changed;
- unknown custom material physical properties;
- field/building outputs without owned adapters;
- `STC`, `C`, `Ctr` assumed from an unrelated scalar value;
- conflicting anchors for the same fingerprint.

## UI / UX Plan

Preset library should remain simple:

- `Save preset`;
- `Use preset`;
- optional details/description.

Evidence anchor actions should be deliberate:

- primary corrected action: `Save current result as verified reference`;
- no metric/value edit fields in the first corrected flow;
- only current live output rows are captured;
- validation preview shows the canonical stack, captured values, route basis,
  and missing route-critical fields;
- separate measured/source entry flow can exist later, but must stay distinct
  from user-verified calculated anchors.

Badges:

- `Preset only`;
- `Project measured`;
- `User measured`;
- `User verified calculated`;
- `Verified global`;
- `Inactive`;
- `Conflict`.

Result display:

- If exact measured/source anchor is used, show the source label and scope.
- If anchor-delta is used, show base measured value, delta, final value, and
  route assumptions.
- If anchor is rejected, show why in diagnostics without cluttering the main
  calculator flow.

Do not make project creation required for calculator use. Project-scoped
anchors need a project; user-scoped anchors can exist outside a project if
permissions and storage are ready.

## Assistant / MCP Requirements

Assistant visibility must include:

- projects;
- saved presets;
- evidence anchors;
- anchor revisions;
- exact match status;
- runtime source used in a report;
- anchor-delta assumptions and rejected reasons.

The assistant should never describe a preset as evidence unless an evidence
anchor exists. It should be able to answer:

- which project anchors exist;
- which reports used which evidence anchor;
- why an anchor did or did not match;
- whether a variant used bounded delta or a formula route.

## Current Product Decision - User-Verified Calculated Anchors - 2026-06-22

Agent coordination, 2026-06-22: this section records the corrected product
intent after reviewing the scalar `Rw` measured-anchor UI. If another agent
touches this flow, keep calculated-result confirmation separate from raw
calculator output and from measured/lab source evidence.

The target flow is not "the calculator produced a value, therefore it becomes
an anchor." Raw calculated values are not evidence by themselves. The target
flow is:

1. The calculator produces a live result package for the current stack.
2. The user knows enough about the project/product/system to assert that this
   package is correct for their use case.
3. The user explicitly clicks a confirmation action such as
   `Save current result as verified reference`.
4. DynEcho stores the current construction snapshot, route context, live
   result values, calculation basis/provenance, and user confirmation as a
   separate anchor record.
5. Runtime may later use that record as scoped evidence only through explicit
   owner tests and exact/bounded route policies.

Terminology:

- `raw_calculated_result`: ordinary calculator output. Never an anchor.
- `user_verified_calculated_result`: calculator output that the user has
  deliberately asserted as a reference. Eligible for scoped exact anchor use
  after schema/runtime support exists.
- `measured_source_result`: lab/manufacturer/user measurement evidence. This
  remains a stronger evidence class than user-verified calculated output.

Required safety rules:

- no automatic anchor creation from normal estimates;
- no value editing in the first product flow;
- save only finite `live` output rows, never `pending`, `needs_input`, or
  `unsupported` rows;
- store the whole current snapshot and context with the values so the anchor
  cannot drift when the draft stack later changes;
- preserve the route basis and calculation provenance that generated the
  values;
- keep source/measured provenance and user-verified-calculated provenance
  distinct in schemas, traces, reports, and assistant context;
- first runtime use is exact-only for the same construction fingerprint,
  metric, basis, and scope;
- compatible/minimal-change reuse is a later owner slice and must remain
  blocked unless the construction boundary and delta rule are explicitly
  owned;
- verified global/lab/source evidence must outrank user-verified calculated
  anchors when both match.

This is a sensible calculator feature because it lets a user promote their
domain knowledge into the evidence system without pretending that every
calculator result is a source row. It is risky only if implemented as silent
promotion, as editable scalar values, or by storing calculated values under a
measured/lab schema.

Recommended first data shape:

```ts
type UserVerifiedCalculatedAnchor = {
  anchorKind: "user_verified_calculated_result";
  confidencePolicy: "exact_only";
  createdFromPresetId?: string;
  fingerprint: string;
  id: string;
  requestChecksum: string;
  resultBasisTrace: unknown;
  scope: "project_evidence" | "user_evidence";
  snapshot: WorkbenchV2ProjectSnapshot;
  status: "draft" | "active" | "conflict" | "retired";
  values: Array<{
    metric: RequestedOutputId;
    metricBasis:
      | "element_lab"
      | "field_between_rooms"
      | "building_prediction"
      | "impact_lab"
      | "impact_field";
    valueDb: number;
  }>;
  revision: number;
};
```

The names above are illustrative. The real shared schema should use the
existing domain enums and should not overload
`ProjectUserMeasuredWallRwAnchor`.

First implementation scope lock:

- schema/storage may be mode-aware and store inert wall/floor live result
  packages for audit;
- the first runtime owner should still be wall airborne exact-only unless a
  separate floor/impact owner is explicitly selected;
- impact/floor outputs stored in an inert package must not become runtime
  values until a dedicated impact/floor resolver and basis tests exist.

## Implementation Comparison - 2026-06-22

Current implementation is not yet the corrected target.

| Area | Current implementation | Fit against corrected target |
| --- | --- | --- |
| Workbench create UI | The earlier scalar `Measured lab Rw` entry flow has been paused in `workbench-preset-library-panel.tsx`; the panel now shows `Reference capture paused` when no active reference exists. | Good as a stopgap. It prevents more scalar/manual `Rw` references while the model is corrected. |
| Existing active reference UI | Existing active `Rw` references can still be displayed and retired. | Acceptable for audit/cleanup. It does not create the new user-verified calculated package. |
| Parent Workbench handler | `calculator-workbench.tsx` still contains the latent `saveSelectedWorkbenchPresetMeasuredRwAnchor` handler that posts a scalar `valueDb`. | Not the target. It is currently unreachable from the paused panel but should not be reused for calculated-result anchors. |
| Anchor API/storage | `/api/workbench-v2/measured-wall-rw-anchors` and `workbench-v2-measured-wall-rw-anchor-storage.ts` persist owner-scoped scalar lab `Rw` anchors. | Not the target. They model one measured metric, not a confirmed result package with multiple live outputs and route provenance. |
| Shared schema | `ProjectUserMeasuredWallRwAnchor` is locked to `metric: "Rw"`. Frequency anchors model measured transmission-loss curves only. | Not the target. A new schema or generalized evidence schema is needed for `user_verified_calculated_result`. |
| Estimate route | `/api/estimate` auto-loads active owner-scoped measured wall `Rw` anchors and merges them into `airborneMeasuredSourceAnchors`. | Correct for existing scalar measured anchors, but the new calculated-result anchor must not be merged through this measured `Rw` lane. |
| Engine exact bridge | `project-user-measured-wall-rw-exact-bridge` can use exact scalar lab `Rw` only. Frequency measured anchors can support `Rw`, `STC`, `C`, and `Ctr` from a measured curve. | Not the target. A calculated-result exact bridge would need separate provenance, precedence, conflict, and output-basis tests. |
| Minimal-change/delta | Existing compatible delta is bounded for verified/source or measured-frequency routes, not for scalar Workbench `Rw` anchors. | Correctly blocked. User-verified calculated anchors should not open delta until a separate owner test proves the same-family boundary. |

Gap summary:

- no current implementation stores a multi-output user-verified calculated
  result package;
- no current implementation stores calculation-basis provenance with such a
  package;
- no runtime resolver consumes user-verified calculated anchors;
- the paused UI is therefore the correct temporary state;
- the next implementation should add storage/API/schema for the new anchor
  kind before adding any runtime effect.

Recommended next implementation order:

1. Add shared schema and storage for `user_verified_calculated_result` anchors
   without wiring them into `/api/estimate`.
2. Add a Workbench action that captures only current `live` output rows with no
   edit fields.
3. Store snapshot, context, selected outputs, output values, and route basis
   trace.
4. Add listing/retirement/audit UI for these anchors.
5. Add exact-only runtime resolver behind focused owner tests.
6. Add compatible/minimal-change reuse only as a later bounded-delta owner
   slice.

Current temporary implementation status:

- the scalar `Rw` create UI is paused and should stay paused until the
  user-verified calculated-anchor model has schema/storage support;
- existing scalar `Rw` anchors remain retireable/auditable so already-created
  references can be cleaned up without deleting history;
- no new runtime scope should be added through the scalar `Rw` lane.

## Implementation Re-Audit - 2026-06-22

This re-audit compares the corrected product model with the current code after
the scalar `Rw` create UI was paused.

Current implementation facts:

- `apps/web/features/workbench-rebuild/workbench-preset-library-panel.tsx`
  pauses the old scalar `Measured lab Rw` create controls behind
  `WORKBENCH_PRESET_MEASURED_RW_ANCHOR_CREATE_UI_ENABLED = false` and shows
  `Reference capture paused`.
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx` still
  contains the latent `saveSelectedWorkbenchPresetMeasuredRwAnchor` handler
  that posts `{ presetId, valueDb, toleranceDb }` to the measured `Rw` route.
  It is not the target capture path and must not be reused.
- `apps/web/app/api/workbench-v2/measured-wall-rw-anchors/*` and
  `apps/web/lib/workbench-v2-measured-wall-rw-anchor-storage.ts` persist
  owner-scoped scalar measured lab `Rw` anchors derived from preset snapshots.
  They do not store current result packages, multi-output values, or result
  basis traces.
- `packages/shared/src/api/estimate.ts` accepts only
  `airborneMeasuredSourceAnchors` and
  `airborneMeasuredFrequencySourceAnchors` for project/user airborne anchors.
  There is no `user_verified_calculated_result` request field.
- `packages/shared/src/domain/airborne-basis.ts` has measured/source exact
  basis labels such as `measured_exact_full_stack` and
  `airborne_measured_exact`, but no neutral user-verified-calculated exact
  origin/kind yet.
- `apps/web/app/api/estimate/route.ts` currently loads active owner-scoped
  scalar measured `Rw` anchors and merges them into
  `airborneMeasuredSourceAnchors`; this remains correct for the old measured
  lane only.
- `packages/engine/src/calculate-assembly.ts` currently calls the built-in
  verified catalog exact source path, built-in compatible source-delta path,
  project/user measured frequency exact/delta paths, and scalar measured `Rw`
  exact bridge. It has no user-verified calculated resolver.
- The conceptual precedence order in this plan is not identical to the current
  physical call order in `calculate-assembly.ts`: the built-in compatible
  source-delta result is currently built before the project/user measured
  frequency and scalar measured `Rw` bridges, and the bridges coordinate by
  `exactFullStackAlreadyApplied` / `compatibleAnchorDeltaAlreadyApplied`
  flags. Any new resolver insertion must be tested against this real call
  graph, not only against the conceptual list.
- `apps/web/features/workbench-rebuild/workbench-v2-project-snapshot.ts`
  currently carries a local `REQUESTED_OUTPUT_IDS` allow-list that is narrower
  than the shared `RequestedOutputSchema`. A verified-calculated capture flow
  must not rely on that local list for persisted selected outputs, or newer
  supported outputs such as field/building or impact metrics can be dropped
  from the frozen snapshot.
- The Workbench bug-hunt note
  `docs/calculator/WORKBENCH_CALCULATOR_USABILITY_AND_INPUT_DEPENDENCY_BUG_HUNT_2026-06-22.md`
  also records this boundary: bare/invalid measured-anchor rows are rejected,
  and user-verified calculated anchor lists are still not accepted.

Implications:

- The next implementation must start with a new schema/storage family, not an
  extension of `ProjectUserMeasuredWallRwAnchor`.
- The new storage must capture from the current estimate package, not from a
  preset snapshot and not from formatted UI text.
- The new route must remain inert for `/api/estimate` until exact-runtime owner
  tests exist.
- When runtime is later added, the resolver must be a separate exact-only
  resolver with separate provenance wording. It should be inserted only after
  verified global/source and measured/source precedence is preserved, and only
  after tests prove it does not get masked by or accidentally mask the existing
  compatible source-delta path.
- Runtime must add neutral user-verified-calculated provenance instead of
  reusing measured exact basis labels. Reusing `airborne_measured_exact` or
  `measured_exact_full_stack` would make reports and assistant explanations
  claim measurement evidence that does not exist.
- The capture path should use shared output schemas and structured result
  fields. It must not use a local snapshot parser allow-list as the source of
  truth for which selected outputs can be saved.
- Existing measured/frequency resolver files are useful patterns for
  fingerprinting, conflicts, and nonmatching fallback, but they are not the
  place to insert calculated packages directly.

Stale or misleading assumptions removed by this re-audit:

- "Measured anchor plus delta exists" does not mean Workbench calculated
  anchors exist. The current runtime delta evidence is limited to verified
  source catalog and measured-frequency lanes, not scalar Workbench `Rw` or
  user-verified calculated packages.
- "Project/user measurement support exists" does not mean user-verified
  calculated support exists. Current support is scalar measured `Rw` plus
  measured frequency curve anchors only.
- "The old scalar `Rw` route is reachable in code" does not make it the target
  UI path. The create UI is intentionally paused, while retirement/audit of
  existing scalar references remains allowed.
- "The Workbench snapshot stores selected outputs" does not guarantee every
  shared output survives parse/restore today; the verified-calculated capture
  flow needs its own shared-schema-backed selected-output validation.

## Implementation Phases

### Phase 1 - Schema/storage for user-verified calculated anchors

- Add a shared schema for `user_verified_calculated_result` anchors.
- Store frozen Workbench snapshot, route context, selected outputs, live output
  values, result basis trace, scope, status, and revision fields.
- Keep measured/source anchors as a separate schema family.
- Keep calculator runtime unchanged.
- Add schema, fingerprint, conflict, and storage tests.

### Phase 2 - Workbench capture UI/API

- Add `Save current result as verified reference`.
- Capture only current finite `live` output rows.
- Do not show metric/value edit fields.
- Reject `pending`, `needs_input`, and `unsupported` rows.
- List and retire captured anchors without passing them to estimates yet.

### Phase 3 - Assistant/report visibility

- Expose project/user verified anchors to assistant read tools.
- Store the anchor id/revision and result basis trace on reports that used one.
- Keep retired anchor revisions explainable.

### Phase 4 - Exact runtime resolver

- Add an exact-only runtime owner for `user_verified_calculated_result` anchors.
- Do not route these anchors through the scalar measured `Rw` lane.
- Prove precedence against verified global, measured/source, formula, and
  unsupported routes.
- Prove nonmatching fingerprints, basis mismatches, conflicts, retired anchors,
  and unsupported requested outputs stay blocked.

### Phase 5 - Compatible anchor-delta extension

- Only after exact runtime use is proven.
- Add a separate owner for the first compatible/minimal-change boundary.
- Keep scope narrow, for example compatible exterior board only when the
  reduced stack and metric basis are proven.
- Add negative tests for cavity inserted boards, topology changes, metric-basis
  mismatches, non-live metrics, and conflicting anchors.

### Phase 6 - Promotion workflow

- Promotion to verified global requires independent source evidence, canonical
  mapping review, tolerance policy, negative boundaries, and repo tests.
- User-verified calculated anchors are not globally promoted by themselves.

## Actionable Implementation Breakdown And Risk Controls - 2026-06-22

This is the implementation split after comparing the corrected product intent
with the current Workbench, API, shared-schema, and engine paths.

Current safe checkpoint:

- the old scalar `Measured lab Rw` creation UI is paused;
- existing scalar `Rw` references can still be listed and retired;
- `/api/estimate` still auto-loads only active owner-scoped scalar measured
  `Rw` anchors into `airborneMeasuredSourceAnchors`;
- no current runtime path consumes `user_verified_calculated_result` anchors.

Immediate non-runtime actions:

1. Keep the scalar `Rw` create UI paused.
2. Do not delete the old scalar storage/API until a migration or cleanup story
   exists, because existing anchors may need audit/retirement.
3. Add the new schema/storage/API separately from
   `ProjectUserMeasuredWallRwAnchor`,
   `/api/workbench-v2/measured-wall-rw-anchors`, and
   `airborneMeasuredSourceAnchors`.
4. If touching the same Workbench files while other agents are active, preserve
   or update the coordination comments that mark the old scalar lane as paused
   and non-target.

### Implementation Ledger - 2026-06-22

Every implementation step in this feature must update this ledger before and
after the code change so the slice can be reviewed or backed out without
guessing which files carried which risk.

| Step | Status | Files | Location | Why | Runtime risk |
| --- | --- | --- | --- | --- | --- |
| A1 shared schema | Done | `packages/shared/src/domain/project-user-verified-calculated-anchor.ts`, `packages/shared/src/domain/project-user-verified-calculated-anchor.test.ts`, `packages/shared/src/index.ts` | New shared domain module and root export | Created an inert `user_verified_calculated_result` data model, fingerprint helper, active-candidate validator, and focused tests. The schema rejects measured/source lane fields, duplicate values, unsupported saved values, metric/basis aliasing, and `verified_global` scope. Fingerprints use calculation-relevant request context and exclude UI snapshot/values. | None: `/api/estimate`, engine resolvers, and Workbench UI are not wired in this step. Validation passed with `pnpm --filter @dynecho/shared exec vitest run src/domain/project-user-verified-calculated-anchor.test.ts --maxWorkers=1` and `pnpm --filter @dynecho/shared typecheck`. |
| A2 storage repository | Done | `apps/web/lib/workbench-v2-verified-calculated-anchor-storage.ts`, `apps/web/lib/workbench-v2-verified-calculated-anchor-storage.test.ts` | New owner-scoped web storage library | Added JSON-file storage for inert verified-calculated anchor records with create/list/read/retire behavior, active duplicate fingerprint blocking, atomic writes, and storage tests. The repository has a coordination guard warning not to import it from `/api/estimate` or engine wiring before the exact-runtime owner exists. | None: no route, UI, `/api/estimate`, or engine resolver reads this repository in this step. Validation passed with `pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-verified-calculated-anchor-storage.test.ts --maxWorkers=1` and `pnpm --filter @dynecho/web typecheck`. |
| B1 storage API route | Done | `apps/web/app/api/workbench-v2/verified-calculated-anchors/route.ts`, `apps/web/app/api/workbench-v2/verified-calculated-anchors/[anchorId]/route.ts` | New Workbench V2 API namespace | Exposed list/create/retire for verified-calculated anchors through a route that validates structured payloads and calls only the new storage repository. Route comments state that this is storage-only and does not feed `/api/estimate` or engine runtime matching. | None: route is separate from measured `Rw` routes and is not loaded by `/api/estimate` or the engine. Validation passed with `pnpm --filter @dynecho/web typecheck`; storage behavior remains covered by `pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-verified-calculated-anchor-storage.test.ts --maxWorkers=1`. |
| B2 Workbench capture action | Done | `apps/web/features/workbench-rebuild/calculator-workbench.tsx`, `apps/web/features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts` | Current result review panel and focused capture helper tests | Added an explicit `Save reference` action in the output review panel. The handler stores only the current ready estimate's live supported output values, blocks stale saves when the current draft request differs from the request that produced the ready result, has no metric/value edit fields, and posts to `/api/workbench-v2/verified-calculated-anchors`. Code comments mark it as storage-only and separate from measured `Rw` anchors and `/api/estimate`. | None: the action writes storage only. `/api/estimate`, engine resolvers, measured `Rw` routes, and compatible-delta logic remain unchanged. Validation passed with `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts --maxWorkers=1`, the combined focused web storage/capture tests, `pnpm --filter @dynecho/web typecheck`, shared schema test, and shared typecheck. |
| B3 Workbench list/retire UI | Done | `apps/web/features/workbench-rebuild/workbench-v2-verified-calculated-anchors.ts`, `apps/web/features/workbench-rebuild/workbench-v2-verified-calculated-anchors.test.ts`, `apps/web/features/workbench-rebuild/calculator-workbench.tsx` | Separate verified-reference list under the current result review | Added a tested summary parser, loads verified-calculated anchor summaries from the new API, shows active saved references below output rows, and allows retirement through the new storage API. This remains visually and structurally separate from measured `Rw` preset references. | None: list/retire remains storage UI only and does not feed `/api/estimate` or engine matching. Focused validation passed with `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-verified-calculated-anchors.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts lib/workbench-v2-verified-calculated-anchor-storage.test.ts --maxWorkers=1`. A subsequent `pnpm --filter @dynecho/web typecheck` was blocked by an unrelated dirty engine file at `packages/engine/src/calculate-assembly.ts:2928` (`warning` implicit any), so this step did not edit or fix that file. |
| B4 storage API route behavior tests | Done | `apps/web/lib/workbench-v2-verified-calculated-anchor-routes.test.ts` | Focused route-level tests for the new Workbench V2 verified-calculated anchor API | Added route tests that create, list, reject duplicate active fingerprints, reject invalid payloads, and retire verified-calculated references through the new route handlers using an isolated temp store/auth mock. This documents the API contract before any future exact-runtime owner can consume the records. | None: this is test-only coverage for the storage API and does not import `/api/estimate`, engine resolvers, or measured `Rw` anchor runtime bridging. Validation passed with `pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-verified-calculated-anchor-routes.test.ts --maxWorkers=1`, the focused feature set `pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-verified-calculated-anchor-routes.test.ts features/workbench-rebuild/workbench-v2-verified-calculated-anchors.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts lib/workbench-v2-verified-calculated-anchor-storage.test.ts --maxWorkers=1`, `pnpm --filter @dynecho/web typecheck`, `git diff --check` on the touched slice, and an `rg` guard confirming no verified-calculated imports/names under `/api/estimate` or `packages/engine/src`. |
| B5 estimate request inertness guard | Done | `packages/shared/src/api/estimate.test.ts` | Shared estimate request schema tests | Added a focused guard proving `user_verified_calculated_result` records cannot be smuggled through measured/source estimate fields and that the public estimate request has no parsed verified-calculated runtime lane yet. This is intentionally a pre-runtime safety test before Action D. | None: test-only change in shared API schema coverage. It did not add estimate request fields or engine consumption. This file already had unrelated dirty edits for layer surface mass tests; those were preserved. Validation passed with `pnpm --filter @dynecho/shared exec vitest run src/api/estimate.test.ts --maxWorkers=1`, `pnpm --filter @dynecho/shared typecheck`, and `git diff --check` on the touched doc/shared test files. |
| C1 assistant project-read visibility | Done | `apps/web/lib/workbench-v2-verified-calculated-anchor-storage.ts`, `apps/web/features/workbench/report-assistant-project-read-contract.ts`, `apps/web/features/workbench/report-assistant-project-tools.ts`, `apps/web/app/api/report-assistant/project-read/route.ts`, `apps/web/features/workbench/report-assistant-project-read-result.ts`, `apps/web/features/workbench/report-assistant-project-read-route.test.ts` | Read-only assistant/audit visibility for verified-calculated references | Added a read-only `list_project_verified_calculated_references` project-read action that lists only references explicitly tied to the requested project id. The payload exposes anchor kind, scope, status, saved values, fingerprint, value metrics, and result basis trace as user-verified calculated references, not as measured/lab/source evidence. | None: read-only assistant visibility. It does not load these records into `/api/estimate`, engine resolvers, measured `Rw` bridges, or report runtime values. `report-assistant-project-tools.ts` already had unrelated dirty stale-summary sanitization; that was preserved. Validation passed with `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-project-read-route.test.ts --maxWorkers=1`, the focused 5-file web set, and `pnpm --filter @dynecho/web typecheck`. |
| D0 exact-runtime resolver analysis | Done | `docs/calculator/PROJECT_USER_MEASURED_SOURCE_ANCHOR_PLAN_2026-06-15.md` | Pre-runtime selection card and risk gate | Re-read `/api/estimate`, shared `EstimateRequestSchema`, shared `AirborneResultBasis`, `calculateAssembly`, `project-user-measured-wall-rw-exact-bridge.ts`, and measured frequency exact/delta bridges before moving runtime. Findings: no verified-calculated estimate input exists; `/api/estimate` loads only stored measured `Rw` anchors; `calculateAssembly` has no user-verified calculated option; `AirborneResultBasis` has measured exact origins/kinds but no neutral user-verified-calculated exact provenance; measured/source and compatible-delta paths already have precedence-sensitive candidate resolver hooks. | None: doc-only analysis. The next runtime step must first add neutral provenance and owner tests before any answers move. |
| D1a neutral provenance vocabulary | Done | `packages/shared/src/domain/airborne-basis.ts`, `packages/shared/src/domain/airborne-basis.test.ts` | Shared airborne result basis schema | Added neutral `user_verified_calculated_exact` provenance vocabulary so future exact runtime can identify a user-confirmed calculated package without reusing measured/source exact labels. It sits below measured/source exact and measured/source delta precedence but above generic physics/formula routes. | None: shared schema/test only. This step did not add `/api/estimate` loading, engine options, resolver wiring, or value overrides. Validation passed with `pnpm --filter @dynecho/shared exec vitest run src/domain/airborne-basis.test.ts --maxWorkers=1` and `pnpm --filter @dynecho/shared typecheck`. |
| D1b standalone exact bridge owner | Done | `packages/engine/src/project-user-verified-calculated-exact-bridge.ts`, `packages/engine/src/post-v1-project-user-verified-calculated-exact-bridge-owner-contract.test.ts` | Dedicated exact bridge module and owner tests, not wired into `calculateAssembly` yet | Added a pure resolver for active `user_verified_calculated_result` anchors that matches the current calculation-relevant request context fingerprint and publishes only stored `airborne_lab` `Rw`, `STC`, `C`, and `Ctr` values. Covered exact match, zero match, conflict, requested output not stored, field/building blocked, stronger measured/source precedence flags, and neutral provenance. | None for runtime answers: this step did not edit `calculate-assembly.ts`, `/api/estimate`, or web route loading. It created the bridge and tests before D1c wiring. Validation passed with `pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-verified-calculated-exact-bridge-owner-contract.test.ts --maxWorkers=1`. `pnpm --filter @dynecho/engine typecheck` is currently blocked by an unrelated dirty test file at `packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts:390` (`layer` implicit any); this slice did not edit that file. |
| D1c engine direct exact wiring | Done | `packages/engine/src/project-user-verified-calculated-exact-bridge.ts`, `packages/engine/src/calculate-assembly.ts`, `packages/engine/src/post-v1-project-user-verified-calculated-exact-runtime-owner-contract.test.ts` | Direct `calculateAssembly` option and runtime owner test | Wired the standalone bridge into `calculateAssembly` behind explicit engine options only: active anchors plus the current verified-calculated request context. The bridge is attempted only for `calculator: "dynamic"`, respects stronger measured/source exact and compatible-delta precedence flags, overrides only stored `airborne_lab` `Rw`, `STC`, `C`, and `Ctr` metrics, publishes neutral `airborne_user_verified_calculated_exact` provenance, and leaves unstored requested companions out instead of synthesizing them. Stored exact outputs are removed from the Answer Engine V1 parked-output warning path so a response cannot both publish an anchor value and claim that the same output was withheld; partial anchors still park only the unstored requested companions. Coordination comments mark the block as user-verified-calculated exact work so other agents do not confuse it with the unrelated explicit surface-mass edits already present in the file. | Controlled runtime movement in direct engine callers only; no web storage loading yet, no preset auto-evidence, no manual value edits, no field/building/impact/opening promotion, and no compatible/minimal-change delta. Validation passed with `pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-verified-calculated-exact-runtime-owner-contract.test.ts --maxWorkers=1` and `pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-verified-calculated-exact-bridge-owner-contract.test.ts --maxWorkers=1`. |
| D1d web estimate loader | Done | `apps/web/app/api/estimate/route.ts`, `apps/web/lib/workbench-v2-verified-calculated-anchor-storage.ts`, `apps/web/lib/workbench-v2-preset-routes.test.ts` | `/api/estimate` storage-to-engine handoff | Added a conservative `/api/estimate` loader that reads active owner-scoped verified-calculated references only when the parsed request is `calculator: "dynamic"`, has wall topology, is element-lab airborne, requests only `Rw`/`STC`/`C`/`Ctr`, and has no floor/impact/field/building/opening-specific context. It passes those anchors plus the derived exact request context to `calculateAssembly`; measured `Rw` payload/storage merging is unchanged. Current estimate requests do not carry `projectId`, so this step cannot enforce project filtering inside `/api/estimate`; exact fingerprint matching remains the hard guard. | Runtime movement now reaches normal Workbench estimates for the D1 exact wall/lab slice only. Still no preset auto-evidence, no retired references, no manual value edits, no floor/opening/impact/field/building promotion, and no compatible/minimal-change delta. Validation passed with `pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-preset-routes.test.ts --maxWorkers=1` and `pnpm --filter @dynecho/web typecheck`. |

Latest D1 validation note, 2026-06-22:
`pnpm --filter @dynecho/shared exec vitest run src/domain/airborne-basis.test.ts --maxWorkers=1`
passed, and
`pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-verified-calculated-exact-bridge-owner-contract.test.ts src/post-v1-project-user-verified-calculated-exact-runtime-owner-contract.test.ts --maxWorkers=1`
passed. `git diff --check` on the touched doc/shared/engine files was clean.
At that pre-D1d point, `rg` confirmed there was still no user-verified
calculated runtime loader under `apps/web/app/api/estimate`; the D1d note below
supersedes that storage-to-estimate gap.

Latest D1d validation note, 2026-06-22:
`pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-preset-routes.test.ts --maxWorkers=1`
passed after the `/api/estimate` loader was added, and `pnpm --filter
@dynecho/web typecheck` passed. A second focused route test run after comment
cleanup also passed. `git diff --check` on the touched doc/web/shared/engine
files was clean, and `rg` confirmed the previous misleading "do not import from
/api/estimate" and "measured Rw only" coordination comments were removed.

Additional D1d focused test pass, 2026-06-22:
`apps/web/lib/workbench-v2-preset-routes.test.ts` now also protects that
measured wall `Rw` anchors keep precedence over verified-calculated exact
references, verified-calculated references are not loaded for field/building
contexts, and partial verified-calculated packages do not synthesize unstored
lab companions such as `STC`. Focused validation passed with
`pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-preset-routes.test.ts --maxWorkers=1`
(`13 tests`). The broader slice-only validation also passed:
`pnpm --filter @dynecho/shared exec vitest run src/domain/project-user-verified-calculated-anchor.test.ts src/domain/airborne-basis.test.ts src/api/estimate.test.ts --maxWorkers=1`
(`20 tests`),
`pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-verified-calculated-exact-bridge-owner-contract.test.ts src/post-v1-project-user-verified-calculated-exact-runtime-owner-contract.test.ts --maxWorkers=1`
(`9 tests`), and
`pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-verified-calculated-anchor-storage.test.ts lib/workbench-v2-verified-calculated-anchor-routes.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench-rebuild/workbench-v2-verified-calculated-anchors.test.ts features/workbench/report-assistant-project-read-route.test.ts --maxWorkers=1`
(`31 tests`). Full gate was intentionally not run.

Stronger D1d guard expansion, 2026-06-22:
After review, the route/runtime coverage was strengthened beyond shallow happy
paths. New tests now prove that a stored verified-calculated reference is not
used when the live estimate changes layer thickness, is not used when the live
estimate changes the project material fingerprint, is isolated by configured
owner (`alice@example.com` reference does not apply for `bob@example.com`), and
does not publish any user-verified value when direct engine input contains
multiple active exact anchors for the same fingerprint. Focused validation
passed with
`pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-verified-calculated-exact-runtime-owner-contract.test.ts --maxWorkers=1`
(`4 tests`) and
`pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-preset-routes.test.ts --maxWorkers=1`
(`16 tests`). The full slice-only validation also passed:
`pnpm --filter @dynecho/shared exec vitest run src/domain/project-user-verified-calculated-anchor.test.ts src/domain/airborne-basis.test.ts src/api/estimate.test.ts --maxWorkers=1`
(`20 tests`),
`pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-verified-calculated-exact-bridge-owner-contract.test.ts src/post-v1-project-user-verified-calculated-exact-runtime-owner-contract.test.ts --maxWorkers=1`
(`10 tests`), and
`pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-verified-calculated-anchor-storage.test.ts lib/workbench-v2-verified-calculated-anchor-routes.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench-rebuild/workbench-v2-verified-calculated-anchors.test.ts features/workbench/report-assistant-project-read-route.test.ts --maxWorkers=1`
(`34 tests`). Full gate was intentionally not run.

Playwright critical-flow finding and fix, 2026-06-22:
Manual browser testing opened `/workbench-v2`, signed in, waited for the default
wall stack to calculate `Rw 57 dB`, clicked `Save reference`, verified the
saved-reference list, reloaded, and inspected the `/api/estimate` response. The
first browser pass found a real integration bug: the UI could save a
`user_verified_calculated_result`, but the subsequent estimate request did not
include an explicit workbench `mode`, so `/api/estimate` could not safely build
the same wall request context for exact matching and stayed on
`bounded_prediction`. The fix added optional `mode` to `EstimateRequestSchema`,
sent `mode` from `buildEstimatePayload`, and changed the D1d loader to open only
for `mode: "wall"` exact wall/lab requests. After the fix, browser reload showed
request body `{"mode":"wall",...}` and response basis
`origin: "user_verified_calculated_exact"`,
`kind: "airborne_user_verified_calculated_exact"`, and method
`post_v1_project_user_verified_calculated_exact_bridge`. The same Playwright
session also clicked duplicate save and confirmed the route returned `409`
without adding a second reference, clicked `Retire` through the confirm dialog
and confirmed reload returned to `bounded_prediction`, then saved again, changed
the first layer thickness from `12.5` to `15`, and confirmed the changed
fingerprint did not use the stored verified reference. Focused post-fix
validation passed with `pnpm --filter @dynecho/shared exec vitest run src/api/estimate.test.ts --maxWorkers=1`
(`11 tests`),
`pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-preset-routes.test.ts --maxWorkers=1`
(`16 tests`), `pnpm --filter @dynecho/shared typecheck`,
`pnpm --filter @dynecho/web typecheck`, and `git diff --check` on the touched
slice. Full gate was intentionally not run.

Post-Playwright hardening pass, 2026-06-22:
After the browser-found mode handoff bug, the automated coverage was expanded
again instead of relying on the manual pass. `packages/shared/src/domain/project-user-verified-calculated-anchor.test.ts`
now proves that `mode` and `airborneContext` remain part of the
calculation-relevant fingerprint while selected-output changes remain outside
that fingerprint. `packages/engine/src/post-v1-project-user-verified-calculated-exact-runtime-owner-contract.test.ts`
now proves that even a fingerprint-valid stored package is not published when
the trusted current request context is `mode: "floor"` or
`contextMode: "field_between_rooms"`. `apps/web/lib/workbench-v2-preset-routes.test.ts`
now proves that `/api/estimate` does not load stored verified-calculated
references when estimate `mode` is omitted or set to a non-wall mode. These are
test-only changes; they do not widen runtime behavior, add compatible delta,
or promote field/building/impact/opening outputs. Focused validation passed
with
`pnpm --filter @dynecho/shared exec vitest run src/domain/project-user-verified-calculated-anchor.test.ts src/domain/airborne-basis.test.ts src/api/estimate.test.ts --maxWorkers=1`
(`22 tests`),
`pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-verified-calculated-exact-bridge-owner-contract.test.ts src/post-v1-project-user-verified-calculated-exact-runtime-owner-contract.test.ts --maxWorkers=1`
(`12 tests`), and
`pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-verified-calculated-anchor-storage.test.ts lib/workbench-v2-verified-calculated-anchor-routes.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench-rebuild/workbench-v2-verified-calculated-anchors.test.ts features/workbench/report-assistant-project-read-route.test.ts --maxWorkers=1`
(`36 tests`). `pnpm --filter @dynecho/shared typecheck` and
`pnpm --filter @dynecho/web typecheck` passed. `pnpm --filter @dynecho/engine
typecheck` is still blocked by an unrelated dirty file outside this slice:
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts:390`
(`layer` implicit `any`).

Expanded Playwright pass, 2026-06-22:
The browser flow was rerun against an isolated dev server on
`127.0.0.1:3217` with a temp `DYNECHO_PROJECT_STORE_DIR`. The pass clicked
through login, default wall calculation, `Save reference`, reload exact-match
reuse, duplicate save conflict, retire, reload fallback, layer-thickness drift,
and Wall-to-Floor mode switch. Network checks confirmed: create returned `201`;
reload estimate request included `mode:"wall"` and returned
`origin:"user_verified_calculated_exact"`,
`kind:"airborne_user_verified_calculated_exact"`, and method
`post_v1_project_user_verified_calculated_exact_bridge`; duplicate save returned
`409` and kept one saved reference; retire returned `200` and the next reload
returned `origin:"bounded_prediction"` with no verified warning; changing the
first layer to `15 mm` returned `bounded_prediction` with no verified warning;
switching to Floor sent `mode:"floor"` / `targetOutputs:["Ln,w"]` and did not
emit any verified-calculated warning. Browser console ended with zero errors
and zero warnings except normal dev-mode Fast Refresh logs. The isolated server
and temp store were stopped/removed after the pass.

Second hardening pass for higher-confidence regression coverage, 2026-06-22:
Automated coverage was expanded again after the follow-up review request. The
shared fingerprint tests now prove that UI-only snapshot/value edits do not
change the calculation fingerprint, material catalog order is canonicalized,
and physical material changes such as density or flow resistivity do change the
fingerprint. The pure bridge owner now ignores schema-invalid matching anchors
with stale fingerprints and refuses to publish values stored on non-lab metric
bases. The `calculateAssembly` runtime owner now also blocks verified-calculated
values outside the dynamic calculator lane and blocks mixed lab+field output
requests instead of partially publishing stored `Rw`. The `/api/estimate`
route tests now also prove stored verified-calculated references are not loaded
for non-dynamic calculators or mixed exact-lab plus field-output requests.
Focused validation passed with
`pnpm --filter @dynecho/shared exec vitest run src/domain/project-user-verified-calculated-anchor.test.ts src/domain/airborne-basis.test.ts src/api/estimate.test.ts --maxWorkers=1`
(`23 tests`),
`pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-verified-calculated-exact-bridge-owner-contract.test.ts src/post-v1-project-user-verified-calculated-exact-runtime-owner-contract.test.ts --maxWorkers=1`
(`16 tests`), and
`pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-verified-calculated-anchor-storage.test.ts lib/workbench-v2-verified-calculated-anchor-routes.test.ts lib/workbench-v2-preset-routes.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts features/workbench-rebuild/workbench-v2-verified-calculated-anchors.test.ts features/workbench/report-assistant-project-read-route.test.ts --maxWorkers=1`
(`38 tests`). `pnpm --filter @dynecho/shared typecheck` passed. Current
`pnpm --filter @dynecho/web typecheck` is blocked outside this slice by
`apps/web/features/workbench/report-assistant-assembly-alternatives.test.ts:240`
(`string` not assignable to `never` in `missingPhysicalInputs`), and
`pnpm --filter @dynecho/engine typecheck` remains blocked outside this slice by
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts:390`
(`layer` implicit `any`). These hardening edits are still test/doc-only and do
not widen runtime behavior.

Screenshot-led verified-reference UX hardening, 2026-06-22:
Manual screenshots of the live Workbench showed that the storage/runtime
boundary was safe, but the result panel UX could mislead users. A saved Wall
verified reference still appeared in the Floor output panel, stale duplicate
errors remained visible after mode/output changes, the duplicate conflict copy
used internal anchor terminology, and saved-reference rows displayed metric
names without values or exact-match context. The corrective slice is UI/API
summary only:

- `apps/web/lib/workbench-v2-verified-calculated-anchor-storage.ts` now returns
  compact `valueSummaries` (`metric`, `metricBasis`, `valueDb`) in list
  summaries and uses user-facing duplicate conflict copy. It does not change
  the stored anchor schema or engine loader.
- `apps/web/features/workbench-rebuild/workbench-v2-verified-calculated-anchors.ts`
  now parses/formats `valueSummaries` and exposes a pure exact-fingerprint
  applicability filter.
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx` now computes
  the current ready request fingerprint for display only, shows only active
  references that exactly match that fingerprint under `Applicable references`,
  replaces nonmatching active rows with a small different-context note, clears
  verified-reference error state when the calculation context changes, and makes
  the retire confirmation explain that future estimates stop using the
  reference.
- `apps/web/app/globals.css` adds only small wrapping/note styles so long names
  and value summaries do not overflow on mobile.
- Focused validation passed with
  `pnpm --filter @dynecho/web exec vitest run lib/workbench-v2-verified-calculated-anchor-storage.test.ts lib/workbench-v2-verified-calculated-anchor-routes.test.ts features/workbench-rebuild/workbench-v2-verified-calculated-anchors.test.ts features/workbench-rebuild/workbench-verified-calculated-anchor-capture.test.ts --maxWorkers=1`
  (`12 tests`), `pnpm --filter @dynecho/web typecheck`, and `git diff --check`
  on the touched slice.
- Playwright screenshots were refreshed under
  `output/playwright/verified-anchor-ux-fix/`: save/applicable-reference,
  duplicate friendly error, STC error-clear, desktop Floor different-context,
  and mobile Floor different-context checks.

Risk controls:

- no engine files are touched in this UX slice;
- exact runtime matching remains server/engine-owned through `/api/estimate`;
- nonmatching references are not deleted or retired, only hidden from the
  current result panel as not applicable;
- the API still does not expose full `requestContext` or raw stored `values` in
  the list endpoint.

### Action A - Shared schema and canonicalization, no runtime movement

Goal:

- create a real `user_verified_calculated_result` evidence record type without
  changing calculator answers.

Implementation items:

- add a shared schema for project/user verified calculated anchors;
- add it as a separate shared domain module and export it from
  `packages/shared/src/index.ts`;
- include `anchorKind: "user_verified_calculated_result"`;
- include `scope`, `status`, `revision`, `createdAtIso`, `updatedAtIso`, and
  `createdBy`;
- include frozen Workbench snapshot, normalized calculator request context, and
  custom material catalog;
- include `values[]` with metric id, metric basis, value, and output provenance;
- include a route trace snapshot such as `airborneBasis`, impact basis where
  relevant, candidate resolution ids, supported/unsupported outputs, and
  assumptions;
- use a construction/context fingerprint for exact matching;
- use a separate package checksum or revision integrity field for values and
  provenance if needed;
- keep measured/source schemas unchanged.

Risk controls:

- do not put this schema behind `ActiveProjectUserMeasuredWallRwAnchorSchema`;
- do not reuse `metric: "Rw"` or `sourceMode: "lab"` for calculated results;
- do not allow `verified_global` for this anchor kind;
- reject missing topology/context when the selected outputs require it;
- reject duplicate active anchors for the same scope/fingerprint unless the UI
  marks a conflict and blocks runtime use.

Why this step is low risk:

- it only creates data shape and validation;
- `/api/estimate` and engine resolver behavior stay unchanged.

### Action B - Storage and Workbench capture API, no runtime movement

Goal:

- let the user save the current live calculated package as an auditable
  project/user reference, but do not let it affect estimates yet.

Implementation items:

- add a new repository/file, for example a verified-calculated-anchor library;
- add a new API route, for example
  `/api/workbench-v2/verified-calculated-anchors`;
- capture from the current `estimateResult`, not from formatted UI text;
- capture only selected outputs that are in `supportedTargetOutputs` and have a
  finite numeric value;
- reject `pending`, `needs_input`, and `unsupported` output rows;
- save no metric/value edit fields in the first flow;
- save the exact snapshot/context used for that estimate;
- save selected outputs using the shared `RequestedOutputSchema` source of
  truth, not a stale local allow-list;
- if a Workbench snapshot parser drops a selected output that the live result
  supports, block capture until the snapshot/selected-output mismatch is fixed;
- list and retire these anchors separately from scalar measured `Rw` anchors.

Risk controls:

- do not call the old `saveSelectedWorkbenchPresetMeasuredRwAnchor` handler;
- do not POST to `/api/workbench-v2/measured-wall-rw-anchors`;
- do not infer evidence from "Save template";
- require a separate explicit confirmation action such as
  `Save current result as verified reference`;
- if the current result is stale relative to visible layers/context, block save
  and ask the user to calculate again.

Why this step is low risk:

- saved records are visible/auditable but still inert for runtime.

### Action C - Assistant and report visibility, still no runtime movement

Goal:

- make the saved references explainable before they can affect calculator
  values.

Implementation items:

- expose project/user verified calculated anchors to assistant read context;
- show anchor kind, scope, status, saved outputs, fingerprint, and route trace;
- store anchor id/revision on reports only when a report explicitly references
  or later uses one;
- keep retired anchors readable for audit.

Risk controls:

- assistant copy must not call a raw preset or raw calculator output evidence;
- assistant copy must say "user-verified calculated reference", not "lab
  measurement";
- reports must not imply global/source verification.

### Action D - Exact runtime resolver

Goal:

- let an active user-verified calculated anchor supply only the stored values
  for the exact same construction/context/metric basis/scope.

Implementation items:

- add a separate estimate input or server-loaded option for verified calculated
  anchors;
- add a dedicated engine resolver, not a measured `Rw` bridge extension;
- match by canonical construction/context fingerprint plus metric basis and
  scope;
- publish only metrics present in the stored live `values[]`;
- add an airborne basis/provenance kind that clearly identifies
  user-verified-calculated exact use;
- do not reuse measured exact `origin` / `kind` enum values for
  user-verified-calculated runtime traces;
- keep verified global/source rows and measured/source anchors higher
  precedence;
- allow the verified calculated exact anchor to outrank a generic formula route
  only for its exact stored fingerprint and outputs.
- choose the physical insertion point in `calculate-assembly.ts` with tests
  against the existing built-in compatible source-delta and project/user
  measured frequency/scalar bridges; do not rely on the conceptual precedence
  list alone.

Risk controls:

- if zero anchors match, continue normal calculation;
- if more than one active anchor matches, do not pick a winner silently;
- if requested output was not stored, keep normal formula or unsupported
  behavior; do not synthesize it from another metric;
- field/building outputs must only be used when the stored value and basis are
  field/building outputs, not copied from lab `Rw`;
- retired, draft, conflict, or wrong-scope anchors are ignored;
- runtime owner tests must cover source precedence, conflicts, fingerprint
  mismatch, basis mismatch, unsupported outputs, stale revisions, and the
  existing compatible source-delta call-order interaction.

Why this step has controlled runtime risk:

- it changes answers only for an exact fingerprint that the user explicitly
  activated;
- it does not introduce near-match inference or metric aliasing.

#### D0 Exact-Runtime Selection Card - 2026-06-22

This card supersedes any broader interpretation of Action D until a later
owner explicitly widens it.

User construction / formula family:

- Workbench wall airborne packages only.
- First runtime owner is element-lab exact use of a
  `user_verified_calculated_result` package.
- No floor, impact, field, building, opening, compatible-delta, or
  near-match route is opened by the first runtime owner.

Target outputs to open:

- Stored `airborne_lab` values for `Rw`, `STC`, `C`, and `Ctr` only.
- Runtime may publish only requested outputs that are present in the stored
  `values[]` and in the saved live result trace.
- Stored `Rw` does not imply `STC`, `C`, `Ctr`, `R'w`, `Dn,w`, `DnT,w`,
  impact, or A-weighted outputs.

Route:

- `/api/estimate` should server-load active owner-scoped verified-calculated
  anchors from trusted storage.
- The public/client request should not send arbitrary verified-calculated
  anchor blobs as truth.
- The engine should receive a separate narrow option such as
  `airborneUserVerifiedCalculatedAnchors`; it must not reuse
  `airborneMeasuredSourceAnchors`.
- A dedicated resolver should compare the current calculation-relevant
  request context fingerprint to the anchor fingerprint and should match
  metric plus `metricBasis`.

Required physical/context inputs:

- active anchor status;
- same owner/project scope;
- current request context can be canonicalized to the same fingerprint;
- element-lab wall context;
- requested output appears in the stored values with `metricBasis:
  "airborne_lab"`;
- anchor result trace declares that output as supported.

`needs_input` behavior for missing inputs:

- The first exact owner should not invent new `needs_input` states.
- If the anchor has no exact match, has no requested stored output, or cannot
  prove the metric basis, normal calculation/support behavior continues.
- Multiple matching active anchors are a conflict; do not pick newest/highest
  or silently continue as if an anchor was used.

Unsupported boundaries that must remain blocked:

- no compatible/minimal-change delta;
- no field/building adapter from a lab saved value;
- no impact output use;
- no floor output use;
- no `verified_global` scope;
- no measured/source provenance labels;
- no `airborne_measured_exact`, `measured_exact_full_stack`, or
  `exact_source` reuse for user-verified calculated results;
- no runtime use of `draft`, `retired`, `conflict`, or wrong-scope records.

Implementation requirements before D1 code:

- Add neutral shared basis vocabulary, for example a
  `user_verified_calculated_exact` origin, an
  `airborne_user_verified_calculated_exact` kind, and a non-measured tolerance
  label if needed.
- Place that origin below measured/source exact and measured/source delta, but
  above generic formula/screening routes.
- Add shared estimate request tests for the new separate runtime lane.
- Add engine owner tests before resolver wiring: exact match, zero match,
  conflict, wrong fingerprint, wrong scope/status, metric-basis mismatch,
  requested output not stored, measured/source precedence, compatible-delta
  non-interaction, and neutral provenance.
- Add web route tests proving `/api/estimate` loads active stored
  verified-calculated anchors only from trusted storage and keeps retired
  anchors out.

Expected first-owner counters if D1 lands:

- `newCalculableRequestShapes`: 0 for ordinary formula routes; 1 exact
  user-verified calculated evidence route for already-saved wall element-lab
  packages.
- `newCalculableTargetOutputs`: up to 4 stored lab outputs (`Rw`, `STC`, `C`,
  `Ctr`) when explicitly present.
- `runtimeBasisPromotions`: 1 exact user-verified calculated basis only when a
  single active exact match exists.
- `runtimeValuesMoved`: count of requested stored lab outputs published from
  the exact anchor.

### Action E - Compatible/minimal-change delta, later only

Goal:

- support a very narrow "known reference plus small owned change" route after
  exact use is proven.

Implementation items:

- start with one boundary, for example compatible exterior board only;
- require explicit topology and side information;
- require an owned delta rule and tests;
- require enough stored data to apply the delta safely, such as a curve or a
  route that can be re-evaluated under the saved context;
- keep scalar/single-number-only packages out unless a dedicated owner proves
  that metric-specific delta.

Risk controls:

- no "looks similar" matching;
- no cavity/internal/topology-changing edits;
- no field/building adapter unless the basis route is separately owned;
- no impact aliases;
- no use when the anchor itself came from unsupported or non-live outputs.

### Explicit do-not-do list

- Do not make saving a preset create evidence.
- Do not make every calculated result an anchor.
- Do not add manual value editing in the first verified-calculated flow.
- Do not store user-verified calculated results under measured/lab schemas.
- Do not merge verified calculated anchors into
  `airborneMeasuredSourceAnchors`.
- Do not extend the old scalar `Rw` bridge to pretend it supports multiple
  outputs.
- Do not use lab `Rw` as `R'w`, `Dn,w`, `DnT,w`, `STC`, impact, or
  A-weighted companion output.
- Do not open compatible delta until exact runtime behavior is landed and
  bounded-delta owner tests exist.

## Consistency Invariants And Bug Traps - 2026-06-22

This section is the pre-implementation guardrail. If an implementation choice
violates one of these invariants, stop and redesign before touching runtime.

### Concept invariants

- A preset is never evidence.
- A raw calculator result is never evidence.
- A user-verified calculated result is evidence only after explicit user
  confirmation.
- A user-verified calculated result is not a measurement, lab report,
  manufacturer source row, or global source row.
- A measured/source anchor and a user-verified calculated anchor may share a
  construction fingerprint, but they must not share schema identity,
  provenance labels, or runtime trace wording.
- Evidence activation is status-driven. Only `active` records can be runtime
  candidates; `draft`, `conflict`, `retired`, and `promoted` need explicit
  semantics and tests before use.

### Capture invariants

- Capture from structured `AssemblyCalculation` data, not from formatted UI
  strings such as `Rw 52 dB`.
- Capture only selected outputs that are present in `supportedTargetOutputs`.
- Capture only finite numeric values read from the result object.
- Do not capture any output listed in `unsupportedTargetOutputs` or in a
  `needs_input` / `unsupported` answer boundary.
- Store the exact request snapshot used for the result: visible layers,
  selected outputs, context, custom materials, material visual overrides, and
  calculator id.
- Store the result trace that explains the value: `airborneBasis`, impact basis
  where relevant, candidate ids/resolution, assumptions, required inputs,
  supported outputs, unsupported outputs, and warnings.
- Store a result/request checksum or equivalent identity so the server can
  detect that the visible Workbench draft changed after the estimate was run.

Stale-result rule:

- If layers, context, selected outputs, custom materials, calculator id, or
  route-critical material properties changed after the last estimate, block
  `Save current result as verified reference` and require a fresh calculation.

### Metric and basis invariants

- `metric` is the requested output id, for example `Rw`, `STC`, `R'w`,
  `DnT,w`, or `Ln,w`.
- `metricBasis` is the context/basis that made that value valid, for example
  element lab, field between rooms, building prediction, or impact basis.
- `ratingStandard` is not the same as `measurementMethodStandard`.
- `sourceMode: "lab"` must not appear on a user-verified calculated anchor
  unless a future schema explicitly models calculated lab-basis provenance
  without pretending it is measured.
- Field/building values are valid only when the saved result actually produced
  those field/building outputs through an owned route.
- A stored `Rw` value never implies `STC`, `C`, `Ctr`, `R'w`, `Dn,w`,
  `DnT,w`, impact, or A-weighted values.
- Runtime may publish only the metric/basis pairs that are both stored on the
  anchor and opened by owner tests.

### Schema and API invariants

- New schemas must not extend `ProjectUserMeasuredWallRwAnchor` as a shortcut.
- New estimate inputs must not be named as if they are measured-source anchors.
- New Workbench routes must not POST verified calculated anchors to
  `/api/workbench-v2/measured-wall-rw-anchors`.
- `/api/estimate` must not merge verified calculated anchors into
  `airborneMeasuredSourceAnchors`.
- Server-side routes should load active anchors from trusted storage by scope
  or id; the client should not send arbitrary anchor blobs as truth.
- Stored records must be size-limited, schema-validated on read, and written
  atomically like the existing project/preset stores.

### Runtime invariants

- First runtime owner is exact-only.
- Zero matches means normal calculation continues.
- One active exact match may publish only stored/opened values.
- More than one active exact match for the same scope/fingerprint/output is a
  conflict; do not pick newest, highest, lowest, or first.
- Verified global/source rows outrank user-verified calculated anchors unless
  a separate explicit project override flow is implemented.
- Measured/source anchors outrank user-verified calculated anchors by default.
- Retired anchors never affect new estimates, but old reports that used them
  must remain explainable.
- Formula routes remain the default when no safe exact anchor applies.

### UI invariants

- The corrected first flow has one deliberate action:
  `Save current result as verified reference`.
- The corrected first flow has no metric/value edit fields.
- The confirmation view must show the frozen stack, saved outputs, scope,
  provenance/basis, and any validation blockers.
- Conflict and stale-result states block activation; they are not passive
  warnings.
- Existing scalar `Rw` reference retirement UI can remain for cleanup, but new
  verified-calculated capture must be visually and structurally separate.

### Runtime acceptance gates

Do not wire verified calculated anchors into estimates until all of these are
true:

- shared schema exists for `user_verified_calculated_result`;
- storage/API tests prove explicit save, list, retire, conflict, and stale
  result behavior;
- fingerprint tests prove calculation-relevant changes move the fingerprint
  and UI-only changes do not;
- server tests prove verified calculated anchors are not merged into measured
  anchor inputs;
- engine owner tests prove precedence, exact match, conflict block, wrong
  scope, retired status, basis mismatch, unsupported output, and no metric
  aliasing;
- result trace tests prove the UI/report/assistant can explain that a
  user-verified calculated exact anchor was used.

### Known bug traps from the current implementation

- `workbench-preset-library-panel.tsx` currently pauses only the old create UI;
  the parent scalar `saveSelectedWorkbenchPresetMeasuredRwAnchor` handler still
  exists and must not be reused.
- `workbench-v2-measured-wall-rw-anchor-storage.ts` builds a measured scalar
  anchor from a preset snapshot; the corrected flow must build a verified
  calculated anchor from the current estimate package.
- `packages/shared/src/api/estimate.ts` currently has measured Rw and measured
  frequency anchor inputs only; adding the new kind there without a separate
  name will hide a semantic bug.
- `project-user-measured-wall-rw-exact-bridge.ts` is intentionally `Rw` /
  lab / exact-only; broadening it would risk metric aliasing.
- `project-user-measured-wall-airborne-frequency-compatible-delta.ts` is a
  measured frequency curve route; it is a useful pattern for conflicts and
  exact fingerprints, not a place to insert calculated packages directly.

## Test Plan

Engine tests:

- exact project/user verified calculated anchor returns only stored live values
  for the same fingerprint, metric, basis, and scope;
- zero matching verified calculated anchors continue through the normal formula
  or source route;
- built-in verified exact source precedence is stable;
- measured/source evidence outranks user-verified calculated evidence unless a
  project override is explicitly selected;
- conflicting anchors do not silently pick a winner;
- wrong-scope anchors are not considered;
- anchor with missing topology is rejected;
- anchor with metric-basis mismatch is rejected;
- exact user-verified calculated runtime uses neutral provenance and does not
  report `airborne_measured_exact` / `measured_exact_full_stack`;
- unsupported or non-live saved rows do not become runtime values;
- requested outputs that were not stored on the anchor are not synthesized from
  nearby stored metrics;
- exterior board variant applies bounded delta only after a separate owner
  opens that boundary;
- interior/cavity board variant is `needs_input` or unsupported;
- field/building outputs are not aliased from lab or scalar values.

Web/server tests:

- preset save does not create source anchor;
- verified calculated anchor save requires explicit action;
- verified calculated anchor persists with snapshot, values, basis trace, and
  revision;
- verified calculated save reads structured result values, not formatted UI
  text;
- stale result save is blocked when layers, context, selected outputs,
  calculator id, or custom materials changed after the last estimate;
- selected-output persistence is backed by shared `RequestedOutputSchema`, not
  the narrower Workbench snapshot local allow-list;
- verified calculated anchors are not accepted through
  `airborneMeasuredSourceAnchors`;
- estimate payload/server resolver includes active anchors only after the
  runtime owner exists;
- inactive/retired anchors are excluded;
- report stores which anchor/basis was used.

UI tests:

- preset-only row is visually distinct from verified calculated anchors;
- verified calculated capture has no metric/value edit fields;
- verified calculated capture is unavailable when there is no current live
  result package;
- stale-result and conflict states are visible and block activation;
- result panel shows exact verified-calculated provenance;
- result panel shows anchor-delta provenance.

Assistant/MCP tests:

- assistant can list project/user verified anchors;
- assistant can explain a report's evidence basis;
- assistant can show anchor revisions;
- assistant does not claim evidence for preset-only records.

## Risks

- Bad measurements or wrongly confirmed calculated results can pollute
  calculator results if activation is too easy.
- Global source promotion can become a source-crawl distraction.
- Exact matching can be brittle if fingerprints include UI-only fields.
- Exact matching can be unsafe if fingerprints omit topology-critical fields.
- Metric basis confusion can create wrong `Rw` / `R'w` / `DnT,w` answers.
- Variant delta can overreach if it accepts non-exterior or topology-changing
  edits.

Mitigation:

- anchors are inactive until validation passes;
- default scope is project/user, not global;
- exact match first, variants later;
- strict canonicalization versioning;
- explicit conflict UI;
- result provenance always visible.

## Current Recommendation

This should be treated as a high-ROI calculator infrastructure feature, but
not as a quick preset storage tweak.

Recommended next action:

1. Implement shared `user_verified_calculated_result` schema, storage, and
   canonical fingerprint tests.
2. Keep calculator runtime unchanged in that first step.
3. Add Workbench capture UI/API that saves the current live result package
   without edit fields.
4. Then add exact-match bridge for project/user verified calculated anchors.
5. Only after exact-match behavior is proven, extend compatible anchor-delta.

## Additional Implementation Audit - Iteration 2

### Existing exact source path

The current exact airborne source path lives in
`packages/engine/src/airborne-verified-catalog.ts`.

Important implementation details:

- The verified source list is a static in-repo catalog:
  `VERIFIED_AIRBORNE_CATALOG`.
- Exact matching already normalizes adjacent same-material layers, so a
  split layer such as `35 mm + 35 mm` can match a canonical `70 mm` layer
  when material identity and role remain the same.
- Matching accepts reversed layer order when the construction is otherwise
  symmetric.
- Matching is not just by layer names. It checks material id, layer role,
  rounded thickness, and route-critical context fields such as connection
  type, stud type, resilient bar side count, airtightness, and stud spacing.
- `applyVerifiedAirborneCatalogAnchor` anchors the dynamic curve to the
  matched measured/source metric and returns source-anchor provenance.

This is the right shape to learn from, but the extension must not simply dump
presets or calculated packages into this static catalog. Project/user evidence
anchors, including measurements and user-verified calculated packages, need
separate resolvers and scope policies before any exact-match use.

### Existing compatible source-anchor delta path

The current compatible source-anchor delta path lives in
`packages/engine/src/post-v1-wall-compatible-anchor-delta.ts`.
Some runtime method names and warnings still use historical
`measured-anchor` wording because the route was introduced around measured
source anchoring. Do not treat that wording as a schema instruction for
user-verified calculated anchors.

Important implementation details:

- The direct Rw delta candidate removes only compatible exterior board layers
  from one or both outside faces, then checks whether the reduced stack has an
  exact verified lab `Rw` source match.
- The current delta is bounded: added-board mass law movement is damped and
  clamped, then the direct curve is shifted to the source anchor plus the
  calculated delta.
- Unsafe edits, such as inserting a board inside the cavity, do not satisfy
  this path because the reduced stack no longer represents the same proven
  construction boundary.
- Lab companion expansion for `STC`, `C`, and `Ctr` is intentionally narrower
  than direct Rw delta today. It is hard-gated to the known
  `knauf_lab_416889_primary_2026` source id.

Design implication:

- User-verified calculated anchors need their own exact resolver and must not
  reuse the scalar measured `Rw` bridge.
- Compatible exterior-board delta may later generalize to validated
  project/user evidence anchors.
- Lab companion outputs should open only when the stored values or curve basis
  prove the route for those outputs.

### Estimate API gap

`packages/shared/src/api/estimate.ts` currently accepts:

- `airborneContext`;
- `calculator`;
- `exactImpactSource`;
- `floorImpactContext`;
- `impactFieldContext`;
- `impactPredictorInput`;
- `layers`;
- `materialCatalog`;
- `steelFloorFormulaSurface`;
- `targetOutputs`.

There is no `user_verified_calculated_result` estimate input or server-side
resolver yet. The existing measured-anchor lane is scalar wall `Rw` only and
must not be reused for the corrected calculated-result package.

This means the feature cannot be completed by UI storage alone. The
implementation needs one of these explicit bridges:

1. extend the shared estimate request with active verified calculated anchors;
   or
2. keep the public request unchanged and have the server-side estimate route
   resolve active project/user verified calculated anchors into the engine
   call.

Preferred bridge:

- server-side route loads active project/user verified calculated anchors for
  the current workspace/session;
- validates them through shared schema;
- passes only active, scoped, conflict-free anchors to the engine;
- engine receives a narrow calculated-anchor input, not arbitrary preset
  records and not measured `Rw` records.

This keeps UI presets, project persistence, and engine source matching as
separate ownership boundaries.

## Additional External Research - Iteration 3

The internet research confirms that the data model must separate measurement
method, rating method, and metric basis.

Sources reviewed on 2026-06-15:

- ISO 10140-2:2021 official page:
  https://www.iso.org/standard/79487.html
- ISO 717-1:2020 official page:
  https://www.iso.org/standard/77435.html
- ISO 16283-1:2014 official page:
  https://www.iso.org/standard/55997.html
- ISO 12999-1:2020 official page:
  https://www.iso.org/standard/73930.html
- ASTM E90 official page:
  https://www.astm.org/e0090-09r16.html
- ASTM E413 official page:
  https://www.astm.org/e0413-22.html
- ASTM E336 official page:
  https://www.astm.org/e0336-20.html
- Knauf verified wall source PDF, report 416889:
  https://knauf.com/api/download-center/v1/assets/f4c73202-1613-4953-b2dc-666f67ab1fab?download=true
- Siniat Drywall Manual 2025 PDF:
  https://media.siniat.co.uk/pi859850/original/308719451/siniat-drywall-manual-bk2-partitions-v2.2.0-july25.pdf

Findings and product impact:

- ISO 10140-2 is a laboratory airborne insulation measurement method for
  building elements. Its official scope explicitly treats lab results as not
  directly field-applicable without accounting for flanking and boundary
  effects. Measured/source anchors therefore need `sourceMode: "lab" |
  "field"` and must not convert lab `Rw` into field `R'w`, `Dn,w`, or `DnT,w`
  by relabeling. User-verified calculated anchors must preserve the route
  context that produced any field/building values.
- ISO 717-1 is a rating method for single-number airborne quantities. It uses
  one-third-octave or octave-band measurement results from methods such as ISO
  10140-2 and ISO 16283-1. Therefore an anchor should store both
  `measurementStandard` and `ratingStandard`, not one overloaded `standard`
  field.
- ISO 16283-1 covers field airborne measurements between rooms in buildings.
  This validates the existing repo direction: field/building outputs belong to
  field/building route owners and adapters, not the exact lab `Rw` source row.
- ISO 12999-1 covers uncertainty assessment for sound insulation
  measurements. The anchor form should ask for either an explicit tolerance or
  an uncertainty policy. If the user does not know it, the anchor can still be
  saved, but the route should treat it as `exact_only` until a strict policy is
  chosen.
- ASTM E90 is the US laboratory test method for airborne transmission loss.
  ASTM E413 is the classification/rating method that includes STC. ASTM E336
  is the field method and includes flanking/apparent behavior. This mirrors the
  ISO split and confirms that `Rw`, `STC`, `ASTC`, and field metrics are not
  interchangeable.
- Manufacturer source documents such as the Knauf report and Siniat manual
  report specific systems, not generic material substitutions. Exact source
  anchors must therefore capture the full layer stack, material ids/properties,
  framing/support topology, insulation/cavity details, and source provenance.

## Will This Actually Help The Calculator?

Yes, if implemented as an explicit evidence pipeline rather than a preset or
raw-calculation shortcut.

How it helps:

- Exact project measurements and user-verified calculated packages become
  first-class evidence. The same construction can return the trusted value
  without waiting for a global catalog import.
- Repeated hotel/school/office projects can reuse known trusted assemblies with
  visible provenance.
- The assistant can explain why a report used a project measurement, a global
  source, a bounded delta, a formula route, or `needs_input`.
- Over time, high-quality measured/source project anchors can become
  candidates for reviewed global source rows, with tests and source provenance
  already attached. User-verified calculated anchors need independent evidence
  before global promotion.
- The existing engine result trace already has source-anchor concepts, so the
  UI and assistant can expose a path that the engine understands.

Where it will not help:

- It will not make unknown custom materials physically known unless the anchor
  is an exact full-system measurement or the material has route-required
  physical inputs.
- It will not justify broad Siniat/Knauf/British Gypsum source crawling.
- It will not make field metrics available from a lab `Rw` alone.
- It will not safely predict arbitrary layer edits. Only proven compatible
  deltas can use an evidence anchor.

## Required Boundaries Before Implementation

### Preset vs anchor boundary

Never treat a saved preset as a source row.

Allowed:

- preset saved for reuse;
- user explicitly saves current live result as a verified reference;
- user separately adds source/measurement evidence when available;
- frozen snapshot becomes an evidence anchor;
- active anchor participates in matching.

Not allowed:

- every preset becomes engine evidence;
- preset target value becomes source truth;
- edited preset mutates an already active evidence anchor.

### Metric basis boundary

Initial corrected anchor model:

- user-verified calculated packages may store every finite live output that the
  current route produced;
- runtime may consume only outputs opened by owner tests on the same metric and
  basis;
- measured/source anchors may store any explicitly supplied metric when its
  basis, source mode, and standard are known.

Parked for later:

- edited single-metric overrides;
- unsupported or non-live outputs;
- field/building values inferred from lab values by alias;
- impact/floor/ceiling anchors unless a dedicated route owner opens them.

### Scope boundary

Default activation scope should be the smallest useful scope:

1. project evidence anchor;
2. user evidence anchor;
3. team evidence anchor;
4. verified global source row.

Global promotion must be a review workflow with tests, not an automatic
side-effect of usage frequency.

### Canonicalization boundary

Exact matching must be stable and strict.

Fingerprint should include:

- canonical layer order or a proven reversible equivalent;
- material ids;
- custom material physical properties used by calculator routes;
- thickness;
- surface mass when material is custom or source-specific;
- role/topology;
- cavity/fill details;
- support/framing context;
- resilient bar side count;
- stud spacing;
- lab/field/building context;
- metric basis and rating standard;
- canonicalization version.

Fingerprint should exclude:

- UI color;
- display-only name;
- notes;
- project title;
- preset description;
- report prose edits.

Special care:

- Existing verified catalog matching permits reversed layer order. The new
  fingerprint helper should only normalize reversal when the wall context is
  side-symmetric. Side-specific context, resilient bars, or asymmetric
  installations must not collapse into the same fingerprint.
- Existing verified catalog matching allows thickness and stud-spacing
  tolerances. Project/user evidence anchors should start stricter than the
  global catalog and only widen after a dedicated test owner proves the
  tolerance.

## Implementation-Safe Plan Revision

### Phase 0 - Documentation and contract audit

Status: in progress in this document.

Actions:

- record implementation findings;
- record external standard/source findings;
- keep runtime unchanged;
- avoid touching active calculator slice files owned by other agents.

Exit criteria:

- doc states why this is useful;
- doc states exact boundaries;
- doc states where implementation must connect.

### Phase 1 - Domain schema and storage only

Files likely involved:

- shared domain schema for evidence anchors, including
  `user_verified_calculated_result`;
- server project/user storage for anchors;
- focused storage tests;
- assistant read-contract types if read-only listing is added in the same
  phase.

Rules:

- no estimate behavior change;
- no engine route change;
- no global source catalog change;
- every anchor stores frozen snapshot and revision;
- source id is not the preset id.

Suggested id rule:

- `project_anchor_${projectId}_${fingerprintPrefix}_${revision}`;
- `user_anchor_${ownerId}_${fingerprintPrefix}_${revision}`;
- ids are deterministic enough to audit, but should still include a collision
  check against existing anchors.

### Phase 2 - Canonical fingerprint helper

Files likely involved:

- shared or engine-adjacent helper, depending on ownership decision;
- unit tests for stable fingerprints.

Test cases:

- identical stack gives identical fingerprint;
- display name/color changes do not move fingerprint;
- thickness change moves fingerprint;
- material id change moves fingerprint;
- custom material physical property change moves fingerprint;
- symmetric reversed wall can match only when context permits;
- side-specific reversed wall does not match;
- missing route-critical topology blocks active anchor validation.

### Phase 3 - Exact verified-calculated bridge

Files likely involved:

- shared estimate schema or server estimate adapter;
- engine exact source resolver adapter;
- workbench estimate payload or route layer;
- focused engine/server tests.

Rules:

- exact match only;
- only metrics/bases stored as live values and opened by owner tests;
- active scoped anchors only;
- conflict-free anchors only;
- built-in verified source precedence stays stable unless user explicitly
  selects a project override;
- result trace must show anchor id, label, scope, values used, metric basis,
  anchor kind, and original calculation provenance.

Negative tests:

- non-matching layer order/context falls back to formula/needs_input;
- inactive anchor ignored;
- retired anchor ignored;
- conflicting same-fingerprint anchors blocked;
- stored lab/calculated values do not create field/building outputs by alias.

### Phase 4 - UI flow

UI goals:

- keep calculator usable without projects;
- keep preset library simple;
- show verified-reference controls only when a current live result package is
  available;
- avoid cluttering the workbench top area.

Flow:

1. User calculates the current stack.
2. User clicks `Save current result as verified reference`.
3. A focused dialog shows the frozen construction preview, live output values,
   route basis, scope, and validation issues.
4. The dialog has no metric/value edit fields.
5. User confirms active anchor creation.
6. Result panel shows whether this anchor was used after runtime support
   exists.

UI constraints:

- no large always-open project/anchor panel in the workbench;
- use badges and compact provenance rows;
- long source labels and notes must wrap without layout shift;
- destructive actions like retire/delete need confirmation;
- conflicts must block activation instead of becoming warnings hidden in logs.

### Phase 5 - Assistant/MCP visibility

Assistant must be able to read:

- evidence anchor list by project/user scope;
- anchor detail and frozen snapshot;
- anchor revisions and retired status;
- reports that used an anchor;
- runtime source anchor trace for a report;
- rejected match diagnostics where stored.

Assistant must not:

- mutate anchors unless a separate write contract is explicitly designed;
- infer that a preset is evidence;
- promote project/user anchors to global catalog;
- claim field/building support from unrelated lab or calculated scalar values.

### Compatible Evidence-Anchor Delta

Only after exact source or verified-calculated bridge is proven.

First allowed delta must be selected by a dedicated owner. Expected narrow
shape:

- wall;
- same exact reduced stack fingerprint;
- same metric and basis as the anchor route supports;
- added exterior board only;
- no topology/support/cavity/fill changes;
- known board surface mass;
- bounded delta result visible in basis/provenance.

Still blocked:

- inserted cavity board;
- changed insulation;
- changed stud/support topology;
- field/building metric aliasing;
- broad companion metric promotion;
- source rows with unknown measurement basis.

## Things To Double-Check During Implementation

- Do not edit the active floor user-material calculator slice unless the
  evidence-anchor work explicitly requires it. This feature is calculator
  evidence infrastructure first.
- Keep `targetValue` on common presets as documentation/test metadata unless
  the user explicitly turns a result package or source record into an evidence
  anchor.
- Avoid modifying `VERIFIED_AIRBORNE_CATALOG` for user data. User/project data
  should be persisted outside static source rows.
- Do not pass arbitrary UI snapshot blobs directly into engine matching.
  Validate and canonicalize first.
- Preserve existing built-in Knauf exact/delta tests before broadening
  resolver inputs.
- Add negative tests before enabling user anchors in UI.
- Result provenance must be visible in reports, saved report revisions, and
  assistant-readable project context.
- Anchors should be immutable once active. Edits create a new revision; old
  revision can be retired but reports using it must remain explainable.

## Additional Integration Audit - Iteration 4

### Project storage fit

`apps/web/lib/server-project-storage.ts` already has the right project-level
concepts for this feature:

- projects are owner scoped;
- assemblies store frozen `snapshot` payloads;
- reports store `sourceAssemblySnapshot`, `sourceCalculationOutput`, and
  `sourceMaterialSnapshot`;
- reports have revision records with `source`, `changeSummary`, and
  `assistantPatchSummary`;
- optimistic conflict checks already exist for report revision writes.

This means evidence anchors do not need a separate database technology in the
first implementation. They can start as another project/user scoped JSON record
family with the same repository discipline.

Recommended storage placement:

- project-scoped anchors live on the project record or a project-adjacent
  project child file;
- user-scoped anchors live next to owner-level workbench preset storage;
- report records store the source anchor id/revision actually used at report
  generation time;
- report revisions keep historical source-anchor provenance even if the anchor
  is later retired.

Important point:

- A report must be explainable forever. If `project_anchor_A@rev2` was used to
  generate a report, retiring `rev2` later must not erase the report's
  provenance. Store either a compact anchor trace snapshot on the report or
  preserve immutable anchor revisions.

### Preset storage fit

`apps/web/lib/workbench-v2-preset-storage.ts` stores owner-level presets with
name, description, kind, layer count, and JSON snapshot. It already enforces
size limits and owner scoping.

This is useful input for evidence anchors, but should not become the anchor
storage itself.

Reason:

- presets are mutable convenience templates;
- evidence anchors need immutable/revisioned records;
- presets can be renamed without changing calculation identity;
- presets can be deleted without invalidating reports that already used a
  evidence anchor derived from them.

Recommended link:

- evidence anchor stores `createdFromPresetId` when applicable;
- evidence anchor stores its own frozen canonical snapshot;
- if the preset is later edited or deleted, the evidence anchor remains
  unchanged.

### Workbench estimate fit

`buildEstimatePayload` in
`apps/web/features/workbench-rebuild/calculator-workbench.tsx` currently sends
layers, target outputs, context, floor impact context, impact field context,
and custom material catalog. It does not send presets, projects, reports, or
source-anchor candidates.

That is a good boundary for the first storage phase. It also means exact
source behavior cannot change until the estimate bridge is deliberately added.

Bridge options:

1. client sends selected/active source anchor ids, server resolves them;
2. server infers active anchors from selected project/user context;
3. shared `EstimateRequest` accepts a validated `airborneSourceAnchors` array.

Recommended approach:

- For Workbench V2, client should send only anchor ids or active project/user
  context, not raw anchor blobs.
- Server should load and validate anchors from storage, then pass canonical
  active anchors to the engine.
- Direct local engine tests can still construct canonical anchors without
  touching UI.

Why:

- prevents tampered UI payloads from becoming source evidence;
- keeps source activation under server/project permissions;
- avoids mixing convenience preset snapshots with calculator evidence.

### Assistant read-tool fit

`report-assistant-project-read-contract.ts` currently exposes read-only tools
for projects, assemblies, reports, report documents, and report revisions.
There are no evidence-anchor tools yet.

Required future additions:

- `list_project_evidence_anchors`;
- `read_project_evidence_anchor`;
- `list_project_evidence_anchor_revisions`;
- `read_project_evidence_anchor_revision`;
- `list_report_evidence_anchors` or include evidence-anchor trace in report
  reads.

These should remain read-only at first. Write/mutation tools for anchors are a
separate product decision because source evidence can change calculator
answers.

Assistant behavior contract:

- if it sees only a preset, it says "preset only";
- if it sees an active evidence anchor, it can say which values, basis, and
  provenance are stored;
- if it sees a report source trace, it can explain whether the report used a
  global exact source, project evidence anchor, compatible delta, or formula
  route;
- it must not infer evidence from a target value or source-reference note.

## Source Evidence Tiers

The external research and current code suggest explicit evidence tiers.

### Tier A - laboratory report

Typical contents:

- named laboratory or accredited testing body;
- report number;
- issue date;
- measurement method such as ISO 10140-2 or ASTM E90;
- rating method such as ISO 717-1 or ASTM E413;
- full specimen construction;
- metric values, ideally with spectrum/adaptation terms;
- uncertainty/tolerance when available.

Use:

- eligible for active project/user exact anchor;
- eligible for later global promotion after review and tests;
- compatible delta only after construction boundary and metric basis are
  proven.

### Tier B - manufacturer system table/manual

Typical contents:

- system name;
- declared `Rw`/`STC` or similar value;
- short construction summary;
- sometimes missing lab report number, uncertainty, or full band data.

Use:

- can be saved as a project/user reference;
- can be active exact-only if the user deliberately accepts source limits;
- should not be globally promoted without source review;
- should not power variant delta unless the exact reduced stack is fully
  canonicalized.

### Tier C - user-entered measured value

Typical contents:

- user-provided metric and value;
- project context;
- maybe a PDF/photo/source note;
- uncertainty often unknown.

Use:

- project scope by default;
- exact-only by default;
- no global promotion unless evidence is later attached and reviewed;
- no compatible delta until source quality and construction boundary are
  proven.

### Tier C2 - user-verified calculated result

Typical contents:

- calculator output generated for the current stack;
- no edited metric values;
- explicit user confirmation that this package should be treated as a
  reference for their project/user scope;
- stored construction snapshot, context, selected outputs, live values, and
  route basis trace.

Use:

- project or user scope only;
- exact-only by default;
- lower precedence than verified lab/manufacturer/user-measured source
  evidence;
- can be stronger than re-running a generic formula route for the same
  fingerprint because the user has deliberately asserted the result;
- no global promotion unless independent source evidence is later attached and
  reviewed;
- no compatible delta until a separate owner proves the same-family
  construction boundary and delta rule.

Not allowed:

- silent promotion of every calculator result;
- edited single-metric overrides in the first flow;
- storing under a measured/lab schema;
- using the package to infer unsupported or non-live metrics.

### Tier D - estimate, design target, or marketing claim

Examples:

- "target Rw 50";
- "expected STC 55";
- note in a preset description;
- assistant-generated statement.
- raw calculator output without explicit user verification.

Use:

- never an engine source anchor;
- can remain UI/report metadata;
- must not influence source matching.

## Refined Anchor Data Shape

The schema should separate user-facing record fields from calculator-facing
canonical fields.

User-facing fields:

- `name`;
- `description`;
- `anchorKind`: `measured_source_result | user_verified_calculated_result`;
- `sourceUrl`;
- `sourceDocumentRefs`;
- `sourceNotes`;
- `sourceQualityTier`;
- `labName`;
- `reportNumber`;
- `issueDate`;
- `createdFromPresetId`;
- `createdFromProjectId`;

Metric fields:

- `values`: array of finite live/source values;
- each value has `metric`, `metricBasis`, `valueDb`, and provenance;
- measured/source anchors include `sourceMode`;
- measured/source anchors include `measurementMethodStandard` and
  `ratingStandard` where applicable;
- user-verified calculated anchors include `resultBasisTrace` and the route
  calculation provenance used to produce the values;
- `frequencyBandBasis`: `one_third_octave | octave | single_number_only |
  calculated_curve | unknown`;
- `toleranceDb`;
- `uncertaintyPolicy`: `explicit | source_standard_typical | unknown`;

Lifecycle fields:

- `status`: `draft | active | conflict | retired | promoted`;
- `scope`: `project_evidence | user_evidence | team_evidence |
  verified_global`;
- `revision`;
- `createdAtIso`;
- `updatedAtIso`;
- `createdByLabel`;
- `retiredAtIso`;
- `retiredReason`;

Canonical fields:

- `snapshot`;
- `canonicalFingerprint`;
- `canonicalizationVersion`;
- `routePolicy`: `exact_only |
  exact_plus_compatible_exterior_board_delta`;
- `eligibleTargetOutputs`: outputs explicitly stored and opened by runtime
  owner tests;
- `rejectionReasons`: populated when validation blocks activation.

Runtime trace fields to store on reports:

- `anchorId`;
- `anchorRevision`;
- `anchorScope`;
- `anchorName`;
- `anchorKind`;
- `anchorValuesUsed`;
- `anchorSourceMode`;
- `anchorBasis`;
- `runtimeUse`: `exact_full_stack | compatible_delta | rejected |
  not_considered`;
- `deltaDb` when applicable;
- `finalValueDb` when applicable;
- `assumptions`;
- `rejectionReasons`.

## UI Field Explanations

The corrected first flow is not a measurement form. It captures the current
live calculated result package after explicit user confirmation and does not
offer metric/value edit fields.

Suggested copy for the corrected flow:

- `Save current result as verified reference`: "Use the current live calculator
  result as a project/user reference because you know this result is correct
  for this construction."
- Confirmation: "This will store the current stack, context, live output
  values, and calculation basis as a verified reference. It will not save
  pending, needs-input, or unsupported values."

Separate measured/source entry forms can exist later. Those forms should be
compact, but the metric fields need short helper text because users can
confuse lab, field, and target values.

Suggested copy:

- `Rw`: "Laboratory weighted sound reduction index for the separating element.
  Use this only for lab/source reports, not field room-to-room performance."
- `STC`: "ASTM single-number rating. Do not enter this as Rw unless the source
  also reports Rw or the conversion is separately owned."
- `Measurement method`: "How the measurement was made, for example ISO
  10140-2 or ASTM E90."
- `Rating standard`: "How the single-number value was derived, for example ISO
  717-1 or ASTM E413."
- `Tolerance / uncertainty`: "How much uncertainty the source reports. If
  unknown, the anchor is exact-only until reviewed."
- `Scope`: "Project anchors affect only this project. User anchors can be
  reused across your workspace. Global anchors require review."
- `Source quality`: "Lab report, manufacturer table, user measurement, or
  target/design note. Target notes cannot become calculator anchors."

UX rule:

- Put these as inline helper text or tooltips beside fields, not as a large
  explanatory wall in the calculator surface.

## Conflict and Precedence Policy

Conflict examples:

- same canonical fingerprint, same metric, different `Rw` value;
- same source document uploaded twice with different extracted values;
- project anchor and user anchor both match the same stack;
- built-in global source and project source both match the same stack.

Recommended behavior:

- exact duplicate value can dedupe or show as duplicate;
- same fingerprint with different value creates `conflict`, not active source;
- built-in global source wins by default;
- project override is allowed only if the user explicitly selects it and the
  result trace says a project override was used;
- user-scope anchors are lower precedence than project-scope anchors inside a
  selected project;
- retired anchors never participate in new estimates but remain visible in
  old report provenance.

Do not use "latest updated wins". That would make source evidence unstable and
hard to audit.

## Readiness Checklist Before Runtime Work

Implementation should not start changing estimates until these are true:

- schema distinguishes preset, assembly, report, measured/source anchor, and
  user-verified calculated anchor;
- evidence anchor status lifecycle is explicit;
- canonical fingerprint tests cover UI-only vs calculation-relevant changes;
- project/user scope precedence is documented in tests;
- conflict handling blocks activation;
- assistant read contract includes evidence anchors;
- report source trace shape is defined;
- exact-match bridge has negative tests before UI exposure.

## Research Notes Added After Standards Review

The standards/source review changes the design in three concrete ways:

1. `measurementMethodStandard` and `ratingStandard` must be separate fields.
   ISO 10140-2 / ASTM E90 describe measurement methods; ISO 717-1 / ASTM E413
   describe single-number rating methods.
2. `sourceMode` must be explicit. Lab values and field values are different
   evidence classes because field results include real-building effects such
   as flanking and installation conditions.
3. uncertainty is not optional noise. If uncertainty is unknown, the source can
   still be stored, but its policy should default to `exact_only` and should
   not power variant calculations.

This aligns with the repo north star: use exact measured/source rows only when
they truly match; use bounded delta only when the construction boundary is
proven; otherwise use owned physics or return `needs_input`.
