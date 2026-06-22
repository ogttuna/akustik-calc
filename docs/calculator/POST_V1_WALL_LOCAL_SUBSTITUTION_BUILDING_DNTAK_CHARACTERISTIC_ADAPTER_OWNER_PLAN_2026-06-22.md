# Post-V1 Wall Local-Substitution Building DnT,A,k Characteristic Adapter Owner Plan - 2026-06-22

Status:
`post_v1_wall_local_substitution_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

## Purpose

This landed runtime owner opens `DnT,A,k` for the already-owned
grouped triple-leaf local-substitution `building_prediction` adapter.
It uses the same characteristic formula already owned by the Gate AR
building route:

`DnT,A,k = DnT,A - 10log10(0.16 * V / (T0 * Sr))`

where `T0=0.5 s` and `Sr=max(partition area, 7 m2)`.

This is not a broad source crawl, UI polish pass, confidence-labeling
task, or generic docs cleanup. It increases calculator target-output
scope for a real wall stack whose building `DnT,A` was already
calculated from an owned local-substitution direct curve.

Previous refresh:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_local_substitution_building_dntak_characteristic_adapter_owner`

Previous refresh re-probed candidate:
`wall.double_leaf_framed.direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner`

Previous runtime owner status:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected candidate:
`wall.local_substitution_building_dntak_characteristic_adapter_owner`

Owner action:
`post_v1_wall_local_substitution_building_dntak_characteristic_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-local-substitution-building-dntak-characteristic-adapter-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Owner label:
`post-V1 wall local-substitution building DnT,A,k characteristic adapter owner`

Owner counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 1`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next action:
`post_v1_wall_local_substitution_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-local-substitution-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:
`post-V1 wall local-substitution building DnT,A,k characteristic adapter coverage refresh`

Selected coverage refresh landed status:
`post_v1_wall_local_substitution_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_opening_leak_building_dntak_characteristic_adapter_owner`

Selected coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Coverage refresh selected next action:
`post_v1_wall_opening_leak_building_dntak_characteristic_adapter_owner_plan`

Coverage refresh selected next file:
`packages/engine/src/post-v1-wall-opening-leak-building-dntak-characteristic-adapter-owner-contract.test.ts`

Coverage refresh selected next plan:
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`

Coverage refresh selected next label:
`post-V1 wall opening/leak building DnT,A,k characteristic adapter owner`

## Selection Card

User construction / formula family:

- grouped triple-leaf local-substitution wall;
- side A leaf: gypsum board, MLV, gypsum board;
- two porous rockwool cavities separated by an independent internal
  gypsum leaf;
- side B leaf: gypsum board, gypsum plaster, gypsum board;
- complete `building_prediction` context.

Target output opened:

- `DnT,A,k`, beside the already-owned local-substitution building
  outputs `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`.

Route:

- triple-leaf two-cavity frequency solver creates the local-substitution
  calculated direct curve;
- the local-substitution building adapter calculates `DnT,A 53.9`;
- the Gate AR characteristic adapter derives `DnT,A,k 52.4` from
  `DnT,A`, receiving-room volume, partition area, and `T0=0.5 s`.

Required physical inputs:

- grouped triple-leaf topology with leaf/cavity layer ownership;
- complete local-substitution building context:
  `buildingPredictionOutputBasis`, panel dimensions, source and
  receiving-room volumes, receiving-room RT60, flanking junction class,
  conservative flanking assumption, and junction coupling length.

`needs_input` behavior:

- missing receiving-room volume or building output basis returns
  `needs_input`;
- the result does not default characteristic volume, area, or output
  basis silently.

`unsupported` boundaries:

- apparent-only building basis keeps `DnT,A,k` unsupported;
- field context keeps `DnT,A,k` unsupported;
- lab context keeps `DnT,A,k` and `DnT,A` unsupported;
- impact aliases remain unsupported.

## Landed Runtime Behavior

- Complete local-substitution building request:
  `DnT,A 53.9`, `DnT,A,k 52.4`.
- Mixed local-substitution building request:
  `R'w 51`, `Dn,w 51`, `Dn,A 52.4`, `DnT,w 53`,
  `DnT,A 53.9`, and `DnT,A,k 52.4`.
- Runtime method remains
  `broad_accuracy_wall_triple_leaf_local_substitution_building_prediction_adapter_runtime`.
- The result carries the characteristic basis marker
  `nen_5077_characteristic_dntak_from_gate_ar_building_prediction`.
