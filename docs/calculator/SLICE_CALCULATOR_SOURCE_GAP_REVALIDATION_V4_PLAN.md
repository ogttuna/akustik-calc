# Slice Plan - Calculator Source Gap Revalidation v4

Slice id: `calculator_source_gap_revalidation_v4`

Status: SELECTED / GATE A NEXT (selected 2026-04-29 by
`post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`).

Current first implementation file:

`packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`

Selection reason: `generated_floor_fallback_topology_delta_v1` Gate C
closed no-runtime after Gate A found topology near misses only. The
live generated floor fallback still lacks exact Pliteq topology, UBIQ
FL-32 bound topology, or a bounded steel/open-web family rule. No
source-ready runtime candidate is available, so the next honest action
is a fresh no-runtime revalidation of calculator source/accuracy gaps
before selecting more runtime or productization work.

No runtime import, value movement, confidence promotion, support
promotion, evidence-tier promotion, route-card movement, output-card
movement, proposal/report copy change, or workbench-input movement is
allowed in this slice. Keep
`runtime/support/confidence/evidence/API/route-card/output-card` and
`proposal/report/workbench-input` frozen.

## Objective

Re-rank the current calculator source and accuracy gaps after the
generated floor topology-delta closeout. Gate A must decide the next
bounded implementation target from current evidence, not from pilot
convenience or nearby green tests.

The practical result should be an agent-readable selection matrix that
answers:

- which source-ready runtime import, if any, is actually available now;
- which source/intake candidate needs extraction or external research
  before runtime work can start;
- whether any internal-use visibility or correctness defect outranks
  source acquisition;
- which productization or architecture tracks remain lower priority
  while calculator accuracy is active.

## Gate A - Source / Accuracy Gap Rerank

Gate A should add:

`packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`

Required candidate families:

- generated floor fallback topology-delta closeout;
- source-ready backlog wall and floor candidates;
- CLT / mass-timber wall, timber double-board stud wall, no-stud
  double-leaf wall, and lined-massive / heavy-core wall holdouts;
- historical blocked floor and wall-selector families;
- internal-use handoff, acceptance, and visibility evidence;
- fresh source acquisition or external research needed before runtime
  import;
- architecture and productization tracks that do not outrank calculator
  accuracy.

Required evidence fields:

- candidate id, current posture, and user-visible risk;
- latest executable evidence owner and doc owner;
- first missing source, metric, tolerance, or visible-test requirement;
- negative boundaries that must stay closed;
- selected next slice with target gate file and validation scope.

## Acceptance Rules

Gate A may select a runtime accuracy slice only if it names all of:

- exact topology or bounded formula/family rule;
- metric owner and lab/field context;
- tolerance owner;
- material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine and web visible tests.

Gate A may select a no-runtime source acquisition or extraction slice
when a source locator is concrete but still lacks runtime prerequisites.

Gate A must not:

- promote generated floor fallback support or confidence from topology
  near misses;
- reopen `GDMTXA04A`, `C11c`, raw open-box/open-web, wall selector,
  CLT wall, timber double-board, no-stud double-leaf, or lined-heavy
  wall from nearby green tests;
- treat internal pilot success as certification or as confidence
  promotion;
- resume productization-only work while a calculator accuracy/source
  candidate still needs ranking.

## Read Map

Before implementing Gate A, read:

- [CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md)
- [CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A_HANDOFF.md)
- [SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md)
- [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
- [INTERNAL_USE_PILOT_HANDOFF.md](./INTERNAL_USE_PILOT_HANDOFF.md)

Use public source research only if Gate A needs to verify whether a
candidate source pack has become concrete enough to extract. Public
source locators are not import approval by themselves.

## Validation

- Pre-Gate-C focused baseline is green on 2026-04-29:
  - `pnpm calculator:gate:current`;
  - engine 143 files / 691 tests;
  - web 45 files / 216 passed + 18 skipped;
  - build 5/5 with known non-fatal `sharp/@img` warnings;
  - whitespace guard clean.
- Generated-floor Gate C closeout validation is green on 2026-04-29:
  - targeted source-intake Gate C compatibility retest: 1 engine file /
    6 tests;
  - targeted generated-floor Gate C closeout: 1 engine file / 6 tests;
  - `pnpm calculator:gate:current`: engine 144 files / 697 tests, web
    45 files / 216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean;
  - `pnpm check`: lint/typecheck green, engine 277 files / 1517 tests,
    web 157 files / 890 passed + 18 skipped, build 5/5 with known
    non-fatal `sharp/@img` warnings.
- For Gate A, run the targeted v4 contract, `pnpm calculator:gate:current`,
  `git diff --check`, and `pnpm check` if Gate A is used as a release
  gate or selects a runtime/import/visible behavior candidate.
