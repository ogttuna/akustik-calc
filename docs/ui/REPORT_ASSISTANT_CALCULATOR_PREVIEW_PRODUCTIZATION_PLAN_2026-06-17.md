# Report Assistant Calculator Preview Productization Plan - 2026-06-17

## Purpose

This plan defines the next safe assistant-capability slice after the first
described-layer calculator preview landed.

The goal is to make the report assistant's calculator use practical for users
without turning the assistant into a hidden calculator editor. The assistant may
parse a described wall layer configuration, run the existing calculator through
the preview-only route, and present the result clearly. It must not change the
engine, mutate the Workbench stack, retune formulas, import source rows, or
guess missing physical inputs.

## Current Implementation Baseline

Landed locally:

- `preview_workbench_v2_calculator_snapshot`
  in `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`.
  This runs a preview calculation from a valid Workbench V2 snapshot.
- `preview_described_layer_configuration`
  in the same helper. This parses a described wall layer configuration with
  explicit positive `mm` thicknesses, maps conservative material aliases to the
  resolved catalog, builds a temporary Workbench V2 wall snapshot, and reuses
  the snapshot calculator preview path.
- `/api/report-assistant/calculator-preview`.
  The route now accepts either `{ snapshot, targetOutputs? }` or
  `{ description | layerConfiguration, mode?, targetOutputs? }`.
- `answerReportAssistantQuery`.
  The read-only query route detects bounded calculator requests with `mm`
  layer descriptions and calculator/output intent, then returns a calculator
  preview answer with `calculator_preview` evidence.
- Workbench V2 right review panel.
  The panel can manually run the assistant preview against the current browser
  snapshot and displays primary value, layer/output counts, route summary,
  tasks, and output rows.

Pinned behavior:

- `12.5 mm alcipan + 50 mm tasyunu + 100 mm beton` maps to
  `gypsum_board + rockwool + concrete` for wall preview.
- `Rw` and `STC` can be inferred from the instruction and returned as output
  rows.
- Unknown material phrases return `needs_input` tasks instead of nearest-row
  matching.
- Floor/tavan/ceiling descriptions return `needs_input` until a separate floor
  parser captures route-required physical inputs.

## Implementation Audit - 2026-06-17

This plan was checked against the current implementation before execution.

Confirmed implementation facts at audit time:

- `ReportAssistantQuerySuccess` returned only `answer`, `evidence`, `mutates`,
  `ok`, `usedReads`, and `warnings`. It did not carry a
  structured calculator preview payload.
- `/api/report-assistant/query` serialized only those query fields.
  Even when `answerReportAssistantQuery` runs
  `previewDescribedLayerConfiguration`, the route response exposed only the
  rendered text answer.
- `report-editor.tsx` parsed `AssistantQueryPayload` as
  `{ answer?, errors?, ok?, warnings? }` and stores responses as
  `AssistantMessage` objects with only `title`, `detail`, `tone`, and `id`.
  The response thread rendered only plain text.
- `classifyReportAssistantEditorRequest` recognized questions and
  workspace/preset/report terms as `read_only_query`, but it did not explicitly
  recognize calculator-preview wording. A command like
  `Calculatoru kullan: 12.5 mm alcipan + 50 mm tasyunu + 100 mm beton icin Rw ve STC hesapla`
  routed as `patch_proposal` unless the classifier was widened.
- The described-layer parser supported simple plus/semicolon/newline separated
  `thickness + material` segments. It did not support repeated
  layer notation such as `2x12.5 mm`, fully comma-separated layer lists, or
  explicit parser diagnostics in `describedConfiguration.warnings`.
- `report-assistant-request-lifecycle.ts` already provides active-request
  helpers for stale result rejection, and tests covered `read_only_query` as a
  request kind. The report editor assistant submit flow did not use those
  helpers, so delayed query/action/patch responses could still append messages
  after the context moved unless this slice wired the lifecycle in.

Implication:

- The first implementation step must not start in the visual renderer. It must
  first guarantee that calculator-preview instructions reach the read-only
  query route from the editor, then extend the server/query payload shape, and
  only then render structured UI.

## Implementation Progress - 2026-06-17

Landed after this plan was refined:

- Preflight Gate:
  `features/workbench/report-assistant-query-route.test.ts` now avoids cold
  dynamic route import inside the first auth test, has explicit auth setup for
  mutation-intent rejection, and passes by itself and in the combined assistant
  suite.
- Gate 0:
  `classifyReportAssistantEditorRequest` now routes bounded calculator-preview
  commands with explicit `mm` thickness and calculator/metric/layer intent to
  `read_only_query` instead of `patch_proposal`.
- Gate 1:
  calculator-preview query answers now return structured `calculatorPreview`
  data through `answerReportAssistantQuery` and
  `/api/report-assistant/query`, while ordinary query answers remain text-only.
- Gates 2-4:
  `report-editor.tsx` now uses the existing assistant request lifecycle helpers,
  invalidates older assistant requests when a new request starts, guards stale
  results with `assistantContext.assistantContextSignature`, preserves guarded
  calculator preview data in assistant message state, and renders parsed layers,
  output rows, route summary, and tasks in the assistant thread.
- Gate 5:
  the described wall parser now supports repeated layer notation such as
  `2x12.5 mm`, comma-separated layer lists, and material-before-thickness layer
  descriptions while preserving `needs_input` for unknown materials.

Current targeted verification:

```bash
pnpm --filter @dynecho/web exec vitest run \
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

Original productization subset result: 8 test files passed, 48 tests passed.

Checkpoint extension after capability-registry core landed:

- `report-assistant-capabilities.test.ts` is now part of the focused
  calculator-preview/capability verification set.
- The focused set now passes 9 test files / 54 tests.
- The broader assistant checkpoint suite now passes 26 test files / 194 tests.

## Closed Slice And Follow-Up

`report_assistant_calculator_preview_productization_v1` is now closed locally.
The original ordered gates are retained below as historical implementation
evidence.

Remaining follow-up after this closed slice:

1. Move calculator preview from a special-case UI block into the assistant-wide
   result-card/envelope contract. The capability registry core now exists and
   should be consumed by that renderer contract rather than redefined.
2. Add a durable `AssistantLayerStackDraft` for multi-turn stack composition and
   clarification.
3. Keep apply-to-Workbench parked until preview, confirmation, stale-state, and
   selected-child-clearing rules are part of an explicit action proposal.
4. Keep floor/ceiling natural-language composition parked until route-required
   physical inputs can be captured safely.

## Historical Slice Gates

The closed slice had seven ordered gates:

0. Stabilize the report query route preflight failures before adding new
   calculator-preview assertions.
1. Route calculator-preview wording to the read-only query path from the report
   editor classifier.
2. Return structured calculator preview data from the query helper and route.
3. Wire the report editor assistant request lifecycle so stale read/query
   responses cannot append preview messages to a newer context.
4. Preserve the structured payload in report editor assistant message state.
5. Render the structured calculator preview block in the assistant response
   thread.
6. Harden the described wall parser for high-frequency user phrasing while
   preserving `needs_input` on ambiguity.

Do not implement Workbench mutation or floor parser support in this slice.

## Preflight Gate - Query Route Stability

### Original behavior fixed by this slice

The original targeted assistant test run showed two failures in
`features/workbench/report-assistant-query-route.test.ts`:

- `keeps configured mode behind the existing auth guard` times out at 5000 ms;
- `rejects mutation intents before project storage is touched` expects `400` but
  receives `401`.

Those failures were fixed before structured `calculatorPreview` payload work
continued. This remains useful historical evidence because future assistant route
work should keep auth/test harness state explicit before adding new route
assertions.

### Implementation notes

Audit the query route and route tests before Gate 0:

- `apps/web/app/api/report-assistant/query/route.ts` currently resolves owner
  scope before parsing the request and before `answerReportAssistantQuery` can
  reject mutation intent.
- If the desired contract is "authentication always wins", update the mutation
  test expectation to `401` and document that unauthenticated mutation requests
  never reach mutation-intent validation.
- If the desired contract is "syntactic mutation-intent rejection wins for valid
  unauthenticated payloads", move the mutation-intent precheck ahead of owner
  resolution without opening project storage or read access. This is a behavior
  change and should be mirrored consistently with adjacent assistant routes.
- Fix the auth timeout directly. Do not mask it by increasing Vitest timeout.
  Compare the query route mock setup with the calculator-preview and
  project-read route tests, and make sure the first timed-out auth test resets
  `mockAuthState` even on failure.

Recommended default:

- keep auth-first route behavior for configured mode;
- update the mutation-intent route test to set preview-mode auth explicitly or
  split it into two tests: one for unauthenticated auth-first behavior and one
  for authenticated/preview mutation-intent rejection;
- preserve the storage untouched assertion on the mutation-intent rejection path.

### Acceptance criteria

- `features/workbench/report-assistant-query-route.test.ts` passes by itself.
- The same file passes when run together with calculator assistant route tests.
- The configured-mode auth test returns a `401` body immediately and does not
  time out.
- The mutation-intent test has an unambiguous auth setup and proves project
  storage remains untouched.
- No calculator-preview contract changes are mixed into this preflight patch.

## Gate 0 - Calculator Intent Classification

### Current behavior to fix

`classifyReportAssistantEditorRequest` routes read-only questions to
`/api/report-assistant/query`, action wording to
`/api/report-assistant/action-proposal`, and everything else to
`/api/report-assistant/patch`.

Calculator-preview commands are not necessarily phrased as questions. They can
be imperative read-only requests:

```text
Calculatoru kullan: 12.5 mm alcipan + 50 mm tasyunu + 100 mm beton icin Rw ve STC hesapla
```

That must be treated as `read_only_query`, not a patch proposal.

### Implementation notes

Add a deterministic classifier helper, probably aligned with but not importing
`wantsDescribedCalculatorPreview`, that detects:

- at least one explicit positive `mm` thickness;
- calculator/read intent such as `calculator`, `hesapla`, `hesap`, `estimate`,
  `predict`, `Rw`, `STC`, `Dn`, `Dnt`, `Ln`, `IIC`, `AIIC`, `layer`, `stack`,
  `wall`, or `duvar`;
- no mutation intent already captured by `hasActionIntent`.

### Files likely touched

- `apps/web/features/workbench/report-assistant-editor-workflow.ts`
- `apps/web/features/workbench/report-assistant-editor-workflow.test.ts`

### Acceptance criteria

- The example calculator command above returns `read_only_query`.
- Existing save/create/restore/delete wording still returns `action_proposal`.
- Existing report metric edit wording still returns `patch_proposal`.
- Existing workspace questions still return `read_only_query`.

## Gate 1 - Structured Query Contract

### Desired behavior

When the user asks the report assistant:

```text
Calculatoru kullan: 12.5 mm alcipan + 50 mm tasyunu + 100 mm beton icin Rw ve STC hesapla
```

the response should still include a concise text answer, but the route should
also expose structured preview data that the UI can render:

- parsed layer stack;
- calculation status;
- output rows;
- route label/method;
- supported/unsupported counts;
- tasks and `needs_input` details;
- explicit `mutates: false` / `previewOnly: true` posture.

### Candidate contract

Extend `ReportAssistantQuerySuccess` with an optional preview payload:

```ts
calculatorPreview?: {
  mutates: false;
  name: "preview_described_layer_configuration";
  preview: WorkbenchV2CalculatorAssistantPreview;
  previewOnly: true;
};
```

Rules:

- Only include this field for calculator-preview answers.
- Serialize it through `/api/report-assistant/query`.
- Do not include `calculatorPreview` in failure responses unless a later route
  contract explicitly needs partial preview diagnostics.
- Do not include `estimatePayload` in default rendered text if it would make the
  response noisy. The server may keep it in the structured payload because the
  current preview helper already returns it.
- Keep `usedReads: []` for this path unless later project reads are explicitly
  required.
- Keep `evidence` source as `calculator_preview`.
- Keep query route read-only and storage-free.

### Files likely touched

- `apps/web/features/workbench/report-assistant-query.ts`
- `apps/web/app/api/report-assistant/query/route.ts`
- `apps/web/features/workbench/report-assistant-query-route.test.ts`

### Acceptance criteria

- A described calculator query returns `ok: true`, `mutates: false`,
  `usedReads: []`, `evidence.source: calculator_preview`, and structured
  `calculatorPreview`.
- Existing non-calculator query answers remain unchanged and do not include
  `calculatorPreview`.
- For authenticated or preview-mode requests, mutation-intent rejection still
  runs before any calculator preview work.
- The route response remains free of project storage reads and writes for this
  path.

## Gate 2 - Report Editor Request Lifecycle Guard

### Current behavior to change

`sendReportAssistantRequest` returns request metadata with request id, kind,
document signature, and timing. The shared lifecycle helper can reject stale
results, but `handleAssistantRequest` currently calls the request client
directly and appends messages from the result without checking whether a newer
assistant request or document/context signature has superseded it.

Structured calculator previews make this more visible because a stale result
can show an apparently precise parsed stack and output table in the response
thread even after the user changes the report context.

### Implementation notes

Wire the existing lifecycle helpers into `report-editor.tsx` before changing
the preview UI:

- create the active request registry with
  `createReportAssistantActiveRequestRegistry`;
- start a request for each `requestMode` branch before calling
  `sendReportAssistantRequest`;
- pass the generated `requestId` into `sendReportAssistantRequest`;
- after the request returns, call `isReportAssistantRequestResultActive` using
  the current `assistantContext.assistantContextSignature`;
- if inactive, clear loading only if appropriate and skip message/proposal/patch
  state writes;
- finish only the matching active request with `finishReportAssistantRequest`.

Important naming detail:

- `report-assistant-request-client.ts` and
  `report-assistant-request-lifecycle.ts` call the value `documentSignature`;
- for `report-editor.tsx`, pass `assistantContext.assistantContextSignature`
  into that field. Do not pass a report-document-only signature. The assistant
  context includes project/report/assembly state that can change while the
  rendered report document text stays identical.

This can cover all assistant request modes, not just calculator preview,
because the registry already supports `read_only_query`, `action_proposal`, and
`patch_proposal`.

### Files likely touched

- `apps/web/features/workbench-rebuild/report-editor.tsx`
- `apps/web/features/workbench-rebuild/report-editor-project-context.test.ts`
- optionally `apps/web/features/workbench/report-assistant-request-lifecycle.test.ts`
  if new helper behavior is needed

### Acceptance criteria

- Delayed results from older `read_only_query` requests do not append assistant
  messages.
- Delayed results from older `patch_proposal` and `action_proposal` requests do
  not set validation or action preview state.
- The active request guard uses `assistantContext.assistantContextSignature`,
  not only `documentSignature`, because project/report context can change while
  the report document stays textually identical.
- Existing request timeout/retry behavior from `sendReportAssistantRequest`
  remains unchanged.
- If an inactive request finishes after a newer request has started, it must not
  call `setIsAssistantLoading(false)` in a way that hides the newer in-flight
  state.

## Gate 3 - Report Editor Payload And Message State

### Current behavior to change

`report-editor.tsx` currently drops every query payload field except `answer`.
To render structured calculator output, it needs to preserve the optional
`calculatorPreview` payload in assistant message state.

### Implementation notes

Extend the local query payload and message model conservatively:

```ts
type AssistantQueryPayload = {
  answer?: unknown;
  calculatorPreview?: unknown;
  errors?: unknown;
  ok?: unknown;
  warnings?: unknown;
};

type AssistantMessage = {
  calculatorPreview?: WorkbenchV2CalculatorAssistantPreview;
  detail: string;
  id: string;
  tone: "error" | "neutral" | "success" | "warning";
  title: string;
};
```

Add a parser/guard function for the query payload preview instead of trusting
raw JSON in JSX. The guard can be narrow: accept only the fields the renderer
needs, or reuse the helper type carefully as display-only data.

Guarding rule:

- if `calculatorPreview.previewOnly !== true` or
  `calculatorPreview.mutates !== false`, drop the preview payload and keep the
  text answer only;
- if `calculatorPreview.name` is not
  `preview_described_layer_configuration`, drop it in this slice;
- never render `estimatePayload` directly in the assistant thread. It may remain
  in the structured payload for debugging/tests, but the user-facing preview
  should render parsed layers, output rows, engine summary, and tasks only.

### Files likely touched

- `apps/web/features/workbench-rebuild/report-editor.tsx`
- source-level or component tests for the report editor assistant flow

### Acceptance criteria

- Calculator-preview query responses create an assistant message that keeps the
  text answer and the parsed preview payload.
- Non-calculator query messages keep the current text-only behavior.
- Error messages never try to render calculator preview blocks.
- The message state remains local to the report editor and does not mutate the
  report document.

## Gate 4 - Structured UI Rendering

### UI rendering target

Add a calculator-preview message block in the report assistant response thread
using the same information model as the Workbench V2 assistant preview:

- summary row: primary value, primary output/status, layer count, output count;
- parsed stack row list when `describedConfiguration.layers` is present;
- route summary when `engineSummary` is present;
- task list for `needs_input`;
- output rows with `live`, `pending`, `needs_input`, and `unsupported`
  statuses.

Use existing CSS patterns where safe:

- `.calc-assistant-preview-summary`
- `.calc-assistant-route-summary`
- `.calc-output-row`
- `.calc-task-row`

If those classes cause spacing or nested-panel issues inside
`.report-assistant-message`, add assistant-local classes that mirror the same
density and status colors.

### Files likely touched

- `apps/web/features/workbench-rebuild/report-editor.tsx`
- `apps/web/app/globals.css`
- report editor assistant rendering tests

### Acceptance criteria

- The UI renders structured calculator preview data without requiring a
  Workbench stack mutation.
- `needs_input` tasks are visible and distinguish calculator-route tasks from
  described-layer parse tasks.
- Text does not overflow compact assistant-thread cards.
- The block clearly reads as preview/read-only, not as the active/saved
  Workbench stack.

## Gate 5 - Described Wall Parser Hardening

### Goal

Harden the described wall parser for high-frequency user phrasing while
preserving `needs_input` on ambiguity.

### Supported new phrasing

Add deterministic support for:

- repeated layers:
  - `2x12.5 mm gypsum board`
  - `2 x 12,5 mm alcipan`
- compact comma-separated layer lists:
  - `12.5 mm gypsum board, 50 mm rockwool, 100 mm concrete`
- reversed material/thickness order where unambiguous:
  - `gypsum board 12.5 mm + rockwool 50 mm + concrete 100 mm`
- common Turkish ASCII aliases:
  - `alcipan`
  - `tas yunu`
  - `tasyunu`
  - `beton`
  - `gazbeton`
  - `tugla`
- common board variants already represented in the catalog alias table:
  - acoustic gypsum board
  - cement board
  - OSB
  - plywood

### Parser rules

- Require explicit positive millimeter thickness for every parsed layer.
- Expand repeated layers into separate physical layers unless the engine route
  has an existing owned way to represent count without changing layer sequence.
- Preserve order from the user's description.
- Do not infer missing cavity depth, support topology, resilient bars, field
  context, or floor-impact inputs from vague phrasing.
- If two catalog aliases match with equal specificity, return `needs_input`
  instead of choosing one.
- If the material phrase is unknown, return a task that quotes the phrase and
  asks for a catalog material or custom material.
- Do not introduce fuzzy string distance matching in this slice. Fuzzy matching
  is too easy to turn into accidental source-family aliasing.

### Files likely touched

- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts`
- `apps/web/features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts`
- `apps/web/features/workbench/report-assistant-query-route.test.ts`

### Acceptance criteria

- `2x12.5 mm alcipan + 50 mm tasyunu + 100 mm beton` parses to four layers:
  two gypsum board layers, one rock wool layer, one concrete layer.
- Comma-separated descriptions parse the same as plus-separated descriptions.
- Reversed material/thickness descriptions parse the same when every segment has
  exactly one material and one `mm` thickness.
- Unknown or ambiguous material phrases return `needs_input`.
- Existing simple described-wall calculator tests keep passing.

## Implementation Contract Map

Use this map while implementing to avoid editing the wrong layer:

| Layer | Current owner | Planned change |
| --- | --- | --- |
| Editor request classification | `classifyReportAssistantEditorRequest` in `apps/web/features/workbench/report-assistant-editor-workflow.ts` | Add calculator-preview detection before falling through to patch proposals |
| Server query result type | `ReportAssistantQuerySuccess` and `querySuccess` in `apps/web/features/workbench/report-assistant-query.ts` | Add optional `calculatorPreview` only for described calculator preview answers |
| Query route serialization | `/api/report-assistant/query/route.ts` | Pass through `result.calculatorPreview` on successful responses |
| Request transport | `sendReportAssistantRequest` in `report-assistant-request-client.ts` | No contract change needed; it already preserves arbitrary parsed JSON payloads |
| Stale request guard | `report-assistant-request-lifecycle.ts` | Reuse existing registry helpers inside `report-editor.tsx`; do not create a parallel lifecycle |
| Editor query payload parser | `AssistantQueryPayload`, `getAssistantQueryAnswer`, and future preview guard in `report-editor.tsx` | Add a guarded `calculatorPreview` parser and keep text-only behavior for ordinary answers |
| Editor message state | `AssistantMessage` in `report-editor.tsx` | Add optional display-only calculator preview data |
| Assistant response UI | `.report-assistant-thread` rendering in `report-editor.tsx` and related CSS in `globals.css` | Render compact structured preview only when the message has parsed preview data |
| Calculator preview helper | `previewDescribedLayerConfiguration` in `workbench-v2-calculator-assistant.ts` | Parser hardening only; no calculator formula or engine changes |

Do not move calculator execution into `report-editor.tsx`. Browser/editor code
should render data returned by the route; calculator execution remains in the
server/helper path.

## Stepwise Patch Order

Recommended implementation order:

1. Run and fix the Preflight Gate until `report-assistant-query-route.test.ts`
   is green alone and in the targeted combined suite.
2. Add classifier tests for calculator-preview commands and implement Gate 0.
3. Add query-route tests that assert `calculatorPreview` is present for
   calculator answers and absent for non-calculator answers; implement Gate 1.
4. Wire request lifecycle helpers into `handleAssistantRequest`; update
   source-level tests to prove stale guards are present for query, action, and
   patch branches.
5. Extend `AssistantQueryPayload` and `AssistantMessage` with a guarded preview
   parser; keep renderer unchanged until the state is pinned.
6. Add the structured renderer and CSS. Source-level tests are acceptable for
   the first pass if full DOM tests are too expensive, but they must assert the
   preview block is connected to `message.calculatorPreview` and not to patch or
   action proposal state.
7. Harden parser inputs with focused helper tests, then route/query tests.
8. Run the targeted suite and ESLint.

This order prevents the most likely failure mode: building a nice UI block that
never appears because the editor classifier sent the request to the patch route.

## Parked Slice - Floor/Tavan Description Parsing

Do not implement this in the next slice.

Floor and ceiling calculator previews need route-owned physical context beyond
layer sequence. A future floor parser must define how it captures or requests:

- `loadBasisKgM2`;
- `resilientLayerDynamicStiffnessMNm3`;
- `impactFieldContext.fieldKDb`;
- impact receiving-room volume;
- `ciDb`;
- `ci50_2500Db`;
- exact ASTM/ISO metric basis;
- floor roles such as structural/floating/resilient/finish where applicable.

Until then, floor/tavan/ceiling descriptions should keep returning
`needs_input` and point the user to Workbench V2 snapshot context.

## Parked Slice - Apply Described Stack To Workbench

Do not implement this in the next slice.

Applying a described stack to Workbench is a mutating browser-state action. It
needs a separate preview-confirm contract with these rules:

- show the parsed stack before applying;
- show which current stack/project child context would be replaced or cleared;
- require explicit user confirmation;
- guard against stale preview ids;
- call the existing calculator component restore/clear/update functions rather
  than duplicating Workbench state logic;
- clear selected assembly/report children where existing Workbench restore and
  preset-apply flows already require that behavior;
- never apply from the read-only report assistant query route.

## Risks And Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Parser over-matches unknown materials | Wrong calculator answer | Alias-only deterministic matching; ambiguity returns `needs_input` |
| Calculator command routes to patch proposal | User gets irrelevant patch flow or model tries report edit | Gate 0 classifier test before UI work |
| Stale query result appends a preview after context changes | Misleading calculator answer in report thread | Reuse `report-assistant-request-lifecycle` registry in `report-editor.tsx` before rendering structured preview |
| UI implies stack was changed | User trusts a preview as saved state | Always label assistant calculator answers as preview/read-only and show `mutates: false` posture in copy/state |
| Query route becomes a hidden tool loop | Hard-to-audit behavior | Keep the calculator path deterministic and local; no model-selected tool execution in this slice |
| Floor inputs are guessed | Metric/basis drift | Keep floor descriptions parked as `needs_input` |
| Structured payload leaks noisy internals | Poor UX or confusing answers | Render only parsed stack, rows, route summary, and tasks by default |
| Existing report patch flow regresses | Assistant editing instability | Keep calculator preview separate from `ReportAssistantPatch` operations |

## Validation Plan

Run targeted tests while implementing:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-editor-workflow.test.ts \
  features/workbench/report-assistant-request-lifecycle.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts \
  features/workbench/report-assistant-query-route.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts
```

Run the query route preflight separately before adding new assertions:

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/report-assistant-query-route.test.ts \
  --maxWorkers=1
```

Add or update report editor tests when Gates 2-3 land. At minimum, pin that a
calculator-preview query response:

- is routed through the read-only query mode from the editor classifier;
- preserves `calculatorPreview` in assistant message state;
- renders parsed layers, route summary, output rows, and tasks;
- does not set `assistantValidation` or `assistantActionProposal`;
- does not mutate the report document.

Run ESLint for touched files:

```bash
pnpm exec eslint \
  app/api/report-assistant/query/route.ts \
  app/api/report-assistant/calculator-preview/route.ts \
  features/workbench/report-assistant-editor-workflow.ts \
  features/workbench/report-assistant-editor-workflow.test.ts \
  features/workbench/report-assistant-request-lifecycle.ts \
  features/workbench/report-assistant-request-lifecycle.test.ts \
  features/workbench-rebuild/report-editor-project-context.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant.test.ts \
  features/workbench-rebuild/workbench-v2-calculator-assistant-route.test.ts \
  features/workbench-rebuild/report-editor.tsx \
  features/workbench/report-assistant-query.ts \
  features/workbench/report-assistant-query-route.test.ts \
  features/workbench/report-assistant-runtime-status.test.ts
```

Run `git diff --check` before handoff.

`pnpm --filter @dynecho/web typecheck` is still useful, but at the time this
plan was written it failed on existing unrelated fixture/type issues:

- `exactImpactSource` in layer-combination resolver parity tests;
- `PresetId` string arguments in floor companion tests;
- `OutputCardModel` posture fields in field A-weighted surface tests;
- missing citation `tone` in report assistant patch fixtures.

Report whether those remain unrelated if typecheck is rerun.

## Done Definition

The next slice is done when:

- calculator-preview commands from the report editor classify as
  `read_only_query`;
- report assistant calculator queries return both text and structured preview
  data;
- stale assistant request results cannot append messages or set validation/action
  preview state after the assistant context changes;
- the report editor preserves the structured preview payload in assistant
  message state without creating a patch validation or action proposal;
- the report assistant UI renders parsed stack, output rows, route summary, and
  tasks from that structured data;
- parser hardening covers repeated layers, comma-separated lists, reversed
  material/thickness order, and the listed aliases;
- all ambiguity and unknown-material cases return `needs_input`;
- no calculator engine behavior, formula, source row, Workbench mutation, export
  builder, or project storage mutation is changed.
