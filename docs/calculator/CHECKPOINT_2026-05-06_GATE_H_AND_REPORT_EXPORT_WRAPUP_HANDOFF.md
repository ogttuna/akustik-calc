# Checkpoint - 2026-05-06 Gate H And Report Export Wrap-Up

Slice: `calculator_model_first_physics_prediction_pivot_v1`

Current selected status:

`gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`

Selected next action:

`gate_i_expand_family_material_properties_and_benchmark_scenarios`

## Calculator State

Gate H is landed and validated. The active calculator direction remains
model-first: exact/source rows can override, calibrate, anchor, and
benchmark only when they own the topology/material/metric/tolerance
scope. Missing source evidence still blocks exact/calibration promotion,
but it does not block formula-backed family-physics prediction.

Protected Gate G runtime values remain unchanged:

- grouped explicit-topology Rockwool triple-leaf lab:
  `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`;
- origin: `family_physics_prediction`;
- method: `triple_leaf_two_cavity_frequency_solver`;
- tolerance: `uncalibrated_prediction`, `errorBudgetDb: 5`;
- flat-list split/internal Rockwool remains guarded at diagnostic
  `Rw 41` until grouped topology is explicit.

## Report Export / Manual Edit Readiness

The critical report workflow is now confirmed:

- `/workbench/proposal/configure` is the report editor, not a solver
  mutation surface.
- Manual edits change only the packaged proposal snapshot in
  `dynecho:proposal-preview:v1`.
- PDF and DOCX exports both use that same edited snapshot.
- Primary metric, metric detail rows, layer labels, total-thickness
  label, narrative text, warnings, citations, method blocks, coverage
  posture, and response-curve dB values can be edited before export.
- The calculator inputs, solver routes, and engine outputs remain
  untouched by report edits.
- `/api/proposal-pdf` renders PDF with Playwright/Chromium.
- `/api/proposal-docx` renders DOCX with `@turbodocx/html-to-docx`.

User-facing copy was tightened from "PDF editor" to "report editor" so
DOCX is visible as a first-class export path.

## Validation

Completed on 2026-05-06:

- Focused Gate H:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts --maxWorkers=1`
  passed 1 file / 7 tests.
- Gate A/B/C/D/E/G/H continuity:
  `pnpm --filter @dynecho/engine exec vitest run ... --maxWorkers=1`
  passed 7 files / 45 tests.
- Current calculator gate:
  `pnpm calculator:gate:current` passed engine 288 files / 1632 tests,
  web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard.
- Report editor / export focused web tests:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/proposal-adjust-config.test.ts features/workbench/proposal-adjust-layout.test.ts features/workbench/simple-workbench-proposal-preview-storage.test.ts features/workbench/simple-workbench-proposal-pdf.test.ts features/workbench/simple-workbench-proposal.test.ts features/workbench/simple-workbench-toolbar.test.ts --maxWorkers=1`
  passed 6 files / 24 tests.
- DOCX renderer smoke:
  `renderSimpleWorkbenchProposalDocx(..., { style: "simple" })`
  returned 78227 bytes with `PK` zip header.
- PDF renderer smoke:
  `renderSimpleWorkbenchProposalPdf(..., { style: "simple" })`
  returned 63528 bytes with `%PDF` header.
- Broad repo check:
  `pnpm check` passed with lint clean, typecheck clean, engine full test
  413 files / 2434 tests, web full test 166 files green through
  `run-web-vitest`, and repo build 5 / 5 tasks.

Known non-fatal build warning remains the optional `sharp/@img` package
resolution warning through `@turbodocx/html-to-docx`; the Next build
still completes successfully. `apps/web/next-env.d.ts` was restored to
the repo-standard `.next-typecheck` route-type reference after the build
side effect.

## Next Step

Gate I should expand family/material properties and benchmark scenarios.
Do not reopen Gate H source promotion or report-export mechanics unless
a new failure is observed. Exact/source promotion must continue to pass
through `airborne-source-promotion.ts`, and report edits must remain
separate from calculator runtime state.
