# Post-V1 Wall Double-Leaf Framed Context Absorptive Cavity Input Owner Plan - 2026-06-11

Document role: selected value-moving follow-up after
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`.
This is calculator engine work. It is not a source-row crawl, report
polish, auth/storage work, UI polish, or another standalone ledger.

Selected next action:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`.

Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`.

Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_PLAN_2026-06-11.md`.

Selected next label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner`.

Landed owner status:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`.

Selected follow-up action:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`.

Selected follow-up file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts`.

Selected follow-up plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md`.

Surface follow-up status:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`.

Surface follow-up file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts`.

Selected coverage refresh action:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`.

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts`.

Selected coverage refresh plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md`.

Selected coverage refresh label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner coverage refresh`.

Surface follow-up counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Selected follow-up label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner surface parity`.

Previous coverage refresh:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`.

Previous coverage refresh file:
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`.

Previous coverage refresh status:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.

Previous surface parity:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`.

Previous surface parity status:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_landed_no_runtime_selected_coverage_refresh`.

The previous closeout freezes `Rw 42`, `STC 42`, `C -1`, and
`Ctr -6.1` through runtime basis
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
That route is `ready_with_budget` in coverage and `allowed_with_budget`
in company-internal V0. This is not a broad source crawl. Closeout
counters: `coverageRefreshContractFilesTouched: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`, and
`sourceRowsImported: 0`.

## Calculator Movement Declaration

Route family: `wall.double_leaf_framed`.

Target outputs: element-lab `Rw`, `STC`, `C`, and `Ctr`.

Current engine state: context-only empty cavities already calculate when
the user supplies two board leaves plus explicit `cavity1DepthMm`,
`cavity1FillCoverage empty`, `cavity1AbsorptionClass none`, side leaf
groups, support topology, and support spacing. Context-only absorptive
cavities without a visible porous layer still stop as `needs_input` for
`cavity1FillCoverage` and `absorberClass`, even when the user can provide
the absorber as physical cavity input.

Required physical inputs for this owner:

- two visible board/panel leaf groups;
- `wallTopology.topologyMode=double_leaf_framed`;
- non-direct-fixed support topology and support spacing;
- positive `cavity1DepthMm`;
- `cavity1FillCoverage full` or `partial`;
- `cavity1AbsorptionClass porous_absorptive`;
- explicit context-level cavity absorber owner, preferably
  `advancedWall.cavities[0].absorberFlowResistivityPaSM2`, with optional
  `absorberCoverageRatio` and `absorberThicknessMm`.

Expected scope movement: a real class of user-built assemblies can now
calculate without forcing the user to model the porous cavity fill as a
visible material layer. The first supported request shape is a two-board
double-leaf/framed wall with a context-owned full absorptive cavity. It
should calculate through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with visible source-absent budget and no measured-source claim.

Landed first pinned result: same two-board / 90 mm / independent-frame
shape as the empty-cavity slice, but with context-owned full absorptive
cavity input, now maps explicit cavity absorber ownership to
`flowResistivitySource=user_supplied`, applies porous damping, and
calculates `Rw 46`, `STC 46`, `C -1`, and `Ctr -6.1`. The selected
candidate is
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.

## Iteration 1 - Current Runtime Reality

The landed empty-cavity runtime owner moved one layer template and four
target outputs: `Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1`. Runtime probes
show field/building `R'w`, `Dn,w`, and `DnT,w` already calculate for the
same empty-cavity layer template when complete field/building context is
present, so a field/building owner is not the highest-value next runtime
movement.

The same probe confirms the remaining scope gap is input ownership, not a
new formula family: the double-leaf/framed formula already has terms for
`cavityFillCoverage`, `cavityAbsorptionClass`, and `flowResistivitySource`.
The route-input contract and physical-input builder currently infer
absorber ownership only from visible porous layers.

## Iteration 2 - Alternatives Rejected

Rejected: another coverage refresh, rerank, or ledger. The previous slice
already closes the no-runtime coverage refresh. Another process-only file
would not calculate more layer combinations.

Rejected: generic double-leaf/framed widening. The route already exists;
the missing value is a named physical input owner for context-owned
absorptive cavities.

Rejected: broad source research. No measured row is needed to let the
source-absent formula use explicit user-supplied cavity absorber input.
Measured evidence can later calibrate or retune the budget, but source
absence should not block this calculator route.

## Iteration 3 - Selected Owner Shape

Implement a bounded owner that treats context-owned absorptive cavity
input as a valid porous damping owner only when all required physical
inputs are present. The owner should:

- keep empty-cavity behavior unchanged at `Rw 42 / STC 42 / C -1 /
  Ctr -6.1`;
- allow absorptive context-only cavity only when fill coverage,
  absorption class, and context-level absorber flow-resistivity ownership
  are explicit;
- map explicit user-supplied context flow resistivity to
  `flowResistivitySource=user_supplied`;
- keep missing absorber input as `needs_input`, not fallback to a hidden
  default;
- preserve direct-fixed, exact/source, compatible anchor-delta,
  thick-board Auto, field/building alias, ASTM/IIC/AIIC, grouped
  triple-leaf, multicavity, and floor-impact boundaries.

Expected counters for implementation:
`newCalculableLayerTemplates: 1`, `newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 4`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

This selected next remains `ready_with_budget` / `allowed_with_budget`
only after the runtime contract lands. Until then, the existing
double-leaf/framed route remains the current `ready_with_budget` and
company-internal `allowed_with_budget` route, and absorptive context-only
cavities remain bounded by `needs_input`.
