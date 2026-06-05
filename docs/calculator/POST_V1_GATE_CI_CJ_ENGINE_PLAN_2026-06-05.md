# Post-V1 Gate CI/CJ Engine Plan - 2026-06-05

Document role: focused implementation comparison and execution plan for
the current Gate CI decision and the next value-moving Gate CJ engine
slice. Read after
[CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md) and
[POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md](./POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md).

## Product Constraint

DynEcho is an acoustic calculator. This plan does not select broad
source crawling, acoustic-library expansion, confidence wording, finite
scenario packs, or frontend polish. The selected work must either:

- calculate more physically valid layer combinations through the right
  formula family when required inputs are present; or
- prevent a wrong metric/basis answer while preserving valid calculation
  routes.

## Implementation Audit

Gate CI was originally described as an ASTM `IIC` / `AIIC` expansion
candidate. The implementation already owns the safe exact ASTM baseline:

- `packages/engine/src/impact-astm-e989.ts` calculates ASTM E989 impact
  ratings from complete ASTM one-third-octave bands;
- Gate F pins exact ASTM E492 lab bands to `IIC`;
- Gate F pins exact ASTM E1007 field bands to `AIIC`;
- Gate G exposes that exact-band owner through resolver/surface parity;
- ISO impact formulas and source-absent field/building adapters still
  block ASTM aliases.

The current engine formula routes mostly own ISO impact single-number
metrics such as `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`, `CI`, and
`CI,50-2500`. They do not currently own a complete ASTM 100 Hz to
3150 Hz one-third-octave impact curve. Promoting those ISO single-number
results into `IIC` or `AIIC` would violate the metric/basis boundary and
would create a wrong calculator answer.

An explicit user-supplied ASTM band input route may be useful later, but
it requires API, workbench, report, and replay ownership. That is not
the right engine-only runtime slice while other agents are working on
frontend surfaces.

## Gate CI Decision

Gate CI should land as no-runtime evidence:

- preserve the exact ASTM E492 -> `IIC` and ASTM E1007 -> `AIIC`
  baseline;
- prove at least four ISO/source-absent impact routes keep `IIC` and
  `AIIC` unsupported;
- record that no formula-derived ASTM runtime expansion is admissible
  until a true ASTM band owner exists;
- defer user-supplied ASTM band input until the API/workbench/report/
  replay surface can be selected explicitly;
- select Gate CJ as the next value-moving engine slice.

Gate CI executable status:

- landed gate: `post_v1_next_numeric_coverage_gap_gate_ci_plan`;
- selection status:
  `post_v1_next_numeric_coverage_gap_gate_ci_landed_no_runtime_selected_wall_common_auto_topology_expansion_gate_cj`;
- selected candidate: `wall.common_auto_topology_expansion`;
- selected next action:
  `post_v1_wall_common_auto_topology_expansion_gate_cj_plan`;
- selected next file:
  `packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts`.

Expected Gate CI counters:

- `newCalculableLayerTemplates`: 0;
- `newCalculableRequestShapes`: 0;
- `runtimeCorrectedRequestShapes`: 0;
- `wrongAliasOrFallbackBlocks`: 4 representative ISO impact routes.

## Gate CJ Selection

Gate CJ should be the next runtime implementation because it directly
increases calculator scope for realistic wall layer combinations. Users
commonly enter flat layer stacks rather than manually grouped acoustic
leaves and cavities. The engine already has useful pieces:

- `packages/engine/src/wall-flat-multicavity-auto-topology.ts`;
- Gate O flat multicavity topology input support;
- Gate P double-leaf flat auto-topology;
- Gate Q full-fill multicavity auto-topology;
- Gate R field auto-topology companion;
- Gate S double-leaf field auto-topology companion;
- dynamic airborne double-leaf and multicavity formula lanes.

Gate CJ is therefore not a new research program. It should expand common
flat wall patterns only where the existing formulas and required
physical inputs are explicit.

## Gate CJ Runtime Scope

Gate CJ landed runtime status:

- landed gate: `post_v1_wall_common_auto_topology_expansion_gate_cj_plan`;
- selection status:
  `post_v1_wall_common_auto_topology_expansion_gate_cj_landed_runtime_selected_opening_leak_composite_wall_adapters_gate_ck`;
- implemented correction: common flat double-leaf wall
  `building_prediction` routes now use the Gate S double-leaf/framed
  direct curve inside the Gate AR building adapter when required owners
  are explicit;
- covered positive templates: simple independent, resilient both-sides,
  multi-board leaves, split air/porous cavity, asymmetric board count,
  and explicit double-leaf building topology;
- preserved boundaries: missing `supportTopology`, missing
  `studSpacingMm`, explicit `flat_layer_order`, missing
  `sourceRoomVolumeM3`, and missing `resilientBarSideCount` do not
  publish generic building numbers;
- counters: `newCalculableLayerTemplates 1`,
  `newCalculableRequestShapes 5`, `runtimeCorrectedLayerTemplates 5`,
  and `runtimeCorrectedRequestShapes 25`;
- selected next action:
  `post_v1_opening_leak_composite_wall_adapters_gate_ck_plan`;
- selected next file:
  `packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts`.

Target representative wall templates:

1. independent-stud gypsum / porous cavity / gypsum variants with
   multi-board leaves;
2. resilient one-side and resilient both-sides variants with explicit
   `resilientBarSideCount`;
3. double-stud or staggered-stud variants when support topology is
   explicit;
4. framed liner over masonry/concrete or mass-timber core when the core
   and liner roles are unambiguous;
5. full-fill and air-gap multicavity variants with explicit cavity/fill
   layers;
6. asymmetric board-count framed walls where leaf grouping remains
   unambiguous.

Required owner fields:

- support/stud topology;
- stud spacing where the selected formula requires it;
- resilient side count for resilient-channel routes;
- explicit cavity/fill layer order and thickness;
- material density or mass when the selected formula cannot infer it;
- field/building room context only for field/building outputs.

Required boundaries:

- ambiguous flat order does not guess;
- missing resilient side count remains `needs_input`;
- single-leaf mass law does not steal double-leaf or multileaf stacks;
- lab `Rw` does not leak into unrequested field/building metrics;
- existing Gate O-S value pins remain unchanged unless Gate CJ names a
  better owner and pins the movement.

## Execution Order

1. Land Gate CI no-runtime contract and docs alignment.
2. Add Gate CJ contract with before/after probes for currently blocked
   common wall patterns.
3. Implement the smallest topology expansion that admits real new wall
   layer templates through existing formula families.
4. Add negative tests for every new inference rule.
5. Run targeted engine tests first, then `pnpm calculator:gate:current`
   when the runtime move is ready.
