# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate I Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: I

Status: LANDED / WEB-VISIBLE GROUPED TOPOLOGY INPUTS / NO RUNTIME

Gate I status:

`gate_i_landed_web_visible_grouped_topology_inputs_no_runtime_selected_company_internal_acceptance_rehearsal_gate_j`

Next implementation file:

`apps/web/features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts`

## Decision

Gate I makes grouped triple-leaf topology expressible on the workbench
surface without moving the numeric runtime. The workbench can now carry
the user-visible row groups for Side A leaf, cavity 1, internal leaf,
cavity 2, Side B leaf, internal-leaf coupling, and support topology
into `AirborneContext.wallTopology`.

The web topology module is:

`apps/web/features/workbench/simple-workbench-wall-topology.ts`

The Gate I contract is:

`apps/web/features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts`

Gate I intentionally changes workbench input behavior and route-card
topology-gap visibility. It does not change runtime numeric values,
support status, confidence, evidence tier, API shape, output-card
status/value, or proposal/report metric claims.

## Web Surface

The workbench now stores and restores grouped wall topology fields:

- topology mode;
- Side A leaf row numbers;
- cavity 1 row numbers, depth, fill coverage, and absorption class;
- internal leaf row numbers;
- internal leaf coupling / bridge class;
- cavity 2 row numbers, depth, fill coverage, and absorption class;
- Side B leaf row numbers;
- support topology.

Visible row numbers are parsed to the zero-based layer groups expected
by the shared `WallTopology` schema. Out-of-range or invalid row-number
lists fail closed by omitting that role from the computed topology,
which keeps the engine's missing-field diagnostics active instead of
inventing a complete topology.

## Runtime Hold

The live split-rockwool PDF repro still returns low-confidence
`multileaf_screening_blend` `Rw 41`.

With no grouped topology, the route-card topology gap says grouped
topology is missing and the engine names the missing role groups. With
complete grouped topology, the route-card moves to source-validation
blocked, but runtime still stays on the screening blend because local
material/source-pack gaps and paired promotion tests remain open.

## Validation

Gate I focused validation completed green on 2026-05-01:

- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts --maxWorkers=1`
  green: 1 file / 4 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts features/workbench/server-project-workbench-snapshot.test.ts --maxWorkers=1`
  green: 2 files / 8 tests.
- `pnpm --filter @dynecho/web typecheck`
  green.
- `pnpm --filter @dynecho/web lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate I to the current runner: engine 178 files /
  925 tests, web 46 files / 220 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.

Gate I has been added to `tools/dev/run-calculator-current-gate.ts`.
