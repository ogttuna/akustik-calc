# DAC UI Refactor Notes - 2026-05-04

## Superseded Master Plan Notice - 2026-06-05

New UI work must follow
`docs/ui/DYNECHO_UI_REBUILD_MASTER_PLAN_2026-06-05.md`. This older note
remains only as historical issue context.

Scope: web UI only. Calculator, engine, shared schemas, source evidence, and runtime acoustic logic stay untouched.

## User-Reported Issues

- Advanced workbench header stacked multiple framed regions and clipped content in the first viewport.
- Simple workbench showed the product brand twice: global session header plus local workbench toolbar.
- Primary Result was too verbose for routine use; important data was buried in explanatory text.
- Route Status repeated solver details that most users will not read during normal operation.
- The result comparison card did not explain what the number meant or whether higher/lower was desirable.
- Clicking Proposal opened an in-page review deck and visually split the workbench instead of moving to a clear proposal/PDF workflow.
- PDF setup needed stronger manual override coverage because calculated values can be wrong and must be manually corrected before issue.
- Layer table headers and row values were not aligned, so the assembly editor read like a broken table.
- The server-project selector clipped `Browser-local` when the setup rail narrowed.
- Mobile workspace tabs truncated labels into `Ass...`, `Res...`, and `Revi...`.

## Fix Plan

1. Keep the global `DYNECHO ACOUSTIC CALCULATOR` header as the only brand header.
2. Collapse advanced-only operator setup, map, and command surfaces behind explicit expandable rows.
3. Move verbose solver detail under `Information` disclosures in Primary Result and Route Status.
4. Replace the weighted headline chart with a plain result card showing current value, target, rule, meaning, and optional supporting values.
5. Route Proposal actions to the full PDF editor instead of opening a bottom split review panel.
6. Expand PDF editor manual overrides to include headline metrics, supporting metrics, layer schedule values, total thickness label, and response-curve numeric series.
7. Give the assembly table a stable desktop grid so `Layer`, `Thickness`, `State`, and `Actions` line up with their row values.
8. Split narrow setup controls into readable rows instead of squeezing selects and icon buttons into one line.
9. Use short mobile workspace labels and hide badges on phones to prevent ellipsis-only navigation.

## Guardrails

- Do not change calculator input normalization, result generation, output formulas, source confidence, or engine contracts.
- Use existing workbench state and proposal snapshot storage only.
- Keep changes isolated to `apps/web`, `packages/ui`, and this UI note.
