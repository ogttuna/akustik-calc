# Checkpoint - Wall Timber Lightweight Source Corpus Closeout Handoff

Date: 2026-04-23

## What Closed

`wall_timber_lightweight_source_corpus_v1` is now closed.

Landed within the slice:

- typed corpus:
  `packages/engine/src/wall-timber-lightweight-source-corpus.ts`
- corpus contract:
  `packages/engine/src/wall-timber-lightweight-source-corpus-contract.test.ts`
- executable source audit:
  `packages/engine/src/wall-timber-lightweight-source-audit.test.ts`
- direct-timber exact import landing:
  `packages/engine/src/airborne-verified-catalog.ts`
- exact catalog route guard:
  `packages/engine/src/airborne-verified-catalog.test.ts`
- user-visible exact card surface:
  `apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts`

## Closeout Result

- 2 direct timber rows are now `exact_import_landed`
- 5 resilient/proprietary timber rows remain benchmark-only for named
  reasons
- 2 lightweight steel companions remain holdout-only
- the live `timber_stud_wall` preset still does not exact-match either
  landed direct row, so its dynamic low-confidence route stays
  unchanged

## Validation

- targeted engine tests green
- targeted web tests green
- `pnpm calculator:gate:current` green before closeout
- broad `pnpm check` green after Gate C:
  - engine: `206 / 206` files, `1169 / 1169` tests
  - web: `145 / 145` files, `837 / 837` passed, `18` skipped
  - build green
- `git diff --check` clean
- known non-fatal `sharp/@img` optional warnings still appear during
  web build through `@turbodocx/html-to-docx`

## Next Selected Slice

`wall_resilient_bar_side_count_modeling_v1`

Planning surface:

- `docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md`

## Why This Is Next

- the current source corpus already contains four official timber rows
  whose main remaining blocker is explicit one-side vs both-sides
  resilient-bar modeling
- current wall context can express `connectionType` and `studType`, but
  not resilient-bar side count
- that missing input/model dimension is a higher-ROI common-wall gap
  than speculating on the direct double-board timber formula lane
- it can broaden common wall coverage with source-backed answers while
  keeping blocked-source floor families fail-closed

## Do Not Drift

- do not let the live double-board timber preset inherit direct-timber
  exact rows by adjacency alone
- do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web impact, or
  wall-selector widening from nearby green tests
- do not promote resilient timber rows to exact before side-count
  modeling is explicit and tested

## First Action On Resume

Author Gate A of `wall_resilient_bar_side_count_modeling_v1`:

- pin the current side-count-blind engine/workbench posture with
  no-runtime tests,
- define the input/model contract for resilient-bar side count,
- only then decide whether any current benchmark-only timber rows can
  move to exact or narrower benchmark lanes.
