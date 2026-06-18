# Report Assistant High-Accuracy Copilot Implementation Plan - 2026-06-18

## Purpose

This is the implementation-ready plan for turning the report assistant into a
high-accuracy DynEcho calculator copilot.

The goal is not autonomous writing or calculator retuning. The goal is an
assistant that can use the existing Workbench, project, preset, report, research,
and calculator-preview surfaces effectively, while making every acoustic answer
traceable to application-owned truth.

The target behavior:

1. understand user intent;
2. use available Workbench/project/preset state before asking duplicate
   questions;
3. build typed drafts for layer stacks;
4. ask for missing physical inputs instead of guessing;
5. run the existing calculator preview route for ready drafts;
6. render authority, basis, route status, warnings, tasks, and stale state;
7. require explicit confirmation before any report/project/preset/finding or
   future Workbench-state mutation.

End-state product contract:

- The user can describe wall, floor, ceiling, opening, or alternative layer
  combinations in Turkish, English, or mixed wording.
- The assistant first resolves intent and current Workbench/project/preset
  context, then creates a typed draft before any calculator call.
- The assistant asks for missing physical inputs instead of guessing material
  roles, thicknesses, topology, stiffness, load basis, field/lab context, or
  target metric basis.
- Complete owned drafts run through the existing calculator-preview surfaces.
  Numeric acoustic values never originate from model prose.
- Every user-visible answer is backed by a typed result envelope with authority,
  route status, basis where numeric, source trace, warnings, tasks, preview or
  mutation posture, and stale policy.
- Research/provider output can advise plausibility or alternatives, but cannot
  promote itself to calculator truth, source-row truth, or apply permission.
- Workbench/project/report/preset/finding mutations are proposed first and
  executed only after explicit user confirmation with stale guards.
- The final system is measurable: golden evals can verify capability selection,
  draft readiness, calculator use, refusal-to-guess behavior, injection
  resistance, source tracing, and confirmation boundaries without reading
  natural-language prose.

## Non-Goals

Do not do these in this plan:

- change engine formulas, metric aliases, source rows, or route selection truth;
- import source rows from assistant research;
- let the model invent numeric acoustic answers;
- add direct autonomous write tools;
- broaden floor/impact parsing by guessing missing physical inputs;
- replace the existing Workbench/project/preset routes;
- persist full external-provider transcripts or full report bodies in telemetry.

## Current Baseline

Landed locally:

- calculator preview from a valid Workbench V2 snapshot;
- bounded described wall preview with explicit `mm` thicknesses;
- query route structured `calculatorPreview` payload;
- report editor calculator preview block;
- report editor request lifecycle guard for query/action/patch;
- first-pass assistant capability registry;
- runtime status derived from the capability registry;
- shared result envelope contract and validator;
- query route result-envelope adapter for calculator preview and deterministic
  query answers;
- route response envelope adapters for action proposals, project reads, patch
  proposals, research reviews, findings, direct calculator preview, runtime
  status, and failure/error states;
- direct calculator-preview and runtime-status success envelopes;
- first generic registry-driven report editor result-card slice;
- extracted result-card view model with renderer/tone/meta coverage for every
  registered assistant capability;
- extracted result-card React component with server-render smoke coverage that
  prevents `needs_input` calculator-preview cards from showing stale numeric
  preview values;
- deterministic planner decision contract for registry-backed route selection,
  calculator missing-input preflight, prompt-injection rejection, unsupported
  side-effect rejection, and action-proposal target handoff into the action
  route;
- deterministic planner eval pack for calculator-ready, calculator-needs-input,
  patch-preview, action-confirmation, research, project-read, prompt-injection,
  host-allowlist, and unsupported side-effect route families;
- client-safe assistant tool-definition split so the browser result-card path
  can validate capability metadata without importing server-only finding queue
  helpers;
- browser smoke for the proposal assistant thread, including local preflight
  blocks, calculator `needs_input`, and calculator-backed numeric preview cards;
- broad assistant checkpoint suite: 32 test files / 231 tests passed.

Still missing:

- renderer-specific body polish beyond the calculator card;
- planner parity/eval expansion from production-like traces beyond the first
  deterministic local eval pack;
- typed layer-stack draft and clarification loop;
- multi-candidate comparison;
- floor/ceiling/impact input capture;
- confirmed apply-to-Workbench proposal;
- golden assistant evals and redacted observability.

Current selected next action:

```text
report_assistant_gate_4_trace_parity_eval_refresh
```

Continue remaining Gate 4 hardening with trace/parity eval coverage for planner
route selection and regression checks for production-shaped prompts. Browser
smoke is now green for the current assistant thread/result-card path. Do not
begin Gate 5 layer-stack draft work until this Gate 4 refresh is green.

## Work Rules

Every gate must keep these invariants:

- engine package files are not touched unless the user explicitly changes scope;
- numeric acoustic values must come from calculator preview, saved project state,
  or explicitly labeled advisory research;
- `needs_input` and `unsupported` are valid high-accuracy answers;
- preview-only cards cannot show apply controls;
- mutating actions require explicit confirmation and stale guards;
- old response shapes should remain backward-compatible until migrated tests
  prove all consumers use the new contract.

If a gate cannot preserve these invariants, stop and update this plan before
continuing.

Gate transition quality bar:

- Do not start a later gate until the current gate has a written acceptance
  list, targeted tests, and a doc update.
- Do not accept a model-produced planner decision, draft, patch, finding, or
  research card unless it passes schema parsing and local validation.
- Do not rely on prompt-only or agent-level guardrails for side effects. The
  route/tool that can create the side effect must own the validation and
  confirmation boundary.
- Do not publish a numeric value unless the result envelope has numeric
  authority, basis rows, route status, and source trace.
- Do not publish a natural-language-only assistant result after Gate 3; every
  result must have a renderer-selected card or a deliberate legacy fallback
  with a tracked removal note.
- Do not move from Gate 4 planner work into Gate 5 draft execution until planner
  evals prove correct capability selection and rejection of invented capability
  names.
- Do not move from Gate 5 draft work into Gate 6 clarification until incomplete
  drafts are blocked from calculator execution.
- Do not move from Gate 6 clarification into Gate 7/8 generation until stale
  draft/context behavior is tested.
- Do not move from Gate 7/8 into Gate 9 apply until calculator-backed preview
  and exact stack diff are present in the proposal envelope.
- If `tsc` fails, separate known non-current-slice debt from any assistant file
  errors. Assistant file errors block the gate.

## Research-Backed Reliability Rules - 2026-06-18

This plan now uses a research-before-implementation cadence for assistant
quality work. Before each remaining gate, re-check the relevant current docs if
the gate changes model prompting, tool visibility, structured output shape,
grounding/source tracing, evals, observability, or confirmation behavior. Record
only the delta that changes the implementation plan; do not let open-ended
research displace the selected assistant slice.

Current source scan:

- OpenAI function-calling guidance says tool/function names, parameters, and
  output meanings should be clear; use the system prompt to say when and when
  not to use a tool; use enums/object structure to make invalid states
  unrepresentable; offload known arguments to code; combine always-sequential
  tools; and keep the initially available function set small for higher
  accuracy.
  Source:
  https://developers.openai.com/api/docs/guides/function-calling#best-practices-for-defining-functions
- OpenAI structured-output guidance says Structured Outputs make model output
  adhere to a supplied JSON Schema, distinguish schema-constrained responses
  from tool calls, prefer schema output over plain JSON mode when supported, and
  still require handling incompatible user input and downstream mistakes.
  Source: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI LLM-accuracy guidance emphasizes clear instructions, splitting complex
  tasks into smaller subtasks, systematic testing, reference text, external
  tools, and evaluating long-context behavior instead of assuming more context
  is always more accurate.
  Source:
  https://developers.openai.com/api/docs/guides/optimizing-llm-accuracy#optimization
- Google Cloud grounding guidance defines grounding as connecting model output
  to verifiable data sources; it reduces hallucinations, anchors responses to
  data sources, and improves auditability through source links.
  Source:
  https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/grounding/overview
- NIST AI RMF Generative AI Profile treats confabulation as a managed risk and
  calls for empirically validated capability claims, systematic testing, review
  of guardrails, documentation of retrieval/fine-tuning adaptations, source and
  provenance documentation, monitoring, feedback integration, content filters,
  and human review where models perform poorly.
  Source: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
- OpenAI Agents SDK tool guidance keeps tool semantics stable but moves the
  wiring into agent definitions and workflow design: attach tools directly only
  when the specialist should call them, expose a specialist as a tool when a
  manager should stay in control, and use guardrail/human-review and
  observability guidance when approvals or MCP are involved.
  Source:
  https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk
- OpenAI orchestration guidance makes final-answer ownership the first design
  choice. Handoffs are for delegated ownership; agents-as-tools are for
  manager-controlled workflows; specialists should be added only when the
  contract materially changes. DynEcho should keep host/application ownership of
  calculator/project truth and use bounded planner decisions instead of handing
  final acoustic answers to a specialist model.
  Source:
  https://developers.openai.com/api/docs/guides/agents/orchestration
- OpenAI agent safety guidance says workflows should prevent untrusted data from
  directly driving agent behavior; external text should be reduced to specific
  structured fields such as enums or validated JSON, and guardrails,
  confirmations, and variables should validate inputs. Structured outputs and
  isolation reduce but do not remove prompt-injection risk.
  Source:
  https://developers.openai.com/api/docs/guides/agent-builder-safety#combine-techniques
- OpenAI guardrail and human-review guidance separates automatic validation from
  approval decisions, and says side-effecting or sensitive tool calls should
  pause for human-in-the-loop approval. Guardrails also have workflow boundaries:
  checks needed around custom tools must live next to those tools.
  Source:
  https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
- OpenAI guardrail workflow-boundary guidance also means DynEcho cannot rely on
  a single top-level "be careful" instruction. Planner validation, draft
  validation, provider parse validation, result-envelope validation, stale
  guards, and confirmation checks must live at their route/tool boundary.
- OpenAI MCP safety guidance says MCP tool calls default to requiring approvals,
  data sent to third-party MCP servers should be logged/reviewed, malicious MCP
  servers may include hidden prompt-injection instructions, and trusted
  connections still need review because server behavior can change.
  Source:
  https://developers.openai.com/api/docs/guides/tools-connectors-mcp#log-and-review-data-being-shared-with-third-party-mcp-servers
- OpenAI agentic-eval examples use specialized agents, structured function
  tools, guardrails/review thresholds, structured outputs, and traces containing
  model calls, tool calls, handoffs, guardrails, and custom spans for debugging
  and macro-level analysis.
  Source:
  https://developers.openai.com/cookbook/examples/partners/macro_evals_for_agentic_systems/macro_evals_for_agentic_systems#2-the-simulation-automotive-orders-in-a-changing-world
- OpenAI trace-grading guidance evaluates the end-to-end trace of decisions,
  tool calls, and reasoning steps with structured labels or scores, which helps
  identify why an agent succeeds or fails instead of only grading final text.
  Source: https://developers.openai.com/api/docs/guides/trace-grading
- OpenAI evals and grader guidance still supports task-specific datasets,
  reference answers, tool-call checks, and graded criteria, but it also notes
  the Evals/graders platform transition. DynEcho should therefore keep a
  repo-local golden suite and treat hosted eval APIs as optional export targets,
  not as the source of truth.
  Sources:
  https://developers.openai.com/api/docs/guides/evals and
  https://developers.openai.com/api/docs/guides/graders
- OWASP LLM01:2025 Prompt Injection guidance says prompt injection includes
  direct and indirect attacks from external sources, RAG/fine-tuning do not
  fully mitigate it, and mitigations include constrained model behavior,
  validated output formats, least privilege, human approval for high-risk
  actions, segregation of external content, and adversarial testing.
  Source: https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- OpenAI Agents SDK result guidance says a run result is more than final text:
  it is also a handoff boundary, next-turn continuation surface, resumable state
  for interrupted review flows, and a place to inspect richer tool, handoff,
  guardrail, and diagnostic records. Incomplete results are first-class result
  states, not failed final answers to paper over.
  Source: https://developers.openai.com/api/docs/guides/agents/results
- OpenAI agent-eval guidance recommends starting with traces while debugging
  workflow behavior, then moving to repeatable datasets once "good" is known.
  Trace questions include whether the agent picked the right tool, whether a
  handoff should have happened, and whether routing or guardrails regressed.
  Source: https://developers.openai.com/api/docs/guides/agent-evals
- OpenAI SchemaFlow guidance highlights typed stage outputs, deterministic
  checks between stages, traceability, eval-ready artifacts, and no live side
  effects as key properties for agentic analysis workflows. DynEcho should apply
  the same posture to research review routes: typed review payloads first,
  deterministic envelope adapter second, no calculator/runtime mutation.
  Source:
  https://developers.openai.com/cookbook/examples/partners/schemaflow_design_guide/schemaflow_cookbook#key-benefits
- OpenAI agent-definition guidance places tools, structured outputs, guardrails,
  approvals, and trace-visible identity on the agent/workflow boundary. DynEcho
  should therefore treat route-level failures as typed workflow outputs, not as
  plain text that the model or UI can reinterpret.
  Source:
  https://developers.openai.com/api/docs/guides/agents/define-agents#what-belongs-on-an-agent

DynEcho implementation consequences:

- Capability/tool exposure must stay registry-bounded and small per turn. Gate 4
  must select a narrow target capability set instead of exposing every assistant
  route/tool to the model.
- Route adapters must attach `sourceTrace`, authority, basis, stale policy,
  warnings, and tasks because grounding without visible provenance is not enough
  for a high-accuracy calculator assistant.
- Structured output should be used at every model-provider boundary that
  produces planner decisions, layer-stack drafts, research cards, or patch/action
  summaries. Local route validation remains mandatory because schema adherence
  does not guarantee acoustic correctness.
- External/provider/research/MCP text is untrusted data. It may fill validated
  fields inside a result, but it must not create capability names, route names,
  apply-route paths, calculator metric aliases, or confirmation policy.
- Known Workbench/project/preset/report ids and signatures should be supplied by
  code, not requested from or regenerated by the model.
- Confirmation is a runtime state transition, not a sentence in a model reply.
  Any action that can eventually mutate report/project/preset/finding or
  Workbench state must first produce a non-mutating proposal envelope with
  `requiresConfirmation: true`, target ids, and stale guards.
- `needs_input` and `unsupported` are first-class outcomes and must be included
  in evals. A refusal to guess is a correct answer when the calculator route is
  not physically owned.
- Gate 10 must measure hallucination risk as concrete failure modes:
  fabricated calculator values, invented tool names, wrong capability selection,
  unsupported-to-numeric substitution, stale-source reuse, missing basis, and
  ungrounded source claims.
- Observability must capture the typed decision/result boundary, not only raw
  chat text: selected capability, route, source trace, validation outcome,
  tool/read usage, confirmation or rejection, stale status, and redaction state.
- Gate 10 evals must be trace-first. Each golden case should assert expected
  capability, authority, route status, source trace, confirmation posture, and
  absence of invented tool/action names before any natural-language answer is
  graded.
- Failure results must travel through the same typed envelope path as successful
  results. Missing inputs should produce `needs_input`, unsupported capabilities
  should produce `unsupported`, and execution/storage/provider failures should
  produce `error` with tasks; none of those states may be rendered or summarized
  as if they were successful calculator/project answers.
- Failure route statuses must remain distinguishable inside `error` authority:
  `auth_failed`, `provider_failed`, `validation_failed`, and generic `error`
  are different debugging and UX states. Each one needs task context so the next
  planner/UI layer can show the boundary instead of hallucinating a normal
  result.
- Provider/research review results must stay advisory. Even when a provider
  returns citations, ranges, or qualitative plausibility judgments, the envelope
  authority remains `provider_review`; only calculator/project routes may
  publish calculator-backed or saved-project-state authority.
- Patch and finding routes must keep approval as host/runtime state, not model
  prose. A patch route can return a typed proposal envelope, and a finding route
  can return a confirmed mutation envelope only after `confirmed: true`; neither
  path may let model/provider text decide whether an edit or queue write already
  happened.

## Per-Gate Readiness Checklist

Before starting any gate, answer these in the gate PR/commit notes or local
handoff:

- What user-facing failure does this gate remove?
- Which capability registry entries does it consume or add?
- Which external reliability/best-practice rule from the latest source scan does
  this gate implement or protect?
- Which route responses or UI cards can change?
- Which existing response shapes must remain backward-compatible?
- Which numeric answers can appear, and what is their authority?
- What are the valid `needs_input` and `unsupported` outcomes?
- What stale/context signatures protect the result?
- Which tests fail before the implementation?
- Which tests must pass before closing the gate?
- What is explicitly out of scope?

Do not start a gate if the answer to "Which numeric answers can appear, and
what is their authority?" is unclear.

## Gate 0 - Checkpoint Stabilization

Purpose:

- Start implementation from a known green assistant checkpoint.

Implementation files:

- none unless tests reveal stale harness behavior.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-action-proposal.test.ts \
  features/workbench/report-assistant-assembly-alternatives.test.ts \
  features/workbench/report-assistant-capabilities.test.ts \
  features/workbench/report-assistant-context.test.ts \
  features/workbench/report-assistant-conversation-storage.test.ts \
  features/workbench/report-assistant-editor-workflow.test.ts \
  features/workbench/report-assistant-finding.test.ts \
  features/workbench/report-assistant-instruction.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench/report-assistant-model.test.ts \
  features/workbench/report-assistant-patch.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-project-read-route.test.ts \
  features/workbench/report-assistant-project-tools.test.ts \
  features/workbench/report-assistant-project-workspace.test.ts \
  features/workbench/report-assistant-query-route.test.ts \
  features/workbench/report-assistant-request-client.test.ts \
  features/workbench/report-assistant-request-lifecycle.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts \
  features/workbench/report-assistant-tools.test.ts \
  features/workbench/report-assistant-trace-explanation.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  --maxWorkers=1
```

Exit criteria:

- assistant suite passes;
- any full `tsc` failures are confirmed unrelated existing fixture/type debt;
- no engine files are touched.

## Gate 1 - Result Envelope Contract

Label:

```text
report_assistant_result_card_contract_v1
```

Purpose:

- Define the shared result envelope that all assistant result cards use.

Primary files:

- new `apps/web/features/workbench/report-assistant-result-contract.ts`;
- new `apps/web/features/workbench/report-assistant-result-contract.test.ts`;
- `apps/web/features/workbench/report-assistant-capabilities.ts`;
- `apps/web/features/workbench/report-assistant-runtime-status.ts`;
- `apps/web/features/workbench/report-assistant-runtime-status.test.ts`.

Contract fields:

- `capabilityName`;
- `resultKind`;
- `rendererKind`;
- `authority`;
- `mutates`;
- `previewOnly`;
- `requiresConfirmation`;
- `stalePolicy`;
- `basis`;
- `routeStatus`;
- `tasks`;
- `warnings`;
- `evidence`;
- `sourceTrace`;
- `confidenceReason`.

Authority values:

- `calculator_backed`;
- `saved_project_state`;
- `deterministic_read`;
- `provider_review`;
- `draft_only`;
- `preview_only`;
- `user_confirmed`;
- `needs_input`;
- `unsupported`;
- `error`.

Acceptance:

- every result envelope references a known registry capability;
- numeric acoustic rows require authority plus metric id/basis/route status;
- `needs_input`, `unsupported`, stale, validation failure, provider failure, and
  auth failure are distinct result states;
- result contract tests reject a numeric answer without authority;
- compatibility with existing route payloads is preserved.

Stop condition:

- If adding the envelope requires changing engine answers or route basis, stop.

Gate 1 runbook:

1. Add failing tests first in `report-assistant-result-contract.test.ts`:
   - rejects numeric output without authority;
   - rejects calculator authority without metric id/basis/route status;
   - accepts `needs_input` and `unsupported` without numeric value;
   - accepts proposal cards only when confirmation policy matches capability;
   - rejects envelopes whose `capabilityName` is not in the registry.
2. Add type definitions only; do not touch routes yet.
3. Add small factory/validator helpers:
   - `createReportAssistantResultEnvelope`;
   - `validateReportAssistantResultEnvelope`;
   - `assertKnownReportAssistantCapability`.
4. Wire runtime status only if needed to expose supported result kinds; keep
   existing status fields stable.
5. Run:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-capabilities.test.ts \
  features/workbench/report-assistant-result-contract.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts \
  --maxWorkers=1
```

Gate 1 is complete only when the contract can validate envelope shape without
requiring any route/UI migration.

Local status - 2026-06-18:

- Gate 1 core contract landed locally in
  `apps/web/features/workbench/report-assistant-result-contract.ts`.
- Contract coverage landed locally in
  `apps/web/features/workbench/report-assistant-result-contract.test.ts`.
- The contract derives `resultKind`, `rendererKind`, `mutates`,
  `previewOnly`, `requiresConfirmation`, and `stalePolicy` from
  `REPORT_ASSISTANT_CAPABILITY_REGISTRY`.
- Validator now rejects unknown capabilities, calculator-backed envelopes
  without metric basis rows, metric basis rows with draft-only authority, and
  proposal envelopes whose confirmation policy diverges from the registry.
- `needs_input` and `unsupported` envelopes are valid without metric basis rows
  when they include task context.
- Route and UI migration remains Gate 2/Gate 3 scope; existing route payloads
  are unchanged.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run ... report-assistant-result-contract.test.ts ... --maxWorkers=1`
  with 27 assistant test files / 200 tests passed at that Gate 1 checkpoint,
  plus ESLint on the new contract files. The current Gate 2 checkpoint suite is
  tracked below.

## Gate 2 - Route Envelope Adapters

Purpose:

- Add adapter helpers that wrap existing route results into result envelopes
  without breaking current response payloads.

Primary files:

- `apps/web/features/workbench/report-assistant-result-contract.ts`;
- `apps/web/features/workbench/report-assistant-query.ts`;
- `apps/web/features/workbench/report-assistant-action-proposal.ts`;
- `apps/web/features/workbench/report-assistant-model.ts`;
- `apps/web/features/workbench/report-assistant-plausibility-research.ts`;
- `apps/web/features/workbench/report-assistant-project-tools.ts`;
- route tests under `apps/web/features/workbench/report-assistant-*.test.ts`.

Migration rule:

- Add a new optional field such as `resultCards` or `assistantResults`.
- Keep existing fields like `answer`, `calculatorPreview`, `proposal`,
  `review`, and `warnings` until UI consumers are migrated.

Research-backed constraints:

- Adapters must be deterministic host code where possible; do not ask a model to
  reconstruct fields the route already knows.
- Each adapter must identify the narrow registry capability it represents.
- Existing grounded values and ids must be copied from typed route results, not
  regenerated from free text.
- Provider/research text and saved report prose are untrusted payload data for
  adapter purposes. They can be displayed as evidence only after validation; they
  cannot decide `capabilityName`, `authority`, `rendererKind`, `mutates`,
  `requiresConfirmation`, or apply-route paths.
- For calculator preview, source tracing must point to the calculator preview
  capability and preserve `needs_input`/`unsupported` task boundaries.
- For advisory research, source tracing must stay `provider_review`; it must not
  upgrade research text into calculator authority.
- For advisory research routes, envelope evidence may summarize citation counts,
  reviewed metric ids, and provider status, but must not copy long provider text
  into trace fields or invent exact source provenance.
- For action and patch proposals, the envelope must prove the proposal is
  preview-only, non-mutating at route execution time, confirmation-required for
  later apply, and stale-guarded by the relevant context/document/target
  signature.
- For project/preset reads, the envelope must show read-only authority and the
  exact local read tool that supplied the payload. Saved project names,
  summaries, and report text are evidence, not instructions.
- Failure adapters must be additive just like success adapters. They preserve
  the legacy `ok: false`, `code`, and `errors` payload while adding an envelope
  whose `authority`, `routeStatus`, and `tasks` explain the boundary.

Acceptance:

- query calculator preview returns a calculator-backed result envelope;
- plain query answer returns deterministic-read or draft-only authority;
- patch/action routes return proposal cards with `requiresConfirmation: true`;
- research routes return provider-review or deterministic-review authority;
- findings route remains confirmed/mutating and never model-exposed;
- route tests prove preview-only cards have no apply affordance.

Stop condition:

- If route responses become incompatible with existing report editor parsing,
  roll back the adapter and keep the old payload while adding tests first.

Gate 2 runbook:

1. Start with query calculator preview because it already has the richest typed
   payload.
2. Add `assistantResults` as an additive field; do not remove
   `calculatorPreview`.
3. Add one adapter per result family:
   - `calculatorPreviewToAssistantResult`;
   - `queryAnswerToAssistantResult`;
   - `actionProposalToAssistantResult`;
   - `patchProposalToAssistantResult`;
   - `researchReviewToAssistantResult`;
   - `projectReadToAssistantResult`;
   - `findingToAssistantResult`.
4. Keep each adapter deterministic and local. Provider text is data inside a
   result, not a result-shape authority.
5. Add route assertions in the existing route tests that `assistantResults`
   exists and references the expected capability.
6. Run the route-family tests after each adapter, not only at the end.

Gate 2 is complete only when old response fields and new envelopes coexist.

Local status - 2026-06-18:

- Query route adapter landed locally as the first Gate 2 slice.
- `POST /api/report-assistant/query` now returns additive `assistantResults`
  while preserving existing `answer`, `calculatorPreview`, `evidence`,
  `usedReads`, and `warnings` fields.
- Described-layer calculator preview results now produce a
  `preview_described_layer_configuration` envelope with
  `authority: calculator_backed`, `rendererKind: calculator_preview_card`,
  metric basis rows copied from calculator preview output rows, and
  `sourceTrace` pointing to the calculator preview capability.
- Plain deterministic query answers now produce a
  `report_assistant_query_route` envelope with `authority: deterministic_read`
  when typed read/evidence sources are present.
- Action proposal route adapter landed locally as the second Gate 2 slice.
- `POST /api/report-assistant/action-proposal` now returns additive
  `assistantResults` while preserving existing `proposal`, `mutates`, and
  `warnings` fields.
- Action proposal envelopes use the action capability name, `authority:
  draft_only`, `rendererKind: action_proposal_card`, `requiresConfirmation:
  true`, `stalePolicy: target_stale_guard`, and deterministic source tracing so
  the UI can distinguish a preview proposal from a confirmed mutation.
- Project-read route adapter landed locally as the third Gate 2 slice.
- `POST /api/report-assistant/project-read` now returns additive
  `assistantResults` while preserving existing `action`, `result`, `mutates`,
  and `ok` fields for current consumers.
- Project-read envelopes use the exact read-tool capability name, `authority:
  saved_project_state`, `rendererKind: project_read_card`, `sourceTrace.kind:
  project_read`, and compact id/count evidence. Full saved report documents and
  assembly snapshots remain route payload data, not envelope instruction text.
- Project-read failure envelopes landed locally as the fourth Gate 2 slice.
- `POST /api/report-assistant/project-read` now returns additive
  `assistantResults` for route-level unsupported/invalid requests and read-tool
  failures while preserving existing `ok: false`, `code`, `errors`, `action`,
  and HTTP status behavior.
- Unsupported project-read actions now produce `authority: unsupported` and
  missing required ids now produce `authority: needs_input`; both include task
  rows so the UI/planner can avoid summarizing them as successful project reads.
- Plausibility research-review envelopes landed locally as the fifth Gate 2
  slice.
- New deterministic adapter:
  `apps/web/features/workbench/report-assistant-plausibility-result.ts`.
- `POST /api/report-assistant/plausibility` now returns additive
  `assistantResults` on successful reviews while preserving existing
  `review`, `source`, `warnings`, and `patchValidation` fields.
- Context-only plausibility reviews use `authority: deterministic_read`;
  provider-backed reviews use `authority: provider_review`. Both stay
  preview-only research cards and carry compact metric/verdict/source-count
  evidence without copying long provider text into envelope evidence or trace.
- Patch proposal envelopes landed locally as the sixth Gate 2 slice.
- New deterministic adapter:
  `apps/web/features/workbench/report-assistant-patch-result.ts`.
- `POST /api/report-assistant/patch` now returns additive `assistantResults` for
  successful proposals, rejected validator results, and patch-generation
  failures while preserving existing `patch`, `source`, `validation`,
  `warnings`, `errors`, and HTTP status behavior.
- Successful patch proposals use `authority: draft_only`, `rendererKind:
  patch_proposal_card`, `requiresConfirmation: true`, compact operation/metric
  evidence, and deterministic/model-provider source tracing. Rejected proposals
  use `routeStatus: validation_failed` with task rows so the UI/planner cannot
  summarize them as successful report edits.
- Finding route envelopes landed locally as the seventh Gate 2 slice.
- New deterministic adapter:
  `apps/web/features/workbench/report-assistant-finding-result.ts`.
- `POST /api/report-assistant/findings` now returns additive `assistantResults`
  for missing confirmation/input, preparation/write failures, and confirmed
  queue writes while preserving existing route payloads.
- Confirmed finding writes use `authority: user_confirmed`,
  `rendererKind: finding_log_card`, `mutates: true`, and
  `sourceTrace.kind: user_confirmation`; missing confirmation uses
  `authority: needs_input` with a task row.
- Assembly-alternative research envelopes landed locally as the eighth Gate 2
  slice.
- New deterministic adapter:
  `apps/web/features/workbench/report-assistant-assembly-alternatives-result.ts`.
- `POST /api/report-assistant/assembly-alternatives` now returns additive
  `assistantResults` on successful reviews while preserving existing `review`,
  `source`, and `warnings` fields. Context-only reviews use
  `authority: deterministic_read`; provider-backed reviews use `authority:
  provider_review`, and envelope evidence is limited to compact source,
  comparability, direction, layer/alternative count, and citation count fields.
- Cross-route failure envelope support landed locally as the ninth Gate 2 slice.
- New deterministic adapter:
  `apps/web/features/workbench/report-assistant-route-failure-result.ts`.
- The result contract now permits `error` authority with distinct
  `auth_failed`, `provider_failed`, `validation_failed`, and generic `error`
  route statuses, and requires task rows for incomplete failure states.
- Auth/invalid/provider or execution failures now return additive
  `assistantResults` across the main assistant routes touched by Gate 2:
  query, action proposal, project read, plausibility, assembly alternatives,
  patch, findings, direct calculator preview, and runtime status.
- Legacy `ok: false`, `error`, `code`, `errors`, `warnings`, `mutates`, and HTTP
  status behavior is preserved; the new envelope is additional planner/UI
  context.
- Direct utility success envelopes landed locally as the tenth Gate 2 slice.
- New deterministic adapters:
  `apps/web/features/workbench/report-assistant-calculator-preview-result.ts`
  and
  `apps/web/features/workbench/report-assistant-runtime-status-result.ts`.
- Successful direct `/api/report-assistant/calculator-preview` responses now
  return additive calculator-preview `assistantResults` while preserving existing
  `ok`, `name`, `preview`, `mutates`, and `previewOnly` fields. Snapshot and
  described-stack previews both publish calculator trace, route status, and live
  metric basis rows when the preview route is `ready`.
- Successful direct `/api/report-assistant/status` responses now return additive
  runtime-status `assistantResults` while preserving existing `ok` and `status`
  fields. The envelope stays `authority: deterministic_read` and only records
  sanitized capability/provider counts and readiness warnings, not secrets.
- Gate 2 handoff guard is satisfied for direct utility success posture. Gate 3
  and the later planner/layer-composer slices must carry trace/eval assertions
  for capability, route status, source trace, and tool-selection correctness as
  acceptance criteria.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-result-contract.test.ts features/workbench/report-assistant-patch-route.test.ts features/workbench/report-assistant-plausibility.test.ts features/workbench/report-assistant-assembly-alternatives.test.ts features/workbench/report-assistant-finding.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts --maxWorkers=1`
  with 10 files / 68 tests; ESLint on the touched route/adapter/test files; and
  the broader assistant suite with 28 files / 203 tests.
- Existing assistant patch-test citation fixture type debt was cleared by adding
  the required `tone` field to source citations; this was covered by
  `report-assistant-patch.test.ts` and targeted ESLint.
- `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`
  still fails on existing non-current-slice calculator/workbench fixture
  type-debt files (`exactImpactSource`, `PresetId`, and `OutputCardModel`
  posture fields), but no current report-assistant file remains in that failure
  list.

## Remaining Work Analysis And Execution Plan - 2026-06-18

Current status:

- Gates 0-2 are locally landed for the assistant slice.
- Gate 3 first UI slice is locally landed: editor messages can now carry
  validated `assistantResults` envelopes and render them through a compact
  result-card path while preserving the legacy calculator preview fallback.
- The assistant has typed result envelopes for successful and failed route
  outcomes, including direct calculator preview and runtime status.
- The next missing capability is not more calculator math; it is making those
  typed results visible, selectable, draftable, and measurable without letting
  the model invent calculator truth.

Research-backed sequencing:

1. Render typed results before adding planner autonomy. If the UI cannot show
   `needs_input`, `unsupported`, `provider_review`, `error`, and
   `calculator_backed` distinctly, planner mistakes will be hidden as prose.
2. Add a host-owned planner before layer composition. OpenAI orchestration
   guidance says manager-style workflows should keep final answer ownership with
   the manager and call specialists/tools as bounded capabilities. DynEcho's
   manager is application code, not an unbounded model prompt.
3. Add typed layer drafts before calculator execution from natural language.
   Structured Outputs help with schema adherence, but local validators still
   decide readiness and calculator route ownership.
4. Add clarification before multi-candidate generation. Incomplete physical
   inputs must shrink into precise questions, not spread into multiple guessed
   alternatives.
5. Add eval and trace assertions continuously, then finish Gate 10 after the
   user-facing flow exists. Trace-first evals should measure tool selection,
   route status, source trace, basis integrity, and refusal-to-guess behavior.

Remaining gate dependency graph:

```text
Gate 3 renderer
  -> Gate 4 planner
    -> Gate 5 layer-stack draft
      -> Gate 6 clarification loop
        -> Gate 7 wall candidate comparison
        -> Gate 8 floor/ceiling/impact input capture
          -> Gate 9 confirmed apply-to-Workbench proposal
            -> Gate 10 final eval/observability hardening
```

End-to-end acceptance matrix:

| User request shape | Required path | Correct final posture |
| --- | --- | --- |
| Complete owned wall stack with target outputs | planner -> layer draft -> calculator preview -> result card | `calculator_backed` ready card with basis rows and calculator source trace |
| Complete wall stack plus "save/apply/use this" wording | planner -> layer draft -> calculator preview -> action proposal | preview card plus confirmation-required proposal; no mutation before approval |
| Missing thickness/material/role/output | planner -> layer draft validator | `needs_input` card with minimal questions and no numeric rows |
| Unsupported metric or physically unowned route | planner -> draft/route validator | `unsupported` card with boundary reason and no substitute value |
| Research or plausibility request | planner -> research/provider route -> review card | `provider_review` or deterministic advisory card, never calculator authority |
| Compare wall alternatives | planner -> candidate drafts -> calculator preview per ready candidate | comparison card; failed candidates remain task rows |
| Floor/impact request with missing stiffness/load/field basis | planner -> floor/impact draft validator | `needs_input` card naming exact physical inputs |
| Prompt-injected report/provider text asks to ignore policy | planner/tool boundary validator | rejected or quoted as evidence only; no capability/tool unlock |
| Stale draft or stale Workbench state | stale guard before preview/apply | stale/error card; no calculator/apply execution until refreshed |

Minimum eval bar before a gate can close:

- At least one positive case for the new capability.
- At least one negative case where the assistant must return `needs_input`,
  `unsupported`, `error`, or stale rather than prose.
- At least one injection or invented-capability case for any gate that changes
  planner/tool visibility, provider parsing, or confirmation behavior.
- At least one trace assertion for selected capability, route status, authority,
  source trace, and basis/absence of basis.
- For any user-visible UI gate, at least one assertion that the renderer did not
  need route-specific legacy payload fields to choose the card type.
- For any calculator-adjacent gate, at least one assertion that no numeric row
  appears when readiness fails.

Gate 3 implementation-ready checklist:

- Introduce `assistantResults` on `AssistantMessage` without removing
  `calculatorPreview`.
- Add a registry-driven `AssistantResultCard` dispatcher keyed by envelope
  `rendererKind`.
- First card: calculator preview, reusing `AssistantCalculatorPreviewBlock` as
  the inner body.
- Second pass cards: query answer, project read, research review, patch/action
  proposal, finding log, runtime status, and error/needs-input/unsupported.
- Tests must prove the editor can render each authority without inspecting
  route-specific legacy payload fields.
- Stop if visual parity for existing calculator preview is lost; keep the old
  block until the new card path is green.

Gate 4 implementation-ready checklist:

- Add `report-assistant-planner.ts` with a deterministic decision type:
  `targetCapability`, `mode`, `confidence`, `requiresClarification`,
  `clarifyingQuestions`, `allowedTools`, `rejectionReason`, and `usedSignals`.
- Host code supplies current project/report ids, snapshot signatures, selected
  outputs, and allowed capability names.
- Planner may select a capability; it may not invent capability names, route
  paths, metric aliases, or approval policy.
- Prompt-injection text from user/report/provider content is retained only as
  quoted evidence and cannot unlock tools.
- Tests must cover Turkish, English, mixed wording, mutation intent, calculator
  intent, research intent, finding intent, and unsupported capability wording.

Gate 5 implementation-ready checklist:

- Add `report-assistant-layer-stack-draft.ts` with validator-first types before
  changing parser behavior.
- Draft state must preserve original phrases beside normalized material ids.
- Missing material, thickness, role/topology, target output, or route-required
  physical input becomes a typed task/question.
- Ready wall drafts may build a temporary Workbench V2 snapshot and call the
  existing calculator preview route.
- Incomplete drafts must not publish numeric rows, even if the model proposes a
  plausible value.

Gate 6 implementation-ready checklist:

- Add bounded draft continuation state with `draftId` and context signature.
- User answers update only unresolved draft fields and retain previous
  assumptions/tasks.
- Re-run readiness after every merge.
- Context signature changes mark the draft stale before any preview.
- Tests must cover one-turn recovery for missing thickness, ambiguous material,
  missing topology, and missing output.

Gate 7 implementation-ready checklist:

- Reuse the Gate 5 draft type for every candidate.
- Cap wall alternatives at three before generation or parsing.
- Calculator preview each ready candidate; render incomplete candidates as
  `needs_input` cards, not omitted rows.
- Ranking is allowed only from calculator-backed rows and explicit user target
  outputs.
- Tests must prove candidate cap, no mutation, no invented values, and stable
  comparison ordering.

Gate 8 implementation-ready checklist:

- Extend the draft validator for floor, ceiling, and impact-specific required
  inputs without changing engine behavior.
- Dynamic stiffness, load basis, field/lab context, room/volume context, and
  target metric basis must be explicit where the calculator route requires
  them.
- Missing physical inputs return `needs_input`; unsupported basis returns
  `unsupported`.
- Tests must cover `Ln,w`, `L'nT,50`, `IIC`, `AIIC`, missing stiffness/load
  basis, and generic ASTM/ISO alias boundaries.

Gate 9 implementation-ready checklist:

- Convert ready drafts into non-mutating action proposals first.
- Confirmation must carry target ids, stale guard, exact stack diff, and
  previewed calculator basis.
- Confirmed apply may write browser Workbench state only; it must not mutate
  engine formulas, source rows, saved reports, or project metrics unless a
  separate confirmed project/report action is selected.
- Cancellation leaves state unchanged; stale apply returns a stale/error card.

Gate 10 implementation-ready checklist:

- Add repo-local golden eval fixtures before relying on hosted eval exports.
- Required eval classes: correct tool/capability selection, no invented tool
  names, no fabricated calculator values, unsupported-to-numeric prevention,
  missing-basis prevention, stale replay prevention, and untrusted-source
  injection resistance.
- Event records must be redacted and structured: request id, selected
  capability, route, result kind, route status, source trace, validation result,
  used reads/tools, confirmation/rejection, and stale status.
- Telemetry must not persist secrets, full report bodies, or full provider
  transcripts.

High-risk failure modes to keep hunting:

- model chooses research/provider path for a calculator-owned request;
- model summarizes `needs_input` as if it were a numeric answer;
- model invents a material, role, thickness, metric alias, route name, or apply
  permission;
- direct calculator preview is ready, but UI hides warnings/tasks/source trace;
- prompt-injected saved report or provider text changes tool selection;
- candidate comparison silently drops failed candidates;
- floor/impact route guesses dynamic stiffness, load basis, or field context.

Definition of "assistant works well" for this plan:

- For a complete owned wall stack, the assistant can produce a typed draft, call
  calculator preview, and render calculator-backed values with basis and trace.
- For an incomplete stack, it asks the smallest necessary clarification set.
- For unsupported or physically unowned routes, it returns `unsupported` or
  `needs_input` instead of a number.
- For apply requests, it produces a preview proposal and waits for explicit
  confirmation.
- For every result, tests or evals can inspect the selected capability, route
  status, authority, source trace, basis, warnings, and tasks without parsing
  natural-language prose.

## Gate 3 - Registry-Driven Report Editor Cards

Purpose:

- Replace special-case assistant message rendering with a renderer map driven by
  result envelopes and capability metadata.

Primary files:

- `apps/web/features/workbench-rebuild/report-editor.tsx`;
- `apps/web/features/workbench-rebuild/report-editor-project-context.test.ts`;
- `apps/web/features/workbench/report-assistant-editor-workflow.test.ts`;
- new focused result-card UI/contract tests if needed.

Implementation sequence:

1. Add `AssistantResultCard` state beside existing `calculatorPreview`.
2. Render calculator preview through the new card path while preserving the
   existing visual block.
3. Add compact cards for query answer, action proposal, patch proposal, research
   review, project read, finding, and error states.
4. Remove special-case calculator parsing only after tests prove the new card
   path is complete.

Acceptance:

- every card shows authority, basis/route status when relevant, preview/mutation
  posture, warnings/tasks, and stale state;
- preview-only calculator cards cannot render apply buttons;
- mutating or confirmation-required cards show explicit confirmation posture;
- no result card requires inspecting ad hoc payload fields to select a renderer.

Stop condition:

- If UI migration risks losing existing calculator preview display, keep the old
  block and route only one card type through the new renderer until green.

Gate 3 runbook:

1. Introduce card state as additive state in `AssistantMessage`.
2. Render calculator preview through a registry-selected card while keeping the
   existing `AssistantCalculatorPreviewBlock` as the inner view.
3. Add card headers/status rows for:
   - authority;
   - metric basis or "not numeric";
   - preview/mutation posture;
   - stale policy;
   - warnings/tasks.
4. Add compact non-calculator cards after the calculator card is green.
5. Only remove special-case `calculatorPreview` message state after tests prove
   parity.

Gate 3 is complete only when users can visually distinguish calculator-backed,
draft-only, provider-review, needs-input, unsupported, and confirmation-required
results.

Gate 3 local implementation checkpoint - 2026-06-18:

- `AssistantMessage` now accepts additive `assistantResults` beside the legacy
  `calculatorPreview`.
- Route responses from query, action proposal, and patch proposal now filter
  incoming `assistantResults` through `validateReportAssistantResultEnvelope`
  before storing them in the assistant thread.
- `AssistantResultCard` renders envelope-driven authority, route status,
  preview/mutation posture, confirmation posture, stale policy, confidence
  reason, basis rows, task rows, warnings, and source/evidence trace.
- Calculator-preview envelopes render the existing
  `AssistantCalculatorPreviewBlock` as the card body; old
  `message.calculatorPreview` rendering remains as a fallback when no
  calculator-preview envelope is present.
- Static editor coverage now asserts the registry-driven card path and the
  guarded fallback path.
- `report-assistant-result-card-model.ts` now owns renderer labels, calculator
  preview rendering posture, tone classification, and meta rows. Its tests cover
  every registered capability renderer without parsing natural-language prose or
  route-specific legacy payload fields.
- `report-assistant-result-card.tsx` now owns the React card rendering outside
  the editor shell. Server-render smoke tests assert calculator-backed cards
  render preview/basis/trace, while `needs_input` cards do not render calculator
  preview markup or stale numeric values even if a legacy preview prop is
  present.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-editor-workflow.test.ts --maxWorkers=1`
  with 2 files / 13 tests, plus ESLint on the touched editor/test files.
- Focused result-card model validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-result-card-model.test.ts features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-result-contract.test.ts features/workbench/report-assistant-capabilities.test.ts --maxWorkers=1`
  with 4 files / 27 tests.
- Focused result-card component validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-result-card.test.ts features/workbench/report-assistant-result-card-model.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1`
  with 3 files / 15 tests.
- The broader assistant checkpoint suite also passed with 30 files / 216 tests.
- `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`
  still fails only on the known non-current-slice calculator/workbench fixture
  type debt (`exactImpactSource`, `PresetId`, and `OutputCardModel` posture
  fields); no current Gate 3 report-editor/result-card component/model file
  appears in the failure list.
- Remaining Gate 3 cleanup: tune non-calculator card bodies where needed, and
  only then consider removing any legacy calculator-preview parsing.

## Gate 4 - Planner Decision Contract

Label:

```text
report_assistant_planner_decision_contract_v1
```

Purpose:

- Centralize assistant route selection into an auditable decision object.

Primary files:

- new `apps/web/features/workbench/report-assistant-planner.ts`;
- new `apps/web/features/workbench/report-assistant-planner.test.ts`;
- `apps/web/features/workbench-rebuild/report-editor.tsx`;
- `apps/web/features/workbench-rebuild/report-editor-project-context.test.ts`;
- `apps/web/features/workbench/report-assistant-editor-workflow.ts`;
- `apps/web/features/workbench/report-assistant-intent.ts`;
- `apps/web/features/workbench/report-assistant-query.ts`.

Decision fields:

- `targetCapability`;
- `mode`;
- `confidence`;
- `requiresClarification`;
- `clarifyingQuestions`;
- `allowedTools`;
- `rejectionReason`;
- `usedSignals`.

Acceptance:

- save/create/delete/update wording still routes to action proposal or safe
  rejection before patch/query;
- bounded calculator requests route to calculator/query path;
- research/plausibility/finding requests are explicit planner modes;
- prompt-injection wording cannot unlock write tools;
- Turkish/English mixed calculator instructions are covered.

Research-backed constraints:

- Official OpenAI structured-output guidance says schemas should be used at the
  provider boundary, and incompatible user input needs an explicit structured
  fallback rather than coerced output:
  `https://developers.openai.com/api/docs/guides/structured-outputs`.
- Official OpenAI agent-safety guidance says untrusted text must not directly
  drive tool behavior; extract only structured, validated fields before a tool
  or route can run:
  `https://developers.openai.com/api/docs/guides/agent-builder-safety#combine-techniques`.
- Official OpenAI tool guidance keeps tools as host-supplied capabilities and
  allows host control over tool choice, guardrails, review, and observability:
  `https://developers.openai.com/api/docs/guides/tools`.
- Official OpenAI agent-eval guidance recommends starting with traces while
  debugging workflow behavior and using graders to ask whether the agent picked
  the right tool, violated a policy, or improved after routing changes:
  `https://developers.openai.com/api/docs/guides/agent-evals`.
- Official OpenAI guardrail/human-review guidance separates input guardrails,
  output guardrails, tool guardrails, and human review; side-effecting actions
  should pause for approval rather than execute directly:
  `https://developers.openai.com/api/docs/guides/agents/guardrails-approvals`.
- Official OpenAI observability guidance treats traces as structured records of
  model calls, tool calls, guardrails, handoffs, and custom spans:
  `https://developers.openai.com/api/docs/guides/agents/integrations-observability`.
- Official OpenAI eval best-practice guidance recommends eval-driven
  development, task-specific evals, representative datasets, automated scoring
  where practical, and avoiding vibe-based evaluation:
  `https://developers.openai.com/api/docs/guides/evaluation-best-practices`.
- Keep the capability set visible to the model small and explicit for each turn;
  the planner may pick from registry names, but host code decides which concrete
  route/tool payload is allowed.
- Capability names and descriptions must pass the "intern test": a human should
  know when and when not to use the capability from the metadata alone.
- Known context such as current project/report/preset ids, Workbench snapshot
  signatures, and selected outputs must be supplied by host code rather than
  being rediscovered or invented by the model.
- Planner input extracted from provider/research/MCP/report text must be
  structured and validated before it can influence route selection. Prompt text
  such as "ignore previous tools" or invented capability names must be retained
  only as quoted user/source content, not as executable policy.
- Side-effecting paths stay outside planner execution. The planner can request a
  proposal capability; only the host confirmation flow can resume the later
  mutating operation with the original stale-guarded state.

Local implementation checkpoint - 2026-06-18:

- Added `report-assistant-planner.ts` with an auditable decision object:
  `targetCapability`, `mode`, `confidence`, `requiresClarification`,
  `clarifyingQuestions`, `allowedTools`, `rejectionReason`, and `usedSignals`.
- Planner decisions are registry-backed. Unknown or host-disallowed
  capabilities resolve to `unsupported` with no route/tool escalation.
- Prompt-injection wording such as "ignore previous instructions" resolves to
  `unsupported` before any assistant route runs.
- Unsupported side effects such as delete/export/download/archive/apply/reset
  resolve to `unsupported` before any route runs. Content update/write wording
  stays in the non-mutating patch-proposal lane instead of being misread as a
  project save/create action.
- Calculator requests require either explicit layer-stack `mm` evidence or a
  source stack, plus target outputs. Missing fields return concrete Turkish
  clarification questions and do not permit numeric guessing.
- Research intent is detected before calculator intent so "Rw değerini
  kaynaklarla araştır" goes to read-only plausibility/alternative review rather
  than calculator preview.
- The report editor now preflights assistant requests through the planner,
  blocks injection/unsupported/missing-input states locally, maps supported
  planner modes to the existing query/action/patch routes, and passes the
  registry-backed action name to the action-proposal route.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-planner.test.ts features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-editor-workflow.test.ts --maxWorkers=1`
  with 4 files / 43 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec eslint features/workbench/report-assistant-planner.ts features/workbench/report-assistant-planner.test.ts features/workbench-rebuild/report-editor.tsx features/workbench-rebuild/report-editor-project-context.test.ts`.
- The broader assistant checkpoint suite passed with 31 files / 228 tests.
- `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`
  later became green after the fixture type-refresh checkpoint below.

Planner eval refresh checkpoint - 2026-06-18:

- Added `report-assistant-planner-evals.ts` as a local deterministic analogue
  of a trace/eval pack. It captures 20 production-shaped planner examples and
  scores expected `mode`, `targetCapability`, `requiresClarification`,
  `allowedTools`, `usedSignals`, clarification fragments, and rejection reasons.
- Added `report-assistant-planner-evals.test.ts` to require a 1.0 local planner
  eval score and to ensure every calculator-accuracy-protecting decision family
  has coverage.
- Tightened planner ordering so metric-bearing report-edit requests such as
  "Rw açıklamasını güncelle" stay in preview-only patch proposal mode instead
  of being misclassified as calculator preview just because they mention `Rw`.
- Current eval family coverage: `calculator_ready`, `calculator_needs_input`,
  `patch_preview`, `action_confirmation`, `research_review`, `project_read`,
  `prompt_injection`, `host_allowlist`, and `unsupported_side_effect`.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-planner-evals.test.ts features/workbench/report-assistant-planner.test.ts features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-editor-workflow.test.ts --maxWorkers=1`
  with 5 files / 46 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec eslint features/workbench/report-assistant-planner.ts features/workbench/report-assistant-planner.test.ts features/workbench/report-assistant-planner-evals.ts features/workbench/report-assistant-planner-evals.test.ts features/workbench-rebuild/report-editor.tsx features/workbench-rebuild/report-editor-project-context.test.ts`.
- The broader assistant checkpoint suite passed with 32 files / 231 tests.
- `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`
  later became green after the fixture type-refresh checkpoint below.

Green fixture/type-refresh checkpoint - 2026-06-18:

- Refreshed non-runtime web test fixture types that were blocking the app
  TypeScript gate without changing engine behavior:
  `exactImpactSource` is now an explicit optional field on the Step 3 resolver
  surface case type, report helper `presetId` inputs use `PresetId`, and
  A-weighted floor card fixtures add output-card posture before passing cards to
  primary-output selection.
- Validation passed:
  `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts features/workbench/post-v1-floor-explicit-ci-lab-companion-gate-as.test.ts features/workbench/post-v1-floor-explicit-ci50-lab-companion-gate-at.test.ts features/workbench/post-v1-floor-small-room-ci50-low-frequency-gate-ar.test.ts features/workbench/post-v1-floor-field-a-weighted-surface-gate-ac.test.ts --maxWorkers=1`
  with 5 files / 24 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-finding.test.ts features/workbench/report-assistant-action-proposal.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-conversation-storage.test.ts features/workbench/report-assistant-capabilities.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-patch-route.test.ts features/workbench/report-assistant-plausibility.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-project-read-route.test.ts features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-project-tools.test.ts features/workbench/report-assistant-tools.test.ts features/workbench/report-assistant-assembly-alternatives.test.ts features/workbench/report-assistant-context.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/report-assistant-result-contract.test.ts features/workbench/report-assistant-result-card-model.test.ts features/workbench/report-assistant-result-card.test.ts features/workbench/report-assistant-planner.test.ts features/workbench/report-assistant-planner-evals.test.ts features/workbench/report-assistant-plausibility-research.test.ts features/workbench/report-assistant-editor-workflow.test.ts features/workbench/report-assistant-instruction.test.ts features/workbench/report-assistant-project-workspace.test.ts features/workbench/report-assistant-request-lifecycle.test.ts --maxWorkers=1`
  with 32 files / 231 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec eslint features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts features/workbench/post-v1-floor-explicit-ci-lab-companion-gate-as.test.ts features/workbench/post-v1-floor-explicit-ci50-lab-companion-gate-at.test.ts features/workbench/post-v1-floor-small-room-ci50-low-frequency-gate-ar.test.ts features/workbench/post-v1-floor-field-a-weighted-surface-gate-ac.test.ts features/workbench/report-assistant-planner.ts features/workbench/report-assistant-planner-evals.ts features/workbench/report-assistant-planner-evals.test.ts`.

Gate 4 browser-smoke/client-boundary checkpoint - 2026-06-18:

- Browser smoke initially caught a real client/server boundary bug on
  `/workbench/proposal`: the client result-card validation path imported
  `report-assistant-result-contract.ts -> report-assistant-capabilities.ts ->
  report-assistant-tools.ts -> report-assistant-finding.ts`, which pulled
  `node:crypto`, `node:fs/promises`, and `node:path` into the browser bundle.
- Fixed by extracting pure MCP tool metadata to
  `apps/web/features/workbench/report-assistant-tool-definitions.ts` and making
  the capability registry import that client-safe metadata instead of the
  server-capable tool runner. `report-assistant-tools.ts` still re-exports the
  metadata for existing server/test imports and continues to own the executable
  tool implementation.
- Real-browser smoke on `http://localhost:3010/workbench/proposal` now renders
  the report editor and assistant panel after auth and local preview state are
  seeded. No Next build overlay or console errors remain.
- Missing-input preflight smoke:
  `Bu duvar katmanını hesapla` renders `More input needed` with the concrete
  clarification `Katman dizilimini malzeme, rol ve mm kalınlıklarıyla ver.` and
  does not call any `/api/report-assistant/*` route.
- Unsupported side-effect smoke:
  `delete this report and export the PDF` renders `Request unsupported` with
  `Unsupported side-effecting actions must stay outside report assistant
  planning.` and does not call any `/api/report-assistant/*` route.
- Calculator `needs_input` smoke:
  `12.5 mm alçıpan + 75 mm taş yünü + 12.5 mm alçıpan için Rw ve STC hesapla`
  calls `/api/report-assistant/query`, renders a calculator preview result card
  with `needs input` authority, and shows route-required missing inputs instead
  of fabricating numbers.
- Calculator-backed ready smoke:
  `Calculate Rw and STC for 12.5 mm alcipan + 50 mm tasyunu + 100 mm beton`
  calls `/api/report-assistant/query`, renders a `calculator backed` / `ready`
  card, displays parsed layers (`Gypsum Board`, `Rock Wool`, `Concrete`), and
  shows calculator-owned `Rw 57 dB` and `STC 57 dB` rows.
- Browser network evidence: the two preflight-blocked prompts left no
  report-assistant requests; the two calculator prompts produced exactly
  `/api/report-assistant/query => 200 OK` calls. Browser console evidence:
  zero errors after the client-boundary fix.
- Browser artifact:
  `output/playwright/.playwright-cli/page-2026-06-18T08-42-24-325Z.png`.
- Validation passed:
  `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-capabilities.test.ts features/workbench/report-assistant-tools.test.ts --maxWorkers=1`
  with 2 files / 10 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run ...assistant suite... --maxWorkers=1`
  with 32 files / 231 tests after the client-boundary split and browser smoke.

Stop condition:

- If planner migration changes existing route behavior unexpectedly, keep the
  old classifier as fallback and add a parity test before continuing.

## Gate 5 - Layer Stack Draft Schema

Label:

```text
report_assistant_layer_stack_draft_v1
```

Purpose:

- Add durable typed state for user-described layer combinations before calculator
  preview.

Primary files:

- new `apps/web/features/workbench/report-assistant-layer-stack-draft.ts`;
- new `apps/web/features/workbench/report-assistant-layer-stack-draft.test.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`;
- `apps/web/features/workbench/report-assistant-query.ts`;
- `apps/web/features/workbench-rebuild/report-editor.tsx`.

Draft fields:

- `draftId`;
- `mode`;
- `layers`;
- `requestedOutputs`;
- `customMaterials`;
- `wallTopologyDraft`;
- `floorImpactDraft`;
- `missingInputs`;
- `clarifyingQuestions`;
- `assumptions`;
- `warnings`;
- `sourceInstruction`;
- `originalPhrases`;
- `lastCalculatorPreview`.

Acceptance:

- original phrases are preserved beside normalized material ids;
- unknown and ambiguous material phrases become tasks;
- missing thickness/topology/output/basis becomes a minimal question set;
- ready drafts can build a Workbench V2 snapshot and call calculator preview;
- incomplete drafts cannot produce numeric acoustic rows.

Research-backed constraints:

- Use structured output/schema validation at the provider boundary for any
  model-produced draft.
- The schema must make invalid states unrepresentable where practical: use
  enums for role, source, authority, metric basis, and missing-input category.
- If user input is incompatible with the draft schema, return a structured
  `needs_input` draft instead of forcing a malformed stack.

Stop condition:

- If the draft needs engine fields that are not exposed through Workbench
  snapshot/input contracts, return `needs_input` and document the missing input
  rather than changing engine behavior.

Gate 5 runbook:

1. Define draft types and validators before changing parser behavior.
2. Add fixtures for:
   - simple wall stack;
   - repeated gypsum notation;
   - ambiguous material phrase;
   - missing thickness;
   - explicit double-leaf wording with missing side/cavity role;
   - floor/impact wording with missing route-required physical input.
3. Add draft-to-snapshot conversion only for drafts that pass readiness checks.
4. Keep the existing described-wall parser as an input source into the draft,
   not as the authority that directly produces numeric answers.
5. Add calculator preview call only after draft readiness tests are green.
6. Run:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-layer-stack-draft.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench/report-assistant-query-route.test.ts \
  --maxWorkers=1
```

Gate 5 is complete only when incomplete drafts cannot produce numeric output.

## Gate 6 - Clarification Loop

Purpose:

- Allow the assistant to refine the same draft across turns.

Primary files:

- `report-assistant-layer-stack-draft.ts`;
- `report-assistant-query.ts`;
- `report-editor.tsx`;
- conversation/storage helpers if bounded persistence is needed.

Acceptance:

- user answer updates the same draft id;
- previous assumptions and unresolved inputs are retained;
- answer-to-question matching is deterministic for the first pass;
- stale context invalidates draft preview before calculator execution;
- tests cover one missing material, one ambiguous topology, and one missing
  floor/impact physical input.

Stop condition:

- If continuation state cannot be safely associated with current context, render
  the draft as stale and ask user to confirm restarting.

Gate 6 runbook:

1. Store only bounded draft state, not full assistant transcripts.
2. Add `draftId` and context signature to every draft-bearing result.
3. Implement deterministic answer merge for the first pass:
   - missing material;
   - missing thickness;
   - missing output;
   - missing wall topology;
   - missing floor/impact physical input.
4. Re-run readiness after every merge.
5. If context signature changes, mark draft stale before calculator preview.

Gate 6 is complete only when one clarification turn can update the same draft
and produce either a ready calculator preview or a smaller remaining task list.

## Gate 7 - Wall Candidate Comparison

Purpose:

- Support bounded alternative generation and calculator-backed comparison.

Primary files:

- `report-assistant-layer-stack-draft.ts`;
- `workbench-v2-calculator-assistant.ts`;
- `report-assistant-query.ts`;
- report editor card rendering tests.

Rules:

- candidate count starts at max 3;
- each candidate is a typed draft;
- every ready candidate is previewed through the calculator;
- incomplete candidates show `needs_input`;
- comparison table never invents values for failed candidates.

Acceptance:

- user can ask for up to three wall alternatives and see calculator-backed rows;
- unsupported candidates stay unsupported;
- comparison shows thickness/layer count/tasks where available;
- tests prove candidate cap and no mutation.

Gate 7 runbook:

1. Reuse `AssistantLayerStackDraft`; do not invent a separate candidate shape.
2. Add deterministic candidate cap before candidate generation.
3. Preview candidates sequentially or with a bounded concurrency of one until
   telemetry says otherwise.
4. Render failed candidates as task rows, not omitted rows.
5. Do not rank by model preference unless calculator-backed outputs are present.

## Gate 8 - Floor/Ceiling/Impact Input Capture

Purpose:

- Move floor/ceiling/impact from parked `needs_input` to safe input capture.

Primary files:

- `report-assistant-layer-stack-draft.ts`;
- `workbench-v2-calculator-assistant.ts`;
- route/input task tests.

Rules:

- no impact/floor numeric answer until route-required physical inputs are known;
- dynamic stiffness, load basis, field context, room/volume context, and target
  metric basis must be explicit where required;
- unsupported metric basis must stay unsupported.

Acceptance:

- incomplete floor prompt returns precise task list;
- complete owned floor draft previews through existing calculator path;
- tests cover `Ln,w`, `L'nT,50`, `IIC`/`AIIC`, and missing stiffness/load basis
  boundaries.

## Gate 9 - Confirmed Apply-To-Workbench Proposal

Purpose:

- Let users apply a validated stack draft to browser Workbench state only after
  explicit confirmation.

Primary files:

- `report-assistant-action-proposal.ts`;
- `report-editor.tsx`;
- Workbench draft state helpers;
- action proposal tests.

Rules:

- preview first, apply later;
- apply is blocked on stale Workbench snapshot;
- selected layer ids and derived previews are cleared or reconciled safely;
- no report metric mutation unless separately requested;
- no engine mutation.

Acceptance:

- apply proposal displays exact stack diff;
- confirmation writes only browser Workbench state;
- cancellation leaves state unchanged;
- stale apply returns a clear stale card.

## Gate 10 - Eval, Observability, And Hardening

Purpose:

- Make assistant quality measurable and production-safe.

Primary files:

- new eval fixture directory under `apps/web/features/workbench/__fixtures__` or
  equivalent local pattern;
- redacted event log or telemetry hook;
- route body/context budget helpers.

Acceptance:

- golden prompt matrix covers Turkish, English, mixed wording, missing inputs,
  ambiguous materials, unsupported metrics, stale context, provider malformed
  output, and prompt-injection attempts;
- evals include fabricated calculator value, invented tool/capability name,
  unsupported-to-numeric substitution, stale-source reuse, missing basis, and
  ungrounded source-claim cases;
- evals include untrusted-source injection cases where provider/research/MCP or
  saved-report text asks the assistant to call a different tool, skip
  confirmation, invent a capability, or promote advisory text to calculator
  authority;
- event records include request id, route, selected capability, used reads/tools,
  result kind, validation status, route status, user confirmation/rejection, and
  no secrets/full report bodies;
- traces distinguish planner decision, route adapter, provider parse,
  result-envelope validation, tool/read call, guardrail block, confirmation
  interruption, user approval, user rejection, and stale replay;
- route body limits and context budgets are explicit;
- provider parse failure and local validation failure are separate categories.

## Implementation Order Summary

1. Gate 0 - stabilize checkpoint. Done locally on 2026-06-18.
2. Gate 1 - result envelope contract. Core contract done locally on
   2026-06-18.
3. Gate 2 - route envelope adapters. Done locally on 2026-06-18.
4. Gate 3 - registry-driven report editor cards.
5. Gate 4 - planner decision contract.
6. Gate 5 - layer stack draft schema.
7. Gate 6 - clarification loop.
8. Gate 7 - wall candidate comparison.
9. Gate 8 - floor/ceiling/impact input capture.
10. Gate 9 - confirmed apply-to-Workbench proposal.
11. Gate 10 - eval, observability, and hardening.

## Minimum Commit Strategy

Keep commits slice-bounded:

- one commit for result contract and tests;
- one commit for route envelope adapters;
- one commit for report editor card migration;
- one commit for planner decision contract;
- one commit for layer-stack draft schema;
- one commit for clarification loop;
- one commit for candidate comparison;
- one commit for floor/impact capture;
- one commit for apply proposal;
- one commit for eval/observability/hardening.

Each commit should include its doc update and targeted tests. Avoid combining
engine/calculator runtime changes with assistant UX/tooling commits.

Commit readiness:

- `git diff --cached --name-only` must show only files for the current gate;
- docs and tests for the gate are committed with the implementation;
- broad dirty worktree files unrelated to the gate stay unstaged;
- if a commit is not self-contained because dependencies are still untracked,
  do not commit; stage the full self-contained assistant slice or leave it
  uncommitted with a clear status note.

## Always-Run Checks For This Plan

After each gate:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-capabilities.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts \
  features/workbench/report-assistant-request-lifecycle.test.ts \
  --maxWorkers=1
```

Before closing each gate:

```bash
pnpm --filter @dynecho/web exec eslint <touched assistant files>
git diff --check
```

Before closing a broad user-visible gate:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-action-proposal.test.ts \
  features/workbench/report-assistant-assembly-alternatives.test.ts \
  features/workbench/report-assistant-capabilities.test.ts \
  features/workbench/report-assistant-context.test.ts \
  features/workbench/report-assistant-conversation-storage.test.ts \
  features/workbench/report-assistant-editor-workflow.test.ts \
  features/workbench/report-assistant-finding.test.ts \
  features/workbench/report-assistant-instruction.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench/report-assistant-model.test.ts \
  features/workbench/report-assistant-patch.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-project-read-route.test.ts \
  features/workbench/report-assistant-project-tools.test.ts \
  features/workbench/report-assistant-project-workspace.test.ts \
  features/workbench/report-assistant-query-route.test.ts \
  features/workbench/report-assistant-request-client.test.ts \
  features/workbench/report-assistant-request-lifecycle.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts \
  features/workbench/report-assistant-tools.test.ts \
  features/workbench/report-assistant-trace-explanation.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  --maxWorkers=1
```

Full web typecheck should be run and reported, but known unrelated fixture/type
debt must be separated from the assistant gate result until fixed.
