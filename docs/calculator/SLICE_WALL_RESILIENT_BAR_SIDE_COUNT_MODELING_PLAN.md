# Slice Plan - Wall Resilient Bar Side Count Modeling v1

Status: CLOSED (selected 2026-04-23 after `wall_timber_lightweight_source_corpus_v1` closed; Gate A, Gate B, and Gate C landed 2026-04-24)

## Objective

Increase accuracy and defensible coverage for common resilient framed
wall systems by modeling the missing one-side vs both-sides resilient
bar dimension before any new exact or benchmark promotion.

This slice exists because the current source corpus already contains
official timber rows that are blocked primarily by one missing modeled
input: resilient-bar side count.

## Non-Goals

- Do not retune the live `timber_stud_wall` direct double-board formula
  lane in Gate A.
- Do not infer resilient-bar side count from nearby green tests or row
  adjacency.
- Do not promote proprietary-board rows to exact unless the board
  mapping is truly representable.
- Do not reopen blocked-source floor families.

## Why This Slice Is High ROI

It targets common lightweight wall questions that users are likely to
ask:

- timber stud partitions with resilient bar on one side,
- timber stud partitions with resilient bar on both sides,
- nearby resilient framed systems whose current answers are source-backed
  but still too coarse because side count is invisible.

The source rows already exist in-repo. The missing piece is explicit
model/input support, not more speculative formula work.

The planning refresh on `2026-04-24` rechecked both implementation and
official-source evidence and did not surface a better next move:

- the shared/workbench surfaces exposed `connectionType`, `studType`, and
  `studSpacingMm`, but not resilient-bar side count before Gate B,
- Knauf GB still publishes EN-TP-RB1 `Rw 56 dB` vs EN-TP-RB2 `Rw 59 dB`
  on the same timber family,
- British Gypsum still publishes A046005 `Rw 55 dB` vs A046006 `Rw 58 dB`
  on the same one-side vs both-sides family split.

So the bottleneck is not missing evidence and not formula-family scope.
It is one missing modeled dimension.

## External Research Decision

No internet research was required before Gate B. Gate B did not decide new
source truth; it only made an already source-backed input dimension explicit
in schema, state, persistence, UI, and runtime context plumbing. At that
point the repo corpus already named the four official RB1/RB2 rows, source
URLs, source notes, expected `Rw` values, and the blocking reason
`resilient_bar_side_count_not_explicitly_modeled`.

Gate C used the already-captured official manufacturer rows in the corpus:
Knauf GB EN-TP-RB1/RB2 and British Gypsum A046005/A046006. No broad
formula retune or adjacent-row inference was used.

## Current Baseline

- `wall_timber_lightweight_source_corpus_v1` is closed.
- 2 direct timber rows are exact imports.
- 4 resilient RB1/RB2 timber rows are now exact imports when explicit
  `resilientBarSideCount` matches the source topology.
- 1 proprietary FireLine timber row remains benchmark-only because exact
  board mapping is still not represented.
- Current wall context exposes:
  - `connectionType`
  - `studType`
  - `studSpacingMm`
  - `resilientBarSideCount` with `auto | one_side | both_sides`
    (Gate B landed with legacy-stable `auto`).
- The live direct double-board `timber_stud_wall` preset remains on the
  dynamic low-confidence route and is not the immediate target of this
  slice.

## Gate Plan

### Gate A - no-runtime side-count audit

Status: LANDED (2026-04-24, no runtime change).

Delivered:

- `packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts`
  pins the current engine side-count-blind posture for the four
  official RB1/RB2 timber rows and proves each pair still collapses to
  identical outputs despite a published 3 dB `Rw` delta.
- `apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts`
  pins the current workbench route/card surface for those same rows
  across lab, field, and building contexts.
- `apps/web/features/workbench/wall-resilient-bar-side-count-input-contract.test.ts`
  originally proved the shared schema/store were side-count-blind; after
  Gate B the same contract now proves schema recognition, invalid-value
  rejection, store round-trip, and legacy snapshot defaulting.

Outcome:

- current blind spot is now executable, not anecdotal,
- no runtime or UI behavior change landed in Gate A,
- the next honest move is Gate B explicit input/model plumbing.

### Gate B - input/model plumbing

Status: LANDED (2026-04-24, propagation only; no exact promotion or value
retune).

Gate B added the missing resilient-bar side-count dimension explicitly and
kept `auto` legacy-stable.

#### Gate B implementation reconciliation - 2026-04-24

Gate B is now implemented:

- `packages/shared/src/domain/airborne-context.ts` defines
  `AirborneResilientBarSideCountSchema` and accepts
  `resilientBarSideCount?: "auto" | "one_side" | "both_sides"`.
- `apps/web/features/workbench/workbench-store.ts` adds
  `airborneResilientBarSideCount`, its setter, scenario save/load
  persistence, preset-default plumbing, and legacy snapshot fallback to
  `auto`.
- `apps/web/features/workbench/server-project-workbench-snapshot.ts`
  preserves valid side-count values, drops invalid side-count payloads before
  store restore, and keeps legacy omitted snapshots restorable.
- `apps/web/features/workbench/workbench-shell.tsx` and
  `apps/web/features/workbench/simple-workbench-shell.tsx` pass the field into
  live runtime contexts; the full shell also carries it through saved-scenario
  evaluation and the simple shell includes it in server project snapshots.
- `apps/web/features/workbench/airborne-context-panel.tsx` and
  `apps/web/features/workbench/simple-workbench-route-panel.tsx` expose the
  same `Auto / One side / Both sides` framed-wall control.
- `packages/engine/src/dynamic-airborne-family-detection.ts` normalizes the
  hint while deliberately not treating side-count alone as a framing-family
  trigger.
- `packages/engine/src/airborne-verified-catalog.ts` can now discriminate
  future exact/companion entries that include side-count metadata, while
  existing entries without the field keep legacy matching behavior.

The active slice remained open for Gate C after Gate B; Gate C has now
closed the slice.

#### Gate B design contract

Use the same explicit-enum style already used by the nearby wall context
fields.

Preferred shape:

- shared enum posture: `auto | one_side | both_sides`
- legacy-safe behavior:
  - omitted / `auto` => current side-count-blind route stays active
  - explicit `one_side` or `both_sides` => value-stable propagation only
    in Gate B; source-backed route/value discrimination is a Gate C decision

#### Gate B write scope

These files currently carry the relevant wall-context path and should
move together:

1. `packages/shared/src/domain/airborne-context.ts`
   - add the new enum/schema/type export
   - keep parse behavior backward-compatible
2. `apps/web/features/workbench/workbench-store.ts`
   - add state, setter, scenario snapshot persistence, preset loading,
     and reset/default handling
3. `apps/web/features/workbench/preset-definitions.ts`
   - extend `PresetAirborneDefaults`
   - keep current presets unchanged unless a preset truly owns explicit
     side-count semantics
4. `apps/web/features/workbench/server-project-workbench-snapshot.ts`
   - keep server-backed snapshot parsing backward-compatible for saved
     snapshots that omit the new field
   - prove build/parse round-trip keeps the field when present
5. `apps/web/features/workbench/workbench-shell.tsx`
   - pass the field into the live airborne context used by
     `evaluateScenario`
   - pass it into saved-scenario evaluation as well as the current scenario
6. `apps/web/features/workbench/simple-workbench-shell.tsx`
   - pass the field through the guided/simple shell path as well
   - include it in the server project snapshot builder
7. `apps/web/features/workbench/airborne-context-panel.tsx`
   - add the full-workbench framed-wall metadata control next to
     connection type, stud type, and stud spacing
8. `apps/web/features/workbench/simple-workbench-route-panel.tsx`
   - add the guided/simple control in the same framed-wall context area
     where the related wall route inputs already live
9. `packages/engine/src/dynamic-airborne-family-detection.ts`
   - carry the normalized side-count hint without changing current
     `auto`/omitted route behavior
10. `packages/engine/src/airborne-verified-catalog.ts`
   - make exact/companion catalog matching capable of discriminating
     explicit side-count metadata later, while existing rows without the
     field keep legacy matching behavior
11. `packages/shared/src/api/estimate.ts`
   - no bespoke route code should be needed because the estimate request
     already uses `AirborneContextSchema`, but Gate B must verify that API
     payload parsing accepts the new field and rejects invalid values

#### Gate B acceptance tests

Gate B landed with:

1. shared-schema parse contract
   - the field is now recognized instead of stripped
   - unknown values still fail closed
2. workbench store persistence contract
   - state + setter exist
   - snapshot save/load round-trips the field
   - reset/default posture is stable
3. server project snapshot contract
   - legacy snapshots that omit the field still parse/load as `auto`
   - snapshots that include the field preserve it through build/parse/load
4. preset propagation contract
   - existing presets keep current behavior when the new field is absent
   - any future explicit resilient preset can carry the field end-to-end
5. shell propagation contract
   - both workbench shells pass the field into the runtime context
   - saved-scenario evaluation and current-scenario evaluation agree
6. engine propagation contract
   - parsed runtime context can carry `auto`, `one_side`, and `both_sides`
   - `auto` / omitted remains equivalent to the current blind route
   - explicit values do not retune any value in Gate B unless that
     unavoidable change is fully pinned
7. UI propagation contract
   - both framed-wall UI surfaces expose the same enum options
   - the control defaults to `auto` and participates in store setters
8. route/card regression contract
   - `auto` preserves the current blind behavior
   - explicit side-count values are observable in the selected route if
     the route changes in Gate B

#### Gate B stop condition

Met. Explicit side-count data now reaches schema, store, persistence, UI,
shell context, and engine metadata honestly. Gate B did not retune runtime
values.

### Gate C - exact/benchmark promotion decision

Status: LANDED (2026-04-24).

For every current resilient timber row, choose one honest posture:

- promote to exact if topology is now fully representable,
- tighten to a narrower benchmark lane if still not exact,
- keep blocked if proprietary board mapping still prevents honest
  promotion.

Any user-visible value change must be pinned through engine and web
VALUE tests in the same gate.

Gate C result:

- the four official RB1/RB2 timber rows were promoted to
  `exact_import_landed`,
- their reason code is now
  `resilient_bar_side_count_topology_exactly_representable`,
- `auto` remains legacy-stable and side-count-blind,
- explicit `one_side` / `both_sides` now select the matching source-backed
  exact lab anchor,
- field/building contexts use the existing curated lab-fallback path and
  preserve apparent-rating guardrails,
- the proprietary FireLine timber row remains `secondary_benchmark`.

Pinned source-backed explicit values:

| Row | Side count | Lab Rw | Field R'w | Building DnT,w |
|---|---:|---:|---:|---:|
| Knauf EN-TP-RB1 | one side | 56 | 50 | 52 |
| Knauf EN-TP-RB2 | both sides | 59 | 53 | 55 |
| British Gypsum A046005 | one side | 55 | 50 | 51 |
| British Gypsum A046006 | both sides | 58 | 53 | 54 |

## Initial Candidate Rows

- `knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026`
- `knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026`
- `british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026`
- `british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`

## Closeout

This slice is closed. The next selected calculator slice is
`floor_field_continuation_expansion_v1`, documented in
[SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md](./SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md).

## Validation

Minimum validation for the slice:

- run `pnpm calculator:gate:current` before and after touching the
  slice,
- keep the targeted side-count contract/audit tests green,
- `git diff --check`.

Latest post-Gate-C closeout validation on `2026-04-24`:

- `pnpm calculator:gate:current`
- engine focused gate: 77 files / 369 tests
- web focused gate: 33 files / 166 passed + 18 skipped
- build: 5/5 tasks
- whitespace guard: clean
- broad `pnpm check`: green (engine 210 files / 1189 tests; web 147
  files / 860 passed + 18 skipped; build green with known non-fatal
  `sharp/@img` warnings)

If Gate B or Gate C changes any user-visible route, output card, or
runtime value, also run:

- the affected engine audits,
- the affected workbench route/card matrices,
- `pnpm check`.

## Completion Criteria

- resilient-bar side count is an explicit modeled dimension, not an
  implicit guess,
- legacy `auto` / unset behavior stays honest and executable,
- current source-backed timber rows state clearly which are exact or still
  benchmark-only,
- user-visible route/card behavior for promoted resilient timber rows is
  executable and pinned,
- the live direct double-board timber preset remains honest if it still
  lacks a true exact row.
