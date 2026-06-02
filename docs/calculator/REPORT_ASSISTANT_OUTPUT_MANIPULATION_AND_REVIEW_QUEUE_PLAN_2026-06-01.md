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
- The source-research scope is now explicitly broader than a yes/no
  plausibility check. When the user asks for it, the assistant should
  research comparable published assemblies for the current layer
  combination and return a source-bounded recommended value or value
  range, confidence, comparability notes, and an optional report-only
  patch that still passes the shared patch validator.
- The plan now documents the source-research provider contract in enough
  detail to implement the feature without guessing: server-side request
  shape, response shape, source quality tiers, UI expectations,
  failure/fallback behavior, and the patch-application boundary.
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

- adding a `system_llm`/Gemini-proxy request adapter and smoke-testing
  a real model deployment. The current provider seam accepts generic
  patch-provider JSON and can parse Gemini-style responses, but it does
  not yet build the Gemini `generateContent` request shape expected by
  `system_llm`'s `/gemini-proxy` endpoint;
- enabling and smoke-testing a real source research provider by setting
  `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT`;
- wiring the MCP-compatible adapter into a deployed MCP server if this
  project later adds MCP server infrastructure.
- verifying private network reachability between the `akustikhesap`
  app container and `system_llm` without exposing `system_llm` publicly.

## Objective

Add a narrow report assistant that can help the user manipulate proposal
and PDF/DOCX output values without changing the calculator result.

This assistant is allowed to manipulate the report document. It is not
read-only from the user's point of view. The important boundary is that
the model/orchestrator only proposes a validated `ReportAssistantPatch`;
the Akustikhesap app applies that patch to the current
`editableDocument` after local validation and user confirmation. The
calculator engine, scenario result, candidate selection, and stored
runtime outputs remain unchanged.

The assistant should support three user-requested jobs:

1. report-output manipulation: reduce, increase, or replace displayed
   `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, `L'nT,w`, and related report
   values for the current export only;
2. source-bounded value recommendation: research or reason about whether
   a reported acoustic value is plausible for the current construction,
   find comparable published assemblies when web/source research is
   requested, and recommend a report value or value range with sources,
   assumptions, and confidence;
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

## System.Machinity-Inspired Connection Decision

`system.machinity.ai` uses a broader chat stack:

1. the web client connects to `chatd-rs`;
2. `chatd-rs` calls `system_llm` through a Gemini-compatible proxy;
3. `chatd-rs` exposes MCP tool declarations to the model;
4. MCP tools execute deterministic app/server actions;
5. tool outputs return to the assistant for the final answer.

Akustikhesap should not copy that whole stack for the report assistant.
The report workflow does not need long-lived chat sessions, six-agent
routing, memory/RAG, project-wide MCP tools, WhatsApp, or handover
protocols. Copying those pieces would add operational risk without
improving the report manipulation job.

The useful pieces to borrow are narrower:

- **proxy-owned model access**: use the same `system_llm` provider
  boundary instead of putting provider-specific keys into the browser;
- **strict tool authority**: the model can ask for context and propose
  patches, but deterministic Akustikhesap code owns validation and
  mutation;
- **typed contracts**: every model response must parse into a narrow
  schema, never into arbitrary report text;
- **visible tool/result lifecycle**: the UI should show what patch was
  proposed, what changed, which warnings apply, and whether the provider
  fell back to deterministic parsing;
- **runtime status**: an authenticated status route should show provider
  configuration without exposing secrets.

Target live model connection:

```text
proposal configure UI
  -> /api/report-assistant/patch
    -> ReportAssistantContext + user instruction
    -> system_llm Gemini-proxy adapter
    -> ReportAssistantPatch JSON
    -> shared patch validator
  -> preview/confirmation UI
  -> apply validated patch to editableDocument
  -> export current editableDocument as PDF/DOCX
```

The phrase "read-only/proposal-only tools" means model-callable tools do
not directly mutate state. It does not mean the product assistant cannot
change the report. The report mutation happens one layer later, inside
the Akustikhesap app, after the patch passes validation.

## Live Model Adapter Requirements

The current generic provider seam posts a custom JSON envelope to
`DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT`. That is suitable for a small
dedicated patch-provider service. It is not enough for directly calling
`system_llm`'s `/gemini-proxy`, because `system_llm` expects a
Gemini-compatible `generateContent` request path and body.

Add a provider mode for `system_llm`:

```env
DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER=system_llm_gemini_proxy
DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT=http://system_llm:4000/gemini-proxy
DYNECHO_REPORT_ASSISTANT_MODEL=gemini-3-flash-preview
DYNECHO_REPORT_ASSISTANT_MODEL_TIMEOUT_MS=12000
DYNECHO_REPORT_ASSISTANT_MODEL_API_KEY=
DYNECHO_REPORT_ASSISTANT_LLM_SHARED_SECRET=
```

Expected adapter behavior:

- build a request to
  `/gemini-proxy/v1beta/models/{model}:generateContent`;
- send a system instruction that says the only valid output is
  `ReportAssistantPatch` JSON;
- include the compact `ReportAssistantContext`, current document
  signature, user instruction, patch schema, and validator rules;
- use low-temperature generation and JSON-biased response settings when
  the proxy/provider supports them;
- parse `candidates[].content.parts[].text` and existing JSON wrappers;
- reject non-JSON, full-document rewrites, unknown operations, unknown
  metric ids, stale document signatures, and unsafe values;
- fall back to deterministic parsing only with a visible warning.

Network requirement:

- do not expose `system_llm` through a public Traefik route for this
  integration;
- either attach the Akustikhesap app container to the same private
  Docker network that can resolve `system_llm`, or add a private
  internal bridge service with shared-secret auth;
- `system_llm` currently exempts `/gemini-proxy/*` from its
  `LLM_SHARED_SECRET` middleware, so the production safety boundary for
  this route is private-network reachability plus the proxy's incoming
  key allowlist when configured;
- if the proxy requires an incoming Gemini/OpenRouter-style key, the
  adapter must send it server-side through `x-goog-api-key` and
  `Authorization: Bearer ...`, matching the way `chatd-rs` calls the
  proxy. The runtime status route must report only
  `apiKeyConfigured: true`, never the key value.

## Report Manipulation Capability Target

The assistant must be good at changing the report, not merely explaining
what could be changed. The first high-quality manipulation scope is:

- direct metric changes: "Rw'yi 55 dB yap", "L'nT,w değerini 3 dB
  düşür", "DnT,w 2 dB artır";
- bound-preserving changes: `<= 50 dB` can become `<= 47 dB`, and
  `>= 26 dB` can become `>= 28 dB`;
- signed spectrum terms: `C`, `Ctr`, `CI`, and `CI,50-2500` keep signed
  formatting such as `-2 dB`;
- propagated report edits: primary metric, metric table row, coverage
  row, and known repeated value mentions are detected together;
- source-backed value suggestions: when the user asks the assistant to
  research the layer combination, it can recommend a report-only value
  or bounded range from comparable sources and load a validator-checked
  patch for user approval;
- report notes: the assistant can add bounded notes to assumptions,
  warnings, or recommendations when the user asks for explanatory text;
- restore/undo-style patches: plausibility review may suggest restoring
  a report value back toward the captured engine display value inside
  the validator limits.

Current patch operations cover metric value changes and appended notes.
To make manipulation feel complete, add a second controlled text-edit
operation after the live model adapter is stable:

```ts
type ReplaceReportValueMentionOperation = {
  type: "replace_report_value_mention";
  mentionId: string;
  beforeText: string;
  afterText: string;
  reason: string;
};
```

Rules for this operation:

- `mentionId` must come from deterministic
  `find_report_value_mentions`;
- `beforeText` must exactly match the current document text at that
  location;
- `afterText` must preserve metric/bound semantics and pass the same
  numeric movement checks;
- free-form paragraph rewrite is not allowed in this operation.

This keeps the assistant capable of cleaning stale report sentences
without giving the model full document rewrite authority.

## Implementation Comparison Snapshot

This section compares the current Akustikhesap implementation with the
relevant `system.machinity.ai` assistant implementation. It is intended
to prevent accidental over-building.

| Area | Akustikhesap current implementation | System implementation | Decision for Akustikhesap |
| --- | --- | --- | --- |
| User state | `proposal-adjust-client-page.tsx` owns the current `editableDocument`, builds `ReportAssistantContext`, and applies validated patches in React state. | `ChatProvider` opens a WebSocket session; `chatd-rs` owns session history/scope. | Keep in-app state ownership. The report assistant needs the live report snapshot, not a long-lived chat session. |
| Model endpoint | `report-assistant-model.ts` posts a custom `{ task, context, contract, instruction }` JSON body to `DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT`. | `chatd-rs` posts Gemini `contents`, `systemInstruction`, `tools`, and `generationConfig` to `system_llm/gemini-proxy/v1beta/models/{model}:streamGenerateContent`. | Add a `system_llm_gemini_proxy` provider mode that builds Gemini `generateContent` requests. Do not reuse the custom body for `system_llm`. |
| Streaming | Not needed; `/api/report-assistant/patch` returns one patch result. | Streaming is needed for chat UI deltas and tool loops. | Use non-streaming `:generateContent` for simpler parsing and lower UI risk. |
| Tooling | `report-assistant-tools.ts` has local proposal-only helpers: metric resolution, patch preview, stale mention detection, plausibility review, finding preparation. | `mcp-rs` exposes tools/list and tools/call; `chatd-rs` converts declarations to Gemini `functionDeclarations`. | Do not add a tool loop for MVP. The model returns a patch; local helpers validate and apply. Optional MCP remains a later wrapper. |
| Mutation authority | `applyValidatedReportAssistantPatch` mutates only the proposal document after validation and optional confirmation. | MCP/GraphQL tools mutate app state through server-side auth/write policies. | Keep mutating authority in Akustikhesap app/server only. The model never receives apply/export/save/reset/write capabilities. |
| Validation | `validateReportAssistantPatch` checks schema, metric ids, document signature, stopped outputs, bounds, signed values, and movement limits. | System uses typed schemas, deterministic tool errors, write policies, and tool-result guardrails. | Reuse Akustik validator as the hard boundary. Borrow system's typed-contract discipline, not the whole runtime. |
| Runtime status | `/api/report-assistant/status` reports provider configuration and tool definitions without secrets. | System has service health, stack health, MCP catalog, and live chat verification. | Extend status with provider mode, proxy auth configured flag, endpoint path, and network readiness notes. |
| Network | `akustikhesap_landing` is on `akustikhesap_net` and `machinity_proxy_net`. It does not currently resolve `system_llm`. | `system_llm` is on the system stack's private `kanban_net`, with no public Traefik route. | Add private network reachability deliberately before enabling the live model endpoint. Do not expose `system_llm` publicly. |
| Plausibility/value research | Separate endpoint can do context-only review or call configured research provider. It should be extended to return source-bounded recommended values/ranges for comparable layer combinations. | System can use MCP web/search and memory/RAG tools. | Keep research separate from calculator calibration. Source research may propose a report-only patch, but only the shared validator and user confirmation can apply it. |
| Review logging | Append-only JSONL finding queue, explicit user action. | System has broader DB, memory, issue, document, and automation tools. | Keep JSONL queue for this report-only slice. Do not create system issues or calculator work automatically. |

## Current Akustik Implementation Findings

What is already strong enough:

- `ReportAssistantContext` is compact and built from the current
  proposal document, not from repository or broad project state.
- `documentSignature` gives a stale-context guard before a patch can be
  applied.
- `validateReportAssistantPatch` rejects unknown metric ids, stopped
  outputs, unparseable values, over-10 dB movement, and stale document
  signatures.
- Bound values preserve `<=`/`>=`, signed spectrum terms preserve sign,
  and over-5 dB changes require explicit confirmation.
- The UI distinguishes generated patch, warnings, validation preview,
  confirmation, stale value mentions, plausibility review, and review
  finding logging.
- Applying a patch only changes `editableDocument`; export can use the
  edited document without changing engine values.

What is incomplete:

- the model provider seam is generic and does not yet build a valid
  `system_llm` Gemini-proxy request;
- the model provider settings do not distinguish provider kinds, so the
  same endpoint string currently means "custom patch provider" and
  "Gemini proxy";
- proxy authentication/key handling is too generic for
  `system_llm`'s incoming-key allowlist;
- status output does not expose provider kind or proxy-auth readiness;
- stale literal value mentions are detected but not yet safely
  replaceable by a structured assistant operation;
- there is no production network path from `akustikhesap_landing` to
  `system_llm` yet;
- live model smoke tests are not defined as a repeatable checklist.

## File-Level Gap List

The next implementation should be constrained to these files unless a
test exposes a narrower missing dependency.

### `apps/web/features/workbench/report-assistant-model.ts`

Current role:

- normalizes endpoint/model/timeout;
- posts custom JSON to the configured endpoint;
- extracts `ReportAssistantPatch` from direct JSON, OpenAI-style text,
  and Gemini-style candidate wrappers;
- falls back to deterministic parser when the provider fails.

Required changes:

- add `ReportAssistantModelProvider = "custom_patch_provider" |
  "system_llm_gemini_proxy"`;
- read `DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER`;
- add optional server-side proxy key setting, for example
  `DYNECHO_REPORT_ASSISTANT_MODEL_PROXY_KEY`;
- keep `DYNECHO_REPORT_ASSISTANT_MODEL_API_KEY` as the custom provider
  bearer token, or document it as an alias only if the implementation
  deliberately reuses it;
- build Gemini request URL as
  `{endpoint}/v1beta/models/{urlEncodedModel}:generateContent` when
  provider is `system_llm_gemini_proxy`;
- build Gemini body with `systemInstruction`, single user `contents`
  entry, and `generationConfig`;
- keep temperature low and max output bounded;
- ask for JSON only, but still parse text wrappers defensively because
  some providers ignore JSON MIME hints;
- include `documentSignature` in the requested patch schema and reject
  stale signatures through the existing validator;
- preserve deterministic fallback behavior.

### `apps/web/features/workbench/report-assistant-model.test.ts`

Current role:

- proves deterministic default;
- proves generic endpoint parsing;
- proves provider fallback;
- proves endpoint normalization and response extraction.

Required changes:

- keep the custom-provider test so existing seam behavior does not
  regress;
- add `system_llm_gemini_proxy` request-builder tests that assert:
  endpoint path ends with
  `/gemini-proxy/v1beta/models/gemini-3-flash-preview:generateContent`;
  body contains `systemInstruction`, `contents`, and
  `generationConfig`;
  metric context is compact and includes no full document rewrite;
  proxy key is sent as `x-goog-api-key` and bearer only when configured;
- add failure tests for malformed Gemini candidate text, unknown metric
  id, and timeout fallback.

### `apps/web/features/workbench/report-assistant-runtime-status.ts`

Current role:

- reports whether model/research providers are configured;
- strips endpoint query strings and secrets;
- lists proposal-only tool definitions.

Required changes:

- add `provider` to model provider status;
- add `proxyKeyConfigured` or equivalent boolean;
- keep endpoint reporting limited to `origin` and `pathname`;
- keep `mutatingToolsExposed: false`;
- include a human-readable readiness warning when provider is
  `system_llm_gemini_proxy` but endpoint/model/proxy-key expectations
  are incomplete.

### `apps/web/features/workbench/report-assistant-runtime-status.test.ts`

Required changes:

- assert provider mode is reported;
- assert proxy key is only reported as a boolean;
- assert endpoint query strings remain hidden;
- assert mutating tools remain absent.

### `apps/web/app/api/report-assistant/patch/route.ts`

Current role:

- authenticates;
- parses context/document/instruction;
- calls `createReportAssistantPatchProposal`;
- validates the generated patch before returning it.

Expected changes:

- no architectural change should be needed;
- keep the route as the central validation boundary;
- only adjust response messages if the UI needs clearer source/provider
  wording.

### `apps/web/app/workbench/proposal/configure/proposal-adjust-client-page.tsx`

Current role:

- builds current context;
- calls the assistant patch endpoint;
- renders generated patch, validation preview, warnings,
  confirmation, and apply button;
- applies validated patch to `editableDocument`.

Expected changes:

- no major change for the first live model adapter;
- optionally show provider mode in the generated-patch message if the
  endpoint returns it;
- do not move patch application into the endpoint for MVP.

### `apps/web/features/workbench/report-assistant-patch.ts`

Current role:

- validates and applies metric value changes and appended notes;
- detects stale literal value mentions.

Next controlled expansion:

- add `replace_report_value_mention` only after the live model adapter
  is stable;
- require exact `mentionId`/path and exact `beforeText`;
- do not allow paragraph rewrite or arbitrary path edits.

### `akustikhesap-compose.yml`

Current role:

- runs `akustikhesap_landing` on `akustikhesap_net` and
  `machinity_proxy_net`;
- no report assistant model env is configured.

Required production changes:

- add disabled-by-default model env only when ready;
- connect to the private network that can resolve `system_llm`, or add
  a private bridge service;
- avoid any public Traefik route to `system_llm`;
- verify DNS resolution and HTTP reachability from inside the
  Akustikhesap container before setting the live endpoint.

## System Patterns To Borrow

Borrow these patterns directly:

- typed request/response contracts with strict parsing;
- provider failures become explicit warnings and deterministic fallback,
  never silent success;
- endpoint status shows readiness without exposing secrets;
- tool authority is narrower than user-facing product capability;
- model/provider access stays server-side and private-network scoped;
- all limits and timeouts are constants or env-clamped settings.

Do not borrow these for MVP:

- WebSocket chat session management;
- six-agent routing;
- chat history compression;
- MCP `tools/list` / `tools/call` loop;
- memory/RAG;
- WhatsApp assistant;
- project/document/issue mutation tools;
- public MCP server exposure.

## Live Model Request Contract

For `DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER=system_llm_gemini_proxy`,
the adapter should produce a request equivalent to:

```json
{
  "systemInstruction": {
    "parts": [
      {
        "text": "You are the Akustikhesap report assistant. Return only ReportAssistantPatch JSON. Do not apply, export, save, reset, write files, or rewrite the full report."
      }
    ]
  },
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "{\"task\":\"dynecho.report_assistant.patch_proposal\",\"instruction\":\"...\",\"context\":{...},\"contract\":{...}}"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0,
    "maxOutputTokens": 2048,
    "responseMimeType": "application/json"
  }
}
```

The exact prompt text can be shorter, but the request must include:

- current `documentSignature`;
- compact metric list with ids, labels, status, basis, direction,
  engine/report display values;
- trace summary and layer summary;
- allowed operation names only;
- rejected action list;
- instruction to output one JSON object with `summary`,
  `documentSignature`, and `operations`.

Headers:

- always `content-type: application/json`;
- if a proxy key is configured, send both `x-goog-api-key` and
  `Authorization: Bearer ...` for compatibility with the current
  `system_llm` incoming-key extractor;
- do not place keys in query strings.

Response parsing:

- parse direct JSON patch;
- parse `candidates[0].content.parts[].text`;
- tolerate fenced JSON text;
- reject full-document JSON, markdown-only responses, and arrays;
- return model failure if no patch can be extracted.

## Detailed Implementation Sequence

1. **Provider settings**
   - Add provider enum and env parsing.
   - Keep current behavior as `custom_patch_provider`.
   - Add tests for invalid provider values and timeout clamping.

2. **Gemini request builder**
   - Add pure helper for URL/body/headers so it can be unit-tested
     without network.
   - Use `generateContent`, not streaming.
   - Keep context compact and omit `document` body from the model
     request unless a later test proves the model needs specific report
     prose.

3. **Provider fetch branch**
   - Branch `fetchModelPatch` by provider.
   - Keep errors explicit: HTTP status, timeout, parse failure.
   - Preserve deterministic fallback.

4. **Validation boundary**
   - Keep `validateReportAssistantPatch` after model output.
   - Do not return invalid model patches as applyable UI state.
   - Include validation errors in the response for debugging.

5. **Status and UI messaging**
   - Extend status with provider mode and proxy-key configured boolean.
   - Optionally return provider mode from patch endpoint so the UI can
     say `system_llm` rather than generic `model`.

6. **Network enablement**
   - Inspect current Docker networks.
   - Attach Akustikhesap app to the private network that resolves
     `system_llm`, or create a narrow internal bridge.
   - Test from inside `akustikhesap_landing`:
     `http://system_llm:4000/health` and a small proxy call.

7. **Production env enablement**
   - Add provider/env settings to compose only after adapter tests pass.
   - Rebuild/deploy Akustikhesap only.
   - Do not restart system services unless network changes require it.

8. **Live smoke test**
   - Authenticate to Akustikhesap.
   - Generate a report assistant patch for:
     `Rw 2 dB lower`, `L'nT,w 3 dB lower`, and one ambiguous metric
     phrase.
   - Verify generated source is model/provider when reachable.
   - Verify fallback warning appears when endpoint is intentionally
     disabled in a controlled local test.

9. **Mention replacement expansion**
   - Add controlled `replace_report_value_mention` only after live model
     patching is stable.
   - Keep this separate from adapter deployment to avoid mixing provider
     risk with document-editing risk.

## Risk Register

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Gemini proxy request mismatch | Current Akustik code sends custom JSON, but `system_llm` expects Gemini path/body. | Add provider-specific request builder and unit tests before any compose change. |
| Network overexposure | Exposing `system_llm` publicly would broaden attack surface. | Keep private Docker networking; no Traefik route. |
| Key leakage | Provider keys could leak through status, logs, query strings, or UI warnings. | Use headers only; status shows booleans; strip query strings; avoid logging request headers/body secrets. |
| Model returns prose or full report | LLM may ignore JSON-only instruction. | Parse only patch JSON; reject everything else; deterministic fallback. |
| Model proposes unsafe metric changes | Natural language may confuse `Rw`, `R'w`, `DnT,w`, `Ln,w`, `IIC`, or bounds. | Existing validator remains mandatory; ambiguous references should fail instead of guessing. |
| Stale report state | User edits report after model context was built. | Existing `documentSignature` mismatch rejection. |
| Overbroad text edits | Letting model rewrite paragraphs can corrupt report meaning. | Delay mention replacement; when added, only exact deterministic mention paths may be replaced. |
| System repo dirty state | system project has unrelated uncommitted changes. | Keep system inspection read-only; implement only in Akustikhesap. |

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

## Source-Bounded Value Recommendation

The plausibility/value reviewer should be a separate assistant mode. It
should answer questions such as:

- "Is this `Rw 68 dB` plausible for this wall?"
- "Does `Ln,w 44 dB` look too optimistic for this floor build-up?"
- "Find references for a similar construction and compare."
- "Research this layer combination and recommend a better report value."

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
type ReportAssistantValueRecommendation = {
  status:
    | "recommended"
    | "range_only"
    | "insufficient_sources"
    | "not_comparable";
  recommendedValue?: string;
  recommendedRangeDb?: { min: number; max: number };
  confidence: "low" | "medium" | "high";
  comparability:
    | "direct_match"
    | "similar_assembly"
    | "partial_match"
    | "weak_match"
    | "not_comparable";
  basisNotes: string[];
  sourceIds: string[];
};

type PlausibilityReview = {
  verdict: "plausible" | "suspicious" | "likely_wrong" | "insufficient_context";
  severity: "low" | "medium" | "high";
  metricId: string;
  valueReviewed: string;
  rationale: string[];
  valueRecommendation?: ReportAssistantValueRecommendation;
  suggestedReportPatch?: ReportAssistantPatch;
  sources: PlausibilitySourceSummary[];
};
```

The reviewer may suggest a report patch, but it must not auto-apply one.
The user should approve any value movement.

Source-backed recommendation rules:

- the assistant may recommend a report-only value or value range for the
  current layer combination when it can cite comparable sources;
- the recommendation must state whether the comparison is lab or field,
  airborne or impact, wall or floor/ceiling, ISO or ASTM/NEN/other, and
  whether flanking/direct/transmission assumptions are comparable;
- a single marketing claim or uncited generic blog is not enough for a
  high-confidence recommendation;
- if sources are only partially comparable, return `range_only`,
  `low`/`medium` confidence, and clear basis notes instead of a precise
  replacement value;
- if no comparable sources are found, return `insufficient_context` or
  `insufficient_sources` and do not create a `suggestedReportPatch`;
- if the source-backed recommendation differs by more than the patch
  validator's hard movement limit, record it as a review concern rather
  than loading a patch proposal;
- any patch derived from research must preserve metric/basis semantics
  and pass `validateReportAssistantPatch` exactly like a direct user
  instruction patch.

Source handling rules:

- prefer standards, manufacturer technical sheets, acoustic laboratory
  reports, peer-reviewed papers, building-acoustics textbooks, or
  reputable acoustic engineering references;
- record source URLs, titles, accessed dates, metric/basis, reported
  value, assembly description, and the exact comparison being made;
- keep source summaries compact enough for the UI, but preserve enough
  citation metadata for later review;
- treat web findings as report recommendation evidence, not as automatic
  calculator calibration;
- do not convert a web value into a DynEcho engine answer without a
  later calculator source/owner slice.

## Internet Research Provider Contract

The internet/source research capability should stay server-side. The
browser should not call search providers directly and should not receive
provider API keys. `/api/report-assistant/plausibility` remains the
front-door route; it calls a configured provider only when the user
explicitly requests research.

Current env seam:

```env
DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT=
DYNECHO_REPORT_ASSISTANT_RESEARCH_API_KEY=
DYNECHO_REPORT_ASSISTANT_RESEARCH_MODEL=
DYNECHO_REPORT_ASSISTANT_RESEARCH_TIMEOUT_MS=15000
```

Recommended provider request body:

```ts
type ReportAssistantResearchProviderRequest = {
  task: "dynecho.report_assistant.source_value_recommendation";
  context: {
    createdAtIso: string;
    documentSignature: string;
    layersSummary: string[];
    metric: ReportAssistantMetric;
    reportId?: string;
    traceSummary: ReportAssistantTraceSummary;
    warnings: string[];
  };
  review: ReportAssistantPlausibilityRequest;
  contract: {
    output: "PlausibilityReview JSON only";
    sourcePolicy: {
      preferredSourceTypes: string[];
      rejectedSourceTypes: string[];
      requireHttpUrl: true;
      requireMetricBasis: true;
      requireAssemblyComparison: true;
    };
    patchPolicy: {
      reportOnly: true;
      validateWith: "validateReportAssistantPatch";
      noEngineCalibration: true;
    };
  };
  model?: string;
};
```

Provider response requirements:

- return one `PlausibilityReview` object, not prose and not a full
  rewritten report;
- include `valueRecommendation` only when the provider can explain why
  the sources are comparable to the current layer combination;
- include `suggestedReportPatch` only when the recommended value is a
  specific metric-compatible report value inside the patch movement
  boundary;
- include no patch when the best answer is a broad range, weak match, or
  insufficient source evidence;
- include compact `sources` that the app can sanitize and display.

The current code accepts the minimal source shape:

```ts
type PlausibilitySourceSummary = {
  accessedAtIso?: string;
  note?: string;
  title: string;
  url: string;
};
```

The value-recommendation implementation should extend source metadata in
a backwards-compatible way:

```ts
type PlausibilitySourceSummaryV2 = PlausibilitySourceSummary & {
  assemblySummary?: string;
  basis?: string;
  metric?: string;
  reportedValue?: string;
  sourceType?:
    | "standard"
    | "manufacturer_sheet"
    | "lab_report"
    | "peer_reviewed"
    | "textbook"
    | "engineering_report"
    | "other";
};
```

Search strategy:

- build queries from metric, construction type, major layer materials,
  thickness/mass where available, cavity/insulation details, and
  lab/field basis;
- prefer exact or near-exact assemblies before generic material
  examples;
- do not mix wall and floor/ceiling results unless the review explicitly
  returns `not_comparable` or `weak_match`;
- do not mix airborne and impact metrics as substitutes;
- do not silently convert ASTM/IIC/STC values into ISO `Rw`, `R'w`,
  `DnT,w`, `Ln,w`, `L'n,w`, or `L'nT,w`;
- preserve uncertainty when source assemblies omit critical fields such
  as mass, cavity depth, resilient connection, suspended ceiling, or
  flanking condition.

UI expectations:

- show current report value, engine value when available, recommended
  value/range, confidence, comparability, and source count;
- show source titles/URLs and the short comparison note instead of
  hiding citations behind a generic "researched online" label;
- use a separate "Load suggested patch" action before the existing
  preview/apply flow;
- keep "Apply" disabled until the suggested patch passes local
  validation and any movement confirmation requirement;
- when research falls back to context-only review, show the warning and
  do not pretend an internet-backed recommendation was made.

Failure behavior:

- provider timeout, invalid JSON, missing sources, or unsafe URLs should
  fall back to context-only review with a visible warning;
- provider-proposed patches rejected by `validateReportAssistantPatch`
  should be removed from the response, while the review rationale and
  sources may still be shown;
- no research response should write the JSONL review queue unless the
  user separately confirms "log this finding".

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
  and value-recommendation search;
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

### Phase C2 - System LLM Adapter

Goal: connect the structured endpoint to the same private model-proxy
style used by `system.machinity.ai`, without importing the whole
`chatd-rs`/MCP runtime.

Tasks:

- add an explicit model-provider setting for the `system_llm`
  Gemini-proxy shape;
- build Gemini `generateContent` requests from the existing
  `ReportAssistantContext`, patch schema, user instruction, and
  document signature;
- keep provider secrets server-side only;
- send a server-side proxy key through `x-goog-api-key` and
  `Authorization: Bearer ...` when the `system_llm` proxy allowlist
  requires one;
- parse Gemini candidate text into `ReportAssistantPatch`;
- preserve the existing fallback path when the model is unavailable;
- update `/api/report-assistant/status` so it reports the provider mode,
  endpoint origin/path, model label, timeout, and whether proxy-key auth
  is configured;
- verify that the Akustikhesap production container can reach
  `system_llm` on a private Docker network before enabling the endpoint.

Tests:

- adapter builds the expected Gemini request URL and body;
- Gemini-style successful response becomes a patch and then goes through
  the shared validator;
- Gemini response containing a full rewritten report is rejected;
- Gemini response with unknown metric ids is rejected;
- provider timeout falls back to deterministic parsing with a visible
  warning;
- `/api/report-assistant/status` never exposes API keys, shared
  secrets, or query strings.

### Phase D - Plausibility And Source-Bounded Value Recommendation

Goal: let the assistant research whether a value is reasonable and, when
the evidence is strong enough, suggest a more appropriate report-only
value or value range for the user's layer combination.

Tasks:

- add a dedicated plausibility-review action;
- pass metric, value, layers, route, basis, trace summary, and warnings;
- optionally run web/source lookup when the user asks for research;
- normalize comparable source assemblies into metric, basis,
  construction type, layer summary, lab/field status, and reported
  value;
- return verdict, rationale, sources, comparability, confidence, and
  optional recommended value/range;
- create an optional suggested report patch only when the recommendation
  is source-backed, metric-compatible, within validator movement limits,
  and safe for report-only use;
- require user approval before any suggested patch is applied.

Tests:

- review can return `insufficient_context` without changing the report;
- source-backed review includes URL/title/accessed date metadata;
- weakly comparable sources produce `range_only` or
  `insufficient_sources`, not a precise replacement patch;
- lab/field, airborne/impact, wall/floor, and ISO/ASTM basis mismatches
  are surfaced in `basisNotes`;
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
- When source research is enabled and requested, the assistant can
  research comparable layer combinations and return a cited recommended
  report value or range with comparability and confidence.
- A source-backed recommendation can become a report patch only through
  the same preview, validator, and user-confirmation path as manual
  report edits.
- The user can log a suspicious value with enough trace context for
  later agentic calculator review.

Live model acceptance:

- `DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER=system_llm_gemini_proxy`
  makes `/api/report-assistant/patch` call the private `system_llm`
  Gemini proxy instead of the deterministic parser first.
- The assistant can handle natural Turkish instructions for common
  report edits, including set/increase/decrease phrasing and
  lower-is-better impact metrics.
- Model output never bypasses `validateReportAssistantPatch`.
- The UI clearly distinguishes provider-generated patches,
  deterministic fallback patches, validation failures, and user
  confirmation requirements.
- Production smoke tests prove that the site still returns `200`, the
  health endpoint is OK, and the report assistant status route reports
  the provider without leaking secrets.

Full acceptance:

- Report manipulation, plausibility review, and review logging share the
  same metric ids and trace summary.
- External research is cited, source-bounded, and treated as report
  recommendation evidence only.
- Research cannot silently recalibrate calculator formulas, candidates,
  answer cards, or saved scenario output snapshots.
- Review queue records can be consumed later without re-running the
  browser session.
- Optional MCP tools cannot perform operations unavailable through the
  in-app guardrails.

## Implementation Estimate

This estimate assumes the existing report assistant code remains the
base and the work only connects a better live model provider plus
targeted manipulation improvements.

- System-inspired plan/documentation clarification: under 1 hour.
- `system_llm` Gemini-proxy adapter, unit tests, and status updates:
  2-3 hours.
- Docker/private-network adjustment and production smoke test: 30-60
  minutes if network wiring is straightforward.
- Source-bounded value recommendation over an existing research provider:
  2-4 hours for request contract, source normalization, UI display, and
  tests.
- Real web-search provider build/wiring from scratch: estimate
  separately after choosing the provider, because source access, rate
  limits, and citation quality change the scope.
- First controlled stale-value mention replacement operation: 1-2 hours
  after the model adapter is stable.

Do not estimate or implement a full `chatd-rs`/MCP clone for this
feature. That broader architecture is unnecessary for this report-only
assistant. The target is a strong report manipulator with strict local
validation, not a project-wide multi-agent assistant.

## Validation Strategy

This is not a calculator runtime slice. Do not run broad calculator gate
work because of the plan alone.

Expected validation when implemented:

- targeted unit tests for context extraction and patch validation;
- existing proposal edit tests extended for assistant patch operations;
- API route tests for assistant and review queue routes;
- focused web tests for export-only behavior;
- provider adapter tests for both `custom_patch_provider` and
  `system_llm_gemini_proxy`;
- Gemini request-builder tests for URL, `systemInstruction`,
  `contents`, `generationConfig`, and proxy-key headers;
- model response extraction tests for direct JSON, Gemini
  `candidates[].content.parts[].text`, fenced JSON, malformed JSON, and
  full-document rewrites;
- runtime status tests proving provider mode and proxy-key readiness are
  reported without leaking secrets;
- source-research tests proving citation metadata is sanitized, weak
  comparability cannot produce a precise patch, and recommended values
  still go through patch validation;
- Docker smoke check from inside `akustikhesap_landing` to the private
  `system_llm` endpoint before enabling production env;
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

Mitigation: research produces report-only recommendations, value ranges,
and plausibility findings only; calculator calibration still needs a
later source/owner slice.

Risk: assistant recommends a value from a non-comparable assembly.

Mitigation: require comparability labels, basis notes, metric/basis
checks, source quality tiers, and `range_only`/`insufficient_sources`
when evidence is weak.

Risk: assistant cites sources but hides uncertainty.

Mitigation: every source-backed recommendation must include confidence,
source ids, assumptions/gaps, and whether the result is lab/field,
airborne/impact, and wall/floor comparable.

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
- Which source domains/providers are allowed/preferred for source
  research and whether a dedicated search API, `system_llm`-backed tool,
  or later MCP web-search wrapper should own internet lookup.
- Minimum evidence threshold for a precise recommended value versus a
  range-only recommendation.
- How the exported report should display source-backed overrides:
  visible recommendation note, source appendix, or internal audit only.
- Whether optional MCP should be implemented at all before the in-app
  assistant has real usage feedback.
- Whether `system_llm` proxy allowlist should be mandatory for
  Akustikhesap even though the route stays private-network only.
- Whether controlled stale-value mention replacement should ship in the
  same release as the live model adapter or in the next release.

## Recommended Current Slice

Phase A through the first structured endpoint are already partially
implemented. The next slice should be Phase C2 only:

Reason:

- add the `system_llm_gemini_proxy` adapter behind an explicit env flag;
- keep deterministic fallback active;
- keep patch validation and user confirmation unchanged;
- add provider/status tests before any compose change;
- wire private Docker reachability only after adapter tests pass;
- smoke-test live model patch generation on production without touching
  calculator engine behavior.

After that is stable, add controlled stale-value mention replacement.
In parallel or immediately after the model adapter, extend Phase D from
context-only plausibility to source-bounded value recommendation if a
research provider is available. Only then revisit optional MCP exposure,
and only if there is a concrete external-agent workflow that in-app
assistant endpoints cannot satisfy.
