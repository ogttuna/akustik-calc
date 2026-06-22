# Report Assistant Power And Scope Gap Review - 2026-06-22

This note records the gap between the intended high-power assistant behavior and
the current implementation. It intentionally focuses on the assistant/product
surface, not calculator formula ownership. Calculator truth remains owned by the
engine and calculator-preview routes.

## User Goal

The target assistant should support conversations like:

- "Bu Rw degeri mantikli mi, kaynaklardan arastir."
- "Bence 2 dB dusuk olmali; o zaman raporu editle."
- "Bu layer kombinasyonunun Rw degerini begenmedim; birkac layer daha ekle,
  Rw artsin, en mantikli secenegi sec."
- "Sunlari cikar, sunlari ekle, iki tane alternatif dene, en iyisini uygula."

The important product shape is not an unconstrained model that invents acoustic
values. The assistant should plan, research, generate bounded candidates, run
calculator previews, show evidence and tradeoffs, then apply only after explicit
confirmation.

## Authority Boundaries

Keep these boundaries in every assistant expansion:

- Model/provider text may interpret intent, suggest alternatives, or summarize
  source evidence.
- Numeric calculator outputs must come from calculator preview, saved project
  state, exact measured rows, or report context already captured by the app.
- Source research is advisory. It can support a report-only override proposal;
  it cannot become calculator truth, source-row truth, formula calibration, or a
  hidden patch.
- Workbench layer changes must be previewed/proposed first and applied only to
  the visible browser draft after confirmation/stale checks.
- Report value edits must go through the shared report patch validator and
  explicit user confirmation.

## External Best-Practice Check - 2026-06-22

Checked current public guidance before strengthening this plan:

- OpenAI function calling frames tool use as an application-owned loop: the
  model can request a tool, but application code executes the function/tool and
  returns structured output. DynEcho should keep calculator preview, source
  review, patch validation, and Workbench apply in app-owned routes, not hidden
  model autonomy.
  Source: https://developers.openai.com/api/docs/guides/function-calling
- OpenAI Structured Outputs guidance recommends schema-constrained JSON so
  required keys and enums do not drift. DynEcho should keep every new assistant
  capability behind typed request/result schemas instead of parsing free-form
  prose into side effects.
  Source: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI guardrails/human-review guidance separates automatic validation from
  human approval and recommends pausing before edits or other sensitive side
  effects. DynEcho's existing preview -> validate -> confirm pattern is the
  right shape and should be reused for Workbench candidate apply.
  Source: https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
- OpenAI agent evaluation guidance recommends traces, graders, datasets, and
  repeatable eval runs for workflow quality. New assistant slices should start
  with fail-first routing/eval cases for the exact Turkish and English prompts
  the user expects.
  Source: https://developers.openai.com/api/docs/guides/agent-evals
- OWASP LLM01:2025 covers direct and indirect prompt injection, including
  malicious instructions embedded in external content. Source/provider text must
  remain untrusted evidence; it cannot choose tool names, confirmation state,
  calculator values, or patch operations.
  Source: https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- OWASP LLM05:2025 covers improper output handling: model output must be
  validated/sanitized before downstream use. DynEcho's shared patch validator,
  result envelopes, capability registry, and typed Workbench proposal guards are
  not optional ceremony; they are the safety boundary that lets the assistant
  become more powerful.
  Source: https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/

## Current Capability Map

| User capability | Current status | Notes |
| --- | --- | --- |
| Ask whether current Rw/STC/etc. is plausible | Mostly implemented | Workbench source-review routing previews the current calculator value, builds a typed review packet, calls `/api/report-assistant/plausibility`, and renders an advisory research card. |
| Research-backed "maybe report should say X dB" | Mostly implemented | Research provider can return a normalized `valueRecommendation`; server builds its own report-only patch and validates it. Provider patches are ignored. |
| "Edit it then" after source review | Partial | Workbench can prepare/apply a selected-report draft edit, but the flow depends on a selected report target and explicit UI controls. Natural follow-up continuity still needs hardening. |
| Direct "set Rw to 52" | Correctly blocked | Calculator values are not manually overwritten. The assistant offers source review or report-only edit after review. |
| Natural layer commands | Implemented for bounded edits | Replace/add/remove/move/update layers, set outputs, set context, preview, and fill reasonable draft thicknesses are supported through deterministic validation. |
| Generate combinations from visible stack | Implemented but shallow | `kombinasyon yap` creates bounded candidate stacks from current layers, mainly by reordering/permuting existing layers. |
| Preview/rank generated candidates | Implemented for generated candidates | `Preview all` sends candidates through calculator preview one at a time. Ranking is shown only when every candidate has live calculator-backed output for the selected metric. |
| Apply a generated candidate | Implemented for browser draft | Simple generated candidates still use the lightweight visible-draft apply path with stale guard. Objective-generated wall/Rw candidates use the stronger Workbench apply proposal path with confirmation and stale-target guard. Saved project/report state is not mutated. |
| Source-backed layer/material alternative research | Implemented as read-only report/proposal advice | `/api/report-assistant/assembly-alternatives` can ask a research provider for advisory alternatives, but it does not produce typed Workbench candidates or apply controls. |
| "Improve Rw by adding the best layers" | Locally implemented for first wall/Rw slice | Objective Rw wording routes to a deterministic wall/Rw planner, produces bounded candidates, keeps `Rw` first for preview/ranking, and selected objective candidates prepare a confirmation/stale-guarded Workbench apply proposal before any visible draft mutation. |
| Multi-step "remove X, add two Y, try alternatives" | Implemented for bounded dry-run/apply proposal | Bounded multi-step edit plans produce a read-only dry-run, can prepare an `Apply bounded edit plan to draft` proposal, and require confirmation plus stale guards before mutating the visible browser draft. |
| Custom material capture from conversation | Partial/gap | Known catalog aliases work. User-described custom material properties are not yet a complete typed draft/apply flow. |
| Floor/ceiling/opening optimization | Limited | Floor/impact input capture exists for some preview paths, but improvement/optimization flows should start with wall/Rw first. |

## Implementation Anchors

Current relevant files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
  - Workbench assistant UI, current calculator source review, candidate preview,
    candidate ranking, candidate apply.
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.ts`
  - Deterministic calculator draft command parser and candidate-stack
    generation.
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-natural-language-command.ts`
  - Model-assisted normalization into one safe calculator draft command. It is
    explicitly forbidden from calculating dB values or doing research.
- `apps/web/features/workbench/report-assistant-plausibility.ts`
  - Context-only plausibility review and source-backed report override patch
    builder.
- `apps/web/features/workbench/report-assistant-plausibility-research.ts`
  - Research provider integration and source-bounded plausibility contract.
- `apps/web/features/workbench/report-assistant-assembly-alternatives.ts`
  - Source-backed assembly/layer alternative research, currently advisory and
    non-mutating.
- `apps/web/features/workbench/report-assistant-wall-candidate-comparison.ts`
  - Read-only comparison for explicit user-described wall alternatives.
- `apps/web/features/workbench/report-assistant-workbench-apply-proposal.ts`
  - Typed Workbench apply proposal with stale guards.
- `apps/web/features/workbench/report-assistant-patch.ts`
  - Report patch validation and guarded apply.

Related plan docs:

- `docs/ui/REPORT_ASSISTANT_NATURAL_LANGUAGE_SOURCE_REVIEW_AND_CONFIRMED_OVERRIDE_PLAN_2026-06-19.md`
- `docs/ui/REPORT_ASSISTANT_HIGH_ACCURACY_COPILOT_IMPLEMENTATION_PLAN_2026-06-18.md`
- `docs/ui/REPORT_ASSISTANT_LAYER_COMPOSER_AND_CALCULATOR_USE_REVIEW_2026-06-17.md`
- `docs/ui/REPORT_ASSISTANT_SCOPE_EXPANSION_PLAN_2026-06-16.md`

## Implementation Comparison Snapshot - 2026-06-22

This section compares the target behavior in this note with the actual code
shape inspected on 2026-06-22.

| Target behavior | Current implementation evidence | Verdict |
| --- | --- | --- |
| Route "Rw mantikli mi, kaynaklardan arastir" away from layer mutation. | `classifyCalculatorAssistantCommandRouting` detects source-review/report-override wording before `parseWorkbenchV2AssistantLayerStackApplyCommand` runs. Tests cover Turkish prompts such as "db garip geldi netten bak abi daha makul deger varsa bana sor". | Good foundation. Keep expanding golden prompts. |
| Run calculator first, then research current value. | `reviewCurrentCalculatorWithAssistantSource` resolves the requested output, builds a temporary source-review snapshot when needed, runs calculator preview, then builds `ReportAssistantCurrentCalculatorReviewPacket`. | Implemented. Good authority split. |
| Keep first source-review request read-only. | Workbench sends `/api/report-assistant/plausibility` with `currentCalculatorReviewPacket` and `suggestPatch: false`. The route suppresses provider patches for packet-only reviews. | Implemented. Do not weaken. |
| Show source review as advisory evidence. | `AssistantResultCard` renders research-review result envelopes, while `plausibilityReviewToAssistantResult` carries calculator value, reviewed value, source quality, comparability, source count, range, and recommendation evidence. | Implemented. Needs live provider smoke and UX polish. |
| Convert source-backed recommendation into report-only edit after confirmation. | `prepareCalculatorAssistantReportOverrideProposal` loads the selected report, rebuilds report assistant context, calls `buildReportAssistantSourceBackedReportOverridePatch`, then validates through `validateReportAssistantPatch`. `applyPreparedCalculatorAssistantReportOverrideProposal` applies with `confirmed: true` and `scope: "export_only"`. | Partially implemented. Button flow exists; natural follow-up continuity and no-report-target recovery need hardening. |
| Generate bounded alternatives from visible stack. | `generateCandidateStacks` creates current order, reversed order, rotations, swaps, and inner-core reverse variants from visible layers. | Implemented but shallow; it does not design new Rw-improving layers. |
| Preview and rank candidate stacks with calculator outputs. | `previewAllCalculatorAssistantCandidateStacks` sends candidates through calculator preview sequentially; ranking is shown only when every candidate has live output for the selected metric. | Implemented for generated candidates. Good scoring boundary. |
| Apply selected candidate safely. | `applyCalculatorAssistantCandidateStack` keeps the lightweight visible-draft apply path for simple generated candidates. Objective planner candidates now adapt into `ReportAssistantWorkbenchApplyProposal` and apply only through `confirmReportAssistantWorkbenchApplyProposal`, with browser confirmation and stale-target checks. | Implemented for both paths with separate authority: simple candidates remain lightweight; objective candidates use the stronger proposal gate. |
| Research source-backed layer/material alternatives. | `/api/report-assistant/assembly-alternatives` and `createReportAssistantAssemblyAlternativeReview` return advisory `suggestedAlternatives`, source quality, comparability, and sources. | Implemented as read-only advice. Not connected to Workbench candidate generation/apply. |
| Compare explicit user-written wall alternatives. | `createReportAssistantWallCandidateComparison` parses explicit mm-based wall candidates from the instruction and `previewReportAssistantWallCandidateComparison` previews them. | Implemented for user-supplied candidates. Not an autonomous candidate designer. |
| "Improve Rw by adding the best layers." | `classifyCalculatorAssistantCommandRouting` routes objective Rw wording to `objective_candidate_planning`; `planWorkbenchWallRwImprovementCandidates` emits bounded candidate stacks; `ensureCalculatorAssistantRwFirstSelectedOutputs` preserves Rw-scored preview/ranking; objective `Use` prepares a Workbench apply proposal. | First bounded wall/Rw product loop is locally implemented. Remaining work is broader catalog/source-backed planning, better tradeoff UX, and live-provider bridge. |
| Multi-step edit plan. | Bounded edit-plan helpers and UI state render a read-only dry-run, adapt ready plans into the shared Workbench apply proposal, and block stale or unsupported plans before mutation. | First bounded multi-step edit contract is locally implemented. Remaining work is richer operation coverage and broader natural-language plan parsing. |
| Custom/source material capture. | Material aliases and catalog matching exist; full temporary custom material draft capture with required acoustic properties is not complete. | Gap. |

### Key Implementation Finding

The current implementation already has the right safety skeleton:

```text
intent -> typed route/tool -> deterministic/app-owned execution -> typed result
-> preview/validation -> user confirmation -> browser/report-only mutation
```

The missing product power is not "let the model do more directly." The first
typed candidate-planning layer between natural language and calculator
preview/apply surfaces is now locally landed for bounded wall/Rw improvement.
The remaining work is to broaden that layer with richer constraints,
source-backed candidate bridges, and better tradeoff UX without weakening the
same preview/validation/confirmation boundary.

## Main Gaps

### Gap 1 - Source Review Follow-Up UX

The source-review route and report-only patch validator are in place, but the
user-facing follow-up flow is still brittle:

- Workbench needs a selected report target before "apply to report draft" can
  work.
- Natural follow-up such as "tamam rapora uygula" should reliably map to the
  existing validated report override proposal when the previous review is still
  fresh and comparable.
- If no report target exists, the assistant should offer a clear next action:
  create/open report first, not silently fail.
- Provider/live smoke should prove real research responses still normalize into
  the expected contract.

### Gap 2 - Objective-Driven Rw Improvement

Status update: the first bounded wall/Rw improvement path is now locally
implemented. Objective wording leaves the old visible-stack permutation flow,
enters a deterministic wall/Rw planner, produces bounded candidate drafts, uses
calculator preview/ranking, and applies selected objective candidates only
through the confirmed/stale-guarded Workbench apply proposal path.

Remaining pieces:

- Broaden the planner beyond the initial conservative catalog-bound rules.
- Improve tradeoff summaries: layer count, added thickness, added mass if
  available, missing inputs, and unsupported boundaries.
- Add source-backed/cited candidate generation only after provider suggestions
  map cleanly to catalog/material drafts.
- Keep ranking calculator-backed only; never claim improvement from provider or
  model text.

Fail-first prompts that should route to this capability:

- `Rw degerini begenmedim, en fazla iki layer ekle ve en mantikli secenegi dene`
- `Bu duvarin Rw'sini artiracak 3 alternatif olustur, preview et, en iyisini goster`
- `Mevcut stacke bak, ekstra gypsum mi acoustic gypsum mi daha mantikli, calculator ile karsilastir`
- `Rw artsin diye layer ekle ama raporu ya da projeyi kaydetme`

### Gap 3 - Research Alternative To Workbench Candidate Bridge

`assembly-alternatives` can return advisory source-backed suggestions, but those
suggestions are not converted into safe Workbench candidates.

Missing bridge:

- Normalize provider suggestions into catalog material ids or ask clarification.
- Convert suggestions into `ReportAssistantLayerStackDraft` candidates.
- Preserve source citations and comparability as advisory evidence.
- Run candidates through calculator preview before ranking.
- Apply only after explicit confirmation.

### Gap 4 - Multi-Step Edit Planning

Status update: the first bounded multi-step edit-plan path is now locally
implemented for read-only dry-runs and confirmed apply proposals. The assistant
can parse a bounded plan, show ordered steps and diffs, prepare an
`Apply bounded edit plan to draft` proposal, and apply only after confirmation
and stale-target checks.

Remaining gaps:

- "try one version with acoustic gypsum and one with extra rockwool";
- "if Rw improves, apply the best one."
- richer operation coverage beyond the current bounded first slice;
- candidate-branching plans that compare multiple alternative stacks;
- preview-after-step semantics for plan variants, without mixing provider text
  into write behavior.

### Gap 5 - Custom Material And Source-Mapped Material Capture

Known catalog aliases work, but a stronger assistant needs to capture new or
source-mentioned materials safely.

Missing pieces:

- Detect user-described custom materials.
- Capture required properties by behavior:
  density, thickness, flow resistivity, dynamic stiffness, load basis, etc.
- Ask for missing properties instead of guessing.
- Keep custom material drafts temporary until confirmed.
- Map source/provider material names to existing catalog items only when the
  match is explicit enough.

### Gap 6 - Scope Beyond Wall/Rw

Floor/impact and other target outputs have preview/input capture pieces, but
assistant optimization should not jump there first.

Recommended boundary:

- Start with wall + airborne `Rw`.
- Extend to `STC`, `R'w`, `Dn,w`, and `DnT,w` only after the wall/Rw improvement
  loop is stable.
- Add floor/impact optimization later because dynamic stiffness, load basis,
  room volume, field context, and basis rules make the input surface much more
  sensitive.

## Recommended Next Slices

### Slice 0 - Fail-First Assistant Goal Evals

Label:

```text
report_assistant_power_scope_goal_eval_refresh_v1
```

Goal:

Lock the expected routing and boundaries before implementing the missing
planner.

Acceptance:

- Add planner/router eval cases for source review follow-up, objective-driven
  Rw improvement, source-backed layer alternatives, direct calculator override
  blocking, and multi-step edit-plan clarification.
- Prove `Rw 52 yap` remains blocked as direct calculator override.
- Prove `Rw 52 olmali mi, arastir` routes to source review.
- Prove `Rw'yi artirmak icin layer ekle ve alternatifleri calculator ile dene`
  does not become a simple `add_layer` command or prose-only research result.
- Prove `tamam rapora uygula` after a fresh source-backed review targets the
  report override proposal path, or blocks with "report target required."
- No runtime behavior moves in this slice unless the fail-first tests expose an
  obvious route bug.

### Slice A - Source Review Follow-Up Hardening

Label:

```text
report_assistant_source_review_followup_and_report_override_hardening_v1
```

Goal:

Make "Bu Rw mantikli mi arastir" -> "tamam rapora uygula" reliable without
weakening calculator authority.

Acceptance:

- Current calculator review stays read-only.
- Previous same-context source review can be reused only while fresh and
  matching metric/context.
- "Rapora uygula" creates or opens the existing report-target proposal path; it
  does not patch calculator values.
- No report target produces a clear blocked state and next action.
- Source-backed override still requires source quality/comparability/value
  recommendation and shared patch validation.
- Provider-gated smoke covers one live source-review response shape without
  making credentials mandatory for local tests.

### Slice B - Wall/Rw Improvement Candidate Planner

Label:

```text
workbench_wall_rw_improvement_candidate_planner_v1
```

Goal:

Support: "Rw'yi artirmak icin en fazla iki layer ekle, alternatifleri dene,
en mantiklisini sec."

Initial scope:

- mode: wall only;
- metric: `Rw` only;
- direction: increase only;
- candidate cap: 3;
- operations: add layer, replace material with catalog material, increase
  thickness;
- no saved project/report mutation;
- no source-row/calculator calibration.

Candidate examples for first implementation:

- add one gypsum/acoustic gypsum board layer to the weaker side;
- add or thicken porous absorber when current wall has a cavity and route
  inputs are available;
- replace generic gypsum with acoustic gypsum only when catalog mapping is
  explicit;
- add symmetric board layers when the current wall already has double-leaf
  topology.

Acceptance:

- Assistant produces typed candidate drafts, not prose-only advice.
- Every ready candidate is sent through calculator preview.
- Ranking appears only when every candidate has live `Rw`.
- Incomplete candidates show `needs_input` tasks.
- User can apply a selected candidate to the visible Workbench draft after
  confirmation/stale guard.
- The assistant never says an improvement happened until calculator preview
  proves it.

### Slice C - Research Alternatives To Candidate Drafts

Label:

```text
report_assistant_assembly_alternative_to_workbench_candidate_v1
```

Goal:

Use source-backed layer/material alternative research as candidate generation
input, while preserving calculator-backed scoring.

Acceptance:

- Provider suggestions remain advisory evidence.
- Material names must map to catalog ids or ask clarification.
- Suggested alternatives become typed candidate drafts.
- Calculator preview supplies all numeric values.
- Source quality/comparability are displayed beside calculator results.
- Apply path uses the same Workbench stale-guarded browser-draft mutation.

### Slice D - Multi-Step Assistant Edit Plan

Label:

```text
workbench_assistant_bounded_edit_plan_v1
```

Goal:

Support controlled multi-operation commands after the single-command parser is
stable.

Acceptance:

- Plan max step count is bounded.
- Every step is a known operation: add, remove, move, replace, update thickness,
  set output, set context, preview.
- The plan produces a dry-run diff before mutation.
- Preview is separate from apply.
- Apply requires confirmation and stale target guard.

## Suggested Immediate Order

1. Land Slice A if the priority is report/source-review trust.
2. Land Slice B if the priority is the assistant feeling powerful inside the
   calculator Workbench.
3. Then bridge source-backed alternatives into Workbench candidates with Slice C.
4. Only after that add multi-step planning and custom-material capture.

For the user goal described on 2026-06-22, Slice B is the highest leverage
capability gap. It turns existing pieces into the missing product behavior:
objective -> candidates -> calculator preview -> ranking -> confirmed Workbench
draft apply.

### Recommended Execution Order After Comparing Code

The practical path is:

1. `report_assistant_power_scope_goal_eval_refresh_v1`
   - Add fail-first tests/evals for the exact user language.
   - This prevents the existing simple layer parser from swallowing richer
     objective prompts.
2. `workbench_wall_rw_improvement_candidate_planner_v1`
   - Implement deterministic wall/Rw candidate planning without research first.
   - Reuse existing candidate preview/ranking/apply UI instead of building a
     new result surface.
3. `report_assistant_source_review_followup_and_report_override_hardening_v1`
   - Harden "tamam rapora uygula" and report-target recovery.
   - This can happen before or after Slice B if report workflow is the immediate
     priority, but it should not block the Workbench improvement planner.
4. `report_assistant_assembly_alternative_to_workbench_candidate_v1`
   - Bridge provider suggestions into typed candidate drafts only after the
     deterministic planner exists.
5. `workbench_assistant_bounded_edit_plan_v1`
   - Add true multi-step planning after candidate planning and report follow-up
     have stable contracts.

## Actionable Implementation Items

Use this as the implementation queue. Do not start the next item until the
current item has its focused tests and stated stop condition satisfied.

### 1. Freeze Assistant Intent Routing With Fail-First Evals

Slice label:

```text
report_assistant_power_scope_goal_eval_refresh_v1
```

Actions:

- Add or extend route/eval coverage for the exact target prompts:
  - `Rw 52 yap`
  - `Rw 52 olmali mi, arastir`
  - `Rw'yi artirmak icin layer ekle ve alternatifleri calculator ile dene`
  - `tamam rapora uygula`
  - `sunlari cikar, sunlari ekle, iki alternatif dene`
- Prove direct metric overrides stay blocked.
- Prove source-review wording routes to source review, not layer mutation.
- Prove objective optimization wording does not become existing
  `generate_candidates`, `add_layer`, or prose-only research.
- Prove report follow-up either opens the report override proposal path or
  blocks with a clear report-target-required state.

Likely files:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts`
- Existing report assistant route/golden eval tests, or a new focused golden
  eval fixture if no suitable file exists.

Stop condition:

- All fail-first cases are present and failing for missing behavior or passing
  for already-correct blocking.
- No runtime behavior is changed except an obvious routing bug exposed by these
  tests.

### 2. Add A Pure Deterministic Wall/Rw Improvement Planner

Slice label:

```text
workbench_wall_rw_improvement_candidate_planner_v1
```

Actions:

- Add a pure helper under the Workbench rebuild feature area, for example:
  `workbench-v2-assistant-wall-rw-improvement-planner.ts`.
- Input should be the current Workbench draft stack, context, constraints, and
  requested objective: wall, `Rw`, increase, candidate cap up to `3`.
- Output should be `WorkbenchWallRwImprovementPlan`, where
  `candidateStacks` are normal `WorkbenchV2AssistantLayerStackCandidateStack`
  values and optional planner metadata is keyed by `candidateId`.
- Implement only deterministic catalog-bound rules:
  - add one gypsum/acoustic gypsum board layer where sensible;
  - replace generic gypsum with acoustic gypsum only on explicit catalog match;
  - thicken or fill porous absorber only when route-required inputs are present;
  - add symmetric board layers for double-leaf/framed topology when applicable.
- Return `needs_input` tasks or warnings for incomplete candidates instead of
  guessing missing acoustic properties.

Likely files:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts`

Stop condition:

- Planner tests prove candidate cap, source layer signature, no saved-state
  mutation intent, canonical candidate stack output, and conservative rule
  behavior.
- No provider/research call is introduced in this slice.

### 3. Wire Objective Routing Without Changing `generate_candidates`

Actions:

- Add a new command kind only if tests require it, for example
  `improve_metric`.
- Update the command union, command-kind inference, parser result, and message
  handling together.
- Keep current `generate_candidates` semantics as visible-stack permutation and
  reordering only.
- Route Turkish objective prompts to the new planner:
  `Rw'yi artirmak icin en fazla iki layer ekle, alternatifleri dene`.

Likely files:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.ts`
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts`

Stop condition:

- Existing `generate_candidates` tests still pass unchanged.
- Objective optimization tests reach the new planner and do not mutate draft
  state before preview/apply.

### 4. Reuse Candidate Preview And Ranking With An Explicit `Rw` Guard

Actions:

- Store any planner metadata beside existing `calculatorAssistantCandidateStacks`
  by `candidateId`; do not fork candidate card state.
- Reuse the existing one-at-a-time `Preview all` calculator preview loop.
- Ensure `Rw` is included in preview outputs while preserving user-selected
  outputs where possible.
- Hide ranking until every ready candidate has live calculator-backed `Rw`.
- Show `needs_input` rows for incomplete candidates.

Likely files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`

Stop condition:

- UI tests prove candidates render, preview requests run for each ready
  candidate, ranking waits for live `Rw`, and no model/provider dB value is used
  as a calculator result.

### 5. Apply Objective Candidates Through A Strong Workbench Proposal

Actions:

- Convert selected objective-generated candidates into a Workbench apply
  proposal before mutation.
- Add an explicit candidate-to-apply-proposal adapter. The existing strong
  proposal path is `ReportAssistantLayerStackDraft` based; it does not accept a
  raw `WorkbenchV2AssistantLayerStackCandidateStack` directly. The adapter must
  preserve candidate layers, mode, selected outputs, context patch intent,
  source signature, and calculator preview summary before calling or mirroring
  `createReportAssistantWorkbenchApplyProposal`.
- Use confirmation and stale target checks at least as strong as
  `confirmReportAssistantWorkbenchApplyProposal`.
- Mutate only the visible browser draft; do not save the project, report, source
  row, or calculator evidence.
- Keep simple permutation candidates on their current lightweight path unless
  the UI is intentionally unified later.

Likely files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.ts`
- `apps/web/features/workbench/report-assistant-workbench-apply-proposal.ts`
- `apps/web/features/workbench/report-assistant-workbench-confirmed-apply.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`

Stop condition:

- Applying an objective-generated candidate requires confirmation.
- The adapter is covered by focused tests and cannot drop selected outputs,
  context patch fields, or stale signatures.
- Stale candidate apply is blocked after the visible layer stack changes.
- Saved project/report state remains untouched.

### 6. Run Focused Workbench Assistant Validation

Actions:

- Run the focused Vitest set listed in the validation plan.
- Add one browser smoke or Playwright path once UI apply behavior changes:
  objective prompt -> candidates -> preview all -> ranking -> confirmed apply.
- Run `git diff --check`.

Stop condition:

- Focused tests pass.
- Browser-visible flow has been checked after UI mutation work.
- Diff check is clean.

### 7. Harden Source Review Follow-Up And Report Target Recovery

Slice label:

```text
report_assistant_source_review_followup_and_report_override_hardening_v1
```

Actions:

- Track the previous source-review context only while fresh and matching the
  current metric/context.
- Route `tamam rapora uygula` to the existing report override proposal path.
- If no report target exists, return a clear blocked state and next action.
- Keep first source-review request read-only.
- Keep report patching behind source quality/comparability/value recommendation
  and shared patch validation.

Stop condition:

- Source review follow-up works with a selected report target.
- No-report-target path blocks cleanly.
- Calculator values are not patched by source review.

### 8. Bridge Research Alternatives Into Candidate Drafts

Slice label:

```text
report_assistant_assembly_alternative_to_workbench_candidate_v1
```

Actions:

- Keep provider suggestions advisory.
- Map suggested material/layer names to catalog ids only when explicit.
- Ask for clarification or required properties when mapping is ambiguous.
- Adapt mapped suggestions into the same canonical
  `WorkbenchV2AssistantLayerStackCandidateStack` contract.
- Preview and rank with calculator outputs only.

Stop condition:

- Source-backed alternatives can become previewable Workbench candidates.
- Unmapped provider terms do not mutate layers.
- Source quality is displayed beside calculator-backed results, not used as the
  numeric calculator result.

### 9. Add Bounded Multi-Step Edit Plans

Slice label:

```text
workbench_assistant_bounded_edit_plan_v1
```

Actions:

- Add a bounded ordered plan model only after single-objective candidate
  planning and report follow-up are stable.
- Allow only known operations: add, remove, move, replace, update thickness, set
  output, set context, preview.
- Produce a dry-run diff before mutation.
- Keep preview separate from apply.
- Require confirmation and stale guard for apply.

Stop condition:

- Multi-step commands produce a readable dry-run diff.
- Unknown or unsafe operations are rejected.
- No step can call provider/write behavior outside typed proposals.

### 10. Stop Before Broadening Scope

Actions:

- Do not start floor/impact optimization until wall/Rw objective planning is
  stable.
- Do not import source research into calculator evidence.
- Do not change calculator formulas, runtime route selection, metric aliases, or
  source rows as part of these assistant slices.

Stop condition:

- The assistant can complete the first target loop:
  objective -> deterministic candidates -> calculator preview -> ranking
  -> confirmed browser-draft apply.

## Implementation Progress Ledger

### 2026-06-22 Iteration 1 - Intent Guard Start

Touched files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`

What moved:

- Added a safe routing block for objective-driven improvement prompts such as
  `Rw'yi artirmak icin layer ekle ve alternatifleri calculator ile dene`.
- Added a safe routing block for multi-step edit-plan prompts such as
  `rockwool'u cikar, iki gypsum layer ekle, iki alternatif dene`.
- These prompts now return `clarify` instead of falling into the current
  single-command parser or shallow `generate_candidates` permutation flow.

What did not move:

- No calculator formula, runtime route, source row, metric basis, saved project,
  report, or Workbench layer mutation behavior was changed.
- The deterministic wall/Rw improvement planner is still not implemented.
- Standalone source-review follow-up such as `tamam rapora uygula` is still a
  later stateful hardening item because it must reuse a fresh source review and
  selected report target, not start an unrelated mutation.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  --maxWorkers=1
```

Result:

```text
5 test files passed
50 tests passed
```

Next safe item:

- Continue item 1 only if more route/eval gaps are found.
- Otherwise start item 2: a pure deterministic wall/Rw improvement planner that
  emits canonical `WorkbenchV2AssistantLayerStackCandidateStack` candidates
  without research/provider calls or browser draft mutation.

### 2026-06-22 Iteration 2 - Pure Wall/Rw Planner Helper

Touched files:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts`

What moved:

- Added a pure deterministic wall/Rw improvement planner helper.
- The helper emits canonical `WorkbenchV2AssistantLayerStackCandidateStack`
  candidate stacks plus side metadata keyed by `candidateId`.
- Initial candidate rules are catalog-bound and preview-required:
  - replace one generic gypsum board with acoustic gypsum when the catalog
    mapping exists;
  - add one board layer to the side with fewer/equal board layers;
  - add symmetric board layers for double-leaf/framed-looking stacks;
  - increase porous absorber thickness only when cavity depth and support
    spacing context are present.
- The helper records `mutatesSavedState: false`, `previewRequired: true`, source
  layer signatures, warnings, and expected mechanisms.

What did not move:

- The planner is not wired into natural-language routing yet.
- No Workbench UI, preview queue, ranking UI, or apply proposal behavior changed.
- No provider/research call, source-row import, calculator formula, runtime
  route, saved project, or report mutation was introduced.

Validation:

```bash
pnpm --filter @dynecho/web typecheck

pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  --maxWorkers=1
```

Result:

```text
6 test files passed
54 tests passed
```

Next safe item:

- Item 3: wire objective routing without changing existing
  `generate_candidates` semantics. The first wiring pass should call this pure
  helper only after route tests prove the objective prompt should leave the
  current clarify block.

### 2026-06-22 Iteration 3 - Objective Routing To Planner Candidates

Touched files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`

Coordination note:

- `calculator-workbench.tsx` is a shared/dirty file with other active work.
  A short coordination comment was added beside assistant objective-routing
  patterns so another agent editing that routing area knows to update the
  related tests/comment together.

What moved:

- Objective Rw improvement prompts now route to
  `objective_candidate_planning` instead of a temporary `clarify` block.
- The Workbench handler calls the pure
  `planWorkbenchWallRwImprovementCandidates` helper and places returned
  canonical candidates into the existing `calculatorAssistantCandidateStacks`
  state.
- Existing `generate_candidates` behavior remains the shallow visible-stack
  permutation flow; it was not repurposed for optimization.
- The handler ensures `Rw` is selected when needed, but does not apply layers or
  claim any numeric improvement.

What did not move:

- Candidate preview/ranking behavior was not changed.
- Objective candidate apply remains unavailable; no Workbench apply proposal
  adapter was added yet.
- No saved project/report/source-row/calculator formula/runtime route mutation
  was introduced.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  --maxWorkers=1
```

Result:

```text
typecheck passed
6 test files passed
55 tests passed
```

Next safe item:

- Item 4: reuse existing candidate preview/ranking with an explicit `Rw` guard.
  Since objective candidates are now in the same candidate state, the next slice
  should prove preview/ranking remains calculator-backed and cannot rank without
  live `Rw`.

### 2026-06-22 Iteration 4 - Objective Candidate Rw Ranking Guard

Touched files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`

What moved:

- Added `ensureCalculatorAssistantRwFirstSelectedOutputs` so objective Rw
  candidate planning always puts `Rw` first in the selected outputs while
  preserving the user's other selected outputs.
- The existing candidate preview/ranking implementation ranks by the first
  selected output. This guard prevents objective Rw candidates from being ranked
  by `STC`, `DnT,w`, or another already-selected output when `Rw` was present
  but not first.
- Added direct tests for missing-`Rw`, second-position `Rw`, and already-first
  `Rw` selected-output cases.

What did not move:

- Candidate preview request mechanics were not changed.
- Candidate ranking still appears only after calculator preview rows contain a
  live value for the selected metric.
- No objective candidate apply/proposal adapter was added.
- No UI layout or visual styling changed.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

git diff --check
```

Result:

```text
6 test files passed
56 tests passed
typecheck passed
```

Next safe item:

- Item 5: objective candidate apply must not use the current lightweight
  candidate `Use` mutation. Add a candidate-to-Workbench-apply-proposal adapter
  with confirmation/stale guard before enabling objective candidate apply.

### 2026-06-22 Iteration 5 - Objective Candidate Apply Proposal Guard

Touched files:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-candidate-apply-proposal.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-candidate-apply-proposal.test.ts`
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`

Coordination note:

- `calculator-workbench.tsx` remains a shared/dirty file. A short coordination
  comment was added beside objective candidate apply handling so another agent
  editing candidate `Use` behavior knows objective planner candidates must stay
  on the confirmed Workbench proposal path.

What moved:

- Added a candidate-to-Workbench-apply-proposal adapter for objective-generated
  wall/Rw candidates.
- The adapter converts a canonical
  `WorkbenchV2AssistantLayerStackCandidateStack` into a
  `ReportAssistantLayerStackDraft`, preserves candidate layers, mode, selected
  outputs, context patch intent, and calculator preview summary, then calls
  `createReportAssistantWorkbenchApplyProposal`.
- Objective planner candidate `Use` now prepares
  `calculatorAssistantWorkbenchApplyProposal` and leaves the visible Workbench
  draft unchanged until the existing confirmed apply button is used.
- Existing target snapshot signature and confirmed apply stale guard remain in
  the path through `confirmReportAssistantWorkbenchApplyProposal`.
- Simple non-objective candidate stacks still use the existing lightweight
  browser-draft `Use` behavior.

What did not move:

- No saved project, report, source row, calculator evidence, formula, or runtime
  route is mutated.
- No provider/research text can directly apply a candidate.
- No UI layout/style work was done.
- Browser smoke is still pending for the full manual flow.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-candidate-apply-proposal.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

git diff --check
```

Result:

```text
7 test files passed
59 tests passed
typecheck passed
```

Next safe item:

- Item 6: run the remaining validation guardrails for this UI mutation,
  especially `git diff --check` and a browser-visible objective prompt ->
  candidates -> preview all -> ranking -> confirmed apply smoke when practical.

### 2026-06-22 Iteration 6 - Focused Validation And Browser Smoke

Touched files:

- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

What moved:

- Ran the remaining guardrails for the objective candidate proposal slice.
- Verified the browser-visible assistant flow on `http://localhost:3010`:
  - logged in with the repo smoke default `admin/admin`;
  - entered `Rw'yi artirmak icin layer ekle ve alternatifleri calculator ile dene`;
  - confirmed three objective Rw candidates were prepared while the visible
    layer table stayed unchanged;
  - ran `Preview all`;
  - confirmed calculator-backed `needs_input` rows were shown for missing
    wall route inputs and ranking stayed hidden without live `Rw`;
  - clicked candidate `Use`;
  - confirmed a Workbench apply proposal appeared while the visible layer table
    still stayed unchanged;
  - accepted the confirmation dialog and confirmed only the visible unsaved
    Workbench draft changed.

What did not move:

- No saved project/report/source-row/calculator evidence mutation was performed.
- No formula, runtime route, or source import changed.

Validation:

```bash
git diff --check

Playwright CLI smoke:
open http://localhost:3010/workbench-v2
login admin/admin
objective prompt -> candidates -> preview all -> needs_input rows/ranking hidden
Use candidate -> Workbench apply proposal -> confirm dialog -> visible draft apply
```

Result:

```text
git diff --check passed
browser smoke passed
```

Next safe item:

- Item 7: harden source-review follow-up and report target recovery. Start with
  fresh-context tests before any report mutation behavior changes.

### 2026-06-22 Iteration 7 - Source-Review Follow-Up And Report Target Recovery

Touched files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- `calculator-workbench.tsx` is still shared/dirty. This iteration stayed in
  the assistant source-review/report-edit area and did not touch the measured
  wall Rw anchor or preset-library work that another agent has in the same
  file.

What moved:

- Added a focused follow-up detector for commands such as
  `tamam rapora uygula` and `ok report apply`.
- Follow-up commands now route to the existing source-review report-edit
  proposal gate instead of falling into the generic stack-command path.
- Report-edit preparation now writes blocked reasons to the visible assistant
  command message as well as proposal state, so no-source-review and
  no-report-target paths are readable even when the report-edit panel is not
  mounted.
- Ready source reviews now carry the Workbench snapshot signature used for the
  review. Preparing a report edit is blocked if the visible Workbench draft
  changed after that source review.
- Applying a prepared report edit is blocked if the selected report target
  changed after the proposal was prepared.
- Report edits remain report-only, confirmation-gated, and validator-backed.

What did not move:

- No calculator value, layer stack, formula, runtime route, source row, or
  calculator evidence was mutated.
- No provider/research text can directly patch a calculator result.
- No browser layout/style work was done.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-candidate-apply-proposal.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-planner.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

Playwright CLI smoke:
open http://localhost:3010/workbench-v2
login admin/admin
tamam rapora uygula -> no-source-review block
Rw değeri makul mü kaynaklarla araştır -> context-only source review
tamam rapora uygula -> no-report-target block
```

Result:

```text
10 test files passed
114 tests passed
typecheck passed
browser smoke passed for no-source-review and no-report-target follow-up blocks
```

Next safe item:

- Item 8: bridge source/research alternatives into canonical Workbench
  candidate drafts. Start with unmapped-provider-term rejection tests and keep
  provider suggestions advisory until they map to catalog ids and pass the same
  candidate preview/proposal gates.

### 2026-06-22 Iteration 8 - Source Alternative Candidate Adapter Foundation

Touched files:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-source-alternative-candidate.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-source-alternative-candidate.test.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

What moved:

- Added a pure source-alternative-to-Workbench-candidate adapter foundation for
  Item 8.
- The adapter converts explicit advisory layer inputs into canonical
  `WorkbenchV2AssistantLayerStackCandidateStack` values only when material terms
  map exactly to current Workbench catalog `name`/`id` entries and thicknesses
  are explicit positive mm values.
- Successful candidates keep source/provider advice advisory through warnings:
  source quality/comparability may be displayed beside calculator preview
  results, but no provider/source/model dB value is carried as a calculator
  result.
- Wall candidates receive a conservative context patch for side A, cavity, side
  B, cavity depth, and double-leaf/framed topology based on the mapped draft
  layers.
- Unmapped provider terms, ambiguous catalog matches, and invalid thicknesses
  return blocked tasks instead of producing candidate stacks.

What did not move:

- The adapter is not yet wired to `/api/report-assistant/assembly-alternatives`
  or the Workbench candidate UI.
- No provider response can mutate layers.
- No candidate preview/ranking/apply behavior changed in shared
  `calculator-workbench.tsx`.
- No saved project, report, source row, calculator formula, runtime route, or
  calculator evidence was changed.

Validation:

```bash
pnpm --filter @dynecho/web typecheck

pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-source-alternative-candidate.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-candidate-apply-proposal.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-planner.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench/report-assistant-assembly-alternatives.test.ts \
  --maxWorkers=1

git diff --check
```

Result:

```text
typecheck passed
12 test files passed
125 tests passed
git diff --check passed
```

Next safe item:

- Continue Item 8 by adding the route/UI bridge in a small shared-file pass:
  extract mapped source alternatives into this adapter, place the returned
  candidate stacks into existing candidate state, and show source
  quality/comparability as advisory copy beside calculator-backed preview
  results. Keep unmapped terms blocked and run UI-focused tests before any
  browser smoke.

### 2026-06-22 Iteration 9 - Source Alternative Review Candidate Layers Contract

Touched files:

- `apps/web/features/workbench/report-assistant-assembly-alternatives.ts`
- `apps/web/features/workbench/report-assistant-assembly-alternatives.test.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-source-alternative-candidate.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-source-alternative-candidate.test.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

What moved:

- Extended the assembly-alternative review contract with optional
  `suggestedAlternatives[].candidateLayers`.
- The research-provider prompt now says `candidateLayers` may appear only when
  the provider has an explicit previewable stack with `materialName`,
  `thicknessMm`, optional `role`, and optional `sourcePhrase`.
- Provider `candidateLayers` are normalized as typed advisory draft inputs, not
  as calculator truth and not as a patch.
- Added a review-level Workbench adapter helper:
  `createWorkbenchV2AssistantSourceAlternativeCandidatesFromReview`.
- The helper converts only suggestions with explicit `candidateLayers` into
  canonical `WorkbenchV2AssistantLayerStackCandidateStack` values through the
  existing exact catalog-mapping adapter.
- Advisory-only suggestions and unmapped provider material terms return tasks
  and do not create candidate stacks.
- Unmapped or ambiguous material terms now also return clarification prompts so
  the UI can ask the user to choose an existing catalog material or provide a
  custom material with required acoustic properties instead of treating the
  block as terminal.
- Source quality, comparability, affected layers, expected metric direction,
  and tradeoffs are kept as side evidence keyed by `candidateId` for a later UI
  pass.

What did not move:

- The Workbench V2 UI is still not wired to call
  `/api/report-assistant/assembly-alternatives`.
- No `calculator-workbench.tsx` shared-file changes were made in this
  iteration.
- No source/provider dB value is used as a calculator result.
- No candidate preview/ranking/apply behavior changed.
- No saved project, report, source row, calculator formula, runtime route, or
  calculator evidence was changed.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-source-alternative-candidate.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-candidate-apply-proposal.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-planner.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench/report-assistant-assembly-alternatives.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

git diff --check
```

Result:

```text
12 test files passed
126 tests passed
typecheck passed
git diff --check passed
```

Next safe item:

- Add the small Workbench V2 shared-file bridge only after a focused UI test:
  source-alternative review with explicit `candidateLayers` should place mapped
  stacks into existing candidate state, while advisory-only/unmapped
  suggestions should render blocked tasks plus clarification prompts and leave
  layer state unchanged.

### 2026-06-22 Iteration 10 - Workbench Source Alternative UI Bridge

Touched files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- `calculator-workbench.tsx` is a shared/dirty file. This iteration stayed in
  the calculator assistant command/source-alternative bridge area and added a
  coordination comment beside the new bridge. It did not touch calculator
  runtime, measured Rw anchors, route input effectiveness, presets, saved
  project persistence, or report patching logic.

What moved:

- Added source-alternative command routing for prompts such as
  `Bu katman kombinasyonuna alternatif malzeme araştır`.
- Added a Workbench V2 request bridge to
  `/api/report-assistant/assembly-alternatives`, using a temporary report
  context built from the current visible Workbench draft.
- Assembly-alternative results now pass through
  `createWorkbenchV2AssistantSourceAlternativeCandidatesFromReview`.
- Mapped `candidateLayers` are placed into the existing
  `calculatorAssistantCandidateStacks` state, so they reuse the existing
  preview/ranking/apply candidate UI contract.
- Advisory-only or unmapped suggestions surface tasks and clarification prompts
  instead of mutating layers.
- The source-alternative result card and clarification prompts render in the
  assistant panel. Candidate numeric comparison is still calculator-preview
  backed only.

What did not move:

- No source/provider dB value is used as a calculator result.
- No source alternative is applied to the visible Workbench draft during
  research.
- No saved project, report, source row, calculator formula, runtime route, or
  calculator evidence was changed.
- Source alternative candidate `Use` still goes through the existing candidate
  path; preview/ranking remain separate and calculator-backed.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-source-alternative-candidate.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-candidate-apply-proposal.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-planner.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench/report-assistant-assembly-alternatives.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

git diff --check
```

Result:

```text
12 test files passed
127 tests passed
typecheck passed
git diff --check passed
```

Next safe item:

- Start Item 9 with a pure, bounded multi-step edit-plan helper. Keep it as a
  dry-run plan first: known operations only, no provider calls, no layer
  mutation, no apply path, and no calculator/runtime changes.

### 2026-06-22 Iteration 11 - Source Alternative Browser Smoke

Touched files:

- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- This iteration only records browser validation from the Workbench assistant
  source-alternative bridge. No implementation file was changed in this note.

What moved:

- Ran a browser-visible smoke on `/workbench-v2` for:
  `Bu katman kombinasyonuna alternatif malzeme araştır`.
- Confirmed the assistant command posted to
  `/api/report-assistant/assembly-alternatives` and received `200 OK`.
- Confirmed the UI rendered `Source alternative review ready` with the
  source-alternative candidate bridge present.
- With no research provider configured, the review stayed context-only:
  `0 source candidates`, a guardrail warning, and no previewable candidate
  stack.
- Confirmed no Workbench apply proposal opened and no visible layer mutation
  happened during source-alternative research.

What did not move:

- No source/provider dB value was used as a calculator result.
- No source alternative was applied to the visible Workbench draft.
- No saved project, report, source row, calculator formula, runtime route, or
  calculator evidence changed.

Validation:

```bash
pnpm --filter @dynecho/web dev -- --port 3010
bash /home/ogttuna/.codex/skills/playwright/scripts/playwright_cli.sh open http://localhost:3010/workbench-v2
bash /home/ogttuna/.codex/skills/playwright/scripts/playwright_cli.sh eval "..."
git diff --check
```

Result:

```text
assembly-alternatives API returned 200 OK
source-alternative review card rendered
candidate bridge rendered with 0 source candidates
apply proposal count stayed 0
git diff --check passed
```

Next safe item:

- Wire the bounded edit-plan helper into the assistant UI as a read-only dry-run
  summary. Keep apply disabled/absent in that slice; the UI should show the
  ordered plan, blocked candidate/provider steps, and "no Workbench layer
  changed yet" messaging.

### 2026-06-22 Iteration 12 - Bounded Multi-Step Dry-Run Helper

Touched files:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- This iteration intentionally did not touch `calculator-workbench.tsx`.
  The shared assistant UI remains on the existing multi-step clarification
  path until the dry-run summary has a focused UI test.
- The helper reuses the existing single-command layer parser on temporary local
  state only. It does not change parser semantics, calculator runtime, source
  rows, saved project/report persistence, or provider/research behavior.

What moved:

- Added `createWorkbenchV2AssistantBoundedEditPlan` as a pure helper for
  ordered multi-step assistant edits.
- The helper can parse known ordered operations into a dry-run plan:
  remove layer, add layer, set outputs, set context, update/move/replace stack,
  and preview.
- The helper returns explicit guardrail flags:
  `mutatesSavedState: false`, `providerCallsAllowed: false`, and
  `applyRequiresConfirmation: true`.
- It exposes per-step before/after layer signatures, layer deltas,
  selected-output changes, tasks, warnings, and a final layer signature.
- It handles repeated add wording such as `iki gypsum layer ekle` by applying
  repeated add operations on temporary state only.
- It blocks provider/web/source-research language before parsing write-like
  steps.
- It blocks `generate_candidates` inside a multi-step plan and returns the
  partial dry-run steps instead of silently generating alternatives or applying
  anything.

What did not move:

- No UI rendering was added yet for the dry-run plan.
- No multi-step plan can apply to the visible Workbench draft yet.
- No candidate generation happens inside bounded edit plans.
- No provider call, source lookup, saved project/report write, calculator
  formula, runtime route, source row, or calculator evidence changed.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

git diff --check
```

Result:

```text
3 test files passed
45 tests passed
typecheck passed
git diff --check passed
```

Next safe item:

- Add a bounded edit-plan proposal/apply design card before implementation.
  The next implementation slice must still be fail-first: dry-run plan ->
  explicit confirmation proposal -> stale guard -> visible browser-draft apply
  only. Do not connect provider/source research or candidate generation inside
  bounded plans.

### 2026-06-22 Iteration 13 - Bounded Multi-Step Read-Only UI Panel

Touched files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- `calculator-workbench.tsx` is shared/dirty. This iteration stayed in the
  assistant command-routing, bounded-edit-plan state, and assistant panel render
  area. A coordination comment was added beside the bounded edit-plan branch.
- No calculator runtime, source rows, measured Rw anchors, project/report
  persistence, material editor, route-input effectiveness, or preset logic was
  changed.

What moved:

- Multi-step prompts such as
  `rockwool'u cikar, iki gypsum layer ekle, iki alternatif dene` now route to
  `bounded_edit_plan` instead of the prose-only `clarify` block.
- The assistant handler calls `createWorkbenchV2AssistantBoundedEditPlan` and
  stores a read-only result state.
- The assistant panel renders a `bounded-edit-plan-dry-run` section with the
  ordered dry-run steps, before/after layer counts, selected-output changes,
  tasks, warnings, and clear "No Workbench layer changed yet" messaging.
- Blocked plans render partial dry-run steps and the blocking reason. Candidate
  generation inside a bounded edit plan remains blocked.
- The dry-run state is cleared when the visible Workbench draft changes, so a
  stale plan cannot remain attached to a new stack.

What did not move:

- No bounded edit plan can apply yet.
- No apply button, confirmation function, or mutation path was added for
  bounded edit plans.
- No provider call, source lookup, source alternative candidate generation,
  saved project/report write, calculator formula, runtime route, source row, or
  calculator evidence changed.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-source-alternative-candidate.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-candidate-apply-proposal.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  features/workbench/report-assistant-golden-evals.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-planner.test.ts \
  features/workbench/report-assistant-intent.test.ts \
  features/workbench/report-assistant-assembly-alternatives.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

git diff --check
```

Browser smoke:

```text
/workbench-v2 login succeeded
"2. layerı sil, 15 mm gypsum ekle, Rw ve STC seç, hesapla"
  -> read-only dry-run panel rendered with 4 steps
  -> "No Workbench layer changed yet" rendered
  -> no "Apply to draft" panel rendered
  -> visible stack stayed 3 layers

"rockwool'u çıkar, iki gypsum layer ekle, iki alternatif dene"
  -> blocked dry-run panel rendered with partial steps
  -> candidate generation blocked inside bounded plan
  -> no "Apply to draft" panel rendered
  -> visible stack stayed 3 layers
```

Result:

```text
2 test files passed
22 tests passed
13 focused regression test files passed
130 focused regression tests passed
typecheck passed
browser smoke passed
git diff --check passed
```

Next safe item:

- Add fail-first tests for the bounded edit-plan proposal adapter described
  below. Do not add UI apply until the adapter proves it cannot bypass
  confirmation, stale guards, or the visible-browser-draft-only mutation
  boundary.

### 2026-06-22 Iteration 14 - Bounded Edit-Plan Proposal/Apply Design Card

Touched files:

- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- Documentation-only design iteration. No implementation file was changed.
- The design intentionally reuses the existing
  `ReportAssistantWorkbenchApplyProposal` and
  `confirmReportAssistantWorkbenchApplyProposal` contracts instead of creating
  a second apply authority.

Design goal:

```text
bounded dry-run plan -> confirmation-required Workbench proposal
-> stale target guard -> visible browser-draft apply only
```

The bounded edit-plan apply path must not:

- call provider/source research;
- generate candidate stacks inside the bounded plan;
- save a project, assembly, report, source row, or calculator evidence;
- write calculator values;
- bypass `confirmReportAssistantWorkbenchApplyProposal`;
- apply a plan whose visible Workbench target changed after proposal creation.

Target signature:

- Use `createReportAssistantWorkbenchApplyTargetSignature` over the current
  visible Workbench target:
  `context`, `layers`, `mode`, and `selectedOutputs`.
- Store this signature in the proposal through
  `expectedTargetWorkbenchSnapshotSignature` and
  `proposal.staleGuards.targetWorkbenchSnapshotSignature`.
- The UI confirmation path must recompute the current target signature at click
  time and pass it to `confirmReportAssistantWorkbenchApplyProposal`.
- If the current signature differs, apply must block with the existing
  `stale_target_workbench` result. No partial step may apply.

Source draft signature:

- Convert only a successful bounded dry-run result into a
  `ReportAssistantLayerStackDraft`.
- The draft context signature must be stable over:
  `planId`, `initialLayerSignature`, `finalLayerSignature`,
  `contextPatch`, `selectedOutputs`, and ordered step ids/command kinds.
- Pass the same signature as
  `expectedSourceDraftContextSignature`.
- Do not create an apply proposal for a blocked dry-run result.

Proposal adapter:

Add a focused adapter in a new Workbench-rebuild file, for example:

```text
apps/web/features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.ts
```

Suggested entry point:

```ts
createWorkbenchV2AssistantBoundedEditPlanApplyProposal({
  materials,
  plan,
  targetWorkbench: {
    context,
    layers,
    mode,
    selectedOutputs
  }
})
```

The adapter should:

- accept only `Extract<WorkbenchV2AssistantBoundedEditPlanResult, { ok: true }>`;
- reject blocked plans at the type boundary or with a deterministic
  `blocked_plan` result if runtime input is unknown;
- map `plan.finalLayers` into `ReportAssistantLayerStackDraft.layers`;
- use `plan.selectedOutputs` as requested/proposed outputs;
- merge `plan.contextPatch` as the proposed Workbench context patch;
- call `createReportAssistantWorkbenchApplyProposal`;
- return the existing `ReportAssistantWorkbenchApplyProposalResult`;
- carry warnings that say bounded edit-plan apply is confirmation-required and
  dry-run-derived.

Confirmation copy:

- Proposal title: `Apply bounded edit plan to draft`.
- Proposal summary must include:
  `Confirmation is required before the visible Workbench draft changes.`
- UI button copy may be `Prepare apply proposal` for the dry-run panel and
  `Apply to draft` only on the existing confirmed proposal card.
- The dry-run panel must keep saying `No Workbench layer changed yet` until the
  proposal is confirmed.

Mutation boundary:

- Confirmed apply payload may update only:
  `layers`, `contextPatch`, `mode`, `selectedLayerId`, and `selectedOutputs`
  in the visible browser draft.
- Confirmed apply must not include or write:
  `projectId`, `assemblyId`, `reportId`, saved baseline snapshots, source rows,
  calculator evidence, measured anchors, or provider result values.
- Existing `confirmReportAssistantWorkbenchApplyProposal` already returns
  `mutatesSavedState: false`; bounded edit-plan apply must preserve that.

Exact fail-first tests for next slice:

- Add
  `apps/web/features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.test.ts`.
- Test: successful dry-run plan becomes a
  `requiresConfirmation: true`, `previewOnly: true`, `mutates: false`
  Workbench apply proposal.
- Test: proposal `proposedWorkbench.layers` equals `plan.finalLayers`.
- Test: proposal `proposedWorkbench.selectedOutputs` equals
  `plan.selectedOutputs`.
- Test: proposal carries the target Workbench snapshot signature from the
  current visible target, not from the dry-run final layers.
- Test: blocked dry-run result cannot become a proposal.
- Test: missing/blank final layer thickness returns existing
  `draft_needs_input` and does not produce a proposal.
- Extend `workbench-v2-calculator-assistant-ui.test.ts` only after the adapter
  passes: dry-run panel has no direct apply button, `Prepare apply proposal`
  creates a normal Workbench apply proposal card, and the visible layer table is
  unchanged until `confirmReportAssistantWorkbenchApplyProposal` succeeds.
- Reuse `report-assistant-workbench-confirmed-apply.test.ts` behavior for
  cancellation and stale target blocking; do not create a separate confirmation
  mechanism.

Validation for the implementation slice:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

git diff --check
```

Browser smoke required only after UI prepare/apply wiring:

```text
dry-run prompt -> read-only plan -> prepare apply proposal
-> proposal card appears -> cancel confirmation keeps layer count unchanged
-> confirm applies visible browser draft only
-> changing layers before confirm blocks as stale
```

Result:

```text
design card recorded
no implementation files changed
git diff --check passed
```

Next safe item:

- Wire the bounded edit-plan proposal adapter into the read-only dry-run UI
  with fail-first tests: `Prepare apply proposal` must create the existing
  Workbench apply proposal card, cancellation must keep the layer table
  unchanged, confirmation must apply only the visible browser draft, and stale
  target changes must block.

### 2026-06-22 Iteration 15 - Bounded Edit-Plan Apply Proposal Adapter

Touched files:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.test.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- This iteration added a pure adapter and tests only. It did not touch
  `calculator-workbench.tsx`, UI buttons, confirmation handlers, calculator
  runtime, source rows, saved project/report persistence, material editor,
  measured anchors, or preset logic.
- The adapter deliberately reuses
  `createReportAssistantWorkbenchApplyProposal` and the existing confirmed
  apply contract rather than introducing a second apply authority.

What moved:

- Added `createWorkbenchV2AssistantBoundedEditPlanApplyProposal`.
- Successful bounded dry-run plans can now become
  `ReportAssistantWorkbenchApplyProposal` values with:
  `mutates: false`, `previewOnly: true`, and `requiresConfirmation: true`.
- The proposal uses the current visible Workbench target signature for stale
  guards, not the dry-run final layer stack signature.
- The proposal carries `plan.finalLayers` and `plan.selectedOutputs` as the
  proposed Workbench target.
- Blocked dry-run plans return deterministic `blocked_plan` and cannot produce
  an apply proposal.
- Blank/missing final layer thickness reuses existing layer-stack draft
  validation and returns `draft_needs_input`.
- The proposal title is bounded-plan-specific:
  `Apply bounded edit plan to draft`.

What did not move:

- No UI prepare/apply wiring was added.
- No bounded edit plan can apply to the visible Workbench draft yet.
- No provider call, source lookup, candidate generation inside bounded plans,
  saved project/report write, calculator formula, runtime route, source row, or
  calculator evidence changed.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

git diff --check
```

Result:

```text
5 test files passed
34 tests passed
typecheck passed
git diff --check passed
```

Next safe item:

- Add fail-first UI tests for the bounded dry-run panel's
  `Prepare apply proposal` flow. The UI must still avoid direct apply:
  prepare proposal first, show existing Workbench apply proposal card, require
  confirmation through `confirmReportAssistantWorkbenchApplyProposal`, block
  stale targets, and mutate only the visible browser draft.

### 2026-06-22 Iteration 16 - Bounded Edit-Plan Prepare Apply Proposal UI Wiring

Touched files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- This iteration touched only the assistant panel wiring around bounded dry-run
  plans. It did not touch calculator runtime/formulas/source rows, saved
  project/report persistence, material editor, measured anchors, or preset
  logic.
- The new helper explicitly says it only prepares the existing
  confirmation-gated Workbench proposal. The visible draft still changes only
  through `confirmCalculatorAssistantWorkbenchApplyProposal`.

What moved:

- Added a fail-first UI contract for the bounded dry-run panel's
  `Prepare apply proposal` flow.
- Imported `createWorkbenchV2AssistantBoundedEditPlanApplyProposal` into the
  Workbench client.
- Added `prepareCalculatorAssistantBoundedEditPlanApplyProposal()`.
- Successful bounded dry-run plans now show a `Prepare apply proposal` button.
- Clicking the button creates the existing Workbench apply proposal card with
  title `Apply bounded edit plan to draft`.
- Failed/blocked proposal creation shows a warning and does not mutate layers.
- The dry-run panel copy now says apply is gated by a separate proposal and
  confirmation.

What did not move:

- No direct bounded-plan apply function was added.
- No `confirmCalculatorAssistantBoundedEditPlan` exists.
- No Workbench layer changes when the user prepares the proposal.
- No saved project/report write, provider call, source lookup, candidate
  generation inside bounded plans, calculator formula, runtime route, source
  row, or calculator evidence changed.

Fail-first check:

```text
workbench-v2-calculator-assistant-ui.test.ts failed before implementation
because calculator-workbench.tsx did not contain
createWorkbenchV2AssistantBoundedEditPlanApplyProposal.
```

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

git diff --check
```

Result:

```text
UI contract passed after implementation: 20 tests passed
Focused assistant/proposal suite passed: 5 files / 35 tests
typecheck passed
git diff --check passed
```

Browser smoke:

```text
Server: http://localhost:3010
Login: local configured admin/admin
Prompt: 2. layerı sil, 15 mm gypsum ekle, Rw ve STC seç, hesapla
Observed: Multi-step dry run with 4 steps and Prepare apply proposal button
Observed after click: Apply bounded edit plan to draft proposal card and
Apply to draft button
Guard: did not click Apply to draft; header and layer schedule still showed
3 layers after proposal preparation
```

Next safe item:

- Add a focused browser/contract pass for the bounded proposal confirmation
  edge cases: dismiss/cancel keeps the layer table unchanged, confirmed apply
  mutates only the visible unsaved browser draft, and a target change after
  proposal preparation blocks as stale.

### 2026-06-22 Iteration 17 - Bounded Proposal Confirmation Edge-Case Contracts

Touched files:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.test.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- This iteration added bounded-specific regression tests only. It did not touch
  `calculator-workbench.tsx`, calculator runtime/formulas/source rows, saved
  project/report persistence, material editor, measured anchors, or preset
  logic.
- The tests deliberately exercise the existing
  `confirmReportAssistantWorkbenchApplyProposal` path with a bounded edit-plan
  proposal, rather than creating a bounded-plan-specific apply authority.

What moved:

- Added bounded proposal cancel coverage: if the user cancels confirmation,
  `apply` is not called and the result is `cancelled`.
- Added bounded proposal confirmed-apply coverage: confirmation calls `apply`
  with only the unsaved Workbench payload (`layers`, `contextPatch`, `mode`,
  `selectedOutputs`, `selectedLayerId`) and the payload does not contain
  `projectId` or `reportId`.
- Added bounded proposal stale-target coverage: if the visible Workbench target
  signature changes after proposal preparation, confirmation returns
  `stale_target_workbench` and `apply` is not called.

What did not move:

- No UI behavior changed.
- No direct bounded-plan apply function was added.
- No saved project/report write path was opened.
- No provider call, source lookup, candidate generation inside bounded plans,
  calculator formula, runtime route, source row, or calculator evidence changed.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  --maxWorkers=1

git diff --check
```

Result:

```text
bounded apply-proposal file passed: 6 tests
focused assistant/proposal suite passed: 5 files / 38 tests
git diff --check passed
```

Typecheck note:

```text
pnpm --filter @dynecho/web typecheck is currently blocked outside this
assistant slice by packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts:
surfaceMassKgM2 is possibly undefined at lines 154-155.
This engine file is already modified by another agent, so this iteration did
not edit it.
```

Browser note:

```text
A manual Playwright attempt was started, but the dev server performed full
Fast Refresh reloads while the browser flow was in progress. The browser run
is therefore not counted as validation evidence for this iteration. The
authoritative coverage added here is the bounded-specific contract test set.
```

Next safe item:

- After the unrelated engine typecheck error is resolved, rerun
  `pnpm --filter @dynecho/web typecheck`. Then either add a stable e2e/browser
  spec for the same cancel/confirmed/stale bounded proposal cases, or move to
  the next assistant capability slice using the already-confirmed proposal
  gate.

### 2026-06-22 Implementation Consistency Review - Bounded Proposal/E2E Scenario Backlog

Scope reviewed:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.ts`
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- bounded edit-plan and apply-proposal tests

Current consistency assessment:

- The high-level safety shape is consistent: bounded edit plans are dry-run
  only, provider/source/research requests are blocked inside the plan, candidate
  generation inside bounded plans is blocked, proposal creation uses the shared
  Workbench apply proposal contract, and confirmed apply goes through
  `confirmReportAssistantWorkbenchApplyProposal`.
- The post-proposal stale guard is covered: once a proposal exists, a changed
  visible Workbench target blocks confirmation with `stale_target_workbench`.
- The cancel and confirmed-apply contracts are covered at bounded-proposal
  level: cancel does not call `apply`; confirmed apply passes only visible
  unsaved Workbench payload fields and does not include saved project/report
  identifiers.

Important issue found and fixed in the next iteration:

- The review found there was no explicit guard yet for this sequence:
  1. user creates a bounded dry-run plan;
  2. user manually changes the visible layer stack;
  3. user clicks `Prepare apply proposal` on the old dry-run panel.
- The adapter currently receives the old plan's `finalLayers` and the current
  Workbench target signature. That means the proposal can be prepared against a
  now-current target while the proposed final layers came from an older source
  stack. The later confirmation stale guard cannot catch this, because the
  proposal target signature was captured after the manual edit.
- Required fix before calling this flow complete: `Prepare apply proposal`
  should compare the current visible layer-stack signature with the dry-run
  plan's `initialLayerSignature` and block if they differ. This was implemented
  in Iteration 18 below.

Secondary consistency notes:

- Some bounded apply-proposal tests use a simple instruction such as
  `15 mm gypsum ekle, Rw ve STC seç, hesapla` by calling
  `createWorkbenchV2AssistantBoundedEditPlan` directly. In the real UI router,
  that wording may stay on the normal single-command path unless the prompt
  looks like a true multi-step edit. This is acceptable for adapter unit tests,
  but permanent browser/e2e scenarios should use routed multi-step prompts such
  as `2. layerı sil, 15 mm gypsum ekle, Rw ve STC seç, hesapla`.
- `applyConfirmedWorkbenchApplyPayload` reports `changed` from layer-stack
  mutation only. If a future bounded plan changes only outputs/context and not
  layers, the success copy could say "already matched" even though outputs or
  context changed. Current bounded scenarios mostly move layers, so this is not
  the main blocker, but a future output-only e2e case should cover the copy.
- The current browser attempt was noisy because Next Fast Refresh reloaded the
  page during manual Playwright work. A permanent e2e should start from a clean
  browser context, avoid touching source files while running, and use stable
  assertions against visible layer count, proposal card text, and command
  messages.

Permanent browser/e2e scenario backlog:

1. Dry-run prepare does not mutate:
   - Start from the default wall stack with 3 layers.
   - Run `2. layerı sil, 15 mm gypsum ekle, Rw ve STC seç, hesapla`.
   - Assert `Multi-step dry run` appears with 4 steps.
   - Assert visible layer count remains 3.
   - Click `Prepare apply proposal`.
   - Assert `Apply bounded edit plan to draft` appears.
   - Assert visible layer count still remains 3.

2. Cancel confirmation keeps draft unchanged:
   - Continue from a prepared bounded proposal.
   - Click `Apply to draft`.
   - Dismiss the browser confirmation.
   - Assert `Workbench apply cancelled` appears.
   - Assert visible layer count and layer schedule remain unchanged.
   - Assert the proposal is still visible or can be dismissed without mutation.

3. Confirmed apply mutates only visible unsaved draft:
   - Prepare a fresh bounded proposal.
   - Click `Apply to draft`.
   - Accept the browser confirmation.
   - Assert `Workbench proposal applied` appears.
   - Assert the visible layer schedule reflects the proposed gypsum stack and
     selected outputs include `Rw` and `STC`.
   - Assert no saved project/report UI state changes and no report draft is
     created.

4. Stale after proposal preparation blocks:
   - Prepare a bounded proposal.
   - Manually change the visible stack, for example click `Add layer`.
   - Click `Apply to draft` on the old proposal.
   - Accept the browser confirmation if shown.
   - Assert `Workbench apply blocked` appears with stale-target messaging.
   - Assert the old proposal is not applied over the manually changed stack.

5. Stale before proposal preparation blocks (new required guard):
   - Run the bounded dry-run but do not prepare the proposal yet.
   - Manually change the visible stack.
   - Click `Prepare apply proposal`.
   - Expected behavior: block preparation and ask the user to rerun the dry run.
   - Current implementation status: covered by the Iteration 18 source/UI guard
     test. Iteration 19 browser coverage records the actual user-visible
     behavior: the manual layer edit clears the dry-run proposal panel before
     the stale prepare button can be clicked.

6. Blocked bounded plan has no apply path:
   - Run `rockwool'u çıkar, iki gypsum layer ekle, iki alternatif dene`.
   - Assert blocked dry-run panel appears.
   - Assert `Prepare apply proposal` and `Apply to draft` do not appear.
   - Assert visible layer count remains unchanged.

7. Provider/research wording stays out of bounded write flow:
   - Run `internetten araştır sonra gypsum ekle`.
   - Assert bounded plan blocks provider/research behavior or routes to the
     source-research flow without mutating layers.
   - Assert no proposal card appears from untrusted provider text.

Current browser/e2e status:

- Iteration 19 adds the permanent browser/e2e spec for the bounded dry-run,
  proposal, cancel, confirmed apply, stale-after-proposal, stale-before-prepare
  panel clearing, and blocked-candidate cases.
- Iteration 20 adds the provider/research wording browser scenario. Mixed
  research-and-edit wording now receives a visible clarification answer and is
  not treated as a draft mutation.
- Iteration 21 adds fill-only prompt examples to the assistant panel so users
  can discover the safe assistant flows without auto-running a command.
- Iteration 22 hardens the same browser/e2e spec into a higher-confidence
  regression contract: prompt chips execute in their intended safe lanes,
  objective Rw candidates cover cancel/confirmed/stale apply behavior, and
  browser `pageerror`/`console.error` fail the suite.

### 2026-06-22 Iteration 18 - Bounded Dry-Run Stale-Before-Prepare Guard

Touched files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- This iteration touched only the bounded edit-plan proposal preparation guard
  in the assistant panel and the UI source contract. It did not change
  calculator runtime/formulas/source rows, saved project/report persistence,
  material editor, measured anchors, or preset logic.

What moved:

- Added a fail-first UI source contract for the missing stale-before-prepare
  guard.
- `prepareCalculatorAssistantBoundedEditPlanApplyProposal()` now computes the
  current visible layer-stack signature with
  `getWorkbenchV2AssistantLayerStackSignature(layers)`.
- If the current signature differs from the dry-run plan's
  `initialLayerSignature`, proposal preparation is blocked with:
  `The visible layer stack changed after this dry run. Run the dry run again before preparing an apply proposal.`
- Any existing Workbench apply proposal is cleared when this stale dry-run
  condition blocks.

What did not move:

- User edits are not blocked.
- Only old assistant dry-runs are blocked from becoming proposals after the
  user edits the visible stack.
- No direct bounded-plan apply function was added.
- No saved project/report write path was opened.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  --maxWorkers=1

pnpm --filter @dynecho/web typecheck

git diff --check
```

Result:

```text
UI source guard test failed before implementation and passed after the guard.
Focused assistant/proposal suite passed: 5 files / 38 tests
typecheck passed
git diff --check passed
```

### 2026-06-22 Iteration 19 - Bounded Proposal Browser/E2E Contract

Touched files:

- `e2e/workbench-v2-assistant-bounded-proposal.spec.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- This iteration added only permanent Playwright coverage for the assistant
  bounded proposal browser flow. It did not change calculator runtime,
  formulas, source rows, saved project/report persistence, measured anchors, or
  material/preset logic.

What moved:

- Added a permanent browser/e2e spec for bounded assistant proposals.
- Covered the real routed multi-step prompt:
  `2. layerı sil, 15 mm gypsum ekle, Rw ve STC seç, hesapla`.
- Asserted the dry-run is read-only and keeps the visible layer count unchanged.
- Asserted `Prepare apply proposal` creates the shared
  `Apply bounded edit plan to draft` card without mutating layers.
- Asserted browser confirmation cancel reports `Workbench apply cancelled` and
  leaves the visible draft unchanged.
- Asserted a manual layer edit after proposal preparation blocks the stale
  proposal with `Workbench apply blocked` and does not show a confirmation
  dialog before blocking.
- Asserted confirmed apply changes only the visible browser draft: the default
  `Gypsum Board / Rock Wool / Concrete` stack becomes
  `15 mm Gypsum Board / 12.5 mm Gypsum Board / 100 mm Concrete`, and `STC` is
  selected beside `Rw`.
- Asserted a blocked candidate-generation prompt has no `Prepare apply
  proposal` or `Apply to draft` path and leaves the layer count unchanged.
- Asserted the browser's stale-before-prepare behavior is even earlier than the
  source guard: after a manual `Add layer`, the stale dry-run panel is cleared,
  so the old `Prepare apply proposal` button is no longer available.

What did not move:

- Provider/research wording was not added during Iteration 19 because source
  review and bounded write planning have different routing and authority
  boundaries. It is covered later by Iteration 20.
- No new production selector/test id was added; the spec uses existing
  accessible controls and `data-kind` assistant panels.
- No e2e assertion was added for saved project/report persistence because this
  flow never opens the project workspace or report draft path.

Validation:

```bash
PLAYWRIGHT_PORT=3132 pnpm exec playwright test \
  e2e/workbench-v2-assistant-bounded-proposal.spec.ts
```

Result:

```text
4 passed
```

### 2026-06-22 Iteration 20 - Mixed Research/Edit Clarification Browser Contract

Touched files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
- `e2e/workbench-v2-assistant-bounded-proposal.spec.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- This iteration touched only assistant command routing, a visible clarification
  message, and browser coverage. It did not change calculator runtime, formulas,
  source rows, saved project/report persistence, or provider result parsing.

What moved:

- Added a route guard for mixed research-and-draft-write wording such as
  `internetten araştır sonra gypsum ekle`.
- The assistant now answers with `Research edit needs clarification` instead of
  treating the command as a normal layer mutation.
- The visible message includes:
  `Research wording was not applied to the Workbench draft.`
- Turkish research verbs with suffixes such as `araştırıp` are now recognized
  by the source/research intent pattern.
- Added browser coverage proving the mixed research/edit command does not:
  change the visible layer count, remove the existing Rock Wool layer, show
  `Prepare apply proposal`, or show `Apply to draft`.

What did not move:

- Source-backed alternative research still requires explicit source-alternative
  wording and catalog/material mapping before candidates can appear.
- This guard does not block normal direct edit commands such as
  `15 mm gypsum ekle`; it only blocks mixed research+write wording from being
  applied as an edit.
- No provider text can create a Workbench apply proposal through this path.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1

PLAYWRIGHT_PORT=3133 pnpm exec playwright test \
  e2e/workbench-v2-assistant-bounded-proposal.spec.ts
```

Result:

```text
UI source/routing suite passed: 21 tests
Browser bounded proposal suite passed: 5 tests
```

### 2026-06-22 Iteration 21 - Assistant Prompt Example Chips

Touched files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/app/globals.css`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
- `e2e/workbench-v2-assistant-bounded-proposal.spec.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- This iteration added only UI affordance for the existing assistant flows. It
  did not change calculator runtime, formulas, source rows, provider parsing,
  project/report persistence, or automatic apply behavior.

What moved:

- Added compact assistant prompt chips under the `Stack command` textarea.
- Prompt examples cover source review, Rw improvement candidate planning,
  bounded edit planning, source-backed alternatives, and mixed research/edit
  clarification.
- Clicking a chip fills the command textarea and focuses it.
- Clicking a chip does not run the assistant command, prepare a proposal, apply
  layers, or save project/report state.
- Added responsive chip styling that wraps in the existing assistant panel and
  keeps long prompt text in `title`/accessible labels rather than expanding the
  layout.

What did not move:

- No prompt example bypasses the existing `Run` button.
- No prompt example changes the visible layer stack by itself.
- No new provider or calculator route was opened.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1

PLAYWRIGHT_PORT=3134 pnpm exec playwright test \
  e2e/workbench-v2-assistant-bounded-proposal.spec.ts
```

Result:

```text
UI source/routing suite passed: 22 tests
Browser bounded proposal suite passed: 6 tests
```

### 2026-06-22 Iteration 22 - Assistant Browser Regression Hardening

Touched files:

- `e2e/workbench-v2-assistant-bounded-proposal.spec.ts`
- `docs/ui/REPORT_ASSISTANT_POWER_AND_SCOPE_GAP_REVIEW_2026-06-22.md`

Coordination note:

- This iteration strengthened permanent browser/e2e coverage only. It did not
  change calculator runtime, formulas, source rows, provider parsing, saved
  project/report persistence, material editor, presets, or Workbench visual
  layout.

What moved:

- Added a browser runtime-error guard to the assistant e2e spec:
  - `pageerror` fails the current test;
  - `console.error` fails the current test.
- Added `expectBaseDraftUnchanged()` as the shared base invariant:
  - visible layer count remains `3`;
  - base stack remains `Gypsum Board / Rock Wool / Concrete`;
  - thickness summary remains `162.5 mm`;
  - `Rw` remains selected, `STC` remains unselected unless a confirmed apply
    intentionally changes it;
  - current calculator result remains `Rw: Calculated` / `57 dB`.
- Hardened the prompt-chip browser test so each chip is visible, enabled,
  has the expected `title` and accessible label, fills the textarea, focuses
  the textarea, enables `Run`, and does not open dry-run/apply panels or mutate
  the base draft.
- Added a full prompt execution matrix in real browser state:
  - `Rw kontrol et` -> source review card, calculator values unchanged;
  - `Rw artır` -> three objective Rw candidates, base draft unchanged;
  - `Edit planı` -> bounded read-only dry-run, no apply proposal until prepared;
  - `Alternatif ara` -> source alternative review; when no research endpoint is
    configured, no source candidate stack is created;
  - `Araştırmayı ayır` -> clarification, no bounded dry-run/proposal.
- Added objective Rw candidate lifecycle coverage:
  - objective prompt prepares three candidates;
  - candidate `Use` prepares `Apply assistant layer-stack draft to Workbench`;
  - browser confirmation cancel leaves the base draft unchanged;
  - accepted confirmation mutates only the visible browser draft;
  - stale target after manual layer edit blocks before confirmation and does
    not apply the stale proposal.
- Re-ran the strengthened e2e spec with `--repeat-each=2` to catch flake after
  two earlier dev-server/Fast Refresh timing failures were fixed by waiting for
  the base calculator result before chip interactions.

What did not move:

- No new production selector or test-only UI id was added.
- No assistant path can apply provider/research text directly to the Workbench
  draft.
- No saved project, saved report, source-row, formula, or runtime route changed.
- Real external research/provider smoke remains separate because
  `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT` is not configured in the local
  default test environment.

Validation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1

PLAYWRIGHT_PORT=3138 pnpm exec playwright test \
  e2e/workbench-v2-assistant-bounded-proposal.spec.ts

pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-source-alternative-candidate.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-wall-rw-improvement-planner.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-candidate-apply-proposal.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-natural-language-command.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts \
  features/workbench-rebuild/workbench-v2-assistant-bounded-edit-plan-apply-proposal.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-assembly-alternatives.test.ts \
  features/workbench/report-assistant-current-calculator-review-packet.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  --maxWorkers=1

PLAYWRIGHT_PORT=3138 pnpm exec playwright test \
  e2e/workbench-v2-assistant-bounded-proposal.spec.ts \
  --repeat-each=2

pnpm --filter @dynecho/web typecheck
pnpm lint:repo
pnpm typecheck:repo
git diff --check
```

Result:

```text
UI source/routing suite passed: 23 tests
Browser bounded proposal suite passed: 8 tests
Focused assistant suite passed: 14 files / 124 tests
Repeated browser bounded proposal suite passed: 16 tests
web typecheck passed
repo lint passed
repo typecheck passed
git diff --check passed
```

Next safe item:

- Add provider-backed browser smoke only when
  `DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT` is configured. Until then, local
  e2e must keep proving that missing-provider source/alternative prompts do not
  invent source-backed Workbench candidates or mutate the draft.

### Why Slice B Before Research-To-Candidate

Research-to-candidate is tempting, but it is higher risk because provider text
is untrusted and may use source names/material terms that do not map cleanly to
the catalog. A deterministic wall/Rw planner can prove the product loop first:

```text
user objective -> safe candidate drafts -> calculator preview -> ranking
-> confirmed browser-draft apply
```

Once that loop is stable, source-backed suggestions can feed into the same
candidate contract as advisory input rather than creating a parallel path.

### Implementation Consistency Guards For Slice B

Do not create a second Workbench candidate UI contract. The existing
`WorkbenchV2AssistantLayerStackCandidateStack` is the canonical preview-card
payload for current layer-stack candidates. A wall/Rw improvement planner may
add metadata beside that payload, but the cards, preview queue, stale signature,
and candidate snapshots should continue to operate on the existing candidate
stack shape.

Do not overload the current `generate_candidates` command. Today it means
bounded permutations/reorderings of the visible stack. Objective optimization
should enter through a separate planner/helper, and only through a new command
kind if the router/eval tests prove the richer instruction should route there.
If a command kind such as `improve_metric` is added, these files must move
together:

- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.ts`
  for the command union, instruction routing, parser result, and candidate
  planner call.
- `apps/web/features/workbench-rebuild/calculator-workbench.tsx` for message
  handling, candidate state, preview, ranking, and apply proposal wiring.
- `apps/web/features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts`
  and UI tests for route/cap/candidate/stale behavior.
- Assistant capability/eval fixtures if the route is exposed through the report
  assistant or API result envelope.

Do not make research/provider text the first source of candidate mutations.
Slice B should be deterministic and catalog-bound. Provider suggestions can feed
Slice C later, after they are mapped to catalog/material drafts and then adapted
into the same canonical candidate stack contract.

Do not let optimization candidates bypass confirmation. Simple permutation
candidates can keep the existing lightweight browser-draft `Use` behavior, but
objective-generated candidates should be converted into a Workbench apply
proposal and confirmed through the stronger stale-guarded proposal path before
changing the visible draft.

Do not rank on a missing metric. The current preview snapshot uses the selected
Workbench outputs. The planner must ensure `Rw` is included for the preview
without silently discarding user-selected outputs, or it must block with a clear
preview requirement before ranking.

## Slice B Draft Design

### New Contract Shape

Add a typed request/result pair, probably under `apps/web/features/workbench` or
`apps/web/features/workbench-rebuild` depending on UI ownership:

```ts
type WorkbenchWallRwImprovementRequest = {
  candidateCap: 1 | 2 | 3;
  constraints: {
    maxAddedLayers?: number;
    maxAddedThicknessMm?: number;
    preserveMode: "wall";
    mutatesSavedState: false;
  };
  direction: "increase";
  metric: "Rw";
  source: "current_workbench_stack";
};
```

Candidate output should reuse existing draft/candidate concepts where possible:

```ts
type WorkbenchWallRwImprovementPlan = {
  candidateStacks: readonly WorkbenchV2AssistantLayerStackCandidateStack[];
  metadataByCandidateId: Record<
    string,
    WorkbenchWallRwImprovementCandidateMetadata
  >;
  objective: {
    direction: "increase";
    metric: "Rw";
  };
  previewRequired: true;
  sourceLayerSignature: string;
};

type WorkbenchWallRwImprovementCandidateMetadata = {
  candidateId: string;
  expectedMechanism: "added_mass" | "porous_cavity_damping" | "symmetric_boarding";
  generatedBy: "wall_rw_improvement_planner_v1";
  objectiveMetric: "Rw";
  tradeoffs: readonly string[];
};
```

The important boundary is that `candidateStacks` remain normal
`WorkbenchV2AssistantLayerStackCandidateStack` values. Metadata is additive and
keyed by `candidateId`; it should not fork preview, ranking, or stale-check
contracts.

### First Deterministic Candidate Rules

Start with conservative wall/Rw candidate rules:

- If the stack has gypsum/board layers, create one candidate that adds one
  additional gypsum board layer on the side with fewer board layers.
- If acoustic gypsum exists in catalog and generic gypsum exists in the current
  stack, create one candidate that replaces one generic gypsum layer with
  acoustic gypsum.
- If there is a porous cavity and the current route inputs are sufficient,
  create one candidate that increases absorber thickness or fills missing
  draft absorber thickness only when the route has the required physical inputs.
- If the wall is double-leaf/framed, create one symmetric board-add candidate
  instead of piling all mass on one side.
- Never add more than the requested max added layers.
- Never claim the candidate improves Rw until calculator preview returns a live
  higher `Rw`.

### Slice B UI Reuse

Reuse the existing calculator assistant candidate UI:

- Candidate cards should keep using `calculatorAssistantCandidateStacks` as the
  primary preview/apply payload. Any `tradeoffs` and `expectedMechanism` copy
  should be read from side metadata keyed by `candidateId`.
- `Preview all` should continue to use the existing one-at-a-time calculator
  preview loop.
- Ranking should continue to hide unless every candidate has live `Rw`.
- Objective-generated candidates should create a Workbench apply proposal before
  mutation. The confirmation/stale guard should be at least as strong as
  `confirmReportAssistantWorkbenchApplyProposal`; direct `Use` is too light for
  "assistant chose the best physical stack" changes.

### Slice B Tests

Add or extend focused tests:

- `workbench-v2-assistant-layer-stack-command.test.ts`
  - objective prompt routes to improvement candidate generation, not generic
    `add_layer` or existing `generate_candidates`;
  - candidate cap respected;
  - existing `generate_candidates` permutation behavior remains unchanged;
  - no saved-state mutation flag;
  - stale source signature present.
- `workbench-v2-calculator-assistant-ui.test.ts`
  - Rw improvement command shows candidates;
  - `Preview all` requests calculator preview for each ready candidate;
  - ranking appears only for live `Rw` rows;
  - applying an objective-generated candidate goes through confirmation and a
    stale-guarded Workbench apply proposal;
  - applying candidate changes visible draft only, not saved project/report
    state.
- `report-assistant-golden-evals.test.ts`
  - objective-driven assistant result remains calculator-backed only after
    preview; no model-valued dB.

## Decision Rules For What Not To Build Next

Do not start with:

- a broad autonomous web-search optimizer;
- a provider-generated patch directly mutating Workbench layers;
- a multi-agent planner that can call write tools without a typed proposal;
- floor/impact optimization;
- persistent source-row import from assistant research.

Those would bypass the already-good safety architecture and recreate the same
authority problems the current assistant has carefully avoided.

## Validation Plan

Minimum focused validation for future implementation:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-assistant-layer-stack-command.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  features/workbench/report-assistant-plausibility.test.ts \
  features/workbench/report-assistant-plausibility-research.test.ts \
  features/workbench/report-assistant-assembly-alternatives.test.ts \
  features/workbench/report-assistant-workbench-apply-proposal.test.ts \
  features/workbench/report-assistant-workbench-confirmed-apply.test.ts \
  --maxWorkers=1
```

Run browser smoke or Playwright once candidate generation/apply UI changes:

- source review -> report edit blocked without report target;
- source review -> prepare/apply report draft with selected report target;
- Rw improvement command -> candidates -> preview all -> ranking -> apply best
  candidate to browser draft;
- stale candidate blocked after visible layer stack changes.

## Non-Goals For These Slices

- Do not change calculator formulas, runtime route selection, source rows, or
  metric aliases.
- Do not let provider text produce final dB values.
- Do not import source research into calculator evidence.
- Do not add autonomous saved project/report mutations.
- Do not broaden floor/impact optimization before wall/Rw improvement is stable.
