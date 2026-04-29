# Slice Plan - Internal Use Acceptance Rehearsal v1

Status: GATE A LANDED / GATE C NEXT (selected 2026-04-29 by
`post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts`;
Gate A landed 2026-04-29 in
`internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`).

Next implementation file:

`packages/engine/src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts`

Selection reason: `clt_mass_timber_wall_source_pack_extraction_v1`
closed no-runtime after Gate B found no bounded metric-mapping or
formula-tolerance path ready for CLT / mass-timber wall runtime
movement. Source-pack readiness still blocks every accuracy import. The
highest-value next action for company use is therefore not another
runtime import attempt, but an executable acceptance rehearsal that
turns the current operating envelope into concrete company-use
scenarios, expected values/statuses, caveats, and fail-closed checks.

This slice must not change acoustic formulas, runtime values, support
classes, confidence classes, evidence tiers, API shape, route-card
values, output-card statuses, proposal/report copy, or workbench input
behavior unless a later gate explicitly finds a mismatch between
documented acceptance behavior and implementation.

## Objective

Make the calculator safer for controlled company-internal use by
building a 10-20 scenario acceptance pack from the already closed
operating envelope.

The acceptance pack should answer:

- which representative wall/floor stacks are ordinary internal
  estimates with standard caveat;
- which stacks are useful only with visible formula, low-confidence,
  screening, or source-gated caveats;
- which requests must fail closed, ask for missing inputs, or report
  unsupported outputs;
- whether hostile edits, many layers, layer reordering, save/load, and
  missing field/building inputs keep the same honest posture.

## Gate A - Build Company Internal Acceptance Matrix

Gate A landed:

`packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`

The contract builds a no-runtime acceptance matrix from
[INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md).

Implementation read map before coding Gate A:

- `packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts`
  for the closed pilot scenario ids, buckets, expected values, and proof
  owners.
- `packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts`
  and
  `apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts`
  for the visible caveat surfaces already proven on caveated internal-use
  routes.
- `packages/engine/src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  for the selected acceptance-rehearsal constraints and the source-ready
  accuracy pack negative decision.
- `packages/engine/src/mixed-floor-wall-generated-test-helpers.ts` for
  reusable generated wall/floor rows, contexts, and `resultSnapshot`.
- `packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts`,
  `packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts`,
  `packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`,
  `packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`,
  `packages/engine/src/target-output-support-contract.test.ts`, and
  `apps/web/lib/calculator-api-validation.test.ts` for source corridor,
  hostile input, missing input, and unsupported-output baselines.

No external web/source research is needed for Gate A. This slice is not
allowed to import new rows or retune formulas; it should rehearse the
already selected operating envelope. External research belongs to a
later source-ready accuracy slice only if a contract names exact row
locators, metric policy, tolerance owner, and paired visible tests.

Minimum scenario buckets:

- `pilot_ready_with_standard_caveat`
  - LSF exact preset;
  - AAC single-leaf benchmark;
  - masonry single-leaf benchmark;
  - source-backed floor corridor.
- `pilot_allowed_with_visible_caveat`
  - timber double-board generated wall;
  - CLT local generated wall;
  - lined/heavy-core screening wall;
  - generated steel floor fallback;
  - many-layer and reorder guardrails.
- `not_defended_fail_closed_or_source_gated`
  - invalid or missing inputs;
  - unsupported target outputs;
  - no-stud double-leaf source-gated family;
  - historical blocked floor families.
- `hostile_many_layer_reorder_and_missing_input_edges`
  - many-layer finite/stable behavior;
  - layer reorder/edit stability;
  - missing field/building inputs stay `needs_input`;
  - unsupported low-frequency/impact outputs stay unsupported.

Minimum assertions:

- value snapshot or supported-output status for each selected scenario;
- evidence/confidence/caveat visibility for every caveated scenario;
- required-input or unsupported-output message where appropriate;
- route-card or report posture when user-visible behavior is involved;
- no runtime/support/confidence/evidence promotion from acceptance
  convenience.

Gate A should target 20 scenarios and must include at least 10. If a
scenario is too unstable to pin numerically, it must be pinned by
status, support class, confidence/evidence class, or explicit
unsupported/needs-input reason.

Concrete Gate A scenario matrix:

| # | Acceptance id | Bucket | Existing proof/source to reuse or mirror | Gate A assertion mode |
|---|---|---|---|---|
| 1 | `wall_lsf_exact_preset` | `pilot_ready_with_standard_caveat` | `wall-lsf-knauf` in `mixed-floor-wall-generated-test-helpers.ts`; `wall-lsf-timber-stud-preset-benchmarks.test.ts` | pin lab `Rw=55`, field `R'w=48`, building `DnT,w=49`, exact/high source posture |
| 2 | `wall_aac_single_leaf_benchmark` | `pilot_ready_with_standard_caveat` | `wall-held-aac`; `wall-preset-expansion-benchmarks.test.ts` | pin current `Rw/R'w/DnT,w` values from the pilot note and benchmark-backed posture |
| 3 | `wall_masonry_single_leaf_benchmark` | `pilot_ready_with_standard_caveat` | `wall-masonry-brick`; `wall-preset-expansion-benchmarks.test.ts` | pin current `Rw/R'w/DnT,w` values from the pilot note and benchmark-backed posture |
| 4 | `floor_pliteq_exact_source_corridor` | `pilot_ready_with_standard_caveat` | mirror `PLITEQ_EXACT_SOURCE_STACK` in `floor-fallback-low-confidence-gate-b-source-contract.test.ts` | pin exact source match id, supported outputs, and unsupported companions |
| 5 | `floor_ubiq_bound_source_corridor` | `pilot_ready_with_standard_caveat` | mirror `UBIQ_FL32_BOUND_SOURCE_STACK` in `floor-fallback-low-confidence-gate-b-source-contract.test.ts`; `floor-source-corpus-contract.test.ts` | pin bound interpolation ids, supported outputs, and bound-vs-exact distinction |
| 6 | `wall_timber_double_board_generated` | `pilot_allowed_with_visible_caveat` | `wall-timber-stud`; Gate B visibility web test | pin lab/field/building values, low confidence, formula-owned/source-gated wording owner |
| 7 | `wall_clt_local_generated` | `pilot_allowed_with_visible_caveat` | `wall-clt-local`; CLT Gate C baseline | pin lab `Rw=42`, field `R'w=41`, `DnT,w=42`, medium confidence, `laminated_leaf_sharp_delegate` |
| 8 | `wall_lined_heavy_core_screening` | `pilot_allowed_with_visible_caveat` | `wall-screening-concrete`; lined/heavy-core source research contract | pin screening values and forbid exact/source-backed wording |
| 9 | `floor_steel_fallback_generated` | `pilot_allowed_with_visible_caveat` | `floor-steel-fallback`; fallback Gate B source contract | pin low-confidence estimate values, warnings, and `L'nT,50` unsupported |
| 10 | `floor_many_layer_exact_split_stack` | `hostile_many_layer_reorder_and_missing_input_edges` | `floor-many-layer-stress-gate-a-matrix.test.ts` | pin finite exact 50+ layer behavior, supported/unsupported partition, and no source promotion |
| 11 | `floor_many_layer_raw_fail_or_screening_stack` | `hostile_many_layer_reorder_and_missing_input_edges` | `floor-many-layer-stress-gate-a-matrix.test.ts` | pin finite/null values, explicit unsupported outputs, and no fabricated exact/bound match |
| 12 | `floor_role_defined_reorder_exact_stack` | `hostile_many_layer_reorder_and_missing_input_edges` | `floor-layer-order-invariance-expansion-gate-a-contract.test.ts` | pin role-defined exact precedence under representative reorder/edit |
| 13 | `floor_raw_reorder_support_boundary` | `hostile_many_layer_reorder_and_missing_input_edges` | `floor-layer-order-invariance-expansion-gate-a-contract.test.ts` | pin that raw order may change support posture without claiming broad arbitrary reorder invariance |
| 14 | `wall_field_missing_geometry_needs_input` | `hostile_many_layer_reorder_and_missing_input_edges` | `ui-input-output-honesty-gate-a-inventory.test.ts` | pin `Dn,w`/`DnT,w` pending-input labels for missing geometry/room volume |
| 15 | `invalid_thickness_all_callers_fail_closed` | `not_defended_fail_closed_or_source_gated` | `all-caller-invalid-thickness-guard-gate-a-matrix.test.ts` | pin no supported outputs, all requested outputs unsupported, finite/null result surfaces, and warning text |
| 16 | `api_missing_layers_next_field` | `not_defended_fail_closed_or_source_gated` | `apps/web/lib/calculator-api-validation.test.ts` | pin next-field guidance owner for missing layers and impact source |
| 17 | `unsupported_target_output_partition` | `not_defended_fail_closed_or_source_gated` | `target-output-support-contract.test.ts`; fallback Gate B source contract | pin unsupported companions instead of numeric fabrication |
| 18 | `wall_no_stud_double_leaf_source_gated` | `not_defended_fail_closed_or_source_gated` | no-stud source research Gate B/C contracts | pin source-gated/no-promotion decision and missing direct-row/tolerance owner |
| 19 | `historical_blocked_floor_families` | `not_defended_fail_closed_or_source_gated` | GDMTXA04A, C11c, raw open-box/open-web contracts | pin no reopen from nearby green tests |
| 20 | `mixed_study_mode_save_load_replay_owner` | `hostile_many_layer_reorder_and_missing_input_edges` | `apps/web/features/workbench/mixed-study-mode-torture.test.ts` | pin proof-owner presence for save/load replay; do not duplicate the long web torture matrix in Gate A |

Gate A should implement at least scenarios 1-18. Scenario 20 is a
proof-owner sentinel, not a replacement for the long web save/load test.
If runtime time becomes too high, keep the matrix at 16-18 scenarios and
record which optional proof-owner sentinel was deferred; do not land
fewer than 10 scenarios.

Gate A landed all 20 named scenarios. Direct engine calculations cover
the ready wall benchmarks, exact/bound floor source corridors,
caveated generated routes, many-layer/reorder boundaries, invalid
thickness fail-closed behavior, and unsupported-output partitioning.
Cross-package proof-owner assertions cover already-tested web/API
visibility, missing-input, no-stud source-gated, historical blocked
floor family, and save/load replay surfaces.

Recommended contract shape:

- define a local `ACCEPTANCE_REHEARSAL_GATE_A` object that repeats the
  no-runtime/no-promotion constraints from the selection contract;
- define scenario metadata with `id`, bucket, proof owner, expected
  values/statuses, caveat expectation, and `runtimePromotionAllowed:
  false`;
- calculate direct engine scenarios with `calculateAssembly`,
  `ENGINE_MIXED_GENERATED_CASES`, and `resultSnapshot` instead of only
  checking constants;
- use `existsSync` only for web/API proof-owner files that would be too
  expensive or cross-package for this engine Gate A contract;
- assert that every requested output is either supported, unsupported,
  or needs input; never allow silent omission;
- assert every caveated/fail-closed scenario is outside
  `pilot_ready_with_standard_caveat`;
- assert every source-gated or low-confidence scenario keeps its current
  confidence/evidence/support posture.

Failure response:

- Value/status drift in a ready scenario: stop and investigate as a
  regression before updating snapshots.
- Missing caveat or route/report honesty drift: select Gate B for
  paired web visibility, not a formula retune.
- A source-gated family appears better than expected: do not promote it
  in this slice; write a source-ready accuracy candidate only if the row
  locator, metric policy, tolerance owner, and visible tests are all
  present.
- Too many layers, reorder, or invalid input crashes/non-finite output:
  fix the implementation with targeted regression tests before closing
  Gate A.

## Gate B - Workbench And Report Acceptance Visibility

Gate B should be selected only if Gate A finds that values/statuses are
stable but the workbench, route-card, or proposal/report visibility does
not make the acceptance posture clear enough for company use.

Possible Gate B scope:

- route-card caveat visibility for every acceptance bucket;
- proposal/report note fidelity for caveated results;
- missing-input and unsupported-output copy consistency;
- no value movement unless Gate A exposed a real implementation bug.

## Gate C - Pilot Readiness Closeout

Gate C should close this slice only when:

- the acceptance matrix is executable and green;
- docs identify the exact controlled-use envelope and known source-gated
  gaps;
- no source-gated family was promoted for pilot convenience;
- the next slice is selected from either a concrete acceptance defect or
  a genuinely source-ready accuracy pack.

## Validation

- Run the targeted Gate A engine contract while iterating.
- Add the Gate A contract to `tools/dev/run-calculator-current-gate.ts`
  when it lands.
- Run `pnpm calculator:gate:current`.
- Run `git diff --check`.
- Run `pnpm check` before a full company-pilot handoff or if Gate B
  touches user-visible workbench/report behavior.

Latest selection validation, 2026-04-29:

- selected by CLT / mass-timber extraction Gate C no-runtime closeout;
- focused current gate after selection green: engine 136 files / 649
  tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean;
- broad `pnpm check` after selection green: lint/typecheck green,
  engine 269 files / 1469 tests, web 157 files / 890 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.

Latest Gate A validation, 2026-04-29:

- targeted Gate A engine contract green: 1 file / 7 tests;
- focused `pnpm calculator:gate:current` green after runner sync:
  engine 137 files / 656 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings, whitespace guard
  clean;
- broad `pnpm check` was not rerun for Gate A because this was a
  no-runtime/no-web-behavior acceptance rehearsal. Latest broad remains
  the CLT / mass-timber Gate C broad green run.
