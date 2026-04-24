# Checkpoint - 2026-04-23 Wall Formula Family Widening Closeout

Status: calculator slice closeout handoff

## What Closed

`wall_formula_family_widening_v1` is now closed.

Gate A and Gate B already landed with no runtime math change:

- `packages/engine/src/wall-formula-family-widening-audit.test.ts`
- `apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts`

Gate C is now also closed:

- no runtime value change landed,
- no confidence-class tightening landed,
- no route-selection correction landed.

## Gate C Decision

The current live timber-stud route stays exactly where Gate B pinned it:

- lab `Rw = 50`
- field `R'w = 42`
- building `DnT,w = 43`
- trace posture remains low-confidence
  `stud_surrogate_blend+framed_wall_calibration`

This slice closes no-runtime because the current source posture is still
too broad for a precise runtime tightening.

## Why Runtime Tightening Did Not Open

The source recheck supports a broad corridor, not a narrow direct target:

- Davy 2010 (`https://pubmed.ncbi.nlm.nih.gov/20136207/`) supports
  double-leaf gypsum cavity-wall prediction and stud-borne transmission
  as a corridor model, not as a direct single-number replacement for the
  current wood-stud preset.
- Scientific Reports 2024
  (`https://www.nature.com/articles/s41598-024-82403-w`) supports the
  directional fact that wooden studs bridge more rigidly than steel
  studs, so stud type must stay explicit. It does not supply a direct
  row for the current preset topology.
- Knauf UK Drywall Systems Performance Guide 2026
  (`https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB`)
  gives timber rows such as `1 x 12.5` wallboard each side with
  `50 mm` cavity insulation at `Rw 42`, plus resilient-bar timber rows
  at `Rw 56` and `Rw 59`.
- British Gypsum `A046005`
  (`https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046005-en.pdf`)
  gives a timber stud wall with one-side resilient bars and
  `2 x 12.5` SoundBloc each side at `Rw 55`.
- British Gypsum `A046006`
  (`https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046006-en.pdf`)
  gives the both-sides resilient-bar variant at `Rw 58`.
- Gyproc Ireland `A026025`
  (`https://www.gyproc.ie/documents/system-specifications/a026025.pdf`)
  gives a direct timber stud wall with `2 x 15` FireLine each side and
  no cavity insulation at `41 RwdB`.

Together these sources show that:

1. the old screening seed (`Rw 31.1`) is not a user-visible authority,
2. the live dynamic result (`Rw 50`) is directionally plausible,
3. the available direct and resilient timber rows are too different in
   board type, cavity, and connection condition to justify a precise
   lift/trim on the current preset lane.

So the honest closeout is to leave runtime math unchanged.

## What Stayed True

- LSF exact/catalog precedence still wins ahead of formula routing.
- Timber dynamic remains user-visible but warning-toned and
  low-confidence.
- Screening-only timber preset matrices remain non-user-visible drift
  guards.
- No blocked-source family reopened.

## Next Selected Slice

The next selected slice is:

`wall_timber_lightweight_source_corpus_v1`

Planning surface:

`docs/calculator/SLICE_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_PLAN.md`

## Why This Is Next

The current biggest honest gain is no longer heuristic tuning. It is
source-corpus expansion for common lightweight wall families:

- direct timber stud,
- timber stud with resilient bars,
- adjacent lightweight framed wall rows that can be classified as exact,
  secondary benchmark, or holdout.

That keeps the work aligned with the real priority:

1. improve common wall coverage,
2. improve accuracy only where the source posture defends it,
3. keep every gain pinned by tests before runtime changes.

## Resume Notes

- Do not reopen `wall_formula_family_widening_v1` runtime math from
  nearby green tests alone.
- Start the next slice by building the official timber/lightweight wall
  source corpus first.
- Only after the corpus exists should any row be promoted to exact
  import or benchmark-backed runtime tightening.
