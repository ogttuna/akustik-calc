# Report Assistant Capability And Best-Practices Review - 2026-06-17

## Purpose

This document reviews the current DynEcho report assistant as an assistant
system, separate from the active calculator implementation chain.

It answers:

- what the assistant can do today;
- how well the architecture follows modern LLM/agent best practices;
- which guardrails are already strong;
- which missing pieces limit usefulness, reliability, security, and product
  quality;
- what should be fixed next before the assistant becomes more agentic.

This review does not select or change a calculator slice. It must not change
engine formulas, source rows, route selection, metric basis behavior,
`needs_input`, or `unsupported` boundaries.

## Sources Reviewed

Local implementation:

- `apps/web/features/workbench/report-assistant-model.ts`
- `apps/web/features/workbench/report-assistant-context.ts`
- `apps/web/features/workbench/report-assistant-instruction.ts`
- `apps/web/features/workbench/report-assistant-patch.ts`
- `apps/web/features/workbench/report-assistant-tools.ts`
- `apps/web/features/workbench/report-assistant-project-tools.ts`
- `apps/web/features/workbench/report-assistant-query.ts`
- `apps/web/features/workbench/report-assistant-action-proposal.ts`
- `apps/web/features/workbench/report-assistant-capabilities.ts`
- `apps/web/features/workbench/report-assistant-request-client.ts`
- `apps/web/features/workbench/report-assistant-request-lifecycle.ts`
- `apps/web/features/workbench/report-assistant-runtime-status.ts`
- `apps/web/features/workbench/report-assistant-plausibility-research.ts`
- `apps/web/features/workbench/report-assistant-assembly-alternatives.ts`
- `apps/web/features/workbench/report-assistant-finding.ts`
- `apps/web/features/workbench/report-assistant-conversation-storage.ts`
- `apps/web/features/workbench-rebuild/report-editor.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`
- `apps/web/app/api/report-assistant/*`

Local planning docs:

- `docs/calculator/REPORT_ASSISTANT_OUTPUT_MANIPULATION_AND_REVIEW_QUEUE_PLAN_2026-06-01.md`
- `docs/ui/REPORT_ASSISTANT_SCOPE_EXPANSION_PLAN_2026-06-16.md`
- `docs/ui/REPORT_ASSISTANT_CALCULATOR_PREVIEW_PRODUCTIZATION_PLAN_2026-06-17.md`
- `docs/ui/PROJECT_WORKSPACE_MODEL_PLAN_2026-06-12.md`
- `docs/ui/WORKBENCH_V2_USER_PRESET_LIBRARY_PLAN_2026-06-15.md`
- `docs/ui/WORKBENCH_V2_COMMON_LAYER_PRESET_SEED_PLAN_2026-06-15.md`
- `docs/ui/WORKBENCH_V2_WORKSPACE_FLOW_SIMPLIFICATION_PLAN_2026-06-16.md`

External best-practice references checked for this review:

- OpenAI function/tool calling documentation:
  `https://developers.openai.com/api/docs/guides/function-calling`
- Google Gemini structured output documentation:
  `https://ai.google.dev/gemini-api/docs/structured-output`
- OWASP Top 10 for LLM Applications:
  `https://owasp.org/www-project-top-10-for-large-language-model-applications/`
- NIST AI RMF and Generative AI Profile:
  `https://www.nist.gov/itl/ai-risk-management-framework`

## Executive Verdict

The report assistant is not a generic autonomous agent. It is a guarded
report-workflow assistant with three main modes:

1. report patch proposal;
2. read-only project/workspace/query support;
3. source-bounded plausibility and calculator preview support.

That is a good product posture for DynEcho. The current architecture correctly
keeps the model below the application:

- the model proposes structured operations instead of rewriting whole reports;
- the server and browser validate before applying anything;
- most assistant tools are explicitly `mutates: false`;
- report edits remain report-document edits, not calculator truth;
- research is advisory and does not calibrate the engine.

The assistant is therefore safer than a typical "chat box with write tools".

Since the first version of this review, the initial calculator-preview
productization slice landed locally:

- report-editor query/action/patch requests now use the shared assistant request
  lifecycle helpers;
- bounded calculator-preview commands now route to the read-only query path;
- query responses can carry structured `calculatorPreview` payloads;
- the report editor can render parsed layers, route summary, output rows, and
  route tasks as a read-only calculator preview block;
- the described wall parser now covers repeated layer notation, comma-separated
  lists, and material-before-thickness phrases.

Since the next assistant pass, the first capability-registry contract also
landed locally:

- every current `/api/report-assistant/*` route is represented in
  `REPORT_ASSISTANT_CAPABILITY_REGISTRY`;
- local read tools, preset reads, calculator preview tools, MCP-style read tools,
  and action proposals are represented in the same registry;
- runtime status derives route/tool/action summaries from that registry;
- contract tests fail when a route is missing from the registry or a mutating
  capability becomes model-exposed.

That closes the original "preview path is too text-only" problem. The assistant
is now more capable and less drift-prone, but it is still not a mature assistant
platform. Its remaining major gaps are:

- the capability registry is a policy catalog, not yet a complete
  planner/orchestrator: route selection is still split across deterministic
  classifiers and query detectors;
- intent routing is still split between route-specific deterministic classifiers
  rather than one auditable assistant planner/orchestrator contract;
- only calculator preview has a first-class structured response card in the
  report editor; patch, action, research, project-read, and finding results
  still use mostly bespoke/plain-message handling;
- the assistant can preview a described wall stack, but it cannot yet maintain a
  layer-stack draft, ask clarifying questions over multiple turns, compare
  candidate stacks, or apply a confirmed stack to Workbench browser state;
- structured output is not consistently schema-enforced at the provider level;
- observability, evals, route edge abuse controls, and production telemetry are
  still thin.

The correct next direction is still not direct write tools. The result envelope
contract vocabulary has now landed locally; the next direction is to make route
responses and renderer/apply/stale policy consume that contract, then add a
layer-stack draft loop that uses the existing calculator without touching engine
truth.

## Assistant Accuracy And Effective-System-Use North Star - 2026-06-18

The assistant target is not just "more features." The target is a high-integrity
calculator copilot that can use DynEcho's existing system surfaces correctly,
efficiently, and visibly.

Every next assistant slice must satisfy these product constraints:

1. **Application-owned truth**
   - Calculator outputs, project reads, saved reports, preset reads, and finding
     records must come from typed application routes or local deterministic
     helpers, not from model memory.
   - The model may summarize, plan, draft, or ask clarifying questions, but it
     must not invent calculator values, route basis, source rows, saved ids, or
     project state.

2. **Calculator-first answer path**
   - If a user asks for an acoustic result, the assistant must first try to
     normalize the request into a calculator-ready draft or Workbench snapshot.
   - If required physical inputs are missing, the assistant must return the
     smallest useful `needs_input` question set instead of guessing.
   - If the calculator route returns `unsupported`, the assistant must preserve
     that status and explain the blocking boundary, not substitute a nearby
     metric or family.

3. **Effective system use**
   - The assistant should use existing Workbench/project/report/preset/read
     routes before asking the user for information that is already available in
     current browser or saved project state.
   - It should produce compact tool/read traces that show what it used: current
     snapshot, parsed stack, selected outputs, project ids, preset ids, route
     tasks, and evidence.
   - It should avoid forcing users to rebuild a stack manually when the system
     already has enough structured state to preview it.

4. **Visible authority and uncertainty**
   - Every assistant result must display whether it is calculator-backed,
     provider-backed, deterministic, draft-only, preview-only, or user-confirmed.
   - Numeric acoustic answers must carry metric id, basis, route status, and
     task/warning state. A number without basis is not an acceptable answer.
   - Research/source review must stay advisory unless a separate calculator
     source-ingestion slice explicitly owns the source row and basis.

5. **Confirmation before mutation**
   - Direct autonomous writes remain out of scope.
   - Any report, project, preset, finding, or future Workbench-state mutation
     must be represented as a proposal/card first, with stale guards and explicit
     user confirmation.

6. **Evaluation before expansion**
   - New assistant capabilities must ship with deterministic contract tests and
     a small golden prompt matrix covering Turkish, English, mixed wording,
     missing inputs, ambiguous materials, stale context, and prompt-injection
     attempts.
   - Expanding parser coverage without a draft/clarification state is not
     acceptable; parser intelligence must attach to a typed draft boundary.

This raises the bar for the current roadmap:

- `report_assistant_result_card_contract_v1` must make authority, basis,
  mutation posture, evidence, warnings, and stale policy visible for every
  result type.
- `report_assistant_layer_stack_draft_v1` must make the assistant capable of
  building and refining a calculator-ready draft, not just parsing one-shot
  wall strings.
- `report_assistant_planner_decision_contract_v1` must make selected
  capabilities auditable, so route selection can be evaluated and improved
  without hidden regex drift.

Active implementation plan:

`docs/ui/REPORT_ASSISTANT_HIGH_ACCURACY_COPILOT_IMPLEMENTATION_PLAN_2026-06-18.md`

Use that file for gate order, primary files, acceptance criteria, validation
commands, stop conditions, and commit slicing. This review remains the reasoning
and gap-analysis source.

## Remaining Work Implementation Gap Review - 2026-06-17

### Baseline Now Implemented

The current implementation should be treated as this baseline:

| Capability | Current implementation evidence | Status |
| --- | --- | --- |
| Patch proposal | `POST /api/report-assistant/patch`, `report-assistant-model.ts`, `report-assistant-patch.ts` | Implemented as preview/validation only |
| Action proposal | `POST /api/report-assistant/action-proposal`, `report-assistant-action-proposal.ts`, report editor confirm flow | Implemented as preview plus explicit UI confirmation |
| Project/preset read | `POST /api/report-assistant/project-read`, `report-assistant-project-tools.ts`, `report-assistant-preset-library.ts`, query route reads | Implemented as read-only summary-first tools |
| Query answer | `POST /api/report-assistant/query`, `report-assistant-query.ts` | Implemented with deterministic read planning and bounded calculator preview branch |
| Calculator preview | `workbench-v2-calculator-assistant.ts`, `POST /api/report-assistant/calculator-preview`, query payload `calculatorPreview`, `AssistantCalculatorPreviewBlock` | Implemented for Workbench snapshot and described wall preview |
| Capability registry | `report-assistant-capabilities.ts`, `report-assistant-capabilities.test.ts` | Implemented as first-pass route/tool/action policy registry |
| Request lifecycle | `report-assistant-request-client.ts`, `report-assistant-request-lifecycle.ts`, `report-editor.tsx` | Implemented for report editor query/action/patch paths |
| Research/review | `POST /api/report-assistant/plausibility`, `POST /api/report-assistant/assembly-alternatives` | Implemented as advisory, non-calibrating review routes |
| Finding queue | `POST /api/report-assistant/findings`, `report-assistant-finding.ts` | Implemented with explicit confirmation and JSONL append |
| Runtime status | `GET /api/report-assistant/status`, `report-assistant-runtime-status.ts` | Implemented as provider/tool/route/action preflight summary derived from registry |

### Remaining Gap Matrix

| Area | What exists | Remaining gap | Why it matters |
| --- | --- | --- | --- |
| Capability registry | `REPORT_ASSISTANT_CAPABILITY_REGISTRY` covers current routes, read tools, preset reads, calculator preview tools, MCP-style tools, and action proposals. Runtime status now derives from it. | The registry is not yet used as the route response envelope, renderer map, planner target contract, or apply controller source. | Feature drift risk is lower, but UI/result/planner drift can still happen unless the next layers consume the registry. |
| Intent routing | `report-assistant-editor-workflow.ts` routes editor requests to query/action/patch. `report-assistant-intent.ts` classifies research/patch/explain/finding-style requests. Query has its own deterministic detectors. | No shared planner decision object such as `mode`, `targetCapability`, `confidence`, `requiresClarification`, and `allowedTools`. | The assistant can misroute edge cases, and each new surface must duplicate regex policy. |
| Result envelopes | `report-assistant-result-contract.ts` now defines the common envelope and validator. Query returns text/evidence/used reads and optionally calculator preview. Action and patch routes return bespoke shapes. Research routes return review objects. | Route responses do not yet wrap their existing payloads in the common envelope, and the editor still renders most result kinds through bespoke handling. | UI cards and tests must special-case every result type until Gate 2/Gate 3 consume the envelope. |
| Assistant thread UI | Report editor has plain messages plus a structured calculator preview block. Action proposal and patch proposal have separate panels/flows. | No typed card system for query answer, calculator preview, patch proposal, action proposal, research review, project read, finding log, and error states. | Users cannot reliably see what is preview-only, what changes a draft, and what writes project state. |
| Layer composition | Described wall parser can parse common wall phrases and run preview. Snapshot preview can run complete Workbench stacks including custom materials. | No `AssistantLayerStackDraft` schema, multi-turn clarification state, candidate stack comparison, topology role editor, custom material capture, or apply-to-Workbench confirmation flow. | The assistant can answer simple wall preview requests, but cannot yet "diz" arbitrary requested layer combinations like a real calculator copilot. |
| Floor/ceiling/impact composition | Snapshot preview supports calculator execution when Workbench already owns the needed inputs. Described floor parser intentionally returns `needs_input`. | No natural-language floor/ceiling composer that captures impact roles, resilient layer properties, dynamic stiffness, load basis, field K/CI, room volume, or route-required physical inputs. | Floor/impact requests are common and easy to get wrong if guessed. |
| Action apply | Report editor confirms action proposals through existing guarded project/preset routes and checks stale target state. | Confirmation logic is handwritten inside `report-editor.tsx`; there is no central assistant apply controller or contract-derived apply helper. | Future action types risk inconsistent stale checks, partial success handling, and audit messages. |
| Research/plausibility routing | Plausibility and assembly-alternative routes exist and can use context-only or provider-backed review. | The editor assistant request path does not yet route ordinary user research questions into structured research cards. Research is not coordinated by the same planner as query/calculator/action. | Good research capability is present but not consistently discoverable from the main assistant thread. |
| Provider contracts | Patch and research providers normalize JSON-like responses and validate local structures. | Provider schema mode and adapter contracts are inconsistent; parse failures, schema failures, and local validation failures are not first-class telemetry categories. | Provider drift can appear as vague assistant failure or weak answers. |
| Conversation state | `report-assistant-conversation-storage.ts` provides bounded localStorage storage for a research-style surface; report editor messages are local component state. | No unified policy for ephemeral vs persisted assistant messages, no reusable transcript packet schema, and no multi-turn clarification state for layer drafts. | The assistant cannot reliably continue a stack-drafting conversation after state changes. |
| Observability | Request ids, attempts, duration, timeout metadata, and runtime status exist. | No durable redacted assistant event log for route decisions, tool reads, provider latency, result kind, validation status, user confirmation, and rejection reasons. | Productizing assistant behavior without telemetry makes regressions and user trust hard to measure. |
| Evals | Focused unit/route tests cover many contracts. | No golden conversation matrix, no adversarial prompt-injection corpus, no cross-surface workflow evals, and no research quality benchmark. | "Feels competent" regressions can pass the current test suite. |
| Route hardening | Routes parse payloads and use auth/access helpers where needed. | Request body caps, assistant-specific rate limits, context budgets, provider quotas, and prompt-injection input taxonomy are not explicit enough. | Cost, abuse, and model-denial-of-service risks remain undercontrolled. |

### Priority Backlog

P0: `report_assistant_capability_registry_core_v1` - landed locally

- Created one capability registry for every current `/api/report-assistant/*`
  route and local assistant tool/action family.
- Derived runtime status from that registry instead of separately concatenating
  tool lists.
- Added tests that fail when a route is missing from the registry, runtime tool
  capabilities drift from source definitions, or a mutating capability is exposed
  as a model tool.
- Kept behavior mostly unchanged; this was a contract/architecture slice, not a
  calculator or UI redesign.

P1: `report_assistant_result_card_contract_v1` - core contract landed locally

- Defined a common assistant result envelope and validator that consumes the
  capability registry.
- Still remaining: route envelope adapters and a registry-driven renderer map.
- Convert calculator preview from a special-case message block to the first
  registry-selected card.
- Add registered cards for patch proposal summary, action proposal summary,
  query answer, research review, finding preparation/log, and errors.
- Preserve explicit confirmation for every mutating/draft-changing path.
- Every card must expose authority and uncertainty: `calculator_backed`,
  `deterministic_read`, `provider_review`, `draft_only`, `preview_only`,
  `needs_input`, or `unsupported`.
- Numeric result cards must show metric id, basis, route status, stale policy,
  evidence, warnings, and pending tasks without requiring users to inspect raw
  JSON.

P2: `report_assistant_planner_decision_contract_v1`

- Define one planner decision object with `targetCapability`,
  `requiresClarification`, `confidence`, `allowedTools`, and rejection reason.
- Route editor query/action/patch/calculator/research/finding decisions through
  the capability registry instead of parallel regex-only branches.
- Keep mutation intent and explicit confirmation precedence intact.
- Planner output must record why it chose calculator preview, project read,
  patch proposal, action proposal, research, finding, or clarification.
- Planner tests must cover Turkish/English mixed calculator requests, research
  requests, mutation attempts, prompt-injection wording, and ambiguous
  layer/material instructions.

P3: `report_assistant_layer_stack_draft_v1`

- Add a typed stack-draft object for user-described layer combinations.
- Store parsed layers, unknown materials, ambiguous materials, inferred route,
  requested outputs, missing physical inputs, and clarification questions.
- Use existing calculator preview for every ready draft.
- Do not apply to Workbench until a separate confirmation flow exists.
- The draft must preserve original user phrases beside normalized material ids
  so errors can be corrected and explained.
- The draft must support iterative refinement: user answers should update the
  same draft, not start a disconnected one-shot parse.
- A ready draft must be calculator-ready by construction; if it is not ready,
  it must return `needs_input` tasks instead of producing acoustic values.

P4: `report_assistant_layer_stack_apply_preview_v1`

- Add a preview-only action proposal for applying a stack draft to Workbench
  browser state.
- Require explicit confirmation.
- Clear selected layer ids and derived previews safely when applying.
- Never mutate engine code, formulas, source rows, or metric basis.

P5: `report_assistant_research_card_and_routing_v1`

- Route "is this plausible", "compare source", "alternative assembly", and
  "log finding" requests through one planner decision path.
- Render research/finding results as structured cards with sources,
  comparability, source quality, recommendation, and confirmation state.

P6: `report_assistant_eval_observability_v1`

- Add a fixture-based assistant eval suite and a redacted event log.
- Cover English/Turkish mixed intent, prompt-injection inputs, stale-result
  races, malformed provider outputs, and layer-draft clarification paths.
- Track route decision, selected capability, used reads/tools, calculator route
  status, missing inputs, provider status, user confirmation, and rejection
  reason without storing secrets or full report bodies.
- Add high-accuracy regression cases where the correct answer is `needs_input`
  or `unsupported`, not a numeric estimate.

P7: `report_assistant_route_hardening_v1`

- Add body-size limits, context budgets, provider quotas/rate limits, and
  provider schema/error taxonomy.

### Recommended Next Slice

The next assistant slice should be:

```text
report_assistant_result_card_contract_v1
```

Why this should come before more parser work:

- the central capability registry now exists, so the next drift point is result
  rendering and response envelopes;
- the user-facing goal "assistant can use the calculator" needs a durable
  route from capability to result card to confirmation, not another one-off
  parser;
- it does not touch calculator runtime behavior;
- it makes later stack-draft, planner, research, and apply-to-Workbench work
  safer.

Acceptance criteria:

- done locally: define a shared assistant result envelope with `capabilityName`, `resultKind`,
  `rendererKind`, `mutates`, `previewOnly`, `requiresConfirmation`, `evidence`,
  `warnings`, and `stalePolicy`;
- done locally: include `authority`, `basis`, `routeStatus`, `tasks`, `sourceTrace`, and
  `confidenceReason` fields where applicable;
- calculator preview responses and editor messages can be rendered through that
  envelope without inspecting ad hoc payload fields;
- patch proposal, action proposal, query answer, research review, project-read,
  finding, and error states have registered renderer contracts even if their
  first UI remains compact;
- renderer tests prove preview-only calculator cards cannot show apply buttons
  and mutating/confirmed paths cannot appear as direct model tools;
- route/status tests prove every envelope references a known capability;
- numeric assistant answers without calculator/project/source authority are
  rejected by tests;
- result cards distinguish `needs_input`, `unsupported`, provider failures,
  validation failures, and stale results;
- no engine package files are touched.

### Layer-Stack Draft Follow-Up Criteria

After the result-card slice, the layer composer should land as a separate
bounded slice:

- `AssistantLayerStackDraft` includes `mode`, `layers`, `requestedOutputs`,
  `customMaterials`, `wallTopologyDraft`, `floorImpactDraft`, `missingInputs`,
  `clarifyingQuestions`, `warnings`, and `sourceInstruction`;
- parsed layers keep both normalized material ids and original user phrases;
- unknown/ambiguous material phrases produce clarification tasks, not nearest
  matches;
- floor/impact drafts stay `needs_input` until route-required physical inputs
  are captured;
- every ready draft can call `preview_workbench_v2_calculator_snapshot`;
- applying to Workbench remains a separate explicit confirmation action.

## Current Capability Map

### Patch Proposal

Current route:

```text
POST /api/report-assistant/patch
```

Current behavior:

- accepts current report assistant context, current report document, and a user
  instruction;
- can use either a deterministic parser or an external model provider;
- asks the model for one `ReportAssistantPatch` JSON object;
- validates the patch with `validateReportAssistantPatch`;
- returns only a patch preview and validation result;
- does not apply the patch on the server.

Strong guardrails:

- model output cannot directly mutate browser state, project storage, or export
  files;
- metric operations must target known metric ids;
- `needs_input` and `unsupported` outputs cannot be converted into numeric
  report values;
- large movements are confirmation-gated or rejected;
- document signatures guard against stale report-document edits.

Current limitation:

- this is patch-specific. It should not be overloaded with project save,
  restore, preset, calculator-stack, or general tool actions.

### Action Proposals

Current route:

```text
POST /api/report-assistant/action-proposal
```

Current action preview types:

- `create_project_report_from_current_draft`
- `create_user_preset_from_current_stack`
- `restore_report_revision_as_new_draft`
- `save_current_stack_as_project_assembly`
- `save_project_report_revision_from_current_draft`

Current behavior:

- action proposal route itself returns `mutates: false`;
- proposals include target ids, document/context signatures, a route preview,
  and `requiresConfirmation: true`;
- report editor confirmation then calls existing project/preset routes.

Strong guardrails:

- this separates "assistant suggests" from "app mutates";
- report revision writes include expected updated timestamps where the current
  UI path supplies them;
- restore appends a new revision rather than overwriting old revisions.

Current limitation:

- the confirmation/apply logic is dispersed in `report-editor.tsx`;
- there is no centralized assistant action-apply route that enforces every
  action's stale guards uniformly;
- multi-step actions can still create partial success states, for example an
  assembly is saved before a later report save fails.

### Read-Only Project And Preset Query

Current routes:

```text
POST /api/report-assistant/project-read
POST /api/report-assistant/query
```

Current read tools include:

- project list/summary reads;
- project assemblies/reports/revisions summaries;
- explicit child document/snapshot reads;
- user/common preset summaries.

Strong guardrails:

- tool definitions declare `mutates: false`;
- project access uses the existing owner and access policy path;
- default summary reads avoid full report bodies and assembly snapshots;
- query responses record `usedReads`.

Current limitation:

- the query planner is deterministic and shallow;
- full child reads exist, but there is no higher-level plan/reason/execute
  cycle with auditable tool inputs and outputs;
- query result contracts are text-first, so structured data is hard to render.

### Calculator Preview

Current route:

```text
POST /api/report-assistant/calculator-preview
```

Current behavior:

- previews a Workbench V2 snapshot or described wall layer configuration;
- returns `previewOnly: true` and `mutates: false`;
- can parse common described wall stacks with explicit `mm` thickness,
  repeated layers, comma-separated layer lists, and material-before-thickness
  phrases;
- read-only query responses can carry structured `calculatorPreview` data and
  the report editor can render that preview as a guarded assistant card;
- routes unknown/ambiguous/floor descriptions to `needs_input` rather than
  guessing.

Strong guardrails:

- calculator preview does not change Workbench state;
- parser uses conservative aliases rather than fuzzy source-family matching;
- calculator execution remains in the existing helper path, not inside the
  report editor.

Current limitation:

- described free-text parsing is still wall-only and alias-based;
- there is no persistent assistant stack draft or clarification loop;
- custom material creation from natural language is not supported in described
  mode;
- floor, ceiling, and impact descriptions intentionally remain `needs_input`
  until route-required physical inputs can be captured safely;
- there is no confirmed apply-to-Workbench flow for a described stack.

### Plausibility And Research

Current routes:

```text
POST /api/report-assistant/plausibility
POST /api/report-assistant/assembly-alternatives
POST /api/report-assistant/findings
```

Current behavior:

- context-only plausibility is available by default;
- external research can be enabled by configured provider settings;
- source URLs are sanitized to `http`/`https`;
- research answers are advisory and non-mutating;
- suggested report patches, when present, must pass the shared patch validator;
- findings queue writes require explicit confirmation.

Strong guardrails:

- research does not become calculator calibration;
- provider-returned values are normalized into local review structures;
- findings records copy current context/trace values instead of trusting
  arbitrary client-provided metric values.

Current limitation:

- research quality is not yet evaluated by a stable offline benchmark;
- source quality and comparability remain partly provider-shaped;
- live source smoke can be inherently flaky unless invariant-only.

### Runtime Status

Current route:

```text
GET /api/report-assistant/status
```

Current behavior:

- reports model/research provider configuration;
- redacts secrets and strips endpoint query strings;
- lists read-only/proposal-only tool definitions;
- returns `mutatingToolsExposed: false`.

This is a good deployment-readiness primitive. It should become part of the
normal preflight gate for enabling live providers.

## Best-Practice Scorecard

Scores are relative to a production assistant embedded in a technical
calculation/reporting product.

| Area | Score | Current posture |
| --- | ---: | --- |
| Product boundary | 8/10 | Clear assistant role: report helper, preview/query/research, not calculator owner. |
| Mutation safety | 8/10 | Strong preview/validation posture; direct write tools are not exposed. Apply logic still needs more centralized stale guards. |
| Structured output | 6/10 | Local TypeScript contracts and validators are good. Provider-level schema enforcement is inconsistent and model JSON parsing is still permissive. |
| Tool design | 6/10 | Local tools are well scoped and `mutates:false`; there is no real host-managed tool-calling loop yet. |
| Context management | 6/10 | Summary-first context is strong. Payload budget/token budget discipline is not yet formalized. |
| Retrieval and grounding | 5/10 | Research exists and sources are sanitized. Quality, comparability, citation durability, and offline evals are incomplete. |
| Reliability | 7/10 | Client request wrapper has timeout/retry metadata, and report editor query/action/patch paths now use lifecycle guards. Cross-surface policy and telemetry are still incomplete. |
| Security | 6/10 | Auth and validation exist. Missing explicit rate limits, request-size caps at route edges, prompt-injection handling taxonomy, and audit telemetry. |
| UX | 6/10 | Calculator preview is now structured in the report thread. Other assistant result types still need registered cards and clearer authority labels. |
| Observability | 4/10 | Runtime status exists. No durable assistant trace log, latency/cost/error metrics, or eval dashboard. |
| Test coverage | 7/10 | Many focused unit/route tests exist. End-to-end, adversarial, and regression eval coverage is still thin. |
| Provider portability | 5/10 | There is a provider seam, but current live path is Gemini-proxy shaped and non-streaming. |

Overall: the assistant is a safe and useful prototype-plus foundation, not yet a
fully productized assistant platform.

## Strong Design Choices To Preserve

### 1. The Model Is Not The Mutator

The strongest architectural choice is that the model returns proposals, not
state changes. `ReportAssistantPatch` and action proposals are application data.
The application validates and applies them.

This aligns with LLM best practice: model output should be treated as untrusted
input and checked before it affects state.

Preserve this invariant.

### 2. Patch Contract Is Narrow

The model-facing patch contract only exposes report edits:

- metric adjustment;
- metric display value setting;
- bounded report note append.

The broader `replace_report_text_value` operation exists but is not exposed
directly in the model system instruction. That reduces unsafe rewrites.

Preserve this separation.

### 3. Calculator Truth Is Not Delegated To The Assistant

The assistant can explain, preview, and review, but it does not become a source
row importer, formula retuner, or metric aliasing path. That is critical for
DynEcho because the product's value depends on calculator integrity.

Preserve this invariant.

### 4. Summary-First Project Reads

Default project context and query reads use bounded summaries. Full documents
and snapshots require explicit ids. This is the right direction for both safety
and token control.

Preserve this pattern and add explicit size budgets.

### 5. Runtime Status Does Not Leak Secrets

The status route summarizes endpoints by origin/path and reports whether keys
are configured without exposing key values. This is the right operational
shape.

Keep it in any future provider expansion.

## High-Priority Findings

### Finding A1 - Lifecycle Guard Coverage Is Now Landed For Report Editor

Original issue:

- report editor query/action/patch requests could write delayed results after the
  assistant context changed.

Current status:

- `report-editor.tsx` now uses `createReportAssistantActiveRequestRegistry`,
  `startReportAssistantRequest`, `isReportAssistantRequestResultActive`, and
  `finishReportAssistantRequest`;
- query, action proposal, and patch proposal requests pass a request id through
  `sendReportAssistantRequest`;
- stale results are ignored before UI state is updated.

Remaining risk:

- stale policy is now declared in the registry, but lifecycle enforcement is not
  yet generated from it;
- future assistant surfaces can forget to use the helpers unless a capability
  contract test enforces it.

Next action:

- have the result-card/apply layer consume registry `stalePolicy`, then add a
  `requiresLifecycleGuard` or equivalent enforcement check for route-backed
  assistant cards.

### Finding A2 - Calculator Preview Structured Data Is Now Landed

Original issue:

- query-route calculator preview results were flattened to text.

Current status:

- `ReportAssistantQuerySuccess` can include `calculatorPreview`;
- `/api/report-assistant/query` serializes the structured payload;
- `report-editor.tsx` defensively validates the payload and stores it on
  assistant messages;
- `AssistantCalculatorPreviewBlock` renders parsed layers, summary counts,
  route information, tasks, and output rows.

Remaining risk:

- calculator preview is the only fully structured result card;
- patch/action/research/finding/query-answer cards are still not registered in a
  common renderer contract.

Next action:

- land `report_assistant_result_card_contract_v1` after the registry slice.

### Finding A3 - Bounded Calculator Preview Intent Is Now Landed

Original issue:

- imperative calculator commands could route to patch proposal mode.

Current status:

- `classifyReportAssistantEditorRequest` now routes instructions with explicit
  `mm` thickness plus calculator/metric/layer intent to `read_only_query`;
- mutation intent still takes precedence;
- tests cover English/Turkish calculator-preview wording.

Remaining risk:

- routing is still regex and route-specific;
- the app has both `report-assistant-editor-workflow.ts` and
  `report-assistant-intent.ts`, plus query-specific detectors.

Next action:

- introduce one planner decision type with `targetCapability`,
  `requiresClarification`, and `confidence`.

### Finding A4 - Query Route Preflight Is Now Stabilized

Original issue:

- the first query-route preflight run had an auth-test timeout and an auth vs
  mutation-intent ordering mismatch.

Current status:

- query route tests were updated to avoid cold dynamic import timeout and to set
  auth state explicitly;
- targeted assistant verification now passes `8` files / `48` tests for the
  calculator-preview productization suite.

Remaining risk:

- full web typecheck still fails on unrelated existing fixture/type debt;
- route auth/order behavior is now documented in the registry, but route tests
  do not yet assert every route's auth behavior from that registry.

Next action:

- add route-status/auth contract tests that compare actual route behavior with
  registry `authPolicy` and keep semantic mutation rejection impossible to
  confuse with storage mutation.

### Finding A5 - Provider Output Is Parsed Permissively

The model path asks for JSON, and Gemini proxy requests set
`responseMimeType: "application/json"`, but the parser still accepts:

- direct JSON;
- fenced JSON text;
- nested `patch`, `result`, or `data`;
- OpenAI-style text content;
- Gemini candidate text.

This is practical for provider compatibility, but weaker than strict
schema-constrained output.

Impact:

- model/provider drift can remain hidden until validation fails;
- malformed responses are harder to debug;
- prompt-injection strings inside provider output may be parsed from text
  wrappers if they happen to contain JSON.

Severity: medium-high.

Recommended fix:

- add provider adapters with explicit response contracts;
- prefer native structured output/schema where available;
- keep the local validator as the final authority;
- log provider contract failures separately from patch validation failures.

### Finding A6 - Tool Registry Is Not A Real Tool Runtime

`REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS`, project read tools, preset reads, and
calculator preview tools are useful local contracts. But the assistant does not
yet have a host-managed tool execution loop where the model requests a tool,
the host validates it, executes it, returns a bounded observation, and records
the trace.

This is currently intentional and safer. But it limits assistant capability.

Impact:

- the assistant cannot dynamically inspect a project beyond deterministic query
  rules;
- multi-step support remains hand-coded per route;
- "tool" language in docs can overstate current capability.

Severity: medium.

Recommended fix:

- keep direct write tools parked;
- design a read-only tool loop first;
- tool calls must be host-selected/validated against allowlists, ids, budgets,
  and `mutates:false`;
- every tool observation must be bounded and included in a structured trace.

### Finding A7 - Route Edge Hardening Is Incomplete

Routes call `request.json()` directly and then parse payloads. There is no
obvious per-route request body size cap, rate limit, abuse budget, or
conversation/provider quota layer at the assistant route boundary.

Impact:

- large payloads can stress server memory or model prompt size;
- repeated assistant calls can increase cost or cause provider throttling;
- model-denial-of-service scenarios are not explicitly controlled.

Severity: medium.

Recommended fix:

- add assistant-specific request size limits;
- add per-session/user rate limits or soft cooldowns for model/research calls;
- add context summary item caps as constants beside parser code;
- surface user-friendly "too much context" errors instead of silently truncating
  critical data.

### Finding A8 - Observability Is Below Production Bar

The request client records request ids, attempts, durations, and timeout status,
but this is mostly client-local. Runtime status exists, but there is no durable
assistant event trail for:

- provider latency;
- provider error class;
- route decisions;
- classifier decisions;
- tool reads used;
- patch validation rejection reasons over time;
- action proposal confirmations;
- finding queue writes;
- research source counts and source-quality outcomes.

Impact:

- hard to diagnose production assistant failures;
- hard to compare deterministic vs model behavior;
- hard to know whether users trust/apply/reject assistant output.

Severity: medium.

Recommended fix:

- add a redacted assistant event log or structured server telemetry hook;
- include request id, route, mode, source, model provider, duration, result code,
  validation status, read count, and no secrets/full report bodies;
- use the same ids in browser messages and server logs.

### Finding A9 - Eval Coverage Is Mostly Unit/Contract Tests, Not Assistant Evals

There are many valuable unit and route tests. They test parsers, patch
validation, runtime status, project tools, model request/response parsing, and
route behavior.

Missing eval families:

- golden conversation transcripts;
- adversarial prompt-injection fixtures;
- stale-result browser flows;
- provider malformed-output corpus;
- source research quality/citation corpus;
- Turkish/English mixed intent classification corpus;
- user workflow acceptance tests for query/action/patch/calculator preview.

Impact:

- regressions in "assistant feels competent" behavior can pass unit tests;
- model provider changes are hard to evaluate;
- intent routing changes are risky.

Severity: medium.

Recommended fix:

- create `docs/ui/REPORT_ASSISTANT_EVAL_PLAN_2026-06-17.md` or add an eval
  section to this review after the first implementation pass;
- add a small fixture-based eval suite before expanding tool loops.

### Finding A10 - Prompt Injection Is Mitigated By Boundaries, Not Explicitly Modeled

The assistant has good structural mitigations:

- no direct model mutation;
- validator owns patch application;
- tools are read/preview-only;
- provider output is parsed and normalized.

But prompt injection is not explicitly modeled across all untrusted inputs:

- user instructions;
- report document text;
- project/report names;
- saved report bodies;
- research source snippets;
- provider-returned text;
- preset names/descriptions.

Impact:

- a malicious saved report or source snippet could try to steer model behavior;
- current narrow validators reduce damage, but future tool loops could increase
  exposure.

Severity: medium.

Recommended fix:

- label untrusted content in provider prompts;
- keep tool/action authority out of model-visible prose;
- never allow model output to choose write targets without app validation;
- add prompt-injection fixtures to evals.

### Finding A11 - Conversation State Is Fragmented

The proposal/configure assistant has bounded localStorage conversation support.
The Workbench V2 report editor has local in-memory `AssistantMessage` state.
These surfaces are not unified.

Impact:

- recovery differs by surface;
- user-visible assistant history can disappear or behave differently;
- product analytics cannot compare flows easily.

Severity: medium-low.

Recommended fix:

- define whether report editor assistant messages should be ephemeral or
  locally persisted;
- if persisted, keep the same bounded/sanitized rules and never save full
  conversation state into project/preset records by default.

### Finding A12 - Assistant UX Does Not Yet Explain Its Own Authority

The architecture has good authority boundaries, but the user interface does not
always make them visible.

Examples:

- query answers are plain text;
- calculator previews do not carry structured preview posture through the editor;
- action proposals and patch proposals can look similar to ordinary assistant
  messages;
- the user must infer when something is only a draft change versus a saved
  project revision.

Impact:

- users may over-trust preview output as saved state;
- users may under-use useful capabilities because they are hidden behind text;
- report assistant can feel less capable than it is.

Severity: medium.

Recommended fix:

- render typed assistant cards:
  - answer;
  - calculator preview;
  - patch proposal;
  - action proposal;
  - research result;
  - finding log;
- each card should show whether it mutates, whether confirmation is required,
  and what object would change.

## Security And Safety Review Against OWASP LLM Risks

### Prompt Injection

Current posture:

- reasonably contained by non-mutating model output and validators;
- not yet explicitly documented per input class.

Needed:

- untrusted-content prompt sections;
- prompt-injection tests;
- hard separation between instructions, retrieved data, and tool policy.

### Insecure Output Handling

Current posture:

- strong for report patches because validation gates every patch;
- weaker for plain text query/research answers because structured evidence is
  less visible.

Needed:

- structured answer payloads for high-stakes preview/research results;
- UI should not treat raw model text as authoritative calculation output.

### Model Denial Of Service

Current posture:

- client request timeouts/retries exist;
- provider timeouts exist;
- route body/context-size controls are not explicit enough.

Needed:

- request body caps;
- context item caps;
- rate limits or quotas.

### Excessive Agency

Current posture:

- good. Direct write tools are not exposed and `mutatingToolsExposed` is false.

Needed:

- preserve this until read-only tool loops and action proposals are fully proven.

### Sensitive Information Disclosure

Current posture:

- status route redacts secrets;
- context intentionally sends compact report/project data.

Needed:

- classify what data is sent to external model/research providers;
- add redaction rules for client names, project metadata, and report text if
  external provider mode is used beyond local/private deployments.

## Recommended Assistant Roadmap

### Phase 1 - Productize Existing Preview/Query Paths

Status: landed locally.

Delivered:

- classifier support for bounded calculator-preview commands;
- structured `calculatorPreview` query payload;
- report editor lifecycle guard wiring;
- calculator preview message state;
- structured calculator preview UI;
- parser hardening for common wall descriptions.

Remaining follow-up:

- move this one-off structured calculator card into a general assistant result
  card contract.

### Phase 2 - Capability Registry Core

Status: registry core landed locally.

Delivered:

- one registry for assistant routes, local tools, action proposals, renderers,
  stale policies, auth policies, and provider policies;
- runtime status derived from the registry;
- registry tests that fail on orphan routes, missing capability metadata, source
  definition drift, and mutating model-exposed tools.

Remaining follow-up:

- route response envelopes and renderer selection should consume the registry;
- one planner decision shape should route query/action/patch/calculator/research/
  finding requests through registry `targetCapability`.

### Phase 3 - Result Card UX Contract

Deliver:

- typed cards for query answer, calculator preview, patch proposal, action
  proposal, research review, project read summary, finding log, and error
  states;
- visible `previewOnly`, `mutates`, `requiresConfirmation`, target object, and
  evidence/source indicators on every card;
- consistent pending/timeout/retry/error UI states.

### Phase 4 - Layer-Stack Draft And Calculator Use

Deliver:

- `AssistantLayerStackDraft` for parsed user-described stacks;
- multi-turn clarification for unknown material, ambiguous material, missing
  thickness, missing topology, and missing physical inputs;
- calculator preview for every ready draft;
- candidate comparison without mutating Workbench;
- explicit follow-up plan for apply-to-Workbench confirmation.

### Phase 5 - Structured Provider Contracts

Deliver:

- provider adapter interfaces for patch, research, and future query models;
- strict schema/structured-output mode where provider supports it;
- separate "provider response parse failed" vs "local validation rejected"
  telemetry;
- compatibility tests for each adapter.

### Phase 6 - Eval And Observability Layer

Deliver:

- redacted assistant event log;
- golden assistant task fixtures;
- adversarial prompt-injection fixtures;
- malformed provider response corpus;
- source research quality/citation fixtures;
- simple dashboard or JSON summary for assistant eval runs.

### Phase 7 - Read-Only Tool Loop V1

Only after phases 1-6, consider a host-managed read-only tool loop.

Rules:

- no write tools;
- model can request only allowlisted read tools;
- host validates ids, budgets, and allowed actions;
- every tool result is bounded;
- every step is recorded in a trace;
- user sees what reads were used.

### Phase 8 - Preview-Only Action Apply Unification

Deliver:

- central assistant action apply helpers or route handlers;
- mandatory stale guards for existing report writes;
- one apply path per action type;
- consistent success/failure/audit messages.

Still avoid direct autonomous writes.

### Phase 9 - Direct Write Tools Reconsideration

Direct write-capable assistant tools should remain parked until:

- read-only tool loop is stable;
- action proposals are stable;
- evals and telemetry exist;
- stale guards are mandatory;
- UX clearly distinguishes preview, draft mutation, and saved mutation.

Even then, delete/archive/export tools should require a separate design review.

## Recommended Next Implementation Slice

The best next assistant slice is:

```text
report_assistant_route_envelope_adapters_v1
```

Reason:

- calculator preview productization already landed;
- the central capability registry core now landed;
- the result envelope contract core now landed;
- assistant capability is now spread across enough routes that result rendering,
  route payload wrapping, and confirmation labels are the next drift risk;
- route envelope adapters are prerequisite for registry-driven cards, safe
  layer-stack drafting, research routing, planner decisions, and future
  apply-to-Workbench actions;
- it does not require calculator runtime changes;
- it keeps direct write tools parked.

Use the active high-accuracy copilot plan as the implementation plan. Keep
`docs/ui/REPORT_ASSISTANT_CALCULATOR_PREVIEW_PRODUCTIZATION_PLAN_2026-06-17.md`
as historical evidence for the landed calculator-preview slice.

For actual execution order, use
`docs/ui/REPORT_ASSISTANT_HIGH_ACCURACY_COPILOT_IMPLEMENTATION_PLAN_2026-06-18.md`.

## Non-Goals For The Next Slice

Do not implement these yet:

- autonomous project/report/preset write tools;
- model-selected arbitrary tool execution;
- full-project JSON context in every assistant call;
- floor/tavan parser guesses for missing physical inputs;
- assistant-sourced calculator formula retuning;
- source research becoming exact source row import;
- project-persisted assistant chat history;
- PDF/DOCX export redesign.

## Suggested Validation Commands

Baseline assistant contracts:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-action-proposal.test.ts \
  features/workbench/report-assistant-assembly-alternatives.test.ts \
  features/workbench/report-assistant-capabilities.test.ts \
  features/workbench/report-assistant-context.test.ts \
  features/workbench/report-assistant-conversation-storage.test.ts \
  features/workbench/report-assistant-finding.test.ts \
  features/workbench/report-assistant-instruction.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench/report-assistant-model.test.ts \
  features/workbench/report-assistant-patch.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-project-tools.test.ts \
  features/workbench/report-assistant-project-read-route.test.ts \
  features/workbench/report-assistant-project-workspace.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts \
  features/workbench/report-assistant-request-client.test.ts \
  features/workbench/report-assistant-request-lifecycle.test.ts \
  features/workbench/report-assistant-tools.test.ts \
  features/workbench/report-assistant-trace-explanation.test.ts \
  --maxWorkers=1
```

Calculator preview/query productization contracts:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-editor-workflow.test.ts \
  features/workbench/report-assistant-query-route.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1
```

Provider/status smoke where environment supports it:

```bash
pnpm smoke:report-assistant:preflight
pnpm smoke:report-assistant:failure
pnpm smoke:report-assistant
```

Use live smoke only for invariant checks. Do not make exact source text or live
web-source counts a brittle gate.

## Current Local Verification - 2026-06-17

Document-only check:

```bash
git diff --check -- docs/ui/REPORT_ASSISTANT_CAPABILITY_AND_BEST_PRACTICES_REVIEW_2026-06-17.md
```

Result: passed.

Focused assistant verification:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-capabilities.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  features/workbench/report-assistant-editor-workflow.test.ts \
  features/workbench/report-assistant-request-lifecycle.test.ts \
  features/workbench/report-assistant-query-route.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts \
  --maxWorkers=1
```

Result:

- passed: `9` files / `54` tests.

Broad assistant checkpoint verification:

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

Result:

- first run exposed stale `report-assistant-action-proposal.test.ts` route
  harness behavior: the configured-auth guard test timed out on cold dynamic
  route import and left auth state stale for the next test;
- the test harness was stabilized with a top-level action-proposal route import
  and per-test preview auth reset, matching the already-stabilized query-route
  test pattern;
- rerun passed: `26` files / `194` tests.

Touched-file lint:

```bash
pnpm --filter @dynecho/web exec eslint \
  features/workbench/report-assistant-action-proposal.test.ts \
  features/workbench/report-assistant-capabilities.ts \
  features/workbench/report-assistant-capabilities.test.ts \
  features/workbench/report-assistant-runtime-status.ts \
  features/workbench/report-assistant-runtime-status.test.ts
```

Result: passed.

Full web typecheck note:

```bash
pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json
```

At this checkpoint the command still fails on existing unrelated fixture/type
debt, not on the assistant calculator-preview slice:

- `features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts`
  references `exactImpactSource`;
- several `post-v1-floor-*` fixture tests pass strings where `PresetId` is
  expected;
- `features/workbench/post-v1-floor-field-a-weighted-surface-gate-ac.test.ts`
  expects `BaseOutputCardModel` posture fields that are not present in that
  fixture shape;
- `features/workbench/report-assistant-patch.test.ts` has a citation fixture
  missing `tone`.

## Final Assessment

The report assistant is directionally well designed for a high-integrity
calculator product. Its most important quality is that it is not over-agentic:
it proposes, previews, explains, and researches while the application owns
validation and mutation.

The next improvement is not "make it more autonomous". The next improvement is
"make the existing safe capabilities contract-driven": a capability registry,
typed cards for every result class, stack-draft clarification, consistent
apply/stale policy, and observable/evaluable provider behavior.

Once those are in place, DynEcho can safely move toward a host-managed,
read-only tool loop. Direct write tools should remain out of scope until that
foundation is proven.
