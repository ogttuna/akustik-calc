# Post-Gate AE Checkpoint and Broad Revalidation Handoff - 2026-05-12

## Checkpoint Status

This checkpoint was taken after Gate AE landed flat multicavity solver
broadening and before starting Gate AF. It is a good stopping point:
runtime behavior, web parity, current-gate validation, and broad
repository validation are green after one lint-only cleanup.

Current selected status remains:

`gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_landed_selected_revalidation_gate_af`

Selected next action remains:

`gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan`

Selected next file remains:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts`

## Docs vs Implementation Read

The implementation and plan are aligned:

- Gate AE runtime exists in
  `packages/engine/src/dynamic-airborne-gate-ae-flat-multicavity.ts`.
- Gate AE contract coverage exists in
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts`.
- The web topology surface and parity coverage exist in
  `apps/web/features/workbench/flat-multicavity-topology-surface.ts`
  and
  `apps/web/features/workbench/flat-multicavity-topology-surface-parity.test.ts`.
- `tools/dev/run-calculator-current-gate.ts` includes Gate Y through
  Gate AE and the flat-multicavity web parity check.
- Gate AF is correctly selected but not implemented yet; the selected
  Gate AF file intentionally does not exist at this checkpoint.

The only mismatch found in this checkpoint was documentation freshness:
authority breadcrumbs and latest-checkpoint text needed to include the
post-Gate-AE broad revalidation and the still-selected Gate AF step.

## Runtime Posture

Gate AE remains unchanged:

- complete explicit `element_lab` grouped flat/many-layer multicavity
  walls return `Rw 53 / STC 57 / C -0.6 / Ctr -8`;
- method `gate_ae_flat_multicavity_two_cavity_frequency_solver`;
- origin `family_physics_prediction`;
- error budget `+/-7 dB`;
- exact/calibrated source candidates remain rejected until source-owned
  same-stack curve or holdout evidence exists;
- Gate G full mineral-wool grouped triple-leaf precedence remains
  `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`;
- stale, duplicate, missing-topology, field/building, ASTM, and IIC
  routes remain blocked by explicit input/basis contracts.

No runtime formula, tolerance, source-promotion, or lab/field/building
alias moved in this checkpoint.

## Validation

`pnpm calculator:gate:current` passed:

- engine focused/current gate: 372 files / 2148 tests;
- web focused/current gate: 74 files / 318 passed + 18 skipped;
- repo build: 5/5 tasks;
- whitespace guard clean.

First `pnpm check` attempt found one lint-only issue:

- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa.ts`
  imported an unused `PersonalUseMvpCoverageRuntimeSnapshot` type.

The unused import was removed. Final `pnpm check` then passed:

- lint passed;
- typecheck passed;
- engine Vitest passed: 497 files / 2950 tests;
- web Vitest split batches passed 5/5, with observed batch summaries
  of 40 files / 307 tests, 40 files / 172 tests, 40 files / 213 tests,
  40 files / 203 passed + 18 skipped, and 14 files / 83 tests;
- repo build passed: 5/5 tasks.

The Next build kept the known optional `sharp/@img` warnings from the
DOCX/PDF path but completed successfully.

## Remaining Gaps

Gate AF should now be implemented as a no-runtime post-promotion
revalidation gate before choosing another solver/source lane. It should
prove:

- the 40-row personal-use matrix stays gap-free after Gate AE;
- older Gate G/AB/AC/AD expectations remain stable;
- cards, reports, API payloads, saved replay, and scenario analysis
  preserve the Gate AE basis and `+/-7 dB` posture;
- unsupported or missing-input requests remain blocked without a
  promoted budget;
- lab `Rw` / `STC` / `C` / `Ctr` values do not leak into field,
  building, ASTM, or IIC output bases.

If Gate AF is green, select the next lane from the updated matrix.
Do not default to a broad source crawl unless the matrix names a
specific source-owned unblocker.
