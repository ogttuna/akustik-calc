# DynEcho Agent Notes

Start here before changing calculator behavior.

## Product North Star And Drift Guard

DynEcho's purpose is to become an industry-grade acoustic calculator,
not an acoustic content library, source-row catalog, confidence-label
system, or project-management tool. Use tools such as INSUL only as
reference points for the product bar: users construct walls, floors, and
ceilings from layers and required physical inputs, and the calculator
predicts defensible airborne and impact insulation outputs.

Default every agentic implementation turn to calculator behavior. Unless
the user explicitly asks for documentation, UI polish, auth/storage,
reporting, or process work, the primary artifact should be engine or
calculator-surface work that helps DynEcho calculate more layer
combinations or calculate current combinations more accurately.

Every implementation slice must improve at least one of these two
calculator properties:

- scope: more physically valid layer combinations can calculate owned
  `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, `L'nT,w`, or related outputs
  when required inputs are present;
- accuracy: an existing calculable route becomes more correct,
  better-calibrated, or better bounded without weakening existing pinned
  answers or metric/basis boundaries.

If a proposed slice does not move calculator scope or accuracy, or
does not preserve the exact `needs_input` / `unsupported` boundaries
needed for calculation correctness, it is not the next calculator slice.
Do not spend a turn on broad source crawling, finite scenario packs,
low-confidence wording, UX polish, auth/storage, report polish, or
other non-calculator work unless the user explicitly asks for that work
and it is separated from calculator behavior.

Planning, ledgers, audits, and next-slice selection files are support
tools, not product progress by themselves. Use them only to unlock a
specific calculator improvement such as a formula route, route-input
surface, calibration/holdout, bounded measured-anchor delta, runtime
basis promotion, or accuracy retune. Do not create another no-runtime
gate when a bounded value-moving formula or input-surface slice can be
implemented safely.

Capability means the engine can answer layer combinations the user
actually builds, not that the repo contains every possible measured
assembly. The normal answer order is:

1. use an owned exact measured/source row when one exists;
2. use an owned anchor, similarity, or same-basis measured path only when
   its metric basis, construction family, and boundaries are proven;
3. otherwise calculate through the best owned dynamic formula route using
   the layer stack and route-required physical inputs;
4. return precise `needs_input` or `unsupported` when the required
   physical inputs, owner, metric basis, or route boundary is missing.

A missing measured value is expected for most layer combinations; it is
not a reason to build a source-row catalog or finite scenario library.
Source research is acceptable only when a selected calculator route names
the needed evidence, such as an exact row, calibration anchor, bounded
rule, or holdout set that can improve formula scope or accuracy.

Measured rows are preferred evidence, not the product. When an exact
measured assembly is available, use it. When a nearby measured assembly
differs by a bounded construction change, an owned anchor or delta can be
used. Otherwise the calculator must rely on the best defensible formula
route and ask for missing physical inputs instead of abandoning the
calculation goal.

## Wall Family Classification Guard

Before changing wall Auto family selection, remember the thick-board
boundary rule: a board/panel/membrane leaf is not a structural massive
substrate just because its thickness or surface mass is high. Generic
`gypsum_board`, acoustic gypsum, silentboard, security/diamond/fire
boards, cement board, OSB, plywood, MLV, bitumen membranes, and similar
board-like leaves must not silently promote a flat
`leaf / porous absorber / leaf` wall into `lined_massive_wall` or
`screening_mass_law_curve_seed_v3` from mass threshold alone.

Keep these cases on the double-leaf route-input boundary until the
route-required physical inputs are present, or until the user explicitly
selects lined-massive intent. Do not weaken the live massive-substrate
posture for concrete, AAC, masonry/brick/block/stone, CLT/mass-timber,
or other owned massive-core routes. The safety contract is
`packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts`,
and the plan is
`docs/calculator/POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md`.

## Calculator Source Of Truth

Before following any historical selected-next handoff, read:
`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`.

That file is the first authority for the product goal and next-slice
selection. DynEcho is a usable acoustic calculator: the user enters
wall/floor layers, thicknesses, requested outputs, and route-required
physical inputs; the engine must choose the right formula or owned
measured/anchor path and calculate defensible `Rw`, `R'w`, `DnT,w`,
`Ln,w`, and related outputs. It is not a catalog, finite scenario
library, or research notebook.

If that source-of-truth file conflicts with older checkpoints, roadmap
documents, or "selected next" handoffs, the source-of-truth file wins.

## Usable V1 Authority

Before following any historical selected-next handoff, read:
`docs/calculator/USABLE_V1_EXECUTION_PLAN.md`.

That file is the binding finish plan for company-internal usable V1. If
it conflicts with older roadmap, checkpoint, or slice documents, the
usable V1 execution plan wins. Do not answer "how much is left" with an
iteration count; answer with the open usable V1 acceptance steps and
their test status.

Current status: usable V1 Steps 0-5 are closed for the current
company-internal envelope. There is no automatic next V1 step. Any new
implementation must be explicitly selected as post-V1 formula coverage,
adapters, calibration/holdouts, or input-surface work.

Current selected post-V1 plan:
`docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`.

Current reconciliation checkpoint:
`docs/calculator/CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md`.

Current selected next action label:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`.

Current selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.

Latest landed compatible anchor-delta field/building surface parity:
`post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_plan`.
Surface parity file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_landed_no_runtime_selected_lab_metric_companion_owner`.
Selected next label: post-V1 wall compatible anchor-delta lab metric companion owner.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved 0`.

Latest landed compatible anchor-delta lab metric companion owner:
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_plan`.
Lab companion owner file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-owner-contract.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_landed_runtime_selected_surface_parity`.
Selected next label: post-V1 wall compatible anchor-delta lab metric companion surface parity.
Counters: `newCalculableRequestShapes 1`,
`newCalculableTargetOutputs: 3`, `runtimeBasisPromotions 1`,
`runtimeValuesMoved: 0`, and `sourceRowsImported: 0`.

Latest landed compatible anchor-delta lab metric companion surface parity:
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_plan`.
Lab companion surface parity file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-lab-metric-companion-surface-parity.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
Selected next label: post-V1 wall compatible anchor-delta lab metric companion coverage refresh.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved 0`.

Latest landed compatible anchor-delta lab metric companion coverage refresh:
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_plan`.
Coverage refresh file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-coverage-refresh-contract.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_one_side_lab_metric_companion_owner`.
The refresh freezes
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
as a `ready_with_budget` source-absent solver and `allowed_with_budget`
company-internal V0 row. It re-probes the paired exterior-board Knauf LSF
values `Rw 59 / STC 59 / C -1.1 / Ctr -6` and keeps single `Rw`,
`STC`-only, field/building, and one-side exterior-board mixed requests
off that paired-board owner. This refresh is not a broad source crawl.
Selected next label: post-V1 wall compatible anchor-delta one-side lab
metric companion owner.
Counters: `coverageRefreshContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeBasisPromotions 0`,
`runtimeValuesMoved 0`, and `sourceRowsImported: 0`.

Latest landed compatible anchor-delta one-side lab metric companion owner:
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_plan`.
One-side owner file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-owner-contract.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_landed_runtime_selected_surface_parity`.
The owner extends
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
from paired exterior-board Knauf LSF to exactly one exterior-board delta.
One-side `element_lab` mixed `Rw+STC/C/Ctr` requests now calculate
`Rw 57 / STC 57 / C -0.6 / Ctr -5.5`. Single `Rw` still stays on the
direct compatible anchor-delta owner, STC-only remains unsupported,
and field/building, A-weighted, ASTM, and non-Knauf rows stay outside
this owner. This is not a broad source crawl.
Selected next label: post-V1 wall compatible anchor-delta one-side lab
metric companion surface parity.
Counters: `newCalculableRequestShapes 1`,
`newCalculableTargetOutputs: 3`, `runtimeBasisPromotions 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest landed compatible anchor-delta one-side lab metric companion surface
parity:
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_plan`.
One-side surface parity file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-surface-parity.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
Workbench live calculation, calculator API payloads, saved replay, server
snapshot replay, output cards, and report summaries now keep the one-side
exterior-board Knauf LSF lab companion values aligned:
`Rw 57 / STC 57 / C -0.6 / Ctr -5.5`. The surface exposes
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
Direct single `Rw` remains on
`wall.compatible_anchor_delta.extra_board_on_verified_lsf`, STC-only
remains unsupported, and field/building, A-weighted, ASTM, and non-Knauf
rows remain outside this owner. This is not a broad source crawl.
Selected next label: post-V1 wall compatible anchor-delta one-side lab
metric companion coverage refresh.
Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts`.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest landed compatible anchor-delta one-side lab metric companion
coverage refresh:
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_plan`.
Coverage refresh file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_one_side_lab_companion`.
The refresh freezes
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
as a one-side-aware `ready_with_budget` source-absent solver and
`allowed_with_budget` company-internal V0 row. It re-probes the one-side
exterior-board Knauf LSF values
`Rw 57 / STC 57 / C -0.6 / Ctr -5.5` and keeps direct single `Rw`,
STC-only, field/building, A-weighted, ASTM, and non-Knauf rows outside
that lab companion owner. This is not a broad source crawl.
Selected next label: post-V1 next numeric coverage gap after one-side lab
companion.
Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest landed numeric coverage gap after one-side lab companion:
`post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_plan`.
Rerank contract file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts`.
Plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_ONE_SIDE_LAB_COMPANION_PLAN_2026-06-10.md`.
Status:
`post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_landed_no_runtime_selected_compatible_anchor_delta_a_weighted_owner`.
Selected candidate:
`wall.compatible_anchor_delta.a_weighted_field_building_adapter_owner`.
The rerank subtracts the now-closed compatible anchor-delta direct `Rw`,
field/building `R'w`/`Dn,w`/`DnT,w`, paired lab companion, and one-side
lab companion lanes. At that checkpoint, it selected the A-weighted owner
because the engine already computed compatible anchor-delta `Dn,A` /
`DnT,A` companions but kept them unsupported until metric owners landed.
Expected follow-up movement was paired and one-side field `Dn,A` /
`DnT,A` plus paired and one-side building `DnT,A`; building `Dn,A` stayed
parked until the later building `Dn,A` owner below landed.
This is not a broad source crawl.
Selected next label: post-V1 wall compatible anchor-delta A-weighted field/building adapter owner.
Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts`.
Counters: `candidateCount: 6`, `roiAnalysisIterations: 3`,
`estimatedNextRuntimeValuesMoved: 6`, `immediateRuntimeValuesMoved: 0`,
`runtimeBasisPromotions: 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest landed compatible anchor-delta A-weighted field/building adapter
owner:
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan`.
A-weighted owner file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_landed_runtime_selected_surface_parity_input_acceptance`.
The owner promotes the already-computed compatible anchor-delta
A-weighted companions for the Knauf `416889` reduced-stack lane:
paired field `Dn,A 49.5 / DnT,A 51.9`, one-side field
`Dn,A 48 / DnT,A 50.4`, paired building `DnT,A 51.9`, and one-side
building `DnT,A 50.4`. At this owner checkpoint, building `Dn,A` stayed
parked until the later building `Dn,A` owner below landed. Lab aliases,
ASTM/IIC/AIIC, and non-`416889` compatible anchors remain unsupported.
This is not a broad source crawl and does not retune Gate I, Gate AR, or
the direct anchor-delta curve.
Selected next label: post-V1 wall compatible anchor-delta A-weighted field/building surface parity input acceptance.
Selected next file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts`.
Selected next action:
`post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan`.
Counters: `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 4`,
`runtimeBasisPromotions 2`, `runtimeValuesMoved 6`,
`runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest landed compatible anchor-delta A-weighted field/building surface
parity:
`post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan`.
A-weighted surface parity file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_landed_no_runtime_selected_coverage_refresh`.
Workbench live calculation, calculator API payloads, saved replay, server
snapshot replay, output cards, target-output status, and report summaries
now keep compatible anchor-delta A-only requests aligned: paired field
`Dn,A 49.5 / DnT,A 51.9`, one-side field `Dn,A 48 / DnT,A 50.4`,
paired building `DnT,A 51.9`, and one-side building `DnT,A 50.4`. At
this surface checkpoint, building `Dn,A` was still parked; the later
building `Dn,A` owner below now promotes it. The workbench posture labels
supported Gate AR building outputs as `Airborne building prediction`
instead of a generic field-continuation carry-over. This is not a broad
source crawl and moves no runtime values.
Selected next label: post-V1 wall compatible anchor-delta A-weighted field/building coverage refresh.
Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts`.
Selected next action:
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan`.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest landed compatible anchor-delta A-weighted field/building coverage
refresh:
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan`.
Coverage refresh file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_a_weighted_field_building`.
The refresh freezes the Knauf `416889` A-weighted field/building route
in resolver registry, runtime adapter, runtime surface, coverage matrix,
and company-internal V0: `wall.airborne_field_context.field_apparent_adapter`
stays `ready_with_budget` / `allowed_with_budget` on
`gate_i_airborne_field_apparent_context_adapter_runtime`, and
`candidate_airborne_building_prediction_all_owner_family_physics_prediction`
stays `ready_with_budget` / `allowed_with_budget` on
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
It re-probes paired field `Dn,A 49.5 / DnT,A 51.9`, one-side field
`Dn,A 48 / DnT,A 50.4`, paired building `DnT,A 51.9`, and one-side
building `DnT,A 50.4`; at that refresh checkpoint building `Dn,A` was
still outside the owner. The later building `Dn,A` owner below now
promotes it, while lab aliases, ASTM/IIC/AIIC, missing-input, and
non-`416889` rows remain outside the route. This is not a broad source
crawl and moves no runtime values.
Selected next label: post-V1 next numeric coverage gap after A-weighted
field/building.
Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`.
Selected next action:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest landed numeric coverage gap after A-weighted field/building:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`.
Rerank contract file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`.
Plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-10.md`.
Status:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner`.
Selected candidate:
`wall.compatible_anchor_delta.building_dn_a_owner`.
The rerank subtracts the closed compatible anchor-delta direct `Rw`,
field/building base metrics, paired and one-side lab companions, field
`Dn,A`/`DnT,A`, and building `DnT,A`. It selects the building Dn,A owner
because the Gate AR compatible anchor-delta route already carries paired
building `Dn,A 49.5` and one-side building `Dn,A 48` as computed values,
but they remain unsupported behind an explicit separate-owner warning.
Non-Knauf formula widening, route-input work, and A-weighted budget
tightening stay lower-ranked until they have owned evidence or inputs.
This is not a broad source crawl and moves no runtime values in the
selection step.
Selected next label: post-V1 wall compatible anchor-delta building Dn,A
owner.
Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`.
Selected next action:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`.
Counters: `candidateCount: 6`, `roiAnalysisIterations: 3`,
`closedAWeightedRowsRechecked: 4`,
`buildingDnAUnsupportedRowsRechecked: 2`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextRuntimeValuesMoved: 2`, `immediateRuntimeValuesMoved: 0`,
`frontendImplementationFilesTouched: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`, and
`sourceRowsImported: 0`.

Latest landed compatible anchor-delta building Dn,A owner:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`.
Owner contract file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh`.
The owner promotes the already-computed Gate AR compatible anchor-delta
building `Dn,A` values: paired exterior-board building `Dn,A 49.5` and
one-side exterior-board building `Dn,A 48`. It keeps the same shifted
Knauf `416889` direct curve, Gate AR building-prediction basis, and ISO
717 C adapter term; no source rows were imported and no formula was
retuned. Lab aliases, missing `buildingPredictionOutputBasis`,
non-selected anchors, and ASTM/IIC/AIIC remain boundary rows. Selected
next action:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.
Selected next label: post-V1 wall compatible anchor-delta building Dn,A
coverage refresh.
Counters: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 2`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

Gate EM/EN plan:
`docs/calculator/POST_V1_GATE_EM_EN_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_PLAN_2026-06-07.md`.

Gate EP/EQ plan:
`docs/calculator/POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md`.

Gate EQ/ER runtime plan:
`docs/calculator/POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md`.

Gate ES/ET boundary plan:
`docs/calculator/POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md`.

Thick-board Auto family-boundary safety plan:
`docs/calculator/POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md`.
This bounded follow-up is implemented and locally validated. It must be
read before changing the `gypsum_board 12.5 / rockwool 50 /
gypsum_board 100` ambiguity or any related board/panel-to-
`lined_massive_wall` Auto classification. Do not blanket-park existing
concrete/AAC/brick/CLT lined-massive or heavy-core routes.
The focused safety contract currently has 62 engine tests, and the
workbench payload contract has 4 web tests. Both are registered in
`pnpm calculator:gate:current`.

Gate EU/EV current coverage accuracy gap ledger plan:
`docs/calculator/POST_V1_GATE_EU_EV_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md`.

Gate EV/EW heavy-core lined-massive calibration owner plan:
`docs/calculator/POST_V1_GATE_EV_EW_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_PLAN_2026-06-09.md`.

Gate EX/EY heavy-core lined-massive targeted evidence plan:
`docs/calculator/POST_V1_GATE_EX_EY_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_PLAN_2026-06-09.md`.

Gate EY/EZ heavy-core lined-massive targeted evidence closeout plan:
`docs/calculator/POST_V1_GATE_EY_EZ_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_CLOSEOUT_PLAN_2026-06-09.md`.

Gate EZ/FA current coverage accuracy gap ledger plan:
`docs/calculator/POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md`.

Gate FA/FB opening leak common wall residual owner plan:
`docs/calculator/POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md`.

Gate FB/FC opening leak common wall owner closeout and next numeric gap plan:
`docs/calculator/POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md`.

Gate FC/FD floor raw-bare floating holdout plan:
`docs/calculator/POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md`.

Gate FD/FE floor raw-bare floating holdout closeout plan:
`docs/calculator/POST_V1_GATE_FD_FE_FLOOR_RAW_BARE_FLOATING_HOLDOUT_CLOSEOUT_PLAN_2026-06-09.md`.

Gate FE/FF current formula scope accuracy ledger plan:
`docs/calculator/POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md`.

Latest landed no-runtime formula scope/accuracy ledger:
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`
with status
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_landed_no_runtime_selected_post_double_leaf_framed_wall_banded_coverage_revalidation`.
Gate FF selected
`wall.double_leaf_framed_post_runtime_coverage_revalidation_after_direct_fixed_gate_er`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate FF
subtracts already-live single-leaf mass-law, non-direct-fixed
double-leaf/framed, direct-fixed double-leaf field/building, historical
candidate-matrix/company-internal rehearsal, Gate FD floor holdout, Gate
FB opening/leak common-wall residual, Gate EY heavy-core / lined-massive,
and broad-source-crawl lanes. It moves no runtime values and imports no
source rows. Gate FF selects:
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
in
`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextPostDoubleLeafRevalidationRows 1`,
`estimatedNextRuntimeCandidateFamiliesToRerank 4`,
`closedRuntimeRowsRechecked 5`, `blockedOwnerOrHoldoutRows 3`,
`openHistoricalSelectedNextFilesStillMissing 1`,
`immediateRuntimeCandidatesSelected 0`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Previous landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_fe_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_fe_landed_no_runtime_selected_current_formula_scope_accuracy_gap_ledger_gate_ff`.
Gate FE selected
`calculator.current_formula_scope_accuracy_gap_ledger_after_gate_fd_closeout`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate FE
subtracts the Gate FD floor holdout rejection, Gate FB opening/leak and
common-wall owner rejection, Gate EY heavy-core / lined-massive owner
rejection, stale cartography `runtime_widening` labels for heavy-core,
timber stud, CLT, and steel fallback, and the blocked Rockwool source
packet lane. Gate FE moves no runtime values and imports no source rows.
It selects Gate FF:
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`
in
`packages/engine/src/post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextFormulaScopeLedgerRows 1`,
`estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
`staleCartographyRuntimeWideningRows 4`,
`blockedOwnerOrHoldoutRows 3`,
`sourcePacketRowsRejectedAsCurrentRuntime 1`,
`immediateRuntimeCandidatesSelected 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Previous landed no-runtime floor raw-bare/floating holdout closeout:
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan`
with status
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fe`.
Gate FD owner rejected:
`floor.raw_bare_and_floating.same_basis_holdout_owner_rejected_missing_admissible_holdouts`.
Gate FD evaluated only the three Gate CL floor ledgers selected by Gate
FC: open-box raw-bare lab impact, open-web raw-bare lab impact, and the
Gate CH heavy-floating field companion. All three still have no
admissible same-basis holdout: source-absent formula outputs cannot
validate themselves, packaged/finished/supported-band rows are not
raw-bare holdouts, and the Gate CH published `Ln,w` anchor plus field
adapter outputs are not measured direct+flanking field holdouts. Runtime
values and budgets remain frozen. Gate FD selects Gate FE:
`post_v1_next_numeric_coverage_gap_gate_fe_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts`.
Counters: `ownerLedgersRejected 3`, `admissibleHoldoutLedgers 0`,
`evaluatedGateCLResidualLedgers 3`,
`rejectedCandidateEvidenceLedgers 6`, `boundaryLedgersPinned 7`,
`runtimeBudgetTighteningAdmitted 0`, `broadSourceCrawlSelected false`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Previous landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_fc_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_fc_landed_no_runtime_selected_floor_raw_bare_and_floating_same_basis_holdout_gate_fd`.
Gate FC selected
`floor.raw_bare_and_floating_same_basis_holdout_prerequisite_after_gate_fb`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate FC
subtracts Gate FB-rejected opening/leak/common-wall budget tightening,
Gate EY/EW-rejected heavy-core retune, and already-closed direct-fixed,
reinforced-concrete visible-derived, thick-board safety, ASTM
exact-band, and steel visible input-surface repeats. No safe immediate
value-moving runtime candidate remains from current evidence; Gate FC
therefore selects Gate FD, a bounded targeted same-basis holdout
prerequisite for floor raw-bare/floating residual accuracy. It is not a
broad source crawl. Gate FC selects
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan`
in
`packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts`.
Counters: `candidateCount 10`, `blockedByGateFBOwnerRejectionRows 2`,
`blockedHeavyCoreOwnerRejectedRows 1`, `closedRepeatRows 5`,
`estimatedNextTargetedHoldoutLedgers 3`,
`floorResidualLedgersSelected 3`, `immediateRuntimeCandidatesSelected
0`, `broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest landed no-runtime opening/leak common wall owner closeout:
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`
with status
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fc`.
Gate FB owner rejected:
`wall.opening_leak_common_wall.same_basis_residual_owner_rejected_missing_holdouts`.
Gate FB rejected runtime budget tightening for
`wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`
because source-owned same-basis holdouts are absent for opening/leak
field, opening/leak building, opening/leak A-weighted, and common wall
building residuals. Field/building/A-weighted values and budgets remain
frozen: field `8`, building `10`, A-weighted field `9`, and A-weighted
building `11`. Gate FB selected Gate FC:
`post_v1_next_numeric_coverage_gap_gate_fc_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts`.
Counters: `ownerLedgersRejected 5`, `sameBasisHoldoutLedgersMissing 5`,
`boundaryLedgersPinned 7`, `runtimeBudgetTighteningAdmitted 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest landed no-runtime current coverage/accuracy gap ledger:
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan`
with status
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_landed_no_runtime_selected_opening_leak_common_wall_same_basis_residual_owner_gate_fb`.
Gate FA selected
`wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`.
Gate FA re-read current implementation after Gate EY/EZ: opening/leak
field/building and A-weighted runtime rows are live, but they remain
source-absent with wide budgets; Gate CL also left the common wall
building residual and opening/leak residuals without same-basis
holdouts. Gate FA selected Gate FB, a no-runtime same-basis residual
owner proof:
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`
in
`packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts`.
Counters: `ledgerRows 11`, `candidateCount 11`, `ownerGapRows 1`,
`runtimeCandidateRowsHeldBehindOwner 2`, `closedRepeatRows 5`,
`blockedHeavyCoreOwnerRejectedRows 1`, `blockedNonGoalRows 1`,
`estimatedNextOwnerLedgers 1`,
`estimatedNextRuntimeCandidateFamiliesAfterOwner 2`,
`estimatedNextBoundaryLedgers 3`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_ez_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ez_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_fa`.
Gate EZ selected
`calculator.current_coverage_accuracy_gap_ledger_after_gate_ey_owner_rejection_closeout`.
Gate EY left the heavy-core / lined-massive owner rejected: MWI.2A and
B226010 remain targeted evidence context only, not runtime owners. Gate
EZ therefore selects Gate FA, a fresh current coverage/accuracy gap
ledger, instead of heavy-core retune, opening/leak holdout tightening
without a current owner ledger, closed repeats, broad source crawling,
confidence wording, or frontend polish. Gate EZ selects Gate FA:
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan`
in
`packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextGapLedgers 1`, `estimatedNextBoundaryLedgers 2`,
`estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
`heavyCoreLinedMassiveRuntimeStillBlocked true`,
`broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Previous landed no-runtime targeted evidence action:
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan`
with status
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_landed_no_runtime_owner_remains_rejected_selected_next_numeric_coverage_gap_gate_ez`.
Gate EY decision:
`wall.heavy_core_lined_massive.targeted_evidence_acquired_owner_still_rejected_no_runtime_admissible_row_or_rule`.
Gate EY accepted MWI.2A and B226010 only as targeted wall-specific
evidence contexts. The owner remains rejected because neither context is
runtime-admissible for the live generic heavy-core / lined-massive
route, and no bounded wall lining rule with coefficient scope, local
tolerance, holdouts, and negative boundaries was accepted. This is not a
broad source crawl. Gate DG `bounded_prediction` values remain frozen.
Gate EY selects Gate EZ:
`post_v1_next_numeric_coverage_gap_gate_ez_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts`.
Counters: `targetedEvidenceLedgers 6`,
`acceptedTargetedEvidenceLedgers 2`,
`runtimeAdmissibleEvidenceLedgers 0`,
`acceptedBoundedWallLiningRules 0`,
`calibrationOwnerRemainsRejected true`,
`broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Previous landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_ex_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ex_landed_no_runtime_selected_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey`.
Gate EX selects
`wall.heavy_core_lined_massive_targeted_evidence_acquisition_after_owner_rejection`.
This is targeted evidence acquisition, not a broad source crawl: Gate EY
must look only for a wall-specific lined concrete or heavy-masonry source
row, or a bounded wall lining rule with coefficient scope, local
tolerance, holdouts, and negative boundaries. Current Gate DG
`bounded_prediction` values remain frozen. Gate EX selects Gate EY:
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan`
in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations 2`,
`targetedEvidenceAcquisitionSelected true`,
`broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Previous landed no-runtime calibration owner proof:
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan`
with status
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_ex`.
Gate EW owner rejected:
`wall.heavy_core_lined_massive.calibration_owner_rejected_missing_wall_specific_source_or_bounded_rule`.
The current evidence still lacks a wall-specific lined concrete or
heavy-masonry source row and lacks a named bounded wall lining rule with
coefficient scope, local tolerance, holdouts, and protected negative
boundaries. Gate EW keeps bounded_prediction values frozen and selects
Gate EX:
`post_v1_next_numeric_coverage_gap_gate_ex_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts`.
Counters: `acceptedOwnerLedgers 0`,
`calibrationOwnerRejectedLedgers 1`, `evidenceBoundaryLedgersPinned 8`,
`metricBasisBoundariesPinned 4`, `wallSpecificPositiveRowsAccepted 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Previous landed no-runtime current coverage/accuracy gap ledger:
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan`
with status
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_landed_no_runtime_selected_wall_heavy_core_lined_massive_calibration_owner_gate_ew`.
Gate EV selects
`wall.heavy_core_lined_massive_calibration_owner_gap_after_bounded_basis`
from the current implementation ledger. The selected next action is the
heavy-core / lined-massive calibration owner Gate EW:
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan`
in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts`.
Gate EV is a no-runtime ledger: it classifies 10 current rows, keeps the
Gate DG `bounded_prediction` values frozen, and proves that any later
heavy-core / lined-massive retune must first name a wall-specific owner
and holdout/tolerance boundary. Counters: `ledgerRows 10`,
`currentEvidenceSurfaces 10`, `ownerGapRows 1`,
`runtimeCandidateRowsHeldBehindOwner 1`, `estimatedNextOwnerLedgers 1`,
`estimatedNextRuntimeCandidateFamiliesAfterOwner 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Previous landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_eu_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_eu_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_ev`.
Gate EU selects
`calculator.current_coverage_accuracy_gap_ledger_after_gate_et_and_thick_board`
after two ROI plan iterations (`roiAnalysisIterations: 2`). It subtracts
the closed Gate ET reinforced-concrete boundary, the landed thick-board
route-family safety guard, closed Gate ER direct-fixed field/building
runtime, Gate EL visible-wall reconciliation repeats, Gate EJ ASTM
exact-band repeats, Gate DK steel visible-surface repeats, blocked
formula retunes without owner/holdout evidence, and non-goal source
crawling, confidence wording, or frontend polish. Gate EU moves no
runtime values and imports no source rows. Counters: `candidateCount
10`, `estimatedNextGapLedgers 1`, `estimatedNextBoundaryLedgers 2`,
`estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EU selects Gate EV:
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan` in
`packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts`.
Gate EV has since landed and selected the heavy-core / lined-massive
calibration owner Gate EW named above.

Latest landed no-runtime boundary action:
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`
with status
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu`.
Gate ET pins the reinforced-concrete visible-derived missing-input boundary
after Gate ES selected it. Visible-derived combined
upper/lower reinforced-concrete floor stacks now keep `Ln,w` /
`DeltaLw` parked as `needs_input` with exactly
`resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2` missing;
`ceilingOrLowerAssembly` is not requested because the lower assembly is
already represented by visible layer roles. Explicit partial predictor
input still requires `loadBasisKgM2` and `ceilingOrLowerAssembly`, and
complete explicit input still calculates `Ln,w 58.1` / `DeltaLw 13.7`
through the heavy-concrete combined formula corridor. Boundary id:
`floor.reinforced_concrete.visible_derived_lower_assembly_from_layers_missing_dynamic_stiffness_and_load`.
Counters: `boundaryLedgersPinned 1`,
`staleExpectationRowsCorrected 6`, `currentGateFailuresCleared 6`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 1`. Gate ET selects Gate EU:
`post_v1_next_numeric_coverage_gap_gate_eu_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts`.

Latest boundary-preservation checkpoint:
`fb0ea67 Fix double-leaf route input boundary` after Gate ET. Flat
`leaf / porous absorber / leaf` wall stacks without complete double-leaf
topology/support inputs now remain parked as `needs_input` instead of
publishing a screening fallback; complete topology still calculates
through the owned double-leaf/framed route. The fix is documented in
`docs/calculator/CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md`.
Follow-up implementation on 2026-06-09 guards thick generic
`gypsum_board` and other board/panel/membrane leaves from flipping the
same flat Auto stack into `lined_massive_wall` /
`screening_mass_law_curve_seed_v3` by surface mass alone. Do not treat
that as permission to park every lined-massive fallback:
concrete/AAC/brick/CLT massive-core lanes are intentionally live, and
future work must keep distinguishing board/panel double-leaf intent from
true massive substrate intent.
It moved no formula values, imported no source rows, and remained a
landed safety record. Gate EW has now landed owner rejected and selected
Gate EX, the next numeric coverage/accuracy gap rerank named above.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_es_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et`.
Gate ES selects
`floor.reinforced_concrete_visible_derived_missing_input_boundary_refresh`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate ES
subtracts the now-closed Gate ER direct-fixed field/building runtime,
closed direct-fixed owner/lab repeats, already-live reinforced-concrete
complete formula input, explicit partial boundaries that still need
`ceilingOrLowerAssembly`, closed ASTM/wall repeats, unsafe cross-family
`DeltaLw` subtraction, source crawling, confidence wording, and
frontend polish. Counters: `candidateCount 10`,
`estimatedNextBoundaryLedgers 1`,
`estimatedNextCurrentGateFailuresCleared 6`,
`estimatedNextStaleExpectationRowsCorrected 6`,
`estimatedNextFrontendImplementationFilesTouched 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate ES selects Gate ET:
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`
in
`packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts`.

Latest landed value-moving runtime action:
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`
with status
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es`.
Gate ER connects the Gate EO direct separating-element curve for the
bounded direct-fixed empty-cavity wall to the owned field/building
adapters. Complete `field_between_rooms` requests now select
`gate_i_airborne_field_apparent_context_adapter_runtime` and complete
`building_prediction` requests now select
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
calculate `R'w 23 / Dn,w 24 / DnT,w 27` for the representative
`gypsum_board 12.5 / air_gap 45 / gypsum_board 12.5` stack with complete
route-required context. Lab output remains Gate EO at
`Rw 31 / STC 31 / C -1.2 / Ctr -5.9`, missing `receivingRoomRt60S` and
missing `supportSpacingMm` remain `needs_input`, and no source rows or
frontend implementation are touched. Counters:
`fieldBuildingRequestShapesWidened 3`, `newCalculableLayerTemplates 1`,
`newCalculableRequestShapes 3`, `runtimeBasisPromotions 2`,
`runtimeCorrectedLayerTemplates 1`, `runtimeCorrectedRequestShapes 3`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 6`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate ER selects Gate ES:
`post_v1_next_numeric_coverage_gap_gate_es_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts`.

Latest landed no-runtime adapter owner proof:
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq_plan`
with status
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq_landed_no_runtime_selected_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er`.
Gate EQ accepts owners
`wall.direct_fixed_double_leaf.field_between_rooms_adapter_owner` and
`wall.direct_fixed_double_leaf.building_prediction_adapter_owner`. It
proves that the Gate EO direct separating-element curve can be used as
the base for bounded direct-fixed double-leaf field/building adapters
when the field/building route-required physical inputs are present. It
keeps lab `Rw`/STC/`C`/`Ctr` separate from `R'w`/`Dn,w`/`DnT,w`,
keeps missing support spacing, room RT60, and building/flanking context
as `needs_input`, and moves no runtime values. Counters:
`acceptedAdapterOwnerLedgers 2`, `boundaryLedgersPinned 8`,
`estimatedNextNewCalculableLayerTemplates 1`,
`estimatedNextNewCalculableRequestShapes 3`,
`estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 3`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EQ selects Gate ER, the
direct-fixed double-leaf field/building adapter runtime:
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`
in
`packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank before Gate EQ:
`post_v1_next_numeric_coverage_gap_gate_ep_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ep_landed_no_runtime_selected_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq`.
Gate EP selects
`wall.direct_fixed_double_leaf_field_building_adapter_owner_gap` after
two ROI plan iterations (`roiAnalysisIterations: 2`). Gate EO closed
the element-lab direct-fixed bridge-loss route, but complete
direct-fixed `field_between_rooms` requests still calculate
`R'w`/`Dn,w`/`DnT,w` through `screening_mass_law_curve_seed_v3`, and
complete `building_prediction` requests still stop as
`dynamic_calculator_building_prediction_runtime_adapter_owner_missing`.
Gate EP therefore selects Gate EQ, a no-runtime owner proof for the
direct-fixed double-leaf field/building adapter. Counters:
`candidateCount 9`, `estimatedNextAdapterOwnerLedgers 2`,
`estimatedNextNewCalculableLayerTemplates 1`,
`estimatedNextNewCalculableRequestShapes 3`,
`estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 3`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EP selects Gate EQ:
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq_plan`
in
`packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-owner-gate-eq-contract.test.ts`.

Latest landed value-moving runtime action:
`post_v1_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo_plan`
with status
`post_v1_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo_landed_runtime_selected_next_numeric_coverage_gap_gate_ep`.
Gate EO routes complete element-lab direct-fixed double-leaf wall stacks
through
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
instead of the old screening fallback or the Gate S mass-air-mass
corridor. The representative direct-fixed empty-cavity stack now
calculates `Rw 31 / STC 31 / C -1.2 / Ctr -5.9`. Missing
`supportSpacingMm` remains `needs_input`, independent/resilient
double-leaf systems stay on Gate S, and field/building requests do not
select Gate EO. Counters: `runtimeBasisPromotions 1`,
`runtimeCorrectedLayerTemplates 1`, `runtimeCorrectedRequestShapes 4`,
`runtimeValuesMoved 4`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeFormulaRetunes 0`,
`fieldBuildingRequestShapesWidened 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EO selects Gate EP:
`post_v1_next_numeric_coverage_gap_gate_ep_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ep-contract.test.ts`.

Latest landed no-runtime owner proof:
`post_v1_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en_plan`
with status
`post_v1_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en_landed_no_runtime_selected_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo`.
Gate EN accepts owner
`wall.direct_fixed_double_leaf.bridge_loss_owner` and selects the
formula corridor
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
for the next runtime gate. This is the equivalent coupled mass
bridge-loss route, not the Gate S mass-air-mass boost route. It converts the former Gate R direct-fixed
negative boundary into an owned no-runtime route, while keeping runtime
values frozen. Gate S independent/twin/shared/resilient systems stay on
their existing owner; missing leaf/cavity/support/spacing fields stay
`needs_input`; multicavity/triple-leaf routes and field/building aliases
remain out of scope. Gate EN counters: `acceptedOwnerLedgers 1`,
`boundaryLedgersPinned 5`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EN selects Gate EO:
`post_v1_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo_plan`
in
`packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_em_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_em_landed_no_runtime_selected_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en`.
Gate EM selects
`wall.direct_fixed_double_leaf_bridge_loss_owner_gap` after two ROI
plan iterations (`roiAnalysisIterations: 2`). Gate EL left no fresh
runtime candidate, so Gate EM subtracts already-live advanced-wall and
double-leaf/framed resolver routes, closed Gate CS/CU/CW/DN/DP/DG/DT/DV/DX
wall repeats, closed floor/ASTM repeats, and supportless wall entries
that correctly remain `needs_input`. The selected highest-ROI action is
the direct-fixed double-leaf bridge-loss owner proof: complete
direct-fixed double-leaf input is already classified as
`direct_fixed_bridge` and `negative_boundary` because
`direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition_until_a_dedicated_bridge_loss_model_is_owned`.
Gate EN must prove that owner before any runtime value movement. Gate
EM counters: `candidateCount 11`, `estimatedNextBridgeLossOwnerLedgers
1`, `estimatedNextBoundaryLedgers 4`,
`estimatedRuntimeCandidateFamiliesToEvaluateAfterGateEN 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EM selects
`post_v1_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en_plan`
in
`packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-owner-gate-en-contract.test.ts`.

Latest landed no-runtime wall route reconciliation:
`post_v1_wall_visible_layer_formula_route_second_pass_gate_el_plan`
with status
`post_v1_wall_visible_layer_formula_route_second_pass_gate_el_landed_no_runtime_selected_next_numeric_coverage_gap_gate_em`.
Gate EL closed the Gate EK selected wall visible-layer formula-route
second pass without moving runtime values. It reconciled 12 current wall
route probes and found no fresh runtime candidate: complete advanced-wall
payloads are already live through Gate AY/AZ, complete visible
double-leaf/framed lab stacks already reach the layer-combination
resolver Gate S corridor, Gate CS/CU/CW/DN/DP/DG/DT/DV/DX repeats are
closed, direct-fixed bridge is now handled by the Gate EN/EO separate
owner chain,
supportless/roleless flat entries remain `needs_input`, and source-row
or holdout tightening remains blocked until a selected owner names the
route. Selected outcome:
`wall.visible_layer_formula_route_second_pass_no_fresh_runtime_candidate_after_current_reconciliation`.
Counters: `probeCount 12`, `alreadyLiveProbeCount 2`,
`closedRepeatProbeCount 7`, `needsInputBoundaryProbeCount 1`,
`unsupportedBoundaryProbeCount 2`, `freshCandidateCount 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EL selects
`post_v1_next_numeric_coverage_gap_gate_em_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-em-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_ek_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ek_landed_no_runtime_selected_wall_visible_layer_formula_route_second_pass_gate_el`.
Gate EK selected
`wall.visible_layer_formula_route_second_pass_after_gate_ej` after two
ROI plan iterations (`roiAnalysisIterations: 2`). Gate EK rejects
repeating the now-closed ASTM exact-band input surface, closed floor
formula-route gates, already-live open-web/open-box field-building
routes, supportless wall topology entries that correctly remain
`needs_input`, historical Dataholz/C11c/raw source reopens, and
opening/leak holdout tightening. The selected highest-ROI action is the
wall visible-layer formula-route second pass: Gate EL must reconcile the
old wall coverage/source chain against the current post-V1 wall
implementation and select only a fresh visible wall layer subset that
can improve calculator scope or accuracy without weakening metric-basis
or `needs_input` / `unsupported` boundaries. Counters: `candidateCount
10`, `roiAnalysisIterations: 2`, `estimatedNextWallCoverageLedgers 1`,
`estimatedNextRouteFamilyCandidatesToReconcile 8`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EK selects
`post_v1_wall_visible_layer_formula_route_second_pass_gate_el_plan` in
`packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts`.
Gate EK/EL plan:
`docs/calculator/POST_V1_GATE_EK_EL_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_PLAN_2026-06-07.md`.

Latest landed input-surface scope action:
`post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_plan`
with status
`post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_landed_surface_parity_selected_next_numeric_coverage_gap_gate_ek`.
Gate EJ closes the Gate EI selected input-surface scope gap. Explicitly
ASTM-labelled user/import one-third-octave impact bands now keep their
`standardMethod` through the shared estimate request, shared impact-only
request, API route forwarding, and the workbench exact-band import
helper. Lab `ASTM E492 / ASTM E989` exact bands calculate owned `IIC`,
field `ASTM E1007 / ASTM E989` exact bands calculate owned `AIIC`, and
both route to the existing Gate EH ASTM E989 owner instead of a new
formula or source-row catalog. ISO import defaults remain
`ISO 10140-3` / `ISO 16283-2`; missing/ambiguous standard methods,
lab/field metric mismatch, and formula-derived ISO `Ln,w`, `DeltaLw`,
`CI`, or `CI,50-2500` still do not publish ASTM ratings. Counters:
`inputSurfaceLedgers 1`, `newCalculableMetricBasisRequestShapes: 2`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 1`. Gate EJ selects
`post_v1_next_numeric_coverage_gap_gate_ek_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ek-contract.test.ts`.
Gate EI/EJ plan:
`docs/calculator/POST_V1_GATE_EI_EJ_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_PLAN_2026-06-07.md`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_ei_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ei_landed_no_runtime_selected_floor_astm_iic_aiic_exact_band_input_surface_gate_ej`.
Gate EI selects
`floor.astm_iic_aiic_user_band_input_surface` after two ROI plan
iterations (`roiAnalysisIterations: 2`). Gate EH proved the ASTM
exact-band owner, shared/API payloads already carry
`exactImpactSource.standardMethod`, and the remaining high-ROI scope
move is the selected input surface that lets explicitly ASTM-labelled
one-third-octave user/import bands publish owned `IIC` / `AIIC` without
turning ISO bands, `Ln,w`, `DeltaLw`, `CI`, or `CI,50-2500` into ASTM
ratings. Gate EI rejects closed formula-route repeats, held-AAC/grouped
multicavity repeats, open-web/open-box field-building repeats,
cross-family lower-treatment `DeltaLw` subtraction, opening/leak
holdout tightening, broad source crawling, and confidence/frontend
polish as the current next calculator slice. Counters:
`candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextInputSurfaceLedgers 1`,
`estimatedNextNewCalculableMetricBasisRequestShapes 2`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EI selects
`post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_plan` in
`packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts`.
Selected Gate EJ file:
`packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts`.
Gate EI/EJ plan:
`docs/calculator/POST_V1_GATE_EI_EJ_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_PLAN_2026-06-07.md`.

Latest landed no-runtime input-owner proof:
`post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_plan`
with status
`post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_landed_no_runtime_selected_next_numeric_coverage_gap_gate_ei`.
Gate EH closes the Gate EG selected ASTM exact-band input-owner proof.
It pins owner
`floor.astm_iic_aiic.exact_band_standard_method_owner`: lab ASTM
E492/E989 exact one-third-octave sources own `IIC`, field ASTM
E1007/E989 exact one-third-octave sources own `AIIC`, and both route
through `floor.astm_e989_impact_rating.contour_runtime` with
`astm_e989_impact_rating_metric_schema_adapter_bridge`. ISO
one-third-octave sources, missing `standardMethod`, ambiguous
standard-method text, lab/field metric mismatch, and ISO
`Ln,w`/`DeltaLw` formula aliases do not publish ASTM `IIC` / `AIIC`.
Gate EH moves no runtime values, retunes no formulas, imports no source
rows, and touches no frontend implementation. Counters:
`acceptedOwnerLedgers: 1`, `astmExactBandRequestShapesPinned: 2`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EH selects
`post_v1_next_numeric_coverage_gap_gate_ei_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ei-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_eg_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_eg_landed_no_runtime_selected_floor_astm_iic_aiic_exact_band_input_owner_gate_eh`.
Gate EG runs after Gate EF and selects
`floor.astm_iic_aiic_exact_band_user_input_owner_gap` as the
highest-ROI calculator slice. The engine already owns ASTM E492/E1007
one-third-octave `IIC` / `AIIC` calculation through the ASTM E989 exact
band owner, and shared/API schemas already carry `exactImpactSource`
with `standardMethod`; however, user/import surfaces can still stamp
one-third-octave impact bands as ISO. Gate EH must pin the ASTM exact
band input-owner boundary before any surface implementation promotes
user-supplied `IIC` / `AIIC`. Gate EG rejects open-web and open-box
field/building companions as already live, lower-treatment `DeltaLw`
subtraction as wrong-metric derivation, residual/holdout tightening as
blocked, broad source crawling, and frontend polish as lower ROI.
Counters: `candidateCount 12`, `roiAnalysisIterations: 2`,
`estimatedNextInputOwnerLedgers 1`,
`estimatedFollowingNewCalculableMetricBasisRequestShapesIfGateEHProvesOwner 2`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EG selects
`post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_plan` in
`packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts`.
Gate EG/EH plan:
`docs/calculator/POST_V1_GATE_EG_EH_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_PLAN_2026-06-07.md`.

Latest landed runtime-basis route-boundary action:
`post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_plan`
with status
`post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_eg`.
Gate EF closes the Gate EE selected composite-panel
suspended-ceiling-only route boundary. The visible stack
`steel_deck_composite 150 / resilient_channel 150 / rockwool 100 / 2 x
firestop_board 16` now has the owned Gate CY route pinned as
`predictor_composite_panel_published_interaction_estimate` instead of
the stale upstream low-confidence expectation. The route publishes
`Rw 48.6 / Ln,w 63.3 / DeltaLw 20.7` with runtime candidate
`floor.composite_panel.published_interaction_family_solver`. Gate EF
does not retune formulas, import source rows, promote ASTM `IIC` /
`AIIC`, or derive generic lower-treatment `DeltaLw` for open-web,
hollow-core, steel, Pliteq, or Knauf lanes. Counters:
`routeBoundaryLedgersPinned: 1`,
`staleLowConfidenceParityRowsCorrected: 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EF selects `post_v1_next_numeric_coverage_gap_gate_eg_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eg-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_ee_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ee_landed_no_runtime_selected_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef`.
Gate EE runs two ROI plan iterations after Gate ED and selects
`floor.composite_panel_suspended_ceiling_only_route_boundary` as the
highest-ROI engine-only calculator slice. Gate CY already owns the
composite-panel published-interaction family, and the visible
suspended-ceiling-only stack now resolves to
`predictor_composite_panel_published_interaction_estimate`, but a legacy
layer-driven parity row still expects the upstream low-confidence lane.
Gate EF must reconcile that route boundary and either pin the owned
published-family route for `Rw 48.6 / Ln,w 63.3 / DeltaLw 20.7` or add
a guard if the current owner is disproven. Gate EE rejects ASTM
user-band intake, explicit CI input-surface work, held-AAC missing
topology, opening/leak holdout tightening, wrong-metric lower-treatment
`DeltaLw` derivations, broad source crawling, and frontend polish as
lower ROI for the current calculator goal. Gate EE moves no runtime
values and touches no frontend implementation. Counters: `candidateCount
10`, `roiAnalysisIterations: 2`, `estimatedNextAccuracyBoundaryLedgers
1`, `estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 3`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EE selects
`post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_plan`
in
`packages/engine/src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts`.
Gate EE/EF plan:
`docs/calculator/POST_V1_GATE_EE_EF_COMPOSITE_PANEL_SUSPENDED_CEILING_ROUTE_PLAN_2026-06-07.md`.

Latest landed value-moving runtime action:
`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_plan`
with status
`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_landed_runtime_selected_next_numeric_coverage_gap_gate_ee`.
Gate ED closes the Gate EC selected resilient-channel lower-treatment
runtime gap. Visible heavy-concrete combined upper/lower stacks with
`resilient_channel` lower treatment and complete route-required
`loadBasisKgM2`, `resilientLayerDynamicStiffnessMNm3`, base slab,
floating/topping layer, board schedule, cavity depth, and cavity fill
now route through the existing
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
formula corridor. The newly calculable visible stack publishes
`Ln,w 44.6 / DeltaLw 29.9` with runtime candidate
`floor.heavy_concrete_combined_upper_lower.lab_impact_formula`. Missing
route-required physical inputs remain `needs_input`, adjacent
`furring_channel`, `acoustic_hanger_ceiling`, and
`resilient_stud_ceiling` pins are unchanged, and ISO `DeltaLw` still
does not alias to ASTM `IIC` / `AIIC`. Gate ED moves runtime scope but
does not retune the formula, import source rows, or touch frontend
implementation. Counters: `newCalculableLayerTemplates 1`,
`newCalculableRequestShapes 4`, `runtimeCorrectedLayerTemplates 1`,
`runtimeCorrectedRequestShapes 4`, `formulaCorridorGuardsWeakened 0`,
`astmAliasesPromoted 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate ED selects
`post_v1_next_numeric_coverage_gap_gate_ee_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ee-contract.test.ts`.

Latest landed no-runtime owner proof:
`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_plan`
with status
`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_landed_no_runtime_selected_resilient_channel_lower_treatment_runtime_gate_ed`.
Gate EC proves owner
`floor.heavy_concrete_combined.resilient_channel_lower_treatment_owner`
for the bounded visible heavy-concrete combined upper/lower
`resilient_channel` lower-treatment stack. It accepts only the existing
heavy-concrete combined ISO 12354-2 Annex C formula corridor with
`structuralSupportType=reinforced_concrete`,
`impactSystemType=combined_upper_lower_system`, visible
`resilient_channel`, `supportProductId=resilient_channel`,
`lowerTreatment.type=suspended_ceiling_elastic_hanger`,
`baseSlabOrFloor`, `floatingOrToppingLayer`,
`resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`,
`ceilingBoardSchedule`, `ceilingCavityDepthMm`, and
`ceilingFillThicknessMm` present. Gate EC moves no runtime values and
imports no source rows; it keeps adjacent already-live
`furring_channel`, `acoustic_hanger_ceiling`, and
`resilient_stud_ceiling` corridors unchanged, keeps missing route
physical inputs as `needs_input`, keeps the old generic
reinforced-concrete low-confidence fallback closed, rejects
open-web/hollow-core/Pliteq/Knauf lower-treatment subtraction as wrong
metric derivation, and keeps ASTM `IIC` / `AIIC` unsupported. Counters:
`acceptedOwnerLedgers: 1`, `estimatedNextNewCalculableLayerTemplates
1`, `estimatedNextNewCalculableRequestShapes 4`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EC selects
`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_plan`
in
`packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_eb_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_eb_landed_no_runtime_selected_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec`.
Gate EB selected
`floor.heavy_concrete_combined_resilient_channel_lower_treatment_owner_gap`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate EA
closed the CLT upper-package `DeltaLw` runtime gap, so Gate EB rechecked
the remaining generated wall and floor holdouts. The selected gap is a
visible heavy-concrete combined upper/lower floor stack with
`resilient_channel` lower treatment: with route-required
`loadBasisKgM2` and `resilientLayerDynamicStiffnessMNm3` it currently
publishes airborne `Rw` / `Ctr` but keeps `Ln,w` and `DeltaLw`
unsupported behind the lower-assembly owner boundary. Nearby
`furring_channel`, `acoustic_hanger_ceiling`, and
`resilient_stud_ceiling` stacks already calculate through the existing
heavy-concrete combined formula corridor, so Gate EC must prove whether
`resilient_channel` can be mapped to that owner without reopening the
old reinforced-concrete low-confidence fallback. Gate EB rejects
open-web/hollow-core/Pliteq/Knauf lower-treatment row subtraction as
wrong metric derivation, keeps ASTM `IIC` / `AIIC` separate, preserves
`loadBasisKgM2`, `resilientLayerDynamicStiffnessMNm3`, and
`ceilingOrLowerAssembly` guards, imports no source rows, and touches no
frontend implementation. Counters: `candidateCount 10`,
`estimatedNextOwnerLedgers 1`,
`estimatedFollowingNewCalculableLayerTemplatesIfGateECProvesOwner 1`,
`estimatedFollowingNewCalculableRequestShapesIfGateECProvesOwner 4`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EB selects
`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_plan`
in
`packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-owner-gate-ec-contract.test.ts`.

Latest landed value-moving runtime action:
`post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_plan`
with status
`post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_landed_runtime_selected_next_numeric_coverage_gap_gate_eb`.
Gate EA closes the Gate DZ selected CLT upper-package `DeltaLw`
runtime gap. Candidate:
`candidate_mass_timber_clt_upper_package_delta_lw_same_source_pair`.
The five accepted TUAS same-source/same-carrier upper-only CLT
treated rows now keep exact measured `Ln,w` and calculate the companion
`DeltaLw`: X3/X2 `Ln,w 52 / DeltaLw 9`, X4/X2 `Ln,w 50 /
DeltaLw 11`, C3/C2 `Ln,w 47 / DeltaLw 8`, C4/C2 `Ln,w 45 /
DeltaLw 10`, and C7/C2 `Ln,w 39 / DeltaLw 16`. The companion uses
the `open_measured_floor_system_exact_match` basis, carries
`bareReferenceLnW` / `treatedReferenceLnW`, and does not import source
rows or create a product catalog. X2/C2 reference rows, X5/C5
non-positive deltas, C2c/C3c/C4c/C5c/C7c lower-treatment combined
rows, shorthand/published-family estimates without the exact pair,
cross-family borrowing, and ASTM `IIC` / `AIIC` aliases remain
unsupported. The existing timber/CLT formula corridor still requires
`loadBasisKgM2` and `resilientLayerDynamicStiffnessMNm3` when it is not
using an accepted same-source exact pair. Counters:
`newCalculableLayerTemplates: 5`, `newCalculableRequestShapes: 5`,
`runtimeCorrectedLayerTemplates 5`, `runtimeCorrectedRequestShapes 5`,
`sourceRowsImported 0`, `formulaCorridorGuardsWeakened 0`,
`astmAliasesPromoted 0`, and `frontendImplementationFilesTouched: 0`.
Gate EA selects `post_v1_next_numeric_coverage_gap_gate_eb_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eb-contract.test.ts`.

Previous landed no-runtime owner proof:
`post_v1_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz_plan`
with status
`post_v1_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz_landed_no_runtime_selected_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea`.
Gate DZ owner:
`floor.mass_timber_clt.upper_package_delta_lw_same_source_reference_owner`.
Gate DZ proves the bounded same-source/same-carrier mass-timber CLT
upper-package `DeltaLw` owner policy before runtime values move. It
accepts only five TUAS open-measured upper-only CLT pairs with the same
reference finish package and positive measured `Ln,w` reduction:
X3/X2 `DeltaLw 9`, X4/X2 `DeltaLw 11`, C3/C2 `DeltaLw 8`, C4/C2
`DeltaLw 10`, and C7/C2 `DeltaLw 16`. It rejects the X2/C2 baselines
as reference-only rows, X5/C5 because their measured deltas are
non-positive, C2c/C3c/C4c/C5c/C7c because lower suspended ceiling
treatment moves them into a combined upper/lower lane, shorthand or
published-family estimates without the exact pair, cross-family
borrowing from open-box/open-web/heavy/composite/steel lanes, and ASTM
`IIC` / `AIIC` aliases. Counters: `acceptedSameSourcePairs: 5`,
`rejectedBoundaryExamples 9`, `estimatedNextNewCalculableLayerTemplates
5`, `estimatedNextNewCalculableRequestShapes 5`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeValuesMoved 0`,
`sourceRowsImported 0`, `broadSourceCrawlSelected false`, and
`frontendImplementationFilesTouched: 0`. Gate DZ selects
`post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_plan`
in
`packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea-contract.test.ts`.

Previous landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_dy_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_dy_landed_no_runtime_selected_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz`.
Gate DY selected `floor.mass_timber_clt_upper_package_delta_lw_owner_gap`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate DX
closed the wall exact-source field-context basis gap, so Gate DY
rechecked generated wall and floor holdouts. Held-AAC without
`supportTopology` remains a correct `needs_input` boundary; explicit
impact `CI` / `CI,50-2500` / `Ln,w+CI` / `L'nT,50` already calculate
when `impactFieldContext` supplies the route-required fields; and broad
bare-minus-treated `DeltaLw` subtraction across open-box, open-web,
lower-treatment, or combined lanes is rejected. The selected next Gate
DZ must prove a bounded same-family mass-timber CLT upper-package
`DeltaLw` owner before runtime values move. It must not treat a CLT
`Ln,w` exact row as a `DeltaLw` owner by itself, must not weaken
`loadBasisKgM2` / `resilientLayerDynamicStiffnessMNm3` guards on the
formula corridor, and must not alias ISO impact metrics to ASTM `IIC`
or `AIIC`. Counters: `candidateCount 10`,
`estimatedNextOwnerLedgers 1`,
`estimatedFollowingNewCalculableLayerTemplatesIfGateDZProvesOwner 2`,
`estimatedFollowingNewCalculableRequestShapesIfGateDZProvesOwner 2`,
`runtimeBasisPromotions 0`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
`roiAnalysisIterations: 2`, and `frontendImplementationFilesTouched: 0`.
Gate DY selects
`post_v1_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz_plan`
in
`packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-owner-gate-dz-contract.test.ts`.

Previous landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_dw_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_dw_landed_no_runtime_selected_wall_exact_source_field_context_basis_gate_dx`.
Gate DW selected `wall.exact_source_family_field_context_basis_gap`
after two ROI plan iterations (`roiAnalysisIterations: 2`). The
selected slice is engine-only and frontend-free: generated
`wall-masonry-brick` and `wall-lsf-knauf` field requests already
calculate `R'w`, `Dn,w`, `DnT,w`, and `DnT,A`, but still selected the
generic screening fallback. Gate DX must keep the numeric pins and
promote the selected answer basis/candidate to a calculated family
field-context owner, without lab `Rw` aliasing, source crawling,
confidence wording, or numeric retuning. Counters: `candidateCount 10`,
`estimatedNextRuntimeBasisPromotions 2`,
`estimatedNextRuntimeCorrectedLayerTemplates 2`,
`estimatedNextRuntimeCorrectedRequestShapes 8`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved: 0`.
Gate DW selects
`post_v1_wall_exact_source_field_context_basis_gate_dx_plan` in
`packages/engine/src/post-v1-wall-exact-source-field-context-basis-gate-dx-contract.test.ts`.

Latest landed runtime-basis accuracy action:
`post_v1_wall_exact_source_field_context_basis_gate_dx_plan`
with status
`post_v1_wall_exact_source_field_context_basis_gate_dx_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dy`.
Gate DX closes the Gate DW selected wall exact-source family
field-context basis gap without moving numeric values. Generated
`wall-masonry-brick` field keeps `R'w 40 / Dn,w 40 / DnT,w 42 /
DnT,A 41.3`; generated `wall-lsf-knauf` field keeps `R'w 51 / Dn,w 51
/ DnT,w 52 / DnT,A 51.1`. Both now select
`gate_dx_exact_source_family_calculated_field_context_runtime` with
runtime candidate `candidate_exact_source_family_calculated_field_context`
instead of `screening_fallback`. Explicit `airtightness:"good"` lab
anchor field deltas keep precedence, lab mixed companions remain on
Gates DT/DV, held-AAC multicavity-style flat lists still need explicit
support/topology inputs, and no frontend implementation was touched.
Counters: `runtimeBasisPromotions: 2`,
`runtimeCorrectedLayerTemplates 2`, `runtimeCorrectedRequestShapes 8`,
`protectedExactAnchorRequestShapes 2`, `protectedLabRequestShapes 2`,
`protectedNeedsInputRequestShapes 1`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and `runtimeValuesMoved: 0`. Gate DX
selects `post_v1_next_numeric_coverage_gap_gate_dy_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dy-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_du_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_du_landed_no_runtime_selected_wall_lsf_exact_source_mixed_metric_companion_gate_dv`.
Gate DU selected `wall.lsf_exact_source_mixed_lab_companion_gap` after
two ROI plan iterations (`roiAnalysisIterations: 2`). The selected
slice is engine-only and frontend-free: it uses the existing LSF dynamic
curve and rating adapters to make calculated `STC`, `C`, and `Ctr`
companions calculable beside exact-source `Rw`, without broad source
crawling, confidence wording, field/building aliasing, or numeric
retuning. Counters: `candidateCount 11`,
`estimatedNextNewCalculableLayerTemplates 1`,
`estimatedNextNewCalculableRequestShapes 1`,
`estimatedNextNewCalculableTargetOutputs 3`,
`estimatedNextRuntimeBasisPromotions 1`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved: 0`.
Gate DU selects `post_v1_wall_lsf_exact_source_mixed_metric_companion_gate_dv_plan`
in
`packages/engine/src/post-v1-wall-lsf-exact-source-mixed-metric-companion-gate-dv-contract.test.ts`.

Latest landed runtime scope/basis action:
`post_v1_wall_lsf_exact_source_mixed_metric_companion_gate_dv_plan`
with status
`post_v1_wall_lsf_exact_source_mixed_metric_companion_gate_dv_landed_runtime_scope_basis_selected_next_numeric_coverage_gap_gate_dw`.
Gate DV closes the Gate DU selected LSF mixed lab companion gap. The
exact source `knauf_lab_416889_primary_2026` still owns only `Rw`; the
generated `wall-lsf-knauf` mixed lab request now publishes `Rw 55 /
STC 55 / C -1.5 / Ctr -6.4` through
`gate_dv_lsf_exact_rw_calculated_lab_companion_runtime` with selected
candidate `candidate_lsf_exact_rw_calculated_lab_companions`. Single
output `Rw` stays on the exact measured route, field/building outputs
stay on their own owners, and no frontend implementation was touched.
Counters: `newCalculableLayerTemplates 1`,
`newCalculableRequestShapes 1`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions 1`, `protectedSingleOutputExactRequestShapes
1`, `protectedFieldOrBuildingAliasRequestShapes 1`, and
`runtimeValuesMoved: 0`. Gate DV selects
`post_v1_next_numeric_coverage_gap_gate_dw_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dw-contract.test.ts`.

Latest landed value-moving runtime action:
`post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan`
with status
`post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_landed_runtime_selected_next_numeric_coverage_gap_gate_dc`.
Gate DB closes the Gate DA lightweight-concrete `DeltaLw` runtime
corridor. Visible lightweight-concrete floating-floor stacks with
`loadBasisKgM2 70` and `resilientLayerDynamicStiffnessMNm3 25` keep the
existing family `Rw 53 / Ln,w 64.3` anchor and now calculate
`DeltaLw 24.9` through
`predictor_lightweight_concrete_delta_lw_dynamic_improvement_estimate`.
Complete low-density predictor input keeps `Rw 53 / Ln,w 64.3` and
also calculates `DeltaLw 24.9`. Missing `loadBasisKgM2` or
`resilientLayerDynamicStiffnessMNm3` remains `needs_input`, the Gate M
non-dynamic low-density predictor remains `Rw 49 / Ln,w 47`, and ISO
`DeltaLw` still does not alias to ASTM `IIC` / `AIIC`. Heavy-concrete
Annex-C, composite-panel bare-minus-treated, timber/CLT, and steel
`DeltaLw` routes are not borrowed. Coverage counters:
`newCalculableLayerTemplates 2`, `newCalculableRequestShapes 4`,
`runtimeCorrectedLayerTemplates 2`, and
`runtimeCorrectedRequestShapes 4`. Gate DB selects
`post_v1_next_numeric_coverage_gap_gate_dc_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dc-contract.test.ts`.

Latest landed no-runtime accuracy selection:
`post_v1_next_numeric_coverage_gap_gate_dc_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_dc_landed_no_runtime_selected_wall_heavy_core_lined_massive_accuracy_gate_dd`.
Gate DC selects the highest-ROI accuracy-safe engine slice after Gate DB:
`wall.heavy_core_lined_massive_accuracy_tightening_gap`. The selected
Gate DD work must not retune lined-massive / heavy-core wall `Rw`,
field, or building values until a wall-specific source row or bounded
lining rule is named. Generated `wall-screening-concrete` rows,
workbench concrete presets, selector value pins, deep-hybrid guards, and
floor-only concrete ceiling rows are evidence boundaries, not
calibration holdouts. Gate DC moves no runtime values, touches no
frontend implementation, keeps lab `Rw` / STC / `C` / `Ctr` separate
from field/building metrics, and keeps broad source crawling,
confidence wording, and frontend polish blocked. Counters:
`candidateCount 13`, `accuracyReadinessLedgers 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
`runtimeValuesMoved 0`. Gate DC selects
`post_v1_wall_heavy_core_lined_massive_accuracy_gate_dd_plan` in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd-contract.test.ts`.

Latest landed no-runtime accuracy readiness action:
`post_v1_wall_heavy_core_lined_massive_accuracy_gate_dd_plan`
with status
`post_v1_wall_heavy_core_lined_massive_accuracy_gate_dd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_de`.
Gate DD closes the Gate DC selected heavy-core / lined-massive accuracy
readiness pass without retuning runtime values. The live
`wall-screening-concrete` route remains pinned as source-absent
screening behavior on `lined_massive_wall` / `lined_massive_blend`:
lab `Rw 57 / STC 57 / C -1.6 / Ctr -6.5`, and field `R'w 55 /
Dn,w 55 / DnT,w 56 / DnT,A 54.9 / C -1.6 / Ctr -6.3`. Exact verified
wall source and lab-fallback matches remain absent; Knauf CC60 concrete
floor rows, manufacturer lining context, selector pins, deep-hybrid
guards, workbench concrete presets, and ISO/Sharp/Davy framework context
remain non-promotable until a wall-specific same-stack source row or a
named bounded lined-massive wall rule exists. Counters:
`evidenceBoundariesPinned 8`, `protectedRuntimePins 8`,
`directSourceRowsPromoted 0`, `boundedLiningRulesPromoted 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
`runtimeValuesMoved 0`. Gate DD selects
`post_v1_next_numeric_coverage_gap_gate_de_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-de-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_de_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_de_landed_no_runtime_selected_wall_heavy_core_lined_massive_bounded_rule_gate_df`.
Gate DE rejects stale or already-live candidates after Gate DD and
selects `wall.heavy_core_lined_massive_bounded_rule_owner_gap` as the
highest-ROI next engine-only accuracy owner step. Gate DF must not
retune `wall-screening-concrete` directly; it must decide whether the
existing lined-massive/heavy-core route can be promoted from
source-absent screening to a bounded formula owner with coefficient
scope, tolerance, and negative boundaries. Exact ASTM band ownership is
already separate, ISO impact still does not alias to ASTM `IIC` /
`AIIC`, and steel fallback `L'nT,50` is already calculable when explicit
`impactFieldContext.ci50_2500Db` is present. Gate DE moved no runtime
values and touched no frontend implementation. Counters:
`candidateCount 15`, `staleOrAlreadyLiveCandidatesRejected 8`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
`runtimeValuesMoved 0`. Gate DE selects
`post_v1_wall_heavy_core_lined_massive_bounded_rule_gate_df_plan` in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts`.

Latest landed no-runtime bounded-rule owner action:
`post_v1_wall_heavy_core_lined_massive_bounded_rule_gate_df_plan`
with status
`post_v1_wall_heavy_core_lined_massive_bounded_rule_gate_df_landed_no_runtime_selected_bounded_runtime_basis_gate_dg`.
Gate DF closes the Gate DE owner-contract step without retuning
`wall-screening-concrete` numeric values. The existing Gate H lab
lined-massive route remains `Rw 57 / STC 57 / C -1.6 / Ctr -6.5`
through `lined_massive_wall` / `lined_massive_blend`; Gate DF narrows
the bounded-rule envelope to element-lab, two visible leaves, one
compliant cavity, no support layer, a light board/lining leaf, a heavy
masonry/concrete leaf, explicit cavity/fill state from visible layers,
and the current `0.75 mass_law + 0.25 screening seed` coefficient
scope. Field/apparent values remain on the explicit Gate I adapter
(`R'w 55 / Dn,w 55 / DnT,w 56 / DnT,A 54.9`) instead of aliasing lab
`Rw`; `heavy_composite_double_leaf_sibling`, AAC/multicavity grouped
topology, floor rows, workbench presets, selector pins, and source-row
promotion remain negative boundaries. Gate DF moved no runtime values,
touched no frontend implementation, and recorded counters:
`boundedOwnerLedgers 1`, `boundedRuntimeBasisPromotions 0`,
`protectedRuntimePins 8`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and `runtimeValuesMoved 0`. Gate DF
selects
`post_v1_wall_heavy_core_lined_massive_bounded_runtime_basis_gate_dg_plan`
in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts`.
Selected candidate:
`wall.heavy_core_lined_massive.bounded_rule_owner_contract`.

Latest landed runtime-basis accuracy action:
`post_v1_wall_heavy_core_lined_massive_bounded_runtime_basis_gate_dg_plan`
with status
`post_v1_wall_heavy_core_lined_massive_bounded_runtime_basis_gate_dg_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dh`.
Gate DG closes the Gate DF selected bounded runtime-basis step without
changing `wall-screening-concrete` numeric values. The lab lined-massive
route now reports the existing Gate H method as `bounded_prediction` /
`airborne_bound` with `bounded_prediction` tolerance while keeping
`Rw 57 / STC 57 / C -1.6 / Ctr -6.5`; the candidate resolver selects
the same lined-massive candidate instead of the generic bounded fallback.
Field/apparent values remain on Gate I
(`R'w 55 / Dn,w 55 / DnT,w 56 / DnT,A 54.9`) with
`family_physics_prediction` origin, so lab `Rw` still does not alias to
field/building metrics. Heavy composite, AAC/multicavity, floor rows,
workbench presets, and source-row promotion remain negative boundaries.
Counters: `boundedRuntimeBasisPromotions 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
`runtimeValuesMoved 0`. Gate DG selects
`post_v1_next_numeric_coverage_gap_gate_dh_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dh-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_dh_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_dh_landed_no_runtime_selected_floor_steel_visible_formula_input_bridge_gate_di`.
Gate DH selects `floor.steel_visible_formula_input_bridge_gap` as the
highest-ROI engine-only scope move after Gate DG. The current runtime
evidence is deliberate: visible generated steel/open-web floor stacks
keep `Ln,w` live but leave `DeltaLw` unsupported unless the existing
steel formula owner receives complete required physical inputs. Gate DI
must bridge visible steel/open-web layers plus `steelSupportForm`,
`steelCarrierDepthMm`, `steelCarrierSpacingMm`,
`toppingOrFloatingLayer`, `resilientLayerDynamicStiffnessMNm3`,
`loadBasisKgM2`, and `lowerCeilingIsolationSupportForm` into the
existing steel mass-spring formula corridor. It must not publish
`DeltaLw` from bound-only UBIQ/open-web `Ln,w` rows, generic steel
family archetypes, or ASTM aliases. Missing owner inputs remain
`needs_input`, and ISO `DeltaLw` still does not alias to ASTM `IIC` /
`AIIC`. Gate DH moved no runtime values and touched no frontend
implementation. Counters: `candidateCount 13`,
`estimatedNextNewCalculableLayerTemplates 2`,
`estimatedNextNewCalculableRequestShapes 4`,
`protectedCurrentlyUnsupportedRequestShapes 5`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
`runtimeValuesMoved 0`. Gate DH selects
`post_v1_floor_steel_visible_formula_input_bridge_gate_di_plan` in
`packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts`.

Latest landed value-moving runtime scope action:
`post_v1_floor_steel_visible_formula_input_bridge_gate_di_plan`
with status
`post_v1_floor_steel_visible_formula_input_bridge_gate_di_landed_runtime_selected_next_numeric_coverage_gap_gate_dj`.
Gate DI closes the Gate DH selected
`floor.steel_visible_formula_input_bridge_gap`. Visible steel/open-web
floor layers with complete steel owner inputs now route through the
existing steel mass-spring formula corridor without requiring explicit
`impactPredictorInput`: steel joist calculates
`Ln,w 51.6 / DeltaLw 22.4`, and open-web calculates
`Ln,w 52.2 / DeltaLw 22.4`. Missing `steelSupportForm`,
`steelCarrierDepthMm`, `steelCarrierSpacingMm`,
`toppingOrFloatingLayer`, `resilientLayerDynamicStiffnessMNm3`,
`loadBasisKgM2`, or `lowerCeilingIsolationSupportForm` remains
`needs_input`; surface-absent generated steel/open-web rows keep their
previous `Ln,w`-only posture; and ISO `DeltaLw` still does not alias to
ASTM `IIC` / `AIIC`. Counters: `newCalculableLayerTemplates 2`,
`newCalculableRequestShapes 4`, `runtimeCorrectedLayerTemplates 0`,
`runtimeCorrectedRequestShapes 0`,
`protectedNoSurfaceGeneratedRequestShapes 5`, and
`astmAliasRequestShapesKeptUnsupported 2`. Gate DI selects
`post_v1_next_numeric_coverage_gap_gate_dj_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dj-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_dj_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_dj_landed_no_runtime_selected_floor_steel_visible_formula_input_surface_parity_gate_dk`.
Gate DJ rejects fake scope moves after Gate DI and selects
`floor.steel_visible_formula_input_surface_parity_gap` as the highest-ROI
calculator slice. The deciding implementation fact is that Gate DI made
the visible steel/open-web formula bridge live inside `calculateAssembly`,
but the next user-reachable calculator step is to carry the same
steel owner inputs through calculator surfaces without retuning the
formula, borrowing bound-only rows, or touching frontend implementation
in Gate DJ. Wall-held AAC/multicavity is not selected because it already
calculates when the route-required `supportTopology` is supplied; exact
ASTM E492/E1007 bands already calculate `IIC` / `AIIC`; opening/leak
holdout tightening and heavy-core direct retune remain blocked by their
source/rule requirements. Gate DJ moved no runtime values and touched no
frontend implementation. Counters: `candidateCount 10`,
`estimatedNextSurfaceRequestShapes 4`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and `runtimeValuesMoved 0`. Gate DJ
selects `post_v1_floor_steel_visible_formula_input_surface_parity_gate_dk_plan`
in
`packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts`.

Latest landed calculator surface parity action:
`post_v1_floor_steel_visible_formula_input_surface_parity_gate_dk_plan`
with status
`post_v1_floor_steel_visible_formula_input_surface_parity_gate_dk_landed_surface_parity_selected_next_numeric_coverage_gap_gate_dl`.
Gate DK closes the Gate DJ selected
`floor.steel_visible_formula_input_surface_parity_gap`: shared
`steelFloorFormulaSurface`, estimate API payloads, server estimate
route plumbing, impact-only API payloads, server impact-only route
plumbing, and engine `calculateImpactOnly` now carry the Gate DI steel
owner inputs into the existing steel mass-spring formula corridor.
Complete steel joist surface payloads calculate
`Ln,w 51.6 / DeltaLw 22.4`; complete open-web surface payloads
calculate `Ln,w 52.2 / DeltaLw 22.4`. Missing `steelSupportForm`,
`steelCarrierDepthMm`, `steelCarrierSpacingMm`,
`toppingOrFloatingLayer`, `resilientLayerDynamicStiffnessMNm3`,
`loadBasisKgM2`, or `lowerCeilingIsolationSupportForm` remains
`needs_input`; surface-absent generated steel/open-web rows still do
not publish `DeltaLw`; and ISO `DeltaLw` still does not alias to ASTM
`IIC` / `AIIC`. Gate DK does not retune the steel formula, does not add
a source-row pass, and does not touch frontend UI implementation.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 4`, `impactOnlySurfaceRequestShapes 4`,
`runtimeCorrectedLayerTemplates 0`, `runtimeCorrectedRequestShapes 0`,
`protectedNoSurfaceGeneratedRequestShapes 5`, and
`astmAliasRequestShapesKeptUnsupported 2`. Gate DK selects
`post_v1_next_numeric_coverage_gap_gate_dl_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dl-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_dl_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_dl_landed_no_runtime_selected_wall_timber_stud_bounded_rule_gate_dm`.
Gate DL rejects stale steel work after Gate DK, already-live exact ASTM
band routes, support-backed AAC/multicavity fake gaps, broad source
crawling, confidence wording, and frontend polish. It selects
`wall.timber_stud_formula_bounded_rule_owner_gap` as the highest-ROI
engine-only accuracy owner step. The live timber-stud wall stack already
calculates through `stud_surrogate_blend+framed_wall_calibration`
(`Rw 50`, field `R'w 42 / Dn,w 42 / DnT,w 43 / DnT,A 43.9`), but
previous source audits prove no exact or lab-fallback source row matches
the live double-board, fill, cavity, and wood-stud topology. Gate DM
must define the bounded timber-stud formula owner with coefficient
scope, tolerance, and negative boundaries before any runtime values
move. Single-board exact rows, resilient-bar exact rows, steel-framed
linked holdouts, and secondary direct double-board rows must not become
exact truth for the live wood-stud stack. Gate DL moves no runtime
values, touches no frontend implementation, and records counters:
`candidateCount 12`, `boundedOwnerLedgersEstimated 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
`runtimeValuesMoved 0`. Gate DL selects
`post_v1_wall_timber_stud_bounded_rule_gate_dm_plan` in
`packages/engine/src/post-v1-wall-timber-stud-bounded-rule-gate-dm-contract.test.ts`.

Latest landed no-runtime bounded-rule owner action:
`post_v1_wall_timber_stud_bounded_rule_gate_dm_plan`
with status
`post_v1_wall_timber_stud_bounded_rule_gate_dm_landed_no_runtime_selected_timber_stud_bounded_runtime_basis_gate_dn`.
Gate DM closes the Gate DL selected timber-stud owner-contract step
without retuning `Rw`, STC, `C`, `Ctr`, `R'w`, `Dn,w`, `DnT,w`, or
`DnT,A`. Selected owner id:
`wall.timber_stud.bounded_rule_owner_contract`. The bounded owner is
intentionally narrow: direct
`wood_stud`, line-connected, 600 mm stud spacing, board-dominant
double-board gypsum leaves, one 100 mm cavity/core with 50 mm mineral
fill, and the current `stud_surrogate_blend + framed_wall_calibration`
coefficient corridor. Exact single-board timber rows, resilient-bar
exact rows, the secondary direct double-board benchmark, steel-framed
holdouts, `light_steel_stud_or_resilient_bar`, split double-stud,
grouped multicavity, CLT/mass-timber, and field/building aliases remain
outside this owner. The live pins stay `Rw 50 / STC 50 / C 0.5 /
Ctr -4.2` and field `R'w 42 / Dn,w 42 / DnT,w 43 / DnT,A 43.9`;
Counters:
`boundedOwnerLedgers 1`, `boundedRuntimeBasisPromotions 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
`runtimeValuesMoved 0`. Gate DM selects
`post_v1_wall_timber_stud_bounded_runtime_basis_gate_dn_plan` in
`packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts`.

Latest landed runtime-basis accuracy action:
`post_v1_wall_timber_stud_bounded_runtime_basis_gate_dn_plan`
with status
`post_v1_wall_timber_stud_bounded_runtime_basis_gate_dn_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_do`.
Gate DN closes the Gate DM selected timber-stud runtime-basis step
without retuning `Rw`, STC, `C`, `Ctr`, `R'w`, `Dn,w`, `DnT,w`, or
`DnT,A`. The direct wood-stud double-board lab route now reports
`bounded_prediction` through
`gate_dn_timber_stud_bounded_wall_runtime` with selected candidate
`candidate_timber_stud_bounded_wall_prediction` instead of generic
screening. Explicit field context continues through the Gate I field
adapter over the Gate DN base, so lab `Rw` is not relabelled as field
metrics. The live pins stay `Rw 50 / STC 50 / C 0.5 / Ctr -4.2` and
field `R'w 42 / Dn,w 42 / DnT,w 43 / DnT,A 43.9`. Exact single-board
timber rows, resilient-bar exact rows, the secondary direct
double-board benchmark, steel-framed holdouts,
`light_steel_stud_or_resilient_bar`, split double-stud, grouped
multicavity, CLT/mass-timber, and field/building aliases remain outside
this owner. Counters: `boundedRuntimeBasisPromotions 1`,
`fieldAdapterAliasesAdded 0`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `protectedRuntimePins 8`, and
`runtimeValuesMoved 0`. Gate DN selects
`post_v1_next_numeric_coverage_gap_gate_do_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-do-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_do_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_do_landed_no_runtime_selected_wall_clt_laminated_leaf_runtime_basis_gate_dp`.
Gate DO selects
`wall.clt_laminated_leaf_runtime_basis_gap` as the highest-ROI
engine-only accuracy-routing step after Gate DN. The generated
`wall-clt-local` CLT + gypsum wall stack already calculates lab
`Rw 42 / STC 43 / C -1.1 / Ctr -7.1` and field
`R'w 41 / Dn,w 41 / DnT,w 42 / DnT,A 40.7`, but its selected basis is
still `screening_fallback` with selected runtime candidate
`candidate_multileaf_screening_fallback`. Gate DP must reuse the
existing Gate H CLT / mass-timber wall family physics owner for the safe
laminated single-leaf CLT + gypsum topology, keep numeric pins frozen,
route explicit field context through Gate I instead of relabelling lab
`Rw`, and keep Dataholz floor-system rows, WoodWorks/NRC STC/FSTC/ASTC
context, ordinary gypsum laminated leaves, NLT, double-leaf CLT,
timber-stud, LSF, lined massive, and grouped multicavity routes outside
this repair. Counters: `candidateCount 11`,
`estimatedNextRuntimeBasisPromotions 1`,
`estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 8`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
`runtimeValuesMoved 0`. Gate DO selects
`post_v1_wall_clt_laminated_leaf_runtime_basis_gate_dp_plan` in
`packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts`.

Latest landed runtime-basis accuracy action:
`post_v1_wall_clt_laminated_leaf_runtime_basis_gate_dp_plan`
with status
`post_v1_wall_clt_laminated_leaf_runtime_basis_gate_dp_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dq`.
Gate DP closes the Gate DO selected CLT laminated-leaf runtime-basis
repair without moving numeric values. The generated `wall-clt-local`
CLT + gypsum lab route keeps `Rw 42 / STC 43 / C -1.1 / Ctr -7.1` but
now routes through the CLT family owner lineage:
`gate_h_clt_mass_timber_wall_single_leaf_family_physics_runtime`, and
because `Ctr` is requested the selected lab candidate is the existing
Gate Y spectrum adapter over that base. Explicit field context keeps
`R'w 41 / Dn,w 41 / DnT,w 42 / DnT,A 40.7` on Gate I over the CLT base
instead of relabelling lab `Rw`. The selected runtime candidate lineage
includes `candidate_clt_mass_timber_wall_family_physics_prediction`;
ordinary gypsum laminated leaves, plywood/NLT/DLT timber boards,
double-leaf CLT, timber-stud, LSF, lined massive, grouped multicavity,
floor-system source rows, and STC/FSTC/ASTC context aliases remain
outside this repair. Counters: `runtimeBasisPromotions 1`,
`runtimeCorrectedLayerTemplates 1`, `runtimeCorrectedRequestShapes 8`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`protectedRuntimePins 8`, and `runtimeValuesMoved 0`. Gate DP selects
`post_v1_next_numeric_coverage_gap_gate_dq_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dq-contract.test.ts`.

Previous landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_dq_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_dq_landed_no_runtime_selected_wall_exact_source_zero_delta_basis_gate_dr`.
Gate DQ selects
`wall.exact_source_zero_delta_single_output_basis_gap` as the highest
ROI answer-order accuracy repair after Gate DP. The generated
`wall-masonry-brick` single-output `Rw` route had exact source
`wienerberger_porotherm_100_dense_plaster_primary_2026` and already
landed on `Rw 43`, but because no numeric delta was needed the public
basis stayed `screening_fallback`. Gate DR must promote only the
single-output exact metric to `measured_exact_full_stack`, keep mixed
`Rw/STC/C/Ctr` calculated companions live, keep field/building aliases
closed, and avoid source crawling, confidence wording, or frontend work.
Counters: `candidateCount 11`, `estimatedNextRuntimeBasisPromotions 1`,
`estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved 0`.
Gate DQ selects `post_v1_wall_exact_source_zero_delta_basis_gate_dr_plan`
in
`packages/engine/src/post-v1-wall-exact-source-zero-delta-basis-gate-dr-contract.test.ts`.

Previous landed runtime-basis accuracy action:
`post_v1_wall_exact_source_zero_delta_basis_gate_dr_plan`
with status
`post_v1_wall_exact_source_zero_delta_basis_gate_dr_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_ds`.
Gate DR closes the Gate DQ selected exact-source zero-delta
runtime-basis repair without moving numeric values. The generated
`wall-masonry-brick` single-output `Rw` request keeps `Rw 43` but now
selects `measured_exact_full_stack` through
`verified_airborne_catalog_exact_match` with exact source
`wienerberger_porotherm_100_dense_plaster_primary_2026` and selected
candidate `candidate_blocked_rockwool_exact_source` instead of
`screening_fallback`. Mixed `Rw/STC/C/Ctr` masonry requests remain
calculated companions on `candidate_multileaf_screening_fallback`;
field/building outputs are not relabelled from lab `Rw`; LSF field
anchoring still requires its airtightness and field context inputs; and
floor CI plus ASTM IIC/AIIC boundaries are unchanged. Counters:
`runtimeBasisPromotions: 1`, `runtimeCorrectedLayerTemplates 1`,
`runtimeCorrectedRequestShapes 1`, `protectedMixedCompanionRequestShapes
1`, `protectedFieldOrBuildingAliasRequestShapes 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved: 0`.
Gate DR selects `post_v1_next_numeric_coverage_gap_gate_ds_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ds-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:
`post_v1_next_numeric_coverage_gap_gate_ds_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ds_landed_no_runtime_selected_wall_masonry_exact_source_mixed_metric_companion_gate_dt`.
Gate DS selects
`wall.masonry_exact_source_mixed_metric_companion_policy_gap` after two
ROI plan iterations (`roiAnalysisIterations: 2`): first rejecting
lower-scope or surface-heavy work, then rejecting unsafe exact-source
overclaiming, mixed companion narrowing, source-proximity retunes, and
frontend work. Gate DS moved no runtime values and touched no frontend
implementation. Counters: `candidateCount 10`,
`estimatedNextRuntimeBasisPromotions 1`,
`estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved 0`.
Gate DS selects
`post_v1_wall_masonry_exact_source_mixed_metric_companion_gate_dt_plan`
in
`packages/engine/src/post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt-contract.test.ts`.

Latest landed runtime-basis accuracy action:
`post_v1_wall_masonry_exact_source_mixed_metric_companion_gate_dt_plan`
with status
`post_v1_wall_masonry_exact_source_mixed_metric_companion_gate_dt_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_du`.
Gate DT closes the Gate DS mixed-metric companion policy gap without
moving numeric values. The generated `wall-masonry-brick` mixed lab
request keeps `Rw 43 / STC 43 / C -1 / Ctr -5.5` and now selects
`family_physics_prediction` through
`gate_dt_masonry_exact_rw_calculated_lab_companion_runtime` with exact
source `wienerberger_porotherm_100_dense_plaster_primary_2026` and
selected candidate `candidate_masonry_exact_rw_calculated_lab_companions`.
The exact source owns only `Rw`; STC, C, and Ctr remain calculated
companions from the dynamic curve and rating adapters. Single-output
`Rw` still uses the Gate DR `measured_exact_full_stack` route, and
field/building outputs remain separate instead of aliasing lab `Rw`.
Counters: `runtimeBasisPromotions: 1`,
`runtimeCorrectedLayerTemplates 1`, `runtimeCorrectedRequestShapes 1`,
`protectedMixedCompanionRequestShapes 1`,
`protectedFieldOrBuildingAliasRequestShapes 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved: 0`.
Gate DT selects `post_v1_next_numeric_coverage_gap_gate_du_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-du-contract.test.ts`.

Previous landed value-moving runtime action:
`post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan`
with status
`post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_landed_runtime_selected_next_numeric_coverage_gap_gate_cp`.
Gate CO closes the Gate CN highest-ROI formula-routing gap: visible
tagged timber joist and CLT upper-package floor stacks now derive the
same route-owned predictor input used by the existing timber/CLT
`DeltaLw` formula owners. Complete visible timber now keeps the exact
`Ln,w 51` anchor and calculates `DeltaLw 25.2`; with explicit
`impactFieldContext` it also calculates `L'n,w 53 / L'nT,w 50.6 /
L'nT,50 53.6`. Complete visible CLT now keeps the published-family
`Ln,w 50` anchor and calculates `DeltaLw 22.6`; with explicit
`impactFieldContext` it also calculates `L'n,w 52 / L'nT,w 49.6 /
L'nT,50 52.6`. Missing `loadBasisKgM2` or
`resilientLayerDynamicStiffnessMNm3` remains `needs_input`, and ISO
`DeltaLw` still does not alias to ASTM `IIC` / `AIIC`. Coverage
counters: `newCalculableLayerTemplates 2`,
`newCalculableRequestShapes 10`, `runtimeCorrectedLayerTemplates 0`,
and `runtimeCorrectedRequestShapes 0`. Gate CO selects
`post_v1_next_numeric_coverage_gap_gate_cp_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cp-contract.test.ts`.

Previous landed no-runtime numeric coverage selection:
`post_v1_next_numeric_coverage_gap_gate_cp_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_cp_landed_no_runtime_selected_floor_common_floating_lower_treatment_anchor_gate_cq`.
Gate CP selects the highest-ROI engine-only runtime scope candidate:
`floor.common_floating_lower_treatment_published_anchor_gap`. The
current gap is visible heavy-floating reinforced-concrete stacks with
lower ceiling treatment: without `floorImpactContext` they currently
publish airborne `Rw` / `Ctr` but hide all requested impact outputs
behind the combined-formula `loadBasisKgM2` needs-input guard, even
though the published upper-treatment family already owns an `Ln,w`
anchor for elastic and rigid gypsum-ceiling variants. Gate CQ must keep
that published-family `Ln,w` anchor and field impact companions live for
two common visible lower-treatment templates while leaving `DeltaLw` as
`needs_input` until `loadBasisKgM2` and
`resilientLayerDynamicStiffnessMNm3` are present. Complete physical
inputs must stay on the heavy combined upper/lower formula corridor, and
ASTM `IIC` / `AIIC` remain unsupported. Gate CP is no-runtime: counters
`candidateCount 8`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
`estimatedNextNewCalculableLayerTemplates 2`, and
`estimatedNextNewCalculableRequestShapes 10`. Gate CP selects
`post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_plan` in
`packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts`.

Previous landed value-moving runtime action:
`post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_plan`
with status
`post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_landed_runtime_selected_next_numeric_coverage_gap_gate_cr`.
Gate CQ closes the Gate CP selected runtime scope gap. Visible
heavy-floating reinforced-concrete lower-treatment stacks now keep the
published-family `Ln,w` anchor live instead of stopping all impact
outputs behind the combined-formula needs-input guard. The
`acoustic_hanger_ceiling` template calculates `Ln,w 43`; with explicit
`impactFieldContext` it also calculates `L'n,w 45 / L'nT,w 42.6 /
L'nT,50 46.6`. The `resilient_stud_ceiling` template calculates
`Ln,w 51.5`; with explicit `impactFieldContext` it also calculates
`L'n,w 53.5 / L'nT,w 51.1 / L'nT,50 55.1`. `DeltaLw` remains
`needs_input` until `loadBasisKgM2` and
`resilientLayerDynamicStiffnessMNm3` are present, complete physical
inputs still use the heavy combined upper/lower formula corridor, and
ASTM `IIC` / `AIIC` remain unsupported. Coverage counters:
`newCalculableLayerTemplates 2`, `newCalculableRequestShapes 10`, and
`runtimeCorrectedRequestShapes 8`. Gate CQ selects
`post_v1_next_numeric_coverage_gap_gate_cr_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cr-contract.test.ts`.

Latest landed no-runtime numeric coverage selection:
`post_v1_next_numeric_coverage_gap_gate_cr_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_cr_landed_no_runtime_selected_wall_common_auto_topology_second_pass_gate_cs`.
Gate CR selects the highest-ROI engine-only formula-routing candidate:
`wall.common_auto_topology_second_pass_after_cj`. Gate CQ closed the
floor lower-treatment anchor gap, so the next best scope move returns to
wall layer-order entry. Gate CJ proved support-owned common flat
double-leaf building requests can use the Gate S double-leaf/framed
direct curve through the Gate AR building adapter; the remaining runtime
gap is explicit `flat_layer_order` wall requests that are safely
segmentable and have required support/stud owner inputs but are still
blocked by the older ambiguity guard. Gate CS must admit only that safe
explicit flat-entry subset, keep ambiguous multicavity flat lists
blocked, preserve missing `supportTopology`, missing `studSpacingMm`,
and missing `resilientBarSideCount` as `needs_input`, and keep lab `Rw`
/ STC / `C` / `Ctr` separate from field/building `R'w` / `Dn,w` /
`DnT,w` outputs. Gate CR moved no runtime values and touched no frontend
implementation. Counters: `candidateCount 9`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `estimatedNextRuntimeCorrectedLayerTemplates 5`,
and `estimatedNextRuntimeCorrectedRequestShapes 25`. Gate CR selects
`post_v1_wall_common_auto_topology_second_pass_gate_cs_plan` in
`packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts`.

Previous landed value-moving runtime action:
`post_v1_wall_common_auto_topology_second_pass_gate_cs_plan`
with status
`post_v1_wall_common_auto_topology_second_pass_gate_cs_landed_runtime_selected_next_numeric_coverage_gap_gate_ct`.
Gate CS closes the Gate CR selected wall flat-entry routing gap. Safe
explicit `flat_layer_order` double-leaf wall requests with complete
support/stud owner inputs now use the Gate S double-leaf/framed direct
curve through the Gate AR building adapter instead of falling into the
generic lab/field/building basis boundary. The explicit flat-order
variants keep the Gate CJ pins: simple independent `R'w 39 / Dn,w 40 /
Dn,A 38.5 / DnT,w 42 / DnT,A 40.9`, resilient both-sides `R'w 41 /
Dn,w 42 / Dn,A 40.5 / DnT,w 44 / DnT,A 42.9`, multi-board `R'w 46 /
Dn,w 47 / Dn,A 45.7 / DnT,w 49 / DnT,A 48.1`, split air/porous cavity
`R'w 44 / Dn,w 44 / Dn,A 43.1 / DnT,w 47 / DnT,A 45.5`, and
asymmetric board-count `R'w 43 / Dn,w 43 / Dn,A 42.1 / DnT,w 46 /
DnT,A 44.5`. Gate CS carried explicit `flat_layer_order` multicavity
stacks forward to a separate grouped multicavity owner instead of
widening them in the double-leaf slice; missing
`supportTopology`, missing `studSpacingMm`, and missing
`resilientBarSideCount` remain `needs_input`; lab metrics still do not
alias into field/building metrics. Counters:
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 5`,
`runtimeCorrectedLayerTemplates 5`, and
`runtimeCorrectedRequestShapes 25`. Gate CS selects
`post_v1_next_numeric_coverage_gap_gate_ct_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ct-contract.test.ts`.

Latest landed no-runtime numeric coverage selection:
`post_v1_next_numeric_coverage_gap_gate_ct_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ct_landed_no_runtime_selected_wall_flat_layer_order_multicavity_gate_cu`.
Gate CT selects the highest-ROI engine-only formula-routing candidate:
`wall.flat_layer_order_multicavity_grouped_owner_gap`. The selected
Gate CU runtime gap is safe explicit `flat_layer_order` multicavity wall
entry: a user-entered five-segment `leaf / cavity / leaf / cavity /
leaf` stack with explicit `supportTopology` can already be represented
by the existing grouped multicavity owner, but it was still stopped by
the older flat-order ambiguity guard. Gate CU must connect that layer
order to the already-owned Gate AE multicavity lab formula and the Gate
I / Gate AR field/building adapters, keep missing `supportTopology` as
`needs_input`, keep contradictory explicit grouped indices blocked, keep
lab/field/building metric owners separate, and avoid frontend/shared
surface work. Gate CT moved no runtime values and touched no frontend
implementation. Counters: `candidateCount 10`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `estimatedNextNewCalculableLayerTemplates 1`,
and `estimatedNextNewCalculableRequestShapes 14`. Gate CT selects
`post_v1_wall_flat_layer_order_multicavity_gate_cu_plan` in
`packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts`.

Previous landed value-moving runtime action:
`post_v1_wall_flat_layer_order_multicavity_gate_cu_plan`
with status
`post_v1_wall_flat_layer_order_multicavity_gate_cu_landed_runtime_selected_next_numeric_coverage_gap_gate_cv`.
Gate CU closes the Gate CT selected flat-layer-order multicavity routing
gap. Safe explicit `flat_layer_order` multicavity wall requests with a
five-segment leaf/cavity/leaf/cavity/leaf layer order and explicit
`supportTopology` now use the Gate AE two-cavity multicavity formula for
lab `Rw/STC/C/Ctr`, the Gate I field adapter for field/apparent
outputs, and the Gate AR building adapter for building-prediction
outputs. The pinned lab answer is `Rw 53 / STC 57 / C -0.6 / Ctr -8`;
field and building requests publish `R'w 53 / Dn,w 53 / Dn,A 52 /
DnT,w 54 / DnT,A 53.5`. Missing `supportTopology` remains
`needs_input`, contradictory explicit grouped indices on
`flat_layer_order` remain blocked, field/building requests still require
their own room/flanking context, and lab metrics are not relabelled as
field/building metrics without the owned adapters. Coverage counters:
Gate CU exact pins: `Rw 53 / STC 57 / C -0.6 / Ctr -8`; `R'w 53 / Dn,w 53 / Dn,A 52 / DnT,w 54 / DnT,A 53.5`.
`newCalculableLayerTemplates 1`, `newCalculableRequestShapes 14`,
`runtimeCorrectedLayerTemplates 1`, and
`runtimeCorrectedRequestShapes 14`. Gate CU selects
`post_v1_next_numeric_coverage_gap_gate_cv_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cv-contract.test.ts`.

Latest landed no-runtime numeric coverage selection:
`post_v1_next_numeric_coverage_gap_gate_cv_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_cv_landed_no_runtime_selected_wall_local_substitution_building_adapter_gate_cw`.
Gate CV selects the highest-ROI engine-only formula/adapter-routing
candidate:
`wall.local_substitution_building_prediction_adapter_gap`. Gate CU
closed the flat layer-order multicavity wall gap, and a probe showed the
Gate CQ lower-treatment direct/flanking field route is already
runtime-capable, so the next value-moving scope gap is local-substitution
triple-leaf wall building prediction. Lab `Rw/STC/C/Ctr` and field
`R'w/DnT,w` are already owned for the local-substitution family, but the
same complete stack with explicit `building_prediction` flanking,
junction, room, and output-basis context still stops as unsupported.
Gate CW must connect that family-specific lab curve to the existing
building-prediction corridor, preserve missing building physical inputs
as `needs_input` / `unsupported`, keep exact same-stack source rows
higher precedence, and avoid relabelling lab or field metrics as
building outputs. Gate CV moved no runtime values and touched no
frontend implementation. Counters: `candidateCount 11`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `estimatedNextNewCalculableLayerTemplates 1`,
and `estimatedNextNewCalculableRequestShapes 5`. Gate CV selects
`post_v1_wall_local_substitution_building_adapter_gate_cw_plan` in
`packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts`.

Latest landed value-moving runtime action:
`post_v1_wall_local_substitution_building_adapter_gate_cw_plan`
with status
`post_v1_wall_local_substitution_building_adapter_gate_cw_landed_runtime_selected_next_numeric_coverage_gap_gate_cx`.
Gate CW closes the Gate CV selected local-substitution building adapter
gap. Complete local Rockwool / MLV / plaster grouped triple-leaf wall
requests with explicit `building_prediction` flanking, junction, room,
panel, RT60, and output-basis inputs now route the family-specific
local-substitution lab curve through the building-prediction adapter
instead of stopping as unsupported. The pinned building answer is
`R'w 51 / Dn,w 51 / Dn,A 52.4 / DnT,w 53 / DnT,A 53.9` with a
`+/-11 dB` source-absent budget. Missing `buildingPredictionOutputBasis`,
`flankingJunctionClass`, `conservativeFlankingAssumption`, room volumes,
RT60, panel dimensions, or `junctionCouplingLengthM` remains
`needs_input`; exact same-stack field/building source rows still win;
lab `Rw/STC/C/Ctr` and field `R'w/DnT,w` remain separate metric owners;
and no ASTM or floor-impact aliases are published. Coverage counters:
`newCalculableLayerTemplates 1`, `newCalculableRequestShapes 5`,
`runtimeCorrectedLayerTemplates 1`, and
`runtimeCorrectedRequestShapes 5`. Gate CW selects
`post_v1_next_numeric_coverage_gap_gate_cx_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cx-contract.test.ts`.

Latest landed no-runtime numeric coverage selection:
`post_v1_next_numeric_coverage_gap_gate_cx_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_cx_landed_no_runtime_selected_floor_composite_panel_delta_lw_owner_gate_cy`.
Gate CX selects the highest-ROI engine-only formula-owner gap:
`floor.composite_panel_delta_lw_published_interaction_owner_gap`.
Composite-panel published-interaction routes already own same-family bare
and treated `Ln,w` anchors for dry floating, suspended-ceiling, and
combined treated stacks, but ISO `DeltaLw` remains unsupported for those
visible treated combinations. Gate CY must add a separate
composite-panel `DeltaLw` owner from same-family bare-minus-treated
`Ln,w`; it must not borrow heavy-concrete Annex C formulas, must keep
existing composite-panel `Rw` / `Ln,w` pins unchanged, must preserve
missing owner fields as `needs_input`, and must not publish ASTM `IIC`
/ `AIIC` aliases. Gate CX moved no runtime values and touched no
frontend implementation. Counters: `candidateCount 12`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `estimatedNextNewCalculableLayerTemplates 3`,
and `estimatedNextNewCalculableRequestShapes 3`. Gate CX selects
`post_v1_floor_composite_panel_delta_lw_owner_gate_cy_plan` in
`packages/engine/src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts`.

Latest landed value-moving runtime action:
`post_v1_floor_composite_panel_delta_lw_owner_gate_cy_plan`
with status
`post_v1_floor_composite_panel_delta_lw_owner_gate_cy_landed_runtime_selected_next_numeric_coverage_gap_gate_cz`.
Gate CY closes the Gate CX selected composite-panel `DeltaLw` owner gap.
Composite-panel published-interaction floor stacks now keep their
existing `Rw` / `Ln,w` pins and additionally calculate ISO `DeltaLw`
from the same-family bare-minus-treated `Ln,w` owner: dry floating
calculates `Ln,w 69.4 / Rw 45.1 / DeltaLw 14.6`,
suspended-ceiling-only calculates `Ln,w 63.3 / Rw 48.6 / DeltaLw 20.7`,
and combined upper/lower treatment calculates `Ln,w 48.5 / Rw 60.6 /
DeltaLw 35.5`. Missing composite-panel owner fields remain
`needs_input`; exact same-stack official PMC rows remain primary and do
not receive source-absent `DeltaLw` aliases; heavy-concrete,
timber/CLT, and lightweight-concrete `DeltaLw` formulas are not borrowed;
and ASTM `IIC` / `AIIC` remain unsupported. Coverage counters:
`newCalculableLayerTemplates 3`, `newCalculableRequestShapes 3`,
`runtimeCorrectedLayerTemplates 0`, and
`runtimeCorrectedRequestShapes 0`. Gate CY selects
`post_v1_next_numeric_coverage_gap_gate_cz_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cz-contract.test.ts`.

Latest landed no-runtime numeric coverage selection:
`post_v1_next_numeric_coverage_gap_gate_cz_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_cz_landed_no_runtime_selected_floor_lightweight_concrete_delta_lw_owner_contract_gate_da`.
Gate CZ selects the highest-ROI engine-only owner-contract gap:
`floor.lightweight_concrete_delta_lw_family_owner_contract_gap`.
Gate M already owns lightweight-concrete family `Rw` / `Ln,w` routes,
and Gate N already proves explicit field-impact companions can adapt
that owned `Ln,w` anchor when field context is present, but ISO
`DeltaLw` is still intentionally blocked because no family-specific
owner contract has pinned the bare-vs-treated or dynamic-improvement
basis. Gate DA must pin the lightweight-concrete `DeltaLw` owner
contract before runtime values move; it must not borrow heavy-concrete
Annex C, composite-panel bare-minus-treated, timber/CLT, or steel
mass-spring routes, must keep existing lightweight-concrete `Rw` /
`Ln,w` / field-impact pins unchanged, must preserve missing owner
fields as `needs_input` or `unsupported`, and must not publish ASTM
`IIC` / `AIIC` aliases. Gate CZ moved no runtime values and touched no
frontend implementation. Counters: `candidateCount 13`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `estimatedNextNewCalculableLayerTemplates 0`,
`estimatedNextNewCalculableRequestShapes 0`,
`estimatedFollowOnNewCalculableLayerTemplates 2`, and
`estimatedFollowOnNewCalculableRequestShapes 2`. Gate CZ selects
`post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_plan`
in
`packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da-contract.test.ts`.

Latest landed lightweight-concrete `DeltaLw` owner-boundary action:
`post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_plan`
with status
`post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_landed_runtime_boundary_selected_delta_lw_runtime_corridor_gate_db`.
Gate DA closes the Gate CZ selected owner-contract step for
`floor.lightweight_concrete.delta_lw_family_owner_contract`. It does
not publish new lightweight-concrete `DeltaLw` values yet. It pins the
family-specific physical owner fields
`baseSlabThicknessMm`,
`baseSlabDensityKgM3_or_lightweightConcreteMaterialClass`,
`upperTreatmentState`, `floorCoveringOrWalkingSurface`,
`resilientLayerOrToppingState`,
`resilientLayerDynamicStiffnessMNm3_or_productCurve`,
`loadBasisKgM2`, and `elementLabMetricBasis`, all with no runtime
default. It also corrects a wrong-family boundary: low-density
predictor input with complete dynamic stiffness and load basis now stays
on the lightweight-concrete `Rw` / `Ln,w` family route and does not
borrow `heavy_concrete_annex_c_delta_lw`. Composite-panel
bare-minus-treated, timber/CLT, and steel mass-spring `DeltaLw` routes
are also forbidden for this family. Existing visible lightweight-concrete
`Rw 53 / Ln,w 64.3`, the Gate M non-dynamic low-density predictor
`Rw 49 / Ln,w 47`, and field-impact companions stay unchanged; the
complete dynamic low-density predictor also stays lightweight at
`Rw 53 / Ln,w 64.3` without `DeltaLw` before Gate DB. Gate DB now owns
the separate lightweight-concrete runtime corridor; ASTM `IIC` /
`AIIC` remain unsupported. Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeCorrectedRequestShapes 1`, and
`falseHeavyConcreteDeltaLwPublicationsPrevented 1`. Gate DA selects
`post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan`
in
`packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db-contract.test.ts`.

Previous landed value-moving runtime action:
`post_v1_opening_leak_composite_wall_adapters_gate_ck_plan`
with status
`post_v1_opening_leak_composite_wall_adapters_gate_ck_landed_runtime_selected_next_numeric_coverage_gap_gate_cl`.
Gate CK corrects opening/leak field/building adapter selection: explicit
top-level `openingLeakElements` plus `hostWallAreaM2` now route through
the owned Gate S opening/leak lab composite anchor and the
company-internal field/building area-energy adapters without requiring a
hidden `openingLeakFieldBuildingAdapterBoundary` flag. Complete field
opening/leak context now calculates `R'w 36.4 / Dn,w 36.7 / DnT,w 36.9`
with the `+/-8 dB` source-absent field budget; complete
building-prediction opening/leak context now calculates `R'w 31.6 /
DnT,w 32.1` with the `+/-10 dB` building budget. Missing room/flanking
physical inputs still stop as `needs_input`, `Dn,A` / `DnT,A` still
require `frequencyBandSet`, and lab `Rw` / STC still do not alias into
field or building outputs. Counters: `newCalculableLayerTemplates 2`,
`newCalculableRequestShapes 5`, `runtimeCorrectedLayerTemplates 2`, and
`runtimeCorrectedRequestShapes 5`. Gate CK selects
`post_v1_next_numeric_coverage_gap_gate_cl_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts`.

Latest landed no-runtime accuracy selection:
`post_v1_next_numeric_coverage_gap_gate_cl_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_cl_landed_no_runtime_selected_required_physical_input_surface_parity_gate_cm`.
Gate CL is a residual/holdout program gate, not a source-row catalog or
confidence-label pass. It creates five source-owned residual ledgers for
common flat double-leaf building prediction, opening/leak field/building,
open-box raw-bare lab impact, open-web raw-bare lab impact, and heavy
floating upper-treatment field companion routes. All five ledgers keep
the existing wider error budgets because same-family calibration rows and
same-basis holdout rows are still insufficient for budget tightening.
Near-source rows are recorded only as evidence candidates; no runtime
value is promoted from source proximity, and Gate CK / Gate CJ numeric
pins stay frozen. Counters: `residualLedgers 5`, `budgetsHeldWide 5`,
`budgetsTightened 0`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and
`runtimePromotionsFromSourceProximity 0`. Gate CL selects
`post_v1_required_physical_input_surface_parity_gate_cm_plan` in
`packages/engine/src/post-v1-required-physical-input-surface-parity-gate-cm-contract.test.ts`.

Latest landed no-runtime input-surface guard:
`post_v1_required_physical_input_surface_parity_gate_cm_plan`
with status
`post_v1_required_physical_input_surface_parity_gate_cm_landed_no_runtime_selected_next_numeric_coverage_gap_gate_cn`.
Gate CM is intentionally narrow: it pins selected-route required
physical input and `needs_input` boundaries for Gate CK opening/leak
field/building, Gate CJ common flat double-leaf building prediction,
Gate CG2 heavy-floating dynamic `DeltaLw`, and Gate CH direct/flanking
field-impact `L'nT,50`. It does not touch frontend implementation,
retune formulas, crawl source rows, or move runtime values. Counters:
`inputSurfaceLedgers 4`, `requiredPhysicalInputsPinned 20`,
`guardedRequestShapes 15`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and `runtimeValuesMoved 0`. Gate CM
returns the chain to numeric coverage and accuracy work by selecting
`post_v1_next_numeric_coverage_gap_gate_cn_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cn-contract.test.ts`.

Latest landed no-runtime numeric coverage selection:
`post_v1_next_numeric_coverage_gap_gate_cn_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_cn_landed_no_runtime_selected_floor_visible_layer_upper_package_delta_lw_gate_co`.
Gate CN selected
`floor.visible_layer_upper_package_delta_lw_formula_routing_gap` as the
highest-ROI engine slice for the current product goal. Existing
timber/CLT `DeltaLw` formula owners calculate when explicit
`impactPredictorInput` is supplied, but visible tagged CLT and timber
upper-package layer stacks with equivalent physical inputs still publish
only `Ln,w`. Gate CO must route those layer-entered packages to the
existing `DeltaLw` metric owners while exact/predicted `Ln,w` remains
first, missing physical inputs remain `needs_input`, and ISO `DeltaLw`
does not alias to ASTM `IIC` / `AIIC`. Gate CN moved no runtime values,
touched no frontend implementation, selected no source crawl, and
selected no confidence wording. Counters: `candidateCount 7`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `estimatedNextNewCalculableLayerTemplates 2`,
and `estimatedNextNewCalculableRequestShapes 10`. Gate CN selected
`post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan` in
`packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts`.

Previous landed value-moving runtime action:
`post_v1_wall_common_auto_topology_expansion_gate_cj_plan`
with status
`post_v1_wall_common_auto_topology_expansion_gate_cj_landed_runtime_selected_opening_leak_composite_wall_adapters_gate_ck`.
Gate CJ corrects common flat double-leaf wall
`building_prediction` routing: complete support-owned flat double-leaf,
multi-board, split air/porous cavity, asymmetric, and resilient
both-sides stacks now use the Gate S double-leaf/framed direct curve
inside the Gate AR building adapter instead of generic building fallback
or unsupported explicit-topology behavior. Missing `supportTopology`,
missing `studSpacingMm`, explicit `flat_layer_order`, and missing
`resilientBarSideCount` remain value-less boundaries. Counters:
`newCalculableLayerTemplates 1`, `newCalculableRequestShapes 5`,
`runtimeCorrectedLayerTemplates 5`, and
`runtimeCorrectedRequestShapes 25`. Gate CJ selects
`post_v1_opening_leak_composite_wall_adapters_gate_ck_plan` in
`packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts`.

Previous landed no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_ci_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ci_landed_no_runtime_selected_wall_common_auto_topology_expansion_gate_cj`.
Gate CI preserves the exact ASTM E492/E1007 one-third-octave
`IIC`/`AIIC` owner, proves four ISO/source-absent impact routes keep
ASTM aliases unsupported, defers user-supplied ASTM band input until a
separate API/workbench/report/replay surface slice is selected, and
selects `wall.common_auto_topology_expansion` as the next value-moving
engine slice. The Gate CI/CJ plan is
`docs/calculator/POST_V1_GATE_CI_CJ_ENGINE_PLAN_2026-06-05.md`.
Gate CI selected
`post_v1_wall_common_auto_topology_expansion_gate_cj_plan` in
`packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts`.

Previous landed value-moving runtime action:
`post_v1_next_numeric_coverage_gap_gate_ch_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ch_landed_runtime_selected_next_numeric_coverage_gap_gate_ci`.
Gate CH is the field/building direct+flanking runtime correction after
Gate CG2. Complete visible heavy-floating reinforced-concrete
upper-treatment stacks with explicit direct/flanking impact context and
explicit `impactFieldContext.ci50_2500Db` now keep the published
upper-treatment `Ln,w 50` anchor and calculate `L'n,w 57.5 / L'nT,w 55.1 / L'nT,50 59.1` through
`source_absent_field_building_adapter_error_budget`. Missing
`impactFieldContext.ci50_2500Db` still stops only `L'nT,50` as
`needs_input`; ASTM `IIC` / `AIIC` remain unsupported without ASTM
E492/E1007 owners. Coverage counters:
`newCalculableLayerTemplates 2`, `newCalculableRequestShapes 4`, and
`runtimeCorrectedRequestShapes 3`. Gate CH selects
`post_v1_next_numeric_coverage_gap_gate_ci_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts`.

Previous landed value-moving runtime action:
`post_v1_floor_common_floating_covering_expansion_gate_cg2_plan`
with status
`post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch`.
Gate CG2 continues the common floor floating/covering expansion. Visible
heavy-floating reinforced-concrete upper-treatment stacks now keep the
published-family `Ln,w 50` anchor live when `loadBasisKgM2` or
`resilientLayerDynamicStiffnessMNm3` is missing, while `DeltaLw` remains
`needs_input` for the exact missing owner field. With complete
`impactFieldContext`, the same anchor publishes `L'n,w 52`,
`L'nT,w 49.6`, and `L'nT,50 53.6`; the complete explicit dynamic
formula remains `Ln,w 50.3` / `DeltaLw 24.3`. ASTM `IIC` / `AIIC`
remain unsupported without ASTM E492/E1007 owners. Coverage counters:
`newCalculableLayerTemplates 2`, `newCalculableRequestShapes 10`, and
`runtimeCorrectedRequestShapes 8`. Gate CG2 also adds the shared
resolver owner
`floor.heavy_concrete_floating.published_upper_treatment_anchor_owned`;
the resolver surface now has 43 declared candidates and 40 active
runtime-basis mappings. Historical Gate H-M resolver snapshots recorded
42 declared candidates and 39 active runtime-basis mappings before Gate
CG2 added the published upper-treatment owner. Gate CG2 selects
`post_v1_next_numeric_coverage_gap_gate_ch_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts`.

Previous landed value-moving runtime action:
`post_v1_floor_common_floating_covering_expansion_gate_cg_plan`
with status
`post_v1_floor_common_floating_covering_expansion_gate_cg_landed_partial_selected_floor_common_floating_covering_expansion_gate_cg2`.
Gate CG is the first common floor floating/covering expansion runtime
slice. It fixes a real floor-impact scope defect: visible floor-covering
only heavy/reinforced concrete stacks now keep the owned bare-heavy
`Ln,w` answer live when the user also asks for `DeltaLw` or field
impact companions. Four representative covering templates now calculate
`Ln,w` (`71.2`, `71.6`, `71.5`, `71.4`) and, with explicit
`impactFieldContext`, calculate `L'n,w`, `L'nT,w`, and `L'nT,50` while
`DeltaLw` remains `needs_input` until `toppingOrFloatingLayer`,
`resilientLayerDynamicStiffnessMNm3`, and `loadBasisKgM2` are supplied.
Coverage counters: `newCalculableLayerTemplates 4`,
`newCalculableRequestShapes 20`, and `runtimeCorrectedRequestShapes 12`.
ASTM `IIC` / `AIIC` remain unsupported without ASTM E492/E1007 owners,
and complete heavy-floating `Ln,w 50.3` / `DeltaLw 24.3` is unchanged.
Gate CG selects
`post_v1_floor_common_floating_covering_expansion_gate_cg2_plan` in
`packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts`
to continue the same high-ROI floor expansion; Gate CG was partial
because the broader plan still requires more common floating/lower
treatment templates.

Previous landed value-moving runtime action:
`post_v1_target_output_independence_sweep_gate_cf_plan`
with status
`post_v1_target_output_independence_sweep_gate_cf_landed_selected_floor_common_floating_covering_expansion_gate_cg`.
Gate CF repairs and pins target-output independence across existing
runtime families. The value-moving correction is wall field-context lab
companion publication: flat double-leaf and full-fill multileaf field
contexts now calculate single-output `Rw`, STC, `C`, and `Ctr` through
the owned family route instead of screening fallback or unsupported
publication. Gate CF also pins single-output parity for raw-bare
open-web/open-box field impact, heavy-concrete combined lab impact, and
steel suspended-ceiling field impact. Coverage counters:
`newSingleOutputParityPins 37`, `runtimeCorrectedRequestShapes 8`,
`newCalculableRequestShapes 8`, and `newCalculableLayerTemplates 0`.
Missing field `receivingRoomRt60S` still stops field outputs as
`needs_input`; ISO impact routes still do not publish ASTM `IIC` /
`AIIC`; field-only wall requests still do not widen into unrequested
lab `Rw`.
Gate CF selected Gate CG:
`packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg-contract.test.ts`.
The shared resolver surface now has 48 declared candidates and 45 active runtime-basis mappings after Gate DX.

Previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_ce_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ce_landed_no_runtime_selected_target_output_independence_sweep_gate_cf`.
Gate CE ranked the high-ROI scope/accuracy candidates, blocked broad
source crawling, finite scenario packs, confidence wording, and generic
UI/report/storage/auth work as non-goals, and selected
`target_output_independence_sweep`.
Gate CE selected next file:
`packages/engine/src/post-v1-target-output-independence-sweep-gate-cf-contract.test.ts`.

Historical selected next action label at that checkpoint:
`post_v1_next_numeric_coverage_gap_gate_du_plan`.
Gate DT selected Gate DU:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-du-contract.test.ts`.

Previous value-moving action:
`post_v1_floor_open_box_target_output_independence_gate_cd_plan`
with status
`post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce`.
Gate CD improves finished open-box target-output independence: complete
dry package-transfer and EPS/screed hybrid building/impact requests now
support already-owned single-output requests without requiring the user
to also ask for `R'w` or another building output. Dry single-output
pins include `Rw 66`, `C -3.9`, `Ln,w 50.8`, `L'n,w 52.8`,
`L'nT,w 50.4`, and `L'nT,50 53.7`; EPS/screed single-output pins
include `Rw 72`, `C -1.3`, `Ln,w 47`, `L'n,w 49`,
`L'nT,w 46.6`, and `L'nT,50 47.6`. Missing `impactFieldContext`
still leaves `L'n,w`, `L'nT,w`, and `L'nT,50` unsupported. `Ctr`,
ASTM `IIC`, and ASTM `AIIC` remain unsupported unless their own
metric-basis owners exist.

Previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_cc_plan` with status
`post_v1_next_numeric_coverage_gap_gate_cc_landed_no_runtime_selected_floor_open_box_target_output_independence_gate_cd`.
It selected
`floor.open_box_timber_finished_package.target_output_independence_gap`,
now closed by Gate CD. Gate CC selected next file:
`packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts`.

Previous value-moving action:
`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan`
with status
`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_landed_selected_next_numeric_coverage_gap_gate_cc`.
Gate CB improves EPS/screed open-box full mixed building/impact scope:
the same complete request that already had the EPS/screed lab impact
tuple now also applies the explicit field-impact adapter beside the
airborne building answer. EPS/screed hybrid publishes
`Rw 72 / C -1.3`, `R'w 70 / DnT,w 73`,
`Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`, and
`L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`. Missing
`impactFieldContext` still leaves `L'n,w`, `L'nT,w`, and `L'nT,50`
unsupported. `Ctr`, ASTM `IIC`, and ASTM `AIIC` remain unsupported
unless their own metric-basis owners exist.

Previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_ca_plan` with status
`post_v1_next_numeric_coverage_gap_gate_ca_landed_no_runtime_selected_floor_open_box_eps_screed_full_mixed_field_building_gate_cb`.
It selected
`floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap`,
now closed by Gate CB.

Previous value-moving action:
`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan`
with status
`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_landed_selected_next_numeric_coverage_gap_gate_ca`.
Gate BZ improves finished open-box package full mixed building/impact
scope: the same complete request now keeps airborne building outputs and
already-computed impact outputs live together. Dry package-transfer
publishes `Rw 66 / C -3.9`, `R'w 64 / DnT,w 67`,
`Ln,w 50.8 / CI 1.2 / CI,50-2500 3.3 / Ln,w+CI 52`, and
`L'n,w 52.8 / L'nT,w 50.4 / L'nT,50 53.7`. EPS/screed hybrid
publishes `Rw 72 / C -1.3`, `R'w 70 / DnT,w 73`,
`Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`, and after Gate CB
`L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`.

Previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_by_plan` with status
`post_v1_next_numeric_coverage_gap_gate_by_landed_no_runtime_selected_floor_open_box_finished_package_full_mixed_building_impact_gate_bz`.
It selected `floor.open_box_timber_finished_package.full_mixed_building_impact_gap`,
now closed by Gate BZ.

Previous value-moving action:
`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan`
with status
`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_landed_selected_next_numeric_coverage_gap_gate_by`.
Gate BX improves finished open-box package mixed lab-impact correctness:
mixed lab-impact and lab-field-impact requests now project the owned
package lab metrics into the visible answer. Dry package-transfer
publishes `Rw 66 / C -3.9`; EPS/screed hybrid publishes
`Rw 72 / C -1.3`. Existing impact pins remain unchanged, `Ctr` remains
unsupported because these package owners declare `Rw+C`, not a true
`Ctr`, and ASTM `IIC` / `AIIC` remain separate owners.

Previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_bw_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bw_landed_no_runtime_selected_floor_open_box_finished_package_lab_metric_projection_gate_bx`.
It selected `floor.open_box_timber_finished_package.lab_metric_projection_gap`,
now closed by Gate BX.

Previous value-moving action:
`post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_plan`
with status
`post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_landed_selected_next_numeric_coverage_gap_gate_bw`.
Gate BV keeps package lab `Rw/C` live beside finished open-box building
outputs: dry `Rw 66 / C -3.9` with `R'w 64 / DnT,w 67`, and
EPS/screed `Rw 72 / C -1.3` with `R'w 70 / DnT,w 73`.

Previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_bt_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bt_landed_no_runtime_selected_floor_open_box_finished_package_airborne_building_companion_gate_bu`.
It selected `floor.open_box_timber_finished_package.airborne_building_companion_gap`,
now closed by Gate BU.

Latest full gate checkpoint:
`NEXT_DIST_DIR=.next-gate-dg pnpm calculator:gate:current` passed after
Gate DG on 2026-06-06 with engine 624 files / 3428 tests, web 113 files
/ 438 passed + 18 skipped, repo build 5 / 5, and whitespace guard
passed.

Landed Gate AZ planning bridge:
`docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md`.
Gate AZ has now landed as
`post_v1_next_numeric_coverage_gap_gate_az_plan` with status
`post_v1_next_numeric_coverage_gap_gate_az_landed_no_runtime_selected_floor_dynamic_stiffness_load_basis_owner_gate_ba`.
It selected `post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`
in
`packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts`.
The selected candidate is
`floor.material_owner_gap.dynamic_stiffness_load_basis`; the other
ranked source-absent floor-impact candidates are
`floor.suspended_ceiling.lower_treatment_coupling_gap` and
`floor.mixed_support_family.multi_family_solver_gap`. Gate AZ itself is
no-runtime; Gate BA must prove before/after output movement and owner
fields before runtime values move.

Gate BA has now landed as
`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan` with
status
`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_landed_no_runtime_selected_suspended_ceiling_lower_treatment_gate_bb`.
It pins `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2` as
no-default physical owner fields, preserves the existing `Ln,w 48.7` /
`DeltaLw 25.8` heavy-floating runtime, and selects
`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan` in
`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts`.

Gate BB has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan` with
status
`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_landed_selected_surface_parity_gate_bc`.
It promotes complete visible heavy-concrete combined upper/lower floor
stacks with `acoustic_hanger_ceiling` or `resilient_stud_ceiling`
lower-treatment support layers into
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
The pinned acoustic-hanger case now calculates `Ln,w 45.6` and
`DeltaLw 28.9`; the resilient-stud case calculates `Ln,w 44.6` and
`DeltaLw 29.9`. Missing `ceilingOrLowerAssembly` or `loadBasisKgM2`
still stops instead of guessing, and ASTM `IIC` / `AIIC` aliases remain
unsupported. Gate BB selects
`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`
in
`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc-contract.test.ts`.

Gate BC has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_landed_selected_coverage_refresh_gate_bd`.
It is no-runtime surface parity: workbench cards, Markdown report, saved
replay, estimate API, impact-only API, and resolver trace now expose the
same layer-derived heavy-concrete combined lower-treatment answer. The
acoustic-hanger case remains `Ln,w 45.6` / `DeltaLw 28.9`; the
resilient-stud case remains `Ln,w 44.6` / `DeltaLw 29.9`. Visible
`acoustic_hanger_ceiling` and `resilient_stud_ceiling` support products
are accepted without duplicate lower support-class fields, while
`resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2` remain required
physical inputs. ASTM `IIC` / `AIIC` aliases remain unsupported. Gate BC
selects
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
in
`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts`.

Gate BD has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_be`.
It is no-runtime coverage refresh: acoustic-hanger, resilient-stud, and
impact-only lower-treatment rows are now counted as source-absent
family-physics coverage with pins `Ln,w 45.6` / `DeltaLw 28.9` and
`Ln,w 44.6` / `DeltaLw 29.9`; missing load basis, missing lower
assembly, and ASTM `IIC` / `AIIC` remain value-less boundaries. The
remaining high-risk `floor.mixed_support_family.multi_family_solver_gap`
is carried forward for reranking. Gate BD selects
`post_v1_next_numeric_coverage_gap_gate_be_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts`.

Gate BE has now landed as
`post_v1_next_numeric_coverage_gap_gate_be_plan` with status
`post_v1_next_numeric_coverage_gap_gate_be_landed_no_runtime_selected_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf`.
It selected
`floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap`
because it directly increases field-output coverage for the new
lower-treatment formula lane. Gate BE selected
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
in
`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf-contract.test.ts`.
Gate BF has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_landed_selected_next_numeric_coverage_gap_gate_bg`.
assembly field-only lower-treatment now calculates
`L'n,w 47.6 / L'nT,w 44.8 / L'nT,50 48.8` for acoustic hanger and
`L'n,w 46.6 / L'nT,w 43.8 / L'nT,50 47.8` for resilient stud; missing
`impactFieldContext.ci50_2500Db` still stops only `L'nT,50`, and ASTM
`IIC` / `AIIC` remain unsupported. Gate BF selects
`post_v1_next_numeric_coverage_gap_gate_bg_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts`.
Gate BG has now landed as
`post_v1_next_numeric_coverage_gap_gate_bg_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bg_landed_no_runtime_selected_floor_mixed_support_family_owner_boundary_gate_bh`.
It selected `floor.mixed_support_family.multi_family_solver_gap` and
`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan` in
`packages/engine/src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh-contract.test.ts`.
Gate BG is no-runtime scope/accuracy selection work: Gate BH must prove
explicit carrier/support ownership for mixed-support floor stacks before
any runtime values can move.
Gate BH has now landed as
`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan` with
status
`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_landed_no_runtime_selected_floor_mixed_support_family_runtime_corridor_gate_bi`.
It pins `primaryCarrierFamily`, `dominantImpactTransferFamily`,
`mixedSupportRolePartition`, `secondarySupportTreatmentOwner`, and
`duplicateOwnershipGuard` as no-default owner boundaries. Existing
mixed-support stacks stay fail-closed behind `duplicateOwnershipGuard`.
Gate BH selected
`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan` in
`packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts`.
This remains scope/accuracy calculator work: Gate BI may move runtime
values only for the explicit single-primary-carrier mixed-support subset
that Gate BH admitted.
Gate BI has now landed as
`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan` with
status
`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_landed_selected_floor_mixed_support_family_surface_parity_gate_bj`.
It opens runtime only for the explicit single-primary-carrier
mixed-support floor subset: `primaryCarrierFamily` and
`dominantImpactTransferFamily` must both be `reinforced_concrete`,
`mixedSupportRolePartition` must be
`single_primary_carrier_secondary_lower_treatment`,
`secondarySupportTreatmentOwner` must be `lower_treatment_only`, and
`duplicateOwnershipGuard` must be true. The pinned complete case now
calculates `Ln,w 44.6` / `DeltaLw 29.9`; with explicit
`impactFieldContext` it also calculates `L'n,w 46.6`,
`L'nT,w 43.8`, and `L'nT,50 47.8`. Missing owner fields still stop as
`needs_input`, unsafe duplicate partitions do not fall through to
another floor solver, and ASTM `IIC` / `AIIC` aliases remain
unsupported. Gate BI selected
`post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan` in
`packages/engine/src/post-v1-floor-mixed-support-family-surface-parity-gate-bj-contract.test.ts`.
Gate BJ has now landed as
`post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan` with
status
`post_v1_floor_mixed_support_family_surface_parity_gate_bj_landed_no_runtime_selected_next_numeric_coverage_gap_gate_bk`.
It is no-runtime surface parity and usage-placement correction:
workbench cards, Markdown report, saved replay, estimate API,
impact-only API, resolver trace, and dynamic impact trace now expose the
same Gate BI mixed-support answer. The complete explicit case remains
`Ln,w 44.6` / `DeltaLw 29.9` and field context remains
`L'n,w 46.6` / `L'nT,w 43.8` / `L'nT,50 47.8`. Gate BJ also keeps the
ready explicit mixed-support predictor lane from being parked behind the
older generic floor-impact needs-input guard in `calculateAssembly`.
Missing owner fields, unsafe duplicate partitions, and ASTM `IIC` /
`AIIC` aliases remain blocked. Gate BJ selected
`post_v1_next_numeric_coverage_gap_gate_bk_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bk-contract.test.ts`.

Gate BK has now landed as
`post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan` with
status
`post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl`.
This is runtime calculator coverage: the raw-bare open-web steel
base-only stack keeps lab `Ln,w 96`, `CI 1.8`, `CI,50-2500 5.2`, and
`Ln,w+CI 97.8`, and with explicit `impactFieldContext` now calculates
`L'n,w 98`, `L'nT,w 95.6`, and `L'nT,50 100.8`. Field-only requests
derive the needed lab anchor internally. Missing field context remains
`needs_input`; building prediction, open-box raw-bare field transfer,
and ASTM `IIC` / `AIIC` aliases remain blocked. Gate BK selected
`post_v1_next_numeric_coverage_gap_gate_bl_plan`.

Gate BL has now landed as
`post_v1_next_numeric_coverage_gap_gate_bl_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bl_landed_no_runtime_selected_floor_open_box_raw_bare_field_companion_gate_bl`.
It selected `floor.open_box_timber_raw_bare.field_companion_runtime_gap`
and next action
`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan` in
`packages/engine/src/post-v1-floor-open-box-raw-bare-field-companion-gate-bl-contract.test.ts`.
The plan is
`docs/calculator/POST_V1_GATE_BL_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md`.
The selected runtime acceptance pins include `L'n,w 93.1`, `L'nT,w 90.7`,
and `L'nT,50 94.1` for the 220 mm raw-bare open-box carrier with
explicit `impactFieldContext`; building prediction and ASTM `IIC` /
`AIIC` remain blocked.

Gate BL runtime has now landed as
`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan` with
status
`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_landed_selected_next_numeric_coverage_gap_gate_bm`.
This is runtime calculator coverage: the 220 mm raw-bare open-box
carrier now calculates `L'n,w 93.1`, `L'nT,w 90.7`, and `L'nT,50 94.1`
with explicit `impactFieldContext`; the 370 mm carrier calculates
`L'n,w 90.2`, `L'nT,w 87.8`, and `L'nT,50 90.9`. Field-only requests
derive the lab anchor internally. Missing field context still stops as
`needs_input`; building prediction and ASTM `IIC` / `AIIC` remain
blocked. Validation after Gate BL runtime: `pnpm calculator:gate:current`
passed with engine 576 files / 3189 tests, web 113 files / 437 passed +
18 skipped, repo build 5 / 5, and whitespace guard passed. Gate BL
selected `post_v1_next_numeric_coverage_gap_gate_bm_plan`.

Gate BM has now landed as
`post_v1_next_numeric_coverage_gap_gate_bm_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bm_landed_runtime_selected_next_numeric_coverage_gap_gate_bn`.
This is runtime calculator coverage for
`floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap`:
the 300 mm raw-bare open-web steel carrier with explicit
direct+flanking `impactFieldContext` now calculates `L'n,w 97.8`,
`L'nT,w 95.4`, and `L'nT,50 100.6` under
`contextMode=building_prediction`. This does not publish `R'w`, `DnT,w`,
or lab `Ln,w` as floor building outputs, does not generalize to
open-box raw-bare building prediction, and ASTM `IIC` / `AIIC` remain
unsupported without their own owner inputs. Source-absent single-number
direct+flanking uplifts above `12 dB` stay blocked until exact path or
impact-band evidence exists. The plan is
`docs/calculator/POST_V1_GATE_BM_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md`.
Gate BM selected `post_v1_next_numeric_coverage_gap_gate_bn_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bn-contract.test.ts`.
The active Gate BN plan is
`docs/calculator/POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md`.
Gate BN is an accuracy/plausibility calibration gate before the next
source-absent building expansion. It must compare current field/building
impact pins against external method constraints, keep unsupported
direct/flanking outliers blocked, and preserve ISO/ASTM and lab/field
metric boundaries.
Gate BN has now landed as `post_v1_next_numeric_coverage_gap_gate_bn_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_bn_landed_no_runtime_selected_floor_open_box_raw_bare_building_prediction_owner_gate_bo`.
The selected accuracy candidate is
`calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes`.
Gate BN selects `floor.open_box_timber_raw_bare.building_prediction_owner_gap`
and `post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`
in
`packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts`.
Gate BO has now landed as
`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`
with status
`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_landed_runtime_selected_next_numeric_coverage_gap_gate_bp`.
This is runtime calculator coverage for
`floor.open_box_timber_raw_bare.building_prediction_owner_gap`: the 220
mm raw-bare open-box carrier with explicit direct+flanking
`impactFieldContext` now calculates `L'n,w 92.9`, `L'nT,w 90.5`, and
`L'nT,50 93.9` under `contextMode=building_prediction`; the 370 mm
carrier calculates `L'n,w 90`, `L'nT,w 87.6`, and `L'nT,50 90.7`.
Simple `fieldKDb`, severe source-absent direct+flanking uplift, `R'w`,
`DnT,w`, lab `Ln,w`, and ASTM `IIC` / `AIIC` remain blocked. Gate BO
selects `post_v1_next_numeric_coverage_gap_gate_bp_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bp-contract.test.ts`.
Gate BP has now landed as
`post_v1_next_numeric_coverage_gap_gate_bp_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bp_landed_no_runtime_selected_floor_raw_bare_airborne_building_prediction_gate_bq`.
It selected
`floor.raw_bare_floor_airborne_building_prediction_owner_gap` and
`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan` in
`packages/engine/src/post-v1-floor-raw-bare-airborne-building-prediction-gate-bq-contract.test.ts`.
This is scope/accuracy calculator work: raw-bare floor building
airborne outputs (`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`) must use
the owned direct raw-bare `Rw` path rather than generic screening.
Gate BQ has now landed as
`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan`
with status
`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_landed_runtime_selected_next_numeric_coverage_gap_gate_br`.
The 220 mm raw-bare open-box building airborne case now publishes
`R'w 36` and `DnT,w 39`; thicker open-box and open-web raw-bare
carriers follow the same owner path instead of generic screening.
ASTM `IIC` / `AIIC` remain unsupported without their own ASTM owner.
Gate BQ selects `post_v1_next_numeric_coverage_gap_gate_br_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-br-contract.test.ts`.
Gate BR has now landed as `post_v1_next_numeric_coverage_gap_gate_br_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_br_landed_no_runtime_selected_floor_open_box_eps_screed_field_companion_gate_bs`.
It selected
`floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap`
because complete open-box timber finished-package lanes already own lab
`Ln,w` / `CI,50-2500` anchors. Dry package-transfer mixed requests
publish `L'n,w 52.8` / `L'nT,w 50.4` / `L'nT,50 53.7`, but dry
field-only requests currently publish a mismatched `46.7` / `44.3` /
`48.1` tuple; EPS/screed hybrid field outputs remain blocked. Gate BS
must align dry field-only with the mixed-request anchor and apply the
existing field-context adapter to the EPS/screed hybrid field route,
while `R'w`, `DnT,w`, and ASTM `IIC` / `AIIC` remain separate owners. Gate BR selects
`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan` in
`packages/engine/src/post-v1-floor-open-box-eps-screed-field-companion-gate-bs-contract.test.ts`.
Gate BS has now landed as
`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan` with
status
`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_landed_selected_next_numeric_coverage_gap_gate_bt`.
This is runtime calculator coverage and correctness: dry package-transfer
field-only requests now use the same anchor as mixed requests and
calculate `L'n,w 52.8` / `L'nT,w 50.4` / `L'nT,50 53.7`; EPS/screed
hybrid requests with explicit `impactFieldContext` now calculate
`L'n,w 49` / `L'nT,w 46.6` / `L'nT,50 47.6` from the owned `Ln,w 47` /
`CI,50-2500 1` lab anchor. Missing `impactFieldContext` remains
`needs_input`; `R'w`, `DnT,w`, and ASTM `IIC` / `AIIC` remain separate
owners. Gate BS selects `post_v1_next_numeric_coverage_gap_gate_bt_plan`.

Gate BT has now landed as
`post_v1_next_numeric_coverage_gap_gate_bt_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bt_landed_no_runtime_selected_floor_open_box_finished_package_airborne_building_companion_gate_bu`.
It is no-runtime calculator selection, not source crawling or UI/report
work. Gate BT selected
`floor.open_box_timber_finished_package.airborne_building_companion_gap`
because finished open-box packages already own lab airborne anchors
(`Rw 66` dry package-transfer and `Rw 72` EPS/screed hybrid), while
complete building-only `R'w` / `DnT,w` requests can still fall to
generic predictor or `screening_mass_law_curve_seed_v3` airborne bases
instead of the package anchor. Gate BT selected
`post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan`
in
`packages/engine/src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts`.

Previous active handoff, 2026-05-27: Gate AR floor small-room
`CI,50-2500` low-frequency coverage has landed. This is calculator
coverage and accuracy work, not catalog work. Floor impact lanes that
already calculate `L'nT,w` through the explicit Turkish small-room guide
and receive explicit `CI,50-2500` now calculate
`L'nT,50 = L'nT,w + CI,50-2500` instead of leaving the low-frequency
field output unavailable. Pinned heavy-concrete small-room case:
`Ln,w 50`, `L'nT,w 53`, `CI,50-2500 +4`, and `L'nT,50 57`. Pinned UBIQ
FL-28 open-web carpet combined-bound small-room case:
`Ln,w+CI <= 45`, `CI -1`, derived `Ln,w <= 46`, `L'nT,w <= 49`,
`CI,50-2500 +4`, and `L'nT,50 <= 53`. `L'n,w`, ASTM `IIC`, and ASTM
`AIIC` remain unsupported unless a separate owner/input exists. Gate AR
status is
`post_v1_floor_small_room_ci50_low_frequency_gate_ar_landed_selected_next_numeric_coverage_gap_gate_as`;
the selected next action is `post_v1_next_numeric_coverage_gap_gate_as_plan`.
Focused validation passed with engine 5 files / 24 tests and web 4
files / 8 tests. Full `pnpm calculator:gate:current` passed after
Gate AR with engine 555 files / 3093 tests, web 104 files / 423 passed
+ 18 skipped, repo build 5 / 5, and whitespace guard passed.

Previous active handoff, 2026-05-27: Gate AS floor explicit-CI lab
companion coverage has landed. This is calculator coverage and accuracy
work, not catalog work. Floor impact lanes that already own live `Ln,w`
or conservative `Ln,w` upper bound and receive explicit user `CI` now
calculate `CI` and `Ln,w+CI` without requiring field K, Hd, receiving
room volume, small-room toggle, or `CI,50-2500`. Pinned live cases:
hollow-core vinyl `Ln,w 48`, `CI -1`, `Ln,w+CI 47`; heavy concrete
`Ln,w 50`, `CI -1`, `Ln,w+CI 49`; steel fallback `Ln,w 58`, `CI -1`,
`Ln,w+CI 57`. Pinned bound cases: open-web / UBIQ 300 `Ln,w <= 51`,
`CI -1`, `Ln,w+CI <= 50`; UBIQ 200 `Ln,w <= 53`, `Ln,w+CI <= 52`;
UBIQ 250 `Ln,w <= 52`, `Ln,w+CI <= 51`. Field outputs `L'n,w`,
`L'nT,w`, `L'nT,50` still require their own physical inputs, and ASTM
`IIC` / `AIIC` remain blocked. Gate AS status is
`post_v1_floor_explicit_ci_lab_companion_gate_as_landed_selected_next_numeric_coverage_gap_gate_at`;
the selected next action is `post_v1_next_numeric_coverage_gap_gate_at_plan`.
Focused validation passed with engine 5 files / 24 tests and web 4
files / 8 tests. Full `pnpm calculator:gate:current` passed after
Gate AS with engine 556 files / 3097 tests, web 105 files / 425 passed
and 18 skipped, repo build 5 / 5, and whitespace guard passed.

Previous active handoff, 2026-05-27: Gate AT floor explicit-CI,50-2500
lab companion coverage has landed. This is calculator coverage and
accuracy work, not catalog work. Floor impact lanes that already own
live `Ln,w` or conservative `Ln,w` upper bound and receive explicit user
`CI,50-2500` now calculate `CI,50-2500` without requiring field K, Hd,
receiving-room volume, small-room toggle, or `CI`. Pinned live cases:
hollow-core vinyl `Ln,w 48`, `CI,50-2500 +4`; heavy concrete
`Ln,w 50`, `CI,50-2500 +4`; steel fallback `Ln,w 58`,
`CI,50-2500 +4`. Pinned bound cases: open-web / UBIQ 300
`Ln,w <= 51`, `CI,50-2500 +4`; UBIQ 200 `Ln,w <= 53`,
`CI,50-2500 +4`; UBIQ 250 `Ln,w <= 52`, `CI,50-2500 +4`. `CI`,
`Ln,w+CI`, field outputs `L'n,w`, `L'nT,w`, `L'nT,50`, and ASTM
`IIC` / `AIIC` remain blocked unless their own required inputs/owners
exist. Gate AT status is
`post_v1_floor_explicit_ci50_lab_companion_gate_at_landed_selected_next_numeric_coverage_gap_gate_au`;
the selected next action is `post_v1_next_numeric_coverage_gap_gate_au_plan`.
Focused validation passed with engine 5 files / 24 tests and web 4
files / 8 tests. Full `pnpm calculator:gate:current` passed after
Gate AT with engine 557 files / 3101 tests, web 106 files / 427 passed
and 18 skipped, repo build 5 / 5, and whitespace guard passed.

Previous active handoff, 2026-05-27: Gate BA floor dynamic stiffness /
load basis owner has landed. This is calculator coverage and accuracy
work, not catalog work. Gate AZ selected the highest-ROI floor impact
source-absent material-owner gap, and Gate BA now pins
`resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2` as no-default
physical owner fields. Complete explicit heavy-floating input preserves
the existing `Ln,w 48.7` / `DeltaLw 25.8` runtime; missing dynamic
stiffness or missing load basis cannot invent `DeltaLw`. Gate BA landed
as `post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan` with
status
`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_landed_no_runtime_selected_suspended_ceiling_lower_treatment_gate_bb`;
the selected next action is
`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan`. Full
`pnpm calculator:gate:current` passed after Gate BF with engine 569
files / 3155 tests, web 112 files / 435 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Previous active handoff, 2026-05-27: Gate AY floor TUAS C11c ISO impact
coverage has landed. This is calculator coverage and accuracy work, not
catalog work. The `floor-tuas-c11c-fail-closed` visible C11c stack now
opens a guarded ISO weighted impact tuple on
`tuas_c11c_visible_iso_weighted_impact_tuple_guarded`: lab impact pins
are `Ln,w 59`, `CI 1`, `CI,50-2500 1`, and `Ln,w+CI 60`; with explicit
field context K=3 and receiving-room volume 60 m3 it calculates
`L'n,w 62`, `L'nT,w 59.2`, and `L'nT,50 60.2`. The C11c exact import
candidate still does not enter `EXACT_FLOOR_SYSTEMS`; raw C11c
one-third-octave spectrum or a source correction note is still required
before exact import. `DeltaLw`, `IIC`, and `AIIC` remain unsupported
without their own owners. The shared resolver surface now has 40 declared candidates and 37 active runtime-basis mappings. Gate AY landed
as `post_v1_floor_tuas_c11c_iso_impact_gate_ay_plan` with status
`post_v1_floor_tuas_c11c_iso_impact_gate_ay_landed_selected_next_numeric_coverage_gap_gate_az`;
the selected next action is `post_v1_next_numeric_coverage_gap_gate_az_plan`.

Previous active handoff, 2026-05-27: Gate AX wall framed building adapter
coverage has landed. This is calculator coverage and accuracy work, not
catalog work. Complete Gate AR wall `building_prediction` requests for
`wall-lsf-knauf` and `wall-timber-stud` now use explicit framed metadata
(`studType`, `connectionType`, and positive `studSpacingMm`) to stay on
the stud-surrogate/framed-calibration direct-curve owner instead of
asking for unrelated grouped multileaf topology fields. Pinned LSF
values are `Rw 51`, STC 51, `C -1.4`, `Ctr -6.4`, `R'w 51`, `Dn,w 51`,
`Dn,A 49.6`, `DnT,w 52`, and `DnT,A 51.1`. Pinned timber values are
`Rw 42`, STC 42, `C 0.4`, `Ctr -4.3`, `R'w 42`, `Dn,w 42`,
`Dn,A 42.4`, `DnT,w 43`, and `DnT,A 43.9`. Missing framed metadata and
incomplete building context still stop as `needs_input`; opening/leak
building routes, exact-source metric scope, grouped AAC topology prompts,
floor impact, and ASTM aliases remain closed. Gate AX landed as
`post_v1_wall_framed_building_adapter_gate_ax_plan` with status
`post_v1_wall_framed_building_adapter_gate_ax_landed_selected_next_numeric_coverage_gap_gate_ay`;
the historical selected next action was `post_v1_next_numeric_coverage_gap_gate_ay_plan`,
focused on the `floor-tuas-c11c-fail-closed` ISO impact gap. Full
`pnpm calculator:gate:current` passed after Gate AX with engine 561
files / 3117 tests, web 110 files / 431 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Previous active handoff, 2026-05-27: Gate AU floor explicit-DeltaLw lab
companion coverage has landed. The explicit heavy-reference `DeltaLw`
lane calculates explicit lab companions: `CI`, `Ln,w+CI`, and
`CI,50-2500`, with pins `DeltaLw 26`, `Ln,w 52`, `CI -1`,
`Ln,w+CI 51`, and `CI,50-2500 +4`.

Latest landed post-V1 action:
`post_v1_calculator_capability_roi_confirmation_gate_0_plan`
in
`packages/engine/src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts`.
Selection status:
`post_v1_calculator_capability_roi_confirmation_gate_0_landed_selected_wall_multileaf_gate_a`.

Latest landed implementation action:
`post_v1_wall_multileaf_generalized_formula_gate_a_input_owner_and_gap_matrix_plan`
in
`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts`.
Selection status:
`post_v1_wall_multileaf_generalized_formula_gate_a_landed_no_runtime_selected_gate_b_runtime_corridor`.

Latest landed runtime action:
`post_v1_wall_multileaf_generalized_formula_gate_b_runtime_corridor_plan`
in
`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts`.
Selection status:
`post_v1_wall_multileaf_generalized_formula_gate_b_landed_selected_gate_c_surface_parity_and_guided_inputs`.

Previously landed surface action:
`post_v1_wall_multileaf_generalized_formula_gate_c_surface_parity_and_guided_inputs_plan`
in
`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts`.
Selection status:
`post_v1_wall_multileaf_generalized_formula_gate_c_landed_selected_gate_d_compatible_anchor_delta`.

Previously landed implementation action:
`post_v1_wall_compatible_anchor_delta_gate_d_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-gate-d-contract.test.ts`.
Selection status:
`post_v1_wall_compatible_anchor_delta_gate_d_landed_selected_gate_e_floor_or_wall_next_formula_gap`.

Landed Gate E action:
`post_v1_floor_or_wall_next_formula_gap_gate_e_plan`
in
`packages/engine/src/post-v1-floor-or-wall-next-formula-gap-gate-e-contract.test.ts`.
Selection status:
`post_v1_floor_or_wall_next_formula_gap_gate_e_landed_selected_gate_f_floor_astm_iic_aiic_contour_runtime`.

Latest landed runtime action:
`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_plan`
in
`packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts`.
Selection status:
`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_landed_selected_surface_parity_or_next_floor_formula_gap`.

Latest landed surface action:
`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_plan`
in
`packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts`.
Selection status:
`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_landed_selected_gate_h_floor_formula_expansion`.
Latest landed formula-expansion action:
`post_v1_floor_formula_expansion_gate_h_plan`
in
`packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts`.
Previously selected label: post-V1 floor formula expansion Gate H.
Selection status:
`post_v1_floor_formula_expansion_gate_h_landed_selected_gate_i_floor_formula_gap_refresh`.
Landed Gate I action:
`post_v1_floor_formula_gap_refresh_gate_i_plan`
in
`packages/engine/src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts`.
Previously selected label: post-V1 floor formula gap refresh Gate I.
Gate I selection status:
`post_v1_floor_formula_gap_refresh_gate_i_landed_no_runtime_selected_gate_j_reinforced_concrete_combined_resolver`.
Gate I selected next action:
`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan`
in
`packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts`.
Gate I selected next label: post-V1 floor reinforced-concrete combined resolver Gate J.
Landed Gate J action:
`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan`
in
`packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts`.
Gate J selection status:
`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_landed_selected_gate_k_timber_clt_delta_lw_resolver`.
Gate J selected Gate K label: post-V1 floor timber/CLT DeltaLw resolver Gate K.
Landed Gate K action:
`post_v1_floor_timber_clt_delta_lw_resolver_gate_k_plan`
in
`packages/engine/src/post-v1-floor-timber-clt-delta-lw-resolver-gate-k-contract.test.ts`.
Gate K selection status:
`post_v1_floor_timber_clt_delta_lw_resolver_gate_k_landed_selected_gate_l_composite_panel_family_solver_owner`.
Gate K selected Gate L action:
`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan`
in
`packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts`.
Gate K selected Gate L label: post-V1 floor composite-panel family solver owner Gate L.
Landed Gate L action:
`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan`
in
`packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts`.
Gate L selection status:
`post_v1_floor_composite_panel_family_solver_owner_gate_l_landed_selected_gate_m_lightweight_concrete_family_solver_owner`.
Gate L selected Gate M action:
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan`
in
`packages/engine/src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts`.
Gate L selected Gate M label: post-V1 floor lightweight-concrete family solver owner Gate M.
Gate B increased owned wall multileaf `Rw` / STC / `C` / `Ctr`
calculable capacity by mapping the complete grouped Rockwool
triple-leaf runtime through the shared source-absent resolver candidate;
Gate C made that formula answer visible across engine/workbench/API/
report surfaces while partial field outputs remain `needs_input` with
exact missing fields. Gate D added compatible measured-anchor delta:
Knauf LSF exact `Rw 55` plus one compatible outer acoustic board now
publishes `Rw 57`, while unowned STC / `C` / `Ctr` companions remain
unsupported and unsafe cavity insertions remain `needs_input`. Gate E
selected ASTM `IIC` / `AIIC` as the next highest-ROI exact-band runtime
gap. Gate F now calculates `IIC 50` from complete ASTM E492 lab bands
and `AIIC 50` from complete ASTM E1007 field bands through the ASTM E989
contour bridge, while ISO `Ln,w` rows and incomplete ASTM curves remain
unsupported for ASTM ratings. Gate G made those ASTM ratings visible
across output cards, answer chart, Markdown report, `/api/estimate`,
`/api/impact-only`, resolver trace, and metric-basis provenance without
aliasing ISO `Ln,w` to `IIC`. Gate H increased floor formula coverage
by mapping existing lightweight-steel upper/lower mass-spring and
suspended-ceiling-only source-absent formulas into the shared resolver
and answer-engine surface. Complete upper/lower steel now publishes
`Ln,w 51.6` / `DeltaLw 22.4`; suspended-only steel publishes
`Ln,w 62.2`, while `DeltaLw` without a complete upper package remains
unsupported/needs its owner inputs and ASTM/field aliases remain
blocked. Gate I refreshed that gap
and selected the existing reinforced-concrete combined upper/lower floor
formula as Gate J because it already calculates lab `Ln,w 58.1` /
`DeltaLw 13.7` on
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
but still needed shared resolver/answer-engine ownership. Gate J now
maps that formula through
`floor.heavy_concrete_combined_upper_lower.lab_impact_formula`; complete
requests publish `Ln,w 58.1` / `DeltaLw 13.7`, `IIC` / `AIIC` remain
unsupported ASTM boundaries, and missing `loadBasisKgM2` or
`ceilingOrLowerAssembly` stops as `needs_input`. Gate K now maps the
existing timber-joist and mass-timber CLT `DeltaLw` formula corridors
through `floor.timber_joist.delta_lw_formula` and
`floor.mass_timber_clt.delta_lw_formula`; timber joist publishes
`DeltaLw 25.2`, CLT publishes `DeltaLw 22.6`, exact or published
`Ln,w` companions remain separate, missing timber/CLT physical inputs
stop as `needs_input`, and ASTM/field aliases remain blocked. Gate L now
maps the existing composite-panel published interaction runtime through
`floor.composite_panel.published_interaction_family_solver`; dry floating
publishes `Ln,w 69.4 / Rw 45.1`, suspended ceiling publishes
`Ln,w 63.3 / Rw 48.6`, and combined upper/lower publishes
`Ln,w 48.5 / Rw 60.6`. Composite `DeltaLw`, ASTM, and field aliases
remain blocked until separate owners exist. Gate M now maps the
lightweight-concrete family path through
`floor.lightweight_concrete.family_solver_owner` on
`predictor_lightweight_concrete_family_estimate`: the visible
lightweight floating-floor stack publishes `Ln,w 64.3 / Rw 53`, and the
low-density reinforced-concrete predictor-input stack publishes
`Ln,w 47 / Rw 49` while staying out of heavy-concrete-specific formula
lanes. Lightweight-concrete `DeltaLw`, ASTM, and field aliases remain
blocked until separate owners exist. Gate M action
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan`
landed with status
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_landed_selected_gate_n_floor_field_building_expansion`.
Gate N action
`post_v1_floor_field_building_expansion_gate_n_plan` in
`packages/engine/src/post-v1-floor-field-building-expansion-gate-n-contract.test.ts`
landed with status
`post_v1_floor_field_building_expansion_gate_n_landed_selected_gate_o_input_surface_guided_physical_fields`.
Previous selected label: post-V1 floor field/building expansion Gate N.
It maps the generalized floor impact field-context adapter through
`floor.impact_field_context.field_building_adapter` on
`source_absent_field_building_adapter_error_budget`: dynamic
lightweight-concrete field requests with a live lab `Ln,w` anchor plus
`impactFieldContext.fieldKDb` and
`impactFieldContext.receivingRoomVolumeM3` publish
`L'n,w 66.3 / L'nT,w 63.9`. Missing field-impact context stops as
`needs_input` with `impactFieldContext` and `receivingRoomVolumeM3`;
building prediction and ASTM `IIC` / `AIIC` aliases remain blocked.
Gate N selected Gate O action was
`post_v1_input_surface_guided_physical_fields_gate_o_plan` in
`packages/engine/src/post-v1-input-surface-guided-physical-fields-gate-o-contract.test.ts`;
Gate N selected Gate O label: post-V1 input-surface guided physical fields Gate O. At Gate N closeout, the shared resolver surface had 37 declared candidates and 34 active runtime-basis mappings.
Broad source crawl, low-confidence wording, and docs-only work remain
blocked.
Gate O has now landed as a numeric coverage correction, not an
input-surface-only step:
`post_v1_wall_flat_multicavity_auto_topology_gate_o_plan` in
`packages/engine/src/post-v1-wall-flat-multicavity-auto-topology-gate-o-contract.test.ts`.
Safe flat wall multicavity stacks with explicit air-gap plus porous-fill
cavity segments now derive grouped triple-leaf topology and calculate
`Rw 53` / STC 57 / `C -0.6` / `Ctr -8`. Ambiguous flat stacks without
explicit air gaps, explicit `flat_layer_order`, and invalid duplicate
groups remain blocked. Gate O status is
`post_v1_wall_flat_multicavity_auto_topology_gate_o_landed_selected_next_numeric_coverage_gap`;
selected next action is
`post_v1_next_numeric_coverage_gap_selection_gate_p_plan`.

Gate P has now landed as a second numeric coverage correction:
`post_v1_wall_double_leaf_auto_topology_gate_p_plan` in
`packages/engine/src/post-v1-wall-double-leaf-auto-topology-gate-p-contract.test.ts`.
Flat double-leaf wall stacks with explicit support context and
`studSpacingMm` now derive double-leaf/framed topology and calculate
through the existing mass-air-mass / bridge solver without manual
side/cavity grouping. Pinned values are independent support `Rw 45` /
STC 45 / `C -1` / `Ctr -6.1` and resilient both-sides `Rw 47` /
STC 47 / `C -1` / `Ctr -6.1`. Missing support context is not guessed;
missing `resilientBarSideCount` remains a precise input stop. Gate P
status is
`post_v1_wall_double_leaf_auto_topology_gate_p_landed_selected_next_numeric_coverage_gap_gate_q`.

Gate Q has now landed as a third numeric wall-coverage correction:
`post_v1_wall_full_fill_multicavity_auto_topology_gate_q_plan` in
`packages/engine/src/post-v1-wall-full-fill-multicavity-auto-topology-gate-q-contract.test.ts`.
Full-fill flat multicavity wall stacks with explicit support context now
derive grouped triple-leaf topology and calculate through the existing
grouped Rockwool/triple-leaf frequency solver. The pinned
`gypsum / rockwool / gypsum / rockwool / gypsum` case publishes `Rw 52`
/ STC 53 / `C -2.6` / `Ctr -9.4`. Legacy support hints are not guessed,
and explicit `flat_layer_order` remains a stopped topology boundary.
Gate Q status is
`post_v1_wall_full_fill_multicavity_auto_topology_gate_q_landed_selected_next_numeric_coverage_gap_gate_r`;
Gate Q selected Gate R action was
`post_v1_next_numeric_coverage_gap_gate_r_plan`.

Gate R has now landed as a fourth numeric wall-coverage correction:
`post_v1_wall_field_auto_topology_gate_r_plan` in
`packages/engine/src/post-v1-wall-field-auto-topology-gate-r-contract.test.ts`.
The same explicit-support full-fill flat multicavity wall can now
calculate complete `field_between_rooms` apparent/standardized outputs
without manual leaf/cavity grouping: `R'w 50`, `Dn,w 50`, `Dn,A 48.5`,
`DnT,w 53`, and `DnT,A 50.9`. Missing field RT60 now stops as
`needs_input` for `receivingRoomRt60S` instead of asking for manual
topology groups. Support topology is not guessed, and air-gap-only Gate
O field requests without explicit support do not promote. Gate R status
is
`post_v1_wall_field_auto_topology_gate_r_landed_selected_next_numeric_coverage_gap_gate_s`;
Gate R selected next action was `post_v1_next_numeric_coverage_gap_gate_s_plan`.
Gate R landing validation is green. Full `pnpm calculator:gate:current`
passed after Gate R with engine 529 files / 2983 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate S has now landed as a fifth numeric wall-coverage correction:
`post_v1_wall_double_leaf_field_auto_topology_gate_s_plan` in
`packages/engine/src/post-v1-wall-double-leaf-field-auto-topology-gate-s-contract.test.ts`.
The common flat `gypsum / rockwool / gypsum` double-leaf wall with
explicit support context, `studSpacingMm`, and complete
`field_between_rooms` data now calculates through the owned double-leaf
family physics plus Gate I field adapter instead of screening fallback:
`R'w 39`, `Dn,w 40`, `Dn,A 38.5`, `DnT,w 42`, and `DnT,A 40.9`.
Missing `receivingRoomRt60S` is the only input stop; support topology is
not guessed. Gate S status is
`post_v1_wall_double_leaf_field_auto_topology_gate_s_landed_selected_next_numeric_coverage_gap_gate_t`;
Gate S selected next action was `post_v1_next_numeric_coverage_gap_gate_t_plan`.
Gate S landing validation is green. Full `pnpm calculator:gate:current`
passed after Gate S with engine 530 files / 2987 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate T has now landed as a sixth numeric wall-coverage correction:
`post_v1_wall_mixed_lab_field_output_gate_t_plan` in
`packages/engine/src/post-v1-wall-mixed-lab-field-output-gate-t-contract.test.ts`.
The same complete flat double-leaf field stack now keeps calculable lab
companions live when the user asks for mixed lab-spectrum and field
outputs: `Rw 39`, STC 39, `C -1`, `Ctr -5.7`, `R'w 39`, `Dn,w 40`,
`Dn,A 38.5`, `DnT,w 42`, and `DnT,A 40.9`. The resolver trace remains
on the field adapter and pins only field metrics, so lab `Rw` is not
relabelled as a field candidate. Gate T status is
`post_v1_wall_mixed_lab_field_output_gate_t_landed_selected_next_numeric_coverage_gap_gate_u`;
Gate T selected next action was `post_v1_next_numeric_coverage_gap_gate_u_plan`.
Latest Gate T validation is green. Full `pnpm calculator:gate:current`
passed after Gate T with engine 531 files / 2991 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate U has now landed as a seventh numeric wall-coverage correction:
`post_v1_wall_multileaf_mixed_lab_field_output_gate_u_plan` in
`packages/engine/src/post-v1-wall-multileaf-mixed-lab-field-output-gate-u-contract.test.ts`.
The explicit-support full-fill flat multicavity wall now keeps
calculable lab companions live when the user asks for mixed lab-spectrum
and field outputs: `Rw 50`, STC 51, `C -2`, `Ctr -8.5`, `R'w 50`,
`Dn,w 50`, `Dn,A 48.5`, `DnT,w 53`, and `DnT,A 50.9`. The resolver
trace remains on the field adapter and pins only field metrics, so lab
`Rw` is not relabelled as a field candidate. Gate U status is
`post_v1_wall_multileaf_mixed_lab_field_output_gate_u_landed_selected_next_numeric_coverage_gap_gate_v`;
Gate U selected next action was `post_v1_next_numeric_coverage_gap_gate_v_plan`.
Latest Gate U validation is green. Full `pnpm calculator:gate:current`
passed after Gate U with engine 532 files / 2995 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate V has now landed as an eighth numeric wall-coverage correction:
`post_v1_wall_rw_field_output_gate_v_plan` in
`packages/engine/src/post-v1-wall-rw-field-output-gate-v-contract.test.ts`.
Complete explicit-support double-leaf and full-fill multicavity field
requests that ask only for `Rw` plus field outputs now keep calculable
lab `Rw` live without requiring STC or spectrum companions. The pinned
double-leaf request supports `Rw 39`, `R'w 39`, `DnT,w 42`; the pinned
multileaf request supports `Rw 50`, `R'w 50`, `DnT,w 53`. Field-only
requests still remain field-only, and resolver traces still pin only
field metrics. Gate V status is
`post_v1_wall_rw_field_output_gate_v_landed_selected_next_numeric_coverage_gap_gate_w`;
Gate V selected next action was `post_v1_next_numeric_coverage_gap_gate_w_plan`.
Latest Gate V validation is green. Full `pnpm calculator:gate:current`
passed after Gate V with engine 533 files / 2999 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate W has now landed as a ninth numeric wall-coverage correction:
`post_v1_wall_field_rw_companion_gate_w_plan` in
`packages/engine/src/post-v1-wall-field-rw-companion-gate-w-contract.test.ts`.
Complete heavy-composite wall and local-substitution grouped triple-leaf
field requests that ask for `Rw` plus field outputs now keep calculable
`Rw` live instead of reporting it unsupported. The pinned heavy-composite
request supports `Rw 60`, `R'w 60`, `DnT,w 61`; the pinned
local-substitution request supports `Rw 51`, `R'w 51`, `DnT,w 53`.
Field-only requests still remain field-only, and resolver traces still
pin only field metrics. Gate W status is
`post_v1_wall_field_rw_companion_gate_w_landed_selected_next_numeric_coverage_gap_gate_x`;
selected next action was `post_v1_next_numeric_coverage_gap_gate_x_plan`.
Latest Gate W validation is green. Full `pnpm calculator:gate:current`
passed after Gate W with engine 534 files / 3003 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate X has now landed as a tenth numeric coverage correction:
`post_v1_floor_airborne_spectrum_companion_gate_x_plan` in
`packages/engine/src/post-v1-floor-airborne-spectrum-companion-gate-x-contract.test.ts`.
Complete floor family-estimate field requests now keep calculated
airborne spectrum companions live when the selected family basis owns a
source-absent or family-estimate airborne curve. The pinned
heavy-concrete family request supports `STC 58`, `C -0.9`, and
`Ctr -5.6`; the pinned lightweight-steel family request supports
`STC 70`, `C -0.9`, and `Ctr -5.6`. Exact measured floor rows still
publish only source-owned spectrum terms, so exact floor `Rw` rows do
not become STC aliases. Gate X status is
`post_v1_floor_airborne_spectrum_companion_gate_x_landed_selected_next_numeric_coverage_gap_gate_y`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_y_plan`.
Latest Gate X targeted validation passed 1 file / 4 tests, and the
relevant regression sentinel passed 11 files / 64 tests. Full
`pnpm calculator:gate:current` passed after Gate X with engine 535 files
/ 3007 tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5,
and whitespace guard passed.

Gate Y has now landed as an eleventh numeric coverage correction:
`post_v1_floor_screening_spectrum_companion_gate_y_plan` in
`packages/engine/src/post-v1-floor-screening-spectrum-companion-gate-y-contract.test.ts`.
Complete floor `screening_mass_law_curve_seed_v3` field requests now
keep calculated `STC` and `C` live when the same screening curve already
owns live `Rw` / `Ctr` / field / impact outputs. The pinned Regupol
Curve 8 request supports `STC 58`, `C -1.4`, and `Ctr -6.1`; the
Getzner AFM 35 request supports `STC 58`, `C -0.9`, and `Ctr -5.6`;
the Regupol Multi 4.5 porcelain request supports `STC 55`, `C -0.8`,
and `Ctr -5.5`. Exact measured floor rows still stay metric-scoped, and
ASTM / impact boundary rows stay parked. Gate Y status is
`post_v1_floor_screening_spectrum_companion_gate_y_landed_selected_next_numeric_coverage_gap_gate_z`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_z_plan`.
Latest Gate Y/Gate X targeted validation passed 2 files / 9 tests. Full
`pnpm calculator:gate:current` passed after Gate Y with engine 536 files /
3012 tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5,
and whitespace guard passed.

Gate Z has now landed as a twelfth numeric coverage correction:
`post_v1_floor_screening_rw_companion_gate_z_plan` in
`packages/engine/src/post-v1-floor-screening-rw-companion-gate-z-contract.test.ts`.
Source-absent floor `screening_mass_law_curve_seed_v3` requests with
visible floor roles now keep calculated `Rw` live even when impact
outputs remain stopped. The pinned TUAS C11c fail-closed stack now
supports `Rw 47`, STC 47, `C -1`, `Ctr -5.7`, `R'w 47`, and `DnT,w 49`
through `floor.screening_airborne.source_absent`; `Ln,w`, `DeltaLw`,
`L'n,w`, and `L'nT,w` remain unsupported/needs-owner outputs. Exact
measured floor rows and UBIQ bound rows stay metric-scoped, so Gate Z
does not fabricate exact STC / `C` / `Ctr` companions or bound-only
missing `C`. At Gate Z closeout, the shared resolver surface had 37
declared candidates and 34 active runtime-basis mappings. Gate Z status is
`post_v1_floor_screening_rw_companion_gate_z_landed_selected_next_numeric_coverage_gap_gate_aa`;
Gate Z selected next action was `post_v1_next_numeric_coverage_gap_gate_aa_plan`.
Latest validation: focused Gate Z / Gate Y / Gate X / resolver passed
6 files / 30 tests, and full `pnpm calculator:gate:current` passed on
2026-05-26 with engine 537 files / 3016 tests, web 95 files / 402
passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate AA has now landed as a thirteenth numeric coverage correction:
`post_v1_wall_lined_massive_rw_companion_gate_aa_plan` in
`packages/engine/src/post-v1-wall-lined-massive-rw-companion-gate-aa-contract.test.ts`.
The existing Gate H lined-massive wall field route now keeps its
calculated lab `Rw` companion live when a complete wall field request
also includes unrelated floor/impact outputs. The pinned concrete lined
wall now supports `Rw 55`, STC 55, `C -1.6`, `Ctr -6.3`, `R'w 55`,
`Dn,w 55`, `Dn,A 53.4`, `DnT,w 56`, and `DnT,A 54.9`; floor/impact
outputs remain stopped instead of fabricated. Grouped-topology wall
cases still stop as `needs_input`, and exact/floor metric scopes remain
unchanged. Gate AA status is
`post_v1_wall_lined_massive_rw_companion_gate_aa_landed_selected_next_numeric_coverage_gap_gate_ab`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ab_plan`.
Latest validation: focused Gate AA / Gate Z / Gate Y / Gate X / Gate W /
resolver passed 6 files / 26 tests, and full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 538
files / 3019 tests, web 95 files / 402 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AB has now landed as a fourteenth numeric coverage correction:
`post_v1_wall_screening_rw_field_companion_gate_ab_plan` in
`packages/engine/src/post-v1-wall-screening-rw-field-companion-gate-ab-contract.test.ts`.
Complete single-leaf wall field requests on the screening fallback lane
now keep the calculated lab `Rw` companion live instead of showing only
field/apparent and spectrum outputs. The generated masonry brick wall
now supports `Rw 40`, STC 40, `C -0.2`, `Ctr -4.7`, `R'w 40`,
`Dn,w 40`, `Dn,A 39.8`, `DnT,w 42`, and `DnT,A 41.3`; the laminated
CLT wall now supports `Rw 41`, STC 41, `C -1.8`, `Ctr -7.6`,
`R'w 41`, `Dn,w 41`, `Dn,A 39.2`, `DnT,w 42`, and `DnT,A 40.7`.
Framed, grouped-topology, and multicavity wall routes that still need
physical topology inputs remain `needs_input`; exact floor/source
metric scopes and UBIQ bound missing-`C` guards remain unchanged. Gate
AB status is
`post_v1_wall_screening_rw_field_companion_gate_ab_landed_selected_next_numeric_coverage_gap_gate_ac`;
selected next action was `post_v1_next_numeric_coverage_gap_gate_ac_plan`.
Latest validation: focused Gate AB passed 1 file / 4 tests; focused
Gate AB / Gate AA / Gate Z / Gate Y / Gate X / Gate W / resolver /
origin matrix passed 8 files / 31 tests; web Gate B visibility passed
1 file / 4 tests; web origin card matrix passed 1 file / 1 test; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 539
files / 3023 tests, web 95 files / 402 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AC has now landed as a fifteenth numeric coverage correction:
`post_v1_floor_field_a_weighted_surface_gate_ac_plan` in
`packages/engine/src/post-v1-floor-field-a-weighted-surface-gate-ac-contract.test.ts`.
The shared floor field/building adapter now publishes already-calculated
airborne field metrics through the resolver trace and automatic
workbench floor presets: `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`. The
pinned heavy concrete floor supports `Dn,w 57`, `Dn,A 56.1`,
`DnT,w 60`, and `DnT,A 58.6`; the lightweight steel fallback supports
`Dn,w 69`, `Dn,A 68.1`, `DnT,w 72`, and `DnT,A 70.6`. Exact floor
metric scope, bound-only missing-`C`, ASTM/IIC, and unrelated
`needs_input` boundaries remain closed. Gate AC status is
`post_v1_floor_field_a_weighted_surface_gate_ac_landed_selected_next_numeric_coverage_gap_gate_ad`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ad_plan`.
Latest validation: focused Gate AC passed engine 1 file / 4 tests and
web 1 file / 4 tests; focused Gate N + Gate AC passed engine 2 files /
9 tests; focused Gate AC + floor preset web passed 2 files / 6 tests;
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
540 files / 3027 tests, web 96 files / 406 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.

Gate AD has now landed as a sixteenth numeric coverage correction:
`post_v1_wall_framed_metadata_auto_topology_gate_ad_plan` in
`packages/engine/src/post-v1-wall-framed-metadata-auto-topology-gate-ad-contract.test.ts`.
Flat framed wall field/building requests with explicit `connectionType` /
`studType` now keep the already-calculated `Rw` companion live on the
defended stud-surrogate/framed-calibration route. The LSF Knauf framed
wall supports `Rw 51`, STC 51, `C -1.4`, `Ctr -6.4`, `R'w 51`,
`Dn,w 51`, `Dn,A 49.6`, `DnT,w 52`, and `DnT,A 51.1`; the timber-stud
wall supports `Rw 42`, STC 42, `C 0.4`, `Ctr -4.3`, `R'w 42`,
`Dn,w 42`, `Dn,A 42.4`, `DnT,w 43`, and `DnT,A 43.9`. No-support
framed metadata and grouped AAC/triple-leaf cases remain `needs_input`;
exact/bound floor metric scope and ASTM/IIC aliases remain closed. Gate
AD status is
`post_v1_wall_framed_metadata_auto_topology_gate_ad_landed_selected_next_numeric_coverage_gap_gate_ae`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ae_plan`.
Latest validation: focused Gate AD passed engine 1 file / 4 tests;
framed/source regression coverage passed 21 files / 157 tests; resolver
and answer-engine regression coverage passed 5 files / 41 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 541
files / 3031 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

## Product Goal

DynEcho is an acoustic calculator, not a source-library/catalog app.
The priority is personal-use readiness: a user selects wall or floor,
enters the physical inputs required for that route, adds layer materials
and thicknesses, and receives defensible `Rw`, `R'w`, `DnT,w`, `Ln,w`,
and related outputs.

The calculator must maximize both coverage and accuracy. Exact measured
or trusted source rows win when they truly match, and nearby measured
rows can anchor or calibrate predictions when their topology and metric
scope allow it. But source rows cannot be the whole product because
layer combinations are effectively unbounded. When source rows are
absent, DynEcho must calculate with the best family-specific physics
model available, label the basis/origin honestly, expose tolerance or
error budget, and ask for missing physical inputs instead of guessing.

Dynamic calculator north star:

- user chooses `wall` or `floor`;
- the app opens only the physical input fields required by that route and
  output basis;
- the user adds layer materials, order, thicknesses, and explicit
  topology/context where needed;
- the engine calculates `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, `STC`,
  `C`, `Ctr`, and related outputs from the best available candidate;
- if a physical field is missing, the answer is `needs_input` with the
  exact missing fields, not a guessed high-confidence result.

Do not drift this project back into a library/catalog exercise. Source
rows are candidates, anchors, calibration evidence, holdouts, bounds, and
exact overrides. They are not the product. If a change primarily gathers
more rows while leaving source-absent family solvers, input contracts, and
accuracy tests untouched, it is probably the wrong next step unless the
active plan explicitly selected exact-source promotion.

Treat lab, field, and building-prediction contexts as different output
bases. Do not casually alias `Rw` with `STC`, `Ln,w` with `IIC`, or lab
values with field/apparent values. Tests must prove acoustic correctness
and boundaries, not just that code runs: expected values, basis/origin,
support bucket, visible card/report parity, tolerance, nearby negatives,
and hostile input cases such as many layers, duplicates, splits, and
safe/unsafe reorders.

Personal-use readiness means the dynamic calculator can handle realistic
and hostile layer combinations across wall and floor routes with named
algorithms, bounded uncertainty, and visible missing-input prompts. It is
not ready just because a finite catalog of known assemblies passes.

Checkpoint and active correction to read before the next implementation
slice:
`docs/calculator/CHECKPOINT_2026-05-23_POST_V1_ACOUSTIC_CALCULATOR_STATE_RECONCILIATION.md`,
`docs/calculator/CHECKPOINT_2026-05-22_ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_RECONCILIATION.md`,
`docs/calculator/CHECKPOINT_2026-05-21_LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_COVERAGE_REFRESH_REVALIDATION.md`
and
`docs/calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md`.

Latest checkpoint, 2026-05-23: post-V1 acoustic calculator state
reconciliation is recorded in
`docs/calculator/CHECKPOINT_2026-05-23_POST_V1_ACOUSTIC_CALCULATOR_STATE_RECONCILIATION.md`.
Docs and implementation now agree that usable V1 Steps 0-5 are closed
for the current company-internal envelope, the answer-engine contract
exists and is part of the current gate, and the shared resolver surface
has 30 declared candidates with 27 active runtime-basis mappings. This
does not select a broad source crawl or finite scenario pack. The next
slice must be explicitly chosen as post-V1 accuracy/adapters or expanded
formula coverage while preserving exact/anchor/formula/`needs_input`/
`unsupported` answer order and basis boundaries.

Latest active handoff, 2026-05-23: post-V1 wall lab formula trace
reconciliation has landed. This is calculator answer-engine work, not a
catalog/source-library expansion. The existing Gate H lined massive-wall
runtime and company-internal heavy-composite wall runtime now map into
the shared layer-combination resolver registry, runtime adapter, visible
surface trace, and Answer Engine V1 wall matrix. A lined massive wall
lab formula answer now publishes through
`candidate_lined_massive_wall_family_physics_prediction` on
`gate_h_lined_massive_wall_cavity_aware_family_physics_runtime`; the
current tested stack pins `Rw 60` / STC 60 / `C -0.8` / `Ctr -5.7`.
The heavy-composite lab formula answer now publishes through
`candidate_company_internal_heavy_composite_wall_family_physics_prediction`
on
`company_internal_heavy_composite_wall_mass_air_mass_capped_family_physics_runtime`
with `Rw 63` / STC 63 / `C -1.4` / `Ctr -6.3`. The route resolver now
keeps known wall airborne formula runtimes on the wall route even when
incidental floor-system artifacts exist on the calculation object.
Registry and matrix counts are now 28 declared candidates and 25 active
runtime-basis mappings. Targeted validation passed 7 engine files / 52
tests. Full `pnpm calculator:gate:current` then passed: engine 510 files
/ 2912 tests, web 94 files / 397 passed + 18 skipped, repo build 5 / 5,
and whitespace guard passed. This is not a broad source crawl, tolerance
retune, confidence wording pass, or finite scenario-pack expansion.

Previous active handoff, 2026-05-23: post-V1 flat-list adjacent-swap
guard answer trace reconciliation has landed. This is calculator
answer-engine work, not a catalog/source-library expansion. The
adjacent flat-list Rockwool/MLV/plaster wall case that keeps the
guarded double-leaf numeric lane now selects visible resolver
candidates instead of leaking numeric answers behind a `needs_input`
trace: lab `Rw 51` / STC 51 / `C -1.8` / `Ctr -7.3` publish through
`wall.flat_list_adjacent_swap.double_leaf_numeric_guard`, and complete
field context publishes `R'w 49` / `DnT,w 50` through
`wall.flat_list_adjacent_swap.field_context_adapter`. Flat split or
grouping-ambiguous multileaf cases without the guarded adjacent-swap
numeric path still stop as `needs_input`; lab and field bases remain
separate. Registry and matrix counts are now 23 declared candidates and
20 active runtime-basis mappings. Validation passed first with targeted
engine/web sets, then full `pnpm calculator:gate:current`: engine 510
files / 2912 tests, web 94 files / 397 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed. This is not a broad source crawl,
tolerance retune, confidence wording pass, or finite scenario-pack
expansion.

Previous active handoff, 2026-05-23: post-V1 local-substitution wall
formula trace integration has landed. This is answer-engine integration,
not catalog/source-library work: the existing wall triple-leaf
local-substitution `Rw` runtime, lab-spectrum `STC`/`C`/`Ctr` adapter,
and field-context `R'w`/`DnT,w` adapter now map into the shared
layer-combination resolver registry, runtime adapter, and visible
candidate trace. The live local Rockwool/MLV/plaster grouped triple-leaf
case now traces the source-absent `Rw 53`, lab-spectrum `STC 64` /
`C 1.6` / `Ctr -7.2`, and field `R'w 51` / `DnT,w 53` answers with
the correct candidate ids, basis, support bucket, and scenario-specific
value pins. Registry and matrix counts are now 21 declared candidates
and 18 active runtime-basis mappings. Keep the registry free of heavy
runtime imports; local-substitution ids are string-mapped there to avoid
runtime import cycles. Targeted validation passed for registry, runtime
candidate adapter, surface parity, candidate coverage matrix,
company-internal V0, post-single-leaf matrix, and Answer Engine V1. This
was followed by full `pnpm calculator:gate:current`: engine 510 files /
2912 tests, web 94 files / 397 passed + 18 skipped, repo build 5 / 5,
and whitespace guard passed. This is not a broad source crawl,
tolerance retune, confidence wording pass, or finite scenario-pack
expansion.

Latest active handoff, 2026-05-22: Answer Engine V1 implementation is
continuing under
`acoustic_calculator_answer_engine_v1_plan` in
`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`.
Docs, runtime probes, and tests agree that existing exact rows,
resolver registry, runtime adapter, candidate trace, single-leaf
runtime, explicit double-leaf runtime, grouped/triple-leaf lanes, and
floor lanes are useful infrastructure and must keep feeding the answer
engine. The first slice added shared `acousticAnswerBoundary` payloads,
parked missing `resilientBarSideCount` wall outputs, turned flat gypsum /
rockwool / gypsum without topology into a traced double-leaf
`needs_input` boundary, and turned roleless helper-only timber/open-web
impact publication into a floor-role `needs_input` boundary while
preserving raw floor screening and field-airborne carrier lanes.
Workbench cards now show the floor missing-role boundary as
`needs_input`. The follow-up slice now parks detected flat
multileaf/multicavity wall answers until grouped topology fields are
supplied, adds wall `acousticAnswerBoundary` payloads for those answer
stops, and keeps adjacent-swap double-leaf guard/source-like resilient
bar lanes available when they remain the selected answer path. Result
answer charts, summary cards, and wall lab/field output cards no longer
show parked diagnostic airborne metrics as the active answer. The next
follow-up now keeps partial building-prediction `needs_input` and
opening/leak building `unsupported` wall requests on explicit wall
`acousticAnswerBoundary` payloads and wall resolver traces, with no
runtime value pins, even when incidental floor artifacts exist on the
calculation object. Floor impact field-adapter/source-absent lanes stay
on their floor traces when they are the selected answer path. The latest
follow-up now applies the same answer stop to partial
`field_between_rooms` wall requests: missing partition area parks the
field-apparent answer, and field-only requests with missing receiving
room volume or RT60 stay behind wall `needs_input` with exact missing
fields instead of publishing a partial field answer. Mixed lab-plus-field
requests keep owned lab outputs separate and park only the unavailable
field outputs. Complete Gate I field requests remain live. The latest
exact-source follow-up now lets truly exact measured wall rows win
before formula missing-input prompts: the Knauf LSF exact row selects the
measured full-stack answer, maps the resolver trace to the exact
measured override candidate on `verified_airborne_exact_source`, pins
only the requested supported `Rw 55`, and carries no `needs_input`
boundary. This exact-source precedence is route-scoped to wall so floor
exact, package-transfer, raw-bare, helper-only, and field-impact lanes
remain separate. The latest metric-scope follow-up keeps that exact
override honest for mixed target-output requests: an Rw-only exact
source can publish exact `Rw`, but `STC`, `C`, and `Ctr` stay
unsupported on the exact answer instead of being aliased from the
anchored curve. Field exact labels follow the same rule: `R'w` can
restore exact field precedence only for `R'w`, while official
`DnT,A,k` field rows stay on the owned `DnT,A` proxy lane instead of
becoming `R'w` / `DnT,w` aliases. Exact wall catalog matching now also
accepts a fully reversed layer order for the same wall stack, so the
same measured wall viewed from the opposite side does not fall back to a
formula lane. The newest trace follow-up aligns resolver surfaces with
that metric scope: official `DnT,A,k` field exact answers now trace as
`field_apparent`, support only `DnT,A` / `DnT,A,k`, and pin only those
field metrics instead of showing the old lab `Rw` / STC / `C` / `Ctr`
exact row capabilities. Exact measured floor rows and impact-only exact
floor traces now follow the same metric-scope rule: measured
floor-family answers pin only owned floor metrics such as `Rw`, `C`,
`Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI`; `STC`, `Ctr`, and ASTM/IIC
aliases stay out unless a separate owner exists. Exact ISO 717-2
impact-band sources now have their own resolver exact candidate on
`exact_source_band_curve_iso7172`; lab sources pin only ISO impact
metrics such as `Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI`, field sources
trace as `field_apparent` for owned metrics such as `L'nT,w` and
`LnT,A`, and ASTM `IIC`/`AIIC` remains a visible unsupported boundary
instead of an alias. Mixed exact impact-band plus floor airborne
requests now keep the source-absent airborne values on their own
calculation basis: the exact impact resolver trace supports and pins
only impact-owned outputs such as `Ln,w` and `CI`, so `Rw`, STC, `C`,
and `Ctr` cannot appear as if they were owned by the ISO 717-2 impact
source. The latest Step 2 wall acceptance slice now lands the engine
wall V1 matrix and registers the complete Gate I wall field-apparent
adapter as `wall.airborne_field_context.field_apparent_adapter` instead
of losing that route to incidental floor artifacts. Complete
`field_between_rooms` wall requests trace as `field_apparent`, support
owned field metrics such as `R'w` and `DnT,w`, and pin the live field
values; partial wall field context still stops as `needs_input`, and
unsupported building/opening owners stay value-less. The latest Step 2 parity follow-up closes the wall UI/API/report
side: exact wall metric scope, complete wall field-apparent values,
partial field `needs_input`, and unsupported building/opening boundaries
now match across output cards, Markdown report lines, and `/api/estimate`
payloads. A card precedence bug was fixed so unsupported wall
building/opening field outputs remain `unsupported` instead of being
relabeled as missing field input. The latest Step 3 engine follow-up
lands the floor V1 acceptance matrix across exact floor rows, exact ISO
717-2 impact-band rows, package-transfer anchors, supported-band
anchors, raw-bare, helper-only, direct-fixed, lab-impact formula,
field-impact missing context, and ASTM blockers. It also registers the
heavy concrete floating-floor lab-impact formula as
`floor.heavy_concrete_floating_floor.lab_impact_formula` on
`predictor_heavy_floating_floor_iso12354_annexc_estimate`, so mixed
`Ln,w` / `DeltaLw` / `IIC` requests keep calculated ISO lab values live
while `IIC` remains a boundary candidate instead of stealing the
selected trace. The shared resolver registry now has 18 declared
candidates and 15 active runtime-basis mappings. Targeted Step 3 engine
validation passed 7 files / 51 tests, targeted Step 3 web parity
validation passed 1 file / 11 tests, and Step 3 is now closed. The
latest Step 4 surface parity follow-up now scopes answer charts, result
summary cards, report live-stack summaries, saved replay, server
snapshot replay, and resolver candidate surfaces to the same selected
answer outputs. Impact-only floor answers no longer show incidental
`Rw` / STC / `C` / `Ctr` as answers; exact `Rw`-only wall answers no
longer display unowned STC or spectrum companions; and wall/floor
`needs_input` stops remain visible with exact missing fields across
replay, cards, traces, and Markdown reports. Targeted Step 4 web
validation passed 5 files / 28 tests, and Step 4 is now closed. The
latest Step 5 company-internal usable V1 acceptance gate is now landed
in
`packages/engine/src/acoustic-calculator-company-internal-usable-v1-acceptance-gate-contract.test.ts`
and included in `pnpm calculator:gate:current`. It covers realistic
wall/floor exact, anchor, source-absent formula, `needs_input`,
unsupported, hostile layer-order, duplicate/split-layer,
missing-context, and metric-alias-negative cases. The Step 5 work also
parked ownerless floor package-transfer STC, kept exact impact-band
airborne companions parked, and preserved real floor field/building
continuation values only when the selected runtime publishes them. The
full `pnpm calculator:gate:current` passed with engine 510 files / 2912
tests, web 94 files / 397 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed. Steps 0-5 of the usable V1 plan are closed, so
the current tested envelope is ready for company-internal usable V1;
future work must be selected as post-V1 accuracy/adapters or expanded
formula coverage, not as a broad source crawl, confidence exercise, or
finite scenario pack.

Previous active handoff, 2026-05-21: implementation/runtime analysis
found that the existing source rows, candidate registry, runtime basis
adapter, surface parity, single-leaf solver, double-leaf solver,
triple-leaf/grouped wall lanes, and floor impact lanes are useful
infrastructure, but they are not yet operating as one acoustic
calculator answer engine. The immediate selected next action is now
`acoustic_calculator_answer_engine_v1_plan` in
`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`;
selected next label: acoustic calculator answer engine V1. This
supersedes the narrow post-double-leaf coverage revalidation as the
immediate next slice. Do not delete or bypass existing landed solver
lanes. Make the calculator choose, in order, exact measured answer,
compatible measured anchor, calibrated formula, source-absent formula,
required physical input prompt, or unsupported basis. The first product
bar is answer correctness: diagnostic curves may remain internal, but
the user-facing answer must not publish `Rw`, STC, `C`, `Ctr`, `Ln,w`,
`CI`, field, or building values as the answer when the selected path is
missing-input or unsupported. Flat double-leaf-like stacks must either
use the owned double-leaf formula when enough physical data is present
or ask for the missing fields; they must not land as an untraced
design-looking screening result. Tagged floor raw-bare and helper-only
source-absent lanes stay valuable and should feed the answer engine.
Broad source crawl, tolerance retune, field/building aliases, and
ASTM/IIC aliases remain blocked.

Previous active handoff, 2026-05-21: the layer-combination resolver
double-leaf framed wall banded coverage refresh has landed as
`layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_plan`
with selection status
`layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_landed_no_runtime_selected_post_double_leaf_revalidation`.
It is no-runtime: the executable coverage ledger now carries
independent absorbed, resilient both-sides, and resilient one-side
double-leaf/framed wall rows on
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
and candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
Runtime pins stay independent `Rw 45` / STC 45 / `C -1` / `Ctr -6.1`,
resilient both-sides `Rw 46` / STC 46 / `C -1.1` / `Ctr -6.2`, and
resilient one-side `Rw 45` / STC 45 / `C -1.1` / `Ctr -6.2`, with
not-measured budgets. Exact precedence, missing
`resilientBarSideCount`, overlapping leaf groups, direct-fixed
double-leaf, grouped triple-leaf/multicavity, field/building separation,
floor-impact, ASTM/IIC, tolerance retune, and broad source crawl remain
blocked or separate. At landing time it selected
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
in
`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`;
selected next label: layer combination resolver post double-leaf framed
wall banded coverage revalidation. This is not a broad source crawl.

Previous active handoff, 2026-05-21: the layer-combination resolver
double-leaf framed wall banded surface parity has landed as
`layer_combination_resolver_double_leaf_framed_wall_banded_surface_parity_plan`
with selection status
`layer_combination_resolver_double_leaf_framed_wall_banded_surface_parity_landed_no_runtime_selected_coverage_refresh`.
Cards, output cards, route posture, confidence provenance,
metric-basis rows, method dossier, local saved replay, server snapshot
replay, calculator API payloads, impact-only API payloads, Markdown
report, and the shared candidate trace now expose the same source-absent
element-lab double-leaf/framed wall basis
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
and candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
Visible scenario-specific pins remain independent absorbed `Rw 45`,
STC 45, `C -1`, `Ctr -6.1` with `+/-7 dB`; resilient both-sides
`Rw 46`, STC 46, `C -1.1`, `Ctr -6.2` with `+/-8 dB`; and resilient
one-side `Rw 45`, STC 45, `C -1.1`, `Ctr -6.2` with `+/-8 dB`.
Explicit `field_between_rooms` output remains on its separate field
overlay and does not rewrite the element-lab candidate trace pins.
Exact rows still win first, missing `resilientBarSideCount` stays
`needs_input`, direct-fixed, grouped triple-leaf/multicavity,
field/building aliases, floor-impact, ASTM/IIC, tolerance retune, and
broad source crawling remain blocked. The selected next action is
`layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_plan`
in
`packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh-contract.test.ts`;
selected next label: layer combination resolver double-leaf framed wall
banded coverage refresh. This is not a broad source crawl.

Previous active handoff, 2026-05-21: the layer-combination resolver
double-leaf framed wall banded runtime corridor has landed as
`layer_combination_resolver_double_leaf_framed_wall_banded_runtime_corridor_plan`
with selection status
`layer_combination_resolver_double_leaf_framed_wall_banded_runtime_corridor_landed_selected_surface_parity`.
Complete source-absent element-lab double-leaf/framed wall stacks now
promote through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
and candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`
without numeric value movement. The independent absorbed gypsum /
rockwool / gypsum case returns `Rw 45`, STC 45, `C -1`, `Ctr -6.1`
with a not-measured `+/-7 dB` `Rw` / STC budget; resilient both-sides
returns `Rw 46`, STC 46, `C -1.1`, `Ctr -6.2` with `+/-8 dB`; and
resilient one-side returns `Rw 45`, STC 45, `C -1.1`, `Ctr -6.2` with
`+/-8 dB`. Exact rows still win first, missing
`resilientBarSideCount` stays `needs_input`, direct-fixed, grouped
triple-leaf/multicavity, unowned field/building aliases, floor-impact,
ASTM/IIC, and broad source crawling remain blocked. Explicit
`field_between_rooms` output still uses its separate field overlay and
does not relabel lab `Rw`. The selected next action is
`layer_combination_resolver_double_leaf_framed_wall_banded_surface_parity_plan`
in
`packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity-contract.test.ts`;
selected next label: layer combination resolver double-leaf framed wall
banded surface parity. This is not a broad source crawl.

Previous active handoff, 2026-05-21: the layer-combination resolver
double-leaf framed wall banded formula corridor has landed as
`layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_plan`
with selection status
`layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
It is no-runtime: the source-absent element-lab basis
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
now owns the double-leaf/framed wall mass-air-mass, bridge coupling,
absorber flow resistivity, one-third-octave TL curve, ISO 717-1 Rw/C/Ctr
adapter, STC display boundary, exact-source precedence, hostile topology,
and not-measured budget terms. The formula design rows keep public Gate S
values frozen for the runtime lane: independent absorbed double-leaf
remains `Rw 45`, STC 45, `C -1`, `Ctr -6.1` with `+/-7 dB` `Rw` / STC
budgets, resilient both-sides remains `Rw 46`, STC 46, `C -1.1`,
`Ctr -6.2` with `+/-8 dB` `Rw` / STC budgets, and resilient one-side is
defined as `Rw 45` / STC 45 with the same source-absent resilient budget.
Runtime values remain null in this gate; the existing Gate S method
`gate_s_double_leaf_framed_bridge_mass_air_mass_bridge_damping_runtime`
and candidate `candidate_double_leaf_framed_bridge_family_physics_prediction`
remain the public runtime until the selected runtime corridor lands.
Exact rows still win first, missing `resilientBarSideCount` stays a
needs-input boundary, direct-fixed, grouped triple-leaf/multicavity,
field/building, floor-impact, ASTM/IIC, and broad source crawling remain
blocked. The selected next action is
`layer_combination_resolver_double_leaf_framed_wall_banded_runtime_corridor_plan`
in
`packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts`;
selected next label: layer combination resolver double-leaf framed wall
banded runtime corridor. This is not a broad source crawl.

Previous active handoff, 2026-05-21: the layer-combination resolver
double-leaf framed wall banded solver owner landed as
`layer_combination_resolver_double_leaf_framed_wall_banded_solver_owner_plan`
with selection status
`layer_combination_resolver_double_leaf_framed_wall_banded_solver_owner_landed_no_runtime_selected_formula_corridor`.
It is no-runtime: the existing Dynamic Calculator Gate S double-leaf
runtime candidate
`candidate_double_leaf_framed_bridge_family_physics_prediction` on
`gate_s_double_leaf_framed_bridge_mass_air_mass_bridge_damping_runtime`
stays pinned at independent absorbed `Rw 45` / STC 45 / `C -1` /
`Ctr -6.1` and resilient both-sides `Rw 46` / STC 46. The new owner
does not register that runtime in the layer-combination resolver yet; it
names the owner fields for the next corridor: side-leaf grouping and
surface mass, cavity depth and mass-air-mass resonance, absorber flow
resistivity and damping, support/bridge coupling, explicit
`resilientBarSideCount`, one-third-octave TL, ISO 717-1 Rw/C/Ctr
adapter, STC boundary, exact/holdout precedence, source-absent budget,
hostile topology, triple-leaf/multicavity separation, field/building
blocking, and floor-impact blocking. Direct-fixed double-leaf, missing
resilient side count, grouped triple-leaf, field/building promotion,
ASTM/STC alias promotion, tolerance retune, and broad source crawl
remain blocked. The planned next basis is
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`.
The selected next action is
`layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_plan`
in
`packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor-contract.test.ts`;
selected next label: layer combination resolver double-leaf framed wall
banded formula corridor. This is not a broad source crawl.

Previous active handoff, 2026-05-21: the post single-leaf mass-law
banded matrix refresh landed as
`layer_combination_resolver_post_single_leaf_mass_law_banded_matrix_refresh_plan`
with selection status
`layer_combination_resolver_post_single_leaf_mass_law_banded_matrix_refresh_landed_no_runtime_selected_double_leaf_framed_wall_banded_solver_owner`.
It is no-runtime: the single-leaf candidate stays
`candidate_layer_combination_resolver_single_leaf_mass_law_banded_source_absent_family_solver`
on basis
`layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor`
with gypsum 12.5 mm `Rw 31` / STC 31, laminated gypsum 25 mm `Rw 34` /
STC 34, concrete wall plus floor direct-airborne `Rw 55` / STC 55, and
not-measured `+/-6 dB` `Rw` and STC budgets. The matrix now treats the
former single-leaf owner gap as `ready_with_budget` and reranks the next
solver-family gap to double-leaf/framed wall owner work. Floor impact,
field/building, ASTM/IIC/AIIC, tolerance retune, and broad source crawl
remain blocked. The selected next action is
`layer_combination_resolver_double_leaf_framed_wall_banded_solver_owner_plan`
in
`packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner-contract.test.ts`;
selected next label: layer combination resolver double-leaf framed wall
banded solver owner. This is not a broad source crawl.

Current active handoff: the helper-only timber/open-web impact stack
owner has landed as
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_plan`
with selection status
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_landed_no_runtime_selected_formula_corridor`.
Previous matrix gate
`broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan`
selected it with status
`broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_landed_no_runtime_selected_helper_only_timber_open_web_impact_stack_owner`
and contract
`packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts`.
It is no-runtime: exact, direct-fixed, and supported-band open-web field
values remain pinned, raw-bare open-web field transfer is active,
building prediction remains unsupported, ASTM/IIC aliases remain
blocked, and broad source crawling remains blocked. It names helper-only
timber/open-web lower-treatment owners for base support family, carrier
geometry, lower ceiling board mass, cavity depth, absorber
thickness/density, suspension/support class, package absence, impact
curve ownership, ISO impact adapters, hostile topology, and budget
terms. The selected next action is
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_plan`
in
`packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor-contract.test.ts`;
selected next label: floor helper-only timber/open-web impact stack
formula corridor. This is not a broad source crawl.

That helper-only timber/open-web impact stack formula corridor has now
landed as
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_plan`
with selection status
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
It defines the no-runtime source-absent element-lab basis
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`
for helper-only timber/open-web lower-treatment stacks while public
runtime values remain unchanged. Tagged timber helper-only remains on
airborne screening with impact unsupported; tagged open-web helper-only
remains on the weak current family estimate until the runtime corridor;
exact, direct-fixed, supported-band, raw-bare, package-transfer, and
EPS/screed lanes remain separate; raw-bare impact field transfer,
building prediction, and ASTM/IIC aliases remain blocked. The selected
next action is
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_plan`
in
`packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor-contract.test.ts`;
selected next label: floor helper-only timber/open-web impact stack
runtime corridor. This is not a broad source crawl.

That helper-only timber/open-web impact stack runtime corridor has now
landed as
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_plan`
with selection status
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_landed_selected_surface_parity`.
Complete source-absent element-lab helper-only lower-treatment stacks now
promote through
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`.
The open-box timber helper-only case returns `Rw 54.8`, `C -1.1`,
`Ctr -5.9`, `Ln,w 59.6`, `CI 1`, `CI,50-2500 2.3`, and
`Ln,w+CI 60.6`; the timber-joist case returns `Rw 47.3`, `C -2.1`,
`Ctr -8.3`, `Ln,w 65.4`, `CI 0.8`, `CI,50-2500 3.5`, and
`Ln,w+CI 66.2`; the open-web helper-only case returns `Rw 46.7`,
`C -1.7`, `Ctr -7.9`, `Ln,w 59.6`, `CI 1`, `CI,50-2500 4`, and
`Ln,w+CI 60.6`. Budgets remain not-measured source-absent budgets,
including `+/-8.5 dB` `Rw` / `+/-10.5 dB` `Ln,w` for open-box timber,
`+/-9.5 dB` `Rw` / `+/-11.5 dB` `Ln,w` for timber joists, and
`+/-9 dB` `Rw` / `+/-10 dB` `Ln,w` for open-web. Exact/package/raw-bare
lanes still win first; partial, roleless, and missing-board helper-like
inputs stay outside this runtime; field/building and ASTM/IIC aliases
remain blocked. The selected next action is
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_surface_parity_plan`
in
`packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity-contract.test.ts`;
selected next label: floor helper-only timber/open-web impact stack
surface parity. This is not a broad source crawl.

That helper-only timber/open-web impact stack surface parity has now
landed as
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_surface_parity_plan`
with selection status
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_surface_parity_landed_selected_coverage_refresh`.
Cards, route posture, confidence provenance, metric-basis rows, method
dossier, local saved replay, server snapshot replay, calculator API,
impact-only API, and Markdown report now expose the same helper-only
source-absent element-lab basis,
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`.
Visible runtime values remain open-box timber `Rw 54.8` / `Ln,w 59.6`,
timber joist `Rw 47.3` / `Ln,w 65.4`, and open-web `Rw 46.7` /
`Ln,w 59.6`, with not-measured source-absent budgets. Fully tagged
impact-only entrypoints now preserve the same helper-only lane instead
of falling into the broader family-general estimate. Exact/package/
raw-bare, direct-fixed, supported-band, field/building, and ASTM/IIC
boundaries remain blocked or ahead as before. The selected next action is
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_plan`
in
`packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh-contract.test.ts`;
selected next label: floor helper-only timber/open-web impact stack
coverage refresh. This is not a broad source crawl.

That helper-only timber/open-web impact stack coverage refresh has now
landed as
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_plan`
with selection status
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_landed_no_runtime_selected_post_helper_only_revalidation`.
It is no-runtime: the executable coverage ledger now carries
helper-only open-box timber 370 mm, split 185/185, 4x92.5 safe
fragments, timber-joist 250 mm, open-web 250 mm, and open-web split
125/125 while keeping all runtime values unchanged. Visible pins remain
open-box timber `Rw 54.8` / `Ln,w 59.6` with `+/-8.5 dB` `Rw` and
`+/-10.5 dB` `Ln,w` budgets, timber-joist `Rw 47.3` / `Ln,w 65.4`,
and open-web `Rw 46.7` / `Ln,w 59.6` on
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`.
Exact/package precedence stays first; raw-bare, direct-fixed, and
supported-band lanes stay separate; partial, roleless, missing-board,
field/building, and ASTM/IIC requests stay blocked. The selected next
action is
`broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan`
in
`packages/engine/src/broad-accuracy-post-helper-only-timber-open-web-impact-stack-coverage-revalidation-contract.test.ts`;
selected next label: post helper-only timber/open-web impact stack
coverage revalidation. This is not a broad source crawl.

That post-helper-only timber/open-web impact stack coverage revalidation
has now landed as
`broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan`
with selection status
`broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_landed_no_runtime_selected_layer_combination_resolver_registry`.
It is no-runtime: helper-only timber/open-web values remain open-box
timber `Rw 54.8` / `Ln,w 59.6`, timber-joist `Rw 47.3` /
`Ln,w 65.4`, and open-web `Rw 46.7` / `Ln,w 59.6` on
`broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`.
Exact/package precedence stays first, raw-bare, direct-fixed, and
supported-band lanes stay separate, field/building and ASTM/IIC requests
stay blocked, and this is not a broad source crawl. The selected next
action is `layer_combination_resolver_registry_plan` in
`packages/engine/src/layer-combination-resolver-registry-contract.test.ts`;
selected next label: layer combination resolver registry.

The layer combination resolver registry has now landed as
`layer_combination_resolver_registry_plan` with selection status
`layer_combination_resolver_registry_landed_no_runtime_selected_runtime_candidate_adapter`.
It is no-runtime: it defines the shared candidate declaration surface for
exact measured overrides, similarity anchor candidates, calibrated family
solver candidates, source-absent family solver candidates, `needs_input`
boundaries, `unsupported` boundaries, field/building basis boundaries,
and ASTM/IIC alias blockers without moving runtime values. The selected
next action is `layer_combination_resolver_runtime_candidate_adapter_plan`
in
`packages/engine/src/layer-combination-resolver-runtime-candidate-adapter-contract.test.ts`;
selected next label: layer combination resolver runtime candidate
adapter. This is not a broad source crawl.

The layer combination resolver runtime candidate adapter has now landed
as `layer_combination_resolver_runtime_candidate_adapter_plan` with
selection status
`layer_combination_resolver_runtime_candidate_adapter_landed_no_runtime_selected_surface_parity`.
It is no-runtime: current runtime basis ids now map into the shared
resolver candidate id surface for exact measured overrides, similarity
anchors, calibrated family solvers, source-absent family solvers,
field/building adapters, `needs_input` boundaries, and `unsupported` /
ASTM/IIC boundaries without moving helper-only, raw-bare, direct-fixed,
supported-band, package-transfer, exact, or field values. The selected
next action is
`layer_combination_resolver_runtime_candidate_surface_parity_plan` in
`packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity-contract.test.ts`;
selected next label: layer combination resolver runtime candidate
surface parity. This is not a broad source crawl.

The layer combination resolver runtime candidate surface parity has now
landed as `layer_combination_resolver_runtime_candidate_surface_parity_plan`
with selection status
`layer_combination_resolver_runtime_candidate_surface_parity_landed_no_runtime_selected_candidate_coverage_matrix_refresh`.
It is no-runtime: `AssemblyCalculation` and `ImpactOnlyCalculation`
now expose a shared `layerCombinationResolverTrace` candidate trace, and
the calculator API, impact-only API, workbench replay path, and Markdown
report surface the same selected candidate id, candidate kind, support
bucket, runtime basis, value pins, boundary candidates, and rejected
candidate count without moving helper-only, raw-bare, direct-fixed,
supported-band, package-transfer, exact, or field values. `needs_input`,
`unsupported`, field/building, and ASTM/IIC boundaries remain visible
and blocked. The selected next action is
`layer_combination_resolver_candidate_coverage_matrix_refresh_plan` in
`packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts`;
selected next label: layer combination resolver candidate coverage
matrix refresh. This is not a broad source crawl.

The layer combination resolver candidate coverage matrix refresh has now
landed as
`layer_combination_resolver_candidate_coverage_matrix_refresh_plan` with
selection status
`layer_combination_resolver_candidate_coverage_matrix_refresh_landed_no_runtime_selected_company_internal_v0_rehearsal`.
It is no-runtime: the executable candidate coverage matrix covers all 13
resolver candidate declarations, 13 surface rows, 10 active runtime
candidates, and 3 boundary rows across exact measured overrides,
similarity anchors, calibrated family solvers, source-absent family
solvers, field/building adapters, `needs_input`, basis boundaries, and
unsupported ASTM/IIC blockers. Runtime acoustic values remain frozen;
source rows remain evidence, anchors, holdouts, or exact overrides rather
than the product. Later landed single-leaf, double-leaf, floor lanes,
the Answer Engine V1 exact impact-band trace, the Step 2 wall
field-apparent adapter, and the Step 3 heavy floating-floor lab-impact
formula trace bring the live registry to 18 declarations and 15 active
runtime-basis mappings; use the live registry summary for new
answer-engine work.
The selected next action at this historical gate was
`layer_combination_resolver_company_internal_v0_rehearsal_plan` in
`packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal-contract.test.ts`;
selected next label: layer combination resolver company-internal V0
rehearsal. This is not a broad source crawl.

The layer combination resolver company-internal V0 rehearsal has now
landed as
`layer_combination_resolver_company_internal_v0_rehearsal_plan` with
selection status
`layer_combination_resolver_company_internal_v0_rehearsal_landed_no_runtime_selected_single_leaf_mass_law_banded_solver_owner`.
It is no-runtime: the current resolver operating envelope classifies 13
candidate rows as 2 `ready`, 8 `ready_with_budget`, 1 `needs_input`, 2
`unsupported`, and 0 registered `research_only` rows, while ranking six
research-only gaps for later owner gates. Company-internal V0 use is
allowed only for the 10 exact or budgeted rows with visible candidate id,
basis, support bucket, required fields, value pins, and budgets;
`needs_input`, field/building promotion, ASTM/IIC/AIIC aliases,
tolerance retunes without holdouts, and broad source crawling remain
blocked. The selected next action is
`layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_plan`
in
`packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-solver-owner-contract.test.ts`;
selected next label: layer combination resolver single-leaf mass-law
banded solver owner. This is not a broad source crawl.

The layer combination resolver single-leaf mass-law banded solver owner
has now landed as
`layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_plan`
with selection status
`layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_landed_no_runtime_selected_formula_corridor`.
It is no-runtime: it owns the wall/floor direct-airborne single-visible-
leaf route scope, material density/surface mass/thickness fields,
stiffness/coincidence family, one-third-octave TL curve, ISO 717-1
`Rw`/`C`/`Ctr` adapter, exact-source precedence, holdout residual
budget, source-absent error budgets, hostile topology boundaries, and
floor direct-airborne scope while keeping floor impact, field/building,
ASTM/IIC/AIIC, broad source crawl, tolerance retune, and Rw-to-STC alias
promotion blocked. Current Gate O single-leaf values remain frozen:
gypsum 12.5 mm `Rw/STC 31`, laminated gypsum 25 mm `Rw/STC 34`, and
concrete 150 mm `Rw/STC 55`. The selected next action is
`layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_plan`
in
`packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor-contract.test.ts`;
selected next label: layer combination resolver single-leaf mass-law
banded formula corridor. This is not a broad source crawl.

The layer combination resolver single-leaf mass-law banded formula
corridor has now landed as
`layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_plan`
with selection status
`layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
It is no-runtime: it defines the source-absent element-lab basis
`layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor`
from surface mass, stiffness/coincidence, one-third-octave TL curve,
ISO 717-1 `Rw`/`C`/`Ctr`, exact-source precedence, and budget terms.
Representative design payloads include gypsum 12.5 mm `Rw 31`,
laminated gypsum 25 mm `Rw 34`, and concrete/floor direct-airborne
`Rw 55` with `+/-6 dB` `Rw` / STC-compatibility budgets. Runtime values
remain frozen, exact rows still win first, and floor impact,
field/building, ASTM/IIC/AIIC, broad source crawling, tolerance retune,
and Rw-to-STC alias promotion remain blocked. The selected next action
is
`layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_plan`
in
`packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor-contract.test.ts`;
selected next label: layer combination resolver single-leaf mass-law
banded runtime corridor. This is not a broad source crawl.

The layer combination resolver single-leaf mass-law banded runtime
corridor has now landed as
`layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_plan`
with selection status
`layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_landed_selected_surface_parity`.
Complete source-absent wall/floor direct-airborne single-leaf
element-lab stacks now expose the runtime basis
`layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor`
and the shared resolver candidate
`candidate_layer_combination_resolver_single_leaf_mass_law_banded_source_absent_family_solver`
without moving numeric values: gypsum 12.5 mm stays `Rw 31`,
laminated gypsum 25 mm stays `Rw 34`, and concrete/floor
direct-airborne stays `Rw 55` with `+/-6 dB` Rw/STC compatibility
budget. Exact rows still win first; field/building, floor impact,
ASTM/IIC/AIIC, broad source crawling, tolerance retune, and new
Rw-to-STC alias promotion remain outside this gate. The selected next
action is
`layer_combination_resolver_single_leaf_mass_law_banded_surface_parity_plan`
in
`packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-surface-parity-contract.test.ts`;
selected next label: layer combination resolver single-leaf mass-law
banded surface parity. This is not a broad source crawl.

Latest checkpoint: read
`docs/calculator/CHECKPOINT_2026-05-20_BROAD_ACCURACY_REVALIDATION_AND_OPEN_BOX_FRAGMENTATION_PLAN.md`
before continuing. The fresh `pnpm calculator:gate:current` pass was
green after the layer-combination resolver double-leaf framed wall
banded coverage refresh closeout on 2026-05-21 with engine 508 files /
2889 tests, web 94 files / 388 passed + 18 skipped, repo build 5 / 5,
and whitespace guard passed. The controlled internal envelope is
green, but broad "every
common wall/floor combination" confidence is not done. The no-runtime
exact-only hybrid fragmentation policy has now landed as
`broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan`
with selection status
`broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_landed_no_runtime_selected_raw_bare_reopening_guard`.
It classifies the five TUAS exact-only hybrid / fragmented rows as exact
evidence only, keeps `Ln,w 50.8`, `CI,50-2500 3.3`, and `Rw 66` frozen
on the package-transfer lane, and keeps field/building plus ASTM/IIC
aliases blocked. The no-runtime raw-bare open-box reopening guard has
now landed as
`broad_accuracy_floor_open_box_timber_raw_bare_reopening_guard_plan`
with selection status
`broad_accuracy_floor_open_box_timber_raw_bare_reopening_guard_landed_no_runtime_selected_bare_carrier_owner`.
It keeps roleless, tagged, split, upper-only, and lower-only raw
`open_box_timber_slab` probes off the package-transfer `Ln,w 50.8`,
`CI,50-2500 3.3`, and `Rw 66` lane; their current airborne `Rw` remains
screening-only, impact stays unsupported, and field/building plus
ASTM/IIC aliases stay blocked. The no-runtime bare-carrier owner
contract has now landed as
`broad_accuracy_floor_open_box_timber_raw_bare_carrier_owner_contract_plan`
with selection status
`broad_accuracy_floor_open_box_timber_raw_bare_carrier_owner_landed_no_runtime_selected_formula_corridor`.
Landed contract:
`packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner-contract.test.ts`.
It owns the required raw-bare support geometry, airborne direct-curve,
bare impact-curve, finish absence, lower-treatment state,
package-transfer exclusion, basis-boundary, hostile-topology, and
uncertainty-budget fields without moving runtime values. The raw-bare
formula corridor has now landed as the selected raw-bare formula corridor:
`broad_accuracy_floor_open_box_timber_raw_bare_formula_corridor_plan`
with selection status
`broad_accuracy_floor_open_box_timber_raw_bare_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
Landed contract:
`packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor-contract.test.ts`.
It defines the source-absent raw-bare basis
`broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor`
with element-lab design payloads only: the canonical 370 mm raw-bare
open-box fixture is `Rw 42.3`, `Ln,w 88.2`, `CI,50-2500 3.1`, and the
wide not-measured budgets are `+/-8 dB` for `Rw` and `+/-10 dB` for
`Ln,w`. The raw-bare runtime corridor has now landed as
`broad_accuracy_floor_open_box_timber_raw_bare_runtime_corridor_plan`
with selection status
`broad_accuracy_floor_open_box_timber_raw_bare_runtime_corridor_landed_selected_surface_parity`.
Complete raw-bare open-box timber base-only inputs now promote through
the source-absent element-lab formula basis: the canonical 370 mm case
returns `Rw 42.3`, `C -1.4`, `Ctr -5.8`, `Ln,w 88.2`,
`CI,50-2500 3.1`, and `Ln,w+CI 87.1`, while the 220 mm case returns
`Rw 38.1` and `Ln,w 91.1`. Exact TUAS package rows still win, finished
package-transfer pins `Ln,w 50.8`, `CI,50-2500 3.3`, and `Rw 66` stay
on their own lane, partial packages and wrong support families stay out,
and field/building plus ASTM/IIC aliases stay blocked. Landed runtime
contract:
`packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor-contract.test.ts`.
The raw-bare surface parity gate has now landed as
`broad_accuracy_floor_open_box_timber_raw_bare_surface_parity_plan`
with selection status
`broad_accuracy_floor_open_box_timber_raw_bare_surface_parity_landed_selected_coverage_refresh`.
Cards, route posture, dynamic trace, impact support notes, confidence
provenance, metric-basis rows, method dossier, local saved replay,
server snapshot replay, calculator API, impact-only API, and Markdown
report now expose the raw-bare open-box timber basis, `Rw 42.3`,
`Ln,w 88.2`, `CI,50-2500 3.1`, `+/-8 dB` `Rw`, and `+/-10 dB`
`Ln,w` budgets without presenting them as measured evidence. Exact TUAS
rows still win, package-transfer pins stay on their own lane, and
field/building plus ASTM/IIC aliases remain blocked. Landed surface
parity contract:
`packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-surface-parity-contract.test.ts`.
Surface-parity selected action, now consumed by the coverage refresh:
`broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_plan`;
surface-parity selected file:
`packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts`.
The raw-bare coverage refresh has now landed as
`broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_plan`
with selection status
`broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_landed_selected_post_raw_bare_revalidation`.
It refreshes the executable coverage matrix for raw-bare open-box timber
370 mm, split 185/185 mm, and 220 mm while keeping `Rw 42.3`,
`Ln,w 88.2`, `CI,50-2500 3.1`, `+/-8 dB` `Rw`, and `+/-10 dB`
`Ln,w` unchanged. It proves exact TUAS package precedence,
package-transfer separation, partial-package and wrong-family refusals,
field/building blockers, and ASTM/IIC blockers without moving runtime
values. Landed coverage-refresh contract:
`packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts`.
Selected next action:
`broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan`;
selected next file:
`packages/engine/src/broad-accuracy-post-raw-bare-open-box-timber-coverage-revalidation-contract.test.ts`.
That post raw-bare revalidation has now landed as
`broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan`
with selection status
`broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_landed_no_runtime_selected_package_transfer_residual_expansion`.
It is no-runtime: raw-bare open-box timber stays `Rw 42.3` /
`Ln,w 88.2`, finished package-transfer stays `Ln,w 50.8`, exact TUAS
rows still win, tolerances/API/workbench behavior do not move, and
field/building plus ASTM/IIC aliases remain blocked. It is not a broad
source crawl. The selected next action is
`broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-package-transfer-residual-expansion-contract.test.ts`;
the next lane is package-transfer residual expansion for exact-only
hybrid / mixed-staged same-family evidence gaps.
That package-transfer residual expansion has now landed as
`broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan`
with selection status
`broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_landed_no_runtime_selected_eps_screed_hybrid_package_owner`.
It is no-runtime: `R7b` is the only selected candidate owner gap,
`R8b` and `R9b` are residual-readiness/negative-boundary evidence,
`R2c` and `R10a` remain blocked negative boundaries, and all five rows
stay exact-only instead of entering the package-transfer runtime anchors.
The existing package-transfer pins stay `Ln,w 50.8` / `Rw 66` for dry
gypsum-fiber, `Ln,w 53.5` / `Rw 55.5` for thin laminate, and
`Ln,w 53.5` / `Rw 63.5` for reinforced ceiling. Field/building and
ASTM/IIC aliases remain blocked, and this is not a broad source crawl.
The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner-contract.test.ts`.
Selected next label: EPS/screed hybrid package owner.
That EPS/screed hybrid package owner has now landed as
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan`
with selection status
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_landed_no_runtime_selected_formula_corridor`.
It is no-runtime: R7b now owns the 370 mm open-box support, 35 mm EPS
board, 1 mm geotextile, 40 mm screed, 3 mm EPS underlay, 8 mm laminate,
and hybrid lower treatment owner checklist for the next formula
corridor. R8b, R9b, R2c, and R10a stay negative boundaries, the current
dry package `Ln,w 50.8` / `Rw 66` pin remains frozen, field/building and
ASTM/IIC aliases remain blocked, and this is not a broad source crawl.
The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor-contract.test.ts`.
Selected next label: EPS/screed hybrid package formula corridor.
That EPS/screed hybrid package formula corridor has now landed as
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_plan`
with selection status
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
It is no-runtime: the corridor defines R7b-anchored element-lab design
metrics `Rw 72`, `C -1.3`, `Rw+C 70.7`, `Ln,w 47`, `CI 0`,
`CI,50-2500 1`, and `Ln,w+CI 47` with source-absent not-measured
budgets, but exact R7b still wins first and public runtime values remain
unchanged. R8b, R9b, R2c, and R10a remain negative boundaries, the
generic dry package-transfer basis is still forbidden, and field/building
plus ASTM/IIC aliases remain blocked. The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor-contract.test.ts`.
Selected next label: EPS/screed hybrid package runtime corridor.
That EPS/screed hybrid package runtime corridor has now landed as
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_plan`
with selection status
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_landed_selected_surface_parity`.
Complete source-absent open-box timber EPS/screed hybrid variants now
promote through the
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor`
runtime basis. The representative source-absent element-lab case returns
`Rw 72`, `C -1.3`, `Rw+C 70.7`, `Ln,w 47`, `CI 0`,
`CI,50-2500 1`, and `Ln,w+CI 47` with not-measured budgets including
`+/-7 dB` for `Rw` and `+/-8 dB` for `Ln,w`. Exact R7b still wins,
dry package-transfer remains a separate lane, R8b/R9b/R2c/R10a remain
negative boundaries, and field/building plus ASTM/IIC aliases remain
blocked. The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity-contract.test.ts`.
Selected next label: EPS/screed hybrid package surface parity.
That EPS/screed hybrid package surface parity has now landed as
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_plan`
with selection status
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_landed_selected_matrix_refresh`.
Cards, route posture, confidence provenance, metric-basis rows, method
dossier, local saved replay, server snapshot replay, calculator API,
impact-only API, and Markdown report now expose the same
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor`
basis. The visible source-absent element-lab case remains `Rw 72`,
`C -1.3`, `Rw+C 70.7`, `Ln,w 47`, `CI 0`, `CI,50-2500 1`, and
`Ln,w+CI 47` with not-measured budgets including `+/-7 dB` for `Rw`
and `+/-8 dB` for `Ln,w`. Exact R7b still wins, dry package-transfer
and raw-bare lanes stay separate, R8b/R9b/R2c/R10a remain negative
boundaries, and field/building plus ASTM/IIC aliases remain blocked.
The selected next action is
`broad_accuracy_open_box_timber_post_eps_screed_hybrid_matrix_refresh_plan`
in
`packages/engine/src/broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh-contract.test.ts`.
Selected next label: open-box timber post EPS/screed hybrid matrix
refresh.
That post EPS/screed hybrid matrix refresh has now landed as
`broad_accuracy_open_box_timber_post_eps_screed_hybrid_matrix_refresh_plan`
with selection status
`broad_accuracy_open_box_timber_post_eps_screed_hybrid_matrix_refresh_landed_no_runtime_selected_open_web_raw_bare_owner`.
It is a no-runtime company-internal V0 operating-envelope snapshot:
open-box package-transfer remains `Ln,w 50.8`, raw-bare remains
`Rw 42.3` / `Ln,w 88.2`, and EPS/screed remains `Rw 72` / `Ln,w 47`.
It keeps exact rows first, keeps dry package-transfer/raw-bare/EPS lanes
separate, and keeps field/building plus ASTM/IIC aliases blocked. The
selected next action is
`broad_accuracy_floor_open_web_raw_bare_carrier_owner_plan`
in
`packages/engine/src/broad-accuracy-floor-open-web-raw-bare-carrier-owner-contract.test.ts`.
Selected next label: floor open-web raw-bare carrier owner.
That floor open-web raw-bare carrier owner has now landed as
`broad_accuracy_floor_open_web_raw_bare_carrier_owner_plan` with
selection status
`broad_accuracy_floor_open_web_raw_bare_carrier_owner_landed_no_runtime_selected_formula_corridor`.
It is no-runtime: the current 111 UBIQ open-web rows are classified as
INEX deck / firestop package evidence with zero carrier-only raw-bare
impact rows, so raw open-web impact remains fail-closed and the current
raw carrier `Rw 79` screening posture is not promoted. The EPS/screed
pin remains `Rw 72` / `Ln,w 47`. Direct-fixed and suspended-ceiling
open-web package rows remain separate lanes, field/building plus
ASTM/IIC aliases remain blocked, and raw/split/deck screening postures
are explicit formula-owner blockers. Lower-only partial package inputs
also remain fail-closed until full INEX/firestop/package ownership
exists. The selected next action is
`broad_accuracy_floor_open_web_raw_bare_formula_corridor_plan` in
`packages/engine/src/broad-accuracy-floor-open-web-raw-bare-formula-corridor-contract.test.ts`.
Selected next label: floor open-web raw-bare formula corridor.
That floor open-web raw-bare formula corridor has now landed as
`broad_accuracy_floor_open_web_raw_bare_formula_corridor_plan` with
selection status
`broad_accuracy_floor_open_web_raw_bare_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
This is no-runtime formula-corridor work: it defines the source-absent
element-lab basis
`broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor`
from owned open-web support form, carrier geometry, bare steel reference
surface, structural mobility, ISO 717 adapter boundaries, package
exclusion, and source-absent budget terms. The representative raw
open-web design row is `Rw 32`, `C -2.2`, `Ctr -7.8`, `Ln,w 96`,
`CI 1.8`, `CI,50-2500 5.2`, and `Ln,w+CI 97.8`, with not-measured
budgets including `+/-9 dB` for `Rw` and `+/-12 dB` for `Ln,w`. Runtime
values remain null in this gate: current raw/split/deck-only open-web
public posture stays `Rw 79` screening with `C` / `Ctr` screening only,
raw impact stays unsupported, UBIQ INEX/firestop rows remain package
evidence, and field/building plus ASTM/IIC aliases remain blocked. The
selected next action is
`broad_accuracy_floor_open_web_raw_bare_runtime_corridor_plan` in
`packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor-contract.test.ts`.
Selected next label: floor open-web raw-bare runtime corridor.
That floor open-web raw-bare runtime corridor has now landed as
`broad_accuracy_floor_open_web_raw_bare_runtime_corridor_plan` with
selection status
`broad_accuracy_floor_open_web_raw_bare_runtime_corridor_landed_selected_surface_parity`.
Complete source-absent element-lab raw-bare open-web steel base-only
stacks now promote through
`broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor`:
300 mm and safe split 150/150 return `Rw 32`, `C -2.2`, `Ctr -7.8`,
`Ln,w 96`, `CI 1.8`, `CI,50-2500 5.2`, and `Ln,w+CI 97.8`; 400 mm
returns `Rw 36.6` and `Ln,w 92.8`. Budgets remain not-measured
source-absent values, including `+/-9 dB` for `Rw` and `+/-12 dB` for
`Ln,w`. Exact UBIQ INEX/firestop package rows, direct-fixed and
supported-band package lanes, deck-only or partial packages,
field/building outputs, and ASTM/IIC aliases remain outside this raw-bare
open-web lane. The selected next action is
`broad_accuracy_floor_open_web_raw_bare_surface_parity_plan` in
`packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity-contract.test.ts`.
Selected next label: floor open-web raw-bare surface parity.
That floor open-web raw-bare surface parity has now landed as
`broad_accuracy_floor_open_web_raw_bare_surface_parity_plan` with
selection status
`broad_accuracy_floor_open_web_raw_bare_surface_parity_landed_selected_coverage_refresh`.
Cards, route posture, confidence provenance, metric-basis rows, method
dossier, local saved replay, server snapshot replay, calculator API,
impact-only API, and Markdown report now expose the same
`broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor`
values: `Rw 32`, `C -2.2`, `Ctr -7.8`, `Ln,w 96`, `CI 1.8`,
`CI,50-2500 5.2`, and `Ln,w+CI 97.8` for the canonical 300 mm raw-bare
open-web steel carrier. UBIQ INEX/firestop package rows stay exact or
package evidence and are not borrowed into the raw-bare open-web formula
surface. The selected next action is
`broad_accuracy_floor_open_web_raw_bare_coverage_refresh_plan` in
`packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts`.
Selected next label: floor open-web raw-bare coverage refresh.
The floor open-web raw-bare coverage refresh has now landed as
`broad_accuracy_floor_open_web_raw_bare_coverage_refresh_plan` with
selection status
`broad_accuracy_floor_open_web_raw_bare_coverage_refresh_landed_selected_post_raw_bare_open_web_revalidation`.
It is no-runtime: 300 mm, split 150/150, and safe 6x50 fragments keep
`Rw 32`, `Ln,w 96`, and `CI,50-2500 5.2` with `+/-9 dB` `Rw` and
`+/-12 dB` `Ln,w` budgets; 400 mm stays `Rw 36.6` / `Ln,w 92.8`.
Exact UBIQ packages, direct-fixed, and supported-band lanes stay
separate; partial-package, deck-only, out-of-range, field/building, and
ASTM/IIC requests stay blocked. The selected next action is
`broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan` in
`packages/engine/src/broad-accuracy-post-raw-bare-open-web-coverage-revalidation-contract.test.ts`;
selected next label: post raw-bare open-web coverage revalidation.
The post raw-bare open-web coverage revalidation has now landed as
`broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan` with
selection status
`broad_accuracy_post_raw_bare_open_web_coverage_revalidation_landed_no_runtime_selected_open_web_field_building_adapter_owner`.
It is no-runtime: raw-bare 300/400 mm values, exact UBIQ precedence,
direct-fixed and supported-band separate lanes, wrong-family open-box
guards, and field/building plus ASTM/IIC boundaries remain frozen. It
ranks `broad_accuracy_floor_open_web_field_building_adapter_owner_plan`
in
`packages/engine/src/broad-accuracy-floor-open-web-field-building-adapter-owner-contract.test.ts`
as the next bounded gate because common floor field/building outputs
need an explicit basis owner; carrier-only holdout acquisition, ASTM/IIC
rating ownership, broad source crawl, and tolerance retune stay blocked.
Selected next label: floor open-web field/building adapter owner. This
is not a broad source crawl.
The floor open-web field/building adapter owner has now landed as
`broad_accuracy_floor_open_web_field_building_adapter_owner_plan` with
selection status
`broad_accuracy_floor_open_web_field_building_adapter_owner_landed_no_runtime_selected_field_building_surface_parity`.
It is no-runtime: existing exact UBIQ, direct-fixed, and supported-band
open-web `field_between_rooms` continuations remain pinned, explicit
`impactFieldContext` owns `L'n,w`, `L'nT,w`, and `L'nT,50` only for
those lab anchors, raw-bare open-web field transfer is active even
when the raw-bare lab `Ln,w 96` formula corridor is present, building
prediction remains unsupported until separate flanking/building owners
exist, and ASTM/IIC aliases remain blocked. The selected next action is
`broad_accuracy_floor_open_web_field_building_surface_parity_plan` in
`packages/engine/src/broad-accuracy-floor-open-web-field-building-surface-parity-contract.test.ts`;
selected next label: floor open-web field/building surface parity. This
is not a broad source crawl.
The floor open-web field/building surface parity has now landed as
`broad_accuracy_floor_open_web_field_building_surface_parity_plan` with
selection status
`broad_accuracy_floor_open_web_field_building_surface_parity_landed_no_runtime_selected_input_surface`.
It is no-runtime: route card, output cards, method dossier, local saved
replay, server snapshot replay, calculator API, impact-only API, and
Markdown report must expose the same exact, direct-fixed, and
supported-band field values plus
`source_absent_field_building_adapter_error_budget` terms. The visible
pins remain `Rw 51/52/61.5`, `R'w 77/75/45`, `DnT,w 80/78/48`,
`Ln,w 71/77/61.5`, `L'n,w 73/79/63.5`, `L'nT,w 70.6/76.6/61.1`, and
`L'nT,50 70/76.5/60`; raw-bare open-web field transfer is active,
building prediction remains unsupported, and ASTM/IIC aliases remain
blocked. The selected next action is
`broad_accuracy_floor_open_web_field_building_input_surface_plan` in
`apps/web/features/workbench/open-web-field-building-input-surface.test.ts`;
selected next label: floor open-web field/building input surface. This
is not a broad source crawl.
The floor open-web field/building input surface has now landed as
`broad_accuracy_floor_open_web_field_building_input_surface_plan` with
selection status
`broad_accuracy_floor_open_web_field_building_input_surface_landed_selected_post_input_surface_revalidation`.
It wires workbench controls, live evaluation, local saved replay, server
snapshot replay, calculator API payloads, impact-only API payloads, and
Markdown report payloads through a first-class floor input surface
without moving exact, direct-fixed, or supported-band values. Complete
UI-derived field contexts keep `Rw 51/52/61.5`, `R'w 77/75/45`,
`DnT,w 80/78/48`, `Ln,w 71/77/61.5`, `L'n,w 73/79/63.5`,
`L'nT,w 70.6/76.6/61.1`, and `L'nT,50 70/76.5/60`; partial field
contexts name the missing panel, room, RT60, K, or impact-volume
inputs; raw-bare open-web field transfer is active, building
prediction remains unsupported, and ASTM/IIC aliases remain blocked.
The selected next action is
`broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan`
in
`packages/engine/src/broad-accuracy-floor-open-web-field-building-post-input-surface-revalidation-contract.test.ts`;
selected next label: floor open-web field/building post-input-surface
revalidation. This is not a broad source crawl.
The floor open-web field/building post-input-surface revalidation has
now landed as
`broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan`
with selection status
`broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh`.
It is no-runtime: exact, direct-fixed, and supported-band open-web field
values remain pinned after input-surface wiring; raw-bare impact field
transfer remains blocked, building prediction remains unsupported,
ASTM/IIC aliases remain blocked, and broad source crawling remains
blocked. The selected next action is
`broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan`
in
`packages/engine/src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts`;
selected next label: post open-web field/building input-surface matrix
refresh. This is not a broad source crawl.
Validation after the post open-web field/building input-surface matrix
refresh closeout:
`pnpm calculator:gate:current` passed on 2026-05-20 with engine 487
files / 2781 tests, web 92 files / 380 passed + 18 skipped, repo build
5 / 5,
and `git diff --check` clean. The known optional `sharp/@img` warnings
from the DOCX/PDF build path remain non-fatal.

Latest end-of-day checkpoint: after commit `c248db8`, read
`docs/calculator/CHECKPOINT_2026-05-18_END_OF_DAY_BROAD_ACCURACY.md`
before continuing. It maps the landed broad-accuracy implementation back
to docs and explicitly leaves the open-box timber formula corridor,
runtime promotion, surface parity, residual movement, raw open-box
reopening, field/building aliases, and ASTM/IIC aliases as not yet
landed work.
Latest sprint-entry checkpoint: read
`docs/calculator/CHECKPOINT_2026-05-19_PRE_SPRINT_REVALIDATION_AND_OPEN_BOX_FORMULA_PLAN.md`
before implementing the next sprint. The full current gate is green; the
first implementation step is the no-runtime open-box timber formula
corridor, followed by narrow runtime, surface parity, and matrix refresh.
That checkpoint now includes the second 2026-05-19 planning pass:
open-box formula terms, package probes, initial design-budget targets,
negative boundaries, and the exact files to edit are spelled out there.
The no-runtime open-box formula corridor has now landed as
`broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`
with selection status
`broad_accuracy_floor_open_box_timber_similarity_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
It defines same-family TUAS package design payloads such as
`Ln,w 50.8` / `Rw 66` for the dry gypsum-fiber packet with `+/-7 dB`
impact and `+/-6 dB` airborne design budgets, keeps raw bare, exact-only
hybrid, field/building, and ASTM/IIC boundaries blocked, and selects
`broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`
next in
`packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts`.
The open-box timber similarity runtime corridor has now landed as
`broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`
with selection status
`broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_landed_selected_surface_parity`.
Complete source-absent dry gypsum-fiber, thin laminate/EPS, and
reinforced-ceiling open-box timber packages now promote through the
`broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor`
runtime basis. The dry gypsum-fiber runtime pin is `Ln,w 50.8`,
`CI,50-2500 3.3`, and `Rw 66`; the not-measured budgets stay visible as
`+/-7 dB` for `Ln,w`, `+/-2.5 dB` for `CI,50-2500`, and `+/-6 dB` for
`Rw`. Exact TUAS rows still win; raw bare open-box, exact-only hybrid,
mixed staged, field/building, and ASTM/IIC aliases stay blocked. The
selected next action is
`broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan` in
`packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-surface-parity-contract.test.ts`.
The open-box timber similarity surface parity gate has now landed as
`broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan`
with selection status
`broad_accuracy_floor_open_box_timber_similarity_surface_parity_landed_selected_coverage_refresh`.
Cards, route posture, impact lane labels, confidence provenance,
metric-basis copy, method dossier, local saved replay, server snapshot
replay, calculator API, impact-only API, and Markdown report now expose
the same source-absent open-box timber package-transfer lab basis without
moving runtime values. The visible dry gypsum-fiber pin remains
`Ln,w 50.8`, `CI,50-2500 3.3`, and `Rw 66` with not-measured budgets
`+/-7 dB`, `+/-2.5 dB`, and `+/-6 dB`. Exact TUAS rows still win, and
raw bare open-box, exact-only hybrid, mixed staged, field/building, and
ASTM/IIC aliases stay blocked. The selected next action is
`broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh-contract.test.ts`.
The open-box timber similarity coverage refresh has now landed as
`broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_plan`
with selection status
`broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_landed_selected_exact_only_hybrid_fragmentation_policy`.
This no-runtime coverage refresh pulls the open-box timber
package-transfer lane into the broad coverage matrix, preserves exact
source precedence, and keeps the dry gypsum-fiber source-absent pin at
`Ln,w 50.8`, `CI,50-2500 3.3`, and `Rw 66` with the same visible
not-measured budgets. Raw bare, exact-only hybrid, mixed staged,
field/building, and ASTM/IIC cases stay explicit boundaries instead of
silently reusing the package-transfer basis. The selected next action is
the exact-only hybrid fragmentation policy:
`broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts`.
The exact-only hybrid fragmentation policy has now landed as no-runtime
work with selection status
`broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_landed_no_runtime_selected_raw_bare_reopening_guard`.
It keeps R7b/R8b/R9b/R2c/R10a exact-only, budget-free runtime anchors
out of the package-transfer formula, freezes `Ln,w 50.8`,
`CI,50-2500 3.3`, and `Rw 66`, and selects the raw-bare next guard:
`packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard-contract.test.ts`.

Before implementing calculator behavior, re-read the current local engine
shape in `packages/engine/src/airborne-calculator.ts` and
`packages/engine/src/dynamic-airborne.ts`. The existing KS, mass-law,
Sharp, and Kurtovic paths are useful delegate engines and benchmark
signals, but they are not complete dynamic coverage for double/framed,
triple/multi-cavity, floor-impact, field, or building-prediction routes.
Gate V has defined the floor-impact dynamic-stiffness input and adapter
contract after Gate U selected that lane, without turning the calculator
back into a finite source catalog or aliasing `Ln,w` with `IIC`. Gate W
promoted only the complete lab `Ln,w` / `DeltaLw` lane. Gate X selected
the floor-impact field-context boundary, and Gate Y landed that
no-runtime boundary. Gate Z promoted field-only `L'n,w` and `L'nT,w`
runtime through the owned Gate W lab anchor plus explicit field context,
while keeping `L'nT,50` blocked until a low-frequency owner exists.
Gate AA recovered the construction-image shared-wall route selection:
complete grouped mineral-wool triple-leaf topology now reaches the
triple-leaf two-cavity frequency solver by physical domain instead of
the old 50/50 mm fixture gate. Gate AB has now landed the floor-side
source guard: generic lightweight-steel floors no longer borrow UBIQ
open-web or Pliteq steel-joist rows until the steel support form and
impact package inputs are explicit. Gate AC has now landed the
steel-floor physics input/formula-readiness contract: source-absent
steel floors name support form, carrier depth/spacing, upper dynamic
stiffness/load basis, and lower isolation requirements before any
formula corridor can promote. Gate AD has now landed that first runtime
steel-floor impact formula corridor: complete explicit steel predictor
input calculates lab `Ln,w` / `DeltaLw` through
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`,
while exact rows stay first and missing carrier/lower-isolation inputs
block broad fallback. Gate AE has now landed card/report parity for
that formula corridor: cards, posture, dynamic trace, support notes,
validation mode, proposal dossier, and Markdown report all show
`Lightweight-steel formula corridor` with the same source-absent lab
tolerances. Gate AF has now landed the first-class Dynamic Calculator
floor input surface for the same physical steel-floor fields. Workbench
controls, scenario analysis, local/server snapshots, and the engine
bridge now feed the Gate AD predictor input; complete UI-derived steel
returns lab `LnW 55.6` / `DeltaLw 22.4`, partial fields stay parked,
unsafe duplicate steel carriers are refused, and exact source rows still
win. Gate AG has now landed input-surface acceptance: live workbench
evaluation, local saved replay, server snapshot replay, output cards,
Markdown report payload, estimate API payload, impact-only API payload,
and hostile UI edits all preserve the steel formula basis while precise
missing-input warnings name the blocked physical fields. Gate AH has now
landed the steel-floor formula accuracy benchmark matrix:
three same-family Pliteq lab `Ln,w` holdouts run residual checks, UBIQ
open-web exact rows stay calibration anchors only when `s'`, load, or
topology inputs are missing, and the current `+/-4.5 dB Ln,w` /
`+/-2.0 dB DeltaLw` corridor is kept until a larger holdout set supports
retune. Gate AI has now landed the steel-floor residual policy:
`Ln,w` and `DeltaLw` each get executable `hold`, `tighten`, `widen`, or
`retune_candidate` decisions. Current evidence holds the corridor,
keeps runtime values unchanged, keeps UBIQ open-web rows as anchors, and
requires paired negative boundaries plus measured `DeltaLw` holdouts
before any retune/tightening. Gate AJ has now landed the paired
negative-boundary and measured `DeltaLw` intake gate: wrong support
family, exact source precedence, lab-to-field/building leakage, and
source-absent design references are protected, product/inferred/wrong
basis `DeltaLw` values cannot tighten the lab corridor. Gate AK landed
the source-owned same-stack lab `DeltaLw` holdout packet contract:
metric value, topology/support family, carrier spacing, load basis,
dynamic stiffness, lower support class, upper-resilient topology, and
paired negative boundary owner must all be source-owned before a row can
tighten the steel-floor formula residual. Gate AL has now landed the
first-holdout guard for that rule: current Pliteq/UBIQ `Ln,w`/`Rw` rows,
product-only `DeltaLw`, inferred Annex/companion values, and the checked
REGUPOL ASTM/IIC/STC steel C-joist source do not count as source-owned
ISO lab `DeltaLw` holdouts. Gate AM has now landed the narrow source
packet acquisition ledger: REGUPOL steel deck/joist and steel C-joist
leads are wrong-basis STC/IIC evidence, REGUPOL ISO `DeltaLw` leads are
solid/concrete reference-floor evidence, and SoundAdvisor is a useful
ISO `DeltaLw` scope boundary rather than a steel packet. Runtime values
remain unchanged, broad source-library crawl is still blocked. Gate AN
landed the source-absent steel-floor formula error-budget contract:
`Ln,w` keeps the existing `+/-4.5 dB` corridor and `DeltaLw` keeps the
existing `+/-2.0 dB` corridor, but each metric now has a structured
uncertainty decomposition for missing source-owned holdouts, bare steel
reference modelling, transfer efficiency, input precision, and topology
simplification. Gate AO has now landed that structured payload on the
runtime impact schema, support trace, output cards, method/corridor
dossiers, Markdown report, calculator API, and impact-only API without
moving `Ln,w 55.6` / `DeltaLw 22.4` or presenting the budget as measured
evidence. Gate AP has now landed the hostile-input guard around that
budget surface: complete, safe-reordered, and saved/API-replayed steel
formula cases keep the same structured `Ln,w` / `DeltaLw` budget, while
missing physical inputs, duplicate/ambiguous steel carriers, and exact
source precedence remain budget-free. Field requests stay explicit:
`L'n,w` and `L'nT,w` remain unsupported unless a field-context route owns
them, and the lab budget is not aliased onto field metric ids. Gate AQ has
now landed the calibration-readiness contract for that budget: every
runtime budget term is mapped to a source-owned evidence owner and
current blocker, current `Ln,w` / `DeltaLw` evidence still resolves to
`hold`, wrong evidence cannot tighten the corridor, and future `hold`,
`tighten`, `widen`, and `retune_candidate` branches are executable
without moving runtime values. Gate AR has now landed the calibration
evidence-intake ledger: current Gate AK/AM local evidence is classified
against the Gate AQ owner map, accepted source-owned calibration packet
count remains zero, wrong basis/reference/product/boundary evidence
stays rejected, and a future source-owned same-stack ISO `DeltaLw`
packet still cannot move runtime values until residual thresholds are
met. Gate AS has now landed the owner-evidence targeting decision:
same-stack ISO lab `DeltaLw` packet ownership is the selected next
narrow target, with all other Gate AQ owners ranked behind it and no
runtime movement. Gate AT has now landed the same-stack ISO lab
`DeltaLw` packet target fixture contract: the future source-owned
same-stack fixture can become calibration evidence only, product/wrong
basis/reference/missing-owner/rights-blocked packets stay rejected, and
runtime values remain frozen. Gate AU has now landed the narrow
rights-safe source-lead plan: manufacturer lab-report index, accredited
lab-report index, and internal measurement packet leads can proceed to a
later packet intake gate only as metadata-only acquisition targets,
while product/wrong-basis/reference/missing-owner/rights-blocked leads
stay rejected. Gate AV has now landed that metadata-only source-lead
intake ledger: the three Gate AU accepted lead categories become
acquisition request targets only, source text and measured metric values
are not ingested, rejected lead buckets stay blocked, and runtime values
remain frozen. Gate AW has now landed packet-acquisition readiness:
only Gate AV accepted intake rows can become metadata-only packet
request targets, rights-safe locator metadata and Gate AT/AK owner
fields are required, rejected intake rows remain blocked, source
documents and measured values are not ingested, and runtime values remain
frozen. Gate AX has now landed the rights-safe packet request ledger:
only Gate AW ready rows enter the ledger, blocked rows stay out, locator
metadata and the Gate AT/AK owner checklist are preserved, source
documents and measured values are not ingested, and request ledger
entries remain separate from packet acceptance. Gate AY has now landed
the packet acceptance boundary: current request-ledger entries remain in
request status until a source-owned packet exists, a complete future
same-stack ISO `DeltaLw` packet probe can leave request status, and
wrong-basis, wrong-reference, product/inferred, rights-blocked,
missing-owner, and blocked-ledger probes remain rejected. Accepted
boundary packets are not calibration evidence, exact rows, retune input,
or runtime movement at Gate AY. Gate AZ has now landed the calibration
candidate boundary: current request-status rows stay blocked, only the
accepted future same-stack ISO `DeltaLw` boundary probe can become a
calibration evidence candidate, rights-safe citation/locator metadata is
required, and calibration candidates still cannot enter residual
admission, tighten/widen tolerance, retune, exact-promote, alias field
or building metrics, or move runtime values. Gate BA has now landed the
residual-admission boundary: only Gate AZ
accepted calibration candidates can enter same-stack ISO lab `DeltaLw`
residual-policy evaluation, current request-status rows and rejected
candidates stay blocked, rights-safe citation/locator metadata and all
source-owned owner fields are required, and the accepted future probe
evaluates to residual-policy `hold` with threshold blockers still
present. Residual admission remains separate from exact-source
promotion, field/building aliases, tolerance movement, formula retune,
and runtime movement. Gate BB has now landed the residual-policy
decision surface: only Gate
BA residual-admitted rows can reach policy decision, current blocked
rows and rejected probes remain blocked, the admitted future row is
still `hold` with holdout-count, paired-negative, open-web-input, and
field/building owner blockers explicit, and even future
retune/tighten/widen policy labels are later-gate signals rather than
runtime or tolerance movement. Gate BC has now landed blocker-closure
ranking: only Gate BB accepted policy decisions feed closure lanes, the
source-owned same-stack ISO `DeltaLw` holdout-count lane is selected as
the narrow next lane, paired-negative/open-web/field-building owner
lanes stay ranked follow-ups, and broad source crawl/runtime/tolerance
movement remain blocked. Gate BD has now landed the holdout-count
closure boundary: only Gate BC's selected holdout-count lane can feed
closure evidence, two additional source-owned same-stack ISO lab
`DeltaLw` holdouts must own the metric value, same-stack steel
reference, ISO lab basis, all Gate AT/AK owner fields, paired
negative-boundary ownership, and rights-safe locator metadata, and
accepted rows remain residual-readiness evidence only. Gate BE has now
landed the paired-negative closure boundary: only Gate BD's selected
paired-negative lane can feed closure evidence, three additional
source-owned paired negatives must own the target metric family, ISO lab
basis, explicit wrong-support or wrong-reference boundary, boundary
identity, same-stack exclusion reason, not-holdout scope, and
rights-safe locator metadata, and accepted rows remain residual-policy
readiness evidence only. Gate BF has now landed the open-web formula
input ownership closure boundary: only Gate BE's selected open-web input
ownership lane can feed closure evidence, a source-owned open-web packet
must own support form, carrier depth/spacing, load basis, dynamic
stiffness, lower support class, upper resilient topology, and rights-safe
locator metadata, and accepted rows remain residual-policy readiness
evidence only. Gate BG has now landed the field/building basis owner
closure boundary: only Gate BF's selected field/building lane can feed
closure evidence, field apparent impact and building-prediction owners
must be separate, each must own room geometry/volume, separating element
area, junction/flanking context, reverberation/normalization basis, and
rights-safe locator or project-context metadata, and lab `Ln,w` /
`DeltaLw` still cannot alias to field or building outputs. Gate BH is
now landed as the residual-policy closed-owner revalidation boundary:
the owner map is closed by Gate BD holdout-count evidence, Gate BE
paired-negative evidence, Gate BF open-web input ownership, and Gate BG
field/building basis owners. The closed map revalidates as a
policy-only `tighten` candidate, but no closure row becomes measured
runtime evidence, no exact row is promoted, and `Ln,w 55.6` /
`DeltaLw 22.4` with `+/-4.5 dB` / `+/-2.0 dB` remains frozen. Gate BI has
now landed as the no-runtime tighten-candidate governance guard:
`gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`.
It keeps `tighten` as a proposal label only and freezes runtime,
tolerance, source, exact-row, formula, card/report/API, and
lab/field/building behavior. It selected
`personal_use_mvp_coverage_sprint_after_gate_bi`. Personal-Use MVP
Coverage Sprint Gate A has now landed the executable wall/floor scenario
matrix:
`gate_a_personal_use_mvp_coverage_matrix_plan`. It asserts route,
family, requested metrics, basis, input completeness, current and
expected posture, value or blocked reason, origin/support bucket,
tolerance/error budget, visible-surface parity target, hostile variant,
failure class, and next action for 24 common/hostile wall/floor
scenarios through current public engine entry points. Personal-Use MVP
Coverage Sprint Gate B has now landed the timber/CLT floor-impact
`DeltaLw` input and formula-readiness contract:
`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`.
It names timber joist and CLT/mass-timber physical inputs, keeps current
timber `Ln,w 51` and CLT `Ln,w 50` runtime behavior unchanged, blocks
missing dynamic stiffness/load/topping/lower-assembly inputs, refuses
ASTM and field aliases, and preserves exact `Ln,w` source precedence
without inventing `DeltaLw`. Personal-Use MVP Coverage Sprint Gate C
has now landed the timber/CLT floor-impact `DeltaLw` formula-corridor
contract:
`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan`.
It names separate timber-joist and mass-timber CLT source-absent
formula corridors, required formula terms, `+/-7.5 dB` design budgets,
and exact missing-input / basis-alias negative boundaries without moving
runtime values. Personal-Use MVP Coverage Sprint Gate D has now landed
the first runtime timber/CLT `DeltaLw` formula corridor:
`gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan`.
Explicit complete timber joist input returns exact `Ln,w 51` plus
source-absent lab `DeltaLw 25.2`; explicit complete CLT input returns
family `Ln,w 50` plus source-absent lab `DeltaLw 22.6`. Both `DeltaLw`
values carry `+/-7.5 dB` `source_absent_formula_error_budget` payloads
and metric-specific basis labels. Personal-Use MVP Coverage Sprint Gate
E has now landed visible/API/report parity for those values:
`gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan`.
Cards, posture, dynamic trace, support notes, metric-basis copy,
corridor/method dossiers, Markdown report, calculator API, and
impact-only API preserve the same `DeltaLw` basis and `+/-7.5 dB`
not-measured error budget. Personal-Use MVP Coverage Sprint Gate F has
now landed the first-class Dynamic Calculator input surface for the same
timber/CLT physical fields:
`gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan`.
Workbench controls, scenario analysis, local/server snapshots,
calculator API payload, and impact-only API payload now feed the Gate
D/E predictor input; complete UI-derived timber returns exact `Ln,w 51`
plus formula `DeltaLw 25.2`, complete UI-derived CLT returns family
`Ln,w 50` plus formula `DeltaLw 22.6`, and partial/hostile inputs stay
parked. Personal-Use MVP Coverage Sprint Gate G has now landed:
`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan`.
It generalizes grouped wall multi-cavity / triple-leaf route readiness
without retuning the current mineral-wool pins: complete grouped 50/50
keeps `Rw 50 / STC 55`, complete grouped non-50/50 keeps
`Rw 55 / STC 56`, unequal cavities and safe explicit group reorders stay
stable, flat-list and partial grouped topology ask for precise missing
physical fields, duplicate/overlapping/out-of-range layer ownership is
refused with `leafGrouping`, lined masonry/CLT negatives stay out of the
triple-leaf route, field outputs are not lab aliases, and exact source
precedence remains first. Gate G selection status:
`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_landed_selected_lined_masonry_clt_wall_gate_h`.
Personal-Use MVP Coverage Sprint Gate H has now landed:
`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan`.
It promotes complete source-absent lab lined massive/masonry wall and
CLT/mass-timber wall stacks from screening fallback to named
family-physics bases without retuning current values: lined massive
stays `Rw 60 / STC 60` through the cavity-aware dynamic delegate and
CLT stays `Rw 42 / STC 42` through the timber-panel delegate, both with
visible uncalibrated error budgets and exact-source precedence. Explicit
partial lined or mass-timber wall intent returns `needs_input`, ordinary
single leaf, double/framed, grouped triple-leaf, and field outputs stay
out of the Gate H lab corridor. Gate H selection status:
`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_landed_selected_airborne_field_context_gate_i`.
Gate I has now landed:
`gate_i_personal_use_mvp_airborne_field_context_continuation_plan`.
It promotes complete `field_between_rooms` requests for owned airborne
lab-family routes to a field/apparent family-physics basis without
numeric retune, while missing physical context, building prediction, and
exact-source precedence remain protected. Gate I selection status:
`gate_i_personal_use_mvp_airborne_field_context_continuation_landed_selected_field_surface_parity_gate_j`.
Gate J has now landed:
`gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan`.
It keeps Gate I field values unchanged while making candidate id,
method, warning, actual field error budget, and not-measured-evidence
posture visible across cards, dossiers, saved replay, report text, and
the calculator API. Gate J selection status:
`gate_j_personal_use_mvp_airborne_field_context_surface_parity_landed_selected_input_surface_gate_k`.
Gate K has now landed:
`gate_k_personal_use_mvp_airborne_field_context_input_surface_plan`.
It makes the Gate I/J airborne field-context physical inputs first-class
on the Dynamic Calculator wall input surface: `field_between_rooms`,
panel geometry, receiving-room volume, receiving-room RT60, and optional
airtightness now feed the same runtime path through workbench, scenario
analysis, saved replay, report, and API payloads. Complete UI-derived
lined massive/masonry, CLT/mass-timber, and grouped triple-leaf examples
keep Gate I values unchanged. Partial field contexts stay `needs_input`
with precise missing fields and no Gate I field budget or live field
card. Gate K selection status:
`gate_k_personal_use_mvp_airborne_field_context_input_surface_landed_selected_building_prediction_boundary_gate_l`.
Gate L has now landed:
`gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan`.
It parks airborne `building_prediction` as `needs_input` until
`flankingJunctionClass` and `conservativeFlankingAssumption` are
explicit flanking/junction owners. In plain terms, the conservative
flanking assumption must be selected before any building-prediction
runtime can promote; this is the Gate L conservative flanking assumption
boundary. Gate L blocks lab-looking outputs requested under building
context, suppresses parked building overlay warnings, and keeps workbench
building cards out of Gate I field posture. Gate L selection status:
`gate_l_personal_use_mvp_airborne_building_prediction_boundary_landed_selected_building_prediction_input_contract_gate_m`.
Gate M has now landed:
`gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan`.
It defines the first complete airborne `building_prediction` input
contract without promoting numeric building runtime. Complete building
prediction now requires separating element area, source-room volume,
receiving-room volume/RT60, flanking/junction class, conservative
flanking assumption, junction coupling length, and building output basis.
Partial owner sets stay `needs_input`; complete physical input sets
select `unsupported` with
`dynamic_calculator_building_prediction_runtime_adapter_owner_missing`
after Gate N, because the ISO 12354-1 flanking formula terms are not
owned yet. Gate M
selection status:
`gate_m_personal_use_mvp_airborne_building_prediction_input_contract_landed_no_runtime_selected_runtime_adapter_gate_n`.
Gate N has now landed:
`gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan`.
It defines the building-prediction runtime adapter owner boundary
without numeric runtime movement. Complete Gate M physical and adapter
owner sets now name the missing direct separating-element frequency
curve owner, flanking path transmission terms owner, junction vibration
reduction index owner, room absorption normalization owner, and
building-prediction uncertainty budget owner. Complete building requests
remain `unsupported`; field/apparent Gate I values and lab `Rw`/`STC`
are not reused as building metrics. Gate N selection status:
`gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_landed_no_runtime_selected_formula_corridor_gate_o`.
Gate O has now landed:
`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan`.
It defines the building-prediction formula corridor and `+/-9 dB`
source-absent design budget for `R'w` and `DnT,w`, but keeps runtime
parked because current flanking path terms are still design-owned rather
than runtime-owned. The corridor requires the direct separating-element
curve, flanking path energy sum, junction vibration reduction index,
room absorption standardization, and same-building holdout uncertainty
before promotion. Gate O selection status:
`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_p`.
Gate P has now landed:
`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan`.
The 2026-05-11 INSUL / ISO refresh tightened Gate P without changing the
selected next file: public INSUL docs state that INSUL does not directly
calculate building flanking transmission, and ISO 12354-1 frames airborne
building prediction around element performance plus direct/indirect
flanking and structural propagation terms. Gate P can promote runtime
only if direct curve, flanking-energy, junction/coupling,
room-standardization, and `+/-9 dB` budget owners are executable and
visible. Otherwise complete building requests must stay `unsupported`
and Gate P should select the next highest-ROI personal-use lane. Gate P
closed no-runtime with selection status:
`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_closed_no_runtime_selected_opening_leak_composite_gate_q`.
Gate Q has now landed:
`gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan`.
Gate Q is an opening/leak composite transmission-loss input ownership
gate, not a broad source crawl. It adds `hostWallAreaM2` and per-opening
area, count, element `Rw`, rating basis, seal/leakage class, and origin
as first-class inputs, keeps runtime no-runtime, and closes with
selection status:
`gate_q_personal_use_mvp_opening_leak_composite_input_contract_landed_no_runtime_selected_formula_corridor_gate_r`.
Gate R has now landed:
`gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan`.
Gate R defines the no-runtime opening/leak composite lab `Rw` formula
corridor with host-wall and opening area-energy terms, explicit
sealed/average/leaky/open-gap leakage penalties, a `+/-6 dB`
source-absent design budget, and negative boundaries for STC-only,
field, and building aliases. Gate R closes with selection status:
`gate_r_personal_use_mvp_opening_leak_composite_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_s`.
Gate S has now landed:
`gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan`.
Gate S promotes complete element-lab opening/leak composite `Rw`
runtime through the Gate R area-energy formula. The runtime case host
wall plus one average-seal `Rw 32` opening returns `Rw 38.2` with the
`gate_s_opening_leak_composite_area_energy_runtime_corridor` basis and
`+/-6 dB` source-absent budget. `STC`, `R'w`, `DnT,w`, field, and
building outputs stay unsupported unless a later adapter owns them;
source-absent, STC-only, missing, duplicate, and excessive opening
inputs fail closed instead of returning host-wall `Rw` as supported.
Gate S closes with selection status:
`gate_s_personal_use_mvp_opening_leak_composite_runtime_corridor_landed_selected_surface_parity_gate_t`.
Gate T has now landed:
`gate_t_personal_use_mvp_opening_leak_composite_surface_parity_plan`.
Gate T adds visible parity for that opening/leak runtime corridor across
route/card posture, output cards, scenario analysis, saved replay,
calculator API payloads, and Markdown report lines without moving
`Rw 38.2` or the `+/-6 dB` budget. `STC`, `R'w`, `DnT,w`, field, and
building outputs remain unsupported with explicit opening/leak boundary
copy, and missing/hostile/source-absent/STC-only opening inputs remain
`needs_input` or `unsupported` without a promoted budget. Gate T closes
with selection status:
`gate_t_personal_use_mvp_opening_leak_composite_surface_parity_landed_selected_input_surface_gate_u`.
Gate U has now landed:
`gate_u_personal_use_mvp_opening_leak_composite_input_surface_plan`.
Gate U makes the opening/leak physical terms first-class in the Dynamic
Calculator wall input surface: host wall area, stable opening ids,
opening area/count, element `Rw`, rating basis, seal/leakage class, and
origin now flow through live evaluation, local saved replay, server
snapshot replay, output cards, Markdown report payloads, estimate API
payloads, and hostile UI edits. Complete UI-derived input still returns
the Gate S lab `Rw 38.2` / `+/-6 dB` runtime basis; partial input stays
`needs_input`, duplicate/excessive/source-absent/STC-only openings stay
`unsupported`, and no STC/field/building adapter is added. Gate U closes
with selection status:
`gate_u_personal_use_mvp_opening_leak_composite_input_surface_landed_selected_revalidation_gate_v`.
Gate V has now landed:
`gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_plan`.
Gate V is a no-runtime post-input-surface revalidation gate. It proves
the first-class opening/leak UI surface did not move the Gate S lab
`Rw 38.2` / `+/-6 dB` corridor, did not promote STC/field/building
opening adapters, and did not disturb Gate G/H/I/J/K wall route or Gate
L/M/N/O/P building-prediction boundaries. Gate V closes with selection
status:
`gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_w`.
Gate W has now landed:
`gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_plan`.
Gate W refreshes the executable Personal-Use MVP matrix to 28 rows
after Gates B-U, keeps supported value pins separate from unsupported
outputs, preserves timber/CLT `DeltaLw`, opening/leak `Rw 38.2`, field,
building, ASTM/IIC, hostile, and exact-source boundaries, and selects
the bounded AAC / non-homogeneous masonry family solver for Gate X with
selection status:
`gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_landed_selected_aac_masonry_gate_x`.
Gate X has now landed:
`gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan`.
Gate X promotes the complete element-lab AAC / non-homogeneous masonry
route from `screening_fallback` to named `family_physics_prediction`
through
`gate_x_aac_nonhomogeneous_masonry_sharp_davy_family_physics_runtime`
without retuning `Rw 44 / STC 44 / C -0.7 / Ctr -5.2`. It owns
material class, density, thickness, surface mass, optional stiffness /
loss-factor defaults, exact-source precedence, and field/building
non-aliasing. Gate X closes with selection status:
`gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_landed_selected_clt_ctr_gate_y`.
Gate Y has now landed:
`gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan`.
The post-Gate X broad revalidation is complete: `pnpm check` passed
with lint/typecheck clean, engine 490 files / 2911 tests, web 179 files /
989 passed + 18 skipped, and repo build 5/5. The revalidation only
aligned stale lint/test expectations: unused Gate R/S imports/helpers,
JSX escaping for `R'w`, proposal copy now expecting `Airborne
field-context prediction`, and wall-selector building-prediction cards
remaining `needs_input` until building owners are explicit. Runtime
values, tolerances, source precedence, and lab/field/building basis rules
did not move.
Gate Y promotes the already finite CLT lab `Ctr -6.1` only for complete
element-lab CLT / mass-timber single-panel inputs with finite density,
thickness, surface mass, calculated dynamic frequency bands, and
ISO 717-1 spectrum-adapter basis. Complete CLT now supports
`Rw 42 / STC 42 / C -1.2 / Ctr -6.1` through
`gate_y_clt_mass_timber_ctr_spectrum_adapter_runtime` with the same
`+/-6 dB` uncalibrated budget. Exact-source precedence, missing custom
CLT density prompts, wrong-family and duplicate/ambiguous CLT
boundaries, STC-only non-promotion, and all field/building/ASTM
boundaries stay pinned. Gate Y validation completed on 2026-05-11:
focused Gate Y 1 file / 7 tests, Gate H/X/Y continuity 3 files / 21
tests, targeted Gate W/O/P expectation refresh 3 files / 15 tests,
engine typecheck, `pnpm calculator:gate:current`, `pnpm check`, and
`git diff --check` all passed. Gate Y closes with selection status:
`gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_landed_selected_post_gate_y_revalidation_gate_z`.
Gate Z has now landed:
`gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_plan`.
Gate Z is a no-runtime post-Gate-Y revalidation: the 28-row matrix is
gap-free after Gate X/Y (`coverage_gap: 0`), runtime values and basis
rules do not move, and the next selected lane is scenario matrix v2
expansion with status
`gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_landed_selected_matrix_v2_expansion_gate_aa`.
Gate Z validation passed on 2026-05-11: focused Gate Z 1 file / 6
tests, Gate X/Y/Z continuity 3 files / 20 tests, engine typecheck,
`pnpm calculator:gate:current` with engine 367 files / 2122 tests, web
73 files / 314 passed + 18 skipped, repo build 5/5, and whitespace
guard clean.
Gate AA has now landed:
`gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_plan`.
Gate AA is a no-runtime scenario matrix v2 expansion: the matrix is now
40 rows, still `coverage_gap: 0`, and broader realistic/hostile
calculator rows select the flat multicavity topology input surface with
status
`gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_landed_selected_flat_multicavity_input_surface_gate_ab`.
Gate AA validation passed on 2026-05-11: focused Gate AA 1 file / 6
tests, Gate X/Y/Z/AA continuity 4 files / 26 tests, engine typecheck,
`pnpm calculator:gate:current` with engine 368 files / 2128 tests, web
73 files / 314 passed + 18 skipped, repo build 5/5, and whitespace
guard clean.
Gate AB has now landed:
`gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan`.
Gate AB is a no-runtime engine/shared input contract: ambiguous
flat/many-layer multicavity schedules stay `needs_input`, complete
grouped topology owner sets include cavity depth/fill/absorption,
stale `flat_layer_order` groups plus duplicate/empty invalid ownership
are blocked by `leafGrouping`, and the existing grouped triple-leaf
runtime pin remains `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`.
Gate AB selection status:
`gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_landed_selected_surface_parity_gate_ac`.
Gate AB validation passed on 2026-05-11: focused Gate AB 1 file / 6
tests, Gate G/K/L/X/Y/Z/AA/AB continuity 8 files / 57 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 369 files / 2134
tests, web 73 files / 314 passed + 18 skipped, repo build 5/5, and
whitespace guard clean.
Gate AC has now landed:
`gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_plan`.
Gate AC carries the explicit grouped topology owner set through live
workbench evaluation, saved replay, calculator API payloads, output
cards, and Markdown report lines under the Gate AC topology surface
label `Wall multicavity topology owner set`. No solver retune,
source-row promotion, tolerance movement, or
lab/field/building/ASTM aliasing landed. The flat grouped stack remains
explicit source-absent screening at `Rw 38 / STC 38 / C -1 / Ctr -5.6`;
the existing grouped triple-leaf solver pin remains
`Rw 50 / STC 55 / C 0.8 / Ctr -7.3`. Gate AC selection status:
`gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_landed_selected_broad_revalidation_gate_ad`.
Gate AC validation passed on 2026-05-11: focused Gate AC engine 1 file /
4 tests, focused Gate AC web 1 file / 4 tests, Gate AB/AC engine
continuity 2 files / 10 tests, grouped-wall/AC web continuity 2 files /
8 tests, engine typecheck, web typecheck, `pnpm
calculator:gate:current` with engine 370 files / 2138 tests, web 74
files / 318 passed + 18 skipped, repo build 5/5, and whitespace guard
clean.
Gate AD has now landed:
`gate_ad_personal_use_mvp_flat_multicavity_broad_revalidation_and_internal_pilot_rehearsal_plan`.
Gate AD is no-runtime broad revalidation plus internal-pilot rehearsal:
the 40-row matrix remains gap-free, 23 rows are numeric supported, 17
rows are explicit blocked/unsupported/basis/hostile cases, and the
complete grouped flat/many-layer wall stays visible but broad
screening-only at `Rw 38 / STC 38 / C -1 / Ctr -5.6`. Gate AD selection
status:
`gate_ad_personal_use_mvp_broad_revalidation_landed_selected_flat_multicavity_solver_broadening_gate_ae`.
Gate AD validation passed on 2026-05-11: focused Gate AD 1 file / 5
tests, Gate AA/AB/AC/AD engine continuity 4 files / 21 tests, Gate AC
web continuity 2 files / 8 tests, engine typecheck, web typecheck,
`pnpm calculator:gate:current` with engine 371 files / 2143 tests, web
74 files / 318 passed + 18 skipped, repo build 5/5, whitespace guard
clean, and explicit `git diff --check`.
Gate AE has now landed:
`gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_plan`.
It is a bounded algorithmic runtime promotion, not a source crawl. The
complete explicit `element_lab` grouped flat/many-layer multicavity wall
now uses `gate_ae_flat_multicavity_two_cavity_frequency_solver` /
`family_physics_prediction`, returns `Rw 53 / STC 57 / C -0.6 / Ctr -8`,
and carries a `+/-7 dB` uncalibrated error budget. Exact/calibrated
source candidates remain rejected until source-owned same-family curve
or holdout evidence exists. Gate G full mineral-wool grouped triple-leaf
remains first and unchanged at `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`.
Stale, duplicate, missing-topology, field/building, ASTM, and IIC
routes remain behind explicit basis/input owners. Gate AE selection
status:
`gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_landed_selected_revalidation_gate_af`.
Gate AE validation passed on 2026-05-11: focused Gate AE/AC/AD engine
contracts 3 files / 14 tests, focused flat-multicavity web parity 1
file / 4 tests, engine typecheck, web typecheck, focused dynamic-airborne
split line-count contract 1 file / 5 tests, and `pnpm
calculator:gate:current` with engine 372 files / 2148 tests, web 74
files / 318 passed + 18 skipped, repo build 5/5, and whitespace guard
clean. The Next build kept the known optional `sharp/@img` warnings but
completed. The 2026-05-12 post-Gate-AE checkpoint then passed broad
`pnpm check` after one lint-only unused Gate AA type-import cleanup:
lint, typecheck, engine Vitest 497 files / 2950 tests, all web Vitest
split batches, and repo build 5/5. Runtime values and basis boundaries
remain unchanged.
Gate AF has now landed:
`gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan`.
Gate AF is no-runtime post-promotion revalidation: the 40-row matrix
remains gap-free, Gate AE flat multicavity stays `Rw 53 / STC 57 / C
-0.6 / Ctr -8` with `+/-7 dB`, Gate G grouped triple-leaf stays `Rw 50 /
STC 55 / C 0.8 / Ctr -7.3` with `+/-5 dB`, and stale topology,
duplicate groups, missing topology, field/building, ASTM, IIC, and
broad source crawl boundaries remain blocked. Gate AF selection status:
`gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_landed_selected_floor_formula_surface_polish_gate_ag`.
Gate AG has now landed:
`gate_ag_personal_use_mvp_floor_formula_surface_polish_plan`.
Gate AG is no-runtime floor formula prompt/input polish: steel floor
stays lab `LnW 55.6 / DeltaLw 22.4`, timber joist stays exact
`Ln,w 51` plus formula `DeltaLw 25.2`, CLT stays `Ln,w 50` plus
formula `DeltaLw 22.6`, and heavy concrete safe reorder stays
`Ln,w 39.2 / DeltaLw 32.6`. Workbench missing-input warnings now use
engine-owned labels like `Steel carrier spacing (mm)`,
`Upper resilient dynamic stiffness (MN/m3)`, and
`Resilient-layer load basis (kg/m2)`. Exact-source precedence and
lab/field/building boundaries remain unchanged. Gate AG selection
status:
`gate_ag_personal_use_mvp_floor_formula_surface_polish_landed_selected_opening_leak_stc_spectrum_adapter_gate_ah`.
Gate AH has now landed:
`gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_plan`.
Gate AH promotes complete element-lab opening/leak `STC` through the
ASTM E413 rating adapter
`astm_e413_stc_from_airborne_transmission_loss_curve` by applying the
Gate S area-energy `Rw` loss to the selected host-wall frequency curve
and re-rating the shifted spectrum. The pinned complete fixture now
returns lab `Rw 38.2 / STC 39` with the same `+/-6 dB` source-absent
opening/leak budget; the high-leakage two-opening matrix row returns
`Rw 33.7 / STC 34`. `STC` is not copied from `Rw`, STC-only opening
input basis remains blocked, and field/building outputs still do not
alias from lab values. Gate AH selection status:
`gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_landed_selected_surface_parity_gate_ai`.
Gate AI has now landed:
`gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_plan`.
Gate AI is no-runtime visible-surface parity for that Gate AH adapter:
cards, target-output status/corridor, route/posture copy, method and
corridor dossiers, saved replay, calculator API payloads, and Markdown
reports all preserve the same Gate S lab `Rw 38.2`, Gate AH lab
`STC 39`, Gate AH ASTM E413 adapter id, `+/-6 dB` source-absent
budget, and not-measured-evidence posture. Missing, source-absent,
STC-only opening basis, `R'w`, `DnT,w`, field, and building requests
stay blocked without a Gate AH budget or adapter. Gate AI selection status:
`gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_landed_selected_revalidation_gate_aj`.
Gate AI selected next action:
`gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_plan`.
Gate AI selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts`.
Gate AJ has now landed:
`gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_plan`.
Gate AJ is no-runtime revalidation after the Gate AI surface. It proves
Gate S lab `Rw 38.2`, Gate AH lab `STC 39`, high-leakage
`Rw 33.7 / STC 34`, the `+/-6 dB` not-measured-evidence budget, Gate U
input surface, field-context routes, building-prediction boundaries, and
Gate W/AA matrix supported/unsupported separation remain unchanged.
Gate AJ selection status:
`gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_ak`.
Selected next action:
`gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ak-coverage-matrix-refresh-after-opening-leak-stc-contract.test.ts`.
Gate AK is an STC-aware matrix refresh, not a broad source crawl.
Gate AK has now landed:
`gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_plan`.
It keeps the Gate AA 40-row matrix intact, adds no runtime movement,
preserves opening/leak `Rw 38.2 / STC 39`, high-leakage
`Rw 33.7 / STC 34`, and `STC`-only target `STC 39`, and keeps
unsupported `R'w`, `DnT,w`, field, building, source-absent, duplicate,
and wrong-basis opening routes budget-free. Gate AK selection status:
`gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_landed_selected_building_prediction_owner_gap_gate_al`.
Selected next action:
`gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al-airborne-building-prediction-owner-gap-refresh-contract.test.ts`.
Gate AL is a building prediction owner gap refresh, not a building
runtime promotion: direct curve, flanking energy, junction/coupling,
room standardization, and uncertainty owners must be executable before
building `R'w` or `DnT,w` can promote.
Gate AL has now landed:
`gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_plan`.
It maps the Gate O/P building formula terms into explicit runtime-unowned
owners: direct separating-element frequency curve, flanking path energy
sum, junction vibration reduction index, room absorption standardization,
and building prediction uncertainty budget. Complete building requests
remain `unsupported`; partial building requests remain `needs_input`;
lab `Rw`/`STC`, field `R'w`/`DnT,w`, opening/leak lab adapters, and
source single numbers without curves remain blocked as building aliases.
Gate AL selection status:
`gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_landed_no_runtime_selected_direct_curve_owner_gate_am`.
Gate AL validation passed on 2026-05-12: focused Gate AL 1 file /
6 tests, Gate AK/Gate AL continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 379 files /
2187 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 504 files /
2989 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5.
Selected next action:
`gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_contract_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-am-airborne-building-prediction-direct-curve-owner-contract.test.ts`.
Gate AM has now landed:
`gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_contract_plan`.
Gate AM is a no-runtime direct separating-element frequency curve owner
contract for airborne building prediction. It requires selected dynamic
airborne frequency-curve ownership, frequency-band resolution, ISO 717-1
rating basis, selected candidate trace ownership, and basis-compatible
metric scope before the direct-energy term can be used. Lab `Rw` /
`STC`, field `R'w` / `DnT,w`, opening/leak lab adapters, source single
numbers without curves, and legacy raw dynamic field/building
continuation snapshots stay blocked as building-output aliases. Complete
building requests remain `unsupported`; partial building requests remain
`needs_input`.
Gate AM selection status:
`gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_landed_no_runtime_selected_flanking_path_energy_gate_an`.
Gate AM validation passed on 2026-05-12: focused Gate AM 1 file /
6 tests, Gate AL/Gate AM continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 380 files /
2193 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 505 files /
2995 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5.
Selected next action:
`gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_contract_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-an-airborne-building-prediction-flanking-path-energy-owner-contract.test.ts`.
Gate AN has now landed:
`gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_contract_plan`.
Gate AN is a no-runtime flanking path energy owner contract for
airborne building prediction. It requires the Gate AM direct curve
dependency, named flanking path topology, path identity/count ownership,
basis-compatible indirect transmission terms, coupling surface area
ownership, source-absent conservative assumption ownership, and
basis-compatible metric scope before the flanking-energy term can be
used. Generic conservative flanking labels, lab `Rw` / `STC`, field
`R'w` / `DnT,w`, opening/leak lab adapters, source single numbers
without path terms, and legacy raw dynamic field/building continuation
snapshots stay blocked as building-output aliases. Complete building
requests remain `unsupported`; partial building requests remain
`needs_input`.
Gate AN selection status:
`gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_landed_no_runtime_selected_junction_vibration_gate_ao`.
Gate AN validation passed on 2026-05-12: focused Gate AN 1 file /
6 tests, Gate AM/Gate AN continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 381 files /
2199 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 506 files /
3001 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5.
Selected next action:
`gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_contract_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ao-airborne-building-prediction-junction-vibration-owner-contract.test.ts`.
Gate AO has now landed:
`gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_contract_plan`.
Gate AO is a no-runtime junction vibration reduction owner contract for
airborne building prediction. It requires the Gate AN flanking path
energy dependency, explicit junction class ownership, coupling length
ownership, basis-compatible vibration reduction index ownership,
path-specific junction coupling ownership, and basis-compatible metric
scope before the junction term can be used. Generic junction class
labels, lab `Rw` / `STC`, field `R'w` / `DnT,w`, opening/leak lab
adapters, source single numbers without junction terms, and legacy raw
dynamic field/building continuation snapshots stay blocked as
building-output aliases. Complete building requests remain
`unsupported`; partial building requests remain `needs_input`.
Gate AO selection status:
`gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_landed_no_runtime_selected_room_standardization_gate_ap`.
Gate AO validation passed on 2026-05-12: focused Gate AO 1 file /
6 tests, Gate AN/Gate AO continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 382 files /
2205 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 507 files /
3007 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5.
Selected next action:
`gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_contract_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts`.
Gate AP has now landed:
`gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_contract_plan`.
Gate AP is a no-runtime room absorption / standardization owner
contract for airborne building prediction. It requires the Gate AO
junction vibration dependency, separating element area ownership,
receiving-room volume ownership, receiving-room RT60 ownership,
building standardization basis ownership, basis-compatible room
absorption ownership, and basis-compatible metric scope before the room
term can be used. Generic room labels, apparent `R'w` relabelled as
`DnT,w`, lab `Rw` / `STC`, field `R'w` / `DnT,w`, opening/leak lab
adapters, source single numbers without room terms, and legacy raw
dynamic field/building continuation snapshots stay blocked as
building-output aliases. Complete building requests remain
`unsupported`; partial building requests remain `needs_input`.
Gate AP selection status:
`gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_landed_no_runtime_selected_uncertainty_budget_gate_aq`.
Gate AP validation passed on 2026-05-12: focused Gate AP 1 file /
6 tests, Gate AO/Gate AP continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 383 files /
2211 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 508 files /
3013 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5.
Selected next action:
`gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts`.
Post-Gate-AP checkpoint:
`docs/calculator/CHECKPOINT_2026-05-12_POST_GATE_AP_CHECKPOINT_AND_BROAD_REVALIDATION_HANDOFF.md`.
The checkpoint re-read docs and implementation, found no mismatch, and
keeps Gate AQ as the selected no-runtime uncertainty-budget owner before
any later all-owner building-prediction runtime corridor. Focused Gate
AP, `pnpm calculator:gate:current`, and broad `pnpm check` validation
passed at this checkpoint.
Company-internal daily-use final path:
`docs/calculator/CHECKPOINT_2026-05-12_INTERNAL_DAILY_USE_FINAL_PATH_AND_REVALIDATION_HANDOFF.md`.
The old internal-use operating envelope is a narrower historical
controlled-use bar. Gate AR has now promoted the all-owner building
runtime corridor, and Gate AS has made it visible across surface/API/
report paths; the current daily-use bar remains open until acceptance
matrix refresh and release handoff pass.
Gate AQ implementation-ready plan:
`docs/calculator/CHECKPOINT_2026-05-12_GATE_AQ_PLAN_REVALIDATION_AND_IMPLEMENTATION_READY_HANDOFF.md`.
Gate AQ must be a no-runtime uncertainty-budget owner contract and
select Gate AR all-owner building-prediction runtime corridor. Do not
promote building `R'w` / `DnT,w` runtime before Gate AQ is executable and
visible.
Gate AQ has now landed:
`gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan`.
Gate AQ selection status:
`gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_landed_no_runtime_selected_all_owner_runtime_corridor_gate_ar`.
It owns the metric-specific `+/-9 dB` source-absent uncertainty-budget
surface for building `R'w` and `DnT,w`, preserves not-measured posture,
keeps runtime parked, blocks lab/field/opening/source-single-number and
generic safety-factor aliases, and selects the Gate AR all-owner runtime corridor:
`gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_plan`.
Selected Gate AR file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ar-airborne-building-prediction-all-owner-runtime-corridor-contract.test.ts`.
Gate AQ handoff:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_HANDOFF.md`.
Gate AQ validation passed on 2026-05-12: focused Gate AQ 1 file /
6 tests, Gate AP/Gate AQ continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 384 files /
2217 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 509 files /
3019 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5. `git diff --check` passed after validation-note
sync.
Gate AR has now landed:
`gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_plan`.
Gate AR selection status:
`gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_landed_selected_surface_parity_gate_as`.
Gate AR promotes complete airborne `building_prediction` requests to
source-absent `R'w` / `DnT,w` runtime through
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
The first complete lined massive fixture returns `R'w 58` and
`DnT,w 59` with the Gate AQ `+/-9 dB` not-measured uncertainty budget.
Partial building context remains `needs_input`; field context remains
Gate I; lab `Rw` / `STC` remains lab; opening/leak building outputs
remain blocked. Gate AR selects:
`gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_plan`.
Selected Gate AS file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-as-airborne-building-prediction-surface-parity-contract.test.ts`.
Gate AR validation passed on 2026-05-12: focused Gate AR 1 file /
7 tests, Gate AQ/Gate AR continuity 2 files / 13 tests, airborne
building-prediction continuity 12 files / 72 tests, matrix/split
revalidation 7 files / 40 tests, `pnpm calculator:gate:current` with
engine 385 files / 2224 tests, web 74 files / 318 passed + 18 skipped,
build 5/5, and full `pnpm check` with lint/typecheck clean, engine
510 files / 3026 tests, web 180 files / 993 passed + 18 skipped, and
build 5/5. `git diff --check` passed after validation-note sync.
Gate AR handoff:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_HANDOFF.md`.
Gate AS has now landed:
`gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_plan`.
Gate AS selection status:
`gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_landed_selected_acceptance_matrix_gate_at`.
Gate AS preserves Gate AR `R'w 58` / `DnT,w 59` and the `+/-9 dB`
not-measured budget while surfacing the Gate AR candidate, method,
values, warning, and lab-alias boundaries across output cards, route
posture, scenario summary, target-output status/corridor,
method/corridor dossiers, saved replay, Markdown report, and estimate
API payloads. Gate AS selects:
`gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_plan`.
Selected Gate AT file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-at-acceptance-matrix-refresh-after-building-prediction-contract.test.ts`.
Gate AS handoff:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_HANDOFF.md`.
Gate AS validation passed on 2026-05-12: focused Gate AS engine 1 file /
4 tests, focused Gate AS web 1 file / 3 tests, Gate AR/Gate AS engine
continuity 2 files / 11 tests, related web surface regression 5 files /
22 tests, engine/web typecheck, `pnpm calculator:gate:current` with
engine 386 files / 2228 tests, web 75 files / 321 passed + 18 skipped,
build 5/5, whitespace guard clean, and full `pnpm check` with
lint/typecheck clean, engine 511 files / 3030 tests, web 181 files /
996 passed + 18 skipped, and build 5/5.
Gate AT has now landed:
`gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_plan`.
Gate AT selection status:
`gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_landed_selected_daily_use_release_handoff_gate_au`.
Gate AT is the post-building-prediction acceptance matrix refresh: it
refreshes the executable daily-use acceptance matrix to 41 rows after
Gate AS, retires the stale complete-building `unsupported` row id, pins
`R'w 58` / `DnT,w 59` building runtime with the `+/-9 dB` not-measured
budget, adds the broad-target lab-alias boundary row, and keeps partial
building, opening/leak building, ASTM/IIC, exact-source precedence,
hostile layer-edit, and high-layer-count rows explicit.
Gate AT selects the daily-use release handoff as the next slice:
`gate_au_personal_use_mvp_daily_use_release_handoff_plan`.
Selected Gate AU file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-au-daily-use-release-handoff-contract.test.ts`.
Gate AT handoff:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_HANDOFF.md`.
Gate AT validation passed on 2026-05-12: focused Gate AT engine
contract 1 file / 6 tests, Gate AS + Gate AT continuity 2 files / 10
tests, engine typecheck, `pnpm calculator:gate:current` with engine 387
files / 2234 tests, web 75 files / 321 passed + 18 skipped, build 5/5,
and `git diff --check` clean.
Gate AU has now landed:
`gate_au_personal_use_mvp_daily_use_release_handoff_plan`.
Gate AU selection status:
`gate_au_personal_use_mvp_daily_use_release_handoff_landed_selected_post_release_accuracy_roadmap_gate_av`.
Gate AU is the company-internal daily-use ready handoff: it consumes
the Gate AT 41-row matrix, preserves 26 supported value rows, accepts
16 fail-closed boundary rows, confirms zero coverage gaps and zero
daily-use release blockers, and records
`company_internal_daily_use_ready_with_visible_basis_budgets_needs_input_and_unsupported_boundaries`.
Gate AU does not move runtime values, tolerances, source precedence,
inputs, API shape, cards, or report copy. Gate AU selects the
post-release accuracy roadmap:
`gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan`.
Selected Gate AV file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-av-post-release-accuracy-and-adapter-roadmap-contract.test.ts`.
Gate AV roadmap analysis is captured in
`docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_AV_POST_RELEASE_ACCURACY_AND_ADAPTER_ROADMAP_PLAN.md`.
It keeps Gate AV no-runtime and selects source-absent solver gap
cartography as the recommended next lane. Gate AV has now landed with
selection status:
`gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw`.
Selected Gate AW action:
`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`.
Selected Gate AW file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts`.
Gate AW has now landed:
`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`.
Gate AW selection status:
`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_landed_no_runtime_selected_advanced_wall_source_absent_solver_contract_gate_ax`.
Gate AW is no-runtime source-absent solver gap cartography. It maps
20 wall/floor layer-combination surfaces across runtime-owned,
`needs_input`, unsupported, adapter-gap, and solver-gap states, then
selects the advanced wall source-absent solver contract as the next
calculator-first lane rather than broad source-row crawling.
Selected Gate AX action:
`gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`.
Selected Gate AX file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts`.
Gate AW validation passed on 2026-05-13: focused Gate AW 1 file / 6
tests, Gate AV + Gate AW continuity 2 files / 13 tests,
`pnpm calculator:gate:current` with engine 390 files / 2253 tests, web
75 files / 321 passed + 18 skipped, build 5/5, and whitespace guard
clean.
Gate AX has now landed:
`gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`.
Gate AX selection status:
`gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_landed_no_runtime_selected_runtime_corridor_gate_ay`.
Gate AX is no-runtime advanced wall source-absent solver input
contracting. It owns the physical fields for multi-panel /
multi-cavity direct-curve wall prediction and keeps complete input at
`ready_for_runtime_gate` until a later runtime corridor promotes a
number.
Selected Gate AY action:
`gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`.
Selected Gate AY file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts`.
Gate AX validation passed on 2026-05-13: focused Gate AX 1 file / 6
tests, Gate AW + Gate AX continuity 2 files / 12 tests,
`pnpm calculator:gate:current` with engine 391 files / 2259 tests, web
75 files / 321 passed + 18 skipped, build 5/5, and whitespace guard
clean.
Gate AY has now landed:
`gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`.
Gate AY selection status:
`gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_landed_selected_input_surface_gate_az`.
Gate AY is the bounded advanced wall source-absent solver runtime
corridor. Complete explicit Gate AX owner input returns lab `Rw 65` /
`STC 65` / `C -1.1` / `Ctr -6.4` through
`gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor` with
visible `+/-8 dB` `Rw` / `STC` and `+/-3 dB` `C` / `Ctr`
source-absent budgets. Weak opening/leak sub-elements are not ignored,
exact source precedence and existing grouped triple-leaf delegates remain
first, missing physical owners return `needs_input`, hostile duplicate
or split ownership fails closed, and field/building outputs stay
unsupported. Gate AZ is selected to make the same physical fields
first-class on the Dynamic Calculator wall input surface.
Gate AY short label: advanced wall source-absent solver runtime corridor.
Selected Gate AZ action:
`gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`.
Selected Gate AZ file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts`.
Gate AY validation passed on 2026-05-13: focused Gate AY 1 file / 8
tests, Gate AX + Gate AY continuity 2 files / 14 tests, Gate AW + Gate
AX + Gate AY continuity 3 files / 20 tests,
`pnpm calculator:gate:current` with engine 392 files / 2267 tests, web
75 files / 321 passed + 18 skipped, build 5/5, and whitespace guard
clean.
Gate AZ has now landed:
`gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`.
Gate AZ selection status:
`gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_landed_selected_floor_impact_source_absent_solver_gap_cartography_gate_ba`.
Gate AZ wires the Gate AY advanced wall physical owner fields into
shared `AirborneContext.advancedWall`, the dynamic-airborne adapter,
route-input assessment, workbench live/scenario/saved/server snapshot
flows, output cards, posture, corridor dossier, Markdown report, API
payloads, and the current-gate runner. Complete UI-derived advanced
wall input preserves Gate AY lab `Rw 65` / `STC 65` / `C -1.1` /
`Ctr -6.4` with visible `+/-8 dB` `Rw` / `STC` and `+/-3 dB` `C` /
`Ctr` source-absent budgets. Partial inputs stay `needs_input`,
field/building targets stay unsupported, duplicate/split ownership is
refused, and exact-source / existing delegate precedence remains first.
Gate AZ selects the bounded floor-impact source-absent solver gap
cartography lane next, not broad source crawling.
Selected Gate BA action:
`gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`.
Selected Gate BA file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts`.
Gate BA has now landed:
`gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`.
Gate BA selection status:
`gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_landed_no_runtime_selected_floor_impact_source_absent_input_contract_gate_bb`.
Gate BA is no-runtime floor-impact source-absent solver gap
cartography. It maps exact floor-system precedence, heavy concrete
bare/floating formulas, published-family concrete anchors,
steel/timber/CLT formula corridors, field-impact context, ASTM/building
unsupported boundaries, missing-owner prompts, and remaining
dynamic-stiffness/load/lower-treatment/mixed-support solver gaps. It
pins current probes including exact `Ln,w 51`, heavy concrete
`Ln,w 50.3` / `DeltaLw 24.3`, missing-load `DeltaLw` unsupported,
field `L'n,w 52.3` / `L'nT,w 50.3`, and ASTM unsupported without
moving runtime values. Gate BA selects the floor-impact source-absent
input contract as the next bounded lane rather than broad source-row
crawling.
Next plain label: floor-impact source-absent input contract.
Selected Gate BB action:
`gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`.
Selected Gate BB file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts`.
Gate BB has now landed:
`gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`.
Gate BB selection status:
`gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_landed_no_runtime_selected_formula_corridor_gate_bc`.
Gate BB is no-runtime floor-impact source-absent input ownership. It
names base/carrier family, upper topping/floating mass, resilient-layer
dynamic stiffness or source-owned product curve, load basis, lower
treatment coupling, steel carrier geometry, field/building/ASTM basis
boundaries, and duplicate/split/mixed-support topology guards before
any wider floor-impact formula corridor can promote. Runtime stays
frozen: exact `Ln,w 51`, heavy concrete `Ln,w 50.3` / `DeltaLw 24.3`,
missing-load published-family `Ln,w 47` with `DeltaLw` unsupported,
and ASTM unsupported behavior do not move. Gate BB selects the bounded
floor-impact source-absent formula corridor as Gate BC.
Next plain label: floor-impact source-absent formula corridor.
Selected Gate BC action:
`gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`.
Selected Gate BC file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts`.
Gate BC has now landed:
`gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`.
Gate BC selection status:
`gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_bd`.
Gate BC is no-runtime and defines the bounded heavy-concrete combined
upper/lower formula corridor with source-absent not-measured budgets of
`+/-6.5 dB` for `Ln,w` and `+/-5.5 dB` for `DeltaLw`. Gate BC selected
the floor-impact source-absent runtime corridor as Gate BD.
Selected Gate BD action:
`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`.
Selected Gate BD file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts`.
Gate BD has now landed:
`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`.
Gate BD selection status:
`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_landed_selected_surface_parity_gate_be`.
Gate BD promotes complete explicit heavy-concrete combined upper/lower
input to lab `Ln,w 44.4` / `DeltaLw 30.1` through
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`,
with `+/-6.5 dB` / `+/-5.5 dB` source-absent not-measured budgets.
Exact source, existing heavy floating, steel/timber/CLT, missing-input,
field/building, and ASTM/IIC boundaries remain protected. Gate BD
selects Gate BE surface parity next, not broad source-row crawling.
Next plain label: floor-impact source-absent surface parity.
Selected Gate BE action:
`gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`.
Selected Gate BE file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts`.
Gate BD validation completed on 2026-05-13: focused Gate BD 1 file / 6
tests, Gate BC + Gate BD continuity 2 files / 14 tests, Gate BA + Gate
BB + Gate BC + Gate BD continuity 4 files / 29 tests, impact regression
guard 3 files / 109 tests, Gate AZ fixture type-safety guard 1 file / 5
tests, engine typecheck, engine build, `pnpm calculator:gate:current`
with engine 397 files / 2301 tests, web 76 files / 325 passed + 18
skipped, repo build 5/5, whitespace guard clean, and `git diff --check`
clean. Known non-fatal build warnings remain the optional `sharp/@img`
resolution warnings from `@turbodocx/html-to-docx`.
Post-Gate BD full revalidation is now recorded in
`docs/calculator/CHECKPOINT_2026-05-13_POST_GATE_BD_FULL_REVALIDATION_AND_GATE_BE_PLAN_HANDOFF.md`.
The first `pnpm check` attempt caught two lint-only issues: an unused
Gate BA import and redundant `Boolean(...)` calls in the Gate AY
advanced-wall adapter. After those behavior-neutral cleanups, full
`pnpm check` passed with lint, typecheck, engine 522 files / 3103 tests,
web 182 files / 985 passed + 18 skipped, and build 5/5. Gate BE has now
landed:
`gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`.
Gate BE selection status:
`gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_landed_selected_input_surface_gate_bf`.
Gate BE keeps the Gate BD runtime frozen at lab `Ln,w 44.4` /
`DeltaLw 30.1` through the `Heavy concrete combined formula corridor`
and makes the basis plus source-absent not-measured budgets visible
across cards, posture, support trace, dossiers, scenario/saved replay,
API payloads, and Markdown report. Gate BE selects Gate BF input
surface next.
Selected Gate BF action:
`gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`.
Selected Gate BF file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts`.
Next plain label: floor-impact source-absent input surface.
Gate BE validation completed on 2026-05-13: focused Gate BE 1 file / 4
tests, Gate BD + Gate BE continuity 2 files / 10 tests, focused web
surface parity 1 file / 3 tests, engine/web typecheck, `pnpm
calculator:gate:current` with engine 398 files / 2305 tests, web 76
files / 325 passed + 18 skipped, repo build 5/5, and full `pnpm check`
with lint/typecheck clean, engine 523 files / 3107 tests, web 183 files
/ 1003 passed + 18 skipped, and build 5/5. Gate BF has now landed:
`gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`.
Gate BF selection status:
`gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_landed_selected_revalidation_gate_bg`.
Gate BF makes the `Heavy concrete combined input surface` first-class
on the Dynamic Calculator floor route. Complete UI-derived
heavy-concrete combined input still returns lab `Ln,w 44.4` /
`DeltaLw 30.1` through
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
with the same `+/-6.5 dB` / `+/-5.5 dB` source-absent not-measured
budgets. Workbench controls, scenario analysis, saved replay, server
snapshot replay, output cards, Markdown report payloads, calculator API
payloads, and impact-only API payloads now feed the same predictor
input. Partial physical fields stay `needs_input`, ambiguous concrete
base ownership is unsafe, exact source precedence remains first, and
field/building/ASTM/IIC aliases remain blocked.
Selected Gate BG action:
`gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`.
Selected Gate BG file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg-floor-impact-source-absent-post-input-surface-revalidation-contract.test.ts`.
Next plain label: floor-impact source-absent post-input-surface
revalidation.
Gate BF validation completed on 2026-05-13: focused Gate BF 1 file / 5
tests, focused web heavy-concrete combined input-surface acceptance 1
file / 3 tests, server snapshot replay 1 file / 4 tests, engine/web
typecheck, and `pnpm calculator:gate:current` with engine 399 files /
2310 tests, web 77 files / 328 passed + 18 skipped, repo build 5/5,
and whitespace guard clean. Full `pnpm check` passed with
lint/typecheck clean, engine 524 files / 3112 tests, web 184 files /
1006 passed + 18 skipped, and build 5/5 after timeout-only hardening on
three pre-existing long-running engine tests.
Gate BG has now landed:
`gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`.
Gate BG selection status:
`gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_landed_no_runtime_selected_coverage_matrix_refresh_gate_bh`.
Gate BG is a no-runtime revalidation after Gate BF's
`Heavy concrete combined input surface`: complete and safe-reordered
heavy-concrete combined input remain lab `Ln,w 44.4` / `DeltaLw 30.1`
through `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
with unchanged `+/-6.5 dB` / `+/-5.5 dB` source-absent not-measured
budgets. Missing load basis, duplicate/ambiguous concrete base
ownership, exact source precedence, and field/ASTM basis requests remain
out of promoted runtime support.
Selected Gate BH action:
`gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`.
Selected Gate BH file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts`.
Next plain label: floor-impact source-absent coverage matrix refresh.
Gate BG validation completed on 2026-05-13: focused Gate BG 1 file / 4
tests, Gate BF + Gate BG continuity 2 files / 9 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 400 files / 2314
tests, web 77 files / 328 passed + 18 skipped, repo build 5/5, full
`pnpm check` with lint/typecheck clean, engine 525 files / 3116 tests,
web 184 files / 1006 passed + 18 skipped, repo build 5/5, and
whitespace guard clean.
Gate BH has now landed:
`gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`.
Gate BH selection status:
`gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_landed_no_runtime_selected_field_building_adapter_gate_bi`.
Gate BH is a no-runtime floor-impact source-absent coverage matrix
refresh after Gates BA-BG. It keeps the `Heavy concrete combined input
surface` complete and safe-reordered rows at lab `Ln,w 44.4` /
`DeltaLw 30.1` with unchanged source-absent budgets, adds
`floor.building_impact.prediction_adapter_boundary`, and preserves
heavy floating, steel, timber/CLT, exact source, field, ASTM/IIC,
missing-input, hostile-topology, and many-layer boundaries.
Selected Gate BI action:
`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`.
Selected Gate BI file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`.
Next plain label: floor-impact field/building adapter contract.
Gate BH validation completed on 2026-05-13: focused Gate BH 1 file / 6
tests, Gate BG + Gate BH continuity 2 files / 10 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 401 files / 2320
tests, web 77 files / 328 passed + 18 skipped, repo build 5/5,
whitespace guard clean, and full `pnpm check` with lint/typecheck clean,
engine 526 files / 3122 tests, web 184 files / 1006 passed + 18
skipped, and repo build 5/5.
Known non-fatal build
warnings remain the optional `sharp/@img` warnings from
`@turbodocx/html-to-docx`.
Post-Gate-BH checkpoint review:
`CHECKPOINT_2026-05-13_POST_GATE_BH_PLAN_AND_TEST_REVIEW.md`.
That review confirms the implementation and living docs still select
Gate BI as the floor-impact field/building adapter contract. Current
field rows stay bounded to existing owned `L'n,w` / `L'nT,w` and local
`L'nT,50`; floor-impact building prediction remains unsupported until
Gate BI owns separating area, receiving-room volume, RT60 or absorption,
junction/flanking, coupling or Kij, normalization, low-frequency, and
uncertainty budget fields. Do not retune lab `Ln,w` / `DeltaLw`, add
broad source crawl, or add ASTM/IIC adapters in this checkpoint lane.
Gate BI has now landed:
`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`.
Gate BI selection status:
`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_landed_no_runtime_selected_field_building_runtime_corridor_gate_bj`.
Gate BI is a no-runtime field/building owner contract. It separates
field-apparent owners from building-prediction owners, keeps current
field `L'n,w 53` / `L'nT,w 50.6` and local `L'nT,50 49` unchanged,
keeps lab `Ln,w` / `DeltaLw` budgets out of field/building metrics,
and keeps `IIC` / `AIIC` unsupported. The current company-internal
calculation-grade bar treats live low-confidence/screening final
answers as blockers for common complete-input scenarios.
Selected Gate BJ action:
`gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`.
Selected Gate BJ file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bj-floor-impact-field-building-runtime-corridor-contract.test.ts`.
Gate BI next plain label: floor-impact field/building runtime corridor.
Gate BJ has now landed:
`gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`.
Gate BJ selection status:
`gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_landed_selected_steel_floor_low_confidence_cleanup_gate_bk`.
Gate BJ promotes owned floor-impact field/building runtime without
retuning lab floor values: source-absent field-volume returns
`L'n,w 52.3` / `L'nT,w 49.9`, building direct+flanking returns
`L'nT,w 52.4`, and direct+flanking no longer falls through to the
default low-confidence bucket. The runtime budget origin is
`source_absent_field_building_adapter_error_budget`, with source-absent
`L'nT,50` still blocked until a low-frequency owner exists; exact-band
impact-only input can support `L'nT,50` only because the band packet owns
that low-frequency evidence. `IIC` / `AIIC` remain unsupported and lab,
field, building, and ASTM bases stay separate.
Selected Gate BK action:
`gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`.
Selected Gate BK file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts`.
Next plain label: steel-floor low-confidence fallback cleanup.
Gate AU handoff:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_HANDOFF.md`.
Gate AU validation completed on 2026-05-13: focused Gate AU 1 file / 6
tests, Gate AT + Gate AU continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 388 files / 2240
tests, web 75 files / 321 passed + 18 skipped, build 5/5, full engine
suite 513 files / 3042 tests, targeted web heavy-core rerun 1 file / 3
tests, full web test rerun 181 files / 996 passed + 18 skipped, repo
build 5/5, and whitespace guard clean. The first broad `pnpm check`
attempt passed lint/typecheck and engine before a transient web
deep-hybrid heavy-core timeout; reruns proved the web invariant green
without runtime movement.
Do not keep adding narrow steel-floor source/packet gates unless the
active matrix or a later runtime proposal names a specific source-owned
unblocker.
Selected Gate Y CLT / mass-timber Ctr spectrum adapter file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts`.
Landed Gate Z post-CLT-Ctr coverage revalidation file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-z-post-clt-ctr-coverage-revalidation-contract.test.ts`.
Landed Gate AA scenario matrix v2 expansion file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa-scenario-matrix-v2-expansion-contract.test.ts`.
Landed Gate AB flat multicavity topology input-surface file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab-flat-multicavity-topology-input-surface-contract.test.ts`.
Landed Gate AC flat multicavity topology surface-parity file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ac-flat-multicavity-topology-surface-parity-contract.test.ts`.
Landed Gate AD flat multicavity broad-revalidation file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts`.
Landed Gate AE flat multicavity solver-broadening file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts`.
Landed Gate AF post-flat-multicavity solver-broadening revalidation file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts`.
Landed Gate AG floor formula surface polish file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ag-floor-formula-surface-polish-contract.test.ts`.
Landed Gate AH opening/leak STC spectrum adapter file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts`.
Landed Gate AI opening/leak STC surface parity file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts`.
Selected Gate X AAC/non-homogeneous masonry solver file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts`.
Landed Gate W coverage matrix refresh file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts`.
Landed Gate V opening/leak revalidation file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts`.
Selected Gate BI file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`.
Selected Gate A coverage matrix file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`.
Selected Gate B timber/CLT DeltaLw file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`.
Selected Gate C timber/CLT DeltaLw formula corridor file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`.
Selected Gate D timber/CLT DeltaLw runtime corridor file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts`.
Selected Gate E timber/CLT DeltaLw surface parity file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts`.
Selected Gate F timber/CLT DeltaLw input surface file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-f-timber-clt-floor-impact-delta-lw-input-surface-contract.test.ts`.
Selected Gate G generalized wall multicavity route-readiness file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts`.
Selected Gate H lined masonry / CLT wall upgrade file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`.
Selected Gate I airborne field-context continuation file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts`.
Selected Gate J airborne field-context surface parity file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts`.
Selected Gate K airborne field-context input surface file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts`.
Selected Gate L airborne building-prediction boundary file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts`.
Selected Gate M airborne building-prediction input contract file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts`.
Selected Gate N airborne building-prediction runtime adapter file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts`.
Latest landed calculator gate checkpoint:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AI_HANDOFF.md`.
Latest strategic ROI revalidation:
`docs/calculator/CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md`.
It selected Gate G after Gate F; Gate G has now landed and selected
Gate H, Gate H selected Gate I, Gate I selected Gate J, Gate J selected
Gate K, Gate K selected the building-prediction boundary, Gate L
selected the building-prediction input contract, and Gate M has now
selected the building-prediction runtime adapter before any return to
steel-floor tolerance tightening.
Gate BH landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`.
Gate BH landed action:
`gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan`.
Gate BG landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts`.
Gate BG landed action:
`gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan`.
Gate BF landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts`.
Gate BF landed action:
`gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan`.
The 2026-05-07 broad revalidation after Gate AK is complete: `pnpm
check` passed after aligning steel-floor validation corpora and
ambiguous duplicate/disjoint lightweight-steel floor schedule
expectations. Runtime values remain unchanged.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AI_HANDOFF.md`
3. `docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AH_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-12_POST_GATE_AE_CHECKPOINT_AND_BROAD_REVALIDATION_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_RESEARCH_PLAN_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_BROAD_REVALIDATION_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_V_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_U_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_T_HANDOFF.md`
20. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_S_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-11_INSUL_ISO_RESEARCH_AND_GATE_P_REPLAN_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_M_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_L_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_K_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_J_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_I_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_H_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_G_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_F_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_E_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_D_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BI_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BH_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BG_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BF_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BE_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BD_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BC_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BB_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BA_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AZ_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AY_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AX_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AW_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AV_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AU_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AT_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AS_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AR_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AQ_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-07_GATE_AP_REPORT_EXPORT_REVALIDATION_AND_PUSH_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AP_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AO_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AN_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AM_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AL_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-07_BROAD_REVALIDATION_GATE_AK_TO_GATE_AL_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-07_GATE_AK_REPORT_EXPORT_REVALIDATION_AND_PUSH_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AK_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AJ_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AI_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AH_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AG_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AF_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-07_GATE_AE_REVALIDATION_GATE_AF_PLAN_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AE_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AD_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AC_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AB_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AA_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Z_HANDOFF.md`
4. `docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md`
5. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Y_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_X_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_W_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_V_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_REVALIDATION_AND_COMMIT_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_T_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_S_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_R_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Q_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_P_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_O_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_N_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_M_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_L_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_K_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_J_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-05-06_GATE_I_REPORT_EXPORT_MANUAL_EDIT_VALIDATION_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_I_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md`
20. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md`
21. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md`
22. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md`
23. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md`
24. `docs/calculator/CHECKPOINT_2026-05-06_ACOUSTIC_CALCULATOR_PLAN_REVALIDATION_HANDOFF.md`
25. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_GATE_A_REVALIDATION_COMMIT_HANDOFF.md`
26. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md`
27. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_BENCHMARK_ACCEPTANCE_HANDOFF.md`
28. `docs/calculator/CHECKPOINT_2026-05-05_MODEL_FIRST_MILESTONE_RESEARCH_HANDOFF.md`
29. `docs/calculator/CHECKPOINT_2026-05-05_STANDARDS_RESEARCH_PLAN_DETAIL_HANDOFF.md`
30. `docs/calculator/CHECKPOINT_2026-05-05_DOC_IMPLEMENTATION_RECONCILIATION_HANDOFF.md`
31. `docs/calculator/CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md`
32. `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`

Entries below are historical/backlog authority context unless the
current workflow above promotes them again.

4. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
7. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md`
8. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-05_PRE_UBIQ_PACKAGED_FINISH_GATE_A_ANALYSIS_REPLAN_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-05_BROAD_REVALIDATION_AND_NEXT_STEP_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A_HANDOFF.md`
10. `docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md`
11. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md`
12. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
15. `docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`
16. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md`
17. `docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`
18. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A_HANDOFF.md`
6. `docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_V1_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A_HANDOFF.md`
6. `docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A_HANDOFF.md`
6. `docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_GATE_A_HANDOFF.md`
8. `docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md`
9. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A_HANDOFF.md`
10. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md`
11. `docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A_HANDOFF.md`
13. `docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md`
14. `docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A_HANDOFF.md`
7. `docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_B_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_A_HANDOFF.md`
7. `docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md`
8. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_C_CLOSEOUT_HANDOFF.md`
10. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md`
10. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md`
10. `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-04_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_GATE_B_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-04_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_GATE_A_HANDOFF.md`
7. `docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md`
8. `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-04_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_GATE_U_HANDOFF.md`
10. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md`
6. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT_HANDOFF.md`
2. `docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A_HANDOFF.md`
3. `docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md`
4. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B_HANDOFF.md`
7. `docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md`
8. `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A_HANDOFF.md`
8. `docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md`
9. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
8. `docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
6. `docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
7. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
8. `docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md`
9. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
6. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
6. `docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A_HANDOFF.md`
7. `docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
7. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md`
8. `docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md`
10. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_T_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_S_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_R_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_Q_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_P_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_O_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_N_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_M_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_L_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_K_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_J_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_I_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_H_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G9_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G8_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G7_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G6_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G5_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G4_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G3_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2B_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_F_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_E_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_D_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_B_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A_HANDOFF.md`
19. `docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
8. `docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md`
10. `docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_A_HANDOFF.md`
12. `docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md`
13. `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
15. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md`
16. `docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md`
17. `docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md`
18. `docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md`
20. `docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md`
21. `docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
22. `docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md`
23. `docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md`
24. `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md`
25. `docs/calculator/CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md`
26. `docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
27. `docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
28. `docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md`
29. `docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A_HANDOFF.md`
30. `docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md`
31. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md`
32. `docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A_HANDOFF.md`
33. `docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md`
34. `docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_C_CLOSEOUT_HANDOFF.md`
35. `docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_A_HANDOFF.md`
36. `docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md`
37. `docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md`
38. `docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_PILOT_HANDOFF_GATE_C_CLOSEOUT_HANDOFF.md`
39. `docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_PILOT_HANDOFF_GATE_A_HANDOFF.md`
40. `docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md`
41. `docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md`
42. `docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md`
43. `docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_A_HANDOFF.md`
44. `docs/calculator/SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md`
45. `docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
46. `docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
47. `docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
48. `docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md`
49. `docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_GATE_A_HANDOFF.md`
50. `docs/calculator/SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md`
51. `docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT_HANDOFF.md`
52. `docs/calculator/CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_CLEAN_STOP_GATE_C_READY_HANDOFF.md`
53. `docs/calculator/CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md`
54. `docs/calculator/CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_B_HANDOFF.md`
55. `docs/calculator/CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_A_HANDOFF.md`
56. `docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md`
57. `docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md`
58. `docs/calculator/CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_HANDOFF.md`
59. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md`
60. `docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md`
61. `docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_C_CLOSEOUT_HANDOFF.md`
62. `docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_B_HANDOFF.md`
63. `docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_A_HANDOFF.md`
64. `docs/calculator/SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md`
65. `docs/calculator/CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_C_CLOSEOUT_HANDOFF.md`
66. `docs/calculator/CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_A_HANDOFF.md`
67. `docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md`
68. `docs/calculator/CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A_HANDOFF.md`
69. `docs/calculator/CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md`
70. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md`
71. `docs/calculator/CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_A_HANDOFF.md`
72. `docs/calculator/SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md`
73. `docs/calculator/CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md`
74. `docs/calculator/CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A_HANDOFF.md`
75. `docs/calculator/SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md`
76. `docs/calculator/CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md`
77. `docs/calculator/CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A_HANDOFF.md`
78. `docs/calculator/SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md`
79. `docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md`
80. `docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_B_HANDOFF.md`
81. `docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A_HANDOFF.md`
82. `docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md`
83. `docs/calculator/CURRENT_STATE.md`
84. `docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md`
85. `docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md`
86. `docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md`
87. `docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md`
88. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_CLOSEOUT_HANDOFF.md`
89. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B_HANDOFF.md`
90. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A_HANDOFF.md`
91. `docs/calculator/SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md`
92. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_CLOSEOUT_HANDOFF.md`
93. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_HANDOFF.md`
94. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_REVALIDATION.md`
95. `docs/calculator/CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md`
96. `docs/calculator/CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A_HANDOFF.md`
97. `docs/calculator/SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md`
98. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_C_CLOSEOUT_HANDOFF.md`
99. `docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md`
100. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_B_HANDOFF.md`
101. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_A_HANDOFF.md`
102. `docs/calculator/CHECKPOINT_2026-04-27_WALL_COVERAGE_EXPANSION_PLANNING_V2_GATE_A_HANDOFF.md`
103. `docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md`
104. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md`
105. `docs/calculator/SOURCE_GAP_LEDGER.md`
106. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
107. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
108. `docs/calculator/SLICE_PROPOSAL_REPORT_POLISH_PLAN.md`
109. `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
110. `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`
Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `company_internal_calculation_grade_mainline`
- current next decision:
  continue ISO floor-impact and wall-airborne calculation-grade coverage
  from
  `docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md`.
- current selected status:
  `company_internal_mainline_realigned_after_astm_boundary_scaffold`.
- current strategic replan:
  `docs/calculator/CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md`.
  Gate BI and Personal-Use MVP Coverage Sprint Gates A through BJ have
  landed. Gate AU is the company-internal daily-use ready handoff:
  the Gate AT matrix has zero coverage gaps and zero daily-use release
  blockers, with unsupported and missing-input boundaries kept explicit.
  Gate AV is landed no-runtime post-release accuracy/adapters planning.
  Gate AW is landed no-runtime source-absent solver gap cartography.
  Gate AX is landed no-runtime advanced wall source-absent solver
  contract. Gate AY is landed advanced wall source-absent solver runtime
  corridor. Gate AZ is landed advanced wall source-absent solver input
  surface. Gate BA is landed floor-impact source-absent solver gap
  cartography. Gate BB is landed floor-impact source-absent input
  contract. Gate BC through BH closed the floor-impact source-absent
  lab corridor and matrix refresh. Gate BI landed floor-impact
  field/building owner boundaries. Gate BJ is landed runtime corridor:
  field-volume `L'n,w 52.3` / `L'nT,w 49.9`, building direct+flanking
  `L'nT,w 52.4`, medium direct+flanking confidence, and
  `source_absent_field_building_adapter_error_budget`, with source-absent
  `L'nT,50` still blocked until a low-frequency owner exists. Gates BK
  through BV have since landed; Gate BV is preserved as the latest
  no-runtime ASTM `IIC` / `AIIC` rating curve owner scaffold, but ASTM
  work is now parked. The active mainline is ISO floor-impact, wall
  solver coverage, field/building missing-input safety, and cleanup of
  common screening/low-confidence answers.
  Next plain label: company-internal ISO floor / wall calculation-grade
  coverage and missing-input safety.
  The mainline realignment is recorded in
  `docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MAINLINE_REALIGNMENT_HANDOFF.md`.
  The latest mainline runtime movement is the heavy-composite wall solver
  cleanup: complete heavy-composite double-leaf wall stacks now use
  `company_internal_heavy_composite_wall_mass_air_mass_capped_family_physics_runtime`
  instead of `screening_fallback` / low confidence, while keeping lab
  `Rw 63 / STC 63 / C -1.4 / Ctr -6.3`, field `R'w 60 / Dn,w 60 /
  DnT,w 61 / DnT,A 60.1`, exact-source precedence, lab
  `errorBudgetDb: 8`, and Gate I field adapter `errorBudgetDb: 10`.
  The latest mainline checkpoint is recorded in
  `docs/calculator/CHECKPOINT_2026-05-14_HEAVY_COMPOSITE_WALL_SOLVER_CLEANUP_HANDOFF.md`.
  The latest company-internal matrix refresh is recorded in
  `docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_REFRESH_AFTER_HEAVY_COMPOSITE_HANDOFF.md`.
  It landed
  `company_internal_calculation_grade_matrix_refresh_after_heavy_composite_plan`
  as a no-runtime 61-row executable matrix refresh, kept ASTM `IIC` /
  `AIIC` parked, and selected
  `company_internal_steel_suspended_ceiling_delta_lw_owner_contract_plan`
  next. Selected next file:
  `packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-owner-contract.test.ts`.
  That selected DeltaLw owner contract has now landed and is recorded in
  `docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_HANDOFF.md`.
  Steel suspended-ceiling-only input still returns lab `Ln,w 62.2`, but
  `DeltaLw` now prompts for `toppingOrFloatingLayer`,
  `resilientLayerDynamicStiffnessMNm3`, and `loadBasisKgM2` instead of
  remaining a silent unsupported gap. No numeric `DeltaLw`, ASTM alias,
  field alias, or building alias was added.
  The selected airborne building-prediction reconciliation contract has
  now landed as
  `company_internal_airborne_building_prediction_runtime_terms_owner_contract_plan`.
  Selection status:
  `company_internal_airborne_building_prediction_runtime_terms_owner_contract_landed_selected_matrix_v2_refresh`.
  It accepts the existing Gate AR/AS/AT complete building runtime
  (`R'w 58` / `DnT,w 59`, `+/-9 dB`) inside the company-internal
  envelope and keeps partial context, lab alias, and opening/leak
  building boundaries fail-closed. Landed file:
  `packages/engine/src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts`.
  Reconciliation selected next file, now landed by Matrix V2:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts`.
  The selected matrix v2 refresh has now landed as
  `company_internal_calculation_grade_mainline_matrix_v2_refresh_plan`.
  Selection status:
  `company_internal_calculation_grade_mainline_matrix_v2_refresh_landed_selected_steel_suspended_ceiling_delta_lw_runtime_corridor`.
  It preserves the accepted Gate AR/AS/AT building runtime rows inside
  the company-internal matrix, retires the stale
  `wall.building_prediction_missing_context.needs_input` row, changes
  steel suspended-ceiling `DeltaLw` from silent unsupported to precise
  `needs_input`, and normalizes the heavy-floating floor matrix origin
  away from hidden `screening_fallback`.
  Historical selected next action:
  `company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan`.
  Current selected next file:
  `packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts`.
  That steel suspended-ceiling `DeltaLw` runtime corridor has now landed
  as
  `company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan`.
  Complete lower suspended-ceiling plus upper/reference package input now
  returns lab `Ln,w 51.6` / `DeltaLw 22.4` through
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`,
  while missing `toppingOrFloatingLayer` blocks the formula instead of
  fabricating a broad fallback. Selection status:
  `company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_landed_selected_surface_parity`.
  Historical selected next action:
  `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan`.
  Current selected next file:
  `packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts`.
  That steel suspended-ceiling `DeltaLw` surface parity gate has now
  landed as
  `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan`.
  Cards, corridor dossier, local saved replay, server snapshot replay,
  calculator API payload, impact-only API payload, and Markdown report
  now show the same lab `Ln,w 51.6` / `DeltaLw 22.4`,
  `steel_suspended_ceiling_lower_reference`, and source-absent
  `+/-4.5 dB` / `+/-2.0 dB` budget posture. Selection status:
  `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_landed_selected_matrix_v3_refresh`.
  Historical selected next action:
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`.
  Current selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts`.
  That Matrix V3 refresh has now landed as
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`.
  It retires
  `floor.lightweight_steel_suspended_ceiling_delta_lw.needs_input` and
  records
  `floor.lightweight_steel_suspended_ceiling_delta_lw.runtime` as lab
  `Ln,w 51.6` / `DeltaLw 22.4` through the steel suspended-ceiling
  lower-reference formula corridor, while `L'nT,50`, ASTM `IIC` /
  `AIIC`, and field/building aliases remain blocked. Selection status:
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_landed_selected_steel_suspended_ceiling_low_frequency_lnt50_owner`.
  The preceding low-frequency `L'nT,50` owner contract landed as
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan`
  with selection status
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_landed_no_runtime_selected_runtime_corridor`,
  owner contract file
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`,
  selected next action
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`,
  and selected next file
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts`.
  The low-frequency `L'nT,50` runtime corridor has now landed as
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`.
  Lab `Ln,w 51.6` / `DeltaLw 22.4` stays frozen. Complete field context
  with `fieldKDb = 3`, receiving-room volume `60 m3`, and
  `CI,50-2500 = -1 dB` now returns `L'n,w 54.6`, `L'nT,w 51.8`, and
  `L'nT,50 50.8` through
  `estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`
  with a `+/-7 dB` source-absent field adapter budget. Missing
  low-frequency ownership still blocks `L'nT,50`, exact field bands stay
  exact precedence, and ASTM `IIC` / `AIIC` remain unsupported. Selection
  status:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_landed_selected_surface_parity`.
  Runtime corridor selected next action, now landed by surface parity:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`.
  Runtime corridor selected next file, now landed by surface parity:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts`.
  Runtime corridor selected next label, now landed by surface parity:
  steel suspended-ceiling L'nT,50 card/report/API parity.
  The low-frequency `L'nT,50` surface parity gate has now landed as
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`.
  Cards, corridor dossier, local saved replay, server snapshot replay,
  calculator API payload, impact-only API payload, and Markdown report
  now preserve `L'nT,50 50.8`, `CI,50-2500`,
  `estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`,
  and the `+/-7 dB` source-absent budget without moving runtime values.
  Selection status:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_landed_selected_matrix_v4_refresh`.
  Surface parity selected next action:
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`.
  Surface parity selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts`.
  Surface parity selected next label:
  company-internal matrix v4 refresh after steel L'nT,50 surface parity.
  Matrix V4 has now landed as
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`.
  It retires the stale
  `floor.lightweight_steel_suspended_ceiling_lnt50.unsupported` row,
  records complete steel field context as supported `Ln,w 51.6` /
  `DeltaLw 22.4` / `L'n,w 54.6` / `L'nT,w 51.8` / `L'nT,50 50.8`,
  keeps missing `CI,50-2500` blocked without an `L'nT,50` budget, and
  keeps exact field-band precedence separate from the source-absent
  steel adapter. Selection status:
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_landed_selected_opening_leak_building_adapter_owner`.
  Matrix V4 selected next action, now landed:
  `company_internal_opening_leak_building_adapter_owner_contract_plan`.
  Matrix V4 selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-building-adapter-owner-contract.test.ts`.
  Matrix V4 selected next label, now landed:
  opening/leak building-context adapter owner contract.
  The opening/leak field/building adapter owner contract has now landed
  as
  `company_internal_opening_leak_building_adapter_owner_contract_plan`.
  It keeps Gate S lab opening/leak `Rw 38.2` / `STC 39` intact, but
  does not alias that lab result to `R'w` or `DnT,w`. Field/apparent
  opening/leak outputs now have explicit owner inputs for the lab
  composite curve, field opening/leak curve, flanking penalty, room
  normalization, uncertainty budget, and exact packet precedence.
  Building-prediction opening/leak outputs now have separate owners for
  direct curve, flanking path energy, junction vibration, room
  absorption standardization, uncertainty budget, and exact packet
  precedence. Complete owner sets are ready for a later runtime
  corridor; missing physical fields return `needs_input`, missing
  owners return `runtime_owner_missing`, and ASTM/element-lab requests
  stay outside this adapter. Selection status:
  `company_internal_opening_leak_building_adapter_owner_contract_landed_no_runtime_selected_runtime_corridor`.
  Historical selected next action:
  `company_internal_opening_leak_building_runtime_corridor_plan`.
  Current selected next file:
  `packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts`.
  Current selected next label:
  opening/leak field/building runtime corridor.
  The opening/leak field/building runtime corridor has now landed as
  `company_internal_opening_leak_building_runtime_corridor_plan`.
  Complete explicit field opening/leak context with
  `openingLeakFieldBuildingAdapterBoundary` now returns `R'w 36.4` /
  `Dn,w 36.7` / `DnT,w 36.9` through
  `company_internal_opening_leak_field_area_energy_runtime_corridor`
  with a `+/-8 dB` source-absent field budget. Complete explicit
  building opening/leak context now returns `R'w 31.6` / `DnT,w 32.1`
  through
  `company_internal_opening_leak_building_area_energy_runtime_corridor`
  with a `+/-10 dB` source-absent building budget. Gate S lab `Rw 38.2`
  / `STC 39` remains unchanged; `Dn,A` / `DnT,A` remain unsupported
  until a spectrum adapter owns them; legacy top-level opening contexts
  without the explicit boundary keep the old no-runtime posture.
  Selection status:
  `company_internal_opening_leak_building_runtime_corridor_landed_selected_surface_parity`.
  Runtime selected next action, now landed by surface parity:
  `company_internal_opening_leak_building_surface_parity_plan`.
  Runtime selected next file, now landed by surface parity:
  `packages/engine/src/company-internal-opening-leak-building-surface-parity-contract.test.ts`.
  Runtime selected next label, now landed by surface parity:
  opening/leak field/building card/report/API parity. The opening/leak
  field/building surface parity step has now landed as
  `company_internal_opening_leak_building_surface_parity_plan`. Cards,
  route posture, scenario summary, method/corridor dossiers, saved
  replay, calculator API payload, and Markdown report preserve field
  `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9` with `+/-8 dB` and building
  `R'w 31.6` / `DnT,w 32.1` with `+/-10 dB`. These are source-absent
  field/building predictions, not measured evidence and not lab `Rw` /
  `STC` aliases. Selection status:
  `company_internal_opening_leak_building_surface_parity_landed_selected_input_surface`.
  Surface parity selected next action, now landed by input surface:
  `company_internal_opening_leak_building_input_surface_plan`.
  Surface parity selected next file, now landed by input surface:
  `apps/web/features/workbench/company-internal-opening-leak-building-input-surface.test.ts`.
  Surface parity selected next label, now landed by input surface:
  opening/leak field/building input surface.
  The opening/leak field/building input surface has now landed as
  `company_internal_opening_leak_building_input_surface_plan`. The
  Dynamic Calculator wall input surface now feeds the opening/leak
  field/building adapter from first-class physical fields: host wall
  area, stable opening ids, per-opening area/count/element `Rw`/basis/
  seal/origin, partition width/height, receiving-room volume/RT60,
  source-room volume, flanking/junction class, conservative flanking
  assumption, junction coupling length, and building output basis.
  UI-derived field input preserves `R'w 36.4` / `Dn,w 36.7` /
  `DnT,w 36.9` with `+/-8 dB`; UI-derived building input preserves
  `R'w 31.6` / `DnT,w 32.1` with `+/-10 dB`. Local saved replay, server
  snapshot replay, report payload, and calculator API payload preserve
  the same basis. Missing building owner fields return `needs_input`,
  duplicate openings fail closed, and lab context does not set the
  field/building adapter boundary. Selection status:
  `company_internal_opening_leak_building_input_surface_landed_selected_matrix_v5_refresh`.
  Historical selected next action:
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`.
  Current selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts`.
  Current selected next label:
  company-internal matrix v5 refresh after opening/leak field/building
  input surface.
  Matrix V5 has now landed:
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`.
  It records opening/leak field `R'w 36.4` / `Dn,w 36.7` /
  `DnT,w 36.9` and building `R'w 31.6` / `DnT,w 32.1` as supported
  calculation-grade rows, retires
  `wall.opening_leak_composite_building_boundary.unsupported`, keeps
  `Dn,A` / `DnT,A` unsupported, and selects:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`.
  Matrix V5 selection status:
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_landed_selected_opening_leak_a_weighted_adapter_owner`.
  Selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts`.
  The A-weighted owner contract has now landed:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`.
  It is a no-runtime owner gate. Field opening/leak remains
  `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9`, building opening/leak
  remains `R'w 31.6` / `DnT,w 32.1`, and `Dn,A` / `DnT,A` remain
  unsupported until the next formula corridor owns `frequencyBandSet`,
  same-route spectrum curves, ISO 717 C or A-weighted adapter policy,
  uncertainty budget, exact A-weighted packet precedence, and lab
  `Rw` / `STC` alias guards. A-weighted owner selection status:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_landed_no_runtime_selected_formula_corridor`.
  Owner selected next action, now landed:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`.
  Owner selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts`.
  Owner selected next label, now landed:
  opening/leak Dn,A / DnT,A spectrum-adapter formula corridor.
  Current remaining-gap analysis:
  `docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md`.
  It confirms the next concrete sequence as A-weighted formula corridor,
  runtime corridor, card/API/report parity, Matrix V6 refresh,
  building/ASTM boundary revalidation, and final internal-use rehearsal.
  Implementation caveat: `frequencyBandSet` is shared-schema and
  owner-contract owned, but the opening/leak field/building workbench
  surface still needs to carry or explicitly block that input before
  A-weighted runtime/surface readiness can be called UI-ready.
  The A-weighted formula corridor has now landed:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`.
  It is a no-runtime formula corridor. Formula pins: field `Dn,A 35.9`;
  field `DnT,A 36.1`; building `DnT,A 31.3`. They are design estimates
  from the owned same-route base values plus the `-0.8 dB` A-weighted
  adapter. Field budget is `+/-9 dB`; building budget is
  `+/-11 dB`. Runtime values do not move and A-weighted outputs remain
  unsupported until the runtime corridor lands. Formula corridor
  selection status:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  Historical selected next action:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`.
  Current selected next file:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts`.
  Current selected next label:
  opening/leak Dn,A / DnT,A spectrum-adapter runtime corridor.
  The A-weighted runtime corridor has now landed:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`.
  It promotes complete opening/leak A-weighted requests only when
  `frequencyBandSet` is present: field `Dn,A 35.9`, field
  `DnT,A 36.1`, and building `DnT,A 31.3`. Field budget is `+/-9 dB`;
  building budget is `+/-11 dB`. Missing `frequencyBandSet` keeps
  A-weighted outputs unsupported with a precise warning, building
  `Dn,A` remains unsupported, and lab `Rw` / `STC` plus ASTM `IIC` /
  `AIIC` stay non-alias boundaries. Runtime corridor selection status:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_landed_selected_surface_parity`.
  Runtime corridor selected next action, now landed:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`.
  Runtime corridor selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts`.
  Runtime corridor selected next label, now landed:
  opening/leak Dn,A / DnT,A card/report/API parity.
  A-weighted surface parity has now landed:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`.
  It keeps field `Dn,A 35.9`, field `DnT,A 36.1`, and building
  `DnT,A 31.3` frozen while making the method, candidate, budgets,
  warning, and frequency band set visible across cards, route posture,
  scenario summary, dossiers, saved/server replay, API payloads,
  Markdown report, and the workbench input surface. Surface parity
  selection status:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_landed_selected_matrix_v6_refresh`.
  Surface parity selected next action:
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`.
  Surface parity selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts`.
  Surface parity selected next label:
  company-internal matrix v6 refresh after opening/leak Dn,A / DnT,A surface parity.
  Matrix V6 has now landed:
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`.
  It refreshes the executable company-internal matrix to 71 rows,
  retires the stale
  `wall.opening_leak_a_weighted_boundary.unsupported` row, and records
  opening/leak A-weighted field `Dn,A 35.9` / `DnT,A 36.1` plus
  building `DnT,A 31.3` as supported source-absent family-physics rows.
  Building `Dn,A`, missing `frequencyBandSet`, lab `Rw` / `STC` aliases,
  ASTM `IIC` / `AIIC` aliases, and exact-source precedence remain
  explicit boundary rows. Matrix V6 selection status:
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_landed_selected_boundary_revalidation`.
  Matrix V6 selected next action:
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`.
  Matrix V6 selected next file:
  `packages/engine/src/company-internal-building-astm-boundary-revalidation-contract.test.ts`.
  Matrix V6 selected next label:
  building partial-context and ASTM parked-boundary revalidation.
  Boundary revalidation has now landed:
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`.
  It proves `wall.opening_leak_building_missing_owner.needs_input` and
  `wall.building_prediction_partial_context.needs_input` still remain
  precise building `needs_input` rows with named missing physical owners
  such as `sourceRoomVolumeM3`, no value pins, and no building budget.
  It also proves floor ASTM `IIC` / `AIIC` rows and the airborne
  A-weighted-to-ASTM alias row stay unsupported with no ISO alias values
  or budgets. Boundary revalidation selection status:
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_landed_selected_final_internal_use_rehearsal`.
  Boundary revalidation selected next action:
  `company_internal_final_internal_use_rehearsal_after_boundary_revalidation_plan`.
  Boundary revalidation selected next file:
  `packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`.
  Boundary revalidation selected next label:
  final internal-use rehearsal and operating envelope.
  Gate BV validation remains recorded in
  `docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_HANDOFF.md`.
- latest strategic ROI revalidation:
  `docs/calculator/CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md`.
- latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_CHECKPOINT_REVIEW_AND_VALIDATION.md`.
- current remaining-gap plan:
  `docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md`.
- previous matrix-refresh checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_REFRESH_AFTER_HEAVY_COMPOSITE_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate BH:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`
  landed
  `gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan`.
  It consumes Gate BG's selected closed-owner lane, revalidates the
  owner map as a policy-only `tighten` candidate with `max 0.6 dB` /
  `mean 0.6 dB`, and keeps runtime values, tolerances, exact-source
  promotion, formula retune, source text/document ingestion, and
  lab/field/building aliases closed. Selection status:
  `gate_bh_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_landed_no_runtime_selected_tighten_candidate_governance_gate_bi`.
  Selected next action:
  `gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`.
  Validation result for Gate BH is recorded in the Gate BH checkpoint.
- older per-gate bullets below are historical handoff context unless the
  current plan explicitly promotes them again.
- previous landed model-first physics prediction pivot Gate BE:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts`
  landed
  `gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan`.
  It consumes Gate BD's selected paired-negative lane, defines the
  three additional paired-negative boundary requirements, accepts only
  complete future source-owned wrong-support or wrong-reference ISO lab
  `DeltaLw` boundary packets as residual-policy readiness evidence,
  rejects missing boundary owner/locator, wrong metric/basis,
  product/inferred, rights-blocked, non-explicit, and same-stack
  non-boundary rows, and keeps exact promotion, tolerance movement,
  formula retune, field/building alias, source text/document ingestion,
  and runtime movement closed. Selection status:
  `gate_be_same_stack_iso_delta_lw_paired_negative_closure_landed_no_runtime_selected_open_web_input_ownership_gate_bf`.
  Selected next action:
  `gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts`.
  Validation result for Gate BE is recorded in the Gate BE checkpoint.
- previous landed model-first physics prediction pivot Gate BD:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`
  landed
  `gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan`.
  It consumes only Gate BC's selected source-owned same-stack ISO
  `DeltaLw` holdout-count closure lane, defines the two additional
  holdout evidence requirements, accepts only complete future
  source-owned ISO lab same-stack steel `DeltaLw` holdout packets as
  residual-readiness evidence, rejects missing metric/owner/locator,
  wrong basis/reference, product/inferred, and rights-blocked packets,
  and keeps exact promotion, tolerance movement, formula retune, field/
  building alias, source text/document ingestion, and runtime movement
  closed. Selection status:
  `gate_bd_same_stack_iso_delta_lw_holdout_closure_landed_no_runtime_selected_paired_negative_closure_gate_be`.
  Selected next action:
  `gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts`.
  Validation result for Gate BD is recorded in the Gate BD checkpoint.
- previous landed model-first physics prediction pivot Gate BC:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`
  landed
  `gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan`.
  It ranks only Gate BB accepted policy-decision rows, selects the
  source-owned same-stack ISO `DeltaLw` holdout-count closure lane for
  Gate BD, keeps paired-negative, open-web input ownership, and
  field/building owner closure lanes as ranked follow-ups, and keeps
  broad source crawl, exact promotion, tolerance movement, and runtime
  movement closed. Selection status:
  `gate_bc_same_stack_iso_delta_lw_residual_blocker_closure_landed_no_runtime_selected_holdout_closure_gate_bd`.
  Selected next action:
  `gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`.
  Validation result for Gate BC is recorded in the Gate BC checkpoint.
- previous landed model-first physics prediction pivot Gate BB:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`
  landed
  `gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan`.
  It consumes only Gate BA residual-admitted rows as policy-decision
  inputs, keeps blocked admission rows out, records the admitted future
  row as `hold_current_corridor_policy_decision`, exposes the blocker
  shortfalls required before retune/tighten/widen could be selected, and
  keeps policy labels separate from runtime movement, exact-source
  promotion, field/building aliases, and tolerance changes. Selection
  status:
  `gate_bb_same_stack_iso_delta_lw_residual_policy_decision_landed_no_runtime_selected_blocker_closure_gate_bc`.
  Selected next action:
  `gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`.
  Validation result for Gate BB is recorded in the Gate BB checkpoint.
- previous landed model-first physics prediction pivot Gate BA:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`
  landed
  `gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan`.
  It admits only Gate AZ accepted calibration candidates to same-stack
  ISO lab `DeltaLw` residual-policy evaluation, keeps current
  request-status rows and rejected candidates blocked, requires
  rights-safe citation/locator metadata plus all Gate AT/AK owner fields,
  and evaluates the accepted future probe as residual-policy `hold` with
  holdout-count, paired-negative, open-web-input, and field/building
  owner blockers still present. Selection status:
  `gate_ba_same_stack_iso_delta_lw_residual_admission_boundary_landed_no_runtime_selected_residual_policy_decision_gate_bb`.
  Selected next action:
  `gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`.
  Validation result for Gate BA is recorded in the Gate BA checkpoint.
- previous landed model-first physics prediction pivot Gate AZ:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`
  landed
  `gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan`.
  It uses Gate AY accepted packet boundary rows as the only calibration
  candidate source, keeps current request-status rows and rejected AY
  probes blocked, admits only the accepted future same-stack ISO
  `DeltaLw` boundary probe as a calibration evidence candidate, requires
  rights-safe citation/locator metadata, and keeps candidate status
  separate from residual admission, exact-source promotion, field/building
  aliases, tolerance movement, retune, and runtime movement. Selection
  status:
  `gate_az_same_stack_iso_delta_lw_packet_calibration_candidate_landed_no_runtime_selected_residual_admission_boundary_gate_ba`.
  Selected next action:
  `gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`.
  Validation result for Gate AZ is recorded in the Gate AZ checkpoint.
- just landed model-first physics prediction pivot Gate AY:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts`
  landed
  `gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan`.
  It uses only Gate AX request-ledger rows as current packet acceptance
  boundary rows, keeps current entries in request status until a
  source-owned packet exists, accepts only a complete future same-stack
  ISO lab `DeltaLw` packet boundary probe, rejects wrong-basis,
  wrong-reference, product/inferred, rights-blocked, missing-owner, and
  blocked-ledger probes, and keeps accepted boundary packets out of
  calibration evidence, exact-source promotion, retune, field/building
  aliases, and runtime movement. Selection status:
  `gate_ay_same_stack_iso_delta_lw_packet_acceptance_boundary_landed_no_runtime_selected_packet_calibration_candidate_gate_az`.
  Selected next action:
  `gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`.
  Validation result for Gate AY is recorded in the Gate AY checkpoint.
- just landed model-first physics prediction pivot Gate AX:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts`
  landed
  `gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan`.
  It converts only Gate AW ready packet request rows into rights-safe
  request ledger entries, keeps blocked readiness rows out, preserves
  locator-only metadata and the Gate AT/AK owner checklist, and keeps
  ledger entries separate from source packets, measured rows,
  calibration evidence, exact overrides, retune evidence, and runtime
  movement. Selection status:
  `gate_ax_same_stack_iso_delta_lw_packet_request_ledger_landed_no_runtime_selected_packet_acceptance_boundary_gate_ay`.
  Selected next action:
  `gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan`.
  Validation result for Gate AX is recorded in the Gate AX checkpoint.
- previous landed model-first physics prediction pivot Gate AW:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts`
  landed
  `gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan`.
  It uses only Gate AV accepted source-lead intake rows as packet request
  candidates, requires rights-safe locator metadata plus all Gate AT/AK
  packet owner fields, blocks rejected intake rows, and keeps ready
  packet requests separate from source packets, measured rows,
  calibration evidence, exact overrides, retune evidence, and runtime
  movement. Selection status:
  `gate_aw_same_stack_iso_delta_lw_packet_acquisition_readiness_landed_no_runtime_selected_packet_request_ledger_gate_ax`.
  Selected next action:
  `gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan`.
  Validation result for Gate AW is recorded in the Gate AW checkpoint.
- previous landed model-first physics prediction pivot Gate AV:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts`
  landed
  `gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan`.
  It converts Gate AU's accepted manufacturer lab-report index,
  accredited lab-report index, and internal measurement packet leads into
  metadata-only acquisition request targets, does not ingest source text
  or measured metric values, keeps all rejected Gate AU buckets blocked,
  and keeps source packets, calibration evidence, exact overrides,
  retune evidence, and runtime movement unavailable. Selection status:
  `gate_av_same_stack_iso_delta_lw_source_lead_intake_landed_no_runtime_selected_packet_acquisition_readiness_gate_aw`.
  Selected next action:
  `gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan`.
  Validation result for Gate AV is recorded in the Gate AV checkpoint.
- previous landed model-first physics prediction pivot Gate AU:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts`
  landed
  `gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan`.
  It uses the Gate AT same-stack ISO lab `DeltaLw` packet surface as
  the only source-lead scope, lets only rights-safe manufacturer
  lab-report index, accredited lab-report index, and internal measurement
  packet leads proceed as metadata-only packet acquisition targets, and
  keeps product-only, wrong-basis, concrete-reference, boundary-only,
  missing-owner, and rights-blocked leads rejected. Selection status:
  `gate_au_same_stack_iso_delta_lw_narrow_source_lead_landed_no_runtime_selected_source_lead_intake_gate_av`.
  Selected next action:
  `gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan`.
  Validation result for Gate AU is recorded in the Gate AU checkpoint.
- previous landed model-first physics prediction pivot Gate AT:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts`
  landed
  `gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan`.
  It uses Gate AS selected same-stack ISO lab `DeltaLw` packet ownership
  as the only acceptance surface, accepts only the source-owned
  same-stack fixture as calibration evidence, rejects product-only,
  wrong-basis, concrete-reference, boundary-only, missing-owner, and
  rights-blocked packets, and keeps residual policy on `hold` without
  moving runtime values. Selection status:
  `gate_at_same_stack_iso_delta_lw_packet_target_landed_no_runtime_selected_narrow_source_lead_gate_au`.
  Selected next action:
  `gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan`.
  Validation result for Gate AT is recorded in the Gate AT checkpoint.
- previous landed model-first physics prediction pivot Gate AS:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts`
  landed
  `gate_as_steel_floor_formula_owner_evidence_targeting_plan`.
  It ranks all seven Gate AQ steel-floor formula evidence owners by
  calculator impact and acquisition feasibility, keeps the Gate AR
  accepted local packet count at zero, selects same-stack ISO lab
  `DeltaLw` packet ownership as the next narrow target, and keeps exact
  source precedence, lab/field/building separation, and runtime values
  unchanged. Selection status:
  `gate_as_owner_evidence_targeting_landed_no_runtime_selected_same_stack_delta_lw_packet_target_gate_at`.
  Selected next action:
  `gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan`.
  Validation result for Gate AS is recorded in the Gate AS checkpoint.
- previous landed model-first physics prediction pivot Gate AR:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts`
  landed
  `gate_ar_steel_floor_formula_calibration_evidence_intake_plan`.
  It classifies the current Gate AK/AM local steel-floor formula
  calibration evidence against the Gate AQ owner map, keeps accepted
  local source-owned packet count at zero, rejects wrong-basis,
  wrong-reference-floor, product/inferred, missing-owner-field, and
  boundary-only evidence, and proves a future accepted packet still
  cannot move runtime values until residual-policy thresholds are met.
  Selection status:
  `gate_ar_calibration_evidence_intake_landed_no_runtime_selected_owner_evidence_targeting_gate_as`.
  Selected next action:
  `gate_as_steel_floor_formula_owner_evidence_targeting_plan`.
  Validation result for Gate AR is recorded in the Gate AR checkpoint.
- previous landed model-first physics prediction pivot Gate AQ:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts`
  landed
  `gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`.
  It maps every current steel-floor formula error-budget term to a
  source-owned evidence owner and blocker, proves the mapping exhaustive
  against runtime `ImpactErrorBudget.terms`, keeps current `Ln,w` and
  `DeltaLw` policies on `hold`, rejects wrong evidence from tightening,
  and defines future `hold`, `tighten`, `widen`, and `retune_candidate`
  branches without moving runtime values.
  Selection status:
  `gate_aq_error_budget_calibration_readiness_landed_no_runtime_selected_calibration_evidence_intake_gate_ar`.
  Selected next action:
  `gate_ar_steel_floor_formula_calibration_evidence_intake_plan`.
  Validation result for Gate AQ is recorded in the Gate AQ checkpoint.
- just landed model-first physics prediction pivot Gate AO:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts`
  landed
  `gate_ao_steel_floor_formula_error_budget_surface_parity_plan`.
  It moves Gate AN's source-absent steel-floor error-budget payload into
  the shared impact schema/runtime, impact-support formula notes,
  output cards, method/corridor dossiers, Markdown report, estimate API,
  and impact-only API. Runtime values stay pinned at `Ln,w 55.6` /
  `DeltaLw 22.4`; exact-source, needs-input, and unsafe topology lanes
  stay budget-free; `origin source_absent_formula_error_budget` and
  `notMeasuredEvidence true` remain visible.
  Selection status:
  `gate_ao_error_budget_surface_parity_landed_no_runtime_selected_error_budget_hostile_input_gate_ap`.
  Selected Gate AP file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts`.
  Selected next action:
  `gate_ap_steel_floor_formula_error_budget_hostile_input_plan`.
  Validation completed on 2026-05-07: focused Gate AE/AN/AO engine
  contracts passed 3 files / 15 tests, focused web steel-floor card /
  budget-surface / input-surface parity passed 3 files / 7 tests, full
  `pnpm calculator:gate:current` passed with engine 321 files / 1818
  tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean. Broad `pnpm check` passed
  after a transient Google Fonts fetch timeout was isolated by a
  successful build retry: lint, typecheck, engine 446 files / 2620
  tests, web 172 files / 961 passed + 18 skipped, and build all passed.
  `git diff --check` passed. Known non-fatal warnings remain the
  Node/Vitest Zustand persist storage warning and optional `sharp` /
  `@img` Next build warnings via the DOCX export dependency.
- just landed model-first physics prediction pivot Gate AN:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts`
  landed
  `gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`.
  It adds the structured source-absent steel-floor formula error budget
  for `Ln,w` and `DeltaLw` without moving runtime values or retuning the
  corridor. Complete source-absent steel formula cases keep the same
  `Ln,w 55.6` / `DeltaLw 22.4` estimates, while exact-source,
  needs-input, and unsafe-topology cases do not expose a formula budget.
  Selection status:
  `gate_an_source_absent_uncertainty_landed_no_runtime_selected_error_budget_surface_parity_gate_ao`.
  Selected next action:
  `gate_ao_steel_floor_formula_error_budget_surface_parity_plan`.
  Focused validation completed on 2026-05-07: Gate AN engine contract
  1 file / 6 tests, engine typecheck, focused Gate AM/AN contracts 2
  files / 11 tests, focused Gate AJ/AK/AL/AM/AN contracts 5 files / 25
  tests, full `pnpm calculator:gate:current`, and `git diff --check`
  passed before validation-doc sync. Current gate totals: engine 320
  files / 1813 tests, web 65 files / 284 passed + 18 skipped, repo
  build 5/5 successful, and whitespace guard clean.
- just landed model-first physics prediction pivot Gate AM:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`
  landed
  `gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`.
  It adds the narrow source-packet acquisition ledger after Gate AL:
  REGUPOL steel deck/joist and steel C-joist leads stay rejected as
  wrong-basis STC/IIC evidence, REGUPOL ISO `DeltaLw` leads stay
  rejected as solid/concrete reference-floor evidence, and SoundAdvisor
  is kept as a metric-scope boundary rather than a candidate packet.
  There are still zero accepted source-owned same-stack ISO lab
  `DeltaLw` steel-floor holdouts. Runtime values stay unchanged.
  Selection status:
  `gate_am_source_packet_acquisition_landed_no_runtime_selected_source_absent_uncertainty_gate_an`.
  Focused validation completed on 2026-05-07: Gate AM engine contract
  passed 1 file / 5 tests, engine typecheck passed, focused Gate
  AJ/AK/AL/AM contracts passed 4 files / 19 tests, and full `pnpm
  calculator:gate:current` passed with engine 319 files / 1807 tests,
  web 65 files / 284 passed + 18 skipped, repo build 5/5 successful,
  and whitespace guard clean. `git diff --check` passed.
  Selected next action:
  `gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`.
- just landed model-first physics prediction pivot Gate AL:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`
  landed
  `gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`.
  It adds the first-holdout guard for source-owned same-stack ISO lab
  `DeltaLw` steel-floor packets. Current inventory still has zero
  accepted measured `DeltaLw` holdouts: Pliteq and UBIQ are `Ln,w`/`Rw`
  evidence without owned `DeltaLw`, product catalog `DeltaLw` rows are
  not same-stack steel-floor formula holdouts, Annex/companion values are
  inferred, and the checked REGUPOL steel C-joist source is ASTM/IIC/STC
  basis rather than ISO lab `DeltaLw`. Runtime values stay unchanged.
  Selection status:
  `gate_al_source_owned_delta_lw_first_holdout_guard_landed_no_runtime_selected_source_packet_acquisition_gate_am`.
  Focused validation completed on 2026-05-07: Gate AL engine contract
  passed 1 file / 4 tests, and engine typecheck passed. Full `pnpm
  calculator:gate:current` passed after the Gate AJ/AK/AL doc-alignment
  repair: engine 318 files / 1802 tests, web 65 files / 284 passed + 18
  skipped, repo build 5/5 successful, and whitespace guard clean. `git
  diff --check` passed.
  Selected next action:
  `gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`.
- latest broad revalidation / Gate AL handoff:
  `docs/calculator/CHECKPOINT_2026-05-07_BROAD_REVALIDATION_GATE_AK_TO_GATE_AL_HANDOFF.md`
  confirms `pnpm check` passed after stale lint pins, impact validation
  fixture drift, and ambiguous duplicate/disjoint lightweight-steel
  floor schedule expectations were corrected. Gate AD steel-floor
  formula corridor coverage is now represented in the real-world floor
  and impact validation benchmark corpora as an explicit predictor-input
  estimate lane. Runtime values remain unchanged.
- latest report export/manual edit revalidation:
  `docs/calculator/CHECKPOINT_2026-05-07_GATE_AP_REPORT_EXPORT_REVALIDATION_AND_PUSH_HANDOFF.md`
  confirms the report editor remains a packaged proposal snapshot editor
  rather than a solver mutation surface. Manual edits can change issue
  export values/text/curves/layers/warnings, and both PDF and DOCX use
  the same edited snapshot. Real exports were generated:
  `gate-ap-manual-edit-checkpoint-simple.pdf` and
  `gate-ap-manual-edit-checkpoint-simple.docx`; PDF text extraction, PDF
  PNG rendering and visual review, DOCX zip integrity, and DOCX XML
  value checks passed. Focused report editor/export tests passed 6 files
  / 29 tests. Full `pnpm calculator:gate:current` passed with engine
  322 files / 1825 tests, web 66 files / 286 passed + 18 skipped, repo
  build 5/5 successful, and whitespace guard clean. `soffice` was not
  available, so DOCX visual rendering was not available in this
  environment.
- just landed model-first physics prediction pivot Gate AK:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`
  landed
  `gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`.
  It adds an executable source-owned same-stack lab `DeltaLw` holdout
  packet contract for the steel-floor formula lane. A candidate can
  count toward formula residual tightening only when the measured metric
  value, topology/support family, carrier spacing, load basis, dynamic
  stiffness, lower support class, upper-resilient topology, and paired
  negative boundary owner are all source-owned. Current Pliteq steel
  joist rows remain `Ln,w` holdouts only; UBIQ open-web exact rows
  remain anchors only; product-only, Annex-C/companion inferred,
  field/ASTM, and building-basis values are rejected from lab `DeltaLw`
  residual tightening. Runtime values stay unchanged. Selection status:
  `gate_ak_delta_lw_holdout_packet_contract_landed_selected_first_source_owned_holdout_gate_al`.
  Focused validation completed on 2026-05-07: Gate AK engine contract
  passed 1 file / 5 tests, and engine typecheck passed. Full `pnpm
  calculator:gate:current` passed with engine 317 files / 1798 tests,
  web 65 files / 284 passed + 18 skipped, repo build 5/5 tasks, and
  whitespace guard clean; `git diff --check` passed. Known non-fatal
  warnings remain the Node/Vitest Zustand persist storage warning and
  optional `sharp` / `@img` Next build warnings via the DOCX export
  dependency.
  Selected next action:
  `gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`.
- just landed model-first physics prediction pivot Gate AJ:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`
  landed
  `gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`.
  It adds four paired negative-boundary cases for the steel-floor
  formula lane: wrong support family, exact source precedence,
  lab-to-field/building basis leakage, and source-absent design
  references that cannot count as measured residuals. It also separates
  measured `DeltaLw` holdout intake from product-catalog, Annex-C or
  companion inferred, field/ASTM, and building-basis values. Runtime
  values stay unchanged; exact measured rows remain first; UBIQ
  open-web rows remain exact rows or calibration anchors until carrier
  spacing, load basis, dynamic stiffness, lower support class, and
  upper-resilient topology are source-owned. Selection status:
  `gate_aj_steel_formula_negative_boundary_delta_lw_intake_landed_selected_source_owned_delta_lw_gate_ak`.
  Focused validation completed on 2026-05-07: Gate AJ engine contract
  passed 1 file / 5 tests, and engine typecheck passed. Full `pnpm
  calculator:gate:current` passed with engine 316 files / 1793 tests,
  web 65 files / 284 passed + 18 skipped, repo build 5/5 tasks, and
  whitespace guard clean. Known non-fatal warnings remain the
  Node/Vitest Zustand persist storage warning and optional `sharp` /
  `@img` Next build warnings via the DOCX export dependency.
  Selected next action:
  `gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`.
- previously landed model-first physics prediction pivot Gate AI:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`
  landed
  `gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`.
  It converts Gate AH residual evidence into an executable residual
  policy with explicit `hold`, `tighten`, `widen`, and
  `retune_candidate` decisions. Current evidence holds the `+/-4.5 dB
  Ln,w` and `+/-2.0 dB DeltaLw` corridors: `Ln,w` residuals are low but
  only three same-family Pliteq holdouts exist, `DeltaLw` measured
  residual count is zero, UBIQ open-web formula inputs are not
  source-owned, and field/building basis owners are absent. Runtime
  values stay unchanged; exact measured rows remain first; source rows
  remain calibration evidence rather than the product. Selection status:
  `gate_ai_steel_floor_formula_residual_policy_landed_selected_negative_boundary_delta_lw_gate_aj`.
  Focused validation completed on 2026-05-07: Gate AI engine contract
  passed 1 file / 5 tests, and engine typecheck passed. Full `pnpm
  calculator:gate:current` passed with engine 315 files / 1788 tests,
  web 65 files / 284 passed + 18 skipped, and repo build 5/5 tasks.
  Known non-fatal warnings remain the Node/Vitest Zustand persist
  storage warning and optional `sharp` / `@img` Next build warnings via
  the DOCX export dependency.
  Selected next action:
  `gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`.
- previously landed model-first physics prediction pivot Gate AH:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`
  landed
  `gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`.
  It adds a source-bounded steel-floor formula accuracy benchmark matrix
  without moving runtime values. Three same-family Pliteq steel-joist
  lab `Ln,w` holdouts compare against the Gate AD formula with max
  residual `0.6 dB` and mean residual `0.4 dB`, all inside the current
  `+/-4.5 dB Ln,w` corridor. UBIQ open-web exact rows are counted as 36
  exact anchors but do not become residual rows when formula inputs such
  as carrier spacing, load basis, resilient dynamic stiffness, lower
  isolation support, or upper-resilient topology are missing. `DeltaLw`
  measured residual count remains zero, so the `+/-2.0 dB DeltaLw`
  tolerance is kept but not tightened. Selection status:
  `gate_ah_steel_floor_formula_accuracy_benchmark_landed_selected_residual_policy_gate_ai`.
  Focused validation completed on 2026-05-07: Gate AH engine contract
  passed 1 file / 5 tests, and engine typecheck passed. Full `pnpm
  calculator:gate:current` passed with engine 314 files / 1783 tests,
  web 65 files / 284 passed + 18 skipped, and repo build 5/5 tasks.
  Known non-fatal warnings remain the Node/Vitest Zustand persist
  storage warning and optional `sharp` / `@img` Next build warnings via
  the DOCX export dependency.
  Selected next action:
  `gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`.
- previously landed model-first physics prediction pivot Gate AG:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`
  landed
  `gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`.
  It keeps the Gate AD steel-floor formula values unchanged while proving
  the Gate AF input surface through live workbench evaluation, local saved
  replay, server snapshot replay, output cards, Markdown report payload,
  estimate API payload, impact-only API payload, and hostile UI edits.
  Complete UI-derived steel rows still return lab `LnW 55.6`,
  `DeltaLw 22.4`, and
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`.
  Missing/invalid steel physical fields now name the precise blockers;
  field impact requests such as `L'n,w` and `L'nT,w` remain unsupported
  instead of being promoted from lab `Ln,w`. Selection status:
  `gate_ag_steel_floor_formula_input_surface_acceptance_landed_selected_accuracy_benchmark_gate_ah`.
  Validation completed on 2026-05-07: Gate AG engine contract 1 file / 3
  tests, web steel formula input-surface acceptance 1 file / 4 tests,
  Gate AF + Gate AG web focused suite 2 files / 8 tests, engine
  typecheck, web typecheck, preflight `git diff --check`, and final
  `pnpm calculator:gate:current` all passed. The final current gate
  covered engine 313 files / 1778 tests, web 65 files / 284 tests plus
  18 skipped, repo build, and whitespace guard. The Gate AG web
  acceptance test emits known non-fatal Zustand persist storage warnings
  under Node/Vitest; the web build still emits the known non-fatal
  optional `sharp/@img` package warnings.
  Selected next action:
  `gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`.
- previously landed model-first physics prediction pivot Gate AF:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`
  landed
  `gate_af_steel_floor_formula_input_surface_plan`.
  It adds a first-class Dynamic Calculator steel-floor formula input
  surface for `steelSupportForm`, `steelCarrierDepthMm`,
  `steelCarrierSpacingMm`, `resilientLayerDynamicStiffnessMNm3`,
  `loadBasisKgM2`, and `lowerCeilingIsolationSupportForm`. The workbench
  route controls, scenario analysis, local/server snapshots, and engine
  helper now bridge those user-facing fields into the Gate AD
  `ImpactPredictorInput`. Complete construction-image style steel rows
  plus the UI surface return lab `LnW 55.6`, `DeltaLw 22.4`, and
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`;
  partial fields stay parked, unsafe duplicate steel carrier topology is
  refused, and exact measured full-stack rows remain above the formula
  corridor. Selection status:
  `gate_af_steel_floor_formula_input_surface_landed_selected_acceptance_revalidation_gate_ag`.
  Validation completed on 2026-05-07: focused Gate AF engine contract 1
  file / 5 tests, focused web steel formula input-surface test 1 file /
  4 tests, engine typecheck, web typecheck, and final `pnpm
  calculator:gate:current` with engine 312 files / 1775 tests and web 64
  files / 280 tests plus 18 skipped, repo build, and whitespace guard all
  passed. The Next build still emits the known non-fatal optional
  `sharp/@img` package warnings. Selected next action:
  `gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`.
- previously landed model-first physics prediction pivot Gate AE:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts`
  landed
  `gate_ae_steel_floor_formula_card_and_report_parity_plan`.
  It keeps Gate AD runtime values unchanged but exposes
  `Lightweight-steel formula corridor` consistently across workbench
  cards, output posture, dynamic impact trace, impact-support formula
  notes, validation mode, proposal method dossier, and Markdown report.
  Selection status:
  `gate_ae_steel_formula_card_report_parity_landed_selected_input_surface_gate_af`.
  Validation completed on 2026-05-07: focused Gate AE engine contract 1
  file / 4 tests, focused web steel formula card/report parity 1 file /
  1 test, focused Gate AD regression 1 file / 6 tests, focused web
  output/model/dossier/formula report regressions 3 files / 16 tests,
  final `pnpm calculator:gate:current` with engine 311 files / 1770
  tests and web 63 files / 276 tests plus 18 skipped, repo build, and
  whitespace guard all passed. The Next build still emits the known
  non-fatal optional `sharp/@img` package warnings. Selected next
  action: `gate_af_steel_floor_formula_input_surface_plan`.
- just landed model-first physics prediction pivot Gate AD:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts`
  landed
  `gate_ad_steel_floor_impact_formula_numeric_corridor_plan`.
  It adds `steel-floor-impact-formula-corridor.ts`, promotes complete
  source-absent steel floors to
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`,
  pins the open-web example at `LnW 55.6` / `DeltaLw 22.4`, keeps exact
  measured rows above the formula, and blocks broad steel-family fallback
  when carrier spacing or lower isolation is missing. Selection status:
  `gate_ad_steel_floor_impact_formula_corridor_landed_selected_card_report_parity_gate_ae`.
  Validation completed on 2026-05-07: focused Gate AD 1 file / 6 tests,
  Gate AC/Gate AD plus predictor-input regression 3 files / 55 tests,
  impact-only fallback regression 1 file / 102 tests, engine typecheck,
  final `pnpm calculator:gate:current` with engine 310 files / 1766
  tests and web 62 files / 275 tests plus 18 skipped, repo build,
  whitespace guard, and final `git diff --check` all passed. The Next
  build still emits the known non-fatal `sharp` optional `@img` package
  warnings.
  Selected next action:
  `gate_ae_steel_floor_formula_card_and_report_parity_plan`.
- just landed model-first physics prediction pivot Gate AC:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts`
  landed
  `gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`.
  It adds `steel-floor-impact-physics-input-contract.ts`, extends the
  shared impact predictor input with `carrierSpacingMm`, and adds steel
  floor prompt field ids for support form, carrier depth/spacing, and
  lower ceiling isolation. It does not move runtime values: complete
  open-web steel input becomes formula-corridor ready only, exact source
  rows remain highest precedence, and missing spacing/lower isolation are
  protected nearby negatives. Selection status:
  `gate_ac_steel_floor_physics_input_contract_landed_selected_formula_corridor_gate_ad`.
  Selected next action:
  `gate_ad_steel_floor_impact_formula_numeric_corridor_plan`.
- just landed model-first physics prediction pivot Gate AB:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts`
  landed
  `gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan`.
  It adds `floor-family-source-guard.ts`, withholds generic
  `lightweight_steel_floor` family estimates when support form is
  unspecified, and surfaces missing-input warnings instead of borrowing
  UBIQ open-web or Pliteq steel-joist rows. Exact same-family steel rows
  and same-family bound rows remain visible. Selection status:
  `gate_ab_floor_family_source_guard_landed_selected_steel_floor_physics_input_gate_ac`.
  Selected next action:
  `gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`.
- just landed model-first physics prediction pivot Gate AA:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aa-construction-image-accuracy-incident-contract.test.ts`
  landed
  `gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`.
  It replaces the 50/50 mm grouped Rockwool fixture selector with a
  domain-based grouped triple-leaf path. The shared-wall construction
  image with explicit 80/80 mm mineral-wool cavities now selects
  `triple_leaf_two_cavity_frequency_solver`, returns `Rw 61`, `STC 61`,
  `C -1.7`, and `Ctr -6.8`, and rejects
  `multileaf_screening_blend` as lower precedence. Flat-list ACON-like
  input remains `needs_input`. Selection status:
  `gate_aa_construction_image_route_selection_recovered_selected_floor_family_guard_gate_ab`.
  Selected next action:
  `gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan`.
- just landed model-first physics prediction pivot Gate Z:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts`
  landed
  `gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`.
  It promotes Dynamic Calculator field-only floor-impact `L'n,w` and
  `L'nT,w` when the Gate W lab `Ln,w` / `DeltaLw` anchor and Gate Y
  field context are complete. The promoted reference scenario pins
  `LnW 50.3`, `DeltaLw 24.3`, `LPrimeNW 52.3`, and `LPrimeNTw 49.9`
  on basis
  `mixed_predicted_plus_estimated_standardized_field_volume_normalization`.
  `L'nT,50` stays unsupported until
  `lowFrequencyImpactSpectrumOrCI50_2500Owner` exists. Selection status:
  `gate_z_floor_impact_field_runtime_landed_selected_construction_image_accuracy_incident_gate_aa`.
  Selected next action:
  `gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`.
- just landed model-first physics prediction pivot Gate Y:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`
  landed
  `gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`.
  It defines the Dynamic Calculator floor-impact field-context adapter
  boundary without runtime value movement. Required fields are
  `contextMode`, `partitionAreaM2`, `receivingRoomVolumeM3`,
  `receivingRoomRt60S`, and `impactFieldContext`; required owners are
  the Gate W lab impact anchor, field K / mass-ratio /
  direct-flanking policy, flanking path or junction policy, and a
  low-frequency owner before `L'nT,50`. Field-only requests stay blocked
  until Gate Z; lab-anchored mixed requests already reach the existing
  field supplement and Gate Z must own that as a coherent runtime/card/
  report path. Selection status:
  `gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z`.
  Validation passed: focused Gate Y 1 file / 5 tests; focused
  Gate V/W/X/Y 4 files / 22 tests; engine typecheck; current gate;
  broad `pnpm check`; and `git diff --check`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts`.
  Selected next action:
  `gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`.
- just landed model-first physics prediction pivot Gate X:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-x-next-solver-or-field-context-selection-contract.test.ts`
  landed
  `gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary`.
  It compares the remaining high-impact Dynamic Calculator gaps after
  Gate W and selects floor-impact field-context ownership for Gate Y.
  The selected path is explicitly no-runtime: lab `Ln,w` / `DeltaLw`
  pins stay on Gate W, `L'n,w` / `L'nT,w` remain blocked until room
  geometry, RT60/absorption, impact field context, flanking policy, and
  ISO 717-2 field adapter ownership are contracted, and source rows stay
  as anchors/calibration/overrides rather than the product. Selection
  status:
  `gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`.
  Selected next action:
  `gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`.
- just landed model-first physics prediction pivot Gate W:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`
  landed
  `gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator`.
  It promotes the complete Dynamic Calculator resilient floating-floor
  ISO 717-2 lab lane for `Ln,w` / `DeltaLw` only when Gate V's physical
  input boundary is ready. The runtime predictor now carries explicit
  `loadBasisKgM2` plus dynamic stiffness into the heavy floating-floor
  formula, pins the visible support bucket and trace basis to
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`, and keeps
  missing load, missing dynamic stiffness, field impact without room
  context, and ASTM `IIC` / `AIIC` as non-promoted boundaries.
  Selection status:
  `gate_w_floor_impact_runtime_landed_selected_next_dynamic_calculator_solver_or_field_context_gate_x`.
  Selected next action:
  `gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary`.
- just landed model-first physics prediction pivot Gate V:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`
  landed
  `gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`.
  It adds the no-runtime floor-impact dynamic-stiffness input/adapter
  contract for Dynamic Calculator. `resilientLayerDynamicStiffnessMNm3`
  and `loadBasisKgM2` are executable physical inputs for resilient
  floating-floor `Ln,w` / `DeltaLw`; missing values produce targeted
  `needs_input`. `L'n,w` / `L'nT,w` require explicit field context, and
  `IIC` / `AIIC` remain unsupported until an ASTM E989 adapter owner
  exists. Safe role-defined floor reorders normalize without moving
  runtime values. Selection status:
  `gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`.
  Selected next action:
  `gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator`.
- latest Gate U revalidation / commit-prep checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_REVALIDATION_AND_COMMIT_HANDOFF.md`
  confirms `main` was even with `origin/main`,
  `pnpm calculator:gate:current` was green, broad `pnpm check` was green after
  fixing two proposal-surface regressions, and Gate V was the right
  first implementation step.
- just landed model-first physics prediction pivot Gate U:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`
  landed
  `gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`.
  It ranks the next solver/calibration candidates after Gate T material
  gap closure and selects floor-impact dynamic-stiffness input/adapter
  ownership for Gate V. Calibration holdouts remain useful later for
  error-budget tightening, but they are not selected ahead of the
  larger floor coverage gap. `Ln,w`, `L'n,w`, `L'nT,w`, and `IIC` stay
  basis-separated; runtime values and support buckets stay unchanged.
  Selection status:
  `gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_HANDOFF.md`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`.
  Selected next action:
  `gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`.
- just landed model-first physics prediction pivot Gate T:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts`
  landed
  `gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator`.
  It closes the high-impact material-property gaps needed by Dynamic
  Calculator family physics without creating a finite source catalog.
  Shared material acoustic metadata now includes `absorberClass`; seed
  materials carry engineering-default acoustic properties for board
  leaves/finishes, masonry cores, porous absorbers, floor decks/screeds,
  limp membranes, and resilient impact layers. Required property gaps
  remain executable `needs_input`; optional precision gaps widen
  uncertainty through explicit defaults. Runtime values and support
  buckets stay unchanged, and Gate S double-leaf/framed value pins remain
  stable. Selection status:
  `gate_t_family_material_property_gap_closure_landed_no_runtime_selected_next_solver_or_calibration_gate_u`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_T_HANDOFF.md`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`.
  Selected next action:
  `gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`.
- just landed model-first physics prediction pivot Gate S:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts`
  landed
  `gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator`.
  It wires the Gate R double-leaf / framed bridge solver into Dynamic
  Calculator runtime for explicit complete contexts only. Independent
  absorbed gypsum / rockwool / gypsum now selects the family physics
  candidate with `Rw 45`, `STC 45`, `C -1`, `Ctr -6.1`, and a `7 dB`
  uncalibrated error budget; resilient both-side bridge selects
  `Rw 46` / `STC 46` with an `8 dB` error budget. Exact source rows
  remain higher precedence through the Gate H policy. Missing
  `resilientBarSideCount` stays `needs_input` and explicit
  double-leaf/framed visible cards are parked instead of showing
  fallback numbers; direct-fixed and multi-cavity flat-list boundaries
  do not promote. Selection status:
  `gate_s_double_leaf_framed_bridge_runtime_landed_selected_family_material_gap_gate_t`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_S_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate R:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`
  landed
  `gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`.
  It adds the no-runtime double-leaf / framed bridge solver-candidate
  contract in
  `dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts`.
  Gate R owns the formula/method contract before runtime selection:
  explicit side-leaf surface masses, mass-air-mass resonance, bridge
  coupling, porous cavity damping, ISO 717-1 `Rw` adapter, and ASTM E413
  `STC` adapter boundary. It creates positive benchmark corridors for
  independent absorbed and resilient bridge cases, carries Gate Q
  `needs_input` for missing resilient side count, and protects
  direct-fixed plus multi-cavity flat-list negative boundaries. Runtime
  values stay unchanged. Selection status:
  `gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_R_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate Q:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`
  landed
  `gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`.
  It adds the explicit Dynamic Calculator double-leaf / framed bridge
  input contract in
  `dynamic-calculator-double-leaf-framed-bridge-input-contract.ts`,
  extends `wallTopology.topologyMode` with `double_leaf_framed`, and
  wires explicit double-leaf/framed contexts into
  `dynamic-calculator-route-input-topology.ts`. Missing grouping,
  cavity depth, bridge class, support topology, support spacing, and
  resilient-bar side count become targeted `needs_input` prompts;
  source absence remains exact/calibration-only. Runtime values stay
  unchanged. Selection status:
  `gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Q_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate P:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`
  landed
  `gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`.
  It adds the no-runtime next-family solver selection helper in
  `dynamic-calculator-next-family-solver-upgrade-selection.ts`. Gate P
  excludes the Gate O single-leaf family from the next ranking and
  selects double-leaf / framed bridge as the next calculator family
  because it unlocks common wall coverage without requiring source rows.
  Runtime promotion is explicitly blocked until `frameBridgeClass`,
  `studSpacingMm`, `resilientSideCount`, `supportTopology`, porous
  cavity damping, and mass-air-mass resonance owners are contracted with
  positive and nearby-negative benchmarks. Selection status:
  `gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_P_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate O:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts`
  landed
  `gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`.
  It adds the narrow Dynamic Calculator single-leaf / laminated
  single-leaf / rigid massive panel runtime promotion helper in
  `dynamic-airborne-gate-o-single-leaf.ts` and wires it into
  `dynamic-airborne.ts`. Ordinary single 12.5 mm gypsum board, laminated
  double gypsum board, and 150 mm concrete keep the same values and
  target-output support, but their selected candidate origin is now
  `family_physics_prediction` with `runtimeValueMovement: false`.
  Exact source rows still win when eligible, grouped Rockwool Gate G
  stays unchanged, and CLT/mass timber remains screening until
  orthotropic/directional properties are owned. Selection status:
  `gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_O_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate N:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts`
  landed
  `gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator`.
  It adds the no-runtime Dynamic Calculator family-solver upgrade
  selection helper in
  `dynamic-calculator-family-solver-upgrade-selection.ts`. Gate N
  selects single-leaf / laminated single-leaf / rigid massive panel as
  the first runtime family upgrade because the current family candidate
  is already visible but still selected as `screening_fallback`, the
  material inputs are complete, and the blast radius is lower than
  double/framed, generalized multi-cavity, lined masonry/CLT, floor
  impact, or field/building continuations. Runtime numeric values,
  support buckets, confidence, evidence, and report/workbench behavior
  stay unchanged. Selection status:
  `gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_N_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate M:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`
  landed
  `gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator`.
  It adds the Dynamic Calculator candidate resolver runtime surface in
  `dynamic-calculator-candidate-resolver-runtime.ts` and wires it into
  `calculateAssembly` for dynamic calculator results. Runtime numeric
  values and support buckets stay unchanged, but selected/rejected
  candidates are now visible for exact source, anchored delta,
  calibrated family, uncalibrated family physics, bounded, screening,
  `needs_input`, and `unsupported` lanes. ACON-like flat-list
  multi-cavity walls now expose `needs_input` candidate metadata instead
  of a silent screening-only surface. Selection status:
  `gate_m_dynamic_candidate_resolver_runtime_landed_no_value_selected_family_solver_upgrade_gate_n`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_M_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate L:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts`
  landed
  `gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator`.
  It adds the no-runtime Dynamic Calculator topology normalizer and
  hostile input guard in `dynamic-calculator-topology-normalizer.ts`.
  Role-defined floor input can be canonicalized/coalesced where the
  physics is invariant to split rows or UI reorder; grouped multi-cavity
  wall order is preserved; ambiguous flat-list multi-cavity walls are not
  auto-grouped and delegate missing topology prompts to Gate K; unsafe
  multi-cavity reorders and hostile layer inputs fail closed with trace.
  Runtime values stay unchanged. Selection status:
  `gate_l_topology_normalizer_hostile_input_guard_landed_no_runtime_selected_candidate_resolver_gate_m`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_L_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate K:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts`
  landed
  `gate_k_define_route_input_topology_contracts_for_dynamic_calculator`.
  It adds the no-runtime Dynamic Calculator route/input topology
  contract in `dynamic-calculator-route-input-topology.ts`: wall/floor
  route assessment, lab/field/building output-basis requirements,
  grouped multi-cavity wall topology prompts, field/building room and
  flanking prompts, floating-floor dynamic-stiffness/load prompts, and
  unsupported output posture for `IIC`/`AIIC` style outputs. Source
  absence remains a source-promotion blocker only and never becomes a
  physical `needs_input` prompt by itself. Runtime values stay
  unchanged. Selection status:
  `gate_k_route_input_topology_contract_landed_no_runtime_selected_topology_normalizer_gate_l`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_K_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate J:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts`
  landed
  `gate_j_build_personal_use_readiness_scenario_pack`.
  It adds the personal-use readiness scenario pack and engine-inventory
  guard in `airborne-personal-use-readiness-scenario-pack.ts`, proving
  wall/floor coverage, exact/source-anchored/calibrated/uncalibrated/
  bounded/screening/needs_input/unsupported method selection, ACON-like
  flat-list multi-cavity guarding, current grouped Rockwool source-absent
  family prediction, and floor impact support gaps without moving runtime
  values. Selection status:
  `gate_j_personal_use_readiness_scenario_pack_landed_no_runtime_selected_route_input_topology_gate_k`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_J_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate I:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`
  landed
  `gate_i_expand_family_material_properties_and_benchmark_scenarios`.
  It adds optional acoustic material properties to the shared material
  schema, nominal engineering defaults for common wall/floor materials,
  and the `airborne-family-material-expansion.ts` benchmark/readiness
  helper. Missing required material properties now have an executable
  `needs_input` posture, while optional precision gaps widen uncertainty
  through explicit defaults. Runtime values stay unchanged. Selection
  status:
  `gate_i_family_material_properties_and_benchmark_scenarios_landed_no_runtime_selected_personal_use_readiness_gate_j`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_I_HANDOFF.md`.
- latest checkpoint / manual export validation:
  `docs/calculator/CHECKPOINT_2026-05-06_GATE_I_REPORT_EXPORT_MANUAL_EDIT_VALIDATION_HANDOFF.md`
  confirms Gate I is still the landed gate, Gate J remains next, and
  manual report edits were verified with generated PDF and DOCX files.
  PDF was rendered to PNG and visually checked; DOCX package integrity
  and Word XML content confirmed the same manual snapshot values. The
  environment lacked `soffice`/LibreOffice, so DOCX visual rendering was
  not available in this checkpoint.
- latest wrap-up checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md`
  confirms Gate H is validated, `pnpm calculator:gate:current` is green,
  broad `pnpm check` is green, the report editor edits only the packaged
  proposal snapshot, and PDF plus DOCX exports both use the same
  manually editable snapshot.
- just landed model-first physics prediction pivot Gate H:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts`
  landed
  `gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver`.
  It adds the source-promotion readiness policy for exact full-stack,
  calibrated family, and exact-subassembly-plus-delta candidates without
  moving runtime values. Source rows can promote only when rights-safe
  evidence, topology/material/metric/tolerance owners, paired positive
  and negative tests, and calibration holdout metadata are present.
  Exact, calibrated, anchored-delta, and uncalibrated physics candidates
  coexist in the resolver; eligible source candidates can win by
  precedence, but the Gate G family-physics prediction candidate is not
  deleted. Selection status:
  `gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate G:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts`
  landed
  `gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks`.
  It makes the first model-first runtime prediction movement for the
  explicit grouped Rockwool triple-leaf case. Complete grouped topology
  with two 50 mm full porous Rockwool cavities and an internal gypsum
  leaf now selects `family_physics_prediction` on
  `triple_leaf_two_cavity_frequency_solver`, returning lab `Rw 50 /
  STC 55 / C 0.8 / Ctr -7.3` and building-prediction `R'w 50 /
  DnT,w 51 / DnT,A 51.3`. Exact/source-validated promotion remains
  false; missing source evidence rejects exact/calibrated candidates
  only. Flat-list split/internal Rockwool remains guarded at diagnostic
  `Rw 41` with unsupported target outputs. Selection status:
  `gate_g_grouped_rockwool_family_physics_prediction_landed_selected_source_calibration_gate_h`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate E:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`
  landed
  `gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`.
  It added shared optional `airborneCandidateResolution` metadata and a
  model-first resolver policy without moving runtime values. It records
  selected and rejected airborne candidates, pins precedence from exact
  full-stack rows through anchored delta, calibrated family physics,
  uncalibrated family physics prediction, bounded/screening fallbacks,
  `needs_input`, and `unsupported`, and makes rejection reasons
  executable. It proves source absence blocks exact/calibration
  promotion only, missing topology selects `needs_input`, deterministic
  tie-breakers survive duplicate rows and safe candidate reorders, and
  grouped Rockwool remains frozen at `Rw 41` / `multileaf_screening_blend`.
  Selection status:
  `gate_e_airborne_candidate_resolver_landed_no_runtime_selected_grouped_rockwool_prediction_gate_g`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate D:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`
  landed
  `gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`.
  It added shared optional `inputCompletenessSet` metadata and
  `input-completeness` schemas without moving runtime values. It defines
  the minimum physical input matrix for single-leaf airborne,
  double/framed airborne, triple-leaf/multicavity airborne, porous-fill
  modifiers, floating-floor impact, and field/apparent output contexts.
  It proves source absence remains an exact/calibration blocker only,
  physical input absence yields `needs_input`, and optional precision
  gaps widen uncertainty rather than blocking when documented defaults
  exist. It freezes Rockwool values and selects Gate E airborne
  candidate resolver as the next no-runtime step. Selection status:
  `gate_d_input_completeness_matrix_landed_no_runtime_selected_airborne_candidate_resolver_gate_e`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate C:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`
  landed
  `gate_c_inventory_rating_adapter_integrity_without_value_movement`.
  It added shared optional `ratingAdapterBasisSet` metadata and
  `rating-adapter` schemas without moving runtime values. It inventories
  ISO 717-1, ISO 717-2, ASTM E413, and ASTM E989 rating lanes, proves
  `Rw`/`STC` and `Ln,w`/`IIC` are not silent aliases, marks ASTM E989
  IIC as planned/not implemented until a real adapter or exact source
  owner exists, freezes Rockwool values, and selects Gate D physical
  input completeness / `needs_input` matrix as the next no-runtime step.
  Selection status:
  `gate_c_rating_adapter_integrity_landed_no_runtime_selected_input_completeness_gate_d`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate B:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`
  landed
  `gate_b_defined_shared_airborne_basis_candidate_schema_without_value_movement`.
  It added shared airborne `airborneBasis` / `airborneCandidateSet`
  schema support without moving runtime values. It kept source absence
  and physical-input absence separate, kept legacy `AssemblyCalculation`
  payloads parse-compatible, required uncertainty metadata for
  formula-backed prediction candidates, froze Rockwool values, and
  selected Gate C rating-adapter integrity as the next no-runtime step.
  Selection status:
  `gate_b_shared_airborne_basis_candidate_schema_landed_no_runtime_selected_rating_adapter_gate_c`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate A:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`
  landed
  `gate_a_defined_model_first_candidate_basis_and_benchmark_acceptance_no_runtime`.
  It kept runtime values, support buckets, confidence, evidence, route
  cards, output cards, proposal/report copy, and workbench input behavior
  frozen. It made the model-first rule executable: source absence blocks
  exact/calibration promotion only, not formula-backed prediction. It
  named airborne candidate origins, basis fields, standards fields,
  B0-B12 benchmark lanes, runtime stop rules, and selected Gate B shared
  airborne basis/candidate schema. Grouped Rockwool remains unchanged at
  `Rw 41` / `multileaf_screening_blend` until M6.
  Gate A selected Gate B action:
  `gate_b_define_shared_airborne_basis_candidate_schema_without_value_movement`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md`.
- checkpoint/revalidation after Gate A:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_GATE_A_REVALIDATION_COMMIT_HANDOFF.md`
  confirms the plan is still correct, Gate B remains next, runtime values
  are still frozen, grouped Rockwool is still `Rw 41` screening until M6,
  and INSUL should be treated as a competitor/category benchmark rather
  than the target ceiling. The project goal remains stronger than a
  lookup table: exact rows win when they match, but family-specific
  physics must calculate unknown stacks with explicit basis, assumptions,
  tolerance/error budget, and tests.
- standards research and plan detail completed on 2026-05-05:
  `docs/calculator/CHECKPOINT_2026-05-05_STANDARDS_RESEARCH_PLAN_DETAIL_HANDOFF.md`.
  It expanded the active plan around ISO 12354-1/2, ISO 717-1/2,
  ISO 10140, ISO 16283, ASTM E90/E336/E413, ASTM E492/E989, INSUL as a
  competitor prediction-engine reference, and double-leaf cavity
  research. At that time Gate A was still next; Gate A has now landed
  and Gate B is the current next step.
- doc/implementation reconciliation completed on 2026-05-05:
  `docs/calculator/CHECKPOINT_2026-05-05_DOC_IMPLEMENTATION_RECONCILIATION_HANDOFF.md`.
  It inventoried `docs`, scanned all calculator docs for active/current
  drift, compared the active authority docs with engine/shared/web
  implementation surfaces, updated stale entry docs, and confirmed the
  active runtime reality: grouped Rockwool still uses
  `multileaf_screening_blend` at `Rw 41`, the triple-leaf frequency
  solver is research/runtime-ineligible, and airborne lacks a
  first-class candidate/basis resolver. At that time the model-first
  Gate A target file was still next; Gate A has now landed and Gate B is
  the next file to create.
- model-first physics prediction replan completed on 2026-05-05:
  `docs/calculator/CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md`
  superseded
  `rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2` as
  the active next step and selected
  `calculator_model_first_physics_prediction_pivot_v1`. The corrected
  rule is: DynEcho is an acoustic calculator first. Exact/lab/source
  rows can override, anchor, calibrate, validate, and benchmark results,
  but missing source packets must not block formula-backed calculation.
  A missing Rockwool/Uris packet still blocks measured-exact or
  source-validated promotion; it does not block a labelled
  `family_physics_prediction`. The active Gate A is no-runtime and must
  define airborne candidate origins and precedence before any runtime
  movement. The old Rockwool source-packet refresh plan is retained only
  for later exact-source/calibration backlog.
- just landed calculator source-gap revalidation V28 Gate A:
  `packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`
  closed prior selected source-gap slice
  `calculator_source_gap_revalidation_v28` and landed
  `selected_rockwool_split_triple_leaf_rights_safe_source_packet_refresh_after_v28_rerank_no_runtime_candidates_after_ubiq_packaged_finish`.
  It selected
  `rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2`
  with target file
  `packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts`
  and action
  `gate_a_refresh_rights_safe_rockwool_triple_leaf_source_packet_search_without_runtime`.
  It added `ubiq_packaged_finish_current_gate_pack_preserved_after_v28`,
  `rockwool_numeric_boundaries_after_v28`,
  `rockwool_rights_safe_source_packet_refresh_selected_after_v28`, and
  `raw_open_web_and_company_internal_blockers_carry_forward_after_v28`.
  Runtime values, source rows, support semantics, confidence, evidence,
  API, route-card values, output-card statuses, proposal/report copy,
  and workbench input behavior stay frozen. UBIQ packaged-finish remains
  current-gate owned for `90 exact` and `21 bound` rows. Adjacent
  Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`; flat-list
  split/internal gypsum-leaf Rockwool remains withheld from supported
  outputs at diagnostic `Rw 41 / R'w 39 / DnT,w 40`; direct exact
  runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`. Generic/raw open-web
  widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`. Validation
  passed on 2026-05-05: focused V28 Gate A 1 file / 5 tests, focused
  UBIQ continuity 7 files / 25 tests, focused Rockwool/source-packet
  continuity 4 files / 21 tests, final doc-contract continuity 4 files
  / 20 tests after validation-note updates, final
  `pnpm calculator:gate:current` with engine 281 files / 1587 tests,
  web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Final
  `git diff --check` passed. Known non-fatal `sharp/@img` warnings
  remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts`
  was restored to `.next-typecheck` after the Next build.
- just landed UBIQ packaged-finish current-gate guard Gate C closeout:
  `packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_ubiq_open_web_packaged_finish_current_gate_guard_selected_source_gap_revalidation_v28`.
  It selected
  `packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`
  with action
  `gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout`
  and plan
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md`.
  It added `closed_ubiq_packaged_finish_current_gate_guard_summary`,
  `packaged_finish_current_gate_pack_carry_forward`,
  `source_gap_revalidation_v28_selected_after_ubiq_packaged_finish_closeout`,
  and
  `rockwool_and_raw_open_web_blockers_carry_forward_after_ubiq_packaged_finish_closeout`.
  Runtime values, source rows, support semantics, confidence, evidence,
  API, route-card values, output-card statuses, proposal/report copy,
  and workbench input behavior stay frozen. Rockwool exact runtime
  remains blocked by `rights_safe_source_owned_curve_payload_absent`;
  generic/raw open-web widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`. Validation
  passed on 2026-05-05: focused Gate C 1 file / 5 tests, focused
  packaged-finish continuity with engine 5 files / 15 tests and web
  4 files / 5 tests, final `pnpm calculator:gate:current` with engine
  280 files / 1582 tests, web 61 files / 273 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Final
  `git diff --check` passed. Known non-fatal `sharp/@img` warnings
  remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts`
  was restored to `.next-typecheck` after the Next build.
- just landed UBIQ packaged-finish current-gate guard Gate A:
  `packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`
  landed
  `gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate_selected_closeout`.
  It selected
  `packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  with action
  `gate_c_closeout_ubiq_open_web_packaged_finish_current_gate_guard_and_select_next_accuracy_slice`.
  It added `ubiq_packaged_finish_current_gate_guard_gate_a_summary`,
  `current_gate_promoted_ubiq_packaged_finish_engine_visible_pack`,
  `source_verified_ubiq_packaged_finish_pdf_status`, and
  `rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a`.
  The current gate now owns UBIQ packaged-finish engine family-design,
  near-miss, packaged-lane trace, visible card, and saved/edit history
  replay guards for `90 exact` and `21 bound` source-backed open-web
  rows. Runtime values, source rows, support semantics, confidence,
  evidence, API, route-card values, output-card statuses,
  proposal/report copy, and workbench input behavior stay frozen.
  Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`; generic/raw open-web
  widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`. Validation
  passed on 2026-05-05: focused Gate A 1 file / 5 tests, focused
  packaged-finish continuity with engine 4 files / 10 tests and web
  4 files / 5 tests, final `pnpm calculator:gate:current` with engine
  279 files / 1577 tests, web 61 files / 273 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Known non-fatal
  `sharp/@img` warnings remain through `@turbodocx/html-to-docx`;
  `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  Next build.
- pre-Gate A analysis replan completed on 2026-05-05:
  `docs/calculator/CHECKPOINT_2026-05-05_PRE_UBIQ_PACKAGED_FINISH_GATE_A_ANALYSIS_REPLAN_HANDOFF.md`
  confirmed implementation and docs agree. The selected Gate A contract
  file is still absent, the seven existing UBIQ packaged-finish
  engine/web guard files exist, and they are not yet owned by
  `tools/dev/run-calculator-current-gate.ts` as one pack. Focused
  continuity passed with engine 4 files / 10 tests and web 4 files /
  5 tests. The official UBIQ PDF source is accessible. No runtime
  retune, Rockwool exact promotion, or generic/raw open-web widening is
  part of this Gate A.
- broad validation and next-step refresh completed on 2026-05-05:
  `docs/calculator/CHECKPOINT_2026-05-05_BROAD_REVALIDATION_AND_NEXT_STEP_HANDOFF.md`
  recorded `pnpm check` green: lint clean, typecheck clean, engine
  full suite 403 files / 2374 tests, web full suite 166 files / 936
  passed + 18 skipped, and repo build 5 / 5 tasks. There is no broad
  test failure requiring emergency repair before the selected next
  slice. The correct immediate step remains
  `ubiq_open_web_packaged_finish_current_gate_guard_v1` Gate A. Known
  non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed calculator source-gap revalidation V27 Gate A:
  `packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`
  landed
  `selected_ubiq_open_web_packaged_finish_current_gate_guard_after_v27_rerank_preserved_rockwool_and_raw_open_web_blockers`.
  It selected
  `ubiq_open_web_packaged_finish_current_gate_guard_v1` with target file
  `packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`
  and action
  `gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate`.
  It added `remaining_accuracy_gap_order_after_ubiq_supported_band_closeout`,
  `ubiq_packaged_finish_ready_surfaces_after_v27`,
  `packaged_finish_current_gate_guard_selected_after_v27`, and
  `rockwool_source_blockers_carry_forward_after_v27`.
  The selected guard promotes existing UBIQ packaged-finish coverage for
  `90 exact` and `21 bound` source-backed open-web rows across engine
  family-design, near-miss, packaged-lane trace, visible card, and
  saved/edit history replay tests. Runtime values, support semantics,
  confidence, evidence, API, route-card values, output-card statuses,
  proposal/report copy, and workbench input behavior stay frozen.
  Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`; generic/raw open-web
  widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`. Validation
  passed on 2026-05-05: focused V27 Gate A 1 file / 5 tests, focused
  UBIQ packaged-finish engine continuity 5 files / 15 tests, focused
  UBIQ packaged-finish visible continuity 4 files / 5 tests, final
  `pnpm calculator:gate:current` with engine 275 files / 1567 tests,
  web 57 files / 268 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Known non-fatal `sharp/@img` warnings remain
  through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was
  restored to `.next-typecheck` after the Next build.
- just landed UBIQ open-web supported-band current-gate guard Gate C closeout:
  `packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_ubiq_open_web_supported_band_current_gate_guard_selected_source_gap_revalidation_v27`.
  It closed `ubiq_open_web_supported_band_current_gate_guard_v1`
  no-runtime and selected `calculator_source_gap_revalidation_v27`
  with target file
  `packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`
  and action
  `gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout`.
  It added `closed_ubiq_supported_band_current_gate_guard_summary`,
  `supported_band_current_gate_pack_carry_forward`,
  `source_gap_revalidation_v27_selected_after_ubiq_supported_band_closeout`,
  and
  `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_closeout`.
  The UBIQ weak-band and supported-band source-backed guard packs remain
  in `pnpm calculator:gate:current`. Rockwool exact runtime remains
  blocked by `rights_safe_source_owned_curve_payload_absent`, and
  generic/raw open-web widening remains blocked until V27 names
  source-owned negative boundaries. Validation passed on 2026-05-05:
  focused supported-band Gate C closeout 1 file / 5 tests, focused UBIQ
  continuity with engine 7 files / 27 tests and web 3 files / 5 tests,
  final `pnpm calculator:gate:current` with engine 274 files / 1562
  tests, web 57 files / 268 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green. Known non-fatal `sharp/@img`
  warnings remain through `@turbodocx/html-to-docx`;
  `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  Next build.
- just landed UBIQ open-web supported-band current-gate guard Gate A:
  `packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`
  landed
  `gate_a_promoted_ubiq_supported_band_exact_and_bound_guards_into_current_gate_selected_closeout`.
  It promoted the source-backed UBIQ FL-24/26/28 supported-band
  current-gate pack:
  `src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`,
  `src/ubiq-open-web-supported-band-finish-completion.test.ts`,
  `src/ubiq-lnw-plus-ci-bound-history-guard.test.ts`,
  `src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`,
  `features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts`,
  and
  `features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`.
  It added `ubiq_supported_band_current_gate_guard_gate_a_summary`,
  `current_gate_promoted_ubiq_supported_band_engine_visible_pack`, and
  `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_gate_a`.
  Protected values include FL-24 bare `Rw 61 / Ln,w 62 / Ln,w+CI 60`,
  FL-26 bare `Rw 60 / Ln,w 62 / Ln,w+CI 61`, FL-28 bare
  `Rw 64 / Ln,w 58 / Ln,w+CI 56`, and FL-28 carpet bound `Rw 64 /
  Ln,w+CI <= 45` with no exact `Ln,w`. Runtime values, source rows,
  support semantics, confidence, evidence, API, route-card values,
  output-card statuses, proposal/report copy, and workbench input
  behavior stayed frozen. Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`. It selected
  `packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  with
  `gate_c_closeout_ubiq_open_web_supported_band_current_gate_guard_and_select_next_accuracy_slice`.
  Validation passed on 2026-05-05: focused supported-band Gate A
  1 file / 5 tests, focused supported-band continuity with engine
  3 files / 7 tests and web 2 files / 3 tests, focused V26 +
  weak-band + supported-band doc continuity 4 files / 20 tests, final
  `pnpm calculator:gate:current` with engine 273 files / 1557 tests,
  web 57 files / 268 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Known non-fatal `sharp/@img` warnings remain
  through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was
  restored to `.next-typecheck` after the Next build.
- just landed UBIQ open-web weak-band current-gate guard Gate C closeout:
  `packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_ubiq_open_web_weak_band_current_gate_guard_selected_supported_band_current_gate_guard`.
  It closed `ubiq_open_web_weak_band_current_gate_guard_v1` no-runtime
  and selected `ubiq_open_web_supported_band_current_gate_guard_v1` with
  target file
  `packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`
  and action
  `gate_a_promote_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate`.
  It added `closed_ubiq_weak_band_current_gate_guard_summary`,
  `weak_band_current_gate_pack_carry_forward`,
  `ubiq_supported_band_source_ready_next`, and
  `rockwool_blockers_still_carry_forward_after_ubiq_weak_band_closeout`.
  The selected next guard protects 36 UBIQ FL-24/26/28 exact
  bare/timber rows and 18 carpet bound rows before any generic open-web
  widening. Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.
- just landed UBIQ open-web weak-band current-gate guard Gate A:
  `packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`
  landed
  `gate_a_promoted_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate_selected_closeout`.
  It promoted the UBIQ FL-23/25/27 weak-band current-gate pack:
  `src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`,
  `src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`,
  `src/ubiq-open-web-weaker-band-posture-guard.test.ts`, and
  `features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`.
  It added `ubiq_weak_band_current_gate_guard_gate_a_summary`,
  `current_gate_promoted_ubiq_weak_band_engine_visible_pack`, and
  `rockwool_source_blockers_carry_forward_after_ubiq_gate_a`. Runtime
  values, source rows, support semantics, confidence, evidence, API,
  route-card values, output-card statuses, proposal/report copy, and
  workbench input behavior stayed frozen. Rockwool exact runtime
  remains blocked by `rights_safe_source_owned_curve_payload_absent`.
  It selected
  `packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  with
  `gate_c_closeout_ubiq_open_web_weak_band_current_gate_guard_and_select_next_accuracy_slice`.
  Validation passed on 2026-05-05: focused UBIQ Gate A 1 file / 5
  tests, focused UBIQ continuity with engine 2 files / 6 tests and web
  1 file / 2 tests, final `pnpm calculator:gate:current` with engine
  268 files / 1540 tests, web 55 files / 265 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, and final
  `git diff --check` green. Known non-fatal `sharp/@img` warnings
  remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts`
  was restored to `.next-typecheck` after the Next build.
- just landed V26 source-gap revalidation Gate A:
  `packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`
  landed
  `selected_ubiq_open_web_weak_band_current_gate_guard_after_v26_rerank_preserved_rockwool_blockers_and_found_source_backed_floor_exact_guard_gap`.
  It selected `ubiq_open_web_weak_band_current_gate_guard_v1` with
  target file
  `packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`
  and action
  `gate_a_promote_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate`.
  It added `remaining_accuracy_gap_order_after_rockwool_closeout`,
  `rockwool_source_blockers_carry_forward_after_v26`, and
  `selected_ubiq_open_web_weak_band_current_gate_guard`. The selected
  guard is source-backed and calculation-relevant: UBIQ FL-23/25/27
  exact lower-board stacks must stay live on published `Rw`, `Ln,w`,
  `Ln,w+CI`, `R'w`, `DnT,w`, `L'n,w`, and `L'nT,w` values, while
  upper-only open-web weak-band stacks must keep impact outputs
  fail-closed. Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`; adjacent Rockwool
  stays supported at `Rw 51 / R'w 49 / DnT,w 51`, flat-list split
  Rockwool stays withheld with diagnostic `Rw 41 / R'w 39 / DnT,w 40`,
  and grouped Rockwool stays `Rw 41` screening-only on
  `multileaf_screening_blend`.
- just landed Rockwool split triple-leaf numeric source closure Gate C:
  `packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_rockwool_split_triple_leaf_numeric_source_closure_selected_source_gap_revalidation_v26`.
  It closed `rockwool_split_triple_leaf_numeric_source_closure_v1` and
  selected `calculator_source_gap_revalidation_v26` with target file
  `packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`
  and action
  `gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout`.
  It carried forward `rockwool_split_numeric_closure_gate_c_summary`,
  `flat_list_split_output_withhold_carry_forward`,
  `adjacent_rockwool_51_49_51_carry_forward`,
  `grouped_rockwool_screening_source_blocker_status`,
  `remaining_accuracy_gap_order_after_rockwool_closeout`, and
  `selected_gate_a_source_gap_revalidation_v26_with_target_file`.
  Protected boundaries: flat-list split/internal gypsum-leaf Rockwool
  still calculates `Rw 41 / R'w 39 / DnT,w 40` but requested wall
  airborne outputs stay out of `supportedTargetOutputs`; adjacent
  Rockwool stays corrected and supported at `Rw 51 / R'w 49 / DnT,w 51`;
  grouped Rockwool stays live screening-only/source-blocked at `Rw 41`,
  not exact and not source-validated. V26 must re-rank remaining
  accuracy/source gaps and select one implementable next slice, not a
  confidence-only or productization pass.
  Validation passed on 2026-05-05: focused Gate C 1 file / 6 tests, and
  final `pnpm calculator:gate:current` with engine 264 files / 1524
  tests, web 54 files / 263 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- just landed Rockwool split triple-leaf numeric source closure Gate B:
  `packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts`
  landed
  `gate_b_withheld_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`.
  Selection status:
  `gate_b_withheld_flat_list_split_internal_leaf_supported_outputs_selected_closeout`.
  It added runtime output-support withholding for flat-list
  split/internal gypsum-leaf Rockwool stacks: the finite diagnostic
  values remain internally visible as `Rw 41 / R'w 39 / DnT,w 40`, but
  requested wall airborne outputs are moved out of `supportedTargetOutputs`
  into `unsupportedTargetOutputs` until grouped topology and a
  source-owned calibrated model exist. Workbench output cards now show
  `Not ready` with explicit grouped-topology/source-owned-model copy for
  the flat-list split stack. Adjacent Rockwool remains corrected and
  supported at `Rw 51 / R'w 49 / DnT,w 51`; grouped Rockwool remains
  screening-only/live with source validation blocked, not exact. Gate B
  selected
  `packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`
  with
  `gate_c_closeout_split_triple_leaf_numeric_source_closure_and_select_next_accuracy_slice`.
  Gate B checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B_HANDOFF.md`.
  Validation passed on 2026-05-05: focused engine Gate B 1 file / 5
  tests, focused web Gate B 1 file / 3 tests, web Rockwool continuity 5
  files / 28 tests, focused Rockwool engine continuity 7 files / 38
  tests, and final `pnpm calculator:gate:current` with engine 263 files
  / 1518 tests, web 54 files / 263 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green. Known non-fatal `sharp/@img`
  warnings remain through `@turbodocx/html-to-docx`;
  `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  Next build. Broad validation after Gate B: lint and typecheck passed,
  engine full suite passed 396 files / 2338 tests, web full suite passed
  on rerun with 166 files / 936 passed + 18 skipped, repo build passed
  5 / 5 tasks, and final `git diff --check` passed. The first
  monolithic `pnpm check` run hit a transient timeout in the long AAC-G5
  web route scan; the isolated rerun and full web-suite rerun passed.
- just landed Rockwool split triple-leaf numeric source closure Gate A:
  `packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`
  landed
  `gate_a_kept_split_internal_leaf_finite_screening_diagnostic_but_rejected_exact_numeric_closure_selected_runtime_withhold_gate_b`.
  Gate action:
  `gate_a_decided_split_internal_leaf_requires_source_owned_topology_before_exact_numeric_closure`.
  It added
  `rockwool_split_internal_leaf_exact_numeric_rejected_without_source_owned_topology`.
  Adjacent Rockwool stays corrected at `Rw 51 / R'w 49 / DnT,w 51`.
  The split/internal gypsum-leaf stack still returns the finite
  screening diagnostic `Rw 41 / R'w 39 / DnT,w 40` through
  `multileaf_screening_blend`, but Gate A rejects treating it as a
  defended physical triple-leaf penalty. NRC 2024, Uris 2006, and
  Ballagh 2013 remain source/model context only; exact closure still
  needs source-owned curves, topology/coupling owner, local Rockwool
  material mapping, metric/tolerance owner, negative boundaries,
  calibration holdout, and paired visible/API tests. Selected next file:
  `packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts`;
  selected next action:
  `gate_b_withhold_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`.
  Validation passed on 2026-05-05: focused Gate A 1 file / 4 tests,
  Rockwool triple-leaf engine continuity 9 files / 49 tests, and final
  `pnpm calculator:gate:current` with engine 262 files / 1513 tests, web
  53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Broad `pnpm check` was not run because Gate A
  made no runtime, shared-schema, API, report/proposal, or visible-output
  behavior movement. Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
  `.next-typecheck` after the Next build.
- just landed calculator source-gap revalidation V25 Gate A:
  `packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`
  landed
  `v25_fixed_adjacent_rockwool_flat_list_numeric_hold_selected_split_internal_leaf_numeric_source_closure`
  with a runtime numeric correction. It added
  `rockwool_adjacent_flat_list_numeric_recovery`: the PDF-like adjacent
  Rockwool stack now stays on the double-leaf numeric lane at `Rw 51`,
  `R'w 49`, and `DnT,w 51` using
  `double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology`
  instead of being pulled down to the prior bad
  `multileaf_screening_blend_fail_closed_until_grouped_topology`
  corridor. It also added
  `rockwool_split_internal_leaf_remains_numeric_open`: the split/internal
  gypsum-leaf stack still returns `Rw 41`, `R'w 39`, and `DnT,w 40` via
  `multileaf_screening_blend`, and that value is not closed as correct.
  Selected next slice:
  `rockwool_split_triple_leaf_numeric_source_closure_v1`; selected next
  file:
  `packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`;
  selected next action:
  `gate_a_decide_split_internal_leaf_numeric_model_or_topology_required_stop`.
- just landed Rockwool triple-leaf support posture Gate A:
  `packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`
  landed
  `gate_a_kept_rockwool_source_required_values_screening_supported_no_runtime_selected_source_gap_revalidation_v25`
  no-runtime and selected `calculator_source_gap_revalidation_v25` with
  target file
  `packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`.
  It added `rockwool_support_semantics_decision`,
  `rockwool_screening_supported_values_not_exact`,
  `rockwool_posture_surface_map`,
  `rockwool_unsupported_without_preview_rejected`, and
  `source_gap_revalidation_v25_selected`. `supportedTargetOutputs`
  stays a finite-screening-metric availability surface, not
  source-backed exactness. Unsupported exact posture is rejected until a
  separate screening-preview value channel exists, because otherwise the
  workbench would hide the useful `Rw 41` diagnostic as `Not ready`.
  Runtime values, support, confidence, evidence, API shape, route-card
  values, output-card status, proposal/report values, visible behavior,
  and workbench-input behavior stayed frozen. Rockwool remains grouped
  `Rw 41` / `STC 41`, flat-list adjacent swap `Rw 42` / `STC 42`, and
  field `R'w 34` / `DnT,w 36`, screening-supported, not exact, not
  source-validated, and not design-grade.
  Validation passed on 2026-05-05: focused Gate A 1 file / 5 tests,
  engine continuity 8 files / 49 tests, web Rockwool/output continuity
  4 files / 29 tests, final `pnpm calculator:gate:current` with engine
  260 files / 1505 tests, web 53 files / 260 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Broad `pnpm check`
  passed with lint and typecheck clean, engine 393 files / 2325 tests,
  web 165 files / 933 passed + 18 skipped, and repo build 5 / 5 tasks.
  Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
  `.next-typecheck` after the Next build.
- just landed Rockwool triple-leaf resolution Gate A:
  `packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`
  landed
  `gate_a_confirmed_rockwool_triple_leaf_source_packet_absent_runtime_diagnostic_selected_support_posture`
  and selected `rockwool_triple_leaf_support_posture_v1` with target
  file
  `packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`.
  It added `rockwool_exact_source_packet_decision`,
  `rockwool_source_required_screening_boundary`,
  `rockwool_flat_list_reorder_boundary`, and
  `rockwool_support_posture_selected`. Exact/source-backed Rockwool
  runtime remains blocked by `rights_safe_source_owned_curve_payload_absent`;
  source acquisition is not repeated without a new packet. Runtime
  values stay grouped `Rw 41`, flat-list `Rw 42`, and field `R'w 34` /
  `DnT,w 36`, but grouped topology now carries the source-required
  runtime warning:
  `Grouped triple-leaf topology is present, but DynEcho still needs a source-calibrated triple-leaf solver, rights-safe source-owned curve payload, local Rockwool/material mapping, metric context owner, tolerance owner, negative boundaries, and paired visible tests before promoting this beyond the screening blend; treat it as source-required screening, not exact or design-grade.`
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  engine continuity 9 files / 55 tests, web Rockwool continuity 2 files
  / 14 tests, split-refactor size pin 1 file / 5 tests after updating
  `dynamic-airborne.ts` from 1829 to 1828 physical lines, final `pnpm
  calculator:gate:current` with engine 259 files / 1500 tests, web 53
  files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Broad `pnpm check` passed after removing one
  unused source-promotion Gate A import: lint and typecheck clean,
  engine 392 files / 2320 tests, web 165 files / 933 passed + 18
  skipped, and repo build 5 / 5 tasks. Known non-fatal `sharp/@img`
  warnings remain through `@turbodocx/html-to-docx`;
  `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  Next build.
- just landed source-promotion owner-set readiness Gate A:
  `packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`
  landed
  `gate_a_locked_source_promotion_owner_set_no_runtime_selected_rockwool_triple_leaf_resolution`
  no-runtime and selected `rockwool_triple_leaf_resolution_v1` with
  target file
  `packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`.
  It added `source_promotion_owner_set_inventory`,
  `ownerless_source_promotion_blocked`,
  `hostile_import_snapshot_not_evidence_carry_forward`, and
  `rockwool_resolution_selected_as_next_accuracy_target`. Runtime
  values, support, confidence, evidence, API shape, route-card values,
  output-card status, proposal/report values, visible behavior, and
  workbench-input behavior stayed frozen. Source-like names, near-source
  aliases, source locators, imported snapshots, finite copied numbers,
  and visible copy cannot promote runtime evidence without source
  provenance, topology owner, material mapping owner, metric context
  owner, tolerance owner, negative boundaries, paired engine tests, and
  paired visible tests. Rockwool remains screening-only: grouped
  `Rw 41`, flat-list `Rw 42`, field `R'w 34` and `DnT,w 36`, not
  exact/source-validated, Uris 2006 still
  `paused_waiting_rights_safe_source_packet`. The next slice must decide
  exact/source-backed runtime if a rights-safe packet and full owner set
  exist, otherwise fail closed or keep the result explicitly
  screening-only.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  engine continuity 7 files / 42 tests, web continuity 2 files / 15
  tests, `pnpm calculator:gate:current` with engine 258 files / 1494
  tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green; final `git diff --check` green
  after restoring `apps/web/next-env.d.ts` to `.next-typecheck`. Broad
  `pnpm check` was not run because Gate A made no runtime, visible,
  shared-schema, API, report/proposal, or workbench-input behavior
  movement.
- just landed calculator source-gap revalidation V24 Gate A:
  `packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`
  landed
  `selected_source_promotion_owner_set_readiness_guard_after_v24_confirmed_rockwool_uris_blocked_and_controlled_use_handoff_closed`
  no-runtime and selected
  `source_promotion_owner_set_readiness_guard_v1` with target file
  `packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`.
  It consumed the controlled-use handoff closeout and added
  `controlled_use_handoff_gate_c_closeout_consumed`,
  `rockwool_uris_exact_runtime_still_blocked_after_controlled_use`,
  `source_promotion_owner_set_guard_selected`,
  `hostile_api_import_and_frequent_combination_green_carry_forward`,
  and `field_outputs_non_design_grade_carry_forward`. Runtime values,
  support, confidence, evidence, API shape, route-card values,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Rockwool remains screening-only: grouped
  `Rw 41`, flat-list `Rw 42`, field `R'w 34` and `DnT,w 36`, not
  exact/source-validated, Uris 2006 still
  `paused_waiting_rights_safe_source_packet`. The next slice must
  require source provenance, topology owner, material mapping owner,
  metric context owner, tolerance owner, negative boundaries, paired
  engine tests, and paired visible tests before any future
  exact/source-backed promotion.
  Validation passed on 2026-05-05: focused V24 Gate A 1 file / 7
  tests, engine continuity 8 files / 47 tests, web visible
  frequent-combination continuity 1 file / 8 tests, `pnpm
  calculator:gate:current` with engine 257 files / 1488 tests, web 53
  files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green; final `git diff --check` green after
  restoring `apps/web/next-env.d.ts` to `.next-typecheck`. Broad
  `pnpm check` was not run because V24 Gate A made no runtime, visible,
  shared-schema, API, report/proposal, or workbench-input behavior
  movement.
- just landed company-internal controlled-use handoff Gate C closeout:
  `packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_company_internal_controlled_use_handoff_no_runtime_and_selected_source_gap_revalidation_v24`
  no-runtime and selected `calculator_source_gap_revalidation_v24`
  with target file
  `packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`.
  It consumed `current_operator_workflow`,
  `current_acceptance_bucket_table`, `ready_values_snapshot`,
  `caveated_blocked_stop_rules`, `validation_command_log`,
  `rockwool_screening_only_notice`, and
  `selected_closeout_or_source_gap_followup`; it added
  `company_internal_controlled_use_handoff_closed`,
  `controlled_use_pack_is_current_operator_handoff`, and
  `calculator_source_gap_revalidation_v24_selected`. Runtime values,
  support, confidence, evidence, API shape, route-card values,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Controlled use remains bounded to the handoff
  envelope and is not a broad high-accuracy opening. V24 must carry
  forward `rockwool_screening_only_not_fixed`,
  `field_outputs_non_design_grade`,
  `source_promotion_owner_set_required`,
  `hostile_api_import_fail_closed`, and
  `frequent_combination_snapshots_stay_green`. Rockwool remains
  screening-only: grouped `Rw 41`, flat-list `Rw 42`, field `R'w 34`
  and `DnT,w 36`, not exact/source-validated, Uris 2006 still
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-05: focused Gate C 1 file / 5 tests,
  continuity 8 files / 43 tests, `pnpm calculator:gate:current` with
  engine 256 files / 1481 tests, web 53 files / 260 passed + 18
  skipped, repo build 5 / 5 tasks, and whitespace guard green; broad
  `pnpm check` with lint/typecheck clean, engine 389 files / 2301
  tests, web 165 files / 933 passed + 18 skipped, repo build 5 / 5
  tasks, and final `git diff --check` green. Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` stayed restored
  to `.next-typecheck`.
- just landed company-internal controlled-use handoff Gate A:
  `packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`
  landed
  `gate_a_prepared_company_internal_controlled_use_handoff_no_runtime_selected_closeout`
  no-runtime and selected
  `packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`.
  It created
  `docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md` and added
  `current_operator_workflow`, `current_acceptance_bucket_table`,
  `ready_values_snapshot`, `caveated_blocked_stop_rules`,
  `validation_command_log`, `rockwool_screening_only_notice`, and
  `selected_closeout_or_source_gap_followup`. Runtime values, support,
  confidence, evidence, API shape, route-card values, output-card
  status, proposal/report values, and workbench-input behavior stayed
  frozen. Ready controlled-use values are pinned as LSF exact `Rw=55`,
  `R'w=48`, building `DnT,w=50`; AAC benchmark `Rw=47`, `R'w=45`,
  building `DnT,w=47`; masonry benchmark `Rw=43`, `R'w=41`, building
  `DnT,w=43`; Pliteq floor `Rw=60`, `Ln,w=58`, `L'n,w=61`,
  `L'nT,w=58.2`; Ubiq bound floor `Rw=62`, `Ln,w=52`, `L'n,w=55`,
  `L'nT,w=52.2`. Direct high-accuracy copy remains forbidden.
  Rockwool remains screening-only: grouped `Rw 41`, flat-list `Rw 42`,
  field `R'w 34` and `DnT,w 36`, not exact/source-validated, Uris 2006
  still `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  continuity 6 files / 33 tests, `pnpm calculator:gate:current` with
  engine 255 files / 1476 tests, web 53 files / 260 passed + 18
  skipped, repo build 5 / 5 tasks, and whitespace guard green. Final
  `git diff --check` passed after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`. Broad `pnpm check` is reserved for the selected
  Gate C closeout or later runtime/user-visible movement.
- just landed company-internal high-accuracy opening rehearsal Gate C closeout:
  `packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_company_internal_high_accuracy_opening_rehearsal_no_runtime_and_selected_controlled_use_handoff`
  no-runtime and selected
  `company_internal_controlled_use_handoff_v1` with target file
  `packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`.
  It consumed `company_internal_opening_acceptance_matrix`,
  `final_validation_evidence_map`,
  `rockwool_screening_and_source_blocker_registry`,
  `source_promotion_no_runtime_boundary_register`,
  `hostile_api_import_fail_closed_evidence`,
  `operator_caveat_and_usage_handoff_pack`, and
  `selected_opening_handoff_or_backlog_followup`; it added
  `company_internal_controlled_use_handoff_selected`. Runtime values,
  support, confidence, evidence, API shape, route-card values,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Direct high-accuracy opening copy remains
  blocked; the next slice must prepare a current controlled-use handoff
  with updated values, Rockwool screening-only language, caveats, and
  stop rules before any use label is refreshed.
  Validation passed on 2026-05-05: focused Gate C 1 file / 5 tests,
  continuity 9 files / 47 tests, `pnpm calculator:gate:current` with
  engine 254 files / 1470 tests, web 53 files / 260 passed + 18
  skipped, repo build 5 / 5 tasks, and whitespace guard green, broad
  `pnpm check` with lint/typecheck clean, engine 387 files / 2290
  tests, web 165 files / 933 passed + 18 skipped, repo build 5 / 5
  tasks, and final `git diff --check` green.
- just landed company-internal high-accuracy opening rehearsal Gate A:
  `packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`
  landed
  `gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout`
  no-runtime and selected
  `packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`.
  It added `company_internal_opening_acceptance_matrix`,
  `final_validation_evidence_map`,
  `rockwool_screening_and_source_blocker_registry`,
  `source_promotion_no_runtime_boundary_register`,
  `hostile_api_import_fail_closed_evidence`,
  `operator_caveat_and_usage_handoff_pack`, and
  `selected_opening_handoff_or_backlog_followup`. Runtime values,
  support, confidence, evidence, API shape, route-card values,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Ready source/benchmark wall/floor corridors
  are pinned to current values; Rockwool triple-leaf, generated and
  screening lanes, field continuations, near-source rows, Uris 2006,
  hostile API/import payloads, many-layer, and reorder edges remain
  caveated, blocked, or fail-closed. High-accuracy opening is not
  allowed by Gate A alone and needs closeout validation evidence first.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  continuity 8 files / 42 tests, `pnpm calculator:gate:current` with
  engine 253 files / 1465 tests, web 53 files / 260 passed + 18 skipped,
  repo build 5 / 5 tasks, and whitespace guard green. Broad `pnpm check`
  passed with lint/typecheck clean, engine 386 files / 2285 tests, web
  165 files / 933 passed + 18 skipped, repo build 5 / 5 tasks. Known
  non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
  `.next-typecheck` after Next rewrote it.
- just landed source-promotion hostile-input readiness Gate C closeout:
  `packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_source_promotion_hostile_input_readiness_guard_no_runtime_and_selected_company_internal_high_accuracy_opening_rehearsal`
  no-runtime and selected
  `company_internal_high_accuracy_opening_rehearsal_v1` with target file
  `packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`.
  It consumed `source_promotion_surface_inventory`,
  `hostile_api_import_fail_closed_surface_inventory`,
  `estimate_json_1e309_rejected_by_finite_layer_schema`,
  `server_import_snapshot_not_runtime_promotion_surface`,
  `near_source_rows_context_only_until_owner_set_exists`,
  `rockwool_gate_c_policy_freeze_carry_forward`, and
  `selected_source_promotion_hostile_closeout_with_target_file`; it
  added `company_internal_high_accuracy_opening_rehearsal_selected`.
  Runtime values, support, confidence, evidence, route-card values,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Estimate / impact-only `1e309` payloads stay
  rejected by finite layer schema before calculation. Rockwool remains
  explicit screening-only, not exact/source-validated: grouped `Rw 41`,
  flat-list `Rw 42`, field `R'w 34`, `DnT,w 36`, Uris 2006
  `paused_waiting_rights_safe_source_packet`. Company-internal
  high-accuracy opening remains blocked until the selected rehearsal
  produces a current acceptance matrix, validation evidence, and green
  current-gate plus broad `pnpm check` evidence.
  Validation passed on 2026-05-05: focused Gate C 1 file / 5 tests,
  engine continuity 7 files / 36 tests, `pnpm calculator:gate:current`
  with engine 252 files / 1459 tests, web 53 files / 260 passed + 18
  skipped, repo build 5 / 5 tasks, and whitespace guard green. Broad
  `pnpm check` passed with lint/typecheck clean, engine 385 files / 2279
  tests, web 165 files / 933 passed + 18 skipped, repo build 5 / 5
  tasks. Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`; final `git diff --check` was green and
  `apps/web/next-env.d.ts` had no final diff.
- just landed source-promotion hostile-input readiness Gate A:
  `packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`
  landed
  `gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout`
  and selected
  `packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`.
  It added `source_promotion_surface_inventory`,
  `hostile_api_import_fail_closed_surface_inventory`,
  `estimate_json_1e309_rejected_by_finite_layer_schema`,
  `server_import_snapshot_not_runtime_promotion_surface`,
  `near_source_rows_context_only_until_owner_set_exists`,
  `rockwool_gate_c_policy_freeze_carry_forward`, and
  `selected_source_promotion_hostile_closeout_with_target_file`.
  Gate A found and fixed a bounded hostile API validation gap:
  JSON `1e309` parses to `Infinity`, so shared layer validation now
  requires `thicknessMm: z.number().finite().positive()` and estimate /
  impact-only routes reject the payload before calculation. Numeric
  calculator runtime values, support, confidence, evidence,
  route-card values, output-card status, proposal/report values, and
  workbench-input behavior stayed frozen. Exact source controls and
  near-source rows remain separated; server import remains snapshot
  persistence only, not runtime promotion. Rockwool remains frozen:
  grouped `Rw 41`, flat-list `Rw 42`, field `R'w 34` and `DnT,w 36`,
  screening-only, not exact/source-validated, Uris 2006 still
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  focused web API validation 1 file / 3 tests, engine continuity 8
  files / 44 tests, `pnpm calculator:gate:current` with engine 251
  files / 1454 tests, web 53 files / 260 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Broad `pnpm check`
  passed after removing a lint-only unused test constant: lint and
  typecheck clean, engine 384 files / 2274 tests, web 165 files / 933
  passed + 18 skipped, repo build 5 / 5 tasks. Known non-fatal
  `sharp/@img` warnings remain through `@turbodocx/html-to-docx`;
  final `git diff --check` was green after `apps/web/next-env.d.ts` was
  restored to `.next-typecheck` after Next build rewrote the route-types
  path.
- just landed Rockwool triple-leaf explicit screening-only policy Gate C:
  `packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_rockwool_triple_leaf_explicit_screening_only_policy_no_runtime_and_selected_source_promotion_hostile_input_readiness_guard`
  no-runtime and selected
  `source_promotion_hostile_input_readiness_guard_v1` with target file
  `packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`.
  It added `rockwool_policy_gate_c_closeout_summary`,
  `rockwool_exact_or_screening_company_criterion_closed`,
  `source_promotion_hostile_input_opening_blockers_carry_forward`,
  `source_promotion_hostile_input_readiness_guard_selected`, and
  `selected_gate_a_source_promotion_hostile_input_readiness_with_target_file`.
  Runtime values, support, confidence, evidence, API behavior,
  route-card values, output-card status, proposal/report values, and
  workbench-input behavior stayed frozen. The Rockwool company-internal
  criterion is closed as explicit screening-only, not exact runtime.
  Grouped split-rockwool remains `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only, not
  exact, and not source-validated. Flat-list adjacent swaps remain
  `Rw 42` fail-closed until grouped topology is supplied. Field `R'w 34`
  and `DnT,w 36` remain continuations from the Rockwool screening lane.
  Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
  Company-internal high-accuracy opening remains blocked by source
  promotion ownership, hostile API/import fail-closed proof, and final
  current-gate plus broad-check evidence at opening handoff.
  Validation passed on 2026-05-05: focused Gate C 1 file / 6 tests,
  engine continuity 6 files / 37 tests, focused web Gate B compatibility
  1 file / 7 tests, final `pnpm calculator:gate:current` with engine
  250 files / 1448 tests, web 53 files / 259 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, and final
  `git diff --check` green after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`. Broad `pnpm check` was not run because Gate C made
  no runtime, API, shared-schema, route/report, or workbench-input
  behavior change. Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed Rockwool triple-leaf explicit screening-only policy Gate B:
  `apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts`
  landed
  `gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy` with
  `gate_b_pinned_visible_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_gate_c_closeout`
  visible-copy only and selected
  `packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts`.
  It added `visible_rockwool_screening_only_policy_guard`,
  `rockwool_output_card_screening_only_copy`,
  `rockwool_proposal_report_screening_only_copy`,
  `rockwool_field_continuation_screening_bridge`,
  `rockwool_non_target_boundary_copy_guard`, and
  `selected_gate_c_closeout_or_next_slice_with_target_file`.
  Runtime values, support, confidence, evidence, API, route-card
  values, output-card status, proposal/report values, and
  workbench-input behavior stayed frozen. Grouped split-rockwool remains
  `Rw 41`, `multileaf_screening_blend`, low confidence, screening-only,
  not exact, and not source-validated, but visible output-card and
  proposal/report copy now names `Rockwool screening-only`. Flat-list
  adjacent swaps remain `Rw 42` and visibly fail closed until grouped
  topology is supplied. Field `R'w 34` and `DnT,w 36` remain
  continuations from the Rockwool screening lane, not independent
  measured field or design-grade results. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-05: focused Gate B 1 file / 7 tests,
  web visible continuity 5 files / 31 tests, engine continuity 5 files
  / 29 tests, final `pnpm calculator:gate:current` with engine 249
  files / 1442 tests, web 53 files / 259 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, broad `pnpm check` with
  lint/typecheck clean, engine 382 files / 2262 tests, web 165 files /
  932 passed + 18 skipped, repo build 5 / 5 tasks, and final
  `git diff --check` green after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`. Known non-fatal `sharp/@img` warnings remain
  through `@turbodocx/html-to-docx`.
- just landed Rockwool triple-leaf explicit screening-only policy Gate A:
  `packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts`
  landed
  `gate_a_inventoried_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_visible_gate_b`
  no-runtime and selected
  `apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts`.
  It added `rockwool_triple_leaf_screening_surface_inventory`,
  `grouped_rw41_and_flat_rw42_runtime_freeze`,
  `visible_route_output_report_policy_gap`,
  `rockwool_visible_gate_b_selected`,
  `source_promotion_hostile_input_carry_forward`, and
  `pre_company_internal_use_exit_criteria`. Runtime values, support,
  confidence, evidence, API, route-card values, output-card status,
  proposal/report values, and workbench-input behavior stayed frozen.
  Grouped split-rockwool remains `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only, not
  exact, and not source-validated. Flat-list adjacent swaps remain
  `Rw 42` on
  `multileaf_screening_blend_fail_closed_until_grouped_topology`. Field
  `R'w 34` and `DnT,w 36` remain continuations from the screening lane,
  not design-grade field results. Gate A selected visible Gate B because
  output-card/report surfaces can still show generic live/screening copy
  without a Rockwool-specific screening-only label. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  engine continuity 5 files / 29 tests, web visible continuity 3 files
  / 16 tests, final `pnpm calculator:gate:current` with engine 249
  files / 1442 tests, web 52 files / 252 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, and final
  `git diff --check` green after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`. Broad `pnpm check` was not run because Gate A made
  no runtime, visible, API, shared-schema, route/report, or
  workbench-input behavior change. Known non-fatal `sharp/@img` warnings
  remain through `@turbodocx/html-to-docx`.
- just landed V23 source-gap revalidation:
  `packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts`
  landed
  `selected_rockwool_triple_leaf_explicit_screening_only_policy_after_v23_confirmed_uris_source_blocked_and_field_output_owner_closed`
  no-runtime and selected
  `rockwool_triple_leaf_explicit_screening_only_policy_v1` with target
  file
  `packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts`.
  It added `field_output_owner_policy_gate_c_closeout_summary`,
  `rockwool_uris_exact_runtime_still_blocked`,
  `rockwool_explicit_screening_only_policy_selected`,
  `source_promotion_and_hostile_input_ownership_carry_forward`,
  `repeat_uris_acquisition_blocked_without_new_packet`, and
  `pre_company_internal_use_exit_criteria`. Runtime values, support,
  confidence, evidence, API, route-card values, output-card status,
  proposal/report values, and workbench-input behavior stayed frozen.
  Direct Rockwool/Uris exact runtime promotion remains blocked by the
  missing rights-safe source-owned curve payload, local material
  mapping, metric context, tolerance owner, source-curve provenance,
  and complete negative-boundary / paired visible tests. Grouped
  split-rockwool remains `Rw 41`, `multileaf_screening_blend`, low
  confidence, screening-only, not exact, and not source-validated. V23
  selected the bounded no-runtime Rockwool explicit screening-only
  policy slice because company-internal opening requires Rockwool to be
  exact or explicitly screening-only before higher-trust private use.
  Validation passed on 2026-05-05: focused V23 1 file / 7 tests,
  engine continuity 6 files / 36 tests, web visible continuity 3 files
  / 16 tests, final `pnpm calculator:gate:current` with engine 248
  files / 1436 tests, web 52 files / 252 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, and final
  `git diff --check` green after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`. Broad `pnpm check` was not run because V23 made no
  runtime, visible, API, shared-schema, route/report, or workbench-input
  behavior change. Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed field-output owner/design-grade policy Gate C:
  `packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts`
  closed `field_output_owner_and_design_grade_policy_v1` no-runtime
  with
  `closed_field_output_owner_design_grade_policy_no_runtime_and_selected_source_gap_revalidation_v23`
  and selected `calculator_source_gap_revalidation_v23`. It added
  `field_output_owner_policy_gate_c_closeout_summary`,
  `field_output_owner_and_design_grade_policy_closed_carry_forward`,
  `rockwool_rw41_screening_and_uris_packet_status`,
  `pre_company_internal_use_exit_criteria`, and
  `selected_source_gap_revalidation_v23_with_target_file_and_validation_scope`.
  Runtime values, support, confidence, evidence, API, route-card,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Field-output owner policy is closed as a
  visibility/honesty boundary, not runtime source evidence; finite
  `R'w`, `DnT,w`, `DnT,A`, `L'n,w`, `L'nT,w`, and `L'nT,50` remain
  non-design-grade until metric/source/geometry/tolerance/
  negative-boundary and paired engine/web/report ownership exists.
  Rockwool triple-leaf remains not fixed: grouped split-rockwool is
  still `Rw 41`, `multileaf_screening_blend`, low confidence,
  screening only, not exact, and not source-validated. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  `pre_company_internal_use_exit_criteria` remains active. The
  field-output criterion is closed, but company-internal high-accuracy
  opening remains blocked by Rockwool exact-or-explicit-screening,
  source-promotion ownership, hostile-input proof, and final validation
  at opening handoff. Validation completed on 2026-05-05: focused Gate C
  1 file / 6 tests, engine continuity 5 files / 30 tests, web
  continuity 7 files / 73 passed + 18 skipped, `pnpm
  calculator:gate:current` with engine 247 files / 1429 tests, web 52
  files / 252 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green, and broad `pnpm check` with lint/typecheck
  clean, engine 380 files / 2249 tests, web 164 files / 925 passed + 18
  skipped, and build 5 / 5 tasks. Final `git diff --check` was green.
  Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed field-output owner/design-grade policy Gate B:
  `apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts`
  landed
  `gate_b_pinned_visible_field_output_design_grade_owner_policy_no_runtime_selected_gate_c_closeout`
  visible-copy only and selected
  `packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts`.
  It added `visible_field_output_design_grade_policy_guard`,
  `output_card_owner_policy_copy`, `proposal_report_owner_policy_copy`,
  `needs_input_field_policy_visible_boundaries`,
  `rockwool_field_output_screening_policy_carry_forward`, and
  `selected_gate_c_closeout_or_next_slice_with_target_file`. Runtime
  values, support, confidence, evidence,
  API, route-card, output-card status, and workbench-input behavior
  stayed frozen. Output-card and proposal/report wording now explicitly
  says no design-grade field owner is active until source basis,
  geometry, tolerance, negative-boundary, and report-test ownership
  close. Rockwool triple-leaf remains not fixed: grouped
  split-rockwool is still `Rw 41`, `multileaf_screening_blend`, low
  confidence, screening only, not exact, and not source-validated.
  Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
  `pre_company_internal_use_exit_criteria` remains active.
  Validation completed on 2026-05-05: focused Gate B 1 file / 6 tests,
  engine continuity 4 files / 24 tests, web continuity 7 files / 73
  passed + 18 skipped, `pnpm calculator:gate:current` with engine 246
  files / 1423 tests, web 52 files / 252 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, and broad `pnpm check`
  with lint/typecheck clean, engine 379 files / 2243 tests, web 164
  files / 925 passed + 18 skipped, and build 5 / 5 tasks. Known
  non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed field-output owner/design-grade policy Gate A:
  `packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts`
  landed
  `gate_a_inventoried_field_output_owner_design_grade_policy_no_runtime_selected_visible_policy_gate_b`
  no-runtime and selected
  `gate_b_pin_visible_field_output_design_grade_owner_policy` at
  `apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts`.
  It added `field_output_owner_design_grade_policy_inventory`,
  `field_metric_owner_matrix`,
  `source_basis_and_tolerance_requirement_matrix`,
  `missing_geometry_and_missing_field_input_negative_boundaries`,
  `rockwool_screening_field_output_carry_forward`, and the visible Gate B
  selection. Runtime values, support, confidence, evidence, API,
  route-card, output-card, proposal/report, and workbench-input
  behavior stayed frozen. Finite `R'w`, `DnT,w`, `DnT,A`, `L'n,w`,
  `L'nT,w`, and `L'nT,50` values remain non-design-grade without
  metric/source/geometry/tolerance/negative-boundary and paired
  engine/web/report ownership. Rockwool triple-leaf remains not fixed:
  grouped split-rockwool is still `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening only, not
  exact, and not source-validated. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  `pre_company_internal_use_exit_criteria` remains active.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  engine continuity 4 files / 24 tests, web continuity 4 files /
  50 passed + 18 skipped, `pnpm calculator:gate:current` with engine
  246 files / 1423 tests, web 51 files / 246 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Broad `pnpm check`
  also passed with lint/typecheck clean, engine full suite 379 files /
  2243 tests, web full suite 163 files / 919 passed + 18 skipped, and
  repo build 5 / 5 tasks.
- just landed V22 source-gap revalidation:
  `packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`
  landed
  `selected_field_output_owner_design_grade_policy_after_v22_confirmed_rockwool_source_blocked_and_company_snapshot_green`
  no-runtime and selected `field_output_owner_and_design_grade_policy_v1`.
  It added `company_internal_gate_c_closeout_summary`,
  `rockwool_rw41_screening_and_uris_packet_status`,
  `repeat_uris_acquisition_blocked_without_new_packet`,
  `field_output_near_source_hostile_input_and_curve_provenance_status`,
  `company_internal_high_accuracy_opening_blocker_status`, and
  `selected_next_slice_with_target_file_and_validation_scope`.
  Runtime values, support, confidence, evidence, API, route-card,
  output-card, proposal/report, and workbench-input behavior stayed
  frozen. Rockwool triple-leaf remains not fixed: grouped
  split-rockwool is still `Rw 41`, `multileaf_screening_blend`, low
  confidence, screening only, not exact, and not source-validated.
  Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
  The next actionable correctness boundary is field-output owner and
  design-grade policy: finite `R'w`, `DnT,w`, `L'n,w`, `L'nT,w`, and
  related outputs must never become design-grade without metric/source/
  tolerance/geometry/visible-test ownership. Selected next plan:
  `docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md`.
  Validation passed on 2026-05-05: focused V22 Gate A 1 file / 7 tests,
  engine continuity 8 files / 52 tests, web continuity 4 files / 22
  tests, and final `pnpm calculator:gate:current` with engine 245 files
  / 1417 tests, web 51 files / 246 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green. Broad `pnpm check` also
  passed after the V22 test typecheck issue was fixed: lint/typecheck
  clean, engine full suite 378 files / 2237 tests, web full suite
  163 files / 919 passed + 18 skipped, and repo build 5 / 5 tasks.
- just landed company-internal frequent-combination Gate C closeout:
  `packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`
  closed `company_internal_frequent_combination_lane_snapshot_guard_v1`
  and selected `calculator_source_gap_revalidation_v22`. It
  landed
  `closed_company_internal_frequent_combination_lane_snapshot_guard_no_runtime_and_selected_source_gap_revalidation_v22`
  no-runtime. It added `company_internal_gate_c_closeout_summary`,
  `rockwool_rw41_screening_and_uris_packet_status`,
  `frequent_combination_guard_green_carry_forward`,
  `field_output_near_source_hostile_input_and_curve_provenance_status`,
  `repeat_uris_acquisition_blocked_without_new_packet`,
  `company_internal_high_accuracy_opening_still_blocked`, and
  `selected_next_slice_with_target_file_and_validation_scope`.
  Runtime values, support, confidence, evidence, API, route-card,
  output-card, proposal/report, and workbench-input behavior stayed
  frozen. Rockwool triple-leaf remains not fixed: grouped
  split-rockwool is still `Rw 41`, `multileaf_screening_blend`, low
  confidence, screening only, not exact, and not source-validated.
  Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-04: focused Gate C 1 file / 6 tests,
  engine continuity 6 files / 38 tests, final
  `pnpm calculator:gate:current` with engine 244 files / 1410 tests,
  web 51 files / 246 passed + 18 skipped, repo build 5 / 5 tasks,
  whitespace guard green, broad `pnpm check` with lint/typecheck clean,
  engine 377 files / 2230 tests, web 163 files / 919 passed + 18
  skipped, build 5 / 5 tasks, and final `git diff --check` green after
  restoring `apps/web/next-env.d.ts` to `.next-typecheck`. Known
  non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed company-internal Gate C checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
  and selected V22 plan:
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md`
- just landed company-internal frequent-combination Gate B:
  `apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`
  landed
  `company_internal_frequent_combination_visible_guard_landed_no_runtime_selected_gate_c_closeout`
  no-runtime. It added
  `company_internal_visible_route_output_snapshot_guard`,
  `rockwool_triple_leaf_visible_screening_not_fixed`,
  `flat_list_swap_visible_fail_closed`,
  `near_source_alias_visible_context_only`,
  `hostile_input_visible_no_numeric_estimate`, and
  `field_outputs_never_design_grade_without_owner`. Runtime values,
  support, confidence, evidence, API, route-card, output-card,
  proposal/report, and workbench-input behavior stayed frozen.
  Rockwool triple-leaf remains not fixed: grouped split-rockwool is
  still `Rw 41`, `multileaf_screening_blend`, low confidence,
  screening only, not exact, and not source-validated. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-04: focused web validation 1 file / 8
  tests, engine continuity 7 files / 50 tests, web continuity 6 files /
  27 tests, final `pnpm calculator:gate:current` with engine 243 files /
  1404 tests, web 51 files / 246 passed + 18 skipped, repo build
  5 / 5 tasks, whitespace guard green, and `git diff --check` green.
- just landed company-internal Gate B checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B_HANDOFF.md`
  and selected Gate C closeout file:
  `packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`
- just landed company-internal frequent-combination Gate A:
  `packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`
  landed
  `company_internal_frequent_combination_snapshot_matrix_landed_no_runtime_selected_visible_gate_b`
  no-runtime. It added
  `company_internal_frequent_combination_snapshot_matrix`,
  `rockwool_triple_leaf_screening_and_flat_swap_negative_rows`,
  `near_source_alias_and_hostile_input_negative_rows`,
  `field_outputs_never_design_grade_without_owner`,
  `standing_lane_misclassification_monitoring_mandate`, and
  `note_test_document_or_easy_fix` posture. Runtime values, support,
  confidence, evidence, API, route-card, output-card, proposal/report,
  and workbench-input behavior stayed frozen.
  Rockwool triple-leaf remains not fixed: grouped split-rockwool is
  still `Rw 41`, `multileaf_screening_blend`, low confidence,
  screening only, not exact, and not source-validated. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-04: focused Gate A 1 file / 8 tests,
  engine continuity 7 files / 50 tests, web continuity 4 files / 15
  tests, and final `pnpm calculator:gate:current` with engine 243 files
  / 1404 tests, web 50 files / 238 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green.
- just landed company-internal Gate A checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A_HANDOFF.md`
  and selected visible Gate B file:
  `apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`
- just landed V21 source-gap revalidation:
  `packages/engine/src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts`
  landed
  `selected_company_internal_frequent_combination_lane_snapshot_guard_after_v21_consumed_field_output_guard_and_kept_rockwool_source_blocked`
  no-runtime. It consumed the field-output visible-basis guard,
  confirmed `Rw 41` remains screening and not exact/source-validated,
  kept Uris 2006 on `paused_waiting_rights_safe_source_packet`, and
  selected
  `packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`
  as the next bounded company-internal lane snapshot guard.
  Validation passed on 2026-05-04: focused V21 1 file / 8 tests,
  engine continuity 5 files / 31 tests, web continuity 3 files / 14
  tests, and final `pnpm calculator:gate:current` with engine 242 files
  / 1396 tests, web 50 files / 238 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green.
- just landed V21 checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A_HANDOFF.md`
  and selected plan:
  `docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md`
- just landed field-output Gate B:
  `apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts`
  strengthened visible output/report copy no-runtime. `R'w`, `DnT,w`,
  `L'n,w`, `L'nT,w`, and related field outputs are now framed as
  continuations from active lab/screening/apparent/bound basis, not
  independent exact field measurements. Runtime values, support,
  confidence, evidence promotion, API shape, route-card values,
  output-card status, and workbench input behavior stayed frozen. Gate B
  selected `calculator_source_gap_revalidation_v21` with
  `gate_b_strengthened_visible_field_output_basis_copy_no_runtime_selected_source_gap_revalidation_with_rockwool_and_misclassification_blockers`.
  Validation completed on 2026-05-04: focused Gate B passed 1 file / 4
  tests; continuity with output-card model, flat-list multileaf guard,
  triple-leaf company-internal rehearsal, and floor field continuation
  passed 4 files / 24 tests; `pnpm calculator:gate:current` passed
  engine 241 files / 1388 tests, web 50 files / 238 passed + 18
  skipped, repo build 5 / 5 tasks, and whitespace guard. A first build
  attempt hit a transient `next-font-manifest.json` artifact miss; the
  immediate web-build rerun and full current-gate rerun passed without
  calculator/runtime changes.
- prior field-output Gate A:
  `gate_a_inventoried_field_output_lab_screening_leakage_no_runtime_selected_visible_wording_guard_gate_b`
  landed at
  `packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts`
  and selected
  `apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts`.
- 2026-05-04 broad validation / UI integration pass:
  user-authored workbench UI changes were validated as navigation and
  layout-only changes around setup/assembly/results/review/proposal,
  command palette, and material picker surfaces. The pass fixed stale
  `partitionAreaM2` engine test-fixture fields and raised the
  full-suite `dynamic-airborne-family-boundary-scan` hold-scan timeout
  to 45 s. Final `pnpm check` passed: lint and typecheck clean; engine
  full suite 373 files / 2204 tests; web full suite 161 files / 907
  passed + 18 skipped; repo build 5 / 5 tasks with known non-fatal
  `sharp/@img` warnings. This does not move the selected calculator
  slice or promote rockwool triple-leaf.
- company-internal high-accuracy opening blocker:
  `company_internal_high_accuracy_opening_blocked_until_misclassification_blockers_close`.
  The old internal-use envelope remains only controlled / caveated pilot
  context. Before the calculator is opened as high-accuracy
  company-internal tooling, treat
  `triple_leaf_like_lane_source_field_errors_are_company_use_blockers`
  as active. `pre_company_internal_use_exit_criteria`: rockwool
  triple-leaf must be exact with source-owned topology/material/metric/
  tolerance/negative-boundary/visible-test ownership or explicitly
  screening-only; field outputs must not look design-grade without a
  field owner; frequent wall/floor lane snapshots must stay green;
  source promotion must require topology, material, metric, tolerance,
  negative-boundary, and paired visible tests; hostile API/import inputs
  must fail closed; `pnpm calculator:gate:current` and `pnpm check`
  must pass. Current next action:
  `gate_a_revalidate_source_gap_order_after_field_output_guard_and_company_internal_blocker`.
- prior selected slice:
  `field_output_lab_screening_leakage_guard_v1`
- prior decision inside the slice:
  `calculator_source_gap_revalidation_v20` Gate A landed
  `selected_field_output_lab_screening_leakage_guard_after_v20_rerank_found_no_source_ready_runtime_candidate_and_uris_packet_absent`
  at
  `packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts`.
  V20 confirmed that Uris 2006 remains blocked by
  `rights_safe_source_owned_curve_payload_absent`, no source-ready
  runtime candidate exists, and the grouped split-rockwool `Rw 41`
  answer remains low-confidence `multileaf_screening_blend`, not fixed
  and not source-validated. The selected planning surface is
  `docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md`.
- prior selected slice:
  `calculator_source_gap_revalidation_v20`
- prior decision inside the slice:
  `wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`
  Gate U landed
  `gate_u_rechecked_uris_2006_rights_safe_source_packet_absent_no_runtime_selected_source_gap_revalidation_v20`
  at
  `packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`.
  Gate U confirmed Uris 2006 identity metadata and authorized access
  paths, but found no rights-safe local source packet, page image,
  numeric table, authorized TDM payload, source-owned curve, or band
  vector.
- prior selected slice:
  `wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`
- prior decision inside the slice:
  `calculator_source_gap_revalidation_v19` Gate A landed
  `selected_uris_2006_rights_safe_source_packet_acquisition_after_v19_rerank_prioritized_unfixed_split_rockwool_and_found_no_runtime_ready_candidate`
  at
  `packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`.
  It selected the Uris 2006 / equivalent rockwool two-cavity
  source-packet acquisition lane as the next no-runtime action because
  the grouped split-rockwool `Rw 41` answer remains unfixed screening
  and no rights-safe packet is available in the repo.
  The selected planning surface is
  `docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md`.
  Runtime remains blocked until source packet, curve/rating derivation,
  local material mapping, grouped topology guard, negative boundaries,
  and paired engine plus web-visible tests all pass.
- prior selected slice:
  `calculator_source_gap_revalidation_v19`
- prior decision inside the slice:
  The just-closed slice is `floor_tolerance_edge_promotion_guard_v1`
  with
  `floor_tolerance_edge_gate_b_closeout_summary` and
  `closed_floor_tolerance_edge_promotion_guard_no_runtime_and_selected_source_gap_revalidation_v19`.
  It carries forward
  `gate_b_exact_bound_edges_remained_protected_no_support_promotion`.
  Gate B lives at
  `packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`
  and selected v19 no-runtime. Gate A already landed
  `floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection`
  at
  `packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`.
  It consumed `calculator_source_gap_revalidation_v18`,
  `common_combination_gate_b_reprobe_summary`,
  `sentinel_guard_green_and_fail_closed_boundary_carry_forward`,
  `post_sentinel_source_ready_runtime_candidate_rerank`,
  `rockwool_uris_2006_source_packet_status`, and
  `floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status`.
  It kept `gate_b_reprobe_findings`,
  `standing_lane_misclassification_monitoring_mandate`,
  `note_test_document_or_easy_fix`,
  `paused_waiting_rights_safe_source_packet`,
  `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  `raw_floor_role_inference`, and
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  active. Gate A produced
  `role_tagged_exact_floor_tolerance_edge_inventory`,
  `bound_floor_near_miss_and_exact_drop_snapshot_matrix`,
  `just_inside_just_outside_thickness_corridor_tests`,
  `raw_role_prompt_and_duplicate_role_negative_boundaries`,
  `visible_exact_bound_screening_support_wording_requirements`, and
  `next_guard_or_closeout_decision_before_any_floor_support_promotion`.
  Gate A did not move runtime, support, confidence, evidence, API,
  route-card, output-card, proposal/report, or workbench-input behavior.
- 2026-05-04 v19 planning refresh:
  `v19_candidate_matrix_must_rank_uris_field_alias_hostile_and_closeout_paths`.
  The next file is still
  `packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`
  and it is intentionally absent until implementation begins. V19 must
  rank the Uris 2006 / equivalent rockwool two-cavity source-packet or
  source-acquisition lane first because it is the highest-impact
  unresolved user defect, but runtime remains blocked unless a
  rights-safe packet provides source-owned band data, rating derivation,
  uncertainty, local material mapping, grouped topology guard, negative
  boundaries, and paired engine plus web-visible tests. It must also
  explicitly evaluate field-output leakage, material alias /
  near-source false promotion, hostile API/import and curve-provenance
  risks, then select exactly one next slice or no-runtime closeout.
- 2026-05-04 planning pass:
  `gate_b_closeout_file_currently_absent_and_next_to_create`.
  Historical note: this pass was consumed by the landed Gate B closeout.
  The selected next file above is now v19 Gate A, not the Gate B
  closeout. Keep `wrong_measurement_triage_loop`,
  `frequent_combination_lane_suspicion_reproduce_trace_document_or_bounded_fix`,
  `external_source_research_deferred_until_source_acquisition_gate_or_source_packet`,
  and
  `exact_promotion_requires_source_topology_material_metric_tolerance_negative_visible_proof`
  active for every following calculator slice. If a frequent
  wall/floor combination appears to switch route family/source lane
  after a small reorder, duplicate-stack edit, material alias, hostile
  input, or tolerance-edge edit, reproduce it in a focused contract,
  compare engine trace and visible copy, then document it or land only a
  bounded easy fix with paired engine and visible tests. Do not open
  internet/source-packet research for the immediate Gate B closeout
  unless a source-acquisition gate is selected or a rights-safe source
  locator/source packet arrives.
- follow-up 2026-05-04 implementation inspection:
  `inspected_floor_exact_bound_implementation_surfaces`,
  `gate_b_contract_blueprint_snapshot_matrix`,
  `exact_bound_screening_visible_surface_parity_check`,
  `contiguous_duplicate_vs_disjoint_duplicate_role_boundary`,
  `current_gate_runner_must_include_gate_b_after_creation`,
  `source_gap_revalidation_v19_candidate_after_floor_closeout`, and
  `no_internet_research_before_gate_b_selects_source_acquisition`.
  Gate B should use `floor-system-evaluation.ts`,
  `floor-system-match.ts`, `bound-floor-system-match.ts`,
  `impact-lane.ts`, `floor-system-ratings.ts`,
  `calculate-assembly.ts`, `impact-result-panel.tsx`, and
  `simple-workbench-evidence.ts` as inspected surfaces. After the
  closeout file is created, add it to
  `tools/dev/run-calculator-current-gate.ts`; otherwise the selected
  active closeout can be absent from the current-gate runner.
- second follow-up 2026-05-04 preflight:
  `gate_b_preflight_exact_bound_fixture_map`,
  `gate_b_plus_2mm_inside_plus_2p1mm_outside_boundary`,
  `direct_floor_system_id_bypass_is_not_layer_match_promotion`,
  `field_context_warning_copy_not_field_metric_promotion`,
  `gate_b_validation_order_engine_contract_then_runner_then_current_gate`,
  and
  `web_visible_changes_deferred_until_gate_b_selects_bounded_fix`.
  Gate B should start from `tuas_x3_clt140_measured_2026` exact
  `base_structure` and `ubiq_fl33_open_web_steel_300_lab_2026`
  bound-only `base_structure`: `+2 mm` stays inside tolerance, `+2.1 mm`
  must drop out of the exact/bound source lane. Keep raw
  `tuas_x4_clt140_measured_2026` and raw
  `tuas_r7b_open_box_timber_measured_2026` as prompt/duplicate-role
  negative controls. Treat direct `officialFloorSystemId` resolution as
  a known-id bypass, not layer-match proof; treat field-context warnings
  as visible-copy evidence, not new field source ownership.
- latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A_HANDOFF.md`
  lands `floor_tolerance_edge_promotion_guard_v1` Gate A no-runtime
  with
  `floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection`.
  It pins exact/bound floor tolerance-edge behavior, raw-role and
  duplicate-role negative boundaries, hostile API/import fail-closed
  behavior, and visible support wording requirements, then selects
  `packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`
  with `gate_b_no_runtime_closeout_and_next_slice_selection`.
  Validation completed on 2026-05-04: focused Gate A 1 file / 7
  tests, continuity with v18 / common-combination Gate C / Gate B /
  Gate A / floor raw-role Gate C / route-family lane-drift Gate E /
  Gate F / route-source risk register 9 files / 64 tests, `pnpm
  calculator:gate:current` engine 235 files / 1349 tests, web 49 files
  / 234 passed + 18 skipped, repo build 5 / 5 successful with known
  non-fatal `sharp/@img` warnings, `apps/web/next-env.d.ts` restored
  to `.next-typecheck`, and final `git diff --check` passed.
- latest general revalidation:
  a 2026-05-04 broad `pnpm check` pass caught non-runtime strictness
  drift before commit: several new contract callbacks needed explicit
  `warning: string` annotations, the triple-leaf frequency solver needed
  nullish defaults for already-required grouped topology fields, and
  `dynamic-airborne-order-sensitivity` still expected the old unsafe
  double-leaf promotion for lightweight flat-list triple-leaf swaps.
  The current correct behavior is low-confidence
  `multileaf_screening_blend_fail_closed_until_grouped_topology` with a
  flat-list adjacent-swap guard warning until grouped topology and
  source validation exist.
- follow-up broad audit:
  `broad_check_2026_05_04_toolbar_copy_alignment_passed`,
  `full_check_found_toolbar_copy_test_drift_not_calculator_runtime_drift`,
  `wrong_lane_broad_suites_green_no_runtime_movement_selected`,
  `gate_b_closeout_remains_first_implementation_step_after_broad_check`,
  and `rockwool_uris_status_unchanged_after_broad_check`.
  Full `pnpm check` passed after updating the toolbar test to current
  commands `Report` and `PDF setup` while confirming `Example Stack`
  is absent; this was UI-copy drift, not
  calculator runtime drift. Engine passed 368 files / 2170 tests; web
  passed 161 files / 907 passed + 18 skipped; build passed 5 / 5 with
  known non-fatal `sharp/@img` warnings. Wrong-lane suites remained
  green across dynamic family-boundary scans, deep hybrid and AAC swap
  scans, floor order/duplicate/many-layer histories, raw floor role and
  hostile-input guards, wall flat-list multileaf guards, grouped-topology
  route cards, and wall reorder invariance. Historical note: this audit
  happened before Gate B existed. Gate B has since landed no-runtime and
  selected v19. Rockwool/Uris `Rw 41` remains unfixed screening output.
- follow-up planning cross-check:
  `gate_b_implementation_cross_check_passed`,
  `gate_b_file_absent_runner_absent_by_design_until_creation`,
  `gate_a_fixture_ids_verified_in_catalog_and_existing_tests`,
  `packed_same_role_merge_safe_but_split_single_entry_schedules_blocked`,
  `official_floor_system_id_bypass_must_not_seed_layer_match_proof`,
  `gate_b_no_external_research_needed_until_source_acquisition_selected`,
  `gate_b_next_steps_order_contract_runner_current_gate_then_rerank`,
  and `targeted_gate_a_v18_risk_register_validation_green`.
  Historical note: this cross-check is now consumed by the landed Gate
  B closeout. Gate A fixture ids exist in the catalogs and already pin
  `+2 mm` / `+2.1 mm` exact and bound behavior. Keep packed same-role
  equivalents separate from split or disjoint duplicate schedules; keep
  direct `officialFloorSystemId` lookup as a known-row bypass, not
  layer-match proof. No internet/source research is selected before v19
  chooses source acquisition or a rights-safe packet appears. Targeted
  planning validation passed 3 files / 21 tests plus `git diff --check`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v18` Gate A no-runtime with
  `selected_floor_tolerance_edge_promotion_guard_after_v18_rerank_found_no_source_ready_runtime_candidate_and_common_combination_sentinel_closed`.
  It consumes `common_combination_gate_b_reprobe_summary`,
  `sentinel_guard_green_and_fail_closed_boundary_carry_forward`,
  `post_sentinel_source_ready_runtime_candidate_rerank`,
  `rockwool_uris_2006_source_packet_status`, and
  `floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status`.
  It selects `floor_tolerance_edge_promotion_guard_v1` and
  `packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`
  with `gate_a_inventory_exact_floor_tolerance_edges_no_runtime`.
  Validation completed on 2026-05-04: focused v18 Gate A 1 file / 9
  tests, continuity with common-combination Gate C / Gate B / Gate A /
  v17 / floor raw-role Gate C / route-family lane-drift Gate E / Gate
  F / route-source risk register 9 files / 67 tests, `pnpm
  calculator:gate:current` engine 234 files / 1342 tests, web 49 files
  / 234 passed + 18 skipped, repo build 5 / 5 successful with known
  non-fatal `sharp/@img` warnings, `apps/web/next-env.d.ts` restored
  to `.next-typecheck`, and final `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md`
  closes `common_combination_lane_misclassification_sentinel_v1`
  no-runtime with
  `closed_common_combination_lane_misclassification_sentinel_no_runtime_and_selected_source_gap_revalidation_v18`.
  It selects `calculator_source_gap_revalidation_v18` and
  `packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout`.
  Validation completed on 2026-05-04: focused Gate C closeout 1 file /
  6 tests, continuity with Gate A / Gate B / v17 / floor raw-role Gate
  C / route-family lane-drift Gate E / Gate F / route-source risk
  register 8 files / 58 tests, `pnpm calculator:gate:current` engine
  233 files / 1333 tests, web 49 files / 234 passed + 18 skipped, repo
  build 5 / 5 successful with known non-fatal `sharp/@img` warnings,
  `apps/web/next-env.d.ts` restored to `.next-typecheck`, and final
  `git diff --check` passed.
- just closed slice:
  `common_combination_lane_misclassification_sentinel_v1`.
  Gate C closed it no-runtime and selected
  `calculator_source_gap_revalidation_v18` with
  `packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`.
  Gate B already landed
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`
  with
  `gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`
  and
  `common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice`.
  It produced `gate_b_reprobe_findings` for
  `split_rockwool_grouped_rw41_blocked_source_packet`,
  `split_rockwool_flat_swap_fail_closed_guard_green`,
  `classic_framed_adjacent_swap_fail_closed_guard_green`,
  `aac_board_fill_gap_lined_massive_boundary_documented_fail_closed`,
  `duplicate_many_layer_classic_stack_finite_watch`,
  `raw_floor_open_box_parity_green`,
  `raw_floor_clt_role_prompt_guard_green`,
  `near_source_alias_context_only_watch`,
  `field_output_copy_leakage_watch`,
  `hostile_api_import_fail_closed_green`, and
  `curve_digitization_provenance_blocked_source_qc`. It made no runtime,
  source, value, support, confidence, evidence, API, route-card,
  output-card, proposal/report, or workbench-input movement.
  Gate A already landed
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`
  with
  `common_combination_lane_sentinel_inventory_landed_no_runtime_selected_gate_b_reprobes`.
  It produced `frequent_wall_floor_combination_inventory`,
  `route_family_source_lane_support_confidence_output_warning_snapshot_matrix`,
  `small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants`,
  `note_test_document_or_easy_fix_decision_log`,
  `paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement`,
  and `next_closeout_or_bounded_easy_fix_decision`. Gate C keeps
  Gate B's findings active for v18; any later runtime move still needs
  a small bounded fix or source-ready row with paired engine and
  web-visible regression tests. It must keep
  `frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk`,
  `easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests`,
  `paused_waiting_rights_safe_source_packet`,
  `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  and `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  active.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md`
  lands the common-combination sentinel Gate B no-runtime reprobes. It
  confirms grouped split-rockwool remains low-confidence
  `multileaf_screening_blend`, `Rw 41`, not source validated, and still
  blocked by `paused_waiting_rights_safe_source_packet`; split-rockwool
  and classic framed flat-list swaps are guard-green under
  `multileaf_screening_blend_fail_closed_until_grouped_topology`;
  AAC / board / fill / gap lined-massive boundary drift remains
  documented fail-closed risk; raw floor parity/prompt, near-source
  alias, field-output leakage, hostile input, and curve provenance
  remain sentinel rows. It selects
  `packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts`
  with
  `gate_c_closeout_and_next_slice_selection_after_gate_b_reprobes_no_runtime`.
  Validation completed on 2026-05-04: focused Gate B 1 file / 9 tests,
  continuity with Gate A / v17 / floor raw-role Gate C / route-family
  lane-drift Gate E / Gate F / route-source risk register 7 files / 52
  tests, `pnpm calculator:gate:current` engine 232 files / 1327 tests,
  web 49 files / 234 passed + 18 skipped, repo build 5 / 5 successful
  with known non-fatal `sharp/@img` warnings, `apps/web/next-env.d.ts`
  restored to `.next-typecheck`, and final `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md`
  lands the common-combination sentinel Gate A no-runtime inventory.
  It pins frequent wall/floor wrong-lane snapshots, confirms grouped
  split-rockwool remains low-confidence `multileaf_screening_blend`,
  `Rw 41` and not source validated, keeps hostile inputs fail-closed,
  carries `raw_floor_role_inference`, and selects
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`
  with
  `gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`.
  Validation completed on 2026-05-04: focused Gate A 1 file / 8 tests,
  continuity 6 files / 43 tests, `pnpm calculator:gate:current` engine
  231 files / 1318 tests, web 49 files / 234 passed + 18 skipped, repo
  build 5 / 5 successful with known non-fatal `sharp/@img` warnings,
  `apps/web/next-env.d.ts` restored to `.next-typecheck`, and final
  `git diff --check` passed.
- latest source-gap checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v17` Gate A with
  `selected_common_combination_lane_misclassification_sentinel_after_v17_rerank_found_no_source_ready_runtime_candidate_and_user_reinforced_always_on_wrong_lane_monitoring`.
  It selects
  `common_combination_lane_misclassification_sentinel_v1` and
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`.
  This gate does not move runtime, support, confidence, evidence, API,
  route-card, output-card, proposal/report, or workbench-input behavior.
  Validation completed on 2026-05-03: focused v17 Gate A 1 file / 10
  tests, continuity with floor raw-role Gate C / Gate B / Gate A, v16,
  lane-drift Gate E / Gate F, and the route-source risk register 8
  files / 59 tests, `pnpm calculator:gate:current` engine 230 files /
  1310 tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed. `apps/web/next-env.d.ts` was restored to
  `.next-typecheck`.
- paused user-defect slice:
  `wall_triple_leaf_accuracy_recovery_v1` is paused at Gate T on
  `paused_waiting_rights_safe_source_packet`. Do not present the
  split-rockwool `Rw 41` screening answer as fixed, correct, or
  source-validated.
- focused user-defect handoff:
  `docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md`
  explains the rockwool placement / flat-list ambiguity symptom, why it
  is a real triple-leaf modeling/input defect rather than simple user
  error, why the current `Rw 41` screening answer must not be presented
  as fixed/correct, why the Uris 2006 lane is paused at Gate T, and
  what source/mapping/topology/test owners must still prove before any
  runtime movement.
- active adjacent-risk register:
  `docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md`
  tracks flat-list route-family flips, duplicate/many-layer drift,
  masonry / lined-massive boundary drift, raw floor role inference,
  near-source false promotion, field-output leakage, material
  alias/coalescing, hostile API input, and curve provenance. Gate P and
  later runtime-promotion work must keep these risks fail-closed or
  explicitly tested.
- standing route/source-lane monitoring mandate:
  `standing_lane_misclassification_monitoring_mandate`.
  Every future calculator slice must keep looking for wrong route-family
  or source-lane behavior on frequent wall/floor stacks. If a stack
  drops into the wrong lane, jumps after a small layer edit, promotes a
  near-source row as exact, leaks field metrics, or returns an absurd
  value, use `note_test_document_or_easy_fix`: reproduce it with a
  focused test, fix it when the fix is bounded, or document it and keep
  output fail-closed.
- prior source-gap decision:
  `packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts`
  ran
  `gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing`
  after Gate C landed
  `floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17`.
  Gate C keeps role-tagged exact floors as the promoted path, keeps
  raw-parity green controls bounded with visible copy that
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`,
  and now surfaces
  `raw_tagged_drift_requires_floor_role_prompt`,
  `raw_no_safe_inference_requires_floor_role_prompt`, and
  `duplicate_single_entry_role_requires_floor_role_prompt` before exact
  floor-family promotion. Gate C proved
  `paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement`.
  `raw_floor_role_inference` stays guarded, and
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  remains an active boundary for source-gap revalidation v17.
- latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C_HANDOFF.md`
  lands `floor_raw_role_inference_guardrail_v1` Gate C with
  `floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17`.
  It closes the prior Gate B selection action
  `gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests`.
  It adds
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts`
  and
  `apps/web/features/workbench/floor-raw-role-prompt-guard-route-card.test.ts`,
  keeps runtime import/support/confidence/evidence/API/output support/
  proposal/workbench-input behavior frozen while moving bounded
  route/output warning copy,
  confirms Uris 2006 remains `paused_waiting_rights_safe_source_packet`,
  keeps the Gate E guard
  `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  keeps `standing_lane_misclassification_monitoring_mandate` and
  `note_test_document_or_easy_fix` active, and
  selects
  `packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing`.
  Required floor boundary:
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`.
  Prompt boundaries:
  `raw_tagged_drift_requires_floor_role_prompt`,
  `raw_no_safe_inference_requires_floor_role_prompt`,
  `duplicate_single_entry_role_requires_floor_role_prompt`, and
  `paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement`.
  Gate C validation completed on 2026-05-03: focused Gate C engine 1
  file / 9 tests, focused Gate C web 1 file / 4 tests, engine
  continuity 7 files / 30 tests, web continuity 4 files / 7 tests,
  Dataholz CLT / lane-drift raw-tagged warning regression continuity 3
  files / 24 tests, `pnpm calculator:gate:current` engine 229 files /
  1300 tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed. `apps/web/next-env.d.ts` was restored to
  `.next-typecheck`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B_HANDOFF.md`
  lands `floor_raw_role_inference_guardrail_v1` Gate B with
  `floor_raw_role_inference_prompt_guard_design_landed_no_runtime_selected_gate_c_implementation`.
  It adds
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts`
  and closes
  `gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A_HANDOFF.md`
  lands `floor_raw_role_inference_guardrail_v1` Gate A with
  `floor_raw_role_inference_inventory_landed_no_runtime_selected_gate_b_prompt_guard_design`.
  It adds
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`.
  It selects
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts`
  with
  `gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime`.
  Gate A validation completed on 2026-05-03: focused floor raw-role Gate
  A 1 file / 7 tests; continuity with v16 Gate A, floor-library raw
  parity, raw-floor inferred split parity, floor order invariance/edit
  stability, raw-floor hostile input, and route-source risk register 8
  files / 39 tests; `pnpm calculator:gate:current` engine 227 files /
  1284 tests, web 48 files / 230 passed + 18 skipped, repo build 5 / 5
  passed with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed; `apps/web/next-env.d.ts` restored to `.next-typecheck`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v16` with
  `selected_floor_raw_role_inference_guardrail_after_v16_rerank_found_no_source_ready_runtime_candidate_and_prioritized_floor_side_wrong_lane_risk`.
  It adds
  `packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`
  and selects `floor_raw_role_inference_guardrail_v1`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md`
  closes `route_family_lane_drift_common_stack_watchlist_v1` with
  `closed_route_family_lane_drift_common_stack_watchlist_after_gate_e_guard_landed_and_selected_source_gap_revalidation_v16`.
  It adds
  `packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts`,
  keeps the Gate E guard
  `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  confirms no runtime import/support/confidence/evidence/API/output
  support/proposal/workbench-input promotion, keeps the original
  rockwool triple-leaf exact calculation blocked on
  `paused_waiting_rights_safe_source_packet`, and selects
  `calculator_source_gap_revalidation_v16` with
  `packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`.
  Gate F is the closeout selected by Gate E:
  `packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts`
  with
  `gate_f_closeout_and_next_slice_selection_after_flat_list_guard_runtime_landing`
  after Gate E status
  `common_stack_lane_drift_flat_list_guard_runtime_landed_selected_gate_f_closeout_next_slice`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md`
  lands `route_family_lane_drift_common_stack_watchlist_v1` Gate E with
  bounded runtime movement. It adds
  `packages/engine/src/dynamic-airborne-flat-list-multileaf-guard.ts`,
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts`,
  and
  `apps/web/features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts`.
  The guard keeps ambiguous swapped flat-list multileaf walls on
  low-confidence `multileaf_multicavity`
  `multileaf_screening_blend_fail_closed_until_grouped_topology` rather
  than overconfident `double_leaf`. Positive proofs include
  `engine_split_rockwool_swapped_flat_list_holds_multileaf_fail_closed`
  and `engine_classic_swapped_flat_list_holds_multileaf_fail_closed`.
  Visible proofs include
  `web_route_card_shows_fail_closed_multileaf_screening_not_exact` and
  `web_output_card_does_not_promote_rw_prime_or_dntw_as_exact`.
  Negative boundaries still include `ordinary_double_leaf_negative_boundary`
  and `lined_massive_boundary_hold_negative_boundary`. Runtime moved
  only for the guarded wrong-lane flat-list cases; source/evidence/
  confidence/API/workbench-input promotion did not move. The standing
  `standing_lane_misclassification_monitoring_mandate` and
  `note_test_document_or_easy_fix` rule stay active.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D_HANDOFF.md`
  lands `route_family_lane_drift_common_stack_watchlist_v1` Gate D
  no-runtime. It adds
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts`,
  designs `flat_list_adjacent_swap_sensitivity_probe`, keeps the future
  target fail-closed on
  `multileaf_screening_blend_fail_closed_until_grouped_topology`, proves
  `ordinary_double_leaf_negative_boundary`,
  `lined_massive_boundary_hold_negative_boundary`,
  `paired_engine_and_web_visible_tests_before_runtime`, plus simple
  stud / grouped topology / duplicate / floor / near-source /
  field-output boundaries, keeps
  runtime and visible behavior frozen, and selects
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts`
  with
  `gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries`
  and
  `common_stack_lane_drift_flat_list_guard_design_landed_no_runtime_selected_gate_e_implementation`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C_HANDOFF.md`
  lands `route_family_lane_drift_common_stack_watchlist_v1` Gate C
  no-runtime. It adds
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`,
  classifies `split_rockwool_flat_swap_3_4_wrong_lane_reproduced` and
  `ordinary_classic_triple_leaf_swap_wrong_lane_reproduced` as
  `bounded_fix_candidate`, classifies
  `heavy_multileaf_lined_massive_boundary_reproduced` as
  `negative_boundary_for_fix`, keeps duplicate/many-layer, raw floor,
  near-source alias, field-output, hostile-input, and curve provenance
  findings no-runtime, and selects
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts`
  with
  `gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime`
  and
  `common_stack_lane_drift_classification_landed_no_runtime_selected_gate_d_flat_list_family_guard_design`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B_HANDOFF.md`
  lands `route_family_lane_drift_common_stack_watchlist_v1` Gate B
  no-runtime. It adds
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`,
  reproduces the split-rockwool flat-list wrong-lane jump
  `split_rockwool_flat_swap_3_4_wrong_lane_reproduced` (`Rw 41`
  low-confidence `multileaf_screening_blend` -> `Rw 51`
  medium-confidence `double_leaf`), the ordinary framed-wall jump
  `ordinary_classic_triple_leaf_swap_wrong_lane_reproduced` (`Rw 32`
  -> `Rw 44`), and the masonry / lined-massive boundary jump
  `heavy_multileaf_lined_massive_boundary_reproduced` (`Rw 39` ->
  `Rw 49`). Duplicate stacks remain finite but watchlisted; known raw
  floor role inference stays green; near-source gypsum alias, field
  output, hostile input, and curve provenance risks remain no-runtime.
  Runtime and visible surfaces remain frozen. It selects
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`
  with
  `gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime`
  and
  `common_stack_lane_drift_reprobes_landed_no_runtime_selected_gate_c_classification`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A_HANDOFF.md`
  lands `route_family_lane_drift_common_stack_watchlist_v1` Gate A
  no-runtime. It adds
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`,
  inventories nine common route/source-lane risk classes, pins live
  snapshots for split-rockwool `Rw 41` `multileaf_screening_blend`,
  classic triple-leaf to double-leaf reorder (`Rw 32` -> `Rw 44`),
  heavy multileaf to lined-massive boundary (`Rw 39` -> `Rw 49`), raw
  floor role parity, and hostile input fail-closed behavior. Runtime and
  visible surfaces remain frozen. It selects
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`
  with
  `gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime`
  and
  `common_stack_lane_drift_inventory_landed_no_runtime_selected_gate_b_reprobes`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v15` Gate A no-runtime. It
  adds
  `packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`,
  keeps every source/runtime candidate fail-closed, keeps the Uris 2006
  source lane paused on `paused_waiting_rights_safe_source_packet`,
  keeps the split-rockwool `Rw 41` `multileaf_screening_blend` answer
  not fixed, creates the
  `standing_lane_misclassification_monitoring_mandate`, and selects
  `route_family_lane_drift_common_stack_watchlist_v1` with
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`
  and
  `gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime`.
  Gate A status:
  `selected_route_family_lane_drift_common_stack_watchlist_after_v15_rerank_found_no_runtime_ready_source_candidate_and_user_prioritized_rockwool_like_lane_errors`.
  Selected planning surface:
  `docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  lands `certainteed_silentfx_nrc_astc_source_pack_extraction_v1` Gate
  C no-runtime closeout. It adds
  `packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  keeps
  `NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018`,
  `CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE`, and
  `CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE`
  context-only because ASTC / field / flanking metric policy, product
  `STC` -> `Rw` policy, rights-safe OneSource payload, SilentFX /
  Type X material mapping, tolerance ownership, exact live topology,
  and paired visible tests remain missing. It keeps the split-rockwool
  `Rw 41` `multileaf_screening_blend` answer not fixed, keeps every
  runtime and visible surface frozen, closes the source pack
  no-runtime, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout`.
  Gate C status:
  `closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row`.
  Selected v15 slice:
  `calculator_source_gap_revalidation_v15`.
  Selected v15 planning surface:
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md`.
  Prior Gate C file:
  `packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`.
  Gate B status:
  `certainteed_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Gate B action:
  `gate_b_mapping_tolerance_decision_no_runtime`.
  Prior Gate A file:
  `packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`.
  Prior Gate A status:
  `certainteed_silentfx_nrc_astc_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Gate A status:
  `certainteed_silentfx_nrc_astc_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Gate A action:
  `gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import`.
  Source label:
  CertainTeed SilentFX NRC ASTC.
  Selected planning surface:
  `docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md`.
  Source locators:
  `https://publications-cnrc.canada.ca/eng/view/object/?id=f308069f-1b20-4aac-bc6d-e7b174ff21bb`,
  `https://ctonesource.certainteed.com/Products/PDF/CTG-2481.pdf`,
  `https://www.certainteed.com/acoustic-gypsum-board`, and
  `https://www.certainteed.com/products/drywall-products/silentfx-quickcut-drywall`.
  Protected boundaries:
  `certainteed_nrc_astc_high_rise_examples_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `certainteed_ctg_2481_u465_stc57_product_row_does_not_replace_existing_lsf_or_generic_gypsum_routes`,
  `certainteed_ctg_2481_u309_stc51_product_row_does_not_promote_dyn_echo_rw_or_field_outputs`,
  `certainteed_silentfx_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_or_dntw`,
  `certainteed_silentfx_product_stc_examples_do_not_promote_runtime_without_metric_topology_tolerance_and_visible_tests`,
  `silentfx_and_generic_gypsum_or_quietrock_do_not_coalesce_without_material_mapping_tolerance_owner`,
  `certainteed_context_does_not_fix_uris_2006_split_rockwool_rw_41_screening_result`,
  `certainteed_ctg_2481_onesource_login_redirect_blocks_current_product_pdf_payload_runtime_claim`,
  and
  `certainteed_astc_and_stc_context_does_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_or_knauf_rows`.
  Gate B protected boundaries:
  `certainteed_gate_b_source_rows_are_not_runtime_import_approval`,
  `certainteed_gate_b_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs`,
  `certainteed_gate_b_product_stc_values_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `certainteed_gate_b_silentfx_typex_certainteed_typex_generic_gypsum_quietrock_and_pabco_type_x_do_not_coalesce_without_mapping_tolerance`,
  `certainteed_gate_b_onesource_login_redirect_blocks_runtime_import_and_confidence_promotion`,
  `certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`,
  `certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  `certainteed_astc_rows_do_not_promote_lab_rw_dntw_or_field_output_routes`,
  `certainteed_product_stc_rows_do_not_replace_existing_lsf_anchors`,
  `certainteed_silentfx_and_type_x_rows_do_not_promote_generic_gypsum_or_quietrock_aliases`,
  and
  `certainteed_onesource_login_locator_rows_do_not_promote_runtime_truth_without_payload`.
  Material alias tokens:
  `silentfx_quickcut_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner`,
  `certainteed_type_x_does_not_coalesce_with_pabco_type_x_quietrock_type_c_or_generic_gypsum_without_row_policy`,
  `certainteed_product_stc_ul_u465_u309_rows_need_full_payload_before_exact_lsf_or_generic_wall_mapping`,
  `nrc_astc_25_gauge_steel_stud_high_rise_examples_do_not_replace_existing_lsf_lab_anchors`,
  `astc_field_flanking_context_does_not_coalesce_with_lab_rw_or_dntw_outputs`,
  and
  `silentfx_context_does_not_coalesce_with_local_mlv_or_uris_2006_triple_leaf_route`.
  Prior v14 planning surface:
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md`.
  Prior v14 slice:
  `calculator_source_gap_revalidation_v14`.
  Prior v14 file:
  `packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts`.
  Prior v14 status:
  `selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import`.
  Prior PABCO Gate C status:
  `closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands CertainTeed Gate A no-runtime and selects Gate B mapping /
  tolerance decision.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands `pabco_quietrock_sound_design_guide_source_pack_extraction_v1`
  Gate B no-runtime. It adds
  `packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts`,
  keeps all six PABCO / QuietRock rows context-only, blocks `STC`,
  report locators, field outputs, material aliases, family-boundary
  flips, and tolerance claims from runtime promotion, keeps the
  split-rockwool `Rw 41` `multileaf_screening_blend` answer not fixed,
  keeps every runtime and visible surface frozen, and selects
  `packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Gate B status:
  `pabco_gate_b_found_no_runtime_ready_row_selected_closeout`.
  PABCO Gate B row boundaries:
  `pabco_pgd_w_646_16_gate_b_stc41_does_not_replace_existing_timber_or_generic_wood_stud_routes`,
  `pabco_pgd_w_445_16_gate_b_resilient_channel_stc57_does_not_promote_dyn_echo_rw_or_generic_resilient_bar`,
  `pabco_pgd_w_449_24_gate_b_indexed_locator_missing_payload_blocks_runtime_and_confidence_promotion`,
  `pabco_pgd_68_534_16_gate_b_68mil_steel_resilient_channel_row_does_not_replace_lsf_anchors`,
  `pabco_pgd_546_407_16_gate_b_stc60_does_not_promote_field_outputs_or_existing_lsf_anchors`,
  and
  `pabco_pgd_w6_467_24_gate_b_quietrock_530_row_does_not_promote_generic_wood_stud_route`.
  PABCO Gate B protected boundaries:
  `pabco_gate_b_source_rows_are_not_runtime_import_approval`,
  `pabco_gate_b_stc_values_and_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `pabco_gate_b_quietrock_es_530_pabco_type_x_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`,
  `pabco_gate_b_glass_fiber_does_not_coalesce_with_local_rockwool_or_fix_uris_2006`,
  `pabco_gate_b_resilient_channel_stud_depth_spacing_gauge_and_bearing_do_not_promote_generic_routes`,
  `pabco_gate_b_pgd_w_449_24_indexed_payload_missing_blocks_runtime_import`,
  `pabco_gate_b_rows_do_not_override_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`,
  `pabco_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  `pabco_wood_stud_quietrock_rows_do_not_replace_existing_timber_or_generic_wood_stud_routes`,
  `pabco_steel_stud_quietrock_rows_do_not_replace_existing_lsf_anchors`,
  `pabco_resilient_channel_rows_do_not_promote_generic_resilient_bar_routes`,
  `pabco_quietrock_multilayer_rows_do_not_promote_nrc_triple_leaf_or_local_mlv_routes`,
  `pabco_high_stc_rows_do_not_promote_field_outputs_without_field_overlay`,
  `pabco_indexed_or_summary_report_locator_rows_do_not_promote_runtime_truth_without_payload`,
  and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
  Validation completed on 2026-05-03: focused PABCO Gate B 1 file / 8
  tests, PABCO Gate B / Gate A / post-Georgia-Pacific / v13 /
  route-source risk continuity 5 files / 36 tests,
  `pnpm calculator:gate:current` engine 213 files / 1175 tests, web 47
  files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, whitespace guard passed,
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect, and `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands `pabco_quietrock_sound_design_guide_source_pack_extraction_v1`
  Gate A no-runtime. It adds
  `packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`,
  source label: PABCO Gypsum / QuietRock Sound Design Guide and Sound
  Assembly Tool.
  extracts `PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730`,
  `PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745`,
  `PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035`,
  `PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611`,
  `PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358`,
  and `PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053`
  from PABCO row locators, keeps `STC` and report numbers
  context-only, keeps the split-rockwool `Rw 41`
  `multileaf_screening_blend` answer not fixed, keeps every runtime
  and visible surface frozen, and selects
  `packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts`
  with
  `gate_b_mapping_tolerance_decision_no_runtime`.
  Gate A status:
  `pabco_quietrock_sound_design_guide_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Selected planning surface:
  `docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md`.
  PABCO source locators:
  `https://go.pabcogypsum.com/tsdg` and
  `https://quietrock.com/resources/sound-control-assembly-selector/`.
  PABCO row boundaries:
  `pabco_pgd_w_646_16_stc41_does_not_replace_generic_wood_stud_or_quietrock_runtime_route`,
  `pabco_pgd_w_445_16_stc57_resilient_channel_context_does_not_promote_dyn_echo_rw_or_field_outputs`,
  `pabco_pgd_w_449_24_indexed_locator_is_not_runtime_truth_until_payload_is_retrieved`,
  `pabco_pgd_68_534_16_68mil_steel_stud_row_does_not_replace_existing_lsf_anchors`,
  `pabco_pgd_546_407_16_stc60_is_not_a_dyn_echo_field_or_lsf_runtime_anchor`,
  and
  `pabco_pgd_w6_467_24_quietrock_530_row_does_not_promote_generic_wood_stud_route`.
  PABCO protected boundaries:
  `pabco_quietrock_stc_row_pages_do_not_promote_dyn_echo_rw_or_field_outputs_without_metric_policy`,
  `quietrock_es_510_530_545_and_generic_pabco_type_x_do_not_coalesce_with_generic_gypsum_or_mlv_without_material_mapping`,
  `pabco_single_staggered_double_stud_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  `pabco_glass_fiber_wood_steel_rc_rows_do_not_reopen_closed_rockwool_usg_national_gypsum_georgia_pacific_british_gypsum_or_knauf_decisions`,
  `pabco_summary_report_download_links_are_not_runtime_truth_until_payloads_are_retrieved_and_curve_or_metric_policy_is_owned`,
  `pabco_pgd_w_449_24_indexed_locator_requires_fresh_payload_before_runtime_or_confidence_promotion`,
  and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
  Validation completed on 2026-05-03: focused PABCO Gate A 1 file / 8
  tests, continuity 21 files / 150 tests, current gate engine
  212 files / 1167 tests, web 47 files / 227 passed + 18 skipped,
  build 5 / 5 with known non-fatal `sharp/@img` warnings, whitespace
  guard clean, `apps/web/next-env.d.ts` restored to `.next-typecheck`
  after the build side-effect, and `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A_HANDOFF.md`
  lands `calculator_post_georgia_pacific_source_acquisition_v1` Gate A
  no-runtime. It adds
  `packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`,
  source label: post-Georgia-Pacific source acquisition.
  ranks PABCO Gypsum / QuietRock, CertainTeed SilentFX / NRC ASTC,
  Gypsum Association GA-600, and the closed official locator chain,
  keeps the split-rockwool `Rw 41` `multileaf_screening_blend` answer
  not fixed, keeps every runtime and visible surface frozen, and
  selects
  `packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`
  with
  `gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import`.
  Gate A status:
  `selected_pabco_quietrock_sound_design_guide_source_pack_extraction_after_post_georgia_pacific_acquisition_found_official_row_pages_but_no_runtime_ready_import`.
  Validation completed on 2026-05-02: focused post-Georgia-Pacific
  Gate A 1 file / 8 tests, continuity 20 files / 142 tests, current
  gate engine 211 files / 1159 tests, web 47 files / 227 passed + 18
  skipped, build 5 / 5 with known non-fatal `sharp/@img` warnings, and
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v13` Gate A no-runtime. It
  adds
  `packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`,
  re-ranks the backlog after Georgia-Pacific Gate C, keeps the
  split-rockwool `Rw 41` `multileaf_screening_blend` answer not fixed,
  keeps every runtime and visible surface frozen, and selects
  `packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`
  with
  `gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import`.
  Gate A status:
  `selected_post_georgia_pacific_source_acquisition_v1_after_v13_rerank_found_no_runtime_ready_candidate_and_post_british_gypsum_official_locators_closed_no_runtime`.
  Selected planning surface:
  `docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md`.
  Validation completed on 2026-05-02: focused v13 Gate A 1 file / 8
  tests, route-source risk register 1 file / 4 tests, continuity
  19 files / 134 tests, current gate engine 210 files / 1151 tests,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, whitespace guard passed,
  `apps/web/next-env.d.ts` restored to `.next-typecheck`, and
  `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  lands Georgia-Pacific Fire & Sound Assemblies source-pack extraction
  Gate C closeout no-runtime. It adds
  `packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  closes
  `georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1`
  after Gate B found no runtime-ready row, keeps the split-rockwool
  `Rw 41` `multileaf_screening_blend` answer not fixed, keeps every
  runtime and visible surface frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout`.
  Gate C status:
  `closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row`.
  Selected v13 planning surface:
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md`.
  Validation completed on 2026-05-02: focused Gate C closeout 1 file /
  7 tests, route-source risk register 1 file / 4 tests, continuity
  18 files / 126 tests, current gate engine 209 files / 1143 tests,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, whitespace guard passed,
  `apps/web/next-env.d.ts` restored to `.next-typecheck`, and
  `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands Georgia-Pacific Fire & Sound Assemblies source-pack extraction
  Gate B no-runtime. It adds
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts`,
  keeps `GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103`,
  `GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331`,
  `GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291`,
  `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8`,
  `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761`,
  and `GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363`
  context-only because actual directory/report payloads, metric policy,
  local material/topology mapping, tolerance owners, and paired visible
  tests remain missing. It keeps the split-rockwool `Rw 41`
  `multileaf_screening_blend` answer not fixed, selects
  `packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`, and
  records `georgia_pacific_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Protected Gate B boundaries:
  `georgia_pacific_gate_b_actual_directory_or_test_report_payload_missing_blocks_runtime_import`,
  `georgia_pacific_gate_b_source_rows_are_not_runtime_import_approval`,
  `georgia_pacific_gate_b_stc_ranges_and_sound_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `georgia_pacific_gate_b_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`,
  `georgia_pacific_gate_b_exterior_sheathing_shaftliner_area_separation_and_stairwell_rows_do_not_promote_generic_wall_routes`,
  `georgia_pacific_gate_b_rows_do_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors`,
  `georgia_pacific_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`, and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
  Validation completed on 2026-05-02: focused Gate B 1 file / 7
  tests, continuity 17 files / 119 tests, current gate engine 208
  files / 1136 tests, web 47 files / 227 passed + 18 skipped, build
  5 / 5 with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands Georgia-Pacific Fire & Sound Assemblies source-pack extraction
  Gate A no-runtime. It adds
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts`,
  captures the official planning page plus ToughRock / DensGlass /
  DensGlass Shaftliner guide rows, keeps `STC` ranges/values and
  sound-report locators context-only, protects DensGlass / ToughRock /
  SoundBreak / generic gypsum alias boundaries, keeps the
  split-rockwool `Rw 41` `multileaf_screening_blend` answer not fixed,
  and selects
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime` and
  `georgia_pacific_fire_sound_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Validation completed on 2026-05-02: focused Gate A 1 file / 8
  tests, continuity 16 files / 112 tests, current gate engine 207
  files / 1129 tests, web 47 files / 227 passed + 18 skipped, build
  5 / 5 with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v12` Gate A no-runtime. It
  adds
  `packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`,
  re-ranks Georgia-Pacific, the paused Uris 2006 lane, closed National
  Gypsum / USG / ROCKWOOL / British Gypsum / Knauf rows, CLT / floor /
  no-stud / lined-heavy followups, and historical blockers, keeps every
  candidate `runtimeImportReadyNow: false`, keeps the split-rockwool
  `Rw 41` `multileaf_screening_blend` answer paused and not fixed, and
  selects
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts`
  with
  `gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import`
  and
  `selected_georgia_pacific_fire_sound_assemblies_source_pack_extraction_after_v12_rerank_found_official_planning_context_but_no_runtime_ready_import`.
  Validation completed on 2026-05-02: focused v12 Gate A 1 file / 8
  tests, continuity 15 files / 104 tests, current gate engine 206
  files / 1121 tests, web 47 files / 227 passed + 18 skipped, build
  5 / 5 with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  lands National Gypsum Fire & Sound Assembly Selector source-pack
  extraction Gate C closeout no-runtime. It adds
  `packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  closes the National Gypsum selector pack after Gate B found no
  runtime-ready row, keeps representative `V438`, `W419`, `W469`,
  `W454`, and `P540` rows context-only, keeps STC/report/STC-N-A
  context out of runtime, keeps the split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not fixed,
  keeps every runtime and visible surface frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout`.
  Gate C status:
  `closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row`.
  Closed National Gypsum slice:
  `national_gypsum_fire_sound_selector_source_pack_extraction_v1`.
  Validation completed on 2026-05-02: focused National Gypsum Gate C
  closeout 1 file / 7 tests; continuity 14 files / 96 tests; current
  gate engine 205 files / 1113 tests, web 47 files / 227 passed + 18
  skipped, build 5 / 5 with known non-fatal sharp/@img warnings and
  whitespace guard passed; `apps/web/next-env.d.ts` restored to
  `.next-typecheck`; `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands National Gypsum Fire & Sound Assembly Selector source-pack extraction
  Gate B no-runtime. It adds
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts`,
  keeps representative selector rows
  `NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50`,
  `NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44`,
  `NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51`,
  `NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43`, and
  `NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA` context-only because
  exact report payloads, one-third-octave curves, metric owners, local
  material/topology mapping, tolerance owners, and paired visible tests
  are missing. It keeps STC/report locator context out of runtime,
  keeps the split-rockwool `Rw 41` `multileaf_screening_blend` answer
  low-confidence and not fixed, keeps every runtime and visible surface
  frozen, and selects
  `packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Gate B status:
  `national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Protected Gate B boundaries:
  `national_gypsum_gate_b_source_rows_are_not_runtime_import_approval`,
  `national_gypsum_gate_b_stc_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `national_gypsum_gate_b_fire_shield_soundbreak_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv`,
  `national_gypsum_gate_b_glass_fiber_does_not_coalesce_with_rockwool_or_generic_mineral_wool`,
  `national_gypsum_gate_b_resilient_channel_ct_h_stud_load_bearing_and_roof_truss_roles_do_not_promote_generic_routes`,
  `national_gypsum_gate_b_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`,
  `national_gypsum_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`, and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
  Validation completed on 2026-05-02: focused National Gypsum Gate B 1
  file / 7 tests; continuity 13 files / 89 tests; current gate engine
  204 files / 1106 tests, web 47 files / 227 passed + 18 skipped,
  build 5 / 5 with known non-fatal sharp/@img warnings and whitespace
  guard passed; `apps/web/next-env.d.ts` restored to `.next-typecheck`;
  `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands National Gypsum Fire & Sound Assembly Selector source-pack extraction
  Gate A no-runtime. It adds
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`,
  extracts representative selector rows, keeps STC/report locator
  context out of runtime, and selects
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`.
  Gate A status:
  `national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A_HANDOFF.md`
  lands source-gap revalidation v11 no-runtime. It adds
  `packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`,
  keeps closed USG / ROCKWOOL / British Gypsum / Knauf rows context-only,
  keeps the Uris 2006 lane paused on
  `paused_waiting_rights_safe_source_packet`, keeps the original
  split-rockwool `Rw 41` `multileaf_screening_blend` answer
  low-confidence and not fixed, keeps every runtime and visible surface
  frozen, closes `calculator_source_gap_revalidation_v11`, and selects
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`
  with
  `selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import`.
  The selected action is
  `gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`.
  Validation completed on 2026-05-02: focused v11 Gate A 1 file / 8
  tests; continuity 11 files / 76 tests; current gate engine 202 files /
  1093 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck`; `git diff --check`
  passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  closes USG Acoustical Assemblies source-pack extraction no-runtime. It
  adds
  `packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  carries forward the USG Gate B row blockers for
  `LEVELROCK_I_JOIST_SRM25_CARPET`,
  `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`,
  `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`,
  `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`, `USG_STEEL_FRAMED_A1`, and
  `USG_STEEL_FRAMED_A8`, keeps `STC` / `IIC` / range / test-number
  context out of runtime, keeps the original split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not fixed, and
  selects
  `packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout`.
  Gate C status:
  `closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row`.
  Validation completed on 2026-05-02: focused USG Gate C 1 file / 7
  tests; continuity 10 files / 68 tests; current gate engine 201 files /
  1085 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
  restored to `.next-typecheck`; `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands USG Acoustical Assemblies source-pack extraction Gate B
  no-runtime. It adds
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`,
  keeps `LEVELROCK_I_JOIST_SRM25_CARPET`,
  `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`,
  `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`,
  `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`, `USG_STEEL_FRAMED_A1`, and
  `USG_STEEL_FRAMED_A8` context-only, blocks `STC` / `IIC` / range /
  test-number over-read, protects
  `usg_gate_b_source_rows_are_not_runtime_import_approval`,
  `usg_gate_b_stc_iic_test_numbers_do_not_promote_dyn_echo_rw_lnw_or_field_outputs`,
  `usg_gate_b_levelrock_srm_srb_i_joist_truss_do_not_promote_generated_floor_or_wall_routes`,
  `usg_gate_b_floor_rows_do_not_override_exact_or_bound_floor_catalog_without_mapping_tolerance`,
  `usg_gate_b_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`,
  `usg_gate_b_sheetrock_thermafiber_rc_channel_do_not_coalesce_with_generic_gypsum_rockwool_glass_fiber_or_resilient_bar`,
  `usg_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`;
  keeps the original split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not fixed; and
  selects
  `packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`. Gate B
  status: `usg_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Validation completed on 2026-05-02: focused USG Gate B 1 file / 7
  tests; continuity 9 files / 61 tests; current gate engine 200 files /
  1078 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
  restored to `.next-typecheck` after the build side-effect; whitespace
  guard passed through `pnpm calculator:gate:current`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands USG Acoustical Assemblies source-pack extraction Gate A
  no-runtime. It adds
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts`,
  extracts `LEVELROCK_I_JOIST_SRM25_CARPET`,
  `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`,
  `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`,
  `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`, `USG_STEEL_FRAMED_A1`, and
  `USG_STEEL_FRAMED_A8` from the official USG SA200 locator
  `https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf`;
  keeps `STC`, `IIC`, ranges, and test numbers source-context only;
  protects
  `usg_stc_iic_rows_do_not_directly_promote_dyn_echo_rw_lnw_or_field_outputs`,
  `usg_floor_ceiling_rows_do_not_become_wall_or_triple_leaf_truth`,
  `usg_levelrock_srm_srb_i_joist_truss_rows_do_not_promote_generated_floor_without_mapping_tolerance`,
  `usg_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`,
  `usg_sheetrock_thermafiber_rows_do_not_coalesce_with_generic_gypsum_rockwool_or_glass_fiber_without_mapping`,
  `usg_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`;
  keeps the original split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not fixed; and
  selects
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`. Gate A status:
  `usg_acoustical_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Validation completed on 2026-05-02: focused USG Gate A 1 file / 6
  tests; continuity 8 files / 54 tests; current gate engine 199 files /
  1071 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
  restored to `.next-typecheck` after the build side-effect; whitespace
  guard passed through `pnpm calculator:gate:current`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A_HANDOFF.md`
  lands source-gap revalidation v10 no-runtime. It adds
  `packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`,
  keeps ROCKWOOL `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and `ESS-05`
  closed as source context only, keeps the original split-rockwool
  `Rw 41` `multileaf_screening_blend` answer low-confidence and not
  fixed, keeps the Uris 2006 lane paused on
  `paused_waiting_rights_safe_source_packet`, keeps every runtime and
  visible surface frozen, and selects
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts`
  in `usg_acoustical_assemblies_source_pack_extraction_v1`
  with
  `selected_usg_acoustical_assemblies_source_pack_extraction_after_v10_rerank_found_official_floor_wall_stc_iic_rows_but_no_runtime_ready_import`.
  The selected action is
  `gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import`.
  The selected plan is
  `docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`.
  The prior v10 action was
  `gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout`,
  selected by
  `closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row`.
  Validation completed on 2026-05-02: focused v10 Gate A 1 file / 8
  tests; continuity 7 files / 48 tests; current gate engine 198 files /
  1065 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
  restored to `.next-typecheck` after the build side-effect; `git diff --check`
  passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  lands ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate C
  closeout no-runtime. It adds
  `packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  closes `rockwool_acoustic_wall_assemblies_source_pack_extraction_v1`,
  keeps `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and `ESS-05` as source
  context only, preserves AFB / Comfortbatt / Cavityrock material-alias
  boundaries, keeps the original split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not fixed, keeps
  every runtime and visible surface frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`
  with
  `closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row`.
  Validation completed on 2026-05-02: focused ROCKWOOL Gate C closeout
  1 file / 6 tests; ROCKWOOL Gate C / Gate B / Gate A /
  post-British-Gypsum acquisition / v9 / route-source-risk continuity 6
  files / 40 tests; current gate engine 197 files / 1057 tests, web 47
  files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings; `apps/web/next-env.d.ts` restored to
  `.next-typecheck` after the build side-effect, and `git diff --check`
  passed after docs-only validation-count updates.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate B
  no-runtime. It adds
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`,
  compares `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and `ESS-05` from
  the `ROCKWOOL Acoustic Wall Assemblies Catalog` against live
  topology/material/metric/tolerance/test requirements,
  keeps every row out of runtime import, blocks `STC` / `OITC` /
  report-number over-read, preserves AFB / Comfortbatt / Cavityrock
  material-alias boundaries, keeps every runtime and visible surface
  frozen, and selects
  `packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `rockwool_gate_b_found_no_runtime_ready_row_selected_closeout`.
  The selected action is
  `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Validation completed on 2026-05-02: focused ROCKWOOL Gate B 1 file /
  8 tests; ROCKWOOL Gate B / Gate A / post-British-Gypsum acquisition /
  v9 / route-source-risk continuity 5 files / 34 tests; current gate
  engine 196 files / 1051 tests, web 47 files / 227 passed + 18
  skipped, build 5 / 5 with known non-fatal `sharp/@img` warnings;
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the build
  side-effect, and `git diff --check` passed after docs-only
  validation-count updates.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate A
  no-runtime. It adds
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts`,
  extracts representative `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and
  `ESS-05` source rows, keeps STC/OITC/report-number context out of
  DynEcho runtime metrics, blocks AFB / Comfortbatt / Cavityrock /
  local rockwool / glass-fiber coalescing, keeps every runtime and
  visible surface frozen, and selects
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with
  `rockwool_acoustic_wall_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  The selected action is `gate_b_mapping_tolerance_decision_no_runtime`.
  The prior post-British-Gypsum selection status was
  `selected_rockwool_acoustic_wall_assemblies_source_pack_extraction_after_post_british_gypsum_acquisition_found_official_stone_wool_wall_rows_but_no_runtime_ready_import`,
  selected with
  `gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import`.
  Validation completed on 2026-05-02: focused ROCKWOOL Gate A 1 file /
  6 tests; ROCKWOOL Gate A + post-BG continuity 7 files / 48 tests;
  current gate engine 195 files / 1043 tests, web 47 files / 227 passed
  + 18 skipped, build 5 / 5 with known non-fatal `sharp/@img` warnings;
  `git diff --check` clean after restoring the build side-effect in
  `apps/web/next-env.d.ts`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A_HANDOFF.md`
  lands calculator source-gap revalidation v9 no-runtime. It adds
  `packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`,
  confirms the Uris 2006 triple-leaf lane remains paused on
  `paused_waiting_rights_safe_source_packet`, keeps British Gypsum and
  Knauf closeouts authoritative, keeps every runtime and visible surface
  frozen, and selects
  `packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`
  with
  `selected_post_british_gypsum_source_acquisition_v1_after_v9_rerank_found_no_runtime_ready_candidate_and_british_gypsum_closed_no_runtime`.
  The selected next slice is
  `calculator_post_british_gypsum_source_acquisition_v1`; the selected
  action is
  `gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import`.
  Validation completed on 2026-05-02: focused v9 Gate A 1 file / 8 tests,
  v9 / Gate C / Gate B / v8 continuity 4 files / 30 tests, and
  `pnpm calculator:gate:current` engine 192 files / 1025 tests, web 47
  files / 227 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  lands British Gypsum White Book Gate C closeout no-runtime. It adds
  `packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  closes `british_gypsum_white_book_source_pack_extraction_v1`, keeps
  the Gate B row boundaries for `C204006`, `C204003`, `A206A290`,
  `A046006`, `A326017B`, and `B226010`, keeps every runtime and
  visible surface frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`
  with
  `closed_british_gypsum_white_book_source_pack_no_runtime_and_selected_source_gap_revalidation_v9_because_gate_b_found_no_new_import_ready_row`.
  The selected next slice is `calculator_source_gap_revalidation_v9`;
  the selected action is
  `gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout`.
  Validation completed on 2026-05-02: focused Gate C 1 file / 6 tests,
  Gate C / Gate B / v8 continuity 3 files / 22 tests, and
  `pnpm calculator:gate:current` engine 191 files / 1017 tests, web 47
  files / 227 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands British Gypsum White Book Gate B no-runtime. It adds
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`,
  keeps `C204006`, `C204003`, `A206A290`, `A326017B`, and `B226010`
  out of runtime import, keeps `A046006` as the already-landed exact
  timber anchor with no duplicate import, keeps every runtime and
  visible surface frozen, and selects
  `packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with
  `british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor_and_selected_closeout`.
  The selected action is
  `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Validation is green on 2026-05-02: focused Gate B 1 file / 8 tests,
  Gate B / Gate A / v8 continuity 3 files / 24 tests, and
  `pnpm calculator:gate:current` engine 190 files / 1011 tests, web 47
  files / 227 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md`
  lands calculator source-gap revalidation v8 no-runtime. It adds
  `packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`
  and
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md`,
  confirms the Uris 2006 triple-leaf source lane remains paused on
  `paused_waiting_rights_safe_source_packet`, re-ranks the remaining
  source/accuracy backlog, keeps every runtime and visible surface
  frozen, and selects
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`
  with
  `selected_british_gypsum_gate_b_mapping_tolerance_after_v8_rerank_paused_uris_2006_lane_and_found_official_rows_waiting_mapping`.
  The selected action is `gate_b_mapping_tolerance_decision_no_runtime`.
  Validation is green on 2026-05-02: focused v8 1 file / 8 tests, v8
  / Gate T / British Gypsum Gate A continuity 3 files / 23 tests, and
  `pnpm calculator:gate:current` engine 189 files / 1003 tests, web 47
  files / 227 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_T_HANDOFF.md`
  lands Gate T manual source-packet acquisition handoff no-runtime. It
  adds
  `packages/engine/src/wall-triple-leaf-manual-source-packet-handoff.ts`
  and
  `packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts`,
  formalizes the acquisition checklist
  `authorized_source_file_or_tdm_payload`,
  `rights_and_storage_note`, `source_identity_metadata`,
  `page_figure_table_locator`, `curve_identity_map`,
  `band_vector_or_digitization_payload`,
  `rating_derivation_and_uncertainty`, and
  `chain_of_custody_review`, pauses the Uris 2006 source lane with
  `paused_waiting_rights_safe_source_packet`, keeps the split-rockwool
  answer frozen at low-confidence `multileaf_screening_blend` `Rw 41`,
  and selects
  `packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`
  with
  `gate_t_paused_uris_2006_source_lane_no_runtime_selected_source_gap_revalidation_v8`.
  Validation is green on 2026-05-02: focused Gate T 1 file / 7 tests,
  Gate T/S/R/Q/P/O/N/M/K engine continuity 9 files / 63 tests, Gate J
  web continuity 1 file / 7 tests, and `pnpm calculator:gate:current`
  engine 188 files / 995 tests, web 47 files / 227 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_S_HANDOFF.md`
  lands Gate S source-packet availability no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-packet-availability.ts`
  and
  `packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts`,
  confirms `rights_safe_packet_absent`, keeps Uris 2006 metadata as
  identity context only, keeps
  `tmp_nrc_2024_graph_digitization_packet` as an adjacent comparator
  rather than the primary packet, keeps user repro PDFs and unrelated
  local PDFs out of source evidence, keeps the split-rockwool answer
  frozen at low-confidence `multileaf_screening_blend` `Rw 41`, and
  selects
  `packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts`
  with
  `gate_s_confirmed_no_rights_safe_uris_2006_packet_no_runtime_selected_manual_source_packet_handoff_gate_t`.
  Validation is green on 2026-05-02: focused Gate S 1 file / 7 tests,
  Gate S/R/Q/P/O/N/M/K engine continuity 8 files / 56 tests, Gate J web
  continuity 1 file / 7 tests, and `pnpm calculator:gate:current`
  engine 187 files / 988 tests, web 47 files / 227 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_R_HANDOFF.md`
  lands Gate R manual source-packet intake no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-manual-source-packet.ts` and
  `packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts`,
  formalizes the required artifacts
  `rights_safe_source_file`, `source_locator_metadata`,
  `page_figure_table_locator`, `curve_identity_map`,
  `band_vector_or_digitization_payload`,
  `rating_derivation_and_uncertainty`, and
  `chain_of_custody_and_rights_note`, records that no source packet is
  currently provided, keeps digitization/runtime blocked, keeps the
  split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts`
  with
  `gate_r_formalized_manual_source_packet_intake_no_runtime_selected_source_packet_availability_gate_s`.
  Validation is green on 2026-05-02: focused Gate R 1 file / 7 tests,
  Gate Q/P/O/N/M/K engine continuity 6 files / 42 tests, Gate J web
  continuity 1 file / 7 tests, and `pnpm calculator:gate:current`
  engine 186 files / 981 tests, web 47 files / 227 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_Q_HANDOFF.md`
  lands Gate Q source-access backlog and runtime-blocker revalidation
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-access-followup.ts` and
  `packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts`,
  turns Uris 2006 source access into an ordered manual backlog, keeps
  source packet, digitization QC, local material/effect mapping, support
  topology, paired visible runtime tests, and Uris 2008 separate-lane
  work out of runtime, revalidates all Gate P blockers as still open,
  keeps the split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts`
  with
  `gate_q_landed_source_access_backlog_and_blocker_revalidation_no_runtime_selected_manual_source_packet_gate_r`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_P_HANDOFF.md`
  lands Gate P source access or alternative measured-row acquisition
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-access.ts` and
  `packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts`,
  keeps Uris 2006 as the primary source-access target but blocks
  authorized Elsevier/TDM, manual source-packet, local PDF/page-image,
  and public-summary paths from runtime because none provides
  source-owned one-third-octave curves/table data now. It classifies
  Uris 2008 perforated absorptive-facing data as accessible adjacent
  negative-boundary context, keeps Utley/Brekke/Vinokur as method
  context, rejects glazing rows, preserves the NRC 2024 comparator as
  non-runtime, keeps the split-rockwool answer frozen at
  low-confidence `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts`
  with
  `gate_p_found_no_runtime_ready_access_or_equivalent_measured_row_no_runtime_selected_source_access_followup_gate_q`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_O_HANDOFF.md`
  lands Gate O full-curve retrieval and provenance QC no-runtime. It
  adds `packages/engine/src/wall-triple-leaf-source-locator-provenance.ts`
  and
  `packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts`,
  verifies the Uris 2006 DOI/PII/pages/metadata and ScienceDirect
  locator, records that the public/local paths expose only summary /
  metadata or HTTP 403 and not source-owned band curves, rejects the
  reported 7-8 dB weighted-index decrease as a reusable runtime penalty,
  keeps the split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts`
  with
  `gate_o_verified_uris_locator_but_full_curves_not_runtime_ready_no_runtime_selected_source_access_gate_p`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_N_HANDOFF.md`
  lands Gate N source locator intake no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-locator-intake.ts` and
  `packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts`,
  selects
  `uris_2006_internal_gypsum_50mm_mineral_wool_double_frame` as the
  primary full-curve retrieval target, keeps NRC 2024 as a graph-owned
  adjacent comparator, keeps rockwool-density and stone/glass-wool
  double-leaf papers as equivalence context only, rejects NRC 1998
  baseline rows from this lane, keeps the split-rockwool answer frozen
  at low-confidence `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts`
  with
  `gate_n_classified_rockwool_two_cavity_source_locators_no_runtime_selected_full_curve_retrieval_and_provenance_gate_o`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_M_HANDOFF.md`
  lands Gate M source evidence acquisition no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-evidence-acquisition.ts`
  and
  `packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts`,
  selects `rockwool_two_cavity_band_curve_source_pack` as the first
  evidence path, keeps Type C board mapping, support topology, MLV, and
  gypsum plaster as follow-on blockers, keeps the split-rockwool answer
  frozen at low-confidence `multileaf_screening_blend` `Rw 41`, and
  selects
  `packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts`
  with
  `gate_m_selected_rockwool_two_cavity_source_evidence_first_no_runtime_selected_source_locator_intake_gate_n`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_L_HANDOFF.md`
  lands Gate L source-gap closure no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-gap-closure.ts` and
  `packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts`,
  confirms all six local gaps remain open from current evidence, refuses
  to promote adjacent NRC Type C / glass-fiber / 92.1 mm cavity /
  support references as local runtime evidence, keeps the split-rockwool
  answer frozen at low-confidence `multileaf_screening_blend` `Rw 41`,
  and selects
  `packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts`
  with
  `gate_l_confirmed_source_gaps_remain_open_no_runtime_selected_source_evidence_acquisition_gate_m`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_K_HANDOFF.md`
  lands Gate K runtime-promotion readiness no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-runtime-promotion-readiness.ts`
  and
  `packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts`,
  passes the source-family curves, calibration/holdout,
  negative-boundary, complete grouped topology, and Gate J acceptance
  prerequisites, but blocks runtime promotion on local material
  mapping, usable local source pack, source-gap closure, runtime-ready
  topology guards, and paired engine/web visible runtime tests. It keeps
  the split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, selects
  `packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts`
  with
  `gate_k_blocked_runtime_promotion_no_runtime_selected_source_gap_closure_gate_l`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_J_HANDOFF.md`
  lands Gate J company-internal acceptance rehearsal no-runtime. It
  adds
  `apps/web/features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts`,
  rehearses the adjacent and split rockwool user PDF stacks, missing
  and complete grouped topology, exact and near-source controls,
  double-leaf / lined-masonry / one-side-lining negatives,
  many-layer/reorder hostile inputs, lab `Rw`, field `R'w` and
  `DnT,w`, and proposal/report visibility. It keeps the split-rockwool
  answer frozen at low-confidence `multileaf_screening_blend` `Rw 41`,
  keeps field metrics visibly caveated, and selects
  `packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts`
  with
  `gate_j_landed_company_internal_acceptance_rehearsal_no_runtime_selected_runtime_promotion_readiness_gate_k`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_I_HANDOFF.md`
  lands Gate I web-visible grouped topology inputs no-runtime. It adds
  `apps/web/features/workbench/simple-workbench-wall-topology.ts`,
  plumbs grouped wall topology through the workbench store and live
  `AirborneContext.wallTopology`, adds route-card topology-gap handling
  for missing grouped roles vs source-validation-blocked complete
  topology, keeps the live split-rockwool answer frozen at
  low-confidence `multileaf_screening_blend` `Rw 41`, and selects
  `apps/web/features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts`
  with
  `gate_i_landed_web_visible_grouped_topology_inputs_no_runtime_selected_company_internal_acceptance_rehearsal_gate_j`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_H_HANDOFF.md`
  lands the Gate H engine-integration fail-closed prerequisite check
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-engine-integration-fail-closed.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, passes source-family curves /
  calibration / negative-boundary / complete grouped test topology,
  blocks local material mapping, usable local source pack, source-gap
  closure, runtime-ready topology guards, and paired engine/web-visible
  runtime tests, and selects
  `apps/web/features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts`
  with
  `gate_h_landed_engine_integration_fail_closed_prerequisite_check_no_runtime_selected_web_visible_grouped_topology_inputs_gate_i`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G9_HANDOFF.md`
  lands the Gate G9 visible diagnostics and grouped topology guard
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, records visible diagnostic ids
  for the source gaps and route-flip guards, owns grouped topology guard
  definitions for `triple_leaf_double_leaf_route_flip` and
  `duplicate_stack_family_flip`, keeps web-visible runtime tests not
  ready, and selects
  `packages/engine/src/wall-triple-leaf-engine-integration-fail-closed-gate-h.test.ts`
  with
  `gate_g9_landed_visible_diagnostics_and_grouped_topology_guard_no_runtime_selected_engine_integration_fail_closed_gate_h`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G8_HANDOFF.md`
  lands the Gate G8 source-gap and order-risk register no-runtime. It
  adds
  `packages/engine/src/wall-triple-leaf-source-gap-and-order-risk.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, classifies source acquisition,
  bounded effect-model, and topology-input-owner gaps, selects
  `triple_leaf_double_leaf_route_flip` and
  `duplicate_stack_family_flip` for Gate G9 visible diagnostics /
  grouped topology guard work, preserves existing sibling order-risk
  tests, and selects
  `packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts`
  with
  `gate_g8_landed_source_gap_and_order_risk_register_no_runtime_selected_visible_diagnostics_and_topology_guard_gate_g9`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G7_HANDOFF.md`
  lands the Gate G7 local source-pack intake and order-risk register
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-local-source-pack-acquisition.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, keeps every source-pack candidate
  blocked, records `triple_leaf_double_leaf_route_flip`,
  `heavy_multileaf_lined_massive_boundary_flip`,
  `masonry_lined_massive_swap_flip`, `duplicate_stack_family_flip`, and
  `raw_floor_order_role_inference_sensitivity`, and selects
  `packages/engine/src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts`
  with
  `gate_g7_landed_local_source_pack_intake_no_runtime_selected_source_gap_and_order_risk_register_gate_g8`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G6_HANDOFF.md`
  lands the Gate G6 local source acquisition and bounded effect-model
  requirements no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-local-source-acquisition.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, blocks local Type C board
  mapping, rockwool/mineral-wool absorber substitution, local 50 mm
  cavities, MLV, gypsum plaster, and support gauge/depth/spacing before
  runtime, and selects
  `packages/engine/src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts`
  with
  `gate_g6_landed_local_source_and_effect_model_requirements_no_runtime_selected_source_pack_acquisition_gate_g7`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G5_HANDOFF.md`
  lands the Gate G5 blocked diagnostics and source-acquisition decision
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-blocked-diagnostics.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, turns Gate G4 blockers into
  user/developer diagnostics, and selects
  `packages/engine/src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts`
  with
  `gate_g5_landed_blocked_diagnostics_no_runtime_selected_local_source_acquisition_gate_g6`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G4_HANDOFF.md`
  lands the Gate G4 local material mapping and runtime eligibility
  decision no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-local-material-mapping.ts`,
  proves the Gate G3 source-family calibration still passes, blocks
  local `gypsum_board`, `rockwool`, `mlv`, `gypsum_plaster`, local
  50 mm cavities, and generic support topology from exact NRC-like
  runtime, keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts`
  with
  `gate_g4_blocked_local_material_and_topology_mapping_no_runtime_selected_blocked_diagnostics_and_source_acquisition_gate_g5`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G3_HANDOFF.md`
  lands the Gate G3 NRC-like source-family calibration fit and
  negative-boundary proof no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-calibration-fit.ts`, predicts
  calibration rows A/B and holdout row D against Gate G tolerance,
  keeps Assembly C as separate fill-regime context, protects ordinary
  double-leaf / simple stud / lined masonry / missing curve /
  floor-impact / field-only negatives, keeps runtime and visible
  behavior frozen, and selects
  `packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts`
  with
  `gate_g3_passed_nrc_2024_source_family_calibration_holdout_and_negative_boundaries_no_runtime_selected_local_mapping_gate_g4`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2B_HANDOFF.md`
  lands the Gate G2B reproducible curve digitization QC no-runtime. It
  adds
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.ts`,
  locks NRC 2024 Figure 4 / Figure 5 render provenance and axes,
  digitizes Type C plus assemblies A-D into one-third-octave TL vectors,
  derives STC/Rw as 64/63, 64/58, 60/49, 57/51, and 65/55, keeps runtime
  and visible calculator behavior frozen, and selects
  `packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts`
  with
  `gate_g2b_landed_reproducible_curve_digitization_qc_no_runtime_and_selected_calibration_fit_gate_g3`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2_HANDOFF.md`
  lands the Gate G2 source-curve digitization intake no-runtime. It
  adds
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.ts`,
  pins the NRC 2024 Type C base wall and assemblies A-D as immutable
  graph rows, records reported STC values 64 / 64 / 60 / 57 / 65, keeps
  `transmissionLossDb`, `derivedRw`, and `digitizationUncertaintyDb`
  null until reproducible QC exists, and keeps runtime and visible
  calculator behavior frozen. The next file is
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts`
  with
  `gate_g2_landed_source_curve_digitization_intake_no_runtime_and_selected_reproducible_digitization_qc`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G_HANDOFF.md`
  lands the Gate G calibration / holdout tolerance regime no-runtime.
  It adds `packages/engine/src/wall-triple-leaf-calibration-regime.ts`,
  sets the source-owned pass corridor to at least two calibration rows,
  at least one holdout row, MAE <= 2 dB, max error <= 4 dB, and dip-band
  placement within one neighboring one-third-octave band. Runtime and
  visible calculator behavior stay frozen, and the next file is
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts`
  with
  `gate_g_defined_calibration_holdout_regime_no_runtime_and_selected_source_curve_digitization_intake`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_F_HANDOFF.md`
  lands the Gate F three-leaf/two-cavity frequency-band solver skeleton
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-frequency-solver.ts`, derives
  grouped leaf masses, two cavity spring resonances, interacting
  resonance penalties, fill damping, coupling/support parameters, and
  ISO 717-ready TL curves. Runtime and visible calculator behavior stay
  frozen, and the next file is
  `packages/engine/src/wall-triple-leaf-calibration-regime.test.ts`
  with
  `gate_f_landed_frequency_band_solver_skeleton_no_runtime_and_selected_calibration_holdout_gate_g`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_E_HANDOFF.md`
  lands source-corpus classification no-runtime, keeps every source out
  of exact/runtime evidence, and selects Gate F frequency-band solver
  skeleton at
  `packages/engine/src/wall-triple-leaf-frequency-solver.test.ts` with
  `gate_e_classified_triple_leaf_source_corpus_no_runtime_and_selected_frequency_band_solver_gate_f`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_D_HANDOFF.md`
  lands source-pack extraction no-runtime, keeps every candidate
  `directRuntimeReadyNow: false`, and selects
  `packages/engine/src/wall-triple-leaf-source-corpus-contract.test.ts`
  for Gate E source-corpus classifier with
  `gate_d_extracted_triple_leaf_source_pack_no_runtime_and_selected_source_corpus_classifier_gate_e`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C_HANDOFF.md`
  lands the triple-leaf research plan no-runtime, keeps the current
  split-rockwool numeric answer on low-confidence
  `multileaf_screening_blend`, documents the second source-readiness
  iteration, and selects
  `packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts`
  for Gate D source-pack extraction with
  `gate_c_researched_triple_leaf_physics_and_selected_source_pack_extraction_before_any_numeric_promotion`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_B_HANDOFF.md`
  lands the grouped wall-topology input contract no-runtime, keeps the
  current split-rockwool numeric answer on low-confidence
  `multileaf_screening_blend`, and selects Gate C source-calibrated
  solver work with
  `landed_wall_triple_leaf_topology_input_contract_no_numeric_promotion_and_selected_source_calibrated_solver_gate_c`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A_HANDOFF.md`
  lands the split-rockwool PDF repro no-runtime, confirms existing
  stud/connection fields do not provide enough topology, and selects
  Gate B topology-input recovery with
  `selected_wall_triple_leaf_accuracy_recovery_v1_after_user_pdf_repro_showed_current_multileaf_blend_is_not_a_validated_calculation`.
- paused source checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands British Gypsum White Book source-pack extraction Gate A
  no-runtime, keeps every runtime and visible surface frozen, confirms
  `A046006` is already landed in the timber exact corpus, and selects
  Gate B mapping/tolerance decision with
  `british_gypsum_rows_extracted_no_new_runtime_import_a046006_already_landed_others_need_mapping_tolerance_visible_tests`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A_HANDOFF.md`
  lands `calculator_post_knauf_source_acquisition_v1` no-runtime, keeps
  every runtime and visible surface frozen, and selects
  `british_gypsum_white_book_source_pack_extraction_v1` with
  `selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import`.
- just landed British Gypsum extraction decision:
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`
  extracts `C204006`, `C204003`, `A206A290`, `A046006`, `A326017B`,
  and `B226010` no-runtime. `A046006` is not new runtime movement
  because it is already represented by
  `british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`.
  `C204006`, `C204003`, `A206A290`, `A326017B`, and `B226010` proceed
  only to Gate B mapping/tolerance decision; runtime/support/confidence/
  evidence/API/route-card/output-card/proposal-report/workbench-input
  behavior stays frozen. The next file is
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`.
- just landed post-Knauf source acquisition decision:
  `packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`
  classifies fresh official locators after v7 found no runtime-ready
  pack. British Gypsum White Book row locators cover GypFloor Silent
  `C204006` / `C204003`, GypWall Single Frame `A206A290`, timber stud
  `A046006`, GypWall Twin Frame Audio `A326017B`, and GypLyner Single
  `B226010`. Stora Enso CLT stays context. No runtime or visible
  surface moved; the next first-gate file is
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v7` no-runtime, keeps
  every runtime and visible surface frozen, and selects
  `calculator_post_knauf_source_acquisition_v1` with
  `selected_post_knauf_source_acquisition_v1_after_v7_rerank_found_no_runtime_ready_candidate_and_current_sources_exhausted`.
- just landed v7 source-gap revalidation decision:
  `packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`
  re-ranks the post-Knauf source / accuracy backlog after `TB.5A`,
  `MWI.2A`, `TTF30.2A`, and
  `EN-PC-50-055-6-2-12.5-WB-25` all closed no-runtime. It finds no
  source-ready runtime candidate, keeps every runtime and visible
  surface frozen, and selects
  `packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`
  as the next first-gate file.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
  closes `steel_stud_knauf_enpc_mapping_tolerance_v1` no-runtime and
  selects `calculator_source_gap_revalidation_v7`.
- just closed EN-PC mapping/tolerance decision:
  `packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `EN-PC-50-055-6-2-12.5-WB-25` no-runtime because Wallboard,
  25 mm Acoustic Roll, 50 mm / 0.55 gauge stud detail, field-output
  policy, spectrum-term policy, tolerance ownership, and paired
  visible tests remain incomplete. Because `TB.5A`, `MWI.2A`,
  `TTF30.2A`, and `EN-PC-50-055-6-2-12.5-WB-25` all closed
  no-runtime, it selects
  `packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`
  as the next first-gate file with
  `closed_enpc_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v7_because_all_concrete_knauf_mapping_rows_lack_exact_material_metric_tolerance_ownership`.
- just landed EN-PC mapping/tolerance decision:
  `packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`
  pins official Knauf UK `EN-PC-50-055-6-2-12.5-WB-25` lab context:
  50 mm 0.55 gauge Knauf C metal stud at 600 mm centres,
  `2x12.5 mm` Wallboard each side, `25 mm` Knauf Insulation Acoustic
  Roll, single metal stud non-deflection frame, and lab `Rw 49`.
  Runtime remains blocked because the live LSF route is anchored to
  `knauf_lab_416889_primary_2026` (`Rw 55`) with acoustic gypsum
  board, 70 mm glasswool, 5 mm air gap, no stud-depth/gauge input,
  no EN-PC field-output owner, no spectrum-term owner, no tolerance
  owner, and no paired visible tests. It selects
  `packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  as the next file with `gate_c_no_runtime_closeout_and_next_slice_selection`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v6` no-runtime, keeps every
  runtime and visible surface frozen, and selects
  `steel_stud_knauf_enpc_mapping_tolerance_v1` with
  `selected_no_runtime_knauf_enpc_steel_stud_mapping_tolerance_after_v6_rerank_found_no_runtime_ready_candidate`.
- just landed v6 source-gap revalidation decision:
  `packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`
  re-ranks the post-Knauf mapping chain after `TB.5A`, `MWI.2A`, and
  `TTF30.2A` closed no-runtime. It selects
  `packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`
  because `EN-PC-50-055-6-2-12.5-WB-25` is the highest-value remaining
  concrete Knauf locator for a common steel-stud lane, while Wallboard /
  Acoustic Roll mapping, stud-gauge equivalence, lab/field policy,
  tolerance owner, existing steel-anchor precedence, and paired visible
  tests remain incomplete.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
  closes `twin_timber_knauf_ttf302a_mapping_tolerance_v1` no-runtime,
  keeps Knauf `TTF30.2A` as source context only, keeps every runtime
  and visible surface frozen, and selects
  `calculator_source_gap_revalidation_v6` with
  `closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership`.
- just closed TTF30.2A mapping/tolerance decision:
  `packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `TTF30.2A` no-runtime because exact twin-frame topology,
  `FIBEROCK AQUA-TOUGH` mapping, side asymmetry, glasswool placement,
  field-output policy, tolerance ownership, and paired visible tests
  remain missing. It selects
  `packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`
  as the next first-gate file.
- just landed TTF30.2A mapping/tolerance decision:
  `packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`
  pins official Knauf `TTF30.2A` lab context: asymmetric `1x13 mm`
  side 1 / `2x13 mm` side 2 `FIBEROCK AQUA-TOUGH`, twin timber studs
  separated by a 20 mm gap, 70 / 90 mm stud columns, 199 / 239 mm
  minimum wall widths, `Nil` / `KI 50G11` / `KI 75G11` / `KI 90G11`
  variants, and source ratings spanning `Rw 49-64` / `Rw+Ctr 41-54`.
  Runtime remains blocked because live timber is a single-frame
  formula-owned generic gypsum / rockwool / air-gap route without
  twin-frame gap, side asymmetry, exact column, field-output policy, or
  tolerance owner. It selects
  `packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  as the next file with `gate_c_no_runtime_closeout_and_next_slice_selection`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
  closes `lined_masonry_knauf_mwi2a_mapping_tolerance_v1` no-runtime,
  keeps Knauf `MWI.2A` as source context only, keeps every runtime and
  visible surface frozen, and selects
  `twin_timber_knauf_ttf302a_mapping_tolerance_v1` with
  `closed_mwi2a_mapping_tolerance_no_runtime_and_selected_knauf_ttf302a_twin_timber_mapping_tolerance_because_mwi2a_lacks_exact_material_metric_tolerance_ownership`.
- just closed MWI.2A mapping/tolerance decision:
  `packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `MWI.2A` no-runtime because exact substrate mass,
  furring/coupling model, `SHEETROCK ONE` mapping, `KI 25G24` /
  `KI 50G11` mapping, field-output policy, and tolerance ownership
  remain missing. It selects
  `packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`
  as the next first-gate file.
- just landed MWI.2A mapping/tolerance decision:
  `packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`
  pins official Knauf `MWI.2A` lab context: `1x13 mm SHEETROCK ONE`
  each side, side 2 on 28 mm furring channels, 30 / 50 mm cavity
  variants, `Nil` / `KI 25G24` / `KI 50G11` insulation variants,
  concrete panel and core-filled block substrate variants, and source
  ratings spanning `Rw 52-61` / `Rw+Ctr 44-51`. Runtime remains blocked
  because the live route does not exact-match the board, substrate
  mass, furring/cavity coupling, insulation, field-output policy, or
  tolerance owner.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
  closes `timber_double_board_knauf_tb5a_mapping_tolerance_v1`
  no-runtime, keeps Knauf `TB.5A` as source context only, keeps every
  runtime and visible surface frozen, and selects
  `lined_masonry_knauf_mwi2a_mapping_tolerance_v1` with
  `closed_tb5a_mapping_tolerance_no_runtime_and_selected_knauf_mwi2a_lined_masonry_mapping_tolerance_because_tb5a_lacks_exact_material_metric_tolerance_ownership`.
- just closed TB.5A mapping/tolerance decision:
  `packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `TB.5A` no-runtime because exact stud-depth column selection,
  `SHEETROCK ONE` mapping, `KI 75G11` mapping, field-output policy,
  and tolerance ownership remain missing. It selects
  `packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`
  as the next first-gate file.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md`
  lands `timber_double_board_knauf_tb5a_mapping_tolerance_v1` Gate A
  no-runtime, records Knauf `TB.5A` as source context only, keeps every
  runtime and visible surface frozen, and selects Gate C closeout /
  next-slice selection with
  `gate_c_no_runtime_closeout_and_next_slice_selection`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v5` Gate A no-runtime,
  keeps every runtime and visible surface frozen, and selects
  `timber_double_board_knauf_tb5a_mapping_tolerance_v1` with
  `selected_no_runtime_knauf_tb5a_timber_double_board_mapping_tolerance_after_v5_rerank_found_no_runtime_ready_candidate`.
- just landed TB.5A mapping/tolerance decision:
  `packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`
  pins official Knauf `TB.5A` lab context: 70 mm / 122 mm column
  `Rw 46 (Rw+Ctr 39)` and 90 mm / 142 mm column
  `Rw 47 (Rw+Ctr 40)` for `KI 75G11`. Runtime remains blocked because
  the live route does not exact-match `2x13 mm SHEETROCK ONE`,
  `75 mm KI 75G11`, or a selected stud-depth column, and no field
  output or tolerance owner is named.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md`
  confirmed docs and implementation aligned at a clean pre-Gate A stop:
  v5 was selected, the v5 Gate A contract was intentionally absent and
  next, the current-gate runner included Knauf Gate C but not v5 yet,
  and no source-ready runtime candidate was selected.
- just landed v5 source-gap revalidation decision:
  `packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`
  re-ranks Knauf `TB.5A`, Knauf `MWI.2A`, CLT / mass timber, generated
  floor fallback, no-stud double-leaf, historical blocked families,
  internal-use promotion, and productization-only work. It keeps every
  candidate `runtimeImportReadyNow: false`, freezes
  `runtime/support/confidence/evidence/API/route-card/output-card` and
  `proposal/report/workbench-input`, and selects the no-runtime
  `TB.5A` mapping / tolerance slice.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  closes Knauf source-pack extraction no-runtime, carries forward
  `no_knauf_locator_row_has_complete_topology_metric_tolerance_and_visible_test_ownership`,
  and selects `calculator_source_gap_revalidation_v5` with
  `closed_knauf_wall_systems_source_pack_no_runtime_and_selected_source_gap_revalidation_v5_because_gate_b_found_no_import_ready_row`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands Knauf source-pack Gate B no-runtime. It compared the extracted
  locator rows against the live implementation, blocked every row from
  runtime/import/visible promotion, and selected Gate C closeout /
  next-slice selection.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands Knauf source-pack Gate A no-runtime. It extracted official
  Knauf UK/AU locators and selected Gate B mapping/tolerance decision;
  runtime/support/confidence/evidence/API/card/report/input behavior
  stayed frozen.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v4` Gate A no-runtime and
  selects `knauf_wall_systems_source_pack_extraction_v1`. Official
  Knauf UK/AU source locators are concrete enough for no-runtime
  extraction, but not for import or confidence promotion.
- just landed Knauf extraction decision:
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`
  blocks `EN-PC-50-055-6-2-12.5-WB-25`, `TB.5A`, `TTF30.2A`, and
  `MWI.2A` from import because exact topology / local material mapping
  / tolerance ownership / field-output policy remain incomplete; keeps
  `TO120.1A` negative and `TSF120.1A` / `AAC.1A` adjacent context; and
  selects Gate C no-runtime.
- just landed Knauf extraction Gate A:
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`
  extracted UK steel-stud, AU timber stud/twin/staggered, and AU
  masonry/AAC locator rows. `EN-PC-50-055-6-2-12.5-WB-25`, `TB.5A`,
  `TTF30.2A`, and `MWI.2A` proceed only to Gate B mapping/tolerance
  decision; `TO120.1A` stays a one-side-lined negative boundary, and
  `TSF120.1A` / `AAC.1A` stay adjacent context.
- just landed v4 source-gap revalidation decision:
  `packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`
  re-ranks the current source/accuracy backlog, keeps every runtime and
  visible surface frozen, and selects
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`
  as the next first-gate file.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md`
  closes generated floor fallback topology-delta no-runtime and selects
  `calculator_source_gap_revalidation_v4`. The live fallback stays
  low-confidence/screening; Pliteq exact and UBIQ FL-32 bound
  precedence still fire only on source topology; Gate B was skipped
  because no source-ready runtime candidate was found.
- just closed generated floor fallback decision:
  `packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`
  closes `generated_floor_fallback_topology_delta_v1` no-runtime, keeps
  every runtime and visible surface frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`
  as the next first-gate file.
- just landed generated floor fallback decision:
  `packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`
  landed `generated_floor_fallback_topology_delta_v1` Gate A by mapping
  the live generated `floor-steel-fallback` stack against Pliteq exact
  and UBIQ FL-32 bound topologies. It keeps unsupported outputs explicit,
  keeps split variants finite and low-confidence, and selects Gate C
  closeout / next-slice selection with no runtime movement.
- just closed source-intake backlog cleanup decision:
  `packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`
  keeps every backlog family `runtimeImportReadyNow: false`, freezes
  every runtime and visible surface, and selects
  `packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`
  as the next first-gate file.
- just landed source-intake backlog decision:
  `packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts`
  consolidates CLT / mass-timber wall, timber double-board stud wall,
  no-stud double-leaf wall, generated floor fallback, lined massive /
  heavy-core wall, and historical blocked families into one
  agent-readable backlog. Public source locators remain context only
  until exact topology, metric owner, tolerance owner, negative
  boundaries, and paired engine/web visible tests are named.
- just closed pilot handoff decision:
  `packages/engine/src/post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts`
  closes `internal_use_pilot_handoff_v1` no-runtime, keeps the handoff
  as controlled-use evidence rather than source-gated promotion, and
  selects `calculator_source_intake_backlog_cleanup_v1`.
- just landed pilot handoff decision:
  `packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts`
  creates `docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md`, tying the
  ready/caveated/blocked/hostile scenario buckets to validation
  evidence, known gaps, and operator steps without moving
  `runtime/support/confidence/evidence/API/route-card/output-card` or
  `proposal/report/workbench-input` behavior.
- just closed acceptance rehearsal decision:
  `packages/engine/src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts`
  keeps runtime/support/confidence/evidence/API/route-card/output-card/
  proposal/report/workbench-input behavior frozen, treats Gate A as
  controlled-use evidence rather than promotion permission, and selects
  the pilot handoff slice.
- just landed acceptance rehearsal decision:
  `packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`
  pins 20 representative scenarios: ready wall benchmarks, exact/bound
  floor source corridors, caveated generated routes, many-layer/reorder
  edges, invalid thickness fail-closed behavior, unsupported-output
  partitioning, and cross-package proof-owner surfaces.
- just closed CLT / mass-timber decision:
  `packages/engine/src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  keeps all runtime/support/confidence/evidence/API/route-card/
  output-card surfaces frozen, confirms Gate B roadmap tracks are not
  source-ready runtime packs, and selects company-internal acceptance
  rehearsal as the next no-runtime slice.
- just landed Gate B decision:
  `packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts`
  keeps STC/FSTC/ASTC as metric-policy research, rejects IIC for wall
  airborne outputs, allows one-third-octave TL only as future row
  recompute input, keeps Dataholz CLT floor `Rw` floor-only, and keeps
  every Gate A source group `runtimeImportReadyNow: false`.
- just landed extraction decision:
  `packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`
  classifies WoodWorks Table 7 Single CLT Wall and Table 9 Double CLT
  Wall as later row-mapping candidates only; WoodWorks Table 8 Single
  NLT Wall, NRC RR-335, and the NRC NLT addendum as formula/tolerance
  context; the WoodWorks database and Dataholz CLT floor rows as
  rejection-only context. Current `wall-clt-local` values and visible
  posture stayed frozen.
- just landed source-pack decision:
  `packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts`
  ranked every candidate with `runtimeImportReadyNow: false`. CLT /
  mass-timber is first only for no-runtime extraction because WoodWorks
  and NRC locators are concrete enough to inspect next. STC/ASTC/IIC to
  ISO `Rw` handling, exact row extraction, tolerance ownership, and
  paired visible tests remain blockers.
- just closed internal-use decision:
  `packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`
  closed Gate C. Runtime, support, confidence, evidence tier, API
  shape, route-card values, and output-card statuses stayed frozen. The
  only behavior movement remains Gate B visible honesty copy: dynamic
  wall formula routes carry explicit formula-owned/source-gated
  scoped-estimate language through validation, evidence, and
  proposal/report surfaces.
- prior source/readiness rerank decision:
  `packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`
  selected the internal-use operating envelope because no fresh
  source-backed import, card dishonesty, or runtime drift outranked the
  short pilot pack.
- prior framed split decision:
  `packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts`
  fixed the LSF field/building board-split +1 dB value drift and
  split-only framed reinforcement monotonic-floor warning without global
  same-material board coalescing. Paired web route-card coverage is in
  `apps/web/features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts`.
- prior selection decision:
  `packages/engine/src/post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts`
  closed `floor_layer_order_invariance_expansion_v1` Gate C no-runtime
  and selected `wall_framed_facing_split_warning_stability_v1`.
- prior floor-order decision:
  `packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`
  landed Gate A no-runtime for expanded floor layer-order behavior; Gate
  C then closed it without runtime/card drift.
- personal-use readiness chain:
  closed. Heavy-core/concrete remains screening; timber stud + CLT wall
  remain formula/source-gated until new source evidence appears; floor
  fallback remains low-confidence until new source evidence or a bounded
  family rule appears. UI/input/output honesty is closed and validated.
- do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web, heavy-concrete
  parity or formula scope, reinforced-concrete reopening, wall-selector
  behavior, timber-stud widening, or wall exact-row follow-ups from nearby
  green tests alone
- if a slice closes, update the current plan, current state, and the relevant
  checkpoint/handoff note together
- keep planning-contract tests in sync with the selected next slice
- `calculator_source_gap_revalidation_v7` is closed no-runtime and
  selected `calculator_post_knauf_source_acquisition_v1` because
  `TB.5A`, `MWI.2A`, `TTF30.2A`,
  `EN-PC-50-055-6-2-12.5-WB-25`, generated fallback, lined-heavy,
  no-stud, CLT, and historical blocked families all lack complete
  runtime prerequisites from the current source set. Do not promote any
  source locator alone without exact topology, metric owner, tolerance
  owner, local material mapping, protected negative boundaries, and
  paired engine/web visible tests.
- `calculator_post_knauf_source_acquisition_v1` is closed no-runtime
  and selected `british_gypsum_white_book_source_pack_extraction_v1`
  because British Gypsum White Book official row locators are concrete
  enough for extraction across GypFloor Silent, GypWall Single Frame,
  timber stud, GypWall Twin Frame Audio, and GypLyner Single. They are
  not runtime-ready until exact live topology, local material mapping,
  metric policy, tolerance owner, protected negative boundaries, and
  paired engine/web visible tests are extracted.
- prepared planning surfaces: internal-use acceptance rehearsal is in
  `SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md`; pilot handoff
  is in `SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md` and
  `INTERNAL_USE_PILOT_HANDOFF.md`; source-intake backlog cleanup is in
  `SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md` and
  `SOURCE_READY_INTAKE_BACKLOG.md`; generated floor fallback topology
  delta is in
  `SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md`; source
  gap revalidation v4 is in
  `SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md`; source gap
  revalidation v5 is landed in
  `SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md`; source gap
  revalidation v6 is landed in
  `SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md`; source gap
  revalidation v7 is landed in
  `SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md`; post-Knauf
  source acquisition is landed in
  `SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md`;
  British Gypsum White Book source extraction is selected in
  `SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md`;
  Knauf
  `EN-PC-50-055-6-2-12.5-WB-25` steel-stud mapping/tolerance is
  closed in
  `SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md`; Knauf
  `TTF30.2A` twin timber mapping/tolerance is closed in
  `SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md`;
  `MWI.2A` lined masonry mapping/tolerance is closed in
  `SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md`; Knauf
  `TB.5A` timber double-board mapping/tolerance is closed in
  `SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md`;
  Knauf wall
  systems source extraction is closed in
  `SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md`; CLT /
  mass-timber extraction is closed in
  `SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md`; source-pack
  readiness triage is landed in
  `SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md`; short/regular
  internal use is closed in `SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md`;
  longer source-gated correctness work is in
  `CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md`. No runtime import is
  active until a contract selects it.
- Personal-Use MVP Coverage Sprint Gate BK has now landed:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`.
  Complete steel suspended-ceiling-only predictor input now leaves the
  low-confidence Pliteq/UBIQ fallback and returns lab `Ln,w 62.2` through
  `predictor_lightweight_steel_suspended_ceiling_corridor_estimate` with
  a `+/-6 dB` source-absent formula budget. Gate AD steel upper/lower
  `Ln,w 55.6` / `DeltaLw 22.4` stays frozen, exact source rows still win,
  and `DeltaLw`, field/building, `IIC` / `AIIC`, and `L'nT,50` are not
  fabricated by this lane. Gate BK selection status:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_landed_selected_suspended_ceiling_input_surface_gate_bl`.
  Selected next action:
  `gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_plan`.
  Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts`.
- Personal-Use MVP Coverage Sprint Gate BL has now landed:
  `gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_plan`.
  The existing Dynamic Calculator steel floor input surface now feeds
  complete steel suspended-ceiling-only owner fields into the Gate BK
  runtime corridor. UI-derived complete input returns lab `Ln,w 62.2`
  through
  `predictor_lightweight_steel_suspended_ceiling_corridor_estimate` with
  the same `+/-6 dB` source-absent budget, while missing
  `steelCarrierSpacingMm` or `lowerCeilingIsolationSupportForm` becomes a
  precise input prompt instead of a final low-confidence answer. Gate AD
  `Ln,w 55.6` / `DeltaLw 22.4`, exact source precedence, and
  field/building/ASTM/IIC/AIIC/`L'nT,50` boundaries stay frozen. Gate BL
  selection status:
  `gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_landed_selected_post_input_surface_revalidation_gate_bm`.
  Selected next action:
  `gate_bm_personal_use_mvp_post_steel_suspended_ceiling_input_surface_revalidation_plan`.
  Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bm-post-steel-suspended-ceiling-input-surface-revalidation-contract.test.ts`.
- Personal-Use MVP Coverage Sprint Gate BM has now landed:
  `gate_bm_personal_use_mvp_post_steel_suspended_ceiling_input_surface_revalidation_plan`.
  This is a no-runtime revalidation after the Gate BL steel suspended-
  ceiling input surface. It keeps Gate BK lab `Ln,w 62.2` / `+/-6 dB`,
  Gate AD steel upper/lower `Ln,w 55.6` / `DeltaLw 22.4`, exact-source
  precedence, Gate BJ field/building basis separation, adjacent
  floor-impact source-absent lanes, and ASTM/IIC/AIIC/`L'nT,50`
  boundaries frozen. Gate BM selection status:
  `gate_bm_personal_use_mvp_post_steel_suspended_ceiling_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_bn`.
  Selected next action:
  `gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_plan`.
  Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bn-coverage-matrix-refresh-after-steel-suspended-ceiling-contract.test.ts`.
  Next plain label: coverage matrix refresh after steel suspended-ceiling.
- Personal-Use MVP Coverage Sprint Gate BN has now landed:
  `gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_plan`.
  This is a no-runtime matrix refresh after the Gate BM steel suspended-
  ceiling revalidation. It adds complete `Ln,w 62.2`, safe-reorder,
  partial-input, duplicate-carrier refusal, exact-source precedence,
  field adapter, unsupported `DeltaLw`, ASTM/IIC/AIIC, and `L'nT,50`
  steel suspended-ceiling rows to the executable Personal-Use MVP matrix
  while keeping Gate BK `Ln,w 62.2` / `+/-6 dB`, Gate AD `Ln,w 55.6` /
  `DeltaLw 22.4`, exact-source precedence, field/building separation,
  and runtime tolerances frozen. Gate BN selection status:
  `gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_landed_no_runtime_selected_reinforced_concrete_low_confidence_cleanup_gate_bo`.
  Selected next action:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan`.
  Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo-reinforced-concrete-low-confidence-cleanup-contract.test.ts`.
  Next plain label: reinforced-concrete low-confidence cleanup.
- Personal-Use MVP Coverage Sprint Gate BO has now landed:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan`.
  It removes the reinforced-concrete combined upper/lower
  `predictor_floor_system_low_confidence_estimate` final answer. Complete
  explicit owner input now returns lab `Ln,w 58.1` / `DeltaLw 13.7`
  through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`,
  while incomplete explicit or visible-derived owner input parks impact
  outputs with named missing physical fields instead of fabricating
  `Ln,w 50`, proxy `Rw 65.9`, or proxy `Ctr 57`. Gate BO selection
  status:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_landed_selected_surface_parity_gate_bp`.
  Selected next action:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan`.
  Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp-reinforced-concrete-cleanup-surface-parity-contract.test.ts`.
  Next plain label: reinforced-concrete cleanup surface parity.
- Personal-Use MVP Coverage Sprint Gate BP has now landed:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan`.
  It is no-retune surface parity for Gate BO. Complete explicit or
  UI-derived reinforced-concrete combined upper/lower owner input still
  returns lab `Ln,w 58.1` / `DeltaLw 13.7` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
  with `+/-6.5 dB` / `+/-5.5 dB` source-absent budgets. Incomplete
  explicit or visible-derived owner input now presents impact cards,
  trace, reports, saved replay, calculator API, and impact-only API as
  precise `needs_input` with named missing physical fields rather than
  a low-confidence or unsupported-looking final answer. Exact source,
  bare heavy-floor, upper-only floating-floor, field, building, and ASTM
  boundaries remain separate. Gate BP selection status:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_landed_selected_matrix_refresh_gate_bq`.
  Selected next action:
  `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`.
  Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts`.
  Next plain label: coverage matrix refresh after reinforced-concrete cleanup.
 - Personal-Use MVP Coverage Sprint Gate BQ has now landed:
   `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`.
   It is a no-runtime executable matrix refresh after the Gate BO/BP
   reinforced-concrete cleanup. The stale
   `floor.reinforced_concrete_low_confidence_combined.cleanup_candidate`
   coverage-gap row is replaced by eight rows for complete formula
   support, visible-derived `needs_input`, incomplete explicit
   `needs_input`, exact-source precedence, bare heavy-floor and
   upper-only floating-floor adjacent corridors, field/building
   non-alias posture, and ASTM `IIC` / `AIIC` unsupported posture. Gate
   BO/BP values stay frozen at lab `Ln,w 58.1` / `DeltaLw 13.7` through
   `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
   with `+/-6.5 dB` / `+/-5.5 dB` source-absent budgets. The refreshed
   matrix has 58 rows and zero calculation-grade `coverage_gap` rows.
   Gate BQ selection status:
   `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_landed_no_runtime_selected_floor_impact_astm_iic_aiic_adapter_gate_br`.
   Selected next action:
   `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`.
   Selected next file:
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts`.
   Next plain label: floor-impact ASTM IIC/AIIC adapter contract.
 - Personal-Use MVP Coverage Sprint Gate BR has now landed:
   `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`.
   It is a no-runtime ASTM impact-rating ownership contract. Lab `IIC`
   and field `AIIC` now have separate executable owner groups; complete
   current ISO floor-impact formulas still leave ASTM outputs
   unsupported, and ISO `Ln,w` / `DeltaLw`, field `L'n,w` / `L'nT,w`,
   and building-prediction metrics must not alias to ASTM ratings.
   Missing ASTM frequency bands or field room context returns
   `needs_input`; missing ASTM rating or uncertainty owners returns
   `runtime_owner_missing`. Gate BR selection status:
   `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_landed_no_runtime_selected_runtime_corridor_gate_bs`.
   Selected next action:
   `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`.
   Selected next file:
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts`.
   Next plain label: floor-impact ASTM IIC/AIIC runtime corridor.
 - Personal-Use MVP Coverage Sprint Gate BS has now landed:
   `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`.
   It is a no-runtime ASTM `IIC` / `AIIC` runtime-corridor probe. Gate
   BR's owner groups are necessary but not enough to promote runtime:
   current impact results have no ASTM metric value slots, no ASTM
   impact metric-basis keys, no target-output support for ASTM impact
   ratings, no exact ASTM source precedence runtime route, and no
   visible ASTM parity owner. ISO `Ln,w` / `DeltaLw`, field `L'n,w` /
   `L'nT,w`, and building-prediction metrics must not alias to ASTM
   ratings. Missing ASTM physical context remains `needs_input`; missing
   rating/runtime owners remain `runtime_owner_missing`. Gate BS
   selection status:
   `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_closed_no_runtime_selected_metric_schema_adapter_bridge_gate_bt`.
   Selected next action:
   `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`.
   Selected next file:
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts`.
   Next plain label: floor-impact ASTM IIC/AIIC metric schema and adapter bridge.
 - Personal-Use MVP Coverage Sprint Gate BT has now landed:
   `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`.
   It is a no-runtime ASTM `IIC` / `AIIC` metric schema and adapter
   bridge. Shared impact results can now carry ASTM lab `IIC` and field
   `AIIC` only with the ASTM bridge basis, matching metric-basis owner,
   finite metric value, matching `availableOutputs`, and correct
   lab/field context. Target-output support opens only for those exact
   bridge payloads. Current real runtime still leaves `IIC` / `AIIC`
   unsupported; bridge fixtures are not runtime evidence, not source
   rows, and not rating results. ISO `Ln,w` / `DeltaLw`, field
   `L'n,w` / `L'nT,w`, and building-prediction metrics must not alias
   to ASTM ratings. Gate BT selection status:
   `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_adapter_bridge_landed_no_runtime_selected_rating_procedure_exact_source_owner_gate_bu`.
   Selected next action:
   `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`.
   Selected next file:
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts`.
   Next plain label: floor-impact ASTM IIC/AIIC rating procedure and exact-source owner.
 - Personal-Use MVP Coverage Sprint Gate BU has now landed:
   `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`.
   It is a no-runtime ASTM `IIC` / `AIIC` rating-procedure and
   exact-source owner boundary. Gate BT's bridge can carry ASTM metrics,
   but real runtime still lacks executable ASTM E989 curve/rating
   owners, exact ASTM source precedence, source-absent ASTM uncertainty,
   and visible parity. Current real runtime still leaves `IIC` / `AIIC`
   unsupported; bridge fixtures are not runtime evidence, not source
   rows, and not rating results. ISO `Ln,w` / `DeltaLw`, field
   `L'n,w` / `L'nT,w`, building-prediction outputs, and ASTM E413/STC
   rows must not alias to ASTM E989 impact ratings. Gate BU selection
   status:
   `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_exact_source_owner_closed_no_runtime_selected_rating_curve_owner_scaffold_gate_bv`.
   Selected next action:
   `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`.
   Selected next file:
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv-floor-impact-astm-iic-aiic-rating-curve-owner-scaffold-contract.test.ts`.
   Next plain label: floor-impact ASTM IIC/AIIC rating curve owner scaffold.
 - Personal-Use MVP Coverage Sprint Gate BV has now landed:
   `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`.
   It is a no-runtime ASTM `IIC` / `AIIC` rating curve owner scaffold.
   Gate BV owns the declared ASTM impact one-third-octave curve
   completeness surface for lab `IIC` and field `AIIC`, rejects missing,
   extra, duplicate, and non-finite curve bands, requires AIIC field
   context, and opens future exact ASTM hook points without ingesting
   source documents or measured values. It still does not promote
   runtime because the executable ASTM E989 contour/rating owner, exact
   ASTM source precedence runtime owner, source-absent ASTM uncertainty,
   and visible parity are missing. Gate BT bridge fixtures and Gate BV
   curve probes are not runtime evidence or source rows. ISO `Ln,w` /
   `DeltaLw`, field `L'n,w` / `L'nT,w`, building-prediction outputs,
   and ASTM E413/STC rows must not alias to ASTM E989 impact ratings.
   Gate BV selection status:
   `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_landed_no_runtime_selected_contour_rating_owner_gate_bw`.
   Selected next action:
   `gate_bw_personal_use_mvp_floor_impact_astm_iic_aiic_contour_rating_owner_plan`.
   Selected next file:
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bw-floor-impact-astm-iic-aiic-contour-rating-owner-contract.test.ts`.
   Next plain label: floor-impact ASTM IIC/AIIC contour rating owner.
 - Broad Accuracy Reference Benchmark Expansion has now landed:
   `broad_accuracy_reference_benchmark_expansion_and_similarity_solver_plan`.
   It is a no-runtime calculator-grade benchmark expansion, not a source
   crawl. It creates the first broad reference ledger across existing
   floor exact/bound rows, verified airborne wall rows, timber/lightweight
   wall corpus rows, steel formula residual rows, triple-leaf
   calibration/holdout rows, and the 71-row controlled Matrix V6 as a
   guardrail only. It also creates the weak-lane debt ledger:
   `low_confidence`, `screening_fallback`, and `multileaf_screening_blend`
   are calculation debt and count as zero supported readiness rows.
   Selection status:
   `broad_accuracy_reference_benchmark_expansion_landed_no_runtime_selected_floor_system_similarity_anchor`.
   Selected next action:
   `broad_accuracy_floor_system_similarity_anchor_runtime_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-floor-system-similarity-anchor-contract.test.ts`.
   It remains inside the current gate; use the Validation section below
   for the latest file/test counts and known non-fatal warnings.
 - Broad Accuracy Floor-System Similarity Anchor has now landed:
   `broad_accuracy_floor_system_similarity_anchor_runtime_plan`.
   It is a no-runtime admission gate for the next floor calculation
   broadening, not a source crawl and not a value retune. It classifies
   90 UBIQ open-web exact rows, 21 UBIQ open-web bound rows, and 15 TUAS
   open-box exact rows, keeps those rows out of supported readiness
   counts, preserves exact-source precedence, and pins the existing
   FL-28 250 mm
   `predictor_lightweight_steel_fl28_interpolation_estimate` seed without
   moving runtime values. Direct-fixed open-web, open-box timber,
   field/building, and ASTM detours remain parked behind their owner
   fields. Selection status:
   `broad_accuracy_floor_system_similarity_anchor_landed_no_runtime_selected_open_web_supported_band_runtime_corridor`.
   Selected next action:
   `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts`.
   Selected next label: open-web steel supported-band similarity runtime
   corridor.
 - Broad Accuracy Open-Web Supported-Band Similarity Runtime has now
   landed:
   `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan`.
   It promotes only complete element-lab FL-24/FL-26 open-web steel
   supported-band stacks through
   `predictor_lightweight_steel_open_web_supported_band_similarity_estimate`.
   FL-26 250 mm timber returns `Ln,w 53.5`, `Ln,w+CI 52`, `Rw 61.5`;
   FL-24 250 mm timber returns `Ln,w 54.5`, `Ln,w+CI 53`, `Rw 60.5`;
   and FL-26 250 mm bare returns `Ln,w 61.5`, `Ln,w+CI 60`, `Rw 61.5`.
   Exact source rows and the existing FL-28 interpolation seed still
   win. Carpet, missing-fill, field/building, and ASTM/IIC aliases remain
   outside the promoted lane. Selection status:
   `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_landed_selected_surface_parity`.
   Selected next action:
   `broad_accuracy_open_web_supported_band_similarity_surface_parity_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity-contract.test.ts`.
   Selected next label: open-web supported-band similarity surface
   parity.
 - Broad Accuracy Open-Web Supported-Band Similarity Surface Parity has
   now landed:
   `broad_accuracy_open_web_supported_band_similarity_surface_parity_plan`.
   It keeps the runtime values frozen while cards, method dossier, saved
   replay, server snapshot replay, calculator API, impact-only API, and
   Markdown report all show `Open-web steel supported-band similarity`
   with the same
   `predictor_lightweight_steel_open_web_supported_band_similarity_estimate`
   basis, `89.5%` fit, exact-source precedence, and non-lab boundaries.
   FL-26 250 mm timber remains `Ln,w 53.5`, `Ln,w+CI 52`, `Rw 61.5`.
   Selection status:
   `broad_accuracy_open_web_supported_band_similarity_surface_parity_landed_selected_coverage_refresh`.
   Selected next action:
   `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh-contract.test.ts`.
   Selected next label: open-web supported-band similarity coverage
   refresh.
 - Broad Accuracy Open-Web Supported-Band Similarity Coverage Refresh has
   now landed:
   `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan`.
   It keeps the open-web steel supported-band similarity runtime frozen
   while the refreshed matrix pins FL-26 250 mm timber at `Ln,w 53.5`,
   preserves exact-source precedence and the existing FL-28 seed, blocks
   carpet, missing-fill, field, building, and ASTM/IIC aliases, and
   leaves direct-fixed open-web and open-box timber as ranked follow-ups.
   Selection status:
   `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_landed_selected_wall_multileaf_triple_leaf_solver`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-contract.test.ts`.
   Selected next label: wall multileaf triple-leaf calibrated solver.
 - Broad Accuracy Wall Multileaf Triple-Leaf Calibrated Solver has now
   landed:
   `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan`.
   It promotes only explicit NRC 2024 source-family Type C / glass-fiber
   grouped triple-leaf lab stacks through
   `broad_accuracy_wall_triple_leaf_nrc2024_calibrated_two_cavity_solver`.
   The calibrated row set returns Assembly B `Rw 49 / STC 60 / C 1.4 /
   Ctr -7.4`, Assembly A `Rw 58 / STC 64 / C 0.3 / Ctr -7.9`, and
   Assembly D `Rw 55 / STC 65 / C 1.2 / Ctr -7.5` with a `+/-4 dB`
   calibrated prediction budget. Rockwool / MLV / plaster local stacks,
   generic gypsum or glasswool substitutions, duplicate or missing
   grouped topology, and field or building outputs remain outside this
   calibrated lab lane. Exact source promotion remains a separate
   candidate and is not collapsed into the calibrated family solver.
   Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_landed_selected_surface_parity`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_plan`.
   Selected next file:
   `apps/web/features/workbench/wall-triple-leaf-calibrated-solver-surface-parity.test.ts`.
   Selected next label: wall triple-leaf calibrated solver surface
   parity.
 - Broad Accuracy Wall Triple-Leaf Calibrated Solver Surface Parity has
   now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_plan`.
   It keeps the NRC 2024 Type C / glass-fiber calibrated values frozen
   (`Rw 49 / STC 60 / C 1.4 / Ctr -7.4` for Assembly B) while exposing
   the calibrated source-family basis across cards, route posture,
   dynamic branch copy, method/corridor dossiers, local saved replay,
   server snapshot replay, calculator API payloads, and Markdown
   reports. Mixed lab-plus-field requests keep `R'w` and `DnT,w` parked
   as field input prompts instead of aliasing the lab `Rw`; the
   calibrated lab candidate remains visible for supported `Rw` / `STC` /
   `C` / `Ctr` cards even when the aggregate airborne basis reports
   `needs_input` for field outputs. Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_landed_selected_coverage_refresh`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh-contract.test.ts`.
   Selected next label: wall triple-leaf calibrated solver coverage
   refresh.
 - Broad Accuracy Wall Triple-Leaf Calibrated Solver Coverage Refresh has
   now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_plan`.
   It is a no-runtime executable coverage refresh. NRC 2024 Assembly B
   stays `Rw 49 / STC 60 / C 1.4 / Ctr -7.4`, Assembly A stays
   `Rw 58 / STC 64`, and Assembly D stays `Rw 55 / STC 65` through the
   calibrated Type C / glass-fiber solver. Mixed `R'w` and `DnT,w`,
   building-prediction outputs, exact-source admission, duplicate grouped
   topology, and partial grouped topology remain explicit boundaries.
   Generic gypsum / glasswool and local Rockwool / MLV / plaster stacks
   are selected for local substitution mapping because they are the
   nearest realistic wall-coverage blocker; direct-fixed open-web and
   open-box timber remain ranked follow-ups. Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_landed_selected_local_substitution_mapping`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping-contract.test.ts`.
   Selected next label: wall triple-leaf local substitution mapping.
 - Broad Accuracy Wall Triple-Leaf Local Substitution Mapping has now
   landed:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_plan`.
   It is a no-runtime mapping contract, not a source crawl and not a
   value retune. The NRC Type C / glass-fiber source-family control
   remains the only currently supported calibrated triple-leaf runtime.
   Generic gypsum / glasswool grouped stacks and local Rockwool / MLV /
   plaster grouped stacks are formula-corridor candidates only: generic
   stacks require board surface-mass/stiffness, glasswool flow
   resistivity, cavity/support, and substitution budget owners; local
   Rockwool / MLV / plaster stacks also require rockwool-to-glass-fiber,
   limp-mass position, plaster mass/damping, short-cavity, and paired
   negative-boundary owners. Field/building basis, duplicate grouping,
   and partial grouped topology remain explicit boundaries. Selection
   status:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_landed_no_runtime_selected_formula_corridor`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor-contract.test.ts`.
   Selected next label: wall triple-leaf local substitution formula
   corridor.
 - Broad Accuracy Wall Triple-Leaf Local Substitution Formula Corridor
   has now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_plan`.
   It is a no-runtime formula-definition gate. Generic gypsum /
   glasswool has an executable source-absent lab `Rw 49.3` design
   corridor with a `+/-6 dB` not-measured budget. Local Rockwool / MLV /
   plaster has an executable source-absent lab `Rw 52.8` design
   corridor with a `+/-8 dB` not-measured budget. Exact measured rows,
   the NRC Type C / glass-fiber calibrated control, field/building
   boundaries, and missing `STC` / `C` / `Ctr` adapters still take
   precedence. Generic/local live runtime values are not promoted by this
   gate. Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor-contract.test.ts`.
   Selected next label: wall triple-leaf local substitution runtime
   corridor.
 - Broad Accuracy Wall Triple-Leaf Local Substitution Runtime Corridor
   has now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_plan`.
   It promotes only lab `Rw`: complete grouped generic gypsum /
   glasswool returns live ISO-rounded `Rw 50` from a `Rw 49.3` formula
   design corridor with a `+/-6 dB` source-absent
   budget, and complete grouped local Rockwool / MLV / plaster returns
   live ISO-rounded `Rw 53` from a `Rw 52.8` formula design corridor
   with a `+/-8 dB` source-absent budget. The local stack
   supersedes the older Gate G `Rw 50` fixture, but exact measured rows
   and the NRC Type C / glass-fiber calibrated source-family control
   remain higher precedence. `STC`, `C`, `Ctr`, field, and building
   outputs remain blocked adapter boundaries. Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_landed_selected_surface_parity`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-surface-parity-contract.test.ts`.
   Selected next label: wall triple-leaf local substitution surface
   parity.
 - Broad Accuracy Wall Triple-Leaf Local Substitution Surface Parity has
   now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_plan`.
   It is a no-runtime closeout for the source-absent local-substitution
   route: output cards, route posture, dynamic branch copy, method
   dossier, local saved replay, server snapshot replay, calculator API
   payloads, and Markdown reports now expose `Wall triple-leaf local
   substitution` with the same candidate id, method, warning, Rw-only
   support, and not-measured budgets. Generic gypsum / glasswool remains
   `Rw 50` with `+/-6 dB`; local Rockwool / MLV / plaster remains
   `Rw 53` with `+/-8 dB`. `STC`, `C`, and `Ctr` stay unsupported, and
   `R'w` / `DnT,w` stay field-input prompts rather than lab aliases.
   Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_landed_selected_coverage_refresh`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh-contract.test.ts`.
   Selected next label: wall triple-leaf local substitution coverage
   refresh.
 - Broad Accuracy Wall Triple-Leaf Local Substitution Coverage Refresh
   has now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_plan`.
   It is a no-runtime matrix refresh: generic `Rw 50` and local
   Rockwool / MLV / plaster `Rw 53` stay frozen, `STC`, `C`, and `Ctr`
   remain unsupported until a lab spectrum adapter owns them, complete
   `R'w` / `DnT,w` field context stays on the Gate I field route rather
   than a lab alias, and building prediction stays blocked. Direct-fixed
   open-web and open-box timber remain ranked floor follow-ups. Selection
   status:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_landed_selected_lab_spectrum_adapter`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-contract.test.ts`.
   Selected next label: wall triple-leaf local substitution lab STC/C/Ctr
   spectrum adapter.
 - Broad Accuracy Wall Triple-Leaf Local Substitution Lab Spectrum Adapter
   has now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_plan`.
   It promotes only complete element-lab local-substitution wall
   triple-leaf `STC`, `C`, and `Ctr` from the calculated
   local-substitution transmission-loss curve while preserving generic
   `Rw 50` and local Rockwool / MLV / plaster `Rw 53`. Generic now
   returns `Rw 50 / STC 61 / C 1.6 / Ctr -7.2`; local now returns
   `Rw 53 / STC 64 / C 1.6 / Ctr -7.2`. STC-only requests use the same
   parent local-substitution curve rather than falling back to the older
   grouped Rockwool solver. Exact/calibrated precedence, `R'w` / `DnT,w`
   field-context ownership, building-prediction non-aliasing, partial
   topology, and duplicate grouping remain protected. Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_landed_selected_surface_parity`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity-contract.test.ts`.
   Selected next label: wall triple-leaf local substitution lab spectrum
   adapter surface parity.
 - Broad Accuracy Wall Triple-Leaf Local Substitution Lab Spectrum
   Adapter Surface Parity has now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_plan`.
   It is a no-runtime closeout: output cards, route posture, dynamic
   trace, method dossiers, local saved replay, server snapshot replay,
   calculator API payloads, and Markdown reports now expose the same lab
   spectrum adapter candidate, method, warning, values, and not-measured
   budgets. Generic remains `Rw 50 / STC 61 / C 1.6 / Ctr -7.2`; local
   Rockwool / MLV / plaster remains `Rw 53 / STC 64 / C 1.6 / Ctr
   -7.2`. Field/building outputs, exact precedence, partial topology,
   and duplicate grouping remain protected. Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_landed_selected_coverage_refresh`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh-contract.test.ts`.
   Selected next label: wall triple-leaf local substitution lab spectrum
   adapter coverage refresh.
 - Broad Accuracy Wall Triple-Leaf Local Substitution Lab Spectrum
   Adapter Coverage Refresh has now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_plan`.
   It is a no-runtime matrix refresh after the adapter surface closeout:
   generic remains `Rw 50 / STC 61 / C 1.6 / Ctr -7.2`, local Rockwool
   / MLV / plaster remains `Rw 53 / STC 64 / C 1.6 / Ctr -7.2`, and
   STC-only stays on the calculated lab spectrum adapter instead of
   copying `Rw`. Exact/calibrated precedence, mixed field `R'w` /
   `DnT,w`, building prediction, duplicate grouping, and partial
   topology remain protected. Direct-fixed open-web and open-box timber
   remain ranked follow-ups while same-family wall field context is now
   selected. Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_landed_selected_field_context_harmonization`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization-contract.test.ts`.
   Selected next label: wall triple-leaf local substitution field context
   harmonization.
 - Broad Accuracy Wall Triple-Leaf Local Substitution Field Context
   Harmonization has now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_plan`.
   This is a runtime movement for complete local Rockwool / MLV /
   plaster grouped triple-leaf `field_between_rooms` requests: the
   local-substitution lab curve (`Rw 53 / STC 64 / C 1.6 / Ctr -7.2`) is
   now the direct separating-element anchor, and the current contract
   fixture returns `R'w 51` and `DnT,w 53` with a `+/-10 dB`
   source-absent field error budget. Missing field context remains
   `needs_input`, building prediction remains unsupported until
   flanking/junction owners exist, and exact measured rows still win.
   Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_landed_selected_field_context_surface_parity`.
   Selected next action:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity-contract.test.ts`.
   Selected next label: wall triple-leaf local substitution field context
   surface parity. Direct-fixed open-web and open-box timber remain
   ranked follow-ups behind this wall surface-parity closeout.
 - Broad Accuracy Wall Triple-Leaf Local Substitution Field Context
   Surface Parity has now landed:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_plan`.
   This is a no-runtime closeout: cards, route posture, dynamic trace,
   method dossiers, local saved replay, server snapshot replay,
   calculator API payloads, and Markdown reports now expose the same
   local-substitution field-context basis, warning, candidate, values,
   and budget. The contract fixture remains `R'w 51 / DnT,w 53`, the
   workbench/API fixture remains `R'w 52 / DnT,w 53`, and both carry the
   `+/-10 dB` source-absent field budget without treating it as measured
   field evidence or a lab `Rw`/`STC` relabel. Missing field context,
   lab outputs, building prediction, and exact source precedence remain
   protected. Selection status:
   `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_landed_selected_open_web_direct_fixed_lining_transfer_owner`.
   Selected next action:
   `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_contract_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner-contract.test.ts`.
   Selected next label: floor open-web direct-fixed lining transfer owner
   contract. Open-box timber remains the ranked follow-up after
   direct-fixed open-web.
 - Broad Accuracy Floor Open-Web Direct-Fixed Lining Transfer Owner has
   now landed:
   `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_contract_plan`.
   This is a no-runtime owner contract. It classifies 54 UBIQ
   direct-fixed open-web exact rows across FL-23, FL-25, and FL-27,
   with 200/300/400 mm carriers, 16/19 mm INEX decks, bare/timber
   underlay/carpet finishes, and 2x13 / 2x16 / 3x16 direct linings.
   The contract owns carrier geometry, deck mass, upper finish delta,
   direct lining attachment, `Ln,w` / `CI` / `Ln,w+CI` transfer, `Rw`
   bridge, exact precedence, source-absent budget, and negative
   boundaries before runtime can promote. Resilient suspended-ceiling
   rows, open-box timber, field/building outputs, and ASTM/IIC aliases
   remain blocked. Selection status:
   `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_landed_no_runtime_selected_formula_corridor`.
   Selected next action:
   `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor-contract.test.ts`.
   Selected next label: floor open-web direct-fixed lining formula
   corridor.
 - Broad Accuracy Floor Open-Web Direct-Fixed Lining Formula Corridor
   has now landed:
   `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan`.
   This is a no-runtime formula-corridor contract. It defines
   same-family direct-fixed interpolation from the 54 UBIQ exact rows by
   FL-23 / FL-25 / FL-27 board schedule, 16/19 mm INEX deck, finish
   package, and 200/300/400 mm carrier depth. The representative 250 mm
   FL-23 / 19 mm timber-underlay design row is `Ln,w 71`, `CI -0.5`,
   `Ln,w+CI 70.5`, `Rw 51`, and `Rw+Ctr 43.5`, with source-absent
   design budgets of `+/-4 dB` for `Ln,w` and `+/-3 dB` for `Rw`.
   Exact rows still win; out-of-band carrier depths, field/building
   outputs, and ASTM/IIC aliases remain blocked. Selection status:
   `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
   Selected next action:
   `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor-contract.test.ts`.
   Selected next label: floor open-web direct-fixed lining runtime
   corridor.
 - Broad Accuracy Floor Open-Web Direct-Fixed Lining Runtime Corridor has
   now landed:
   `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan`.
   It promotes complete source-absent element-lab direct-fixed open-web
   stacks through
   `broad_accuracy_floor_open_web_direct_fixed_lining_direct_source_interpolation_formula_corridor`
   instead of the broad floor-family fallback. FL-23/FL-25/FL-27
   same-family source anchors now cover mid-depth direct-fixed variants:
   the 250 mm FL-23 / 19 mm timber-underlay runtime returns `Ln,w 71`,
   `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and `Rw+Ctr 43.5`; FL-25 bare
   and FL-27 carpet variants keep their formula-corridor pins. Runtime
   impact budgets stay visible as not-measured source-absent budgets
   (`+/-4 dB` for `Ln,w`, `+/-1.5 dB` for `CI`, `+/-4.5 dB` for
   `Ln,w+CI`; the formula owner still carries `+/-3 dB` for `Rw`).
   Exact rows still win; resilient supported-band stacks, out-of-band
   depths, duplicate carriers, field/building outputs, and ASTM/IIC
   aliases remain outside the runtime. Selection status:
   `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_landed_selected_surface_parity`.
   Selected next action:
   `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity-contract.test.ts`.
   Selected next label: floor open-web direct-fixed lining surface parity.
 - Broad Accuracy Floor Open-Web Direct-Fixed Lining Surface Parity has
   now landed:
   `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan`.
   It keeps output cards, route posture, impact lane labels, confidence
   provenance, metric-basis copy, corridor/method dossier, local saved
   replay, server snapshot replay, calculator API, impact-only API, and
   Markdown report on the same source-absent direct-fixed lab basis
   without moving runtime values. The visible FL-23 timber pin still
   reports `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and
   `Rw+Ctr 43.5` inside the FL-23/FL-25/FL-27 direct-fixed source grid
   with source-absent budgets. Exact rows, resilient supported-band
   stacks, out-of-band depths, duplicate carriers, field/building
   outputs, and ASTM/IIC aliases remain outside this lane. Selection
   status:
   `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_landed_selected_coverage_refresh`.
   Selected next action:
   `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh-contract.test.ts`.
   Selected next label: floor open-web direct-fixed lining coverage
   refresh.
 - Broad Accuracy Floor Open-Web Direct-Fixed Lining Coverage Refresh
   has now landed:
   `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan`.
   This is a no-runtime coverage refresh. It moves the direct-fixed
   FL-23/FL-25/FL-27 lane out of follow-up status and into the broad
   matrix as supported source-absent element-lab coverage: FL-23 keeps
   `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, `Rw+Ctr 43.5`; FL-25
   keeps `Ln,w 77`; FL-27 keeps `Ln,w 63`. Exact source precedence stays
   first for the 300 mm FL-23 exact row, resilient supported-band stacks
   stay on their separate lane, out-of-band depths and duplicate carriers
   stay outside the direct-fixed lane, and field/building plus ASTM/IIC
   outputs remain boundary rows. Selection status:
   `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_landed_selected_open_box_timber_transfer_owner`.
   Selected next action:
   `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts`.
   Selected next label: floor open-box timber similarity transfer owner.
 - Broad Accuracy Floor Open-Box Timber Similarity Transfer Owner has now
   landed:
   `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`.
   This is no-runtime owner work before formula promotion. It classifies
   the 15 TUAS open-box timber exact rows on the 370 mm
   `open_box_timber_slab` carrier, with 10 predictor-owned rows and 5
   exact-only hybrid / fragmented package rows
   (`tuas_r7b_open_box_timber_measured_2026`,
   `tuas_r8b_open_box_timber_measured_2026`,
   `tuas_r9b_open_box_timber_measured_2026`,
   `tuas_r2c_open_box_timber_measured_2026`, and
   `tuas_r10a_open_box_timber_measured_2026`). It owns the open-box
   support family, 8 mm laminate plus 3 mm EPS finish pair, upper package
   interaction, lower ceiling family, fragmented-package exact
   equivalence, ISO lab `Ln,w` / `CI` / `CI,50-2500` / `Ln,w+CI`
   transfer, `Rw` / companion `Rw+C` semantics, exact precedence,
   source-absent budget requirements, and negative boundaries. Open-web
   steel, raw bare open-box carriers, disjoint duplicate roles, partial
   laminate/EPS finishes, field/building outputs, and ASTM/IIC aliases
   remain blocked. Selection status:
   `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_landed_no_runtime_selected_formula_corridor`.
   Selected next action:
   `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`.
   Selected next label: floor open-box timber similarity formula
   corridor.
 - Broad Accuracy Floor Open-Box Timber Similarity Formula Corridor has
   now landed:
   `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`.
   This is no-runtime formula-corridor work. It defines TUAS same-family
   open-box timber package-transfer terms and source-absent design
   budgets without moving runtime values: the dry gypsum-fiber probe is
   `Ln,w 50.8` / `Rw 66`, with `+/-7 dB` impact and `+/-6 dB` airborne
   design budgets. Exact TUAS rows still win, raw bare open-box carriers
   stay blocked, exact-only hybrid and mixed staged packets cannot seed
   runtime yet, and field/building plus ASTM/IIC aliases remain outside
   the corridor. Selection status:
   `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
   Selected next action:
   `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`.
   Selected next file:
   `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts`.
   Selected next label: floor open-box timber similarity runtime
   corridor.

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- latest current-gate validation:
  `pnpm calculator:gate:current` was green on 2026-05-21 after the
  layer-combination resolver double-leaf framed wall banded surface
  parity closeout; engine 507 files / 2885 tests, web 94 files /
  388 passed + 18 skipped, repo build 5/5, and whitespace guard clean.
  Known non-fatal warnings remain the
  optional `sharp/@img` warnings from `@turbodocx/html-to-docx` plus
  Zustand test-storage warnings.
- current runtime validation note: the old Rockwool frozen/screening
  expectations, explicit local-substitution surface parity, coverage
  matrix, lab spectrum adapter, adapter surface parity, and adapter
  coverage refresh, field context harmonization, field context surface
  parity, direct-fixed open-web runtime/surface/coverage refresh, and
  open-box timber package-transfer/raw-bare/EPS-screed lanes are now
  refreshed for source-absent corridors. The next bounded implementation
  target is the post EPS/screed hybrid matrix refresh, not a broad source
  crawl or field/building / ASTM/IIC alias.
- checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-19_PRE_SPRINT_REVALIDATION_AND_OPEN_BOX_FORMULA_PLAN.md`
  confirms the current-gate validation and the detailed no-runtime
  formula-corridor implementation plan.
- previous checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-18_OPEN_BOX_TIMBER_TRANSFER_OWNER.md`
  confirms the current implementation/docs comparison, remaining gaps,
  validation status, and commit exclusions for generated/local artefacts.
- latest broad validation: `pnpm check` green on 2026-05-05 after
  Rockwool explicit screening-only policy Gate B; lint/typecheck clean,
  engine tests passed 382 files / 2262 tests, web tests passed 165
  files / 932 passed + 18 skipped, build 5 / 5 with the known non-fatal
  `sharp/@img` build warnings.
- web broad tests run through `tools/dev/run-web-vitest.ts`; it keeps
  the full web test file set in scope while isolating long route scans so
  Vitest worker RPC timeouts do not hide green test results
- keep `git diff --check` clean

## Boundaries

- treat `/home/ogttuna/Dev/Machinity/Acoustic2` as read-only upstream
- do not edit upstream from this repo
- keep workbench persistence assumptions honest:
  editing is still local-first, with explicit server sync/load available
