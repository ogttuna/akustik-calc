# Post-V1 Gate EM/EN Wall Direct-Fixed Double-Leaf Bridge-Loss Owner Plan

Selected phrase: direct-fixed double-leaf bridge-loss owner.

Document role: active Gate EM selection and Gate EN work order. Read after
`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`,
`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`, and
`docs/calculator/POST_V1_GATE_EK_EL_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_PLAN_2026-06-07.md`.

DynEcho remains a calculator. This plan does not select source crawling,
confidence wording, frontend polish, or a finite scenario library. It
selects the next owner proof needed to make a physically valid visible
wall subset calculable later without borrowing the wrong formula.

## Gate EM Status

Landed gate:

`post_v1_next_numeric_coverage_gap_gate_em_plan`

Status:

`post_v1_next_numeric_coverage_gap_gate_em_landed_no_runtime_selected_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en`

Selected candidate:

`wall.direct_fixed_double_leaf_bridge_loss_owner_gap`

Selected next action:

`post_v1_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en_plan`

Selected next file:

`packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-owner-gate-en-contract.test.ts`

Gate EM counters: `candidateCount 11`, `roiAnalysisIterations: 2`,
`estimatedNextBridgeLossOwnerLedgers 1`, `estimatedNextBoundaryLedgers
4`, `estimatedRuntimeCandidateFamiliesToEvaluateAfterGateEN 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Gate EM Iteration 1 - Subtract Closed Or Already-Live Work

Gate EL reconciled current visible wall route probes and found no fresh
runtime candidate. Two high-ranked probes are already live:

- `wall.visible_advanced_wall_payload_surface_gap`: complete
  `advancedWall` payloads already calculate through Gate AY/AZ; missing
  panel dynamics remain `needs_input`; field/building aliases remain
  unsupported.
- `wall.double_leaf_framed_visible_resolver_reachability_gap`: complete
  visible double-leaf/framed lab stacks already reach the Gate S /
  resolver corridor and publish `Rw`, STC, `C`, and `Ctr`.

Gate EM also subtracts Gate CS/CU/CW/DN/DP/DG/DT/DV/DX wall route
repeats, Gate EJ ASTM input-surface work, and closed floor runtime-route
work. Supportless or roleless wall entries still correctly stop as
`needs_input`.

## Gate EM Iteration 2 - Selected Highest ROI Candidate

The highest remaining ROI is direct-fixed double-leaf bridge-loss
ownership. Current implementation evidence:

- Gate Q classifies direct-fixed double-leaf input as
  `direct_fixed_bridge`.
- Gate R treats complete direct-fixed double-leaf input as
  `negative_boundary`, not `needs_input`, because the required physical
  fields are present but the bridge-loss owner is missing.
- The current negative reason is
  `direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition_until_a_dedicated_bridge_loss_model_is_owned`.
- Gate S / resolver runtime already covers independent, twin-frame,
  shared-stud, and resilient double-leaf/framed systems; it must not be
  reused for direct-fixed leaves because that would apply the wrong
  bridge-coupling formula.

This candidate improves calculator scope only if Gate EN proves a
dedicated owner. Gate EM itself is no-runtime: no values move, no
formula is retuned, no source rows are imported, and no frontend files
are touched.

## Gate EN Work Order

Gate EN must be an owner-proof gate before any runtime promotion.

1. Pin the direct-fixed bridge-loss owner ledger for visible
   double-leaf wall input with complete leaf groups, cavity depth,
   direct-fixed support topology, and support spacing.
2. Decide whether existing physical fields are sufficient for the owner
   or whether direct-fixed-specific fields must become required
   `needs_input` fields. Do not create defaults for hidden connector
   behavior.
3. Keep independent, twin-frame, shared-stud, and resilient systems on
   the existing Gate S corridor.
4. Keep supportless or roleless flat entries as `needs_input`.
5. Keep multicavity/triple-leaf entries on their separate topology
   owners.
6. Keep lab `Rw` / STC / `C` / `Ctr` separate from field/building
   `R'w` / `Dn,w` / `DnT,w`.
7. If the owner cannot be proven with defensible inputs and boundaries,
   Gate EN must close no-runtime and rerank rather than publishing a
   guessed value.

Expected Gate EN outputs:

- accepted owner ledgers: 1 if the owner is defensible;
- negative boundary ledgers: at least 4;
- runtime value movement: 0 unless Gate EN explicitly proves and is
  scoped as a runtime gate, which is not the current selection;
- source rows imported: 0;
- frontend implementation files touched: 0.

## Rejected Directions

- Reusing the Gate S independent/resilient bridge runtime for
  direct-fixed walls.
- Aliasing lab `Rw` or STC into `R'w`, `Dn,w`, or `DnT,w`.
- Treating missing support topology or missing leaf grouping as a
  calculable route.
- Broad internet/source crawling without a selected owner and holdout
  plan.
- Confidence-label wording, report polish, storage/auth, or frontend UI
  work.

No internet research is selected for Gate EM. The local implementation
already proves the boundary and the next owner gap. If Gate EN needs
external formula evidence, it must use that evidence only to support the
owner, not to build a finite source-row catalog.

## Gate EN Owner Proof Result

Gate EN has landed as
`post_v1_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en_plan`
with status
`post_v1_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en_landed_no_runtime_selected_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo`.

Accepted owner:

`wall.direct_fixed_double_leaf.bridge_loss_owner`

Formula corridor selected for the next runtime gate:

`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`

Gate EN accepts the former Gate R negative boundary
`direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition_until_a_dedicated_bridge_loss_model_is_owned`
as an owner gap, not as a reason to reuse the Gate S independent or
resilient bridge formula. The owner was no-runtime at Gate EN; Gate EO
then implemented the selected runtime corridor below.

Required owner fields:

- `sideALeafGroup`
- `sideBLeafGroup`
- `sideALeafMassKgM2`
- `sideBLeafMassKgM2`
- `cavity1DepthMm`
- `supportTopology=direct_fixed`
- `connectionType=direct_fix`
- `supportSpacingMm`
- `directFixedEquivalentCoupledMassOwner`
- `directFixedBridgeLossOwner`
- `directFixedNoMassAirMassBoostBoundary`
- `ISO717_1_Rw_adapter`
- `ASTM_E413_STC_adapter_boundary`

Boundary ledgers pinned:

- independent, twin-frame, shared-stud, and resilient double-leaf
  systems stay on the existing Gate S owner;
- missing leaf groups, cavity depth, direct-fixed topology, connection
  type, or support spacing remains `needs_input`;
- multicavity and triple-leaf entries keep their separate family
  owners;
- lab `Rw` / STC / `C` / `Ctr` do not alias to field/building outputs;
- finite source-row crawling is not selected for this owner proof.

Gate EN counters: `acceptedOwnerLedgers 1`, `boundaryLedgersPinned 5`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next action:

`post_v1_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo_plan`

Selected next file:

`packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo-contract.test.ts`

## Gate EO Work Order

Gate EO is the first value-moving runtime candidate for this direct-fixed
subset. It may publish lab `Rw`, STC, `C`, and `Ctr` only for complete
explicit direct-fixed double-leaf inputs that satisfy the Gate EN owner
fields. It must calculate through the equivalent coupled mass bridge-loss
owner, not through the Gate S mass-air-mass boost corridor.

Gate EO must keep these boundaries:

1. Missing owner fields remain `needs_input`.
2. Independent, twin-frame, shared-stud, and resilient systems remain on
   Gate S.
3. Multicavity/triple-leaf systems remain outside the direct-fixed
   two-leaf runtime.
4. Field/building outputs remain unsupported until explicit adapters
   are selected.
5. Source rows may only override later through exact, anchor,
   calibration, or holdout owners.

## Gate EO Runtime Result

Gate EO has landed as
`post_v1_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo_plan`
with status
`post_v1_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo_landed_runtime_selected_next_numeric_coverage_gap_gate_ep`.

Runtime method:

`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`

Gate EO routes complete element-lab direct-fixed double-leaf wall stacks
through the equivalent coupled mass bridge-loss owner instead of the old
screening fallback or the Gate S mass-air-mass corridor. The
representative direct-fixed empty-cavity stack now calculates
`Rw 31 / STC 31 / C -1.2 / Ctr -5.9`.

Boundary result:

- missing `supportSpacingMm` remains `needs_input`;
- independent, twin-frame, shared-stud, and resilient systems remain on
  Gate S;
- multicavity/triple-leaf systems remain outside the direct-fixed
  two-leaf runtime;
- complete field/building requests do not select Gate EO and require
  their separate adapters;
- source rows may still override later only through exact, anchor,
  calibration, or holdout owners.

Gate EO counters: `runtimeBasisPromotions 1`,
`runtimeCorrectedLayerTemplates 1`, `runtimeCorrectedRequestShapes 4`,
`runtimeValuesMoved 4`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeFormulaRetunes 0`,
`fieldBuildingRequestShapesWidened 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_ep_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ep-contract.test.ts`
