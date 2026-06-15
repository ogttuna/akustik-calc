# DynEcho Material Editor Plan - 2026-06-12

Document role: planning, implementation tracking, and validation analysis for
a Material Editor feature. It records current code facts, repo constraints,
product intent, UX principles, data-model risks, landed scope, and sequenced
follow-ups so parallel agents can work without accidentally changing calculator
behavior or protected report output.

## User Intent

The requested feature is a system-level Material Editor:

- users can add new materials;
- users can edit existing material data;
- the UI asks for every value needed for the selected material type and
  calculation use case;
- users can edit the visual appearance of materials in the layer
  illustration, including colors;
- material edits should feel like part of the engineering workbench, not a
  marketing or library demo page.

The practical product goal is two-sided:

1. Calculation material data: users can define or adjust material properties
   used by layer stacks and acoustic calculations.
2. Visual material data: users can control how those materials appear in the
   construction-section illustration without polluting calculation formulas.

## Implementation Progress - 2026-06-12

Current landed Material Editor slice:

- `/workbench-v2` now has a dense Material Editor panel for seed inspection,
  project custom material create/edit/delete, seed-to-project-copy flow, and
  layer replacement confirmation;
- custom material definitions are built through `MaterialDefinitionSchema` and
  sent to `/api/estimate` as optional `materialCatalog` entries;
- `/api/estimate` rejects duplicate custom catalog ids and seed-id override
  attempts, then passes accepted project material catalogs into
  `calculateAssembly`;
- layer rows, material picker, local validation, illustration, report snapshot
  layer summaries, and estimate payloads resolve through the same derived
  seed+custom catalog;
- material appearance overrides for fill, side, stroke, and pattern colors stay
  outside `MaterialDefinition` and are applied to the rebuilt SVG layer groups
  and technical schedule rows;
- appearance editing now starts from cue-aware material defaults, persists only
  colors that differ from those defaults, resets instead of storing empty
  overrides when the user returns to defaults, and warns when fill, stroke, and
  pattern colors are too similar to read;
- calculation and appearance inputs now show compact field descriptions next to
  the controls, including density/rho, behavior, property source, porous flow
  resistivity, porosity, resilient dynamic stiffness, Young modulus, Poisson
  ratio, loss factor, notes, and illustration color roles; these descriptions
  are connected with `aria-describedby` so they do not pollute the accessible
  input labels;
- on narrow screens, the editor keeps the material browser first while browsing
  built-ins, but moves the editable detail form before the browser once a new or
  project material is being edited so manual data entry does not require
  scrolling through the full catalog first;
- the material browser now has source filters for all/project/built-in
  materials plus a category filter, so large seed catalogs stay scannable;
- `/workbench-v2` material editor state is persisted under
  `dynecho:workbench-v2:material-editor:v1` with guarded parsing for
  `customMaterials` and `materialVisualOverrides`;
- malformed persisted JSON loads as an empty editor state, invalid custom
  materials or visual overrides are dropped, and the editor surfaces a compact
  restore warning when entries were ignored;
- `/workbench-v2` now has a dedicated server project snapshot schema,
  `dynecho.workbench-v2.snapshot.v1`, covering study mode, layers, selected
  layer, selected outputs, context inputs, custom materials, and material visual
  overrides;
- the rebuilt workbench can save the current V2 material-aware state through
  `/api/projects/import-local`, list saved server projects, and restore the
  latest scenario payload from `/api/projects/:id`;
- server snapshot restore reuses the same material editor sanitizers as local
  storage, drops invalid custom material / visual override entries, falls back
  invalid context enums and fully invalid output selections to V2 defaults, and
  surfaces a compact restore warning instead of silently trusting stale
  payloads;
- `/api/estimate` now accepts optional project-local `materialCatalog` entries,
  rejects duplicate custom ids, rejects built-in seed id collisions, and passes
  accepted custom materials into `calculateAssembly`;
- Material Editor surface parity now covers the `/workbench-v2` helper path from
  custom project materials to estimate payload, engine live lab outputs, output
  row status/value formatting, and layer illustration visual override styles;
- Browser-level Material Editor save/load coverage now signs into
  `/workbench-v2`, creates a Rock Wool project copy, edits its illustration
  appearance colors, saves through the real server project routes, clears
  browser storage, reloads, and restores the server snapshot to verify the
  custom material and visual overrides survive outside localStorage; the same
  browser test now reads the restored SVG layer block custom properties
  `--layer-fill`, `--layer-side`, `--layer-stroke`, and `--layer-pattern`, so
  the actual layer illustration color surface is covered, not only the form
  fields.
- Browser-level Material Editor creation coverage now also creates a brand-new
  porous absorber from empty fields, verifies the density/behavior/flow
  resistivity helper copy is visible, fills the calculation-relevant values by
  hand, saves it as a project material, and assigns it to an active layer
  through the layer material picker.

Still intentionally not complete in this slice:

- global seed catalog editing is not supported; seed calculation edits must
  remain project-local copies because engine merge still skips duplicate seed
  ids;
- old workbench Zustand scenario persistence is not migrated or changed; the
  new V2 server snapshot path is additive and schema-marked;
- generated proposal/PDF visual output still uses its protected existing
  rendering path and does not inherit Material Editor color overrides;
- `/workbench-v2` snapshot restore keeps layers that reference missing custom
  material ids visible and recoverable; it does not silently remap them to a
  built-in material.

Validation recorded for this slice:

- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-editor-state.test.ts --maxWorkers=1`
  passed with 12 tests;
- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-editor-state.test.ts features/workbench-rebuild/material-editor-panel.test.ts --maxWorkers=1`
  passed with 14 tests;
- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-editor-panel.test.ts lib/calculator-api-validation.test.ts --maxWorkers=1`
  passed with 7 tests;
- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-project-snapshot.test.ts --maxWorkers=1`
  passed with 2 tests;
- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-editor-surface-parity.test.ts --maxWorkers=1`
  passed with 2 tests;
- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-editor-surface-parity.test.ts features/workbench-rebuild/workbench-v2-project-snapshot.test.ts features/workbench-rebuild/material-editor-state.test.ts features/workbench-rebuild/material-editor-panel.test.ts lib/server-project-routes.test.ts lib/calculator-api-validation.test.ts --maxWorkers=1`
  passed with 32 tests, including V2 material editor server snapshot round-trip
  and custom-material estimate/illustration surface parity;
- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-editor-panel.test.ts --maxWorkers=1`
  passed with 2 tests after adding field-description coverage;
- `pnpm exec vitest run packages/shared/src/api/estimate.test.ts --maxWorkers=1`
  passed with 2 tests;
- `pnpm --filter @dynecho/web exec eslint features/workbench-rebuild/material-editor-state.ts features/workbench-rebuild/material-editor-state.test.ts features/workbench-rebuild/material-editor-panel.tsx features/workbench-rebuild/material-editor-panel.test.ts features/workbench-rebuild/calculator-workbench.tsx app/api/estimate/route.ts lib/calculator-api-validation.test.ts`
  passed;
- `pnpm --filter @dynecho/web exec eslint features/workbench-rebuild/material-editor-surface-parity.test.ts features/workbench-rebuild/workbench-v2-project-snapshot.ts features/workbench-rebuild/workbench-v2-project-snapshot.test.ts features/workbench-rebuild/material-editor-state.ts features/workbench-rebuild/material-editor-state.test.ts features/workbench-rebuild/material-editor-panel.tsx features/workbench-rebuild/material-editor-panel.test.ts features/workbench-rebuild/calculator-workbench.tsx app/api/estimate/route.ts lib/calculator-api-validation.test.ts lib/server-project-routes.test.ts`
  passed with one pre-existing `moveLayerToTarget` dependency warning in
  `calculator-workbench.tsx`;
- `pnpm --filter @dynecho/web exec eslint features/workbench-rebuild/material-editor-panel.tsx features/workbench-rebuild/material-editor-panel.test.ts`
  passed;
- `pnpm exec eslint e2e/workbench-v2-material-editor.spec.ts` passed;
- `tmp_store=$(mktemp -d); DYNECHO_PROJECT_STORE_DIR="$tmp_store" PLAYWRIGHT_PORT=3169 pnpm exec playwright test e2e/workbench-v2-material-editor.spec.ts --config=playwright.config.ts; rc=$?; rm -rf "$tmp_store"; exit $rc`
  passed with 2 browser tests and removed the temporary server project store
  after the run;
- `tmp_store=$(mktemp -d); DYNECHO_PROJECT_STORE_DIR="$tmp_store" PLAYWRIGHT_PORT=3175 pnpm exec playwright test e2e/workbench-v2-material-editor.spec.ts --config=playwright.config.ts; rc=$?; rm -rf "$tmp_store"; exit $rc`
  passed with 3 browser tests, including desktop side-by-side layout, mobile
  browse-first/edit-first ordering, and Material Editor horizontal-overflow
  assertions;
- visual QA used Playwright against `/workbench-v2` at desktop `1440x1000` and
  mobile `390x844`, captured screenshots under
  `output/playwright/material-editor-uiqa/`, and found no Material Editor
  horizontal overflow in the filled properties or appearance states;
- `pnpm --filter @dynecho/shared lint && pnpm --filter @dynecho/shared typecheck`
  passed;
- `git diff --check` passed;
- earlier manual browser checks at `http://localhost:3010/workbench-v2` opened
  Material Editor, showed the Project snapshot controls with no console error,
  and an isolated localStorage restore probe showed a persisted custom material
  in the editor list after reload;
- `pnpm --filter @dynecho/web typecheck` still fails on existing unrelated
  workbench test type errors around `exactImpactSource`, `PresetId`,
  `BaseOutputCardModel` vs `OutputCardModel`, and missing proposal citation
  `tone`; no Material Editor file is named in that failure output.

## Repo And Product Guardrails

Current calculator docs start at
`docs/calculator/DOCUMENTATION_MAP.md`. The calculator goal is still to return
defensible outputs or explicit `needs_input` / `unsupported` boundaries. The
current selected calculator next action is
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`;
this Material Editor work must not rerank or modify that calculator route.

Current UI rebuild authority is
`docs/ui/DYNECHO_UI_REBUILD_MASTER_PLAN_2026-06-05.md`. Relevant rules for this
feature:

- frontend work must preserve calculator behavior unless a calculator/API scope
  is explicitly selected;
- endpoint contracts and shared schemas should not change in an incidental UI
  slice;
- generated/exported PDF output is protected unless a PDF-output task is
  explicitly opened;
- the calculator workbench is a dense engineering tool, not a landing page;
- layer illustration is an allowed legacy exception and may be improved;
- response graph and proposal/PDF builders are separate protected surfaces.

Material Editor implementation must therefore separate:

- local/UI-only visual overrides;
- material definitions that participate in calculation;
- server/API contract changes needed to make custom materials work in
  `/workbench-v2`;
- old proposal/PDF visuals, which should stay unchanged by default.

## Current Implementation Map

### Shared Material Model

Authoritative shared material shape:
`packages/shared/src/domain/material.ts`.

Current `MaterialDefinition` fields:

- `id`;
- `name`;
- `category`: `mass`, `finish`, `insulation`, `gap`, or `support`;
- `densityKgM3`;
- optional `acoustic`;
- optional `impact.dynamicStiffnessMNm3`;
- optional `notes`;
- `tags`.

Current acoustic behavior enum:

- `rigid_mass`;
- `panel_leaf`;
- `limp_mass_membrane`;
- `porous_absorber`;
- `air_cavity`;
- `resilient_layer`;
- `structural_bridge`;
- `mass_timber`.

Current acoustic property fields include:

- `densityKgM3`;
- `youngModulusPa`;
- `poissonRatio`;
- `lossFactor`;
- `flowResistivityPaSM2`;
- `porosity`;
- `absorberClass`;
- `limpMassBehavior`;
- `dynamicStiffnessMNm3`.

Important gap: `MaterialDefinition` has no visual/color fields. That is good
for calculation purity. Visual customization should not be added directly to
this shared calculation model unless there is a separate, explicit contract
decision.

### Layer Model

Layer input model:
`packages/shared/src/domain/layer.ts`.

`LayerInput` carries:

- `materialId`;
- `thicknessMm`;
- optional `floorRole`.

Thickness is a layer property, not a material property. The Material Editor
must not ask for default thickness as a required material value unless it is
clearly labeled as a workbench convenience/default, not a solver property.

### Seed Catalog

Seed materials live in:
`packages/catalogs/src/materials/seed-materials.ts`.

The default catalog export is `MATERIAL_CATALOG_SEED`. The engine material
lookup wraps this in:
`packages/engine/src/material-catalog.ts`.

### Engine Catalog Behavior

`packages/engine/src/calculate-assembly.ts` already accepts optional
`CalculateAssemblyOptions.catalog`.

However, the engine merges extra catalog entries through
`mergePredictorCatalog(...)`, which skips additions whose `id` already exists in
the base catalog. That means:

- new custom material ids can participate in calculation once the catalog is
  passed to the engine;
- editing a seed material using the same seed `id` will not override the seed
  inside the current engine merge path;
- seed material calculation edits should either create a project-local derived
  material id and remap affected layers, or a separate engine/API override
  contract must be designed and tested.

The lower-risk plan is to treat seed edits as project-local overrides with
derived ids when the edited physical properties must affect calculations.

### Old Workbench Custom Material Support

Existing custom material helpers:
`apps/web/features/workbench/workbench-materials.ts`.

Already available:

- `CustomMaterialDraft`;
- `createEmptyCustomMaterialDraft`;
- `validateCustomMaterialDraft`;
- `buildCustomMaterialDefinition`;
- `buildWorkbenchMaterialCatalog`;
- `getWorkbenchMaterialById`;
- `isCustomWorkbenchMaterial`.

Existing custom material creation asks for:

- name;
- category;
- density;
- optional dynamic stiffness for resilient/floor impact behavior;
- optional notes.

Existing limitations:

- no edit action for existing custom materials;
- no delete/archive/reset action;
- no seed material edit override flow;
- no acoustic behavior-specific form;
- no visual/color metadata;
- duplicate validation is name-oriented and local;
- no route-aware "required fields" explanation beyond basic density/dynamic
  stiffness checks.

### Workbench Store And Persistence

Store:
`apps/web/features/workbench/workbench-store.ts`.

Relevant state:

- `customMaterials: MaterialDefinition[]`;
- `addCustomMaterial`;
- `appendMaterial`;
- `updateMaterial`;
- row-level density override support through `densityKgM3`;
- row-level dynamic stiffness support through `dynamicStiffnessMNm3`.

Persistence uses Zustand local storage. `ScenarioSnapshot` also includes
`customMaterials`.

Server project snapshot parsing:
`apps/web/features/workbench/server-project-workbench-snapshot.ts`.

Current limitation: snapshots preserve `customMaterials`, but there is no
separate persisted visual override map and no dedicated validation/sanitization
for visual editor state.

### Rebuilt Workbench Status

Current rebuilt workbench:
`apps/web/features/workbench-rebuild/calculator-workbench.tsx`.

Facts:

- it keeps project-local `customMaterials` and `materialVisualOverrides` in V2
  component state and local Material Editor persistence;
- it derives the material picker, layer resolution, estimate payload, and
  illustration from the same seed+custom catalog;
- `buildEstimatePayload(...)` sends `layers`, contexts, calculator id, target
  outputs, and optional `materialCatalog` entries when project custom materials
  exist;
- fetch goes to `/api/estimate`;
- `buildIllustrationLayers(...)` resolves material appearance from the derived
  catalog and workbench-local visual overrides;
- project/server snapshot replay is implemented through
  `workbench-v2-project-snapshot.ts` and the schema id
  `dynecho.workbench-v2.snapshot.v1`.

Estimate API schema:
`packages/shared/src/api/estimate.ts`.

Estimate API route:
`apps/web/app/api/estimate/route.ts`.

Current API behavior:

- `EstimateRequestSchema` accepts optional `materialCatalog` entries parsed
  through `MaterialDefinitionSchema` with a practical project-local max length;
- duplicate material ids inside a request are rejected by the shared schema;
- the route rejects built-in seed id collisions and tells callers to create a
  project copy with a custom id;
- accepted project-local custom materials are passed to
  `calculateAssembly(..., { catalog })`;
- visual override data is not part of the estimate API contract.

Conclusion: true new project materials now flow from `/workbench-v2` to the
estimate route and engine catalog path. Built-in seed calculation edits remain a
copy-and-remap workflow because same-id seed overrides are intentionally
rejected.

### Layer Illustration And Color Sources

Cue inference:
`apps/web/features/workbench/simple-workbench-illustration.ts`.

Rebuilt illustration:
`apps/web/features/workbench-rebuild/professional-layer-illustration.tsx`.

Rebuilt CSS tokens:
`apps/web/app/globals.css`.

Current behavior:

- `LayerVisualMaterial` is a small pick of material `id`, `name`, `category`,
  and `tags`;
- `getIllustrationMaterialCue(...)` infers visual cue from material text and
  category;
- `professional-layer-illustration.tsx` renders layers with
  `.rebuild-layer-block[data-cue="..."]`;
- `globals.css` assigns CSS variables like `--layer-fill`, `--layer-side`,
  `--layer-stroke`, and `--layer-pattern` per cue;
- old/proposal construction figures use
  `apps/web/features/workbench/simple-workbench-layer-visuals.ts` and hardcoded
  cue/category surfaces.

Good insertion point:

- add a workbench-local visual override object keyed by `materialId`;
- pass the resolved visual profile to the rebuilt illustration;
- apply colors through inline CSS variables or a controlled class/style bridge;
- do not change old proposal/PDF rendering unless explicitly selected.

## Recommended Data Design

Keep calculation and illustration data separate.

## Architecture Decisions To Freeze Before Coding

The feature has three separable ownership domains. Keeping these domains
separate is the main way to avoid accidental calculator drift.

| Domain | User-visible job | Data owner | Can affect calculation? | First recommended storage |
| --- | --- | --- | --- | --- |
| Built-in catalog | curated seed materials | `packages/catalogs` | yes | read-only in the editor |
| Project custom material | user material definitions | workbench scenario/project state | yes, after API catalog contract | scenario/project snapshot |
| Material visual override | layer illustration appearance | workbench scenario/project state | no | scenario/project snapshot |

Decision defaults:

- built-in seed rows are not edited in place;
- editing a built-in material creates a project-local copy with a derived id;
- visual overrides are keyed by material id and stay outside
  `MaterialDefinition`;
- `/workbench-v2` should be the implementation target, but it must not claim
  solver-active custom materials until `/api/estimate` receives them;
- old workbench custom material support can be reused as evidence and helper
  logic, not as a UI baseline.

## Material Identity Policy

Material identity is more important than it first appears because layers store
only `materialId`.

Rules to enforce:

- `id` is immutable once a custom material is saved;
- display `name` is editable;
- user-created material ids use the existing `custom_...` pattern;
- seed-derived project copies should use a stable derived id, for example
  `custom_copy_<seed-id>_<slug>` or `custom_<slug>` with collision suffix;
- when a seed material is copied and used to replace the seed in active layers,
  remap only the layers the user confirms;
- never silently mutate every layer using a seed material just because the user
  edited a seed row in the library;
- duplicate material names are blocked or require an explicit suffix because
  current search/list UI is name-oriented.

Open technical detail: the existing engine catalog merge skips duplicate ids.
Until that changes, same-id seed overrides are not a reliable solver mechanism.

### Calculation Material

Use `MaterialDefinition` for solver-facing values.

Rules:

- custom material ids must be immutable after creation;
- user-facing name can change without changing id;
- custom material edits that affect solver values update the custom
  `MaterialDefinition`;
- seed material edits that affect solver values should create a derived custom
  material id and remap selected layers, unless a later engine contract supports
  seed overrides;
- every solver-facing material definition must pass
  `MaterialDefinitionSchema.parse(...)` before storage or API submission.

### Visual Profile

Add a workbench-local visual model instead of extending `MaterialDefinition`.

Suggested shape:

```ts
type MaterialVisualOverride = {
  materialId: string;
  cue?: IllustrationMaterialCue;
  fillColor?: string;
  sideColor?: string;
  strokeColor?: string;
  patternColor?: string;
  labelColor?: string;
  updatedAtIso: string;
};
```

Rules:

- visual overrides do not affect calculation;
- visual overrides are optional and sparse;
- clearing an override falls back to cue/category defaults;
- colors must be valid CSS colors or a stricter hex/rgb format;
- contrast should be checked for layer labels and schedule rows;
- visual overrides should be stored beside workbench scenario state, not in the
  seed catalog.

### Editor State

Suggested persisted state:

```ts
type WorkbenchMaterialEditorState = {
  customMaterials: MaterialDefinition[];
  materialVisualOverrides: MaterialVisualOverride[];
};
```

For backward compatibility, existing snapshots without
`materialVisualOverrides` should load as an empty override list.

## Material Form Matrix

The first editor version should ask for fields based on user intent, not expose
every possible schema field at all times.

| Intent / behavior | Required to save | Required for relevant calculations | Advanced optional fields | Notes |
| --- | --- | --- | --- | --- |
| Generic mass / rigid mass | name, category, density | density, thickness on layer | loss factor, Young's modulus, Poisson ratio | safe default for concrete/screed/masonry-like materials |
| Panel leaf / board | name, category, density | density, layer thickness | loss factor, Young's modulus, Poisson ratio | used by wall leaf routes and board-like cues |
| Limp mass membrane | name, category, density | density, layer thickness | limp mass behavior, loss factor | should not be confused with ordinary finish |
| Porous absorber | name, category, density, behavior | flow resistivity and/or absorber class when wall cavity ownership needs it | porosity, source notes | current direct-fixed/context absorptive cavity routes care about explicit absorber ownership |
| Air cavity / gap | name, category, behavior | cavity depth remains layer/context input | source notes | zero density may be valid only for true gap/support semantics |
| Resilient layer | name, category, density, behavior | dynamic stiffness for impact/floating floor paths | source/status notes | dynamic stiffness can also be supplied in context today; the editor should explain precedence |
| Structural bridge/support | name, category, density/zero-support decision | support topology/spacing stay in context | tags, source notes | do not move support spacing into material |
| Mass timber | name, category, density, behavior | density, layer thickness | Young's modulus, Poisson ratio, loss factor | should remain explicit; do not infer from "wood" label alone |

Form UX should start from a compact "Basic" section:

- name;
- category;
- acoustic behavior;
- density;
- notes/tags.

Then reveal behavior-specific panels:

- absorber properties;
- impact/resilient properties;
- structural/mechanical properties;
- appearance.

## Validation Semantics

The editor should expose validation in three levels:

1. Save-blocking schema validation: invalid numbers, missing name/category,
   invalid behavior, duplicate id/name, impossible color values.
2. Calculation-readiness validation: saved material is valid, but selected
   outputs may still require missing flow resistivity, dynamic stiffness, wall
   topology, room volume, or other context.
3. Visual-readiness validation: colors save, but contrast/pattern warnings tell
   the user if the illustration becomes hard to read.

Rules:

- "Save material" should only depend on schema validity.
- "Use for current calculation" should surface route-specific needs separately.
- A material can be saved even if it is not enough for a selected advanced
  route, as long as the UI does not hide the resulting `needs_input`.
- Invalid custom material data should never be sent to the estimate API.
- Invalid visual overrides should be dropped or blocked before persistence.

## Required Field Strategy

The editor should not show one giant required form. Required fields should be
driven by category, acoustic behavior, and intended calculation use.

Always required:

- material name;
- category;
- density, except where a route explicitly permits a zero-density gap/support
  material;
- acoustic behavior if the material is intended to do more than generic mass
  participation;
- stable id generated from name for new custom materials.

Usually optional but visible:

- notes;
- tags;
- source/status notes;
- default thickness, clearly labeled as a workbench insertion default, not a
  material property.

Behavior-specific requirements:

- `porous_absorber`: ask for flow resistivity, absorber class, and optionally
  porosity. Missing flow resistivity must be surfaced as calculation-relevant,
  because current wall cavity routes distinguish explicit absorber ownership.
- `resilient_layer`: ask for dynamic stiffness when floor impact outputs or
  resilient layer behavior are relevant.
- `air_cavity`: ask for category/behavior and allow density rules to differ
  from mass materials; cavity depth remains a layer/context value.
- `panel_leaf`, `rigid_mass`, `mass_timber`, `limp_mass_membrane`: ask for
  density and expose advanced mechanical fields such as Young's modulus,
  Poisson ratio, and loss factor only when needed by the chosen behavior or an
  advanced mode.
- `structural_bridge`: ask for category/tags/behavior and keep spacing/topology
  in layer/context inputs, not material definition.

The UI copy should distinguish:

- "required to save material";
- "required for selected outputs";
- "optional metadata";
- "visual only".

## UX Principles

Material Editor should live inside the workbench as an operational tool:

- use a drawer, side panel, or dedicated workbench panel, not a marketing page;
- provide searchable material list with category filters and custom/seed badges;
- support create, duplicate, edit, reset visual, and archive/delete for custom
  materials;
- editing seed material calculation values should clearly create a project copy
  rather than silently mutating the built-in seed;
- show a compact live swatch and a real layer-illustration preview;
- use color swatches and color inputs for visual fields;
- keep density, stiffness, flow resistivity, and acoustic fields unit-labeled;
- validate inline and disable Save until the material is valid;
- warn when edits affect layers currently used in the active stack;
- keep layout dimensions stable so validation messages and previews do not
  shift the workbench grid;
- avoid in-app tutorial prose; labels and tooltips should be enough;
- use icon buttons for duplicate, reset, delete/archive, and close actions;
- preserve desktop density and scanability.

Color UX rules:

- provide defaults from current cue/category system;
- allow reset to default cue colors;
- prevent transparent or near-invisible layer fills;
- show contrast warning when label/stroke colors become unreadable;
- keep patterns/textures available because color alone is not enough for
  material recognition.

## Implementation Plan

Status note for the current codebase: Phases 1 through 6 below and the first
Phase 7 surface-parity layer are now landed for `/workbench-v2` in bounded form.
The remaining open Material Editor scope is interactive browser hardening plus
any explicitly selected migration of old workbench scenarios or generated PDF
visuals. Keep the detailed steps below as the implementation checklist and
regression guide, not as proof that a listed task is still unimplemented.

### Phase 0 - Scope Decision

Decide whether the first implementation target is:

- visual-only material appearance editor for `/workbench-v2`;
- full editor for old workbench state first;
- full editor for `/workbench-v2`, including API contract work.

Recommendation: implement full `/workbench-v2` editor, but split it into
independent slices so visual overrides can land without calculator behavior
changes and calculation custom materials can land with explicit schema/API
tests.

### Phase 1 - Shared Workbench Material Utilities

Create a reusable material editor utility module in the web app, probably near:

- `apps/web/features/workbench/workbench-materials.ts`; or
- `apps/web/features/workbench-rebuild/material-editor-state.ts`.

Add:

- validation helpers around `MaterialDefinitionSchema`;
- material id generation and collision checks;
- edit/update helpers for custom materials;
- seed-to-derived-custom copy helper;
- visual override validation helpers;
- catalog resolution that can combine seed, custom, and visual overrides.

Do not change engine behavior in this phase.

### Phase 2 - Rebuilt Workbench Local State

In `apps/web/features/workbench-rebuild/calculator-workbench.tsx`, replace the
static module-level `MATERIALS`/`MATERIAL_BY_ID` dependency with state-derived
catalog helpers.

Minimum needs:

- state for `customMaterials`;
- state for `materialVisualOverrides`;
- derived `materials` list;
- derived `materialById`;
- layer material resolution that can see custom materials;
- persistence strategy, either local storage or scenario/project snapshot
  extension.

This phase can support list/search/create/edit UI, but calculation should remain
honest: if custom materials are not yet sent to `/api/estimate`, the UI must not
pretend they are solver-active.

Concrete rebuilt workbench changes:

- add `customMaterials` and `materialVisualOverrides` state near the existing
  `layers`, `context`, `materialSearch`, and `openMaterialLayerId` state;
- derive `materials` with `useMemo(() => buildWorkbenchMaterialCatalog(customMaterials), [customMaterials])`;
- derive `materialById` from that list;
- replace `getMaterial(...)`, `getDefaultMaterialId(...)`, and
  `getFilteredMaterials(...)` module helpers with helpers that accept the
  derived catalog/map, or move them inside the component as memoized callbacks;
- update `buildIllustrationLayers(...)` to receive material resolver and visual
  override resolver as inputs rather than reaching for module-level
  `MATERIAL_BY_ID`;
- include `customMaterials` in the estimate payload only after Phase 5;
- keep `materialSearch` keyed by layer id so opening the material editor does
  not break existing row picker behavior.

Do not leave both static and state-derived material maps active. That would make
the picker, illustration, and estimate payload disagree.

### Phase 3 - Visual Overrides In Illustration

Extend rebuilt illustration inputs so each visual layer can carry an optional
visual override/profile.

Likely touch points:

- `apps/web/features/workbench/simple-workbench-illustration.ts`;
- `apps/web/features/workbench-rebuild/professional-layer-illustration.tsx`;
- `apps/web/app/globals.css`;
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.

Preferred approach:

- keep cue inference as default;
- add an optional style object/visual profile;
- set CSS variables on `.rebuild-layer-block` for overridden colors;
- preserve cue-based texture/pattern behavior unless explicitly overridden.

Specific render hook:

- `professional-layer-illustration.tsx` currently emits
  `.rebuild-layer-block` groups with `data-cue`;
- `globals.css` defines `--layer-fill`, `--layer-side`, `--layer-stroke`, and
  `--layer-pattern` on both `.rebuild-layer-block[data-cue]` and
  `.rebuild-layer-schedule-row[data-cue]`;
- a visual override can therefore become a React `style` object on the SVG
  group and matching schedule row;
- use CSS custom properties, not new hardcoded per-material classes.

Suggested helper:

```ts
function buildMaterialVisualStyle(
  override: MaterialVisualOverride | null
): CSSProperties | undefined {
  if (!override) return undefined;
  return {
    "--layer-fill": override.fillColor,
    "--layer-side": override.sideColor,
    "--layer-stroke": override.strokeColor,
    "--layer-pattern": override.patternColor
  } as CSSProperties;
}
```

The helper should omit unset fields so cue defaults still fill the gaps.

Do not change `simple-workbench-proposal-construction-figure.tsx` or generated
PDF builders in this phase.

### Phase 4 - Material Editor UI

Add a production workbench editor surface:

- material library list with filters/search;
- detail form;
- required-field validation;
- visual customization panel;
- duplicate-from-seed flow;
- edit custom material flow;
- reset visual override;
- archive/delete custom material if not used, or guarded delete with layer
  reassignment.

The UI should make "Calculation" and "Appearance" sections distinct.

Recommended UI structure:

- command entry point near layer/material controls: "Materials" button with an
  icon, not a large explanatory card;
- left column/list: search, category filters, seed/custom badges, selected
  material;
- right panel: tabs or segmented control for `Properties` and `Appearance`;
- footer: Save, Duplicate, Reset visual, Delete/Archive custom material;
- inline use count: show how many active layers use the material;
- active-layer affordance: from a layer row, "Edit material" opens the editor on
  that layer's material.

Guarded actions:

- editing a custom material can update it in place;
- editing a seed material opens "Create project copy" first;
- deleting a custom material is blocked while active layers reference it;
- archiving a custom material hides it from the picker only when no active layer
  references it;
- changing a material's behavior/category should show a short impact warning if
  the active stack uses it.

### Phase 5 - API Contract For Solver-Active Custom Materials

This phase changes endpoint/shared contract and should be selected explicitly.

Proposed request extension:

```ts
const EstimateRequestSchemaInternal = z.object({
  // existing fields...
  materialCatalog: z.array(MaterialDefinitionSchema).optional()
});
```

Then route:

```ts
const result = calculateAssembly(payload.layers, {
  // existing options...
  catalog: payload.materialCatalog ?? []
});
```

Important policy:

- send only custom/derived materials, not the whole seed catalog;
- do not rely on same-id seed overrides because engine merge currently skips
  duplicate ids;
- if same-id overrides are required, design and test a separate override merge
  rule rather than slipping it into this feature.

Tests should prove:

- custom material id resolves in `/api/estimate`;
- unknown material id still fails closed;
- duplicate seed id in `materialCatalog` does not silently override unless a
  deliberate contract says it should;
- old seed-only requests keep identical outputs.

Request hygiene:

- parse every submitted material through `MaterialDefinitionSchema`;
- cap `materialCatalog` length to a practical project-local bound;
- reject duplicate custom ids in the request;
- reject ids that collide with seed ids unless the explicit derived-copy policy
  is being used;
- do not accept visual override data in `EstimateRequestSchema`;
- keep API error messages consistent with existing calculator validation
  payloads.

### Phase 6 - Persistence And Snapshots

Extend snapshot/state schema carefully:

- existing snapshots without editor fields load cleanly;
- custom material definitions parse through `MaterialDefinitionSchema`;
- visual overrides parse through a small local schema;
- invalid visual override entries are dropped or reported without breaking the
  whole scenario;
- saved project replay keeps custom material calculation and illustration
  appearance aligned.

Snapshot shape policy:

- keep existing `customMaterials` for old workbench compatibility;
- add `materialVisualOverrides` as optional;
- if `/workbench-v2` gets its own persisted scenario shape, document the schema
  id before adding fields;
- use explicit migration/defaulting instead of assuming local storage contains
  current data;
- when restoring a scenario, if a layer references a missing custom material,
  show a recoverable warning and keep the layer blocked instead of swapping it
  silently to a seed default.

### Phase 7 - Surface Parity And Report Boundary

After Material Editor is solver-active, add parity tests around:

- workbench live calculation using a custom material;
- saved replay using the same custom material;
- server snapshot replay;
- output cards/status staying honest;
- layer illustration rendering custom visual colors.

Do not add generated PDF color changes unless the user explicitly opens that
scope. If later requested, plan PDF visual parity separately because it touches
protected proposal output.

## Implementation Slice Recommendation

The original safest implementation sequence was:

1. Add material editor utility tests and helpers without changing UI.
2. Add `/workbench-v2` state-derived catalog resolution, still seed-only by
   default.
3. Add visual override state and pipe it into the rebuilt illustration.
4. Add the Material Editor UI for visual overrides and custom material drafts,
   with solver-active custom materials clearly gated.
5. Add API/schema catalog payload support and turn custom materials solver-active
   in `/workbench-v2`.
6. Add saved/server replay tests for custom materials and visual overrides.

This keeps the first visible win, editable layer colors, in the frontend-only
lane, while the calculation-affecting material path gets its own explicit
contract slice.

Current slice status: steps 1 through 6 above have landed for `/workbench-v2`.
The first Phase 7 surface-parity layer now covers server snapshot round-trip,
live estimate payloads, output status honesty, and illustration color
persistence at helper/route level. The remaining recommended hardening is an
interactive browser save/load flow and any explicitly selected generated PDF
visual parity, while keeping generated PDF output outside the default scope.

## Step-By-Step Implementation Playbook

This playbook is written for the agent that will implement the feature. Follow
the steps in order unless a later handoff explicitly selects a narrower slice.
Each step lists the implementation detail and the things that need extra care.

### Step 0 - Preflight And Collision Audit

Goal:

- confirm the current repo state and avoid overwriting parallel calculator work.

Touch points:

- no source edits yet.

Implementation notes:

- read `AGENTS.md` and `docs/calculator/DOCUMENTATION_MAP.md` before any
  calculator/API-facing change;
- run `git status --short`;
- identify unrelated modified files before editing;
- if shared schema/API is not selected, keep the work inside web/UI files and
  this plan.

Watch points:

- current calculator handoff is not this Material Editor feature;
- do not touch `packages/engine/src/post-v1-*`, calculator handoff docs, or
  `tools/dev/run-calculator-current-gate.ts` from a Material Editor UI slice;
- do not revert modified files from other agents;
- do not edit generated build output or untracked artifact folders.

Validation:

- no validation command is needed before edits, but record the dirty files you
  did not touch in the final handoff.

### Step 1 - Add Material Editor Helper Layer

Goal:

- create tested helper functions before UI code starts depending on them.

Touch points:

- `apps/web/features/workbench/workbench-materials.ts`; or
- new `apps/web/features/workbench-rebuild/material-editor-state.ts`;
- focused helper test file near the chosen module.

Implementation notes:

- import and use `MaterialDefinitionSchema` from `@dynecho/shared`;
- keep draft values as strings in UI-facing draft types;
- normalize numeric input in one helper so comma-decimal and whitespace behavior
  stays consistent with existing workbench density handling;
- add helpers for:
  - create custom material draft;
  - validate material draft;
  - build custom material definition;
  - update custom material definition;
  - build seed-derived project copy;
  - validate visual override;
  - resolve custom/seed catalog;
  - count active layer usage for a material id.

Watch points:

- do not put visual fields on `MaterialDefinition`;
- do not add `dynamicStiffnessMNm3` into `acoustic`; the current schema stores
  it under `impact.dynamicStiffnessMNm3`;
- do not import engine code into web helper modules;
- do not mutate `MATERIAL_CATALOG_SEED`;
- custom material `id` must remain immutable after creation.

Validation:

- add unit tests for valid/invalid density, dynamic stiffness, flow
  resistivity, duplicate names, duplicate ids, seed-derived copy ids, and visual
  color validation.

### Step 2 - Refactor `/workbench-v2` To Use A Derived Catalog

Goal:

- make rebuilt workbench resolve materials from state without changing runtime
  behavior yet.

Touch points:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.

Implementation notes:

- add `customMaterials` state near existing `layers`, `context`, and
  `materialSearch`;
- derive `materials` from `buildWorkbenchMaterialCatalog(customMaterials)`;
- derive `materialById` from `materials`;
- replace module-level `MATERIALS` and `MATERIAL_BY_ID` use in:
  - `getMaterial`;
  - `getDefaultMaterialId`;
  - `getFilteredMaterials`;
  - layer row material pickers;
  - `buildIllustrationLayers`;
- pass resolver inputs into helpers instead of allowing helpers to close over
  stale module constants.

Watch points:

- do not leave static seed map and state-derived map both active;
- do not silently replace an unknown custom material id with the first seed
  material during restore; surface a blocked/recoverable state instead;
- keep `materialSearch` keyed by layer id so existing row picker behavior stays
  stable;
- do not include `customMaterials` in `/api/estimate` until Step 8/9.

Validation:

- with `customMaterials` empty, seed-only UI and estimate payload should be
  unchanged;
- targeted rebuilt workbench tests should prove seed material selection still
  works.

### Step 3 - Add Visual Override Model And Plumbing

Goal:

- enable layer illustration color customization without touching calculation.

Touch points:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`;
- `apps/web/features/workbench-rebuild/professional-layer-illustration.tsx`;
- `apps/web/app/globals.css` only if a minimal CSS hook is needed;
- helper/test module from Step 1.

Implementation notes:

- add `materialVisualOverrides` state keyed by material id;
- extend `ProfessionalLayerIllustrationLayer` with optional visual style or
  visual override data;
- let cue inference remain the default path;
- convert override values into CSS custom properties:
  - `--layer-fill`;
  - `--layer-side`;
  - `--layer-stroke`;
  - `--layer-pattern`;
- apply the same style object to SVG layer groups and schedule rows.

Watch points:

- visual overrides must not become part of `EstimateRequest`;
- visual overrides must not be saved inside `MaterialDefinition`;
- do not remove `data-cue`; textures and category defaults depend on it;
- do not touch `simple-workbench-proposal-construction-figure.tsx` or PDF
  builders in this step;
- React `style` typing for CSS variables needs a controlled cast; keep that
  helper local and typed.

Validation:

- test that a visual override changes both the SVG layer group and the schedule
  row;
- test reset/fallback behavior where unset values still inherit cue defaults;
- manually confirm no estimate request changes when only colors change.

### Step 4 - Build The Editor Shell

Goal:

- introduce the Material Editor surface without enabling risky calculation
  behavior yet.

Touch points:

- preferably new component under
  `apps/web/features/workbench-rebuild/material-editor-panel.tsx`;
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`;
- CSS in `apps/web/app/globals.css` under a clear Material Editor prefix.

Implementation notes:

- add an icon button near layer/material controls to open the editor;
- support opening the editor from a selected layer's material;
- use a dense panel/drawer layout:
  - material list/search/filter;
  - selected material details;
  - `Properties` / `Appearance` segmented control or tabs;
  - footer actions for save, duplicate, reset visual, delete/archive;
- keep built-in seed materials visibly read-only until duplicated.

Watch points:

- do not create a landing page or explanatory marketing surface;
- do not use large cards inside cards;
- keep labels short and unit-bearing;
- avoid layout shifts when validation messages appear;
- avoid visible tutorial copy; use concise labels and tooltips.

Validation:

- UI test can open/close the editor and select seed/custom materials;
- manual desktop check should confirm no overlap with the workbench grid.

### Step 5 - Implement Visual-Only Editing First

Goal:

- ship the lowest-risk visible feature: editable illustration colors.

Touch points:

- editor component;
- visual override helpers;
- `calculator-workbench.tsx` state wiring;
- illustration component tests.

Implementation notes:

- support fill, side, stroke, and pattern colors;
- provide current cue defaults as the starting swatches;
- add reset-to-default per material;
- add basic contrast/readability warnings;
- store only sparse overrides, not fully materialized default palettes.

Watch points:

- this step must not change calculator payloads;
- this step must not change generated/exported PDF output;
- color validation should block invalid CSS values before persistence;
- do not let transparent fills make layers invisible.

Validation:

- test color override and reset;
- inspect the network request or payload builder test to confirm no estimate
  field changes from color edits;
- run a browser screenshot check if the UI surface is visible.

### Step 6 - Implement Custom Material Create/Edit/Delete In UI State

Goal:

- let users manage project-local custom materials in the rebuilt workbench.

Touch points:

- material editor helpers;
- editor component;
- `calculator-workbench.tsx` custom material state;
- tests around catalog resolution and active layer usage.

Implementation notes:

- create custom materials through helper output parsed by
  `MaterialDefinitionSchema`;
- edit custom material properties in place while preserving id;
- duplicate seed materials into project-local custom ids;
- when duplicating a seed material, ask whether to replace active layers that
  use the seed id;
- block deleting a custom material while any active layer references it;
- after changing a layer material, clear row-specific density/dynamic stiffness
  overrides the same way the old store's `updateMaterial` does.

Watch points:

- same-id seed edits will not override engine behavior because duplicate ids are
  skipped by the engine catalog merge;
- do not silently remap all seed usages;
- do not let name edits regenerate ids;
- do not allow a used custom material deletion to create unknown layer ids;
- category/behavior edits may alter floor-role inference, so recalculate role
  only where the workbench already does this for material changes.

Validation:

- tests for create, edit, duplicate seed, delete blocked while used, and layer
  remap confirmation;
- seed-only behavior should remain unchanged when no custom materials exist.

### Step 7 - Add Behavior-Specific Form Requirements

Goal:

- make the editor ask for the right values without turning the form into a
  catch-all schema dump.

Touch points:

- material editor component;
- helper required-field matrix tests.

Implementation notes:

- start with basic fields: name, category, acoustic behavior, density, notes,
  tags;
- reveal behavior-specific groups for:
  - porous absorber: flow resistivity, absorber class, porosity;
  - resilient layer: dynamic stiffness;
  - panel/rigid/mass timber: mechanical advanced fields;
  - air cavity/gap: density exception and reminder that depth is a layer/context
    value;
  - structural bridge/support: topology/spacing reminder that those are context
    values;
- distinguish "required to save" from "required for selected outputs".

Watch points:

- do not imply the engine can calculate every behavior just because the editor
  can save it;
- do not move layer thickness, support spacing, cavity depth, or room context
  into material definitions;
- when a route still returns `needs_input`, preserve and show that posture.

Validation:

- required-field tests for each behavior class;
- manual tests with wall cavity absorber and floor resilient layer examples.

### Step 8 - Add Solver-Active API Contract

Goal:

- make custom materials available to `/api/estimate` and the engine.

Touch points:

- `packages/shared/src/api/estimate.ts`;
- `apps/web/app/api/estimate/route.ts`;
- shared/API tests;
- possibly `@dynecho/shared` exports if a new type/schema is introduced.

Implementation notes:

- import `MaterialDefinitionSchema` into the estimate request schema;
- add an optional bounded `materialCatalog` array;
- validate duplicate ids and seed-id collisions if the schema layer cannot
  express that cleanly, add a helper in the route or shared API test surface;
- pass `catalog: payload.materialCatalog ?? []` into `calculateAssembly`;
- send only project custom/derived materials, not the seed catalog.

Watch points:

- this is the first step that changes shared schema/API contract;
- use current official docs before non-trivial Zod/Next route changes if there
  is uncertainty;
- do not accept visual override data in the estimate API;
- do not change engine merge rules unless a separate owner contract is selected;
- do not retune formulas or import source rows.

Validation:

- schema accepts a valid custom material catalog;
- schema rejects malformed material definitions;
- route passes catalog to engine;
- old seed-only API payloads still parse and return the same result.

### Step 9 - Wire Rebuilt Estimate Payload To Custom Catalog

Goal:

- turn rebuilt custom materials into solver-active inputs.

Touch points:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`;
- rebuilt payload tests.

Implementation notes:

- update `buildEstimatePayload(...)` to accept `customMaterials`;
- include `materialCatalog` only when the list is non-empty;
- include `customMaterials` in the estimate effect dependency list;
- when a custom material changes and active layers use it, let the estimate
  rerun;
- keep visual overrides out of the payload and out of the estimate effect
  dependency list unless visual state also changes React inputs for another
  reason.

Watch points:

- if `customMaterials` is omitted from dependencies, estimates can go stale;
- if visual overrides are added to dependencies, color edits can trigger
  unnecessary recalculations;
- unknown material ids should still produce deterministic blocked/fail-closed
  behavior, not a silent fallback.

Validation:

- test payload includes a custom material when a custom id is in the layer stack;
- test seed-only payload has no `materialCatalog`;
- test editing custom density changes relevant computed output only after the
  API contract is active.

### Step 10 - Add Persistence And Restore Behavior

Goal:

- make custom materials and visual overrides survive saved/replayed work.

Touch points:

- old workbench store only if the implementation also supports the old surface:
  `apps/web/features/workbench/workbench-store.ts`;
- server snapshot parser:
  `apps/web/features/workbench/server-project-workbench-snapshot.ts`;
- rebuilt workbench persistence surface if a new `/workbench-v2` snapshot/local
  storage shape is introduced.

Implementation notes:

- keep existing `customMaterials` compatibility in `ScenarioSnapshot`;
- add optional `materialVisualOverrides` with explicit default `[]`;
- parse custom materials through `MaterialDefinitionSchema`;
- parse visual overrides through a local schema;
- if a restored layer references a missing custom material, keep the layer
  blocked and tell the user, do not substitute a seed material;
- document the schema id or storage key if `/workbench-v2` gets a new persisted
  state shape.

Watch points:

- current `/workbench-v2` is mostly local React state plus proposal preview
  storage; do not assume the old Zustand store is the active V2 persistence
  layer;
- old store has many calculator/report fields, so reusing it blindly can pull
  unrelated behavior into V2;
- invalid restored visual data should not break the whole scenario.

Validation:

- save/restore custom material;
- save/restore visual override;
- server snapshot replay keeps custom material definitions with layers;
- missing custom material restore is recoverable and visible.

### Step 11 - Add Parity And Regression Tests

Goal:

- lock the feature across UI, API, saved replay, and calculation boundaries.

Touch points:

- focused helper/UI/API tests from the testing matrix below;
- old `scenario-analysis.test.ts` only for regression preservation;
- Playwright or screenshot tooling only when the visible editor lands.

Implementation notes:

- test visual-only changes separately from solver-active material changes;
- add at least one floor custom finish scenario because old tests already prove
  that shape in `scenario-analysis.test.ts`;
- add at least one wall porous absorber scenario because current calculator
  routes care about explicit absorber ownership;
- test delete/restore failure modes, not only happy paths.

Watch points:

- do not turn UI tests into broad source crawls;
- do not update expected calculator values unless the selected API/custom
  material behavior intentionally changes them;
- if shared schema changes, run broader checks than a single component test.

Validation:

- targeted Vitest for helper, rebuilt workbench, shared API, and estimate route;
- `git diff --check`;
- `pnpm check` only when shared schema/API or broad user-visible behavior moved.

### Step 12 - Handoff And Documentation Closeout

Goal:

- leave the next agent a precise state instead of an ambiguous partial feature.

Touch points:

- this plan or a follow-up handoff doc;
- final implementation summary.

Implementation notes:

- record which phases are complete;
- record whether `/api/estimate` changed;
- record whether generated PDF/report output stayed unchanged;
- record exact tests run and any skipped tests;
- record remaining unsupported behavior, especially seed same-id overrides and
  PDF color propagation if still out of scope.

Watch points:

- do not mark solver-active Material Editor complete if only visual overrides
  landed;
- do not mark seed editing complete if it only changes display colors;
- call out any parallel files left dirty but untouched.

Validation:

- final `git status --short`;
- final `git diff --check`;
- include focused test outputs in the handoff.

## Per-Step Exit Checklists

Use these checklists as the implementation contract. A step is not done until
its checklist is true. If a later implementation intentionally skips an item,
the handoff must say why.

### Step 0 Exit Checklist

- Dirty worktree reviewed and unrelated files identified.
- Current calculator selected-next state noted from `AGENTS.md` or
  `docs/calculator/DOCUMENTATION_MAP.md`.
- Material Editor scope chosen: visual-only, custom material UI-only, or
  solver-active custom materials.
- No calculator owner/coverage/gate files edited for a UI-only slice.

Edge cases to consider:

- another agent updates `AGENTS.md` while this feature is being implemented;
- `docs/ui/MATERIAL_EDITOR_PLAN_2026-06-12.md` is still untracked, so an
  implementer must not assume it was already committed;
- generated artifacts appear in `git status`; ignore them unless directly
  relevant.

### Step 1 Exit Checklist

- Material draft helper accepts string input and emits parsed
  `MaterialDefinition` only after validation.
- Helper test covers valid custom material creation for at least one mass,
  porous absorber, resilient layer, and gap/support-like material.
- Helper test covers invalid density, invalid dynamic stiffness, invalid flow
  resistivity, invalid color, duplicate name, duplicate id, and seed-id
  collision.
- Visual override helper never returns fields inside `MaterialDefinition`.
- Seed-derived copy helper creates a non-seed id and preserves source metadata
  in notes or tags.

Edge cases to consider:

- density entered as `"1650,5"` vs `"1650.5"`;
- leading/trailing spaces in names, tags, and numeric fields;
- zero density on `mass`/`finish`/`insulation` must be rejected, while true
  `gap`/`support` behavior can be handled deliberately;
- `lossFactor` must stay `> 0` and `<= 1` because the shared schema enforces it;
- `poissonRatio` must be `>= 0` and `< 0.5`;
- `porosity` must be between `0` and `1`;
- `propertySourceStatus` should default consistently rather than disappearing
  from saved acoustic objects.

### Step 2 Exit Checklist

- `/workbench-v2` has a single material source of truth in component state or a
  dedicated hook.
- `getMaterial`, default material selection, filtered material search, layer
  rows, and illustration all resolve from the same catalog.
- Seed-only default wall and floor stacks are unchanged.
- Unknown material ids produce a visible blocked/recoverable condition instead
  of falling back to the first seed material.
- Estimate payload is unchanged while `customMaterials` is empty.

Edge cases to consider:

- current selected layer is deleted while the editor or picker is open;
- material search is open for one layer while another layer changes material;
- active mode switches wall/floor after custom material is selected;
- custom material is renamed while search/filter is active;
- filtered result list should still include the selected material even when it
  falls outside the first page/limit.

### Step 3 Exit Checklist

- Visual override state is keyed by material id.
- SVG layer group and schedule row both receive the same resolved visual style.
- Missing override fields inherit cue defaults.
- `data-cue` remains present on layer blocks and schedule rows.
- No estimate payload or dependency changes are introduced by visual-only state.

Edge cases to consider:

- partial override, for example fill only, must keep side/stroke/pattern from
  cue defaults;
- active layer stroke style must remain visible even when custom stroke color is
  dark or light;
- cavity/fiber/masonry texture should still render after color override;
- multiple layers with the same material id intentionally share the same visual
  override;
- if per-layer color is later desired, it must be a separate model, not a hidden
  mutation of material-level override.

### Step 4 Exit Checklist

- Material Editor opens from the workbench without changing active layer data.
- Editor can be opened directly on the selected layer's material.
- Seed material detail view is read-only until duplicated.
- UI distinguishes `Properties` and `Appearance`.
- Basic keyboard and focus behavior works: open, tab through controls, close,
  return focus to trigger.

Edge cases to consider:

- editor open while active layer is removed;
- editor open while study mode changes;
- small viewport should not hide Save/Cancel/Close controls;
- long material names and long tags should not overflow controls;
- validation messages should not resize fixed-format layer rows or toolbars.

### Step 5 Exit Checklist

- User can edit fill, side, stroke, and pattern colors.
- User can reset one material's visual override to defaults.
- Invalid color values are blocked before persistence.
- Contrast/readability warning appears for dangerous combinations.
- A visual-only edit does not trigger a calculation request or change a
  calculation payload.
- Generated/exported PDF output is not touched.

Edge cases to consider:

- transparent, fully white, fully black, and same-as-background colors;
- color values pasted as short hex, long hex, rgb, hsl, CSS named colors, or
  invalid strings;
- reset after partial override;
- undo/cancel while unsaved color draft exists;
- two materials with same color should still be distinguishable through labels
  and texture.

### Step 6 Exit Checklist

- Custom material can be created, edited, duplicated from seed, and guarded from
  deletion while used.
- Editing a custom material preserves id and updates active layer labels.
- Duplicating a seed material creates a derived custom id.
- Replacing active seed layers with the derived custom copy is explicit.
- Layer row density/dynamic stiffness overrides are cleared when changing layer
  material, matching old store behavior.

Edge cases to consider:

- edit custom material while it is used by several layers;
- delete custom material while it is unused vs used;
- duplicate seed material with a name colliding with an existing custom
  material;
- changing category from `insulation` to `mass` can affect cue inference and
  floor-role inference;
- changing behavior from `porous_absorber` to `rigid_mass` should clear or
  ignore absorber-specific required-field warnings in the draft.

### Step 7 Exit Checklist

- Required fields are driven by selected behavior and selected calculation
  intent.
- Save-blocking errors are visually and programmatically distinct from
  calculation-readiness warnings.
- Behavior-specific sections preserve user-entered values when toggled away and
  back, unless the user explicitly clears them.
- The editor never moves layer thickness, cavity depth, support spacing, room
  volume, or wall topology into material definition.

Edge cases to consider:

- porous absorber without flow resistivity can be saved only if the UI clearly
  marks it not ready for absorber-owned routes;
- resilient layer without dynamic stiffness can be saved, but floor impact
  routes must still surface `needs_input` if they need stiffness;
- air cavity material should not ask for thickness as material data;
- structural support should not ask for support spacing as material data;
- changing output selection after saving a material can change which fields are
  calculation-relevant.

### Step 8 Exit Checklist

- `EstimateRequestSchema` accepts optional `materialCatalog`.
- `materialCatalog` entries parse as `MaterialDefinitionSchema`.
- Duplicate ids inside `materialCatalog` are rejected.
- Seed-id collisions are rejected or explicitly documented as ignored.
- API route passes `catalog: payload.materialCatalog ?? []` to
  `calculateAssembly`.
- Visual override fields are impossible in the estimate request contract.

Edge cases to consider:

- empty `materialCatalog` array vs omitted field;
- request includes custom material not referenced by layers;
- layer references custom material missing from `materialCatalog`;
- malicious request sends very large catalog;
- request sends a material with seed id and different density;
- invalid material fails validation with existing calculator validation payload
  shape, not a raw server error.

### Step 9 Exit Checklist

- `buildEstimatePayload` includes `materialCatalog` only when custom materials
  exist.
- Estimate effect depends on `customMaterials`.
- Estimate effect does not depend on visual overrides.
- Editing a solver-facing custom material reruns calculation.
- Editing only appearance does not rerun calculation.

Edge cases to consider:

- custom material is created but not used by any layer;
- custom material is used by a hidden/offscreen layer row;
- custom material is removed from catalog while a layer still references it;
- rapid edits should debounce/cancel cleanly with existing abort controller;
- failed custom material validation should stop payload creation before fetch.

### Step 10 Exit Checklist

- Custom materials persist and restore with scenarios/projects.
- Visual overrides persist and restore with scenarios/projects.
- Missing custom material ids after restore produce a recoverable blocked state.
- Invalid persisted visual override entries are dropped or reported without
  losing the whole scenario.
- Existing snapshots without visual override fields still load.

Edge cases to consider:

- old snapshot has `customMaterials` but no `materialVisualOverrides`;
- restored custom material fails current schema because schema became stricter;
- local storage contains malformed JSON;
- server snapshot has duplicate custom material ids;
- project restore happens while editor is open;
- imported scenario uses a custom material id that collides with local custom
  material id but has different values.

### Step 11 Exit Checklist

- Helper, UI, API, and restore tests cover both happy path and failure modes.
- Visual-only and solver-active tests are separated so regressions identify the
  correct boundary.
- Old `scenario-analysis.test.ts` custom material behavior remains green.
- At least one browser-visible check is performed after the editor UI lands.
- Final `git diff --check` is clean.

Edge cases to consider:

- tests that pass because fallback seed material was used accidentally;
- tests that only assert label text but not payload/catalog contents;
- tests that do not cover schedule row visual style;
- tests that do not prove color edits avoid calculation requests;
- tests that update calculator expected values without a selected calculator
  owner.

### Step 12 Exit Checklist

- Handoff states which step is complete and which step remains.
- Handoff states whether `/api/estimate`, shared schema, persistence, or PDF
  output changed.
- Handoff lists every validation command run.
- Handoff calls out dirty files from other agents.
- Handoff explicitly says whether custom materials are solver-active or
  UI/visual-only.

Edge cases to consider:

- user thinks "material edit" means solver-active but only visual editing
  shipped;
- user thinks seed catalog changed globally but only project copy shipped;
- next agent assumes PDF colors were included because workbench colors changed;
- partial implementation leaves feature flags or hidden UI reachable.

## Edge Case Matrix

This matrix is the minimum edge-case set to revisit before marking the feature
complete.

| Area | Edge case | Expected behavior | Test/validation surface |
| --- | --- | --- | --- |
| Material id | custom id collides with seed id | reject or create derived id; never same-id override by accident | helper/API tests |
| Material id | custom id removed while layer still references it | visible blocked/recoverable state | UI restore test |
| Material name | duplicate names with different ids | block or suffix clearly | helper/UI tests |
| Numeric parsing | comma decimal density | parse consistently or reject with clear message | helper tests |
| Numeric parsing | zero density for non-gap | reject save | helper tests |
| Numeric parsing | negative, NaN, Infinity | reject before API | helper/API tests |
| Acoustic | porous absorber missing flow resistivity | saved material allowed only with calculation-readiness warning | UI/helper tests |
| Acoustic | resilient layer missing dynamic stiffness | save allowed; route can still return `needs_input` | UI/API scenario |
| Acoustic | behavior changed after fields filled | irrelevant warnings clear; stored draft stays coherent | UI tests |
| Visual | partial color override | unset fields inherit cue defaults | illustration test |
| Visual | transparent or background-matching fill | block or warn | helper/UI test |
| Visual | same color for multiple materials | labels/textures still distinguish layers | screenshot/manual |
| Visual | active layer with custom stroke | active selection remains visible | illustration/manual |
| UI state | editor open while layer deleted | editor closes or switches safely | UI test |
| UI state | mode changes while editor open | no stale role/material crash | UI test |
| UI state | rapid material edits | estimate abort/debounce remains stable | UI/API test |
| API | empty custom catalog | same as omitted catalog | API test |
| API | catalog contains unused custom material | accepted but does not affect output | API test |
| API | layer references missing custom material | fail closed, no raw throw | API/engine guard test |
| Persistence | old snapshot missing visual overrides | loads with empty overrides | restore test |
| Persistence | invalid persisted override | drop/report bad entry; keep scenario | restore test |
| Persistence | duplicate custom material ids in snapshot | deterministic reject or last-write policy documented | restore test |
| PDF/report | workbench color override exists | generated/exported PDF unchanged unless explicitly selected | regression/manual |
| Parallel agents | calculator docs/gates dirty | do not edit/revert from this feature | final status audit |

## Final Verification Ladder

Use the lowest ladder level that matches the implemented scope, then add higher
levels only when their code actually changed.

Level 1 - docs/helper-only:

```bash
git diff --check
pnpm --filter @dynecho/web exec vitest run features/workbench/workbench-materials.test.ts --maxWorkers=1
```

Level 2 - rebuilt visual-only UI:

```bash
git diff --check
pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/professional-layer-illustration.test.tsx --maxWorkers=1
pnpm --filter @dynecho/web typecheck
```

Level 3 - rebuilt custom material UI without API contract:

```bash
git diff --check
pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/calculator-workbench-materials.test.tsx --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/scenario-analysis.test.ts --maxWorkers=1
pnpm --filter @dynecho/web typecheck
```

Level 4 - shared schema/API contract changed:

```bash
git diff --check
pnpm exec vitest run packages/shared/src/api/estimate.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run app/api/estimate/route.test.ts --maxWorkers=1
pnpm --filter @dynecho/shared typecheck
pnpm --filter @dynecho/web typecheck
```

Level 5 - persistence, replay, or broad user-visible behavior changed:

```bash
git diff --check
pnpm --filter @dynecho/web exec vitest run features/workbench/scenario-analysis.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/calculator-workbench-materials.test.tsx --maxWorkers=1
pnpm check
```

If a listed test file does not exist yet, the implementation step that needs it
must either create it or document the nearest equivalent command in the handoff.

## Final Manual Acceptance Script

Run this manually after the visible editor lands:

1. Open `/workbench-v2` in wall mode.
2. Open Material Editor from the selected layer.
3. Change only appearance colors for the selected seed material.
4. Confirm the section diagram and technical schedule both update.
5. Confirm no calculation request changes from the visual-only edit.
6. Reset the appearance and confirm cue defaults return.
7. Duplicate `rockwool` into a project custom material.
8. Add porous absorber fields and save.
9. Replace only the intended active cavity layer with the custom copy.
10. Confirm the layer row, picker, and illustration resolve the custom material.
11. If API contract is active, confirm estimate payload includes only the custom
    material catalog addition.
12. Save and restore the scenario/project.
13. Confirm custom material and visual overrides restore.
14. Attempt to delete the used custom material and confirm it is blocked or asks
    for reassignment.
15. Generate/open report/PDF only if that scope was selected; otherwise confirm
    report/PDF output path was untouched.

## Acceptance Criteria

Visual-only editor is done when:

- users can select any material used in the layer stack and set fill/side/stroke
  or pattern colors;
- reset returns the material to cue/category defaults;
- the rebuilt layer illustration and schedule both reflect the override;
- calculation payloads do not change;
- generated/exported PDF output does not change;
- invalid colors cannot be persisted;
- contrast warnings appear for unreadable combinations.

Solver-active custom material editor is done when:

- users can create a custom material with all required schema fields;
- users can edit a custom material and active layers keep referencing the same
  immutable id;
- users can duplicate a seed material into a project-local custom copy;
- the rebuilt picker, layer rows, illustration, and estimate payload all resolve
  the same custom catalog;
- `/api/estimate` receives the custom material catalog and passes it to
  `calculateAssembly`;
- unknown material ids still fail closed;
- seed-only calculations keep prior outputs;
- saved/server replay keeps custom material definitions aligned with layers.

Seed edit flow is done when:

- built-in seed rows are visibly read-only until duplicated;
- the copy flow explains that the project copy can change calculations;
- replacing active layers is explicit and reversible;
- duplicate-id seed override attempts are not used as the implementation path.

## Failure Modes To Guard Against

- picker resolves custom material, but estimate payload sends only seed ids;
- illustration uses visual override, but schedule row keeps cue default;
- custom material save mutates a seed id and engine ignores it because duplicate
  ids are skipped;
- deleting a custom material leaves active layers with unknown ids;
- snapshot restore silently replaces missing custom material ids;
- visual override state leaks into `MaterialDefinition` or estimate API;
- PDF/proposal visual output changes as a side effect of workbench illustration
  edits;
- broad `packages/catalogs` seed file churn collides with calculator agents;
- required-field UI implies route support that the engine still reports as
  `needs_input`.

## Testing And Validation Plan

Unit tests:

- material draft validation;
- id generation and collision handling;
- seed-to-custom copy behavior;
- visual override validation and reset;
- custom catalog resolution;
- route-aware required field messages.

API tests, only after Phase 5:

- `EstimateRequestSchema` accepts valid custom materials;
- API passes `materialCatalog` to `calculateAssembly`;
- same seed-only payloads are unchanged;
- unknown or malformed custom material payloads fail with validation errors.

UI tests:

- create a custom material and select it in a layer;
- edit a custom material and see active layer labels update;
- color override changes layer illustration CSS variables;
- reset returns to cue defaults;
- validation blocks invalid density/stiffness/flow-resistivity values;
- used custom material delete is guarded.

Suggested focused test files:

| Surface | Suggested file | Purpose |
| --- | --- | --- |
| material helpers | `apps/web/features/workbench/workbench-materials.test.ts` or new `material-editor-state.test.ts` | schema validation, derived ids, duplicate handling |
| rebuilt payload | `apps/web/features/workbench-rebuild/calculator-workbench-materials.test.tsx` | derived catalog, custom selection, payload catalog inclusion after Phase 5 |
| visual overrides | `apps/web/features/workbench-rebuild/professional-layer-illustration.test.tsx` | CSS variable style propagation to SVG and schedule rows |
| API schema | `packages/shared/src/api/estimate.test.ts` or route-focused web test | request accepts/rejects custom material catalog |
| estimate route | `apps/web/app/api/estimate/route.test.ts` if existing route test pattern supports it | route passes custom catalog to engine |
| old workbench regression | existing `apps/web/features/workbench/scenario-analysis.test.ts` | preserve current custom material behavior |

Suggested commands, adjusted to the actual test files added:

```bash
pnpm --filter @dynecho/web exec vitest run features/workbench/... --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/... --maxWorkers=1
pnpm exec vitest run packages/shared/src/api/... --maxWorkers=1
```

Use `pnpm check` only after shared schema/API or broad user-visible behavior
moves far enough to justify the broader gate.

Visual QA:

- desktop and mobile screenshots for editor drawer/panel;
- layer illustration remains non-overlapping;
- labels remain readable after color choices;
- no report/PDF regression unless that scope is selected.

Manual QA scenarios:

1. Create "Custom cork finish", select it in a floor covering row, and confirm
   layer label, picker, and illustration all show the custom material.
2. Change only visual colors and confirm no estimate request body changes except
   unrelated debounce timing.
3. Duplicate `rockwool`, add absorber/flow-resistivity details, use it in a wall
   cavity, and confirm route-specific needs stay honest.
4. Try to delete a custom material used by a layer and confirm the UI blocks or
   requests reassignment.
5. Save and restore a scenario with custom material plus visual override.
6. Restore a scenario after removing the custom material from storage and
   confirm the layer is recoverably blocked, not silently remapped.

## Parallel-Agent Safety

Preferred first implementation file set should stay mostly in web/UI:

- `apps/web/features/workbench-rebuild/*`;
- `apps/web/features/workbench/workbench-materials.ts`;
- `apps/web/app/globals.css`;
- new focused tests near the workbench feature.

Avoid touching calculator route owner files, current coverage refresh contract
files, and engine formula/runtime files. If Phase 5 is selected, the minimal
cross-cutting files are:

- `packages/shared/src/api/estimate.ts`;
- `apps/web/app/api/estimate/route.ts`;
- a focused API/contract test;
- rebuilt workbench payload builder.

Do not modify:

- current calculator selected next runtime/coverage files;
- proposal PDF server builders;
- source-row catalogs;
- formula retuning code.

Coordination notes:

- if another agent is working on calculator coverage refresh, avoid
  `packages/engine/src/post-v1-*` files entirely;
- if another agent is polishing `/workbench-v2` layout, confine Material Editor
  UI work to new components and a small integration point in
  `calculator-workbench.tsx`;
- if another agent is touching `globals.css`, isolate new Material Editor styles
  under a clear prefix and keep illustration variable changes minimal;
- if shared schema/API work is selected, land that as a separate commit/slice
  from pure UI color editing.

## Documentation Updates Required With Implementation

When implementation starts, update this plan or create a follow-up handoff with:

- selected first slice and exact scope;
- files touched;
- whether endpoint/shared schema changed;
- whether generated report/PDF output stayed unchanged;
- custom material request shape if Phase 5 lands;
- snapshot migration notes;
- validation commands and results;
- known residual gaps.

## Open Decisions

1. Should the first slice be visual-only, or should it include solver-active
   custom materials from the start?
2. Should seed material edits create project-local derived custom materials by
   default?
3. Should material visual overrides be stored per scenario/project only, or as a
   user-level library preference?
4. Should deleting a used custom material be blocked, or should the UI force a
   layer reassignment?
5. Should visual overrides eventually affect generated reports/PDFs, or only
   the interactive workbench illustration?

Recommended defaults:

- start with `/workbench-v2`;
- create project-local derived custom materials for seed edits;
- store visual overrides per scenario/project;
- block deletion while a material is used;
- keep PDF/report generated visuals unchanged until explicitly selected.
