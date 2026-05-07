# Checkpoint - 2026-05-07 - Gate AP Report Export Revalidation And Push Handoff

## Scope

This checkpoint closes the current Gate AP working point before push.
The calculator remains on
`calculator_model_first_physics_prediction_pivot_v1` with Gate AQ as the
next selected implementation step.

The user-critical report workflow was revalidated again because manual
report editing must remain available when a calculated value is not ready
for issue. This is a report/export readiness checkpoint; it does not
move solver runtime values.

## Current Calculator State

Latest landed calculator gate:

`gate_ap_steel_floor_formula_error_budget_hostile_input_plan`

Selection status:

`gate_ap_error_budget_hostile_input_landed_no_runtime_selected_calibration_readiness_gate_aq`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts`

Selected next action:

`gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`

No runtime calculator values were moved in this checkpoint.

## Report Export / Manual Edit Readiness

Confirmed behavior:

- `/workbench/proposal/configure` is the report editor, not a solver
  mutation surface.
- Manual edits change the packaged proposal snapshot used for issue
  exports.
- PDF and DOCX exports consume the same edited proposal snapshot.
- Manual report edits can override primary metric values, metric rows,
  coverage rows, response-curve values, layer labels, construction
  notes, warnings, method/corridor narrative, and issue text.
- Calculator inputs, solver routes, output cards, and engine runtime
  values stay untouched by report edits.

Generated real export artifacts for this checkpoint:

- `output/report-checkpoint-2026-05-07-gate-ap/gate-ap-manual-edit-checkpoint-simple.pdf`
- `output/report-checkpoint-2026-05-07-gate-ap/gate-ap-manual-edit-checkpoint-simple.docx`
- rendered PDF pages:
  `output/report-checkpoint-2026-05-07-gate-ap/gate-ap-manual-edit-checkpoint-simple-page-1.png`
  through
  `output/report-checkpoint-2026-05-07-gate-ap/gate-ap-manual-edit-checkpoint-simple-page-3.png`

Manual values used in the exported snapshot:

- primary metric `Rw 64 dB (manual checkpoint)`;
- metric row `DnT,w 57 dB (manual checkpoint)`;
- metric row `Ln,w 49 dB (manual checkpoint)`;
- executive summary marker `GATE AP CHECKPOINT MANUAL EDIT
  2026-05-07`;
- response curve `Manual checkpoint airborne response` with values
  `43, 50, 58, 64, 69 dB`;
- layer label `Manually edited acoustic membrane label`;
- construction total thickness override `Manual checkpoint total
  thickness: 331 mm`.

PDF checks:

- `pdfinfo` reported a valid 3-page A4 PDF.
- `pdftotext` found the manual primary metric, manual `DnT,w`, manual
  `Ln,w`, summary marker, response-curve label, and manual layer label.
- `pdftoppm` rendered all pages to PNG.
- Visual review of the rendered pages confirmed the manual values,
  metric table, response curve, layer schedule, construction section,
  and proposal notes render legibly without obvious clipping or overlap.

DOCX checks:

- `unzip -t` reported no compressed-data errors.
- Word `document.xml` extraction found the same manual primary metric,
  manual `DnT,w`, manual `Ln,w`, summary marker, response-curve label,
  and manual layer label as the PDF.
- This environment does not have `soffice`/LibreOffice installed, so
  DOCX-to-PDF visual rendering was not available here. The DOCX package
  is structurally valid and contains the same edited snapshot values as
  the PDF.
- Direct DOCX generation emitted a non-fatal `html-to-docx` image
  conversion warning for the minimal checkpoint SVG logo data URL. The
  file was still generated, passed zip integrity, and preserved the
  manual values in Word XML.

## Validation

Completed on 2026-05-07:

- report editor/export focused web tests passed 6 files / 29 tests:
  `proposal-adjust-output-edits.test.ts`,
  `proposal-adjust-config.test.ts`,
  `proposal-adjust-layout.test.ts`,
  `simple-workbench-proposal-pdf.test.ts`,
  `simple-workbench-proposal-preview-storage.test.ts`, and
  `simple-workbench-proposal.test.ts`;
- real PDF and DOCX manual-edit export generation passed;
- PDF text extraction, PDF rendering, DOCX zip integrity, and DOCX XML
  content checks passed;
- full `pnpm calculator:gate:current` passed: engine 322 files / 1825
  tests, web 66 files / 286 passed with 18 skipped, repo build 5/5
  successful, and whitespace guard clean;
- `git diff --check` passed after the checkpoint documentation update.

Known non-fatal warnings remain the Node/Vitest Zustand persist storage
warning and optional `sharp/@img` package resolution warnings through
`@turbodocx/html-to-docx` during Next build.

## Next

Commit only source/docs changes and push `main` to `origin`.

Then continue Gate AQ:

`gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`
