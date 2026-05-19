# Checkpoint 2026-05-19 - Pre-Sprint Revalidation and Open-Box Formula Plan

Status: sprint-entry checkpoint after a fresh full current-gate run on
2026-05-19.

## Purpose

This checkpoint is the broad look before the next implementation sprint.
It confirms that the repo is green, maps the current implementation back
to the active docs, and states the next work in the order it should be
done. It does not promote new runtime values.

The next sprint should increase company-internal coverage and accuracy by
continuing the active broad-accuracy path, not by starting a broad source
crawl or reopening blocked aliases.

## Validation Result

Command:

`pnpm calculator:gate:current`

Result:

- engine focused gate: 459 files passed, 2635 tests passed;
- web focused gate: 87 files passed, 363 tests passed, 18 skipped;
- repo build: 5 / 5 packages successful;
- whitespace guard: passed;
- known non-fatal warnings: optional `sharp/@img` warnings from
  `@turbodocx/html-to-docx`, plus Zustand storage warnings in test
  runtime.

No implementation fix was required after this run.

## Current Implementation / Docs Alignment

The active implementation and docs agree:

- The controlled company-internal envelope is green and can support
  bounded pilot use, but it is not broad daily-use readiness for every
  realistic layer combination.
- The broad-accuracy plan remains the right path for expanding actual
  calculator coverage and reducing weak-lane debt.
- The latest landed broad-accuracy floor target is the open-box timber
  transfer-owner gate:
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`.
- The next selected action remains:
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`.
- The next selected file remains:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`.

The active owner implementation is
`packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner.ts`.
It classifies 15 TUAS open-box timber exact rows on the 370 mm
`open_box_timber_slab` carrier, separates 10 predictor-owned rows from 5
exact-only hybrid / fragmented rows, and keeps exact source precedence,
raw bare open-box guards, field/building boundaries, and ASTM/IIC
boundaries intact.

## Analysis Decision

The right first sprint task is the open-box timber formula corridor.

Reasoning:

- Tests show no broad infrastructure failure; this is coverage/accuracy
  work, not stabilization work.
- The owner gate already names the physical terms needed for formula
  promotion.
- Open-box timber is the selected bottleneck in the active broad-accuracy
  plan after direct-fixed open-web and wall triple-leaf work.
- Starting with runtime first would be too risky because the formula
  terms, budgets, exact-only hybrid handling, and negative boundaries
  must be executable before values move.

## Sprint Order

1. Land the no-runtime open-box timber formula-corridor contract.
   - Add
     `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`.
   - Add the matching formula-corridor module.
   - Define package-family transfer terms for upper package, lower
     ceiling family, laminate/EPS finish pair, fragmented exact-equivalent
     packages, ISO lab `Ln,w` / `CI` / `Ln,w+CI`, and `Rw` / companion
     `Rw+C`.
   - Define metric-specific source-absent budgets and residual-policy
     blockers.
   - Keep runtime values null in this gate.
2. Promote a narrow runtime corridor only after the formula gate is
   executable.
   - Exact source rows must remain first.
   - Runtime should be limited to complete same-family open-box timber
     packages with explicit 370 mm support, finish pair, upper package,
     lower ceiling family, and requested lab metrics.
3. Add surface parity after runtime.
   - Workbench cards, route posture, support notes, method/corridor
     dossiers, saved replay, server snapshot replay, calculator API,
     impact-only API, Markdown/PDF/DOCX report payloads must share the
     same value, basis, origin, and budget.
4. Refresh the coverage matrix and operating-envelope notes.
   - The matrix should distinguish supported formula rows,
     exact-source rows, `needs_input` rows, hostile refusals, and
     unsupported aliases.

## Do Not Do In This Sprint

- Do not borrow open-web steel terms for open-box timber.
- Do not reopen raw bare open-box impact support from nearby TUAS rows.
- Do not promote exact-only hybrid rows until the formula gate owns
  fragmented package equivalence.
- Do not alias lab `Ln,w` / `Rw` to `L'n,w`, `R'w`, `DnT,w`, building
  prediction, ASTM `IIC`, or `AIIC`.
- Do not ingest rights-sensitive measured values or start a broad source
  crawl.
- Do not treat a green exact-row match as source-absent formula
  validation.

## Commit / Worktree Notes

The source tree is otherwise clean except generated/local artifacts:

- `.playwright-cli/`
- root PDF files
- `apps/web/output/`
- `output/`
- `tmp/`
- `apps/web/tsconfig.tsbuildinfo`

These remain outside calculator source-of-truth.
