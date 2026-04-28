# Slice Plan - Calculator Source Gap Revalidation v3

Status: CLOSED NO-RUNTIME (opened 2026-04-28 by
`post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts`;
Gate A landed in
`calculator-source-gap-revalidation-v3-gate-a-contract.test.ts` and
selected `internal_use_operating_envelope_v1`)

Planning posture after the extra 2026-04-28 analysis pass:

- this slice is closed;
- Gate A landed no-runtime, not runtime movement;
- the three readiness tiers are now explicit:
  1. short internal pilot,
  2. regular internal operating envelope,
  3. comprehensive source-gated accuracy program.

Prepared follow-up plans:

- [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md)
  is now selected and covers the short pilot plus the next 2-4
  internal-use hardening iterations.
- [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
  covers the longer source-gated correctness program.

## Objective

Re-rank the remaining calculator source and accuracy gaps after the
framed-wall board-split drift was fixed. This is a no-runtime planning
slice. It must decide the next implementation target from current
evidence instead of reopening source-blocked wall/floor families from a
nearby green test.

The practical goal of this iteration is to make the next moves readable
without relying on memory:

- what must happen before the short company pilot;
- what must happen before regular internal use feels comfortable;
- what remains blocked before any claim like "very comprehensive and
  correct for every calculation" can be made.

## Why This Slice Is Next

`wall_framed_facing_split_warning_stability_v1` closed the last named
non-source-blocked runtime drift in the living docs:

- LSF field board splits now keep baseline field values and no longer
  add the framed reinforcement monotonic-floor warning;
- paired web route-card coverage pins visible card and acoustic-warning
  behavior;
- global same-material board coalescing remains disallowed.

That local fix does not make no-stud double-leaf, timber double-board,
CLT wall, lined-massive / heavy-core wall, floor fallback, `GDMTXA04A`,
`C11c`, or raw bare open-box/open-web runtime-eligible. The next honest
step is another bounded revalidation pass.

## Gate A - Remaining Gap Rerank

Gate A should add
`packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`
and make no runtime, support, confidence, evidence, API, or route-card
changes.

Gate A has landed. It selected
[SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md)
because no source-backed runtime unlock, card dishonesty, or fresh
calculator drift outranked the short company pilot operating envelope.

It should inventory at least:

1. framed split closeout posture and regression coverage;
2. wall source holdouts:
   - no-stud double-leaf;
   - timber double-board;
   - CLT / mass-timber wall;
   - lined-massive / heavy-core wall;
3. floor fallback low-confidence posture;
4. historical blocked-source families:
   - `GDMTXA04A`;
   - `C11c`;
   - raw bare open-box/open-web;
   - wall-selector behavior;
5. remaining engine-addressable edge-case or invariant gaps, if any;
6. optional architecture and productization-only work, both explicitly
   lower priority unless a current calculator accuracy risk is found.

Gate A must also classify the readiness ladder:

| Tier | Status entering Gate A | Gate A decision required |
|---|---|---|
| Short internal pilot | nearly ready | either select `internal_use_operating_envelope_v1` Gate A for pilot notes/scenario summary, or name the concrete calculator drift that outranks it |
| Regular internal use | planned, not active | keep as 2-4 bounded iterations unless Gate A finds an urgent visibility or correctness gap |
| Comprehensive correctness | roadmap only | keep source-gated and do not convert to a runtime slice without a direct source row, bounded formula/tolerance owner, or executable drift |

## Acceptance Rules

Gate A may select a runtime slice only if it names a concrete source
row, bounded formula/tolerance owner, or executable current-behavior
drift. Otherwise it must select another no-runtime research/planning
or test-coverage slice.

Gate A must keep closed:

- global board coalescing follow-ups;
- wall source holdout promotions without new evidence;
- floor fallback promotion without new evidence or bounded family rule;
- historical blocked-source reopens from nearby green tests alone;
- productization work until calculator accuracy priority explicitly
  changes.

Gate A may select the internal-use operating-envelope slice if and only
if the rerank finds no higher-priority runtime drift, card dishonesty, or
source-backed import opportunity. That slice is documentation/test
surface work first; it must not relabel low-confidence or screening
families as safe.

## Implementation Snapshot Reviewed For This Plan

The 2026-04-28 extra planning pass rechecked the current implementation
surface before changing docs:

- `pnpm calculator:gate:current` is green at the current baseline:
  128 engine files / 601 tests, 44 web files / 212 passed + 18 skipped,
  build 5/5, with the known non-fatal `sharp/@img` warnings.
- active selection is enforced by
  `packages/engine/src/post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts`.
- the current-gate runner now includes
  `calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`.
- the framed split runtime drift is closed by
  `wall-framed-facing-split-warning-stability-gate-b-contract.test.ts`
  plus the paired workbench route-card matrix.
- the remaining wall source holdouts have already closed no-runtime:
  no-stud double-leaf, timber double-board, CLT wall, and
  lined-massive / heavy-core wall.
- floor fallback remains explicitly low-confidence; historical
  `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
  reopens remain closed fail-closed.

## Source Scan Notes

This pass also checked public source candidates that could feed later
source-research slices. These links are candidate intake only. They are
not runtime import evidence until a future slice extracts topology,
metric definitions, tolerances, negative boundaries, and paired tests.

Candidate intake:

- Knauf UK Drywall Systems Performance Guide, April 2026:
  `https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB`
  - useful for timber stud and lining table candidates;
  - some timber double-board rows are explicitly "Not Tested", so they
    cannot unlock the live double-board timber route by themselves.
- Knauf AU Systems+ Design Guide:
  `https://knauf.com/en-AU/knauf-gypsum/services/training/systems-plus`
  - useful intake for timber stud, masonry upgrade, ceiling, and CLT
    system sections;
  - requires section-level extraction before it can become evidence.
- NRC Canada mass-timber report archive:
  `https://nrc-publications.canada.ca/eng/view/object/?id=e38fb723-6a4c-4a78-9e47-5a73c92c448f`
  - relevant for CLT/NLT/DLT wall and floor measured transmission-loss
    datasets;
  - must be mapped to the engine's wall/floor topology fields before
    any import.
- WoodWorks acoustically tested mass-timber assemblies inventory:
  `https://www.woodworks.org/wp-content/uploads/Acoustically-Tested-Mass-Timber-Assemblies-WoodWorks.pdf`
  - useful for mass-timber intake, but many rows are ASTM STC/IIC and
    floor-oriented; do not treat them as direct ISO `Rw` / `Ln,w`
    source rows without a conversion/tolerance decision.
- UBIQ INEX FLOOR fire/acoustic tables:
  `https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`
  - relevant to floor fallback/source-family research;
  - the current generated fallback still lacks the exact INEX / ceiling
    / joist topology required by the existing floor fallback contracts.

## Readiness Ladder

### Tier 1 - Short Internal Pilot

Status: selected next as `internal_use_operating_envelope_v1`.

Required output:

- Gate A rerank contract lands no-runtime;
- a short internal pilot note lists "safe", "screening/low-confidence",
  and "fail-closed" families;
- a test scenario summary lists representative wall/floor examples and
  their expected evidence tier, target outputs, and visible warnings;
- no family confidence is upgraded only for pilot convenience.

Prepared plan:

- [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md)

### Tier 2 - Regular Internal Use

Status: planned, not active; estimated 2-4 bounded iterations after the
pilot note, depending on whether visibility gaps are found.

Required output:

- the workbench and report surfaces make low-confidence, screening,
  unsupported, and fail-closed posture hard to miss;
- critical example sets are documented and backed by focused tests;
- source-gated families remain visible as source-gated instead of
  silently blending into ordinary formulas.

Prepared plan:

- [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md)

### Tier 3 - Comprehensive Accuracy Program

Status: roadmap only; not a short active slice.

Required output:

- timber double-board, CLT wall, lined/heavy-core wall, floor fallback,
  no-stud double-leaf, and historical blocked floor families either get
  direct source rows / bounded formula owners, or remain explicitly
  fail-closed / screening / low-confidence;
- every defended lane has a named evidence owner and corridor-specific
  tolerance;
- every widened lane lands positive, negative, precedence, route-card,
  and documentation tests together.

Prepared plan:

- [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)

## Immediate Execution Order

This slice is closed. Resume active work from:

1. [CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_HANDOFF.md)
2. [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md)

Next implementation file:

`packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts`

## Gate A Closeout - Landed 2026-04-28

Result:

- no calculator runtime behavior changed;
- the framed split fix remains closed with engine and web regression
  coverage;
- wall source holdouts remain blocked without new direct rows or
  bounded formula/tolerance owners;
- floor fallback remains low-confidence until source evidence or a
  bounded steel/open-web family rule exists;
- historical blocked-source families remain closed fail-closed;
- public source intake candidates stay research-only;
- the selected next slice is
  [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md).

Validation:

- targeted Gate A validation is green with 1 file / 6 tests.
- post-Gate-A focused validation is green with 129 engine files / 607
  tests, 44 web files / 212 passed + 18 skipped, build 5/5, whitespace
  guard clean, and the known non-fatal `sharp/@img` warnings.
