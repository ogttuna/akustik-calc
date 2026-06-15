# Project/User Measured Source Anchor Plan - 2026-06-15

## User Intent

The user wants presets to remain lightweight starter layer combinations by
default, but also wants an explicit path for a saved preset plus measured
result to become a calculator source anchor.

Target product flow:

1. A user saves a layer combination as a preset.
2. The preset does not automatically affect engine source matching.
3. The user can attach a measured value, for example `Rw = 50`, with metric
   basis, source notes, standard, tolerance, and project context.
4. The user explicitly clicks an action such as `Save measurement as engine
   anchor`.
5. After validation, the measured preset becomes a scoped exact source anchor
   that the calculator can use for exact matches.
6. Later, tightly controlled variants, such as a compatible exterior board
   added to the same wall family, can use the measured anchor plus a bounded
   calculated delta when the construction boundary is proven.

This is meant to increase calculator capability over time. It is not a broad
source crawl, not a formula retune, and not a path where every preset silently
becomes calculator truth.

## Why This Is High ROI

- Repeated project assemblies can return measured values instead of generic
  formula estimates.
- User/project libraries become calculator evidence, not only convenience
  templates.
- Exact source coverage grows organically where users have real measurements.
- Common measured systems can later be promoted from project/user scope into a
  verified global catalog after review and tests.
- Assistant/MCP flows can explain and reuse previous measured project systems.
- The existing engine already has exact-source and compatible anchor-delta
  concepts, so the feature can extend a proven pattern instead of inventing a
  new calculation class.

The ROI depends on strict boundaries. If every preset becomes a source row, the
calculator can become noisy and misleading. If only measured, scoped,
canonicalized anchors are admitted, this becomes a durable accuracy asset.

## Current Runtime Evidence

Read-only validation was run on 2026-06-15.

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

- Measured anchor plus bounded delta exists and works for a narrow built-in
  verified wall source family.
- It is not currently connected to Workbench V2 user presets or project/user
  measured source rows.
- The existing boundary behavior is good: an unsafe cavity insertion does not
  silently reuse the measured anchor.

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
  metadata until a separate measured-source-anchor flow captures exact source
  evidence, canonical material identity, metric basis, tolerance, and conflict
  policy.
- This is exactly why the measured anchor feature must be explicit. A user
  clicking `Save preset` should not create an engine source row; only an
  explicit `Save measurement as calculator anchor` flow may do that after
  validation.

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

It does not yet accept a project/user airborne measured source anchor list.

Existing compatible anchor-delta is hard-bound to verified engine source rows,
for example `knauf_lab_416889_primary_2026`. It is not a generic resolver over
user-saved presets.

## Required Product Model

Presets and measured anchors must be separate concepts.

Preset:

- reusable draft layer combination;
- can be edited freely;
- does not change calculator source precedence;
- can exist without measured values.

Measured source anchor:

- immutable or revisioned evidence record derived from a preset snapshot;
- includes measured metric values and basis;
- participates in exact source matching;
- scoped to project/user/global verification level;
- never created implicitly.

Recommended scope enum:

- `project_measured`: valid only inside one project workspace;
- `user_measured`: valid for one user's personal library;
- `team_measured`: valid for a team/org library if access rules exist;
- `verified_global`: reviewed built-in source row with repo tests.

## Measured Source Anchor Data Shape

Minimum fields:

- `id`: stable source id, not the preset id;
- `scope`: `project_measured | user_measured | team_measured | verified_global`;
- `sourceStatus`: `draft | active | retired | promoted`;
- `sourceLabel`;
- `sourceDescription`;
- `sourceUrl` or attachment references when available;
- `createdFromPresetId`;
- `createdFromProjectId` when project scoped;
- canonical `snapshot` of layers, context, custom materials, and material
  visual overrides;
- `metric`: initially `Rw` for this wall route;
- `metricBasis`: `lab_rw`;
- `measurementMethodStandard`: for example `ISO 10140-2`, `ASTM E90`, or
  `source_report_unknown`;
- `ratingStandard`: for example `ISO 717-1`, `ASTM E413`, or
  `source_report_unknown`;
- `sourceMode`: `lab | field`;
- `valueDb`;
- `toleranceDb`;
- `confidencePolicy`: not a vague confidence label, but a route policy such as
  `exact_only` or `exact_plus_compatible_exterior_board_delta`;
- `fingerprint`;
- `canonicalizationVersion`;
- revision fields: `createdAt`, `updatedAt`, `createdBy`, `revision`.

Initial version should support airborne wall `Rw` first. Field/building
metrics must stay separate because `Rw`, `R'w`, `Dn,w`, and `DnT,w` are not
aliases.

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
2. Active project measured anchors.
3. Active user/team measured anchors allowed in the current project.
4. Compatible measured-anchor delta if exact match fails but a strict reduced
   stack exact match exists.
5. Owned formula/physics route.
6. `needs_input` or `unsupported` when the route is not owned.

Built-in verified global rows should normally outrank local rows unless the UI
lets the user explicitly select a project measurement override. Any override
must be visible in the result trace.

## Bounded Delta Eligibility

Do not let every measured source anchor power variants.

Initial eligible variant:

- wall only;
- lab `Rw` only;
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
- `STC`, `C`, `Ctr` measured values assumed from an `Rw` source row;
- conflicting anchors for the same fingerprint.

## UI / UX Plan

Preset library should remain simple:

- `Save preset`;
- `Use preset`;
- optional details/description.

Measured anchor action should be deliberate:

- `Add measurement`;
- form asks for metric, value, basis, standard, tolerance, notes, source;
- validation preview shows the canonical stack and missing route-critical
  fields;
- final action: `Save measurement as calculator anchor`.

Badges:

- `Preset only`;
- `Project measured`;
- `User measured`;
- `Verified global`;
- `Inactive`;
- `Conflict`.

Result display:

- If exact measured anchor is used, show the source label and scope.
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
- measured anchors;
- anchor revisions;
- exact match status;
- runtime source used in a report;
- anchor-delta assumptions and rejected reasons.

The assistant should never describe a preset as measured unless a measured
source anchor exists. It should be able to answer:

- which project anchors exist;
- which reports used which measured anchor;
- why an anchor did or did not match;
- whether a variant used bounded delta or a formula route.

## Implementation Phases

### Phase 1 - Plan and schema only

- Define source anchor domain model in shared/server storage.
- Add canonical fingerprint helper with tests.
- Keep engine runtime unchanged.
- Add validation for metric basis and conflicts.

### Phase 2 - Project/User source storage

- Persist measured anchors separately from presets.
- Link anchors to preset snapshots and report/project records.
- Add revisioning and retirement.
- Add assistant-readable project source views.

### Phase 3 - Exact source resolver bridge

- Extend estimate request or server-side estimate assembly to include active
  project/user airborne measured source anchors.
- Convert source anchors into engine-compatible exact source rows.
- Exact match only; no variants yet.
- Add tests proving exact match wins and non-match falls back safely.

### Phase 4 - Compatible anchor-delta extension

- Generalize the existing compatible anchor-delta owner to accept validated
  project/user source anchors where eligible.
- Keep the initial variant scope to exterior added boards.
- Add negative tests for cavity inserted boards, topology changes, metric-basis
  mismatches, and conflicting anchors.

### Phase 5 - UI integration

- Add `Add measurement` and `Save measurement as calculator anchor` flows.
- Show badges and result provenance.
- Keep preset-only usage unchanged.
- Add browser tests for exact match, conflict, and rejected anchor UX.

### Phase 6 - Promotion workflow

- Add admin/review path from project/user anchor to verified global candidate.
- Promotion requires source evidence, canonical mapping review, tolerance
  policy, negative boundaries, and repo tests.
- Do not auto-promote based only on frequency.

## Test Plan

Engine tests:

- exact project anchor returns measured `Rw`;
- exact user anchor returns measured `Rw` when allowed by scope;
- built-in verified exact source precedence is stable;
- conflicting source anchors do not silently pick a winner;
- source anchor with missing topology is rejected;
- source anchor with metric-basis mismatch is rejected;
- exterior board variant applies bounded delta;
- interior/cavity board variant is `needs_input` or unsupported;
- field/building outputs are not aliased from lab `Rw`.

Web/server tests:

- preset save does not create source anchor;
- measured source save requires explicit action;
- source anchor persists with snapshot and revision;
- estimate payload/server resolver includes active anchors only;
- inactive/retired anchors are excluded;
- report stores which anchor/basis was used.

UI tests:

- preset-only row is visually distinct from measured anchor;
- source anchor form explains metric/basis fields;
- conflict state is visible and blocks silent activation;
- result panel shows exact measured provenance;
- result panel shows anchor-delta provenance.

Assistant/MCP tests:

- assistant can list project measured anchors;
- assistant can explain a report's measured source basis;
- assistant can show anchor revisions;
- assistant does not claim measured evidence for preset-only records.

## Risks

- Bad measurements can pollute calculator results if activation is too easy.
- Global source promotion can become a source-crawl distraction.
- Exact matching can be brittle if fingerprints include UI-only fields.
- Exact matching can be unsafe if fingerprints omit topology-critical fields.
- Metric basis confusion can create wrong `Rw` / `R'w` / `DnT,w` answers.
- Variant delta can overreach if it accepts non-exterior or topology-changing
  edits.

Mitigation:

- source anchors are inactive until validation passes;
- default scope is project/user, not global;
- exact match first, variants later;
- strict canonicalization versioning;
- explicit conflict UI;
- result provenance always visible.

## Current Recommendation

This should be treated as a high-ROI calculator infrastructure feature, but
not as a quick preset storage tweak.

Recommended next action:

1. Implement shared measured source anchor schema and canonical fingerprint
   tests.
2. Keep calculator runtime unchanged in that first step.
3. Then add exact-match bridge for project/user anchors.
4. Only after exact-match behavior is proven, extend compatible anchor-delta.

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

This is the right shape to extend, but the extension must not simply dump
presets into this static catalog. Project/user measurements need a separate
resolver and scope policy, then can be adapted into the same internal source
match shape for exact-match use.

### Existing compatible anchor-delta path

The current compatible measured-anchor delta path lives in
`packages/engine/src/post-v1-wall-compatible-anchor-delta.ts`.

Important implementation details:

- The direct Rw delta candidate removes only compatible exterior board layers
  from one or both outside faces, then checks whether the reduced stack has an
  exact verified lab `Rw` source match.
- The current delta is bounded: added-board mass law movement is damped and
  clamped, then the direct curve is shifted to the measured anchor plus the
  calculated delta.
- Unsafe edits, such as inserting a board inside the cavity, do not satisfy
  this path because the reduced stack no longer represents the same proven
  construction boundary.
- Lab companion expansion for `STC`, `C`, and `Ctr` is intentionally narrower
  than direct Rw delta today. It is hard-gated to the known
  `knauf_lab_416889_primary_2026` source id.

Design implication:

- Phase 3 should bridge user/project anchors into exact `Rw` only.
- Phase 4 may generalize the direct exterior-board Rw delta to validated
  project/user anchors.
- Phase 4 should not immediately generalize lab companion outputs unless a
  separate test owner proves the companion route for non-built-in anchors.

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

There is no airborne project/user measured source anchor input yet.

This means the feature cannot be completed by UI storage alone. The
implementation needs one of these explicit bridges:

1. extend the shared estimate request with active airborne source anchors; or
2. keep the public request unchanged and have the server-side estimate route
   resolve active project/user anchors into the engine call.

Preferred initial bridge:

- server-side route loads active project/user anchors for the current
  workspace/session;
- validates them through shared schema;
- passes only active, scoped, conflict-free anchors to the engine;
- engine receives a narrow `airborneSourceAnchors` input, not arbitrary preset
  records.

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
  effects. Project measured anchors therefore need `sourceMode: "lab" |
  "field"` and must not convert lab `Rw` into field `R'w`, `Dn,w`, or `DnT,w`
  by relabeling.
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

Yes, if implemented as a measured-source pipeline rather than a preset
shortcut.

How it helps:

- Exact project measurements become first-class evidence. The same
  construction can return the measured value without waiting for a global
  catalog import.
- Repeated hotel/school/office projects can reuse known measured assemblies
  with visible provenance.
- The assistant can explain why a report used a project measurement, a global
  source, a bounded delta, a formula route, or `needs_input`.
- Over time, high-quality repeated project anchors can become candidates for
  reviewed global source rows, with tests and source provenance already
  attached.
- The existing engine result trace already has source-anchor concepts, so the
  UI and assistant can expose a path that the engine understands.

Where it will not help:

- It will not make unknown custom materials physically known unless the anchor
  is an exact full-system measurement or the material has route-required
  physical inputs.
- It will not justify broad Siniat/Knauf/British Gypsum source crawling.
- It will not make field metrics available from a lab `Rw` alone.
- It will not safely predict arbitrary layer edits. Only proven compatible
  deltas can use a measured anchor.

## Required Boundaries Before Implementation

### Preset vs anchor boundary

Never treat a saved preset as a source row.

Allowed:

- preset saved for reuse;
- user explicitly adds measurement;
- frozen snapshot becomes measured anchor;
- active anchor participates in matching.

Not allowed:

- every preset becomes engine evidence;
- preset target value becomes source truth;
- edited preset mutates an already active measured anchor.

### Metric basis boundary

Initial supported measured source anchor:

- element lab wall `Rw`;
- rating standard `ISO 717-1` or explicit equivalent when source evidence
  supports it;
- measurement method such as `ISO 10140-2`, `ASTM E90`, or
  `source_report_unknown`.

Parked for later:

- `R'w`, `Dn,w`, `DnT,w`, `DnT,A`, `STC`, `ASTC`, `C`, `Ctr` as measured
  anchors unless explicitly supplied and independently validated;
- impact metrics;
- floor/ceiling anchors;
- field/building anchors.

### Scope boundary

Default activation scope should be the smallest useful scope:

1. project measured anchor;
2. user measured anchor;
3. team measured anchor;
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
  tolerances. User measured anchors should start stricter than the global
  catalog and only widen after a dedicated test owner proves the tolerance.

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

- shared domain schema for measured source anchors;
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

### Phase 3 - Exact source bridge

Files likely involved:

- shared estimate schema or server estimate adapter;
- engine exact source resolver adapter;
- workbench estimate payload or route layer;
- focused engine/server tests.

Rules:

- exact match only;
- wall lab `Rw` only;
- active scoped anchors only;
- conflict-free anchors only;
- built-in verified source precedence stays stable unless user explicitly
  selects a project override;
- result trace must show anchor id, label, scope, value, metric basis, and
  source mode.

Negative tests:

- non-matching layer order/context falls back to formula/needs_input;
- inactive anchor ignored;
- retired anchor ignored;
- conflicting same-fingerprint anchors blocked;
- lab `Rw` anchor does not create `R'w` or `DnT,w` by alias.

### Phase 4 - UI flow

UI goals:

- keep calculator usable without projects;
- keep preset library simple;
- only show measured-source controls when user asks to save a measurement;
- avoid cluttering the workbench top area.

Flow:

1. User saves or selects a preset.
2. User clicks `Add measurement` / `Save measurement as calculator anchor`.
3. A focused dialog asks for metric, value, measurement method, rating
   standard, tolerance/uncertainty, scope, source URL/attachment, and notes.
4. Dialog shows a compact construction preview and validation issues.
5. User confirms active anchor creation.
6. Result panel shows whether this anchor was used.

UI constraints:

- no large always-open project/anchor panel in the workbench;
- use badges and compact provenance rows;
- long source labels and notes must wrap without layout shift;
- destructive actions like retire/delete need confirmation;
- conflicts must block activation instead of becoming warnings hidden in logs.

### Phase 5 - Assistant/MCP visibility

Assistant must be able to read:

- measured anchor list by project/user scope;
- anchor detail and frozen snapshot;
- anchor revisions and retired status;
- reports that used an anchor;
- runtime source anchor trace for a report;
- rejected match diagnostics where stored.

Assistant must not:

- mutate anchors unless a separate write contract is explicitly designed;
- infer that a preset is measured;
- promote project/user anchors to global catalog;
- claim field/building support from lab `Rw`.

### Phase 6 - Compatible measured-anchor delta

Only after exact source bridge is proven.

Initial allowed delta:

- wall;
- lab `Rw`;
- same exact reduced stack fingerprint;
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
  measured-anchor work explicitly requires it. This feature is wall airborne
  source infrastructure first.
- Keep `targetValue` on common presets as documentation/test metadata unless
  the user explicitly turns a preset snapshot into a measured anchor.
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

## Updated Recommendation After Iterations

Proceed, but in this order:

1. Schema, storage, and fingerprint tests.
2. Assistant read visibility for anchors.
3. Exact wall lab `Rw` project/user anchor bridge.
4. UI measurement creation flow.
5. Report provenance persistence.
6. Exterior-board bounded delta for validated user/project anchors.

Do not start with the UI button alone. That would create saved measurement
objects that the engine cannot safely consume. The first real implementation
step should make the anchor data model and fingerprint rules testable.

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

This means measured anchors do not need a separate database technology in the
first implementation. They can start as another project/user scoped JSON
record family with the same repository discipline.

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

This is useful input for measured anchors, but should not become the anchor
storage itself.

Reason:

- presets are mutable convenience templates;
- measured anchors need immutable/revisioned evidence;
- presets can be renamed without changing calculation identity;
- presets can be deleted without invalidating reports that already used a
  measured anchor derived from them.

Recommended link:

- measured anchor stores `createdFromPresetId` when applicable;
- measured anchor stores its own frozen canonical snapshot;
- if the preset is later edited or deleted, the measured anchor remains
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
There are no measured-anchor tools yet.

Required future additions:

- `list_project_measured_anchors`;
- `read_project_measured_anchor`;
- `list_project_measured_anchor_revisions`;
- `read_project_measured_anchor_revision`;
- `list_report_source_anchors` or include source-anchor trace in report reads.

These should remain read-only at first. Write/mutation tools for anchors are a
separate product decision because source evidence can change calculator
answers.

Assistant behavior contract:

- if it sees only a preset, it says "preset only";
- if it sees an active measured anchor, it can say which metric and basis are
  measured;
- if it sees a report source trace, it can explain whether the report used a
  global exact source, project exact source, compatible delta, or formula
  route;
- it must not infer measurement from a target value or source-reference note.

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

### Tier D - estimate, design target, or marketing claim

Examples:

- "target Rw 50";
- "expected STC 55";
- note in a preset description;
- assistant-generated statement.

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

- `metric`: initial allowed value `Rw`;
- `valueDb`;
- `sourceMode`: initial allowed value `lab`;
- `measurementMethodStandard`: `ISO 10140-2 | ASTM E90 |
  source_report_unknown`;
- `ratingStandard`: `ISO 717-1 | ASTM E413 | source_report_unknown`;
- `frequencyBandBasis`: `one_third_octave | octave | single_number_only |
  unknown`;
- `toleranceDb`;
- `uncertaintyPolicy`: `explicit | source_standard_typical | unknown`;

Lifecycle fields:

- `status`: `draft | active | conflict | retired | promoted`;
- `scope`: `project_measured | user_measured | team_measured |
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
- `eligibleTargetOutputs`: initially `["Rw"]`;
- `rejectionReasons`: populated when validation blocks activation.

Runtime trace fields to store on reports:

- `anchorId`;
- `anchorRevision`;
- `anchorScope`;
- `anchorName`;
- `anchorMetric`;
- `anchorValueDb`;
- `anchorSourceMode`;
- `anchorBasis`;
- `runtimeUse`: `exact_full_stack | compatible_delta | rejected |
  not_considered`;
- `deltaDb` when applicable;
- `finalValueDb` when applicable;
- `assumptions`;
- `rejectionReasons`.

## UI Field Explanations

The measurement form should be compact, but the metric fields need short
helper text because users can confuse lab, field, and target values.

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

- schema distinguishes preset, assembly, report, and measured anchor;
- measured anchor status lifecycle is explicit;
- canonical fingerprint tests cover UI-only vs calculation-relevant changes;
- project/user scope precedence is documented in tests;
- conflict handling blocks activation;
- assistant read contract includes measured anchors;
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
