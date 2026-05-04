# Checkpoint - 2026-05-01 - Wall Triple Leaf Accuracy Recovery Gate N

Slice:

`wall_triple_leaf_accuracy_recovery_v1`

Gate N status:

`gate_n_classified_rockwool_two_cavity_source_locators_no_runtime_selected_full_curve_retrieval_and_provenance_gate_o`

Selected next file:

`packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts`

## Summary

Gate N lands rockwool two-cavity source locator intake with no runtime
movement. It adds:

- `packages/engine/src/wall-triple-leaf-source-locator-intake.ts`
- `packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts`

The gate classifies source locators for
`rockwool_two_cavity_band_curve_source_pack` and keeps every runtime,
support, confidence, evidence, API, route-card, output-card,
proposal/report, and workbench-input behavior frozen.

## Locator Decision

Primary Gate O retrieval target:

- `uris_2006_internal_gypsum_50mm_mineral_wool_double_frame`
- source: Uris, Bravo, Gomez-Lozano, Ramirez, Llinares 2006, Applied
  Acoustics 67(9), 918-925, DOI `10.1016/j.apacoust.2005.11.006`
- URL: `https://www.sciencedirect.com/science/article/pii/S0003682X05001799`
- reason: the source reports measured sound reduction data for double
  frame partitions with an internal gypsum board layer, two 50 x 50 mm
  steel frames, 50 mm mineral wool in each frame, and a 100 mm air gap.
  This is the closest located row family for the user defect because it
  covers both local rockwool/mineral-wool absorber behavior and a
  50 mm-class two-cavity internal-board topology.
- blocker: full one-third-octave curves, exact material/support
  mapping, Rw/STC derivation, uncertainty, and negative-boundary proof
  are not in the local corpus yet.

Comparator retained:

- `nrc_2024_internal_board_glass_fiber_92mm_source_family`
- source: Mahn, Skoda, Cunha 2024, NRC internal-board double-stud paper
- URL:
  `https://nrc-publications.canada.ca/eng/view/accepted/?id=768bf32f-8313-435f-ab85-8680efba61b2`
- reason: Gate G2B/G3 already own reproducible graph digitization and
  source-family calibration for the NRC-like family.
- blocker: it is still adjacent for the user stack because it uses
  glass-fiber batt, 92.1 mm cavities, Type C board, and source-specific
  support topology rather than local 50 mm rockwool cavities.

Equivalence context only:

- `uris_1999_rockwool_bulk_density_double_wall`
  (`https://pascal-francis.inist.fr/vibad/index.php?action=getRecordDetail&idt=5805244`)
  remains useful for rockwool density / absorber-equivalence research
  but lacks an internal gypsum leaf.
- `wang_2022_lightweight_double_leaf_stone_wool_glass_wool`
  (`https://www.sciencedirect.com/science/article/pii/S0003682X2200281X`)
  remains useful as stone/glass-wool double-leaf context but lacks the
  internal-board triple-leaf topology.

Rejected for this lane:

- `nrc_1998_gypsum_board_walls_baseline_numeric_rows` remains parser
  and negative-boundary context only. It has numeric bands, but the
  representative rows are ordinary gypsum-board walls, not rockwool
  two-cavity internal-leaf rows.

## Runtime Posture

Runtime remains fail-closed:

- split-rockwool grouped stack: `multileaf_screening_blend`, `Rw 41`,
  low confidence;
- no support promotion;
- no confidence promotion;
- no evidence promotion;
- no route-card or output-card value/status movement;
- no proposal/report copy movement;
- no API or workbench input behavior movement.

Do not present `Rw 41` as fixed, correct, or source-validated. Gate N
only selects the next source retrieval / provenance step.

## Gate O Selection

Gate O should retrieve and QC the full source curves or prove they are
not available:

`packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts`

Gate O must keep runtime frozen unless it can name:

- full one-third-octave curves for the Uris 2006 double-frame and
  internal-board specimens;
- source provenance, page/figure/table locator, and extraction method;
- Rw/STC derivation and uncertainty owner;
- material/support topology mapping blockers;
- negative boundaries against fixed-penalty or near-source promotion.

## Validation

Focused Gate N validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-locator-intake-gate-n.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.

Continuity validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts src/wall-triple-leaf-source-gap-closure-gate-l.test.ts src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts --maxWorkers=1`
  green on 2026-05-01: 3 files / 21 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.
- `pnpm calculator:gate:current`
  green on 2026-05-01 after adding Gate N after Gate M: engine 182
  files / 953 tests, web 47 files / 227 passed + 18 skipped, build
  5/5 with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean. Runtime and visible behavior remain frozen.
