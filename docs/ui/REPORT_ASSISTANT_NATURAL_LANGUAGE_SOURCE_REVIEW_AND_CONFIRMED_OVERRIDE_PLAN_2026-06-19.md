# Report Assistant Natural-Language Source Review And Confirmed Override Plan - 2026-06-19

## Purpose

This document captures the next assistant product target after the 2026-06-19
checkpoint:

The assistant should feel usable in natural Turkish/English, operate the
calculator draft when the user asks for layer-stack work, and optionally use
web/source research to judge whether a calculator result looks plausible. If
research suggests a different report value, the assistant may ask for explicit
user approval to apply a report-only override. It must not silently replace the
calculator result.

Plain Turkish target:

```text
Kullanıcı: Ekrandaki stacke bak, Rw fazla mı az mı? İnternetten araştır,
daha makul değer ne olur söyle.

Asistan:
- calculator'ın canlı Rw değerini okur;
- stack/layer özetini araştırma provider'ına yollar;
- kaynaklardan benzer sistem aralığını ve karşılaştırılabilirliği çıkarır;
- "calculator değeri düşük/yüksek/makul görünüyor" diye yorumlar;
- kaynak destekli öneri varsa "raporda önerilen değer olarak X dB yazayım mı?"
  diye sorar;
- kullanıcı onay vermeden rapor değerini değiştirmez;
- calculator live sonucunu ve engine truth'u değiştirmez.
```

This is assistant/report/workbench work only. It must not touch engine formulas,
route selection, source-row imports, metric aliases, or calculator runtime
truth.

## Current Implementation Baseline

Relevant landed surfaces:

- Natural-language calculator draft control exists in
  `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.ts`.
  It can replace/add/remove/move/update layers, set outputs, set explicit
  calculator context fields, generate bounded candidate stacks, preview
  candidates, and apply confirmed Workbench proposals through unsaved browser
  draft guards.
- The 2026-06-19 local pass broadened natural wording for material families:
  `gypsum`, `gypsium`, `gypsum board`, `plasterboard`, `rock wool`,
  `rockwool`, and Turkish suffix forms such as `gypsumdan` can resolve to
  catalog materials when the general catalog item exists.
- `inputları makul doldur` now lets the assistant fill draft layer thicknesses
  and wall context inputs for the calculator draft while still warning that
  these are engineering-default draft values.
- Calculator preview remains the numeric authority in
  `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`.
  Described stacks and Workbench snapshots are converted to calculator preview
  requests; the assistant does not author `Rw`, `STC`, `Ln,w`, `AIIC`, or dB
  values in prose.
- Source-backed plausibility review already exists around reports in
  `apps/web/features/workbench/report-assistant-plausibility.ts` and
  `apps/web/features/workbench/report-assistant-plausibility-research.ts`.
  It can use context-only review or a configured research provider, normalize
  comparable assemblies, retain source URLs, downgrade weak evidence, and
  suppress provider-supplied `suggestedReportPatch` from research responses.
- Report patch validation already exists in
  `apps/web/features/workbench/report-assistant-patch.ts`. Report metric edits
  are report-document edits with validation, stale checks, and confirmation
  flow; they do not modify engine values or saved calculator truth.

Previous gap before the calculator UI wiring:

- The calculator-page assistant and the report plausibility/research route are
  not yet one coherent user flow for:

```text
Ekrandaki stacke bak. Rw fazla mı az mı? İnternetten araştır. Daha makul
değer varsa bana sor, onaylarsam rapora uygula.
```

2026-06-19 calculator UI wiring update:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx` now detects
  current calculator source-review wording such as `Rw fazla mı az mı,
  internetten araştır` before the stack-mutation parser runs.
- Source-review commands do not mutate the visible layer stack. The UI first
  runs or reuses the current calculator preview, builds a
  `currentCalculatorReviewPacket`, posts it to
  `/api/report-assistant/plausibility`, and renders the returned typed
  `research_review_card` with `AssistantResultCard`.
- If the user asks about an output that is not currently selected, such as
  `STC yüksek mi araştır` while only `Rw` is selected, the UI adds that output
  only to the temporary source-review preview snapshot; the visible selected
  outputs remain unchanged.
- Draft changes abort/clear stale source-review requests and results.
- The route call keeps `suggestPatch: false`; calculator-screen source review
  remains advisory and does not change calculator values or report values.
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
  now covers source-review intent routing, explicit metric selection, packet
  wiring, plausibility route use, and typed result-card rendering.
- Latest focused validation passed after this wiring: 10 assistant test files /
  93 tests, full web typecheck, and touched assistant/doc whitespace checks.

2026-06-20 best-practice research and remaining-gap analysis:

External references checked:

- OpenAI function-calling best practices:
  `https://developers.openai.com/api/docs/guides/function-calling#best-practices-for-defining-functions`.
  Relevant guidance: keep tool/function names and arguments explicit, use enums
  or object structure so invalid states are hard to represent, do not ask the
  model to fill arguments the application already knows, and keep the initially
  exposed tool surface small.
- OpenAI strict mode and Structured Outputs:
  `https://developers.openai.com/api/docs/guides/function-calling#strict-mode`
  and `https://developers.openai.com/api/docs/guides/structured-outputs`.
  Relevant guidance: prefer strict/schema-backed outputs over best-effort JSON,
  and still validate user-generated or provider-generated content because
  structured output can be well-formed but semantically wrong.
- OpenAI reasoning-model/tool guidance:
  `https://developers.openai.com/api/docs/guides/latest-model#using-reasoning-models`.
  Relevant guidance: put tool-specific rules in the tool/route contract, use
  structured outputs for automatic validation, keep state management explicit,
  and use tracing/agent patterns when product debugging needs them.
- OWASP LLM Top 10:
  `https://owasp.org/www-project-top-10-for-large-language-model-applications/`.
  Relevant risks: prompt injection, insecure output handling, sensitive
  information disclosure, and excessive agency.

Current conclusion:

- The core source-review path is directionally correct: calculator values come
  from the app-owned preview packet, provider text is advisory, provider patches
  are suppressed, and visible calculator state is not mutated.
- The remaining product gap is not "make the assistant calculate"; it is "make
  the advisory review useful enough to ask the user for a safe report-only
  change when the user explicitly wants that".
- The remaining reliability gap is not more prompt text alone; it is broader
  intent eval coverage plus a schema-backed fallback for ambiguous natural
  language.
- Runtime trace persistence is useful for production debugging, but it should
  stay behind the product-visible gaps unless a bounded collection requirement
  is confirmed.

Implementation alignment check - 2026-06-20 hardening pass:

| Area | Current implementation | Risk if implemented loosely | Required plan constraint |
| --- | --- | --- | --- |
| Current calculator review | `calculator-workbench.tsx` builds a temporary calculator preview when needed, creates `currentCalculatorReviewPacket`, sends it to `/api/report-assistant/plausibility`, and keeps `suggestPatch: false`. | Reusing this request for report mutation would weaken the read-only calculator boundary. | Keep the first source-review request read-only forever. A later report edit must be a separate explicit user-confirmed step. |
| Source-backed report patching | The plausibility route can already build and validate a report-only patch, but only when it receives a report `context` and `document`; current-calculator packets intentionally suppress suggested patches. | Letting provider text or the calculator-page review response directly create operations could bypass stale guards and patch validation. | The confirmed apply gate must call the existing patch validator with a current report document/context, or stay disabled with a clear "open/create a report first" message. |
| Report editor apply | `report-editor.tsx` already applies `ReportAssistantPatchValidationResult` through `applyValidatedReportAssistantPatch(..., confirmed: true, scope: "export_only", source: "assistant")`. | Duplicating a separate apply path in the calculator page could create a second, inconsistent report mutation surface. | Prefer a shared helper or handoff that reuses the existing validation/apply semantics instead of inventing calculator-page report mutation logic. |
| Calculator page report state | `calculator-workbench.tsx` can build a report snapshot and can open saved reports, but the source-review card currently has no validated report target attached. | Showing "apply to report" when no report target exists would confuse users and could apply to the wrong document. | The apply button is visible only when a current report document/signature and target report context are available; otherwise show a non-mutating next action such as "open report" or "create report snapshot". |
| Intent routing | Deterministic patterns route common review wording before layer mutation parsing. | More varied wording can still be misread as layer mutation or direct report override. | Add golden evals first, then add a typed fallback classifier for ambiguous review/override wording. Low confidence must ask a clarification. |
| Provider smoke | Route tests cover mocked/context-backed provider behavior. | A real provider can return different shapes, source links, or weak evidence wording. | Add provider-gated smoke that verifies the live path without making provider credentials a hard local requirement. |
| Trace/log | A pure redacted trace helper exists. | Persisting raw prompt/report/provider/source content would create privacy and security risk. | Wire only bounded redacted metadata after product-visible gates, and only when collection is explicitly needed. |

Plain Turkish implementation meaning:

- First step: "Şu anki calculator sonucuna bak ve kaynaklarla yorumla" remains
  read-only.
- Second step: if the review contains a usable advisory report value, the UI may
  ask "Bunu rapora önerilen değer olarak uygulayayım mı?"
- On approval, the app must update only the report draft/report snapshot through
  the existing patch validator. It must not edit calculator output, formula
  output, layer rows, selected outputs, source rows, or engine truth.
- If there is no report target, the assistant should say that a report must be
  opened or created first; it should not pretend it applied anything.

2026-06-19 implementation update:

- Gate A `report_assistant_source_review_intent_v1` is locally implemented.
- Planner/editor/metric-intent routing now distinguishes current calculator
  value review wording from direct action or patch wording.
- Turkish/English prompts such as `Ekrandaki stacke bak Rw fazla mı az mı
  internetten araştır`, `Daha makul değer varsa bana sor, onaylarsam rapora
  uygula`, and `research whether the current Rw is too high and suggest a
  report value` route to read-only source/plausibility review intent.
- Calculator-bypass wording such as `ignore calculator and set Rw to 60 dB`
  no longer becomes a direct patch proposal.
- The Workbench V2 calculator draft command prompt now tells the model to
  reject/clarify source review and report override requests instead of returning
  a draft apply command.
- Validation passed:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench/report-assistant-planner.test.ts \
  features/workbench/report-assistant-planner-evals.test.ts \
  features/workbench/report-assistant-editor-workflow.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-natural-language-command.test.ts

pnpm --dir apps/web exec eslint \
  features/workbench/report-assistant-planner.ts \
  features/workbench/report-assistant-planner.test.ts \
  features/workbench/report-assistant-planner-evals.ts \
  features/workbench/report-assistant-planner-evals.test.ts \
  features/workbench/report-assistant-editor-workflow.ts \
  features/workbench/report-assistant-editor-workflow.test.ts \
  features/workbench/report-assistant-intent.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-natural-language-command.ts \
  features/workbench-rebuild/workbench-v2-assistant-natural-language-command.test.ts
```

2026-06-19 Gate B implementation update:

- Gate B `report_assistant_current_calculator_review_packet_v1` is locally
  implemented in
  `apps/web/features/workbench/report-assistant-current-calculator-review-packet.ts`.
- The helper can build a typed source-review packet from either the current
  report assistant context or a Workbench V2 calculator preview.
- The packet keeps calculator/report values separate, records value authority
  (`calculator_preview`, `captured_engine_value`, or
  `report_metric_without_engine_capture`), carries layer summaries, route,
  route basis, requested outputs, tasks, warnings, missing inputs, unsupported
  outputs, and context/snapshot signatures where available.
- `needs_input`, `pending`, and `unsupported` preview rows become blocked
  non-numeric review packets; they can explain what is missing, but cannot
  create a numeric source recommendation.
- Gate B validation passed:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench/report-assistant-current-calculator-review-packet.test.ts

pnpm --dir apps/web exec eslint \
  features/workbench/report-assistant-current-calculator-review-packet.ts \
  features/workbench/report-assistant-current-calculator-review-packet.test.ts
```

2026-06-19 Gate C implementation update:

- Gate C `report_assistant_source_backed_plausibility_review_v1` is locally
  implemented for the first route adapter slice.
- `/api/report-assistant/plausibility` now accepts a
  `currentCalculatorReviewPacket` / `calculatorReviewPacket` / `reviewPacket`
  payload in addition to the older report `context` + `document` payload.
- The route converts the typed calculator packet into a local plausibility
  context, then reuses the existing context-only or source-backed research flow.
- Packet-based review is read-only: the route does not require a report
  document, does not validate/apply report patches, and suppresses any
  provider-supplied `suggestedReportPatch`.
- Research providers receive calculator-owned fields from the packet: layer
  summary, selected metric id, calculator display value, route, basis, tasks,
  warnings, missing inputs, and unsupported outputs.
- Gate C validation passed:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench/report-assistant-current-calculator-review-packet.test.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts

pnpm --dir apps/web exec eslint \
  features/workbench/report-assistant-current-calculator-review-packet.ts \
  features/workbench/report-assistant-current-calculator-review-packet.test.ts \
  features/workbench/report-assistant-plausibility.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-plausibility-research.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  app/api/report-assistant/plausibility/route.ts

pnpm --dir apps/web typecheck
```

2026-06-19 Gate D implementation update:

- Gate D `report_assistant_source_review_card_v1` is locally implemented for
  the shared assistant result card.
- `plausibilityReviewToAssistantResult` now includes explicit evidence fields
  for calculator value, reviewed value, source verdict, source quality,
  comparability, citation count, source range, and suggested report value when
  present.
- `AssistantResultCard` renders `research_review_card` envelopes with a
  dedicated source-review summary that visually separates:
  - calculator result;
  - research verdict;
  - advisory suggested report value;
  - comparability/source quality/source count/range.
- The generic trace section no longer repeats those summary evidence fields for
  research cards.
- This is display-only. It does not create apply controls and does not change
  calculator, report, or provider behavior.
- Gate D validation passed:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench/report-assistant-result-card.test.ts \
  features/workbench/report-assistant-result-card-model.test.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts

pnpm --dir apps/web exec eslint \
  features/workbench/report-assistant-result-card.tsx \
  features/workbench/report-assistant-result-card.test.ts \
  features/workbench/report-assistant-result-card-model.ts \
  features/workbench/report-assistant-result-card-model.test.ts \
  features/workbench/report-assistant-plausibility-result.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts

pnpm --dir apps/web typecheck
```

2026-06-19 Gate E implementation update:

- Gate E `report_assistant_source_backed_report_override_proposal_v1` is
  locally implemented for report-context source reviews.
- When source research returns a validated `valueRecommendation` with a concrete
  `displayValue` or `targetDb`, the server can build its own report-only
  `set_metric_display_value` patch and send it through the existing
  `validateReportAssistantPatch` path.
- The proposal is always non-mutating and `requiresUserConfirmation: true`.
- The current calculator value remains separate and unchanged; this patch only
  targets the report/export document value after explicit user confirmation.
- The server does not trust provider-supplied `suggestedReportPatch`; provider
  patches remain ignored for research requests.
- Packet-only calculator reviews still do not produce report patches because
  they do not include a report document/signature to validate against.
- `needs_input`, `unsupported`, no-source, `not_comparable`, sourceQuality
  `none`, and same-value recommendations do not produce a patch.
- Gate E validation passed:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-patch.test.ts \
  features/workbench/report-assistant-result-card.test.ts

pnpm --dir apps/web exec eslint \
  features/workbench/report-assistant-plausibility.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-patch.ts \
  features/workbench/report-assistant-patch.test.ts \
  features/workbench/report-assistant-result-card.test.ts \
  app/api/report-assistant/plausibility/route.ts

pnpm --dir apps/web typecheck
```

2026-06-19 Gate F implementation update:

- Gate F `report_assistant_source_review_eval_trace_v1` is locally
  implemented for the first eval/trace refresh.
- The golden eval matrix now includes `source_review_advisory`, proving that a
  source-backed plausibility review can recommend a report value without gaining
  calculator-backed authority, numeric basis rows, mutation posture, or apply
  permission.
- Redacted trace tests now cover source-review confirmation posture and verify
  that calculator/source dB values, provider transcript text, suppressed patch
  wording, and source URLs are not persisted in trace events.
- Gate F validation passed:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench/report-assistant-golden-evals.test.ts \
  features/workbench/report-assistant-redacted-trace-events.test.ts

pnpm --dir apps/web exec eslint \
  features/workbench/report-assistant-golden-evals.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  features/workbench/report-assistant-redacted-trace-events.ts \
  features/workbench/report-assistant-redacted-trace-events.test.ts

pnpm --dir apps/web typecheck
```

## External Research Scan

Checked on 2026-06-19:

- OpenAI function calling guidance describes tool calling as an app-owned
  multi-step flow: model asks for a tool, application code executes it, then
  tool output is returned to the model. Consequence for DynEcho: calculator,
  research, and patch execution remain application routes; the model may choose
  or propose but does not execute hidden side effects.
  Source: https://developers.openai.com/api/docs/guides/function-calling
- OpenAI Structured Outputs guidance says schema-constrained outputs prevent
  missing required keys and invalid enum hallucinations better than plain JSON
  mode. Consequence: planner decisions, research reviews, proposed report
  overrides, and confirmation requests should be typed JSON/envelopes, not
  prose parsed after the fact.
  Source: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI guardrail and human-review guidance separates automatic validation
  from approval decisions and says side-effecting edits should pause for
  human approval. Consequence: a source-backed value recommendation can become
  a pending report override only after validation; applying it requires explicit
  user confirmation and stale checks.
  Source: https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
- OpenAI accuracy guidance frames RAG/retrieval as useful for missing or current
  context, but still requiring evaluation because retrieval can supply wrong or
  noisy context. Consequence: web research is useful for plausibility review,
  not a new calculator truth source.
  Source: https://developers.openai.com/api/docs/guides/optimizing-llm-accuracy
- Google grounding guidance says grounding reduces hallucinations by connecting
  output to verifiable data and source links. Consequence: research answers must
  display sources and comparability, not just "I found that 52 dB is right."
  Sources:
  https://ai.google.dev/gemini-api/docs/google-search and
  https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/grounding/overview
- OWASP LLM01:2025 describes direct and indirect prompt injection, including
  external website/file content, and recommends constrained behavior plus
  deterministic output validation. Consequence: external source text is
  untrusted evidence, not instructions; it cannot choose tool names, patch
  routes, confirmation state, or calculator values.
  Source: https://genai.owasp.org/llmrisk/llm01-prompt-injection/

## Product Contract

### What the assistant should do

- Understand messy natural language:
  - `gypsum board seç`, `gypsium diz`, `araya rockwool koy`,
    `aynı gypsumdan bir tane daha`, `inputları makul doldur`.
- Use the visible calculator stack and selected outputs before asking the user
  to restate them.
- Run calculator preview first when the user asks whether the current result is
  high/low/plausible.
- When the user asks for research, call the source-backed plausibility route
  with:
  - current stack summary;
  - calculator metric id and calculator display value;
  - basis/status/route tasks;
  - user question;
  - any previous same-context research packet if still fresh.
- Return a structured review card:
  - calculator value;
  - route status and basis;
  - source-backed reviewed range or recommended value if available;
  - comparable source assemblies and differences;
  - verdict: `plausible`, `suspicious`, `likely_wrong`,
    or `insufficient_context`;
  - source quality and confidence;
  - explicit warning that source research is advisory.
- If the review suggests a report value, ask:

```text
Calculator sonucu Rw 41 dB. Benzer kaynaklarda aynı aile için 50-53 dB
görünüyor, ama karşılaştırılabilirlik partial. Rapor için 52 dB kaynak
destekli önerilen değer olarak yazmamı ister misin?
```

### What the assistant must not do

- Do not change calculator live output.
- Do not change engine formulas, source rows, route selection, metric aliases,
  or saved calculator result truth.
- Do not treat a web value as source-row truth.
- Do not produce numeric recommendations for `needs_input` or `unsupported`
  calculator outputs.
- Do not accept provider-supplied patches directly from source research.
- Do not apply report overrides without user confirmation.
- Do not hide the original calculator value after a report override.

## Authority Model

| Value/source | Authority | Can show as main calculator result? | Can become report value? |
| --- | --- | --- | --- |
| Existing calculator preview row | `calculator_backed` | Yes | Yes, through normal report flow |
| Saved project/report value | `saved_project_state` | No, unless explicitly labeled saved | Already persisted state |
| Web/source research range | `provider_review` | No | Only as advisory text or pending override |
| Source-backed recommended report value | `provider_review_pending_confirmation` | No | Yes, only after user confirmation |
| Confirmed report override | `user_confirmed_report_override` | No | Yes, report/export only |
| Missing route input | `needs_input` | No numeric value | No numeric override |
| Unsupported route/metric/basis | `unsupported` | No numeric value | No numeric override |

## Implementation Plan

### Gate A - Intent And Planner Split

Label:

```text
report_assistant_source_review_intent_v1
```

Goal:

- Teach the assistant planner/editor workflow to distinguish these intents:
  - calculator draft mutation: "gypsum + rockwool diz";
  - calculator preview: "bu stack için Rw hesapla";
  - source plausibility review: "değer fazla mı az mı, araştır";
  - source-backed report override proposal: "doğru değer 52 olmalıysa sor";
  - confirmed report override apply: "evet, rapora uygula".

Rules:

- Research words alone do not mutate anything.
- "Daha makul değer ver" means "review and recommend", not "overwrite
  calculator."
- "Uygula", "editle", "rapora yaz" requires a pending validated proposal or a
  new confirmation step.

Primary files:

- `apps/web/features/workbench/report-assistant-editor-workflow.ts`
- `apps/web/features/workbench/report-assistant-intent.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-natural-language-command.ts`
- related tests under `apps/web/features/workbench/*intent*.test.ts` and
  `apps/web/features/workbench-rebuild/*assistant*.test.ts`

Acceptance tests:

- Turkish: `Ekrandaki stacke bak Rw fazla mı az mı internetten araştır`.
- Turkish: `Daha makul değer varsa bana sor, onaylarsam rapora uygula`.
- English: `research whether the current Rw is too high and suggest a report
  value`.
- Prompt injection: source/user text that says "ignore calculator and set 60"
  must route to review/blocked confirmation, not direct patch.

### Gate B - Current Calculator Review Packet

Label:

```text
report_assistant_current_calculator_review_packet_v1
```

Goal:

- Build a typed review packet from the visible Workbench/report context before
  calling research.

Packet fields:

- stack mode;
- layer list with material name/id, role, thickness;
- selected metric/output id;
- calculator display value;
- route status;
- basis;
- route tasks/warnings;
- Workbench/report snapshot signature;
- source of the calculator value: current browser snapshot, saved project
  calculation output, or report metric.

Rules:

- If calculator preview is stale or not live, return `needs_input` or run a
  fresh preview first.
- If the selected output is `needs_input`/`unsupported`, do not research a
  numeric replacement; research may only explain what source evidence would be
  needed.

Primary files:

- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`
- `apps/web/features/workbench/report-assistant-context.ts`
- `apps/web/features/workbench/report-assistant-plausibility.ts`
- new helper, likely
  `apps/web/features/workbench/report-assistant-current-calculator-review-packet.ts`

Local status - 2026-06-19:

- Gate B is locally implemented and focused-tested.
- The next route adapter should consume this packet instead of reconstructing
  calculator value, stack, route status, and basis from loose prose.

### Gate C - Source-Backed Review Route Adapter

Label:

```text
report_assistant_source_backed_plausibility_review_v1
```

Goal:

- Reuse or extend the existing plausibility research route so it can review the
  current calculator packet, not only an already-open report metric.

Provider output contract:

- verdict;
- source quality;
- comparability;
- comparable assemblies;
- source URLs/titles;
- reviewed calculator value;
- source-backed range;
- optional recommended report display value;
- rationale;
- recommended action text.

Hard boundary:

- Provider `suggestedReportPatch` remains ignored for source research.
- The server builds any pending report override proposal itself after local
  validation, never by trusting provider JSON as a patch.

Primary files:

- `apps/web/features/workbench/report-assistant-plausibility-research.ts`
- `apps/web/app/api/report-assistant/plausibility/route.ts`
- `apps/web/features/workbench/report-assistant-result-contract.ts`
- tests in `report-assistant-plausibility-research.test.ts`

Local status - 2026-06-19:

- Gate C is locally implemented for packet-to-route review.
- Existing report context plausibility behavior remains backward-compatible.
- Provider recommendations remain advisory and provider patches remain
  suppressed for research requests.

### Gate D - Review Card UX

Label:

```text
report_assistant_source_review_card_v1
```

Goal:

- Show a card that a normal user can understand:
  - "Calculator sonucu";
  - "Kaynak araştırması";
  - "Benzer sistemler";
  - "Neden farklı olabilir";
  - "Önerilen rapor değeri";
  - "Rapor değerini değiştireyim mi?"

Rules:

- The card must visually separate calculator-backed value from advisory source
  value.
- The original calculator value remains visible even after a report override.
- Source links and comparability limitations are visible.
- If evidence is weak, the CTA should be "log finding / inspect sources", not
  "apply value".

Primary files:

- `apps/web/features/workbench-rebuild/report-editor.tsx`
- `apps/web/features/workbench/report-assistant-result-card-model.ts`
- `apps/web/features/workbench/report-assistant-result-card.tsx`
- route/card tests.

Local status - 2026-06-19:

- Gate D is locally implemented for the shared result-card renderer.
- The current card is display-only; report override proposal behavior is Gate E.

### Gate E - Pending Report Override Proposal

Label:

```text
report_assistant_source_backed_report_override_proposal_v1
```

Goal:

- Convert a source review recommendation into a pending report-only proposal
  after local validation, then ask the user for confirmation.

Proposal fields:

- target report/document signature;
- metric id;
- current calculator display value;
- current report display value;
- suggested display value;
- source review id/signature;
- source refs;
- comparability;
- rationale;
- movement in dB;
- stale policy;
- confirmation question text.

Rules:

- No report document, no report override. If the user is only in Workbench
  calculator view, ask them to open/create a report before applying a report
  value.
- Movement above existing patch limits should become a finding/review task, not
  an auto-loadable patch.
- `needs_input` and `unsupported` outputs cannot create numeric override
  proposals.
- Confirmation is a UI/runtime state, not a sentence from the model.

Primary files:

- `apps/web/features/workbench/report-assistant-patch.ts`
- `apps/web/features/workbench/report-assistant-action-proposal.ts`
- `apps/web/features/workbench-rebuild/report-editor.tsx`
- new tests around confirmed apply and stale rejection.

Local status - 2026-06-19:

- Gate E is locally implemented for pending source-backed report-only patch
  proposals in the plausibility route.
- Actual apply still goes through the existing report patch confirmation UI and
  validator; no new autonomous write path was added.

### Gate F - Golden Evals And Redacted Observability

Label:

```text
report_assistant_source_review_eval_trace_v1
```

Goal:

- Add regression coverage and redacted trace events for the new flow.

Golden cases:

- Natural material stack + calculator preview stays calculator-backed.
- Source review with strong comparable evidence recommends but does not apply.
- User confirms pending source-backed report override and only report value
  changes.
- User declines and nothing changes.
- Weak evidence returns advisory text/finding recommendation only.
- Provider tries to include `suggestedReportPatch`; server suppresses it.
- External source includes prompt injection; route ignores it as instruction.
- Unsupported output blocks numeric recommendation.
- Stale calculator/report signature blocks apply.

Trace fields:

- selected capability;
- calculator value authority;
- research provider used or unavailable;
- source count and source quality;
- comparability;
- proposed override delta;
- confirmation status;
- stale status;
- redaction status.

No full prompt, report body, provider transcript, or raw source page body should
be persisted.

Local status - 2026-06-19:

- Gate F is locally implemented for eval and redacted trace coverage.
- Runtime trace persistence/wiring remains optional Gate G and should not be
  added unless a bounded sink/collection requirement is confirmed.

Local status update - 2026-06-20:

- The calculator-page source-review card now has a selected-report handoff for
  a separate report-only edit. The first review request remains advisory and
  sends `currentCalculatorReviewPacket` with `suggestPatch: false`; the report
  edit is prepared only after a ready review and an explicit UI action.
- The handoff loads the selected saved report, builds a current report assistant
  context, creates the server-owned source-backed report override patch through
  `buildReportAssistantSourceBackedReportOverridePatch`, validates it with
  `validateReportAssistantPatch`, and applies it only after explicit user
  confirmation through `applyValidatedReportAssistantPatch(..., confirmed:
  true, scope: "export_only", source: "assistant")`.
- No selected report means no report mutation. The UI shows "Open or create a
  report first" and keeps the source-review card read-only.
- Context-only review means no report mutation. The report edit action is
  prepared only from a source-backed review; otherwise the card remains advisory.
- Applying the proposal stores the original selected report as the local base
  preview, stores the patched document as local report customizations, and opens
  the report editor for review/save. It does not change calculator output rows,
  layer rows, selected outputs, or engine truth.
- Intent detection is deterministic and tested for common Turkish/English
  phrases, but it is still pattern-heavy. More natural wording should be covered
  by golden evals and an explicit typed fallback before calling this done.
- Provider-backed research is route-tested with mocked/context-backed responses.
  A browser/manual smoke with a configured provider is still needed before
  saying the live internet/provider path is product-verified.

Local provider-smoke readiness check - 2026-06-20:

- The route supports either a dedicated
  `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT` or an implicit
  `system_llm_gemini_proxy` research provider through
  `DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER=system_llm_gemini_proxy`.
- Current shell environment has no report-assistant research/model provider
  variables configured.
- Current `apps/web/.env.local` contains only auth variables, not research or
  model provider variables. Secret values were not printed or copied.
- Therefore `report_assistant_provider_browser_smoke_v1` is blocked/skipped in
  this local checkout. It must not be marked product-verified until rerun in an
  environment with either the research endpoint or the private
  `system_llm_gemini_proxy` binding.
- Provider-unavailable behavior was rechecked locally: the route falls back to
  context-only review with explicit warnings instead of fabricating source
  evidence or calculator values.

Validation run for this readiness check:

- `pnpm --filter @dynecho/web exec vitest run
  features/workbench/report-assistant-runtime-status.test.ts
  features/workbench/report-assistant-plausibility-research.test.ts
  features/workbench/report-assistant-plausibility.test.ts
  features/workbench/report-assistant-current-calculator-review-packet.test.ts`
  passed: 4 files / 41 tests.

## Suggested Next Selected Action

Gate A, Gate B, Gate C, Gate D, Gate E, Gate F, calculator-page source-review
UI wiring, calculator-page confirmed report-only apply handoff, and
source-review intent hardening are locally implemented.
Current selected next action:

```text
report_assistant_provider_browser_smoke_v1
```

Reason:

- The intent layer now keeps source-backed review and ask-before-apply wording
  out of direct mutation paths.
- The current calculator review packet now packages visible/report calculator
  state into a typed envelope.
- The plausibility route can now consume the packet and keep provider output
  advisory.
- The calculator-page assistant now sends current calculator review packets to
  the plausibility route and renders the returned source-review card without
  mutating the stack or calculator values.
- The result card now separates calculator value from advisory source review.
- Source-backed recommendations can now become validated pending report-only
  patches without changing calculator truth in report/proposal flows.
- The calculator-page source-review card can now prepare and apply a
  confirmation-required report-only draft edit for a selected report, using the
  same validator/apply semantics as the report editor.
- The eval and redacted trace helper coverage now protects source review,
  recommendation, confirmation posture, and provider-patch suppression.
- The latest intent hardening now catches more Turkish/mixed source-review
  wording, ask-before-report-override wording, and direct current-calculator
  value override wording before it reaches layer mutation parsing.
- The highest product-value remaining gap is now live provider/browser
  verification: local tests cover the routing and validator behavior, but a
  provider-configured smoke still needs to prove the live source path behaves as
  expected.

Planned order from this checkpoint:

1. `report_assistant_calculator_source_review_confirmed_report_apply_v1`.
   Landed locally on 2026-06-20. The calculator-page source-review card now
   exposes a selected-report, confirmation-required report-only edit path. It
   keeps the first source-review request read-only (`suggestPatch: false`),
   loads the selected report as the target document/context, builds the
   source-backed patch through the shared builder, validates with the shared
   patch validator, and applies through the same confirmed `export_only`
   semantics used by the report editor.

   Landed behavior:

   - No report target: blocked with "Open or create a report first."
   - Metric mismatch or validator rejection: blocked with the rejection reason.
   - Draft/report changes: pending report-edit proposal is cleared.
   - Apply action: explicit browser confirmation is required and calculator
     values/layers/selected outputs remain unchanged.

   Validation run:

   - `pnpm --filter @dynecho/web exec vitest run
     features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
     passed: 1 file / 11 tests.
   - `pnpm --filter @dynecho/web exec vitest run
     features/workbench/report-assistant-plausibility.test.ts
     features/workbench/report-assistant-workbench-confirmed-apply.test.ts
     features/workbench/report-assistant-workbench-apply-proposal.test.ts
     features/workbench/report-assistant-current-calculator-review-packet.test.ts`
     passed: 4 files / 23 tests.
   - `pnpm --filter @dynecho/web exec eslint
     features/workbench-rebuild/calculator-workbench.tsx
     features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
     passed.
   - `pnpm --filter @dynecho/web typecheck` was attempted but blocked by
     unrelated current engine type debt in
     `packages/engine/src/dynamic-airborne.ts`; this assistant slice did not
     touch engine files.

2. `report_assistant_source_review_intent_hardening_v1`.
   Landed locally on 2026-06-20. The calculator-page command router now has a
   typed deterministic fallback with `source_review`,
   `report_override_request`, `clarify`, and `layer_mutation` outcomes. It
   routes mixed Turkish/English source-review wording and ask-before-report
   override wording before stack parsing, blocks direct current-calculator value
   setting such as "Rw 52 yap", and leaves genuine layer arrangement commands on
   the existing stack parser/model path.

   Landed behavior:

   - "db garip geldi netten bak abi daha makul değer varsa bana sor" routes to
     source review.
   - "Daha makul değer varsa bana sor, onaylarsam rapora uygula" routes to the
     source-review/report-override confirmation path, not layer mutation.
   - "Rw 52 yap", "Rw 52 olsun", "Rw 52 olmalı", and "sonucu 52 dB yap" are
     blocked with a clarification that calculator values are computed by the
     calculator.
   - "Rw 52 olmalı mı" routes to source review instead of draft mutation.
   - "gypsium, rock wool, gypsum mantıklı kalınlıklarla diz" remains a layer
     mutation command.
   - The report/editor intent classifier now routes ask-before-report-override
     wording to research/review before patching.
   - The planner eval matrix blocks direct current-calculator value-setting from
     becoming calculator preview/layer mutation.

   Validation run:

   - `pnpm --filter @dynecho/web exec vitest run
     features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts
     features/workbench/report-assistant-intent.test.ts
     features/workbench/report-assistant-planner-evals.test.ts
     features/workbench/report-assistant-planner.test.ts`
     passed: 4 files / 47 tests.
   - `pnpm --filter @dynecho/web exec vitest run
     features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts
     features/workbench-rebuild/workbench-v2-assistant-natural-language-command.test.ts`
     passed: 2 files / 27 tests.
   - Extended focused assistant validation passed:
     `workbench-v2-calculator-assistant-ui.test.ts`,
     `report-assistant-intent.test.ts`,
     `report-assistant-planner-evals.test.ts`,
     `report-assistant-planner.test.ts`,
     `workbench-v2-assistant-layer-stack-command.test.ts`,
     `workbench-v2-assistant-natural-language-command.test.ts`,
     `report-assistant-plausibility.test.ts`,
     `report-assistant-workbench-confirmed-apply.test.ts`,
     `report-assistant-workbench-apply-proposal.test.ts`,
     `report-assistant-current-calculator-review-packet.test.ts`, and
     `report-assistant-golden-evals.test.ts`: 11 files / 101 tests.
   - Touched assistant files passed ESLint and touched assistant/doc files
     passed `git diff --check`.
   - `pnpm --filter @dynecho/web typecheck` was attempted again but remains
     blocked by unrelated current engine type debt in
     `packages/engine/src/dynamic-airborne.ts`; this assistant slice did not
     touch engine files.

3. `report_assistant_provider_browser_smoke_v1`.
   Run or add a provider-gated browser/manual smoke for the current calculator
   source-review flow. If provider credentials are absent, the smoke must skip or
   report provider-unavailable explicitly rather than failing as a calculator
   regression.

   Implementation-ready shape:

   - Use a small existing wall stack with one live output and one explicit
     non-selected output case such as `STC yüksek mi`.
   - Verify the UI shows loading, then a source-review card with calculator
     value, review verdict, comparability/source quality, and source count.
   - Verify the visible layer table, selected outputs, and calculator result stay
     unchanged after the review.
   - In a provider-unavailable environment, record a skipped/unavailable result
     and keep context-only tests as the local hard gate.

   Required tests/checks:

   - existing Vitest source-review suite stays green;
   - provider smoke is documented as run, skipped, or blocked with exact reason;
   - no generated PDFs, provider transcripts, or raw source page bodies are added
     to committed fixtures.

   2026-06-20 local result:

   - blocked/skipped, not product-verified;
   - exact reason: no `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT` and no
     compatible `DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER` /
     `DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT` provider configuration in the
     current shell or `apps/web/.env.local`;
   - local hard gate retained: provider-unavailable/context-only fallback tests
     and provider status redaction tests passed in
     `report-assistant-runtime-status.test.ts`,
     `report-assistant-plausibility-research.test.ts`,
     `report-assistant-plausibility.test.ts`, and
     `report-assistant-current-calculator-review-packet.test.ts`.

4. `report_assistant_trace_event_route_wiring_v1`.
   Wire the already-tested redacted trace helper into route responses or bounded
   storage only if product debugging needs collected events. Do not store prompt,
   report, provider transcript, raw source body, or raw numeric value labels.

   Implementation-ready shape:

   - Prefer route response metadata first; add persistence only if the product
     needs cross-session collection.
   - Event fields should include request id, selected assistant capability,
     route status, result renderer, authority, validation status, confirmation
     status, stale status, source count, source quality, comparability, and
     redaction status.
   - Event fields must not include user prompt text, full report body, provider
     transcript, source page text, raw source labels, or raw dB values.

   Required tests:

   - success, failure, rejected validation, confirmation-required, confirmed,
     stale, and provider-unavailable events use the same redacted helper;
   - string searches prove forbidden raw content is absent from event payloads.

## Stop Conditions

Stop and update this plan before implementation if any gate requires:

- engine/package runtime formula changes;
- source-row import from web research;
- changing calculator output values directly;
- hiding `needs_input`/`unsupported`;
- allowing provider text to generate patch operations directly;
- applying a report override without explicit user confirmation;
- storing full provider/source/report transcripts in observability.

## Validation Commands

Focused docs/planning validation:

```bash
git diff --check -- docs/ui/REPORT_ASSISTANT_NATURAL_LANGUAGE_SOURCE_REVIEW_AND_CONFIRMED_OVERRIDE_PLAN_2026-06-19.md
```

Current Gate A-F plus calculator-page source-review implementation validation:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench/report-assistant-current-calculator-review-packet.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench/report-assistant-editor-workflow.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-result-card.test.ts \
  features/workbench/report-assistant-result-card-model.test.ts \
  features/workbench/report-assistant-patch.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  features/workbench/report-assistant-redacted-trace-events.test.ts \
  features/workbench/report-assistant-planner.test.ts \
  features/workbench/report-assistant-planner-evals.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-natural-language-command.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts

pnpm --dir apps/web exec eslint \
  features/workbench/report-assistant-current-calculator-review-packet.ts \
  features/workbench/report-assistant-current-calculator-review-packet.test.ts \
  features/workbench/report-assistant-intent.ts \
  features/workbench/report-assistant-editor-workflow.ts \
  features/workbench/report-assistant-plausibility-research.ts \
  features/workbench/report-assistant-plausibility.ts \
  features/workbench/report-assistant-plausibility-result.ts \
  features/workbench/report-assistant-result-card.tsx \
  features/workbench/report-assistant-result-card-model.ts \
  features/workbench/report-assistant-golden-evals.ts \
  features/workbench/report-assistant-redacted-trace-events.ts \
  features/workbench/report-assistant-planner.ts \
  features/workbench/report-assistant-planner-evals.ts \
  features/workbench-rebuild/workbench-v2-assistant-natural-language-command.ts \
  app/api/report-assistant/plausibility/route.ts

pnpm --dir apps/web typecheck
```

Additional validation required before calling the remaining source-review work
complete:

- Confirmed report apply gate is locally landed for the calculator page. Keep
  the landed tests in the always-run assistant source-review set:
  `workbench-v2-calculator-assistant-ui.test.ts`,
  `report-assistant-plausibility.test.ts`,
  `report-assistant-workbench-confirmed-apply.test.ts`,
  `report-assistant-workbench-apply-proposal.test.ts`, and
  `report-assistant-current-calculator-review-packet.test.ts`.
- Intent hardening gate:
  `report-assistant-intent.test.ts`,
  `report-assistant-planner-evals.test.ts`,
  `report-assistant-golden-evals.test.ts`, and
  `workbench-v2-calculator-assistant-ui.test.ts` must include varied Turkish,
  misspelled Turkish/English, mixed "internet araştır" wording, direct layer
  mutation wording, direct report override wording, and ambiguous wording that
  should ask a clarification.
- Provider smoke gate:
  a provider-configured browser/manual smoke should cover one current calculator
  stack review with sources and one provider-unavailable path. Both must show
  that calculator output, visible layer stack, and report value remain unchanged
  unless a separate explicit confirmation path is taken.
- Trace route wiring gate:
  redacted trace tests must prove event collection is bounded and does not store
  prompt text, report body, provider transcript, source page body, or raw numeric
  value labels.
