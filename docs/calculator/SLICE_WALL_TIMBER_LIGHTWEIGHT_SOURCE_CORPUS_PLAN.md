# Slice Plan - Wall Timber Lightweight Source Corpus v1

Status: CLOSED (opened 2026-04-23 after `wall_formula_family_widening_v1` closed honestly no-runtime; Gate A, Gate B, and Gate C landed 2026-04-23; closeout recorded after broad green revalidation)

## Objective

Increase accuracy and defensible coverage for common lightweight wall
systems by building a source-backed timber/lightweight wall corpus
before any further runtime widening.

This slice exists because the previous timber-stud runtime review
proved two things at once:

- the live dynamic timber route is already user-visible and cannot be
  ignored,
- the current sources are still too broad to justify a precise runtime
  trim on that route.

So the next honest move is source-corpus work, not formula guessing.

## Non-Goals

- Do not change runtime wall values in Gate A.
- Do not tighten timber dynamic confidence from `low` without new row
  evidence.
- Do not reopen blocked-source floor families.
- Do not downgrade exact/catalog precedence anywhere on wall or floor.

## Why This Slice Is High ROI

It targets the wall systems users are most likely to ask about:

- direct timber stud partitions,
- timber stud partitions with one-side or two-side resilient bars,
- nearby lightweight framed rows that can anchor future exact or
  benchmark-backed wall expansion.

That is more aligned with the calculator mission than reopening a
formula lane without a defensible corpus.

## Current Baseline

- `wall_formula_family_widening_v1` is closed.
- The live timber preset still evaluates through the dynamic lane at:
  - lab `Rw 50`
  - field `R'w 42`
  - building `DnT,w 43`
- That value remains warning-toned and low-confidence.
- Gate B audit now proves all 9 source-corpus rows sit inside the
  defended current-engine corridor.
- LSF exact precedence is already load-bearing and green.
- Official source material already identified for the next corpus:
  - Knauf UK timber stud rows (`Rw 42`, `Rw 56`, `Rw 59`)
  - British Gypsum `A046005` (`Rw 55`)
  - British Gypsum `A046006` (`Rw 58`)
  - Gyproc Ireland `A026025` (`41 RwdB`)
  - existing Knauf lightweight steel `W111` / `W112` holdout corpus
    already present in
    `packages/engine/fixtures/reference-benchmarks-rw-generic-holdout-2026.json`

## Gate Plan

### Gate A - source corpus authoring

Author the official common-wall source pack first:

- add a fixture or typed source module for the new timber/lightweight
  rows,
- record exact source URLs and retrieval dates,
- classify each row as one of:
  - landed exact import,
  - secondary benchmark,
  - holdout only.

No runtime change is allowed in Gate A.

Gate A landed `2026-04-23`:

- `packages/engine/src/wall-timber-lightweight-source-corpus.ts`
  now holds the typed corpus,
- 2 direct timber rows are classified as
  `exact_import_landed`,
- 5 timber resilient/proprietary-board rows are classified as
  `secondary_benchmark`,
- 2 existing Knauf lightweight steel rows are linked as
  `holdout_only` companions,
- `packages/engine/src/wall-timber-lightweight-source-corpus-contract.test.ts`
  pins ids, sources, retrieval dates, and classification posture.
- Validation on landing:
  - targeted engine tests green,
  - `pnpm calculator:gate:current` green,
  - broad `pnpm check` green,
  - `git diff --check` clean.

### Gate B - executable source audit

Add engine-side source-audit tests that make the corpus usable:

- integrity checks for the new source pack,
- benchmark/holdout audits against the current engine,
- explicit negative tests where the live timber preset is close in
  family but not exact in topology.

If any current engine value is badly outside the defended corridor, that
becomes the next runtime target. If not, the corpus still expands
coverage honestly without changing math.

Gate B landed `2026-04-23`:

- `packages/engine/src/wall-timber-lightweight-source-audit.test.ts`
  now evaluates every source-corpus row against the current dynamic
  engine path,
- the 2 direct timber rows stayed inside the defended
  single-board calibration corridor and were the only rows precise
  enough for later exact import,
- the 5 `secondary_benchmark` rows stay inside the defended
  double-board/resilient corridor without pretending to be exact,
- the 2 linked lightweight holdouts remain exact against their
  existing holdout dataset rows,
- the live timber preset is now explicitly pinned as
  family-adjacent-but-not-exact to any later-landed direct row.
- no runtime value change landed in Gate B.
- Validation on landing:
  - targeted engine tests green,
  - `pnpm calculator:gate:current` green,
  - broad `pnpm check` green,
  - `git diff --check` clean.

### Gate C - import or holdout decision

For each row, choose exactly one posture:

- import exact matching now,
- keep as benchmark/holdout only,
- defer because the topology is still too ambiguous.

Only rows that survive this classification may influence runtime or
user-visible exact routing.

Gate C landed `2026-04-23`:

- the 2 direct timber rows are promoted from candidate status to
  `exact_import_landed`,
- `packages/engine/src/airborne-verified-catalog.ts` now imports those
  two rows onto the exact lab anchor lane,
- `packages/engine/src/airborne-verified-catalog.test.ts` pins the
  exact catalog lookup and official Rw values,
- `apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts`
  pins the user-visible lab / field / building card surface for those
  exact rows,
- at this source-corpus closeout the 5 resilient/proprietary rows
  remained benchmark-only because resilient-side-count and
  proprietary-board ambiguity was still real,
- the 2 linked lightweight steel companions remain holdout-only,
- the live timber preset stays on the low-confidence dynamic route
  because it is family-adjacent but not exact-topology-equal to either
  landed direct row.
- Validation on landing:
  - targeted engine tests green,
  - targeted web tests green,
  - `pnpm calculator:gate:current` green,
  - broad `pnpm check` green (`206` engine files / `1169` tests,
    `145` web files / `837` passed + `18` skipped, build green),
  - `git diff --check` clean.

## Closeout

Closed `2026-04-23` with the following posture:

- the typed timber/lightweight source corpus is now in-repo and
  executable,
- 2 direct timber rows are landed exact imports,
- 5 resilient/proprietary rows remained benchmark-only at this closeout
  for explicit reasons instead of floating as ambiguous future work,
- 2 linked lightweight steel rows remain holdout-only,
- the live timber preset still stays on its dynamic low-confidence lane
  because no landed exact row matches that direct double-board topology.

Selected next slice:

- `wall_resilient_bar_side_count_modeling_v1`

Selection reason:

- four official timber rows already exist in the corpus and the
  highest-ROI remaining blocker is not more source gathering; it is the
  missing one-side vs both-sides resilient-bar input/model dimension.

## Initial Source Candidates

1. Knauf UK Drywall Systems Performance Guide 2026
   `https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB`
2. British Gypsum `A046005`
   `https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046005-en.pdf`
3. British Gypsum `A046006`
   `https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046006-en.pdf`
4. Gyproc Ireland `A026025`
   `https://www.gyproc.ie/documents/system-specifications/a026025.pdf`

## Validation

Minimum validation for the slice:

- targeted source-corpus tests,
- `pnpm calculator:gate:current`,
- `git diff --check`.

If any runtime or exact-routing behavior changes later in this slice,
also run:

- the affected wall engine audits,
- the affected wall web route/card matrices,
- `pnpm check`.

## Completion Criteria

- the common timber/lightweight wall source corpus exists in-repo with
  explicit URLs and row classification,
- the corpus is covered by executable tests,
- the repo states clearly which rows are landed exact imports, which
  are benchmark-only, and which are holdout-only,
- any later runtime change is now source-defended instead of heuristic.
