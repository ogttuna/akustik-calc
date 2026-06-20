# Report Assistant High-Accuracy Copilot Implementation Plan - 2026-06-18

## Purpose

This is the implementation-ready plan for turning the report assistant into a
high-accuracy DynEcho calculator copilot.

The goal is not autonomous writing, calculator retuning, or model-authored
acoustic values. The goal is an assistant that primarily operates the existing
calculator UI/state on the user's behalf, while making every calculator action
and every acoustic answer traceable to application-owned truth.

The target behavior:

1. understand user intent;
2. use available Workbench/project/preset state before asking duplicate
   questions;
3. build typed drafts for layer stacks;
4. ask for missing physical inputs instead of guessing;
5. apply explicit, deterministic edits to the visible calculator draft when the
   user asks to arrange, add, remove, move, or update layers;
6. run the existing calculator preview route for ready drafts;
7. render authority, basis, route status, warnings, tasks, and stale state;
8. require explicit confirmation before any report/project/preset/finding
   mutation, while allowing explicit local Workbench stack commands to update
   the unsaved calculator draft through deterministic client guards.

End-state product contract:

- The user can describe wall, floor, ceiling, opening, or alternative layer
  combinations in Turkish, English, or mixed wording.
- The assistant can operate the calculator draft: replace the layer stack, add
  layers, remove layers, reorder layers, set material/thickness/role/output and
  route context fields, and then let the existing calculator compute.
- The assistant first resolves intent and current Workbench/project/preset
  context, then creates a typed draft before any calculator call.
- The assistant asks for missing physical inputs instead of guessing material
  roles, thicknesses, topology, stiffness, load basis, field/lab context, or
  target metric basis.
- Complete owned drafts run through the existing calculator-preview surfaces.
  Numeric acoustic values never originate from model prose.
- Combination generation means producing bounded calculator draft alternatives
  and previewing them through the calculator, not asking the model to score
  acoustic values.
- Internet research is advisory only: it may help inspect whether a calculator
  result seems plausible or find downloadable references, but it cannot replace
  calculator output, source-row truth, or user confirmation for downloads.
- PDF/report/download actions are explicit user-commanded side effects with
  confirmation/stale guards where they touch saved/project/report state.
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
- Gate 4 trace/parity eval refresh that expands planner coverage to mixed
  decimal-comma calculator prompts, Turkish comparison/alternative prompts,
  Turkish prompt-injection wording, apply/reset blocking, calculator host
  allowlist blocking, and described floor/impact `needs_input` route posture;
- Gate 5 schema-first layer-stack draft model with validator coverage for ready
  wall drafts, unknown material phrases, missing thickness/role/output,
  double-leaf side/cavity mapping, and floor/impact physical-input capture;
- Gate 5 described-wall parser adapter that attaches typed `layerStackDraft`
  metadata to calculator previews, validates drafts before snapshot conversion,
  and keeps described floor/impact requests on `needs_input` without numeric
  basis rows;
- Gate 5 result-envelope surface for typed draft missing inputs, so calculator
  preview cards carry draft validation tasks instead of hiding route-required
  questions in raw preview metadata;
- Gate 6 schema-level bounded draft continuation helper with `draftId`,
  context-signature stale guard, unresolved-field-only merges, and deterministic
  validation refresh after every structured answer batch;
- Gate 6 query-route continuation handoff that accepts parsed structured
  draft-answer batches, returns typed `needs_input`/`stale` envelopes, and keeps
  stale or invalid draft continuations away from calculator preview;
- Gate 6 editor-state handoff that stores only bounded layer-stack draft state,
  maps safe clarification messages into structured `draftContinuation` answers,
  and keeps prompt-injection/stale contexts out of calculator preview;
- Gate 6 ready-draft calculator-preview handoff that runs completed typed drafts
  through the existing preview pipeline without reparsing the user's prose;
- Gate 6 framed-wall support-spacing input capture so double-leaf/framed drafts
  do not become schema-ready while calculator preview still needs
  `supportSpacingMm`;
- explicit local Workbench stack apply command in the calculator assistant
  panel: recognized material aliases such as `gypsium/gypsum`, `rock wool`, and
  `gypsum` can update the visible layer rows through the existing undo-backed
  `commitLayerStackChange` path; missing thicknesses remain blank and surface as
  `needs_input` instead of guessed defaults;
- client-safe assistant tool-definition split so the browser result-card path
  can validate capability metadata without importing server-only finding queue
  helpers;
- browser smoke for the proposal assistant thread, including local preflight
  blocks, calculator `needs_input`, and calculator-backed numeric preview cards;
- floor/ceiling/impact described prompts now produce typed floor layer-stack
  drafts, floor-role inference, route-required physical-input tasks, and
  generic ASTM/ISO impact alias `unsupported` boundaries without numeric
  preview;
- calculator-page assistant commands now use one central control primitive for
  replace-stack, add-layer, remove-layer, move-layer, update-layer,
  set-outputs, and preview-only commands against the visible calculator draft;
- calculator-page `kombinasyon yap` commands now produce bounded candidate
  layer-stack drafts from the visible calculator stack without mutating the
  current stack or inventing acoustic values;
- generated calculator-page candidate stacks now carry context/stale metadata,
  can be previewed through the existing calculator-preview route without
  mutating the visible layer table, and can be applied back to the calculator
  draft through the undo-backed layer-stack path;
- generated calculator-page candidate stacks can now be batch-previewed through
  the existing calculator-preview route into bounded comparison rows; ranking is
  shown only when every visible candidate has a live calculator-backed row for
  the first selected metric;
- ready floor/impact layer-stack drafts now run complete owned `Ln,w` requests
  through calculator-backed preview rows, preserve floor parser metadata, carry
  field room-volume context into preview payloads, and keep `L'nT,50`/ASTM
  impact boundaries on `needs_input`/`unsupported` instead of fabricating
  values;
- calculator-page assistant context commands now fill explicit calculator input
  fields such as support spacing, dynamic stiffness, load basis, room volume,
  field/building/lab mode, building basis, `CI`, `CI,50-2500`, and field `K`
  without changing layer rows or inventing acoustic values;
- explicit PDF/export/download requests now route through the planner into a
  confirmation-only action proposal and report-editor confirmation path that
  names the current snapshot signature, selected outputs, and export content
  categories; stale/dirty calculator rows are not labeled as calculator-backed
  export results, and a bare `PDF` mention is not treated as a download command;
- report-assistant Workbench apply proposals now exist as a non-mutating,
  confirmation-required typed contract with source draft guard, target Workbench
  snapshot guard, exact layer diff, selected-output diff, context patch diff,
  and calculator preview summary/basis metadata;
- confirmed Workbench apply now exists for a pending typed proposal on the
  calculator page: it verifies the current Workbench snapshot signature, asks
  for user confirmation, then applies only the unsaved browser draft through the
  undo-backed layer stack path, selected-output state, and context patch state;
- repo-local golden assistant eval matrix now covers complete calculator-owned
  wall stacks, incomplete wall stacks, wall candidate comparison, floor/impact
  missing physical inputs, unsupported metric/basis, action confirmation,
  prompt injection, untrusted saved-report/provider text, stale draft replay,
  invented capabilities, and fabricated calculator values;
- redacted assistant trace-event helper now converts typed result envelopes into
  safe event summaries with request id, capability, result/renderer kind,
  authority, route status, validation status, confirmation/stale status, source
  trace refs, task codes, and redaction status without storing prompt/report/
  provider bodies or numeric value labels;
- project/revision read hardening now verifies that previous revision document
  bodies remain gated behind explicit `read_project_report_revision` permission;
  revision-summary-only requests do not read or leak full saved report/revision
  document bodies;
- current-calculator source-review packet helper now packages the visible
  Workbench calculator preview or report context into a typed review packet
  containing layer summaries, selected output, calculator/report display value,
  value authority, route status, basis, tasks, warnings, missing inputs,
  unsupported outputs, and context/snapshot signatures; blocked
  `needs_input`/`unsupported` outputs cannot produce numeric source
  recommendations;
- plausibility route adapter now accepts current calculator review packets,
  converts them into local plausibility context, reuses the existing source
  research flow, and suppresses provider-supplied report patches so current
  calculator source review stays read-only until the report override proposal
  gate;
- calculator-page source-review UI wiring now connects natural review wording
  such as "Rw fazla mi az mi, internetten arastir" to the plausibility route
  before the layer mutation parser runs. It runs or reuses the current
  calculator preview, sends the typed current-calculator review packet, renders
  the source-review result card, and keeps `suggestPatch: false`;
- if the user asks about an output that is not currently selected, such as
  `STC`, the calculator page adds that output only to a temporary review
  preview snapshot. The visible selected outputs, layer rows, calculator values,
  and report values are not changed by the review request;
- stale source-review requests/results are cleared when the user edits the
  draft, so an old review cannot be mistaken for the current stack;
- research review result cards now separate calculator result, research verdict,
  advisory suggested report value, comparability, source quality, source count,
  and source range in the shared assistant card without adding apply controls;
- source-backed report override proposals now convert validated source
  `valueRecommendation` values into server-built, confirmation-required
  report-only patches through the existing patch validator while suppressing
  provider-supplied patches and leaving calculator truth unchanged;
- calculator-page source-review confirmed report apply now lets a selected saved
  report receive a source-backed, confirmation-required report-only draft
  customization from the source-review card. The first review request remains
  read-only with `suggestPatch: false`; context-only reviews, missing report
  targets, metric mismatches, validator rejections, stale calculator draft
  changes, and selected-report changes do not apply anything;
- source-review golden eval and redacted trace coverage now protects provider
  review authority, no-calculator-basis posture, source-review confirmation
  state, and redaction of dB/source/provider details;
- broad assistant checkpoint suite: 42 test files / 330 tests passed;
- latest calculator-page confirmed report-apply checkpoint: 5 focused assistant
  files / 34 tests passed, touched assistant files passed ESLint, and touched
  assistant/doc whitespace checks passed. Full web typecheck was attempted but
  is currently blocked by unrelated engine type debt in
  `packages/engine/src/dynamic-airborne.ts`.
- source-review intent hardening now adds a typed calculator-page routing
  fallback (`source_review`, `report_override_request`, `clarify`,
  `layer_mutation`), expands Turkish/mixed wording coverage, blocks direct
  current-calculator value setting such as "Rw 52 yap" and "Rw 52 olmalı",
  keeps genuine layer arrangement commands on the existing draft path, and
  extends report/planner intent coverage for ask-before-report-override wording.
  The latest focused assistant validation passed 11 files / 101 tests plus
  touched-file ESLint and `git diff --check`; full web typecheck remains
  blocked by unrelated current engine type debt in
  `packages/engine/src/dynamic-airborne.ts`.

Still missing:

- a report-editor to Workbench pending-apply handoff, only if a future slice can
  share a safe current Workbench snapshot signature in the same browser context;
- optional runtime route/persistence wiring for already-redacted trace events,
  only if a bounded collection sink is needed;
- optional browser/manual smoke with a configured research provider. Local tests
  already cover the route/card wiring with mocked/context-backed responses.
- 2026-06-20 provider-smoke readiness check: current local shell and
  `apps/web/.env.local` do not configure
  `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT` or a compatible
  `system_llm_gemini_proxy` model provider, so the live provider/browser smoke
  remains blocked/skipped rather than product-verified. The provider-unavailable
  fallback and provider-status redaction were rechecked with 4 focused
  provider/source-review files / 41 tests passed.

Current selected next action:

```text
report_assistant_provider_browser_smoke_v1
```

Selected plan:
`docs/ui/REPORT_ASSISTANT_NATURAL_LANGUAGE_SOURCE_REVIEW_AND_CONFIRMED_OVERRIDE_PLAN_2026-06-19.md`.

Current assistant handoff / drift lock:

- Treat this plan as assistant/workbench work only. It must not compete with or
  overwrite active calculator-engine slices owned by other agents.
- The assistant is a calculator operator, not a metric authority. It may build
  layer stacks, fill explicit calculator inputs, set requested outputs, request
  preview/comparison rows, and prepare confirmation-required actions. It must
  not invent `Rw`, `STC`, `Ln,w`, `AIIC`, or companion values in prose.
- Numeric rows may appear only when they come from the existing calculator
  preview path, saved project/report state, or explicitly labeled external
  advisory research. Advisory research is not a calculator result.
- If route-required inputs are absent or the metric/basis route is not owned,
  the correct assistant answer is `needs_input` or `unsupported`, not a
  substituted metric, guessed family value, or confidence label.
- The current landed local surface is the calculator-page unsaved-draft
  operator plus a report-assistant Workbench apply proposal contract:
  deterministic stack commands, selected-output commands, preview, generated
  candidates, per-candidate preview/use, batch comparison rows, and typed
  non-mutating Workbench apply diffs. Confirmed apply of a pending typed
  proposal is landed for the calculator page; report-editor cross-surface handoff
  remains blocked unless a safe same-browser target snapshot channel is added.

Remaining implementation order from this checkpoint:

1. `report_assistant_source_review_intent_v1` - landed 2026-06-19. Routes
   natural Turkish/English questions such as "değer fazla mı az mı, internetten
   araştır, daha makul değer varsa sor" into source-backed plausibility review
   intent instead of draft mutation or direct patch.
2. `report_assistant_current_calculator_review_packet_v1` - landed 2026-06-19.
   Packages the visible calculator preview or report context into a typed review
   packet with selected metric, calculator value authority, route status, basis,
   tasks, warnings, and snapshot/context signatures.
3. `report_assistant_source_backed_plausibility_review_v1` - landed
   2026-06-19. Reuses the existing plausibility research route for current
   calculator review packets, keeps provider output advisory, and suppresses
   provider patches.
4. `report_assistant_source_review_card_v1` - landed 2026-06-19. Renders
   calculator value and source review separately in the shared assistant result
   card, with source quality, comparability, citation count, range, and advisory
   suggested report value when present.
5. `report_assistant_source_backed_report_override_proposal_v1` - landed
   2026-06-19. Converts source-backed recommendations into pending
   confirmation-required report-only patches through the existing validator; it
   does not apply changes or alter calculator live values/engine truth.
6. `report_assistant_source_review_eval_trace_v1` - landed 2026-06-19. Adds
   golden eval and redacted trace coverage for source review, recommendation,
   confirmation posture, and provider-patch suppression.
7. `report_assistant_calculator_source_review_ui_wiring_v1` - landed
   2026-06-19. Routes calculator-page natural source-review prompts before
   mutation parsing, sends the current calculator review packet to the
   plausibility route, renders the source-review card, handles explicit
   non-selected outputs through a temporary review preview, and clears stale
   review state on draft edits.
8. `report_assistant_calculator_source_review_confirmed_report_apply_v1` -
   landed 2026-06-20. The calculator-page source-review card can prepare a
   selected-report, confirmation-required report-only edit when a validated
   advisory report value exists. The first calculator source-review request
   remains read-only with `suggestPatch: false`; the edit path loads the current
   selected report document/context, uses the shared source-backed patch builder,
   validates with the shared patch validator, and applies through confirmed
   `export_only` report draft semantics. It blocks missing reports, metric
   mismatches, validator rejections, stale calculator draft changes, and selected
   report changes. It never alters calculator live values or layer state.
9. `report_assistant_source_review_intent_hardening_v1` - landed 2026-06-20.
   Adds typed calculator-page routing for source review/report override/clarify
   vs layer mutation, catches more Turkish/mixed review wording, blocks direct
   current-calculator value setting, and extends report/planner intent tests.
10. `report_assistant_provider_browser_smoke_v1` - verify the live/provider path
   in a provider-configured browser/manual smoke, with a provider-unavailable
   skip/report path when credentials are absent.
11. `report_assistant_trace_event_route_wiring_v1` - only if runtime collection
   is still needed, wire the tested redacted event helper into route responses
   or a bounded persistence sink without storing prompt/report/provider bodies.

Gate 4 planner hardening is locally green and Gate 5's schema-first draft
validator, parser adapter, result-envelope surface, Gate 6 route handoff, and
Gate 6 editor-state/ready-preview/support-spacing handoff are locally landed.
The local Workbench assistant now also has an explicit deterministic stack-apply
slice for unsaved calculator drafts. Slice 7A's pure wall candidate comparison
contract, Slice 7B's calculator-backed comparison preview helper, and Slice
7C's query-route/result-card wiring are locally landed. Slice 8A's
floor/ceiling/impact draft input-capture work is locally landed. Slice 8B's
first calculator-control command primitive is locally landed for visible draft
edits and preview-only commands. Slice 8C's first candidate-stack generation
step is locally landed for bounded, non-mutating draft alternatives. Slice 8D's
first candidate preview/apply control step is locally landed for one generated
candidate at a time. Slice 8E's calculator-control batch comparison rows are
locally landed for generated candidates. Slice 8F's ready floor/impact preview
is locally landed for complete owned `Ln,w` floor drafts and preserves
calculator missing-input/unsupported boundaries for field/ASTM impact outputs.
Slice 8G's direct calculator context-field command parsing is locally landed
for explicit calculator inputs. Slice 8H's explicit PDF/export/download
boundary is locally landed as confirmation-only action proposals. Slice 9A/9B
apply proposal and confirmed browser apply are locally landed for the
calculator-page pending proposal path. Slice 10A's repo-local golden eval matrix
is locally landed. Slice 10B's redacted trace-event helper is locally landed.
Calculator-page source-review UI wiring, the confirmation-required report-only
apply handoff, and source-review intent hardening are locally landed. The next
bounded action is a provider-configured browser/manual smoke for the live source
review path. Runtime trace-event route wiring remains optional and should run
after the provider smoke gap unless a bounded collection requirement is
explicitly selected.
Do not change engine behavior, formula routes, source rows, or persistent
Workbench/project mutation behavior.

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
- Local unsaved Workbench stack edits are allowed only when the user gives an
  explicit apply/arrange command and every material phrase resolves to one
  catalog entry. The assistant must not invent material ids, thicknesses, roles,
  outputs, or acoustic values.
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

## Current Implementation-Ready Queue - 2026-06-18

This section is the implementation queue to follow from the current checkpoint.
It is intentionally more concrete than the historical gate summaries below. Pick
the first incomplete slice only, write the fail-first tests named in that slice,
then implement only the files listed there.

Current checkpoint:

- `report_assistant_workbench_local_stack_apply_v1` is locally implemented for
  the Workbench V2 calculator page.
- A command such as `gypsium, rock wool, gypsum diz` can update the unsaved
  Workbench layer rows through `commitLayerStackChange`.
- Missing thicknesses stay blank and surface as calculator `needs_input`; the
  assistant does not invent `mm` values.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts --maxWorkers=1`
  with 3 files / 18 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 37 files / 263 tests.
- Validation passed:
  targeted ESLint on the touched assistant/Workbench files, standalone
  TypeScript check for `workbench-v2-assistant-layer-stack-command.ts`, and
  `git diff --check`.
- Full web `tsc --noEmit` is currently blocked by unrelated dirty engine work in
  `packages/engine/src/calculate-assembly.ts` around readonly
  `advancedWall.targetOutputs`; do not fix that in assistant slices unless the
  user changes scope.
- `report_assistant_wall_candidate_comparison_contract_v1` is locally
  implemented as a pure assistant contract: it parses bounded wall alternatives
  into per-candidate `ReportAssistantLayerStackDraft` rows, caps candidates at
  three, preserves unknown material rows as `needs_input`, and blocks ranking
  until calculator-backed outputs exist.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-wall-candidate-comparison.test.ts --maxWorkers=1`
  with 1 file / 5 tests.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-wall-candidate-comparison.test.ts features/workbench/report-assistant-layer-stack-draft.test.ts --maxWorkers=1`
  with 2 files / 12 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 274 tests.
- Validation passed:
  targeted ESLint on
  `features/workbench/report-assistant-wall-candidate-comparison.ts` and
  `features/workbench/report-assistant-wall-candidate-comparison.test.ts`.
- Validation note:
  the contract-only revision passed isolated TypeScript before Slice 7B. After
  Slice 7B imports the existing calculator preview path, TypeScript checks hit
  the unrelated dirty engine file noted below.
- `report_assistant_wall_candidate_comparison_preview_v1` is locally
  implemented as a pure preview helper: it runs ready wall candidates through
  `previewReportAssistantLayerStackDraft`, copies only live calculator-backed
  output rows into comparison rows with authority/basis/source trace, keeps
  incomplete candidates visible as task rows, blocks ranking unless every
  visible candidate has live output for the ranking metric, and returns no raw
  Workbench snapshot/estimate/mutation state.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-wall-candidate-comparison.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench/report-assistant-calculator-preview-result.test.ts --maxWorkers=1`
  with 3 files / 18 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 274 tests.
- Targeted ESLint passed for
  `features/workbench/report-assistant-wall-candidate-comparison.ts` and
  `features/workbench/report-assistant-wall-candidate-comparison.test.ts`.
- Project-level/isolated web TypeScript checks for this helper currently hit
  the unrelated dirty engine type error in
  `packages/engine/src/calculate-assembly.ts` because the helper imports the
  existing calculator preview path. Treat that as non-current-slice debt unless
  the user changes scope.
- `report_assistant_wall_candidate_comparison_query_card_v1` is locally
  implemented: Turkish/English mm-based wall comparison prompts route to the
  comparison preview capability, query responses carry a
  `wall_candidate_comparison_card` result envelope, and the generic result card
  renders comparison basis/task rows without requiring the legacy
  `calculatorPreview` field.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-planner.test.ts features/workbench/report-assistant-result-card.test.ts features/workbench/report-assistant-result-card-model.test.ts features/workbench/report-assistant-capabilities.test.ts --maxWorkers=1`
  with 6 files / 39 tests.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-planner-evals.test.ts --maxWorkers=1`
  with 1 file / 3 tests.
- Targeted ESLint and `git diff --check` passed on touched assistant/doc files.
- Project-level web TypeScript still fails only on the unrelated dirty engine
  `packages/engine/src/calculate-assembly.ts` readonly
  `advancedWall.targetOutputs` issue.

### Slice 7A - Wall Candidate Comparison Contract

Label:

```text
report_assistant_wall_candidate_comparison_contract_v1
```

Status:

- Locally implemented in
  `apps/web/features/workbench/report-assistant-wall-candidate-comparison.ts`
  with contract coverage in
  `apps/web/features/workbench/report-assistant-wall-candidate-comparison.test.ts`.
- The contract does not calculate, rank by invented values, mutate Workbench
  state, or call provider/research routes.

User-facing gap:

- The assistant can preview one described wall stack, but cannot compare two or
  three user-described wall alternatives with typed per-candidate readiness.

Trigger examples:

- `12.5 mm alçıpan + 50 mm taş yünü + 12.5 mm alçıpan ile 2x12.5 mm alçıpan + 75 mm taş yünü + 2x12.5 mm alçıpan karşılaştır`
- `compare these wall options for Rw and STC: ...`
- `bu üç duvar kombinasyonundan hangisi daha iyi`

Files to add:

- `apps/web/features/workbench/report-assistant-wall-candidate-comparison.ts`;
- `apps/web/features/workbench/report-assistant-wall-candidate-comparison.test.ts`.

Files allowed to touch:

- `apps/web/features/workbench/report-assistant-layer-stack-draft.ts` only if a
  reusable draft helper is missing;
- `docs/ui/REPORT_ASSISTANT_HIGH_ACCURACY_COPILOT_IMPLEMENTATION_PLAN_2026-06-18.md`.

Do not touch:

- engine files;
- Workbench state mutation files;
- provider/research routes.

Fail-first tests:

- parses two explicit wall candidates and caps parsed candidates at three;
- preserves each candidate original phrase and candidate label;
- marks a candidate with unknown material as `needs_input` without removing it;
- rejects comparison ranking when no candidate has calculator-backed output;
- rejects floor/impact comparison as `unsupported` for this wall-only slice.

Acceptance:

- exports a typed `ReportAssistantWallCandidateComparison` result model;
- each candidate owns one `ReportAssistantLayerStackDraft`;
- candidate count is capped before preview or rendering;
- failed candidates are explicit task rows, never silently dropped;
- no numeric values exist in this slice.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-wall-candidate-comparison.test.ts \
  features/workbench/report-assistant-layer-stack-draft.test.ts \
  --maxWorkers=1
pnpm --filter @dynecho/web exec eslint \
  features/workbench/report-assistant-wall-candidate-comparison.ts \
  features/workbench/report-assistant-wall-candidate-comparison.test.ts
git diff --check
```

Stop condition:

- If candidate parsing requires model generation to split alternatives, stop and
  add a structured provider-output schema first. Do not parse unbounded prose
  into hidden extra candidates.

### Slice 7B - Calculator-Backed Wall Comparison Preview

Label:

```text
report_assistant_wall_candidate_comparison_preview_v1
```

Status:

- Locally implemented in
  `apps/web/features/workbench/report-assistant-wall-candidate-comparison.ts`
  with coverage in
  `apps/web/features/workbench/report-assistant-wall-candidate-comparison.test.ts`.
- The helper remains preview-only and does not expose raw Workbench snapshot,
  selected-layer, estimate payload, or mutation state.

User-facing gap:

- Candidate comparison must use existing calculator preview for every ready
  candidate and show incomplete candidates as `needs_input`.

Files allowed to touch:

- `apps/web/features/workbench/report-assistant-wall-candidate-comparison.ts`;
- `apps/web/features/workbench/report-assistant-wall-candidate-comparison.test.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts`.

Implementation steps:

1. Add a pure helper that maps a ready candidate draft to
   `previewReportAssistantLayerStackDraft`.
2. Run previews sequentially; no parallel provider/model calls.
3. Build comparison rows from preview output rows only.
4. Keep non-ready candidates as candidate tasks with no numeric row.
5. Rank only by user-requested target output and only when two or more
   candidates have live calculator-backed values for that target.

Fail-first tests:

- ready candidate A and ready candidate B produce calculator-backed `Rw`/`STC`
  rows;
- incomplete candidate remains visible with typed missing thickness/material
  task;
- ranking is absent when requested output is missing for any candidate;
- no mutation flags are set and no Workbench layer state is returned.

Acceptance:

- comparison values have `authority: calculator_backed`;
- every numeric value has metric id, basis, route status, and source trace;
- non-ready candidates cannot inherit another candidate's value;
- no candidate can request unsupported outputs by aliasing metrics.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-wall-candidate-comparison.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench/report-assistant-calculator-preview-result.test.ts \
  --maxWorkers=1
pnpm --filter @dynecho/web exec eslint \
  features/workbench/report-assistant-wall-candidate-comparison.ts \
  features/workbench/report-assistant-wall-candidate-comparison.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.ts
```

### Slice 7C - Query Route And Result Card For Comparison

Label:

```text
report_assistant_wall_candidate_comparison_query_card_v1
```

Status:

- Locally implemented in the query route, planner, capability registry, and
  generic result-card path.
- The result card uses typed envelope basis/tasks/trace, not the legacy
  `calculatorPreview` prop.

Files allowed to touch:

- `apps/web/features/workbench/report-assistant-query.ts`;
- `apps/web/features/workbench/report-assistant-query-route.test.ts`;
- `apps/web/features/workbench/report-assistant-result-contract.ts` only if a
  new renderer kind is required;
- `apps/web/features/workbench/report-assistant-result-card-model.ts`;
- `apps/web/features/workbench/report-assistant-result-card.tsx`;
- `apps/web/features/workbench-rebuild/report-editor-project-context.test.ts`.

Fail-first tests:

- Turkish `karşılaştır` prompt routes to comparison, not single-stack preview;
- query response includes `assistantResults` with comparison renderer kind;
- result card renders ready rows and failed candidate tasks from envelope data;
- legacy `calculatorPreview` field is not required to render comparison.

Acceptance:

- comparison route remains read-only and preview-only;
- result card makes ready/needs-input/unsupported candidates visually distinct;
- no apply/save button appears on the preview-only comparison card.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-query-route.test.ts \
  features/workbench/report-assistant-result-card-model.test.ts \
  features/workbench/report-assistant-result-card.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  --maxWorkers=1
```

### Slice 8A - Floor/Ceiling/Impact Draft Parsing Without Numeric Preview

Label:

```text
report_assistant_floor_impact_draft_input_capture_v1
```

User-facing gap:

- Floor/impact prompts currently park as `needs_input`; the assistant must parse
  layer rows and collect route-required physical inputs without guessing.

Files allowed to touch:

- `apps/web/features/workbench/report-assistant-layer-stack-draft.ts`;
- `apps/web/features/workbench/report-assistant-layer-stack-draft.test.ts`;
- `apps/web/features/workbench/report-assistant-layer-stack-draft-editor-state.ts`;
- `apps/web/features/workbench/report-assistant-layer-stack-draft-editor-state.test.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts`.

Fail-first tests:

- `120 mm concrete floor + 30 mm rockwool için Ln,w hesapla` creates a floor
  draft with parsed layers but `needs_input` for missing dynamic stiffness/load
  basis where required;
- `AIIC`/`IIC` requests ask for ASTM/ISO target metric basis instead of aliasing;
- ceiling-board phrases map to ceiling roles only when the user names ceiling;
- missing room volume/field context remains a typed task for field impact;
- unsupported generic ASTM/ISO aliases return `unsupported`, not numeric rows.

Acceptance:

- floor/ceiling roles are enum-bounded;
- physical inputs are typed continuation answers;
- no floor/impact numeric rows are produced in this slice unless all route
  inputs are explicit and the existing preview path already owns them.

### Slice 8B - Unified Calculator Control Commands

Label:

```text
report_assistant_calculator_control_command_unification_v1
```

User-facing gap:

- The assistant should feel like it controls the calculator draft, not like a
  collection of unrelated report/research/preview routes. If the user says
  `gypsum, rock wool, gypsum diz`, the visible calculator layer rows should
  update. If the user asks for combinations, bounded candidate stacks should be
  generated and previewed through the calculator. If the user asks whether a
  calculator result seems high, internet/research output should be advisory
  only and never replace calculator truth.

Primary files:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts`;
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`;
- route/result-card files only if the command needs to surface from the report
  assistant thread, not for calculator-page local commands.

Implementation steps:

1. Treat `workbench-v2-assistant-layer-stack-command` as the central calculator
   control primitive, not a side helper.
2. Expand the command contract from replace-stack only into bounded operations:
   `replace_stack`, `add_layer`, `remove_layer`, `move_layer`, `update_layer`,
   `set_outputs`, `set_context`, and `preview`.
3. Keep material matching deterministic through the catalog and reject unknown
   or ambiguous materials before mutating visible layer rows.
4. Keep missing thicknesses blank or as typed tasks; never infer default mm
   values from model prose.
5. Preserve undo-backed local Workbench updates for calculator-page commands.
6. Run calculator preview only after the visible draft is complete enough for
   the existing preview route; otherwise show the exact missing inputs.
7. Keep research/download/PDF commands separate from calculator state commands:
   research can advise and cite, download/export must be explicit, and neither
   can invent calculator values.

Fail-first tests for the first command-primitive stage:

- `gypsium, rock wool, gypsum diz` replaces the visible stack with three rows,
  resolves catalog ids, and leaves thicknesses blank with tasks.
- `üste 12.5 mm gypsum ekle`, `rock wool'u ortaya taşı`, and `2. layerı sil`
  update the local stack through one typed command surface and preserve undo.
- `gypsumları 15 mm yap` updates only matching layer thicknesses and does not
  touch unknown materials.
- `Rw ve STC seç` updates selected outputs without changing layer rows.
- `hesapla/preview` calls the existing calculator preview only when current
  inputs are complete; otherwise it returns `needs_input`.

Acceptance for the first command-primitive stage:

- Calculator state changes are centralized through one typed command primitive.
- Assistant-visible calculator edits are real UI state changes, not prose-only
  claims.
- Numeric acoustic values still come only from calculator preview/saved state.
- Engine files, formula routes, source rows, and metric aliases are untouched.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1
```

### Slice 8C - Calculator-Control Candidate Stack Generation

Label:

```text
report_assistant_calculator_control_candidate_generation_v1
```

User-facing gap:

- The user can ask for combinations; the assistant should create bounded
  calculator draft alternatives from the visible stack without mutating the
  current stack or scoring alternatives from prose.

Fail-first tests:

- `kombinasyon yap` produces bounded candidate stacks from the visible
  calculator layers without mutating the current stack.
- generated candidates keep missing thickness tasks visible.
- candidate stack cards list only layer drafts; they do not show acoustic values
  before calculator preview.

Acceptance:

- Candidate stacks reuse current calculator materials and thicknesses.
- Current visible calculator stack is not changed by candidate generation.
- Numeric acoustic values still come only from calculator preview/saved state.
- Engine files, formula routes, source rows, and metric aliases are untouched.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  --maxWorkers=1
```

### Slice 8D - Calculator-Control Candidate Preview

Label:

```text
report_assistant_calculator_control_candidate_preview_v1
```

Status:

- Locally implemented for one generated calculator-page candidate at a time.
- Candidate cards expose `Preview` and `Use` actions. `Preview` sends a
  temporary candidate snapshot to the existing calculator-preview route without
  mutating the visible layer table. `Use` applies the candidate layers back to
  the visible calculator draft through the undo-backed layer-stack path.
- Generated candidates carry a source layer-stack signature so stale candidate
  preview/apply attempts are blocked after the visible calculator layers change.
- This slice does not yet store a multi-candidate comparison table.

User-facing gap:

- Generated candidate stacks are visible. The user needs a safe way to run a
  selected candidate through the calculator or apply it to the current
  calculator draft without letting the assistant invent values.

Fail-first tests:

- generated candidate stacks expose preview/use controls in the calculator UI;
- previewing a candidate uses the existing calculator preview route with a
  temporary candidate snapshot and does not mutate the current visible stack;
- applying a candidate uses the undo-backed layer-stack mutation path;
- stale candidate preview/apply attempts are blocked after the visible layer
  stack changes;
- `bu Rw çok mu yüksek, internetten bak` routes to advisory research and keeps
  the calculator value as calculator authority;
- `pdf indir` remains an explicit export/download action and does not mutate
  calculator state unless the user also gave a calculator command.

Acceptance:

- Candidate values are calculator-backed, not model-ranked.
- Candidate preview/apply is guarded by the source layer-stack signature.
- Candidate apply does not persist project/report state.
- Research can advise plausibility but cannot replace calculator authority.
- Download/export commands are explicit and separated from calculator state
  mutation.
- Engine files, formula routes, source rows, and metric aliases are untouched.

Remaining follow-up:

- Batch preview all generated candidate stacks into comparison rows and block
  ranking until every visible candidate has calculator-backed rows for the
  requested metric.

### Slice 8E - Calculator-Control Candidate Batch Comparison Rows

Label:

```text
report_assistant_calculator_control_candidate_batch_compare_v1
```

Status:

- Locally implemented in the calculator-page assistant panel.
- Generated candidate stacks now expose a `Preview all` action. Ready candidates
  are sent one at a time through the existing calculator-preview route using
  temporary Workbench snapshots; candidate rows with missing stack-command tasks
  stay as `needs_input` rows and are not given inherited values.
- Comparison rows show calculator output rows returned by the preview route,
  candidate-scoped task rows, and per-candidate route status. Ranking is shown
  only when every visible candidate has a live numeric row for the first
  selected metric.

Closed user-facing gap:

- The calculator page can now generate candidates, preview/apply one candidate
  at a time, and run every generated candidate into a bounded
  calculator-backed comparison table.

Acceptance:

- Batch preview runs generated candidates sequentially through the existing
  calculator-preview route.
- Each candidate row shows calculator-backed outputs only when the route returns
  live rows; incomplete candidates stay as task rows.
- Ranking is absent unless every visible candidate has a calculator-backed row
  for the requested metric.
- No model-ranked values, no engine changes, no saved project mutation.

Validation:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1
```

Passed with 2 files / 17 tests.

```bash
pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'
```

Passed with 38 files / 288 tests.

TypeScript note:

- Project-level web TypeScript remains blocked only by the unrelated dirty
  engine file `packages/engine/src/calculate-assembly.ts` readonly
  `advancedWall.targetOutputs` issue.

### Slice 8F - Ready Floor/Impact Calculator Preview

Label:

```text
report_assistant_floor_impact_ready_preview_v1
```

User-facing gap:

- The assistant can already capture floor/impact route inputs in a draft, but a
  complete owned floor/impact draft still needs a deterministic calculator
  preview handoff before it can show numeric rows.

Files allowed to touch:

- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts`;
- `apps/web/features/workbench/report-assistant-layer-stack-draft.ts` and
  `apps/web/features/workbench/report-assistant-layer-stack-draft*.test.ts`
  only if a draft validation/context field bridge is missing.

Files and behavior not allowed:

- no `packages/engine/src/**` changes;
- no source-row import, formula retune, metric alias promotion, or calculator
  route ownership change;
- no saved project/report/preset mutation;
- no natural-language fallback number if calculator preview does not return a
  numeric row.

Implementation steps:

1. Add fail-first tests around `previewReportAssistantLayerStackDraft` for the
   complete owned floor/impact cases before changing runtime code.
2. Convert ready floor/impact drafts into temporary Workbench V2 snapshots using
   the existing draft-to-Workbench mapping path.
3. Carry `dynamicStiffnessMNm3`, `loadBasisKgM2`, impact receiving room volume,
   field/lab context, and target metric basis into the existing calculator
   preview payload.
4. Return `needs_input` if any route-required physical input is missing.
5. Return `unsupported` for physically unowned metric/basis combinations.
6. Mark every numeric result as calculator-backed and preserve the preview
   route/basis metadata already used by wall previews.

Fail-first tests:

- complete owned `Ln,w` floor draft returns calculator-backed rows;
- complete owned `L'nT,50` draft carries field context and room volume;
- missing dynamic stiffness/load basis blocks `AIIC`/`IIC` numeric rows;
- unsupported basis remains unsupported with no substituted metric.
- requesting `Rw`/`STC` alongside impact metrics does not cause a hidden metric
  alias or family substitution.

Stop conditions:

- If a needed physical input is not represented in the draft schema or
  Workbench V2 context, stop and add a schema/context-command plan instead of
  smuggling the value through prose.
- If the calculator preview returns `unsupported`, surface `unsupported` with
  route/basis detail and do not retry through a different metric.
- If a test requires changing `packages/engine/src/**`, stop and split the work;
  this assistant slice is not an engine slice.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-layer-stack-draft.test.ts \
  features/workbench/report-assistant-layer-stack-draft-continuation.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts \
  --maxWorkers=1
```

Then rerun the broad assistant checkpoint suite:

```bash
pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'
```

Do not use project-level web TypeScript failure in the unrelated dirty engine
file `packages/engine/src/calculate-assembly.ts` as a reason to edit engine
code from this slice.

Slice 8F landed checkpoint - 2026-06-19:

- Ready floor impact layer-stack drafts now run through
  `previewReportAssistantLayerStackDraft` into calculator-backed `Ln,w` rows
  when dynamic stiffness and load basis are explicit.
- Floor layer-stack draft previews now retain the floor parser label instead of
  being reported as wall parser output.
- Field impact drafts carry receiving-room volume into the calculator preview
  payload, but `L'nT,50` still stays `needs_input` when the calculator asks for
  route-required `CI`/`CI,50-2500` context. No value is fabricated.
- ASTM `AIIC`/`IIC` requests stay pending until physical inputs are explicit and
  remain `unsupported` when the current calculator route does not own the ASTM
  basis. `Rw`/`STC` companions are not used to fabricate impact rows.
- Report-assistant structured draft continuation now covers a ready floor
  impact draft and returns calculator-backed `Ln,w` through the existing query
  route without mutating Workbench/report state.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-layer-stack-draft.test.ts features/workbench/report-assistant-layer-stack-draft-continuation.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench/report-assistant-query-route.test.ts --maxWorkers=1`
  with 5 files / 51 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 294 tests.
- Targeted ESLint and `git diff --check` passed on the touched assistant/doc
  files.
- Current selected next action:
  `report_assistant_calculator_context_field_commands_v1`.

### Slice 8G - Calculator Context-Field Commands

Label:

```text
report_assistant_calculator_context_field_commands_v1
```

User-facing gap:

- A user should be able to say things like "dynamic stiffness 15 MN/m3",
  "load basis 120 kg/m2", "support spacing 600 mm", "receiving room 50 m3",
  or "field/building mode" and see the calculator inputs update directly.
- The assistant still must not answer with a self-produced acoustic value; it
  only fills explicit calculator inputs and then asks the calculator to preview.

Files allowed to touch:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.ts`;
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts`;
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx` only for
  wiring `contextPatch` through the existing undo/assistant state path;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`.

Command contract:

- Parse only explicit, known context fields into
  `Partial<WorkbenchV2ContextDraft>`.
- Initial field set: `supportSpacingMm`,
  `resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`,
  `impactReceivingRoomVolumeM3`, `receivingRoomVolumeM3`,
  `buildingPredictionOutputBasis`, `airborneMode`, `ciDb`, `ci50_2500Db`,
  `fieldKDb`, and any existing field/lab selector already represented in
  Workbench V2 context.
- Validate positive numeric values for physical inputs before applying a patch;
  allow finite signed `CI`, `CI,50-2500`, and field `K` values because those
  acoustic correction terms can be negative.
- Reject ambiguous commands that mix an unknown field with a number.
- Keep context-only commands separate from layer mutation commands in result
  tasks so the UI can explain exactly what changed.

Fail-first tests:

- Turkish and English commands update `supportSpacingMm`,
  `resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`, and room volume.
- A command that sets dynamic stiffness and then previews an impact stack uses
  the patched context in the preview call.
- Negative, zero, unitless ambiguous, or unknown context fields are rejected.
- Context updates do not mutate layers, selected outputs, saved project state,
  source rows, or engine code.

Acceptance:

- The user can fill route-required inputs from the calculator assistant command
  box and see the visible calculator form reflect those inputs.
- Preview rows still come only from calculator preview after the context patch.
- Stale candidate previews/apply paths include the current context signature so
  old candidate rows cannot silently reuse outdated physical inputs.

Validation:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1
```

Slice 8G landed checkpoint - 2026-06-19:

- Calculator-page assistant commands now parse explicit context-field commands
  without layer mutation: `support spacing 600 mm`, `dynamic stiffness 15`,
  `load basis 200`, `room volume 50`, `building mode`, `apparent basis`, `CI
  -1`, `CI,50-2500 4`, and field `K` style inputs.
- Context-only commands return `commandKind: "set_context"` with a typed
  `contextPatch`; layer rows, selected outputs, saved project state, source
  rows, and engine code are not touched.
- Commands that include preview intent, such as `dynamic stiffness 15 ... ve
  hesapla`, update the calculator context first and send a patched Workbench V2
  snapshot to the existing calculator-preview route, so the preview uses the new
  physical inputs.
- Unknown numeric context commands such as `density 50 gir` are rejected instead
  of guessed, and invalid physical inputs such as negative dynamic stiffness are
  blocked before any patch is applied.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts --maxWorkers=1`
  with 2 files / 23 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 300 tests.
- Targeted ESLint and `git diff --check` passed on the touched assistant/doc
  files.
- Current selected next action:
  `report_assistant_explicit_export_download_boundaries_v1`.

### Slice 8H - Explicit Export/Download Boundaries

Label:

```text
report_assistant_explicit_export_download_boundaries_v1
```

User-facing gap:

- Users may ask the assistant to export, download, or prepare a PDF after a
  calculator-backed preview, but the assistant needs explicit intent and
  snapshot boundaries before any browser-side export action is offered.

Files allowed to touch:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.ts`
  only if export/download intent parsing belongs beside calculator control
  commands;
- `apps/web/features/workbench/report-assistant-action-proposal.ts`;
- `apps/web/features/workbench/report-assistant-action-proposal.test.ts`;
- result-card model/render tests if a new confirmation card is needed.

Rules:

- Export/download is never implied by "calculate", "preview", "PDF", or
  "compare combinations"; it requires explicit command wording such as
  "download", "export", "PDF indir", or "dışa aktar".
- The proposed export must name the current snapshot signature, selected
  outputs, and whether it contains calculator-backed rows, task rows, or
  advisory research text.
- No automatic browser download starts from model text alone. The UI must show a
  confirmation or an explicit export button tied to the current snapshot.
- If calculator rows are stale or missing, the export proposal must say so and
  must not label advisory text as a calculator result.

Fail-first tests:

- "preview this" does not create an export/download proposal.
- "calculate and download PDF" creates a confirmation-required export proposal
  after the current calculator/report snapshot is identified.
- Stale calculator rows block export-as-calculator-result labeling.
- Report-assistant advisory research cannot be exported as a calculator result
  without a calculator-backed snapshot.

Validation:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench/report-assistant-action-proposal.test.ts \
  features/workbench/report-assistant-result-card-model.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  --maxWorkers=1
```

Slice 8H landed checkpoint - 2026-06-19:

- `export_current_report_snapshot_as_pdf` is now a supported action proposal
  only when the instruction explicitly says download/export/indir/dışa aktar
  style wording. Plain preview/calculate/compare wording and bare `PDF` mentions
  do not imply export.
- The proposal is preview-only and confirmation-required. It points at the
  existing `/api/proposal-pdf` route with placeholder `current_report_document`
  payload metadata; no browser download starts from assistant/model text alone.
- The report assistant planner now routes explicit export/download requests to
  `export_current_report_snapshot_as_pdf`, while destructive mixed requests such
  as delete/export remain unsupported before any route can run.
- The action-proposal route now follows the same explicit-command boundary, so
  direct route inference rejects bare `PDF` wording instead of preparing a
  download proposal.
- The report editor now accepts only the explicit PDF export proposal shape,
  shows the export snapshot, selected outputs, and export content categories,
  checks both document and assistant-context stale guards, and then calls the
  existing local PDF exporter only after user confirmation.
- The proposal target records `exportSnapshotSignature`, `selectedOutputs`,
  `exportContentKinds`, calculator-backed row count, task row count, and warning
  count so the UI can show exactly what would be exported before confirmation.
- Dirty/stale calculator rows are excluded from
  `calculator_backed_rows` labeling. Advisory/research export requests remain
  `advisory_research_text` and cannot become calculator results without a
  current calculator-backed snapshot.
- Runtime status now exposes six confirmation-required action proposals,
  including `export_current_report_snapshot_as_pdf`.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-result-card-model.test.ts features/workbench/report-assistant-runtime-status.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts --maxWorkers=1`
  with 4 files / 52 tests.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-planner.test.ts features/workbench/report-assistant-planner-evals.test.ts features/workbench/report-assistant-action-proposal.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1`
  with 4 files / 52 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 310 tests.
- Current selected next action:
  `report_assistant_workbench_apply_proposal_contract_v1`.

### Slice 9A - Report Assistant Apply Proposal Contract

Label:

```text
report_assistant_workbench_apply_proposal_contract_v1
```

User-facing gap:

- The calculator-page assistant can apply local stack commands, but the report
  assistant thread cannot yet produce a confirmation-required Workbench stack
  apply proposal from a ready draft.

Files to add:

- `apps/web/features/workbench/report-assistant-workbench-apply-proposal.ts`;
- `apps/web/features/workbench/report-assistant-workbench-apply-proposal.test.ts`.

Files allowed to touch:

- `apps/web/features/workbench/report-assistant-action-proposal.ts`;
- `apps/web/features/workbench/report-assistant-action-proposal.test.ts`;
- `apps/web/features/workbench/report-assistant-result-contract.ts`;
- `apps/web/features/workbench/report-assistant-result-card-model.ts`.

Contract fields:

- source draft id and context signature;
- target Workbench snapshot signature;
- exact layer diff;
- selected outputs diff;
- context patch diff;
- calculator preview summary and basis;
- `requiresConfirmation: true`;
- stale guard fields.

Acceptance:

- proposal is non-mutating and preview-only;
- exact stack diff is visible without reading natural-language prose;
- stale source/target signatures reject proposal creation;
- no saved project/report/preset mutation is bundled into this action.

Slice 9A landed checkpoint - 2026-06-19:

- `report_assistant_workbench_apply_proposal_contract_v1` is locally landed as a
  pure assistant/workbench contract.
- Added
  `apps/web/features/workbench/report-assistant-workbench-apply-proposal.ts`
  and
  `apps/web/features/workbench/report-assistant-workbench-apply-proposal.test.ts`.
- The proposal action is `apply_layer_stack_draft_to_workbench`, but the result
  is still `mutates: false`, `previewOnly: true`, and
  `requiresConfirmation: true`; it does not execute browser state writes.
- Proposal creation requires the source draft context signature and target
  Workbench snapshot signature to match. Stale source or target signatures fail
  before any proposal is built.
- Ready drafts produce exact proposed Workbench layers, selected outputs, and
  context patch fields, plus visible layer diff, selected-output diff, and
  context diff rows.
- The proposal carries calculator preview summary and basis metadata when
  available, but absent or non-ready previews remain warnings and do not create
  calculator-backed numeric authority.
- The capability registry now includes
  `report_assistant_workbench_apply_proposal` as a route-less, model-hidden,
  non-mutating confirmation-required action-proposal card capability.
- No engine files, formula routes, source rows, saved project/report/preset
  writes, report-editor confirmation behavior, or browser Workbench state
  mutation behavior changed in this slice.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-workbench-apply-proposal.test.ts features/workbench/report-assistant-result-card-model.test.ts features/workbench/report-assistant-capabilities.test.ts --maxWorkers=1`
  with 3 files / 16 tests.
- Current selected next action:
  `report_assistant_workbench_confirmed_apply_v1`.

### Slice 9B - Confirmed Browser Workbench Apply

Label:

```text
report_assistant_workbench_confirmed_apply_v1
```

Files allowed to touch:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`;
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.ts`
  only if a reusable apply helper is needed;
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`;
- report editor only if a same-tab pending apply handoff already exists.

Acceptance:

- confirmation writes only unsaved browser Workbench draft state;
- apply uses `commitLayerStackChange` or an equivalent undo-backed path;
- cancellation leaves layer state unchanged;
- stale apply returns a typed stale/error card;
- no engine, source row, saved report, saved project, or preset write happens.

Stop condition:

- If the report editor and Workbench page cannot share a safe current snapshot
  signature in the same browser context, stop at proposal/export-to-Workbench
  handoff. Do not silently mutate an unseen Workbench page.

Slice 9B landed checkpoint - 2026-06-19:

- `report_assistant_workbench_confirmed_apply_v1` is locally landed for the
  calculator page's pending typed proposal path.
- Added
  `apps/web/features/workbench/report-assistant-workbench-confirmed-apply.ts`
  and
  `apps/web/features/workbench/report-assistant-workbench-confirmed-apply.test.ts`.
- `confirmReportAssistantWorkbenchApplyProposal` rejects malformed proposals,
  stale target Workbench signatures, and user cancellation before any apply
  callback runs.
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx` now has a
  confirmed apply adapter for `ReportAssistantWorkbenchApplyProposal`: it
  recomputes the visible Workbench snapshot signature, asks `window.confirm`,
  then applies only the unsaved browser draft through `commitLayerStackChange`,
  `setSelectedOutputs`, and context patch state.
- The pending proposal card displays the typed layer diff and selected-output
  target. `Dismiss` closes the proposal without changing calculator state.
- This slice does not create a report-editor to Workbench handoff because the
  repo has no safe same-browser current Workbench snapshot channel yet. It
  intentionally does not silently mutate an unseen Workbench page.
- No engine files, formula routes, source rows, saved project/report/preset
  writes, provider/research routes, or report-editor saved state changed.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-workbench-confirmed-apply.test.ts features/workbench/report-assistant-workbench-apply-proposal.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts --maxWorkers=1`
  with 3 files / 15 tests.
- Current selected next action:
  `report_assistant_golden_eval_matrix_v1`.

### Slice 10A - Repo-Local Golden Assistant Evals

Label:

```text
report_assistant_golden_eval_matrix_v1
```

Files to add:

- `apps/web/features/workbench/report-assistant-golden-evals.ts`;
- `apps/web/features/workbench/report-assistant-golden-evals.test.ts`;
- optional fixtures under
  `apps/web/features/workbench/__fixtures__/report-assistant-golden-evals.ts`.

Required eval families:

- complete calculator-owned wall stack;
- incomplete wall stack;
- wall candidate comparison;
- floor/impact missing physical inputs;
- unsupported metric/basis;
- action proposal confirmation;
- prompt injection;
- untrusted saved-report/provider text;
- stale draft replay;
- invented capability/tool name;
- fabricated calculator value prevention.

Acceptance:

- each eval asserts selected capability, route status, authority, source trace,
  basis presence or absence, confirmation posture, and expected lack of numeric
  rows when blocked;
- score must be exactly 1.0 for deterministic local evals before the slice
  closes.

Slice 10A landed checkpoint - 2026-06-19:

- `report_assistant_golden_eval_matrix_v1` is locally landed.
- Added `apps/web/features/workbench/report-assistant-golden-evals.ts` and
  `apps/web/features/workbench/report-assistant-golden-evals.test.ts`.
- The matrix contains 11 deterministic repo-local eval families:
  complete calculator-owned wall stack, incomplete wall stack, wall candidate
  comparison, floor/impact missing physical inputs, unsupported metric/basis,
  action proposal confirmation, prompt injection, untrusted saved-report/provider
  text, stale draft replay, invented capability/tool name, and fabricated
  calculator value prevention.
- Successful numeric cases are accepted only when `authority:
  calculator_backed`, basis rows, and `calculator_preview` source traces are
  present.
- Blocked, `needs_input`, `unsupported`, stale, invented-capability, and
  fabricated-value cases assert `basisCount: 0` and no visible numeric rows.
- The PDF/export action eval asserts confirmation-required proposal posture
  instead of treating download as an automatic side effect.
- No engine files, formula routes, source rows, saved project/report/preset
  writes, provider/research behavior, or browser Workbench state mutation
  behavior changed in this slice.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-golden-evals.test.ts --maxWorkers=1`
  with 1 file / 4 tests.
- Current selected next action:
  `report_assistant_redacted_trace_events_v1`.

### Slice 10B - Redacted Trace/Event Boundary

Label:

```text
report_assistant_redacted_trace_events_v1
```

Files allowed to touch:

- new trace/event helper under `apps/web/features/workbench/`;
- route adapters that already produce result envelopes;
- tests for redaction and event shape.

Event fields:

- request id;
- selected capability;
- result kind and renderer kind;
- authority;
- route status;
- source trace ids, not full source bodies;
- validation status;
- confirmation/rejection/stale status;
- redaction status.

Acceptance:

- no secrets, API keys, full report bodies, or full provider transcripts are
  persisted;
- failure events are emitted through the same typed path as success events;
- trace data is enough to debug wrong tool selection without reading model
  prose.

Slice 10B landed checkpoint - 2026-06-19:

- `report_assistant_redacted_trace_events_v1` is locally landed as a pure,
  tested trace-event boundary.
- Added
  `apps/web/features/workbench/report-assistant-redacted-trace-events.ts` and
  `apps/web/features/workbench/report-assistant-redacted-trace-events.test.ts`.
- `createReportAssistantRedactedTraceEvent` accepts a typed assistant result
  envelope and emits a small event with request id, selected capability,
  result/renderer kind, authority, route status, validation status,
  confirmation status, source-trace refs, task codes, basis metric ids, counts,
  and redaction status.
- The event intentionally does not include user prompt text, report/document
  bodies, provider transcripts, source-trace label/detail text, evidence detail,
  task messages, warning text, confidence prose, or numeric value labels.
- Success, failure, confirmation-required, rejected confirmation, and invalid
  envelope cases use the same event helper path.
- This slice does not add a runtime persistence sink or global route response
  field yet. If needed, the next slice should wire only these already-redacted
  events into route responses or bounded storage.
- No engine files, formula routes, source rows, calculator output behavior,
  saved project/report/preset writes, provider/research behavior, or browser
  Workbench mutation behavior changed.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-redacted-trace-events.test.ts --maxWorkers=1`
  with 1 file / 5 tests.
- Current selected next action:
  `report_assistant_trace_event_route_wiring_v1` only if runtime collection is
  needed; otherwise this is a clean checkpoint.

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
  of a trace/eval pack. It captures 25 production-shaped planner examples and
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
- Trace/parity refresh cases now cover mixed English/Turkish calculator prompts
  with comma decimals, Turkish comparison/alternative wording, unsupported
  apply/reset wording, Turkish prompt-injection wording, and calculator-preview
  host allowlist blocking.
- Planner research detection now treats Turkish `karşılaştır`/`kıyasla` and
  `alternatif` wording as read-only research/alternative intent before
  calculator preview. This keeps multi-candidate prompts out of single-stack
  preview until Gate 7 owns calculator-backed candidate comparison.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-planner-evals.test.ts features/workbench/report-assistant-planner.test.ts features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-action-proposal.test.ts features/workbench/report-assistant-editor-workflow.test.ts --maxWorkers=1`
  with 5 files / 46 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec eslint features/workbench/report-assistant-planner.ts features/workbench/report-assistant-planner.test.ts features/workbench/report-assistant-planner-evals.ts features/workbench/report-assistant-planner-evals.test.ts features/workbench-rebuild/report-editor.tsx features/workbench-rebuild/report-editor-project-context.test.ts`.
- The broader assistant checkpoint suite passed with 32 files / 231 tests.
- `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`
  later became green after the fixture type-refresh checkpoint below.

Gate 4 trace/parity completion checkpoint - 2026-06-18:

- Added a calculator-preview route regression for described floor/impact
  requests. A prompt such as `120 mm concrete floor + 30 mm rockwool için Ln,w
  ve AIIC hesapla` now stays `needs_input`, returns pending `--` rows, exposes
  `unsupported-described-floor-configuration`, and publishes no numeric basis.
- The planner eval guard list now explicitly includes every unsafe/incomplete
  case that must not be scored as calculator-ready: incomplete calculator
  prompts, unsupported side effects, prompt injection, host-disallowed action
  proposals, and host-disallowed calculator preview.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-planner-evals.test.ts features/workbench/report-assistant-planner.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts --maxWorkers=1`
  with 3 files / 18 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`.
- Validation passed:
  `pnpm --filter @dynecho/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts --maxWorkers=1'`
  with 28 files / 205 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1`
  with 4 files / 27 tests.

Gate 4 local status:

- `report_assistant_gate_4_trace_parity_eval_refresh` is locally landed for the
  current deterministic assistant slice.
- Current selected next action:
  `report_assistant_layer_stack_draft_v1`.
- Do not start Gate 5 by changing parser output behavior first. Start with the
  typed draft schema and validators, then adapt the existing described-wall
  parser into that schema after invalid/incomplete drafts are covered.

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

Schema-first implementation checkpoint - 2026-06-18:

- Added `apps/web/features/workbench/report-assistant-layer-stack-draft.ts`
  without integrating it into calculator execution yet.
- The draft model now has enum-bounded `mode`, source, layer role,
  missing-input category, wall topology, floor/impact required physical inputs,
  original phrases, context signature, requested outputs, assumptions, warnings,
  and last-preview metadata.
- `validateReportAssistantLayerStackDraft` returns `ready` only when layers,
  normalized material ids, positive mm thicknesses, roles, target outputs, wall
  topology/mapping, and route-required floor/impact physical inputs are present.
  Otherwise it returns typed missing inputs plus minimal clarification
  questions.
- Added `apps/web/features/workbench/report-assistant-layer-stack-draft.test.ts`
  with coverage for:
  - complete wall stack readiness;
  - original phrase preservation in material clarification;
  - missing thickness, role, and target outputs;
  - double-leaf side/cavity mapping;
  - missing floor/impact dynamic stiffness, load basis, and metric basis;
  - ready floor impact draft after those required inputs are explicit.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-layer-stack-draft.test.ts --maxWorkers=1`
  with 1 file / 6 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`.
- Validation passed:
  `pnpm --filter @dynecho/web exec eslint features/workbench/report-assistant-layer-stack-draft.ts features/workbench/report-assistant-layer-stack-draft.test.ts features/workbench/report-assistant-planner.ts features/workbench/report-assistant-planner-evals.ts features/workbench/report-assistant-planner-evals.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts`.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-layer-stack-draft.test.ts features/workbench/report-assistant-planner-evals.test.ts features/workbench/report-assistant-planner.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts --maxWorkers=1`
  with 4 files / 24 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts --maxWorkers=1'`
  with 29 files / 211 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1`
  with 4 files / 27 tests.

Gate 5 local status:

- `report_assistant_layer_stack_draft_v1` is partially landed as the
  schema/validator slice.

Parser-adapter implementation checkpoint - 2026-06-18:

- `previewDescribedLayerConfiguration` now builds a typed `layerStackDraft`
  from the existing deterministic described-wall parser before creating a
  temporary Workbench V2 snapshot.
- Ready described wall drafts carry `layerStackDraft.validation.ok: true`,
  `lastCalculatorPreview.routeStatus`, context signature, requested outputs,
  original phrases, and parser-inferred roles alongside the existing
  calculator-backed preview rows.
- Parse failures now return `needs_input` with `layerStackDraft.validation`
  metadata instead of only prose/task strings. Unknown material phrases preserve
  the parser source phrase and expose missing material/role codes.
- Described floor/impact requests now attach a floor draft with typed missing
  physical inputs (`dynamic_stiffness`, `load_basis`, `target_metric_basis`)
  while still returning pending `--` rows and no numeric basis.
- Draft-to-snapshot conversion remains gated by `validation.ok`; incomplete
  drafts return `needs_input` before any calculator preview can execute.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench/report-assistant-layer-stack-draft.test.ts --maxWorkers=1`
  with 3 files / 19 tests.

Gate 5 local status:

- `report_assistant_layer_stack_draft_parser_adapter_v1` is locally landed for
  described wall and described floor/impact boundary previews.

Result-envelope surface checkpoint - 2026-06-18:

- `calculatorPreviewToAssistantResult` now merges
  `preview.layerStackDraft.validation.missingInputs` into result-envelope
  tasks, deduplicated by task code.
- Draft missing inputs are surfaced with warning severity on non-ready
  calculator previews and do not create basis rows.
- Described floor/impact route responses now expose both the legacy
  `unsupported-described-floor-configuration` task and typed draft inputs such
  as `assistant_layer_stack_empty`,
  `assistant_floor_impact_dynamic_stiffness_missing`,
  `assistant_floor_impact_load_basis_missing`, and
  `assistant_floor_impact_target_metric_basis_missing`.
- Added `apps/web/features/workbench/report-assistant-calculator-preview-result.test.ts`
  to prove typed draft missing inputs reach the assistant result envelope
  without numeric authority.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-calculator-preview-result.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench/report-assistant-layer-stack-draft.test.ts --maxWorkers=1`
  with 4 files / 20 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`.
- Validation passed:
  `pnpm --filter @dynecho/web exec eslint features/workbench/report-assistant-layer-stack-draft.ts features/workbench/report-assistant-layer-stack-draft.test.ts features/workbench/report-assistant-calculator-preview-result.ts features/workbench/report-assistant-calculator-preview-result.test.ts features/workbench/report-assistant-planner.ts features/workbench/report-assistant-planner-evals.ts features/workbench/report-assistant-planner-evals.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts`.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-calculator-preview-result.test.ts features/workbench/report-assistant-layer-stack-draft.test.ts features/workbench/report-assistant-planner-evals.test.ts features/workbench/report-assistant-planner.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts --maxWorkers=1`
  with 6 files / 33 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts --maxWorkers=1'`
  with 30 files / 212 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1`
  with 4 files / 27 tests.

Gate 5 local status:

- `report_assistant_layer_stack_draft_result_envelope_surface_v1` is locally
  landed for calculator-preview result envelopes.
- Current selected next action:
  `report_assistant_layer_stack_draft_clarification_state_v1`.
- The next implementation must add bounded draft continuation state with
  `draftId` and context signature, then merge user answers into unresolved draft
  fields before calculator preview. It must not add autonomous Workbench apply
  behavior.

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

Bounded continuation helper checkpoint - 2026-06-18:

- Added `apps/web/features/workbench/report-assistant-layer-stack-draft-continuation.ts`
  as a schema-level merge helper. It does not parse free text and does not call
  calculator preview.
- Continuation answers must carry `draftId` and `contextSignature`; mismatched
  draft ids, stale answer signatures, or changed current context signatures are
  rejected before draft mutation.
- Answers are accepted only when they match an unresolved typed missing input.
  Attempts to overwrite already-complete material, thickness, role, target
  output, topology, or floor/impact physical inputs return `invalid_answer`.
- Supported first-pass structured answers cover missing material, thickness,
  role, target outputs, double-leaf topology/mapping, and floor/impact dynamic
  stiffness, load basis, room volume, field/lab context, and metric basis.
- The helper preserves prior assumptions and original phrases, applies answer
  batches immutably, and re-runs `validateReportAssistantLayerStackDraft` after
  every merge.
- Added `apps/web/features/workbench/report-assistant-layer-stack-draft-continuation.test.ts`
  with coverage for full wall recovery, partial answer shrinkage, stale context
  rejection, wrong draft-id rejection, completed-field mutation rejection,
  double-leaf topology merge, and floor/impact physical input batch merge.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-layer-stack-draft-continuation.test.ts features/workbench/report-assistant-layer-stack-draft.test.ts --maxWorkers=1`
  with 2 files / 13 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`.
- Validation passed:
  `pnpm --filter @dynecho/web exec eslint features/workbench/report-assistant-layer-stack-draft.ts features/workbench/report-assistant-layer-stack-draft.test.ts features/workbench/report-assistant-layer-stack-draft-continuation.ts features/workbench/report-assistant-layer-stack-draft-continuation.test.ts features/workbench/report-assistant-calculator-preview-result.ts features/workbench/report-assistant-calculator-preview-result.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts`.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-layer-stack-draft-continuation.test.ts features/workbench/report-assistant-layer-stack-draft.test.ts features/workbench/report-assistant-calculator-preview-result.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts --maxWorkers=1`
  with 5 files / 27 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts --maxWorkers=1'`
  with 31 files / 219 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1`
  with 4 files / 27 tests.

Gate 6 local status:

- `report_assistant_layer_stack_draft_clarification_state_v1` is locally landed
  as the pure helper/validator slice.

Route handoff checkpoint - 2026-06-18:

- The report-assistant query route now accepts an optional structured
  `draftContinuation` payload. The route parses `draft`, `answers`, and
  `currentContextSignature` before invoking query logic.
- Parsed continuation requests run before natural-language mutation-intent
  detection, because they are read-only structured draft merges rather than
  Workbench/report apply operations.
- Successful partial continuations return a `needs_input` query envelope with a
  smaller typed task list and no `calculatorPreview`.
- Stale continuation context returns HTTP 409 with
  `stale_report_assistant_layer_stack_draft`, a typed `stale` assistant result,
  and no calculator preview.
- Invalid continuation payloads are rejected with
  `invalid_report_assistant_layer_stack_draft_continuation` before merge logic
  runs.
- Added query-route coverage for structured material-answer merge and stale
  context rejection.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-layer-stack-draft-continuation.test.ts --maxWorkers=1`
  with 2 files / 17 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`.
- Validation passed:
  `pnpm --filter @dynecho/web exec eslint app/api/report-assistant/query/route.ts features/workbench/report-assistant-query.ts features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-layer-stack-draft-continuation.ts features/workbench/report-assistant-layer-stack-draft-continuation.test.ts`.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-layer-stack-draft-continuation.test.ts features/workbench/report-assistant-query.test.ts features/workbench/report-assistant-request-client.test.ts --maxWorkers=1`
  with 3 files / 29 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts --maxWorkers=1'`
  with 31 files / 221 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1`
  with 4 files / 27 tests.

Gate 6 local status:

- `report_assistant_layer_stack_draft_clarification_route_handoff_v1` is locally
  landed for the query route.
- `report_assistant_layer_stack_draft_editor_state_handoff_v1` is locally landed
  for the report editor.
- Query success payloads can now carry a top-level `layerStackDraft` so a
  continuation response can update the editor-held draft even when it does not
  run calculator preview.
- Added
  `apps/web/features/workbench/report-assistant-layer-stack-draft-editor-state.ts`
  as the client-side bounded state helper. It extracts draft state from query
  payloads and builds `draftContinuation` payloads only when a message can be
  deterministically mapped to unresolved typed inputs.
- The editor helper maps known material aliases, explicit mm thicknesses, layer
  roles, target outputs, wall topology hints, and floor/impact physical inputs.
  Unknown materials or ambiguous free text remain `needs_input`; no material id
  or numeric value is invented.
- `apps/web/features/workbench-rebuild/report-editor.tsx` now stores active
  layer-stack draft state, clears it when the assistant context signature
  changes, sends safe structured continuation answers through the read-only
  query route, shows the remaining typed questions, and does not add Workbench
  apply behavior.
- Prompt-injection preflight still blocks before draft continuation. Side-effect
  wording such as `uygula` can no longer turn a structured draft answer into a
  mutating patch/action route when the answer can be safely represented as
  `draftContinuation`.
- Added
  `apps/web/features/workbench/report-assistant-layer-stack-draft-editor-state.test.ts`
  with coverage for payload extraction, wall layer material/thickness/role/output
  continuation, unknown-material refusal, floor/impact physical inputs, and
  local stale-context rejection.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-layer-stack-draft-editor-state.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1`
  with 3 files / 26 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`.
- Validation passed:
  `pnpm --filter @dynecho/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts --maxWorkers=1'`
  with 32 files / 229 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/report-editor-project-context.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts --maxWorkers=1`
  with 4 files / 28 tests.
- Current selected next action:
  `report_assistant_layer_stack_draft_ready_preview_handoff_v1`.
- The next implementation must let a ready typed draft run through calculator
  preview without reparsing the user's prose and without adding autonomous
  Workbench apply behavior.

Ready-preview checkpoint - 2026-06-18:

- Added `preview_layer_stack_draft` as a preview-only, non-mutating calculator
  assistant tool capability.
- Added `previewReportAssistantLayerStackDraft` to build a temporary Workbench
  V2 snapshot from a validated typed draft, then run the existing calculator
  preview pipeline. It attaches the original draft/validation back onto the
  result card and preserves `lastCalculatorPreview`.
- Query continuations that make a draft ready now run calculator preview
  immediately and return a `preview_layer_stack_draft` `calculatorPreview`
  response. Partial continuations still return only `needs_input`.
- Report editor calculator-preview payload validation now allows both
  `preview_described_layer_configuration` and `preview_layer_stack_draft`.
- Added focused coverage proving a ready single-leaf typed draft produces live
  `Rw`/`STC` rows without reparsing prose and that a query-route continuation
  which completes a draft returns a calculator-backed result envelope.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench/report-assistant-query-route.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1`
  with 3 files / 31 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`.
- Validation passed:
  `pnpm --filter @dynecho/web exec eslint features/workbench/report-assistant-layer-stack-draft.ts features/workbench/report-assistant-layer-stack-draft.test.ts features/workbench/report-assistant-layer-stack-draft-continuation.ts features/workbench/report-assistant-layer-stack-draft-continuation.test.ts features/workbench/report-assistant-layer-stack-draft-editor-state.ts features/workbench/report-assistant-layer-stack-draft-editor-state.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench/report-assistant-query.ts features/workbench/report-assistant-query-route.test.ts features/workbench-rebuild/report-editor.tsx features/workbench-rebuild/report-editor-project-context.test.ts app/api/report-assistant/query/route.ts`.
- Validation passed:
  `pnpm --filter @dynecho/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts --maxWorkers=1'`
  with 32 files / 229 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/report-editor-project-context.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts --maxWorkers=1`
  with 4 files / 28 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec eslint features/workbench-rebuild/workbench-v2-calculator-assistant.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench/report-assistant-query.ts features/workbench/report-assistant-query-route.test.ts features/workbench-rebuild/report-editor.tsx features/workbench-rebuild/report-editor-project-context.test.ts features/workbench/report-assistant-layer-stack-draft-editor-state.ts features/workbench/report-assistant-layer-stack-draft-editor-state.test.ts app/api/report-assistant/query/route.ts`.
- Validation passed:
  `pnpm --filter @dynecho/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts --maxWorkers=1'`
  with 32 files / 227 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/report-editor-project-context.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts --maxWorkers=1`
  with 4 files / 28 tests.
Support-spacing checkpoint - 2026-06-18:

- Added `wall_support_spacing` as a typed draft physical input and
  `supportSpacingMm` on wall topology drafts.
- Double-leaf/framed wall drafts with framed support topology now ask for stud
  or support spacing before they are schema-ready.
- Structured continuation now supports `wall_support_spacing` answers and can
  accept topology plus support spacing in the same bounded answer batch.
- The editor-state helper maps explicit support/stud spacing messages such as
  `stud spacing 600 mm` into typed continuation payloads only when the draft is
  actually missing wall support spacing.
- Ready-draft preview adapter now carries `supportSpacingMm` into Workbench V2
  context instead of silently defaulting framed wall support spacing.
- Validation passed:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/report-assistant-layer-stack-draft.test.ts features/workbench/report-assistant-layer-stack-draft-continuation.test.ts features/workbench/report-assistant-layer-stack-draft-editor-state.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench/report-assistant-query-route.test.ts --maxWorkers=1`
  with 5 files / 40 tests.
- Validation passed:
  `pnpm --filter @dynecho/web exec tsc --noEmit --pretty false --project tsconfig.json`.
- Current selected next action:
  `report_assistant_wall_candidate_comparison_preview_v1`.
- The next implementation must start with Slice 7B from the current
  implementation-ready queue: run ready wall candidates through the existing
  calculator preview path while keeping incomplete candidates as typed task
  rows. Do not wire query cards or apply behavior before the preview contract is
  covered.

Slice 7A checkpoint - 2026-06-18:

- `report_assistant_wall_candidate_comparison_contract_v1` is locally landed as
  a pure assistant contract/model.
- Added
  `apps/web/features/workbench/report-assistant-wall-candidate-comparison.ts`
  and
  `apps/web/features/workbench/report-assistant-wall-candidate-comparison.test.ts`.
- It parses explicit `mm` wall alternatives, caps candidates at three before
  preview/render work, preserves candidate labels/source phrases, keeps unknown
  materials as per-candidate `needs_input` task rows, blocks ranking while no
  calculator-backed output exists, and rejects floor/impact comparison requests
  as unsupported for this wall-only slice.
- It does not calculate acoustic values, retune formulas, mutate Workbench
  state, call provider/research routes, or touch engine files.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-wall-candidate-comparison.test.ts features/workbench/report-assistant-layer-stack-draft.test.ts --maxWorkers=1`
  with 2 files / 12 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 274 tests.
- Validation passed:
  targeted ESLint, isolated TypeScript check for the new comparison files, and
  `git diff --check` on touched assistant/doc files.
- Project-level web `tsc --noEmit` still fails only on the unrelated dirty
  engine file `packages/engine/src/calculate-assembly.ts` readonly
  `advancedWall.targetOutputs` issue; do not fix it from assistant slices.
- Current selected next action:
  `report_assistant_wall_candidate_comparison_preview_v1`.

Slice 7B checkpoint - 2026-06-18:

- `report_assistant_wall_candidate_comparison_preview_v1` is locally landed as
  a pure assistant preview helper.
- Ready single-leaf wall candidates now run through the existing
  `previewReportAssistantLayerStackDraft` path and comparison rows copy only
  live calculator-backed output values.
- Every copied numeric row carries `authority: calculator_backed`, a metric
  basis row with `routeStatus: ready`, and `sourceTrace:
  preview_layer_stack_draft`.
- Candidates that are draft-invalid or route-level `needs_input` stay visible
  with candidate-scoped task rows and no inherited numeric values.
- Ranking is produced only when every visible candidate has a live
  calculator-backed row for the requested ranking metric; otherwise it is
  explicitly blocked.
- The preview result is `previewOnly: true`, `mutates: false`, and intentionally
  omits raw Workbench snapshot/estimate/mutation state.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-wall-candidate-comparison.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench/report-assistant-calculator-preview-result.test.ts --maxWorkers=1`
  with 3 files / 18 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 274 tests.
- Targeted ESLint and `git diff --check` passed on touched assistant/doc files.
- TypeScript project checks remain blocked only by the unrelated dirty engine
  file `packages/engine/src/calculate-assembly.ts` readonly
  `advancedWall.targetOutputs` issue.
- Current selected next action:
  `report_assistant_wall_candidate_comparison_query_card_v1`.

Slice 7C checkpoint - 2026-06-18:

- `report_assistant_wall_candidate_comparison_query_card_v1` is locally landed:
  the query route returns `wall_candidate_comparison_card` envelopes for
  explicit wall candidate comparison prompts, planner routing selects the
  bounded comparison preview capability, and the generic card renders
  comparison values/tasks without `calculatorPreview`.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-query-route.test.ts features/workbench/report-assistant-planner.test.ts features/workbench/report-assistant-result-card.test.ts features/workbench/report-assistant-result-card-model.test.ts features/workbench/report-assistant-capabilities.test.ts --maxWorkers=1`
  with 6 files / 39 tests.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench/report-assistant-planner-evals.test.ts --maxWorkers=1`
  with 1 file / 3 tests.
- Targeted ESLint and `git diff --check` passed on touched assistant/doc files.
- Project-level web TypeScript remains blocked only by the unrelated dirty
  engine file `packages/engine/src/calculate-assembly.ts`.
- Current selected next action:
  `report_assistant_floor_impact_draft_input_capture_v1`.

Slice 8A checkpoint - 2026-06-18:

- `report_assistant_floor_impact_draft_input_capture_v1` is locally landed as
  an assistant/workbench-only input-capture slice.
- Described floor/ceiling/impact prompts now parse explicit `mm` layer phrases
  into typed floor drafts with floor roles such as `base_structure`,
  `resilient_layer`, `floating_screed`, `floor_covering`, and
  `ceiling_board`.
- The parser distinguishes `gypsum board` floor-covering wording from explicit
  `gypsum ceiling board` wording, so ceiling roles are not inferred unless the
  user names a ceiling.
- Impact requests stay non-numeric until route-required physical inputs are
  available. `Ln,w` asks for dynamic stiffness and load basis; ASTM `IIC`/`AIIC`
  also asks for target metric basis; field impact outputs also ask for
  field/lab context and receiving-room volume.
- Generic `ASTM impact` / `ISO impact` wording without an explicit metric is
  returned as `unsupported` rather than being aliased to `AIIC`, `IIC`, or
  `Ln,w`.
- Structured draft continuation now supports field context plus receiving-room
  volume in one bounded answer batch without triggering calculator preview.
- No engine files, formula routes, source rows, persistent Workbench/project
  mutation behavior, provider/research routes, or numeric floor/impact preview
  behavior were changed.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench/report-assistant-layer-stack-draft.test.ts features/workbench/report-assistant-layer-stack-draft-editor-state.test.ts features/workbench/report-assistant-layer-stack-draft-continuation.test.ts --maxWorkers=1`
  with 4 files / 35 tests.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts --maxWorkers=1`
  with 1 file / 5 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 280 tests.
- Targeted ESLint and `git diff --check` passed on touched assistant/doc files.
- Project-level web TypeScript remains blocked only by the unrelated dirty
  engine file `packages/engine/src/calculate-assembly.ts` readonly
  `advancedWall.targetOutputs` issue.
- Current selected next action:
  `report_assistant_calculator_control_command_unification_v1`.

Slice 8B first command-primitive checkpoint - 2026-06-18:

- `report_assistant_calculator_control_command_unification_v1` is locally
  landed for the calculator-page assistant's visible draft command surface.
- The central `workbench-v2-assistant-layer-stack-command` primitive now
  returns a typed `commandKind` for `replace_stack`, `add_layer`,
  `remove_layer`, `move_layer`, `update_layer`, `set_outputs`, and `preview`.
- The calculator panel passes the current visible layers, selected layer id,
  current mode, and selected outputs into that primitive. It then applies real
  undo-backed Workbench state changes, updates selected outputs, or triggers the
  existing preview route for preview-only commands.
- Material matching remains catalog-deterministic; unknown/ambiguous material
  phrases still block before UI mutation. Missing thicknesses stay blank with
  tasks instead of guessed defaults.
- Example covered commands include `gypsium, rock wool, gypsum diz`,
  `üste 15 mm gypsum ekle`, `2. layerı sil`, `rock wool'u ortaya taşı`,
  `gypsumları 15 mm yap`, `Rw ve STC seç`, and `hesapla`.
- No engine files, formula routes, source rows, metric aliases, report routes,
  research routes, or saved project mutation behavior were changed.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts --maxWorkers=1`
  with 2 files / 15 tests.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1`
  with 5 files / 45 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 286 tests.
- Targeted ESLint, tracked `git diff --check`, and no-index whitespace checks
  for the untracked assistant command files passed.
- Project-level web TypeScript remains blocked only by the unrelated dirty
  engine file `packages/engine/src/calculate-assembly.ts` readonly
  `advancedWall.targetOutputs` issue.
- Current selected next action:
  `report_assistant_calculator_control_candidate_generation_v1`.

Slice 8C candidate-stack checkpoint - 2026-06-18:

- `report_assistant_calculator_control_candidate_generation_v1` is locally
  landed for client-safe candidate stack generation from the visible calculator
  draft.
- `kombinasyon yap` now returns `commandKind: "generate_candidates"` and a
  bounded three-candidate list: current order, reversed order, and rotated
  order.
- The current visible calculator stack is not mutated by candidate generation.
  Candidate rows reuse current materials and thicknesses, rebuild roles per
  candidate order, and keep missing-thickness tasks visible.
- The calculator page renders generated candidate stack cards with layer
  sequences and missing-input counts. It does not show acoustic values for
  candidate stacks yet.
- No engine files, formula routes, source rows, metric aliases, report routes,
  research routes, or saved project mutation behavior were changed.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts --maxWorkers=1`
  with 2 files / 17 tests.
- Current selected next action:
  `report_assistant_calculator_control_candidate_preview_v1`.

Slice 8D candidate preview/use checkpoint - 2026-06-18:

- `report_assistant_calculator_control_candidate_preview_v1` is locally landed
  for single-candidate calculator preview/use controls on generated
  calculator-page candidates.
- Candidate stacks now carry a context patch, mode, and source layer-stack
  signature. Preview/apply attempts are blocked as stale if the visible
  calculator layers changed after candidate generation.
- Candidate `Preview` sends a temporary candidate Workbench snapshot through the
  existing calculator-preview route and leaves the visible layer table
  unchanged.
- Candidate `Use` applies the selected candidate back to the visible calculator
  draft through the undo-backed `commitLayerStackChange` path and updates
  calculator context from the candidate patch.
- This slice still does not batch-preview all generated candidates into a
  comparison table and does not rank candidates.
- No engine files, formula routes, source rows, metric aliases, report routes,
  research routes, or saved project mutation behavior were changed.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts --maxWorkers=1`
  with 2 files / 17 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 288 tests.
- Targeted ESLint, tracked `git diff --check`, and no-index whitespace checks
  for the untracked assistant command files passed.
- Project-level web TypeScript remains blocked only by the unrelated dirty
  engine file `packages/engine/src/calculate-assembly.ts` readonly
  `advancedWall.targetOutputs` issue.
- Current selected next action:
  `report_assistant_calculator_control_candidate_batch_compare_v1`.

Slice 8E candidate batch comparison checkpoint - 2026-06-18:

- `report_assistant_calculator_control_candidate_batch_compare_v1` is locally
  landed for generated calculator-page candidates.
- Candidate `Preview all` runs ready generated candidates sequentially through
  the existing calculator-preview route using temporary candidate snapshots.
- Candidates with missing assistant stack-command tasks remain visible as
  `needs_input` comparison rows and receive no inherited numeric values.
- Comparison rows render per-candidate route status, returned calculator output
  rows, candidate task rows, and route task rows. Ranking is shown only when
  every visible candidate has a live numeric row for the first selected metric.
- This slice does not persist project/report state, does not ask the model to
  rank candidates, and does not touch engine files, formula routes, source rows,
  or metric aliases.
- Validation passed:
  `pnpm --dir apps/web exec vitest run features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts --maxWorkers=1`
  with 2 files / 17 tests.
- Validation passed:
  `pnpm --dir apps/web exec sh -lc 'vitest run features/workbench/report-assistant*.test.ts features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts features/workbench-rebuild/workbench-v2-calculator-assistant*.test.ts features/workbench-rebuild/report-editor-project-context.test.ts --maxWorkers=1'`
  with 38 files / 288 tests.
- Targeted ESLint passed for the touched assistant TS/TSX files. CSS lint is
  outside the current `apps/web` ESLint config and reports as ignored.
- Project-level web TypeScript remains blocked only by the unrelated dirty
  engine file `packages/engine/src/calculate-assembly.ts` readonly
  `advancedWall.targetOutputs` issue.
- Current selected next action:
  `report_assistant_explicit_export_download_boundaries_v1`.

Assistant calculator-control checkpoint review - 2026-06-18:

- The implementation now matches the calculator-operator direction: the
  assistant can mutate the unsaved calculator draft only through explicit
  deterministic commands, and calculator-backed values still come from the
  existing preview route rather than model prose.
- Landed local calculator-page commands cover replace stack, add layer, remove
  layer, move layer, update layer thickness by material match, set selected
  outputs, current-stack preview, bounded candidate generation, single-candidate
  preview/use, and batch candidate comparison rows.
- Candidate comparison is bounded and preview-only: generated candidates carry a
  source layer-stack signature, stale preview/apply attempts are blocked, and
  ranking is hidden unless every visible candidate has a live calculator row for
  the first selected metric.
- The plan remains valid. Complete owned `Ln,w` floor/impact preview, direct
  calculator context-field command parsing, and explicit export/download
  boundaries are now covered; the next highest-accuracy gap is the
  report-assistant Workbench apply proposal contract.

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
4. Gate 3 - registry-driven report editor cards. Core path locally landed;
   remaining body polish is non-blocking unless a renderer regression appears.
5. Gate 4 - planner decision contract. Locally landed.
6. Gate 5 - layer stack draft schema. Locally landed for wall and parked
   floor/impact boundaries.
7. Gate 6 - clarification loop. Locally landed through ready-preview and
   support-spacing handoff.
8. Local Workbench stack apply - locally landed for unsaved calculator-page
   stack commands.
9. Slice 7A - wall candidate comparison contract. Locally landed on
   2026-06-18.
10. Slice 7B - calculator-backed wall comparison preview. Locally landed on
    2026-06-18.
11. Slice 7C - query route and result card for comparison. Locally landed on
    2026-06-18.
12. Slice 8A - floor/ceiling/impact draft input capture. Locally landed on
    2026-06-18.
13. Slice 8B - unified calculator control commands. First command primitive
    locally landed on 2026-06-18.
14. Slice 8C - calculator-control candidate stack generation. Locally landed
    on 2026-06-18.
15. Slice 8D - calculator-control single-candidate preview/use. Locally landed
    on 2026-06-18.
16. Slice 8E - calculator-control candidate batch comparison rows. Locally
    landed on 2026-06-18.
17. Slice 8F - ready floor/impact calculator preview. Locally landed on
    2026-06-19.
18. Slice 8G - calculator context-field commands. Locally landed on
    2026-06-19.
19. Slice 8H - explicit export/download boundaries. Locally landed on
    2026-06-19.
20. Slice 9A - report assistant apply proposal contract. Locally landed on
    2026-06-19.
21. Slice 9B - confirmed browser Workbench apply. Locally landed on
    2026-06-19 for pending typed proposals on the calculator page; report-editor
    handoff remains blocked until a safe current Workbench snapshot channel
    exists.
22. Slice 10A - repo-local golden assistant evals. Locally landed on
    2026-06-19.
23. Slice 10B - redacted trace/event boundary. Helper boundary locally landed
    on 2026-06-19; route/persistence wiring remains optional.
24. Calculator-page source-review confirmed report apply. Locally landed on
    2026-06-20 for selected saved reports as a report-only draft customization;
    calculator live values and layer state stay unchanged.
25. Source-review intent hardening. Locally landed on 2026-06-20 for
    calculator-page source-review/report-override/clarify routing and
    report/planner intent coverage; direct current-calculator value setting is
    blocked before mutation paths.

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
- one commit for ready floor/impact preview;
- one commit for calculator context-field commands;
- one commit for explicit export/download boundaries;
- one commit for apply proposal;
- one commit for calculator-page source-review confirmed report apply;
- one commit for source-review intent hardening;
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

Full web typecheck should be run and reported for broad user-visible assistant
gates. For the latest calculator-page source-review checkpoint, full web
typecheck was attempted but blocked by unrelated current engine type debt in
`packages/engine/src/dynamic-airborne.ts`; keep that debt separate from the
assistant gate result instead of hiding the gate status.
