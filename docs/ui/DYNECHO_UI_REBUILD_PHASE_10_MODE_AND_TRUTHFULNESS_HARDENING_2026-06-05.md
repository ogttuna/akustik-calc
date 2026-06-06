# DynEcho UI Rebuild Phase 10 Mode And Truthfulness Hardening - 2026-06-05

Document role: post-Phase-9 frontend-only hardening plan for the staged
rebuilt calculator route.

This phase keeps the same binding rules:

- do not touch backend, engine, API routes, shared schemas, auth/storage
  behavior, calculation values, or PDF output;
- keep styles centralized in `apps/web/app/globals.css`;
- keep the tool pages operational, compact, and engineering-focused;
- preserve the protected PDF output code and do not promote `/workbench-v2` to
  `/workbench` without explicit user approval.

## Phase 10A - Floor Mode Graph Truthfulness

Problem found during post-readiness smoke:

- switching `/workbench-v2` from wall mode to floor mode produces a live
  `Ln,w` result, but the right inspector still showed `Airborne response
  curve`;
- this is misleading because the selected output is impact and the current
  result does not expose a trace-backed impact band curve;
- the issue is frontend presentation, not a calculator value issue.

Required behavior:

- if selected outputs are airborne or spectrum outputs, show the airborne
  response curve when result data exposes one;
- if selected outputs are impact outputs, show the impact response curve only
  when result data exposes an impact trace;
- if impact output is selected but no impact trace exists, show a short
  unavailable state instead of the airborne graph;
- do not change engine result values, API contracts, report PDF renderers, or
  generated PDF output code.

Implementation status:

- calculator inspector now filters visible response figures by selected output
  family;
- `Ln,w` floor mode no longer shows the airborne graph as the active visual
  evidence;
- floor impact without impact trace shows:
  `Impact spectrum` / `Band curve unavailable`;
- the report snapshot still uses the existing response figure payload path; no
  PDF output code was edited.

Acceptance evidence to collect:

- browser smoke in `/workbench-v2` floor mode:
  - result remains live;
  - graph title is not `Airborne response curve`;
  - unavailable state is visible;
  - horizontal overflow is `0px`;
- focused ESLint;
- `git diff --check`;
- protected PDF/API diff check;
- web build with known optional `sharp/@img` warnings only.

Status update - 2026-06-05:

- Phase 10A is implemented.
- Floor mode with selected `Ln,w` now keeps the live `80 dB` result and no
  longer shows the airborne graph as the active inspector visual.
- The right inspector instead shows:
  `Impact spectrum` / `Band curve unavailable`.
- Browser checks:
  - mode badges: `Floor`, `3 layers`, `162.5 mm`, `Ready`;
  - output row: `Ln,w Calculated 80 dB`;
  - graph titles: none;
  - unavailable state visible;
  - report handoff enabled;
  - horizontal overflow: `0px`.
- Evidence screenshot:
  `output/playwright/ui-phase10/phase10a-floor-impact-curve-unavailable.png`.
- Validation:
  - `pnpm --filter @dynecho/web exec eslint features/workbench-rebuild/calculator-workbench.tsx`;
  - `git diff --check` for touched frontend/doc files;
  - protected PDF/API diff check returned no changed files;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain.

## Phase 10C - Material Dropdown Stacking Guard

Problem found during browser inspection:

- material search popovers are absolute children of layer rows;
- the current layout usually keeps them visible, but the open row did not own
  an explicit stacking level above sibling rows and downstream figures;
- this leaves dropdowns vulnerable to the exact overlap failure called out in
  user feedback.

Required behavior:

- keep the fix in centralized CSS;
- do not change component behavior, material catalog data, API routes, engine
  logic, or PDF output code;
- when a material popover is open, its layer row must paint above adjacent
  layer rows and the layer illustration below it.

Implementation status:

- `.calc-layer-row` now establishes a positioned context;
- `.calc-layer-row:has(.calc-material-popover)` raises the open row to
  `var(--z-dropdown)`;
- no component or backend files were edited for this fix.

Acceptance evidence to collect:

- browser smoke with the first floor material dropdown open:
  - search field and options remain visible above the following rows;
  - no horizontal overflow;
- focused ESLint for the workbench component;
- CSS/doc whitespace checks;
- protected PDF/API diff check.

Status update - 2026-06-05:

- Phase 10C is implemented.
- Browser smoke with the first floor material dropdown open confirms:
  - popover visible: `true`;
  - open row position: `relative`;
  - open row z-index: `1600`;
  - popover z-index: `1600`;
  - search field visible: `true`;
  - horizontal overflow: `0px`.
- Evidence screenshot:
  `output/playwright/ui-phase10/phase10c-material-dropdown-stacking.png`.
- Validation:
  - focused ESLint passed for the workbench component;
  - CSS/doc whitespace checks passed;
  - protected PDF/API diff check returned no changed files;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain.

## Phase 10D - Dynamic Calculator Request Lane

Problem found during graph/value analysis:

- `/workbench-v2` was posting estimate requests without `calculator`;
- the estimate API therefore used the default screening lane instead of the
  dynamic topology calculator;
- for the same `Gypsum Board / Rock Wool / Gypsum Board` wall stack this
  produced `Rw 30 dB` from `screening_mass_law_curve_seed_v3`, while the
  intended `calculator: "dynamic"` request produces `Rw 39 dB`;
- this was a frontend request-lane defect, not an engine formula change.

Required behavior:

- keep the fix frontend-only;
- always send `calculator: "dynamic"` from the rebuilt calculator request
  payload;
- label dynamic response curves as dynamic calculator evidence instead of a
  generic calculated-band label;
- do not touch engine, API route, endpoint schema, catalog data, auth/storage,
  or PDF output code.

Implementation status:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx` now includes
  `calculator: "dynamic"` in estimate payloads;
- the staged legacy `apps/web/features/workbench-v2/workbench-v2-shell.tsx`
  payload builder was updated the same way to avoid reintroducing the bug if
  that file is reused;
- response curve evidence now labels dynamic method output as
  `Dynamic topology`;
- a focused response-curve model test pins the dynamic label.

Acceptance evidence to collect:

- browser smoke in `/workbench-v2` with
  `Gypsum Board / Rock Wool / Gypsum Board`:
  - result should read `Rw 39 dB`;
  - graph evidence should read `Dynamic topology`;
  - horizontal overflow should remain `0px`;
- focused frontend tests;
- focused ESLint;
- protected PDF/API diff check;
- web build with known optional `sharp/@img` warnings only.

Status update - 2026-06-05:

- Phase 10D is implemented.
- Browser smoke in `/workbench-v2` with
  `Gypsum Board / Rock Wool / Gypsum Board` confirms:
  - mode badges: `Wall`, `3 layers`, `75 mm`, `Ready`;
  - result: `Rw 39 dB`;
  - output row: `Rw Available 39 dB`;
  - graph evidence: `Dynamic topology`;
  - graph note: `Curve returned by the dynamic calculator for the active
    layer topology.`;
  - horizontal overflow: `0px`.
- Evidence screenshot:
  `output/playwright/ui-phase10/phase10d-dynamic-calculator-39db.png`.
- Validation:
  - `pnpm --filter @dynecho/web exec vitest run features/workbench/response-curve-model.test.ts`;
  - focused ESLint passed for the touched frontend files;
  - CSS/new-file/doc whitespace checks passed;
  - protected PDF/API diff check returned no changed files;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain.

## Phase 10B - Floor Mode Default Stack Semantics

Problem found during the same smoke:

- switching from wall mode to floor mode preserves the existing three wall
  layers and assigns every layer the `Base` floor role;
- this is usable mechanically, but it does not read like a professional floor
  workflow because the default stack has no role differentiation.

Required behavior:

- keep the change frontend-only;
- when switching to floor mode from the default wall state, provide a more
  coherent floor starter stack;
- preserve user-edited layer order by migrating roles instead of resetting
  custom stacks;
- do not touch engine values, API routes, material catalog source data, or PDF
  output code.

Implementation status:

- the default wall starter remains gypsum board / rock wool / concrete;
- switching from that untouched default wall starter to floor now uses a
  purpose-built floor starter:
  - concrete base structure;
  - GenieMat RST05 resilient layer;
  - mineral screed floating screed;
- switching back from the untouched floor starter restores the wall starter;
- edited/custom stacks are not discarded. Their material order remains in place
  and only their role sequence is migrated to the target mode;
- open material dropdown/search and drag state are cleared on mode change so
  overlays do not linger in the wrong mode;
- no engine, API, catalog source, auth/storage, or PDF output files were edited.

Acceptance evidence to collect:

- browser smoke in `/workbench-v2` floor mode:
  - floor stack reads as differentiated floor roles, not `Base / Base / Base`;
  - result state remains calculator-owned, whether ready or needs-input;
  - horizontal overflow is `0px`;
- focused ESLint;
- `git diff --check`;
- protected PDF/API diff check;
- web build with known optional `sharp/@img` warnings only.

Status update - 2026-06-05:

- Phase 10B is implemented.
- Browser smoke in `/workbench-v2` floor mode confirms:
  - mode badges: `Floor`, `3 layers`, `205 mm`, `Ready`;
  - starter stack:
    `Concrete / Base / 150 mm`,
    `GenieMat RST05 / Resilient layer / 5 mm`,
    `Mineral Screed / Floating screed / 50 mm`;
  - result: `Ln,w 74.5 dB Calculated`;
  - active graph titles: none;
  - impact unavailable state remains visible instead of an airborne graph;
  - horizontal overflow: `0px`.

## Phase 10E - Required Input Guidance And Layer Scale Integrity

Problem found during user review:

- the `Needs input` inspector could still expose raw engine field ids such as
  `sideALeafGroup`, `cavity1DepthMm`, `sideBLeafGroup`,
  `frameBridgeClass`, `supportTopology`, `supportSpacingMm`,
  `contextMode`, and `partitionAreaM2`;
- users could not tell where to enter those values in the rebuilt workbench;
- wall layer illustrations could make two layers with the same
  `thicknessMm` look visually different.

Required behavior:

- keep the fix frontend-only;
- do not touch engine logic, shared schemas, API routes, endpoints, material
  catalog source, auth/storage, or PDF output code;
- translate required physical input ids into usable labels and actions;
- route task clicks to the relevant input instead of leaving users with raw
  field names;
- expose a compact wall ownership input surface only when needed by the
  route or when explicitly active;
- keep layer illustration sizing deterministic: equal thickness values must
  render with equal SVG width/height.

Implementation status:

- `/workbench-v2` route inputs now include a compact wall ownership block with
  topology mode, Side A rows, cavity rows, Side B rows, cavity depth, cavity
  fill, cavity absorption, support topology, support spacing, and resilient
  bar side count;
- `Use layer roles` fills Side A / cavity / Side B row groups and cavity depth
  from the visible layer stack;
- estimate payloads include wall topology, support spacing, and resilient
  side-count only through the existing shared `airborneContext` surface;
- needs-input mapping now converts wall topology and field/building ids into
  user-facing tasks such as `Side A leaf rows`, `Support topology`,
  `Airborne mode`, `Panel area`, and `Room volume`;
- layer preview sizing now groups equal thickness values before solving the
  bounded preview scale, so equal physical thickness cannot render with
  different visual sizes.

Status update - 2026-06-05:

- Phase 10E is implemented.
- Browser smoke confirms:
  - with layer 1 and layer 3 both set to `12.5 mm`, SVG layer sizes are
    `57px / 126px / 57px`;
  - selecting `R'w` shows needs-input cards as `Airborne mode`, `Panel area`,
    and `Room volume`, not raw field ids;
  - clicking `Panel area` focuses `#rebuild-panel-width`;
  - console errors/warnings: `0`;
  - port remains `http://localhost:3039`.
- Evidence screenshot:
  `.playwright-cli/page-2026-06-05T16-23-29-115Z.png`.
- Validation:
  - focused ESLint passed for
    `features/workbench-rebuild/calculator-workbench.tsx` and
    `features/workbench-rebuild/professional-layer-illustration.tsx`;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain;
  - protected PDF/API diff check returned no changed files.

- Evidence screenshot:
  `output/playwright/ui-phase10/phase10b-floor-starter-stack.png`.
- Validation:
  - `pnpm --filter @dynecho/web exec eslint features/workbench-rebuild/calculator-workbench.tsx`;
  - `git diff --check` for touched frontend/doc files;
  - protected PDF/API diff check returned no changed files;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain.

## Phase 10F - Building Input Surface And Output Boundary Guard

Problem found during review:

- valid building-prediction routes could not be completed from `/workbench-v2`
  because `sourceRoomVolumeM3`, `flankingJunctionClass`,
  `conservativeFlankingAssumption`, `junctionCouplingLengthM`, and
  `buildingPredictionOutputBasis` were not represented in the rebuilt context
  draft or estimate payload;
- needs-input task mapping did not point those building-only fields to real
  controls, so the UI could leave users with generic missing-input cards;
- output rows decided `Live` from any finite display value before enforcing
  the selected output's engine boundary;
- common auth fallback still sent missing/invalid `nextPath` callers to the
  old `/workbench` route.

Required behavior:

- keep the fix frontend-only;
- do not touch backend, engine logic, shared schemas, estimate/PDF/DOCX API
  routes, material catalog source, or PDF output code;
- expose only the building controls required to complete the route;
- send all building-prediction fields through the existing shared
  `airborneContext` contract;
- classify output rows by `needs_input` / `unsupported` / supported target
  boundary before displaying any finite value as live;
- make auth's default protected destination `/workbench-v2` while preserving
  explicitly valid internal next paths.

Implementation status:

- `/workbench-v2` now carries building prediction context fields in
  `ContextDraft`, input ids, initial state, and estimate payload mapping;
- selecting Building mode, or receiving a building-only missing-input
  boundary, shows a compact `Building prediction` route block with source room
  volume, flanking junction, flanking assumption, coupling length, and output
  basis;
- missing-input tasks for the five building-only fields now focus the matching
  controls instead of falling back to raw field names;
- output rows only render a live value when the selected output is present in
  `supportedTargetOutputs`; `needs_input` and `unsupported` boundaries win
  first;
- `normalizeNextPath(undefined/null/invalid)` now falls back to
  `/workbench-v2`, and auth tests pin that behavior.

Status update - 2026-06-05:

- Phase 10F is implemented.
- Browser smoke in `/workbench-v2` confirms:
  - selecting `R'w` exposes route inputs and keeps the unsupported/needs-input
    row value as `--`;
  - selecting Building mode exposes Source room volume, Flanking junction,
    Flanking assumption, Coupling length, and Output basis;
  - the final `/api/estimate` request carries
    `contextMode: "building_prediction"`, `sourceRoomVolumeM3`,
    `flankingJunctionClass`, `conservativeFlankingAssumption`,
    `junctionCouplingLengthM`, and `buildingPredictionOutputBasis` inside
    `airborneContext`;
  - console errors/warnings: `0`;
  - port remains `http://localhost:3039`.
- Validation:
  - focused ESLint passed for
    `features/workbench-rebuild/calculator-workbench.tsx`, `lib/auth.ts`,
    `lib/auth.test.ts`, and `lib/auth-routes.test.ts`;
  - `pnpm --filter @dynecho/web exec vitest run lib/auth.test.ts lib/auth-routes.test.ts`
    passed with `12` tests;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain;
  - protected PDF/API diff check returned no changed files.

## Phase 10G - Inline Missing Route Input Feedback

Problem found during user review:

- the right-side `Needs input` card repeated the same route fields that were
  already visible in `Route inputs`;
- users had to scan two places for the same missing wall/building input state;
- the useful behavior is not another card, but a direct visual state on the
  missing input itself.

Required behavior:

- keep the fix frontend-only;
- do not touch backend, engine logic, shared schemas, API routes, endpoints,
  material catalog source, auth/storage, or PDF output code;
- hide route-input tasks from the right inspector when the missing input has a
  concrete route field already visible in the workbench;
- keep non-route/local tasks visible in the inspector;
- mark missing route fields inline with centralized theme styles and
  `aria-invalid`.

Implementation status:

- remote tasks with `targetElementId` now drive route-field missing state
  instead of rendering duplicate right-side cards;
- the inspector still renders errors, local layer/output tasks, and any future
  task without a route-field target;
- `NumberField`, `TextField`, and route `select` controls now expose
  `data-missing="true"` and `aria-invalid` when their input is required by the
  active route;
- centralized CSS adds a restrained danger border/background/left rail for
  missing route inputs.

Status update - 2026-06-05:

- Phase 10G is implemented.
- Browser smoke in `/workbench-v2` confirms:
  - selecting `R'w` no longer shows a duplicate `Needs input` inspector card
    when the corresponding route inputs are open;
  - selecting Building mode keeps the inspector free of duplicate task cards;
  - missing route fields are marked with `data-missing="true"` and
    `aria-invalid="true"`;
  - console errors/warnings: `0`;
  - port remains `http://localhost:3039`.
- Validation:
  - focused ESLint passed for
    `features/workbench-rebuild/calculator-workbench.tsx`;
  - `pnpm --filter @dynecho/web build` passed with the existing optional
    `sharp/@img` warnings from the DOCX/PDF dependency chain;
  - protected PDF/API diff check returned no changed files.
