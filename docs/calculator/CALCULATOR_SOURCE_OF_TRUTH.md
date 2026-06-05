# Calculator Source Of Truth

Last reviewed: 2026-06-05

Document role: this is the first document to read before any acoustic
calculator implementation, planning, or handoff work. It defines the
product goal, the current implementation status, and the only acceptable
direction for future slices.

If this file conflicts with an older checkpoint, slice plan, roadmap, or
"selected next" handoff, this file wins. Historical files remain useful
for facts about what landed, but they do not select the next work.

## Product Goal

DynEcho must be a usable acoustic calculator and should become an
industry-grade acoustic calculator, not a source catalog, finite
scenario library, low-confidence detector, or research notebook. The
product bar is the kind of professional prediction tool an acoustic
engineer would compare with INSUL or similar sound-insulation prediction
software: users define a construction from layers and physical details,
then receive defensible airborne and impact insulation predictions.

The user chooses `wall` or `floor`, enters the layer materials, order,
thicknesses, requested outputs, and the physical/context inputs required
by that route. DynEcho then calculates every owned output it can
defensibly calculate, including `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`,
`L'nT,w`, STC, `C`, `Ctr`, `CI`, `CI,50-2500`, and related values.

The engine must choose the right acoustic family and formula for the
submitted combination. When the exact measured value is already owned
for the same stack, topology, metric, and basis, that exact value wins.
When a measured row is physically similar enough, it may anchor or
calibrate a prediction only through a named algorithm with matching
topology, metric scope, and basis. When no source row exists, DynEcho
must still calculate through the best owned family-specific model if the
required physical inputs are present.

Missing physical input is not permission to guess. It must return
`needs_input` with exact missing fields. Unsupported metric/basis
requests must return `unsupported` with the missing owner or standard.

## Calculator Advancement Test

Any selected implementation slice must pass this test before it is
treated as calculator work:

- it increases calculable scope for realistic wall/floor layer
  combinations when route-required physical inputs are present; or
- it improves numeric correctness, formula selection, calibration,
  anchor/delta handling, error budgets, or metric/basis boundaries for
  an existing calculator route; and
- it preserves visible `needs_input` / `unsupported` stops for missing
  physical inputs, unsupported standards, and unsafe metric aliases.

Work that only adds source-row inventory, finite examples, confidence
wording, UI/report polish, auth/storage behavior, or broad documentation
does not pass this test unless it is explicitly required to prove a
calculator scope/accuracy change selected by the active plan. Source
rows remain valuable as exact answers, anchors, calibration/holdout
evidence, and regression tests; they must not become the product goal.

## Non-Negotiable Answer Order

Every published answer must follow this order:

1. exact measured answer for the same stack, topology, metric, and basis;
2. compatible measured anchor when topology and metric scope allow it;
3. calibrated family formula;
4. source-absent family formula;
5. `needs_input` with exact missing physical fields;
6. `unsupported` with the missing basis, route, or standard owner.

Diagnostic curves, screening values, catalog hints, or helper lanes may
exist internally. They are not user-facing answers unless the selected
candidate owns the route, basis, metric set, required inputs, support
bucket, origin, and value pins.

## Metric And Basis Boundaries

Do not casually alias metrics or bases:

- lab `Rw` is not field `R'w`;
- `Rw` is not STC unless a selected owner explicitly owns that display;
- `Ln,w` is not IIC;
- lab impact is not field impact;
- field/apparent values are not building-prediction values;
- `DnT,A` / `DnT,A,k` evidence does not become `R'w` / `DnT,w` unless a
  selected adapter owns that conversion.

Mixed requests may publish only the outputs owned by the selected
candidate or by explicitly selected companion candidates. Stopped
outputs must remain visible as `needs_input` or `unsupported`.

## Current Implementation Status

Company-internal usable V1 is closed for the current tested envelope.
The binding V1 acceptance contract remains
[USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md), and its
Steps 0-5 are closed.

Current implementation facts:

- the answer-engine V1 contract exists in
  `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`;
- the company-internal acceptance gate exists in
  `packages/engine/src/acoustic-calculator-company-internal-usable-v1-acceptance-gate-contract.test.ts`;
- the shared resolver surface has 43 declared candidates and 40 active runtime-basis mappings;
  historical Gate H-M resolver snapshots recorded 42 declared candidates and 39 active runtime-basis mappings before Gate CG2 added the
  published upper-treatment owner;
- cards, answer charts, API payloads, Markdown reports, saved replay,
  server snapshot replay, and resolver traces are expected to show the
  same selected answer basis and stopped-output state;
- the latest documented full gate, after Gate DA on 2026-06-05, passed
  `NEXT_DIST_DIR=.next-gate-da pnpm calculator:gate:current` with
  engine 618 files / 3396 tests, web 113 files / 438 passed + 18
  skipped, repo build 5 / 5, and whitespace guard passed.
- previous landed value-moving runtime slice is Gate CO visible-layer
  upper-package `DeltaLw` routing:
  `post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan` with
  status
  `post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_landed_runtime_selected_next_numeric_coverage_gap_gate_cp`.
  Gate CO closes the Gate CN highest-ROI formula-routing gap: visible
  tagged timber joist and CLT upper-package floor stacks now derive the
  same route-owned predictor input used by the existing timber/CLT
  `DeltaLw` formula owners. Complete visible timber keeps exact
  `Ln,w 51` and calculates `DeltaLw 25.2`; with explicit
  `impactFieldContext` it also calculates `L'n,w 53 / L'nT,w 50.6 /
  L'nT,50 53.6`. Complete visible CLT keeps published-family `Ln,w 50`
  and calculates `DeltaLw 22.6`; with explicit `impactFieldContext` it
  also calculates `L'n,w 52 / L'nT,w 49.6 / L'nT,50 52.6`. Missing
  `loadBasisKgM2` or `resilientLayerDynamicStiffnessMNm3` remains
  `needs_input`, and ISO `DeltaLw` still does not alias to ASTM `IIC` /
  `AIIC`. Coverage counters: `newCalculableLayerTemplates 2`,
  `newCalculableRequestShapes 10`, `runtimeCorrectedLayerTemplates 0`,
  and `runtimeCorrectedRequestShapes 0`. Gate CO selected
  `post_v1_next_numeric_coverage_gap_gate_cp_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cp-contract.test.ts`.
- the latest landed no-runtime numeric coverage selection is Gate CP:
  `post_v1_next_numeric_coverage_gap_gate_cp_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_cp_landed_no_runtime_selected_floor_common_floating_lower_treatment_anchor_gate_cq`.
  Gate CP selected
  `floor.common_floating_lower_treatment_published_anchor_gap` as the
  highest-ROI next engine slice. The runtime gap is visible
  heavy-floating reinforced-concrete stacks with lower ceiling treatment:
  they currently calculate airborne `Rw` / `Ctr` but lose all requested
  impact outputs behind the combined-formula `loadBasisKgM2`
  `needs_input` guard. The published upper-treatment family already owns
  an `Ln,w` anchor for the elastic and rigid gypsum-ceiling variants, so
  Gate CQ can increase ISO impact scope for two common visible templates
  without source crawling or frontend work. Gate CQ must keep `Ln,w` and
  field impact companions live from that anchor while leaving `DeltaLw`
  as `needs_input` until `loadBasisKgM2` and
  `resilientLayerDynamicStiffnessMNm3` are present; complete inputs must
  remain on the heavy combined upper/lower formula corridor, and ASTM
  `IIC` / `AIIC` remain unsupported. Gate CP moved no runtime values.
  Counters: `candidateCount 8`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
  `estimatedNextNewCalculableLayerTemplates 2`, and
  `estimatedNextNewCalculableRequestShapes 10`. Gate CP selected
  `post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_plan` in
  `packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts`.
- the latest landed value-moving runtime slice is Gate CQ common floating
  lower-treatment anchor coverage:
  `post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_plan`
  with status
  `post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_landed_runtime_selected_next_numeric_coverage_gap_gate_cr`.
  Gate CQ keeps the published-family `Ln,w` anchor live for visible
  heavy-floating reinforced-concrete lower-treatment stacks instead of
  stopping all impact outputs behind the combined-formula needs-input
  guard. The `acoustic_hanger_ceiling` template calculates `Ln,w 43`;
  with explicit `impactFieldContext` it also calculates `L'n,w 45 /
  L'nT,w 42.6 / L'nT,50 46.6`. The `resilient_stud_ceiling` template
  calculates `Ln,w 51.5`; with explicit `impactFieldContext` it also
  calculates `L'n,w 53.5 / L'nT,w 51.1 / L'nT,50 55.1`. `DeltaLw`
  remains `needs_input` until `loadBasisKgM2` and
  `resilientLayerDynamicStiffnessMNm3` are present, complete physical
  inputs stay on the heavy combined upper/lower formula corridor, and
  ASTM `IIC` / `AIIC` remain unsupported. Coverage counters:
  `newCalculableLayerTemplates 2`, `newCalculableRequestShapes 10`, and
  `runtimeCorrectedRequestShapes 8`. Gate CQ selected
  `post_v1_next_numeric_coverage_gap_gate_cr_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cr-contract.test.ts`.
- the latest landed no-runtime numeric coverage selection is Gate CR:
  `post_v1_next_numeric_coverage_gap_gate_cr_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_cr_landed_no_runtime_selected_wall_common_auto_topology_second_pass_gate_cs`.
  Gate CR selected
  `wall.common_auto_topology_second_pass_after_cj` as the next
  highest-ROI engine-only formula-routing slice. Gate CQ closed the
  common floating lower-treatment anchor gap; ASTM user-band `IIC` /
  `AIIC` remains a separate shared/frontend input-surface program; and
  opening/leak/common-wall budget tightening remains blocked by Gate CL
  holdout requirements. The selected Gate CS runtime gap is explicit
  `flat_layer_order` wall entry: Gate CJ proved the support-owned common
  flat double-leaf `building_prediction` route can use the Gate S
  double-leaf/framed direct curve through the Gate AR building adapter,
  but safe explicit flat-order requests are still blocked by the older
  ambiguity guard. Gate CS must admit only safely segmentable flat-entry
  wall stacks with required support/stud owner inputs, preserve missing
  `supportTopology`, missing `studSpacingMm`, and missing
  `resilientBarSideCount` as `needs_input`, keep ambiguous multicavity
  flat lists blocked, and keep lab `Rw` / STC / `C` / `Ctr` separate
  from field/building `R'w` / `Dn,w` / `DnT,w` outputs. Gate CR moved no
  runtime values and touched no frontend implementation. Counters:
  `candidateCount 9`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
  `estimatedNextRuntimeCorrectedLayerTemplates 5`, and
  `estimatedNextRuntimeCorrectedRequestShapes 25`. Gate CR selected
  `post_v1_wall_common_auto_topology_second_pass_gate_cs_plan` in
  `packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts`.
- previous landed value-moving runtime slice is Gate CS wall common
  auto-topology second pass:
  `post_v1_wall_common_auto_topology_second_pass_gate_cs_plan` with
  status
  `post_v1_wall_common_auto_topology_second_pass_gate_cs_landed_runtime_selected_next_numeric_coverage_gap_gate_ct`.
  Gate CS closes the Gate CR selected wall flat-entry routing gap. Safe
  explicit `flat_layer_order` double-leaf wall requests with complete
  support/stud owner inputs now use the Gate S double-leaf/framed direct
  curve through the Gate AR building adapter instead of falling into the
  generic lab/field/building basis boundary. The explicit flat-order
  variants keep the Gate CJ pins: simple independent `R'w 39 / Dn,w 40 /
  Dn,A 38.5 / DnT,w 42 / DnT,A 40.9`, resilient both-sides `R'w 41 /
  Dn,w 42 / Dn,A 40.5 / DnT,w 44 / DnT,A 42.9`, multi-board `R'w 46 /
  Dn,w 47 / Dn,A 45.7 / DnT,w 49 / DnT,A 48.1`, split air/porous
  cavity `R'w 44 / Dn,w 44 / Dn,A 43.1 / DnT,w 47 / DnT,A 45.5`, and
  asymmetric board-count `R'w 43 / Dn,w 43 / Dn,A 42.1 / DnT,w 46 /
  DnT,A 44.5`. Gate CS carried explicit `flat_layer_order` multicavity
  stacks forward to a separate grouped multicavity owner instead of
  widening them in the double-leaf slice;
  missing `supportTopology`, missing `studSpacingMm`, and missing
  `resilientBarSideCount` remain `needs_input`; lab metrics still do not
  alias into field/building metrics. Coverage counters:
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 5`,
  `runtimeCorrectedLayerTemplates 5`, and
  `runtimeCorrectedRequestShapes 25`. Gate CS selected
  `post_v1_next_numeric_coverage_gap_gate_ct_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ct-contract.test.ts`.
- the latest landed no-runtime numeric coverage selection is Gate CT:
  `post_v1_next_numeric_coverage_gap_gate_ct_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_ct_landed_no_runtime_selected_wall_flat_layer_order_multicavity_gate_cu`.
  Gate CT selected
  `wall.flat_layer_order_multicavity_grouped_owner_gap` as the next
  highest-ROI engine-only formula-routing slice. The selected runtime
  gap is safe explicit `flat_layer_order` multicavity wall entry: a
  user-entered five-segment `leaf / cavity / leaf / cavity / leaf` stack
  with explicit `supportTopology` can already be represented by the
  existing grouped multicavity owner, but was still stopped by the older
  flat-order ambiguity guard. Gate CU must connect that layer order to
  the already-owned Gate AE multicavity lab formula and Gate I / Gate AR
  field/building adapters, preserve missing `supportTopology` as
  `needs_input`, keep contradictory explicit grouped indices blocked,
  keep lab/field/building metric owners separate, and avoid
  frontend/shared surface work. Gate CT moved no runtime values. Counters:
  `candidateCount 10`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
  `estimatedNextNewCalculableLayerTemplates 1`, and
  `estimatedNextNewCalculableRequestShapes 14`. Gate CT selected
  `post_v1_wall_flat_layer_order_multicavity_gate_cu_plan` in
  `packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts`.
- previous landed value-moving runtime slice is Gate CU wall flat
  layer-order multicavity routing:
  `post_v1_wall_flat_layer_order_multicavity_gate_cu_plan` with status
  `post_v1_wall_flat_layer_order_multicavity_gate_cu_landed_runtime_selected_next_numeric_coverage_gap_gate_cv`.
  Gate CU closes the Gate CT selected formula-routing gap. Safe explicit
  `flat_layer_order` multicavity wall requests with a five-segment
  leaf/cavity/leaf/cavity/leaf layer order and explicit
  `supportTopology` now calculate through the existing grouped
  multicavity owners. Lab requests publish `Rw 53 / STC 57 / C -0.6 /
  Ctr -8`; field and building requests publish `R'w 53 / Dn,w 53 /
  Dn,A 52 / DnT,w 54 / DnT,A 53.5`. Missing `supportTopology` remains
  `needs_input`, contradictory explicit grouped indices on
  `flat_layer_order` remain blocked, field/building requests still
  require their own room/flanking context, and lab metrics are not
  relabelled as field/building metrics without the owned adapters.
  Gate CU exact pins: `Rw 53 / STC 57 / C -0.6 / Ctr -8`; `R'w 53 / Dn,w 53 / Dn,A 52 / DnT,w 54 / DnT,A 53.5`.
  Coverage counters: `newCalculableLayerTemplates 1`,
  `newCalculableRequestShapes 14`, `runtimeCorrectedLayerTemplates 1`,
  and `runtimeCorrectedRequestShapes 14`. Gate CU selected
  `post_v1_next_numeric_coverage_gap_gate_cv_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cv-contract.test.ts`.
- previous landed no-runtime numeric coverage selection is Gate CV:
  `post_v1_next_numeric_coverage_gap_gate_cv_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_cv_landed_no_runtime_selected_wall_local_substitution_building_adapter_gate_cw`.
  Gate CV selected
  `wall.local_substitution_building_prediction_adapter_gap` as the next
  highest-ROI engine-only formula/adapter-routing slice. Gate CU closed
  the flat layer-order multicavity wall gap, and the Gate CQ
  lower-treatment direct/flanking field route is already runtime-capable
  when explicit direct/flanking context is present, so the next real
  value-moving scope gap is local-substitution triple-leaf wall building
  prediction. Lab `Rw/STC/C/Ctr` and field `R'w/DnT,w` are already owned
  for that local-substitution family, but the same complete stack with
  explicit `building_prediction` flanking, junction, room, and
  output-basis context still stops as unsupported. Gate CV moved no
  runtime values and touched no frontend implementation. Counters:
  `candidateCount 11`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
  `estimatedNextNewCalculableLayerTemplates 1`, and
  `estimatedNextNewCalculableRequestShapes 5`. Gate CV selected
  `post_v1_wall_local_substitution_building_adapter_gate_cw_plan` in
  `packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts`.
- the latest landed value-moving runtime slice is Gate CW wall
  local-substitution building adapter:
  `post_v1_wall_local_substitution_building_adapter_gate_cw_plan` with
  status
  `post_v1_wall_local_substitution_building_adapter_gate_cw_landed_runtime_selected_next_numeric_coverage_gap_gate_cx`.
  Gate CW closes the Gate CV selected formula/adapter-routing gap.
  Complete local Rockwool / MLV / plaster grouped triple-leaf wall
  requests with explicit `building_prediction` flanking, junction, room,
  panel, RT60, and output-basis inputs now calculate building outputs
  from the local-substitution lab curve instead of stopping as
  unsupported. The pinned building answer is `R'w 51 / Dn,w 51 /
  Dn,A 52.4 / DnT,w 53 / DnT,A 53.9` with a `+/-11 dB`
  source-absent budget. Missing `buildingPredictionOutputBasis`,
  `flankingJunctionClass`, `conservativeFlankingAssumption`, room
  volumes, RT60, panel dimensions, or `junctionCouplingLengthM` remains
  `needs_input`; exact same-stack field/building source rows remain
  higher precedence; lab and field local-substitution metric owners stay
  separate from building outputs. Coverage counters:
  `newCalculableLayerTemplates 1`, `newCalculableRequestShapes 5`,
  `runtimeCorrectedLayerTemplates 1`, and
  `runtimeCorrectedRequestShapes 5`. Gate CW selected
  `post_v1_next_numeric_coverage_gap_gate_cx_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cx-contract.test.ts`.
- previous landed no-runtime numeric coverage selection is Gate CX:
  `post_v1_next_numeric_coverage_gap_gate_cx_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_cx_landed_no_runtime_selected_floor_composite_panel_delta_lw_owner_gate_cy`.
  Gate CX selects
  `floor.composite_panel_delta_lw_published_interaction_owner_gap` as
  the next highest-ROI engine-only formula-owner slice. Composite-panel
  published-interaction routes already own same-family bare and treated
  `Ln,w` anchors for dry floating, suspended-ceiling, and combined
  treated stacks, but ISO `DeltaLw` remains unsupported for those
  visible treated combinations. Gate CY must add a separate
  composite-panel `DeltaLw` owner from same-family bare-minus-treated
  `Ln,w`; it must not borrow heavy-concrete Annex C formulas, must keep
  existing composite-panel `Rw` / `Ln,w` pins unchanged, must preserve
  missing owner fields as `needs_input`, and must not publish ASTM `IIC`
  / `AIIC` aliases. Gate CX moved no runtime values and touched no
  frontend implementation. Counters: `candidateCount 12`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
  `runtimeValuesMoved 0`, `estimatedNextNewCalculableLayerTemplates 3`,
  and `estimatedNextNewCalculableRequestShapes 3`. Gate CX selected
  `post_v1_floor_composite_panel_delta_lw_owner_gate_cy_plan` in
  `packages/engine/src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts`.
- the latest landed value-moving runtime slice is Gate CY floor
  composite-panel `DeltaLw` owner:
  `post_v1_floor_composite_panel_delta_lw_owner_gate_cy_plan` with
  status
  `post_v1_floor_composite_panel_delta_lw_owner_gate_cy_landed_runtime_selected_next_numeric_coverage_gap_gate_cz`.
  Gate CY closes the Gate CX selected formula-owner gap. Composite-panel
  published-interaction floor stacks now keep their existing `Rw` /
  `Ln,w` pins and calculate ISO `DeltaLw` from the same-family
  bare-minus-treated `Ln,w` owner: dry floating publishes
  `Ln,w 69.4 / Rw 45.1 / DeltaLw 14.6`, suspended-ceiling-only
  publishes `Ln,w 63.3 / Rw 48.6 / DeltaLw 20.7`, and combined
  upper/lower treatment publishes `Ln,w 48.5 / Rw 60.6 / DeltaLw 35.5`.
  Missing composite-panel owner fields remain `needs_input`, exact
  same-stack official PMC rows remain primary without source-absent
  `DeltaLw` aliases, wrong-family `DeltaLw` formulas are not borrowed,
  and ASTM `IIC` / `AIIC` remain unsupported. Coverage counters:
  `newCalculableLayerTemplates 3`, `newCalculableRequestShapes 3`,
  `runtimeCorrectedLayerTemplates 0`, and
  `runtimeCorrectedRequestShapes 0`. Gate CY selected
  `post_v1_next_numeric_coverage_gap_gate_cz_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cz-contract.test.ts`.
- the latest landed no-runtime numeric coverage selection is Gate CZ:
  `post_v1_next_numeric_coverage_gap_gate_cz_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_cz_landed_no_runtime_selected_floor_lightweight_concrete_delta_lw_owner_contract_gate_da`.
  Gate CZ selected
  `floor.lightweight_concrete_delta_lw_family_owner_contract_gap` as the
  next highest-ROI engine-only owner-contract slice. Gate M already owns
  lightweight-concrete family `Rw` / `Ln,w` routes, and Gate N already
  proves explicit field-impact companions can adapt that owned `Ln,w`
  anchor when field context is present. ISO `DeltaLw` remains blocked
  because the lightweight family does not yet have a family-specific
  owner contract for bare-vs-treated or dynamic-improvement basis. Gate
  DA must pin that owner contract before runtime values move; it must
  not borrow heavy-concrete Annex C, composite-panel bare-minus-treated,
  timber/CLT, or steel mass-spring `DeltaLw` routes, must keep existing
  lightweight-concrete `Rw` / `Ln,w` / field-impact pins unchanged, must
  preserve missing owner fields as `needs_input` or `unsupported`, and
  must not publish ASTM `IIC` / `AIIC` aliases. Gate CZ moved no runtime
  values and touched no frontend implementation. Counters:
  `candidateCount 13`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
  `estimatedNextNewCalculableLayerTemplates 0`,
  `estimatedNextNewCalculableRequestShapes 0`,
  `estimatedFollowOnNewCalculableLayerTemplates 2`, and
  `estimatedFollowOnNewCalculableRequestShapes 2`. Gate CZ selected
  `post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_plan`
  in
  `packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da-contract.test.ts`.
- the latest landed lightweight-concrete `DeltaLw` owner-boundary action
  is Gate DA:
  `post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_plan`
  with status
  `post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_landed_runtime_boundary_selected_delta_lw_runtime_corridor_gate_db`.
  Gate DA closes the Gate CZ selected owner-contract step for
  `floor.lightweight_concrete.delta_lw_family_owner_contract`. It does
  not publish new lightweight-concrete `DeltaLw` values yet. It pins
  `baseSlabThicknessMm`,
  `baseSlabDensityKgM3_or_lightweightConcreteMaterialClass`,
  `upperTreatmentState`, `floorCoveringOrWalkingSurface`,
  `resilientLayerOrToppingState`,
  `resilientLayerDynamicStiffnessMNm3_or_productCurve`,
  `loadBasisKgM2`, and `elementLabMetricBasis` as no-default physical
  owner fields. It also corrects a wrong-family runtime boundary:
  low-density predictor input with complete dynamic stiffness and load
  basis stays on the lightweight-concrete `Rw` / `Ln,w` route and does
  not borrow `heavy_concrete_annex_c_delta_lw`. Composite-panel
  bare-minus-treated, timber/CLT, and steel mass-spring `DeltaLw` routes
  remain forbidden for this family. Existing visible lightweight-concrete
  `Rw 53 / Ln,w 64.3`, the Gate M non-dynamic low-density predictor
  `Rw 49 / Ln,w 47`, and field-impact companions stay unchanged; the
  complete dynamic low-density predictor also stays lightweight at
  `Rw 53 / Ln,w 64.3` without `DeltaLw`. `DeltaLw` remains unsupported
  until Gate DB lands the family runtime corridor, and ASTM `IIC` /
  `AIIC` remain unsupported. Counters: `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeCorrectedRequestShapes 1`,
  and `falseHeavyConcreteDeltaLwPublicationsPrevented 1`. Gate DA
  selected
  `post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan`
  in
  `packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db-contract.test.ts`.
- previous landed value-moving runtime slice is Gate CK opening/leak
  composite wall adapters:
  `post_v1_opening_leak_composite_wall_adapters_gate_ck_plan` with
  status
  `post_v1_opening_leak_composite_wall_adapters_gate_ck_landed_runtime_selected_next_numeric_coverage_gap_gate_cl`.
  Gate CK makes explicit top-level wall opening/leak field and building
  contexts use the already-owned Gate S lab composite `Rw` anchor plus
  the company-internal field/building area-energy adapters without
  requiring a hidden `openingLeakFieldBuildingAdapterBoundary` flag.
  Complete field opening/leak context publishes `R'w 36.4 / Dn,w 36.7 /
  DnT,w 36.9`; complete building-prediction opening/leak context
  publishes `R'w 31.6 / DnT,w 32.1`. Missing room/flanking terms still
  stop as `needs_input`, A-weighted opening/leak outputs still require
  `frequencyBandSet`, and lab `Rw` / STC remain separate from field and
  building metrics. Coverage counters: `newCalculableLayerTemplates 2`,
  `newCalculableRequestShapes 5`, `runtimeCorrectedLayerTemplates 2`,
  and `runtimeCorrectedRequestShapes 5`. Gate CK selected
  `post_v1_next_numeric_coverage_gap_gate_cl_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts`.
- the latest landed no-runtime accuracy selection is Gate CL residual
  accuracy and holdout gating:
  `post_v1_next_numeric_coverage_gap_gate_cl_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_cl_landed_no_runtime_selected_required_physical_input_surface_parity_gate_cm`.
  Gate CL did not move runtime values. It added five source-owned
  residual ledgers across common flat double-leaf building prediction,
  opening/leak field/building, open-box raw-bare lab impact, open-web
  raw-bare lab impact, and heavy floating upper-treatment field
  companion routes. All five hold the existing wider error budgets until
  same-family calibration rows and same-basis holdout rows exist; nearby
  source rows are not runtime promotion evidence by themselves. Counters:
  `residualLedgers 5`, `budgetsHeldWide 5`, `budgetsTightened 0`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
  `runtimePromotionsFromSourceProximity 0`. Gate CL selected
  `post_v1_required_physical_input_surface_parity_gate_cm_plan` in
  `packages/engine/src/post-v1-required-physical-input-surface-parity-gate-cm-contract.test.ts`.
- the latest landed no-runtime input-surface guard is Gate CM:
  `post_v1_required_physical_input_surface_parity_gate_cm_plan` with
  status
  `post_v1_required_physical_input_surface_parity_gate_cm_landed_no_runtime_selected_next_numeric_coverage_gap_gate_cn`.
  Gate CM pins selected-route required physical input and `needs_input`
  boundaries for Gate CK opening/leak field/building, Gate CJ common flat
  double-leaf building prediction, Gate CG2 heavy-floating dynamic
  `DeltaLw`, and Gate CH direct/flanking field-impact `L'nT,50`. It did
  not move runtime values, touch frontend implementation, retune formulas,
  or crawl source rows. Counters: `inputSurfaceLedgers 4`,
  `requiredPhysicalInputsPinned 20`, `guardedRequestShapes 15`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
  `runtimeValuesMoved 0`. Gate CM selected
  `post_v1_next_numeric_coverage_gap_gate_cn_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cn-contract.test.ts`.
- previous landed no-runtime numeric coverage selection is Gate CN:
  `post_v1_next_numeric_coverage_gap_gate_cn_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_cn_landed_no_runtime_selected_floor_visible_layer_upper_package_delta_lw_gate_co`.
  Gate CN selected
  `floor.visible_layer_upper_package_delta_lw_formula_routing_gap` as
  the highest-ROI next engine slice because existing timber/CLT
  `DeltaLw` formula owners calculate with explicit predictor input, but
  visible tagged CLT and timber upper-package layer stacks with the same
  physical inputs still publish only `Ln,w`. Gate CN moved no runtime
  values, touched no frontend implementation, selected no source crawl,
  and blocked confidence wording as a non-goal. Counters:
  `candidateCount 7`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
  `estimatedNextNewCalculableLayerTemplates 2`, and
  `estimatedNextNewCalculableRequestShapes 10`. Gate CN selected
  `post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan` in
  `packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts`.
- previous landed value-moving runtime slice is Gate CH field/building
  direct+flanking low-frequency correction:
  `post_v1_next_numeric_coverage_gap_gate_ch_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_ch_landed_runtime_selected_next_numeric_coverage_gap_gate_ci`.
  Gate CH keeps the Gate CG2 published upper-treatment `Ln,w 50` anchor
  live for complete visible heavy-floating reinforced-concrete
  upper-treatment stacks and uses explicit direct/flanking impact
  context plus explicit `impactFieldContext.ci50_2500Db` to publish
  `L'n,w 57.5 / L'nT,w 55.1 / L'nT,50 59.1` through the
  `source_absent_field_building_adapter_error_budget` field adapter.
  Missing `impactFieldContext.ci50_2500Db` still stops only
  `L'nT,50` as `needs_input`; ASTM `IIC` / `AIIC` remain unsupported
  without ASTM E492/E1007 owners. Coverage counters:
  `newCalculableLayerTemplates 2`, `newCalculableRequestShapes 4`, and
  `runtimeCorrectedRequestShapes 3`. Gate CH selected
  `post_v1_next_numeric_coverage_gap_gate_ci_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts`.
- the latest landed no-runtime selection is Gate CI:
  `post_v1_next_numeric_coverage_gap_gate_ci_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_ci_landed_no_runtime_selected_wall_common_auto_topology_expansion_gate_cj`.
  Gate CI preserves the exact ASTM E492/E1007 one-third-octave
  `IIC`/`AIIC` owner and proves representative ISO impact routes keep
  ASTM aliases unsupported. No formula-derived ASTM runtime expansion is
  admitted until a true ASTM band owner exists, and user-supplied ASTM
  band input is deferred until a separate API/workbench/report/replay
  surface slice is selected. Gate CI selected
  `wall.common_auto_topology_expansion` and
  `post_v1_wall_common_auto_topology_expansion_gate_cj_plan` in
  `packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts`.
  The implementation comparison plan is
  `docs/calculator/POST_V1_GATE_CI_CJ_ENGINE_PLAN_2026-06-05.md`.
- previous landed value-moving runtime slice is Gate CJ:
  `post_v1_wall_common_auto_topology_expansion_gate_cj_plan` with
  status
  `post_v1_wall_common_auto_topology_expansion_gate_cj_landed_runtime_selected_opening_leak_composite_wall_adapters_gate_ck`.
  Gate CJ makes common flat double-leaf wall `building_prediction`
  requests use the Gate S double-leaf/framed direct curve inside the
  Gate AR building adapter when `supportTopology`, `studSpacingMm`,
  room/flanking context, and any required `resilientBarSideCount` are
  explicit. It corrects generic building fallback for simple
  independent, resilient both-sides, multi-board, split air/porous
  cavity, and asymmetric board-count flat stacks, and it opens explicit
  double-leaf building topology. Missing support, missing stud spacing,
  explicit `flat_layer_order`, missing `sourceRoomVolumeM3`, and missing
  resilient side count remain value-less boundaries. Gate CJ selected
  `post_v1_opening_leak_composite_wall_adapters_gate_ck_plan` in
  `packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts`.
- previous landed value-moving runtime slice: Gate CG2 common
  floor floating/covering expansion:
  `post_v1_floor_common_floating_covering_expansion_gate_cg2_plan` with
  status
  `post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch`.
  Gate CG2 makes visible heavy-floating reinforced-concrete
  upper-treatment stacks calculate more of what is already defensibly
  owned: missing `loadBasisKgM2` or
  `resilientLayerDynamicStiffnessMNm3` no longer hides the
  published-family `Ln,w 50` anchor, while `DeltaLw` remains
  `needs_input` for the exact missing owner field. With complete
  `impactFieldContext`, the same anchor publishes `L'n,w 52`,
  `L'nT,w 49.6`, and `L'nT,50 53.6`; complete explicit dynamic input
  still uses the existing floating formula at `Ln,w 50.3` /
  `DeltaLw 24.3`. ASTM `IIC` / `AIIC` remain unsupported without ASTM
  E492/E1007 owners. Coverage counters:
  `newCalculableLayerTemplates 2`, `newCalculableRequestShapes 10`, and
  `runtimeCorrectedRequestShapes 8`. Gate CG2 selected
  `post_v1_next_numeric_coverage_gap_gate_ch_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts`.
- earlier landed value-moving runtime slice: Gate CF target-output
  independence sweep:
  `post_v1_target_output_independence_sweep_gate_cf_plan` with status
  `post_v1_target_output_independence_sweep_gate_cf_landed_selected_floor_common_floating_covering_expansion_gate_cg`.
  Gate CF repairs and pins target-output independence across existing
  runtime families. Flat double-leaf and full-fill multileaf wall
  `field_between_rooms` contexts now calculate single-output `Rw`, STC,
  `C`, and `Ctr` through the owned family route instead of screening
  fallback or unsupported publication. Gate CF also pins single-output
  parity for raw-bare open-web/open-box field impact, heavy-concrete
  combined lab impact, and steel suspended-ceiling field impact.
  Coverage counters: `newSingleOutputParityPins 37`,
  `runtimeCorrectedRequestShapes 8`, `newCalculableRequestShapes 8`,
  and `newCalculableLayerTemplates 0`. Missing field
  `receivingRoomRt60S` still stops field outputs as `needs_input`; ISO
  impact routes still do not publish ASTM `IIC` / `AIIC`; field-only wall
  requests still do not widen into unrequested lab `Rw`.
- Gate CF selected
  `post_v1_floor_common_floating_covering_expansion_gate_cg_plan`.
  Gate CF selected next file:
  `packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg-contract.test.ts`.
- earlier landed value-moving runtime slice: Gate CG common
  floor floating/covering expansion:
  `post_v1_floor_common_floating_covering_expansion_gate_cg_plan` with
  status
  `post_v1_floor_common_floating_covering_expansion_gate_cg_landed_partial_selected_floor_common_floating_covering_expansion_gate_cg2`.
  Gate CG fixes a real floor-impact scope defect: visible
  floor-covering-only heavy/reinforced concrete stacks now keep the
  owned bare-heavy `Ln,w` answer live when `DeltaLw` or field impact
  companions are also requested. Representative covering templates
  publish `Ln,w 71.2`, `71.6`, `71.5`, and `71.4`; with explicit
  `impactFieldContext` they also publish `L'n,w`, `L'nT,w`, and
  `L'nT,50`. `DeltaLw` remains `needs_input` for
  `toppingOrFloatingLayer`, `resilientLayerDynamicStiffnessMNm3`, and
  `loadBasisKgM2`; ASTM `IIC` / `AIIC` remain unsupported without ASTM
  E492/E1007 owners. Coverage counters:
  `newCalculableLayerTemplates 4`, `newCalculableRequestShapes 20`, and
  `runtimeCorrectedRequestShapes 12`. Gate CG selects
  `post_v1_floor_common_floating_covering_expansion_gate_cg2_plan` in
  `packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts`
  because the broader Gate CG plan still needs more common
  floating/lower-treatment templates before moving to the next candidate
  family.
- the previous value-moving runtime slice is Gate CD open-box
  target-output independence:
  `post_v1_floor_open_box_target_output_independence_gate_cd_plan`
  with status
  `post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce`.
  This is runtime scope/correctness movement: complete dry
  package-transfer and EPS/screed hybrid building/impact requests now
  support already-owned single-output asks without requiring an
  additional `R'w` or building-output request. Dry single-output pins
  include `Rw 66`, `C -3.9`, `Ln,w 50.8`, `L'n,w 52.8`,
  `L'nT,w 50.4`, and `L'nT,50 53.7`; EPS/screed pins include
  `Rw 72`, `C -1.3`, `Ln,w 47`, `L'n,w 49`,
  `L'nT,w 46.6`, and `L'nT,50 47.6`. Missing `impactFieldContext`
  still leaves `L'n,w`, `L'nT,w`, and `L'nT,50` unsupported.
  `Ctr`, ASTM `IIC`, and ASTM `AIIC` remain unsupported without their
  own owner.
- the previous no-runtime selection slice is Gate CE:
  `post_v1_next_numeric_coverage_gap_gate_ce_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_ce_landed_no_runtime_selected_target_output_independence_sweep_gate_cf`.
  It ranked the eight high-ROI scope/accuracy candidates from
  `POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md`,
  blocked broad source crawling, finite scenario packs, confidence
  wording, and generic UI/report/storage/auth work as non-goals, and
  selected `target_output_independence_sweep`, now closed by Gate CF.
- the previous no-runtime selection is Gate CC:
  `post_v1_next_numeric_coverage_gap_gate_cc_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_cc_landed_no_runtime_selected_floor_open_box_target_output_independence_gate_cd`.
  It selected
  `floor.open_box_timber_finished_package.target_output_independence_gap`
  and is now closed by Gate CD. Gate CC selected next file:
  `packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts`.
- the previous value-moving runtime slice is Gate CB open-box
  EPS/screed full mixed field/building:
  `post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan`
  with status
  `post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_landed_selected_next_numeric_coverage_gap_gate_cc`.
  Complete EPS/screed full mixed building/impact requests apply the
  already-owned explicit field-impact adapter beside the owned airborne
  building answer. EPS/screed hybrid publishes `Rw 72 / C -1.3`,
  `R'w 70 / DnT,w 73`,
  `Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`, and
  `L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`.
- the previous no-runtime selection is Gate CA:
  `post_v1_next_numeric_coverage_gap_gate_ca_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_ca_landed_no_runtime_selected_floor_open_box_eps_screed_full_mixed_field_building_gate_cb`.
  It selected
  `floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap`
  and is now closed by Gate CB.
- the previous value-moving runtime slice is Gate BZ:
  `post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan`
  with status
  `post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_landed_selected_next_numeric_coverage_gap_gate_ca`.
  Gate BZ keeps finished open-box full mixed building/impact outputs
  live together. Dry package-transfer publishes `Rw 66 / C -3.9`,
  `R'w 64 / DnT,w 67`,
  `Ln,w 50.8 / CI 1.2 / CI,50-2500 3.3 / Ln,w+CI 52`, and
  `L'n,w 52.8 / L'nT,w 50.4 / L'nT,50 53.7`. EPS/screed hybrid
  publishes `Rw 72 / C -1.3`, `R'w 70 / DnT,w 73`,
  `Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`, and after Gate CB
  `L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`.
- the previous no-runtime selection is Gate BY:
  `post_v1_next_numeric_coverage_gap_gate_by_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_by_landed_no_runtime_selected_floor_open_box_finished_package_full_mixed_building_impact_gate_bz`.
  It selected
  `floor.open_box_timber_finished_package.full_mixed_building_impact_gap`
  and is now closed by Gate BZ.
- the previous value-moving runtime slice is Gate BX:
  `post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan`
  with status
  `post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_landed_selected_next_numeric_coverage_gap_gate_by`.
  Gate BX projected owned finished-package lab metrics into mixed
  lab-impact and lab-field-impact answers. Dry package-transfer
  publishes `Rw 66 / C -3.9`; EPS/screed hybrid publishes
  `Rw 72 / C -1.3`. `Ctr` remains unsupported because these package
  owners declare `Rw+C`, not a true `Ctr`.
- the previous no-runtime selection is Gate BW:
  `post_v1_next_numeric_coverage_gap_gate_bw_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_bw_landed_no_runtime_selected_floor_open_box_finished_package_lab_metric_projection_gate_bx`.
  It selected
  `floor.open_box_timber_finished_package.lab_metric_projection_gap`
  and is now closed by Gate BX.
- the previous value-moving runtime slice is Gate BV:
  `post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_plan`
  with status
  `post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_landed_selected_next_numeric_coverage_gap_gate_bw`.
  Gate BV kept package lab `Rw/C` live beside finished open-box building
  outputs: dry `Rw 66 / C -3.9` with `R'w 64 / DnT,w 67`, and
  EPS/screed `Rw 72 / C -1.3` with `R'w 70 / DnT,w 73`.
- the previous no-runtime selection is Gate BT:
  `post_v1_next_numeric_coverage_gap_gate_bt_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_bt_landed_no_runtime_selected_floor_open_box_finished_package_airborne_building_companion_gate_bu`.
  It selected
  `floor.open_box_timber_finished_package.airborne_building_companion_gap`
  and is now closed by Gate BU.
- closed Gate BF-BH continuity anchors remain historical evidence, not
  the current selection. Gate BF landed
  `post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
  with status
  `post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_landed_selected_next_numeric_coverage_gap_gate_bg`,
  selected `post_v1_next_numeric_coverage_gap_gate_bg_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts`,
  and opened assembly field-only lower-treatment pins
  `L'n,w 47.6 / L'nT,w 44.8 / L'nT,50 48.8`. Gate BG landed as
  `post_v1_next_numeric_coverage_gap_gate_bg_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_bg_landed_no_runtime_selected_floor_mixed_support_family_owner_boundary_gate_bh`,
  selected `floor.mixed_support_family.multi_family_solver_gap`, and
  selected `post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan`
  in
  `packages/engine/src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh-contract.test.ts`
  as scope/accuracy work. Gate BH landed as
  `post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan` with
  status
  `post_v1_floor_mixed_support_family_owner_boundary_gate_bh_landed_no_runtime_selected_floor_mixed_support_family_runtime_corridor_gate_bi`,
  pinned `primaryCarrierFamily`, `dominantImpactTransferFamily`,
  `mixedSupportRolePartition`, `secondarySupportTreatmentOwner`, and
  `duplicateOwnershipGuard`, and selected
  `post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan` in
  `packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts`
  as scope/accuracy owner-boundary follow-through.
- Gate BH has now landed as
  `post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan` with
  status
  `post_v1_floor_mixed_support_family_owner_boundary_gate_bh_landed_no_runtime_selected_floor_mixed_support_family_runtime_corridor_gate_bi`.
  It pins `primaryCarrierFamily`, `dominantImpactTransferFamily`,
  `mixedSupportRolePartition`, `secondarySupportTreatmentOwner`, and
  `duplicateOwnershipGuard` as no-default mixed-support owner fields.
  Existing mixed-support stacks stay fail-closed behind
  `duplicateOwnershipGuard`, and ASTM `IIC` / `AIIC` aliases remain
  unsupported. Gate BH selected
  `post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan` in
  `packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts`.
  Gate BI may move runtime values only for the admitted explicit
  single-primary-carrier mixed-support subset.
- Gate BI has now landed as
  `post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan` with
  status
  `post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_landed_selected_floor_mixed_support_family_surface_parity_gate_bj`.
  It opens runtime only for the explicit single-primary-carrier
  mixed-support subset and publishes `Ln,w 44.6` / `DeltaLw 29.9` from
  the guarded mixed-support corridor. With explicit
  `impactFieldContext`, the same lab anchor also publishes
  `L'n,w 46.6`, `L'nT,w 43.8`, and `L'nT,50 47.8`. Missing owner fields
  remain `needs_input`, unsafe duplicate partitions do not fall through
  to another solver, and ASTM `IIC` / `AIIC` remain unsupported. Gate BI
  selected `post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan`
  in
  `packages/engine/src/post-v1-floor-mixed-support-family-surface-parity-gate-bj-contract.test.ts`.
- Gate BJ has now landed as
  `post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan` with
  status
  `post_v1_floor_mixed_support_family_surface_parity_gate_bj_landed_no_runtime_selected_next_numeric_coverage_gap_gate_bk`.
  It is no-runtime surface parity plus usage-placement correction:
  workbench cards, Markdown report, saved replay, estimate API,
  impact-only API, resolver trace, and dynamic impact trace now expose
  the same Gate BI mixed-support answer. The pins remain `Ln,w 44.6` /
  `DeltaLw 29.9` and `L'n,w 46.6` / `L'nT,w 43.8` / `L'nT,50 47.8`
  with explicit field context. Gate BJ also keeps the ready explicit
  mixed-support predictor lane from being parked behind the older generic
  floor-impact needs-input guard in `calculateAssembly`. Missing owner
  fields, unsafe duplicate partitions, and ASTM `IIC` / `AIIC` aliases
  remain blocked. Gate BJ selected
  `post_v1_next_numeric_coverage_gap_gate_bk_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bk-contract.test.ts`.
- Gate BK has now landed as
  `post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan` with
  status
  `post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl`.
  It is runtime coverage movement, not source inventory or UI polish:
  the raw-bare open-web steel base-only stack already had lab `Ln,w 96`,
  `CI 1.8`, `CI,50-2500 5.2`, and `Ln,w+CI 97.8`; with explicit
  `impactFieldContext` it now calculates field companions `L'n,w 98`,
  `L'nT,w 95.6`, and `L'nT,50 100.8`. Field-only requests compute the
  lab anchor internally instead of requiring `Ln,w` to be requested.
  Missing field context remains `needs_input`; building prediction,
  open-box raw-bare field transfer, and ASTM `IIC` / `AIIC` aliases
  remain blocked. Gate BK selected
  `post_v1_next_numeric_coverage_gap_gate_bl_plan`.
- Gate BL has now landed as the no-runtime numeric coverage rerank
  selected by Gate BK:
  `post_v1_next_numeric_coverage_gap_gate_bl_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_bl_landed_no_runtime_selected_floor_open_box_raw_bare_field_companion_gate_bl`.
  It selected
  `floor.open_box_timber_raw_bare.field_companion_runtime_gap` and the
  next runtime action
  `post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan` in
  `packages/engine/src/post-v1-floor-open-box-raw-bare-field-companion-gate-bl-contract.test.ts`.
  The active plan is
  [POST_V1_GATE_BL_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md](./POST_V1_GATE_BL_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md).
  Gate BL itself moves no runtime values; the selected runtime slice must
  calculate open-box raw-bare field companions through explicit
  `impactFieldContext`, with acceptance pins `L'n,w 93.1`, `L'nT,w 90.7`,
  and `L'nT,50 94.1` for the 220 mm carrier. Building prediction
  and ASTM `IIC` / `AIIC` remain blocked.
- Gate BL runtime has now landed as
  `post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan` with
  status
  `post_v1_floor_open_box_raw_bare_field_companion_gate_bl_landed_selected_next_numeric_coverage_gap_gate_bm`.
  This is runtime calculator coverage: raw-bare open-box timber floors
  now apply the existing explicit `impactFieldContext` adapter when
  context mode is not `building_prediction`. The 220 mm carrier keeps
  lab `Ln,w 91.1`, `CI -0.9`, `CI,50-2500 3.4`, and `Ln,w+CI 90.2`;
  with `fieldKDb 2` and receiving room volume `55 m3` it calculates
  `L'n,w 93.1`, `L'nT,w 90.7`, and `L'nT,50 94.1`. The 370 mm carrier
  calculates `L'n,w 90.2`, `L'nT,w 87.8`, and `L'nT,50 90.9` with the
  same field context. Field-only requests derive the lab anchor
  internally. Missing `impactFieldContext` still stops field outputs as
  `needs_input`; building prediction and ASTM `IIC` / `AIIC` remain
  blocked. Validation after Gate BL runtime: `pnpm
  calculator:gate:current` passed with engine 576 files / 3189 tests,
  web 113 files / 437 passed + 18 skipped, repo build 5 / 5, and
  whitespace guard passed. Gate BL selected
  `post_v1_next_numeric_coverage_gap_gate_bm_plan`.
- Gate BM has now landed as
  `post_v1_next_numeric_coverage_gap_gate_bm_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_bm_landed_runtime_selected_next_numeric_coverage_gap_gate_bn`.
  It is runtime calculator coverage for
  `floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap`:
  the 300 mm raw-bare open-web steel carrier with explicit
  direct+flanking `impactFieldContext` now calculates `L'n,w 97.8`,
  `L'nT,w 95.4`, and `L'nT,50 100.6` under
  `contextMode=building_prediction`. `R'w`, `DnT,w`, and lab `Ln,w` are
  not published as floor building outputs, open-box raw-bare building
  prediction remains blocked, and ASTM `IIC` / `AIIC` remain
  unsupported. Source-absent single-number direct+flanking uplifts above
  `12 dB` stay blocked until exact path or impact-band evidence exists.
  The plan is
  [POST_V1_GATE_BM_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md](./POST_V1_GATE_BM_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md).
  Gate BM selected `post_v1_next_numeric_coverage_gap_gate_bn_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bn-contract.test.ts`.
  Gate BN is now landed as
  `post_v1_next_numeric_coverage_gap_gate_bn_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_bn_landed_no_runtime_selected_floor_open_box_raw_bare_building_prediction_owner_gate_bo`.
  [POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md](./POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md):
  it is a no-runtime accuracy gate for
  `calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes`.
  It compares current source-absent field/building values against
  external method constraints, keeps the corrected `12 dB` uplift guard
  executable, and selects
  `floor.open_box_timber_raw_bare.building_prediction_owner_gap` /
  `post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`
  in
  `packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts`.
- Gate BO has now landed as
  `post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`
  with status
  `post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_landed_runtime_selected_next_numeric_coverage_gap_gate_bp`.
  It is runtime calculator coverage for
  `floor.open_box_timber_raw_bare.building_prediction_owner_gap`: the
  220 mm raw-bare open-box carrier with explicit direct+flanking
  `impactFieldContext` now calculates `L'n,w 92.9`, `L'nT,w 90.5`, and
  `L'nT,50 93.9` under `contextMode=building_prediction`; the 370 mm
  carrier calculates `L'n,w 90`, `L'nT,w 87.6`, and `L'nT,50 90.7`.
  Simple `fieldKDb`, severe source-absent direct+flanking uplift,
  `R'w`, `DnT,w`, lab `Ln,w`, and ASTM `IIC` / `AIIC` remain blocked.
  Gate BO selects `post_v1_next_numeric_coverage_gap_gate_bp_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bp-contract.test.ts`.
- Gate BP has now landed as
  `post_v1_next_numeric_coverage_gap_gate_bp_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_bp_landed_no_runtime_selected_floor_raw_bare_airborne_building_prediction_gate_bq`.
  It selected
  `floor.raw_bare_floor_airborne_building_prediction_owner_gap` and
  `post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan` in
  `packages/engine/src/post-v1-floor-raw-bare-airborne-building-prediction-gate-bq-contract.test.ts`.
  This is calculator scope/accuracy work because raw-bare floor
  building airborne outputs (`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`)
  must use the owned direct `Rw` path rather than generic screening.
- Gate BQ has now landed as
  `post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan`
  with status
  `post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_landed_runtime_selected_next_numeric_coverage_gap_gate_br`.
  Complete raw-bare building-prediction requests now publish airborne
  building companions from owned direct raw-bare `Rw`: the 220 mm
  open-box case pins `R'w 36` and `DnT,w 39`, while thicker open-box and
  open-web raw-bare carriers follow the same owner path instead of
  generic screening. ASTM `IIC` / `AIIC` remain unsupported without
  their own ASTM owner. Gate BQ selects
  `post_v1_next_numeric_coverage_gap_gate_br_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-br-contract.test.ts`.
- Gate BR has now landed as
  `post_v1_next_numeric_coverage_gap_gate_br_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_br_landed_no_runtime_selected_floor_open_box_eps_screed_field_companion_gate_bs`.
  It selected
  `floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap`
  because complete open-box timber finished-package lanes already own
  lab `Ln,w` / `CI,50-2500` anchors. Dry package-transfer mixed
  requests publish `L'n,w 52.8` / `L'nT,w 50.4` / `L'nT,50 53.7`, but
  dry field-only requests currently publish a mismatched `46.7` /
  `44.3` / `48.1` tuple; EPS/screed hybrid field outputs remain
  blocked. Gate BS must align dry field-only with the mixed-request
  anchor and apply the existing field-context adapter to the EPS/screed
  hybrid field route, while `R'w`, `DnT,w`, and ASTM `IIC` / `AIIC`
  remain separate owners. Gate BR selects
  `post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan`
  in
  `packages/engine/src/post-v1-floor-open-box-eps-screed-field-companion-gate-bs-contract.test.ts`.
- Gate BS has now landed as
  `post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan` with
  status
  `post_v1_floor_open_box_eps_screed_field_companion_gate_bs_landed_selected_next_numeric_coverage_gap_gate_bt`.
  This is runtime calculator coverage and correctness: dry
  package-transfer field-only requests now use the same anchor as mixed
  requests and calculate `L'n,w 52.8` / `L'nT,w 50.4` /
  `L'nT,50 53.7`; EPS/screed hybrid requests with explicit
  `impactFieldContext` now calculate `L'n,w 49` / `L'nT,w 46.6` /
  `L'nT,50 47.6` from the owned `Ln,w 47` / `CI,50-2500 1` lab anchor.
  Missing `impactFieldContext` remains `needs_input`; `R'w`, `DnT,w`,
  and ASTM `IIC` / `AIIC` remain separate owners. Gate BS selects
  `post_v1_next_numeric_coverage_gap_gate_bt_plan`.
- Gate BT has now landed as
  `post_v1_next_numeric_coverage_gap_gate_bt_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_bt_landed_no_runtime_selected_floor_open_box_finished_package_airborne_building_companion_gate_bu`.
  It is no-runtime calculator selection, not source crawling or
  UI/report work. Gate BT selected
  `floor.open_box_timber_finished_package.airborne_building_companion_gap`
  because finished open-box packages already own lab airborne anchors
  (`Rw 66` dry package-transfer and `Rw 72` EPS/screed hybrid), while
  complete building-only `R'w` / `DnT,w` requests can still fall to
  generic predictor or `screening_mass_law_curve_seed_v3` airborne bases
  instead of the package anchor. Gate BT selected
  `post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan`
  in
  `packages/engine/src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts`.
- the previous landed slice was Gate BE next numeric coverage gap:
  `post_v1_next_numeric_coverage_gap_gate_be_plan` with status
  `post_v1_next_numeric_coverage_gap_gate_be_landed_no_runtime_selected_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf`.
  It selected
  `floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap`
  because it directly increases supported outputs (`L'n,w`, `L'nT,w`,
  `L'nT,50`) for the just-landed lower-treatment formula lane without
  source-row crawling or confidence wording work. Gate BE selected
  `post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
  in
  `packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf-contract.test.ts`.
- the previous landed slice was Gate BD floor suspended-ceiling
  lower-treatment coverage refresh:
  `post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
  with status
  `post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_be`.
  Acoustic-hanger, resilient-stud, and impact-only lower-treatment rows
  are now counted as source-absent family-physics coverage with pins
  `Ln,w 45.6` / `DeltaLw 28.9` and `Ln,w 44.6` / `DeltaLw 29.9`.
  Missing load basis, missing lower assembly, and ASTM `IIC` / `AIIC`
  remain value-less boundaries. Gate BE numeric coverage rerank is
  selected next:
  `post_v1_next_numeric_coverage_gap_gate_be_plan`
  in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts`.
- the previous landed slice was Gate BC floor suspended-ceiling
  lower-treatment surface parity:
  `post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`
  with status
  `post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_landed_selected_coverage_refresh_gate_bd`.
  Workbench cards, Markdown report, saved replay, estimate API,
  impact-only API, and resolver trace expose the same layer-derived
  lower-treatment answer. Gate BC selected
  `post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
  in
  `packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts`.
- the previous landed slice was Gate AU floor explicit-DeltaLw lab companion
  coverage:
  `post_v1_floor_explicit_deltalw_lab_companion_gate_au_plan`. It lets
  the explicit heavy-reference `DeltaLw` lane carry explicit lab
  companion inputs: `CI`, `Ln,w+CI`, and `CI,50-2500`.
- the previous landed slice was Gate AT floor explicit-CI,50-2500 lab companion
  coverage:
  `post_v1_floor_explicit_ci50_lab_companion_gate_at_plan`. It lets floor
  impact lanes that already own live `Ln,w` or conservative `Ln,w` upper
  bound and receive explicit user `CI,50-2500` calculate `CI,50-2500`
  without requiring field K, Hd, receiving-room volume, small-room
  toggle, or `CI`. Pinned values are hollow-core vinyl `Ln,w 48`,
  `CI,50-2500 +4`; heavy concrete `Ln,w 50`, `CI,50-2500 +4`; steel
  fallback `Ln,w 58`, `CI,50-2500 +4`; open-web / UBIQ 300 bound
  `Ln,w <= 51`, `CI,50-2500 +4`; UBIQ 200 bound `Ln,w <= 53`,
  `CI,50-2500 +4`; and UBIQ 250 bound `Ln,w <= 52`,
  `CI,50-2500 +4`. `CI`, `Ln,w+CI`, field outputs `L'n,w`, `L'nT,w`,
  `L'nT,50`, and ASTM `IIC` / `AIIC` remain blocked.
- the previous landed slice was Gate AS floor explicit-CI lab companion
  coverage:
  `post_v1_floor_explicit_ci_lab_companion_gate_as_plan`. It lets floor
  impact lanes that already own live `Ln,w` or conservative `Ln,w` upper
  bound and receive explicit user `CI` calculate `CI` and `Ln,w+CI`
  without requiring field K, Hd, receiving-room volume, small-room
  toggle, or `CI,50-2500`.
- the earlier landed slice was Gate AR floor small-room `CI,50-2500`
  low-frequency coverage:
  `post_v1_floor_small_room_ci50_low_frequency_gate_ar_plan`. It lets
  floor impact lanes that already calculate `L'nT,w` through the
  explicit Turkish small-room guide and receive explicit `CI,50-2500`
  calculate `L'nT,50 = L'nT,w + CI,50-2500`.

There is no open usable V1 acceptance step. Future work must be selected
as a post-V1 product slice.

Current selected post-V1 plan:
[POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md).

Current reconciliation checkpoint:
[CHECKPOINT_2026-06-05_DOCS_IMPLEMENTATION_SYNC_AFTER_GATE_DA.md](./CHECKPOINT_2026-06-05_DOCS_IMPLEMENTATION_SYNC_AFTER_GATE_DA.md).

Historical Gate BS/BT checkpoint:
[CHECKPOINT_2026-06-01_POST_V1_GATE_BT_STATE_RECONCILIATION.md](./CHECKPOINT_2026-06-01_POST_V1_GATE_BT_STATE_RECONCILIATION.md).
Gate BS and Gate BT are closed history. Gate BT selected Gate BU, and
that chain has since advanced through Gate CD. Do not treat Gate BS,
Gate BT, or Gate BW as the current selected next action.

Latest landed post-V1 value-moving coverage action:

`post_v1_target_output_independence_sweep_gate_cf_plan`

Latest landed post-V1 value-moving file:

`packages/engine/src/post-v1-target-output-independence-sweep-gate-cf-contract.test.ts`

Gate CF selection status:

`post_v1_target_output_independence_sweep_gate_cf_landed_selected_floor_common_floating_covering_expansion_gate_cg`

Selected next action label:

`post_v1_floor_common_floating_covering_expansion_gate_cg_plan`

Selected next file:

`packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg-contract.test.ts`

Latest landed post-V1 no-runtime selection:

`post_v1_next_numeric_coverage_gap_gate_ce_plan`

Gate CE selection status:

`post_v1_next_numeric_coverage_gap_gate_ce_landed_no_runtime_selected_target_output_independence_sweep_gate_cf`

Gate CE selected candidate:

`target_output_independence_sweep`

Gate AW direction plan:

[POST_V1_GATE_AW_DIRECTION_ANALYSIS_AND_PLAN_2026-05-27.md](./POST_V1_GATE_AW_DIRECTION_ANALYSIS_AND_PLAN_2026-05-27.md)

Gate AZ numeric coverage plan:

[POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md](./POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md)

Earlier Gate AY evidence remains recorded for closed-gate continuity:
`post_v1_floor_tuas_c11c_iso_impact_gate_ay_plan` with status
`post_v1_floor_tuas_c11c_iso_impact_gate_ay_landed_selected_next_numeric_coverage_gap_gate_az`
selected `post_v1_next_numeric_coverage_gap_gate_az_plan` for
`floor-tuas-c11c-fail-closed`. It pins `Ln,w 59`, `CI 1`,
`CI,50-2500 1`, `Ln,w+CI 60`, and field `L'nT,50 60.2` on
`tuas_c11c_visible_iso_weighted_impact_tuple_guarded`.

Historical Gate BF landed runtime field-companion coverage for the
suspended-ceiling lower-treatment floor lane. Assembly field-only
lower-treatment calculated `L'n,w 47.6 / L'nT,w 44.8 / L'nT,50 48.8`
for the acoustic-hanger case and `L'n,w 46.6 / L'nT,w 43.8 /
L'nT,50 47.8` for the resilient-stud case. Missing
`impactFieldContext.ci50_2500Db` stopped only `L'nT,50`, and ASTM
`IIC` / `AIIC` remained unsupported. That handoff has since advanced
through Gate CH; Gate CI is the selected next action label.
Full `pnpm calculator:gate:current` passed after Gate BF with engine 569
files / 3155 tests, web 112 files / 435 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

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

Gate AZ has now landed as no-runtime numeric coverage selection:

`post_v1_next_numeric_coverage_gap_gate_az_plan`

Gate AZ selection status:

`post_v1_next_numeric_coverage_gap_gate_az_landed_no_runtime_selected_floor_dynamic_stiffness_load_basis_owner_gate_ba`

Gate AZ selected next action:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`

Gate AZ selected next file:

`packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts`

Gate AZ implementation comparison is documented in
[POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md](./POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md).
It records that Gate AZ ranks the existing floor-impact source-absent
gaps already visible in implementation:
`floor.material_owner_gap.dynamic_stiffness_load_basis`,
`floor.suspended_ceiling.lower_treatment_coupling_gap`, and
`floor.mixed_support_family.multi_family_solver_gap`. Gate AZ selected
dynamic stiffness / load basis ownership as Gate AZ+1, with
before/after output evidence required before any runtime movement.

Gate BA has now landed as no-runtime dynamic stiffness / load basis
owner contract:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`

Gate BA selection status:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_landed_no_runtime_selected_suspended_ceiling_lower_treatment_gate_bb`

Gate BA selected next action:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan`

Gate BA selected next file:

`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts`

Gate BA pins `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`
as no-default physical owner fields. Complete heavy floating inputs keep
the existing `Ln,w 48.7` / `DeltaLw 25.8` runtime; missing dynamic
stiffness or load basis cannot invent `DeltaLw`. The next selected
runtime-family target is suspended-ceiling lower-treatment coupling.

Gate BB has now landed as runtime coverage for that target:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan`

Gate BB selection status:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_landed_selected_surface_parity_gate_bc`

Gate BB selected next action:

`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`

Gate BB selected next file:

`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc-contract.test.ts`

Complete visible heavy-concrete combined upper/lower floor stacks with
`acoustic_hanger_ceiling` or `resilient_stud_ceiling` lower-treatment
support now calculate on
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
Pinned values: acoustic hanger `Ln,w 45.6` / `DeltaLw 28.9`;
resilient stud `Ln,w 44.6` / `DeltaLw 29.9`. Missing
`ceilingOrLowerAssembly` or `loadBasisKgM2` still stops, and ASTM
`IIC` / `AIIC` aliases remain unsupported.

Previous Gate AX landed as
`post_v1_wall_framed_building_adapter_gate_ax_plan` with status
`post_v1_wall_framed_building_adapter_gate_ax_landed_selected_next_numeric_coverage_gap_gate_ay`;
it added framed LSF/timber building adapter coverage for source-absent
wall direct-curve families. Complete Gate AR
`building_prediction` requests for `wall-lsf-knauf` now pin `Rw 51`,
STC 51, `C -1.4`, `Ctr -6.4`, `R'w 51`, `Dn,w 51`, `Dn,A 49.6`,
`DnT,w 52`, and `DnT,A 51.1`; `wall-timber-stud` now pins `Rw 42`,
STC 42, `C 0.4`, `Ctr -4.3`, `R'w 42`, `Dn,w 42`, `Dn,A 42.4`,
`DnT,w 43`, and `DnT,A 43.9`. Gate AY is selected next through
`post_v1_next_numeric_coverage_gap_gate_ay_plan` for the
`floor-tuas-c11c-fail-closed` ISO impact gap; do not drift into a broad
source crawl, confidence wording pass, finite scenario pack, or
no-runtime cartography gate.

Initial landed post-V1 action:

`post_v1_calculator_capability_roi_confirmation_gate_0_plan`

Initial landed post-V1 file:

`packages/engine/src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts`

Selection status:

`post_v1_calculator_capability_roi_confirmation_gate_0_landed_selected_wall_multileaf_gate_a`

Previously landed Gate A action:

`post_v1_wall_multileaf_generalized_formula_gate_a_input_owner_and_gap_matrix_plan`

Previously landed Gate A file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts`

Gate A selection status:

`post_v1_wall_multileaf_generalized_formula_gate_a_landed_no_runtime_selected_gate_b_runtime_corridor`

Previously landed Gate B action:

`post_v1_wall_multileaf_generalized_formula_gate_b_runtime_corridor_plan`

Previously landed Gate B file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts`

Gate B selection status:

`post_v1_wall_multileaf_generalized_formula_gate_b_landed_selected_gate_c_surface_parity_and_guided_inputs`

Previously landed Gate C action:

`post_v1_wall_multileaf_generalized_formula_gate_c_surface_parity_and_guided_inputs_plan`

Previously landed Gate C file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts`

Gate C selection status:

`post_v1_wall_multileaf_generalized_formula_gate_c_landed_selected_gate_d_compatible_anchor_delta`

Latest landed post-V1 implementation action:

`post_v1_wall_compatible_anchor_delta_gate_d_plan`

Latest landed post-V1 implementation file:

`packages/engine/src/post-v1-wall-compatible-anchor-delta-gate-d-contract.test.ts`

Gate D selection status:

`post_v1_wall_compatible_anchor_delta_gate_d_landed_selected_gate_e_floor_or_wall_next_formula_gap`

Landed Gate E action:

`post_v1_floor_or_wall_next_formula_gap_gate_e_plan`

Landed Gate E file:

`packages/engine/src/post-v1-floor-or-wall-next-formula-gap-gate-e-contract.test.ts`

Gate E selection status:

`post_v1_floor_or_wall_next_formula_gap_gate_e_landed_selected_gate_f_floor_astm_iic_aiic_contour_runtime`

Latest landed runtime action:

`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_plan`

Latest landed runtime file:

`packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts`

Gate F selection status:

`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_landed_selected_surface_parity_or_next_floor_formula_gap`

Latest landed surface action:

`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_plan`

Latest landed surface file:

`packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts`

Gate G selection status:

`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_landed_selected_gate_h_floor_formula_expansion`

Latest landed floor formula-expansion action:

`post_v1_floor_formula_expansion_gate_h_plan`

Latest landed floor formula-expansion file:

`packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts`

Previously selected label:

post-V1 floor formula expansion Gate H

Gate H selection status:

`post_v1_floor_formula_expansion_gate_h_landed_selected_gate_i_floor_formula_gap_refresh`

Landed Gate I action:

`post_v1_floor_formula_gap_refresh_gate_i_plan`

Landed Gate I file:

`packages/engine/src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts`

Previously selected label:

post-V1 floor formula gap refresh Gate I

Gate I selection status:

`post_v1_floor_formula_gap_refresh_gate_i_landed_no_runtime_selected_gate_j_reinforced_concrete_combined_resolver`

Gate I selected next action:

`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan`

Gate I selected next file:

`packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts`

Gate I selected next label:

post-V1 floor reinforced-concrete combined resolver Gate J

Landed Gate J action:

`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan`

Landed Gate J file:

`packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts`

Gate J selection status:

`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_landed_selected_gate_k_timber_clt_delta_lw_resolver`

Gate J selected Gate K label:

post-V1 floor timber/CLT DeltaLw resolver Gate K

Landed Gate K action:

`post_v1_floor_timber_clt_delta_lw_resolver_gate_k_plan`

Landed Gate K file:

`packages/engine/src/post-v1-floor-timber-clt-delta-lw-resolver-gate-k-contract.test.ts`

Gate K selection status:

`post_v1_floor_timber_clt_delta_lw_resolver_gate_k_landed_selected_gate_l_composite_panel_family_solver_owner`

Gate K selected Gate L action:

`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan`

Gate K selected Gate L file:

`packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts`

Gate K selected Gate L label:

post-V1 floor composite-panel family solver owner Gate L

Landed Gate L action:

`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan`

Landed Gate L file:

`packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts`

Gate L selection status:

`post_v1_floor_composite_panel_family_solver_owner_gate_l_landed_selected_gate_m_lightweight_concrete_family_solver_owner`

Gate L selected Gate M action:

`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan`

Gate L selected Gate M file:

`packages/engine/src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts`

Gate L selected Gate M label:

post-V1 floor lightweight-concrete family solver owner Gate M

Gate A was selected by measurable Gate 0 ROI and closed the no-runtime
input owner/gap matrix. Gate B expanded owned calculator coverage for
complete grouped Rockwool wall multileaf element-lab `Rw`, STC, `C`,
and `Ctr` by routing the existing
`triple_leaf_two_cavity_frequency_solver` through the shared resolver
candidate surface, while preserving `needs_input` for missing topology.
Gate C made that runtime path visible across workbench/API/report
surfaces and guided input flow: mixed lab+field requests keep lab value
pins live on
`candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver`
while `R'w` and `DnT,w` stop with exact missing field inputs. Gate D
then added the first wall compatible measured-anchor delta: the Knauf
LSF exact `Rw 55` row can now anchor a same-side added acoustic-board
delta and publish `Rw 57` with a `+/-5 dB` not-measured budget, while
STC, `C`, and `Ctr` remain unsupported unless separately owned. Gate E
then selected ASTM `IIC` / `AIIC` as the next highest-ROI exact-band
runtime gap. Gate F now calculates complete ASTM E492 lab bands into
`IIC` and complete ASTM E1007 field bands into `AIIC` through the ASTM
E989 contour bridge, while ISO `Ln,w` rows and incomplete ASTM curves
remain unsupported for ASTM ratings. Gate G closed surface parity for
that rating path across cards, answer chart, report, API payloads,
resolver trace, and metric-basis provenance. Gate H then increased
floor formula coverage by mapping existing lightweight-steel upper/lower
mass-spring and suspended-ceiling-only source-absent floor formulas into
the shared resolver and answer-engine surface. Complete upper/lower
steel now publishes `Ln,w 51.6` / `DeltaLw 22.4`; suspended-only steel
publishes `Ln,w 62.2`, while `DeltaLw` without a complete upper package
remains unsupported/needs owner inputs and ASTM/field aliases remain
blocked. Gate I refreshed the next floor formula
gap and selected Gate J: the existing reinforced-concrete combined
upper/lower formula already calculates lab `Ln,w 58.1` / `DeltaLw 13.7`
on `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`,
but still needed shared resolver/answer-engine ownership. Gate J now
maps that route through
`floor.heavy_concrete_combined_upper_lower.lab_impact_formula`;
complete requests publish `Ln,w 58.1` / `DeltaLw 13.7`, `IIC` /
`AIIC` remain unsupported ASTM boundaries, and missing `loadBasisKgM2`
or `ceilingOrLowerAssembly` stops as `needs_input`. Gate K now maps the
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
`predictor_lightweight_concrete_family_estimate`: visible lightweight
floating floor publishes `Ln,w 64.3 / Rw 53`, and low-density predictor
input publishes `Ln,w 47 / Rw 49`. Lightweight-concrete `DeltaLw`, ASTM,
and field aliases remain blocked until separate owners exist. Gate M action
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan`
landed with status
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_landed_selected_gate_n_floor_field_building_expansion`.
Gate M selected Gate N action
`post_v1_floor_field_building_expansion_gate_n_plan` in
`packages/engine/src/post-v1-floor-field-building-expansion-gate-n-contract.test.ts`;
selected next label: post-V1 floor field/building expansion Gate N.
Gate N action `post_v1_floor_field_building_expansion_gate_n_plan`
landed with status
`post_v1_floor_field_building_expansion_gate_n_landed_selected_gate_o_input_surface_guided_physical_fields`.
Gate N selected Gate O action
`post_v1_input_surface_guided_physical_fields_gate_o_plan` in
`packages/engine/src/post-v1-input-surface-guided-physical-fields-gate-o-contract.test.ts`;
Gate N selected Gate O label: post-V1 input-surface guided physical fields Gate O.
Gate N now
maps the generalized floor impact field-context adapter through
`floor.impact_field_context.field_building_adapter` on
`source_absent_field_building_adapter_error_budget`: dynamic
lightweight-concrete field requests with a live lab `Ln,w` anchor plus
`impactFieldContext.fieldKDb` and
`impactFieldContext.receivingRoomVolumeM3` publish
`L'n,w 66.3 / L'nT,w 63.9`. Missing field-impact context stops as
`needs_input` with `impactFieldContext` and `receivingRoomVolumeM3`;
building prediction and ASTM `IIC` / `AIIC` aliases remain blocked.
Gate O then added flat multicavity auto-topology for explicit
air-gap/porous-fill wall stacks (`Rw 53` / STC 57 / `C -0.6` /
`Ctr -8`), Gate P added flat double-leaf auto-topology for explicit
support context and stud spacing: independent support `Rw 45` / STC 45
/ `C -1` / `Ctr -6.1`, resilient both-sides `Rw 47` / STC 47 /
`C -1` / `Ctr -6.1`, Gate Q added full-fill flat multicavity
auto-topology when explicit support context is present. The Gate Q
pinned wall stack `gypsum / rockwool / gypsum / rockwool / gypsum`
now derives grouped triple-leaf topology and calculates `Rw 52` /
STC 53 / `C -2.6` / `Ctr -9.4`; legacy support hints are not guessed
and explicit `flat_layer_order` stays blocked. Gate R now lets that
same explicit-support full-fill flat stack calculate field/apparent
outputs from complete `field_between_rooms` context: `R'w 50`,
`Dn,w 50`, `Dn,A 48.5`, `DnT,w 53`, and `DnT,A 50.9`; missing field
RT60 is reported as `needs_input` instead of asking for manual leaf
groups. Gate S then promotes the common flat double-leaf field request
with explicit support context and `studSpacingMm` from screening fallback
to the owned double-leaf family physics plus field adapter: `R'w 39`,
`Dn,w 40`, `Dn,A 38.5`, `DnT,w 42`, and `DnT,A 40.9`; missing
`receivingRoomRt60S` is the only input stop and support is still not
guessed. Gate T keeps that same calculable stack complete when the user
requests mixed lab-spectrum plus field outputs: `Rw 39`, STC 39,
`C -1`, `Ctr -5.7`, `R'w 39`, `Dn,w 40`, `Dn,A 38.5`, `DnT,w 42`,
and `DnT,A 40.9`; the field adapter trace still pins only field metrics
so lab values are not relabelled as field candidates. Gate U applies the
same calculable-output rule to the explicit-support full-fill flat
multicavity field stack: `Rw 50`, STC 51, `C -2`, `Ctr -8.5`,
`R'w 50`, `Dn,w 50`, `Dn,A 48.5`, `DnT,w 53`, and `DnT,A 50.9`, again
with the field adapter trace pinning only field metrics. Gate V keeps
explicitly requested `Rw` live even when the user asks only for `Rw`
plus field outputs, without requiring STC or spectrum companions:
double-leaf `Rw 39` / `R'w 39` / `DnT,w 42`, and multileaf `Rw 50` /
`R'w 50` / `DnT,w 53`. Gate W extends that calculable-output rule to
complete heavy-composite and local-substitution grouped triple-leaf field
adapters: heavy-composite `Rw 60` / `R'w 60` / `DnT,w 61`, and
local-substitution `Rw 51` / `R'w 51` / `DnT,w 53`; field-only requests
still remain field-only. The shared resolver surface now has 43 declared candidates and 40 active runtime-basis mappings.
This is not source crawling, confidence wording, docs-only work, or a
finite scenario pack.

Previously landed Gate P action:

`post_v1_wall_double_leaf_auto_topology_gate_p_plan`

Previously landed Gate P file:

`packages/engine/src/post-v1-wall-double-leaf-auto-topology-gate-p-contract.test.ts`

Gate P selection status:

`post_v1_wall_double_leaf_auto_topology_gate_p_landed_selected_next_numeric_coverage_gap_gate_q`

Previous selected label:

post-V1 wall double-leaf auto-topology Gate P

Gate P selected Gate Q action:

`post_v1_next_numeric_coverage_gap_gate_q_plan`

Gate P selected Gate Q file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-q-contract.test.ts`

Gate P selected Gate Q label:

post-V1 next numeric coverage gap Gate Q

Previously landed Gate Q action:

`post_v1_wall_full_fill_multicavity_auto_topology_gate_q_plan`

Previously landed Gate Q file:

`packages/engine/src/post-v1-wall-full-fill-multicavity-auto-topology-gate-q-contract.test.ts`

Gate Q selection status:

`post_v1_wall_full_fill_multicavity_auto_topology_gate_q_landed_selected_next_numeric_coverage_gap_gate_r`

Gate Q selected Gate R action:

`post_v1_next_numeric_coverage_gap_gate_r_plan`

Gate Q selected Gate R file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-r-contract.test.ts`

Gate Q selected Gate R label:

post-V1 next numeric coverage gap Gate R

Previously landed Gate R action:

`post_v1_wall_field_auto_topology_gate_r_plan`

Previously landed Gate R file:

`packages/engine/src/post-v1-wall-field-auto-topology-gate-r-contract.test.ts`

Gate R selection status:

`post_v1_wall_field_auto_topology_gate_r_landed_selected_next_numeric_coverage_gap_gate_s`

Gate R selected next action:

`post_v1_next_numeric_coverage_gap_gate_s_plan`

Gate R selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-s-contract.test.ts`

Gate R selected next label:

post-V1 next numeric coverage gap Gate S

Previously landed Gate S action:

`post_v1_wall_double_leaf_field_auto_topology_gate_s_plan`

Previously landed Gate S file:

`packages/engine/src/post-v1-wall-double-leaf-field-auto-topology-gate-s-contract.test.ts`

Gate S selection status:

`post_v1_wall_double_leaf_field_auto_topology_gate_s_landed_selected_next_numeric_coverage_gap_gate_t`

Gate S selected next action:

`post_v1_next_numeric_coverage_gap_gate_t_plan`

Gate S selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-t-contract.test.ts`

Gate S selected next label:

post-V1 next numeric coverage gap Gate T

Previously landed Gate T action:

`post_v1_wall_mixed_lab_field_output_gate_t_plan`

Previously landed Gate T file:

`packages/engine/src/post-v1-wall-mixed-lab-field-output-gate-t-contract.test.ts`

Gate T selection status:

`post_v1_wall_mixed_lab_field_output_gate_t_landed_selected_next_numeric_coverage_gap_gate_u`

Gate T selected next action:

`post_v1_next_numeric_coverage_gap_gate_u_plan`

Gate T selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-u-contract.test.ts`

Gate T selected next label:

post-V1 next numeric coverage gap Gate U

Latest Gate T validation is green. Full `pnpm calculator:gate:current`
passed on 2026-05-25 with engine 531 files / 2991 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Previously landed Gate U action:

`post_v1_wall_multileaf_mixed_lab_field_output_gate_u_plan`

Previously landed Gate U file:

`packages/engine/src/post-v1-wall-multileaf-mixed-lab-field-output-gate-u-contract.test.ts`

Gate U selection status:

`post_v1_wall_multileaf_mixed_lab_field_output_gate_u_landed_selected_next_numeric_coverage_gap_gate_v`

Gate U selected next action:

`post_v1_next_numeric_coverage_gap_gate_v_plan`

Gate U selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-v-contract.test.ts`

Gate U selected next label:

post-V1 next numeric coverage gap Gate V

Latest Gate U validation is green. Full `pnpm calculator:gate:current`
passed on 2026-05-25 with engine 532 files / 2995 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Latest landed runtime action:

`post_v1_wall_rw_field_output_gate_v_plan`

Latest landed runtime file:

`packages/engine/src/post-v1-wall-rw-field-output-gate-v-contract.test.ts`

Gate V selection status:

`post_v1_wall_rw_field_output_gate_v_landed_selected_next_numeric_coverage_gap_gate_w`

Gate V selected next action:

`post_v1_next_numeric_coverage_gap_gate_w_plan`

Gate Z selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-w-contract.test.ts`

Gate Z selected next label:

post-V1 next numeric coverage gap Gate W

Latest Gate V validation is green. Full `pnpm calculator:gate:current`
passed on 2026-05-25 with engine 533 files / 2999 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Previously landed Gate W action:

`post_v1_wall_field_rw_companion_gate_w_plan`

Previously landed Gate W file:

`packages/engine/src/post-v1-wall-field-rw-companion-gate-w-contract.test.ts`

Gate W selection status:

`post_v1_wall_field_rw_companion_gate_w_landed_selected_next_numeric_coverage_gap_gate_x`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_x_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-x-contract.test.ts`

Selected next label:

post-V1 next numeric coverage gap Gate X

Latest Gate W validation is green. Full `pnpm calculator:gate:current`
passed on 2026-05-25 with engine 534 files / 3003 tests, web 95 files /
402 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Latest landed runtime action:

`post_v1_floor_airborne_spectrum_companion_gate_x_plan`

Latest landed runtime file:

`packages/engine/src/post-v1-floor-airborne-spectrum-companion-gate-x-contract.test.ts`

Gate X selection status:

`post_v1_floor_airborne_spectrum_companion_gate_x_landed_selected_next_numeric_coverage_gap_gate_y`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_y_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-y-contract.test.ts`

Selected next label:

post-V1 next numeric coverage gap Gate Y

Latest Gate X focused validation is green. Gate X targeted validation
passed 1 file / 4 tests, and the relevant regression sentinel passed 11
files / 64 tests. Full `pnpm calculator:gate:current` passed after Gate
X with engine 535 files / 3007 tests, web 95 files / 402 passed + 18
skipped, repo build 5 / 5, and whitespace guard passed.

Previous landed runtime action:

`post_v1_floor_screening_rw_companion_gate_z_plan`

Previous landed runtime file:

`packages/engine/src/post-v1-floor-screening-rw-companion-gate-z-contract.test.ts`

Gate Z selection status:

`post_v1_floor_screening_rw_companion_gate_z_landed_selected_next_numeric_coverage_gap_gate_aa`

Gate Z selected next action:

`post_v1_next_numeric_coverage_gap_gate_aa_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aa-contract.test.ts`

Selected next label:

post-V1 next numeric coverage gap Gate AA

Gate Z opens already-calculated `Rw` for source-absent floor
`screening_mass_law_curve_seed_v3` requests with visible floor roles
while preserving exact-source metric scope, UBIQ bound missing-`C`
boundaries, and impact / ASTM stops. The pinned TUAS C11c fail-closed
stack now supports `Rw 47`, STC 47, `C -1`, `Ctr -5.7`, `R'w 47`, and
`DnT,w 49` through `floor.screening_airborne.source_absent`; `Ln,w`,
`DeltaLw`, `L'n,w`, and `L'nT,w` remain stopped. Latest validation:
focused Gate Z / Gate Y / Gate X / resolver passed 6 files / 30 tests,
and full `pnpm calculator:gate:current` passed on 2026-05-26 with
engine 537 files / 3016 tests, web 95 files / 402 passed + 18 skipped,
repo build 5 / 5, and whitespace guard passed.

Latest landed post-V1 capability action:

`post_v1_floor_bound_low_frequency_field_companion_gate_ak_plan`

Latest landed post-V1 capability file:

`packages/engine/src/post-v1-floor-bound-low-frequency-field-companion-gate-ak-contract.test.ts`

Gate AK selection status:

`post_v1_floor_bound_low_frequency_field_companion_gate_ak_landed_selected_next_numeric_coverage_gap_gate_al`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_al_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-al-contract.test.ts`

Selected next label:

post-V1 next numeric coverage gap Gate AL

Gate AA opens the already-calculated `Rw` companion for complete
source-absent lined-massive wall field requests whose base lab-family
method is `gate_h_lined_massive_wall_cavity_aware_family_physics_runtime`.
The pinned concrete lined wall now supports `Rw 55`, STC 55, `C -1.6`,
`Ctr -6.3`, `R'w 55`, `Dn,w 55`, `Dn,A 53.4`, `DnT,w 56`, and
`DnT,A 54.9` even when unrelated floor/impact outputs remain stopped as
`needs_input` / `unsupported`. Grouped-topology flat wall cases still
stop as `needs_input`, and exact/floor metric-scope boundaries remain
unchanged. Latest validation: focused Gate AA / Gate Z / Gate Y / Gate
X / Gate W / resolver passed 6 files / 26 tests, and full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 538
files / 3019 tests, web 95 files / 402 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AB opens calculated `Rw` for complete single-leaf wall field
requests on the screening fallback lane. The masonry brick wall now
supports `Rw 40`, STC 40, `C -0.2`, `Ctr -4.7`, `R'w 40`, `Dn,w 40`,
`Dn,A 39.8`, `DnT,w 42`, and `DnT,A 41.3`; the laminated CLT wall now
supports `Rw 41`, STC 41, `C -1.8`, `Ctr -7.6`, `R'w 41`, `Dn,w 41`,
`Dn,A 39.2`, `DnT,w 42`, and `DnT,A 40.7`. Framed/grouped wall routes
that still need topology fields remain `needs_input`; exact/floor
metric scopes and UBIQ bound missing-`C` guards remain closed. Gate AB
status is
`post_v1_wall_screening_rw_field_companion_gate_ab_landed_selected_next_numeric_coverage_gap_gate_ac`;
selected next action was `post_v1_next_numeric_coverage_gap_gate_ac_plan`.
Latest validation: focused Gate AB passed 1 file / 4 tests; focused
Gate AB / Gate AA / Gate Z / Gate Y / Gate X / Gate W / resolver /
origin matrix passed 8 files / 31 tests; web Gate B visibility passed
1 file / 4 tests; web origin card matrix passed 1 file / 1 test; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 539
files / 3023 tests, web 95 files / 402 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AC opens the already-calculated floor field/building airborne
outputs `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` through
`floor.impact_field_context.field_building_adapter` and automatic
workbench floor presets. The heavy concrete floor now supports
`Dn,w 57`, `Dn,A 56.1`, `DnT,w 60`, and `DnT,A 58.6`; the lightweight
steel fallback supports `Dn,w 69`, `Dn,A 68.1`, `DnT,w 72`, and
`DnT,A 70.6`. Exact floor metric scope, bound-only missing-`C`,
ASTM/IIC, and unrelated `needs_input` boundaries remain closed. Gate AC
status is
`post_v1_floor_field_a_weighted_surface_gate_ac_landed_selected_next_numeric_coverage_gap_gate_ad`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ad_plan`.
Latest validation: focused Gate AC passed engine 1 file / 4 tests and
web 1 file / 4 tests; focused Gate N + Gate AC passed engine 2 files /
9 tests; focused Gate AC + floor preset web passed 2 files / 6 tests;
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
540 files / 3027 tests, web 96 files / 406 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.

Gate AD opens the already-calculated `Rw` companion for framed wall
field/building requests on the stud-surrogate/framed-calibration route. Explicit
`connectionType` / `studType` metadata is required, but the field values
stay on the defended calibration lane instead of moving to the less
accurate source-absent double-leaf formula. The LSF Knauf framed wall
now supports `Rw 51`, STC 51, `C -1.4`, `Ctr -6.4`, `R'w 51`,
`Dn,w 51`, `Dn,A 49.6`, `DnT,w 52`, and `DnT,A 51.1`; the timber-stud
wall now supports `Rw 42`, STC 42, `C 0.4`, `Ctr -4.3`, `R'w 42`,
`Dn,w 42`, `Dn,A 42.4`, `DnT,w 43`, and `DnT,A 43.9`. No-support
framed metadata and grouped AAC/triple-leaf cases still stop as
`needs_input`; exact/bound floor metric scope and ASTM/IIC aliases
remain closed. Gate AD status is
`post_v1_wall_framed_metadata_auto_topology_gate_ad_landed_selected_next_numeric_coverage_gap_gate_ae`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ae_plan`.
Latest validation: focused Gate AD passed engine 1 file / 4 tests;
framed/source regression coverage passed 21 files / 157 tests; resolver
and answer-engine regression coverage passed 5 files / 41 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 541
files / 3031 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AE opens the same defended framed-calibration lane's calculated
lab spectrum companions, not just `Rw`. Complete explicit framed
building requests now publish `Rw`, STC, `C`, and `Ctr` when the
stud-surrogate/framed-calibration curve already owns finite values,
while `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` remain parked behind
building/field input boundaries until their owners are complete. The LSF
Knauf building case supports `Rw 51`, STC 51, `C -1.4`, and `Ctr -6.4`;
the timber-stud building case supports `Rw 42`, STC 42, `C 0.4`, and
`Ctr -4.3`. Direct timber and British Gypsum framed building cards now
show the same calculated lab-spectrum companions. No framed metadata,
grouped AAC/triple-leaf, exact metric-scope, floor bound, and ASTM/IIC
boundaries remain closed. Gate AE status is
`post_v1_wall_framed_lab_spectrum_companion_gate_ae_landed_selected_next_numeric_coverage_gap_gate_af`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_af_plan`.
Latest validation: focused Gate AD + Gate AE passed engine 2 files / 8
tests; focused wall card coverage passed web 3 files / 31 tests.

Gate AF opens source-absent building lab-spectrum companions for owned
single-leaf / lined-massive wall traces. Complete building-prediction
requests now publish `Rw`, STC, `C`, and `Ctr` when the calculated lab
curve already owns finite values, while `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
and `DnT,A` remain parked behind field/building owners. The lined
concrete building case supports `Rw 55`, STC 55, `C -1.6`, and
`Ctr -6.3`; masonry brick supports `Rw 40`, STC 40, `C -0.2`, and
`Ctr -4.7`; laminated CLT supports `Rw 41`, STC 41, `C -1.8`, and
`Ctr -7.6`. Grouped AAC/multileaf, opening/leak building, exact
metric-scope, floor bound, and ASTM/IIC boundaries remain closed. Gate
AF status is
`post_v1_wall_source_absent_building_lab_spectrum_companion_gate_af_landed_selected_next_numeric_coverage_gap_gate_ag`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ag_plan`.
Latest validation: focused Gate AE + Gate AF passed engine 2 files / 8
tests; focused wall surface coverage passed web 3 files / 12 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 543
files / 3039 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AG opens heavy-composite building lab-spectrum companions for the
guarded double-leaf / heavy-unframed-cavity-cap wall trace. Complete
building-prediction requests now publish `Rw`, STC, `C`, and `Ctr` when
that calculated lab trace already owns finite values, while `R'w`,
`Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` remain parked behind
field/building owners. The heavy-composite building case supports
`Rw 60`, STC 60, `C -1.4`, and `Ctr -6.1`. Grouped AAC/multileaf,
opening/leak building, exact metric-scope, floor bound, ASTM/IIC, and
field/building value aliases remain closed. Gate AG status is
`post_v1_wall_heavy_composite_building_lab_spectrum_companion_gate_ag_landed_selected_next_numeric_coverage_gap_gate_ah`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ah_plan`.
Latest validation: focused Gate AG + Gate AF + heavy-composite
regressions passed engine 5 files / 22 tests; focused wall surface
coverage passed web 3 files / 12 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 544
files / 3042 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AH opens the calculated `Rw` companion for support-backed
AAC/multileaf field requests on the existing `multileaf_screening_blend`
wall path. The support-backed AAC/multileaf field case now supports
`Rw 41`, STC 41, `C -1.7`, `Ctr -6.8`, `R'w 41`, `Dn,w 41`,
`Dn,A 39.3`, `DnT,w 42`, and `DnT,A 40.8`. Missing support topology
still stops as `needs_input`; floor bound `C`, exact floor STC/`C`/`Ctr`
aliases, opening/leak building, ASTM/IIC, and field/building value
aliases remain closed. Gate AH status is
`post_v1_wall_multileaf_screening_rw_field_companion_gate_ah_landed_selected_next_numeric_coverage_gap_gate_ai`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ai_plan`.
Latest validation: focused Gate AH + Gate AG + wall/floor regression
coverage passed engine 5 files / 19 tests; focused wall surface
coverage passed web 4 files / 19 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 545
files / 3046 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AI promotes that support-backed AAC/multileaf field request from
the screening fallback into the Gate AE two-cavity physics solver plus
Gate I field adapter. The same field request now supports `Rw 60`, STC
60, `C -1.9`, `Ctr -8`, `R'w 60`, `Dn,w 60`, `Dn,A 58.1`, `DnT,w 61`,
and `DnT,A 59.6`. Missing support topology still stops as
`needs_input`, missing `receivingRoomRt60S` remains that exact
`needs_input` field, and floor bound `C`, exact floor STC/`C`/`Ctr`
aliases, opening/leak building, ASTM/IIC, and field/building value
aliases remain closed. Gate AI status is
`post_v1_wall_flat_multicavity_field_physics_companion_gate_ai_landed_selected_next_numeric_coverage_gap_gate_aj`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_aj_plan`.
Latest validation: focused Gate AI + Gate AH + wall/floor regression
coverage passed engine 5 files / 21 tests; focused wall surface
coverage passed web 4 files / 19 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 546
files / 3051 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AJ promotes complete support-backed AAC/multileaf building requests
from the screening/`needs_input` stop into the Gate AE two-cavity
physics solver plus building-prediction runtime basis. The same building
request now supports `R'w 60`, `Dn,w 60`, `Dn,A 58.1`, `DnT,w 61`, and
`DnT,A 59.6`; lab `Rw`, STC, `C`, and `Ctr` remain unsupported on the
building route instead of being aliased. Missing support topology still
stops as `needs_input`, missing `sourceRoomVolumeM3` remains that exact
`needs_input` field, and floor bound `C`, exact floor STC/`C`/`Ctr`
aliases, opening/leak building, ASTM/IIC, and field/building value
aliases remain closed. Gate AJ status is
`post_v1_wall_flat_multicavity_building_physics_gate_aj_landed_selected_next_numeric_coverage_gap_gate_ak`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_ak_plan`.
Latest validation: focused Gate AJ + Gate AI + answer-engine regression
coverage passed engine 5 files / 40 tests; focused wall/building
surface coverage passed web 5 files / 25 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 547
files / 3056 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AK calculates the source-owned low-frequency field companion for
bound-only floor impact lanes. When the bound lane already owns
`Ln,w`, `L'n,w`, and `L'nT,w` upper bounds and the user supplies
`impactFieldContext.ci50_2500Db`, DynEcho now publishes
`L'nT,50 upper bound = L'nT,w upper bound + CI,50-2500` instead of
leaving the metric unsupported. The UBIQ open-web bound case now
supports `Ln,w <= 51`, `L'n,w <= 54`, `L'nT,w <= 51.2`, and
`L'nT,50 <= 55.2`; selected lightweight-steel bound interpolation
families pin `L'nT,50 <= 55.2`, `<= 56.2`, or `<= 57.2`. Missing
`impactFieldContext.ci50_2500Db` still stops pure `L'nT,50` requests
as `needs_input`, mixed bound field requests leave only `L'nT,50`
explicit, and ASTM `IIC` / `AIIC` remain unsupported. Gate AK status is
`post_v1_floor_bound_low_frequency_field_companion_gate_ak_landed_selected_next_numeric_coverage_gap_gate_al`;
selected next action is `post_v1_next_numeric_coverage_gap_gate_al_plan`.
Latest validation: focused Gate AK + Gate AJ + answer-engine
regression coverage passed engine 5 files / 46 tests; focused floor
low-frequency surface coverage passed web 4 files / 33 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 548
files / 3062 tests, web 97 files / 408 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

## Allowed Next-Slice Families

Select the next implementation explicitly from calculator capability
gaps, not from old selected-next chains. Acceptable post-V1 slice
families include:

- expanded formula coverage for realistic wall and floor combinations;
- adapters that turn already-owned runtime values into traceable,
  basis-correct answers;
- measured holdout calibration and error-budget improvement;
- UI input ergonomics for route/formula-required physical fields;
- source row promotion only as exact overrides, compatible anchors,
  calibration evidence, holdouts, or bounds;
- building/field prediction expansion only when direct, flanking,
  junction, room, and standard owners are explicit.

Blocked default moves:

- broad source crawling as the next step;
- finite scenario packs as a substitute for formula coverage;
- confidence wording, tolerance retune, or marketing copy without
  behavior movement;
- metric alias promotion without an owned standard/adapter;
- deleting, bypassing, or hiding existing solver lanes instead of
  routing them through selected answer candidates.

## INSUL Benchmark

INSUL is the category benchmark to beat: public official material
describes it as a quick prediction tool for walls, floors, and ceilings,
with construction selection, one-third-octave transmission-loss graphs,
STC/Rw airborne predictions, IIC/Ln,w impact predictions, and single,
double, triple, and quad system modelling.

DynEcho should learn the product lesson, not copy proprietary equations,
assets, or data. The lesson is:

- users need a fast working calculator, not a pile of source rows;
- formula families, input ownership, and visible limits matter;
- exact measurements are valuable, but they do not replace prediction
  for unbounded layer combinations;
- model depth and real-world input ergonomics are the bar for becoming
  the best acoustic calculator.

Relevant public sources:

- https://www.insul.co.nz/
- https://www.insul.co.nz/tech-info/
- https://www.insul.co.nz/download/
- https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf

## Agent Protocol

Before implementation:

1. read this file;
2. read [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md) for
   the closed V1 contract and answer-order rules;
3. read [CURRENT_STATE.md](./CURRENT_STATE.md) for current stable facts;
4. read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
   only for the explicitly selected active slice.

If no post-V1 slice has been explicitly selected, do not infer one from
historical "selected next" text. First classify the proposed work as
calculator formula/adapters, calibration/holdout, UI input ergonomics,
source promotion, or blocked drift.

Final handoff must say:

- which calculator capability moved;
- which route, basis, metric, and candidate owns the moved answer;
- which tests prove value, boundary, trace, and UI/API/report parity;
- which acceptance gap remains.
