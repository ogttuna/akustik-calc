# Checkpoint - 2026-05-05 - UBIQ Open-Web Packaged-Finish Current-Gate Guard Gate A

Gate file:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Slice:

`ubiq_open_web_packaged_finish_current_gate_guard_v1`

Selection status:

`gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate_selected_closeout`

Selected next file:

`packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_ubiq_open_web_packaged_finish_current_gate_guard_and_select_next_accuracy_slice`

Planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md`

## Gate A Summary

Gate A promotes the source-backed UBIQ open-web packaged-finish engine
and visible guard pack into `pnpm calculator:gate:current` ownership.

Required artifacts:

- `ubiq_packaged_finish_current_gate_guard_gate_a_summary`
- `current_gate_promoted_ubiq_packaged_finish_engine_visible_pack`
- `source_verified_ubiq_packaged_finish_pdf_status`
- `rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a`

Current-gate pack:

- `src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-packaged-finish-family-design.test.ts`
- `src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts`
- `src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`

## Protected UBIQ Behavior

Source URL:

`https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`

Pinned source facts:

- 90 exact UBIQ open-web rows remain source-owned by the official UBIQ
  PDF.
- 21 bound UBIQ open-web rows remain source-owned by the official UBIQ
  PDF.
- representative weak-band carpet exact stack:
  `ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026`,
  `Rw 55`, `Ln,w 63`, `Ln,w+CI 62`.
- representative supported-band timber exact stack:
  `ubiq_fl28_open_web_steel_300_exact_lab_2026`, `Rw 64`,
  `Ln,w 51`, `Ln,w+CI 49`.
- representative supported-band carpet bound stack:
  `ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026`,
  `Rw 64`, `Ln,w+CI <= 45`, no exact `Ln,w`.
- existing family-design, near-miss, packaged-lane trace, visible-card,
  and saved/edit history replay guards are now current-gate owned.

## Source Verification

`source_verified_ubiq_packaged_finish_pdf_status` records that the
official UBIQ PDF was accessible on 2026-05-05. Gate A does not import
or retune source rows; it only promotes existing source-backed coverage
into the current gate.

## Rockwool And Raw Open-Web Carry-Forward

`rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a`
keeps the blocking posture unchanged:

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs with diagnostic `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains `Rw 41` screening-only.
- direct Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.
- generic/raw open-web widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`.

## Frozen Surfaces

Gate A changes current-gate ownership only. Runtime values, source rows,
support semantics, confidence, evidence promotion, API shape,
route-card values, output-card statuses, proposal/report copy, and
workbench input behavior stay unchanged.

## Validation

Required focused validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts --maxWorkers=1
```

Required continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts src/ubiq-open-web-packaged-finish-family-design.test.ts src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts src/ubiq-open-web-packaged-lane-trace-matrix.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts --maxWorkers=1
```

Required final gate:

```sh
pnpm calculator:gate:current
git diff --check
```

Validation completed on 2026-05-05:

- focused packaged-finish Gate A passed 1 file / 5 tests.
- focused packaged-finish continuity passed: engine 4 files / 10 tests
  and web 4 files / 5 tests.
- final `pnpm calculator:gate:current` passed with engine 279 files /
  1577 tests, web 61 files / 273 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx` when the web build runs. The Next build
rewrote `apps/web/next-env.d.ts`; it was restored to the repo's
`.next-typecheck` reference after validation.
