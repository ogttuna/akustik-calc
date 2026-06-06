# DynEcho UI Rebuild Phase 0 Baseline - 2026-06-05

Document role: Phase 0 source map and guardrail for the new UI rebuild.
This document is an implementation note under
`docs/ui/DYNECHO_UI_REBUILD_MASTER_PLAN_2026-06-05.md`.

## Scope

Phase 0 is documentation and frontend source audit only.

- No backend, engine, API route contract, shared schema, auth, storage, or
  calculator behavior changes are allowed in this phase.
- No app UI implementation is performed in this phase.
- No PDF output builder, PDF renderer, proposal document builder, or export
  API is changed in this phase.
- The current Workbench V2 visual implementation remains rejected and is not a
  style baseline.

## Protected Visual Baselines

The rebuild keeps only these established visuals as product references:

1. Response graph
   - User reference: Image #1, log-spaced band curve view.
   - Keep the low, speech, and high frequency bands; log frequency axis;
     curve and point read; directional meaning; and engineering readability.
   - Improve polish, spacing, typography, contrast, and chart framing.

2. Layer illustration
   - User reference: Image #2, older wall/floor section preview plus
     technical layer schedule.
   - Keep the real construction-section concept, bounded thickness cues,
     wall/floor orientation, layer index labels, and technical schedule.
   - Improve material readability, selected-layer linkage, density of labels,
     professional appearance, and desktop clarity.

3. Proposal/PDF output
   - User references: Images #3 and #4, older accepted proposal/PDF output.
   - Preserve generated/exported PDF output content: proposal structure,
     response curve, indices, visible layer schedule, report wording,
     values, and renderer behavior.
   - The web report editor page may be rebuilt, but the exported PDF output is
     protected.

## Protected Source Map

### Response Graph

Use these as the graph baseline and improve only in the approved graph
prototype phase:

- `apps/web/features/workbench/response-curve-model.ts`
  - Builds `WorkbenchResponseCurveFigure` from the existing
    `AssemblyCalculation`.
  - Preserves active airborne and impact curve semantics.
  - Depends on shared calculation output shape. Do not change metric values or
    engine contracts here during the UI rebuild.

- `apps/web/features/workbench/response-curve-figure-card.tsx`
  - Renders the Recharts line chart.
  - Owns the low, speech, and high band visual, log axis, readout cards,
    tooltip, active/reference series distinction, and direction label.
  - Can be restyled or split into a cleaner graph component only during the
    protected graph prototype phase.

- `apps/web/features/workbench/chart-surface.tsx`
  - Provides responsive chart sizing and empty/placeholder behavior.
  - May be reused if it stays a neutral chart wrapper.

Do not replace the graph with generic KPI cards. Do not drop the log frequency
axis, band regions, curve, points, or active series semantics.

### Layer Illustration

Use these as the layer-illustration baseline and improve only in the approved
layer prototype phase:

- `apps/web/features/workbench/simple-workbench-layer-diagram.tsx`
  - Bridges workbench rows/materials/results into a section figure and
    technical layer schedule.
  - Contains wall/floor section headings, total thickness, surface mass read,
    active row highlighting, and solver layer schedule rows.

- `apps/web/features/workbench/simple-workbench-illustration.ts`
  - Owns bounded thickness distribution and material-cue inference.
  - Defines the `floor`, `wall`, `proposalFloor`, and `proposalWall`
    illustration presets.
  - Preserve this calculation/presentation distinction: preview scale is
    bounded, but calculation geometry remains literal.

- `apps/web/features/workbench/simple-workbench-section-illustration.tsx`
  - Renders the SVG construction-section visual for wall and floor
    orientations.
  - Contains material textures, active outline, thickness callouts, layer
    badges, and total thickness dimensioning.

- `apps/web/features/workbench/simple-workbench-layer-visuals.ts`
  - Provides material surface styling helpers for UI schedule/legend usage.
  - Current raw styling should be centralized in Phase 1 before new surfaces
    depend on it.

- `apps/web/features/workbench/simple-workbench-proposal-construction-figure.tsx`
  - Renders proposal-side construction section and technical schedule.
  - May be visually improved only if the generated/exported PDF output is not
    changed.

- `apps/web/features/workbench/simple-workbench-proposal-construction-section.ts`
  - Builds proposal construction section data from packaged proposal layers.
  - Treat as protected data shaping for proposal output.

Do not reuse old workbench panels around these files. Extract or wrap the
illustration into the new UI only after the isolated prototype is accepted.

### Proposal And PDF Output

These are protected output files. Do not edit them during the UI rebuild
unless the user explicitly opens a separate PDF-output task:

- `apps/web/features/workbench/simple-workbench-proposal.ts`
  - Defines `SimpleWorkbenchProposalDocument`.
  - Parses proposal payloads.
  - Builds branded proposal HTML/text and preserves output structure.

- `apps/web/features/workbench/simple-workbench-proposal-simple.ts`
  - Builds the simple proposal/PDF HTML.
  - Owns simple report standards, curve rendering, indices, tables, and
    client-facing cleanup.

- `apps/web/features/workbench/simple-workbench-proposal-reporting.ts`
  - Builds report construction SVG/rendering helpers for proposal output.
  - Protected because PDF content and construction figure output depend on it.

- `apps/web/features/workbench/simple-workbench-proposal-preview-html.ts`
  - Selects branded vs simple preview HTML from the protected builders.

- `apps/web/features/workbench/simple-workbench-proposal-pdf-server.ts`
  - Server-side PDF renderer using Chromium and protected proposal HTML.

- `apps/web/features/workbench/simple-workbench-proposal-docx-server.ts`
  - Server-side DOCX renderer using protected proposal HTML.

- `apps/web/features/workbench/simple-workbench-proposal-pdf.ts`
  - Client download helper for PDF/DOCX export routes.

- `apps/web/app/api/proposal-pdf/route.ts`
  - Authenticates, parses the proposal payload, renders PDF, records export
    audit, and returns the file.
  - Do not change this route for UI polish.

- `apps/web/app/api/proposal-docx/route.ts`
  - Same export boundary for DOCX.
  - Protected for the same reason as PDF unless DOCX is explicitly selected.

The report editor may call these paths, but must not redesign their generated
output.

### Handoff And Report Editor Surface

These files are not the protected PDF output itself. They are candidates for
future report-editor or handoff work:

- `apps/web/features/workbench/simple-workbench-proposal-preview-storage.ts`
  - Stores and reads the proposal preview snapshot in local storage.
  - Future UI work may use this to package/read the existing snapshot.
  - Fixes here must preserve stored snapshot compatibility.

- `apps/web/app/workbench/proposal/proposal-preview-client-page.tsx`
  - Current web proposal preview/export UI.
  - May be replaced by the new report editor page.
  - Must continue to feed the protected PDF/DOCX output unchanged.

- `apps/web/app/workbench/proposal/configure/proposal-adjust-client-page.tsx`
  - Current manual edit and assistant surface.
  - It can inform the new report editor behavior, but it is not a visual
    baseline.
  - Assistant/manual edits must remain explicit and report-snapshot scoped.

- `apps/web/features/workbench/proposal-adjust-output-edits.ts`
  - Existing report value edit helpers.
  - Can be reused only if it preserves engine values and report-edit scope.

## Current Risks To Carry Forward

- PDF page vs PDF output can be confused. The web page can be rebuilt; the
  exported PDF output cannot be redesigned in this UI rebuild.
- Handoff failures should be fixed at snapshot packaging, snapshot reading, or
  navigation level. They should not be fixed by editing the PDF renderer.
- Static screenshots are not product truth. The source files above are the
  executable baselines.
- Existing Workbench V2 visual code is rejected. Do not migrate its clutter,
  copy density, nested panels, or scroll behavior into the new UI.
- Other agents are active in calculator/backend areas. UI rebuild work must
  stay out of engine, backend, endpoint, schema, auth, and storage behavior.

## Phase 1 Entry Rules

Before Phase 1 starts:

- The master plan must link this Phase 0 baseline.
- New work must start with the central style foundation in
  `apps/web/app/globals.css`.
- Light and dark mode tokens must be defined before new pages are built.
- New components must be purpose-built for the new UI. Do not reuse old UI
  components except the protected graph, layer illustration, and PDF output
  sources listed above.

## Phase 0 Acceptance Checklist

- [x] Protected response graph files identified.
- [x] Protected layer illustration files identified.
- [x] Protected proposal/PDF output files identified.
- [x] Handoff/report-editor candidate files separated from PDF output files.
- [x] Backend, engine, API contracts, shared schemas, auth, storage, and
      calculator behavior left untouched.
- [x] No app UI code implemented in this phase.
- [x] Phase 1 is blocked on central style foundation, not page work.
