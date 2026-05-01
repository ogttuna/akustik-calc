# Checkpoint - Calculator Post-Knauf Source Acquisition Gate A Handoff

Date: 2026-04-30

Slice: `calculator_post_knauf_source_acquisition_v1`

Gate: A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`
lands Gate A no-runtime.

Gate A does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next selected slice:

`british_gypsum_white_book_source_pack_extraction_v1`

Next selected file:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`

Gate A selection status:

`selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import`

## Acquisition Evidence

The strongest new official source pack is British Gypsum White Book /
Specification Selector. It gives exact row locators across wall and
floor gaps:

- `C204006 (EN)` GypFloor Silent: timber joists with Gypframe SIF floor
  channel, resilient bars, `Gyproc SoundBloc 15mm` ceiling layers,
  `Rw 61`, `Rw+Ctr 48`, and `Ln,w 56`.
- `C204003 (EN)` GypFloor Silent: timber joists with `Gyproc Plank
  19mm` and `Gyproc FireLine 12.5mm` ceiling build-up, `Rw 63`,
  `Rw+Ctr 51`, and `Ln,w 55`.
- `A206A290 (B) (EN)` GypWall Single Frame: two layers of `Gyproc
  SoundBloc 12.5mm` each side of `Gypframe 92 AS 50 AcouStuds`, 25 mm
  Isover APR, `Rw 57`, and `Rw+Ctr 51`.
- `A046006 (EN)` timber stud partition: two layers of `Gyproc
  SoundBloc 12.5mm` each side of 75 x 38 mm timber studs with RB1
  resilient bars both sides, `Rw 58`.
- `A326017B (B) (EN)` GypWall Twin Frame Audio: triple `Gyproc
  SoundBloc 15mm` linings, two Gypframe stud frameworks, acoustic
  braces, multiple insulation layers, `Rw 77`, and `Rw+Ctr 69`.
- `B226010 (EN)` GypLyner Single: 103 mm solid brick wall with
  plaster, GL1 lining channels both sides, 35 mm cavities, 25 mm
  Isover APR, one layer `Gyproc SoundBloc 12.5mm`, `Rw 60`, and
  `Rw+Ctr 42`.

Stora Enso CLT soundproofing was also acquired as official CLT context.
It is useful for CLT wall/floor formula and component mapping, but it
does not outrank British Gypsum for the next extraction because live CLT
routes still need route-specific tolerance, metric mapping, and paired
visible tests.

## Why No Runtime Movement

British Gypsum rows are official and exact enough for no-runtime row
extraction, but they are not runtime-ready imports yet. Before any
value movement, we still need:

- local material and thickness mapping against engine inputs;
- metric and lab / field policy per row;
- tolerance owner per row family;
- protected negative boundaries for floor-only, wall-only, adjacent,
  and existing exact-anchor cases;
- paired engine value tests and web route-card / report tests.

Existing Knauf rows, generated floor fallback near misses, CLT context,
and historical blocked families stay closed or context-only.

## Frozen Surfaces

These surfaces remain frozen:

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Next Step

Implement:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`

The next gate should extract row metadata and compare each row against
live topology, material mapping, metric policy, tolerance ownership,
negative boundaries, and paired test requirements. Runtime can only be
selected if all of those are complete.

## Validation

Baseline before Gate A:

- `pnpm calculator:gate:current`: green on 2026-04-30 before this Gate
  A edit, engine 159 files / 799 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate A validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts --maxWorkers=1`
  green: 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts --maxWorkers=1`
  green: 2 files / 16 tests.
- `pnpm calculator:gate:current` green on 2026-04-30 after Gate A:
  engine 160 files / 807 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings, whitespace
  guard clean.
- `git diff --check`: clean after validation-doc refresh.

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
