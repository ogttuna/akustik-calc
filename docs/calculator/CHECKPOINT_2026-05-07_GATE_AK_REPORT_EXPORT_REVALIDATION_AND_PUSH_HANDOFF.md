# Checkpoint - 2026-05-07 - Gate AK Report Export Revalidation And Push Handoff

## Scope

This checkpoint closes the current Gate AK working point before push.
The calculator remains on
`calculator_model_first_physics_prediction_pivot_v1` with Gate AL as the
next selected implementation step.

The user-critical report workflow was revalidated because manual report
editing must remain available when a calculated value is not ready for
issue.

## Current Calculator State

Latest landed calculator gate:

`gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`

Selection status:

`gate_ak_delta_lw_holdout_packet_contract_landed_selected_first_source_owned_holdout_gate_al`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`

Selected next action:

`gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`

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

- `output/report-checkpoint-2026-05-07/manual-edit-checkpoint-simple.pdf`
- `output/report-checkpoint-2026-05-07/manual-edit-checkpoint-simple.docx`
- rendered PDF pages:
  `output/report-checkpoint-2026-05-07/manual-edit-checkpoint-simple-page-1.png`
  through
  `output/report-checkpoint-2026-05-07/manual-edit-checkpoint-simple-page-3.png`

Manual values used in the exported snapshot:

- primary metric `Rw 63 dB (manual checkpoint)`;
- metric row `DnT,w 56 dB (manual checkpoint)`;
- executive summary marker `CHECKPOINT MANUAL PDF DOCX EDIT VALUE
  63/56`;
- response curve `Manual checkpoint response curve` with values
  `43, 50, 57 dB`;
- layer label `Manual edited layer label`.

PDF checks:

- `pdfinfo` reported a valid 3-page A4 PDF.
- `pdftotext` found the manual primary metric, manual `DnT,w`, summary
  marker, response-curve label, and manual layer label.
- `pdftoppm` rendered all pages to PNG.
- Visual review of the rendered pages confirmed the manual values,
  tables, curve, and construction section render legibly without obvious
  clipping or overlap.

DOCX checks:

- `unzip -t` reported no compressed-data errors.
- Word `document.xml` extraction found the same manual primary metric,
  manual `DnT,w`, summary marker, response-curve label, and manual layer
  label as the PDF.
- This environment does not have `soffice`/LibreOffice installed, so
  DOCX-to-PDF visual rendering was not available here. The DOCX package
  is structurally valid and contains the same edited snapshot values as
  the PDF.

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
  content checks passed.
- final `pnpm calculator:gate:current` passed after this documentation
  update: engine 317 files / 1798 tests, web 65 files / 284 passed with
  18 skipped, repo build 5/5 successful, and whitespace guard clean.
- `git diff --check` passed.

Known non-fatal warning remains the optional `sharp/@img` package
resolution warning through `@turbodocx/html-to-docx` during Next build.

## Next

Commit only source/docs changes and push `main` to `origin`.

Then continue Gate AL:

`gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`
