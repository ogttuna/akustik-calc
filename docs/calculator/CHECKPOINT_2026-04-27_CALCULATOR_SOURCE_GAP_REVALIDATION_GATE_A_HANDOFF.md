# Checkpoint - Calculator Source Gap Revalidation Gate A Handoff

Date: 2026-04-27

Latest closed slice: `calculator_source_gap_revalidation_v1` Gate A

Next selected slice: `wall_coverage_expansion_planning_v2`

## What Changed

Gate A landed as a no-runtime revalidation contract:

- `packages/engine/src/calculator-source-gap-revalidation-gate-a-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

The contract confirms that the historical blocked-source queue has no
current runtime-eligible candidate:

- `GDMTXA04A` visible exact reopening remains closed fail-closed because
  the visible 65 mm surface is still a convenience proxy rather than an
  honest composite dry-screed surface equivalence.
- `C11c` exact import remains closed fail-closed because the weak
  weighted impact tuple still lacks raw spectrum or source-correction
  evidence.
- Raw bare open-box/open-web impact remains closed fail-closed because
  current source rows describe packaged systems, not true bare carrier
  impact behavior.
- Wall-selector behavior remains closed fail-closed because no fresh
  classified wall red exists beyond the closed trace guard.

No acoustic runtime values, formulas, confidence scores, output support,
evidence tiers, source rows, or precedence rules changed.

## Selected Next Work

The next selected slice is:

- [SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md](./SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md)

Reason:

- private/internal-use readiness is closed, but wall coverage remains
  shallower than floor coverage;
- the blocked floor/source families are still fail-closed, so reopening
  them would be evidence-free;
- a new v2 wall plan is needed because the archived wall coverage v1
  plan predates many landed guardrails and cannot be used as the active
  execution plan without re-inventory.

## Validation

Baseline before edits:

- `pnpm calculator:gate:current` green:
  - engine 99 files / 450 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

The focused gate delta after this slice is one new engine test file and
five planning-contract tests.

Post-change validation:

- targeted contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-gate-a-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- `pnpm calculator:gate:current` green:
  - engine 100 files / 455 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean
- `pnpm check` green:
  - lint/typecheck green
  - engine 233 files / 1275 tests
  - web 155 files / 885 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings

## Resume Order

1. Read this checkpoint.
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Read
   [SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md](./SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md).
4. Run `pnpm calculator:gate:current` before editing the selected wall
   planning slice.
5. Start Gate A inventory for `wall_coverage_expansion_planning_v2`.

## Boundaries

- Keep `/home/ogttuna/Dev/Machinity/Acoustic2` read-only.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall, or
  floor fallback from nearby green tests alone.
- Runtime movement inside the next slice requires a named
  source-backed, benchmark-backed, bounded, or formula-owned rule plus
  positive, negative, precedence, and UI/card tests.
