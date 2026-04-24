# Slice Plan - Wall Resilient Bar Side Count Modeling v1

Status: ACTIVE (selected 2026-04-23 after `wall_timber_lightweight_source_corpus_v1` closed; Gate A landed 2026-04-24, Gate B next)

## Objective

Increase accuracy and defensible coverage for common resilient framed
wall systems by modeling the missing one-side vs both-sides resilient
bar dimension before any new exact or benchmark promotion.

This slice exists because the current source corpus already contains
official timber rows that are blocked primarily by one missing input:
resilient-bar side count.

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

Add the missing resilient-bar side-count dimension explicitly:

- extend the relevant shared wall context/input model,
- wire the workbench state and input surface,
- keep old default behavior stable when the new field is unset,
- add targeted tests for store/context propagation and route selection.

### Gate C - exact/benchmark promotion decision

For every current resilient timber row, choose one honest posture:

- promote to exact if topology is now fully representable,
- tighten to a narrower benchmark lane if still not exact,
- keep blocked if proprietary board mapping still prevents honest
  promotion.

Any user-visible value change must be pinned through engine and web
VALUE tests in the same gate.

## Initial Candidate Rows

- `knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026`
- `knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026`
- `british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026`
- `british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`

## Validation

Minimum validation for the slice:

- targeted side-count contract/audit tests,
- `pnpm calculator:gate:current`,
- `git diff --check`.

If Gate B or Gate C changes any user-visible route, output card, or
runtime value, also run:

- the affected engine audits,
- the affected workbench route/card matrices,
- `pnpm check`.

## Completion Criteria

- resilient-bar side count is an explicit modeled dimension, not an
  implicit guess,
- current source-backed timber rows state clearly which are exact,
  narrower benchmark, or still blocked,
- user-visible route/card behavior for promoted resilient timber rows is
  executable and pinned,
- the live direct double-board timber preset remains honest if it still
  lacks a true exact row.
