# Slice Plan - Wall Resilient Bar Side Count Modeling v1

Status: ACTIVE (selected 2026-04-23 after `wall_timber_lightweight_source_corpus_v1` closed; Gate A landed 2026-04-24, Gate B next)

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

- the active shared/workbench surfaces still expose `connectionType`,
  `studType`, and `studSpacingMm`, but not resilient-bar side count,
- Knauf GB still publishes EN-TP-RB1 `Rw 56 dB` vs EN-TP-RB2 `Rw 59 dB`
  on the same timber family,
- British Gypsum still publishes A046005 `Rw 55 dB` vs A046006 `Rw 58 dB`
  on the same one-side vs both-sides family split.

So the bottleneck is not missing evidence and not formula-family scope.
It is one missing modeled dimension.

## Current Baseline

- `wall_timber_lightweight_source_corpus_v1` is closed.
- 2 direct timber rows are exact imports.
- 5 resilient/proprietary timber rows remain benchmark-only.
- 4 of those rows are blocked specifically by
  `resilient_bar_side_count_not_explicitly_modeled`.
- Current wall context exposes:
  - `connectionType`
  - `studType`
  - `studSpacingMm`
  - but not resilient-bar side count.
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
  proves the shared schema/store remain side-count-blind and strip any
  unmodeled `resilientBarSideCount` field.

Outcome:

- current blind spot is now executable, not anecdotal,
- no runtime or UI behavior change landed in Gate A,
- the next honest move is Gate B explicit input/model plumbing.

### Gate B - input/model plumbing

Status: NEXT.

Add the missing resilient-bar side-count dimension explicitly.

#### Gate B design contract

Use the same explicit-enum style already used by the nearby wall context
fields.

Preferred shape:

- shared enum posture: `auto | one_side | both_sides`
- legacy-safe behavior:
  - omitted / `auto` => current side-count-blind route stays active
  - explicit `one_side` or `both_sides` => route selection is allowed to
    distinguish the source-backed lane

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
4. `apps/web/features/workbench/workbench-shell.tsx`
   - pass the field into the live airborne context used by
     `evaluateScenario`
5. `apps/web/features/workbench/simple-workbench-shell.tsx`
   - pass the field through the guided/simple shell path as well
6. `apps/web/features/workbench/simple-workbench-route-panel.tsx`
   - add the explicit control only in the framed-wall context area where
     the related wall route inputs already live

#### Gate B acceptance tests

At minimum, Gate B must land with:

1. shared-schema parse contract
   - the field is now recognized instead of stripped
   - unknown values still fail closed
2. workbench store persistence contract
   - state + setter exist
   - snapshot save/load round-trips the field
   - reset/default posture is stable
3. preset propagation contract
   - existing presets keep current behavior when the new field is absent
   - any future explicit resilient preset can carry the field end-to-end
4. shell propagation contract
   - both workbench shells pass the field into the runtime context
5. route/card regression contract
   - `auto` preserves the current blind behavior
   - explicit side-count values are observable in the selected route if
     the route changes in Gate B

#### Gate B stop condition

Stop Gate B once explicit side-count data can reach the runtime
honestly. Do not retune values inside Gate B unless the propagation work
itself makes a route/value change unavoidable and fully pinned.

### Gate C - exact/benchmark promotion decision

Status: BLOCKED ON GATE B.

For every current resilient timber row, choose one honest posture:

- promote to exact if topology is now fully representable,
- tighten to a narrower benchmark lane if still not exact,
- keep blocked if proprietary board mapping still prevents honest
  promotion.

Any user-visible value change must be pinned through engine and web
VALUE tests in the same gate.

Gate C execution order:

1. review the four current RB1/RB2 timber rows against the landed
   side-count model,
2. prove whether board mapping + topology are exact-representable,
3. only then change classification or runtime route/value behavior,
4. pin every user-visible value change in both engine and web tests.

## Initial Candidate Rows

- `knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026`
- `knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026`
- `british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026`
- `british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`

## Immediate Next Steps

1. Run Gate B shared-schema/store/shell plumbing with a legacy-stable
   `auto` posture.
2. Add the explicit workbench control in the existing framed-wall route
   context UI.
3. Prove end-to-end propagation in focused tests.
4. Re-run `pnpm calculator:gate:current`.
5. If Gate B stays green, start Gate C on the four current RB1/RB2
   timber rows only.

## Validation

Minimum validation for the slice:

- run `pnpm calculator:gate:current` before and after touching the
  slice,
- keep the targeted side-count contract/audit tests green,
- `git diff --check`.

If Gate B or Gate C changes any user-visible route, output card, or
runtime value, also run:

- the affected engine audits,
- the affected workbench route/card matrices,
- `pnpm check`.

## Completion Criteria

- resilient-bar side count is an explicit modeled dimension, not an
  implicit guess,
- legacy `auto` / unset behavior stays honest and executable,
- current source-backed timber rows state clearly which are exact,
  narrower benchmark, or still blocked,
- user-visible route/card behavior for promoted resilient timber rows is
  executable and pinned,
- the live direct double-board timber preset remains honest if it still
  lacks a true exact row.
