# Next Agent Brief

Last reviewed: 2026-06-12

## Documentation Map

Use `docs/calculator/DOCUMENTATION_MAP.md` first when you need to know
which document owns which part of the handoff. It confirms that the
source-of-truth, current state, active plan, checkpoint, system map,
current gate runner, and direct-fixed A-weighted implementation files
are synchronized at the current checkpoint.

Fast path:

- checkpoint: `docs/calculator/CHECKPOINT_2026-06-11_DIRECT_FIXED_A_WEIGHTED_SURFACE_PARITY.md`;
- next plan: `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_COVERAGE_REFRESH_PLAN_2026-06-11.md`;
- next file: `packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`;
- next status: selected but not implemented;
- constraint: no runtime values, source rows, formula retunes, or frontend implementation changes in the coverage refresh.

Historical entries later in this brief keep older selected-next chains
for traceability. Use the fast path above as the current handoff.

## Checkpoint - 2026-06-11

Current reconciliation checkpoint:

`docs/calculator/CHECKPOINT_2026-06-11_DIRECT_FIXED_A_WEIGHTED_SURFACE_PARITY.md`

The checkpoint compares the active docs with the current implementation,
records the passing validation state, and confirms that the selected
next action remains the direct-fixed A-weighted field/building coverage
refresh. The selected next contract file is intentionally still absent:

`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`

## Latest Direct-Fixed A-Weighted Field/Building Surface Parity

Start with
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan`.
The previous surface parity
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, output cards, target-output status, and report
summaries now keep direct-fixed A-only values aligned: empty
`Dn,A 24.9` / `DnT,A 27`, full absorptive `Dn,A 28.9` / `DnT,A 31`,
and partial absorptive `Dn,A 26.9` / `DnT,A 29`. Field uses
`gate_i_airborne_field_apparent_context_adapter_runtime`; building uses
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
use `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building coverage refresh`.

## Latest Direct-Fixed A-Weighted Field/Building Owner

Start with
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`.
The previous runtime owner
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
Selected candidate:
`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`.
It follows
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`.
Runtime moved A-only direct-fixed `Dn,A` / `DnT,A` onto the Gate EO +
Gate I / Gate AR route: empty `24.9 / 27`, full absorptive
`28.9 / 31`, partial absorptive `26.9 / 29`. This is not a broad source
crawl. Counters: `newCalculableRequestShapes: 4`,
`correctedRequestShapes: 2`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 12`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_SURFACE_PARITY_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building surface parity`.

## Latest Numeric Gap After Direct-Fixed Context Absorptive Cavity Field/Building Adapter

Start with
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`.
The previous no-runtime rerank
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`.
Selected candidate:
`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`.
It follows the landed direct-fixed context-owned absorptive cavity
field/building adapter coverage refresh. The rerank ran
`roiAnalysisIterations: 3`, found that mixed base+A Gate ER requests
already calculate `Dn,A` / `DnT,A`, and selected the A-weighted owner
because A-only full/partial absorptive rows remain unsupported while
empty direct-fixed A-only rows can fall through a non-Gate-ER path. This
is not a broad source crawl. Counters: `candidateCount 7`,
`aWeightedOnlyUnsupportedRowsRechecked 4`,
`aWeightedOnlyMisroutedRowsRechecked 2`,
`estimatedNextRuntimeValuesMoved: 12`,
`immediateRuntimeValuesMoved: 0`, `runtimeBasisPromotions: 0`,
`runtimeFormulaRetunes: 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_OWNER_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building owner`.

## Latest Direct-Fixed Context Absorptive Cavity Field/Building Adapter Coverage Refresh

Start with
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`.
The previous slice
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It closes
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
Closed values are full `R'w 29`, `Dn,w 30`, `DnT,w 32` and partial
`R'w 27`, `Dn,w 28`, `DnT,w 30` on
`gate_i_airborne_field_apparent_context_adapter_runtime` /
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`, using
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
as the Gate EO base curve. The coverage posture remains
`ready_with_budget` / `allowed_with_budget`. This is not a broad source
crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 next numeric coverage gap after direct-fixed context absorptive cavity field/building adapter`.

## Latest Direct-Fixed Context Absorptive Cavity Field/Building Adapter Surface Parity

`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`
has landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, output cards, target-output status, and report
summaries now show the same values and basis: full `R'w 29`,
`Dn,w 30`, `DnT,w 32`; partial `R'w 27`, `Dn,w 28`, `DnT,w 30`;
field basis `gate_i_airborne_field_apparent_context_adapter_runtime`;
building basis
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`;
base curve `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter coverage refresh`.

## Latest Direct-Fixed Context Absorptive Cavity Field/Building Adapter Owner

`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
has landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_field_building_adapter_owner`.
The owner opens full/partial direct-fixed context-owned absorptive
cavity field/building outputs through
`gate_i_airborne_field_apparent_context_adapter_runtime` and
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`, using
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
as the Gate EO base curve. Full absorptive values are `R'w 29`,
`Dn,w 30`, and `DnT,w 32`; partial absorptive values are `R'w 27`,
`Dn,w 28`, and `DnT,w 30`. Lab pins remain `Rw 35`, `STC 35`,
`C -1.2`, `Ctr -5.9`; `Rw 33`, `STC 33`, `C -1.2`, `Ctr -5.9`; and
`Rw 31`, `STC 31`, `C -1.2`, `Ctr -5.9`. This is not a broad source
crawl. Counters: `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 3`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 12`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`.
Selected next file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_SURFACE_PARITY_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter surface parity`.

## Latest Direct-Fixed Context Absorptive Cavity Coverage Refresh

`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`
has landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_field_building_adapter_owner`.
It closes
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
The refresh keeps
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`
pinned: full `Rw 35`, `STC 35`, `C -1.2`, `Ctr -5.9`; partial
`Rw 33`, `STC 33`, `C -1.2`, `Ctr -5.9`; direct-fixed empty `Rw 31`,
`STC 31`, `C -1.2`, `Ctr -5.9`. It freezes the current numeric gap
where full/partial direct-fixed context-owned absorptive cavity
field/building requests remain unsupported through the Gate AY boundary.
This is not a broad source crawl. Counters:
`coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextRuntimeValuesMoved: 12`, and
`broadSourceCrawlSelected false`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter owner`.

## Latest Direct-Fixed Context Absorptive Cavity Surface Parity

`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`
has landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, output cards, target-output status, and report
summaries now expose
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`.
Full direct-fixed context-owned absorptive cavity remains `Rw 35`,
`STC 35`, `C -1.2`, `Ctr -5.9`; partial remains `Rw 33`, `STC 33`,
`C -1.2`, `Ctr -5.9`; direct-fixed empty remains `Rw 31`, `STC 31`,
`C -1.2`, `Ctr -5.9`. Missing absorber ownership, Gate AY panellized
inputs, field/building aliases, ASTM/IIC/AIIC, and impact outputs
remain outside this lab owner. This is not a broad source crawl.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner coverage refresh`.

## Latest Direct-Fixed Context Absorptive Cavity Owner

`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
has landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_owner`.
The owner promotes complete element-lab direct-fixed context-owned
absorptive cavity two-leaf stacks from Gate AY `needs_input` to
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`.
Full absorptive cavity calculates `Rw 35`, `STC 35`, `C -1.2`,
`Ctr -5.9`; partial calculates `Rw 33`, `STC 33`, `C -1.2`,
`Ctr -5.9`; direct-fixed empty remains `Rw 31`, `STC 31`, `C -1.2`,
`Ctr -5.9`. Missing absorber ownership, Gate AY panellized inputs,
field/building aliases, ASTM/IIC/AIIC, and impact outputs remain outside
this lab owner. This is not a broad source crawl. Counters:
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Historical selected surface-parity follow-up:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`.
Historical surface-parity file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts`.
Historical surface-parity plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md`.
Historical surface-parity label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner surface parity`.

## Latest Context Absorptive Cavity Coverage Refresh

`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`
has landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_owner`.
It closes
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`.
The refresh freezes the double-leaf/framed source-absent route through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`
as `ready_with_budget` / `allowed_with_budget`. Full context-owned
absorptive cavity remains `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`;
partial remains `Rw 44`, `STC 44`, `C -1`, `Ctr -6.1`; empty remains
`Rw 42`, `STC 42`, `C -1`, `Ctr -6.1`. This is not a broad source
crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextNewCalculableRequestShapes: 1`,
`estimatedNextNewCalculableTargetOutputs: 4`, and
`estimatedNextRuntimeBasisPromotions: 1`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner`.
Route family: `wall.double_leaf_framed`. Target outputs: `Rw`, `STC`,
`C`, `Ctr`. Required physical inputs: side leaf groups, side leaf masses,
cavity depth, direct-fixed support topology, support spacing, absorptive
cavity coverage/class, and context-level absorber flow-resistivity
ownership. Expected scope: direct-fixed context-owned absorptive cavity
assemblies calculate through an owned direct-fixed bridge-loss formula
path instead of Gate AY `needs_input`.

## Previous Surface Parity Closeout

Latest landed surface parity:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`.
Surface parity file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts`.
Surface parity status:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`
and
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.
The surface keeps workbench live calculation, calculator API payloads,
saved replay, server snapshot replay, output cards, target-output status,
and report summaries aligned on `Rw 46`, `STC 46`, `C -1`, and
`Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Historical selected next action after that surface parity:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`.
Historical selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts`.
Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Historical selected next label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner coverage refresh`.

Latest landed runtime owner:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`.
Owner file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`.
Owner status:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.

The owner opens context-owned full absorptive cavity double-leaf/framed
assemblies by mapping explicit absorber input to
`flowResistivitySource=user_supplied`. The pinned values are `Rw 46`,
`STC 46`, `C -1`, and `Ctr -6.1` on runtime basis
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
This is not a broad source crawl. Counters:
`newCalculableLayerTemplates: 1`, `newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 4`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Historical selected next action after that owner:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`.
Historical selected next file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts`.
Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md`.
Historical selected next label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner surface parity`.

Latest landed closeout:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`.
Closeout file:
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`.
Closeout status:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.
It closes
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_landed_no_runtime_selected_coverage_refresh`.
The route freezes `Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
and
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`,
remaining `ready_with_budget` / `allowed_with_budget`. This is not a
broad source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Historical selected next action after that route-input closeout:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`.
Historical selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`.
Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_PLAN_2026-06-11.md`.
Historical selected next label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner`.
This is value-moving calculator work: route family
`wall.double_leaf_framed`, target outputs `Rw`, `STC`, `C`, and `Ctr`,
required physical inputs are side leaf groups, cavity depth,
non-direct-fixed support topology, support spacing, explicit absorptive
cavity coverage/class, and context-level absorber flow-resistivity
ownership. Expected scope: absorptive cavity assemblies calculate
without requiring a visible porous layer.

Document role: fastest safe handoff for a new calculator agent. Read this
first to understand the mission, current checkpoint, selected next action,
and non-negotiable boundaries. Then use
`CALCULATOR_SOURCE_OF_TRUTH.md`, `CURRENT_STATE.md`, and
`NEXT_IMPLEMENTATION_PLAN.md` for the full detail. For the current
product-goal reconciliation and the required value-moving follow-up shape,
read `CALCULATOR_NEXT_VALUE_MOVEMENT_ALIGNMENT_2026-06-11.md`.

## Mission

DynEcho must become an industry-grade acoustic calculator, not a catalog
of finite assemblies and not a documentation/process project. Users enter
wall, floor, or ceiling layer combinations and route-required physical
inputs; the engine should return defensible acoustic outputs such as `Rw`,
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, `Ln,w`, `L'n,w`, `L'nT,w`,
`DeltaLw`, `IIC`, and `AIIC`.

Use this answer order:

1. exact owned measured/source row when available;
2. owned anchor, similarity, or same-basis measured path when the metric
   basis and construction boundary are proven;
3. dynamic formula route using the layer stack and required physical inputs;
4. precise `needs_input` or `unsupported` when ownership, metric basis, or
   physical input is missing.

A missing measured row is normal. It is not a reason to stop calculator
work or build a source-row library. Source research is useful only when it
feeds a bounded formula, measured-anchor delta, calibration/holdout, or
accuracy retune.

## Current Checkpoint

Latest commit at this handoff:
`5d2891d Land compatible anchor-delta building DnA checkpoint`.

Latest checkpoint:
`docs/calculator/CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md`.

Previous numeric gap action:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`.

Previous numeric gap file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`.

Previous numeric gap status:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner`.

Latest value-moving runtime owner:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`.

Owner contract:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`.

Owner status:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh`.

What now calculates:

- Knauf `416889` compatible anchor-delta paired exterior-board building
  request: building `Dn,A 49.5`;
- Knauf `416889` compatible anchor-delta one-side exterior-board building
  request: building `Dn,A 48`;
- paired building `DnT,A 51.9` and one-side building `DnT,A 50.4` remain
  live on the same Gate AR route;
- field `Dn,A 49.5 / DnT,A 51.9` and one-side field
  `Dn,A 48 / DnT,A 50.4` remain live on the Gate I route.

What must stay pinned:

- lab aliases do not become field/building `Dn,A` or `DnT,A`;
- missing `buildingPredictionOutputBasis` remains `needs_input`;
- non-selected anchors remain outside this owner;
- ASTM/IIC/AIIC remain unsupported for this wall airborne route;
- no source rows were imported;
- no direct curve, Gate I, Gate AR, or ISO 717 adapter formula was retuned.

Counters for the landed owner: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 2`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

## Latest Owner And Selected Next

Latest landed closeout:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`.

Closeout file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.

Closeout status:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_landed_no_runtime_selected_stc_only_lab_companion_owner`.

Closeout label:
`post-V1 wall compatible anchor-delta building Dn,A coverage refresh`.

This no-runtime closeout freezes the landed building `Dn,A` owner through
current-gate coverage, resolver registry/runtime candidate surfaces,
coverage matrix, and company-internal V0 expectations. It moves no runtime
values: `coverageRefreshContractFilesTouched: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`, and
`sourceRowsImported: 0`.

Latest landed value-moving owner:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan`.

Owner file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`.

Owner plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md`.

Owner status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_landed_runtime_selected_surface_parity`.

Owner label:
`post-V1 wall compatible anchor-delta STC-only lab companion owner`.

This owner is value-moving. It opens only paired and one-side Knauf
`416889` STC-only element-lab request shapes from the already-owned
shifted direct curve: paired exterior-board `STC 59` and one-side
exterior-board `STC 57`. It does not claim measured STC evidence and
keeps direct `Rw`, mixed `Rw+STC/C/Ctr`, field/building, A-weighted,
C/Ctr-only, ASTM/IIC/AIIC, non-selected-anchor, and missing-input
boundaries pinned. Counters: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest landed compatible anchor-delta STC-only lab companion surface
parity:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan`.

Surface parity file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts`.

Surface parity plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.

Surface parity label:
`post-V1 wall compatible anchor-delta STC-only lab companion surface parity`.

Surface parity status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.

Workbench live calculation, calculator API payloads, saved/server replay,
output cards, target-output status, and report summaries now carry paired
exterior-board `STC 59` and one-side exterior-board `STC 57` for the
supported Knauf compatible anchor-delta element-lab STC-only requests
through `wall.compatible_anchor_delta.calculated_lab_companions` on
runtime basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
This is not a broad source crawl.

Latest landed compatible anchor-delta STC-only lab companion coverage
refresh:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_plan`.

Coverage refresh file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts`.

Coverage refresh plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-11.md`.

Coverage refresh label:
`post-V1 wall compatible anchor-delta STC-only lab companion coverage refresh`.

Coverage refresh status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_landed_no_runtime_selected_c_ctr_only_lab_companion_owner`.

The refresh freezes `STC 59` / `STC 57`, preserves direct `Rw`, mixed
`Rw+STC/C/Ctr`, field/building, A-weighted, C/Ctr-only, ASTM/IIC/AIIC,
non-selected-anchor, and missing-input boundaries, and keeps
`wall.compatible_anchor_delta.calculated_lab_companions` on runtime basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
visible as `ready_with_budget` / `allowed_with_budget`. This is not a
broad source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableRequestShapes: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextCalculableRequestShapes: 4`, and
`estimatedNextRuntimeBasisPromotions: 1`.

Latest landed compatible anchor-delta C/Ctr-only lab companion owner:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_plan`.

Owner file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`.

Owner plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md`.

Owner label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion owner`.

Owner status:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_landed_runtime_selected_surface_parity`.

The owner is value-moving. Standalone C-only and Ctr-only element-lab
requests now calculate through the mixed lab companion route: paired
`C -1.1`, paired `Ctr -6`, one-side `C -0.6`, and one-side `Ctr -5.5`.
These are calculated values from the owned shifted curve, not measured
C/Ctr source evidence. Counters: `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 2`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest landed compatible anchor-delta C/Ctr-only lab companion surface
parity:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_plan`.

Surface parity file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`.

Surface parity plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.

Surface parity label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion surface parity`.

Surface parity status:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.

The surface proves live calculation, calculator API payloads, saved
replay, server snapshot replay, output cards, target-output status, and
report summaries keep paired `C -1.1`, paired `Ctr -6`, one-side
`C -0.6`, and one-side `Ctr -5.5` aligned through
`wall.compatible_anchor_delta.calculated_lab_companions` on runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Latest landed compatible anchor-delta C/Ctr-only lab companion coverage
refresh:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_plan`.

Coverage refresh file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-coverage-refresh-contract.test.ts`.

Coverage refresh plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-11.md`.

Coverage refresh label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion coverage refresh`.

Coverage refresh status:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_landed_no_runtime_selected_wall_double_leaf_framed_route_input_runtime_widening`.

The refresh freezes paired `C -1.1`, paired `Ctr -6`, one-side
`C -0.6`, and one-side `Ctr -5.5` through
`wall.compatible_anchor_delta.calculated_lab_companions` on runtime basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
The route remains `ready_with_budget` in coverage and
`allowed_with_budget` in company-internal V0. This is not a broad source
crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Latest landed route-input runtime widening:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_plan`.

Runtime owner file:
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts`.

Runtime owner plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_PLAN_2026-06-11.md`.

Runtime owner status:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_landed_runtime_selected_surface_parity`.

Runtime owner label:
`post-V1 wall double-leaf/framed route-input runtime widening`.

What now calculates: context-only empty-cavity double-leaf/framed walls
where two visible board leaves plus explicit `cavity1DepthMm`,
`cavity1FillCoverage empty`, `cavity1AbsorptionClass none`, side leaf
groups, support topology, and support spacing calculate element-lab
`Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`.
Context-only absorptive cavities without a visible porous-fill layer
remain `needs_input` for `cavity1FillCoverage` and `absorberClass`.
Runtime declaration: route family `wall.double_leaf_framed`; target
outputs `Rw`, `STC`, `C`, and `Ctr`; required physical inputs include
side leaf groups, side leaf masses, cavity depth, absorber class/fill and
flow resistivity, support topology, support spacing, resilient side count
when needed, and bridge class.
expected scope movement: more board/panel/context-cavity
double-leaf/framed walls calculate through the owned formula route when
those inputs are present.
Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 1`, `frontendImplementationFilesTouched: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`, and
`sourceRowsImported: 0`.

Latest landed route-input surface parity:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`.

Surface parity file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-route-input-runtime-widening-surface-parity.test.ts`.

Surface parity label:
`post-V1 wall double-leaf/framed route-input runtime widening surface parity`.

Surface parity status:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_landed_no_runtime_selected_coverage_refresh`.

Surface parity closeout: live workbench calculation, calculator API,
saved replay, server snapshot replay, output cards, target-output status,
and report summaries preserve the context-only empty-cavity two-board
result `Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1`. Missing cavity
classification stays `needs_input` for `cavity1FillCoverage` and
`absorberClass`; field/building aliases plus ASTM/IIC/AIIC remain outside
this owner. Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Historical selected next action after that surface parity:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`.

Historical selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`.

Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_COVERAGE_REFRESH_PLAN_2026-06-11.md`.

Historical selected next label:
`post-V1 wall double-leaf/framed route-input runtime widening coverage refresh`.

Do not skip directly to broad source crawling, report polish, auth/storage,
or UI polish. Those are outside the selected calculator slice unless they
directly unblock a named formula/input/anchor/calibration route.

## How To Proceed

1. Read this file, then `CALCULATOR_SOURCE_OF_TRUTH.md`, `CURRENT_STATE.md`,
   and the top/current section of `NEXT_IMPLEMENTATION_PLAN.md`.
2. Implement the selected double-leaf/framed route-input coverage
   refresh:
   `packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`.
3. Start from the landed context-only empty-cavity runtime and surface
   shape and freeze it in resolver registry, runtime surface, coverage
   matrix, and company-internal V0 posture as the bounded source-absent
   formula route.
4. Preserve direct-fixed, thick-board Auto, field/building, ASTM/IIC/AIIC,
   grouped triple-leaf/multicavity, floor-impact, exact-source, and
   missing-input boundaries.
5. Run focused tests first, then `pnpm calculator:gate:current` before a
   checkpoint commit.

Expected focused tests after the next slice should include:

- `packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`;
- `packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts`;
- `packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`;
- `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`;
- related compatible anchor-delta A-weighted and surface parity contracts.

Latest full validation at this handoff:

- `pnpm calculator:gate:current`;
- engine: 688 test files, 3810 tests passed;
- web: 119 test files, 464 tests passed and 18 skipped;
- repo build: 5 packages successful;
- whitespace guard passed.

Known non-fatal warnings: test-environment Zustand persist storage warning
and optional `sharp/@img` build warnings.
