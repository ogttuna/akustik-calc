# Report Assistant Output Manipulation And Review Queue Plan

Status: IN PROGRESS USER-REQUESTED PRODUCT ADJUNCT

Opened: 2026-06-01

This plan is intentionally separated from the active post-V1 calculator
scope/accuracy gate chain. It does not select a new calculator slice and
must not change acoustic formulas, candidate selection, runtime values,
`needs_input` boundaries, or `unsupported` boundaries.

Workspace note: production commands and machine-specific paths later in
this document are historical Akustikhesap deployment evidence, not
instructions for this repository. Do not use them for calculator work or
as current workspace commands.

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
  context-only review and can load a context-only restore patch only
  when the shared patch validator accepts it. This restore convenience
  must not be reused for internet/source research answers.
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
  either `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT` is configured or a
  compatible `system_llm_gemini_proxy` model provider can be reused, the
  route sends only the selected metric, compact report context, trace
  summary, layer summary, and review contract to the provider. Returned
  reviews are sanitized so metric/value fields remain owned by the local
  `ReportAssistantContext`; source metadata must be `http`/`https`. For
  internet/source research, returned patches are suppressed and the
  answer stays non-mutating; any later patch must come from a separate
  explicit edit instruction and the shared patch validator.
- The proposal configure assistant panel now has an explicit "Use
  configured source research" control. If research is requested but no
  provider can be resolved, or if the provider fails, the endpoint
  returns a context-only review with a visible warning instead of
  blocking report work or touching calculator state.
- The source-research scope is now explicitly broader than a yes/no
  plausibility check. When the user asks for it, the assistant should
  research comparable published assemblies for the current layer
  combination and return a source-bounded recommended value or value
  range, confidence, comparability notes, and non-mutating advice. It
  must not preload an applyable patch from a research answer.
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

2026-06-03:

- The live patch provider binding is now implemented for Akustikhesap.
  `report-assistant-model.ts` supports explicit provider mode
  `system_llm_gemini_proxy`, builds a Gemini `generateContent` request
  for `system_llm`'s `/gemini-proxy` route, sends the optional
  server-side proxy key as `x-goog-api-key` and `Authorization: Bearer`,
  and still accepts only a `ReportAssistantPatch` that passes the shared
  validator.
- The production Akustik compose now configures
  `DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER=system_llm_gemini_proxy`,
  points the model endpoint at
  `http://system_llm:4000/gemini-proxy`, sets
  `DYNECHO_REPORT_ASSISTANT_MODEL=gemini-3-flash-preview`, and attaches
  only the Akustik app container to the external private
  `system_kanban_net`. `system_llm` remains unexposed publicly and the
  system projects remain read-only for this slice.
- Targeted model/status tests and a live patch smoke test have validated
  the patch-generation path. The proposal configure UI now shows the
  assistant/model response and whether the proposed patch was generated,
  rejected, or applied, so a rejected proposal is not confused with an
  already-applied local edit.
- The current live feature is still a guarded report assistant, not a
  general chat assistant. It can propose report-only value edits through
  the configured model provider and the production API path can return a
  grounded research answer with sources. The first browser-level
  real-proposal verification is complete; broader route-family coverage
  is still open.
- A dedicated `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT` is still not
  configured, but the current local implementation can implicitly reuse
  the configured `system_llm_gemini_proxy` model settings as
  `system_llm_gemini_grounded_research`. A live no-mutation API smoke
  now proves that Google Search grounding and sanitized source records
  can survive the private proxy for a smoke payload. Real proposal UI
  display, source quality, and assembly comparability are still separate
  open checks.
- Follow-up implementation has started for single-input research intent.
  The proposal configure assistant input now routes research-style
  instructions such as "araştırır mısın, Rw mantıklı mı?" to the
  plausibility/research endpoint, while direct edit instructions still
  route to the guarded patch endpoint.
- Grounded research can now reuse the existing
  `system_llm_gemini_proxy` model settings as
  `system_llm_gemini_grounded_research`. The request uses Gemini
  `generateContent` with `tools: [{ "googleSearch": {} }]` and
  extracts sanitized `groundingMetadata.groundingChunks` sources when
  they are returned by the proxy.
- Research-intent responses now force `suggestPatch: false` and suppress
  provider-returned `suggestedReportPatch`. Research may return
  `recommendedActionText`, sources, verdict, and confidence rationale,
  but any report edit still requires a separate explicit user
  instruction and the existing patch preview/apply flow.
- Local follow-up work has added a first natural-answer surface for the
  assistant research path. `PlausibilityReview` can now carry
  `answerText`; provider responses may populate it from `answerText`,
  `answer`, `summary`, `response`, or similar text fields; context-only
  review also produces a concise readable answer. The proposal configure
  assistant response now preserves line breaks and shows answer text,
  recommendation text, reasoning, source titles/URLs, and source notes in
  the same conversation area where the user asked the question. This is
  intended to make the assistant usable as a report-review conversation,
  not only as a patch form.
- Targeted assistant tests are green for the local answer-surface work:
  `pnpm exec vitest run features/workbench/report-assistant-*.test.ts --maxWorkers=1`
  passed `9` files and `55` tests. Targeted lint for the changed
  assistant files also passed. Full `@dynecho/web typecheck` still stops
  on pre-existing, assistant-unrelated test typing errors in other
  workbench files and should be tracked separately from this assistant
  slice.
- Second implementation audit on 2026-06-03 compared this plan against
  the code before trace/explain landed. This finding is retained as
  historical context and is superseded by the third audit below. At that
  point the plan had three hard findings:
  `proposal-adjust-client-page.tsx` builds `ReportAssistantContext`
  from the stored proposal document without passing an
  `AssemblyCalculation`, so detailed engine provenance was not available
  in the configure page yet; the pre-third-audit intent router did not
  yet have a first-class non-mutating `explain` branch, so "hangi
  lane/formül seçildi" was forced through metric research; and
  `report-assistant-plausibility-research.ts` still
  normalizes provider output into the minimal `PlausibilityReview` shape,
  so source quality, comparability, confidence bands, and recommended
  ranges are not durable structured fields yet.
- Third implementation audit on 2026-06-03 updated the plan after the
  trace/explain implementation landed locally. `assistantTraceSnapshot`
  now exists on `SimpleWorkbenchProposalDocument`, survives proposal
  preview storage, is parsed through report-assistant context payloads,
  and is sent to patch/research providers. `report-assistant-intent.ts`
  now has a third non-mutating `explain` intent, and the configure-page
  assistant can answer lane/formula/route questions from local context
  without calling research or creating a patch. A local authenticated UI
  smoke proved three single-input flows on the proposal configure page:
  context explain answer, source-research response display with
  `assistantTraceSnapshot` in the request, and guarded `Rw -2 dB` patch
  preview. Therefore the remaining critical gap is no longer basic
  explain/provenance availability; it is assistant reliability under
  slow, failed, repeated, or interrupted requests.
- Critical reliability planning has started for the assistant. The next
  slice must treat the assistant as a production interaction surface:
  client requests need request ids, abort/timeout handling, retry policy,
  stale-response suppression, consistent answer state, local conversation
  recovery, and regression tests for provider failures and rapid
  follow-up messages. Server-side model/research helpers already have
  provider timeout and fallback behavior, so the high-value gap is the
  browser-side request lifecycle and user-visible recovery path.
- First reliability implementation pass on 2026-06-03 has landed
  locally. `report-assistant-request-client.ts` now gives patch,
  plausibility/research, and finding-log calls a request id,
  document signature, timeout, bounded retry policy, defensive JSON
  parsing, HTTP-error handling, and request metadata. The proposal
  configure assistant now routes its patch, research/plausibility, and
  finding-log calls through that helper, drops stale async responses
  unless request id and document signature still match, shows request
  metadata in assistant answers, and persists a bounded same-document
  conversation snapshot in localStorage. Finding-log writes remain
  single-shot and are not auto-retried.
- Second reliability implementation pass on 2026-06-03 tightened local
  recovery. Conversation persistence now lives in
  `report-assistant-conversation-storage.ts` with explicit tests for
  message sanitization, same-document restore, cross-document discard,
  invalid storage records, bounded text, and storage clearing. The
  configure-page assistant now stores the latest safe patch/research or
  manual plausibility request and exposes a `Retry latest` action. The
  retry action can repeat proposal-only patch generation and
  non-mutating research/plausibility requests, but still does not retry
  finding-log writes or any apply operation.
- Third reliability implementation pass on 2026-06-03 made the stale
  response guard independently testable. Active request tracking now
  lives in `report-assistant-request-lifecycle.ts`; the configure page
  uses that helper to start, check, and finish assistant requests.
  `report-assistant-request-lifecycle.test.ts` covers the important race
  cases: delayed older request ids are rejected, previous document
  signatures are rejected, request kinds stay isolated, and finishing an
  old request cannot clear the latest active request.
- Production deploy and API smoke on 2026-06-03 completed for
  Akustikhesap only. `docker compose -f akustikhesap-compose.yml up -d
  --build` rebuilt and restarted `akustikhesap_landing`, compose health
  reported healthy, HTTPS root/API health/configure routes returned
  `200`, and authenticated `/api/report-assistant/status` reported the
  `system_llm_gemini_proxy` model provider plus implicit grounded
  research provider as configured, `proxyKeyConfigured: true`, no API
  key/secret material exposed, no readiness warnings, and no mutating
  tools exposed. A live grounded-research plausibility API smoke for
  `Rw` returned `source: research_provider`, answer text, `8` sanitized
  sources, and no `suggestedReportPatch`. A live patch API smoke for
  "Rw değerini 2 dB düşür" returned a `model` generated,
  validator-`valid`, preview-only `adjust_metric_db` patch with
  `deltaDb: -2`. This API smoke is superseded by the browser-level
  real-proposal smoke recorded below.
- Production browser smoke on 2026-06-03 then found and fixed one
  browser-only reliability bug: the request helper detached the default
  browser `fetch`, producing `Illegal invocation` before the assistant
  endpoint could be called. `report-assistant-request-client.ts` now
  binds `globalThis.fetch` when no custom fetch is supplied, and
  `report-assistant-request-client.test.ts` covers that invocation
  context. After rebuild/redeploy, a real production proposal flow passed
  end to end on the floor `Impact Floor` sample:
  local explain rendered `Assistant | context-only review`, grounded
  research rendered `Assistant | source research` with `7` visible
  `http`/`https` source URLs and no report value mutation, and "Rw
  değerini 2 dB düşür" rendered an AI-model patch preview with
  `adjust_metric_db` / `deltaDb: -2`. The smoke did not click Apply and
  reported no browser console issues.
- A repeatable browser smoke command now exists for this production
  interaction: `pnpm smoke:report-assistant`. It runs
  `tools/smoke/report-assistant-browser-smoke.ts` against
  `AKUSTIK_SMOKE_BASE_URL` (default:
  `https://akustikhesap.machinity.ai`) and uses the existing configured
  auth credentials. The default `floor-rw` and `wall-rw` cases validate
  the real workbench/proposal/configure flow, context-only explain,
  grounded source research, no report mutation, guarded AI-model patch
  preview, and empty browser console issue list. It intentionally stays
  outside the normal `e2e` command because it depends on live auth, the
  live `system_llm` provider, and internet grounding. The smoke also
  performs one controlled `Retry research` attempt if the first
  source-research response does not render. The latest default run
  passed with `floor-rw` returning `sourceUrlCount: 7`,
  `researchRetryUsed: false`, and `wall-rw` returning
  `sourceUrlCount: 6`, `researchRetryUsed: true`; both reported
  `mutationApplied: false`.

2026-06-04 implementation audit:

- This audit compared the plan against the current working tree without
  deploying or changing the live container. The local assistant slice is
  broader than the last committed state: request lifecycle hardening,
  same-document conversation persistence, trace/explain support, intent
  routing, grounded research parsing, runtime status, and the production
  browser smoke command are present in the working tree.
- The implementation evidence is concrete:
  `report-assistant-request-client.ts` owns client request ids,
  timeout/abort, defensive response parsing, retry policy, and
  write-path no-retry; `report-assistant-request-lifecycle.ts` owns the
  active request/document-signature guard;
  `report-assistant-conversation-storage.ts` owns bounded localStorage
  recovery; `report-assistant-intent.ts` separates `explain`,
  `research`, and `patch`; `simple-workbench-assistant-trace-snapshot.ts`
  plus proposal/context parsing carry compact route/provenance context;
  and `tools/smoke/report-assistant-browser-smoke.ts` covers live
  explain/research/patch flows for the default floor/wall `Rw` cases.
- Targeted verification run during this audit passed:
  `pnpm exec vitest run features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-request-lifecycle.test.ts features/workbench/report-assistant-conversation-storage.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench/simple-workbench-assistant-trace-snapshot.test.ts features/workbench/report-assistant-plausibility-research.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-runtime-status.test.ts --maxWorkers=1`
  passed `9` files and `57` tests. Targeted eslint over the changed
  assistant files also passed.
- The current assistant boundary is still report-only. No engine,
  formula, route-selection, saved scenario output, or calculator runtime
  path was changed by this audit. Research-intent requests from the
  single assistant input send `suggestPatch: false` and must remain
  non-mutating; any value edit after a research answer still needs a
  separate explicit patch instruction.
- One nuance remains in the manual/context plausibility path:
  `/api/report-assistant/plausibility` can still validate and return a
  `suggestedReportPatch` when the request is not source research and
  `suggestPatch` is allowed. That is acceptable only as a context-only
  restore convenience behind the shared patch validator. It must not be
  reused for internet/source research answers, and the UI/product copy
  should continue to distinguish this from research recommendations.
- The main gap is no longer basic assistant plumbing. The remaining gap
  is verification breadth and answer quality: production/browser checks
  for slow or failed providers, interrupted requests, rapid repeated
  messages, refresh/reopen recovery, cross-document discard, and `Retry
  latest`; plus a richer research response schema for comparability,
  source quality, value ranges, confidence, and insufficient-source
  states.
- This audit did not rerun `pnpm smoke:report-assistant`, did not run a
  production deploy, and did not run full `pnpm check`. The 2026-06-03
  production smoke claims remain historical evidence until repeated.

2026-06-04 production closeout:

- The assistant slice was rebuilt and deployed to Akustikhesap
  production with
  `docker compose -f <akustikhesap-compose.yml> build app`
  followed by
  `docker compose -f <akustikhesap-compose.yml> up -d --no-deps app`.
  The `akustikhesap_landing` container came back healthy, HTTPS root and
  `/api/health` returned `200`, and the authenticated report-assistant
  preflight passed with `modelReady: true`, `researchReady: true`, and
  `mutatingToolsExposed: false`.
- Pre-deploy local verification passed for the assistant scope:
  targeted Vitest covered `14` files / `91` tests, targeted eslint over
  assistant UI/API/smoke files passed, `pnpm exec tsc --project
  tsconfig.json --noEmit` passed, and `git diff --check` passed. The
  Docker build completed successfully; it emitted only the known
  optional `sharp` package warning and still produced a valid Next build
  including `/api/report-assistant/assembly-alternatives`.
- Production mocked failure smoke passed through
  `pnpm smoke:report-assistant:failure`. It proved provider failure
  recovery, patch network retry, assembly timeout retry,
  same-document conversation restore, cross-document conversation
  discard, metric-context preservation, and no accidental mutation.
- Production expanded live browser smoke passed through
  `pnpm smoke:report-assistant`. The default cases now cover:
  `floor-rw` on `Impact Floor` with context explain, grounded source
  research (`6` source URLs), AI-model patch preview, and guarded stale
  text replacements; `floor-lnw` on `Dataholz CLT Dry` with live
  `output:Ln,w`, context explain, grounded source research (`6` source
  URLs), and report-only `adjust_metric_db` preview; `wall-rw` on
  `Wall Study` with grounded source research (`6` source URLs) and
  report-only patch preview; and `floor-assembly-alternatives` with
  layer-alternative grounded research (`4` source URLs) after one retry.
  All cases reported `mutationApplied: false` and no browser console
  issues.
- The `floor-lnw` smoke initially exposed an important product nuance:
  the `Impact Floor` preset can show `output:Ln,w` in assistant context
  as `needs_input` / `Not ready` even after the visible heavy-concrete
  input surface is completed, while `Dataholz CLT Dry` produces a live
  `Ln,w` proposal metric. The expanded smoke therefore uses `Dataholz
  CLT Dry` for the live Ln,w assistant path. `Impact Floor` remains a
  separate calculator/preset follow-up, not an assistant-contract
  blocker.

### User Goal Reconciliation - 2026-06-04

Checkpoint note: this section records an earlier pre-checkpoint
reconciliation pass. The current source of truth is the
`2026-06-04 checkpoint validation`, `Recommended Execution Order`, and
`Implementation Alignment Ledger` above. Statements below that say
Impact Floor smoke, report consistency gates, structured research
packets, or previous-review challenge context are missing have been
superseded by the later implementation and validation closeout.

The target product behavior is broader than a one-shot value patcher.
The user wants a report assistant for weak calculator cases: when the
calculator gives a questionable or under-supported result for the
current wall/floor layer combination, the assistant should understand the
calculator trace, discuss the result, research comparable assemblies on
the internet when requested, challenge or revise its own assessment after
follow-up prompts, and only then help prepare a report-only override
without breaking report consistency.

Current implementation is directionally correct for the core boundary:

- the assistant sees the current proposal metric schedule, layer summary,
  output basis, status, report value, captured engine value, and compact
  `assistantTraceSnapshot`;
- local explain answers can describe the selected route/lane/formula
  context without calling a model or mutating the report;
- source-research requests can call the configured grounded research
  path and display answer text, rationale, recommendation text, and
  sanitized `http`/`https` sources;
- follow-up edit instructions can turn an earlier recommendation into a
  separate guarded patch request;
- report mutation stays behind `validateReportAssistantPatch`, document
  signature checks, movement limits, explicit Apply, and report
  adjustment audit records.

The remaining gap is not the direction. The direction is right. The
remaining gap is that the current implementation is still metric-review
centric and not yet a full acoustic conversation assistant. The next
work must make these user jobs first-class:

1. **Metric explanation**: "Rw neden böyle çıktı?", "Ln,w hangi
   formülle geldi?", "hangi ara değerler hesaplandı?" The assistant must
   answer from local trace/context first, then say what trace detail is
   unavailable instead of guessing.
2. **Source-backed metric review**: "bu Rw fazla mı?", "bu Ln,w bu
   katman kombinasyonu için makul mü?" The assistant must compare
   comparable published assemblies, classify source quality and
   comparability, return value/range advice, and keep the answer
   non-mutating.
3. **Challenge/retry conversation**: "bence yanılıyorsun, bir daha bak",
   "çık tekrar araştır", "şu kaynağı dikkate al". The assistant must use
   recent conversation and the same document signature, but it must not
   silently apply or preload edits.
4. **Assembly/layer alternative research**: "şu layerın alternatifi ne",
   "bu sistemi daha makul Rw/Ln,w için nasıl değiştiririm?" This is not
   implemented as a first-class contract yet. It needs a separate
   non-mutating research intent that can return alternative layer
   suggestions, comparable assemblies, expected metric direction, source
   links, and assumptions without editing calculator inputs or report
   values.
5. **Report-only override**: "haklısın, Rw değerini 2 dB düşür". This
   should remain a separate patch intent after the discussion/research
   answer. It must update all metric locations consistently, preserve
   engine truth, record the adjustment, and keep stale narrative value
   mentions visible until a controlled consistency patch is approved.

Report consistency is the hardest acceptance point. The current patch
guard updates primary/metric/coverage value locations and records
`reportAdjustments`; it also detects stale value mentions in narrative
fields. It does not yet guarantee that every old value mention in the
executive summary, assumptions, recommendations, warnings, PDF text, and
DOCX text is resolved. Until controlled stale-value replacement lands,
any metric override is safe as a guarded export-only adjustment, but not
fully "report-consistency complete" unless the stale-mention warning is
empty or the user manually fixes the affected text.

Still open:

- broaden the repeatable production browser smoke beyond the now-passed
  `floor-rw`, live `floor-lnw`, `wall-rw`, and first
  `floor-assembly-alternatives` cases. The assistant still needs route
  breadth for `Ln,w+CI`, `DeltaLw`, field impact outputs, and additional
  prompts such as "bu formül neden kullanıldı" or "hangi ara değerler
  hesaplandı";
- resolve or explicitly redesign the `Impact Floor` preset's impact
  behavior. It currently makes a good assembly-alternative research
  smoke case, but its `Ln,w` proposal metric can remain `needs_input` /
  `Not ready` while a live heavy-concrete formula corridor is expected
  by the preset summary and related fixtures. This should be handled as a
  calculator/preset correctness slice, not by weakening the assistant
  guard;
- broaden trace/explain verification across real generated proposal
  documents. The first production browser pass proved a local
  context-only lane/formula answer for a generated floor/Rw proposal,
  but production still needs common airborne and impact route families
  and prompts such as "Ln,w hangi formülle geldi", "bu formül neden
  kullanıldı", and "hangi ara değerler hesaplandı";
- continue production-smoking the browser-side assistant request
  lifecycle. Mocked failure smoke now proves provider failure recovery,
  network retry, assembly timeout retry, same-document restore,
  cross-document discard, metric-context preservation, and no mutation.
  Production still needs rapid two-message race behavior, refresh/reopen
  persistence in a real browser session, and more `Retry latest`
  coverage before this reliability slice is considered complete;
- expand the research response contract beyond the minimal
  `PlausibilityReview` shape. Keep `answerText`, `verdict`,
  `severity`, `rationale`, `sources`, and `recommendedActionText`, but
  add structured fields for:
  `valueRecommendation` (`targetValue`, `rangeMinDb`, `rangeMaxDb`,
  `direction`, `reason`), `sourceQuality` (`none`, `weak`,
  `mixed`, `strong`), `comparability` (`direct_match`,
  `same_family`, `partial_match`, `not_comparable`),
  `comparableAssemblies` (source id, title, URL, published metric,
  construction summary, matching layers, missing differences),
  `missingEvidence`, `confidence`, and `insufficientSourcesReason`.
  This lets the UI say "I found sources but they are not comparable"
  instead of forcing everything into a yes/no plausibility verdict;
- harden the metric-independent explain intent beyond the first smoke.
  The deployed assistant now answered a floor/Rw lane/formula question
  locally from report context, but production still needs broader
  questions such as "bu formül neden kullanıldı", "hangi ara değerler
  hesaplandı", "neden kaynak bulunamadı", or "bu katman kombinasyonunda
  risk ne". Explain must stay local, non-mutating, bounded to report
  context, and must refuse unrelated general chat;
- add a first-class assembly/layer alternative research path. The
  current source-research endpoint is built around one current report
  metric. It should be extended or paired with a separate non-mutating
  contract for "alternate layer/system" questions that returns proposed
  layer changes, expected acoustic direction, source evidence,
  comparability, and explicit "does not change calculator inputs"
  wording;
- separate "conversation answer" from "report edit" in all UI states.
  Research/explain answers should show the answer first, then reasoning
  and sources. Patch generation should show the guarded patch preview.
  A research recommendation such as "Rw looks 1-2 dB optimistic" must
  not preload or apply a patch; the user should send a second explicit
  edit instruction like "tamam Rw değerini 2 dB düşür" before the patch
  endpoint runs;
- close the report-consistency loop for applied overrides. A patch that
  changes a metric should either prove that no stale old-value mentions
  remain in narrative/export surfaces or present a second guarded
  consistency patch for specific text locations. The assistant must not
  silently rewrite broad report prose, but the user needs a clear path to
  make primary values, metric tables, narrative notes, PDF, and DOCX
  agree;
- broaden regression coverage for the next assistant behavior. Current
  targeted unit tests cover request client, request lifecycle,
  conversation storage, intent routing, trace/explain, trace snapshot
  parsing, model provider, runtime status, and grounded research
  response parsing. Still missing: route/UI tests with mocked responses
  proving answer/reasoning/source cards render correctly, research-only
  answers do not create patch drafts, slow/failed provider states are
  recoverable, and rapid-message browser state races cannot overwrite
  the latest answer;
- keep the MCP-compatible adapter optional. Wire it into a deployed MCP
  server only if real usage shows an external-agent workflow that the
  in-app assistant endpoints cannot satisfy. MCP remains optional and
  should not block deploy, grounded research smoke testing, trace
  context production smoke, or browser-side reliability hardening.

## Selected Assistant Hardening Audit - 2026-06-04

Checkpoint note: this audit was written before the completed
report-consistency, Impact Floor smoke, structured research,
challenge/retry, and provider-hardening slices. Keep it as design
history and edge-case rationale. For current status, use the checkpoint
validation and alignment ledger above.

This audit captures the user-selected next priorities after the
`Impact Floor / Ln,w Not ready` bridge fix. It compares the requested
assistant behavior against the current local implementation and the
existing production-smoke plan. It does not change calculator formulas,
runtime values, route selection, report exports, or assistant provider
configuration.

External reference check:

- Google Gemini Search grounding documentation confirms that the
  `google_search` tool can return `groundingMetadata`, including search
  queries, web source chunks, and support mappings. This supports the
  current source-sanitization approach and the next need to keep source
  URLs/titles attached to specific research claims:
  `https://ai.google.dev/gemini-api/docs/google-search`.
- Google Gemini structured-output documentation confirms JSON response
  formatting and JSON Schema support, but also states that applications
  must still validate semantic correctness. This supports keeping
  provider JSON behind local schema normalization, sanitizer logic, and
  report patch validation:
  `https://ai.google.dev/gemini-api/docs/structured-output`.
- ISO 12354-2:2017 remains the right external boundary for impact-sound
  explanation language. ISO describes building impact prediction as an
  estimation model using measured element data, direct/indirect flanking
  transmission, and theoretical propagation methods. Assistant research
  must therefore treat web sources as plausibility evidence and not as
  automatic calculator calibration:
  `https://www.iso.org/standard/70243.html`.

### Implementation Comparison

| User-selected improvement | Current implementation | Gap / next action |
| --- | --- | --- |
| Re-expand Impact Floor assistant smoke | `tools/smoke/report-assistant-browser-smoke.ts` still uses `Dataholz CLT Dry` for the default `floor-lnw` live metric case. `Impact Floor` is covered for `floor-rw` and assembly alternatives, not for live `Ln,w` / `DeltaLw` after the bridge fix. | Add dedicated `impact-floor-lnw` and `impact-floor-deltalw` smoke cases on `Impact Floor`; require live `output:Ln,w` and `output:DeltaLw` metric context, context explain, source research, and guarded patch preview. Keep the old Dataholz case only as a separate exact-family control. |
| Deepen trace answers | `assistantTraceSnapshot` already carries dynamic airborne trace, dynamic impact trace, impact support, resolver route/basis/support bucket/required inputs/supported metrics/value pins, and selected candidate ids. `report-assistant-trace-explanation.ts` turns this into local non-mutating explanations. | Add richer impact-specific lines for selected basis category (`published_anchor`, `formula_corridor`, `bound`, `needs_input`, `unsupported`), used physical inputs, parked outputs, and missing-input reasons. Current snapshot has `requiredInputs` and `unsupportedOutputs`, but not a durable "used inputs vs missing inputs by output" map. |
| Structure research answers | `ReportAssistantPlausibilityReview` already includes `comparability`, `sourceQuality`, `confidence`, `valueRange`, `missingEvidence`, `insufficientSourcesReason`, `answerText`, `recommendedActionText`, and sanitized sources. Provider prompt asks for these fields and suppresses patches for research requests. | Make the schema more explicit and smoke-asserted: require source-quality, comparability, confidence, value/range or insufficient-source reason, and at least one comparable-assembly note when sources exist. Add `comparableAssemblies` and `valueRecommendation` to metric plausibility, matching the richer assembly-alternative contract. |
| Strengthen challenge/retry conversation | Intent routing recognizes challenge/retry language and sends it to research; request lifecycle, same-document conversation storage, retry latest, and stale-response guards exist. | Persist enough previous research answer metadata to make "bence yaniliyorsun / bir daha arastir / su kaynagi dikkate al" meaningfully different from a fresh research request. The follow-up must include same document signature, previous verdict/recommendation/source ids, and user challenge text; it must still return no patch. |
| Close report consistency gate | Patch validation supports `adjust_metric_db`, stale value detection, guarded `replace_report_text_value`, document-signature checks, movement limits, and report adjustment audit records. Browser smoke already checks "Add guarded text replacements" for `floor-rw`. | Promote consistency from optional helper to acceptance gate for applied metric overrides. Before export after an override, prove no stale old-value mentions remain in metric rows, summary, assumptions, recommendations, warnings, PDF source text, and DOCX source text, or require a second explicit guarded consistency patch. |
| Broaden browser/prod smoke | Existing production smoke covers default `floor-rw`, Dataholz `floor-lnw`, `wall-rw`, and `floor-assembly-alternatives`, plus mocked failure smoke for provider failures and recovery paths. | Add live browser cases for `Impact Floor Ln,w`, `Impact Floor DeltaLw`, `Ln,w+CI`, field impact outputs, rapid two-message race behavior, refresh/reopen conversation restore, and `Retry latest`. Keep provider 500/invalid JSON/timeout checks in mocked failure smoke and add one live retry-regression case only if stable enough for production. |

### Report Consistency Detail Audit - 2026-06-04

Additional user-requested audit focused on the case where the assistant
lowers `Rw`, for example from `58 dB` to `56 dB`, and related report
text can still quote the old value.

Findings:

- The numeric patch application correctly updates known report value
  locations: `primaryMetricValue`, matching `metrics[].value`, and
  matching `coverageItems[].value`.
- The engine truth is intentionally preserved through
  `engineDisplayValue` and `reportAdjustments.beforeValue`; those old
  values are audit/engine records and must not be treated as stale
  client-facing copy.
- The current stale-value scanner is too narrow. It scans
  `executiveSummary`, `briefNote`, `validationDetail`, `warnings[]`,
  `assumptionItems[].detail`, and `recommendationItems[].detail`, but
  not several rendered/exported text locations such as
  `assemblyHeadline`, `metrics[].detail`, `coverageItems[].detail`,
  `coverageItems[].postureDetail`, `coverageItems[].nextStep`,
  `decisionTrailHeadline`, `decisionTrailItems[].detail`,
  `corridorDossierHeadline`, `corridorDossierCards[].value/detail`,
  `methodDossierHeadline`, `methodDossierCards[].value/detail`,
  `methodTraceGroups[].value/detail/notes[]`, or
  `issueRegisterItems[].detail`.
- A live read-only production snapshot of `Impact Floor` showed the
  baseline `Rw 58 dB` narrative mention currently appears in
  `executiveSummary`, which the existing guard catches. That proves the
  current default `floor-rw` happy path works.
- A controlled synthetic simulation on the same `Impact Floor` document
  inserted stale `Rw 58 dB` copy into `assemblyHeadline`, metric detail,
  coverage detail/posture detail, method cards, trace groups, and
  decision headline, then applied an `Rw -2 dB` report-only patch. The
  current guard found only `executiveSummary`, while generated
  simple/branded HTML still contained old visible `58 dB` text. This
  proves the guard is not strong enough for general report consistency.
- Literal old-value detection cannot catch semantic inconsistency when
  the old number is absent. Examples: text that still says "strong
  margin", "comfortably passes", "Class A", "meets target", or "no
  change needed" after the value is lowered. These should become review
  warnings or explicit user-confirmed consistency edits, not silent
  broad rewrites.

Next consistency fix:

- Create one shared rendered-report text path registry for all fields
  that can appear in preview/PDF/DOCX/client-visible technical panels.
  Use it for stale-value scanning and allowed
  `replace_report_text_value` paths.
- Exclude audit/engine fields from stale-copy detection by design:
  `engineDisplayValue`, `reportAdjustments.beforeValue`, and similar
  "engine preserved" audit text.
- After any applied metric override, run a final consistency gate before
  save, preview, PDF export, and DOCX export. The gate should compare
  the edited document and rendered simple/branded HTML sources against
  the old report value and block if client-visible stale text remains
  outside engine/audit fields.
- Add a deterministic consistency-patch helper that proposes only exact
  old-value replacements for highlighted paths. It should not let the
  model rewrite arbitrary prose.
- Add semantic warnings around the changed metric when qualitative copy
  mentions pass/fail, target, class, margin, recommendation, or
  confidence without quoting the old value. These warnings can block
  export when they are close to the changed metric label.
- Add focused tests where `Rw 58 dB -> 56 dB` leaves old values in
  `assemblyHeadline`, `metrics[].detail`, `coverageItems[].detail`,
  `coverageItems[].postureDetail`, `methodDossierCards[].detail`,
  `methodTraceGroups[].notes[]`, and `decisionTrailHeadline`; assert
  save/export is blocked until exact replacements or user-approved notes
  resolve the issue.

### Deterministic Consistency Architecture - 2026-06-04

The consistency fix should be deterministic application logic, not a
model rewrite. The assistant/model may suggest that a report value should
move, but local code must own every consistency decision before save,
preview, PDF export, or DOCX export.

Additional implementation findings:

- `report-assistant-patch.ts` currently keeps text replacement safe by
  accepting only `replace_report_text_value` paths that
  `getReportTextAtPath` and `setReportTextAtPath` explicitly know.
  This is the right guard shape, but the allowlist is currently too
  small for the fields rendered by the proposal surfaces.
- `buildSimpleWorkbenchProposalHtml`, `buildSimpleWorkbenchProposalSimpleHtml`,
  `buildSimpleWorkbenchProposalText`, `proposal-preview-client-page.tsx`,
  and `simple-workbench-proposal-panel.tsx` are separate report surfaces.
  A deterministic registry must be checked against all of them, not only
  the PDF HTML builder.
- `reportAdjustments` is stored as an audit record, but it is not yet a
  broad rendered consistency mechanism. A future visible override note
  may be useful, but stale report text still has to be detected and
  resolved directly.
- Exact old-value scanning must not treat engine/audit records as stale.
  `engineDisplayValue` and `reportAdjustments.beforeValue` are expected
  to preserve the original calculator value. They are evidence that the
  report was overridden, not copy that should be rewritten.
- Source/evidence fields need stricter policy than ordinary narrative.
  A citation or comparable-source row can legitimately contain a source
  value that differs from the final report value. The consistency gate
  should detect it, classify it as source/evidence, and require review
  or an explanatory note instead of blindly replacing source data.

Recommended deterministic design:

1. Add a central collector, for example
   `collectReportConsistencyTextPaths(document)`, that recursively
   returns string records with:
   `path`, `text`, `surfacePolicy`, `metricAffinity`, `replaceable`,
   and `auditExempt`.
2. Use path-policy classification rather than raw global string search.
   Policies should include at least:
   `metric_value`, `client_narrative`, `technical_narrative`,
   `evidence_source`, `issue_metadata`, `audit_engine`, and
   `non_report_metadata`.
3. Replacement should be allowed only for deterministic, client-visible
   text fields. Good candidates:
   `assemblyHeadline`, `executiveSummary`, `briefNote`,
   `validationDetail`, `dynamicBranchDetail`, `warnings[]`,
   `assumptionItems[].detail`, `recommendationItems[].detail`,
   `metrics[].detail`, `coverageItems[].detail`,
   `coverageItems[].postureDetail`, `coverageItems[].nextStep`,
   `corridorDossierHeadline`,
   `corridorDossierCards[].value/detail`, `methodDossierHeadline`,
   `methodDossierCards[].value/detail`,
   `methodTraceGroups[].value/detail/notes[]`,
   `decisionTrailHeadline`, `decisionTrailItems[].detail`, and
   `issueRegisterItems[].detail`.
4. Replacement should be rejected for ids, URLs, image data, ISO dates,
   metric labels, output ids, `engineDisplayValue`,
   `reportAdjustments.*`, and raw numeric response-curve arrays.
5. The patch validator should keep the existing `beforeText` equality
   check. This prevents stale async assistant patches from editing text
   that the user changed manually after the patch was drafted.
6. After any metric override, classify old-value mentions:
   `exact_current_metric_value` is blocking;
   `ambiguous_numeric_only` is blocking on client-visible fields;
   `other_metric_value` is non-blocking but should be shown;
   `audit_engine_value` is allowed;
   `evidence_source_value` requires explicit review or a source note.
7. Add semantic consistency warnings for metric-affine text that does
   not contain the old value but contains words such as `pass`,
   `fail`, `target`, `margin`, `class`, `comfortably`, `strong`,
   `weak`, `optimistic`, `conservative`, `recommend`, or `no change`.
   These should not be auto-rewritten. They should block export only
   when they are close to the changed metric label or live in that
   metric's own detail/posture path.
8. Keep rendered-output checks as a safety net, not the primary logic.
   Raw HTML/text scanning can produce false positives when the old value
   equals a chart axis, another metric, or a source value. The primary
   contract should be the path registry plus renderer-coverage tests.

Required tests for this slice:

- Unit-test the collector with a synthetic proposal document that places
  an old `Rw 58 dB` value in every candidate path above.
- Assert metric patching updates only the known metric value locations
  and preserves engine/audit values.
- Assert old values in `engineDisplayValue` and
  `reportAdjustments.beforeValue` are not blocking.
- Assert old values in `assemblyHeadline`, metric detail, coverage
  detail, posture detail, method cards, trace notes, and decision
  headline are blocking until exact replacements are applied.
- Assert citation/source old values are not silently replaced. They must
  be classified as evidence/source review items.
- Assert semantic phrases near the changed metric produce review
  warnings even when the old number is absent.
- Add renderer-coverage sentinel tests: render branded HTML, simple
  HTML, text export, and the in-app preview with unique sentinel strings
  in candidate document fields. Any sentinel that appears in a report
  surface must be present in the consistency collector or the test
  fails.
- Add a browser smoke or component test proving `Save edits`, `Open
  preview`, PDF export, and DOCX export stay disabled while blocking
  consistency findings remain, then become enabled after the approved
  exact replacements are applied.

Current priority adjustment:

- The user-selected next implementation slice is now the deterministic
  report-consistency gate. It can proceed before the remaining
  trace/research polish, as long as it preserves the existing assistant
  boundary: no calculator formula changes, no model-authored broad
  prose rewrites, and no report mutation before explicit Apply.

### Report Structure, User Flows, And Edge Cases - 2026-06-04

The report consistency gate must be designed around how an operator will
actually use the feature, not only around the assistant happy path. The
current code has at least three report routes:

- Workbench proposal panel: builds a fresh proposal document, can copy
  the text summary, open the print preview, open the report editor, or
  download PDF/DOCX directly.
- Report editor: edits the stored preview snapshot, has a live iframe,
  assistant patch preview/apply, `Save edits`, `Open preview`, PDF
  export, and DOCX export. This is the only route that currently blocks
  save/export on `findReportAdjustmentConsistencyMentions`.
- Proposal preview: reads the stored preview snapshot and can copy text,
  edit again, reload/reset edits, print, or export branded/simple
  PDF/DOCX. This route currently exports the loaded document directly
  and must receive the same final consistency gate before any download.

Important implementation gap: the helper functions in
`proposal-adjust-output-edits.ts` synchronize a metric value edit across
matching `primaryMetricValue`, `metrics[].value`, and
`coverageItems[].value`, but they do not create `reportAdjustments`.
That means a user who manually changes `Rw 58 dB` to `Rw 56 dB` in the
editor can update visible table values without activating the same
stale-value audit used by assistant patches. The next slice must either
create tracked manual report adjustments for metric-value edits or run a
base-vs-current metric diff gate that produces equivalent consistency
findings.

User flows that must be covered:

1. Assistant research -> user asks for `Rw -2 dB` -> patch preview ->
   explicit Apply -> stale old-value findings -> guarded consistency
   replacements or export blocked.
2. User manually edits the headline metric value in the copy tab. The
   system must treat this like a report-only override and check the same
   stale text paths before save, preview, PDF, DOCX, print, or text copy.
3. User manually edits `metrics[].value` or `coverageItems[].value`.
   The matching output rows should continue to sync, but consistency
   findings must still be generated for the changed metric.
4. User hides the primary metric or hides a metric row. Hidden table
   values must not make stale narrative acceptable; client-visible
   narrative, coverage, method, and text-export fields still need review.
5. User switches between simple and branded style after editing. The
   consistency decision must not depend only on the currently active
   preview style because the user can export another style later.
6. User saves a customized snapshot, reloads the preview, and exports
   from the preview page. The saved document must carry enough
   consistency state or be rechecked on export so stale values cannot
   bypass the editor.
7. User applies two changes in one session, for example `Rw 58 -> 56`
   and `Ln,w 56 -> 58`. Replacement must be based on each operation's
   original `beforeText` and metric affinity, not a global sequential
   string swap.
8. User challenges the assistant and retries research before applying a
   patch. Stale async patch drafts must remain rejected by document
   signature and `beforeText` equality.

Report field map for consistency policy:

- Direct metric value fields: `primaryMetricValue`, `metrics[].value`,
  and `coverageItems[].value`. These are deterministic value locations,
  not narrative stale mentions.
- Client-facing narrative: `executiveSummary`, `assemblyHeadline`,
  `briefNote`, `validationDetail`, `dynamicBranchDetail`,
  `metrics[].detail`, `coverageItems[].detail`,
  `coverageItems[].postureDetail`, `coverageItems[].nextStep`,
  assumptions, recommendations, warnings, and the client-visible parts
  of method/corridor/decision text.
- Technical appendix text: `methodDossierHeadline`,
  `methodDossierCards[].value/detail`, `methodTraceGroups[].value`,
  `methodTraceGroups[].detail`, `methodTraceGroups[].notes[]`,
  `corridorDossierHeadline`, `corridorDossierCards[].value/detail`,
  `decisionTrailHeadline`, and `decisionTrailItems[].detail`. These can
  appear in text export or branded output and should be checked, even if
  they are less prominent than the executive summary.
- Evidence/source text: `citations[].label/detail/href`,
  source-family notes, and comparable assembly evidence. These may
  legitimately mention a source value that differs from the final report
  value. They should be classified and reviewed, not blindly replaced.
- Audit/engine truth: `engineDisplayValue`, `reportAdjustments.*`,
  assistant trace raw values, ids, URLs, dates, image data, and raw curve
  point arrays. These must not be treated as stale report copy.

Edge cases the implementation must explicitly handle:

- Metric direction matters. Lower `Rw` is a worse airborne result, lower
  `Ln,w` is a better impact result, higher `DeltaLw` is generally
  better, and signed/auxiliary values such as `CI` need careful wording.
  Semantic warnings should use metric direction before flagging words
  such as pass, fail, target, margin, strong, weak, optimistic,
  conservative, high, low, fazla, dusuk, iyi, kotu, makul, sinir,
  hedef, and karsiliyor.
- Exact values can be formatted several ways: `58 dB`, `58dB`,
  `58.0 dB`, `58,0 dB`, `<= 58 dB`, `>= 58 dB`, `+1 dB`, `-4 dB`,
  and `Not ready`. Exact replacement should stay conservative, while
  detection can normalize formats for warnings.
- The same old value can belong to another metric, a target threshold,
  a chart axis, a source assembly, a phone/reference number fragment, or
  a layer property. Metric label proximity and path policy must decide
  whether the mention is blocking, review-only, or ignored.
- Narrative can become semantically stale without containing the old
  number, for example "comfortably exceeds target", "no change needed",
  or "passes by 2 dB" after a 2 dB downgrade. These should produce
  non-rewriteable semantic findings.
- Coverage statuses can change independently from values (`live`,
  `needs_input`, `unsupported`, `not ready`). A numeric override should
  not make parked outputs look calculated, and a status change should
  not leave numeric claims in narrative.
- Response-curve values are engine evidence. If the report headline is
  overridden but the curve remains the engine curve, the chart should
  either remain clearly labelled as engine/calculated evidence or carry
  a visible override note. Raw curve data should not be overwritten by
  report consistency patches.
- Source citations and research answers can contain comparable values
  that disagree with the report. The gate should ask for an explanatory
  note when needed, not erase the source data.
- Turkish and English operator language both matter. The assistant and
  semantic checker should recognize common Turkish challenge and
  judgement phrasing because the expected user flow is conversational.
- Final consistency must run at every egress point: editor save, editor
  open-preview, editor PDF/DOCX, preview PDF/DOCX, print/save-PDF, and
  text copy when a changed metric has unresolved blocking findings.

Additional acceptance tests for the consistency slice:

- Manual edit parity: edit `primaryMetricValue`, `metrics[].value`, and
  `coverageItems[].value` without assistant involvement; assert the same
  stale narrative findings appear as with an assistant patch.
- Preview-route gate: save a customized snapshot with a stale old value,
  open `/workbench/proposal`, and assert branded/simple PDF/DOCX exports
  and print are blocked or visibly warned until consistency is resolved.
- Style switching: create a stale field visible only in branded output
  and another visible only in simple/text output; assert both are found
  regardless of the active editor style.
- Multi-metric swap: apply two metric changes where one metric's new
  value equals another metric's old value; assert replacements remain
  path- and metric-affine.
- Source evidence: put the old value in a citation and a comparable
  assembly note; assert no automatic replacement is offered and a review
  classification is shown.
- Semantic-only stale copy: remove the old numeric value but keep
  "passes by 2 dB" or "comfortably exceeds target" near the changed
  metric; assert a blocking or review finding appears according to the
  field policy.
- Formatting variants: cover spaced/unspaced dB, decimal comma, signed
  dB, inequality, and `Not ready` transitions.
- Engine/audit exemption: assert old engine values, trace raw values,
  `reportAdjustments.beforeValue`, and response-curve point values do
  not block export.

2026-06-04 implementation progress for this slice:

- Added a central report consistency path registry in
  `report-assistant-patch.ts`. It now separates replaceable
  client/technical narrative from source/evidence and engine/audit
  fields.
- Expanded guarded `replace_report_text_value` support beyond
  `executiveSummary`/brief/validation text to include assembly headline,
  metric detail, coverage detail/posture/next-step text,
  method/corridor cards, method trace groups/notes, decision trail, and
  issue-register detail paths.
- Added manual edit parity by comparing the packaged `baseDocument`
  against the current proposal snapshot and treating changed metric
  values as manual report-only adjustments for consistency detection.
- Kept source/evidence values non-blocking and non-replaceable, and kept
  engine/audit values out of blocking stale-copy checks.
- Connected the configure editor consistency check to `baseDocument`, so
  manual edits to `primaryMetricValue`, `metrics[].value`, or
  `coverageItems[].value` can block save/preview/export when stale copy
  remains.
- Connected the proposal preview page to the same consistency gate, so a
  saved customized snapshot cannot bypass the editor by exporting,
  printing, or copying text from `/workbench/proposal`.
- Added targeted tests for path registry coverage, manual metric edit
  parity, source/evidence classification, preview export gate source
  contract, and broadened MCP/tool stale mention expectations.
- Validation passed for this progress step:
  `pnpm --dir apps/web exec vitest run ...` over the 14 assistant
  target files passed `115` tests; targeted ESLint passed for the
  changed files; `pnpm exec tsc --project tsconfig.json --noEmit`
  passed; `git diff --check` passed.

2026-06-04 semantic consistency progress:

- Added deterministic semantic stale-copy detection for applied
  assistant overrides and manual metric edits. The gate now catches
  metric-affine qualitative claims such as pass/fail, target, margin,
  comfortably, strong/weak, recommend, high/low, and Turkish equivalents
  such as fazla, dusuk, yuksek, makul, sinir, hedef, karsiliyor, gecer,
  rahat, marj, and oneri.
- The semantic checker is intentionally conservative: it blocks only
  replaceable report text that either names the changed metric or lives
  in that metric's own `metrics[].detail` / `coverageItems[]` detail,
  posture, or next-step path. It skips source/evidence and audit/engine
  fields, and it does not offer automatic text replacements because no
  exact old value exists to replace safely.
- Updated editor and preview copy so blocked findings are described as
  stale value mentions or qualitative metric claims, not only old-value
  literals.
- Added a semantic-only regression where `Rw` is lowered after the old
  numeric value was removed but text still says the assembly comfortably
  passes/exceeds target. The test proves metric-labelled summary text and
  the metric's own detail path block export, while a source citation and
  a generic recommendation without metric affinity do not.
- Validation passed for this progress step:
  `pnpm --dir apps/web exec vitest run ...` over the 14 assistant target
  files passed `116` tests; targeted ESLint passed for the changed
  files; `pnpm exec tsc --project tsconfig.json --noEmit` passed; `git
  diff --check` passed.

2026-06-04 chart/curve override-note progress:

- Added a shared proposal adjustment note helper. When
  `reportAdjustments` exist, branded HTML, simple HTML, and text export
  now state the report-only override summary and explicitly say that
  calculator inputs, captured engine values, and any response curve shown
  remain calculated evidence.
- Connected the note to the branded weighted-result fallback graph, the
  branded response-curve cards, the simple PDF response-curve cards, and
  the copy-ready text export. This prevents a report-only `Rw -2 dB`
  adjustment from making the chart look like it was recalculated.
- Added renderer regression coverage proving the note appears in branded
  HTML, simple HTML, and text export after a report-only adjustment.
- Validation passed for this progress step:
  `pnpm --dir apps/web exec vitest run ...` over the 15 assistant/report
  target files passed `121` tests; targeted ESLint passed for the
  changed files; `pnpm exec tsc --project tsconfig.json --noEmit`
  passed; `git diff --check` passed.

2026-06-04 production deploy and smoke closeout:

- Built and deployed the current Akustikhesap app image with
  `docker compose -f akustikhesap-compose.yml build app` followed by
  `docker compose -f akustikhesap-compose.yml up -d --no-deps app`.
  The Docker build completed successfully. It emitted the existing
  optional `sharp` package resolution warnings during Next compilation,
  then completed type validation, page generation, and standalone image
  export.
- Post-deploy health checks passed: `akustikhesap_landing` was recreated
  and reported healthy, `https://akustikhesap.machinity.ai/api/health`
  returned `200`, and app startup logs showed Next ready on port `3010`.
- `pnpm smoke:report-assistant:preflight` passed against production
  after deploy: root/configure/status were `200`, login was `200`,
  model provider ready, research provider ready, `mutatingToolsExposed`
  was `false`, and no required bundle strings were missing.
- `pnpm smoke:report-assistant` passed against production with the
  default case set. Results:
  `floor-rw` produced source research with `2` URLs, an
  `adjust_metric_db+replace_report_text_value` preview, consistency
  guard added, no console issues, and `mutationApplied: false`;
  `floor-lnw` produced live `Ln,w` context, source research with `6`
  URLs, `adjust_metric_db` preview, no console issues, and no mutation;
  `floor-deltalw` produced live `DeltaLw` context, source research with
  `6` URLs, `adjust_metric_db` preview, no console issues, and no
  mutation; `wall-rw` produced source research with `10` URLs,
  `adjust_metric_db` preview, no console issues, and no mutation; and
  `floor-assembly-alternatives` produced layer alternative research with
  `3` source URLs after one retry, no patch preview, no console issues,
  and no mutation.
- `pnpm smoke:report-assistant:failure` passed against the deployed
  production bundle with browser-level mocked assistant endpoints. It
  verified provider failure recovery, invalid JSON retry/failure
  handling, patch network recovery, same-document conversation restore,
  cross-document conversation discard, metric context preservation, and
  `mutationApplied: false`.
- Final post-smoke health remained green: compose reported
  `akustikhesap_landing` healthy and HTTPS `/api/health` returned `200`.
- Controlled production Apply/Save/Export acceptance also passed on
  2026-06-04 for the `Impact Floor` preset. The browser flow applied a
  guarded report-only `output:Rw` `-2 dB` patch (`58 dB -> 56 dB`),
  added the deterministic stale-text replacement, preserved captured
  engine `Rw` at `58 dB`, saved the proposal snapshot, opened preview
  without a report-consistency export block, exposed the report-only
  override note, and downloaded branded PDF, branded DOCX, simple PDF,
  and simple DOCX successfully. Download sizes were `207159`,
  `158962`, `366864`, and `116451` bytes respectively; browser console
  issues were `0`.
- Post-acceptance health stayed green: compose reported the app healthy
  and HTTPS `/api/health` returned `200`. App logs contained the
  existing non-fatal DOCX/SVG image-size warnings from `html-to-docx`
  during export; the generated DOCX/PDF files still completed and passed
  the browser download-size checks.

2026-06-04 checkpoint validation:

- Re-read the current implementation against this plan. The deterministic
  report-consistency slice, Impact Floor `Ln,w` bridge fix, Impact Floor
  assistant smoke coverage, source-backed metric research shape,
  challenge/retry previous-review packet, guarded Apply, preview/export
  gates, and report-only override notes are now aligned with the current
  product goal.
- Remaining non-blocking gaps for the next slice are: richer local trace
  wording for complex parked-output cases, continued research answer
  quality work around comparable assembly evidence, a dedicated
  long-term fix for non-fatal DOCX/SVG image-size warnings, and broader
  browser UX coverage if we want to formalize the ad hoc Apply/Save/Export
  acceptance script as a committed smoke command.
- Checkpoint validation commands passed:
  `pnpm --dir apps/web exec vitest run ... --maxWorkers=1` for 18
  assistant/report/Impact Floor files passed `135` tests;
  `pnpm --dir packages/engine exec vitest run ... --maxWorkers=1` for
  the two target impact engine contract files passed `11` tests;
  `pnpm exec tsc --project tsconfig.json --noEmit` passed; scoped ESLint
  over the changed assistant/workbench/API files passed; `git diff
  --check` passed.
- Production checkpoint also passed: compose reported
  `akustikhesap_landing` healthy, HTTPS `/api/health` returned `200`,
  `pnpm smoke:report-assistant:preflight` passed, mocked
  `pnpm smoke:report-assistant:failure` passed, and live
  `pnpm smoke:report-assistant` passed for `floor-rw`, `floor-lnw`,
  `floor-deltalw`, `wall-rw`, and `floor-assembly-alternatives`.
  Live source URL counts were `4`, `9`, `13`, `4`, and `4`
  respectively; all patch previews stayed non-mutating.

### Recommended Execution Order

1. Keep the deterministic report-consistency and Impact Floor smoke work
   regression-locked. These were the previous first two slices and are
   now complete at this checkpoint; future changes should extend tests,
   not reopen the boundary between report edits and calculator physics.
2. Deepen local trace answers for `Ln,w`, `DeltaLw`, and `Rw`. This
   gives the assistant strong non-internet answers for "why did the
   calculator choose this result?" and reduces unnecessary provider
   calls.
3. Harden metric research answer quality and UI rendering. Research
   answers already expose the required structured fields, but the next
   quality pass should make comparable assembly evidence easier to audit
   and should keep fallback answers explicit when exact layer evidence is
   missing.
4. Improve challenge/retry prompts with prior answer/source context.
   The structured `previousReview` packet is implemented; the next pass
   should focus on answer quality and source comparison, not mutation.
5. Formalize the controlled Apply/Save/Export acceptance browser script
   as a reusable smoke command if we want this checkpoint flow to become
   part of every deploy gate.

Historical acceptance for the completed assistant slice:

- local targeted assistant tests pass for intent, trace explanation,
  research parsing, request lifecycle, conversation storage, and patch
  validation;
- manual edits to `primaryMetricValue`, `metrics[].value`, and
  `coverageItems[].value` produce the same consistency findings as an
  assistant metric patch;
- editor save/open-preview/PDF/DOCX and preview-page PDF/DOCX/print
  routes refuse unresolved blocking consistency findings;
- `pnpm smoke:report-assistant` includes and passes the new
  `Impact Floor` `Ln,w` / `DeltaLw` cases;
- no research answer returns or displays `suggestedReportPatch`;
- no patch preview mutates the report before explicit Apply;
- any applied metric override either has no stale old-value mentions or
  surfaces a required, user-approved consistency patch path;
- calculator engine/runtime output remains unchanged by assistant work.

Next open acceptance:

- local trace answers should consistently spell out selected basis/lane,
  used inputs, missing inputs, parked outputs, and metric-specific
  intermediate logic for the current report context;
- metric research answers should continue to expose answer,
  recommended value/range or insufficient-source reason, source quality,
  comparability, comparable assemblies, layer similarities/differences,
  confidence, missing evidence, and source URLs;
- challenge/retry answers should visibly compare the previous structured
  review with new evidence instead of only retrying the same prompt;
- Apply/Save/Export acceptance should become a maintained smoke command
  if this workflow becomes a release gate.

### Implementation Alignment Ledger - 2026-06-04

This ledger is the current source-of-truth for "are the plan, the
implementation, and the product goal aligned?" The answer is: direction
is aligned, but the assistant is not yet complete. The current
implementation is a guarded report-review assistant with working
research/proposal seams; the target is a conversational acoustic review
assistant that can explain the selected calculation, perform
source-bounded research, handle challenges, and apply report-only
overrides without breaking report consistency.

| Product goal | Current state | Code evidence | Decision |
| --- | --- | --- | --- |
| Keep assistant work out of calculator physics | Aligned. The assistant slice does not change formulas, route selection, runtime values, or source precedence. | `report-assistant-context.ts`, `report-assistant-patch.ts`, assistant API routes, and smoke scripts operate on proposal/report snapshots. | Preserve this boundary for every next slice. If engine behavior changes, it must be a separate calculator correctness slice with engine tests. |
| Explain "why did this value happen?" | Aligned for this checkpoint, with room to deepen wording. Local explain mode reports route, basis, basis category, selected lane/candidate, impact support, required/missing inputs, parked outputs, and metric-specific intermediate logic. | `simple-workbench-assistant-trace-snapshot.ts` captures compact traces; `report-assistant-context.ts` exposes output facts; `report-assistant-trace-explanation.ts` renders route/airborne/impact/resolver and intermediate-logic lines. | Keep this local/non-internet first. The next pass should improve clarity for complex parked-output narratives, not change calculator results. |
| Research "is this Rw/Ln,w/DeltaLw plausible?" | Aligned for the current guarded assistant slice. Metric research uses grounded provider output, sanitizes sources, stays non-mutating, exposes comparability/source quality/confidence/value range/value recommendation/missing evidence/comparable assemblies, and refuses research patches. | `report-assistant-plausibility.ts` defines the review shape; `report-assistant-plausibility-research.ts` parses provider JSON, promotes comparable-assembly URLs, retries transient provider failures, and returns source-backed fallback when needed. | Continue quality work on comparable-assembly evidence and answer presentation. Research must remain non-mutating and must not preload report patches. |
| Research layer/assembly alternatives | Aligned for this checkpoint. The assembly-alternative contract includes comparable assemblies, suggestions, affected layers, expected metric direction, tradeoffs, missing evidence, source quality, and non-mutating provider rules. | `report-assistant-assembly-alternatives.ts`, `report-assistant-assembly-alternatives.test.ts`, and the live `floor-assembly-alternatives` smoke case. | Keep this as the model for future metric-research UI improvements. |
| Handle challenge/retry conversation | Aligned for this checkpoint. Intent routing recognizes challenge/retry text, conversation storage is bounded and context scoped, and follow-up research attaches the latest same-context/same-metric structured `previousReview` packet plus `userChallengeText`. | `report-assistant-intent.ts`, `report-assistant-request-client.ts`, `report-assistant-request-lifecycle.ts`, `report-assistant-conversation-storage.ts`, and `report-assistant-plausibility-research.ts`. | Improve answer quality so challenge responses explicitly compare old and new evidence; keep patch generation disabled during research retry. |
| Convert "ok, lower Rw by 2 dB" into a patch | Mostly aligned for report-only preview. The patch path supports model/rule-generated `adjust_metric_db`, document signature, movement limits, explicit Apply, and adjustment audit records. | `report-assistant-patch.ts` validates and applies report-only patches; `proposal-adjust-client-page.tsx` previews before Apply. | Keep this as a separate intent after research/explain. Research answers must never preload or auto-apply patches. |
| Preserve report consistency after override | Aligned for this checkpoint. Applied assistant and manual metric overrides now run through a deterministic consistency gate. Blocking stale literal or semantic metric claims stop save/preview/export/print/copy until exact guarded replacements or manual review resolve them. | `findReportAdjustmentConsistencyMentions`, `collectReportConsistencyTextPaths`, configure save/open-preview/export gates, preview export/copy/print gate, renderer override notes, and Apply/Save/Export production acceptance. | Keep as a hard invariant. Future work is broader UX and committed smoke coverage, not reopening automatic prose mutation. |
| Prove Impact Floor assistant coverage | Aligned. The `Impact Floor / Ln,w Not ready` bridge fix is implemented, and live smoke now uses the real `Impact Floor` sample for `floor-rw`, `floor-lnw`, and `floor-deltalw`. | `scenario-analysis.ts`, `heavy-concrete-combined-impact-input-surface-acceptance.test.ts`, and `tools/smoke/report-assistant-browser-smoke.ts`. | Keep Dataholz only as an optional exact-family/control case. Impact Floor remains the primary live floor smoke. |
| Prove reliability under bad providers and browser races | Aligned for current release risk. Client request ids, timeout/abort, retry, stale-response checks, scoped storage, mocked failure smoke, production preflight, and live smoke all pass. | `report-assistant-request-client.ts`, `report-assistant-request-lifecycle.ts`, `report-assistant-browser-failure-smoke.ts`, `report-assistant-browser-smoke.ts`, `report-assistant-production-preflight.ts`. | Keep extending controlled browser coverage as new failure modes appear; provider slowness remains an operational variable, not a report mutation risk. |

### User Scenario Gap Map

1. "Bu deger neden boyle cikti?"
   Current answer can explain selected route, basis category, lane,
   candidate/support, value pins, missing inputs, parked outputs, and
   metric-specific intermediate logic. Remaining work is wording quality:
   complex parked-output cases should read more like a senior acoustic
   engineer's explanation and less like compact trace telemetry.

2. "Internete cik, bu Rw fazla mi / Ln,w makul mu?"
   Current answer can call grounded research, show source URLs, stay
   non-mutating, and expose value/range recommendation,
   insufficient-source reason, source quality, comparability, comparable
   assemblies, layer similarities/differences, confidence, and missing
   evidence. Remaining work is quality and presentation: make it easier
   for the operator to audit why a source is direct, same-family,
   partial, or not comparable.

3. "Bence yaniliyorsun, bir daha arastir / su kaynagi dikkate al."
   Current routing sends this to research, attaches the previous
   same-document/same-metric structured review packet, includes the user
   challenge text, and preserves prior sources when a retry degrades.
   Remaining work is answer quality: the response should explicitly say
   what changed or did not change versus the prior review.

4. "Haklisin, Rw'yi 2 dB dusur."
   Current guarded patch preview and Apply flow can do this for
   report-only values, keeps calculator inputs and engine truth
   unchanged, records report adjustments, and requires consistency
   resolution before save/preview/export.

5. "PDF/DOCX raporunda eski deger kalmasin."
   Current editor and preview gates block stale literal values and
   metric-affine qualitative claims before save, preview, copy, print,
   PDF, and DOCX export. Remaining work is operational: decide whether
   the controlled Apply/Save/Export acceptance script should become a
   committed smoke command.

### Next Slice Backlog

Slice A - Impact Floor assistant smoke reset (completed at checkpoint):

- `tools/smoke/report-assistant-browser-smoke.ts` now includes
  `floor-lnw` and `floor-deltalw` on the real `Impact Floor` sample,
  plus `floor-rw`, `wall-rw`, and `floor-assembly-alternatives`;
- the smoke requires numeric `output:Ln,w` and `output:DeltaLw` report
  values, not `Not ready`;
- the smoke runs context explain, source research, and guarded patch
  preview for both impact metrics;
- production live smoke passed at checkpoint with source URL counts
  `4`, `9`, `13`, `4`, and `4` for the default case set.

Slice B - trace/explain depth:

- extend `SimpleWorkbenchAssistantTraceSnapshot` with an output-status
  summary map: output id, status, selected basis category, used inputs,
  missing inputs, parked reason, supported/unsupported reason, value
  pin, and short formula/support note;
- update `report-assistant-trace-explanation.ts` so impact answers
  explicitly say whether the result came from a published anchor,
  formula corridor, bound, `needs_input`, or `unsupported` boundary;
- add tests for `Impact Floor` `Rw`, `Ln,w`, `DeltaLw`, `Ln,w+CI`, and
  at least one field impact output;
- acceptance: "why" prompts can be answered locally without internet and
  without creating a patch draft.

Slice C - structured metric research:

- add `valueRecommendation` and `comparableAssemblies` to
  `ReportAssistantPlausibilityReview`;
- normalize comparability to the product-facing buckets
  `direct`, `same_family`, `partial`, `not_comparable` while preserving
  parser compatibility with existing provider words;
- require visible answer sections for recommendation/range, source
  quality, comparability, comparable assemblies, matching layers,
  weakening differences, confidence, missing evidence, and source URLs;
- acceptance: provider responses missing these fields fall back to an
  explicit "insufficient structured evidence" answer, not a confident
  free-text verdict.

Slice D - challenge/retry memory:

- persist the last safe research review as structured metadata scoped by
  document signature and metric id;
- include previous verdict, value/range, recommendation, comparability,
  source quality, source URLs/titles, and user challenge text in
  challenge/retry research requests;
- keep patch generation disabled for challenge/retry answers;
- acceptance: "bence yaniliyorsun" changes the request body compared
  with a fresh research request and no patch draft appears.

Slice E - report consistency gate:

- after any applied metric override, compute unresolved stale old-value
  mentions against the updated document;
- block PDF/DOCX export and saved snapshot promotion when unresolved
  stale mentions remain, showing exact paths and a button to generate
  guarded replacements;
- keep broad prose rewriting forbidden: only literal, path-checked
  `replace_report_text_value` operations may resolve stale mentions;
- acceptance: `Rw -2 dB` can either export with no stale mentions or is
  blocked with exact stale locations until the user approves the
  consistency patch.

### Stop Rules

- Do not change engine formulas, layer interpretation, resolver
  precedence, or runtime values inside assistant slices.
- Do not treat web research as calibration. It is plausibility evidence
  only unless a separate calculator source-acquisition slice is opened.
- Do not let research/explain responses return or display
  `suggestedReportPatch`.
- Do not apply patches automatically, including retry/follow-up paths.
- Do not deploy or alter provider configuration from this plan update
  alone.

### AI Strengthening Edge-Case Audit - 2026-06-04

Checkpoint note: this edge-case audit is partially historical. Several
required strengthenings listed below are now implemented, especially
widened assistant context identity, output facts, product-facing
comparability buckets, previous-review research packets, metric-aware
consistency gates, and export/save blocking. Remaining useful items are
trace wording quality, research evidence presentation, and continued
browser/provider reliability coverage.

This iteration narrows the plan to work that actually makes the
assistant smarter and safer. Do not spend the next slice on cosmetic chat
features, streaming, MCP wiring, or broader prose generation. The high
leverage work is better context identity, better calculation facts,
better source-grounded review structure, better challenge memory, and a
harder consistency gate.

#### Implementation Edge Cases

| Edge case | Current implementation reality | Risk | Required strengthening |
| --- | --- | --- | --- |
| Same metric values, different assembly | `createReportAssistantDocumentSignature` signs primary/metric/coverage values and warnings, but not `layers`, `studyModeLabel`, `contextLabel`, `reportProfile`, method trace, or `assistantTraceSnapshot`. | Conversation restore, retry, or challenge context can survive when the visible values stay similar but the layer combination changes. That is dangerous for source research. | Add a separate `reportContextSignature` or widen the existing signature for assistant conversation/research to include layer rows, study mode, context labels, trace snapshot digest, and output statuses. Patch validation can keep the current metric-focused signature, but research memory needs assembly identity. |
| "Why is Ln,w available but Ln,w+CI parked?" | `AssemblyCalculation` already exposes `supportedTargetOutputs`, `unsupportedTargetOutputs`, `acousticAnswerBoundary`, `airborneBasis`, and resolver `supportedMetrics` / `valuePins`. The assistant snapshot does not yet convert this into an output-by-output fact table. | Trace answers can name route/lane but still fail the user's real question: which output was calculated, which was parked, and which input blocked it. | Build an `assistantOutputFacts` table: output id, status, basis category, selected candidate id, support bucket, value pin, used inputs, missing inputs, unsupported reason, parked reason, and formula/support note. |
| Published anchor vs formula corridor vs bound | Current explain text has `candidateKind`, `supportBucket`, `impactBasis`, `impactSupport`, and value pins, but no user-facing normalized basis category. | The assistant may say "basis/predictor" without telling whether this is a published anchor, a formula corridor, a bound, `needs_input`, or unsupported. | Add deterministic basis taxonomy in trace explanation: `published_anchor`, `formula_corridor`, `exact_measured`, `bound`, `field_adapter`, `needs_input`, `unsupported`, `source_absent_estimate`. |
| Metric research answer is structured but not acoustic-specific enough | `ReportAssistantPlausibilityReview` has `comparability`, `sourceQuality`, `confidence`, `valueRange`, `missingEvidence`, sources, and recommendation text. It lacks comparable assemblies and layer match/difference notes. | A source-backed answer can look credible without showing whether the cited assembly is actually comparable to the current build-up. | Add `valueRecommendation` and `comparableAssemblies` to metric research, reusing assembly-alternative concepts: matching layers, material differences, thickness/mass differences, missing test evidence, and published metrics. |
| Current comparability buckets do not match the product language | Metric research currently uses `direct`, `partial`, `weak`, `insufficient`; the product goal needs `direct`, `same_family`, `partial`, `not_comparable`. | Provider and UI language can blur "weak source" with "not comparable assembly". | Normalize provider aliases into product-facing buckets while preserving backward compatibility. Source quality remains separate: `none`, `weak`, `mixed`, `strong`. |
| Challenge/retry uses conversation text, not review facts | Conversation stores text, metric id, recommendation text, source/status. It does not store previous verdict, value range, comparability, source quality, missing evidence, comparable assemblies, or source ids. | "Bence yaniliyorsun, tekrar bak" can become a fresh research prompt plus truncated text, not a real rebuttal against the previous evidence. | Store a bounded `lastResearchReviewPacket` by document/context signature and metric id. Challenge requests must include previous verdict, recommendation, value/range, confidence, source titles/URLs, comparable assembly ids, and the user challenge. |
| Truncated conversation can drop important evidence | `buildAssistantConversationInstruction` trims recent messages to short text blocks. | Follow-up research may lose exact source URLs, source notes, or value range details needed for a good challenge response. | Keep text conversation for UX, but use structured review packets for model/research request context. |
| Research fallback can be mistaken for internet research | Provider fallback returns context-only review with warnings and `sourceQuality: none`, but the user-facing answer must make this impossible to miss. | User may think "internetten baktim" happened when the provider failed or was unavailable. | Enforce a visible answer banner/state: `source: context` must say "No internet/source research was completed" and must not show source-backed recommendation language. Smoke this path. |
| Needs-input / unsupported outputs during research | The prompt says not to turn `needs_input` or unsupported outputs into numeric claims, and patch validation rejects numeric patches for those statuses. | Provider may still return a numeric recommendation in `answerText` or `recommendedActionText`; UI may display it as advice. | Deterministically downgrade review to `insufficient_context`, clear numeric value recommendations, and show the missing/unsupported reason when selected metric status is `needs_input` or `unsupported`. |
| Multiple metrics share the same old value | Stale mention replacement is literal value based. If `50 dB` appears for Rw and Ln,w or inside unrelated prose, the UI may propose broad path replacement and `replacementCount > 1` only warns. | A consistency patch can fix one stale metric while accidentally changing another numeric claim in the same text field. | Make stale mention detection metric-aware: identify metric label + old value spans where possible, mark ambiguous numeric-only mentions as blocked/manual-review, and avoid replacing all occurrences in a field unless every occurrence is classified. |
| Export after applied override | Implemented at checkpoint. Applied metric overrides record `reportAdjustments`, and editor/preview egress paths recompute unresolved stale literal or semantic findings before save, preview, copy, print, PDF, or DOCX. | The remaining risk is future regression if a new report text surface is added without registering it in the consistency path registry. | Keep the registry tests and export-gate tests current whenever proposal document fields or renderers change. |
| Same-document race after user edits | Request lifecycle checks request id and document signature. If signature does not include layer/trace identity, some context changes may not invalidate old research. | Slow research answer can land on a visually changed assembly if values are unchanged. | Tie request lifecycle for research/explain to the widened context signature, not only the metric/report value signature. |
| Patch generated from research recommendation | Follow-up patch builder uses the last recommendation text and metric. It intentionally asks for a guarded patch only when the user sends an explicit follow-up. | If the recommendation text is vague or offers alternatives, follow-up could infer the wrong direction/target. | Require a concrete metric, target or delta, and direction agreement. If recommendation says "1-2 dB" or alternatives, ask one clarifying follow-up instead of picking a value. |
| Live smoke source flakiness | `pnpm smoke:report-assistant` relies on live auth, provider, and internet grounding. Source count and text shape can fluctuate. | A brittle smoke can fail for provider variability instead of product regression. | Keep live smoke focused on invariant contract checks: metric context exists, answer source state, non-mutation, sources sanitized when present, no patch from research, patch preview only. Put exact malformed provider cases in mocked failure smoke. |
| Provider JSON is structurally valid but semantically weak | Current parser validates enum-ish fields and source URLs but cannot prove the source supports the claim. | A model can return `sourceQuality: strong` with irrelevant sources. | Add deterministic confidence downgrades: no sources -> `none/low`; no comparable assemblies -> not above `partial/medium`; direct claim without matching layer evidence -> downgrade and add missing evidence. |

#### Strengthening Priorities

Priority 0 - Context identity and output facts:

- create an assistant context identity that includes layer rows,
  study/context labels, report profile, trace snapshot digest, target
  output status, and metric values;
- add `assistantOutputFacts` to the trace snapshot or assistant context;
- use the context identity for conversation restore, retry, stale
  response guards, challenge packets, and research request bodies.

Priority 1 - Local calculation explanation:

- make local explain answers strong enough that the assistant does not
  need the internet to answer "how was this specific result calculated?";
- require explanation for `Rw`, `Ln,w`, `DeltaLw`, `Ln,w+CI`, and field
  impact outputs;
- include selected basis category, lane, support bucket, value pin,
  used inputs, missing inputs, parked outputs, and warnings.

Priority 2 - Research evidence model:

- extend metric research to include `valueRecommendation`,
  `comparableAssemblies`, matching layer notes, weakening differences,
  missing evidence, source quality, comparability, confidence, and source
  URLs;
- add deterministic semantic downgrades when source evidence is missing
  or not comparable;
- make provider free text secondary to the structured evidence model.

Priority 3 - Challenge memory:

- persist the last structured research review packet, not only text;
- challenge/retry prompts must include the previous evidence packet and
  ask the provider to revise, defend, or downgrade the earlier answer;
- no challenge/retry path may generate a patch.

Priority 4 - Report consistency:

- replace broad literal stale-value replacement with metric-aware stale
  mention classification;
- block export/save promotion after report adjustments when unresolved
  stale mentions remain;
- let the user approve only exact, path-checked consistency operations.

Priority 5 - Smoke strategy:

- live smoke proves the happy-path contracts on real `Impact Floor`
  `Ln,w` / `DeltaLw` and existing `Rw` cases;
- mocked smoke proves provider 500, invalid JSON, timeout, rapid race,
  refresh restore, cross-document discard, and Retry latest;
- every smoke must assert non-mutation after explain/research and patch
  preview before Apply.

#### What Not To Build Yet

- No streaming chat. It does not improve calculation truth, evidence
  quality, or report consistency.
- No external MCP deployment. The in-app assistant still has unresolved
  context, evidence, and consistency gaps.
- No freeform report rewriting. Only metric-aware, path-checked,
  literal stale-value consistency operations are allowed.
- No automatic layer changes or calculator input edits. Alternative
  research remains advisory until a separate calculator-editing product
  contract exists.
- No engine calibration from web research. Source research can flag
  plausibility concerns, but calculator formulas move only in separate
  engine/source-acquisition slices.

#### Compaction-Safe Implementation And Test Checklist

This checklist is intentionally explicit so the next run does not lose
the plan after context compaction. Treat these as the next assistant
hardening tasks in order. Each task needs implementation plus tests; do
not mark a task complete from code changes alone.

1. Context identity / signature hardening:
   - implement either `reportContextSignature` or a widened assistant
     context signature for research, explain, conversation restore,
     retry, and stale-response guards;
   - include layer rows, study mode, context labels, report profile,
     trace snapshot digest, output statuses, and metric values;
   - keep patch validation's metric/document signature compatible unless
     a separate patch migration is deliberately needed;
   - tests to add/update:
     `report-assistant-context.test.ts` or a new focused test proving two
     documents with identical metric values but different layer rows get
     different assistant context signatures;
     `report-assistant-conversation-storage.test.ts` proving
     same-value/different-layer conversations are discarded;
     `report-assistant-request-lifecycle.test.ts` proving stale research
     results are rejected when only the widened context identity changes.
   - status 2026-06-04: implemented as
     `assistantContextSignature`. It includes layer rows, study/context
     labels, report profile, method trace rows, output statuses, metric
     values, warnings, and the assistant trace snapshot. Patch
     validation still uses the narrower `documentSignature` so existing
     metric patch safety remains compatible. The client now passes
     `assistantContextSignature` through the existing request lifecycle
     and conversation storage `documentSignature` field, while patch JSON
     placeholders and patch validation continue to use
     `documentSignature`.
   - validation 2026-06-04: targeted assistant Vitest passed for
     `report-assistant-context.test.ts`,
     `report-assistant-conversation-storage.test.ts`,
     `report-assistant-request-lifecycle.test.ts`,
     `report-assistant-instruction.test.ts`,
     `report-assistant-intent.test.ts`,
     `report-assistant-trace-explanation.test.ts`,
     `report-assistant-patch.test.ts`, and
     `proposal-adjust-layout.test.ts` (8 files / 53 tests). Scoped
     ESLint passed for the changed assistant/context/client/layout files.
     `pnpm --filter @dynecho/web typecheck` was rerun after fixing the
     new context fixture and no longer reports errors in the changed
     context-signature files; it is still blocked by unrelated existing
     test type errors in
     `layer-combination-resolver-candidate-surface-parity.test.ts`,
     several `post-v1-floor-*` preset tests, and
     `post-v1-floor-field-a-weighted-surface-gate-ac.test.ts`. Local
     package commands also warn that this shell is Node v20.19.5 while
     the repo asks for Node >=22.

2. Output fact table:
   - add `assistantOutputFacts` to `ReportAssistantContext` or
     `SimpleWorkbenchAssistantTraceSnapshot`;
   - each output fact should include output id, status, basis category,
     selected candidate id, support bucket, value pin, used inputs,
     missing inputs, unsupported/parked reason, formula/support note, and
     relevant warnings;
   - tests to add/update:
     `simple-workbench-assistant-trace-snapshot.test.ts` for supported
     `Rw`, supported `Ln,w`, supported `DeltaLw`, unsupported
     `Ln,w+CI`, and at least one field impact output;
     `report-assistant-context.test.ts` proving output facts survive
     context payload parse/round-trip;
     one Impact Floor fixture test proving published anchor and formula
     corridor outputs are represented without moving engine values.
   - status 2026-06-04: core implementation added as
     `assistantOutputFacts` on `ReportAssistantContext`, not inside the
     stored trace snapshot. Each fact carries metric id/output id, report
     and engine display values, status, basis, normalized basis category,
     selected candidate id, support bucket, value pin, used inputs,
     missing inputs, parked reason, support/formula note, and bounded
     warnings. `parseReportAssistantContextPayload` now round-trips this
     table and builds minimal legacy fallback facts when old payloads do
     not include it.
   - trace/explain status 2026-06-04: `report-assistant-trace-explanation`
     now includes output fact lines in metric-specific answers and adds
     basis category / parked reason to metric context lines. This is the
     bridge for later deeper questions such as "Ln,w neden live?",
     "DeltaLw hangi inputlarla geldi?", and "Ln,w+CI neden park edildi?"
   - validation 2026-06-04: targeted assistant Vitest passed for
     `report-assistant-context.test.ts`,
     `report-assistant-conversation-storage.test.ts`,
     `report-assistant-request-lifecycle.test.ts`,
     `report-assistant-instruction.test.ts`,
     `report-assistant-intent.test.ts`,
     `report-assistant-trace-explanation.test.ts`,
     `report-assistant-patch.test.ts`, and
     `proposal-adjust-layout.test.ts` (8 files / 54 tests). Scoped ESLint
     passed for the changed output fact/context/parser/explanation files.
     Web typecheck was rerun and still stops only on the unrelated
     existing test type errors already listed under item 1; no new output
     fact files are in the typecheck failure list. Remaining gap for this
     item: add the broader Impact Floor fixture/smoke proof for published
     anchor vs formula corridor outputs without moving engine values.

3. Trace explanation depth:
   - update `report-assistant-trace-explanation.ts` to answer with
     deterministic basis categories:
     `published_anchor`, `formula_corridor`, `exact_measured`, `bound`,
     `field_adapter`, `needs_input`, `unsupported`,
     `source_absent_estimate`;
   - include used inputs, missing inputs, parked outputs, and metric
     intermediate logic for `Rw`, `Ln,w`, `DeltaLw`, `Ln,w+CI`, and field
     impact metrics;
   - tests to add/update:
     `report-assistant-trace-explanation.test.ts` with direct prompts
     for "Ln,w neden hesaplandi?", "DeltaLw hangi inputlarla geldi?",
     "Ln,w+CI neden park edildi?", and "Rw hangi lane/basis?";
     a UI/source contract test ensuring explain intent does not call
     research and does not create a patch draft.
   - status 2026-06-04: core trace-depth implementation is in place.
     Metric-specific trace answers now include deterministic basis
     category explanations for all planned categories, output fact lines,
     used/missing input coverage, parked output lines, and intermediate
     logic for `Rw`, `Ln,w`, `DeltaLw`, `Ln,w+CI`, plus generic
     impact/field metrics. Explain responses remain local/context-only:
     they do not call research endpoints and do not create patch drafts.
   - validation 2026-06-04: `report-assistant-trace-explanation.test.ts`
     now directly covers "Ln,w neden hesaplandi?", "DeltaLw hangi
     inputlarla geldi?", "Ln,w+CI neden park edildi?", and "Rw hangi
     lane ve basis?" style prompts. `proposal-adjust-layout.test.ts`
     now asserts the explain handler uses `buildReportAssistantContextTraceAnswer`,
     records `source: "context"`, includes "No report value was changed",
     and does not contain `sendReportAssistantRequest` or `setPatchDraft`.
     Targeted assistant Vitest passed for 8 files / 56 tests; scoped
     ESLint passed for changed trace/context/layout files. Web typecheck
     still stops on the unrelated pre-existing test type errors listed
     above, with no new trace explanation files in the failure list.

4. Structured metric research:
   - extend `ReportAssistantPlausibilityReview` with
     `valueRecommendation` and `comparableAssemblies`;
   - normalize comparability to product-facing buckets:
     `direct`, `same_family`, `partial`, `not_comparable`;
   - preserve parser compatibility with current provider words such as
     `weak`, `insufficient`, `limited`, and `same family`;
   - include matching layers, weakening differences, missing evidence,
     published metric values/ranges, source ids/URLs, source quality, and
     confidence;
   - tests to add/update:
     `report-assistant-plausibility-research.test.ts` proving provider
     output with comparable assemblies is parsed and rendered;
     tests proving no sources downgrades to `sourceQuality: none` /
     low confidence;
     tests proving sources without comparable assemblies cannot claim
     `direct` comparability or high confidence;
     tests proving research responses still suppress
     `suggestedReportPatch`.
   - status 2026-06-04: core structured research schema is implemented.
     `ReportAssistantPlausibilityReview` now carries
     `valueRecommendation` and `comparableAssemblies`. Comparability is
     normalized to the product-facing buckets `direct`, `same_family`,
     `partial`, and `not_comparable`; legacy provider words such as
     `weak`, `limited`, `insufficient`, and `same family` are accepted as
     aliases but not surfaced as final buckets. Source research request
     contracts now explicitly ask for value recommendation,
     comparable assemblies, matching layers, weakening differences,
     source quality, confidence, missing evidence, and
     insufficient-source reason. Research responses still suppress
     provider-supplied `suggestedReportPatch`.
   - UI status 2026-06-04: the proposal assistant plausibility panel and
     conversation text now render value recommendation/range,
     comparable assemblies, similar layers, weakening differences,
     comparison notes, and comparable assembly source links. This keeps
     "Rw fazla mi?" answers auditable without making the research path a
     patch path.
   - validation 2026-06-04:
     `report-assistant-plausibility-research.test.ts` now proves provider
     comparable assemblies and value recommendation are parsed, unsafe
     source URLs are filtered, no-source reviews downgrade to
     `sourceQuality: none` / low confidence / `not_comparable`, sources
     without comparable assemblies cannot keep `direct` comparability or
     high confidence, legacy comparability aliases normalize correctly,
     and research responses still suppress `suggestedReportPatch`.
     Web-package targeted Vitest passed for
     `report-assistant-plausibility.test.ts`,
     `report-assistant-plausibility-research.test.ts`, and
     `proposal-adjust-layout.test.ts` (3 files / 23 tests). A wider
     assistant web Vitest packet passed for 10 files / 74 tests. Scoped
     ESLint passed for changed plausibility/research/UI files. Web
     typecheck was rerun after fixing new UI parser type errors; it now
     again stops only on the unrelated pre-existing test type errors
     listed under item 1.

5. Needs-input / unsupported research guard:
   - if selected metric status is `needs_input` or `unsupported`, force
     research result to `insufficient_context`, clear numeric
     `valueRecommendation`, and show missing/unsupported reason;
   - tests to add/update:
     `report-assistant-plausibility.test.ts` and
     `report-assistant-plausibility-research.test.ts` proving provider
     numeric advice is ignored for `needs_input` / `unsupported`;
     UI source contract test proving no "Load suggested patch" appears
     for these states.
   - status 2026-06-04: provider-backed plausibility research is now
     sanitized after provider parsing for parked metric states. When the
     requested metric is `needs_input` or `unsupported`, the final review
     is forced to `verdict: insufficient_context`, `confidence: low`,
     `comparability: not_comparable`, and `severity: medium`. Provider
     numeric ranges, numeric value recommendations, comparable assembly
     claims, and `suggestedReportPatch` are discarded. The final answer
     keeps only safe source context and explains the exact parked reason
     from the output fact / next step, so internet research cannot
     publish or recommend a number for an output the engine has not made
     live.
   - validation 2026-06-04:
     `report-assistant-plausibility-research.test.ts` now loops over a
     `DeltaLw` `needs_input` case and an `IIC` `unsupported` case where
     the mocked provider tries to return `direct` comparability, high
     confidence, numeric `valueRange`, numeric `valueRecommendation`,
     comparable assemblies, and a patch. The test proves all of that
     provider advice is downgraded/removed and the parked reason is
     preserved. `proposal-adjust-layout.test.ts` also pins that "Load
     suggested patch" remains conditional on
     `plausibilityReview.suggestedReportPatch`, which the parked-metric
     sanitizer clears. Targeted web Vitest passed for
     `report-assistant-plausibility.test.ts`,
     `report-assistant-plausibility-research.test.ts`, and
     `proposal-adjust-layout.test.ts` (3 files / 24 tests). A wider
     assistant web Vitest packet passed for 10 files / 75 tests. Scoped
     ESLint passed for the changed plausibility/research/UI files. Web
     typecheck was rerun; it still stops only on the unrelated
     pre-existing test type errors listed under item 1.

6. Structured challenge/retry memory:
   - persist a bounded `lastResearchReviewPacket` scoped by widened
     assistant context signature and metric id;
   - include previous verdict, value/range, value recommendation,
     comparability, source quality, confidence, missing evidence,
     comparable assemblies, source URLs/titles, and user challenge text
     in challenge/retry request bodies;
   - challenge/retry must remain research-only and non-mutating;
   - tests to add/update:
     `report-assistant-conversation-storage.test.ts` for packet
     sanitization, bounding, same-context restore, and different-context
     discard;
     `report-assistant-intent.test.ts` for "bence yaniliyorsun",
     "bir daha arastir", and "su kaynagi dikkate al";
     request-body unit tests proving challenge request includes previous
     structured evidence and differs from a fresh research request;
     UI/source contract test proving challenge/retry does not create
     patch draft or expose `suggestedReportPatch`.
   - status 2026-06-04: structured metric research memory is now
     implemented as a bounded `researchReviewPacket` stored on generated
     assistant conversation messages. The packet is persisted under the
     widened `assistantContextSignature` conversation key and includes
     verdict, reviewed value, value/range recommendation, comparability,
     source quality, confidence, missing evidence, comparable
     assemblies, source titles/URLs, recommended action, and the
     original user instruction. Packet sanitization drops unsafe source
     URLs, bounds long text/list fields, and never stores model patch
     payloads. Challenge/retry prompts such as "bence yaniliyorsun",
     "bir daha arastir", and "su kaynagi dikkate al" now resolve to the
     research path and attach the latest same-context, same-metric
     packet as `previousReview` with `userChallengeText`. The provider
     request contract explicitly tells the model to address the previous
     verdict/evidence and the new challenge text, while `suggestPatch`
     remains `false`.
   - validation 2026-06-04:
     `report-assistant-conversation-storage.test.ts` now proves packet
     sanitization, same-context restore, same-metric lookup, different
     metric discard, different context discard, and unsafe URL removal.
     `report-assistant-intent.test.ts` now covers both the existing
     "bence yaniliyorsun, bir daha arastir" path and the source-focused
     "su kaynagi dikkate al" follow-up. `report-assistant-plausibility-
     research.test.ts` now proves challenge request bodies include
     previous structured evidence and `userChallengeText`, and that stale
     previous packets are omitted when metric/context no longer matches.
     `proposal-adjust-layout.test.ts` pins the UI contract:
     `getLatestReportAssistantResearchReviewPacket`,
     `createReportAssistantResearchReviewPacket`, `previousReview`, and
     `userChallengeText` are wired through the research route instead of
     the patch route. Targeted web Vitest passed for 5 files / 46 tests.
     A wider assistant web Vitest packet passed for 11 files / 87 tests.
     Scoped ESLint passed for changed storage, intent, plausibility,
     research, and proposal-adjust files. Web typecheck was rerun; it
     still stops only on the unrelated pre-existing test type errors
     listed under item 1.

7. Metric-aware report consistency gate:
   - replace broad literal stale-value replacement with metric-aware stale
     mention classification;
   - classify mentions as exact metric-label/value match, ambiguous
     numeric-only match, unrelated numeric mention, or unresolved;
   - block PDF/DOCX export and saved snapshot promotion when unresolved
     or ambiguous stale mentions remain after `reportAdjustments`;
   - tests to add/update:
     `report-assistant-patch.test.ts` for duplicate old values across
     `Rw` and `Ln,w`, multiple occurrences in one text field, ambiguous
     numeric-only prose, and exact label/value replacement;
     `proposal-adjust-layout.test.ts` or a focused configure-page test
     proving export is blocked until consistency is resolved;
     smoke failure or browser test proving Apply does not automatically
     rewrite prose and export gate shows exact paths.
   - status 2026-06-04: metric-aware consistency classification is now
     implemented in `report-assistant-patch.ts` without changing the
     existing literal mention finder. New
     `findReportAdjustmentConsistencyMentions` walks applied
     `reportAdjustments`, finds old `beforeValue` mentions in allowed
     report text fields, and classifies each mention as
     `exact_metric_label_value`, `ambiguous_numeric_only`,
     `unrelated_numeric_mention`, or `unresolved`. Exact
     metric-label/value, ambiguous numeric-only, and unresolved mentions
     are blocking; unrelated numeric mentions are surfaced as
     non-blocking. The configure page now computes this gate from the
     editable proposal snapshot. If blocking mentions remain, `Save
     edits`, `Open preview`, PDF download, and DOCX download are
     blocked/disabled and the UI shows the exact path, metric label,
     old/new value, and classification. The existing Apply flow still
     does not automatically rewrite prose; stale text is resolved only
     through the guarded `replace_report_text_value` operation.
   - validation 2026-06-04:
     `report-assistant-patch.test.ts` now covers exact Rw label/value
     matches, ambiguous numeric-only mentions, unrelated old-value
     mentions attached to another metric label, unresolved same-metric
     mentions, duplicate old values across Rw and Ln,w, and clean state
     after approved text replacements. `proposal-adjust-layout.test.ts`
     pins `findReportAdjustmentConsistencyMentions`,
     `reportConsistencyGateBlocked`, the visible "Report consistency
     blocks save/export" UI, the export error copy, and disabled
     PDF/DOCX export buttons. Targeted patch/layout Vitest passed for 2
     files / 17 tests. A wider assistant web Vitest packet passed for 11
     files / 89 tests. Scoped ESLint passed for changed patch and
     proposal-adjust files. Web typecheck was rerun; it still stops only
     on the unrelated pre-existing test type errors listed under item 1.

8. Smoke coverage:
   - update live smoke only after local unit/UI coverage passes;
   - live smoke must include `Impact Floor` `Ln,w` and `DeltaLw` as real
     cases, plus existing `Rw`;
   - live smoke assertions should be invariant: metric context exists,
     answer source state is correct, source URLs are sanitized when
     present, no research mutation, no research patch, patch preview only
     before Apply;
   - mocked failure smoke should cover provider 500, invalid JSON,
     timeout, rapid two-message race, refresh/reopen restore,
     same-value/different-layer discard, cross-document discard, and
     `Retry latest`;
   - tests/commands to run before completion:
     targeted assistant Vitest files;
     targeted ESLint for changed assistant files and smoke scripts;
     `pnpm exec tsc --project tsconfig.json --noEmit`;
     `pnpm smoke:report-assistant:failure` against a matching local or
     deployed build;
     `pnpm smoke:report-assistant:preflight` before any live production
     smoke;
     `pnpm smoke:report-assistant` only when preflight passes and live
     provider cost/flakiness is acceptable.
   - status 2026-06-04: live smoke case selection is now aligned with
     the Impact Floor assistant goal. The default live smoke set is
     `floor-rw`, `floor-lnw`, `floor-deltalw`, `wall-rw`, and
     `floor-assembly-alternatives`. `floor-lnw` now uses the real
     `Impact Floor` sample instead of `Dataholz CLT Dry`, and the new
     `floor-deltalw` case verifies live `DeltaLw` metric context,
     trace/explain, source research with URLs, and a preview-only
     `output:DeltaLw` patch. Production preflight now also checks for
     the new DeltaLw smoke string and the report consistency export-gate
     UI string before live smoke is allowed to run. The mocked browser
     failure smoke now includes invalid JSON provider responses in
     addition to provider 5xx recovery, slow-provider timeout,
     same-document conversation restore, cross-document discard,
     interrupted patch request recovery, retry controls, and preserved
     metric context.
   - validation 2026-06-04:
     `pnpm exec eslint tools/smoke/report-assistant-browser-smoke.ts
     tools/smoke/report-assistant-browser-failure-smoke.ts
     tools/smoke/report-assistant-production-preflight.ts` passed.
     `pnpm exec tsc --project tsconfig.json --noEmit` passed for the
     repo-level tool TypeScript project. After deployment, `pnpm
     smoke:report-assistant:preflight` passed against production with
     root `200`, login `200`, status `200`, configure `200`, model ready,
     research ready, `mutatingToolsExposed: false`, and no missing
     production bundle strings. `pnpm smoke:report-assistant:failure`
     passed against production. The result reported
     `assemblyTimeoutCalls: 2`,
     `invalidJsonFailureCalls: 2`, `providerFailureRecoveryCalls: 5`,
     `patchNetworkRecoveryCalls: 2`,
     `sameDocumentConversationRestored: true`,
     `crossDocumentConversationDiscarded: true`,
     `metricContextPreserved: true`, and `mutationApplied: false`.
     The first live provider smoke then failed at `floor-rw` metric
     research because the UI received a context-only fallback instead of
     `SOURCE RESEARCH`; the adjacent `system_llm` log showed a Gemini
     proxy `503 Service Unavailable` after about `28023 ms`. This is now
     tracked as a live-provider reliability issue rather than a patch or
     report-consistency failure.
   - reliability hardening 2026-06-04: source research provider calls now
     retry transient HTTP `408`/`429`/`5xx`, abort, and network failures
     once before falling back to context-only review. Invalid or malformed
     provider shapes still use the existing strict JSON retry path, and
     research fallback still remains non-mutating and visibly
     context-only. Unit tests cover recovered `503`, repeated `503`
     fallback, and non-transient `400` no-retry behavior.
   - parser hardening 2026-06-04: live Gemini research sometimes returns
     valid evidence URLs under `comparableAssemblies[].sourceUrl` rather
     than top-level `sources`. The parser now promotes those assembly
     URLs into structured `review.sources`, so the answer no longer says
     source metadata is missing when comparable assembly evidence is
     present. Unit tests cover this shape.
   - source fallback hardening 2026-06-04: if the provider still misses
     required verdict/severity fields after strict JSON retry but returns
     real http/https source evidence, the route now returns a
     low-confidence `SOURCE RESEARCH` fallback instead of a context-only
     answer. This keeps source evidence visible while refusing numeric
     recommendations and patches from malformed provider output.
   - client-timeout hardening 2026-06-04: source research browser
     requests now use a longer default timeout budget (`90000 ms`, capped
     at `120000 ms`) than patch/finding requests. A source-research
     timeout no longer starts a second automatic browser attempt, because
     the server-side research route already owns provider retry and the
     user has an explicit `Retry research` control.
   - smoke-tool hardening 2026-06-04: browser smoke helpers now wait for
     the assistant button to enter and leave its busy state before reading
     the page body. This prevents live source-research smoke from reading
     the previous context-only explain answer while a research request is
     still in flight.
   - final production validation 2026-06-04: after the retry/parser/
     timeout hardening was deployed, production preflight passed with
     root/login/status/configure `200`, model ready, research ready, no
     missing bundle strings, and `mutatingToolsExposed: false`. Mocked
     failure smoke passed with `assemblyTimeoutCalls: 1`,
     `invalidJsonFailureCalls: 2`, `providerFailureRecoveryCalls: 5`,
     `patchNetworkRecoveryCalls: 2`,
     `sameDocumentConversationRestored: true`,
     `crossDocumentConversationDiscarded: true`,
     `metricContextPreserved: true`, and `mutationApplied: false`. Full
     live browser smoke passed for `floor-rw`, `floor-lnw`,
     `floor-deltalw`, `wall-rw`, and `floor-assembly-alternatives`; live
     source URL counts were `4`, `4`, `3`, `1`, and `4` respectively, all
     patch previews stayed non-mutating, and `floor-rw` added guarded
     stale-text replacements for report consistency.
   - challenge/retry hardening 2026-06-04: a later real browser
     conversation test found that a follow-up such as `bence
     yanılıyorsun, bir daha araştır; önceki kaynakları da dikkate al`
     could drop to context-only review if the provider returned malformed
     structured JSON on the retry. The server now preserves the previous
     same-context source-backed research packet as a low-confidence
     `SOURCE RESEARCH` fallback, explicitly warns that the fresh retry
     failed, refuses report patches from that fallback, and keeps the
     previous URLs visible for audit.
   - real conversation re-test 2026-06-04: production browser was driven
     through trace explanation, live Rw research, challenge/retry with
     previous sources, Rw `-2 dB` patch proposal, guarded stale-text
     replacement, `Apply validated patch`, and `Save edits` in an
     isolated browser context. The final report context showed `Rw`
     report `56 dB` while engine stayed `58 dB`; patch draft contained
     both `adjust_metric_db` and `replace_report_text_value`; save was not
     blocked by stale consistency text. After that, full live smoke passed
     again for `floor-rw`, `floor-lnw`, `floor-deltalw`, `wall-rw`, and
     `floor-assembly-alternatives`, and mocked failure smoke passed again
     with `mutationApplied: false`.
   - remaining smoke note 2026-06-04: rapid two-message browser race is
     still covered by request lifecycle unit tests rather than the
     browser smoke, because the current UI disables the Ask button while
     a request is active. Add a browser-level stale-response race only if
     the UI later permits concurrent sends or exposes a test hook.

Completion rule for this checklist:

- every implemented item must have deterministic unit or UI tests;
- every live-provider behavior must have either a live smoke assertion or
  a mocked failure smoke equivalent;
- no assistant hardening item is complete if it weakens report-only
  mutation boundaries, source-research non-mutation, or engine/runtime
  output immutability.

## Critical Assistant Reliability Plan

This section supersedes the earlier "trace snapshot first" analysis for
the next slice. Trace snapshot and explain mode now exist locally. The
next plan focuses on making the assistant reliable enough for production
use when requests are slow, providers fail, the user refreshes, or
multiple messages are sent quickly.

### Iteration 1 - Implementation Reality Check

Current strong points:

- server-side model patch requests already use `AbortController` with
  env-clamped timeout and deterministic fallback when the provider fails;
- server-side source research requests already use timeout, transient
  provider retry, strict JSON retry, and context-only fallback when
  source research is unavailable;
- report mutation authority remains local and validator-gated:
  research answers cannot preload patches, and patch output still passes
  `validateReportAssistantPatch`;
- `assistantTraceSnapshot` is compact, parser-guarded, stored on the
  proposal document, preserved through preview storage, and available to
  context-only, research, finding, and model paths;
- the UI has a single input with intent routing for `explain`,
  `research`, and `patch`, and local smoke testing proved all three
  flows can complete without mutating calculator state.

Pre-reliability-implementation weak points:

- before the first reliability pass, the browser used direct `fetch`
  calls in `proposal-adjust-client-page.tsx` for assistant patch and
  plausibility requests;
- before the first reliability pass, there was no client-side request
  id, so a slow older response could race with a newer user message if
  future UI changes allowed overlapping or if a retry path was added
  naively;
- before the first reliability pass, there was no client-side
  timeout/abort, so the user saw a generic failure only after the
  browser/provider path failed naturally;
- before the first reliability pass, there was no bounded retry policy
  for safe read/proposal requests;
- before the first reliability pass, conversation state was React-local
  only, so refresh/navigation lost the user's recent assistant context;
- after the first reliability pass, assistant answers show request id,
  elapsed time, retry attempt count, and timeout state. Fallback reason
  and provider state can still be made more explicit in the next answer
  view-model polish pass.

Decision after Iteration 1:

- do not add more model/tool complexity yet;
- do not add MCP or streaming;
- do not expand report mutation operations yet;
- prioritize a small browser request manager and persistence layer.

### Iteration 2 - Failure Mode Audit

The next implementation must handle these concrete edge cases:

- **slow research provider**: user sees a pending state, request times
  out within the configured client budget, and the UI shows context-only
  fallback or retry guidance rather than silently hanging;
- **provider HTTP 500 or invalid JSON**: endpoint messages and warnings
  are displayed, and the assistant conversation records that no report
  value changed;
- **network interruption**: the UI aborts the request, stores the user
  message, and shows a recoverable "request interrupted" assistant
  message;
- **rapid repeated messages**: only the latest active request can update
  `assistantResponse`, `patchDraft`, plausibility state, and
  conversation assistant reply;
- **stale document after edit/apply**: old assistant requests cannot
  update UI state if their request was created against an older
  `documentSignature`;
- **research followed by patch approval**: previous
  `recommendedActionText` remains available only if it belongs to the
  current document signature and selected metric;
- **refresh after conversation**: recent assistant conversation returns
  for the same `documentSignature`, but is cleared or archived when the
  proposal document changes;
- **unsafe retry**: read/proposal-only requests may retry, but applying
  a patch and logging a finding must not be automatically retried because
  those actions mutate local document state or append review records;
- **fallback source clarity**: if research falls back to context-only,
  the answer must explicitly say so and must not present the result as a
  cited web comparison.

Decision after Iteration 2:

- implement request lifecycle hardening before source-quality schema;
- keep write paths single-shot unless a future explicit user retry
  button is added;
- include document signature and request kind in persisted conversation
  metadata to prevent cross-document leakage.

### Iteration 3 - Final Reliability Implementation Plan

Phase R1 - Request manager:

- add a small client helper, tentatively
  `report-assistant-request-client.ts`;
- supported request kinds:
  `patch_proposal`, `plausibility_research`, `finding_log`;
- every request gets:
  `requestId`, `kind`, `documentSignature`, `startedAtIso`,
  `timeoutMs`, `attempt`, and `maxAttempts`;
- use `AbortController` on the client for timeout and cancellation;
- parse response text defensively, then JSON;
- treat non-2xx HTTP responses as structured errors even when JSON is
  present;
- return a narrow result object:
  `ok`, `payload`, `errors`, `warnings`, `requestId`, `durationMs`,
  `attempts`, `aborted`, `timedOut`, and `source`.

Phase R2 - UI stale-response guard:

- keep an `activeAssistantRequestId` ref/state in
  `ReportAssistantPatchPanel`;
- before writing assistant response, warnings, patch draft,
  plausibility review, finding prefill, or conversation assistant reply,
  verify that the response `requestId` is still active and the
  `documentSignature` still matches;
- if the response is stale, drop it silently except for a debug-safe
  warning in tests;
- disable only the relevant action while a request is active, not the
  whole assistant forever;
- expose a "retry latest" button only for non-mutating or proposal-only
  requests.

Phase R3 - Conversation persistence:

- add localStorage key:
  `dynecho:report-assistant-conversation:v1`;
- stored shape:
  `documentSignature`, `savedAtIso`, `messages`, `lastResponse`,
  `lastRecommendation`, and bounded `requestSummaries`;
- cap stored messages at 14 and text length at the same UI truncation
  limits used for provider context;
- restore only when `documentSignature` matches the current assistant
  context;
- clear or archive when the proposal document changes;
- never persist full provider raw responses, API keys, request headers,
  or unbounded source text.

Phase R4 - Consistent answer view model:

- normalize UI responses into one display shape:
  `summary`, `detail`, `source`, `status`, `requestMeta`,
  `reportMutationStatus`;
- every non-mutating answer must include a visible statement equivalent
  to "No report value was changed";
- patch proposal answers must include "preview only" until
  `Apply validated patch` succeeds;
- research fallback must explicitly label `context-only` vs
  `source research`;
- keep answer/reasoning/source text separate from patch draft state.

Phase R5 - Regression tests and smoke:

- unit tests for the request helper:
  timeout, abort, HTTP error, invalid JSON, retry-once, no retry for
  finding log, and preserved warnings;
- React/UI-oriented tests for stale response:
  delayed first research response must not overwrite a faster second
  answer;
- storage tests:
  conversation restores for the same document signature and is ignored
  for a different signature;
- route/UI tests:
  research provider unavailable returns context-only answer with warning;
  patch endpoint failure does not leave an applyable patch draft;
  explain remains local and does not call network;
- Playwright smoke:
  explain, mocked research fallback, patch preview, refresh/reopen
  conversation restore, and rapid two-message race.

### Implementation Comparison After Three Iterations

| Capability | Current implementation | Reliability plan decision |
| --- | --- | --- |
| Server provider timeout | Present for model and research provider calls. | Keep; do not duplicate server logic except where client UX needs earlier abort. |
| Server fallback | Present: model falls back to deterministic parser; research falls back to context-only review. | Keep; expose fallback reason more consistently in UI metadata. |
| Client timeout/abort | Implemented locally through `report-assistant-request-client.ts` for patch, plausibility/research, and finding-log calls. | Production-smoke slow provider and interrupted-network behavior. |
| Stale response guard | Implemented locally with active `requestId` plus current `documentSignature` checks before async assistant state writes; core lifecycle behavior is covered by `report-assistant-request-lifecycle.test.ts`. | Production-smoke rapid two-message races; add browser-level UI coverage when a route-level test harness exists. |
| Conversation persistence | Implemented locally as bounded same-document localStorage recovery in `report-assistant-conversation-storage.ts`, with storage unit tests. | Production-smoke refresh/reopen and cross-document discard. |
| Retry latest | Implemented locally for proposal-only patch generation and non-mutating research/plausibility requests. | Production-smoke slow/failed request recovery; keep finding-log/apply paths out of auto retry. |
| Explain mode | Implemented locally. | Keep network-free and include in persistence; no retry needed. |
| Trace snapshot | Implemented locally and parser guarded; first production browser smoke proved a floor/Rw proposal can answer lane/formula context locally. | Broaden production smoke across common airborne and impact proposal documents and keep snapshot bounded. |
| Research source quality | Minimal source list and rationale only. | Defer until reliability slice is done; then add comparability/source-quality schema. |
| Patch mutation boundary | Strong: validator-gated, user-applied only. | Preserve exactly; do not auto-retry apply/log write paths. |
| Runtime status | Provider readiness route exists. | Optionally show last request status in UI, but do not make status route call providers. |

### Acceptance Criteria For Reliability Slice

The slice is complete only when all of these are true:

- assistant request helper has unit coverage for timeout, abort, retry,
  HTTP error, invalid JSON, and write-path no-retry behavior;
- core stale request lifecycle tests prove an older delayed response
  cannot pass the active request id/document-signature guard. Browser
  smoke still needs to prove the guarded UI state writes for answer,
  patch draft, warning list, and plausibility review;
- conversation persistence tests prove same-document restore and
  cross-document discard;
- UI smoke proves explain, research fallback, and patch preview still
  work after the request manager lands;
- no assistant path can apply, save, export, reset, or write findings
  without the existing explicit user action;
- full assistant regression pack remains green; full web typecheck may
  still be blocked by unrelated pre-existing workbench test typing
  errors, but no new assistant files may appear in the failure list.

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

The assistant should support five user-requested jobs:

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
   context so later agentic calculator work can inspect them;
4. trace-bound explanation: answer "why did this result come out this
   way?" from the packaged engine trace, layer summary, selected
   candidate, formula/support notes, and missing/unsupported boundaries;
5. assembly/layer alternative research: discuss possible layer or system
   alternatives for the current construction with source-backed
   assumptions, expected metric direction, and no automatic calculator or
   report mutation.

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
  or bounded range from comparable sources, but research itself remains
  non-mutating. Loading or generating a report patch requires a separate
  explicit user edit instruction after the user has read the answer;
- report notes: the assistant can add bounded notes to assumptions,
  warnings, or recommendations when the user asks for explanatory text;
- restore/undo-style patches: plausibility review may suggest restoring
  a report value back toward the captured engine display value inside
  the validator limits.

Current patch operations cover metric value changes and appended notes.
To make manipulation feel complete, add a second controlled text-edit
operation after the grounded research/ask slice is stable:

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
| Model endpoint | `report-assistant-model.ts` now supports both `custom_patch_provider` and `system_llm_gemini_proxy`. In production Akustik uses `system_llm_gemini_proxy` and non-streaming Gemini `:generateContent` for patch proposals. | `chatd-rs` posts Gemini `contents`, `systemInstruction`, `tools`, and `generationConfig` to `system_llm/gemini-proxy/v1beta/models/{model}:streamGenerateContent`. | Patch proposal binding is complete. Do not mistake it for research/chat binding; grounded research needs a separate request body and parser. |
| Streaming | Not needed; `/api/report-assistant/patch` returns one patch result. | Streaming is needed for chat UI deltas and tool loops. | Use non-streaming `:generateContent` for simpler parsing and lower UI risk. |
| Tooling | `report-assistant-tools.ts` has local proposal-only helpers: metric resolution, patch preview, stale mention detection, plausibility review, finding preparation. | `mcp-rs` exposes tools/list and tools/call; `chatd-rs` converts declarations to Gemini `functionDeclarations`. | Do not add a tool loop for MVP. The model returns a patch; local helpers validate and apply. Optional MCP remains a later wrapper. |
| Mutation authority | `applyValidatedReportAssistantPatch` mutates only the proposal document after validation and optional confirmation. | MCP/GraphQL tools mutate app state through server-side auth/write policies. | Keep mutating authority in Akustikhesap app/server only. The model never receives apply/export/save/reset/write capabilities. |
| Validation | `validateReportAssistantPatch` checks schema, metric ids, document signature, stopped outputs, bounds, signed values, and movement limits. | System uses typed schemas, deterministic tool errors, write policies, and tool-result guardrails. | Reuse Akustik validator as the hard boundary. Borrow system's typed-contract discipline, not the whole runtime. |
| Runtime status | `/api/report-assistant/status` reports provider kind, endpoint origin/path, timeout, proxy-key readiness, research readiness, and tool definitions without secrets. | System has service health, stack health, MCP catalog, and live chat verification. | Keep status read-only. Add a no-mutation grounding smoke check only if needed for deployment readiness, not as a public diagnostic. |
| Network | `akustikhesap_landing` now joins `akustikhesap_net`, `machinity_proxy_net`, and the external private `system_kanban_net` so `http://system_llm:4000/gemini-proxy` resolves without public exposure. | `system_llm` is on the system stack's private `kanban_net`, with no public Traefik route. | Keep this private-network-only binding. Do not edit/restart the system stack from Akustik work. |
| Context/provenance | Current `ReportAssistantContext` carries metric rows, layer summary, warnings, `traceSummary`, and persisted `assistantTraceSnapshot` from `SimpleWorkbenchProposalDocument`. The snapshot is built while raw `AssemblyCalculation` is still available and survives the proposal-preview storage boundary. | System agents can query richer app state and tool outputs during a chat turn. | Keep the compact proposal-document snapshot. Do not try to recover raw engine state from the configure page after the preview-storage boundary; production-smoke real proposal documents instead. |
| Intent routing | Current local classifier supports `explain`, `patch`, and `research`; follow-up patch approval works only when the previous recommendation contains a specific dB movement/target and is not directionally ambiguous. | System chat has broader agent routing and tool planning. | Keep `explain` non-mutating and local. Keep ambiguous follow-up edits asking for explicit dB target instead of guessing from conversation. |
| Plausibility/value research | Separate endpoint can do context-only review or use the configured `system_llm_gemini_proxy` path as a grounded-research provider. The deployed API path can return `answerText`, reasoning, and sanitized sources; the 2026-06-03 API smoke returned `8` sources for an `Rw` payload, and the first browser smoke rendered `7` visible source URLs from a real floor/Rw proposal without a suggested patch or report mutation. Comparability/source-quality fields are still open. | System can use MCP web/search and memory/RAG tools. `system_llm` also supports native Gemini Google Search tool requests through the proxy. | Next Akustik slice should broaden real-proposal browser smoke, then enrich source quality and comparability. Keep research separate from calculator calibration; any later patch must come from a separate explicit user edit command and stay validator-gated. |
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

What is complete as of 2026-06-03:

- `system_llm_gemini_proxy` is a first-class model provider mode.
- The Gemini proxy request URL/body/header shape is covered by targeted
  tests.
- Runtime status distinguishes provider kind and proxy-key readiness
  without leaking secrets.
- Production Akustik has private Docker reachability to `system_llm`
  through `system_kanban_net`.
- The live UI exposes the model/assistant response and patch validation
  state more clearly.
- Deployed assistant research API can now return natural answer text,
  recommendation text, reasoning, source links, and source notes. The
  2026-06-03 live smoke proved a grounded research answer reached
  Akustikhesap with `answerText`, `8` sanitized sources, and no
  suggested report patch.
- Production deploy and API smoke are complete for the current assistant
  implementation: compose rebuilt cleanly, the container is healthy,
  HTTPS root/API health/configure returned `200`, authenticated status
  reports configured model and research providers, and mutating tools
  remain hidden.
- Production browser smoke from a real generated proposal is complete
  for the first floor/Rw and wall/Rw baselines. It proved local explain
  display, grounded research display with visible sanitized source URLs,
  no-mutation research behavior, guarded AI-model patch preview, no
  browser console issues after the bound-fetch fix, and one real
  `Retry research` recovery on the wall case.
- Local trace/explain work is implemented: compact
  `assistantTraceSnapshot` is stored on the proposal document and the
  single assistant input can answer lane/formula/route questions through
  the non-mutating `explain` intent.
- Local assistant request reliability work is implemented for the first
  slice: request helper, client timeout/abort, bounded retry for safe
  assistant requests, no retry for finding-log writes, stale response
  guard, request metadata display, and bounded same-document
  conversation persistence. Follow-up reliability work extracted
  conversation persistence into a tested helper and added a `Retry
  latest` recovery action for safe assistant requests.

What remains incomplete:

- browser-level real proposal research display is smoke-tested and now
  repeatable for floor/Rw and wall/Rw proposals, but not yet for live
  impact metrics;
- Gemini-grounded research source metadata reached Akustikhesap in both
  production API smoke and the first browser smoke, but source quality,
  assembly comparability, recommended range, and insufficient-source
  semantics are not yet structured enough for consistent user-facing
  conclusions;
- the UI can display answer text and basic sources, but source-backed
  answers cannot yet display structured source quality, assembly
  comparability, confidence, recommended value ranges, or explicit
  `insufficient_sources` states;
- browser-side assistant request hardening still needs production smoke
  and route/UI race coverage, but the local implementation now includes
  request ids, client timeout/abort, stale-response suppression, retry
  policy, and same-document conversation persistence;
- production must still broaden `assistantTraceSnapshot` proof beyond
  the first floor/Rw generated proposal to common airborne and impact
  cases, and keep explain answers local/non-mutating after deployment;
- stale literal value mentions are detected but not yet safely
  replaceable by a structured assistant operation;
- live grounded-research smoke tests are not defined as a repeatable
  checklist beyond the initial notes above;
- full `@dynecho/web typecheck` has unrelated existing test typing
  failures and should be resolved separately from the assistant slice
  before calling a release fully clean.

Second-pass implementation audit:

- `getReportAssistantPlausibilityResearchSettings` now treats a
  configured `system_llm_gemini_proxy` model provider as an implicit
  grounded research provider. Therefore "no
  `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT`" no longer means research
  is fully disabled; it means there is no dedicated custom research
  endpoint. The live API smoke proved grounding/citation metadata can
  reach Akustikhesap through the proxy for a smoke payload; the remaining
  risk is browser-level real-proposal display plus source quality and
  comparability, not merely missing env.
- `buildReportAssistantContext` now prefers the persisted
  `document.assistantTraceSnapshot` and can still build a snapshot from
  raw `AssemblyCalculation` when available. The configure page can
  therefore answer lane/formula questions after the preview-storage
  boundary, provided the proposal document was built by the updated
  document builder.
- `parseSimpleWorkbenchProposalDocument` now preserves and normalizes
  `assistantTraceSnapshot`, and preview-storage tests cover both
  round-trip and legacy-no-snapshot behavior. The remaining risk is
  production coverage across real route families, not parser absence.
- `buildAssistantConversationInstruction` sends recent conversation text
  to the research provider as local context. This is useful for
  follow-ups, but the research contract must explicitly keep the current
  user message authoritative and must not let earlier assistant advice
  override the selected metric or document signature.
- The manual "Review value plausibility" panel can still load a
  context-only restore patch when `suggestPatch` is true. That remains
  acceptable for context-only engine-restore review, but research-intent
  calls from the single assistant input already send `suggestPatch:
  false` and must continue to suppress provider patches.

## File-Level Gap List

The next implementation should be constrained to these files unless a
test exposes a narrower missing dependency.

### `apps/web/features/workbench/report-assistant-model.ts`

Current role:

- normalizes endpoint/model/provider/timeout;
- supports both `custom_patch_provider` and
  `system_llm_gemini_proxy`;
- builds the Gemini proxy `generateContent` request for patch
  proposals when provider is `system_llm_gemini_proxy`;
- extracts `ReportAssistantPatch` from direct JSON, OpenAI-style text,
  and Gemini-style candidate wrappers;
- falls back to deterministic parser when the provider fails.

Patch-binding status:

- completed for report-only patch proposals;
- do not overload this path for internet research. A grounded research
  request needs a different output contract (`answer`, sources,
  comparability, non-mutating recommendation) and must preserve Gemini
  `groundingMetadata`.

### `apps/web/features/workbench/report-assistant-model.test.ts`

Current role:

- proves deterministic default;
- proves generic endpoint parsing;
- proves provider fallback;
- proves endpoint normalization and response extraction;
- proves the `system_llm_gemini_proxy` request-builder URL/body/header
  shape.

Remaining test need:

- add grounded-research provider tests after the research request
  builder exists;
- add tests proving `groundingMetadata.groundingChunks` sources are
  normalized and unsafe/non-http URLs are dropped.

### `apps/web/features/workbench/report-assistant-runtime-status.ts`

Current role:

- reports whether model/research providers are configured;
- reports model provider mode and proxy-key readiness as booleans;
- strips endpoint query strings and secrets;
- lists proposal-only tool definitions.

Remaining change:

- expose dedicated and implicit grounded-research provider
  type/readiness clearly without making any provider call from the
  status route.

### `apps/web/features/workbench/report-assistant-runtime-status.test.ts`

Current role:

- assert provider mode is reported;
- assert proxy key is only reported as a boolean;
- assert endpoint query strings remain hidden;
- assert mutating tools remain absent.

Remaining test need:

- add readiness assertions for whichever grounded research provider is
  selected.

### `apps/web/features/workbench/report-assistant-context.ts`

Current role:

- builds stable report metric ids, directions, basis labels, document
  signature, layer summary, and a compact `traceSummary`;
- carries optional `assistantTraceSnapshot`;
- prefers the persisted proposal-document snapshot at configure-page
  time and can still build a snapshot from `AssemblyCalculation` when a
  caller provides the raw result.

Remaining verification:

- keep the snapshot compact and source-safe: no full response curves,
  no full candidate tables, no hidden provider keys, no repository paths,
  and no large free-form engine dumps;
- broaden production smoke across real proposal documents to prove the
  snapshot is populated for common airborne and impact route families,
  beyond the first floor/Rw browser pass.

### `apps/web/features/workbench/simple-workbench-proposal.ts`

Current role:

- defines and parses `SimpleWorkbenchProposalDocument`;
- normalizes known nested proposal structures during preview-storage and
  API payload parsing;
- includes optional `assistantTraceSnapshot` and normalizes it through
  `parseSimpleWorkbenchProposalDocument`.

Remaining verification:

- keep only strings, finite numbers, enums, ids, and short arrays so
  localStorage and route payloads remain bounded;
- keep round-trip tests proving the field survives
  `storeSimpleWorkbenchProposalPreview`, configure-page reload, and
  `parseReportAssistantContextPayload`.

### `apps/web/features/workbench/simple-workbench-proposal-panel.tsx`

Current role:

- builds the proposal document while raw `props.result` is still
  available;
- writes the proposal document into browser preview storage before
  opening the configure page;
- builds `assistantTraceSnapshot` at document-build time, which is the
  last reliable point where raw engine result and proposal document are
  both available.

Remaining verification:

- ensure the snapshot continues to include dynamic airborne, dynamic
  impact, impact support, airborne
  candidate resolution, and layer-combination resolver summaries;
- prove that client-facing report text does not accidentally render
  internal trace fields unless a deliberate UI section uses them.

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
- renders generated patch/model response, validation preview, warnings,
  confirmation, and apply button;
- applies validated patch to `editableDocument`.

Remaining UX change:

- keep one assistant input and route by intent. Research-style requests
  such as "internetten araştır, bu Rw değeri mantıklı mı?" should show
  answer text, source cards, source count, confidence, comparability,
  and a non-mutating recommendation. They should not show "Load
  suggested patch";
- direct edit requests such as "Rw'yi 2 dB düşür" should keep the
  current guarded patch preview/apply flow;
- do not move patch application into the endpoint for MVP.

### `apps/web/features/workbench/report-assistant-intent.ts`

Current role:

- classifies single-input assistant messages as `explain`, `patch`, or
  `research`;
- classifies lane/formula/route/intermediate-value questions as
  non-mutating `explain`;
- treats metric questions, explicit research/search wording, and
  generic review wording as non-mutating research;
- turns clear follow-up approvals into guarded patch instructions only
  when the previous recommendation contains a specific dB movement or
  target and does not conflict directionally.

Remaining verification:

- keep lane/formula/intermediate-value/source-missing/risk questions in
  `explain` without requiring a metric id;
- keep value-plausibility questions about `Rw`, `R'w`, `Ln,w`,
  `L'nT,w`, etc. in `research`;
- keep direct numeric edits in `patch`;
- add ambiguity behavior: if multiple metrics match, ask the user to
  choose; if a follow-up edit says only "uygula" but previous advice has
  alternatives or a range, ask for a specific target.

### `apps/web/features/workbench/report-assistant-plausibility-research.ts`

Current role:

- supports context-only plausibility review;
- optionally calls a generic
  `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT`;
- can reuse the configured `system_llm_gemini_proxy` model settings as
  `system_llm_gemini_grounded_research` and build a Gemini
  `generateContent` request with Google Search grounding tools;
- sanitizes minimal source summaries and Gemini grounding chunks when
  they are present;
- can return `answerText`, recommendation text, rationale, verdict, and
  sources while suppressing provider patches for research-intent
  responses.

Remaining research hardening:

- broaden browser-smoked grounded research from the first actual floor/Rw
  proposal to wall, impact, and weak-source/not-comparable cases;
- keep monitoring whether grounding metadata survives across real
  acoustic queries; if the proxy strips it for some response families,
  update the private proxy to forward it or mark those responses as
  answer-only without cited sources until a durable citation path exists;
- extend response parsing beyond the current answer/review shape so a
  normal answer with citations, value range, comparability notes, and
  source-quality state is not rejected merely because it is not a
  `ReportAssistantPatch`;
- keep extracting Gemini `groundingMetadata.groundingChunks` into
  sanitized source summaries and retain enough citation metadata for the
  UI;
- return explicit `insufficient_sources`, `weak_sources`,
  `not_comparable`, or equivalent states instead of silently falling
  back to a patch-only workflow;
- do not return an applyable patch from research-intent responses. If
  the answer says "Rw looks slightly high", the user must send a
  separate edit instruction before the patch endpoint proposes any
  report change;
- keep context-only fallback with a visible warning when grounding is
  unavailable or returns no acceptable sources.

### `apps/web/app/api/report-assistant/plausibility/route.ts`

Current role:

- authenticates;
- parses context/document/review request;
- calls the plausibility/research helper;
- validates any legacy context-only suggested patch before returning it.

Expected next changes:

- either keep this as the value-review route and add a separate
  `/api/report-assistant/research` route for free-form assistant
  answers, or extend the request with an explicit mode such as
  `source_value_recommendation`;
- do not let this route apply patches, save reports, write findings, or
  mutate calculator state.
- for research-intent responses, suppress `suggestedReportPatch` even if
  a provider returns one. Return recommendation text/range only; patch
  creation belongs to a later explicit user edit command.

### `apps/web/features/workbench/report-assistant-patch.ts`

Current role:

- validates and applies metric value changes and appended notes;
- detects stale literal value mentions.

Next controlled expansion:

- add `replace_report_value_mention` only after the grounded
  research/ask slice is stable;
- require exact `mentionId`/path and exact `beforeText`;
- do not allow paragraph rewrite or arbitrary path edits.

### `akustikhesap-compose.yml`

Current role:

- runs `akustikhesap_landing` on `akustikhesap_net`,
  `machinity_proxy_net`, and external `system_kanban_net`;
- configures the report assistant patch model provider through
  `system_llm_gemini_proxy`;
- does not configure a dedicated custom source-research endpoint, but
  the current code can reuse the configured `system_llm_gemini_proxy`
  path as an implicit grounded-research provider.

Remaining production changes:

- broaden the implicit grounded-research browser smoke beyond the first
  actual floor/Rw proposal before claiming cited research is fully live
  across the UI;
- add a dedicated research-provider env only if the implicit Gemini
  grounding path cannot return durable citations or comparable-source
  quality;
- keep `system_llm` private; do not add a public Traefik route;
- rebuild/deploy only Akustikhesap when enabling this env.

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

## Implemented Patch Model Request Contract

For `DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER=system_llm_gemini_proxy`,
the adapter now produces a request equivalent to:

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

## Completed Patch Binding Sequence

This sequence has been implemented for report-only patch proposals.

1. **Provider settings**
   - Provider enum and env parsing are present.
   - Existing behavior remains available as `custom_patch_provider`.
   - Invalid provider and timeout clamping are covered by targeted
     tests.

2. **Gemini request builder**
   - The URL/body/header helper is unit-tested.
   - It uses `generateContent`, not streaming.
   - It keeps context compact and omits the full document body.

3. **Provider fetch branch**
   - `fetchModelPatch` branches by provider.
   - Errors are explicit: HTTP status, timeout, parse failure.
   - Deterministic fallback is preserved.

4. **Validation boundary**
   - `validateReportAssistantPatch` still runs after model output.
   - Invalid model patches are not returned as applyable UI state.

5. **Status and UI messaging**
   - Status exposes provider mode and proxy-key readiness without
     secrets.
   - The UI now has a visible assistant response area for generated,
     rejected, and applied patch proposals.

6. **Network enablement**
   - Akustikhesap app is attached to the private
     `system_kanban_net`.
   - No public `system_llm` route was added.

7. **Production env enablement**
   - Compose model provider/env settings are in the Akustik compose.
   - Akustikhesap was rebuilt/deployed without touching system services.

8. **Live smoke test**
   - Live patch generation has been smoke-tested without touching
     calculator engine behavior.

9. **Mention replacement expansion**
   - Add controlled `replace_report_value_mention` only after live model
     patching is stable.
   - Keep this separate from adapter deployment to avoid mixing provider
     risk with document-editing risk.

## Next Implementation Sequence - Reliability First

The next useful slice is not more patch plumbing and not a broader tool
loop. Trace snapshot, explain intent, research intent, and guarded patch
preview now exist locally. The next implementation must make those flows
stable under slow providers, interrupted network paths, refreshes, and
rapid follow-up messages. Research answers must still not load or apply
a patch; if the user accepts advice, they send a follow-up edit
instruction such as "o zaman 2 dB düşür", and that separate instruction
enters the guarded patch flow.

0. **Browser-smoke deployed behavior**
   - Baseline deployed browser smoke is complete for one floor/Rw
     generated proposal: explain, source research, and guarded patch
     preview passed with no report mutation.
   - Convert that smoke into a repeatable checklist or Playwright smoke.
   - Expand it to real airborne and impact proposal documents so compact
     `assistantTraceSnapshot` data, local explain answers, source
     display, sanitized URLs, and unchanged no-mutation research values
     are proven across common route families.

1. **Client request manager**
   - Add a small browser-side assistant request helper for patch
     proposal, plausibility/research, and finding-log requests.
   - Assign every request a `requestId`, `kind`, `documentSignature`,
     timeout budget, attempt count, and start timestamp.
   - Use client `AbortController`, defensive JSON parsing, non-2xx
     structured errors, and bounded retry only for safe non-mutating or
     proposal-only requests.

2. **Stale response and document guards**
   - Track the active assistant request id in the UI.
   - Before writing assistant answer, warnings, patch draft,
     plausibility review, finding prefill, or conversation state, verify
     both `requestId` and `documentSignature`.
   - Drop stale responses and never auto-retry apply/log write paths.

3. **Same-document conversation recovery**
   - Persist a bounded conversation snapshot in localStorage under
     `dynecho:report-assistant-conversation:v1`.
   - Restore only when the stored `documentSignature` matches the
     current proposal document.
   - Store user-visible summaries and request metadata only; never store
     raw provider payloads, headers, keys, or unbounded source text.

4. **Consistent answer display**
   - Normalize explain, research, patch-proposal, fallback, and error
     replies into one display view model.
   - Every non-mutating answer must visibly say no report value changed.
   - Patch replies must say preview-only until the existing explicit
     apply action succeeds.
   - Fallback answers must distinguish context-only review from
     source-backed research.

5. **Research source-quality expansion**
   - After reliability is stable, extend the research contract with
     value range, comparability, source quality, comparable assemblies,
     confidence, and insufficient-source fields.
   - Keep `suggestedReportPatch` out of research-intent responses.
   - If grounded metadata does not survive the proxy, either update the
     private proxy or mark research as answer-only/no-cited-sources
     until a durable citation path exists.

6. **Regression tests and smoke**
   - Unit-test timeout, abort, HTTP error, invalid JSON, retry-once,
     no-retry write paths, and warning preservation in the request
     helper.
   - UI-test that a delayed older response cannot overwrite a newer
     answer, patch draft, warning list, or plausibility review.
   - Storage-test same-document restore and cross-document discard.
   - Smoke-test explain, research fallback, patch preview,
     refresh/reopen recovery, and rapid two-message race.

## Edge-Case Acceptance Matrix

The next implementation is not accepted unless these cases are handled
deterministically.

| Case | Expected behavior | Test/smoke requirement |
| --- | --- | --- |
| No metric named in a multi-metric value question | Do not guess; ask the user to name one metric such as `Rw` or `Ln,w`. | Intent/UI test with two exposed metrics. |
| No metric named in a single-metric value question | Use the sole metric and keep the path non-mutating unless the user gives a clear numeric edit. | Intent test and mocked UI response. |
| Lane/formula question without metric | Route to `explain`, not research or patch, once trace snapshot exists. | Intent test for "hangi lane seçildi" and "hangi formül kullanıldı". |
| Explain question before trace snapshot exists | Answer that detailed provenance is unavailable in this editor snapshot; do not fabricate formula/lane detail. | Explain route/unit test. |
| Research provider returns no `groundingMetadata` | Show answer-only or insufficient-source state; do not present it as cited web research. | Provider parser test and production smoke note. |
| Provider returns sources with non-http URLs | Drop those sources; if no acceptable sources remain, report weak/no sources. | Parser test for `file:`, `javascript:`, relative URL. |
| Provider returns prose or malformed JSON | Retry once with strict JSON contract; then fall back to context-only review with visible warning. | Research provider test. |
| Provider returns a different metric id | Reject provider review or fall back; never use provider value for another metric. | Parser test with `Rw` requested and `Ln,w` returned. |
| Provider returns `suggestedReportPatch` for research | Suppress it when `research: true`; show only answer/recommendation text. | Route/parser/UI test proving no patch draft appears. |
| Research says "lower by 1-2 dB" | Store advice as conversation context only; require a second explicit edit instruction before patch generation. | UI test and follow-up intent test. |
| Follow-up says only "uygula" after range/alternative advice | Ask for a specific dB movement or final value. | Existing follow-up ambiguity tests plus UI copy test. |
| Follow-up direction conflicts with recommendation | Do not create patch; ask for explicit target. | Intent test. |
| `needs_input` or `unsupported` metric | Research/explain may describe why it is stopped; patch validator must reject numeric value creation. | Plausibility and patch validator tests. |
| Bound value such as `<= 50 dB` | Patch may preserve the bound prefix but cannot add/remove or flip the bound. | Patch validator tests. |
| Signed spectrum terms such as `Ctr` | Preserve sign formatting and do not treat as normal higher-is-better output. | Patch validator tests. |
| Metric value in report rows and old prose mention | Metric rows may update; stale mentions are detected but not rewritten until `replace_report_value_mention` exists. | Patch preview test. |
| Document edited after assistant context | `documentSignature` mismatch rejects patch. | Patch route/validator test. |
| Provider timeout or HTTP failure | Context-only review with visible warning; no report value changes. | Provider failure test. |
| Secret in endpoint query string | Status and request builders strip query/hash and never show keys in UI/log output. | Runtime status/model/research request tests. |
| Large movement >5 dB and <=10 dB | Requires explicit user confirmation. | UI/validator test. |
| Large movement >10 dB | Reject assistant patch; user can still use manual editor intentionally. | Validator test. |
| Conversation history contradicts current user message | Current user message, selected metric, and document signature win. | Research request-builder test. |
| Research finds only marketing claims or generic blogs | Return weak/insufficient sources, not high confidence and not a precise value. | Provider contract/parser test with weak-source fixture. |
| Lab/field, wall/floor, ISO/ASTM mismatch | Mark partial/not comparable and explain the mismatch. | Source comparability schema test. |
| Trace snapshot too large or malformed | Truncate/drop unsafe fields and keep routes working. | Parser/context test. |

## Risk Register

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Implicit research provider is mistaken for fully proven web research | Current settings can reuse `system_llm_gemini_proxy` without a dedicated research endpoint, and API plus first browser smoke proved cited responses can reach Akustikhesap, but route-family breadth and source comparability are not fully proven. | Status/UI must distinguish configured/API-smoked/first-browser-smoked from broadly proven; expand real-proposal browser smoke before claiming cited research is fully live. |
| Grounded research request mismatch | Patch requests use Gemini patch body, while research uses `googleSearch` tool config and citation metadata parsing. | Keep the separate grounded-research request builder/parser; add real acoustic fixtures for metadata, source quality, and not-comparable cases. |
| Network overexposure | Exposing `system_llm` publicly would broaden attack surface. | Keep private Docker networking; no Traefik route. |
| Key leakage | Provider keys could leak through status, logs, query strings, or UI warnings. | Use headers only; status shows booleans; strip query strings; avoid logging request headers/body secrets. |
| Model returns prose or full report | LLM may ignore JSON-only instruction. | Parse only patch JSON; reject everything else; deterministic fallback. |
| Model proposes unsafe metric changes | Natural language may confuse `Rw`, `R'w`, `DnT,w`, `Ln,w`, `IIC`, or bounds. | Existing validator remains mandatory; ambiguous references should fail instead of guessing. |
| Missing or malformed trace snapshot causes hallucinated provenance | The configure page should not reconstruct raw engine provenance after the preview-storage boundary. | Use the persisted compact trace snapshot only; if it is absent, malformed, or truncated, explain mode must explicitly say provenance is unavailable. |
| Conversation history overrules current request | Recent in-page messages are included for context and may contain stale recommendations. | Current user message, selected metric, document signature, and metric id must be authoritative in request contracts and tests. |
| Research recommendation becomes accidental edit | User may expect "looks high" advice to change the report. | Research never returns/apply/preloads patch; follow-up edit must include a specific target or unambiguous recommendation with specific dB. |
| Stale report state | User edits report after model context was built. | Existing `documentSignature` mismatch rejection. |
| Overbroad text edits | Letting model rewrite paragraphs can corrupt report meaning. | Delay mention replacement; when added, only exact deterministic mention paths may be replaced. |
| System repo dirty state | system project has unrelated uncommitted changes. | Keep system inspection read-only; implement only in Akustikhesap. |

## Final Default Decisions

Use these defaults after the 2026-06-03 live patch binding unless a
later product decision explicitly changes them.

- Patch proposals may use Gemini through private `system_llm`, but the
  model still returns only a structured patch. The app/server validates
  the patch. The user confirms the preview. Only then does deterministic
  app code apply the change to the report document.
- Internet/source research is a separate assistant mode. It must return
  an answer and sources first. It must not return or preload an
  applyable patch. If the user accepts the advice, the user's follow-up
  edit command enters the normal patch validator flow.
- Apply, export, save, reset, and queue-write actions are owned by the
  app/server confirmation layer, not by the model or research provider.
- Assistant edits remain export-only by default. They become persistent
  custom proposal edits only when the user explicitly saves the edited
  report snapshot.
- The current value-edit scope is single-number report outputs only:
  `Rw`, `R'w`, `DnT,w`, `Dn,w`, `Dn,A`, `DnT,A`, `DnT,A,k`, `Ln,w`,
  `L'n,w`, `L'nT,w`, `L'nT,50`, `CI`, `CI,50-2500`, `Ln,w+CI`,
  `DeltaLw`, and already-supported ASTM/NEN outputs when they are live.
- Response curve and chart editing remains manual.
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
- External source-bounded plausibility research is the next slice, not a
  completed live capability. Context-only plausibility review may compare
  the current report value with the captured engine value today; web
  evidence is added only after grounded provider tests and smoke pass.
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
  documentSignature: string;
  metrics: ReportAssistantMetric[];
  layersSummary: string[];
  warnings: string[];
  traceSummary: ReportAssistantTraceSummary;
  assistantTraceSnapshot?: SimpleWorkbenchAssistantTraceSnapshot;
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

type SimpleWorkbenchAssistantTraceSnapshot = {
  airborne?: {
    selectedLabel?: string;
    selectedMethod?: string;
    detectedFamily?: string;
    detectedFamilyLabel?: string;
    confidenceClass?: string;
    confidenceScore?: number;
    solverSpreadRwDb?: number;
    candidateMethods?: { label: string; rwDb?: number; basis?: string }[];
  };
  impact?: {
    selectedLabel?: string;
    selectionKind?: string;
    evidenceTier?: string;
    supportFamily?: string;
    fieldContinuation?: string;
    sourceIds?: string[];
    fitPercent?: number;
    availableMetricLabels?: string[];
  };
  impactSupport?: {
    basis?: string;
    labOrField?: string;
    referenceFloorType?: string;
    notes?: string[];
    formulaNotes?: string[];
  };
  airborneCandidateResolution?: {
    selectedCandidateId?: string;
    selectedOrigin?: string;
    selectedBasis?: string;
    rejectedCandidateIds?: string[];
  };
  layerCombinationResolver?: {
    route?: string;
    basis?: string;
    candidateKind?: string;
    supportBucket?: string;
    requiredInputs?: string[];
    selectedCandidateId?: string;
    surfaceDetail?: string;
  };
};
```

The metric `id` must be stable for the current proposal document. It
should not depend only on display labels because labels can be edited.
`assistantTraceSnapshot` is a persisted, compact explanation aid, not a
new calculator truth source. If it is absent or malformed, the assistant
must say provenance is unavailable instead of inventing lane/formula
details.

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
  recommendedActionText?: string;
  sources: PlausibilitySourceSummary[];
};
```

The source-backed reviewer must not suggest or preload a report patch.
It should explain the recommendation in text, for example "Rw looks
slightly high; consider lowering it by about 1-2 dB." If the user then
asks for the edit, that follow-up instruction goes through the normal
patch endpoint and validator.

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
  `insufficient_sources` and do not imply a report edit;
- if the source-backed recommendation differs by more than the patch
  validator's hard movement limit, state the concern in the answer
  rather than loading a patch proposal;
- any later patch requested by the user after reading the research
  answer must preserve metric/basis semantics and pass
  `validateReportAssistantPatch` exactly like a direct user instruction
  patch.

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
- never include `suggestedReportPatch` for research-intent responses.
  Use `recommendedActionText` for advice such as "consider lowering Rw
  by 1-2 dB";
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
- do not show "Load suggested patch" or "Apply" from a research answer;
- if the user accepts the research advice, they should type a follow-up
  edit instruction such as "o zaman Rw'yi 2 dB düşür"; that second
  message starts the existing preview/apply flow;
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

## Research Provider Decision - 2026-06-03

Plan verdict after comparing the implementation and current provider
docs: the plan is directionally correct, but it is not complete enough
to call the assistant feature finished. The patch/manipulation path is
implemented. The research/assistant path still needs a first-class
grounded provider and intent-routed answer UI.

Official provider facts checked on 2026-06-03:

- Gemini API Grounding with Google Search supports a native
  `googleSearch` tool, returns `groundingMetadata` with search queries,
  web source chunks, and citation supports, and lists
  `Gemini 3 Flash Preview` as a supported grounded-search model:
  `https://ai.google.dev/gemini-api/docs/google-search`.
- OpenAI Responses API supports a built-in `web_search` tool with live
  internet access controls, but using it would add a separate provider,
  model/key path, and response parser:
  `https://platform.openai.com/docs/guides/tools-web-search`.
- Google Programmable Search JSON API returns search metadata and web
  results through `GET /customsearch/v1` with `cx` and `q`, but it is a
  search-results API, not an answer/recommendation provider:
  `https://developers.google.com/custom-search/v1/`.
- Brave Search API exposes web search and LLM-context endpoints with
  API-key auth, but it would still require Akustik to synthesize and
  validate the answer through a model:
  `https://brave.com/search/api/`.

Local system reference checked read-only:

- `llm-rs` Gemini proxy detects native Google Search tool requests via
  `googleSearch` / `googleSearchRetrieval` and routes them to Gemini
  rather than OpenRouter;
- `mcp-rs` already has a web-search path that calls
  `system_llm/gemini-proxy/v1beta/models/gemini-3-flash-preview:generateContent`
  with `tools: [{ "googleSearch": {} }]` and extracts
  `groundingMetadata.groundingChunks`;
- this supports trying grounded research through the existing private
  `system_llm` boundary without copying system's chat/MCP architecture.

Recommended provider order:

1. **First choice: Gemini grounding through private `system_llm`.**
   Add an Akustik research provider mode that uses the existing
   `system_llm_gemini_proxy` network/key boundary but sends a research
   request with `tools: [{ "googleSearch": {} }]`. Accept this path only
   if a no-mutation smoke test confirms grounded sources reach Akustik.
2. **Fallback: search API plus model synthesis.** If Gemini grounding is
   unreliable, use Google Programmable Search, Brave Search, or another
   dedicated search API to fetch sources, then use the existing model
   provider to synthesize a structured review. This gives stronger
   source control but costs more implementation and key management.
3. **Alternative: OpenAI web search provider.** Viable if a separate
   OpenAI key/model stack is acceptable, but it is not the lowest-risk
   continuation because Akustik is already bound to `system_llm`.

Do not use a non-grounded model call as "internet research". If the
provider cannot return acceptable source metadata, the UI must say
research was unavailable or insufficient.

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
- return recommendation text only for source-backed value changes;
- require a separate explicit user edit instruction before any suggested
  value movement can become a report patch.

Tests:

- review can return `insufficient_context` without changing the report;
- source-backed review includes URL/title/accessed date metadata;
- weakly comparable sources produce `range_only` or
  `insufficient_sources`, not a precise replacement patch;
- lab/field, airborne/impact, wall/floor, and ISO/ASTM basis mismatches
  are surfaced in `basisNotes`;
- a follow-up patch request after the research answer follows the same
  patch validator as direct report edits.

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
- A source-backed recommendation does not immediately create a patch.
  It can become a report patch only after a separate explicit user edit
  instruction, followed by the same preview, validator, and
  user-confirmation path as manual report edits.
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
base. Patch-provider binding is already implemented; the remaining
estimate is for the grounded research/ask mode and targeted
manipulation polish.

- Plan/documentation reconciliation after live patch binding: under 1
  hour.
- Deploy/smoke the existing grounded Gemini research provider path
  through private `system_llm`: 1-2 hours if the proxy returns
  `groundingMetadata` unchanged enough to parse.
- Trace snapshot persistence plus context/parser tests: 3-5 hours,
  because it touches proposal document build, preview storage, context
  parsing, and explain-readiness.
- Separate search API plus model synthesis fallback: 5-8 hours after
  provider selection, because source access, rate limits, result
  quality, and key handling change the scope.
- Explain intent and answer UI: 2-4 hours after trace snapshot exists.
- Source-bounded value recommendation contract, parser, source-quality
  normalization, comparability fields, and tests: 3-5 hours.
- Single assistant input polish for patch/research/explain modes: 1-2
  hours.
- Production smoke and Akustik-only deploy after tests: 30-60 minutes.
- First controlled stale-value mention replacement operation: 1-2 hours
  after grounded research or patch UX is stable.

Do not estimate or implement a full `chatd-rs`/MCP clone for this
feature. That broader architecture is unnecessary for this report-only
assistant. The target is a strong report manipulator with strict local
validation, not a project-wide multi-agent assistant.

## Validation Strategy

This is not a calculator runtime slice. Do not run broad calculator gate
work because of the plan alone.

Expected validation for the next grounded-research slice:

- targeted unit tests for the grounded research request builder,
  including `tools: [{ "googleSearch": {} }]`;
- response parser tests for Gemini answer text,
  `groundingMetadata.groundingChunks`, missing metadata, malformed
  JSON/text, unsafe source URLs, and no-source fallback;
- source-research tests proving citation metadata is sanitized, weak
  comparability cannot produce a precise patch, and recommended values
  still go through patch validation;
- UI tests proving research-intent requests display answer/source states
  while patch-intent requests keep the guarded patch preview/apply flow;
- browser smoke from real proposal configure pages proving deployed
  explain/research/patch flows, answer/source rendering, and unchanged
  report values for no-mutation research prompts across more than the
  first floor/Rw baseline;
- `git diff --check`;
- `pnpm check` if shared schemas, app routes, or broad proposal behavior
  move enough to justify full validation.

Run `pnpm calculator:gate:current` only if implementation touches engine
runtime behavior, answer boundaries, shared calculator output schemas,
or calculator/report parity contracts.

## Production Binding Decisions - 2026-06-03

This implementation must treat the three live projects on the server as
separate systems:

- Akustikhesap is the only writable target for this slice:
  `<akustikhesap repo>` and `<akustikhesap-compose.yml>`.
- `system.machinity.ai` is read-only reference infrastructure for this
  slice. Its `system_llm` Gemini proxy may be consumed over private
  Docker networking, but the `machinity-kanban` repo, compose file, and
  running system containers must not be edited or restarted by this
  Akustikhesap change.
- `system.ozgurozcangrup.com` is a separate Drogon/Gemini-CLI/MCP
  stack. Akustikhesap must not reference `drogon_*`,
  `ozgurozcan*`, `ozg-system-mcp-ro`, or its chat/MCP endpoints.

Model provider env names are now fixed:

```env
DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER=system_llm_gemini_proxy
DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT=http://system_llm:4000/gemini-proxy
DYNECHO_REPORT_ASSISTANT_MODEL=gemini-3-flash-preview
DYNECHO_REPORT_ASSISTANT_MODEL_TIMEOUT_MS=12000
DYNECHO_REPORT_ASSISTANT_MODEL_PROXY_KEY=
```

`DYNECHO_REPORT_ASSISTANT_MODEL_API_KEY` remains reserved for the
`custom_patch_provider` bearer token. It must not be reused as the
`system_llm` Gemini proxy key. `DYNECHO_REPORT_ASSISTANT_MODEL_PROXY_KEY`
is optional and, when set, is sent server-side as both `x-goog-api-key`
and `Authorization: Bearer ...` to match `system_llm`'s incoming key
extractor. Runtime status may report only `proxyKeyConfigured: true`;
it must never expose the key value.

The production compose may populate
`DYNECHO_REPORT_ASSISTANT_MODEL_PROXY_KEY` from the existing server-side
`GEMINI_API_KEY` interpolation. The key value must not be copied into
the repository, status JSON, logs, or docs.

`DYNECHO_REPORT_ASSISTANT_LLM_SHARED_SECRET` is intentionally not part
of the first live binding. The current `system_llm` implementation
exempts `/gemini-proxy/*` from `LLM_SHARED_SECRET`, so the production
boundary for this route is private Docker reachability plus the
Gemini-proxy incoming-key allowlist when that allowlist is configured on
the system side.

Compose/network decisions:

- Akustikhesap is attached to the existing external `system_kanban_net`
  only so
  `http://system_llm:4000/gemini-proxy` resolves from
  `akustikhesap_landing`;
- keep Traefik routing unchanged and do not expose `system_llm`
  publicly;
- keep the patch model endpoint explicitly configured only in
  Akustikhesap compose;
- do not configure a dedicated source research endpoint until grounded
  research parser/tests/smoke prove the implicit Gemini path is
  insufficient or unreliable.

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
  research. Current recommendation is `system_llm`-backed Gemini
  grounding first, with dedicated search API fallback if grounding
  metadata or source quality is insufficient.
- Minimum evidence threshold for a precise recommended value versus a
  range-only recommendation.
- How the exported report should display source-backed overrides:
  visible recommendation note, source appendix, or internal audit only.
- Whether optional MCP should be implemented at all before the in-app
  assistant has real usage feedback.
- Whether controlled stale-value mention replacement should ship with
  the research UX split or in a later cleanup slice.

## Recommended Current Slice

Phase C2 live patch binding, local trace/explain work, and the core
browser request lifecycle primitives are implemented in the current
working tree. The next slice should be:

**Conversational Acoustic Assistant Hardening**

Reason:

- the user's current need is assistant behavior, not only value patching;
- the app already has a patch validator and a model provider path;
- the UI can already route `explain`, `research`, and `patch` from the
  same assistant input locally;
- the request lifecycle primitives now exist, so the remaining blocker is
  proof under production/browser failure modes: timeout, abort, retry,
  stale response suppression, refresh/reopen recovery, and conversation
  discard when the document changes;
- the research answer contract is still too thin for a dependable
  acoustic review assistant because it lacks durable comparability,
  source-quality, confidence, value-range, and insufficient-source
  fields;
- the assistant still needs an assembly/layer alternative research
  contract for "şu layerın alternatifi ne" style questions, which are
  distinct from "is this one metric plausible";
- report consistency needs a stronger closeout path after overrides:
  stale-value mentions are currently detected, but not yet resolved by a
  guarded text-location patch;
- source-backed recommendations must remain report-only and non-mutating
  until the user explicitly asks for an edit.

Concrete next tasks:

- define assistant intent classes explicitly:
  `explain_metric_trace`, `research_metric_plausibility`,
  `research_assembly_alternatives`, `challenge_or_retry`,
  `propose_report_patch`, and `log_review_finding`;
- preserve the current rule that only `propose_report_patch` can produce
  a patch draft, and only after a separate explicit user edit command;
- expand `pnpm smoke:report-assistant` from `floor-rw` and `wall-rw` to
  live impact-output proposal cases, while keeping it separate from
  normal local `e2e` because it calls live providers;
- production-smoke the browser-side assistant request manager with
  request ids, client abort/timeout, bounded retry, defensive response
  parsing, slow/failed provider behavior, and interrupted-network
  recovery;
- add route/UI race coverage proving active request id and current
  `documentSignature` guard all async assistant state writes;
- production-smoke bounded same-document conversation state and
  cross-document discard;
- verify `Retry latest` for safe research/patch requests and confirm it
  never retries finding-log writes or apply operations;
- normalize explain/research/patch/error/fallback responses into a
  consistent answer view model;
- extend the metric research parser/schema to display answer, sources,
  confidence, comparability, value range, and explicit
  insufficient-source states;
- add a non-mutating assembly/layer alternative research schema with:
  `suggestedAlternatives`, `affectedLayers`, `expectedMetricDirection`,
  `expectedTradeoffs`, `sourceQuality`, `comparability`,
  `comparableAssemblies`, `missingEvidence`, and
  `insufficientSourcesReason`;
- add a guarded report-consistency pass after metric overrides:
  detect stale old-value mentions, expose exact text paths, and allow
  only user-approved text-location replacements or assistant notes;
- require a follow-up edit command before generating a patch from
  research advice;
- defer optional MCP and broad/freeform prose rewriting until the in-app
  assistant is useful and stable. Guarded text-location consistency
  patches for stale numeric mentions belong in this slice because report
  consistency is part of the core user goal.

2026-06-04 hardening progress:

- implemented explicit intent classes in
  `apps/web/features/workbench/report-assistant-intent.ts`, including
  `research_assembly_alternatives`, `challenge_or_retry`, and
  `propose_report_patch`;
- added a separate non-mutating assembly/layer alternative research
  contract in
  `apps/web/features/workbench/report-assistant-assembly-alternatives.ts`;
- added
  `apps/web/app/api/report-assistant/assembly-alternatives/route.ts`
  so "layer alternatifi" prompts no longer have to masquerade as metric
  plausibility checks;
- connected the report assistant UI router so
  `research_assembly_alternatives` calls the new endpoint, while
  challenge/retry prompts after a layer research answer stay on the
  layer-research path;
- added `assembly_alternatives_research` to the browser request
  lifecycle registry so request id and `documentSignature` stale-result
  guards cover this path separately from metric plausibility;
- preserved the non-mutation rule: assembly research returns
  `suggestedAlternatives`, `affectedLayers`, expected metric direction,
  tradeoffs, comparability, source quality, comparable assemblies,
  missing evidence, insufficient-source reason, and sanitized
  `http`/`https` sources, but it does not expose or preload report
  patches.
- extended metric plausibility research responses with `comparability`,
  `sourceQuality`, `confidence`, optional `valueRange`,
  `missingEvidence`, and `insufficientSourcesReason`, with provider
  enum-alias normalization and context-only fallback defaults;
- updated the metric research provider contract and Gemini grounded
  strict-retry prompt so source-backed review answers request those
  fields explicitly;
- updated the assistant answer view and manual plausibility panel so
  source quality, comparability, confidence, value range, source
  limitation, and missing evidence are visible beside verdict/severity.
- added route coverage proving the new assembly/layer alternative
  endpoint can return a context-only review without requiring a metric
  and without mutating the report document.
- implemented guarded stale-value text-location consistency patches in
  `apps/web/features/workbench/report-assistant-patch.ts` using the
  `replace_report_text_value` operation. The guard accepts only allowed
  report text paths, exact current `beforeText`, exact old `beforeValue`,
  and literal replacement to the approved `afterValue`;
- connected the proposal adjustment UI so detected stale narrative value
  mentions can be added to the existing patch draft only through a
  user action, then previewed and applied by the existing guarded Apply
  flow;
- kept the model patch prompt constrained to numeric/report-note
  operations; text-location consistency replacements are deterministic
  UI additions, not freeform model rewrites.
- added assembly-specific request lifecycle coverage proving
  `assembly_alternatives_research` rejects delayed older request ids and
  previous-document `documentSignature` results;
- added request-client coverage proving assembly alternative research is
  retried as a safe research request after transient provider failure,
  while finding-log writes remain non-retry;
- extended the proposal-adjust UI source contract test to pin the
  assembly endpoint, assembly request guard/finish calls, retry label,
  and the guarded stale-text consistency button/operation path.
- extended `tools/smoke/report-assistant-browser-smoke.ts` beyond the
  original `floor-rw` and `wall-rw` cases. The default live smoke case
  set is now `floor-rw`, `floor-lnw`, `wall-rw`, and
  `floor-assembly-alternatives`; `wall-assembly-alternatives` is also
  selectable through `AKUSTIK_ASSISTANT_SMOKE_CASES`.
- the expanded smoke now checks a live impact-output conversation for
  `Ln,w`, including local trace explanation, grounded/source research,
  a guarded `output:Ln,w` patch preview, and unchanged metric context
  for no-mutation research;
- the expanded smoke now checks non-mutating assembly/layer alternative
  research, requires visible source URLs, verifies the `Retry layer
  research` state, rejects exposed `suggestedReportPatch` text, and
  verifies the assistant metric context stays unchanged;
- the expanded smoke now checks the guarded stale-value consistency UI
  on the `floor-rw` patch path: after an AI-model `adjust_metric_db`
  preview, the smoke requires the "Old value text still appears outside
  metric rows" warning, clicks "Add guarded text replacements", verifies
  `replace_report_text_value` enters the patch draft, verifies the
  "Replace stale text at ..." preview, and still does not click Apply.
- added a separate mocked browser failure smoke command:
  `pnpm smoke:report-assistant:failure`. It uses the real workbench and
  proposal configure UI, but intercepts report-assistant browser
  endpoint calls so no live model provider or internet-grounded research
  provider is contacted.
- the mocked failure smoke covers provider failure and recovery: the
  plausibility endpoint is forced to return two transient `503`
  responses, the UI must surface the error plus `attempts 2` request
  metadata, and `Retry research` must recover into a non-mutating
  context answer without exposing `suggestedReportPatch`;
- the mocked failure smoke covers same-document conversation recovery
  and cross-document discard: after the recovered answer, a reload of
  the same proposal configure document must restore the conversation,
  while loading the wall sample must not show the previous floor
  conversation;
- the mocked failure smoke covers interrupted patch request recovery:
  the patch endpoint aborts the first browser request and returns a
  valid mocked patch on the retry, so the UI must display an
  AI-model-source, validator-`valid`, preview-only `adjust_metric_db`
  patch with `attempts 2` metadata and no Apply click.
- the mocked failure smoke now also covers the slow-provider timeout UI
  path. The assembly/layer alternative endpoint is held open past the
  browser request client's timeout on both safe retry attempts; the UI
  must surface "Report assistant request timed out before the provider
  returned", show `attempts 2` plus `timed out` request metadata, keep
  `Retry layer research` available, and preserve the assistant metric
  context. This makes `pnpm smoke:report-assistant:failure`
  intentionally slower than the normal live smoke, but it still avoids
  calling live model/source providers.
- local working-tree execution of
  `AKUSTIK_SMOKE_BASE_URL=http://127.0.0.1:3010 pnpm
  smoke:report-assistant:failure` passed against a Next dev server on
  port `3010`. The result reported `assemblyTimeoutCalls: 2`,
  `providerFailureRecoveryCalls: 3`, `patchNetworkRecoveryCalls: 2`,
  `sameDocumentConversationRestored: true`,
  `crossDocumentConversationDiscarded: true`,
  `metricContextPreserved: true`, and `mutationApplied: false`.
- added `pnpm smoke:report-assistant:preflight` as a non-mutating
  production-readiness gate for the expanded live smoke. It signs in,
  checks root/status/configure HTTP readiness, verifies model/research
  provider readiness from `/api/report-assistant/status`, confirms
  `mutatingToolsExposed: false`, downloads the configure page bundles,
  and checks for the current smoke-required UI/route strings before any
  live provider research or patch request is attempted.
- production preflight on 2026-06-04 found provider readiness but not a
  matching deployed bundle. Root/login/status/configure all returned
  ready HTTP statuses, model and research providers were configured with
  no readiness warnings, and `mutatingToolsExposed` was `false`; however
  the deployed configure bundles did not contain
  `/api/report-assistant/assembly-alternatives`,
  `Retry layer research`, `Add guarded text replacements`, or
  `replace_report_text_value`. Therefore the expanded live smoke was
  intentionally not run against production in this pass, because it
  would test newer working-tree expectations against an older deployed
  client bundle.

Validation for this progress slice:

- `pnpm exec vitest run features/workbench/report-assistant-patch.test.ts features/workbench/report-assistant-tools.test.ts features/workbench/report-assistant-model.test.ts features/workbench/report-assistant-plausibility.test.ts features/workbench/report-assistant-plausibility-research.test.ts features/workbench/report-assistant-request-client.test.ts features/workbench/report-assistant-request-lifecycle.test.ts features/workbench/report-assistant-conversation-storage.test.ts features/workbench/report-assistant-intent.test.ts features/workbench/report-assistant-trace-explanation.test.ts features/workbench/simple-workbench-assistant-trace-snapshot.test.ts features/workbench/report-assistant-assembly-alternatives.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench/proposal-adjust-layout.test.ts --maxWorkers=1`
  passed: 14 files / 91 tests;
- targeted ESLint passed for the new assembly module, route, request
  lifecycle/client files, request lifecycle test, metric plausibility
  modules/tests, patch core/tests, model core/tests, and proposal-adjust
  client page;
- after the smoke expansion, `pnpm exec eslint
  tools/smoke/report-assistant-browser-smoke.ts` passed;
- after the smoke expansion, `pnpm exec tsc --project tsconfig.json
  --noEmit` passed for the repo-level tool TypeScript project;
- after the mocked failure smoke addition, `pnpm exec eslint
  tools/smoke/report-assistant-browser-failure-smoke.ts
  tools/smoke/report-assistant-browser-smoke.ts` passed;
- after the mocked failure smoke addition, `pnpm exec tsc --project
  tsconfig.json --noEmit` passed for the repo-level tool TypeScript
  project;
- after the slow-timeout coverage addition, `pnpm exec eslint
  tools/smoke/report-assistant-browser-failure-smoke.ts` passed;
- after the slow-timeout coverage addition, `pnpm exec tsc --project
  tsconfig.json --noEmit` passed for the repo-level tool TypeScript
  project;
- `AKUSTIK_SMOKE_BASE_URL=http://127.0.0.1:3010 pnpm
  smoke:report-assistant:failure` passed on the local dev server. The
  dev server emitted only expected local-dev warnings (`node >=22`
  engine warning under local Node v20 and Next's future
  `allowedDevOrigins` warning for `127.0.0.1` assets);
- `pnpm exec eslint
  tools/smoke/report-assistant-production-preflight.ts
  tools/smoke/report-assistant-browser-failure-smoke.ts
  tools/smoke/report-assistant-browser-smoke.ts` passed;
- `pnpm exec tsc --project tsconfig.json --noEmit` passed after the
  preflight addition;
- `pnpm smoke:report-assistant:preflight` ran against production and
  exited non-zero by design because the deployed client bundle is not yet
  matching the expanded smoke expectations. Safe readiness checks inside
  that run were green: root `200`, login `200`, status `200`, configure
  `200`, model ready, research ready, and no mutating tools exposed;
- `git diff --check` passed.

Still next:

- run the expanded `pnpm smoke:report-assistant` against production
  only after `pnpm smoke:report-assistant:preflight` passes against the
  deployed bundle. The live smoke signs into the workbench, calls live
  model/source providers, and performs internet-grounded research;
- optionally repeat `pnpm smoke:report-assistant:failure` against a
  known matching deployed build after deploy. It already passed against
  the local working-tree dev server and should not reach live
  model/source providers because assistant endpoint calls are mocked in
  the browser;
- consider making `wall-assembly-alternatives` part of the default live
  smoke set once the added provider cost and source quality are
  acceptable.
