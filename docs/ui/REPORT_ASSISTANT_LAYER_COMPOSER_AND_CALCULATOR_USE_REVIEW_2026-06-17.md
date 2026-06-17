# Report Assistant Layer Composer And Calculator Use Review - 2026-06-17

## Purpose

This review continues the assistant gap hunt with one explicit product target:

The report assistant should be able to understand user-requested wall, floor, and
ceiling layer combinations, arrange those layers into a calculator-valid stack,
run the existing calculator, and report calculator-backed outputs. It must do
that without changing engine behavior, mutating formulas, importing source rows,
or silently editing the Workbench stack.

The desired capability is not "assistant edits engine code." It is:

1. parse or propose a layer combination from the user's instruction;
2. normalize it into a typed Workbench/calculator draft;
3. ask for missing physical inputs instead of guessing;
4. call the existing calculator preview path;
5. show the parsed stack, outputs, route status, and tasks as structured UI;
6. only mutate browser/workbench state after an explicit future confirmation
   flow.

## Executive Conclusion

The assistant already has the first calculator-use foundation, but it is not yet
a capable layer-composition assistant.

What exists:

- `preview_workbench_v2_calculator_snapshot` can run the calculator from a valid
  Workbench V2 snapshot.
- `preview_described_layer_configuration` can parse a bounded described wall
  stack with explicit `mm` thicknesses, repeated layer notation,
  comma-separated layer lists, and material-before-thickness phrasing.
- `/api/report-assistant/calculator-preview` exposes this as a non-mutating,
  preview-only server route.
- The read-only query helper can detect a narrow described-layer calculator
  instruction and return both a text answer and structured `calculatorPreview`
  data.
- The report editor now routes bounded imperative calculator commands to
  `read_only_query`, guards stale query/action/patch responses, and renders the
  calculator preview in the assistant response thread.
- The Workbench V2 review panel can call the calculator preview route using the
  current browser snapshot.

What is missing:

- The described-layer parser is a narrow deterministic wall parser, not a full
  layer composer.
- Floor, ceiling, and impact descriptions are intentionally parked as
  `needs_input`.
- The assistant has no durable stack-draft model, no clarification loop, no
  multi-candidate comparison mode, and no confirm/apply flow to Workbench.
- Natural-language custom material creation is not supported. Custom materials
  work through Workbench snapshots, not through free-text assistant capture.

Near-term priority:

1. consume the newly landed assistant capability registry from a shared
   result-card/envelope contract so calculator, query, patch, action, research,
   and finding results share one policy surface;
2. add an assistant layer-stack draft schema;
3. add an iterative missing-input loop;
4. broaden wall composer coverage inside that draft boundary;
5. only then add floor/ceiling composition and optional apply-to-Workbench.

## Scope Guard

This work should not touch engine calculation truth.

Allowed:

- assistant intent classification;
- parser/composer improvements;
- typed preview payloads;
- UI rendering of calculator preview results;
- route guards, request lifecycle guards, and stale result rejection;
- tests and docs for assistant behavior;
- optional future Workbench browser-state apply flow after confirmation.

Not allowed in this assistant slice:

- changing `calculateAssembly` formulas;
- retuning acoustic routes;
- changing metric aliases or metric basis;
- source crawling;
- source row imports;
- silent report or Workbench mutation;
- treating an assistant guess as a calculator-owned value.

## Implementation Evidence

### Calculator Preview Tool Declarations

File:
`apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`

The assistant calculator helper declares two preview-only tools:

- `preview_workbench_v2_calculator_snapshot`
- `preview_described_layer_configuration`

Both are declared with `mutates: false` and `previewOnly: true`. This is the
right trust posture. The assistant may ask the calculator for a preview, but it
does not get a hidden mutation channel.

### Snapshot Calculator Path

File:
`apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`

`previewWorkbenchV2CalculatorSnapshot`:

- parses a Workbench V2 snapshot;
- validates selected target outputs;
- builds a resolved material catalog including custom materials from the
  snapshot;
- returns local `needs_input` tasks when layers, materials, thicknesses, or
  outputs are incomplete;
- builds an `EstimateRequest`;
- calls `calculateAssembly`;
- maps engine answers and route tasks into assistant preview rows.

This is the strongest current path. It proves the assistant can use the
calculator when a complete Workbench draft already exists.

### Described Layer Path

File:
`apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`

`previewDescribedLayerConfiguration`:

- reads a non-empty layer description;
- infers `wall` unless floor/ceiling terms are present without wall terms;
- infers target outputs from metric aliases, defaulting to `Rw` for wall and
  `Ln,w` for floor;
- parks non-wall descriptions as `needs_input`;
- parses wall segments using explicit positive `mm` thicknesses;
- matches material aliases against the resolved base catalog;
- builds a temporary Workbench V2 wall snapshot;
- reuses the snapshot preview path.

This is a useful seed, but it is not yet a real layer-composition assistant.

### Report Query Path

File:
`apps/web/features/workbench/report-assistant-query.ts`

The read-only query helper detects described calculator preview intent when the
instruction has:

- at least one explicit `mm` thickness;
- calculator or output intent such as `calculator`, `hesapla`, `Rw`, `STC`,
  `Dn`, `Ln`, `IIC`, `layer`, `stack`, `wall`, or `duvar`.

When it matches, the helper calls `previewDescribedLayerConfiguration` and
returns a text answer, `calculator_preview` evidence, and a structured
`calculatorPreview` payload.

Current limitation:

- this path is still deterministic and one-shot;
- it does not create a durable stack draft;
- it does not keep clarification state when the user supplies missing material,
  topology, or physical input details later.

### Report Editor Routing

File:
`apps/web/features/workbench/report-assistant-editor-workflow.ts`

The report editor classifier currently routes:

- save/create/delete/update wording to `action_proposal`;
- bounded described calculator-preview commands with explicit `mm` thickness and
  calculator/metric/layer intent to `read_only_query`;
- question/workspace/report/preset wording to `read_only_query`;
- remaining instructions to `patch_proposal`.

It now recognizes a command like:

```text
Calculatoru kullan: 12.5 mm alcipan + 50 mm tasyunu + 100 mm beton icin Rw ve STC hesapla
```

as a read-only calculator command rather than a report patch request.

### Report Editor Message Shape

File:
`apps/web/features/workbench-rebuild/report-editor.tsx`

Current assistant query payload and message state can carry calculator preview:

- `AssistantQueryPayload` can include `calculatorPreview`;
- `AssistantMessage` can store `calculatorPreview`;
- `getAssistantQueryAnswer` returns only a string answer;
- `getAssistantQueryCalculatorPreview` defensively validates the envelope;
- the response thread renders title/detail text plus
  `AssistantCalculatorPreviewBlock` when a guarded preview is present.

Current limitation:

- calculator preview is a special-case card, not part of a shared assistant
  result-card registry;
- patch, action, research, and finding results are not yet rendered through the
  same typed card contract.

### Workbench V2 Preview Surface

File:
`apps/web/features/workbench-rebuild/calculator-workbench.tsx`

The Workbench V2 panel is better aligned with calculator use than the report
editor path. It sends the current Workbench snapshot to
`/api/report-assistant/calculator-preview`, uses request/stale-result guards,
and can display preview rows/tasks for the active calculator draft.

This is not enough for the requested assistant behavior, because the user wants
the assistant to arrange requested layer combinations itself. Snapshot preview
only works after the user has already built the stack.

### Assistant Capability Registry

File:
`apps/web/features/workbench/report-assistant-capabilities.ts`

The assistant now has a first-pass capability registry that records the
calculator-preview route and tools beside query, patch, action, research,
project-read, preset-read, findings, and runtime-status capabilities.

This helps the layer-composer work because calculator preview now has explicit
registry metadata:

- `mutates: false`;
- `previewOnly: true`;
- `requiresConfirmation: false`;
- `providerPolicy: local_calculator`;
- `rendererKind: calculator_preview_card`;
- `stalePolicy: snapshot_or_description_request` or
  `assistant_context_signature`.

Current limitation:

- the registry is not yet a shared result envelope or renderer map, so the
  report editor still handles calculator preview as a special structured block.
- the registry is not yet the planner target for layer-composer routing.

## Current Capability Matrix

| Capability | Current status | Assessment |
| --- | --- | --- |
| Use calculator from complete Workbench snapshot | Implemented | Good foundation |
| Include custom Workbench materials in preview | Implemented for snapshot path | Good foundation |
| Parse simple described wall stack | Implemented for basic `mm + material` segments | Partial |
| Use calculator from described wall stack | Implemented | Partial |
| Report editor recognizes imperative calculator commands | Implemented for bounded `mm` + calculator/metric/layer intent | First-pass support |
| Query response carries structured preview payload | Implemented for described wall preview | First-pass support |
| Assistant thread renders calculator preview block | Implemented for calculator preview | First-pass support |
| Repeated layer notation such as `2x12.5 mm gypsum` | Implemented for bounded described wall preview | Basic parser coverage |
| Robust reversed order such as `gypsum board 12.5 mm` | Implemented for unambiguous described wall preview | Basic parser coverage |
| Rich wall topology from text | Not implemented | Composer gap |
| Floor/ceiling natural-language composition | Parked as `needs_input` | Correct but incomplete |
| Missing physical input clarification loop | Not implemented | Interaction gap |
| Multiple alternative stack generation and comparison | Not implemented | Product gap |
| Apply parsed stack to Workbench draft after confirmation | Parked | Correctly parked |
| Natural-language custom material creation | Not implemented | Composer/material gap |
| Preview result stale-lifecycle protection in report editor | Wired for query/action/patch assistant requests | First-pass support |
| Assistant capability registry for calculator preview | Implemented | First-pass policy contract |
| No engine mutation by assistant | Preserved | Correct |

## Gap Details

### Gap 1 - The Assistant Is Not Yet A Stack Composer

The current described parser takes an already explicit stack and tries to map it:

```text
12.5 mm alcipan + 50 mm tasyunu + 100 mm beton
```

That is useful, but it is not the same as:

```text
Alcipanli, tas yunlu, betonlu bir duvar diz ve Rw/STC hesapla.
```

or:

```text
Bana ayni kalinlikta uc alternatif bolme duvar oner, calculator ile karsilastir.
```

A real assistant layer composer needs an intermediate typed draft:

```ts
type AssistantLayerStackDraft = {
  assumptions: readonly string[];
  candidates: readonly AssistantLayerStackCandidate[];
  intent: "calculator_preview" | "compare_alternatives" | "apply_after_confirmation";
  unresolvedInputs: readonly AssistantLayerComposerInputTask[];
};
```

The current implementation jumps straight from text parsing to a temporary
snapshot. That is fine for the first simple wall preview, but it leaves no place
to hold alternatives, assumptions, clarification state, or user confirmation.

### Gap 2 - Parser Handles Only A Narrow Wall Grammar

Current segment splitting:

- replaces `mm, <digit>` with `mm +`;
- replaces `and` and `ve` with `+`;
- splits on `+`, semicolon, or newline;
- keeps only segments containing an explicit thickness pattern.

Current material matching:

- strips known generic words;
- matches deterministic aliases;
- rejects same-length ambiguous material matches;
- returns `needs_input` on unknown material.

This is safe, but too narrow for normal user phrasing.

Covered in the current Phase 0 pass:

- `2x12.5 mm gypsum board`
- `2 x 12.5 mm alcipan`
- `12,5 mm alcipan, 50 mm tas yunu, 100 mm beton`
- `gypsum board 12.5 mm + rockwool 50 mm`

Still missing common phrasing:

- `iki kat 12.5 mm alci levha`
- `double gypsum each side`
- `75 mm stud + 50 mm wool + double board`
- `bagimsiz karkas`
- `resilient bar`
- `air gap 50 mm`
- `cavity 90 mm full filled`
- `field DnT,w` or `sahada R'w`

The parser should stay deterministic, but the accepted grammar needs to grow.

### Gap 3 - Topology Is Not Captured From Described Text

The calculator can use rich wall context through Workbench snapshots:

- `wallTopologyMode`
- `wallSideALeafLayerIndices`
- `wallSideBLeafLayerIndices`
- `wallCavity1LayerIndices`
- `wallCavity1DepthMm`
- `wallCavity1FillCoverage`
- `wallCavity1AbsorptionClass`
- `wallSupportTopology`
- `supportSpacingMm`

The described wall path currently assigns roles by position:

- first layer: `side_a`;
- last layer: `side_b`;
- middle porous absorber: `cavity`;
- other middle layers: `core`.

That heuristic is acceptable for a small proof, but it cannot represent many
real wall constructions. The assistant must be able to capture topology only
when the user explicitly states it, and otherwise ask for the missing topology
instead of inventing it.

Required composer behavior:

- if user says `double leaf`, map to a double-leaf wall draft only when side A,
  side B, and cavity roles can be determined;
- if user says `independent frame`, set independent support topology only when
  enough context is present;
- if user says `full filled cavity`, map fill coverage and absorber class when
  the cavity layer is known;
- if topology cannot be proven, return a task such as `Select wall topology`
  instead of silently using a default.

### Gap 4 - Floor And Ceiling Text Composition Is Correctly Parked But Missing

`previewDescribedLayerConfiguration` returns `needs_input` for floor/ceiling
descriptions. That is correct today because floor and impact routes need more
physical inputs than a simple layer list.

The missing capability is not to guess those inputs. The missing capability is a
floor/ceiling composer that asks for them.

Examples of route-required inputs that may be needed:

- floor system family;
- slab/deck type;
- finish or floating layer roles;
- resilient layer properties;
- dynamic stiffness;
- surface mass/load basis;
- exact ASTM or ISO impact basis;
- field room/volume context where relevant;
- direct/flanking or normalized impact context;
- target output basis, for example `Ln,w`, `L'nT,50`, `IIC`, or `AIIC`.

The assistant should not convert every floor instruction into a wall-like layer
stack. For floor/ceiling routes, the composer should first build an input task
list and only call calculator preview when the route-required context is
complete.

### Gap 5 - Calculator Preview Is Still A Special-Case Result Card

Original issue:

- the query route could build a calculator-backed answer, but the report editor
  received and stored only text.

Current status:

- query responses can carry structured `calculatorPreview` payloads;
- report editor assistant messages can preserve the payload;
- the assistant thread renders parsed layers, route status, output rows, and
  task lists.

Remaining problem:

- calculator preview is still a bespoke block attached to query messages, not a
  registry-selected result card.

That still prevents fully consistent assistant behavior:

- patch/action/research/finding/project-read results do not share one renderer
  contract with calculator preview;
- `previewOnly`, `mutates`, and `requiresConfirmation` labels are not yet
  rendered from one capability envelope;
- future compare/rerun/apply affordances would need bespoke code unless the next
  result-card contract lands first.

This is now the most immediate user-facing contract gap.

### Gap 6 - Imperative Calculator Commands Route Correctly, But Not Through A Shared Planner

Original issue:

- the user naturally says:

```text
Calculatoru kullan, bu katmanlari hesapla.
```

  That is not a question, and it is not a report patch. It should be classified
  as `read_only_query`.

Current status:

- the editor classifier detects bounded calculator preview intent before falling
  through to patch proposals when the request has:

- explicit positive `mm` thickness;
- calculator or metric intent;
- no save/apply/create/delete/update intent.

Remaining problem:

- this is still classifier-specific logic, not a shared planner decision that
  selects a capability registry entry;
- research, finding, patch, action, query, and calculator decisions still live
  in multiple detector files.

The next planner contract should preserve the current correct precedence while
making the selected capability explicit.

### Gap 7 - No Clarification Loop

Current behavior can return tasks such as missing material or unsupported floor
description. The assistant does not yet turn those tasks into a structured
follow-up flow.

Desired behavior:

1. user asks for a layer combination;
2. assistant produces a stack draft or tasks;
3. assistant asks the smallest next question;
4. user answers;
5. composer merges the answer into the existing draft;
6. assistant previews again;
7. result shows outputs or remaining tasks.

This requires preserving a small `assistantLayerComposerState` per assistant
thread message or per active request, not just rendering a one-off text answer.

### Gap 8 - No Multi-Candidate Comparison

A strong assistant should be able to answer:

```text
Bu duvar icin uc alternatif diz, Rw ve STC'yi calculator ile karsilastir.
```

Current implementation has one described stack in, one preview out.

Needed:

- bounded candidate count, probably max 3 initially;
- each candidate represented as an `AssistantLayerStackCandidate`;
- preview all candidates through the same calculator route;
- reject candidates that need missing inputs;
- show a comparison table with status, primary value, thickness, mass when
  available, and tasks.

Safety rule:

- the assistant may propose alternatives, but the calculator remains the source
  of numeric truth. If a candidate cannot calculate, it must show `needs_input`
  or `unsupported`.

### Gap 9 - No Natural-Language Custom Material Capture

The snapshot path can preview custom materials already present in the Workbench
snapshot. That is good.

The described path always builds the resolved material catalog with an empty
custom material list, so a free-text custom material definition is not captured:

```text
848 kg/m3 panel leaf, 12.5 mm, 45 kg/m3 tas yunu 90 mm, tekrar ayni panel
```

Future composer behavior should be:

- detect custom material intent;
- produce a typed custom material draft;
- require explicit acoustic behavior and required physical properties;
- ask for missing required properties;
- require user confirmation before adding it to the browser material library;
- preview with the custom material only after the draft validates.

This is not an engine change. It is input capture and Workbench material-draft
management.

### Gap 10 - No Confirmed Apply-To-Workbench Flow

The current described layer path correctly avoids mutating Workbench. That
should stay true until a separate confirmed action exists.

Eventually, users will expect:

```text
Bu stack'i workbench'e uygula.
```

That is a browser Workbench state mutation, not an engine mutation. It needs its
own guarded flow:

- preview first;
- show exact parsed stack;
- confirm apply;
- check stale Workbench signature;
- apply layers/context/custom material drafts to the Workbench draft;
- clear incompatible selected-child state;
- preserve existing report unless explicitly updated.

This should not be merged into the read-only calculator preview path.

### Gap 11 - No Evaluation Set For Layer Composer Quality

Current tests cover:

- non-mutating tool declarations;
- snapshot calculator preview with custom materials;
- incomplete snapshot `needs_input`;
- invalid snapshot/output rejection;
- one simple described wall stack;
- unknown material `needs_input`;
- route preview from a described configuration.
- imperative report-editor calculator command classification;
- structured query `calculatorPreview` payload;
- assistant message state preserving preview payload;
- rendered preview block;
- repeated layer notation;
- comma-separated Turkish descriptions;
- reversed material/thickness order;
- no report patch mutation for calculator-preview commands;
- stale-result rejection in report editor query/action/patch paths;
- capability registry route/tool/action coverage.

Missing tests:

- double-leaf topology phrases;
- unknown or ambiguous material clarification;
- floor/ceiling `needs_input` tasks;
- multi-candidate preview cap;
- registry-selected result envelope/card rendering;
- planner-selected capability decisions across query/action/patch/calculator/
  research/finding paths;
- no apply affordance on preview-only calculator cards after result-card
  unification.

## Best-Practice Assistant Architecture

The robust shape is a layered assistant, not an LLM directly calling random
application code.

### Layer 1 - Intent Classifier

Classify the instruction into one of these modes:

- report patch proposal;
- project action proposal;
- read-only query;
- calculator preview;
- layer-composer preview;
- future apply-to-Workbench proposal.

Calculator/layer-composer preview is read-only until the user explicitly asks to
apply and confirms.

### Layer 2 - Composer Draft

Convert user text into a typed draft. This draft is not yet calculator truth.

Candidate shape:

```ts
type AssistantLayerStackCandidate = {
  assumptions: readonly string[];
  context: AssistantLayerContextDraft;
  id: string;
  layers: readonly AssistantLayerDraft[];
  mode: "wall" | "floor";
  name: string;
  parserDiagnostics: readonly string[];
  requestedOutputs: readonly string[];
  unresolvedInputs: readonly AssistantLayerComposerInputTask[];
};

type AssistantLayerDraft = {
  materialId?: string;
  materialName?: string;
  materialSource: "catalog" | "custom_draft" | "unresolved";
  role?: string;
  thicknessMm?: number;
};
```

Rules:

- no numeric output is accepted from this layer;
- no material is guessed when alias resolution is ambiguous;
- assumptions are shown to the user;
- unresolved inputs block calculator preview unless a safe preview route exists.

### Layer 3 - Host Validation

Before the calculator is called:

- validate material ids against catalog/custom drafts;
- validate positive thicknesses;
- validate target outputs;
- validate context fields;
- validate mode-specific route requirements;
- reject unsafe candidate count or oversized payloads.

### Layer 4 - Calculator Preview

Only after validation, call the existing preview helper:

- snapshot path for complete Workbench drafts;
- described/composer path for temporary drafts;
- never from the client directly importing engine;
- always return `mutates: false` and `previewOnly: true`.

### Layer 5 - Structured UI

Render a preview block with:

- parsed layer stack;
- assumptions;
- unresolved tasks;
- requested outputs;
- output rows;
- route status/method when available;
- explicit read-only marker;
- future confirm/apply button only when the candidate is valid and current.

### Layer 6 - Optional Confirmed Mutation

Only a separate action can mutate Workbench browser state:

- it must have a user confirmation;
- it must check stale signatures;
- it must not change engine code;
- it must not edit report values unless the user explicitly asks.

## Recommended Implementation Roadmap

### Phase -1 - Stabilize Query Route Preflight

Status: required before Phase 0.

Deliverables:

- `features/workbench/report-assistant-query-route.test.ts` passes by itself;
- configured-mode auth returns `401` without timing out;
- mutation-intent rejection is tested under an explicit authenticated/preview
  setup so it cannot be polluted by a previous auth test;
- project storage remains untouched on mutation-intent rejection;
- no calculator-preview payload or parser change is mixed into this preflight.

Why first:

- the report query route is the transport for described calculator preview
  answers in the report assistant;
- structured preview tests will be noisy if auth precedence or auth mock state is
  unstable;
- fixing this first makes later failures actionable.

### Phase 0 - Productize Current Calculator Preview

Status: already planned in
`docs/ui/REPORT_ASSISTANT_CALCULATOR_PREVIEW_PRODUCTIZATION_PLAN_2026-06-17.md`.

Do this after Phase -1 is green.

Deliverables:

- editor classifier routes calculator-preview commands to `read_only_query`;
- query success can carry `calculatorPreview`;
- query route serializes `calculatorPreview`;
- report editor parses and stores preview payload;
- assistant thread renders structured preview block;
- report editor uses request lifecycle helpers for stale query/action/patch
  responses;
- tests cover classifier, route payload, editor state, render, and stale
  rejection.

Why first:

- without this, better composer output is trapped as plain text and cannot become
  a professional assistant experience.

### Phase 1 - Add `assistant_layer_stack_draft_v1`

Create a typed intermediate draft for layer-composer work.

Deliverables:

- `AssistantLayerStackDraft` and `AssistantLayerStackCandidate` types;
- deterministic conversion from parsed described wall output into this draft;
- validation helper that converts one valid candidate into a temporary Workbench
  V2 snapshot;
- tasks for unresolved material, thickness, mode, output, topology, and context;
- tests that assert no calculator call happens when required draft fields are
  unresolved.

Do not add LLM generation yet. First make the host-side draft boundary solid.

### Phase 2 - Harden Wall Parser Grammar

Extend deterministic parsing for high-frequency wall descriptions.

Deliverables:

- repeated layer notation:
  - `2x12.5 mm gypsum board`
  - `2 x 12.5 mm alcipan`
  - `iki kat 12.5 mm alci levha`
- comma-separated stacks:
  - `12.5 mm alcipan, 50 mm tas yunu, 100 mm beton`
- material-before-thickness:
  - `gypsum board 12.5 mm`
- explicit side/cavity wording:
  - `side A`, `side B`, `cavity`, `bosluk`, `tas yunu dolgu`
- parser diagnostics in `describedConfiguration.warnings`;
- no fuzzy nearest-material matching unless a later reviewed resolver has clear
  ambiguity rules.

Acceptance:

- each newly supported phrasing has a contract test;
- ambiguous material still returns `needs_input`;
- no parser change modifies engine outputs.

### Phase 3 - Add Wall Topology Composer

Map explicit user text into wall context only when proven.

Deliverables:

- support explicit `single leaf`, `double leaf`, `double leaf framed`, and
  `independent frame` wording;
- support explicit cavity depth/fill when present;
- support side A/B leaf grouping when present;
- return tasks when topology is requested but incomplete;
- preserve simple stack behavior for basic single-route wall previews.

Acceptance:

- `double leaf` prompts without enough side/cavity info ask for missing inputs;
- complete double-leaf prompts build context matching Workbench snapshot
  expectations;
- field/building output requests stay basis-honest.

### Phase 4 - Add Clarification Loop

Turn preview tasks into assistant questions.

Deliverables:

- store a composer draft id in assistant message state;
- next user answer can update unresolved fields;
- rerun validation and calculator preview after updates;
- keep previous assumptions visible;
- expire draft state when report/workbench context changes.

Acceptance:

- missing material prompts ask for material selection;
- missing thickness prompts ask for thickness;
- missing topology prompts ask for topology;
- stale answers do not update a newer draft.

### Phase 5 - Add Multi-Candidate Preview

Support bounded alternatives.

Deliverables:

- max 3 candidates per request;
- candidate table with layer summary and output status;
- preview route loops through validated candidates with a strict cap;
- unsupported/needs-input candidates remain visible but do not get fabricated
  values.

Acceptance:

- user can ask for alternatives and receive a comparison;
- all numeric values come from calculator preview results;
- unpreviewable candidates explain their missing input.

### Phase 6 - Add Custom Material Draft Capture

Support user-supplied material definitions as input drafts.

Deliverables:

- detect custom material descriptions;
- create `custom_draft` materials with required acoustic behavior;
- validate density, flow resistivity, dynamic stiffness, or other required
  properties by behavior;
- ask for missing properties;
- preview with custom drafts after validation;
- require confirmation before adding custom materials to Workbench state.

Acceptance:

- custom panel/absorber wall prompt can preview when required properties exist;
- missing properties return tasks;
- custom material drafts do not become permanent without confirmation.

### Phase 7 - Add Floor/Ceiling Composer

Build a separate mode-aware floor/ceiling parser and input collector.

Deliverables:

- floor/ceiling stack draft roles;
- impact and airborne target-output handling;
- required physical input tasks;
- support for Workbench snapshot floor previews remains separate from described
  floor composition;
- no generic ASTM/ISO alias guessing.

Acceptance:

- incomplete floor prompt returns precise `needs_input`;
- complete owned floor prompt previews through calculator;
- unsupported basis remains unsupported.

### Phase 8 - Add Confirmed Apply-To-Workbench

Only after preview UX and stale lifecycle are solid.

Deliverables:

- action proposal for applying a valid composer candidate to Workbench draft;
- explicit confirmation;
- stale Workbench snapshot guard;
- browser-state update only;
- no engine mutation;
- no report metric mutation unless separately requested.

Acceptance:

- preview and apply are distinct actions;
- apply is blocked on stale context;
- selected layer/report state remains coherent.

## Immediate Next Action

Do not add broader parser intelligence, floor composition, or apply-to-Workbench
behavior before the assistant-wide result-card/envelope contract is landed or
explicitly deferred.

Reason:

- Phase -1 and Phase 0 are now landed for the current described-wall
  calculator-preview surface;
- the first capability registry core is now landed;
- user value is now blocked by two things: first the lack of a unified assistant
  result-card/envelope contract that consumes the registry, then the lack of a
  durable typed layer-stack draft and clarification state;
- broader parser coverage should attach to the draft boundary so assumptions,
  alternatives, unresolved inputs, and future confirmation can be represented
  safely.

Recommended assistant-wide next label:

`report_assistant_result_card_contract_v1`

Recommended layer-composer follow-up label:

`report_assistant_layer_stack_draft_v1`

## Acceptance Criteria For "Assistant Can Use The Calculator"

Minimum acceptable behavior:

1. The report query route has stable auth and mutation-intent tests.
2. User can type a calculator command in the report assistant.
3. The command routes to read-only calculator preview, not patch proposal.
4. The server returns structured `calculatorPreview`.
5. The assistant thread renders parsed stack, outputs, route status, and tasks.
6. The preview is clearly marked non-mutating.
7. Unknown materials and missing inputs produce tasks, not guesses.
8. The assistant can rerun the preview after the user supplies missing inputs.
9. Existing Workbench snapshot preview still works with custom materials.
10. Engine formulas and source rows are untouched.

Higher-quality behavior:

1. User can request common wall stacks in Turkish or English.
2. User can use repeated layer notation.
3. User can ask for up to three alternatives and compare calculator outputs.
4. User can describe explicit double-leaf/framed topology and see it reflected in
   the preview.
5. User can describe a custom material with required properties and get a
   validation task or preview.
6. User can later confirm applying a valid parsed stack to Workbench.

## Test Plan

Phase -1 tests:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-query-route.test.ts \
  --maxWorkers=1
```

Phase 0 tests:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-editor-workflow.test.ts \
  features/workbench/report-assistant-query-route.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts \
  --maxWorkers=1
```

Phase 1 and 2 tests:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts \
  --maxWorkers=1
```

Expected new test groups:

- `assistant layer stack draft validates before calculator preview`;
- `assistant wall parser supports repeated layer notation`;
- `assistant wall parser supports comma-separated Turkish stacks`;
- `assistant wall parser rejects ambiguous material phrases`;
- `assistant topology composer asks for missing double-leaf inputs`;
- `assistant described floor composer returns route-required input tasks`;
- `assistant multi-candidate preview caps candidate count`;
- `assistant calculator preview does not mutate report, Workbench, or engine`.

## Current Verification - 2026-06-17

Command run:

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

- The older query-route preflight failures were fixed by moving route imports out
  of test bodies and making mutation-intent auth setup explicit.
- The expanded targeted assistant suite now passes:
  - `features/workbench/report-assistant-capabilities.test.ts`
  - `features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts`
  - `features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts`
  - `features/workbench-rebuild/workbench-v2-calculator-assistant-ui.test.ts`
  - `features/workbench-rebuild/report-editor-project-context.test.ts`
  - `features/workbench/report-assistant-editor-workflow.test.ts`
  - `features/workbench/report-assistant-request-lifecycle.test.ts`
  - `features/workbench/report-assistant-query-route.test.ts`
  - `features/workbench/report-assistant-runtime-status.test.ts`
- Result: 9 test files passed, 54 tests passed.

Broad assistant checkpoint suite:

- The broader assistant suite covering action proposals, research, project reads,
  patch parsing, request lifecycle, registry, calculator preview, and report
  editor project context passed after stabilizing the action-proposal route test
  harness.
- Result: 26 test files passed, 194 tests passed.

Interpretation:

- The helper, calculator-preview route, and Workbench V2 preview surface confirm
  the non-mutating calculator-use foundation.
- Phase -1 and Phase 0 are now implemented for the report assistant's current
  described-wall calculator-preview surface.
- The capability registry core is now implemented. The next assistant-wide
  capability slice should start from `report_assistant_result_card_contract_v1`;
  the next layer-composer slice remains `report_assistant_layer_stack_draft_v1`.
  Neither should change engine formulas or source rows.

## Current Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Parser guesses material from weak phrase | Wrong calculator input | deterministic aliases, ambiguity returns `needs_input` |
| Assistant presents preview as final certified value | User trust issue | render route status, basis, tasks, preview-only marker |
| Floor text parser guesses missing impact context | Wrong metric basis | floor composer asks route-required inputs |
| Query result arrives after context changed | Stale assistant answer | request lifecycle guard in report editor |
| Candidate comparison runs too many previews | UI/server load | strict candidate cap |
| Apply-to-Workbench mutates wrong draft | Data loss | confirmation plus stale signature guard |
| LLM proposes unvalidated stack | Wrong input | host validation before calculator call |
| Custom material missing acoustic properties | Wrong route | material draft validation and tasks |

## Definition Of Done For This Capability Family

The assistant should be considered "calculator-capable" only when:

- it can take a user-described stack and show a calculator-backed preview in the
  report assistant thread;
- it can explain exactly what layer stack and inputs were used;
- it can ask for missing route-required inputs;
- it can support at least common wall stack phrasing in Turkish and English;
- it never fabricates unsupported calculator outputs;
- it keeps engine code and calculation truth unchanged;
- it has tests proving the no-mutation and no-guessing boundaries.

The current implementation is a good seed. The missing work is productizing the
preview surface and adding a typed layer-composer pipeline around it.
