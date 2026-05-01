# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate B Handoff

Date: 2026-04-30

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: B

Status: LANDED / TOPOLOGY INPUT CONTRACT / NO NUMERIC PROMOTION

Gate B status:

`landed_wall_triple_leaf_topology_input_contract_no_numeric_promotion_and_selected_source_calibrated_solver_gate_c`

## Decision

`packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-b-contract.test.ts`
lands the grouped wall-topology contract for detected triple-leaf
walls.

Gate B adds a shared `airborneContext.wallTopology` shape for:

- side A leaf layer group;
- cavity 1 layer group, depth, fill coverage, and absorption class;
- internal leaf layer group;
- internal leaf coupling / bridge class;
- cavity 2 layer group, depth, fill coverage, and absorption class;
- side B leaf layer group;
- support topology.

It also adds the engine-side readiness helper:

`packages/engine/src/wall-triple-leaf-topology-readiness.ts`

The helper is generic: it applies when dynamic airborne detection sees
`multileaf_multicavity` with at least three visible leaves and at least
two cavities. It does not special-case the user PDF stack.

## Runtime Posture

Gate B does not change numeric calculation. The split-rockwool repro
still returns the existing low-confidence `multileaf_screening_blend`
number until Gate C lands a source-calibrated triple-leaf solver.

What changes is the contract around that number:

- if grouped topology is missing, warnings now name the missing
  topology fields;
- if grouped topology is complete, warnings still block promotion until
  a source-calibrated triple-leaf solver, tolerance owner, and paired
  visible tests land.

## Next Step

Implement:

`packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts`

Gate C must select or reject numeric movement based on source-calibrated
triple-leaf evidence. It must not retune `multileaf_screening_blend` by
hand.

Gate C needs:

- source-backed triple-leaf / multi-cavity calibration rows or frequency
  data;
- metric ownership for lab `Rw`, field `R'w`, and `DnT,w`;
- tolerance ownership;
- negative boundaries for double leaf, stud wall, lined masonry, one-side
  lining, and floor rows;
- paired engine and web visible tests.

## Frozen Surfaces

These surfaces remain frozen in Gate B:

- runtime numeric values;
- support status;
- confidence promotion;
- evidence promotion;
- route-card values;
- output-card status;
- proposal/report copy;
- workbench UI behavior.

The shared API schema now accepts optional grouped wall topology input,
but the UI does not yet send it and the solver does not yet promote it.

## Validation

Gate B focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-b-contract.test.ts src/wall-triple-leaf-accuracy-recovery-gate-a-contract.test.ts src/dynamic-airborne-order-sensitivity.test.ts --maxWorkers=1`
  green on 2026-04-30: 3 files / 13 tests.
- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate B to the current runner:
  engine 163 files / 825 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check`
  clean on 2026-04-30.
