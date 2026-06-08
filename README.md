# DynEcho

This repository is the new product track for DynEcho.

Current scope:

- Build a production web application around the existing acoustic calculation domain.
- Keep the calculation engine portable so it can later power a desktop app.
- Treat `/home/ogttuna/Dev/Machinity/Acoustic2` as an external upstream source, not as a working directory for this repo.

Project status:

- Monorepo scaffold is in place.
- A first web shell exists in `apps/web`.
- A seed `engine`, `catalogs`, `shared`, and `ui` package set exists.
- Docker build and compose structure exist.
- The web app now has auth-gated workbench flows and proposal PDF/DOCX export.
- Server-backed project storage v1 is available through explicit
  workbench sync/list/load; editing remains local-first.
- Project access roles/actions now have a shared pure policy contract,
  but project/proposal routes remain owner-scoped; route integration is
  deferred while the active slice returns to calculator accuracy and
  coverage.
- No code should be copied from `Acoustic2` until the import policy in [`docs/foundation/SOURCE_REPO_POLICY.md`](./docs/foundation/SOURCE_REPO_POLICY.md) is followed.

Primary calculator documents:

- [`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`](./docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md) — first authority for product goal, anti-drift rules, and next-slice selection
- [`docs/calculator/USABLE_V1_EXECUTION_PLAN.md`](./docs/calculator/USABLE_V1_EXECUTION_PLAN.md) — closed company-internal usable V1 acceptance contract
- [`docs/calculator/CURRENT_STATE.md`](./docs/calculator/CURRENT_STATE.md) — current implementation snapshot
- [`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`](./docs/calculator/NEXT_IMPLEMENTATION_PLAN.md) — active tactical slice
- [`docs/calculator/POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md`](./docs/calculator/POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md) — landed Gate ES/ET boundary plan
- [`docs/calculator/POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md`](./docs/calculator/POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md) — landed Gate ER runtime plan
- [`docs/calculator/CHECKPOINT_2026-06-08_GATE_ET_BOUNDARY_HANDOFF.md`](./docs/calculator/CHECKPOINT_2026-06-08_GATE_ET_BOUNDARY_HANDOFF.md) — latest docs/implementation reconciliation

Latest calculator boundary closeout:

- `post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`
  landed with status
  `post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu`.
- Boundary id:
  `floor.reinforced_concrete.visible_derived_lower_assembly_from_layers_missing_dynamic_stiffness_and_load`.
- Visible-derived reinforced-concrete combined upper/lower impact now
  parks `Ln,w` / `DeltaLw` as `needs_input` with exactly
  `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`; explicit
  partial predictor input still requires `loadBasisKgM2` and
  `ceilingOrLowerAssembly`.
- Counters: `currentGateFailuresCleared 6`, `runtimeValuesMoved 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 1`.
- Current selected next action:
  Gate EU, `post_v1_next_numeric_coverage_gap_gate_eu_plan`, in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts`.

Latest calculator rerank:

- `post_v1_next_numeric_coverage_gap_gate_es_plan` landed with status
  `post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et`.
- Selected candidate:
  `floor.reinforced_concrete_visible_derived_missing_input_boundary_refresh`.
- Gate ES ran two ROI iterations (`roiAnalysisIterations: 2`) and
  selected Gate ET, the reinforced-concrete visible-derived missing-input boundary;
  estimated Gate ET boundary-surface touch
  `estimatedNextFrontendImplementationFilesTouched 1`;
  `runtimeValuesMoved 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.
- Gate ES selected next file:
  `packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts`.

Latest calculator runtime closeout:

- `post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`
  landed with status
  `post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es`.
- Readable label: direct-fixed double-leaf field/building adapter runtime.
- Complete direct-fixed double-leaf `field_between_rooms` requests now
  select `gate_i_airborne_field_apparent_context_adapter_runtime`, and
  complete `building_prediction` requests now select
  `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
- The representative stack calculates `R'w 23 / Dn,w 24 / DnT,w 27`;
  `runtimeValuesMoved 6`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.
- Gate ER selected Gate ES file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts`.

Calculator reference documents:

- [`docs/calculator/SYSTEM_MAP.md`](./docs/calculator/SYSTEM_MAP.md) — runtime and test-surface map
- [`docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`](./docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md) — answer-origin semantics
- [`docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`](./docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md) — selected post-V1 capability chain
- [`docs/calculator/POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md`](./docs/calculator/POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md) — landed Gate EQ owner-proof plan
- [`docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md`](./docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md) — high-ROI planning framework
- [`docs/README.md`](./docs/README.md) — docs hierarchy entry point
- [`docs/foundation/SOURCE_REPO_POLICY.md`](./docs/foundation/SOURCE_REPO_POLICY.md) — read-only upstream/import policy

Historical `CHECKPOINT_*`, `SLICE_*`, source-pack, confidence, report,
auth, storage, and productization docs are useful for what landed, but
they do not select calculator work. Do not reopen source crawling,
finite scenario-library building, confidence wording, report polish, or
auth/storage slices unless the user explicitly asks for that work
outside calculator behavior.

Working principles:

- Web-first delivery.
- Desktop-ready architecture.
- Engine stays framework-free.
- No edits to `Acoustic2` from this project.

Run locally:

- `pnpm install`
- optional: set `DYNECHO_AUTH_USERNAME`, `DYNECHO_AUTH_PASSWORD`, and `DYNECHO_AUTH_SECRET`
- `pnpm dev`
- `pnpm calculator:gate:current`
- `pnpm check`
- `pnpm build`
- `pnpm e2e`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm engine:estimate --layers "concrete:100,gypsum_board:12.5"`
- `pnpm upstream:inventory`
- `pnpm upstream:estimate --layers "gypsum_board:12.5,rockwool:50,air_gap:50,concrete:100"`
- `pnpm upstream:compare`
- `pnpm upstream:status`
- `pnpm upstream:note`

Run with Docker:

- `docker build -t dynecho-web .`
- `docker compose up --build`

Useful endpoints:

- `GET /api/health`
- `POST /api/estimate`
- `POST /api/impact-only`
- `GET /api/projects`
- `POST /api/projects/import-local`
- `POST /api/proposal-pdf`
- `POST /api/proposal-docx`

Authentication:

- the landing page remains public
- when auth is configured, `/workbench`, `/workbench/proposal`,
  project APIs, estimate APIs, and proposal PDF/DOCX APIs require
  sign-in
- if auth env vars are not configured locally, the app falls back to preview mode instead of forcing login
- copy [`apps/web/.env.example`](./apps/web/.env.example) into your local env setup if you want authenticated local runs instead of preview mode

Agent workflow:

- read [`AGENTS.md`](./AGENTS.md) before changing calculator behavior
- treat calculator work as scope/accuracy work only: make more
  physically valid wall/floor layer combinations calculate correctly, or
  improve an existing formula/anchor/boundary; do not drift into source
  catalog, low-confidence wording, report polish, auth/storage, or
  finite scenario work unless explicitly requested
- read [`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`](./docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md)
  before older roadmap or handoff files
- use [`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`](./docs/calculator/NEXT_IMPLEMENTATION_PLAN.md)
  as the current next-step authority
- run `pnpm calculator:gate:current` for the focused current-slice validation
  gate

Read-only upstream tooling:

- `upstream:status` reads branch, SHA, and dirty working tree state from `Acoustic2`.
- `upstream:inventory` writes a snapshot report into `docs/imports` without modifying upstream.
- `upstream:estimate` runs a one-off estimate inside upstream for comparison work.
- `upstream:compare` compares seeded DynEcho estimates against upstream smoke cases.
