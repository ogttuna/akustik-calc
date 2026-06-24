# Workbench V2 Output Selection Flow Bug Hunt - 2026-06-23

## Status

User-requested Workbench V2 output-selection and assistant-flow bug
hunt landed as non-runtime support work.

This handoff records a UI/state-boundary hardening pass. It is adjacent
to the calculator because it protects metric/basis integrity in the
workbench and assistant flows, but it does not open a new formula route
or change engine runtime values.

Do not treat this document as a replacement for:

- `docs/calculator/DOCUMENTATION_MAP.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- the currently selected British Gypsum exact lab calculated lab
  companion coverage refresh

## User Request Summary

The user reported that selected outputs sometimes felt mixed up in the
Workbench V2 UI and asked for a deeper bug/inconsistency hunt across
the related flows.

The pass focused on:

- selected output persistence and restore;
- mode switching between wall and floor;
- assistant natural-language `set_outputs` commands;
- assistant calculator preview `targetOutputs` overrides;
- confirmed assistant apply proposals;
- route-input visibility for newer output ids.

## Findings

### Stale Workbench V2 Output Lists

The Workbench V2 output picker and snapshot parser did not have one
shared source of truth for user-visible output ids.

Risk:

- newer outputs such as `Dn,w`, `Dn,A`, `DnT,A`, `DnT,A,k`,
  `Ln,w+CI`, `LnT,A`, `IIC`, and `AIIC` could be dropped or mishandled
  by older allow lists;
- a restored snapshot could fall back to an older output selection;
- helper functions that decide whether airborne or impact context is
  visible could miss newer output ids.

Fix:

- `apps/web/features/workbench-rebuild/workbench-v2-output-catalog.ts`
  is the central Workbench V2 user-output catalog.
- It defines output groups, labels, mode availability, user-output ids,
  `filterWorkbenchV2OutputsForMode`, default selected outputs, and
  `normalizeWorkbenchV2SelectedOutputs`.
- Main Workbench V2 output picker, snapshot parser/builder, assistant
  commands, and preview flows use that shared catalog.

### Snapshot Build/Restore Could Carry Mode-Incompatible Outputs

Saved/restored Workbench V2 snapshots needed the same mode-aware output
normalization on both parse and build.

Risk:

- a wall snapshot carrying only floor-impact outputs such as `AIIC` and
  `IIC` could preserve an impossible selected-output state or fall back
  inconsistently;
- future callers could build invalid snapshots even if parser restore
  was guarded.

Fix:

- `buildWorkbenchV2ProjectSnapshot` and
  `parseWorkbenchV2ProjectSnapshot` both call
  `normalizeWorkbenchV2SelectedOutputs`.
- Mixed wall selections such as `AIIC + Rw + IIC` preserve `Rw` and drop
  floor-only outputs.
- Wall impact-only selections fall back to `Rw`; floor invalid/empty
  selections fall back to `Ln,w`.

### Assistant Snapshot Preview Override Could Bypass Snapshot Mode

`previewWorkbenchV2CalculatorSnapshot` accepted valid Workbench V2
output ids without checking whether those ids were valid for the
snapshot mode.

Risk:

- a wall snapshot preview could be asked for `AIIC`;
- mixed override lists could include a valid wall output plus an invalid
  floor-only output;
- preview output rows and estimate payloads could then diverge from the
  UI's mode-specific output surface.

Fix:

- snapshot preview override outputs are filtered by parsed snapshot
  mode;
- an override list with no mode-supported output now returns
  `invalid_workbench_v2_calculator_outputs`;
- a mixed override such as `Rw + AIIC` on a wall snapshot previews only
  `Rw`.

### Assistant Apply Proposal Could Replay Invalid Outputs

The assistant apply proposal path needed a defensive gate even when the
normal UI command parser had already tried to keep outputs mode-safe.

Risk:

- a stale or tampered proposal could carry `AIIC` into a wall Workbench
  draft;
- the confirmation boundary could apply selected outputs before checking
  whether they belonged to the proposal mode.

Fix:

- `createReportAssistantWorkbenchApplyProposal` filters requested
  outputs by draft mode.
- Mixed requests keep supported outputs and emit a warning for ignored
  mode-incompatible outputs.
- Requests where every output is mode-incompatible fail with
  `unsupported_draft_outputs`.
- `confirmReportAssistantWorkbenchApplyProposal` rejects malformed or
  tampered proposals whose selected outputs do not belong to the
  proposal mode before calling `confirm` or `apply`.
- The visible Workbench apply handler still normalizes selected outputs
  before writing browser draft state.

### Context Visibility Needed Newer Output Coverage

The route-input visibility helpers needed the expanded output surface.

Fix:

- airborne context recognizes newer airborne/building outputs including
  `Dn,w`, `Dn,A`, `DnT,A`, and `DnT,A,k`;
- impact context recognizes `AIIC`, `IIC`, `Ln,w+CI`, and `LnT,A`;
- floor impact context now follows all impact outputs exposed by the
  Workbench V2 catalog.

## Implementation Files

Core implementation:

- `apps/web/features/workbench-rebuild/workbench-v2-output-catalog.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-project-snapshot.ts`
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.ts`
- `apps/web/features/workbench/report-assistant-workbench-apply-proposal.ts`
- `apps/web/features/workbench/report-assistant-workbench-confirmed-apply.ts`

Regression coverage:

- `apps/web/features/workbench-rebuild/workbench-v2-project-snapshot.test.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts`
- `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
- `apps/web/features/workbench/report-assistant-workbench-apply-proposal.test.ts`
- `apps/web/features/workbench/report-assistant-workbench-confirmed-apply.test.ts`

## Safety Boundary

- No engine formula changed.
- No runtime value changed.
- No acoustic source row was imported.
- No formula coefficient was retuned.
- No new calculable layer template was opened.
- No selected calculator implementation action changed.
- The current selected next remains
  `post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_plan`.

This support work protects the UI and assistant state boundary so the
selected output list cannot silently cross the wall/floor mode boundary.

## Counters

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 7`
- `frontendRegressionFilesTouched: 7`
- `docsFilesTouched: 7`

## Validation

Focused regression:

- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-project-snapshot.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench/report-assistant-workbench-apply-proposal.test.ts features/workbench/report-assistant-workbench-confirmed-apply.test.ts`
  passed `4 files / 40 tests`.
- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
  passed `1 file / 23 tests`.

Broader validation:

- `pnpm --filter @dynecho/web typecheck` passed.
- `pnpm --filter @dynecho/web test` passed the full web runner:
  `303 web test files`; step summaries total `1746 passed` and
  `18 skipped`.
- Touched-file ESLint reported `0 errors` and one pre-existing
  `react-hooks/exhaustive-deps` warning in
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.
- `git diff --check` passed.

Known non-fatal test stderr:

- The full web test run still prints known
  `[zustand persist middleware] Unable to update item
  'dynecho-workbench-store'` messages in some tests. They did not fail
  the runner.

## Next Agent Notes

- Treat this as Workbench V2 state-boundary support, not calculator
  runtime progress.
- If a future output id is added, add it to
  `workbench-v2-output-catalog.ts` first and let parser, picker,
  assistant preview, and apply flows consume the same catalog.
- If another assistant path writes selected outputs into browser state,
  it should use `normalizeWorkbenchV2SelectedOutputs` or reject
  mode-incompatible outputs before mutation.
- Do not convert this bug-hunt track into a formula-owner replacement.
  Return to the selected British Gypsum exact lab calculated lab
  companion coverage refresh unless the user explicitly asks for more
  Workbench support work.
