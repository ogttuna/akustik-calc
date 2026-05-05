# Checkpoint - 2026-05-05 - Company Internal High-Accuracy Opening Rehearsal Gate A Handoff

Slice id:

`company_internal_high_accuracy_opening_rehearsal_v1`

Landed Gate A file:

`packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`

Landed Gate A action:

`gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime`

Gate A status:

`gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout`

Selected closeout file:

`packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`

Selected closeout action:

`gate_c_closeout_company_internal_opening_rehearsal_and_next_slice_selection`

## What Changed

Gate A created the current company-internal opening rehearsal matrix
without changing runtime values, output support, confidence, evidence,
API shape, route-card values, output-card status, proposal/report
values, or workbench-input behavior.

The test pins ready source/benchmark corridors to current values and
keeps caveated or blocked lanes from looking exact:

- LSF exact, AAC, masonry, Pliteq exact, and UBIQ bound corridors are
  ready with current source/benchmark caveats.
- Rockwool triple-leaf remains screening-only: grouped `Rw 41`,
  flat-list `Rw 42`, field `R'w 34`, `DnT,w 36`.
- Generated/screening wall and floor lanes remain caveated.
- Near-source rows remain context-only until the source owner set
  exists.
- Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
- Hostile API/import payloads, unknown material, invalid thickness,
  many-layer, and reorder edges stay rejected, fail-closed, or finite
  without fabricated exact support.

## Artifacts

- `company_internal_opening_acceptance_matrix`
- `final_validation_evidence_map`
- `rockwool_screening_and_source_blocker_registry`
- `source_promotion_no_runtime_boundary_register`
- `hostile_api_import_fail_closed_evidence`
- `operator_caveat_and_usage_handoff_pack`
- `selected_opening_handoff_or_backlog_followup`

## Carry-Forward

High-accuracy opening is not allowed by Gate A alone. The selected
closeout must consume the artifacts above, rerun focused and continuity
validation, then require `pnpm calculator:gate:current`, broad
`pnpm check`, and final `git diff --check` before any opening handoff
label is allowed.

The next implementation target is:

`packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`

## Validation

Validation completed on 2026-05-05.

Focused Gate A passed 1 file / 6 tests:

```sh
pnpm --filter @dynecho/engine exec vitest run src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts --maxWorkers=1
```

Continuity validation passed 8 files / 42 tests with source/hostile,
Rockwool policy, company blocker, raw wall/floor hostile matrices, and
all-caller invalid thickness guard:

```sh
pnpm --filter @dynecho/engine exec vitest run src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts src/raw-wall-hostile-input-answer-matrix.test.ts src/raw-floor-hostile-input-answer-matrix.test.ts src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts --maxWorkers=1
```

`pnpm calculator:gate:current` passed:

- engine 253 files / 1465 tests;
- web 53 files / 260 passed + 18 skipped;
- repo build 5 / 5 tasks;
- whitespace guard green.

Broad `pnpm check` passed after fixing a test-only TypeScript
annotation from `readonly Array<...>` to `ReadonlyArray<...>`:

- lint clean;
- typecheck clean;
- engine 386 files / 2285 tests;
- web 165 files / 933 passed + 18 skipped;
- repo build 5 / 5 tasks.

Final checks:

```sh
pnpm calculator:gate:current
pnpm check
git diff --check
```

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`. `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after Next build rewrote it to `.next`.
