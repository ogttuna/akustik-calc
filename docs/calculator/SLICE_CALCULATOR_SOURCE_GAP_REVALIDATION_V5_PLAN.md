# Slice Plan - Calculator Source Gap Revalidation v5

Slice id: `calculator_source_gap_revalidation_v5`

Status: SELECTED / GATE A NEXT (selected 2026-04-29 by
`post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`).

Latest checkpoint:
[CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md](./CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md)
confirms docs and implementation align before Gate A. The v5 Gate A
contract remains intentionally absent and next; no runtime or visible
surface movement is approved.

Current first implementation file:

`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`

Selection status:

`closed_knauf_wall_systems_source_pack_no_runtime_and_selected_source_gap_revalidation_v5_because_gate_b_found_no_import_ready_row`

Selection reason: `knauf_wall_systems_source_pack_extraction_v1` Gate C
closed no-runtime after Gate B found no Knauf locator row with complete
topology, metric, tolerance, material mapping, and visible-test
ownership. The next honest action is a fresh source/accuracy rerank
before any runtime import, confidence/support promotion, or
productization-only work.

Gate B status carried forward:

`no_knauf_locator_row_has_complete_topology_metric_tolerance_and_visible_test_ownership`

No runtime import, value movement, confidence promotion, support
promotion, evidence-tier promotion, route-card movement, output-card
movement, proposal/report copy change, output support movement, or
workbench-input movement is allowed in this slice unless Gate A names a
fully source-ready runtime candidate.

## Objective

Re-rank the calculator source and accuracy backlog after the Knauf
source-pack closeout.

Gate A must answer:

- whether any source-ready runtime import pack exists now;
- whether any no-runtime source acquisition, row extraction, or
  material/tolerance mapping slice is more valuable than another broad
  revalidation;
- whether internal-use acceptance or pilot feedback has revealed a
  concrete defect that outranks source acquisition;
- whether productization-only work should remain deferred while
  calculator scope/accuracy is still active.

## Gate A - Source / Accuracy Gap Rerank After Knauf Closeout

Gate A should add:

`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`

Required candidate families:

- Knauf Gate B closeout rows and negative boundaries;
- timber double-board stud wall;
- CLT / mass-timber wall;
- no-stud double-leaf wall;
- generated floor fallback;
- lined-massive / heavy-core wall;
- historical blocked families;
- internal-use acceptance and pilot handoff evidence;
- productization tracks that must not outrank accuracy.

Required evidence fields:

- candidate id, current posture, and user-visible risk;
- latest executable test owner and doc owner;
- first missing source, metric, tolerance, material, or visible-test
  requirement;
- negative boundaries and near misses that must stay closed;
- selected next slice with target gate file and validation scope.

## Current Candidate Read

No candidate is runtime-ready at Gate C closeout time.

- Knauf wall-system rows are concrete source locators but not import
  rows.
- Timber double-board still needs exact column selection, local board /
  insulation mapping, and tolerance ownership.
- Lined-masonry / heavy-core still needs substrate, furring/cavity,
  coupling, board mapping, and tolerance ownership.
- CLT / mass-timber remains formula/source-gated after prior
  metric-policy and tolerance blockers.
- Generated floor fallback remains low-confidence/screening after
  Pliteq and UBIQ topology near misses.
- Historical blocked families remain fail-closed unless their original
  blocker is directly satisfied.

## Acceptance Rules

Gate A may select runtime work only if it names all of:

- exact source row or bounded family/formula rule;
- metric owner and lab/field context;
- tolerance owner;
- material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card/report tests.

Gate A may select no-runtime source work if it names the exact source
or mapping question that advances the comprehensive accuracy bar.

Gate A must not:

- import Knauf locator rows by proximity;
- promote internal pilot success into confidence/support changes;
- reopen `GDMTXA04A`, `C11c`, raw open-box/open-web, wall selector,
  no-stud double-leaf, CLT wall, generated floor fallback, or
  lined-heavy routes from nearby green tests alone;
- resume productization-only work while source/accuracy ranking is the
  active calculator priority.

## Read Map

Before implementing Gate A, read:

- [CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md](./CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md)
- [CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md)
- [CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md)
- [SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md](./SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md)
- [SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md)
- [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)

Use public source research only if Gate A needs to verify that a
candidate source pack is concrete enough for extraction. Source
locators are not import approval by themselves.

## Validation

- Pre-Gate-C focused baseline is green on 2026-04-29:
  - `pnpm calculator:gate:current`;
  - engine 147 files / 717 tests;
  - web 45 files / 216 passed + 18 skipped;
  - build 5/5 with known non-fatal `sharp/@img` warnings;
  - whitespace guard clean.
- Knauf Gate C closeout validation is green on 2026-04-29:
  - targeted Knauf Gate C closeout: 1 engine file / 6 tests;
  - targeted Knauf Gate A + Gate B + Gate C compatibility: 3 engine
    files / 19 tests;
  - `pnpm calculator:gate:current`: engine 148 files / 723 tests, web
    45 files / 216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean;
  - `pnpm check`: lint/typecheck green, engine 281 files / 1543 tests,
    web 157 files / 890 passed + 18 skipped, build 5/5 with known
    non-fatal `sharp/@img` warnings.
  - `git diff --check`: clean.
