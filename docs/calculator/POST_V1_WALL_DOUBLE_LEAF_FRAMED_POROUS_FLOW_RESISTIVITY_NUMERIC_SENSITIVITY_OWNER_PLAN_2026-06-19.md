# Post-V1 Wall Double-Leaf/Framed Porous Flow-Resistivity Numeric Sensitivity Owner - 2026-06-19

## Purpose

This runtime owner fixes a calculator accuracy gap in the double-leaf /
framed wall formula route. Before this slice, `flowResistivityPaSM2`
was required for porous cavity ownership, but once it existed the runtime
treated `5000`, `15000`, and `50000 Pa*s/m2` as the same damping input.
That made a real user-material physical input behave like a boolean
source flag.

The owner keeps the existing nominal `15000 Pa*s/m2` pinned values, then
adds a bounded numeric damping modifier around that nominal point. Low
and high off-nominal porous flow values now reduce the porous cavity
damping credit and move the calculated lab, field, and building outputs.

This is calculator runtime work. It is not a broad source crawl, UI
work, confidence-copy work, or docs-only cleanup.

Owner action:

`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-owner-contract.test.ts`

Owner status:

`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Previous coverage refresh:

`post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

## Selected Candidate

`wall.double_leaf_framed.porous_flow_resistivity_numeric_sensitivity_owner`

## Why This Is High ROI

This directly supports the user-material physical input coverage stream:
arbitrary user-entered porous absorbers now use the actual
`flowResistivityPaSM2` value instead of only checking whether the value
is present. The same physical input flows through:

- element-lab `Rw`, `STC`, `C`, and `Ctr`;
- Gate I field outputs `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`;
- Gate AR building-prediction outputs on the same direct curve;
- context-owned `advancedWall.cavities[].absorberFlowResistivityPaSM2`
  without a visible porous layer.

## Formula Posture

Owned runtime change:

`porousDampingCreditDb = baseCoverageCredit * boundedFlowMultiplier`

where `baseCoverageCredit` is the previous full/partial coverage credit
and `boundedFlowMultiplier` is a conservative log-distance modifier
around `15000 Pa*s/m2`.

Boundary rules:

- `15000 Pa*s/m2` preserves the existing nominal pins:
  `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`, `R'w 40`, `Dn,w 41`,
  `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`.
- `5000` and `50000 Pa*s/m2` now reduce the same custom wall to
  lab `Rw 45` / `STC 45`, and field/building `R'w 39`,
  `Dn,w 40`, `Dn,A 38.5`, `DnT,w 42`, and `DnT,A 40.9`.
- Missing user-supplied `flowResistivityPaSM2` remains `needs_input`;
  the engine must not invent a numeric damping value.
- Exact measured/source rows and compatible anchors still retain
  precedence over source-absent formula predictions.

## Expected Counters

- `accuracyPromotedRequestShapes: 4`
- `accuracyPromotedTargetOutputs: 18`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 18`
- `runtimeFormulaRetunes: 1`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Selected Next

Selected next action:

`post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_FLOW_RESISTIVITY_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`

## Implementation Files

Runtime files:

- `packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts`
- `packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts`
- `packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor.ts`

Owner contract:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-owner-contract.test.ts`

## Validation

Run:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-owner-contract.test.ts \
  src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts \
  src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts \
  src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-owner-contract.test.ts \
  src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts \
  --maxWorkers=1
pnpm calculator:gate:current
git diff --check
```
