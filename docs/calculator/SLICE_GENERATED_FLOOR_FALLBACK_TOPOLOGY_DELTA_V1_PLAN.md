# Slice Plan - Generated Floor Fallback Topology Delta v1

Slice id: `generated_floor_fallback_topology_delta_v1`

Status: CLOSED NO-RUNTIME (selected 2026-04-29 by
`post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`;
Gate A landed 2026-04-29 by
`generated-floor-fallback-topology-delta-gate-a-contract.test.ts`;
Gate C closed 2026-04-29 by
`post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`).

Current Gate A file:

`packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`

Gate C file:

`packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`

Selected next slice:

`calculator_source_gap_revalidation_v4`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`

Selection reason: `calculator_source_intake_backlog_cleanup_v1` closed
no-runtime after Gate A made every blocked source family explicit. No
source-ready runtime import exists. The generated floor fallback is the
best bounded no-runtime follow-up because existing Pliteq exact rows and
UBIQ bound rows already provide concrete source topologies, while the
live generated `floor-steel-fallback` route still lacks the deck,
resilient layer, ceiling/support, and covering topology required for
exact or bounded promotion.

No runtime import, value movement, confidence promotion, support
promotion, evidence-tier promotion, or visible card/report/input
movement is allowed in this slice. Keep
`runtime/support/confidence/evidence/API/route-card/output-card` and
`proposal/report/workbench-input` frozen.

## Objective

Build an agent-readable and executable topology-delta matrix for the
generated floor fallback family. The matrix should explain exactly why
the live generated fallback cannot yet map to:

- Pliteq exact steel-joist floor rows;
- UBIQ INEX / FL-32 bound floor rows;
- a bounded steel/open-web family rule.

The goal is not to import values. The goal is to make the first missing
topology/metric/tolerance requirement precise enough that a later slice
can either open a source-ready runtime implementation or keep the family
low-confidence with no ambiguity.

## Gate A - Topology Delta Matrix - Landed

Gate A added:

`packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`

Checkpoint:

`docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A_HANDOFF.md`

Required Gate A artifacts:

- `generated_floor_fallback_topology_delta_matrix`;
- `pliteq_exact_match_delta_register`;
- `ubiq_bound_match_delta_register`;
- `exact_bound_precedence_and_near_miss_guards`;
- `unsupported_output_low_confidence_visibility_guards`;
- `many_layer_and_reorder_stability_guard_plan`;
- `next_candidate_decision`.

Implementation read map before coding:

- [SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md)
  for the current first missing requirement and negative boundaries.
- `packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts`
  for the current live stack, Pliteq exact stack, UBIQ bound stack, and
  blocked-promotion evidence.
- `packages/catalogs/src/floor-systems/pliteq-steel-joist-rows.ts`
  for exact Pliteq source topology.
- `packages/catalogs/src/floor-systems/bound-floor-systems.ts` and
  `packages/engine/src/lightweight-steel-bound-estimate.ts` for UBIQ /
  bound-family behavior.
- Existing many-layer and layer-order floor tests before adding any
  broader fallback-family claim.

Minimum assertions:

- live `floor-steel-fallback` remains low-confidence/screening and
  `runtimeImportReadyNow: false`;
- Pliteq exact rows remain exact only when the source topology is
  actually present;
- UBIQ bound rows remain bound only when the source topology is actually
  present;
- live-stack deltas are named by role/material/thickness where relevant:
  deck, resilient layer, covering, ceiling cavity, ceiling fill, and
  support;
- `L'nT,50`, lab `Ln,w+CI`, and lab `DeltaLw` stay unsupported unless
  source evidence names them;
- exact and bound source precedence cannot be weakened by generated
  fallback logic;
- many-layer and reorder behavior remain finite and explicitly caveated;
- Gate A does not select a runtime implementation unless it names exact
  topology, metric owner, tolerance owner, negative boundaries, and
  paired engine/web visible tests.

Gate A result:

- live `floor-steel-fallback` stayed low-confidence/screening with no
  Pliteq exact match, no UBIQ bound match, and no UBIQ bound
  interpolation;
- Pliteq exact rows still fire when exact Pliteq topology is present;
- UBIQ FL-32 bound rows still fire for endpoint rows and 250 mm
  interpolation when bound topology is present;
- live-stack deltas are now executable for support, deck, resilient
  layer, covering, ceiling cavity, ceiling fill, and ceiling board;
- lab `Ln,w+CI`, lab `DeltaLw`, and field `L'nT,50` remain explicit
  unsupported outputs;
- split live-stack variants stay finite and do not promote to exact or
  bound rows;
- no runtime candidate is ready now, so Gate B is skipped and Gate C
  closeout / next-slice selection is next.

Failure response:

- If the delta matrix reveals a true exact Pliteq match, do not import
  it in Gate A. Select a bounded runtime slice with positive, negative,
  precedence, and web visible tests.
- If the delta matrix reveals only near misses, keep fallback
  low-confidence and select Gate C closeout / next-slice selection.
- If docs or tests disagree on the fallback posture, fix docs/tests
  without changing runtime behavior.

## Gate B - Runtime Candidate Only If Source-Ready

Gate B is selected only if Gate A finds a source-ready floor fallback
runtime candidate. Required before Gate B:

- exact topology or bounded family rule;
- metric owner for `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, and `L'nT,w`
  as applicable;
- tolerance owner;
- protected near misses;
- paired engine and web visible tests.

Otherwise skip Gate B and go straight to Gate C.

## Gate C - Closeout And Next Slice Selection - Landed

Gate C added:

`packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`

Checkpoint:

`docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md`

Gate C closed the topology-delta slice no-runtime because Gate A found
near misses only, not a source-ready runtime candidate. The generated
fallback was not promoted for internal-pilot convenience. Gate C
selected `calculator_source_gap_revalidation_v4`.

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`

## Validation

- Selection handoff validation is green on 2026-04-29:
  - targeted source-intake Gate C: 1 engine file / 6 tests;
  - focused current gate: engine 142 files / 685 tests, web 45 files /
    216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean;
  - broad `pnpm check`: lint/typecheck green, engine 275 files / 1505
    tests, web 157 files / 890 passed + 18 skipped, build 5/5 with the
    known non-fatal `sharp/@img` warnings.
- Gate A targeted validation is green on 2026-04-29:
  - targeted Gate A: 1 engine file / 6 tests.
- Gate A focused and broad validation is green on 2026-04-29:
  - focused current gate: engine 143 files / 691 tests, web 45 files /
    216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean;
  - broad `pnpm check`: lint/typecheck green, engine 276 files / 1511
    tests, web 157 files / 890 passed + 18 skipped, build 5/5 with the
    known non-fatal `sharp/@img` warnings.
- Gate C pre-edit focused baseline is green on 2026-04-29:
  - focused current gate: engine 143 files / 691 tests, web 45 files /
    216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean.
- Gate C targeted/focused/broad validation is green on 2026-04-29:
  - targeted source-intake Gate C compatibility retest: 1 engine file /
    6 tests;
  - targeted Gate C closeout: 1 engine file / 6 tests;
  - focused current gate: engine 144 files / 697 tests, web 45 files /
    216 passed + 18 skipped, build 5/5 with known non-fatal
    `sharp/@img` warnings, whitespace guard clean;
  - broad `pnpm check`: lint/typecheck green, engine 277 files / 1517
    tests, web 157 files / 890 passed + 18 skipped, build 5/5 with the
    known non-fatal `sharp/@img` warnings.
- Run `pnpm calculator:gate:current` before and after touching the
  selected slice.
- Use the Gate A engine contract while iterating.
- The Gate A contract is now included in
  `tools/dev/run-calculator-current-gate.ts`.
- Run `git diff --check`.
- Run `pnpm check` if Gate C is treated as the release gate.
