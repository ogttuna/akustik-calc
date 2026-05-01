# Slice Plan - Calculator Source Gap Revalidation v5

Slice id: `calculator_source_gap_revalidation_v5`

Status: GATE A LANDED / NEXT SLICE SELECTED (selected 2026-04-29 by
`post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`;
Gate A landed 2026-04-30).

Latest checkpoint:
[CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md)
lands Gate A no-runtime and selects
`timber_double_board_knauf_tb5a_mapping_tolerance_v1`.

Landed Gate A implementation file:

`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`

Selected next first implementation file:

`packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`

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

Gate A selection status:

`selected_no_runtime_knauf_tb5a_timber_double_board_mapping_tolerance_after_v5_rerank_found_no_runtime_ready_candidate`

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

## Implementation Readiness Check - 2026-04-30

The active plan did not need a replacement plan document. Gate A has
now landed in:

`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`

It selected the next no-runtime first gate:

`packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`

Current implementation comparison:

- `packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  exists and selects this v5 slice after Knauf Gate C.
- `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`
  blocks every extracted Knauf locator row from runtime import and
  visible promotion.
- `tools/dev/run-calculator-current-gate.ts` includes Knauf Gate A,
  Gate B, Gate C, and v5 Gate A contracts.
- `pnpm calculator:gate:current` is green after Gate A landed on
  2026-04-30 with engine 149 files / 730 tests, web 45 files / 216
  passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, and whitespace guard clean.

## Goal-Aligned Planning Iteration - 2026-04-30

Target checkpoint: the calculator should become defensible for acoustic
consultancy use across realistic wall and floor layer combinations by
returning one of four honest outcomes:

- exact / source-backed result;
- benchmark-backed formula result with corridor-specific tolerance;
- formula / family estimate with explicit evidence owner and bounded
  tolerance;
- fail-closed or unsupported result with a specific reason.

Current conclusion: the plan is still pointed at the right target, but
the comprehensive accuracy bar is not yet met. Controlled internal use
is available inside the pilot handoff envelope; broad high-confidence
coverage is still blocked by source topology, metric, tolerance, and
material-mapping gaps.

Implementation and source scan result:

- No existing implementation file or current-gate runner entry has
  advanced beyond Knauf Gate C into v5 Gate A.
- The official Knauf AU Systems+ page still exposes the October 2025
  guide and Section D / Section F resources, making `TB.5A` and
  `MWI.2A` concrete source-mapping follow-ups, but not runtime imports.
- WoodWorks mass-timber inventory / database and NRC NLT / RR-335
  context remain useful for CLT / mass-timber metric policy, but their
  STC / ASTC / IIC contexts still need explicit ISO `Rw` / field-output
  handling before runtime movement.
- Pliteq EchoOne and UBIQ INEX remain valid floor source reservoirs,
  but the plan must keep Pliteq / UBIQ exact or bound behavior
  topology-gated; the live generated fallback cannot inherit those rows
  by proximity.
- Dataholz remains useful for component-level `Rw` / `Ln,w` context and
  floor-only negative boundaries, not generic wall or CLT-wall truth.

## Provisional v5 Gate A Decision Path

Gate A must select the first applicable path in this order:

1. Select a runtime accuracy slice only if a candidate names exact
   topology or a bounded family rule, metric owner, tolerance owner,
   local material mapping, protected negative boundaries, and paired
   engine / web visible tests. The current implementation review found
   no such candidate.
2. If no runtime pack exists, prefer a no-runtime Knauf `TB.5A` timber
   double-board mapping / tolerance slice. Suggested target file:
   `packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`.
   Reason: this is a common company-use wall lane, maps closest to the
   current caveated `wall-timber-stud` generated route, and has a
   concrete source locator. It still needs exact stud-depth column,
   `SHEETROCK ONE` to local board mapping, `KI 75G11` to local
   insulation mapping, lab/field output policy, and tolerance owner.
3. If `TB.5A` is not the best bounded follow-up, select a no-runtime
   Knauf `MWI.2A` lined-masonry / lined-heavy mapping slice. Suggested
   target file:
   `packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`.
   Reason: it directly attacks the lined-massive / heavy-core screening
   gap, but substrate mass, furring/cavity, coupling, board mapping,
   field-output policy, and tolerance ownership remain incomplete.
4. If Knauf mapping cannot advance, select CLT / mass-timber metric
   policy and tolerance work only as no-runtime planning. Reason:
   WoodWorks / NRC contexts are strong, but STC / FSTC / ASTC / IIC
   cannot become DynEcho `Rw`, `R'w`, or `DnT,w` truth without a named
   policy or explicit rejection.
5. If wall-source mapping is lower value than floor accuracy, select
   Pliteq / UBIQ floor fallback exact-or-bound acquisition only as a
   no-runtime source topology pass. The generated fallback must stay
   low-confidence unless its live topology matches the source topology
   or a bounded family rule is named.
6. Keep no-stud double-leaf and historical blocked families fail-closed
   unless a direct row or local tolerance owner satisfies the original
   blocker.
7. Keep productization-only work deferred while calculator
   source/accuracy ranking remains active.

The expected v5 Gate A outcome, unless new evidence appears during
implementation, is therefore a no-runtime next-slice selection rather
than runtime import. The highest-value provisional next slice is the
Knauf `TB.5A` timber double-board mapping / tolerance decision.

## Gate A Landed Record - 2026-04-30

Gate A landed in
`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`
as a no-runtime planning contract.

Outcome:

- selected implementation slice:
  `timber_double_board_knauf_tb5a_mapping_tolerance_v1`;
- selected first gate:
  `packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`;
- selected planning surface:
  [SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md](./SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md);
- selection status:
  `selected_no_runtime_knauf_tb5a_timber_double_board_mapping_tolerance_after_v5_rerank_found_no_runtime_ready_candidate`;
- runtime/support/confidence/evidence/API/route-card/output-card/
  proposal/report/workbench-input behavior stayed frozen.

The selected next slice is no-runtime because `TB.5A` still lacks exact
stud-depth column selection, `SHEETROCK ONE` and `KI 75G11` local
material mapping, lab / field output policy, tolerance ownership, and
paired engine / web visible tests.

## Downstream Selection Chain - 2026-04-30

The v5-selected Knauf mapping chain has advanced without runtime or
visible movement:

1. `timber_double_board_knauf_tb5a_mapping_tolerance_v1` Gate A landed
   no-runtime and Gate C closed no-runtime.
2. `lined_masonry_knauf_mwi2a_mapping_tolerance_v1` Gate A landed
   no-runtime and Gate C closed no-runtime.
3. `twin_timber_knauf_ttf302a_mapping_tolerance_v1` Gate A landed
   no-runtime and Gate C closed no-runtime, selecting
   `calculator_source_gap_revalidation_v6` with:
   `packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`.

Current downstream selection status:

`closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership`

This keeps the v5 conclusion intact: no Knauf row is runtime/import
ready until exact topology, metric owner, tolerance owner, material
mapping, protected negative boundaries, and paired visible tests are
all named.

## Gate A Implementation Checklist

Implement Gate A as an executable no-runtime planning contract first.
It should do the following in order:

1. Create the v5 Gate A contract file and model every candidate with:
   candidate id, rank, current posture, user-visible risk, executable
   test owner, doc owner, first missing requirement, protected
   negative boundaries, runtime readiness, selected-next flag, target
   file, and validation scope.
2. Include all required candidate families: Knauf Gate B rows,
   timber double-board, CLT / mass-timber, no-stud double-leaf,
   generated floor fallback, lined-massive / heavy-core, historical
   blocked families, internal-use evidence, and productization-only
   tracks.
3. Keep every candidate `runtimeImportReadyNow: false` unless the
   contract can name exact topology, metric owner, tolerance owner,
   material mapping, protected negative boundaries, and paired engine /
   web visible tests.
4. Select exactly one next slice. Prefer runtime work only when the
   full source-ready checklist is satisfied. Otherwise select the next
   no-runtime source acquisition, extraction, material/tolerance
   mapping, validation, or planning slice that advances the accuracy
   roadmap.
5. Assert no frozen surface moved unless the selected candidate is fully
   source-ready: runtime values, support, confidence, evidence, API,
   route cards, output cards, proposal/report copy, output support, and
   workbench-input behavior must stay unchanged.
6. Keep docs synchronized after Gate A lands: update
   `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `AGENTS.md`, this
   plan, and the new checkpoint / handoff note together.
7. Validate the landed Gate A with the targeted v5 test, the Knauf
   Gate C compatibility context when relevant,
   `pnpm calculator:gate:current`, and `git diff --check`. Run
   `pnpm check` if Gate A is treated as a release gate or selects any
   runtime/import/visible behavior work.

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
- v5 Gate A validation is green on 2026-04-30:
  - targeted v5 Gate A contract: 1 engine file / 7 tests;
  - `pnpm calculator:gate:current`: engine 149 files / 730 tests, web
    45 files / 216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean.
- downstream MWI.2A Gate C validation is green on 2026-04-30:
  - targeted MWI.2A Gate C closeout: 1 engine file / 6 tests;
  - `pnpm calculator:gate:current`: engine 153 files / 756 tests, web
    45 files / 216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean.
- downstream TTF30.2A Gate A validation is green on 2026-04-30:
  - targeted TTF30.2A Gate A contract: 1 engine file / 8 tests;
  - targeted MWI.2A Gate C + TTF30.2A Gate A sync check: 2 engine files /
    14 tests;
  - `pnpm calculator:gate:current`: engine 154 files / 764 tests, web
    45 files / 216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean.
- downstream TTF30.2A Gate C validation is green on 2026-04-30:
  - targeted TTF30.2A Gate C closeout: 1 engine file / 6 tests;
  - targeted TTF30.2A Gate C + TTF30.2A Gate A + MWI.2A Gate C sync
    check: 3 engine files / 20 tests;
  - `pnpm calculator:gate:current`: engine 155 files / 770 tests, web
    45 files / 216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean;
  - `git diff --check`: clean after validation note sync.
