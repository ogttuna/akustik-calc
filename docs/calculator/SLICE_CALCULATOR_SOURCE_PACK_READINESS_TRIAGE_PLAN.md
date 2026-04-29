# Slice Plan - Calculator Source Pack Readiness Triage v1

Status: SELECTED / NOT STARTED (selected 2026-04-29 by
`post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`;
no-runtime source-readiness planning slice).

Next implementation file:

`packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts`

Selection reason: `internal_use_operating_envelope_v1` closed at Gate C.
The company internal operating envelope is now explicit, but no
source-ready accuracy pack can be promoted without more topology,
metric, tolerance, and negative-boundary evidence. The next bounded
calculator action is therefore to rank source-pack readiness before any
runtime import.

## Objective

Rank candidate source packs and decide whether any one can become an
active source/research slice with:

- exact topology and material/thickness mapping;
- metric owner and lab/field context;
- tolerance owner;
- protected negative boundaries;
- paired engine and web route-card or report tests.

This slice must not change acoustic formulas, runtime values, support
classes, confidence classes, evidence tiers, API shape, route-card
values, or output-card statuses.

## Candidate Families

| Candidate | Current posture | First missing prerequisite |
|---|---|---|
| timber double-board stud wall | formula-owned, low-confidence, source-gated | direct double-board timber topology row or bounded formula tolerance owner |
| CLT / mass-timber wall | formula-owned, medium-confidence, source-gated | wall-specific CLT/NLT/DLT row pack or laminated-leaf tolerance owner |
| lined-massive / heavy-core wall | screening | wall-specific lined concrete/heavy masonry row or bounded lining rule |
| no-stud double-leaf wall | formula-owned/source-blocked | no-stud/no-rail direct row mapping or local Davy/Sharp tolerance owner |
| generated floor fallback | low-confidence/screening | exact Pliteq/UBIQ topology match or bounded steel/open-web family rule |
| historical blocked families | fail-closed | new source evidence for `GDMTXA04A`, `C11c`, or true bare carrier impact behavior |

## Gate A - Rank Source Pack Readiness

Gate A should add:

`packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts`

The contract should be no-runtime and should rank candidate packs by
readiness and blocker type. It may select a narrow source-research slice
only if it can name topology, metric, tolerance, negative boundaries,
and paired tests. If no candidate reaches that bar, it should keep
[CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
as roadmap context and select no runtime import.

Required Gate A evidence fields:

- candidate id, current posture, and user-visible risk;
- source or formula owner, if any;
- missing topology, metric, tolerance, or negative-boundary prerequisite;
- positive and negative test shape required before runtime import;
- selected next action or roadmap-only reason.

## Validation

- Run `pnpm calculator:gate:current` before and after touching the
  selected slice.
- Use the Gate A engine contract test while iterating.
- Add the Gate A contract to `tools/dev/run-calculator-current-gate.ts`
  when it lands.
- Run `git diff --check`.
- Run `pnpm check` when the slice changes broad repo contracts or when
  a commit needs a full green gate.
