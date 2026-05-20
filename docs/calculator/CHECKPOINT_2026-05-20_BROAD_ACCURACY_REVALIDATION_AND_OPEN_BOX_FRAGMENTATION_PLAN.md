# Checkpoint 2026-05-20 - Broad Accuracy Revalidation and Open-Box Fragmentation Plan

Status: checkpoint after a fresh full current-gate run on 2026-05-20.

## Purpose

This checkpoint is the broad look after the open-box timber formula,
runtime, surface-parity, and coverage-refresh sequence. It confirms the
current tree is green, maps the landed implementation back to the living
docs, and keeps the next step narrow.

It does not declare broad "every common wall/floor combination" readiness
and it does not promote new runtime values. The controlled internal
envelope is green; broad comfort still requires more family solvers,
residual evidence, and boundary-to-solver conversion.

## Validation Result

Command:

`pnpm calculator:gate:current`

Result:

- engine focused gate: 463 files passed, 2656 tests passed;
- web focused gate: 88 files passed, 366 tests passed, 18 skipped;
- repo build: 5 / 5 packages successful;
- whitespace guard: passed;
- known non-fatal warnings: optional `sharp/@img` warnings from
  `@turbodocx/html-to-docx`, plus Zustand storage warnings in test
  runtime.

No implementation fix was required after this run.

## Current Implementation / Docs Alignment

The active implementation and docs agree:

- DynEcho remains a calculator-first system. Exact source rows are
  overrides and anchors, not the whole product.
- Lab, field, building-prediction, and ASTM/IIC bases remain separate.
- The broad-accuracy plan is still the right path after the controlled
  company-internal envelope; the 71-row envelope is a regression guard,
  not the final readiness bar.
- Open-box timber now has a source-absent package-transfer runtime lane
  for complete same-family packages, visible across engine/web/API/report
  surfaces.
- Exact TUAS rows still win over package-transfer prediction.
- Raw bare open-box, exact-only hybrid, mixed staged, field/building, and
  ASTM/IIC cases stay explicit boundaries instead of silent fallback
  support.

Landed open-box timber sequence since the previous sprint-entry
checkpoint:

- `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`
- `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`
- `broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan`
- `broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_plan`

The dry gypsum-fiber source-absent package-transfer pin remains:

- `Ln,w 50.8`
- `CI,50-2500 3.3`
- `Rw 66`
- not-measured budgets: `+/-7 dB`, `+/-2.5 dB`, and `+/-6 dB`

## Readiness Judgment

Current status is "controlled internal envelope green, broad common-combo
confidence not yet." It is a good checkpoint for committing and
continuing, but not a good point to tell users that every common wall and
floor stack can be trusted comfortably.

Remaining high-impact blockers:

1. Open-box timber exact-only hybrid / fragmented TUAS packets need an
   explicit policy before they can become source-equivalent transfer or
   calibration evidence.
2. Raw bare open-box/open-web carriers remain blocked until a separate
   bare-carrier owner exists.
3. Field/building adapters and ASTM/IIC routes remain basis-specific work
   and must not borrow lab package-transfer values.
4. Broader readiness still needs weak-lane debt conversion, family
   residual strengthening, and more source-absent solvers for common wall
   and floor families.

## Selected Next Action

Selected action:

`broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan`

Selected file:

`packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts`

Why this is first:

- It is the boundary selected by the landed coverage refresh.
- It targets same-family TUAS evidence already in the repo.
- It increases coverage/accuracy without a broad source crawl.
- It prevents exact-only hybrid rows from being misused by the existing
  package-transfer runtime corridor.

## Implementation Order

1. Add the exact-only hybrid fragmentation policy contract.
2. Classify the five known exact-only hybrid / fragmented TUAS packets by
   owner fields:
   `tuas_r7b_open_box_timber_measured_2026`,
   `tuas_r8b_open_box_timber_measured_2026`,
   `tuas_r9b_open_box_timber_measured_2026`,
   `tuas_r2c_open_box_timber_measured_2026`, and
   `tuas_r10a_open_box_timber_measured_2026`.
3. Decide whether each packet is:
   `source_equivalent_fragmented_package_candidate`,
   `exact_only_hybrid_residual_owner`,
   `mixed_staged_upper_package_owner`,
   `lower_ceiling_family_interaction_owner`, or a blocked negative.
4. Add negative boundaries for raw bare open-box, wrong support family,
   field/building aliases, ASTM/IIC aliases, partial/missing finish
   ownership, and open-web steel wrong-family borrowing.
5. Keep the gate no-runtime unless the policy proves a narrow later
   runtime candidate should be selected.
6. Run the focused new contract, then `pnpm calculator:gate:current` and
   `git diff --check`.

## Planning Iteration 2 - Implementation-Ready Contract Shape

This pass re-read the implementation after the checkpoint commit:

- `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner.ts`
- `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts`
- `packages/engine/src/open-box-timber-similarity-estimate.ts`
- `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh.ts`
- `packages/catalogs/src/floor-systems/exact-floor-systems.ts`
- existing TUAS truth / fragmentation tests

No new internet research is needed for this iteration. The selected gate
is not a formula-research or source-acquisition gate; it is a local
same-family policy gate over already-ingested TUAS exact rows. Pulling new
web values into this step would turn it into a broad source crawl and
weaken the current boundary.

Implementation files for the next slice:

1. Add
   `packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy.ts`.
2. Add
   `packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts`.
3. Export the new module from `packages/engine/src/index.ts`.
4. Add the focused contract to `tools/dev/run-calculator-current-gate.ts`.
5. Update the living docs only after the contract lands.

The policy contract should stay no-runtime. It should classify evidence
and pick a later lane, not change public calculator values.

Required constants / status shape:

- landed gate:
  `broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan`
- recommended selection status if no safe runtime candidate is admitted:
  `broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_landed_no_runtime_selected_raw_bare_reopening_guard`
- likely next file after a no-runtime close:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard-contract.test.ts`

Evidence-row policy decisions:

| Row | Current structure | Required decision |
| --- | --- | --- |
| `tuas_r7b_open_box_timber_measured_2026` | EPS board + geotextile/screed + EPS/laminate with hybrid lower treatment | keep exact; admit as exact-only hybrid residual evidence only after lower-family and wet/dry package owners are explicit; do not seed source-absent runtime |
| `tuas_r8b_open_box_timber_measured_2026` | EPS board + geotextile/screed, no finish pair, hybrid lower treatment | keep exact; mark as partial-finish / no-finish residual evidence; cannot calibrate complete laminate/EPS transfer |
| `tuas_r9b_open_box_timber_measured_2026` | screed + EPS/laminate, no upper fill, hybrid lower treatment | keep exact; admit only as screed-only hybrid residual evidence; no package-transfer promotion |
| `tuas_r2c_open_box_timber_measured_2026` | EPS/laminate with hybrid lower treatment, no ceiling fill and no upper/floating package | keep exact; classify as lower-ceiling interaction / missing-mass boundary; do not average into thin-laminate runtime |
| `tuas_r10a_open_box_timber_measured_2026` | glasswool board + gypsum/screed/gypsum staged upper package, family-A lower | keep exact; classify as mixed staged upper package owner gap; no predictor-owned runtime row yet |

Contract acceptance must prove:

- all five rows remain exact-source rows on canonical stacks;
- source-equivalent fragmentation of those exact rows preserves the exact
  lab and field route, matching the existing same-package fragmentation
  tests;
- none of the five rows appears in the runtime anchor list for
  `broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor`;
- exact-only hybrid and mixed staged rows expose policy decisions as
  residual/readiness evidence, not as measured runtime calibration rows;
- `R7b` / `R8b` / `R9b` / `R2c` do not tighten the current
  `+/-7 dB`, `+/-2.5 dB`, `+/-6 dB` package-transfer budgets in this
  gate;
- `R10a` stays out of runtime because there are zero predictor-owned
  mixed staged rows;
- raw bare open-box, open-web steel wrong-family, partial finish,
  field/building outputs, and ASTM/IIC aliases remain blocked;
- runtime pins stay unchanged: dry gypsum-fiber remains `Ln,w 50.8`,
  `CI,50-2500 3.3`, `Rw 66`; thin laminate remains `Ln,w 53.5`,
  `Rw 55.5`; reinforced ceiling remains `Ln,w 53.5`, `Rw 63.5`.

Policy close decision:

- If the policy only classifies evidence, close no-runtime and select the
  raw-bare open-box reopening guard next.
- If the policy proves a narrow residual admission lane, still close
  no-runtime and select a separate exact-only hybrid residual-admission
  gate; do not combine admission and runtime movement.
- Do not promote runtime inside this policy gate.

## Documentation Notes

`NEXT_IMPLEMENTATION_PLAN.md` still contains long historical closed-slice
content after the active broad-accuracy handoff. Treat the top active
section, `CURRENT_STATE.md`, this checkpoint, and the broad-accuracy slice
plan as authoritative for the next action.

Generated/local artifacts remain outside the checkpoint commit unless the
user explicitly asks to clean them up.
