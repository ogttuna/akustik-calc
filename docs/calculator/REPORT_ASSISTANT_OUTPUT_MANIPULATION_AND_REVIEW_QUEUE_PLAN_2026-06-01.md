# Report Assistant Output Manipulation And Review Queue Plan

Status: IN PROGRESS USER-REQUESTED PRODUCT ADJUNCT

Opened: 2026-06-01

This plan is intentionally separated from the active post-V1 calculator
scope/accuracy gate chain. It does not select a new calculator slice and
must not change acoustic formulas, candidate selection, runtime values,
`needs_input` boundaries, or `unsupported` boundaries.

## Implementation Progress

2026-06-02:

- Phase A deterministic context and patch core has started in the web
  report surface only. It added report assistant context extraction,
  patch validation, guarded patch application, value-mention detection,
  stable report metric ids, and report-adjustment audit fields on the
  proposal document.
- Phase B has started with an in-app guarded patch panel on the proposal
  configure page. The panel accepts structured patch JSON, shows current
  metric ids, validates the patch in the app, requires confirmation for
  movements above 5 dB, rejects movements above 10 dB, and applies only
  validated report-document edits.
- The configure-page export action now sends the current editable
  document to PDF/DOCX without silently saving localStorage
  customizations. `Save edits` remains the explicit persistence action.
- Phase C has started with a provider-agnostic
  `/api/report-assistant/patch` endpoint. The first implementation uses
  deterministic narrow instruction parsing, not a live model call. It
  accepts only the current report context, current proposal document, and
  user instruction, generates a structured `ReportAssistantPatch`, and
  returns it only after the shared validator accepts it.
- The proposal configure assistant panel can now generate a guarded
  patch from simple instructions such as "set Rw to 55 dB" or "make
  Ln,w 3 dB lower"; pasted JSON remains available as a fallback and for
  future model integration testing.
- Phase E has started with an explicit review-finding log path. The
  proposal configure assistant panel can append suspicious-value
  findings to
  `.dynecho/calculator-review-queue/report-assistant-findings.jsonl`
  through `/api/report-assistant/findings` only after a user-confirmed
  "log review finding" action. The record copies metric values and trace
  context from the current `ReportAssistantContext` instead of trusting
  model/client-supplied output values.
- Phase D has started with a context-only plausibility review endpoint
  at `/api/report-assistant/plausibility`. It compares the current
  report display value to the captured engine display value and trace
  metadata, returns a verdict/rationale/severity, and may offer a
  validator-checked restore patch only inside the existing report patch
  movement limits. Drifts above 10 dB are logged as review concerns
  rather than auto-loaded as patch proposals.
- The proposal configure assistant panel now has a "Review value
  plausibility" control. It does not call a live model or web research
  provider yet; it can prefill the review-finding form from the
  context-only review and can load a suggested patch only when the
  shared patch validator accepts it.
- Phase F has started with a disabled-by-default model provider seam
  behind `/api/report-assistant/patch`. When
  `DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT` is unset, the endpoint keeps
  using the deterministic parser. When it is set to an `http`/`https`
  endpoint such as a local `system_llm` proxy, the app sends only the
  compact `ReportAssistantContext`, user instruction, and patch contract
  rules; the model must still return a `ReportAssistantPatch` that the
  shared validator accepts before the UI can load it.
- The model seam accepts direct patch JSON, OpenAI-style text content,
  and Gemini-style candidate text wrappers so it can sit behind a
  provider/proxy without changing the report assistant contract. Model
  provider failures fall back to the deterministic parser with a visible
  warning; unsafe model patches remain rejected by the validator.
- Phase G has started with a disabled-by-default source-bounded
  plausibility research seam behind `/api/report-assistant/plausibility`.
  Context-only review remains the default. When the user explicitly
  requests source research and
  `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT` is configured, the route
  sends only the selected metric, compact report context, trace summary,
  layer summary, and review contract to the provider. Returned reviews
  are sanitized so metric/value fields remain owned by the local
  `ReportAssistantContext`; source metadata must be `http`/`https`; any
  suggested report patch still goes through the shared patch validator.
- The proposal configure assistant panel now has an explicit "Use
  configured source research" control. If research is requested but no
  endpoint is configured, or if the provider fails, the endpoint returns
  a context-only review with a visible warning instead of blocking report
  work or touching calculator state.
- Phase H has started with an MCP-compatible tool adapter over the same
  validated contract. It declares only read-only or proposal-only tools:
  `resolve_report_metric_reference`, `preview_report_patch`,
  `find_report_value_mentions`, `research_acoustic_reference`, and
  `prepare_calculator_finding`. The adapter does not expose
  `apply_report_patch`, export, save, reset, or JSONL write tools.
- The adapter operates on caller-provided `ReportAssistantContext` and
  `SimpleWorkbenchProposalDocument` snapshots because a standalone MCP
  process still cannot see live React browser state by itself. It uses
  the shared patch validator, source-bounded research helper, and finding
  preparation helper, and returns `mutates: false` for every supported
  tool.
- Phase I has started with an authenticated runtime status route at
  `/api/report-assistant/status`. It reports whether the model and
  source-research providers are configured, summarizes endpoint
  `origin`/`pathname` without query strings or API keys, exposes timeout
  and model labels, lists the read-only/proposal-only tool definitions,
  and returns `mutatingToolsExposed: false`.
- The status route is intended for deployment readiness and smoke
  checks before connecting a live `system_llm`/research provider or MCP
  server wrapper. It does not call external providers, run calculator
  code, mutate reports, write findings, or expose secrets.
- No engine, layer, formula, route-selection, saved scenario output, or
  calculator runtime behavior has been changed by this assistant slice.

Still open:

- enabling and smoke-testing a real model/proxy deployment by setting
  `DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT`;
- enabling and smoke-testing a real source research provider by setting
  `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT`;
- wiring the MCP-compatible adapter into a deployed MCP server if this
  project later adds MCP server infrastructure.

## Objective

Add a narrow report assistant that can help the user manipulate proposal
and PDF/DOCX output values without changing the calculator result.

The assistant should support three user-requested jobs:

1. report-output manipulation: reduce, increase, or replace displayed
   `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, `L'nT,w`, and related report
   values for the current export only;
2. plausibility review: research or reason about whether a reported
   acoustic value is plausible for the current construction and explain
   the concern with sources when web research is requested;
3. review queue logging: record suspicious or implausible values with
   the selected calculation route, candidate, basis, warnings, and user
   context so later agentic calculator work can inspect them.

## Product Boundary

The assistant is not an answer engine and must not become a shortcut
around the calculator.

- The engine result remains the source of calculator truth.
- The report document may carry an export-only override.
- Export-only overrides must not feed back into `calculateAssembly`,
  `calculateImpactOnly`, saved scenario output snapshots, answer cards,
  route support status, or candidate selection.
- The assistant must not turn `needs_input` or `unsupported` outputs
  into numeric claims.
- Metric and basis boundaries still apply: `Rw` is not `R'w`, `Ln,w` is
  not `IIC`, lab impact is not field impact, and ISO/ASTM aliases are
  not allowed without an explicit owner.

## Final Default Decisions

Use these defaults for the first implementation unless a later product
decision explicitly changes them.

- Phase A starts without any model call, MCP server, or external
  research. It builds only deterministic context extraction, patch
  validation, preview, apply helpers, and tests.
- The model provider is not part of the core design. Gemini, OpenAI, or
  another provider may be used later as long as it returns the same
  structured patch proposal and cannot bypass validation.
- The first assistant UI lives in the proposal/PDF configure flow and
  reads the active `editableDocument`, because that is the report state
  the user is about to export.
- The model proposes a patch. The app/server validates the patch. The
  user confirms the preview. Only then does deterministic app code apply
  the change to the report document.
- Apply, export, save, reset, and queue-write actions are owned by the
  app/server confirmation layer, not by the model.
- Assistant edits are export-only by default. They become persistent
  custom proposal edits only when the user explicitly saves the edited
  report snapshot.
- The first value-edit scope is single-number report outputs only:
  `Rw`, `R'w`, `DnT,w`, `Dn,w`, `Dn,A`, `DnT,A`, `DnT,A,k`, `Ln,w`,
  `L'n,w`, `L'nT,w`, `L'nT,50`, `CI`, `CI,50-2500`, `Ln,w+CI`,
  `DeltaLw`, and already-supported ASTM/NEN outputs when they are live.
- Response curve and chart editing remains manual in the first
  assistant slice.
- Bound values keep their bound prefix. A `<= 50 dB` upper bound may
  become `<= 47 dB`, but the assistant cannot remove `<=`. A
  `>= 26 dB` lower bound may become `>= 28 dB`, but the assistant
  cannot remove `>=`.
- Numeric movement above 5 dB requires extra confirmation. Numeric
  movement above 10 dB is rejected by the assistant patch path; the user
  may still use the existing manual editor if they intentionally need a
  larger literal report edit.
- `needs_input` and `unsupported` outputs cannot become numeric values.
  The assistant may only add a report note or review finding about those
  stopped outputs.
- External source-bounded plausibility research is not part of the first
  implementation slice. Context-only plausibility review may compare the
  current report value with the captured engine value, but web/model
  evidence is added only after the deterministic patch flow is stable.
- Report adjustment audit and calculator review findings are separate
  records. Audit explains report-only overrides; review findings are
  future calculator-investigation candidates.

## Current Implementation Fit

The requested report-manipulation workflow is close to existing code.

- `apps/web/features/workbench/simple-workbench-proposal.ts` defines
  `SimpleWorkbenchProposalDocument`, parses proposal payloads, and
  renders proposal text/HTML.
- `apps/web/app/workbench/proposal/configure/proposal-adjust-client-page.tsx`
  already keeps `baseDocument` and `editableDocument`, detects manual
  overrides, and can save customized proposal snapshots.
- `apps/web/features/workbench/proposal-adjust-output-edits.ts` already
  updates primary metric, metric rows, and coverage rows together.
- `apps/web/features/workbench/proposal-adjust-output-edits.test.ts`
  already proves manual value propagation for `Rw` and `Ln,w`.
- `apps/web/features/workbench/simple-workbench-proposal-preview-storage.ts`
  already separates `baseDocument` and `customDocument` in browser
  localStorage.
- `apps/web/app/api/proposal-pdf/route.ts` and
  `apps/web/app/api/proposal-docx/route.ts` already accept a proposal
  document payload, parse it, render the export, and append a project
  proposal audit event when a project id is present.
- `apps/web/features/workbench/simple-workbench-method-dossier.ts`,
  `apps/web/features/workbench/simple-workbench-corridor-dossier.ts`,
  and the `AssemblyCalculation` payload already expose enough trace data
  to summarize selected route, basis, dynamic traces, stopped outputs,
  and warnings.

The main gap is not PDF rendering. The main gap is a safe assistant
contract between the current browser report state, deterministic patch
validation, optional external research, and optional finding logging.

## Browser State Constraint

The current report can live in browser state:

- the user edits proposal values in React state;
- the proposal preview is cached in browser localStorage;
- the user may want to export the edited document without saving the
  customization as a persistent snapshot.

A standalone MCP server cannot automatically see that live React state.
It would either receive stale data or need brittle browser-control tools.

The MVP should therefore be in-app first:

1. the proposal page sends the current report context to the assistant
   endpoint;
2. the assistant returns a small patch proposal;
3. the app validates the proposal and shows a preview;
4. the user confirms the preview;
5. deterministic app code applies the validated patch to the current
   `editableDocument`;
6. PDF/DOCX export receives the patched document directly.

MCP can be added later as a thin wrapper over the same app/backend
tools, not as the first integration layer.

## Target Architecture

Flow:

1. Workbench calculates the assembly through the existing engine.
2. Proposal panel builds a `SimpleWorkbenchProposalDocument`.
3. Proposal configure page opens a Report Assistant panel.
4. The client builds a `ReportAssistantContext` from:
   - current `editableDocument`;
   - original `baseDocument`;
   - calculation trace summary;
   - visible output statuses and warnings;
   - optional user instruction.
5. Assistant endpoint returns a structured `ReportAssistantPatch`
   proposal.
6. Deterministic app/server code validates the patch.
7. The user previews and confirms the validated patch.
8. Deterministic app code applies the patch to the editable report
   state.
9. Export sends the patched document to PDF/DOCX routes.
10. Optional review findings are appended to a separate review queue
    only after explicit user confirmation.

The assistant should never receive the full repository, full engine
internals, or broad project storage by default. It only receives the
minimal report and trace context needed for the requested operation.

## Assistant Context Contract

Create a compact context type, for example:

```ts
type ReportAssistantContext = {
  reportId: string;
  projectId?: string;
  scenarioId?: string;
  createdAtIso: string;
  metrics: ReportAssistantMetric[];
  layersSummary: string[];
  warnings: string[];
  traceSummary: ReportAssistantTraceSummary;
};

type ReportAssistantMetric = {
  id: string;
  metric: string;
  label: string;
  engineDisplayValue?: string;
  reportDisplayValue?: string;
  numericDb?: number;
  status: "live" | "bound" | "needs_input" | "unsupported";
  direction: "higher_is_better" | "lower_is_better" | "neutral";
  basis: "lab" | "field" | "building_prediction" | "unknown";
  locations: ReportAssistantMetricLocation[];
};

type ReportAssistantMetricLocation =
  | { kind: "primaryMetric" }
  | { kind: "metricRow"; index: number }
  | { kind: "coverageRow"; index: number };

type ReportAssistantTraceSummary = {
  selectedCandidateId?: string;
  selectedOrigin?: string;
  basis?: string;
  route?: "wall" | "floor" | "unknown";
  dynamicAirborneFamily?: string;
  dynamicImpactFamily?: string;
  missingPhysicalInputs: string[];
  unsupportedOutputs: string[];
  warnings: string[];
};
```

The metric `id` must be stable for the current proposal document. It
should not depend only on display labels because labels can be edited.

## Patch Contract

The assistant should return operations, not a rewritten full document.

Example:

```ts
type ReportAssistantPatch = {
  summary: string;
  operations: ReportAssistantPatchOperation[];
  requiresUserConfirmation?: boolean;
};

type ReportAssistantPatchOperation =
  | {
      type: "adjust_metric_db";
      metricId: string;
      deltaDb: number;
      reason: string;
    }
  | {
      type: "set_metric_display_value";
      metricId: string;
      displayValue: string;
      reason: string;
    }
  | {
      type: "append_report_note";
      section: "warnings" | "assumptions" | "recommendations";
      text: string;
      reason: string;
    };
```

The application owns all patch application. The model does not directly
mutate `SimpleWorkbenchProposalDocument`.

## Execution Authority And Tool Ownership

The assistant/model must not receive tools that directly mutate the
report, export a document, save a snapshot, reset state, or write review
queue files in the first implementation.

Model-callable capabilities may include only proposal-producing or
read-only actions:

- `resolve_report_metric_reference`: maps a user phrase such as `rw`,
  `lnw`, or `dnt` to one or more current metric ids. It must return an
  ambiguity result instead of guessing between `Dn,w`, `DnT,w`, `Dn,A`,
  and `DnT,A`, or between `Rw` and `R'w`.
- `preview_report_value_patch`: proposes and validates a report value
  change without applying it.
- `find_report_value_mentions`: finds stale literal mentions of the old
  value in report text so the UI can warn the user before export.
- `research_acoustic_plausibility`: performs a source-bounded
  plausibility review only when the user explicitly asks for research.
- `prepare_review_finding`: prepares a review-finding draft for user
  confirmation, without writing it.

App/server-owned confirmed actions stay outside model authority:

- applying a validated patch to `editableDocument`;
- exporting PDF/DOCX;
- saving customized proposal snapshots;
- resetting to the packaged calculator snapshot;
- appending JSONL review findings;
- writing any project/scenario storage.

This separation is required even when the deployment uses a separate
chat orchestrator such as `system_chatd` and a model proxy such as
`system_llm`. The orchestrator may call the model, but deterministic
validation and all mutating actions remain local app/server
responsibilities.

## Patch Guardrails

The validator must reject or require confirmation for unsafe patches:

- metric id must exist in the current context;
- target metric must be editable in the report document;
- `needs_input` and `unsupported` outputs cannot become numeric values;
- lab, field, building, ISO, and ASTM metrics cannot be aliased;
- the patch cannot invent a new metric row unless a separate explicit
  product decision allows report-only notes;
- large numeric movement should require confirmation, with an initial
  threshold of more than 5 dB absolute change;
- numeric movement above 10 dB is rejected by the assistant patch path;
- changes to lower-is-better metrics such as `Ln,w`, `L'n,w`, and
  `L'nT,w` must be described correctly in the assistant explanation;
- bound values must keep their bound semantics unless the user explicitly
  edits the literal report text and confirms the caveat;
- `CI`, `C`, `Ctr`, and `CI,50-2500` signed values must preserve signed
  dB formatting rather than being treated as ordinary positive-only
  ratings;
- report curves and chart series cannot be edited through the first
  assistant patch path;
- a patch must carry a document signature or context revision and must be
  rejected when the current report state no longer matches the context
  used by the model;
- the patch must preserve all non-target fields unless a specific
  operation names them.

## Export-Only Behavior

The proposal configure page currently calls
`storeSimpleWorkbenchProposalPreviewCustomizations` before download.
That is correct for "save my customized proposal", but not for the
assistant's default export-only workflow.

Add a separate export path:

- "Apply to current report preview" changes `editableDocument` in
  React state.
- "Save customized snapshot" keeps the current manual persistence path.
- "Export PDF/DOCX" can export the current `editableDocument` without
  writing `customDocument` to localStorage.
- Proposal audit events can still be recorded as exports, but should
  not imply that the calculator result changed.

This preserves the user's requirement that assistant changes are not
permanent unless the user explicitly saves the proposal snapshot.

## Plausibility Review

The plausibility reviewer should be a separate assistant mode. It should
answer questions such as:

- "Is this `Rw 68 dB` plausible for this wall?"
- "Does `Ln,w 44 dB` look too optimistic for this floor build-up?"
- "Find references for a similar construction and compare."

Inputs:

- selected metric and value;
- layer summary;
- basis and route;
- selected candidate id/origin when available;
- stopped outputs and warnings;
- user-provided notes;
- optional web-search/source results.

Output:

```ts
type PlausibilityReview = {
  verdict: "plausible" | "suspicious" | "likely_wrong" | "insufficient_context";
  severity: "low" | "medium" | "high";
  metricId: string;
  valueReviewed: string;
  rationale: string[];
  suggestedReportPatch?: ReportAssistantPatch;
  sources: PlausibilitySourceSummary[];
};
```

The reviewer may suggest a report patch, but it must not auto-apply one.
The user should approve any value movement.

Source handling rules:

- prefer standards, manufacturer technical sheets, peer-reviewed papers,
  or reputable acoustic engineering references;
- record source URLs, titles, dates accessed, and the exact comparison
  being made;
- treat web findings as plausibility evidence, not as automatic
  calculator calibration;
- do not convert a web value into a DynEcho answer without a later
  calculator source/owner slice.

## Review Queue

Suspicious values should be logged outside the calculator answer path.
The first implementation should use an append-only JSONL queue rather
than expanding the main server project schema.

Recommended location:

`.dynecho/calculator-review-queue/report-assistant-findings.jsonl`

Recommended record:

```ts
type ReportAssistantFindingRecord = {
  id: string;
  createdAtIso: string;
  projectId?: string;
  scenarioId?: string;
  source: "report_assistant";
  metric: string;
  engineDisplayValue?: string;
  reportDisplayValue?: string;
  verdict: "suspicious" | "likely_wrong" | "insufficient_context";
  severity: "low" | "medium" | "high";
  reason: string;
  traceSummary: ReportAssistantTraceSummary;
  layersSummary: string[];
  sources: PlausibilitySourceSummary[];
  userInstruction?: string;
};
```

This gives future agentic work enough context to inspect whether the
issue belongs in a formula, candidate routing, calibration, input
surface, or documentation follow-up. It also avoids corrupting saved
project records with speculative review notes.

## Optional MCP Layer

Do not start with MCP as the core state mechanism. Start with in-app
assistant endpoints and expose the same operations through MCP later if
needed.

Possible read-only or proposal-only MCP tools after the in-app contract
is stable:

- `get_report_context`: returns the active narrow report context;
- `preview_report_patch`: validates and shows a patch result without
  applying it;
- `resolve_report_metric_reference`: resolves user-facing metric phrases
  against the active report context;
- `find_report_value_mentions`: reports stale literal mentions that may
  need a user-approved text edit;
- `research_acoustic_reference`: performs a source-bounded plausibility
  search;
- `prepare_calculator_finding`: prepares a review queue draft without
  writing it.

Mutating actions are app/server confirmed actions, not model-callable
MCP tools in the first supported design:

- `apply_report_patch`;
- `save_custom_report_snapshot`;
- `reset_report_to_calculated_snapshot`;
- `export_report_pdf`;
- `export_report_docx`;
- `log_calculator_finding`.

The MCP tools should have the same guardrails as the app endpoints.
They must not expose arbitrary file reads/writes, broad engine access,
unrestricted browser control, or a way to bypass app confirmation.

## Implementation Plan

### Phase A - Deterministic Context And Patch Core

Goal: build the assistant-safe data contract without any model call.

Tasks:

- add `report-assistant-context` helpers that extract editable metrics,
  display values, locations, direction, basis, layers, warnings, and
  trace summary from the current proposal/calculation surfaces;
- add a Zod schema or equivalent runtime validator for
  `ReportAssistantPatch`;
- add deterministic patch application helpers over
  `SimpleWorkbenchProposalDocument`;
- replace label-only update matching for assistant paths with stable
  metric ids and explicit locations;
- add report-adjustment audit records on the report document for applied
  overrides without writing engine values or scenario snapshots;
- keep existing manual editor behavior working.

Tests:

- context extraction preserves `live`, `bound`, `needs_input`, and
  `unsupported` statuses;
- `Rw` updates propagate to primary metric, metric rows, and coverage
  rows when those locations belong to the same metric id;
- `Ln,w` updates preserve lower-is-better metadata;
- unsupported `IIC` cannot be patched into a numeric value;
- movements above 5 dB return `requiresUserConfirmation`;
- movements above 10 dB are rejected;
- bound values preserve `<=` or `>=`;
- response curve/chart edits are rejected by the assistant patch path.

### Phase B - In-App Assistant Panel

Goal: let the user ask for report-only edits from the proposal configure
screen.

Tasks:

- add a compact assistant panel to the proposal configure page;
- send the current `ReportAssistantContext` and user instruction through
  the deterministic patch preview path;
- show the proposed patch as a preview before applying;
- apply approved patches to `editableDocument` only;
- add an export path that does not call
  `storeSimpleWorkbenchProposalPreviewCustomizations` unless the user
  explicitly saves the customized snapshot.

Tests:

- "set Rw to 55 dB" changes only the report document state;
- PDF export receives the patched document;
- base document and calculator result remain unchanged;
- reload without saving drops export-only assistant changes.

### Phase C - Structured Assistant Endpoint

Goal: add the model behind the deterministic patch contract.

Tasks:

- add a server endpoint that accepts only `ReportAssistantContext` plus
  a user instruction;
- request structured JSON output matching `ReportAssistantPatch`;
- validate the model output before returning it to the client;
- fail closed with a user-visible error when the patch is invalid;
- keep apply/export/save/log actions out of the model-callable tool
  surface;
- keep the prompt narrow: report manipulation, plausibility explanation,
  and review logging only.

Tests:

- invalid model output is rejected;
- attempts to edit non-existing metrics are rejected;
- attempts to publish stopped outputs are rejected;
- prompt-injection text from report notes cannot broaden tool access.

### Phase D - Plausibility Research

Goal: let the assistant research whether a value is reasonable.

Tasks:

- add a dedicated plausibility-review action;
- pass metric, value, layers, route, basis, trace summary, and warnings;
- optionally run web/source lookup when the user asks;
- return verdict, rationale, sources, and optional suggested report
  patch;
- require user approval before any suggested patch is applied.

Tests:

- review can return `insufficient_context` without changing the report;
- source-backed review includes URL/title/accessed date metadata;
- suggested patch follows the same patch validator as direct report
  edits.

### Phase E - Review Queue Logging

Goal: preserve suspicious-value findings for future calculator work.

Tasks:

- add a small server route or repository helper for append-only JSONL
  findings;
- include project/scenario ids when available;
- include trace summary, metric, engine value, report value, verdict,
  severity, reason, sources, and user instruction;
- require explicit user action such as "log this finding";
- keep queue writes separate from engine results and proposal exports.

Tests:

- finding records validate before write;
- log entries include selected candidate/basis when available;
- logging does not mutate project scenario snapshots or calculator
  outputs.

### Phase F - Optional MCP Wrapper

Goal: expose the stable assistant capabilities to external agents after
the in-app contract is proven.

Tasks:

- map MCP tools only to context lookup, metric resolution, patch preview,
  plausibility review, and review-finding draft operations;
- keep patch apply, export, save, reset, and queue write behind app or
  server confirmation;
- avoid direct browser scraping as the primary mechanism;
- ensure MCP cannot bypass patch validation or export-only boundaries.

Tests:

- MCP patch preview and app patch preview return the same validation
  result for the same context;
- MCP cannot apply a patch directly;
- app-confirmed patch application still rejects any patch that the app
  validator rejects.

## Acceptance Criteria

MVP acceptance:

- A user can ask "make `Rw` 3 dB lower in the report" and preview a
  patch before applying it.
- Applying the patch changes only the proposal document used for export.
- PDF/DOCX export can use the patched document without saving it as a
  persistent customization.
- The original calculator result, candidate trace, stopped outputs, and
  saved scenario remain unchanged.
- The assistant cannot publish numeric values for `needs_input` or
  `unsupported` outputs.
- The assistant can explain whether a selected value appears plausible
  when given the current layer summary and trace.
- The user can log a suspicious value with enough trace context for
  later agentic calculator review.

Full acceptance:

- Report manipulation, plausibility review, and review logging share the
  same metric ids and trace summary.
- External research is cited and treated as review evidence only.
- Review queue records can be consumed later without re-running the
  browser session.
- Optional MCP tools cannot perform operations unavailable through the
  in-app guardrails.

## Validation Strategy

This is not a calculator runtime slice. Do not run broad calculator gate
work because of the plan alone.

Expected validation when implemented:

- targeted unit tests for context extraction and patch validation;
- existing proposal edit tests extended for assistant patch operations;
- API route tests for assistant and review queue routes;
- focused web tests for export-only behavior;
- `git diff --check`;
- `pnpm check` if shared schemas, app routes, or broad proposal behavior
  move enough to justify full validation.

Run `pnpm calculator:gate:current` only if implementation touches engine
runtime behavior, answer boundaries, shared calculator output schemas,
or calculator/report parity contracts.

## Risks And Mitigations

Risk: assistant overwrites calculator truth.

Mitigation: patch only `SimpleWorkbenchProposalDocument`; do not call
engine functions or save scenario output snapshots from assistant edits.

Risk: assistant sees too much system context.

Mitigation: send only `ReportAssistantContext` and narrowly scoped tool
results.

Risk: report edits become permanent accidentally.

Mitigation: split "export current edited report" from "save customized
snapshot"; default assistant flow is export-only.

Risk: model aliases metrics incorrectly.

Mitigation: metric ids, basis metadata, direction metadata, and
validator rejection of ISO/ASTM/lab/field aliasing.

Risk: web research is treated as calibration.

Mitigation: research produces plausibility findings only; calculator
calibration still needs a later source/owner slice.

Risk: review findings pollute project records.

Mitigation: use append-only JSONL review queue first, with explicit user
approval.

## Open Decisions

- Initial confirmation threshold for numeric movement: suggested more
  than 5 dB absolute movement.
- Whether report-only value edits should show a visible "manual report
  override" marker in the exported PDF/DOCX.
- Exact review queue location: recommended
  `.dynecho/calculator-review-queue/report-assistant-findings.jsonl`.
- Whether the first assistant endpoint uses a real model immediately or
  ships deterministic command parsing first for smoke validation.
- Which source domains are allowed/preferred for plausibility research.
- Whether optional MCP should be implemented at all before the in-app
  assistant has real usage feedback.

## Recommended First Slice

Start with Phase A and Phase B only.

Reason:

- existing proposal editing and PDF/DOCX rendering already cover most
  of the output manipulation path;
- deterministic patch validation is the safety-critical piece;
- in-app browser state avoids MCP state ambiguity;
- the user gets the core value quickly: "change this report value for
  this export, without changing calculator truth."

After that is stable, add plausibility research and review queue logging.
Only then decide whether MCP adds enough value to justify the extra
state-bridge complexity.
