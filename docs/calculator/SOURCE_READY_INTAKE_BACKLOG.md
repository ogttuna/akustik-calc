# Source-Ready Intake Backlog

Status: Gate A artifact for `calculator_source_intake_backlog_cleanup_v1`;
Gate C source for the selected
`generated_floor_fallback_topology_delta_v1` follow-up; refreshed after
generated-floor Gate C closed no-runtime; refreshed again after
`calculator_source_gap_revalidation_v4` Gate A selected
`knauf_wall_systems_source_pack_extraction_v1` as the next no-runtime
source extraction slice; refreshed after Knauf Gate A extracted source
locators and selected Gate B mapping/tolerance decision; refreshed
after Knauf Gate B blocked every extracted row from runtime import and
selected Gate C closeout; refreshed after Knauf Gate C closed
no-runtime and selected `calculator_source_gap_revalidation_v5`;
refreshed after v5 Gate A selected `TB.5A` mapping/tolerance; refreshed
after `TB.5A` Gate C closed no-runtime and selected `MWI.2A`
lined-masonry mapping/tolerance; refreshed after `MWI.2A` Gate A
landed no-runtime and selected Gate C closeout; refreshed after
`MWI.2A` Gate C closed no-runtime and selected `TTF30.2A` twin timber
mapping/tolerance; refreshed after `TTF30.2A` Gate A landed
no-runtime and selected Gate C closeout / next-slice selection;
refreshed after `TTF30.2A` Gate C closed no-runtime and selected
`calculator_source_gap_revalidation_v6`; refreshed after
`calculator_source_gap_revalidation_v6` Gate A selected
`steel_stud_knauf_enpc_mapping_tolerance_v1` no-runtime; refreshed
after `steel_stud_knauf_enpc_mapping_tolerance_v1` Gate A landed
no-runtime and selected Gate C closeout / next-slice selection;
refreshed after `steel_stud_knauf_enpc_mapping_tolerance_v1` Gate C
closed no-runtime and selected `calculator_source_gap_revalidation_v7`;
refreshed after `calculator_source_gap_revalidation_v7` Gate A landed
no-runtime and selected `calculator_post_knauf_source_acquisition_v1`.

Last reviewed: 2026-04-30.

This document is the single current backlog for source-ready calculator
accuracy work. It does not approve runtime imports, support promotion,
confidence promotion, evidence-tier promotion, route-card movement,
output-card movement, proposal/report copy changes, or workbench input
changes.

Runtime and visible behavior stay frozen until a future slice names:

- exact topology;
- metric owner and lab/field context;
- tolerance owner;
- material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine and web visible tests.

## Gate A Decision

`calculator_source_intake_backlog_cleanup_v1` Gate A lands as:

`gate_a_source_ready_intake_backlog_matrix_no_runtime`

Selected next file:

`packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`

Reason: every current source family is still blocked from runtime import.
The next bounded action is Gate C closeout / next-slice selection unless
a newly discovered source-ready pack satisfies all import prerequisites.

## Gate C Decision

`calculator_source_intake_backlog_cleanup_v1` Gate C closes no-runtime
and selects:

`generated_floor_fallback_topology_delta_v1`

Selected first file:

`packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`

Reason: no family is source-ready for runtime import. Generated floor
fallback has the clearest bounded no-runtime follow-up because Pliteq
exact rows and UBIQ bound rows already provide concrete source
topologies for a delta matrix, while the live generated fallback still
lacks exact or bounded topology.

## Generated Floor Topology Delta Gate A

`generated_floor_fallback_topology_delta_v1` Gate A lands no-runtime in:

`packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`

Next selected file:

`packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`

Reason: Gate A found topology near misses only. The live
`floor-steel-fallback` stack still lacks the exact Pliteq INEX /
GenieMat / resilient-channel / glasswool topology and the UBIQ FL-32
engineered-timber / no-fill bound topology. Exact Pliteq rows and UBIQ
FL-32 bound rows keep precedence only when their source topologies are
actually present. The generated fallback remains low-confidence and is
not runtime-import-ready.

## Generated Floor Topology Delta Gate C

`generated_floor_fallback_topology_delta_v1` Gate C closes no-runtime in:

`packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`

Next selected slice:

`calculator_source_gap_revalidation_v4`

Next selected file:

`packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`

Reason: Gate A found near misses only. No floor fallback runtime import,
support promotion, confidence promotion, evidence promotion, or visible
card/report movement is justified by the topology delta. The next
bounded action is a fresh source/accuracy gap revalidation before any
runtime, source-acquisition, productization, or pilot-promotion work is
selected.

## Calculator Source Gap Revalidation v4 Gate A

`calculator_source_gap_revalidation_v4` Gate A lands no-runtime in:

`packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`

Next selected slice:

`knauf_wall_systems_source_pack_extraction_v1`

Next selected file:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`

Reason: no source-ready runtime pack exists. The Knauf UK/AU
wall-system sources are concrete enough for source table locator
extraction, but not for import, support promotion, confidence
promotion, evidence promotion, or visible card/report movement. The
selected follow-up must extract row/table locators, topology metadata,
metric context, tolerance blockers, and test requirements before any
behavior can move.

## Knauf Wall Systems Source Pack Extraction Gate A

`knauf_wall_systems_source_pack_extraction_v1` Gate A lands no-runtime
in:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`

Next selected file:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`

Gate A extracted these official-source locator classes:

- Knauf UK steel-stud lab `Rw` row:
  `EN-PC-50-055-6-2-12.5-WB-25`.
- Knauf AU timber rows: `TO120.1A`, `TB.5A`, `TSF120.1A`,
  `TTF30.2A`.
- Knauf AU masonry/AAC rows: `MWI.2A`, `AAC.1A`.

Result: `EN-PC-50-055-6-2-12.5-WB-25`, `TB.5A`, `TTF30.2A`, and
`MWI.2A` are Gate B mapping/tolerance candidates only. `TO120.1A` is a
one-side-lined timber negative boundary. `TSF120.1A` and `AAC.1A` are
adjacent context only. No runtime import, support promotion, confidence
promotion, evidence promotion, output support movement, or visible card
/ report / input behavior movement is approved.

## Knauf Wall Systems Source Pack Extraction Gate B

`knauf_wall_systems_source_pack_extraction_v1` Gate B lands no-runtime
in:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`

Next selected file:

`packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate B status:

`no_knauf_locator_row_has_complete_topology_metric_tolerance_and_visible_test_ownership`

Result: every extracted Knauf row stays out of runtime import and
visible promotion. `EN-PC-50-055-6-2-12.5-WB-25` is adjacent to existing
steel-stud anchors but still lacks row-specific material/stud-gauge and
tolerance ownership. `TB.5A` remains the best timber double-board
research row but needs exact stud-depth column, `SHEETROCK ONE`,
`KI 75G11`, and tolerance mapping. `TTF30.2A` remains twin-timber /
asymmetric double-leaf research. `MWI.2A` remains lined-masonry
research and needs substrate, furring/cavity, coupling, board mapping,
and tolerance ownership. `TO120.1A` stays a one-side-lined negative
boundary; `TSF120.1A` and `AAC.1A` stay adjacent context only.

Metric result: source lab `Rw` is a named metric context only; `Rw+Ctr`
is not a standalone DynEcho `C` / `Ctr` / `STC` or field-output policy;
none of the rows supplies field/building `R'w`, `Dn,w`, `DnT,w`, or
`DnT,A` ownership.

## Knauf Wall Systems Source Pack Extraction Gate C

`knauf_wall_systems_source_pack_extraction_v1` Gate C closes
no-runtime in:

`packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Next selected slice:

`calculator_source_gap_revalidation_v5`

Next selected file:

`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`

Gate C selection status:

`closed_knauf_wall_systems_source_pack_no_runtime_and_selected_source_gap_revalidation_v5_because_gate_b_found_no_import_ready_row`

Reason: Gate B found no locator row with complete topology, metric,
tolerance, material mapping, and visible-test ownership. The Knauf
rows remain backlog inputs, not runtime imports. The next bounded
action is source/accuracy revalidation after the Knauf closeout.

## Calculator Source Gap Revalidation v5 Gate A

`calculator_source_gap_revalidation_v5` Gate A lands no-runtime in:

`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`

Next selected slice:

`timber_double_board_knauf_tb5a_mapping_tolerance_v1`

Next selected file:

`packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`

Gate A selection status:

`selected_no_runtime_knauf_tb5a_timber_double_board_mapping_tolerance_after_v5_rerank_found_no_runtime_ready_candidate`

Reason: no source-ready runtime pack exists after Knauf Gate C.
`TB.5A` is the highest-value bounded no-runtime follow-up because it
targets a common live timber double-board lane with a concrete official
Knauf locator.

## Timber Double-Board Knauf TB.5A Mapping / Tolerance Gate C

`timber_double_board_knauf_tb5a_mapping_tolerance_v1` Gate C closes
no-runtime in:

`packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Next selected slice:

`lined_masonry_knauf_mwi2a_mapping_tolerance_v1`

Next selected file:

`packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`

Gate C selection status:

`closed_tb5a_mapping_tolerance_no_runtime_and_selected_knauf_mwi2a_lined_masonry_mapping_tolerance_because_tb5a_lacks_exact_material_metric_tolerance_ownership`

Reason: `TB.5A` remains source context only. It lacks exact live
topology / stud-depth column selection, local `SHEETROCK ONE` and
`KI 75G11` mapping, field-output policy, and tolerance ownership.
`MWI.2A` is the next ranked concrete Knauf locator and targets the
lined masonry / heavy-core screening gap. It remains no-runtime until
substrate mass, furring/cavity coupling, board/insulation mapping,
field-output policy, tolerance ownership, and paired visible tests are
named.

## Lined Masonry Knauf MWI.2A Mapping / Tolerance Gate A

`lined_masonry_knauf_mwi2a_mapping_tolerance_v1` Gate A lands
no-runtime in:

`packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`

Next selected file:

`packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Gate A result:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Reason: `MWI.2A` remains source context only. Official Knauf Section F
gives `1x13 mm SHEETROCK ONE` each side, side 2 furring-channel
variants, concrete panel / core-filled block substrate variants, and
lab `Rw` / `Rw+Ctr` ratings. The live wall-screening route still uses
generic `gypsum_board`, `rockwool`, `air_gap`, and 100 mm generic
`concrete` without exact substrate mass, side/coupling metadata,
field-output policy, or tolerance ownership.

## Lined Masonry Knauf MWI.2A Mapping / Tolerance Gate C

`lined_masonry_knauf_mwi2a_mapping_tolerance_v1` Gate C closes
no-runtime in:

`packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Next selected slice:

`twin_timber_knauf_ttf302a_mapping_tolerance_v1`

Next selected file:

`packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`

Gate C selection status:

`closed_mwi2a_mapping_tolerance_no_runtime_and_selected_knauf_ttf302a_twin_timber_mapping_tolerance_because_mwi2a_lacks_exact_material_metric_tolerance_ownership`

Reason: `MWI.2A` remains source context only. It lacks exact live
topology, substrate mass selection, furring/coupling model, local
`SHEETROCK ONE` and `KI 25G24` / `KI 50G11` mapping, field-output
policy, tolerance ownership, and paired visible tests. `TTF30.2A` is
selected next because it is the remaining concrete Knauf double-leaf
twin timber locator and can map the no-stud / raw open-box / simple
timber negative boundaries without authorizing runtime movement.

## TTF30.2A Twin Timber Mapping / Tolerance Gate A

`twin_timber_knauf_ttf302a_mapping_tolerance_v1` Gate A lands
no-runtime in:

`packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`

Next selected action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Next selected file:

`packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Gate A status:

`gate_a_landed_ttf302a_twin_timber_mapping_tolerance_no_runtime_because_exact_column_material_metric_and_tolerance_ownership_remain_incomplete`

Result: `TTF30.2A` remains source context only. Official Knauf AU
Section D values were pinned for 70 / 90 mm stud columns, 199 / 239 mm
minimum wall widths, asymmetric `1x13 mm` side 1 / `2x13 mm` side 2
`FIBEROCK AQUA-TOUGH`, twin timber frames with a 20 mm gap, and
`Nil` / `KI 50G11` / `KI 75G11` / `KI 90G11` variants. Source ratings
span `Rw 49-64` and `Rw+Ctr 41-54`.

Runtime remains blocked because the live `wall-timber-stud` route is a
single-frame formula-owned generic gypsum / rockwool / air-gap route.
It does not exact-match `FIBEROCK AQUA-TOUGH`, side asymmetry,
twin-frame gap/coupling, exact 70 / 90 mm column, glasswool placement,
field-output policy, or tolerance ownership. No-stud double-leaf, raw
open-box / open-web, simple timber, `TB.5A`, `TSF120.1A`, `TO120.1A`,
steel, CLT, and masonry boundaries remain protected.

## TTF30.2A Twin Timber Mapping / Tolerance Gate C

`twin_timber_knauf_ttf302a_mapping_tolerance_v1` Gate C closes
no-runtime in:

`packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Next selected slice:

`calculator_source_gap_revalidation_v6`

Next selected file:

`packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`

Gate C selection status:

`closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership`

Reason: `TTF30.2A` remains source context only. It lacks exact
twin-frame topology, side asymmetry, `FIBEROCK AQUA-TOUGH` mapping,
glasswool placement, field-output policy, tolerance ownership, and
paired visible tests. Because `TB.5A`, `MWI.2A`, and `TTF30.2A` all
closed no-runtime, the next honest source-accuracy action is v6
revalidation before selecting another narrow source family.

## Source Gap Revalidation v6 Gate A

`calculator_source_gap_revalidation_v6` Gate A lands no-runtime in:

`packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`

Next selected slice:

`steel_stud_knauf_enpc_mapping_tolerance_v1`

Next selected file:

`packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`

Gate A selection status:

`selected_no_runtime_knauf_enpc_steel_stud_mapping_tolerance_after_v6_rerank_found_no_runtime_ready_candidate`

Reason: `EN-PC-50-055-6-2-12.5-WB-25` is the highest-value remaining
concrete Knauf locator after `TB.5A`, `MWI.2A`, and `TTF30.2A` closed
no-runtime. It targets a common steel-stud lane, but runtime remains
blocked until Wallboard and Acoustic Roll mapping, stud-gauge
equivalence, current steel-anchor precedence, lab/field metric policy,
tolerance ownership, and paired visible tests are complete.

## Steel Stud Knauf EN-PC Mapping / Tolerance Gate A

`steel_stud_knauf_enpc_mapping_tolerance_v1` Gate A lands no-runtime in:

`packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`

Next selected file:

`packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Gate A selection status:

`gate_a_landed_enpc_steel_stud_mapping_tolerance_no_runtime_because_wallboard_acoustic_roll_stud_gauge_field_metric_and_tolerance_ownership_remain_incomplete`

Next selected action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Reason: `EN-PC-50-055-6-2-12.5-WB-25` remains source context only. It
pins a Knauf UK steel-stud lab `Rw 49` row, but the live
`wall-lsf-knauf` route is already anchored to
`knauf_lab_416889_primary_2026` (`Rw 55`) with acoustic gypsum board,
70 mm glasswool, and 5 mm air gap. Runtime remains blocked because
Wallboard, 25 mm Acoustic Roll, 50 mm / 0.55 gauge stud detail,
field-output policy, spectrum-term policy, tolerance ownership, and
paired visible tests remain incomplete.

## Steel Stud Knauf EN-PC Mapping / Tolerance Gate C

`steel_stud_knauf_enpc_mapping_tolerance_v1` Gate C closes no-runtime in:

`packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Next selected slice:

`calculator_source_gap_revalidation_v7`

Next selected file:

`packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`

Gate C selection status:

`closed_enpc_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v7_because_all_concrete_knauf_mapping_rows_lack_exact_material_metric_tolerance_ownership`

Reason: `EN-PC-50-055-6-2-12.5-WB-25` remains source context only.
Runtime remains blocked by Wallboard / Acoustic Roll / stud-gauge
mapping gaps, field-output and spectrum-term policy gaps, tolerance
ownership, and missing paired visible tests. Because `TB.5A`,
`MWI.2A`, `TTF30.2A`, and `EN-PC-50-055-6-2-12.5-WB-25` have all
closed no-runtime, the next action is a fresh source/accuracy
revalidation rather than another direct import attempt.

## Source Gap Revalidation v7 Gate A

`calculator_source_gap_revalidation_v7` Gate A lands no-runtime in:

`packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`

Next selected slice:

`calculator_post_knauf_source_acquisition_v1`

Next selected file:

`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`

Gate A selection status:

`selected_post_knauf_source_acquisition_v1_after_v7_rerank_found_no_runtime_ready_candidate_and_current_sources_exhausted`

Reason: the concrete Knauf mapping chain has closed no-runtime and the
remaining Knauf rows are adjacent or negative context only. CLT /
mass-timber, generated floor fallback, no-stud double-leaf,
lined-heavy / heavy-core, timber double-board, and historical blocked
families still lack complete topology, metric, tolerance, material
mapping, negative-boundary, and visible-test ownership. The current
source set is exhausted for runtime movement, so the next honest
accuracy step is a no-runtime post-Knauf source acquisition pass.

## Post-Knauf Source Acquisition Gate A

`calculator_post_knauf_source_acquisition_v1` Gate A lands no-runtime in:

`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`

Next selected slice:

`british_gypsum_white_book_source_pack_extraction_v1`

Next selected file:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`

Gate A selection status:

`selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import`

Reason: British Gypsum White Book official selector rows are the best
fresh source pack found in this acquisition pass. They cover
`C204006` / `C204003` GypFloor Silent floor rows, `A206A290` GypWall
Single Frame, `A046006` timber stud, `A326017B` GypWall Twin Frame
Audio, and `B226010` GypLyner Single lined masonry. Runtime remains
blocked because local material mapping, metric policy, tolerance
ownership, protected negative boundaries, and paired engine/web visible
tests still need row-by-row extraction.

## British Gypsum White Book Source Pack Extraction Gate A

`british_gypsum_white_book_source_pack_extraction_v1` Gate A lands
no-runtime in:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`

Next selected action:

`gate_b_mapping_tolerance_decision_no_runtime`

Next selected file:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`

Gate A status:

`british_gypsum_rows_extracted_no_new_runtime_import_a046006_already_landed_others_need_mapping_tolerance_visible_tests`

Reason: Gate A extracted `C204006`, `C204003`, `A206A290`,
`A046006`, `A326017B`, and `B226010`. `A046006` is already represented
by `british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`
and must not be duplicated. `C204006`, `C204003`, `A206A290`,
`A326017B`, and `B226010` still require exact live topology mapping,
local material mapping, metric policy, tolerance ownership, protected
negative boundaries, and paired engine/web visible tests before any
runtime or visible movement.

## Source Verification Notes

The following public source surfaces were checked during this planning
pass. They remain context only:

- Knauf UK Drywall Systems Performance Guide, April 2026:
  `https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB`
- Knauf Australia Systems+ Design Guide:
  `https://knauf.com/en-AU/knauf-gypsum/services/training/systems-plus`
- Knauf Australia Systems+ Section D Timber Stud Walls:
  `https://knauf.com/api/download-center/v1/assets/4e58706c-df9d-4579-8d5b-8e685cf29194?country=AU&download=true&locale=en-AU`
- Knauf Australia Systems+ Section F Masonry Upgrades:
  `https://knauf.com/api/download-center/v1/assets/16b8f406-a9be-47bd-9e7a-7212d6f19a28?country=AU&download=true&locale=en-AU`
- WoodWorks Acoustically Tested Mass Timber Assemblies:
  `https://www.woodworks.org/wp-content/uploads/Acoustically-Tested-Mass-Timber-Assemblies-WoodWorks.pdf`
- WoodWorks Mass Timber Fire and Acoustic Database:
  `https://www.woodworks.org/resources/mass-timber-fire-and-acoustic-design/`
- NRC Canada mass timber report archive:
  `https://nrc-publications.canada.ca/eng/view/object/?id=e38fb723-6a4c-4a78-9e47-5a73c92c448f`
- NRC Canada NLT addendum archive:
  `https://nrc-publications.canada.ca/eng/view/object/?id=9e3b39be-e0ed-415b-9649-3e7ec228f52c`
- UBIQ INEX FLOOR fire/acoustic tables:
  `https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`
- Pliteq acoustic test data portal:
  `https://pliteqindustrial.com/acoustic-test-data/`
- Dataholz component catalogue:
  `https://www.dataholz.eu/en/`
- British Gypsum White Book overview and Specification Selector:
  `https://www.british-gypsum.com/specification/white-book-specification-selector/white-book-overview`
- British Gypsum GypFloor Silent C204006 selector row:
  `https://www.british-gypsum.com/Specification/White-Book-Specification-Selector/floors/gypfloor-silent/c204006-en`
- British Gypsum GypFloor Silent C204003 selector row:
  `https://www.british-gypsum.com/Specification/White-Book-Specification-Selector/floors/gypfloor-silent/c204003-en`
- British Gypsum A206A290 GypWall Single Frame technical specification:
  `https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a206a290-b-en.pdf`
- British Gypsum A046006 timber stud technical specification:
  `https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046006-en.pdf`
- British Gypsum GypWall Twin Frame Audio A326017B selector row:
  `https://www.british-gypsum.com/Specification/White-Book-Specification-Selector/internal-partitions-walls/gypwall-twin-frame-audio/a326017b-b-en`
- British Gypsum GypLyner Single B226010 selector row:
  `https://www.british-gypsum.com/Specification/White-Book-Specification-Selector/wall-linings/gyplyner-single/b226010-en`
- Stora Enso Soundproofing for CLT:
  `https://www.storaenso.com/-/media/documents/download-center/documents/product-specifications/wood-products/clt-technical/soundproofing/soundproofing-for-clt-by-stora-enso-en.pdf`

These are valid intake locators, not source-ready runtime packs. A future
runtime slice must still extract rows, map metrics, define tolerance, and
write positive and negative tests.

## source_ready_intake_backlog_matrix

| Family | Current runtime posture | User-visible risk | Context source pointers | First missing requirement | Runtime import ready now |
|---|---|---|---|---|---|
| `clt_mass_timber_wall` | formula-owned, medium-confidence, source-gated | mass-timber wall result can look more source-backed than it is | WoodWorks tables/database, NRC mass-timber report and NLT addendum, Dataholz CLT floor rows as floor-only rejection context | exact wall table/report row plus STC/FSTC/ASTC/IIC to ISO `Rw` policy or explicit rejection | false |
| `timber_double_board_stud_wall` | formula-owned, low-confidence, source-gated | direct double-board timber stack can look over-precise | Knauf UK/AU timber and lining contexts, adjacent single-board and resilient-bar exact rows | direct live double-board timber row or bounded formula tolerance owner | false |
| `no_stud_double_leaf_wall` | formula-owned, source-blocked | no-stud/no-rail double-leaf formulas can be retuned without local tolerance | Davy/Sharp formula context, NRC context only | no-stud/no-rail direct row mapping or local Davy/Sharp single-number tolerance owner | false |
| `generated_floor_fallback` | low-confidence screening | generated steel/open-web fallback can overstate accuracy when deck/ceiling/support topology is missing | UBIQ INEX, Pliteq exact/bound rows, existing floor fallback contracts | exact Pliteq/UBIQ topology match or bounded steel/open-web family rule | false |
| `lined_massive_heavy_core_wall` | screening, no wall source or bounded lining rule | lined concrete/heavy-core wall values can be mistaken for source-backed wall truth | Knauf lining context and floor/ceiling adjacent rows | wall-specific lined concrete/heavy masonry row or bounded lining rule | false |
| `historical_blocked_families` | fail-closed | old exact imports can reopen from nearby green tests | `GDMTXA04A`, `C11c`, raw open-box/open-web, wall-selector historical contracts | new source evidence satisfying the original closed blocker | false |

## per_family_runtime_import_prerequisites

### `clt_mass_timber_wall`

Required before runtime import:

- exact CLT, NLT, DLT, or double-CLT wall row locator;
- source metric owner for STC/FSTC/ASTC/IIC versus ISO `Rw`, `R'w`,
  and `DnT,w`;
- row-level topology mapping for leaf thickness, board layers, cavity,
  resilient elements, insulation, and exposed/encapsulated surfaces;
- tolerance owner if a formula path is proposed;
- engine tests for positive row mapping and floor-only rejection;
- web route-card/report tests if value, support, confidence, or evidence
  wording changes.

Protected near misses:

- Dataholz CLT floor rows remain floor-only source truth.
- WoodWorks and NRC STC/ASTC contexts do not become ISO `Rw` truth by
  proximity.
- IIC remains impact context and does not support wall airborne outputs.

### `timber_double_board_stud_wall`

Required before runtime import:

- direct double-board timber stud row matching the live stack, or a
  bounded formula owner for the same stack class;
- explicit side count, board count, board material, cavity fill, stud
  coupling, and lining metadata;
- tolerance for lab and field/building outputs;
- engine tests for direct positive match and adjacent single-board /
  resilient-bar rejections;
- web visible tests for route-card confidence/evidence wording if the
  user-facing posture moves.

Protected near misses:

- single-board rows do not promote double-board routes;
- resilient-bar rows do not promote direct-connected timber routes;
- steel/LSF holdout rows do not become timber-stud truth.

### `no_stud_double_leaf_wall`

Required before runtime import:

- direct no-stud/no-rail row mapping, or a local Davy/Sharp tolerance
  owner tied to the engine input set;
- explicit cavity, porous fill, leaf mass, separation, coupling, and
  frequency-band assumptions;
- single-number `Rw`/field translation policy;
- negative tests for framed, railed, gypsum-block, and mass-timber
  adjacent cases;
- web visible tests if any route-card or report posture moves.

Protected near misses:

- framed double-leaf rows do not promote no-stud/no-rail rows;
- formula context does not justify value movement without local inputs
  and tolerance;
- NRC mass-timber context does not supply no-stud wall truth.

### `generated_floor_fallback`

Required before runtime import:

- exact source topology for deck, board, topping, resilient layer,
  ceiling, support, cavity, and lining, or a bounded family rule;
- metric owner for `Rw`, `R'w`, `DnT,w`, `Ln,w`, and `L'n,w` where
  applicable;
- precedence rules against existing exact and bound floor rows;
- unsupported-output policy for low-frequency impact outputs;
- engine and web tests for exact path, bound path, fallback path,
  many-layer, and reorder behavior.

Protected near misses:

- UBIQ/Pliteq rows do not apply unless the live stack topology matches.
- raw open-web and open-box impact stay fail-closed without true bare
  carrier data.
- `L'nT,50` remains unsupported unless source evidence names it.

### `lined_massive_heavy_core_wall`

Required before runtime import:

- wall-specific lined concrete or heavy-masonry source row, or a bounded
  wall lining rule;
- side-order and mounting metadata;
- lab/field/building metric owner;
- tolerance owner for screening to formula/source movement;
- engine and web tests for floor-only rejection and wall-specific
  positive cases.

Protected near misses:

- floor-only CC60 or ceiling rows do not become wall truth;
- presets do not promote source truth;
- old heavy-concrete parity checks do not reopen the route by
  themselves.

### `historical_blocked_families`

Required before runtime import:

- `GDMTXA04A`: composite dry-screed surface model with source-equivalent
  topology;
- `C11c`: raw one-third-octave impact spectrum or source correction /
  lab note explaining the anomalous combined wet tuple;
- raw open-box/open-web: true bare carrier impact evidence, not packaged
  systems;
- wall-selector: fresh classified wall defect or source truth, not a
  nearby green test.

Protected near misses:

- source schedules alone do not override closed blockers;
- adjacent package rows do not become bare carrier rows;
- historical fail-closed families stay closed until the original blocker
  is directly satisfied.

## stale_or_duplicate_source_doc_cleanup_notes

- `NEXT_IMPLEMENTATION_PLAN.md` remains the tactical authority.
- `CURRENT_STATE.md` remains the short state snapshot.
- `CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md` remains long-horizon
  strategy, not implementation permission.
- `SOURCE_GAP_LEDGER.md` remains historical and floor-dominant; this
  backlog is the current cross-family source-intake surface.
- Prior family plans and checkpoints remain useful evidence owners. Do
  not delete them unless a future cleanup proves a document is both
  misleading and superseded without unique evidence.
- New source candidates should be added here first, then linked from the
  roadmap or ledger only if they change the ranked next action.

No stale document currently needs deletion. The cleanup needed at Gate A
is consolidation and explicit cross-linking, not removal.

## negative_boundary_and_near_miss_register

- `GDMTXA04A`, `C11c`, raw open-box/open-web, heavy-concrete parity,
  reinforced-concrete reopen, wall selector behavior, timber-stud
  widening, and wall exact-row follow-ups must not reopen from nearby
  green tests.
- No candidate can move `runtimeImportReadyNow` to `true` inside Gate A.
- Context sources cannot promote support, confidence, evidence tier,
  API shape, route-card values, output-card statuses, proposal/report
  surfaces, or workbench inputs.
- Floor-only rows do not become wall rows.
- STC/FSTC/ASTC/IIC contexts do not become ISO `Rw`, `R'w`, or `DnT,w`
  outputs without explicit metric policy.
- Formula-owned or screening lanes do not become high confidence for
  pilot convenience.
- Exact/bound source rows keep precedence over generated fallback logic.

## next_candidate_selection_rules

1. Select a runtime accuracy slice only when exact topology, metric
   owner, tolerance owner, protected negative boundaries, and paired
   engine/web visible tests can be named before implementation starts.
2. Select a no-runtime extraction slice when a source locator is concrete
   enough to extract rows or metric policy but still lacks runtime
   prerequisites.
3. Select cleanup only when planning surfaces disagree or hide the first
   missing requirement.
4. Never select a low-confidence, screening, formula-owned, or
   source-gated lane for confidence/support promotion because it helps
   the internal pilot.

## Immediate Next Steps

1. Implement `calculator_source_gap_revalidation_v5` Gate A:
   `packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`.
2. Treat Knauf Gate B and Gate C as authoritative: no extracted Knauf candidate has
   complete exact topology, metric context, tolerance ownership, local
   material mapping, and visible-test ownership.
3. Select a runtime accuracy slice only if a later gate names exact topology,
   metric owner, tolerance owner, protected negative boundaries, and
   paired engine/web visible tests.
4. Keep all validation gates green:
   `pnpm calculator:gate:current`, targeted Gate A/Gate C contracts,
   `git diff --check`, and `pnpm check` when the release gate is needed.
