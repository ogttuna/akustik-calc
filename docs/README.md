# Docs

Living reference docs for the DynEcho acoustic calculator.
Historical checkpoints, analysis notes, and closed-slice plans
live under `docs/archive/`; they inform history but never
override the living triangle under `docs/calculator/`.

## Start Here — Agent Resume Triangle

Three docs are authoritative for "where are we and what comes
next". If they disagree, fix the drift before starting work.

1. [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md)
   — short snapshot (what is stable right now, completion
   signals, active slice, deferred follow-up tracks)
2. [calculator/MASTER_PLAN.md](./calculator/MASTER_PLAN.md) —
   strategic roadmap, ROI ranking, accuracy preservation
   contract, quantitative completion targets
3. [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
   — tactical detail for the active slice

Then run `pnpm calculator:gate:current` before calculator runtime
changes. Productization slices should add their own focused tests and
use `pnpm check` when shared contracts move.

Current calculator handoff:

- Active product correction:
  [calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md](./calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md).
  The immediate selected next action is now
  `acoustic_calculator_answer_engine_v1_plan` in
  `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`.
  The selected next label is acoustic calculator answer engine V1.
  DynEcho must behave as an acoustic calculator: the user enters wall or
  floor layers, thicknesses, requested outputs, and any formula-required
  physical inputs; the engine uses exact measured values when available,
  compatible measured anchors when valid, and otherwise the correct
  acoustic formula family to calculate the answer. Docs and tests are
  guardrails, not the product.
- Latest checkpoint:
  [calculator/CHECKPOINT_2026-05-22_ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_RECONCILIATION.md](./calculator/CHECKPOINT_2026-05-22_ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_RECONCILIATION.md).
  This re-read docs, compared implementation, ran runtime probes, fixed
  one stale model-first doc-alignment test, and confirmed
  `pnpm calculator:gate:current` on 2026-05-22: engine 508 files / 2889
  tests, web 94 files / 388 passed + 18 skipped, repo build 5 / 5, and
  whitespace guard passed. It also confirms Answer Engine V1 is still
  the next implementation: the contract file does not exist yet, flat
  double-leaf-like stacks can still fall to untraced screening, and
  missing `resilientBarSideCount` still leaks numeric metrics while
  selecting `needs_input`.
- Previous implementation checkpoint:
  [calculator/CHECKPOINT_2026-05-21_LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_COVERAGE_REFRESH_REVALIDATION.md](./calculator/CHECKPOINT_2026-05-21_LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_COVERAGE_REFRESH_REVALIDATION.md).
  Read this for landed double-leaf coverage-refresh facts before
  implementing the next calculator slice. The fresh
  `pnpm calculator:gate:current` run passed on 2026-05-21 with engine
  508 files / 2889 tests, web 94 files / 388 passed + 18 skipped, repo
  build 5 / 5, and whitespace guard passed. The latest landed
  layer-combination gate is
  `layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_plan`
  with selection status
  `layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_landed_no_runtime_selected_post_double_leaf_revalidation`;
  at landing time the selected next action was
  `layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
  in
  `packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`.
  That historical next action is superseded by the active answer-engine
  plan above. This is not a broad source crawl.
  The candidate coverage matrix refresh has now landed as
  `layer_combination_resolver_candidate_coverage_matrix_refresh_plan`
  with selection status
  `layer_combination_resolver_candidate_coverage_matrix_refresh_landed_no_runtime_selected_company_internal_v0_rehearsal`;
  it covers all 13 resolver candidate declarations, 13 surface rows, 10
  active runtime candidates, and 3 boundary rows across exact measured
  overrides, similarity anchors, calibrated family solvers,
  source-absent family solvers, field/building adapters, `needs_input`,
  basis boundaries, and unsupported ASTM/IIC blockers without moving
  runtime values. The selected next action is
  `layer_combination_resolver_company_internal_v0_rehearsal_plan`
  in
  `packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal-contract.test.ts`;
  selected next label: layer combination resolver company-internal V0
  rehearsal. This is not a broad source crawl.
  The company-internal V0 rehearsal has now landed as
  `layer_combination_resolver_company_internal_v0_rehearsal_plan`
  with selection status
  `layer_combination_resolver_company_internal_v0_rehearsal_landed_no_runtime_selected_single_leaf_mass_law_banded_solver_owner`.
  It is no-runtime: it classifies the 13 current resolver rows as 2
  `ready`, 8 `ready_with_budget`, 1 `needs_input`, 2 `unsupported`,
  and 0 registered `research_only` rows, then ranks six research-only
  gaps. Internal V0 use is limited to the 10 exact or budgeted rows with
  visible candidate id, basis, support bucket, required fields, value
  pins, and budgets. Broad source crawling, field/building runtime
  promotion, ASTM/IIC/AIIC aliases, and tolerance retunes without
  holdouts remain blocked. The selected next action is
  `layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_plan`
  in
  `packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-solver-owner-contract.test.ts`;
  selected next label: layer combination resolver single-leaf mass-law
  banded solver owner. This is not a broad source crawl.
  The single-leaf mass-law banded solver owner has now landed as
  `layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_plan`
  with selection status
  `layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_landed_no_runtime_selected_formula_corridor`.
  It is no-runtime: wall/floor direct-airborne single-visible-leaf
  scope, material density/surface mass/thickness, stiffness/coincidence
  family, one-third-octave TL curve, ISO 717-1 `Rw`/`C`/`Ctr` adapter,
  exact-source precedence, holdout residual budget, and hostile topology
  boundaries are owned for the next formula corridor. Floor impact,
  field/building, ASTM/IIC/AIIC, broad source crawling, tolerance
  retune, and Rw-to-STC alias promotion stay blocked. Current Gate O
  values remain frozen: gypsum 12.5 mm `Rw/STC 31`, laminated gypsum
  25 mm `Rw/STC 34`, and concrete 150 mm `Rw/STC 55`. The selected next
  action is
  `layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_plan`
  in
  `packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor-contract.test.ts`;
  selected next label: layer combination resolver single-leaf mass-law
  banded formula corridor. This is not a broad source crawl.
  The single-leaf mass-law banded formula corridor has now landed as
  `layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_plan`
  with selection status
  `layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It is no-runtime: it defines the source-absent element-lab basis
  `layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor`
  from surface mass, stiffness/coincidence, one-third-octave TL curve,
  ISO 717-1 `Rw`/`C`/`Ctr`, exact-source precedence, and budget terms.
  Representative design payloads include gypsum 12.5 mm `Rw 31`,
  laminated gypsum 25 mm `Rw 34`, and concrete/floor direct-airborne
  `Rw 55` with `+/-6 dB` `Rw` / STC-compatibility budgets. Runtime
  values remain frozen, exact rows still win first, and floor impact,
  field/building, ASTM/IIC/AIIC, broad source crawling, tolerance
  retune, and Rw-to-STC alias promotion remain blocked. The selected
  next action is
  `layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_plan`
  in
  `packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor-contract.test.ts`;
  selected next label: layer combination resolver single-leaf mass-law
  banded runtime corridor. This is not a broad source crawl.
  The single-leaf mass-law banded runtime corridor has now landed as
  `layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_plan`
  with selection status
  `layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_landed_selected_surface_parity`.
  Complete source-absent wall/floor direct-airborne single-leaf
  element-lab stacks now expose the runtime basis
  `layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor`
  and candidate
  `candidate_layer_combination_resolver_single_leaf_mass_law_banded_source_absent_family_solver`.
  Numeric values remain frozen: gypsum 12.5 mm `Rw 31`, laminated
  gypsum 25 mm `Rw 34`, and concrete/floor direct-airborne `Rw 55`,
  with `+/-6 dB` Rw/STC compatibility budget. Exact rows still win
  first; field/building, floor impact, ASTM/IIC/AIIC, broad source
  crawling, tolerance retune, and new Rw-to-STC alias promotion remain
  outside this gate. The selected next action is
  `layer_combination_resolver_single_leaf_mass_law_banded_surface_parity_plan`
  in
  `packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-surface-parity-contract.test.ts`;
  selected next label: layer combination resolver single-leaf mass-law
  banded surface parity. This is not a broad source crawl.
  The earlier broad-accuracy matrix refresh is
  `broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan`
  with selection status
  `broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_landed_no_runtime_selected_helper_only_timber_open_web_impact_stack_owner`
  in
  `packages/engine/src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts`.
  The helper-only timber/open-web impact stack owner has now landed as
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_plan`
  with selection status
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_landed_no_runtime_selected_formula_corridor`
  in
  `packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts`.
  It is no-runtime: exact, direct-fixed, and supported-band open-web
  field values remain pinned, raw-bare impact field transfer remains
  blocked, building prediction remains unsupported, ASTM/IIC aliases
  remain blocked, and broad source crawling remains blocked. It names
  lower-treatment owner fields for helper-only timber/open-web stacks:
  base support family, carrier geometry, lower ceiling board mass,
  cavity depth, absorber thickness/density, suspension/support class,
  package absence, impact-curve ownership, ISO impact adapter ownership,
  hostile topology, and budgets. The selected next action is
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_plan`
  in
  `packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor-contract.test.ts`;
  selected next label: floor helper-only timber/open-web impact stack
  formula corridor. This is not a broad source crawl.
  The helper-only timber/open-web impact stack formula corridor has now
  landed as
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It defines the no-runtime source-absent element-lab basis
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`
  without moving public runtime values; exact, direct-fixed,
  supported-band, raw-bare, package-transfer, and EPS/screed lanes remain
  separate; field/building and ASTM/IIC aliases remain blocked. The
  selected next action is
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_plan`
  in
  `packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor-contract.test.ts`;
  selected next label: floor helper-only timber/open-web impact stack
  runtime corridor. This is not a broad source crawl.
  The helper-only timber/open-web impact stack runtime corridor has now
  landed as
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_landed_selected_surface_parity`.
  Complete source-absent element-lab helper-only lower-treatment stacks
  now promote through
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`:
  open-box timber returns `Rw 54.8` / `Ln,w 59.6`, timber joist returns
  `Rw 47.3` / `Ln,w 65.4`, and open-web returns `Rw 46.7` /
  `Ln,w 59.6` with not-measured source-absent budgets. Exact/package/
  raw-bare lanes still win first; partial, roleless, and missing-board
  helper-like inputs stay outside this runtime; field/building and
  ASTM/IIC aliases remain blocked. The selected next action is
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_surface_parity_plan`
  in
  `packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity-contract.test.ts`;
  selected next label: floor helper-only timber/open-web impact stack
  surface parity. This is not a broad source crawl.
  The helper-only timber/open-web impact stack surface parity has now
  landed as
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_surface_parity_landed_selected_coverage_refresh`.
  Cards, route posture, confidence provenance, metric-basis rows,
  method dossier, local saved replay, server snapshot replay,
  calculator API, impact-only API, and Markdown report now expose
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`
  and the same open-box timber `Rw 54.8` / `Ln,w 59.6`, timber joist
  `Rw 47.3` / `Ln,w 65.4`, and open-web `Rw 46.7` / `Ln,w 59.6`
  helper-only values with not-measured budgets. Fully tagged
  impact-only entrypoints now stay on the same helper-only lane. Exact/
  package/raw-bare, direct-fixed, supported-band, field/building, and
  ASTM/IIC boundaries remain blocked or ahead. The selected next action
  is
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_plan`
  in
  `packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh-contract.test.ts`;
  selected next label: floor helper-only timber/open-web impact stack
  coverage refresh. This is not a broad source crawl.
  The helper-only timber/open-web coverage refresh has now landed as
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_plan`
  with selection status
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_landed_no_runtime_selected_post_helper_only_revalidation`.
  This no-runtime ledger refresh carries open-box timber 370 mm, split
  185/185, 4x92.5 safe fragments, timber-joist 250 mm, open-web 250 mm,
  and open-web split 125/125 without moving runtime values. Pins remain
  open-box timber `Rw 54.8` / `Ln,w 59.6` with `+/-8.5 dB` `Rw` and
  `+/-10.5 dB` `Ln,w`, timber-joist `Rw 47.3` / `Ln,w 65.4`, and
  open-web `Rw 46.7` / `Ln,w 59.6` on
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`.
  Exact/package precedence stays first, raw-bare / direct-fixed /
  supported-band lanes stay separate, and partial, roleless,
  missing-board, field/building, and ASTM/IIC requests stay blocked.
  Selected next action:
  `broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-post-helper-only-timber-open-web-impact-stack-coverage-revalidation-contract.test.ts`.
  Selected next label: post helper-only timber/open-web impact stack
  coverage revalidation.
  The post-helper-only timber/open-web coverage revalidation has now
  landed as
  `broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan`
  with selection status
  `broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_landed_no_runtime_selected_layer_combination_resolver_registry`.
  It is no-runtime: helper-only timber/open-web values remain open-box
  timber `Rw 54.8` / `Ln,w 59.6`, timber-joist `Rw 47.3` /
  `Ln,w 65.4`, and open-web `Rw 46.7` / `Ln,w 59.6` on
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`.
  Exact/package precedence stays first, raw-bare / direct-fixed /
  supported-band lanes stay separate, field/building and ASTM/IIC
  requests stay blocked, and this is not a broad source crawl. Selected
  next action: `layer_combination_resolver_registry_plan`. Selected next
  file:
  `packages/engine/src/layer-combination-resolver-registry-contract.test.ts`.
  Selected next label: layer combination resolver registry.
  The layer combination resolver registry has now landed as
  `layer_combination_resolver_registry_plan` with selection status
  `layer_combination_resolver_registry_landed_no_runtime_selected_runtime_candidate_adapter`.
  It is no-runtime: it defines the shared candidate declaration surface
  for exact measured overrides, similarity anchor candidates, calibrated
  family solver candidates, source-absent family solver candidates,
  `needs_input` boundaries, `unsupported` boundaries, field/building
  basis boundaries, and ASTM/IIC alias blockers without moving runtime
  values. The selected next action is
  `layer_combination_resolver_runtime_candidate_adapter_plan` in
  `packages/engine/src/layer-combination-resolver-runtime-candidate-adapter-contract.test.ts`;
  selected next label: layer combination resolver runtime candidate
  adapter. This is not a broad source crawl.
  The layer combination resolver runtime candidate adapter has now landed
  as `layer_combination_resolver_runtime_candidate_adapter_plan` with
  selection status
  `layer_combination_resolver_runtime_candidate_adapter_landed_no_runtime_selected_surface_parity`.
  It is no-runtime: current runtime basis ids now map into the shared
  resolver candidate id surface for exact measured overrides, similarity
  anchors, calibrated family solvers, source-absent family solvers,
  field/building adapters, `needs_input` boundaries, and `unsupported` /
  ASTM/IIC boundaries without moving helper-only, raw-bare, direct-fixed,
  supported-band, package-transfer, exact, or field values. The selected
  next action is
  `layer_combination_resolver_runtime_candidate_surface_parity_plan` in
  `packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity-contract.test.ts`;
  selected next label: layer combination resolver runtime candidate
  surface parity. This is not a broad source crawl.
  The layer combination resolver runtime candidate surface parity has now
  landed as
  `layer_combination_resolver_runtime_candidate_surface_parity_plan` with
  selection status
  `layer_combination_resolver_runtime_candidate_surface_parity_landed_no_runtime_selected_candidate_coverage_matrix_refresh`.
  It is no-runtime: shared engine results now carry a candidate trace,
  and calculator API, impact-only API, replay paths, and Markdown report
  expose the same selected candidate id, candidate kind, support bucket,
  runtime basis, value pins, boundary candidates, and rejected candidate
  count without moving runtime values. `needs_input`, `unsupported`,
  field/building, and ASTM/IIC boundaries remain blocked. The selected
  next action is
  `layer_combination_resolver_candidate_coverage_matrix_refresh_plan` in
  `packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts`;
  selected next label: layer combination resolver candidate coverage
  matrix refresh. This is not a broad source crawl.
  The earlier landed open-web revalidation is
  `broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan`
  with selection status
  `broad_accuracy_post_raw_bare_open_web_coverage_revalidation_landed_no_runtime_selected_open_web_field_building_adapter_owner`.
  The earlier landed matrix refresh remains
  `broad_accuracy_open_box_timber_post_eps_screed_hybrid_matrix_refresh_plan`
  with selection status
  `broad_accuracy_open_box_timber_post_eps_screed_hybrid_matrix_refresh_landed_no_runtime_selected_open_web_raw_bare_owner`
  in
  `packages/engine/src/broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh-contract.test.ts`.
  It is a no-runtime company-internal V0 operating-envelope snapshot:
  open-box package-transfer remains `Ln,w 50.8`, raw-bare remains
  `Rw 42.3` / `Ln,w 88.2`, and EPS/screed remains `Rw 72` / `Ln,w 47`.
  It keeps exact rows first, keeps dry package-transfer/raw-bare/EPS
  lanes separate, and keeps field/building plus ASTM/IIC aliases
  blocked. The floor open-web raw-bare carrier owner has now landed as
  `broad_accuracy_floor_open_web_raw_bare_carrier_owner_plan`
  with selection status
  `broad_accuracy_floor_open_web_raw_bare_carrier_owner_landed_no_runtime_selected_formula_corridor`
  in
  `packages/engine/src/broad-accuracy-floor-open-web-raw-bare-carrier-owner-contract.test.ts`.
  It is a no-runtime owner boundary: the current 111 UBIQ open-web rows
  are INEX deck / firestop package evidence with zero carrier-only
  raw-bare impact rows, so raw open-web impact remains fail-closed and
  the current raw carrier `Rw 79` screening posture is not promoted. The
  EPS/screed pin remains `Rw 72` / `Ln,w 47`. Field/building plus
  ASTM/IIC aliases stay blocked, direct-fixed and suspended-ceiling
  package rows stay separate lanes, and raw/split/deck screening
  postures remain explicit formula-owner blockers. Lower-only partial
  package inputs also remain fail-closed until full INEX/firestop/package
  ownership exists. The
  selected next action is
  `broad_accuracy_floor_open_web_raw_bare_formula_corridor_plan` in
  `packages/engine/src/broad-accuracy-floor-open-web-raw-bare-formula-corridor-contract.test.ts`;
  selected next label: floor open-web raw-bare formula corridor.
  That formula corridor has now landed as
  `broad_accuracy_floor_open_web_raw_bare_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_web_raw_bare_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It defines the source-absent element-lab basis
  `broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor`
  with design values `Rw 32`, `C -2.2`, `Ctr -7.8`, `Ln,w 96`,
  `CI 1.8`, `CI,50-2500 5.2`, and `Ln,w+CI 97.8`; budgets remain
  not-measured source-absent values including `+/-9 dB` for `Rw` and
  `+/-12 dB` for `Ln,w`. The floor open-web raw-bare runtime corridor
  has now landed as
  `broad_accuracy_floor_open_web_raw_bare_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_web_raw_bare_runtime_corridor_landed_selected_surface_parity`.
  Runtime landed contract:
  `packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor-contract.test.ts`.
  Complete source-absent element-lab raw-bare open-web steel base-only
  stacks now promote through
  `broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor`:
  300 mm and safe split 150/150 return `Rw 32`, `C -2.2`, `Ctr -7.8`,
  `Ln,w 96`, `CI 1.8`, `CI,50-2500 5.2`, and `Ln,w+CI 97.8`; 400 mm
  returns `Rw 36.6` and `Ln,w 92.8`. Budgets remain not-measured
  source-absent values including `+/-9 dB` for `Rw` and `+/-12 dB` for
  `Ln,w`. Exact UBIQ INEX/firestop package rows, direct-fixed and
  supported-band package lanes, deck-only or partial packages,
  field/building outputs, and ASTM/IIC aliases stay blocked outside this
  lane. The selected next action is
  `broad_accuracy_floor_open_web_raw_bare_surface_parity_plan` in
  `packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity-contract.test.ts`;
  selected next label: floor open-web raw-bare surface parity.
  The floor open-web raw-bare surface parity has now landed as
  `broad_accuracy_floor_open_web_raw_bare_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_web_raw_bare_surface_parity_landed_selected_coverage_refresh`.
  Cards, route posture, confidence provenance, metric-basis rows, method
  dossier, local saved replay, server snapshot replay, calculator API,
  impact-only API, and Markdown report now expose the same
  `broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor`
  values: `Rw 32`, `C -2.2`, `Ctr -7.8`, `Ln,w 96`, `CI 1.8`,
  `CI,50-2500 5.2`, and `Ln,w+CI 97.8` for the canonical 300 mm
  raw-bare open-web steel carrier. UBIQ INEX/firestop package rows stay
  exact or package evidence and are not borrowed into the raw-bare
  open-web formula surface. The selected next action is
  `broad_accuracy_floor_open_web_raw_bare_coverage_refresh_plan` in
  `packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts`;
  selected next label: floor open-web raw-bare coverage refresh.
  The floor open-web raw-bare coverage refresh has now landed as
  `broad_accuracy_floor_open_web_raw_bare_coverage_refresh_plan` with
  selection status
  `broad_accuracy_floor_open_web_raw_bare_coverage_refresh_landed_selected_post_raw_bare_open_web_revalidation`.
  It is no-runtime: 300 mm, split 150/150, and safe 6x50 fragments keep
  `Rw 32`, `Ln,w 96`, and `CI,50-2500 5.2` with `+/-9 dB` `Rw` and
  `+/-12 dB` `Ln,w` budgets; 400 mm stays `Rw 36.6` / `Ln,w 92.8`.
  Exact UBIQ packages, direct-fixed, and supported-band lanes stay
  separate; partial-package, deck-only, out-of-range, field/building,
  and ASTM/IIC requests stay blocked. The selected next action is
  `broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan` in
  `packages/engine/src/broad-accuracy-post-raw-bare-open-web-coverage-revalidation-contract.test.ts`;
  selected next label: post raw-bare open-web coverage revalidation.
  The post raw-bare open-web coverage revalidation has now landed as
  `broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan`
  with selection status
  `broad_accuracy_post_raw_bare_open_web_coverage_revalidation_landed_no_runtime_selected_open_web_field_building_adapter_owner`.
  It is no-runtime: raw-bare 300/400 mm values, exact UBIQ precedence,
  direct-fixed and supported-band separate lanes, wrong-family open-box
  guards, and field/building plus ASTM/IIC boundaries remain frozen. It
  ranks `broad_accuracy_floor_open_web_field_building_adapter_owner_plan`
  in
  `packages/engine/src/broad-accuracy-floor-open-web-field-building-adapter-owner-contract.test.ts`
  as the next bounded gate because common floor field/building outputs
  need an explicit basis owner; carrier-only holdout acquisition,
  ASTM/IIC rating ownership, broad source crawl, and tolerance retune
  stay blocked. Selected next label: floor open-web field/building
  adapter owner. This is not a broad source crawl.
  The floor open-web field/building adapter owner has now landed as
  `broad_accuracy_floor_open_web_field_building_adapter_owner_plan`
  with selection status
  `broad_accuracy_floor_open_web_field_building_adapter_owner_landed_no_runtime_selected_field_building_surface_parity`.
  It is no-runtime: existing exact UBIQ, direct-fixed, and supported-band
  open-web `field_between_rooms` continuations remain pinned, explicit
  `impactFieldContext` owns `L'n,w`, `L'nT,w`, and `L'nT,50` only for
  those lab anchors, raw-bare impact field transfer remains blocked even
  when the raw-bare lab `Ln,w 96` formula corridor is present, building
  prediction remains unsupported until separate flanking/building owners
  exist, and ASTM/IIC aliases remain blocked. The selected next action is
  `broad_accuracy_floor_open_web_field_building_surface_parity_plan` in
  `packages/engine/src/broad-accuracy-floor-open-web-field-building-surface-parity-contract.test.ts`;
  selected next label: floor open-web field/building surface parity. This
  is not a broad source crawl.
  The floor open-web field/building surface parity has now landed as
  `broad_accuracy_floor_open_web_field_building_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_web_field_building_surface_parity_landed_no_runtime_selected_input_surface`.
  It is no-runtime: route card, output cards, method dossier, local saved
  replay, server snapshot replay, calculator API, impact-only API, and
  Markdown report must expose the same exact, direct-fixed, and
  supported-band field values plus
  `source_absent_field_building_adapter_error_budget` terms. The visible
  pins remain `Rw 51/52/61.5`, `R'w 77/75/45`, `DnT,w 80/78/48`,
  `Ln,w 71/77/61.5`, `L'n,w 73/79/63.5`, `L'nT,w 70.6/76.6/61.1`, and
  `L'nT,50 70/76.5/60`; raw-bare impact field transfer remains blocked,
  building prediction remains unsupported, and ASTM/IIC aliases remain
  blocked. The selected next action is
  `broad_accuracy_floor_open_web_field_building_input_surface_plan` in
  `apps/web/features/workbench/open-web-field-building-input-surface.test.ts`;
  selected next label: floor open-web field/building input surface. This
  is not a broad source crawl.
  The floor open-web field/building input surface has now landed as
  `broad_accuracy_floor_open_web_field_building_input_surface_plan` with
  selection status
  `broad_accuracy_floor_open_web_field_building_input_surface_landed_selected_post_input_surface_revalidation`.
  It wires workbench controls, live evaluation, local saved replay,
  server snapshot replay, calculator API payloads, impact-only API
  payloads, and Markdown report payloads through a first-class floor
  input surface without moving exact, direct-fixed, or supported-band
  values. Complete UI-derived field contexts keep `Rw 51/52/61.5`,
  `R'w 77/75/45`, `DnT,w 80/78/48`, `Ln,w 71/77/61.5`,
  `L'n,w 73/79/63.5`, `L'nT,w 70.6/76.6/61.1`, and
  `L'nT,50 70/76.5/60`; partial field contexts name the missing panel,
  room, RT60, K, or impact-volume inputs; raw-bare impact field transfer
  remains blocked, building prediction remains unsupported, and ASTM/IIC
  aliases remain blocked. The selected next action is
  `broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan`
  in
  `packages/engine/src/broad-accuracy-floor-open-web-field-building-post-input-surface-revalidation-contract.test.ts`;
  selected next label: floor open-web field/building post-input-surface
  revalidation. This is not a broad source crawl.
  The floor open-web field/building post-input-surface revalidation has
  now landed as
  `broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan`
  with selection status
  `broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh`.
  It is no-runtime: exact, direct-fixed, and supported-band open-web
  field values remain pinned after input-surface wiring; raw-bare impact
  field transfer remains blocked, building prediction remains
  unsupported, ASTM/IIC aliases remain blocked, and broad source crawling
  remains blocked. The selected next action is
  `broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan`
  in
  `packages/engine/src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts`;
  selected next label: post open-web field/building input-surface matrix
  refresh. This is not a broad source crawl.
  EPS/screed surface parity landed as
  `broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_landed_selected_matrix_refresh`.
  Cards, route posture, confidence provenance, metric-basis rows, method
  dossier, local saved replay, server snapshot replay, calculator API,
  impact-only API, and Markdown report now expose
  `broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor`
  with `Rw 72`, `Ln,w 47`, `+/-7 dB` `Rw`, and `+/-8 dB` `Ln,w`
  budgets while exact R7b, dry package-transfer/raw-bare separation,
  field/building, and ASTM/IIC boundaries stay protected. The
  package-transfer surface parity closeout
  landed as `broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_surface_parity_landed_selected_coverage_refresh`.
  The coverage refresh then landed as
  `broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_landed_selected_exact_only_hybrid_fragmentation_policy`;
  the landed contract is
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh-contract.test.ts`.
  It keeps the package-transfer pins at `Ln,w 50.8`, `CI,50-2500 3.3`,
  and `Rw 66` with exact source precedence while raw bare, exact-only
  hybrid, mixed staged, field/building, and ASTM/IIC cases stay outside
  the lane. Broad "every common wall/floor combination" confidence is
  still not done.
- Landed follow-up action:
  `broad_accuracy_floor_open_box_timber_raw_bare_reopening_guard_plan`;
  landed contract:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard-contract.test.ts`.
  The exact-only hybrid fragmentation policy has now landed as
  `broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_landed_no_runtime_selected_raw_bare_reopening_guard`.
  Its landed contract is
  `packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts`.
  It is a no-runtime policy gate: R7b/R8b/R9b/R2c/R10a stay exact-only
  evidence, do not enter package-transfer runtime anchors, and do not
  move tolerances. The package-transfer pins remain `Ln,w 50.8`,
  `CI,50-2500 3.3`, and `Rw 66`; field/building and ASTM/IIC aliases
  remain blocked. The raw-bare reopening guard has also landed with
  selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_reopening_guard_landed_no_runtime_selected_bare_carrier_owner`.
  It is a no-runtime guard: roleless, tagged, split, upper-only, and
  lower-only raw `open_box_timber_slab` probes do not borrow the
  package-transfer `Ln,w 50.8`, `CI,50-2500 3.3`, or `Rw 66` lane;
  impact stays unsupported and field/building plus ASTM/IIC aliases stay
  blocked. Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner-contract.test.ts`.
  The bare-carrier owner contract has now landed as
  `broad_accuracy_floor_open_box_timber_raw_bare_carrier_owner_contract_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_carrier_owner_landed_no_runtime_selected_formula_corridor`.
  It is no-runtime work: support geometry, airborne direct-curve, bare
  impact-curve, finish absence, lower-treatment state, package-transfer
  exclusion, basis-boundary, hostile-topology, and uncertainty-budget
  owner fields are now explicit before any raw-bare formula corridor can
  move values. Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor-contract.test.ts`.
  The raw-bare formula corridor has now landed as
  `broad_accuracy_floor_open_box_timber_raw_bare_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It was a no-runtime formula gate: the source-absent basis
  `broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor`
  defined raw-bare element-lab design payloads and budgets. The
  canonical 370 mm fixture is `Rw 42.3`, `Ln,w 88.2`, and
  `CI,50-2500 3.1` with `+/-8 dB` `Rw` and `+/-10 dB` `Ln,w`
  not-measured budgets. The raw-bare runtime corridor has now landed as
  `broad_accuracy_floor_open_box_timber_raw_bare_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_runtime_corridor_landed_selected_surface_parity`.
  Complete base-only raw-bare `open_box_timber_slab` inputs now use
  `broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor`
  at runtime: the canonical 370 mm case returns `Rw 42.3`, `C -1.4`,
  `Ctr -5.8`, `Ln,w 88.2`, `CI,50-2500 3.1`, and `Ln,w+CI 87.1`;
  the 220 mm case returns `Rw 38.1` / `Ln,w 91.1`. Package-transfer
  pins `Ln,w 50.8`, `CI,50-2500 3.3`, and `Rw 66`, exact source
  precedence, partial package and wrong-family boundaries,
  field/building outputs, and ASTM/IIC aliases remain protected.
  Landed runtime contract:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor-contract.test.ts`.
  The raw-bare surface parity gate has now landed as
  `broad_accuracy_floor_open_box_timber_raw_bare_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_surface_parity_landed_selected_coverage_refresh`.
  Cards, route posture, dynamic trace, impact support notes, confidence
  provenance, metric-basis rows, method dossier, local saved replay,
  server snapshot replay, calculator API, impact-only API, and Markdown
  report now expose the raw-bare open-box timber basis, `Rw 42.3`,
  `Ln,w 88.2`, `CI,50-2500 3.1`, `+/-8 dB` `Rw`, and `+/-10 dB`
  `Ln,w` budgets without presenting them as measured evidence. Exact
  TUAS rows still win, package-transfer pins stay on their own lane,
  and field/building plus ASTM/IIC aliases remain blocked. Landed
  surface parity contract:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-surface-parity-contract.test.ts`.
  Surface-parity selected action, now consumed by the coverage refresh:
  `broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_plan`.
  Surface-parity selected file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts`.
  The raw-bare coverage refresh has now landed as
  `broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_landed_selected_post_raw_bare_revalidation`.
  It refreshes the executable coverage matrix for raw-bare open-box
  timber 370 mm, split 185/185 mm, and 220 mm while keeping `Rw 42.3`,
  `Ln,w 88.2`, `CI,50-2500 3.1`, `+/-8 dB` `Rw`, and `+/-10 dB`
  `Ln,w` unchanged. It proves exact TUAS package precedence,
  package-transfer separation, partial-package and wrong-family
  refusals, field/building blockers, and ASTM/IIC blockers without
  moving runtime values. Landed coverage-refresh contract:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts`.
Selected next action:
`broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan`.
Selected next file:
`packages/engine/src/broad-accuracy-post-raw-bare-open-box-timber-coverage-revalidation-contract.test.ts`.
That post raw-bare revalidation has now landed as
`broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan`
with selection status
`broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_landed_no_runtime_selected_package_transfer_residual_expansion`.
It is no-runtime: raw-bare open-box timber stays `Rw 42.3` /
`Ln,w 88.2`, finished package-transfer stays `Ln,w 50.8`, exact TUAS
rows still win, tolerances/API/workbench behavior do not move, and
field/building plus ASTM/IIC aliases remain blocked. It is not a broad
source crawl. The selected next action is
`broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-package-transfer-residual-expansion-contract.test.ts`;
the next lane is package-transfer residual expansion for exact-only
hybrid / mixed-staged same-family evidence gaps.
That package-transfer residual expansion has now landed as
`broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan`
with selection status
`broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_landed_no_runtime_selected_eps_screed_hybrid_package_owner`.
It is no-runtime: `R7b` is the only selected candidate owner gap,
`R8b` and `R9b` are residual-readiness/negative-boundary evidence,
`R2c` and `R10a` remain blocked negative boundaries, and all five rows
stay exact-only instead of entering the package-transfer runtime anchors.
The existing package-transfer pins stay `Ln,w 50.8` / `Rw 66` for dry
gypsum-fiber, `Ln,w 53.5` / `Rw 55.5` for thin laminate, and
`Ln,w 53.5` / `Rw 63.5` for reinforced ceiling. Field/building and
ASTM/IIC aliases remain blocked, and this is not a broad source crawl.
The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner-contract.test.ts`.
Selected next label: EPS/screed hybrid package owner.
That EPS/screed hybrid package owner has now landed as
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan`
with selection status
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_landed_no_runtime_selected_formula_corridor`.
It is no-runtime: R7b now owns the 370 mm open-box support, 35 mm EPS
board, 1 mm geotextile, 40 mm screed, 3 mm EPS underlay, 8 mm laminate,
and hybrid lower treatment owner checklist for the next formula
corridor. R8b, R9b, R2c, and R10a stay negative boundaries, the current
dry package `Ln,w 50.8` / `Rw 66` pin remains frozen, field/building and
ASTM/IIC aliases remain blocked, and this is not a broad source crawl.
The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor-contract.test.ts`.
Selected next label: EPS/screed hybrid package formula corridor.
That EPS/screed hybrid package formula corridor has now landed as
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_plan`
with selection status
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
It is no-runtime: the corridor defines R7b-anchored element-lab design
metrics `Rw 72`, `C -1.3`, `Rw+C 70.7`, `Ln,w 47`, `CI 0`,
`CI,50-2500 1`, and `Ln,w+CI 47` with source-absent not-measured
budgets, but exact R7b still wins first and public runtime values remain
unchanged. R8b, R9b, R2c, and R10a remain negative boundaries, the
generic dry package-transfer basis is still forbidden, and field/building
plus ASTM/IIC aliases remain blocked. The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor-contract.test.ts`.
Selected next label: EPS/screed hybrid package runtime corridor.
That EPS/screed hybrid package runtime corridor has now landed as
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_plan`
with selection status
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_landed_selected_surface_parity`.
Complete source-absent open-box timber EPS/screed hybrid variants now
promote through the
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor`
runtime basis. The representative source-absent element-lab case returns
`Rw 72`, `C -1.3`, `Rw+C 70.7`, `Ln,w 47`, `CI 0`,
`CI,50-2500 1`, and `Ln,w+CI 47` with not-measured budgets including
`+/-7 dB` for `Rw` and `+/-8 dB` for `Ln,w`. Exact R7b still wins,
dry package-transfer remains a separate lane, R8b/R9b/R2c/R10a remain
negative boundaries, and field/building plus ASTM/IIC aliases remain
blocked. The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity-contract.test.ts`.
Selected next label: EPS/screed hybrid package surface parity.
Validation after this EPS/screed hybrid package runtime-corridor closeout:
`pnpm calculator:gate:current` passed on 2026-05-20 with engine 475
files / 2720 tests, web 89 files / 369 passed + 18 skipped, repo build
5 / 5,
  and `git diff --check` clean. The known optional `sharp/@img` warnings
  from the DOCX/PDF build path remain non-fatal.
- Broad-accuracy refocus:
  [calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md](./calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md).
  Use this as the current product-direction guardrail. The 71-row
  company-internal matrix is not the finish line; broad readiness now
  requires exact measured lookup, nearby measured similarity anchors,
  calibrated family solvers, source-absent solver budgets, and a global
  residual benchmark.
- Broad-accuracy landed chain:
  [calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md](./calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md).
  Older selected-next lines below are retained as landed history; the
  latest checkpoint above is authoritative for the current next action.
  It has now landed as
  `broad_accuracy_reference_benchmark_expansion_and_similarity_solver_plan`
  with selection status
  `broad_accuracy_reference_benchmark_expansion_landed_no_runtime_selected_floor_system_similarity_anchor`.
  The contract
  `packages/engine/src/broad-accuracy-reference-benchmark-expansion-contract.test.ts`
  creates the benchmark ledger, evidence-role classification, residual
  summary, weak-lane debt ledger, and similarity-anchor scoring policy.
  Selected next action:
  `broad_accuracy_floor_system_similarity_anchor_runtime_plan`; selected
  next file:
  `packages/engine/src/broad-accuracy-floor-system-similarity-anchor-contract.test.ts`.
  That selected floor-system anchor admission gate has now landed as
  `broad_accuracy_floor_system_similarity_anchor_runtime_plan` with
  selection status
  `broad_accuracy_floor_system_similarity_anchor_landed_no_runtime_selected_open_web_supported_band_runtime_corridor`.
  It classifies 90 UBIQ open-web exact rows, 21 open-web bound rows, and
  15 TUAS open-box exact rows without counting inventory as readiness,
  pins the existing FL-28 250 mm interpolation seed as
  no-runtime movement, and selects
  `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan`
  as the next action. Selected next file:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts`.
  Selected next label: open-web steel supported-band similarity runtime
  corridor.
  That runtime corridor has now landed as
  `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan`
  with selection status
  `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_landed_selected_surface_parity`.
  It adds
  `predictor_lightweight_steel_open_web_supported_band_similarity_estimate`
  for complete element-lab FL-24/FL-26 open-web steel supported-band
  stacks: FL-26 250 mm timber is `Ln,w 53.5`, `Ln,w+CI 52`,
  `Rw 61.5`; FL-24 250 mm timber is `Ln,w 54.5`, `Ln,w+CI 53`,
  `Rw 60.5`; FL-26 250 mm bare is `Ln,w 61.5`, `Ln,w+CI 60`,
  `Rw 61.5`. Exact rows and the existing FL-28 interpolation still win,
  while carpet, missing-fill, field/building, and ASTM/IIC aliases stay
  blocked. Selected next action:
  `broad_accuracy_open_web_supported_band_similarity_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity-contract.test.ts`.
  Selected next label: open-web supported-band similarity surface parity.
  That selected surface parity has now landed as
  `broad_accuracy_open_web_supported_band_similarity_surface_parity_plan`
  with selection status
  `broad_accuracy_open_web_supported_band_similarity_surface_parity_landed_selected_coverage_refresh`.
  It keeps runtime values frozen while cards, method dossier, saved
  replay, server snapshot replay, calculator API, impact-only API, and
  Markdown report all show `Open-web steel supported-band similarity`
  with the same
  `predictor_lightweight_steel_open_web_supported_band_similarity_estimate`
  basis, `89.5%` fit, exact-source precedence, and field/building,
  ASTM/IIC boundaries. FL-26 250 mm timber remains `Ln,w 53.5`,
  `Ln,w+CI 52`, `Rw 61.5`. Selected next action:
  `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh-contract.test.ts`.
  Selected next label: open-web supported-band similarity coverage
  refresh.
  That coverage refresh has now landed as
  `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan`
  with selection status
  `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_landed_selected_wall_multileaf_triple_leaf_solver`.
  It keeps the open-web steel supported-band similarity runtime frozen
  while the refreshed matrix pins FL-26 250 mm timber at `Ln,w 53.5`,
  keeps exact-source precedence and FL-28 seed precedence, blocks
  carpet, missing-fill, field, building, and ASTM/IIC aliases, and
  leaves direct-fixed open-web and open-box timber as ranked follow-ups.
  Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-contract.test.ts`.
  Selected next label: wall multileaf triple-leaf calibrated solver.
  That calibrated solver has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_landed_selected_surface_parity`.
  It promotes only explicit NRC 2024 source-family Type C / glass-fiber
  grouped triple-leaf element-lab stacks through
  `broad_accuracy_wall_triple_leaf_nrc2024_calibrated_two_cavity_solver`.
  Assembly B now returns `Rw 49 / STC 60 / C 1.4 / Ctr -7.4`, while
  Assembly A and D return `Rw 58` and `Rw 55` respectively with the same
  calibrated lab basis and `+/-4 dB` budget. Rockwool / MLV / plaster,
  generic gypsum or glasswool, duplicate or missing grouped topology,
  field outputs, and building outputs stay outside this calibrated lane.
  Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_plan`;
  selected next file:
  `apps/web/features/workbench/wall-triple-leaf-calibrated-solver-surface-parity.test.ts`.
  Selected next label: wall triple-leaf calibrated solver surface parity.
  That surface parity has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_landed_selected_coverage_refresh`.
  Cards, route posture, dynamic branch copy, method/corridor dossiers,
  Markdown reports, local saved replay, server snapshot replay, and the
  calculator API now show the calibrated source-family basis and `+/-4 dB`
  budget without moving `Rw 49 / STC 60 / C 1.4 / Ctr -7.4`.
  `R'w` and `DnT,w` stay parked as field input prompts on mixed
  lab-plus-field requests, not lab aliases. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh-contract.test.ts`.
  Selected next label: wall triple-leaf calibrated solver coverage
  refresh.
  That coverage refresh has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_landed_selected_local_substitution_mapping`.
  The 12-row executable matrix keeps NRC 2024 Assembly B at `Rw 49`,
  Assembly A at `Rw 58`, and Assembly D at `Rw 55`; keeps mixed
  `R'w` / `DnT,w` and building requests as basis-boundary prompts; and
  keeps duplicate / partial grouped topology out of calibrated support.
  Generic gypsum / glasswool and local Rockwool / MLV / plaster
  substitutions are the selected local substitution follow-up, while
  direct-fixed open-web and open-box timber remain ranked later. Selected
  next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution mapping.
  That local substitution mapping has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_landed_no_runtime_selected_formula_corridor`.
  It keeps the NRC Type C / glass-fiber calibrated runtime as the only
  currently supported triple-leaf control, while classifying generic
  gypsum / glasswool and local Rockwool / MLV / plaster grouped stacks as
  no-runtime formula corridor candidates. Field/building basis, duplicate
  grouping, and partial grouped topology stay blocked. Selected next
  action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution formula
  corridor.
  That formula corridor has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It defines source-absent lab `Rw` design corridors without runtime
  promotion: generic gypsum / glasswool maps to `Rw 49.3` with a
  `+/-6 dB` not-measured budget, and local Rockwool / MLV / plaster maps
  to `Rw 52.8` with a `+/-8 dB` not-measured budget. `STC`, `C`, `Ctr`,
  field, and building outputs stay blocked until a later adapter owns
  them, exact measured rows still outrank the corridor, and live runtime
  values remain unchanged. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution runtime
  corridor.
  That runtime corridor has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_landed_selected_surface_parity`.
  Complete grouped generic gypsum / glasswool now returns live lab
  ISO-rounded `Rw 50` from a `Rw 49.3` formula design corridor, and
  complete grouped local Rockwool / MLV / plaster now returns live lab
  ISO-rounded `Rw 53` from a `Rw 52.8` formula design corridor; both
  remain source-absent family-physics predictions with `STC`, `C`,
  `Ctr`, field, and building outputs blocked until separate adapters own
  them. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-surface-parity-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution surface
  parity.
  That surface parity closeout has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_landed_selected_coverage_refresh`.
  Output cards, route posture, dynamic branch copy, method dossier, local
  saved replay, server snapshot replay, calculator API payloads, and
  Markdown reports now show `Wall triple-leaf local substitution` with
  the same Rw-only candidate id, method, warning, and not-measured
  budgets. Generic gypsum / glasswool remains `Rw 50` with `+/-6 dB`;
  local Rockwool / MLV / plaster remains `Rw 53` with `+/-8 dB`. `STC`,
  `C`, and `Ctr` stay unsupported, while `R'w` and `DnT,w` stay field
  input prompts rather than lab aliases. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution coverage
  refresh.
  Targeted mapping, formula-corridor, runtime-corridor, surface-parity,
  coverage-refresh, direct-fixed open-web, and open-box transfer-owner
  contracts are green. Full `pnpm calculator:gate:current` passed on
  2026-05-19 before the open-box formula sprint: engine 459 files / 2635
  tests, web 87 files / 363 passed + 18 skipped, repo build 5/5, with
  only the known non-fatal optional `sharp/@img` and Zustand test-storage
  warnings.
  That coverage refresh has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_landed_selected_lab_spectrum_adapter`.
  It keeps generic `Rw 50` and local `Rw 53` frozen, keeps `R'w` and
  `DnT,w` under explicit field-context ownership, keeps direct-fixed
  open-web and open-box timber ranked behind the wall metric gap, and
  selects
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-contract.test.ts`;
  selected next label: wall triple-leaf local substitution lab STC/C/Ctr
  spectrum adapter.
  That lab spectrum adapter has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_landed_selected_surface_parity`.
  It preserves generic `Rw 50` and local `Rw 53` while promoting
  source-absent lab `STC`, `C`, and `Ctr` from the calculated curve:
  generic `STC 61 / C 1.6 / Ctr -7.2`, local `STC 64 / C 1.6 /
  Ctr -7.2`. Field `R'w` / `DnT,w`, building prediction, exact-source
  precedence, and hostile topology remain protected. Selected next
  action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution lab spectrum
  adapter surface parity.
  The adapter surface parity closeout has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_landed_selected_coverage_refresh`.
  It is no-runtime: cards, route posture, dynamic trace, dossiers,
  saved replay, server snapshot replay, API payloads, and reports now
  preserve the same adapter values and basis. Generic stays `Rw 50 /
  STC 61 / C 1.6 / Ctr -7.2`; local stays `Rw 53 / STC 64 / C 1.6 /
  Ctr -7.2`; field/building, exact precedence, and hostile topology
  boundaries remain protected. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh-contract.test.ts`.
  The adapter coverage refresh has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_landed_selected_field_context_harmonization`.
  It is no-runtime: generic remains `Rw 50 / STC 61 / C 1.6 / Ctr
  -7.2`, local remains `Rw 53 / STC 64 / C 1.6 / Ctr -7.2`, STC-only
  stays on the calculated lab spectrum adapter, and exact/calibrated
  precedence plus mixed field `R'w` / `DnT,w`, building, duplicate, and
  partial-topology boundaries remain protected. The next action is
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization-contract.test.ts`.
  Direct-fixed open-web and open-box timber remain ranked follow-ups
  behind this wall field context lane.
  The field context harmonization has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_landed_selected_field_context_surface_parity`.
  It is runtime movement for complete local Rockwool / MLV / plaster
  grouped triple-leaf `field_between_rooms` requests: the lab
  local-substitution curve (`Rw 53 / STC 64 / C 1.6 / Ctr -7.2`) is the
  direct anchor, and the current contract fixture returns `R'w 51` and
  `DnT,w 53` with a `+/-10 dB` source-absent field error budget. Missing
  field context remains `needs_input`, building prediction remains
  unsupported, and exact measured rows still win. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity-contract.test.ts`.
  Direct-fixed open-web and open-box timber remain ranked follow-ups
  behind the surface-parity closeout.
  The field-context surface parity closeout has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_landed_selected_open_web_direct_fixed_lining_transfer_owner`.
  It is no-runtime: cards, route posture, dynamic trace, dossiers,
  saved replay, server snapshot replay, API payloads, and reports now
  preserve the same local-substitution field basis and budget. The
  contract fixture remains `R'w 51 / DnT,w 53`, the workbench/API
  fixture remains `R'w 52 / DnT,w 53`, and both carry the `+/-10 dB`
  source-absent field budget without calling it measured field evidence
  or a lab `Rw`/`STC` relabel. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_contract_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner-contract.test.ts`.
  Direct-fixed open-web is selected next; open-box timber remains the
  ranked follow-up.
  The direct-fixed open-web transfer-owner contract has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_contract_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_landed_no_runtime_selected_formula_corridor`.
  This is no-runtime owner work: it classifies 54 UBIQ direct-fixed
  open-web exact rows across FL-23, FL-25, and FL-27; owns carrier
  geometry, deck mass, upper finish delta, direct lining attachment,
  `Ln,w` / `CI` / `Ln,w+CI` transfer, `Rw` bridge, exact precedence,
  source-absent budget, and negative boundaries; and keeps resilient
  suspended-ceiling rows, open-box timber, field/building outputs, and
  ASTM/IIC aliases blocked. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining formula
  corridor.
  The direct-fixed open-web formula corridor has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  This is no-runtime formula-corridor work: it defines same-family
  direct-fixed interpolation from the 54 UBIQ exact rows by FL-23 /
  FL-25 / FL-27 board schedule, 16/19 mm INEX deck, finish package, and
  200/300/400 mm carrier depth. The representative 250 mm FL-23 / 19 mm
  timber-underlay design row is `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`,
  `Rw 51`, and `Rw+Ctr 43.5`, with source-absent design budgets of
  `+/-4 dB` for `Ln,w` and `+/-3 dB` for `Rw`. Exact rows still win;
  out-of-band carrier depths, field/building outputs, and ASTM/IIC
  aliases remain blocked. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining runtime
  corridor.
  The direct-fixed open-web runtime corridor has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_landed_selected_surface_parity`.
  It promotes complete source-absent element-lab direct-fixed open-web
  stacks through
  `broad_accuracy_floor_open_web_direct_fixed_lining_direct_source_interpolation_formula_corridor`
  instead of the broad floor-family fallback. FL-23/FL-25/FL-27
  same-family source anchors now cover mid-depth direct-fixed variants:
  the 250 mm FL-23 / 19 mm timber-underlay runtime returns `Ln,w 71`,
  `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and `Rw+Ctr 43.5`; FL-25 bare and
  FL-27 carpet variants keep their formula-corridor pins. Runtime impact
  budgets stay visible as not-measured source-absent budgets (`+/-4 dB`
  for `Ln,w`, `+/-1.5 dB` for `CI`, `+/-4.5 dB` for `Ln,w+CI`; the
  formula owner still carries `+/-3 dB` for `Rw`). Exact rows still win;
  resilient supported-band stacks, out-of-band depths, duplicate
  carriers, field/building outputs, and ASTM/IIC aliases remain outside
  the runtime. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining surface parity.
  The direct-fixed open-web surface parity gate has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_landed_selected_coverage_refresh`.
  It keeps output cards, route posture, impact lane labels, confidence
  provenance, metric-basis copy, corridor/method dossier, local saved
  replay, server snapshot replay, calculator API, impact-only API, and
  Markdown report on the same source-absent direct-fixed lab basis without
  moving runtime values. The visible FL-23 timber pin still reports
  `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and `Rw+Ctr 43.5`
  inside the FL-23/FL-25/FL-27 direct-fixed source grid with
  source-absent budgets. Exact rows, resilient supported-band stacks,
  out-of-band depths, duplicate carriers, field/building outputs, and
  ASTM/IIC aliases remain outside this lane. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining coverage refresh.
  The direct-fixed open-web coverage refresh has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_landed_selected_open_box_timber_transfer_owner`.
  This no-runtime coverage refresh moves the FL-23/FL-25/FL-27
  direct-fixed lane out of follow-up status and into the broad matrix:
  FL-23 keeps `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and
  `Rw+Ctr 43.5`; FL-25 keeps `Ln,w 77`; FL-27 keeps `Ln,w 63`. Exact
  source precedence stays first for the 300 mm FL-23 exact row,
  resilient supported-band stacks stay on their separate lane,
  out-of-band depths and duplicate carriers stay outside direct-fixed,
  and field/building plus ASTM/IIC outputs remain boundary rows.
  Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts`.
  Selected next label: floor open-box timber similarity transfer owner.
  The open-box timber similarity transfer-owner contract has now landed as
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_landed_no_runtime_selected_formula_corridor`.
  This no-runtime owner gate classifies 15 TUAS open-box timber exact
  rows on the 370 mm `open_box_timber_slab` carrier, separates the 10
  predictor-owned rows from the 5 exact-only hybrid / fragmented package
  rows, and owns the support family, laminate/EPS finish pair, upper
  package, lower ceiling family, fragmented exact-equivalence, ISO lab
  `Ln,w` / `CI` / `CI,50-2500` / `Ln,w+CI` transfer, `Rw` companion
  semantics, exact precedence, source-absent budget, and negative
  boundaries. Open-web steel, raw bare open-box carriers, disjoint
  duplicate roles, partial finish packages, field/building outputs, and
  ASTM/IIC aliases stay blocked. Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`.
  Selected next label: floor open-box timber similarity formula corridor.
  The open-box timber similarity formula corridor has now landed as
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  This no-runtime gate defines TUAS same-family package-transfer design
  payloads without moving public runtime values: the dry gypsum-fiber
  packet probe is `Ln,w 50.8` / `Rw 66`, with `+/-7 dB` impact and
  `+/-6 dB` airborne design budgets. Exact TUAS rows still win; raw
  bare open-box carriers, exact-only hybrid and mixed staged packets,
  field/building outputs, and ASTM/IIC aliases stay blocked. Selected
  next action:
  `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts`.
  Selected next label: floor open-box timber similarity runtime corridor.
  The open-box timber similarity runtime corridor has now landed as
  `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_landed_selected_surface_parity`.
  Complete source-absent dry gypsum-fiber, thin laminate/EPS, and
  reinforced-ceiling open-box timber packages now promote through the
  `broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor`
  runtime basis. The dry gypsum-fiber runtime pin is `Ln,w 50.8`,
  `CI,50-2500 3.3`, and `Rw 66`; the not-measured budgets stay visible
  as `+/-7 dB` for `Ln,w`, `+/-2.5 dB` for `CI,50-2500`, and `+/-6 dB`
  for `Rw`. Exact TUAS rows still win; raw bare open-box, exact-only
  hybrid, mixed staged, field/building, and ASTM/IIC aliases stay
  blocked. Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-surface-parity-contract.test.ts`.
  Selected next label: floor open-box timber similarity surface parity.
- Current checkpoint:
  [calculator/CHECKPOINT_2026-05-18_OPEN_BOX_TIMBER_TRANSFER_OWNER.md](./calculator/CHECKPOINT_2026-05-18_OPEN_BOX_TIMBER_TRANSFER_OWNER.md).
- End-of-day checkpoint:
  [calculator/CHECKPOINT_2026-05-18_END_OF_DAY_BROAD_ACCURACY.md](./calculator/CHECKPOINT_2026-05-18_END_OF_DAY_BROAD_ACCURACY.md).
  Use this first when resuming after commit `c248db8`; it maps the
  landed broad-accuracy slice to implementation/docs and lists the
  open-box timber formula/runtime/surface-parity items that did not land.
- Pre-sprint revalidation:
  [calculator/CHECKPOINT_2026-05-19_PRE_SPRINT_REVALIDATION_AND_OPEN_BOX_FORMULA_PLAN.md](./calculator/CHECKPOINT_2026-05-19_PRE_SPRINT_REVALIDATION_AND_OPEN_BOX_FORMULA_PLAN.md).
  Use this before implementing the next sprint; it records the fresh
  full current-gate pass and the ordered open-box timber formula,
  runtime, surface-parity, and matrix-refresh sequence.
- Active mainline has been realigned after the no-runtime ASTM scaffold:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MAINLINE_REALIGNMENT_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MAINLINE_REALIGNMENT_HANDOFF.md).
- Active tactical plan:
  [calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md](./calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md).
- Research-backed remaining-road checkpoint:
  [calculator/CHECKPOINT_2026-05-14_RESEARCH_BACKED_COMPANY_INTERNAL_ROADMAP.md](./calculator/CHECKPOINT_2026-05-14_RESEARCH_BACKED_COMPANY_INTERNAL_ROADMAP.md).
  Use this to keep the next work tied to company-internal acceptance
  scenarios, ISO lab/field/building basis separation, targeted source
  calibration, implementation-vs-doc drift cleanup, and zero complete
  in-scope `low_confidence` / `screening_fallback` finals.
- Current checkpoint review:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_CHECKPOINT_REVIEW_AND_VALIDATION.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_CHECKPOINT_REVIEW_AND_VALIDATION.md).
  Use this as the checkpoint before the opening/leak A-weighted
  formula-corridor handoff below; its selected formula action has now
  landed.
- Opening/leak A-weighted formula-corridor handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`
  has landed with selection status
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  Formula pins: field `Dn,A 35.9`; field `DnT,A 36.1`; building `DnT,A 31.3`.
  The selected next action, now landed, is
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`;
  selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts`;
  selected next label, now landed: opening/leak Dn,A / DnT,A
  spectrum-adapter runtime corridor.
  Selected next label literal: opening/leak Dn,A / DnT,A spectrum-adapter runtime corridor.
- Opening/leak A-weighted runtime-corridor handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`
  has landed with selection status
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_landed_selected_surface_parity`.
  Runtime pins: field `Dn,A 35.9`; field `DnT,A 36.1`; building `DnT,A 31.3`.
  `frequencyBandSet` is now a runtime input: missing it keeps A-weighted
  outputs unsupported. The selected next action, now landed, is
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`;
  selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts`;
  selected next label, now landed: opening/leak Dn,A / DnT,A card/report/API parity.
- Current opening/leak A-weighted surface-parity handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`
  has landed with selection status
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_landed_selected_matrix_v6_refresh`.
  It preserves field `Dn,A 35.9`, field `DnT,A 36.1`, building
  `DnT,A 31.3`, and carries the frequency band set through cards,
  report, API, saved replay, server snapshot replay, and workbench
  input surface. Selected next action:
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`;
  selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts`;
  selected next label: company-internal matrix v6 refresh after opening/leak Dn,A / DnT,A surface parity.
- Current company-internal Matrix V6 handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_MATRIX_V6_REFRESH_AFTER_A_WEIGHTED_SURFACE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_MATRIX_V6_REFRESH_AFTER_A_WEIGHTED_SURFACE_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`
  has landed with selection status
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_landed_selected_boundary_revalidation`.
  Matrix V6 has 71 rows, preserves field `Dn,A 35.9`, field
  `DnT,A 36.1`, and building `DnT,A 31.3`, retires the stale
  A-weighted unsupported row, and keeps building `Dn,A`,
  missing `frequencyBandSet`, lab aliases, ASTM aliases, and
  exact-source precedence as explicit boundaries. Selected next action:
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`;
  selected next file:
  `packages/engine/src/company-internal-building-astm-boundary-revalidation-contract.test.ts`;
  selected next label: building partial-context and ASTM parked-boundary revalidation.
- Current building/ASTM boundary revalidation handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_HANDOFF.md).
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`
  has landed with selection status
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_landed_selected_final_internal_use_rehearsal`.
  It proves building partial-context and opening/leak building
  missing-owner rows remain `needs_input` with named physical owners such
  as `sourceRoomVolumeM3`, no value pins, and no budget. It also proves
  floor ASTM `IIC` / `AIIC` and airborne A-weighted-to-ASTM alias rows
  remain unsupported without ISO alias values. Selected next action:
  `company_internal_final_internal_use_rehearsal_after_boundary_revalidation_plan`;
  selected next file:
  `packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`;
  selected next label: final internal-use rehearsal and operating envelope.
- Current remaining-gap analysis and execution plan:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md).
  Use this for the concrete path to controlled company-internal
  readiness: final internal-use rehearsal.
- Final rehearsal planning checkpoint:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_FINAL_REHEARSAL_PLANNING_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_FINAL_REHEARSAL_PLANNING_HANDOFF.md).
  Use this for the exact implementation order before declaring
  controlled company-internal readiness. It compares the current
  implementation with the living docs, confirms Matrix V6 and boundary
  revalidation are landed, and makes the next file
  `packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`.
- Controlled company-internal operating envelope:
  [calculator/COMPANY_INTERNAL_OPERATING_ENVELOPE.md](./calculator/COMPANY_INTERNAL_OPERATING_ENVELOPE.md).
  Use `COMPANY_INTERNAL_OPERATING_ENVELOPE.md` after the final rehearsal
  is green to explain which routes are ready, which ask for input, and
  which remain intentionally unsupported.
- Next plain label: company-internal ISO floor / wall solver coverage
  and field/building missing-input safety.
- Previous company-internal input-surface step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_INPUT_SURFACE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_INPUT_SURFACE_HANDOFF.md).
  `company_internal_opening_leak_building_input_surface_plan` has
  landed. The Dynamic Calculator wall input surface now feeds the
  opening/leak field/building adapter from first-class physical fields:
  opening package, partition geometry, receiving-room volume/RT60,
  source-room volume, flanking/junction class, conservative flanking
  assumption, junction coupling length, and building output basis.
  UI-derived field input preserves `R'w 36.4` / `Dn,w 36.7` /
  `DnT,w 36.9` with `+/-8 dB`; UI-derived building input preserves
  `R'w 31.6` / `DnT,w 32.1` with `+/-10 dB`. Selection status:
  `company_internal_opening_leak_building_input_surface_landed_selected_matrix_v5_refresh`.
  Selected next action:
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`.
  Selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts`.
  Selected next label: company-internal matrix v5 refresh after
  opening/leak field/building input surface.
- Latest company-internal Matrix V5 step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V5_REFRESH_AFTER_OPENING_LEAK_INPUT_SURFACE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V5_REFRESH_AFTER_OPENING_LEAK_INPUT_SURFACE_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`
  has landed. Matrix V5 records opening/leak field `R'w 36.4` /
  `Dn,w 36.7` / `DnT,w 36.9` and building `R'w 31.6` / `DnT,w 32.1`
  as supported calculation-grade rows, retires the stale
  `wall.opening_leak_composite_building_boundary.unsupported` row, and
  keeps `Dn,A` / `DnT,A` unsupported until a spectrum-adapter owner
  exists. Selection status:
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_landed_selected_opening_leak_a_weighted_adapter_owner`.
  Selected next action:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`.
  Selected next file:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts`.
- Latest company-internal opening/leak A-weighted owner step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_OWNER_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_OWNER_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`
  has landed as a no-runtime owner gate. Field opening/leak remains
  `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9`; building opening/leak
  remains `R'w 31.6` / `DnT,w 32.1`. `Dn,A` / `DnT,A` still stay
  unsupported until the formula corridor owns `frequencyBandSet`, the
  same-route spectrum curve, ISO 717 C or A-weighted adapter,
  uncertainty budget, exact A-weighted packet precedence, and lab
  `Rw` / `STC` alias guard. Selection status:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_landed_no_runtime_selected_formula_corridor`.
  Selected next action:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`.
  Selected next file:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts`.
  Selected next label: opening/leak Dn,A / DnT,A spectrum-adapter formula corridor.
- Preceding company-internal Matrix V4 step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V4_REFRESH_AFTER_LNT50_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V4_REFRESH_AFTER_LNT50_SURFACE_PARITY_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`
  has landed and selected the opening/leak adapter owner contract.
  Selection status:
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_landed_selected_opening_leak_building_adapter_owner`.
  Selected next action, now landed:
  `company_internal_opening_leak_building_adapter_owner_contract_plan`.
  Selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-building-adapter-owner-contract.test.ts`.
  Owner contract selection status, now superseded by the runtime
  corridor:
  `company_internal_opening_leak_building_adapter_owner_contract_landed_no_runtime_selected_runtime_corridor`.
  Owner selected next action, now landed:
  `company_internal_opening_leak_building_runtime_corridor_plan`.
  Owner selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts`.
  Runtime corridor landed with complete field `R'w 36.4` / `DnT,w 36.9`
  and complete building `R'w 31.6` / `DnT,w 32.1` through separate
  opening/leak field/building adapters. Selection status, now superseded
  by surface parity:
  `company_internal_opening_leak_building_runtime_corridor_landed_selected_surface_parity`.
  Runtime selected next action, now landed:
  `company_internal_opening_leak_building_surface_parity_plan`.
  Runtime selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-building-surface-parity-contract.test.ts`.
  Runtime selected next label, now landed:
  opening/leak field/building card/report/API parity.
- Preceding company-internal surface-parity step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`
  has landed as a no-runtime surface parity closeout. Steel suspended-
  ceiling lab `Ln,w 51.6` / `DeltaLw 22.4` stays frozen; complete field
  context with `fieldKDb = 3`, receiving-room volume `60 m3`, and
  `CI,50-2500 = -1 dB` returns `L'n,w 54.6`, `L'nT,w 51.8`, and
  `L'nT,50 50.8`. Cards, corridor dossier, saved/server replay,
  calculator API, impact-only API, and Markdown report now carry the
  same
  `estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`
  basis and `+/-7 dB` source-absent field adapter budget. ASTM `IIC` /
  `AIIC` remain unsupported. Selection status:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_landed_selected_matrix_v4_refresh`.
  Selected next action:
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`.
  Selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts`.
  Selected next label, now landed by Matrix V4: company-internal matrix v4 refresh after steel L'nT,50 surface parity.
- Preceding company-internal Matrix V3 step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V3_REFRESH_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V3_REFRESH_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`
  has landed. Matrix V3 retires
  `floor.lightweight_steel_suspended_ceiling_delta_lw.needs_input` and
  records
  `floor.lightweight_steel_suspended_ceiling_delta_lw.runtime` as
  supported lab `Ln,w 51.6` / `DeltaLw 22.4` through the
  `steel_suspended_ceiling_lower_reference` formula corridor. Selection
  status:
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_landed_selected_steel_suspended_ceiling_low_frequency_lnt50_owner`.
  Matrix V3 selected next action, now landed by the low-frequency owner:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan`.
  Matrix V3 selected next file, now landed by the low-frequency owner:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`.
- Preceding low-frequency `L'nT,50` owner step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan`
  landed as the no-runtime owner boundary with selection status
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_landed_no_runtime_selected_runtime_corridor`.
  It requires explicit `lowFrequencyImpactSpectrumOrCI50_2500Owner`
  before source-absent `L'nT,50` runtime can promote. Owner contract
  file:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`.
  Owner selected next action, now landed by the runtime corridor:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`.
  Owner selected next file, now landed by the runtime corridor:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts`.
- Preceding steel surface-parity step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan`
  has landed. Complete lower suspended-ceiling plus upper/reference
  package input still returns lab `Ln,w 51.6` / `DeltaLw 22.4`; cards,
  dossier, saved/server replay, calculator API, impact-only API, and
  Markdown report now show the same suspended-ceiling lower-reference
  basis and source-absent budgets. Selection status:
  `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_landed_selected_matrix_v3_refresh`.
  Surface parity selected next action, now landed by Matrix V3:
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`.
  Surface parity selected next file, now landed by Matrix V3:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts`.
- Preceding company-internal matrix step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V2_REFRESH_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V2_REFRESH_HANDOFF.md).
  Preceding building reconciliation landed
  `company_internal_airborne_building_prediction_runtime_terms_owner_contract_plan`
  with selection status
  `company_internal_airborne_building_prediction_runtime_terms_owner_contract_landed_selected_matrix_v2_refresh`
  and selected
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts`,
  which is now landed by Matrix V2.
  `company_internal_calculation_grade_mainline_matrix_v2_refresh_plan`
  has landed. It preserves the accepted Gate AR/AS/AT building runtime,
  retires the stale building row, turns steel suspended-ceiling
  `DeltaLw` into a precise `needs_input` owner prompt, and removes the
  hidden heavy-floating `screening_fallback` matrix origin.
  Selection status:
  `company_internal_calculation_grade_mainline_matrix_v2_refresh_landed_selected_steel_suspended_ceiling_delta_lw_runtime_corridor`.
  Matrix V2 selected next action, now landed by the steel `DeltaLw`
  runtime corridor:
  `company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan`.
  Matrix V2 selected next file, now landed by the steel `DeltaLw`
  runtime corridor:
  `packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts`.
- Preceding low-frequency runtime step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`
  landed the source-absent `L'nT,50 50.8` runtime with selection status
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_landed_selected_surface_parity`.
  Runtime selected next action, now landed by surface parity:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`.
  Runtime selected next file, now landed by surface parity:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts`.
  Runtime selected next label, now landed by surface parity:
  steel suspended-ceiling L'nT,50 card/report/API parity.
- Preceding surface-parity selected next action, now landed:
  `company_internal_opening_leak_building_input_surface_plan`.
- Preceding surface-parity selected next file, now landed:
  `apps/web/features/workbench/company-internal-opening-leak-building-input-surface.test.ts`.
- Preceding surface-parity selected next label, now landed:
  opening/leak field/building input surface.
- Latest opening/leak field/building surface parity:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_HANDOFF.md).
  `company_internal_opening_leak_building_surface_parity_plan`
  has landed with selection status
  `company_internal_opening_leak_building_surface_parity_landed_selected_input_surface`.
  Cards, dossiers, saved replay, API, and reports now carry the same
  source-absent field/building values and budgets without lab or
  A-weighted aliases.
- ASTM `IIC` / `AIIC` work is parked as no-runtime boundary history.
  Do not continue Gate BW unless a later active plan explicitly selects
  it again.

Parked ASTM handoff history:

- Gate BV has now landed:
  `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`.
- Latest checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_HANDOFF.md).
- Gate BV selection status:
  `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_landed_no_runtime_selected_contour_rating_owner_gate_bw`.
- Selected next action:
  `gate_bw_personal_use_mvp_floor_impact_astm_iic_aiic_contour_rating_owner_plan`.
- Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bw-floor-impact-astm-iic-aiic-contour-rating-owner-contract.test.ts`.
- Next plain label: floor-impact ASTM IIC/AIIC contour rating owner.
- Gate BV is no-runtime. It owns the declared ASTM impact
  one-third-octave curve scaffold for lab `IIC` and field `AIIC`, but
  does not ingest standard text, source documents, or measured values and
  does not promote runtime values. Current runtime still lacks the
  executable ASTM E989 contour/rating owner, exact ASTM source
  precedence runtime owner, source-absent ASTM uncertainty, and visible
  parity. ISO `Ln,w` / `DeltaLw`, ISO field impact values,
  building-prediction metrics, and ASTM E413/STC rows must not alias to
  ASTM E989 impact ratings.
- Preceding Gate BU landed:
  `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`.
- Preceding Gate BU checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_HANDOFF.md).
- Gate BU selection status:
  `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_exact_source_owner_closed_no_runtime_selected_rating_curve_owner_scaffold_gate_bv`.
- Gate BU selected next action:
  `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`.
- Gate BU selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv-floor-impact-astm-iic-aiic-rating-curve-owner-scaffold-contract.test.ts`.
- Gate BU next plain label: floor-impact ASTM IIC/AIIC rating curve owner scaffold.
- Preceding Gate BT landed:
  `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`.
- Preceding Gate BT checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_HANDOFF.md).
- Gate BT selection status:
  `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_adapter_bridge_landed_no_runtime_selected_rating_procedure_exact_source_owner_gate_bu`.
- Gate BT selected next action:
  `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`.
- Gate BT selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts`.
- Gate BT next plain label: floor-impact ASTM IIC/AIIC rating procedure and exact-source owner.
- Preceding Gate BS landed:
  `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`.
- Preceding Gate BS checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_HANDOFF.md).
- Gate BS selection status:
  `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_closed_no_runtime_selected_metric_schema_adapter_bridge_gate_bt`.
- Gate BS selected next action:
  `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`.
- Gate BS selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts`.
- Gate BS next plain label: floor-impact ASTM IIC/AIIC metric schema and adapter bridge.
- Preceding Gate BR landed:
  `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`.
- Preceding Gate BR checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_HANDOFF.md).
- Gate BR selection status:
  `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_landed_no_runtime_selected_runtime_corridor_gate_bs`.
- Selected next action:
  `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`.
- Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts`.
- Next plain label: floor-impact ASTM IIC/AIIC runtime corridor.
- Gate BR is no-runtime. It defines the ASTM lab `IIC` and field
  `AIIC` owner contract, keeps complete ISO impact formulas unsupported
  for ASTM outputs, and records that ISO `Ln,w` / `DeltaLw`, field
  `L'n,w` / `L'nT,w`, and building-prediction metrics must not alias to
  ASTM ratings.
- Preceding Gate BQ landed:
  `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`.
- Preceding Gate BQ checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_HANDOFF.md).
- Gate BQ selection status:
  `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_landed_no_runtime_selected_floor_impact_astm_iic_aiic_adapter_gate_br`.
- Gate BQ selected next action:
  `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`.
- Gate BQ selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts`.
- Gate BQ next plain label: floor-impact ASTM IIC/AIIC adapter contract.
- Gate BQ refreshed the executable matrix after the reinforced-concrete
  cleanup. The old low-confidence coverage-gap row is gone; complete
  owner input stays lab `Ln,w 58.1` / `DeltaLw 13.7` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`,
  partial owner input stays `needs_input`, exact source rows still win,
  and field/building/ASTM boundaries remain non-alias boundaries.
- Preceding Gate BP has now landed:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan`.
- Preceding Gate BP checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_HANDOFF.md).
- Gate BP selection status:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_landed_selected_matrix_refresh_gate_bq`.
- Selected next action:
  `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`.
- Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts`.
- Next plain label: coverage matrix refresh after reinforced-concrete cleanup.
- Gate BP keeps Gate BO runtime values frozen while making the
  reinforced-concrete cleanup visible across cards, trace, report,
  saved replay, calculator API, and impact-only API. Complete owner
  input returns lab `Ln,w 58.1` / `DeltaLw 13.7` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`;
  incomplete owner input shows impact cards as `needs_input` with named
  physical fields instead of a low-confidence result.
- Preceding Gate BO landed:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan`;
  selection status:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_landed_selected_surface_parity_gate_bp`;
  selected next action:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp-reinforced-concrete-cleanup-surface-parity-contract.test.ts`.
- Preceding Gate BN selected Gate BO:
  `gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_plan`;
  selection status:
  `gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_landed_no_runtime_selected_reinforced_concrete_low_confidence_cleanup_gate_bo`;
  selected next action:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo-reinforced-concrete-low-confidence-cleanup-contract.test.ts`.
  Next plain label: reinforced-concrete low-confidence cleanup.
  Gate BN pinned steel suspended-ceiling `Ln,w 62.2`.

## Supporting Reads

- [calculator/CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md)
  — productization closeout: server-backed project storage v1 closed.
- [calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md)
  — historical broad handoff: broad validation green and calculator
  accuracy/coverage refocus selected.
- [calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_HANDOFF.md](./calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_HANDOFF.md)
  — company-internal daily-use ready handoff: Gate AU closed and
  selected Gate AV post-release accuracy/adapters roadmap.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_HANDOFF.md)
  — post-release roadmap handoff: Gate AV landed no-runtime and selected
  Gate AW source-absent solver gap cartography. Landed action:
  `gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan`;
  selection status:
  `gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw`;
  selected next action:
  `gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_HANDOFF.md)
  — source-absent cartography handoff: Gate AW landed no-runtime source-absent
  solver gap cartography and selected Gate AX advanced wall source-absent solver contract.
  Landed action:
  `gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`;
  selection status:
  `gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_landed_no_runtime_selected_advanced_wall_source_absent_solver_contract_gate_ax`;
  selected next action:
  `gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_HANDOFF.md)
  — advanced wall contract handoff: Gate AX landed no-runtime advanced wall source-absent solver contract
  and selected Gate AY runtime corridor. Landed action:
  `gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`;
  selection status:
  `gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_landed_no_runtime_selected_runtime_corridor_gate_ay`;
  selected next action:
  `gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_HANDOFF.md)
  — advanced wall runtime handoff: Gate AY landed the advanced wall
  source-absent solver runtime corridor and selected Gate AZ input
  surface. Landed action:
  `gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`;
  selection status:
  `gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_landed_selected_input_surface_gate_az`;
  selected next action:
  `gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts`.
  Short label: advanced wall source-absent solver runtime corridor.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_HANDOFF.md)
  — advanced wall input-surface handoff: Gate AZ landed the advanced wall
  source-absent solver input surface and selected Gate BA floor-impact
  source-absent solver gap cartography. Landed action:
  `gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`;
  selection status:
  `gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_landed_selected_floor_impact_source_absent_solver_gap_cartography_gate_ba`;
  selected next action:
  `gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts`.
  Short label: advanced wall source-absent solver input surface.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_HANDOFF.md)
  — prior calculator handoff: Gate BA landed no-runtime floor-impact
  source-absent solver gap cartography and selected Gate BB
  floor-impact source-absent input contract. Landed action:
  `gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`;
  selection status:
  `gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_landed_no_runtime_selected_floor_impact_source_absent_input_contract_gate_bb`;
  selected next action:
  `gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts`.
  Short label: floor-impact source-absent solver gap cartography.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_HANDOFF.md)
  — prior calculator handoff: Gate BB landed no-runtime
  floor-impact source-absent input contract and selected Gate BC
  floor-impact source-absent formula corridor. Landed action:
  `gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`;
  selection status:
  `gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_landed_no_runtime_selected_formula_corridor_gate_bc`;
  selected next action:
  `gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts`.
  Short label: floor-impact source-absent input contract.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_HANDOFF.md)
  — prior calculator handoff: Gate BC landed no-runtime
  floor-impact source-absent formula corridor and selected Gate BD
  floor-impact source-absent runtime corridor. Landed action:
  `gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`;
  selection status:
  `gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_bd`;
  selected next action:
  `gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts`.
  Short label: floor-impact source-absent formula corridor.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md)
  — prior calculator handoff: Gate BD landed the floor-impact
  source-absent runtime corridor and selected Gate BE surface parity.
  Landed action:
  `gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`;
  selection status:
  `gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_landed_selected_surface_parity_gate_be`;
  selected next action:
  `gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts`.
  Complete heavy-concrete combined input now returns `Ln,w 44.4` /
  `DeltaLw 30.1` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
  with `+/-6.5 dB` / `+/-5.5 dB` not-measured budgets. Short label:
  floor-impact source-absent runtime corridor. Next plain label:
  floor-impact source-absent surface parity. Validation passed on
  2026-05-13 with focused Gate BD, BA-BD continuity, impact regression,
  engine typecheck/build, `pnpm calculator:gate:current`, and
  `git diff --check`.
- [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_HANDOFF.md)
  — prior calculator handoff: Gate BI landed no-runtime
  floor-impact field/building adapter ownership and selected the
  runtime-producing Gate BJ corridor. Landed action:
  `gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`;
  selection status:
  `gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_landed_no_runtime_selected_field_building_runtime_corridor_gate_bj`;
  selected next action:
  `gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bj-floor-impact-field-building-runtime-corridor-contract.test.ts`.
  Next plain label: floor-impact field/building runtime corridor. Gate
  BI keeps lab and field values unchanged, keeps `IIC` / `AIIC`
  unsupported, and records the company-internal calculation-grade bar:
  common complete-input scenarios should not end on live
  low-confidence/screening final answers.
- [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_HANDOFF.md)
  — prior calculator handoff: Gate BJ landed the floor-impact
  field/building runtime corridor and selected Gate BK steel-floor
  low-confidence fallback cleanup. Landed action:
  `gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`;
  selection status:
  `gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_landed_selected_steel_floor_low_confidence_cleanup_gate_bk`;
  selected next action:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts`.
  Gate BJ pins field-volume `L'n,w 52.3` / `L'nT,w 49.9`, building
  direct+flanking `L'nT,w 52.4`, direct+flanking medium confidence, and
  `source_absent_field_building_adapter_error_budget`; source-absent
  `L'nT,50` stays blocked until a low-frequency owner exists. Next plain
  label: steel-floor low-confidence fallback cleanup.
- [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_HANDOFF.md)
  — latest calculator handoff: Gate BK landed the steel-floor
  low-confidence fallback cleanup and selected Gate BL steel-floor
  suspended-ceiling input surface. Landed action:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`;
  selection status:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_landed_selected_suspended_ceiling_input_surface_gate_bl`;
  selected next action:
  `gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts`.
  Gate BK adds
  `predictor_lightweight_steel_suspended_ceiling_corridor_estimate`
  for complete steel suspended-ceiling-only lab `Ln,w 62.2` with
  `+/-6 dB` source-absent budget, while Gate AD steel upper/lower
  `Ln,w 55.6` / `DeltaLw 22.4` stays frozen. Next plain label:
  steel-floor suspended-ceiling input surface.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_HANDOFF.md)
  — prior calculator handoff: Gate BH landed no-runtime
  floor-impact source-absent coverage matrix refresh after the
  `Heavy concrete combined input surface`. Landed action:
  `gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`;
  selection status:
  `gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_landed_no_runtime_selected_field_building_adapter_gate_bi`;
  selected next action:
  `gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`.
  The refreshed executable matrix has 21 floor rows and adds Gate BF/BG
  combined-heavy rows plus `floor.building_impact.prediction_adapter_boundary`.
  Complete and safe-reordered combined-heavy input remains lab
  `Ln,w 44.4` / `DeltaLw 30.1` with the same source-absent
  not-measured budgets. Short label: floor-impact source-absent coverage
  matrix refresh. Gate BI plain label: floor-impact field/building adapter contract.
  Validation passed on 2026-05-13 with focused Gate BH, Gate BG/BH
  continuity, engine typecheck, `pnpm calculator:gate:current`, full
  `pnpm check`, and whitespace guard clean.
- [calculator/CHECKPOINT_2026-05-13_POST_GATE_BH_PLAN_AND_TEST_REVIEW.md](./calculator/CHECKPOINT_2026-05-13_POST_GATE_BH_PLAN_AND_TEST_REVIEW.md)
  — post-Gate-BH checkpoint review: docs and implementation still agree
  that Gate BI is the next floor-impact field/building adapter contract.
  It records the remaining owner/input gaps, keeps lab values and
  budgets frozen, keeps building-impact runtime unsupported, and defines
  the next Gate BI execution order. Validation passed with focused Gate
  BH, `pnpm calculator:gate:current`, and `git diff --check`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_HANDOFF.md)
  — prior calculator handoff: Gate BG landed no-runtime
  floor-impact source-absent post-input-surface revalidation after the
  `Heavy concrete combined input surface` and selected Gate BH
  coverage matrix refresh. Landed action:
  `gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`;
  selection status:
  `gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_landed_no_runtime_selected_coverage_matrix_refresh_gate_bh`;
  selected next action:
  `gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts`.
  The revalidated runtime remains lab `Ln,w 44.4` / `DeltaLw 30.1`
  through the Gate BD predictor with the same source-absent
  not-measured budgets. Safe reorders, missing load basis, duplicate
  concrete base ownership, exact source precedence, and field/ASTM
  boundaries are covered. Short label: floor-impact source-absent
  post-input-surface revalidation. Next plain label:
  floor-impact source-absent coverage matrix refresh. Validation passed
  on 2026-05-13 with focused Gate BG, Gate BF/BG continuity, engine
  typecheck, `pnpm calculator:gate:current`, full `pnpm check`, and
  `git diff --check`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_HANDOFF.md)
  — prior calculator handoff: Gate BF landed the floor-impact
  source-absent input surface for the `Heavy concrete combined input surface`
  and selected Gate BG post-input-surface revalidation. Landed action:
  `gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`;
  selection status:
  `gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_landed_selected_revalidation_gate_bg`;
  selected next action:
  `gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg-floor-impact-source-absent-post-input-surface-revalidation-contract.test.ts`.
  Complete UI-derived heavy-concrete combined input now returns the
  same lab `Ln,w 44.4` / `DeltaLw 30.1` through the Gate BD runtime
  corridor with the same source-absent not-measured budgets. Partial
  fields stay `needs_input`, ambiguous concrete base ownership is
  unsafe, exact source precedence remains first, and field/building/ASTM
  aliases remain blocked. Short label: floor-impact source-absent input
  surface. Next plain label: floor-impact source-absent post-input-surface
  revalidation.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md)
  — prior calculator handoff: Gate BE landed the floor-impact
  source-absent surface parity for the `Heavy concrete combined formula corridor`
  and selected Gate BF input surface. Landed action:
  `gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`;
  selection status:
  `gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_landed_selected_input_surface_gate_bf`;
  selected next action:
  `gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts`.
  Runtime stays lab `Ln,w 44.4` / `DeltaLw 30.1` with the same
  source-absent not-measured budgets. Short label: floor-impact
  source-absent surface parity. Next plain label: floor-impact
  source-absent input surface. Validation passed on 2026-05-13 with
  focused Gate BE, Gate BD/BE continuity, focused web surface parity,
  engine/web typecheck, `pnpm calculator:gate:current`, full
  `pnpm check`, and `git diff --check`.
- [calculator/CHECKPOINT_2026-05-13_POST_GATE_BD_FULL_REVALIDATION_AND_GATE_BE_PLAN_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_POST_GATE_BD_FULL_REVALIDATION_AND_GATE_BE_PLAN_HANDOFF.md)
  — latest broad revalidation and planning checkpoint: post-Gate BD
  `pnpm check` passed with lint, typecheck, engine 522 files / 3103
  tests, web 182 files / 985 passed + 18 skipped, and build 5/5 after
  two lint-only cleanups. It confirms Gate BE surface parity is the
  first next implementation step.
- [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  — active calculator tactical plan; currently Gate BI floor-impact
  field/building adapter contract, revalidated by the post-Gate-BH
  checkpoint.
- [calculator/SLICE_PERSONAL_USE_MVP_GATE_AV_POST_RELEASE_ACCURACY_AND_ADAPTER_ROADMAP_PLAN.md](./calculator/SLICE_PERSONAL_USE_MVP_GATE_AV_POST_RELEASE_ACCURACY_AND_ADAPTER_ROADMAP_PLAN.md)
  — Gate AV analysis slice: no-runtime post-release roadmap,
  source-absent solver gap cartography selection, and ranked next
  accuracy/adapters work.
- [calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md)
  — productization closeout: team-access policy model closed.
- [calculator/CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md)
  — productization closeout: auth-session hardening closed.
- [calculator/CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md)
  — productization closeout: project-access authorization closed.
- [calculator/CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md)
  — latest calculator closeout: final audit closed and
  productization handoff opened.
- [calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
  — productization roadmap; route integration is deferred while the
  calculator accuracy/coverage slice is active.
- [calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md](./calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md)
  — closed calculator accuracy/coverage re-entry plan.
- [calculator/SYSTEM_MAP.md](./calculator/SYSTEM_MAP.md) —
  end-to-end system model, runtime boundaries, persistence
  posture, test surface map.
- [calculator/CALCULATION_MODEL_AND_VALIDATION.md](./calculator/CALCULATION_MODEL_AND_VALIDATION.md)
  — answer-origin and evidence-tier composition.
- [calculator/SOURCE_GAP_LEDGER.md](./calculator/SOURCE_GAP_LEDGER.md)
  — source-backed widening / tightening / deferred-family
  ledger.
- [calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
  — split refactor blueprint (v1 landed, v2 composer-injection
  follow-up deferred).
- [archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md](./archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md)
  — tactical plan for master-plan step 7b (closed
  2026-04-22). Reference doc for future agents auditing the
  wall corridor surface or the ~160-cell VALUE-pin matrix
  discipline.
- [archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md](./archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md)
  — tactical plan for master-plan step 7 (closed 2026-04-22).
  Reference doc for future agents investigating the same-
  material-split fixes (F1/F2) and the cross-mode torture
  matrix authoring pattern.
- [archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md](./archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md)
  — tactical plan for master-plan step 8 (closed 2026-04-23).
- [foundation/README.md](./foundation/README.md) — repo-level
  direction + rules.
- [imports/README.md](./imports/README.md) — upstream import
  workflow.

## Directory Layout

```text
docs/
  calculator/   living reference docs + latest checkpoint
  foundation/   long-lived project direction + repo rules
  imports/      upstream import notes + helper commands
  archive/      dated status, handoffs, closed-slice plans,
                historical analysis
```

If a file under `docs/archive/` disagrees with a living doc
under `docs/calculator/` or `docs/foundation/`, the living doc
wins.

## Fast Paths

- "Where do I resume implementation now?" →
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md)
  → [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  → `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts`.
- "What is stable right now?" →
  [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md)
  → [calculator/SYSTEM_MAP.md](./calculator/SYSTEM_MAP.md)
  → [calculator/CALCULATION_MODEL_AND_VALIDATION.md](./calculator/CALCULATION_MODEL_AND_VALIDATION.md).
- "What should be implemented next?" →
  [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  → [calculator/MASTER_PLAN.md](./calculator/MASTER_PLAN.md) §3
  state grid + §4 master sequence.
- "What was the session narrative?" →
  [calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md).

## Status Reading Rule

- Use `CURRENT_STATE.md` for "what is stable right now".
- Use `NEXT_IMPLEMENTATION_PLAN.md` for "what exactly should be
  implemented next".
- Use `calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md`
  for the most recent calculator session narrative.
- Use older checkpoints under `docs/archive/handoffs/` only when
  you need the historical context that predates the living
  triangle.

## Historical Notes

Use [archive/README.md](./archive/README.md) for the dated
status timeline, handoffs, closed-slice plans, and analysis
index.
