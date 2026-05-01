# Slice Plan - Wall Triple-Leaf Accuracy Recovery v1

Slice id: `wall_triple_leaf_accuracy_recovery_v1`

Status: GATE G3 LANDED / GATE G4 NEXT (selected 2026-04-30 after a user
PDF repro showed the current multi-leaf result is not a validated
calculation, Gate D extracted the source-pack candidates, Gate E
classified the source corpus, and Gate F added a research-only
frequency-band solver skeleton without numeric promotion. Gate G then
defined calibration / holdout tolerance and selected source-curve
digitization intake before runtime integration. Gate G2 created the
typed NRC 2024 graph-row intake, confirmed the curves are still
non-numeric plot data, and selected reproducible digitization QC. Gate
G2B digitized the plotted curves into bounded source rows for Gate G3
calibration while keeping runtime frozen. Gate G3 then passed the
NRC-like source-family calibration/holdout and negative-boundary proof
while keeping local material mapping and runtime frozen).

Latest checkpoint:

[CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G3_HANDOFF.md](./CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G3_HANDOFF.md)
lands Gate G3 source-family calibration fit and negative-boundary proof
no-runtime, keeps the live split-rockwool result frozen, and selects
Gate G4 local material mapping / runtime eligibility decision.

Focused user-defect handoff:

[TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md](./TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md)
explains why moving rockwool in the flat list exposed a real
triple-leaf modeling/input defect, why it is not enough to call this
user error, and what Gate G4 must decide before any runtime movement.

Prior checkpoint:

[CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2B_HANDOFF.md](./CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2B_HANDOFF.md)
lands Gate G2B reproducible curve digitization QC no-runtime, keeps the
live split-rockwool result frozen, and selects Gate G3 calibration fit
and negative-boundary proof.
Gate G2B status:
`gate_g2b_landed_reproducible_curve_digitization_qc_no_runtime_and_selected_calibration_fit_gate_g3`.

Prior checkpoint:

[CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2_HANDOFF.md](./CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2_HANDOFF.md)
lands Gate G2 source-curve digitization intake no-runtime, keeps the
live split-rockwool result frozen, and selects Gate G2B reproducible
digitization QC at
`packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts`
with
`gate_g2_landed_source_curve_digitization_intake_no_runtime_and_selected_reproducible_digitization_qc`.

Prior checkpoint:

[CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G_HANDOFF.md](./CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G_HANDOFF.md)
lands Gate G calibration / holdout tolerance no-runtime, keeps the live
split-rockwool result frozen, and selects Gate G2 source-curve
digitization intake at
`packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts`
with
`gate_g_defined_calibration_holdout_regime_no_runtime_and_selected_source_curve_digitization_intake`.

Prior checkpoint:

[CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_F_HANDOFF.md](./CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_F_HANDOFF.md)
lands Gate F frequency-band solver skeleton no-runtime, keeps the live
split-rockwool result frozen, and selects Gate G calibration / holdout
tolerance at
`packages/engine/src/wall-triple-leaf-calibration-regime.test.ts` with
`gate_f_landed_frequency_band_solver_skeleton_no_runtime_and_selected_calibration_holdout_gate_g`.

Prior checkpoint:

[CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_E_HANDOFF.md](./CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_E_HANDOFF.md)
lands Gate E source-corpus classification no-runtime, keeps every
source out of exact/runtime evidence, and selects the Gate F
frequency-band solver skeleton at
`packages/engine/src/wall-triple-leaf-frequency-solver.test.ts` with
`gate_e_classified_triple_leaf_source_corpus_no_runtime_and_selected_frequency_band_solver_gate_f`.

Prior checkpoint:
[CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_D_HANDOFF.md](./CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_D_HANDOFF.md)
lands Gate D source-pack extraction no-runtime, keeps every candidate
`directRuntimeReadyNow: false`, and selects the Gate E source-corpus
classifier / negative-boundary contract with
`gate_d_extracted_triple_leaf_source_pack_no_runtime_and_selected_source_corpus_classifier_gate_e`.

Prior checkpoint:
[CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C_HANDOFF.md](./CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C_HANDOFF.md)
lands the research plan, keeps the split-rockwool value frozen, and
selects
`packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts`
for source-pack extraction / calibration-corpus work before any numeric
movement with
`gate_c_researched_triple_leaf_physics_and_selected_source_pack_extraction_before_any_numeric_promotion`.

Selection status:

`gate_g3_passed_nrc_2024_source_family_calibration_holdout_and_negative_boundaries_no_runtime_selected_local_mapping_gate_g4`

Next implementation file:

`packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts`

## Problem

The user supplied two generated PDFs for the same practical wall
assembly family. The only important change was that one stack had the
two `50 mm` rockwool layers adjacent, while the other inserted a
`12.5 mm` gypsum board between them.

Current engine behavior:

- adjacent rockwool stack: `Rw 51`, family `double_leaf`, strategy
  `double_leaf_porous_fill_delegate`, medium confidence;
- split rockwool stack: `Rw 41`, family `multileaf_multicavity`,
  strategy `multileaf_screening_blend`, low confidence;
- field/building repro with line connection, light steel stud,
  `600 mm` spacing, `3.6 m x 2.8 m`, `45 m3`, `RT60 0.6 s`:
  `R'w 34`, `DnT,w 36`, still `multileaf_screening_blend`, low
  confidence.

The 10 dB drop is directionally plausible for some triple-leaf
assemblies, but the current number is not source-validated. The
current multi-leaf branch is a conservative blend between the screening
seed and Sharp, not a real multi-cavity / triple-leaf solver. It cannot
be treated as the company-internal accuracy checkpoint answer.

## Decision

This slice supersedes the active British Gypsum Gate B source-extraction
thread until the triple-leaf accuracy defect has a clear fail-closed
input model and solver path. British Gypsum work is paused, not
discarded.

Gate A landed the user repro as executable evidence and kept all runtime
values frozen. Gate B defined the missing wall topology input model and
missing-field policy. Gate C researched the physics and standards chain,
then deliberately held numeric movement because source rows, curves,
calibration, tolerance, and visible tests were still missing. Gate D
then extracted and classified source-pack candidates but kept all
runtime, support, confidence, evidence, route-card, output-card,
proposal/report, API, and workbench behavior frozen. Gate E classified
the source corpus and negative boundaries. Gate F added the
research-only three-leaf/two-cavity frequency-band solver skeleton and
still kept live runtime frozen until calibration / holdout tolerance.
Gate G defined the executable tolerance gate: source-owned calibration
must have at least two calibration rows, at least one holdout row, MAE
<= 2 dB, max error <= 4 dB, and dip-band placement within one
neighboring one-third-octave band. Because the current corpus has no
digitized triple-leaf TL rows and no source-owned holdouts, Gate G kept
the solver research-only and selected Gate G2 source-curve
digitization.

## Required Topology Model

Flat layer order is not enough for this family. The calculator must be
able to represent:

- `sideALeaf`: one or more layers acting as the source-side leaf;
- `cavity1`: depth, fill material, fill coverage, and absorption
  class;
- `internalLeaf`: one or more layers between the two cavities;
- `internalLeafCoupling`: independent, attached to side A, attached to
  side B, shared stud / bridge, direct bridge, or unknown;
- `cavity2`: depth, fill material, fill coverage, and absorption
  class;
- `sideBLeaf`: one or more layers acting as the receiving-side leaf;
- `supportTopology`: stud type, spacing, track independence, resilient
  channels, and whether the internal leaf bridges the two leaves;
- `metricPolicy`: lab `Rw`, field `R'w`, or `DnT,w` building
  prediction ownership.

If the stack is detected as three visible leaves around two compliant
cavities and the coupling/support details are unknown, the calculator
must ask for the missing topology instead of allowing the number to be
interpreted as an accurate answer.

## Gate A - Repro Contract

Gate A landed in:

`packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-a-contract.test.ts`

It proves:

1. The adjacent-rockwool repro remains a medium-confidence double-leaf
   estimate at `Rw 51`.
2. The split-rockwool repro remains a low-confidence multi-leaf blend
   at `Rw 41`.
3. Existing advanced UI metadata for connection type, stud type, stud
   spacing, dimensions, volume, and RT60 does not provide enough
   topology to calculate the triple-leaf construction correctly.
4. The current `multileaf_screening_blend` answer is not accepted for
   internal-use accuracy.

Gate A does not change runtime behavior.

## Gate B - Topology Input and Missing-Field Policy

Gate B landed in:

`packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-b-contract.test.ts`

Gate B adds:

1. Shared schema for grouped wall topology:
   `sideALeaf`, `cavity1`, `internalLeaf`, `cavity2`, `sideBLeaf`,
   `internalLeafCoupling`, and `supportTopology`.
2. Workbench input model that lets the user express the construction
   without relying on ambiguous flat order alone.
3. Engine classification that distinguishes:
   - stable double leaf;
   - triple leaf with independent internal leaf;
   - triple leaf with structural bridge;
   - two separate wall leaves with unrelated finish layers;
   - unknown topology that must fail closed for exact calculation.
4. Missing-field diagnostics that name the exact required fields.
5. Paired engine and web tests for the user repro, including the
   Playwright-confirmed metadata case.

Gate B does not promote the current number. If grouped topology is
missing, the engine names missing fields. If grouped topology is
complete, the engine still blocks exact promotion until Gate C lands a
source-calibrated solver, tolerance owner, and paired visible tests.

## Gate C - Research Plan and Numeric Hold

Gate C landed in:

`packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts`

Gate C is intentionally no-runtime. It researches the source path and
selects Gate D, but does not promote `multileaf_screening_blend`.

Primary findings:

1. NRC 2024 measured double-stud walls with gypsum board installed
   inside the cavity. The paper reports that the internal board creates
   two mass-air-mass resonances and large low-frequency transmission
   loss reductions in the tested assemblies. This makes a large drop
   physically plausible, but does not own the exact `Rw` for our local
   stack.
   Source:
   `https://nrc-publications.canada.ca/eng/view/accepted/?id=768bf32f-8313-435f-ab85-8680efba61b2`
2. NRC 1998 gypsum-board wall transmission-loss data is the best
   parser-ready baseline / negative-boundary corpus because it provides
   one-third-octave transmission-loss data, material specifications, and
   construction details across a large wall set. It still has to be
   extracted and mapped before runtime, and it is not automatically a
   triple-leaf internal-board answer because many rows are ordinary
   gypsum-board wall assemblies.
   Source:
   `https://nrc-publications.canada.ca/eng/view/object/?id=04ac8069-a5d2-4038-8787-da064b073e7f`
3. Uris et al. 2006 is a measured Applied Acoustics triple-leaf /
   internal-gypsum-board paper. The available abstract/locator reports
   measured sound reduction data and a weighted sound reduction decrease
   when the gypsum board layer is inserted in the middle of a double
   frame partition. Gate D must obtain full topology and usable curves
   before it can become an exact or bounded row; abstract-level deltas
   are not runtime truth.
   Source:
   `https://www.sciencedirect.com/science/article/pii/S0003682X05001799`
4. Warnock / NRC 1998 concrete-block drywall guidance is adjacent
   negative-boundary evidence. It shows that attached gypsum board on
   masonry can improve high frequencies while causing low-frequency
   mass-air-mass penalties, especially when cavity depth is too small.
   It protects lined masonry and one-side-lining boundaries, but does
   not directly calibrate the steel-stud internal-board runtime lane.
   Source:
   `https://nrc-publications.canada.ca/eng/view/object/?id=8fe95aff-adf1-4a91-bc2e-f150870a5aee`
5. Ballagh 2013 gives a practical low-frequency triple-panel model:
   three panel masses coupled by two air springs with two interacting
   resonances. It is a solver-shape candidate, not an immediate runtime
   owner, because damping, coupling, and mid/high-frequency behavior
   must be calibrated.
   Source:
   `https://new.acoustics.org.nz/wp-content/uploads/Ballagh_K_NZA2013.pdf`
6. ISO 10140-2 is the lab measurement boundary; ISO 717-1 is the
   single-number rating boundary; ISO 12354-1 is the building prediction
   / field overlay boundary. These standards tell us how to rate and
   overlay a curve, not how to hand-pick the missing curve.
   Sources:
   `https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/94/79487.html?browse=tc`,
   `https://www.iso.org/standard/77435.html`,
   `https://www.iso.org/standard/70242.html`

Second research iteration findings:

- NRC 2024 has concrete assembly codes, STC values, resonance estimates,
  and plotted one-third-octave TL curves for internal-board double-stud
  assemblies. It is `P0` for Gate D, but likely as a
  graph-digitization / bounded-calibration candidate unless full numeric
  TL tables are recovered.
- NRC 1998 downloaded and text-extracted as a 10 MB report with
  parser-ready row blocks: `TestID`, `STC`, one-third-octave TL from
  `50 Hz` to `6300 Hz`, element descriptions, material codes, surface
  densities, stud spacing, and insulation properties. It is `P0` for
  baseline corpus and negative boundaries, not immediate triple-leaf
  promotion.
- Uris 2006 is `P1`: promising measured internal-gypsum-board evidence,
  but Gate D must access full curves and exact construction details. If
  only abstract/metadata is available, it stays qualitative.
- Ballagh 2013 is `P1`: solver model only. It can shape Gate F, not
  authorize a live `Rw`.
- Warnock / NRC concrete-block drywall is `P2`: adjacent negative
  boundary for lined masonry / attached drywall resonance pitfalls.

Gate D must not use any abstract snippet, STC-only row, chart-only row,
or adjacent masonry guidance as exact `Rw` truth. A row can only become
runtime evidence after metric ownership, band data, topology, material
mapping, tolerance, and visible-test ownership are all named.

Gate C blocks numeric movement until all of these are true:

- local triple-leaf source corpus has extracted candidate rows and band
  curves;
- local material mapping covers `gypsum_board`, `mlv`, `rockwool`, and
  `gypsum_plaster` against source materials;
- damping and coupling/bridge parameters are calibrated;
- holdout tolerance is named for source-calibrated triple-leaf rows;
- web-visible grouped topology input, route-card, output-card, and
  proposal/report tests exist;
- field `R'w` and `DnT,w` wait behind owned lab curve plus ISO 12354
  overlay policy.

## Implementation Sequence

### Gate D - Source-Pack Extraction and Calibration Corpus

Landed in:

`packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts`

Source corpus module:

`packages/engine/src/wall-triple-leaf-source-pack.ts`

Extract candidate rows from NRC and adjacent primary sources. Every
candidate must state:

- source URL and publication identity;
- direct PDF / download availability and extraction status;
- page/table/figure locator;
- lab or field metric owner;
- available band grid (`50`, `63`, `80`, `100` through `3150/4000 Hz`);
- single-number metric (`Rw`, `STC`, or other) and whether it is
  directly usable or only context;
- side A leaf mass/layers;
- cavity 1 depth, fill, and absorption state;
- internal leaf mass/layers;
- internal leaf coupling/bridge class;
- cavity 2 depth, fill, and absorption state;
- side B leaf mass/layers;
- support topology;
- local material mapping status;
- candidate classification: `exact_row_candidate`,
  `bounded_calibration_candidate`, `graph_digitization_candidate`,
  `baseline_corpus_and_negative_boundary_candidate`,
  `qualitative_only`, `adjacent_negative_boundary`, or
  `rejection_only`;
- first missing blocker for import.

Gate D extraction priority:

1. `P0` `nrc_2024_internal_gypsum_double_stud`:
   extract Table 1 assembly short codes, STC values, Table 2 resonance
   estimates, figure availability, and decide whether plotted TL curves
   can be digitized accurately enough for calibration.
2. `P0` `nrc_1998_gypsum_board_walls_tl_data`:
   extract parser-ready TL rows, material densities, framing,
   insulation, double-stud rows, and double-leaf negatives.
3. `P1` `uris_2006_internal_gypsum_double_frame`:
   import only if full curves and exact topology are accessible; keep
   qualitative if only abstract or weighted-index deltas are available.
4. `P1` `ballagh_2013_triple_panel_low_frequency_model`:
   extract equations / assumptions for Gate F, not runtime rows.
5. `P2` `warnock_1998_concrete_block_attached_drywall`:
   extract resonance and cavity-depth guidance as lined-masonry /
   attached-drywall negative boundaries.

Exit condition: complete. Gate D produced a local typed source-pack and
contract row set that classifies candidates as
`graph_digitization_candidate`,
`baseline_corpus_and_negative_boundary_candidate`, `qualitative_only`,
`solver_model_only`, or `adjacent_negative_boundary`, with every row set
to `directRuntimeReadyNow: false` until Gate G/H explicitly promote a
calibrated solver.

### Gate E - Source-Corpus Classifier and Negative Boundaries

Landed in:

`packages/engine/src/wall-triple-leaf-source-corpus-contract.test.ts`

Source classifier module:

`packages/engine/src/wall-triple-leaf-source-corpus.ts`

Create a local classifier that prevents source evidence from leaking
into the wrong lane.

Required negatives:

- ordinary double-leaf exact rows;
- simple stud walls without internal leaf;
- lined masonry or one-side lining;
- source rows without band curves or exact topology;
- floors and floor/ceiling impact rows;
- field-only rows that lack lab element curve ownership.

Exit condition: complete. Gate E proves only
`nrc_2024_internal_gypsum_double_stud` enters the non-runtime
`triple_leaf_calibration_candidate` intake lane, and even that source is
not exact/runtime evidence until graph digitization, local material
mapping, coupling mapping, tolerance ownership, and paired visible tests
exist. NRC 1998 ordinary gypsum-board TL rows stay baseline /
negative-boundary only; Uris 2006 stays qualitative; Ballagh 2013 stays
solver context only; Warnock / NRC concrete-block drywall stays
adjacent boundary only. Required negatives cover ordinary double-leaf
exact rows, simple stud walls without internal leaf, lined masonry /
one-side lining, rows missing band curves or exact topology, floor /
impact rows, and field-only rows without lab element curve ownership.

### Gate F - Frequency-Band Solver Skeleton

Landed in:

`packages/engine/src/wall-triple-leaf-frequency-solver.test.ts`

Solver module:

`packages/engine/src/wall-triple-leaf-frequency-solver.ts`

Build the solver off frequency curves, not direct `Rw` retuning.

Required behavior:

- derive leaf surface masses from grouped layers;
- model two cavity springs and the interacting resonance pair;
- include cavity fill damping / absorption class;
- include coupling class and support topology as explicit parameters;
- return a one-third-octave transmission-loss curve;
- compute `Rw`, `C`, and `Ctr` through the existing ISO 717 curve-rating
  helpers;
- mark all output as experimental/no-runtime until Gate G passes.

Exit condition: complete. Gate F derives the user repro's Side A /
internal / Side B leaf masses from grouped topology, predicts two
cavity-spring resonance bands near the low-frequency mass-air-mass
region, exposes the interacting resonance pair plus fill/coupling
parameters, returns ISO 717-ready one-third-octave curves, and proves
the live dynamic calculator still returns `multileaf_screening_blend`
`Rw 41`.

### Gate G - Calibration and Holdout Tolerance

Landed in:

`packages/engine/src/wall-triple-leaf-calibration-regime.test.ts`

Calibration module:

`packages/engine/src/wall-triple-leaf-calibration-regime.ts`

Calibrate damping and coupling parameters against source rows, with
holdouts.

Acceptance target:

- exact row: zero-drift overlay only when the row is literally matched;
- bounded calibrated family: target MAE <= 2 dB and max error <= 4 dB
  over owned `Rw` rows, unless source evidence forces a stricter
  corridor;
- low-frequency dip placement: predicted dip bands must land in the
  measured neighboring one-third-octave band corridor;
- failure path: if thresholds fail, the solver remains research-only and
  runtime stays on low-confidence screening.

Exit condition: complete. Gate G defines the tolerance owner but does
not pass it for runtime because no source-owned triple-leaf rows have
digitized/numeric band curves and no holdout rows exist yet. The live
dynamic calculator still returns the user split-rockwool repro as
low-confidence `multileaf_screening_blend` `Rw 41`.

### Gate G2 - Source Curve Digitization Intake

Landed in:

`packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts`

Source-curve intake module:

`packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.ts`

Research update after Gate G:

- NRC 2024 is still the first source to process. The official NRC paper
  states that the tested internal-board double-stud walls create two
  mass-air-mass resonances around the 80 Hz one-third-octave band and
  a sharp low-frequency TL decrease below 200 Hz. It also names Table 1
  assemblies A-D, Figure 4 absolute TL curves, and Figure 5 delta
  curves versus the Type C base wall. Source:
  `https://nrc-publications.canada.ca/eng/view/accepted/?id=768bf32f-8313-435f-ab85-8680efba61b2`.
- NRC 1998 remains useful but cannot be promoted into the triple-leaf
  runtime lane. The official NRC archive describes it as 350 gypsum
  board wall specimens with detailed one-third-octave TL data,
  material specifications, and construction details, but the currently
  extracted representative rows are ordinary walls without an internal
  leaf. Source:
  `https://nrc-publications.canada.ca/eng/view/object/?id=04ac8069-a5d2-4038-8787-da064b073e7f`.
- ISO 717-1 owns the single-number rating procedure from octave or
  one-third-octave measurement results; it does not create the missing
  TL curve. Source: `https://www.iso.org/standard/77435.html`.
- ISO 10140-2 owns the laboratory element measurement boundary and
  warns that lab results are not directly field results without
  accounting for flanking, boundary conditions, and loss factor. Source:
  `https://www.iso.org/standard/79487.html`.
- ISO 12354-1 owns later building/field estimation from element and
  flanking data; it is not a substitute for the missing lab element
  curve. Source: `https://www.iso.org/standard/70242.html`.

Required behavior:

- identify the NRC 2024 plotted one-third-octave transmission-loss
  curves for assemblies A-D;
- identify the Type C base wall curve used by Figure 4 and require a
  later Figure 5 delta cross-check against `assemblyTL - baseTL` so
  digitization errors do not masquerade as physics;
- extract row-level topology, STC/Rw metric owner, band grid, material
  mapping, and internal-board coupling mapping;
- split eligible rows into calibration and holdout roles before any
  solver parameter fitting;
- keep the source metric policy explicit: NRC 2024 owns STC plus TL
  curves under ASTM E90, while local `Rw` must be computed from the
  digitized TL curve through the local ISO 717 helper and reported as a
  derived rating, not a quoted source value;
- reject digitized rows if axis calibration, curve identity, band-grid
  extraction, or per-band uncertainty cannot be bounded. Minimum
  acceptance for a graph-derived row is: exact source locator, figure
  id, curve id, calibrated x/y axis, one-third-octave band list,
  per-band TL vector, STC sanity check, digitization uncertainty note,
  and source topology object;
- keep NRC 1998 ordinary gypsum-board TL rows as baseline /
  negative-boundary rows unless the classifier finds a true internal
  leaf and two cavities;
- keep Uris 2006 qualitative unless full numeric curves and exact
  topology are available;
- keep runtime, support, confidence, evidence, route-card, output-card,
  proposal/report, API, and workbench input behavior frozen.

Implementation contract for Gate G2:

- create a typed source intake module for graph-derived rows rather than
  editing the solver directly;
- represent every digitized row as immutable data with:
  `sourceId`, `assemblyId`, `figureId`, `curveId`, `bandGridHz`,
  `transmissionLossDb`, `reportedStc`, `derivedRw`, `digitizationStatus`,
  `digitizationUncertaintyDb`, `topology`, `materialMapping`,
  `calibrationRole`, and `runtimeImportReadyNow`;
- first expected row families:
  - `nrc_2024_base_type_c_double_stud`: baseline only;
  - `nrc_2024_assembly_a_internal_board`: candidate;
  - `nrc_2024_assembly_b_internal_board`: candidate;
  - `nrc_2024_assembly_c_one_side_insulation`: candidate but separate
    cavity-fill regime;
  - `nrc_2024_assembly_d_internal_board`: candidate;
- require at least three usable internal-board rows before fitting any
  parameter and at least one holdout row before any runtime discussion;
- if fewer than three rows survive digitization QC, select a follow-up
  source acquisition gate rather than fitting the solver.

Exit condition: complete. Gate G2 created immutable graph-row intake
records for the Type C base wall and assemblies A-D. It did not fill
`transmissionLossDb`, `derivedRw`, or `digitizationUncertaintyDb`
because the PDF exposes Figure 4 / Figure 5 as plotted image data, not
source-owned numeric TL tables. Every row stays
`runtimeImportReadyNow: false`, and the live dynamic calculator still
returns the user split-rockwool repro as low-confidence
`multileaf_screening_blend` `Rw 41`.

### Gate G2B - Reproducible Curve Digitization QC

Next file:

`packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts`

Required behavior:

- render the NRC 2024 Figure 4 / Figure 5 graph regions at fixed
  resolution and record the exact render command or source asset hash;
- calibrate x/y axes from visible tick marks:
  - x-axis: `50` to `5000 Hz` one-third-octave bands;
  - Figure 4 y-axis: `0` to `90 dB`;
  - Figure 5 y-axis: `-20` to `5 dB`;
- digitize the Type C base curve and assemblies A-D into
  one-third-octave TL vectors;
- compute local derived `Rw` from each absolute Figure 4 TL vector using
  the existing ISO 717 helper, while preserving source-reported STC as
  `reportedStc`;
- cross-check Figure 5 deltas against `assemblyTL - baseTL` and reject
  any row whose delta mismatch exceeds the declared uncertainty;
- assign calibration/holdout roles only after QC passes;
- if graph quality, curve identity, or uncertainty is not bounded,
  leave rows blocked and select another source acquisition or manual
  review gate.

Exit condition: complete. Gate G2B records fixed 180 dpi render
provenance, locks Figure 4 / Figure 5 plot boxes, digitizes the Type C
base wall and assemblies A-D into one-third-octave TL vectors, computes
local derived Rw / STC, cross-checks Figure 5 deltas against
`assemblyTL - baseTL`, and declares `2 dB` digitization uncertainty.
Two internal-board rows are calibration rows, one internal-board row is
a holdout row, and Assembly C stays separate fill-regime context. Runtime
remains blocked and the selected next file is
`packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts`.

### Gate G3 - Calibration Fit and Negative-Boundary Proof

Landed in:

`packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts`

Calibration fit module:

`packages/engine/src/wall-triple-leaf-calibration-fit.ts`

Required behavior:

- fit only low-dimensional solver parameters that have physical meaning:
  cavity resonance depth/width adjustment, porous-fill damping
  multiplier, internal-leaf coupling penalty, and broad high-frequency
  offset;
- keep material/topology mapping in scope. NRC 2024 Type C gypsum,
  glass-fiber insulation, 18 gauge 92.1 mm steel studs, 610 mm spacing,
  and 25.4 mm internal-board spacing do not automatically cover local
  `mlv`, `rockwool`, or `gypsum_plaster`;
- prove calibration rows and holdout rows separately against Gate G
  tolerance: MAE <= 2 dB, max error <= 4 dB, and dip band within one
  neighboring one-third-octave band;
- prove negative boundaries: ordinary double leaf, simple stud without
  internal leaf, lined masonry / one-side lining, missing curve/topology,
  floor/impact, and field-only rows must not enter the source-calibrated
  triple-leaf lane;
- if fit passes only for NRC-like steel-stud internal-board walls, mark
  the solver as bounded to that source family and keep user stacks with
  MLV/plaster/rockwool outside exact promotion until mapping is owned.

Exit condition: complete. Gate G3 fits a low-dimensional NRC-like
source-family model from the Gate G2B QC curves: base Type C derived
`Rw 63`, single internal-board full-fill penalty `14 dB`, receiving
face second Type C board lift `9 dB`, second internal Type C board mass
lift `6 dB`, and low-frequency dip feature band `100 Hz`. Calibration
rows A/B and holdout row D pass Gate G tolerance with MAE `0 dB`, max
error `0 dB`, and max dip-band distance `0`; Assembly C remains
separate fill-regime context. Negative boundaries for ordinary
double-leaf, simple stud, lined masonry / one-side lining, missing
curve/topology, floor/impact, and field-only rows stay protected.
Runtime remains frozen because the pass is NRC-like source family only
and local `mlv`, `rockwool`, `gypsum_plaster`, visible tests, and
engine integration are not owned.

### Gate G4 - Local Material Mapping and Runtime Eligibility Decision

Next file:

`packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts`

Required behavior:

- decide whether local `rockwool` can be mapped to the NRC glass-fiber
  batt family for this source-calibrated solver, or block it;
- decide whether local `gypsum_board` is close enough to NRC 12.7 mm
  Type C gypsum board, or require a specific material/source mapping;
- keep local `mlv` and `gypsum_plaster` outside exact NRC-like runtime
  unless a bounded effect model or source row owns them;
- require grouped topology to match the source-family assumptions:
  two 92.1 mm-class cavities, full porous fill on both sides,
  internal Type C-like board count, double-stud/twin support, and
  explicit internal-leaf coupling;
- preserve all negative boundaries and the user split-rockwool repro as
  fail-closed if local mapping is incomplete;
- select Gate H only if source-family fit, local mapping, negative
  boundaries, and paired engine/web visible runtime tests are all named.

Exit condition: local mapping is either owned narrowly enough for a
source-family runtime candidate, or explicitly blocked with the next
source acquisition / UI diagnostic gate selected.

### Gate H - Engine Integration Fail-Closed

Integrate only after Gate G2B supplies executable source curves, Gate
G3 proves calibration / holdout / negative-boundary pass, and Gate G4
owns local material/topology mapping.

Runtime promotion requires:

- detected `multileaf_multicavity`;
- visible leaves >= 3 and cavity count >= 2;
- complete grouped `airborneContext.wallTopology`;
- source-calibrated solver pass;
- material mapping within owned corpus;
- negative-boundary checks clean.

If any condition fails, keep `multileaf_screening_blend` low confidence
and show missing-field / missing-source diagnostics.

### Gate I - Web-Visible Grouped Topology Inputs

Add workbench controls only after the engine contract is stable.

UI needs:

- Side A leaf group;
- cavity 1 depth/fill/absorption;
- internal leaf group;
- internal leaf coupling/bridge class;
- cavity 2 depth/fill/absorption;
- Side B leaf group;
- support topology;
- lab/field target policy;
- visible route-card, output-card, diagnostics, and proposal/report
  language.

Exit condition: web tests prove the user can express the PDF repro
without relying on ambiguous flat order.

### Gate J - Company-Internal Acceptance Rehearsal

Run a focused acceptance pack before declaring this family company-use
ready.

The pack must include:

- the two user PDF stacks;
- complete and missing grouped-topology cases;
- exact source rows;
- bounded near-source rows;
- double-leaf negatives;
- lined-masonry and one-side-lining negatives;
- many-layer and reorder hostile cases;
- lab `Rw`;
- field `R'w`;
- `DnT,w` with geometry/volume/RT60;
- PDF/report visibility.

Exit condition: triple-leaf can be classified as ready, caveated, or
blocked with no hidden precise-looking unsupported number.

## Frozen Surfaces

Until a later gate explicitly selects source-calibrated behavior
movement, these stay frozen:

- runtime numeric values;
- support status;
- confidence promotion;
- evidence tier;
- API shape;
- route-card values;
- output-card status;
- proposal/report copy;
- workbench input behavior.

## Validation

Gate A validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-a-contract.test.ts src/dynamic-airborne-order-sensitivity.test.ts --maxWorkers=1`
  green on 2026-04-30: 2 files / 7 tests.
- `git diff --check`
  clean on 2026-04-30.
- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding this Gate A file to the current
  runner: engine 162 files / 819 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate B focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-b-contract.test.ts src/wall-triple-leaf-accuracy-recovery-gate-a-contract.test.ts src/dynamic-airborne-order-sensitivity.test.ts --maxWorkers=1`
  green on 2026-04-30: 3 files / 13 tests.
- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate B to the current runner:
  engine 163 files / 825 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate C pre-edit validation completed:

- `pnpm calculator:gate:current`
  green on 2026-04-30 before Gate C edits: engine 163 files / 825
  tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.

Gate C focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-accuracy-recovery-gate-b-contract.test.ts src/wall-triple-leaf-accuracy-recovery-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30: 3 files / 14 tests.

Gate C current-gate validation completed:

- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate C to the current runner:
  engine 164 files / 829 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Second source-readiness iteration validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts --maxWorkers=1`
  green on 2026-04-30 after adding the Gate D source-priority contract:
  1 file / 5 tests.
- `pnpm calculator:gate:current`
  green on 2026-04-30 after the second source-readiness iteration:
  engine 164 files / 830 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check`
  clean on 2026-04-30.

Gate D focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts --maxWorkers=1`
  green on 2026-04-30: 1 file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts --maxWorkers=1`
  green on 2026-04-30 after preserving Gate C doc continuity: 2 files /
  11 tests.
- `pnpm --filter @dynecho/engine lint`
  green on 2026-04-30.

Gate D current-gate validation completed:

- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate D to the current runner:
  engine 165 files / 836 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate E focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts --maxWorkers=1`
  green on 2026-04-30 after preserving Gate D doc continuity: 2 files /
  12 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts --maxWorkers=1`
  green on 2026-04-30: 3 files / 17 tests.
- `pnpm --filter @dynecho/engine lint`
  green on 2026-04-30.

Gate E current-gate validation completed:

- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate E to the current runner:
  engine 166 files / 842 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate F focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-frequency-solver.test.ts --maxWorkers=1`
  green on 2026-04-30: 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts --maxWorkers=1`
  green on 2026-04-30: 4 files / 25 tests.
- `pnpm --filter @dynecho/engine lint`
  green on 2026-04-30.

Gate F current-gate validation completed:

- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate F to the current runner:
  engine 167 files / 850 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate G focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-calibration-regime.test.ts --maxWorkers=1`
  green on 2026-04-30: 1 file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts --maxWorkers=1`
  green on 2026-04-30 after preserving Gate F doc continuity: 5 files /
  31 tests.
- `pnpm --filter @dynecho/engine lint`
  green on 2026-04-30.

Gate G current-gate validation completed:

- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate G to the current runner:
  engine 168 files / 856 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate G2 focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-curve-digitization-intake.test.ts --maxWorkers=1`
  green on 2026-04-30: 1 file / 7 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts --maxWorkers=1`
  green on 2026-04-30 after preserving Gate G doc continuity: 6 files /
  38 tests.
- `pnpm --filter @dynecho/engine lint`
  green on 2026-04-30.

Gate G2 current-gate validation completed:

- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate G2 to the current runner:
  engine 169 files / 863 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate G2B focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-curve-digitization-qc.test.ts --maxWorkers=1`
  green on 2026-04-30: 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts --maxWorkers=1`
  green on 2026-04-30 after preserving Gate G2 doc continuity: 7 files /
  46 tests.
- `pnpm --filter @dynecho/engine lint`
  green on 2026-04-30.

Gate G2B current-gate validation completed:

- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate G2B to the current runner:
  engine 170 files / 871 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate G3 focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-calibration-fit-gate-g3.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts src/wall-triple-leaf-calibration-fit-gate-g3.test.ts --maxWorkers=1`
  green on 2026-05-01 after preserving Gate G2B doc continuity: 8 files
  / 54 tests.
- `pnpm --filter @dynecho/engine lint`
  green on 2026-05-01.

Gate G3 current-gate validation completed:

- `pnpm calculator:gate:current`
  green on 2026-05-01 after adding Gate G3 to the current runner:
  engine 171 files / 879 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
