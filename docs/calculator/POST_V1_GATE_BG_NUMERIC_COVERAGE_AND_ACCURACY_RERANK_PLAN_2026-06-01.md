# Post-V1 Gate BG Numeric Coverage And Accuracy Rerank Plan - 2026-06-01

Document role: active tactical plan for the slice selected by Gate BF:
`post_v1_next_numeric_coverage_gap_gate_bg_plan`.

Read after
[CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md),
[POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md),
and
[CHECKPOINT_2026-05-30_POST_V1_GATE_BF_STATE_RECONCILIATION.md](./CHECKPOINT_2026-05-30_POST_V1_GATE_BF_STATE_RECONCILIATION.md).
This file exists to keep Gate BG from drifting into catalog, confidence,
scenario, report, storage, or generic UI work.

## Product Bar From External Research

DynEcho's competitor/reference bar is an acoustic calculator, not a
content library. Current commercial and standards references point to the
same requirements:

- INSUL presents itself as a prediction tool for sound insulation in
  walls, floors, and ceilings, and INSUL Version 10 advertises `STC` /
  `Rw` airborne predictions plus `IIC` / `Ln,w` impact predictions for
  multi-shell systems.
  Source: https://www.insul.co.nz/ and
  https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf
- INSUL Version 10 notes a first-principles review of core prediction
  routines and an accuracy validation study, so the industry bar includes
  formula maintenance and validation, not just adding rows.
  Source: https://www.insul.co.nz/news/version-10/
- Acoulatis presents professional third-octave airborne and impact
  prediction for walls and floors, with ISO/ASTM ratings, broad material
  families, empirical equations, and laboratory verification.
  Source: https://www.sonusoft.com/acoulatis
- ISO 12354-1 and ISO 12354-2 define calculation models for airborne and
  impact building acoustics from element performance, including measured
  data, flanking/direct transmission, theoretically derived propagation,
  frequency-band models, simplified models, and uncertainty.
  Sources: https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/02/70242.html
  and https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/02/70243.html
- ISO 717-1 and ISO 717-2 define single-number airborne and impact
  ratings from octave or one-third-octave data. ASTM E989 defines impact
  single-number metrics and limits `IIC` / `AIIC` use to the required
  ASTM one-third-octave data and test-method basis.
  Sources: https://www.iso.org/standard/77435.html,
  https://www.iso.org/standard/69867.html, and
  https://store.astm.org/e0989-21.html

Implication for DynEcho: the next slice must improve calculable scope or
numeric correctness for realistic wall/floor layer combinations. It
must not become source crawling, low-confidence wording, finite examples,
or presentation work unless that work is strictly required to prove the
selected calculation change.

## Current State

Gate BF has landed runtime coverage movement:
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`.
Assembly field-only lower-treatment now calculates:

- acoustic hanger: `L'n,w 47.6`, `L'nT,w 44.8`, `L'nT,50 48.8`;
- resilient stud: `L'n,w 46.6`, `L'nT,w 43.8`, `L'nT,50 47.8`.

Missing `impactFieldContext.ci50_2500Db` still stops only `L'nT,50`.
ASTM `IIC` / `AIIC` remain unsupported because ISO `Ln,w` values are not
ASTM rating curves.

Gate BF selected:

`post_v1_next_numeric_coverage_gap_gate_bg_plan`

Selected file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts`

Gate BG has now landed as:

`post_v1_next_numeric_coverage_gap_gate_bg_plan`

Gate BG selection status:

`post_v1_next_numeric_coverage_gap_gate_bg_landed_no_runtime_selected_floor_mixed_support_family_owner_boundary_gate_bh`

Gate BG selected candidate:

`floor.mixed_support_family.multi_family_solver_gap`

Gate BG selected next action:

`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan`

Gate BG selected next file:

`packages/engine/src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh-contract.test.ts`

Gate BG is no-runtime: it does not change the Gate BF values. It locks
the next scope/accuracy move to a mixed-support owner boundary because
that is the current carried wrong-family solver risk. Gate BH must prove
explicit carrier/support ownership before any mixed-support runtime value
can move.

Gate BH has now landed as:

`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan`

Gate BH selection status:

`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_landed_no_runtime_selected_floor_mixed_support_family_runtime_corridor_gate_bi`

Gate BH owner fields:

`primaryCarrierFamily`, `dominantImpactTransferFamily`,
`mixedSupportRolePartition`, `secondarySupportTreatmentOwner`, and
`duplicateOwnershipGuard`.

Gate BH selected next action:

`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan`

Gate BH selected next file:

`packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts`

Gate BH is no-runtime scope/accuracy boundary work. It keeps existing
mixed-support stacks fail-closed until the user or route supplies a
single primary carrier family, dominant impact-transfer family, role
partition, and secondary treatment owner. Gate BI may move values only
for the admitted explicit single-primary-carrier mixed-support subset.

Gate BI has now landed as:

`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan`

Gate BI selection status:

`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_landed_selected_floor_mixed_support_family_surface_parity_gate_bj`

Gate BI opens the explicit single-primary-carrier mixed-support runtime
and preserves the Gate BH boundaries. The pinned complete case now
calculates `Ln,w 44.6` / `DeltaLw 29.9`; with explicit
`impactFieldContext` it also calculates `L'n,w 46.6`,
`L'nT,w 43.8`, and `L'nT,50 47.8`. Missing owner fields still stop as
`needs_input`, unsafe duplicate partitions do not fall through to a
different family solver, and ASTM `IIC` / `AIIC` remain unsupported.

Gate BI selected next action:

`post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan`

Gate BI selected next file:

`packages/engine/src/post-v1-floor-mixed-support-family-surface-parity-gate-bj-contract.test.ts`

Gate BJ has now landed as:

`post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan`

Gate BJ selection status:

`post_v1_floor_mixed_support_family_surface_parity_gate_bj_landed_no_runtime_selected_next_numeric_coverage_gap_gate_bk`

Gate BJ is no-runtime mixed-support surface parity plus usage-placement
correction. workbench cards, Markdown report, saved replay, estimate API,
impact-only API, resolver trace, and dynamic impact trace now expose the
same Gate BI mixed-support single-primary-carrier answer. The visible
mixed-support floor stack calculates `Ln,w 44.6` / `DeltaLw 29.9`; with
explicit `impactFieldContext` it also calculates `L'n,w 46.6`,
`L'nT,w 43.8`, and `L'nT,50 47.8` on
`predictor_mixed_support_primary_heavy_concrete_combined_owner_guarded_estimate`.
`calculateAssembly` now lets that explicit mixed-support owner path
through instead of withholding it behind unrelated older floating-floor
inputs. Missing owner fields, unsafe duplicate partitions, and ASTM
`IIC` / `AIIC` remain stopped.

Gate BJ selected next action:

`post_v1_next_numeric_coverage_gap_gate_bk_plan`

Gate BJ selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bk-contract.test.ts`

Gate BK has now landed as runtime coverage:

`post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan`

Gate BK selection status:

`post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl`

The raw-bare open-web steel base-only stack keeps lab `Ln,w 96`,
`CI 1.8`, `CI,50-2500 5.2`, and `Ln,w+CI 97.8`; with explicit
`impactFieldContext` it now calculates `L'n,w 98`, `L'nT,w 95.6`, and
`L'nT,50 100.8`. Field-only requests derive the lab anchor internally.
Missing field context remains `needs_input`; building prediction,
open-box raw-bare field transfer, and ASTM `IIC` / `AIIC` aliases remain
stopped. Gate BK selected
`post_v1_next_numeric_coverage_gap_gate_bl_plan`.

The shared resolver surface has 40 declared candidates and 37 active
runtime-basis mappings. The company-internal envelope is green, but that
is not broad industry-grade proof: it still contains valid
`needs_input` / `unsupported` boundaries, and it does not mean every
realistic layer combination has a formula owner or measured/anchor path.

## Gate BG Mission

Gate BG is a no-runtime executable rerank. It selects exactly one next
calculator-capability slice from current implementation evidence.

The selected slice must satisfy at least one of these:

1. more physically valid wall/floor layer combinations can calculate
   owned outputs when required physical inputs are present;
2. a currently calculable route becomes more numerically correct,
   better calibrated, or better bounded;
3. a metric, basis, owner, or input boundary is tightened in a way that
   prevents wrong numbers and enables a future value-moving runtime
   slice.

Gate BG must reject:

- broad source-row crawling as a standalone next step;
- low-confidence or screening wording changes;
- finite scenario packs without solver movement;
- report polish, saved-replay polish, storage/auth work, or generic UI
  cleanup;
- ASTM `IIC` / `AIIC` aliases from ISO `Ln,w`;
- any runtime value movement without before/after numeric pins and
  negative boundary tests.

## Step-By-Step Execution Order

Gate BG must be implemented in this order:

1. Create the Gate BG contract and summary module.
   - Add
     `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg.ts`.
   - Add
     `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts`.
   - Export the new module from `packages/engine/src/index.ts`.
   - Add the focused test file to `tools/dev/run-calculator-current-gate.ts`.

2. Prove the handoff before ranking anything.
   - Import Gate BF constants from
     `post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf.ts`.
   - Assert Gate BF selected
     `post_v1_next_numeric_coverage_gap_gate_bg_plan`.
   - Assert the selected Gate BG file path is
     `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts`.
   - Keep Gate BF value pins unchanged:
     acoustic hanger `L'n,w 47.6 / L'nT,w 44.8 / L'nT,50 48.8`;
     resilient stud `L'n,w 46.6 / L'nT,w 43.8 / L'nT,50 47.8`.
   - Keep Gate BF ASTM aliases stopped: `IIC` / `AIIC` remain
     unsupported.

3. Build the candidate table from current implementation evidence.
   - Reuse Gate BE candidate style from
     `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be.ts`.
   - Include `coverageImpact`, `accuracyImpact`, `implementationReadiness`,
     `wrongNumberRisk`, `sliceKind`, `expectedBeforeAfter`,
     `sourceRowsRequiredForSelection`, and `selected`.
   - Do not use a free-text recommendation without executable candidate
     records.

4. Populate the required candidates.
   - `floor.mixed_support_family.multi_family_solver_gap`: consume the
     carried Gate BD/BE evidence and the existing fail-closed mixed-family
     input-surface behavior in
     `calculator-personal-use-mvp-coverage-sprint-gate-bb.ts`.
   - `post_v1_current_accuracy_residual_and_holdout_gap`: consume
     `broad-accuracy-reference-benchmark-expansion.ts` and
     `broad-accuracy-floor-system-similarity-anchor.ts`; do not restart
     broad source crawling.
   - `metric_basis_adapter_boundary_gap`: inspect current
     `unsupported_metric` / basis-boundary rows, but only rank adapters
     that have complete standard/input ownership.
   - `source_absent_formula_family_runtime_gap`: inspect current
     calculator matrices for real unsupported or `needs_input` rows that
     can move to owned numeric values with existing physical inputs.
   - Non-goal candidates must be present and explicitly unselected.

5. Rank with calculator impact, not convenience.
   - Primary score: calculable-scope gain plus correctness gain.
   - Secondary score: readiness from existing owner fields, formulas,
     adapters, and negative tests.
   - Penalty: wrong-family risk, metric alias risk, missing standard
     input basis, source-row crawl dependency, or surface-only work.
   - If a candidate only improves wording, examples, source inventory,
     or presentation, its selected flag must be false.

6. Select exactly one follow-up action.
   - If the winner is a boundary candidate, the selected next action must
     be a no-runtime owner/boundary gate.
   - If the winner is a runtime candidate, the selected next action must
     name the outputs that will move and the exact before/after pins
     expected in the follow-up.
   - If the winner is an accuracy candidate, the selected next action
     must name the family, residual/holdout evidence, and error-budget
     decision it will tighten.

7. Update only the active handoff docs.
   - Update this file if Gate BG changes the selected path.
   - Update `POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`,
     `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`,
     `CALCULATOR_SOURCE_OF_TRUTH.md`, `docs/calculator/README.md`,
     `docs/README.md`, and `AGENTS.md` only with the new Gate BG status
     and selected next action.
   - Do not edit old checkpoints except to fix a direct contradiction in
     the active authority chain.

8. Validate the no-runtime gate.
   - Run the focused Gate BG Vitest contract.
   - Run Gate BF + Gate BG continuity together.
   - Run `git diff --check`.
   - Run `pnpm calculator:gate:current` only if runtime behavior,
     shared schemas, APIs, or visible surfaces changed.

## Internet / Standards Research Rule

Gate BG itself should not need more internet research because it is a
rerank from current implementation evidence. Use external research only
when the selected follow-up needs a formula coefficient, standard rating
rule, or competitor-product behavior that is not already encoded in the
repo. In that case:

- use official standards/product pages or primary papers where possible;
- record only the relevant calculation implication in the plan or
  contract;
- do not turn the slice into a broad web/source crawl;
- do not copy standard text into the repo.

## Required Candidate Pool

Gate BG must compare at least these candidates:

1. `floor.mixed_support_family.multi_family_solver_gap`
   - Why it matters: mixed support/carrier stacks are a correctness risk.
     The calculator must not silently choose a wrong family solver or
     double-count support ownership.
   - Possible gain: safer formula selection and, after an owner boundary
     gate, calculable support for a safe mixed-support subset.
   - First acceptable follow-up: no-runtime owner/boundary gate that
     requires explicit carrier/support ownership and keeps unsafe mixed
     stacks `needs_input`.

2. `post_v1_current_accuracy_residual_and_holdout_gap`
   - Why it matters: broad accuracy artifacts already exist, including
     `broad-accuracy-reference-benchmark-expansion.ts` and
     `broad-accuracy-floor-system-similarity-anchor.ts`, but Gate BG must
     decide whether the current post-V1 path needs a residual/holdout
     selection gate before another runtime formula expansion.
   - Possible gain: better accuracy selection discipline across exact
     sources, similarity anchors, calibrated family solvers, and
     source-absent budgets.
   - First acceptable follow-up: reuse existing benchmark/similarity
     artifacts; do not restart a broad source crawl.

3. `metric_basis_adapter_boundary_gap`
   - Why it matters: `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'nT,w`, `IIC`,
     `AIIC`, ISO, ASTM, lab, field, and building bases cannot be aliased.
   - Possible gain: correctness improvement when current rows request
     complete but currently unsupported metric/basis combinations.
   - First acceptable follow-up: only select a metric adapter when the
     required physical or band inputs exist and the standard owner is
     explicit.

4. `source_absent_formula_family_runtime_gap`
   - Why it matters: any remaining high-frequency `needs_input` /
     `unsupported` rows may hide a real formula-family gap.
   - Possible gain: direct scope increase if a bounded family solver
     already has inputs, basis, error budget, and negative cases.
   - First acceptable follow-up: runtime corridor with numeric before /
     after pins.

5. Non-goal candidates:
   `broad_source_row_crawl`, `confidence_wording_or_low_confidence_surface`,
   `finite_scenario_pack`, `report_or_storage_or_auth_work`,
   `generic_ui_cleanup`.
   These must remain unselected unless the user explicitly asks for them
   outside the calculator slice.

## Required Gate BG Acceptance

The Gate BG contract must prove:

1. It consumes Gate BF status:
   `post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_landed_selected_next_numeric_coverage_gap_gate_bg`.
2. It lands as:
   `post_v1_next_numeric_coverage_gap_gate_bg_plan`.
3. It selects a next action and selected next file with one chosen
   candidate.
4. The chosen candidate is classified as one of:
   `runtime_coverage`, `accuracy_tightening`, `owner_boundary`, or
   `metric_basis_boundary`.
5. The chosen candidate states expected before/after behavior. Runtime
   candidates must name the outputs they will move. Boundary candidates
   must name the wrong-number risk they prevent and the future runtime
   route they enable.
6. Non-goal candidates are present and explicitly rejected.
7. Existing Gate BF numeric pins and ASTM unsupported boundaries remain
   unchanged.
8. Existing broad-accuracy benchmark/similarity artifacts are reused as
   evidence where relevant and are not treated as permission for source
   crawling.

## Preferred Implementation Path After Gate BG

If `floor.mixed_support_family.multi_family_solver_gap` wins:

1. Gate BH: no-runtime mixed-support owner/boundary contract. Landed.
   - Define explicit carrier/support ownership fields.
   - Prove duplicate-family ownership stays `needs_input`.
   - Prove no existing lower-treatment or floating-floor route leaks a
     value through the wrong family solver.
2. Gate BI: runtime corridor for a safe subset only. Landed with
   `Ln,w 44.6` / `DeltaLw 29.9`.
   - Before: representative complete mixed-support request is stopped.
   - After: the selected safe subset publishes owned numeric pins.
   - Negative cases: missing owner fields, duplicate support ownership,
     ASTM aliases, and field/building aliases remain stopped.
3. Gate BJ: surface parity only after numeric movement.
   - Cards, API, reports, saved replay, trace, and metric-basis labels
     expose the same selected answer and stopped outputs.

If the residual/holdout candidate wins:

1. Add a post-V1 accuracy selection gate that imports existing broad
   benchmark/similarity contracts.
2. Rank formula families by missing residual coverage, weak-lane debt,
   and current post-V1 runtime exposure.
3. Select one formula-family accuracy slice; do not claim broad accuracy
   readiness from exact-source inventory alone.

If a metric/basis adapter wins:

1. Add a no-runtime owner gate that names the standard, required input
   basis, and outputs.
2. Add runtime only when complete input data exists.
3. Keep unsupported aliases visible when the standard owner is absent.

## Validation Expectations

Gate BG itself should run as a focused no-runtime engine contract. The
follow-up runtime gate must include:

- before/after numeric output pins;
- stopped-output assertions for missing physical inputs;
- metric/basis alias guards;
- resolver candidate and basis provenance;
- focused engine tests;
- web/API/report parity only after runtime movement;
- `git diff --check`.

Run `pnpm calculator:gate:current` after any runtime behavior,
shared-schema, API, or visible surface movement.
