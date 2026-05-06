# Checkpoint - 2026-05-06 Gate I And Report Export Manual-Edit Validation

Slice:
`calculator_model_first_physics_prediction_pivot_v1`

Current selected status:
`gate_i_family_material_properties_and_benchmark_scenarios_landed_no_runtime_selected_personal_use_readiness_gate_j`

Selected next file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts`

Selected next action:
`gate_j_build_personal_use_readiness_scenario_pack`

## Summary

This checkpoint closes the current working point after Gate I and
revalidates the user-critical report export workflow.

Gate I remains the latest landed calculator gate. Runtime calculator
values are unchanged. The active plan still moves next to Gate J:
personal-use readiness scenario pack and visible/report parity.

The report editor remains a report-snapshot editor, not a calculator
mutation surface:

- manual edits change only the packaged proposal snapshot;
- PDF and DOCX exports both consume that edited snapshot;
- calculator inputs, solver routes, route cards, and engine outputs stay
  untouched by report edits;
- the edited snapshot can override report text, primary metric values,
  metric rows, response-curve values, layer labels, total-thickness
  label, warnings, coverage posture, and method/corridor narrative.

## Manual Export Verification

Generated a real manual-edit export snapshot with:

- primary metric `Rw 59 dB (manual checkpoint)`;
- metric row `DnT,w 54 dB (manual checkpoint)`;
- executive summary marker `CHECKPOINT MANUAL EDIT`;
- total thickness `224 mm total (manual checkpoint)`;
- response curve `Manual airborne curve` with values `42, 49, 55 dB`.

Generated artifacts:

- `output/report-checkpoint/manual-edit-report-simple.pdf`
- `output/report-checkpoint/manual-edit-report-simple.docx`
- rendered PDF page images:
  `output/report-checkpoint/manual-edit-report-simple-page-1.png`
  through `manual-edit-report-simple-page-4.png`

PDF checks:

- `pdfinfo` reported a valid 4-page A4 PDF.
- `pdftotext` found the manual primary metric, executive summary,
  manual issue snapshot label, manual response-curve label, and manual
  total-thickness label.
- `pdftoppm` rendered all pages to PNG.
- Visual review of the rendered PNG pages confirmed the manual metric,
  manual curve/table values, construction-section total thickness, and
  issue guardrail text render legibly without obvious clipping or
  overlap.

DOCX checks:

- `unzip -t` reported no compressed-data errors.
- Word `document.xml` text extraction found the manual primary metric,
  executive summary marker, manual issue snapshot label, manual
  response-curve label, and manual total-thickness label.
- This environment does not have `soffice`/LibreOffice installed, so a
  DOCX-to-PDF visual render was not available here. The generated DOCX
  package is structurally valid and contains the same edited snapshot
  values as the PDF.

## Code/Test Adjustment

Added a focused client-side export assertion to
`apps/web/features/workbench/simple-workbench-proposal-pdf.test.ts` so
the manually edited proposal snapshot is explicitly sent to the PDF
route as well as the DOCX route.

## Validation

Completed:

- focused Gate I:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts --maxWorkers=1`
  passed 1 file / 7 tests after doc updates.
- Gate A/B/C/D/E/G/H/I continuity passed 8 files / 52 tests before the
  report-export checkpoint update.
- `pnpm calculator:gate:current` passed before the report-export
  checkpoint update with engine 289 files / 1639 tests, web 61 files /
  273 passed + 18 skipped, repo build 5 / 5 tasks, and whitespace guard
  green.
- report editor/export focused web tests:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-proposal-pdf.test.ts features/workbench/simple-workbench-proposal-preview-storage.test.ts features/workbench/proposal-adjust-config.test.ts features/workbench/proposal-adjust-layout.test.ts --maxWorkers=1`
  passed 4 files / 20 tests.
- `pnpm --filter @dynecho/web lint` passed after the export assertion.
- `pnpm --filter @dynecho/web typecheck` passed after the export
  assertion.
- `git diff --check` passed after final doc/test edits.
- broad `pnpm check` was started and then stopped per user instruction
  to skip the remaining long tests. Before it was stopped, lint and
  typecheck were green, engine full test was green at 414 files / 2441
  tests, and web long tests plus batch 1 were green. The stop itself
  produced the final non-green exit code.

Known non-fatal warning remains the optional `sharp/@img` package
resolution warning through `@turbodocx/html-to-docx`.

## Next Step

Continue with Gate J:
`gate_j_build_personal_use_readiness_scenario_pack`.

Gate J should make personal-use readiness executable across wall/floor,
exact source, anchored delta, calibrated prediction, uncalibrated
prediction, field/building continuation, missing-input prompts,
unsupported outputs, hostile inputs, saved/replayed scenarios, visible
cards, and report/PDF/DOCX parity.
